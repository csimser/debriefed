import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, email')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) {
    // Redirect to dashboard - toast would need to be handled client-side
    redirect('/dashboard?error=access_denied')
  }

  return (
    <AdminLayout adminEmail={profile.email || user.email}>
      {children}
    </AdminLayout>
  )
}
