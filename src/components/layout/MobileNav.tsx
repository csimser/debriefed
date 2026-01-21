'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LogoutButton } from './LogoutButton'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '◉' },
  { href: '/profile', label: 'My Profile', icon: '◎' },
  { href: '/resumes', label: 'My Resumes', icon: '◫' },
  { href: '/job-match', label: 'Job Match', icon: '◈' },
  { href: '/career-tools', label: 'Career Tools', icon: '◇' },
  { href: '/help', label: 'Help', icon: '?' },
]

interface MobileNavProps {
  user?: {
    first_name?: string
    last_name?: string
    full_name?: string
    tier?: string
    is_admin?: boolean
  }
}

export function MobileNav({ user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const getTierLabel = () => {
    switch (user?.tier?.toLowerCase()) {
      case 'full': return 'FULL'
      case 'core': return 'CORE'
      default: return 'FREE'
    }
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-bg-secondary border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
            <span className="font-heading font-bold text-bg-primary">D</span>
          </div>
          <span className="font-heading font-bold tracking-wide">DEBRIEFED</span>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-text-muted hover:text-text"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={cn(
        'md:hidden fixed top-0 right-0 bottom-0 w-72 bg-bg-secondary z-50 transform transition-transform duration-300',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <span className="font-heading font-bold uppercase tracking-wider">Menu</span>
          <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-text">
            ✕
          </button>
        </div>

        <nav className="p-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-all',
                  pathname === item.href
                    ? 'bg-gold-dim text-gold'
                    : 'text-text-muted hover:text-text hover:bg-bg-tertiary'
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-heading uppercase tracking-wider text-xs">{item.label}</span>
              </Link>
            ))}

            {/* Admin Link - only visible to admins */}
            {user?.is_admin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-all mt-4 border-t border-border pt-4',
                  pathname?.startsWith('/admin')
                    ? 'bg-status-red/10 text-status-red'
                    : 'text-status-red/70 hover:text-status-red hover:bg-status-red/10'
                )}
              >
                <span className="text-lg">⚙</span>
                <span className="font-heading uppercase tracking-wider text-xs">Admin</span>
              </Link>
            )}
          </div>
        </nav>

        {/* User Card */}
        {user && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
            <div className="bg-bg-tertiary rounded-lg p-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-bright flex items-center justify-center">
                  <span className="font-heading font-bold text-bg-primary">
                    {user.first_name && user.last_name
                      ? `${user.first_name[0]}${user.last_name[0]}`
                      : user.first_name?.[0] || 'U'}
                  </span>
                </div>
                <div>
                  <div className="font-heading text-sm font-semibold">
                    {user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'User'}
                  </div>
                  <div className="font-mono text-[10px] text-gold uppercase">{getTierLabel()} TIER</div>
                </div>
              </div>
            </div>
            <LogoutButton />
          </div>
        )}
      </div>
    </>
  )
}
