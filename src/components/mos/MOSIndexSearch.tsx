'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { MOSIndexEntry } from '@/lib/mos-page-data'

const BRANCHES = ['All', 'Army', 'Navy', 'Air Force', 'Marines', 'Coast Guard', 'Space Force'] as const

const BRANCH_COLORS: Record<string, string> = {
  'Army': 'text-green-400',
  'Navy': 'text-blue-400',
  'Air Force': 'text-sky-400',
  'Marines': 'text-red-400',
  'Coast Guard': 'text-orange-400',
  'Space Force': 'text-indigo-400',
}

export function MOSIndexSearch({ entries }: { entries: MOSIndexEntry[] }) {
  const [search, setSearch] = useState('')
  const [activeBranch, setActiveBranch] = useState<string>('All')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return entries.filter((entry) => {
      const branchMatch = activeBranch === 'All' || entry.branch === activeBranch
      if (!branchMatch) return false
      if (!q) return true
      return (
        entry.military_code.toLowerCase().includes(q) ||
        entry.military_title.toLowerCase().includes(q) ||
        entry.civilian_titles.some((t) => t.toLowerCase().includes(q))
      )
    })
  }, [entries, search, activeBranch])

  const grouped = useMemo(() => {
    const g: Record<string, MOSIndexEntry[]> = {}
    for (const entry of filtered) {
      if (!g[entry.branch]) g[entry.branch] = []
      g[entry.branch].push(entry)
    }
    return g
  }, [filtered])

  const branchOrder = BRANCHES.filter((b) => b !== 'All')

  return (
    <div>
      {/* Search + Filter Bar */}
      <div className="mb-8 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by MOS code, title, or civilian job..."
            className="w-full pl-12 pr-4 py-3.5 bg-bg-secondary border border-border rounded text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-gold transition-colors font-mono"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-text transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Branch Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {BRANCHES.map((branch) => (
            <button
              key={branch}
              onClick={() => setActiveBranch(branch)}
              className={`px-4 py-2 text-xs font-heading font-semibold uppercase tracking-wider border rounded transition-all ${
                activeBranch === branch
                  ? 'bg-gold text-bg-primary border-gold'
                  : 'bg-bg-secondary text-text-muted border-border hover:border-gold/50 hover:text-text'
              }`}
            >
              {branch}
            </button>
          ))}
        </div>

        {/* Result count */}
        <p className="text-xs font-mono text-text-dim">
          {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
          {search && ` for "${search}"`}
          {activeBranch !== 'All' && ` in ${activeBranch}`}
        </p>
      </div>

      {/* Results by Branch */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted text-lg mb-2">No MOS codes found</p>
          <p className="text-text-dim text-sm">Try a different search term or branch filter</p>
        </div>
      ) : (
        <div className="space-y-10">
          {branchOrder.map((branch) => {
            const branchEntries = grouped[branch]
            if (!branchEntries?.length) return null

            return (
              <div key={branch}>
                <h2 className="font-heading text-xl font-bold uppercase tracking-wider mb-4 flex items-center gap-3">
                  <span className={BRANCH_COLORS[branch] || 'text-text'}>{branch}</span>
                  <span className="text-xs font-mono text-text-dim font-normal">({branchEntries.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {branchEntries.map((entry) => (
                    <Link
                      key={`${entry.branch}-${entry.military_code}`}
                      href={`/mos/${entry.military_code.toLowerCase()}`}
                      className="bg-bg-secondary/50 border border-border rounded-lg p-4 hover:border-gold/50 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-mono text-lg font-bold text-gold group-hover:text-gold-bright transition-colors">
                          {entry.military_code}
                        </span>
                        <svg className="w-4 h-4 text-text-dim group-hover:text-gold transition-colors mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <h3 className="font-heading text-sm font-semibold text-text mb-2 leading-snug">
                        {entry.military_title}
                      </h3>
                      {entry.civilian_titles.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {entry.civilian_titles.slice(0, 3).map((title) => (
                            <span key={title} className="text-[11px] font-mono text-text-dim bg-bg-tertiary px-2 py-0.5 rounded">
                              {title}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
