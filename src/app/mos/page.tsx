import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingNav } from '@/components/layout/MarketingNav'
import { MarketingFooter } from '@/components/mos/MOSPageContent'
import { MOSIndexSearch } from '@/components/mos/MOSIndexSearch'
import { getAllMOSEntries } from '@/lib/mos-page-data'

export const metadata: Metadata = {
  title: 'Military MOS, Rating and AFSC to Civilian Career Guide — Debriefed',
  description:
    'Browse 585+ military occupation codes (MOS, ratings, AFSCs, NECs) with civilian career translations, O*NET crosswalk data, and resume examples. Free military-to-civilian career guide.',
  openGraph: {
    title: 'Military MOS, Rating and AFSC to Civilian Career Guide — Debriefed',
    description: 'Browse 585+ military occupation codes with civilian career translations and resume examples.',
    type: 'website',
    url: 'https://getdebriefed.co/mos',
  },
}

export default async function MOSIndexPage() {
  const entries = await getAllMOSEntries()

  const branchCounts: Record<string, number> = {}
  for (const e of entries) {
    branchCounts[e.branch] = (branchCounts[e.branch] || 0) + 1
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <MarketingNav currentPage={undefined} />

      {/* Hero */}
      <section className="px-4 md:px-12 py-12 md:py-20 relative overflow-hidden">
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: 'linear-gradient(90deg, #2a3040 1px, transparent 1px), linear-gradient(#2a3040 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)',
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-gold-dim border border-gold mb-6">
            <span className="text-gold text-[8px]">&#9670;</span>
            <span className="font-mono text-xs text-gold">CAREER INTELLIGENCE DATABASE</span>
          </div>

          <h1 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-wide leading-tight mb-4">
            Military to Civilian <span className="text-gold">Career Guide</span>
          </h1>
          <p className="text-lg text-text-muted max-w-2xl mb-6 leading-relaxed">
            Every MOS, rating, AFSC, and NEC translated to civilian careers. Search by code or job title
            to find your civilian path.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 text-sm font-mono text-text-muted">
            <span><span className="text-gold font-bold">{entries.length}</span> occupation codes</span>
            <span><span className="text-gold font-bold">{Object.keys(branchCounts).length}</span> service branches</span>
            <span>O*NET crosswalk data</span>
          </div>
        </div>
      </section>

      {/* Search + MOS Listings */}
      <section className="flex-1 bg-bg-primary px-4 md:px-12 pb-16">
        <div className="max-w-6xl mx-auto">
          <MOSIndexSearch entries={entries} />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bg-secondary border-t border-border px-4 md:px-12 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-gold-dim border border-gold mb-6">
            <span className="text-gold text-[8px]">&#9670;</span>
            <span className="font-mono text-xs text-gold">BEGIN YOUR TRANSITION</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
            Ready to Translate <span className="text-gold">Your Service?</span>
          </h2>
          <p className="text-base text-text-muted mb-8 leading-relaxed">
            Our AI-powered tools translate your military experience into a resume that civilian
            hiring managers understand. Start building for free.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 font-heading text-base font-bold uppercase tracking-wider bg-gold text-bg-primary hover:bg-gold-bright rounded transition-all"
          >
            Start Free &rarr;
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
