/**
 * Federal Resume Constants
 * Special hiring authorities and eligibility options for USAJOBS
 */

export const SPECIAL_ELIGIBILITY = [
  { value: 'veteran', label: 'Veteran (5-point preference)' },
  { value: 'disabled-veteran', label: 'Disabled Veteran (10-point preference)' },
  { value: 'military-spouse', label: 'Military Spouse' },
  { value: 'schedule-a', label: 'Schedule A (Disability)' },
  { value: 'peace-corps', label: 'Peace Corps/AmeriCorps VISTA' },
  { value: 'land-management', label: 'Land Management Workforce Flexibility Act' },
  { value: 'interchange', label: 'Interchange Agreement' },
  { value: 'reinstatement', label: 'Reinstatement Eligible' },
  { value: 'ictap', label: 'ICTAP/CTAP Eligible' },
] as const

export type SpecialEligibility = typeof SPECIAL_ELIGIBILITY[number]['value']

/**
 * Security Clearance levels
 */
export const CLEARANCE_LEVELS = [
  { value: 'none', label: 'None' },
  { value: 'confidential', label: 'Confidential' },
  { value: 'secret', label: 'Secret' },
  { value: 'top-secret', label: 'Top Secret' },
  { value: 'ts-sci', label: 'Top Secret/SCI' },
] as const

export type ClearanceLevel = typeof CLEARANCE_LEVELS[number]['value']

/**
 * Language proficiency levels (per federal standards)
 */
export const LANGUAGE_PROFICIENCY = [
  { value: 'native', label: 'Native/Bilingual' },
  { value: 'fluent', label: 'Full Professional Proficiency' },
  { value: 'professional', label: 'Professional Working Proficiency' },
  { value: 'limited', label: 'Limited Working Proficiency' },
  { value: 'elementary', label: 'Elementary Proficiency' },
] as const

export type LanguageProficiency = typeof LANGUAGE_PROFICIENCY[number]['value']

/**
 * Common federal pay grades and series
 */
export const PAY_GRADES = [
  // GS (General Schedule)
  { value: 'GS-1', label: 'GS-1' },
  { value: 'GS-2', label: 'GS-2' },
  { value: 'GS-3', label: 'GS-3' },
  { value: 'GS-4', label: 'GS-4' },
  { value: 'GS-5', label: 'GS-5' },
  { value: 'GS-6', label: 'GS-6' },
  { value: 'GS-7', label: 'GS-7' },
  { value: 'GS-8', label: 'GS-8' },
  { value: 'GS-9', label: 'GS-9' },
  { value: 'GS-10', label: 'GS-10' },
  { value: 'GS-11', label: 'GS-11' },
  { value: 'GS-12', label: 'GS-12' },
  { value: 'GS-13', label: 'GS-13' },
  { value: 'GS-14', label: 'GS-14' },
  { value: 'GS-15', label: 'GS-15' },
  // SES (Senior Executive Service)
  { value: 'SES', label: 'SES' },
  // WG (Wage Grade)
  { value: 'WG-1', label: 'WG-1' },
  { value: 'WG-2', label: 'WG-2' },
  { value: 'WG-3', label: 'WG-3' },
  { value: 'WG-4', label: 'WG-4' },
  { value: 'WG-5', label: 'WG-5' },
  { value: 'WG-6', label: 'WG-6' },
  { value: 'WG-7', label: 'WG-7' },
  { value: 'WG-8', label: 'WG-8' },
  { value: 'WG-9', label: 'WG-9' },
  { value: 'WG-10', label: 'WG-10' },
  { value: 'WG-11', label: 'WG-11' },
  { value: 'WG-12', label: 'WG-12' },
  { value: 'WG-13', label: 'WG-13' },
  { value: 'WG-14', label: 'WG-14' },
  { value: 'WG-15', label: 'WG-15' },
] as const

/**
 * Get eligibility label from value
 */
export function getEligibilityLabel(value: string): string {
  const elig = SPECIAL_ELIGIBILITY.find(e => e.value === value)
  return elig?.label || value
}

/**
 * Get clearance label from value
 */
export function getClearanceLabel(value: string): string {
  const clearance = CLEARANCE_LEVELS.find(c => c.value === value)
  return clearance?.label || value
}

/**
 * Get proficiency label from value
 */
export function getProficiencyLabel(value: string): string {
  const prof = LANGUAGE_PROFICIENCY.find(p => p.value === value)
  return prof?.label || value
}
