'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUpgradeModal } from '@/components/modals/UpgradeModal'
import { useTheme } from '@/components/theme/ThemeProvider'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/resumes', label: 'My Resumes' },
  { href: '/job-match', label: 'Job Match' },
  { href: '/career-tools', label: 'Cover Letter & LinkedIn' },
  { href: '/tracker', label: 'Tracker' },
]

const secondaryItems = [
  { href: '/profile', label: 'My Profile' },
  { href: '/settings', label: 'Settings' },
  { href: '/help', label: 'Help' },
]

interface TopNavProps {
  user?: {
    email?: string
    first_name?: string
    last_name?: string
    rank?: string
  }
  tier?: string
  isAdmin?: boolean
  isOrgAdmin?: boolean
}

export function TopNav({ user, tier = 'free', isAdmin = false, isOrgAdmin = false }: TopNavProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsUserDropdownOpen(false)
  }, [pathname, searchParams])

  // Close user dropdown on outside click or Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsUserDropdownOpen(false)
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsUserDropdownOpen(false)
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`
    }
    if (user?.rank) {
      const words = user.rank.split(' ')
      if (words.length >= 2) return `${words[0][0]}${words[1][0]}`
      return user.rank.substring(0, 2).toUpperCase()
    }
    return user?.email?.[0]?.toUpperCase() || 'U'
  }

  const getDisplayName = () => {
    if (user?.first_name) {
      return `${user.first_name} ${user.last_name || ''}`.trim()
    }
    return user?.email?.split('@')[0] || 'User'
  }

  const getTierLabel = () => {
    switch (tier?.toLowerCase()) {
      case 'full': return 'Full Tier'
      case 'core': return 'Core Tier'
      default: return 'Free Tier'
    }
  }

  const handleSignOut = async () => {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const isActive = (href: string) => {
    const [itemPath, itemQuery] = href.split('?')
    const itemTool = itemQuery?.split('=')[1]
    return itemTool
      ? pathname === itemPath && searchParams.get('tool') === itemTool
      : pathname === itemPath
  }

  const { openUpgradeModal } = useUpgradeModal()
  const { theme, toggleTheme } = useTheme()
  const isFree = tier?.toLowerCase() === 'free'

  if (!isHydrated) {
    return (
      <nav className="fixed top-0 left-0 right-0 h-14 bg-t-sidebar border-b border-gold/20 z-50" />
    )
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-14 bg-t-sidebar text-t-sidebar-fg border-b border-gold/20 z-50">
        <div className="h-full px-4 md:px-6 flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-bg-tertiary rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 9h6M9 13h6M9 17h4"/>
              </svg>
            </div>
            <span className="font-heading font-bold tracking-wide text-lg">DEBRIEFED</span>
          </Link>

          {/* Center: Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-1.5 rounded-md font-nav text-xs uppercase tracking-wider transition-colors whitespace-nowrap',
                  isActive(item.href)
                    ? 'text-gold bg-gold-dim'
                    : 'text-text-muted hover:text-text'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right: Desktop upgrade + user dropdown */}
          <div className="hidden md:flex items-center gap-3">
            {isFree && (
              <button
                onClick={openUpgradeModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-dim border border-gold/30 rounded-md text-gold hover:bg-gold hover:text-bg-primary transition-all text-xs font-nav font-bold uppercase tracking-wider"
              >
                <span>&#9733;</span>
                Upgrade
              </button>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-gold hover:bg-gold-dim transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? (
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="w-9 h-9 bg-gradient-to-br from-gold to-gold-bright rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
              >
                <span className="font-heading font-bold text-xs text-bg-primary">{getInitials()}</span>
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-bg-secondary border border-border rounded-lg shadow-xl overflow-hidden">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-border">
                    <div className="font-semibold text-sm truncate">{getDisplayName()}</div>
                    <div className="text-xs text-text-muted">{getTierLabel()}</div>
                  </div>

                  {/* Links */}
                  <div className="py-1">
                    {secondaryItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-text-muted hover:text-text hover:bg-bg-tertiary transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                    {isOrgAdmin && (
                      <Link
                        href="/partner"
                        className="block px-4 py-2 text-sm text-gold/70 hover:text-gold hover:bg-gold/10 transition-colors"
                      >
                        Partner Portal
                      </Link>
                    )}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-status-red/70 hover:text-status-red hover:bg-status-red/10 transition-colors"
                      >
                        Admin
                      </Link>
                    )}
                  </div>

                  {/* Sign out */}
                  <div className="border-t border-border py-1">
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-status-red hover:bg-status-red/10 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile: Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-text-muted hover:text-text transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="md:hidden fixed top-14 left-0 right-0 z-50 bg-t-sidebar border-b border-gold/20 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            <div className="py-2">
              {/* Nav links */}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'block px-6 py-3 font-nav text-sm uppercase tracking-wider transition-colors',
                    isActive(item.href)
                      ? 'text-gold bg-gold-dim'
                      : 'text-text-muted hover:text-text'
                  )}
                >
                  {item.label}
                </Link>
              ))}

              <div className="h-px bg-border mx-4 my-2" />

              {/* Secondary links */}
              {secondaryItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-6 py-3 text-sm text-text-muted hover:text-text transition-colors"
                >
                  {item.label}
                </Link>
              ))}

              {isOrgAdmin && (
                <Link
                  href="/partner"
                  className="block px-6 py-3 text-sm text-gold/70 hover:text-gold transition-colors"
                >
                  Partner Portal
                </Link>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  className="block px-6 py-3 text-sm text-status-red/70 hover:text-status-red transition-colors"
                >
                  Admin
                </Link>
              )}

              {/* Upgrade for free tier */}
              {isFree && (
                <>
                  <div className="h-px bg-border mx-4 my-2" />
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); openUpgradeModal() }}
                    className="flex items-center gap-2 mx-4 my-2 px-4 py-2.5 bg-gold-dim border border-gold/30 rounded-lg text-gold hover:bg-gold hover:text-bg-primary transition-all"
                  >
                    <span>&#9733;</span>
                    <span className="font-nav text-xs font-bold uppercase tracking-wider">Upgrade</span>
                  </button>
                </>
              )}

              <div className="h-px bg-border mx-4 my-2" />

              {/* Theme toggle (mobile) */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-6 py-3 text-sm text-text-muted hover:text-text transition-colors w-full text-left"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>

              <div className="h-px bg-border mx-4 my-2" />

              {/* User info + sign out */}
              <div className="px-6 py-3 flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-gold to-gold-bright rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="font-heading font-bold text-xs text-bg-primary">{getInitials()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{getDisplayName()}</div>
                  <div className="text-xs text-text-muted">{getTierLabel()}</div>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full text-left px-6 py-3 text-sm text-status-red hover:bg-status-red/10 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
