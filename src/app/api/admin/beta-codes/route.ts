import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

// Service role client bypasses RLS for admin queries
const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper to verify admin
async function verifyAdmin(authClient: any) {
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return { error: 'Unauthorized', status: 401 }

  // Use service client to check admin status (bypasses RLS)
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('is_admin, email')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) return { error: 'Forbidden - Admin only', status: 403 }

  return { user, adminProfile: profile }
}

// Helper to log admin actions (uses service client)
async function logAdminAction(
  adminUserId: string,
  action: string,
  details: Record<string, any>
) {
  try {
    await serviceClient.from('activity_log').insert({
      user_id: adminUserId,
      action,
      details: {
        ...details,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Failed to log admin action:', error)
  }
}

// GET - List all beta codes
export async function GET(request: NextRequest) {
  const authClient = await createClient()

  const auth = await verifyAdmin(authClient)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  // Get all codes (using service client to bypass RLS)
  const { data: codes, error: codesError } = await serviceClient
    .from('beta_codes')
    .select('id, code, used, used_by, used_at, created_at, revoked, revoked_at, revoked_reason')
    .order('created_at', { ascending: false })

  if (codesError) {
    console.error('Error fetching beta codes:', codesError)
    return NextResponse.json({ error: 'Failed to fetch codes' }, { status: 500 })
  }

  // Get user emails for codes that have been used
  const usedCodes = (codes || []).filter(c => c.used && c.used_by)
  const userIds = usedCodes.map(c => c.used_by)

  let userEmails: Record<string, string> = {}
  if (userIds.length > 0) {
    const { data: profiles } = await serviceClient
      .from('profiles')
      .select('user_id, email')
      .in('user_id', userIds)

    if (profiles) {
      userEmails = profiles.reduce((acc, p) => {
        acc[p.user_id] = p.email
        return acc
      }, {} as Record<string, string>)
    }
  }

  // Attach email to codes
  const codesWithEmail = (codes || []).map(c => ({
    ...c,
    used_by_email: c.used_by ? userEmails[c.used_by] || null : null
  }))

  return NextResponse.json({
    codes: codesWithEmail,
  })
}

// POST - Create a single code
export async function POST(request: NextRequest) {
  const authClient = await createClient()

  const auth = await verifyAdmin(authClient)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const body = await request.json()
    const { code } = body

    // Generate code if not provided
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let generatedCode = code || 'BETA-'
    if (!code) {
      for (let i = 0; i < 8; i++) {
        generatedCode += chars.charAt(Math.floor(Math.random() * chars.length))
      }
    }

    // Use service client to bypass RLS
    const insertData = {
      code: generatedCode.toUpperCase(),
      used: false,
      used_by: null,
      used_at: null,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await serviceClient
      .from('beta_codes')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Error inserting beta code:', error?.code || 'unknown')
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Code already exists' }, { status: 400 })
      }
      return NextResponse.json({ error: 'Failed to create code' }, { status: 400 })
    }

    if (!data) {
      console.error('No data returned from insert')
      return NextResponse.json({ error: 'Insert succeeded but no data returned' }, { status: 500 })
    }

    console.log('Beta code created successfully:', data)

    // Log creation
    await logAdminAction(auth.user.id, 'beta_code_created', {
      admin_email: auth.adminProfile.email,
      code: generatedCode,
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating beta code:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PATCH - Revoke or reinstate a beta code
export async function PATCH(request: NextRequest) {
  const authClient = await createClient()

  const auth = await verifyAdmin(authClient)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { codeId, action, reason } = await request.json()

    if (!codeId || !action) {
      return NextResponse.json({ error: 'codeId and action required' }, { status: 400 })
    }

    // Get the code
    const { data: betaCode, error: fetchError } = await serviceClient
      .from('beta_codes')
      .select('*')
      .eq('id', codeId)
      .single()

    if (fetchError || !betaCode) {
      return NextResponse.json({ error: 'Code not found' }, { status: 404 })
    }

    if (action === 'revoke') {
      // Mark code as revoked
      const { error: updateError } = await serviceClient
        .from('beta_codes')
        .update({
          revoked: true,
          revoked_at: new Date().toISOString(),
          revoked_reason: reason || 'Admin revoked'
        })
        .eq('id', codeId)

      if (updateError) {
        console.error('Failed to revoke beta code:', updateError)
        return NextResponse.json({ error: 'Failed to revoke code' }, { status: 500 })
      }

      // Downgrade the user if code was used
      if (betaCode.used && betaCode.used_by) {
        await serviceClient
          .from('profiles')
          .update({
            subscription_tier: 'free',
            plan: 'free',
            plan_expires_at: null
          })
          .eq('user_id', betaCode.used_by)

        console.log(`Revoked access for user ${betaCode.used_by} (code: ${betaCode.code})`)
      }

      // Log action
      await logAdminAction(auth.user.id, 'beta_code_revoked', {
        admin_email: auth.adminProfile.email,
        code: betaCode.code,
        user_affected: betaCode.used_by,
        reason: reason || 'Admin revoked'
      })

      return NextResponse.json({
        success: true,
        message: 'Code revoked and user downgraded to free tier'
      })
    }

    if (action === 'reinstate') {
      // Remove revoked status
      const { error: updateError } = await serviceClient
        .from('beta_codes')
        .update({
          revoked: false,
          revoked_at: null,
          revoked_reason: null
        })
        .eq('id', codeId)

      if (updateError) {
        console.error('Failed to reinstate beta code:', updateError)
        return NextResponse.json({ error: 'Failed to reinstate code' }, { status: 500 })
      }

      // Log action
      await logAdminAction(auth.user.id, 'beta_code_reinstated', {
        admin_email: auth.adminProfile.email,
        code: betaCode.code
      })

      return NextResponse.json({
        success: true,
        message: 'Code reinstated'
      })
    }

    return NextResponse.json({ error: 'Invalid action. Use "revoke" or "reinstate"' }, { status: 400 })
  } catch (error) {
    console.error('Error in PATCH beta code:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
