'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PricingContent() {
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get('payment');
  const [loading, setLoading] = useState<'core' | 'full' | 'eval_pack' | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-status-red/10 border border-status-red/30 rounded text-status-red text-center">
            {error}
          </div>
        )}

        {/* Pricing Grid - 3 Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="bg-bg-primary border border-border p-8 flex flex-col hover:border-border-bright transition-all">
            <div className="font-heading text-2xl font-bold uppercase mb-2">Free</div>
            <div className="text-sm text-text-muted mb-6 min-h-[40px]">Dictionary-powered resume tools</div>
            <div className="mb-6">
              <span className="font-heading text-3xl font-bold text-status-green">$0</span>
              <span className="text-sm text-text-muted ml-1">forever</span>
            </div>
            <ul className="flex-1 mb-8">
              <PricingFeature label="Resumes" limit="5" />
              <PricingFeature label="Federal Resumes" limit="5" />
              <PricingFeature label="Dictionary Translations" limit="Unlimited" />
              <PricingFeature label="Job Match (Dictionary)" limit="Unlimited" />
              <PricingFeature label="Cover Letter Builder" limit="Unlimited" />
              <PricingFeature label="Resume Imports" limit="3" />
              <PricingFeature label="Downloads" limit="Unlimited" />
              <PricingFeature label="Smart Apply" />
              <PricingFeature label="Templates" limit="5" />
              <PricingFeature label="Eval Upload" limit="1" tooltip="First one's free — try AI eval parsing" />
              <PricingFeature label="AI Features" unavailable isLast />
            </ul>
            <Link href="/signup" className="w-full py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-center border border-border bg-bg-secondary text-text hover:border-gold hover:text-gold transition-all">
              Get Started Free
            </Link>
          </div>

          {/* Core Tier - Most Popular */}
          <div className="bg-bg-primary border border-gold p-8 flex flex-col relative shadow-[0_0_40px_rgba(212,168,75,0.15)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-bg-primary font-mono text-[10px] font-bold px-3 py-1 tracking-wider">
              MOST POPULAR
            </div>
            <div className="font-heading text-2xl font-bold uppercase mb-2">Core</div>
            <div className="text-sm text-text-muted mb-6 min-h-[40px]">AI-powered tools to land the job</div>
            <div className="mb-6">
              <span className="font-heading text-3xl font-bold text-gold">$15</span>
              <span className="text-sm text-text-muted ml-1">/ 30 days</span>
            </div>
            <ul className="flex-1 mb-8">
              <PricingFeature label="Resumes" limit="10" />
              <PricingFeature label="Federal Resumes" limit="5" />
              <PricingFeature label="AI Cover Letters" limit="5" />
              <PricingFeature label="AI Summary Generation" limit="Unlimited" />
              <PricingFeature label="AI Job Match Analysis" limit="Unlimited" />
              <PricingFeature label="AI LinkedIn Headlines & Summaries" limit="Unlimited" />
              <PricingFeature label="Eval Uploads" limit="5" />
              <PricingFeature label="Resume Imports" limit="Unlimited" />
              <PricingFeature label="Smart Apply" />
              <PricingFeature label="Templates" limit="All 6" isLast />
            </ul>
            <button
              onClick={() => handleCheckout('core')}
              disabled={loading !== null}
              className="w-full py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-center bg-gold border border-gold text-bg-primary hover:bg-gold-bright transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'core' ? 'Processing...' : 'Get Core'}
            </button>
          </div>

          {/* Full Tier - Best Value */}
          <div className="bg-bg-primary border border-border p-8 flex flex-col relative hover:border-border-bright transition-all">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-bg-tertiary text-gold font-mono text-[10px] font-bold px-3 py-1 tracking-wider border border-gold">
              BEST VALUE
            </div>
            <div className="font-heading text-2xl font-bold uppercase mb-2">Full</div>
            <div className="text-sm text-text-muted mb-6 min-h-[40px]">Unlimited AI for serious job searches</div>
            <div className="mb-6">
              <span className="font-heading text-3xl font-bold text-gold">$30</span>
              <span className="text-sm text-text-muted ml-1">/ 90 days</span>
            </div>
            <ul className="flex-1 mb-8">
              <PricingFeature label="Resumes" limit="Unlimited" />
              <PricingFeature label="Federal Resumes" limit="Unlimited" />
              <PricingFeature label="AI Cover Letters" limit="Unlimited" />
              <PricingFeature label="AI Summaries" limit="Unlimited" />
              <PricingFeature label="AI Job Match Analysis" limit="Unlimited" />
              <PricingFeature label="LinkedIn Tools" limit="Unlimited" />
              <PricingFeature label="LinkedIn Profile Analysis" limit="Unlimited" tooltip="Full tier exclusive" />
              <PricingFeature label="LinkedIn Recommendations" tooltip="Full tier exclusive" />
              <PricingFeature label="Eval Uploads" limit="20" />
              <PricingFeature label="Smart Apply" />
              <PricingFeature label="Templates" limit="All 6" isLast />
            </ul>
            <button
              onClick={() => handleCheckout('full')}
              disabled={loading !== null}
              className="w-full py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-center border border-border bg-bg-secondary text-text hover:border-gold hover:text-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'full' ? 'Processing...' : 'Get Full'}
            </button>
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
            <span className="text-sm text-text-muted ml-1">/ 10 uploads</span>
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
          All paid tiers include daily rate limits to ensure fair usage. Dictionary features are always unlimited.
        </p>
      </section>
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
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Status Bar */}
      <div className="bg-bg-secondary border-b border-border px-8 py-2.5 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
          <span className="text-status-green">SYSTEMS OPERATIONAL</span>
        </div>
        <div className="text-text-muted">
          <span>v1.0</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-bg-secondary border-b border-border px-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 py-4">
          <div className="w-9 h-9 border-2 border-gold flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gold">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 9h6M9 13h6M9 17h4"/>
            </svg>
          </div>
          <span className="font-heading text-xl md:text-2xl font-bold tracking-wider uppercase">Debriefed</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <Link href="/help" className="hidden md:block px-5 py-2.5 font-heading text-sm font-bold uppercase tracking-wider text-text-muted hover:text-text transition-colors">
            Help
          </Link>
          <Link href="/login" className="px-3 md:px-5 py-2.5 font-heading text-xs md:text-sm font-bold uppercase tracking-wider text-text-muted hover:text-text border border-border hover:border-border-bright rounded transition-all">
            Sign In
          </Link>
          <Link href="/signup" className="px-4 md:px-5 py-2.5 font-heading text-xs md:text-sm font-bold uppercase tracking-wider bg-gold text-bg-primary hover:bg-gold-bright rounded transition-all">
            Begin Mission
          </Link>
        </div>
      </nav>

      <Suspense fallback={<PricingLoadingFallback />}>
        <PricingContent />
      </Suspense>
    </div>
  );
}
