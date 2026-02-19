'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface AITranslation {
  id: string
  source_type: string
  military_term: string
  civilian_translation: string
  full_context: string | null
  model_used: string | null
  branch: string | null
  target_industry: string | null
  target_role: string | null
  suggested_table: string | null
  status: string
  occurrence_count: number
  created_at: string
  notes: string | null
}

interface AITranslationsResponse {
  translations: AITranslation[]
  total: number
  page: number
  limit: number
  counts: {
    pending: number
    approved: number
    rejected: number
  }
  stats: {
    capturedThisWeek: number
    approvedThisMonth: number
    estimatedSavings: string
  }
}

const SOURCE_TYPE_LABELS: Record<string, string> = {
  bullet_translation: 'Bullet',
  cover_letter: 'Cover Letter',
  linkedin_headline: 'LI Headline',
  linkedin_summary: 'LI Summary',
  job_match: 'Job Match',
  eval_extraction: 'Eval Extract',
  summary_generation: 'Summary',
}

const TABLE_OPTIONS = [
  { value: 'dict_phrase_translations', label: 'Phrase Translations' },
  { value: 'dict_military_jargon', label: 'Military Jargon' },
  { value: 'dict_acronyms', label: 'Acronyms' },
  { value: 'dict_bullet_patterns', label: 'Bullet Patterns' },
]

interface AdminAITranslationsPanelProps {
  adminId: string
}

export function AdminAITranslationsPanel({ adminId }: AdminAITranslationsPanelProps) {
  const [data, setData] = useState<AITranslationsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<Set<string>>(new Set())

  // Filters
  const [statusFilter, setStatusFilter] = useState('pending')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [branchFilter, setBranchFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('frequency')
  const [page, setPage] = useState(1)

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editMilitary, setEditMilitary] = useState('')
  const [editCivilian, setEditCivilian] = useState('')
  const [editTable, setEditTable] = useState('')
  const [editNotes, setEditNotes] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        source_type: sourceFilter,
        branch: branchFilter,
        sort: sortOrder,
        page: String(page),
      })
      const res = await fetch(`/api/admin/ai-translations?${params}`)
      if (res.ok) {
        setData(await res.json())
      }
    } catch (err) {
      console.error('Failed to fetch AI translations:', err)
    }
    setLoading(false)
  }, [statusFilter, sourceFilter, branchFilter, sortOrder, page])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleAction = async (action: 'approve' | 'reject', ids: string[], overrides?: {
    dictTable?: string
    militaryOverride?: string
    civilianOverride?: string
    notes?: string
  }) => {
    setProcessing(prev => new Set([...prev, ...ids]))

    try {
      const res = await fetch('/api/admin/ai-translations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          ids,
          ...overrides,
        }),
      })

      if (res.ok) {
        setSelected(prev => {
          const next = new Set(prev)
          ids.forEach(id => next.delete(id))
          return next
        })
        setEditingId(null)
        await fetchData()
      }
    } catch (err) {
      console.error(`Failed to ${action}:`, err)
    }

    setProcessing(prev => {
      const next = new Set(prev)
      ids.forEach(id => next.delete(id))
      return next
    })
  }

  const handleApprove = (id: string) => {
    const t = data?.translations.find(t => t.id === id)
    if (!t) return
    handleAction('approve', [id], {
      dictTable: t.suggested_table || undefined,
    })
  }

  const handleModifyAndApprove = () => {
    if (!editingId) return
    handleAction('approve', [editingId], {
      dictTable: editTable || undefined,
      militaryOverride: editMilitary || undefined,
      civilianOverride: editCivilian || undefined,
      notes: editNotes || undefined,
    })
  }

  const handleReject = (id: string) => {
    handleAction('reject', [id])
  }

  const handleBulkApprove = () => {
    if (selected.size === 0) return
    handleAction('approve', Array.from(selected))
  }

  const handleBulkReject = () => {
    if (selected.size === 0) return
    if (!confirm(`Reject ${selected.size} translations?`)) return
    handleAction('reject', Array.from(selected))
  }

  const startEdit = (t: AITranslation) => {
    setEditingId(t.id)
    setEditMilitary(t.military_term)
    setEditCivilian(t.civilian_translation)
    setEditTable(t.suggested_table || 'dict_phrase_translations')
    setEditNotes('')
  }

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (!data) return
    const allIds = data.translations.map(t => t.id)
    if (selected.size === allIds.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(allIds))
    }
  }

  return (
    <div className="space-y-4">
      {/* Stats Bar */}
      {data && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-bg-secondary/50 rounded-md p-3 text-center">
            <p className="text-xs text-text-muted uppercase">Captured This Week</p>
            <p className="text-lg font-bold text-status-blue">{data.stats.capturedThisWeek}</p>
          </div>
          <div className="bg-bg-secondary/50 rounded-md p-3 text-center">
            <p className="text-xs text-text-muted uppercase">Added to Dict This Month</p>
            <p className="text-lg font-bold text-status-green">{data.stats.approvedThisMonth}</p>
          </div>
          <div className="bg-bg-secondary/50 rounded-md p-3 text-center">
            <p className="text-xs text-text-muted uppercase">Est. AI Cost Saved</p>
            <p className="text-lg font-bold text-gold">${data.stats.estimatedSavings}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
          className="bg-bg-secondary border border-border rounded-md px-3 py-1.5 text-sm text-text focus:border-gold"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending{data ? ` (${data.counts.pending})` : ''}</option>
          <option value="approved">Approved{data ? ` (${data.counts.approved})` : ''}</option>
          <option value="rejected">Rejected{data ? ` (${data.counts.rejected})` : ''}</option>
        </select>
        <select
          value={sourceFilter}
          onChange={e => { setSourceFilter(e.target.value); setPage(1) }}
          className="bg-bg-secondary border border-border rounded-md px-3 py-1.5 text-sm text-text focus:border-gold"
        >
          <option value="all">All Types</option>
          <option value="bullet_translation">Bullets</option>
          <option value="eval_extraction">Eval Extract</option>
          <option value="cover_letter">Cover Letter</option>
          <option value="linkedin_headline">LI Headline</option>
          <option value="linkedin_summary">LI Summary</option>
          <option value="job_match">Job Match</option>
          <option value="summary_generation">Summary</option>
        </select>
        <select
          value={branchFilter}
          onChange={e => { setBranchFilter(e.target.value); setPage(1) }}
          className="bg-bg-secondary border border-border rounded-md px-3 py-1.5 text-sm text-text focus:border-gold"
        >
          <option value="all">All Branches</option>
          <option value="navy">Navy</option>
          <option value="army">Army</option>
          <option value="air_force">Air Force</option>
          <option value="marines">Marines</option>
          <option value="coast_guard">Coast Guard</option>
          <option value="space_force">Space Force</option>
        </select>
        <select
          value={sortOrder}
          onChange={e => { setSortOrder(e.target.value); setPage(1) }}
          className="bg-bg-secondary border border-border rounded-md px-3 py-1.5 text-sm text-text focus:border-gold"
        >
          <option value="frequency">Most Frequent</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
        <Button variant="secondary" size="sm" onClick={fetchData} disabled={loading}>
          {loading ? '...' : 'Refresh'}
        </Button>
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-gold/10 border border-gold/20 rounded-md">
          <span className="text-sm text-gold font-medium">{selected.size} selected</span>
          <button
            onClick={handleBulkApprove}
            className="px-3 py-1 bg-status-green text-bg-primary text-xs font-heading font-bold uppercase rounded hover:bg-status-green/90"
          >
            Approve All
          </button>
          <button
            onClick={handleBulkReject}
            className="px-3 py-1 bg-status-red text-white text-xs font-heading font-bold uppercase rounded hover:bg-status-red/90"
          >
            Reject All
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-xs text-text-muted hover:text-text ml-auto"
          >
            Clear
          </button>
        </div>
      )}

      {/* Translations List */}
      {loading && !data ? (
        <Card className="p-12 text-center">
          <p className="text-text-muted">Loading AI translations...</p>
        </Card>
      ) : !data || data.translations.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-text-muted text-sm">No AI translations found for this filter.</p>
        </Card>
      ) : (
        <>
          {/* Select All */}
          <div className="flex items-center gap-2 px-1">
            <input
              type="checkbox"
              checked={selected.size === data.translations.length && data.translations.length > 0}
              onChange={toggleSelectAll}
              className="rounded border-border"
            />
            <span className="text-xs text-text-dim uppercase">Select All</span>
            <span className="text-xs text-text-dim ml-auto">
              {data.total} total &middot; Page {data.page}
            </span>
          </div>

          <div className="space-y-3">
            {data.translations.map(t => (
              <Card key={t.id} className="p-4 space-y-3">
                {/* Header Row */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selected.has(t.id)}
                    onChange={() => toggleSelect(t.id)}
                    className="mt-1 rounded border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={
                        t.source_type === 'bullet_translation' ? 'gold' :
                        t.source_type === 'eval_extraction' ? 'amber' :
                        'default'
                      }>
                        {SOURCE_TYPE_LABELS[t.source_type] || t.source_type}
                      </Badge>
                      {t.branch && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-bg-secondary text-text-dim rounded uppercase">
                          {t.branch}
                        </span>
                      )}
                      <Badge variant={
                        t.status === 'pending' ? 'amber' :
                        t.status === 'approved' || t.status === 'modified' ? 'green' :
                        t.status === 'rejected' ? 'red' : 'default'
                      }>
                        {t.status}
                      </Badge>
                      {t.occurrence_count > 1 && (
                        <span className="text-xs font-bold text-gold">
                          Seen {t.occurrence_count}x
                        </span>
                      )}
                    </div>

                    {/* Term Translation */}
                    <div className="mt-2 p-3 bg-bg-secondary/50 rounded-md">
                      <p className="text-sm">
                        <span className="text-status-red font-medium">&ldquo;{t.military_term}&rdquo;</span>
                        <span className="text-text-dim mx-2">&rarr;</span>
                        <span className="text-status-green font-medium">&ldquo;{t.civilian_translation}&rdquo;</span>
                      </p>
                    </div>

                    {/* Context */}
                    {t.full_context && (
                      <p className="text-[11px] text-text-dim mt-1 line-clamp-2">
                        Context: {t.full_context}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-text-dim">
                      {t.suggested_table && (
                        <span>Suggested: {TABLE_OPTIONS.find(o => o.value === t.suggested_table)?.label || t.suggested_table}</span>
                      )}
                      {t.model_used && <span>Model: {t.model_used}</span>}
                      <span>{new Date(t.created_at).toLocaleDateString()}</span>
                      {t.target_role && <span>Role: {t.target_role}</span>}
                    </div>

                    {t.notes && (
                      <p className="text-[11px] text-text-dim mt-1 italic">Notes: {t.notes}</p>
                    )}
                  </div>
                </div>

                {/* Edit Mode */}
                {editingId === t.id ? (
                  <div className="space-y-2 pl-8 border-t border-border pt-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-text-dim uppercase mb-1">Military Term</label>
                        <input
                          type="text"
                          value={editMilitary}
                          onChange={e => setEditMilitary(e.target.value)}
                          className="w-full bg-bg-secondary border border-border rounded px-3 py-1.5 text-sm text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-text-dim uppercase mb-1">Civilian Translation</label>
                        <input
                          type="text"
                          value={editCivilian}
                          onChange={e => setEditCivilian(e.target.value)}
                          className="w-full bg-bg-secondary border border-border rounded px-3 py-1.5 text-sm text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-text-dim uppercase mb-1">Target Dict Table</label>
                        <select
                          value={editTable}
                          onChange={e => setEditTable(e.target.value)}
                          className="w-full bg-bg-secondary border border-border rounded px-3 py-1.5 text-sm text-text focus:border-gold"
                        >
                          {TABLE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-text-dim uppercase mb-1">Notes (optional)</label>
                        <input
                          type="text"
                          value={editNotes}
                          onChange={e => setEditNotes(e.target.value)}
                          placeholder="Admin notes"
                          className="w-full bg-bg-secondary border border-border rounded px-3 py-1.5 text-sm text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleModifyAndApprove}
                        disabled={processing.has(t.id)}
                        className="px-4 py-1.5 bg-status-green text-bg-primary text-xs font-heading font-bold uppercase rounded hover:bg-status-green/90 disabled:opacity-50"
                      >
                        {processing.has(t.id) ? '...' : 'Modify & Add to Dict'}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-1.5 bg-bg-secondary text-text-muted text-xs font-heading uppercase rounded hover:bg-bg-tertiary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Action Buttons */
                  t.status === 'pending' && (
                    <div className="flex gap-2 pl-8">
                      <button
                        onClick={() => handleApprove(t.id)}
                        disabled={processing.has(t.id)}
                        className="px-3 py-1.5 bg-status-green text-bg-primary text-xs font-heading font-bold uppercase rounded hover:bg-status-green/90 disabled:opacity-50"
                      >
                        {processing.has(t.id) ? '...' : 'Approve & Add'}
                      </button>
                      <button
                        onClick={() => startEdit(t)}
                        className="px-3 py-1.5 bg-status-blue/20 text-status-blue text-xs font-heading font-bold uppercase rounded hover:bg-status-blue/30"
                      >
                        Modify & Add
                      </button>
                      <button
                        onClick={() => handleReject(t.id)}
                        disabled={processing.has(t.id)}
                        className="px-3 py-1.5 bg-status-red/20 text-status-red text-xs font-heading font-bold uppercase rounded hover:bg-status-red/30 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )
                )}
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {data.total > data.limit && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-text-muted">
                Page {page} of {Math.ceil(data.total / data.limit)}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= Math.ceil(data.total / data.limit)}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
