'use client'

import { useUpgradeModal } from '@/components/modals/UpgradeModal'
import { getFormattedPrice, PRICING_TIERS } from '@/lib/pricing-config'

interface UpgradeBannerProps {
  feature: string
  currentUsage?: number
  freeLimit?: number
  coreLimit?: number
  variant?: 'inline' | 'banner' | 'subtle'
  tier?: string
}

export function UpgradeBanner({
  feature,
  currentUsage,
  freeLimit,
  coreLimit,
  variant = 'banner',
  tier = 'free',
}: UpgradeBannerProps) {
  const { openUpgradeModal } = useUpgradeModal()

  // Don't show for paid users
  if (tier === 'core' || tier === 'full') return null

  const usagePercent = currentUsage !== undefined && freeLimit
    ? Math.round((currentUsage / freeLimit) * 100)
    : null

  if (variant === 'subtle') {
    return (
      <button
        onClick={openUpgradeModal}
        className="flex items-center gap-2 px-3 py-2 text-xs text-gold hover:text-gold-bright transition-colors group"
      >
        <span className="text-gold group-hover:scale-110 transition-transform">★</span>
        <span className="font-heading uppercase tracking-wider">Upgrade</span>
      </button>
    )
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-gold-dim/50 border border-gold/20 rounded-lg">
        <span className="text-gold text-lg">★</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text">
            {usagePercent !== null && usagePercent >= 50
              ? `You've used ${currentUsage}/${freeLimit} ${feature.toLowerCase()}.`
              : `Want more ${feature.toLowerCase()}?`}
            {' '}
            <span className="text-text-muted">
              {coreLimit ? `Core gives you ${coreLimit}.` : 'Upgrade for more.'}
            </span>
          </p>
        </div>
        <button
          onClick={openUpgradeModal}
          className="flex-shrink-0 px-4 py-1.5 bg-gold text-bg-primary font-heading text-xs font-bold uppercase tracking-wider rounded hover:bg-gold-bright transition-colors"
        >
          Upgrade
        </button>
      </div>
    )
  }

  // Default: banner
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-gold-dim/60 to-gold-dim/30 border border-gold/20 rounded-lg p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-gold text-lg">★</span>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gold">
              {usagePercent !== null && usagePercent >= 80
                ? 'Running Low'
                : 'Unlock More'}
            </h3>
          </div>
          <p className="text-sm text-text-muted">
            {usagePercent !== null && usagePercent >= 50
              ? `You've used ${currentUsage} of ${freeLimit} free ${feature.toLowerCase()}. `
              : ''}
            {coreLimit
              ? `Upgrade to Core for ${coreLimit}+ ${feature.toLowerCase()} — just ${getFormattedPrice('core')} for ${PRICING_TIERS.core.duration} days.`
              : `Upgrade to unlock more ${feature.toLowerCase()} and premium features.`}
          </p>
        </div>
        <button
          onClick={openUpgradeModal}
          className="flex-shrink-0 px-6 py-2.5 bg-gold text-bg-primary font-heading text-xs font-bold uppercase tracking-wider rounded hover:bg-gold-bright transition-colors"
        >
          View Plans →
        </button>
      </div>
    </div>
  )
}
