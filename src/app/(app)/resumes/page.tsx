import { createClient } from '@/lib/supabase/server'
import { ResumeEditor } from '@/components/resume/ResumeEditor'
import { UpgradeBanner } from '@/components/paywall/UpgradeBanner'
import { checkLimit } from '@/lib/usage-service'

export default async function ResumesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Load all profile data + usage checks in one parallel batch
  const defaultUsage = { used: 0, limit: 1, remaining: 1, allowed: true }
  const [
    { data: profile },
    { data: resumes },
    { data: experiences },
    { data: education },
    { data: certifications },
    { data: skills },
    privateCheck,
    federalCheck,
    bulletCheck,
    downloadCheck,
  ] = user?.id
    ? await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('resumes').select('*').eq('user_id', user.id).order('updated_at', { ascending: false }),
        supabase.from('experience').select('*, experience_bullets(*)').eq('user_id', user.id).order('sort_order'),
        supabase.from('education').select('*').eq('user_id', user.id).order('sort_order'),
        supabase.from('certifications').select('*').eq('user_id', user.id).order('sort_order'),
        supabase.from('skills').select('*').eq('user_id', user.id).order('sort_order'),
        checkLimit(user.id, 'private_resumes'),
        checkLimit(user.id, 'federal_resumes'),
        checkLimit(user.id, 'bullet_translations'),
        checkLimit(user.id, 'downloads'),
      ])
    : [
        { data: null }, { data: null }, { data: null },
        { data: null }, { data: null }, { data: null },
        defaultUsage, defaultUsage, defaultUsage, defaultUsage,
      ]

  const usage = {
    private_downloads: privateCheck.used,
    federal_downloads: federalCheck.used,
    bullet_rewrites: bulletCheck.used,
    download_used: downloadCheck.used,
    download_limit: downloadCheck.limit,
    download_remaining: downloadCheck.remaining,
  }

  const userProfile = profile || {}
  const tier = profile?.tier || 'free'
  const resumeCount = resumes?.length || 0

  return (
    <div className="h-[calc(100vh-90px)] -mx-4 md:-mx-6 lg:-mx-8 -mb-4">
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
