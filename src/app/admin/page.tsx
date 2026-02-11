import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { SiteAnalytics } from '@/components/admin/SiteAnalytics'
import { SecurityMetrics } from '@/components/admin/SecurityMetrics'

// Service role client bypasses RLS for admin queries
const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AdminDashboardPage() {
  // Auth check with regular client
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  // Verify admin status using service client (bypasses RLS)
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/dashboard')
  }

  // Calculate date ranges
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

  // Fetch all stats in parallel using SERVICE CLIENT (bypasses RLS)
  const [
    totalUsersResult,
    signupsTodayResult,
    signupsWeekResult,
    signupsMonthResult,
    totalResumesResult,
    tierDataResult,
    activeBetaCodesResult,
    activePromoCodesResult,
    pendingFeedbackResult,
    apiTokensTodayResult,
    recentUsersResult,
    aggregateUsageResult,
  ] = await Promise.all([
    serviceClient.from('profiles').select('*', { count: 'exact', head: true }),
    serviceClient.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
    serviceClient.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', oneWeekAgo),
    serviceClient.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', oneMonthAgo),
    serviceClient.from('resumes').select('*', { count: 'exact', head: true }),
    // Get all tier data to count properly
    serviceClient.from('profiles').select('tier'),
    serviceClient.from('beta_codes').select('*', { count: 'exact', head: true }).eq('used', false),
    serviceClient.from('promo_codes').select('*', { count: 'exact', head: true }).eq('is_active', true),
    serviceClient.from('user_feedback').select('*', { count: 'exact', head: true }).or('status.eq.new,status.eq.pending,status.is.null'),
    serviceClient.from('api_usage').select('tokens_used').gte('created_at', todayStart),
    serviceClient.from('profiles').select('id, user_id, email, first_name, last_name, tier, branch, created_at').order('created_at', { ascending: false }).limit(10),
    // Aggregate usage stats from usage_tracking (single source of truth)
    serviceClient.from('usage_tracking').select('feature, count'),
  ])

  // Calculate API tokens
  const apiTokensToday = apiTokensTodayResult.data?.reduce(
    (sum, row) => sum + (row.tokens_used || 0),
    0
  ) || 0

  // Count tiers properly - tier values might be 'free', 'core', 'full', 'pro', or null
  const tierData = tierDataResult.data || []
  const coreUsers = tierData.filter((u: any) => u.tier === 'core').length
  const fullUsers = tierData.filter((u: any) => u.tier === 'full' || u.tier === 'pro').length

  // Aggregate usage stats from usage_tracking by feature
  const trackingRows = aggregateUsageResult.data || []
  const totalUsageStats = {
    cover_letters: 0,
    job_matches: 0,
    eval_uploads: 0,
    ai_summaries: 0,
    private_downloads: 0,
    federal_downloads: 0,
  }
  for (const row of trackingRows) {
    const count = row.count || 0
    switch (row.feature) {
      case 'cover_letters': totalUsageStats.cover_letters += count; break
      case 'job_match_analysis': totalUsageStats.job_matches += count; break
      case 'eval_uploads': totalUsageStats.eval_uploads += count; break
      case 'ai_summaries': totalUsageStats.ai_summaries += count; break
      case 'private_resumes': totalUsageStats.private_downloads += count; break
      case 'federal_resumes': totalUsageStats.federal_downloads += count; break
    }
  }

  const stats = {
    totalUsers: totalUsersResult.count || 0,
    signupsToday: signupsTodayResult.count || 0,
    signupsWeek: signupsWeekResult.count || 0,
    signupsMonth: signupsMonthResult.count || 0,
    totalResumes: totalResumesResult.count || 0,
    coreUsers,
    fullUsers,
    activeBetaCodes: activeBetaCodesResult.count || 0,
    activePromoCodes: activePromoCodesResult.count || 0,
    pendingFeedback: pendingFeedbackResult.count || 0,
    apiTokensToday,
  }

  const recentUsers = recentUsersResult.data || []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wider mb-2">
          Admin Dashboard
        </h1>
        <p className="text-text-muted">Overview of platform activity and metrics</p>
      </div>

      {/* Primary Stats Grid - 3 cols desktop, 2 tablet, 1 mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon="◉"
          label="Total Users"
          value={stats.totalUsers}
          color="navy"
        />
        <StatCard
          icon="◫"
          label="Total Resumes"
          value={stats.totalResumes}
          color="gold"
        />
        <StatCard
          icon="◈"
          label="Active Access Codes"
          value={stats.activeBetaCodes}
          color="green"
          href="/admin/beta-codes"
        />
        <StatCard
          icon="◇"
          label="Active Promo Codes"
          value={stats.activePromoCodes}
          color="blue"
          href="/admin/promo-codes"
        />
        <StatCard
          icon="◎"
          label="Pending Feedback"
          value={stats.pendingFeedback}
          color={stats.pendingFeedback > 0 ? 'red' : 'default'}
          href="/admin/feedback"
        />
        <StatCard
          icon="⚡"
          label="API Tokens Today"
          value={stats.apiTokensToday}
          color="default"
        />
      </div>

      {/* Signup Stats */}
      <div>
        <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
          Signup Activity
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon="◉"
            label="Today"
            value={stats.signupsToday}
            subtitle="Last 24 hours"
            color="blue"
          />
          <StatCard
            icon="◉"
            label="This Week"
            value={stats.signupsWeek}
            subtitle="Last 7 days"
            color="blue"
          />
          <StatCard
            icon="◉"
            label="This Month"
            value={stats.signupsMonth}
            subtitle="Last 30 days"
            color="blue"
          />
        </div>
      </div>

      {/* Feature Usage */}
      <div>
        <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
          Feature Usage (All Time)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard
            icon="◫"
            label="Resumes Created"
            value={stats.totalResumes}
            color="gold"
          />
          <StatCard
            icon="✉"
            label="Cover Letters"
            value={totalUsageStats.cover_letters}
            color="green"
          />
          <StatCard
            icon="◎"
            label="Job Matches"
            value={totalUsageStats.job_matches}
            color="blue"
          />
          <StatCard
            icon="◈"
            label="Eval Uploads"
            value={totalUsageStats.eval_uploads}
            color="navy"
          />
          <StatCard
            icon="⚡"
            label="AI Summaries"
            value={totalUsageStats.ai_summaries}
            color="default"
          />
          <StatCard
            icon="↓"
            label="Private Downloads"
            value={totalUsageStats.private_downloads}
            color="default"
          />
          <StatCard
            icon="↓"
            label="Federal Downloads"
            value={totalUsageStats.federal_downloads}
            color="default"
          />
        </div>
      </div>

      {/* User Tiers */}
      <div>
        <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
          User Tiers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon="○"
            label="Free Users"
            value={stats.totalUsers - stats.coreUsers - stats.fullUsers}
            color="default"
          />
          <StatCard
            icon="◐"
            label="Core Users"
            value={stats.coreUsers}
            subtitle="$35 / 30 days"
            color="green"
          />
          <StatCard
            icon="●"
            label="Full Users"
            value={stats.fullUsers}
            subtitle="$75 / 90 days"
            color="gold"
          />
        </div>
      </div>

      {/* Recent Users Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wider">
            Recent Signups
          </h2>
          <Link
            href="/admin/users"
            className="text-sm text-gold hover:text-gold-bright transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1a365d]/20">
              <tr className="text-left text-xs text-text-muted uppercase border-b border-[#1a365d]/30">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user: any, index: number) => (
                <tr
                  key={user.id}
                  className={`border-b border-border/50 hover:bg-gold-dim/10 transition-colors ${
                    index % 2 === 0 ? 'bg-bg-secondary/30' : 'bg-bg-tertiary/30'
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium">
                      {user.first_name || user.last_name
                        ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                        : <span className="text-text-dim italic">Not set</span>
                      }
                    </div>
                    <div className="text-xs text-text-muted font-mono">{user.email}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-muted">
                    {user.branch ? user.branch.replace('U.S. ', '') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded font-mono ${
                      user.tier === 'full'
                        ? 'bg-gold-dim text-gold'
                        : user.tier === 'core'
                        ? 'bg-status-green-dim text-status-green'
                        : 'bg-bg-tertiary text-text-muted'
                    }`}>
                      {user.tier?.toUpperCase() || 'FREE'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-muted">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/users/${user.user_id}`}
                      className="text-sm text-gold hover:text-gold-bright hover:underline"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
              {recentUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-text-muted">
                    No users yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Site Analytics */}
      <div>
        <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
          Site Analytics
        </h2>
        <SiteAnalytics />
      </div>

      {/* Security & Abuse Metrics */}
      <div>
        <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
          Security & Rate Limiting
        </h2>
        <SecurityMetrics />
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: string
  label: string
  value: number
  subtitle?: string
  color?: 'navy' | 'gold' | 'green' | 'blue' | 'red' | 'default'
  href?: string
}

function StatCard({ icon, label, value, subtitle, color = 'default', href }: StatCardProps) {
  const colorClasses = {
    navy: {
      bg: 'bg-[#1a365d]/20',
      border: 'border-[#1a365d]/40',
      text: 'text-[#63b3ed]',
      icon: 'bg-[#1a365d]/40 text-[#63b3ed]',
    },
    gold: {
      bg: 'bg-[#b8860b]/10',
      border: 'border-[#b8860b]/30',
      text: 'text-[#b8860b]',
      icon: 'bg-[#b8860b]/20 text-[#b8860b]',
    },
    green: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      icon: 'bg-emerald-500/20 text-emerald-400',
    },
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      icon: 'bg-blue-500/20 text-blue-400',
    },
    red: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      icon: 'bg-red-500/20 text-red-400',
    },
    default: {
      bg: 'bg-bg-tertiary',
      border: 'border-border',
      text: 'text-text',
      icon: 'bg-bg-secondary text-text-muted',
    },
  }

  const colors = colorClasses[color]

  const content = (
    <Card className={`p-5 ${colors.bg} border ${colors.border} ${href ? 'hover:border-gold/50 transition-colors cursor-pointer' : ''}`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-lg ${colors.icon} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-xs text-text-muted uppercase tracking-wider mb-1">
            {label}
          </div>
          <div className={`font-heading text-3xl font-bold ${colors.text}`}>
            {value.toLocaleString()}
          </div>
          {subtitle && (
            <div className="text-xs text-text-dim mt-1">{subtitle}</div>
          )}
        </div>
      </div>
    </Card>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
