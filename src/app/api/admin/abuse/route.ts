import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { getFlaggedDuplicates } from '@/lib/ai-security'

// Use service role client to bypass RLS
const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Auth check with regular client
    const authClient = await createClient()
    const { data: { user } } = await authClient.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin status
    const { data: profile } = await serviceClient
      .from('profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get flagged duplicates
    const duplicates = await getFlaggedDuplicates()

    // Get recent abuse logs
    const { data: recentAbuse } = await serviceClient
      .from('abuse_log')
      .select('id, user_id, ip_address, action, severity, details, created_at')
      .order('created_at', { ascending: false })
      .limit(100)

    // Get abuse stats
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const { count: last24h } = await serviceClient
      .from('abuse_log')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneDayAgo)

    const { count: last7d } = await serviceClient
      .from('abuse_log')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo)

    const { count: duplicateCount } = await serviceClient
      .from('abuse_log')
      .select('*', { count: 'exact', head: true })
      .eq('action', 'duplicate_ip_detected')
      .gte('created_at', sevenDaysAgo)

    return NextResponse.json({
      flaggedDuplicates: duplicates,
      recentAbuse: recentAbuse || [],
      stats: {
        last24Hours: last24h || 0,
        last7Days: last7d || 0,
        duplicatesLast7Days: duplicateCount || 0,
      },
    })
  } catch (error) {
    console.error('Admin abuse API error:', error)
    return NextResponse.json({ error: 'Failed to fetch abuse data' }, { status: 500 })
  }
}
