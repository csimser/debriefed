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
  adminEmail: string,
  targetUserId: string,
  action: string,
  details: Record<string, any>
) {
  try {
    await serviceClient.from('activity_log').insert({
      user_id: adminUserId, // Log under admin's ID for admin actions
      action,
      details: {
        ...details,
        admin_email: adminEmail,
        target_user_id: targetUserId,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Failed to log admin action:', error)
  }
}

// GET - Get single user with resumes and API usage
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const authClient = await createClient()

  const auth = await verifyAdmin(authClient)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  // Get user profile (using service client to bypass RLS)
  const { data: profile, error: profileError } = await serviceClient
    .from('profiles')
    .select('*')
    .eq('user_id', id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Get user's resumes
  const { data: resumes } = await serviceClient
    .from('resumes')
    .select('id, name, template, resume_type, created_at, updated_at')
    .eq('user_id', id)
    .order('updated_at', { ascending: false })

  // Get activity log for this user
  const { data: activityLog } = await serviceClient
    .from('activity_log')
    .select('*')
    .eq('user_id', id)
    .order('created_at', { ascending: false })
    .limit(50)

  // Get API usage for this user
  const { data: apiUsage } = await serviceClient
    .from('api_usage')
    .select('*')
    .eq('user_id', id)
    .order('created_at', { ascending: false })
    .limit(20)

  // Calculate total tokens used
  const { data: tokenSum } = await serviceClient
    .from('api_usage')
    .select('tokens_used')
    .eq('user_id', id)

  const totalTokensUsed = tokenSum?.reduce((sum, row) => sum + (row.tokens_used || 0), 0) || 0

  // Get cumulative usage stats
  const { data: usageStats } = await serviceClient
    .from('usage')
    .select('*')
    .eq('user_id', id)
    .single()

  return NextResponse.json({
    user: profile,
    resumes: resumes || [],
    activityLog: activityLog || [],
    apiUsage: apiUsage || [],
    totalTokensUsed,
    usageStats: usageStats || {
      resumes_created: 0,
      resumes_downloaded: 0,
      cover_letters: 0,
      job_matches: 0,
      eval_uploads: 0,
      bullet_rewrites: 0,
      ai_summaries: 0,
      private_downloads: 0,
      federal_downloads: 0,
    },
  })
}

// PATCH - Update user (tier, role, suspended)
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

  const body = await request.json()
  const { tier, is_admin, suspended, suspend_reason } = body

  // Get current user data for comparison (using service client)
  const { data: currentUser } = await serviceClient
    .from('profiles')
    .select('tier, is_admin, suspended, email')
    .eq('user_id', id)
    .single()

  if (!currentUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Build update object
  const updates: Record<string, any> = {
    updated_at: new Date().toISOString(),
  }

  const changes: string[] = []

  if (tier !== undefined && tier !== currentUser.tier) {
    updates.tier = tier
    changes.push(`tier: ${currentUser.tier || 'free'} → ${tier}`)

    await logAdminAction(auth.user.id, auth.adminProfile.email, id, 'tier_changed', {
      previous_tier: currentUser.tier || 'free',
      new_tier: tier,
      target_email: currentUser.email,
    })
  }

  if (is_admin !== undefined && is_admin !== currentUser.is_admin) {
    updates.is_admin = is_admin
    changes.push(`is_admin: ${currentUser.is_admin} → ${is_admin}`)

    await logAdminAction(auth.user.id, auth.adminProfile.email, id, 'role_changed', {
      previous_is_admin: currentUser.is_admin,
      new_is_admin: is_admin,
      target_email: currentUser.email,
    })
  }

  if (suspended !== undefined && suspended !== currentUser.suspended) {
    updates.suspended = suspended
    if (suspended) {
      updates.suspended_at = new Date().toISOString()
      updates.suspend_reason = suspend_reason || null
    } else {
      updates.suspended_at = null
      updates.suspend_reason = null
    }
    changes.push(`suspended: ${currentUser.suspended || false} → ${suspended}`)

    await logAdminAction(auth.user.id, auth.adminProfile.email, id, 'user_suspended', {
      suspended: suspended,
      reason: suspend_reason || null,
      target_email: currentUser.email,
    })
  }

  if (changes.length === 0) {
    return NextResponse.json({ message: 'No changes to apply' })
  }

  // Apply updates (using service client)
  const { error: updateError } = await serviceClient
    .from('profiles')
    .update(updates)
    .eq('user_id', id)

  if (updateError) {
    console.error('Error updating user:', updateError)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }

  // Log general update
  await logAdminAction(auth.user.id, auth.adminProfile.email, id, 'user_updated', {
    changes,
    target_email: currentUser.email,
  })

  return NextResponse.json({
    message: 'User updated successfully',
    changes,
  })
}

// DELETE - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const authClient = await createClient()

  const auth = await verifyAdmin(authClient)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  // Get user info before deletion for logging (using service client)
  const { data: userToDelete } = await serviceClient
    .from('profiles')
    .select('email, first_name, last_name')
    .eq('user_id', id)
    .single()

  if (!userToDelete) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Prevent self-deletion
  if (id === auth.user.id) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
  }

  // Log deletion before it happens
  await logAdminAction(auth.user.id, auth.adminProfile.email, id, 'user_deleted', {
    deleted_email: userToDelete.email,
    deleted_name: `${userToDelete.first_name || ''} ${userToDelete.last_name || ''}`.trim(),
  })

  // Delete related data first (due to foreign key constraints)
  // First get experience IDs for this user
  const { data: experiences } = await serviceClient
    .from('experience')
    .select('id')
    .eq('user_id', id)

  // Delete experience bullets
  if (experiences && experiences.length > 0) {
    const experienceIds = experiences.map(e => e.id)
    await serviceClient
      .from('experience_bullets')
      .delete()
      .in('experience_id', experienceIds)
  }

  // Delete experiences
  await serviceClient.from('experience').delete().eq('user_id', id)

  // Delete education
  await serviceClient.from('education').delete().eq('user_id', id)

  // Delete certifications
  await serviceClient.from('certifications').delete().eq('user_id', id)

  // Delete skills
  await serviceClient.from('skills').delete().eq('user_id', id)

  // Delete resumes
  await serviceClient.from('resumes').delete().eq('user_id', id)

  // Delete API usage
  await serviceClient.from('api_usage').delete().eq('user_id', id)

  // Delete activity log
  await serviceClient.from('activity_log').delete().eq('user_id', id)

  // Delete usage
  await serviceClient.from('usage').delete().eq('user_id', id)

  // Delete profile
  const { error: profileError } = await serviceClient
    .from('profiles')
    .delete()
    .eq('user_id', id)

  if (profileError) {
    console.error('Error deleting profile:', profileError)
    return NextResponse.json({ error: 'Failed to delete user profile' }, { status: 500 })
  }

  return NextResponse.json({
    message: 'User deleted successfully',
    deleted: userToDelete.email,
  })
}
