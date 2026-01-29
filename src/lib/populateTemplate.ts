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
  'staff sergeant': 'Supervisor',
  'technical sergeant': 'Senior Supervisor',
  'master sergeant': 'Manager',
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

  // Clearance statement - include only for defense/security roles or if they have clearance
  if (profile.clearance && profile.clearance !== 'none' && profile.clearance !== '') {
    // Only include clearance statement for defense/security industries
    if (usesMilitaryTerms || profile.targetIndustry?.toLowerCase().includes('security')) {
      const clearanceText = CLEARANCE_DISPLAY[profile.clearance] || profile.clearance
      result = result.replace(/\{\{clearanceStatement\}\}/g, `Holds active ${clearanceText} clearance. `)
    } else {
      result = result.replace(/\{\{clearanceStatement\}\}/g, '')
    }
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

  // Clean up any double spaces and trim
  result = result.replace(/\s+/g, ' ').trim()

  return result
}

/**
 * Build profile data from form state
 */
export function buildProfileDataFromForm(formState: any, certifications?: any[]): ProfileData {
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
    certifications: certifications?.map(c => c.name) || [],
  }
}
