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
  return hasAccess(tier, 'full')
}

// Usage limits per tier (matches pricing-config.ts)
// Note: 'resumes' is kept as an alias for 'private_resumes' for backward compat
// with ResumeEditor and ResumeSidebar components
export const TIER_LIMITS = {
  expired: {
    private_resumes: 999,
    federal_resumes: 999,
    resumes: 999,           // alias for private_resumes (backward compat)
    cover_letters: 0,
    resume_imports: 0,
    job_match_analysis: 0,
    ai_summaries: 0,
    linkedin_headline: 0,
    linkedin_summary: 0,
    linkedin_profile_analysis: 0,
    linkedin_recommendations: 0,
    eval_uploads: 0,
    bullet_translations: 0,
    downloads: 999,
  },
  free: {
    private_resumes: 5,
    federal_resumes: 5,
    resumes: 5,             // alias for private_resumes (backward compat)
    cover_letters: 999,
    resume_imports: 3,
    job_match_analysis: 999,
    ai_summaries: 0,
    linkedin_headline: 0,
    linkedin_summary: 0,
    linkedin_profile_analysis: 0,
    linkedin_recommendations: 0,
    eval_uploads: 1,
    bullet_translations: 999,
    downloads: 999,
  },
  core: {
    private_resumes: 10,
    federal_resumes: 5,
    resumes: 10,            // alias for private_resumes (backward compat)
    cover_letters: 5,
    resume_imports: 999,
    job_match_analysis: 999,
    ai_summaries: 999,
    linkedin_headline: 999,
    linkedin_summary: 999,
    linkedin_profile_analysis: 0,
    linkedin_recommendations: 0,
    eval_uploads: 5,
    bullet_translations: 999,
    downloads: 999,
  },
  full: {
    private_resumes: 999,
    federal_resumes: 999,
    resumes: 999,           // alias for private_resumes (backward compat)
    cover_letters: 999,
    resume_imports: 999,
    job_match_analysis: 999,
    ai_summaries: 999,
    linkedin_headline: 999,
    linkedin_summary: 999,
    linkedin_profile_analysis: 999,
    linkedin_recommendations: 999,
    eval_uploads: 20,
    bullet_translations: 999,
    downloads: 999,
  },
} as const

/**
 * Check if user has access to LinkedIn Recommendations
 * Core and Full tiers have access
 */
export function canAccessLinkedInRecommendations(tier: Tier): boolean {
  return hasAccess(tier, 'full')
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
