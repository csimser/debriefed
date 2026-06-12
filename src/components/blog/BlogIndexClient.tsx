'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { PostCard } from '@/components/blog/PostCard'
import {
  CATEGORY_LABELS,
  CATEGORY_DESCRIPTIONS,
  type PostCategory,
  type PostMeta,
} from '@/lib/mdx-shared'

interface Props {
  allPosts: PostMeta[]
  featured: PostMeta[]
}

/**
 * Client half of the blog index: category filtering reads ?category= on the
 * client so the page itself can be fully static-exported.
 */
export function BlogIndexClient({ allPosts, featured }: Props) {
  const searchParams = useSearchParams()
  const activeCategory = (searchParams.get('category') as PostCategory | null) ?? undefined
  const posts = activeCategory ? allPosts.filter((p) => p.category === activeCategory) : allPosts
  const categories = Object.keys(CATEGORY_LABELS) as PostCategory[]

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-12">
        <Link
          href="/blog/"
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
            href={`/blog/?category=${cat}`}
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
  )
}
