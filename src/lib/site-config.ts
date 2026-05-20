// Public site configuration. Override per-deploy via env vars.
// NEXT_PUBLIC_* so these are safely accessible from both server and client code.

export const APP_URL: string =
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://example.com'

export const SUPPORT_EMAIL: string =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@example.com'
