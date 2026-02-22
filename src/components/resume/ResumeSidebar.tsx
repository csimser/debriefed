'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { DeleteResumeModal } from './DeleteResumeModal'
import { TIER_LIMITS, getUserTier } from '@/lib/tier-utils'
import { UpgradeLink } from '@/components/modals/UpgradeModal'

const SIDEBAR_STORAGE_KEY = 'resume-sidebar-collapsed'

interface Resume {
  id: string
  name: string
  template: string
  resume_type?: 'private' | 'federal'
  updated_at: string
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
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function ResumeSidebar({ resumes, selectedId, onSelect, onCreate, onDelete, userPlan, usage = { private_downloads: 0, federal_downloads: 0 }, isCollapsed: controlledCollapsed, onToggleCollapse }: ResumeSidebarProps) {
  // Use centralized tier limits
  const userTier = getUserTier({ tier: userPlan })
  const resumeLimit = TIER_LIMITS[userTier].resumes
  const canCreateNew = resumes.length < resumeLimit
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; resume: Resume | null }>({
    isOpen: false,
    resume: null,
  })

  // Internal collapse state (used if not controlled externally)
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Use controlled or internal state
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed

  // Initialize from localStorage and handle responsive defaults
  useEffect(() => {
    setIsHydrated(true)

    const savedState = localStorage.getItem(SIDEBAR_STORAGE_KEY)
    const width = window.innerWidth

    // Default to collapsed on screens under 1200px, unless user has saved preference
    if (savedState !== null) {
      setInternalCollapsed(savedState === 'true')
    } else {
      setInternalCollapsed(width < 1200)
    }

    // Handle window resize
    const handleResize = () => {
      const currentWidth = window.innerWidth
      const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY)

      // Only auto-collapse if no saved preference
      if (saved === null) {
        setInternalCollapsed(currentWidth < 1200)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Toggle collapse handler
  const handleToggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse()
    } else {
      const newState = !internalCollapsed
      setInternalCollapsed(newState)
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(newState))
    }
  }

  const openDeleteModal = (e: React.MouseEvent, resume: Resume) => {
    e.stopPropagation()
    setDeleteModal({ isOpen: true, resume })
  }

  const handleDeleted = () => {
    if (deleteModal.resume) {
      onDelete(deleteModal.resume.id)
    }
  }

  // Prevent hydration mismatch
  if (!isHydrated) {
    return (
      <div className="w-64 bg-bg-secondary border-r border-border p-4 flex flex-col">
        <div className="h-8" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'bg-bg-secondary border-r border-border flex flex-col relative transition-all duration-250 ease-in-out',
        isCollapsed ? 'w-[50px]' : 'w-64'
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={handleToggleCollapse}
        className={cn(
          'absolute top-3 -right-3 w-6 h-6 bg-bg-tertiary border border-border rounded-full flex items-center justify-center',
          'hover:bg-gold hover:text-bg-primary hover:border-gold transition-all z-10'
        )}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg
          className={cn('w-4 h-4 transition-transform duration-250', isCollapsed && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Collapsed View - Icon Strip */}
      {isCollapsed ? (
        <div className="flex flex-col items-center py-4 gap-2">
          {/* Header icon */}
          <div className="w-8 h-8 bg-bg-tertiary rounded flex items-center justify-center mb-2" title="My Resumes">
            <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 9h6M9 13h6M9 17h4"/>
            </svg>
          </div>

          {/* New button */}
          {canCreateNew && (
            <button
              onClick={onCreate}
              className="w-8 h-8 bg-gold hover:bg-gold-bright text-bg-primary rounded flex items-center justify-center transition-colors"
              title="Create new resume"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          )}

          {/* Resume icons */}
          <div className="flex-1 flex flex-col gap-1 mt-2 overflow-auto w-full px-2">
            {resumes.map((resume, index) => (
              <button
                key={resume.id}
                onClick={() => onSelect(resume.id)}
                className={cn(
                  'w-full h-8 rounded flex items-center justify-center transition-all relative group',
                  selectedId === resume.id
                    ? 'bg-gold-dim text-gold'
                    : 'bg-bg-tertiary hover:bg-bg-hover text-text-muted hover:text-text'
                )}
                title={resume.name}
              >
                <span className="text-xs font-bold">{index + 1}</span>
                {/* Tooltip */}
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-bg-tertiary border border-border rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
                  <span className="text-xs font-medium">{resume.name}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Resume count */}
          <div className="mt-auto pt-2 text-xs text-text-dim" title={`${resumes.length}/${resumeLimit} resumes`}>
            {resumes.length}/{resumeLimit}
          </div>
        </div>
      ) : (
        /* Expanded View - Full Panel */
        <div className="p-4 flex flex-col flex-1 overflow-hidden">
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
              <UpgradeLink className="text-xs text-gold hover:underline">
                Upgrade for more →
              </UpgradeLink>
            </div>
          )}

          <div className="flex-1 space-y-2 overflow-auto">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                onClick={() => onSelect(resume.id)}
                className={cn(
                  'w-full p-3 rounded-lg text-left transition-all cursor-pointer relative group',
                  selectedId === resume.id
                    ? 'bg-gold-dim border border-gold/30'
                    : 'bg-bg-tertiary hover:bg-bg-hover border border-transparent'
                )}
              >
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

                <div className="font-heading text-sm font-semibold truncate pr-6">{resume.name}</div>
                <div className="text-xs text-text-muted mt-1">
                  {new Date(resume.updated_at).toLocaleDateString()}
                </div>
              </div>
            ))}

            {resumes.length === 0 && (
              <p className="text-text-muted text-sm text-center py-8">No resumes yet</p>
            )}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteResumeModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, resume: null })}
        resume={deleteModal.resume ? {
          id: deleteModal.resume.id,
          name: deleteModal.resume.name,
        } : { id: '', name: '' }}
        onDeleted={handleDeleted}
      />
    </div>
  )
}
