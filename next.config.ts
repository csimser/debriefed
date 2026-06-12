import type { NextConfig } from 'next'

// Static export — the app is a zero-backend PWA served from GitHub Pages.
// Security headers (CSP etc.) are set via <meta> tags in the root layout
// because static hosting cannot set response headers.
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
