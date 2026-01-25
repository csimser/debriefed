'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { CoverLetterTool } from './CoverLetterTool'
import { LinkedInTool } from './LinkedInTool'
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
}

const TOOLS = [
  { id: 'cover-letter', name: 'Cover Letter Generator', icon: '◈', description: 'Custom cover letters tailored to job postings', requiresPaid: false },
  { id: 'linkedin', name: 'LinkedIn Optimizer', icon: '◎', description: 'Optimize your LinkedIn summary and headline', requiresPaid: false },
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
}: CareerToolsHubProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const toolFromUrl = searchParams.get('tool')

  // Use URL param as the source of truth
  const [activeTool, setActiveToolState] = useState<string | null>(toolFromUrl)
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
          onBack={() => setActiveTool(null)}
        />
      )}
    </div>
  )
}
