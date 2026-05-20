import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/applications — fetch all applications for current user, newest first
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: applications, error } = await supabase
      .from('job_applications')
      .select('id, resume_id, company_name, job_title, applied_date, status, notes, salary_offered, created_at, updated_at')
      .eq('user_id', user.id)
      .order('applied_date', { ascending: false })

    if (error) throw error

    // Also fetch resume names for display
    const resumeIds = [...new Set((applications || []).map(a => a.resume_id).filter(Boolean))]
    let resumeMap: Record<string, string> = {}

    if (resumeIds.length > 0) {
      const { data: resumes } = await supabase
        .from('resumes')
        .select('id, name')
        .in('id', resumeIds)

      if (resumes) {
        resumeMap = Object.fromEntries(resumes.map(r => [r.id, r.name]))
      }
    }

    const enriched = (applications || []).map(app => ({
      ...app,
      resume_name: app.resume_id ? (resumeMap[app.resume_id] || 'Deleted resume') : null,
    }))

    return NextResponse.json({ applications: enriched })
  } catch (err: unknown) {
    console.error('[applications] GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}

// POST /api/applications — create new application
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { company_name, job_title, resume_id, applied_date, status, notes, salary_offered } = body

    if (!company_name?.trim() || !job_title?.trim()) {
      return NextResponse.json({ error: 'Company name and job title are required' }, { status: 400 })
    }

    const validStatuses = ['applied', 'callback', 'interview', 'offer', 'rejected', 'accepted']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Verify resume belongs to user if provided
    if (resume_id) {
      const { data: resume } = await supabase
        .from('resumes')
        .select('id')
        .eq('id', resume_id)
        .eq('user_id', user.id)
        .single()

      if (!resume) {
        return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
      }
    }

    const { data: application, error } = await supabase
      .from('job_applications')
      .insert({
        user_id: user.id,
        company_name: company_name.trim(),
        job_title: job_title.trim(),
        resume_id: resume_id || null,
        applied_date: applied_date || new Date().toISOString().split('T')[0],
        status: status || 'applied',
        notes: notes?.trim() || null,
        salary_offered: salary_offered ? parseInt(salary_offered, 10) : null,
      })
      .select('id, resume_id, company_name, job_title, applied_date, status, notes, salary_offered, created_at, updated_at')
      .single()

    if (error) throw error

    return NextResponse.json({ application })
  } catch (err: unknown) {
    console.error('[applications] POST error:', err)
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 })
  }
}
