'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const DISMISS_KEY = 'incomplete-profile-banner-dismissed'

interface IncompleteProfileBannerProps {
  show: boolean
}

export function IncompleteProfileBanner({ show }: IncompleteProfileBannerProps) {
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem(DISMISS_KEY) === 'true'
    setDismissed(wasDismissed)
  }, [])

  if (!show || dismissed) return null

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, 'true')
    setDismissed(true)
  }

  return (
    <div className="bg-gold-dim border border-gold/30 rounded-lg p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-gold text-lg shrink-0">&#9888;</span>
          <p className="text-sm">
            Complete your profile to get the most out of your resumes
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/profile"
            className="px-4 py-1.5 bg-gold text-bg-primary text-sm font-semibold rounded hover:bg-gold/90 transition-colors"
          >
            Complete Profile
          </Link>
          <button
            onClick={handleDismiss}
            className="text-text-muted hover:text-text transition-colors p-1"
            aria-label="Dismiss"
          >
            &#10005;
          </button>
        </div>
      </div>
    </div>
  )
}
