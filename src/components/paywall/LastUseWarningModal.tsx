'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface LastUseWarningModalProps {
  featureName: string
  tier: 'free' | 'core' | 'full' | 'expired'
  limitType: 'tier' | 'daily' | 'monthly'
  onContinue: () => void
  onViewPricing?: () => void
  /** Override message for special cases like downloads */
  customMessage?: string
}

export function LastUseWarningModal({
  featureName,
  tier,
  limitType,
  onContinue,
  onViewPricing,
  customMessage,
}: LastUseWarningModalProps) {
  const router = useRouter()

  const handleViewPricing = () => {
    if (onViewPricing) {
      onViewPricing()
    } else {
      router.push('/pricing')
    }
  }

  const getMessage = () => {
    if (customMessage) return customMessage

    if (tier === 'free' || tier === 'expired') {
      return `This is your last free ${featureName.toLowerCase()}. After this, you'll need to upgrade to continue using this feature.`
    }
    if (tier === 'core') {
      return `This is your last ${featureName.toLowerCase()} for your current plan. Upgrade to Full for more, or wait until your plan renews.`
    }
    // Full tier
    if (limitType === 'daily') {
      return `This is your last ${featureName.toLowerCase()} for today. Your daily limit resets at midnight.`
    }
    return `This is your last ${featureName.toLowerCase()} for this billing period.`
  }

  const showPricingButton = tier === 'free' || tier === 'expired' || tier === 'core'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-status-amber/20 flex items-center justify-center">
            <svg
              className="w-7 h-7 text-status-amber"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-3">
            Last Use Warning
          </h2>

          <p className="text-text-muted text-sm leading-relaxed">
            {getMessage()}
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={onContinue}>
            Continue
          </Button>
          {showPricingButton ? (
            <Button variant="secondary" onClick={handleViewPricing}>
              View Pricing
            </Button>
          ) : (
            <Button variant="ghost" onClick={onContinue}>
              Got It
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
