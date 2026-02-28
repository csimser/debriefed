'use client'

import { useState } from 'react'
import Link from 'next/link'

interface ChecklistItemData {
  done: boolean
  label: string
  href: string
}

interface DashboardChecklistProps {
  items: ChecklistItemData[]
}

export function DashboardChecklist({ items }: DashboardChecklistProps) {
  const completedCount = items.filter(i => i.done).length
  const [collapsed, setCollapsed] = useState(completedCount > 3)

  return (
    <div className="rounded-xl border border-border bg-bg-card p-5">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between"
      >
        <h2 className="font-heading text-sm font-bold uppercase tracking-wider">
          Mission Checklist
          <span className="ml-2 text-text-muted font-normal">
            {completedCount}/{items.length}
          </span>
        </h2>
        <svg
          className={`w-4 h-4 text-text-muted transition-transform ${collapsed ? '' : 'rotate-180'}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {collapsed && (
        <div className="mt-3">
          <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gold rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / items.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {!collapsed && (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                item.done ? 'bg-gold/20 text-gold' : 'bg-bg-tertiary text-text-muted'
              }`}>
                {item.done ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-text-muted/40" />
                )}
              </div>
              {item.done ? (
                <span className="text-sm text-text-muted line-through">{item.label}</span>
              ) : (
                <Link href={item.href} className="text-sm text-gold hover:text-gold-bright font-medium transition-colors">
                  {item.label} &rarr;
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
