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

export function StepComplete({ onComplete, onBack, saving }: StepProps) {
  return (
    <div className="text-center">
      <div className="text-6xl mb-6">🚀</div>
      <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wider mb-4">
        You're All Set!
      </h2>
      <p className="text-text-muted text-base md:text-lg mb-8 max-w-md mx-auto">
        Your profile is ready. Let's build your first civilian resume.
      </p>

      <div className="bg-bg-tertiary rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">
          Here's what's next:
        </h3>
        <ul className="space-y-3 text-sm text-text-muted">
          <li className="flex items-start gap-3">
            <span className="text-status-green">✓</span>
            <span>Add more details to your profile</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-status-green">✓</span>
            <span>Upload evaluations to extract bullets</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-status-green">✓</span>
            <span>Create your first resume with military-to-civilian translation</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-status-green">✓</span>
            <span>Match against job postings</span>
          </li>
        </ul>
      </div>

      <div className="flex justify-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          ← Back
        </Button>
        <Button onClick={onComplete} disabled={saving} className="px-12">
          {saving ? 'Finishing...' : 'Go to Dashboard →'}
        </Button>
      </div>
    </div>
  )
}
