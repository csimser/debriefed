'use client'

import { useState } from 'react'
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

export function StepExperience({ data, updateData, onNext, onBack, saving }: StepProps) {
  const [bullet1, setBullet1] = useState(data.sample_bullet_1 || '')
  const [bullet2, setBullet2] = useState(data.sample_bullet_2 || '')

  const handleContinue = () => {
    updateData({ sample_bullet_1: bullet1, sample_bullet_2: bullet2 })
    onNext()
  }

  return (
    <div>
      <h2 className="font-heading text-xl md:text-2xl font-bold uppercase tracking-wider mb-2 text-center">
        Your Experience
      </h2>
      <p className="text-text-muted text-center mb-8">
        Share 1-2 achievements from your service (we'll translate them later)
      </p>

      <div className="space-y-4 max-w-lg mx-auto">
        <div className="space-y-2">
          <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
            Achievement #1
          </label>
          <textarea
            value={bullet1}
            onChange={(e) => setBullet1(e.target.value)}
            autoComplete="off"
            placeholder="e.g., Led 15-person DC division through 3 major inspections with zero discrepancies"
            className="w-full h-24 bg-bg-secondary border border-border rounded-md px-4 py-3 text-text placeholder:text-text-dim resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
            Achievement #2 (optional)
          </label>
          <textarea
            value={bullet2}
            onChange={(e) => setBullet2(e.target.value)}
            autoComplete="off"
            placeholder="e.g., Managed $2.3M damage control equipment budget with 100% accountability"
            className="w-full h-24 bg-bg-secondary border border-border rounded-md px-4 py-3 text-text placeholder:text-text-dim resize-none"
          />
        </div>

        <div className="bg-gold-dim border border-gold/20 rounded-lg p-4">
          <p className="text-sm text-gold">
            <strong>Tip:</strong> Include numbers, dollar amounts, team sizes, and outcomes.
            We'll translate the military jargon for you.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={onBack}>
          ← Back
        </Button>
        <Button onClick={handleContinue} disabled={!bullet1.trim() || saving}>
          {saving ? 'Saving...' : 'Continue →'}
        </Button>
      </div>
    </div>
  )
}
