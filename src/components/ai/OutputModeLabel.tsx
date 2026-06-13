'use client'

/**
 * Labels generated output by how it was produced.
 *
 * - "Dictionary translation" — the keyless engine (a complete result, not a
 *   teaser; copy must never apologize for it)
 * - "AI-enhanced" — Claude ran on top of the dictionary baseline
 */
export function OutputModeLabel({ mode }: { mode: 'dictionary' | 'ai' }) {
  if (mode === 'ai') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gold-dim border border-gold/30 font-mono text-[10px] uppercase tracking-wider text-gold">
        ✨ AI-enhanced
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-bg-tertiary border border-border font-mono text-[10px] uppercase tracking-wider text-text-muted">
      📖 Dictionary translation
    </span>
  )
}
