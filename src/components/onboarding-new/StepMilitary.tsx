'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { BRANCHES, PAYGRADES, getRankFromPaygrade } from '@/lib/constants/military'
import { CLEARANCE_LEVELS } from '@/lib/constants/federalEligibility'
import { OnboardingData } from './NewOnboardingWizard'

interface StepMilitaryProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
  saving: boolean
}

export function StepMilitary({ data, updateData, onNext, onBack, saving }: StepMilitaryProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loadingCrosswalk, setLoadingCrosswalk] = useState(false)
  const [civilianTitles, setCivilianTitles] = useState<string[]>([])

  // Auto-populate rank when branch and paygrade change
  useEffect(() => {
    if (data.branch && data.paygrade) {
      const rank = getRankFromPaygrade(data.branch, data.paygrade)
      if (rank && rank !== data.rank) {
        updateData({ rank })
      }
    }
  }, [data.branch, data.paygrade, data.rank, updateData])

  // Fetch O*NET crosswalk suggestions when MOS/rating changes
  const fetchCrosswalk = useCallback(async (mosCode: string, branch: string) => {
    if (!mosCode || mosCode.length < 2) {
      setCivilianTitles([])
      updateData({ suggested_titles: [], suggested_skills: [], suggested_certs: [] })
      return
    }

    const code = mosCode.split(/[\s(]/)[0].trim().toUpperCase()
    if (code.length < 2) return

    setLoadingCrosswalk(true)
    try {
      const branchParam = branch || 'navy'
      const response = await fetch(`/api/onet/crosswalk?code=${encodeURIComponent(code)}&branch=${encodeURIComponent(branchParam)}`)
      if (response.ok) {
        const responseData = await response.json()
        if (responseData.crosswalk && responseData.crosswalk.length > 0) {
          const titles = responseData.crosswalk.slice(0, 5).map((c: any) => c.title)
          setCivilianTitles(titles)
          updateData({
            suggested_titles: titles,
            // Pull skills and certs from crosswalk if available
            suggested_skills: responseData.skills || [],
            suggested_certs: responseData.certifications || [],
          })
        } else {
          setCivilianTitles([])
        }
      }
    } catch (error) {
      console.error('Error fetching crosswalk:', error)
    } finally {
      setLoadingCrosswalk(false)
    }
  }, [updateData])

  // Debounced effect to fetch suggestions when MOS or branch changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (data.rating_mos && data.branch) {
        fetchCrosswalk(data.rating_mos, data.branch)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [data.rating_mos, data.branch, fetchCrosswalk])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!data.branch) {
      newErrors.branch = 'Branch is required'
    }
    if (!data.paygrade) {
      newErrors.paygrade = 'Paygrade is required'
    }
    if (!data.years_of_service) {
      newErrors.years_of_service = 'Years of service is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) {
      onNext()
    }
  }

  const inputClass = "w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25 transition-all"
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2"
  const errorClass = "text-xs text-status-red mt-1"

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">&#127942;</div>
        <h2 className="font-heading text-2xl font-bold uppercase tracking-wider mb-2">
          Military Background
        </h2>
        <p className="text-text-muted">
          Tell us about your service
        </p>
      </div>

      <div className="bg-bg-card border border-border rounded-lg p-6 space-y-6">
        {/* Branch and Paygrade row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Branch *</label>
            <select
              value={data.branch}
              onChange={(e) => {
                updateData({ branch: e.target.value, rank: '' })
                if (errors.branch) setErrors(prev => ({ ...prev, branch: '' }))
              }}
              className={`${inputClass} ${errors.branch ? 'border-status-red' : ''}`}
            >
              <option value="">Select Branch</option>
              {BRANCHES.map(b => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
            {errors.branch && <p className={errorClass}>{errors.branch}</p>}
          </div>
          <div>
            <label className={labelClass}>Paygrade *</label>
            <select
              value={data.paygrade}
              onChange={(e) => {
                updateData({ paygrade: e.target.value })
                if (errors.paygrade) setErrors(prev => ({ ...prev, paygrade: '' }))
              }}
              className={`${inputClass} ${errors.paygrade ? 'border-status-red' : ''}`}
            >
              <option value="">Select Paygrade</option>
              {PAYGRADES.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            {errors.paygrade && <p className={errorClass}>{errors.paygrade}</p>}
          </div>
        </div>

        {/* Rank (auto-filled) */}
        <div>
          <label className={labelClass}>
            Rank <span className="text-text-dim">(Auto-filled)</span>
          </label>
          <input
            type="text"
            value={data.rank}
            onChange={(e) => updateData({ rank: e.target.value })}
            placeholder="Select branch and paygrade above"
            className={`${inputClass} ${data.branch && data.paygrade ? '' : 'bg-bg-tertiary'}`}
            readOnly={!!(data.branch && data.paygrade)}
          />
          {data.branch && data.paygrade && (
            <p className="text-xs text-text-dim mt-1">Auto-filled from your branch and paygrade</p>
          )}
        </div>

        {/* MOS/Rating */}
        <div>
          <label className={labelClass}>
            MOS / Rating / AFSC
            <span className="text-text-dim ml-2">(Recommended)</span>
          </label>
          <input
            type="text"
            value={data.rating_mos}
            onChange={(e) => updateData({ rating_mos: e.target.value })}
            placeholder="e.g., DC, IT, 11B, 3D0X2, OS"
            className={inputClass}
          />
          <p className="text-xs text-text-dim mt-1">
            We'll suggest civilian job titles based on this
          </p>

          {/* Crosswalk Suggestions */}
          {loadingCrosswalk && (
            <p className="text-xs text-text-muted mt-2 animate-pulse">
              Looking up civilian equivalents...
            </p>
          )}
          {!loadingCrosswalk && civilianTitles.length > 0 && (
            <div className="mt-3 p-3 bg-gold/10 border border-gold/30 rounded-lg">
              <p className="text-xs text-gold font-semibold mb-2">
                &#9733; Based on your {data.rating_mos}, you might target roles like:
              </p>
              <div className="flex flex-wrap gap-2">
                {civilianTitles.map((title, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs bg-bg-tertiary border border-border rounded text-text-muted"
                  >
                    {title}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Years of Service */}
        <div>
          <label className={labelClass}>Years of Service *</label>
          <input
            type="number"
            value={data.years_of_service}
            onChange={(e) => {
              updateData({ years_of_service: e.target.value })
              if (errors.years_of_service) setErrors(prev => ({ ...prev, years_of_service: '' }))
            }}
            placeholder="e.g., 8"
            min="0"
            max="40"
            className={`${inputClass} ${errors.years_of_service ? 'border-status-red' : ''}`}
          />
          {errors.years_of_service && <p className={errorClass}>{errors.years_of_service}</p>}
        </div>

        {/* Clearance */}
        <div>
          <label className={labelClass}>
            Security Clearance
            <span className="text-text-dim ml-2">(Optional)</span>
          </label>
          <select
            value={data.clearance}
            onChange={(e) => updateData({ clearance: e.target.value })}
            className={inputClass}
          >
            <option value="">Select Clearance</option>
            {CLEARANCE_LEVELS.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Separation Date */}
        <div>
          <label className={labelClass}>
            Separation / Retirement Date
            <span className="text-text-dim ml-2">(Optional)</span>
          </label>
          <input
            type="date"
            value={data.eas_date}
            onChange={(e) => updateData({ eas_date: e.target.value })}
            className={inputClass}
          />
          <p className="text-xs text-text-dim mt-1">EAS, EAOS, or retirement date</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={onBack}>
          &#8592; Back
        </Button>
        <Button onClick={handleNext} disabled={saving}>
          {saving ? 'Saving...' : 'Continue \u2192'}
        </Button>
      </div>
    </div>
  )
}
