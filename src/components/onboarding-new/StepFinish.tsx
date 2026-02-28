'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { SUMMARY_TEMPLATES, getTemplatesByCategory } from '@/lib/summaryTemplates'
import { populateTemplate, cleanTemplateOutput, buildProfileDataFromForm } from '@/lib/populateTemplate'
import { OnboardingData } from './NewOnboardingWizard'

const CONFETTI_COLORS = ['#d4a84b', '#e4bc5e', '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

function Confetti() {
  const pieces = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 1.2}s`,
      duration: `${1.8 + Math.random() * 1.2}s`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 6 + Math.random() * 8,
      shape: i % 3, // 0=square, 1=circle, 2=rectangle
    })),
  [])

  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            backgroundColor: p.color,
            width: p.shape === 2 ? p.size * 0.5 : p.size,
            height: p.size,
            borderRadius: p.shape === 1 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  )
}

interface StepFinishProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onComplete: () => void
  onBack: () => void
  onSkip: () => void
  saving: boolean
  userId: string
  supabase: any
  planIntent?: string | null
}

export function StepFinish({ data, updateData, onComplete, onBack, onSkip, saving, userId, supabase, planIntent }: StepFinishProps) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)
  const [completed, setCompleted] = useState(false)
  const [generatingSummary, setGeneratingSummary] = useState(false)

  // Profile completeness checks
  const completenessChecks = [
    { label: 'Name set', done: !!(data.first_name && data.last_name) },
    { label: 'Contact info', done: !!(data.phone || data.city) },
    { label: 'Military background', done: !!(data.branch && data.paygrade) },
    { label: 'Work experience', done: data.experiences.length > 0 },
    { label: 'Target role', done: !!data.target_role },
  ]
  const completenessPercent = Math.round((completenessChecks.filter(c => c.done).length / completenessChecks.length) * 100)

  // Auto-generate professional summary on mount
  const generateSummary = useCallback(async () => {
    if (data.professional_summary) return // Already has a summary
    setGeneratingSummary(true)

    try {
      const profileData = buildProfileDataFromForm(data, data.certifications, data.skills, data.education)

      // Find best matching template
      const hasLeadershipExp = data.experiences.some((exp: any) => {
        const title = (exp.job_title || '').toLowerCase()
        return /chief|supervisor|manager|director|lead|officer|nco|senior/i.test(title)
      })

      let templates = hasLeadershipExp
        ? getTemplatesByCategory('leadership')
        : getTemplatesByCategory('operations')

      if (templates.length === 0) {
        templates = getTemplatesByCategory('general')
      }
      if (templates.length === 0 && SUMMARY_TEMPLATES.length > 0) {
        templates = [SUMMARY_TEMPLATES[0]]
      }

      if (templates.length > 0) {
        const template = templates[0]
        let summary = populateTemplate(template.template, profileData)
        summary = cleanTemplateOutput(summary)

        if (summary && summary.length > 30) {
          updateData({ professional_summary: summary })

          // Save to DB
          await supabase
            .from('profiles')
            .update({
              professional_summary: summary,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId)
        }
      }
    } catch (error) {
      console.error('Error generating summary:', error)
    } finally {
      setGeneratingSummary(false)
    }
  }, [data, updateData, supabase, userId])

  useEffect(() => {
    generateSummary()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle completion
  const handleFinish = useCallback(async () => {
    await onComplete()
    setCompleted(true)
  }, [onComplete])

  // Auto-redirect countdown after completion
  useEffect(() => {
    if (!completed) return
    if (countdown <= 0) {
      router.push('/resumes?new=true')
      return
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [completed, countdown, router])

  const [showConfetti, setShowConfetti] = useState(false)

  // Trigger confetti on completion
  useEffect(() => {
    if (completed) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [completed])

  if (completed) {
    return (
      <div className="text-center py-12 relative">
        {showConfetti && <Confetti />}
        <div className="text-6xl mb-6 animate-success-pop">&#127881;</div>
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wider mb-3 animate-fade-in">
          You&apos;re Ready to Translate Your Service
        </h1>
        <p className="text-text-muted mb-8">
          Your profile is set up. Let&apos;s turn your experience into a resume that lands interviews.
        </p>

        <button
          onClick={() => router.push('/resumes?new=true')}
          className="w-full max-w-md mx-auto py-4 bg-gold text-bg-primary font-heading text-lg font-bold uppercase tracking-wider rounded-lg hover:bg-gold-bright transition-all mb-4 block"
        >
          Build My First Resume →
        </button>

        <p className="text-text-dim text-sm">
          Redirecting in {countdown}s...{' '}
          <button onClick={() => router.push(planIntent ? `/dashboard?plan=${planIntent}` : '/dashboard')} className="text-gold hover:underline">
            Go to dashboard
          </button>
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">&#9989;</div>
        <h2 className="font-heading text-2xl font-bold uppercase tracking-wider mb-2">
          Almost Done
        </h2>
        <p className="text-text-muted">
          Review your profile setup and start building your resume
        </p>
      </div>

      {/* Profile Completeness */}
      <div className="bg-bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="font-heading text-sm font-bold uppercase tracking-wider">Profile Completeness</span>
          <span className="font-heading text-2xl font-bold text-gold">{completenessPercent}%</span>
        </div>
        <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden mb-4">
          <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${completenessPercent}%` }} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {completenessChecks.map((check) => (
            <div key={check.label} className="flex items-center gap-2 text-sm">
              <span className={check.done ? 'text-status-green' : 'text-text-dim'}>
                {check.done ? '\u2713' : '\u25CB'}
              </span>
              <span className={check.done ? 'text-text' : 'text-text-dim'}>{check.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Preview */}
      {(data.professional_summary || generatingSummary) && (
        <div className="bg-bg-card border border-border rounded-lg p-6 mb-6">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gold mb-3">
            Auto-Generated Summary
          </h3>
          {generatingSummary ? (
            <div className="animate-pulse space-y-2">
              <div className="h-3 bg-text-dim/10 rounded w-full"></div>
              <div className="h-3 bg-text-dim/10 rounded w-[95%]"></div>
              <div className="h-3 bg-text-dim/10 rounded w-[88%]"></div>
            </div>
          ) : (
            <>
              <p className="text-sm text-text-muted leading-relaxed line-clamp-4">
                {data.professional_summary}
              </p>
              <p className="text-xs text-text-dim mt-2">
                You can edit this later on your profile page.
              </p>
            </>
          )}
        </div>
      )}

      {/* What&apos;s Next */}
      <div className="bg-gold/10 border border-gold/30 rounded-lg p-6 mb-6">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gold mb-3">
          What Happens Next
        </h3>
        <ul className="space-y-2 text-sm text-text-muted">
          <li className="flex items-start gap-2">
            <span className="text-gold">1.</span>
            <span>We&apos;ll take you to the resume builder</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold">2.</span>
            <span>Your profile data auto-fills the resume</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold">3.</span>
            <span>Add skills, education, and certs from your profile page anytime</span>
          </li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={onBack}>
          &#8592; Back
        </Button>
        <Button onClick={handleFinish} disabled={saving}>
          {saving ? 'Saving...' : 'Finish & Build Resume \u2192'}
        </Button>
      </div>

      <div className="text-center mt-4">
        <button
          onClick={onSkip}
          disabled={saving}
          className="text-sm text-text-dim hover:text-text-muted hover:underline transition-colors"
        >
          Skip for now — I&apos;ll complete my profile later
        </button>
      </div>
    </div>
  )
}
