'use client'

interface FederalTrimSuggestionsProps {
  isOverLimit: boolean
  experienceCount: number
  bulletCounts: number[]  // bullets per experience
  hasSummary: boolean
  hasVolunteer?: boolean
  hasAwards?: boolean
  hasAffiliations?: boolean
}

export function FederalTrimSuggestions({
  isOverLimit,
  experienceCount,
  bulletCounts,
  hasSummary,
  hasVolunteer = false,
  hasAwards = false,
  hasAffiliations = false,
}: FederalTrimSuggestionsProps) {
  if (!isOverLimit) return null

  const suggestions: string[] = []

  // Prioritize suggestions by impact
  if (experienceCount > 3) {
    suggestions.push(`Remove ${experienceCount - 3} older position${experienceCount - 3 > 1 ? 's' : ''} (keep 2-3 most relevant)`)
  }

  bulletCounts.forEach((count, idx) => {
    if (count > 5) {
      suggestions.push(`Reduce bullets in position ${idx + 1} from ${count} to 4-5`)
    }
  })

  if (hasAffiliations) {
    suggestions.push('Remove Professional Affiliations section')
  }

  if (hasVolunteer) {
    suggestions.push('Condense or remove Volunteer Experience')
  }

  if (hasAwards) {
    suggestions.push('Combine Awards with Certifications or remove')
  }

  if (hasSummary) {
    suggestions.push('Shorten Summary to 4-5 lines max')
  }

  // Always include these general tips
  suggestions.push('Shorten bullet points to one line each')
  suggestions.push('Use 10pt font instead of 12pt')

  return (
    <div className="bg-status-red/10 border border-status-red/30 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 text-status-red font-semibold text-sm mb-3">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        Resume exceeds 2-page federal limit
      </div>
      <p className="text-xs text-text-muted mb-2">
        USAJOBS recommends keeping federal resumes to 2 pages. Consider these changes:
      </p>
      <ul className="text-xs text-text-secondary space-y-1">
        {suggestions.slice(0, 6).map((suggestion, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-gold mt-0.5">-</span>
            <span>{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
