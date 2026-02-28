import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { TopNav } from '@/components/layout/TopNav'
import { StatusBar } from '@/components/layout/StatusBar'
import { AnnouncementBanner } from '@/components/layout/AnnouncementBanner'
import { PostActionModalProvider } from '@/components/paywall/PostActionModalProvider'
import { UpgradeModalProvider } from '@/components/modals/UpgradeModal'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch only the profile fields needed for layout and nav
  let { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, rank, tier, subscription_tier, plan, plan_expires_at, is_admin, onboarding_completed')
    .eq('user_id', user.id)
    .single()

  // Check if user is an org admin (for partner portal link)
  const sc = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: orgMembership } = await sc
    .from('organization_members')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .single()

  const isOrgAdmin = !!orgMembership

  // Check if plan has expired and revert to free if so
  if (profile && profile.tier !== 'free' && profile.plan_expires_at) {
    const expiresAt = new Date(profile.plan_expires_at)
    const now = new Date()

    if (expiresAt < now) {
      // Plan expired - revert to free
      console.log(`Plan expired for user ${user.id}, reverting to free`)
      await supabase
        .from('profiles')
        .update({
          tier: 'free',
          subscription_tier: 'free',
          plan: 'free',
          plan_expires_at: null
        })
        .eq('user_id', user.id)

      // Update local profile object
      profile = {
        ...profile,
        tier: 'free',
        subscription_tier: 'free',
        plan: 'free',
        plan_expires_at: null
      }
    }
  }

  // Redirect to onboarding if not completed
  if (profile && !profile.onboarding_completed) {
    redirect('/onboarding')
  }

  // Build user object for nav
  const navUser = {
    email: user.email,
    first_name: profile?.first_name,
    last_name: profile?.last_name,
    rank: profile?.rank,
  }

  return (
    <UpgradeModalProvider>
      <div className="min-h-screen bg-bg-primary overflow-x-hidden">
        <TopNav
          user={navUser}
          tier={profile?.tier || 'free'}
          isAdmin={profile?.is_admin || false}
          isOrgAdmin={isOrgAdmin}
        />

        <AnnouncementBanner />

        <div className="hidden md:block">
          <StatusBar />
        </div>

        <main className="px-4 md:px-6 lg:px-8 pt-[72px] pb-4">
          <PostActionModalProvider userId={user.id}>
            {children}
          </PostActionModalProvider>
        </main>
      </div>
    </UpgradeModalProvider>
  )
}
