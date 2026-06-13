'use client'

import { useState } from 'react'

interface HelpTranslatePromptProps {
  unmatchedPhrase: string
  branch?: string
  onDismiss: () => void
  /** Called with the military→civilian pair so the parent can immediately
   *  apply the translation to the current bullet text. */
  onApplyTranslation?: (militaryTerm: string, civilianEquiv: string) => void
}

/**
 * Shown when the dictionary couldn't fully translate a bullet. Lets the user
 * type their own civilian wording and apply it to the bullet locally.
 */
export function HelpTranslatePrompt({
  unmatchedPhrase,
  onDismiss,
  onApplyTranslation,
}: HelpTranslatePromptProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [civilianEquiv, setCivilianEquiv] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleApply = () => {
    if (!civilianEquiv.trim()) return

    // Immediately apply the translation to the current bullet
    if (onApplyTranslation) {
      onApplyTranslation(unmatchedPhrase, civilianEquiv.trim())
    }

    setSubmitted(true)
    setTimeout(() => onDismiss(), 2500)
  }

  if (submitted) {
    return (
      <div className="text-xs text-status-green mt-1.5 ml-6 py-1">
        Translation applied!
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
          Translate It Yourself
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
        Translate:{' '}
        <span className="text-gold font-semibold">&ldquo;{unmatchedPhrase}&rdquo;</span>
      </p>
      <input
        type="text"
        value={civilianEquiv}
        onChange={(e) => setCivilianEquiv(e.target.value)}
        placeholder="What does this mean in civilian terms?"
        className="w-full bg-bg-secondary border border-border rounded px-3 py-2.5 text-base md:py-1.5 md:text-xs text-text placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold/25"
        autoFocus
        autoComplete="off"
      />
      <div className="flex gap-2">
        <button
          onClick={handleApply}
          disabled={!civilianEquiv.trim()}
          className="px-3 py-1 bg-gold text-bg-primary text-xs font-heading font-bold uppercase rounded hover:bg-gold-bright disabled:opacity-50 transition-colors"
        >
          Apply
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
