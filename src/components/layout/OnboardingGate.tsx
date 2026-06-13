'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getProfile, getSettings } from '@/lib/storage'

/**
 * Client-side replacement for the old auth middleware's onboarding redirect.
 * First-time visitors landing on an app page are sent through the onboarding
 * wizard to build their profile. Purely a UX nudge — there are no accounts.
 */
export function OnboardingGate() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const profile = getProfile()
    const settings = getSettings()
    const onboarded = settings.onboarding_completed || profile?.onboarding_completed
    if (!profile && !onboarded) {
      router.replace(`/onboarding/?from=${encodeURIComponent(pathname)}`)
    }
  }, [router, pathname])

  return null
}
