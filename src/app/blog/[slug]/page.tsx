import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug, getAllPosts, getRelatedPosts, CATEGORY_LABELS } from '@/lib/mdx'
import { PostCard } from '@/components/blog/PostCard'
import { mdxComponents } from '@/components/blog/MdxComponents'
import { MarketingNav } from '@/components/layout/MarketingNav'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} | Debriefed`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = getRelatedPosts(slug)
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: 'Debriefed', url: 'https://getdebriefed.co' },
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Blog', item: 'https://getdebriefed.co/blog' },
      { '@type': 'ListItem', position: 2, name: CATEGORY_LABELS[post.category] || post.category, item: `https://getdebriefed.co/blog?category=${post.category}` },
      { '@type': 'ListItem', position: 3, name: post.title },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="min-h-screen bg-bg-primary flex flex-col">
        <MarketingNav />

        <main>
          {/* Post header */}
          <div className="border-b border-border">
            <div className="max-w-3xl mx-auto px-6 py-12">
              <div className="flex items-center gap-2 text-xs text-text-dim mb-8 font-mono uppercase tracking-wider">
                <Link href="/blog" className="hover:text-gold transition-colors">Blog</Link>
                <span>/</span>
                <Link href={`/blog?category=${post.category}`} className="hover:text-gold transition-colors">
                  {CATEGORY_LABELS[post.category]}
                </Link>
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight leading-tight mb-4 text-text">{post.title}</h1>
              <p className="text-text-muted text-lg leading-relaxed mb-8">{post.description}</p>
              <div className="flex items-center gap-4 text-sm text-text-dim font-mono">
                <span>{formattedDate}</span>
                <span>·</span>
                <span>{post.readingTime}</span>
                <span>·</span>
                <span>{post.author}</span>
              </div>
              {post.mosCode && (
                <div className="mt-6 inline-flex items-center gap-2 px-3 py-2 bg-gold-dim border border-gold/20">
                  <span className="text-xs text-text-dim">Related MOS:</span>
                  <Link href={`/mos/${post.mosCode.toLowerCase()}`} className="text-sm font-heading font-bold text-gold hover:text-gold-bright transition-colors">
                    MOS {post.mosCode} →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Post body */}
          <div className="max-w-3xl mx-auto px-6 py-12">
            <article className="prose prose-invert max-w-none
              prose-headings:font-heading prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-text
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-text-muted prose-p:leading-relaxed prose-p:font-body
              prose-strong:text-text
              prose-a:text-gold prose-a:no-underline hover:prose-a:underline hover:prose-a:text-gold-bright
              prose-ul:text-text-muted prose-ol:text-text-muted
              prose-li:text-text-muted
              prose-blockquote:border-l-gold prose-blockquote:bg-gold-dim prose-blockquote:text-text-muted
              prose-code:text-gold prose-code:bg-bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono
              prose-hr:border-border">
              <MDXRemote source={post.content} components={mdxComponents} />
            </article>

            {/* CTA block */}
            <div className="mt-16 p-8 bg-bg-secondary border border-border relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-[300px] h-[300px] pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(212, 168, 75, 0.08) 0%, transparent 70%)',
                }}
              />
              <div className="relative z-10">
                <div className="inline-block font-mono text-[10px] uppercase tracking-wider text-gold bg-gold-dim px-3 py-1 mb-4">
                  Start Your Mission
                </div>
                <h3 className="font-heading text-xl font-bold uppercase tracking-tight text-text mb-2">Ready to translate your service?</h3>
                <p className="text-text-muted text-sm mb-6 max-w-lg">Debriefed uses AI + a 10,000-term military dictionary to turn your evaluations into civilian-ready resumes in minutes.</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/signup" className="inline-flex items-center gap-2 px-5 py-2.5 font-heading text-sm font-bold uppercase tracking-wider bg-gold text-bg-primary hover:bg-gold-bright transition-all">
                    Get Started Free →
                  </Link>
                  <Link href="/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 font-heading text-sm font-bold uppercase tracking-wider border border-border text-text-muted hover:text-text hover:border-border-bright transition-all">
                    See Pricing
                  </Link>
                </div>
              </div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 text-xs text-text-dim border border-border bg-bg-secondary font-mono">#{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <div className="border-t border-border">
              <div className="max-w-6xl mx-auto px-6 py-12">
                <h2 className="font-mono text-[11px] uppercase tracking-wider text-text-dim mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {related.map((p) => <PostCard key={p.slug} post={p} />)}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
