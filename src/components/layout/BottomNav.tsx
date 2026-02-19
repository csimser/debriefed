'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    )
  },
  {
    href: '/resumes',
    label: 'Resumes',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 9h6M9 13h6M9 17h4"/>
      </svg>
    )
  },
  {
    href: '/career-tools',
    label: 'Tools',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    )
  },
]

export function BottomNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTool = searchParams.get('tool')

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-secondary border-t border-border safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          // Check if this nav item is active
          const [itemPath, itemQuery] = item.href.split('?')
          const itemTool = itemQuery?.split('=')[1]

          const isActive = itemTool
            ? pathname === itemPath && currentTool === itemTool
            : pathname === itemPath

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full py-2 px-1 transition-colors',
                'min-w-[64px] touch-target',
                isActive
                  ? 'text-gold'
                  : 'text-text-muted active:text-text'
              )}
            >
              <div className={cn(
                'mb-1 transition-transform',
                isActive && 'scale-110'
              )}>
                {item.icon}
              </div>
              <span className={cn(
                'text-[10px] font-heading uppercase tracking-wider',
                isActive ? 'font-bold' : 'font-medium'
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
