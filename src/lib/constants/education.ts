/**
 * Education form constants
 */

export const DEGREE_TYPES = [
  { value: 'high-school', label: 'High School Diploma' },
  { value: 'ged', label: 'GED' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'associate', label: 'Associate Degree' },
  { value: 'bachelor', label: "Bachelor's Degree" },
  { value: 'master', label: "Master's Degree" },
  { value: 'mba', label: 'MBA' },
  { value: 'doctorate', label: 'Doctorate (PhD)' },
  { value: 'professional', label: 'Professional Degree (JD, MD, etc.)' },
  { value: 'some-college', label: 'Some College (No Degree)' },
  { value: 'bootcamp', label: 'Bootcamp / Trade School' },
  { value: 'military', label: 'Military Training / School' },
] as const

export const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
] as const

// Generate year options (current year down to 60 years ago)
export const GRADUATION_YEARS = Array.from(
  { length: 61 },
  (_, i) => {
    const year = new Date().getFullYear() - i
    return { value: year.toString(), label: year.toString() }
  }
)

/**
 * Get the display label for a degree type value
 */
export function getDegreeLabel(degreeType: string): string {
  const degree = DEGREE_TYPES.find(d => d.value === degreeType)
  return degree?.label || degreeType
}

/**
 * Match a parsed degree string to the closest DEGREE_TYPES value.
 * Returns the matching value string (e.g., 'bachelor') or '' if no match.
 */
export function matchDegreeType(parsed: string | null | undefined): string {
  if (!parsed) return ''
  const s = parsed.trim().toLowerCase()
  if (!s) return ''

  // Direct value match (already normalized)
  if (DEGREE_TYPES.some(d => d.value === s)) return s

  // MBA
  if (/\bmba\b/.test(s)) return 'mba'

  // Doctorate / PhD
  if (/\b(ph\.?d\.?|doctorate|doctoral)\b/.test(s)) return 'doctorate'

  // Professional degrees
  if (/\b(j\.?d\.?|m\.?d\.?|juris|doctor of medicine)\b/.test(s)) return 'professional'

  // Master's
  if (/\b(master|m\.?s\.?|m\.?a\.?|m\.?ed\.?|m\.?p\.?a\.?)\b/.test(s) && !/\bmba\b/.test(s)) return 'master'

  // Bachelor's
  if (/\b(bachelor|b\.?s\.?|b\.?a\.?|b\.?b\.?a\.?)\b/.test(s)) return 'bachelor'

  // Associate
  if (/\b(associate|a\.?a\.?s?\.?|a\.?s\.?)\b/.test(s)) return 'associate'

  // Certificate
  if (/\b(certificate|cert\.?|certification)\b/.test(s)) return 'certificate'

  // GED
  if (/\bged\b/.test(s)) return 'ged'

  // High school
  if (/\b(high school|diploma)\b/.test(s)) return 'high-school'

  // Some college
  if (/\bsome college\b/.test(s)) return 'some-college'

  // Bootcamp / trade
  if (/\b(bootcamp|trade school|vocational)\b/.test(s)) return 'bootcamp'

  // Military training
  if (/\b(military|nco|pme|war college)\b/.test(s)) return 'military'

  return ''
}

/**
 * Format graduation date for display: "May 2023" or just "2023"
 */
export function formatGraduationDate(month: string | null | undefined, year: string | null | undefined): string {
  if (!year) return ''
  if (!month) return year

  const monthObj = MONTHS.find(m => m.value === month)
  return `${monthObj?.label || month} ${year}`
}

/**
 * Format graduation date short: "May 2023" -> "May 2023"
 */
export function formatGraduationDateShort(month: string | null | undefined, year: string | null | undefined): string {
  if (!year) return ''
  if (!month) return year

  const monthObj = MONTHS.find(m => m.value === month)
  const shortMonth = monthObj?.label.slice(0, 3) || month
  return `${shortMonth} ${year}`
}

/**
 * Parse legacy graduation_date (YYYY-MM-DD) into month and year
 */
export function parseLegacyGraduationDate(date: string | null | undefined): { month: string; year: string } {
  if (!date) return { month: '', year: '' }

  // Handle YYYY-MM-DD format
  const parts = date.split('-')
  if (parts.length >= 2) {
    return {
      year: parts[0],
      month: parts[1],
    }
  }

  // Handle YYYY format
  if (parts.length === 1 && parts[0].length === 4) {
    return {
      year: parts[0],
      month: '',
    }
  }

  return { month: '', year: '' }
}
