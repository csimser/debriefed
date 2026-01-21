'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface ElevatorPitchToolProps {
  userProfile: any
  experiences: any[]
  skills?: string[]
  certifications?: any[]
  onBack: () => void
}

const PITCH_DURATIONS = [
  { id: '30', label: '30 Seconds', description: 'Career fair / quick intro', wordCount: '50-75', targetSeconds: 30 },
  { id: '60', label: '60 Seconds', description: 'Standard networking pitch', wordCount: '100-130', targetSeconds: 60 },
  { id: 'networking', label: 'Networking Event', description: 'Conversational with a question', wordCount: '80-110', targetSeconds: 45 },
]

const PITCH_CONTEXTS = [
  { id: 'career-fair', label: 'Career Fair', description: 'Employers scanning lots of candidates' },
  { id: 'networking', label: 'Networking Event', description: 'Professional mixer or industry event' },
  { id: 'interview-intro', label: 'Interview Opener', description: '"Tell me about yourself"' },
  { id: 'linkedin-connect', label: 'LinkedIn Connection', description: 'Cold outreach or follow-up' },
  { id: 'informational', label: 'Informational Interview', description: 'Coffee chat with industry contact' },
]

const TONE_OPTIONS = [
  { id: 'confident', label: 'Confident', description: 'Direct and assertive' },
  { id: 'conversational', label: 'Conversational', description: 'Warm and approachable' },
  { id: 'formal', label: 'Formal', description: 'Professional and polished' },
  { id: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic and passionate' },
]

// Achievement angles - these drive DIFFERENT content
const ACHIEVEMENT_ANGLES = [
  { id: 'efficiency', label: 'Process Improvement', description: 'Cutting timelines, reducing waste, streamlining' },
  { id: 'leadership', label: 'Team Leadership', description: 'Team size, development, retention' },
  { id: 'training', label: 'Training & Development', description: 'Pass rates, certifications, programs built' },
  { id: 'technical', label: 'Technical Skills', description: 'Certifications, systems, tools' },
  { id: 'entrepreneurship', label: 'Business Ownership', description: 'Side business, revenue, customers' },
  { id: 'scope', label: 'Scale & Scope', description: 'Budget, people managed, operations scale' },
]

// Banned phrases to check for AI-speak
const BANNED_PHRASES = [
  'turn chaos into', 'systems into results', 'what really drives me',
  'big picture', 'moving parts', 'passionate about', 'results-driven',
  'leverage my', 'hit the ground running', 'make an impact', 'bring value',
  'strategic thinker', 'proven track record', 'unique combination',
  'honed my skills', 'particularly proud', 'detail-oriented', 'team player',
  'challenging projects', 'complex operations', 'synergy', 'cutting-edge',
  'game-changer', 'revolutionize', 'world-class', 'best-in-class'
]

export function ElevatorPitchTool({
  userProfile,
  experiences,
  skills = [],
  certifications = [],
  onBack
}: ElevatorPitchToolProps) {
  // Target settings
  const [targetRole, setTargetRole] = useState(userProfile?.target_role || '')
  const [targetIndustry, setTargetIndustry] = useState('')

  // Pitch options
  const [selectedDuration, setSelectedDuration] = useState('30')
  const [selectedContext, setSelectedContext] = useState('career-fair')
  const [selectedTone, setSelectedTone] = useState('confident')
  const [selectedAngle, setSelectedAngle] = useState('efficiency') // Single selection for achievement angle
  const [includeCallToAction, setIncludeCallToAction] = useState(true)
  const [mentionVeteranStatus, setMentionVeteranStatus] = useState(true)

  // Generation state
  const [pitch, setPitch] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [generationCount, setGenerationCount] = useState(0)
  const [copied, setCopied] = useState(false)

  // Practice mode
  const [isPracticeMode, setIsPracticeMode] = useState(false)
  const [practiceTime, setPracticeTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Profile summary
  const profileSummary = {
    name: `${userProfile?.first_name || ''} ${userProfile?.last_name || ''}`.trim() || 'Not set',
    branch: userProfile?.branch || 'Not set',
    rank: userProfile?.rank || 'Not set',
    yearsOfService: userProfile?.years_of_service || 'Not set',
    experienceCount: experiences?.length || 0,
    certCount: certifications?.length || 0,
    skillCount: skills?.length || 0,
  }

  // Quality check for generated pitch
  const checkPitchQuality = (text: string): { issues: string[], passed: boolean } => {
    const issues: string[] = []

    BANNED_PHRASES.forEach(phrase => {
      if (text.toLowerCase().includes(phrase.toLowerCase())) {
        issues.push(`Contains banned phrase: "${phrase}"`)
      }
    })

    const wordCount = text.split(/\s+/).filter(Boolean).length
    const limits = PITCH_DURATIONS.find(d => d.id === selectedDuration)
    if (limits) {
      const [min, max] = limits.wordCount.split('-').map(n => parseInt(n))
      if (wordCount > max + 10) {
        issues.push(`Too long: ${wordCount} words (target: ${limits.wordCount})`)
      }
    }

    return { issues, passed: issues.length === 0 }
  }

  // Timer effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setPracticeTime(prev => prev + 1)
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isTimerRunning])

  const generatePitch = async () => {
    if (!targetRole.trim()) return

    setIsGenerating(true)
    setPitch(null)
    setError('')

    try {
      const response = await fetch('/api/career-tools/elevator-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          targetIndustry,
          duration: selectedDuration,
          context: selectedContext,
          tone: selectedTone,
          achievementAngle: selectedAngle,
          includeCallToAction,
          mentionVeteranStatus,
          profileData: {
            profile: userProfile,
            experiences,
            certifications,
            skills
          }
        })
      })

      const data = await response.json()
      if (data.error) {
        setError(data.error)
      } else if (data.pitch) {
        setPitch(data.pitch)
        setGenerationCount(prev => prev + 1)
      }
    } catch (err) {
      setError('Failed to generate pitch. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    if (pitch) {
      await navigator.clipboard.writeText(pitch)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const startPractice = () => {
    setIsPracticeMode(true)
    setPracticeTime(0)
    setIsTimerRunning(false)
  }

  const getTargetTime = () => {
    const duration = PITCH_DURATIONS.find(d => d.id === selectedDuration)
    return duration?.targetSeconds || 30
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerColor = () => {
    const target = getTargetTime()
    if (practiceTime <= target) return 'text-status-green'
    if (practiceTime <= target * 1.2) return 'text-gold'
    return 'text-status-red'
  }

  const wordCount = pitch ? pitch.split(/\s+/).filter(Boolean).length : 0

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-text-muted hover:text-text">
          ← Back
        </button>
        <h2 className="font-heading text-2xl font-bold uppercase tracking-wider">Elevator Pitch</h2>
      </div>

      {/* Profile Data Summary */}
      <Card className="p-4 mb-6">
        <h3 className="text-sm font-medium text-gold mb-3">Using Your Profile Data</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-text-muted">Name:</span>
            <span className="ml-2 text-text">{profileSummary.name}</span>
          </div>
          <div>
            <span className="text-text-muted">Branch:</span>
            <span className="ml-2 text-text">{profileSummary.branch}</span>
          </div>
          <div>
            <span className="text-text-muted">Rank:</span>
            <span className="ml-2 text-text">{profileSummary.rank}</span>
          </div>
          <div>
            <span className="text-text-muted">Experience:</span>
            <span className="ml-2 text-text">{profileSummary.experienceCount} positions</span>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Configuration */}
        <div className="space-y-6">
          {/* Target Position */}
          <Card className="p-6">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-gold">◇</span> Target Position
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">
                  Target Role <span className="text-status-red">*</span>
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g., Project Manager, Operations Director"
                  className="w-full px-4 py-3 bg-bg-tertiary border border-border rounded-lg text-text placeholder:text-text-muted focus:border-gold/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">
                  Target Industry (optional)
                </label>
                <input
                  type="text"
                  value={targetIndustry}
                  onChange={(e) => setTargetIndustry(e.target.value)}
                  placeholder="e.g., Defense, Technology, Healthcare"
                  className="w-full px-4 py-3 bg-bg-tertiary border border-border rounded-lg text-text placeholder:text-text-muted focus:border-gold/50 focus:outline-none"
                />
              </div>
            </div>
          </Card>

          {/* Pitch Duration */}
          <Card className="p-6">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-gold">◇</span> Pitch Duration
            </h3>
            <div className="space-y-3">
              {PITCH_DURATIONS.map((duration) => (
                <button
                  key={duration.id}
                  onClick={() => setSelectedDuration(duration.id)}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    selectedDuration === duration.id
                      ? 'border-gold bg-gold/10'
                      : 'border-border bg-bg-tertiary hover:border-border-hover'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-text">{duration.label}</span>
                      <p className="text-sm text-text-muted mt-1">{duration.description}</p>
                    </div>
                    <span className="text-xs text-text-muted bg-bg-primary px-2 py-1 rounded">
                      {duration.wordCount} words
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Context */}
          <Card className="p-6">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-gold">◇</span> Situation Context
            </h3>
            <div className="space-y-2">
              {PITCH_CONTEXTS.map((context) => (
                <button
                  key={context.id}
                  onClick={() => setSelectedContext(context.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    selectedContext === context.id
                      ? 'border-gold bg-gold/10'
                      : 'border-border bg-bg-tertiary hover:border-border-hover'
                  }`}
                >
                  <span className="font-medium text-text text-sm">{context.label}</span>
                  <p className="text-xs text-text-muted mt-0.5">{context.description}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Tone & Achievement Angle */}
          <Card className="p-6">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-gold">◇</span> Tone & Focus
            </h3>

            {/* Tone Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-muted mb-3">Tone</label>
              <div className="flex flex-wrap gap-2">
                {TONE_OPTIONS.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedTone(tone.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedTone === tone.id
                        ? 'bg-gold text-bg-primary'
                        : 'bg-bg-tertiary text-text-muted hover:text-text border border-border'
                    }`}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Achievement Angle Selection - SINGLE SELECT */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-muted mb-3">
                What to Highlight <span className="text-xs opacity-50">(pick one)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ACHIEVEMENT_ANGLES.map((angle) => (
                  <button
                    key={angle.id}
                    onClick={() => setSelectedAngle(angle.id)}
                    className={`p-3 rounded-lg text-left transition-all ${
                      selectedAngle === angle.id
                        ? 'bg-gold/20 text-gold border border-gold'
                        : 'bg-bg-tertiary text-text-muted hover:text-text border border-border'
                    }`}
                  >
                    <span className="font-medium text-sm">{angle.label}</span>
                    <p className="text-xs opacity-70 mt-0.5">{angle.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Options */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mentionVeteranStatus}
                  onChange={(e) => setMentionVeteranStatus(e.target.checked)}
                  className="w-4 h-4 rounded border-border bg-bg-tertiary text-gold focus:ring-gold/50"
                />
                <span className="text-sm text-text">Mention veteran/military background</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCallToAction}
                  onChange={(e) => setIncludeCallToAction(e.target.checked)}
                  className="w-4 h-4 rounded border-border bg-bg-tertiary text-gold focus:ring-gold/50"
                />
                <span className="text-sm text-text">Include call-to-action at the end</span>
              </label>
            </div>
          </Card>

          {/* Error */}
          {error && (
            <div className="bg-status-red-dim border border-status-red/20 rounded-md p-3">
              <p className="text-sm text-status-red">{error}</p>
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={generatePitch}
            disabled={!targetRole.trim() || isGenerating}
            className="w-full py-4 text-lg font-semibold"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current"></span>
                Crafting Your Pitch...
              </span>
            ) : (
              '✦ Generate Elevator Pitch'
            )}
          </Button>
        </div>

        {/* Right Column - Output & Practice */}
        <div className="space-y-6">
          {/* Generated Pitch */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="text-gold">◈</span> Your Elevator Pitch
              </h3>
              {pitch && (
                <div className="flex gap-2">
                  <button
                    onClick={generatePitch}
                    disabled={isGenerating}
                    className="px-3 py-1.5 bg-bg-tertiary text-text-muted rounded-lg text-sm hover:text-text transition-colors flex items-center gap-1"
                  >
                    <span>↻</span> Regenerate
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1.5 bg-bg-tertiary text-text-muted rounded-lg text-sm hover:text-text transition-colors"
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={startPractice}
                    className="px-3 py-1.5 bg-gold/20 text-gold rounded-lg text-sm hover:bg-gold/30 transition-colors"
                  >
                    Practice Mode
                  </button>
                </div>
              )}
            </div>

            {isGenerating ? (
              <div className="h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-pulse text-4xl mb-4">◇</div>
                  <p className="text-text-muted">Crafting your pitch...</p>
                </div>
              </div>
            ) : pitch ? (
              <div className="space-y-4">
                <div className="p-4 bg-bg-secondary rounded-lg border border-border">
                  <p className="text-text leading-relaxed whitespace-pre-wrap">{pitch}</p>
                </div>

                {/* Stats Bar */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-text-muted">
                    <span>{wordCount} words</span>
                    <span>~{Math.ceil(wordCount / 2.5)}s to deliver</span>
                    {generationCount > 1 && (
                      <span className="opacity-60">Version {generationCount}</span>
                    )}
                  </div>

                  {/* Quality Check */}
                  {(() => {
                    const { issues, passed } = checkPitchQuality(pitch)
                    return passed ? (
                      <span className="text-status-green flex items-center gap-1">
                        <span>✓</span> Quality check passed
                      </span>
                    ) : (
                      <span className="text-gold flex items-center gap-1 cursor-help" title={issues.join('\n')}>
                        <span>⚠</span> {issues.length} issue{issues.length > 1 ? 's' : ''} detected
                      </span>
                    )
                  })()}
                </div>

                {/* Quality Issues Detail */}
                {(() => {
                  const { issues } = checkPitchQuality(pitch)
                  if (issues.length === 0) return null
                  return (
                    <div className="p-3 bg-gold/10 border border-gold/20 rounded-lg">
                      <p className="text-gold text-sm font-medium mb-1">Quality Issues:</p>
                      <ul className="text-gold/80 text-xs space-y-1">
                        {issues.map((issue, i) => (
                          <li key={i}>• {issue}</li>
                        ))}
                      </ul>
                      <button
                        onClick={generatePitch}
                        className="mt-2 text-gold text-xs underline hover:no-underline"
                      >
                        Try regenerating for better results
                      </button>
                    </div>
                  )
                })()}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                <p className="text-text-muted text-center">
                  Configure your options and click<br />
                  <span className="text-gold">Generate Elevator Pitch</span>
                </p>
              </div>
            )}
          </Card>

          {/* Practice Mode */}
          {isPracticeMode && pitch && (
            <Card className="p-6 border-gold">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gold flex items-center gap-2">
                  <span>🎤</span> Practice Mode
                </h3>
                <button
                  onClick={() => setIsPracticeMode(false)}
                  className="text-text-muted hover:text-text"
                >
                  ✕
                </button>
              </div>

              {/* Timer Display */}
              <div className="text-center mb-6">
                <div className={`text-6xl font-mono font-bold ${getTimerColor()}`}>
                  {formatTime(practiceTime)}
                </div>
                <p className="text-text-muted mt-2">
                  Target: {getTargetTime()} seconds
                </p>
              </div>

              {/* Timer Controls */}
              <div className="flex justify-center gap-4 mb-6">
                {!isTimerRunning ? (
                  <Button onClick={() => setIsTimerRunning(true)} className="px-8">
                    {practiceTime === 0 ? 'Start' : 'Resume'}
                  </Button>
                ) : (
                  <Button onClick={() => setIsTimerRunning(false)} variant="secondary" className="px-8">
                    Pause
                  </Button>
                )}
                <Button
                  onClick={() => { setPracticeTime(0); setIsTimerRunning(false) }}
                  variant="secondary"
                  className="px-8"
                >
                  Reset
                </Button>
              </div>

              {/* Pitch Reference */}
              <div className="p-4 bg-bg-secondary rounded-lg border border-border max-h-48 overflow-y-auto">
                <p className="text-text-muted leading-relaxed text-sm">{pitch}</p>
              </div>

              {/* Tips */}
              <div className="mt-4 p-3 bg-gold/10 rounded-lg">
                <p className="text-sm text-gold">
                  💡 Practice until you can deliver naturally without reading. Aim to finish within your target time.
                </p>
              </div>
            </Card>
          )}

          {/* Delivery Tips */}
          <Card className="p-4">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider mb-3 text-gold">Delivery Tips</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>• Start with a confident, firm handshake and eye contact</li>
              <li>• Speak at a measured pace — rushing sounds nervous</li>
              <li>• Pause briefly after key achievements for impact</li>
              <li>• End with a clear call-to-action or question</li>
              <li>• Practice until it sounds natural, not memorized</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
