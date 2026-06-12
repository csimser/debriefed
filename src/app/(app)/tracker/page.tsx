'use client'

import { useEffect, useState } from 'react'
import { ApplicationBoard } from '@/components/tracker/ApplicationBoard'
import { FullPageLoader } from '@/components/ui/FullPageLoader'
import { listApplications, listResumes } from '@/lib/storage'
import type { JobApplication } from '@/lib/storage'

interface BoardApplication extends JobApplication {
  resume_name: string | null
}

interface ResumeOption {
  id: string
  name: string
}

export default function TrackerPage() {
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<BoardApplication[]>([])
  const [resumes, setResumes] = useState<ResumeOption[]>([])

  useEffect(() => {
    const storedResumes = listResumes().map((r) => ({ id: r.id, name: r.title }))
    const resumeMap = Object.fromEntries(storedResumes.map((r) => [r.id, r.name]))

    const storedApplications = listApplications().map((app) => ({
      ...app,
      resume_name: app.resume_id ? resumeMap[app.resume_id] || 'Deleted resume' : null,
    }))

    setResumes(storedResumes)
    setApplications(storedApplications)
    setLoading(false)
  }, [])

  if (loading) {
    return <FullPageLoader message="Loading tracker..." />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wider">
          Application Tracker
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Track your job applications and see which resumes are working
        </p>
      </div>

      <ApplicationBoard
        initialApplications={applications}
        resumes={resumes}
      />
    </div>
  )
}
