'use client'

import { useEffect, useState } from 'react'

interface BetaCodeRedeemerProps {
  userId?: string
  onRedeemed?: () => void
}

/**
 * Component that checks for pending beta codes in localStorage
 * and redeems them when the user is authenticated.
 *
 * Add this to your dashboard layout to handle beta codes
 * that were entered during signup but couldn't be redeemed
 * until after email verification.
 */
export function BetaCodeRedeemer({ userId, onRedeemed }: BetaCodeRedeemerProps) {
  const [isRedeeming, setIsRedeeming] = useState(false)

  useEffect(() => {
    // Only run if we have a userId and aren't already redeeming
    if (!userId || isRedeeming) return

    const pendingBetaCode = localStorage.getItem('pendingBetaCode')

    if (!pendingBetaCode) return

    console.log('Found pending beta code:', pendingBetaCode)
    setIsRedeeming(true)

    // Redeem the code
    fetch('/api/beta/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: pendingBetaCode }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log('Beta code redeemed successfully:', data)
          onRedeemed?.()
          // Reload to reflect new plan
          window.location.reload()
        } else {
          console.error('Beta code redemption failed:', data.error)
        }
      })
      .catch(err => {
        console.error('Beta code redemption error:', err)
      })
      .finally(() => {
        // Always remove the pending code to prevent infinite loops
        localStorage.removeItem('pendingBetaCode')
        setIsRedeeming(false)
      })
  }, [userId, isRedeeming, onRedeemed])

  // This component doesn't render anything
  return null
}
