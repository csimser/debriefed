import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default withSentryConfig(nextConfig, {
  // Suppresses source map uploading logs during build
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Only upload source maps in production builds
  disableSourceMapUpload: !process.env.SENTRY_AUTH_TOKEN,
})
