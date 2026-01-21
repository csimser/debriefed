'use client';

import { useState, useEffect, ReactNode } from 'react';
import { UsageLimitModal } from './UsageLimitModal';
import { FeatureName, TierId, PRICING_TIERS } from '@/lib/pricing-config';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface UsageCheckResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  used: number;
  reason?: string;
}

interface SubscriptionData {
  subscription: {
    tier: TierId;
  };
  usage: Record<FeatureName, UsageCheckResult>;
}

interface FeatureGateProps {
  feature: FeatureName;
  children: ReactNode;
  fallback?: ReactNode;
  onBlock?: (result: UsageCheckResult) => void;
  showModal?: boolean;
}

export function FeatureGate({
  feature,
  children,
  fallback,
  onBlock,
  showModal = true,
}: FeatureGateProps) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [usageData, setUsageData] = useState<{
    tier: TierId;
    used: number;
    limit: number;
    isDailyLimit: boolean;
  } | null>(null);

  useEffect(() => {
    checkAccess();
  }, [feature]);

  const checkAccess = async () => {
    try {
      const response = await fetch('/api/user/subscription');
      if (!response.ok) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      const data: SubscriptionData = await response.json();
      const featureUsage = data.usage[feature];

      if (featureUsage.allowed) {
        setAllowed(true);
      } else {
        setAllowed(false);
        setUsageData({
          tier: data.subscription.tier,
          used: featureUsage.used,
          limit: featureUsage.limit,
          isDailyLimit: featureUsage.reason?.includes('Daily limit') || false,
        });

        if (onBlock) {
          onBlock(featureUsage);
        }

        if (showModal) {
          setShowLimitModal(true);
        }
      }
    } catch (error) {
      console.error('Error checking feature access:', error);
      setAllowed(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (!allowed) {
    return (
      <>
        {fallback || (
          <div className="p-4 text-center text-text-muted">
            <p>This feature is not available on your current plan.</p>
          </div>
        )}
        {showLimitModal && usageData && (
          <UsageLimitModal
            feature={feature}
            currentTier={usageData.tier}
            used={usageData.used}
            limit={usageData.limit}
            isDailyLimit={usageData.isDailyLimit}
            onClose={() => setShowLimitModal(false)}
          />
        )}
      </>
    );
  }

  return <>{children}</>;
}

// Hook version for more control
export function useFeatureAccess(feature: FeatureName) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [usage, setUsage] = useState<UsageCheckResult | null>(null);
  const [tier, setTier] = useState<TierId>('free');

  useEffect(() => {
    checkAccess();
  }, [feature]);

  const checkAccess = async () => {
    try {
      const response = await fetch('/api/user/subscription');
      if (!response.ok) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      const data: SubscriptionData = await response.json();
      const featureUsage = data.usage[feature];

      setTier(data.subscription.tier);
      setUsage(featureUsage);
      setAllowed(featureUsage.allowed);
    } catch (error) {
      console.error('Error checking feature access:', error);
      setAllowed(false);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    setLoading(true);
    checkAccess();
  };

  return {
    loading,
    allowed,
    usage,
    tier,
    refresh,
  };
}

// Higher-order function to check access before performing an action
export async function checkFeatureAndExecute<T>(
  feature: FeatureName,
  action: () => Promise<T>
): Promise<{ success: boolean; data?: T; error?: string; usage?: UsageCheckResult }> {
  try {
    const response = await fetch('/api/user/subscription');
    if (!response.ok) {
      return { success: false, error: 'Failed to check subscription' };
    }

    const data: SubscriptionData = await response.json();
    const featureUsage = data.usage[feature];

    if (!featureUsage.allowed) {
      return { success: false, error: featureUsage.reason, usage: featureUsage };
    }

    const result = await action();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error executing gated action:', error);
    return { success: false, error: 'An error occurred' };
  }
}
