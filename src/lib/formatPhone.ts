/**
 * Phone number formatting utilities
 */

/**
 * Format a phone number as user types: (xxx) xxx-xxxx
 */
export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '')

  if (digits.length <= 3) {
    return digits
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  } else {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }
}

/**
 * Strip formatting to get raw digits for storage
 */
export function stripPhoneNumber(formatted: string): string {
  return formatted.replace(/\D/g, '')
}

/**
 * Format phone for display (resume/preview)
 * Ensures consistent (xxx) xxx-xxxx format
 */
export function formatPhoneForDisplay(phone: string): string {
  const digits = stripPhoneNumber(phone)

  if (digits.length !== 10) {
    return phone // Return as-is if not a standard 10-digit number
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}
