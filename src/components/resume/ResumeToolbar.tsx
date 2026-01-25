'use client'

import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ExportMenu } from './ExportMenu'

interface ResumeToolbarProps {
  resumeId: string | null
  resumeName: string
  userId: string
  resumeType: 'private' | 'federal'
  template: string
  onToggleType: (type: 'private' | 'federal') => void
  onTranslateAll: () => void
  onDelete: () => void
  translating: boolean
  saving: boolean
  onLimitReached?: (error: string, tier: string) => void
}

export function ResumeToolbar({
  resumeId,
  resumeName,
  userId,
  resumeType,
  template,
  onToggleType,
  onTranslateAll,
  onDelete,
  translating,
  saving,
  onLimitReached,
}: ResumeToolbarProps) {
  return (
    <div className="bg-bg-secondary border-b border-border px-3 md:px-4 py-2 md:py-3">
      {/* Mobile: Two rows, Desktop: single row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3">
        {/* Row 1: Type toggle and save indicator */}
        <div className="flex items-center justify-between md:justify-start gap-3">
          {/* Resume Type Toggle - larger touch targets on mobile */}
          <div className="flex bg-bg-tertiary rounded-lg p-1">
            <button
              onClick={() => onToggleType('private')}
              className={`px-4 py-2.5 md:px-3 md:py-1.5 rounded-md text-xs font-heading uppercase tracking-wider transition-all min-h-[40px] md:min-h-0 ${
                resumeType === 'private'
                  ? 'bg-gold text-bg-primary'
                  : 'text-text-muted hover:text-text active:bg-bg-secondary'
              }`}
            >
              Private
            </button>
            <button
              onClick={() => onToggleType('federal')}
              className={`px-4 py-2.5 md:px-3 md:py-1.5 rounded-md text-xs font-heading uppercase tracking-wider transition-all min-h-[40px] md:min-h-0 ${
                resumeType === 'federal'
                  ? 'bg-gold text-bg-primary'
                  : 'text-text-muted hover:text-text active:bg-bg-secondary'
              }`}
            >
              Federal
            </button>
          </div>

          {/* Save indicator */}
          {saving && (
            <Badge variant="amber">Saving...</Badge>
          )}

          {/* Delete Button - visible on mobile in top row */}
          <button
            onClick={onDelete}
            className="md:hidden p-2.5 text-text-muted hover:text-status-red hover:bg-status-red/10 rounded-lg transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Delete resume"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>

        {/* Row 2 on mobile: Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Translate All - hidden on mobile to reduce clutter */}
          <Button
            variant="secondary"
            size="sm"
            onClick={onTranslateAll}
            disabled={translating}
            className="hidden md:inline-flex"
          >
            {translating ? 'Translating...' : '✦ Translate All'}
          </Button>

          {/* Export Menu - only show when resume is selected */}
          {resumeId && (
            <ExportMenu
              resumeId={resumeId}
              resumeName={resumeName}
              userId={userId}
              template={template}
              onLimitReached={onLimitReached}
            />
          )}

          {/* Delete Button - desktop only, hidden on mobile (shown in first row) */}
          <button
            onClick={onDelete}
            className="hidden md:flex p-2 text-text-muted hover:text-status-red hover:bg-status-red/10 rounded transition-all"
            title="Delete resume"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
