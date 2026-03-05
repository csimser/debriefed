'use client'

import { useState, useCallback } from 'react'
import { ApplicationCard } from './ApplicationCard'
import { LogApplicationDrawer } from './LogApplicationDrawer'
import { StatsBar } from './StatsBar'
import { Toast } from '@/components/ui/Toast'

interface Application {
  id: string
  company_name: string
  job_title: string
  resume_id: string | null
  resume_name: string | null
  applied_date: string
  status: string
  notes: string | null
  salary_offered: number | null
  created_at: string
  updated_at: string
}

interface Resume {
  id: string
  name: string
}

interface ApplicationBoardProps {
  initialApplications: Application[]
  resumes: Resume[]
}

const COLUMNS = [
  { key: 'applied', label: 'Applied', color: 'border-t-text-muted' },
  { key: 'callback', label: 'Callback', color: 'border-t-blue-400' },
  { key: 'interview', label: 'Interview', color: 'border-t-gold' },
  { key: 'offer', label: 'Offer', color: 'border-t-status-green' },
  { key: 'accepted', label: 'Accepted', color: 'border-t-emerald-400' },
  { key: 'rejected', label: 'Rejected', color: 'border-t-status-red' },
] as const

export function ApplicationBoard({ initialApplications, resumes }: ApplicationBoardProps) {
  const [applications, setApplications] = useState<Application[]>(initialApplications)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingApp, setEditingApp] = useState<Application | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  const openNew = () => {
    setEditingApp(null)
    setDrawerOpen(true)
  }

  const openEdit = useCallback((id: string) => {
    const app = applications.find(a => a.id === id)
    if (app) {
      setEditingApp(app)
      setDrawerOpen(true)
    }
  }, [applications])

  const handleSave = async (data: {
    company_name: string
    job_title: string
    resume_id: string | null
    applied_date: string
    status: string
    notes: string | null
    salary_offered: number | null
  }) => {
    try {
      if (editingApp?.id) {
        // Update existing
        const res = await fetch(`/api/applications/${editingApp.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error('Failed to update')
        const { application } = await res.json()

        // Preserve resume_name
        const resumeName = data.resume_id
          ? resumes.find(r => r.id === data.resume_id)?.name || 'Unknown'
          : null

        setApplications(prev =>
          prev.map(a => a.id === editingApp.id ? { ...application, resume_name: resumeName } : a)
        )
      } else {
        // Create new
        const res = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error('Failed to create')
        const { application } = await res.json()

        const resumeName = data.resume_id
          ? resumes.find(r => r.id === data.resume_id)?.name || 'Unknown'
          : null

        setApplications(prev => [{ ...application, resume_name: resumeName }, ...prev])
      }
    } catch (err) {
      throw err
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setApplications(prev => prev.filter(a => a.id !== id))
      setToast({ message: 'Application deleted', type: 'success' })
    } catch (err) {
      throw err
    }
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, columnKey: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(columnKey)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    setDragOverColumn(null)

    const id = e.dataTransfer.getData('text/plain')
    const app = applications.find(a => a.id === id)
    if (!app || app.status === newStatus) return

    // Optimistic update
    setApplications(prev =>
      prev.map(a => a.id === id ? { ...a, status: newStatus } : a)
    )

    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        throw new Error('Failed to update')
      }
    } catch {
      // Revert on failure
      setApplications(prev =>
        prev.map(a => a.id === id ? { ...a, status: app.status } : a)
      )
      setToast({ message: 'Failed to move application', type: 'error' })
    }
  }

  const isEmpty = applications.length === 0

  return (
    <div className="space-y-6">
      {/* Stats */}
      <StatsBar applications={applications} />

      {/* Empty state */}
      {isEmpty ? (
        <div className="text-center py-16 px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-dim flex items-center justify-center">
            <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="font-heading text-lg font-bold uppercase tracking-wider mb-1">
            Start Tracking Your Applications
          </h3>
          <p className="text-sm text-text-muted max-w-sm mx-auto mb-6">
            Log your job applications to see which resume versions are getting callbacks, interviews, and offers.
          </p>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold text-bg-primary font-heading font-bold text-sm uppercase tracking-wider rounded-md hover:bg-gold-bright transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Log Application
          </button>
        </div>
      ) : (
        <>
          {/* Kanban Board */}
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex gap-3 min-w-[900px] pb-4">
              {COLUMNS.map((col) => {
                const columnApps = applications.filter(a => a.status === col.key)
                const isDragOver = dragOverColumn === col.key

                return (
                  <div
                    key={col.key}
                    className={`flex-1 min-w-[150px] rounded-lg border-t-2 ${col.color} ${
                      isDragOver ? 'bg-gold/[0.04]' : 'bg-bg-tertiary/50'
                    } transition-colors`}
                    onDragOver={(e) => handleDragOver(e, col.key)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, col.key)}
                  >
                    {/* Column header */}
                    <div className="px-3 py-2 flex items-center justify-between">
                      <span className="text-xs font-nav uppercase tracking-wider text-text-muted">
                        {col.label}
                      </span>
                      <span className="text-xs font-heading font-bold text-text-muted">
                        {columnApps.length}
                      </span>
                    </div>

                    {/* Cards */}
                    <div className="px-2 pb-2 space-y-2 min-h-[80px]">
                      {columnApps.map((app) => (
                        <ApplicationCard
                          key={app.id}
                          application={app}
                          onEdit={openEdit}
                          onDragStart={handleDragStart}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* FAB — Log Application */}
      {!isEmpty && (
        <button
          onClick={openNew}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 bg-gold text-bg-primary font-heading font-bold text-sm uppercase tracking-wider rounded-full shadow-lg hover:bg-gold-bright transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Log Application
        </button>
      )}

      {/* Drawer */}
      <LogApplicationDrawer
        isOpen={drawerOpen}
        onClose={() => { setDrawerOpen(false); setEditingApp(null) }}
        onSave={handleSave}
        onDelete={handleDelete}
        resumes={resumes}
        editingApplication={editingApp}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
