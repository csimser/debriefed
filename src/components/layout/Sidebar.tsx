'use client'

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

  // Get initials for avatar
  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`
    }
    if (user?.rank) {
      // Get rank abbreviation (e.g., "Senior Chief" -> "SC")
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

  return (
    <aside className="w-64 bg-bg-secondary border-r border-border flex flex-col h-full">
      {/* Header */}
      <Link href="/" className="p-4 border-b border-border flex items-center gap-3 hover:bg-bg-tertiary transition-colors">
        <div className="w-10 h-10 bg-bg-tertiary rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 9h6M9 13h6M9 17h4"/>
          </svg>
        </div>
        <div>
          <div className="font-heading font-bold text-lg tracking-wide">DEBRIEFED</div>
          <div className="font-mono text-[10px] text-text-muted">MISSION: TRANSITION</div>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-auto">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-all',
                pathname === item.href
                  ? 'bg-gold-dim text-gold border-l-2 border-gold'
                  : 'text-text-muted hover:text-text hover:bg-bg-tertiary'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-heading uppercase tracking-wider text-xs">{item.label}</span>
            </Link>
          ))}

          {/* Admin Link - only visible to admins */}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-all mt-4 border-t border-border pt-4',
                pathname?.startsWith('/admin')
                  ? 'bg-status-red/10 text-status-red border-l-2 border-status-red'
                  : 'text-status-red/70 hover:text-status-red hover:bg-status-red/10'
              )}
            >
              <span className="text-lg">⚙</span>
              <span className="font-heading uppercase tracking-wider text-xs">Admin</span>
            </Link>
          )}
        </div>
      </nav>

      {/* User Card Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-3 bg-bg-tertiary rounded-lg">
          <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-bright rounded-lg flex items-center justify-center">
            <span className="font-heading font-bold text-sm text-bg-primary">{getInitials()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">{getDisplayName()}</div>
            <div className="text-xs text-text-muted">{getTierLabel()}</div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full mt-3 py-2 text-sm text-status-red hover:bg-status-red/10 rounded transition-all"
        >
          ⏻ Sign Out
        </button>
      </div>
    </aside>
  )
}
