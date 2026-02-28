import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function verifyPartnerAdmin(authClient: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return { error: 'Unauthorized', status: 401 }

  const { data: membership } = await serviceClient
    .from('organization_members')
    .select('org_id, role')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .single()

  if (!membership) return { error: 'Not an organization admin', status: 403 }
  return { user, orgId: membership.org_id }
}

// GET /api/partner/org — get org info
export async function GET() {
  const supabase = await createClient()
  const auth = await verifyPartnerAdmin(supabase)
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { data: org, error } = await serviceClient
    .from('organizations')
    .select('*')
    .eq('id', auth.orgId)
    .single()

  if (error || !org) return NextResponse.json({ error: 'Organization not found' }, { status: 404 })

  // Get seat count
  const { count } = await serviceClient
    .from('organization_members')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', auth.orgId)

  // Get active users this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: members } = await serviceClient
    .from('organization_members')
    .select('user_id')
    .eq('org_id', auth.orgId)

  const userIds = members?.map(m => m.user_id) || []
  const { count: activeCount } = await serviceClient
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .in('user_id', userIds)
    .gte('last_login_at', startOfMonth.toISOString())

  return NextResponse.json({
    organization: org,
    seats_used: count || 0,
    active_this_month: activeCount || 0,
  })
}

// PATCH /api/partner/org — update org settings (partner admin can only change cosmetic fields)
export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const auth = await verifyPartnerAdmin(supabase)
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const body = await request.json()
  // Partner admins can only update cosmetic/contact fields, not plan or seats
  const allowedFields = ['logo_url', 'primary_color', 'contact_email']
  const updates: Record<string, unknown> = {}

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field]
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const { data: org, error } = await serviceClient
    .from('organizations')
    .update(updates)
    .eq('id', auth.orgId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ organization: org })
}
