import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/Card'

// Service role client bypasses RLS for admin queries
const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AdminAnalyticsPage() {
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

  // Get signup data for the last 30 days using SERVICE CLIENT (bypasses RLS)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: recentSignups } = await serviceClient
    .from('profiles')
    .select('created_at')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: true })

  // Group by date
  const signupsByDate = new Map<string, number>()
  recentSignups?.forEach((signup) => {
    const date = new Date(signup.created_at).toLocaleDateString()
    signupsByDate.set(date, (signupsByDate.get(date) || 0) + 1)
  })

  // Get resume stats
  const { count: totalResumes } = await serviceClient
    .from('resumes')
    .select('*', { count: 'exact', head: true })

  const { count: federalResumes } = await serviceClient
    .from('resumes')
    .select('*', { count: 'exact', head: true })
    .eq('resume_type', 'federal')

  const { count: privateResumes } = await serviceClient
    .from('resumes')
    .select('*', { count: 'exact', head: true })
    .eq('resume_type', 'private')

  // Get tier distribution
  const { data: tierData } = await serviceClient
    .from('profiles')
    .select('tier')

  // Count tiers - handle various tier values
  const totalUsers = tierData?.length || 0
  const freeUsers = tierData?.filter((p: any) => !p.tier || p.tier === 'free').length || 0
  const coreUsers = tierData?.filter((p: any) => p.tier === 'core' || p.tier === 'basic').length || 0
  const fullUsers = tierData?.filter((p: any) => p.tier === 'full' || p.tier === 'pro').length || 0

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold uppercase tracking-wider mb-8">
        Analytics
      </h1>

      {/* Tier Distribution */}
      <Card className="p-6 mb-8">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
          Tier Distribution
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <TierBar
            label="Free"
            count={freeUsers}
            total={totalUsers}
            color="bg-text-muted"
          />
          <TierBar
            label="Core"
            count={coreUsers}
            total={totalUsers}
            color="bg-status-green"
          />
          <TierBar
            label="Full"
            count={fullUsers}
            total={totalUsers}
            color="bg-gold"
          />
        </div>
      </Card>

      {/* Resume Stats */}
      <Card className="p-6 mb-8">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
          Resume Statistics
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="font-heading text-3xl font-bold">{totalResumes || 0}</div>
            <div className="text-xs text-text-muted uppercase">Total Resumes</div>
          </div>
          <div className="text-center">
            <div className="font-heading text-3xl font-bold text-status-blue">{federalResumes || 0}</div>
            <div className="text-xs text-text-muted uppercase">Federal</div>
          </div>
          <div className="text-center">
            <div className="font-heading text-3xl font-bold text-status-green">{privateResumes || 0}</div>
            <div className="text-xs text-text-muted uppercase">Private</div>
          </div>
        </div>
      </Card>

      {/* Recent Signups */}
      <Card className="p-6">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
          Signups (Last 30 Days)
        </h2>
        <div className="text-center mb-4">
          <span className="font-heading text-4xl font-bold">{recentSignups?.length || 0}</span>
          <span className="text-text-muted ml-2">new users</span>
        </div>
        {signupsByDate.size > 0 ? (
          <div className="flex items-end gap-1 h-32">
            {Array.from(signupsByDate.entries()).map(([date, count]) => {
              const maxCount = Math.max(...Array.from(signupsByDate.values()))
              const height = maxCount > 0 ? (count / maxCount) * 100 : 0
              return (
                <div
                  key={date}
                  className="flex-1 bg-gold rounded-t"
                  style={{ height: `${Math.max(height, 5)}%` }}
                  title={`${date}: ${count} signups`}
                />
              )
            })}
          </div>
        ) : (
          <div className="text-center text-text-muted py-8">
            No signups in the last 30 days
          </div>
        )}
      </Card>
    </div>
  )
}

function TierBar({
  label,
  count,
  total,
  color,
}: {
  label: string
  count: number
  total: number
  color: string
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="text-text-muted">{count}</span>
      </div>
      <div className="h-3 bg-bg-tertiary rounded overflow-hidden">
        <div
          className={`h-full ${color} rounded transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-text-muted mt-1 text-right">
        {percentage.toFixed(1)}%
      </div>
    </div>
  )
}
