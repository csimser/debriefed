import { NextRequest, NextResponse, after } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { logApiUsage } from '@/lib/usage-tracking'
import { canUseFeature, incrementUsage, isAdmin, getUserEmail } from '@/lib/usage-service'
import { PRIMARY_MODEL } from '@/lib/ai-model'
import crypto from 'crypto'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Create cache key from LinkedIn data + target criteria
function createCacheKey(linkedInData: any, targetCriteria: any, hasPaidAccess: boolean): string {
  const contentHash = crypto
    .createHash('md5')
    .update(JSON.stringify(linkedInData) + JSON.stringify(targetCriteria) + hasPaidAccess)
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

    // Check usage limit (skip for admins)
    const userEmail = await getUserEmail(user.id)
    if (!isAdmin(userEmail)) {
      const usageCheck = await canUseFeature(user.id, 'linkedin_profile_analysis')
      if (!usageCheck.allowed) {
        return NextResponse.json({
          error: usageCheck.reason || 'LinkedIn analysis limit reached. Upgrade your plan for more.',
          limitReached: true,
        }, { status: 403 })
      }
    }

    const { linkedInData, targetCriteria, hasPaidAccess } = await request.json()

    // If requesting paid recommendations, enforce linkedin_recommendations limit
    if (hasPaidAccess && !isAdmin(userEmail)) {
      const recoCheck = await canUseFeature(user.id, 'linkedin_recommendations')
      if (!recoCheck.allowed) {
        return NextResponse.json({
          error: recoCheck.reason || 'LinkedIn recommendations limit reached. Upgrade your plan for more.',
          limitReached: true,
        }, { status: 403 })
      }
    }

    if (!linkedInData || !targetCriteria) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 })
    }

    // Check cache first
    const cacheKey = createCacheKey(linkedInData, targetCriteria, hasPaidAccess)
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
        return NextResponse.json(
          { error: 'Analysis timed out. Please try again.' },
          { status: 504 }
        )
      }
      throw err
    } finally {
      clearTimeout(timeout)
    }

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
        return NextResponse.json({ error: 'Failed to parse analysis' }, { status: 500 })
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

    const tokensUsed = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0) || 2000
    const hasValidAnalysis = analysis && analysis.overallScore !== undefined

    // Cache the result
    if (hasValidAnalysis) {
      analysisCache.set(cacheKey, {
        result: analysis,
        expires: Date.now() + CACHE_TTL,
      })
    }

    // Return response to client first, then track usage
    const jsonResponse = NextResponse.json({ analysis, model_used: 'haiku' })

    after(async () => {
      try {
        await logApiUsage(user.id, 'analyze-linkedin', tokensUsed, PRIMARY_MODEL)
        if (hasValidAnalysis) {
          await incrementUsage(user.id, 'linkedin_profile_analysis')
          if (hasPaidAccess) {
            await incrementUsage(user.id, 'linkedin_recommendations')
          }
        }
      } catch (err) {
        console.error('Post-response usage tracking failed:', err)
      }
    })

    return jsonResponse
  } catch (error: any) {
    console.error('LinkedIn analysis error:', error)
    return NextResponse.json({
      error: 'Analysis failed. Please try again.'
    }, { status: 500 })
  }
}
