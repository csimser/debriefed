/**
 * Shared Military-to-Civilian Translation Engine
 *
 * Single translation pipeline used by ALL features:
 *   1. Phrase-first matching (dict_phrase_translations from Supabase)
 *   2. Term matching (dict_military_jargon from Supabase)
 *   3. Fallback to MILITARY_TO_CIVILIAN static constants
 *   4. Claude polish pass (content-type-aware)
 *
 * Returns both the rough dictionary translation AND the polished version.
 */

import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/admin'
import { PRIMARY_MODEL, type ModelUsed } from '@/lib/ai-model'
import { secureSystemPrompt, logAPIUsage } from '@/lib/ai-endpoint-wrapper'
import { MILITARY_TO_CIVILIAN } from '@/lib/constants/military-dictionary'

// ── Types ─────────────────────────────────────────────────────────

export type ContentType = 'bullet' | 'summary' | 'linkedin' | 'cover-letter' | 'job-match' | 'eval'

export interface TranslationResult {
  /** Original input text */
  original: string
  /** Dictionary-only translation (Layer 1) */
  dictionaryTranslation: string
  /** Claude-polished translation (Layer 2), null if polish was skipped */
  polished: string | null
  /** Which model was used for polishing */
  modelUsed: ModelUsed | null
  /** Terms that were matched by the dictionary */
  matchedTerms: { military: string; civilian: string }[]
  /** Tokens consumed by the polish pass */
  tokensUsed: number
}

export interface TranslationOptions {
  /** Skip the Claude polish pass (return dictionary-only) */
  skipPolish?: boolean
  /** User ID for usage logging */
  userId?: string
  /** Target industry (defense/government may allow military terms) */
  targetIndustry?: string
  /** Additional context to include in the polish prompt */
  additionalContext?: string
}

// ── Supabase dictionary cache ─────────────────────────────────────

interface PhraseEntry { military_phrase: string; civilian_phrase: string }
interface JargonEntry { military_term: string; civilian_equivalent: string }

let cachedPhrases: PhraseEntry[] | null = null
let cachedJargon: JargonEntry[] | null = null
let cacheTimestamp = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

async function loadDictionaryFromDB(): Promise<{ phrases: PhraseEntry[]; jargon: JargonEntry[] }> {
  const now = Date.now()
  if (cachedPhrases && cachedJargon && now - cacheTimestamp < CACHE_TTL) {
    return { phrases: cachedPhrases, jargon: cachedJargon }
  }

  const supabase = createAdminClient()

  const [phrasesRes, jargonRes] = await Promise.all([
    supabase
      .from('dict_phrase_translations')
      .select('military_phrase, civilian_phrase')
      .order('military_phrase'),
    supabase
      .from('dict_military_jargon')
      .select('military_term, civilian_equivalent')
      .order('military_term'),
  ])

  cachedPhrases = (phrasesRes.data || []) as PhraseEntry[]
  cachedJargon = (jargonRes.data || []) as JargonEntry[]
  cacheTimestamp = now

  return { phrases: cachedPhrases, jargon: cachedJargon }
}

// ── Helpers ───────────────────────────────────────────────────────

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function firstOption(text: string): string {
  return text.split(' / ')[0].trim()
}

function matchCase(original: string, replacement: string): string {
  if (!original || !replacement) return replacement
  if (original === original.toUpperCase() && original.length > 1) {
    return replacement.toUpperCase()
  }
  if (original[0] === original[0].toUpperCase() && original.slice(1) !== original.slice(1).toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1)
  }
  if (original === original.toLowerCase()) {
    return replacement.toLowerCase()
  }
  return replacement
}

function postProcess(text: string): string {
  let out = text
  out = out.replace(/  +/g, ' ')
  out = out.replace(/\ba (a|e|i|o|u)/gi, (_match, vowel) => {
    const aWord = _match[0] === 'A' ? 'An' : 'an'
    return `${aWord} ${vowel}`
  })
  out = out.replace(/\ban ([bcdfghjklmnpqrstvwxyz])/gi, (_match, consonant) => {
    const aWord = _match[0] === 'A' ? 'A' : 'a'
    return `${aWord} ${consonant}`
  })
  out = out.replace(/ 's\b/g, "'s")
  out = out.replace(/,\s*,/g, ',')
  out = out.replace(/\.\s*\./g, '.')
  out = out.replace(/\s+([.,;:!?])/g, '$1')
  return out.trim()
}

// ── Layer 1: Dictionary Translation ───────────────────────────────

/**
 * Three-tier dictionary replacement:
 *   1. dict_phrase_translations (Supabase, longest-first)
 *   2. dict_military_jargon (Supabase, longest-first)
 *   3. MILITARY_TO_CIVILIAN static constants (longest-first)
 *
 * Each tier only replaces text not already claimed by a prior tier.
 */
export async function dictionaryTranslate(
  input: string
): Promise<{ translated: string; matchedTerms: { military: string; civilian: string }[] }> {
  const matchedTerms: { military: string; civilian: string }[] = []
  const occupied = new Set<number>()

  function applyReplacements(
    text: string,
    entries: { key: string; civilian: string }[]
  ): string {
    // Sort longest first
    const sorted = [...entries].sort((a, b) => b.key.length - a.key.length)
    const matches: { start: number; end: number; original: string; civilian: string }[] = []

    for (const entry of sorted) {
      const regex = new RegExp(`\\b${escapeRegex(entry.key)}\\b`, 'gi')
      let m: RegExpExecArray | null
      while ((m = regex.exec(text)) !== null) {
        const start = m.index
        const end = start + m[0].length
        let overlap = false
        for (let i = start; i < end; i++) {
          if (occupied.has(i)) { overlap = true; break }
        }
        if (overlap) continue
        for (let i = start; i < end; i++) occupied.add(i)

        const civ = firstOption(entry.civilian)
        matches.push({ start, end, original: m[0], civilian: civ })
        matchedTerms.push({ military: m[0], civilian: civ })
      }
    }

    // Sort by position and build output
    matches.sort((a, b) => a.start - b.start)
    let result = ''
    let cursor = 0
    for (const match of matches) {
      result += text.slice(cursor, match.start)
      result += matchCase(match.original, match.civilian)
      cursor = match.end
    }
    result += text.slice(cursor)
    return result
  }

  let result = input

  // Load DB dictionaries
  let phrases: PhraseEntry[] = []
  let jargon: JargonEntry[] = []
  try {
    const db = await loadDictionaryFromDB()
    phrases = db.phrases
    jargon = db.jargon
  } catch (err) {
    console.error('[translation-engine] Failed to load DB dictionaries, using constants only:', err)
  }

  // Tier 1: Phrase translations (from Supabase)
  if (phrases.length > 0) {
    const phraseEntries = phrases
      .filter(p => p.military_phrase && p.civilian_phrase)
      .map(p => ({ key: p.military_phrase, civilian: p.civilian_phrase }))
    result = applyReplacements(result, phraseEntries)
  }

  // Tier 2: Military jargon terms (from Supabase)
  if (jargon.length > 0) {
    const jargonEntries = jargon
      .filter(j => j.military_term && j.civilian_equivalent)
      .map(j => ({ key: j.military_term, civilian: j.civilian_equivalent }))
    result = applyReplacements(result, jargonEntries)
  }

  // Tier 3: Static constants fallback
  const constantEntries = Object.entries(MILITARY_TO_CIVILIAN).map(([key, civ]) => ({
    key,
    civilian: civ,
  }))
  result = applyReplacements(result, constantEntries)

  // Post-process
  result = postProcess(result)

  return { translated: result, matchedTerms }
}

// ── Layer 2: Claude Polish Pass ───────────────────────────────────

const POLISH_SYSTEM_PROMPT = `You are a military-to-civilian resume translator. You will receive military text that has been pre-translated using a dictionary. Your job is to rewrite it as polished civilian professional language. Rules: Do not add information not in the original. Do not embellish or invent metrics. Use strong action verbs. Write in past tense for experience bullets, present tense for summaries and LinkedIn. Output only the rewritten text with no explanation or preamble.`

function buildPolishUserMessage(
  contentType: ContentType,
  original: string,
  dictionaryTranslation: string,
  additionalContext?: string
): string {
  const typeLabel: Record<ContentType, string> = {
    'bullet': 'Resume experience bullet',
    'summary': 'Professional summary',
    'linkedin': 'LinkedIn profile content',
    'cover-letter': 'Cover letter paragraph',
    'job-match': 'Job match analysis',
    'eval': 'Performance evaluation bullet',
  }

  const toneGuidance: Record<ContentType, string> = {
    'bullet': 'Keep to 1-2 sentences. Start with a strong action verb. Past tense.',
    'summary': '3-5 sentences, narrative tone. Present tense. Third person optional.',
    'linkedin': 'Conversational but professional. First person. Present tense.',
    'cover-letter': 'Formal. First person. Paragraph form.',
    'job-match': 'Analytical. Third person. Objective assessment.',
    'eval': 'Keep to 1-2 sentences. Strong action verbs. Past tense. Quantify where numbers exist.',
  }

  let msg = `Content type: ${typeLabel[contentType] || contentType}\n`
  msg += `Tone: ${toneGuidance[contentType] || 'Professional'}\n`
  msg += `Original military text: ${original}\n`
  msg += `Pre-translated version: ${dictionaryTranslation}\n`
  if (additionalContext) {
    msg += `Additional context: ${additionalContext}\n`
  }
  msg += `\nRewrite as polished civilian professional language.`

  return msg
}

// ── Main Entry Point ──────────────────────────────────────────────

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * Full two-layer translation pipeline.
 *
 * @param input - Military text to translate
 * @param contentType - What kind of content this is (affects tone/tense)
 * @param userBranch - Optional military branch for context
 * @param options - Additional options (skipPolish, userId, etc.)
 */
export async function translateMilitaryText(
  input: string,
  contentType: ContentType,
  userBranch?: string,
  options: TranslationOptions = {}
): Promise<TranslationResult> {
  const trimmed = input.trim()
  if (!trimmed) {
    return {
      original: input,
      dictionaryTranslation: input,
      polished: null,
      modelUsed: null,
      matchedTerms: [],
      tokensUsed: 0,
    }
  }

  // Layer 1: Dictionary translation
  const { translated: dictResult, matchedTerms } = await dictionaryTranslate(trimmed)

  // If no terms were matched and polish is not needed, return as-is
  if (matchedTerms.length === 0 && options.skipPolish) {
    return {
      original: trimmed,
      dictionaryTranslation: dictResult,
      polished: null,
      modelUsed: null,
      matchedTerms,
      tokensUsed: 0,
    }
  }

  // Skip polish if requested
  if (options.skipPolish) {
    return {
      original: trimmed,
      dictionaryTranslation: dictResult,
      polished: null,
      modelUsed: null,
      matchedTerms,
      tokensUsed: 0,
    }
  }

  // Layer 2: Claude polish pass
  let polished: string | null = null
  let modelUsed: ModelUsed | null = null
  let tokensUsed = 0

  try {
    const additionalParts: string[] = []
    if (userBranch) additionalParts.push(`Military branch: ${userBranch}`)
    if (options.targetIndustry) additionalParts.push(`Target industry: ${options.targetIndustry}`)
    if (options.additionalContext) additionalParts.push(options.additionalContext)

    const userMessage = buildPolishUserMessage(
      contentType,
      trimmed,
      dictResult,
      additionalParts.length > 0 ? additionalParts.join('. ') : undefined
    )

    // Always use Haiku for polish — simple rewrite, no escalation needed
    const response = await anthropic.messages.create({
      model: PRIMARY_MODEL,
      max_tokens: 1024,
      system: secureSystemPrompt(POLISH_SYSTEM_PROMPT),
      messages: [{ role: 'user', content: userMessage }],
    })

    const textBlock = response.content[0]
    const rawText = textBlock?.type === 'text' ? textBlock.text : ''
    polished = rawText.trim()
    modelUsed = 'haiku' as ModelUsed
    tokensUsed = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0)

    // Validate output — if Claude returns garbage, fall back to dictionary
    if (!polished || polished.length < 10) {
      polished = null
    }

    // Log usage if userId provided
    if (options.userId && tokensUsed > 0) {
      await logAPIUsage(options.userId, `translation_polish_${contentType}`, tokensUsed, PRIMARY_MODEL)
    }
  } catch (err) {
    console.error('[translation-engine] Polish pass failed, returning dictionary-only:', err)
    polished = null
  }

  return {
    original: trimmed,
    dictionaryTranslation: dictResult,
    polished,
    modelUsed,
    matchedTerms,
    tokensUsed,
  }
}

/**
 * Dictionary-only translation (no AI call). Useful for:
 * - Landing page demo
 * - Quick previews
 * - Fallback when AI is unavailable
 */
export async function translateDictionaryOnly(
  input: string
): Promise<{ translated: string; matchedTerms: { military: string; civilian: string }[] }> {
  return dictionaryTranslate(input.trim())
}
