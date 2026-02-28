import { NextResponse } from 'next/server'
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

// GET /api/partner/members/export — download CSV of all members with usage stats
export async function GET() {
  const supabase = await createClient()
  const auth = await verifyPartnerAdmin(supabase)
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { orgId } = auth

  // Get members
  const { data: members } = await serviceClient
    .from('organization_members')
    .select('user_id, role, created_at')
    .eq('org_id', orgId)

  const userIds = members?.map(m => m.user_id) || []

  // Get profiles
  const { data: profiles } = await serviceClient
    .from('profiles')
    .select('user_id, email, first_name, last_name, created_at, last_login_at')
    .in('user_id', userIds)

  // Get usage
  const { data: usageStats } = await serviceClient
    .from('usage_tracking')
    .select('user_id, feature, count')
    .in('user_id', userIds)

  // Get resume counts
  const { data: resumeCounts } = await serviceClient
    .from('resumes')
    .select('user_id')
    .in('user_id', userIds)

  // Build maps
  const profileMap: Record<string, { email: string; first_name: string; last_name: string; created_at: string; last_login_at: string | null }> = {}
  profiles?.forEach(p => { profileMap[p.user_id] = p })

  const usageMap: Record<string, Record<string, number>> = {}
  usageStats?.forEach(u => {
    if (!usageMap[u.user_id]) usageMap[u.user_id] = {}
    usageMap[u.user_id][u.feature] = (usageMap[u.user_id][u.feature] || 0) + u.count
  })

  const resumeMap: Record<string, number> = {}
  resumeCounts?.forEach(r => {
    resumeMap[r.user_id] = (resumeMap[r.user_id] || 0) + 1
  })

  // Build CSV
  const headers = ['First Name', 'Last Name', 'Email', 'Role', 'Signup Date', 'Last Active', 'Resumes Created', 'Jobs Analyzed', 'Cover Letters']
  const rows = members?.map(m => {
    const p = profileMap[m.user_id]
    const u = usageMap[m.user_id] || {}
    return [
      p?.first_name || '',
      p?.last_name || '',
      p?.email || '',
      m.role,
      p?.created_at ? new Date(p.created_at).toLocaleDateString() : '',
      p?.last_login_at ? new Date(p.last_login_at).toLocaleDateString() : 'Never',
      resumeMap[m.user_id] || 0,
      u.job_match || 0,
      u.cover_letters || 0,
    ].map(val => `"${String(val).replace(/"/g, '""')}"`)
  }) || []

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="organization-members.csv"',
    },
  })
}
