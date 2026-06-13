import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingNav } from '@/components/layout/MarketingNav'
import { TranslationDemo } from '@/components/landing/TranslationDemo'
import { APP_URL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Debriefed | Military to Civilian Resume Builder & Job Match Tool',
  description: 'Translate your military experience into civilian career opportunities. AI-powered resume builder, job match analysis, cover letter generator, and LinkedIn optimizer built for veterans.',
  openGraph: {
    title: 'Debriefed | Military to Civilian Resume Builder & Job Match Tool',
    description: 'Translate your military experience into civilian career opportunities. AI-powered resume builder, job match analysis, and LinkedIn optimizer built for veterans.',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
}

export default function HomePage() {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Debriefed',
        url: APP_URL,
        logo: `${APP_URL}/favicon.svg`,
        description: 'Free, open source military-to-civilian resume translation for veterans.',
        sameAs: ['https://github.com/csimser/debriefed'],
      },
      {
        '@type': 'WebSite',
        url: APP_URL,
        name: 'Debriefed',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${APP_URL}/mos?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <div className="min-h-screen bg-bg-primary flex flex-col">
      <MarketingNav currentPage="home" />

      {/* Hero Section */}
      <section className="flex-1 px-4 md:px-12 py-12 md:py-20 relative overflow-hidden flex items-center">
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `linear-gradient(90deg, #2a3040 1px, transparent 1px), linear-gradient(#2a3040 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse 70% 70% at 30% 50%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 30% 50%, black, transparent)',
          }}
        />

        {/* Gold Glow */}
        <div
          className="absolute -top-52 -right-52 w-[600px] h-[600px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(212, 168, 75, 0.15) 0%, transparent 70%)',
          }}
        />

        {/* Hero Content */}
        <div className="max-w-6xl mx-auto relative z-10 w-full text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-gold-dim border border-gold mb-8">
            <span className="text-gold text-[8px]">◆</span>
            <span className="font-mono text-xs text-gold">MISSION BRIEFING • TRANSITION OPERATIONS</span>
          </div>

          {/* Main Headline — benefit first */}
          <h1 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-wide leading-tight mb-4">
            Turn Your Military Experience<br className="hidden md:block" />
            Into a <span className="text-gold">Civilian Career</span>
          </h1>

          {/* Supporting tagline */}
          <p className="font-heading text-lg md:text-2xl font-semibold uppercase tracking-wider text-text-muted mb-2">
            Translate. Match. Optimize.
          </p>
          <p className="font-heading text-xl md:text-3xl font-bold text-gold mb-6">
            Get Debriefed.
          </p>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Resume translation, job matching, and LinkedIn optimization built by a
            veteran in transition. 100% free and open source — no accounts, and
            your data never leaves your device.
          </p>

          {/* Feature Callouts - 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
            <div className="p-4 bg-bg-secondary/50 border border-border rounded-lg">
              <div className="text-gold text-2xl mb-2">◈</div>
              <div className="font-heading font-semibold text-text">Resume Translation</div>
              <div className="text-sm text-text-muted">Military to civilian language</div>
            </div>
            <div className="p-4 bg-bg-secondary/50 border border-border rounded-lg">
              <div className="text-gold text-2xl mb-2">◎</div>
              <div className="font-heading font-semibold text-text">Job Match Analysis</div>
              <div className="text-sm text-text-muted">See how you fit any posting</div>
            </div>
            <div className="p-4 bg-bg-secondary/50 border border-border rounded-lg">
              <div className="text-gold text-2xl mb-2">◉</div>
              <div className="font-heading font-semibold text-text">LinkedIn Optimizer</div>
              <div className="text-sm text-text-muted">Score and improve your profile</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <Link href="/onboarding/" className="px-8 py-4 font-heading text-base font-bold uppercase tracking-wider bg-gold text-bg-primary hover:bg-gold-bright rounded transition-all text-center">
              Get Started — Free →
            </Link>
            <a href="#translation-demo" className="px-8 py-4 font-heading text-base font-bold uppercase tracking-wider text-text-muted border border-border hover:border-border-bright hover:text-text rounded transition-all text-center">
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Translation Demo */}
      <TranslationDemo />

      {/* Features Section */}
      <section id="features" className="bg-bg-secondary border-t border-border px-4 md:px-20 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block font-mono text-[11px] uppercase tracking-wider text-gold bg-gold-dim px-4 py-2 mb-6">
              Mission Capabilities
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4">
              Everything You Need to{' '}
              <span className="text-gold">Get Debriefed</span>
            </h2>
            <p className="text-base md:text-lg text-text-muted max-w-2xl mx-auto">
              Tools designed specifically for military-to-civilian transition.
            </p>
          </div>

          {/* Features Grid — condensed to 5 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
              title="Resume Builder"
              description="Create professional private sector and USAJOBS-compliant federal resumes from your military experience with AI-powered suggestions."
            />
            <FeatureCard
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>}
              title="Bullet Translator"
              description="Convert military jargon to civilian language instantly. Stop confusing hiring managers with acronyms."
            />
            <FeatureCard
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
              title="Job Match & Cover Letters"
              description="Paste a job posting to see your match score with tailored recommendations, then generate an AI cover letter to apply."
            />
            <FeatureCard
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}
              title="Eval Upload & OCR"
              description="Upload FITREPs, NCOERs, or EPRs and automatically extract achievements and bullet points for your resume."
            />
            <FeatureCard
              icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>}
              title="LinkedIn & Smart Apply"
              description="Generate optimized LinkedIn headlines and summaries, get profile analysis, and receive skills recommendations mapped to your rank."
            />
          </div>
        </div>
      </section>

      {/* Why Free Section */}
      <section className="bg-bg-primary border-t border-border px-4 md:px-20 py-16 md:py-24 relative overflow-hidden">
        {/* Subtle gold accent glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(212, 168, 75, 0.06) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block font-mono text-[11px] uppercase tracking-wider text-gold bg-gold-dim px-4 py-2 mb-6">
              The Mission
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4">
              Why Is Debriefed <span className="text-gold">Free?</span>
            </h2>
            <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
              Because no veteran should pay to translate their service.
            </p>
          </div>

          {/* Three Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-14">
            {/* Card 1: The Dictionary */}
            <div className="p-6 md:p-8 bg-bg-secondary/50 border border-border rounded-lg hover:border-gold/30 transition-all">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-gold mb-3">The Dictionary</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                A 33,000+ entry military-to-civilian dictionary powers translation across Debriefed — resume building, bullet translation, LinkedIn optimization. No expensive AI required. No subscription wall. Just instant, accurate translations built by people who actually served.
              </p>
            </div>

            {/* Card 2: Open Source */}
            <div className="p-6 md:p-8 bg-bg-secondary/50 border border-border rounded-lg hover:border-gold/30 transition-all">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-gold mb-3">Open Source</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Debriefed is MIT licensed and the entire codebase lives on{' '}
                <a href="https://github.com/csimser/debriefed" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-bright hover:underline">GitHub</a>.
                Read the code, fork it, fix a translation, add a feature — pull requests welcome. Nothing hidden, nothing locked away.
              </p>
            </div>

            {/* Card 3: Spread the Word */}
            <div className="p-6 md:p-8 bg-bg-secondary/50 border border-border rounded-lg hover:border-gold/30 transition-all">
              <div className="text-4xl mb-4">📢</div>
              <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-gold mb-3">Spread the Word</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Know someone PCSing out? Retiring? ETSing? Share Debriefed — or star the repo so other veterans can find it. No referral codes, no upsells, nothing to buy. Just help a shipmate out.
              </p>
            </div>
          </div>

          {/* Bold Callout + CTA */}
          <div className="text-center">
            <div className="max-w-3xl mx-auto mb-8 px-6 py-6 border-l-4 border-gold bg-gold/[0.04] rounded-r-lg">
              <p className="text-base md:text-lg text-text leading-relaxed font-medium">
                Debriefed is free — all of it, forever. That&apos;s not a marketing gimmick, it&apos;s how the project is built: open source, no backend, no accounts, nothing to sell you.
              </p>
            </div>
            <Link
              href="/onboarding/"
              className="inline-block px-8 py-4 font-heading text-base font-bold uppercase tracking-wider bg-gold text-bg-primary hover:bg-gold-bright rounded transition-all"
            >
              Get Started — Free
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works / Truly Free Section */}
      <section id="how-it-works" className="bg-bg-secondary border-t border-border px-4 md:px-20 py-12 md:py-24">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 md:mb-16">
            <div className="inline-block font-mono text-[11px] uppercase tracking-wider text-gold bg-gold-dim px-4 py-2 mb-6">
              How It Works
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4">
              Truly <span className="text-gold">Free</span>
            </h2>
            <p className="text-base md:text-lg text-text-muted max-w-xl mx-auto">
              No tiers, no trials, no credit card. Here&apos;s how that works.
            </p>
          </div>

          {/* Three Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Card 1: No Accounts */}
            <div className="p-6 md:p-8 bg-bg-primary border border-border rounded-lg hover:border-gold/30 transition-all">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-gold mb-3">No Accounts</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                There&apos;s nothing to sign up for. Your profile, resumes, and cover letters live in your own browser — not on a server. Export everything to a file anytime, and import it on another device when you need to.
              </p>
            </div>

            {/* Card 2: Bring Your Own AI */}
            <div className="p-6 md:p-8 bg-bg-primary border border-border rounded-lg hover:border-gold/30 transition-all">
              <div className="text-4xl mb-4">🔑</div>
              <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-gold mb-3">AI Optional, Not Required</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Every tool runs on the built-in dictionary engine — no key, no account, no cost. Want sharper output? Add your own Anthropic API key in Settings and Claude polishes the dictionary results, about 2–6 cents per resume, paid to Anthropic directly.
              </p>
            </div>

            {/* Card 3: Take It Anywhere */}
            <div className="p-6 md:p-8 bg-bg-primary border border-border rounded-lg hover:border-gold/30 transition-all">
              <div className="text-4xl mb-4">💾</div>
              <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-gold mb-3">Take It Anywhere</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Install Debriefed as an app (PWA) straight from your browser, or download the single-file Debriefed.html from GitHub Releases and run it from a USB stick — no internet connection required for the dictionary tools.
              </p>
            </div>
          </div>

          {/* Secondary GitHub link */}
          <div className="text-center mt-8">
            <p className="text-sm text-text-muted">
              Want the details?{' '}
              <a
                href="https://github.com/csimser/debriefed"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-bright hover:underline"
              >
                View the source on GitHub →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* MilCalc Cross-Promo */}
      <section className="bg-bg-primary border-t border-border px-4 md:px-20 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-6 md:p-8 bg-bg-secondary/50 border border-border rounded-lg">
            <h3 className="font-heading text-lg md:text-xl font-bold uppercase tracking-wider mb-3">
              Know Your Numbers Before You Separate
            </h3>
            <p className="text-sm md:text-base text-text-muted leading-relaxed max-w-xl mx-auto mb-5">
              MilCalc runs the math on your military pay, benefits, and entitlements &mdash; so you&apos;re not guessing when it matters most.
            </p>
            {/* MilCalc was a sister product (military pay calculator) deployed at milcalc.app.
                Update this href to your own cross-promo URL, or remove this <section> entirely. */}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 font-heading text-sm font-bold uppercase tracking-wider border border-gold text-gold hover:bg-gold hover:text-bg-primary rounded transition-all"
            >
              Calculate Now &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg-secondary border-t border-border px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-gold flex items-center justify-center">
                <span className="font-heading font-bold text-gold text-sm">D</span>
              </div>
              <span className="font-heading text-sm font-bold tracking-wider uppercase">Debriefed</span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link href="/about/" className="text-text-muted hover:text-gold transition-colors">
                About
              </Link>
              <Link href="/help/" className="text-text-muted hover:text-gold transition-colors">
                Help
              </Link>
              <Link href="/privacy/" className="text-text-muted hover:text-gold transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms/" className="text-text-muted hover:text-gold transition-colors">
                Terms of Service
              </Link>
              <a
                href="https://github.com/csimser/debriefed"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-gold transition-colors"
              >
                GitHub
              </a>
            </div>

            <div className="text-xs text-text-muted text-center md:text-right">
              <p>
                Built by Chris Simser &middot; Open source under MIT &middot;{' '}
                <a
                  href="https://github.com/csimser/debriefed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors underline-offset-2 hover:underline"
                >
                  github.com/csimser/debriefed
                </a>
              </p>
              <p className="mt-1">&copy; {new Date().getFullYear()} Debriefed.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-bg-primary border border-border p-6 hover:border-gold/50 transition-all group">
      <div className="w-12 h-12 bg-gold-dim rounded-lg flex items-center justify-center text-gold mb-4 group-hover:bg-gold group-hover:text-bg-primary transition-all">
        {icon}
      </div>
      <h3 className="font-heading text-lg font-bold uppercase tracking-wider mb-2">{title}</h3>
      <p className="text-sm text-text-muted leading-relaxed">{description}</p>
    </div>
  )
}
