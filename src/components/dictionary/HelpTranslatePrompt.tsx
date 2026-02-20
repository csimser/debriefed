'use client'

import { useState } from 'react'
import { submitTerm } from '@/lib/dictionary/communityQueries'

interface HelpTranslatePromptProps {
  unmatchedPhrase: string
  branch?: string
  onDismiss: () => void
  /** Called after successful submission with the military→civilian pair so the
   *  parent can immediately apply the translation to the current bullet text. */
  onApplyTranslation?: (militaryTerm: string, civilianEquiv: string) => void
}

const CATEGORIES = [
  { value: '', label: 'Category (optional)' },
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

export function HelpTranslatePrompt({
  unmatchedPhrase,
  branch,
  onDismiss,
  onApplyTranslation,
}: HelpTranslatePromptProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [civilianEquiv, setCivilianEquiv] = useState('')
  const [category, setCategory] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!civilianEquiv.trim()) return
    setSubmitting(true)
    await submitTerm({
      submission_type: 'jargon',
      military_term: unmatchedPhrase,
      suggested_civilian: civilianEquiv.trim(),
      branch: branch || 'general',
      category: category || undefined,
    })

    // Immediately apply the translation to the current bullet
    if (onApplyTranslation) {
      onApplyTranslation(unmatchedPhrase, civilianEquiv.trim())
    }

    setSubmitted(true)
    setSubmitting(false)
    setTimeout(() => onDismiss(), 2500)
  }

  if (submitted) {
    return (
      <div className="text-xs text-status-green mt-1.5 ml-6 py-1">
        Translation applied! Every submission helps keep Debriefed free for all veterans.
      </div>
    )
  }

  if (!isExpanded) {
    return (
      <div className="text-xs text-text-dim mt-1.5 ml-6 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="text-gold/60">*</span>
        <span>Couldn&apos;t fully translate this bullet.</span>
        <button
          onClick={() => setIsExpanded(true)}
          className="text-gold hover:text-gold-bright underline"
        >
          Submit Translation
        </button>
        <button
          onClick={onDismiss}
          className="text-text-dim hover:text-text-muted"
        >
          Skip
        </button>
      </div>
    )
  }

  return (
    <div className="mt-1.5 ml-6 p-3 bg-bg-tertiary border border-border rounded-md space-y-2">
      <p className="text-xs text-text-muted">
        Help us translate:{' '}
        <span className="text-gold font-semibold">&ldquo;{unmatchedPhrase}&rdquo;</span>
      </p>
      <p className="text-[11px] text-text-dim">
        Community translations keep Debriefed free for every veteran.
      </p>
      <input
        type="text"
        value={civilianEquiv}
        onChange={(e) => setCivilianEquiv(e.target.value)}
        placeholder="What does this mean in civilian terms?"
        className="w-full bg-bg-secondary border border-border rounded px-3 py-1.5 text-xs text-text placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold/25"
        autoFocus
        autoComplete="off"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full bg-bg-secondary border border-border rounded px-3 py-1.5 text-xs text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
        autoComplete="off"
      >
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={submitting || !civilianEquiv.trim()}
          className="px-3 py-1 bg-gold text-bg-primary text-xs font-heading font-bold uppercase rounded hover:bg-gold-bright disabled:opacity-50 transition-colors"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
        <button
          onClick={onDismiss}
          className="px-3 py-1 text-xs text-text-dim hover:text-text-muted transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
