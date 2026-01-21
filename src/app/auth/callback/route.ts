import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getRankFromPaygrade } from '@/lib/constants/military'
import { trackUserIP, getClientIP } from '@/lib/ai-security'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const type = searchParams.get('type')

  // Get IP and user agent for tracking
  const ip = getClientIP(new Headers(request.headers))
  const userAgent = request.headers.get('user-agent') || 'unknown'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Handle password recovery separately
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/reset-password`)
      }

      // For all other cases (including signup/email), get the user and handle profile/beta code
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (!existingProfile) {
          // Create profile from user metadata
          const metadata = user.user_metadata || {}

          // Read first_name and last_name directly from metadata (new signup flow)
          // Fall back to parsing full_name for backwards compatibility
          const fullName = metadata.full_name || ''
          const firstName = metadata.first_name || fullName.trim().split(' ')[0] || ''
          const lastName = metadata.last_name || fullName.trim().split(' ').slice(1).join(' ') || ''

          // Branch is already stored in full format (e.g., "U.S. Navy") from signup
          const branch = metadata.branch || ''
          const paygrade = metadata.paygrade || ''

          // Auto-populate rank from paygrade
          const rank = branch && paygrade ? getRankFromPaygrade(branch, paygrade) : ''

          await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              email: user.email,
              first_name: firstName,
              last_name: lastName,
              full_name: fullName,
              branch,
              paygrade,
              rank,
              onboarding_step: 0,
              onboarding_completed: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })

          // Track IP for new signup (detect duplicate accounts)
          await trackUserIP(user.id, ip, userAgent, 'signup')

          // Beta code redemption is handled by BetaCodeRedeemer component in dashboard
          // when user reaches the dashboard after verification

          // New user - redirect to verified page or onboarding
          if (type === 'signup' || type === 'email') {
            return NextResponse.redirect(`${origin}/auth/verified`)
          }
          return NextResponse.redirect(`${origin}/onboarding`)
        } else {
          // Existing user - track IP for login
          await trackUserIP(user.id, ip, userAgent, 'login')

          // Beta code redemption is handled by BetaCodeRedeemer component in dashboard

          // Check if onboarding is complete
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('user_id', user.id)
            .single()

          if (!profile?.onboarding_completed) {
            return NextResponse.redirect(`${origin}/onboarding`)
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Auth error - redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
