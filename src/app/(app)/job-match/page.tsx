import { createClient } from '@/lib/supabase/server'
import { JobMatchWorkspace } from '@/components/job-match/JobMatchWorkspace'
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

  return (
    <div className="h-full -m-8">
      <JobMatchWorkspace
        userId={user?.id || ''}
        userPlan={profile?.tier || 'free'}
        resumes={resumes || []}
        currentUsage={usage?.job_matches || 0}
        usageLimit={getTierLimit(userTier, 'job_analyses')}
      />
    </div>
  )
}
