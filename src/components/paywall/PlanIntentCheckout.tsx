'use client'

import { useEffect, useState } from 'react'
import { useUpgradeModal } from '@/components/modals/UpgradeModal'

interface PlanIntentCheckoutProps {
  plan: string
  currentTier: string
}

export function PlanIntentCheckout({ plan, currentTier }: PlanIntentCheckoutProps) {
  const { openUpgradeModal } = useUpgradeModal()
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    // Only trigger for free/expired users with a valid plan intent
    if (triggered) return
    if (currentTier === 'core' || currentTier === 'full') return
    if (plan !== 'core' && plan !== 'full') return

    setTriggered(true)

    // Small delay to let the dashboard render first
    const timer = setTimeout(() => {
      // Try direct checkout first
      fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: plan }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.url) {
            window.location.href = data.url
          } else {
            // Fallback: open the upgrade modal
            openUpgradeModal()
          }
        })
        .catch(() => {
          // Fallback: open the upgrade modal
          openUpgradeModal()
        })
    }, 500)

    return () => clearTimeout(timer)
  }, [plan, currentTier, triggered, openUpgradeModal])

  // Show a brief loading indicator while redirecting to checkout
  if (triggered && (currentTier === 'free' || currentTier === 'expired') && (plan === 'core' || plan === 'full')) {
    return (
      <div className="p-4 bg-gold-dim border border-gold/30 rounded-lg text-center">
        <div className="flex items-center justify-center gap-3">
          <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          <span className="text-sm text-gold font-medium">
            Redirecting to checkout...
          </span>
        </div>
      </div>
    )
  }

  return null
}
