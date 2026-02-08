'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface CollapsibleSectionProps {
  title: string
  icon: string
  defaultOpen?: boolean
  children: React.ReactNode
  actions?: React.ReactNode
}

export function CollapsibleSection({ title, icon, defaultOpen = false, children, actions }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Card>
      {/* Changed from <button> to <div> to allow nested buttons in actions */}
      <div className="w-full px-6 py-4 flex items-center justify-between hover:bg-bg-hover transition-colors">
        {/* Left side - clickable to toggle */}
        <div
          className="flex items-center gap-3 flex-1 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-gold text-lg">{icon}</span>
          <span className="font-heading text-sm font-bold uppercase tracking-wider">{title}</span>
          <span className={cn('text-text-muted transition-transform ml-2', isOpen && 'rotate-180')}>▼</span>
        </div>

        {/* Right side - actions (can contain buttons) */}
        {actions && (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {actions}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="px-6 pb-6 border-t border-border">
          <div className="pt-6">{children}</div>
        </div>
      )}
    </Card>
  )
}
