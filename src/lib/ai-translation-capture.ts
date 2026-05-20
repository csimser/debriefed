/**
 * AI Translation Capture Pipeline
 *
 * Non-blocking utility that captures AI-generated term translations
 * for admin review and eventual dictionary insertion.
 *
 * All operations are fire-and-forget — they never slow down the user.
 */

import { createClient as createAdminClient } from '@supabase/supabase-js'

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─── PII Stripping ─────────────────────────────────────────────────────────

export function stripPII(text: string): string {
  if (!text) return ''
  return text
    .replace(/\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g, '[REDACTED]')                              // SSN
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[REDACTED]')           // email
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[REDACTED]')                                  // phone
    .replace(/\b\d{10}\b/g, '[REDACTED]')                                                      // DOD ID
    .replace(/\b(born|DOB|dob|Date of Birth|D\.O\.B)[:\s]*\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b/gi, '') // DOB
    .trim()
}

// ─── Auto-categorize which dictionary table a term belongs in ───────────────

export function suggestDictTable(term: string): string {
  const words = term.trim().split(/\s+/)
  // Single word, all caps, short = acronym
  if (words.length === 1 && term === term.toUpperCase() && term.length <= 10) return 'dict_acronyms'
  // Single word = jargon
  if (words.length === 1) return 'dict_military_jargon'
  // 2-5 words = phrase translation
  if (words.length <= 5) return 'dict_phrase_translations'
  // Longer = bullet pattern
  return 'dict_bullet_patterns'
}

// ─── Term pair type ─────────────────────────────────────────────────────────

export interface TermPair {
  military: string
  civilian: string
}

export interface CaptureContext {
  userId: string
  branch?: string
  targetIndustry?: string
  targetRole?: string
  modelUsed?: string
}

// ─── Check if a term already exists in the dictionary ───────────────────────

async function isInDictionary(term: string): Promise<boolean> {
  const normalized = term.toLowerCase().trim()

  try {
    const [phraseCheck, jargonCheck, acronymCheck] = await Promise.all([
      supabaseAdmin
        .from('dict_phrase_translations')
        .select('id')
        .ilike('military_phrase', normalized)
        .limit(1),
      supabaseAdmin
        .from('dict_military_jargon')
        .select('id')
        .ilike('military_term', normalized)
        .limit(1),
      supabaseAdmin
        .from('dict_acronyms')
        .select('id')
        .ilike('acronym', normalized)
        .limit(1),
    ])

    return !!(
      phraseCheck.data?.length ||
      jargonCheck.data?.length ||
      acronymCheck.data?.length
    )
  } catch {
    return false // On error, allow capture
  }
}

// ─── Capture a single term pair (non-blocking) ─────────────────────────────

export function captureTermPair(
  sourceType: string,
  pair: TermPair,
  fullContext: string | null,
  ctx: CaptureContext
): void {
  const military = stripPII(pair.military?.trim() || '')
  const civilian = stripPII(pair.civilian?.trim() || '')

  // Skip empty, very short, or identical pairs
  if (!military || !civilian || military.length < 2 || military === civilian) return
  // Skip if civilian is just a redaction marker
  if (civilian === '[REDACTED]') return

  // Fire-and-forget async
  ;(async () => {
    try {
      // Skip if already in dictionary
      if (await isInDictionary(military)) return

      await supabaseAdmin.rpc('upsert_ai_translation', {
        p_source_type: sourceType,
        p_military_term: military,
        p_civilian_translation: civilian,
        p_full_context: fullContext ? stripPII(fullContext).substring(0, 500) : null,
        p_model_used: ctx.modelUsed || null,
        p_user_id: ctx.userId,
        p_branch: ctx.branch || null,
        p_target_industry: ctx.targetIndustry || null,
        p_target_role: ctx.targetRole || null,
        p_suggested_table: suggestDictTable(military),
      })
    } catch {
      // Silent fail — never block user
    }
  })()
}

// ─── Capture multiple term pairs from a structured AI response ──────────────

export function captureTermPairs(
  sourceType: string,
  pairs: TermPair[],
  fullContext: string | null,
  ctx: CaptureContext
): void {
  if (!pairs || pairs.length === 0) return

  for (const pair of pairs) {
    captureTermPair(sourceType, pair, fullContext, ctx)
  }
}

// ─── Capture a full-text AI output (cover letter, linkedin, etc.) ───────────

export function captureFullTextOutput(
  sourceType: string,
  description: string,
  outputText: string,
  ctx: CaptureContext
): void {
  if (!outputText || outputText.length < 20) return

  const cleanOutput = stripPII(outputText)

  ;(async () => {
    try {
      await supabaseAdmin.rpc('upsert_ai_translation', {
        p_source_type: sourceType,
        p_military_term: stripPII(description).substring(0, 200),
        p_civilian_translation: cleanOutput.substring(0, 500),
        p_full_context: cleanOutput.substring(0, 1000),
        p_model_used: ctx.modelUsed || null,
        p_user_id: ctx.userId,
        p_branch: ctx.branch || null,
        p_target_industry: ctx.targetIndustry || null,
        p_target_role: ctx.targetRole || null,
        p_suggested_table: null, // Full text doesn't map to a single dict table
      })
    } catch {
      // Silent fail
    }
  })()
}

// ─── Extract term-level differences between original and translated bullets ─

export function extractTermDiffs(
  originalBullet: string,
  translatedBullet: string
): TermPair[] {
  if (!originalBullet || !translatedBullet) return []

  const pairs: TermPair[] = []

  // Extract capitalized acronyms/terms from original that don't appear in translated
  const acronymPattern = /\b[A-Z]{2,10}\b/g
  const originalAcronyms = originalBullet.match(acronymPattern) || []
  const translatedUpper = translatedBullet.toUpperCase()

  for (const acr of originalAcronyms) {
    // Skip common non-military acronyms
    if (['AND', 'THE', 'FOR', 'WITH', 'FROM', 'BUT', 'NOT', 'ALL', 'HAS', 'WAS', 'ARE', 'WERE', 'BEEN'].includes(acr)) continue
    // If the acronym doesn't appear in the translated text, it was translated
    if (!translatedUpper.includes(acr)) {
      // Try to find what it was translated to (heuristic)
      pairs.push({
        military: acr,
        civilian: `[translated in context: ${translatedBullet.substring(0, 100)}]`,
      })
    }
  }

  // Extract military-specific phrases from original that were changed
  const militaryPatterns = [
    /\b\d+\s*(?:sailors?|soldiers?|airmen|marines?|service\s*members?)\b/gi,
    /\b(?:commanding officer|executive officer|command master chief|first sergeant)\b/gi,
    /\b(?:deployment|underway|watch station|duty section|quarterdeck)\b/gi,
    /\b(?:FITREP|NCOER|OER|EPR|EVAL)\b/gi,
  ]

  for (const pattern of militaryPatterns) {
    const matches = originalBullet.match(pattern)
    if (matches) {
      for (const match of matches) {
        if (!translatedBullet.toLowerCase().includes(match.toLowerCase())) {
          pairs.push({
            military: match,
            civilian: `[translated in context]`,
          })
        }
      }
    }
  }

  return pairs
}
