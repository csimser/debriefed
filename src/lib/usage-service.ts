// Usage tracking service for Debriefed
// Handles tier checks, usage limits, and usage tracking

import { createClient } from '@/lib/supabase/server';
import {
  PRICING_TIERS,
  DAILY_RATE_LIMITS,
  ADMIN_BYPASS_EMAILS,
  TierId,
  FeatureName,
  FEATURE_DISPLAY_NAMES,
} from '@/lib/pricing-config';

export interface UsageCheckResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  used: number;
  reason?: string;
}

export interface DailyLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  used: number;
}

export interface UserTierInfo {
  tier: TierId;
  subscriptionId: string | null;
  expiresAt: Date | null;
  isActive: boolean;
}

// Check if an email is in the admin bypass list
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_BYPASS_EMAILS.includes(email.toLowerCase());
}

// Get user's current tier based on active subscription
export async function getUserTier(userId: string): Promise<UserTierInfo> {
  const supabase = await createClient();

  // Check for active or expired subscription (most recent first)
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id, tier, expires_at, status')
    .eq('user_id', userId)
    .or('status.eq.active,status.eq.expired')
    .order('expires_at', { ascending: false })
    .limit(1)
    .single();

  if (subscription) {
    const isExpired = new Date(subscription.expires_at) < new Date();
    if (isExpired) {
      return {
        tier: 'expired',
        subscriptionId: subscription.id,
        expiresAt: new Date(subscription.expires_at),
        isActive: false,
      };
    }
    // Active subscription
    return {
      tier: subscription.tier as TierId,
      subscriptionId: subscription.id,
      expiresAt: new Date(subscription.expires_at),
      isActive: true,
    };
  }

  // Check profiles table for tier (legacy or direct grant)
  const { data: profile } = await supabase
    .from('profiles')
    .select('tier')
    .eq('user_id', userId)
    .single();

  // Map legacy tier names to new tiers
  const legacyTierMap: Record<string, TierId> = {
    pro: 'core',
    basic: 'core',
    monthly: 'full',
    quarterly: 'full',
  };

  const profileTier = profile?.tier;
  const mappedTier = profileTier ? (legacyTierMap[profileTier] || profileTier) : 'free';

  return {
    tier: (mappedTier === 'free' || mappedTier === 'core' || mappedTier === 'full'
      ? mappedTier
      : 'free') as TierId,
    subscriptionId: null,
    expiresAt: null,
    isActive: true,
  };
}

// Get user's email for admin check
export async function getUserEmail(userId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('email')
    .eq('user_id', userId)
    .single();
  return profile?.email || null;
}

// Get current usage count for a feature
export async function getUsage(
  userId: string,
  feature: FeatureName
): Promise<number> {
  const supabase = await createClient();
  const { tier } = await getUserTier(userId);

  // For free tier, we count all-time usage (no period)
  // For paid tiers, we count usage within the current subscription period
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('started_at, expires_at')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('started_at', { ascending: false })
    .limit(1)
    .single();

  let query = supabase
    .from('usage_tracking')
    .select('count')
    .eq('user_id', userId)
    .eq('feature', feature);

  if (subscription && tier !== 'free' && tier !== 'expired') {
    // For paid tiers, only count within subscription period
    query = query
      .gte('period_start', subscription.started_at)
      .lte('period_end', subscription.expires_at);
  }

  const { data } = await query.single();
  return data?.count || 0;
}

// Get daily usage count for a feature
export async function getDailyUsage(
  userId: string,
  feature: FeatureName
): Promise<number> {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  const { data } = await supabase
    .from('daily_usage')
    .select('count')
    .eq('user_id', userId)
    .eq('feature', feature)
    .eq('date', today)
    .single();

  return data?.count || 0;
}

// Check if user can use a feature (tier limits)
export async function checkLimit(
  userId: string,
  feature: FeatureName
): Promise<UsageCheckResult> {
  const supabase = await createClient();

  // Check admin bypass
  const email = await getUserEmail(userId);
  if (isAdmin(email)) {
    return {
      allowed: true,
      remaining: 999999,
      limit: 999999,
      used: 0,
      reason: 'Admin bypass',
    };
  }

  const { tier, subscriptionId } = await getUserTier(userId);
  const tierConfig = PRICING_TIERS[tier];
  const limit = tierConfig.limits[feature];

  // Check if feature is available in this tier
  if (limit === 0) {
    return {
      allowed: false,
      remaining: 0,
      limit: 0,
      used: 0,
      reason: `${FEATURE_DISPLAY_NAMES[feature]} is not available in the ${tierConfig.name} tier`,
    };
  }

  // Get current usage
  let currentUsage = 0;

  if (tier === 'free' || tier === 'expired') {
    // Free/expired tier: count all-time usage from usage_tracking
    const { data } = await supabase
      .from('usage_tracking')
      .select('count')
      .eq('user_id', userId)
      .eq('feature', feature);

    currentUsage = data?.reduce((sum, row) => sum + (row.count || 0), 0) || 0;
  } else if (subscriptionId) {
    // Paid tier with active subscription: count within period
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('started_at')
      .eq('id', subscriptionId)
      .single();

    if (subscription) {
      const { data } = await supabase
        .from('usage_tracking')
        .select('count')
        .eq('user_id', userId)
        .eq('feature', feature)
        .gte('period_start', subscription.started_at);

      currentUsage = data?.reduce((sum, row) => sum + (row.count || 0), 0) || 0;
    }
  }

  const remaining = Math.max(0, limit - currentUsage);

  return {
    allowed: remaining > 0,
    remaining,
    limit,
    used: currentUsage,
    reason: remaining <= 0
      ? `You've used all ${limit} ${FEATURE_DISPLAY_NAMES[feature]} for this ${tier === 'free' ? 'account' : 'period'}`
      : undefined,
  };
}

// Check daily rate limit (applies to Core and Full tiers)
export async function checkDailyLimit(
  userId: string,
  feature: FeatureName
): Promise<DailyLimitResult> {
  const email = await getUserEmail(userId);
  if (isAdmin(email)) {
    return {
      allowed: true,
      remaining: 999999,
      limit: 999999,
      used: 0,
    };
  }

  const { tier } = await getUserTier(userId);

  // Daily limits only apply to Core and Full tiers
  if (tier !== 'core' && tier !== 'full') {
    return {
      allowed: true,
      remaining: 999999,
      limit: 999999,
      used: 0,
    };
  }

  const dailyLimit = DAILY_RATE_LIMITS[tier][feature];
  const dailyUsage = await getDailyUsage(userId, feature);
  const remaining = Math.max(0, dailyLimit - dailyUsage);

  return {
    allowed: remaining > 0,
    remaining,
    limit: dailyLimit,
    used: dailyUsage,
  };
}

// Combined check for both tier and daily limits
export async function canUseFeature(
  userId: string,
  feature: FeatureName
): Promise<UsageCheckResult> {
  // Check tier limit first
  const tierCheck = await checkLimit(userId, feature);
  if (!tierCheck.allowed) {
    return tierCheck;
  }

  // Check daily limit for Core and Full tiers
  const dailyCheck = await checkDailyLimit(userId, feature);
  if (!dailyCheck.allowed) {
    return {
      allowed: false,
      remaining: 0,
      limit: dailyCheck.limit,
      used: dailyCheck.used,
      reason: `Daily limit reached for ${FEATURE_DISPLAY_NAMES[feature]}. Resets at midnight.`,
    };
  }

  return tierCheck;
}

// Increment usage counter
export async function incrementUsage(
  userId: string,
  feature: FeatureName
): Promise<boolean> {
  const supabase = await createClient();

  // Admin doesn't need tracking
  const email = await getUserEmail(userId);
  if (isAdmin(email)) {
    return true;
  }

  const { tier, subscriptionId } = await getUserTier(userId);
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  // Get or create period bounds
  let periodStart: Date;
  let periodEnd: Date;

  if (tier === 'free' || tier === 'expired') {
    // Free/expired tier: use a far past and future date for "lifetime"
    periodStart = new Date('2024-01-01');
    periodEnd = new Date('2099-12-31');
  } else if (subscriptionId) {
    // Get subscription period
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('started_at, expires_at')
      .eq('id', subscriptionId)
      .single();

    if (subscription) {
      periodStart = new Date(subscription.started_at);
      periodEnd = new Date(subscription.expires_at);
    } else {
      periodStart = now;
      periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
  } else {
    // Fallback for legacy tier without subscription
    periodStart = new Date('2024-01-01');
    periodEnd = new Date('2099-12-31');
  }

  // Atomic increment of usage_tracking via RPC (INSERT ... ON CONFLICT)
  const { error: usageError } = await supabase.rpc('increment_usage_tracking', {
    p_user_id: userId,
    p_feature: feature,
    p_period_start: periodStart.toISOString(),
    p_period_end: periodEnd.toISOString(),
    p_amount: 1,
  });

  if (usageError) {
    console.error('Failed to increment usage:', usageError);
    return false;
  }

  // Also track daily usage for Core and Full tiers (atomic via RPC)
  if (tier === 'core' || tier === 'full') {
    const { error: dailyError } = await supabase.rpc('increment_daily_usage', {
      p_user_id: userId,
      p_feature: feature,
      p_date: today,
      p_amount: 1,
    });

    if (dailyError) {
      console.error('Failed to increment daily usage:', dailyError);
    }
  }

  return true;
}

// Reset usage when user purchases a new subscription
export async function resetUsageOnPurchase(
  userId: string,
  tier: TierId,
  subscriptionStartedAt: Date,
  subscriptionExpiresAt: Date
): Promise<void> {
  const supabase = await createClient();

  // We don't delete old usage records, we just create new period records
  // The old records will be ignored due to period filtering

  // Initialize all features with 0 count for the new period
  const features: FeatureName[] = [
    'private_resumes',
    'federal_resumes',
    'resume_imports',
    'eval_uploads',
    'bullet_translations',
    'job_match_analysis',
    'cover_letters',
    'ai_summaries',
    'linkedin_headline',
    'linkedin_summary',
    'linkedin_profile_analysis',
    'linkedin_recommendations',
    'downloads',
  ];

  for (const feature of features) {
    await supabase.from('usage_tracking').upsert({
      user_id: userId,
      feature,
      count: 0,
      period_start: subscriptionStartedAt.toISOString(),
      period_end: subscriptionExpiresAt.toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,feature,period_start',
    });
  }

  // Update profile tier
  await supabase
    .from('profiles')
    .update({ tier })
    .eq('user_id', userId);
}

// Get all usage for a user (for displaying in UI)
export async function getAllUsage(userId: string): Promise<Record<FeatureName, UsageCheckResult>> {
  const features: FeatureName[] = [
    'private_resumes',
    'federal_resumes',
    'resume_imports',
    'eval_uploads',
    'bullet_translations',
    'job_match_analysis',
    'cover_letters',
    'ai_summaries',
    'linkedin_headline',
    'linkedin_summary',
    'linkedin_profile_analysis',
    'linkedin_recommendations',
    'downloads',
  ];

  const usage: Partial<Record<FeatureName, UsageCheckResult>> = {};

  for (const feature of features) {
    usage[feature] = await checkLimit(userId, feature);
  }

  return usage as Record<FeatureName, UsageCheckResult>;
}

// Get subscription info for display
export async function getSubscriptionInfo(userId: string): Promise<{
  tier: TierId;
  tierName: string;
  expiresAt: Date | null;
  daysRemaining: number | null;
  isActive: boolean;
}> {
  const tierInfo = await getUserTier(userId);
  const tierConfig = PRICING_TIERS[tierInfo.tier];

  let daysRemaining: number | null = null;
  if (tierInfo.expiresAt) {
    const now = new Date();
    const diffTime = tierInfo.expiresAt.getTime() - now.getTime();
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return {
    tier: tierInfo.tier,
    tierName: tierConfig.name,
    expiresAt: tierInfo.expiresAt,
    daysRemaining,
    isActive: tierInfo.isActive,
  };
}
