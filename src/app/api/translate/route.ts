import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getOccupationContext } from '@/lib/onet-api'
import { withAISecurity, secureSystemPrompt, logAPIUsage } from '@/lib/ai-endpoint-wrapper'
import { translateTerm } from '@/lib/debriefed-token-saver/termLookup'
import { getCivilianJobs } from '@/lib/debriefed-token-saver/jobCrosswalk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const BASE_SYSTEM_PROMPT = `You are an expert military-to-civilian resume translator with 20+ years experience helping veterans transition to civilian careers.

Your translations follow these principles:

1. QUANTIFY EVERYTHING - Include numbers: personnel counts, dollar amounts, percentages
2. ELIMINATE ALL MILITARY JARGON - Replace every acronym with civilian equivalents
3. USE STRONG ACTION VERBS - Led, Managed, Directed, Implemented, Developed, Coordinated
4. HIGHLIGHT TRANSFERABLE SKILLS - Leadership, operations, training, safety, compliance
5. KEEP IT CONCISE - 1-2 lines maximum per bullet
6. MAINTAIN HONESTY - Never exaggerate, just translate accurately`

interface TranslateInput {
  bullet: string
  context?: {
    branch?: string
    rank?: string
    jobType?: string
    mos_rating?: string
  }
}

export const POST = withAISecurity<TranslateInput>(
  { feature: 'bullet_translations', inputType: 'bullet_input' },
  async (request, input, ctx) => {
    const { bullet, context } = input

    if (!bullet) {
      return NextResponse.json({ error: 'Missing bullet text' }, { status: 400 })
    }

    // Check if input is a single military term/acronym (not a full bullet)
    // If so, return local translation immediately without AI call
    const trimmed = bullet.trim()
    if (trimmed.split(/\s+/).length <= 3) {
      const localTranslation = translateTerm(trimmed)
      if (localTranslation) {
        return NextResponse.json({
          original: bullet,
          translated: localTranslation,
          source: 'local',
        })
      }
    }

    // For full bullets, pre-translate known terms to provide context to AI
    const words = trimmed.split(/\s+/)
    const knownTranslations: string[] = []
    for (const word of words) {
      const cleaned = word.replace(/[^a-zA-Z0-9/-]/g, '')
      if (cleaned.length >= 2) {
        const translation = translateTerm(cleaned)
        if (translation) {
          knownTranslations.push(`${cleaned} = ${translation}`)
        }
      }
    }
    const termContext = knownTranslations.length > 0
      ? `\nKnown term translations (use these): ${knownTranslations.join('; ')}`
      : ''

    // Try local crosswalk data first, then fall back to O*NET API
    let onetContext = ''
    if (context?.mos_rating) {
      const mosCode = context.mos_rating.split(/[\s(]/)[0].trim()
      const branch = context?.branch || 'navy'

      // Check local crosswalk data first (no API call needed)
      const localResult = getCivilianJobs(mosCode, branch)
      if (localResult) {
        onetContext = `
Civilian Occupation Context (from local crosswalk):
- This military role maps to: ${localResult.civilian_titles.join(', ')}
- Relevant industries: ${localResult.industries?.join(', ') || 'Various'}
Use these civilian job titles as reference for appropriate terminology.`
      } else {
        // Fall back to O*NET API only if not found locally
        try {
          const occupationData = await getOccupationContext(mosCode, branch)
          if (occupationData && occupationData.civilianTitles.length > 0) {
            onetContext = `
Civilian Occupation Context (from O*NET):
- This military role maps to: ${occupationData.civilianTitles.join(', ')}
Use these civilian job titles as reference for appropriate terminology.`
          }
        } catch (error) {
          // Silently fail - O*NET enhancement is optional
          console.log('O*NET context fetch failed, proceeding without')
        }
      }
    }

    const prompt = `Translate this military bullet to civilian language.

Original: ${bullet}
Branch: ${context?.branch || 'military'}
Rank: ${context?.rank || ''}
Target: ${context?.jobType || 'private'} sector
${onetContext}${termContext}

Rules:
1. Remove ALL military jargon and acronyms
2. Quantify with specific numbers where possible
3. Start with a strong action verb
4. Keep to 1-2 lines maximum
5. Focus on transferable skills

Return ONLY the translated bullet point, nothing else.`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: secureSystemPrompt(BASE_SYSTEM_PROMPT),
      messages: [{ role: 'user', content: prompt }],
    })

    const translated = (response.content[0] as { text: string }).text.trim()

    // Track token usage
    const tokensUsed = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0)
    await logAPIUsage(ctx.userId, 'translate', tokensUsed, 'claude-sonnet-4-20250514')

    return NextResponse.json({
      original: bullet,
      translated,
    })
  }
)
