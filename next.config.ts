import type { NextConfig } from 'next'

// Static export — the app is a zero-backend, download-only HTML app. This build
// feeds the single-file Vite distribution (Debriefed.html); it is not hosted.
// Security headers (CSP etc.) are set via <meta> tags in the root layout
// because there is no server to set response headers.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
