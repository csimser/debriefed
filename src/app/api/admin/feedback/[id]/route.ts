import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

// Service role client bypasses RLS for admin queries
const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper to verify admin
async function verifyAdmin(authClient: any) {
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return { error: 'Unauthorized', status: 401 }

  // Use service client to check admin status (bypasses RLS)
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('is_admin, email')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) return { error: 'Forbidden - Admin only', status: 403 }

  return { user, adminProfile: profile }
}

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

// PATCH - Update feedback status or admin notes
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const authClient = await createClient()

  const auth = await verifyAdmin(authClient)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const body = await request.json()
    const { status, admin_notes } = body

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
