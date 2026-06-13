'use client'

import { useState } from 'react'
import Link from 'next/link'

interface MarketingNavProps {
  currentPage?: 'home' | 'about'
}

const NAV_LINKS = [
  { href: '/', label: 'Home', page: 'home' as const },
  { href: '/#features', label: 'Features', page: null },
  { href: '/about/', label: 'About', page: 'about' as const },
  { href: '/help/', label: 'Help', page: null },
]

const GITHUB_URL = 'https://github.com/csimser/debriefed'

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18a11 11 0 015.75 0c2.19-1.49 3.15-1.18 3.15-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55C20.22 21.38 23.5 17.08 23.5 12c0-6.35-5.15-11.5-11.5-11.5z" />
    </svg>
  )
}

export function MarketingNav({ currentPage }: MarketingNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Status Bar */}
      <div className="bg-bg-secondary border-b border-border px-8 py-2.5 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
          <span className="text-status-green">SYSTEMS OPERATIONAL</span>
        </div>
        <div className="text-text-muted">
          <span>v1.0</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-bg-secondary border-b border-border px-4 md:px-8 flex items-center justify-between relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 py-4">
          <div className="w-9 h-9 border-2 border-gold flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gold">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 9h6M9 13h6M9 17h4"/>
            </svg>
          </div>
          <span className="font-heading text-xl md:text-2xl font-bold tracking-wider uppercase">Debriefed</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-6 py-5 font-heading text-xs font-semibold tracking-wider uppercase border-b-2 transition-colors ${
                currentPage && link.page === currentPage
                  ? 'text-gold border-gold'
                  : 'text-text-muted hover:text-text hover:bg-bg-tertiary border-transparent'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA + Mobile Hamburger */}
        <div className="flex items-center gap-2 md:gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex p-2.5 text-text-muted hover:text-text transition-colors"
            aria-label="Debriefed on GitHub"
          >
            <GitHubIcon className="w-5 h-5" />
          </a>
          <Link href="/dashboard/" className="hidden md:block px-5 py-2.5 font-heading text-sm font-bold uppercase tracking-wider bg-gold text-bg-primary hover:bg-gold-bright rounded transition-all">
            Open App
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-text-muted hover:text-text transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-bg-secondary border-b border-border">
          <div className="flex flex-col px-4 py-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`py-3 px-2 font-heading text-sm font-semibold uppercase tracking-wider border-b border-border last:border-b-0 ${
                  currentPage && link.page === currentPage
                    ? 'text-gold'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-3 pb-2">
              <Link
                href="/dashboard/"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 font-heading text-sm font-bold uppercase tracking-wider text-center bg-gold text-bg-primary hover:bg-gold-bright rounded transition-all"
              >
                Open App
              </Link>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 font-heading text-sm font-bold uppercase tracking-wider text-center text-text-muted border border-border hover:border-border-bright rounded transition-all flex items-center justify-center gap-2"
              >
                <GitHubIcon className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
