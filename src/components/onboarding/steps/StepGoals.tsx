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

const CAREER_INTERESTS = [
  'Project Management',
  'Operations Management',
  'Cybersecurity',
  'IT / Tech',
  'Human Resources',
  'Logistics / Supply Chain',
  'Healthcare',
  'Government / Federal',
  'Defense Contractor',
  'Consulting',
  'Executive Leadership',
  'Entrepreneurship',
]

const TIMELINE = [
  { value: 'now', label: 'Ready now' },
  { value: '3months', label: 'Within 3 months' },
  { value: '6months', label: 'Within 6 months' },
  { value: '1year', label: 'Within 1 year' },
]

export function StepGoals({ data, updateData, onNext, onBack, saving }: StepProps) {
  const [interests, setInterests] = useState<string[]>(data.career_interests || [])
  const [timeline, setTimeline] = useState(data.job_search_timeline || '')
  const [skillbridgeOptIn, setSkillbridgeOptIn] = useState(data.skillbridge_opt_in || false)

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    )
  }

  const handleContinue = () => {
    updateData({
      career_interests: interests,
      job_search_timeline: timeline,
      skillbridge_opt_in: skillbridgeOptIn
    })
    onNext()
  }

  return (
    <div>
      <h2 className="font-heading text-xl md:text-2xl font-bold uppercase tracking-wider mb-2 text-center">
        Career Goals
      </h2>
      <p className="text-text-muted text-center mb-8">
        What kind of civilian career are you targeting?
      </p>

      <div className="space-y-6 max-w-lg mx-auto">
        {/* Career Interests */}
        <div className="space-y-3">
          <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
            Areas of Interest (select all that apply)
          </label>
          <div className="flex flex-wrap gap-2">
            {CAREER_INTERESTS.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  interests.includes(interest)
                    ? 'bg-gold text-bg-primary'
                    : 'bg-bg-tertiary text-text-muted hover:text-text'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
            Job Search Timeline
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TIMELINE.map((t) => (
              <button
                key={t.value}
                onClick={() => setTimeline(t.value)}
                className={`px-4 py-3 rounded-lg text-sm transition-all ${
                  timeline === t.value
                    ? 'bg-gold text-bg-primary'
                    : 'bg-bg-tertiary text-text-muted hover:text-text'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* SkillBridge Opt-In */}
        <div className="space-y-3">
          <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
            SkillBridge Program
          </label>
          <button
            onClick={() => setSkillbridgeOptIn(!skillbridgeOptIn)}
            className={`w-full flex items-start gap-3 p-4 rounded-lg border transition-all text-left ${
              skillbridgeOptIn
                ? 'bg-gold/10 border-gold'
                : 'bg-bg-tertiary border-border hover:border-gold/30'
            }`}
          >
            <div className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center mt-0.5 ${
              skillbridgeOptIn
                ? 'bg-gold border-gold'
                : 'border-border'
            }`}>
              {skillbridgeOptIn && (
                <svg className="w-3 h-3 text-bg-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div>
              <span className="text-sm font-medium text-text">
                I'm interested in DoD SkillBridge opportunities
              </span>
              <p className="text-xs text-text-muted mt-1">
                SkillBridge allows service members to gain civilian work experience during their last 180 days of service.
                We'll help you find and prepare for SkillBridge programs.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={onBack}>
          ← Back
        </Button>
        <Button onClick={handleContinue} disabled={interests.length === 0 || !timeline || saving}>
          {saving ? 'Saving...' : 'Continue →'}
        </Button>
      </div>
    </div>
  )
}
