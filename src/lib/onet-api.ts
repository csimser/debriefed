/**
 * O*NET API v2 Helper Functions (Veterans API)
 * Documentation: https://api-v2.onetcenter.org/
 * Auth: X-API-Key header
 */

const ONET_BASE_URL = 'https://api-v2.onetcenter.org'

// In-memory cache for API responses (simple TTL cache)
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 1000 * 60 * 60 // 1 hour

function getCachedData(key: string): any | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  cache.delete(key)
  return null
}

function setCachedData(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() })
}

// Get API Key from environment
function getApiKey(): string | null {
  const apiKey = process.env.ONET_API_KEY
  if (!apiKey) {
    console.warn('O*NET API key not configured (ONET_API_KEY)')
    return null
  }
  return apiKey
}

// Generic fetch wrapper with API key auth and error handling
async function onetFetch<T>(endpoint: string): Promise<T | null> {
  const apiKey = getApiKey()
  if (!apiKey) return null

  try {
    const response = await fetch(`${ONET_BASE_URL}${endpoint}`, {
      headers: {
        'X-API-Key': apiKey,
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      console.error(`O*NET API error: ${response.status} for ${endpoint}`)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('O*NET API fetch error:', error)
    return null
  }
}

// Branch name mapping for API
export type MilitaryBranch = 'navy' | 'army' | 'air_force' | 'marine_corps' | 'coast_guard' | 'space_force'

// Map display names to API values
export const BRANCH_TO_API: Record<string, MilitaryBranch> = {
  // Lowercase versions
  'navy': 'navy',
  'army': 'army',
  'air_force': 'air_force',
  'airforce': 'air_force',
  'air force': 'air_force',
  'marines': 'marine_corps',
  'marine_corps': 'marine_corps',
  'marine corps': 'marine_corps',
  'coast_guard': 'coast_guard',
  'coastguard': 'coast_guard',
  'coast guard': 'coast_guard',
  'space_force': 'space_force',
  'spaceforce': 'space_force',
  'space force': 'space_force',
  // Full "U.S." format (from standardized BRANCHES constant)
  'U.S. Navy': 'navy',
  'U.S. Army': 'army',
  'U.S. Air Force': 'air_force',
  'U.S. Marine Corps': 'marine_corps',
  'U.S. Coast Guard': 'coast_guard',
  'U.S. Space Force': 'space_force',
}

// Types
export interface MilitaryCrosswalkResult {
  code: string
  title: string
  description?: string
  href?: string
}

export interface MilitaryCrosswalkResponse {
  careers?: MilitaryCrosswalkResult[]
  results?: MilitaryCrosswalkResult[]
}

export interface SearchResult {
  code: string
  title: string
  description?: string
  relevance_score?: number
}

export interface SearchResponse {
  careers?: SearchResult[]
  results?: SearchResult[]
}

export interface OccupationSkill {
  id: string
  name: string
  description?: string
}

/**
 * Get civilian career crosswalk for a military code (MOS/Rate/AFSC)
 * @param militaryCode - Military occupation code (e.g., "DC", "IT", "11B")
 * @param branch - Military branch (navy, army, air_force, marine_corps, coast_guard, space_force)
 * @returns Array of matching civilian careers
 */
export async function getMilitaryCrosswalk(
  militaryCode: string,
  branch?: string
): Promise<MilitaryCrosswalkResult[]> {
  if (!militaryCode) return []

  // Normalize branch name
  const normalizedBranch = branch ? BRANCH_TO_API[branch.toLowerCase().replace(/\s+/g, '_')] : 'navy'
  const code = militaryCode.toUpperCase().trim()

  const cacheKey = `crosswalk:${code}:${normalizedBranch}`
  const cached = getCachedData(cacheKey)
  if (cached) return cached

  const endpoint = `/veterans/military?code=${encodeURIComponent(code)}&branch=${normalizedBranch}`
  const data = await onetFetch<MilitaryCrosswalkResponse>(endpoint)

  // Handle both possible response formats
  const results = data?.careers || data?.results || []
  if (Array.isArray(results) && results.length > 0) {
    setCachedData(cacheKey, results)
    return results
  }

  return []
}

/**
 * Search for careers by keyword
 * @param keyword - Search term
 * @param limit - Maximum results (default 10)
 * @returns Array of matching careers
 */
export async function searchCareers(keyword: string, limit: number = 10): Promise<SearchResult[]> {
  if (!keyword || keyword.length < 2) return []

  const cacheKey = `search:${keyword.toLowerCase()}`
  const cached = getCachedData(cacheKey)
  if (cached) return cached.slice(0, limit)

  const endpoint = `/veterans/search?keyword=${encodeURIComponent(keyword)}`
  const data = await onetFetch<SearchResponse>(endpoint)

  // Handle both possible response formats
  const results = data?.careers || data?.results || []
  if (Array.isArray(results)) {
    setCachedData(cacheKey, results)
    return results.slice(0, limit)
  }

  return []
}

// Legacy alias for backwards compatibility
export const searchOccupations = searchCareers

/**
 * Get O*NET context for a military role - for enhancing AI prompts
 * @param militaryCode - Military occupation code
 * @param branch - Military branch
 * @returns Object with civilian titles and related info
 */
export async function getOccupationContext(
  militaryCode: string,
  branch?: string
): Promise<{
  civilianTitles: string[]
  skills: string[]
  tasks: string[]
} | null> {
  try {
    const crosswalk = await getMilitaryCrosswalk(militaryCode, branch)

    if (!crosswalk || crosswalk.length === 0) {
      return null
    }

    // Get titles from top matches
    const civilianTitles = crosswalk.slice(0, 5).map(c => c.title)

    return {
      civilianTitles,
      skills: [], // Skills endpoint not available in v2 veterans API
      tasks: [],  // Tasks endpoint not available in v2 veterans API
    }
  } catch (error) {
    console.error('Error getting occupation context:', error)
    return null
  }
}

/**
 * Check if O*NET API is configured and responding
 * @returns Status object with health information
 */
export async function checkOnetHealth(): Promise<{
  configured: boolean
  healthy: boolean
  latency?: number
  error?: string
}> {
  const apiKey = getApiKey()
  if (!apiKey) {
    return { configured: false, healthy: false, error: 'API key not configured (ONET_API_KEY)' }
  }

  try {
    const start = Date.now()
    const response = await fetch(`${ONET_BASE_URL}/veterans/search?keyword=manager`, {
      headers: {
        'X-API-Key': apiKey,
        'Accept': 'application/json',
      },
    })
    const latency = Date.now() - start

    if (response.ok) {
      return {
        configured: true,
        healthy: true,
        latency,
      }
    }

    // Handle specific error codes
    if (response.status === 401 || response.status === 403) {
      return {
        configured: true,
        healthy: false,
        latency,
        error: 'Invalid API key',
      }
    }

    return {
      configured: true,
      healthy: false,
      latency,
      error: `HTTP ${response.status}`,
    }
  } catch (error) {
    return {
      configured: true,
      healthy: false,
      error: error instanceof Error ? error.message : 'Network error',
    }
  }
}

// Legacy exports for backwards compatibility (these now use the v2 API)
export async function getOccupationDetails(onetCode: string): Promise<any | null> {
  // v2 veterans API doesn't have detailed occupation endpoint
  // Search for the occupation instead
  if (!onetCode) return null
  const results = await searchCareers(onetCode, 1)
  return results[0] || null
}

export async function getOccupationSkills(onetCode: string): Promise<OccupationSkill[]> {
  // v2 veterans API doesn't have skills endpoint
  return []
}

export async function getOccupationTasks(onetCode: string): Promise<string[]> {
  // v2 veterans API doesn't have tasks endpoint
  return []
}
