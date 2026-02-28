import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up Free — Military to Civilian Resume Builder | Debriefed',
  description: 'Create your free Debriefed account. Build civilian resumes, translate military jargon, match jobs, and optimize your LinkedIn profile. No credit card required.',
  openGraph: {
    title: 'Sign Up Free — Military to Civilian Resume Builder | Debriefed',
    description: 'Create your free Debriefed account. Build civilian resumes, translate military jargon, and match jobs. No credit card required.',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children
}
