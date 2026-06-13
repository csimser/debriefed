'use client'

import { useEffect, useState } from 'react'
import { JobMatchWorkspace } from '@/components/job-match/JobMatchWorkspace'
import {
  getProfile,
  listResumes,
  listSkills,
  listCertifications,
  listEducation,
} from '@/lib/storage'
import type { Profile } from '@/lib/storage'

export default function JobMatchPage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [resumes, setResumes] = useState<any[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [certifications, setCertifications] = useState<{ name: string }[]>([])
  const [education, setEducation] = useState<
    { degree_type?: string | null; field_of_study?: string | null; school_name?: string | null }[]
  >([])

  useEffect(() => {
    setProfile(getProfile())
    // Local resumes use `title`; keep `name` populated for component compatibility
    setResumes(listResumes().map((r) => ({ ...r, name: r.title })))
    setSkills(listSkills().map((s) => s.name))
    setCertifications(listCertifications().map((c) => ({ name: c.name })))
    setEducation(
      listEducation().map((e) => ({
        degree_type: e.degree_type,
        field_of_study: e.field_of_study,
        school_name: e.school_name,
      }))
    )
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="h-full -m-8 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-gold/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm text-text-muted">Loading your data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full -m-8">
      <JobMatchWorkspace
        resumes={resumes}
        userProfile={profile}
        userSkills={skills}
        userCertifications={certifications}
        userEducation={education}
      />
    </div>
  )
}
