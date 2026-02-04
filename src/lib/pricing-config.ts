// Pricing tiers configuration for Debriefed
// Defines all subscription tiers, their limits, and features

// TEMP: Payments disabled during beta - set to true to enable Stripe payments
export const PAYMENTS_ENABLED = false;

export type TierId = 'free' | 'core' | 'full' | 'expired';

export type FeatureName =
  | 'private_resumes'
  | 'federal_resumes'
  | 'resume_imports'
  | 'eval_uploads'
  | 'bullet_translations'
  | 'job_match_analysis'
  | 'cover_letters'
  | 'ai_summaries'
  | 'linkedin_headline'
  | 'linkedin_summary'
  | 'linkedin_profile_analysis'
  | 'linkedin_recommendations'
  | 'downloads';

export type TemplateName = 'clean' | 'ats' | 'classic' | 'modern' | 'minimal' | 'federal';

export interface TierLimits {
  private_resumes: number;
  federal_resumes: number;
  resume_imports: number;
  eval_uploads: number;
  bullet_translations: number;
  job_match_analysis: number;
  cover_letters: number;
  ai_summaries: number;
  linkedin_headline: number;
  linkedin_summary: number;
  linkedin_profile_analysis: number;
  linkedin_recommendations: number;
  downloads: number;
}

export interface TierFeatures {
  smart_apply_skills: boolean;
  linkedin_profile_analysis: boolean;
  linkedin_recommendations: boolean;
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
      private_resumes: 1,
      federal_resumes: 0,
      resume_imports: 1,
      eval_uploads: 2,
      bullet_translations: 10,
      job_match_analysis: 1,
      cover_letters: 1,
      ai_summaries: 1,
      linkedin_headline: 1,
      linkedin_summary: 1,
      linkedin_profile_analysis: 1,
      linkedin_recommendations: 0,
      downloads: 999,
    },
    templates: ['clean', 'ats'],
    features: {
      smart_apply_skills: true,
      linkedin_profile_analysis: true,
      linkedin_recommendations: false,
    },
  },
  core: {
    id: 'core',
    name: 'Core',
    price: 35,
    duration: 30,
    stripePriceId: process.env.STRIPE_CORE_PRICE_ID || 'price_1SrKywC8kNeYMuJLssBl9sDb',
    limits: {
      private_resumes: 5,
      federal_resumes: 5,
      resume_imports: 5,
      eval_uploads: 10,
      bullet_translations: 50,
      job_match_analysis: 15,
      cover_letters: 10,
      ai_summaries: 10,
      linkedin_headline: 15,
      linkedin_summary: 15,
      linkedin_profile_analysis: 10,
      linkedin_recommendations: 999999,
      downloads: 999,
    },
    templates: ['clean', 'ats', 'classic', 'modern', 'minimal', 'federal'],
    features: {
      smart_apply_skills: true,
      linkedin_profile_analysis: true,
      linkedin_recommendations: true,
    },
  },
  full: {
    id: 'full',
    name: 'Full',
    price: 75,
    duration: 90,
    stripePriceId: process.env.STRIPE_FULL_PRICE_ID || 'price_1SrKzfC8kNeYMuJLpH0KdkhJ',
    limits: {
      private_resumes: 30,
      federal_resumes: 30,
      resume_imports: 999999,
      eval_uploads: 30,
      bullet_translations: 150,
      job_match_analysis: 45,
      cover_letters: 30,
      ai_summaries: 999999,
      linkedin_headline: 999999,
      linkedin_summary: 999999,
      linkedin_profile_analysis: 999999,
      linkedin_recommendations: 999999,
      downloads: 999,
    },
    templates: ['clean', 'ats', 'classic', 'modern', 'minimal', 'federal'],
    features: {
      smart_apply_skills: true,
      linkedin_profile_analysis: true,
      linkedin_recommendations: true,
    },
  },
  expired: {
    id: 'expired',
    name: 'Expired',
    price: 0,
    duration: null,
    limits: {
      private_resumes: 0,
      federal_resumes: 0,
      resume_imports: 0,
      eval_uploads: 0,
      bullet_translations: 0,
      job_match_analysis: 0,
      cover_letters: 0,
      ai_summaries: 0,
      linkedin_headline: 0,
      linkedin_summary: 0,
      linkedin_profile_analysis: 0,
      linkedin_recommendations: 0,
      downloads: 999,
    },
    templates: ['clean', 'ats', 'classic', 'modern', 'minimal', 'federal'],
    features: {
      smart_apply_skills: false,
      linkedin_profile_analysis: false,
      linkedin_recommendations: false,
    },
  },
};

// Daily rate limits (applies to Core and Full tiers to prevent abuse)
export const DAILY_RATE_LIMITS: Record<'core' | 'full', TierLimits> = {
  core: {
    private_resumes: 3,
    federal_resumes: 3,
    resume_imports: 2,
    eval_uploads: 3,
    bullet_translations: 20,
    job_match_analysis: 5,
    cover_letters: 3,
    ai_summaries: 3,
    linkedin_headline: 999999,
    linkedin_summary: 999999,
    linkedin_profile_analysis: 999999,
    linkedin_recommendations: 999999,
    downloads: 999,
  },
  full: {
    private_resumes: 10,
    federal_resumes: 10,
    resume_imports: 5,
    eval_uploads: 10,
    bullet_translations: 50,
    job_match_analysis: 15,
    cover_letters: 5,
    ai_summaries: 10,
    linkedin_headline: 999999,
    linkedin_summary: 999999,
    linkedin_profile_analysis: 999999,
    linkedin_recommendations: 999999,
    downloads: 999,
  },
};

// Admin emails that bypass all limits
export const ADMIN_BYPASS_EMAILS = [
  'chris.simser@gmail.com',
  'carlajo22@gmail.com',
  'admin@debriefed.io',
];

// Feature display names for UI
export const FEATURE_DISPLAY_NAMES: Record<FeatureName, string> = {
  private_resumes: 'Resumes (private + tailored)',
  federal_resumes: 'Federal Resumes',
  resume_imports: 'Resume Imports',
  eval_uploads: 'Eval Uploads',
  bullet_translations: 'Bullet Translations',
  job_match_analysis: 'Job Match Analyses',
  cover_letters: 'Cover Letters',
  ai_summaries: 'AI Summaries',
  linkedin_headline: 'LinkedIn Headlines',
  linkedin_summary: 'LinkedIn Summaries',
  linkedin_profile_analysis: 'LinkedIn Profile Score',
  linkedin_recommendations: 'LinkedIn Recommendations',
  downloads: 'Downloads',
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
export function getDailyLimit(tier: 'core' | 'full', feature: FeatureName): number {
  return DAILY_RATE_LIMITS[tier][feature];
}
