'use client'

import { useState, useEffect } from 'react'
import { SUMMARY_TEMPLATES, TEMPLATE_CATEGORIES, getTemplatesByCategory, SummaryTemplate } from '@/lib/summaryTemplates'
import { populateTemplate, cleanTemplateOutput, personalizeStaticSummary, ProfileData } from '@/lib/populateTemplate'
import { getDictionary } from '@/lib/dictionary/dictionaryQueries'
import { polishSummary } from '@/lib/dictionary/outputPolisher'
import type { DictProfessionalSummary, DictRankEquivalent } from '@/lib/dictionary/types'
import { getUserTier, isPaidTier } from '@/lib/tier-utils'
import { UpgradeLink } from '@/components/modals/UpgradeModal'

interface ProfessionalSummaryEditorProps {
  value: string
  onChange: (value: string) => void
  profile: ProfileData
  userPlan?: string
}

export function ProfessionalSummaryEditor({ value, onChange, profile, userPlan }: ProfessionalSummaryEditorProps) {
  const isFree = !isPaidTier(getUserTier({ tier: userPlan }))
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [summarySource, setSummarySource] = useState<'dictionary' | 'ai' | null>(null)
  const [dictTemplates, setDictTemplates] = useState<DictProfessionalSummary[]>([])
  const [rankEquivalents, setRankEquivalents] = useState<DictRankEquivalent[]>([])
  const [templateFallbacks, setTemplateFallbacks] = useState<string[]>([])

  // Load dictionary templates and rank equivalents on mount
  useEffect(() => {
    getDictionary().then(dict => {
      setDictTemplates(dict.professionalSummaries ?? [])
      setRankEquivalents(dict.rankEquivalents ?? [])
    }).catch(() => {})
  }, [])

  // Get civilian equivalent title from dict_rank_equivalents
  const getCivilianTitle = (): string | null => {
    if (!profile?.paygrade || !profile?.branch || rankEquivalents.length === 0) return null
    const paygrade = (profile.paygrade || '').toUpperCase().trim()
    const branch = (profile.branch || '').toLowerCase()
    const match = rankEquivalents.find(r =>
      r.paygrade.toUpperCase().trim() === paygrade &&
      r.branch.toLowerCase().includes(branch)
    )
    return match?.civilian_equivalent ?? null
  }

  // Get typical team size from rank equivalents
  const getTeamSizeFromRankEquivs = (): string | null => {
    if (!profile?.paygrade || !profile?.branch || rankEquivalents.length === 0) return null
    const paygrade = (profile.paygrade || '').toUpperCase().trim()
    const branch = (profile.branch || '').toLowerCase()
    const match = rankEquivalents.find(r =>
      r.paygrade.toUpperCase().trim() === paygrade &&
      r.branch.toLowerCase().includes(branch)
    )
    return match?.typical_team_size ?? null
  }

  // Derive rank_tier from paygrade for dictionary template matching
  // Values must match DB seed data: junior_enlisted, senior_enlisted, junior_officer, senior_officer, warrant_officer
  const getRankTier = (): string | null => {
    if (!profile?.paygrade) return null
    const pg = profile.paygrade.toUpperCase().trim()
    if (/^E-?[1-4]$/.test(pg)) return 'junior_enlisted'
    if (/^E-?[5-9]$/.test(pg)) return 'senior_enlisted'
    if (/^(W-?[1-5]|CW[1-5])$/.test(pg)) return 'warrant_officer'
    if (/^O-?[1-3]$/.test(pg)) return 'junior_officer'
    if (/^O-?[4-9]|O-?10$/.test(pg)) return 'senior_officer'
    return null
  }

  // Build merged template list: dictionary templates first, then hardcoded
  const buildMergedTemplates = (): (SummaryTemplate & { isDictionary?: boolean })[] => {
    const hardcoded = getTemplatesByCategory(selectedCategory)
    const rankTier = getRankTier()
    const targetIndustry = (profile?.targetIndustry || '').toLowerCase()

    const matchingDict = dictTemplates.filter(dt => {
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

    const dictAsSummary: (SummaryTemplate & { isDictionary: boolean })[] = matchingDict.map(dt => ({
      id: `dict-${dt.id}`,
      name: dt.template_name || `${formatRankTier(dt.rank_tier)} — ${dt.target_industry}`,
      category: 'general' as const,
      description: dt.target_role
        ? `For ${formatRankTier(dt.rank_tier)} targeting ${dt.target_role} in ${dt.target_industry}`
        : `Dictionary template for ${formatRankTier(dt.rank_tier)} targeting ${dt.target_industry}`,
      template: dt.template_text,
      isDictionary: true,
    }))

    return [...dictAsSummary, ...hardcoded.map(t => ({ ...t, isDictionary: false }))]
  }

  const filteredTemplates = buildMergedTemplates()

  const handleSelectTemplate = (template: SummaryTemplate & { isDictionary?: boolean }) => {
    let text = template.template
    let fallbacks: string[] = []

    if (profile) {
      const civilianTitle = getCivilianTitle()
      const teamSize = getTeamSizeFromRankEquivs()

      if (template.isDictionary) {
        // Dict templates: first try placeholder fill, then personalize static text
        const result = populateDictTemplate(text, profile, civilianTitle, teamSize)
        text = result.text
        fallbacks = result.fallbacks
        // If the text is still mostly static (no placeholders were filled),
        // apply the personalization layer to inject user data via pattern matching
        text = personalizeStaticSummary(text, profile, civilianTitle, teamSize)
      }

      const enhancedProfile = civilianTitle
        ? { ...profile, mosTitle: civilianTitle }
        : profile
      text = populateTemplate(text, enhancedProfile)
      text = cleanTemplateOutput(text)
      text = polishSummary(text, { tone: 'professional', length: 'standard' })
      onChange(text)
    } else {
      onChange(polishSummary(cleanTemplateOutput(text), { tone: 'professional', length: 'standard' }))
    }
    setTemplateFallbacks(fallbacks)
    setSummarySource(template.isDictionary ? 'dictionary' : null)
  }

  const handleEnhanceWithAI = async () => {
    if (!value.trim()) return

    setIsEnhancing(true)
    try {
      const res = await fetch('/api/enhance-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: value, profile })
      })

      if (!res.ok) {
        throw new Error('Enhancement failed')
      }

      const { enhanced } = await res.json()
      if (enhanced) {
        onChange(enhanced)
        setSummarySource('ai')
      }
    } catch (error) {
      console.error('Enhancement failed:', error)
      alert('Failed to enhance summary. Please try again.')
    } finally {
      setIsEnhancing(false)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-2">
        Professional Summary
        {summarySource === 'dictionary' && (
          <span className="text-[10px] px-1.5 py-0.5 bg-status-green/20 text-status-green rounded normal-case tracking-normal font-normal">
            Dictionary template
          </span>
        )}
        {summarySource === 'ai' && (
          <span className="text-[10px] px-1.5 py-0.5 bg-status-amber/20 text-status-amber rounded normal-case tracking-normal font-normal">
            AI enhanced
          </span>
        )}
      </label>

      <textarea
        value={value}
        onChange={(e) => { onChange(e.target.value); setSummarySource(null); setTemplateFallbacks([]) }}
        placeholder="Write a brief professional summary or choose a template below..."
        className="w-full min-h-[150px] px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25 transition-all resize-none"
        autoComplete="off"
      />

      {templateFallbacks.length > 0 && (
        <p className="text-xs text-gold">
          Some placeholder text was filled with generic values. Review your summary and customize as needed.
        </p>
      )}

      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-text-dim">This summary will pre-fill when you create new resumes</p>

        <div className="flex items-center gap-2">
          {/* Template Button - Primary Action */}
          <button
            type="button"
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary hover:bg-bg-hover border border-border text-text font-semibold rounded text-sm transition-colors"
          >
            <span>&#128203;</span>
            {showTemplates ? 'Hide Templates' : 'Choose Template'}
          </button>

          {/* Enhance Button - Secondary/Fallback (paid only) */}
          {isFree ? (
            <span className="text-xs text-text-dim">
              <UpgradeLink className="text-gold hover:text-gold-bright hover:underline">Upgrade to Core</UpgradeLink>
              {' '}for AI enhancement
            </span>
          ) : (
            <button
              type="button"
              onClick={handleEnhanceWithAI}
              disabled={isEnhancing || !value.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-gold/20 hover:bg-gold/30 border border-gold/50 disabled:bg-bg-tertiary disabled:border-border disabled:cursor-not-allowed text-gold disabled:text-text-dim font-semibold rounded text-sm transition-colors"
            >
              {isEnhancing ? (
                <>
                  <span className="animate-spin">&#8635;</span>
                  Enhancing...
                </>
              ) : (
                <>
                  <span>&#10024;</span>
                  Enhance
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Template Selector Panel */}
      {showTemplates && (
        <div className="border border-border rounded-lg bg-bg-card overflow-hidden">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 p-2 bg-bg-tertiary border-b border-border">
            {TEMPLATE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-gold text-bg-primary'
                    : 'bg-bg-secondary text-text-muted hover:bg-bg-hover hover:text-text'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Template List */}
          <div className="max-h-64 overflow-y-auto p-2 space-y-2">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => handleSelectTemplate(template)}
                className="w-full text-left p-3 rounded-lg bg-bg-tertiary hover:bg-bg-hover border border-border hover:border-gold/50 transition-colors group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-text group-hover:text-gold">
                    {template.name}
                  </span>
                  <div className="flex items-center gap-1">
                    {template.isDictionary && (
                      <span className="text-xs px-2 py-0.5 bg-status-green/20 text-status-green rounded">
                        Free
                      </span>
                    )}
                    <span className="text-xs px-2 py-0.5 bg-bg-secondary text-text-dim rounded">
                      {template.isDictionary ? 'Dictionary' : template.category}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-text-dim">{template.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/** Format rank_tier for display: "senior_nco" → "Senior NCO" */
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

/** Smart fallback values for placeholders when user data is missing */
const PLACEHOLDER_FALLBACKS: Record<string, string> = {
  'team_size': 'cross-functional teams',
  'your team size': 'cross-functional teams',
  'num_personnel': 'multiple teams',
  'budget': 'multi-million-dollar budgets',
  'dollar_amount': 'significant budgets',
  'budget_amount': 'departmental budgets',
  'analysis_area': '',
  'field': '',
  'field_of_study': '',
  'num_products': 'numerous',
  'num_systems': 'multiple',
  'num_projects': 'multiple',
  'percentage': 'measurable',
  'adoption_scope': 'organization-wide',
  'key_achievement': 'delivering measurable results',
  'key_strength': 'operational excellence',
  'company_name': 'the organization',
  'grade_level': 'target grade',
  'series': 'target series',
}

interface DictTemplateResult {
  text: string
  fallbacks: string[]
}

/**
 * Populate dictionary template placeholders from profile data.
 * Returns filled text AND a list of fallback strings used (for UI highlighting).
 */
function populateDictTemplate(
  template: string,
  profile: ProfileData,
  civilianTitle: string | null,
  teamSizeFromRank?: string | null,
): DictTemplateResult {
  let result = template
  const fallbacksUsed: string[] = []

  const fill = (value: string | undefined | null, fallback: string): string => {
    if (value) return value
    if (fallback) fallbacksUsed.push(fallback)
    return fallback
  }

  const userSkills = profile.skills ?? []
  const certs = profile.certifications ?? []
  const edu = profile.education ?? []
  const topDegree = edu[0]?.degree || ''
  const topField = edu[0]?.field || ''
  const specializedArea = topField || profile.targetIndustry || profile.targetRole || ''

  // Core fields
  result = result.replace(/\{\{civilian_title\}\}/g, fill(civilianTitle || profile.targetRole, 'operations leadership'))
  result = result.replace(/\{\{years\}\}/g, fill(profile.yearsOfService?.toString(), '10+'))
  result = result.replace(/\{\{team_size\}\}/g, fill(teamSizeFromRank || profile.teamSize?.toString(), 'cross-functional teams'))
  result = result.replace(/\{\{target_role\}\}/g, fill(profile.targetRole, 'leadership'))
  result = result.replace(/\{\{target_industry\}\}/g, fill(profile.targetIndustry, 'the private sector'))

  // Clearance
  if (profile.clearance && profile.clearance !== 'none' && profile.clearance !== '') {
    const clearanceDisplay = profile.clearance.replace(/_/g, '/').replace(/-/g, '/').replace(/\bts\b/gi, 'TS').replace(/\bsci\b/gi, 'SCI').replace(/\btop\b/gi, 'Top').replace(/\bsecret\b/gi, 'Secret')
    result = result.replace(/\{\{clearance\}\}/g, clearanceDisplay)
  } else {
    result = result.replace(/\{\{clearance\}\}\s*security\s*clearance\.?\s*/gi, '')
    result = result.replace(/\{\{clearance\}\}/g, '')
  }

  // Certifications
  result = result.replace(/\{\{certification\}\}/g, fill(certs[0], 'industry certification'))
  result = result.replace(/\{\{cert_1\}\}/g, fill(certs[0], 'industry certification'))
  result = result.replace(/\{\{cert_2\}\}/g, certs[1] || '')

  // Skills — from user's actual skills, NEVER target_role
  result = result.replace(/\{\{skill_1\}\}/g, fill(userSkills[0], 'strategic planning'))
  result = result.replace(/\{\{skill_2\}\}/g, fill(userSkills[1], 'process improvement'))
  result = result.replace(/\{\{skill_3\}\}/g, fill(userSkills[2], 'team leadership'))

  // Education
  result = result.replace(/\{\{degree\}\}/g, fill(topDegree, 'advanced degree'))
  result = result.replace(/\{\{field\}\}/g, fill(topField, specializedArea || 'operations and program management'))
  result = result.replace(/\{\{field_of_study\}\}/g, fill(topField, specializedArea || 'operations and program management'))
  result = result.replace(/\{\{analysis_area\}\}/g, fill(specializedArea, 'operations and program management'))

  // Metrics — smart generic text
  result = result.replace(/\{\{num_products\}\}/g, fill(null, 'numerous'))
  result = result.replace(/\{\{num_systems\}\}/g, fill(null, 'multiple'))
  result = result.replace(/\{\{budget\}\}/g, fill(null, 'multi-million-dollar budgets'))
  result = result.replace(/\{\{dollar_amount\}\}/g, fill(null, 'significant budgets'))
  result = result.replace(/\{\{key_achievement\}\}/g, fill(null, 'delivering measurable results'))
  result = result.replace(/\{\{company_name\}\}/g, fill(null, 'the organization'))
  result = result.replace(/\{\{key_strength\}\}/g, fill(profile.specialty, 'operational excellence'))

  // Bracket-style placeholders
  result = result.replace(/\[team size\]/gi, fill(teamSizeFromRank, 'cross-functional teams'))
  result = result.replace(/\[budget amount\]/gi, fill(null, 'multi-million-dollar budgets'))
  result = result.replace(/\[degree\]/gi, fill(topDegree, 'advanced degree'))
  let skillIdx = 0
  result = result.replace(/\[key skill\]/gi, () => {
    return fill(userSkills[skillIdx++], skillIdx <= 1 ? 'strategic planning' : 'process improvement')
  })
  result = result.replace(/\[certification\]/gi, fill(certs[0], 'industry certification'))
  result = result.replace(/\[your team size\]/gi, fill(teamSizeFromRank, 'cross-functional teams'))
  result = result.replace(/\[your key skill\]/gi, () => {
    return fill(userSkills[skillIdx++], 'cross-functional leadership')
  })
  result = result.replace(/\[your certification\]/gi, fill(certs[0], 'industry certification'))
  result = result.replace(/\[your degree\]/gi, fill(topDegree, 'advanced degree'))
  result = result.replace(/\[your field of study\]/gi, fill(topField, specializedArea || 'operations and program management'))
  result = result.replace(/\[your area of expertise\]/gi, fill(specializedArea, 'operations and program management'))

  // Catch-all for remaining {{placeholder}}
  result = result.replace(/\{\{(\w+)\}\}/g, (_, field) => {
    const key = field.toLowerCase()
    const fb = PLACEHOLDER_FALLBACKS[key]
    if (fb !== undefined) {
      if (fb === '') return ''
      fallbacksUsed.push(fb)
      return fb
    }
    const generic = `${field.replace(/_/g, ' ')}`
    fallbacksUsed.push(generic)
    return generic
  })

  // Catch remaining [bracket placeholders]
  result = result.replace(/\[([^\]]+)\]/g, (match, inner) => {
    const key = inner.toLowerCase()
    const fb = PLACEHOLDER_FALLBACKS[key]
    if (fb !== undefined) {
      if (fb === '') return ''
      fallbacksUsed.push(fb)
      return fb
    }
    fallbacksUsed.push(inner)
    return inner
  })

  // Formatting cleanup
  result = result.replace(/\s*and\s*\[\]\s*/g, ' ')
  result = result.replace(/\s+,/g, ',')
  result = result.replace(/\s+\./g, '.')
  result = result.replace(/,\s*,/g, ',')
  result = result.replace(/\s{2,}/g, ' ')
  result = result.replace(/,\s*and\s*,/g, ',')
  result = result.replace(/,\s*and\s*\./g, '.')

  return { text: result.trim(), fallbacks: [...new Set(fallbacksUsed)] }
}
