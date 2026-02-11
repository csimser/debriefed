'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CoverLetterTool } from './CoverLetterTool'
import { LinkedInTool } from './LinkedInTool'
import { EvalHistorySection } from '@/components/eval/EvalHistorySection'
import { EvalUploadModal } from '@/components/profile/EvalUploadModal'
import { getUserTier, isPaidTier } from '@/lib/tier-utils'

interface CareerToolsHubProps {
  userId: string
  userPlan: string
  userProfile: any
  experiences: any[]
  skills: string[]
  certifications?: any[]
  education?: any[]
  coverLetterUsage: number
  coverLetterLimit: number
  linkedinUsage: number
  linkedinLimit: number
  evalUsage?: number
  evalLimit?: number
  evalUploads?: any[]
}

const TOOLS = [
  { id: 'cover-letter', name: 'Cover Letter Generator', icon: '◈', description: 'Custom cover letters tailored to job postings', requiresPaid: false },
  { id: 'linkedin', name: 'LinkedIn Optimizer', icon: '◎', description: 'Optimize your LinkedIn summary and headline', requiresPaid: false },
  { id: 'eval-upload', name: 'Eval Translator', icon: '◫', description: 'Upload military evals & translate bullets to civilian STAR format', requiresPaid: false },
]

export function CareerToolsHub({
  userId,
  userPlan,
  userProfile,
  experiences,
  skills,
  certifications,
  education,
  coverLetterUsage,
  coverLetterLimit,
  linkedinUsage,
  linkedinLimit,
  evalUsage = 0,
  evalLimit = 2,
  evalUploads = [],
}: CareerToolsHubProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const toolFromUrl = searchParams.get('tool')

  // Use URL param as the source of truth
  const [activeTool, setActiveToolState] = useState<string | null>(toolFromUrl)
  const [showEvalUpload, setShowEvalUpload] = useState(false)
  const userTier = getUserTier({ tier: userPlan })
  const hasPaidAccess = isPaidTier(userTier)

  // Sync state with URL param changes
  useEffect(() => {
    setActiveToolState(toolFromUrl)
  }, [toolFromUrl])

  // Update URL when changing tool
  const setActiveTool = (toolId: string | null) => {
    if (toolId) {
      router.push(`/career-tools?tool=${toolId}`)
    } else {
      router.push('/career-tools')
    }
    setActiveToolState(toolId)
  }

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wider">Career Tools</h1>
        <p className="text-text-muted mt-1 text-sm md:text-base">Smart tools to accelerate your job search</p>
      </div>

      {/* Tool Selector - larger touch targets on mobile */}
      {!activeTool && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {TOOLS.map((tool) => {
            const isLocked = tool.requiresPaid && !hasPaidAccess
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="text-left w-full"
              >
                <Card className={`p-5 md:p-6 h-full hover:border-gold/30 active:border-gold/30 transition-all group relative min-h-[120px] ${isLocked ? 'opacity-80' : ''}`}>
                  {isLocked && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-gold text-bg-primary text-xs font-bold rounded">
                      CORE
                    </div>
                  )}
                  <div className="flex items-start gap-4 md:block">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gold-dim rounded-lg flex items-center justify-center md:mb-4 group-hover:bg-gold/20 group-active:bg-gold/20 transition-all flex-shrink-0">
                      <span className="text-gold text-xl md:text-2xl">{tool.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-heading text-base md:text-lg font-bold uppercase mb-1 md:mb-2">{tool.name}</h3>
                      <p className="text-sm text-text-muted">{tool.description}</p>
                      {isLocked && (
                        <p className="text-xs text-gold mt-2">Requires Core or Full access</p>
                      )}
                    </div>
                  </div>
                </Card>
              </button>
            )
          })}
        </div>
      )}

      {/* Active Tool */}
      {activeTool === 'cover-letter' && (
        <CoverLetterTool
          userId={userId}
          userPlan={userPlan}
          userProfile={userProfile}
          experiences={experiences}
          skills={skills}
          currentUsage={coverLetterUsage}
          usageLimit={coverLetterLimit}
          onBack={() => setActiveTool(null)}
        />
      )}

      {activeTool === 'linkedin' && (
        <LinkedInTool
          userProfile={userProfile}
          experiences={experiences}
          skills={skills}
          certifications={certifications}
          education={education}
          isPro={isPaidTier(getUserTier({ tier: userPlan }))}
          currentUsage={linkedinUsage}
          usageLimit={linkedinLimit}
          onBack={() => setActiveTool(null)}
        />
      )}

      {activeTool === 'eval-upload' && (
        <div className="space-y-6">
          <button
            onClick={() => setActiveTool(null)}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-gold transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tools
          </button>

          <div>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider mb-1">Eval Translator</h2>
            <p className="text-text-muted text-sm">Upload military evaluations and translate bullets to civilian STAR format</p>
          </div>

          {experiences.length === 0 ? (
            <Card className="p-6 text-center">
              <div className="text-text-dim text-3xl mb-3">&#9672;</div>
              <p className="font-heading text-sm font-semibold mb-2">Create an Experience First</p>
              <p className="text-text-muted text-sm mb-4">
                Add a job experience on your Profile page first, then come back to import eval bullets into it.
              </p>
              <a
                href="/profile"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-bg-primary rounded font-heading font-bold uppercase text-sm hover:bg-gold-bright transition-colors"
              >
                Go to Profile
              </a>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <Badge variant={evalLimit - evalUsage <= 0 ? 'red' : evalLimit - evalUsage <= 1 ? 'amber' : 'default'}>
                  {Math.max(0, evalLimit - evalUsage)} Remaining
                </Badge>
                <button
                  onClick={() => setShowEvalUpload(true)}
                  disabled={evalLimit - evalUsage <= 0}
                  className="px-4 py-2 bg-gold text-bg-primary rounded font-heading font-bold uppercase text-sm hover:bg-gold-bright disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Upload Evaluation
                </button>
              </div>

              {evalUploads.length > 0 && (
                <EvalHistorySection
                  uploads={evalUploads}
                  experiences={experiences}
                  userId={userId}
                />
              )}
            </>
          )}

          {showEvalUpload && (
            <EvalUploadModal
              isOpen={showEvalUpload}
              onClose={() => setShowEvalUpload(false)}
              onExtracted={() => {
                setShowEvalUpload(false)
                router.refresh()
              }}
              onBulletsSaved={() => router.refresh()}
              userId={userId}
              experiences={experiences.map(exp => ({
                id: exp.id,
                job_title: exp.job_title || exp.civilian_title || 'Untitled',
                organization: exp.organization || exp.company_name || '',
                start_date: exp.start_date || '',
                end_date: exp.end_date || '',
              }))}
            />
          )}
        </div>
      )}
    </div>
  )
}
