import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { EvalHistorySection } from '@/components/eval/EvalHistorySection'
import { checkLimit } from '@/lib/usage-service'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Load all profile data + usage checks in one parallel batch
  const [
    { data: profile },
    { data: experiences },
    { data: education },
    { data: certifications },
    { data: skills },
    { data: evalUploads },
    resumeImportCheck,
    bulletTranslationCheck,
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('experience').select('*, experience_bullets(*)').eq('user_id', user.id).order('sort_order'),
    supabase.from('education').select('*').eq('user_id', user.id).order('sort_order'),
    supabase.from('certifications').select('*').eq('user_id', user.id).order('sort_order'),
    supabase.from('skills').select('*').eq('user_id', user.id).order('sort_order'),
    supabase.from('eval_uploads').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    checkLimit(user.id, 'resume_imports'),
    checkLimit(user.id, 'bullet_translations'),
  ])

  const mappedExperiences = (experiences || []).map(exp => ({
    ...exp,
    bullets: exp.experience_bullets || []
  }))

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wider">My Profile</h1>
          <p className="text-text-muted text-sm mt-1">This is your Base Resume — all resumes and career tools pull from this data</p>
        </div>
      </div>
      <ProfileForm
        userId={user.id}
        initialData={{
          profile: profile || {},
          experiences: mappedExperiences,
          education: education || [],
          certifications: certifications || [],
          skills: skills || []
        }}
        resumeImportUsage={resumeImportCheck.used}
        resumeImportLimit={resumeImportCheck.limit}
        bulletTranslationUsage={bulletTranslationCheck}
        userBranch={profile?.branch || ''}
        userPlan={profile?.tier || 'free'}
      />

      {/* Eval Upload History — shows past uploads with re-import capability */}
      {(evalUploads && evalUploads.length > 0) && (
        <div className="mt-8">
          <EvalHistorySection
            uploads={evalUploads}
            experiences={mappedExperiences}
            userId={user.id}
          />
        </div>
      )}
    </div>
  )
}
