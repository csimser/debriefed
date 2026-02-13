'use client'

import { useMemo } from 'react'
import { findCivilianTitles } from '@/lib/military-titles'

interface CivilianTitleSuggestionsProps {
  militaryTitle: string
  selectedTitle: string
  onSelect: (title: string) => void
}

export function CivilianTitleSuggestions({
  militaryTitle,
  selectedTitle,
  onSelect
}: CivilianTitleSuggestionsProps) {
  const suggestions = useMemo(() => {
    return findCivilianTitles(militaryTitle)
  }, [militaryTitle])

  if (suggestions.length === 0) return null

  return (
    <div className="p-3 bg-status-blue/10 border border-status-blue/30 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-gold">&#9670;</span>
        <span className="text-xs font-semibold text-status-blue">Civilian Equivalents:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((title, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(title)}
            className={`px-2 py-1 text-xs rounded border transition-all ${
              selectedTitle === title
                ? 'bg-gold text-bg-primary border-gold'
                : 'bg-bg-tertiary border-border hover:border-gold hover:text-gold'
            }`}
          >
            {title}
          </button>
        ))}
      </div>
    </div>
  )
}
