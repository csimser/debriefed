import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NewOnboardingWizard } from '@/components/onboarding-new/NewOnboardingWizard'

export default async function OnboardingPage() {
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

  // If already completed onboarding, go to dashboard
  if (profile?.onboarding_completed) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <NewOnboardingWizard
        userId={user.id}
        currentStep={profile?.onboarding_step || 0}
        existingProfile={profile}
      />
    </div>
  )
}
