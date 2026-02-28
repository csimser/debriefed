import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — Free, Core & Full Plans | Debriefed',
  description: 'Start building your civilian resume for free. Upgrade to Core ($35/30 days) or Full ($75/90 days) for AI-powered cover letters, job match analysis, LinkedIn optimization, and unlimited downloads.',
  openGraph: {
    title: 'Pricing — Free, Core & Full Plans | Debriefed',
    description: 'Start building your civilian resume for free. Upgrade to Core or Full for AI-powered cover letters, job match analysis, and LinkedIn optimization.',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
