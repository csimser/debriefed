import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

// Service role client for database operations (bypasses RLS)
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * GET /api/beta/check
 * Check if the authenticated user has a valid (non-expired) redeemed beta code.
 * Used during login to determine if beta code input is required.
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { hasValidAccess: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const now = new Date().toISOString()

    // Check if user has a valid (non-expired) redeemed beta code
    const { data: betaCode, error } = await supabaseAdmin
      .from('beta_codes')
      .select('id, code, expires_at')
      .eq('used_by', user.id)
      .gt('expires_at', now)
      .not('revoked', 'eq', true)
      .single()

    if (error || !betaCode) {
      // No valid beta code found
      return NextResponse.json({
        hasValidAccess: false,
        reason: 'no_valid_code'
      })
    }

    // User has valid beta access
    return NextResponse.json({
      hasValidAccess: true,
      expiresAt: betaCode.expires_at
    })

  } catch (err) {
    console.error('Beta check error:', err)
    return NextResponse.json(
      { hasValidAccess: false, error: 'Check failed' },
      { status: 500 }
    )
  }
}
