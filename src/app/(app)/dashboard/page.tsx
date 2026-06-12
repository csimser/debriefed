'use client'

import { useEffect, useState } from 'react'
import { GovComputerBanner } from '@/components/layout/GovComputerBanner'
import { MilCalcBanner } from '@/components/layout/MilCalcBanner'
import { IncompleteProfileBanner } from '@/components/layout/IncompleteProfileBanner'
import { ResumeHero } from '@/components/dashboard/ResumeHero'
import { ProfileProgress } from '@/components/dashboard/ProfileProgress'
import { QuickStats } from '@/components/dashboard/QuickStats'
import { DashboardChecklist } from '@/components/dashboard/DashboardChecklist'
import { FullPageLoader } from '@/components/ui/FullPageLoader'
import {
  getApiKey,
  getProfile,
  listApplications,
  listExperiences,
  listResumes,
} from '@/lib/storage'
import type { Profile } from '@/lib/storage'

// Expanded profile fields for completeness — ordered by impact priority (highest first)
const PROFILE_FIELDS = [
  { key: 'rating_mos', label: 'Add your MOS to unlock tailored job matches', href: '/profile', priority: 10 },
  { key: 'professional_summary', label: 'Add a professional summary for stronger resumes', href: '/profile', priority: 8 },
  { key: 'target_role', label: 'Set your target role for better job matching', href: '/profile', priority: 7 },
  { key: 'target_industry', label: 'Set your target industry for better recommendations', href: '/profile', priority: 5 },
  { key: 'branch', label: 'Add your military branch', href: '/profile', priority: 3 },
  { key: 'rank', label: 'Add your rank', href: '/profile', priority: 3 },
  { key: 'years_of_service', label: 'Add years of service', href: '/profile', priority: 2 },
  { key: 'eas_date', label: 'Set your EAS date for transition planning', href: '/profile', priority: 2 },
  { key: 'first_name', label: 'Add your first name', href: '/profile', priority: 1 },
  { key: 'last_name', label: 'Add your last name', href: '/profile', priority: 1 },
]

function getProfileCompleteness(profile: Profile | null) {
  if (!profile) return { completeness: 0, nextAction: PROFILE_FIELDS[0] }

  const missing: typeof PROFILE_FIELDS = []
  let completed = 0

  for (const field of PROFILE_FIELDS) {
    const value = profile[field.key]
    if (value && value !== '' && value !== null) {
      completed++
    } else {
      missing.push(field)
    }
  }

  const completeness = Math.round((completed / PROFILE_FIELDS.length) * 100)
  // Highest priority missing field = most impactful next action
  const nextAction = missing.sort((a, b) => b.priority - a.priority)[0] || null

  return { completeness, nextAction }
}

interface HeroResume {
  id: string
  name: string
  template: string
  resume_type: string
  updated_at: string
}

interface DashboardState {
  displayName: string
  showIncompleteProfile: boolean
  completeness: number
  nextAction: { label: string; href: string } | null
  latestResume: HeroResume | null
  stats: { resumes: number; jobsAnalyzed: number; translations: number }
  checklist: { done: boolean; label: string; href: string }[]
}

export default function DashboardPage() {
  const [state, setState] = useState<DashboardState | null>(null)

  useEffect(() => {
    const profile = getProfile()
    const resumes = listResumes()
    const applications = listApplications()
    const experiences = listExperiences()
    const hasKey = !!getApiKey()

    const { completeness, nextAction } = getProfileCompleteness(profile)

    // listResumes() is sorted by updated_at desc
    const latest = resumes[0] || null
    const latestResume: HeroResume | null = latest
      ? {
          id: latest.id,
          name: latest.title,
          template: latest.template || 'resume',
          resume_type: latest.type || 'civilian',
          updated_at: latest.updated_at || latest.created_at || new Date().toISOString(),
        }
      : null

    const jobsAnalyzed = resumes.filter((r) => r.match_score != null).length
    const translations = experiences.reduce(
      (sum, exp) => sum + exp.bullets.filter((b) => !!b.translated_text).length,
      0,
    )

    const checklist = [
      { done: completeness >= 100, label: 'Complete your profile', href: '/profile' },
      { done: resumes.length > 0, label: 'Create a resume', href: '/resumes' },
      { done: hasKey, label: 'Connect your Anthropic API key', href: '/settings' },
      { done: jobsAnalyzed > 0, label: 'Run a job match', href: '/job-match' },
      { done: applications.length > 0, label: 'Track an application', href: '/tracker' },
    ]

    setState({
      displayName: profile?.first_name || '',
      showIncompleteProfile: !!(
        profile?.onboarding_skipped &&
        (!profile?.first_name || !profile?.last_name || !profile?.branch || !profile?.rank)
      ),
      completeness,
      nextAction,
      latestResume,
      stats: { resumes: resumes.length, jobsAnalyzed, translations },
      checklist,
    })
  }, [])

  if (!state) {
    return <FullPageLoader message="Loading dashboard..." />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wider">
          {state.displayName ? `Welcome back, ${state.displayName}` : 'Welcome back'}
        </h1>
        <p className="text-text-muted text-sm mt-1">Mission Status: Active</p>
      </div>

      {/* Banner slot — max 1 visible at a time */}
      {state.showIncompleteProfile ? (
        <IncompleteProfileBanner show />
      ) : (
        <GovComputerBanner />
      )}

      {/* MilCalc cross-promo — dismissible, independent of banner slot */}
      <MilCalcBanner />

      {/* Hero — latest resume or create CTA */}
      <ResumeHero resume={state.latestResume} />

      {/* Profile progress + Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">
        <ProfileProgress completeness={state.completeness} nextAction={state.nextAction} />
        <QuickStats stats={state.stats} />
      </div>

      {/* Mission Checklist — auto-collapses when >3 items complete */}
      <DashboardChecklist items={state.checklist} />
    </div>
  )
}
