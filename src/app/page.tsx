import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()

  // Handle auth code if present (fallback for email verification links that land here)
  const params = await searchParams
  const code = params.code as string | undefined

  if (code) {
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Successfully authenticated - redirect to dashboard
      redirect('/dashboard')
    }
    // If error, continue to show landing page (they can try logging in manually)
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

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
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 py-4">
          <div className="w-9 h-9 border-2 border-gold flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gold">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 9h6M9 13h6M9 17h4"/>
            </svg>
          </div>
          <span className="font-heading text-xl md:text-2xl font-bold tracking-wider uppercase">Debriefed</span>
        </Link>

        {/* Nav Links - hidden on mobile */}
        <div className="hidden md:flex">
          <Link href="/" className="px-6 py-5 font-heading text-xs font-semibold tracking-wider uppercase text-gold border-b-2 border-gold">
            Home
          </Link>
          <Link href="#features" className="px-6 py-5 font-heading text-xs font-semibold tracking-wider uppercase text-text-muted hover:text-text hover:bg-bg-tertiary border-b-2 border-transparent">
            Features
          </Link>
          <Link href="#pricing" className="px-6 py-5 font-heading text-xs font-semibold tracking-wider uppercase text-text-muted hover:text-text hover:bg-bg-tertiary border-b-2 border-transparent">
            Pricing
          </Link>
          <Link href="/about" className="px-6 py-5 font-heading text-xs font-semibold tracking-wider uppercase text-text-muted hover:text-text hover:bg-bg-tertiary border-b-2 border-transparent">
            About
          </Link>
          <Link href="/help" className="px-6 py-5 font-heading text-xs font-semibold tracking-wider uppercase text-text-muted hover:text-text hover:bg-bg-tertiary border-b-2 border-transparent">
            Help
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-2 md:gap-3">
          <Link href="/login" className="px-3 md:px-5 py-2.5 font-heading text-xs md:text-sm font-bold uppercase tracking-wider text-text-muted hover:text-text border border-border hover:border-border-bright rounded transition-all">
            Sign In
          </Link>
          
          <Link href="/signup" className="px-4 md:px-5 py-2.5 font-heading text-xs md:text-sm font-bold uppercase tracking-wider bg-gold text-bg-primary hover:bg-gold-bright rounded transition-all">
            Begin Mission →
          </Link>
        </div>
      </nav>

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

          {/* Main Tagline */}
          <h1 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-wide leading-none mb-4">
            Translate. Match. Optimize.
          </h1>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-gold mb-6">
            Get Debriefed.
          </h2>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Turn your military experience into civilian opportunities. Resume translation,
            job matching, and LinkedIn optimization built by a veteran in transition.
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
            
            <Link href="/signup" className="px-8 py-4 font-heading text-base font-bold uppercase tracking-wider bg-gold text-bg-primary hover:bg-gold-bright rounded transition-all text-center">
              Start Free →
            </Link>
            <Link href="/help" className="px-8 py-4 font-heading text-base font-bold uppercase tracking-wider text-text-muted border border-border hover:border-border-bright hover:text-text rounded transition-all text-center">
              View Operations Manual
            </Link>
          </div>
        </div>
      </section>

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
              AI-powered tools designed specifically for military-to-civilian transition.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
              title="Resume Builder"
              description="Create professional private sector resumes from your military experience with AI-powered suggestions."
            />
            <FeatureCard
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
              title="Federal Resume Builder"
              description="USAJOBS-compliant federal resumes with proper formatting, hours worked, and supervisor details."
            />
            <FeatureCard
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>}
              title="Bullet Translator"
              description="Convert military jargon to civilian language instantly. Stop confusing hiring managers with acronyms."
            />
            <FeatureCard
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}
              title="Eval Upload & OCR"
              description="Upload FITREPs, NCOERs, or EPRs and automatically extract achievements and bullet points."
            />
            <FeatureCard
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
              title="Job Match Analysis"
              description="Paste a job posting and see how your resume matches. Get specific recommendations to improve your score."
            />
            <FeatureCard
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
              title="Cover Letter Generator"
              description="AI-generated cover letters tailored to each job posting and your military experience."
            />
            <FeatureCard
              icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>}
              title="LinkedIn Optimizer"
              description="Generate optimized headlines and summaries, or get full profile analysis with skills recommendations."
            />
            <FeatureCard
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
              title="Smart Apply & Skills by Rank"
              description="Get skills recommendations based on your rank and experience level mapped to civilian equivalents."
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
              Because we believe no veteran should pay to translate their service.
            </p>
          </div>

          {/* Three Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-14">
            {/* Card 1: The Dictionary */}
            <div className="p-6 md:p-8 bg-bg-secondary/50 border border-border rounded-lg hover:border-gold/30 transition-all">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-gold mb-3">The Dictionary</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Our military-to-civilian translation dictionary powers every tool on Debriefed — resume building, job matching, cover letters, LinkedIn optimization. No expensive AI. No subscription wall. Just instant, accurate translations built by people who actually served.
              </p>
            </div>

            {/* Card 2: The Community */}
            <div className="p-6 md:p-8 bg-bg-secondary/50 border border-border rounded-lg hover:border-gold/30 transition-all">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-gold mb-3">The Community</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Every veteran who uses Debriefed makes it better. Submit a translation, flag a bad one, or upvote a term — your contributions help the next veteran walking off base. 10,000+ translations and growing.
              </p>
            </div>

            {/* Card 3: Spread the Word */}
            <div className="p-6 md:p-8 bg-bg-secondary/50 border border-border rounded-lg hover:border-gold/30 transition-all">
              <div className="text-4xl mb-4">📢</div>
              <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-gold mb-3">Spread the Word</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Know someone PCSing out? Retiring? ETSing? Share Debriefed. The more veterans who use and contribute, the better the dictionary gets for everyone. No referral codes, no gimmicks — just help a shipmate out.
              </p>
            </div>
          </div>

          {/* Bold Callout + CTA */}
          <div className="text-center">
            <div className="max-w-3xl mx-auto mb-8 px-6 py-6 border-l-4 border-gold bg-gold/[0.04] rounded-r-lg">
              <p className="text-base md:text-lg text-text leading-relaxed font-medium">
                Debriefed will always have a free tier. That&apos;s not a marketing gimmick — it&apos;s a commitment. The dictionary is what makes it possible, and your contributions are what keep it growing.
              </p>
            </div>
            <Link
              href="/signup"
              className="inline-block px-8 py-4 font-heading text-base font-bold uppercase tracking-wider bg-gold text-bg-primary hover:bg-gold-bright rounded transition-all"
            >
              Join the Mission — Sign Up Free
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-bg-secondary border-t border-border px-4 md:px-20 py-12 md:py-24">
        {/* Pricing Header */}
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-block font-mono text-[11px] uppercase tracking-wider text-gold bg-gold-dim px-4 py-2 mb-6">
            Simple Pricing
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4">
            Start Building for Free
          </h2>
          <p className="text-base md:text-lg text-text-muted max-w-xl mx-auto">
            Free dictionary-powered tools forever. Upgrade for AI features when you need them.
          </p>
        </div>

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
              <PricingFeature label="Resumes" limit="5 total" />
              <PricingFeature label="Federal Resumes" limit="2 total" />
              <PricingFeature label="Dictionary Translations" limit="Unlimited (20/day)" />
              <PricingFeature label="Job Analyses" limit="3 total" />
              <PricingFeature label="Cover Letters" limit="3 total" />
              <PricingFeature label="Cover Letter Exports" limit="5 total" />
              <PricingFeature label="Resume Imports" limit="3" />
              <PricingFeature label="Downloads" limit="5 total" />
              <PricingFeature label="Smart Apply" />
              <PricingFeature label="Templates" limit="All 6" />
              <PricingFeature label="Eval Upload" limit="1" isLast />
            </ul>
            <p className="text-xs text-text-dim mb-4 text-center">*Daily rate limits apply</p>

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
              <span className="font-heading text-3xl font-bold text-gold">$25</span>
              <span className="text-sm text-text-muted ml-1">/ 30 days</span>
            </div>
            <ul className="flex-1 mb-8">
              <PricingFeature label="Resumes" limit="10 / 30 days" tooltip="5/day" />
              <PricingFeature label="Federal Resumes" limit="5 / 30 days" tooltip="3/day" />
              <PricingFeature label="AI Cover Letters" limit="10 / 30 days" tooltip="10/day" />
              <PricingFeature label="AI Summary Generation" limit="Unlimited" />
              <PricingFeature label="AI Job Match Analysis" limit="10 / 30 days" tooltip="10/day" />
              <PricingFeature label="AI LinkedIn Headlines & Summaries" limit="Unlimited" />
              <PricingFeature label="Eval Uploads" limit="10 / 30 days" tooltip="5/day" />
              <PricingFeature label="Cover Letter Exports" limit="10 / 30 days" />
              <PricingFeature label="Downloads" limit="10 / 30 days" tooltip="5/day" />
              <PricingFeature label="Resume Imports" limit="Unlimited" />
              <PricingFeature label="Smart Apply" />
              <PricingFeature label="Templates" limit="All 6" isLast />
            </ul>

            <Link href="/signup" className="w-full py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-center bg-gold border border-gold text-bg-primary hover:bg-gold-bright transition-all">
              Get Core
            </Link>
          </div>

          {/* Full Tier - Best Value */}
          <div className="bg-bg-primary border border-border p-8 flex flex-col relative hover:border-border-bright transition-all">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-bg-tertiary text-gold font-mono text-[10px] font-bold px-3 py-1 tracking-wider border border-gold">
              BEST VALUE
            </div>
            <div className="font-heading text-2xl font-bold uppercase mb-2">Full</div>
            <div className="text-sm text-text-muted mb-6 min-h-[40px]">Unlimited AI for serious job searches</div>
            <div className="mb-6">
              <span className="font-heading text-3xl font-bold text-gold">$50</span>
              <span className="text-sm text-text-muted ml-1">/ 90 days</span>
            </div>
            <ul className="flex-1 mb-8">
              <PricingFeature label="Resumes" limit="Unlimited" tooltip="7/day" />
              <PricingFeature label="Federal Resumes" limit="Unlimited" tooltip="7/day" />
              <PricingFeature label="AI Cover Letters" limit="200 / 90 days" tooltip="15/day" />
              <PricingFeature label="AI Summaries" limit="Unlimited" />
              <PricingFeature label="AI Job Match Analysis" limit="200 / 90 days" tooltip="15/day" />
              <PricingFeature label="LinkedIn Tools" limit="Unlimited" />
              <PricingFeature label="LinkedIn Profile Analysis & Recommendations" />
              <PricingFeature label="Eval Uploads" limit="30 / 90 days" tooltip="10/day" />
              <PricingFeature label="Downloads" limit="Unlimited" tooltip="10/day" />
              <PricingFeature label="Smart Apply" />
              <PricingFeature label="Templates" limit="All 6" isLast />
            </ul>

            <Link href="/signup" className="w-full py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-center border border-border bg-bg-secondary text-text hover:border-gold hover:text-gold transition-all">
              Get Full
            </Link>
          </div>
        </div>

        {/* Eval Pack Callout */}
        <div className="text-center mt-8">
          <p className="text-sm text-text-muted">
            Need more eval uploads? <Link href="/pricing" className="text-gold hover:text-gold-bright hover:underline">Eval Credit Pack</Link> — $5 for 5 uploads, works with any tier.
          </p>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-text-muted mt-4 max-w-2xl mx-auto">
          Dictionary features are always unlimited. Paid tiers include daily rate limits for fair usage.
        </p>
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
              <Link href="/about" className="text-text-muted hover:text-gold transition-colors">
                About
              </Link>
              <Link href="/help" className="text-text-muted hover:text-gold transition-colors">
                Help
              </Link>
              <Link href="/privacy" className="text-text-muted hover:text-gold transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-text-muted hover:text-gold transition-colors">
                Terms of Service
              </Link>
            </div>

            <p className="text-xs text-text-muted">
              &copy; {new Date().getFullYear()} Debriefed. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function PricingFeature({ label, limit, unavailable, isLast, tooltip }: { label: string; limit?: string; unavailable?: boolean; isLast?: boolean; tooltip?: string }) {
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
