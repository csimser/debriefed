'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSidebarCommunityData, type SidebarCommunityData } from '@/lib/dictionary/communityQueries'

const BADGE_TIERS = [
  { min: 50, label: 'Dictionary Legend', icon: '💎', nextLabel: null, nextMin: Infinity },
  { min: 30, label: 'Command Master Chief', icon: '🏆', nextLabel: 'Dictionary Legend', nextMin: 50 },
  { min: 15, label: 'Platoon Sergeant', icon: '⭐', nextLabel: 'Command Master Chief', nextMin: 30 },
  { min: 5, label: 'Squad Leader', icon: '🎖️', nextLabel: 'Platoon Sergeant', nextMin: 15 },
  { min: 0, label: 'New Recruit', icon: '🏅', nextLabel: 'Squad Leader', nextMin: 5 },
]

export function CommunityMissionWidget() {
  const [data, setData] = useState<SidebarCommunityData | null>(null)

  useEffect(() => {
    getSidebarCommunityData().then(setData).catch(() => {})
  }, [])

  if (!data) return null

  const badge = BADGE_TIERS.find(t => data.userSubmissions >= t.min) || BADGE_TIERS[BADGE_TIERS.length - 1]
  const isMaxTier = !badge.nextLabel
  const progress = isMaxTier
    ? 1
    : badge.nextMin > badge.min
      ? (data.userSubmissions - badge.min) / (badge.nextMin - badge.min)
      : 0

  return (
    <div className="p-5 border border-gold/20 bg-gold/[0.04] rounded-xl space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-gold text-sm">🔥</span>
        <span className="font-heading uppercase tracking-widest text-xs font-bold text-gold">Help the Mission</span>
      </div>

      <div className="text-sm text-text-muted">Know a military term that needs translating?</div>

      <Link
        href="/career-tools?tool=community"
        className="inline-flex items-center gap-1 text-xs font-heading font-bold uppercase tracking-wider text-gold hover:text-gold-bright transition-colors"
      >
        Help Translate
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      {data.missingTermCount > 0 && (
        <div className="text-xs text-text-dim">
          {data.missingTermCount} terms need translations
        </div>
      )}

      <div className="pt-2 border-t border-gold/10 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm leading-none">{badge.icon}</span>
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-text">{badge.label}</span>
        </div>
        <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold to-gold-bright rounded-full transition-all duration-500"
            style={{ width: `${Math.min(Math.max(progress * 100, isMaxTier ? 100 : 4), 100)}%` }}
          />
        </div>
        {!isMaxTier && (
          <div className="text-[10px] text-text-dim">
            {data.userSubmissions} of {badge.nextMin} for {badge.nextLabel}
          </div>
        )}
      </div>
    </div>
  )
}
