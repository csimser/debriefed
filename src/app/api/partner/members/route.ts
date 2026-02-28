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

// GET /api/partner/members — list members of the admin's org
export async function GET() {
  const supabase = await createClient()
  const auth = await verifyPartnerAdmin(supabase)
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { orgId } = auth

  // Get all members
  const { data: members } = await serviceClient
    .from('organization_members')
    .select('id, user_id, role, created_at')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })

  const userIds = members?.map(m => m.user_id) || []

  // Get profiles
  const { data: profiles } = await serviceClient
    .from('profiles')
    .select('user_id, email, first_name, last_name, created_at, last_login_at')
    .in('user_id', userIds)

  // Get usage stats
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

  const membersWithDetails = members?.map(m => {
    const profile = profileMap[m.user_id]
    const usage = usageMap[m.user_id] || {}
    return {
      id: m.id,
      user_id: m.user_id,
      role: m.role,
      member_since: m.created_at,
      email: profile?.email || '',
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      signup_date: profile?.created_at || m.created_at,
      last_active: profile?.last_login_at || null,
      resumes_created: resumeMap[m.user_id] || 0,
      jobs_analyzed: usage.job_match || 0,
      cover_letters: usage.cover_letters || 0,
    }
  })

  return NextResponse.json({ members: membersWithDetails })
}
