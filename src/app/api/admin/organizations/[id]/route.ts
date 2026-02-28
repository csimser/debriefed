import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { verifyAdmin } from '@/lib/admin-auth'

const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/admin/organizations/[id] — get org detail with members + usage
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await verifyAdmin()
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  // Fetch org
  const { data: org, error: orgError } = await serviceClient
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single()

  if (orgError || !org) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
  }

  // Fetch members with profile info
  const { data: members } = await serviceClient
    .from('organization_members')
    .select('id, user_id, role, created_at')
    .eq('org_id', id)

  // Get profiles for members
  const userIds = members?.map(m => m.user_id) || []
  const { data: profiles } = await serviceClient
    .from('profiles')
    .select('user_id, email, first_name, last_name, created_at, last_login_at')
    .in('user_id', userIds)

  // Get usage stats for members
  const { data: usageStats } = await serviceClient
    .from('usage_tracking')
    .select('user_id, feature, count')
    .in('user_id', userIds)

  // Build usage map
  const usageMap: Record<string, Record<string, number>> = {}
  usageStats?.forEach(u => {
    if (!usageMap[u.user_id]) usageMap[u.user_id] = {}
    usageMap[u.user_id][u.feature] = (usageMap[u.user_id][u.feature] || 0) + u.count
  })

  // Build profile map
  const profileMap: Record<string, typeof profiles extends (infer T)[] | null ? T : never> = {}
  profiles?.forEach(p => { profileMap[p.user_id] = p })

  const membersWithDetails = members?.map(m => ({
    ...m,
    profile: profileMap[m.user_id] || null,
    usage: usageMap[m.user_id] || {},
  }))

  return NextResponse.json({
    organization: org,
    members: membersWithDetails,
    seats_used: members?.length || 0,
  })
}

// PATCH /api/admin/organizations/[id] — update org settings
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await verifyAdmin()
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const body = await request.json()
  const allowedFields = ['name', 'logo_url', 'primary_color', 'contact_email', 'plan', 'max_seats']
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
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ organization: org })
}
