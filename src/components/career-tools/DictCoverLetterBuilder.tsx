'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { formatPhoneForDisplay } from '@/lib/formatPhone'
import { fillTemplate } from '@/lib/dictionary/templateFiller'
import { polishCoverLetter } from '@/lib/dictionary/outputPolisher'
import { extractKeywords } from '@/lib/dictionary/keywordExtractor'
import { buildUserProfile } from '@/lib/dictionary/matchScorer'
import { getDictionary } from '@/lib/dictionary/dictionaryQueries'
import type {
  ExtractionResult,
  UserProfileForMatch,
  FilledTemplate,
  DictCoverLetterTemplate,
} from '@/lib/dictionary/types'
import { getUserTier, isPaidTier } from '@/lib/tier-utils'
import { useUpgradeModal } from '@/components/modals/UpgradeModal'
import { LastUseWarningModal } from '@/components/paywall/LastUseWarningModal'
import { usePostActionModal } from '@/components/paywall/PostActionModalProvider'

interface DictCoverLetterBuilderProps {
  userProfile: any
  experiences: any[]
  skills: string[]
  certifications?: any[]
  education?: any[]
  onBack: () => void
  userId: string
  currentUsage: number
  usageLimit: number
  userPlan?: string
  onAIGenerated?: () => void
}

const SESSION_KEY = 'coverLetterJobData'

// Word count limits by length setting
const WORD_LIMITS = {
  brief: 200,
  standard: 300,
  detailed: 400,
}

export function DictCoverLetterBuilder({
  userProfile,
  experiences,
  skills,
  certifications = [],
  education = [],
  onBack,
  userId,
  currentUsage,
  usageLimit,
  userPlan,
  onAIGenerated,
}: DictCoverLetterBuilderProps) {
  const isFree = !isPaidTier(getUserTier({ tier: userPlan }))
  const aiRemaining = usageLimit - currentUsage
  const { openUpgradeModal } = useUpgradeModal()
  const { triggerPostActionModal } = usePostActionModal()

  // Context inputs (shared between template & AI modes)
  const [company, setCompany] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [hiringManager, setHiringManager] = useState('')
  const [jobDescription, setJobDescription] = useState('')

  // Template state
  const [templates, setTemplates] = useState<DictCoverLetterTemplate[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [filledResult, setFilledResult] = useState<FilledTemplate | null>(null)
  const [extraction, setExtraction] = useState<ExtractionResult | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)

  // User-selectable field overrides for template values
  const [fieldOverrides, setFieldOverrides] = useState<Record<string, string>>({})

  // Export state
  const [isDownloading, setIsDownloading] = useState(false)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const exportMenuRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [downloadToast, setDownloadToast] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // AI customization state
  const [coverLetterTone, setCoverLetterTone] = useState<'professional' | 'conversational' | 'assertive'>('professional')
  const [coverLetterLength, setCoverLetterLength] = useState<'brief' | 'standard' | 'detailed'>('standard')
  const [targetIndustry, setTargetIndustry] = useState<'defense' | 'private' | 'federal' | 'startup'>('defense')
  const [openingStyle, setOpeningStyle] = useState<'achievement' | 'connection' | 'problem' | 'direct'>('achievement')
  const [emphasisAreas, setEmphasisAreas] = useState<string[]>([])
  const [selectedAchievements, setSelectedAchievements] = useState<string[]>([])

  // AI output state
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiRefining, setAiRefining] = useState(false)
  const [validationWarnings, setValidationWarnings] = useState<string[]>([])

  // Last-use warning modal
  const [showLastUseWarning, setShowLastUseWarning] = useState(false)
  const [pendingIsRegenerate, setPendingIsRegenerate] = useState(false)

  // NEW STATE: Single editor text source of truth
  const [editorText, setEditorText] = useState('')
  // NEW STATE: Left panel collapse
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  // NEW STATE: Settings popover toggle
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Debounce timer for template re-fill on form changes
  const fillTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Track the JD text that was last used for extraction
  const lastExtractedJDRef = useRef<string>('')

  // Ref for settings popover click-outside
  const settingsRef = useRef<HTMLDivElement>(null)

  // Build applicant info for preview/export
  const applicantName = `${userProfile?.first_name || ''} ${userProfile?.last_name || ''}`.trim() || 'Your Name'
  const applicantEmail = userProfile?.email || ''
  const applicantPhone = formatPhoneForDisplay(userProfile?.phone) || ''
  const applicantCity = userProfile?.city || ''
  const applicantState = userProfile?.state || ''
  const applicantLinkedIn = userProfile?.linkedin_url || ''
  const contactParts = [applicantEmail, applicantPhone, [applicantCity, applicantState].filter(Boolean).join(', ')].filter(Boolean)

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }, [])

  // Load dictionary templates on mount
  useEffect(() => {
    getDictionary().then(dict => {
      setTemplates(dict.coverLetterTemplates ?? [])
    }).catch(() => {})
  }, [])

  // Close export menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setExportMenuOpen(false)
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setSettingsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Read sessionStorage on mount (from job match flow)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        if (data.company) setCompany(data.company)
        if (data.title) setJobTitle(data.title)
        if (data.description) {
          setJobDescription(data.description)
          lastExtractedJDRef.current = data.description.trim()
        }
        if (data.extraction) setExtraction(data.extraction)
        sessionStorage.removeItem(SESSION_KEY)
      }
    } catch {
      // Ignore parse errors
    }
  }, [])

  // Auto-populate company/title from extraction result when fields are empty
  useEffect(() => {
    if (!extraction) return
    if (!company && extraction.companyName) {
      setCompany(extraction.companyName)
    }
    if (!jobTitle && extraction.jobTitle) {
      setJobTitle(extraction.jobTitle)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extraction])

  // Build user profile for template filler
  const userProfileForMatch = useMemo((): UserProfileForMatch => {
    return buildUserProfile(
      userProfile || {},
      skills,
      (certifications || []).map((c: any) => ({ name: c.name || c })),
      (education || []).map((e: any) => ({
        degree: e.degree_type ?? e.degree ?? null,
        field_of_study: e.field_of_study ?? null,
        school: e.school_name ?? e.school ?? null,
      })),
      (experiences || []).map((e: any) => ({
        title: e.job_title || e.civilian_title || e.title || null,
        organization: e.company || e.organization || null,
        bullets: e.bullets,
        experience_bullets: e.experience_bullets,
      })),
    )
  }, [userProfile, skills, certifications, education, experiences])

  // Build dropdown options for field selectors
  const fieldOptions = useMemo(() => {
    const rawCertNames = (certifications || []).map((c: any) => c.name || c).filter(Boolean) as string[]
    const dedupedCerts = deduplicateCerts(rawCertNames)

    // Skills sorted by JD relevance
    const jdSkillsLower = new Set((extraction?.requiredSkills ?? []).map((s: string) => s.toLowerCase()))
    const sortedSkills = [
      ...skills.filter(s => jdSkillsLower.has(s.toLowerCase())),
      ...skills.filter(s => !jdSkillsLower.has(s.toLowerCase())),
    ]

    // Metric bullets for achievement selection
    const allBullets = (experiences || []).flatMap((e: any) => {
      const bullets = e.experience_bullets ?? e.bullets ?? []
      return (Array.isArray(bullets) ? bullets : []).map((b: any) =>
        typeof b === 'string' ? b : b?.translated_text || b?.original_text || ''
      ).filter(Boolean)
    })
    const metricPattern = /\d{2,}%|\$[\d,.]+[KkMmBb]?|\b\d{2,}\b/
    const metricBullets = allBullets.filter((b: string) => metricPattern.test(b))
    const achievementBullets = metricBullets.length > 0 ? metricBullets : allBullets.slice(0, 5)

    // Education entries
    const eduEntries = (education || []).map((e: any) => ({
      label: [e.degree_type || e.degree, e.field_of_study].filter(Boolean).join(' in ') || 'Degree',
      degree: e.degree_type || e.degree || '',
      field: e.field_of_study || '',
    }))

    return { dedupedCerts, sortedSkills, achievementBullets, eduEntries }
  }, [certifications, skills, education, experiences, extraction])

  // Run extraction when JD changes (if no extraction from sessionStorage)
  const handleExtractKeywords = useCallback(async () => {
    if (!jobDescription.trim()) return
    setIsExtracting(true)
    try {
      const result = await extractKeywords(jobDescription)
      setExtraction(result)
      lastExtractedJDRef.current = jobDescription.trim()
    } catch (err) {
      console.error('Keyword extraction failed:', err)
    } finally {
      setIsExtracting(false)
    }
  }, [jobDescription])

  // Score templates by match quality
  const scoredTemplates = useMemo(() => {
    if (templates.length === 0) return []
    const industry = extraction?.industry ?? userProfile?.target_industry ?? ''
    const roleType = extraction?.roleType ?? ''

    return templates.map(t => {
      let score = 0
      if (industry && t.industry.toLowerCase().includes(industry.toLowerCase())) score += 2
      if (roleType && t.role_type.toLowerCase().includes(roleType.toLowerCase())) score += 1
      return { ...t, score }
    }).sort((a, b) => b.score - a.score)
  }, [templates, extraction, userProfile])

  // Auto-select best template when extraction arrives
  useEffect(() => {
    if (scoredTemplates.length > 0 && !selectedTemplateId) {
      setSelectedTemplateId(scoredTemplates[0].id)
    }
  }, [scoredTemplates, selectedTemplateId])

  // Word count from editorText
  const wordCount = useMemo(() => {
    if (!editorText) return 0
    return editorText.split(/\s+/).filter(w => w.length > 0).length
  }, [editorText])

  const aiWordLimit = WORD_LIMITS[coverLetterLength]
  const aiIsOverLimit = !isFree && wordCount > aiWordLimit
  const aiIsNearLimit = !isFree && wordCount > aiWordLimit * 0.9

  // Extract achievements from experiences for AI selection
  const userAchievements = useMemo(() => {
    return experiences
      ?.flatMap((exp: any, expIdx: number) =>
        exp.bullets
          ?.filter((b: any) => b.translated_text || b.original_text)
          .map((b: any, bIdx: number) => ({
            id: `${expIdx}-${bIdx}`,
            summary: b.translated_text || b.original_text,
          })) || []
      )
      .slice(0, 10) || []
  }, [experiences])

  // Parse editor text for preview
  const parsedLetter = useMemo(() => {
    if (!editorText) return null
    const lines = editorText.split('\n')
    let greeting = ''
    let closing = ''
    let signatureName = ''
    const bodyParagraphs: string[] = []
    let inBody = false
    let currentParagraph = ''

    for (const line of lines) {
      const trimmed = line.trim()

      if (trimmed.startsWith('Dear ')) {
        greeting = trimmed
        inBody = true
      } else if (
        ['Sincerely', 'Best regards', 'Best,', 'Regards,', 'Respectfully', 'Thank you,'].some(s => trimmed.startsWith(s))
      ) {
        if (currentParagraph.trim()) {
          bodyParagraphs.push(currentParagraph.trim())
          currentParagraph = ''
        }
        closing = trimmed.endsWith(',') ? trimmed : trimmed + ','
        inBody = false
      } else if (!inBody && closing && trimmed && !signatureName) {
        signatureName = trimmed
      } else if (inBody) {
        if (trimmed === '') {
          if (currentParagraph.trim()) {
            bodyParagraphs.push(currentParagraph.trim())
            currentParagraph = ''
          }
        } else {
          currentParagraph += (currentParagraph ? ' ' : '') + trimmed
        }
      }
    }

    if (currentParagraph.trim()) {
      bodyParagraphs.push(currentParagraph.trim())
    }

    return {
      greeting: greeting || 'Dear Hiring Team,',
      bodyParagraphs,
      closing: closing || 'Sincerely,',
      signatureName: signatureName || applicantName,
    }
  }, [editorText, applicantName])

  // Template generation handler (free users)
  const handleTemplateGenerate = async () => {
    if (!company || !jobTitle) return
    setIsGenerating(true)

    try {
      // Extract keywords if JD changed
      const jdChanged = jobDescription.trim() !== lastExtractedJDRef.current
      let currentExtraction = extraction
      if (jobDescription.trim() && (!extraction || jdChanged)) {
        currentExtraction = await extractKeywords(jobDescription)
        setExtraction(currentExtraction)
        lastExtractedJDRef.current = jobDescription.trim()
      }

      if (!selectedTemplateId || !currentExtraction) return

      const context = {
        companyName: company,
        jobTitle: jobTitle,
        hiringManagerName: hiringManager,
        applicantPhone: applicantPhone,
        applicantEmail: applicantEmail,
      }

      const result = await fillTemplate(selectedTemplateId, userProfileForMatch, currentExtraction, context, fieldOverrides)
      if (result) {
        setFilledResult(result)
        // Assemble letter text
        const greeting = hiringManager ? `Dear ${hiringManager},` : 'Dear Hiring Team,'
        const paragraphs = {
          opening: cleanUnfilledPlaceholders(result.paragraphs.opening),
          body1: cleanUnfilledPlaceholders(result.paragraphs.body1),
          body2: cleanUnfilledPlaceholders(result.paragraphs.body2),
          closing: cleanUnfilledPlaceholders(result.paragraphs.closing),
        }
        const body = [paragraphs.opening, paragraphs.body1, paragraphs.body2, paragraphs.closing].filter(Boolean).join('\n\n')
        const rawLetter = `${greeting}\n\n${body}\n\nSincerely,\n\n${applicantName}`
        setEditorText(polishCoverLetter(rawLetter))
      }

      // Track usage
      fetch('/api/track-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: 'cover_letters' }),
      }).catch(() => {})
    } finally {
      setIsGenerating(false)
    }
  }

  // AI generate handler
  const handleAIGenerate = async (isRegenerate = false) => {
    if (!company || !jobTitle || !jobDescription) {
      setError('Please fill in company, job title, and job description for AI generation')
      return
    }

    if (aiRemaining <= 0) {
      setError('You have reached your cover letter limit. Upgrade for more.')
      return
    }

    if (aiRemaining === 1 && !showLastUseWarning) {
      setPendingIsRegenerate(isRegenerate)
      setShowLastUseWarning(true)
      return
    }
    setShowLastUseWarning(false)

    if (isRegenerate) {
      setAiRefining(true)
    } else {
      setAiGenerating(true)
    }
    setError('')
    if (!isRegenerate) {
      setEditorText('')
    }
    setValidationWarnings([])

    try {
      const achievementTexts = selectedAchievements.length > 0
        ? selectedAchievements.map(id => userAchievements.find(a => a.id === id)?.summary).filter(Boolean)
        : []

      const safeProfile = userProfile ? {
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        city: userProfile.city || '',
        state: userProfile.state || '',
        linkedin_url: userProfile.linkedin_url || '',
        years_of_service: userProfile.years_of_service || '',
        branch: userProfile.branch || '',
        security_clearance: userProfile.security_clearance || '',
        clearance: userProfile.clearance || '',
        rank: userProfile.rank || '',
      } : null

      const safeExperiences = experiences?.map(exp => ({
        job_title: exp.job_title || exp.title || '',
        civilian_title: exp.civilian_title || '',
        company: exp.company || exp.organization || '',
        bullets: exp.bullets?.map((b: any) => ({
          original_text: typeof b.original_text === 'string' ? b.original_text : '',
          translated_text: typeof b.translated_text === 'string' ? b.translated_text : '',
        })) || [],
      })) || []

      const safeSkills = Array.isArray(skills)
        ? skills.filter(s => typeof s === 'string').slice(0, 20)
        : []

      const requestBody = {
        userId,
        jobData: {
          company,
          title: jobTitle,
          description: jobDescription,
        },
        userProfile: safeProfile,
        experiences: safeExperiences,
        skills: safeSkills,
        hiringManagerName: hiringManager || '',
        tone: coverLetterTone,
        length: coverLetterLength,
        targetIndustry,
        emphasisAreas: Array.isArray(emphasisAreas) ? emphasisAreas : [],
        openingStyle,
        selectedAchievements: achievementTexts,
        isRegenerate,
      }

      const res = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      const data = await res.json()

      if (res.status === 403) {
        setError(data.details?.reason || data.error || 'Usage limit reached')
        openUpgradeModal()
        return
      }

      if (!res.ok || data.error) {
        setError(data.error || `Server error (${res.status}). Please try again.`)
      } else if (data.coverLetter) {
        setEditorText(data.coverLetter)
        if (data.validationIssues) {
          setValidationWarnings(data.validationIssues)
        }
        onAIGenerated?.()
        if (!isRegenerate) {
          setTimeout(() => triggerPostActionModal('cover-letter-complete'), 800)
        }
      } else {
        setError('No cover letter received. Please try again.')
      }
    } catch (err: any) {
      console.error('Cover letter generation error:', err)
      setError(err.message || 'Failed to generate cover letter. Please check your connection and try again.')
    } finally {
      setAiGenerating(false)
      setAiRefining(false)
    }
  }

  // AI quick refine handler
  const handleQuickRefine = async (action: 'shorter' | 'stronger' | 'numbers') => {
    if (!editorText) return

    setAiRefining(true)
    setError('')

    try {
      const res = await fetch('/api/refine-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          currentLetter: editorText,
          jobTitle,
          companyName: company,
        }),
      })

      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        setEditorText(data.refined)
        if (data.validationIssues) {
          setValidationWarnings(data.validationIssues)
        }
      }
    } catch {
      setError('Failed to refine cover letter. Please try again.')
    } finally {
      setAiRefining(false)
    }
  }

  // Unified generate handler
  const handleGenerate = () => {
    if (isFree) {
      handleTemplateGenerate()
    } else {
      handleAIGenerate(false)
    }
  }

  const handleCopy = async () => {
    try {
      const { copyToClipboard } = await import('@/lib/clipboard')
      await copyToClipboard(editorText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Failed to copy')
    }
  }

  const handleDownload = async (format: 'pdf' | 'docx' | 'txt') => {
    if (!editorText) return
    setIsDownloading(true)
    setError('')

    try {
      const safeCompanyName = (company || 'Application').replace(/[^a-zA-Z0-9-_\s]/g, '').replace(/\s+/g, '-')

      if (format === 'txt') {
        const content = `${applicantName}\n${contactParts.join(' | ')}\n${applicantLinkedIn ? applicantLinkedIn + '\n' : ''}${'─'.repeat(60)}\n\n${formattedDate}\n\n${hiringManager ? hiringManager + '\n' : ''}${company}\n\nRE: ${jobTitle} Position\n\n${editorText}`
        const blob = new Blob([content], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Cover-Letter-${safeCompanyName}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } else {
        const response = await fetch('/api/export-cover-letter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: editorText,
            format,
            applicantName,
            applicantEmail,
            applicantPhone,
            applicantCity,
            applicantState,
            applicantLinkedIn,
            companyName: company,
            hiringManagerName: hiringManager || undefined,
            jobTitle,
          }),
        })

        if (!response.ok) {
          const contentType = response.headers.get('content-type')
          if (contentType?.includes('application/json')) {
            const errorData = await response.json()
            if (response.status === 403 && errorData.limitReached) {
              setError("You\u2019ve reached your daily cover letter export limit. Come back tomorrow or upgrade.")
              return
            }
            throw new Error(errorData.error || 'Download failed')
          }
          throw new Error('Download failed')
        }

        // Read usage headers for remaining count toast
        const userTier = response.headers.get('X-User-Tier')
        const dailyRemaining = response.headers.get('X-Daily-Remaining')
        const dailyLimit = response.headers.get('X-Daily-Limit')

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Cover-Letter-${safeCompanyName}.${format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        // Show remaining export count toast for free tier
        if (userTier === 'free' && dailyRemaining !== null && dailyLimit !== null) {
          const rem = parseInt(dailyRemaining, 10)
          if (rem <= 0) {
            setDownloadToast('Downloaded \u2713 \u00B7 Daily export limit reached. Resets tomorrow.')
          } else {
            setDownloadToast(`Downloaded \u2713 \u00B7 ${rem} of ${dailyLimit} exports remaining today`)
          }
          setTimeout(() => setDownloadToast(null), 5000)
        }
      }
    } catch (err: any) {
      setError('Failed to download: ' + (err.message || 'Unknown error'))
    } finally {
      setIsDownloading(false)
    }
  }

  // Can the left panel collapse?
  const canCollapse = Boolean(company && jobTitle && jobDescription)

  // Generating state for the unified button
  const isAnyGenerating = isGenerating || isExtracting || aiGenerating

  /**
   * Pass 2 & 3: Remove any surviving {placeholder} or {{placeholder}} tokens gracefully.
   * Rewrites surrounding text so sentences read naturally, then cleans punctuation.
   */
  function cleanUnfilledPlaceholders(text: string): string {
    let r = text

    // No placeholders -> return immediately (check both {key} and {{key}})
    if (!/\{{1,2}\w+\}{1,2}/.test(r)) return r

    // Regex fragment that matches both {key} and {{key}}
    const PH = '\\{{1,2}\\w+\\}{1,2}'
    const ph = (key: string) => `\\{{1,2}${key}\\}{1,2}`

    // --- Contextual rewrites (most specific first) ---

    // "{num_X} [noun]" -> just "[noun]" (drop the numeric placeholder)
    r = r.replace(new RegExp(`\\{{1,2}num_\\w+\\}{1,2}\\s+`, 'g'), '')

    // "valued at {X}" / "worth {X}" -> remove entire phrase
    r = r.replace(new RegExp(`\\s*valued\\s+at\\s+${PH}`, 'gi'), '')
    r = r.replace(new RegExp(`\\s*worth\\s+${PH}`, 'gi'), '')

    // "{value} [noun]" -> remove placeholder, keep noun
    r = r.replace(new RegExp(`${ph('value')}\\s*`, 'gi'), '')

    // "across {adoption_scope}" -> "across the organization"
    r = r.replace(new RegExp(`across\\s+${ph('adoption_scope')}`, 'gi'), 'across the organization')

    // "my {field} [expertise/background/experience]" -> "my professional [noun]"
    r = r.replace(new RegExp(`my\\s+${ph('field')}\\s+(expertise|background|experience|knowledge)`, 'gi'), 'my professional $1')
    // "in {field}" -> "in my field"
    r = r.replace(new RegExp(`in\\s+${ph('field')}`, 'gi'), 'in my field')

    // Clause-ending patterns: ", demonstrating my ability to {X}" -> remove
    r = r.replace(new RegExp(`,?\\s*demonstrating\\s+(?:my|an?|the)\\s+ability\\s+to\\s+[^.]*?${PH}[^.]*?(?=\\.|$)`, 'gi'), '')
    r = r.replace(new RegExp(`,?\\s*showcasing\\s+[^.]*?${PH}[^.]*?(?=\\.|$)`, 'gi'), '')
    r = r.replace(new RegExp(`,?\\s*highlighting\\s+[^.]*?${PH}[^.]*?(?=\\.|$)`, 'gi'), '')

    // ", and {X}" / "and {X}" -> remove
    r = r.replace(new RegExp(`,?\\s+and\\s+${PH}`, 'gi'), '')

    // "{X} and " -> remove
    r = r.replace(new RegExp(`${PH}\\s+and\\s+`, 'gi'), '')

    // ", such as {X}" / ", including {X}" -> remove
    r = r.replace(new RegExp(`,?\\s*such\\s+as\\s+${PH}`, 'gi'), '')
    r = r.replace(new RegExp(`,?\\s*including\\s+${PH}`, 'gi'), '')

    // "my {X} " -> "my " (generic possessive before placeholder)
    r = r.replace(new RegExp(`my\\s+${PH}\\s+`, 'gi'), 'my ')

    // "can be reached at {phone} or {email}" -> remove entire clause (contact is in header)
    r = r.replace(new RegExp(`and\\s+can\\s+be\\s+reached\\s+at\\s+${PH}\\s+or\\s+${PH}[^.]*\\.?`, 'gi'), '.')
    r = r.replace(new RegExp(`Please\\s+feel\\s+free\\s+to\\s+contact\\s+me\\s+at\\s+${PH}\\s+or\\s+${PH}[^.]*\\.?`, 'gi'), '')

    // Catch-all: remove any remaining {X} or {{X}}
    r = r.replace(new RegExp(PH, 'g'), '')

    // Fix "$" before non-digit text from dollar-prefixed placeholder fallbacks
    r = r.replace(/\$(?=[a-z])/gi, '')

    // --- Pass 3: Punctuation & spacing cleanup ---
    r = r.replace(/\s{2,}/g, ' ')             // collapse multiple spaces
    r = r.replace(/,\s*,/g, ',')              // double commas
    r = r.replace(/,\s*\./g, '.')             // comma before period
    r = r.replace(/\.\s*\./g, '.')            // double periods
    r = r.replace(/\s+([.,;:!?])/g, '$1')    // space before punctuation
    r = r.replace(/([.,;:])\s*([.,;:])/g, '$1') // adjacent punctuation marks
    r = r.replace(/^\s+/gm, '')              // leading whitespace on lines
    r = r.replace(/\s+$/gm, '')              // trailing whitespace on lines

    return r.trim()
  }

  return (
    <div className="pb-4">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs text-text-dim">
          <button onClick={onBack} className="hover:text-text transition-colors">Cover Letter &amp; LinkedIn</button>
          <span className="text-gold">&rsaquo;</span>
          <span className="text-text-muted">Cover Letter Builder</span>
        </div>
        {isFree ? (
          <Badge variant="green">Free</Badge>
        ) : (
          <Badge variant={aiRemaining <= 1 ? 'red' : aiRemaining <= 2 ? 'amber' : 'default'}>
            {aiRemaining >= 999 ? 'Unlimited' : `${aiRemaining} AI ${aiRemaining === 1 ? 'Credit' : 'Credits'}`}
          </Badge>
        )}
      </div>

      {/* Three-panel layout */}
      <div className="flex flex-col lg:flex-row gap-4">

        {/* ===== LEFT PANEL: Job Details ===== */}
        <div
          className={cn(
            'transition-all duration-300 shrink-0',
            leftCollapsed ? 'lg:w-12' : 'lg:w-72',
          )}
        >
          {leftCollapsed ? (
            /* Collapsed strip */
            <div
              onClick={() => setLeftCollapsed(false)}
              className="hidden lg:flex flex-col items-center gap-3 py-3 bg-bg-card border border-border rounded-lg cursor-pointer hover:border-gold/30 transition-colors"
            >
              <button className="text-text-dim hover:text-gold text-xs">&rsaquo;</button>
              <div className="flex flex-col items-center gap-2.5">
                {/* Company icon */}
                <div className="relative" title={company || 'Company'}>
                  <svg className="w-4 h-4 text-text-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                  {company && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-status-green rounded-full" />}
                </div>
                {/* Title icon */}
                <div className="relative" title={jobTitle || 'Job Title'}>
                  <svg className="w-4 h-4 text-text-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  {jobTitle && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-status-green rounded-full" />}
                </div>
                {/* Person icon */}
                <div className="relative" title={hiringManager || 'Hiring Manager'}>
                  <svg className="w-4 h-4 text-text-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  {hiringManager && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-status-green rounded-full" />}
                </div>
                {/* Doc icon */}
                <div className="relative" title="Job Description">
                  <svg className="w-4 h-4 text-text-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  {jobDescription && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-status-green rounded-full" />}
                </div>
              </div>
            </div>
          ) : (
            /* Expanded left panel */
            <div className="bg-bg-card border border-border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-text-dim flex items-center gap-2">
                  <span className="text-gold">&#9672;</span> JOB DETAILS
                </h3>
                {canCollapse && (
                  <button
                    onClick={() => setLeftCollapsed(true)}
                    className="hidden lg:block text-text-dim hover:text-gold text-xs transition-colors"
                    title="Collapse panel"
                  >
                    &lsaquo;
                  </button>
                )}
              </div>

              <Input
                label="Company Name"
                autoComplete="organization"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corporation"
              />
              <Input
                label="Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Operations Manager"
              />
              <div className="space-y-1.5">
                <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Hiring Manager <span className="text-text-dim font-normal normal-case">(optional)</span>
                </label>
                <input
                  type="text"
                  name="hiring-manager"
                  autoComplete="name"
                  value={hiringManager}
                  onChange={(e) => setHiringManager(e.target.value)}
                  placeholder="e.g., Sarah Johnson"
                  className="w-full bg-bg-secondary border border-border rounded-md px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold/25"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Job Description
                </label>
                <textarea
                  name="job-description"
                  autoComplete="off"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="w-full min-h-[120px] bg-bg-secondary border border-border rounded-md px-3 py-2 text-sm text-text placeholder:text-text-dim resize-y focus:border-gold focus:ring-1 focus:ring-gold/25"
                />
                {extraction && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {extraction.industry && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-gold/10 text-gold rounded">
                        {extraction.industry}
                      </span>
                    )}
                    {extraction.roleType && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-gold/10 text-gold rounded">
                        {extraction.roleType}
                      </span>
                    )}
                    {extraction.requiredSkills.slice(0, 3).map(skill => (
                      <span key={skill} className="text-[10px] px-1.5 py-0.5 bg-bg-tertiary text-text-dim rounded">
                        {skill}
                      </span>
                    ))}
                    {extraction.requiredSkills.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 text-text-dim">
                        +{extraction.requiredSkills.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ===== CENTER PANEL: Editor ===== */}
        <div className="flex-1 min-w-0 space-y-3">

          {/* Template strip (free users only) */}
          {isFree && scoredTemplates.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {scoredTemplates.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setSelectedTemplateId(t.id)
                    setFieldOverrides({})
                  }}
                  className={cn(
                    'min-w-[100px] p-2 rounded-lg border cursor-pointer transition-all text-left flex-shrink-0',
                    selectedTemplateId === t.id
                      ? 'border-gold bg-gold/5'
                      : 'border-border hover:border-gold/30'
                  )}
                >
                  <div className="text-lg mb-0.5">{getIndustryIcon(t.industry)}</div>
                  <div className={cn(
                    'text-[10px] font-heading font-bold uppercase tracking-wider leading-tight',
                    selectedTemplateId === t.id ? 'text-gold' : 'text-text'
                  )}>
                    {formatTemplateName(t.template_name)}
                  </div>
                  {t.score > 0 && (
                    <span className="inline-block mt-1 text-[9px] px-1 py-0.5 bg-status-green/20 text-status-green rounded">
                      {t.score >= 3 ? 'Best' : 'Good'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Center panel header: Generate + Settings gear */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerate}
              disabled={
                isFree
                  ? (!company || !jobTitle || isAnyGenerating)
                  : (!company || !jobTitle || !jobDescription || isAnyGenerating || aiRemaining <= 0)
              }
              className="flex-1 py-2.5 bg-gold text-bg-primary font-heading font-bold uppercase tracking-wider rounded-lg disabled:bg-border disabled:text-text-dim disabled:cursor-not-allowed hover:bg-gold-bright transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {isAnyGenerating ? (
                <>
                  <span className="animate-spin">&#9672;</span>
                  Generating...
                </>
              ) : editorText ? (
                isFree ? '\u25C6 REGENERATE' : '\u2726 REGENERATE (1 credit)'
              ) : (
                isFree ? '\u25C6 GENERATE COVER LETTER' : '\u2726 GENERATE WITH AI (1 credit)'
              )}
            </button>

            {/* Settings gear */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className={cn(
                  'p-2.5 rounded-lg border transition-colors',
                  settingsOpen
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-border bg-bg-secondary text-text-muted hover:border-gold/30 hover:text-text'
                )}
                title="Settings"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {/* Settings popover */}
              {settingsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 max-h-[70vh] overflow-y-auto bg-bg-secondary border border-border rounded-lg shadow-lg p-4 z-20">
                  {!isFree ? (
                    /* AI mode settings */
                    <div className="space-y-4">
                      <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-text-dim">AI Settings</h4>

                      {/* Tone Selection */}
                      <div>
                        <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">Tone</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { id: 'professional', label: 'Professional' },
                            { id: 'conversational', label: 'Conversational' },
                            { id: 'assertive', label: 'Direct' },
                          ].map((tone) => (
                            <button
                              key={tone.id}
                              onClick={() => setCoverLetterTone(tone.id as typeof coverLetterTone)}
                              className={cn(
                                'p-2 rounded-lg border text-xs transition-all',
                                coverLetterTone === tone.id
                                  ? 'border-gold bg-gold/10 text-text'
                                  : 'border-border bg-bg-secondary text-text-muted hover:border-gold/50'
                              )}
                            >
                              {tone.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Length Selection */}
                      <div>
                        <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">
                          Length <span className="text-text-dim font-normal">({WORD_LIMITS[coverLetterLength]} words)</span>
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { id: 'brief', label: 'Brief', desc: '~200' },
                            { id: 'standard', label: 'Standard', desc: '~300' },
                            { id: 'detailed', label: 'Detailed', desc: '~400' },
                          ].map((length) => (
                            <button
                              key={length.id}
                              onClick={() => setCoverLetterLength(length.id as typeof coverLetterLength)}
                              className={cn(
                                'p-2 rounded-lg border text-xs transition-all',
                                coverLetterLength === length.id
                                  ? 'border-gold bg-gold/10 text-text'
                                  : 'border-border bg-bg-secondary text-text-muted hover:border-gold/50'
                              )}
                            >
                              {length.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Industry Target */}
                      <div>
                        <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">Target Industry</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { id: 'defense', label: 'Defense' },
                            { id: 'private', label: 'Private' },
                            { id: 'federal', label: 'Federal' },
                            { id: 'startup', label: 'Startup' },
                          ].map((industry) => (
                            <button
                              key={industry.id}
                              onClick={() => setTargetIndustry(industry.id as typeof targetIndustry)}
                              className={cn(
                                'p-2 rounded-lg border text-xs transition-all',
                                targetIndustry === industry.id
                                  ? 'border-gold bg-gold/10 text-text'
                                  : 'border-border bg-bg-secondary text-text-muted hover:border-gold/50'
                              )}
                            >
                              {industry.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Opening Style */}
                      <div>
                        <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">Opening Style</label>
                        <select
                          autoComplete="off"
                          value={openingStyle}
                          onChange={(e) => setOpeningStyle(e.target.value as typeof openingStyle)}
                          className="w-full bg-bg-secondary border border-border rounded-lg px-2 py-1.5 text-text text-xs focus:outline-none focus:border-gold"
                        >
                          <option value="achievement">Lead with top achievement</option>
                          <option value="connection">Lead with company/role connection</option>
                          <option value="problem">Lead with problem you solve</option>
                          <option value="direct">Direct statement of intent</option>
                        </select>
                      </div>

                      {/* Emphasis Areas */}
                      <div>
                        <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">
                          Emphasize <span className="text-text-dim font-normal normal-case">(max 3)</span>
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'Leadership',
                            'Technical Skills',
                            'Project Management',
                            'Cost Savings',
                            'Team Development',
                            'Process Improvement',
                          ].map((area) => (
                            <button
                              key={area}
                              onClick={() => {
                                if (emphasisAreas.includes(area)) {
                                  setEmphasisAreas(emphasisAreas.filter(a => a !== area))
                                } else if (emphasisAreas.length < 3) {
                                  setEmphasisAreas([...emphasisAreas, area])
                                }
                              }}
                              className={cn(
                                'px-2.5 py-1 rounded-full text-[11px] transition-all',
                                emphasisAreas.includes(area)
                                  ? 'bg-gold text-bg-primary font-medium'
                                  : 'bg-bg-secondary text-text-muted border border-border hover:border-gold/50'
                              )}
                            >
                              {area}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Achievement Selection */}
                      {userAchievements.length > 0 && (
                        <div>
                          <label className="block text-xs text-text-muted mb-1.5 uppercase tracking-wider">
                            Highlight Achievements <span className="text-text-dim font-normal normal-case">(optional)</span>
                          </label>
                          <div className="space-y-1 max-h-36 overflow-y-auto">
                            {userAchievements.map((achievement: { id: string; summary: string }) => (
                              <label key={achievement.id} className="flex items-start gap-2 cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={selectedAchievements.includes(achievement.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedAchievements(prev => [...prev, achievement.id])
                                    } else {
                                      setSelectedAchievements(prev => prev.filter(id => id !== achievement.id))
                                    }
                                  }}
                                  className="mt-1 accent-gold"
                                />
                                <span className="text-[11px] text-text-muted group-hover:text-text transition-colors leading-relaxed">
                                  {achievement.summary.length > 100
                                    ? achievement.summary.slice(0, 97) + '...'
                                    : achievement.summary}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Template mode settings (free users) */
                    <div className="space-y-4">
                      <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-text-dim">Template Settings</h4>

                      {/* Field overrides */}
                      {filledResult && filledResult.filledPlaceholders.length > 0 && (
                        <div className="space-y-2">
                          {/* Certification selectors */}
                          {filledResult.filledPlaceholders.includes('certification_1') && fieldOptions.dedupedCerts.length > 1 && (
                            <FieldSelector
                              label="Primary Cert"
                              value={fieldOverrides.certification_1 ?? fieldOptions.dedupedCerts[0]?.short ?? ''}
                              options={fieldOptions.dedupedCerts.map(c => c.short)}
                              displayOptions={fieldOptions.dedupedCerts.map(c => c.full)}
                              onChange={(v) => setFieldOverrides(prev => ({ ...prev, certification_1: v }))}
                            />
                          )}
                          {filledResult.filledPlaceholders.includes('certification_2') && fieldOptions.dedupedCerts.length > 1 && (() => {
                            const primarySelected = fieldOverrides.certification_1 ?? fieldOptions.dedupedCerts[0]?.short ?? ''
                            const secondaryOptions = fieldOptions.dedupedCerts.filter(c => c.short !== primarySelected)
                            if (secondaryOptions.length === 0) return null
                            return (
                              <FieldSelector
                                label="Secondary Cert"
                                value={fieldOverrides.certification_2 ?? secondaryOptions[0]?.short ?? ''}
                                options={secondaryOptions.map(c => c.short)}
                                displayOptions={secondaryOptions.map(c => c.full)}
                                onChange={(v) => setFieldOverrides(prev => ({ ...prev, certification_2: v }))}
                              />
                            )
                          })()}

                          {/* Technical skill selectors */}
                          {filledResult.filledPlaceholders.some(k => k === 'technical_skill_1' || k === 'technical_skill') && fieldOptions.sortedSkills.length > 1 && (
                            <FieldSelector
                              label="Primary Skill"
                              value={fieldOverrides.technical_skill_1 ?? fieldOptions.sortedSkills[0]}
                              options={fieldOptions.sortedSkills}
                              onChange={(v) => setFieldOverrides(prev => ({ ...prev, technical_skill_1: v }))}
                            />
                          )}
                          {filledResult.filledPlaceholders.includes('technical_skill_2') && fieldOptions.sortedSkills.length > 1 && (
                            <FieldSelector
                              label="Secondary Skill"
                              value={fieldOverrides.technical_skill_2 ?? fieldOptions.sortedSkills[1] ?? fieldOptions.sortedSkills[0]}
                              options={fieldOptions.sortedSkills}
                              onChange={(v) => setFieldOverrides(prev => ({ ...prev, technical_skill_2: v }))}
                            />
                          )}

                          {/* Achievement selector */}
                          {filledResult.filledPlaceholders.includes('achievement_1') && fieldOptions.achievementBullets.length > 1 && (
                            <FieldSelector
                              label="Key Achievement"
                              value={fieldOverrides.achievement_1 ?? fieldOptions.achievementBullets[0]}
                              options={fieldOptions.achievementBullets}
                              onChange={(v) => setFieldOverrides(prev => ({ ...prev, achievement_1: v }))}
                              truncate
                            />
                          )}

                          {/* Degree selector */}
                          {filledResult.filledPlaceholders.includes('degree') && fieldOptions.eduEntries.length > 1 && (
                            <FieldSelector
                              label="Degree"
                              value={fieldOverrides.degree ?? fieldOptions.eduEntries[0]?.degree ?? ''}
                              options={fieldOptions.eduEntries.map(e => e.degree)}
                              displayOptions={fieldOptions.eduEntries.map(e => e.label)}
                              onChange={(v) => {
                                const match = fieldOptions.eduEntries.find(e => e.degree === v)
                                setFieldOverrides(prev => ({ ...prev, degree: v, field: match?.field ?? '' }))
                              }}
                            />
                          )}

                          {/* Years of Experience */}
                          {filledResult.filledPlaceholders.includes('years_experience') && (
                            <FieldInput
                              label="Years Experience"
                              value={fieldOverrides.years_experience ?? String(userProfile?.years_of_service ?? '')}
                              onChange={(v) => setFieldOverrides(prev => ({ ...prev, years_experience: v }))}
                              type="number"
                            />
                          )}

                          {/* Military Rank */}
                          {filledResult.filledPlaceholders.includes('military_rank') && (
                            <FieldInput
                              label="Military Rank"
                              value={fieldOverrides.military_rank ?? userProfile?.rank ?? userProfile?.paygrade ?? ''}
                              onChange={(v) => setFieldOverrides(prev => ({ ...prev, military_rank: v }))}
                            />
                          )}

                          {/* Non-selectable filled fields shown as badges */}
                          {(() => {
                            const selectableKeys = new Set([
                              'certification_1', 'certification_2', 'technical_skill_1', 'technical_skill_2',
                              'technical_skill', 'achievement_1', 'degree', 'years_experience', 'military_rank',
                            ])
                            const otherFilled = filledResult.filledPlaceholders.filter(k => !selectableKeys.has(k))
                            if (otherFilled.length === 0) return null
                            return (
                              <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-border">
                                {otherFilled.map(key => (
                                  <span key={key} className="text-[9px] px-1.5 py-0.5 bg-status-green/10 text-status-green border border-status-green/20 rounded">
                                    {formatPlaceholderLabel(key)}
                                  </span>
                                ))}
                              </div>
                            )
                          })()}
                        </div>
                      )}

                      {/* Profile strength indicator */}
                      {(() => {
                        const skillCount = userProfile?.skills?.length || skills?.length || 0
                        const certCount = userProfile?.certifications?.length || certifications?.length || 0
                        const hasEducation = (userProfile?.education?.length || 0) > 0
                        const hasExperience = (userProfile?.experiences?.length || 0) > 0
                        const score = Math.min(100, (skillCount >= 3 ? 30 : skillCount * 10) + (certCount >= 2 ? 20 : certCount * 10) + (hasEducation ? 25 : 0) + (hasExperience ? 25 : 0))
                        const strength = score >= 70 ? 'Strong' : score >= 40 ? 'Medium' : 'Weak'
                        const color = score >= 70 ? 'text-status-green' : score >= 40 ? 'text-status-amber' : 'text-status-red'
                        return (
                          <div className="pt-3 border-t border-border">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-text-dim">Profile:</span>
                              <span className={`font-semibold ${color}`}>{strength}</span>
                              <div className="flex-1 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all ${score >= 70 ? 'bg-status-green' : score >= 40 ? 'bg-status-amber' : 'bg-status-red'}`} style={{ width: `${score}%` }} />
                              </div>
                            </div>
                            {score < 40 && (
                              <a href="/profile" className="text-[10px] text-gold hover:text-gold-bright underline mt-1 inline-block">Add more in Profile</a>
                            )}
                          </div>
                        )
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="bg-status-red-dim border border-status-red/20 rounded-md p-3">
              <p className="text-sm text-status-red">{error}</p>
            </div>
          )}

          {/* Editor textarea */}
          {aiGenerating ? (
            <div className="flex items-center justify-center h-64 bg-bg-card border border-border rounded-lg">
              <div className="text-center">
                <div className="animate-pulse text-4xl mb-4">&#9672;</div>
                <p className="text-text-muted">Crafting your cover letter...</p>
                <p className="text-xs text-text-dim mt-2">This may take 15-30 seconds</p>
              </div>
            </div>
          ) : editorText ? (
            <div className="space-y-2">
              <textarea
                value={editorText}
                onChange={(e) => setEditorText(e.target.value)}
                className="w-full min-h-[360px] bg-bg-card border border-border rounded-lg px-4 py-3 text-sm text-text font-mono leading-relaxed resize-y focus:border-gold focus:ring-1 focus:ring-gold/25"
                placeholder="Your cover letter will appear here..."
              />
              <div className="flex items-center justify-between text-xs text-text-dim">
                <span>
                  {wordCount} words
                  {!isFree && ` / ${aiWordLimit}`}
                  {aiIsOverLimit && <span className="text-status-red ml-1">(over limit)</span>}
                </span>
                {filledResult && isFree && (
                  <span>Template: {formatTemplateName(filledResult.templateName)}</span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-bg-card border border-border rounded-lg">
              <div className="text-center">
                <div className="text-3xl text-text-dim mb-3">{isFree ? '\u25C7' : '\u2728'}</div>
                <p className="text-sm text-text-muted">
                  {isFree
                    ? 'Fill in job details and click Generate'
                    : 'Fill in job details and click Generate'}
                </p>
                <p className="text-xs text-text-dim mt-1">
                  {isFree
                    ? 'Select a template above for best results'
                    : 'AI will craft a personalized cover letter using your profile'}
                </p>
              </div>
            </div>
          )}

          {/* Quick refine buttons (AI mode only, after generation) */}
          {!isFree && editorText && !aiGenerating && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => handleQuickRefine('shorter')}
                  disabled={aiRefining}
                  className="px-3 py-1.5 text-xs bg-bg-secondary text-text-muted rounded-lg hover:bg-bg-tertiary active:bg-bg-tertiary transition-colors border border-border disabled:opacity-50 whitespace-nowrap"
                >
                  Shorter
                </button>
                <button
                  onClick={() => handleQuickRefine('stronger')}
                  disabled={aiRefining}
                  className="px-3 py-1.5 text-xs bg-bg-secondary text-text-muted rounded-lg hover:bg-bg-tertiary active:bg-bg-tertiary transition-colors border border-border disabled:opacity-50 whitespace-nowrap"
                >
                  Stronger
                </button>
                <button
                  onClick={() => handleQuickRefine('numbers')}
                  disabled={aiRefining}
                  className="px-3 py-1.5 text-xs bg-bg-secondary text-text-muted rounded-lg hover:bg-bg-tertiary active:bg-bg-tertiary transition-colors border border-border disabled:opacity-50 whitespace-nowrap"
                >
                  + Numbers
                </button>
              </div>
              <button
                onClick={() => handleAIGenerate(true)}
                disabled={aiRefining || aiGenerating}
                className="px-3 py-1.5 text-xs bg-gold/10 text-gold rounded-lg hover:bg-gold/20 transition-colors border border-gold/30 disabled:opacity-50 whitespace-nowrap"
              >
                {aiRefining ? 'Refining...' : 'Regenerate'}
              </button>
            </div>
          )}

          {/* Validation warnings */}
          {validationWarnings.length > 0 && (
            <div className="bg-status-amber/10 border border-status-amber/20 rounded-md p-3">
              <p className="text-xs text-status-amber font-semibold mb-1">Review suggestions:</p>
              <ul className="text-xs text-text-muted space-y-0.5">
                {validationWarnings.map((warning, idx) => (
                  <li key={idx}>&bull; {warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ===== RIGHT PANEL: Live Preview ===== */}
        <div className="lg:w-[42%] shrink-0 space-y-3">
          {/* Preview Header with Copy + Download */}
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="text-gold">&#9707;</span> PREVIEW
            </h3>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleCopy}
                disabled={!editorText || isDownloading}
              >
                {copied ? '\u2713 Copied' : 'Copy'}
              </Button>
              <div className="relative" ref={exportMenuRef}>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setExportMenuOpen(!exportMenuOpen)}
                  disabled={!editorText || isDownloading}
                >
                  {isDownloading ? 'Exporting...' : '\u2193 Export'}
                </Button>
                {exportMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-bg-card border border-border rounded-lg shadow-lg z-10 overflow-hidden">
                    <button
                      onClick={() => { setExportMenuOpen(false); handleDownload('pdf') }}
                      className="w-full px-4 py-3 text-left hover:bg-bg-tertiary transition-colors flex items-center gap-3"
                    >
                      <span className="text-status-red">&#9672;</span>
                      <div>
                        <div className="font-heading text-sm uppercase">PDF</div>
                        <div className="text-xs text-text-muted">Best for sharing</div>
                      </div>
                    </button>
                    <button
                      onClick={() => { setExportMenuOpen(false); handleDownload('docx') }}
                      className="w-full px-4 py-3 text-left hover:bg-bg-tertiary transition-colors flex items-center gap-3 border-t border-border"
                    >
                      <span className="text-status-blue">&#9707;</span>
                      <div>
                        <div className="font-heading text-sm uppercase">DOCX</div>
                        <div className="text-xs text-text-muted">Best for ATS &amp; editing</div>
                      </div>
                    </button>
                    <button
                      onClick={() => { setExportMenuOpen(false); handleDownload('txt') }}
                      className="w-full px-4 py-3 text-left hover:bg-bg-tertiary transition-colors flex items-center gap-3 border-t border-border"
                    >
                      <span className="text-text-dim">&equiv;</span>
                      <div>
                        <div className="font-heading text-sm uppercase">TXT</div>
                        <div className="text-xs text-text-muted">Plain text</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {downloadToast && (
            <div className="bg-status-green/10 border border-status-green/30 rounded-lg p-3 flex items-center justify-between">
              <p className="text-sm text-status-green">{downloadToast}</p>
              <button
                onClick={() => setDownloadToast(null)}
                className="text-status-green/50 hover:text-status-green ml-2"
              >
                &#10005;
              </button>
            </div>
          )}

          {/* Formatted preview */}
          {editorText && parsedLetter ? (
            <div className="bg-white text-gray-900 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 md:p-10" style={{ fontFamily: 'Georgia, serif' }}>
                <div className="mb-2">
                  <div className="text-base font-bold text-gray-900">{applicantName}</div>
                  {contactParts.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">{contactParts.join('  |  ')}</div>
                  )}
                  {applicantLinkedIn && (
                    <div className="text-xs text-gray-500">{applicantLinkedIn}</div>
                  )}
                </div>

                <div className="border-b border-gray-300 my-4"></div>

                <div className="text-sm text-gray-700 mb-6">{formattedDate}</div>

                <div className="mb-4 text-sm text-gray-700">
                  {hiringManager && <div>{hiringManager}</div>}
                  {company && <div>{company}</div>}
                </div>

                {jobTitle && (
                  <div className="text-sm font-bold text-gray-900 mb-6">
                    RE: {jobTitle} Position
                  </div>
                )}

                <div className="text-sm text-gray-700 mb-4">
                  {parsedLetter.greeting}
                </div>

                <div className="space-y-4">
                  {parsedLetter.bodyParagraphs.map((para, idx) => (
                    <p key={idx} className="text-sm leading-relaxed text-justify text-gray-700">
                      {para}
                    </p>
                  ))}
                </div>

                <div className="mt-6 text-sm text-gray-700">{parsedLetter.closing}</div>
                <div className="mt-8">
                  <div className="text-sm font-bold text-gray-900">{parsedLetter.signatureName}</div>
                </div>
              </div>

              <div className="bg-gray-100 px-6 md:px-10 py-2 text-xs text-gray-500 flex items-center justify-between border-t border-gray-200">
                <span>{isFree ? 'Dictionary Template' : 'AI Generated'} &bull; One Page Format</span>
                <span className={aiIsOverLimit ? 'text-status-red font-medium' : ''}>
                  {wordCount} words{aiIsOverLimit && ' - exceeds limit'}
                </span>
              </div>
            </div>
          ) : (
            /* Ghost skeleton preview */
            <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6 md:p-10">
              <div className="space-y-6 animate-pulse">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-[40%]"></div>
                  <div className="h-2 bg-gray-100 rounded w-[55%]"></div>
                  <div className="h-2 bg-gray-100 rounded w-[35%]"></div>
                </div>
                <div className="border-b border-gray-200"></div>
                <div className="h-2 bg-gray-100 rounded w-[25%]"></div>
                <div className="space-y-1.5">
                  <div className="h-2 bg-gray-100 rounded w-[30%]"></div>
                  <div className="h-2 bg-gray-100 rounded w-[20%]"></div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="h-2 bg-gray-200/70 rounded w-full"></div>
                    <div className="h-2 bg-gray-200/70 rounded w-[95%]"></div>
                    <div className="h-2 bg-gray-200/70 rounded w-[80%]"></div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2 bg-gray-200/70 rounded w-full"></div>
                    <div className="h-2 bg-gray-200/70 rounded w-[90%]"></div>
                    <div className="h-2 bg-gray-200/70 rounded w-[85%]"></div>
                    <div className="h-2 bg-gray-200/70 rounded w-[70%]"></div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2 bg-gray-200/70 rounded w-full"></div>
                    <div className="h-2 bg-gray-200/70 rounded w-[88%]"></div>
                    <div className="h-2 bg-gray-200/70 rounded w-[75%]"></div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2 bg-gray-200/70 rounded w-[90%]"></div>
                    <div className="h-2 bg-gray-200/70 rounded w-[60%]"></div>
                  </div>
                </div>
                <div className="pt-4 space-y-2">
                  <div className="h-2 bg-gray-100 rounded w-[15%]"></div>
                  <div className="h-3 bg-gray-200 rounded w-[30%] mt-4"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Last use warning modal */}
      {showLastUseWarning && (
        <LastUseWarningModal
          featureName="Cover Letter"
          tier={userPlan === 'full' ? 'full' : userPlan === 'core' ? 'core' : 'free'}
          limitType="tier"
          onContinue={() => {
            setShowLastUseWarning(false)
            handleAIGenerate(pendingIsRegenerate)
          }}
          onViewPricing={() => {
            setShowLastUseWarning(false)
          }}
        />
      )}
    </div>
  )
}

// ============================================================================
// Helpers
// ============================================================================

/** Human-readable label for a placeholder key */
function formatPlaceholderLabel(key: string): string {
  const labels: Record<string, string> = {
    company_name: 'Company Name',
    job_title: 'Job Title',
    hiring_manager_name: 'Hiring Manager',
    applicant_name: 'Your Name',
    first_name: 'First Name',
    last_name: 'Last Name',
    years_experience: 'Years of Experience',
    years_of_service: 'Years of Service',
    target_role: 'Target Role',
    target_industry: 'Target Industry',
    civilian_title: 'Civilian Job Title',
    mos_title: 'MOS Title',
    civilian_rank: 'Civilian Rank Equivalent',
    team_size: 'Team Size',
    branch: 'Military Branch',
    military_branch: 'Military Branch',
    clearance: 'Security Clearance',
    clearance_level: 'Clearance Level',
    clearance_statement: 'Clearance Statement',
    certification_1: 'Primary Certification',
    certification_2: 'Second Certification',
    certification_3: 'Third Certification',
    certifications: 'Certifications',
    technical_skill: 'Technical Skill',
    key_strength: 'Key Strength',
    achievement_1: 'Key Achievement',
    achievement_2: 'Second Achievement',
    quantified_result: 'Quantified Result',
    job_requirement_1: 'Job Requirement Match',
    job_requirement_2: 'Job Requirement Match',
    military_rank: 'Military Rank',
    degree: 'Degree',
    technical_skill_1: 'Primary Technical Skill',
    technical_skill_2: 'Secondary Technical Skill',
    key_skills: 'Key Skills',
    top_skill: 'Top Skill',
    matched_skills: 'Matched Skills',
    industry: 'Industry',
    role_type: 'Role Type',
    industry_framing: 'Industry Framing',
  }
  return labels[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

/** Dropdown selector for a template field */
function FieldSelector({ label, value, options, displayOptions, onChange, truncate }: {
  label: string
  value: string
  options: string[]
  displayOptions?: string[]
  onChange: (v: string) => void
  truncate?: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-[10px] text-text-muted font-heading uppercase tracking-wider w-28 flex-shrink-0">
        {label}
      </label>
      <select
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-bg-secondary border border-border rounded px-2 py-1.5 text-xs text-text focus:border-gold focus:ring-1 focus:ring-gold/25 min-w-0"
      >
        {options.map((opt, i) => (
          <option key={`${opt}-${i}`} value={opt}>
            {truncate && (displayOptions?.[i] ?? opt).length > 60
              ? (displayOptions?.[i] ?? opt).slice(0, 57) + '...'
              : (displayOptions?.[i] ?? opt)}
          </option>
        ))}
      </select>
    </div>
  )
}

/** Known cert abbreviation -> full formal name mappings */
const CERT_ALIASES: Record<string, { short: string; full: string }> = {
  'pmp': { short: 'PMP', full: 'Project Management Professional (PMP)' },
  'project management professional': { short: 'PMP', full: 'Project Management Professional (PMP)' },
  'security+': { short: 'Security+', full: 'CompTIA Security+' },
  'comptia security+': { short: 'Security+', full: 'CompTIA Security+' },
  'cysa+': { short: 'CySA+', full: 'CompTIA CySA+' },
  'comptia cysa+': { short: 'CySA+', full: 'CompTIA CySA+' },
  'pentest+': { short: 'PenTest+', full: 'CompTIA PenTest+' },
  'comptia pentest+': { short: 'PenTest+', full: 'CompTIA PenTest+' },
  'a+': { short: 'A+', full: 'CompTIA A+' },
  'comptia a+': { short: 'A+', full: 'CompTIA A+' },
  'network+': { short: 'Network+', full: 'CompTIA Network+' },
  'net+': { short: 'Network+', full: 'CompTIA Network+' },
  'comptia network+': { short: 'Network+', full: 'CompTIA Network+' },
  'cissp': { short: 'CISSP', full: 'Certified Information Systems Security Professional (CISSP)' },
  'casp+': { short: 'CASP+', full: 'CompTIA CASP+' },
  'comptia casp+': { short: 'CASP+', full: 'CompTIA CASP+' },
  'ccna': { short: 'CCNA', full: 'Cisco Certified Network Associate (CCNA)' },
  'ccnp': { short: 'CCNP', full: 'Cisco Certified Network Professional (CCNP)' },
  'itil': { short: 'ITIL', full: 'ITIL Foundation' },
  'ceh': { short: 'CEH', full: 'Certified Ethical Hacker (CEH)' },
}

/** Normalize a cert name to a lookup key: strip (R), (TM), parenthetical expansions, lowercase */
function normalizeCertKey(name: string): string {
  return name
    .replace(/[®™©]/g, '')              // strip symbols
    .replace(/\s*\([^)]*\)\s*/g, ' ')   // strip parenthetical text like "(PMP)"
    .trim()
    .toLowerCase()
}

interface CertOption { short: string; full: string }

/** Deduplicate cert names */
function deduplicateCerts(rawNames: string[]): CertOption[] {
  const seen = new Map<string, CertOption>()

  for (const raw of rawNames) {
    const cleaned = raw.replace(/[®™©]/g, '').trim()
    const key = normalizeCertKey(raw)

    const alias = CERT_ALIASES[key]
    if (alias) {
      if (!seen.has(alias.short.toLowerCase())) {
        seen.set(alias.short.toLowerCase(), alias)
      }
      continue
    }

    let matched = false
    for (const [aliasKey, aliasVal] of Object.entries(CERT_ALIASES)) {
      if (key.includes(aliasKey) || aliasKey.includes(key)) {
        if (!seen.has(aliasVal.short.toLowerCase())) {
          seen.set(aliasVal.short.toLowerCase(), aliasVal)
        }
        matched = true
        break
      }
    }
    if (matched) continue

    if (!seen.has(key)) {
      seen.set(key, { short: cleaned, full: cleaned })
    }
  }

  return [...seen.values()]
}

/** Editable input for a template field */
function FieldInput({ label, value, onChange, type = 'text' }: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-[10px] text-text-muted font-heading uppercase tracking-wider w-28 flex-shrink-0">
        {label}
      </label>
      <input
        type={type}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-bg-secondary border border-border rounded px-2 py-1.5 text-xs text-text focus:border-gold focus:ring-1 focus:ring-gold/25 w-24"
      />
    </div>
  )
}

/** Convert raw DB template/role names to display names */
function formatTemplateName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase())
}

/** Map industry name to emoji icon */
function getIndustryIcon(industry: string): string {
  const lower = industry.toLowerCase()
  if (lower.includes('defense') || lower.includes('military')) return '\uD83D\uDEE1'
  if (lower.includes('tech') || lower.includes('it') || lower.includes('cyber')) return '\uD83D\uDCBB'
  if (lower.includes('federal') || lower.includes('government')) return '\uD83C\uDFDB'
  if (lower.includes('healthcare') || lower.includes('medical')) return '\uD83C\uDFE5'
  if (lower.includes('logistics') || lower.includes('supply')) return '\uD83D\uDCE6'
  if (lower.includes('finance') || lower.includes('banking')) return '\uD83D\uDCB0'
  if (lower.includes('education') || lower.includes('training')) return '\uD83D\uDCDA'
  if (lower.includes('energy') || lower.includes('utility')) return '\u26A1'
  if (lower.includes('construction') || lower.includes('engineer')) return '\uD83D\uDD27'
  return '\u25C7'
}
