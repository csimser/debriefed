'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'

interface CoverLetterToolProps {
  userId: string
  userPlan: string
  userProfile: any
  experiences: any[]
  skills: string[]
  currentUsage: number
  usageLimit: number
  onBack: () => void
}

export function CoverLetterTool({
  userId,
  userPlan,
  userProfile,
  experiences,
  skills,
  currentUsage,
  usageLimit,
  onBack,
}: CoverLetterToolProps) {
  const [jobData, setJobData] = useState({
    company: '',
    title: '',
    description: '',
  })
  const [hiringManagerName, setHiringManagerName] = useState('')
  const [generating, setGenerating] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [validationWarnings, setValidationWarnings] = useState<string[]>([])
  const [error, setError] = useState('')

  // Refinement options
  const [coverLetterTone, setCoverLetterTone] = useState<'professional' | 'conversational' | 'assertive'>('professional')
  const [coverLetterLength, setCoverLetterLength] = useState<'brief' | 'standard' | 'detailed'>('standard')
  const [targetIndustry, setTargetIndustry] = useState<'defense' | 'private' | 'federal' | 'startup'>('defense')
  const [emphasisAreas, setEmphasisAreas] = useState<string[]>([])
  const [openingStyle, setOpeningStyle] = useState<'achievement' | 'connection' | 'problem' | 'direct'>('achievement')
  const [selectedAchievements, setSelectedAchievements] = useState<string[]>([])
  const [isRefining, setIsRefining] = useState(false)
  const [showRefinementPanel, setShowRefinementPanel] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const remaining = usageLimit - currentUsage

  // Extract achievements from experiences for selection
  const userAchievements = experiences
    ?.flatMap((exp: any, expIdx: number) =>
      exp.bullets
        ?.filter((b: any) => b.translated_text || b.original_text)
        .map((b: any, bIdx: number) => ({
          id: `${expIdx}-${bIdx}`,
          summary: b.translated_text || b.original_text,
        })) || []
    )
    .slice(0, 10) || []

  const handleGenerate = async (isRegenerate = false) => {
    if (!jobData.company || !jobData.title || !jobData.description) {
      setError('Please fill in all fields')
      return
    }

    if (remaining <= 0 && !isRegenerate) {
      setError('You have reached your cover letter limit. Upgrade to Pro for more.')
      return
    }

    if (isRegenerate) {
      setIsRefining(true)
    } else {
      setGenerating(true)
    }
    setError('')
    if (!isRegenerate) {
      setCoverLetter('')
    }
    setValidationWarnings([])

    try {
      // Get selected achievement texts
      const achievementTexts = selectedAchievements.length > 0
        ? selectedAchievements.map(id => userAchievements.find(a => a.id === id)?.summary).filter(Boolean)
        : []

      // Sanitize data to avoid circular JSON references
      // Only extract primitive values we actually need
      const safeProfile = userProfile ? {
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        years_of_service: userProfile.years_of_service || '',
        branch: userProfile.branch || '',
        security_clearance: userProfile.security_clearance || '',
        clearance: userProfile.clearance || '',
        rank: userProfile.rank || '',
      } : null

      // Extract only what we need from experiences - no nested objects with refs
      const safeExperiences = experiences?.map(exp => ({
        job_title: exp.job_title || exp.title || '',
        civilian_title: exp.civilian_title || '',
        company: exp.company || exp.organization || '',
        bullets: exp.bullets?.map((b: any) => ({
          original_text: typeof b.original_text === 'string' ? b.original_text : '',
          translated_text: typeof b.translated_text === 'string' ? b.translated_text : '',
        })) || [],
      })) || []

      // Skills should be simple strings
      const safeSkills = Array.isArray(skills)
        ? skills.filter(s => typeof s === 'string').slice(0, 20)
        : []

      const requestBody = {
        userId,
        jobData: {
          company: jobData.company,
          title: jobData.title,
          description: jobData.description,
        },
        userProfile: safeProfile,
        experiences: safeExperiences,
        skills: safeSkills,
        hiringManagerName: hiringManagerName || '',
        // Refinement options
        tone: coverLetterTone,
        length: coverLetterLength,
        targetIndustry,
        emphasisAreas: Array.isArray(emphasisAreas) ? emphasisAreas : [],
        openingStyle,
        selectedAchievements: achievementTexts,
        isRegenerate,
      }

      console.log('Sending cover letter request:', {
        company: jobData.company,
        title: jobData.title,
        tone: coverLetterTone,
        length: coverLetterLength,
        hasProfile: !!safeProfile,
        experienceCount: safeExperiences.length,
        skillCount: safeSkills.length,
      })

      const res = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      console.log('Response status:', res.status)

      const data = await res.json()
      console.log('Response data:', data.error ? { error: data.error } : { hasLetter: !!data.coverLetter })

      if (!res.ok || data.error) {
        setError(data.error || `Server error (${res.status}). Please try again.`)
      } else if (data.coverLetter) {
        setCoverLetter(data.coverLetter)
        if (data.validationIssues) {
          setValidationWarnings(data.validationIssues)
        }
        // Show refinement panel after successful generation
        setShowRefinementPanel(true)
      } else {
        setError('No cover letter received. Please try again.')
      }
    } catch (err: any) {
      console.error('Cover letter generation error:', err)
      setError(err.message || 'Failed to generate cover letter. Please check your connection and try again.')
    } finally {
      setGenerating(false)
      setIsRefining(false)
    }
  }

  const handleQuickRefine = async (action: 'shorter' | 'stronger' | 'numbers') => {
    if (!coverLetter) return

    setIsRefining(true)
    setError('')

    try {
      const res = await fetch('/api/refine-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          currentLetter: coverLetter,
          jobTitle: jobData.title,
          companyName: jobData.company,
        }),
      })

      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        setCoverLetter(data.refined)
        if (data.validationIssues) {
          setValidationWarnings(data.validationIssues)
        }
      }
    } catch (err) {
      setError('Failed to refine cover letter. Please try again.')
    } finally {
      setIsRefining(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = async (format: 'pdf' | 'docx' | 'txt') => {
    if (!coverLetter) return

    setIsDownloading(true)

    try {
      const applicantName = `${userProfile?.first_name || ''} ${userProfile?.last_name || ''}`.trim() || 'Applicant'
      const companyName = jobData.company || 'Application'
      const safeCompanyName = companyName.replace(/[^a-zA-Z0-9-_\s]/g, '').replace(/\s+/g, '-')

      if (format === 'txt') {
        // Simple text download - handle locally
        const today = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
        const content = `${today}\n\n${coverLetter}`
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
        // PDF or DOCX - use API endpoint
        const response = await fetch('/api/export-cover-letter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: coverLetter,
            format,
            applicantName,
            companyName,
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
      console.error('Download failed:', err)
      setError('Failed to download cover letter: ' + (err.message || 'Unknown error'))
    } finally {
      setIsDownloading(false)
    }
  }

  const handleReset = () => {
    setCoverLetter('')
    setShowRefinementPanel(false)
    setValidationWarnings([])
    setCoverLetterTone('professional')
    setCoverLetterLength('standard')
    setTargetIndustry('defense')
    setEmphasisAreas([])
    setOpeningStyle('achievement')
    setSelectedAchievements([])
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-text-muted hover:text-text">
            ← Back
          </button>
          <h2 className="font-heading text-2xl font-bold uppercase tracking-wider">Cover Letter Generator</h2>
        </div>
        <Badge variant={remaining <= 1 ? 'red' : remaining <= 2 ? 'amber' : 'default'}>
          {remaining} Remaining
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="p-6">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="text-gold">◈</span> Job Details
          </h3>

          <div className="space-y-4">
            <Input
              label="Company Name"
              value={jobData.company}
              onChange={(e) => setJobData({ ...jobData, company: e.target.value })}
              placeholder="Acme Corporation"
            />

            <Input
              label="Job Title"
              value={jobData.title}
              onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
              placeholder="Operations Manager"
            />

            <div className="space-y-2">
              <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
                Hiring Manager Name <span className="text-text-dim font-normal normal-case">(optional)</span>
              </label>
              <input
                type="text"
                value={hiringManagerName}
                onChange={(e) => setHiringManagerName(e.target.value)}
                placeholder="e.g., Sarah Johnson"
                className="w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-text placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold/25"
              />
              <p className="text-xs text-text-dim">
                Check the job posting or company LinkedIn for the hiring manager's name. Makes your letter more personal.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
                Job Description
              </label>
              <textarea
                value={jobData.description}
                onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                placeholder="Paste the job description here..."
                className="w-full h-40 bg-bg-secondary border border-border rounded-md px-4 py-3 text-text placeholder:text-text-dim resize-none focus:border-gold focus:ring-1 focus:ring-gold/25"
              />
            </div>
          </div>
        </Card>

        {/* Customization Options - BEFORE Generate */}
        <Card className="p-6">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="text-gold">◇</span> Customize Your Letter
          </h3>

          <div className="space-y-4">
            {/* Tone Selection */}
            <div>
              <label className="block text-xs text-text-muted mb-2 uppercase tracking-wider">Tone</label>
              <div className="flex gap-2">
                {[
                  { id: 'professional', label: 'Professional', desc: 'Balanced and polished' },
                  { id: 'conversational', label: 'Conversational', desc: 'Warmer, personable' },
                  { id: 'assertive', label: 'Direct', desc: 'Confident, to-the-point' },
                ].map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setCoverLetterTone(tone.id as typeof coverLetterTone)}
                    className={`flex-1 p-2 rounded-lg border text-sm transition-all ${
                      coverLetterTone === tone.id
                        ? 'border-gold bg-gold/10 text-text'
                        : 'border-border bg-bg-secondary text-text-muted hover:border-gold/50'
                    }`}
                    title={tone.desc}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Length Selection */}
            <div>
              <label className="block text-xs text-text-muted mb-2 uppercase tracking-wider">Length</label>
              <div className="flex gap-2">
                {[
                  { id: 'brief', label: 'Brief', desc: '150-200 words' },
                  { id: 'standard', label: 'Standard', desc: '250-300 words' },
                  { id: 'detailed', label: 'Detailed', desc: '350-400 words' },
                ].map((length) => (
                  <button
                    key={length.id}
                    onClick={() => setCoverLetterLength(length.id as typeof coverLetterLength)}
                    className={`flex-1 p-2 rounded-lg border text-sm transition-all ${
                      coverLetterLength === length.id
                        ? 'border-gold bg-gold/10 text-text'
                        : 'border-border bg-bg-secondary text-text-muted hover:border-gold/50'
                    }`}
                    title={length.desc}
                  >
                    {length.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Industry Target */}
            <div>
              <label className="block text-xs text-text-muted mb-2 uppercase tracking-wider">Target Industry</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'defense', label: 'Defense', desc: 'BAH, Lockheed, NG' },
                  { id: 'private', label: 'Private', desc: 'Corporate/commercial' },
                  { id: 'federal', label: 'Federal', desc: 'Direct government' },
                  { id: 'startup', label: 'Startup', desc: 'Tech/less formal' },
                ].map((industry) => (
                  <button
                    key={industry.id}
                    onClick={() => setTargetIndustry(industry.id as typeof targetIndustry)}
                    className={`p-2 rounded-lg border text-sm transition-all ${
                      targetIndustry === industry.id
                        ? 'border-gold bg-gold/10 text-text'
                        : 'border-border bg-bg-secondary text-text-muted hover:border-gold/50'
                    }`}
                    title={industry.desc}
                  >
                    {industry.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Opening Style */}
            <div>
              <label className="block text-xs text-text-muted mb-2 uppercase tracking-wider">Opening Style</label>
              <select
                value={openingStyle}
                onChange={(e) => setOpeningStyle(e.target.value as typeof openingStyle)}
                className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2 text-text text-sm focus:outline-none focus:border-gold"
              >
                <option value="achievement">Lead with top achievement</option>
                <option value="connection">Lead with company/role connection</option>
                <option value="problem">Lead with problem you solve</option>
                <option value="direct">Direct statement of intent</option>
              </select>
            </div>

            {/* Emphasis Areas */}
            <div>
              <label className="block text-xs text-text-muted mb-2 uppercase tracking-wider">
                Emphasize <span className="text-text-dim font-normal normal-case">(select up to 3)</span>
              </label>
              <div className="flex flex-wrap gap-2">
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
                    className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                      emphasisAreas.includes(area)
                        ? 'bg-gold text-bg-primary font-medium'
                        : 'bg-bg-secondary text-text-muted border border-border hover:border-gold/50'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-status-red-dim border border-status-red/20 rounded-md p-3">
                <p className="text-sm text-status-red">{error}</p>
              </div>
            )}

            <Button
              className="w-full"
              onClick={() => handleGenerate(false)}
              disabled={generating || remaining <= 0}
            >
              {generating ? 'Generating...' : '✦ Generate Cover Letter'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Output Section - Full Width */}
      {(coverLetter || generating) && (
        <Card className="mt-6 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="text-gold">◫</span> Your Cover Letter
            </h3>
            {coverLetter && (
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={handleCopy} disabled={isDownloading}>
                  {copied ? '✓ Copied' : 'Copy'}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleDownload('docx')}
                  disabled={isDownloading}
                >
                  {isDownloading ? '...' : 'DOCX'}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleDownload('pdf')}
                  disabled={isDownloading}
                >
                  PDF
                </Button>
              </div>
            )}
          </div>

          {generating ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-pulse text-4xl mb-4">◈</div>
                <p className="text-text-muted">Crafting your cover letter...</p>
                <p className="text-xs text-text-dim mt-2">This may take 15-30 seconds</p>
              </div>
            </div>
          ) : coverLetter ? (
            <div className="space-y-4">
              <div className="bg-bg-secondary rounded-lg p-6 max-h-[500px] overflow-auto">
                <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
                  {coverLetter}
                </div>
              </div>

              {/* Validation warnings */}
              {validationWarnings.length > 0 && (
                <div className="bg-status-amber/10 border border-status-amber/20 rounded-md p-3">
                  <p className="text-xs text-status-amber font-semibold mb-1">Review suggestions:</p>
                  <ul className="text-xs text-text-muted space-y-0.5">
                    {validationWarnings.map((warning, idx) => (
                      <li key={idx}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Word count and quick actions */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-text-dim">
                  {coverLetter.split(/\s+/).length} words
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleQuickRefine('shorter')}
                    disabled={isRefining}
                    className="px-3 py-1.5 text-xs bg-bg-secondary text-text-muted rounded-lg hover:bg-bg-tertiary transition-colors border border-border disabled:opacity-50"
                  >
                    Make Shorter
                  </button>
                  <button
                    onClick={() => handleQuickRefine('stronger')}
                    disabled={isRefining}
                    className="px-3 py-1.5 text-xs bg-bg-secondary text-text-muted rounded-lg hover:bg-bg-tertiary transition-colors border border-border disabled:opacity-50"
                  >
                    Stronger Opening
                  </button>
                  <button
                    onClick={() => handleQuickRefine('numbers')}
                    disabled={isRefining}
                    className="px-3 py-1.5 text-xs bg-bg-secondary text-text-muted rounded-lg hover:bg-bg-tertiary transition-colors border border-border disabled:opacity-50"
                  >
                    Add Numbers
                  </button>
                  <button
                    onClick={() => handleGenerate(true)}
                    disabled={isRefining || generating}
                    className="px-3 py-1.5 text-xs bg-gold/10 text-gold rounded-lg hover:bg-gold/20 transition-colors border border-gold/30 disabled:opacity-50"
                  >
                    {isRefining ? 'Regenerating...' : 'Regenerate'}
                  </button>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-2 text-sm text-text-muted hover:text-text transition-colors"
              >
                Start Over
              </button>
            </div>
          ) : null}
        </Card>
      )}

    </div>
  )
}
