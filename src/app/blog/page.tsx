import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getAllPosts, getFeaturedPosts } from '@/lib/mdx'
import { BlogIndexClient } from '@/components/blog/BlogIndexClient'
import { MarketingNav } from '@/components/layout/MarketingNav'

export const metadata: Metadata = {
  title: 'Debriefed Blog — Military Transition Resources',
  description: 'Expert guides on translating military experience to civilian careers. MOS transition guides, resume tips, SkillBridge, federal resumes, and veteran hiring programs.',
  openGraph: {
    title: 'Debriefed Blog — Military Transition Resources',
    description: 'Expert guides on translating military experience to civilian careers.',
    type: 'website',
  },
}

export default function BlogIndexPage() {
  // Posts are read from content/blog at build time; the category filter
  // (?category=) is applied client-side so this page static-exports.
  const allPosts = getAllPosts()
  const featured = getFeaturedPosts()

  return (
    <>
      <MarketingNav currentPage={undefined} />
      <main className="min-h-screen bg-bg-primary">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-dim border border-gold text-gold text-xs font-heading font-bold uppercase tracking-widest mb-6">
              Transition Intelligence
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-text uppercase tracking-wider mb-4 leading-tight">
              From Uniform<br />
              <span className="text-gold">to Opportunity</span>
            </h1>
            <p className="text-lg text-text-muted max-w-xl leading-relaxed font-body">
              Tactical guides for translating 4, 8, or 20 years of military service
              into a civilian career that respects what you built.
            </p>
          </div>
        </section>

        <Suspense fallback={<div className="max-w-6xl mx-auto px-6 py-12" />}>
          <BlogIndexClient allPosts={allPosts} featured={featured} />
        </Suspense>
      </main>
    </>
  )
}
