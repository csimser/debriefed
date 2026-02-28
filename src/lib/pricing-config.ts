// Pricing tiers configuration for Debriefed
// Defines all subscription tiers, their limits, and features

// Payments enabled by default. Set NEXT_PUBLIC_PAYMENTS_ENABLED=false to disable Stripe and grant access directly.
export const PAYMENTS_ENABLED = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED !== "false";

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
  | 'downloads'
  | 'cover_letter_exports';

export type TemplateName = 'executive' | 'classic_professional' | 'federal' | 'modern' | 'minimal' | 'twocol';

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
  cover_letter_exports: number;
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
      private_resumes: 5,
      federal_resumes: 2,
      resume_imports: 3,
      eval_uploads: 1,
      bullet_translations: 999,
      job_match_analysis: 3,
      cover_letters: 3,
      ai_summaries: 0,
      linkedin_headline: 0,
      linkedin_summary: 0,
      linkedin_profile_analysis: 0,
      linkedin_recommendations: 0,
      downloads: 5,
      cover_letter_exports: 5,
    },
    templates: ['executive', 'classic_professional', 'federal', 'modern', 'minimal', 'twocol'],
    features: {
      smart_apply_skills: true,
      linkedin_profile_analysis: false,
      linkedin_recommendations: false,
    },
  },
  core: {
    id: 'core',
    name: 'Core',
    price: 25,
    duration: 30,
    stripePriceId: process.env.STRIPE_CORE_PRICE_ID || 'price_1SrKywC8kNeYMuJLssBl9sDb',
    limits: {
      private_resumes: 10,
      federal_resumes: 5,
      resume_imports: 999,
      eval_uploads: 10,
      bullet_translations: 50,
      job_match_analysis: 10,
      cover_letters: 10,
      ai_summaries: 999,
      linkedin_headline: 999,
      linkedin_summary: 999,
      linkedin_profile_analysis: 0,
      linkedin_recommendations: 0,
      downloads: 10,
      cover_letter_exports: 10,
    },
    templates: ['executive', 'classic_professional', 'federal', 'modern', 'minimal', 'twocol'],
    features: {
      smart_apply_skills: true,
      linkedin_profile_analysis: false,
      linkedin_recommendations: false,
    },
  },
  full: {
    id: 'full',
    name: 'Full',
    price: 50,
    duration: 90,
    stripePriceId: process.env.STRIPE_FULL_PRICE_ID || 'price_1SrKzfC8kNeYMuJLpH0KdkhJ',
    limits: {
      private_resumes: 999,
      federal_resumes: 999,
      resume_imports: 999,
      eval_uploads: 30,
      bullet_translations: 150,
      job_match_analysis: 200,
      cover_letters: 200,
      ai_summaries: 999,
      linkedin_headline: 999,
      linkedin_summary: 999,
      linkedin_profile_analysis: 999,
      linkedin_recommendations: 999,
      downloads: 999,
      cover_letter_exports: 999,
    },
    templates: ['executive', 'classic_professional', 'federal', 'modern', 'minimal', 'twocol'],
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
      private_resumes: 999,
      federal_resumes: 999,
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
      cover_letter_exports: 999,
    },
    templates: ['executive', 'classic_professional', 'federal', 'modern', 'minimal', 'twocol'],
    features: {
      smart_apply_skills: false,
      linkedin_profile_analysis: false,
      linkedin_recommendations: false,
    },
  },
};

// Eval Credit Pack - one-time purchase add-on
export const EVAL_PACK = {
  name: 'Eval Credit Pack',
  price: 5,
  credits: 5,
  stripePriceId: process.env.STRIPE_EVAL_PACK_PRICE_ID || '',
};

// Daily rate limits (applies to all tiers to prevent abuse)
export const DAILY_RATE_LIMITS: Record<'free' | 'core' | 'full', TierLimits> = {
  free: {
    private_resumes: 2,
    federal_resumes: 1,
    resume_imports: 3,
    eval_uploads: 1,
    bullet_translations: 20,
    job_match_analysis: 3,
    cover_letters: 3,
    ai_summaries: 0,
    linkedin_headline: 0,
    linkedin_summary: 0,
    linkedin_profile_analysis: 0,
    linkedin_recommendations: 0,
    downloads: 5,
    cover_letter_exports: 5,
  },
  core: {
    private_resumes: 5,
    federal_resumes: 3,
    resume_imports: 5,
    eval_uploads: 5,
    bullet_translations: 50,
    job_match_analysis: 10,
    cover_letters: 10,
    ai_summaries: 10,
    linkedin_headline: 10,
    linkedin_summary: 10,
    linkedin_profile_analysis: 0,
    linkedin_recommendations: 0,
    downloads: 5,
    cover_letter_exports: 999,
  },
  full: {
    private_resumes: 7,
    federal_resumes: 7,
    resume_imports: 10,
    eval_uploads: 10,
    bullet_translations: 75,
    job_match_analysis: 15,
    cover_letters: 15,
    ai_summaries: 20,
    linkedin_headline: 20,
    linkedin_summary: 20,
    linkedin_profile_analysis: 10,
    linkedin_recommendations: 10,
    downloads: 10,
    cover_letter_exports: 999,
  },
};

// Admin emails that bypass all limits
export const ADMIN_BYPASS_EMAILS = [
  'admin@debriefed.io',
  'thecoinlockersales@gmail.com',
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
  cover_letter_exports: 'Cover Letter Exports',
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
export function getDailyLimit(tier: 'free' | 'core' | 'full', feature: FeatureName): number {
  return DAILY_RATE_LIMITS[tier][feature];
}

// Helper: formatted price string (e.g. "$25")
export function getFormattedPrice(tierId: TierId): string {
  return `$${PRICING_TIERS[tierId].price}`;
}

// Helper: duration label (e.g. "30 days")
export function getTierDuration(tierId: TierId): string {
  const d = PRICING_TIERS[tierId].duration;
  return d ? `${d} days` : 'Forever';
}
