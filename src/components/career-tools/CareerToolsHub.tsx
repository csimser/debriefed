'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CoverLetterTool } from './CoverLetterTool'
import { LinkedInTool } from './LinkedInTool'
import { ElevatorPitchTool } from './ElevatorPitchTool'
import { getUserTier, isPaidTier, canAccessElevatorPitch } from '@/lib/tier-utils'

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
  { id: 'elevator-pitch', name: 'Elevator Pitch', icon: '◇', description: 'Create a 30-second pitch for networking', requiresPaid: true },
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
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const userTier = getUserTier({ tier: userPlan })
  const hasPaidAccess = isPaidTier(userTier)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wider">Career Tools</h1>
        <p className="text-text-muted mt-1">Smart tools to accelerate your job search</p>
      </div>

      {/* Tool Selector */}
      {!activeTool && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TOOLS.map((tool) => {
            const isLocked = tool.requiresPaid && !hasPaidAccess
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="text-left"
              >
                <Card className={`p-6 h-full hover:border-gold/30 transition-all group relative ${isLocked ? 'opacity-80' : ''}`}>
                  {isLocked && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-gold text-bg-primary text-xs font-bold rounded">
                      CORE
                    </div>
                  )}
                  <div className="w-14 h-14 bg-gold-dim rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-all">
                    <span className="text-gold text-2xl">{tool.icon}</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold uppercase mb-2">{tool.name}</h3>
                  <p className="text-sm text-text-muted">{tool.description}</p>
                  {isLocked && (
                    <p className="text-xs text-gold mt-2">Requires Core or Full access</p>
                  )}
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

      {activeTool === 'elevator-pitch' && (
        canAccessElevatorPitch(userTier) ? (
          <ElevatorPitchTool
            userProfile={userProfile}
            experiences={experiences}
            skills={skills}
            certifications={certifications}
            onBack={() => setActiveTool(null)}
          />
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setActiveTool(null)} className="text-text-muted hover:text-text">
                ← Back
              </button>
              <h2 className="font-heading text-2xl font-bold uppercase tracking-wider">Elevator Pitch</h2>
            </div>

            {/* Paywall */}
            <Card className="p-8">
              <div className="max-w-lg mx-auto text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gold/20 to-gold/10 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-text mb-2">Elevator Pitch Generator</h3>
                <p className="text-text-muted mb-6">
                  Create a compelling 30-second pitch for networking and interviews.
                  Customize for different contexts: career fairs, networking events, interview openers, and more.
                </p>

                <div className="p-4 bg-bg-tertiary rounded-lg mb-6 text-left">
                  <p className="text-sm text-text-muted mb-2">With Core access, you&apos;ll get:</p>
                  <ul className="space-y-1 text-sm text-text-muted">
                    <li className="flex items-center gap-2">
                      <span className="text-gold">✓</span> 3 Elevator Pitches
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-gold">✓</span> Multiple duration options (30s, 60s, networking)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-gold">✓</span> Context-specific customization
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-gold">✓</span> Practice mode with timer
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={() => window.location.href = '/pricing'}
                  className="px-8"
                >
                  Get Core - $35
                </Button>

                <p className="text-xs text-text-dim mt-3">One-time payment • 30 days access</p>
              </div>
            </Card>
          </div>
        )
      )}
    </div>
  )
}
