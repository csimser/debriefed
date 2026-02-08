import { createClient } from '@/lib/supabase/server'
import { CareerToolsHub } from '@/components/career-tools/CareerToolsHub'
import { UpgradeBanner } from '@/components/paywall/UpgradeBanner'
import { getUserTier, getTierLimit } from '@/lib/tier-utils'

export default async function CareerToolsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // All user data is in the profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user?.id)
    .single()

  const { data: usage } = await supabase
    .from('usage')
    .select('cover_letters, linkedin_generations')
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

  const userTier = getUserTier(profile)
  const tier = profile?.tier || 'free'
  const coverLetterUsage = usage?.cover_letters || 0
  const coverLetterLimit = getTierLimit(userTier, 'cover_letters')

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
        linkedinUsage={usage?.linkedin_generations || 0}
        linkedinLimit={getTierLimit(userTier, 'linkedin_headlines')}
      />
    </div>
  )
}
