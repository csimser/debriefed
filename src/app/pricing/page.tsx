'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PricingPage() {
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get('payment');
  const [loading, setLoading] = useState<'core' | 'full' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    fetch('/api/user/subscription')
      .then((res) => {
        setIsAuthenticated(res.ok);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  const handleCheckout = async (tier: 'core' | 'full') => {
    // Wait for auth check to complete - null means still loading
    if (isAuthenticated === null) {
      return;
    }

    // If not authenticated, redirect to signup
    if (isAuthenticated === false) {
      window.location.href = `/signup?plan=${tier}`;
      return;
    }

    setLoading(tier);
    setError(null);

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

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
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Status Bar */}
      <div className="bg-bg-secondary border-b border-border px-8 py-2.5 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
          <span className="text-status-green">SYSTEMS OPERATIONAL</span>
        </div>
        <div className="text-text-muted">
          <span>BETA v1.0</span>
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
          <Link href="/login" className="hidden md:block px-5 py-2.5 font-heading text-sm font-bold uppercase tracking-wider text-text-muted hover:text-text border border-border hover:border-border-bright rounded transition-all">
            Sign In
          </Link>
          <Link href="/signup" className="px-4 md:px-5 py-2.5 font-heading text-xs md:text-sm font-bold uppercase tracking-wider bg-gold text-bg-primary hover:bg-gold-bright rounded transition-all">
            Begin Mission
          </Link>
        </div>
      </nav>

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
            <div className="text-sm text-text-muted mb-6 min-h-[40px]">Try before you commit</div>
            <div className="mb-6">
              <span className="font-heading text-5xl font-bold text-status-green">$0</span>
              <span className="text-sm text-text-muted ml-2">forever</span>
            </div>
            <ul className="flex-1 mb-8">
              <PricingFeature label="Private Resume" limit="1" />
              <PricingFeature
                label="Federal OR Tailored Resume"
                limit="1"
                tooltip="Your choice: use for a federal resume OR a tailored resume from Job Match. Once used, the other becomes paywalled."
              />
              <PricingFeature label="Cover Letter" limit="1" />
              <PricingFeature label="Job Match Analysis" limit="1" />
              <PricingFeature label="Bullet Translations" limit="5" />
              <PricingFeature label="Eval Uploads" limit="3" />
              <PricingFeature
                label="LinkedIn Profile Score"
                tooltip="See your LinkedIn profile score and section breakdown. Upgrade to see specific recommendations."
              />
              <PricingFeature label="LinkedIn Recommendations" unavailable />
              <PricingFeature label="Elevator Pitch Generator" unavailable />
              <PricingFeature label="Smart Apply" />
              <PricingFeature label="Templates" limit="2" isLast />
            </ul>
            <Link href="/signup" className="w-full py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-center border border-border bg-bg-secondary text-text hover:border-gold hover:text-gold transition-all">
              Get Started Free
            </Link>
          </div>

          {/* Core Tier - Featured */}
          <div className="bg-bg-primary border border-gold p-8 flex flex-col relative shadow-[0_0_40px_rgba(212,168,75,0.15)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-bg-primary font-mono text-[10px] font-bold px-3 py-1 tracking-wider">
              BEST VALUE
            </div>
            <div className="font-heading text-2xl font-bold uppercase mb-2">Core</div>
            <div className="text-sm text-text-muted mb-6 min-h-[40px]">Everything you need to land the job</div>
            <div className="mb-6">
              <span className="font-heading text-5xl font-bold text-gold">$35</span>
              <span className="text-sm text-text-muted ml-2">30 days</span>
            </div>
            <ul className="flex-1 mb-8">
              <PricingFeature label="Resumes (private + tailored)" limit="5" tooltip="Includes both private resumes and tailored resumes from Job Match" />
              <PricingFeature label="Federal Resumes" limit="5" />
              <PricingFeature label="Cover Letters" limit="10" />
              <PricingFeature label="Job Match Analyses" limit="10" tooltip="Analysis only; tailored resumes count against resume limit" />
              <PricingFeature label="Bullet Translations" limit="50" />
              <PricingFeature label="Eval Uploads" limit="10" />
              <PricingFeature label="LinkedIn Profile Score" />
              <PricingFeature label="LinkedIn Recommendations" />
              <PricingFeature label="Elevator Pitches" limit="3" />
              <PricingFeature label="Smart Apply" />
              <PricingFeature label="Templates" limit="All 6" isLast />
            </ul>
            <button
              onClick={() => handleCheckout('core')}
              disabled={loading !== null || isAuthenticated === null}
              className="w-full py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-center bg-gold border border-gold text-bg-primary hover:bg-gold-bright transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'core' ? 'Processing...' : isAuthenticated === null ? 'Loading...' : 'Get Core'}
            </button>
          </div>

          {/* Full Tier */}
          <div className="bg-bg-primary border border-border p-8 flex flex-col hover:border-border-bright transition-all">
            <div className="font-heading text-2xl font-bold uppercase mb-2">Full</div>
            <div className="text-sm text-text-muted mb-6 min-h-[40px]">For serious job searches & SkillBridge</div>
            <div className="mb-6">
              <span className="font-heading text-5xl font-bold text-gold">$75</span>
              <span className="text-sm text-text-muted ml-2">90 days</span>
            </div>
            <ul className="flex-1 mb-8">
              <PricingFeature label="Resumes (private + tailored)" limit="30/mo" tooltip="Includes both private resumes and tailored resumes from Job Match" />
              <PricingFeature label="Federal Resumes" limit="30/mo" />
              <PricingFeature label="Cover Letters" limit="30/mo" />
              <PricingFeature label="Job Match Analyses" limit="45/mo" tooltip="Analysis only; tailored resumes count against resume limit" />
              <PricingFeature label="Bullet Translations" limit="150/mo" />
              <PricingFeature label="Eval Uploads" limit="30/mo" />
              <PricingFeature label="LinkedIn Profile Score" />
              <PricingFeature label="LinkedIn Recommendations" />
              <PricingFeature label="Elevator Pitches" limit="15/mo" />
              <PricingFeature label="Smart Apply" />
              <PricingFeature label="Templates" limit="All 6" isLast />
            </ul>
            <button
              onClick={() => handleCheckout('full')}
              disabled={loading !== null || isAuthenticated === null}
              className="w-full py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-center border border-border bg-bg-secondary text-text hover:border-gold hover:text-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'full' ? 'Processing...' : isAuthenticated === null ? 'Loading...' : 'Get Full'}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-text-muted mt-8 max-w-2xl mx-auto">
          Full tier includes daily rate limits to ensure fair usage. Need enterprise access? Contact us.
        </p>
      </section>
    </div>
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
