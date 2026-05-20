'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'

// Get or create session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return ''

  let sessionId = sessionStorage.getItem('analytics_session_id')
  if (!sessionId) {
    // Fallback for browsers without crypto.randomUUID
    if (crypto.randomUUID) {
      sessionId = crypto.randomUUID()
    } else {
      sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    }
    sessionStorage.setItem('analytics_session_id', sessionId)
  }
  return sessionId
}

export function PageViewTracker() {
  const pathname = usePathname()
  const lastTrackedPath = useRef<string | null>(null)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  const trackPageView = useCallback((path: string) => {
    // Skip if already tracked this path recently
    if (lastTrackedPath.current === path) return

    const sessionId = getSessionId()
    if (!sessionId) return

    lastTrackedPath.current = path

    // Send tracking request
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path,
        session_id: sessionId,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent || null,
      }),
    }).catch(() => {
      // Silently fail - analytics shouldn't break the app
    })
  }, [])

  useEffect(() => {
    // Debounce to avoid duplicate tracking on fast navigation
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      trackPageView(pathname)
    }, 100)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [pathname, trackPageView])

  // This component renders nothing
  return null
}
