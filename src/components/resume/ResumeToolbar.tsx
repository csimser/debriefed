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
    <div className="bg-bg-secondary border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Resume Type Toggle */}
        <div className="flex bg-bg-tertiary rounded-md p-1">
          <button
            onClick={() => onToggleType('private')}
            className={`px-3 py-1.5 rounded text-xs font-heading uppercase tracking-wider transition-all ${
              resumeType === 'private'
                ? 'bg-gold text-bg-primary'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Private
          </button>
          <button
            onClick={() => onToggleType('federal')}
            className={`px-3 py-1.5 rounded text-xs font-heading uppercase tracking-wider transition-all ${
              resumeType === 'federal'
                ? 'bg-gold text-bg-primary'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Federal
          </button>
        </div>

        {/* Save indicator */}
        {saving && (
          <Badge variant="amber">Saving...</Badge>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Translate All */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onTranslateAll}
          disabled={translating}
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

        {/* Delete Button */}
        <button
          onClick={onDelete}
          className="p-2 text-text-muted hover:text-status-red hover:bg-status-red/10 rounded transition-all"
          title="Delete resume"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
