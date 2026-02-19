'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { LastUseWarningModal } from '@/components/paywall/LastUseWarningModal'
import { usePostActionModal } from '@/components/paywall/PostActionModalProvider'
import { UpgradeLink, useUpgradeModal } from '@/components/modals/UpgradeModal'
import { getDictionary } from '@/lib/dictionary/dictionaryQueries'
import type { DictProfessionalSummary, DictRankEquivalent } from '@/lib/dictionary/types'
import { getRankTier, formatClearanceForHeadline, buildLinkedInValues, fillLinkedInTemplate, ensureProperTitle, titleCaseHeadline, smartSkillSort } from './DictLinkedInTools'
import type { DictAtsKeyword } from '@/lib/dictionary/types'

interface LinkedInToolProps {
  userProfile: any
  experiences: any[]
  skills: string[]
  certifications?: any[]
  education?: any[]
  isPro: boolean
  userTier?: 'free' | 'core' | 'full' | 'expired'
  currentUsage?: number
  usageLimit?: number
  onBack: () => void
}

export function LinkedInTool({ userProfile, experiences, skills, certifications, education, isPro, userTier = 'free', currentUsage = 0, usageLimit = 999, onBack }: LinkedInToolProps) {
  const remaining = usageLimit - currentUsage
  // Mode toggle
  const [mode, setMode] = useState<'generate' | 'analyze'>('generate')

  // Generate mode state - restore from sessionStorage if available
  const [targetRole, setTargetRole] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('linkedin_targetRole') || ''
    }
    return ''
  })
  const [generating, setGenerating] = useState(false)
  const [results, setResults] = useState<{
    headline: string
    summary: string
  } | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('linkedin_results')
      if (saved) {
        try { return JSON.parse(saved) } catch { return null }
      }
    }
    return null
  })
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  // Persist generated results and target role to sessionStorage
  useEffect(() => {
    if (results) {
      sessionStorage.setItem('linkedin_results', JSON.stringify(results))
    } else {
      sessionStorage.removeItem('linkedin_results')
    }
  }, [results])

  useEffect(() => {
    if (targetRole) {
      sessionStorage.setItem('linkedin_targetRole', targetRole)
    }
  }, [targetRole])

  // Refinement options
  const [tone, setTone] = useState<'professional' | 'conversational' | 'bold'>('professional')
  const [aboutLength, setAboutLength] = useState<'concise' | 'standard' | 'detailed'>('standard')
  const [emphasis, setEmphasis] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>(() => skills.slice(0, 5))
  const [leadWith, setLeadWith] = useState<'experience' | 'clearance' | 'certification' | 'role' | 'skill'>('experience')
  const [skillSearch, setSkillSearch] = useState('')

  // Analyze mode state
  const [linkedInPDF, setLinkedInPDF] = useState<any>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showLastUseWarning, setShowLastUseWarning] = useState(false)
  const { triggerPostActionModal } = usePostActionModal()

  // Dictionary state
  const [dictLoading, setDictLoading] = useState(true)
  const [summaries, setSummaries] = useState<DictProfessionalSummary[]>([])
  const [rankEquivalents, setRankEquivalents] = useState<DictRankEquivalent[]>([])
  const [atsKeywords, setAtsKeywords] = useState<DictAtsKeyword[]>([])
  const [dictResults, setDictResults] = useState<{
    headlines: { text: string; tone: string }[]
    summary: string
  } | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('linkedin_dictResults')
      if (saved) {
        try { return JSON.parse(saved) } catch { return null }
      }
    }
    return null
  })
  const [editedSummary, setEditedSummary] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('linkedin_dictResults')
      if (saved) {
        try { return JSON.parse(saved).summary || '' } catch { return '' }
      }
    }
    return ''
  })

  // Load dictionary data on mount
  useEffect(() => {
    getDictionary().then(dict => {
      setSummaries(dict.professionalSummaries ?? [])
      setRankEquivalents(dict.rankEquivalents ?? [])
      setAtsKeywords(dict.atsKeywords ?? [])
      setDictLoading(false)
    }).catch(() => setDictLoading(false))
  }, [])

  // Persist dict results
  useEffect(() => {
    if (dictResults) {
      sessionStorage.setItem('linkedin_dictResults', JSON.stringify(dictResults))
    } else {
      sessionStorage.removeItem('linkedin_dictResults')
    }
  }, [dictResults])

  // Auto-regenerate when tone/length/emphasis change (only if already generated)
  const [hasGenerated, setHasGenerated] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!sessionStorage.getItem('linkedin_dictResults')
    }
    return false
  })
  const emphasisKey = emphasis.join(',')
  const selectedSkillsKey = selectedSkills.join(',')
  useEffect(() => {
    if (hasGenerated && !dictLoading) {
      handleDictGenerate()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tone, aboutLength, emphasisKey, leadWith, selectedSkillsKey])

  const getCivilianTitle = () => {
    if (!userProfile?.paygrade || !userProfile?.branch || rankEquivalents.length === 0)
      return targetRole || 'Professional'
    const paygrade = (userProfile.paygrade || '').toUpperCase().trim()
    const branch = (userProfile.branch || '').toLowerCase()
    const match = rankEquivalents.find((r: DictRankEquivalent) =>
      r.paygrade.toUpperCase().trim() === paygrade &&
      r.branch.toLowerCase().includes(branch)
    )
    return match?.civilian_equivalent || targetRole || 'Professional'
  }

  const handleDictGenerate = () => {
    if (!targetRole) {
      setError('Please enter your target role')
      return
    }
    setError('')
    const rankTier = getRankTier(userProfile?.paygrade)
    const civTitle = ensureProperTitle(getCivilianTitle(), rankTier)
    const certs = (certifications || []).map((c: any) => c?.name || c).filter(Boolean)
    const targetIndustry = (userProfile?.target_industry || '').toLowerCase()

    // Get industry-relevant ATS keywords for smart sorting
    const relevantAtsKw = atsKeywords
      .filter(ak => !targetIndustry || ak.industry.toLowerCase().includes(targetIndustry))
      .flatMap(ak => ak.keywords)

    // Smart-sort skills: emphasis > ATS keywords > hard skills, deduped against certs
    const orderedSkills = smartSkillSort(selectedSkills.length > 0 ? selectedSkills : skills, emphasis, certs, relevantAtsKw)

    const values = buildLinkedInValues(userProfile, orderedSkills, certs.map((c: string) => ({ name: c })), education || [], civTitle, targetRole)
    const clearance = values['clearance'] || ''
    const industry = userProfile?.target_industry || targetRole
    const topSkill = orderedSkills[0] || 'Operations'
    const skill2 = orderedSkills[1] || ''
    const topCert = certs[0] || ''
    const years = userProfile?.years_of_service || '10+'
    const degree = values['degree'] || ''

    // Helper: build headline, enforce 220 char limit, title case, deduplicate
    const build = (parts: string[], toneTag: string): { text: string; tone: string } | null => {
      const filtered = parts.filter(Boolean)
      if (filtered.length < 2) return null
      const raw = filtered.join(' | ')
      const text = titleCaseHeadline(raw).substring(0, 220)
      return { text, tone: toneTag }
    }
    const buildFree = (text: string, toneTag: string): { text: string; tone: string } | null => {
      if (!text) return null
      return { text: titleCaseHeadline(text).substring(0, 220), tone: toneTag }
    }

    const allHeadlines: { text: string; tone: string }[] = []
    const seen = new Set<string>()
    const addUnique = (h: { text: string; tone: string } | null) => {
      if (!h) return
      const key = h.text.toLowerCase().replace(/\s+/g, ' ')
      if (seen.has(key)) return
      seen.add(key)
      allHeadlines.push(h)
    }

    // --- Lead-with headline (user-selected priority) ---
    if (leadWith === 'experience') {
      addUnique(build([`${years}+ Year ${industry} Veteran`, civTitle, topCert, topSkill], tone))
    } else if (leadWith === 'clearance' && clearance) {
      addUnique(build([`${clearance} Cleared`, civTitle, industry, topSkill], tone))
    } else if (leadWith === 'certification' && topCert) {
      addUnique(build([`${topCert} Certified ${civTitle}`, industry, topSkill, clearance], tone))
    } else if (leadWith === 'role') {
      addUnique(build([civTitle, industry, `${years}+ Years`, topCert, clearance], tone))
    } else if (leadWith === 'skill') {
      addUnique(build([`${topSkill} Expert`, civTitle, industry, topCert], tone))
    }

    // --- Professional tone variants (4) ---
    // 1. [Title] | [Industry] | [Top Skill] | [Cert] | [Clearance]
    addUnique(build([civTitle, industry, topSkill, topCert, clearance], 'professional'))
    // 2. [Title] | [Cert] Certified | [Skill 1] & [Skill 2] | [Years]+ Years Experience
    addUnique(build([
      civTitle,
      topCert ? `${topCert} Certified` : '',
      skill2 ? `${topSkill} & ${skill2}` : topSkill,
      `${years}+ Years Experience`,
    ], 'professional'))
    // 3. [Title] | [Degree] | [Cert] | [Clearance]
    if (degree) addUnique(build([civTitle, degree.replace(/^a /i, ''), topCert, clearance], 'professional'))
    // 4. [Years]+ Year [Industry] Veteran | [Title] | [Cert] | [Skill 1]
    addUnique(build([`${years}+ Year ${industry} Veteran`, civTitle, topCert, topSkill], 'professional'))

    // --- Conversational tone variants (3) ---
    // 5. [Title] helping [industry] organizations with [skill] and [skill] | [Cert]
    const convSkillPhrase = skill2 ? `${topSkill} and ${skill2}` : topSkill
    addUnique(buildFree(
      [
        `${civTitle} helping ${industry} organizations with ${convSkillPhrase}`,
        topCert,
      ].filter(Boolean).join(' | '),
      'conversational',
    ))
    // 6. Passionate about [skill] and [skill] | [Title] | [Years]+ years in [industry]
    addUnique(buildFree(
      [
        `Passionate about ${convSkillPhrase}`,
        civTitle,
        `${years}+ years in ${industry}`,
      ].join(' | '),
      'conversational',
    ))
    // 7. From military service to [industry] — [Title] | [Cert] | [Clearance]
    addUnique(buildFree(
      [
        `From military service to ${industry} — ${civTitle}`,
        topCert,
        clearance,
      ].filter(Boolean).join(' | '),
      'conversational',
    ))

    // --- Bold & Direct tone variants (3) ---
    // 8. [Title] → [Years]+ Years Driving [Skill] Results | [Cert] | [Clearance]
    addUnique(buildFree(
      [
        `${civTitle} → ${years}+ Years Driving ${topSkill} Results`,
        topCert,
        clearance,
      ].filter(Boolean).join(' | '),
      'bold',
    ))
    // 9. [Industry] [Title] | [Cert] Certified | Proven Leader | [Clearance]
    addUnique(build([
      `${industry} ${civTitle}`.replace(new RegExp(`${industry}\\s+${industry}`, 'i'), industry),
      topCert ? `${topCert} Certified` : '',
      'Proven Leader',
      clearance ? `${clearance.replace(' Clearance', '')} Cleared` : '',
    ], 'bold'))
    // 10. Mission-Driven [Title] | [Years]+ Years [Industry] | [Cert] | [Skill 1]
    addUnique(build([`Mission-Driven ${civTitle}`, `${years}+ Years ${industry}`, topCert, topSkill], 'bold'))

    // --- Generate summary ---
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

    // Fill the best-matching template (or build a fallback)
    let filledTemplate = ''
    if (matching.length > 0) {
      console.log('[LinkedIn] Selected template:', matching[0].id, matching[0].rank_tier, matching[0].target_industry)
      filledTemplate = fillLinkedInTemplate(matching[0].template_text, values)
    } else {
      filledTemplate = `${civTitle} with ${years}+ years of experience in ${values['key_skills'] || 'strategic planning and operations'}. Proven track record of delivering measurable results in ${industry} environments. Skilled in ${orderedSkills.slice(0, 3).join(', ')}, with a focus on translating complex operational challenges into business outcomes.${clearance ? ` Holds active ${clearance}.` : ''}${topCert ? ` ${topCert} certified.` : ''}`
    }
    console.log('[LinkedIn] Settings:', { tone, aboutLength, emphasis })

    // --- Build emphasis-aware lead-in elements ---
    const emphasisLower = emphasis.map(e => e.toLowerCase())
    const hasEmphasis = (tag: string) => emphasisLower.some(e => e.includes(tag) || tag.includes(e))

    let emphasisLead = ''
    if (hasEmphasis('cybersecurity') || hasEmphasis('security') || hasEmphasis('technical')) {
      emphasisLead = topCert
        ? `${topCert}-certified ${civTitle.toLowerCase()}`
        : `${topSkill}-focused ${civTitle.toLowerCase()}`
    } else if (hasEmphasis('leadership') || hasEmphasis('team')) {
      emphasisLead = `${civTitle.toLowerCase()} who has led cross-functional teams`
    } else if (hasEmphasis('certification') || hasEmphasis('cert')) {
      emphasisLead = topCert
        ? `${topCert}-certified ${civTitle.toLowerCase()}`
        : civTitle.toLowerCase()
    } else if (hasEmphasis('project') || hasEmphasis('program')) {
      emphasisLead = `${civTitle.toLowerCase()} specializing in ${topSkill}`
    } else {
      emphasisLead = civTitle.toLowerCase()
    }

    // Get the body sentences from the filled template (skip the first sentence — we rewrite it)
    const allSentences = filledTemplate.match(/[^.!?]+[.!?]+/g) || [filledTemplate]
    const bodySentences = allSentences.slice(1)

    // --- Construct summary per tone ---
    let summary = ''

    if (tone === 'professional') {
      // Third person. Keep template voice but rewrite opening with emphasis.
      const opening = emphasis.length > 0
        ? `Seasoned ${emphasisLead} with ${years}+ years of experience in ${industry}.`
        : allSentences[0]?.trim() || `${civTitle} with ${years}+ years of experience in ${industry}.`
      summary = [opening, ...bodySentences.map(s => s.trim())].join(' ')
    } else if (tone === 'conversational') {
      // First person. Completely rewrite opening.
      let opening = ''
      if (emphasis.length > 0) {
        opening = `With over ${years} years in ${industry}, I'm a ${emphasisLead} who thrives on turning complex challenges into real results.`
      } else {
        opening = `I'm a ${emphasisLead} with ${years}+ years of experience in ${industry}, and I'm passionate about driving results.`
      }
      // Convert remaining body sentences to first person
      const body = bodySentences.map(s => s.trim()
        .replace(/\bThis professional\b/gi, 'I')
        .replace(/\bThe professional\b/gi, 'I')
        .replace(/\bthis professional\b/g, 'I')
        .replace(/\bHe\/She\b/gi, 'I')
        .replace(/\bhe\/she\b/g, 'I')
        .replace(/\bhis\/her\b/g, 'my')
        .replace(/\bHis\/Her\b/gi, 'My')
        // Handle common third-person openers
        .replace(/^A \w+ (leader|professional|manager|specialist|expert)\b/i, (m) => `I'm ${m.toLowerCase().replace(/^a /, 'a ')}`)
        .replace(/\bDemonstrated\b/g, 'I\'ve demonstrated')
        .replace(/\bProven ability\b/gi, 'I have a proven ability')
        .replace(/\bKnown for\b/gi, 'I\'m known for')
        .replace(/\bSpecializes in\b/gi, 'I specialize in')
        .replace(/\bExperienced in\b/gi, 'I\'m experienced in')
        .replace(/\bExpertise in\b/gi, 'My expertise is in')
      ).join(' ')
      summary = [opening, body].filter(Boolean).join(' ')
    } else {
      // Bold & Direct. Action-forward, punchy.
      let opening = ''
      if (emphasis.length > 0) {
        opening = `Driving ${industry} outcomes as a ${emphasisLead} across ${years}+ years of high-impact operations.`
      } else {
        opening = `Driving enterprise ${industry} operations and leading cross-functional teams across ${years}+ years of ${civTitle.toLowerCase()} experience.`
      }
      // Bold-ify body sentences
      const body = bodySentences.map(s => s.trim()
        .replace(/\bResponsible for\b/gi, 'Drove')
        .replace(/\bTasked with\b/gi, 'Spearheaded')
        .replace(/\bAssisted in\b/gi, 'Delivered')
        .replace(/\bManaged\b/g, 'Commanded')
        .replace(/\bOversight of\b/gi, 'Directed')
        .replace(/\bDemonstrated\b/g, 'Delivered')
      ).join(' ')
      summary = [opening, body].filter(Boolean).join(' ')
    }

    // --- Apply length ---
    if (aboutLength === 'concise') {
      // 2-3 sentences, ~400-500 chars. Who you are + value prop + clearance/cert.
      const conciseCore = summary.match(/[^.!?]+[.!?]+/g) || [summary]
      let concise = conciseCore.slice(0, 2).join(' ').trim()
      // Append clearance/cert if not already mentioned and there's room
      if (clearance && !concise.toLowerCase().includes('clearance') && concise.length < 400) {
        concise += ` Holds active ${clearance}.`
      }
      if (topCert && !concise.toLowerCase().includes(topCert.toLowerCase()) && concise.length < 450) {
        concise += ` ${topCert} certified.`
      }
      if (concise.length > 500) {
        const sents = concise.match(/[^.!?]+[.!?]+/g) || [concise]
        concise = sents.slice(0, 2).join(' ').trim()
      }
      summary = concise
    } else if (aboutLength === 'detailed') {
      // Full template + achievements + competencies, ~1800-2200 chars
      // Build achievements from actual experience data — only real bullets
      const topBullets = (experiences || [])
        .flatMap((exp: any) => {
          const bullets = exp.bullets || exp.achievements || []
          return Array.isArray(bullets) ? bullets : []
        })
        .filter((b: any) => typeof b === 'string' && b.trim().length > 10)
        .slice(0, 3)

      // Only show Key Achievements if we have actual content
      if (topBullets.length > 0) {
        summary += `\n\nKey Achievements:\n${topBullets.map((b: string) => `• ${b.trim()}`).join('\n')}`
      }

      // Core Competencies — filter empty, trim, no trailing separator
      const competencies = orderedSkills
        .filter(s => s && s.trim())
        .slice(0, 8)
        .map(s => s.trim())
      if (competencies.length > 0) {
        summary += `\n\nCore Competencies:\n${competencies.join(' • ')}`
      }
    }
    // Standard: keep summary as-is (full template, ~1000-1200 chars)

    // --- Final cleanup pass ---
    summary = summary
      // Remove leftover placeholders / brackets
      .replace(/\{\{\w+\}\}/g, '')
      .replace(/\[[^\]]*\]/g, '')
      // Replace numeric ranges like "15-50-person", "15-50 teams", "10-30-person" with clean text
      .replace(/\b\d{1,3}-\d{1,3}[- ]person\b/g, 'cross-functional')
      .replace(/\b\d{1,3}-\d{1,3}\s+teams?\b/gi, 'cross-functional teams')
      .replace(/\b\d{1,3}-\d{1,3}\s+personnel\b/gi, 'team members')
      // Remove empty bullet points (lines that are just "•" or "• " with no text)
      .replace(/^•\s*$/gm, '')
      // Remove trailing pipes/separators
      .replace(/\|\s*$/gm, '')
      .replace(/\|\s*\./g, '.')
      // Cleanup double spaces, orphaned punctuation
      .replace(/\s{2,}/g, ' ')
      .replace(/,\s*,/g, ',')
      .replace(/,\s*\./g, '.')
      .replace(/\.\s*\./g, '.')

    // Remove section headers if their content is empty
    summary = summary.replace(/\n\nKey Achievements:\s*\n?\s*$/g, '')
    summary = summary.replace(/\n\nCore Competencies:\n?\s*$/g, '')
    // Remove blank lines left behind
    summary = summary.replace(/\n{3,}/g, '\n\n').trim()

    // Ensure summary doesn't end mid-sentence (skip if it ends with a competencies/achievements list)
    const endsWithList = /Core Competencies:\n.+$/s.test(summary) || /^• .+$/m.test(summary.split('\n').pop() || '')
    if (summary && !endsWithList && !/[.!?]$/.test(summary)) {
      const lastPeriod = Math.max(summary.lastIndexOf('.'), summary.lastIndexOf('!'), summary.lastIndexOf('?'))
      if (lastPeriod > summary.length * 0.7) {
        summary = summary.substring(0, lastPeriod + 1)
      } else {
        summary += '.'
      }
    }

    setDictResults({ headlines: allHeadlines, summary })
    setEditedSummary(summary)
    setHasGenerated(true)
    // Clear any previous AI results
    setResults(null)
  }

  const handleGenerate = async () => {
    if (!targetRole) {
      setError('Please enter your target role')
      return
    }

    if (remaining <= 0) {
      setError('Limit reached — upgrade for more generations')
      return
    }

    if (remaining === 1 && !showLastUseWarning) {
      setShowLastUseWarning(true)
      return
    }
    setShowLastUseWarning(false)

    setGenerating(true)
    setError('')

    try {
      const res = await fetch('/api/generate-linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          userProfile,
          experiences,
          skills,
          certifications: certifications || userProfile?.certifications || [],
          education: education || userProfile?.education || [],
          tone,
          aboutLength,
          emphasis,
        }),
      })

      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        setResults(data)
        // Trigger post-action modal after results render
        setTimeout(() => triggerPostActionModal('linkedin-complete'), 800)
      }
    } catch (err) {
      setError('Failed to generate. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = async (text: string, section: string) => {
    const { copyToClipboard } = await import('@/lib/clipboard')
    await copyToClipboard(text)
    setCopied(section)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div>
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xs text-text-dim">
          <button onClick={onBack} className="hover:text-text transition-colors">Cover Letter &amp; LinkedIn</button>
          <span className="text-gold">&rsaquo;</span>
          <span className="text-text-muted">LinkedIn Optimizer</span>
        </div>
        {isPro && (
          <Badge variant={remaining <= 1 ? 'red' : remaining <= 2 ? 'amber' : 'default'}>
            {remaining} AI {remaining === 1 ? 'Use' : 'Uses'} Left
          </Badge>
        )}
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-1 mb-6 bg-bg-secondary rounded-lg p-1 w-fit">
        <button
          onClick={() => setMode('generate')}
          className={`px-4 py-2 text-sm rounded-md transition-all ${
            mode === 'generate'
              ? 'bg-gold text-bg-primary font-medium'
              : 'text-text-muted hover:text-text'
          }`}
        >
          Generate
        </button>
        <button
          onClick={() => setMode('analyze')}
          className={`px-4 py-2 text-sm rounded-md transition-all ${
            mode === 'analyze'
              ? 'bg-gold text-bg-primary font-medium'
              : 'text-text-muted hover:text-text'
          }`}
        >
          Analyze Profile
        </button>
      </div>

      {mode === 'generate' ? (
        // === EXISTING GENERATE UI ===
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-4">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-text-dim pb-2 border-b border-border flex items-center gap-2">
              <span className="text-gold">◎</span> YOUR TARGET
            </h3>

            <div className="space-y-3">
              <Input
                label="Target Role / Industry"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g., Operations Manager, Project Management, Cybersecurity"
              />

              <div className="border-l-2 border-gold pl-3 bg-gold/5 rounded-r-lg p-3">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider mb-1.5">Using Your Profile Data</h4>
                <ul className="text-xs text-text-muted space-y-0.5">
                  <li>• {userProfile?.rank || 'Senior military leader'} with {userProfile?.years_of_service || '20'} years experience</li>
                  <li>• {experiences?.length || 0} work experience{experiences?.length !== 1 ? 's' : ''}</li>
                  {education && education.length > 0 && (
                    <li>• {education.map((e: any) =>
                      e.degree_type === 'master' ? "Master's Degree" :
                      e.degree_type === 'bachelor' ? "Bachelor's Degree" :
                      e.degree_type === 'associate' ? "Associate's Degree" :
                      e.degree_type || 'Degree'
                    ).join(', ')}</li>
                  )}
                  {certifications && certifications.length > 0 && (
                    <li>• {certifications.length} certification{certifications.length !== 1 ? 's' : ''}: {certifications.slice(0, 3).map((c: any) => c.name || c).join(', ')}{certifications.length > 3 ? '...' : ''}</li>
                  )}
                  <li>• {skills?.length || 0} skills</li>
                </ul>
              </div>

              {/* Customization Options */}
              <div className="space-y-3">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-text-dim pb-2 border-b border-border">Customize Output</h4>

                {/* Tone */}
                <div>
                  <label className="text-xs text-text-dim mb-1.5 block">Tone</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'professional', label: 'Professional' },
                      { id: 'conversational', label: 'Conversational' },
                      { id: 'bold', label: 'Bold & Direct' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTone(t.id as any)}
                        className={`flex-1 py-1.5 px-2 text-xs rounded transition-all ${
                          tone === t.id
                            ? 'bg-gold text-bg-primary font-medium'
                            : 'bg-bg-secondary text-text-muted hover:text-text'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lead With */}
                <div>
                  <label className="text-xs text-text-dim mb-1.5 block">Lead Headline With</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'experience', label: 'Years of Experience' },
                      { id: 'clearance', label: 'Clearance Level' },
                      { id: 'certification', label: 'Top Certification' },
                      { id: 'role', label: 'Target Role' },
                      { id: 'skill', label: 'Top Skill' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setLeadWith(opt.id as any)}
                        className={`px-2 py-1 text-xs rounded transition-all ${
                          leadWith === opt.id
                            ? 'bg-gold text-bg-primary font-medium'
                            : 'bg-bg-secondary text-text-muted hover:text-text'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* About Length */}
                <div>
                  <label className="text-xs text-text-dim mb-1.5 block">About Length</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'concise', label: 'Concise', desc: '~150 words' },
                      { id: 'standard', label: 'Standard', desc: '~250 words' },
                      { id: 'detailed', label: 'Detailed', desc: '~350 words' },
                    ].map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setAboutLength(l.id as any)}
                        className={`flex-1 py-1.5 px-2 text-xs rounded transition-all ${
                          aboutLength === l.id
                            ? 'bg-gold text-bg-primary font-medium'
                            : 'bg-bg-secondary text-text-muted hover:text-text'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Emphasis Areas */}
                <div>
                  <label className="text-xs text-text-dim mb-1.5 block">Emphasize (select up to 3)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Leadership',
                      'Technical Skills',
                      'Certifications',
                      'Project Management',
                      'Team Development',
                      'Process Improvement',
                      'Safety/Compliance',
                      'Cybersecurity',
                      'Clearance',
                      'Federal Experience',
                      'Operations',
                      'Training & Development',
                      'Budget Management',
                    ].map((area) => {
                      const isSelected = emphasis.includes(area)
                      return (
                        <button
                          key={area}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setEmphasis(emphasis.filter(e => e !== area))
                            } else if (emphasis.length < 3) {
                              setEmphasis([...emphasis, area])
                            }
                          }}
                          className={`px-2 py-1 text-xs rounded transition-all ${
                            isSelected
                              ? 'bg-gold text-bg-primary'
                              : 'bg-bg-secondary text-text-dim hover:text-text-muted'
                          }`}
                        >
                          {area}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Skill Selection */}
                <div>
                  <label className="text-xs text-text-dim mb-1.5 block">Skills to Highlight ({selectedSkills.length}/{skills.length})</label>
                  <input
                    type="text"
                    name="skill-search"
                    placeholder="Search skills..."
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs rounded bg-bg-secondary border border-border text-text placeholder:text-text-dim focus:outline-none focus:border-gold mb-2"
                  />
                  <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto">
                    {skills
                      .filter(s => !skillSearch || s.toLowerCase().includes(skillSearch.toLowerCase()))
                      .map((skill) => {
                        const isSelected = selectedSkills.includes(skill)
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedSkills(selectedSkills.filter(s => s !== skill))
                              } else {
                                setSelectedSkills([...selectedSkills, skill])
                              }
                            }}
                            className={`px-2 py-1 text-xs rounded transition-all ${
                              isSelected
                                ? 'bg-gold text-bg-primary'
                                : 'bg-bg-secondary text-text-dim hover:text-text-muted'
                            }`}
                          >
                            {skill}
                          </button>
                        )
                      })}
                    {skills.filter(s => !skillSearch || s.toLowerCase().includes(skillSearch.toLowerCase())).length === 0 && (
                      <p className="text-xs text-text-dim">No matching skills</p>
                    )}
                  </div>
                  {selectedSkills.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedSkills([])}
                      className="text-xs text-text-dim hover:text-text mt-1"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-status-red-dim border border-status-red/20 rounded-md p-3">
                  <p className="text-sm text-status-red">{error}</p>
                </div>
              )}

              <Button
                className="w-full"
                onClick={handleDictGenerate}
                disabled={dictLoading}
              >
                {dictLoading ? 'Loading Dictionary...' : '✦ Generate LinkedIn Content'}
              </Button>
            </div>
          </div>

          {/* Output */}
          <div className="space-y-6">
            {/* Headline */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="text-gold">◆</span> Headline
                </h3>
                {(results?.headline || (dictResults?.headlines && dictResults.headlines.length > 0)) && (
                  <button
                    onClick={() => {
                      const headlineText = results?.headline || dictResults?.headlines?.find(h => h.tone === tone)?.text || dictResults?.headlines?.[0]?.text || ''
                      handleCopy(headlineText, 'headline-main')
                    }}
                    className="text-xs text-text-muted hover:text-text"
                  >
                    {copied === 'headline-main' ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>

              {results?.headline ? (
                <div>
                  <div className="bg-bg-secondary rounded-lg p-4 mb-2">
                    <p className="text-xs text-gold font-semibold mb-1">AI Enhanced</p>
                    <p className="text-lg font-medium">{results.headline}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(results.headline, 'headline')}
                    className="text-xs text-text-muted hover:text-text"
                  >
                    {copied === 'headline' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              ) : generating ? (
                <div className="h-16 flex items-center justify-center">
                  <div className="animate-pulse text-text-muted">Enhancing with AI...</div>
                </div>
              ) : dictResults?.headlines ? (
                <div className="space-y-2">
                  {dictResults.headlines.map((h, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        h.tone === tone
                          ? 'bg-gold/10 border-gold/30'
                          : 'bg-bg-secondary border-border'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-text-dim uppercase tracking-wider">
                          {h.tone === 'professional' ? 'Professional' : h.tone === 'conversational' ? 'Conversational' : 'Bold & Direct'}
                        </span>
                        <p className={`text-sm ${h.tone === tone ? 'font-medium text-text' : 'text-text-muted'}`}>{h.text}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(h.text, `headline-${idx}`)}
                        className="ml-2 px-2 py-1 text-xs bg-gold/20 text-gold rounded hover:bg-gold/30 transition-colors flex-shrink-0"
                      >
                        {copied === `headline-${idx}` ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                /* Skeleton shimmer state */
                <div className="space-y-2">
                  <div className="p-3 rounded-lg border border-border bg-bg-secondary">
                    <div className="animate-pulse space-y-2">
                      <div className="h-2 bg-text-dim/10 rounded w-[20%]"></div>
                      <div className="h-3 bg-text-dim/10 rounded w-[85%]"></div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-bg-secondary">
                    <div className="animate-pulse space-y-2">
                      <div className="h-2 bg-text-dim/10 rounded w-[25%]"></div>
                      <div className="h-3 bg-text-dim/10 rounded w-[75%]"></div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-bg-secondary">
                    <div className="animate-pulse space-y-2">
                      <div className="h-2 bg-text-dim/10 rounded w-[18%]"></div>
                      <div className="h-3 bg-text-dim/10 rounded w-[90%]"></div>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-xs text-text-dim mt-2">Max 220 characters for LinkedIn</p>

              {/* Enhance with AI / Upgrade nudge */}
              {dictResults?.headlines && !results?.headline && !generating && (
                isPro ? (
                  <button
                    onClick={handleGenerate}
                    disabled={generating || remaining <= 0}
                    className="mt-3 w-full py-2 px-3 text-sm bg-bg-secondary border border-gold/30 rounded-lg text-gold hover:bg-gold/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {remaining <= 0 ? 'AI Limit Reached' : '✦ Enhance with AI'}
                  </button>
                ) : (
                  <div className="mt-3 p-3 bg-gold/5 border border-gold/20 rounded-lg text-center">
                    <p className="text-xs text-text-muted">
                      <UpgradeLink className="text-gold hover:text-gold-bright">Upgrade to Core</UpgradeLink> for AI-enhanced headlines
                    </p>
                  </div>
                )
              )}
            </Card>

            {/* Summary */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="text-gold">◫</span> About / Summary
                </h3>
                <div className="flex items-center gap-2">
                  {dictResults?.summary && !results?.summary && (
                    <button
                      onClick={handleDictGenerate}
                      className="text-xs text-text-muted hover:text-text"
                    >
                      Regenerate
                    </button>
                  )}
                  {(results?.summary || editedSummary) && (
                    <button
                      onClick={() => handleCopy(results?.summary || editedSummary, 'summary')}
                      className="text-xs text-text-muted hover:text-text"
                    >
                      {copied === 'summary' ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
              </div>

              {results?.summary ? (
                <div>
                  <div className="bg-bg-secondary rounded-lg p-4 max-h-80 overflow-auto">
                    <p className="text-xs text-gold font-semibold mb-2">AI Enhanced</p>
                    <p className="whitespace-pre-line text-sm leading-relaxed">{results.summary}</p>
                  </div>
                </div>
              ) : generating ? (
                <div className="h-48 flex items-center justify-center">
                  <div className="animate-pulse text-text-muted">Enhancing with AI...</div>
                </div>
              ) : dictResults?.summary ? (
                <textarea
                  name="linkedin-summary"
                  value={editedSummary}
                  onChange={(e) => setEditedSummary(e.target.value)}
                  className="w-full min-h-[200px] px-3 py-3 bg-bg-secondary border border-border rounded-lg text-sm leading-relaxed focus:border-gold focus:ring-1 focus:ring-gold/25 transition-all resize-y"
                />
              ) : (
                /* Skeleton shimmer state */
                <div className="animate-pulse space-y-3 min-h-[200px] p-4 bg-bg-secondary rounded-lg border border-border">
                  <div className="h-2 bg-text-dim/10 rounded w-full"></div>
                  <div className="h-2 bg-text-dim/10 rounded w-[95%]"></div>
                  <div className="h-2 bg-text-dim/10 rounded w-[88%]"></div>
                  <div className="h-2 bg-text-dim/10 rounded w-full"></div>
                  <div className="h-2 bg-text-dim/10 rounded w-[92%]"></div>
                  <div className="h-2 bg-text-dim/10 rounded w-[78%]"></div>
                  <div className="h-2 bg-text-dim/10 rounded w-full"></div>
                  <div className="h-2 bg-text-dim/10 rounded w-[85%]"></div>
                  <div className="h-2 bg-text-dim/10 rounded w-[70%]"></div>
                </div>
              )}

              <p className="text-xs text-text-dim mt-2">Optimized for LinkedIn's 2,600 character limit</p>

              {/* Inline upgrade prompt instead of card */}
              {dictResults?.summary && !results?.summary && !generating && (
                isPro ? (
                  <button
                    onClick={handleGenerate}
                    disabled={generating || remaining <= 0}
                    className="mt-3 w-full py-2 px-3 text-sm bg-bg-secondary border border-gold/30 rounded-lg text-gold hover:bg-gold/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {remaining <= 0 ? 'AI Limit Reached' : '✦ Enhance with AI'}
                  </button>
                ) : (
                  <p className="mt-3 text-xs text-text-dim">
                    <span className="text-gold">◆</span> Want deeper insights?{' '}
                    <UpgradeLink className="text-gold hover:text-gold-bright hover:underline">Upgrade to Full</UpgradeLink>
                    {' '}for a complete profile audit with specific fixes.
                  </p>
                )
              )}
            </Card>
          </div>
        </div>
      ) : (
        // === NEW ANALYZE UI ===
        // Free users can see score, but recommendations are paywalled
        <AnalyzeMode
          linkedInPDF={linkedInPDF}
          setLinkedInPDF={setLinkedInPDF}
          analysis={analysis}
          setAnalysis={setAnalysis}
          isAnalyzing={isAnalyzing}
          setIsAnalyzing={setIsAnalyzing}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
          targetRole={targetRole}
          isPro={userTier === 'full'}
        />
      )}

      {showLastUseWarning && (
        <LastUseWarningModal
          featureName="LinkedIn Generation"
          tier={isPro ? 'full' : 'free'}
          limitType="tier"
          onContinue={() => {
            setShowLastUseWarning(false)
            handleGenerate()
          }}
          onViewPricing={() => {
            setShowLastUseWarning(false)
          }}
        />
      )}
    </div>
  )
}

// Analyze Mode Component
function AnalyzeMode({
  linkedInPDF,
  setLinkedInPDF,
  analysis,
  setAnalysis,
  isAnalyzing,
  setIsAnalyzing,
  isUploading,
  setIsUploading,
  targetRole,
  isPro,
}: {
  linkedInPDF: any
  setLinkedInPDF: (data: any) => void
  analysis: any
  setAnalysis: (data: any) => void
  isAnalyzing: boolean
  setIsAnalyzing: (val: boolean) => void
  isUploading: boolean
  setIsUploading: (val: boolean) => void
  targetRole: string
  isPro: boolean
}) {
  const { openUpgradeModal } = useUpgradeModal()
  const [showInstructions, setShowInstructions] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [copiedSection, setCopiedSection] = useState<string | null>(null)
  const [expandedPositions, setExpandedPositions] = useState<number[]>([0]) // First position expanded by default

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.pdf')) {
      setUploadError('Please upload a PDF file')
      return
    }

    setIsUploading(true)
    setUploadError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/parse-linkedin-pdf', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process PDF')
      }

      setLinkedInPDF(data.profileData)
    } catch (err: any) {
      setUploadError(err.message || 'Failed to process LinkedIn PDF')
    } finally {
      setIsUploading(false)
    }
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze-linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkedInData: linkedInPDF,
          targetCriteria: {
            targetRole: targetRole || 'General professional role',
            targetIndustry: '',
            careerLevel: 'senior',
            priorities: [],
          },
          isPro: true,
        }),
      })
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      setAnalysis(data.analysis)
    } catch (err: any) {
      setUploadError(err.message || 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const copyAnalysisText = async (text: string, section: string) => {
    const { copyToClipboard } = await import('@/lib/clipboard')
    await copyToClipboard(text)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-status-green'
    if (score >= 60) return 'text-status-amber'
    return 'text-status-red'
  }

  // Recommendations Paywall Component for free users
  const RecommendationsPaywall = () => (
    <Card className="p-6 border-gold/30 bg-gradient-to-br from-gold/5 to-transparent">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-3 bg-gold/20 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-text mb-2">Upgrade to Full to unlock AI-powered recommendations</h3>
        <p className="text-sm text-text-muted mb-4">
          Get specific rewrites for your headline, about section, skills recommendations, and priority actions.
        </p>
        <Button onClick={openUpgradeModal}>
          Get Full Access
        </Button>
      </div>
    </Card>
  )

  // Show analysis results
  if (analysis) {
    return (
      <div className="space-y-6">
        {/* Overall Score - visible to all */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider">Profile Score</h3>
              <p className="text-text-muted text-sm">Based on full profile analysis</p>
            </div>
            <div className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
              {analysis.overallScore}<span className="text-lg text-text-muted">/100</span>
            </div>
          </div>
        </Card>

        {/* Section Scores Summary - visible to all */}
        <Card className="p-6">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="text-gold">◎</span> Section Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {analysis.sections.headline && (
              <div className="p-3 bg-bg-secondary rounded-lg text-center">
                <p className="text-xs text-text-dim mb-1">Headline</p>
                <p className={`text-2xl font-bold ${getScoreColor(analysis.sections.headline.score)}`}>
                  {analysis.sections.headline.score}
                </p>
              </div>
            )}
            {analysis.sections.about && (
              <div className="p-3 bg-bg-secondary rounded-lg text-center">
                <p className="text-xs text-text-dim mb-1">About</p>
                <p className={`text-2xl font-bold ${getScoreColor(analysis.sections.about.score)}`}>
                  {analysis.sections.about.score}
                </p>
              </div>
            )}
            {analysis.sections.experience && (
              <div className="p-3 bg-bg-secondary rounded-lg text-center">
                <p className="text-xs text-text-dim mb-1">Experience</p>
                <p className={`text-2xl font-bold ${getScoreColor(analysis.sections.experience.score)}`}>
                  {analysis.sections.experience.score}
                </p>
              </div>
            )}
            {analysis.sections.skills && (
              <div className="p-3 bg-bg-secondary rounded-lg text-center">
                <p className="text-xs text-text-dim mb-1">Skills</p>
                <p className={`text-2xl font-bold ${getScoreColor(analysis.sections.skills.score)}`}>
                  {analysis.sections.skills.score}
                </p>
              </div>
            )}
            {analysis.sections.certifications && (
              <div className="p-3 bg-bg-secondary rounded-lg text-center">
                <p className="text-xs text-text-dim mb-1">Certifications</p>
                <p className={`text-2xl font-bold ${getScoreColor(analysis.sections.certifications.score)}`}>
                  {analysis.sections.certifications.score}
                </p>
              </div>
            )}
            {analysis.sections.education && (
              <div className="p-3 bg-bg-secondary rounded-lg text-center">
                <p className="text-xs text-text-dim mb-1">Education</p>
                <p className={`text-2xl font-bold ${getScoreColor(analysis.sections.education.score)}`}>
                  {analysis.sections.education.score}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Paywall for free users - show after scores */}
        {!isPro && <RecommendationsPaywall />}

        {/* Quick Wins - only for pro users */}
        {isPro && analysis.quickWins && (
          <Card className="p-6">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="text-gold">⚡</span> Quick Wins
            </h3>
            <ul className="space-y-2">
              {analysis.quickWins.map((win: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm text-text-muted">
                  <span className="text-status-green">•</span>
                  {win}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Headline - only for pro users */}
        {isPro && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="text-gold">◆</span> Headline
                <span className={`text-lg font-bold ml-2 ${getScoreColor(analysis.sections.headline.score)}`}>
                  {analysis.sections.headline.score}/100
                </span>
              </h3>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => copyAnalysisText(analysis.sections.headline.suggested, 'headline')}
              >
                {copiedSection === 'headline' ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-dim mb-1">Current</p>
                <p className="text-text-muted bg-bg-tertiary rounded-lg p-3 text-sm">{analysis.sections.headline.current}</p>
              </div>
              <div>
                <p className="text-xs text-text-dim mb-1">Suggested</p>
                <p className="text-text bg-status-green-dim border border-status-green/30 rounded-lg p-3">{analysis.sections.headline.suggested}</p>
              </div>
            </div>
          </Card>
        )}

        {/* About - only for pro users */}
        {isPro && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="text-gold">◫</span> About Section
                <span className={`text-lg font-bold ml-2 ${getScoreColor(analysis.sections.about.score)}`}>
                  {analysis.sections.about.score}/100
                </span>
              </h3>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => copyAnalysisText(analysis.sections.about.suggested, 'about')}
              >
                {copiedSection === 'about' ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-dim mb-1">Current</p>
                <p className="text-text-muted bg-bg-tertiary rounded-lg p-3 text-sm max-h-24 overflow-auto">{analysis.sections.about.current || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs text-text-dim mb-1">Suggested</p>
                <p className="text-text bg-status-green-dim border border-status-green/30 rounded-lg p-3 whitespace-pre-wrap max-h-48 overflow-auto">{analysis.sections.about.suggested}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Experience Analysis (if available) - only for pro users */}
        {isPro && analysis.sections.experience && (
          <Card className="p-6">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-gold">◆</span> Experience Analysis
              <span className={`text-lg font-bold ml-2 ${getScoreColor(analysis.sections.experience.score)}`}>
                {analysis.sections.experience.score}/100
              </span>
            </h3>

            {/* Overall Experience Tips */}
            {analysis.sections.experience.overallTips?.length > 0 && (
              <div className="bg-bg-tertiary rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-gold mb-2">General Recommendations</h4>
                <ul className="space-y-1">
                  {analysis.sections.experience.overallTips.map((tip: string, i: number) => (
                    <li key={i} className="text-sm text-text-muted flex items-start gap-2">
                      <span className="text-gold">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Individual Positions */}
            <div className="space-y-4">
              {analysis.sections.experience.positions?.map((position: any, posIdx: number) => (
                <div key={posIdx} className="bg-bg-secondary border border-border rounded-lg overflow-hidden">
                  {/* Position Header - Clickable */}
                  <button
                    onClick={() => {
                      setExpandedPositions(prev =>
                        prev.includes(posIdx)
                          ? prev.filter(i => i !== posIdx)
                          : [...prev, posIdx]
                      )
                    }}
                    className="w-full p-4 flex items-center justify-between hover:bg-bg-tertiary/50 transition-colors"
                  >
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="font-medium text-text">{position.originalTitle}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          position.score >= 80 ? 'bg-status-green-dim text-status-green' :
                          position.score >= 60 ? 'bg-status-amber-dim text-status-amber' :
                          'bg-status-red-dim text-status-red'
                        }`}>
                          {position.score}/100
                        </span>
                        {/* Disposition Badge */}
                        {position.disposition && (
                          <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                            position.disposition === 'keep' ? 'bg-status-green-dim text-status-green' :
                            position.disposition === 'enhance' ? 'bg-gold/20 text-gold' :
                            position.disposition === 'condense' ? 'bg-status-blue/20 text-status-blue' :
                            'bg-status-red-dim text-status-red'
                          }`}>
                            {position.disposition === 'keep' ? '✓ Keep' :
                             position.disposition === 'enhance' ? '↑ Enhance' :
                             position.disposition === 'condense' ? '⊕ Condense' :
                             '✕ Remove'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-muted">{position.company}</p>
                      {/* Disposition Reason */}
                      {position.dispositionReason && (
                        <p className={`text-xs mt-1 ${
                          position.disposition === 'remove' ? 'text-status-red' :
                          position.disposition === 'condense' ? 'text-status-blue' :
                          'text-gold'
                        }`}>
                          {position.dispositionReason}
                        </p>
                      )}
                      {/* Title Suggestion */}
                      {position.suggestedTitle && position.suggestedTitle !== position.originalTitle && (
                        <p className="text-xs text-status-green mt-1">
                          Suggested title: {position.suggestedTitle}
                        </p>
                      )}
                    </div>
                    <svg
                      className={`w-5 h-5 text-text-muted transition-transform ${expandedPositions.includes(posIdx) ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Bullets Analysis - Expandable */}
                  {expandedPositions.includes(posIdx) && (
                    <div className="p-4 pt-0 space-y-4 border-t border-border">
                      {position.bullets?.map((bullet: any, bulletIdx: number) => (
                        <div key={bulletIdx} className="space-y-2">
                          {/* Original Bullet */}
                          <div className="flex items-start gap-3">
                            <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              bullet.score >= 80 ? 'bg-status-green-dim text-status-green' :
                              bullet.score >= 60 ? 'bg-status-amber-dim text-status-amber' :
                              'bg-status-red-dim text-status-red'
                            }`}>
                              {bullet.score}
                            </span>
                            <div className="flex-1">
                              <p className="text-sm text-text-muted">{bullet.original}</p>

                              {/* Issues */}
                              {bullet.issues?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {bullet.issues.map((issue: string, i: number) => (
                                    <span key={i} className="text-xs px-2 py-0.5 bg-status-red-dim text-status-red rounded">
                                      {issue}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Rewritten Bullet */}
                          {bullet.rewritten && bullet.score < 90 && (
                            <div className="ml-10 p-3 bg-gold/10 border border-gold/30 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gold font-medium">Suggested Rewrite</span>
                                <button
                                  onClick={() => copyAnalysisText(bullet.rewritten, `bullet-${posIdx}-${bulletIdx}`)}
                                  className="text-xs text-text-muted hover:text-text"
                                >
                                  {copiedSection === `bullet-${posIdx}-${bulletIdx}` ? 'Copied!' : 'Copy'}
                                </button>
                              </div>
                              <p className="text-sm text-text">{bullet.rewritten}</p>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Missing Bullets Suggestions */}
                      {position.missingBullets?.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <h5 className="text-xs text-text-muted mb-2">Consider Adding:</h5>
                          <ul className="space-y-2">
                            {position.missingBullets.map((bullet: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-status-green">+</span>
                                <span className="text-text-muted">{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Copy All Rewrites Button */}
            {analysis.sections.experience.positions?.some((p: any) => p.bullets?.some((b: any) => b.rewritten)) && (
              <button
                onClick={() => {
                  const allRewrites = analysis.sections.experience.positions
                    ?.flatMap((p: any) => p.bullets?.map((b: any) => b.rewritten).filter(Boolean) || [])
                    .join('\n\n')
                  copyAnalysisText(allRewrites, 'all-rewrites')
                }}
                className="w-full mt-4 py-3 bg-bg-tertiary text-text-muted rounded-lg hover:bg-bg-secondary transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {copiedSection === 'all-rewrites' ? 'Copied All Rewrites!' : 'Copy All Rewritten Bullets'}
              </button>
            )}
          </Card>
        )}

        {/* Skills (if available) - only for pro users */}
        {isPro && analysis.sections.skills && (
          <Card className="p-6">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-gold">◈</span> Skills Analysis
              <span className={`text-lg font-bold ml-2 ${getScoreColor(analysis.sections.skills.score)}`}>
                {analysis.sections.skills.score}/100
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-status-green-dim border border-status-green/30 rounded-lg">
                <p className="text-xs text-status-green font-semibold mb-2">Add These Skills</p>
                <ul className="space-y-1">
                  {analysis.sections.skills.add?.map((skill: string, i: number) => (
                    <li key={i} className="text-sm text-text-muted">+ {skill}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3 bg-status-red-dim border border-status-red/30 rounded-lg">
                <p className="text-xs text-status-red font-semibold mb-2">Consider Removing</p>
                <ul className="space-y-1">
                  {analysis.sections.skills.remove?.map((skill: string, i: number) => (
                    <li key={i} className="text-sm text-text-muted">- {skill}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3 bg-gold/10 border border-gold/30 rounded-lg">
                <p className="text-xs text-gold font-semibold mb-2">Move to Top</p>
                <ul className="space-y-1">
                  {analysis.sections.skills.reorder?.map((skill: string, i: number) => (
                    <li key={i} className="text-sm text-text-muted">{i + 1}. {skill}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Certifications (if available) - only for pro users */}
        {isPro && analysis.sections.certifications && (
          <Card className="p-6">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-gold">◎</span> Certifications
              <span className={`text-lg font-bold ml-2 ${getScoreColor(analysis.sections.certifications.score)}`}>
                {analysis.sections.certifications.score}/100
              </span>
            </h3>

            {/* Current Certifications Analysis */}
            {analysis.sections.certifications.analysis?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-text-dim mb-2">Current Certifications</p>
                <div className="space-y-2">
                  {analysis.sections.certifications.analysis.map((cert: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-bg-secondary rounded-lg">
                      <span className="text-sm text-text">{cert.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          cert.relevance === 'high' ? 'bg-status-green-dim text-status-green' :
                          cert.relevance === 'medium' ? 'bg-status-amber-dim text-status-amber' :
                          'bg-status-red-dim text-status-red'
                        }`}>
                          {cert.relevance}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Certifications */}
            {analysis.sections.certifications.recommended?.length > 0 && (
              <div className="p-3 bg-status-green-dim border border-status-green/30 rounded-lg mb-4">
                <p className="text-xs text-status-green font-semibold mb-2">Recommended to Pursue</p>
                <ul className="space-y-1">
                  {analysis.sections.certifications.recommended.map((cert: string, i: number) => (
                    <li key={i} className="text-sm text-text-muted">+ {cert}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tips */}
            {analysis.sections.certifications.tips?.length > 0 && (
              <div className="space-y-1">
                {analysis.sections.certifications.tips.map((tip: string, i: number) => (
                  <p key={i} className="text-sm text-text-muted flex items-start gap-2">
                    <span className="text-gold">•</span>
                    {tip}
                  </p>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Education (if available) - only for pro users */}
        {isPro && analysis.sections.education && (
          <Card className="p-6">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-gold">◫</span> Education
              <span className={`text-lg font-bold ml-2 ${getScoreColor(analysis.sections.education.score)}`}>
                {analysis.sections.education.score}/100
              </span>
            </h3>

            {/* Education Entries */}
            {analysis.sections.education.entries?.length > 0 && (
              <div className="space-y-3 mb-4">
                {analysis.sections.education.entries.map((edu: any, i: number) => (
                  <div key={i} className="p-3 bg-bg-secondary rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-text">{edu.school}</p>
                        <p className="text-sm text-text-muted">{edu.degree}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        edu.relevance === 'high' ? 'bg-status-green-dim text-status-green' :
                        edu.relevance === 'medium' ? 'bg-status-amber-dim text-status-amber' :
                        'bg-status-red-dim text-status-red'
                      }`}>
                        {edu.relevance}
                      </span>
                    </div>
                    {edu.tip && (
                      <p className="text-xs text-gold mt-2">{edu.tip}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Tips */}
            {analysis.sections.education.tips?.length > 0 && (
              <div className="space-y-1">
                {analysis.sections.education.tips.map((tip: string, i: number) => (
                  <p key={i} className="text-sm text-text-muted flex items-start gap-2">
                    <span className="text-gold">•</span>
                    {tip}
                  </p>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Keywords (if available) - only for pro users */}
        {isPro && analysis.sections.keywords && (
          <Card className="p-6">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-gold">◇</span> Keyword Analysis
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-dim mb-2">Missing Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.sections.keywords.missing?.map((kw: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-status-red-dim text-status-red rounded text-xs">{kw}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-text-dim mb-2">Present Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.sections.keywords.present?.map((kw: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-status-green-dim text-status-green rounded text-xs">{kw}</span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Priority Actions (if available) - only for pro users */}
        {isPro && analysis.priorityActions && (
          <Card className="p-6">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-gold">▶</span> Priority Actions
            </h3>
            <div className="space-y-3">
              {analysis.priorityActions.map((action: any, i: number) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-bg-secondary rounded-lg">
                  <span className="w-8 h-8 flex items-center justify-center bg-gold text-bg-primary font-bold rounded-full text-sm">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-text">{action.action}</span>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      action.impact === 'high' ? 'bg-status-green-dim text-status-green' :
                      action.impact === 'medium' ? 'bg-status-amber-dim text-status-amber' :
                      'bg-bg-tertiary text-text-muted'
                    }`}>
                      {action.impact}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      action.effort === 'easy' ? 'bg-status-blue/20 text-status-blue' :
                      action.effort === 'medium' ? 'bg-status-amber-dim text-status-amber' :
                      'bg-status-red-dim text-status-red'
                    }`}>
                      {action.effort}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Start Over */}
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            setAnalysis(null)
            setLinkedInPDF(null)
          }}
        >
          Start Over
        </Button>
      </div>
    )
  }

  // Show profile preview + analyze button
  if (linkedInPDF) {
    return (
      <div className="space-y-6">
        <Card className="p-4 border-status-green/30">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-status-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div className="flex-1">
              <p className="font-medium text-text">{linkedInPDF.name || 'LinkedIn Profile'}</p>
              <p className="text-sm text-text-muted">
                Profile loaded • {linkedInPDF.skills?.length || 0} skills found
              </p>
            </div>
            <button
              onClick={() => setLinkedInPDF(null)}
              className="text-text-muted hover:text-text text-sm"
            >
              Change
            </button>
          </div>
        </Card>

        {isPro ? (
          <Button
            className="w-full"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Analyzing Your Profile...
              </>
            ) : (
              '✦ Analyze My Profile'
            )}
          </Button>
        ) : (
          <div className="w-full p-4 bg-gold/10 border border-gold/30 rounded-lg text-center">
            <p className="text-sm font-medium text-text mb-1">Upgrade to Full for AI-powered LinkedIn analysis</p>
            <p className="text-xs text-text-muted mb-3">Get detailed scores, headline rewrites, skills audit, and keyword recommendations</p>
            <UpgradeLink className="inline-block px-4 py-2 bg-gold text-bg-primary rounded font-heading font-bold uppercase text-sm hover:bg-gold-bright transition-colors">
              View Plans
            </UpgradeLink>
          </div>
        )}
      </div>
    )
  }

  // Show upload UI
  return (
    <div className="space-y-6">
      {/* What You'll Get */}
      <Card className="p-6 bg-gradient-to-r from-bg-secondary to-bg-tertiary">
        <h3 className="text-lg font-semibold text-text mb-4">What You'll Get</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-text text-sm">Headline Rewrite</p>
              <p className="text-xs text-text-dim">Keyword-optimized for your target role</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-text text-sm">About Section</p>
              <p className="text-xs text-text-dim">Complete rewrite ready to copy/paste</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-text text-sm">Skills Audit</p>
              <p className="text-xs text-text-dim">Add, remove, and reorder recommendations</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-text text-sm">Keyword Analysis</p>
              <p className="text-xs text-text-dim">Missing keywords for search visibility</p>
            </div>
          </div>
        </div>
      </Card>

      {/* How to Export Instructions (collapsible) */}
      <Card className="overflow-hidden">
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="w-full p-4 flex items-center justify-between hover:bg-bg-secondary/50"
        >
          <span className="font-medium text-text">How to export your LinkedIn profile</span>
          <svg className={`w-5 h-5 text-text-muted transition-transform ${showInstructions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showInstructions && (
          <div className="p-4 pt-0 border-t border-border">
            <ol className="space-y-3 text-sm text-text-muted">
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-gold text-bg-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                <span>Go to your LinkedIn profile (click "Me" → "View Profile")</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-gold text-bg-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                <span>Click the <strong className="text-text">"Resources"</strong> button in your profile header</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-gold text-bg-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                <span>Select <strong className="text-text">"Save to PDF"</strong> from the dropdown</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-gold text-bg-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                <span>Upload the downloaded PDF below</span>
              </li>
            </ol>
            <div className="mt-4 p-3 bg-bg-tertiary rounded-lg border border-border">
              <p className="text-xs text-text-dim mb-1">Quick path:</p>
              <p className="text-sm text-gold font-mono">
                Profile → Resources → Save to PDF
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Upload Drop Zone */}
      <Card
        className="p-10 text-center border-dashed border-2 hover:border-gold/50 cursor-pointer transition-colors"
        onClick={() => document.getElementById('linkedin-pdf')?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          const file = e.dataTransfer.files[0]
          if (file) handleFileUpload(file)
        }}
      >
        <input
          id="linkedin-pdf"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileUpload(file)
          }}
        />
        {isUploading ? (
          <div className="flex flex-col items-center">
            <span className="animate-spin text-3xl mb-4">⟳</span>
            <p className="text-text-muted">Processing your profile...</p>
          </div>
        ) : (
          <>
            <svg className="w-12 h-12 text-text-dim mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-text font-medium mb-1">Upload your LinkedIn PDF</p>
            <p className="text-text-muted text-sm">Drag & drop or click to browse</p>
          </>
        )}
      </Card>

      {uploadError && (
        <div className="bg-status-red-dim border border-status-red/20 rounded-md p-3">
          <p className="text-sm text-status-red">{uploadError}</p>
        </div>
      )}
    </div>
  )
}
