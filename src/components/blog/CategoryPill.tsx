import Link from 'next/link'
import type { PostCategory } from '@/lib/mdx'
import { CATEGORY_LABELS } from '@/lib/mdx'

const CATEGORY_COLORS: Record<PostCategory, string> = {
  'mos-transition': 'text-status-green bg-status-green-dim border-status-green/20 hover:bg-status-green/20',
  'resume-tips': 'text-status-blue bg-status-blue-dim border-status-blue/20 hover:bg-status-blue/20',
  skillbridge: 'text-status-amber bg-status-amber-dim border-status-amber/20 hover:bg-status-amber/20',
  'federal-resume': 'text-purple-400 bg-purple-400/10 border-purple-400/20 hover:bg-purple-400/20',
  'veteran-hiring': 'text-status-red bg-status-red-dim border-status-red/20 hover:bg-status-red/20',
}

export function CategoryPill({ category }: { category: PostCategory }) {
  return (
    <Link
      href={`/blog?category=${category}`}
      className={`inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest border transition-colors ${CATEGORY_COLORS[category]}`}
    >
      {CATEGORY_LABELS[category]}
    </Link>
  )
}
