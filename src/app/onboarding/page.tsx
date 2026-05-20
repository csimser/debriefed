import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NewOnboardingWizard } from '@/components/onboarding-new/NewOnboardingWizard'

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const planIntent = typeof params.plan === 'string' ? params.plan : null

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profile directly - all fields are on profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // If already completed onboarding, go to dashboard (preserve plan intent)
  if (profile?.onboarding_completed) {
    redirect(planIntent ? `/dashboard?plan=${planIntent}` : '/dashboard')
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <NewOnboardingWizard
        userId={user.id}
        currentStep={profile?.onboarding_step || 0}
        existingProfile={profile}
        userPlan={profile?.tier || 'free'}
        planIntent={planIntent}
      />
    </div>
  )
}
