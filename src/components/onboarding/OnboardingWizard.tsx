'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { StepWelcome } from './steps/StepWelcome'
import { StepMilitary } from './steps/StepMilitary'
import { StepGoals } from './steps/StepGoals'
import { StepComplete } from './steps/StepComplete'
import { createClient } from '@/lib/supabase/client'

interface OnboardingWizardProps {
  userId: string
  currentStep: number
  existingProfile: any
}

const STEPS = [
  { id: 0, name: 'Welcome', component: StepWelcome },
  { id: 1, name: 'Military Background', component: StepMilitary },
  { id: 2, name: 'Career Goals', component: StepGoals },
  { id: 3, name: 'Complete', component: StepComplete },
]

export function OnboardingWizard({ userId, currentStep, existingProfile }: OnboardingWizardProps) {
  // Map old step numbers to new (in case user was on step 2+ with old flow)
  const mappedStep = currentStep >= 3 ? Math.max(0, currentStep - 1) : currentStep
  const [step, setStep] = useState(Math.min(mappedStep, STEPS.length - 1))
  const [data, setData] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const supabase = createClient()

  // Load existing profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (profile) {
          setData(profile)
        } else if (existingProfile) {
          setData(existingProfile)
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        if (existingProfile) {
          setData(existingProfile)
        }
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [userId, existingProfile, supabase])

  const CurrentStepComponent = STEPS[step].component

  const updateData = (newData: any) => {
    setData((prev: any) => ({ ...prev, ...newData }))
  }

  const saveProgress = async (nextStep: number) => {
    setSaving(true)

    try {
      // Save all data to profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          onboarding_step: nextStep,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)

      if (error) {
        console.error('Error saving progress:', error)
      }
    } catch (error) {
      console.error('Error saving progress:', error)
    }

    setSaving(false)
  }

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      await saveProgress(step + 1)
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleComplete = async () => {
    setSaving(true)

    try {
      // Save all data to profiles table and mark onboarding complete
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          onboarding_completed: true,
          onboarding_step: STEPS.length,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)

      if (error) {
        console.error('Error completing onboarding:', error)
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
    }

    router.push('/dashboard')
  }

  const handleSkip = () => {
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-muted">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-bg-secondary border-b border-border px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold rounded flex items-center justify-center">
              <span className="font-heading font-bold text-bg-primary text-lg">D</span>
            </div>
            <span className="font-heading font-bold text-lg tracking-wide">DEBRIEFED</span>
          </div>
          <button onClick={handleSkip} className="text-sm text-text-muted hover:text-text">
            Skip for now →
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-bg-secondary border-b border-border px-6 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((s, idx) => (
              <div key={s.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm ${
                  idx < step
                    ? 'bg-status-green text-white'
                    : idx === step
                    ? 'bg-gold text-bg-primary'
                    : 'bg-bg-tertiary text-text-muted'
                }`}>
                  {idx < step ? '✓' : idx + 1}
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`w-12 md:w-20 h-0.5 mx-1 md:mx-2 ${
                    idx < step ? 'bg-status-green' : 'bg-bg-tertiary'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="hidden md:flex justify-between text-xs text-text-muted">
            {STEPS.map((s) => (
              <span key={s.id} className="w-24 text-center">{s.name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-6">
        <Card className="w-full max-w-2xl p-6 md:p-8">
          <CurrentStepComponent
            data={data}
            updateData={updateData}
            onNext={handleNext}
            onBack={handleBack}
            onComplete={handleComplete}
            saving={saving}
            isFirstStep={step === 0}
            isLastStep={step === STEPS.length - 1}
          />
        </Card>
      </div>
    </div>
  )
}
