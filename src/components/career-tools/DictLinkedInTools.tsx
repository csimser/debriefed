'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getDictionary } from '@/lib/dictionary/dictionaryQueries'
import { polishHeadline, polishSummary } from '@/lib/dictionary/outputPolisher'
import { personalizeStaticSummary } from '@/lib/populateTemplate'
import type {
  DictProfessionalSummary,
  DictLinkedinKeyword,
  DictAtsKeyword,
  DictMilitaryJargon,
  DictRankEquivalent,
} from '@/lib/dictionary/types'

interface DictLinkedInToolsProps {
  userProfile: any
  skills: string[]
  certifications?: any[]
  education?: any[]
  onBack?: () => void
  onSwitchToAI?: () => void
  aiRemaining?: number
  embedded?: boolean
}

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

/** Format rank_tier for display */
function formatRankTier(tier: string): string {
  const map: Record<string, string> = {
    'junior_enlisted': 'Junior Enlisted',
    'senior_enlisted': 'Senior Enlisted',
    'warrant_officer': 'Warrant Officer',
    'junior_officer': 'Junior Officer',
    'senior_officer': 'Senior Officer',
  }
  return map[tier.toLowerCase()] ?? tier.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
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

export function DictLinkedInTools({
  userProfile,
  skills,
  certifications,
  education,
  onBack,
  onSwitchToAI,
  aiRemaining,
  embedded,
}: DictLinkedInToolsProps) {
  const [activeTab, setActiveTab] = useState<'headline' | 'keywords' | 'summary'>('headline')
  const [summaries, setSummaries] = useState<DictProfessionalSummary[]>([])
  const [linkedinKeywords, setLinkedinKeywords] = useState<DictLinkedinKeyword[]>([])
  const [atsKeywords, setAtsKeywords] = useState<DictAtsKeyword[]>([])
  const [jargon, setJargon] = useState<DictMilitaryJargon[]>([])
  const [rankEquivalents, setRankEquivalents] = useState<DictRankEquivalent[]>([])
  const [loading, setLoading] = useState(true)

  // Headline state
  const [headlines, setHeadlines] = useState<string[]>([])
  const [editingHeadline, setEditingHeadline] = useState<number | null>(null)
  const [editedHeadlineText, setEditedHeadlineText] = useState('')
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  // Keyword checker state
  const [pasteText, setPasteText] = useState('')
  const [keywordResults, setKeywordResults] = useState<{
    found: string[]
    jargonDetected: string[]
    missing: string[]
    score: number
    total: number
  } | null>(null)

  // Summary state
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null)
  const [copiedSummary, setCopiedSummary] = useState(false)

  const rankTier = getRankTier(userProfile?.paygrade)
  const targetIndustry = (userProfile?.target_industry || '').toLowerCase()
  const targetRole = userProfile?.target_role || ''

  useEffect(() => {
    getDictionary().then(dict => {
      setSummaries(dict.professionalSummaries ?? [])
      setLinkedinKeywords(dict.linkedinKeywords ?? [])
      setAtsKeywords(dict.atsKeywords ?? [])
      setJargon(dict.militaryJargon ?? [])
      setRankEquivalents(dict.rankEquivalents ?? [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  // Get civilian title from rank equivalents
  const getCivilianTitle = useCallback(() => {
    if (!userProfile?.paygrade || !userProfile?.branch || rankEquivalents.length === 0) return targetRole || 'Professional'
    const paygrade = (userProfile.paygrade || '').toUpperCase().trim()
    const branch = (userProfile.branch || '').toLowerCase()
    const match = rankEquivalents.find(r =>
      r.paygrade.toUpperCase().trim() === paygrade &&
      r.branch.toLowerCase().includes(branch)
    )
    return match?.civilian_equivalent || targetRole || 'Professional'
  }, [userProfile, rankEquivalents, targetRole])

  // Build headline templates
  useEffect(() => {
    if (loading || summaries.length === 0) return

    const matching = summaries.filter(dt => {
      const tierMatch = !rankTier || dt.rank_tier.toLowerCase() === rankTier
      const industryMatch = !targetIndustry ||
        dt.target_industry.toLowerCase().includes(targetIndustry) ||
        targetIndustry.includes(dt.target_industry.toLowerCase())
      return tierMatch || industryMatch
    }).sort((a, b) => {
      const scoreA = (a.rank_tier.toLowerCase() === rankTier ? 1 : 0) +
        (targetIndustry && a.target_industry.toLowerCase().includes(targetIndustry) ? 1 : 0)
      const scoreB = (b.rank_tier.toLowerCase() === rankTier ? 1 : 0) +
        (targetIndustry && b.target_industry.toLowerCase().includes(targetIndustry) ? 1 : 0)
      return scoreB - scoreA
    })

    const civTitle = getCivilianTitle()
    const topSkill = skills[0] || 'Operations'
    const topCert = certifications?.[0]?.name || certifications?.[0] || ''
    const clearance = userProfile?.clearance && userProfile.clearance !== 'none'
      ? formatClearanceForHeadline(userProfile.clearance)
      : ''
    const industry = userProfile?.target_industry || matching[0]?.target_industry || 'Industry'

    const generatedHeadlines: string[] = []

    // Generate headline variations
    const parts = [civTitle, industry, topSkill, topCert, clearance].filter(Boolean)
    if (parts.length >= 2) {
      generatedHeadlines.push(parts.join(' | '))
    }

    // Shorter variations
    generatedHeadlines.push(`${civTitle} | ${industry} Professional`)
    if (topSkill && topSkill !== civTitle) {
      generatedHeadlines.push(`${civTitle} | ${topSkill} | ${industry}`)
    }
    if (topCert) {
      generatedHeadlines.push(`${civTitle} | ${topCert} | ${industry}`)
    }
    if (clearance) {
      generatedHeadlines.push(`${civTitle} | ${clearance} | ${industry}`)
    }

    // Deduplicate, polish, and limit to 5
    const unique = [...new Set(generatedHeadlines)].map(h => polishHeadline(h)).slice(0, 5)
    setHeadlines(unique)
  }, [loading, summaries, rankTier, targetIndustry, skills, certifications, userProfile, getCivilianTitle])

  // Keyword analysis
  const analyzeKeywords = useCallback(() => {
    if (!pasteText.trim()) return
    const textLower = pasteText.toLowerCase()

    // Check LinkedIn keywords for user's industry
    const matchingLinkedin = linkedinKeywords.filter(lk =>
      !targetIndustry || lk.industry.toLowerCase().includes(targetIndustry)
    )
    const allRecommended = new Set<string>()
    matchingLinkedin.forEach(lk => {
      lk.linkedin_keywords.forEach(kw => allRecommended.add(kw.toLowerCase()))
    })

    // Check ATS keywords for user's industry
    const matchingAts = atsKeywords.filter(ak =>
      !targetIndustry || ak.industry.toLowerCase().includes(targetIndustry)
    )
    matchingAts.forEach(ak => {
      ak.keywords.forEach(kw => allRecommended.add(kw.toLowerCase()))
    })

    // Found keywords
    const found: string[] = []
    const missing: string[] = []
    for (const kw of allRecommended) {
      if (textLower.includes(kw)) {
        found.push(kw)
      } else {
        missing.push(kw)
      }
    }

    // Detect military jargon
    const jargonDetected: string[] = []
    for (const j of jargon) {
      const term = (j.military_term || '').toLowerCase()
      if (term.length >= 3 && textLower.includes(term)) {
        jargonDetected.push(`${j.military_term} → ${j.civilian_equivalent}`)
      }
    }

    setKeywordResults({
      found: found.slice(0, 20),
      jargonDetected: jargonDetected.slice(0, 10),
      missing: missing.slice(0, 15),
      score: found.length,
      total: allRecommended.size,
    })
  }, [pasteText, linkedinKeywords, atsKeywords, jargon, targetIndustry])

  // Build LinkedIn-formatted summaries with proper template filling
  const getLinkedInSummaries = useCallback(() => {
    const matching = summaries.filter(dt => {
      const tierMatch = !rankTier || dt.rank_tier.toLowerCase() === rankTier
      const industryMatch = !targetIndustry ||
        dt.target_industry.toLowerCase().includes(targetIndustry) ||
        targetIndustry.includes(dt.target_industry.toLowerCase())
      return tierMatch || industryMatch
    }).sort((a, b) => {
      const scoreA = (a.rank_tier.toLowerCase() === rankTier ? 1 : 0) +
        (targetIndustry && a.target_industry.toLowerCase().includes(targetIndustry) ? 1 : 0)
      const scoreB = (b.rank_tier.toLowerCase() === rankTier ? 1 : 0) +
        (targetIndustry && b.target_industry.toLowerCase().includes(targetIndustry) ? 1 : 0)
      return scoreB - scoreA
    }).slice(0, 5)

    const civTitle = getCivilianTitle()
    const values = buildLinkedInValues(userProfile, skills, certifications || [], education || [], civTitle, targetRole)

    // Build a ProfileData-compatible object for personalizeStaticSummary
    const profileData = {
      yearsOfService: userProfile?.years_of_service ? parseInt(String(userProfile.years_of_service)) : undefined,
      clearance: userProfile?.clearance,
      certifications: (certifications || []).map((c: any) => c?.name || c).filter(Boolean),
      targetIndustry: userProfile?.target_industry,
      targetRole: targetRole || undefined,
    }

    return matching.map(dt => {
      let text = fillLinkedInTemplate(dt.template_text, values)
      // Personalize static templates with user's actual data
      text = personalizeStaticSummary(text, profileData, civTitle, values['team_size'] || null)
      text = polishSummary(text, { tone: 'conversational', length: 'standard' })
      return {
        id: dt.id,
        name: dt.template_name || `${formatRankTier(dt.rank_tier)} — ${dt.target_industry}`,
        text,
        targetRole: dt.target_role,
        industry: dt.target_industry,
      }
    })
  }, [summaries, rankTier, targetIndustry, targetRole, skills, certifications, education, userProfile, getCivilianTitle])

  const handleCopyHeadline = async (idx: number, text: string) => {
    const { copyToClipboard } = await import('@/lib/clipboard')
    await copyToClipboard(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  const handleCopySummary = async (text: string) => {
    const { copyToClipboard } = await import('@/lib/clipboard')
    await copyToClipboard(text)
    setCopiedSummary(true)
    setTimeout(() => setCopiedSummary(false), 2000)
  }

  if (loading) {
    if (embedded) return null
    return (
      <div className="text-center py-12">
        <p className="text-text-muted animate-pulse">Loading dictionary data...</p>
      </div>
    )
  }

  return (
    <div className={embedded ? "mt-8 pt-8 border-t border-border space-y-6" : "space-y-6"}>
      {/* Header */}
      {!embedded && (
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-gold transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tools
          </button>
          {onSwitchToAI && aiRemaining !== undefined && aiRemaining > 0 && (
            <button
              onClick={onSwitchToAI}
              className="text-xs text-gold hover:text-gold-bright transition-colors"
            >
              Switch to AI LinkedIn ({aiRemaining} remaining)
            </button>
          )}
        </div>
      )}

      {embedded ? (
        <div>
          <h3 className="font-heading text-lg font-bold uppercase tracking-wider mb-1">Free Dictionary Tools</h3>
          <p className="text-text-muted text-sm">Headline builder, keyword checker, and summary templates — available on all plans</p>
        </div>
      ) : (
        <div>
          <h2 className="font-heading text-xl font-bold uppercase tracking-wider mb-1">LinkedIn Optimizer</h2>
          <p className="text-text-muted text-sm">Optimize your LinkedIn profile with industry keywords — free</p>
          <Badge variant="green" className="mt-1">Dictionary — free</Badge>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-bg-tertiary p-1 rounded-lg">
        {(['headline', 'keywords', 'summary'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded transition-colors ${
              activeTab === tab
                ? 'bg-gold text-bg-primary'
                : 'text-text-muted hover:text-text hover:bg-bg-hover'
            }`}
          >
            {tab === 'headline' ? 'Headline Builder' : tab === 'keywords' ? 'Keyword Checker' : 'Summary Templates'}
          </button>
        ))}
      </div>

      {/* Tab 1: Headline Builder */}
      {activeTab === 'headline' && (
        <Card className="p-5">
          <h3 className="font-heading text-sm uppercase tracking-wider text-gold mb-3">LinkedIn Headlines</h3>
          <p className="text-xs text-text-dim mb-4">
            Pick a headline template, customize it, and copy to your LinkedIn profile.
          </p>

          {headlines.length === 0 ? (
            <p className="text-text-dim text-sm">No headline templates available. Update your profile with a target role and industry.</p>
          ) : (
            <div className="space-y-3">
              {headlines.map((headline, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-bg-secondary rounded-lg border border-border group hover:border-gold/30 transition-colors">
                  {editingHeadline === idx ? (
                    <input
                      type="text"
                      value={editedHeadlineText}
                      onChange={(e) => setEditedHeadlineText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const updated = [...headlines]
                          updated[idx] = editedHeadlineText
                          setHeadlines(updated)
                          setEditingHeadline(null)
                        }
                        if (e.key === 'Escape') setEditingHeadline(null)
                      }}
                      autoFocus
                      className="flex-1 bg-bg-primary border border-gold rounded px-2 py-1 text-sm focus:ring-1 focus:ring-gold/25"
                    />
                  ) : (
                    <span className="flex-1 text-sm text-text">{headline}</span>
                  )}
                  <div className="flex gap-1">
                    {editingHeadline === idx ? (
                      <Button
                        size="sm"
                        onClick={() => {
                          const updated = [...headlines]
                          updated[idx] = editedHeadlineText
                          setHeadlines(updated)
                          setEditingHeadline(null)
                        }}
                      >
                        Save
                      </Button>
                    ) : (
                      <>
                        <button
                          onClick={() => { setEditingHeadline(idx); setEditedHeadlineText(headline) }}
                          className="px-2 py-1 text-xs text-text-dim hover:text-text transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleCopyHeadline(idx, headline)}
                          className="px-2 py-1 text-xs bg-gold/20 text-gold rounded hover:bg-gold/30 transition-colors"
                        >
                          {copiedIdx === idx ? 'Copied!' : 'Copy'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Tab 2: Keyword Checker */}
      {activeTab === 'keywords' && (
        <Card className="p-5">
          <h3 className="font-heading text-sm uppercase tracking-wider text-gold mb-3">Keyword Checker</h3>
          <p className="text-xs text-text-dim mb-4">
            Paste your current LinkedIn summary or headline to check for industry keywords.
          </p>

          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Paste your LinkedIn summary or headline here..."
            className="w-full min-h-[120px] px-3 py-2 bg-bg-secondary border border-border rounded text-sm focus:border-gold focus:ring-1 focus:ring-gold/25 transition-all resize-none mb-3"
          />

          <Button onClick={analyzeKeywords} disabled={!pasteText.trim()}>
            Analyze Keywords
          </Button>

          {keywordResults && (
            <div className="mt-4 space-y-4">
              {/* Score */}
              <div className="p-3 bg-bg-secondary rounded-lg border border-border">
                <p className="text-sm font-medium">
                  Your LinkedIn has <span className="text-gold font-bold">{keywordResults.score}</span> of{' '}
                  <span className="font-bold">{keywordResults.total}</span> recommended keywords
                  {targetIndustry ? ` for ${userProfile?.target_industry}` : ''}
                </p>
                <div className="w-full bg-bg-tertiary rounded-full h-2 mt-2">
                  <div
                    className="bg-gold rounded-full h-2 transition-all"
                    style={{ width: `${keywordResults.total > 0 ? Math.min(100, (keywordResults.score / keywordResults.total) * 100) : 0}%` }}
                  />
                </div>
              </div>

              {/* Keywords Found */}
              {keywordResults.found.length > 0 && (
                <div>
                  <p className="text-xs text-status-green font-semibold uppercase tracking-wider mb-2">Keywords Found</p>
                  <div className="flex flex-wrap gap-1.5">
                    {keywordResults.found.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 bg-status-green/15 text-status-green text-xs rounded">{kw}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Military Jargon Detected */}
              {keywordResults.jargonDetected.length > 0 && (
                <div>
                  <p className="text-xs text-status-amber font-semibold uppercase tracking-wider mb-2">Military Jargon Detected — translate these</p>
                  <div className="flex flex-wrap gap-1.5">
                    {keywordResults.jargonDetected.map((j, i) => (
                      <span key={i} className="px-2 py-0.5 bg-status-amber/15 text-status-amber text-xs rounded">{j}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Keywords */}
              {keywordResults.missing.length > 0 && (
                <div>
                  <p className="text-xs text-text-dim font-semibold uppercase tracking-wider mb-2">Missing High-Value Keywords</p>
                  <div className="flex flex-wrap gap-1.5">
                    {keywordResults.missing.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 bg-bg-tertiary text-text-dim text-xs rounded border border-border">{kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Tab 3: Summary Templates */}
      {activeTab === 'summary' && (
        <Card className="p-5">
          <h3 className="font-heading text-sm uppercase tracking-wider text-gold mb-3">LinkedIn Summary Templates</h3>
          <p className="text-xs text-text-dim mb-4">
            Pre-filled summary templates formatted for LinkedIn. Click to preview, then copy.
          </p>

          {getLinkedInSummaries().length === 0 ? (
            <p className="text-text-dim text-sm">No matching summary templates found. Update your profile with a target role and industry.</p>
          ) : (
            <div className="space-y-3">
              {getLinkedInSummaries().map((s) => (
                <div key={s.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedSummary(selectedSummary === s.id ? null : s.id)}
                    className="w-full text-left p-3 bg-bg-secondary rounded-lg border border-border hover:border-gold/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-text">{s.name}</span>
                      <span className="text-xs text-text-dim">{s.industry}</span>
                    </div>
                    <p className="text-xs text-text-muted line-clamp-2">{s.text.substring(0, 120)}...</p>
                  </button>

                  {selectedSummary === s.id && (
                    <div className="mt-2 p-4 bg-bg-tertiary rounded-lg border border-gold/20">
                      <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">{s.text}</p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleCopySummary(s.text)}
                          className="px-3 py-1.5 text-xs bg-gold text-bg-primary rounded font-semibold hover:bg-gold-bright transition-colors"
                        >
                          {copiedSummary ? 'Copied!' : 'Copy to Clipboard'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
