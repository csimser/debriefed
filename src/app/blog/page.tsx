import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts, getFeaturedPosts, getPostsByCategory, CATEGORY_LABELS, CATEGORY_DESCRIPTIONS, type PostCategory } from '@/lib/mdx'
import { PostCard } from '@/components/blog/PostCard'
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

interface Props {
  searchParams: Promise<{ category?: PostCategory }>
}

export default async function BlogIndexPage({ searchParams }: Props) {
  const { category: activeCategory } = await searchParams
  const featured = getFeaturedPosts()
  const posts = activeCategory ? getPostsByCategory(activeCategory) : getAllPosts()
  const categories = Object.keys(CATEGORY_LABELS) as PostCategory[]

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

        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-12">
            <Link
              href="/blog"
              className={`px-4 py-2 rounded font-heading text-xs font-bold uppercase tracking-wider transition-all border ${
                !activeCategory
                  ? 'bg-gold text-bg-primary border-gold'
                  : 'text-text-muted border-border hover:border-border-bright hover:text-text'
              }`}
            >
              All Posts
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/blog?category=${cat}`}
                className={`px-4 py-2 rounded font-heading text-xs font-bold uppercase tracking-wider transition-all border ${
                  activeCategory === cat
                    ? 'bg-gold text-bg-primary border-gold'
                    : 'text-text-muted border-border hover:border-border-bright hover:text-text'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </Link>
            ))}
          </div>

          {/* Featured posts */}
          {!activeCategory && featured.length > 0 && (
            <section className="mb-16">
              <h2 className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-text-muted mb-6">
                Featured
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featured.map((post) => (
                  <PostCard key={post.slug} post={post} featured />
                ))}
              </div>
            </section>
          )}

          {/* Category header */}
          {activeCategory && (
            <div className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-text uppercase tracking-wider mb-2">
                {CATEGORY_LABELS[activeCategory]}
              </h2>
              <p className="text-text-muted text-sm font-body">
                {CATEGORY_DESCRIPTIONS[activeCategory]}
              </p>
            </div>
          )}

          {/* Posts grid */}
          {posts.length === 0 ? (
            <div className="text-center py-24 text-text-muted">
              <p className="text-lg font-heading uppercase tracking-wider">No posts yet in this category.</p>
              <p className="text-sm mt-2 font-body">Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
