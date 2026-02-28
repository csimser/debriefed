'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { getUserTier, isPaidTier } from '@/lib/tier-utils'
import { TEMPLATES, TemplateId } from '@/lib/templates'
import { ResumePreview } from '@/components/resume/ResumePreview'
import { LastUseWarningModal } from '@/components/paywall/LastUseWarningModal'
import { usePostActionModal } from '@/components/paywall/PostActionModalProvider'
import { createClient } from '@/lib/supabase/client'
import { extractKeywords } from '@/lib/dictionary/keywordExtractor'
import { calculateMatch, buildUserProfile } from '@/lib/dictionary/matchScorer'
import { translateBullet } from '@/lib/dictionary/bulletTranslator'
import { getDictionary } from '@/lib/dictionary/dictionaryQueries'
import type { ExtractionResult, MatchResult, DictProfessionalSummary } from '@/lib/dictionary/types'
import { TailoredPreviewModal, type PreviewChange } from './TailoredPreviewModal'
import { UpgradeLink, useUpgradeModal } from '@/components/modals/UpgradeModal'
import { ScoreGauge } from './ScoreGauge'

interface JobMatchWorkspaceProps {
  userId: string
  userPlan: string
  resumes: any[]
  currentUsage: number
  usageLimit: number
  userProfile: {
    first_name?: string | null
    last_name?: string | null
    branch?: string | null
    rank?: string | null
    paygrade?: string | null
    rating_mos?: string | null
    years_of_service?: number | string | null
    clearance?: string | null
    target_role?: string | null
    target_industry?: string | null
  } | null
  userSkills: string[]
  userCertifications: { name: string }[]
  userEducation: { degree_type?: string | null; field_of_study?: string | null; school_name?: string | null }[]
}

export interface TailoredResume {
  content: any
  appliedBullets: Set<string> // "expIdx-bulletIdx" format
  addedSkills: string[]
  removedSkills: string[]
  excludedBullets: Set<string>
}

export interface AnalysisResult {
  overallScore: number
  assessmentLevel: 'Strong Candidate' | 'Competitive' | 'Needs Development' | 'Consider Other Roles'
  competitivePosition: string
  categoryScores: {
    skills: number
    experience: number
    keywords: number
    education: number
    certifications: number
    clearance: number | null
  }
  extractedRequirements?: {
    requiredSkills: string[]
    preferredSkills: string[]
    requiredCertifications: string[]
    preferredCertifications: string[]
    requiredExperienceYears: number | null
    requiredEducation: string | null
    requiredClearance: string | null
    keyPhrases: string[]
  }
  categoryDetails: {
    skills: {
      required: string[]
      preferred: string[]
      matched: string[]
      missingRequired: string[]
      missingPreferred: string[]
      missing?: string[] // legacy
      toHighlight: string[]
      toAdd: string[]
      toRemove?: string[]
    }
    education: {
      required: string
      candidateLevel: string
      meetsRequirement: boolean
      notes: string
    }
    certifications: {
      required: string[]
      preferred: string[]
      matched: string[]
      missingRequired: string[]
      missingPreferred: string[]
      missing?: string[] // legacy
      notes: string
    }
    experience: {
      requiredYears: number
      candidateYears: number
      meetsRequirement: boolean
      gap?: number
      notes: string
    }
    clearance: {
      required: string | null
      candidateLevel: string | null
      meetsRequirement: boolean
      notes: string
    } | null
    keywords?: {
      extracted: string[]
      found: string[]
      missing: string[]
    }
  }
  bulletSuggestions: BulletSuggestion[]
  skillChanges: {
    add: string[]
    highlight: string[]
    remove: string[]
  }
  gaps: Gap[]
  strengths: string[]
  priorityActions: PriorityAction[] | string[]
  assessment: string
}

export interface PriorityAction {
  action: string
  impact: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  timeframe: string
}

export interface BulletSuggestion {
  experienceIndex: number
  bulletIndex: number
  original: string
  suggested: string | null
  keywordsAdded: string[]
  action: 'rewrite' | 'exclude' | 'keep'
  priority: 'high' | 'medium' | 'low'
  estimatedImpact?: string
}

export interface Gap {
  category: string
  severity: 'high' | 'medium' | 'low'
  item?: string
  description: string
  canAddress?: boolean
  addressSuggestion?: string
}

// ============================================================================
// Summary Template Substitution
// ============================================================================

interface SummaryTemplateData {
  years?: string
  team_size?: string
  value?: string
  count?: string
  metric?: string
  certifications?: string
  certification?: string
  users?: string
  domain?: string
  specialty?: string
  clearance?: string
  languages?: string
  skills?: string
  achievement?: string
  civilian_title?: string
  budget?: string
  degree?: string
  skill_1?: string
  skill_2?: string
  skill_3?: string
  key_achievement?: string
  operation_type?: string
  university?: string
  key_result?: string
}

const SUMMARY_FALLBACKS: Record<string, string> = {
  years: '20',
  team_size: '40',
  value: 'multi-million-dollar',
  count: 'multiple',
  metric: '95',
  users: '500+',
  domain: 'operations',
  specialty: 'operations management',
  achievement: 'measurable operational improvements',
  budget: 'multi-million-dollar',
  key_achievement: 'measurable operational improvements',
  operation_type: 'operations',
  key_result: 'measurable operational improvements',
}

function fillSummaryTemplate(template: string, data: SummaryTemplateData): string {
  let result = template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    const val = data[key as keyof SummaryTemplateData]
    if (val !== undefined && val !== '') return val
    // Fall back to defaults
    if (SUMMARY_FALLBACKS[key]) return SUMMARY_FALLBACKS[key]
    return ''
  })
  // Clean up artifacts: double spaces, space before punctuation, empty parens
  result = result.replace(/\s{2,}/g, ' ')
  result = result.replace(/\s+([.,;:!?])/g, '$1')
  result = result.replace(/\(\s*\)/g, '')
  result = result.replace(/,\s*,/g, ',')
  result = result.replace(/,\s*\./g, '.')
  result = result.trim()

  // Minimum word count check — if result is under 50 words, use fallback
  const wordCount = result.split(/\s+/).filter(w => w.length > 0).length
  if (wordCount < 50) {
    const fallback = `Results-driven ${data.civilian_title || 'operations professional'} with ${data.years || '20'}+ years of military leadership experience. Expert in ${data.skill_1 || 'project management'}, ${data.skill_2 || 'team leadership'}, and ${data.skill_3 || 'operations management'}. Proven track record of leading cross-functional teams and delivering measurable results in high-pressure environments.${data.clearance ? ` ${data.clearance} security clearance.` : ''}${data.degree ? ` ${data.degree} degree.` : ''}${data.certification ? ` ${data.certification} certified.` : ''}`.trim()
    return fallback
  }

  return result
}

/** Extract the largest number near "personnel", "team", "staff", etc. from bullets */
function extractTeamSize(experiences: any[]): string | undefined {
  let largest = 0
  for (const exp of experiences ?? []) {
    for (const b of exp.bullets ?? []) {
      const text = b.translated_text || b.original_text || ''
      const match = text.match(/(\d{1,5})\+?\s*(?:personnel|team\s*members?|staff|employees|soldiers|sailors|marines|airmen|members|people)/i)
      if (match) {
        const n = parseInt(match[1], 10)
        if (n > largest) largest = n
      }
    }
  }
  return largest > 0 ? String(largest) : undefined
}

/** Extract the largest dollar amount from bullets */
function extractDollarValue(experiences: any[]): string | undefined {
  for (const exp of experiences ?? []) {
    for (const b of exp.bullets ?? []) {
      const text = b.translated_text || b.original_text || ''
      const match = text.match(/\$[\d,.]+\s*[KkMmBb]?(?:illion)?/)
      if (match) return match[0]
    }
  }
  return undefined
}

/** Extract a numeric count (projects, systems, missions) from bullets */
function extractCount(experiences: any[]): string | undefined {
  for (const exp of experiences ?? []) {
    for (const b of exp.bullets ?? []) {
      const text = b.translated_text || b.original_text || ''
      const match = text.match(/(\d{2,})\+?\s*(?:projects?|systems?|missions?|operations?|platforms?|programs?)/i)
      if (match) return match[1]
    }
  }
  return undefined
}

/** Extract the best percentage metric from bullets */
function extractMetric(experiences: any[]): string | undefined {
  for (const exp of experiences ?? []) {
    for (const b of exp.bullets ?? []) {
      const text = b.translated_text || b.original_text || ''
      const match = text.match(/(\d{2,3})%/)
      if (match) return match[1]
    }
  }
  return undefined
}

/** Extract a quantified achievement phrase from bullets */
function extractAchievement(experiences: any[]): string | undefined {
  for (const exp of experiences ?? []) {
    for (const b of exp.bullets ?? []) {
      const text = b.translated_text || b.original_text || ''
      // Find bullets with percentages or dollar amounts
      const pctMatch = text.match(/(\d{1,3}%\s*[\w\s]{2,30})/)
      if (pctMatch) return pctMatch[1].trim()
      const dollarMatch = text.match(/(\$[\d,.]+[KkMmBb]?\s*[\w\s]{0,20})/)
      if (dollarMatch) return dollarMatch[1].trim()
    }
  }
  return undefined
}

const CLEARANCE_DISPLAY: Record<string, string> = {
  ts_sci: 'TS/SCI',
  top_secret: 'Top Secret',
  secret: 'Secret',
  confidential: 'Confidential',
}

export function JobMatchWorkspace({
  userId,
  userPlan,
  resumes,
  currentUsage,
  usageLimit,
  userProfile,
  userSkills,
  userCertifications,
  userEducation,
}: JobMatchWorkspaceProps) {
  const router = useRouter()
  const { openUpgradeModal } = useUpgradeModal()
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(resumes[0]?.id || null)
  const [jobData, setJobData] = useState({
    company: '',
    title: '',
    description: '',
  })
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')

  // Dictionary engine state
  const [dictResult, setDictResult] = useState<{ extraction: ExtractionResult; match: MatchResult } | null>(null)
  const [copiedKeywords, setCopiedKeywords] = useState(false)
  const [showKeywordResumeDropdown, setShowKeywordResumeDropdown] = useState(false)
  const [addingKeywords, setAddingKeywords] = useState(false)
  const [keywordAddResult, setKeywordAddResult] = useState<string | null>(null)
  const keywordDropdownRef = useRef<HTMLDivElement>(null)

  // Close keyword dropdown on click outside
  useEffect(() => {
    if (!showKeywordResumeDropdown) return
    const handleClick = (e: MouseEvent) => {
      if (keywordDropdownRef.current && !keywordDropdownRef.current.contains(e.target as Node)) {
        setShowKeywordResumeDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showKeywordResumeDropdown])

  // Tailored resume state
  const [tailoredResume, setTailoredResume] = useState<TailoredResume | null>(null)
  const [originalScore, setOriginalScore] = useState<number | null>(null)
  const [changesSummary, setChangesSummary] = useState<string[]>([])

  // Dictionary-translated bullet suggestions: key → translated text
  const [translatedSuggestions, setTranslatedSuggestions] = useState<Map<string, string>>(new Map())
  const [translating, setTranslating] = useState(false)

  // Lazy-loaded suggestions state
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)

  // Dictionary bullet translations for free tier: key → translated text
  const [dictBulletTranslations, setDictBulletTranslations] = useState<Map<string, string>>(new Map())
  const [dictTranslating, setDictTranslating] = useState(false)
  const [copiedBulletKey, setCopiedBulletKey] = useState<string | null>(null)

  // Preview modal state
  const [previewChanges, setPreviewChanges] = useState<PreviewChange[] | null>(null)
  const [previewMode, setPreviewMode] = useState<'apply-all' | 'keywords' | null>(null)
  const [previewTargetResumeId, setPreviewTargetResumeId] = useState<string | null>(null)
  const [applyingPreview, setApplyingPreview] = useState(false)

  // UI state
  const [resumePreviewOpen, setResumePreviewOpen] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [savingResume, setSavingResume] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('classic_professional')
  const [showLastUseWarning, setShowLastUseWarning] = useState(false)

  // Fix 1: Selectable ATS keywords
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set())
  const [customKeywords, setCustomKeywords] = useState<string[]>([])
  const [manualKeyword, setManualKeyword] = useState('')

  // Resume dropdown state
  const [isResumeDropdownOpen, setIsResumeDropdownOpen] = useState(false)
  const resumeDropdownRef = useRef<HTMLDivElement>(null)
  const extractDebounceRef = useRef<NodeJS.Timeout | null>(null)

  // Professional summary template state
  const [summaryTemplates, setSummaryTemplates] = useState<DictProfessionalSummary[]>([])
  const [showAllSummaries, setShowAllSummaries] = useState(false)
  const [appliedSummaryIdx, setAppliedSummaryIdx] = useState<number | null>(null)

  // Fix 2: Addressed gaps ("I already have this")
  const [addressedGaps, setAddressedGaps] = useState<Set<string>>(new Set())

  const { triggerPostActionModal } = usePostActionModal()

  const selectedResume = resumes.find(r => r.id === selectedResumeId)
  const remaining = usageLimit - currentUsage
  const hasPaidAccess = isPaidTier(getUserTier({ tier: userPlan }))

  // Translate AI bullet suggestions through the dictionary engine
  useEffect(() => {
    if (!analysis?.bulletSuggestions?.length) return

    const branch = userProfile?.branch || ''
    setTranslating(true)

    const translateAll = async () => {
      const translations = new Map<string, string>()
      for (const suggestion of analysis.bulletSuggestions) {
        if (suggestion.action !== 'rewrite' || !suggestion.suggested) continue
        const key = `${suggestion.experienceIndex}-${suggestion.bulletIndex}`
        try {
          const result = await translateBullet(suggestion.suggested, { branch })
          translations.set(key, result.translatedText)
        } catch {
          // Fall back to AI suggestion if dictionary translation fails
          translations.set(key, suggestion.suggested)
        }
      }
      setTranslatedSuggestions(translations)
      setTranslating(false)
    }

    translateAll()
  }, [analysis, userProfile?.branch])

  // NOTE: keyword initialization moved inline to handleAnalyze after setDictResult

  // Sync tailoredResume skills with selectedKeywords (skills = ONLY the selected keywords)
  useEffect(() => {
    if (!tailoredResume || selectedKeywords.size === 0) return
    setTailoredResume(prev => {
      if (!prev) return prev
      const newContent = JSON.parse(JSON.stringify(prev.content))
      newContent.skills = [...selectedKeywords].map(kw => ({ name: kw, category: 'ATS' }))
      return { ...prev, content: newContent }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKeywords])

  // Translate resume bullets through dictionary for free tier users
  // Passes top 8 selected keywords for job-specific synonym injection
  useEffect(() => {
    if (!dictResult || !selectedResume || hasPaidAccess) return
    const experiences = selectedResume.content?.experiences ?? []
    if (experiences.length === 0) return

    setDictTranslating(true)
    const branch = userProfile?.branch || ''
    const kwList = [...selectedKeywords].slice(0, 8)

    const translateAllBullets = async () => {
      const translations = new Map<string, string>()
      for (let expIdx = 0; expIdx < experiences.length; expIdx++) {
        const bullets = experiences[expIdx].bullets ?? []
        for (let bIdx = 0; bIdx < bullets.length; bIdx++) {
          const bullet = bullets[bIdx]
          const text = bullet.translated_text || bullet.original_text || ''
          if (!text.trim()) continue
          const key = `${expIdx}-${bIdx}`
          try {
            const result = await translateBullet(text, { branch, targetKeywords: kwList })
            if (result.translatedText !== text) {
              translations.set(key, result.translatedText)
            }
          } catch {
            // Skip failed translations
          }
        }
      }
      setDictBulletTranslations(translations)
      setDictTranslating(false)
    }

    translateAllBullets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dictResult, selectedResume, hasPaidAccess, userProfile?.branch])

  // Auto-extract keywords on paste (debounced)
  useEffect(() => {
    if (extractDebounceRef.current) clearTimeout(extractDebounceRef.current)
    if (jobData.description.length < 100 || !selectedResumeId) return
    extractDebounceRef.current = setTimeout(async () => {
      try {
        const extraction = await extractKeywords(jobData.description)
        const profile = buildUserProfile(
          userProfile || {},
          userSkills,
          userCertifications,
          userEducation.map(e => ({ degree: e.degree_type ?? null, field_of_study: e.field_of_study ?? null, school: e.school_name ?? null })),
          (selectedResume?.content?.experiences || []).map((e: any) => ({
            title: e.job_title || e.civilian_title || null,
            organization: e.organization || null,
            bullets: e.bullets,
            experience_bullets: e.experience_bullets,
          })),
        )
        const match = await calculateMatch(extraction, profile)
        setDictResult({ extraction, match })
        const top12 = extraction.atsKeywords.slice(0, 12).map(kw => kw.keyword)
        setSelectedKeywords(new Set(top12))
        setAddressedGaps(new Set())
        setCustomKeywords([])
        setManualKeyword('')
      } catch {}
    }, 1500)
    return () => { if (extractDebounceRef.current) clearTimeout(extractDebounceRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobData.description, selectedResumeId])

  // Close resume dropdown on click outside
  useEffect(() => {
    if (!isResumeDropdownOpen) return
    const handleClick = (e: MouseEvent) => {
      if (resumeDropdownRef.current && !resumeDropdownRef.current.contains(e.target as Node)) {
        setIsResumeDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isResumeDropdownOpen])

  const handleAnalyze = async () => {
    if (!selectedResume || !jobData.description) {
      setError('Please select a resume and enter a job description')
      return
    }

    setAnalyzing(true)
    setError('')
    setAnalysis(null)
    setDictResult(null)
    setTailoredResume(null)
    setOriginalScore(null)
    setChangesSummary([])

    // Run dictionary engine first (instant, no API call)
    try {
      const extraction = await extractKeywords(jobData.description)
      const profile = buildUserProfile(
        userProfile || {},
        userSkills,
        userCertifications,
        userEducation.map(e => ({ degree: e.degree_type ?? null, field_of_study: e.field_of_study ?? null, school: e.school_name ?? null })),
        (selectedResume?.content?.experiences || []).map((e: any) => ({
          title: e.job_title || e.civilian_title || null,
          organization: e.organization || null,
          bullets: e.bullets,
          experience_bullets: e.experience_bullets,
        })),
      )
      const match = await calculateMatch(extraction, profile)
      setDictResult({ extraction, match })
      // Initialize selected keywords immediately (was useEffect, now inline for reliability)
      const top12 = extraction.atsKeywords.slice(0, 12).map(kw => kw.keyword)
      setSelectedKeywords(new Set(top12))
      setAddressedGaps(new Set())
      setCustomKeywords([])
      setManualKeyword('')
    } catch (dictErr) {
      console.error('[DictionaryEngine] Failed:', dictErr)
      // Non-blocking — continue to AI analysis even if dictionary fails
    }

    // Free tier: dictionary-only analysis, skip AI
    if (!hasPaidAccess) {
      // Initialize tailoredResume so free tier can apply bullet translations
      if (selectedResume) {
        setTailoredResume({
          content: JSON.parse(JSON.stringify(selectedResume.content)),
          appliedBullets: new Set(),
          addedSkills: [],
          removedSkills: [],
          excludedBullets: new Set(),
        })
      }
      // Track dictionary-only job match usage
      fetch('/api/track-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: 'job_match_analysis' }),
      }).catch(() => {})
      setAnalyzing(false)
      return
    }

    if (remaining <= 0) {
      setError('You have reached your analysis limit. Upgrade for more.')
      setAnalyzing(false)
      return
    }

    if (remaining === 1 && !showLastUseWarning) {
      setShowLastUseWarning(true)
      setAnalyzing(false)
      return
    }
    setShowLastUseWarning(false)

    try {
      const res = await fetch('/api/job-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeContent: selectedResume.content,
          jobPosting: jobData,
        }),
      })

      const data = await res.json()

      if (res.status === 403) {
        setError(data.details?.reason || data.error || 'Usage limit reached')
        openUpgradeModal()
        setAnalyzing(false)
        return
      }

      if (data.error) {
        setError(data.error)
      } else {
        setAnalysis(data.analysis)
        setOriginalScore(data.analysis.overallScore)
        setTailoredResume({
          content: JSON.parse(JSON.stringify(selectedResume.content)),
          appliedBullets: new Set(),
          addedSkills: [],
          removedSkills: [],
          excludedBullets: new Set(),
        })
        // Trigger post-action modal after results render
        setTimeout(() => triggerPostActionModal('job-match-complete'), 800)

        // Lazy-load bullet suggestions in background
        setSuggestionsLoading(true)
        fetch('/api/job-match/suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resumeContent: selectedResume.content,
            jobPosting: jobData,
            gaps: data.analysis.gaps,
          }),
        })
          .then(sugRes => sugRes.json())
          .then(sugData => {
            if (sugData.bulletSuggestions?.length || sugData.skillChanges) {
              setAnalysis(prev => prev ? {
                ...prev,
                bulletSuggestions: sugData.bulletSuggestions || prev.bulletSuggestions,
                skillChanges: sugData.skillChanges || prev.skillChanges,
              } : prev)
            }
          })
          .catch(() => {}) // Non-critical, silently fail
          .finally(() => setSuggestionsLoading(false))
      }
    } catch (err) {
      setError('Analysis failed. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  // Open preview modal for adding ATS keywords to a resume
  const handleAddKeywordsToResume = useCallback((resumeId: string) => {
    if (!dictResult || addingKeywords) return
    setKeywordAddResult(null)

    const targetResume = resumes.find(r => r.id === resumeId)
    if (!targetResume) return

    const content = targetResume.content ?? {}
    const existingNames = new Set(
      (content.skills ?? []).map((s: any) => (s.name ?? '').toLowerCase())
    )

    // Build preview items for selected keywords (extracted + custom) not already in the resume
    const allKeywords = [
      ...dictResult.extraction.atsKeywords
        .filter(kw => selectedKeywords.has(kw.keyword))
        .map(kw => ({ keyword: kw.keyword, section: kw.section })),
      ...customKeywords
        .filter(kw => selectedKeywords.has(kw))
        .map(kw => ({ keyword: kw, section: 'general' as const })),
    ]

    const previewItems: PreviewChange[] = allKeywords
      .filter(kw => !existingNames.has(kw.keyword.toLowerCase()))
      .map(kw => ({
        id: `kw-${kw.keyword}`,
        type: 'keyword_add' as const,
        label: kw.section === 'required' ? 'Required' : kw.section === 'preferred' ? 'Preferred' : 'General',
        after: kw.keyword,
        status: 'keep' as const,
      }))

    if (previewItems.length === 0) {
      setKeywordAddResult(`All keywords already in ${targetResume.title || 'resume'}`)
      setShowKeywordResumeDropdown(false)
      return
    }

    setPreviewTargetResumeId(resumeId)
    setPreviewChanges(previewItems)
    setPreviewMode('keywords')
    setShowKeywordResumeDropdown(false)
  }, [dictResult, resumes, addingKeywords, selectedKeywords, customKeywords])

  // Navigate to cover letter builder with job data + extraction pre-filled
  const handleCreateCoverLetter = useCallback(() => {
    const payload: Record<string, unknown> = {
      company: jobData.company,
      title: jobData.title,
      description: jobData.description,
    }
    if (dictResult?.extraction) {
      payload.extraction = dictResult.extraction
    }
    sessionStorage.setItem('coverLetterJobData', JSON.stringify(payload))
    router.push('/career-tools?tool=cover-letter')
  }, [jobData, dictResult, router])

  // Apply a single bullet suggestion (uses dictionary-translated text when available)
  const applyBulletSuggestion = useCallback((suggestion: BulletSuggestion, customText?: string) => {
    if (!tailoredResume || !suggestion.suggested) return

    const key = `${suggestion.experienceIndex}-${suggestion.bulletIndex}`
    const finalText = customText || translatedSuggestions.get(key) || suggestion.suggested

    setTailoredResume(prev => {
      if (!prev) return prev

      const newContent = JSON.parse(JSON.stringify(prev.content))
      const exp = newContent.experiences?.[suggestion.experienceIndex]
      const bullet = exp?.bullets?.[suggestion.bulletIndex]

      if (bullet) {
        bullet.translated_text = finalText
        bullet.tailored = true
      }

      const newApplied = new Set(prev.appliedBullets)
      newApplied.add(key)

      return {
        ...prev,
        content: newContent,
        appliedBullets: newApplied,
      }
    })

    setChangesSummary(prev => [...prev, `Rewrote bullet: "${suggestion.original.substring(0, 50)}..."`])
  }, [tailoredResume, translatedSuggestions])

  // Apply a dictionary-translated bullet to the tailored resume (free tier)
  const applyDictBullet = useCallback((expIdx: number, bIdx: number, translatedText: string) => {
    setTailoredResume(prev => {
      if (!prev) return prev
      const newContent = JSON.parse(JSON.stringify(prev.content))
      const exp = newContent.experiences?.[expIdx]
      const bullet = exp?.bullets?.[bIdx]
      if (bullet) {
        bullet.translated_text = translatedText
        bullet.tailored = true
      }
      const newApplied = new Set(prev.appliedBullets)
      newApplied.add(`${expIdx}-${bIdx}`)
      return { ...prev, content: newContent, appliedBullets: newApplied }
    })
  }, [])

  // Add a skill
  const addSkill = useCallback((skillName: string) => {
    setTailoredResume(prev => {
      if (!prev) return prev

      const newContent = JSON.parse(JSON.stringify(prev.content))
      if (!newContent.skills) newContent.skills = []

      const exists = newContent.skills.some((s: any) =>
        s.name.toLowerCase() === skillName.toLowerCase()
      )

      if (!exists) {
        newContent.skills.push({ name: skillName, category: 'Added' })
      }

      return {
        ...prev,
        content: newContent,
        addedSkills: [...prev.addedSkills, skillName],
      }
    })

    setChangesSummary(prev => [...prev, `Added skill: ${skillName}`])
  }, [])

  // Open preview modal for "Apply All" suggestions
  const openApplyAllPreview = useCallback(() => {
    if (!analysis || !tailoredResume) return

    const previewItems: PreviewChange[] = []
    const experiences = tailoredResume.content.experiences || []

    // Bullet rewrites
    analysis.bulletSuggestions?.forEach(suggestion => {
      if (suggestion.action !== 'rewrite' || !suggestion.suggested) return
      const key = `${suggestion.experienceIndex}-${suggestion.bulletIndex}`
      if (tailoredResume.appliedBullets.has(key)) return // already applied

      const exp = experiences[suggestion.experienceIndex]
      const expLabel = exp?.job_title || exp?.civilian_title || `Experience ${suggestion.experienceIndex + 1}`
      const translated = translatedSuggestions.get(key) || suggestion.suggested

      previewItems.push({
        id: `bullet-${key}`,
        type: 'bullet_rewrite',
        label: expLabel,
        before: suggestion.original,
        after: translated,
        aiOriginal: suggestion.suggested !== translated ? suggestion.suggested : undefined,
        status: 'keep',
      })
    })

    // Skill additions
    analysis.skillChanges?.add?.forEach(skillName => {
      const exists = tailoredResume.content.skills?.some((s: any) =>
        s.name.toLowerCase() === skillName.toLowerCase()
      )
      if (exists || tailoredResume.addedSkills.includes(skillName)) return

      previewItems.push({
        id: `skill-add-${skillName}`,
        type: 'skill_add',
        label: 'Skills',
        after: skillName,
        status: 'keep',
      })
    })

    // Skill removals
    analysis.skillChanges?.remove?.forEach(skillName => {
      if (tailoredResume.removedSkills.includes(skillName)) return
      const exists = tailoredResume.content.skills?.some((s: any) =>
        s.name.toLowerCase() === skillName.toLowerCase()
      )
      if (!exists) return

      previewItems.push({
        id: `skill-remove-${skillName}`,
        type: 'skill_remove',
        label: 'Skills',
        after: skillName,
        status: 'keep',
      })
    })

    if (previewItems.length === 0) return

    setPreviewChanges(previewItems)
    setPreviewMode('apply-all')
  }, [analysis, tailoredResume, translatedSuggestions])

  // Handle confirmed apply from preview modal
  const handlePreviewApply = useCallback((finalChanges: PreviewChange[]) => {
    if (previewMode === 'apply-all' && tailoredResume && analysis) {
      setApplyingPreview(true)
      const changeLog: string[] = []

      const newContent = JSON.parse(JSON.stringify(tailoredResume.content))
      const newApplied = new Set(tailoredResume.appliedBullets)
      const newExcluded = new Set(tailoredResume.excludedBullets)
      const newAddedSkills = [...tailoredResume.addedSkills]
      const newRemovedSkills = [...tailoredResume.removedSkills]

      for (const change of finalChanges) {
        if (change.status === 'skip') continue

        if (change.type === 'bullet_rewrite') {
          const key = change.id.replace('bullet-', '')
          const [expIdx, bulletIdx] = key.split('-').map(Number)
          const exp = newContent.experiences?.[expIdx]
          const bullet = exp?.bullets?.[bulletIdx]

          if (bullet) {
            bullet.translated_text = change.editedValue || change.after
            bullet.tailored = true
            newApplied.add(key)
            changeLog.push(`Rewrote: "${change.before?.substring(0, 40)}..."`)
          }
        } else if (change.type === 'skill_add') {
          const skillName = change.after
          if (!newContent.skills) newContent.skills = []
          const exists = newContent.skills.some((s: any) =>
            s.name.toLowerCase() === skillName.toLowerCase()
          )
          if (!exists) {
            newContent.skills.push({ name: skillName, category: 'Added' })
            newAddedSkills.push(skillName)
            changeLog.push(`Added skill: ${skillName}`)
          }
        } else if (change.type === 'skill_remove') {
          const skillName = change.after
          const idx = newContent.skills?.findIndex((s: any) =>
            s.name.toLowerCase() === skillName.toLowerCase()
          )
          if (idx !== undefined && idx >= 0) {
            newContent.skills.splice(idx, 1)
            newRemovedSkills.push(skillName)
            changeLog.push(`Removed skill: ${skillName}`)
          }
        }
      }

      // Also handle exclude suggestions that weren't in the preview
      analysis.bulletSuggestions?.forEach(suggestion => {
        if (suggestion.action !== 'exclude') return
        const key = `${suggestion.experienceIndex}-${suggestion.bulletIndex}`
        if (!newExcluded.has(key)) {
          newExcluded.add(key)
        }
      })

      setTailoredResume({
        content: newContent,
        appliedBullets: newApplied,
        addedSkills: newAddedSkills,
        removedSkills: newRemovedSkills,
        excludedBullets: newExcluded,
      })

      setChangesSummary(prev => [...prev, ...changeLog])
      setApplyingPreview(false)
      setPreviewChanges(null)
      setPreviewMode(null)
    } else if (previewMode === 'keywords' && previewTargetResumeId) {
      // Apply keyword additions to DB resume
      applyKeywordsFromPreview(finalChanges)
    }
  }, [previewMode, tailoredResume, analysis, previewTargetResumeId])

  // Apply keywords to a resume from preview modal confirmation
  const applyKeywordsFromPreview = useCallback(async (finalChanges: PreviewChange[]) => {
    if (!previewTargetResumeId || !dictResult) return
    setApplyingPreview(true)

    try {
      const targetResume = resumes.find(r => r.id === previewTargetResumeId)
      if (!targetResume) throw new Error('Resume not found')

      const content = JSON.parse(JSON.stringify(targetResume.content ?? {}))
      const existingSkills: { id?: string; name: string }[] = content.skills ?? []
      const existingNames = new Set(existingSkills.map((s: any) => (s.name ?? '').toLowerCase()))

      let addedCount = 0
      for (const change of finalChanges) {
        if (change.status === 'skip') continue
        if (change.type !== 'keyword_add') continue
        const kw = change.after
        if (!existingNames.has(kw.toLowerCase())) {
          existingSkills.push({ name: kw })
          existingNames.add(kw.toLowerCase())
          addedCount++
        }
      }

      if (addedCount === 0) {
        setKeywordAddResult(`No new keywords to add to ${targetResume.title || 'resume'}`)
      } else {
        content.skills = existingSkills
        const supabase = createClient()
        const { error: updateError } = await supabase
          .from('resumes')
          .update({ content, updated_at: new Date().toISOString() })
          .eq('id', previewTargetResumeId)
          .eq('user_id', userId)

        if (updateError) throw updateError
        setKeywordAddResult(`Added ${addedCount} keyword${addedCount !== 1 ? 's' : ''} to ${targetResume.title || 'resume'}`)
      }

      setShowKeywordResumeDropdown(false)
    } catch (err) {
      console.error('[AddKeywords] Failed:', err)
      setKeywordAddResult('Failed to add keywords. Try again.')
    } finally {
      setApplyingPreview(false)
      setPreviewChanges(null)
      setPreviewMode(null)
      setPreviewTargetResumeId(null)
    }
  }, [dictResult, resumes, userId, previewTargetResumeId])

  // Reset all changes
  const resetChanges = useCallback(() => {
    if (!selectedResume) return

    setTailoredResume({
      content: JSON.parse(JSON.stringify(selectedResume.content)),
      appliedBullets: new Set(),
      addedSkills: [],
      removedSkills: [],
      excludedBullets: new Set(),
    })
    setChangesSummary([])
  }, [selectedResume])

  // Start a new analysis — reset all state
  const handleStartNewAnalysis = useCallback(() => {
    setAnalysis(null)
    setDictResult(null)
    setTailoredResume(null)
    setOriginalScore(null)
    setChangesSummary([])
    setSelectedKeywords(new Set())
    setCustomKeywords([])
    setManualKeyword('')
    setAddressedGaps(new Set())
    setDictBulletTranslations(new Map())
    setDictTranslating(false)
    setTranslatedSuggestions(new Map())
    setTranslating(false)
    setSummaryTemplates([])
    setShowAllSummaries(false)
    setAppliedSummaryIdx(null)
    setJobData({ company: '', title: '', description: '' })
    setError('')
    setResumePreviewOpen(false)
    setCopiedKeywords(false)
    setKeywordAddResult(null)
    setCopiedBulletKey(null)
    setDownloading(false)
  }, [])

  // Toggle a single ATS keyword selection
  const toggleKeyword = useCallback((keyword: string) => {
    setSelectedKeywords(prev => {
      const next = new Set(prev)
      if (next.has(keyword)) next.delete(keyword)
      else next.add(keyword)
      return next
    })
  }, [])

  // Select/deselect all keywords
  const selectAllKeywords = useCallback((selectAll: boolean) => {
    if (selectAll && dictResult) {
      const all = new Set(dictResult.extraction.atsKeywords.map(kw => kw.keyword))
      customKeywords.forEach(kw => all.add(kw))
      setSelectedKeywords(all)
    } else {
      setSelectedKeywords(new Set())
    }
  }, [dictResult, customKeywords])

  // Add a manual keyword
  const addManualKeyword = useCallback(() => {
    const trimmed = manualKeyword.trim()
    if (!trimmed) return
    if (customKeywords.some(k => k.toLowerCase() === trimmed.toLowerCase())) return
    const existing = dictResult?.extraction.atsKeywords.find(kw => kw.keyword.toLowerCase() === trimmed.toLowerCase())
    if (existing) {
      setSelectedKeywords(prev => new Set([...prev, existing.keyword]))
      setManualKeyword('')
      return
    }
    setCustomKeywords(prev => [...prev, trimmed])
    setSelectedKeywords(prev => new Set([...prev, trimmed]))
    setManualKeyword('')
  }, [manualKeyword, customKeywords, dictResult])

  // Mark a gap as "I already have this"
  const addressGap = useCallback((keyword: string) => {
    setAddressedGaps(prev => {
      const next = new Set(prev)
      if (next.has(keyword)) next.delete(keyword)
      else next.add(keyword)
      return next
    })
  }, [])

  // Generate professional summary templates — 6 distinct structures per rank tier
  useEffect(() => {
    if (!dictResult) return

    const pg = (userProfile?.paygrade ?? '').toUpperCase().trim()
    const years = userProfile?.years_of_service ?? '10+'
    const branchShort = (() => {
      const b = (userProfile?.branch ?? '').toLowerCase()
      if (b.includes('navy')) return 'Navy'
      if (b.includes('army')) return 'Army'
      if (b.includes('air') || b === 'air_force') return 'Air Force'
      if (b.includes('marine')) return 'Marine Corps'
      if (b.includes('coast')) return 'Coast Guard'
      if (b.includes('space')) return 'Space Force'
      return userProfile?.branch || 'military'
    })()
    const domain = dictResult.extraction.industry ?? userProfile?.target_industry ?? 'operations'
    const targetRole = jobData.title || userProfile?.target_role || 'operations professional'
    const certs = userCertifications.map(c => c.name)
    const topCert = certs[0] || ''
    const certStr = certs.length > 0 ? certs.slice(0, 3).join(', ') : ''
    const clearanceRaw = userProfile?.clearance
    const clearance = clearanceRaw && clearanceRaw !== 'none'
      ? (CLEARANCE_DISPLAY[clearanceRaw] ?? clearanceRaw.charAt(0).toUpperCase() + clearanceRaw.slice(1))
      : ''
    const skill1 = userSkills[0] || 'project management'
    const skill2 = userSkills[1] || 'team leadership'
    const skill3 = userSkills[2] || 'operations management'
    const edu0 = userEducation[0]
    const degree = edu0?.degree_type ? (edu0.degree_type.charAt(0).toUpperCase() + edu0.degree_type.slice(1)) : ''
    const experiences = selectedResume?.content?.experiences ?? []
    const teamSize = extractTeamSize(experiences) || '40'
    const budget = extractDollarValue(experiences) || 'multi-million-dollar'
    const achievement = extractAchievement(experiences) || 'measurable operational improvements'
    const mos = userProfile?.rating_mos || ''

    const now = new Date().toISOString()
    const templates: DictProfessionalSummary[] = []

    // 1. SENIOR ENLISTED (E-7 to E-9) — leads with team leadership in domain
    templates.push({
      id: 'gen-senior-enlisted', template_name: 'Senior Enlisted', rank_tier: 'SENIOR ENLISTED',
      target_industry: domain, target_role: targetRole, example_output: null, created_at: now,
      template_text: `${years}-year ${branchShort} veteran with a proven record of leading ${teamSize}-person teams through high-stakes ${domain} operations. ${topCert ? `${topCert} certified. ` : ''}${clearance ? `Holds active ${clearance} clearance. ` : ''}Deep expertise in ${skill1}, ${skill2}, and ${skill3} developed through decades of hands-on military service. Known for delivering results in resource-constrained environments while maintaining the highest standards of compliance. Now pursuing ${targetRole} roles in ${domain}.`.trim(),
    })

    // 2. JUNIOR/MID OFFICER (O-1 to O-4) — leads with commission and operational focus
    templates.push({
      id: 'gen-junior-officer', template_name: 'Junior/Mid Officer', rank_tier: 'JUNIOR OFFICER',
      target_industry: domain, target_role: targetRole, example_output: null, created_at: now,
      template_text: `Commission-trained ${branchShort} officer with ${years} years executing ${domain} operations at the operational level. ${degree ? `${degree} graduate. ` : ''}${topCert ? `${topCert} certified. ` : ''}Led ${achievement}. Transitioning to ${targetRole} with a focus on ${skill1} and ${skill2}. ${clearance ? `${clearance} clearance. ` : ''}Combines structured military decision-making with adaptable problem-solving to deliver mission-critical outcomes.`.trim(),
    })

    // 3. SENIOR OFFICER (O-5+) — strategic level, budget/personnel emphasis
    templates.push({
      id: 'gen-senior-officer', template_name: 'Senior Officer', rank_tier: 'SENIOR OFFICER',
      target_industry: domain, target_role: targetRole, example_output: null, created_at: now,
      template_text: `Senior ${branchShort} officer with ${years} years of ${domain} leadership at the strategic level. Managed ${budget} budgets and led ${teamSize}+ personnel across multiple commands and joint organizations. ${clearance ? `${clearance} clearance. ` : ''}${certStr ? `${certStr}. ` : ''}${degree ? `${degree}. ` : ''}Targeting executive ${targetRole} roles where strategic vision, stakeholder management, and organizational transformation drive measurable impact in ${domain}.`.trim(),
    })

    // 4. MID ENLISTED (E-4 to E-6) — hands-on technical, minimal oversight
    templates.push({
      id: 'gen-mid-enlisted', template_name: 'Mid Enlisted', rank_tier: 'MID ENLISTED',
      target_industry: domain, target_role: targetRole, example_output: null, created_at: now,
      template_text: `${years}-year ${branchShort}${mos ? ` ${mos}` : ''} transitioning to ${targetRole}. Hands-on expertise in ${skill1} and ${skill2} gained through real-world ${domain} operations. ${topCert ? `${topCert} certified. ` : ''}${clearance ? `${clearance} cleared. ` : ''}Proven ability to execute under pressure with minimal oversight. Brings a disciplined, mission-first approach to every assignment and a track record of operational excellence.`.trim(),
    })

    // 5. ANALYST/TECHNICAL — leads with technical skills, not leadership
    templates.push({
      id: 'gen-technical', template_name: 'Analyst/Technical', rank_tier: 'TECHNICAL',
      target_industry: domain, target_role: targetRole, example_output: null, created_at: now,
      template_text: `Technical professional with specialized expertise in ${skill1}, ${skill2}, and ${skill3} developed over ${years} years of military service. ${certStr ? `${certStr} certified. ` : ''}Combines hands-on ${domain} experience with analytical problem-solving and attention to detail. ${clearance ? `${clearance} clearance. ` : ''}Seeking ${targetRole} in ${domain} where technical depth and structured methodology drive measurable outcomes.`.trim(),
    })

    // 6. LEADERSHIP/PROGRAM MANAGEMENT — leads with results and scope
    templates.push({
      id: 'gen-leadership', template_name: 'Leadership/Program Mgmt', rank_tier: 'LEADERSHIP',
      target_industry: domain, target_role: targetRole, example_output: null, created_at: now,
      template_text: `Results-driven ${domain} leader with ${years}+ years of progressive military experience directing teams of ${teamSize}+ and managing ${budget} in resources. ${topCert ? `${topCert} certified. ` : ''}${clearance ? `${clearance} clearance. ` : ''}Proven ability to deliver ${achievement}. Adept at translating complex operational challenges into actionable strategies. Pursuing ${targetRole} opportunities in ${domain}.`.trim(),
    })

    // Sort: user's rank category first
    let userRankCategory = 'MID ENLISTED'
    if (/^E-?[7-9]$/.test(pg)) userRankCategory = 'SENIOR ENLISTED'
    else if (/^E-?[4-6]$/.test(pg)) userRankCategory = 'MID ENLISTED'
    else if (/^E-?[1-3]$/.test(pg)) userRankCategory = 'MID ENLISTED'
    else if (/^O-?[1-4]$/.test(pg)) userRankCategory = 'JUNIOR OFFICER'
    else if (/^O-?[5-9]$|^O-?10$/.test(pg)) userRankCategory = 'SENIOR OFFICER'
    else if (/^(W-?[1-5]|CW[1-5])$/.test(pg)) userRankCategory = 'TECHNICAL'

    templates.sort((a, b) => {
      const aMatch = a.rank_tier === userRankCategory ? 1 : 0
      const bMatch = b.rank_tier === userRankCategory ? 1 : 0
      return bMatch - aMatch
    })

    setSummaryTemplates(templates)
  }, [dictResult, userProfile?.paygrade, userProfile?.branch, userProfile?.clearance,
      userProfile?.years_of_service, userProfile?.target_role, userProfile?.target_industry,
      userProfile?.rating_mos, userCertifications, userEducation, userSkills,
      selectedResume, jobData.title])

  // Apply a summary template to the tailored resume
  const applySummaryTemplate = useCallback((templateText: string, idx: number) => {
    setTailoredResume(prev => {
      if (!prev) return prev
      const newContent = JSON.parse(JSON.stringify(prev.content))
      newContent.summary = templateText
      return { ...prev, content: newContent }
    })
    setAppliedSummaryIdx(idx)
    setChangesSummary(prev => [...prev, 'Applied professional summary template'])
  }, [])

  // Adjusted dict score with addressed gaps
  const getAdjustedDictScore = useCallback((): number => {
    if (!dictResult) return 0
    const base = dictResult.match.overallScore
    if (addressedGaps.size === 0) return base
    const addressedRequired = dictResult.match.gaps.filter(g =>
      g.severity === 'high' && addressedGaps.has(g.keyword)
    ).length
    const addressedPreferred = dictResult.match.gaps.filter(g =>
      g.severity !== 'high' && addressedGaps.has(g.keyword)
    ).length
    const improvement = (addressedRequired * 3) + (addressedPreferred * 1.5)
    return Math.min(95, Math.round(base + improvement))
  }, [dictResult, addressedGaps])

  // Calculate current match score after tailoring
  // INTENTIONALLY CONSERVATIVE - improvements should be realistic, not dramatic
  const calculateTailoredScore = useCallback((): number => {
    if (!analysis || !tailoredResume) return analysis?.overallScore || 0

    const baseScore = analysis.overallScore || 0

    // Each bullet rewrite = +1% (keywords help but don't transform a resume)
    const bulletImprovements = tailoredResume.appliedBullets.size * 1

    // Each skill addition = +1.5% (assuming it's a legit skill they have)
    const skillAdditions = tailoredResume.addedSkills.length * 1.5

    // Skill removals don't meaningfully improve match (just declutter)
    const skillRemovals = 0

    // Cap total improvement at 12% - you can't turn a 60% into a 90% with rewording
    // Real improvements come from actually gaining qualifications
    const maxImprovement = 12
    const improvement = Math.min(bulletImprovements + skillAdditions + skillRemovals, maxImprovement)

    // Never exceed 92% - 100% match is virtually impossible
    return Math.min(92, Math.round(baseScore + improvement))
  }, [analysis, tailoredResume])

  // Download for dictionary-only users (no AI analysis required)
  const handleDownloadDict = async () => {
    if (!selectedResume) return
    setDownloading(true)
    try {
      // Skills already synced with selectedKeywords via useEffect
      const content = JSON.parse(JSON.stringify(tailoredResume?.content ?? selectedResume.content ?? {}))

      const response = await fetch('/api/export-tailored', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          format: 'pdf',
          resumeType: 'private',
          template: selectedTemplate,
        }),
      })

      if (response.status === 403) {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || 'Usage limit reached')
        openUpgradeModal()
        setDownloading(false)
        return
      }

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = 'Export failed'
        try {
          const errorJson = JSON.parse(errorText)
          errorMessage = errorJson.error || errorMessage
        } catch {
          errorMessage = errorText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const blob = await response.blob()
      if (blob.size === 0) throw new Error('Downloaded file is empty')

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const timestamp = new Date().toISOString().split('T')[0]
      const jobTitle = jobData.title?.replace(/[^a-zA-Z0-9]/g, '-') || 'tailored'
      a.download = `tailored-resume-${jobTitle}-${timestamp}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error: any) {
      alert(`Download failed: ${error.message || 'Unknown error'}`)
    } finally {
      setDownloading(false)
    }
  }

  const handleDownload = async () => {
    if (!tailoredResume) return

    setDownloading(true)
    try {
      const contentWithExclusions = {
        ...tailoredResume.content,
        experiences: tailoredResume.content.experiences?.map((exp: any, expIdx: number) => ({
          ...exp,
          bullets: exp.bullets?.map((bullet: any, bulletIdx: number) => {
            const key = `${expIdx}-${bulletIdx}`
            const isExcluded = tailoredResume.excludedBullets.has(key)
            return {
              ...bullet,
              status: isExcluded ? 'excluded' : bullet.status,
            }
          }),
        })),
      }

      const response = await fetch('/api/export-tailored', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: contentWithExclusions,
          format: 'pdf',
          resumeType: 'private',
          template: selectedTemplate,
        }),
      })

      if (response.status === 403) {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || 'Usage limit reached')
        openUpgradeModal()
        setDownloading(false)
        return
      }

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = 'Export failed'
        try {
          const errorJson = JSON.parse(errorText)
          errorMessage = errorJson.error || errorMessage
        } catch {
          errorMessage = errorText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const blob = await response.blob()
      if (blob.size === 0) {
        throw new Error('Downloaded file is empty')
      }

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const timestamp = new Date().toISOString().split('T')[0]
      const jobTitle = jobData.title?.replace(/[^a-zA-Z0-9]/g, '-') || 'tailored'
      a.download = `tailored-resume-${jobTitle}-${timestamp}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error: any) {
      alert(`Download failed: ${error.message || 'Unknown error'}`)
    } finally {
      setDownloading(false)
    }
  }

  // Save tailored resume as a new resume in the database
  const handleSaveTailoredResume = useCallback(async () => {
    if (!tailoredResume || !selectedResume) return
    setSavingResume(true)

    try {
      const contentWithExclusions = {
        ...tailoredResume.content,
        experiences: tailoredResume.content.experiences?.map((exp: any, expIdx: number) => ({
          ...exp,
          bullets: exp.bullets?.filter((_: any, bulletIdx: number) => {
            const key = `${expIdx}-${bulletIdx}`
            return !tailoredResume.excludedBullets.has(key)
          }),
        })),
      }

      const jobTitle = jobData.title?.replace(/[^a-zA-Z0-9\s]/g, '').trim() || 'Tailored'
      const newName = `${selectedResume.name} - ${jobTitle}`

      const supabase = createClient()
      const { error: insertError } = await supabase
        .from('resumes')
        .insert({
          user_id: userId,
          name: newName,
          title: newName,
          content: contentWithExclusions,
          resume_type: 'private',
          template: selectedTemplate,
        })

      if (insertError) throw insertError

      alert(`Saved as "${newName}". View it on your Resumes page.`)
    } catch (err: any) {
      alert(`Failed to save: ${err.message || 'Unknown error'}`)
    } finally {
      setSavingResume(false)
    }
  }, [tailoredResume, selectedResume, jobData.title, userId, selectedTemplate])

  // Score display helpers - HARSHER thresholds
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-status-green'
    if (score >= 65) return 'text-status-amber'
    if (score >= 50) return 'text-gold'
    return 'text-status-red'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-status-green'
    if (score >= 65) return 'bg-status-amber'
    if (score >= 50) return 'bg-gold'
    return 'bg-status-red'
  }

  const getMatchLabel = (score: number) => {
    // Use assessment level from analysis if available
    if (analysis?.assessmentLevel) return analysis.assessmentLevel
    // Fallback
    if (score >= 80) return 'Strong Candidate'
    if (score >= 65) return 'Competitive'
    if (score >= 50) return 'Needs Development'
    return 'Consider Other Roles'
  }

  const currentScore = calculateTailoredScore()
  const adjustedDictScore = getAdjustedDictScore()
  const resumeSkillNames = new Set(
    (selectedResume?.content?.skills ?? []).map((s: any) => (s.name ?? '').toLowerCase())
  )
  const totalKeywordCount = (dictResult?.extraction.atsKeywords.length ?? 0) + customKeywords.length
  const hasResults = !!dictResult || !!analysis

  // Memoized data for filling summary template placeholders
  const resolvedSummaryData = useMemo((): SummaryTemplateData => {
    const experiences = selectedResume?.content?.experiences ?? []
    const yos = userProfile?.years_of_service
    const clearanceRaw = userProfile?.clearance
    const certs = userCertifications.map(c => c.name)
    const kwArr = [...selectedKeywords]
    const edu0 = userEducation[0]
    const achievementText = extractAchievement(experiences)

    return {
      years: yos != null ? String(yos) : undefined,
      team_size: extractTeamSize(experiences),
      value: extractDollarValue(experiences),
      count: extractCount(experiences),
      metric: extractMetric(experiences),
      certifications: certs.length > 0 ? certs.slice(0, 3).join(', ') : undefined,
      certification: certs.find(c => c.toLowerCase().includes('pmp')) || certs[0] || undefined,
      users: undefined,
      domain: dictResult?.extraction.industry ?? userProfile?.target_industry ?? undefined,
      specialty: dictResult?.extraction.roleType ?? userProfile?.target_role ?? undefined,
      clearance: clearanceRaw && clearanceRaw !== 'none'
        ? (CLEARANCE_DISPLAY[clearanceRaw] ?? clearanceRaw.charAt(0).toUpperCase() + clearanceRaw.slice(1))
        : undefined,
      languages: undefined,
      skills: kwArr.length > 0 ? kwArr.slice(0, 3).join(', ') : undefined,
      achievement: achievementText,
      civilian_title: jobData.title || undefined,
      budget: extractDollarValue(experiences),
      degree: edu0?.degree_type || undefined,
      skill_1: kwArr[0] || undefined,
      skill_2: kwArr[1] || undefined,
      skill_3: kwArr[2] || undefined,
      key_achievement: achievementText,
      operation_type: dictResult?.extraction.industry ?? undefined,
      university: edu0?.school_name || undefined,
      key_result: achievementText,
    }
  }, [selectedResume, userProfile, userCertifications, selectedKeywords, dictResult, jobData.title, userEducation])


  return (
    <div className="h-full overflow-auto p-4 md:p-6 lg:p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header row — title left, resume selector right */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-xl md:text-2xl font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="text-gold">◈</span> Job Match
            </h1>
            <p className="text-text-muted text-sm mt-1">Paste a job description to see how you match</p>
          </div>

          {/* Resume selector — small dropdown */}
          {resumes.length > 0 && (
            <div className="relative flex-shrink-0" ref={resumeDropdownRef}>
              <button
                onClick={() => setIsResumeDropdownOpen(!isResumeDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-bg-tertiary border border-border rounded-lg hover:border-border-bright transition-colors max-w-[200px]"
              >
                <span className="text-gold text-xs">◫</span>
                <span className="text-xs font-heading font-semibold truncate">{selectedResume?.name || 'Select resume'}</span>
                <svg className={`w-3 h-3 text-text-muted flex-shrink-0 transition-transform ${isResumeDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isResumeDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-64 bg-bg-card border border-border rounded-lg shadow-xl z-30 overflow-hidden">
                  <div className="max-h-48 overflow-auto">
                    {resumes.map((resume) => (
                      <button
                        key={resume.id}
                        onClick={() => { setSelectedResumeId(resume.id); setIsResumeDropdownOpen(false) }}
                        className={`w-full px-4 py-2.5 text-left transition-colors flex items-center gap-2 ${
                          selectedResumeId === resume.id ? 'bg-gold-dim text-gold' : 'hover:bg-bg-tertiary'
                        }`}
                      >
                        <span className="text-xs font-heading font-semibold truncate flex-1">{resume.name}</span>
                        {selectedResumeId === resume.id && <span className="text-gold text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Usage Warning */}
        {!hasPaidAccess && remaining <= 2 && remaining > 0 && (
          <div className="flex items-center gap-3 p-3 bg-status-amber/10 border-l-4 border-status-amber rounded-r-lg">
            <svg className="w-5 h-5 text-status-amber flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div className="flex-1">
              <span className="text-sm font-semibold text-status-amber">{remaining} AI {remaining === 1 ? 'analysis' : 'analyses'} remaining</span>
              <span className="text-xs text-text-muted ml-2">— dictionary match is always free</span>
            </div>
            <UpgradeLink className="text-status-amber text-sm font-semibold hover:underline whitespace-nowrap">Upgrade →</UpgradeLink>
          </div>
        )}

        {/* ═══ JOB DESCRIPTION — primary input, dominant ═══ */}
        <Card className="p-4 md:p-6">
          <label className="block font-heading text-sm font-bold uppercase tracking-wider text-gold mb-3">
            Paste Job Description
          </label>
          <textarea
            name="job-description"
            autoComplete="off"
            rows={12}
            value={jobData.description}
            onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
            placeholder="Paste the full job description here — requirements, qualifications, responsibilities. The more detail, the better."
            className="w-full min-h-[280px] bg-bg-secondary border border-border rounded-lg px-4 py-3 text-text placeholder:text-text-dim resize-y focus:border-gold focus:ring-1 focus:ring-gold/25 transition-colors text-sm"
          />
          {jobData.description.length > 0 && jobData.description.length < 100 && (
            <p className="text-xs text-status-amber mt-2">Keep pasting — need at least 100 characters for analysis</p>
          )}
          {jobData.description.length >= 100 && !dictResult && !analyzing && (
            <p className="text-xs text-text-dim mt-2">Extracting keywords...</p>
          )}

          {/* Optional fields — below JD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              label="Company Name (optional)"
              autoComplete="organization"
              value={jobData.company}
              onChange={(e) => setJobData({ ...jobData, company: e.target.value })}
              placeholder="e.g., Acme Corporation"
            />
            <Input
              label="Job Title (optional)"
              value={jobData.title}
              onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
              placeholder="e.g., Operations Manager"
            />
          </div>
          <p className="text-xs text-text-dim mt-2">Auto-extracted from job description when possible</p>
        </Card>

        {/* ═══ Deep Analysis button — secondary, costs a credit ═══ */}
        {dictResult && hasPaidAccess && !analysis && (
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="secondary"
              onClick={handleAnalyze}
              disabled={analyzing || remaining <= 0}
            >
              {analyzing ? (
                <><svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>Running AI Analysis...</>
              ) : (
                <>Deep Analysis (uses 1 credit)</>
              )}
            </Button>
            {remaining <= 0 && (
              <span className="text-xs text-status-red">No credits remaining</span>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-status-red-dim border border-status-red/20 rounded-lg p-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-status-red flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-status-red">{error}</p>
          </div>
        )}

        {/* No resume warning */}
        {resumes.length === 0 && (
          <Card className="p-6 text-center bg-bg-tertiary">
            <div className="text-3xl mb-3 text-text-dim">◫</div>
            <p className="text-text-muted mb-3">No resumes found. Create one first.</p>
            <Button size="sm" onClick={() => window.location.href = '/resumes'}>Create Resume</Button>
          </Card>
        )}

        {/* Loading State */}
        {analyzing && (
          <Card className="p-12">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-gold/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-gold border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl text-gold">◈</span>
                </div>
              </div>
              <h3 className="font-heading text-lg font-bold uppercase tracking-wider mb-2">
                Analyzing Your Match
              </h3>
              <p className="text-text-muted mb-6">
                Evaluating skills, experience, education, and keywords...
              </p>

              <div className="max-w-xs mx-auto space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center">
                    <span className="text-gold text-xs">✓</span>
                  </div>
                  <span className="text-text-muted">Parsing job requirements</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center animate-pulse">
                    <span className="text-gold text-xs">◆</span>
                  </div>
                  <span className="text-text">Matching skills & experience</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-bg-tertiary flex items-center justify-center">
                    <span className="text-text-dim text-xs">◇</span>
                  </div>
                  <span className="text-text-dim">Generating recommendations</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ═══ RESULTS — shown inline below input ═══ */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {hasResults && !analyzing && (
          <div className="space-y-6">

            {/* ── Score Gauge — dominant visual ── */}
            <Card className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                {/* Score gauge */}
                <ScoreGauge
                  score={analysis ? currentScore : adjustedDictScore}
                  label={analysis ? getMatchLabel(currentScore) : (adjustedDictScore >= 80 ? 'Strong Match' : adjustedDictScore >= 60 ? 'Competitive' : 'Gaps to Address')}
                  previousScore={analysis ? originalScore ?? undefined : (addressedGaps.size > 0 ? dictResult!.match.overallScore : undefined)}
                />

                {/* Category Breakdown — dictionary path */}
                {dictResult && !analysis && (
                <div className="flex-1">
                  <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="text-gold">◈</span> Dictionary Match Analysis
                  </h2>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    {[
                      { label: 'Required Skills', score: dictResult.match.categories.requiredSkills.percentage },
                      { label: 'Preferred Skills', score: dictResult.match.categories.preferredSkills.percentage, hide: dictResult.extraction.preferredSkills.length === 0 },
                      { label: 'Certifications', score: dictResult.match.categories.certifications.percentage, hide: dictResult.extraction.requiredCerts.length === 0 && dictResult.extraction.preferredCerts.length === 0 },
                      { label: 'Education', score: dictResult.match.categories.education.met ? 100 : 0, hide: !dictResult.extraction.educationRequired },
                      { label: 'Experience', score: dictResult.match.categories.experience.met ? 100 : (dictResult.match.categories.experience.candidate && dictResult.match.categories.experience.required ? Math.min(100, Math.round(((dictResult.match.categories.experience.candidate as number) / (dictResult.match.categories.experience.required as number)) * 100)) : 0), hide: dictResult.extraction.yearsRequired === null },
                      { label: 'Clearance', score: dictResult.match.categories.clearance.met ? 100 : 0, hide: !dictResult.extraction.clearanceRequired },
                    ].filter(c => !c.hide).map((cat) => (
                      <div key={cat.label} className="flex items-center gap-3">
                        <span className="text-sm text-text-muted w-28">{cat.label}</span>
                        <div className="flex-1 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getScoreBgColor(cat.score)} transition-all duration-500`}
                            style={{ width: `${cat.score}%` }}
                          />
                        </div>
                        <span className="font-mono text-sm w-12 text-right">{cat.score}%</span>
                      </div>
                    ))}
                  </div>
                  {dictResult.extraction.industry && (
                    <div className="mt-3 text-xs text-text-muted">
                      Detected: <span className="text-text">{dictResult.extraction.industry}</span>
                      {dictResult.extraction.roleType && <> / <span className="text-text">{dictResult.extraction.roleType.replace(/_/g, ' ')}</span></>}
                    </div>
                  )}
                </div>
                )}

                {/* Category Breakdown — AI path */}
                {analysis && (
                <div className="flex-1">
                  <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
                    Category Scores
                  </h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    {[
                      { label: 'Skills', score: analysis.categoryScores?.skills || 0 },
                      { label: 'Experience', score: analysis.categoryScores?.experience || 0 },
                      { label: 'Keywords', score: analysis.categoryScores?.keywords || 0 },
                      { label: 'Education', score: analysis.categoryScores?.education || 0 },
                      { label: 'Certifications', score: analysis.categoryScores?.certifications || 0 },
                      ...(analysis.categoryScores?.clearance !== null ? [{ label: 'Clearance', score: analysis.categoryScores?.clearance || 0 }] : []),
                    ].map((cat) => (
                      <div key={cat.label} className="flex items-center gap-3">
                        <span className="text-sm text-text-muted w-24">{cat.label}</span>
                        <div className="flex-1 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getScoreBgColor(cat.score)} transition-all duration-500`}
                            style={{ width: `${cat.score}%` }}
                          />
                        </div>
                        <span className="font-mono text-sm w-12 text-right">{cat.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                )}
              </div>
            </Card>

            {/* What You Have + Gaps */}
            {dictResult && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* What You Have */}
              <Card className="p-6">
                <h3 className="font-heading text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-status-green"></span>
                  <span className="text-status-green">What You Have</span>
                </h3>
                <div className="space-y-3">
                  {/* Matched Skills */}
                  {(dictResult.match.categories.requiredSkills.matched.length > 0 || dictResult.match.categories.preferredSkills.matched.length > 0) && (() => {
                    const SKILL_BLACKLIST = new Set(['support', 'teams', 'team', 'management', 'services'])
                    const filtered = [...dictResult.match.categories.requiredSkills.matched, ...dictResult.match.categories.preferredSkills.matched]
                      .filter(s => !SKILL_BLACKLIST.has(s.toLowerCase()))
                    return filtered.length > 0 ? (
                      <div>
                        <div className="text-xs text-text-muted mb-2">Matched Skills</div>
                        <div className="flex flex-wrap gap-1.5">
                          {filtered.map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs bg-status-green/15 text-status-green border border-status-green/30 rounded-md">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null
                  })()}

                  {/* Matched Certs */}
                  {dictResult.match.categories.certifications.matched.length > 0 && (
                    <div>
                      <div className="text-xs text-text-muted mb-2">Certifications</div>
                      <div className="flex flex-wrap gap-1.5">
                        {dictResult.match.categories.certifications.matched.map((cert, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs bg-status-green/15 text-status-green border border-status-green/30 rounded-md">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status rows for education, experience, clearance */}
                  {dictResult.match.categories.education.met && dictResult.extraction.educationRequired && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-status-green">✓</span>
                      <span className="text-text-muted">Education: {dictResult.match.categories.education.candidate || 'Met'}</span>
                    </div>
                  )}
                  {dictResult.match.categories.experience.met && dictResult.extraction.yearsRequired !== null && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-status-green">✓</span>
                      <span className="text-text-muted">Experience: {dictResult.match.categories.experience.candidate}+ years (requires {dictResult.extraction.yearsRequired})</span>
                    </div>
                  )}
                  {dictResult.match.categories.clearance.met && dictResult.extraction.clearanceRequired && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-status-green">✓</span>
                      <span className="text-text-muted">Clearance: {dictResult.match.categories.clearance.candidate}</span>
                    </div>
                  )}

                  {/* Exceeds */}
                  {dictResult.match.exceeds.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <div className="text-xs text-text-muted mb-2">Exceeds Requirements</div>
                      {dictResult.match.exceeds.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm mb-1">
                          <span className="text-gold">★</span>
                          <span className="text-text-muted">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Empty state */}
                  {dictResult.match.categories.requiredSkills.matched.length === 0 &&
                   dictResult.match.categories.preferredSkills.matched.length === 0 &&
                   dictResult.match.categories.certifications.matched.length === 0 && (
                    <p className="text-sm text-text-dim">No matching skills or certifications found in your profile.</p>
                  )}
                </div>
              </Card>

              {/* Gaps to Address */}
              <Card className="p-6">
                <h3 className="font-heading text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-status-amber"></span>
                  <span className="text-status-amber">Gaps to Address</span>
                </h3>
                {dictResult.match.gaps.length > 0 ? (
                  <div className="space-y-3 max-h-80 overflow-auto">
                    {dictResult.match.gaps.map((gap, idx) => {
                      const isAddressed = addressedGaps.has(gap.keyword)
                      return (
                        <div key={idx} className={`p-3 rounded-lg border transition-all ${
                          isAddressed
                            ? 'bg-status-green/5 border-status-green/20'
                            : 'bg-bg-tertiary border-border'
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-semibold ${isAddressed ? 'text-status-green' : 'text-text'}`}>
                              {isAddressed ? '✓ ' : ''}{gap.keyword}
                            </span>
                            <span className={`px-1.5 py-0.5 text-[10px] font-semibold uppercase rounded ${
                              isAddressed
                                ? 'bg-status-green/15 text-status-green'
                                : gap.severity === 'high'
                                  ? 'bg-status-red/15 text-status-red'
                                  : 'bg-status-amber/15 text-status-amber'
                            }`}>
                              {isAddressed ? 'Addressed' : gap.severity === 'high' ? 'Required' : 'Preferred'}
                            </span>
                          </div>
                          {gap.recommendation && (
                            <p className="text-xs text-text-dim mb-2 leading-relaxed">{gap.recommendation}</p>
                          )}
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => addressGap(gap.keyword)}
                              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                                isAddressed
                                  ? 'bg-status-green/15 text-status-green border border-status-green/30'
                                  : 'bg-bg-secondary text-text-muted hover:text-text border border-border hover:border-gold/30'
                              }`}
                            >
                              {isAddressed ? '✓ I have this' : 'I already have this'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-text-dim">No gaps identified. Your profile covers the requirements.</p>
                )}
              </Card>
            </div>
            )}

            {/* ATS Keywords */}
            {dictResult && dictResult.extraction.atsKeywords.length > 0 && (
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                  <div>
                    <h3 className="font-heading text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                      <span className="text-gold">◈</span> ATS Keywords to Include
                    </h3>
                    <p className="text-xs text-text-dim mt-1">
                      {selectedKeywords.size} of {totalKeywordCount} selected — click to toggle
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Select All / Deselect All */}
                    <button
                      onClick={() => selectAllKeywords(selectedKeywords.size < totalKeywordCount)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-text-muted hover:text-text bg-bg-secondary border border-border rounded transition-colors"
                    >
                      {selectedKeywords.size < totalKeywordCount ? 'Select All' : 'Deselect All'}
                    </button>
                    {/* Add to Resume */}
                    <div className="relative" ref={keywordDropdownRef}>
                      <button
                        onClick={() => {
                          setShowKeywordResumeDropdown(!showKeywordResumeDropdown)
                          setKeywordAddResult(null)
                        }}
                        disabled={addingKeywords || selectedKeywords.size === 0}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gold text-bg border border-gold rounded-md hover:bg-gold/90 transition-colors disabled:opacity-50"
                      >
                        {addingKeywords ? (
                          <><span className="animate-spin">⟳</span> Adding...</>
                        ) : (
                          <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg> Add {selectedKeywords.size} to Resume</>
                        )}
                      </button>
                      {showKeywordResumeDropdown && (
                        <div className="absolute right-0 top-full mt-1 w-64 bg-bg-secondary border border-border rounded-lg shadow-lg z-20 overflow-hidden">
                          <div className="px-3 py-2 border-b border-border">
                            <p className="text-xs text-text-muted">Select a resume to add {selectedKeywords.size} keyword{selectedKeywords.size !== 1 ? 's' : ''} to:</p>
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {resumes.map(resume => (
                              <button
                                key={resume.id}
                                onClick={() => handleAddKeywordsToResume(resume.id)}
                                disabled={addingKeywords}
                                className="w-full text-left px-3 py-2.5 text-sm hover:bg-bg-tertiary transition-colors flex items-center gap-2 border-b border-border/50 last:border-0 disabled:opacity-50"
                              >
                                <span className="text-gold text-xs">◫</span>
                                <span className="truncate text-text">{resume.title || 'Untitled Resume'}</span>
                                {resume.id === selectedResumeId && (
                                  <span className="ml-auto text-xs text-gold">current</span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Copy Keywords */}
                    <button
                      onClick={() => {
                        const keywords = [...selectedKeywords].join(', ')
                        import('@/lib/clipboard').then(({ copyToClipboard }) =>
                          copyToClipboard(keywords).then(() => {
                            setCopiedKeywords(true)
                            setTimeout(() => setCopiedKeywords(false), 2000)
                          })
                        )
                      }}
                      disabled={selectedKeywords.size === 0}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-muted hover:text-text transition-colors disabled:opacity-50"
                    >
                      {copiedKeywords ? (
                        <><span>✓</span> Copied</>
                      ) : (
                        <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth="2"/></svg> Copy</>
                      )}
                    </button>
                  </div>
                </div>
                {/* Success/error message */}
                {keywordAddResult && (
                  <div className={`mb-3 px-3 py-2 text-xs rounded-md ${keywordAddResult.includes('Failed') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                    {keywordAddResult}
                  </div>
                )}
                {/* Toggleable keyword chips */}
                <div className="flex flex-wrap gap-2">
                  {dictResult.extraction.atsKeywords.map((kw, idx) => {
                    const isOnResume = resumeSkillNames.has(kw.keyword.toLowerCase())
                    const isSelected = selectedKeywords.has(kw.keyword)
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleKeyword(kw.keyword)}
                        className={`px-2.5 py-1 text-xs rounded-md border transition-all ${
                          isOnResume && isSelected
                            ? 'bg-status-green/15 text-status-green border-status-green/30'
                            : isOnResume && !isSelected
                              ? 'border-status-green/20 text-status-green/50 line-through opacity-60'
                              : isSelected
                                ? 'bg-gold/15 text-gold border-gold/30 font-semibold ring-1 ring-gold/20'
                                : 'bg-bg-tertiary text-text-dim border-border/50 opacity-50'
                        }`}
                      >
                        {isOnResume && isSelected ? '✓ ' : !isOnResume && isSelected ? '★ ' : ''}{kw.keyword}
                      </button>
                    )
                  })}
                  {/* Custom keywords */}
                  {customKeywords.map((kw, idx) => {
                    const isOnResume = resumeSkillNames.has(kw.toLowerCase())
                    const isSelected = selectedKeywords.has(kw)
                    return (
                      <button
                        key={`custom-${idx}`}
                        onClick={() => toggleKeyword(kw)}
                        className={`px-2.5 py-1 text-xs rounded-md border transition-all ${
                          isOnResume && isSelected
                            ? 'bg-status-green/15 text-status-green border-status-green/30'
                            : isOnResume && !isSelected
                              ? 'border-status-green/20 text-status-green/50 line-through opacity-60'
                              : isSelected
                                ? 'bg-status-blue/10 text-status-blue border-status-blue/20'
                                : 'bg-bg-tertiary text-text-dim border-border/50 opacity-50'
                        }`}
                      >
                        {isOnResume && isSelected ? '✓ ' : !isOnResume && isSelected ? '★ ' : ''}{kw}
                        <span className="ml-1 text-[10px] opacity-60">custom</span>
                      </button>
                    )
                  })}
                </div>
                {/* Legend */}
                <div className="flex items-center gap-4 mt-3 text-[10px] text-text-dim">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-green"></span> Already on resume</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gold"></span> ★ Selected to add</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-bg-tertiary border border-border"></span> Not selected</span>
                </div>
                {/* Manual keyword input */}
                <div className="mt-4 flex items-center gap-2">
                  <input
                    type="text"
                    name="manual-keyword"
                    autoComplete="off"
                    value={manualKeyword}
                    onChange={(e) => setManualKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addManualKeyword()}
                    placeholder="Add a keyword..."
                    className="flex-1 bg-bg-secondary border border-border rounded-md px-3 py-1.5 text-sm text-text placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold/25 transition-colors"
                  />
                  <button
                    onClick={addManualKeyword}
                    disabled={!manualKeyword.trim()}
                    className="px-3 py-1.5 text-xs font-semibold bg-bg-secondary text-text-muted border border-border rounded-md hover:text-text hover:border-gold/30 transition-colors disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </Card>
            )}

            {/* Professional Summary Templates */}
            {summaryTemplates.length > 0 && tailoredResume && (
              <Card className="p-6">
                <h3 className="font-heading text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-2">
                  <span className="text-gold">◈</span> Professional Summary
                </h3>
                <p className="text-xs text-text-dim mb-4">
                  Pick a summary template matched to your rank and this job&apos;s industry. You can edit it later on your resume.
                </p>
                <div className="space-y-3">
                  {(showAllSummaries ? summaryTemplates : summaryTemplates.slice(0, 3)).map((tmpl, idx) => {
                    const isApplied = appliedSummaryIdx === idx
                    return (
                      <div key={tmpl.id || idx} className={`p-4 rounded-lg border transition-all ${
                        isApplied ? 'bg-status-green/5 border-status-green/20' : 'bg-bg-tertiary border-border hover:border-gold/30'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-gold/10 text-gold">
                            {tmpl.rank_tier.replace(/_/g, ' ')}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-bg-secondary text-text-dim">
                            {tmpl.target_industry}
                          </span>
                        </div>
                        <p className="text-sm text-text-muted leading-relaxed mb-3">{tmpl.template_text}</p>
                        <div className="flex items-center gap-2">
                          {isApplied ? (
                            <span className="px-2.5 py-1 text-xs font-semibold text-status-green">✓ Applied</span>
                          ) : (
                            <button
                              onClick={() => applySummaryTemplate(tmpl.template_text, idx)}
                              className="px-2.5 py-1 text-xs font-semibold text-gold hover:text-gold-bright bg-gold/10 border border-gold/30 rounded transition-colors hover:bg-gold/20"
                            >
                              Use This Summary
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                {summaryTemplates.length > 3 && (
                  <button
                    onClick={() => setShowAllSummaries(prev => !prev)}
                    className="mt-3 text-xs text-gold hover:text-gold-bright transition-colors"
                  >
                    {showAllSummaries ? 'Show fewer' : `See ${summaryTemplates.length - 3} more options`}
                  </button>
                )}
              </Card>
            )}

            {/* ═══ Section: Bullet Rewrite ═══ */}
            <div className="border-t border-border my-8" />
            <div>
              <h2 className="font-heading text-lg font-bold uppercase tracking-wider flex items-center gap-2 mb-1">
                <span className="text-gold">◆</span> Rewrite Your Bullets
              </h2>
              <p className="text-text-muted text-sm">
                Select a bullet from your resume and we&apos;ll tailor it to the job posting
              </p>
            </div>

            {/* Dictionary Bullet Translations */}
            {dictResult && selectedResume && (dictBulletTranslations.size > 0 || dictTranslating) && (
              <Card className="p-6">
                <h3 className="font-heading text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="text-gold">◆</span>
                  <span>Bullet Translations</span>
                  {dictTranslating && (
                    <span className="text-xs font-normal text-text-dim animate-pulse ml-2">
                      translating...
                    </span>
                  )}
                </h3>
                <p className="text-xs text-text-dim mb-4">
                  Military terms in your bullets translated to civilian language. Copy the improved version to use in your resume.
                </p>
                <div className="space-y-3 max-h-96 overflow-auto">
                  {(selectedResume.content?.experiences ?? []).flatMap((exp: any, expIdx: number) =>
                    (exp.bullets ?? []).map((bullet: any, bIdx: number) => {
                      const key = `${expIdx}-${bIdx}`
                      const translated = dictBulletTranslations.get(key)
                      if (!translated) return null

                      const original = bullet.translated_text || bullet.original_text || ''
                      const expLabel = exp.civilian_title || exp.job_title || `Experience ${expIdx + 1}`
                      const isCopied = copiedBulletKey === key

                      const isApplied = tailoredResume?.appliedBullets.has(key)

                      return (
                        <div key={key} className={`p-3 rounded-lg border transition-all ${isApplied ? 'bg-status-green/5 border-status-green/20' : 'bg-bg-tertiary border-border'}`}>
                          <div className="text-[10px] text-text-dim uppercase tracking-wider mb-1.5">{expLabel}</div>
                          <div className="text-sm text-text-dim line-through mb-1.5">{original}</div>
                          <div className="text-sm text-text mb-2">{'\u2192'} {translated}</div>
                          <div className="flex items-center gap-2">
                            {isApplied ? (
                              <span className="px-2.5 py-1 text-xs font-semibold text-status-green">✓ Applied</span>
                            ) : (
                              <button
                                onClick={() => applyDictBullet(expIdx, bIdx, translated)}
                                className="px-2.5 py-1 text-xs font-semibold text-gold hover:text-gold-bright bg-gold/10 border border-gold/30 rounded transition-colors hover:bg-gold/20"
                              >
                                Apply to Resume
                              </button>
                            )}
                            <button
                              onClick={() => {
                                import('@/lib/clipboard').then(({ copyToClipboard }) =>
                                  copyToClipboard(translated).then(() => {
                                    setCopiedBulletKey(key)
                                    setTimeout(() => setCopiedBulletKey(null), 2000)
                                  })
                                )
                              }}
                              className="px-2.5 py-1 text-xs font-semibold text-text-muted hover:text-text bg-bg-secondary border border-border rounded transition-colors"
                            >
                              {isCopied ? '✓ Copied' : 'Copy'}
                            </button>
                          </div>
                        </div>
                      )
                    })
                  ).filter(Boolean)}
                </div>
                {!hasPaidAccess && (
                  <div className="mt-4 p-3 rounded-lg bg-gold/5 border border-gold/20 flex items-center gap-3">
                    <svg className="w-4 h-4 text-gold flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                    <p className="text-xs text-text-dim">
                      <UpgradeLink className="text-gold hover:text-gold-bright hover:underline font-semibold">Upgrade to Core</UpgradeLink>
                      {' '}for AI-powered bullet rewrites with apply-to-resume functionality.
                    </p>
                  </div>
                )}
              </Card>
            )}

            {/* ═══ Preview Tailored Resume (Dictionary path) ═══ */}
            {dictResult && !analysis && selectedResume && tailoredResume && (
              <>
                <div className="border-t border-border my-8" />
                <div>
                  <h2 className="font-heading text-lg font-bold uppercase tracking-wider flex items-center gap-2 mb-1">
                    <span className="text-gold">◫</span> Your Tailored Resume
                  </h2>
                  <p className="text-text-muted text-sm">
                    Skills section shows your selected ATS keywords. Applied bullets marked with ✦
                  </p>
                </div>
                <Card className="p-6 bg-bg-tertiary/30">
                  {/* Template Selector */}
                  <div className="flex items-center gap-4 mb-4">
                    <label className="text-xs text-text-muted uppercase tracking-wider font-semibold">Template:</label>
                    <select
                      autoComplete="off"
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value as TemplateId)}
                      className="bg-bg-secondary border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-gold"
                    >
                      {Object.values(TEMPLATES).map((t) => {
                        const isLocked = !t.free && !hasPaidAccess
                        return (
                          <option key={t.id} value={t.id} disabled={isLocked}>
                            {t.name} {isLocked ? '(CORE+)' : ''}
                          </option>
                        )
                      })}
                    </select>
                  </div>

                  {/* Preview */}
                  <div className="bg-bg-card rounded-lg shadow-lg overflow-hidden" style={{ maxHeight: '600px', overflow: 'auto' }}>
                    <ResumePreview
                      template={selectedTemplate}
                      resumeType="private"
                      content={tailoredResume.content}
                      highlightedTerms={[...selectedKeywords]}
                    />
                  </div>
                </Card>
              </>
            )}

            {/* Blurred AI Preview (free users only, no AI analysis) */}
            {dictResult && !hasPaidAccess && !analyzing && !analysis && (
              <div className="relative">
                {/* Blurred fake AI analysis */}
                <Card className="p-6 select-none pointer-events-none" aria-hidden="true">
                  <div className="blur-[6px] opacity-60">
                    <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full border-4 border-gold/40 flex items-center justify-center">
                          <span className="font-heading text-3xl font-bold text-gold">78%</span>
                        </div>
                        <span className="text-xs text-text-muted mt-2">Overall Match</span>
                      </div>
                      <div className="flex-1 space-y-2">
                        {['Skills Match', 'Experience', 'Education', 'Keywords'].map((cat) => (
                          <div key={cat} className="flex items-center gap-3">
                            <span className="text-xs text-text-muted w-24">{cat}</span>
                            <div className="flex-1 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                              <div className="h-full bg-gold rounded-full" style={{ width: `${60 + Math.random() * 30}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-bg-tertiary rounded-lg">
                        <p className="text-xs font-semibold mb-2">Priority Actions</p>
                        <div className="space-y-1.5">
                          <div className="h-3 bg-bg-secondary rounded w-full" />
                          <div className="h-3 bg-bg-secondary rounded w-4/5" />
                          <div className="h-3 bg-bg-secondary rounded w-3/4" />
                        </div>
                      </div>
                      <div className="p-3 bg-bg-tertiary rounded-lg">
                        <p className="text-xs font-semibold mb-2">AI Recommendations</p>
                        <div className="space-y-1.5">
                          <div className="h-3 bg-bg-secondary rounded w-full" />
                          <div className="h-3 bg-bg-secondary rounded w-5/6" />
                          <div className="h-3 bg-bg-secondary rounded w-2/3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Overlay CTA */}
                <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/40 rounded-xl">
                  <div className="text-center px-6 py-5 bg-bg-secondary border border-gold/30 rounded-xl shadow-lg max-w-sm">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gold/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                      </svg>
                    </div>
                    <h3 className="font-heading text-base font-bold uppercase tracking-wider mb-1">Unlock AI Analysis</h3>
                    <p className="text-xs text-text-muted mb-4">
                      See skill gaps, get rewrite suggestions, and tailored recommendations to push your match score higher.
                    </p>
                    <Button onClick={openUpgradeModal} size="sm">
                      View Plans
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ AI ANALYSIS RESULTS ═══ */}
            {analysis && !analyzing && (
              <>
            {/* Skills Match Card */}
            <Card className="p-6">
              <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="text-gold">◫</span> Skills Analysis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Matching Skills */}
                <div>
                  <h3 className="text-xs font-semibold text-status-green uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-status-green"></span>
                    Your Matching Skills ({analysis.categoryDetails?.skills?.matched?.length || 0})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.categoryDetails?.skills?.matched?.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 text-sm bg-status-green/15 text-status-green border border-status-green/30 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                    {(!analysis.categoryDetails?.skills?.matched || analysis.categoryDetails.skills.matched.length === 0) && (
                      <span className="text-sm text-text-muted">No matching skills found</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div>
                  <h3 className="text-xs font-semibold text-status-amber uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-status-amber"></span>
                    Missing Skills ({analysis.categoryDetails?.skills?.missing?.length || 0})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.categoryDetails?.skills?.missing?.map((skill, idx) => {
                      const isAdded = tailoredResume?.addedSkills.includes(skill)
                      return (
                        <button
                          key={idx}
                          onClick={() => !isAdded && addSkill(skill)}
                          disabled={isAdded}
                          className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                            isAdded
                              ? 'bg-gold/20 text-gold border border-gold/30'
                              : 'bg-status-amber/15 text-status-amber border border-status-amber/30 hover:bg-status-amber/25 cursor-pointer'
                          }`}
                        >
                          {isAdded ? '✓ ' : '+ '}{skill}
                        </button>
                      )
                    })}
                    {(!analysis.categoryDetails?.skills?.missing || analysis.categoryDetails.skills.missing.length === 0) && (
                      <span className="text-sm text-text-muted">No missing skills identified</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Recommendations Card */}
            <Card className="p-6">
              <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="text-gold">◎</span> Recommendations
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Priority Actions */}
                {analysis.priorityActions?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">
                      Priority Actions
                    </h3>
                    <div className="space-y-2">
                      {analysis.priorityActions.map((action, idx) => {
                        const isObject = typeof action === 'object' && action !== null
                        const actionText = isObject ? (action as any).action : action
                        const impact = isObject ? (action as any).impact : null
                        return (
                          <div
                            key={idx}
                            className="flex items-start gap-3 p-3 bg-gold/10 border border-gold/20 rounded-lg"
                          >
                            <span className="font-mono text-gold font-bold text-sm">{idx + 1}</span>
                            <div className="flex-1">
                              <span className="text-sm">{actionText}</span>
                              {impact && (
                                <span className="ml-2 text-xs text-status-green">({impact})</span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Strengths & Gaps */}
                <div className="space-y-4">
                  {/* Strengths */}
                  {analysis.strengths?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-status-green uppercase tracking-wider mb-3">
                        Your Strengths
                      </h3>
                      <div className="space-y-2">
                        {analysis.strengths.slice(0, 4).map((strength, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-status-green mt-0.5">✓</span>
                            <span className="text-text-muted">{strength}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gaps */}
                  {analysis.gaps?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-status-amber uppercase tracking-wider mb-3">
                        Areas to Address
                      </h3>
                      <div className="space-y-2">
                        {analysis.gaps.slice(0, 4).map((gap, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <span className={gap.severity === 'high' ? 'text-status-red' : 'text-status-amber'}>
                              {gap.severity === 'high' ? '!' : '⚠'}
                            </span>
                            <span className="text-text-muted">{gap.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Assessment */}
              {analysis.assessment && (
                <div className="mt-6 p-4 bg-bg-tertiary rounded-lg border border-border">
                  <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                    AI Assessment
                  </h3>
                  <p className="text-sm text-text leading-relaxed">{analysis.assessment}</p>
                </div>
              )}
            </Card>

            {/* Upgrade Prompt for Free Users */}
            {!hasPaidAccess && (
              <Card className="p-6 bg-gradient-to-r from-gold/5 to-transparent border-gold/20">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg font-bold mb-1">Unlock AI-Powered Rewrites</h3>
                    <p className="text-text-muted text-sm">
                      Your resume is {analysis.overallScore}% matched. Upgrade to Core or Full for AI-generated bullet point rewrites
                      that can push your match score to 90%+.
                    </p>
                  </div>
                  <Button onClick={openUpgradeModal}>
                    View Plans
                  </Button>
                </div>
              </Card>
            )}

            {/* Section: Bullet Rewrites (AI) */}
            <div className="border-t border-border my-8" />
            <div>
              <h2 className="font-heading text-lg font-bold uppercase tracking-wider flex items-center gap-2 mb-1">
                <span className="text-gold">◆</span> Rewrite Your Bullets
              </h2>
              <p className="text-text-muted text-sm">
                Select a bullet from your resume and we&apos;ll tailor it to the job posting
              </p>
            </div>

            {/* Loading state for suggestions */}
            {hasPaidAccess && suggestionsLoading && !analysis.bulletSuggestions?.length && (
              <Card className="p-6">
                <div className="flex items-center gap-3 text-text-muted">
                  <div className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                  <span className="text-sm">Loading AI-powered rewrite suggestions...</span>
                </div>
              </Card>
            )}

            {/* Pro Features - Bullet Rewrites */}
            {hasPaidAccess && analysis.bulletSuggestions?.filter(s => s.action === 'rewrite').length > 0 && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <span className="text-gold">◆</span> AI-Powered Rewrites
                    {translating && (
                      <span className="text-xs font-normal text-text-dim animate-pulse ml-2">
                        translating...
                      </span>
                    )}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted">
                      {analysis.bulletSuggestions.filter(s => s.action === 'rewrite').length} suggestions available
                    </span>
                    <Button size="sm" onClick={openApplyAllPreview}>
                      Review &amp; Apply All
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 max-h-80 overflow-auto">
                  {analysis.bulletSuggestions
                    .filter(s => s.action === 'rewrite')
                    .slice(0, 5)
                    .map((suggestion, idx) => {
                      const key = `${suggestion.experienceIndex}-${suggestion.bulletIndex}`
                      const isApplied = tailoredResume?.appliedBullets.has(key)
                      const translated = translatedSuggestions.get(key)
                      const displayText = translated || suggestion.suggested
                      const wasDictTranslated = translated && translated !== suggestion.suggested

                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg border transition-all ${
                            isApplied
                              ? 'bg-status-green/10 border-status-green/30'
                              : 'bg-bg-tertiary border-border'
                          }`}
                        >
                          <div className="text-sm line-through text-text-dim mb-2">
                            {suggestion.original}
                          </div>
                          <div className="text-sm text-text mb-2">
                            → {displayText}
                          </div>
                          {wasDictTranslated && (
                            <div className="text-[11px] text-text-dim italic mb-2">
                              Dictionary translated military terms
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {suggestion.keywordsAdded?.map((kw, kwIdx) => (
                                <span key={kwIdx} className="px-2 py-0.5 text-xs bg-gold/20 text-gold rounded">
                                  +{kw}
                                </span>
                              ))}
                            </div>
                            {!isApplied ? (
                              <Button size="sm" onClick={() => applyBulletSuggestion(suggestion)}>
                                Apply
                              </Button>
                            ) : (
                              <span className="text-status-green text-sm font-semibold">✓ Applied</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </Card>
            )}

            {/* Section: Preview Tailored Resume (AI path) */}
            {tailoredResume && (
              <>
            <div className="border-t border-border my-8" />
            <div>
              <h2 className="font-heading text-lg font-bold uppercase tracking-wider flex items-center gap-2 mb-1">
                <span className="text-gold">◫</span> Your Tailored Resume
              </h2>
              <p className="text-text-muted text-sm">
                Skills section shows your selected ATS keywords. Applied bullets marked with ✦
              </p>
            </div>

            <Card className="p-6 bg-bg-tertiary/30">
              {/* Template Selector */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <label className="text-xs text-text-muted uppercase tracking-wider font-semibold">Template:</label>
                  <select
                    autoComplete="off"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value as TemplateId)}
                    className="bg-bg-secondary border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-gold"
                  >
                    {Object.values(TEMPLATES).map((t) => {
                      const isLocked = !t.free && !hasPaidAccess
                      return (
                        <option key={t.id} value={t.id} disabled={isLocked}>
                          {t.name} {isLocked ? '(CORE+)' : ''}
                        </option>
                      )
                    })}
                  </select>
                </div>
                {changesSummary.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={resetChanges}>
                    Reset Changes
                  </Button>
                )}
              </div>

              {/* Resume Preview */}
              <div className="bg-bg-card rounded-lg shadow-lg overflow-hidden" style={{ maxHeight: '600px', overflow: 'auto' }}>
                <ResumePreview
                  template={selectedTemplate}
                  resumeType="private"
                  content={(() => {
                    const contentWithExclusions = {
                      ...tailoredResume.content,
                      experiences: tailoredResume.content.experiences?.map((exp: any, expIdx: number) => ({
                        ...exp,
                        bullets: exp.bullets?.map((bullet: any, bulletIdx: number) => {
                          const key = `${expIdx}-${bulletIdx}`
                          const isExcluded = tailoredResume.excludedBullets.has(key)
                          return {
                            ...bullet,
                            status: isExcluded ? 'excluded' : bullet.status,
                          }
                        }),
                      })),
                    }
                    return contentWithExclusions
                  })()}
                  highlightedTerms={[...selectedKeywords]}
                />
              </div>
            </Card>
              </>
            )}
              </>
            )}

            {/* ═══ Apply Suggestions to Resume — gold CTA ═══ */}
            {((analysis?.bulletSuggestions?.length ?? 0) > 0 || (dictResult && dictBulletTranslations.size > 0)) && (
              <Card className="p-6 bg-gold/[0.03] border-gold/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-sm font-bold uppercase tracking-wider">Apply Suggestions to Resume</h3>
                    <p className="text-xs text-text-muted mt-1">Review and apply all improvements at once</p>
                  </div>
                  <Button onClick={openApplyAllPreview}>
                    Apply Suggestions to Resume
                  </Button>
                </div>
              </Card>
            )}

            {/* Changes Summary */}
            {changesSummary.length > 0 && (
              <Card className="p-6 bg-status-green/5 border-status-green/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <span className="text-status-green">✓</span> Applied Changes
                  </h2>
                  <span className="text-sm text-status-green font-semibold">
                    Score improved: {originalScore}% → {currentScore}%
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {changesSummary.map((change, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-status-green">✓</span>
                      <span className="text-text-muted">{change}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ═══ Export Section ═══ */}
            <Card className="p-8 text-center">
              <div className="text-4xl mb-4 text-gold">◈</div>
              <h2 className="font-heading text-xl font-bold uppercase tracking-wider mb-2">
                Your Tailored Resume is Ready
              </h2>
              <p className="text-text-muted text-sm mb-6">
                Download your resume optimized for this position
              </p>

              {/* Summary */}
              <div className="inline-grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                {jobData.company && (
                  <div className="text-center">
                    <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Company</div>
                    <div className="text-sm font-semibold truncate max-w-[120px]">{jobData.company}</div>
                  </div>
                )}
                {jobData.title && (
                  <div className="text-center">
                    <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Position</div>
                    <div className="text-sm font-semibold truncate max-w-[120px]">{jobData.title}</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Match</div>
                  <div className={`text-lg font-bold ${getScoreColor(analysis ? currentScore : adjustedDictScore)}`}>
                    {analysis ? currentScore : adjustedDictScore}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Keywords</div>
                  <div className="text-lg font-bold text-gold">{selectedKeywords.size}</div>
                </div>
              </div>

              {/* Download buttons */}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Button
                  size="lg"
                  onClick={analysis ? handleDownload : handleDownloadDict}
                  disabled={downloading}
                  className="px-8"
                >
                  {downloading ? 'Downloading...' : 'Download PDF'}
                </Button>
                {analysis && tailoredResume && changesSummary.length > 0 && (
                  <Button
                    variant="secondary"
                    onClick={handleSaveTailoredResume}
                    disabled={savingResume}
                  >
                    {savingResume ? 'Saving...' : 'Save as New Resume'}
                  </Button>
                )}
              </div>
            </Card>

            {/* Cover Letter CTA */}
            {(dictResult || analysis) && (
              <Card className="p-6 border-gold/20 bg-gold/5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-heading text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                      <span className="text-gold">◈</span> Ready for a Cover Letter?
                    </h3>
                    <p className="text-xs text-text-muted mt-1">
                      Auto-fill a cover letter template using this job&apos;s details — free, instant, no credits used
                    </p>
                  </div>
                  <button
                    onClick={handleCreateCoverLetter}
                    className="px-5 py-2.5 bg-gold text-bg-primary rounded font-heading font-bold uppercase text-sm hover:bg-gold-bright transition-colors whitespace-nowrap"
                  >
                    Create Cover Letter
                  </button>
                </div>
              </Card>
            )}

            {/* Start New Analysis */}
            <div className="text-center">
              <button
                onClick={handleStartNewAnalysis}
                className="px-6 py-3 text-sm font-semibold text-text-muted hover:text-text bg-bg-secondary border border-border rounded-lg hover:border-gold/30 transition-colors"
              >
                Start a New Analysis
              </button>
            </div>

          </div>
        )}

      </div>

      {showLastUseWarning && (
        <LastUseWarningModal
          featureName="Job Match Analysis"
          tier={hasPaidAccess ? (userPlan === 'full' ? 'full' : 'core') : 'free'}
          limitType="tier"
          onContinue={() => {
            setShowLastUseWarning(false)
            handleAnalyze()
          }}
        />
      )}

      {/* Preview Modal */}
      {previewChanges && previewMode && (
        <TailoredPreviewModal
          title={
            previewMode === 'apply-all'
              ? 'Review Changes'
              : 'Add Keywords to Resume'
          }
          description={
            previewMode === 'apply-all'
              ? 'Review each change before applying to your tailored resume. You can keep, edit, or skip any change.'
              : 'Review which ATS keywords will be added as skills. Skip any you don\'t want.'
          }
          targetResumeName={
            previewMode === 'keywords'
              ? (resumes.find(r => r.id === previewTargetResumeId)?.title || 'Resume')
              : (selectedResume?.name || 'Tailored Resume')
          }
          changes={previewChanges}
          onApply={handlePreviewApply}
          onCancel={() => {
            setPreviewChanges(null)
            setPreviewMode(null)
            setPreviewTargetResumeId(null)
          }}
          applying={applyingPreview}
        />
      )}
    </div>
  )
}
