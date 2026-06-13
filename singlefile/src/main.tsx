import './data-embed'
import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import '@/app/globals.css'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { usePathname, navigate } from '../shims/navigation'

// The app pages, imported unmodified from the Next.js source tree.
// next/link + next/navigation are aliased onto the hash-router shims.
import AppLayout from '@/app/(app)/layout'
import DashboardPage from '@/app/(app)/dashboard/page'
import ProfilePage from '@/app/(app)/profile/page'
import ResumesPage from '@/app/(app)/resumes/page'
import JobMatchPage from '@/app/(app)/job-match/page'
import CareerToolsPage from '@/app/(app)/career-tools/page'
import TrackerPage from '@/app/(app)/tracker/page'
import SettingsPage from '@/app/(app)/settings/page'
import OnboardingPage from '@/app/onboarding/page'

const APP_ROUTES: Record<string, React.ComponentType> = {
  '/dashboard': DashboardPage,
  '/profile': ProfilePage,
  '/resumes': ResumesPage,
  '/job-match': JobMatchPage,
  '/career-tools': CareerToolsPage,
  '/tracker': TrackerPage,
  '/settings': SettingsPage,
}

function OnlineOnlyPage({ path }: { path: string }) {
  return (
    <div className="max-w-xl mx-auto py-24 text-center">
      <h1 className="font-heading text-2xl font-bold uppercase tracking-wider mb-3">
        Available Online
      </h1>
      <p className="text-text-muted mb-6">
        This page isn&apos;t bundled into the single-file app. You can find it at{' '}
        <a
          className="text-gold underline"
          href={`https://getdebriefed.co${path}/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          getdebriefed.co{path}
        </a>
        .
      </p>
      <a href="#/dashboard" className="text-gold underline">
        ← Back to Dashboard
      </a>
    </div>
  )
}

function Router() {
  const pathname = usePathname()

  // Root → dashboard (the onboarding gate takes over for first-time users)
  useEffect(() => {
    if (pathname === '/') navigate('/dashboard', true)
  }, [pathname])

  if (pathname === '/onboarding') return <OnboardingPage />

  const Page = APP_ROUTES[pathname]
  return <AppLayout>{Page ? <Page /> : <OnlineOnlyPage path={pathname} />}</AppLayout>
}

function App() {
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
