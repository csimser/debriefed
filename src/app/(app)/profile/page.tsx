'use client'

import { useCallback, useEffect, useState } from 'react'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { EvalHistorySection } from '@/components/eval/EvalHistorySection'
import { FullPageLoader } from '@/components/ui/FullPageLoader'
import {
  getProfile,
  listExperiences,
  listEducation,
  listCertifications,
  listSkills,
  listEvalUploads,
  type Profile,
  type Experience,
  type Education,
  type Certification,
  type Skill,
  type EvalUpload,
} from '@/lib/storage'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [evalUploads, setEvalUploads] = useState<EvalUpload[]>([])

  const loadData = useCallback(() => {
    setProfile(getProfile())
    setExperiences(listExperiences())
    setEducation(listEducation())
    setCertifications(listCertifications())
    setSkills(listSkills())
    setEvalUploads(listEvalUploads())
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) {
    return <FullPageLoader message="Loading profile..." />
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wider">My Profile</h1>
          <p className="text-text-muted text-sm mt-1">This is your Base Resume — all resumes and career tools pull from this data</p>
        </div>
      </div>
      <ProfileForm
        initialData={{
          profile: profile || {},
          experiences,
          education,
          certifications,
          skills,
        }}
        userBranch={profile?.branch || ''}
      />

      {/* Eval Upload History — shows past uploads with re-import capability */}
      {evalUploads.length > 0 && (
        <div className="mt-8">
          <EvalHistorySection
            uploads={evalUploads}
            experiences={experiences}
            onImportComplete={loadData}
          />
        </div>
      )}
    </div>
  )
}
