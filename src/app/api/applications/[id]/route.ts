import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// PATCH /api/applications/[id] — update status, notes, or other fields
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from('job_applications')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const body = await request.json()
    const updates: Record<string, unknown> = {}

    // Only allow updating specific fields
    if (body.status !== undefined) {
      const validStatuses = ['applied', 'callback', 'interview', 'offer', 'rejected', 'accepted']
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      }
      updates.status = body.status
    }
    if (body.notes !== undefined) updates.notes = body.notes?.trim() || null
    if (body.company_name !== undefined) updates.company_name = body.company_name.trim()
    if (body.job_title !== undefined) updates.job_title = body.job_title.trim()
    if (body.applied_date !== undefined) updates.applied_date = body.applied_date
    if (body.salary_offered !== undefined) updates.salary_offered = body.salary_offered ? parseInt(body.salary_offered, 10) : null
    if (body.resume_id !== undefined) updates.resume_id = body.resume_id || null

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const { data: application, error } = await supabase
      .from('job_applications')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('id, resume_id, company_name, job_title, applied_date, status, notes, salary_offered, created_at, updated_at')
      .single()

    if (error) throw error

    return NextResponse.json({ application })
  } catch (err: unknown) {
    console.error('[applications] PATCH error:', err)
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
  }
}

// DELETE /api/applications/[id] — delete application
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('[applications] DELETE error:', err)
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 })
  }
}
