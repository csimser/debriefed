'use client'

import { useState, useEffect, useRef } from 'react'
import { Toast } from '@/components/ui/Toast'

interface Resume {
  id: string
  name: string
}

interface ApplicationData {
  id?: string
  company_name: string
  job_title: string
  resume_id: string | null
  applied_date: string
  status: string
  notes: string | null
  salary_offered: number | null
  resume_name?: string | null
}

interface LogApplicationDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<ApplicationData, 'id' | 'resume_name'>) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  resumes: Resume[]
  editingApplication?: ApplicationData | null
}

const STATUSES = [
  { value: 'applied', label: 'Applied' },
  { value: 'callback', label: 'Callback' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
]

export function LogApplicationDrawer({
  isOpen,
  onClose,
  onSave,
  onDelete,
  resumes,
  editingApplication,
}: LogApplicationDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [form, setForm] = useState({
    company_name: '',
    job_title: '',
    resume_id: '' as string,
    applied_date: new Date().toISOString().split('T')[0],
    status: 'applied',
    notes: '',
    salary_offered: '',
  })

  const isEditing = !!editingApplication?.id

  // Populate form when editing
  useEffect(() => {
    if (editingApplication) {
      setForm({
        company_name: editingApplication.company_name,
        job_title: editingApplication.job_title,
        resume_id: editingApplication.resume_id || '',
        applied_date: editingApplication.applied_date,
        status: editingApplication.status,
        notes: editingApplication.notes || '',
        salary_offered: editingApplication.salary_offered?.toString() || '',
      })
    } else {
      setForm({
        company_name: '',
        job_title: '',
        resume_id: '',
        applied_date: new Date().toISOString().split('T')[0],
        status: 'applied',
        notes: '',
        salary_offered: '',
      })
    }
    setConfirmDelete(false)
    setError(null)
    setShowSuccess(false)
  }, [editingApplication, isOpen])

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.company_name.trim() || !form.job_title.trim()) return

    setSaving(true)
    setError(null)
    try {
      await onSave({
        company_name: form.company_name.trim(),
        job_title: form.job_title.trim(),
        resume_id: form.resume_id || null,
        applied_date: form.applied_date,
        status: form.status,
        notes: form.notes.trim() || null,
        salary_offered: form.salary_offered ? parseInt(form.salary_offered, 10) : null,
      })
      setShowSuccess(true)
      setTimeout(() => onClose(), 800)
    } catch {
      setError('Failed to save — please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!editingApplication?.id || !onDelete) return
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    setDeleting(true)
    setError(null)
    try {
      await onDelete(editingApplication.id)
      onClose()
    } catch {
      setError('Failed to delete — please try again.')
    } finally {
      setDeleting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-bg-card border-l border-border shadow-xl overflow-y-auto animate-slide-in-right"
      >
        {/* Header */}
        <div className="sticky top-0 bg-bg-card border-b border-border p-4 flex items-center justify-between z-10">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wider">
            {isEditing ? 'Edit Application' : 'Log Application'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-text transition-colors rounded-md hover:bg-bg-tertiary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Company Name */}
          <div>
            <label className="block text-xs font-nav uppercase tracking-wider text-text-muted mb-1">
              Company Name *
            </label>
            <input
              type="text"
              value={form.company_name}
              onChange={(e) => setForm(f => ({ ...f, company_name: e.target.value }))}
              className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md text-sm focus:outline-none focus:border-gold/50 transition-colors"
              placeholder="e.g. Lockheed Martin"
              required
            />
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-xs font-nav uppercase tracking-wider text-text-muted mb-1">
              Job Title *
            </label>
            <input
              type="text"
              value={form.job_title}
              onChange={(e) => setForm(f => ({ ...f, job_title: e.target.value }))}
              className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md text-sm focus:outline-none focus:border-gold/50 transition-colors"
              placeholder="e.g. Project Manager"
              required
            />
          </div>

          {/* Resume Selector */}
          <div>
            <label className="block text-xs font-nav uppercase tracking-wider text-text-muted mb-1">
              Resume Used
            </label>
            <select
              value={form.resume_id}
              onChange={(e) => setForm(f => ({ ...f, resume_id: e.target.value }))}
              className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md text-sm focus:outline-none focus:border-gold/50 transition-colors"
            >
              <option value="">No resume linked</option>
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          {/* Date Applied */}
          <div>
            <label className="block text-xs font-nav uppercase tracking-wider text-text-muted mb-1">
              Date Applied
            </label>
            <input
              type="date"
              value={form.applied_date}
              onChange={(e) => setForm(f => ({ ...f, applied_date: e.target.value }))}
              className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md text-sm focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-nav uppercase tracking-wider text-text-muted mb-1">
              Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, status: s.value }))}
                  className={`px-3 py-1.5 rounded-md text-xs font-nav uppercase tracking-wider border transition-colors ${
                    form.status === s.value
                      ? 'bg-gold-dim border-gold/30 text-gold'
                      : 'border-border text-text-muted hover:text-text hover:border-border'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Salary Offered */}
          <div>
            <label className="block text-xs font-nav uppercase tracking-wider text-text-muted mb-1">
              Salary Offered
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">$</span>
              <input
                type="number"
                value={form.salary_offered}
                onChange={(e) => setForm(f => ({ ...f, salary_offered: e.target.value }))}
                className="w-full pl-7 pr-3 py-2 bg-bg-secondary border border-border rounded-md text-sm focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-nav uppercase tracking-wider text-text-muted mb-1">
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md text-sm focus:outline-none focus:border-gold/50 transition-colors resize-none"
              placeholder="Interview contact, job posting URL, follow-up date..."
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-status-red-dim border border-status-red/20 rounded-md p-3">
              <p className="text-sm text-status-red">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || !form.company_name.trim() || !form.job_title.trim()}
              className="flex-1 px-4 py-2.5 bg-gold text-bg-primary font-heading font-bold text-sm uppercase tracking-wider rounded-md hover:bg-gold-bright transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : isEditing ? 'Update' : 'Log Application'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-border rounded-md text-sm text-text-muted hover:text-text hover:border-gold/20 transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Delete (edit mode only) */}
          {isEditing && onDelete && (
            <div className="pt-2 border-t border-border">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="w-full px-4 py-2 text-sm text-status-red hover:bg-status-red/10 rounded-md transition-colors"
              >
                {deleting ? 'Deleting...' : confirmDelete ? 'Confirm Delete' : 'Delete Application'}
              </button>
            </div>
          )}
        </form>
      </div>

      {showSuccess && (
        <Toast
          message={isEditing ? 'Application updated' : 'Application logged'}
          type="success"
          duration={2000}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </>
  )
}
