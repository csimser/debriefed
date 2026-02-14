'use client'

import { Button } from '@/components/ui/Button'
import { InternationalPhoneInput } from '@/components/ui/InternationalPhoneInput'
import { US_STATES } from '@/lib/constants/states'
import { OnboardingData } from './NewOnboardingWizard'

interface StepContactProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
  onSkip: () => void
  saving: boolean
}

export function StepContact({ data, updateData, onNext, onBack, onSkip, saving }: StepContactProps) {
  const inputClass = "w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25 transition-all"
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2"

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">&#128100;</div>
        <h2 className="font-heading text-2xl font-bold uppercase tracking-wider mb-2">
          Contact Information
        </h2>
        <p className="text-text-muted">
          This info will appear on your resumes
        </p>
      </div>

      <div className="bg-bg-card border border-border rounded-lg p-6 space-y-6">
        {/* Locked fields info */}
        <div className="bg-bg-tertiary rounded-lg p-4 text-sm">
          <p className="text-text-dim">
            &#128274; Your name and email are set from your account and can&apos;t be changed here.
          </p>
        </div>

        {/* Name row (locked) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              First Name <span className="text-text-dim">(Locked)</span>
            </label>
            <input
              type="text"
              value={data.first_name}
              disabled
              className={`${inputClass} opacity-60 cursor-not-allowed`}
            />
          </div>
          <div>
            <label className={labelClass}>
              Last Name <span className="text-text-dim">(Locked)</span>
            </label>
            <input
              type="text"
              value={data.last_name}
              disabled
              className={`${inputClass} opacity-60 cursor-not-allowed`}
            />
          </div>
        </div>

        {/* Email (locked) */}
        <div>
          <label className={labelClass}>
            Email <span className="text-text-dim">(Locked)</span>
          </label>
          <input
            type="email"
            value={data.email}
            disabled
            className={`${inputClass} opacity-60 cursor-not-allowed`}
          />
        </div>

        {/* Phone */}
        <div>
          <InternationalPhoneInput
            label="Phone"
            value={data.phone}
            onChange={(phone) => updateData({ phone })}
            hint="Include country code for international numbers"
          />
        </div>

        {/* City and State row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>City</label>
            <input
              type="text"
              value={data.city}
              onChange={(e) => updateData({ city: e.target.value })}
              placeholder="San Diego"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <select
              value={data.state}
              onChange={(e) => updateData({ state: e.target.value })}
              className={inputClass}
            >
              <option value="">Select State</option>
              {US_STATES.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* LinkedIn (optional) */}
        <div>
          <label className={labelClass}>
            LinkedIn URL <span className="text-text-dim">(Optional)</span>
          </label>
          <input
            type="url"
            value={data.linkedin_url}
            onChange={(e) => updateData({ linkedin_url: e.target.value })}
            placeholder="https://linkedin.com/in/yourprofile"
            className={inputClass}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={onBack}>
          &#8592; Back
        </Button>
        <Button onClick={onNext} disabled={saving}>
          {saving ? 'Saving...' : 'Continue \u2192'}
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
