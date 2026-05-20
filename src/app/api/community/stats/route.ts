import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const admin = createAdminClient()
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    // Run all queries in parallel
    const [approvedRes, userAllRes, weeklyRes] = await Promise.all([
      // User's approved submissions count
      admin
        .from('dict_submissions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'approved'),

      // User's total submissions (for badge tier)
      admin
        .from('dict_submissions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id),

      // All submissions this week (for leaderboard)
      admin
        .from('dict_submissions')
        .select('user_id')
        .gte('created_at', weekAgo),
    ])

    const approvedCount = approvedRes.count ?? 0
    const totalCount = userAllRes.count ?? 0

    // Aggregate weekly submissions by user_id
    const userCounts = new Map<string, number>()
    for (const row of weeklyRes.data ?? []) {
      if (row.user_id) {
        userCounts.set(row.user_id, (userCounts.get(row.user_id) ?? 0) + 1)
      }
    }

    // Sort by count desc, take top 5
    const topUsers = [...userCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    // Fetch first names for leaderboard users
    let leaderboard: { rank: number; name: string; count: number; isYou: boolean }[] = []
    if (topUsers.length > 0) {
      const userIds = topUsers.map(([uid]) => uid)
      const { data: profiles } = await admin
        .from('profiles')
        .select('id, first_name')
        .in('id', userIds)

      const nameMap = new Map<string, string>()
      for (const p of profiles ?? []) {
        if (p.first_name) nameMap.set(p.id, p.first_name)
      }

      leaderboard = topUsers.map(([uid, count], i) => ({
        rank: i + 1,
        name: nameMap.get(uid) || 'Anonymous',
        count,
        isYou: uid === user.id,
      }))
    }

    return NextResponse.json({
      impact: {
        approvedCount,
        totalCount,
      },
      leaderboard,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to load stats' },
      { status: 500 },
    )
  }
}
