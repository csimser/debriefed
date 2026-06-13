'use client'

import Link from 'next/link'

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
        className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-bg-primary font-heading font-bold text-sm uppercase tracking-wider hover:bg-gold-bright transition-colors"
      >
        {children} →
      </Link>
    </div>
  )
}
