'use client'

import { useState, useEffect } from 'react'
import { PRICING_TIERS, getFormattedPrice, type TierId } from '@/lib/pricing-config'
import { trackEvent } from '@/lib/analytics'

interface PaymentSuccessBannerProps {
  tier: TierId
}

const TIER_HIGHLIGHTS: Record<string, string[]> = {
  core: [
    'AI-powered resume analysis & job matching',
    'AI cover letters & LinkedIn tools',
    'Unlimited imports & AI summaries',
  ],
  full: [
    'Unlimited resumes & AI analysis',
    'LinkedIn Profile Analysis & Recommendations',
    'Maximum daily limits across all tools',
  ],
}

export function PaymentSuccessBanner({ tier }: PaymentSuccessBannerProps) {
  const [visible, setVisible] = useState(true)

  // Track successful payment
  useEffect(() => {
    trackEvent('stripe_checkout_success', { tier })
  }, [tier])

  // Auto-dismiss after 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 15000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible || tier === 'free' || tier === 'expired') return null

  const tierConfig = PRICING_TIERS[tier]
  const highlights = TIER_HIGHLIGHTS[tier] || []

  return (
    <div className="relative overflow-hidden border-2 border-gold rounded-xl p-6 bg-gradient-to-r from-gold/10 via-gold/5 to-transparent animate-fade-in">
      {/* Close button */}
      <button
        onClick={() => setVisible(false)}
        className="absolute top-3 right-3 p-1 text-text-muted hover:text-text transition-colors"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-start gap-4">
        {/* Checkmark icon */}
        <div className="w-12 h-12 rounded-full bg-status-green/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-status-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-gold mb-1">
            You&apos;re Upgraded!
          </h2>
          <p className="text-sm text-text-muted mb-3">
            Welcome to <span className="font-semibold text-text">{tierConfig.name}</span> &mdash; {getFormattedPrice(tier)} for {tierConfig.duration} days of access.
          </p>

          {highlights.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-text-muted font-semibold uppercase tracking-wider">What you unlocked:</p>
              {highlights.map((h) => (
                <div key={h} className="flex items-center gap-2 text-sm text-text-muted">
                  <span className="text-status-green text-xs font-bold">&#10003;</span>
                  {h}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
