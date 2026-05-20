import { createClient } from '@/lib/supabase/server'
import { JobMatchWorkspace } from '@/components/job-match/JobMatchWorkspace'
import { UpgradeBanner } from '@/components/paywall/UpgradeBanner'
import { checkLimit } from '@/lib/usage-service'

export default async function JobMatchPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const defaultUsage = { used: 0, limit: 1, remaining: 1, allowed: true }

  // Run all queries in parallel — they all only need user.id
  const [{ data: profile }, { data: resumes }, usageCheck, { data: skills }, { data: certifications }, { data: education }] = user?.id
    ? await Promise.all([
        supabase.from('profiles').select('tier, first_name, last_name, branch, rank, paygrade, rating_mos, years_of_service, clearance, target_role, target_industry').eq('user_id', user.id).single(),
        supabase.from('resumes').select('id, name, content').eq('user_id', user.id).order('updated_at', { ascending: false }),
        checkLimit(user.id, 'job_match_analysis'),
        supabase.from('skills').select('name').eq('user_id', user.id),
        supabase.from('certifications').select('name').eq('user_id', user.id),
        supabase.from('education').select('degree_type, field_of_study, school_name').eq('user_id', user.id),
      ])
    : [{ data: null }, { data: null }, defaultUsage, { data: null }, { data: null }, { data: null }]

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
            coreLimit={10}
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
        userProfile={profile || null}
        userSkills={(skills || []).map((s: any) => s.name)}
        userCertifications={(certifications || []).map((c: any) => ({ name: c.name }))}
        userEducation={(education || []).map((e: any) => ({ degree_type: e.degree_type, field_of_study: e.field_of_study, school_name: e.school_name }))}
      />
    </div>
  )
}
