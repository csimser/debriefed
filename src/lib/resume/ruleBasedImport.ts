/**
 * Rule-based resume import — the keyless structuring path.
 *
 * Takes raw resume text (from paste or DOCX/mammoth extraction) and produces
 * the SAME shape as the AI `parseResumeText()` result, so the import
 * preview/apply flow is identical in both modes. Zero AI calls.
 *
 * Pipeline:
 *   1. `parseResume()` (resume-parser) — section split + contact/education/
 *      skills/certs/military regex extraction
 *   2. Experience segmentation — date-range and bullet-marker heuristics
 *      split the experience section into positions with header + bullets
 *   3. Each bullet runs through the dictionary `translateBullet()` engine;
 *      when coverage is sufficient the translation prefills the bullet text
 *      (status 'pending' in `bullet_details` — the user confirms in preview)
 *
 * The output is intentionally imperfect — the import preview UI exists so
 * users can correct anything the heuristics get wrong.
 */
import { parseResume, parseDate } from '@/lib/resume-parser'
import { translateBullet } from '@/lib/dictionary/bulletTranslator'
import { getCivilianJobs } from '@/lib/debriefed-token-saver/jobCrosswalk'

// ─── Result types (superset of the AI parseResumeText shape) ─────────

export interface RuleBasedBulletDetail {
  original_text: string
  translated_text: string
  status: 'pending'
}

export interface RuleBasedExperience {
  job_title: string
  civilian_title: string
  organization: string
  employment_type: 'military' | 'civilian'
  city: string | null
  state: string | null
  start_date: string | null
  end_date: string | null
  is_current: boolean
  /** Display/import text per bullet — dictionary translation when coverage was sufficient. */
  bullets: string[]
  /** Per-bullet original + dictionary translation, status 'pending' until the user confirms. */
  bullet_details: RuleBasedBulletDetail[]
}

export interface RuleBasedParseResult {
  /** Marker: this result came from the keyless dictionary/rules path. */
  mode: 'dictionary'
  contact: {
    first_name: string | null
    last_name: string | null
    phone: string | null
    city: string | null
    state: string | null
    linkedin_url: string | null
  }
  professional_summary: string | null
  experiences: RuleBasedExperience[]
  education: Array<{
    degree_type: string | null
    field_of_study: string | null
    school_name: string | null
    graduation_year: string | null
  }>
  certifications: Array<{ name: string; issuing_organization: string | null }>
  skills: Array<{ name: string; category: string }>
  military_info: { branch: string | null; rank: string | null }
}

// ─── Heuristic patterns ──────────────────────────────────────────────

const MAX_EXPERIENCES = 15
const MAX_BULLETS_PER_EXPERIENCE = 15
const MAX_SKILLS = 50

const MONTH = String.raw`(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)`
const DATE_TOKEN = String.raw`(?:${MONTH}\.?,?\s+\d{4}|\d{1,2}[/.]\d{4}|\d{4}-\d{2}|\d{4})`
const PRESENT_TOKEN = String.raw`(?:Present|Current|Now|Ongoing|Today)`

/** "Jan 2020 – Present", "01/2018 - 03/2021", "2019 to 2021", ... */
const DATE_RANGE_RE = new RegExp(
  `(${DATE_TOKEN})\\s*(?:[-–—]+|to|through|until)\\s*(${DATE_TOKEN}|${PRESENT_TOKEN})`,
  'i',
)
const PRESENT_RE = new RegExp(`^${PRESENT_TOKEN}$`, 'i')

/** Bullet list markers: •, -, *, "1.", "2)", etc. */
const BULLET_MARKER_RE = /^\s*(?:[-–—*•●○◦▪‣·»➤➢▸►]|\d{1,2}[.)])\s+/

/** "City, ST" (also matches "Washington, DC") */
const LOCATION_RE = /\b([A-Z][A-Za-z.'-]+(?:\s[A-Z][A-Za-z.'-]+)*),\s*([A-Z]{2})(?![A-Za-z])/

/** Words that strongly suggest an organization (vs a job title) line. */
const ORG_KEYWORDS = /\b(?:Inc\.?|LLC|L\.L\.C\.?|Corp\.?|Corporation|Compan(?:y|ies)|Co\.|Group|Solutions|Services|Technologies|Systems|Industries|Enterprises|University|College|Hospital|Bank|Agency|Associates|Partners|Consulting|Logistics|USS|USNS|Battalion|Brigade|Regiment|Squadron|Division|Wing|Fleet|Command|Detachment)\b/i

/** Header text that marks a position as military. */
const MILITARY_HEADER_RE = /\b(?:U\.?\s?S\.?\s+(?:Army|Navy|Air\s+Force|Marine|Coast\s+Guard|Space\s+Force)|United\s+States\s+(?:Army|Navy|Air\s+Force|Marine|Coast\s+Guard|Space\s+Force)|US?\s?Army|Navy|Air\s+Force|Marine\s+Corps|Marines|Coast\s+Guard|Space\s+Force|USS\s|USNS\s|Battalion|Brigade|Regiment|Squadron|Platoon|Infantry|Artillery|Airborne|Naval\s|Fort\s+[A-Z]|Camp\s+(?:Pendleton|Lejeune)|NAS\s+[A-Z]|MCAS\s+[A-Z]|National\s+Guard|Reserves?\b|DoD|Department\s+of\s+Defense)\b/i

// ─── Contact: name heuristic ─────────────────────────────────────────

const NON_NAME_LINE_RE = /resume|curriculum|vitae|summary|objective|profile|experience|contact/i
const NAME_SUFFIX_RE = /^(?:Jr\.?|Sr\.?|II|III|IV|V|MBA|PMP|PhD|MSc|BSc|CISSP|RN|PE)$/i

function extractName(text: string): { first: string | null; last: string | null } {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 5)

  for (const line of lines) {
    if (line.length > 45) continue
    if (/[@\d]/.test(line)) continue
    if (NON_NAME_LINE_RE.test(line)) continue
    // Drop credential tails: "Jane Doe, PMP | Project Manager"
    const head = line.split(/[,|•·–—]/)[0].trim()
    const words = head.split(/\s+/)
    if (words.length < 2 || words.length > 4) continue
    if (!words.every((w) => /^[A-Z][A-Za-z.'-]*$/.test(w))) continue
    const nameWords = words.filter((w) => !NAME_SUFFIX_RE.test(w))
    if (nameWords.length >= 2) {
      return { first: nameWords[0], last: nameWords[nameWords.length - 1] }
    }
  }
  return { first: null, last: null }
}

// ─── Experience segmentation ─────────────────────────────────────────

interface RawExperience {
  headerLines: string[]
  dateMatch: RegExpMatchArray | null
  bullets: string[]
}

function looksLikeHeaderLine(line: string): boolean {
  return line.length <= 90 && !/[.!?]$/.test(line) && line.split(/\s+/).length <= 10
}

function looksLikeSentence(line: string): boolean {
  return line.split(/\s+/).length >= 8 || /[.;:]$/.test(line)
}

/**
 * Split the experience-section text into positions.
 *
 * Rules:
 * - A line containing a date range starts (or completes) an experience header
 * - Bullet-marker lines belong to the current experience
 * - Short non-bullet lines before a date/bullet are buffered as header
 *   candidates (title/company lines)
 * - Lowercase-starting lines after a bullet are wrapped continuations
 * - Sentence-like lines in a position without markers become bullets
 *   (paragraph-style resumes)
 */
function segmentExperiences(expText: string): RawExperience[] {
  const exps: RawExperience[] = []
  let headerBuffer: string[] = []
  let current: RawExperience | null = null

  const startExp = (headerLines: string[], dateMatch: RegExpMatchArray | null): RawExperience => {
    const exp: RawExperience = { headerLines, dateMatch, bullets: [] }
    exps.push(exp)
    return exp
  }

  for (const rawLine of expText.split('\n')) {
    const line = rawLine.trim()
    if (!line) continue

    if (BULLET_MARKER_RE.test(line)) {
      // Buffered header lines mean this bullet belongs to a NEW position
      if (!current || headerBuffer.length > 0) {
        current = startExp([...headerBuffer], null)
        headerBuffer = []
      }
      current.bullets.push(line.replace(BULLET_MARKER_RE, '').trim())
      continue
    }

    const dateMatch = line.match(DATE_RANGE_RE)
    if (dateMatch) {
      if (current && current.bullets.length === 0 && !current.dateMatch && headerBuffer.length === 0) {
        // Date line completing the current header (title line came first)
        current.headerLines.push(line)
        current.dateMatch = dateMatch
      } else {
        current = startExp([...headerBuffer, line], dateMatch)
        headerBuffer = []
      }
      continue
    }

    // Plain line — header continuation, bullet continuation, paragraph bullet,
    // or buffered candidate for the next position's header.
    if (current && current.bullets.length === 0 && current.headerLines.length < 4 && looksLikeHeaderLine(line)) {
      current.headerLines.push(line)
    } else if (current && current.bullets.length > 0 && /^[a-z(]/.test(line)) {
      current.bullets[current.bullets.length - 1] += ' ' + line
    } else if (current && looksLikeSentence(line)) {
      current.bullets.push(line)
    } else {
      headerBuffer.push(line)
      if (headerBuffer.length > 3) headerBuffer.shift()
    }
  }

  return exps.filter((e) => e.headerLines.some((l) => l.trim()) || e.bullets.length > 0)
}

// ─── Header parsing: title / organization / dates / location ─────────

function normalizeDateToken(token: string): string {
  return token.replace(/,/g, ' ').replace(/\s+/g, ' ').trim()
}

function splitTitleOrg(lines: string[]): { title: string; org: string } {
  if (lines.length === 0) return { title: '', org: '' }

  if (lines.length >= 2) {
    const [a, b] = lines
    if (ORG_KEYWORDS.test(a) && !ORG_KEYWORDS.test(b)) return { title: b, org: a }
    return { title: a, org: b }
  }

  const line = lines[0]
  for (const sep of [' | ', ' — ', ' – ', ' - ', ' at ', ' @ ']) {
    const idx = line.indexOf(sep)
    if (idx > 0) {
      const a = line.slice(0, idx).trim()
      const b = line.slice(idx + sep.length).trim()
      if (!a || !b) continue
      if (ORG_KEYWORDS.test(a) && !ORG_KEYWORDS.test(b)) return { title: b, org: a }
      return { title: a, org: b }
    }
  }

  // "Title, Some Company Inc" — comma split only when the tail is clearly an org
  const commaIdx = line.indexOf(', ')
  if (commaIdx > 0 && ORG_KEYWORDS.test(line.slice(commaIdx + 1))) {
    return { title: line.slice(0, commaIdx).trim(), org: line.slice(commaIdx + 1).trim() }
  }

  return { title: line, org: '' }
}

/** Mirror the AI path's crosswalk lookup: MOS/rating code in the title → civilian title. */
function crosswalkCivilianTitle(jobTitle: string, branch: string | null): string | null {
  const codeMatch = jobTitle.match(/\b(\d{2}[A-Z]\d?|\d{4}|[A-Z]{2,4}|\d[A-Z]\d+X?\d*)\b/)
  if (!codeMatch) return null
  try {
    const result = getCivilianJobs(codeMatch[1], branch || undefined)
    return result?.civilian_titles?.[0] ?? null
  } catch {
    return null
  }
}

async function deriveExperience(
  raw: RawExperience,
  branch: string | null,
): Promise<RuleBasedExperience> {
  const headerText = raw.headerLines.join('\n')

  // Dates
  let start_date: string | null = null
  let end_date: string | null = null
  let is_current = false
  const dm = raw.dateMatch ?? headerText.match(DATE_RANGE_RE)
  if (dm) {
    start_date = parseDate(normalizeDateToken(dm[1]))
    if (PRESENT_RE.test(dm[2].trim())) {
      is_current = true
    } else {
      end_date = parseDate(normalizeDateToken(dm[2]))
    }
  }

  // Strip date ranges, then pull location out of the header
  let lines = raw.headerLines.map((l) => l.replace(DATE_RANGE_RE, '').trim())
  let city: string | null = null
  let state: string | null = null
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(LOCATION_RE)
    if (m) {
      city = m[1]
      state = m[2]
      lines[i] = lines[i].replace(m[0], '').trim()
      break
    }
  }
  // Clean leftover separators and empties
  lines = lines
    .map((l) => l.replace(/^[\s|,;:–—-]+/, '').replace(/[\s|,;:–—-]+$/, '').trim())
    .filter(Boolean)

  const { title, org } = splitTitleOrg(lines)
  const employment_type: 'military' | 'civilian' = MILITARY_HEADER_RE.test(headerText)
    ? 'military'
    : 'civilian'

  // Bullets → dictionary translation (prefill when coverage is sufficient)
  const cleanBullets = raw.bullets
    .map((b) => b.replace(/\s+/g, ' ').trim())
    .filter((b) => b.length >= 8)
    .slice(0, MAX_BULLETS_PER_EXPERIENCE)

  const bullet_details: RuleBasedBulletDetail[] = await Promise.all(
    cleanBullets.map(async (b) => {
      try {
        const result = await translateBullet(b, { branch: branch ?? undefined })
        return {
          original_text: b,
          translated_text: result.dictionarySufficient ? result.translatedText : b,
          status: 'pending' as const,
        }
      } catch {
        return { original_text: b, translated_text: b, status: 'pending' as const }
      }
    }),
  )

  let civilian_title = title
  if (employment_type === 'military' && title) {
    civilian_title = crosswalkCivilianTitle(title, branch) ?? title
  }

  return {
    job_title: title,
    civilian_title,
    organization: org,
    employment_type,
    city,
    state,
    start_date,
    end_date,
    is_current,
    bullets: bullet_details.map((d) => d.translated_text),
    bullet_details,
  }
}

// ─── Main entry point ────────────────────────────────────────────────

/**
 * Parse resume text into structured import data using only local rules and
 * the dictionary engine — no API key, no network.
 */
export async function parseResumeTextLocal(text: string): Promise<RuleBasedParseResult> {
  if (!text || text.trim().length < 50) {
    throw new Error('Resume text is too short to parse.')
  }

  const base = parseResume(text)
  const name = extractName(text)
  const branch = base.military.branch

  // extractContact's City, ST regex can match across a line break
  // ("Smith\nNorfolk, VA") — keep only the city itself.
  const contactCity = base.contact.city?.includes('\n')
    ? base.contact.city.split('\n').pop()?.trim() || null
    : base.contact.city

  // If no Experience section header was found, run the segmenter over the
  // full text — date-range/bullet heuristics gate what it picks up.
  const expSource = base.experienceText || text
  const rawExps = segmentExperiences(expSource).slice(0, MAX_EXPERIENCES)

  const experiences = (
    await Promise.all(rawExps.map((raw) => deriveExperience(raw, branch)))
  ).filter((e) => e.job_title || e.organization || e.bullets.length > 0)

  return {
    mode: 'dictionary',
    contact: {
      first_name: name.first,
      last_name: name.last,
      phone: base.contact.phone,
      city: contactCity,
      state: base.contact.state,
      linkedin_url: base.contact.linkedin,
    },
    professional_summary: base.summary,
    experiences,
    education: base.education.map((edu) => ({
      degree_type: edu.degree_type,
      field_of_study: edu.field_of_study,
      school_name: edu.school_name,
      graduation_year: edu.graduation_year,
    })),
    certifications: base.certifications,
    skills: base.skills.slice(0, MAX_SKILLS).map((s) => ({ name: s, category: 'general' })),
    military_info: { branch: base.military.branch, rank: base.military.rank },
  }
}
