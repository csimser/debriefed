'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CivilianTitleSuggestions } from '@/components/profile/CivilianTitleSuggestions'
import { formatDateForDB, formatDateForInput } from '@/lib/military-titles'
import { OnboardingData } from './NewOnboardingWizard'
import { Toast } from '@/components/ui/Toast'
import { ConfirmModal } from '@/components/ui/ConfirmModal'

interface Experience {
  id?: string
  employment_type: 'military' | 'civilian'
  job_title: string
  civilian_title: string
  organization: string
  start_date: string
  end_date: string
  is_current: boolean
}

interface StepExperienceProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
  onSkip: () => void
  saving: boolean
  userId: string
  supabase: any
}

const emptyExperience: Experience = {
  employment_type: 'military',
  job_title: '',
  civilian_title: '',
  organization: '',
  start_date: '',
  end_date: '',
  is_current: false,
}

export function StepExperience({ data, updateData, onNext, onBack, onSkip, saving, userId, supabase }: StepExperienceProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState<Experience>(emptyExperience)
  const [savingExp, setSavingExp] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const validateForm = () => {
    if (!formData.job_title.trim()) return false
    if (!formData.organization.trim()) return false
    if (!formData.start_date) return false
    return true
  }

  const handleSaveExperience = async () => {
    if (!validateForm()) {
      setValidationError('Please fill in Job Title, Organization, and Start Date')
      return
    }
    setValidationError(null)

    setSavingExp(true)
    try {
      const isCivilian = formData.employment_type === 'civilian'

      const expData = {
        user_id: userId,
        employment_type: formData.employment_type,
        job_title: formData.job_title,
        civilian_title: isCivilian ? formData.job_title : (formData.civilian_title || formData.job_title),
        organization: formData.organization,
        company_name: isCivilian ? formData.organization : null,
        start_date: formatDateForDB(formData.start_date),
        end_date: formData.is_current ? null : formatDateForDB(formData.end_date),
        is_current: formData.is_current,
        hours_per_week: 40,
        sort_order: editingIndex !== null ? editingIndex : data.experiences.length,
      }

      if (editingIndex !== null && data.experiences[editingIndex]?.id) {
        // Update existing
        const expId = data.experiences[editingIndex].id
        const { error } = await supabase
          .from('experience')
          .update(expData)
          .eq('id', expId)

        if (error) throw error

        const updatedExperiences = [...data.experiences]
        updatedExperiences[editingIndex] = { ...updatedExperiences[editingIndex], ...expData }
        updateData({ experiences: updatedExperiences })
      } else {
        // Insert new
        const { error } = await supabase
          .from('experience')
          .insert(expData)
          .select()
          .single()

        if (error) throw error

        // Reload experiences
        const { data: freshExperiences } = await supabase
          .from('experience')
          .select('*, experience_bullets(*)')
          .eq('user_id', userId)
          .order('sort_order')

        updateData({
          experiences: freshExperiences?.map((e: any) => ({
            ...e,
            bullets: e.experience_bullets || []
          })) || []
        })
      }

      // Reset form
      setFormData(emptyExperience)
      setShowForm(false)
      setEditingIndex(null)
    } catch (error) {
      console.error('Error saving experience:', error)
      setToast({ message: 'Failed to save experience. Please try again.', type: 'error' })
    } finally {
      setSavingExp(false)
    }
  }

  const handleEditExperience = (index: number) => {
    const exp = data.experiences[index]
    setFormData({
      id: exp.id,
      employment_type: exp.employment_type || 'military',
      job_title: exp.job_title || '',
      civilian_title: exp.civilian_title || '',
      organization: exp.organization || '',
      start_date: formatDateForInput(exp.start_date),
      end_date: formatDateForInput(exp.end_date),
      is_current: exp.is_current || false,
    })
    setEditingIndex(index)
    setShowForm(true)
  }

  const handleDeleteExperience = (index: number) => {
    const exp = data.experiences[index]
    if (!exp.id) return

    setConfirmDialog({
      title: 'Delete Experience',
      message: 'Are you sure you want to delete this experience? This cannot be undone.',
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('experience')
            .delete()
            .eq('id', exp.id)

          if (error) throw error

          const updated = data.experiences.filter((_: any, i: number) => i !== index)
          updateData({ experiences: updated })
        } catch (error) {
          console.error('Error deleting experience:', error)
          setToast({ message: 'Failed to delete experience.', type: 'error' })
        }
      },
    })
  }

  const inputClass = "w-full px-4 py-3.5 text-base md:py-3 md:text-sm bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25 transition-all"
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2"

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">&#128188;</div>
        <h2 className="font-heading text-2xl font-bold uppercase tracking-wider mb-2">
          Your Experience
        </h2>
        <p className="text-text-muted">
          Add your work history — military and/or civilian
        </p>
      </div>

      {/* Empty State Chooser */}
      {data.experiences.length === 0 && !showForm && (
        <div className="bg-bg-card border border-border rounded-lg p-6 mb-6">
          <p className="text-text-muted text-center mb-4">What type of experience do you want to add first?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                setFormData({ ...emptyExperience, employment_type: 'military' })
                setShowForm(true)
              }}
              className="p-4 bg-bg-tertiary rounded-lg border border-border hover:border-gold/50 transition-colors text-left"
            >
              <div className="text-2xl mb-2">&#127894;</div>
              <h3 className="font-semibold text-gold">Military Experience</h3>
              <p className="text-xs text-text-muted mt-1">Active duty, reserve, or guard positions</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({ ...emptyExperience, employment_type: 'civilian' })
                setShowForm(true)
              }}
              className="p-4 bg-bg-tertiary rounded-lg border border-border hover:border-gold/50 transition-colors text-left"
            >
              <div className="text-2xl mb-2">&#128188;</div>
              <h3 className="font-semibold text-gold">Civilian Experience</h3>
              <p className="text-xs text-text-muted mt-1">Private sector, government, or contract work</p>
            </button>
          </div>
        </div>
      )}

      {/* Existing Experiences List */}
      {data.experiences.length > 0 && !showForm && (
        <div className="space-y-4 mb-6">
          {data.experiences.map((exp: any, idx: number) => (
            <Card key={exp.id || idx} className="p-4 bg-bg-card">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-heading font-bold">{exp.civilian_title || exp.job_title}</span>
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      exp.employment_type === 'civilian' ? 'bg-status-blue/20 text-status-blue' : 'bg-gold/20 text-gold'
                    }`}>
                      {exp.employment_type === 'civilian' ? 'Civilian' : 'Military'}
                    </span>
                  </div>
                  <div className="text-text-muted text-sm">{exp.organization}</div>
                  <div className="text-text-dim text-xs mt-1">
                    {exp.start_date?.substring(0, 7)} - {exp.is_current ? 'Present' : exp.end_date?.substring(0, 7) || 'N/A'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEditExperience(idx)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDeleteExperience(idx)}>
                    &#10005;
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          <button
            onClick={() => {
              setFormData(emptyExperience)
              setEditingIndex(null)
              setShowForm(true)
            }}
            className="w-full py-3 border border-dashed border-border rounded-lg text-text-muted hover:border-gold hover:text-gold transition-colors"
          >
            + Add Another Experience
          </button>
        </div>
      )}

      {/* Add/Edit Experience Form */}
      {showForm && (
        <div className="bg-bg-card border border-border rounded-lg p-6 space-y-6">
          {/* Employment Type Toggle */}
          <div>
            <label className={labelClass}>Employment Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, employment_type: 'military' }))}
                className={`flex-1 px-4 py-2 rounded text-sm font-semibold transition-all ${
                  formData.employment_type === 'military'
                    ? 'bg-gold text-bg-primary'
                    : 'bg-bg-secondary text-text-muted border border-border'
                }`}
              >
                Military
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, employment_type: 'civilian' }))}
                className={`flex-1 px-4 py-2 rounded text-sm font-semibold transition-all ${
                  formData.employment_type === 'civilian'
                    ? 'bg-gold text-bg-primary'
                    : 'bg-bg-secondary text-text-muted border border-border'
                }`}
              >
                Civilian
              </button>
            </div>
          </div>

          {/* Job Title and Organization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                {formData.employment_type === 'military' ? 'Job Title (Military)' : 'Job Title'} *
              </label>
              <input
                type="text"
                name="job-title"
                autoComplete="off"
                value={formData.job_title}
                onChange={(e) => setFormData(prev => ({ ...prev, job_title: e.target.value }))}
                placeholder={formData.employment_type === 'military' ? 'e.g., Damage Controlman Chief' : 'e.g., Project Manager'}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                {formData.employment_type === 'military' ? 'Organization/Command' : 'Company'} *
              </label>
              <input
                type="text"
                name="company"
                autoComplete="off"
                value={formData.organization}
                onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                placeholder={formData.employment_type === 'military' ? 'e.g., USS Sterett (DDG-104)' : 'e.g., Acme Corp'}
                className={inputClass}
              />
            </div>
          </div>

          {/* Civilian Title Suggestions (military only) */}
          {formData.employment_type === 'military' && formData.job_title.length >= 2 && (
            <CivilianTitleSuggestions
              militaryTitle={formData.job_title}
              selectedTitle={formData.civilian_title}
              onSelect={(title) => setFormData(prev => ({ ...prev, civilian_title: title }))}
            />
          )}

          {/* Civilian Job Title (military only) */}
          {formData.employment_type === 'military' && (
            <div>
              <label className={labelClass}>Civilian Job Title (for resume)</label>
              <input
                type="text"
                name="civilian-title"
                autoComplete="off"
                value={formData.civilian_title}
                onChange={(e) => setFormData(prev => ({ ...prev, civilian_title: e.target.value }))}
                placeholder="Select above or type your own"
                className={inputClass}
              />
              <p className="text-xs text-text-dim mt-1">This appears on your civilian resume</p>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Start Date *</label>
              <input
                type="month"
                name="start-date"
                autoComplete="off"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>End Date</label>
              <input
                type="month"
                name="end-date"
                autoComplete="off"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                disabled={formData.is_current}
                className={`${inputClass} ${formData.is_current ? 'opacity-50' : ''}`}
              />
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is-current"
                  checked={formData.is_current}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    is_current: e.target.checked,
                    end_date: e.target.checked ? '' : prev.end_date
                  }))}
                  className="w-4 h-4 rounded border-border text-gold focus:ring-gold"
                />
                <span className="text-sm text-text-muted">Current position</span>
              </label>
            </div>
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="p-3 bg-status-red/10 border border-status-red/30 rounded text-status-red text-sm">
              {validationError}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-3">
            <Button onClick={handleSaveExperience} disabled={savingExp}>
              {savingExp ? 'Saving...' : editingIndex !== null ? 'Update Experience' : 'Save Experience'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowForm(false)
                setFormData(emptyExperience)
                setEditingIndex(null)
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Tip */}
      <div className="mt-4 p-3 bg-bg-tertiary rounded-lg border border-border">
        <p className="text-xs text-text-dim">
          You can add eval uploads, bullet points, and location details later from your profile page.
        </p>
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
          Skip — I&apos;ll add experience later
        </button>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmDialog && (
        <ConfirmModal
          title={confirmDialog.title}
          message={confirmDialog.message}
          variant="danger"
          confirmLabel="Delete"
          onConfirm={() => { confirmDialog.onConfirm(); setConfirmDialog(null) }}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  )
}
