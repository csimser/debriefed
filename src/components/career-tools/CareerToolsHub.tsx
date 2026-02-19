'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { CoverLetterTool } from './CoverLetterTool'
import { DictCoverLetterBuilder } from './DictCoverLetterBuilder'
import { LinkedInTool } from './LinkedInTool'

import { getUserTier, isPaidTier } from '@/lib/tier-utils'
import { CommunitySubmissions } from '@/components/dictionary/CommunitySubmissions'
import { getDictionaryStats, type DictionaryStats } from '@/lib/dictionary/communityQueries'

interface CareerToolsHubProps {
  userId: string
  userPlan: string
  userProfile: any
  experiences: any[]
  skills: string[]
  certifications?: any[]
  education?: any[]
  coverLetterUsage: number
  coverLetterLimit: number
  linkedinUsage: number
  linkedinLimit: number
  evalUsage?: number
  evalLimit?: number
  evalUploads?: any[]
}


export function CareerToolsHub({
  userId,
  userPlan,
  userProfile,
  experiences,
  skills,
  certifications,
  education,
  coverLetterUsage,
  coverLetterLimit,
  linkedinUsage,
  linkedinLimit,
  evalUsage = 0,
  evalLimit = 2,
  evalUploads = [],
}: CareerToolsHubProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const toolFromUrl = searchParams.get('tool')

  // Use URL param as the source of truth
  const [activeTool, setActiveToolState] = useState<string | null>(toolFromUrl)
  const [coverLetterMode, setCoverLetterMode] = useState<'dict' | 'ai'>('dict')
  const [bannerStats, setBannerStats] = useState<DictionaryStats | null>(null)
  const userTier = getUserTier({ tier: userPlan })
  const hasPaidAccess = isPaidTier(userTier)

  // Sync state with URL param changes
  useEffect(() => {
    setActiveToolState(toolFromUrl)
  }, [toolFromUrl])

  // Fetch dictionary stats for hero banner
  useEffect(() => {
    getDictionaryStats().then(setBannerStats).catch(() => {})
  }, [])

  // Update URL when changing tool
  const setActiveTool = (toolId: string | null) => {
    if (toolId) {
      router.push(`/career-tools?tool=${toolId}`)
    } else {
      router.push('/career-tools')
    }
    setActiveToolState(toolId)
  }

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wider">Cover Letter &amp; LinkedIn</h1>
        <p className="text-text-muted mt-1 text-sm md:text-base">Free tools to complete your military-to-civilian transition.</p>
      </div>

      {/* Dictionary Hero Banner */}
      {!activeTool && (
        <div className="mb-8 p-6 md:p-8 bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border-2 border-gold/30 rounded-xl">
          <h2 className="font-heading text-xl md:text-2xl font-bold uppercase tracking-wider text-gold mb-4">
            Built by Veterans. Free for Veterans.
          </h2>
          <div className="space-y-2 text-sm md:text-base text-text-muted mb-5">
            <p>Why is Debriefed free? Because our translation dictionary replaces expensive AI.</p>
            <p>
              Veterans like you contribute military-to-civilian translations. That dictionary powers every tool on this platform — resume building, job matching, cover letters, LinkedIn optimization — at zero cost.
            </p>
            <p className="font-semibold text-text">
              The more you contribute, the better it gets for every veteran walking off base.
            </p>
          </div>

          {/* Stats line */}
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs md:text-sm text-text-muted mb-6">
            <span>
              <span className="mr-1">📖</span>
              <span className="font-bold text-text">10,000+</span> translations
            </span>
            <span>
              <span className="mr-1">👥</span>
              <span className="font-bold text-text">
                {bannerStats && bannerStats.contributorCount > 0 ? bannerStats.contributorCount : 1}
              </span> veteran{bannerStats && bannerStats.contributorCount > 1 ? 's' : ''} contributing
            </span>
            <span>
              <span className="mr-1">🆓</span>
              <span className="font-bold text-text">100%</span> free core features
            </span>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTool('community')}
              className="px-5 py-2.5 bg-gold text-bg-primary rounded-lg font-heading font-bold uppercase text-sm tracking-wider hover:bg-gold-bright transition-colors"
            >
              Contribute a Translation
            </button>
            <button
              onClick={() => document.getElementById('career-tools-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-5 py-2.5 border border-gold/40 text-gold rounded-lg font-heading font-bold uppercase text-sm tracking-wider hover:bg-gold/10 transition-colors"
            >
              See How It Works
            </button>
          </div>
        </div>
      )}

      {/* Feature Sections */}
      {!activeTool && (
        <div id="career-tools-grid" className="space-y-6">
          {/* ── Section 1: Cover Letter Builder ── */}
          <Card className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <span className="text-gold text-xl">✉</span>
                <h3 className="font-heading text-base md:text-lg font-bold uppercase tracking-wider">Cover Letter Builder</h3>
                <span className="px-2 py-0.5 bg-status-green/20 text-status-green text-[10px] font-bold rounded-full uppercase tracking-wider">Free</span>
              </div>
              <button
                onClick={() => setActiveTool('cover-letter')}
                className="px-5 py-2.5 bg-gold text-bg-primary rounded-lg font-heading font-bold uppercase text-sm tracking-wider hover:bg-gold-bright transition-colors hidden sm:block"
              >
                Build Now →
              </button>
            </div>
            <p className="text-sm text-text-muted mb-5">Dictionary-powered cover letters tailored to any job posting</p>

            <ul className="space-y-2 mb-5">
              <li className="flex items-start gap-2 text-sm text-text-muted">
                <span className="text-gold mt-0.5">•</span>
                Matches your military experience to the job&apos;s requirements
              </li>
              <li className="flex items-start gap-2 text-sm text-text-muted">
                <span className="text-gold mt-0.5">•</span>
                Auto-fills your rank, certifications, and clearance
              </li>
              <li className="flex items-start gap-2 text-sm text-text-muted">
                <span className="text-gold mt-0.5">•</span>
                Ready in under 2 minutes — no writing from scratch
              </li>
            </ul>

            {/* Sample output */}
            <div className="bg-bg-primary rounded-lg p-4 border-l-3 border-gold" style={{ borderLeft: '3px solid var(--color-primary)' }}>
              <p className="text-sm text-text-muted italic leading-relaxed">
                &ldquo;With 20 years leading Navy damage control operations and a proven track record in risk management and cross-functional team leadership, I bring the strategic oversight and operational discipline your organization needs...&rdquo;
              </p>
            </div>

            {/* Mobile CTA */}
            <button
              onClick={() => setActiveTool('cover-letter')}
              className="mt-5 w-full px-5 py-3 bg-gold text-bg-primary rounded-lg font-heading font-bold uppercase text-sm tracking-wider hover:bg-gold-bright transition-colors sm:hidden"
            >
              Build Now →
            </button>
          </Card>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* ── Section 2: LinkedIn Optimizer ── */}
          <Card className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <span className="text-gold text-xl">◎</span>
                <h3 className="font-heading text-base md:text-lg font-bold uppercase tracking-wider">LinkedIn Optimizer</h3>
                <span className="px-2 py-0.5 bg-status-green/20 text-status-green text-[10px] font-bold rounded-full uppercase tracking-wider">Free</span>
              </div>
              <button
                onClick={() => setActiveTool('linkedin')}
                className="px-5 py-2.5 bg-gold text-bg-primary rounded-lg font-heading font-bold uppercase text-sm tracking-wider hover:bg-gold-bright transition-colors hidden sm:block"
              >
                Optimize Now →
              </button>
            </div>
            <p className="text-sm text-text-muted mb-5">Turn your service record into a profile recruiters actually find</p>

            <ul className="space-y-2 mb-5">
              <li className="flex items-start gap-2 text-sm text-text-muted">
                <span className="text-gold mt-0.5">•</span>
                Rewrites your headline with civilian keywords recruiters search
              </li>
              <li className="flex items-start gap-2 text-sm text-text-muted">
                <span className="text-gold mt-0.5">•</span>
                Translates your military experience into LinkedIn language
              </li>
              <li className="flex items-start gap-2 text-sm text-text-muted">
                <span className="text-gold mt-0.5">•</span>
                Scores your current profile and shows exactly what to fix
              </li>
            </ul>

            {/* Sample output — before/after */}
            <div className="bg-bg-primary rounded-lg p-4 space-y-2" style={{ borderLeft: '3px solid var(--color-primary)' }}>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-text-dim font-semibold shrink-0">Before:</span>
                <span className="text-text-dim">&ldquo;DC1(SW) | United States Navy&rdquo;</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-gold font-semibold shrink-0">After:</span>
                <span className="text-text">&ldquo;Senior Operations Manager | Risk &amp; Safety | 20 Yrs&rdquo;</span>
              </div>
            </div>

            {/* Mobile CTA */}
            <button
              onClick={() => setActiveTool('linkedin')}
              className="mt-5 w-full px-5 py-3 bg-gold text-bg-primary rounded-lg font-heading font-bold uppercase text-sm tracking-wider hover:bg-gold-bright transition-colors sm:hidden"
            >
              Optimize Now →
            </button>
          </Card>
        </div>
      )}

      {/* Active Tool — Cover Letter */}
      {activeTool === 'cover-letter' && coverLetterMode === 'dict' && (
        <DictCoverLetterBuilder
          userProfile={userProfile}
          experiences={experiences}
          skills={skills}
          certifications={certifications}
          education={education}
          onBack={() => { setActiveTool(null); setCoverLetterMode('dict') }}
          onSwitchToAI={() => setCoverLetterMode('ai')}
          aiRemaining={coverLetterLimit - coverLetterUsage}
          userPlan={userPlan}
        />
      )}

      {activeTool === 'cover-letter' && coverLetterMode === 'ai' && (
        <CoverLetterTool
          userId={userId}
          userPlan={userPlan}
          userProfile={userProfile}
          experiences={experiences}
          skills={skills}
          currentUsage={coverLetterUsage}
          usageLimit={coverLetterLimit}
          onBack={() => setCoverLetterMode('dict')}
        />
      )}

      {activeTool === 'linkedin' && (
        <LinkedInTool
          userProfile={userProfile}
          experiences={experiences}
          skills={skills}
          certifications={certifications}
          education={education}
          isPro={hasPaidAccess}
          userTier={userTier}
          currentUsage={linkedinUsage}
          usageLimit={linkedinLimit}
          onBack={() => setActiveTool(null)}
        />
      )}

      {/* Active Tool — Community Dictionary */}
      {activeTool === 'community' && (
        <div className="space-y-6">
          <button
            onClick={() => setActiveTool(null)}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-gold transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tools
          </button>

          <div>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider mb-1">Community Dictionary</h2>
            <p className="text-text-muted text-sm">Submit military terms, view your submissions, and see what others need translated</p>
          </div>

          <CommunitySubmissions userBranch={userProfile?.branch} />
        </div>
      )}
    </div>
  )
}
