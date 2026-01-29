'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { OnboardingData } from './NewOnboardingWizard'

interface StepWelcomeProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  jumpToStep: (step: number) => void
  saving: boolean
  userId: string
  supabase: any
}

export function StepWelcome({ data, updateData, onNext, jumpToStep, saving, userId, supabase }: StepWelcomeProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [showUploadOption, setShowUploadOption] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a PDF or DOCX file')
      return
    }

    setUploading(true)
    setUploadError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/import-resume', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to parse resume')
      }

      const result = await response.json()

      if (result.data) {
        const parsed = result.data

        // Update onboarding data with parsed resume info
        const updates: Partial<OnboardingData> = {}

        // Contact info (excluding locked fields)
        if (parsed.contact) {
          if (parsed.contact.phone) updates.phone = parsed.contact.phone
          if (parsed.contact.city) updates.city = parsed.contact.city
          if (parsed.contact.state) updates.state = parsed.contact.state
          if (parsed.contact.linkedin_url) updates.linkedin_url = parsed.contact.linkedin_url
        }

        // Professional summary
        if (parsed.professional_summary) {
          updates.professional_summary = parsed.professional_summary
        }

        // Military info
        if (parsed.military_info) {
          if (parsed.military_info.branch) updates.branch = parsed.military_info.branch
          if (parsed.military_info.rank) updates.rank = parsed.military_info.rank
          if (parsed.military_info.years_of_service) {
            updates.years_of_service = String(parsed.military_info.years_of_service)
          }
        }

        // Clearance
        if (parsed.clearance) {
          const clearanceMap: Record<string, string> = {
            'None': 'none',
            'Confidential': 'confidential',
            'Secret': 'secret',
            'Top Secret': 'top_secret',
            'TS/SCI': 'ts_sci',
          }
          updates.clearance = clearanceMap[parsed.clearance] || parsed.clearance.toLowerCase()
        }

        updateData(updates)

        // Save experiences to database
        if (parsed.experiences && parsed.experiences.length > 0) {
          for (let i = 0; i < parsed.experiences.length; i++) {
            const exp = parsed.experiences[i]
            const { data: insertedExp, error } = await supabase
              .from('experience')
              .insert({
                user_id: userId,
                employment_type: exp.employment_type || 'civilian',
                job_title: exp.job_title,
                civilian_title: exp.civilian_title || exp.job_title,
                organization: exp.organization,
                company_name: exp.employment_type === 'civilian' ? exp.organization : null,
                city: exp.city,
                state: exp.state,
                location: exp.city && exp.state ? `${exp.city}, ${exp.state}` : null,
                start_date: exp.start_date,
                end_date: exp.is_current ? null : exp.end_date,
                is_current: exp.is_current || false,
                hours_per_week: 40,
                sort_order: i,
              })
              .select()
              .single()

            // Add bullets if present
            if (!error && insertedExp && exp.bullets?.length > 0) {
              const bulletsToInsert = exp.bullets.map((text: string, idx: number) => ({
                experience_id: insertedExp.id,
                original_text: text,
                translated_text: text,
                sort_order: idx,
                status: 'accepted',
              }))
              await supabase.from('experience_bullets').insert(bulletsToInsert)
            }
          }
        }

        // Save education
        if (parsed.education && parsed.education.length > 0) {
          const eduToInsert = parsed.education.map((edu: any, idx: number) => ({
            user_id: userId,
            school_name: edu.institution || edu.school_name,
            degree_type: edu.degree_type || null,
            field_of_study: edu.field_of_study || null,
            graduation_year: edu.graduation_year || null,
            gpa: edu.gpa || null,
            sort_order: idx,
          }))
          await supabase.from('education').insert(eduToInsert)
        }

        // Save certifications
        if (parsed.certifications && parsed.certifications.length > 0) {
          const certsToInsert = parsed.certifications.map((cert: any, idx: number) => ({
            user_id: userId,
            name: cert.name,
            issuing_organization: cert.issuing_org || null,
            issue_date: cert.date_earned || null,
            expiration_date: cert.expiration_date || null,
            sort_order: idx,
          }))
          await supabase.from('certifications').insert(certsToInsert)
        }

        // Save skills
        if (parsed.skills && parsed.skills.length > 0) {
          const skillsToInsert = parsed.skills.map((skill: string, idx: number) => ({
            user_id: userId,
            name: skill,
            category: 'general',
            sort_order: idx,
          }))
          await supabase.from('skills').insert(skillsToInsert)
        }

        // Jump to summary step (step 6)
        jumpToStep(6)
      }
    } catch (error) {
      console.error('Resume upload error:', error)
      setUploadError('Failed to parse resume. Please try again or start fresh.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="text-center py-8">
      <div className="mb-8">
        <div className="text-6xl mb-4">&#128587;</div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-wider mb-4">
          Welcome to Debriefed
        </h1>
        <p className="text-text-muted text-lg max-w-md mx-auto">
          Let's build your profile so you can create powerful civilian resumes from your military experience.
        </p>
      </div>

      <div className="bg-bg-card border border-border rounded-lg p-6 mb-8 max-w-lg mx-auto">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
          Choose how to start:
        </h2>

        <div className="space-y-4">
          {/* Option 1: Import Resume */}
          <div className="p-4 bg-bg-tertiary rounded-lg border border-border hover:border-gold/50 transition-colors">
            {!showUploadOption ? (
              <button
                onClick={() => setShowUploadOption(true)}
                className="w-full text-left flex items-start gap-4"
              >
                <div className="text-3xl">&#128196;</div>
                <div>
                  <h3 className="font-semibold text-gold">I have an existing resume</h3>
                  <p className="text-sm text-text-muted mt-1">
                    Upload a PDF or Word document and we'll extract your info automatically
                  </p>
                </div>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="text-2xl">&#128196;</div>
                  <span className="font-semibold text-gold">Upload Resume</span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full py-4 border-2 border-dashed border-border rounded-lg hover:border-gold/50 transition-colors"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2 text-text-muted">
                      <span className="animate-spin">&#8635;</span>
                      Processing your resume...
                    </span>
                  ) : (
                    <span className="text-text-muted">
                      Click to select PDF or DOCX file
                    </span>
                  )}
                </button>

                {uploadError && (
                  <p className="text-sm text-status-red">{uploadError}</p>
                )}

                <button
                  onClick={() => setShowUploadOption(false)}
                  className="text-xs text-text-dim hover:text-text-muted"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Option 2: Start Fresh */}
          <div className="p-4 bg-bg-tertiary rounded-lg border border-border hover:border-gold/50 transition-colors">
            <button
              onClick={onNext}
              disabled={saving || uploading}
              className="w-full text-left flex items-start gap-4"
            >
              <div className="text-3xl">&#9997;</div>
              <div>
                <h3 className="font-semibold text-gold">Start fresh</h3>
                <p className="text-sm text-text-muted mt-1">
                  Build your profile step by step - we'll guide you through it
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <p className="text-sm text-text-dim max-w-md mx-auto">
        This will take about 5-10 minutes. Your progress is saved automatically.
      </p>
    </div>
  )
}
