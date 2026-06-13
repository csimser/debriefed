/**
 * LinkedIn AI services — browser ports of the old /api/generate-linkedin and
 * /api/analyze-linkedin routes.
 *
 * Generation makes two separate Claude calls (headline + about) with the
 * same prompts and post-processing as the server route. Analysis is
 * Haiku-only with baseline score pre-calculation, score enforcement, a JSON
 * repair fallback, and a module-level in-memory cache.
 */
import type Anthropic from '@anthropic-ai/sdk'
import { getCivilianJobs } from '@/lib/debriefed-token-saver/jobCrosswalk'
import { dictionaryTranslate } from '@/lib/translation-engine'
import { getProfile } from '@/lib/storage'
import {
  callWithEscalation,
  getAnthropicClient,
  trackTokens,
  PRIMARY_MODEL,
  type ModelUsed,
} from '@/lib/ai/client'

// ---------------------------------------------------------------------------
// generate-linkedin port
// ---------------------------------------------------------------------------

// Post-generation cleanup to catch AI patterns (preserves paragraph breaks)
function cleanLinkedInContent(text: string): string {
  let cleaned = text

  // Remove bullet points and their formatting
  cleaned = cleaned.replace(/^[\s]*[•\-\*]\s*/gm, '')

  // Remove common AI phrases
  const aiPhrases = [
    /I transform [^.]+\./gi,
    /results-driven/gi,
    /passionate about/gi,
    /leverage my/gi,
    /track record speaks/gi,
    /unique combination/gi,
    /proven ability to/gi,
    /I bring a unique/gi,
    /revolutionize/gi,
    /game-?changer/gi,
    /synergy/gi,
    /cutting-?edge/gi,
    /best-in-class/gi,
    /world-?class/gi,
    /I'd welcome the opportunity to/gi,
    /contribute to your organization's success/gi,
    /excited about the possibility/gi,
    /would be honored to/gi,
  ]

  aiPhrases.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '')
  })

  // Clean up double spaces (but preserve newlines)
  cleaned = cleaned.replace(/ {2,}/g, ' ')

  // Clean up spaces around newlines
  cleaned = cleaned.replace(/ *\n */g, '\n')

  // Remove any trailing incomplete sentences
  const trimmed = cleaned.trim()
  if (trimmed.endsWith(',') || trimmed.endsWith(' and') || trimmed.endsWith(' or')) {
    const lastPeriod = trimmed.lastIndexOf('.')
    if (lastPeriod > 0) {
      return trimmed.slice(0, lastPeriod + 1)
    }
  }

  return trimmed
}

// Ensure proper paragraph formatting
function formatAboutSection(text: string): string {
  // If already has paragraph breaks, clean them up
  if (text.includes('\n\n')) {
    return text
      .replace(/\n{3,}/g, '\n\n')  // Max 2 newlines
      .trim()
  }

  // If it's one long paragraph, try to split it intelligently
  const sentences = text.split(/(?<=[.!?])\s+/)

  if (sentences.length >= 6) {
    // Group into 3 paragraphs
    const para1 = sentences.slice(0, 2).join(' ')
    const para2 = sentences.slice(2, -2).join(' ')
    const para3 = sentences.slice(-2).join(' ')
    return `${para1}\n\n${para2}\n\n${para3}`
  }

  return text.trim()
}

export interface GenerateLinkedInInput {
  targetRole?: string
  userProfile?: {
    rank?: string | null
    years_of_service?: string | number | null
    branch?: string | null
  } | null
  experiences?: any[]
  skills?: string[]
  certifications?: any[]
  education?: any[]
  // Refinement options
  tone?: string
  aboutLength?: string
  emphasis?: string[]
  regenerateOnly?: 'headline' | 'about' | null
  /**
   * Optional dictionary-generated drafts. When provided, Claude is asked to
   * improve the draft rather than start from scratch.
   */
  baseline?: { headline?: string | null; about?: string | null }
}

export interface GenerateLinkedInResult {
  headline: string | null
  summary: string | null
  model_used: ModelUsed
}

export async function generateLinkedIn(
  input: GenerateLinkedInInput,
): Promise<GenerateLinkedInResult> {
  const anthropic = getAnthropicClient()
  const profile = getProfile()

  const {
    targetRole,
    userProfile,
    experiences,
    skills,
    certifications,
    education,
    // Refinement options
    tone = 'professional',
    aboutLength = 'standard',
    emphasis = [],
    regenerateOnly,
    baseline,
  } = input

  const rank = userProfile?.rank || 'Senior military leader'
  const years = userProfile?.years_of_service || '20'
  const branch = userProfile?.branch || profile?.branch || 'Military'

  // Build crosswalk context from local data (no AI call needed)
  let crosswalkContext = ''
  const mosCode = profile?.rating_mos
  if (mosCode) {
    const localResult = getCivilianJobs(mosCode, branch)
    if (localResult) {
      crosswalkContext = `- Civilian equivalent roles: ${localResult.civilian_titles.join(', ')}`
    }
  }

  // Extract certifications
  const certList = certifications?.map((c: any) => c.name || c).filter(Boolean) || []
  const certString = certList.length > 0 ? certList.join(', ') : 'None listed'

  // Extract education with full details
  const eduList = education?.map((e: any) => {
    const degreeType = e.degree_type === 'master' ? "Master's" :
                       e.degree_type === 'bachelor' ? "Bachelor's" :
                       e.degree_type === 'associate' ? "Associate's" :
                       e.degree_type || 'Degree'
    const field = e.field_of_study || ''
    return field ? `${degreeType} in ${field}` : degreeType
  }).filter(Boolean) || []
  const eduString = eduList.length > 0 ? eduList.join(', ') : 'Not specified'

  // Extract experience bullets and pre-translate with shared engine
  const rawBullets = experiences?.flatMap((exp: any) =>
    exp.bullets?.map((b: any) => b.translated_text || b.original_text) || []
  ) || []
  const experienceBullets = await Promise.all(
    rawBullets.map(async (b: string) => {
      const { translated } = await dictionaryTranslate(b)
      return translated
    })
  )

  const experienceCount = experiences?.length || 0
  const hasLimitedData = experienceCount < 2 || experienceBullets.length < 3

  // Format experience for prompt (with pre-translated bullets)
  let bulletIdx = 0
  const experienceText = experiences?.map((exp: any) => {
    const bulletTexts = exp.bullets?.map(() => {
      const t = experienceBullets[bulletIdx] || 'No specific achievements listed'
      bulletIdx++
      return t
    }) || []
    return `\n${exp.title || 'Role'} at ${exp.company || 'Organization'}:\n${bulletTexts.join('; ') || 'No specific achievements listed'}\n`
  }).join('\n') || 'Limited experience data'

  // Tone instructions
  const toneInstructions: Record<string, string> = {
    professional: 'Write in a polished, corporate-appropriate tone. Sound confident but not arrogant.',
    conversational: 'Write in a warm, approachable tone. Use contractions. Sound human and relatable.',
    bold: 'Write in a direct, confident tone. Short punchy sentences. No fluff. Get to the point.',
  }

  // Length instructions
  const lengthInstructions: Record<string, string> = {
    concise: 'Keep the About section under 150 words. Be brief and impactful. 3 short paragraphs.',
    standard: 'Target 200-250 words for the About section. 3 well-developed paragraphs.',
    detailed: 'Write a comprehensive About section of 300-350 words with more context. 3 substantial paragraphs.',
  }

  // Emphasis instructions
  const emphasisText = emphasis.length > 0
    ? `EMPHASIZE these aspects in the content: ${emphasis.join(', ')}`
    : ''

  let headline = ''
  let summary = ''
  let model_used: ModelUsed = 'haiku'

  // Generate headline if needed
  if (!regenerateOnly || regenerateOnly === 'headline') {
    const headlinePrompt = `Create a LinkedIn headline for someone targeting: ${targetRole}

THEIR DATA:
- Rank/Title: ${rank}
- Years: ${years} years experience
- Branch: ${branch}
${crosswalkContext ? crosswalkContext + '\n' : ''}- Certifications: ${certString}
- Education: ${eduString}
- Experience entries: ${experienceCount}

RULES:
- Max 220 characters
- Include their ACTUAL credentials (PMP, MBA, etc.) - don't skip these if they have them
- Include "Veteran" since they're transitioning
- NO made-up percentages or vague metrics like "100% success" or "driving results"
- NO buzzwords: "transforming", "driving", "passionate", "results-driven", "leveraging"
- Format: [Target Role] | [Real Credential if any] | [Specialty] | Veteran

${toneInstructions[tone] || ''}

GOOD EXAMPLES:
"Operations Manager | PMP | MBA | 20 Years Leading High-Stakes Programs | Military Veteran"
"Program Manager | PMP Certified | Process Improvement & Team Development | Navy Veteran"
"Senior Operations Leader | MBA | Building Teams That Deliver Under Pressure | Veteran"

BAD EXAMPLES (don't do this):
"Operations Leader | Driving 86% Improvements | 100% Success Rates | Transforming Organizations"
"Results-Driven Leader | Passionate About Excellence | Strategic Visionary"

Generate ONLY the headline, nothing else.${baseline?.headline ? `\n\nHere is a draft to improve: ${baseline.headline}` : ''}`

    const headlineResult = await callWithEscalation(
      anthropic,
      {
        max_tokens: 300,
        messages: [{ role: 'user', content: headlinePrompt }],
      },
      { expectsJson: false }
    )
    const headlineResponse = headlineResult.response
    if (headlineResult.model_used === 'sonnet') model_used = 'sonnet'

    // Track actual token usage from headline call
    trackTokens(
      (headlineResponse.usage?.input_tokens || 0) +
        (headlineResponse.usage?.output_tokens || 0),
    )

    headline = (headlineResponse.content[0] as { text: string }).text.trim()
    // Remove quotes if wrapped
    headline = headline.replace(/^["']|["']$/g, '')
    // Ensure max length
    if (headline.length > 220) {
      headline = headline.substring(0, 217) + '...'
    }
  }

  // Generate about section if needed
  if (!regenerateOnly || regenerateOnly === 'about') {
    const aboutPrompt = `Write a LinkedIn About section for someone targeting: ${targetRole}

THEIR DATA:
- Background: ${rank} with ${years} years in ${branch}
${crosswalkContext ? crosswalkContext + '\n' : ''}- Certifications: ${certString}
- Education: ${eduString}
- Skills: ${skills?.slice(0, 10).join(', ') || 'None listed'}

EXPERIENCE:
${experienceText}

NOTE: This person has ${experienceCount} experience entries in their profile.
${hasLimitedData ?
  'Since they have limited experience data entered, focus on their years of service, certifications, and skill areas rather than specific achievements. Do NOT make up statistics or achievements.' :
  'Use their actual achievements and metrics from the experience data above.'}

TONE: ${toneInstructions[tone] || toneInstructions.professional}
LENGTH: ${lengthInstructions[aboutLength] || lengthInstructions.standard}
${emphasisText}

FORMAT REQUIREMENT - USE EXACTLY THIS STRUCTURE WITH LINE BREAKS:

[Opening paragraph - 2-3 sentences about who you are and what you do. Don't start with "I am a..." - start with something specific about what you believe or do.]

[blank line]

[Middle paragraph - 3-4 sentences about your background, credentials, and key strengths. Naturally mention certifications and education if they have them.]

[blank line]

[Closing paragraph - 2-3 sentences about what you're looking for. End simply.]

CLOSING OPTIONS (pick one that fits the tone):
- "Open to connecting with operations leaders and hiring managers."
- "Let's talk."
- "Always happy to connect with fellow veterans and industry professionals."
- "Reach out if you're building a team that values execution over excuses."
- "Looking forward to my next challenge."

DO NOT USE these generic AI endings:
- "I'd welcome the opportunity to connect and discuss..."
- "...contribute to your organization's success"
- "...excited about the possibility of..."
- "...would be honored to..."

CRITICAL RULES:
- MUST have 3 distinct paragraphs separated by blank lines (use \\n\\n between paragraphs)
- NO BULLET POINTS - paragraphs only
- NO made-up statistics or vague percentages
- NO buzzwords: "transform", "leverage", "drive results", "passionate", "revolutionize"
- Sound like a real person wrote this, not AI
- Max 2,600 characters

Generate the About section with proper paragraph breaks.${baseline?.about ? `\n\nHere is a draft to improve: ${baseline.about}` : ''}`

    const aboutResult = await callWithEscalation(
      anthropic,
      {
        max_tokens: 1500,
        messages: [{ role: 'user', content: aboutPrompt }],
      },
      { expectsJson: false }
    )
    const aboutResponse = aboutResult.response
    if (aboutResult.model_used === 'sonnet') model_used = 'sonnet'

    // Track actual token usage from about call
    trackTokens(
      (aboutResponse.usage?.input_tokens || 0) +
        (aboutResponse.usage?.output_tokens || 0),
    )

    summary = (aboutResponse.content[0] as { text: string }).text.trim()
    // Remove quotes if wrapped
    summary = summary.replace(/^["']|["']$/g, '')
    // Clean AI patterns (but preserve newlines)
    summary = cleanLinkedInContent(summary)
    // Ensure paragraph formatting
    summary = formatAboutSection(summary)
    // Ensure max length
    if (summary.length > 2600) {
      // Cut at last complete sentence before limit
      const truncated = summary.substring(0, 2600)
      const lastPeriod = truncated.lastIndexOf('.')
      if (lastPeriod > 2000) {
        summary = truncated.substring(0, lastPeriod + 1)
      }
    }
  }

  return {
    headline: !regenerateOnly || regenerateOnly === 'headline' ? headline : null,
    summary: !regenerateOnly || regenerateOnly === 'about' ? summary : null,
    model_used,
  }
}

// ---------------------------------------------------------------------------
// analyze-linkedin port
// ---------------------------------------------------------------------------

// Create cache key from LinkedIn data + target criteria
function createCacheKey(linkedInData: any, targetCriteria: any, hasPaidAccess: boolean): string {
  return `linkedin_analysis:${JSON.stringify(linkedInData)}|${JSON.stringify(targetCriteria)}|${hasPaidAccess}`
}

// In-memory cache with TTL (12 hours)
const analysisCache = new Map<string, { result: any; expires: number }>()
const CACHE_TTL = 12 * 60 * 60 * 1000 // 12 hours

// Clean expired cache entries periodically
function cleanCache() {
  const now = Date.now()
  for (const [key, value] of analysisCache.entries()) {
    if (value.expires < now) {
      analysisCache.delete(key)
    }
  }
}
if (typeof setInterval !== 'undefined') {
  setInterval(cleanCache, 60 * 60 * 1000) // Clean every hour
}

// Pre-calculate baseline scores based on content presence and quality.
// Exported so the keyless analysis path can run the same heuristics standalone.
export function calculateBaselineScores(linkedInData: any) {
  const scores: any = {}

  // Headline score: 60-75 if exists, 0-20 if missing
  if (linkedInData.headline && linkedInData.headline.length > 10) {
    const headlineLength = linkedInData.headline.length
    // Longer headlines with keywords score higher
    scores.headline = headlineLength > 100 ? 75 : headlineLength > 50 ? 70 : 65
  } else {
    scores.headline = linkedInData.headline ? 40 : 15
  }

  // About/Summary score: based on length and content
  const about = linkedInData.about || linkedInData.summary || ''
  if (about.length > 200) {
    scores.about = about.length > 500 ? 75 : about.length > 300 ? 70 : 65
  } else if (about.length > 50) {
    scores.about = 50
  } else {
    scores.about = about.length > 0 ? 30 : 10
  }

  // Experience score: based on number of roles and bullet points
  const experience = linkedInData.experience || []
  if (experience.length > 3) {
    const hasBullets = experience.some((exp: any) => exp.bullets && exp.bullets.length > 0)
    scores.experience = hasBullets ? 75 : 65
  } else if (experience.length > 0) {
    scores.experience = 55
  } else {
    scores.experience = 20
  }

  // Skills score
  const skills = linkedInData.skills || []
  if (skills.length > 10) {
    scores.skills = 70
  } else if (skills.length > 5) {
    scores.skills = 60
  } else if (skills.length > 0) {
    scores.skills = 45
  } else {
    scores.skills = 15
  }

  return scores
}

export interface AnalyzeLinkedInInput {
  linkedInData: any
  targetCriteria: any
  /** All users get the full analysis now — kept because the analysis shape depends on it. */
  hasPaidAccess?: boolean
}

export interface AnalyzeLinkedInResult {
  analysis: any
  cached: boolean
  model_used?: string
}

export async function analyzeLinkedIn(
  input: AnalyzeLinkedInInput,
): Promise<AnalyzeLinkedInResult> {
  const { linkedInData, targetCriteria, hasPaidAccess = true } = input

  if (!linkedInData || !targetCriteria) {
    throw new Error('Missing required data')
  }

  // Check cache first
  const cacheKey = createCacheKey(linkedInData, targetCriteria, hasPaidAccess)
  const cached = analysisCache.get(cacheKey)
  if (cached && cached.expires > Date.now()) {
    console.log('LinkedIn analysis cache hit')
    return { analysis: cached.result, cached: true }
  }

  const anthropic = getAnthropicClient()

  // Pre-calculate baseline scores
  const baselineScores = calculateBaselineScores(linkedInData)

  console.log('LinkedIn data received:', {
    name: linkedInData.name,
    headlineLength: linkedInData.headline?.length,
    aboutLength: (linkedInData.about || linkedInData.summary)?.length,
    experienceCount: linkedInData.experience?.length,
    skillsCount: linkedInData.skills?.length,
  })
  console.log('Baseline scores:', baselineScores)

  // Different prompts for free vs pro
  const freePrompt = `Analyze this LinkedIn profile and provide improvement suggestions for the headline and about section ONLY.

CURRENT PROFILE:
Name: ${linkedInData.name || 'Unknown'}
Headline: ${linkedInData.headline || 'Not provided'}
About: ${linkedInData.about || linkedInData.summary || 'Not provided'}

TARGET:
Industry: ${targetCriteria.targetIndustry}
Target Role: ${targetCriteria.targetRole}
Career Level: ${targetCriteria.careerLevel}

SCORING GUIDELINES (IMPORTANT - follow these):
- If headline EXISTS and is reasonable, score should be 60-80 (not 0-40)
- If about/summary EXISTS and is substantial, score should be 60-80 (not 0-40)
- Score 0-30 ONLY if section is completely missing or just a few words
- Score 40-60 if section exists but needs significant improvement
- Score 60-80 if section is good but could be better optimized
- Score 80-100 only if section is already excellent for target role

Baseline scores based on content (use as minimum):
- Headline baseline: ${baselineScores.headline}
- About baseline: ${baselineScores.about}

Provide analysis in this exact JSON format:
{
  "overallScore": <number based on weighted average of section scores>,
  "sections": {
    "headline": {
      "score": <number - must be at least ${Math.max(baselineScores.headline - 10, 20)} if headline exists>,
      "current": "${(linkedInData.headline || 'No headline provided').replace(/"/g, '\\"').substring(0, 200)}",
      "suggested": "<improved headline optimized for target role, max 220 chars, include keywords>",
      "tips": ["<tip 1>", "<tip 2>", "<tip 3>"]
    },
    "about": {
      "score": <number - must be at least ${Math.max(baselineScores.about - 10, 15)} if about exists>,
      "current": "${((linkedInData.about || linkedInData.summary || 'No summary provided').substring(0, 300)).replace(/"/g, '\\"')}",
      "suggested": "<completely rewritten about section, 200-300 words, first person, compelling, optimized for target role>",
      "tips": ["<tip 1>", "<tip 2>", "<tip 3>"]
    }
  },
  "quickWins": [
    "<easy headline change>",
    "<easy about section improvement>"
  ]
}

Return ONLY valid JSON.`

  const paidPrompt = `You are a LinkedIn optimization expert for military veterans transitioning to civilian careers.

PROFILE:
Name: ${linkedInData.name || 'N/A'}
Headline: ${linkedInData.headline || 'N/A'}
About: ${(linkedInData.about || linkedInData.summary || 'N/A').substring(0, 500)}
Experience (${linkedInData.experience?.length || 0}): ${linkedInData.experience?.slice(0, 5).map((exp: any) => `${exp.title || '?'} @ ${exp.company || '?'}`).join('; ') || 'None'}
Skills (${linkedInData.skills?.length || 0}): ${linkedInData.skills?.slice(0, 15).join(', ') || 'None'}
Certs: ${linkedInData.certifications?.slice(0, 5).join(', ') || 'None'}
Education: ${linkedInData.education?.slice(0, 3).map((e: any) => `${e.degree || '?'} - ${e.school || '?'}`).join('; ') || 'None'}

TARGET: ${targetCriteria.targetRole || 'Operations'} in ${targetCriteria.targetIndustry || 'Private Sector'}

SCORING BASELINES (use as minimums): Headline: ${baselineScores.headline}, About: ${baselineScores.about}, Experience: ${baselineScores.experience}, Skills: ${baselineScores.skills}

Return ONLY this compact JSON:
{
  "overallScore": <40-100>,
  "sections": {
    "headline": {
      "score": <number>,
      "current": "${(linkedInData.headline || 'No headline').replace(/"/g, '\\"').substring(0, 200)}",
      "suggested": "<improved headline max 220 chars with civilian keywords>",
      "tips": ["<tip>", "<tip>", "<tip>"]
    },
    "about": {
      "score": <number>,
      "current": "${((linkedInData.about || linkedInData.summary || 'No summary').substring(0, 300)).replace(/"/g, '\\"')}",
      "suggested": "<rewritten About, 100-150 words, first person, preserve authentic voice>",
      "tips": ["<tip>", "<tip>", "<tip>"]
    },
    "experience": {
      "score": <number>,
      "overallTips": ["<tip>", "<tip>"],
      "positions": [
        {"originalTitle": "<title>", "suggestedTitle": "<civilian title>", "company": "<co>", "disposition": "keep|enhance|condense|remove"}
      ]
    },
    "skills": {
      "score": <number>,
      "add": ["<skill>", ...max 5],
      "remove": [...max 3],
      "missingKeywords": ["<keyword>", ...max 5]
    }
  },
  "quickWins": ["<win>", "<win>", "<win>"],
  "priorityActions": [
    {"action": "<text>", "impact": "high|medium", "effort": "easy|medium|hard"}
  ]
}

RULES:
- Max 5 positions in experience.positions (most recent/relevant only)
- Max 3 items per tips array, max 3 priorityActions, max 3 quickWins
- Translate military titles to civilian equivalents
- Keep suggested About to 100-150 words max
- No long explanations — short actionable phrases only
- Return ONLY valid JSON, no markdown`

  // Haiku only — no Sonnet escalation (speed + cost priority)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30_000)

  let response: Anthropic.Message
  try {
    response = await anthropic.messages.create(
      {
        model: PRIMARY_MODEL,
        max_tokens: 2000,
        messages: [{ role: 'user', content: hasPaidAccess ? paidPrompt : freePrompt }],
      },
      { signal: controller.signal }
    )
  } catch (err: any) {
    if (err.name === 'AbortError' || err.message?.includes('abort')) {
      throw new Error('Analysis timed out. Please try again.')
    }
    throw err
  } finally {
    clearTimeout(timeout)
  }

  trackTokens((response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0))

  const analysisText = (response.content[0] as { text: string }).text.trim()

  // Parse JSON from response, with repair for truncated output
  let analysis
  try {
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      analysis = JSON.parse(jsonMatch[0])
    } else {
      throw new Error('No JSON found in response')
    }
  } catch (parseError) {
    // JSON repair: truncate at last complete closing brace and retry
    try {
      const lastBrace = analysisText.lastIndexOf('}')
      if (lastBrace > 0) {
        const truncated = analysisText.substring(0, lastBrace + 1)
        const jsonMatch = truncated.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0])
          console.warn('[analyze-linkedin] Used JSON repair fallback — response was truncated')
        }
      }
    } catch { /* repair failed too */ }

    if (!analysis) {
      console.error('Failed to parse analysis JSON:', parseError)
      console.error('Raw response (last 500 chars):', analysisText.slice(-500))
      throw new Error('Failed to parse analysis')
    }
  }

  // Post-process: Ensure scores are reasonable based on content presence
  if (analysis.sections) {
    if (analysis.sections.headline && linkedInData.headline) {
      analysis.sections.headline.score = Math.max(
        analysis.sections.headline.score,
        baselineScores.headline - 15
      )
      // Ensure current field has actual content
      if (!analysis.sections.headline.current || analysis.sections.headline.current === 'No headline') {
        analysis.sections.headline.current = linkedInData.headline
      }
    }

    if (analysis.sections.about) {
      const aboutContent = linkedInData.about || linkedInData.summary
      if (aboutContent) {
        analysis.sections.about.score = Math.max(
          analysis.sections.about.score,
          baselineScores.about - 15
        )
        // Ensure current field has actual content
        if (!analysis.sections.about.current || analysis.sections.about.current === 'No summary') {
          analysis.sections.about.current = aboutContent.substring(0, 500)
        }
      }
    }

    if (hasPaidAccess) {
      if (analysis.sections.experience && linkedInData.experience?.length > 0) {
        analysis.sections.experience.score = Math.max(
          analysis.sections.experience.score,
          baselineScores.experience - 15
        )
      }

      if (analysis.sections.skills && linkedInData.skills?.length > 0) {
        analysis.sections.skills.score = Math.max(
          analysis.sections.skills.score,
          baselineScores.skills - 15
        )
      }
    }
  }

  // Recalculate overall score as weighted average
  const sections = analysis.sections
  if (hasPaidAccess) {
    const weights = { headline: 0.2, about: 0.3, experience: 0.3, skills: 0.2 }
    let totalWeight = 0
    let weightedSum = 0

    if (sections.headline?.score) {
      weightedSum += sections.headline.score * weights.headline
      totalWeight += weights.headline
    }
    if (sections.about?.score) {
      weightedSum += sections.about.score * weights.about
      totalWeight += weights.about
    }
    if (sections.experience?.score) {
      weightedSum += sections.experience.score * weights.experience
      totalWeight += weights.experience
    }
    if (sections.skills?.score) {
      weightedSum += sections.skills.score * weights.skills
      totalWeight += weights.skills
    }

    if (totalWeight > 0) {
      analysis.overallScore = Math.round(weightedSum / totalWeight)
    }
  } else {
    // Free tier: just headline and about
    const headlineScore = sections.headline?.score || 50
    const aboutScore = sections.about?.score || 50
    analysis.overallScore = Math.round((headlineScore * 0.4) + (aboutScore * 0.6))
  }

  // Add flag to indicate tier
  analysis.hasPaidAccess = hasPaidAccess

  console.log('Final analysis scores:', {
    overall: analysis.overallScore,
    headline: analysis.sections?.headline?.score,
    about: analysis.sections?.about?.score,
    experience: analysis.sections?.experience?.score,
    skills: analysis.sections?.skills?.score,
  })

  const hasValidAnalysis = analysis && analysis.overallScore !== undefined

  // Cache the result
  if (hasValidAnalysis) {
    analysisCache.set(cacheKey, {
      result: analysis,
      expires: Date.now() + CACHE_TTL,
    })
  }

  return { analysis, cached: false, model_used: 'haiku' }
}
