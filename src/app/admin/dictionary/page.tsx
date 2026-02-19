import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { AdminDictionaryPanel } from '@/components/admin/AdminDictionaryPanel'

const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export default async function AdminDictionaryPage() {
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  const { data: profile } = await serviceClient
    .from('profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/dashboard')
  }

  // Load pending submissions, missing terms, and AI translation count
  const [{ data: pending }, { data: missing }, { count: aiPendingCount }] = await Promise.all([
    serviceClient
      .from('dict_submissions')
      .select('*')
      .eq('status', 'pending')
      .order('upvotes', { ascending: false }),
    serviceClient
      .from('dict_missing_terms_log')
      .select('*')
      .eq('status', 'pending')
      .order('hit_count', { ascending: false })
      .limit(50),
    serviceClient
      .from('ai_generated_translations')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
  ])

  return (
    <AdminDictionaryPanel
      pendingSubmissions={pending || []}
      missingTerms={missing || []}
      adminId={user.id}
      aiTranslationsPendingCount={aiPendingCount || 0}
    />
  )
}
