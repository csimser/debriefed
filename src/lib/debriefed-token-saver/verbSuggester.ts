import verbs from './action-verbs-library.json'

interface VerbCategory {
  description: string
  verbs: string[]
}

const verbData = verbs as Record<string, VerbCategory | { version: string; description: string }>

export function suggestVerbs(category: string, count: number = 5): string[] {
  const cat = verbData[category]
  if (cat && 'verbs' in cat) {
    return cat.verbs.slice(0, count)
  }
  // Fall back to quantified_impact if category not found
  const fallback = verbData.quantified_impact
  if (fallback && 'verbs' in fallback) {
    return fallback.verbs.slice(0, count)
  }
  return []
}

export function getAllCategories(): string[] {
  return Object.keys(verbData).filter(k => k !== 'meta')
}
