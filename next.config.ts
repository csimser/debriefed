import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/((?!maintenance.html|_next|favicon.ico).*)',
        destination: '/maintenance.html',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
