// linkedInUtils.ts — Pure utility functions for LinkedIn content generation

/** Derive rank_tier from paygrade for dictionary matching */
// Values must match DB seed data: junior_enlisted, senior_enlisted, junior_officer, senior_officer, warrant_officer
export function getRankTier(paygrade?: string): string | null {
  if (!paygrade) return null
  const pg = paygrade.toUpperCase().trim()
  if (/^E-?[1-4]$/.test(pg)) return 'junior_enlisted'
  if (/^E-?[5-9]$/.test(pg)) return 'senior_enlisted'
  if (/^(W-?[1-5]|CW[1-5])$/.test(pg)) return 'warrant_officer'
  if (/^O-?[1-3]$/.test(pg)) return 'junior_officer'
  if (/^O-?[4-9]|O-?10$/.test(pg)) return 'senior_officer'
  return null
}

/** Format clearance for headline display: "secret" → "Secret Clearance" */
export function formatClearanceForHeadline(raw: string): string {
  const cl = raw.toLowerCase().replace(/[-_]/g, '/')
  if (/ts.?sci/.test(cl)) return 'TS/SCI Clearance'
  if (/top.?secret/.test(cl)) return 'Top Secret Clearance'
  if (cl === 'secret') return 'Secret Clearance'
  if (cl === 'confidential') return 'Confidential Clearance'
  return raw.charAt(0).toUpperCase() + raw.slice(1) + ' Clearance'
}

/** Words that are industries/fields, not titles — need a role word appended */
const INDUSTRY_WORDS = new Set([
  'cybersecurity', 'logistics', 'operations', 'intelligence', 'communications',
  'maintenance', 'supply chain', 'finance', 'healthcare', 'engineering',
  'technology', 'information technology', 'it', 'human resources', 'hr',
  'aviation', 'transportation', 'construction', 'manufacturing', 'education',
  'training', 'administration', 'security', 'defense', 'consulting',
])

/** Role suffixes by rank tier */
const ROLE_SUFFIXES: Record<string, string[]> = {
  'junior_enlisted':['Professional', 'Associate', 'Specialist'],
  'senior_enlisted':['Manager', 'Director', 'Senior Leader'],
  'warrant_officer':['Technical Manager', 'Subject Matter Expert', 'Specialist'],
  'junior_officer': ['Manager', 'Analyst', 'Leader'],
  'senior_officer': ['Director', 'Executive', 'Senior Manager'],
}

/**
 * Ensure a target role reads as a proper job title, not just an industry word.
 * "Cybersecurity" → "Cybersecurity Manager" (based on rank tier)
 * "Project Manager" → "Project Manager" (already a title)
 */
export function ensureProperTitle(role: string, rankTier: string | null): string {
  if (!role) return 'Professional'
  const roleLower = role.toLowerCase().trim()
  // Already has a title-like suffix
  if (/\b(manager|director|analyst|specialist|engineer|leader|executive|officer|administrator|coordinator|technician|consultant|architect|professional|associate|supervisor)\b/i.test(role)) {
    return role
  }
  // It's just an industry word — append a role suffix
  if (INDUSTRY_WORDS.has(roleLower) || INDUSTRY_WORDS.has(roleLower.replace(/\//g, ' '))) {
    const suffixes = ROLE_SUFFIXES[rankTier || 'senior_enlisted'] || ROLE_SUFFIXES['senior_enlisted']
    return `${role} ${suffixes[0]}`
  }
  return role
}

/** Title Case a pipe-separated headline, preserving acronyms and special tokens */
export function titleCaseHeadline(headline: string): string {
  const SMALL_WORDS = new Set(['a', 'an', 'the', 'and', 'or', 'in', 'of', 'to', 'for', 'with', 'at', 'by', 'from'])
  return headline.replace(/[^|→]+/g, segment => {
    return segment.trim().split(/\s+/).map((word, i) => {
      if (!word) return word
      // Preserve all-caps acronyms (PMP, IT, TS/SCI)
      if (/^[A-Z][A-Z/]{1,}$/.test(word)) return word
      // Preserve special chars like ® and words with them
      if (/[®™]/.test(word)) return word
      // Preserve numbers with suffixes (10+, 20+)
      if (/^\d/.test(word)) return word
      // Small words not at start of segment
      if (i > 0 && SMALL_WORDS.has(word.toLowerCase())) return word.toLowerCase()
      // Capitalize first letter
      return word.charAt(0).toUpperCase() + word.slice(1)
    }).join(' ')
  }).replace(/\s*\|\s*/g, ' | ').replace(/\s*→\s*/g, ' → ')
    // Fix spaces around slashes in "Technology / IT" → "Technology/IT"
    .replace(/\s+\/\s+/g, '/')
}

/**
 * Sort skills for headline use: hard skills first, deduped against certs,
 * emphasis-boosted, industry-keyword-boosted.
 */
export function smartSkillSort(
  skills: string[],
  emphasis: string[],
  certs: string[],
  atsKeywords: string[],
): string[] {
  if (skills.length === 0) return ['Strategic Planning', 'Process Improvement', 'Team Leadership']

  const certLower = certs.map(c => c.toLowerCase())
  const emphasisLower = emphasis.map(e => e.toLowerCase())
  const atsLower = new Set(atsKeywords.map(k => k.toLowerCase()))

  // Hard skill indicators (technical/tool/framework keywords)
  const HARD_SKILL_PATTERNS = /\b(python|java|aws|azure|cloud|sql|cisco|network|linux|sap|scrum|agile|devops|cyber|secur|data|analyt|engineer|program|project|pmp|itil|six sigma|lean|budget|financ|compl|risk|audit)\b/i

  return [...skills]
    .filter(s => {
      // Remove if it's essentially a cert name already (e.g., "PMP" when PMP cert exists)
      const sl = s.toLowerCase()
      return !certLower.some(c => c.includes(sl) || sl.includes(c))
    })
    .sort((a, b) => {
      let scoreA = 0, scoreB = 0
      const al = a.toLowerCase(), bl = b.toLowerCase()
      // Emphasis boost (+3)
      if (emphasisLower.some(em => al.includes(em) || em.includes(al))) scoreA += 3
      if (emphasisLower.some(em => bl.includes(em) || em.includes(bl))) scoreB += 3
      // ATS keyword match (+2)
      if (atsLower.has(al)) scoreA += 2
      if (atsLower.has(bl)) scoreB += 2
      // Hard skill boost (+1)
      if (HARD_SKILL_PATTERNS.test(a)) scoreA += 1
      if (HARD_SKILL_PATTERNS.test(b)) scoreB += 1
      return scoreB - scoreA
    })
}

/** Smart fallbacks for template placeholders */
export const LINKEDIN_FALLBACKS: Record<string, string> = {
  'team_size': 'cross-functional teams',
  'num_personnel': 'multiple teams',
  'budget': 'multi-million-dollar budgets',
  'budget_amount': 'departmental budgets',
  'your value': 'significant organizational resources',
  'num_products': 'numerous',
  'num_systems': 'multiple',
  'num_projects': 'multiple',
  'key_strength': 'operational excellence',
  'key_achievement': 'delivering measurable results',
  'quantified_result': 'measurable organizational impact',
  'value': 'significant resources',
  'adoption_scope': 'organization-wide',
  'industry_framing': 'translating complex operational experience into business impact',
  'company_name': 'the organization',
  'years_experience': '10+',
  'years_of_service': '10+',
}

/** Build template values map from profile data */
export function buildLinkedInValues(
  profile: any,
  skills: string[],
  certifications: any[],
  education: any[],
  civTitle: string,
  targetRole: string,
): Record<string, string> {
  const v: Record<string, string> = {}

  // Core fields
  if (civTitle) v['civilian_title'] = civTitle
  v['years'] = profile?.years_of_service?.toString() || '10+'
  v['years_experience'] = v['years']
  v['years_of_service'] = v['years']
  if (targetRole) v['target_role'] = targetRole
  if (profile?.target_industry) v['target_industry'] = profile.target_industry

  // Skills
  const s = skills.length > 0 ? skills : ['strategic planning', 'process improvement', 'team leadership']
  if (s[0]) { v['skill_1'] = s[0]; v['key_skill_1'] = s[0]; v['top_skill'] = s[0]; v['technical_skill'] = s[0]; v['technical_skill_1'] = s[0] }
  if (s[1]) { v['skill_2'] = s[1]; v['key_skill_2'] = s[1]; v['technical_skill_2'] = s[1] }
  if (s[2]) { v['skill_3'] = s[2]; v['key_skill_3'] = s[2] }
  v['key_skills'] = s.slice(0, 3).join(', ')
  v['matched_skills'] = s.slice(0, 3).join(', ')

  // Certifications
  const certs = certifications?.map((c: any) => c?.name || c).filter(Boolean) || []
  if (certs[0]) v['certification_1'] = certs[0]
  if (certs[1]) v['certification_2'] = certs[1]
  if (certs[2]) v['certification_3'] = certs[2]
  if (certs.length > 0) {
    v['certifications'] = certs.length === 1 ? certs[0] : certs.slice(0, 3).join(', ')
    v['certification_statement'] = `${certs.join(', ')} certified`
  }

  // Education
  const edu = education?.length > 0 ? education : (profile?.education || [])
  if (edu.length > 0) {
    const degree = edu[0]?.degree || edu[0]?.degree_type || ''
    const field = edu[0]?.field_of_study || edu[0]?.field || ''
    if (degree) {
      let formatted = degree.trim()
      if (/^(bachelor|master)s?'?s?$/i.test(formatted)) {
        formatted = formatted.replace(/'?s?$/i, "'s")
      }
      v['degree'] = field ? `a ${formatted} degree in ${field}` : `a ${formatted} degree`
    }
    if (field) {
      v['field'] = field
      v['field_of_study'] = field
      v['analysis_area'] = field
      v['specialized_area'] = field
    }
  }

  // Rank-based team size
  if (profile?.paygrade) {
    const pg = (profile.paygrade || '').toUpperCase().trim()
    if (/^O-?[7-9]$|^O-?10$/.test(pg)) {
      v['team_size'] = '100+'; v['num_personnel'] = '100+'
    } else if (/^O-?[4-6]$/.test(pg) || /^E-?[7-9]$/.test(pg)) {
      v['team_size'] = '15-50'; v['num_personnel'] = '15-50'
    } else if (/^O-?[1-3]$/.test(pg)) {
      v['team_size'] = '10-30'; v['num_personnel'] = '10-30'
    } else if (/^E-?[4-6]$/.test(pg)) {
      v['team_size'] = '5-15'; v['num_personnel'] = '5-15'
    }
  }

  // Clearance
  if (profile?.clearance && profile.clearance !== 'none') {
    const cl = formatClearanceForHeadline(profile.clearance)
    v['clearance'] = cl
    v['clearance_level'] = cl
    v['clearance_statement'] = `Holds active ${cl}.`
  }

  // Branch
  if (profile?.branch) {
    const branchMap: Record<string, string> = {
      'navy': 'U.S. Navy', 'army': 'U.S. Army', 'air_force': 'U.S. Air Force',
      'marines': 'U.S. Marine Corps', 'coast_guard': 'U.S. Coast Guard', 'space_force': 'U.S. Space Force',
    }
    v['branch'] = branchMap[profile.branch.toLowerCase()] || profile.branch
    v['military_branch'] = v['branch']
  }

  // Name
  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ')
  if (fullName) v['applicant_name'] = fullName

  return v
}

/** Fill template with values, fallbacks, and clause removal */
export function fillLinkedInTemplate(text: string, values: Record<string, string>): string {
  // Pass 1: Fill from values
  let result = text.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    return values[key] || match
  })

  // Pass 2: Smart fallbacks
  result = result.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    if (LINKEDIN_FALLBACKS[key]) return LINKEDIN_FALLBACKS[key]
    if (key === 'analysis_area' || key === 'specialized_area' || key === 'field' || key === 'field_of_study') {
      return values['target_industry'] || values['target_role'] || 'operations and program management'
    }
    if (/^(skill_\d|key_skill_\d|technical_skill_\d?|top_skill|matched_skills)$/.test(key)) {
      const sfb = ['strategic planning', 'process improvement', 'team leadership']
      const idx = parseInt(key.replace(/\D/g, '') || '1') - 1
      return sfb[Math.min(idx, sfb.length - 1)]
    }
    return match
  })

  // Pass 3: Remove clauses containing remaining {{...}}
  result = result.replace(/,?\s*[^,.;]*\{\{\w+\}\}[^,.;]*[,.]?/g, '')
  result = result.replace(/,?\s*[^,.;]*\[[^\]]+\][^,.;]*[,.]?/g, '')

  // Cleanup formatting artifacts
  result = result.replace(/\s+,/g, ',')
  result = result.replace(/\s+\./g, '.')
  result = result.replace(/,\s*,/g, ',')
  result = result.replace(/,\s*\./g, '.')
  result = result.replace(/\s{2,}/g, ' ')
  return result.trim()
}
