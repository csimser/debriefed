import { createHmac } from 'crypto'

const SECRET = process.env.UNSUBSCRIBE_SECRET

function getSecret(): string {
  if (!SECRET) throw new Error('UNSUBSCRIBE_SECRET is not set')
  return SECRET
}

/** Generate an HMAC-signed unsubscribe token from an email address */
export function generateUnsubscribeToken(email: string): string {
  const hmac = createHmac('sha256', getSecret())
  hmac.update(email.toLowerCase().trim())
  return hmac.digest('hex')
}

/** Validate that a token matches the expected HMAC for the given email */
export function validateUnsubscribeToken(email: string, token: string): boolean {
  const expected = generateUnsubscribeToken(email)
  // Constant-time comparison to prevent timing attacks
  if (expected.length !== token.length) return false
  let mismatch = 0
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ token.charCodeAt(i)
  }
  return mismatch === 0
}

/** Generate a full unsubscribe URL for use in email templates */
export function getUnsubscribeUrl(email: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://getdebriefed.co'
  const token = generateUnsubscribeToken(email)
  const encodedEmail = encodeURIComponent(email.toLowerCase().trim())
  return `${baseUrl}/api/unsubscribe?email=${encodedEmail}&token=${token}`
}
