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
  core: process.env.STRIPE_CORE_PRICE_ID || 'price_1SrKywC8kNeYMuJLssBl9sDb',
  full: process.env.STRIPE_FULL_PRICE_ID || 'price_1SrKzfC8kNeYMuJLpH0KdkhJ',
};

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
