import navyCrosswalk from './navy-rating-crosswalk.json'
import armyCrosswalk from './army-mos-crosswalk.json'
import airforceCrosswalk from './airforce-afsc-crosswalk.json'
import marinesCrosswalk from './marines-mos-crosswalk.json'
import coastguardCrosswalk from './coastguard-rating-crosswalk.json'
import spaceforceCrosswalk from './spaceforce-specialty-crosswalk.json'

interface CrosswalkEntry {
  title: string
  onet_codes: string[]
  civilian_titles: string[]
  industries: string[]
}

type CrosswalkMap = Record<string, CrosswalkEntry>

const navyRatings = navyCrosswalk.ratings as CrosswalkMap
const armyMos = armyCrosswalk.mos as CrosswalkMap
const airforceAfsc = airforceCrosswalk.afsc as CrosswalkMap
const marinesMos = marinesCrosswalk.mos as CrosswalkMap
const cgRatings = coastguardCrosswalk.ratings as CrosswalkMap
const sfCodes = spaceforceCrosswalk.specialty_codes as CrosswalkMap

export function detectBranch(code: string): string {
  const normalized = code.toUpperCase().trim()

  // Air Force/Space Force AFSC: digit + letter + digits + optional X + digit
  if (/^\d[A-Z]\d+X?\d*$/.test(normalized)) {
    return 'air_force_or_space_force'
  }

  // Army MOS: 2 digits + letter + optional digit
  if (/^\d{2}[A-Z]\d?$/.test(normalized)) {
    return 'army'
  }

  // Marines MOS: 4 digits
  if (/^\d{4}$/.test(normalized)) {
    return 'marines'
  }

  // Navy/Coast Guard: 2-4 letters
  if (/^[A-Z]{2,4}$/.test(normalized)) {
    return 'navy_or_coastguard'
  }

  return 'unknown'
}

export function getCivilianJobs(code: string, branch?: string): CrosswalkEntry | null {
  const normalized = code.toUpperCase().trim()

  // If branch provided, check that crosswalk directly
  if (branch) {
    const branchLower = branch.toLowerCase()
    if (branchLower.includes('navy')) return navyRatings[normalized] || null
    if (branchLower.includes('army')) return armyMos[normalized] || null
    if (branchLower.includes('air force')) return airforceAfsc[normalized] || null
    if (branchLower.includes('marine')) return marinesMos[normalized] || null
    if (branchLower.includes('coast guard')) return cgRatings[normalized] || null
    if (branchLower.includes('space')) return sfCodes[normalized] || null
  }

  // Auto-detect and check all matching crosswalks
  const detected = detectBranch(normalized)

  if (detected === 'army') return armyMos[normalized] || null
  if (detected === 'marines') return marinesMos[normalized] || null
  if (detected === 'air_force_or_space_force') return airforceAfsc[normalized] || sfCodes[normalized] || null
  if (detected === 'navy_or_coastguard') return navyRatings[normalized] || cgRatings[normalized] || null

  return null
}
