import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const uid = user.id

  // Fetch all user data in parallel
  const [
    profileResult,
    resumesResult,
    experiencesResult,
    bulletsResult,
    educationResult,
    certificationsResult,
    skillsResult,
  ] = await Promise.all([
    supabase.from('profiles').select('first_name, last_name, email, phone, city, state, zip, linkedin_url, branch, paygrade, rank, rating_mos, years_of_service, security_clearance, clearance_status, target_role, target_industry, professional_summary, tier, created_at').eq('user_id', uid).single(),
    supabase.from('resumes').select('id, name, template, resume_type, content, professional_summary, created_at, updated_at').eq('user_id', uid),
    supabase.from('experiences').select('id, job_title, civilian_title, organization, city, state, start_date, end_date, is_current, employment_type, hours_per_week, supervisor_name, supervisor_phone, salary, pay_grade').eq('user_id', uid),
    supabase.from('experience_bullets').select('id, experience_id, original_text, translated_text, status, source, sort_order').eq('user_id', uid),
    supabase.from('education').select('id, school_name, degree_type, field_of_study, graduation_date, gpa').eq('user_id', uid),
    supabase.from('certifications').select('id, name, issuer, date_obtained, expiration_date').eq('user_id', uid),
    supabase.from('skills').select('id, name, category, proficiency').eq('user_id', uid),
  ])

  const exportData = {
    exported_at: new Date().toISOString(),
    profile: profileResult.data,
    resumes: resumesResult.data || [],
    experiences: experiencesResult.data || [],
    experience_bullets: bulletsResult.data || [],
    education: educationResult.data || [],
    certifications: certificationsResult.data || [],
    skills: skillsResult.data || [],
  }

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="debriefed-export-${new Date().toISOString().split('T')[0]}.json"`,
    },
  })
}
