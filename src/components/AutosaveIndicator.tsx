'use client'

interface AutosaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error'
  lastSaved: Date | null
  error: string | null
}

export function AutosaveIndicator({ status, lastSaved, error }: AutosaveIndicatorProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      {status === 'idle' && lastSaved && (
        <span className="text-text-dim">
          Last saved {formatTime(lastSaved)}
        </span>
      )}

      {status === 'saving' && (
        <span className="text-gold flex items-center gap-1.5">
          <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
          Saving...
        </span>
      )}

      {status === 'saved' && (
        <span className="text-status-green flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Saved
        </span>
      )}

      {status === 'error' && (
        <span className="text-status-red flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error || 'Failed to save'}
        </span>
      )}
    </div>
  )
}
