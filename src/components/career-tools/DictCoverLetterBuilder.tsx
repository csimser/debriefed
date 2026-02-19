'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
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
import { UpgradeLink } from '@/components/modals/UpgradeModal'

interface DictCoverLetterBuilderProps {
  userProfile: any
  experiences: any[]
  skills: string[]
  certifications?: any[]
  education?: any[]
  onBack: () => void
  onSwitchToAI: () => void
  aiRemaining: number
  userPlan?: string
}

const SESSION_KEY = 'coverLetterJobData'

export function DictCoverLetterBuilder({
  userProfile,
  experiences,
  skills,
  certifications = [],
  education = [],
  onBack,
  onSwitchToAI,
  aiRemaining,
  userPlan,
}: DictCoverLetterBuilderProps) {
  const isFree = !isPaidTier(getUserTier({ tier: userPlan }))
  // Context inputs
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

  // Editable paragraphs (user can override)
  const [editingParagraph, setEditingParagraph] = useState<string | null>(null)
  const [paragraphOverrides, setParagraphOverrides] = useState<Record<string, string>>({})

  // Export state
  const [isDownloading, setIsDownloading] = useState(false)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const exportMenuRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAllTemplates, setShowAllTemplates] = useState(false)

  // User-selectable field overrides for template values
  const [fieldOverrides, setFieldOverrides] = useState<Record<string, string>>({})

  // Debounce timer for template re-fill on form changes
  const fillTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
        if (data.description) setJobDescription(data.description)
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

  // Fill template whenever inputs change (debounced 300ms for form field changes)
  useEffect(() => {
    if (!selectedTemplateId || !extraction) return

    if (fillTimerRef.current) clearTimeout(fillTimerRef.current)

    fillTimerRef.current = setTimeout(() => {
      const context = {
        companyName: company,
        jobTitle: jobTitle,
        hiringManagerName: hiringManager,
        applicantPhone: applicantPhone,
        applicantEmail: applicantEmail,
      }

      fillTemplate(selectedTemplateId, userProfileForMatch, extraction, context, fieldOverrides)
        .then(result => {
          if (result) {
            setFilledResult(result)
            setParagraphOverrides({})
          }
        })
        .catch(() => {})
    }, 300)

    return () => {
      if (fillTimerRef.current) clearTimeout(fillTimerRef.current)
    }
  }, [selectedTemplateId, extraction, company, jobTitle, hiringManager, userProfileForMatch, fieldOverrides])

  // Pass 2 & 3: Clean any remaining {{placeholders}} and fix punctuation
  const finalParagraphs = useMemo(() => {
    if (!filledResult) return null
    return {
      opening: paragraphOverrides.opening ?? cleanUnfilledPlaceholders(filledResult.paragraphs.opening),
      body1: paragraphOverrides.body1 ?? cleanUnfilledPlaceholders(filledResult.paragraphs.body1),
      body2: paragraphOverrides.body2 ?? cleanUnfilledPlaceholders(filledResult.paragraphs.body2),
      closing: paragraphOverrides.closing ?? cleanUnfilledPlaceholders(filledResult.paragraphs.closing),
    }
  }, [filledResult, paragraphOverrides])

  // Assemble full cover letter text for export
  const fullLetterText = useMemo(() => {
    if (!finalParagraphs) return ''
    const greeting = hiringManager
      ? `Dear ${hiringManager},`
      : 'Dear Hiring Team,'
    const body = [finalParagraphs.opening, finalParagraphs.body1, finalParagraphs.body2, finalParagraphs.closing]
      .filter(Boolean)
      .join('\n\n')
    const rawLetter = `${greeting}\n\n${body}\n\nSincerely,\n\n${applicantName}`
    return polishCoverLetter(rawLetter)
  }, [finalParagraphs, hiringManager, applicantName])

  // Word count
  const wordCount = useMemo(() => {
    if (!fullLetterText) return 0
    return fullLetterText.split(/\s+/).filter(w => w.length > 0).length
  }, [fullLetterText])

  const handleCopy = async () => {
    try {
      const { copyToClipboard } = await import('@/lib/clipboard')
      await copyToClipboard(fullLetterText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Failed to copy')
    }
  }

  const handleDownload = async (format: 'pdf' | 'docx' | 'txt') => {
    if (!fullLetterText) return
    setIsDownloading(true)
    setError('')

    try {
      const safeCompanyName = (company || 'Application').replace(/[^a-zA-Z0-9-_\s]/g, '').replace(/\s+/g, '-')

      if (format === 'txt') {
        const content = `${applicantName}\n${contactParts.join(' | ')}\n${applicantLinkedIn ? applicantLinkedIn + '\n' : ''}${'─'.repeat(60)}\n\n${formattedDate}\n\n${hiringManager ? hiringManager + '\n' : ''}${company}\n\nRE: ${jobTitle} Position\n\n${fullLetterText}`
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
            content: fullLetterText,
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
            throw new Error(errorData.error || 'Download failed')
          }
          throw new Error('Download failed')
        }

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Cover-Letter-${safeCompanyName}.${format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }
    } catch (err: any) {
      setError('Failed to download: ' + (err.message || 'Unknown error'))
    } finally {
      setIsDownloading(false)
    }
  }

  const handleParagraphEdit = (key: string, value: string) => {
    setParagraphOverrides(prev => ({ ...prev, [key]: value }))
  }

  const handleParagraphReset = (key: string) => {
    setParagraphOverrides(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
    setEditingParagraph(null)
  }

  // Has the user provided enough context to fill a template?
  const hasMinimumContext = Boolean(company || jobTitle || jobDescription)
  const hasPreviewContent = Boolean(company && jobTitle)

  /**
   * Pass 2 & 3: Remove any surviving {placeholder} or {{placeholder}} tokens gracefully.
   * Rewrites surrounding text so sentences read naturally, then cleans punctuation.
   */
  function cleanUnfilledPlaceholders(text: string): string {
    let r = text

    // No placeholders → return immediately (check both {key} and {{key}})
    if (!/\{{1,2}\w+\}{1,2}/.test(r)) return r

    // Regex fragment that matches both {key} and {{key}}
    const PH = '\\{{1,2}\\w+\\}{1,2}'
    const ph = (key: string) => `\\{{1,2}${key}\\}{1,2}`

    // --- Contextual rewrites (most specific first) ---

    // "{num_X} [noun]" → just "[noun]" (drop the numeric placeholder)
    r = r.replace(new RegExp(`\\{{1,2}num_\\w+\\}{1,2}\\s+`, 'g'), '')

    // "valued at {X}" / "worth {X}" → remove entire phrase
    r = r.replace(new RegExp(`\\s*valued\\s+at\\s+${PH}`, 'gi'), '')
    r = r.replace(new RegExp(`\\s*worth\\s+${PH}`, 'gi'), '')

    // "{value} [noun]" → remove placeholder, keep noun
    r = r.replace(new RegExp(`${ph('value')}\\s*`, 'gi'), '')

    // "across {adoption_scope}" → "across the organization"
    r = r.replace(new RegExp(`across\\s+${ph('adoption_scope')}`, 'gi'), 'across the organization')

    // "my {field} [expertise/background/experience]" → "my professional [noun]"
    r = r.replace(new RegExp(`my\\s+${ph('field')}\\s+(expertise|background|experience|knowledge)`, 'gi'), 'my professional $1')
    // "in {field}" → "in my field"
    r = r.replace(new RegExp(`in\\s+${ph('field')}`, 'gi'), 'in my field')

    // Clause-ending patterns: ", demonstrating my ability to {X}" → remove
    r = r.replace(new RegExp(`,?\\s*demonstrating\\s+(?:my|an?|the)\\s+ability\\s+to\\s+[^.]*?${PH}[^.]*?(?=\\.|$)`, 'gi'), '')
    r = r.replace(new RegExp(`,?\\s*showcasing\\s+[^.]*?${PH}[^.]*?(?=\\.|$)`, 'gi'), '')
    r = r.replace(new RegExp(`,?\\s*highlighting\\s+[^.]*?${PH}[^.]*?(?=\\.|$)`, 'gi'), '')

    // ", and {X}" / "and {X}" → remove
    r = r.replace(new RegExp(`,?\\s+and\\s+${PH}`, 'gi'), '')

    // "{X} and " → remove
    r = r.replace(new RegExp(`${PH}\\s+and\\s+`, 'gi'), '')

    // ", such as {X}" / ", including {X}" → remove
    r = r.replace(new RegExp(`,?\\s*such\\s+as\\s+${PH}`, 'gi'), '')
    r = r.replace(new RegExp(`,?\\s*including\\s+${PH}`, 'gi'), '')

    // "my {X} " → "my " (generic possessive before placeholder)
    r = r.replace(new RegExp(`my\\s+${PH}\\s+`, 'gi'), 'my ')

    // "can be reached at {phone} or {email}" → remove entire clause (contact is in header)
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xs text-text-dim">
          <button onClick={onBack} className="hover:text-text transition-colors">Cover Letter &amp; LinkedIn</button>
          <span className="text-gold">&rsaquo;</span>
          <span className="text-text-muted">Cover Letter Builder</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default">
            <span className="text-status-green">Free</span>
          </Badge>
          {!isFree && (
            <button
              onClick={onSwitchToAI}
              className="px-3 py-1.5 text-xs bg-gold/10 text-gold border border-gold/30 rounded hover:bg-gold/20 transition-colors"
            >
              Generate with AI ({aiRemaining} left)
            </button>
          )}
        </div>
      </div>

      {/* Dynamic layout: full-width form until company+title filled, then split */}
      <div className={`transition-all duration-300 ${
        hasPreviewContent
          ? 'grid grid-cols-1 lg:grid-cols-[45fr_55fr] gap-4 md:gap-6'
          : 'flex justify-center'
      }`}>
        {/* Left Column: Form */}
        <div className={`space-y-6 min-w-0 ${!hasPreviewContent ? 'w-full max-w-3xl' : ''}`}>

          {/* JOB DETAILS section */}
          <div>
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-text-dim mb-3 pb-2 border-b border-border flex items-center gap-2">
              <span className="text-gold">◈</span> JOB DETAILS
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Company Name"
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
              </div>
              <div className="space-y-2">
                <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Hiring Manager Name <span className="text-text-dim font-normal normal-case">(optional)</span>
                </label>
                <input
                  type="text"
                  name="hiring-manager"
                  value={hiringManager}
                  onChange={(e) => setHiringManager(e.target.value)}
                  placeholder="e.g., Sarah Johnson"
                  className="w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-text placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold/25"
                />
              </div>
              <div className="space-y-2">
                <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Job Description
                </label>
                <textarea
                  name="job-description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here for automatic keyword extraction and template matching..."
                  className="w-full min-h-[160px] bg-bg-secondary border border-border rounded-md px-4 py-3 text-text placeholder:text-text-dim resize-y focus:border-gold focus:ring-1 focus:ring-gold/25"
                />
                {!extraction && jobDescription.trim() && (
                  <button
                    onClick={handleExtractKeywords}
                    disabled={isExtracting}
                    className="px-3 py-1.5 text-xs bg-bg-tertiary hover:bg-bg-hover border border-border text-text-muted rounded transition-colors disabled:opacity-50"
                  >
                    {isExtracting ? 'Analyzing...' : 'Analyze Job Description'}
                  </button>
                )}
                {extraction && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {extraction.industry && (
                      <span className="text-[10px] px-2 py-0.5 bg-gold/10 text-gold rounded">
                        {extraction.industry}
                      </span>
                    )}
                    {extraction.roleType && (
                      <span className="text-[10px] px-2 py-0.5 bg-gold/10 text-gold rounded">
                        {extraction.roleType}
                      </span>
                    )}
                    {extraction.requiredSkills.slice(0, 4).map(skill => (
                      <span key={skill} className="text-[10px] px-2 py-0.5 bg-bg-tertiary text-text-dim rounded">
                        {skill}
                      </span>
                    ))}
                    {extraction.requiredSkills.length > 4 && (
                      <span className="text-[10px] px-2 py-0.5 text-text-dim">
                        +{extraction.requiredSkills.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TEMPLATE section */}
          <div>
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-text-dim mb-3 pb-2 border-b border-border flex items-center gap-2">
              <span className="text-gold">◇</span> TEMPLATE
              {scoredTemplates.length > 0 && (
                <span className="text-text-dim font-normal normal-case tracking-normal">
                  ({scoredTemplates.length} available)
                </span>
              )}
            </h3>

            {scoredTemplates.length === 0 ? (
              <p className="text-sm text-text-dim">No cover letter templates available. Contact support.</p>
            ) : (
              <>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {(showAllTemplates ? scoredTemplates : scoredTemplates.slice(0, 6)).map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setSelectedTemplateId(t.id)
                        setParagraphOverrides({})
                        setFieldOverrides({})
                      }}
                      className={`min-w-[160px] p-4 rounded-lg border-2 cursor-pointer transition-all text-left flex-shrink-0 ${
                        selectedTemplateId === t.id
                          ? 'border-gold bg-gold/5'
                          : 'border-border hover:border-gold/30'
                      }`}
                    >
                      <div className="text-2xl mb-2">{getIndustryIcon(t.industry)}</div>
                      <div className={`text-xs font-heading font-bold uppercase tracking-wider mb-1 ${
                        selectedTemplateId === t.id ? 'text-gold' : 'text-text'
                      }`}>
                        {formatTemplateName(t.template_name)}
                      </div>
                      <div className="text-[10px] text-text-dim">{formatTemplateName(t.industry)}</div>
                      {t.score > 0 && (
                        <span className="inline-block mt-2 text-[10px] px-1.5 py-0.5 bg-status-green/20 text-status-green rounded">
                          {t.score >= 3 ? 'Best match' : 'Good match'}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                {!showAllTemplates && scoredTemplates.length > 6 && (
                  <button
                    type="button"
                    onClick={() => setShowAllTemplates(true)}
                    className="text-xs text-gold hover:text-gold-bright transition-colors mt-1"
                  >
                    See {scoredTemplates.length - 6} more →
                  </button>
                )}
                {showAllTemplates && scoredTemplates.length > 6 && (
                  <button
                    type="button"
                    onClick={() => setShowAllTemplates(false)}
                    className="text-xs text-text-muted hover:text-text transition-colors mt-1"
                  >
                    Show fewer
                  </button>
                )}
              </>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={async () => {
              if (!extraction && jobDescription.trim()) {
                setIsGenerating(true)
                await handleExtractKeywords()
                setIsGenerating(false)
              } else if (extraction && selectedTemplateId) {
                // Force re-fill when extraction already exists
                const context = {
                  companyName: company,
                  jobTitle: jobTitle,
                  hiringManagerName: hiringManager,
                  applicantPhone: applicantPhone,
                  applicantEmail: applicantEmail,
                }
                const result = await fillTemplate(selectedTemplateId, userProfileForMatch, extraction, context, fieldOverrides)
                if (result) {
                  setFilledResult(result)
                  setParagraphOverrides({})
                }
              }
            }}
            disabled={!company || !jobTitle || isGenerating || isExtracting}
            className="w-full py-3 bg-gold text-bg-primary font-heading font-bold uppercase tracking-wider rounded-lg disabled:bg-border disabled:text-text-dim disabled:cursor-not-allowed hover:bg-gold-bright transition-colors"
          >
            {isGenerating || isExtracting
              ? 'Generating...'
              : filledResult
                ? '◆ REGENERATE →'
                : '◆ GENERATE COVER LETTER →'}
          </button>

          {/* AUTO-FILLED section */}
          {filledResult && filledResult.filledPlaceholders.length > 0 && (
            <div>
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-text-dim mb-3 pb-2 border-b border-border flex items-center gap-2">
                <span className="text-status-green">✓</span> AUTO-FILLED
                <span className="text-text-dim font-normal normal-case tracking-normal">
                  Adjust selections to customize
                </span>
              </h3>

              <div className="space-y-2.5">
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

                {/* Years of Experience — editable */}
                {filledResult.filledPlaceholders.includes('years_experience') && (
                  <FieldInput
                    label="Years Experience"
                    value={fieldOverrides.years_experience ?? String(userProfile?.years_of_service ?? '')}
                    onChange={(v) => setFieldOverrides(prev => ({ ...prev, years_experience: v }))}
                    type="number"
                  />
                )}

                {/* Military Rank — editable */}
                {filledResult.filledPlaceholders.includes('military_rank') && (
                  <FieldInput
                    label="Military Rank"
                    value={fieldOverrides.military_rank ?? userProfile?.rank ?? userProfile?.paygrade ?? ''}
                    onChange={(v) => setFieldOverrides(prev => ({ ...prev, military_rank: v }))}
                  />
                )}
              </div>

              {/* Non-selectable filled fields shown as badges */}
              {(() => {
                const selectableKeys = new Set([
                  'certification_1', 'certification_2', 'technical_skill_1', 'technical_skill_2',
                  'technical_skill', 'achievement_1', 'degree', 'years_experience', 'military_rank',
                ])
                const otherFilled = filledResult.filledPlaceholders.filter(k => !selectableKeys.has(k))
                if (otherFilled.length === 0) return null
                return (
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border">
                    {otherFilled.map(key => (
                      <span key={key} className="text-[10px] px-2 py-0.5 bg-status-green/10 text-status-green border border-status-green/20 rounded">
                        {formatPlaceholderLabel(key)}
                      </span>
                    ))}
                  </div>
                )
              })()}
            </div>
          )}
        </div>

        {/* Right Column: Preview — only shown when company+title filled */}
        {hasPreviewContent && (
          <div className="space-y-4">
            <div className="border-t-2 border-gold">
              {/* Preview Header with Export Actions */}
              <div className="flex items-center justify-between py-3">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="text-gold">◫</span> PREVIEW
                </h3>
                {filledResult && fullLetterText && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-dim font-mono">{wordCount} words</span>
                    <Button size="sm" variant="secondary" onClick={handleCopy} disabled={isDownloading}>
                      {copied ? '✓ Copied' : 'Copy'}
                    </Button>
                    <div className="relative" ref={exportMenuRef}>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setExportMenuOpen(!exportMenuOpen)}
                        disabled={isDownloading}
                      >
                        {isDownloading ? 'Exporting...' : '↓ Export'}
                      </Button>
                      {exportMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-bg-card border border-border rounded-lg shadow-lg z-10 overflow-hidden">
                          <button
                            onClick={() => { setExportMenuOpen(false); handleDownload('pdf') }}
                            className="w-full px-4 py-3 text-left hover:bg-bg-tertiary transition-colors flex items-center gap-3"
                          >
                            <span className="text-status-red">◈</span>
                            <div>
                              <div className="font-heading text-sm uppercase">PDF</div>
                              <div className="text-xs text-text-muted">Best for sharing</div>
                            </div>
                          </button>
                          <button
                            onClick={() => { setExportMenuOpen(false); handleDownload('docx') }}
                            className="w-full px-4 py-3 text-left hover:bg-bg-tertiary transition-colors flex items-center gap-3 border-t border-border"
                          >
                            <span className="text-status-blue">◫</span>
                            <div>
                              <div className="font-heading text-sm uppercase">DOCX</div>
                              <div className="text-xs text-text-muted">Best for ATS & editing</div>
                            </div>
                          </button>
                          <button
                            onClick={() => { setExportMenuOpen(false); handleDownload('txt') }}
                            className="w-full px-4 py-3 text-left hover:bg-bg-tertiary transition-colors flex items-center gap-3 border-t border-border"
                          >
                            <span className="text-text-dim">≡</span>
                            <div>
                              <div className="font-heading text-sm uppercase">TXT</div>
                              <div className="text-xs text-text-muted">Plain text</div>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-status-red-dim border border-status-red/20 rounded-md p-3 mb-4">
                  <p className="text-sm text-status-red">{error}</p>
                </div>
              )}

              {/* Ghost skeleton state — shown before template is filled */}
              {!filledResult ? (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6 md:p-10">
                  <div className="space-y-6 animate-pulse">
                    {/* Sender block */}
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-[40%]"></div>
                      <div className="h-2 bg-gray-100 rounded w-[55%]"></div>
                      <div className="h-2 bg-gray-100 rounded w-[35%]"></div>
                    </div>
                    <div className="border-b border-gray-200"></div>
                    {/* Date */}
                    <div className="h-2 bg-gray-100 rounded w-[25%]"></div>
                    {/* Recipient */}
                    <div className="space-y-1.5">
                      <div className="h-2 bg-gray-100 rounded w-[30%]"></div>
                      <div className="h-2 bg-gray-100 rounded w-[20%]"></div>
                    </div>
                    {/* Paragraphs */}
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
                    {/* Closing */}
                    <div className="pt-4 space-y-2">
                      <div className="h-2 bg-gray-100 rounded w-[15%]"></div>
                      <div className="h-3 bg-gray-200 rounded w-[30%] mt-4"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Professional Letter Preview */}
                  <div className="bg-white text-gray-900 rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6 md:p-10" style={{ fontFamily: 'Georgia, serif' }}>
                      {/* Sender Header */}
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

                      {/* Recipient */}
                      <div className="mb-4 text-sm text-gray-700">
                        {hiringManager && <div>{hiringManager}</div>}
                        {company && <div>{company}</div>}
                      </div>

                      {jobTitle && (
                        <div className="text-sm font-bold text-gray-900 mb-6">
                          RE: {jobTitle} Position
                        </div>
                      )}

                      {/* Greeting */}
                      <div className="text-sm text-gray-700 mb-4">
                        {hiringManager ? `Dear ${hiringManager},` : 'Dear Hiring Team,'}
                      </div>

                      {/* Body Paragraphs — click to edit */}
                      <div className="space-y-4">
                        {(['opening', 'body1', 'body2', 'closing'] as const).map(key => {
                          const text = finalParagraphs?.[key]
                          if (!text) return null
                          const isEditing = editingParagraph === key
                          const hasOverride = key in paragraphOverrides

                          if (isEditing) {
                            return (
                              <div key={key} className="relative">
                                <textarea
                                  value={paragraphOverrides[key] ?? text}
                                  onChange={(e) => handleParagraphEdit(key, e.target.value)}
                                  className="w-full min-h-[80px] p-2 text-sm text-gray-700 leading-relaxed border border-blue-300 rounded bg-blue-50 resize-none focus:outline-none focus:border-blue-500"
                                  autoFocus
                                />
                                <div className="flex items-center gap-2 mt-1">
                                  <button
                                    onClick={() => setEditingParagraph(null)}
                                    className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                  >
                                    Done
                                  </button>
                                  {hasOverride && (
                                    <button
                                      onClick={() => handleParagraphReset(key)}
                                      className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700"
                                    >
                                      Reset
                                    </button>
                                  )}
                                </div>
                              </div>
                            )
                          }

                          return (
                            <p
                              key={key}
                              onClick={() => setEditingParagraph(key)}
                              className={`text-sm leading-relaxed text-justify cursor-pointer rounded px-1 -mx-1 transition-colors hover:bg-gray-100 border-l-3 border-transparent hover:border-gold/30 ${
                                hasOverride ? 'text-gray-900' : 'text-gray-700'
                              }`}
                              title="Click to edit this paragraph"
                            >
                              {text}
                              {hasOverride && (
                                <span className="inline-block ml-1 text-[9px] text-blue-500 align-super">edited</span>
                              )}
                            </p>
                          )
                        })}
                      </div>

                      {/* Closing */}
                      <div className="mt-6 text-sm text-gray-700">Sincerely,</div>
                      <div className="mt-8">
                        <div className="text-sm font-bold text-gray-900">{applicantName}</div>
                      </div>
                    </div>

                    <div className="bg-gray-100 px-6 md:px-10 py-2 text-xs text-gray-500 flex items-center justify-between border-t border-gray-200">
                      <span>Dictionary Template &bull; Click paragraphs to edit</span>
                      <span>{wordCount} words</span>
                    </div>
                  </div>

                  {/* Source info */}
                  {filledResult && (
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-text-dim">Template: {formatTemplateName(filledResult.templateName)}</span>
                      {filledResult.filledPlaceholders.length > 0 && (
                        <span className="text-status-green">
                          {filledResult.filledPlaceholders.length} fields auto-filled
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* AI Upsell — below preview, no card wrapper */}
            {filledResult && fullLetterText && (
              <div className="pt-4 border-t border-border">
                {isFree ? (
                  <p className="text-xs text-text-dim">
                    <UpgradeLink className="text-gold hover:text-gold-bright hover:underline">Upgrade to Core</UpgradeLink>
                    {' '}for AI-generated cover letters tailored to each job posting.
                  </p>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-text-muted">Want a more personalized letter?</p>
                      <p className="text-[10px] text-text-dim">AI generation uses 1 credit ({aiRemaining} remaining)</p>
                    </div>
                    <button
                      onClick={onSwitchToAI}
                      disabled={aiRemaining <= 0}
                      className="px-4 py-2 text-xs bg-gold/10 text-gold border border-gold/30 rounded hover:bg-gold/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Enhance with AI
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
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

/** Known cert abbreviation → full formal name mappings */
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

/** Normalize a cert name to a lookup key: strip ®, ™, parenthetical expansions, lowercase */
function normalizeCertKey(name: string): string {
  return name
    .replace(/[®™©]/g, '')              // strip symbols
    .replace(/\s*\([^)]*\)\s*/g, ' ')   // strip parenthetical text like "(PMP)"
    .trim()
    .toLowerCase()
}

interface CertOption { short: string; full: string }

/** Deduplicate cert names — "PMP" and "Project Management Professional (PMP)®" merge into one */
function deduplicateCerts(rawNames: string[]): CertOption[] {
  const seen = new Map<string, CertOption>()

  for (const raw of rawNames) {
    const cleaned = raw.replace(/[®™©]/g, '').trim()
    const key = normalizeCertKey(raw)

    // Check known aliases first
    const alias = CERT_ALIASES[key]
    if (alias) {
      if (!seen.has(alias.short.toLowerCase())) {
        seen.set(alias.short.toLowerCase(), alias)
      }
      continue
    }

    // Check if any known alias matches as a substring
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

    // No known alias — use as-is if not already seen
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
  if (lower.includes('defense') || lower.includes('military')) return '🛡'
  if (lower.includes('tech') || lower.includes('it') || lower.includes('cyber')) return '💻'
  if (lower.includes('federal') || lower.includes('government')) return '🏛'
  if (lower.includes('healthcare') || lower.includes('medical')) return '🏥'
  if (lower.includes('logistics') || lower.includes('supply')) return '📦'
  if (lower.includes('finance') || lower.includes('banking')) return '💰'
  if (lower.includes('education') || lower.includes('training')) return '📚'
  if (lower.includes('energy') || lower.includes('utility')) return '⚡'
  if (lower.includes('construction') || lower.includes('engineer')) return '🔧'
  return '◇'
}
