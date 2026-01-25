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
    href: '/career-tools?tool=cover-letter',
    label: 'Cover Letter',
    matchPath: '/career-tools',
    matchTool: 'cover-letter',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2"/>
        <path d="M2 6l10 7 10-7"/>
        <rect x="2" y="6" width="20" height="14" rx="2"/>
      </svg>
    )
  },
  {
    href: '/career-tools?tool=linkedin',
    label: 'LinkedIn',
    matchPath: '/career-tools',
    matchTool: 'linkedin',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
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

          let isActive = false
          if (item.matchPath && item.matchTool) {
            isActive = pathname === item.matchPath && currentTool === item.matchTool
          } else if (itemTool) {
            isActive = pathname === itemPath && currentTool === itemTool
          } else {
            isActive = pathname === item.href
          }

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
