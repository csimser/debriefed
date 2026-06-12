/**
 * MOS SEO Page Data Layer
 *
 * Build-time data for /mos/[code] and /mos index pages.
 * Reads the bundled data files from public-data/ (previously Supabase).
 */

import { loadDataFileSync } from '@/lib/data/files.server'
import type {
  DictMosToCivilian,
  DictOnetCrosswalk,
  DictMilitaryJargon,
  DictBulletPattern,
} from '@/lib/dictionary/types'

// ============================================================================
// Types
// ============================================================================

export interface MOSCodeEntry {
  code: string
  branch: string
}

export interface MOSIndexEntry {
  military_code: string
  military_title: string
  branch: string
  civilian_titles: string[]
  key_skills: string[]
}

export interface MOSPageData {
  /** Primary MOS record (first branch found) */
  mos: DictMosToCivilian
  /** All branch records for this code (for codes shared across branches) */
  allBranchRecords: DictMosToCivilian[]
  crosswalk: DictOnetCrosswalk[]
  jargon: DictMilitaryJargon[]
  bulletPatterns: DictBulletPattern[]
}

export interface MOSByBranch {
  [branch: string]: MOSIndexEntry[]
}

// Branch name normalization for jargon lookups
const BRANCH_JARGON_MAP: Record<string, string[]> = {
  'Army': ['Army', 'army'],
  'Navy': ['Navy', 'navy'],
  'Air Force': ['Air Force', 'air force', 'USAF'],
  'Marines': ['Marines', 'marines', 'Marine Corps', 'USMC'],
  'Coast Guard': ['Coast Guard', 'coast guard', 'USCG'],
  'Space Force': ['Space Force', 'space force', 'USSF'],
}

/** Map DB branch slugs to display names used by the frontend components */
const BRANCH_DISPLAY_MAP: Record<string, string> = {
  'army': 'Army',
  'navy': 'Navy',
  'usaf': 'Air Force',
  'air force': 'Air Force',
  'usmc': 'Marines',
  'marines': 'Marines',
  'uscg': 'Coast Guard',
  'coast guard': 'Coast Guard',
  'ussf': 'Space Force',
  'space force': 'Space Force',
}

/** Normalize DB branch slug to title-case display name */
function normalizeBranch(raw: string): string {
  return BRANCH_DISPLAY_MAP[raw.toLowerCase()] || raw
}

/**
 * Flatten arrays that may contain semicolon-delimited strings.
 * e.g. ["A; B; C"] → ["A", "B", "C"]
 */
function flattenSemicolonArray(arr: string[]): string[] {
  const result: string[] = []
  for (const item of arr) {
    if (item.includes(';')) {
      for (const part of item.split(';')) {
        const trimmed = part.trim()
        if (trimmed) result.push(trimmed)
      }
    } else {
      const trimmed = item.trim()
      if (trimmed) result.push(trimmed)
    }
  }
  return result
}

// ============================================================================
// Bundled data access
// ============================================================================

const getMosTable = () => loadDataFileSync<DictMosToCivilian[]>('mos_to_civilian.json')
const getCrosswalkTable = () => loadDataFileSync<DictOnetCrosswalk[]>('onet_crosswalk.json')
const getJargonTable = () => loadDataFileSync<DictMilitaryJargon[]>('military_jargon.json')
const getBulletPatternTable = () => loadDataFileSync<DictBulletPattern[]>('bullet_patterns.json')

const eq = (a: string | null | undefined, b: string | null | undefined) =>
  (a ?? '').toLowerCase() === (b ?? '').toLowerCase()

// ============================================================================
// Data access functions
// ============================================================================

/**
 * Returns deduplicated MOS codes for generateStaticParams — lowercase, unique codes.
 */
export async function getAllMOSCodes(): Promise<MOSCodeEntry[]> {
  const rows = [...getMosTable()].sort(
    (a, b) =>
      (a.branch ?? '').localeCompare(b.branch ?? '') ||
      a.military_code.localeCompare(b.military_code),
  )

  const seen = new Set<string>()
  const result: MOSCodeEntry[] = []
  for (const row of rows) {
    const lc = row.military_code.toLowerCase()
    if (!seen.has(lc)) {
      seen.add(lc)
      result.push({ code: lc, branch: row.branch })
    }
  }
  return result
}

/**
 * Returns full page data for one MOS code.
 * Collects ALL branch records for the code and merges data.
 */
export async function getMOSPageData(code: string): Promise<MOSPageData | null> {
  const allBranchRecords = getMosTable().filter((r) => eq(r.military_code, code))
  if (!allBranchRecords.length) {
    console.error('[mos-page-data] getMOSPageData MOS not found:', code)
    return null
  }
  const mos = allBranchRecords[0]

  // O*NET crosswalk rows for this MOS code
  const crosswalk = getCrosswalkTable()
    .filter((r) => eq(r.moc, mos.military_code))
    .slice(0, 20)

  // Branch-relevant jargon for ALL branches of this code (+ general/null branch)
  const branches = [...new Set(allBranchRecords.map((r) => r.branch))]
  const wantedBranches = new Set<string>()
  for (const branch of branches) {
    for (const b of BRANCH_JARGON_MAP[branch] || [branch]) wantedBranches.add(b.toLowerCase())
  }

  const jargonTable = getJargonTable()
  const allJargon: DictMilitaryJargon[] = []
  const seenTerms = new Set<string>()
  const pushJargon = (rows: DictMilitaryJargon[], limit: number) => {
    let count = 0
    for (const row of rows) {
      if (count >= limit) break
      if (!seenTerms.has(row.military_term)) {
        seenTerms.add(row.military_term)
        allJargon.push(row)
        count++
      }
    }
  }
  pushJargon(jargonTable.filter((r) => !r.branch), 10)
  for (const b of wantedBranches) {
    pushJargon(jargonTable.filter((r) => eq(r.branch, b)), 10)
  }
  const jargon = allJargon.slice(0, 20)

  // Bullet patterns with before/after examples
  const bulletPatterns = getBulletPatternTable()
    .filter((r) => r.example_military && r.example_output)
    .slice(0, 5)

  return { mos, allBranchRecords, crosswalk, jargon, bulletPatterns }
}

/**
 * Groups all MOS entries by branch for the index page.
 */
export async function getMOSByBranch(): Promise<MOSByBranch> {
  const grouped: MOSByBranch = {}
  for (const entry of await getAllMOSEntries()) {
    if (!grouped[entry.branch]) grouped[entry.branch] = []
    grouped[entry.branch].push(entry)
  }
  return grouped
}

/**
 * Returns all MOS entries as a flat list for the search component.
 * Deduplicated by military_code+branch (case-insensitive) so each code
 * appears once per branch. Cross-branch codes (e.g. "CS" in Navy vs Army)
 * are kept as separate entries.
 */
export async function getAllMOSEntries(): Promise<MOSIndexEntry[]> {
  const rows = [...getMosTable()].sort(
    (a, b) =>
      (a.branch ?? '').localeCompare(b.branch ?? '') ||
      a.military_code.localeCompare(b.military_code),
  )

  const seen = new Set<string>()
  const entries: MOSIndexEntry[] = []
  for (const row of rows) {
    const key = `${row.military_code.toLowerCase()}|${(row.branch || '').toLowerCase()}`
    if (seen.has(key)) continue
    seen.add(key)
    entries.push({
      military_code: row.military_code,
      military_title: row.military_title || row.military_code,
      branch: normalizeBranch(row.branch || 'Other'),
      civilian_titles: flattenSemicolonArray(row.civilian_titles || []),
      key_skills: flattenSemicolonArray(row.key_skills || []),
    })
  }
  return entries
}
