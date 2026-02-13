'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: '◉' },
  { href: '/admin/users', label: 'Users', icon: '◎' },
  { href: '/admin/beta-codes', label: 'Access Codes', icon: '◈' },
  { href: '/admin/promo-codes', label: 'Promo Codes', icon: '◇' },
  { href: '/admin/feedback', label: 'Feedback', icon: '◫' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙' },
]

const STORAGE_KEY = 'admin-sidebar-collapsed'

interface AdminLayoutProps {
  children: React.ReactNode
  adminEmail?: string
}

export function AdminLayout({ children, adminEmail }: AdminLayoutProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Initialize state from localStorage and handle responsive behavior
  useEffect(() => {
    setIsHydrated(true)

    const savedState = localStorage.getItem(STORAGE_KEY)

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

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname?.startsWith(href)
  }

  // Prevent hydration mismatch
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-bg-primary flex">
        <aside className="w-64 bg-navy border-r border-navy/50 flex flex-col h-screen">
          <div className="p-4 border-b border-white/10 h-[72px]" />
        </aside>
        <div className="flex-1">
          <main className="p-6">{children}</main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Mobile Header with Hamburger - Only on mobile (<768px) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-navy border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold/20 rounded flex items-center justify-center">
            <span className="text-gold font-heading font-bold">A</span>
          </div>
          <span className="font-heading font-bold tracking-wide text-white">ADMIN</span>
        </Link>

        <button
          onClick={toggleMobileMenu}
          className="p-2 text-white/70 hover:text-white transition-colors"
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

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'bg-navy border-r border-navy/50 flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out z-50',
          // Mobile: overlay from left, hidden by default
          'max-md:fixed max-md:top-0 max-md:bottom-0 max-md:left-0 max-md:h-full',
          isMobileOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full',
          // Tablet & Desktop: static positioning
          'md:relative md:translate-x-0',
          // Width based on collapsed state
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between min-h-[72px]">
          <Link
            href="/admin"
            className={cn(
              'flex items-center gap-3 hover:opacity-80 transition-opacity',
              isCollapsed && 'justify-center w-full'
            )}
            onClick={handleLinkClick}
          >
            <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-gold text-xl">⚙</span>
            </div>
            {!isCollapsed && (
              <div>
                <div className="font-heading font-bold text-lg tracking-wide text-white">ADMIN</div>
                <div className="font-mono text-[10px] text-white/50">DEBRIEFED</div>
              </div>
            )}
          </Link>
        </div>

        {/* Collapse Toggle Button - Hidden on mobile */}
        <button
          onClick={toggleCollapse}
          className={cn(
            'hidden md:flex absolute top-4 -right-3 w-6 h-6 bg-navy border border-white/20 rounded-full items-center justify-center',
            'hover:bg-gold hover:text-navy hover:border-gold transition-all z-10'
          )}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            className={cn('w-4 h-4 text-white transition-transform', isCollapsed && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Back to App Link */}
        <Link
          href="/dashboard"
          onClick={handleLinkClick}
          className={cn(
            'mx-4 mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-md text-sm text-white/70 hover:text-white transition-colors flex items-center gap-2',
            isCollapsed && 'justify-center px-2'
          )}
          title={isCollapsed ? 'Back to App' : undefined}
        >
          <span>←</span>
          {!isCollapsed && <span className="font-heading uppercase tracking-wider text-xs">Back to App</span>}
        </Link>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-auto">
          {!isCollapsed && (
            <div className="text-[10px] text-white/40 uppercase tracking-wider font-heading mb-3 px-4">
              Admin Menu
            </div>
          )}
          <div className="space-y-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  'relative group flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-all',
                  isCollapsed && 'justify-center px-2',
                  isActive(item.href)
                    ? 'bg-gold/20 text-gold border-l-2 border-gold'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                <span className={cn('text-lg', isCollapsed && 'text-xl')}>{item.icon}</span>
                {!isCollapsed && (
                  <span className="font-heading uppercase tracking-wider text-xs">{item.label}</span>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-navy border border-white/20 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
                    <span className="font-heading uppercase tracking-wider text-xs text-white">{item.label}</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Admin Email Footer */}
        <div className="p-4 border-t border-white/10">
          {isCollapsed ? (
            <div className="relative group">
              <div className="w-12 h-12 mx-auto bg-gold/30 rounded-lg flex items-center justify-center cursor-pointer">
                <span className="font-heading font-bold text-sm text-gold">
                  {adminEmail?.[0]?.toUpperCase() || 'A'}
                </span>
              </div>
              {/* Tooltip */}
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-navy border border-white/20 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                <div className="text-[10px] text-white/40 uppercase tracking-wider">Logged in as</div>
                <div className="text-xs text-white/80">{adminEmail || 'Admin'}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <div className="w-8 h-8 bg-gold/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="font-heading font-bold text-xs text-gold">
                  {adminEmail?.[0]?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-white/40 uppercase tracking-wider">Logged in as</div>
                <div className="text-xs text-white/80 truncate">{adminEmail || 'Admin'}</div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        'flex-1 flex flex-col min-w-0 transition-all duration-300'
      )}>
        {/* Top Warning Bar */}
        <div className="bg-status-red/10 border-b border-status-red/20 px-6 py-2 max-md:mt-14">
          <div className="flex items-center gap-2 text-status-red font-mono text-xs uppercase">
            <span>⚠</span>
            <span>Admin Dashboard - Handle with care</span>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
