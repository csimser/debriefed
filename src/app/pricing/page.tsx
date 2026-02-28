'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { PRICING_TIERS, getFormattedPrice, TierId } from '@/lib/pricing-config';
import { MarketingNav } from '@/components/layout/MarketingNav';
import { TestimonialsSection } from '@/components/testimonials/TestimonialsSection';
import { trackEvent } from '@/lib/analytics';

interface AuthState {
  isLoggedIn: boolean
  userName: string
  currentTier: TierId | null
  daysRemaining: number | null
}

function PricingContent() {
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get('payment');
  const [loading, setLoading] = useState<'core' | 'full' | 'eval_pack' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    userName: '',
    currentTier: null,
    daysRemaining: null,
  });

  const supabase = createClient();

  // Track cancelled checkout
  useEffect(() => {
    if (paymentStatus === 'cancelled') {
      trackEvent('stripe_checkout_cancel');
    }
  }, [paymentStatus]);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, tier, plan_expires_at')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        let daysRemaining: number | null = null;
        if (profile.plan_expires_at) {
          const expires = new Date(profile.plan_expires_at);
          const now = new Date();
          if (expires > now) {
            daysRemaining = Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          }
        }

        setAuth({
          isLoggedIn: true,
          userName: profile.first_name || '',
          currentTier: (profile.tier as TierId) || 'free',
          daysRemaining,
        });
      }
    }

    checkAuth();
  }, [supabase]);

  const handleCheckout = async (tier: 'core' | 'full' | 'eval_pack') => {
    setLoading(tier);
    setError(null);

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      if (response.status === 401) {
        // Not logged in — send to signup with the selected plan
        window.location.href = `/signup?plan=${tier}`;
        return;
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to create checkout session');
        setLoading(null);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(null);
    }
  };

  const isCurrentTier = (tier: TierId) => auth.currentTier === tier;

  const getTierCTA = (tier: TierId) => {
    if (isCurrentTier(tier)) return 'Current Plan';
    if (tier === 'free') return auth.isLoggedIn ? 'Current Plan' : 'Get Started Free';
    if (loading === tier) return 'Processing...';
    if (auth.isLoggedIn && auth.currentTier === 'free') return `Upgrade to ${tier === 'core' ? 'Core' : 'Full'}`;
    if (auth.isLoggedIn && auth.currentTier === 'core' && tier === 'full') return 'Upgrade to Full';
    return tier === 'core' ? 'Get Core' : 'Get Full';
  };

  const tierMessage = auth.isLoggedIn && auth.currentTier ? (() => {
    const planNames: Record<string, string> = { free: 'Free', core: 'Core', full: 'Full Access' };
    const name = planNames[auth.currentTier] || auth.currentTier;
    if (auth.currentTier === 'free') return `You're on ${name} — upgrade for AI-powered features`;
    if (auth.daysRemaining) return `You're on ${name} — ${auth.daysRemaining} days remaining`;
    return `You're on ${name}`;
  })() : null;

  return (
    <>
      {/* Payment Status Messages */}
      {paymentStatus === 'cancelled' && (
        <div className="bg-status-amber/10 border-b border-status-amber/30 px-4 py-3 text-center">
          <span className="text-status-amber text-sm">Payment cancelled. You can try again whenever you're ready.</span>
        </div>
      )}

      {/* Pricing Section */}
      <section className="flex-1 bg-bg-secondary px-4 md:px-20 py-12 md:py-24">
        {/* Pricing Header */}
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-block font-mono text-[11px] uppercase tracking-wider text-gold bg-gold-dim px-4 py-2 mb-6">
            Simple Pricing
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4">
            Choose Your Mission Package
          </h1>
          <p className="text-base md:text-lg text-text-muted max-w-xl mx-auto">
            Start free, upgrade when you need more. No subscriptions - just straightforward access during your transition.
          </p>
          {tierMessage && (
            <div className="mt-4 inline-block bg-gold-dim border border-gold/30 rounded px-4 py-2">
              <p className="text-sm text-gold font-medium">{tierMessage}</p>
            </div>
          )}
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-status-red/10 border border-status-red/30 rounded text-status-red text-center">
            {error}
          </div>
        )}

        {/* Pricing Grid - 3 Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className={`bg-bg-primary border p-8 flex flex-col hover:border-border-bright transition-all ${isCurrentTier('free') ? 'border-gold' : 'border-border'}`}>
            <div className="font-heading text-2xl font-bold uppercase mb-2">Free</div>
            <div className="text-sm text-text-muted mb-6 min-h-[40px]">Dictionary-powered resume tools</div>
            <div className="mb-6">
              <span className="font-heading text-3xl font-bold text-status-green">$0</span>
              <span className="text-sm text-text-muted ml-1">forever</span>
            </div>
            <ul className="flex-1 mb-6">
              <PricingFeature label="Resumes" limit="5 total" />
              <PricingFeature label="Federal Resumes" limit="2 total" />
              <PricingFeature label="Templates" limit="All 6" />
              <PricingFeature label="Dictionary Translations" limit="Unlimited (20/day)" />
              <PricingFeature label="Job Analyses" limit="3 total" tooltip="3/day rate limit" />
              <PricingFeature label="Cover Letters" limit="3 total" tooltip="3/day rate limit" />
              <PricingFeature label="Cover Letter Exports" limit="5 total" tooltip="5/day rate limit" />
              <PricingFeature label="Downloads" limit="5 total" tooltip="5/day rate limit" />
              <PricingFeature label="Eval Upload" limit="1" tooltip="First one's free — try AI eval parsing" />
              <PricingFeature label="Resume Imports" limit="3" />
              <PricingFeature label="Smart Apply" isLast />
            </ul>
            <p className="text-xs text-text-dim mb-4 text-center">*Daily rate limits apply</p>
            {isCurrentTier('free') ? (
              <div className="w-full py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-center border border-gold bg-gold-dim text-gold cursor-default">
                Current Plan
              </div>
            ) : (
              <Link href="/signup" className="w-full py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-center border border-border bg-bg-secondary text-text hover:border-gold hover:text-gold transition-all">
                Get Started Free
              </Link>
            )}
          </div>

          {/* Core Tier - Most Popular */}
          <div className={`bg-bg-primary border p-8 flex flex-col relative ${isCurrentTier('core') ? 'border-gold shadow-[0_0_40px_rgba(212,168,75,0.15)]' : 'border-gold shadow-[0_0_40px_rgba(212,168,75,0.15)]'}`}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-bg-primary font-mono text-[10px] font-bold px-3 py-1 tracking-wider">
              {isCurrentTier('core') ? 'YOUR PLAN' : 'MOST POPULAR'}
            </div>
            <div className="font-heading text-2xl font-bold uppercase mb-2">Core</div>
            <div className="text-sm text-text-muted mb-6 min-h-[40px]">AI-powered tools to land the job</div>
            <div className="mb-6">
              <span className="font-heading text-3xl font-bold text-gold">{getFormattedPrice('core')}</span>
              <span className="text-sm text-text-muted ml-1">/ {PRICING_TIERS.core.duration} days</span>
            </div>
            <ul className="flex-1 mb-8">
              <PricingFeature label="Resumes" limit="10 / 30 days" tooltip="5/day rate limit" />
              <PricingFeature label="Federal Resumes" limit="5 / 30 days" tooltip="3/day rate limit" />
              <PricingFeature label="Templates" limit="All 6" />
              <PricingFeature label="AI Cover Letters" limit="10 / 30 days" tooltip="10/day rate limit" />
              <PricingFeature label="AI Job Match Analysis" limit="10 / 30 days" tooltip="10/day rate limit" />
              <PricingFeature label="AI Summary Generation" limit="Unlimited" />
              <PricingFeature label="AI LinkedIn Headlines & Summaries" limit="Unlimited" />
              <PricingFeature label="Bullet Translations" limit="50 / 30 days" tooltip="50/day rate limit" />
              <PricingFeature label="Eval Uploads" limit="10 / 30 days" tooltip="5/day rate limit" />
              <PricingFeature label="Cover Letter Exports" limit="10 / 30 days" />
              <PricingFeature label="Downloads" limit="10 / 30 days" tooltip="5/day rate limit" />
              <PricingFeature label="Resume Imports" limit="Unlimited" />
              <PricingFeature label="Smart Apply" isLast />
            </ul>
            {isCurrentTier('core') ? (
              <div className="w-full py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-center border border-gold bg-gold-dim text-gold cursor-default">
                Current Plan
              </div>
            ) : (
              <button
                onClick={() => handleCheckout('core')}
                disabled={loading !== null}
                className="w-full py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-center bg-gold border border-gold text-bg-primary hover:bg-gold-bright transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {getTierCTA('core')}
              </button>
            )}
          </div>

          {/* Full Tier - Best Value */}
          <div className={`bg-bg-primary border p-8 flex flex-col relative hover:border-border-bright transition-all ${isCurrentTier('full') ? 'border-gold' : 'border-border'}`}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-bg-tertiary text-gold font-mono text-[10px] font-bold px-3 py-1 tracking-wider border border-gold">
              {isCurrentTier('full') ? 'YOUR PLAN' : 'BEST VALUE'}
            </div>
            <div className="font-heading text-2xl font-bold uppercase mb-2">Full</div>
            <div className="text-sm text-text-muted mb-6 min-h-[40px]">Unlimited AI for serious job searches</div>
            <div className="mb-6">
              <span className="font-heading text-3xl font-bold text-gold">{getFormattedPrice('full')}</span>
              <span className="text-sm text-text-muted ml-1">/ {PRICING_TIERS.full.duration} days</span>
            </div>
            <ul className="flex-1 mb-8">
              <PricingFeature label="Resumes" limit="Unlimited" tooltip="7/day rate limit" />
              <PricingFeature label="Federal Resumes" limit="Unlimited" tooltip="7/day rate limit" />
              <PricingFeature label="Templates" limit="All 6" />
              <PricingFeature label="AI Cover Letters" limit="200 / 90 days" tooltip="15/day rate limit" />
              <PricingFeature label="AI Job Match Analysis" limit="200 / 90 days" tooltip="15/day rate limit" />
              <PricingFeature label="AI Summaries" limit="Unlimited" />
              <PricingFeature label="AI LinkedIn Tools" limit="Unlimited" />
              <PricingFeature label="LinkedIn Profile Analysis" tooltip="Full tier exclusive" />
              <PricingFeature label="LinkedIn Recommendations" tooltip="Full tier exclusive" />
              <PricingFeature label="Bullet Translations" limit="150 / 90 days" tooltip="75/day rate limit" />
              <PricingFeature label="Eval Uploads" limit="30 / 90 days" tooltip="10/day rate limit" />
              <PricingFeature label="Downloads" limit="Unlimited" tooltip="10/day rate limit" />
              <PricingFeature label="Smart Apply" isLast />
            </ul>
            {isCurrentTier('full') ? (
              <div className="w-full py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-center border border-gold bg-gold-dim text-gold cursor-default">
                Current Plan
              </div>
            ) : (
              <button
                onClick={() => handleCheckout('full')}
                disabled={loading !== null}
                className="w-full py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-center border border-border bg-bg-secondary text-text hover:border-gold hover:text-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {getTierCTA('full')}
              </button>
            )}
          </div>
        </div>

        {/* Eval Credit Pack */}
        <div className="max-w-md mx-auto mt-10 bg-bg-primary border-2 border-gold/40 p-6 text-center hover:border-gold transition-all">
          <div className="inline-block font-mono text-[10px] uppercase tracking-wider text-gold bg-gold-dim px-3 py-1 mb-3">
            ADD-ON
          </div>
          <div className="font-heading text-lg font-bold uppercase mb-1">Eval Credit Pack</div>
          <div className="text-sm text-text-muted mb-3">AI-powered eval parsing — works with any tier</div>
          <div className="mb-4">
            <span className="font-heading text-2xl font-bold text-gold">$5</span>
            <span className="text-sm text-text-muted ml-1">/ 5 uploads</span>
          </div>
          <p className="text-xs text-text-dim mb-4">Upload your eval as a photo or PDF. AI extracts and translates every bullet. Buy multiple packs anytime.</p>
          <button
            onClick={() => handleCheckout('eval_pack')}
            disabled={loading !== null}
            className="px-6 py-2.5 font-heading text-sm font-bold uppercase tracking-wider bg-gold border border-gold text-bg-primary hover:bg-gold-bright transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'eval_pack' ? 'Processing...' : 'Buy Eval Pack'}
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-text-muted mt-8 max-w-2xl mx-auto">
          All tiers include daily rate limits to ensure fair usage. Dictionary features are available on every plan.
        </p>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />
    </>
  );
}

function PricingFeature({
  label,
  limit,
  unavailable,
  isLast,
  tooltip,
}: {
  label: string;
  limit?: string;
  unavailable?: boolean;
  isLast?: boolean;
  tooltip?: string;
}) {
  return (
    <li className={`flex items-start gap-2.5 text-sm py-2 ${!isLast ? 'border-b border-border' : ''} ${unavailable ? 'text-text-dim' : 'text-text-muted'}`}>
      <span className={unavailable ? 'text-text-dim font-bold' : 'text-status-green font-bold'}>
        {unavailable ? '✗' : '✓'}
      </span>
      <span className="flex-1 flex items-center gap-1">
        {label}
        {tooltip && (
          <span className="group relative cursor-help">
            <svg className="w-3.5 h-3.5 text-text-dim hover:text-gold transition-colors" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-bg-tertiary border border-border rounded-md text-xs text-text-muted whitespace-pre-line w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-lg">
              {tooltip}
            </span>
          </span>
        )}
      </span>
      {limit && <span className="font-mono text-[11px] text-text-dim">{limit}</span>}
    </li>
  );
}

function PricingLoadingFallback() {
  return (
    <section className="flex-1 bg-bg-secondary px-4 md:px-20 py-12 md:py-24">
      <div className="text-center mb-10 md:mb-16">
        <div className="inline-block font-mono text-[11px] uppercase tracking-wider text-gold bg-gold-dim px-4 py-2 mb-6">
          Simple Pricing
        </div>
        <h1 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4">
          Choose Your Mission Package
        </h1>
        <p className="text-base md:text-lg text-text-muted max-w-xl mx-auto">
          Start free, upgrade when you need more. No subscriptions - just straightforward access during your transition.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-bg-primary border border-border p-8 animate-pulse">
            <div className="h-8 bg-bg-secondary rounded mb-4" />
            <div className="h-4 bg-bg-secondary rounded mb-6 w-2/3" />
            <div className="h-12 bg-bg-secondary rounded mb-6" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className="h-4 bg-bg-secondary rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function PricingPage() {
  const [auth, setAuth] = useState<{ isLoggedIn: boolean; userName: string }>({ isLoggedIn: false, userName: '' });
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('user_id', user.id)
          .single();
        setAuth({ isLoggedIn: true, userName: profile?.first_name || '' });
      }
    }
    checkAuth();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <MarketingNav currentPage="pricing" isLoggedIn={auth.isLoggedIn} userName={auth.userName} />

      <Suspense fallback={<PricingLoadingFallback />}>
        <PricingContent />
      </Suspense>
    </div>
  );
}
