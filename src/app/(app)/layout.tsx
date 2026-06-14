import { Suspense } from 'react'
import { TopNav } from '@/components/layout/TopNav'
import { StatusBar } from '@/components/layout/StatusBar'
import { OnboardingGate } from '@/components/layout/OnboardingGate'
import { OfflineBanner } from '@/components/layout/OfflineBanner'
import { FirstLaunchModal } from '@/components/settings/FirstLaunchModal'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-primary overflow-x-hidden">
      <Suspense fallback={<nav className="fixed top-0 left-0 right-0 h-14 bg-t-sidebar border-b border-gold/20 z-50" />}>
        <TopNav />
      </Suspense>
      <OnboardingGate />
      <FirstLaunchModal />

      <div className="hidden md:block">
        <StatusBar />
      </div>
      <OfflineBanner />

      <main className="px-4 md:px-6 lg:px-8 pt-[72px] pb-4">{children}</main>

      <footer className="border-t border-gold/10 px-4 md:px-6 lg:px-8 py-6">
        <p className="text-xs text-text-muted text-center">
          Built by Chris Simser &middot; Open source under MIT &middot;{' '}
          <a
            href="https://github.com/csimser/debriefed"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors underline-offset-2 hover:underline"
          >
            github.com/csimser/debriefed
          </a>
          {' '}&middot;{' '}
          <a
            href="https://discord.gg/mfN7dqnsaY"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-gold transition-colors underline-offset-2 hover:underline"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            Join The Debrief community
          </a>
        </p>
      </footer>
    </div>
  )
}
