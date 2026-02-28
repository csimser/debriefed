import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export type AdminAuthResult =
  | { user: { id: string; email?: string }; adminProfile: { is_admin: boolean; email: string } }
  | { error: string; status: number }

/**
 * Verify the current request is from an authenticated admin user.
 *
 * Checks TWO paths (either grants access):
 *  1. `profiles.is_admin = true` in the database
 *  2. `user.id === process.env.SUPER_ADMIN_USER_ID` (env-var fallback for new UUIDs)
 */
export async function verifyAdmin(): Promise<AdminAuthResult> {
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized', status: 401 }
  }

  const serviceClient = createAdminClient()
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('is_admin, email')
    .eq('user_id', user.id)
    .single()

  const isSuperAdmin = !!process.env.SUPER_ADMIN_USER_ID && user.id === process.env.SUPER_ADMIN_USER_ID

  if (!profile?.is_admin && !isSuperAdmin) {
    return { error: 'Forbidden - Admin only', status: 403 }
  }

  return {
    user,
    adminProfile: {
      is_admin: true,
      email: profile?.email || user.email || '',
    },
  }
}

/** Type guard — true when result is an auth error */
export function isAdminError(result: AdminAuthResult): result is { error: string; status: number } {
  return 'error' in result
}
