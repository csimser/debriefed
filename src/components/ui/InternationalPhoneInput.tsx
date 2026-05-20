'use client'

import { useState, useEffect, useRef, useId } from 'react'
import { cn } from '@/lib/utils'
import {
  parsePhoneNumberFromString,
  AsYouType,
  getCountryCallingCode,
  CountryCode,
  getExampleNumber,
  isValidPhoneNumber,
} from 'libphonenumber-js'
import examples from 'libphonenumber-js/mobile/examples'

// Country data with flag emojis
interface CountryOption {
  code: CountryCode
  name: string
  dialCode: string
  flag: string
}

// Priority countries (military bases and common locations)
const PRIORITY_COUNTRIES: CountryCode[] = ['US', 'JP', 'DE', 'IT', 'KR', 'ES', 'GB']

// All supported countries with their data
const COUNTRIES: CountryOption[] = [
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'AF', name: 'Afghanistan', dialCode: '+93', flag: '🇦🇫' },
  { code: 'AL', name: 'Albania', dialCode: '+355', flag: '🇦🇱' },
  { code: 'DZ', name: 'Algeria', dialCode: '+213', flag: '🇩🇿' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹' },
  { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' },
  { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'BG', name: 'Bulgaria', dialCode: '+359', flag: '🇧🇬' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
  { code: 'HR', name: 'Croatia', dialCode: '+385', flag: '🇭🇷' },
  { code: 'CY', name: 'Cyprus', dialCode: '+357', flag: '🇨🇾' },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420', flag: '🇨🇿' },
  { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
  { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'GR', name: 'Greece', dialCode: '+30', flag: '🇬🇷' },
  { code: 'GU', name: 'Guam', dialCode: '+1', flag: '🇬🇺' },
  { code: 'HK', name: 'Hong Kong', dialCode: '+852', flag: '🇭🇰' },
  { code: 'HU', name: 'Hungary', dialCode: '+36', flag: '🇭🇺' },
  { code: 'IS', name: 'Iceland', dialCode: '+354', flag: '🇮🇸' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
  { code: 'IQ', name: 'Iraq', dialCode: '+964', flag: '🇮🇶' },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪' },
  { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱' },
  { code: 'JO', name: 'Jordan', dialCode: '+962', flag: '🇯🇴' },
  { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼' },
  { code: 'LV', name: 'Latvia', dialCode: '+371', flag: '🇱🇻' },
  { code: 'LT', name: 'Lithuania', dialCode: '+370', flag: '🇱🇹' },
  { code: 'LU', name: 'Luxembourg', dialCode: '+352', flag: '🇱🇺' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿' },
  { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴' },
  { code: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
  { code: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
  { code: 'PR', name: 'Puerto Rico', dialCode: '+1', flag: '🇵🇷' },
  { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦' },
  { code: 'RO', name: 'Romania', dialCode: '+40', flag: '🇷🇴' },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'SK', name: 'Slovakia', dialCode: '+421', flag: '🇸🇰' },
  { code: 'SI', name: 'Slovenia', dialCode: '+386', flag: '🇸🇮' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭' },
  { code: 'TW', name: 'Taiwan', dialCode: '+886', flag: '🇹🇼' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
  { code: 'UA', name: 'Ukraine', dialCode: '+380', flag: '🇺🇦' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
]

// Sort countries: priority first, then alphabetical
function getSortedCountries(): CountryOption[] {
  const prioritySet = new Set(PRIORITY_COUNTRIES)
  const priority = COUNTRIES.filter((c) => prioritySet.has(c.code))
  const rest = COUNTRIES.filter((c) => !prioritySet.has(c.code)).sort((a, b) =>
    a.name.localeCompare(b.name)
  )
  return [...priority, ...rest]
}

const SORTED_COUNTRIES = getSortedCountries()

/**
 * Normalize phone value to E.164 format for backward compatibility
 * Handles legacy US phone numbers stored as digits or formatted strings
 */
function normalizePhoneValue(value: string | null | undefined): string {
  if (!value) return ''
  if (value.startsWith('+')) return value // Already E.164

  // Legacy format - assume US number
  const digits = value.replace(/\D/g, '')
  return digits ? `+1${digits}` : ''
}

interface InternationalPhoneInputProps {
  value: string // E.164 format or empty (legacy formats auto-converted)
  onChange: (value: string) => void // Returns E.164 format
  error?: string
  disabled?: boolean
  label?: string
  hint?: string
  className?: string
}

export function InternationalPhoneInput({
  value,
  onChange,
  error,
  disabled,
  label,
  hint,
  className,
}: InternationalPhoneInputProps) {
  const generatedId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(SORTED_COUNTRIES[0])
  const [inputValue, setInputValue] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Parse initial value and set country/input
  // Handles backward compatibility for legacy US phone formats
  useEffect(() => {
    if (value) {
      // Normalize legacy formats to E.164 (e.g., "(800) 555-1234" → "+18005551234")
      const normalizedValue = normalizePhoneValue(value)

      const parsed = parsePhoneNumberFromString(normalizedValue)
      if (parsed && parsed.country) {
        const country = SORTED_COUNTRIES.find((c) => c.code === parsed.country)
        if (country) {
          setSelectedCountry(country)
          // Format national number for display
          setInputValue(parsed.formatNational())
        }
      } else if (normalizedValue.startsWith('+')) {
        // Try to parse as E.164 without country hint
        setInputValue(normalizedValue)
      } else if (normalizedValue) {
        // Fallback: display as-is
        setInputValue(normalizedValue)
      }

      // If the original value was in legacy format, notify parent of normalized value
      if (normalizedValue && normalizedValue !== value) {
        onChange(normalizedValue)
      }
    }
  }, []) // Only run on mount

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get placeholder for selected country
  function getPlaceholder(): string {
    try {
      const example = getExampleNumber(selectedCountry.code, examples)
      if (example) {
        return example.formatNational()
      }
    } catch {
      // Fall back to generic placeholder
    }
    return selectedCountry.code === 'US' ? '(555) 123-4567' : 'Phone number'
  }

  // Format input as user types
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = e.target.value

    // Use AsYouType formatter for the selected country
    const formatter = new AsYouType(selectedCountry.code)
    const formatted = formatter.input(rawValue)
    setInputValue(formatted)

    // Validate and convert to E.164
    const fullNumber = `${selectedCountry.dialCode}${rawValue.replace(/\D/g, '')}`

    if (rawValue.replace(/\D/g, '').length === 0) {
      // Empty input is valid (optional field)
      setValidationError(null)
      onChange('')
      return
    }

    // Check if valid for this country
    const isValid = isValidPhoneNumber(fullNumber)
    const parsed = parsePhoneNumberFromString(fullNumber)

    if (parsed && isValid) {
      setValidationError(null)
      onChange(parsed.format('E.164'))
    } else {
      // Show error only if they've typed enough digits
      const digits = rawValue.replace(/\D/g, '')
      if (digits.length >= 6) {
        setValidationError(`Invalid phone number for ${selectedCountry.name}`)
      } else {
        setValidationError(null)
      }
      // Still store partial value with country code
      if (parsed) {
        onChange(parsed.format('E.164'))
      } else {
        onChange(`+${getCountryCallingCode(selectedCountry.code)}${digits}`)
      }
    }
  }

  // Handle country selection
  function handleCountrySelect(country: CountryOption) {
    setSelectedCountry(country)
    setIsOpen(false)

    // Re-validate with new country
    const digits = inputValue.replace(/\D/g, '')
    if (digits.length > 0) {
      const fullNumber = `${country.dialCode}${digits}`
      const isValid = isValidPhoneNumber(fullNumber)
      const parsed = parsePhoneNumberFromString(fullNumber)

      if (parsed && isValid) {
        setValidationError(null)
        setInputValue(parsed.formatNational())
        onChange(parsed.format('E.164'))
      } else {
        if (digits.length >= 6) {
          setValidationError(`Invalid phone number for ${country.name}`)
        }
        onChange(`+${getCountryCallingCode(country.code)}${digits}`)
      }
    }

    // Focus input after selection
    inputRef.current?.focus()
  }

  const displayError = error || validationError

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label
          htmlFor={generatedId}
          className="block font-heading text-xs md:text-xs font-semibold uppercase tracking-wider text-text-muted"
        >
          {label}
        </label>
      )}

      <div className="relative flex" ref={dropdownRef}>
        {/* Country Selector Button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'flex items-center gap-1.5 px-3 py-3.5 md:py-3',
            'bg-bg-secondary border border-border border-r-0 rounded-l-lg md:rounded-l-md',
            'text-base md:text-sm',
            'min-h-[48px] md:min-h-[44px]',
            'transition-all',
            'hover:bg-bg-tertiary',
            'focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/25 focus:z-10',
            disabled && 'opacity-50 cursor-not-allowed',
            displayError && 'border-status-red'
          )}
          aria-label={`Select country: ${selectedCountry.name}`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="text-lg leading-none">{selectedCountry.flag}</span>
          <span className="text-text-muted font-mono text-sm">{selectedCountry.dialCode}</span>
          <svg
            className={cn('w-4 h-4 text-text-dim transition-transform', isOpen && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Phone Input */}
        <input
          ref={inputRef}
          id={generatedId}
          type="tel"
          autoComplete="tel"
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder={getPlaceholder()}
          className={cn(
            'flex-1 bg-bg-secondary border border-border rounded-r-lg md:rounded-r-md text-text placeholder:text-text-dim transition-all',
            'px-4 py-3.5 text-base',
            'md:py-3 md:text-sm',
            'focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none focus:z-10',
            'min-h-[48px] md:min-h-[44px]',
            disabled && 'opacity-50 cursor-not-allowed',
            displayError && 'border-status-red focus:border-status-red focus:ring-status-red/25'
          )}
        />

        {/* Dropdown */}
        {isOpen && (
          <div
            className={cn(
              'absolute top-full left-0 z-50 mt-1',
              'w-72 max-h-64 overflow-y-auto',
              'bg-bg-secondary border border-border rounded-lg shadow-lg',
              'py-1'
            )}
            role="listbox"
            aria-label="Select country"
          >
            {SORTED_COUNTRIES.map((country, index) => (
              <button
                key={country.code}
                type="button"
                onClick={() => handleCountrySelect(country)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5',
                  'text-left text-sm',
                  'hover:bg-gold/10 transition-colors',
                  'focus:outline-none focus:bg-gold/10',
                  selectedCountry.code === country.code && 'bg-gold/5',
                  // Add separator after priority countries
                  index === PRIORITY_COUNTRIES.length - 1 && 'border-b border-border mb-1 pb-3'
                )}
                role="option"
                aria-selected={selectedCountry.code === country.code}
              >
                <span className="text-lg leading-none">{country.flag}</span>
                <span className="flex-1 text-text">{country.name}</span>
                <span className="text-text-muted font-mono text-xs">{country.dialCode}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {hint && !displayError && <p className="text-xs text-text-dim">{hint}</p>}
      {displayError && <p className="text-xs text-status-red">{displayError}</p>}
    </div>
  )
}

export default InternationalPhoneInput
