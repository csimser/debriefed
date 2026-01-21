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

// DELETE - Delete a beta code (optionally revoke user access)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const revokeAccess = searchParams.get('revoke') === 'true'

  const authClient = await createClient()

  const auth = await verifyAdmin(authClient)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    // Get code info before deletion (including used_by for revocation)
    const { data: codeToDelete } = await serviceClient
      .from('beta_codes')
      .select('code, used, used_by')
      .eq('id', id)
      .single()

    if (!codeToDelete) {
      return NextResponse.json({ error: 'Code not found' }, { status: 404 })
    }

    // If code was used and we want to revoke access, downgrade the user
    let accessRevoked = false
    if (codeToDelete.used && codeToDelete.used_by && revokeAccess) {
      const { error: revokeError } = await serviceClient
        .from('profiles')
        .update({
          subscription_tier: 'free',
          plan: 'free',
          plan_expires_at: null
        })
        .eq('user_id', codeToDelete.used_by)

      if (!revokeError) {
        accessRevoked = true
        console.log(`Revoked access for user ${codeToDelete.used_by} (code: ${codeToDelete.code})`)
      }
    }

    // Delete the code
    const { error } = await serviceClient
      .from('beta_codes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting beta code:', error)
      return NextResponse.json({ error: 'Failed to delete code' }, { status: 500 })
    }

    // Log deletion
    await logAdminAction(auth.user.id, 'beta_code_deleted', {
      admin_email: auth.adminProfile.email,
      code: codeToDelete.code,
      was_used: codeToDelete.used,
      access_revoked: accessRevoked,
      user_affected: accessRevoked ? codeToDelete.used_by : null
    })

    return NextResponse.json({
      success: true,
      message: 'Code deleted successfully',
      deleted: codeToDelete.code,
      accessRevoked
    })
  } catch (error) {
    console.error('Error deleting beta code:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
