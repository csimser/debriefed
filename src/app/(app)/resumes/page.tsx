import { createClient } from '@/lib/supabase/server'
import { ResumeEditor } from '@/components/resume/ResumeEditor'
import { UpgradeBanner } from '@/components/paywall/UpgradeBanner'
import { checkLimit } from '@/lib/usage-service'

export default async function ResumesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Load all profile-related data in parallel
  const [
    { data: profile },
    { data: resumes },
    { data: experiences },
    { data: education },
    { data: certifications },
    { data: skills },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', user?.id).maybeSingle(),
    supabase.from('resumes').select('*, downloaded_at').eq('user_id', user?.id).order('updated_at', { ascending: false }),
    supabase.from('experience').select('*, experience_bullets(*)').eq('user_id', user?.id).order('sort_order'),
    supabase.from('education').select('*').eq('user_id', user?.id).order('sort_order'),
    supabase.from('certifications').select('*').eq('user_id', user?.id).order('sort_order'),
    supabase.from('skills').select('*').eq('user_id', user?.id).order('sort_order'),
  ])

  // Usage from usage_tracking (single source of truth)
  const defaultUsage = { used: 0, limit: 1, remaining: 1, allowed: true }
  const [privateCheck, federalCheck, bulletCheck] = user?.id
    ? await Promise.all([
        checkLimit(user.id, 'private_resumes'),
        checkLimit(user.id, 'federal_resumes'),
        checkLimit(user.id, 'bullet_translations'),
      ])
    : [defaultUsage, defaultUsage, defaultUsage]

  const usage = {
    private_downloads: privateCheck.used,
    federal_downloads: federalCheck.used,
    bullet_rewrites: bulletCheck.used,
  }

  const userProfile = profile || {}
  const tier = profile?.tier || 'free'
  const resumeCount = resumes?.length || 0

  return (
    <div className="h-[calc(100vh-120px)] -m-8">
      {tier === 'free' && resumeCount >= 1 && (
        <div className="p-4 pb-0 m-8 mb-0">
          <UpgradeBanner
            feature="Resumes"
            currentUsage={resumeCount}
            freeLimit={1}
            coreLimit={5}
            tier={tier}
            variant="inline"
          />
        </div>
      )}
      <ResumeEditor
        userId={user?.id || ''}
        userPlan={tier}
        resumes={resumes || []}
        profileData={{
          userProfile,
          // Map experience_bullets to bullets for component compatibility
          experiences: (experiences || []).map(exp => ({
            ...exp,
            bullets: exp.experience_bullets || []
          })),
          education: education || [],
          certifications: certifications || [],
          skills: skills || [],
        }}
        usage={usage || { private_downloads: 0, federal_downloads: 0, bullet_rewrites: 0 }}
      />
    </div>
  )
}
