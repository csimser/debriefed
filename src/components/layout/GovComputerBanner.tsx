'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'dismissed_gov_computer_notice'

export function GovComputerBanner() {
  const [dismissed, setDismissed] = useState(true) // default hidden to avoid flash

  useEffect(() => {
    const wasDismissed = localStorage.getItem(STORAGE_KEY)
    if (!wasDismissed) {
      setDismissed(false)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setDismissed(true)
  }

  if (dismissed) return null

  return (
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex-1">
          <p className="text-sm text-text-light">
            <strong>Using a government computer?</strong> Some features (file uploads, downloads, PDF generation) may be restricted by your network. For best results, use a personal device.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-text-muted hover:text-text flex-shrink-0 p-1"
          aria-label="Dismiss notice"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <button
        onClick={handleDismiss}
        className="text-xs text-text-dim hover:text-text-muted mt-2 ml-8"
      >
        Don&apos;t show again
      </button>
    </div>
  )
}
