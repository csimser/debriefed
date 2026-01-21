import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { StatusBar } from '@/components/layout/StatusBar'
import { AnnouncementBanner } from '@/components/layout/AnnouncementBanner'
import { BetaCodeRedeemerWrapper } from '@/components/beta/BetaCodeRedeemerWrapper'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profile - all data is in the profiles table
  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Check if plan has expired and revert to free if so
  if (profile && profile.subscription_tier !== 'free' && profile.plan_expires_at) {
    const expiresAt = new Date(profile.plan_expires_at)
    const now = new Date()

    if (expiresAt < now) {
      // Plan expired - revert to free
      console.log(`Plan expired for user ${user.id}, reverting to free`)
      await supabase
        .from('profiles')
        .update({
          subscription_tier: 'free',
          plan: 'free',
          plan_expires_at: null
        })
        .eq('user_id', user.id)

      // Update local profile object
      profile = {
        ...profile,
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

  // Build user object for sidebar
  const sidebarUser = {
    email: user.email,
    first_name: profile?.first_name,
    last_name: profile?.last_name,
    rank: profile?.rank,
  }

  return (
    <div className="flex min-h-screen bg-bg-primary">
      {/* Beta Code Redeemer - checks for pending codes from signup */}
      <BetaCodeRedeemerWrapper userId={user.id} />

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          user={sidebarUser}
          tier={profile?.tier || 'free'}
          isAdmin={profile?.is_admin || false}
        />
      </div>

      {/* Mobile Nav */}
      <MobileNav user={profile} />

      <div className="flex-1 flex flex-col">
        {/* Announcement Banner */}
        <AnnouncementBanner />

        {/* Desktop Status Bar */}
        <div className="hidden md:block">
          <StatusBar />
        </div>

        {/* Main Content - add top padding on mobile for fixed header */}
        <main className="flex-1 p-4 md:p-8 overflow-auto pt-16 md:pt-8">
          {children}
        </main>
      </div>

    </div>
  )
}
