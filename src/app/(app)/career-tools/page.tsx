import { createClient } from '@/lib/supabase/server'
import { CareerToolsHub } from '@/components/career-tools/CareerToolsHub'
import { UpgradeBanner } from '@/components/paywall/UpgradeBanner'
import { EvalHistorySection } from '@/components/eval/EvalHistorySection'
import { checkLimit } from '@/lib/usage-service'

export default async function CareerToolsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // All user data is in the profiles table
  const [
    { data: profile },
    { data: experiences },
    { data: skills },
    { data: certifications },
    { data: education },
    { data: evalUploads }
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', user?.id).single(),
    supabase.from('experience').select('*, experience_bullets(*)').eq('user_id', user?.id).order('sort_order').limit(3),
    supabase.from('skills').select('name').eq('user_id', user?.id),
    supabase.from('certifications').select('*').eq('user_id', user?.id),
    supabase.from('education').select('*').eq('user_id', user?.id),
    supabase.from('eval_uploads').select('*').eq('user_id', user?.id).order('created_at', { ascending: false })
  ])

  // Read usage from usage_tracking table (same source the backend checks)
  const defaultUsage = { used: 0, limit: 1, remaining: 1, allowed: true }
  const [coverLetterCheck, linkedinCheck, evalCheck] = await Promise.all([
    user?.id ? checkLimit(user.id, 'cover_letters') : defaultUsage,
    user?.id ? checkLimit(user.id, 'linkedin_headline') : defaultUsage,
    user?.id ? checkLimit(user.id, 'eval_uploads') : defaultUsage,
  ])

  const tier = profile?.tier || 'free'
  const coverLetterUsage = coverLetterCheck.used
  const coverLetterLimit = coverLetterCheck.limit

  const mappedExperiences = (experiences || []).map(exp => ({ ...exp, bullets: exp.experience_bullets || [] }))

  return (
    <div className="animate-fade-in space-y-4">
      {tier === 'free' && coverLetterUsage >= coverLetterLimit && (
        <UpgradeBanner
          feature="Cover Letters"
          currentUsage={coverLetterUsage}
          freeLimit={coverLetterLimit}
          coreLimit={10}
          tier={tier}
          variant="inline"
        />
      )}
      <CareerToolsHub
        userId={user?.id || ''}
        userPlan={tier}
        userProfile={profile || {}}
        experiences={mappedExperiences}
        skills={skills?.map(s => s.name) || []}
        certifications={certifications || []}
        education={education || []}
        coverLetterUsage={coverLetterUsage}
        coverLetterLimit={coverLetterLimit}
        linkedinUsage={linkedinCheck.used}
        linkedinLimit={linkedinCheck.limit}
        evalUsage={evalCheck.used}
        evalLimit={evalCheck.limit}
        evalUploads={evalUploads || []}
      />
    </div>
  )
}
