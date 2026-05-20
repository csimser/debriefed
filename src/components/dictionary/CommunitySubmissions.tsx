'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  submitTerm,
  getUserSubmissions,
  getTopMissingTerms,
  upvoteMissingTerm,
  getCommunityStats,
  type SubmissionData,
  type Submission,
  type MissingTerm,
  type CommunityStats,
} from '@/lib/dictionary/communityQueries'

const CATEGORIES = [
  { value: '', label: 'Select category...' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'operations', label: 'Operations' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'training', label: 'Training' },
  { value: 'admin', label: 'Administrative' },
  { value: 'technical', label: 'Technical' },
  { value: 'combat', label: 'Combat / Tactical' },
  { value: 'medical', label: 'Medical' },
  { value: 'other', label: 'Other' },
]

const SUBMISSION_TYPES = [
  { value: 'jargon', label: 'Military Jargon', description: 'A military term or slang (e.g., "fire watch", "smoke session")' },
  { value: 'acronym', label: 'Acronym', description: 'A military acronym (e.g., NCO, MOS, PCS)' },
  { value: 'eval_phrase', label: 'Eval Phrase', description: 'A phrase from military evaluations (e.g., "unlimited potential")' },
  { value: 'phrase', label: 'Common Phrase', description: 'A multi-word military expression (e.g., "deploy in support of")' },
] as const

const BRANCHES = [
  { value: 'general', label: 'All Branches' },
  { value: 'army', label: 'Army' },
  { value: 'navy', label: 'Navy' },
  { value: 'air_force', label: 'Air Force' },
  { value: 'marine_corps', label: 'Marine Corps' },
  { value: 'coast_guard', label: 'Coast Guard' },
  { value: 'space_force', label: 'Space Force' },
]

const BADGE_TIERS = [
  { min: 50, label: 'Dictionary Legend', icon: '💎' },
  { min: 30, label: 'Command Master Chief', icon: '🏆' },
  { min: 15, label: 'Platoon Sergeant', icon: '⭐' },
  { min: 5, label: 'Squad Leader', icon: '🎖️' },
  { min: 0, label: 'New Recruit', icon: '🏅' },
]

interface CommunitySubmissionsProps {
  userBranch?: string
}

export function CommunitySubmissions({ userBranch }: CommunitySubmissionsProps) {
  const [activeTab, setActiveTab] = useState<'submit' | 'mine' | 'requested'>('requested')

  // Stats
  const [stats, setStats] = useState<CommunityStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  // Submit form state
  const [formType, setFormType] = useState<SubmissionData['submission_type']>('jargon')
  const [formTerm, setFormTerm] = useState('')
  const [formCivilian, setFormCivilian] = useState('')
  const [formBranch, setFormBranch] = useState(userBranch || 'general')
  const [formCategory, setFormCategory] = useState('')
  const [formContext, setFormContext] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // FAB drawer
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerTermRef = useRef<HTMLInputElement>(null)

  // My submissions
  const [mySubmissions, setMySubmissions] = useState<Submission[]>([])
  const [loadingMine, setLoadingMine] = useState(false)

  // Most requested missing terms
  const [missingTerms, setMissingTerms] = useState<MissingTerm[]>([])
  const [loadingMissing, setLoadingMissing] = useState(false)
  const [upvotedTerms, setUpvotedTerms] = useState<Set<string>>(new Set())

  // Inline submit state for requested terms
  const [inlineSubmitId, setInlineSubmitId] = useState<string | null>(null)
  const [inlineCivilian, setInlineCivilian] = useState('')
  const [inlineSubmitting, setInlineSubmitting] = useState(false)

  // Load stats + most requested on mount
  useEffect(() => {
    getCommunityStats().then(s => {
      setStats(s)
      setStatsLoading(false)
    }).catch(() => setStatsLoading(false))

    loadMissingTerms()
  }, [])

  // Load data when switching tabs
  useEffect(() => {
    if (activeTab === 'mine') {
      loadMySubmissions()
    } else if (activeTab === 'requested') {
      loadMissingTerms()
    }
  }, [activeTab])

  const loadMySubmissions = async () => {
    setLoadingMine(true)
    const subs = await getUserSubmissions()
    setMySubmissions(subs)
    setLoadingMine(false)
  }

  const loadMissingTerms = async () => {
    setLoadingMissing(true)
    const terms = await getTopMissingTerms(20)
    setMissingTerms(terms)
    setLoadingMissing(false)
  }

  const handleSubmit = async () => {
    if (!formTerm.trim() || !formCivilian.trim()) return
    setSubmitting(true)
    setSubmitError(null)

    const result = await submitTerm({
      submission_type: formType,
      military_term: formTerm.trim(),
      suggested_civilian: formCivilian.trim() || undefined,
      branch: formBranch,
      category: formCategory || undefined,
      context_notes: formContext.trim() || undefined,
    })

    if (result.success) {
      setSubmitSuccess(true)
      setFormTerm('')
      setFormCivilian('')
      setFormContext('')
      setFormCategory('')
      // Refresh stats
      getCommunityStats().then(setStats).catch(() => {})
      setTimeout(() => {
        setSubmitSuccess(false)
        setDrawerOpen(false)
      }, 2000)
    } else {
      setSubmitError(result.error || 'Submission failed')
    }
    setSubmitting(false)
  }

  const handleInlineSubmit = async (term: MissingTerm) => {
    if (!inlineCivilian.trim()) return
    setInlineSubmitting(true)

    const result = await submitTerm({
      submission_type: 'jargon',
      military_term: term.term,
      suggested_civilian: inlineCivilian.trim(),
      branch: term.branch || userBranch || 'general',
    })

    if (result.success) {
      setInlineSubmitId(null)
      setInlineCivilian('')
      setMissingTerms(prev => prev.filter(t => t.id !== term.id))
      // Refresh stats
      getCommunityStats().then(setStats).catch(() => {})
    }
    setInlineSubmitting(false)
  }

  const handleUpvoteMissing = async (termId: string) => {
    if (upvotedTerms.has(termId)) return
    await upvoteMissingTerm(termId)
    setUpvotedTerms(prev => new Set([...prev, termId]))
    setMissingTerms(prev =>
      prev.map(t => t.id === termId ? { ...t, hit_count: t.hit_count + 1 } : t),
    )
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="amber">Pending</Badge>
      case 'approved': return <Badge variant="green">Approved</Badge>
      case 'rejected': return <Badge variant="red">Rejected</Badge>
      default: return <Badge>{status}</Badge>
    }
  }

  const badge = stats
    ? BADGE_TIERS.find(t => (stats.impact.totalCount) >= t.min) || BADGE_TIERS[BADGE_TIERS.length - 1]
    : BADGE_TIERS[BADGE_TIERS.length - 1]

  return (
    <div className="space-y-6">
      {/* ============== YOUR IMPACT + LEADERBOARD ROW ============== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Your Impact */}
        <Card className="p-5 border-gold/20 bg-gradient-to-br from-gold/[0.06] to-transparent">
          {statsLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-bg-tertiary rounded w-32" />
              <div className="h-8 bg-bg-tertiary rounded w-20" />
              <div className="h-3 bg-bg-tertiary rounded w-48" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{badge.icon}</span>
                <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-gold">
                  Your Impact
                </h3>
                <span className="text-[10px] px-1.5 py-0.5 bg-gold/10 text-gold rounded font-medium">
                  {badge.label}
                </span>
              </div>

              {stats && stats.impact.approvedCount > 0 ? (
                <>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold font-mono text-gold">
                      {stats.impact.approvedCount}
                    </span>
                    <span className="text-sm text-text-muted">
                      translation{stats.impact.approvedCount !== 1 ? 's' : ''} added to the dictionary
                    </span>
                  </div>
                  <p className="text-xs text-text-dim">
                    Your translations help veterans translate their experience into civilian language.
                    {stats.impact.totalCount > stats.impact.approvedCount && (
                      <> {stats.impact.totalCount - stats.impact.approvedCount} more pending review.</>
                    )}
                  </p>
                </>
              ) : stats && stats.impact.totalCount > 0 ? (
                <>
                  <p className="text-sm text-text-muted mb-1">
                    You have <span className="text-gold font-semibold">{stats.impact.totalCount}</span> submission{stats.impact.totalCount !== 1 ? 's' : ''} pending review.
                  </p>
                  <p className="text-xs text-text-dim">
                    Once approved, your translations will be available to every veteran using Debriefed.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-text-muted mb-2">
                    Submit your first translation to start tracking your impact.
                  </p>
                  <p className="text-xs text-text-dim">
                    Every term you add helps a fellow veteran land a civilian job.
                  </p>
                </>
              )}
            </>
          )}
        </Card>

        {/* Weekly Leaderboard */}
        <Card className="p-5">
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-text-dim mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Top Contributors This Week
          </h3>

          {statsLoading ? (
            <div className="animate-pulse space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-bg-tertiary rounded-full" />
                  <div className="h-3 bg-bg-tertiary rounded flex-1" />
                  <div className="h-3 bg-bg-tertiary rounded w-8" />
                </div>
              ))}
            </div>
          ) : stats && stats.leaderboard.length > 0 ? (
            <div className="space-y-2">
              {stats.leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    entry.isYou ? 'bg-gold/10 border border-gold/20' : 'bg-bg-secondary'
                  }`}
                >
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                    entry.rank === 1 ? 'bg-gold text-bg-primary' :
                    entry.rank === 2 ? 'bg-text-dim/30 text-text' :
                    entry.rank === 3 ? 'bg-status-amber/20 text-status-amber' :
                    'bg-bg-tertiary text-text-dim'
                  }`}>
                    {entry.rank}
                  </span>
                  <span className={`flex-1 text-sm ${entry.isYou ? 'text-gold font-semibold' : 'text-text'}`}>
                    {entry.name}{entry.isYou ? ' (you)' : ''}
                  </span>
                  <span className="text-xs text-text-muted font-mono">
                    {entry.count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-text-dim">No submissions this week yet.</p>
              <p className="text-xs text-text-dim mt-1">Be the first to contribute!</p>
            </div>
          )}
        </Card>
      </div>

      {/* ============== MOST REQUESTED — PROMINENT ============== */}
      {missingTerms.length > 0 && (
        <Card className="p-5 border-gold/15">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-gold flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Most Requested Terms
            </h3>
            <span className="text-[10px] text-text-dim">
              {missingTerms.length} terms need translations
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {missingTerms.slice(0, 8).map(term => (
              <button
                key={term.id}
                onClick={() => {
                  setInlineSubmitId(inlineSubmitId === term.id ? null : term.id)
                  setInlineCivilian('')
                }}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all border ${
                  inlineSubmitId === term.id
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-border bg-bg-secondary text-text hover:border-gold/30 hover:bg-gold/5'
                }`}
              >
                <span>{term.term}</span>
                <span className="text-[10px] text-text-dim group-hover:text-gold transition-colors">
                  {term.hit_count}x
                </span>
              </button>
            ))}
            {missingTerms.length > 8 && (
              <button
                onClick={() => setActiveTab('requested')}
                className="px-3 py-1.5 text-xs text-gold hover:text-gold-bright transition-colors"
              >
                +{missingTerms.length - 8} more
              </button>
            )}
          </div>

          {/* Inline translation for selected term */}
          {inlineSubmitId && missingTerms.find(t => t.id === inlineSubmitId) && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-text-muted">Translate:</span>
                <span className="text-sm font-semibold text-gold">
                  {missingTerms.find(t => t.id === inlineSubmitId)!.term}
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inlineCivilian}
                  onChange={e => setInlineCivilian(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const term = missingTerms.find(t => t.id === inlineSubmitId)
                      if (term) handleInlineSubmit(term)
                    }
                  }}
                  placeholder="Civilian equivalent..."
                  autoFocus
                  autoComplete="off"
                  className="flex-1 bg-bg-secondary border border-border rounded px-3 py-1.5 text-sm text-text placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold/25"
                />
                <button
                  onClick={() => {
                    const term = missingTerms.find(t => t.id === inlineSubmitId)
                    if (term) handleInlineSubmit(term)
                  }}
                  disabled={inlineSubmitting || !inlineCivilian.trim()}
                  className="px-4 py-1.5 bg-gold text-bg-primary text-xs font-bold rounded hover:bg-gold-bright disabled:opacity-50 transition-colors"
                >
                  {inlineSubmitting ? '...' : 'Submit'}
                </button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ============== TAB NAVIGATION ============== */}
      <div className="flex gap-1 bg-bg-secondary rounded-lg p-1">
        {[
          { id: 'requested' as const, label: 'Most Requested' },
          { id: 'mine' as const, label: 'My Submissions' },
          { id: 'submit' as const, label: 'Submit Term' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-heading uppercase tracking-wider transition-all ${
              activeTab === tab.id
                ? 'bg-gold text-bg-primary font-bold'
                : 'text-text-muted hover:text-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============== TAB CONTENT ============== */}

      {/* Most Requested Tab (full list) */}
      {activeTab === 'requested' && (
        <div className="space-y-3">
          <p className="text-text-muted text-sm">
            Terms other veterans searched for but couldn&apos;t find. Translate or upvote to prioritize.
          </p>

          {loadingMissing ? (
            <Card className="p-6 text-center text-text-dim text-sm">Loading...</Card>
          ) : missingTerms.length === 0 ? (
            <Card className="p-6 text-center text-text-dim text-sm">
              No missing terms logged yet. The dictionary is covering well!
            </Card>
          ) : (
            missingTerms.map(term => (
              <Card key={term.id} className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-sm text-text">{term.term}</span>
                    {term.branch && (
                      <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-bg-secondary text-text-dim rounded uppercase">
                        {term.branch}
                      </span>
                    )}
                    {term.source_context && (
                      <p className="text-[11px] text-text-dim mt-1 truncate">
                        Context: &ldquo;{term.source_context}&rdquo;
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-text-dim">{term.hit_count} hit{term.hit_count !== 1 ? 's' : ''}</span>
                    <button
                      onClick={() => handleUpvoteMissing(term.id)}
                      disabled={upvotedTerms.has(term.id)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                        upvotedTerms.has(term.id)
                          ? 'bg-gold-dim text-gold cursor-default'
                          : 'bg-bg-secondary text-text-muted hover:bg-gold-dim hover:text-gold border border-border'
                      }`}
                    >
                      {upvotedTerms.has(term.id) ? 'Voted' : '+1'}
                    </button>
                    <button
                      onClick={() => { setInlineSubmitId(inlineSubmitId === term.id ? null : term.id); setInlineCivilian('') }}
                      className="px-2.5 py-1 rounded text-xs font-semibold bg-gold/10 text-gold hover:bg-gold/20 border border-gold/30 transition-colors"
                    >
                      Translate
                    </button>
                  </div>
                </div>
                {inlineSubmitId === term.id && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={inlineCivilian}
                      onChange={e => setInlineCivilian(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleInlineSubmit(term) }}
                      placeholder="Civilian equivalent..."
                      autoFocus
                      autoComplete="off"
                      className="flex-1 bg-bg-secondary border border-border rounded px-3 py-1.5 text-sm text-text placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold/25"
                    />
                    <button
                      onClick={() => handleInlineSubmit(term)}
                      disabled={inlineSubmitting || !inlineCivilian.trim()}
                      className="px-3 py-1.5 bg-gold text-bg-primary text-xs font-semibold rounded hover:bg-gold-bright disabled:opacity-50 transition-colors"
                    >
                      {inlineSubmitting ? '...' : 'Submit'}
                    </button>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}

      {/* Submit Tab */}
      {activeTab === 'submit' && (
        <Card className="p-5 space-y-4">
          <div>
            <h3 className="font-heading text-lg font-bold uppercase tracking-wider mb-1">
              Submit a Translation
            </h3>
            <p className="text-text-muted text-sm">
              Help other veterans by adding military terms the dictionary doesn&apos;t cover yet.
            </p>
          </div>

          {submitSuccess && (
            <div className="p-3 bg-status-green/10 border border-status-green/20 rounded text-sm text-status-green">
              Submission received! Our team will review it shortly.
            </div>
          )}

          {submitError && (
            <div className="p-3 bg-status-red/10 border border-status-red/20 rounded text-sm text-status-red">
              {submitError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
              Military Term *
            </label>
            <input
              type="text"
              value={formTerm}
              onChange={e => setFormTerm(e.target.value)}
              placeholder={formType === 'acronym' ? 'e.g., NCOER' : 'e.g., field grade officer'}
              className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold/25"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
              Civilian Equivalent *
            </label>
            <input
              type="text"
              value={formCivilian}
              onChange={e => setFormCivilian(e.target.value)}
              placeholder={formType === 'acronym' ? 'e.g., Non-Commissioned Officer Evaluation Report' : 'e.g., senior manager'}
              className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold/25"
              autoComplete="off"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting || !formTerm.trim() || !formCivilian.trim()}
            className="w-full px-4 py-2.5 bg-gold text-bg-primary font-heading font-bold uppercase tracking-wider text-sm rounded hover:bg-gold-bright disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit Translation'}
          </button>

          <details className="group">
            <summary className="text-xs text-text-dim hover:text-text-muted cursor-pointer transition-colors select-none">
              Advanced options (type, branch, category, notes)
            </summary>
            <div className="mt-3 space-y-3 pt-3 border-t border-border">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SUBMISSION_TYPES.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setFormType(t.value)}
                      className={`text-left p-3 rounded border text-sm transition-all ${
                        formType === t.value
                          ? 'border-gold bg-gold-dim text-gold'
                          : 'border-border bg-bg-secondary text-text-muted hover:border-gold/30'
                      }`}
                    >
                      <div className="font-semibold text-xs">{t.label}</div>
                      <div className="text-[11px] mt-0.5 opacity-70">{t.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                    Branch
                  </label>
                  <select
                    value={formBranch}
                    onChange={e => setFormBranch(e.target.value)}
                    className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-sm text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
                    autoComplete="off"
                  >
                    {BRANCHES.map(b => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-sm text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
                    autoComplete="off"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                  Context / Notes
                </label>
                <textarea
                  value={formContext}
                  onChange={e => setFormContext(e.target.value)}
                  rows={2}
                  placeholder="How is this term used? Any additional context?"
                  className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold/25 resize-none"
                  autoComplete="off"
                />
              </div>
            </div>
          </details>
        </Card>
      )}

      {/* My Submissions Tab */}
      {activeTab === 'mine' && (
        <div className="space-y-3">
          {loadingMine ? (
            <Card className="p-6 text-center text-text-dim text-sm">Loading...</Card>
          ) : mySubmissions.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-text-dim text-sm">No submissions yet.</p>
              <button
                onClick={() => setDrawerOpen(true)}
                className="mt-2 text-gold text-sm hover:text-gold-bright underline"
              >
                Submit your first term
              </button>
            </Card>
          ) : (
            mySubmissions.map(sub => (
              <Card key={sub.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-text">{sub.military_term}</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-bg-secondary text-text-dim rounded uppercase">
                        {sub.submission_type}
                      </span>
                    </div>
                    {sub.suggested_civilian && (
                      <p className="text-text-muted text-sm mt-1">
                        → {sub.suggested_civilian}
                      </p>
                    )}
                    {sub.admin_notes && (
                      <p className="text-xs text-text-dim mt-1 italic">
                        Admin: {sub.admin_notes}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-text-dim">
                      <span>{new Date(sub.created_at).toLocaleDateString()}</span>
                      <span>{sub.branch}</span>
                      {sub.upvotes > 0 && <span>{sub.upvotes} upvote{sub.upvotes !== 1 ? 's' : ''}</span>}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {statusBadge(sub.status)}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* ============== FLOATING SUBMIT BUTTON (FAB) ============== */}
      {!drawerOpen && (
        <button
          onClick={() => {
            setDrawerOpen(true)
            setTimeout(() => drawerTermRef.current?.focus(), 300)
          }}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gold text-bg-primary rounded-full shadow-lg hover:bg-gold-bright transition-all hover:scale-105 flex items-center justify-center"
          aria-label="Submit Translation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {/* ============== SUBMIT DRAWER ============== */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex md:justify-end" onClick={(e) => { if (e.target === e.currentTarget) setDrawerOpen(false) }}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Drawer panel — bottom sheet on mobile, right panel on desktop */}
          <div className="relative w-full md:w-[420px] mt-auto md:mt-0 md:ml-auto bg-bg-card border-t md:border-t-0 md:border-l border-border rounded-t-2xl md:rounded-none max-h-[85vh] md:max-h-full md:h-full overflow-y-auto animate-slide-in-right md:animate-slide-in-right">
            {/* Handle bar (mobile) */}
            <div className="md:hidden flex justify-center py-2">
              <div className="w-10 h-1 bg-border rounded-full" />
            </div>

            <div className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-bold uppercase tracking-wider">
                  Submit Translation
                </h3>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-secondary text-text-muted hover:text-text transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-text-muted text-sm">
                Know a military term that needs translating? Add it to help the community.
              </p>

              {submitSuccess && (
                <div className="p-3 bg-status-green/10 border border-status-green/20 rounded text-sm text-status-green flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" className="text-status-green" />
                    <path d="M8 12l3 3 5-5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-check text-status-green" />
                  </svg>
                  Submitted! Our team will review it shortly.
                </div>
              )}

              {submitError && (
                <div className="p-3 bg-status-red/10 border border-status-red/20 rounded text-sm text-status-red">
                  {submitError}
                </div>
              )}

              {/* Military Term */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                  Military Term *
                </label>
                <input
                  ref={drawerTermRef}
                  type="text"
                  value={formTerm}
                  onChange={e => setFormTerm(e.target.value)}
                  placeholder={formType === 'acronym' ? 'e.g., NCOER' : 'e.g., field grade officer'}
                  className="w-full bg-bg-secondary border border-border rounded px-3 py-2.5 text-sm text-text placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold/25"
                  autoComplete="off"
                />
              </div>

              {/* Civilian Equivalent */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                  Civilian Equivalent *
                </label>
                <input
                  type="text"
                  value={formCivilian}
                  onChange={e => setFormCivilian(e.target.value)}
                  placeholder={formType === 'acronym' ? 'e.g., Non-Commissioned Officer Evaluation Report' : 'e.g., senior manager'}
                  className="w-full bg-bg-secondary border border-border rounded px-3 py-2.5 text-sm text-text placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold/25"
                  autoComplete="off"
                />
              </div>

              {/* Type selector (compact) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                  Type
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SUBMISSION_TYPES.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setFormType(t.value)}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                        formType === t.value
                          ? 'bg-gold/15 text-gold border border-gold/30'
                          : 'bg-bg-secondary text-text-muted border border-border hover:border-gold/20'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Branch + Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                    Branch
                  </label>
                  <select
                    value={formBranch}
                    onChange={e => setFormBranch(e.target.value)}
                    className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-sm text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
                    autoComplete="off"
                  >
                    {BRANCHES.map(b => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-sm text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
                    autoComplete="off"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Context Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                  Context / Notes
                </label>
                <textarea
                  value={formContext}
                  onChange={e => setFormContext(e.target.value)}
                  rows={2}
                  placeholder="How is this term used? Any additional context?"
                  className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold/25 resize-none"
                  autoComplete="off"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={submitting || !formTerm.trim() || !formCivilian.trim()}
                className="w-full px-4 py-3 bg-gold text-bg-primary font-heading font-bold uppercase tracking-wider text-sm rounded hover:bg-gold-bright disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Translation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
