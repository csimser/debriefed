import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { verifyAdmin } from '@/lib/admin-auth'

// Service role client bypasses RLS for admin queries
const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST - Create impersonation session
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const auth = await verifyAdmin()
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  // Get target user info using service client
  const { data: targetUser } = await serviceClient
    .from('profiles')
    .select('email, first_name, last_name')
    .eq('user_id', id)
    .single()

  if (!targetUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Prevent self-impersonation
  if (id === auth.user.id) {
    return NextResponse.json({ error: 'Cannot impersonate yourself' }, { status: 400 })
  }

  // Log impersonation action using service client
  try {
    await serviceClient.from('activity_log').insert({
      user_id: auth.user.id,
      action: 'user_impersonated',
      details: {
        admin_email: auth.adminProfile.email,
        target_user_id: id,
        target_email: targetUser.email,
        target_name: `${targetUser.first_name || ''} ${targetUser.last_name || ''}`.trim(),
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Failed to log impersonation:', error)
  }

  // Store impersonation info in a cookie
  // This is a simplified approach - in production you'd want a more secure method
  const cookieStore = await cookies()

  // Store original admin ID so we can return to admin session
  cookieStore.set('admin_impersonating', JSON.stringify({
    adminId: auth.user.id,
    adminEmail: auth.adminProfile.email,
    targetId: id,
    targetEmail: targetUser.email,
    startedAt: new Date().toISOString(),
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour
    path: '/',
  })

  return NextResponse.json({
    message: 'Impersonation session started',
    targetUser: {
      id,
      email: targetUser.email,
      name: `${targetUser.first_name || ''} ${targetUser.last_name || ''}`.trim(),
    },
    // Redirect URL
    redirectTo: '/dashboard',
  })
}
