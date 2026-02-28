'use client'

/**
 * Lightweight conversion funnel analytics.
 * Fire-and-forget — never blocks UI.
 * Plug into any third-party provider by modifying this single file.
 */
export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return

  fetch('/api/analytics/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, properties, timestamp: Date.now() }),
  }).catch(() => {})
}
