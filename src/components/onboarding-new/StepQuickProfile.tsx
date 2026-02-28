'use client'

import { useEffect, useCallback, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { InternationalPhoneInput } from '@/components/ui/InternationalPhoneInput'
import { US_STATES } from '@/lib/constants/states'
import { BRANCHES, PAYGRADES, getRankFromPaygrade } from '@/lib/constants/military'
import { CLEARANCE_LEVELS } from '@/lib/constants/federalEligibility'
import { OnboardingData } from './NewOnboardingWizard'

interface StepQuickProfileProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
  onSkip: () => void
  saving: boolean
}

export function StepQuickProfile({ data, updateData, onNext, onBack, onSkip, saving }: StepQuickProfileProps) {
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

  const inputClass = "w-full px-4 py-3.5 text-base md:py-3 md:text-sm bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25 transition-all"
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2"

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">&#9889;</div>
        <h2 className="font-heading text-2xl font-bold uppercase tracking-wider mb-2">
          Quick Profile Setup
        </h2>
        <p className="text-text-muted">
          Basic info, military background, and target role — all in one step
        </p>
      </div>

      <div className="bg-bg-card border border-border rounded-lg p-6 space-y-8">
        {/* === Section 1: Basic Info === */}
        <div>
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gold mb-4 pb-2 border-b border-border">
            Basic Info
          </h3>
          <div className="space-y-4">
            <div>
              <InternationalPhoneInput
                label="Phone"
                value={data.phone}
                onChange={(phone) => updateData({ phone })}
                hint="Include country code for international numbers"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  name="city"
                  autoComplete="address-level2"
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
                  autoComplete="address-level1"
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
          </div>
        </div>

        {/* === Section 2: Military Background === */}
        <div>
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gold mb-4 pb-2 border-b border-border">
            Military Background
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Branch</label>
                <select
                  value={data.branch}
                  onChange={(e) => updateData({ branch: e.target.value, rank: '' })}
                  autoComplete="off"
                  className={inputClass}
                >
                  <option value="">Select Branch</option>
                  {BRANCHES.map(b => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Paygrade</label>
                <select
                  value={data.paygrade}
                  onChange={(e) => updateData({ paygrade: e.target.value })}
                  autoComplete="off"
                  className={inputClass}
                >
                  <option value="">Select Paygrade</option>
                  {PAYGRADES.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rank (auto-filled) */}
            <div>
              <label className={labelClass}>
                Rank <span className="text-text-dim">(Auto-filled)</span>
              </label>
              <input
                type="text"
                name="rank"
                autoComplete="off"
                value={data.rank}
                onChange={(e) => updateData({ rank: e.target.value })}
                placeholder="Select branch and paygrade above"
                className={`${inputClass} ${data.branch && data.paygrade ? '' : 'bg-bg-tertiary'}`}
                readOnly={!!(data.branch && data.paygrade)}
              />
            </div>

            {/* MOS/Rating */}
            <div>
              <label className={labelClass}>
                MOS / Rating / AFSC
                <span className="text-text-dim ml-2">(Recommended)</span>
              </label>
              <input
                type="text"
                name="rating-mos"
                autoComplete="off"
                value={data.rating_mos}
                onChange={(e) => updateData({ rating_mos: e.target.value })}
                placeholder="e.g., DC, IT, 11B, 3D0X2, OS"
                className={inputClass}
              />
              <p className="text-xs text-text-dim mt-1">
                We&apos;ll suggest civilian job titles based on this
              </p>

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
                      <button
                        key={idx}
                        type="button"
                        onClick={() => updateData({ target_role: title })}
                        className={`px-2 py-1 text-xs rounded transition-all ${
                          data.target_role === title
                            ? 'bg-gold text-bg-primary font-semibold'
                            : 'bg-bg-tertiary border border-border text-text-muted hover:border-gold/30'
                        }`}
                      >
                        {title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
                autoComplete="off"
                className={inputClass}
              >
                <option value="">Select Clearance</option>
                {CLEARANCE_LEVELS.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* === Section 3: Career Target === */}
        <div>
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gold mb-4 pb-2 border-b border-border">
            Career Target
          </h3>
          <div>
            <label className={labelClass}>Target Role</label>
            <input
              type="text"
              name="target-role"
              autoComplete="off"
              value={data.target_role}
              onChange={(e) => updateData({ target_role: e.target.value })}
              placeholder="e.g., Operations Manager, Cybersecurity Analyst"
              className={inputClass}
            />
            <p className="text-xs text-text-dim mt-1">
              What civilian role are you targeting? We&apos;ll use this throughout your profile.
            </p>
          </div>
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
