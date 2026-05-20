/**
 * Resume formatting utilities
 * Used across ResumePreview, PDF, and DOCX generation
 */

import { getDegreeLabel, formatGraduationDateShort, parseLegacyGraduationDate } from '@/lib/constants/education'
import { formatPhoneForDisplay } from '@/lib/formatPhone'

/**
 * Format degree type for display
 * Falls back to raw degree string if degree_type not set
 */
export function formatDegreeType(degreeType: string | null | undefined, legacyDegree?: string): string {
  if (degreeType) {
    return getDegreeLabel(degreeType)
  }
  return legacyDegree || ''
}

/**
 * Format graduation date for display
 * Supports both new format (month/year) and legacy (graduation_date string)
 */
export function formatGraduationDate(
  month: string | null | undefined,
  year: string | null | undefined,
  legacyDate?: string | null
): string {
  // Prefer new month/year format
  if (month || year) {
    return formatGraduationDateShort(month, year)
  }

  // Fall back to legacy date parsing
  if (legacyDate) {
    const parsed = parseLegacyGraduationDate(legacyDate)
    return formatGraduationDateShort(parsed.month, parsed.year)
  }

  return ''
}

/**
 * Format date for private sector resumes
 * Converts YYYY-MM-DD to "Jan 2024" format
 */
export function formatPrivateDate(dateString: string | null | undefined): string {
  if (!dateString) return ''
  if (dateString.toLowerCase() === 'present') return 'Present'

  try {
    const date = new Date(dateString + 'T00:00:00')
    if (isNaN(date.getTime())) return dateString

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
  } catch {
    return dateString
  }
}

/**
 * Format date for federal resumes (USAJOBS)
 * Converts YYYY-MM-DD to "MM/YYYY" format per USAJOBS requirements
 */
export function formatFederalDate(dateString: string | null | undefined): string {
  if (!dateString) return ''
  if (dateString.toLowerCase() === 'present') return 'Present'

  try {
    const date = new Date(dateString + 'T00:00:00')
    if (isNaN(date.getTime())) return dateString

    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${month}/${year}`
  } catch {
    return dateString
  }
}

// Backwards compatibility alias
export const formatExperienceDate = formatPrivateDate

/**
 * Format date range for experience section
 * Private: "Jan 2020 – Dec 2023"
 * Federal: "01/2020 – 12/2023"
 */
export function formatDateRange(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  isCurrent: boolean,
  format: 'private' | 'federal' = 'private'
): string {
  const formatter = format === 'federal' ? formatFederalDate : formatPrivateDate
  const start = formatter(startDate)
  const end = isCurrent ? 'Present' : formatter(endDate)

  if (!start && !end) return ''
  if (!start) return end
  if (!end) return start

  return `${start} – ${end}`
}

/**
 * Get school name with legacy fallback
 */
export function getSchoolName(edu: any): string {
  return edu.school_name || edu.institution || ''
}

/**
 * Get full degree display text
 * Returns "Bachelor of Science in Computer Science" format
 */
export function formatFullDegree(edu: any): string {
  const degreeLabel = formatDegreeType(edu.degree_type, edu.degree)

  if (!degreeLabel) {
    return edu.field_of_study || ''
  }

  if (edu.field_of_study) {
    return `${degreeLabel} in ${edu.field_of_study}`
  }

  return degreeLabel
}

/**
 * Format security clearance for display
 */
export function formatClearance(clearance: string | null | undefined): string {
  if (!clearance || clearance === 'none') return ''

  const map: Record<string, string> = {
    'none': '',
    'confidential': 'Confidential',
    'secret': 'Secret (Active)',
    'top-secret': 'Top Secret (Active)',
    'ts-sci': 'Top Secret/SCI (Active)',
  }
  return map[clearance] || clearance
}

// Re-export phone formatting for convenience
export { formatPhoneForDisplay }
