'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'milcalc_banner_dismissed'

export function MilCalcBanner() {
  const [dismissed, setDismissed] = useState(true) // default hidden to avoid flash

  useEffect(() => {
    const wasDismissed = localStorage.getItem(STORAGE_KEY)
    if (!wasDismissed) {
      setDismissed(false)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setDismissed(true)
  }

  if (dismissed) return null

  return (
    <div className="bg-status-blue/10 border border-status-blue/20 rounded-lg p-3">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-text-light">
            Know Your Numbers Before You Separate
          </p>
          <p className="text-xs text-text-muted mt-1">
            MilCalc runs the math on your military pay, benefits, and entitlements &mdash; so you&apos;re not guessing when it matters most.
          </p>
          {/* MilCalc was a sister product (military pay calculator) deployed at milcalc.app.
              Update this href to your own cross-promo URL, or delete this component. */}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-xs font-heading font-bold uppercase tracking-wider text-status-blue hover:text-status-blue/80 transition-colors"
          >
            Calculate Now &rarr;
          </a>
        </div>
        <button
          onClick={handleDismiss}
          className="text-text-muted hover:text-text flex-shrink-0 p-1"
          aria-label="Dismiss banner"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
