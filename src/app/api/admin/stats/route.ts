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

  // Fetch all stats in parallel using service client
  const [
    totalUsersResult,
    signupsTodayResult,
    signupsWeekResult,
    signupsMonthResult,
    totalResumesResult,
    proUsersResult,
    basicUsersResult,
    monthlyUsersResult,
    quarterlyUsersResult,
    availableBetaCodesResult,
    activePromoCodesResult,
    pendingFeedbackResult,
    apiTokensTodayResult,
    recentUsersResult,
    aggregateUsageResult,
  ] = await Promise.all([
    // Total users
    serviceClient
      .from('profiles')
      .select('*', { count: 'exact', head: true }),

    // Signups today (last 24 hours)
    serviceClient
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneDayAgo),

    // Signups this week (last 7 days)
    serviceClient
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo),

    // Signups this month (last 30 days)
    serviceClient
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneMonthAgo),

    // Total resumes
    serviceClient
      .from('resumes')
      .select('*', { count: 'exact', head: true }),

    // Pro users
    serviceClient
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('tier', 'pro'),

    // Basic users
    serviceClient
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('tier', 'basic'),

    // Monthly subscription users
    serviceClient
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('tier', 'monthly'),

    // Quarterly subscription users
    serviceClient
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('tier', 'quarterly'),

    // Available beta codes (not used)
    serviceClient
      .from('beta_codes')
      .select('*', { count: 'exact', head: true })
      .eq('used', false),

    // Active promo codes (not expired and not exhausted)
    // Fetches all and filters client-side since we can't do complex OR with null checks easily
    serviceClient
      .from('promo_codes')
      .select('max_uses, current_uses, expires_at'),

    // Pending feedback (status = 'new')
    serviceClient
      .from('user_feedback')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new'),

    // API tokens used today
    serviceClient
      .from('api_usage')
      .select('tokens_used')
      .gte('created_at', oneDayAgo),

    // Recent signups (last 10)
    serviceClient
      .from('profiles')
      .select('id, email, first_name, last_name, tier, branch, created_at')
      .order('created_at', { ascending: false })
      .limit(10),

    // Aggregate usage stats from usage table
    serviceClient
      .from('usage')
      .select('resumes_created, resumes_downloaded, cover_letters, job_matches, eval_uploads, bullet_rewrites, ai_summaries, private_downloads, federal_downloads'),
  ])

  // Calculate total API tokens used today
  const apiTokensToday = apiTokensTodayResult.data?.reduce(
    (sum, row) => sum + (row.tokens_used || 0),
    0
  ) || 0

  // Calculate active promo codes (not expired and not exhausted)
  const activePromoCodes = (activePromoCodesResult.data || []).filter(code => {
    const isExpired = code.expires_at && new Date(code.expires_at) < now
    const isExhausted = code.max_uses !== null && (code.current_uses || 0) >= code.max_uses
    return !isExpired && !isExhausted
  }).length

  // Aggregate usage stats across all users
  const usageRows = aggregateUsageResult.data || []
  const totalUsageStats = usageRows.reduce(
    (acc, row) => ({
      resumes_created: acc.resumes_created + (row.resumes_created || 0),
      resumes_downloaded: acc.resumes_downloaded + (row.resumes_downloaded || 0),
      cover_letters: acc.cover_letters + (row.cover_letters || 0),
      job_matches: acc.job_matches + (row.job_matches || 0),
      eval_uploads: acc.eval_uploads + (row.eval_uploads || 0),
      bullet_rewrites: acc.bullet_rewrites + (row.bullet_rewrites || 0),
      ai_summaries: acc.ai_summaries + (row.ai_summaries || 0),
      private_downloads: acc.private_downloads + (row.private_downloads || 0),
      federal_downloads: acc.federal_downloads + (row.federal_downloads || 0),
    }),
    {
      resumes_created: 0,
      resumes_downloaded: 0,
      cover_letters: 0,
      job_matches: 0,
      eval_uploads: 0,
      bullet_rewrites: 0,
      ai_summaries: 0,
      private_downloads: 0,
      federal_downloads: 0,
    }
  )

  return NextResponse.json({
    totalUsers: totalUsersResult.count || 0,
    signupsToday: signupsTodayResult.count || 0,
    signupsWeek: signupsWeekResult.count || 0,
    signupsMonth: signupsMonthResult.count || 0,
    totalResumes: totalResumesResult.count || 0,
    proUsers: proUsersResult.count || 0,
    basicUsers: basicUsersResult.count || 0,
    monthlyUsers: monthlyUsersResult.count || 0,
    quarterlyUsers: quarterlyUsersResult.count || 0,
    activeBetaCodes: availableBetaCodesResult.count || 0,
    activePromoCodes,
    pendingFeedback: pendingFeedbackResult.count || 0,
    apiTokensToday,
    recentUsers: recentUsersResult.data || [],
    totalUsageStats,
  })
}
