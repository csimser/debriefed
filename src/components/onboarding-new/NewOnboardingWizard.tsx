'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ProgressBar, STEPS } from './ProgressBar'
import { StepWelcome } from './StepWelcome'
import { StepContact } from './StepContact'
import { StepMilitary } from './StepMilitary'
import { StepExperience } from './StepExperience'
import { StepSkills } from './StepSkills'
import { StepEducation } from './StepEducation'
import { StepSummary } from './StepSummary'

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
  userId: string
  currentStep: number
  existingProfile: any
}

export function NewOnboardingWizard({ userId, currentStep, existingProfile }: NewOnboardingWizardProps) {
  const router = useRouter()
  const supabase = createClient()

  // Map old step numbers to new (7 steps now)
  const mappedStep = Math.min(currentStep, STEPS.length - 1)
  const [step, setStep] = useState(mappedStep)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const [data, setData] = useState<OnboardingData>({
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
    eas_date: existingProfile?.eas_date || '',
    target_industry: existingProfile?.target_industry || '',
    target_role: existingProfile?.target_role || '',
    job_search_timeline: existingProfile?.job_search_timeline || '',
    professional_summary: existingProfile?.professional_summary || '',
    experiences: [],
    skills: [],
    certifications: [],
    education: [],
    suggested_titles: [],
    suggested_skills: [],
    suggested_certs: [],
  })

  // Reusable function to load related-table data from DB
  const loadRelatedData = useCallback(async () => {
    try {
      const { data: experiences } = await supabase
        .from('experience')
        .select('*, experience_bullets(*)')
        .eq('user_id', userId)
        .order('sort_order')

      const { data: skills } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', userId)
        .order('sort_order')

      const { data: certifications } = await supabase
        .from('certifications')
        .select('*')
        .eq('user_id', userId)
        .order('sort_order')

      const { data: education } = await supabase
        .from('education')
        .select('*')
        .eq('user_id', userId)
        .order('sort_order')

      setData(prev => ({
        ...prev,
        experiences: experiences?.map(e => ({ ...e, bullets: e.experience_bullets })) || [],
        skills: skills || [],
        certifications: certifications || [],
        education: education || [],
      }))
    } catch (error) {
      console.error('Error loading onboarding data:', error)
    }
  }, [userId, supabase])

  // Load existing data on mount
  useEffect(() => {
    loadRelatedData().finally(() => setLoading(false))
  }, [loadRelatedData])

  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }, [])

  const saveProgress = useCallback(async (nextStep: number) => {
    setSaving(true)
    try {
      // Build profile payload (only profile fields, not related tables)
      const profilePayload = {
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
        onboarding_step: nextStep,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('profiles')
        .update(profilePayload)
        .eq('user_id', userId)

      if (error) {
        console.error('Error saving progress:', error)
      }
    } catch (error) {
      console.error('Error saving progress:', error)
    } finally {
      setSaving(false)
    }
  }, [data, supabase, userId])

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

  const handleComplete = useCallback(async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
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
          onboarding_completed: true,
          onboarding_step: STEPS.length,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)

      if (error) {
        console.error('Error completing onboarding:', error)
        alert('Failed to complete setup. Please try again.')
        return
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Error completing onboarding:', error)
    } finally {
      setSaving(false)
    }
  }, [data, supabase, userId, router])

  // Jump to a specific step (for resume import)
  const jumpToStep = useCallback(async (targetStep: number) => {
    await saveProgress(targetStep)
    setStep(targetStep)
    window.scrollTo(0, 0)
  }, [saveProgress])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">&#9670;</div>
          <p className="text-text-muted">Loading your profile...</p>
        </div>
      </div>
    )
  }

  const stepProps = {
    data,
    updateData,
    onNext: handleNext,
    onBack: handleBack,
    onComplete: handleComplete,
    jumpToStep,
    saving,
    userId,
    supabase,
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
      <ProgressBar currentStep={step} />

      {/* Step Content */}
      <div className="flex-1 py-6 px-4">
        <div className="max-w-2xl mx-auto">
          {step === 0 && <StepWelcome {...stepProps} />}
          {step === 1 && <StepContact {...stepProps} />}
          {step === 2 && <StepMilitary {...stepProps} />}
          {step === 3 && <StepExperience {...stepProps} />}
          {step === 4 && <StepSkills {...stepProps} />}
          {step === 5 && <StepEducation {...stepProps} />}
          {step === 6 && <StepSummary {...stepProps} />}
        </div>
      </div>
    </div>
  )
}
