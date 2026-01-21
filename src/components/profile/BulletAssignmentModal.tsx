'use client'

import { useState } from 'react'
import { CivilianTitleSuggestions } from './CivilianTitleSuggestions'

interface ExtractedBullet {
  original: string
  translated: string
  metrics: string[]
  skills: string[]
}

interface Experience {
  id: string
  job_title: string
  civilian_title?: string
  organization: string
  start_date: string
  end_date: string | null
}

interface BulletAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  bullets: ExtractedBullet[]
  experiences: Experience[]
  onAssign: (experienceId: string) => void
  onCreate: (expData: { job_title: string; civilian_title: string; organization: string; start_date: string; end_date: string }) => void
  saving: boolean
}

export function BulletAssignmentModal({
  isOpen,
  onClose,
  bullets,
  experiences,
  onAssign,
  onCreate,
  saving
}: BulletAssignmentModalProps) {
  const [mode, setMode] = useState<'select' | 'create'>('select')
  const [selectedExpId, setSelectedExpId] = useState<string>('')
  const [newExp, setNewExp] = useState({
    job_title: '',
    civilian_title: '',
    organization: '',
    start_date: '',
    end_date: '',
  })

  if (!isOpen) return null

  const handleSave = () => {
    if (mode === 'select' && selectedExpId) {
      onAssign(selectedExpId)
    } else if (mode === 'create' && newExp.job_title && newExp.organization) {
      onCreate({
        ...newExp,
        civilian_title: newExp.civilian_title || newExp.job_title,
      })
    }
  }

  const handleClose = () => {
    setMode('select')
    setSelectedExpId('')
    setNewExp({ job_title: '', civilian_title: '', organization: '', start_date: '', end_date: '' })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card border border-border rounded-lg w-full max-w-lg shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <h2 className="font-heading text-lg font-bold">Save Extracted Bullets</h2>
          <p className="text-sm text-text-muted mt-1">
            {bullets.length} bullets ready to save. Choose where to add them.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Bullets Preview */}
          <div className="p-3 bg-bg-tertiary rounded-lg max-h-32 overflow-y-auto">
            <p className="text-xs text-text-dim uppercase mb-2">Preview:</p>
            {bullets.slice(0, 3).map((b, idx) => (
              <p key={idx} className="text-sm text-text-muted truncate">&#8226; {b.translated}</p>
            ))}
            {bullets.length > 3 && (
              <p className="text-xs text-text-dim mt-1">...and {bullets.length - 3} more</p>
            )}
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setMode('select')}
              className={`flex-1 px-4 py-2 rounded text-sm font-semibold transition-all ${
                mode === 'select'
                  ? 'bg-gold text-bg-primary'
                  : 'bg-bg-tertiary text-text-muted hover:text-text'
              }`}
            >
              Add to Existing
            </button>
            <button
              onClick={() => setMode('create')}
              className={`flex-1 px-4 py-2 rounded text-sm font-semibold transition-all ${
                mode === 'create'
                  ? 'bg-gold text-bg-primary'
                  : 'bg-bg-tertiary text-text-muted hover:text-text'
              }`}
            >
              Create New Experience
            </button>
          </div>

          {/* Select Existing Experience */}
          {mode === 'select' && (
            <div>
              {experiences.length === 0 ? (
                <div className="p-4 bg-bg-secondary rounded text-center">
                  <p className="text-text-muted text-sm">No experiences yet.</p>
                  <button
                    onClick={() => setMode('create')}
                    className="text-gold text-sm hover:underline mt-1"
                  >
                    Create one now
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {experiences.map((exp) => (
                    <label
                      key={exp.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedExpId === exp.id
                          ? 'border-gold bg-gold/10'
                          : 'border-border hover:border-gold/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="experience"
                        value={exp.id}
                        checked={selectedExpId === exp.id}
                        onChange={() => setSelectedExpId(exp.id)}
                        className="text-gold"
                      />
                      <div>
                        <p className="font-semibold text-sm">{exp.job_title}</p>
                        <p className="text-xs text-text-muted">
                          {exp.organization} &#8226; {exp.start_date} - {exp.end_date || 'Present'}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Create New Experience */}
          {mode === 'create' && (
            <div className="space-y-3">
              {/* Military Job Title */}
              <div>
                <label className="block text-xs font-semibold uppercase text-text-muted mb-1">
                  Job Title (Military) *
                </label>
                <input
                  type="text"
                  value={newExp.job_title}
                  onChange={(e) => setNewExp(prev => ({ ...prev, job_title: e.target.value }))}
                  placeholder="e.g., Damage Controlman Chief, 11B"
                  className="w-full px-3 py-2 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                />
              </div>

              {/* Civilian Title Suggestions */}
              {newExp.job_title.length >= 2 && (
                <CivilianTitleSuggestions
                  militaryTitle={newExp.job_title}
                  selectedTitle={newExp.civilian_title}
                  onSelect={(title) => setNewExp(prev => ({ ...prev, civilian_title: title }))}
                />
              )}

              {/* Civilian Job Title */}
              <div>
                <label className="block text-xs font-semibold uppercase text-text-muted mb-1">
                  Civilian Job Title (for resume)
                </label>
                <input
                  type="text"
                  value={newExp.civilian_title}
                  onChange={(e) => setNewExp(prev => ({ ...prev, civilian_title: e.target.value }))}
                  placeholder="Select above or type your own"
                  className="w-full px-3 py-2 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                />
                <p className="text-xs text-text-dim mt-1">This is what will appear on your resume</p>
              </div>

              {/* Organization */}
              <div>
                <label className="block text-xs font-semibold uppercase text-text-muted mb-1">
                  Organization *
                </label>
                <input
                  type="text"
                  value={newExp.organization}
                  onChange={(e) => setNewExp(prev => ({ ...prev, organization: e.target.value }))}
                  placeholder="e.g., USS Sterett (DDG-104)"
                  className="w-full px-3 py-2 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-text-muted mb-1">
                    Start Date
                  </label>
                  <input
                    type="month"
                    value={newExp.start_date}
                    onChange={(e) => setNewExp(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full px-3 py-2 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-text-muted mb-1">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={newExp.end_date}
                    onChange={(e) => setNewExp(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full px-3 py-2 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                  />
                  <p className="text-xs text-text-dim mt-1">Leave blank if current</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-bg-tertiary border border-border rounded font-heading font-bold uppercase tracking-wider text-sm hover:bg-bg-hover transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={
              saving ||
              (mode === 'select' && !selectedExpId) ||
              (mode === 'create' && (!newExp.job_title || !newExp.organization))
            }
            className="flex-1 px-4 py-2 bg-gold text-bg-primary rounded font-heading font-bold uppercase tracking-wider text-sm hover:bg-gold-bright disabled:opacity-50 transition-all"
          >
            {saving ? 'Saving...' : `Save ${bullets.length} Bullets`}
          </button>
        </div>
      </div>
    </div>
  )
}
