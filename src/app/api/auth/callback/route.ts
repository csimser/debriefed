import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getRankFromPaygrade } from '@/lib/constants/military'
import { trackUserIP, getClientIP } from '@/lib/ai-security'

/**
 * POST handler for profile setup after successful authentication.
 * Called by the client-side callback page after auth is complete.
 */
export async function POST(request: Request) {
  try {
    const { type } = await request.json()

    // Get IP and user agent for tracking
    const ip = getClientIP(new Headers(request.headers))
    const userAgent = request.headers.get('user-agent') || 'unknown'

    const supabase = await createClient()

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated', redirect: '/login?error=auth_failed' },
        { status: 401 }
      )
    }

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, onboarding_completed')
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

      // New user - redirect to verified page or onboarding
      if (type === 'signup' || type === 'email') {
        return NextResponse.json({ success: true, redirect: '/auth/verified', isNewUser: true })
      }
      return NextResponse.json({ success: true, redirect: '/onboarding', isNewUser: true })
    } else {
      // Existing user - track IP for login
      await trackUserIP(user.id, ip, userAgent, 'login')

      // Check if onboarding is complete
      if (!existingProfile.onboarding_completed) {
        return NextResponse.json({ success: true, redirect: '/onboarding', isNewUser: false })
      }

      return NextResponse.json({ success: true, redirect: '/dashboard', isNewUser: false })
    }
  } catch (error) {
    console.error('Callback API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal error', redirect: '/login?error=auth_failed' },
      { status: 500 }
    )
  }
}

/**
 * GET handler for legacy PKCE code exchange flow.
 * This handles direct redirects from Supabase with a code parameter.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const type = searchParams.get('type')

  // If no code, redirect to the client-side callback page to handle hash fragments
  if (!code) {
    const params = new URLSearchParams()
    if (type) params.set('type', type)
    if (next !== '/dashboard') params.set('next', next)
    const queryString = params.toString()
    return NextResponse.redirect(`${origin}/auth/callback${queryString ? '?' + queryString : ''}`)
  }

  // Get IP and user agent for tracking
  const ip = getClientIP(new Headers(request.headers))
  const userAgent = request.headers.get('user-agent') || 'unknown'

  const supabase = await createClient()

  // Exchange code for session
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    console.error('Code exchange failed:', error.message)
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }

  // For recovery flow, redirect to reset-password
  if (type === 'recovery') {
    return NextResponse.redirect(`${origin}/reset-password`)
  }

  // Get the user
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, onboarding_completed')
      .eq('user_id', user.id)
      .single()

    if (!existingProfile) {
      // Create profile from user metadata
      const metadata = user.user_metadata || {}

      const fullName = metadata.full_name || ''
      const firstName = metadata.first_name || fullName.trim().split(' ')[0] || ''
      const lastName = metadata.last_name || fullName.trim().split(' ').slice(1).join(' ') || ''
      const branch = metadata.branch || ''
      const paygrade = metadata.paygrade || ''
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

      // Track IP for new signup
      await trackUserIP(user.id, ip, userAgent, 'signup')

      // New user - redirect to verified page or onboarding
      if (type === 'signup' || type === 'email') {
        return NextResponse.redirect(`${origin}/auth/verified`)
      }
      return NextResponse.redirect(`${origin}/onboarding`)
    } else {
      // Existing user - track IP for login
      await trackUserIP(user.id, ip, userAgent, 'login')

      // Check if onboarding is complete
      if (!existingProfile.onboarding_completed) {
        return NextResponse.redirect(`${origin}/onboarding`)
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
