import { NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { verifyAdmin } from '@/lib/admin-auth'

// Service role client bypasses RLS for admin queries
const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const auth = await verifyAdmin()
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  // Calculate date ranges
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

  try {
    // Fetch security metrics in parallel
    const [
      abuseLogTodayResult,
      abuseLogWeekResult,
      abuseBySeverityResult,
      recentAbuseResult,
      rateLimitHitsResult,
      suspendedUsersResult,
    ] = await Promise.all([
      // Abuse incidents today
      serviceClient
        .from('abuse_log')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneDayAgo),

      // Abuse incidents this week
      serviceClient
        .from('abuse_log')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneWeekAgo),

      // Abuse by severity (last week)
      serviceClient
        .from('abuse_log')
        .select('severity')
        .gte('created_at', oneWeekAgo),

      // Recent abuse incidents
      serviceClient
        .from('abuse_log')
        .select('id, user_id, action, severity, details, created_at')
        .order('created_at', { ascending: false })
        .limit(20),

      // Rate limit hits (feature_limit_reached from activity_log)
      serviceClient
        .from('activity_log')
        .select('*', { count: 'exact', head: true })
        .eq('action', 'feature_limit_reached')
        .gte('created_at', oneWeekAgo),

      // Suspended users
      serviceClient
        .from('profiles')
        .select('user_id, email, suspended_at')
        .eq('suspended', true),
    ])

    // Calculate severity breakdown
    const severityCounts = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    }

    abuseBySeverityResult.data?.forEach((row: { severity: string }) => {
      if (row.severity in severityCounts) {
        severityCounts[row.severity as keyof typeof severityCounts]++
      }
    })

    // Get user emails for recent abuse incidents
    const recentAbuse = recentAbuseResult.data || []
    const userIds = [...new Set(recentAbuse.map((a: any) => a.user_id))]

    let userEmails: Record<string, string> = {}
    if (userIds.length > 0) {
      const { data: users } = await serviceClient
        .from('profiles')
        .select('user_id, email')
        .in('user_id', userIds)

      users?.forEach((u: any) => {
        userEmails[u.user_id] = u.email
      })
    }

    // Enrich abuse incidents with emails
    const enrichedAbuse = recentAbuse.map((a: any) => ({
      ...a,
      user_email: userEmails[a.user_id] || 'Unknown',
    }))

    return NextResponse.json({
      abuseIncidentsToday: abuseLogTodayResult.count || 0,
      abuseIncidentsWeek: abuseLogWeekResult.count || 0,
      severityBreakdown: severityCounts,
      recentAbuseIncidents: enrichedAbuse,
      rateLimitHitsWeek: rateLimitHitsResult.count || 0,
      suspendedUsers: suspendedUsersResult.data || [],
      suspendedCount: suspendedUsersResult.data?.length || 0,
    })
  } catch (error) {
    console.error('Security metrics error:', error)
    return NextResponse.json({ error: 'Failed to fetch security metrics' }, { status: 500 })
  }
}
