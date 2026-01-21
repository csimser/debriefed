import { createClient } from '@/lib/supabase/server'
import { ResumeEditor } from '@/components/resume/ResumeEditor'

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
    { data: usage }
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', user?.id).maybeSingle(),
    supabase.from('resumes').select('*, downloaded_at').eq('user_id', user?.id).order('updated_at', { ascending: false }),
    supabase.from('experience').select('*, experience_bullets(*)').eq('user_id', user?.id).order('sort_order'),
    supabase.from('education').select('*').eq('user_id', user?.id).order('sort_order'),
    supabase.from('certifications').select('*').eq('user_id', user?.id).order('sort_order'),
    supabase.from('skills').select('*').eq('user_id', user?.id).order('sort_order'),
    supabase.from('usage').select('private_downloads, federal_downloads').eq('user_id', user?.id).maybeSingle()
  ])

  const userProfile = profile || {}

  return (
    <div className="h-[calc(100vh-120px)] -m-8">
      <ResumeEditor
        userId={user?.id || ''}
        userPlan={profile?.tier || 'free'}
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
        usage={usage || { private_downloads: 0, federal_downloads: 0 }}
      />
    </div>
  )
}
