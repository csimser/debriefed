import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/resume/versions/restore — restore a version (overwrites current resume)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { versionId } = body

    if (!versionId) {
      return NextResponse.json({ error: 'Missing versionId' }, { status: 400 })
    }

    // Fetch the version (RLS ensures ownership)
    const { data: version, error: versionError } = await supabase
      .from('resume_versions')
      .select('id, resume_id, user_id, resume_data')
      .eq('id', versionId)
      .eq('user_id', user.id)
      .single()

    if (versionError || !version) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    }

    const snapshotData = version.resume_data as {
      name?: string
      template?: string
      resume_type?: string
      content?: any
    }

    if (!snapshotData?.content) {
      return NextResponse.json({ error: 'Invalid version data' }, { status: 400 })
    }

    // Overwrite the current resume with snapshot data
    const { error: updateError } = await supabase
      .from('resumes')
      .update({
        name: snapshotData.name,
        template: snapshotData.template,
        resume_type: snapshotData.resume_type,
        content: snapshotData.content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', version.resume_id)
      .eq('user_id', user.id)

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      resume: {
        id: version.resume_id,
        name: snapshotData.name,
        template: snapshotData.template,
        resume_type: snapshotData.resume_type,
        content: snapshotData.content,
      },
    })
  } catch (err: any) {
    console.error('[resume-versions] restore error:', err)
    return NextResponse.json({ error: 'Failed to restore version' }, { status: 500 })
  }
}
