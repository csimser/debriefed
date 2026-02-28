'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Toast } from '@/components/ui/Toast'

interface Version {
  id: string
  version_name: string
  created_at: string
}

interface VersionHistoryPanelProps {
  isOpen: boolean
  onClose: () => void
  resumeId: string
  /** Called after a version is restored — receives the full restored resume data */
  onRestore: (resumeData: {
    name: string
    template: string
    resume_type: string
    content: any
  }) => void
  /** Force-save the current resume before snapshot (returns when save completes) */
  onBeforeSave: () => Promise<void>
}

export function VersionHistoryPanel({
  isOpen,
  onClose,
  resumeId,
  onRestore,
  onBeforeSave,
}: VersionHistoryPanelProps) {
  const [versions, setVersions] = useState<Version[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [versionName, setVersionName] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [confirmRestore, setConfirmRestore] = useState<Version | null>(null)
  const [restoring, setRestoring] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<Version | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Auto-generate placeholder name
  const now = new Date()
  const placeholder = `Version ${versions.length + 1} \u00b7 ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`

  const fetchVersions = useCallback(async () => {
    if (!resumeId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/resume/versions?resumeId=${resumeId}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setVersions(data.versions || [])
    } catch {
      setToast({ message: 'Failed to load versions', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [resumeId])

  useEffect(() => {
    if (isOpen && resumeId) {
      fetchVersions()
    }
  }, [isOpen, resumeId, fetchVersions])

  const handleSave = async () => {
    setSaving(true)
    try {
      // Force-save current resume state first
      await onBeforeSave()

      const res = await fetch('/api/resume/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId,
          versionName: versionName.trim() || undefined,
        }),
      })

      if (!res.ok) throw new Error('Failed to save')

      setVersionName('')
      setToast({ message: 'Version saved', type: 'success' })
      await fetchVersions()
    } catch {
      setToast({ message: 'Failed to save version', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleRestore = async (version: Version) => {
    setRestoring(true)
    try {
      // Auto-save current state before restoring
      await onBeforeSave()
      await fetch('/api/resume/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId,
          versionName: `Auto-save before restore \u00b7 ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`,
        }),
      })

      // Restore the selected version
      const res = await fetch('/api/resume/versions/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionId: version.id }),
      })

      if (!res.ok) throw new Error('Failed to restore')

      const data = await res.json()
      onRestore(data.resume)
      setConfirmRestore(null)
      setToast({ message: `Restored "${version.version_name}"`, type: 'success' })
      await fetchVersions()
    } catch {
      setToast({ message: 'Failed to restore version', type: 'error' })
    } finally {
      setRestoring(false)
    }
  }

  const handleDelete = async (version: Version) => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/resume/versions/${version.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete')

      setConfirmDelete(null)
      setToast({ message: 'Version deleted', type: 'success' })
      await fetchVersions()
    } catch {
      setToast({ message: 'Failed to delete version', type: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-bg-secondary border-l border-border z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider">Version History</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-tertiary transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Save new version */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex gap-2">
            <input
              type="text"
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              placeholder={placeholder}
              className="flex-1 text-sm bg-bg-tertiary border border-border rounded-lg px-3 py-2 placeholder:text-text-dim focus:outline-none focus:border-gold"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave()
              }}
            />
            <Button
              onClick={handleSave}
              disabled={saving}
              size="sm"
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
          <p className="text-xs text-text-dim mt-1.5">
            {versions.length >= 10
              ? 'At limit — saving will remove the oldest version'
              : `${versions.length}/10 versions saved`
            }
          </p>
        </div>

        {/* Version list */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-12 px-4">
              <svg className="w-10 h-10 text-text-dim mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                <polyline points="12 6 12 12 16 14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-sm text-text-muted font-heading uppercase tracking-wider">No versions saved yet</p>
              <p className="text-xs text-text-dim mt-1">Save a snapshot to track your resume changes</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {versions.map((version) => (
                <div key={version.id} className="px-4 py-3 hover:bg-bg-tertiary/50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-heading font-semibold truncate">
                        {version.version_name}
                      </p>
                      <p className="text-xs text-text-dim mt-0.5">
                        {new Date(version.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => setConfirmRestore(version)}
                        className="px-2.5 py-1 text-xs font-heading uppercase tracking-wider text-gold hover:bg-gold-dim rounded-md transition-colors"
                        title="Restore this version"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => setConfirmDelete(version)}
                        className="p-1.5 text-text-dim hover:text-status-red rounded-md transition-colors"
                        title="Delete this version"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Restore confirmation */}
      {confirmRestore && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-bg-card border border-border rounded-lg max-w-md w-full p-6">
            <h3 className="font-heading text-lg font-bold uppercase tracking-wider mb-2">
              Restore Version
            </h3>
            <p className="text-sm text-text-muted mb-1">
              This will overwrite your current resume with <span className="text-text font-semibold">&ldquo;{confirmRestore.version_name}&rdquo;</span>.
            </p>
            <p className="text-xs text-text-dim mb-5">
              Your current version will be auto-saved first.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                onClick={() => setConfirmRestore(null)}
                disabled={restoring}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleRestore(confirmRestore)}
                disabled={restoring}
              >
                {restoring ? 'Restoring...' : 'Restore'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-bg-card border border-border rounded-lg max-w-md w-full p-6">
            <h3 className="font-heading text-lg font-bold uppercase tracking-wider mb-2">
              Delete Version
            </h3>
            <p className="text-sm text-text-muted mb-5">
              Delete <span className="text-text font-semibold">&ldquo;{confirmDelete.version_name}&rdquo;</span>? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                onClick={() => setConfirmDelete(null)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}
