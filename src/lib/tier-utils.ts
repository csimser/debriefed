// Utility functions for consistent tier checking across the application
// This ensures all tier-related logic uses the same validation

export type Tier = 'free' | 'core' | 'full' | 'expired'

// Tier hierarchy for access checks
const TIER_ORDER: Record<Tier, number> = {
  expired: -1,
  free: 0,
  core: 1,
  full: 2,
}

// Legacy tier name mappings
const TIER_MAPPINGS: Record<string, Tier> = {
  'free': 'free',
  'basic': 'core',    // Legacy name
  'core': 'core',
  'pro': 'full',      // Legacy name
  'full': 'full',
  'monthly': 'core',  // Subscription type
  'quarterly': 'full', // Subscription type
  'expired': 'expired',
}

/**
 * Normalize a tier value from profile to a standard Tier type
 * Handles legacy tier names (pro, basic) and null values
 */
export function getUserTier(profile: {
  tier?: string | null
  subscription_tier?: string | null
} | null | undefined): Tier {
  // Check both tier columns, prefer tier over subscription_tier
  const rawTier = profile?.tier || profile?.subscription_tier || 'free'

  // Normalize the tier using mappings
  const normalizedTier = TIER_MAPPINGS[rawTier.toLowerCase()]

  return normalizedTier || 'free'
}

/**
 * Check if a user's tier has access to a required tier level
 * e.g., hasAccess('core', 'core') = true
 *       hasAccess('free', 'core') = false
 *       hasAccess('full', 'core') = true
 */
export function hasAccess(userTier: Tier, requiredTier: Tier): boolean {
  return TIER_ORDER[userTier] >= TIER_ORDER[requiredTier]
}

/**
 * Check if user is NOT on free tier (has any paid tier)
 * This is the most common check - used for template/feature gating
 */
export function isPaidTier(tier: Tier): boolean {
  return tier !== 'free' && tier !== 'expired'
}

/**
 * Check if user has an expired subscription
 */
export function isExpiredTier(tier: Tier): boolean {
  return tier === 'expired'
}

/**
 * Check if user has access to premium templates
 * Core and Full tiers have access
 */
export function canAccessPremiumTemplates(tier: Tier): boolean {
  return hasAccess(tier, 'core')
}

/**
 * Check if user has access to LinkedIn Profile Analyzer
 * Core and Full tiers have access
 */
export function canAccessLinkedInAnalyzer(tier: Tier): boolean {
  return hasAccess(tier, 'core')
}

// Usage limits per tier (matches pricing-config.ts)
export const TIER_LIMITS = {
  expired: {
    cover_letters: 0,
    resumes: 0,
    resume_imports: 0,
    job_analyses: 0,
    ai_summaries: 0,
    linkedin_headlines: 0,
    linkedin_summaries: 0,
    linkedin_analyses: 0,
    linkedin_recommendations: 0,
    eval_uploads: 0,
    bullet_translations: 0,
    downloads: 999,
  },
  free: {
    cover_letters: 1,
    resumes: 1,
    resume_imports: 1,
    job_analyses: 1,
    ai_summaries: 1,
    linkedin_headlines: 1,
    linkedin_summaries: 1,
    linkedin_analyses: 1,
    linkedin_recommendations: 0,
    eval_uploads: 2,
    bullet_translations: 10,
    downloads: 999,
  },
  core: {
    cover_letters: 10,
    resumes: 5,
    resume_imports: 5,
    job_analyses: 15,
    ai_summaries: 10,
    linkedin_headlines: 15,
    linkedin_summaries: 15,
    linkedin_analyses: 10,
    linkedin_recommendations: 999999,
    eval_uploads: 10,
    bullet_translations: 50,
    downloads: 999,
  },
  full: {
    cover_letters: 30,
    resumes: 30,
    resume_imports: 999999,
    job_analyses: 45,
    ai_summaries: 999999,
    linkedin_headlines: 999999,
    linkedin_summaries: 999999,
    linkedin_analyses: 999999,
    linkedin_recommendations: 999999,
    eval_uploads: 30,
    bullet_translations: 150,
    downloads: 999,
  },
} as const

/**
 * Check if user has access to LinkedIn Recommendations
 * Core and Full tiers have access
 */
export function canAccessLinkedInRecommendations(tier: Tier): boolean {
  return hasAccess(tier, 'core')
}

export type LimitFeature = keyof typeof TIER_LIMITS.free

/**
 * Get the usage limit for a feature based on tier
 */
export function getTierLimit(tier: Tier, feature: LimitFeature): number {
  return TIER_LIMITS[tier][feature]
}

/**
 * Check if user has remaining usage for a feature
 */
export function hasRemainingUsage(
  tier: Tier,
  feature: LimitFeature,
  currentUsage: number
): boolean {
  const limit = getTierLimit(tier, feature)
  return currentUsage < limit
}

/**
 * Get remaining usage count for a feature
 */
export function getRemainingUsage(
  tier: Tier,
  feature: LimitFeature,
  currentUsage: number
): number {
  const limit = getTierLimit(tier, feature)
  return Math.max(0, limit - currentUsage)
}

/**
 * Get the tier required to unlock a feature
 * Returns null if feature is available on free tier
 */
export function getRequiredTier(feature: LimitFeature): Tier | null {
  if (TIER_LIMITS.free[feature] > 0) return null
  if (TIER_LIMITS.core[feature] > 0) return 'core'
  return 'full'
}
