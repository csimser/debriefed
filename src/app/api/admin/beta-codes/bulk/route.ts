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

// Generate a random code
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'BETA-'
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// POST - Create multiple codes
export async function POST(request: NextRequest) {
  const authClient = await createClient()

  const auth = await verifyAdmin(authClient)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const body = await request.json()
    const { count } = body

    // Validate count (1-100)
    const codeCount = Math.min(Math.max(parseInt(count) || 1, 1), 100)

    // Generate unique codes
    const codes: string[] = []
    const usedCodes = new Set<string>()

    while (codes.length < codeCount) {
      const code = generateCode()
      if (!usedCodes.has(code)) {
        usedCodes.add(code)
        codes.push(code)
      }
    }

    // Prepare insert data with all fields
    const now = new Date().toISOString()
    const insertData = codes.map(code => ({
      code,
      used: false,
      used_by: null,
      used_at: null,
      created_at: now,
    }))

    console.log('Bulk inserting beta codes:', insertData.length, 'codes')

    // Insert all codes using service client
    const { data, error } = await serviceClient
      .from('beta_codes')
      .insert(insertData)
      .select()

    if (error) {
      console.error('Error creating bulk codes:', error?.code || 'unknown')
      return NextResponse.json({ error: 'Failed to create codes' }, { status: 400 })
    }

    if (!data || data.length === 0) {
      console.error('No data returned from bulk insert')
      return NextResponse.json({ error: 'Insert succeeded but no data returned' }, { status: 500 })
    }

    console.log('Bulk beta codes created successfully:', data.length, 'codes')

    // Log bulk creation
    await logAdminAction(auth.user.id, 'beta_codes_bulk_created', {
      admin_email: auth.adminProfile.email,
      count: codeCount,
      codes: codes,
    })

    return NextResponse.json({
      message: `Successfully created ${codeCount} codes`,
      codes: data,
    })
  } catch (error) {
    console.error('Error creating bulk beta codes:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
