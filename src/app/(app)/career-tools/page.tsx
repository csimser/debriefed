'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { CareerToolsHub } from '@/components/career-tools/CareerToolsHub'
import { EvalHistorySection } from '@/components/eval/EvalHistorySection'
import { DictionaryIntroModal } from '@/components/dictionary/DictionaryIntroModal'
import {
  getProfile,
  listExperiences,
  listEducation,
  listCertifications,
  listSkills,
  listEvalUploads,
  getSettings,
  type Profile,
  type Experience,
  type Education,
  type Certification,
  type EvalUpload,
} from '@/lib/storage'

export default function CareerToolsPage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [evalUploads, setEvalUploads] = useState<EvalUpload[]>([])
  const [showDictionaryIntro, setShowDictionaryIntro] = useState(false)

  const loadData = useCallback(() => {
    setProfile(getProfile())
    setExperiences(listExperiences().slice(0, 3))
    setSkills(listSkills().map(s => s.name))
    setCertifications(listCertifications())
    setEducation(listEducation())
    setEvalUploads(listEvalUploads())
  }, [])

  useEffect(() => {
    loadData()
    setShowDictionaryIntro(getSettings().dictionary_intro_shown !== true)
    setLoading(false)
  }, [loadData])

  if (loading) {
    return (
      <div className="animate-fade-in space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-bg-card rounded w-1/3" />
          <div className="h-40 bg-bg-card rounded-xl" />
          <div className="h-64 bg-bg-card rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-4">
      <Suspense fallback={null}>
        <CareerToolsHub
          userProfile={profile || {}}
          experiences={experiences}
          skills={skills}
          certifications={certifications}
          education={education}
        />
      </Suspense>

      {evalUploads.length > 0 && (
        <EvalHistorySection
          uploads={evalUploads}
          onImportComplete={loadData}
        />
      )}

      {/* Dictionary Intro Modal — shown on first visit to career tools */}
      {showDictionaryIntro && <DictionaryIntroModal />}
    </div>
  )
}
