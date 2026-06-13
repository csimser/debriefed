/**
 * Local occupation-title search — replaces the O*NET /veterans/search API.
 *
 * The bundled onet-occupations.json (distinct code/title pairs from the DoD
 * crosswalk) is small (~30KB) and good enough for what this powered: finding
 * a likely O*NET occupation for a pasted job title to enrich AI prompts.
 * Lookups never hit the network and fail soft to an empty list.
 */
import { loadDataFile } from '@/lib/data/files.client'

export interface Occupation {
  code: string
  title: string
}

const STOPWORDS = new Set(['the', 'a', 'an', 'of', 'and', 'or', 'for', 'to', 'in', 'at', 'on', 'i', 'ii', 'iii', 'sr', 'jr', 'senior', 'junior', 'lead', 'staff', 'principal', 'remote'])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w))
}

/**
 * Rank occupations by token overlap with the query (job title).
 * Returns up to `limit` matches, best first; empty array when nothing fits.
 */
export async function searchOccupations(keyword: string, limit = 3): Promise<Occupation[]> {
  const queryTokens = tokenize(keyword)
  if (!queryTokens.length) return []

  let occupations: Occupation[]
  try {
    occupations = await loadDataFile<Occupation[]>('onet-occupations.json')
  } catch {
    return []
  }

  const scored: { occ: Occupation; score: number }[] = []
  for (const occ of occupations) {
    const titleTokens = tokenize(occ.title)
    if (!titleTokens.length) continue
    let hits = 0
    for (const qt of queryTokens) {
      if (titleTokens.some((tt) => tt === qt || tt.startsWith(qt) || qt.startsWith(tt))) hits++
    }
    if (!hits) continue
    // Favor titles where most words matched in both directions
    const score = hits / queryTokens.length + hits / titleTokens.length
    scored.push({ occ, score })
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.occ)
}
