// Utility functions for consistent tier checking across the application
// This ensures all tier-related logic uses the same validation

import { PRICING_TIERS, type TierId, type TierLimits } from '@/lib/pricing-config'

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

// Usage limits per tier — derived from pricing-config.ts (single source of truth)
// 'resumes' is an alias for 'private_resumes' for backward compat
// with ResumeEditor and ResumeSidebar components
type TierLimitsWithAlias = TierLimits & { resumes: number }

function buildTierLimits(tierId: TierId): TierLimitsWithAlias {
  const limits = PRICING_TIERS[tierId].limits
  return { ...limits, resumes: limits.private_resumes }
}

export const TIER_LIMITS: Record<Tier, TierLimitsWithAlias> = {
  expired: buildTierLimits('expired'),
  free: buildTierLimits('free'),
  core: buildTierLimits('core'),
  full: buildTierLimits('full'),
}

/**
 * Check if user has access to LinkedIn Recommendations
 * Core and Full tiers have access
 */
export function canAccessLinkedInRecommendations(tier: Tier): boolean {
  return hasAccess(tier, 'full')
}

export type LimitFeature = keyof TierLimitsWithAlias

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
