'use client'

import { useState } from 'react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { themes } from '@/lib/themes'
import { cn } from '@/lib/utils'

export function ThemeSwitcher({ isAdmin }: { isAdmin: boolean }) {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  if (!isAdmin) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 bg-bg-card border border-border rounded-lg shadow-xl p-3 min-w-[220px] animate-fade-in">
          <p className="text-xs text-text-muted uppercase tracking-wider font-heading mb-2 px-2">
            Theme Preview (Admin Only)
          </p>
          <div className="space-y-1">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id)
                  setIsOpen(false)
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all text-left',
                  theme.id === t.id
                    ? 'bg-gold-dim text-gold'
                    : 'text-text-muted hover:text-text hover:bg-bg-hover'
                )}
              >
                <div
                  className="w-5 h-5 rounded-full border-2 flex-shrink-0"
                  style={{
                    backgroundColor: t.colors.primary,
                    borderColor: t.colors.sidebar,
                  }}
                />
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs opacity-70">{t.style}</div>
                </div>
                {theme.id === t.id && (
                  <span className="ml-auto text-gold">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all',
          'bg-bg-card border border-border hover:border-gold text-text-muted hover:text-gold',
          isOpen && 'border-gold text-gold rotate-45'
        )}
        title="Theme Preview (Admin Only)"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
          <circle cx="7.5" cy="11.5" r="1.5"/>
          <circle cx="10.5" cy="7.5" r="1.5"/>
          <circle cx="15.5" cy="7.5" r="1.5"/>
          <circle cx="17.5" cy="11.5" r="1.5"/>
        </svg>
      </button>
    </div>
  )
}
