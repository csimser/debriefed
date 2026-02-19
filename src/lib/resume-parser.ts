/**
 * Client-side resume parser — regex + pattern matching extraction.
 * No AI calls. Free and instant.
 */

// ─── Section Splitting ───────────────────────────────────────────────

const SECTION_HEADERS: Record<string, RegExp> = {
  summary: /^(?:professional\s+)?(?:summary|objective|profile|about)\b/i,
  experience: /^(?:work\s+)?(?:experience|employment|work\s+history|professional\s+experience|career\s+history|relevant\s+experience)\b/i,
  education_and_certs: /^education\s*(?:[|&/,]|and)\s*certifications?\b/i,
  education: /^(?:education|academic|degrees?|training)\b/i,
  skills: /^(?:skills|technical\s+skills|core\s+competencies|competencies|areas?\s+of\s+expertise|proficiencies|qualifications)\b/i,
  certifications: /^(?:certifications?|licenses?\s*(?:&|and)?\s*certifications?|professional\s+certifications?|credentials)\b/i,
  military: /^(?:military\s+(?:service|experience|background|history))\b/i,
}

export interface ParsedSections {
  summary: string
  experience: string
  education: string
  education_and_certs: string
  skills: string
  certifications: string
  military: string
  other: string
}

export function splitSections(text: string): ParsedSections {
  const lines = text.split('\n')
  const sections: ParsedSections = {
    summary: '',
    experience: '',
    education: '',
    education_and_certs: '',
    skills: '',
    certifications: '',
    military: '',
    other: '',
  }

  let currentSection: keyof ParsedSections = 'other'
  const sectionLines: Record<keyof ParsedSections, string[]> = {
    summary: [],
    experience: [],
    education: [],
    education_and_certs: [],
    skills: [],
    certifications: [],
    military: [],
    other: [],
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      sectionLines[currentSection].push('')
      continue
    }

    // Check if this line is a section header
    let isHeader = false
    for (const [sectionName, pattern] of Object.entries(SECTION_HEADERS)) {
      if (pattern.test(trimmed) && trimmed.length < 60) {
        currentSection = sectionName as keyof ParsedSections
        isHeader = true
        break
      }
    }

    if (!isHeader) {
      sectionLines[currentSection].push(line)
    }
  }

  for (const key of Object.keys(sections) as (keyof ParsedSections)[]) {
    sections[key] = sectionLines[key].join('\n').trim()
  }

  return sections
}

// ─── Contact Info ────────────────────────────────────────────────────

export interface ParsedContact {
  email: string | null
  phone: string | null
  linkedin: string | null
  city: string | null
  state: string | null
}

export function extractContact(text: string): ParsedContact {
  // Take first ~500 chars (contact is always at top)
  const header = text.substring(0, 500)

  // Email
  const emailMatch = header.match(/[\w.+-]+@[\w-]+\.[\w.]+/i)

  // Phone — various formats
  const phoneMatch = header.match(
    /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
  )

  // LinkedIn URL
  const linkedinMatch = text.match(
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+\/?/i
  )

  // City, State — look for "City, ST" pattern
  const locationMatch = header.match(
    /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),\s*([A-Z]{2})\b/
  )

  return {
    email: emailMatch?.[0] || null,
    phone: phoneMatch?.[0] || null,
    linkedin: linkedinMatch?.[0] || null,
    city: locationMatch?.[1] || null,
    state: locationMatch?.[2] || null,
  }
}

// ─── Skills Extraction ───────────────────────────────────────────────

const KNOWN_SKILLS = [
  // Tech
  'Python', 'JavaScript', 'TypeScript', 'Java', 'C\\+\\+', 'C#', 'SQL', 'HTML', 'CSS',
  'React', 'Angular', 'Vue', 'Node\\.js', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
  'Linux', 'Windows Server', 'Active Directory', 'VMware', 'Terraform', 'Ansible',
  'Git', 'CI/CD', 'Jenkins', 'JIRA', 'Agile', 'Scrum',
  // Cyber
  'Cybersecurity', 'Information Security', 'Network Security', 'SIEM', 'Splunk',
  'Vulnerability Assessment', 'Penetration Testing', 'Incident Response',
  'Risk Management', 'Risk Assessment', 'Compliance',
  'NIST', 'RMF', 'FISMA', 'FedRAMP', 'HIPAA', 'SOC 2', 'ISO 27001',
  'DISA STIG', 'ACAS', 'eMASS', 'HBSS',
  // Professional
  'Project Management', 'Program Management', 'Strategic Planning',
  'Budget Management', 'Stakeholder Management', 'Change Management',
  'Process Improvement', 'Lean Six Sigma', 'Supply Chain', 'Logistics',
  'Training', 'Mentoring', 'Team Leadership', 'Cross-Functional Teams',
  'Technical Writing', 'Data Analysis', 'Microsoft Office', 'Excel',
  'PowerPoint', 'SharePoint', 'Power BI', 'Tableau',
  'Communication', 'Problem Solving', 'Critical Thinking',
  'Operations Management', 'Quality Assurance', 'Quality Control',
  'Inventory Management', 'Procurement', 'Vendor Management',
  'Customer Service', 'Public Speaking', 'Conflict Resolution',
]

export function extractSkills(skillsSection: string, fullText: string): string[] {
  const found = new Set<string>()

  // 1. Parse comma-separated or bullet lists from skills section
  if (skillsSection) {
    const items = skillsSection
      .split(/[,\n•●○■◦▪–—|]/)
      .map(s => s.replace(/^[-*\s]+/, '').trim())
      .filter(s => s.length > 1 && s.length < 60)
    items.forEach(s => found.add(s))
  }

  // 2. Match known skills against full text
  for (const skill of KNOWN_SKILLS) {
    const regex = new RegExp(`\\b${skill}\\b`, 'i')
    if (regex.test(fullText)) {
      // Use the canonical casing from our list
      const clean = skill.replace(/\\\+/g, '+').replace(/\\\./g, '.')
      found.add(clean)
    }
  }

  return [...found]
}

// ─── Certifications Extraction ───────────────────────────────────────

// Known cert patterns — use \\+ for literal + in regex.
// NOTE: Trailing boundary uses (?!\\w) not \\b because + is non-word,
// so \\b after + fails when followed by space/comma/end.
const KNOWN_CERTS = [
  'PMP', 'CAPM', 'PMI-ACP', 'PMI-RMP',
  'CompTIA A\\+', 'CompTIA Network\\+', 'CompTIA Security\\+',
  'CompTIA CySA\\+', 'CompTIA PenTest\\+', 'CompTIA CASP\\+',
  'CompTIA Linux\\+', 'CompTIA Cloud\\+', 'CompTIA Data\\+',
  'A\\+', 'Network\\+', 'Net\\+', 'Security\\+', 'Sec\\+',
  'CySA\\+', 'PenTest\\+', 'CASP\\+',
  'Linux\\+', 'Cloud\\+', 'Data\\+',
  'CISSP', 'CISM', 'CISA', 'CRISC', 'CGEIT',
  'CEH', 'OSCP', 'GIAC', 'GSEC', 'GCIH', 'GCIA', 'GNFA',
  'AWS Certified', 'Azure Certified', 'Google Cloud Certified',
  'AWS Solutions Architect', 'AWS Cloud Practitioner',
  'CCNA', 'CCNP', 'CCIE',
  'ITIL', 'Lean Six Sigma', 'Six Sigma Green Belt', 'Six Sigma Black Belt',
  'Certified Scrum Master', 'CSM', 'SAFe',
  'PHR', 'SPHR', 'SHRM-CP', 'SHRM-SCP',
  'CPA', 'CFA', 'CFP',
  'CDL', 'OSHA',
  'First Aid', 'CPR', 'BLS',
]

// Normalize shorthand cert names to canonical form
const CERT_NORMALIZE: Record<string, string> = {
  'net+': 'Network+',
  'sec+': 'Security+',
  'comptia a+': 'A+',
  'comptia network+': 'Network+',
  'comptia net+': 'Network+',
  'comptia security+': 'Security+',
  'comptia sec+': 'Security+',
  'comptia cysa+': 'CySA+',
  'comptia pentest+': 'PenTest+',
  'comptia casp+': 'CASP+',
  'comptia linux+': 'Linux+',
  'comptia cloud+': 'Cloud+',
  'comptia data+': 'Data+',
}

export function extractCertifications(
  certsSection: string,
  fullText: string
): Array<{ name: string; issuing_organization: string | null }> {
  const found = new Map<string, string | null>()

  // 1. Parse from certs section (split on common list separators)
  if (certsSection) {
    const lines = certsSection.split(/[\n•●○■◦▪–—|,]/).map(s => s.trim()).filter(Boolean)
    for (const line of lines) {
      if (line.length > 1 && line.length < 120) {
        const name = line.replace(/\s*\(.*?\)\s*$/, '').trim()
        if (name.length > 1) {
          // Normalize if we recognize the name
          const normalized = CERT_NORMALIZE[name.toLowerCase()] || name
          found.set(normalized, null)
        }
      }
    }
  }

  // 2. Match known certs in full resume text (catches certs listed in skills/summary too)
  for (const cert of KNOWN_CERTS) {
    // Use (?!\w) instead of \b at the end — \b fails after + because
    // + is non-word and is usually followed by non-word (space/comma/end)
    const regex = new RegExp(`\\b${cert}(?!\\w)`, 'i')
    if (regex.test(fullText)) {
      const clean = cert.replace(/\\\+/g, '+').replace(/\\\./g, '.')
      const normalized = CERT_NORMALIZE[clean.toLowerCase()] || clean
      if (!found.has(normalized)) found.set(normalized, null)
    }
  }

  console.log('[ResumeParser] Certifications found:', [...found.keys()])

  return [...found.entries()].map(([name, issuing_organization]) => ({
    name,
    issuing_organization,
  }))
}

// ─── Education Extraction ────────────────────────────────────────────

// Degree patterns for extracting degree_type from a confirmed education entry.
// Uses \b at start and lookahead at end to prevent partial-word matches
// (e.g., "Performance" matching "ma" via M.?A.?).
const DEGREE_PATTERNS = [
  /\b(?:Doctorate|Doctor's|Ph\.?D\.?|Ed\.?D\.?)(?=[\s,;)\-.]|$)/i,
  /\b(?:Master(?:'s)?|M\.?B\.?A\.?|M\.?S\.?|M\.?A\.?|M\.?Ed\.?)(?=[\s,;)\-.]|$)/i,
  /\b(?:Bachelor(?:'s)?|B\.?S\.?|B\.?A\.?|B\.?B\.?A\.?)(?=[\s,;)\-.]|$)/i,
  /\b(?:Associate(?:'s)?|A\.?A\.?S?\.?|A\.?S\.?)(?=[\s,;)\-.]|$)/i,
  /\b(?:High\s+School|GED|Diploma)(?=[\s,;)\-.]|$)/i,
]

// Line-level detection: does this line START a new education entry?
// More restrictive than DEGREE_PATTERNS:
// - 2-letter abbreviations require at least one period (M.S., B.A.) to avoid
//   false positives like "Managed" → "Ma" or state codes "MA", "MS"
// - BS, BA, AA, AAS allowed without periods (unambiguous in education context)
// - Certificate/Certification excluded (too noisy: "Certificate tracking system")
const DEGREE_LINE_PATTERN = /\b(?:Doctorate|Doctor's|Ph\.?D\.?|Ed\.?D\.?|Master(?:'s)?|Bachelor(?:'s)?|Associate(?:'s)?|High\s+School|GED|Diploma|M\.B\.A\.?|MBA|M\.S\.?|M\.A\.?|M\.Ed\.?|B\.S\.?|B\.A\.?|B\.B\.A\.?|A\.A\.?S?\.?|A\.S\.?|BS|BA|AA|AAS)(?=[\s,;)\-.]|$)/i

// Common school keywords to identify school name lines
const SCHOOL_KEYWORDS = /\b(?:University|College|Institute|School|Academy|Polytechnic)\b/i

const MAX_EDUCATION_ENTRIES = 10

export interface ParsedEducation {
  degree_type: string | null
  field_of_study: string | null
  school_name: string | null
  graduation_year: string | null
}

export function extractEducation(educationSection: string): ParsedEducation[] {
  if (!educationSection) return []

  console.log('[ResumeParser] Education section raw text:', educationSection)

  const lines = educationSection.split('\n').map(l => l.trim()).filter(Boolean)
  console.log('[ResumeParser] Education lines:', lines)

  // Group lines into education entries.
  // A degree keyword starts a new entry. School keywords attach to current or start new.
  // If current entry has no degree yet (school-first format), merge the degree line into it.
  const entries: { lines: string[] }[] = []
  let current: { lines: string[] } | null = null

  for (const line of lines) {
    const hasDegree = DEGREE_LINE_PATTERN.test(line)
    const hasSchool = SCHOOL_KEYWORDS.test(line)

    if (hasDegree) {
      // Does the current entry already have a degree?
      const currentHasDegree = current?.lines.some(l => DEGREE_LINE_PATTERN.test(l))
      if (current && !currentHasDegree) {
        // Current entry was school-first — merge degree into it
        current.lines.push(line)
      } else {
        // Start new entry
        current = { lines: [line] }
        entries.push(current)
      }
    } else if (hasSchool) {
      if (current) {
        // Attach school to current entry
        current.lines.push(line)
      } else {
        // School before any degree — start entry (school-first format)
        current = { lines: [line] }
        entries.push(current)
      }
    } else if (current) {
      // Context line (year, field, etc.) — attach to current entry
      current.lines.push(line)
    }
    // Lines with no degree/school keyword and no current entry are skipped
  }

  console.log('[ResumeParser] Education entries found:', entries.length)

  const results: ParsedEducation[] = []

  for (const entry of entries) {
    if (results.length >= MAX_EDUCATION_ENTRIES) break

    let degree_type: string | null = null
    let field_of_study: string | null = null
    let school_name: string | null = null
    let graduation_year: string | null = null

    // Extract degree from the degree-keyword line specifically (not full block)
    // to avoid matching state codes like "MA" in "Cambridge, MA"
    const degreeLine = entry.lines.find(l => DEGREE_LINE_PATTERN.test(l))
    if (degreeLine) {
      for (const pattern of DEGREE_PATTERNS) {
        const match = degreeLine.match(pattern)
        if (match) {
          degree_type = match[0]
          break
        }
      }
    }

    // Find year from any line in the entry
    const fullBlock = entry.lines.join(' ')
    const yearMatch = fullBlock.match(/\b(19[6-9]\d|20[0-3]\d)\b/)
    if (yearMatch) graduation_year = yearMatch[1]

    // Field of study — extract from degree line only (avoids school name fragments).
    // Order matters: most specific patterns first, "of <field>" last to avoid
    // matching school fragments like "of Maryland" or "of the Air Force".
    if (degreeLine) {
      let fieldMatch: RegExpMatchArray | null = null
      // 1. "of Science/Arts/Fine Arts in <field>" (e.g., "Bachelor of Science in Cybersecurity")
      fieldMatch = degreeLine.match(/\bof\s+(?:Science|Arts|Fine\s+Arts)\s+in\s+([A-Z][A-Za-z\s&]+?)(?:\s*[-–—,|]|\s*\d{4}|$)/i)
      // 2. "in <field>" (e.g., "M.S. in Computer Science")
      if (!fieldMatch) {
        fieldMatch = degreeLine.match(/\bin\s+([A-Z][A-Za-z\s&]+?)(?:\s*[-–—,|]|\s*\d{4}|$)/i)
      }
      // 3. Text after degree abbreviation before separator (e.g., "BS Computer Science, ..." or "BS Cybersecurity | WGU")
      //    Skip if starts with "of"/"in" — let the dedicated patterns handle those
      if (!fieldMatch) {
        const degreeMatch = degreeLine.match(DEGREE_LINE_PATTERN)
        if (degreeMatch && degreeMatch.index != null) {
          const afterDegree = degreeLine.substring(degreeMatch.index + degreeMatch[0].length).trim()
          if (!/^(?:of|in)\s/i.test(afterDegree)) {
            const candidate = afterDegree.match(/^([A-Z][A-Za-z\s&]+?)(?:\s*[-–—,|]|\s*\d{4}|$)/i)
            if (candidate && !SCHOOL_KEYWORDS.test(candidate[1]) && candidate[1].trim().length > 2) {
              fieldMatch = candidate
            }
          }
        }
      }
      // 4. "of <field>" last resort (e.g., "Master of Business Administration")
      if (!fieldMatch) {
        fieldMatch = degreeLine.match(/\bof\s+([A-Z][A-Za-z\s&]+?)(?:\s*[-–—,|]|\s*\d{4}|$)/i)
        if (fieldMatch && SCHOOL_KEYWORDS.test(fieldMatch[1])) {
          fieldMatch = null
        }
      }
      if (fieldMatch) {
        field_of_study = fieldMatch[1].trim()
      }
    }

    // School name — split lines by commas/dashes/pipes and find parts with school keywords
    for (const line of entry.lines) {
      const parts = line.split(/[,\-–—|]\s*/).map(p => p.trim())
      for (const part of parts) {
        if (SCHOOL_KEYWORDS.test(part) && part.length > 2) {
          school_name = part.replace(/\s*\(?\d{4}\)?\s*$/, '').replace(/[,\s]+$/, '').trim()
          break
        }
      }
      if (school_name) break
    }
    // Fallback for multi-line: first non-degree, non-year line
    if (!school_name && entry.lines.length > 1) {
      for (const line of entry.lines) {
        if (line === degreeLine) continue
        const isYear = /^\d{4}$/.test(line)
        if (!isYear && line.length > 3) {
          school_name = line.replace(/\s*\(?\d{4}\)?\s*$/, '').replace(/[,\s]+$/, '').trim()
          if (school_name && school_name.length > 2) break
          school_name = null
        }
      }
    }
    // Fallback for single-line: extract school from comma/pipe-separated parts
    // (handles acronym schools like MIT, WGU that lack SCHOOL_KEYWORDS)
    if (!school_name && degreeLine && entry.lines.length === 1) {
      const parts = degreeLine.split(/[,|]\s*/).map(p => p.trim())
      for (const part of parts) {
        if (DEGREE_LINE_PATTERN.test(part)) continue
        if (/^\(?\d{4}\)?$/.test(part)) continue
        if (field_of_study && part.toLowerCase().includes(field_of_study.toLowerCase())) continue
        if (part.length > 1) {
          school_name = part.replace(/\s*\(?\d{4}\)?\s*$/, '').replace(/[,\s]+$/, '').trim()
          break
        }
      }
    }

    // Only keep entries with at least a degree_type OR school_name
    if (degree_type || school_name) {
      results.push({ degree_type, field_of_study, school_name, graduation_year })
    }
  }

  console.log('[ResumeParser] Education parsed:', JSON.stringify(results, null, 2))

  return results
}

// ─── Date Extraction ─────────────────────────────────────────────────

const MONTHS: Record<string, string> = {
  jan: '01', january: '01',
  feb: '02', february: '02',
  mar: '03', march: '03',
  apr: '04', april: '04',
  may: '05',
  jun: '06', june: '06',
  jul: '07', july: '07',
  aug: '08', august: '08',
  sep: '09', sept: '09', september: '09',
  oct: '10', october: '10',
  nov: '11', november: '11',
  dec: '12', december: '12',
}

export function parseDate(dateStr: string): string | null {
  if (!dateStr) return null
  const s = dateStr.trim()

  // "Present" or "Current"
  if (/^(?:present|current|now)$/i.test(s)) return null

  // "Jan 2020" or "January 2020"
  const monthYear = s.match(/^(\w+)\.?\s+(\d{4})$/)
  if (monthYear) {
    const mm = MONTHS[monthYear[1].toLowerCase()]
    if (mm) return `${monthYear[2]}-${mm}-01`
  }

  // "01/2020" or "1/2020"
  const slashDate = s.match(/^(\d{1,2})[/.](\d{4})$/)
  if (slashDate) {
    const mm = slashDate[1].padStart(2, '0')
    return `${slashDate[2]}-${mm}-01`
  }

  // "2020" alone
  const yearOnly = s.match(/^(\d{4})$/)
  if (yearOnly) return `${yearOnly[1]}-01-01`

  // "2020-03" (already formatted)
  const isoShort = s.match(/^(\d{4})-(\d{2})$/)
  if (isoShort) return `${isoShort[1]}-${isoShort[2]}-01`

  return null
}

// ─── Military Info ───────────────────────────────────────────────────

const BRANCHES = ['Army', 'Navy', 'Air Force', 'Marines', 'Marine Corps', 'Coast Guard', 'Space Force']
const RANK_PATTERNS = /\b(E-?[1-9]|O-?[1-9]|W-?[1-5]|PVT|PV2|PFC|SPC|CPL|SGT|SSG|SFC|MSG|1SG|SGM|CSM|SMA|2LT|1LT|CPT|MAJ|LTC|COL|BG|MG|LTG|GEN|SR|SA|SN|PO3|PO2|PO1|CPO|SCPO|MCPO|ENS|LTJG|LT|LCDR|CDR|CAPT|RDML|RADM|VADM|ADM|AB|Amn|A1C|SrA|SSgt|TSgt|MSgt|SMSgt|CMSgt|Pvt|LCpl|Cpl|Sgt|SSgt|GySgt|MSgt|1stSgt|MGySgt|SgtMaj)\b/

export interface ParsedMilitary {
  branch: string | null
  rank: string | null
}

export function extractMilitary(text: string): ParsedMilitary {
  let branch: string | null = null
  let rank: string | null = null

  for (const b of BRANCHES) {
    if (new RegExp(`\\b${b}\\b`, 'i').test(text)) {
      branch = b === 'Marine Corps' ? 'Marines' : b
      break
    }
  }

  const rankMatch = text.match(RANK_PATTERNS)
  if (rankMatch) rank = rankMatch[1]

  return { branch, rank }
}

// ─── Professional Summary ────────────────────────────────────────────

export function extractSummary(summarySection: string): string | null {
  if (!summarySection || summarySection.trim().length < 20) return null
  // Trim to first paragraph if there are multiple
  const paragraphs = summarySection.split(/\n{2,}/).filter(p => p.trim().length > 20)
  return paragraphs[0]?.trim() || null
}

// ─── Combined Education & Certifications Section ────────────────

function parseCombinedSection(text: string): {
  education: ParsedEducation[]
  certifications: Array<{ name: string; issuing_organization: string | null }>
} {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const eduLines: string[] = []
  const certLines: string[] = []

  for (const line of lines) {
    if (DEGREE_LINE_PATTERN.test(line)) {
      eduLines.push(line)
    } else {
      certLines.push(line)
    }
  }

  console.log('[ResumeParser] Combined section - education lines:', eduLines)
  console.log('[ResumeParser] Combined section - certification lines:', certLines)

  // Parse education lines (pipe-delimited: "Degree Info | School Name")
  const eduEntries: ParsedEducation[] = []
  for (const line of eduLines) {
    const parts = line.split(/\s*\|\s*/)
    const degreePart = parts[0]?.trim()
    if (!degreePart) continue

    let school_name: string | null = null
    let graduation_year: string | null = null

    for (let i = 1; i < parts.length; i++) {
      const p = parts[i].trim()
      if (/^\d{4}$/.test(p)) {
        graduation_year = p
      } else if (p.length > 1 && !school_name) {
        school_name = p
      }
    }

    if (!graduation_year) {
      const yearMatch = degreePart.match(/\b(19[6-9]\d|20[0-3]\d)\b/)
      if (yearMatch) graduation_year = yearMatch[1]
    }

    // Extract degree type — parenthetical abbreviation first (MBA)
    let degree_type: string | null = null
    const abbrMatch = degreePart.match(/\(([A-Z][A-Z.]{1,5})\)/)
    if (abbrMatch) {
      degree_type = abbrMatch[1]
    } else {
      for (const pattern of DEGREE_PATTERNS) {
        const match = degreePart.match(pattern)
        if (match) {
          degree_type = match[0]
          break
        }
      }
    }

    // Extract field of study
    let field_of_study: string | null = null
    const commaIdx = degreePart.indexOf(',')
    if (commaIdx > -1) {
      // "Bachelor of Science, Cybersecurity and Information Assurance"
      field_of_study = degreePart.substring(commaIdx + 1).trim()
    } else {
      // "Master of Business Administration (MBA)" → "Business Administration"
      const inMatch = degreePart.match(/\bof\s+(?:Science|Arts|Fine\s+Arts)\s+in\s+(.+?)(?:\s*\(|$)/i)
      if (inMatch) {
        field_of_study = inMatch[1].trim()
      } else {
        const ofMatch = degreePart.match(/\bof\s+(.+?)(?:\s*\(|$)/i)
        if (ofMatch) {
          const candidate = ofMatch[1].trim()
          if (!/^(?:Science|Arts|Fine\s+Arts)$/i.test(candidate)) {
            field_of_study = candidate
          }
        }
      }
    }

    eduEntries.push({ degree_type, field_of_study, school_name, graduation_year })
  }

  // Parse certification lines (pipe-delimited: "Cert Name(s) | Issuing Org")
  const certEntries: Array<{ name: string; issuing_organization: string | null }> = []
  for (const line of certLines) {
    const pipeIdx = line.indexOf('|')
    let namePart: string
    let issuer: string | null = null

    if (pipeIdx > -1) {
      namePart = line.substring(0, pipeIdx).trim()
      issuer = line.substring(pipeIdx + 1).trim() || null
    } else {
      namePart = line.trim()
    }

    if (!namePart) continue

    // Comma-separated multiple certs on one line
    if (namePart.includes(',')) {
      const certNames = namePart.split(',').map(s => s.trim()).filter(Boolean)
      for (let certName of certNames) {
        certName = certName.replace(/\s+Certified$/i, '').replace(/[®™]/g, '').trim()
        const abbr = certName.match(/\(([A-Z][A-Z0-9.+]{1,10})\)/)
        if (abbr) certName = abbr[1]
        if (certName.length > 0) {
          certEntries.push({ name: certName, issuing_organization: issuer })
        }
      }
    } else {
      // Single cert
      let certName = namePart.replace(/[®™]/g, '').trim()
      const abbr = certName.match(/\(([A-Z][A-Z0-9.+]{1,10})\)/)
      if (abbr) certName = abbr[1]
      if (certName.length > 0) {
        certEntries.push({ name: certName, issuing_organization: issuer })
      }
    }
  }

  console.log('[ResumeParser] Combined section parsed - education:', JSON.stringify(eduEntries, null, 2))
  console.log('[ResumeParser] Combined section parsed - certifications:', certEntries.map(c => `${c.name} (${c.issuing_organization})`))

  return { education: eduEntries, certifications: certEntries }
}

// ─── Full Parse ──────────────────────────────────────────────────────

export interface FullParseResult {
  contact: ParsedContact
  summary: string | null
  experienceText: string
  education: ParsedEducation[]
  skills: string[]
  certifications: Array<{ name: string; issuing_organization: string | null }>
  military: ParsedMilitary
}

export function parseResume(text: string): FullParseResult {
  const sections = splitSections(text)

  console.log('[ResumeParser] Section breakdown:', {
    summary: sections.summary.length + ' chars',
    experience: sections.experience.length + ' chars',
    education: sections.education.length + ' chars',
    education_and_certs: sections.education_and_certs.length + ' chars',
    skills: sections.skills.length + ' chars',
    certifications: sections.certifications.length + ' chars',
    military: sections.military.length + ' chars',
    other: sections.other.length + ' chars',
  })

  let education = extractEducation(sections.education)
  let certifications = extractCertifications(sections.certifications, text)

  // Handle combined EDUCATION | CERTIFICATIONS section
  if (sections.education_and_certs) {
    const combined = parseCombinedSection(sections.education_and_certs)
    education = [...education, ...combined.education]

    // Dedup: combined certs (with issuers) take priority over fullText matches
    const combinedNames = combined.certifications.map(c => c.name.toLowerCase())
    const combinedNamesSet = new Set(combinedNames)
    certifications = [
      ...combined.certifications,
      ...certifications.filter(c => {
        const name = c.name.toLowerCase()
        if (combinedNamesSet.has(name)) return false
        // Skip if combined has a longer version (e.g., "ITIL Foundations" covers "ITIL")
        return !combinedNames.some(cn => cn.startsWith(name + ' '))
      }),
    ]
  }

  return {
    contact: extractContact(text),
    summary: extractSummary(sections.summary),
    experienceText: sections.experience,
    education,
    skills: extractSkills(sections.skills, text),
    certifications,
    military: extractMilitary(text),
  }
}
