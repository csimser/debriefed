import { Suspense } from 'react'
import { TopNav } from '@/components/layout/TopNav'
import { StatusBar } from '@/components/layout/StatusBar'
import { OnboardingGate } from '@/components/layout/OnboardingGate'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-primary overflow-x-hidden">
      <Suspense fallback={<nav className="fixed top-0 left-0 right-0 h-14 bg-t-sidebar border-b border-gold/20 z-50" />}>
        <TopNav />
      </Suspense>
      <OnboardingGate />

      <div className="hidden md:block">
        <StatusBar />
      </div>

      <main className="px-4 md:px-6 lg:px-8 pt-[72px] pb-4">{children}</main>
    </div>
  )
}
