'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '◉' },
  { href: '/profile', label: 'My Profile', icon: '◎' },
  { href: '/resumes', label: 'My Resumes', icon: '◫' },
  { href: '/job-match', label: 'Job Match', icon: '◈' },
  { href: '/career-tools', label: 'Career Tools', icon: '◇' },
  { href: '/help', label: 'Help', icon: '?' },
]

const STORAGE_KEY = 'sidebar-collapsed'

interface SidebarProps {
  user?: {
    email?: string
    first_name?: string
    last_name?: string
    rank?: string
  }
  tier?: string
  isAdmin?: boolean
}

export function Sidebar({ user, tier = 'free', isAdmin = false }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Initialize state from localStorage and handle responsive behavior
  useEffect(() => {
    setIsHydrated(true)

    // Check localStorage for saved preference
    const savedState = localStorage.getItem(STORAGE_KEY)

    // Determine initial state based on screen size and saved preference
    const handleResize = () => {
      const width = window.innerWidth

      if (width < 768) {
        // Mobile: always collapsed (will show as overlay when opened)
        setIsCollapsed(true)
        setIsMobileOpen(false)
      } else if (width < 1024) {
        // Tablet: auto-collapse by default
        setIsCollapsed(true)
      } else {
        // Desktop: use saved preference or default to expanded
        setIsCollapsed(savedState === 'true')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Toggle collapsed state and save to localStorage
  const toggleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)

    // Only save preference on desktop
    if (window.innerWidth >= 1024) {
      localStorage.setItem(STORAGE_KEY, String(newState))
    }
  }

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(false)
    }
  }

  // Get initials for avatar
  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`
    }
    if (user?.rank) {
      const words = user.rank.split(' ')
      if (words.length >= 2) {
        return `${words[0][0]}${words[1][0]}`
      }
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

  // Prevent hydration mismatch by not rendering until mounted
  if (!isHydrated) {
    return (
      <aside className="w-64 bg-bg-secondary border-r border-border flex flex-col h-full">
        <div className="p-4 border-b border-border h-[72px]" />
      </aside>
    )
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <>
      {/* Mobile Header with Hamburger - Only on mobile (<768px) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-bg-secondary border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
            <span className="font-heading font-bold text-bg-primary">D</span>
          </div>
          <span className="font-heading font-bold tracking-wide">DEBRIEFED</span>
        </Link>

        <button
          onClick={toggleMobileMenu}
          className="p-2 text-text-muted hover:text-text transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Overlay - Only on mobile (<768px) */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'bg-bg-secondary border-r border-border flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out z-50',
          // Mobile (<768px): overlay from left, hidden by default
          'max-md:fixed max-md:top-0 max-md:bottom-0 max-md:left-0 max-md:h-full',
          isMobileOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full',
          // Tablet & Desktop (>=768px): static positioning, always visible
          'md:relative md:translate-x-0',
          // Width based on collapsed state
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between min-h-[72px]">
          <Link
            href="/"
            className={cn(
              'flex items-center gap-3 hover:opacity-80 transition-opacity',
              isCollapsed && 'justify-center w-full'
            )}
            onClick={handleLinkClick}
          >
            <div className="w-10 h-10 bg-bg-tertiary rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 9h6M9 13h6M9 17h4"/>
              </svg>
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <div className="font-heading font-bold text-lg tracking-wide whitespace-nowrap">DEBRIEFED</div>
                <div className="font-mono text-[10px] text-text-muted whitespace-nowrap">MISSION: TRANSITION</div>
              </div>
            )}
          </Link>
        </div>

        {/* Collapse Toggle Button - Hidden on mobile (<768px) */}
        <button
          onClick={toggleCollapse}
          className={cn(
            'hidden md:flex absolute top-4 -right-3 w-6 h-6 bg-bg-tertiary border border-border rounded-full items-center justify-center',
            'hover:bg-gold hover:text-bg-primary hover:border-gold transition-all z-10'
          )}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            className={cn('w-4 h-4 transition-transform', isCollapsed && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-auto">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={pathname === item.href}
                isCollapsed={isCollapsed}
                onClick={handleLinkClick}
              />
            ))}

            {/* Admin Link */}
            {isAdmin && (
              <div className="mt-4 pt-4 border-t border-border">
                <NavItem
                  href="/admin"
                  icon="⚙"
                  label="Admin"
                  isActive={pathname?.startsWith('/admin') || false}
                  isCollapsed={isCollapsed}
                  onClick={handleLinkClick}
                  isAdmin
                />
              </div>
            )}
          </div>
        </nav>

        {/* User Card Footer */}
        <div className="p-4 border-t border-border">
          {isCollapsed ? (
            // Collapsed: Just avatar with tooltip
            <div className="relative group">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-gold to-gold-bright rounded-lg flex items-center justify-center cursor-pointer">
                <span className="font-heading font-bold text-sm text-bg-primary">{getInitials()}</span>
              </div>
              {/* Tooltip */}
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-bg-tertiary border border-border rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                <div className="font-semibold text-sm">{getDisplayName()}</div>
                <div className="text-xs text-text-muted">{getTierLabel()}</div>
              </div>
            </div>
          ) : (
            // Expanded: Full user card
            <div className="flex items-center gap-3 p-3 bg-bg-tertiary rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-bright rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="font-heading font-bold text-sm text-bg-primary">{getInitials()}</span>
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="font-semibold text-sm truncate">{getDisplayName()}</div>
                <div className="text-xs text-text-muted">{getTierLabel()}</div>
              </div>
            </div>
          )}

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className={cn(
              'w-full mt-3 py-2 text-sm text-status-red hover:bg-status-red/10 rounded transition-all flex items-center justify-center gap-2',
              isCollapsed && 'px-0'
            )}
            title={isCollapsed ? 'Sign Out' : undefined}
          >
            <span>⏻</span>
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

// NavItem component with tooltip for collapsed state
function NavItem({
  href,
  icon,
  label,
  isActive,
  isCollapsed,
  onClick,
  isAdmin = false,
}: {
  href: string
  icon: string
  label: string
  isActive: boolean
  isCollapsed: boolean
  onClick?: () => void
  isAdmin?: boolean
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'relative group flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-all',
        isCollapsed && 'justify-center px-2',
        isAdmin
          ? isActive
            ? 'bg-status-red/10 text-status-red border-l-2 border-status-red'
            : 'text-status-red/70 hover:text-status-red hover:bg-status-red/10'
          : isActive
            ? 'bg-gold-dim text-gold border-l-2 border-gold'
            : 'text-text-muted hover:text-text hover:bg-bg-tertiary'
      )}
    >
      <span className={cn('text-lg', isCollapsed && 'text-xl')}>{icon}</span>
      {!isCollapsed && (
        <span className="font-heading uppercase tracking-wider text-xs whitespace-nowrap">{label}</span>
      )}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-bg-tertiary border border-border rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
          <span className="font-heading uppercase tracking-wider text-xs">{label}</span>
        </div>
      )}
    </Link>
  )
}
