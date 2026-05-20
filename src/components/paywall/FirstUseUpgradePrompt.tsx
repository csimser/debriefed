'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface FirstUseUpgradePromptProps {
  feature: 'cover_letter' | 'job_match'
  tier: string
  used: number
  limit: number
}

const FEATURE_LABELS: Record<string, string> = {
  cover_letter: 'cover letter',
  job_match: 'job match analysis',
}

const STORAGE_KEYS: Record<string, string> = {
  cover_letter: 'debriefed_first_cover_letter',
  job_match: 'debriefed_first_job_match',
}

export function FirstUseUpgradePrompt({ feature, tier, used, limit }: FirstUseUpgradePromptProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (tier !== 'free') return
    if (used < 1 || used > limit) return

    const storageKey = STORAGE_KEYS[feature]
    const alreadySeen = localStorage.getItem(storageKey)
    if (alreadySeen) return

    localStorage.setItem(storageKey, 'true')
    setShow(true)
  }, [feature, tier, used, limit])

  if (!show) return null

  const featureName = FEATURE_LABELS[feature]
  const remaining = Math.max(0, limit - used)

  return (
    <div className="mt-4 p-3 rounded border border-gold/20 bg-gold/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
      <p className="text-sm text-white/60">
        <span className="text-gold">{used} of {limit}</span> free {featureName}{limit === 1 ? '' : 's'} used.
        {remaining > 0
          ? ` ${remaining} remaining.`
          : ' Unlock 10 more with Core.'}
      </p>
      <Link
        href="/pricing"
        className="text-gold text-sm font-heading uppercase tracking-wider hover:text-gold-bright transition-colors whitespace-nowrap"
      >
        Upgrade &mdash; $25 &rarr;
      </Link>
    </div>
  )
}
