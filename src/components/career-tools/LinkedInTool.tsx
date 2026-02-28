'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { LastUseWarningModal } from '@/components/paywall/LastUseWarningModal'
import { usePostActionModal } from '@/components/paywall/PostActionModalProvider'
import { UpgradeLink, useUpgradeModal } from '@/components/modals/UpgradeModal'
import { getDictionary } from '@/lib/dictionary/dictionaryQueries'
import type { DictProfessionalSummary, DictRankEquivalent, DictLinkedinKeyword, DictMilitaryJargon } from '@/lib/dictionary/types'
import { getRankTier, formatClearanceForHeadline, buildLinkedInValues, fillLinkedInTemplate, ensureProperTitle, titleCaseHeadline, smartSkillSort } from './linkedInUtils'
import type { DictAtsKeyword } from '@/lib/dictionary/types'

interface LinkedInToolProps {
  userProfile: any
  experiences: any[]
  skills: string[]
  certifications?: any[]
  education?: any[]
  hasPaidAccess: boolean
  userTier?: 'free' | 'core' | 'full' | 'expired'
  currentUsage?: number
  usageLimit?: number
  onBack: () => void
}

// Credential formatting — ensure correct casing in headlines and about sections
const CREDENTIAL_CASE_MAP: Record<string, string> = {
  'pmp': 'PMP\u00AE', 'cissp': 'CISSP', 'cism': 'CISM', 'ceh': 'CEH',
  'cysa+': 'CySA+', 'pentest+': 'PenTest+', 'security+': 'Sec+', 'sec+': 'Sec+',
  'network+': 'Net+', 'net+': 'Net+', 'a+': 'A+', 'casp+': 'CASP+',
  'ccsp': 'CCSP', 'cisa': 'CISA', 'itil': 'ITIL\u00AE',
  'aws': 'AWS', 'azure': 'Azure',
  'mba': 'MBA', 'ms': 'M.S.', 'bs': 'B.S.', 'ba': 'B.A.',
  'capm': 'CAPM', 'comptia': 'CompTIA', 'dod': 'DoD',
  'ts/sci': 'TS/SCI', 'secret': 'Secret', 'top secret': 'Top Secret',
}
function formatCredential(cert: string): string {
  if (!cert) return ''
  const lower = cert.toLowerCase().trim()
  return CREDENTIAL_CASE_MAP[lower] || cert
}

export function LinkedInTool({ userProfile, experiences, skills, certifications, education, hasPaidAccess, userTier = 'free', currentUsage = 0, usageLimit = 999, onBack }: LinkedInToolProps) {
  const remaining = usageLimit - currentUsage
  const { openUpgradeModal } = useUpgradeModal()

  // Mode toggle
  const [mode, setMode] = useState<'generate' | 'keywords' | 'analyze'>('generate')

  // Inline headline editing
  const [editingHeadlineIdx, setEditingHeadlineIdx] = useState<number | null>(null)
  const [editedHeadlineText, setEditedHeadlineText] = useState('')
  // Selected headline index
  const [selectedHeadlineIdx, setSelectedHeadlineIdx] = useState<number>(0)

  // Keywords mode state
  const [keywordPasteText, setKeywordPasteText] = useState('')
  const [keywordResults, setKeywordResults] = useState<{
    found: string[]
    missing: string[]
    jargonDetected: string[]
    score: number
    total: number
  } | null>(null)
  const [linkedinKeywords, setLinkedinKeywords] = useState<DictLinkedinKeyword[]>([])
  const [jargonTerms, setJargonTerms] = useState<DictMilitaryJargon[]>([])

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

  // Refine drawer
  const [refineOpen, setRefineOpen] = useState(false)
  const refineSnapshotRef = useRef('')

  // Analyze mode state
  const [linkedInPDF, setLinkedInPDF] = useState<any>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showLastUseWarning, setShowLastUseWarning] = useState(false)
  const { triggerPostActionModal } = usePostActionModal()

  // Summary editing
  const [summaryFocused, setSummaryFocused] = useState(false)
  const summaryRef = useRef<HTMLTextAreaElement>(null)

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
      setLinkedinKeywords(dict.linkedinKeywords ?? [])
      setJargonTerms(dict.militaryJargon ?? [])
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
  const [aboutTemplateIndex, setAboutTemplateIndex] = useState(0)
  const emphasisKey = emphasis.join(',')
  const selectedSkillsKey = selectedSkills.join(',')
  useEffect(() => {
    if (hasGenerated && !dictLoading) {
      handleDictGenerate()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tone, aboutLength, emphasisKey, leadWith, selectedSkillsKey])
  // Reset template variant when tone or length changes
  useEffect(() => { setAboutTemplateIndex(0) }, [tone, aboutLength])

  // Auto-generate on mount when dictionary loads and we have data + target role
  const autoGenRef = useRef(false)
  useEffect(() => {
    if (!dictLoading && !autoGenRef.current && !hasGenerated) {
      const role = targetRole || userProfile?.target_role || userProfile?.desired_position || ''
      if (role && (userProfile || experiences?.length > 0)) {
        if (!targetRole && role) setTargetRole(role)
        autoGenRef.current = true
        // Small delay to let targetRole state propagate
        setTimeout(() => handleDictGenerate(), 50)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dictLoading])

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

  const handleDictGenerate = (overrideTemplateIndex?: number) => {
    const role = targetRole || userProfile?.target_role || userProfile?.desired_position || ''
    if (!role) {
      setError('Please enter your target role')
      return
    }
    if (!targetRole && role) setTargetRole(role)
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

    const values = buildLinkedInValues(userProfile, orderedSkills, certs.map((c: string) => ({ name: c })), education || [], civTitle, role)
    const clearance = values['clearance'] || ''
    const industry = userProfile?.target_industry || role
    const years = userProfile?.years_of_service || '10+'

    // --- Credential ranking: use FULL cert stack ---
    const HIGH_VALUE = ['PMP', 'CISSP', 'CISM', 'CCSP', 'CISA']
    const CLOUD = ['AWS', 'AZURE', 'GCP']
    const COMPTIA = ['CYSA+', 'PENTEST+', 'SECURITY+', 'SEC+', 'NETWORK+', 'NET+', 'A+', 'CASP+']
    const rankCert = (cert: string): number => {
      const upper = cert.toUpperCase().replace(/[®™]/g, '')
      if (HIGH_VALUE.some(h => upper.includes(h))) return 100
      if (CLOUD.some(c => upper.includes(c))) return 90
      if (COMPTIA.some(c => upper.includes(c))) return 80
      return 50
    }
    const rankedCerts = [...certs].sort((a, b) => rankCert(b) - rankCert(a))
    const cert1 = formatCredential(rankedCerts[0] || '')
    const cert2 = formatCredential(rankedCerts[1] || '')
    const cert3 = formatCredential(rankedCerts[2] || '')

    // Short degree label for headlines (MBA, M.S., B.S., etc.)
    const degreeShort = formatCredential((() => {
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
    })())

    // Short branch name for about section
    const branchShort = (() => {
      const b = (userProfile?.branch || '').toLowerCase()
      if (b.includes('navy')) return 'Navy'
      if (b.includes('army')) return 'Army'
      if (b.includes('air') || b === 'air_force') return 'Air Force'
      if (b.includes('marine')) return 'Marine Corps'
      if (b.includes('coast')) return 'Coast Guard'
      if (b.includes('space')) return 'Space Force'
      return userProfile?.branch || 'military'
    })()

    // Top skills
    const skill1 = orderedSkills[0] || 'Operations'
    const skill2 = orderedSkills[1] || ''
    const skill3 = orderedSkills[2] || ''

    // Best achievement from experience bullets (prefer metric-heavy)
    const allBullets = (experiences || []).flatMap((exp: any) => {
      const bullets = exp.experience_bullets ?? exp.bullets ?? exp.achievements ?? []
      return (Array.isArray(bullets) ? bullets : []).map((b: any) =>
        typeof b === 'string' ? b : b?.translated_text || b?.original_text || ''
      ).filter((b: string) => b.trim().length > 15)
    })
    const metricPattern = /\d{2,}%|\$[\d,.]+[KkMmBb]?|\b\d{2,}\b/
    const metricBullet = allBullets.find((b: string) => metricPattern.test(b))
    const bestAchievement = metricBullet || allBullets[0] || ''
    const shortAchievement = bestAchievement
      ? (bestAchievement.length > 80
          ? bestAchievement.substring(0, bestAchievement.lastIndexOf(' ', 75)) + '...'
          : bestAchievement)
      : 'delivering measurable results across complex operations'
    const topBullets = allBullets.slice(0, 3)

    // Team size from rank
    const teamSize = values['team_size'] || ''

    // --- HEADLINE GENERATION ---
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
      addUnique(build([`${years}-Year ${branchShort} Veteran`, civTitle, cert1, clearance], tone))
    } else if (leadWith === 'clearance' && clearance) {
      addUnique(build([`${clearance} Cleared`, civTitle, industry, cert1], tone))
    } else if (leadWith === 'certification' && cert1) {
      addUnique(build([`${cert1} Certified ${civTitle}`, industry, cert2 || skill1, clearance], tone))
    } else if (leadWith === 'role') {
      addUnique(build([civTitle, industry, `${years}+ Years`, cert1, clearance], tone))
    } else if (leadWith === 'skill') {
      addUnique(build([`${skill1} Expert`, civTitle, industry, cert1], tone))
    }

    // --- Professional tone (3+ headlines, rotating credentials) ---
    // P1: Years Veteran | Role | Cert1 | Clearance
    addUnique(build([`${years}-Year ${branchShort} Veteran`, civTitle, cert1, clearance], 'professional'))
    // P2: Role | Cert2 | Degree | Years+ Years
    addUnique(build([civTitle, cert2 || cert1, degreeShort, `${years}+ Years ${industry} Experience`], 'professional'))
    // P3: Role | Cert1 + Cert2 combined | Clearance
    if (cert2) {
      addUnique(build([civTitle, `${cert1} | ${cert2}`, clearance || `${years}+ Years Experience`], 'professional'))
    }
    // P4: Role | Degree | Cert3 or Cert1 | Clearance
    if (degreeShort) addUnique(build([civTitle, degreeShort, cert3 || cert1, clearance], 'professional'))
    // P5: Skill-forward with different cert
    addUnique(build([civTitle, skill1, cert3 || cert2 || cert1, `${years}+ Years`], 'professional'))

    // --- Conversational tone (3+ headlines, rotating credentials) ---
    // C1: From Branch to Industry — Role | Cert1 | Clearance
    addUnique(buildFree(
      [`From ${branchShort} to ${industry} — ${civTitle}`, cert1, clearance].filter(Boolean).join(' | '),
      'conversational',
    ))
    // C2: Role helping Industry | Cert2 | Degree
    addUnique(buildFree(
      [`${civTitle} helping ${industry} organizations with ${skill1}${skill2 ? ` and ${skill2}` : ''}`, cert2 || cert1, degreeShort].filter(Boolean).join(' | '),
      'conversational',
    ))
    // C3: Passionate about Skills | Role | Years | Cert3
    addUnique(buildFree(
      [`Passionate about ${skill1}${skill2 ? ` and ${skill2}` : ''}`, civTitle, `${years}+ years in ${industry}`, cert3 || cert1].filter(Boolean).join(' | '),
      'conversational',
    ))

    // --- Bold & Direct tone (3+ headlines, rotating credentials) ---
    // B1: Role → Years driving results | Cert1 | Clearance
    addUnique(buildFree(
      [`${civTitle} → ${years}+ Years Driving ${skill1} Results`, cert1, clearance ? `${clearance.replace(' Clearance', '')} Cleared` : ''].filter(Boolean).join(' | '),
      'bold',
    ))
    // B2: Mission-Driven Role | Cert1 + Cert2 | Industry
    if (cert2) {
      addUnique(build([`Mission-Driven ${civTitle}`, `${cert1} + ${cert2}`, `${years}+ Years ${industry}`], 'bold'))
    } else {
      addUnique(build([`Mission-Driven ${civTitle}`, cert1, `${years}+ Years ${industry}`, clearance], 'bold'))
    }
    // B3: Industry Role | Cert3 | Proven Leader | Clearance
    addUnique(build([
      `${industry} ${civTitle}`.replace(new RegExp(`${industry}\\s+${industry}`, 'i'), industry),
      cert3 || cert2 || cert1,
      'Proven Leader',
      clearance ? `${clearance.replace(' Clearance', '')} Cleared` : '',
    ], 'bold'))

    // --- ABOUT SECTION: tone x length x templateIndex (3 visibly distinct variants per tone) ---
    const templateIndex = (overrideTemplateIndex ?? aboutTemplateIndex) % 3
    const clearanceStmt = clearance ? `Holds active ${clearance}.` : ''
    const certStmt = cert1 ? `${cert1} certified.` : ''
    const credLine = [degreeShort, cert1].filter(Boolean).join(' | ')
    const credSuffix = [clearanceStmt, credLine ? `${credLine}.` : ''].filter(Boolean).join(' ')
    const allCredSuffix = [clearanceStmt, certStmt, degreeShort ? `${degreeShort}.` : ''].filter(Boolean).join(' ')
    const skillList = [skill1, skill2, skill3].filter(Boolean)
    const skillPhrase = skillList.length >= 3
      ? `${skillList[0]}, ${skillList[1]}, and ${skillList[2]}`
      : skillList.length === 2
        ? `${skillList[0]} and ${skillList[1]}`
        : skillList[0] || 'operations management'

    let summary = ''

    if (tone === 'professional') {
      // 3 openings: 0=transition story, 1=achievement lead, 2=role + value prop
      const openings = [
        `${years}-year ${branchShort} veteran transitioning to ${role} in ${industry}.`,
        `Proven track record of ${shortAchievement} — now bringing ${years}+ years of ${branchShort} experience to ${industry}.`,
        `${role} with deep expertise in ${skillPhrase}, combining ${years}+ years of military leadership with ${[cert1, degreeShort].filter(Boolean).join(' and ') || 'proven results'}.`,
      ]
      const opening = openings[templateIndex]

      if (aboutLength === 'concise') {
        summary = `${opening} Skilled in ${skillPhrase}.`
        if (credSuffix) summary += ` ${credSuffix}`
      } else if (aboutLength === 'detailed') {
        summary = `${opening} Combines deep expertise in ${skillPhrase} with a proven record of delivering measurable outcomes in high-stakes environments. ${allCredSuffix}`
        if (topBullets.length > 0) {
          summary += `\n\nKey Achievements:\n${topBullets.map((b: string) => `• ${b.trim()}`).join('\n')}`
        }
        const competencies = orderedSkills.filter(s => s && s.trim()).slice(0, 8).map(s => s.trim())
        if (competencies.length > 0) {
          summary += `\n\nCore Competencies:\n${competencies.join(' • ')}`
        }
        summary += `\n\nCurrently seeking ${role} opportunities where I can leverage ${years}+ years of operational experience to drive ${industry} outcomes.`
      } else {
        summary = `${opening} Skilled in ${skillPhrase} with a proven record of ${shortAchievement}. ${credSuffix}`
        summary += `\n\nCurrently seeking ${role} opportunities where I can leverage ${years}+ years of operational experience to drive results in ${industry}.`
      }
    } else if (tone === 'conversational') {
      // 3 openings: 0=transition story, 1=achievement lead, 2=value prop
      const openings = [
        `After ${years} years in the ${branchShort}, I've learned that mission success comes down to ${skill1.toLowerCase()}${skill2 ? ` and ${skill2.toLowerCase()}` : ''}.`,
        `What drives me? Results like: ${shortAchievement}. That's what ${years} years in the ${branchShort} taught me.`,
        `I help ${industry} organizations tackle ${skill1.toLowerCase()}${skill2 ? ` and ${skill2.toLowerCase()}` : ''} challenges — backed by ${years}+ years of ${branchShort} leadership.`,
      ]
      const opening = openings[templateIndex]

      if (aboutLength === 'concise') {
        summary = `${opening} Now I'm bringing that experience to ${industry} as a ${role.toLowerCase()}.${clearanceStmt ? ` ${clearanceStmt}` : ''}`
      } else if (aboutLength === 'detailed') {
        summary = `${opening} Now I'm bringing that experience to ${industry} as a ${role.toLowerCase()}.`
        // Avoid repeating achievement when opening already mentions it
        if (templateIndex === 1) {
          summary += `\n\nMy background spans ${skillPhrase.toLowerCase()}, from team leadership to strategic execution. ${[clearanceStmt, certStmt].filter(Boolean).join(' ')}`
        } else {
          summary += `\n\nMy background includes ${skillPhrase.toLowerCase()}, with results like: ${shortAchievement}. ${[clearanceStmt, certStmt].filter(Boolean).join(' ')}`
        }
        if (topBullets.length > 0) {
          summary += `\n\nA few things I'm proud of:\n${topBullets.map((b: string) => `• ${b.trim()}`).join('\n')}`
        }
        summary += `\n\nIf you're looking for someone who can turn complex challenges into real outcomes, let's connect.`
      } else {
        summary = `${opening} Now I'm bringing that experience to ${industry} as a ${role.toLowerCase()}.`
        summary += `\n\nMy background includes ${skillPhrase.toLowerCase()}. ${[clearanceStmt, certStmt].filter(Boolean).join(' ')} If you're looking for someone who delivers results, let's connect.`
      }
    } else {
      // Bold & Direct — 3 openings: 0=years + teams, 1=achievement lead, 2=role + industry
      const openings = [
        `${years} years.${teamSize ? ` ${teamSize}-person teams.` : ''} Results delivered.`,
        `${shortAchievement}. That's the standard.`,
        `${role}. ${industry}. Mission-ready.`,
      ]
      const opening = openings[templateIndex]

      if (aboutLength === 'concise') {
        summary = `${opening}\n\n${branchShort} veteran. ${cert1 || role}.${clearance ? ` ${clearance.replace(' Clearance', '')} cleared.` : ''} Now targeting ${role} in ${industry}.`
      } else if (aboutLength === 'detailed') {
        summary = opening
        summary += `\n\n${branchShort} veteran. ${cert1 || role}.${cert2 ? ` ${cert2}.` : ''}${clearance ? ` ${clearance.replace(' Clearance', '')} cleared.` : ''}${degreeShort ? ` ${degreeShort}.` : ''}`
        summary += `\n\nNow targeting ${role} in ${industry}. I bring ${skillPhrase.toLowerCase()} — and the discipline to execute.`
        if (topBullets.length > 0) {
          summary += `\n\nTrack record:\n${topBullets.map((b: string) => `• ${b.trim()}`).join('\n')}`
        }
        const competencies = orderedSkills.filter(s => s && s.trim()).slice(0, 6).map(s => s.trim())
        if (competencies.length > 0) {
          summary += `\n\n${competencies.join(' • ')}`
        }
      } else {
        summary = opening
        summary += `\n\n${branchShort} veteran. ${cert1 || role}.${clearance ? ` ${clearance.replace(' Clearance', '')} cleared.` : ''}${degreeShort ? ` ${degreeShort}.` : ''}`
        summary += `\n\nNow targeting ${role} in ${industry}. I bring ${skillPhrase.toLowerCase()} — and the discipline to execute.`
      }
    }

    // --- Final cleanup ---
    summary = summary
      .replace(/\{\{\w+\}\}/g, '')
      .replace(/\[[^\]]*\]/g, '')
      .replace(/\s{2,}(?!\n)/g, ' ')
      .replace(/,\s*,/g, ',')
      .replace(/,\s*\./g, '.')
      .replace(/\.\s*\./g, '.')
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    setDictResults({ headlines: allHeadlines, summary })
    setEditedSummary(summary)
    // Track dictionary LinkedIn generation (only on first generate, not setting-change re-renders)
    if (!hasGenerated) {
      fetch('/api/track-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: 'linkedin_profile_analysis' }),
      }).catch(() => {})
    }
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

      if (res.status === 403) {
        setError(data.details?.reason || data.error || 'Usage limit reached')
        openUpgradeModal()
        return
      }

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

  // Keyword analysis
  const analyzeKeywords = useCallback(() => {
    if (!keywordPasteText.trim()) return
    const textLower = keywordPasteText.toLowerCase()
    const targetIndustry = (userProfile?.target_industry || '').toLowerCase()

    // Collect recommended keywords from LinkedIn + ATS dictionaries for user's industry
    const allRecommended = new Set<string>()
    linkedinKeywords
      .filter(lk => !targetIndustry || lk.industry.toLowerCase().includes(targetIndustry))
      .forEach(lk => { lk.linkedin_keywords.forEach(kw => allRecommended.add(kw.toLowerCase())) })
    atsKeywords
      .filter(ak => !targetIndustry || ak.industry.toLowerCase().includes(targetIndustry))
      .forEach(ak => { ak.keywords.forEach(kw => allRecommended.add(kw.toLowerCase())) })

    const found: string[] = []
    const missing: string[] = []
    for (const kw of allRecommended) {
      if (textLower.includes(kw)) { found.push(kw) } else { missing.push(kw) }
    }

    // Detect military jargon
    const jargonDetected: string[] = []
    for (const j of jargonTerms) {
      const term = (j.military_term || '').toLowerCase()
      if (term.length >= 3 && textLower.includes(term)) {
        jargonDetected.push(`${j.military_term} → ${j.civilian_equivalent}`)
      }
    }

    setKeywordResults({
      found: found.slice(0, 20),
      missing: missing.slice(0, 15),
      jargonDetected: jargonDetected.slice(0, 10),
      score: found.length,
      total: allRecommended.size,
    })
  }, [keywordPasteText, linkedinKeywords, atsKeywords, jargonTerms, userProfile?.target_industry])

  // --- Filtered headlines by current tone ---
  const toneHeadlines = dictResults?.headlines?.filter(h => h.tone === tone) || []
  const otherHeadlines = dictResults?.headlines?.filter(h => h.tone !== tone) || []
  // Show top 4 headlines total (tone-matched first, then others)
  const displayHeadlines = [...toneHeadlines, ...otherHeadlines].slice(0, 4)

  // Compute the selected headline (from filtered list)
  const selectedHeadline = displayHeadlines[selectedHeadlineIdx] || displayHeadlines[0]

  // Character count for summary
  const summaryCharCount = (results?.summary || editedSummary || '').length

  // Refine drawer open/close logic
  const handleOpenRefine = () => {
    refineSnapshotRef.current = JSON.stringify({ tone, aboutLength, emphasis, leadWith, selectedSkills })
    setRefineOpen(true)
  }
  const handleCloseRefine = () => {
    setRefineOpen(false)
    // Auto-regenerate if settings changed while drawer was open
    const current = JSON.stringify({ tone, aboutLength, emphasis, leadWith, selectedSkills })
    if (current !== refineSnapshotRef.current && hasGenerated) {
      // The useEffect dependencies already handle auto-regenerate
    }
  }

  // Profile snapshot data
  const profileYears = userProfile?.years_of_service || '--'
  const profileRank = userProfile?.rank || userProfile?.paygrade || '--'
  const profileBranch = (() => {
    const b = (userProfile?.branch || '').toLowerCase()
    if (b.includes('navy')) return 'Navy'
    if (b.includes('army')) return 'Army'
    if (b.includes('air') || b === 'air_force') return 'Air Force'
    if (b.includes('marine')) return 'Marine Corps'
    if (b.includes('coast')) return 'Coast Guard'
    if (b.includes('space')) return 'Space Force'
    return userProfile?.branch || '--'
  })()
  const profileExpCount = experiences?.length || 0
  const profileEduCount = education?.length || 0
  const profileCertCount = certifications?.length || 0
  const profileSkillCount = skills?.length || 0

  // Loading skeleton
  const HeadlineSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="p-4 rounded-lg border border-border bg-bg-secondary">
          <div className="animate-pulse space-y-2">
            <div className="h-2 bg-text-dim/10 rounded w-[20%]" />
            <div className="h-3.5 bg-text-dim/10 rounded w-[85%]" />
          </div>
        </div>
      ))}
    </div>
  )

  const SummarySkeleton = () => (
    <div className="animate-pulse space-y-3 min-h-[200px] p-4 bg-bg-secondary rounded-lg border border-border">
      <div className="h-2 bg-text-dim/10 rounded w-full" />
      <div className="h-2 bg-text-dim/10 rounded w-[95%]" />
      <div className="h-2 bg-text-dim/10 rounded w-[88%]" />
      <div className="h-2 bg-text-dim/10 rounded w-full" />
      <div className="h-2 bg-text-dim/10 rounded w-[92%]" />
      <div className="h-2 bg-text-dim/10 rounded w-[78%]" />
      <div className="h-2 bg-text-dim/10 rounded w-full" />
      <div className="h-2 bg-text-dim/10 rounded w-[85%]" />
      <div className="h-2 bg-text-dim/10 rounded w-[70%]" />
    </div>
  )

  return (
    <div>
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xs text-text-dim">
          <button onClick={onBack} className="hover:text-text transition-colors">Cover Letter &amp; LinkedIn</button>
          <span className="text-gold">&rsaquo;</span>
          <span className="text-text-muted">LinkedIn Optimizer</span>
        </div>
        {hasPaidAccess && (
          <Badge variant={remaining <= 1 ? 'red' : remaining <= 2 ? 'amber' : 'default'}>
            {remaining} AI {remaining === 1 ? 'Use' : 'Uses'} Left
          </Badge>
        )}
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-1 mb-6 bg-bg-secondary rounded-lg p-1 w-fit">
        {([
          { id: 'generate', label: 'Generate' },
          { id: 'keywords', label: 'Keywords' },
          { id: 'analyze', label: 'Analyze Profile' },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id)}
            className={`px-4 py-2 text-sm rounded-md transition-all ${
              mode === tab.id
                ? 'bg-gold text-bg-primary font-medium'
                : 'text-text-muted hover:text-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mode === 'generate' ? (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ============ LEFT PANEL ============ */}
          <div className="lg:w-[340px] flex-shrink-0 space-y-4">
            {/* Target Role */}
            <Card className="p-5">
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-text-dim pb-2 border-b border-border flex items-center gap-2 mb-3">
                <span className="text-gold">&#9678;</span> Your Target
              </h3>
              <Input
                label="Target Role / Industry"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g., Operations Manager, Cybersecurity"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && targetRole.trim()) {
                    handleDictGenerate()
                  }
                }}
              />
            </Card>

            {/* Profile Snapshot */}
            <Card className="p-5">
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-text-dim pb-2 border-b border-border flex items-center gap-2 mb-3">
                <span className="text-gold">&#9670;</span> Profile Snapshot
              </h3>
              <div className="space-y-2 text-xs text-text-muted">
                <div className="flex justify-between">
                  <span className="text-text-dim">Rank</span>
                  <span className="text-text">{profileRank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-dim">Branch</span>
                  <span className="text-text">{profileBranch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-dim">Years</span>
                  <span className="text-text">{profileYears}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-dim">Experience</span>
                  <span className="text-text">{profileExpCount} position{profileExpCount !== 1 ? 's' : ''}</span>
                </div>
                {profileEduCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-text-dim">Education</span>
                    <span className="text-text">
                      {education?.map((e: any) =>
                        e.degree_type === 'master' ? "Master's" :
                        e.degree_type === 'bachelor' ? "Bachelor's" :
                        e.degree_type === 'associate' ? "Associate's" :
                        e.degree_type || 'Degree'
                      ).join(', ')}
                    </span>
                  </div>
                )}
                {profileCertCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-text-dim">Certs</span>
                    <span className="text-text">{certifications!.slice(0, 3).map((c: any) => c.name || c).join(', ')}{profileCertCount > 3 ? '...' : ''}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-text-dim">Skills</span>
                  <span className="text-text">{profileSkillCount} skills</span>
                </div>
              </div>
            </Card>

            {error && (
              <div className="bg-status-red-dim border border-status-red/20 rounded-md p-3">
                <p className="text-sm text-status-red">{error}</p>
              </div>
            )}
          </div>

          {/* ============ RIGHT PANEL ============ */}
          <div className="flex-1 space-y-6 min-w-0">
            {/* HEADLINES */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="text-gold">&#9670;</span> Headlines
                </h3>
                <div className="flex items-center gap-2">
                  {selectedHeadline && (
                    <button
                      onClick={() => handleCopy(selectedHeadline.text, 'headline-selected')}
                      className="text-xs px-2 py-1 bg-gold/20 text-gold rounded hover:bg-gold/30 transition-colors"
                    >
                      {copied === 'headline-selected' ? 'Copied!' : 'Copy Selected'}
                    </button>
                  )}
                </div>
              </div>

              {results?.headline ? (
                <div className="space-y-3">
                  <div className="bg-bg-secondary rounded-lg p-4">
                    <p className="text-xs text-gold font-semibold mb-1">AI Enhanced</p>
                    <p className="text-lg font-medium">{results.headline}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(results.headline, 'headline-ai')}
                    className="text-xs text-text-muted hover:text-text"
                  >
                    {copied === 'headline-ai' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              ) : generating ? (
                <div className="h-16 flex items-center justify-center">
                  <div className="animate-pulse text-text-muted">Enhancing with AI...</div>
                </div>
              ) : dictLoading && !dictResults ? (
                <HeadlineSkeleton />
              ) : displayHeadlines.length > 0 ? (
                <div className="space-y-2">
                  {displayHeadlines.map((h, idx) => {
                    const globalIdx = dictResults!.headlines.indexOf(h)
                    const isSelected = idx === selectedHeadlineIdx
                    const isEditing = editingHeadlineIdx === globalIdx
                    const toneLabel = h.tone === 'professional' ? 'Professional' : h.tone === 'conversational' ? 'Conversational' : 'Bold'
                    return (
                      <div
                        key={`headline-${idx}`}
                        onClick={() => { if (!isEditing) setSelectedHeadlineIdx(idx) }}
                        className={`flex items-center gap-2 p-4 rounded-lg border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-gold/10 border-gold'
                            : 'bg-bg-secondary border-border hover:border-border-bright'
                        }`}
                      >
                        {isEditing ? (
                          <input
                            type="text"
                            autoComplete="off"
                            value={editedHeadlineText}
                            onChange={(e) => setEditedHeadlineText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const updated = { ...dictResults!, headlines: dictResults!.headlines.map((hl, i) => i === globalIdx ? { ...hl, text: editedHeadlineText } : hl) }
                                setDictResults(updated)
                                setEditingHeadlineIdx(null)
                              }
                              if (e.key === 'Escape') setEditingHeadlineIdx(null)
                            }}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 bg-bg-primary border border-gold rounded px-2 py-1 text-sm focus:ring-1 focus:ring-gold/25"
                          />
                        ) : (
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded ${
                                h.tone === tone ? 'bg-gold/20 text-gold' : 'bg-bg-tertiary text-text-dim'
                              }`}>
                                {toneLabel}
                              </span>
                              {isSelected && (
                                <span className="text-[10px] uppercase tracking-wider text-gold font-semibold">Selected</span>
                              )}
                            </div>
                            <p className={`text-sm font-medium ${isSelected ? 'text-text' : 'text-text-muted'}`}>{h.text}</p>
                          </div>
                        )}
                        <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                          {isEditing ? (
                            <button
                              onClick={() => {
                                const updated = { ...dictResults!, headlines: dictResults!.headlines.map((hl, i) => i === globalIdx ? { ...hl, text: editedHeadlineText } : hl) }
                                setDictResults(updated)
                                setEditingHeadlineIdx(null)
                              }}
                              className="px-2 py-1 text-xs bg-gold text-bg-primary rounded font-semibold"
                            >
                              Save
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => { setEditingHeadlineIdx(globalIdx); setEditedHeadlineText(h.text) }}
                                className="px-2 py-1 text-xs text-text-dim hover:text-text transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleCopy(h.text, `headline-card-${idx}`)}
                                className="px-2 py-1 text-xs bg-gold/20 text-gold rounded hover:bg-gold/30 transition-colors"
                              >
                                {copied === `headline-card-${idx}` ? 'Copied!' : 'Copy'}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <HeadlineSkeleton />
              )}

              <p className="text-xs text-text-dim mt-2">Max 220 characters for LinkedIn</p>

              {/* Enhance with AI / Upgrade nudge */}
              {dictResults?.headlines && !results?.headline && !generating && (
                hasPaidAccess ? (
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

            {/* SUMMARY */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="text-gold">&#9643;</span> About / Summary
                </h3>
                <div className="flex items-center gap-2">
                  {dictResults?.summary && !results?.summary && (
                    <button
                      onClick={() => {
                        const nextIdx = (aboutTemplateIndex + 1) % 3
                        setAboutTemplateIndex(nextIdx)
                        handleDictGenerate(nextIdx)
                      }}
                      className="text-xs text-text-muted hover:text-text"
                    >
                      Variant ({aboutTemplateIndex + 1}/3)
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
              ) : dictLoading && !dictResults ? (
                <SummarySkeleton />
              ) : dictResults?.summary ? (
                <textarea
                  ref={summaryRef}
                  name="linkedin-summary"
                  autoComplete="off"
                  value={editedSummary}
                  onChange={(e) => setEditedSummary(e.target.value)}
                  onFocus={() => setSummaryFocused(true)}
                  onBlur={() => setSummaryFocused(false)}
                  className={`w-full min-h-[200px] px-3 py-3 bg-bg-secondary border rounded-lg text-sm leading-relaxed focus:border-gold focus:ring-1 focus:ring-gold/25 transition-all resize-y ${
                    summaryFocused ? 'border-gold' : 'border-border'
                  }`}
                />
              ) : (
                <SummarySkeleton />
              )}

              {/* Character count */}
              {(results?.summary || editedSummary) && (
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-text-dim">Optimized for LinkedIn's 2,600 character limit</p>
                  <p className={`text-xs font-mono ${summaryCharCount > 2600 ? 'text-status-red' : summaryCharCount > 2400 ? 'text-status-amber' : 'text-text-dim'}`}>
                    {summaryCharCount.toLocaleString()} / 2,600
                  </p>
                </div>
              )}

              {/* Action buttons */}
              {(results?.summary || editedSummary) && !generating && (
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => handleCopy(results?.summary || editedSummary, 'summary-accept')}
                    className="flex-1 py-2 px-3 text-sm bg-gold text-bg-primary rounded-lg font-medium hover:bg-gold-bright transition-colors"
                  >
                    {copied === 'summary-accept' ? 'Copied!' : 'Copy Summary'}
                  </button>
                  {!results?.summary && (
                    <button
                      onClick={() => summaryRef.current?.focus()}
                      className="py-2 px-3 text-sm bg-bg-secondary border border-border rounded-lg text-text-muted hover:text-text hover:border-border-bright transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  {!results?.summary && dictResults?.summary && (
                    <button
                      onClick={() => {
                        const nextIdx = (aboutTemplateIndex + 1) % 3
                        setAboutTemplateIndex(nextIdx)
                        handleDictGenerate(nextIdx)
                      }}
                      className="py-2 px-3 text-sm bg-bg-secondary border border-border rounded-lg text-text-muted hover:text-text hover:border-border-bright transition-colors"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              )}

              {/* Enhance with AI */}
              {dictResults?.summary && !results?.summary && !generating && (
                hasPaidAccess ? (
                  <button
                    onClick={handleGenerate}
                    disabled={generating || remaining <= 0}
                    className="mt-3 w-full py-2 px-3 text-sm bg-bg-secondary border border-gold/30 rounded-lg text-gold hover:bg-gold/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {remaining <= 0 ? 'AI Limit Reached' : '✦ Enhance with AI'}
                  </button>
                ) : (
                  <p className="mt-3 text-xs text-text-dim">
                    <span className="text-gold">&#9670;</span> Want deeper insights?{' '}
                    <UpgradeLink className="text-gold hover:text-gold-bright hover:underline">Upgrade to Full</UpgradeLink>
                    {' '}for a complete profile audit with specific fixes.
                  </p>
                )
              )}
            </Card>

            {/* Copy All button */}
            {(dictResults || results) && !generating && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const headlineText = results?.headline || selectedHeadline?.text || ''
                    const summaryText = results?.summary || editedSummary || ''
                    const combined = `HEADLINE:\n${headlineText}\n\nABOUT:\n${summaryText}`
                    handleCopy(combined, 'copy-all')
                  }}
                  className="flex-1 py-2 px-3 text-sm bg-bg-secondary border border-border rounded-lg text-text-muted hover:text-text hover:border-border-bright transition-colors text-center"
                >
                  {copied === 'copy-all' ? 'Copied All!' : 'Copy Headline + Summary'}
                </button>
                <button
                  onClick={() => handleDictGenerate()}
                  className="py-2 px-3 text-sm bg-bg-secondary border border-border rounded-lg text-text-muted hover:text-text hover:border-border-bright transition-colors"
                >
                  Regenerate
                </button>
                <button
                  onClick={refineOpen ? handleCloseRefine : handleOpenRefine}
                  className={`py-2 px-3 text-sm border rounded-lg transition-colors ${
                    refineOpen
                      ? 'bg-gold/10 border-gold text-gold'
                      : 'bg-bg-secondary border-border text-text-muted hover:text-text hover:border-border-bright'
                  }`}
                  title="Refine settings"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            )}

            {/* Refine Settings Drawer */}
            {refineOpen && (
              <Card className="p-5 border-gold/30">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-gold">Refine Settings</h4>
                  <button onClick={handleCloseRefine} className="text-text-dim hover:text-text">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
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
                      autoComplete="off"
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
              </Card>
            )}
          </div>
        </div>
      ) : mode === 'keywords' ? (
        // === KEYWORDS MODE ===
        <div className="max-w-2xl space-y-4">
          <Card className="p-6">
            <h3 className="font-heading text-sm uppercase tracking-wider text-gold mb-3">Keyword Checker</h3>
            <p className="text-xs text-text-dim mb-4">
              Paste your LinkedIn About section or a job posting to check for industry keywords and military jargon.
            </p>

            <textarea
              autoComplete="off"
              value={keywordPasteText}
              onChange={(e) => setKeywordPasteText(e.target.value)}
              placeholder="Paste your LinkedIn summary, headline, or a job posting here..."
              className="w-full min-h-[120px] px-3 py-2 bg-bg-secondary border border-border rounded text-sm focus:border-gold focus:ring-1 focus:ring-gold/25 transition-all resize-none mb-3"
            />

            <Button onClick={analyzeKeywords} disabled={!keywordPasteText.trim() || dictLoading}>
              {dictLoading ? 'Loading Dictionary...' : 'Analyze Keywords'}
            </Button>

            {keywordResults && (
              <div className="mt-4 space-y-4">
                {/* Score */}
                <div className="p-3 bg-bg-secondary rounded-lg border border-border">
                  <p className="text-sm font-medium">
                    Your text has <span className="text-gold font-bold">{keywordResults.score}</span> of{' '}
                    <span className="font-bold">{keywordResults.total}</span> recommended keywords
                    {userProfile?.target_industry ? ` for ${userProfile.target_industry}` : ''}
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
        </div>
      ) : (
        // === ANALYZE UI ===
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
          hasPaidAccess={userTier === 'full'}
        />
      )}

      {showLastUseWarning && (
        <LastUseWarningModal
          featureName="LinkedIn Generation"
          tier={hasPaidAccess ? 'full' : 'free'}
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
  hasPaidAccess,
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
  hasPaidAccess: boolean
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
          hasPaidAccess: true,
        }),
      })
      const data = await response.json()
      if (response.status === 403) {
        openUpgradeModal()
        return
      }
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
            <span className="text-gold">&#9678;</span> Section Breakdown
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
        {!hasPaidAccess && <RecommendationsPaywall />}

        {/* Quick Wins - only for pro users */}
        {hasPaidAccess && analysis.quickWins && (
          <Card className="p-6">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="text-gold">&#9889;</span> Quick Wins
            </h3>
            <ul className="space-y-2">
              {analysis.quickWins.map((win: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm text-text-muted">
                  <span className="text-status-green">&#8226;</span>
                  {win}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Headline - only for pro users */}
        {hasPaidAccess && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="text-gold">&#9670;</span> Headline
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
        {hasPaidAccess && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="text-gold">&#9643;</span> About Section
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
        {hasPaidAccess && analysis.sections.experience && (
          <Card className="p-6">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-gold">&#9670;</span> Experience Analysis
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
                      <span className="text-gold">&#8226;</span>
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
        {hasPaidAccess && analysis.sections.skills && (
          <Card className="p-6">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-gold">&#9672;</span> Skills Analysis
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
        {hasPaidAccess && analysis.sections.certifications && (
          <Card className="p-6">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-gold">&#9678;</span> Certifications
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
                    <span className="text-gold">&#8226;</span>
                    {tip}
                  </p>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Education (if available) - only for pro users */}
        {hasPaidAccess && analysis.sections.education && (
          <Card className="p-6">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-gold">&#9643;</span> Education
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
                    <span className="text-gold">&#8226;</span>
                    {tip}
                  </p>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Keywords (if available) - only for pro users */}
        {hasPaidAccess && analysis.sections.keywords && (
          <Card className="p-6">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-gold">&#9671;</span> Keyword Analysis
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
        {hasPaidAccess && analysis.priorityActions && (
          <Card className="p-6">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-gold">&#9654;</span> Priority Actions
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
                Profile loaded &#8226; {linkedInPDF.skills?.length || 0} skills found
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

        {hasPaidAccess ? (
          <Button
            className="w-full"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <span className="animate-spin mr-2">&#10227;</span>
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
            <span className="animate-spin text-3xl mb-4">&#10227;</span>
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
