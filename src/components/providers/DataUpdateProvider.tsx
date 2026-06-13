'use client'

import { useEffect } from 'react'
import { checkForDataUpdate } from '@/lib/data/updater'

/**
 * Kicks off the daily bundled-dictionary update check (pulled from this repo's
 * public-data/ over HTTPS). Renders nothing. There is no service worker — the
 * single-file build embeds everything and works offline natively.
 */
export function DataUpdateProvider() {
  useEffect(() => {
    checkForDataUpdate()
  }, [])

  return null
}
