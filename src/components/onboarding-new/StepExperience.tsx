'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { US_STATES } from '@/lib/constants/states'
import { CivilianTitleSuggestions } from '@/components/profile/CivilianTitleSuggestions'
import { EvalUploadModal } from '@/components/profile/EvalUploadModal'
import { formatDateForDB, formatDateForInput } from '@/lib/military-titles'
import { OnboardingData } from './NewOnboardingWizard'

interface Experience {
  id?: string
  employment_type: 'military' | 'civilian'
  job_title: string
  civilian_title: string
  organization: string
  city: string
  state: string
  start_date: string
  end_date: string
  is_current: boolean
  bullets: any[]
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
  city: '',
  state: '',
  start_date: '',
  end_date: '',
  is_current: false,
  bullets: [],
}

export function StepExperience({ data, updateData, onNext, onBack, onSkip, saving, userId, supabase }: StepExperienceProps) {
  const [showForm, setShowForm] = useState(data.experiences.length === 0)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState<Experience>(emptyExperience)
  const [savingExp, setSavingExp] = useState(false)
  const [uploadingEval, setUploadingEval] = useState(false)
  const [extractedBullets, setExtractedBullets] = useState<any[]>([])
  const [evalType, setEvalType] = useState('fitrep')
  const [showEvalUploadForExp, setShowEvalUploadForExp] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const EVAL_TYPES = [
    { id: 'fitrep', name: 'FITREP', branch: 'Navy' },
    { id: 'chiefeval', name: 'Chief Eval', branch: 'Navy E7-E9' },
    { id: 'eval', name: 'EVAL', branch: 'Navy E1-E6' },
    { id: 'ncoer', name: 'NCOER', branch: 'Army' },
    { id: 'oer', name: 'OER', branch: 'Army/Navy' },
    { id: 'epr', name: 'EPR', branch: 'Air Force' },
    { id: 'award', name: 'Award/NAM', branch: 'All' },
  ]

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        // Remove the data:application/pdf;base64, prefix
        resolve(result.split(',')[1])
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const validateForm = () => {
    if (!formData.job_title.trim()) return false
    if (!formData.organization.trim()) return false
    if (!formData.start_date) return false
    return true
  }

  const handleSaveExperience = async () => {
    if (!validateForm()) {
      alert('Please fill in Job Title, Organization, and Start Date')
      return
    }

    setSavingExp(true)
    try {
      const isCivilian = formData.employment_type === 'civilian'

      // Generate location from city/state for backwards compatibility
      const location = formData.city && formData.state
        ? `${formData.city}, ${formData.state}`
        : null

      const expData = {
        user_id: userId,
        employment_type: formData.employment_type,
        job_title: formData.job_title,
        civilian_title: isCivilian ? formData.job_title : (formData.civilian_title || formData.job_title),
        organization: formData.organization,
        company_name: isCivilian ? formData.organization : null,
        city: formData.city || null,
        state: formData.state || null,
        location,
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

        // Update local state
        const updatedExperiences = [...data.experiences]
        updatedExperiences[editingIndex] = { ...updatedExperiences[editingIndex], ...expData }
        updateData({ experiences: updatedExperiences })
      } else {
        // Insert new
        const { data: insertedExp, error } = await supabase
          .from('experience')
          .insert(expData)
          .select()
          .single()

        if (error) throw error

        // Insert bullets if we have any
        if (insertedExp && extractedBullets.length > 0) {
          const bulletsToInsert = extractedBullets
            .filter(b => b.status === 'accepted')
            .map((b, idx) => ({
              experience_id: insertedExp.id,
              original_text: b.original,
              translated_text: b.translated,
              sort_order: idx,
              status: 'accepted',
            }))

          if (bulletsToInsert.length > 0) {
            await supabase.from('experience_bullets').insert(bulletsToInsert)
          }
        }

        // Reload experiences to get bullets
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
      setExtractedBullets([])
      setShowForm(false)
      setEditingIndex(null)
    } catch (error) {
      console.error('Error saving experience:', error)
      alert('Failed to save experience. Please try again.')
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
      city: exp.city || '',
      state: exp.state || '',
      start_date: formatDateForInput(exp.start_date),
      end_date: formatDateForInput(exp.end_date),
      is_current: exp.is_current || false,
      bullets: exp.bullets || [],
    })
    setEditingIndex(index)
    setShowForm(true)
  }

  const handleDeleteExperience = async (index: number) => {
    const exp = data.experiences[index]
    if (!exp.id) return

    if (!confirm('Delete this experience?')) return

    try {
      const { error } = await supabase
        .from('experience')
        .delete()
        .eq('id', exp.id)

      if (error) throw error

      const updated = data.experiences.filter((_, i) => i !== index)
      updateData({ experiences: updated })
    } catch (error) {
      console.error('Error deleting experience:', error)
    }
  }

  const handleEvalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingEval(true)
    try {
      // Convert file to base64
      const base64 = await fileToBase64(file)

      console.log('Sending raw file to Claude API:', file.name, 'type:', evalType, 'size:', base64.length)
      console.log('Base64 starts with:', base64.substring(0, 20))

      const response = await fetch('/api/parse-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          fileData: base64,
          evalType: evalType,
        }),
      })

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error)
      }

      if (result.bullets && result.bullets.length > 0) {
        setExtractedBullets(result.bullets.map((b: any, idx: number) => ({
          id: `bullet-${idx}`,
          original: b.original,
          translated: b.translated,
          status: 'accepted',
        })))
      }

      // Auto-fill job title if detected
      if (result.jobTitle && !formData.job_title) {
        setFormData(prev => ({ ...prev, job_title: result.jobTitle }))
      }

      // Auto-fill dates if detected
      if (result.evalPeriod) {
        if (result.evalPeriod.startDate && !formData.start_date) {
          setFormData(prev => ({ ...prev, start_date: result.evalPeriod.startDate }))
        }
        if (result.evalPeriod.endDate && !formData.end_date) {
          setFormData(prev => ({ ...prev, end_date: result.evalPeriod.endDate }))
        }
      }
    } catch (error: any) {
      console.error('Eval upload error:', error)
      alert(error?.message || 'Failed to parse evaluation. Please try again.')
    } finally {
      setUploadingEval(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const toggleBulletStatus = (bulletId: string) => {
    setExtractedBullets(prev => prev.map(b =>
      b.id === bulletId
        ? { ...b, status: b.status === 'accepted' ? 'excluded' : 'accepted' }
        : b
    ))
  }

  const inputClass = "w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25 transition-all"
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2"

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">&#128188;</div>
        <h2 className="font-heading text-2xl font-bold uppercase tracking-wider mb-2">
          Your Experience
        </h2>
        <p className="text-text-muted">
          Add your work history - military and/or civilian
        </p>
      </div>

      {/* Existing Experiences List */}
      {data.experiences.length > 0 && !showForm && (
        <div className="space-y-4 mb-6">
          {data.experiences.map((exp, idx) => (
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
                  {exp.bullets?.length > 0 && (
                    <div className="text-xs text-status-green mt-1">
                      {exp.bullets.length} bullet{exp.bullets.length !== 1 ? 's' : ''} added
                    </div>
                  )}
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
              {exp.id && (
                <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2">
                  <button
                    onClick={() => setShowEvalUploadForExp(exp.id)}
                    className="flex items-center gap-1 px-2 py-1 bg-status-green/20 text-status-green border border-status-green/30 rounded hover:bg-status-green/30 transition-colors text-xs"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Import Eval
                  </button>
                </div>
              )}
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
                value={formData.civilian_title}
                onChange={(e) => setFormData(prev => ({ ...prev, civilian_title: e.target.value }))}
                placeholder="Select above or type your own"
                className={inputClass}
              />
              <p className="text-xs text-text-dim mt-1">This appears on your civilian resume</p>
            </div>
          )}

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="e.g., San Diego"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <select
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                className={inputClass}
              >
                <option value="">Select State</option>
                {US_STATES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Start Date *</label>
              <input
                type="month"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>End Date</label>
              <input
                type="month"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                disabled={formData.is_current}
                className={`${inputClass} ${formData.is_current ? 'opacity-50' : ''}`}
              />
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
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

          {/* Eval Upload Section */}
          <div className="pt-4 border-t border-border">
            <label className={labelClass}>
              Upload Evaluation (Optional)
            </label>
            <p className="text-xs text-text-dim mb-3">
              Upload an eval, NCOER, EPR, fitrep, or award to extract achievement bullets automatically
            </p>

            {/* Eval Type Selector */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {EVAL_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setEvalType(type.id)}
                  className={`p-2 rounded text-xs text-left transition-all ${
                    evalType === type.id
                      ? 'bg-gold/20 border border-gold/30 text-gold'
                      : 'bg-bg-tertiary hover:bg-bg-hover border border-transparent text-text-muted'
                  }`}
                >
                  <div className="font-semibold">{type.name}</div>
                  <div className="text-[10px] opacity-70">{type.branch}</div>
                </button>
              ))}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleEvalUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingEval}
              className="w-full py-3 border border-dashed border-border rounded-lg text-text-muted hover:border-gold hover:text-gold transition-colors flex items-center justify-center gap-2"
            >
              {uploadingEval ? (
                <>
                  <span className="animate-spin">&#8635;</span>
                  Extracting bullets...
                </>
              ) : (
                <>
                  <span>&#128196;</span>
                  Upload {EVAL_TYPES.find(t => t.id === evalType)?.name || 'Evaluation'}
                </>
              )}
            </button>

            {/* Extracted Bullets */}
            {extractedBullets.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-gold font-semibold uppercase">
                  Extracted Bullets ({extractedBullets.filter(b => b.status === 'accepted').length} selected)
                </p>
                {extractedBullets.map((bullet) => (
                  <div
                    key={bullet.id}
                    onClick={() => toggleBulletStatus(bullet.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      bullet.status === 'accepted'
                        ? 'bg-status-green/10 border-status-green/30'
                        : 'bg-bg-tertiary border-border opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={bullet.status === 'accepted' ? 'text-status-green' : 'text-text-dim'}>
                        {bullet.status === 'accepted' ? '✓' : '○'}
                      </span>
                      <span className="text-sm text-text-muted flex-1">
                        {bullet.translated}
                      </span>
                    </div>
                    {bullet.original !== bullet.translated && (
                      <p className="text-xs text-text-dim mt-1 ml-6">
                        Original: {bullet.original}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

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
                setExtractedBullets([])
                setEditingIndex(null)
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

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

      {/* Eval Upload Modal for saved experiences */}
      {showEvalUploadForExp && (
        <EvalUploadModal
          isOpen={true}
          onClose={() => setShowEvalUploadForExp(null)}
          onExtracted={() => {}}
          onBulletsSaved={async () => {
            // Refresh experiences to show new bullets
            const { data: freshExperiences } = await supabase
              .from('experience')
              .select('*, experience_bullets(*)')
              .eq('user_id', userId)
              .order('sort_order')

            if (freshExperiences) {
              updateData({
                experiences: freshExperiences.map((e: any) => ({
                  ...e,
                  bullets: e.experience_bullets || []
                }))
              })
            }
            setShowEvalUploadForExp(null)
          }}
          userId={userId}
          experiences={data.experiences
            .filter((exp: any) => exp.id)
            .map((exp: any) => ({
              id: exp.id,
              job_title: exp.job_title,
              organization: exp.organization,
              start_date: exp.start_date,
              end_date: exp.end_date,
            }))}
          defaultExperienceId={showEvalUploadForExp}
        />
      )}
    </div>
  )
}
