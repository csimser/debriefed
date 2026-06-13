'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { NewOnboardingWizard } from '@/components/onboarding-new/NewOnboardingWizard'
import { FullPageLoader } from '@/components/ui/FullPageLoader'
import { getProfile, getSettings } from '@/lib/storage'
import type { Profile } from '@/lib/storage'

export default function OnboardingPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [existingProfile, setExistingProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const profile = getProfile()
    const settings = getSettings()

    // Already onboarded — go to the dashboard
    if (profile?.onboarding_completed || settings.onboarding_completed) {
      router.replace('/dashboard')
      return
    }

    setExistingProfile(profile)
    setReady(true)
  }, [router])

  if (!ready) {
    return <FullPageLoader message="Loading..." />
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <NewOnboardingWizard existingProfile={existingProfile} />
    </div>
  )
}
