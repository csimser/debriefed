/**
 * Military constants and paygrade-to-rank mapping
 */

export const BRANCHES = [
  { value: 'U.S. Navy', label: 'U.S. Navy' },
  { value: 'U.S. Army', label: 'U.S. Army' },
  { value: 'U.S. Air Force', label: 'U.S. Air Force' },
  { value: 'U.S. Marine Corps', label: 'U.S. Marine Corps' },
  { value: 'U.S. Coast Guard', label: 'U.S. Coast Guard' },
  { value: 'U.S. Space Force', label: 'U.S. Space Force' },
] as const

export const PAYGRADES = [
  // Enlisted
  { value: 'E-1', label: 'E-1' },
  { value: 'E-2', label: 'E-2' },
  { value: 'E-3', label: 'E-3' },
  { value: 'E-4', label: 'E-4' },
  { value: 'E-5', label: 'E-5' },
  { value: 'E-6', label: 'E-6' },
  { value: 'E-7', label: 'E-7' },
  { value: 'E-8', label: 'E-8' },
  { value: 'E-9', label: 'E-9' },
  // Warrant Officers
  { value: 'W-1', label: 'W-1' },
  { value: 'W-2', label: 'W-2' },
  { value: 'W-3', label: 'W-3' },
  { value: 'W-4', label: 'W-4' },
  { value: 'W-5', label: 'W-5' },
  // Officers
  { value: 'O-1', label: 'O-1' },
  { value: 'O-2', label: 'O-2' },
  { value: 'O-3', label: 'O-3' },
  { value: 'O-4', label: 'O-4' },
  { value: 'O-5', label: 'O-5' },
  { value: 'O-6', label: 'O-6' },
  { value: 'O-7', label: 'O-7' },
  { value: 'O-8', label: 'O-8' },
  { value: 'O-9', label: 'O-9' },
  { value: 'O-10', label: 'O-10' },
] as const

/**
 * Paygrade to rank mapping by branch
 * Source: Official DoD pay grade tables
 */
export const PAYGRADE_TO_RANK: Record<string, Record<string, string>> = {
  'U.S. Navy': {
    // Enlisted
    'E-1': 'Seaman Recruit',
    'E-2': 'Seaman Apprentice',
    'E-3': 'Seaman',
    'E-4': 'Petty Officer Third Class',
    'E-5': 'Petty Officer Second Class',
    'E-6': 'Petty Officer First Class',
    'E-7': 'Chief Petty Officer',
    'E-8': 'Senior Chief Petty Officer',
    'E-9': 'Master Chief Petty Officer',
    // Warrant Officers
    'W-1': 'Warrant Officer 1',
    'W-2': 'Chief Warrant Officer 2',
    'W-3': 'Chief Warrant Officer 3',
    'W-4': 'Chief Warrant Officer 4',
    'W-5': 'Chief Warrant Officer 5',
    // Officers
    'O-1': 'Ensign',
    'O-2': 'Lieutenant Junior Grade',
    'O-3': 'Lieutenant',
    'O-4': 'Lieutenant Commander',
    'O-5': 'Commander',
    'O-6': 'Captain',
    'O-7': 'Rear Admiral Lower Half',
    'O-8': 'Rear Admiral Upper Half',
    'O-9': 'Vice Admiral',
    'O-10': 'Admiral',
  },
  'U.S. Army': {
    // Enlisted
    'E-1': 'Private',
    'E-2': 'Private Second Class',
    'E-3': 'Private First Class',
    'E-4': 'Specialist / Corporal',
    'E-5': 'Sergeant',
    'E-6': 'Staff Sergeant',
    'E-7': 'Sergeant First Class',
    'E-8': 'Master Sergeant / First Sergeant',
    'E-9': 'Sergeant Major / Command Sergeant Major',
    // Warrant Officers
    'W-1': 'Warrant Officer 1',
    'W-2': 'Chief Warrant Officer 2',
    'W-3': 'Chief Warrant Officer 3',
    'W-4': 'Chief Warrant Officer 4',
    'W-5': 'Chief Warrant Officer 5',
    // Officers
    'O-1': 'Second Lieutenant',
    'O-2': 'First Lieutenant',
    'O-3': 'Captain',
    'O-4': 'Major',
    'O-5': 'Lieutenant Colonel',
    'O-6': 'Colonel',
    'O-7': 'Brigadier General',
    'O-8': 'Major General',
    'O-9': 'Lieutenant General',
    'O-10': 'General',
  },
  'U.S. Air Force': {
    // Enlisted
    'E-1': 'Airman Basic',
    'E-2': 'Airman',
    'E-3': 'Airman First Class',
    'E-4': 'Senior Airman',
    'E-5': 'Staff Sergeant',
    'E-6': 'Technical Sergeant',
    'E-7': 'Master Sergeant',
    'E-8': 'Senior Master Sergeant',
    'E-9': 'Chief Master Sergeant',
    // No Warrant Officers in Air Force
    'W-1': 'N/A',
    'W-2': 'N/A',
    'W-3': 'N/A',
    'W-4': 'N/A',
    'W-5': 'N/A',
    // Officers
    'O-1': 'Second Lieutenant',
    'O-2': 'First Lieutenant',
    'O-3': 'Captain',
    'O-4': 'Major',
    'O-5': 'Lieutenant Colonel',
    'O-6': 'Colonel',
    'O-7': 'Brigadier General',
    'O-8': 'Major General',
    'O-9': 'Lieutenant General',
    'O-10': 'General',
  },
  'U.S. Marine Corps': {
    // Enlisted
    'E-1': 'Private',
    'E-2': 'Private First Class',
    'E-3': 'Lance Corporal',
    'E-4': 'Corporal',
    'E-5': 'Sergeant',
    'E-6': 'Staff Sergeant',
    'E-7': 'Gunnery Sergeant',
    'E-8': 'Master Sergeant / First Sergeant',
    'E-9': 'Master Gunnery Sergeant / Sergeant Major',
    // Warrant Officers
    'W-1': 'Warrant Officer 1',
    'W-2': 'Chief Warrant Officer 2',
    'W-3': 'Chief Warrant Officer 3',
    'W-4': 'Chief Warrant Officer 4',
    'W-5': 'Chief Warrant Officer 5',
    // Officers
    'O-1': 'Second Lieutenant',
    'O-2': 'First Lieutenant',
    'O-3': 'Captain',
    'O-4': 'Major',
    'O-5': 'Lieutenant Colonel',
    'O-6': 'Colonel',
    'O-7': 'Brigadier General',
    'O-8': 'Major General',
    'O-9': 'Lieutenant General',
    'O-10': 'General',
  },
  'U.S. Coast Guard': {
    // Enlisted
    'E-1': 'Seaman Recruit',
    'E-2': 'Seaman Apprentice',
    'E-3': 'Seaman',
    'E-4': 'Petty Officer Third Class',
    'E-5': 'Petty Officer Second Class',
    'E-6': 'Petty Officer First Class',
    'E-7': 'Chief Petty Officer',
    'E-8': 'Senior Chief Petty Officer',
    'E-9': 'Master Chief Petty Officer',
    // Warrant Officers
    'W-1': 'Warrant Officer 1',
    'W-2': 'Chief Warrant Officer 2',
    'W-3': 'Chief Warrant Officer 3',
    'W-4': 'Chief Warrant Officer 4',
    'W-5': 'N/A',
    // Officers
    'O-1': 'Ensign',
    'O-2': 'Lieutenant Junior Grade',
    'O-3': 'Lieutenant',
    'O-4': 'Lieutenant Commander',
    'O-5': 'Commander',
    'O-6': 'Captain',
    'O-7': 'Rear Admiral Lower Half',
    'O-8': 'Rear Admiral Upper Half',
    'O-9': 'Vice Admiral',
    'O-10': 'Admiral',
  },
  'U.S. Space Force': {
    // Enlisted (Space Force uses Guardian ranks)
    'E-1': 'Specialist 1',
    'E-2': 'Specialist 2',
    'E-3': 'Specialist 3',
    'E-4': 'Specialist 4',
    'E-5': 'Sergeant',
    'E-6': 'Technical Sergeant',
    'E-7': 'Master Sergeant',
    'E-8': 'Senior Master Sergeant',
    'E-9': 'Chief Master Sergeant',
    // No Warrant Officers in Space Force
    'W-1': 'N/A',
    'W-2': 'N/A',
    'W-3': 'N/A',
    'W-4': 'N/A',
    'W-5': 'N/A',
    // Officers
    'O-1': 'Second Lieutenant',
    'O-2': 'First Lieutenant',
    'O-3': 'Captain',
    'O-4': 'Major',
    'O-5': 'Lieutenant Colonel',
    'O-6': 'Colonel',
    'O-7': 'Brigadier General',
    'O-8': 'Major General',
    'O-9': 'Lieutenant General',
    'O-10': 'General',
  },
}

/**
 * Get the rank title for a given branch and paygrade
 */
export function getRankFromPaygrade(branch: string, paygrade: string): string {
  if (!branch || !paygrade) return ''

  const branchRanks = PAYGRADE_TO_RANK[branch]
  if (!branchRanks) return ''

  const rank = branchRanks[paygrade]
  if (!rank || rank === 'N/A') return ''

  return rank
}

/**
 * Get available paygrades for a branch (excludes N/A ranks)
 */
export function getValidPaygradesForBranch(branch: string): typeof PAYGRADES[number][] {
  if (!branch) return [...PAYGRADES]

  const branchRanks = PAYGRADE_TO_RANK[branch]
  if (!branchRanks) return [...PAYGRADES]

  return PAYGRADES.filter(pg => {
    const rank = branchRanks[pg.value]
    return rank && rank !== 'N/A'
  })
}

/**
 * Check if a paygrade is valid for a given branch
 */
export function isPaygradeValidForBranch(branch: string, paygrade: string): boolean {
  if (!branch || !paygrade) return true

  const branchRanks = PAYGRADE_TO_RANK[branch]
  if (!branchRanks) return true

  const rank = branchRanks[paygrade]
  return Boolean(rank && rank !== 'N/A')
}

export type Branch = typeof BRANCHES[number]['value']
export type Paygrade = typeof PAYGRADES[number]['value']
