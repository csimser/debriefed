'use client'

import { useState, useEffect } from 'react'

interface Testimonial {
  id: string
  rating: number
  comment: string
  feature_context: string
  created_at: string
}

const FEATURE_LABELS: Record<string, string> = {
  cover_letter: 'Cover Letters',
  job_match: 'Job Match',
  linkedin_headline: 'LinkedIn',
  linkedin_summary: 'LinkedIn',
  eval_upload: 'Eval Translator',
  resume_builder: 'Resume Builder',
  federal_resume: 'Federal Resume',
}

function StarRating({ rating, animate }: { rating: number; animate?: boolean }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-4 h-4 transition-colors duration-300 ${
            i <= rating ? 'text-gold' : 'text-white/20'
          }`}
          style={animate ? {
            transitionDelay: `${(i - 1) * 50}ms`,
          } : undefined}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-bg-secondary border border-border p-6 flex flex-col animate-pulse">
      <div className="flex gap-0.5 mb-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-4 h-4 rounded-sm bg-border" />
        ))}
      </div>
      <div className="space-y-2 flex-1">
        <div className="h-3 w-full rounded bg-border" />
        <div className="h-3 w-5/6 rounded bg-border" />
        <div className="h-3 w-4/6 rounded bg-border" />
      </div>
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <div className="h-3 w-24 rounded bg-border" />
        <div className="h-4 w-16 rounded bg-border" />
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loaded, setLoaded] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    fetch('/api/testimonials/featured')
      .then((r) => r.json())
      .then((data) => {
        setTestimonials(data.testimonials || [])
        setLoaded(true)
        // Trigger staggered entrance after a tick
        requestAnimationFrame(() => setAnimateIn(true))
      })
      .catch(() => setLoaded(true))
  }, [])

  // Hide section if loaded with no testimonials
  if (loaded && testimonials.length === 0) return null

  return (
    <section className="px-4 md:px-20 py-12 md:py-20 bg-bg-primary">
      <div className="text-center mb-10">
        <div className="inline-block font-mono text-[11px] uppercase tracking-wider text-gold bg-gold-dim px-4 py-2 mb-4">
          What Veterans Are Saying
        </div>
        <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-tight">
          Built by Veterans, for Veterans
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {!loaded ? (
          /* Skeleton cards while loading */
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          testimonials.map((t, idx) => (
            <div
              key={t.id}
              className={`bg-bg-secondary border border-border p-6 flex flex-col transition-all duration-300 ${
                animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <StarRating rating={t.rating} animate={animateIn} />
              <p className="text-sm text-text mt-3 flex-1 leading-relaxed">
                &ldquo;{t.comment && t.comment.length > 200
                  ? t.comment.slice(0, 200) + '...'
                  : t.comment}&rdquo;
              </p>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs text-text-muted">Verified Veteran</span>
                {FEATURE_LABELS[t.feature_context] && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gold bg-gold-dim px-2 py-0.5">
                    {FEATURE_LABELS[t.feature_context]}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
