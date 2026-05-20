'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ModalShell } from '@/components/ui/ModalShell'
import { useUpgradeModal } from '@/components/modals/UpgradeModal'
import { trackEvent } from '@/lib/analytics'

export interface PostActionLink {
  label: string
  route: string
  featureCheck: string
  remaining?: number
}

export interface PostActionModalProps {
  title: string
  subtitle: string
  primaryCTA: PostActionLink
  secondaryLinks: PostActionLink[]
  onDismiss: () => void
  // Feedback props
  showFeedback?: boolean
  featureContext?: string
  onFeedbackSubmitted?: () => void
  onFeedbackShown?: () => void
}

export function PostActionModal({
  title,
  subtitle,
  primaryCTA,
  secondaryLinks,
  onDismiss,
  showFeedback = false,
  featureContext = '',
  onFeedbackSubmitted,
  onFeedbackShown,
}: PostActionModalProps) {
  const router = useRouter()
  const { openUpgradeModal } = useUpgradeModal()

  // Feedback state
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [testimonialConsent, setTestimonialConsent] = useState(false)
  const [feedbackState, setFeedbackState] = useState<'idle' | 'expanded' | 'submitting' | 'submitted' | 'hidden'>('idle')
  const feedbackRef = useRef<HTMLDivElement>(null)

  // Track modal shown
  useEffect(() => {
    trackEvent('post_action_modal_shown', { feature: featureContext })
  }, [featureContext])

  // Notify provider that feedback section was rendered
  useEffect(() => {
    if (showFeedback && onFeedbackShown) {
      onFeedbackShown()
    }
  }, [showFeedback, onFeedbackShown])

  // Fade out "Thanks" message after 2 seconds
  useEffect(() => {
    if (feedbackState === 'submitted') {
      const timer = setTimeout(() => {
        setFeedbackState('hidden')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [feedbackState])

  const handlePrimaryCTA = () => {
    trackEvent('post_action_cta_click', { feature: featureContext, cta: primaryCTA.featureCheck })
    onDismiss()
    router.push(primaryCTA.route)
  }

  const handleSecondaryLink = (route: string) => {
    onDismiss()
    router.push(route)
  }

  const handleStarClick = (star: number) => {
    setRating(star)
    setFeedbackState('expanded')
    // Scroll feedback into view on mobile
    setTimeout(() => {
      feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 100)
  }

  const handleFeedbackSubmit = async () => {
    if (!rating) return

    setFeedbackState('submitting')

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment: comment.trim() || null,
          testimonialConsent,
          featureContext,
        }),
      })

      if (res.ok) {
        setFeedbackState('submitted')
        onFeedbackSubmitted?.()
      } else {
        // Silently fail — don't disrupt the modal UX
        setFeedbackState('expanded')
      }
    } catch {
      setFeedbackState('expanded')
    }
  }

  return (
    <ModalShell isOpen={true} onClose={onDismiss} title="Post Action" maxWidth="max-w-md" className="self-end md:self-center">
      <Card
        className="relative w-full p-6 md:p-8 rounded-t-2xl md:rounded-lg md:mx-4 safe-area-inset-bottom animate-post-action-in max-h-[90vh] overflow-y-auto"
      >
        {/* Drag indicator for mobile */}
        <div className="md:hidden w-12 h-1 bg-border rounded-full mx-auto mb-4" />

        {/* Close button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-text-dim hover:text-text transition-colors rounded-full hover:bg-bg-tertiary"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Success icon */}
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-status-green/15 flex items-center justify-center">
          <svg className="w-6 h-6 text-status-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-center mb-2">
          {title}
        </h2>

        {/* Subtitle */}
        <p className="text-text-muted text-sm text-center leading-relaxed mb-6">
          {subtitle}
        </p>

        {/* Primary CTA */}
        {primaryCTA.remaining !== undefined && primaryCTA.remaining <= 0 ? (
          <div className="mb-4 p-3 bg-gold/10 border border-gold/30 rounded-lg text-center">
            <p className="text-sm text-text-muted mb-2">
              You&apos;ve used all your free {primaryCTA.featureCheck.replace(/_/g, ' ')}s.
            </p>
            <Button
              className="w-full"
              onClick={() => { onDismiss(); openUpgradeModal() }}
            >
              Upgrade to Core for more
            </Button>
          </div>
        ) : (
          <Button
            className="w-full mb-4"
            onClick={handlePrimaryCTA}
          >
            {primaryCTA.label}
          </Button>
        )}

        {/* Secondary Links */}
        {secondaryLinks.length > 0 && (
          <div className="space-y-2 mb-4">
            {secondaryLinks.map((link) => (
              link.remaining !== undefined && link.remaining <= 0 ? (
                <button
                  key={link.route}
                  onClick={() => { onDismiss(); openUpgradeModal() }}
                  className="w-full text-sm text-gold/70 hover:text-gold transition-colors py-1.5 text-center"
                >
                  {link.label} — upgrade to unlock →
                </button>
              ) : (
                <button
                  key={link.route}
                  onClick={() => handleSecondaryLink(link.route)}
                  className="w-full text-sm text-text-muted hover:text-gold transition-colors py-1.5 text-center"
                >
                  {link.label} →
                </button>
              )
            ))}
          </div>
        )}

        {/* Maybe Later */}
        <button
          onClick={onDismiss}
          className="w-full text-sm text-text-muted hover:text-text border border-border hover:border-gold/30 rounded-lg py-2.5 text-center transition-colors"
        >
          Maybe later
        </button>

        {/* ─── Inline Feedback Section ──────────────────────────────── */}
        {showFeedback && feedbackState !== 'hidden' && (
          <div ref={feedbackRef}>
            {/* Divider */}
            <div className="border-t border-border mt-4 pt-4" />

            {feedbackState === 'submitted' ? (
              <p className="text-sm text-text-muted text-center animate-fade-in">
                Thanks. That means a lot.
              </p>
            ) : (
              <>
                {/* Question */}
                <p className="text-xs text-text-dim text-center mb-3">
                  Quick question — how's Debriefed working for you so far?
                </p>

                {/* Star Rating */}
                <div className="flex justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                      aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                    >
                      <svg
                        className={`w-7 h-7 transition-colors ${
                          star <= (hoverRating || rating)
                            ? 'text-gold fill-gold'
                            : 'text-border fill-none'
                        }`}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                      </svg>
                    </button>
                  ))}
                </div>

                {/* Expanded feedback form — shows after star click */}
                {(feedbackState === 'expanded' || feedbackState === 'submitting') && (
                  <div className="space-y-3 animate-fade-in">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Anything you'd share with a fellow veteran about Debriefed?"
                      rows={2}
                      maxLength={1000}
                      className="w-full bg-bg-secondary border border-border rounded-md px-3 py-2 text-sm text-text placeholder:text-text-dim resize-none focus:border-gold focus:ring-1 focus:ring-gold/25"
                      autoComplete="off"
                    />

                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={testimonialConsent}
                        onChange={(e) => setTestimonialConsent(e.target.checked)}
                        className="mt-0.5 rounded border-border bg-bg-secondary text-gold focus:ring-gold/25"
                      />
                      <span className="text-xs text-text-dim leading-relaxed">
                        OK to feature my feedback anonymously on the site
                      </span>
                    </label>

                    <Button
                      size="sm"
                      onClick={handleFeedbackSubmit}
                      disabled={feedbackState === 'submitting'}
                      className="w-full"
                    >
                      {feedbackState === 'submitting' ? 'Submitting...' : 'Submit'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </Card>
    </ModalShell>
  )
}
