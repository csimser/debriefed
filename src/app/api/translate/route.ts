import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getOccupationContext } from '@/lib/onet-api'
import { withAISecurity, secureSystemPrompt } from '@/lib/ai-endpoint-wrapper'

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

    // Try to get O*NET occupation context for better translation
    let onetContext = ''
    if (context?.mos_rating) {
      try {
        const mosCode = context.mos_rating.split(/[\s(]/)[0].trim()
        const branch = context?.branch || 'navy'
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

    const prompt = `Translate this military bullet to civilian language.

Original: ${bullet}
Branch: ${context?.branch || 'military'}
Rank: ${context?.rank || ''}
Target: ${context?.jobType || 'private'} sector
${onetContext}

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

    return NextResponse.json({
      original: bullet,
      translated,
    })
  }
)
