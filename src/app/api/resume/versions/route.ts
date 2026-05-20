import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MAX_VERSIONS_PER_RESUME = 10

// GET /api/resume/versions?resumeId=[id] — fetch all versions for a resume
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resumeId = request.nextUrl.searchParams.get('resumeId')
    if (!resumeId) {
      return NextResponse.json({ error: 'Missing resumeId' }, { status: 400 })
    }

    // Verify the resume belongs to this user
    const { data: resume } = await supabase
      .from('resumes')
      .select('id')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single()

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    const { data: versions, error } = await supabase
      .from('resume_versions')
      .select('id, version_name, created_at')
      .eq('resume_id', resumeId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(MAX_VERSIONS_PER_RESUME)

    if (error) throw error

    return NextResponse.json({ versions: versions || [] })
  } catch (err: any) {
    console.error('[resume-versions] GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 })
  }
}

// POST /api/resume/versions — save current resume as a new version snapshot
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { resumeId, versionName } = body

    if (!resumeId) {
      return NextResponse.json({ error: 'Missing resumeId' }, { status: 400 })
    }

    // Fetch the current resume data (RLS ensures ownership)
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select('id, user_id, name, template, resume_type, content')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single()

    if (resumeError || !resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    // Check existing version count
    const { count } = await supabase
      .from('resume_versions')
      .select('id', { count: 'exact', head: true })
      .eq('resume_id', resumeId)
      .eq('user_id', user.id)

    // If at limit, delete the oldest version
    if (count !== null && count >= MAX_VERSIONS_PER_RESUME) {
      const { data: oldest } = await supabase
        .from('resume_versions')
        .select('id')
        .eq('resume_id', resumeId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single()

      if (oldest) {
        await supabase
          .from('resume_versions')
          .delete()
          .eq('id', oldest.id)
      }
    }

    // Auto-generate version name if not provided
    const now = new Date()
    const autoName = versionName?.trim() || `Version ${(count ?? 0) + 1} \u00b7 ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`

    // Snapshot the full resume state
    const snapshotData = {
      name: resume.name,
      template: resume.template,
      resume_type: resume.resume_type,
      content: resume.content,
    }

    const { data: version, error: insertError } = await supabase
      .from('resume_versions')
      .insert({
        resume_id: resumeId,
        user_id: user.id,
        version_name: autoName,
        resume_data: snapshotData,
      })
      .select('id, version_name, created_at')
      .single()

    if (insertError) throw insertError

    return NextResponse.json({ version })
  } catch (err: any) {
    console.error('[resume-versions] POST error:', err)
    return NextResponse.json({ error: 'Failed to save version' }, { status: 500 })
  }
}
