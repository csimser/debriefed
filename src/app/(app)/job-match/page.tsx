import { createClient } from '@/lib/supabase/server'
import { JobMatchWorkspace } from '@/components/job-match/JobMatchWorkspace'
import { UpgradeBanner } from '@/components/paywall/UpgradeBanner'
import { checkLimit } from '@/lib/usage-service'

export default async function JobMatchPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const defaultUsage = { used: 0, limit: 1, remaining: 1, allowed: true }

  // Run all queries in parallel — they all only need user.id
  const [{ data: profile }, { data: resumes }, usageCheck] = user?.id
    ? await Promise.all([
        supabase.from('profiles').select('tier').eq('user_id', user.id).single(),
        supabase.from('resumes').select('id, name, content').eq('user_id', user.id).order('updated_at', { ascending: false }),
        checkLimit(user.id, 'job_match_analysis'),
      ])
    : [{ data: null }, { data: null }, defaultUsage]

  const tier = profile?.tier || 'free'
  const currentUsage = usageCheck.used
  const limit = usageCheck.limit

  return (
    <div className="h-full -m-8">
      {tier === 'free' && currentUsage >= limit && (
        <div className="p-4 pb-0 m-8 mb-0">
          <UpgradeBanner
            feature="Job Match Analyses"
            currentUsage={currentUsage}
            freeLimit={limit}
            coreLimit={15}
            tier={tier}
            variant="inline"
          />
        </div>
      )}
      <JobMatchWorkspace
        userId={user?.id || ''}
        userPlan={tier}
        resumes={resumes || []}
        currentUsage={currentUsage}
        usageLimit={limit}
      />
    </div>
  )
}
