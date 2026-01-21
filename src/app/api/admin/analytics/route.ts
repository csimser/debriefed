import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

// Service role client bypasses RLS for admin queries
const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const authClient = await createClient()

  // Verify user is authenticated and is admin
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user is admin using service client
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 })
  }

  // Calculate date ranges
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

  try {
    // Fetch all analytics in parallel using service client
    const [
      viewsTodayResult,
      viewsWeekResult,
      viewsMonthResult,
      uniqueVisitorsTodayResult,
      uniqueVisitorsWeekResult,
      topPagesResult,
      viewsByDayResult,
      topReferrersResult,
    ] = await Promise.all([
      // Views today
      serviceClient
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneDayAgo),

      // Views this week
      serviceClient
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneWeekAgo),

      // Views this month
      serviceClient
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneMonthAgo),

      // Unique visitors today (distinct session_id)
      serviceClient
        .from('page_views')
        .select('session_id')
        .gte('created_at', oneDayAgo),

      // Unique visitors this week
      serviceClient
        .from('page_views')
        .select('session_id')
        .gte('created_at', oneWeekAgo),

      // Top pages (last 30 days)
      serviceClient
        .from('page_views')
        .select('path')
        .gte('created_at', oneMonthAgo),

      // Views by day (last 30 days)
      serviceClient
        .from('page_views')
        .select('created_at')
        .gte('created_at', oneMonthAgo)
        .order('created_at', { ascending: true }),

      // Top referrers (last 30 days, exclude empty)
      serviceClient
        .from('page_views')
        .select('referrer')
        .gte('created_at', oneMonthAgo)
        .not('referrer', 'is', null)
        .neq('referrer', ''),
    ])

    // Calculate unique visitors (count distinct session_ids)
    const uniqueVisitorsToday = new Set(
      uniqueVisitorsTodayResult.data?.map(r => r.session_id) || []
    ).size

    const uniqueVisitorsWeek = new Set(
      uniqueVisitorsWeekResult.data?.map(r => r.session_id) || []
    ).size

    // Calculate top pages
    const pageCounts: Record<string, number> = {}
    topPagesResult.data?.forEach(row => {
      pageCounts[row.path] = (pageCounts[row.path] || 0) + 1
    })
    const topPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Calculate views by day
    const dayCounts: Record<string, number> = {}
    viewsByDayResult.data?.forEach(row => {
      const date = new Date(row.created_at).toISOString().split('T')[0]
      dayCounts[date] = (dayCounts[date] || 0) + 1
    })

    // Fill in missing days with 0
    const viewsByDay: { date: string; count: number }[] = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]
      viewsByDay.push({ date, count: dayCounts[date] || 0 })
    }

    // Calculate top referrers
    const referrerCounts: Record<string, number> = {}
    topReferrersResult.data?.forEach(row => {
      if (row.referrer) {
        // Extract domain from referrer URL
        try {
          const url = new URL(row.referrer)
          const domain = url.hostname
          referrerCounts[domain] = (referrerCounts[domain] || 0) + 1
        } catch {
          referrerCounts[row.referrer] = (referrerCounts[row.referrer] || 0) + 1
        }
      }
    })
    const topReferrers = Object.entries(referrerCounts)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return NextResponse.json({
      viewsToday: viewsTodayResult.count || 0,
      viewsWeek: viewsWeekResult.count || 0,
      viewsMonth: viewsMonthResult.count || 0,
      uniqueVisitorsToday,
      uniqueVisitorsWeek,
      topPages,
      viewsByDay,
      topReferrers,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
