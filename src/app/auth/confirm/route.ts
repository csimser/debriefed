import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Handle token-based email verification.
 * This route is used when the email template uses:
 * {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as 'email' | 'recovery' | 'invite' | 'magiclink' | null
  const next = searchParams.get('next') ?? '/dashboard'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      // Successfully verified - redirect based on type
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/reset-password`)
      }

      // Redirect to login with success message
      return NextResponse.redirect(`${origin}/login?confirmed=true`)
    }

    console.error('OTP verification failed:', error.message)
  }

  // Verification failed - redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=verification_failed`)
}
