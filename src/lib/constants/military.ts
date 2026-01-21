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
  'E-1', 'E-2', 'E-3', 'E-4', 'E-5', 'E-6', 'E-7', 'E-8', 'E-9',
  // Warrant Officers
  'W-1', 'W-2', 'W-3', 'W-4', 'W-5',
  // Officers
  'O-1', 'O-2', 'O-3', 'O-4', 'O-5', 'O-6', 'O-7', 'O-8', 'O-9', 'O-10',
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
export function getValidPaygradesForBranch(branch: string): string[] {
  if (!branch) return PAYGRADES as unknown as string[]

  const branchRanks = PAYGRADE_TO_RANK[branch]
  if (!branchRanks) return PAYGRADES as unknown as string[]

  return PAYGRADES.filter(pg => {
    const rank = branchRanks[pg]
    return rank && rank !== 'N/A'
  }) as unknown as string[]
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
export type Paygrade = typeof PAYGRADES[number]
