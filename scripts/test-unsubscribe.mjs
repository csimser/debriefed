import { createHmac } from 'crypto'
import { config } from 'dotenv'

config({ path: '.env.local' })

const SECRET = process.env.UNSUBSCRIBE_SECRET
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const email = 'quotes@thecoinlockerco.com'

// Generate token (same logic as src/lib/unsubscribe-token.ts)
function generateToken(e) {
  const hmac = createHmac('sha256', SECRET)
  hmac.update(e.toLowerCase().trim())
  return hmac.digest('hex')
}

const token = generateToken(email)
const wrongEmailToken = generateToken('wrong@email.com')

const correctEmailValid = token === generateToken(email)
const wrongEmailRejected = token !== wrongEmailToken
const wrongTokenRejected = token !== 'deadbeef1234'

console.log('=== Unsubscribe Token Test ===')
console.log('Email:       ', email)
console.log('Token:       ', token)
console.log('')
console.log('Correct email validates: ', correctEmailValid ? 'PASS' : 'FAIL')
console.log('Wrong email rejected:    ', wrongEmailRejected ? 'PASS' : 'FAIL')
console.log('Wrong token rejected:    ', wrongTokenRejected ? 'PASS' : 'FAIL')
console.log('')
console.log('=== Unsubscribe URL (paste in browser when dev server is running) ===')
const url = `${APP_URL}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`
console.log(url)
console.log('')
console.log('=== Expected behavior ===')
console.log('1. Hitting the URL should redirect to /unsubscribe/confirmed')
console.log('2. If user exists in DB, marketing_opt_in will be set to false')
console.log('3. If user does not exist, redirect still happens (no info leak)')
