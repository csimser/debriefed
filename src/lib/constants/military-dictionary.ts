/**
 * Military to Civilian Translation Dictionary
 * Used for translating military jargon in eval bullets to civilian-friendly language
 */

export const MILITARY_TO_CIVILIAN: Record<string, string> = {
  // Ranks & Personnel
  "sailor": "team member",
  "airman": "team member",
  "soldier": "team member",
  "marine": "team member",
  "seaman": "junior team member",
  "petty officer": "supervisor",
  "chief": "senior supervisor",
  "senior chief": "department supervisor",
  "master chief": "senior department manager",
  "ensign": "junior manager",
  "lieutenant": "manager",
  "commander": "director",
  "captain": "senior director",
  "admiral": "executive",
  "nco": "supervisor",
  "snco": "senior supervisor",
  "enlisted": "staff",
  "officer": "manager",
  "shipmate": "colleague",
  "troop": "team member",
  "subordinate": "direct report",
  "sailors": "team members",
  "airmen": "team members",
  "soldiers": "team members",
  "marines": "team members",
  "shipmates": "colleagues",
  "troops": "team members",
  "subordinates": "direct reports",

  // Organizations
  "command": "organization",
  "squadron": "department",
  "division": "team",
  "platoon": "team",
  "battalion": "division",
  "regiment": "business unit",
  "fleet": "enterprise",
  "wing": "division",
  "detachment": "team",
  "unit": "department",
  "section": "team",
  "branch": "department",
  "workcenter": "work group",
  "work center": "work group",

  // Leadership Titles
  "co": "director",
  "commanding officer": "director",
  "xo": "deputy director",
  "executive officer": "deputy director",
  "cmc": "senior advisor",
  "command master chief": "senior operations advisor",
  "lcpo": "department head",
  "leading chief petty officer": "department head",
  "lpo": "team lead",
  "leading petty officer": "team lead",
  "ncoic": "supervisor",
  "oic": "manager",
  "department head": "department director",
  "dcpo": "deputy department head",
  "divo": "division manager",

  // Operations
  "underway": "operational period",
  "deployment": "extended field assignment",
  "watch": "shift",
  "watch station": "duty position",
  "standing watch": "providing operational coverage",
  "port call": "site visit",
  "liberty": "time off",
  "shore duty": "headquarters assignment",
  "sea duty": "field operations",
  "tad": "temporary assignment",
  "tdy": "temporary duty assignment",
  "pcs": "permanent relocation",
  "conus": "domestic",
  "oconus": "international",
  "theater": "region",
  "aor": "area of responsibility",
  "ao": "operating area",

  // Locations & Facilities
  "ship": "facility",
  "vessel": "facility",
  "boat": "facility",
  "base": "facility",
  "installation": "facility",
  "quarterdeck": "main reception",
  "bridge": "operations center",
  "cic": "operations center",
  "combat information center": "operations center",
  "engineering": "operations",
  "deck": "operations floor",
  "berthing": "housing",
  "galley": "cafeteria",
  "mess decks": "dining facility",
  "head": "restroom",
  "passageway": "hallway",
  "hatch": "door",
  "bulkhead": "wall",
  "overhead": "ceiling",
  "ladder": "stairs",

  // Inspections & Compliance
  "insurv": "federal regulatory inspection",
  "inspection": "compliance audit",
  "oppe": "operational readiness assessment",
  "orse": "operational certification",
  "atg": "training and assessment team",
  "ig": "inspector general audit",
  "audit": "compliance review",
  "discrepancy": "deficiency",
  "finding": "issue",
  "hit": "deficiency",
  "gig": "violation",

  // Training & Quals
  "pqs": "qualification program",
  "quals": "certifications",
  "qualifications": "certifications",
  "warfare pin": "professional certification",
  "esws": "warfare certification",
  "eaws": "warfare certification",
  "swo": "surface warfare qualification",
  "fmf": "expeditionary qualification",
  "nec": "specialty code",
  "mos": "occupational specialty",
  "afsc": "specialty code",
  "rate": "job specialty",
  "rating": "occupational field",
  "a-school": "technical training",
  "c-school": "advanced training",
  "gmt": "mandatory training",
  "pme": "professional development",
  "epme": "leadership development",

  // Maintenance & Equipment
  "3m": "preventive maintenance program",
  "pms": "preventive maintenance",
  "csmp": "maintenance backlog",
  "2-kilo": "critical repair",
  "depot-level": "major overhaul",
  "organizational maintenance": "routine maintenance",
  "gear": "equipment",
  "casrep": "equipment casualty report",
  "deadline": "equipment out of service",

  // Admin & Paperwork
  "eval": "performance review",
  "fitrep": "performance evaluation",
  "ncoer": "performance evaluation",
  "oer": "performance evaluation",
  "epr": "performance evaluation",
  "counseling chit": "performance documentation",
  "page 13": "personnel record entry",
  "service record": "personnel file",
  "navpers": "personnel document",
  "ompf": "official personnel file",
  "les": "pay statement",
  "award": "recognition",
  "nam": "achievement award",
  "navy achievement medal": "organizational achievement award",
  "com": "commendation award",
  "msm": "meritorious service award",
  "loa": "letter of appreciation",
  "loc": "letter of commendation",
  "njp": "disciplinary action",
  "mast": "disciplinary hearing",
  "ucmj": "military code of conduct",

  // Readiness & Metrics
  "readiness": "operational capability",
  "mission capable": "fully operational",
  "fmc": "fully mission capable",
  "pmc": "partially operational",
  "nmc": "non-operational",
  "sortie": "mission",
  "evolution": "operation",
  "drill": "training exercise",
  "gq": "emergency response drill",
  "general quarters": "emergency response",
  "battle stations": "emergency stations",
  "man overboard": "personnel emergency",
  "dc": "damage control",
  "damage control": "emergency response",

  // Communications
  "brief": "present",
  "briefed": "presented",
  "debrief": "review session",
  "sitrep": "status report",
  "pass down": "shift handover",
  "turnover": "transition documentation",
  "message traffic": "communications",
  "comms": "communications",

  // Misc Military Speak
  "deckplate": "frontline",
  "deckplate leadership": "hands-on leadership",
  "squared away": "organized",
  "outstanding": "excellent",
  "shipshape": "well-organized",
  "belay": "cancel",
  "secure": "complete",
  "carry on": "continue",
  "roger": "acknowledged",
  "copy": "understood",
  "negative": "no",
  "affirmative": "yes",
  "stand by": "wait",
  "as you were": "disregard",
  "zero defects": "100% compliance",
  "flawless": "error-free",
  "top notch": "excellent",
  "above and beyond": "exceptional effort",
  "selfless": "team-focused",
  "esprit de corps": "team morale",
  "mission first": "results-oriented",
  "can-do attitude": "proactive approach",
  "cpo mess": "senior leadership team",
  "mess": "leadership team",
  "billet": "position",
  "afloat": "field operations",

  // Navy-specific
  "comptuex": "multi-unit training exercise",
  "cmdcm": "senior enlisted advisor",
  "dlcpo": "division senior supervisor",
  "3mc": "maintenance management coordinator",
  "drb": "disciplinary review board",
  "sme": "subject matter expert",
  "tycom": "fleet regional command",
  "csg": "carrier strike group",
  "soy": "employee of the year",
  "soq": "employee of the quarter",
  "mwr": "employee wellness and recreation program",
  "frontline leader": "hands-on supervisor",
  "deck plate": "frontline",
  "pt": "physical training",
  "prt": "physical readiness test",
  "wardroom": "management team",
  "watch section": "shift team",
  "duty section": "on-call team",

  // Common terms
  "leave": "paid time off",
  "muster": "roll call",
  "jag": "legal department",
  "opsec": "operational security",
  "orm": "operational risk management",
  "contingency": "emergency response",
  "personnel": "staff",
  "overseas": "international location",
  "joint duty": "inter-agency assignment",
  "tour of duty": "assignment period",
  "embarked": "deployed",
  "taps": "transition assistance program",
  "counseled": "provided performance guidance",
  "passdown": "shift handover",
  "sick bay": "medical clinic",
}

/** Extract just the first option from slash-separated alternatives */
function firstOption(civilian: string): string {
  return civilian.split(' / ')[0].trim()
}

/** Match the case pattern of the original text */
function matchCase(original: string, replacement: string): string {
  if (!original || !replacement) return replacement
  if (original === original.toUpperCase() && original.length > 1) {
    return replacement.toUpperCase()
  }
  if (original[0] === original[0].toUpperCase() && original.slice(1) !== original.slice(1).toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1)
  }
  if (original === original.toLowerCase()) {
    return replacement.toLowerCase()
  }
  return replacement
}

/** Post-process translated text for natural readability */
function postProcessTranslation(text: string): string {
  let out = text
  out = out.replace(/  +/g, ' ')
  out = out.replace(/\ba (a|e|i|o|u)/gi, (match, vowel) => {
    const aWord = match[0] === 'A' ? 'An' : 'an'
    return `${aWord} ${vowel}`
  })
  out = out.replace(/\ban ([bcdfghjklmnpqrstvwxyz])/gi, (match, consonant) => {
    const aWord = match[0] === 'A' ? 'A' : 'a'
    return `${aWord} ${consonant}`
  })
  out = out.replace(/ 's\b/g, "'s")
  out = out.replace(/,\s*,/g, ',')
  out = out.replace(/\.\s*\./g, '.')
  out = out.replace(/\s+([.,;:!?])/g, '$1')
  return out.trim()
}

/**
 * Translates military jargon to civilian language
 * Returns the translated text and any unflagged military terms
 */
export function translateMilitaryToCivilian(text: string): {
  translated: string
  unflaggedTerms: string[]
} {
  let translated = text
  const unflaggedTerms: string[] = []

  // Sort by length descending to replace longer phrases first
  const sortedTerms = Object.keys(MILITARY_TO_CIVILIAN).sort((a, b) => b.length - a.length)

  for (const militaryTerm of sortedTerms) {
    const civilianTerm = firstOption(MILITARY_TO_CIVILIAN[militaryTerm])
    const regex = new RegExp(`\\b${escapeRegex(militaryTerm)}\\b`, 'gi')
    translated = translated.replace(regex, (match) => matchCase(match, civilianTerm))
  }

  // Post-process for natural readability
  translated = postProcessTranslation(translated)

  // Check for common military patterns that might not be in dictionary
  const possibleMilitaryPatterns = [
    /\b[A-Z]{2,5}\b/g,  // Acronyms like "COMNAVAIRFOR"
    /\bUSS\s+\w+/gi,    // Ship names
    /\bCVN-?\d+/gi,     // Carrier designations
    /\bDDG-?\d+/gi,     // Destroyer designations
    /\bE-[1-9]\b/gi,    // Enlisted ranks
    /\bO-[1-9]\b/gi,    // Officer ranks
    /\bW-[1-5]\b/gi,    // Warrant officer ranks
  ]

  const commonCivilianAcronyms = new Set(['CEO', 'CFO', 'CTO', 'COO', 'HR', 'IT', 'USA', 'PM', 'QA', 'ROI', 'KPI', 'SLA', 'API', 'SQL', 'PDF'])

  for (const pattern of possibleMilitaryPatterns) {
    const matches = translated.match(pattern)
    if (matches) {
      for (const match of matches) {
        if (!commonCivilianAcronyms.has(match.toUpperCase()) && !unflaggedTerms.includes(match)) {
          unflaggedTerms.push(match)
        }
      }
    }
  }

  return { translated, unflaggedTerms }
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Cleans OCR garbage and formatting issues from eval text
 */
export function cleanEvalText(text: string): string {
  let cleaned = text

  // Remove excessive asterisks
  cleaned = cleaned.replace(/\*{2,}/g, '')
  cleaned = cleaned.replace(/^\*+|\*+$/gm, '')

  // Remove page numbers, headers, footers
  cleaned = cleaned.replace(/^(page\s*\d+|p\.\s*\d+|\d+\s*of\s*\d+)$/gim, '')

  // Remove ranking statements
  cleaned = cleaned.replace(/\b(ranked?\s*#?\d+\s*(of|out of)\s*\d+|top\s*\d+%|#\d+\s*(of|out of)\s*\d+)\b/gi, '')

  // Remove signature blocks and routing info
  cleaned = cleaned.replace(/^(signature|signed|approved|reviewed|routing|date|via|from|to):.*$/gim, '')

  // Remove form labels
  cleaned = cleaned.replace(/^(block\s*\d+[a-z]?|section\s*[ivx]+|part\s*[a-z])\b.*$/gim, '')

  // Remove lines under 30 characters (likely garbage)
  cleaned = cleaned.split('\n')
    .filter(line => line.trim().length >= 30 || /\d/.test(line)) // Keep short lines with numbers
    .join('\n')

  // Clean up multiple spaces and newlines
  cleaned = cleaned.replace(/\s{2,}/g, ' ')
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n')

  return cleaned.trim()
}
