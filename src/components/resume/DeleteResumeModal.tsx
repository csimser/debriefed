'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface DeleteResumeModalProps {
  isOpen: boolean
  onClose: () => void
  resume: {
    id: string
    name: string
    resume_type?: 'private' | 'federal'
    has_been_downloaded?: boolean
  }
  userPlan: string
  usage?: {
    private_downloads: number
    federal_downloads: number
  }
  limits?: {
    private_downloads: number
    federal_downloads: number
  }
  onDeleted?: () => void
}

// Default limits by tier
const TIER_LIMITS: Record<string, { private_downloads: number; federal_downloads: number }> = {
  free: { private_downloads: 1, federal_downloads: 1 },
  basic: { private_downloads: 999999, federal_downloads: 999999 },
  core: { private_downloads: 999999, federal_downloads: 999999 },
  pro: { private_downloads: 999999, federal_downloads: 999999 },
  full: { private_downloads: 999999, federal_downloads: 999999 },
}

export function DeleteResumeModal({
  isOpen,
  onClose,
  resume,
  userPlan,
  usage = { private_downloads: 0, federal_downloads: 0 },
  limits,
  onDeleted
}: DeleteResumeModalProps) {
  const supabase = createClient()
  const [deleting, setDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  if (!isOpen) return null

  // Use provided limits or default based on tier
  const effectiveLimits = limits || TIER_LIMITS[userPlan] || TIER_LIMITS.free

  const isFree = userPlan === 'free'
  const isPrivate = resume.resume_type !== 'federal'
  const currentUsage = isPrivate ? usage.private_downloads : usage.federal_downloads
  const limit = isPrivate ? effectiveLimits.private_downloads : effectiveLimits.federal_downloads
  const isAtLimit = currentUsage >= limit && limit < 999999
  const resumeType = isPrivate ? 'private' : 'federal'

  const requiresConfirmText = isFree

  const handleDelete = async () => {
    if (requiresConfirmText && confirmText !== 'DELETE') {
      return
    }

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resume.id)

      if (error) {
        console.error('Delete error:', error)
        alert(`Failed to delete: ${error.message}`)
        return
      }

      setConfirmText('')
      onClose()
      onDeleted?.()
    } catch (err: any) {
      console.error('Delete error:', err)
      alert(`Error: ${err?.message || 'Failed to delete'}`)
    } finally {
      setDeleting(false)
    }
  }

  const handleClose = () => {
    setConfirmText('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card border border-border rounded-lg w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-status-red/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-status-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold">Delete Resume</h2>
              <p className="text-sm text-text-muted">This action cannot be undone</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-text mb-4">
            Are you sure you want to delete <strong className="text-gold">"{resume.name}"</strong>?
          </p>

          {/* Usage Warning */}
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mb-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <div>
                <p className="text-yellow-200 text-sm">
                  <strong>Current usage:</strong> {currentUsage} of {limit >= 999999 ? '∞' : limit} {resumeType} resume downloads used.
                </p>
                {isAtLimit && resume.has_been_downloaded && (
                  <p className="text-yellow-200 text-sm mt-2">
                    You've reached your download limit. Deleting this resume means you won't be able to create and download another {resumeType} resume without upgrading.
                  </p>
                )}
                {isFree && !isAtLimit && (
                  <p className="text-yellow-200/80 text-sm mt-2">
                    You have <strong>{limit - currentUsage}</strong> {resumeType} download{limit - currentUsage !== 1 ? 's' : ''} remaining on your free plan.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Permanent warning */}
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
            <p className="text-red-400 text-sm font-semibold flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              This action cannot be undone.
            </p>
          </div>

          {/* Type DELETE confirmation for free users */}
          {requiresConfirmText && (
            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Type DELETE to confirm
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                placeholder="DELETE"
                className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-status-red focus:ring-1 focus:ring-status-red/25 font-mono"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-3 bg-bg-tertiary border border-border text-text rounded font-heading font-bold uppercase tracking-wider hover:bg-bg-hover transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting || (requiresConfirmText && confirmText !== 'DELETE')}
            className="flex-1 px-4 py-3 bg-status-red text-white rounded font-heading font-bold uppercase tracking-wider hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {deleting ? 'Deleting...' : 'Delete Resume'}
          </button>
        </div>
      </div>
    </div>
  )
}
