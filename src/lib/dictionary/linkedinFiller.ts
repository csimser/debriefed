/**
 * LinkedIn dictionary filler — rule-based, keyless headline/about generation.
 *
 * A thin wiring module (not an engine): it matches `linkedin_templates` rows
 * by section + target_role/industry, fills placeholders from the user's
 * profile (civilian title via the MOS crosswalk, years, branch, top skills,
 * LinkedIn keywords matched against the user's skills), and polishes the
 * result. Honest deterministic output — same spirit as summaryTemplates.
 */

import type { DictionaryCache, DictLinkedinTemplate } from './types'
import { getCivilianJobs } from '@/lib/debriefed-token-saver/jobCrosswalk'
import { polishHeadline } from './outputPolisher'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LinkedInFillerProfile {
  first_name?: string | null
  last_name?: string | null
  branch?: string | null
  paygrade?: string | null
  rank?: string | null
  years_of_service?: string | number | null
  clearance?: string | null
  rating_mos?: string | null
  mos?: string | null
  city?: string | null
  state?: string | null
  target_industry?: string | null
  /** The role the user is targeting (UI input takes precedence over profile). */
  targetRole?: string | null
  skills?: string[]
  certifications?: Array<string | { name?: string }>
  education?: Array<{ degree_type?: string; degree?: string; field_of_study?: string }>
}

export interface LinkedInFillerExperience {
  title?: string | null
  job_title?: string | null
  civilian_title?: string | null
  company?: string | null
  organization?: string | null
  bullets?: unknown[]
  experience_bullets?: unknown[]
  achievements?: unknown[]
}

// ---------------------------------------------------------------------------
// Small profile helpers
// ---------------------------------------------------------------------------

function shortBranch(branch?: string | null): string {
  const b = (branch || '').toLowerCase()
  if (b.includes('navy')) return 'Navy'
  if (b.includes('army')) return 'Army'
  if (b.includes('air') || b === 'air_force') return 'Air Force'
  if (b.includes('marine')) return 'Marine Corps'
  if (b.includes('coast')) return 'Coast Guard'
  if (b.includes('space')) return 'Space Force'
  return branch || 'military'
}

function formatClearance(raw?: string | null): string {
  if (!raw || raw.toLowerCase() === 'none') return ''
  const cl = raw.toLowerCase().replace(/[-_]/g, '/')
  if (/ts.?sci/.test(cl)) return 'TS/SCI Clearance'
  if (/top.?secret/.test(cl)) return 'Top Secret Clearance'
  if (cl === 'secret') return 'Secret Clearance'
  if (cl === 'confidential') return 'Confidential Clearance'
  return raw.charAt(0).toUpperCase() + raw.slice(1) + ' Clearance'
}

function shortDegree(education?: LinkedInFillerProfile['education']): string {
  const edu0 = (education || [])[0]
  if (!edu0) return ''
  const deg = (edu0.degree_type || edu0.degree || '').toLowerCase()
  const field = (edu0.field_of_study || '').toLowerCase()
  if (deg.includes('mba') || (deg.includes('master') && field.includes('business'))) return 'MBA'
  if (deg.includes('master') || deg === 'ms' || deg === 'ma') return 'MS'
  if (deg.includes('bachelor') || deg === 'bs' || deg === 'ba') return 'BS'
  if (deg.includes('associate')) return 'AS'
  if (deg.includes('phd') || deg.includes('doctor')) return 'PhD'
  if (deg.length > 0 && deg.length <= 4) return deg.toUpperCase()
  return ''
}

function certNames(certifications?: LinkedInFillerProfile['certifications']): string[] {
  return (certifications || [])
    .map(c => (typeof c === 'string' ? c : c?.name || ''))
    .filter(Boolean) as string[]
}

/** Civilian job title: crosswalk JSON first, then the mos_to_civilian dictionary table. */
function resolveCivilianTitle(profile: LinkedInFillerProfile, dict: DictionaryCache): string {
  const code = (profile.rating_mos || profile.mos || '').toString().trim()
  const branch = profile.branch || ''
  if (code) {
    const cw = getCivilianJobs(code, branch)
    if (cw?.civilian_titles?.length) return cw.civilian_titles[0]
    const branchKey = branch.toLowerCase().replace(/_/g, ' ')
    const row = (dict.mosToCivilian || []).find(m =>
      m.military_code.toUpperCase().trim() === code.toUpperCase() &&
      (!branchKey || m.branch.toLowerCase().includes(branchKey) || branchKey.includes(m.branch.toLowerCase()))
    )
    if (row?.civilian_titles?.length) return row.civilian_titles[0]
  }
  return profile.targetRole || 'Operations Professional'
}

/**
 * Top LinkedIn keywords for the user: `linkedin_keywords` rows whose
 * military_skill matches one of the user's skills, ranked by priority and
 * industry relevance.
 */
export function topLinkedInKeywords(
  skills: string[],
  targetIndustry: string | null | undefined,
  dict: DictionaryCache,
  limit = 5,
): string[] {
  const skillsLower = skills.map(s => s.toLowerCase())
  const industryLower = (targetIndustry || '').toLowerCase()

  const score = (row: { priority: string | null; industry: string }): number => {
    let s = row.priority === 'high' ? 2 : row.priority === 'medium' ? 1 : 0
    if (industryLower && row.industry?.toLowerCase().includes(industryLower)) s += 2
    return s
  }

  const matched = (dict.linkedinKeywords || [])
    .filter(row => {
      const ms = row.military_skill.toLowerCase()
      return skillsLower.some(s => s.includes(ms) || ms.includes(s))
    })
    .sort((a, b) => score(b) - score(a))

  const out: string[] = []
  const seen = new Set<string>()
  for (const row of matched) {
    for (const kw of row.linkedin_keywords || []) {
      const key = kw.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      out.push(kw)
      if (out.length >= limit) return out
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// Template selection + substitution
// ---------------------------------------------------------------------------

function pickTemplate(
  templates: DictLinkedinTemplate[],
  section: 'headline' | 'about',
  targetRole: string,
  targetIndustry: string,
): DictLinkedinTemplate | null {
  const candidates = (templates || []).filter(t => t.section === section && t.template_text)
  if (candidates.length === 0) return null

  const roleL = targetRole.toLowerCase()
  const indL = targetIndustry.toLowerCase()

  const scored = candidates.map(t => {
    let score = 0
    const tRole = (t.target_role || '').toLowerCase()
    const tInd = (t.target_industry || '').toLowerCase()
    if (roleL && tRole && (tRole.includes(roleL) || roleL.includes(tRole))) score += 3
    if (indL && tInd && (tInd.includes(indL) || indL.includes(tInd))) score += 2
    // Generic templates are a safe fallback for everyone
    if (tInd === 'general') score += 1
    return { t, score }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored[0].t
}

/** Build the placeholder → value map shared by headline and about fills. */
function buildValues(
  profile: LinkedInFillerProfile,
  experiences: LinkedInFillerExperience[],
  dict: DictionaryCache,
): Record<string, string> {
  const skills = (profile.skills || []).filter(Boolean)
  const certs = certNames(profile.certifications)
  const keywords = topLinkedInKeywords(skills, profile.target_industry, dict)
  const civTitle = resolveCivilianTitle(profile, dict)
  const years = profile.years_of_service?.toString() || '10'
  const clearance = formatClearance(profile.clearance)
  const degree = shortDegree(profile.education)
  const targetRole = profile.targetRole || civTitle
  const targetIndustry = profile.target_industry || targetRole

  // key_skill_1..3: user skills first, LinkedIn keywords backfill
  const skillPool = [...skills, ...keywords.filter(k => !skills.some(s => s.toLowerCase() === k.toLowerCase()))]

  // Achievements: prefer metric-bearing experience bullets
  const allBullets = (experiences || []).flatMap(exp => {
    const bullets = exp.experience_bullets ?? exp.bullets ?? exp.achievements ?? []
    return (Array.isArray(bullets) ? bullets : [])
      .map((b) => {
        if (typeof b === 'string') return b
        const obj = b as { translated_text?: string; original_text?: string } | null
        return obj?.translated_text || obj?.original_text || ''
      })
      .filter((b: string) => b.trim().length > 15)
  })
  const metricPattern = /\d{2,}%|\$[\d,.]+[KkMmBb]?|\b\d{2,}\b/
  const achievements = [
    ...allBullets.filter(b => metricPattern.test(b)),
    ...allBullets.filter(b => !metricPattern.test(b)),
  ].slice(0, 3)

  // Experience summary from role titles
  const titles = (experiences || [])
    .map(e => e.civilian_title || e.job_title || e.title || '')
    .filter(Boolean)
    .slice(0, 2)
  const experienceSummary = titles.length > 0
    ? `roles including ${titles.join(' and ')}`
    : `${years} years of ${shortBranch(profile.branch)} service`

  // Team size from paygrade (same brackets used elsewhere in the app)
  let teamSize = ''
  const pg = (profile.paygrade || '').toUpperCase().trim()
  if (/^O-?[7-9]$|^O-?10$/.test(pg)) teamSize = '100+'
  else if (/^O-?[4-6]$/.test(pg) || /^E-?[7-9]$/.test(pg)) teamSize = '50'
  else if (/^O-?[1-3]$/.test(pg)) teamSize = '30'
  else if (/^E-?[4-6]$/.test(pg)) teamSize = '15'

  const skillsList = skillPool.slice(0, 6).join(' • ')
  const location = [profile.city, profile.state].filter(Boolean).join(', ')

  const v: Record<string, string> = {}
  const set = (key: string, val?: string | null) => { if (val) v[key] = val }

  set('civilian_title', civTitle)
  set('years', years)
  set('years_experience', years)
  set('years_of_service', years)
  set('branch', shortBranch(profile.branch))
  set('target_role', targetRole)
  set('target_industry', targetIndustry)
  set('target_location', location)
  set('clearance', clearance)
  set('degree', degree)
  set('certification', certs[0])
  set('certification_1', certs[0])
  set('certification_2', certs[1])
  set('top_cert', certs[0])
  set('certifications', certs.slice(0, 3).join(', '))
  set('specialty', skillPool[0] || keywords[0])
  set('key_skill_1', skillPool[0])
  set('key_skill_2', skillPool[1])
  set('key_skill_3', skillPool[2])
  set('skill_1', skillPool[0])
  set('skill_2', skillPool[1])
  set('skill_3', skillPool[2])
  set('skills_list', skillsList)
  set('skill_list', skillsList)
  set('experience_summary', experienceSummary)
  set('achievement_1', achievements[0])
  set('achievement_2', achievements[1])
  set('achievement_3', achievements[2])
  set('team_size', teamSize)
  set('quantified_result', achievements[0] ? `results like: ${achievements[0]}` : '')
  set('scope', experiences?.length > 1 ? 'multiple operations' : '')

  return v
}

/** Replace {{key}} tokens; leave unknown tokens for the cleanup passes. */
function substitute(text: string, values: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key: string) => values[key] || match)
}

const UNFILLED = /\{\{\w+\}\}/

/**
 * Remove unfilled placeholders from prose without leaving broken grammar:
 * 1. drop "in/at/across/to {{x}}" preposition phrases
 * 2. drop the clause fragment around any remaining token (comma/period bounded)
 * 3. drop bullet/label lines that ended up empty
 */
function cleanUnfilledProse(text: string): string {
  let r = text
  if (UNFILLED.test(r)) {
    r = r.replace(/\s+(?:in|at|across|to|of)\s+\{\{\w+\}\}/gi, '')
    r = r.replace(/,?\s*[^,.;:\n]*\{\{\w+\}\}[^,.;:\n]*/g, '')
    r = r.replace(/\{\{\w+\}\}/g, '')
  }
  // Empty bullets and orphaned "Label:" lines
  r = r.replace(/^\s*[•\-]\s*$/gm, '')
  r = r.replace(/^[A-Za-z &/]+:\s*$/gm, '')
  // A heading line whose bullets were all removed (e.g. "Key accomplishments:")
  r = r.replace(/^([A-Za-z &/]+:)\n+(?![•\-])/gm, '')
  // Punctuation/spacing cleanup
  r = r.replace(/[ \t]{2,}/g, ' ')
  r = r.replace(/ ,/g, ',')
  r = r.replace(/,\s*,/g, ',')
  r = r.replace(/,\s*\./g, '.')
  r = r.replace(/\.\s*\./g, '.')
  r = r.replace(/[ \t]+$/gm, '')
  r = r.replace(/^[ \t]+/gm, '')
  r = r.replace(/\n{3,}/g, '\n\n')
  return r.trim()
}

// ---------------------------------------------------------------------------
// Public fills
// ---------------------------------------------------------------------------

/**
 * Fill the best-matching headline template for this profile.
 * Returns null when the dictionary has no usable headline template or the
 * fill produced nothing substantial (callers fall back to their own builders).
 */
export function fillLinkedInHeadline(
  profile: LinkedInFillerProfile,
  dict: DictionaryCache,
): string | null {
  const targetRole = profile.targetRole || ''
  const targetIndustry = profile.target_industry || targetRole
  const template = pickTemplate(dict.linkedinTemplates || [], 'headline', targetRole, targetIndustry)
  if (!template) return null

  const values = buildValues(profile, [], dict)
  const filled = substitute(template.template_text, values)

  // Headlines are pipe-separated — strip unfilled tokens inside each segment
  // and keep whatever still reads as content ("10+ Years {{specialty}}" → "10+ Years")
  const segments = filled
    .split('|')
    .map(s =>
      s
        .replace(/\{\{\w+\}\}/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim()
        // Leading orphans may include "+" (from a dropped token); trailing "+" is
        // meaningful ("Security+", "10+") so only strip trailing punctuation.
        .replace(/^[+\-–—,.:;\s]+/, '')
        .replace(/[\-–—,.:;\s]+$/, '')
    )
    .filter(s => s.length >= 3 && /[A-Za-z0-9]/.test(s))
  if (segments.length < 2) return null

  const headline = polishHeadline(segments.join(' | '))
  return headline.length >= 10 ? headline : null
}

/**
 * Fill the best-matching About template for this profile + experiences.
 * Returns null when nothing substantial can be produced.
 */
export function fillLinkedInAbout(
  profile: LinkedInFillerProfile,
  experiences: LinkedInFillerExperience[],
  dict: DictionaryCache,
): string | null {
  const targetRole = profile.targetRole || ''
  const targetIndustry = profile.target_industry || targetRole
  const template = pickTemplate(dict.linkedinTemplates || [], 'about', targetRole, targetIndustry)
  if (!template) return null

  const values = buildValues(profile, experiences, dict)
  // Template text stores newlines as literal "\n" sequences
  const text = template.template_text.replace(/\\n/g, '\n')
  const about = cleanUnfilledProse(substitute(text, values))

  // NOTE: polishSummary is intentionally not applied — its sentence-count
  // enforcement would strip the template's bullet/label structure.
  return about.length >= 60 ? about : null
}
