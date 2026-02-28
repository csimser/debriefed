/**
 * MOS SEO Page Data Layer
 *
 * Build-time data fetching for /mos/[code] and /mos index pages.
 * Uses Supabase SERVICE ROLE client to bypass RLS.
 */

import { createAdminClient } from '@/lib/supabase/admin'
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
 * Also handles already-split arrays: ["A","B","C"] → ["A","B","C"]
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
// Data fetching functions
// ============================================================================

/**
 * Returns deduplicated MOS codes for generateStaticParams — lowercase, unique codes.
 */
export async function getAllMOSCodes(): Promise<MOSCodeEntry[]> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('dict_mos_to_civilian')
    .select('military_code, branch')
    .order('branch')
    .order('military_code')

  if (error) {
    console.error('[mos-page-data] getAllMOSCodes error:', error.message)
    return []
  }

  // Deduplicate by lowercase code (some codes exist in multiple branches)
  const seen = new Set<string>()
  const result: MOSCodeEntry[] = []

  for (const row of data || []) {
    const lc = row.military_code.toLowerCase()
    if (!seen.has(lc)) {
      seen.add(lc)
      result.push({ code: lc, branch: row.branch })
    }
  }

  return result
}

/**
 * Fetches full page data for one MOS code.
 * Fetches ALL branch records for the code and merges data.
 */
export async function getMOSPageData(code: string): Promise<MOSPageData | null> {
  const supabase = createAdminClient()

  // Fetch ALL records for this code (may span multiple branches)
  const { data: mosRows, error: mosError } = await supabase
    .from('dict_mos_to_civilian')
    .select('*')
    .ilike('military_code', code)

  if (mosError || !mosRows?.length) {
    console.error('[mos-page-data] getMOSPageData MOS not found:', code, mosError?.message)
    return null
  }

  const allBranchRecords = mosRows as DictMosToCivilian[]
  const mos = allBranchRecords[0]

  // Collect all unique branches for jargon lookups
  const branches = [...new Set(allBranchRecords.map((r) => r.branch))]

  // Fetch O*NET crosswalk data for this MOS code
  const { data: crosswalkData } = await supabase
    .from('dict_onet_crosswalk')
    .select('*')
    .ilike('moc', mos.military_code)
    .limit(20)

  // Fetch branch-relevant jargon terms for ALL branches of this code
  const jargonQueries: Promise<{ data: DictMilitaryJargon[] | null }>[] = []
  for (const branch of branches) {
    const terms = BRANCH_JARGON_MAP[branch] || [branch]
    for (const b of terms) {
      jargonQueries.push(
        supabase
          .from('dict_military_jargon')
          .select('*')
          .ilike('branch', b)
          .limit(10) as Promise<{ data: DictMilitaryJargon[] | null }>
      )
    }
  }

  // Also fetch general/null-branch jargon
  const generalJargonQuery = supabase
    .from('dict_military_jargon')
    .select('*')
    .is('branch', null)
    .limit(10)

  const [generalResult, ...branchResults] = await Promise.all([
    generalJargonQuery,
    ...jargonQueries,
  ])

  const allJargon: DictMilitaryJargon[] = []
  const seenTerms = new Set<string>()

  for (const result of [generalResult, ...branchResults]) {
    for (const row of result.data || []) {
      if (!seenTerms.has(row.military_term)) {
        seenTerms.add(row.military_term)
        allJargon.push(row as DictMilitaryJargon)
      }
    }
  }

  // Limit to 20 jargon terms
  const jargon = allJargon.slice(0, 20)

  // Fetch bullet patterns (before/after examples)
  const { data: bulletData } = await supabase
    .from('dict_bullet_patterns')
    .select('*')
    .not('example_military', 'is', null)
    .not('example_output', 'is', null)
    .limit(5)

  return {
    mos,
    allBranchRecords,
    crosswalk: (crosswalkData || []) as DictOnetCrosswalk[],
    jargon,
    bulletPatterns: (bulletData || []) as DictBulletPattern[],
  }
}

/**
 * Groups all MOS entries by branch for the index page.
 */
export async function getMOSByBranch(): Promise<MOSByBranch> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('dict_mos_to_civilian')
    .select('military_code, military_title, branch, civilian_titles, key_skills')
    .order('branch')
    .order('military_code')

  if (error) {
    console.error('[mos-page-data] getMOSByBranch error:', error.message)
    return {}
  }

  const grouped: MOSByBranch = {}
  const seen = new Set<string>()

  for (const row of data || []) {
    const key = `${row.military_code.toLowerCase()}|${(row.branch || '').toLowerCase()}`
    if (seen.has(key)) continue
    seen.add(key)

    const branch = normalizeBranch(row.branch || 'Other')
    if (!grouped[branch]) {
      grouped[branch] = []
    }
    grouped[branch].push({
      military_code: row.military_code,
      military_title: row.military_title || row.military_code,
      branch,
      civilian_titles: flattenSemicolonArray(row.civilian_titles || []),
      key_skills: flattenSemicolonArray(row.key_skills || []),
    })
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
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('dict_mos_to_civilian')
    .select('military_code, military_title, branch, civilian_titles, key_skills')
    .order('branch')
    .order('military_code')

  if (error) {
    console.error('[mos-page-data] getAllMOSEntries error:', error.message)
    return []
  }

  // Deduplicate: keep first row per code+branch (case-insensitive)
  const seen = new Set<string>()
  const entries: MOSIndexEntry[] = []

  for (const row of data || []) {
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
