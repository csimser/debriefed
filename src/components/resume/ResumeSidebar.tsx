'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { DeleteResumeModal } from './DeleteResumeModal'
import { TIER_LIMITS, getUserTier } from '@/lib/tier-utils'

interface Resume {
  id: string
  name: string
  template: string
  resume_type?: 'private' | 'federal'
  updated_at: string
  downloaded_at?: string | null
}

interface ResumeSidebarProps {
  resumes: Resume[]
  selectedId: string | null
  onSelect: (id: string) => void
  onCreate: () => void
  onDelete: (id: string) => void
  userPlan: string
  usage?: {
    private_downloads: number
    federal_downloads: number
  }
}

export function ResumeSidebar({ resumes, selectedId, onSelect, onCreate, onDelete, userPlan, usage = { private_downloads: 0, federal_downloads: 0 } }: ResumeSidebarProps) {
  // Use centralized tier limits
  const userTier = getUserTier({ tier: userPlan })
  const resumeLimit = TIER_LIMITS[userTier].resumes
  const isFreeUser = userTier === 'free'
  const canCreateNew = resumes.length < resumeLimit
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; resume: Resume | null }>({
    isOpen: false,
    resume: null,
  })

  const openDeleteModal = (e: React.MouseEvent, resume: Resume) => {
    e.stopPropagation()
    setDeleteModal({ isOpen: true, resume })
  }

  const handleDeleted = () => {
    if (deleteModal.resume) {
      onDelete(deleteModal.resume.id)
    }
  }

  return (
    <div className="w-64 bg-bg-secondary border-r border-border p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wider">My Resumes</h2>
        {canCreateNew ? (
          <Button size="sm" onClick={onCreate}>+ New</Button>
        ) : (
          <span className="text-xs text-text-muted">{resumes.length}/{resumeLimit}</span>
        )}
      </div>

      {/* Limit reached message */}
      {!canCreateNew && (
        <div className="mb-4 p-3 bg-bg-tertiary rounded-lg border border-border">
          <p className="text-xs text-text-muted mb-2">
            You've reached your {userPlan} plan limit of {resumeLimit} resume{resumeLimit > 1 ? 's' : ''}.
          </p>
          <Link href="/pricing" className="text-xs text-gold hover:underline">
            Upgrade for more →
          </Link>
        </div>
      )}

      <div className="flex-1 space-y-2 overflow-auto">
        {resumes.map((resume) => {
          const isLocked = isFreeUser && resume.downloaded_at != null
          return (
            <div
              key={resume.id}
              onClick={() => onSelect(resume.id)}
              className={cn(
                'w-full p-3 rounded-lg text-left transition-all cursor-pointer relative group',
                selectedId === resume.id
                  ? 'bg-gold-dim border border-gold/30'
                  : 'bg-bg-tertiary hover:bg-bg-hover border border-transparent',
                isLocked && 'opacity-70'
              )}
            >
              {/* Lock icon for downloaded free tier resumes */}
              {isLocked && (
                <div className="absolute top-2 left-2" title="Locked - Upgrade to edit">
                  <svg className="w-3.5 h-3.5 text-status-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
              )}

              {/* Delete button - top right */}
              <button
                onClick={(e) => openDeleteModal(e, resume)}
                className="absolute top-2 right-2 p-1.5 text-text-dim hover:text-status-red hover:bg-status-red/10 rounded opacity-0 group-hover:opacity-100 transition-all"
                title="Delete resume"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>

              <div className={cn(
                "font-heading text-sm font-semibold truncate pr-6",
                isLocked && "pl-5"
              )}>{resume.name}</div>
              <div className={cn(
                "text-xs text-text-muted mt-1",
                isLocked && "pl-5"
              )}>
                {new Date(resume.updated_at).toLocaleDateString()}
                {isLocked && <span className="text-status-amber ml-1">(Locked)</span>}
              </div>
            </div>
          )
        })}

        {resumes.length === 0 && (
          <p className="text-text-muted text-sm text-center py-8">No resumes yet</p>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteResumeModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, resume: null })}
        resume={deleteModal.resume ? {
          id: deleteModal.resume.id,
          name: deleteModal.resume.name,
          resume_type: deleteModal.resume.resume_type || 'private',
          has_been_downloaded: (deleteModal.resume.resume_type || 'private') === 'federal'
            ? usage.federal_downloads > 0
            : usage.private_downloads > 0
        } : { id: '', name: '' }}
        userPlan={userPlan}
        usage={usage}
        onDeleted={handleDeleted}
      />
    </div>
  )
}
