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

// GET - List all promo codes with redemption info
export async function GET(request: NextRequest) {
  const authClient = await createClient()

  const auth = await verifyAdmin(authClient)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  // Get all codes using service client to bypass RLS
  const { data: codes, error: codesError } = await serviceClient
    .from('promo_codes')
    .select('id, code, discount_percent, applies_to, max_uses, current_uses, expires_at, created_at')
    .order('created_at', { ascending: false })

  if (codesError) {
    console.error('Error fetching promo codes:', codesError)
    return NextResponse.json({ error: 'Failed to fetch codes' }, { status: 500 })
  }

  // Get recent redemptions using service client
  const { data: redemptions } = await serviceClient
    .from('promo_redemptions')
    .select('id, code, user_id, redeemed_at')
    .order('redeemed_at', { ascending: false })
    .limit(20)

  // Get user emails for redemptions
  let userEmails: Record<string, string> = {}
  if (redemptions && redemptions.length > 0) {
    const userIds = redemptions.map(r => r.user_id)
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

  // Format redemptions with email
  const formattedRedemptions = (redemptions || []).map((r: any) => ({
    id: r.id,
    code: r.code,
    email: userEmails[r.user_id] || 'Unknown',
    redeemed_at: r.redeemed_at,
  }))

  return NextResponse.json({
    codes: codes || [],
    recentRedemptions: formattedRedemptions,
  })
}

// POST - Create a promo code
export async function POST(request: NextRequest) {
  const authClient = await createClient()

  const auth = await verifyAdmin(authClient)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const body = await request.json()
    const { code, discount_percent, applies_to, max_uses, expires_at } = body

    // Generate code if not provided
    const finalCode = code || `PROMO${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Validate discount percent
    const discount = parseInt(discount_percent)
    if (isNaN(discount) || discount < 1 || discount > 100) {
      return NextResponse.json({ error: 'Discount must be between 1 and 100' }, { status: 400 })
    }

    // Validate applies_to
    const validAppliesTo = ['core', 'full', 'all']
    if (!validAppliesTo.includes(applies_to)) {
      return NextResponse.json({ error: 'Invalid applies_to value' }, { status: 400 })
    }

    // Use service client to insert (bypasses RLS)
    const { data, error } = await serviceClient
      .from('promo_codes')
      .insert({
        code: finalCode.toUpperCase(),
        discount_percent: discount,
        applies_to,
        max_uses: max_uses ? parseInt(max_uses) : null,
        current_uses: 0,
        expires_at: expires_at || null,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Code already exists' }, { status: 400 })
      }
      console.error('Error creating promo code:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Log creation
    await logAdminAction(auth.user.id, 'promo_code_created', {
      admin_email: auth.adminProfile.email,
      code: finalCode,
      discount_percent: discount,
      applies_to,
      max_uses: max_uses || 'unlimited',
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating promo code:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
