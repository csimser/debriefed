// Usage tracking service for Debriefed
// Handles tier checks, usage limits, and usage tracking

import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminSupabase } from '@supabase/supabase-js';
import {
  PRICING_TIERS,
  DAILY_RATE_LIMITS,
  ADMIN_BYPASS_EMAILS,
  TierId,
  FeatureName,
  FEATURE_DISPLAY_NAMES,
} from '@/lib/pricing-config';

// Admin client for write operations — does NOT depend on cookies/request context
// Safe to use inside after() callbacks
function getAdminClient() {
  return createAdminSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

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

  // Check for active or expired subscription (most recently purchased first)
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id, tier, expires_at, status')
    .eq('user_id', userId)
    .or('status.eq.active,status.eq.expired')
    .order('started_at', { ascending: false })
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
// Uses admin client to avoid cookie/auth issues and bypass RLS
export async function getDailyUsage(
  userId: string,
  feature: FeatureName
): Promise<number> {
  const admin = getAdminClient();
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'UTC' });

  const { data, error } = await admin
    .from('daily_usage')
    .select('count')
    .eq('user_id', userId)
    .eq('feature', feature)
    .eq('date', today)
    .maybeSingle();

  if (error) {
    console.error(`[usage] getDailyUsage query failed for ${feature}/${userId}:`, error);
    // FAIL SAFE: return high number to trigger limit, not 0 which allows unlimited
    return 9999;
  }

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
  let limit = tierConfig.limits[feature];

  // For eval_uploads, add bonus credits from eval pack purchases
  if (feature === 'eval_uploads') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('eval_uploads_bonus')
      .eq('user_id', userId)
      .single();
    limit += (profile?.eval_uploads_bonus || 0);
  }

  // Check if feature is available in this tier
  if (limit === 0) {
    // Still query actual usage so dashboard checklist can see dictionary-path activity
    const { data: usageRows } = await supabase
      .from('usage_tracking')
      .select('count')
      .eq('user_id', userId)
      .eq('feature', feature);
    const actualUsed = usageRows?.reduce((sum, row) => sum + (row.count || 0), 0) || 0;

    return {
      allowed: false,
      remaining: 0,
      limit: 0,
      used: actualUsed,
      reason: `${FEATURE_DISPLAY_NAMES[feature]} is not available in the ${tierConfig.name} tier`,
    };
  }

  // -1 means unlimited
  if (limit === -1) {
    return {
      allowed: true,
      remaining: Infinity,
      limit: -1,
      used: 0,
    };
  }

  // Get current usage
  let currentUsage = 0;

  if (tier === 'free' || tier === 'expired') {
    // Free/expired tier: count all-time usage from usage_tracking
    const { data, error } = await supabase
      .from('usage_tracking')
      .select('count')
      .eq('user_id', userId)
      .eq('feature', feature);

    if (error) {
      console.error('Failed to query usage_tracking:', error);
      // FAIL SAFE: deny access on query error to prevent unlimited usage
      return {
        allowed: false,
        remaining: 0,
        limit,
        used: limit,
        reason: 'Unable to verify usage. Please try again.',
      };
    }

    currentUsage = data?.reduce((sum, row) => sum + (row.count || 0), 0) || 0;
  } else if (subscriptionId) {
    // Paid tier with active subscription: count within period
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('started_at')
      .eq('id', subscriptionId)
      .single();

    if (subscription) {
      const { data, error } = await supabase
        .from('usage_tracking')
        .select('count')
        .eq('user_id', userId)
        .eq('feature', feature)
        .gte('period_start', subscription.started_at);

      if (error) {
        console.error('Failed to query usage_tracking for paid tier:', error);
        return {
          allowed: false,
          remaining: 0,
          limit,
          used: limit,
          reason: 'Unable to verify usage. Please try again.',
        };
      }

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

// Check daily rate limit (applies to all tiers)
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

  // Daily limits apply to free, core, and full tiers
  if (tier !== 'free' && tier !== 'core' && tier !== 'full') {
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

  // Check daily limit for all tiers
  const dailyCheck = await checkDailyLimit(userId, feature);
  if (!dailyCheck.allowed) {
    return {
      allowed: false,
      remaining: 0,
      limit: dailyCheck.limit,
      used: dailyCheck.used,
      reason: `You've used your ${dailyCheck.limit} ${FEATURE_DISPLAY_NAMES[feature].toLowerCase()} today. Come back tomorrow or upgrade for more.`,
    };
  }

  return tierCheck;
}

// Increment usage counter
// Uses admin client (service role key) so it works reliably inside after() callbacks
// without depending on cookies/request context
export async function incrementUsage(
  userId: string,
  feature: FeatureName
): Promise<boolean> {
  console.log('[usage-service] incrementUsage called with:', userId, feature);
  const admin = getAdminClient();

  // Admin doesn't need tracking — check via direct query (no cookies needed)
  const { data: profile } = await admin
    .from('profiles')
    .select('email')
    .eq('user_id', userId)
    .single();

  if (isAdmin(profile?.email)) {
    console.log('[usage] ADMIN BYPASS — skipping all tracking for:', profile?.email);
    return true;
  }

  // Get tier via admin client (most recently purchased first)
  const { data: subscription } = await admin
    .from('subscriptions')
    .select('id, tier, started_at, expires_at, status')
    .eq('user_id', userId)
    .or('status.eq.active,status.eq.expired')
    .order('started_at', { ascending: false })
    .limit(1)
    .single();

  let tier: TierId = 'free';
  let subscriptionId: string | null = null;

  if (subscription) {
    const isExpired = new Date(subscription.expires_at) < new Date();
    if (isExpired) {
      tier = 'expired';
    } else {
      tier = subscription.tier as TierId;
    }
    subscriptionId = subscription.id;
  } else {
    // Check profiles table for tier
    const { data: profileTier } = await admin
      .from('profiles')
      .select('tier')
      .eq('user_id', userId)
      .single();

    const legacyTierMap: Record<string, TierId> = {
      pro: 'core', basic: 'core', monthly: 'full', quarterly: 'full',
    };
    const pt = profileTier?.tier;
    const mapped = pt ? (legacyTierMap[pt] || pt) : 'free';
    tier = (['free', 'core', 'full'].includes(mapped) ? mapped : 'free') as TierId;
  }

  const now = new Date();
  const today = now.toLocaleDateString('en-CA', { timeZone: 'UTC' });

  // Get or create period bounds
  let periodStart: Date;
  let periodEnd: Date;

  if (tier === 'free' || tier === 'expired') {
    periodStart = new Date('2024-01-01');
    periodEnd = new Date('2099-12-31');
  } else if (subscriptionId) {
    periodStart = new Date(subscription!.started_at);
    periodEnd = new Date(subscription!.expires_at);
  } else {
    periodStart = new Date('2024-01-01');
    periodEnd = new Date('2099-12-31');
  }

  // === PERIOD TRACKING (usage_tracking table) ===
  console.log(`[usage] period tracking: calling RPC increment_usage_tracking for ${feature}/${userId}`);
  const { data: periodResult, error: usageError } = await admin.rpc('increment_usage_tracking', {
    p_user_id: userId,
    p_feature: feature,
    p_period_start: periodStart.toISOString(),
    p_period_end: periodEnd.toISOString(),
    p_amount: 1,
  });

  if (usageError) {
    console.error(`[usage] RPC increment_usage_tracking failed for ${feature}/${userId}:`, usageError);
    // Fallback: direct query
    const pStart = periodStart.toISOString();
    const pEnd = periodEnd.toISOString();

    const { data: existing } = await admin
      .from('usage_tracking')
      .select('id, count')
      .eq('user_id', userId)
      .eq('feature', feature)
      .eq('period_start', pStart)
      .maybeSingle();

    if (existing) {
      const { error: updateError } = await admin
        .from('usage_tracking')
        .update({ count: existing.count + 1, updated_at: new Date().toISOString() })
        .eq('id', existing.id);

      if (updateError) {
        console.error(`[usage] Fallback update failed for ${feature}/${userId}:`, updateError);
        return false;
      }
    } else {
      const { error: insertError } = await admin
        .from('usage_tracking')
        .insert({
          user_id: userId,
          feature,
          count: 1,
          period_start: pStart,
          period_end: pEnd,
        });

      if (insertError) {
        console.error(`[usage] Fallback insert failed for ${feature}/${userId}:`, insertError);
        return false;
      }
    }
  } else {
    console.log(`[usage] RPC increment_usage_tracking succeeded for ${feature}/${userId}, new count:`, periodResult);
  }

  // === DAILY TRACKING (daily_usage table) ===
  console.log('[usage] tier check for daily write:', tier, '| userId:', userId, '| feature:', feature);
  if (tier === 'free' || tier === 'core' || tier === 'full') {
    console.log(`[usage] daily tracking: direct write for ${feature}/${userId}, date=${today}`);
    const { data: existing } = await admin
      .from('daily_usage')
      .select('id, count')
      .eq('user_id', userId)
      .eq('feature', feature)
      .eq('date', today)
      .maybeSingle();

    if (existing) {
      const { error: updateError } = await admin
        .from('daily_usage')
        .update({ count: (existing.count || 0) + 1 })
        .eq('id', existing.id);

      if (updateError) {
        console.error(`[usage] daily_usage update failed for ${feature}/${userId}:`, updateError);
      } else {
        console.log(`[usage] daily_usage updated for ${feature}/${userId}: ${existing.count} -> ${(existing.count || 0) + 1}`);
      }
    } else {
      const { error: insertError } = await admin
        .from('daily_usage')
        .insert({ user_id: userId, feature, date: today, count: 1 });

      if (insertError) {
        console.error(`[usage] daily_usage insert failed for ${feature}/${userId}:`, insertError);
      } else {
        console.log(`[usage] daily_usage inserted for ${feature}/${userId}: count=1`);
      }
    }
  } else {
    console.log(`[usage] skipping daily tracking for tier=${tier} (only free/core/full)`);
  }

  console.log(`[usage] incremented ${feature} for ${userId} (tier: ${tier})`);
  return true;
}

// Clear all daily_usage rows for a user — gives a clean daily-limit slate
// Uses admin client — safe in after() callbacks and webhook handlers
export async function resetDailyUsage(userId: string): Promise<void> {
  const admin = getAdminClient();
  const { error } = await admin
    .from('daily_usage')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error(`[usage] resetDailyUsage failed for ${userId}:`, error);
  } else {
    console.log(`[usage] daily_usage cleared for ${userId}`);
  }
}

// Reset usage when user purchases a new subscription
// Uses admin client — called from Stripe webhook (no user cookies)
export async function resetUsageOnPurchase(
  userId: string,
  tier: TierId,
  subscriptionStartedAt: Date,
  subscriptionExpiresAt: Date
): Promise<void> {
  const admin = getAdminClient();

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
    'cover_letter_exports',
  ];

  for (const feature of features) {
    const { error } = await admin.from('usage_tracking').upsert({
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

    if (error) {
      console.error(`[usage] resetUsageOnPurchase upsert failed for ${feature}/${userId}:`, error);
    }
  }

  // Clear daily limits so the user starts fresh
  await resetDailyUsage(userId);

  // Update profile tier
  const { error: profileError } = await admin
    .from('profiles')
    .update({ tier })
    .eq('user_id', userId);

  if (profileError) {
    console.error(`[usage] resetUsageOnPurchase profile update failed for ${userId}:`, profileError);
  }
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
    'cover_letter_exports',
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
