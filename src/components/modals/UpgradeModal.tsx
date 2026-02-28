'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { ModalShell } from '@/components/ui/ModalShell'
import { PRICING_TIERS, getFormattedPrice } from '@/lib/pricing-config'
import { trackEvent } from '@/lib/analytics'

/* ──────────────────────────── Context ──────────────────────────── */

const UpgradeModalContext = createContext<{ openUpgradeModal: () => void }>({
  openUpgradeModal: () => {},
})

export const useUpgradeModal = () => useContext(UpgradeModalContext)

/* ──────────────────────────── Provider ─────────────────────────── */

export function UpgradeModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const openUpgradeModal = useCallback(() => setIsOpen(true), [])
  const closeModal = useCallback(() => setIsOpen(false), [])

  return (
    <UpgradeModalContext.Provider value={{ openUpgradeModal }}>
      {children}
      {isOpen && <UpgradeModalContent onClose={closeModal} />}
    </UpgradeModalContext.Provider>
  )
}

/* ──────────────────── Drop-in link replacement ─────────────────── */

export function UpgradeLink({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const { openUpgradeModal } = useUpgradeModal()
  return (
    <button
      type="button"
      onClick={openUpgradeModal}
      className={className || 'text-gold hover:text-gold-bright hover:underline'}
    >
      {children}
    </button>
  )
}

/* ──────────────────────── Modal content ────────────────────────── */

const freeLimits = PRICING_TIERS.free.limits
const FREE_FEATURES = [
  `${freeLimits.private_resumes} Resumes`,
  `${freeLimits.federal_resumes} Federal Resumes`,
  `${freeLimits.cover_letters} Cover Letters (template only)`,
  `${freeLimits.job_match_analysis} Job Match Analyses (dictionary only)`,
  'No AI Summaries',
  'No LinkedIn AI Tools',
  `${freeLimits.downloads} Downloads`,
  '1 Template',
]

const coreLimits = PRICING_TIERS.core.limits
const coreDur = PRICING_TIERS.core.duration
const CORE_FEATURES = [
  `${coreLimits.private_resumes} Resumes / ${coreDur} days`,
  `${coreLimits.federal_resumes} Federal Resumes / ${coreDur} days`,
  `${coreLimits.cover_letters} AI Cover Letters / ${coreDur} days`,
  `${coreLimits.job_match_analysis} AI Job Match Analyses / ${coreDur} days`,
  'AI Summary Generation',
  'AI LinkedIn Headlines & Summaries',
  `${coreLimits.downloads} Downloads / ${coreDur} days`,
  `${coreLimits.eval_uploads} Eval Uploads / ${coreDur} days`,
  `${coreLimits.cover_letter_exports} Cover Letter Exports / ${coreDur} days`,
  'Unlimited Imports',
  'All 6 Templates',
]

const fullLimits = PRICING_TIERS.full.limits
const fullDur = PRICING_TIERS.full.duration
const FULL_FEATURES = [
  'Unlimited Resumes (7/day)',
  'Unlimited Federal Resumes (7/day)',
  `${fullLimits.cover_letters} AI Cover Letters / ${fullDur} days (15/day)`,
  `${fullLimits.job_match_analysis} AI Job Match / ${fullDur} days (15/day)`,
  'Unlimited AI Summaries',
  'Unlimited LinkedIn Tools',
  'LinkedIn Profile Analysis & Recommendations',
  'Unlimited Downloads (10/day)',
  `${fullLimits.eval_uploads} Eval Uploads / ${fullDur} days (10/day)`,
  'All 6 Templates',
]

function UpgradeModalContent({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState<'core' | 'full' | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    trackEvent('upgrade_modal_shown')
  }, [])

  const handleCheckout = async (tier: 'core' | 'full') => {
    trackEvent('upgrade_modal_checkout_click', { tier })
    setLoading(tier)
    setError(null)
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(null)
        return
      }
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Failed to start checkout.')
        setLoading(null)
      }
    } catch {
      setError('Network error. Please try again.')
      setLoading(null)
    }
  }

  return (
    <ModalShell isOpen={true} onClose={onClose} title="Choose Your Mission Package" maxWidth="max-w-3xl" backdrop="bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-secondary border border-border rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <div>
            <h2 className="font-heading text-xl md:text-2xl font-bold uppercase tracking-wider">
              Choose Your Mission Package
            </h2>
            <p className="text-sm text-text-muted mt-1">
              No subscriptions — straightforward access during your transition.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text transition-colors flex-shrink-0 ml-4"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mb-4 p-3 bg-status-red/10 border border-status-red/30 rounded text-status-red text-sm text-center">
            {error}
          </div>
        )}

        {/* Social proof */}
        <div className="mx-6 mb-4 text-center">
          <p className="text-xs text-text-muted">
            Join veterans who&apos;ve already translated their service into civilian careers with Debriefed.
          </p>
        </div>

        {/* Three-column grid */}
        <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Free — Current Plan */}
          <div className="border border-border rounded-lg p-5 flex flex-col relative opacity-70">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-bg-tertiary text-text-muted font-mono text-[9px] font-bold px-2.5 py-0.5 tracking-wider border border-border rounded-full">
              CURRENT PLAN
            </div>
            <div className="font-heading text-lg font-bold uppercase mb-0.5">Free</div>
            <div className="mb-3">
              <span className="font-heading text-2xl font-bold text-text-muted">$0</span>
            </div>
            <p className="text-xs text-text-muted mb-4">Basic tools to get started</p>
            <ul className="flex-1 space-y-1.5 mb-5">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-text-muted">
                  <span className="text-text-muted font-bold text-xs">{f.startsWith('No ') ? '\u2013' : '\u2713'}</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Core */}
          <div className="border border-border rounded-lg p-5 flex flex-col">
            <div className="font-heading text-lg font-bold uppercase mb-0.5">Core</div>
            <div className="mb-3">
              <span className="font-heading text-2xl font-bold text-gold">{getFormattedPrice('core')}</span>
              <span className="text-sm text-text-muted ml-1">/ {PRICING_TIERS.core.duration} days</span>
            </div>
            <p className="text-xs text-text-muted mb-4">AI-powered tools to land the job</p>
            <ul className="flex-1 space-y-1.5 mb-5">
              {CORE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-text-muted">
                  <span className="text-status-green font-bold text-xs">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout('core')}
              disabled={loading !== null}
              className="w-full py-3 border border-gold text-gold font-heading text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-gold hover:text-bg-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'core' ? 'Processing...' : 'Upgrade to Core \u2192'}
            </button>
          </div>

          {/* Full — Best Value */}
          <div className="border border-gold rounded-lg p-5 flex flex-col relative">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-bg-tertiary text-gold font-mono text-[9px] font-bold px-2.5 py-0.5 tracking-wider border border-gold rounded-full">
              BEST VALUE
            </div>
            <div className="font-heading text-lg font-bold uppercase mb-0.5">Full</div>
            <div className="mb-3">
              <span className="font-heading text-2xl font-bold text-gold">{getFormattedPrice('full')}</span>
              <span className="text-sm text-text-muted ml-1">/ {PRICING_TIERS.full.duration} days</span>
            </div>
            <p className="text-xs text-text-muted mb-4">Unlimited AI for serious job searches</p>
            <ul className="flex-1 space-y-1.5 mb-5">
              {FULL_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-text-muted">
                  <span className="text-status-green font-bold text-xs">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout('full')}
              disabled={loading !== null}
              className="w-full py-3 bg-gold border border-gold text-bg-primary font-heading text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-gold-bright transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'full' ? 'Processing...' : 'Upgrade to Full \u2192'}
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  )
}
