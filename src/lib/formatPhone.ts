/**
 * Phone number formatting utilities
 * Supports both US domestic format and international E.164 format
 */

import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js'

/**
 * Format a US phone number as user types: (xxx) xxx-xxxx
 * For backward compatibility with existing US-only inputs
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
 * Handles both E.164 international format and US domestic format
 */
export function formatPhoneForDisplay(phone: string | null | undefined): string {
  if (!phone) return ''

  // Try to parse as E.164 international format
  if (phone.startsWith('+')) {
    const parsed = parsePhoneNumberFromString(phone)
    if (parsed) {
      // For US numbers, use national format
      if (parsed.country === 'US') {
        return parsed.formatNational()
      }
      // For international, use international format
      return parsed.formatInternational()
    }
  }

  // Fall back to US format for 10-digit numbers (backward compatibility)
  const digits = stripPhoneNumber(phone)
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }

  // Return as-is if we can't format it
  return phone
}

/**
 * Convert a phone number to E.164 format for storage
 * @param phone - The phone number in any format
 * @param defaultCountry - Default country code if not specified (default: US)
 */
export function toE164(phone: string, defaultCountry: CountryCode = 'US'): string {
  if (!phone) return ''

  // Already in E.164 format
  if (phone.startsWith('+')) {
    const parsed = parsePhoneNumberFromString(phone)
    if (parsed) {
      return parsed.format('E.164')
    }
    return phone
  }

  // Try to parse with default country
  const digits = stripPhoneNumber(phone)
  if (digits.length > 0) {
    const parsed = parsePhoneNumberFromString(digits, defaultCountry)
    if (parsed) {
      return parsed.format('E.164')
    }

    // For US 10-digit numbers, add +1 prefix
    if (defaultCountry === 'US' && digits.length === 10) {
      return `+1${digits}`
    }
  }

  return phone
}

/**
 * Check if a phone number is valid
 * @param phone - The phone number to validate
 * @param country - Optional country code for validation
 */
export function isValidPhone(phone: string, country?: CountryCode): boolean {
  if (!phone) return true // Empty is valid (optional field)

  const parsed = parsePhoneNumberFromString(phone, country)
  return parsed ? parsed.isValid() : false
}

/**
 * Get the country code from an E.164 phone number
 */
export function getPhoneCountry(phone: string): CountryCode | undefined {
  if (!phone) return undefined

  const parsed = parsePhoneNumberFromString(phone)
  return parsed?.country
}

/**
 * Get the national (local) part of a phone number
 */
export function getNationalNumber(phone: string): string {
  if (!phone) return ''

  const parsed = parsePhoneNumberFromString(phone)
  return parsed?.nationalNumber || stripPhoneNumber(phone)
}
