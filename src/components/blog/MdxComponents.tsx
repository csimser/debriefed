import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'

// Callout boxes
function Callout({
  type = 'info',
  title,
  children,
}: {
  type?: 'info' | 'warning' | 'tip' | 'example'
  title?: string
  children: React.ReactNode
}) {
  const styles = {
    info: 'border-status-blue/30 bg-status-blue-dim text-status-blue',
    warning: 'border-status-amber/30 bg-status-amber-dim text-status-amber',
    tip: 'border-status-green/30 bg-status-green-dim text-status-green',
    example: 'border-purple-500/30 bg-purple-500/5 text-purple-400',
  }
  const icons = { info: 'ℹ', warning: '⚠', tip: '💡', example: '📋' }

  return (
    <div className={`my-6 p-4 border ${styles[type]} not-prose`}>
      <div className="flex items-start gap-3">
        <span className="text-lg">{icons[type]}</span>
        <div>
          {title && <p className="font-heading font-bold text-sm mb-1 uppercase tracking-wider">{title}</p>}
          <div className="text-sm text-text-muted leading-relaxed font-body">{children}</div>
        </div>
      </div>
    </div>
  )
}

// Before/after translation example
function TranslationExample({
  military,
  civilian,
}: {
  military: string
  civilian: string
}) {
  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-3 not-prose">
      <div className="p-4 border border-status-red/20 bg-status-red-dim">
        <p className="text-[10px] font-bold uppercase tracking-widest text-status-red/60 mb-2 font-mono">
          Military Language
        </p>
        <p className="text-sm text-text-muted leading-relaxed italic font-body">&ldquo;{military}&rdquo;</p>
      </div>
      <div className="p-4 border border-status-green/20 bg-status-green-dim">
        <p className="text-[10px] font-bold uppercase tracking-widest text-status-green/60 mb-2 font-mono">
          Civilian Translation
        </p>
        <p className="text-sm text-text-muted leading-relaxed italic font-body">&ldquo;{civilian}&rdquo;</p>
      </div>
    </div>
  )
}

// Stat highlight
function StatBlock({
  stat,
  label,
  source,
}: {
  stat: string
  label: string
  source?: string
}) {
  return (
    <div className="my-4 inline-flex flex-col items-start p-4 border border-gold/20 bg-gold-dim not-prose">
      <span className="text-3xl font-heading font-bold text-gold">{stat}</span>
      <span className="text-sm text-text-muted mt-1 font-body">{label}</span>
      {source && <span className="text-[10px] text-text-dim mt-1 font-mono">Source: {source}</span>}
    </div>
  )
}

// CTA button inside post
function PostCTA({
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

export const mdxComponents: MDXComponents = {
  Callout,
  TranslationExample,
  StatBlock,
  PostCTA,
  // Style table
  table: (props) => (
    <div className="overflow-x-auto my-6 not-prose">
      <table className="w-full text-sm border-collapse" {...props} />
    </div>
  ),
  th: ({ children }) => (
    <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-text-dim border-b border-border font-mono">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-text-muted border-b border-border font-body">{children}</td>
  ),
}
