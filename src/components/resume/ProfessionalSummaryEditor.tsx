'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SUMMARY_TEMPLATES, TEMPLATE_CATEGORIES, getTemplatesByCategory, SummaryTemplate } from '@/lib/summaryTemplates'
import { populateTemplate, cleanTemplateOutput, personalizeStaticSummary, ProfileData } from '@/lib/populateTemplate'
import { polishSummary } from '@/lib/dictionary/outputPolisher'
import { getDictionary } from '@/lib/dictionary/dictionaryQueries'
import type { DictProfessionalSummary, DictRankEquivalent } from '@/lib/dictionary/types'
import { getUserTier, isPaidTier } from '@/lib/tier-utils'
import { UpgradeLink } from '@/components/modals/UpgradeModal'

interface ProfessionalSummaryEditorProps {
  resumeId: string
  summary: string
  profileSummary?: string
  profile?: ProfileData
  onUpdate: (summary: string) => void
  userPlan?: string
  targetIndustry?: string
  targetRole?: string
}

const MAX_CHARS = 1500
const RECOMMENDED_MIN = 200
const RECOMMENDED_MAX = 500

export function ProfessionalSummaryEditor({
  resumeId,
  summary,
  profileSummary,
  profile,
  onUpdate,
  userPlan,
  targetIndustry,
  targetRole
}: ProfessionalSummaryEditorProps) {
  const isFree = !isPaidTier(getUserTier({ tier: userPlan }))
  const [isEditing, setIsEditing] = useState(false)
  const [editedSummary, setEditedSummary] = useState(summary || profileSummary || '')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [summarySource, setSummarySource] = useState<'dictionary' | 'ai' | null>(null)
  const [dictTemplates, setDictTemplates] = useState<DictProfessionalSummary[]>([])
  const [rankEquivalents, setRankEquivalents] = useState<DictRankEquivalent[]>([])
  const [templateFallbacks, setTemplateFallbacks] = useState<string[]>([])
  const [editingFallback, setEditingFallback] = useState<string | null>(null)
  const [editingFallbackValue, setEditingFallbackValue] = useState('')
  const supabase = createClient()

  // Load dictionary templates and rank equivalents
  useEffect(() => {
    getDictionary().then(dict => {
      setDictTemplates(dict.professionalSummaries ?? [])
      setRankEquivalents(dict.rankEquivalents ?? [])
    }).catch(() => {})
  }, [])

  // Update local state when summary prop changes
  useEffect(() => {
    setEditedSummary(summary || profileSummary || '')
  }, [summary, profileSummary])

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

  // Build merged template list: dictionary templates + hardcoded templates
  const buildMergedTemplates = (): (SummaryTemplate & { isDictionary?: boolean })[] => {
    const hardcoded = getTemplatesByCategory(selectedCategory)
    const rankTier = getRankTier()
    const industryFilter = (targetIndustry || profile?.targetIndustry || '').toLowerCase()

    // Filter dictionary templates by rank_tier and/or target_industry
    const matchingDict = dictTemplates.filter(dt => {
      const tierMatch = !rankTier || dt.rank_tier.toLowerCase() === rankTier
      const industryMatch = !industryFilter ||
        dt.target_industry.toLowerCase().includes(industryFilter) ||
        industryFilter.includes(dt.target_industry.toLowerCase())
      // Show if either matches; prioritize both-match templates
      return tierMatch || industryMatch
    }).sort((a, b) => {
      // Score: 2 = both match, 1 = one matches
      const scoreA = (a.rank_tier.toLowerCase() === rankTier ? 1 : 0) +
        (industryFilter && a.target_industry.toLowerCase().includes(industryFilter) ? 1 : 0)
      const scoreB = (b.rank_tier.toLowerCase() === rankTier ? 1 : 0) +
        (industryFilter && b.target_industry.toLowerCase().includes(industryFilter) ? 1 : 0)
      return scoreB - scoreA
    })

    // Convert dictionary templates to SummaryTemplate format
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

    // Dictionary templates first (they're free), then hardcoded
    return [...dictAsSummary, ...hardcoded.map(t => ({ ...t, isDictionary: false }))]
  }

  const filteredTemplates = buildMergedTemplates()
  const charCount = editedSummary.length
  const isOverLimit = charCount > MAX_CHARS
  const isUnderRecommended = charCount > 0 && charCount < RECOMMENDED_MIN
  const isOverRecommended = charCount > RECOMMENDED_MAX

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
        // Personalize static dict templates by injecting user data via pattern matching
        text = personalizeStaticSummary(text, profile, civilianTitle, teamSize)
      }

      const enhancedProfile = civilianTitle
        ? { ...profile, mosTitle: civilianTitle }
        : profile
      text = populateTemplate(text, enhancedProfile)
    }
    text = polishSummary(cleanTemplateOutput(text), { tone: 'professional', length: 'standard' })
    setEditedSummary(text)
    onUpdate(text)
    setTemplateFallbacks(fallbacks)
    setEditingFallback(null)
    setSummarySource(template.isDictionary ? 'dictionary' : null)
  }

  const handleSave = async () => {
    if (isOverLimit) return

    setIsSaving(true)
    try {
      // Save to resume's professional_summary field
      const { error } = await supabase
        .from('resumes')
        .update({ professional_summary: editedSummary || null })
        .eq('id', resumeId)

      if (!error) {
        onUpdate(editedSummary)
        setIsEditing(false)
        setShowTemplates(false)
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedSummary(summary || profileSummary || '')
    setIsEditing(false)
    setShowTemplates(false)
  }

  const handleEnhance = async () => {
    if (!editedSummary.trim()) return

    setIsEnhancing(true)
    try {
      const response = await fetch('/api/enhance-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: editedSummary,
          profile: profile ? {
            rank: profile.rank,
            branch: profile.branch,
            yearsOfService: profile.yearsOfService,
            mos: profile.mos,
            targetRole: profile.targetRole,
            targetIndustry: profile.targetIndustry,
          } : undefined
        }),
      })

      if (response.ok) {
        const { enhanced } = await response.json()
        if (enhanced) {
          setEditedSummary(enhanced)
          setSummarySource('ai')
        }
      }
    } catch (error) {
      console.error('Enhancement failed:', error)
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleResetToProfile = async () => {
    if (profileSummary) {
      setEditedSummary(profileSummary)
    } else {
      setEditedSummary('')
    }
  }

  const handleClearOverride = async () => {
    // Clear the resume-specific override, falling back to profile
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('resumes')
        .update({ professional_summary: null })
        .eq('id', resumeId)

      if (!error) {
        onUpdate(profileSummary || '')
        setEditedSummary(profileSummary || '')
        setIsEditing(false)
      }
    } finally {
      setIsSaving(false)
    }
  }

  // Determine if current summary differs from profile default
  const isOverridden = summary && summary !== profileSummary

  return (
    <div className="bg-bg-tertiary border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm text-gold uppercase tracking-wider font-semibold">
            Professional Summary
          </h3>
          {isOverridden && (
            <span className="text-xs px-2 py-0.5 bg-gold/20 text-gold rounded">
              Custom for this resume
            </span>
          )}
          {summarySource === 'dictionary' && (
            <span className="text-xs px-2 py-0.5 bg-status-green/20 text-status-green rounded">
              Dictionary template
            </span>
          )}
          {summarySource === 'ai' && (
            <span className="text-xs px-2 py-0.5 bg-status-amber/20 text-status-amber rounded">
              AI enhanced
            </span>
          )}
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-xs bg-bg-secondary hover:bg-bg-hover text-text-muted rounded transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div className="relative">
            <textarea
              value={editedSummary}
              onChange={(e) => setEditedSummary(e.target.value)}
              rows={6}
              placeholder="Write a compelling professional summary that highlights your experience, key skills, and what you bring to employers..."
              className={`w-full bg-bg-secondary border rounded-lg p-3 text-text-primary text-sm resize-none focus:ring-1 transition-all ${
                isOverLimit
                  ? 'border-status-red focus:border-status-red focus:ring-status-red/25'
                  : 'border-border focus:border-gold focus:ring-gold/25'
              }`}
            />

            {/* Character count */}
            <div className={`absolute bottom-2 right-2 text-xs ${
              isOverLimit ? 'text-status-red' :
              isOverRecommended ? 'text-status-amber' :
              isUnderRecommended ? 'text-text-dim' :
              'text-status-green'
            }`}>
              {charCount}/{MAX_CHARS}
              {charCount > 0 && charCount < RECOMMENDED_MIN && (
                <span className="ml-1 text-text-dim">(min {RECOMMENDED_MIN} recommended)</span>
              )}
            </div>
          </div>

          {/* Action buttons row */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Template Button */}
              <button
                type="button"
                onClick={() => setShowTemplates(!showTemplates)}
                className="flex items-center gap-2 px-3 py-1.5 bg-bg-secondary hover:bg-bg-hover border border-border text-text-muted hover:text-text text-xs font-semibold rounded transition-colors"
              >
                <span>&#128203;</span>
                {showTemplates ? 'Hide Templates' : 'Choose Template'}
              </button>

              {/* Enhance Button (paid only) */}
              {isFree ? (
                <span className="text-xs text-text-dim">
                  <UpgradeLink className="text-gold hover:text-gold-bright hover:underline">Upgrade to Core</UpgradeLink>
                  {' '}for AI enhancement
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleEnhance}
                  disabled={isEnhancing || !editedSummary.trim()}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gold/20 hover:bg-gold/30 border border-gold/50 disabled:bg-bg-tertiary disabled:border-border disabled:cursor-not-allowed text-gold disabled:text-text-dim text-xs font-semibold rounded transition-colors"
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

              {/* Reset to Profile button */}
              {profileSummary && editedSummary !== profileSummary && (
                <button
                  onClick={handleResetToProfile}
                  className="px-3 py-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
                >
                  ↩ Reset to Profile
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 bg-bg-secondary hover:bg-bg-hover text-text-muted text-xs font-semibold rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || isOverLimit}
                className="px-3 py-1.5 bg-gold hover:bg-gold-bright text-bg-primary text-xs font-semibold rounded transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
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
                    className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
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
              <div className="max-h-48 overflow-y-auto p-2 space-y-2">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleSelectTemplate(template)}
                    className="w-full text-left p-3 rounded-lg bg-bg-tertiary hover:bg-bg-hover border border-border hover:border-gold/50 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-text group-hover:text-gold">
                        {template.name}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-status-green/20 text-status-green rounded">
                        Free
                      </span>
                    </div>
                    <p className="text-xs text-text-dim">{template.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-text-dim">
            Tip: A good summary is 2-4 sentences ({RECOMMENDED_MIN}-{RECOMMENDED_MAX} characters) highlighting your experience, key skills, and value to employers.
          </p>
        </div>
      ) : (
        <div>
          <div className="text-sm text-text-secondary leading-relaxed">
            {!(summary || profileSummary) ? (
              <span className="text-text-dim italic">
                No professional summary yet. Click Edit to add one.
              </span>
            ) : templateFallbacks.length > 0 ? (
              <SummaryWithFallbacks
                text={summary || profileSummary || ''}
                fallbacks={templateFallbacks}
                editingFallback={editingFallback}
                editingValue={editingFallbackValue}
                onStartEdit={(fb) => { setEditingFallback(fb); setEditingFallbackValue(fb) }}
                onChangeEdit={setEditingFallbackValue}
                onConfirmEdit={(oldVal) => {
                  const newText = (summary || profileSummary || '').replace(oldVal, editingFallbackValue)
                  onUpdate(newText)
                  setEditedSummary(newText)
                  setTemplateFallbacks(prev => prev.filter(f => f !== oldVal))
                  setEditingFallback(null)
                }}
                onCancelEdit={() => setEditingFallback(null)}
              />
            ) : (
              <span>{summary || profileSummary}</span>
            )}
          </div>

          {templateFallbacks.length > 0 && (
            <p className="text-xs text-gold mt-2">
              Highlighted text is generic — click to customize with your specifics.
            </p>
          )}

          {/* Show "Clear override" option when viewing a custom summary */}
          {isOverridden && (
            <button
              onClick={handleClearOverride}
              disabled={isSaving}
              className="mt-3 text-xs text-text-dim hover:text-text-muted transition-colors"
            >
              ↩ Use profile default instead
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/** Renders summary text with highlighted fallback sections that are inline-editable */
function SummaryWithFallbacks({
  text,
  fallbacks,
  editingFallback,
  editingValue,
  onStartEdit,
  onChangeEdit,
  onConfirmEdit,
  onCancelEdit,
}: {
  text: string
  fallbacks: string[]
  editingFallback: string | null
  editingValue: string
  onStartEdit: (fb: string) => void
  onChangeEdit: (value: string) => void
  onConfirmEdit: (oldVal: string) => void
  onCancelEdit: () => void
}) {
  // Split text into segments: regular text and fallback matches
  // Build a regex that matches any of the fallback strings
  const activeFallbacks = fallbacks.filter(fb => text.includes(fb))
  if (activeFallbacks.length === 0) {
    return <span>{text}</span>
  }

  const escaped = activeFallbacks.map(fb => fb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const pattern = new RegExp(`(${escaped.join('|')})`, 'g')
  const parts = text.split(pattern)

  return (
    <span>
      {parts.map((part, i) => {
        if (activeFallbacks.includes(part)) {
          if (editingFallback === part) {
            return (
              <span key={i} className="inline-flex items-center gap-1">
                <input
                  type="text"
                  value={editingValue}
                  onChange={(e) => onChangeEdit(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onConfirmEdit(part)
                    if (e.key === 'Escape') onCancelEdit()
                  }}
                  autoFocus
                  className="inline-block px-1 py-0.5 bg-bg-secondary border border-gold rounded text-sm text-text min-w-[80px] max-w-[200px] focus:ring-1 focus:ring-gold/25"
                  style={{ width: `${Math.max(80, editingValue.length * 8)}px` }}
                />
                <button
                  onClick={() => onConfirmEdit(part)}
                  className="text-xs text-gold hover:text-gold-bright"
                  title="Confirm"
                >
                  ✓
                </button>
                <button
                  onClick={onCancelEdit}
                  className="text-xs text-text-dim hover:text-text-muted"
                  title="Cancel"
                >
                  ✕
                </button>
              </span>
            )
          }
          return (
            <span
              key={i}
              onClick={() => onStartEdit(part)}
              className="bg-gold/20 px-1 rounded cursor-pointer hover:bg-gold/30 transition-colors"
              title="Click to customize"
            >
              {part}
            </span>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </span>
  )
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

/** Smart fallback values for placeholders when user data is missing */
const PLACEHOLDER_FALLBACKS: Record<string, string> = {
  // Team/org size
  'team_size': 'cross-functional teams',
  'your team size': 'cross-functional teams',
  'num_personnel': 'multiple teams',
  // Budget/value
  'budget': 'multi-million-dollar budgets',
  'dollar_amount': 'significant budgets',
  'budget_amount': 'departmental budgets',
  // Specialized area — filled dynamically, empty string means remove clause
  'analysis_area': '',
  'field': '',
  'field_of_study': '',
  // Metrics we can't know
  'num_products': 'numerous',
  'num_systems': 'multiple',
  'num_projects': 'multiple',
  'percentage': 'measurable',
  'adoption_scope': 'organization-wide',
  // Skills/certs — filled dynamically
  'key_achievement': 'delivering measurable results',
  'key_strength': 'operational excellence',
  'company_name': 'the organization',
  // Federal-specific
  'grade_level': 'target grade',
  'series': 'target series',
}

interface DictTemplateResult {
  text: string
  fallbacks: string[]
}

/**
 * Populate dictionary template placeholders from profile data.
 *
 * Three-pass approach:
 * 1. Fill from user data (real values)
 * 2. Smart fallbacks for remaining placeholders (generic but professional text)
 * 3. Remove any remaining raw {{placeholder}} or [placeholder] patterns cleanly
 *
 * Returns the filled text AND a list of fallback strings used (for UI highlighting).
 */
function populateDictTemplate(
  template: string,
  profile: ProfileData,
  civilianTitle: string | null,
  teamSizeFromRank?: string | null,
): DictTemplateResult {
  let result = template
  const fallbacksUsed: string[] = []

  // Helper: use real value or fallback, tracking which fallbacks were used
  const fill = (value: string | undefined | null, fallback: string): string => {
    if (value) return value
    if (fallback) fallbacksUsed.push(fallback)
    return fallback
  }

  // === PASS 1: Fill from user data ===

  const userSkills = profile.skills ?? []
  const certs = profile.certifications ?? []
  const edu = profile.education ?? []
  const topDegree = edu[0]?.degree || ''
  const topField = edu[0]?.field || ''
  // Derived specialized area: education field > target_industry > target_role area > generic
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

  // === PASS 2: Bracket-style placeholders — fill with real data or smart fallback ===
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

  // === PASS 3: Catch-all — replace remaining {{placeholder}} with smart fallbacks ===
  result = result.replace(/\{\{(\w+)\}\}/g, (_, field) => {
    const key = field.toLowerCase()
    const fb = PLACEHOLDER_FALLBACKS[key]
    if (fb !== undefined) {
      if (fb === '') return '' // Empty fallback = remove
      fallbacksUsed.push(fb)
      return fb
    }
    // Unknown placeholder — use professional generic
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
    // Unknown bracket placeholder — remove brackets, use as-is
    fallbacksUsed.push(inner)
    return inner
  })

  // === PASS 4: Formatting cleanup ===
  result = result.replace(/\s*and\s*\[\]\s*/g, ' ')
  result = result.replace(/\s+,/g, ',')
  result = result.replace(/\s+\./g, '.')
  result = result.replace(/,\s*,/g, ',')
  result = result.replace(/\s{2,}/g, ' ')
  // Remove orphaned empty clauses (", ," or ", and ,")
  result = result.replace(/,\s*and\s*,/g, ',')
  result = result.replace(/,\s*and\s*\./g, '.')

  return { text: result.trim(), fallbacks: [...new Set(fallbacksUsed)] }
}
