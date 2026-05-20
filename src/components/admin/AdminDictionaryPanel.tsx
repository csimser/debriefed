'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  approveSubmission,
  rejectSubmission,
  dismissMissingTerm,
  markFalsePositive,
  addMissingTermToDict,
  type Submission,
  type MissingTerm,
} from '@/lib/dictionary/communityQueries'
import { AdminAITranslationsPanel } from './AdminAITranslationsPanel'

interface AdminDictionaryPanelProps {
  pendingSubmissions: Submission[]
  missingTerms: MissingTerm[]
  adminId: string
  aiTranslationsPendingCount?: number
}

type TargetTable = 'dict_phrase_translations' | 'dict_military_jargon' | 'dict_acronyms'

interface AddFormState {
  termId: string
  militaryTerm: string
  civilianTranslation: string
  targetTable: TargetTable
  branch: string
  category: string
  editable: boolean // true = Edit & Add mode (military term editable)
}

export function AdminDictionaryPanel({
  pendingSubmissions: initialPending,
  missingTerms: initialMissing,
  adminId,
  aiTranslationsPendingCount = 0,
}: AdminDictionaryPanelProps) {
  const [pending, setPending] = useState(initialPending)
  const [missing, setMissing] = useState(initialMissing)
  const [activeTab, setActiveTab] = useState<'ai-translations' | 'pending' | 'missing'>('ai-translations')
  const [processing, setProcessing] = useState<string | null>(null)
  const [overrides, setOverrides] = useState<Record<string, string>>({})
  const [addForm, setAddForm] = useState<AddFormState | null>(null)

  const handleApprove = async (subId: string) => {
    setProcessing(subId)
    const override = overrides[subId]?.trim() || undefined
    const result = await approveSubmission(subId, override)
    if (result.success) {
      setPending(prev => prev.filter(s => s.id !== subId))
    } else {
      alert(`Failed: ${result.error}`)
    }
    setProcessing(null)
  }

  const handleReject = async (subId: string) => {
    const notes = prompt('Rejection reason (optional):')
    setProcessing(subId)
    const result = await rejectSubmission(subId, notes || undefined)
    if (result.success) {
      setPending(prev => prev.filter(s => s.id !== subId))
    } else {
      alert(`Failed: ${result.error}`)
    }
    setProcessing(null)
  }

  // ── Missing term actions ───────────────────────────────────────────────

  const openAddForm = (term: MissingTerm, editable: boolean) => {
    setAddForm({
      termId: term.id,
      militaryTerm: term.term,
      civilianTranslation: '',
      targetTable: 'dict_military_jargon',
      branch: term.branch || '',
      category: '',
      editable,
    })
  }

  const handleAddToDict = async () => {
    if (!addForm) return
    if (!addForm.civilianTranslation.trim()) {
      alert('Civilian translation is required')
      return
    }
    setProcessing(addForm.termId)
    const result = await addMissingTermToDict({
      termId: addForm.termId,
      militaryTerm: addForm.militaryTerm,
      civilianTranslation: addForm.civilianTranslation,
      targetTable: addForm.targetTable,
      branch: addForm.branch || undefined,
      category: addForm.category || undefined,
    })
    if (result.success) {
      setMissing(prev => prev.filter(t => t.id !== addForm.termId))
      setAddForm(null)
    } else {
      alert(`Failed: ${result.error}`)
    }
    setProcessing(null)
  }

  const handleDismiss = async (termId: string) => {
    setProcessing(termId)
    const result = await dismissMissingTerm(termId)
    if (result.success) {
      setMissing(prev => prev.filter(t => t.id !== termId))
    } else {
      alert(`Failed: ${result.error}`)
    }
    setProcessing(null)
  }

  const handleFalsePositive = async (termId: string) => {
    setProcessing(termId)
    const result = await markFalsePositive(termId)
    if (result.success) {
      setMissing(prev => prev.filter(t => t.id !== termId))
    } else {
      alert(`Failed: ${result.error}`)
    }
    setProcessing(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wider">Dictionary Management</h1>
        <p className="text-text-muted text-sm mt-1">
          Review community submissions, AI translations, and track missing terms
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-status-blue">{aiTranslationsPendingCount}</div>
          <div className="text-xs text-text-dim uppercase tracking-wider">AI Translations</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gold">{pending.length}</div>
          <div className="text-xs text-text-dim uppercase tracking-wider">Community Submissions</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-status-amber">{missing.length}</div>
          <div className="text-xs text-text-dim uppercase tracking-wider">Missing Terms</div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-bg-secondary rounded-lg p-1">
        <button
          onClick={() => setActiveTab('ai-translations')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-heading uppercase tracking-wider transition-all ${
            activeTab === 'ai-translations'
              ? 'bg-gold text-bg-primary font-bold'
              : 'text-text-muted hover:text-text'
          }`}
        >
          AI Translations ({aiTranslationsPendingCount})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-heading uppercase tracking-wider transition-all ${
            activeTab === 'pending'
              ? 'bg-gold text-bg-primary font-bold'
              : 'text-text-muted hover:text-text'
          }`}
        >
          Community ({pending.length})
        </button>
        <button
          onClick={() => setActiveTab('missing')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-heading uppercase tracking-wider transition-all ${
            activeTab === 'missing'
              ? 'bg-gold text-bg-primary font-bold'
              : 'text-text-muted hover:text-text'
          }`}
        >
          Missing ({missing.length})
        </button>
      </div>

      {/* AI Translations Panel */}
      {activeTab === 'ai-translations' && (
        <AdminAITranslationsPanel adminId={adminId} />
      )}

      {/* Pending Submissions */}
      {activeTab === 'pending' && (
        <div className="space-y-3">
          {pending.length === 0 ? (
            <Card className="p-6 text-center text-text-dim text-sm">
              No pending submissions. All caught up!
            </Card>
          ) : (
            pending.map(sub => (
              <Card key={sub.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-text">{sub.military_term}</span>
                      <Badge>{sub.submission_type}</Badge>
                      <span className="text-[10px] px-1.5 py-0.5 bg-bg-secondary text-text-dim rounded">
                        {sub.branch}
                      </span>
                      {sub.category && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-bg-secondary text-text-dim rounded">
                          {sub.category}
                        </span>
                      )}
                    </div>
                    {sub.suggested_civilian && (
                      <p className="text-text-muted text-sm mt-1">
                        Suggested: <span className="text-status-green">{sub.suggested_civilian}</span>
                      </p>
                    )}
                    {sub.context_notes && (
                      <p className="text-[11px] text-text-dim mt-1">
                        Context: {sub.context_notes}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-text-dim">
                      <span>{new Date(sub.created_at).toLocaleDateString()}</span>
                      {sub.upvotes > 0 && (
                        <span className="text-gold">{sub.upvotes} upvote{sub.upvotes !== 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Override civilian translation */}
                <div>
                  <input
                    type="text"
                    value={overrides[sub.id] || ''}
                    onChange={e => setOverrides(prev => ({ ...prev, [sub.id]: e.target.value }))}
                    placeholder="Override civilian translation (optional)"
                    className="w-full bg-bg-secondary border border-border rounded px-3 py-1.5 text-sm text-text placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold/25"
                    autoComplete="off"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(sub.id)}
                    disabled={processing === sub.id}
                    className="px-4 py-1.5 bg-status-green text-bg-primary text-xs font-heading font-bold uppercase rounded hover:bg-status-green/90 disabled:opacity-50 transition-colors"
                  >
                    {processing === sub.id ? '...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleReject(sub.id)}
                    disabled={processing === sub.id}
                    className="px-4 py-1.5 bg-status-red text-white text-xs font-heading font-bold uppercase rounded hover:bg-status-red/90 disabled:opacity-50 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Missing Terms */}
      {activeTab === 'missing' && (
        <div className="space-y-3">
          {missing.length === 0 ? (
            <Card className="p-6 text-center text-text-dim text-sm">
              No missing terms logged. Dictionary coverage is good!
            </Card>
          ) : (
            missing.map(term => (
              <Card key={term.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-text">{term.term}</span>
                      {term.branch && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-bg-secondary text-text-dim rounded uppercase">
                          {term.branch}
                        </span>
                      )}
                    </div>
                    {term.source_context && (
                      <p className="text-[11px] text-text-dim mt-1 line-clamp-2">
                        &ldquo;{term.source_context}&rdquo;
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={term.hit_count >= 10 ? 'red' : term.hit_count >= 5 ? 'amber' : 'default'}>
                      {term.hit_count} hit{term.hit_count !== 1 ? 's' : ''}
                    </Badge>
                    <span className="text-[10px] text-text-dim">
                      {new Date(term.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Add form (shown when "Add to Dictionary" or "Edit & Add" is clicked for this term) */}
                {addForm?.termId === term.id ? (
                  <div className="border border-border rounded-lg p-3 bg-bg-secondary space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-text-dim block mb-1">Military Term</label>
                        <input
                          type="text"
                          value={addForm.militaryTerm}
                          onChange={e => setAddForm(prev => prev ? { ...prev, militaryTerm: e.target.value } : null)}
                          disabled={!addForm.editable}
                          className="w-full bg-bg-primary border border-border rounded px-3 py-1.5 text-sm text-text disabled:opacity-60 focus:border-gold focus:ring-1 focus:ring-gold/25"
                          autoComplete="off"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-text-dim block mb-1">Civilian Translation</label>
                        <input
                          type="text"
                          value={addForm.civilianTranslation}
                          onChange={e => setAddForm(prev => prev ? { ...prev, civilianTranslation: e.target.value } : null)}
                          placeholder="Enter civilian equivalent..."
                          className="w-full bg-bg-primary border border-border rounded px-3 py-1.5 text-sm text-text placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold/25"
                          autoFocus
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-text-dim block mb-1">Target Table</label>
                        <select
                          value={addForm.targetTable}
                          onChange={e => setAddForm(prev => prev ? { ...prev, targetTable: e.target.value as TargetTable } : null)}
                          className="w-full bg-bg-primary border border-border rounded px-3 py-1.5 text-sm text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
                          autoComplete="off"
                        >
                          <option value="dict_military_jargon">Military Jargon</option>
                          <option value="dict_phrase_translations">Phrase Translations</option>
                          <option value="dict_acronyms">Acronyms</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-text-dim block mb-1">Branch</label>
                        <select
                          value={addForm.branch}
                          onChange={e => setAddForm(prev => prev ? { ...prev, branch: e.target.value } : null)}
                          className="w-full bg-bg-primary border border-border rounded px-3 py-1.5 text-sm text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
                          autoComplete="off"
                        >
                          <option value="">All Branches</option>
                          <option value="army">Army</option>
                          <option value="navy">Navy</option>
                          <option value="air_force">Air Force</option>
                          <option value="marines">Marines</option>
                          <option value="coast_guard">Coast Guard</option>
                          <option value="space_force">Space Force</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-text-dim block mb-1">Category</label>
                        <select
                          value={addForm.category}
                          onChange={e => setAddForm(prev => prev ? { ...prev, category: e.target.value } : null)}
                          className="w-full bg-bg-primary border border-border rounded px-3 py-1.5 text-sm text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
                          autoComplete="off"
                        >
                          <option value="">General</option>
                          <option value="rank_title">Rank / Title</option>
                          <option value="equipment">Equipment</option>
                          <option value="operations">Operations</option>
                          <option value="logistics">Logistics</option>
                          <option value="training">Training</option>
                          <option value="admin">Administrative</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="medical">Medical</option>
                          <option value="communications">Communications</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddToDict}
                        disabled={processing === term.id}
                        className="px-4 py-1.5 bg-status-green text-bg-primary text-xs font-heading font-bold uppercase rounded hover:bg-status-green/90 disabled:opacity-50 transition-colors"
                      >
                        {processing === term.id ? '...' : 'Save to Dictionary'}
                      </button>
                      <button
                        onClick={() => setAddForm(null)}
                        className="px-4 py-1.5 bg-bg-primary border border-border text-text-muted text-xs font-heading uppercase rounded hover:text-text transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Action buttons */
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => openAddForm(term, false)}
                      disabled={processing === term.id}
                      className="px-3 py-1.5 bg-status-green text-bg-primary text-xs font-heading font-bold uppercase rounded hover:bg-status-green/90 disabled:opacity-50 transition-colors"
                    >
                      Add to Dictionary
                    </button>
                    <button
                      onClick={() => openAddForm(term, true)}
                      disabled={processing === term.id}
                      className="px-3 py-1.5 bg-status-blue text-white text-xs font-heading font-bold uppercase rounded hover:bg-status-blue/90 disabled:opacity-50 transition-colors"
                    >
                      Edit &amp; Add
                    </button>
                    <button
                      onClick={() => handleDismiss(term.id)}
                      disabled={processing === term.id}
                      className="px-3 py-1.5 bg-bg-secondary border border-border text-text-muted text-xs font-heading uppercase rounded hover:text-text disabled:opacity-50 transition-colors"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleFalsePositive(term.id)}
                      disabled={processing === term.id}
                      className="px-3 py-1.5 bg-status-red/10 border border-status-red/30 text-status-red text-xs font-heading uppercase rounded hover:bg-status-red/20 disabled:opacity-50 transition-colors"
                    >
                      Not a Term
                    </button>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
