'use client'

import { useState, type ReactNode } from 'react'
import { useApiKey } from '@/hooks/useApiKey'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { KeySetupModal } from '@/components/settings/KeySetupModal'

interface EnhanceWithAIProps {
  /** Runs the AI enhancement. Only called when a key exists and we're online. */
  onEnhance: () => void | Promise<void>
  /** Optional context line passed to the key dialog. */
  featureNote?: string
  busy?: boolean
  /** Button label when ready (default "✨ Enhance with AI"). */
  label?: ReactNode
  className?: string
}

/**
 * The single, non-pushy AI affordance.
 *
 * - key + online   → runs the enhancement
 * - no key + online → small "add a key" link that opens the key dialog
 *                     (dismissable; nothing is blocked behind it)
 * - offline         → disabled with a tooltip; dictionary output stands
 */
export function EnhanceWithAI({
  onEnhance,
  featureNote,
  busy = false,
  label = '✨ Enhance with AI',
  className = '',
}: EnhanceWithAIProps) {
  const { hasKey, loaded } = useApiKey()
  const online = useOnlineStatus()
  const [showKeyDialog, setShowKeyDialog] = useState(false)

  if (!loaded) return null

  const base =
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded font-nav text-xs uppercase tracking-wider transition-colors'

  if (!online) {
    return (
      <span
        title="AI enhancement needs internet. Dictionary translation still works offline."
        className={`${base} border border-border text-text-muted/50 cursor-not-allowed ${className}`}
      >
        {label}
      </span>
    )
  }

  if (!hasKey) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowKeyDialog(true)}
          className={`${base} border border-border text-text-muted hover:text-gold hover:border-gold/40 ${className}`}
        >
          {label}
          <span className="normal-case tracking-normal text-[10px] opacity-70">(add key)</span>
        </button>
        <KeySetupModal
          isOpen={showKeyDialog}
          onClose={() => setShowKeyDialog(false)}
          onKeySaved={() => void onEnhance()}
          featureNote={featureNote}
        />
      </>
    )
  }

  return (
    <button
      type="button"
      onClick={() => void onEnhance()}
      disabled={busy}
      className={`${base} bg-gold-dim border border-gold/30 text-gold hover:bg-gold hover:text-bg-primary disabled:opacity-50 ${className}`}
    >
      {busy ? 'Enhancing…' : label}
    </button>
  )
}
