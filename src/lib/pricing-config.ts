// Pricing tiers configuration for Debriefed
// Defines all subscription tiers, their limits, and features

// TEMP: Payments disabled during beta - set to true to enable Stripe payments
export const PAYMENTS_ENABLED = false;

export type TierId = 'free' | 'core' | 'full';

export type FeatureName =
  | 'private_resumes'
  | 'federal_resumes'
  | 'federal_or_tailored' // Flex slot for free tier: federal OR tailored resume
  | 'eval_uploads'
  | 'bullet_translations'
  | 'job_match_analysis'
  | 'cover_letters'
  | 'linkedin_headline'
  | 'linkedin_summary'
  | 'linkedin_profile_analysis'
  | 'linkedin_recommendations' // Paywalled for free tier
  | 'elevator_pitch';

export type TemplateName = 'clean' | 'ats' | 'classic' | 'modern' | 'minimal' | 'federal';

export interface TierLimits {
  private_resumes: number;
  federal_resumes: number;
  federal_or_tailored: number; // Free tier flex slot
  eval_uploads: number;
  bullet_translations: number;
  job_match_analysis: number;
  cover_letters: number;
  linkedin_headline: number;
  linkedin_summary: number;
  linkedin_profile_analysis: number;
  linkedin_recommendations: number;
  elevator_pitch: number;
}

export interface TierFeatures {
  smart_apply_skills: boolean;
  linkedin_profile_analysis: boolean;
  linkedin_recommendations: boolean;
  elevator_pitch: boolean;
}

export interface PricingTier {
  id: TierId;
  name: string;
  price: number;
  duration: number | null; // Days, null for forever (free tier)
  stripePriceId?: string;
  limits: TierLimits;
  templates: TemplateName[];
  features: TierFeatures;
}

export const PRICING_TIERS: Record<TierId, PricingTier> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    duration: null,
    limits: {
      private_resumes: 1, // Base/private resume only
      federal_resumes: 0, // Use federal_or_tailored flex slot instead
      federal_or_tailored: 1, // User chooses: federal OR tailored, not both
      eval_uploads: 3,
      bullet_translations: 5,
      job_match_analysis: 1,
      cover_letters: 1,
      linkedin_headline: 999999, // Unlimited - part of linkedin_score
      linkedin_summary: 999999, // Unlimited - part of linkedin_score
      linkedin_profile_analysis: 999999, // Unlimited score
      linkedin_recommendations: 0, // PAYWALLED
      elevator_pitch: 0, // PAYWALLED
    },
    templates: ['clean', 'ats'],
    features: {
      smart_apply_skills: true,
      linkedin_profile_analysis: true, // Can see score
      linkedin_recommendations: false, // Cannot see recommendations
      elevator_pitch: false,
    },
  },
  core: {
    id: 'core',
    name: 'Core',
    price: 35,
    duration: 30,
    stripePriceId: process.env.STRIPE_CORE_PRICE_ID || 'price_1SrKywC8kNeYMuJLssBl9sDb',
    limits: {
      private_resumes: 5, // Includes private resumes AND tailored resumes from Job Match
      federal_resumes: 5,
      federal_or_tailored: 999999, // Not applicable to paid tiers
      eval_uploads: 10,
      bullet_translations: 50,
      job_match_analysis: 10, // Analysis only; tailored resume decrements private_resumes
      cover_letters: 10,
      linkedin_headline: 999999, // Unlimited
      linkedin_summary: 999999, // Unlimited
      linkedin_profile_analysis: 999999, // Unlimited
      linkedin_recommendations: 999999, // Unlimited
      elevator_pitch: 3,
    },
    templates: ['clean', 'ats', 'classic', 'modern', 'minimal', 'federal'],
    features: {
      smart_apply_skills: true,
      linkedin_profile_analysis: true,
      linkedin_recommendations: true,
      elevator_pitch: true,
    },
  },
  full: {
    id: 'full',
    name: 'Full',
    price: 75,
    duration: 90,
    stripePriceId: process.env.STRIPE_FULL_PRICE_ID || 'price_1SrKzfC8kNeYMuJLpH0KdkhJ',
    limits: {
      private_resumes: 30, // Monthly limit - includes private AND tailored resumes from Job Match
      federal_resumes: 30, // Monthly limit
      federal_or_tailored: 999999, // Not applicable to paid tiers
      eval_uploads: 30, // Monthly limit
      bullet_translations: 150, // Monthly limit
      job_match_analysis: 45, // Monthly limit - analysis only; tailored resume decrements private_resumes
      cover_letters: 30, // Monthly limit
      linkedin_headline: 999999, // Unlimited
      linkedin_summary: 999999, // Unlimited
      linkedin_profile_analysis: 999999, // Unlimited
      linkedin_recommendations: 999999, // Unlimited
      elevator_pitch: 15, // Monthly limit
    },
    templates: ['clean', 'ats', 'classic', 'modern', 'minimal', 'federal'],
    features: {
      smart_apply_skills: true,
      linkedin_profile_analysis: true,
      linkedin_recommendations: true,
      elevator_pitch: true,
    },
  },
};

// Daily rate limits (only applies to Full tier to prevent abuse)
export const DAILY_RATE_LIMITS: TierLimits = {
  private_resumes: 10,
  federal_resumes: 10,
  federal_or_tailored: 999999, // N/A
  eval_uploads: 10,
  bullet_translations: 50,
  job_match_analysis: 15,
  cover_letters: 5,
  linkedin_headline: 999999,
  linkedin_summary: 999999,
  linkedin_profile_analysis: 999999,
  linkedin_recommendations: 999999,
  elevator_pitch: 5,
};

// Admin emails that bypass all limits
export const ADMIN_BYPASS_EMAILS = [
  'chris.simser@gmail.com',
  'carlajo22@gmail.com',
  'admin@debriefed.io',
];

// Feature display names for UI
export const FEATURE_DISPLAY_NAMES: Record<FeatureName, string> = {
  private_resumes: 'Resumes (private + tailored)', // Includes both private and tailored from Job Match
  federal_resumes: 'Federal Resumes',
  federal_or_tailored: 'Federal/Tailored Resumes',
  eval_uploads: 'Eval Uploads',
  bullet_translations: 'Bullet Translations',
  job_match_analysis: 'Job Match Analyses',
  cover_letters: 'Cover Letters',
  linkedin_headline: 'LinkedIn Headlines',
  linkedin_summary: 'LinkedIn Summaries',
  linkedin_profile_analysis: 'LinkedIn Profile Score',
  linkedin_recommendations: 'LinkedIn Recommendations',
  elevator_pitch: 'Elevator Pitches',
};

// Helper function to get tier by stripe price ID
export function getTierByPriceId(priceId: string): PricingTier | undefined {
  return Object.values(PRICING_TIERS).find((tier) => tier.stripePriceId === priceId);
}

// Helper function to check if a tier has access to a template
export function tierHasTemplate(tierId: TierId, template: TemplateName): boolean {
  return PRICING_TIERS[tierId].templates.includes(template);
}

// Helper function to check if a tier has a feature enabled
export function tierHasFeature(
  tierId: TierId,
  feature: keyof TierFeatures
): boolean {
  return PRICING_TIERS[tierId].features[feature];
}

// Helper function to get limit for a feature
export function getTierLimit(tierId: TierId, feature: FeatureName): number {
  return PRICING_TIERS[tierId].limits[feature];
}

// Helper function to get daily limit for a feature
export function getDailyLimit(feature: FeatureName): number {
  return DAILY_RATE_LIMITS[feature];
}
