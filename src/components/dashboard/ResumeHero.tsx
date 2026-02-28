'use client'

import Link from 'next/link'

interface ResumeHeroProps {
  resume: {
    id: string
    name: string
    template: string
    resume_type: string
    updated_at: string
  } | null
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function ResumeHero({ resume }: ResumeHeroProps) {
  if (!resume) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-border bg-bg-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-28 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-bg-secondary/50 flex-shrink-0">
            <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider mb-1">
              Build Your First Resume
            </h2>
            <p className="text-sm text-text-muted mb-4">
              Translate your military experience into a civilian-ready resume in minutes.
            </p>
            <Link
              href="/resumes"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-bg-primary font-heading font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-gold-bright transition-colors"
            >
              Create Your First Resume
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const timeAgo = getTimeAgo(resume.updated_at)
  const templateLabel = resume.template?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Resume'

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-bg-card p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Mini resume thumbnail */}
        <Link href={`/resumes/${resume.id}`} className="group flex-shrink-0">
          <div className="w-20 h-28 rounded-lg border border-border bg-white/[0.03] p-2 transition-all group-hover:border-gold/40 group-hover:shadow-[0_0_12px_rgba(212,168,75,0.15)]">
            <div className="w-full h-full flex flex-col gap-1">
              <div className="h-1.5 w-8 bg-gold/40 rounded-full" />
              <div className="h-1 w-full bg-text-muted/15 rounded-full" />
              <div className="h-1 w-4/5 bg-text-muted/15 rounded-full" />
              <div className="h-1 w-full bg-text-muted/15 rounded-full" />
              <div className="h-1 w-3/5 bg-text-muted/15 rounded-full" />
              <div className="mt-auto h-1 w-2/3 bg-text-muted/10 rounded-full" />
            </div>
          </div>
        </Link>

        <div className="text-center md:text-left flex-1 min-w-0">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
            {templateLabel} &middot; {resume.resume_type === 'federal' ? 'Federal' : 'Private'} &middot; Updated {timeAgo}
          </p>
          <h2 className="font-heading text-xl font-bold uppercase tracking-wider mb-3 truncate">
            {resume.name}
          </h2>
          <Link
            href={`/resumes/${resume.id}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-bg-primary font-heading font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-gold-bright transition-colors"
          >
            Continue Building
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
