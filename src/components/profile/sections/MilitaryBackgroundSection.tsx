'use client'

import { useState, useEffect, useCallback } from 'react'
import { CollapsibleSection } from '../CollapsibleSection'
import { Input } from '@/components/ui/Input'
import { BRANCHES } from '@/lib/constants/military'

const CLEARANCES = ['None', 'Confidential', 'Secret', 'Top Secret', 'TS/SCI']

interface MilitaryBackgroundSectionProps {
  data: any
  onChange: (updates: any) => void
}

export function MilitaryBackgroundSection({ data, onChange }: MilitaryBackgroundSectionProps) {
  const [civilianSuggestions, setCivilianSuggestions] = useState<string[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)

  // Fetch O*NET crosswalk suggestions when MOS or branch changes
  const fetchCrosswalk = useCallback(async (mosCode: string, branch: string) => {
    if (!mosCode || mosCode.length < 2) {
      setCivilianSuggestions([])
      return
    }

    // Extract just the code (before any parentheses or descriptions)
    const code = mosCode.split(/[\s(]/)[0].trim().toUpperCase()
    if (code.length < 2) return

    setLoadingSuggestions(true)
    try {
      const branchParam = branch || 'navy'
      const response = await fetch(`/api/onet/crosswalk?code=${encodeURIComponent(code)}&branch=${encodeURIComponent(branchParam)}`)
      if (response.ok) {
        const responseData = await response.json()
        if (responseData.crosswalk && responseData.crosswalk.length > 0) {
          setCivilianSuggestions(responseData.crosswalk.slice(0, 3).map((c: any) => c.title))
        } else {
          setCivilianSuggestions([])
        }
      }
    } catch (error) {
      console.error('Error fetching crosswalk:', error)
    } finally {
      setLoadingSuggestions(false)
    }
  }, [])

  // Debounced effect to fetch suggestions when MOS or branch changes
  useEffect(() => {
    const mosValue = data?.mos_rating || ''
    const branchValue = data?.branch || ''
    const timeoutId = setTimeout(() => {
      fetchCrosswalk(mosValue, branchValue)
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [data?.mos_rating, data?.branch, fetchCrosswalk])

  return (
    <CollapsibleSection title="Military Background" icon="★" defaultOpen={true}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">Branch</label>
          <select
            value={data?.branch || ''}
            onChange={e => onChange({ branch: e.target.value })}
            className="w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-text"
          >
            <option value="">Select Branch</option>
            {BRANCHES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
          </select>
        </div>

        <Input
          label="Rank"
          value={data?.rank || ''}
          onChange={e => onChange({ rank: e.target.value })}
          placeholder="Senior Chief Petty Officer"
        />

        <Input
          label="Paygrade"
          value={data?.paygrade || ''}
          onChange={e => onChange({ paygrade: e.target.value })}
          placeholder="E-8"
        />

        <div className="space-y-2">
          <Input
            label="MOS/Rating/AFSC"
            value={data?.mos_rating || ''}
            onChange={e => onChange({ mos_rating: e.target.value })}
            placeholder="DC (Damage Controlman)"
          />
          {/* O*NET Civilian Title Suggestions */}
          {loadingSuggestions && (
            <p className="text-xs text-text-dim animate-pulse">Looking up civilian titles...</p>
          )}
          {!loadingSuggestions && civilianSuggestions.length > 0 && (
            <p className="text-xs text-text-muted">
              <span className="text-gold">Suggested civilian titles:</span>{' '}
              {civilianSuggestions.join(', ')}
            </p>
          )}
        </div>

        <Input
          label="Years of Service"
          type="number"
          value={data?.years_of_service || ''}
          onChange={e => onChange({ years_of_service: parseInt(e.target.value) || 0 })}
          placeholder="20"
        />

        <Input
          label="EAS/Retirement Date"
          type="date"
          value={data?.eas_date || ''}
          onChange={e => onChange({ eas_date: e.target.value })}
        />

        <div className="space-y-2">
          <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">Security Clearance</label>
          <select
            value={data?.security_clearance || ''}
            onChange={e => onChange({ security_clearance: e.target.value })}
            className="w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-text"
          >
            <option value="">Select Clearance</option>
            {CLEARANCES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
    </CollapsibleSection>
  )
}
