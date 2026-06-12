'use client'

import { useEffect, useState } from 'react'
import { ResumeEditor } from '@/components/resume/ResumeEditor'
import { FullPageLoader } from '@/components/ui/FullPageLoader'
import {
  getProfile,
  listResumes,
  listExperiences,
  listEducation,
  listCertifications,
  listSkills,
} from '@/lib/storage'
import type { Certification, Education, Experience, Profile, Resume, Skill } from '@/lib/storage'

interface PageData {
  resumes: Resume[]
  userProfile: Profile | Record<string, never>
  experiences: Experience[]
  education: Education[]
  certifications: Certification[]
  skills: Skill[]
}

export default function ResumesPage() {
  const [data, setData] = useState<PageData | null>(null)

  useEffect(() => {
    setData({
      resumes: listResumes(),
      userProfile: getProfile() || {},
      // Bullets are embedded on each experience in local storage
      experiences: listExperiences(),
      education: listEducation(),
      certifications: listCertifications(),
      skills: listSkills(),
    })
  }, [])

  if (!data) {
    return <FullPageLoader message="Loading resumes..." />
  }

  return (
    <div className="h-[calc(100vh-90px)] -mx-4 md:-mx-6 lg:-mx-8 -mb-4">
      <ResumeEditor
        resumes={data.resumes}
        profileData={{
          userProfile: data.userProfile,
          experiences: data.experiences,
          education: data.education,
          certifications: data.certifications,
          skills: data.skills,
        }}
      />
    </div>
  )
}
