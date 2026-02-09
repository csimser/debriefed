// Stripe client initialization for Debriefed
import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
});

export default stripe;

// Stripe price IDs for each tier
export const STRIPE_PRICE_IDS = {
  core: process.env.STRIPE_CORE_PRICE_ID!,
  full: process.env.STRIPE_FULL_PRICE_ID!,
};

// Fail loudly if price IDs are missing in production
if (process.env.NODE_ENV === 'production' && (!process.env.STRIPE_CORE_PRICE_ID || !process.env.STRIPE_FULL_PRICE_ID)) {
  throw new Error('STRIPE_CORE_PRICE_ID and STRIPE_FULL_PRICE_ID must be set in production');
}

// Get the duration in days for a tier
export function getTierDuration(tier: 'core' | 'full'): number {
  return tier === 'core' ? 30 : 90;
}

// Calculate expiration date for a tier
export function calculateExpirationDate(tier: 'core' | 'full'): Date {
  const days = getTierDuration(tier);
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + days);
  return expiration;
}
