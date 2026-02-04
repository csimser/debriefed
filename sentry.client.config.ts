import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // Adjust in production to a lower value (e.g., 0.1) to reduce volume.
  tracesSampleRate: 0.1,

  // Capture Replay for 10% of all sessions, plus 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Only enable in production
  enabled: process.env.NODE_ENV === 'production',

  // Filter out noisy errors
  ignoreErrors: [
    'ResizeObserver loop',
    'Non-Error exception captured',
    'Network request failed',
    'Load failed',
    'AbortError',
  ],
})
