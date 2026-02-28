import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Debriefed — Built by a Veteran, for Veterans',
  description: 'Debriefed was built by a veteran in transition who saw the gap between military service records and civilian resumes. Our mission: no veteran should struggle to translate their service.',
  openGraph: {
    title: 'About Debriefed — Built by a Veteran, for Veterans',
    description: 'Debriefed was built by a veteran in transition who saw the gap between military service records and civilian resumes.',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
