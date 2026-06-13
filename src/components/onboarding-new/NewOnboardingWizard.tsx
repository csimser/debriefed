'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  listCertifications,
  listEducation,
  listExperiences,
  listSkills,
  saveProfile,
  saveSettings,
} from '@/lib/storage'
import type { Profile } from '@/lib/storage'
import { ProgressBar, STEPS } from './ProgressBar'
import { StepWelcome } from './StepWelcome'
import { StepQuickProfile } from './StepQuickProfile'
import { StepExperience } from './StepExperience'
import { StepFinish } from './StepFinish'

export interface OnboardingData {
  // Contact
  first_name: string
  last_name: string
  email: string
  phone: string
  city: string
  state: string
  linkedin_url: string
  // Military
  branch: string
  rank: string
  paygrade: string
  rating_mos: string
  years_of_service: string
  clearance: string
  eas_date: string
  // Career
  target_industry: string
  target_role: string
  job_search_timeline: string
  professional_summary: string
  // Experiences (stored separately but tracked here)
  experiences: any[]
  // Skills & Certs (stored separately but tracked here)
  skills: any[]
  certifications: any[]
  // Education (stored separately but tracked here)
  education: any[]
  // MOS suggestions from crosswalk
  suggested_titles: string[]
  suggested_skills: string[]
  suggested_certs: string[]
}

interface NewOnboardingWizardProps {
  existingProfile: Profile | null
}

/**
 * Map legacy 7-step onboarding values to new 4-step flow.
 * Old: 0=Welcome, 1=Contact, 2=Military, 3=Experience, 4=Skills, 5=Education, 6=Summary
 * New: 0=Welcome, 1=Quick Profile, 2=Experience, 3=Finish
 */
function mapLegacyStep(savedStep: number): number {
  if (savedStep <= 0) return 0
  if (savedStep <= 2) return 1  // Contact or Military → Quick Profile
  if (savedStep === 3) return 2 // Experience → Experience
  return 3                      // Skills, Education, Summary → Finish
}

export function NewOnboardingWizard({ existingProfile }: NewOnboardingWizardProps) {
  const router = useRouter()

  const [step, setStep] = useState(() =>
    mapLegacyStep(Number(existingProfile?.onboarding_step ?? 0) || 0),
  )
  const [saving, setSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)

  // Wizard is only mounted client-side (the onboarding page gates render
  // behind a mount effect), so localStorage reads here are safe.
  const [data, setData] = useState<OnboardingData>(() => ({
    first_name: existingProfile?.first_name || '',
    last_name: existingProfile?.last_name || '',
    email: existingProfile?.email || '',
    phone: existingProfile?.phone || '',
    city: existingProfile?.city || '',
    state: existingProfile?.state || '',
    linkedin_url: existingProfile?.linkedin_url || '',
    branch: existingProfile?.branch || '',
    rank: existingProfile?.rank || '',
    paygrade: existingProfile?.paygrade || '',
    rating_mos: existingProfile?.rating_mos || '',
    years_of_service: existingProfile?.years_of_service?.toString() || '',
    clearance: existingProfile?.clearance || '',
    eas_date: (existingProfile?.eas_date as string) || '',
    target_industry: existingProfile?.target_industry || '',
    target_role: existingProfile?.target_role || '',
    job_search_timeline: (existingProfile?.job_search_timeline as string) || '',
    professional_summary: existingProfile?.professional_summary || '',
    experiences: listExperiences(),
    skills: listSkills(),
    certifications: listCertifications(),
    education: listEducation(),
    suggested_titles: [],
    suggested_skills: [],
    suggested_certs: [],
  }))

  // Re-read related collections from storage (after resume import etc.)
  const loadRelatedData = useCallback(() => {
    setData(prev => ({
      ...prev,
      experiences: listExperiences(),
      skills: listSkills(),
      certifications: listCertifications(),
      education: listEducation(),
    }))
  }, [])

  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }, [])

  // Build the profile patch from wizard state — includes ALL profile fields
  // so nothing entered so far is lost.
  const buildProfilePatch = useCallback((): Partial<Profile> => {
    const patch: Partial<Profile> = {
      phone: data.phone || null,
      city: data.city || null,
      state: data.state || null,
      linkedin_url: data.linkedin_url || null,
      branch: data.branch || null,
      rank: data.rank || null,
      paygrade: data.paygrade || null,
      rating_mos: data.rating_mos || null,
      years_of_service: data.years_of_service ? parseInt(data.years_of_service) : null,
      clearance: data.clearance || null,
      eas_date: data.eas_date || null,
      target_industry: data.target_industry || null,
      target_role: data.target_role || null,
      job_search_timeline: data.job_search_timeline || null,
      professional_summary: data.professional_summary || null,
    }
    // Include name/email only when present (don't wipe earlier values)
    if (data.first_name) patch.first_name = data.first_name
    if (data.last_name) patch.last_name = data.last_name
    if (data.email) patch.email = data.email
    return patch
  }, [data])

  const saveProgress = useCallback(async (nextStep: number) => {
    setSaving(true)
    try {
      saveProfile({ ...buildProfilePatch(), onboarding_step: nextStep })
      setShowSaved(true)
      setTimeout(() => setShowSaved(false), 2000)
    } catch (error) {
      console.error('[onboarding] saveProgress exception:', error)
    } finally {
      setSaving(false)
    }
  }, [buildProfilePatch])

  const handleNext = useCallback(async () => {
    if (step < STEPS.length - 1) {
      await saveProgress(step + 1)
      setStep(step + 1)
      window.scrollTo(0, 0)
    }
  }, [step, saveProgress])

  const handleBack = useCallback(() => {
    if (step > 0) {
      setStep(step - 1)
      window.scrollTo(0, 0)
    }
  }, [step])

  const handleSkip = useCallback(async () => {
    setSaving(true)
    try {
      saveProfile({
        ...buildProfilePatch(),
        onboarding_completed: true,
        onboarding_skipped: true,
        onboarding_step: STEPS.length,
      })
      saveSettings({ onboarding_completed: true })
      router.push('/dashboard')
    } catch (error) {
      console.error('[onboarding] handleSkip exception:', error)
    } finally {
      setSaving(false)
    }
  }, [buildProfilePatch, router])

  const handleComplete = useCallback(async () => {
    setSaving(true)
    try {
      saveProfile({
        ...buildProfilePatch(),
        onboarding_completed: true,
        onboarding_skipped: false,
        onboarding_step: STEPS.length,
      })
      saveSettings({ onboarding_completed: true })
    } catch (error) {
      console.error('[onboarding] handleComplete exception:', error)
    } finally {
      setSaving(false)
    }
  }, [buildProfilePatch])

  // Jump to a specific step (for resume import)
  const jumpToStep = useCallback(async (targetStep: number) => {
    await saveProgress(targetStep)
    setStep(targetStep)
    window.scrollTo(0, 0)
  }, [saveProgress])

  const stepProps = {
    data,
    updateData,
    onNext: handleNext,
    onBack: handleBack,
    onComplete: handleComplete,
    onSkip: handleSkip,
    jumpToStep,
    saving,
    loadRelatedData,
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      {/* Header */}
      <div className="bg-bg-secondary border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold rounded flex items-center justify-center">
              <span className="font-heading font-bold text-bg-primary text-lg">D</span>
            </div>
            <span className="font-heading font-bold text-lg tracking-wide">DEBRIEFED</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <ProgressBar currentStep={step} />
        {showSaved && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-status-green flex items-center gap-1 animate-fade-in">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Saved
          </div>
        )}
      </div>

      {/* Step Content */}
      <div className="flex-1 py-6 px-4">
        <div className="max-w-2xl mx-auto">
          {step === 0 && <StepWelcome {...stepProps} />}
          {step === 1 && <StepQuickProfile {...stepProps} />}
          {step === 2 && <StepExperience {...stepProps} />}
          {step === 3 && <StepFinish {...stepProps} />}
        </div>
      </div>
    </div>
  )
}
