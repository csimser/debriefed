/**
 * Bullet translation service — browser port of the old /api/translate route.
 *
 * Pipeline: local term lookup → bundled-dictionary pre-translation →
 * Claude (user's key) for the final structured rewrite. The local crosswalk
 * provides occupation context; the live O*NET fallback is gone (the data
 * ships with the app).
 */
import { translateTerm } from '@/lib/debriefed-token-saver/termLookup'
import { getCivilianJobs } from '@/lib/debriefed-token-saver/jobCrosswalk'
import { dictionaryTranslate } from '@/lib/translation-engine'
import {
  callWithEscalation,
  getAnthropicClient,
  trackTokens,
  type ModelUsed,
} from '@/lib/ai/client'

const BASE_SYSTEM_PROMPT = `You are an expert military-to-civilian resume translator with 20+ years experience helping veterans transition to civilian careers.

Your translations follow these principles:

1. QUANTIFY EVERYTHING - Include numbers: personnel counts, dollar amounts, percentages
2. ELIMINATE ALL MILITARY JARGON - Replace every acronym with civilian equivalents
3. USE STRONG ACTION VERBS - Led, Managed, Directed, Implemented, Developed, Coordinated
4. HIGHLIGHT TRANSFERABLE SKILLS - Leadership, operations, training, safety, compliance
5. KEEP IT CONCISE - 1-2 lines maximum per bullet
6. MAINTAIN HONESTY - Never exaggerate, just translate accurately`

export interface TranslateContext {
  branch?: string
  rank?: string
  jobType?: string
  mos_rating?: string
}

export interface TranslateResult {
  original: string
  translated: string
  model_used?: ModelUsed
  source?: 'local' | 'ai' | 'ai_enhanced'
}

function parseStructured(rawText: string): { translated: string } {
  let jsonText = rawText.trim()
  if (jsonText.startsWith('```json')) jsonText = jsonText.slice(7)
  if (jsonText.startsWith('```')) jsonText = jsonText.slice(3)
  if (jsonText.endsWith('```')) jsonText = jsonText.slice(0, -3)
  jsonText = jsonText.trim()
  try {
    const parsed = JSON.parse(jsonText)
    if (parsed.translated_bullet) return { translated: parsed.translated_bullet }
  } catch {
    // fall through to raw text
  }
  return { translated: rawText.replace(/^["']|["']$/g, '').trim() }
}

/**
 * Translate a military bullet (or short term) to civilian language.
 * Mirrors the old POST /api/translate behavior, including the
 * `enhanceFromDictionary` mode used by the career-tools translator.
 */
export async function translateBullet(
  bullet: string,
  context?: TranslateContext,
  enhanceFromDictionary?: string,
): Promise<TranslateResult> {
  const trimmed = bullet.trim()
  if (!trimmed) throw new Error('Missing bullet text')

  // Enhancement mode: AI improves an existing dictionary translation
  if (enhanceFromDictionary) {
    const enhancePrompt = `Enhance this military-to-civilian resume bullet translation.

Original military bullet: ${trimmed}
Dictionary translation (use as starting point): ${enhanceFromDictionary}
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
      getAnthropicClient(),
      {
        max_tokens: 500,
        system: BASE_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: enhancePrompt }],
      },
      { expectsJson: true },
    )

    const rawText = (response.content[0] as { text: string }).text.trim()
    trackTokens((response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0))
    return {
      original: trimmed,
      translated: parseStructured(rawText).translated,
      model_used,
      source: 'ai_enhanced',
    }
  }

  // Single term/acronym: answer from local data without an AI call
  if (trimmed.split(/\s+/).length <= 3) {
    const localTranslation = translateTerm(trimmed)
    if (localTranslation) {
      return { original: trimmed, translated: localTranslation, source: 'local' }
    }
  }

  // Pre-translate full bullet using the shared engine (phrase-first + jargon + constants)
  const { translated: preTranslated, matchedTerms } = await dictionaryTranslate(trimmed)

  // Word-level lookups for AI context
  const knownTranslations: string[] = []
  for (const word of trimmed.split(/\s+/)) {
    const cleaned = word.replace(/[^a-zA-Z0-9/-]/g, '')
    if (cleaned.length >= 2) {
      const translation = translateTerm(cleaned)
      if (translation) knownTranslations.push(`${cleaned} = ${translation}`)
    }
  }
  for (const mt of matchedTerms) {
    const entry = `${mt.military} = ${mt.civilian}`
    if (!knownTranslations.includes(entry)) knownTranslations.push(entry)
  }
  const termContext =
    knownTranslations.length > 0
      ? `\nKnown term translations (use these): ${knownTranslations.join('; ')}\nPre-translated version: ${preTranslated}`
      : ''

  // Occupation context from the local crosswalk (bundled — no API)
  let onetContext = ''
  if (context?.mos_rating) {
    const mosCode = context.mos_rating.split(/[\s(]/)[0].trim()
    const branch = context?.branch || 'navy'
    const localResult = getCivilianJobs(mosCode, branch)
    if (localResult) {
      onetContext = `
Civilian Occupation Context (from local crosswalk):
- This military role maps to: ${localResult.civilian_titles.join(', ')}
- Relevant industries: ${localResult.industries?.join(', ') || 'Various'}
Use these civilian job titles as reference for appropriate terminology.`
    }
  }

  const prompt = `Translate this military bullet to civilian language.

Original: ${trimmed}
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
    getAnthropicClient(),
    {
      max_tokens: 500,
      system: BASE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    },
    { expectsJson: true },
  )

  const rawText = (response.content[0] as { text: string }).text.trim()
  trackTokens((response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0))

  return {
    original: trimmed,
    translated: parseStructured(rawText).translated,
    model_used,
    source: 'ai',
  }
}
