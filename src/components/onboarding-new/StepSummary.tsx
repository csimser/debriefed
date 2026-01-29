'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { OnboardingData } from './NewOnboardingWizard'

const JOB_SEARCH_TIMELINES = [
  { value: 'actively_looking', label: 'Actively looking now' },
  { value: '1_3_months', label: 'Within 1-3 months' },
  { value: '3_6_months', label: 'Within 3-6 months' },
  { value: '6_plus_months', label: '6+ months out' },
  { value: 'exploring', label: 'Just exploring options' },
]

const TARGET_INDUSTRIES = [
  'Technology / IT',
  'Defense / Aerospace',
  'Government / Federal',
  'Healthcare',
  'Finance / Banking',
  'Manufacturing',
  'Energy / Utilities',
  'Consulting',
  'Transportation / Logistics',
  'Construction',
  'Education',
  'Other',
]

interface StepSummaryProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
  onComplete: () => void
  saving: boolean
}

export function StepSummary({ data, updateData, onBack, onComplete, saving }: StepSummaryProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generating, setGenerating] = useState(false)

  // Build suggested roles from crosswalk data
  const suggestedRoles = useMemo(() => {
    return data.suggested_titles?.slice(0, 5) || []
  }, [data.suggested_titles])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!data.target_industry?.trim()) {
      newErrors.target_industry = 'Target industry is required'
    }
    if (!data.target_role?.trim()) {
      newErrors.target_role = 'Target role is required'
    }
    if (!data.job_search_timeline?.trim()) {
      newErrors.job_search_timeline = 'Job search timeline is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleComplete = () => {
    if (validate()) {
      onComplete()
    }
  }

  const handleGenerateSummary = async () => {
    if (!data.target_role || !data.target_industry) {
      alert('Please fill in your target industry and role first')
      return
    }

    setGenerating(true)
    try {
      const response = await fetch('/api/enhance-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: data.professional_summary || '',
          profile: {
            branch: data.branch,
            rank: data.rank,
            paygrade: data.paygrade,
            rating_mos: data.rating_mos,
            years_of_service: data.years_of_service,
            clearance: data.clearance,
            target_industry: data.target_industry,
            target_role: data.target_role,
            skills: data.skills.map(s => s.name).join(', '),
            certifications: data.certifications.map(c => c.name).join(', '),
          }
        })
      })

      if (!response.ok) throw new Error('Failed to generate summary')

      const result = await response.json()
      if (result.enhanced) {
        updateData({ professional_summary: result.enhanced })
      }
    } catch (error) {
      console.error('Summary generation error:', error)
      alert('Failed to generate summary. Please try again or write one manually.')
    } finally {
      setGenerating(false)
    }
  }

  const inputClass = "w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25 transition-all"
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2"
  const errorClass = "text-xs text-status-red mt-1"

  // Calculate profile completeness
  const completionItems = [
    { label: 'Contact Info', done: !!(data.phone && data.city && data.state) },
    { label: 'Military Background', done: !!(data.branch && data.paygrade) },
    { label: 'Experience', done: data.experiences.length > 0 },
    { label: 'Skills', done: data.skills.length > 0 },
    { label: 'Career Goals', done: !!(data.target_industry && data.target_role) },
    { label: 'Summary', done: !!(data.professional_summary && data.professional_summary.length > 50) },
  ]
  const completedCount = completionItems.filter(i => i.done).length
  const completionPercent = Math.round((completedCount / completionItems.length) * 100)

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">&#128640;</div>
        <h2 className="font-heading text-2xl font-bold uppercase tracking-wider mb-2">
          Career Goals & Summary
        </h2>
        <p className="text-text-muted">
          Tell us what you're looking for and we'll generate your professional summary
        </p>
      </div>

      {/* Career Goals */}
      <div className="bg-bg-card border border-border rounded-lg p-6 mb-6 space-y-6">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gold">
          Career Goals
        </h3>

        {/* Target Industry */}
        <div>
          <label className={labelClass}>Target Industry *</label>
          <select
            value={data.target_industry}
            onChange={(e) => {
              updateData({ target_industry: e.target.value })
              if (errors.target_industry) setErrors(prev => ({ ...prev, target_industry: '' }))
            }}
            className={`${inputClass} ${errors.target_industry ? 'border-status-red' : ''}`}
          >
            <option value="">Select Industry</option>
            {TARGET_INDUSTRIES.map((industry) => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
          {errors.target_industry && <p className={errorClass}>{errors.target_industry}</p>}
        </div>

        {/* Target Role */}
        <div>
          <label className={labelClass}>Target Role *</label>
          <input
            type="text"
            value={data.target_role}
            onChange={(e) => {
              updateData({ target_role: e.target.value })
              if (errors.target_role) setErrors(prev => ({ ...prev, target_role: '' }))
            }}
            placeholder="e.g., Project Manager, Operations Manager"
            className={`${inputClass} ${errors.target_role ? 'border-status-red' : ''}`}
          />
          {errors.target_role && <p className={errorClass}>{errors.target_role}</p>}

          {/* Role suggestions from crosswalk */}
          {suggestedRoles.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="text-xs text-text-dim">Suggested:</span>
              {suggestedRoles.map((role, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => updateData({ target_role: role })}
                  className="text-xs px-2 py-1 bg-bg-tertiary border border-border rounded hover:border-gold hover:text-gold transition-colors"
                >
                  {role}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Job Search Timeline */}
        <div>
          <label className={labelClass}>Job Search Timeline *</label>
          <select
            value={data.job_search_timeline}
            onChange={(e) => {
              updateData({ job_search_timeline: e.target.value })
              if (errors.job_search_timeline) setErrors(prev => ({ ...prev, job_search_timeline: '' }))
            }}
            className={`${inputClass} ${errors.job_search_timeline ? 'border-status-red' : ''}`}
          >
            <option value="">When are you looking to start?</option>
            {JOB_SEARCH_TIMELINES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          {errors.job_search_timeline && <p className={errorClass}>{errors.job_search_timeline}</p>}
        </div>
      </div>

      {/* Professional Summary */}
      <div className="bg-bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gold">
            Professional Summary
          </h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleGenerateSummary}
            disabled={generating || !data.target_industry || !data.target_role}
          >
            {generating ? (
              <>
                <span className="animate-spin mr-2">&#8635;</span>
                Generating...
              </>
            ) : (
              <>
                &#10024; {data.professional_summary ? 'Regenerate' : 'Generate'} with AI
              </>
            )}
          </Button>
        </div>

        <textarea
          value={data.professional_summary}
          onChange={(e) => updateData({ professional_summary: e.target.value })}
          placeholder="Your professional summary will appear here. Click 'Generate with AI' to create one automatically based on your profile, or write your own."
          className={`${inputClass} min-h-[150px] resize-none`}
        />

        <p className="text-xs text-text-dim mt-2">
          This summary will be pre-filled when you create resumes. You can always edit it later.
        </p>
      </div>

      {/* Profile Completeness */}
      <div className="bg-bg-card border border-border rounded-lg p-6 mb-6">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gold mb-4">
          Profile Completeness: {completionPercent}%
        </h3>

        <div className="w-full bg-bg-tertiary rounded-full h-2 mb-4">
          <div
            className="bg-gold h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {completionItems.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 text-sm ${
                item.done ? 'text-status-green' : 'text-text-dim'
              }`}
            >
              <span>{item.done ? '✓' : '○'}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ready to go callout */}
      <div className="bg-gold/10 border border-gold/30 rounded-lg p-6 text-center mb-6">
        <div className="text-3xl mb-2">&#127881;</div>
        <h3 className="font-heading text-lg font-bold mb-2">You're Almost Done!</h3>
        <p className="text-text-muted text-sm">
          Click "Finish Setup" to complete your profile and start building resumes.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={onBack}>
          &#8592; Back
        </Button>
        <Button onClick={handleComplete} disabled={saving} className="px-8">
          {saving ? 'Finishing...' : 'Finish Setup \u2192'}
        </Button>
      </div>
    </div>
  )
}
