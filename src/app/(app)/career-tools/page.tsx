import { createClient } from '@/lib/supabase/server'
import { CareerToolsHub } from '@/components/career-tools/CareerToolsHub'
import { UpgradeBanner } from '@/components/paywall/UpgradeBanner'
import { checkLimit } from '@/lib/usage-service'

export default async function CareerToolsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // All user data is in the profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user?.id)
    .single()

  const { data: experiences } = await supabase
    .from('experience')
    .select('*, experience_bullets(*)')
    .eq('user_id', user?.id)
    .order('sort_order')
    .limit(3)

  const { data: skills } = await supabase
    .from('skills')
    .select('name')
    .eq('user_id', user?.id)

  const { data: certifications } = await supabase
    .from('certifications')
    .select('*')
    .eq('user_id', user?.id)

  const { data: education } = await supabase
    .from('education')
    .select('*')
    .eq('user_id', user?.id)

  // Read usage from usage_tracking table (same source the backend checks)
  const defaultUsage = { used: 0, limit: 1, remaining: 1, allowed: true }
  const coverLetterCheck = user?.id
    ? await checkLimit(user.id, 'cover_letters')
    : defaultUsage
  const linkedinCheck = user?.id
    ? await checkLimit(user.id, 'linkedin_headline')
    : defaultUsage

  const tier = profile?.tier || 'free'
  const coverLetterUsage = coverLetterCheck.used
  const coverLetterLimit = coverLetterCheck.limit

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
        experiences={(experiences || []).map(exp => ({ ...exp, bullets: exp.experience_bullets || [] }))}
        skills={skills?.map(s => s.name) || []}
        certifications={certifications || []}
        education={education || []}
        coverLetterUsage={coverLetterUsage}
        coverLetterLimit={coverLetterLimit}
        linkedinUsage={linkedinCheck.used}
        linkedinLimit={linkedinCheck.limit}
      />
    </div>
  )
}
