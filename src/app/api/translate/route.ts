import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getOccupationContext } from '@/lib/onet-api'
import { withAISecurity, secureSystemPrompt, logAPIUsage } from '@/lib/ai-endpoint-wrapper'
import { translateTerm } from '@/lib/debriefed-token-saver/termLookup'
import { getCivilianJobs } from '@/lib/debriefed-token-saver/jobCrosswalk'
import { callWithEscalation, getModelString } from '@/lib/ai-model'
import { captureTermPairs, type TermPair, type CaptureContext } from '@/lib/ai-translation-capture'
import { dictionaryTranslate } from '@/lib/translation-engine'

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
  enhance_from_dictionary?: string // When set, skip dictionary step and use AI to enhance this dictionary translation
}

export const POST = withAISecurity<TranslateInput>(
  { feature: 'bullet_translations', inputType: 'bullet_input' },
  async (request, input, ctx) => {
    const { bullet, context, enhance_from_dictionary } = input

    if (!bullet) {
      return NextResponse.json({ error: 'Missing bullet text' }, { status: 400 })
    }

    // Enhancement mode: skip dictionary, go straight to AI with dictionary result as context
    if (enhance_from_dictionary) {
      const enhancePrompt = `Enhance this military-to-civilian resume bullet translation.

Original military bullet: ${bullet}
Dictionary translation (use as starting point): ${enhance_from_dictionary}
Branch: ${context?.branch || 'military'}
Rank: ${context?.rank || ''}
Target: ${context?.jobType || 'private'} sector

The dictionary translation above is a decent start but may be too literal or miss context. Improve it by:
1. Making it more natural and professional-sounding
2. Ensuring ALL military jargon and acronyms are removed
3. Quantifying with specific numbers where possible
4. Starting with a strong action verb
5. Keeping to 1-2 lines maximum
6. Focusing on transferable skills and impact

Return JSON with this exact structure:
{
  "translated_bullet": "the improved civilian bullet",
  "translations": [
    { "military": "specific military term you changed", "civilian": "civilian equivalent you used" }
  ]
}
Only include terms you actually changed. Do not include terms that are already civilian. Return ONLY the JSON.`

      const { response, model_used } = await callWithEscalation(
        anthropic,
        {
          max_tokens: 500,
          system: secureSystemPrompt(BASE_SYSTEM_PROMPT),
          messages: [{ role: 'user', content: enhancePrompt }],
        },
        { expectsJson: true }
      )

      const rawText = (response.content[0] as { text: string }).text.trim()
      let translated = rawText
      let termPairs: TermPair[] = []

      try {
        let jsonText = rawText
        if (jsonText.startsWith('```json')) jsonText = jsonText.slice(7)
        if (jsonText.startsWith('```')) jsonText = jsonText.slice(3)
        if (jsonText.endsWith('```')) jsonText = jsonText.slice(0, -3)
        jsonText = jsonText.trim()

        const parsed = JSON.parse(jsonText)
        if (parsed.translated_bullet) translated = parsed.translated_bullet
        if (Array.isArray(parsed.translations)) termPairs = parsed.translations
      } catch {
        translated = rawText.replace(/^["']|["']$/g, '').trim()
      }

      const tokensUsed = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0)
      await logAPIUsage(ctx.userId, 'translate', tokensUsed, getModelString(model_used))

      const captureCtx: CaptureContext = {
        userId: ctx.userId,
        branch: context?.branch,
        targetIndustry: context?.jobType,
        modelUsed: model_used,
      }
      captureTermPairs('bullet_translation', termPairs, bullet, captureCtx)

      return NextResponse.json({
        original: bullet,
        translated,
        model_used,
        source: 'ai_enhanced',
      })
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

    // Pre-translate full bullet using shared engine (phrase-first + jargon + constants)
    const { translated: preTranslated, matchedTerms } = await dictionaryTranslate(trimmed)

    // Also do word-level lookup for AI context
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
    // Add matched terms from shared engine
    for (const mt of matchedTerms) {
      const entry = `${mt.military} = ${mt.civilian}`
      if (!knownTranslations.includes(entry)) {
        knownTranslations.push(entry)
      }
    }
    const termContext = knownTranslations.length > 0
      ? `\nKnown term translations (use these): ${knownTranslations.join('; ')}\nPre-translated version: ${preTranslated}`
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

Return JSON with this exact structure:
{
  "translated_bullet": "the full translated bullet",
  "translations": [
    { "military": "specific military term you changed", "civilian": "civilian equivalent you used" }
  ]
}
Only include terms you actually changed. Do not include terms that are already civilian. Return ONLY the JSON.`

    const { response, model_used } = await callWithEscalation(
      anthropic,
      {
        max_tokens: 500,
        system: secureSystemPrompt(BASE_SYSTEM_PROMPT),
        messages: [{ role: 'user', content: prompt }],
      },
      { expectsJson: true }
    )

    const rawText = (response.content[0] as { text: string }).text.trim()

    // Parse structured response
    let translated = rawText
    let termPairs: TermPair[] = []

    try {
      let jsonText = rawText
      if (jsonText.startsWith('```json')) jsonText = jsonText.slice(7)
      if (jsonText.startsWith('```')) jsonText = jsonText.slice(3)
      if (jsonText.endsWith('```')) jsonText = jsonText.slice(0, -3)
      jsonText = jsonText.trim()

      const parsed = JSON.parse(jsonText)
      if (parsed.translated_bullet) {
        translated = parsed.translated_bullet
      }
      if (Array.isArray(parsed.translations)) {
        termPairs = parsed.translations
      }
    } catch {
      // If JSON parse fails, use raw text as translated bullet (backward compatible)
      translated = rawText.replace(/^["']|["']$/g, '').trim()
    }

    // Track token usage
    const tokensUsed = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0)
    await logAPIUsage(ctx.userId, 'translate', tokensUsed, getModelString(model_used))

    // Non-blocking: capture term pairs for dictionary pipeline
    const captureCtx: CaptureContext = {
      userId: ctx.userId,
      branch: context?.branch,
      targetIndustry: context?.jobType,
      modelUsed: model_used,
    }
    captureTermPairs('bullet_translation', termPairs, bullet, captureCtx)

    return NextResponse.json({
      original: bullet,
      translated,
      model_used,
    })
  }
)
