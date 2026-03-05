'use client'

import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'

export function TrackedPostCTA({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <div className="my-6 not-prose">
      <Link
        href={href}
        onClick={() => trackEvent('blog_cta_clicked', { cta_href: href, cta_text: typeof children === 'string' ? children : 'cta' })}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-bg-primary font-heading font-bold text-sm uppercase tracking-wider hover:bg-gold-bright transition-colors"
      >
        {children} →
      </Link>
    </div>
  )
}
