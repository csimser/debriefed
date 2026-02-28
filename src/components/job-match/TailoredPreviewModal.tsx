'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ModalShell } from '@/components/ui/ModalShell'

// ============================================================================
// Types
// ============================================================================

export interface PreviewChange {
  id: string
  type: 'bullet_rewrite' | 'skill_add' | 'skill_remove' | 'keyword_add'
  /** Section label, e.g., "Experience - Operations Manager" */
  label: string
  /** Original text (for rewrites) */
  before?: string
  /** Final text to apply (dictionary-translated) */
  after: string
  /** AI's raw suggestion before dictionary translation */
  aiOriginal?: string
  /** User decision */
  status: 'keep' | 'edit' | 'skip'
  /** User's custom edit */
  editedValue?: string
}

interface TailoredPreviewModalProps {
  title: string
  description: string
  targetResumeName: string
  changes: PreviewChange[]
  onApply: (finalChanges: PreviewChange[]) => void
  onCancel: () => void
  applying?: boolean
}

// ============================================================================
// Component
// ============================================================================

export function TailoredPreviewModal({
  title,
  description,
  targetResumeName,
  changes: initialChanges,
  onApply,
  onCancel,
  applying = false,
}: TailoredPreviewModalProps) {
  const [changes, setChanges] = useState<PreviewChange[]>(initialChanges)
  const [editingId, setEditingId] = useState<string | null>(null)

  const updateStatus = (id: string, status: PreviewChange['status']) => {
    setChanges(prev => prev.map(c => c.id === id ? { ...c, status } : c))
    if (status !== 'edit') setEditingId(null)
  }

  const updateEditedValue = (id: string, value: string) => {
    setChanges(prev => prev.map(c => c.id === id ? { ...c, editedValue: value, status: 'edit' } : c))
  }

  const keptCount = changes.filter(c => c.status !== 'skip').length
  const bulletRewrites = changes.filter(c => c.type === 'bullet_rewrite')
  const skillAdds = changes.filter(c => c.type === 'skill_add' || c.type === 'keyword_add')
  const skillRemoves = changes.filter(c => c.type === 'skill_remove')

  const renderChangeItem = (change: PreviewChange) => {
    const isSkipped = change.status === 'skip'
    const isEditing = editingId === change.id

    return (
      <div
        key={change.id}
        className={`p-4 rounded-lg border transition-all ${
          isSkipped
            ? 'border-border/50 bg-bg-tertiary/30 opacity-50'
            : change.status === 'edit'
              ? 'border-status-blue/30 bg-status-blue/5'
              : 'border-gold/20 bg-gold/5'
        }`}
      >
        {/* Bullet rewrite */}
        {change.type === 'bullet_rewrite' && (
          <div className="space-y-2 mb-3">
            <div className="text-xs text-text-dim mb-1">{change.label}</div>
            {change.before && (
              <div className="text-sm text-text-dim line-through leading-relaxed">
                {change.before}
              </div>
            )}
            {isEditing ? (
              <textarea
                autoComplete="off"
                value={change.editedValue ?? change.after}
                onChange={e => updateEditedValue(change.id, e.target.value)}
                className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-sm text-text focus:border-gold focus:ring-1 focus:ring-gold/25 resize-none"
                rows={3}
                autoFocus
              />
            ) : (
              <div className="text-sm text-text leading-relaxed">
                → {change.editedValue || change.after}
              </div>
            )}
            {/* Show dict translation note if AI original differs */}
            {change.aiOriginal && change.aiOriginal !== change.after && !isEditing && (
              <div className="text-[11px] text-text-dim italic">
                Dictionary translated military terms in this suggestion
              </div>
            )}
          </div>
        )}

        {/* Skill/keyword add */}
        {(change.type === 'skill_add' || change.type === 'keyword_add') && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-status-green text-sm">+</span>
            <span className="text-sm text-text">{change.after}</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-bg-tertiary text-text-dim rounded uppercase">
              {change.type === 'keyword_add' ? 'ATS Keyword' : 'Skill'}
            </span>
          </div>
        )}

        {/* Skill remove */}
        {change.type === 'skill_remove' && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-status-red text-sm">-</span>
            <span className="text-sm text-text line-through">{change.after}</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-bg-tertiary text-text-dim rounded uppercase">
              Remove
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateStatus(change.id, 'keep')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              change.status === 'keep'
                ? 'bg-status-green text-white'
                : 'bg-bg-secondary text-text-muted hover:text-text border border-border'
            }`}
          >
            Keep
          </button>
          {change.type === 'bullet_rewrite' && (
            <button
              onClick={() => {
                if (isEditing) {
                  setEditingId(null)
                } else {
                  setEditingId(change.id)
                  if (change.status !== 'edit') updateStatus(change.id, 'edit')
                }
              }}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                change.status === 'edit'
                  ? 'bg-status-blue text-white'
                  : 'bg-bg-secondary text-text-muted hover:text-text border border-border'
              }`}
            >
              Edit
            </button>
          )}
          <button
            onClick={() => updateStatus(change.id, 'skip')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              change.status === 'skip'
                ? 'bg-status-red text-white'
                : 'bg-bg-secondary text-text-muted hover:text-text border border-border'
            }`}
          >
            Skip
          </button>
        </div>
      </div>
    )
  }

  return (
    <ModalShell isOpen={true} onClose={onCancel} title={title} maxWidth="max-w-4xl">
      <div className="bg-bg-card border border-border rounded-xl w-full max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-border flex-shrink-0">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wider flex items-center gap-2">
            <span className="text-gold">◈</span> {title}
          </h2>
          <p className="text-sm text-text-muted mt-1">{description}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-text-dim">Target:</span>
            <span className="text-xs font-semibold text-gold">{targetResumeName}</span>
          </div>
        </div>

        {/* Changes list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Bullet Rewrites Section */}
          {bulletRewrites.length > 0 && (
            <div>
              <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-2">
                <span className="text-gold">◆</span> Bullet Rewrites ({bulletRewrites.length})
              </h3>
              <div className="space-y-3">
                {bulletRewrites.map(renderChangeItem)}
              </div>
            </div>
          )}

          {/* Skills/Keywords Section */}
          {skillAdds.length > 0 && (
            <div>
              <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-2">
                <span className="text-status-green">+</span> Skills &amp; Keywords ({skillAdds.length})
              </h3>
              <div className="space-y-2">
                {skillAdds.map(renderChangeItem)}
              </div>
            </div>
          )}

          {/* Removals Section */}
          {skillRemoves.length > 0 && (
            <div>
              <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-2">
                <span className="text-status-red">-</span> Skills to Remove ({skillRemoves.length})
              </h3>
              <div className="space-y-2">
                {skillRemoves.map(renderChangeItem)}
              </div>
            </div>
          )}

          {changes.length === 0 && (
            <div className="text-center text-text-dim text-sm py-8">
              No changes to preview.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-text-muted">
            {keptCount} of {changes.length} change{changes.length !== 1 ? 's' : ''} will be applied
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onCancel} disabled={applying}>
              Cancel
            </Button>
            <Button
              onClick={() => onApply(changes)}
              disabled={applying || keptCount === 0}
              loading={applying}
            >
              Apply {keptCount} Change{keptCount !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </div>
    </ModalShell>
  )
}
