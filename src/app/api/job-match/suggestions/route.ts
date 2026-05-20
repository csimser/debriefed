import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { PRIMARY_MODEL } from '@/lib/ai-model'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { resumeContent, jobPosting, gaps } = await request.json()

    if (!resumeContent || !jobPosting?.description) {
      return NextResponse.json({ error: 'Missing resume or job description' }, { status: 400 })
    }

    // Build resume text (compact — only experiences and skills)
    const resumeText = buildCompactResumeText(resumeContent)

    // Build gap context so AI knows what to focus on
    const gapContext = (gaps || [])
      .slice(0, 5)
      .map((g: any) => `- ${g.description}`)
      .join('\n')

    const prompt = `Given this resume and job posting, suggest bullet rewrites and skill changes to improve the match.

=== RESUME ===
${resumeText}

=== JOB POSTING ===
Title: ${jobPosting.title || 'Not specified'}
Description:
${jobPosting.description}

${gapContext ? `=== KEY GAPS TO ADDRESS ===\n${gapContext}\n` : ''}
=== INSTRUCTIONS ===
1. Suggest up to 5 bullet rewrites that would improve the match score
2. Suggest skill changes (add/highlight/remove)
3. NEVER fabricate experience — only reframe existing bullets with better keywords
4. Use keywords from THIS job description, not generic terms
5. Be concise

Return ONLY valid JSON:
{
  "bulletSuggestions": [
    {
      "experienceIndex": 0,
      "bulletIndex": 0,
      "original": "original bullet text",
      "suggested": "improved bullet with job keywords",
      "keywordsAdded": ["keyword1"],
      "action": "rewrite",
      "priority": "high",
      "estimatedImpact": "+1-2%"
    }
  ],
  "skillChanges": {
    "add": ["skill candidate actually has but isn't listed"],
    "highlight": ["existing skill to emphasize"],
    "remove": ["irrelevant skill"]
  }
}`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 20_000)

    let response: Anthropic.Message
    try {
      response = await anthropic.messages.create(
        {
          model: PRIMARY_MODEL,
          max_tokens: 2048,
          messages: [{ role: 'user', content: prompt }],
        },
        { signal: controller.signal }
      )
    } catch (err: any) {
      if (err.name === 'AbortError' || err.message?.includes('abort')) {
        return NextResponse.json(
          { error: 'Suggestions request timed out' },
          { status: 504 }
        )
      }
      throw err
    } finally {
      clearTimeout(timeout)
    }

    const text = (response.content[0] as { text: string }).text.trim()

    // Parse JSON with repair fallback
    let result
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found')
      }
    } catch {
      try {
        const lastBrace = text.lastIndexOf('}')
        if (lastBrace > 0) {
          const truncated = text.substring(0, lastBrace + 1)
          const jsonMatch = truncated.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            result = JSON.parse(jsonMatch[0])
            console.warn('[job-match/suggestions] Used JSON repair fallback')
          }
        }
      } catch { /* repair failed */ }

      if (!result) {
        console.error('[job-match/suggestions] JSON parse failed')
        return NextResponse.json({ error: 'Failed to parse suggestions' }, { status: 500 })
      }
    }

    return NextResponse.json({
      bulletSuggestions: result.bulletSuggestions || [],
      skillChanges: result.skillChanges || { add: [], highlight: [], remove: [] },
    })
  } catch (err) {
    console.error('[job-match/suggestions] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

function buildCompactResumeText(content: any): string {
  const parts: string[] = []

  if (content.experiences?.length > 0) {
    parts.push('EXPERIENCE:')
    content.experiences.forEach((exp: any, expIdx: number) => {
      parts.push(`[Experience ${expIdx}] ${exp.civilian_title || exp.job_title} at ${exp.organization}`)
      exp.bullets?.forEach((bullet: any, bulletIdx: number) => {
        parts.push(`[Bullet ${bulletIdx}] ${bullet.translated_text || bullet.original_text}`)
      })
    })
  }

  if (content.skills?.length > 0) {
    parts.push('\nSKILLS: ' + content.skills.map((s: any) => s.name).join(', '))
  }

  return parts.join('\n')
}
