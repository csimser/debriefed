'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'

interface LinkedInToolProps {
  userProfile: any
  experiences: any[]
  skills: string[]
  certifications?: any[]
  education?: any[]
  isPro: boolean
  currentUsage?: number
  usageLimit?: number
  onBack: () => void
}

export function LinkedInTool({ userProfile, experiences, skills, certifications, education, isPro, currentUsage = 0, usageLimit = 999, onBack }: LinkedInToolProps) {
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
  const [regeneratingHeadline, setRegeneratingHeadline] = useState(false)
  const [regeneratingAbout, setRegeneratingAbout] = useState(false)
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

  // Analyze mode state
  const [linkedInPDF, setLinkedInPDF] = useState<any>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const generateContent = async (regenerateOnly?: 'headline' | 'about') => {
    if (!targetRole) {
      setError('Please enter your target role')
      return
    }

    if (remaining <= 0) {
      setError('Free tier limit reached — upgrade to regenerate')
      return
    }

    if (regenerateOnly === 'headline') {
      setRegeneratingHeadline(true)
    } else if (regenerateOnly === 'about') {
      setRegeneratingAbout(true)
    } else {
      setGenerating(true)
      // Don't clear results here — preserve them in case of error (e.g. 403 limit reached)
    }
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
          // Refinement options
          tone,
          aboutLength,
          emphasis,
          regenerateOnly,
        }),
      })

      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        if (regenerateOnly === 'headline') {
          setResults(prev => prev ? { ...prev, headline: data.headline } : { headline: data.headline, summary: '' })
        } else if (regenerateOnly === 'about') {
          setResults(prev => prev ? { ...prev, summary: data.summary } : { headline: '', summary: data.summary })
        } else {
          setResults(data)
        }
      }
    } catch (err) {
      setError('Failed to generate. Please try again.')
    } finally {
      setGenerating(false)
      setRegeneratingHeadline(false)
      setRegeneratingAbout(false)
    }
  }

  const handleGenerate = () => generateContent()
  const regenerateHeadline = () => generateContent('headline')
  const regenerateAbout = () => generateContent('about')

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text)
    setCopied(section)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-text-muted hover:text-text">
            ← Back
          </button>
          <h2 className="font-heading text-2xl font-bold uppercase tracking-wider">LinkedIn Optimizer</h2>
        </div>
        <Badge variant={remaining <= 1 ? 'red' : remaining <= 2 ? 'amber' : 'default'}>
          {remaining} Remaining
        </Badge>
      </div>

      {/* Mode Toggle with descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setMode('generate')}
          className={`p-4 rounded-lg text-left transition-all border-2 ${
            mode === 'generate'
              ? 'border-gold bg-gold/10'
              : 'border-border bg-bg-secondary hover:border-gold/50'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-semibold text-text">Generate New Content</span>
          </div>
          <p className="text-sm text-text-muted">
            Create an optimized headline and about section using your Debriefed profile data
          </p>
        </button>

        <button
          onClick={() => setMode('analyze')}
          className={`p-4 rounded-lg text-left transition-all border-2 relative ${
            mode === 'analyze'
              ? 'border-gold bg-gold/10'
              : 'border-border bg-bg-secondary hover:border-gold/50'
          }`}
        >
          {!isPro && (
            <div className="absolute top-2 right-2 px-2 py-0.5 bg-gold text-black text-xs font-bold rounded">
              CORE
            </div>
          )}
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span className={`font-semibold ${isPro ? 'text-text' : 'text-text-muted'}`}>
              Full Profile Audit & Recommendations
            </span>
          </div>
          <p className={`text-sm ${isPro ? 'text-text-muted' : 'text-text-dim'}`}>
            Upload your current LinkedIn PDF for a full audit with specific fixes for headline, summary, skills & keywords
          </p>
        </button>
      </div>

      {mode === 'generate' ? (
        // === EXISTING GENERATE UI ===
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <Card className="p-6">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-gold">◎</span> Your Target
            </h3>

            <div className="space-y-4">
              <Input
                label="Target Role / Industry"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g., Operations Manager, Project Management, Cybersecurity"
              />

              <div className="p-4 bg-bg-tertiary rounded-lg">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider mb-2">Using Your Profile Data</h4>
                <ul className="text-sm text-text-muted space-y-1">
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
              <div className="p-4 bg-bg-tertiary rounded-lg">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider mb-3">Customize Output</h4>

                {/* Tone */}
                <div className="mb-4">
                  <label className="text-xs text-text-dim mb-2 block">Tone</label>
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
                            ? 'bg-gold text-black font-medium'
                            : 'bg-bg-secondary text-text-muted hover:text-text'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* About Length */}
                <div className="mb-4">
                  <label className="text-xs text-text-dim mb-2 block">About Length</label>
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
                            ? 'bg-gold text-black font-medium'
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
                  <label className="text-xs text-text-dim mb-2 block">Emphasize (select up to 3)</label>
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
                              ? 'bg-gold text-black'
                              : 'bg-bg-secondary text-text-dim hover:text-text-muted'
                          }`}
                        >
                          {area}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-status-red-dim border border-status-red/20 rounded-md p-3">
                  <p className="text-sm text-status-red">{error}</p>
                </div>
              )}

              <Button
                className="w-full"
                onClick={handleGenerate}
                disabled={generating || remaining <= 0}
              >
                {generating ? 'Optimizing...' : remaining <= 0 ? 'Limit Reached' : '✦ Generate LinkedIn Content'}
              </Button>
            </div>
          </Card>

          {/* Output */}
          <div className="space-y-6">
            {/* Headline */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="text-gold">◆</span> Headline
                </h3>
                {results?.headline && (
                  <div className="flex items-center gap-3">
                    {remaining <= 0 ? (
                      <span className="text-xs text-text-dim">Limit reached</span>
                    ) : (
                    <button
                      onClick={regenerateHeadline}
                      disabled={regeneratingHeadline || remaining <= 0}
                      className="text-xs text-text-muted hover:text-text flex items-center gap-1 disabled:opacity-50"
                    >
                      <svg className={`w-3 h-3 ${regeneratingHeadline ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {regeneratingHeadline ? 'Regenerating...' : 'Regenerate'}
                    </button>
                    )}
                    <button
                      onClick={() => handleCopy(results.headline, 'headline')}
                      className="text-xs text-text-muted hover:text-text"
                    >
                      {copied === 'headline' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                )}
              </div>

              {generating || regeneratingHeadline ? (
                <div className="h-16 flex items-center justify-center">
                  <div className="animate-pulse text-text-muted">Generating...</div>
                </div>
              ) : results?.headline ? (
                <div className="bg-bg-secondary rounded-lg p-4">
                  <p className="text-lg font-medium">{results.headline}</p>
                </div>
              ) : (
                <div className="h-16 flex items-center justify-center text-text-muted text-sm">
                  Your optimized headline will appear here
                </div>
              )}
              <p className="text-xs text-text-dim mt-2">Max 220 characters for LinkedIn</p>
            </Card>

            {/* Summary */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="text-gold">◫</span> About / Summary
                </h3>
                {results?.summary && (
                  <div className="flex items-center gap-3">
                    {remaining <= 0 ? (
                      <span className="text-xs text-text-dim">Limit reached</span>
                    ) : (
                    <button
                      onClick={regenerateAbout}
                      disabled={regeneratingAbout || remaining <= 0}
                      className="text-xs text-text-muted hover:text-text flex items-center gap-1 disabled:opacity-50"
                    >
                      <svg className={`w-3 h-3 ${regeneratingAbout ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {regeneratingAbout ? 'Regenerating...' : 'Regenerate'}
                    </button>
                    )}
                    <button
                      onClick={() => handleCopy(results.summary, 'summary')}
                      className="text-xs text-text-muted hover:text-text"
                    >
                      {copied === 'summary' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                )}
              </div>

              {generating || regeneratingAbout ? (
                <div className="h-48 flex items-center justify-center">
                  <div className="animate-pulse text-text-muted">Generating...</div>
                </div>
              ) : results?.summary ? (
                <div className="bg-bg-secondary rounded-lg p-4 max-h-80 overflow-auto">
                  <p className="whitespace-pre-line text-sm leading-relaxed">{results.summary}</p>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-text-muted text-sm">
                  Your optimized summary will appear here
                </div>
              )}
              <p className="text-xs text-text-dim mt-2">Optimized for LinkedIn's 2,600 character limit</p>
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
          isPro={isPro}
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

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
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
        <h3 className="text-lg font-bold text-text mb-2">Upgrade to Core to unlock AI-powered recommendations</h3>
        <p className="text-sm text-text-muted mb-4">
          Get specific rewrites for your headline, about section, skills recommendations, and priority actions.
        </p>
        <Button onClick={() => window.location.href = '/pricing'}>
          Get Core - $35
        </Button>
        <p className="text-xs text-text-dim mt-2">One-time payment • 30 days access</p>
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
                  <span className="text-green-400">•</span>
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
                onClick={() => copyToClipboard(analysis.sections.headline.suggested, 'headline')}
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
                <p className="text-text bg-green-500/10 border border-green-500/30 rounded-lg p-3">{analysis.sections.headline.suggested}</p>
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
                onClick={() => copyToClipboard(analysis.sections.about.suggested, 'about')}
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
                <p className="text-text bg-green-500/10 border border-green-500/30 rounded-lg p-3 whitespace-pre-wrap max-h-48 overflow-auto">{analysis.sections.about.suggested}</p>
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
                          position.score >= 80 ? 'bg-green-500/20 text-green-400' :
                          position.score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {position.score}/100
                        </span>
                        {/* Disposition Badge */}
                        {position.disposition && (
                          <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                            position.disposition === 'keep' ? 'bg-green-500/20 text-green-400' :
                            position.disposition === 'enhance' ? 'bg-gold/20 text-gold' :
                            position.disposition === 'condense' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-red-500/20 text-red-400'
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
                          position.disposition === 'remove' ? 'text-red-400' :
                          position.disposition === 'condense' ? 'text-blue-400' :
                          'text-gold'
                        }`}>
                          {position.dispositionReason}
                        </p>
                      )}
                      {/* Title Suggestion */}
                      {position.suggestedTitle && position.suggestedTitle !== position.originalTitle && (
                        <p className="text-xs text-green-400 mt-1">
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
                              bullet.score >= 80 ? 'bg-green-500/20 text-green-400' :
                              bullet.score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {bullet.score}
                            </span>
                            <div className="flex-1">
                              <p className="text-sm text-text-muted">{bullet.original}</p>

                              {/* Issues */}
                              {bullet.issues?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {bullet.issues.map((issue: string, i: number) => (
                                    <span key={i} className="text-xs px-2 py-0.5 bg-red-500/10 text-red-400 rounded">
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
                                  onClick={() => copyToClipboard(bullet.rewritten, `bullet-${posIdx}-${bulletIdx}`)}
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
                                <span className="text-green-400">+</span>
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
                  copyToClipboard(allRewrites, 'all-rewrites')
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
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-xs text-green-400 font-semibold mb-2">Add These Skills</p>
                <ul className="space-y-1">
                  {analysis.sections.skills.add?.map((skill: string, i: number) => (
                    <li key={i} className="text-sm text-text-muted">+ {skill}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-xs text-red-400 font-semibold mb-2">Consider Removing</p>
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
                          cert.relevance === 'high' ? 'bg-green-500/20 text-green-400' :
                          cert.relevance === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
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
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg mb-4">
                <p className="text-xs text-green-400 font-semibold mb-2">Recommended to Pursue</p>
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
                        edu.relevance === 'high' ? 'bg-green-500/20 text-green-400' :
                        edu.relevance === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
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
                    <span key={i} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">{kw}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-text-dim mb-2">Present Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.sections.keywords.present?.map((kw: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">{kw}</span>
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
                  <span className="w-8 h-8 flex items-center justify-center bg-gold text-black font-bold rounded-full text-sm">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-text">{action.action}</span>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      action.impact === 'high' ? 'bg-green-500/20 text-green-400' :
                      action.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-bg-tertiary text-text-muted'
                    }`}>
                      {action.impact}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      action.effort === 'easy' ? 'bg-blue-500/20 text-blue-400' :
                      action.effort === 'medium' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-red-500/20 text-red-400'
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
        <Card className="p-4 border-green-500/30">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <span className="w-6 h-6 bg-gold text-black rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                <span>Go to your LinkedIn profile (click "Me" → "View Profile")</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-gold text-black rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                <span>Click the <strong className="text-text">"Resources"</strong> button in your profile header</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-gold text-black rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                <span>Select <strong className="text-text">"Save to PDF"</strong> from the dropdown</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-gold text-black rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
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
