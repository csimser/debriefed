import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { logApiUsage, incrementUsage } from '@/lib/usage-tracking'
import crypto from 'crypto'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Create cache key from LinkedIn data + target criteria
function createCacheKey(linkedInData: any, targetCriteria: any, isPro: boolean): string {
  const contentHash = crypto
    .createHash('md5')
    .update(JSON.stringify(linkedInData) + JSON.stringify(targetCriteria) + isPro)
    .digest('hex')
  return `linkedin_analysis:${contentHash}`
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

// Pre-calculate baseline scores based on content presence and quality
function calculateBaselineScores(linkedInData: any) {
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

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const { linkedInData, targetCriteria, isPro } = await request.json()

    if (!linkedInData || !targetCriteria) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 })
    }

    // Check cache first
    const cacheKey = createCacheKey(linkedInData, targetCriteria, isPro)
    const cached = analysisCache.get(cacheKey)
    if (cached && cached.expires > Date.now()) {
      console.log('LinkedIn analysis cache hit')
      return NextResponse.json({ analysis: cached.result, cached: true })
    }

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

    // Format experience data for the prompt
    const experienceText = linkedInData.experience?.map((exp: any, idx: number) => `
POSITION ${idx + 1}:
Title: ${exp.title || 'Unknown'}
Company: ${exp.company || 'Unknown'}
Dates: ${exp.dates || 'Unknown'}
Bullets:
${exp.bullets?.map((b: string, i: number) => `  ${i + 1}. ${b}`).join('\n') || '  No bullets found'}
`).join('\n---\n') || 'No experience found'

    // Format education data
    const educationText = linkedInData.education?.map((edu: any, idx: number) =>
      `${idx + 1}. ${edu.school || 'Unknown'} - ${edu.degree || 'Unknown'} ${edu.dates ? `(${edu.dates})` : ''}`
    ).join('\n') || 'No education found'

    const proPrompt = `You are a LinkedIn profile optimization expert for military veterans transitioning to civilian careers.

Analyze this LinkedIn profile and provide specific, actionable improvements.

PROFILE DATA:
Name: ${linkedInData.name || 'Not found'}
Headline: ${linkedInData.headline || 'Not found'}
Location: ${linkedInData.location || 'Not found'}

Summary/About:
${linkedInData.about || linkedInData.summary || 'Not found'}

Experience (${linkedInData.experience?.length || 0} positions):
${experienceText}

Education (${linkedInData.education?.length || 0} entries):
${educationText}

Current Skills (${linkedInData.skills?.length || 0}): ${linkedInData.skills?.join(', ') || 'None listed'}

Certifications (${linkedInData.certifications?.length || 0}): ${linkedInData.certifications?.join(', ') || 'None listed'}

TARGET:
- Role: ${targetCriteria.targetRole || 'Program Management / Operations'}
- Industry: ${targetCriteria.targetIndustry || 'Defense / Private Sector'}

SCORING GUIDELINES:
- Baseline scores (use as approximate minimums): Headline: ${baselineScores.headline}, About: ${baselineScores.about}, Experience: ${baselineScores.experience}, Skills: ${baselineScores.skills}
- Existing content should score 50+ unless actively harmful
- Score 60-80 for good content that could be optimized
- Score 80-100 only for excellent, well-optimized content

Respond with this exact JSON structure:
{
  "overallScore": <number 40-100>,
  "sections": {
    "headline": {
      "score": <number>,
      "current": "${(linkedInData.headline || 'No headline').replace(/"/g, '\\"').substring(0, 200)}",
      "suggested": "<improved headline max 220 chars>",
      "tips": ["<tip>", "<tip>", "<tip>"]
    },
    "about": {
      "score": <number>,
      "current": "${((linkedInData.about || linkedInData.summary || 'No summary').substring(0, 300)).replace(/"/g, '\\"')}",
      "suggested": "<complete rewritten About section 250-350 words - PRESERVE authentic voice and personality>",
      "tips": ["<tip>", "<tip>", "<tip>"]
    },
    "experience": {
      "score": <number>,
      "overallTips": [
        "<general tip for all experience sections>",
        "<another general tip>"
      ],
      "positions": [
        {
          "originalTitle": "<current job title>",
          "suggestedTitle": "<civilian-friendly title if needed, or same as original>",
          "company": "<company name>",
          "score": <number 0-100>,
          "disposition": "keep" | "enhance" | "condense" | "remove",
          "dispositionReason": "<why this recommendation - be specific>",
          "bullets": [
            {
              "original": "<original bullet text>",
              "score": <number 0-100>,
              "issues": ["<issue>"],
              "rewritten": "<improved bullet>"
            }
          ],
          "missingBullets": ["<suggested bullet to add>"]
        }
      ]
    },
    "certifications": {
      "score": <number>,
      "current": ${JSON.stringify(linkedInData.certifications?.slice(0, 10) || [])},
      "analysis": [
        {
          "name": "<certification name>",
          "relevance": "high" | "medium" | "low",
          "note": "<why relevant or not for target role>"
        }
      ],
      "recommended": ["<cert to pursue for target role>"],
      "tips": ["<tip about certifications>"]
    },
    "education": {
      "score": <number>,
      "entries": [
        {
          "school": "<school>",
          "degree": "<degree>",
          "relevance": "high" | "medium" | "low",
          "tip": "<how to better leverage this>"
        }
      ],
      "tips": ["<tip about education section>"]
    },
    "skills": {
      "score": <number>,
      "add": ["<skill>", "<skill>", "<skill>", "<skill>", "<skill>"],
      "remove": [],
      "reorder": ["<skill>", "<skill>", "<skill>"]
    },
    "keywords": {
      "missing": ["<keyword>", "<keyword>", "<keyword>"],
      "present": ["<keyword>", "<keyword>"]
    }
  },
  "quickWins": ["<quick win>", "<quick win>", "<quick win>"],
  "priorityActions": [
    {"action": "<action>", "impact": "high", "effort": "easy"},
    {"action": "<action>", "impact": "high", "effort": "medium"}
  ]
}

ABOUT SECTION REWRITE RULES:
- PRESERVE the candidate's authentic voice and personality
- Keep phrases that show character like "owning outcomes" or "decisions have consequences"
- Don't make it generic corporate speak - maintain their unique perspective
- Add quantified results but maintain the original tone
- Keep first-person voice throughout

EXPERIENCE ANALYSIS RULES:
1. Analyze ALL positions, including those with NO bullets
2. For positions with NO bullets:
   - Set score to 20-30
   - Recommend one of: add bullets (if recent/relevant), remove (if old/irrelevant), condense (if similar to other roles)
3. Position disposition recommendations:
   - "keep": Position is strong and relevant, minimal changes needed
   - "enhance": Position is relevant but needs better bullets/description
   - "condense": Combine with similar roles (e.g., multiple early Navy ranks into one entry)
   - "remove": Position hurts the profile (unrelated to target, no accomplishments, very old entry-level)
4. Flag positions that HURT the profile:
   - Unrelated roles (e.g., Security Guard when targeting PM roles)
   - Very old entry-level positions (10+ years ago) with no bullets
   - Roles that contradict the target positioning
5. INCLUDE and value side businesses/entrepreneurial ventures - these show ownership mentality
6. For very old positions (10+ years), recommend condensing to single line or removing

EXPERIENCE BULLET SCORING (0-100):
- Quantified results (numbers, percentages, dollar amounts) = +30 points
- Action verb at start = +15 points
- Civilian-friendly language (no military jargon) = +20 points
- Relevant to target role = +20 points
- Proper length (1-2 lines) = +15 points

BULLET ISSUES to identify:
- "military jargon" - terms civilians won't understand
- "not quantified" - missing numbers/metrics
- "weak verb" - starts with "Responsible for" or passive voice
- "too vague" - doesn't specify what was actually done
- "too long" - more than 2 lines
- "not relevant" - doesn't relate to target role

MILITARY TITLE TRANSLATIONS:
- "Senior Chief Petty Officer" → "Senior Operations Manager"
- "Program Evaluator" → "Program Quality Analyst"
- "Engineering Officer of the Watch" → "Shift Operations Manager"
- "Maintenance Material Manager" → "Maintenance Program Manager"
- "Machinery Repairman" → "Technical Operations Specialist"
- Keep civilian titles as-is

Return ONLY valid JSON.`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: isPro ? 6000 : 1500,
      messages: [{ role: 'user', content: isPro ? proPrompt : freePrompt }],
    })

    const analysisText = (response.content[0] as { text: string }).text

    let analysis
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse analysis JSON:', parseError)
      return NextResponse.json({ error: 'Failed to parse analysis' }, { status: 500 })
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

      if (isPro) {
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
    if (isPro) {
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
    analysis.isPro = isPro

    console.log('Final analysis scores:', {
      overall: analysis.overallScore,
      headline: analysis.sections?.headline?.score,
      about: analysis.sections?.about?.score,
      experience: analysis.sections?.experience?.score,
      skills: analysis.sections?.skills?.score,
    })

    // Track usage
    const tokensUsed = response.usage?.input_tokens + response.usage?.output_tokens || 6000
    await logApiUsage(user.id, 'analyze-linkedin', tokensUsed, 'claude-sonnet-4-20250514')
    await incrementUsage(user.id, 'ai_summaries')

    // Cache the result
    analysisCache.set(cacheKey, {
      result: analysis,
      expires: Date.now() + CACHE_TTL,
    })

    return NextResponse.json({ analysis })
  } catch (error: any) {
    console.error('LinkedIn analysis error:', error)
    return NextResponse.json({
      error: 'Analysis failed: ' + (error.message || 'Unknown error')
    }, { status: 500 })
  }
}
