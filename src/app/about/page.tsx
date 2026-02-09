'use client'

import Link from 'next/link'

export default function AboutPage() {
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
          <Link href="/login" className="hidden md:block px-5 py-2.5 font-heading text-sm font-bold uppercase tracking-wider text-text-muted hover:text-text border border-border hover:border-border-bright rounded transition-all">
            Sign In
          </Link>
          <Link href="/signup" className="px-4 md:px-5 py-2.5 font-heading text-xs md:text-sm font-bold uppercase tracking-wider bg-gold text-bg-primary hover:bg-gold-bright rounded transition-all">
            Begin Mission
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1 rounded-full border border-gold/30 text-gold text-xs font-mono uppercase tracking-wider mb-4">
              Our Mission
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Built by a Veteran,<br/><span className="text-gold">For Veterans</span>
            </h1>
          </div>

          {/* Story */}
          <div className="max-w-none space-y-6">

            {/* Section 1: The Problem */}
            <section>
              <h2 className="text-2xl font-heading text-white mb-6">The Problem I Saw</h2>

              <p className="text-text-muted leading-relaxed text-base mb-4">
                I've got 20+ years in the Navy. When I started looking at transition resources, I expected to find solid tools built by people who get it. Instead, I found companies charging over a grand for resume templates and "career coaches" making a living off veteran anxiety. That didn't sit right with me.
              </p>

              <p className="text-text-muted leading-relaxed text-base">
                I've watched sailors who ran complex ops, led teams under pressure, and managed equipment worth more than most houses struggle to explain what they did to a civilian hiring manager. These are capable people. The problem isn't them. It's that nobody taught them how to translate their experience.
              </p>
            </section>

            {/* Divider */}
            <div className="border-t border-gold/20 my-12" />

            {/* Section 2: Why I Built This */}
            <section>
              <h2 className="text-2xl font-heading text-white mb-6">Why I Built This</h2>

              <p className="text-text-muted leading-relaxed text-base mb-4">
                I'm a Senior Chief Damage Controlman, E-8, retiring in 2026. I've got an MBA, PMP, and a bunch of cyber certs. I've trained sailors, led DC teams, and stood plenty of watches. None of that matters if I can't explain it to someone who's never been on a ship.
              </p>

              <p className="text-text-muted leading-relaxed text-base mb-4">
                When I started my own transition planning, the tools out there were either way overpriced or assumed you already knew how the civilian job market works. That's backwards. If I already knew that, I wouldn't need the tool.
              </p>

              <p className="text-text-muted leading-relaxed text-base">
                So I built what I wanted. Something that takes military experience and translates it into language that makes sense to civilian employers. No thousand dollar packages. No upsells. Just a tool that does what it says.
              </p>
            </section>

            {/* Divider */}
            <div className="border-t border-gold/20 my-12" />

            {/* Section 3: What Makes This Different - Card Grid */}
            <section>
              <h2 className="text-2xl font-heading text-white mb-8">What Makes This Different</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card 1 */}
                <div className="bg-bg-tertiary border-l-2 border-gold p-6 rounded-r">
                  <h3 className="text-gold font-heading font-semibold mb-2">I'm going through this too.</h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    This isn't some tech company trying to cash in on your transition. I'm 11 months out from retirement myself.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-bg-tertiary border-l-2 border-gold p-6 rounded-r">
                  <h3 className="text-gold font-heading font-semibold mb-2">Fair pricing.</h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    First resume is free. Paid tiers keep the site running. That's it.
                  </p>
                </div>

                {/* Card 3 */}
                <div className="bg-bg-tertiary border-l-2 border-gold p-6 rounded-r">
                  <h3 className="text-gold font-heading font-semibold mb-2">It actually works.</h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    Upload your evals, drop in a job posting, get real output. Not a template with blanks to fill in.
                  </p>
                </div>

                {/* Card 4 */}
                <div className="bg-bg-tertiary border-l-2 border-gold p-6 rounded-r">
                  <h3 className="text-gold font-heading font-semibold mb-2">Built on real AI.</h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    The system knows MOS codes, Navy rates, military terminology. It translates, not just reformats.
                  </p>
                </div>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-gold/20 my-12" />

            {/* Section 4: Bottom Line - Highlighted Card */}
            <section className="bg-bg-secondary border border-border rounded-lg p-8">
              <h2 className="text-2xl font-heading text-white mb-6">The Bottom Line</h2>

              <p className="text-text-muted leading-relaxed text-base mb-6">
                You did the work. You earned the experience. You shouldn't have to pay a fortune or figure it out alone just to explain what you did to people who never served.
              </p>

              <p className="text-xl text-gold font-heading mb-8">
                Get Debriefed. Move out.
              </p>

              {/* CTA */}
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-bg-primary font-heading font-bold uppercase tracking-wider rounded hover:bg-gold/90 transition-colors"
              >
                Start Your Debrief →
              </Link>
            </section>

          </div>

          {/* Founder Card */}
          <div className="mt-16 p-8 bg-bg-secondary border border-border rounded-lg">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-navy border-2 border-gold flex items-center justify-center">
                <span className="text-3xl font-heading font-bold text-gold">CS</span>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-heading font-bold text-white">Chris</h3>
                <p className="text-gold font-mono text-sm">Founder, Senior Chief Petty Officer</p>
                <p className="text-text-muted mt-2">
                  20+ years U.S. Navy • Damage Controlman • MBA, PMP<br/>
                  Retiring in 2026 • Las Vegas
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-bg-secondary border-t border-border px-4 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-gold flex items-center justify-center">
              <span className="font-heading font-bold text-gold text-sm">D</span>
            </div>
            <span className="font-heading text-sm font-bold tracking-wider uppercase">Debriefed</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <Link href="/pricing" className="hover:text-gold transition-colors">Pricing</Link>
            <Link href="/help" className="hover:text-gold transition-colors">Help</Link>
            <Link href="/about" className="hover:text-gold transition-colors">About</Link>
          </div>
          <p className="text-sm text-text-dim">
            &copy; {new Date().getFullYear()} Debriefed. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
