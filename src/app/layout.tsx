import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import { PageViewTracker } from '@/components/analytics/PageViewTracker'
import { FeedbackWrapper } from '@/components/layout/FeedbackWrapper'
import { ThemeProvider } from '@/components/theme/ThemeProvider'

export const metadata: Metadata = {
  title: 'Debriefed | Military to Civilian Resume Builder',
  description: 'Military-to-civilian resume translation for veterans. Convert your service record into civilian language and land your next career.',
  keywords: 'military resume, veteran resume, military to civilian, resume builder, FITREP, NCOER, MOS translator',
  openGraph: {
    title: 'Debriefed | Military to Civilian Resume Builder',
    description: 'Military-to-civilian resume translation for veterans.',
    type: 'website',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        {/* Prevent theme flash: apply saved theme before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('debriefed-theme');if(t==='light')document.documentElement.setAttribute('data-theme','light')}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <Suspense>
            <PageViewTracker />
            {children}
            <FeedbackWrapper />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
