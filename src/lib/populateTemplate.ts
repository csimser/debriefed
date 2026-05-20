/**
 * Template population utilities for professional summaries
 *
 * IMPORTANT: This utility translates military background to civilian language.
 * Military terminology should ONLY be used when target_industry is "Defense" or "Government".
 */

export interface ProfileData {
  firstName?: string
  lastName?: string
  branch?: string
  rank?: string
  paygrade?: string
  mos?: string
  mosTitle?: string  // Civilian-friendly title for their MOS
  yearsOfService?: number
  clearance?: string
  certifications?: string[]
  skills?: string[]
  education?: { degree?: string; field?: string }[]
  targetRole?: string
  targetIndustry?: string
  teamSize?: number
  specialty?: string
}

/**
 * Branch display names (only used for Defense/Government templates)
 */
const BRANCH_DISPLAY: Record<string, string> = {
  'navy': 'U.S. Navy',
  'army': 'U.S. Army',
  'air_force': 'U.S. Air Force',
  'marines': 'U.S. Marine Corps',
  'coast_guard': 'U.S. Coast Guard',
  'space_force': 'U.S. Space Force',
}

/**
 * Civilian equivalents for military ranks (used for non-defense templates)
 */
const RANK_TO_CIVILIAN: Record<string, string> = {
  // Navy Enlisted
  'seaman recruit': 'Entry-Level Staff',
  'seaman apprentice': 'Junior Staff Member',
  'seaman': 'Staff Member',
  'petty officer third class': 'Technician',
  'petty officer second class': 'Senior Technician',
  'petty officer first class': 'Supervisor',
  'chief petty officer': 'Department Supervisor',
  'senior chief petty officer': 'Senior Manager',
  'master chief petty officer': 'Director',
  // Army Enlisted
  'private': 'Entry-Level Staff',
  'private first class': 'Junior Staff Member',
  'specialist': 'Technician',
  'corporal': 'Team Lead',
  'sergeant': 'Team Lead',
  'staff sergeant': 'Supervisor',
  'sergeant first class': 'Senior Supervisor',
  'master sergeant': 'Senior Manager',
  'first sergeant': 'Operations Manager',
  'sergeant major': 'Director',
  'command sergeant major': 'Senior Director',
  // Air Force Enlisted
  'airman basic': 'Entry-Level Staff',
  'airman': 'Junior Staff Member',
  'airman first class': 'Staff Member',
  'senior airman': 'Technician',
  // 'staff sergeant' already defined above (Army)
  'technical sergeant': 'Senior Supervisor',
  // 'master sergeant' already defined above (Army)
  'senior master sergeant': 'Senior Manager',
  'chief master sergeant': 'Director',
  // Officers (all branches)
  'ensign': 'Junior Manager',
  'lieutenant junior grade': 'Project Manager',
  'lieutenant': 'Manager',
  'lieutenant commander': 'Senior Manager',
  'commander': 'Director',
  'captain': 'Senior Director',
  'second lieutenant': 'Junior Manager',
  'first lieutenant': 'Manager',
  'major': 'Senior Manager',
  'lieutenant colonel': 'Director',
  'colonel': 'Senior Director',
}

/**
 * Clearance display names
 */
const CLEARANCE_DISPLAY: Record<string, string> = {
  'confidential': 'Confidential',
  'secret': 'Secret',
  'top_secret': 'Top Secret',
  'top-secret': 'Top Secret',
  'ts_sci': 'TS/SCI',
  'ts-sci': 'TS/SCI',
}

/**
 * Determine if target industry is defense/government (where military terminology is OK)
 */
function isDefenseIndustry(targetIndustry?: string): boolean {
  if (!targetIndustry) return false
  const lower = targetIndustry.toLowerCase()
  return lower.includes('defense') ||
    lower.includes('government') ||
    lower.includes('federal') ||
    lower.includes('military') ||
    lower.includes('contractor') ||
    lower.includes('dod') ||
    lower.includes('clearance')
}

/**
 * Get civilian equivalent for a military rank
 */
function getCivilianRank(rank?: string): string {
  if (!rank) return 'Operations professional'
  const lower = rank.toLowerCase()
  return RANK_TO_CIVILIAN[lower] || 'Operations professional'
}

/**
 * Populate a template with profile data
 */
export function populateTemplate(template: string, profile: ProfileData): string {
  let result = template
  const usesMilitaryTerms = isDefenseIndustry(profile.targetIndustry)

  // Branch - only use military branch name for defense industry
  if (usesMilitaryTerms) {
    const branchDisplay = profile.branch
      ? (BRANCH_DISPLAY[profile.branch] || profile.branch)
      : 'military'
    result = result.replace(/\{\{branch\}\}/g, branchDisplay)
  } else {
    // Remove branch references for civilian templates
    result = result.replace(/\{\{branch\}\}/g, '')
  }

  // Rank - use civilian equivalent unless targeting defense
  if (usesMilitaryTerms) {
    result = result.replace(/\{\{rank\}\}/g, profile.rank || 'Veteran')
  } else {
    const civilianTitle = getCivilianRank(profile.rank)
    result = result.replace(/\{\{rank\}\}/g, civilianTitle)
  }

  // Direct replacements
  result = result.replace(/\{\{firstName\}\}/g, profile.firstName || '')
  result = result.replace(/\{\{lastName\}\}/g, profile.lastName || '')
  result = result.replace(/\{\{paygrade\}\}/g, profile.paygrade || '')
  result = result.replace(/\{\{mos\}\}/g, profile.mos || '')
  result = result.replace(/\{\{yearsOfService\}\}/g, profile.yearsOfService?.toString() || '10+')

  // MOS Title - use provided civilian title or default to generic
  const mosTitle = profile.mosTitle || 'Technical specialist'
  result = result.replace(/\{\{mosTitle\}\}/g, mosTitle)

  // Optional fields with smart defaults
  result = result.replace(/\{\{targetRole\}\}/g, profile.targetRole || 'leadership')
  result = result.replace(/\{\{targetIndustry\}\}/g, profile.targetIndustry || 'the private sector')
  result = result.replace(/\{\{teamSize\}\}/g, profile.teamSize?.toString() || '20+')
  result = result.replace(/\{\{specialty\}\}/g, profile.specialty || 'complex technical systems')

  // Clearance statement - include for ALL industries when user has clearance
  // Active security clearance is a valuable credential in any industry
  if (profile.clearance && profile.clearance !== 'none' && profile.clearance !== '') {
    const clearanceText = CLEARANCE_DISPLAY[profile.clearance] || profile.clearance
    result = result.replace(/\{\{clearanceStatement\}\}/g, `Holds active ${clearanceText} clearance. `)
  } else {
    result = result.replace(/\{\{clearanceStatement\}\}/g, '')
  }

  // Certifications - format nicely if present
  if (profile.certifications && profile.certifications.length > 0) {
    const certList = profile.certifications.slice(0, 5).join(', ')
    result = result.replace(/\{\{certifications\}\}/g, `${certList} certified. `)
  } else {
    result = result.replace(/\{\{certifications\}\}/g, '')
  }

  // Final cleanup pass
  result = cleanTemplateOutput(result)

  return result
}

/**
 * Final cleanup pass for any template-filled text.
 * Removes leftover placeholders, brackets, stray punctuation, etc.
 * Should be called AFTER all template filling is complete.
 */
export function cleanTemplateOutput(text: string): string {
  let result = text

  // Remove any remaining {key} and {{key}} placeholders (both single and double brace)
  result = result.replace(/\{{1,2}[^}]*\}{1,2}/g, '')

  // Remove any remaining [...] bracket placeholders
  result = result.replace(/\[[^\]]*\]/g, '')

  // Remove stray % not part of a real percentage (e.g. "15%" is fine, standalone "%" is not)
  result = result.replace(/(?<!\d)%/g, '')

  // Remove empty parentheses ()
  result = result.replace(/\(\s*\)/g, '')

  // Remove trailing commas, pipes, or separators before periods
  result = result.replace(/[,|;]+\s*\./g, '.')

  // Remove trailing commas/pipes/separators at end of line or before newline
  result = result.replace(/[,|;]+\s*$/gm, '')

  // Remove lines that are just whitespace or punctuation
  result = result.replace(/^\s*[.,;:|]+\s*$/gm, '')

  // Collapse double+ spaces to single
  result = result.replace(/\s{2,}/g, ' ')

  // Remove space before punctuation
  result = result.replace(/\s+([.,;:!?])/g, '$1')

  // Fix double commas
  result = result.replace(/,\s*,/g, ',')

  // Fix comma-period
  result = result.replace(/,\s*\./g, '.')

  // Capitalize first letter of sentences after cleanup
  result = result.replace(/([.!?]\s+)([a-z])/g, (_, sep, letter) => sep + letter.toUpperCase())

  // Capitalize very first character if lowercase
  if (result.length > 0 && /^[a-z]/.test(result)) {
    result = result[0].toUpperCase() + result.slice(1)
  }

  // Remove blank lines
  result = result.replace(/\n\s*\n\s*\n/g, '\n\n')

  return result.trim()
}

/**
 * Personalize a static dictionary template that has NO {{placeholders}}.
 *
 * Dict templates from the DB are 2-3 sentences of fully-static text like:
 *   "Accomplished Software Engineer with 10+ years of progressive leadership..."
 *
 * This function injects the user's actual data via pattern matching:
 * 1. Replace generic "X+ years" with actual years of service
 * 2. Replace generic "teams of X-Y personnel" with rank-appropriate team size
 * 3. Inject certification sentence if certs aren't already mentioned
 * 4. Inject clearance sentence if clearance isn't already mentioned
 * 5. Inject target industry/role if not already present
 *
 * This transforms a generic 2-3 sentence summary into a personalized 4-5 sentence one.
 */
export function personalizeStaticSummary(
  text: string,
  profile: ProfileData,
  civilianTitle?: string | null,
  teamSize?: string | null,
): string {
  if (!text || text.trim().length < 20) return text

  let result = text.trim()

  // 1. Replace generic year patterns: "10+ years" → "20 years", "3+ years" → "20 years"
  if (profile.yearsOfService && profile.yearsOfService > 0) {
    result = result.replace(/\b\d{1,2}\+?\s+years?\b/i, `${profile.yearsOfService} years`)
  }

  // 2. Replace generic team size patterns
  if (teamSize) {
    result = result.replace(
      /\bteams?\s+of\s+\d+[-–]\d+\s+personnel\b/i,
      `teams of ${teamSize} personnel`
    )
  }

  // 3. Inject certifications if not mentioned
  const certs = profile.certifications ?? []
  if (certs.length > 0) {
    const hasCertMention = certs.some(c =>
      c.length >= 3 && result.toLowerCase().includes(c.toLowerCase())
    )
    if (!hasCertMention) {
      const certList = certs.slice(0, 5).join(', ')
      const certSentence = `${certList} certified.`
      result = insertBeforeLastSentence(result, certSentence)
    }
  }

  // 4. Inject clearance if not mentioned
  if (profile.clearance && profile.clearance !== 'none' && profile.clearance !== '') {
    const hasClearanceMention = result.toLowerCase().includes('clearance')
    if (!hasClearanceMention) {
      const clearanceText = CLEARANCE_DISPLAY[profile.clearance] || profile.clearance
      const clearanceSentence = `Holds active ${clearanceText} clearance.`
      result = insertBeforeLastSentence(result, clearanceSentence)
    }
  }

  // 5. If no closing "Seeking/Ready/Committed" sentence exists and target industry
  // isn't mentioned, append a value-statement sentence.
  // BUT: don't append if a closing pattern already exists (avoids duplicate closers)
  if (profile.targetIndustry) {
    const hasClosingPattern = /\b(seeking|ready|committed|eager|looking)\s+to\b/i.test(result)
    const hasIndustry = result.toLowerCase().includes(profile.targetIndustry.toLowerCase())
    if (!hasClosingPattern && !hasIndustry) {
      const role = profile.targetRole || civilianTitle || 'leadership'
      result += ` Seeking to apply proven expertise to a ${role} role in ${profile.targetIndustry}.`
    }
  }

  return result
}

/**
 * Insert a sentence before the last sentence of a text.
 * "Sentence one. Sentence two. Last sentence." + "New sentence."
 * → "Sentence one. Sentence two. New sentence. Last sentence."
 */
function insertBeforeLastSentence(text: string, newSentence: string): string {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0)
  if (sentences.length <= 1) {
    // Only one sentence — append
    return text.trimEnd().replace(/\.?$/, '. ') + newSentence
  }
  const last = sentences.pop()!
  return [...sentences, newSentence, last].join(' ')
}

/**
 * Build profile data from form state
 */
export function buildProfileDataFromForm(
  formState: any,
  certifications?: any[],
  skills?: any[],
  education?: any[],
): ProfileData {
  return {
    firstName: formState.first_name,
    lastName: formState.last_name,
    branch: formState.branch,
    rank: formState.rank,
    paygrade: formState.paygrade,
    mos: formState.rating_mos,
    yearsOfService: formState.years_of_service ? parseInt(String(formState.years_of_service)) : undefined,
    clearance: formState.clearance,
    targetRole: formState.target_role,
    targetIndustry: formState.target_industry,
    certifications: certifications?.map(c => typeof c === 'string' ? c : c.name) || [],
    skills: skills?.map(s => typeof s === 'string' ? s : s.name) || [],
    education: education?.map(e => ({
      degree: e.degree_type || e.degree || undefined,
      field: e.field_of_study || e.field || undefined,
    })) || [],
  }
}
