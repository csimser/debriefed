'use client'

import { useEffect } from 'react'
import { checkForDataUpdate } from '@/lib/data/updater'

/**
 * Registers the service worker and kicks off the daily bundled-data update
 * check. Renders nothing. Skipped entirely in the single-file build (no SW
 * on file://) and in dev.
 */
export function PWAProvider() {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator) ||
      window.location.protocol === 'file:' ||
      process.env.NODE_ENV !== 'production'
    ) {
      checkForDataUpdate()
      return
    }
    navigator.serviceWorker.register('/sw.js').catch(() => {})
    checkForDataUpdate()
  }, [])

  return null
}
