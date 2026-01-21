'use client'

import { Button } from '@/components/ui/Button'

interface StepProps {
  data: any
  updateData: (data: any) => void
  onNext: () => void
  onBack: () => void
  onComplete: () => void
  saving: boolean
  isFirstStep: boolean
  isLastStep: boolean
}

export function StepWelcome({ onNext }: StepProps) {
  return (
    <div className="text-center">
      <div className="text-6xl mb-6">🎖️</div>
      <h1 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wider mb-4">
        Welcome to <span className="text-gold">Debriefed</span>
      </h1>
      <p className="text-text-muted text-base md:text-lg mb-8 max-w-md mx-auto">
        Let's set up your profile so we can help translate your military experience
        into a civilian career.
      </p>

      <div className="bg-bg-tertiary rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">
          This will only take 3 minutes:
        </h3>
        <ul className="space-y-3 text-sm text-text-muted">
          <li className="flex items-center gap-3">
            <span className="text-gold">1.</span> Your military background
          </li>
          <li className="flex items-center gap-3">
            <span className="text-gold">2.</span> Your top experience
          </li>
          <li className="flex items-center gap-3">
            <span className="text-gold">3.</span> Your career goals
          </li>
        </ul>
      </div>

      <Button onClick={onNext} className="px-12">
        Let's Go →
      </Button>
    </div>
  )
}
