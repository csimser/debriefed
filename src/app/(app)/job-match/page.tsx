import { createClient } from '@/lib/supabase/server'
import { JobMatchWorkspace } from '@/components/job-match/JobMatchWorkspace'
import { UpgradeBanner } from '@/components/paywall/UpgradeBanner'
import { getUserTier, getTierLimit } from '@/lib/tier-utils'

export default async function JobMatchPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('tier')
    .eq('user_id', user?.id)
    .single()

  const { data: resumes } = await supabase
    .from('resumes')
    .select('id, name, content')
    .eq('user_id', user?.id)
    .order('updated_at', { ascending: false })

  const { data: usage } = await supabase
    .from('usage')
    .select('job_matches')
    .eq('user_id', user?.id)
    .single()

  const userTier = getUserTier(profile)
  const tier = profile?.tier || 'free'
  const currentUsage = usage?.job_matches || 0
  const limit = getTierLimit(userTier, 'job_analyses')

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
