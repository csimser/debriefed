'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface CollapsibleSectionProps {
  title: string
  icon: string
  defaultOpen?: boolean
  isOpen?: boolean
  onToggle?: () => void
  children: React.ReactNode
  actions?: React.ReactNode
  summary?: string
  hint?: string
}

export function CollapsibleSection({ title, icon, defaultOpen = false, isOpen: controlledOpen, onToggle, children, actions, summary, hint }: CollapsibleSectionProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)

  // Support both controlled and uncontrolled modes
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const toggle = onToggle || (() => setInternalOpen(prev => !prev))

  return (
    <Card>
      {/* Changed from <button> to <div> to allow nested buttons in actions */}
      <div className="w-full px-6 py-4 flex items-center justify-between hover:bg-bg-hover transition-colors">
        {/* Left side - clickable to toggle */}
        <div
          className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
          onClick={toggle}
        >
          <span className="text-gold text-lg flex-shrink-0">{icon}</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-heading text-sm font-bold uppercase tracking-wider">{title}</span>
              <span className={cn('text-text-muted transition-transform ml-1 text-xs', open && 'rotate-180')}>&#9660;</span>
            </div>
            {/* Summary line when collapsed */}
            {!open && summary && (
              <p className="text-xs text-text-muted mt-0.5 truncate">{summary}</p>
            )}
            {/* Impact hint when collapsed and section empty/incomplete */}
            {!open && hint && !summary && (
              <p className="text-xs text-gold/70 mt-0.5 italic">{hint}</p>
            )}
          </div>
        </div>

        {/* Right side - actions (can contain buttons) */}
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            {actions}
          </div>
        )}
      </div>

      {open && (
        <div className="px-6 pb-6 border-t border-border">
          <div className="pt-6">{children}</div>
        </div>
      )}
    </Card>
  )
}
