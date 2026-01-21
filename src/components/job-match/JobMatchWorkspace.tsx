'use client'

import { useState, useCallback } from 'react'
import { JobInputPane } from './JobInputPane'
import { ResumeEditPane } from './ResumeEditPane'
import { AnalysisPane } from './AnalysisPane'
import { getUserTier, isPaidTier } from '@/lib/tier-utils'

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
        // Initialize tailored resume with original content
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

  // Exclude a bullet
  const excludeBullet = useCallback((expIdx: number, bulletIdx: number) => {
    const key = `${expIdx}-${bulletIdx}`

    setTailoredResume(prev => {
      if (!prev) return prev

      const newExcluded = new Set(prev.excludedBullets)
      newExcluded.add(key)

      return {
        ...prev,
        excludedBullets: newExcluded,
      }
    })

    setChangesSummary(prev => [...prev, `Excluded a bullet point`])
  }, [])

  // Add a skill
  const addSkill = useCallback((skillName: string) => {
    setTailoredResume(prev => {
      if (!prev) return prev

      const newContent = JSON.parse(JSON.stringify(prev.content))
      if (!newContent.skills) newContent.skills = []

      // Check if skill already exists
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

  // Remove a skill
  const removeSkill = useCallback((skillName: string) => {
    setTailoredResume(prev => {
      if (!prev) return prev

      const newContent = JSON.parse(JSON.stringify(prev.content))
      newContent.skills = newContent.skills?.filter((s: any) =>
        s.name.toLowerCase() !== skillName.toLowerCase()
      ) || []

      return {
        ...prev,
        content: newContent,
        removedSkills: [...prev.removedSkills, skillName],
      }
    })

    setChangesSummary(prev => [...prev, `Removed skill: ${skillName}`])
  }, [])

  // Apply all suggestions at once
  const applyAllSuggestions = useCallback(() => {
    if (!analysis || !tailoredResume) return

    let changes: string[] = []

    // Apply all bullet rewrites
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

    // Add missing skills
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

    // Remove irrelevant skills
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

    // Return success
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

    // Simple heuristic: each applied change improves score
    const bulletImprovements = tailoredResume.appliedBullets.size * 2
    const skillAdditions = tailoredResume.addedSkills.length * 3
    const skillRemovals = tailoredResume.removedSkills.length * 1

    // Cap improvement at 20 points (realistic improvement from tailoring)
    const improvement = Math.min(bulletImprovements + skillAdditions + skillRemovals, 20)
    // Cap final score at 95% - no resume is ever a perfect match
    return Math.min(95, (analysis?.overallScore || 0) + improvement)
  }, [analysis, tailoredResume])

  return (
    <div className="flex flex-col h-full">
      {/* Usage Warning Banner */}
      {!isPro && remaining <= 2 && (
        <div className="mx-6 mt-4 flex items-center gap-3 p-4 bg-status-amber/10 border-l-4 border-status-amber rounded-r-lg">
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
              You've used {currentUsage} of {usageLimit} free Job Match analyses. Upgrade for unlimited analyses.
            </div>
          </div>
          <a href="/pricing" className="text-status-amber text-sm font-semibold hover:underline">
            Upgrade →
          </a>
        </div>
      )}

      {/* 3-Pane Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Job Posting Input */}
        <div className="w-80 flex-shrink-0 bg-bg-secondary border-r border-border flex flex-col">
          <JobInputPane
            jobData={jobData}
            onChange={setJobData}
            resumes={resumes}
            selectedResumeId={selectedResumeId}
            onSelectResume={setSelectedResumeId}
            onAnalyze={handleAnalyze}
            analyzing={analyzing}
            error={error}
          />
        </div>

        {/* Right Split Pane */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top: Resume Preview/Edit */}
          <div className="flex-1 border-b border-border overflow-hidden">
            <ResumeEditPane
              resume={selectedResume}
              tailoredResume={tailoredResume}
              analysis={analysis}
              onApplyBullet={applyBulletSuggestion}
              onExcludeBullet={excludeBullet}
              onAddSkill={addSkill}
              onRemoveSkill={removeSkill}
            />
          </div>

          {/* Bottom: Analysis Results */}
          <div className="h-[400px] overflow-hidden">
            <AnalysisPane
              analysis={analysis}
              analyzing={analyzing}
              userPlan={userPlan}
              tailoredResume={tailoredResume}
              originalScore={originalScore}
              currentScore={calculateTailoredScore()}
              changesSummary={changesSummary}
              onApplyAll={applyAllSuggestions}
              onApplyBullet={applyBulletSuggestion}
              onReset={resetChanges}
              jobData={jobData}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
