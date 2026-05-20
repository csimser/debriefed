'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ModalShell } from '@/components/ui/ModalShell'

interface DeleteResumeModalProps {
  isOpen: boolean
  onClose: () => void
  resume: {
    id: string
    name: string
  }
  onDeleted?: () => void
}

export function DeleteResumeModal({
  isOpen,
  onClose,
  resume,
  onDeleted
}: DeleteResumeModalProps) {
  const supabase = createClient()
  const [deleting, setDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
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
    <ModalShell isOpen={isOpen} onClose={handleClose} title="Delete Resume" maxWidth="max-w-md">
      <div className="bg-bg-card border-t md:border border-border rounded-t-2xl md:rounded-lg w-full shadow-xl">
        {/* Mobile drag indicator */}
        <div className="md:hidden w-12 h-1 bg-border rounded-full mx-auto mt-3" />

        {/* Header */}
        <div className="p-4 md:p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-status-red/20 rounded-full flex items-center justify-center flex-shrink-0">
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
        <div className="p-4 md:p-6 max-h-[60vh] overflow-auto mobile-scroll">
          <p className="text-text mb-4">
            Are you sure you want to delete <strong className="text-gold">&quot;{resume.name}&quot;</strong>?
          </p>

          {/* Permanent warning */}
          <div className="p-4 bg-status-red-dim border border-status-red/30 rounded-lg mb-4">
            <p className="text-status-red text-sm font-semibold flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              This action cannot be undone.
            </p>
          </div>

          {/* Type DELETE confirmation */}
          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              Type DELETE to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              placeholder="DELETE"
              autoComplete="off"
              className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-status-red focus:ring-1 focus:ring-status-red/25 font-mono"
            />
          </div>
        </div>

        {/* Footer - stack buttons on mobile */}
        <div className="p-4 md:p-6 border-t border-border flex flex-col-reverse md:flex-row gap-3 safe-area-inset-bottom">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-3.5 md:py-3 bg-bg-tertiary border border-border text-text rounded-lg md:rounded font-heading font-bold uppercase tracking-wider hover:bg-bg-hover active:bg-bg-hover transition-all min-h-[48px]"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting || confirmText !== 'DELETE'}
            className="flex-1 px-4 py-3.5 md:py-3 bg-status-red text-white rounded-lg md:rounded font-heading font-bold uppercase tracking-wider hover:bg-status-red/90 active:bg-status-red/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[48px]"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </ModalShell>
  )
}
