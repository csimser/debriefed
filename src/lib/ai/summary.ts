/**
 * Professional summary enhancement — browser port of the old
 * /api/enhance-summary route.
 *
 * Pipeline: bundled-dictionary pre-translation → word-by-word term lookup →
 * local civilian jobs crosswalk context → Claude (user's key) for the
 * refined summary. Defense/government target industries keep military
 * terminology; all other industries get strict translation rules.
 */
import { getCivilianJobs } from '@/lib/debriefed-token-saver/jobCrosswalk'
import { translateTerm } from '@/lib/debriefed-token-saver/termLookup'
import { dictionaryTranslate } from '@/lib/translation-engine'
import { getProfile } from '@/lib/storage'
import {
  callWithEscalation,
  getAnthropicClient,
  trackTokens,
  type ModelUsed,
} from '@/lib/ai/client'

export interface EnhanceSummaryProfile {
  mos?: string
  branch?: string
  targetIndustry?: string
  targetRole?: string
  yearsOfService?: string | number
}

export interface EnhanceSummaryInput {
  summary: string
  profile?: EnhanceSummaryProfile
}

export interface EnhanceSummaryResult {
  enhanced: string
  model_used: ModelUsed
}

/**
 * Enhance a professional summary for a target industry/role.
 * Mirrors the old POST /api/enhance-summary behavior.
 */
export async function enhanceSummary(input: EnhanceSummaryInput): Promise<EnhanceSummaryResult> {
  const { summary, profile } = input

  if (!summary) {
    throw new Error('Missing summary text')
  }

  // Stored profile replaces the old Supabase profiles read (rating_mos, branch)
  const storedProfile = getProfile()

  // Build crosswalk context from local data (no AI call needed)
  let crosswalkContext = ''
  const mosCode = profile?.mos || storedProfile?.rating_mos
  const branchName = profile?.branch || storedProfile?.branch
  if (mosCode) {
    const localResult = getCivilianJobs(mosCode, branchName || undefined)
    if (localResult) {
      crosswalkContext = `\nCivilian Role Context: ${mosCode} maps to ${localResult.civilian_titles.join(', ')} (Industries: ${localResult.industries?.join(', ') || 'Various'}). Use these civilian titles as reference for appropriate terminology.`
    }
  }

  // Pre-translate using shared engine (phrase-first + jargon + constants)
  const { translated: preTranslated, matchedTerms } = await dictionaryTranslate(summary)
  const knownTranslations: string[] = matchedTerms.map(mt => `"${mt.military}" → "${mt.civilian}"`)
  // Also do word-level lookup for any the engine missed
  const words = summary.split(/\s+/)
  for (const word of words) {
    const cleaned = word.replace(/[^a-zA-Z0-9/-]/g, '')
    if (cleaned.length >= 2) {
      const translation = translateTerm(cleaned)
      if (translation) {
        const entry = `"${cleaned}" → "${translation}"`
        if (!knownTranslations.includes(entry)) knownTranslations.push(entry)
      }
    }
  }
  const termContext = knownTranslations.length > 0
    ? `\nKnown translations (apply these): ${knownTranslations.join(', ')}\nPre-translated version: ${preTranslated}`
    : ''

  // Check if targeting defense/government industry
  const targetIndustry = profile?.targetIndustry || 'Not specified'
  const isDefenseIndustry = targetIndustry.toLowerCase().includes('defense') ||
    targetIndustry.toLowerCase().includes('government') ||
    targetIndustry.toLowerCase().includes('federal') ||
    targetIndustry.toLowerCase().includes('contractor') ||
    targetIndustry.toLowerCase().includes('dod')

  // Build industry-specific guidance
  let industryGuidance = ''
  if (isDefenseIndustry) {
    industryGuidance = `
DEFENSE/GOVERNMENT INDUSTRY EXCEPTION:
Since the target industry is ${targetIndustry}, military terminology IS acceptable.
You may use military ranks, branch names, and service-related language.
Emphasize: clearance level, defense programs, government contracting experience, mission accomplishment.`
  } else {
    industryGuidance = `
MILITARY-TO-CIVILIAN TRANSLATION RULES (MANDATORY):
The target industry is "${targetIndustry}" - write as if the person has always worked in this industry.
- NEVER use military ranks (Petty Officer, Sergeant, Chief, etc.) — translate to civilian equivalents like "Senior Operations Leader", "Team Supervisor", "Department Manager"
- NEVER use military terms like "deployment", "command", "MOS", "rating", "enlisted", "commissioned", "watch", "underway"
- NEVER mention military branch names (U.S. Navy, Army, etc.)
- ALWAYS translate to civilian equivalents:
  * Military ranks → "Senior Leader", "Operations Manager", "Team Lead"
  * "Led a division of sailors/soldiers/airmen" → "Led a team of employees" or "Led a team of professionals"
  * "20 years naval service" → "20 years of experience"
  * "deployment" → "field assignment" or "operational period"
  * "command" → "organization" or "department"

INDUSTRY-SPECIFIC KEYWORDS for ${targetIndustry}:
- Use terminology and keywords that hiring managers in ${targetIndustry} expect to see
- Frame all experience in terms relevant to ${targetIndustry}`
  }

  const prompt = `Refine this professional summary for someone targeting: ${targetIndustry}

CURRENT SUMMARY:
${summary}

CONTEXT:
- Years of experience: ${profile?.yearsOfService || '10+'}
- Target Role: ${profile?.targetRole || 'Not specified'}
- Target Industry: ${targetIndustry}
${crosswalkContext}${termContext}
${industryGuidance}

REQUIREMENTS:
1. Keep approximately the same length (2-4 sentences)
2. Use strong, active voice
3. Avoid clichés and buzzwords like "Results-driven" or "Detail-oriented professional"
4. Highlight leadership and transferable skills
5. Make it sound confident but not arrogant
6. Use industry-specific keywords for ${targetIndustry}

Return ONLY the improved summary, nothing else.`

  const { response, model_used } = await callWithEscalation(
    getAnthropicClient(),
    {
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    },
    { expectsJson: false }
  )

  const enhanced = response.content[0].type === 'text' ? response.content[0].text.trim() : ''

  trackTokens((response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0))

  return { enhanced, model_used }
}
