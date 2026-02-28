import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { verifyAdmin } from '@/lib/admin-auth'

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const auth = await verifyAdmin()

  if ('error' in auth) {
    if (auth.status === 401) redirect('/login')
    redirect('/dashboard?error=access_denied')
  }

  return (
    <AdminLayout adminEmail={auth.adminProfile.email}>
      {children}
    </AdminLayout>
  )
}
