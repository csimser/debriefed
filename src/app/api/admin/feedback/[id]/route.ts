import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { verifyAdmin } from '@/lib/admin-auth'

// Service role client bypasses RLS for admin queries
const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper to log admin actions (uses service client)
async function logAdminAction(
  adminUserId: string,
  action: string,
  details: Record<string, any>
) {
  try {
    await serviceClient.from('activity_log').insert({
      user_id: adminUserId,
      action,
      details: {
        ...details,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Failed to log admin action:', error)
  }
}

// DELETE - Remove feedback
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await verifyAdmin()
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    // Get feedback details for logging before deletion
    const { data: feedback } = await serviceClient
      .from('user_feedback')
      .select('type, message, status')
      .eq('id', id)
      .single()

    if (!feedback) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 })
    }

    const { error } = await serviceClient
      .from('user_feedback')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting feedback:', error)
      return NextResponse.json({ error: 'Failed to delete feedback' }, { status: 500 })
    }

    await logAdminAction(auth.user.id, 'feedback_deleted', {
      admin_email: auth.adminProfile.email,
      feedback_id: id,
      feedback_type: feedback.type,
      feedback_status: feedback.status,
    })

    return NextResponse.json({ message: 'Feedback deleted successfully' })
  } catch (error) {
    console.error('Error deleting feedback:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PATCH - Update feedback status, admin notes, or admin response
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await verifyAdmin()
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const body = await request.json()
    const { status, admin_notes, admin_response } = body

    // Validate status if provided
    const validStatuses = ['new', 'reviewed', 'resolved']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Get current feedback using service client
    const { data: currentFeedback } = await serviceClient
      .from('user_feedback')
      .select('status, admin_notes, type, message')
      .eq('id', id)
      .single()

    if (!currentFeedback) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 })
    }

    // Build update object
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    if (status) {
      updates.status = status
    }

    if (admin_notes !== undefined) {
      updates.admin_notes = admin_notes
    }

    if (admin_response !== undefined) {
      updates.admin_response = admin_response
    }

    // Update feedback using service client
    const { error } = await serviceClient
      .from('user_feedback')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('Error updating feedback:', error)
      return NextResponse.json({ error: 'Failed to update feedback' }, { status: 500 })
    }

    // Log action
    await logAdminAction(auth.user.id, 'feedback_updated', {
      admin_email: auth.adminProfile.email,
      feedback_id: id,
      previous_status: currentFeedback.status,
      new_status: status || currentFeedback.status,
      notes_updated: admin_notes !== undefined,
      response_updated: admin_response !== undefined,
      feedback_type: currentFeedback.type,
    })

    return NextResponse.json({
      message: 'Feedback updated successfully',
    })
  } catch (error) {
    console.error('Error updating feedback:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
