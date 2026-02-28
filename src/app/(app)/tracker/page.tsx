import { createClient } from '@/lib/supabase/server'
import { ApplicationBoard } from '@/components/tracker/ApplicationBoard'
import { redirect } from 'next/navigation'

export default async function TrackerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch applications and resumes in parallel
  const [applicationsResult, resumesResult] = await Promise.all([
    supabase
      .from('job_applications')
      .select('id, resume_id, company_name, job_title, applied_date, status, notes, salary_offered, created_at, updated_at')
      .eq('user_id', user.id)
      .order('applied_date', { ascending: false }),
    supabase
      .from('resumes')
      .select('id, name')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false }),
  ])

  const applications = applicationsResult.data || []
  const resumes = resumesResult.data || []

  // Build resume name map for display
  const resumeMap = Object.fromEntries(resumes.map(r => [r.id, r.name]))
  const enrichedApplications = applications.map(app => ({
    ...app,
    resume_name: app.resume_id ? (resumeMap[app.resume_id] || 'Deleted resume') : null,
  }))

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wider">
          Application Tracker
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Track your job applications and see which resumes are working
        </p>
      </div>

      <ApplicationBoard
        initialApplications={enrichedApplications}
        resumes={resumes}
      />
    </div>
  )
}
