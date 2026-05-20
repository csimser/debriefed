import terms from './military-terms-dictionary.json'

const acronyms = terms.acronyms as Record<string, string>
const generalTerms = terms.terms as Record<string, string>
const ranks = terms.ranks as Record<string, Record<string, { abbreviation: string; civilian_equivalent: string }>>

export function translateTerm(militaryTerm: string): string | null {
  const normalized = militaryTerm.toLowerCase().trim()
  const upper = militaryTerm.toUpperCase().trim()

  // Check acronyms first
  if (acronyms[upper]) {
    return acronyms[upper]
  }

  // Check general terms
  if (generalTerms[normalized]) {
    return generalTerms[normalized]
  }

  return null // Not found - fall back to AI
}

export function getRankTranslation(branch: string, paygrade: string): string | null {
  const branchKey = branch.toLowerCase().replace(/[^a-z]/g, '_')
  const branchRanks = ranks[branchKey]
  if (!branchRanks) return null
  const rank = branchRanks[paygrade]
  return rank?.civilian_equivalent || null
}
