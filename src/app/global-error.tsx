'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a', color: '#e5e5e5', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Something went wrong</h1>
            <p style={{ color: '#888', marginBottom: '2rem' }}>An unexpected error occurred. Please try again.</p>
            <button
              onClick={reset}
              style={{ padding: '0.75rem 2rem', backgroundColor: '#d4a84b', color: '#0a0a0a', border: 'none', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
