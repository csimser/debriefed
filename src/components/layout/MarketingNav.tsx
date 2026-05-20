'use client'

import { useState } from 'react'
import Link from 'next/link'

interface MarketingNavProps {
  currentPage?: 'home' | 'pricing' | 'about' | 'mos'
  isLoggedIn?: boolean
  userName?: string
}

const NAV_LINKS = [
  { href: '/', label: 'Home', page: 'home' as const },
  { href: '/#features', label: 'Features', page: null },
  { href: '/mos', label: 'MOS Guide', page: 'mos' as const },
  { href: '/pricing', label: 'Pricing', page: 'pricing' as const },
  { href: '/about', label: 'About', page: 'about' as const },
  { href: '/blog', label: 'Blog', page: null },
  { href: '/help', label: 'Help', page: null },
]

export function MarketingNav({ currentPage, isLoggedIn, userName }: MarketingNavProps) {
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
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="hidden md:block px-5 py-2.5 font-heading text-sm font-bold uppercase tracking-wider text-text-muted hover:text-text border border-border hover:border-border-bright rounded transition-all">
                Dashboard
              </Link>
              {userName && (
                <span className="hidden md:block text-xs text-text-muted font-mono">{userName}</span>
              )}
            </>
          ) : (
            <>
              <Link href="/login" className="hidden md:block px-5 py-2.5 font-heading text-sm font-bold uppercase tracking-wider text-text-muted hover:text-text border border-border hover:border-border-bright rounded transition-all">
                Sign In
              </Link>
              <Link href="/signup" className="hidden md:block px-5 py-2.5 font-heading text-sm font-bold uppercase tracking-wider bg-gold text-bg-primary hover:bg-gold-bright rounded transition-all">
                Begin Mission
              </Link>
            </>
          )}

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
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 font-heading text-sm font-bold uppercase tracking-wider text-center bg-gold text-bg-primary hover:bg-gold-bright rounded transition-all"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="py-2.5 font-heading text-sm font-bold uppercase tracking-wider text-center text-text-muted border border-border hover:border-border-bright rounded transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="py-2.5 font-heading text-sm font-bold uppercase tracking-wider text-center bg-gold text-bg-primary hover:bg-gold-bright rounded transition-all"
                  >
                    Begin Mission
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
