'use client'

import { useOnlineStatus } from '@/hooks/useOnlineStatus'

/**
 * Slim banner shown while offline. Dictionary translation is unaffected —
 * this only flags that AI enhancement is unavailable.
 */
export function OfflineBanner() {
  const online = useOnlineStatus()
  if (online) return null

  return (
    <div className="bg-bg-tertiary border-b border-border px-4 py-1.5 text-center">
      <span className="font-mono text-xs text-text-muted">
        ⚡ Offline — using dictionary translation. AI enhancement needs internet.
      </span>
    </div>
  )
}
