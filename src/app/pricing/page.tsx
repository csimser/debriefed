'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { PRICING_TIERS, getFormattedPrice, TierId } from '@/lib/pricing-config';
import { MarketingNav } from '@/components/layout/MarketingNav';
import { TestimonialsSection } from '@/components/testimonials/TestimonialsSection';
import { trackEvent } from '@/lib/analytics';
import { SUPPORT_EMAIL } from '@/lib/site-config';

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

  // Track pricing page view
  useEffect(() => {
    trackEvent('pricing_page_viewed', {
      source: searchParams.get('source') || 'direct',
      from: searchParams.get('from') || null,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    trackEvent('checkout_started', { tier, current_tier: auth.currentTier || 'anonymous' });

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
            One Payment. No Subscription.
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4">
            Built for Your Transition
          </h1>
          <p className="text-base md:text-lg text-text-muted max-w-xl mx-auto">
            Start free, upgrade when you need more. Pay once — no recurring charges, nothing to cancel.
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

        {/* vs. professional writer comparison */}
        <div className="text-center py-6 px-4 rounded border border-white/5 bg-white/[0.02] mb-8 max-w-2xl mx-auto">
          <p className="text-white/50 text-sm">
            A professional military resume writer charges{' '}
            <span className="text-white/80">$300&ndash;$900 for a single resume.</span>
            {' '}Debriefed gives you AI-powered resumes, cover letters,
            and job match analyses for <span className="text-gold font-heading">$25</span>.
          </p>
        </div>

        {/* Launch coupon banner */}
        {process.env.NEXT_PUBLIC_SHOW_LAUNCH_COUPON === 'true' && (
          <div className="text-center mb-8 py-3 px-4 rounded border border-gold/30 bg-gold/5 max-w-xl mx-auto">
            <span className="text-gold font-heading text-sm uppercase tracking-wider">
              Launch Special — Use code <strong>LAUNCH25</strong> for 25% off
            </span>
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
            <div className="flex-1 mb-6 space-y-4">
              <PricingCategory label="Resume Building">
                <PricingFeature label="Resumes" limit="5" />
                <PricingFeature label="Federal Resumes" limit="2" />
                <PricingFeature label="Downloads" limit="5" />
                <PricingFeature label="Imports" limit="3" />
                <PricingFeature label="All 6 Templates" isLast />
              </PricingCategory>
              <PricingCategory label="AI Career Tools">
                <PricingFeature label="Job Match Analysis" limit="1" />
                <PricingFeature label="Cover Letter" limit="1" />
                <PricingFeature label="AI Summary" limit="1" />
                <PricingFeature label="LinkedIn Headline" limit="1" isLast />
              </PricingCategory>
              <PricingCategory label="Military Translation">
                <PricingFeature label="MOS Dictionary" limit="Unlimited" />
                <PricingFeature label="Eval Upload" limit="1" />
                <PricingFeature label="Smart Apply" isLast />
              </PricingCategory>
            </div>
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
              <span className="text-sm text-text-muted ml-1">/ 30-day sprint</span>
            </div>
            <div className="flex-1 mb-8 space-y-4">
              <PricingCategory label="Resume Building">
                <PricingFeature label="Resumes" limit="10" />
                <PricingFeature label="Federal Resumes" limit="5" />
                <PricingFeature label="Downloads" limit="10" />
                <PricingFeature label="Imports" limit="Unlimited" />
                <PricingFeature label="All 6 Templates" isLast />
              </PricingCategory>
              <PricingCategory label="AI Career Tools">
                <PricingFeature label="Job Match Analysis" limit="10" />
                <PricingFeature label="AI Cover Letters" limit="10" />
                <PricingFeature label="AI Summaries" limit="Unlimited" />
                <PricingFeature label="LinkedIn Headlines & Summaries" limit="Unlimited" isLast />
              </PricingCategory>
              <PricingCategory label="Military Translation">
                <PricingFeature label="MOS Dictionary" limit="Unlimited" />
                <PricingFeature label="Eval Uploads" limit="10" />
                <PricingFeature label="Bullet Translations" limit="50" />
                <PricingFeature label="Smart Apply" isLast />
              </PricingCategory>
            </div>
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
              <span className="text-sm text-text-muted ml-1">/ 90-day campaign</span>
            </div>
            <div className="flex-1 mb-8 space-y-4">
              <PricingCategory label="Resume Building">
                <PricingFeature label="Resumes" limit="Unlimited" />
                <PricingFeature label="Federal Resumes" limit="Unlimited" />
                <PricingFeature label="Downloads" limit="Unlimited" />
                <PricingFeature label="Imports" limit="Unlimited" />
                <PricingFeature label="All 6 Templates" isLast />
              </PricingCategory>
              <PricingCategory label="AI Career Tools">
                <PricingFeature label="Job Match Analysis" limit="200" />
                <PricingFeature label="AI Cover Letters" limit="200" />
                <PricingFeature label="AI Summaries" limit="Unlimited" />
                <PricingFeature label="LinkedIn Tools" limit="Unlimited" />
                <PricingFeature label="LinkedIn Profile Analysis" />
                <PricingFeature label="LinkedIn Recommendations" isLast />
              </PricingCategory>
              <PricingCategory label="Military Translation">
                <PricingFeature label="MOS Dictionary" limit="Unlimited" />
                <PricingFeature label="Eval Uploads" limit="30" />
                <PricingFeature label="Bullet Translations" limit="150" />
                <PricingFeature label="Smart Apply" isLast />
              </PricingCategory>
            </div>
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

        {/* Collapsible full comparison table */}
        <div className="max-w-3xl mx-auto mt-14 mb-10">
          <details className="group border border-border bg-bg-primary rounded-lg">
            <summary className="flex items-center justify-center gap-2 cursor-pointer px-5 py-4 font-heading text-sm font-semibold uppercase tracking-wider text-text-muted hover:text-gold transition-colors">
              See all features
              <svg className="w-4 h-4 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-5 pb-5 overflow-x-auto">
              <table className="w-full text-sm border border-border">
                <thead>
                  <tr className="bg-bg-secondary">
                    <th className="text-left py-3 px-4 font-heading text-xs uppercase tracking-wider text-text-muted border-b border-border">Feature</th>
                    <th className="text-center py-3 px-4 font-heading text-xs uppercase tracking-wider text-text-muted border-b border-border">Free</th>
                    <th className="text-center py-3 px-4 font-heading text-xs uppercase tracking-wider text-gold border-b border-border">Core</th>
                    <th className="text-center py-3 px-4 font-heading text-xs uppercase tracking-wider text-gold border-b border-border">Full</th>
                  </tr>
                </thead>
                <tbody>
                  <CompareRow feature="Resumes" free="5" core="10" full="Unlimited" />
                  <CompareRow feature="Federal Resumes" free="2" core="5" full="Unlimited" />
                  <CompareRow feature="Downloads" free="5" core="10" full="Unlimited" />
                  <CompareRow feature="Resume Imports" free="3" core="Unlimited" full="Unlimited" />
                  <CompareRow feature="Job Match Analysis" free="1" core="10" full="200" />
                  <CompareRow feature="AI Cover Letters" free="1" core="10" full="200" />
                  <CompareRow feature="AI Summaries" free="1" core="Unlimited" full="Unlimited" />
                  <CompareRow feature="LinkedIn Optimizer" free="1 headline" core="Full" full="Full + Analysis" />
                  <CompareRow feature="MOS Dictionary" free="Unlimited" core="Unlimited" full="Unlimited" />
                  <CompareRow feature="Eval Uploads" free="1" core="10" full="30" />
                  <CompareRow feature="Bullet Translations" free="—" core="50" full="150" />
                  <CompareRow feature="Smart Apply" free="Yes" core="Yes" full="Yes" />
                  <CompareRow feature="Access" free="Forever" core="30-day sprint" full="90-day campaign" isLast />
                </tbody>
              </table>
            </div>
          </details>
        </div>

        {/* Add-ons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-10">
          {/* Eval Credit Pack */}
          <div className="bg-bg-primary border-2 border-gold/40 p-6 text-center hover:border-gold transition-all">
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

          {/* Transition Kit Bundle */}
          {/* TODO: Create Stripe product for transition_kit at $28, then wire handleCheckout('transition_kit') */}
          <div className="bg-bg-primary border-2 border-gold/40 p-6 text-center hover:border-gold transition-all relative">
            <div className="inline-block font-mono text-[10px] uppercase tracking-wider text-gold bg-gold-dim px-3 py-1 mb-3">
              BUNDLE &mdash; SAVE $7
            </div>
            <div className="font-heading text-lg font-bold uppercase mb-1">Transition Kit</div>
            <div className="text-sm text-text-muted mb-3">Core access + 5 eval credits in one purchase</div>
            <div className="mb-2">
              <span className="font-heading text-2xl font-bold text-gold">$28</span>
              <span className="text-sm text-text-dim ml-2 line-through">$30</span>
            </div>
            <p className="text-xs text-text-dim mb-4">Everything in Core for 30 days, plus 5 AI eval uploads. Perfect if you have evals to translate.</p>
            <button
              onClick={() => handleCheckout('core')}
              disabled={loading !== null}
              className="px-6 py-2.5 font-heading text-sm font-bold uppercase tracking-wider bg-gold border border-gold text-bg-primary hover:bg-gold-bright transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'core' ? 'Processing...' : 'Get Transition Kit'}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-text-muted mt-8 max-w-2xl mx-auto">
          Dictionary-powered translation is available on every plan. All data stays yours — even after access ends.
        </p>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h3 className="font-heading text-2xl font-bold uppercase tracking-wider text-center mb-8">
            Common Questions
          </h3>
          <div className="space-y-4">
            <FaqItem
              question="Is this a subscription?"
              answer="No — Debriefed uses one-time purchases, not recurring subscriptions. Pay once and get access for your plan's duration (30 or 90 days). Nothing to cancel."
            />
            <FaqItem
              question="What happens when my access ends?"
              answer="Your account, resumes, and all saved data stay intact. You just can't create new AI-powered content beyond Free tier limits until you purchase again."
            />
            <FaqItem
              question="Is there a refund policy?"
              answer={`Yes — if you're unsatisfied within 7 days of purchase, contact ${SUPPORT_EMAIL} for a refund.`}
            />
            <FaqItem
              question="What's the difference between Core and Full?"
              answer="Core gives you a 30-day sprint with 10 resumes, 10 cover letters, and 10 job match analyses. Full gives you a 90-day campaign with 200 cover letters, 200 job matches, unlimited resumes and downloads, plus LinkedIn profile analysis and recommendations."
            />
            <FaqItem
              question="Can I upgrade from Core to Full?"
              answer={`Yes — contact ${SUPPORT_EMAIL} and we'll help you upgrade. Your remaining Core time will be factored in.`}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />
    </>
  );
}

function PricingCategory({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-wider text-gold/70 mb-1">{label}</div>
      <ul>{children}</ul>
    </div>
  );
}

function PricingFeature({
  label,
  limit,
  unavailable,
  isLast,
}: {
  label: string;
  limit?: string;
  unavailable?: boolean;
  isLast?: boolean;
}) {
  return (
    <li className={`flex items-start gap-2.5 text-sm py-2 ${!isLast ? 'border-b border-border' : ''} ${unavailable ? 'text-text-dim' : 'text-text-muted'}`}>
      <span className={unavailable ? 'text-text-dim font-bold' : 'text-status-green font-bold'}>
        {unavailable ? '✗' : '✓'}
      </span>
      <span className="flex-1">{label}</span>
      {limit && <span className="font-mono text-[11px] text-text-dim">{limit}</span>}
    </li>
  );
}

function CompareRow({ feature, free, core, full, isLast }: { feature: string; free: string; core: string; full: string; isLast?: boolean }) {
  return (
    <tr className={!isLast ? 'border-b border-border' : ''}>
      <td className="py-3 px-4 text-text-muted font-medium">{feature}</td>
      <td className="py-3 px-4 text-center text-text-muted">{free === '—' ? <span className="text-white/30">—</span> : free}</td>
      <td className="py-3 px-4 text-center text-gold font-medium">{core}</td>
      <td className="py-3 px-4 text-center text-gold font-medium">{full}</td>
    </tr>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group border border-border bg-bg-primary rounded-lg">
      <summary className="flex items-center justify-between cursor-pointer px-5 py-4 font-heading text-sm font-semibold uppercase tracking-wider text-text hover:text-gold transition-colors">
        {question}
        <svg className="w-4 h-4 text-text-muted group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="px-5 pb-4 text-sm text-text-muted leading-relaxed">
        {answer}
      </div>
    </details>
  );
}

function PricingLoadingFallback() {
  return (
    <section className="flex-1 bg-bg-secondary px-4 md:px-20 py-12 md:py-24">
      <div className="text-center mb-10 md:mb-16">
        <div className="inline-block font-mono text-[11px] uppercase tracking-wider text-gold bg-gold-dim px-4 py-2 mb-6">
          One Payment. No Subscription.
        </div>
        <h1 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4">
          Built for Your Transition
        </h1>
        <p className="text-base md:text-lg text-text-muted max-w-xl mx-auto">
          Start free, upgrade when you need more. Pay once — no recurring charges, nothing to cancel.
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
