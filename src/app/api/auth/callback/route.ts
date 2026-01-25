import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getRankFromPaygrade } from '@/lib/constants/military'
import { trackUserIP, getClientIP } from '@/lib/ai-security'
import { capitalizeName } from '@/lib/formatName'

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

    // For email verification (signup), sign out and redirect to login
    // During beta period, users need a beta code to log in
    if (type === 'signup' || type === 'email') {
      await supabase.auth.signOut()
      return NextResponse.json({ success: true, redirect: '/login?confirmed=true', isNewUser: true })
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
      const rawFirstName = metadata.first_name || fullName.trim().split(' ')[0] || ''
      const rawLastName = metadata.last_name || fullName.trim().split(' ').slice(1).join(' ') || ''

      // Auto-capitalize names
      const firstName = capitalizeName(rawFirstName)
      const lastName = capitalizeName(rawLastName)

      // Branch is already stored in full format (e.g., "U.S. Navy") from signup
      const branch = metadata.branch || ''
      const paygrade = metadata.paygrade || ''

      // Auto-populate rank from paygrade
      const rank = branch && paygrade ? getRankFromPaygrade(branch, paygrade) : ''

      // Check if user signed up with a beta code - grant full tier for 48 hours
      const betaCodeUsed = metadata.beta_code_used === true
      const tier = betaCodeUsed ? 'full' : 'free'
      const planExpiresAt = betaCodeUsed
        ? new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
        : null

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
          tier: tier,
          subscription_tier: tier,
          plan: tier,
          plan_expires_at: planExpiresAt,
          onboarding_step: 0,
          onboarding_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      // Track IP for new signup (detect duplicate accounts)
      await trackUserIP(user.id, ip, userAgent, 'signup')

      // New user - redirect to login with confirmed message
      if (type === 'signup' || type === 'email') {
        return NextResponse.json({ success: true, redirect: '/login?confirmed=true', isNewUser: true })
      }
      return NextResponse.json({ success: true, redirect: '/onboarding', isNewUser: true })
    } else {
      // Profile exists (likely created by database trigger)
      const metadata = user.user_metadata || {}
      const betaCodeUsed = metadata.beta_code_used === true

      console.log('Callback POST - Profile exists. User:', user.id, 'Type:', type, 'Beta code used:', betaCodeUsed)

      // If user signed up with beta code, update their tier (trigger created profile with 'free')
      if (betaCodeUsed && (type === 'signup' || type === 'email')) {
        const planExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()

        console.log('Attempting to update profile to full tier for user:', user.id)

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
          console.error('Failed to update beta user profile tier:', updateError)
        } else {
          console.log('Successfully updated profile to full tier for user:', user.id)
        }

        // Track IP for new signup
        await trackUserIP(user.id, ip, userAgent, 'signup')

        // Redirect to login with confirmed message
        return NextResponse.json({ success: true, redirect: '/login?confirmed=true', isNewUser: true })
      }

      // Regular login - track IP
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

  // For email verification (signup), sign out and redirect to login
  // During beta period, users need a beta code to log in
  if (type === 'signup' || type === 'email') {
    await supabase.auth.signOut()
    return NextResponse.redirect(`${origin}/login?confirmed=true`)
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
      const rawFirstName = metadata.first_name || fullName.trim().split(' ')[0] || ''
      const rawLastName = metadata.last_name || fullName.trim().split(' ').slice(1).join(' ') || ''

      // Auto-capitalize names
      const firstName = capitalizeName(rawFirstName)
      const lastName = capitalizeName(rawLastName)

      const branch = metadata.branch || ''
      const paygrade = metadata.paygrade || ''
      const rank = branch && paygrade ? getRankFromPaygrade(branch, paygrade) : ''

      // Check if user signed up with a beta code - grant full tier for 48 hours
      const betaCodeUsed = metadata.beta_code_used === true
      const tier = betaCodeUsed ? 'full' : 'free'
      const planExpiresAt = betaCodeUsed
        ? new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
        : null

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
          tier: tier,
          subscription_tier: tier,
          plan: tier,
          plan_expires_at: planExpiresAt,
          onboarding_step: 0,
          onboarding_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      // Track IP for new signup
      await trackUserIP(user.id, ip, userAgent, 'signup')

      // New user - redirect to login with confirmed message
      if (type === 'signup' || type === 'email') {
        return NextResponse.redirect(`${origin}/login?confirmed=true`)
      }
      return NextResponse.redirect(`${origin}/onboarding`)
    } else {
      // Profile exists (likely created by database trigger)
      const metadata = user.user_metadata || {}
      const betaCodeUsed = metadata.beta_code_used === true

      console.log('Callback GET - Profile exists. User:', user.id, 'Type:', type, 'Beta code used:', betaCodeUsed)

      // If user signed up with beta code, update their tier (trigger created profile with 'free')
      if (betaCodeUsed && (type === 'signup' || type === 'email')) {
        const planExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()

        console.log('GET handler - Attempting to update profile to full tier for user:', user.id)

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
          console.error('GET handler - Failed to update beta user profile tier:', updateError)
        } else {
          console.log('GET handler - Successfully updated profile to full tier for user:', user.id)
        }

        // Track IP for new signup
        await trackUserIP(user.id, ip, userAgent, 'signup')

        // Redirect to login with confirmed message
        return NextResponse.redirect(`${origin}/login?confirmed=true`)
      }

      // Regular login - track IP
      await trackUserIP(user.id, ip, userAgent, 'login')

      // Check if onboarding is complete
      if (!existingProfile.onboarding_completed) {
        return NextResponse.redirect(`${origin}/onboarding`)
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
