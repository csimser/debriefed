'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: '◉' },
  { href: '/admin/users', label: 'Users', icon: '◎' },
  { href: '/admin/beta-codes', label: 'Beta Codes', icon: '◈' },
  { href: '/admin/promo-codes', label: 'Promo Codes', icon: '◇' },
  { href: '/admin/feedback', label: 'Feedback', icon: '◫' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙' },
]

interface AdminLayoutProps {
  children: React.ReactNode
  adminEmail?: string
}

export function AdminLayout({ children, adminEmail }: AdminLayoutProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname?.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a365d] border-r border-[#1a365d]/50 flex flex-col h-screen fixed">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#b8860b]/20 rounded-lg flex items-center justify-center">
              <span className="text-[#b8860b] text-xl">⚙</span>
            </div>
            <div>
              <div className="font-heading font-bold text-lg tracking-wide text-white">ADMIN</div>
              <div className="font-mono text-[10px] text-white/50">DEBRIEFED</div>
            </div>
          </div>
        </div>

        {/* Back to App Link */}
        <Link
          href="/dashboard"
          className="mx-4 mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-md text-sm text-white/70 hover:text-white transition-colors flex items-center gap-2"
        >
          <span>←</span>
          <span className="font-heading uppercase tracking-wider text-xs">Back to App</span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-auto">
          <div className="text-[10px] text-white/40 uppercase tracking-wider font-heading mb-3 px-4">
            Admin Menu
          </div>
          <div className="space-y-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-all',
                  isActive(item.href)
                    ? 'bg-[#b8860b]/20 text-[#b8860b] border-l-2 border-[#b8860b]'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-heading uppercase tracking-wider text-xs">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Admin Email Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            <div className="w-8 h-8 bg-[#b8860b]/30 rounded-lg flex items-center justify-center">
              <span className="font-heading font-bold text-xs text-[#b8860b]">
                {adminEmail?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-white/40 uppercase tracking-wider">Logged in as</div>
              <div className="text-xs text-white/80 truncate">{adminEmail || 'Admin'}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Warning Bar */}
        <div className="bg-status-red/10 border-b border-status-red/20 px-6 py-2">
          <div className="flex items-center gap-2 text-status-red font-mono text-xs uppercase">
            <span>⚠</span>
            <span>Admin Dashboard - Handle with care</span>
          </div>
        </div>

        {/* Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
