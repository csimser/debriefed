import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { CareerToolsHub } from '@/components/career-tools/CareerToolsHub'
import { UpgradeBanner } from '@/components/paywall/UpgradeBanner'
import { EvalHistorySection } from '@/components/eval/EvalHistorySection'
import { DictionaryIntroModal } from '@/components/dictionary/DictionaryIntroModal'
import { checkLimit } from '@/lib/usage-service'

export default async function CareerToolsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // All data + usage checks in one parallel batch
  const defaultUsage = { used: 0, limit: 1, remaining: 1, allowed: true }
  const [
    { data: profile },
    { data: experiences },
    { data: skills },
    { data: certifications },
    { data: education },
    { data: evalUploads },
    coverLetterCheck,
    linkedinCheck,
    evalCheck,
  ] = user?.id
    ? await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('experience').select('*, experience_bullets(*)').eq('user_id', user.id).order('sort_order').limit(3),
        supabase.from('skills').select('name').eq('user_id', user.id),
        supabase.from('certifications').select('*').eq('user_id', user.id),
        supabase.from('education').select('*').eq('user_id', user.id),
        supabase.from('eval_uploads').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        checkLimit(user.id, 'cover_letters'),
        checkLimit(user.id, 'linkedin_headline'),
        checkLimit(user.id, 'eval_uploads'),
      ])
    : [
        { data: null }, { data: null }, { data: null },
        { data: null }, { data: null }, { data: null },
        defaultUsage, defaultUsage, defaultUsage,
      ]

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
      <Suspense fallback={null}>
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
      </Suspense>

      {(evalUploads?.length ?? 0) > 0 && (
        <EvalHistorySection
          uploads={evalUploads || []}
          experiences={mappedExperiences}
          userId={user?.id || ''}
        />
      )}

      {/* Dictionary Intro Modal — shown on first visit to career tools */}
      {user?.id && profile?.dictionary_intro_shown !== true && (
        <DictionaryIntroModal userId={user.id} />
      )}
    </div>
  )
}
