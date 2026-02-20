'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  submitTerm,
  getUserSubmissions,
  getTopMissingTerms,
  upvoteMissingTerm,
  type SubmissionData,
  type Submission,
  type MissingTerm,
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

interface CommunitySubmissionsProps {
  userBranch?: string
}

export function CommunitySubmissions({ userBranch }: CommunitySubmissionsProps) {
  const [activeTab, setActiveTab] = useState<'submit' | 'mine' | 'requested'>('submit')

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

  // My submissions
  const [mySubmissions, setMySubmissions] = useState<Submission[]>([])
  const [loadingMine, setLoadingMine] = useState(false)

  // Most requested missing terms
  const [missingTerms, setMissingTerms] = useState<MissingTerm[]>([])
  const [loadingMissing, setLoadingMissing] = useState(false)
  const [upvotedTerms, setUpvotedTerms] = useState<Set<string>>(new Set())

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
    if (!formTerm.trim()) return
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
      setTimeout(() => setSubmitSuccess(false), 4000)
    } else {
      setSubmitError(result.error || 'Submission failed')
    }
    setSubmitting(false)
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

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-1 bg-bg-secondary rounded-lg p-1">
        {[
          { id: 'submit' as const, label: 'Submit Term' },
          { id: 'mine' as const, label: 'My Submissions' },
          { id: 'requested' as const, label: 'Most Requested' },
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

      {/* Submit Tab */}
      {activeTab === 'submit' && (
        <Card className="p-5 space-y-4">
          <div>
            <h3 className="font-heading text-lg font-bold uppercase tracking-wider mb-1">
              Submit a Translation
            </h3>
            <p className="text-text-muted text-sm">
              Help other veterans by adding military terms the dictionary doesn&apos;t cover yet.
              Submissions are reviewed before being added.
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

          {/* Submission Type */}
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

          {/* Military Term */}
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

          {/* Civilian Equivalent */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
              Civilian Equivalent {formType === 'acronym' ? '(Full Term)' : '(Optional)'}
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
              Context / Notes (Optional)
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

          <button
            onClick={handleSubmit}
            disabled={submitting || !formTerm.trim()}
            className="w-full px-4 py-2.5 bg-gold text-bg-primary font-heading font-bold uppercase tracking-wider text-sm rounded hover:bg-gold-bright disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit Translation'}
          </button>
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
                onClick={() => setActiveTab('submit')}
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

      {/* Most Requested Tab */}
      {activeTab === 'requested' && (
        <div className="space-y-3">
          <p className="text-text-muted text-sm">
            Terms other veterans searched for but couldn&apos;t find. Upvote to prioritize.
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
                  <div className="flex items-center gap-3 flex-shrink-0">
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
                      {upvotedTerms.has(term.id) ? 'Voted' : '+1 Need This'}
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
