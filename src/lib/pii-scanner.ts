/**
 * PII Scanner for Debriefed
 * Scans text for sensitive personally identifiable information
 */

export interface PIIScanResult {
  hasCriticalPII: boolean
  hasMinorPII: boolean
  criticalTypes: string[]
  minorTypes: string[]
  redactedText: string
  details: PIIMatch[]
}

export interface PIIMatch {
  type: string
  severity: 'critical' | 'minor'
  match: string
  redacted: string
}

// Regex patterns for different PII types
const PII_PATTERNS = {
  // Critical PII - HARD REJECT
  ssn: {
    pattern: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g,
    name: 'Social Security Number',
    severity: 'critical' as const,
  },
  dodid: {
    pattern: /\b\d{10}\b/g,
    name: 'DODID',
    severity: 'critical' as const,
    // Additional context check - 10 digits near DOD/ID keywords
    contextPattern: /(?:dod\s*id|dodid|edipi|dod\s*identification|department\s+of\s+defense\s+id)[:\s#]*(\d{10})/gi,
  },
  edipi: {
    pattern: /\bedipi[:\s#]*\d{10}\b/gi,
    name: 'EDIPI',
    severity: 'critical' as const,
  },

  // Minor PII - auto-redact but allow processing
  phone: {
    pattern: /\b(?:\+1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b/g,
    name: 'Phone Number',
    severity: 'minor' as const,
  },
  email: {
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    name: 'Email Address',
    severity: 'minor' as const,
  },
  bankAccount: {
    pattern: /\b(?:account\s*(?:number|#|no\.?)?[:\s]*)?(?:\d{4}[-\s]?){2,4}\d{1,4}\b/gi,
    name: 'Bank Account Number',
    severity: 'minor' as const,
    // Only match if near banking keywords
    contextRequired: true,
    contextPattern: /(?:bank|account|routing|checking|savings)[:\s#]*(?:\d{4}[-\s]?){2,4}\d{1,4}/gi,
  },
  routingNumber: {
    pattern: /\b(?:routing\s*(?:number|#|no\.?)?[:\s]*)?\d{9}\b/gi,
    name: 'Routing Number',
    severity: 'minor' as const,
    contextRequired: true,
    contextPattern: /(?:routing|aba)[:\s#]*\d{9}/gi,
  },
  serviceNumber: {
    pattern: /\b(?:service\s*(?:number|#|no\.?)?[:\s]*)?[A-Z]?\d{6,8}[A-Z]?\b/gi,
    name: 'Service Number',
    severity: 'minor' as const,
    contextRequired: true,
    contextPattern: /(?:service\s*(?:number|#|no\.?))[:\s]*[A-Z]?\d{6,8}[A-Z]?/gi,
  },
}

/**
 * Scan text for PII and return results
 */
export function scanForPII(text: string): PIIScanResult {
  const details: PIIMatch[] = []
  let redactedText = text
  const criticalTypes: string[] = []
  const minorTypes: string[] = []

  // Check for SSN
  const ssnMatches = text.match(PII_PATTERNS.ssn.pattern)
  if (ssnMatches) {
    ssnMatches.forEach(match => {
      // Validate it looks like an SSN (not just any 9 digits)
      const cleaned = match.replace(/[-\s]/g, '')
      // SSNs don't start with 000, 666, or 900-999
      const first3 = parseInt(cleaned.substring(0, 3))
      if (first3 !== 0 && first3 !== 666 && first3 < 900) {
        details.push({
          type: 'SSN',
          severity: 'critical',
          match: match,
          redacted: '[SSN REDACTED]',
        })
        criticalTypes.push('SSN')
        redactedText = redactedText.replace(match, '[SSN REDACTED]')
      }
    })
  }

  // Check for DODID with context
  const dodidContextMatches = text.match(PII_PATTERNS.dodid.contextPattern!)
  if (dodidContextMatches) {
    dodidContextMatches.forEach(match => {
      details.push({
        type: 'DODID',
        severity: 'critical',
        match: match,
        redacted: '[DODID REDACTED]',
      })
      criticalTypes.push('DODID')
      redactedText = redactedText.replace(match, '[DODID REDACTED]')
    })
  }

  // Check for EDIPI
  const edipiMatches = text.match(PII_PATTERNS.edipi.pattern)
  if (edipiMatches) {
    edipiMatches.forEach(match => {
      details.push({
        type: 'EDIPI',
        severity: 'critical',
        match: match,
        redacted: '[EDIPI REDACTED]',
      })
      criticalTypes.push('EDIPI')
      redactedText = redactedText.replace(match, '[EDIPI REDACTED]')
    })
  }

  // Check for phone numbers (minor)
  const phoneMatches = text.match(PII_PATTERNS.phone.pattern)
  if (phoneMatches) {
    phoneMatches.forEach(match => {
      // Only flag if it looks like a real phone number
      const digits = match.replace(/\D/g, '')
      if (digits.length >= 10) {
        details.push({
          type: 'Phone',
          severity: 'minor',
          match: match,
          redacted: '[PHONE REDACTED]',
        })
        if (!minorTypes.includes('Phone')) minorTypes.push('Phone')
        redactedText = redactedText.replace(match, '[PHONE REDACTED]')
      }
    })
  }

  // Check for email addresses (minor)
  const emailMatches = text.match(PII_PATTERNS.email.pattern)
  if (emailMatches) {
    emailMatches.forEach(match => {
      details.push({
        type: 'Email',
        severity: 'minor',
        match: match,
        redacted: '[EMAIL REDACTED]',
      })
      if (!minorTypes.includes('Email')) minorTypes.push('Email')
      redactedText = redactedText.replace(match, '[EMAIL REDACTED]')
    })
  }

  // Check for bank accounts with context
  const bankMatches = text.match(PII_PATTERNS.bankAccount.contextPattern!)
  if (bankMatches) {
    bankMatches.forEach(match => {
      details.push({
        type: 'Bank Account',
        severity: 'minor',
        match: match,
        redacted: '[BANK ACCOUNT REDACTED]',
      })
      if (!minorTypes.includes('Bank Account')) minorTypes.push('Bank Account')
      redactedText = redactedText.replace(match, '[BANK ACCOUNT REDACTED]')
    })
  }

  return {
    hasCriticalPII: criticalTypes.length > 0,
    hasMinorPII: minorTypes.length > 0,
    criticalTypes: [...new Set(criticalTypes)],
    minorTypes: [...new Set(minorTypes)],
    redactedText,
    details,
  }
}

/**
 * Quick check if text contains critical PII (SSN or DODID)
 * Use this for fast rejection before full processing
 */
export function hasCriticalPII(text: string): { blocked: boolean; reason?: string } {
  // Check for SSN pattern
  const ssnMatches = text.match(PII_PATTERNS.ssn.pattern)
  if (ssnMatches) {
    for (const match of ssnMatches) {
      const cleaned = match.replace(/[-\s]/g, '')
      const first3 = parseInt(cleaned.substring(0, 3))
      if (first3 !== 0 && first3 !== 666 && first3 < 900) {
        return {
          blocked: true,
          reason: 'Document contains Social Security Number (SSN). Please redact and retry.',
        }
      }
    }
  }

  // Check for DODID with context
  if (PII_PATTERNS.dodid.contextPattern!.test(text)) {
    return {
      blocked: true,
      reason: 'Document contains DODID. Please redact and retry.',
    }
  }

  // Check for EDIPI
  if (PII_PATTERNS.edipi.pattern.test(text)) {
    return {
      blocked: true,
      reason: 'Document contains EDIPI. Please redact and retry.',
    }
  }

  return { blocked: false }
}

/**
 * Redact minor PII from text (phone, email) while allowing processing
 */
export function redactMinorPII(text: string): string {
  let redacted = text

  // Redact phone numbers
  const phoneMatches = text.match(PII_PATTERNS.phone.pattern)
  if (phoneMatches) {
    phoneMatches.forEach(match => {
      const digits = match.replace(/\D/g, '')
      if (digits.length >= 10) {
        redacted = redacted.replace(match, '[PHONE]')
      }
    })
  }

  // Redact email addresses
  const emailMatches = text.match(PII_PATTERNS.email.pattern)
  if (emailMatches) {
    emailMatches.forEach(match => {
      redacted = redacted.replace(match, '[EMAIL]')
    })
  }

  return redacted
}
