'use client'

import { useState, useCallback } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { getUserTier, isPaidTier } from '@/lib/tier-utils'
import { TEMPLATES, TemplateId } from '@/lib/templates'
import { ResumePreview } from '@/components/resume/ResumePreview'

interface JobMatchWorkspaceProps {
  userId: string
  userPlan: string
  resumes: any[]
  currentUsage: number
  usageLimit: number
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
  categoryScores: {
    skills: number
    experience: number
    keywords: number
    education: number
    certifications: number
    clearance: number | null
  }
  categoryDetails: {
    skills: {
      required: string[]
      matched: string[]
      missing: string[]
      toHighlight: string[]
      toAdd: string[]
      toRemove: string[]
    }
    education: {
      required: string
      candidateLevel: string
      meetsRequirement: boolean
      notes: string
    }
    certifications: {
      required: string[]
      matched: string[]
      missing: string[]
      notes: string
    }
    experience: {
      requiredYears: number
      candidateYears: number
      meetsRequirement: boolean
      notes: string
    }
    clearance: {
      required: string | null
      candidateLevel: string | null
      meetsRequirement: boolean
      notes: string
    } | null
  }
  bulletSuggestions: BulletSuggestion[]
  skillChanges: {
    add: string[]
    highlight: string[]
    remove: string[]
  }
  gaps: Gap[]
  strengths: string[]
  priorityActions: string[]
  assessment: string
}

export interface BulletSuggestion {
  experienceIndex: number
  bulletIndex: number
  original: string
  suggested: string | null
  keywordsAdded: string[]
  action: 'rewrite' | 'exclude' | 'keep'
  priority: 'high' | 'medium' | 'low'
}

export interface Gap {
  category: string
  severity: 'high' | 'medium' | 'low'
  description: string
}

export function JobMatchWorkspace({
  userId,
  userPlan,
  resumes,
  currentUsage,
  usageLimit,
}: JobMatchWorkspaceProps) {
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(resumes[0]?.id || null)
  const [jobData, setJobData] = useState({
    company: '',
    title: '',
    description: '',
  })
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')

  // Tailored resume state
  const [tailoredResume, setTailoredResume] = useState<TailoredResume | null>(null)
  const [originalScore, setOriginalScore] = useState<number | null>(null)
  const [changesSummary, setChangesSummary] = useState<string[]>([])

  // UI state
  const [resumePreviewOpen, setResumePreviewOpen] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('clean')

  const selectedResume = resumes.find(r => r.id === selectedResumeId)
  const remaining = usageLimit - currentUsage
  const isPro = isPaidTier(getUserTier({ tier: userPlan }))

  const handleAnalyze = async () => {
    if (!selectedResume || !jobData.description) {
      setError('Please select a resume and enter a job description')
      return
    }

    if (remaining <= 0 && !isPro) {
      setError('You have reached your free analysis limit. Upgrade to Pro for more.')
      return
    }

    setAnalyzing(true)
    setError('')
    setAnalysis(null)
    setTailoredResume(null)
    setOriginalScore(null)
    setChangesSummary([])

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
      }
    } catch (err) {
      setError('Analysis failed. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  // Apply a single bullet suggestion
  const applyBulletSuggestion = useCallback((suggestion: BulletSuggestion) => {
    if (!tailoredResume || !suggestion.suggested) return

    const key = `${suggestion.experienceIndex}-${suggestion.bulletIndex}`

    setTailoredResume(prev => {
      if (!prev) return prev

      const newContent = JSON.parse(JSON.stringify(prev.content))
      const exp = newContent.experiences?.[suggestion.experienceIndex]
      const bullet = exp?.bullets?.[suggestion.bulletIndex]

      if (bullet) {
        bullet.translated_text = suggestion.suggested
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
  }, [tailoredResume])

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

  // Apply all suggestions at once
  const applyAllSuggestions = useCallback(() => {
    if (!analysis || !tailoredResume) return

    let changes: string[] = []

    const newContent = JSON.parse(JSON.stringify(tailoredResume.content))
    const newApplied = new Set(tailoredResume.appliedBullets)
    const newExcluded = new Set(tailoredResume.excludedBullets)
    const newAddedSkills = [...tailoredResume.addedSkills]
    const newRemovedSkills = [...tailoredResume.removedSkills]

    analysis.bulletSuggestions?.forEach(suggestion => {
      const key = `${suggestion.experienceIndex}-${suggestion.bulletIndex}`

      if (suggestion.action === 'rewrite' && suggestion.suggested) {
        const exp = newContent.experiences?.[suggestion.experienceIndex]
        const bullet = exp?.bullets?.[suggestion.bulletIndex]

        if (bullet && !newApplied.has(key)) {
          bullet.translated_text = suggestion.suggested
          bullet.tailored = true
          newApplied.add(key)
          changes.push(`Rewrote: "${suggestion.original.substring(0, 40)}..."`)
        }
      } else if (suggestion.action === 'exclude' && !newExcluded.has(key)) {
        newExcluded.add(key)
        changes.push(`Excluded bullet`)
      }
    })

    analysis.skillChanges?.add?.forEach(skillName => {
      const exists = newContent.skills?.some((s: any) =>
        s.name.toLowerCase() === skillName.toLowerCase()
      )
      if (!exists && !newAddedSkills.includes(skillName)) {
        if (!newContent.skills) newContent.skills = []
        newContent.skills.push({ name: skillName, category: 'Added' })
        newAddedSkills.push(skillName)
        changes.push(`Added skill: ${skillName}`)
      }
    })

    analysis.skillChanges?.remove?.forEach(skillName => {
      const idx = newContent.skills?.findIndex((s: any) =>
        s.name.toLowerCase() === skillName.toLowerCase()
      )
      if (idx !== undefined && idx >= 0 && !newRemovedSkills.includes(skillName)) {
        newContent.skills.splice(idx, 1)
        newRemovedSkills.push(skillName)
        changes.push(`Removed skill: ${skillName}`)
      }
    })

    setTailoredResume({
      content: newContent,
      appliedBullets: newApplied,
      addedSkills: newAddedSkills,
      removedSkills: newRemovedSkills,
      excludedBullets: newExcluded,
    })

    setChangesSummary(prev => [...prev, ...changes])
    return changes.length
  }, [analysis, tailoredResume])

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

  // Calculate current match score after tailoring
  const calculateTailoredScore = useCallback((): number => {
    if (!analysis || !tailoredResume) return analysis?.overallScore || 0

    const bulletImprovements = tailoredResume.appliedBullets.size * 2
    const skillAdditions = tailoredResume.addedSkills.length * 3
    const skillRemovals = tailoredResume.removedSkills.length * 1

    const improvement = Math.min(bulletImprovements + skillAdditions + skillRemovals, 20)
    return Math.min(95, (analysis?.overallScore || 0) + improvement)
  }, [analysis, tailoredResume])

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

  // Score display helpers
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-status-green'
    if (score >= 60) return 'text-status-amber'
    return 'text-status-red'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-status-green'
    if (score >= 60) return 'bg-status-amber'
    return 'bg-status-red'
  }

  const getMatchLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match'
    if (score >= 60) return 'Good Match'
    return 'Needs Work'
  }

  const currentScore = calculateTailoredScore()
  const circumference = 283
  const offset = circumference - (currentScore / 100) * circumference

  return (
    <div className="h-full overflow-auto p-6 lg:p-8 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold uppercase tracking-wider flex items-center gap-3">
              <span className="text-gold">◈</span> Job Match Analysis
            </h1>
            <p className="text-text-muted text-sm mt-1">
              Analyze how well your resume matches a job posting and get tailored suggestions
            </p>
          </div>
          {!isPro && (
            <div className="text-right">
              <div className="text-xs text-text-muted">Free analyses remaining</div>
              <div className="font-mono text-lg font-bold text-gold">{remaining} / {usageLimit}</div>
            </div>
          )}
        </div>

        {/* Usage Warning Banner */}
        {!isPro && remaining <= 2 && remaining > 0 && (
          <div className="flex items-center gap-3 p-4 bg-status-amber/10 border-l-4 border-status-amber rounded-r-lg">
            <svg className="w-5 h-5 text-status-amber flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div className="flex-1">
              <div className="font-heading text-sm font-semibold text-status-amber">
                {remaining} Free {remaining === 1 ? 'Analysis' : 'Analyses'} Remaining
              </div>
              <div className="text-xs text-text-muted">
                Upgrade for unlimited analyses and AI-powered resume rewrites.
              </div>
            </div>
            <a href="/pricing" className="text-status-amber text-sm font-semibold hover:underline whitespace-nowrap">
              Upgrade →
            </a>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════════
            SECTION 1: JOB POSTING INPUT
            ═══════════════════════════════════════════════════════════════════════════ */}
        <Card className="p-6">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
            <span className="text-gold">◈</span> Job Posting Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <Input
              label="Company Name"
              value={jobData.company}
              onChange={(e) => setJobData({ ...jobData, company: e.target.value })}
              placeholder="e.g., Acme Corporation"
            />

            {/* Job Title */}
            <Input
              label="Job Title"
              value={jobData.title}
              onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
              placeholder="e.g., Operations Manager"
            />
          </div>

          {/* Job Description */}
          <div className="mt-6">
            <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              Job Description
            </label>
            <textarea
              value={jobData.description}
              onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
              placeholder="Paste the full job description here including requirements, qualifications, and responsibilities..."
              className="w-full h-48 bg-bg-secondary border border-border rounded-md px-4 py-3 text-text placeholder:text-text-dim resize-none focus:border-gold focus:ring-1 focus:ring-gold/25 transition-colors"
            />
            <p className="text-xs text-text-dim mt-2">
              Include the full job posting for best results. The more detail, the better the analysis.
            </p>
          </div>

          {/* Resume Selector */}
          <div className="mt-6">
            <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              Select Resume to Analyze
            </label>
            {resumes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {resumes.map((resume) => (
                  <button
                    key={resume.id}
                    onClick={() => setSelectedResumeId(resume.id)}
                    className={`p-4 rounded-lg text-left transition-all border ${
                      selectedResumeId === resume.id
                        ? 'bg-gold-dim border-gold/30 ring-1 ring-gold/20'
                        : 'bg-bg-tertiary hover:bg-bg-hover border-transparent hover:border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedResumeId === resume.id ? 'bg-gold/20' : 'bg-bg-secondary'
                      }`}>
                        <span className={selectedResumeId === resume.id ? 'text-gold' : 'text-text-muted'}>◫</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-heading text-sm font-semibold truncate">{resume.name}</div>
                        {selectedResumeId === resume.id && (
                          <div className="text-xs text-gold">Selected</div>
                        )}
                      </div>
                      {selectedResumeId === resume.id && (
                        <svg className="w-5 h-5 text-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center bg-bg-tertiary">
                <div className="text-3xl mb-3 text-text-dim">◫</div>
                <p className="text-text-muted mb-3">No resumes found. Create one first.</p>
                <Button size="sm" onClick={() => window.location.href = '/resumes'}>
                  Create Resume
                </Button>
              </Card>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-6 bg-status-red-dim border border-status-red/20 rounded-md p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-status-red flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-status-red">{error}</p>
              </div>
            </div>
          )}

          {/* Analyze Button */}
          <div className="mt-6 flex justify-center">
            <Button
              size="lg"
              onClick={handleAnalyze}
              disabled={analyzing || !selectedResumeId || !jobData.description}
              className="px-12 py-4 text-base font-bold"
            >
              {analyzing ? (
                <>
                  <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="mr-2">◈</span>
                  Analyze Match
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* ═══════════════════════════════════════════════════════════════════════════
            LOADING STATE
            ═══════════════════════════════════════════════════════════════════════════ */}
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

        {/* ═══════════════════════════════════════════════════════════════════════════
            SECTION 2: ANALYSIS RESULTS
            ═══════════════════════════════════════════════════════════════════════════ */}
        {analysis && !analyzing && (
          <div className="space-y-6">
            {/* Match Score Card */}
            <Card className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Score Circle */}
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-border"
                      />
                      <circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className={getScoreColor(currentScore)}
                        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`font-mono text-4xl font-bold ${getScoreColor(currentScore)}`}>
                        {currentScore}%
                      </span>
                    </div>
                  </div>
                  <div className={`text-sm font-semibold mt-2 ${getScoreColor(currentScore)}`}>
                    {getMatchLabel(currentScore)}
                  </div>
                  {changesSummary.length > 0 && originalScore && currentScore > originalScore && (
                    <div className="text-xs text-status-green mt-1">
                      +{currentScore - originalScore}% from tailoring
                    </div>
                  )}
                </div>

                {/* Category Breakdown */}
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
              </div>
            </Card>

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
                      {analysis.priorityActions.map((action, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-gold/10 border border-gold/20 rounded-lg"
                        >
                          <span className="font-mono text-gold font-bold text-sm">{idx + 1}</span>
                          <span className="text-sm">{action}</span>
                        </div>
                      ))}
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

            {/* Pro Features - Bullet Rewrites */}
            {isPro && analysis.bulletSuggestions?.filter(s => s.action === 'rewrite').length > 0 && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <span className="text-gold">◆</span> AI-Powered Rewrites
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted">
                      {analysis.bulletSuggestions.filter(s => s.action === 'rewrite').length} suggestions available
                    </span>
                    <Button size="sm" onClick={applyAllSuggestions}>
                      Apply All
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
                          <div className="text-sm text-text mb-3">
                            → {suggestion.suggested}
                          </div>
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

            {/* Upgrade Prompt for Free Users */}
            {!isPro && (
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
                      Your resume is {analysis.overallScore}% matched. With Pro, get AI-generated bullet point rewrites
                      that can push your match score to 90%+.
                    </p>
                  </div>
                  <Button onClick={() => window.location.href = '/pricing'}>
                    View Plans
                  </Button>
                </div>
              </Card>
            )}

            {/* Resume Preview (Collapsible) */}
            <Card className="overflow-hidden">
              <button
                onClick={() => setResumePreviewOpen(!resumePreviewOpen)}
                className="w-full p-6 flex items-center justify-between hover:bg-bg-tertiary/50 transition-colors"
              >
                <h2 className="font-heading text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="text-gold">◫</span> Resume Preview
                  {changesSummary.length > 0 && (
                    <span className="text-xs font-normal text-gold bg-gold/10 px-2 py-0.5 rounded ml-2">
                      {changesSummary.length} changes
                    </span>
                  )}
                </h2>
                <svg
                  className={`w-5 h-5 text-text-muted transition-transform ${resumePreviewOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {resumePreviewOpen && tailoredResume && (
                <div className="border-t border-border">
                  <div className="p-6 bg-bg-tertiary/30">
                    {/* Template Selector */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <label className="text-xs text-text-muted uppercase tracking-wider font-semibold">Template:</label>
                        <select
                          value={selectedTemplate}
                          onChange={(e) => setSelectedTemplate(e.target.value as TemplateId)}
                          className="bg-bg-secondary border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-gold"
                        >
                          {Object.values(TEMPLATES).map((t) => {
                            const isLocked = !t.free && !isPro
                            return (
                              <option key={t.id} value={t.id} disabled={isLocked}>
                                {t.name} {isLocked ? '(PRO)' : ''}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                      <div className="flex items-center gap-3">
                        {changesSummary.length > 0 && (
                          <Button variant="ghost" size="sm" onClick={resetChanges}>
                            Reset Changes
                          </Button>
                        )}
                        <Button
                          onClick={handleDownload}
                          disabled={downloading}
                        >
                          {downloading ? 'Downloading...' : 'Download PDF'}
                        </Button>
                      </div>
                    </div>

                    {/* Resume Preview */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ maxHeight: '600px', overflow: 'auto' }}>
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
                      />
                    </div>
                  </div>
                </div>
              )}
            </Card>

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
          </div>
        )}

        {/* Empty State - Before Analysis */}
        {!analysis && !analyzing && (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4 text-text-dim">◎</div>
            <h3 className="font-heading text-lg font-bold uppercase tracking-wider mb-2">
              Ready to Analyze
            </h3>
            <p className="text-text-muted max-w-md mx-auto">
              Enter a job posting above and select a resume to see how well you match.
              Get detailed insights on skills, experience, and actionable recommendations.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
