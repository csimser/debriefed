'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PRICING_TIERS, FEATURE_DISPLAY_NAMES, FeatureName, TierId } from '@/lib/pricing-config';

interface UsageLimitModalProps {
  feature: FeatureName;
  currentTier: TierId;
  used: number;
  limit: number;
  isDailyLimit?: boolean;
  isMonthlyLimit?: boolean;
  monthlyResetDate?: string;
  onClose: () => void;
}

export function UsageLimitModal({
  feature,
  currentTier,
  used,
  limit,
  isDailyLimit = false,
  isMonthlyLimit = false,
  monthlyResetDate,
  onClose,
}: UsageLimitModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<'core' | 'full' | null>(null);

  const featureName = FEATURE_DISPLAY_NAMES[feature];
  const tierConfig = PRICING_TIERS[currentTier];

  const handleUpgrade = async (tier: 'core' | 'full') => {
    setLoading(tier);
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned');
        setLoading(null);
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      setLoading(null);
    }
  };

  const showCoreUpgrade = currentTier === 'free' || currentTier === 'expired';
  const showFullUpgrade = currentTier === 'free' || currentTier === 'expired' || currentTier === 'core';

  // Contextual messaging based on tier and limit type
  const getTitle = () => {
    if (isDailyLimit) return 'Daily Limit Reached';
    if (isMonthlyLimit) return 'Monthly Limit Reached';
    return 'Usage Limit Reached';
  };

  const getMessage = () => {
    if (isDailyLimit) {
      return (
        <>
          You&apos;ve used all {limit} {featureName} for today.
          <br />
          <span className="text-sm text-gold">Resets at midnight.</span>
        </>
      );
    }
    if (isMonthlyLimit && monthlyResetDate) {
      return (
        <>
          You&apos;ve used all {limit} {featureName} for this month.
          <br />
          <span className="text-sm text-gold">Resets on {monthlyResetDate}.</span>
        </>
      );
    }
    if (currentTier === 'expired') {
      return (
        <>
          Your subscription has expired.
          <br />
          <span className="text-sm">Renew to regain access to {featureName.toLowerCase()}.</span>
        </>
      );
    }
    if (currentTier === 'free') {
      return (
        <>
          You&apos;ve used your free {featureName}.
          <br />
          <span className="text-sm">Upgrade to Core for more {featureName.toLowerCase()}.</span>
        </>
      );
    }
    if (currentTier === 'core') {
      return (
        <>
          You&apos;ve used all {limit} {featureName} for this period.
          <br />
          <span className="text-sm">Upgrade to Full for higher limits.</span>
        </>
      );
    }
    return `You've used all ${limit} ${featureName} for this period.`;
  };

  // Format the limit display - show "Unlimited" for very high values
  const formatLimit = (limitValue: number) => {
    return limitValue >= 999999 ? 'Unlimited' : limitValue.toString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-status-amber/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-status-amber"
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

          <h2 className="font-heading text-xl font-bold uppercase tracking-wider mb-2">
            {getTitle()}
          </h2>

          <p className="text-text-muted">
            {getMessage()}
          </p>

          <div className="mt-4 p-3 bg-bg-tertiary rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted">Current Tier:</span>
              <span className="font-semibold text-gold">{tierConfig.name}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-text-muted">Usage:</span>
              <span>
                {used} / {formatLimit(limit)}
              </span>
            </div>
          </div>
        </div>

        {!isDailyLimit && !isMonthlyLimit && (showCoreUpgrade || showFullUpgrade) && (
          <div className="space-y-3 mb-6">
            <p className="text-sm text-text-muted text-center mb-3">
              {currentTier === 'free' || currentTier === 'expired'
                ? `Upgrade to Core for more ${featureName.toLowerCase()}:`
                : `Upgrade to Full for higher limits:`}
            </p>

            {showCoreUpgrade && (
              <div className="p-4 border border-gold rounded-lg bg-gold/5">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-heading font-bold text-gold">CORE</span>
                    <span className="text-xs text-text-muted ml-2">Best Value</span>
                  </div>
                  <span className="text-lg font-bold">$35</span>
                </div>
                <p className="text-xs text-text-muted mb-3">
                  30 days access with {formatLimit(PRICING_TIERS.core.limits[feature])} {featureName}
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  loading={loading === 'core'}
                  onClick={() => handleUpgrade('core')}
                >
                  Upgrade to Core - $35
                </Button>
              </div>
            )}

            {showFullUpgrade && currentTier === 'core' && (
              <div className="p-4 border border-gold/50 rounded-lg bg-gold/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-heading font-bold text-gold">FULL</span>
                  <span className="text-lg font-bold">$75</span>
                </div>
                <p className="text-xs text-text-muted mb-3">
                  90 days access with {formatLimit(PRICING_TIERS.full.limits[feature])}/mo {featureName}
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  loading={loading === 'full'}
                  onClick={() => handleUpgrade('full')}
                >
                  Upgrade to Full - $75
                </Button>
              </div>
            )}
          </div>
        )}

        {(isDailyLimit || isMonthlyLimit) && (currentTier === 'core' || currentTier === 'full') && (
          <p className="text-sm text-text-muted text-center mb-6">
            The {currentTier === 'core' ? 'Core' : 'Full'} tier includes {isDailyLimit ? 'daily' : 'monthly'} rate limits to ensure fair usage for all users.
            {isDailyLimit
              ? ' Your daily limits will reset at midnight.'
              : monthlyResetDate
                ? ` Your monthly limits will reset on ${monthlyResetDate}.`
                : ' Your monthly limits will reset at the start of the next billing period.'}
          </p>
        )}

        <div className="flex gap-3 justify-center">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button variant="secondary" onClick={() => router.push('/pricing')}>
            View All Plans
          </Button>
        </div>
      </Card>
    </div>
  );
}
