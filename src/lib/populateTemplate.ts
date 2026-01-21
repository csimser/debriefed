/**
 * Template population utilities for professional summaries
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
 * Branch display names
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
 * Populate a template with profile data
 */
export function populateTemplate(template: string, profile: ProfileData): string {
  let result = template

  // Branch with display name
  const branchDisplay = profile.branch
    ? (BRANCH_DISPLAY[profile.branch] || profile.branch)
    : 'U.S. Military'
  result = result.replace(/\{\{branch\}\}/g, branchDisplay)

  // Direct replacements
  result = result.replace(/\{\{firstName\}\}/g, profile.firstName || '')
  result = result.replace(/\{\{lastName\}\}/g, profile.lastName || '')
  result = result.replace(/\{\{rank\}\}/g, profile.rank || 'Veteran')
  result = result.replace(/\{\{paygrade\}\}/g, profile.paygrade || '')
  result = result.replace(/\{\{mos\}\}/g, profile.mos || '')
  result = result.replace(/\{\{yearsOfService\}\}/g, profile.yearsOfService?.toString() || '10+')

  // MOS Title - use provided or default to generic
  const mosTitle = profile.mosTitle || (profile.mos ? `${profile.mos} specialist` : 'technical specialist')
  result = result.replace(/\{\{mosTitle\}\}/g, mosTitle)

  // Optional fields with smart defaults
  result = result.replace(/\{\{targetRole\}\}/g, profile.targetRole || 'leadership')
  result = result.replace(/\{\{targetIndustry\}\}/g, profile.targetIndustry || 'the private sector')
  result = result.replace(/\{\{teamSize\}\}/g, profile.teamSize?.toString() || '20+')
  result = result.replace(/\{\{specialty\}\}/g, profile.specialty || 'mission-critical systems')

  // Clearance statement - include only if they have one
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

  // Clean up any double spaces
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
