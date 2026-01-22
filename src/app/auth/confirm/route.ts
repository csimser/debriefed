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

      // For email verification, handle beta tier upgrade
      if (type === 'email') {
        try {
          // Get the current user (session is established after verifyOtp)
          const { data: { user } } = await supabase.auth.getUser()

          if (user) {
            const metadata = user.user_metadata || {}
            const betaCodeUsed = metadata.beta_code_used === true

            console.log('Email confirmation - User:', user.id, 'Beta code used:', betaCodeUsed)

            if (betaCodeUsed) {
              const planExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()

              // Update profile tier for beta users
              const { error: updateError } = await supabase
                .from('profiles')
                .update({
                  tier: 'full',
                  subscription_tier: 'full',
                  plan: 'full',
                  plan_expires_at: planExpiresAt,
                  updated_at: new Date().toISOString(),
                })
                .eq('user_id', user.id)

              if (updateError) {
                console.error('Failed to update beta user tier:', updateError)
              } else {
                console.log('Successfully updated beta user tier to full for user:', user.id)
              }
            }
          }
        } catch (err) {
          console.error('Error updating beta tier during email confirmation:', err)
        }
      }

      // Redirect to login with success message
      return NextResponse.redirect(`${origin}/login?confirmed=true`)
    }

    console.error('OTP verification failed:', error.message)
  }

  // Verification failed - redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=verification_failed`)
}
