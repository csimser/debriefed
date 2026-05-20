import Link from 'next/link'
import type { PostMeta } from '@/lib/mdx'
import { CATEGORY_LABELS } from '@/lib/mdx'

const CATEGORY_COLORS: Record<string, string> = {
  'mos-transition': 'text-status-green bg-status-green-dim border-status-green/20',
  'resume-tips': 'text-status-blue bg-status-blue-dim border-status-blue/20',
  skillbridge: 'text-status-amber bg-status-amber-dim border-status-amber/20',
  'federal-resume': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  'veteran-hiring': 'text-status-red bg-status-red-dim border-status-red/20',
}

interface Props {
  post: PostMeta
  featured?: boolean
}

export function PostCard({ post, featured }: Props) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col border bg-bg-card hover:border-border-bright transition-all duration-200 overflow-hidden ${
        featured ? 'border-gold/30 shadow-[0_0_40px_rgba(212,168,75,0.08)]' : 'border-border'
      }`}
    >
      {/* Top accent bar */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex flex-col flex-1 p-6">
        {/* Category pill */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border ${
              CATEGORY_COLORS[post.category] ?? 'text-text-dim bg-bg-secondary border-border'
            }`}
          >
            {CATEGORY_LABELS[post.category]}
          </span>
          {post.mosCode && (
            <span className="font-mono text-[10px] text-text-dim tracking-wider">
              MOS {post.mosCode}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-heading text-base font-bold uppercase tracking-wide text-text group-hover:text-gold transition-colors leading-snug mb-2 flex-1">
          {post.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-text-muted leading-relaxed line-clamp-2 mb-5 font-body">
          {post.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-text-dim pt-4 border-t border-border">
          <span>{formattedDate}</span>
          <span>{post.readingTime}</span>
        </div>
      </div>
    </Link>
  )
}
