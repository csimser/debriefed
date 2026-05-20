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

// DELETE - Delete a promo code
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
    // Get code info before deletion for logging
    const { data: codeToDelete } = await serviceClient
      .from('promo_codes')
      .select('code, discount_percent, current_uses, max_uses')
      .eq('id', id)
      .single()

    if (!codeToDelete) {
      return NextResponse.json({ error: 'Code not found' }, { status: 404 })
    }

    // Delete the code
    const { error } = await serviceClient
      .from('promo_codes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting promo code:', error)
      return NextResponse.json({ error: 'Failed to delete code' }, { status: 500 })
    }

    // Log deletion
    await logAdminAction(auth.user.id, 'promo_code_deleted', {
      admin_email: auth.adminProfile.email,
      code: codeToDelete.code,
      discount_percent: codeToDelete.discount_percent,
      uses: `${codeToDelete.current_uses || 0}/${codeToDelete.max_uses || '∞'}`,
    })

    return NextResponse.json({
      message: 'Code deleted successfully',
      deleted: codeToDelete.code,
    })
  } catch (error) {
    console.error('Error deleting promo code:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
