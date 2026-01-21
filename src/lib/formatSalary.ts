/**
 * Salary formatting utilities
 * Display as currency, store as raw number
 */

/**
 * Format a number as currency: $85,000
 */
export function formatSalary(value: number | string | null): string {
  if (!value && value !== 0) return ''

  const num = typeof value === 'string'
    ? parseFloat(value.replace(/[^0-9.]/g, ''))
    : value

  if (isNaN(num)) return ''

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Parse currency string back to number for storage
 */
export function parseSalary(formatted: string): number | null {
  if (!formatted) return null
  const num = parseFloat(formatted.replace(/[^0-9.]/g, ''))
  return isNaN(num) ? null : num
}

/**
 * Format salary for display on resume/preview
 */
export function formatSalaryForDisplay(value: number | string | null): string {
  return formatSalary(value)
}
