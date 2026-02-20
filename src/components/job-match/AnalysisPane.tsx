'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { TailoredResume, AnalysisResult, BulletSuggestion } from './JobMatchWorkspace'
import { TEMPLATES, SELECTABLE_TEMPLATES, TemplateId, resolveTemplate } from '@/lib/templates'
import { ResumePreview } from '@/components/resume/ResumePreview'
import { getUserTier, isPaidTier } from '@/lib/tier-utils'
import { useUpgradeModal } from '@/components/modals/UpgradeModal'

interface AnalysisPaneProps {
  analysis: AnalysisResult | null
  analyzing: boolean
  userPlan: string
  tailoredResume: TailoredResume | null
  originalScore: number | null
  currentScore: number
  changesSummary: string[]
  onApplyAll: () => number | undefined
  onApplyBullet: (suggestion: BulletSuggestion) => void
  onReset: () => void
  jobData: { company: string; title: string; description: string }
}

export function AnalysisPane({
  analysis,
  analyzing,
  userPlan,
  tailoredResume,
  originalScore,
  currentScore,
  changesSummary,
  onApplyAll,
  onApplyBullet,
  onReset,
  jobData,
}: AnalysisPaneProps) {
  const isPro = isPaidTier(getUserTier({ tier: userPlan }))
  const { openUpgradeModal } = useUpgradeModal()
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'changes'>('overview')
  const [downloading, setDownloading] = useState(false)
  const [applySuccess, setApplySuccess] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('classic_professional')
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<TemplateId>('classic_professional')

  // Template list for navigation (excludes federal — it's only for federal resume type)
  const templateList = Object.values(SELECTABLE_TEMPLATES)

  // Keyboard navigation for preview modal
  useEffect(() => {
    if (!showPreviewModal) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowPreviewModal(false)
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = templateList.findIndex(t => t.id === previewTemplate)
        const prevIndex = currentIndex - 1 < 0 ? templateList.length - 1 : currentIndex - 1
        setPreviewTemplate(templateList[prevIndex].id as TemplateId)
      } else if (e.key === 'ArrowRight') {
        const currentIndex = templateList.findIndex(t => t.id === previewTemplate)
        const nextIndex = currentIndex + 1 >= templateList.length ? 0 : currentIndex + 1
        setPreviewTemplate(templateList[nextIndex].id as TemplateId)
      } else if (e.key === 'Enter') {
        setSelectedTemplate(previewTemplate)
        setShowPreviewModal(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showPreviewModal, previewTemplate, isPro, templateList])

  if (analyzing) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-5 py-3.5 border-b border-border bg-bg-tertiary">
          <span className="font-heading text-xs font-semibold uppercase tracking-wider">Match Analysis</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            {/* Animated loading indicator */}
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-2 border-gold/20 rounded-full" />
              <div className="absolute inset-0 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-2 flex items-center justify-center">
                <span className="text-2xl">◈</span>
              </div>
            </div>
            <p className="font-heading uppercase tracking-wider">Analyzing Match...</p>
            <p className="text-text-muted text-sm mt-2">Evaluating skills, experience, education, and more</p>
            <p className="text-text-dim text-xs mt-3">This typically takes 15-30 seconds</p>

            {/* Progress steps */}
            <div className="mt-6 space-y-2 text-xs text-left max-w-xs mx-auto">
              <div className="flex items-center gap-2 text-text-muted animate-pulse">
                <span className="text-gold">◆</span> Parsing job requirements...
              </div>
              <div className="flex items-center gap-2 text-text-dim">
                <span className="text-text-dim">◇</span> Matching skills & experience
              </div>
              <div className="flex items-center gap-2 text-text-dim">
                <span className="text-text-dim">◇</span> Generating suggestions
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-5 py-3.5 border-b border-border bg-bg-tertiary">
          <span className="font-heading text-xs font-semibold uppercase tracking-wider">Match Analysis</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-text-muted">Enter a job posting and click Analyze</p>
        </div>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-status-green'
    if (score >= 65) return 'text-status-amber'
    if (score >= 50) return 'text-gold'
    return 'text-status-red'
  }

  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-status-green'
    if (score >= 65) return 'bg-status-amber'
    if (score >= 50) return 'bg-gold'
    return 'bg-status-red'
  }

  const getMatchLabel = (score: number) => {
    // Use assessment level from analysis if available
    if (analysis?.assessmentLevel) return analysis.assessmentLevel
    if (score >= 80) return 'Strong Candidate'
    if (score >= 65) return 'Competitive'
    if (score >= 50) return 'Needs Development'
    return 'Consider Other Roles'
  }

  const getAssessmentBadgeColor = (level: string) => {
    switch (level) {
      case 'Strong Candidate': return 'bg-status-green/20 text-status-green border-status-green/30'
      case 'Competitive': return 'bg-status-amber/20 text-status-amber border-status-amber/30'
      case 'Needs Development': return 'bg-gold/20 text-gold border-gold/30'
      default: return 'bg-status-red/20 text-status-red border-status-red/30'
    }
  }

  // Get missing required items count for summary
  const missingRequiredCount = (analysis.categoryDetails?.skills?.missingRequired?.length || 0) +
    (analysis.categoryDetails?.certifications?.missingRequired?.length || 0) +
    (analysis.categoryDetails?.experience?.meetsRequirement === false ? 1 : 0) +
    (analysis.categoryDetails?.clearance?.required && !analysis.categoryDetails?.clearance?.meetsRequirement ? 1 : 0)

  const handleApplyAll = () => {
    const count = onApplyAll()
    if (count && count > 0) {
      setApplySuccess(true)
      setTimeout(() => setApplySuccess(false), 3000)
    }
  }

  const handleDownload = async () => {
    if (!tailoredResume) return

    setDownloading(true)
    try {
      console.log('Starting tailored resume download...')

      // Mark excluded bullets in the content
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

      console.log('Sending to export-tailored API...')

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

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Export API error:', errorText)
        let errorMessage = 'Export failed'
        try {
          const errorJson = JSON.parse(errorText)
          errorMessage = errorJson.error || errorMessage
        } catch {
          errorMessage = errorText || errorMessage
        }
        throw new Error(errorMessage)
      }

      // Get blob and trigger download
      const blob = await response.blob()
      console.log('Blob size:', blob.size, 'type:', blob.type)

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
      console.log('Download triggered successfully')
    } catch (error: any) {
      console.error('Download failed:', error)
      alert(`Download failed: ${error.message || 'Unknown error'}. Check browser console for details.`)
    } finally {
      setDownloading(false)
    }
  }

  // Calculate stroke offset for circular progress (circumference = 2 * PI * 45 ≈ 283)
  const circumference = 283
  const offset = circumference - (currentScore / 100) * circumference

  const hasChanges = changesSummary.length > 0
  const scoreImproved = currentScore > (originalScore || 0)

  // Categories for detailed breakdown
  const categories = [
    { key: 'skills', label: 'Skills', score: analysis.categoryScores?.skills || 0, weight: '30%' },
    { key: 'experience', label: 'Experience', score: analysis.categoryScores?.experience || 0, weight: '25%' },
    { key: 'keywords', label: 'Keywords', score: analysis.categoryScores?.keywords || 0, weight: '20%' },
    { key: 'education', label: 'Education', score: analysis.categoryScores?.education || 0, weight: '10%' },
    { key: 'certifications', label: 'Certifications', score: analysis.categoryScores?.certifications || 0, weight: '10%' },
  ]

  // Only show clearance category if it's required (not null)
  if (analysis.categoryScores?.clearance !== null && analysis.categoryScores?.clearance !== undefined) {
    categories.push({
      key: 'clearance',
      label: 'Clearance',
      score: analysis.categoryScores?.clearance || 0,
      weight: '5%'
    })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with Tabs */}
      <div className="px-5 py-3 border-b border-border bg-bg-tertiary flex items-center justify-between">
        <div className="flex gap-4">
          {['overview', 'details', 'changes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`font-heading text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === tab ? 'text-gold' : 'text-text-muted hover:text-text'
              }`}
            >
              {tab === 'changes' ? `Changes (${changesSummary.length})` : tab}
            </button>
          ))}
        </div>

        {/* Score Change Indicator */}
        {hasChanges && scoreImproved && (
          <div className="flex items-center gap-2 text-status-green text-xs font-semibold">
            <span>Match improved:</span>
            <span className="font-mono">{originalScore}%</span>
            <span>→</span>
            <span className="font-mono">{currentScore}%</span>
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Assessment Banner */}
            {analysis.assessmentLevel && (
              <div className={`p-3 rounded-lg border flex items-center justify-between ${getAssessmentBadgeColor(analysis.assessmentLevel)}`}>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{analysis.assessmentLevel}</span>
                  {missingRequiredCount > 0 && (
                    <span className="text-xs opacity-80">
                      • {missingRequiredCount} required item{missingRequiredCount !== 1 ? 's' : ''} missing
                    </span>
                  )}
                </div>
                {analysis.competitivePosition && (
                  <span className="text-xs opacity-80">{analysis.competitivePosition}</span>
                )}
              </div>
            )}

            <div className="flex gap-6">
            {/* Left: Score Circle + Categories */}
            <div className="w-52 flex-shrink-0">
              {/* Circular Score */}
              <div className="flex flex-col items-center mb-4">
                <div className="relative w-28 h-28">
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
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`font-mono text-3xl font-bold ${getScoreColor(currentScore)}`}>
                      {currentScore}%
                    </span>
                  </div>
                </div>
                <div className="text-sm text-text-muted mt-2">{getMatchLabel(currentScore)}</div>
                <div className="text-xs text-text-dim mt-1">Max possible: 92%</div>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat.key} className="flex items-center gap-2">
                    <span className="text-xs text-text-muted w-20 truncate">{cat.label}</span>
                    <div className="flex-1 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getBarColor(cat.score)} transition-all`}
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono w-10 text-right">{cat.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Priority Actions + Strengths + Gaps */}
            <div className="flex-1 space-y-4">
              {/* Priority Actions with Impact Estimates */}
              {analysis.priorityActions?.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-gold mb-2 uppercase tracking-wider">
                    Priority Actions
                  </div>
                  <div className="space-y-2">
                    {analysis.priorityActions.map((action, idx) => {
                      // Handle both string and object formats
                      const isObject = typeof action === 'object' && action !== null
                      const actionText = isObject ? (action as any).action : action
                      const impact = isObject ? (action as any).impact : null
                      const difficulty = isObject ? (action as any).difficulty : null
                      const timeframe = isObject ? (action as any).timeframe : null

                      return (
                        <div key={idx} className="p-3 bg-gold/10 rounded border border-gold/20">
                          <div className="flex items-start gap-2">
                            <span className="text-gold text-xs font-bold mt-0.5">{idx + 1}.</span>
                            <div className="flex-1">
                              <span className="text-sm">{actionText}</span>
                              {(impact || difficulty || timeframe) && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {impact && (
                                    <span className="text-[10px] px-2 py-0.5 bg-status-green/20 text-status-green rounded-full">
                                      Impact: {impact}
                                    </span>
                                  )}
                                  {difficulty && (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                      difficulty === 'Easy' ? 'bg-status-green/20 text-status-green' :
                                      difficulty === 'Medium' ? 'bg-status-amber/20 text-status-amber' :
                                      'bg-status-red/20 text-status-red'
                                    }`}>
                                      {difficulty}
                                    </span>
                                  )}
                                  {timeframe && (
                                    <span className="text-[10px] px-2 py-0.5 bg-bg-tertiary text-text-muted rounded-full">
                                      {timeframe}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Strengths */}
              {analysis.strengths?.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-status-green mb-2 uppercase tracking-wider">
                    Strengths
                  </div>
                  <div className="space-y-1">
                    {analysis.strengths.slice(0, 3).map((strength, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-status-green">✓</span>
                        <span className="text-text-muted">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gaps */}
              {analysis.gaps?.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-status-amber mb-2 uppercase tracking-wider">
                    Gaps to Address
                  </div>
                  <div className="space-y-1">
                    {analysis.gaps.slice(0, 3).map((gap, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <span className={`text-status-${gap.severity === 'high' ? 'red' : 'amber'}`}>
                          {gap.severity === 'high' ? '!' : '⚠'}
                        </span>
                        <span className="text-text-muted">{gap.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bullet Suggestions Preview */}
              {isPro && analysis.bulletSuggestions?.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Suggested Rewrites</span>
                    <span className="text-xs text-text-muted">
                      {analysis.bulletSuggestions.filter(s => s.action === 'rewrite').length} available
                    </span>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-auto">
                    {analysis.bulletSuggestions
                      .filter(s => s.action === 'rewrite')
                      .slice(0, 2)
                      .map((suggestion, idx) => {
                        const key = `${suggestion.experienceIndex}-${suggestion.bulletIndex}`
                        const isApplied = tailoredResume?.appliedBullets.has(key)

                        return (
                          <div
                            key={idx}
                            className={`p-2 rounded border text-xs ${
                              isApplied
                                ? 'bg-status-green/10 border-status-green/30'
                                : 'bg-bg-tertiary border-border'
                            }`}
                          >
                            <div className="line-through text-text-dim mb-1 truncate">
                              {suggestion.original}
                            </div>
                            <div className="text-text mb-2 truncate">
                              → {suggestion.suggested}
                            </div>
                            {!isApplied ? (
                              <button
                                onClick={() => onApplyBullet(suggestion)}
                                className="px-2 py-0.5 bg-gold text-bg-primary text-xs rounded hover:bg-gold-bright"
                              >
                                Apply
                              </button>
                            ) : (
                              <span className="text-status-green text-xs">✓ Applied</span>
                            )}
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}

              {/* Upgrade Prompt for Free Users */}
              {!isPro && (
                <div className="p-4 bg-bg-tertiary rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                    <div>
                      <div className="font-heading text-sm font-semibold mb-1">Unlock Smart Rewrites</div>
                      <p className="text-xs text-text-muted">
                        Your resume is {analysis.overallScore}% matched — rewrites could improve by up to 12%
                      </p>
                    </div>
                  </div>
                  <Button size="sm" className="mt-3 w-full" onClick={openUpgradeModal}>
                    View Upgrade Options
                  </Button>
                </div>
              )}
            </div>
          </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-4">
            {/* Skills Analysis - Now shows REQUIRED vs PREFERRED */}
            <DetailSection title="Skills Analysis" score={analysis.categoryScores?.skills}>
              <div className="space-y-4">
                {/* Matched Skills */}
                <div>
                  <div className="text-xs text-status-green font-semibold mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-status-green"></span>
                    Matched Skills ({analysis.categoryDetails?.skills?.matched?.length || 0})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {analysis.categoryDetails?.skills?.matched?.map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-xs bg-status-green/20 text-status-green rounded">
                        {skill}
                      </span>
                    )) || <span className="text-xs text-text-dim">None found</span>}
                  </div>
                </div>

                {/* Missing REQUIRED Skills - RED FLAGS */}
                {(analysis.categoryDetails?.skills?.missingRequired?.length || 0) > 0 && (
                  <div>
                    <div className="text-xs text-status-red font-semibold mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-status-red"></span>
                      Missing REQUIRED Skills ({analysis.categoryDetails?.skills?.missingRequired?.length})
                      <span className="text-[10px] font-normal px-1.5 py-0.5 bg-status-red/20 rounded">CRITICAL</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {analysis.categoryDetails?.skills?.missingRequired?.map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 text-xs bg-status-red/20 text-status-red rounded border border-status-red/30">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing PREFERRED Skills - YELLOW FLAGS */}
                {(analysis.categoryDetails?.skills?.missingPreferred?.length || 0) > 0 && (
                  <div>
                    <div className="text-xs text-status-amber font-semibold mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-status-amber"></span>
                      Missing Preferred Skills ({analysis.categoryDetails?.skills?.missingPreferred?.length})
                      <span className="text-[10px] font-normal px-1.5 py-0.5 bg-status-amber/20 rounded">Nice to have</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {analysis.categoryDetails?.skills?.missingPreferred?.map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 text-xs bg-status-amber/20 text-status-amber rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legacy fallback for old missing array */}
                {(!analysis.categoryDetails?.skills?.missingRequired?.length && !analysis.categoryDetails?.skills?.missingPreferred?.length && (analysis.categoryDetails?.skills?.missing?.length || 0) > 0) && (
                  <div>
                    <div className="text-xs text-status-amber font-semibold mb-2">Missing Skills ({analysis.categoryDetails?.skills?.missing?.length})</div>
                    <div className="flex flex-wrap gap-1">
                      {analysis.categoryDetails?.skills?.missing?.map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 text-xs bg-status-amber/20 text-status-amber rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DetailSection>

            {/* Experience Analysis */}
            <DetailSection title="Experience" score={analysis.categoryScores?.experience}>
              {(() => {
                const exp = analysis.categoryDetails?.experience
                const noRequirement = !exp?.requiredYears || exp.requiredYears === 0

                return (
                  <>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-text-muted">Required: </span>
                        <span className="font-semibold">
                          {noRequirement ? 'Not specified' : `${exp.requiredYears} years`}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-muted">You have: </span>
                        <span className="font-semibold">{exp?.candidateYears || 0} years</span>
                      </div>
                      {noRequirement ? (
                        <span className="text-status-green text-xs">✓ No specific requirement</span>
                      ) : exp?.meetsRequirement ? (
                        <span className="text-status-green text-xs">✓ Meets requirement</span>
                      ) : (
                        <span className="text-status-amber text-xs">⚠ Below requirement</span>
                      )}
                    </div>
                    {exp?.notes && (
                      <p className="text-xs text-text-muted mt-2">{exp.notes}</p>
                    )}
                  </>
                )
              })()}
            </DetailSection>

            {/* Education Analysis */}
            <DetailSection title="Education" score={analysis.categoryScores?.education}>
              {(() => {
                const edu = analysis.categoryDetails?.education
                const noRequirement = !edu?.required || edu.required === 'Not specified' || edu.required === 'N/A'

                return (
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-text-muted">Required: </span>
                      <span className="font-semibold">{noRequirement ? 'Not specified' : edu.required}</span>
                    </div>
                    <div>
                      <span className="text-text-muted">You have: </span>
                      <span className="font-semibold">{edu?.candidateLevel || 'Not specified'}</span>
                    </div>
                    {noRequirement ? (
                      <span className="text-status-green text-xs">✓ No specific requirement</span>
                    ) : edu?.meetsRequirement ? (
                      <span className="text-status-green text-xs">✓ Meets requirement</span>
                    ) : (
                      <span className="text-status-amber text-xs">⚠ May not meet requirement</span>
                    )}
                  </div>
                )
              })()}
            </DetailSection>

            {/* Certifications Analysis - Required vs Preferred */}
            <DetailSection title="Certifications" score={analysis.categoryScores?.certifications}>
              {(() => {
                const certs = analysis.categoryDetails?.certifications
                const noneRequired = !certs?.required || certs.required.length === 0

                if (noneRequired) {
                  return (
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-text-muted">No certifications required for this position</span>
                      <span className="text-status-green text-xs">✓ N/A</span>
                    </div>
                  )
                }

                return (
                  <div className="space-y-4">
                    {/* Matched */}
                    <div>
                      <div className="text-xs text-status-green font-semibold mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-status-green"></span>
                        Matched Certifications
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {(certs?.matched || []).map((cert, idx) => (
                          <span key={idx} className="px-2 py-0.5 text-xs bg-status-green/20 text-status-green rounded">
                            {cert}
                          </span>
                        ))}
                        {(!certs?.matched || certs.matched.length === 0) && (
                          <span className="text-xs text-text-muted">None matched</span>
                        )}
                      </div>
                    </div>

                    {/* Missing REQUIRED */}
                    {(certs?.missingRequired?.length || 0) > 0 && (
                      <div>
                        <div className="text-xs text-status-red font-semibold mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-status-red"></span>
                          Missing REQUIRED Certifications
                          <span className="text-[10px] font-normal px-1.5 py-0.5 bg-status-red/20 rounded">CRITICAL</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {certs?.missingRequired?.map((cert, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-xs bg-status-red/20 text-status-red rounded border border-status-red/30">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing Preferred */}
                    {(certs?.missingPreferred?.length || 0) > 0 && (
                      <div>
                        <div className="text-xs text-status-amber font-semibold mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-status-amber"></span>
                          Missing Preferred Certifications
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {certs?.missingPreferred?.map((cert, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-xs bg-status-amber/20 text-status-amber rounded">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Legacy fallback */}
                    {(!certs?.missingRequired?.length && !certs?.missingPreferred?.length && (certs?.missing?.length || 0) > 0) && (
                      <div>
                        <div className="text-xs text-status-amber font-semibold mb-2">Missing</div>
                        <div className="flex flex-wrap gap-1">
                          {certs?.missing?.map((cert, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-xs bg-status-amber/20 text-status-amber rounded">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {certs?.notes && (
                      <p className="text-xs text-text-muted mt-2 italic">{certs.notes}</p>
                    )}
                  </div>
                )
              })()}
            </DetailSection>

            {/* Clearance Analysis */}
            {analysis.categoryDetails?.clearance && (
              <DetailSection
                title="Security Clearance"
                score={analysis.categoryScores?.clearance === null ? undefined : (analysis.categoryScores?.clearance || 0)}
              >
                {(() => {
                  const clearance = analysis.categoryDetails.clearance
                  const required = clearance.required
                  const isNotRequired = !required || required === 'None' || required === 'N/A' || required.toLowerCase() === 'none'

                  if (isNotRequired) {
                    return (
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-text-muted">No clearance required for this position</span>
                        <span className="text-status-green text-xs">✓ N/A</span>
                      </div>
                    )
                  }

                  return (
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-text-muted">Required: </span>
                        <span className="font-semibold">{required}</span>
                      </div>
                      <div>
                        <span className="text-text-muted">You have: </span>
                        <span className="font-semibold">{clearance.candidateLevel || 'None'}</span>
                      </div>
                      {clearance.meetsRequirement ? (
                        <span className="text-status-green text-xs">✓ Meets requirement</span>
                      ) : (
                        <span className="text-status-red text-xs">✗ Does not meet requirement</span>
                      )}
                    </div>
                  )
                })()}
              </DetailSection>
            )}
          </div>
        )}

        {activeTab === 'changes' && (
          <div className="space-y-4">
            {changesSummary.length === 0 ? (
              <div className="text-center py-8 text-text-muted">
                <p>No changes applied yet.</p>
                <p className="text-sm mt-2">Click "Apply All Suggestions" to tailor your resume.</p>
              </div>
            ) : (
              <>
                <div className="p-3 bg-status-green/10 border border-status-green/30 rounded-lg">
                  <div className="flex items-center gap-2 text-status-green font-semibold text-sm mb-2">
                    <span>✓</span>
                    <span>{changesSummary.length} changes applied</span>
                  </div>
                  <div className="text-xs text-text-muted">
                    Match score improved from {originalScore}% to {currentScore}%
                  </div>
                </div>

                <div className="space-y-2 max-h-48 overflow-auto">
                  {changesSummary.map((change, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm p-2 bg-bg-tertiary rounded">
                      <span className="text-status-green">✓</span>
                      <span className="text-text-muted">{change}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {isPro && (
        <div className="px-4 py-3 border-t border-border bg-bg-tertiary">
          {/* Success Message */}
          {applySuccess && (
            <div className="mb-3 p-2 bg-status-green/10 border border-status-green/30 rounded text-center">
              <span className="text-status-green text-sm font-semibold">✓ All suggestions applied!</span>
            </div>
          )}

          {/* Template Selector */}
          {tailoredResume && (
            <div className="mb-4">
              <button
                onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                className="flex items-center gap-2 text-xs text-text-muted hover:text-text mb-2"
              >
                <svg className={`w-3 h-3 transition-transform ${showTemplateSelector ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
                <span className="uppercase tracking-wider font-semibold">Select Template</span>
                <span className="text-gold">({TEMPLATES[selectedTemplate]?.name || 'Clean'})</span>
              </button>

              {showTemplateSelector && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {Object.values(SELECTABLE_TEMPLATES).map((template) => {
                    const isLocked = !template.free && !isPro
                    const isSelected = selectedTemplate === template.id

                    return (
                      <button
                        key={template.id}
                        onClick={() => !isLocked && setSelectedTemplate(template.id as TemplateId)}
                        onDoubleClick={() => {
                          if (!isLocked) {
                            setPreviewTemplate(template.id as TemplateId)
                            setShowPreviewModal(true)
                          }
                        }}
                        disabled={isLocked}
                        className={`
                          relative p-2 rounded-lg border text-left transition-all group
                          ${isSelected
                            ? 'border-gold bg-gold/10'
                            : 'border-border bg-bg-secondary hover:border-gold/50'
                          }
                          ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        {/* Template Preview Placeholder */}
                        <div className="h-12 bg-white rounded mb-1.5 flex items-center justify-center overflow-hidden relative">
                          <div className="transform scale-[0.08] origin-center w-[1200%] pointer-events-none">
                            <div className="w-[612px] bg-white text-black p-8 text-[10px]" style={{ fontFamily: 'Georgia, serif' }}>
                              <div className="text-center border-b border-gray-300 pb-2 mb-2">
                                <div className="font-bold text-sm uppercase">John Doe</div>
                                <div className="text-[8px] text-gray-600">city@email.com • (555) 123-4567</div>
                              </div>
                              <div className="mb-2">
                                <div className="font-bold text-[8px] uppercase border-b border-gray-200 mb-1">Experience</div>
                                <div className="font-bold text-[8px]">Job Title</div>
                                <div className="text-[7px]">Company Name</div>
                              </div>
                            </div>
                          </div>

                          {/* Preview Expand Icon */}
                          {!isLocked && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setPreviewTemplate(template.id as TemplateId)
                                setShowPreviewModal(true)
                              }}
                              className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100"
                              title="Preview full size"
                            >
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium truncate">{template.name}</span>
                          {isLocked && (
                            <span className="text-[10px] px-1 py-0.5 bg-gold text-bg-primary rounded font-semibold">
                              Core
                            </span>
                          )}
                        </div>

                        {isSelected && (
                          <div className="absolute top-1 right-1">
                            <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handleApplyAll} className="flex-1" disabled={!analysis}>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              Apply All Suggestions
            </Button>

            <Button
              variant="secondary"
              onClick={handleDownload}
              className="flex-1"
              disabled={downloading || !tailoredResume}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {downloading ? 'Downloading...' : 'Save to Computer'}
            </Button>

            {hasChanges && (
              <Button variant="ghost" onClick={onReset} className="px-4">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
                Reset
              </Button>
            )}
          </div>
          <p className="text-xs text-text-muted mt-2 text-center">
            Saving tailored resume uses 1 of your resume downloads
          </p>
        </div>
      )}

      {/* Full Preview Modal */}
      {showPreviewModal && tailoredResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowPreviewModal(false)}
          />

          {/* Modal Content */}
          <div className="relative z-10 bg-bg-primary border border-border rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">Resume Preview</h2>

                {/* Template Switcher in Modal */}
                <select
                  autoComplete="off"
                  value={previewTemplate}
                  onChange={(e) => setPreviewTemplate(e.target.value as TemplateId)}
                  className="bg-bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-gold"
                >
                  {templateList.map((t) => {
                    const isLocked = !t.free && !isPro
                    return (
                      <option key={t.id} value={t.id} disabled={isLocked}>
                        {t.name} {isLocked ? '(Core)' : ''}
                      </option>
                    )
                  })}
                </select>

                <span className="text-xs text-text-muted">
                  Use arrow keys to browse • Enter to select • Esc to close
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Use This Template Button */}
                <button
                  onClick={() => {
                    setSelectedTemplate(previewTemplate)
                    setShowPreviewModal(false)
                  }}
                  className="px-4 py-2 bg-bg-secondary text-text rounded-lg hover:bg-bg-tertiary transition-colors text-sm"
                >
                  Use This Template
                </button>

                {/* Download from Modal */}
                <button
                  onClick={() => {
                    setSelectedTemplate(previewTemplate)
                    setShowPreviewModal(false)
                    // Small delay to let state update before download
                    setTimeout(() => handleDownload(), 100)
                  }}
                  className="px-4 py-2 bg-gold text-bg-primary font-semibold rounded-lg hover:bg-gold-bright transition-colors text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 text-text-muted hover:text-text transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Resume Preview Area */}
            <div className="flex-1 overflow-auto p-6 bg-bg-secondary/50">
              <div className="mx-auto" style={{ maxWidth: '850px' }}>
                {/* White paper background for resume */}
                <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
                  <ResumePreview
                    template={previewTemplate}
                    resumeType="private"
                    content={(() => {
                      // Build content with exclusions marked
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

            {/* Navigation Arrows for Templates */}
            <button
              onClick={() => {
                const currentIndex = templateList.findIndex(t => t.id === previewTemplate)
                const prevIndex = currentIndex - 1 < 0 ? templateList.length - 1 : currentIndex - 1
                setPreviewTemplate(templateList[prevIndex].id as TemplateId)
              }}
              className="absolute top-1/2 -translate-y-1/2 left-6 z-20 p-3 bg-bg-primary/90 rounded-full text-text hover:bg-bg-secondary transition-colors border border-border"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => {
                const currentIndex = templateList.findIndex(t => t.id === previewTemplate)
                const nextIndex = currentIndex + 1 >= templateList.length ? 0 : currentIndex + 1
                setPreviewTemplate(templateList[nextIndex].id as TemplateId)
              }}
              className="absolute top-1/2 -translate-y-1/2 right-6 z-20 p-3 bg-bg-primary/90 rounded-full text-text hover:bg-bg-secondary transition-colors border border-border"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Template indicator dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {templateList.map((t) => {
                const isActive = previewTemplate === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setPreviewTemplate(t.id as TemplateId)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      isActive
                        ? 'bg-gold w-4'
                        : 'bg-text-muted hover:bg-text'
                    }`}
                    title={t.name}
                  />
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DetailSection({
  title,
  score,
  children,
}: {
  title: string
  score?: number
  children: React.ReactNode
}) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-status-green'
    if (s >= 60) return 'text-status-amber'
    return 'text-status-red'
  }

  return (
    <div className="p-3 bg-bg-tertiary rounded-lg border border-border">
      <div className="flex items-center justify-between mb-3">
        <span className="font-heading text-sm font-semibold uppercase tracking-wider">{title}</span>
        {score !== undefined && (
          <span className={`font-mono text-sm font-bold ${getScoreColor(score)}`}>{score}%</span>
        )}
      </div>
      {children}
    </div>
  )
}
