'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface FederalJobInfo {
  id?: string
  resume_id: string
  announcement_number: string
  position_title: string
  series_grade: string
  citizenship: string
  veterans_preference: boolean
  federal_civilian_status: string
}

interface FederalJobInfoEditorProps {
  resumeId: string
  format: 'private' | 'federal'
  onChange?: (info: FederalJobInfo) => void
}

const INITIAL_STATE: Omit<FederalJobInfo, 'resume_id'> = {
  announcement_number: '',
  position_title: '',
  series_grade: '',
  citizenship: 'USA',
  veterans_preference: false,
  federal_civilian_status: 'N/A',
}

export function FederalJobInfoEditor({ resumeId, format, onChange }: FederalJobInfoEditorProps) {
  const [jobInfo, setJobInfo] = useState<FederalJobInfo>({ ...INITIAL_STATE, resume_id: resumeId })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  // Load existing federal job info
  useEffect(() => {
    async function loadFederalInfo() {
      const { data, error } = await supabase
        .from('resume_federal_info')
        .select('*')
        .eq('resume_id', resumeId)
        .single()

      if (data && !error) {
        setJobInfo(data)
      }
      setLoading(false)
    }

    if (resumeId) {
      loadFederalInfo()
    }
  }, [resumeId, supabase])

  // Auto-save when data changes
  const updateField = async <K extends keyof FederalJobInfo>(field: K, value: FederalJobInfo[K]) => {
    const newInfo = { ...jobInfo, [field]: value }
    setJobInfo(newInfo)
    onChange?.(newInfo)

    setSaving(true)
    try {
      if (jobInfo.id) {
        // Update existing
        await supabase
          .from('resume_federal_info')
          .update({ [field]: value, updated_at: new Date().toISOString() })
          .eq('id', jobInfo.id)
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('resume_federal_info')
          .upsert(newInfo)
          .select()
          .single()

        if (data && !error) {
          setJobInfo(data)
        }
      }
    } finally {
      setSaving(false)
    }
  }

  // Only show for federal format
  if (format !== 'federal') return null

  if (loading) {
    return (
      <div className="bg-bg-tertiary border border-gold/30 rounded-lg p-4 mb-4 animate-pulse">
        <div className="h-4 bg-bg-secondary rounded w-1/3 mb-3"></div>
        <div className="h-10 bg-bg-secondary rounded"></div>
      </div>
    )
  }

  const inputClass = "w-full mt-1 px-3 py-2.5 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25 transition-all text-sm"
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-text-muted"

  return (
    <div className="bg-bg-tertiary border border-gold/30 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm text-gold uppercase tracking-wider flex items-center gap-2">
          Federal Application Details
        </h3>
        {saving && (
          <span className="text-xs text-text-dim">Saving...</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Announcement Number</label>
          <input
            type="text"
            value={jobInfo.announcement_number}
            onChange={(e) => updateField('announcement_number', e.target.value)}
            placeholder="XX-XXXXXX-XX"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Position Title</label>
          <input
            type="text"
            value={jobInfo.position_title}
            onChange={(e) => updateField('position_title', e.target.value)}
            placeholder="From job posting"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label className={labelClass}>Series & Grade</label>
          <input
            type="text"
            value={jobInfo.series_grade}
            onChange={(e) => updateField('series_grade', e.target.value)}
            placeholder="GS-0301-12"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Federal Civilian Status</label>
          <select
            value={jobInfo.federal_civilian_status}
            onChange={(e) => updateField('federal_civilian_status', e.target.value)}
            className={inputClass}
          >
            <option value="N/A">N/A (Never worked federal)</option>
            <option value="Current">Current Federal Employee</option>
            <option value="Former">Former Federal Employee</option>
            <option value="Reinstatement">Reinstatement Eligible</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Citizenship</label>
          <select
            value={jobInfo.citizenship}
            onChange={(e) => updateField('citizenship', e.target.value)}
            className={inputClass}
          >
            <option value="USA">United States</option>
            <option value="Dual">Dual Citizen</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={jobInfo.veterans_preference}
            onChange={(e) => updateField('veterans_preference', e.target.checked)}
            className="w-4 h-4 rounded border-border text-gold focus:ring-gold"
          />
          <span className="text-sm text-text-secondary">Veteran's Preference Eligible</span>
        </label>
        <p className="text-xs text-text-dim mt-1 ml-6">
          Check if you're eligible for 5 or 10 point veteran's preference
        </p>
      </div>
    </div>
  )
}
