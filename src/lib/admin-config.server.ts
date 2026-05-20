import 'server-only'

// Admin emails that bypass all usage limits.
// Configure via ADMIN_BYPASS_EMAILS env var (comma-separated, lowercase).
// Example: ADMIN_BYPASS_EMAILS="admin@example.com,owner@example.com"
export const ADMIN_BYPASS_EMAILS: string[] = (process.env.ADMIN_BYPASS_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)
