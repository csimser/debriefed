// Utility functions for consistent tier checking across the application
// This ensures all tier-related logic uses the same validation

export type Tier = 'free' | 'core' | 'full'

// Tier hierarchy for access checks
const TIER_ORDER: Record<Tier, number> = {
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
  return tier !== 'free'
}

/**
 * Check if user has access to premium templates
 * Core and Full tiers have access to all templates
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
  free: {
    cover_letters: 1,
    resumes: 1, // Base/private resume only
    federal_or_tailored: 1, // Flex slot: federal OR tailored, not both
    job_analyses: 1,
    linkedin_headlines: 999999, // Unlimited (part of score)
    linkedin_summaries: 999999, // Unlimited (part of score)
    linkedin_analyses: 999999, // Can see score
    linkedin_recommendations: 0, // PAYWALLED
    eval_uploads: 3,
    bullet_translations: 5,
  },
  core: {
    cover_letters: 10,
    resumes: 5,
    federal_or_tailored: 999999, // N/A for paid tiers
    job_analyses: 10,
    linkedin_headlines: 999999,
    linkedin_summaries: 999999,
    linkedin_analyses: 999999,
    linkedin_recommendations: 999999, // Unlimited
    eval_uploads: 10,
    bullet_translations: 50,
  },
  full: {
    cover_letters: 30, // Monthly limit
    resumes: 30, // Monthly limit
    federal_or_tailored: 999999, // N/A for paid tiers
    job_analyses: 45, // Monthly limit
    linkedin_headlines: 999999,
    linkedin_summaries: 999999,
    linkedin_analyses: 999999,
    linkedin_recommendations: 999999,
    eval_uploads: 30, // Monthly limit
    bullet_translations: 150, // Monthly limit
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
