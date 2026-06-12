'use client'

import { useState, useRef } from 'react'
import { OnboardingData } from './NewOnboardingWizard'
import { ResumeImportModal } from '@/components/profile/ResumeImportModal'
import { KeySetupModal } from '@/components/settings/KeySetupModal'
import { hasApiKey } from '@/lib/ai/client'
import {
  newId,
  saveAllCertifications,
  saveAllEducation,
  saveAllSkills,
  saveExperiences,
  saveProfile,
} from '@/lib/storage'
import type { Certification, Education, Experience, Profile, Skill } from '@/lib/storage'

interface StepWelcomeProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onSkip: () => void
  jumpToStep: (step: number) => Promise<void>
  saving: boolean
  loadRelatedData: () => void
}

export function StepWelcome({ data, updateData, onNext, onSkip, jumpToStep, saving, loadRelatedData }: StepWelcomeProps) {
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [showKeyModal, setShowKeyModal] = useState(false)
  const jumpToStepRef = useRef(jumpToStep)
  jumpToStepRef.current = jumpToStep
  const [importing, setImporting] = useState(false)
  const [importSuccess, setImportSuccess] = useState(false)
  const [importError, setImportError] = useState('')

  // Resume import uses Claude to parse the file — needs the user's API key.
  const handleImportClick = () => {
    if (hasApiKey()) {
      setShowResumeModal(true)
    } else {
      setShowKeyModal(true)
    }
  }

  const handleResumeImport = async (parsed: any) => {
    setImporting(true)
    setImportError('')

    try {
      // 1. Build profile updates from parsed data
      const profileUpdate: Partial<Profile> = {}
      const wizardUpdates: Partial<OnboardingData> = {}

      // Contact info
      if (parsed.contact) {
        if (parsed.contact.phone) {
          profileUpdate.phone = parsed.contact.phone
          wizardUpdates.phone = parsed.contact.phone
        }
        if (parsed.contact.city) {
          profileUpdate.city = parsed.contact.city
          wizardUpdates.city = parsed.contact.city
        }
        if (parsed.contact.state) {
          profileUpdate.state = parsed.contact.state
          wizardUpdates.state = parsed.contact.state
        }
        if (parsed.contact.linkedin_url) {
          profileUpdate.linkedin_url = parsed.contact.linkedin_url
          wizardUpdates.linkedin_url = parsed.contact.linkedin_url
        }
      }

      // Professional summary
      if (parsed.professional_summary) {
        profileUpdate.professional_summary = parsed.professional_summary
        wizardUpdates.professional_summary = parsed.professional_summary
      }

      // Military info
      if (parsed.military_info) {
        if (parsed.military_info.branch) {
          profileUpdate.branch = parsed.military_info.branch
          wizardUpdates.branch = parsed.military_info.branch
        }
        if (parsed.military_info.rank) {
          profileUpdate.rank = parsed.military_info.rank
          wizardUpdates.rank = parsed.military_info.rank
        }
        if (parsed.military_info.paygrade) {
          profileUpdate.paygrade = parsed.military_info.paygrade
          wizardUpdates.paygrade = parsed.military_info.paygrade
        }
        if (parsed.military_info.years_of_service) {
          profileUpdate.years_of_service = parsed.military_info.years_of_service
          wizardUpdates.years_of_service = String(parsed.military_info.years_of_service)
        }
      }

      // Clearance
      if (parsed.clearance && parsed.clearance !== 'None') {
        const clearanceMap: Record<string, string> = {
          'Confidential': 'confidential',
          'Secret': 'secret',
          'Top Secret': 'top_secret',
          'TS/SCI': 'ts_sci',
        }
        const mapped = clearanceMap[parsed.clearance] || parsed.clearance.toLowerCase()
        profileUpdate.clearance = mapped
        wizardUpdates.clearance = mapped
      }

      // 2. Save profile fields
      if (Object.keys(profileUpdate).length > 0) {
        saveProfile(profileUpdate)
      }

      // 3. Replace experiences (bullets embedded) — full overwrite prevents duplicates
      const experiences: Experience[] = (parsed.experiences || []).map((exp: any, i: number) => {
        const isMilitary = exp.employment_type === 'military'
        const expId = newId()
        return {
          id: expId,
          job_title: exp.job_title,
          civilian_title: exp.civilian_title || exp.job_title,
          organization: isMilitary ? exp.organization : null,
          company_name: !isMilitary ? exp.organization : null,
          location: exp.city && exp.state ? `${exp.city}, ${exp.state}` : null,
          employment_type: exp.employment_type || 'civilian',
          city: exp.city || null,
          state: exp.state || null,
          start_date: exp.start_date || null,
          end_date: exp.is_current ? null : exp.end_date || null,
          is_current: exp.is_current || false,
          sort_order: i,
          hours_per_week: 40,
          bullets: (exp.bullets || []).map((bullet: string, j: number) => ({
            id: newId(),
            experience_id: expId,
            original_text: bullet,
            translated_text: bullet,
            status: 'accepted',
            sort_order: j,
          })),
        }
      })
      saveExperiences(experiences)

      // 4. Replace education (new field names with fallbacks for old names)
      const education: Education[] = (parsed.education || []).map((edu: any, idx: number) => ({
        id: newId(),
        school_name: edu.school_name || edu.institution || null,
        degree_type: edu.degree_type || edu.degree || null,
        field_of_study: edu.field_of_study || null,
        graduation_month: edu.graduation_month || null,
        graduation_year: edu.graduation_year || edu.graduation_date || null,
        gpa: edu.gpa || null,
        sort_order: idx,
      }))
      saveAllEducation(education)

      // 5. Replace certifications (new field names with fallbacks)
      const certifications: Certification[] = (parsed.certifications || []).map((cert: any, idx: number) => ({
        id: newId(),
        name: cert.name,
        issuing_organization: cert.issuing_organization || cert.issuing_org || null,
        issue_date: cert.issue_date || cert.date_earned || null,
        expiration_date: cert.expiration_date || null,
        sort_order: idx,
      }))
      saveAllCertifications(certifications)

      // 6. Replace skills (handle both string[] and object[] formats)
      const skills: Skill[] = (parsed.skills || []).map((skill: any, idx: number) => ({
        id: newId(),
        name: typeof skill === 'string' ? skill : skill.name,
        category: typeof skill === 'string' ? 'general' : (skill.category || 'general'),
        sort_order: idx,
      }))
      saveAllSkills(skills)

      // 7. Update wizard state for profile-level fields
      updateData(wizardUpdates)

      // 8. Refresh related data from storage so all steps see the imported data
      loadRelatedData()

      // 9. Show success banner, then jump to Experience step (step 2)
      setImportSuccess(true)
      setTimeout(() => {
        jumpToStepRef.current(2)
      }, 1500)
    } catch (error) {
      console.error('Resume import error:', error)
      setImportError('Failed to save resume data. Please try again.')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="text-center py-8">
      <div className="mb-8">
        <div className="text-6xl mb-4">&#128587;</div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-wider mb-4">
          {data.first_name ? `Welcome, ${data.first_name}` : 'Welcome to Debriefed'}
        </h1>
        <p className="text-text-muted text-lg max-w-md mx-auto">
          Let&apos;s build your profile so you can create powerful civilian resumes from your military experience.
        </p>
        <p className="text-text-dim text-sm mt-2">Takes about 3 minutes</p>
      </div>

      {importSuccess && (
        <div className="mb-6 p-4 bg-status-green/10 border border-status-green/30 rounded-lg max-w-lg mx-auto">
          <p className="text-status-green font-semibold">&#10003; Resume imported! Let&apos;s verify each section.</p>
        </div>
      )}

      {importError && (
        <div className="mb-6 p-4 bg-status-red/20 border border-status-red/30 rounded-lg max-w-lg mx-auto">
          <p className="text-status-red">{importError}</p>
        </div>
      )}

      {importing && (
        <div className="mb-6 p-4 bg-gold/10 border border-gold/30 rounded-lg max-w-lg mx-auto">
          <p className="text-gold font-semibold flex items-center justify-center gap-2">
            <span className="animate-spin">&#8635;</span>
            Saving resume data to your profile...
          </p>
        </div>
      )}

      <div className="mb-6 p-4 bg-gold/10 border border-gold/30 rounded-lg max-w-lg mx-auto text-left">
        <p className="text-sm text-text-muted">
          <span className="font-semibold text-gold">Your profile is your Base Resume.</span>{' '}
          Fill it out once — Debriefed uses it to build tailored resumes, cover letters, and job match analyses.
        </p>
      </div>

      <div className="bg-bg-card border border-border rounded-lg p-6 mb-8 max-w-lg mx-auto">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
          Choose how to start:
        </h2>

        <div className="space-y-4">
          {/* Option 1: Import Resume */}
          <div className="p-4 bg-bg-tertiary rounded-lg border border-border hover:border-gold/50 transition-colors">
            <button
              onClick={handleImportClick}
              disabled={importing || importSuccess}
              className="w-full text-left flex items-start gap-4 disabled:opacity-50"
            >
              <div className="text-3xl">&#128196;</div>
              <div>
                <h3 className="font-semibold text-gold">I have an existing resume</h3>
                <p className="text-sm text-text-muted mt-1">
                  Upload a PDF or Word document and we&apos;ll extract your info automatically
                  (uses your Anthropic API key)
                </p>
              </div>
            </button>
          </div>

          {/* Option 2: Start Fresh */}
          <div className="p-4 bg-bg-tertiary rounded-lg border border-border hover:border-gold/50 transition-colors">
            <button
              onClick={onNext}
              disabled={saving || importing || importSuccess}
              className="w-full text-left flex items-start gap-4 disabled:opacity-50"
            >
              <div className="text-3xl">&#9997;</div>
              <div>
                <h3 className="font-semibold text-gold">Start fresh</h3>
                <p className="text-sm text-text-muted mt-1">
                  Build your profile step by step - we&apos;ll guide you through it. No API key needed.
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <p className="text-sm text-text-dim max-w-md mx-auto mb-4">
        Your progress is saved automatically — everything stays in this browser.
      </p>

      <div className="text-center">
        <button
          onClick={onSkip}
          disabled={saving}
          className="text-sm text-text-dim hover:text-text-muted hover:underline transition-colors"
        >
          Skip setup — go straight to dashboard
        </button>
      </div>

      <KeySetupModal
        isOpen={showKeyModal}
        onClose={() => setShowKeyModal(false)}
        onKeySaved={() => setShowResumeModal(true)}
        featureNote="Resume import uses Claude to read your existing resume."
      />

      <ResumeImportModal
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
        onImport={handleResumeImport}
      />
    </div>
  )
}
