import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// DELETE /api/resume/versions/[id] — delete a specific version
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: versionId } = await params

    if (!versionId) {
      return NextResponse.json({ error: 'Missing version id' }, { status: 400 })
    }

    const { error } = await supabase
      .from('resume_versions')
      .delete()
      .eq('id', versionId)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[resume-versions] DELETE error:', err)
    return NextResponse.json({ error: 'Failed to delete version' }, { status: 500 })
  }
}
