'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ExperienceSection } from './sections/ExperienceSection'
import { EducationSection } from './sections/EducationSection'
import { CertificationsSection } from './sections/CertificationsSection'
import { SkillsSection } from './sections/SkillsSection'
import { EvalUploadSection } from './sections/EvalUploadSection'
import { ProfessionalSummaryEditor } from './ProfessionalSummaryEditor'
import { AutosaveIndicator } from '@/components/AutosaveIndicator'
import { useAutosave } from '@/hooks/useAutosave'
import { InternationalPhoneInput } from '@/components/ui/InternationalPhoneInput'
import { toE164 } from '@/lib/formatPhone'
import { buildProfileDataFromForm } from '@/lib/populateTemplate'
import { US_STATES } from '@/lib/constants/states'
import { BRANCHES as MILITARY_BRANCHES, PAYGRADES as MILITARY_PAYGRADES, PAYGRADE_TO_RANK } from '@/lib/constants/military'

interface ProfileFormProps {
  userId: string
  initialData: {
    profile: any
    experiences: any[]
    education: any[]
    certifications: any[]
    skills: any[]
  }
}

// Use consistent military constants (with empty option for select)
const BRANCHES = [
  { value: '', label: 'Select Branch' },
  ...MILITARY_BRANCHES
]

const PAYGRADES = [
  { value: '', label: 'Select Paygrade' },
  ...MILITARY_PAYGRADES.map(p => ({ value: p, label: p }))
]

// Use PAYGRADE_TO_RANK from imported constants for rank auto-fill

const CLEARANCES = [
  { value: '', label: 'Select Clearance' },
  { value: 'none', label: 'None' },
  { value: 'confidential', label: 'Confidential' },
  { value: 'secret', label: 'Secret' },
  { value: 'top_secret', label: 'Top Secret' },
  { value: 'ts_sci', label: 'TS/SCI' },
]

export function ProfileForm({ userId, initialData }: ProfileFormProps) {
  const supabase = createClient()

  // Initialize state from initialData
  const profileData = initialData?.profile || initialData // Support both old and new format

  // DEBUG: Log what we received
  console.log('=== PROFILE FORM DEBUG ===')
  console.log('4. initialData received:', initialData)
  console.log('5. profileData extracted:', profileData)
  console.log('6. profileData.first_name:', profileData?.first_name)

  const [profile, setProfile] = useState({
    first_name: profileData?.first_name || '',
    last_name: profileData?.last_name || '',
    email: profileData?.email || '',
    // Store phone in E.164 format, convert legacy US numbers
    phone: toE164(profileData?.phone || ''),
    city: profileData?.city || '',
    state: profileData?.state || '',
    zip: profileData?.zip || '',
    linkedin_url: profileData?.linkedin_url || '',
    branch: profileData?.branch || '',
    rank: profileData?.rank || '',
    paygrade: profileData?.paygrade || '',
    rating_mos: profileData?.rating_mos || '',
    years_of_service: profileData?.years_of_service || '',
    clearance: profileData?.clearance || '',
    eas_date: profileData?.eas_date || '',
    skillbridge_start: profileData?.skillbridge_start || '',
    skillbridge_end: profileData?.skillbridge_end || '',
    professional_summary: profileData?.professional_summary || '',
    target_industry: profileData?.target_industry || '',
    target_role: profileData?.target_role || '',
  })

  // State for additional sections
  const [experiences, setExperiences] = useState<any[]>(initialData?.experiences || [])
  const [education, setEducation] = useState<any[]>(initialData?.education || [])
  const [certifications, setCertifications] = useState<any[]>(initialData?.certifications || [])
  const [skills, setSkills] = useState<any[]>(initialData?.skills || [])

  // State for pending bullets from eval extraction
  const [pendingBullets, setPendingBullets] = useState<any[]>([])

  // Autosave function
  const saveProfile = useCallback(async (data: typeof profile) => {
    // Note: first_name, last_name, and email are locked after signup
    // Users must contact support to change these fields (prevents account sharing abuse)
    const profilePayload = {
      // Store phone in E.164 format (e.g., +18005551234) for international support
      phone: data.phone || null,
      city: data.city || null,
      state: data.state || null,
      zip: data.zip || null,
      linkedin_url: data.linkedin_url || null,
      branch: data.branch || null,
      rank: data.rank || null,
      paygrade: data.paygrade || null,
      rating_mos: data.rating_mos || null,
      years_of_service: data.years_of_service ? parseInt(String(data.years_of_service)) : null,
      clearance: data.clearance || null,
      eas_date: data.eas_date || null,
      skillbridge_start: data.skillbridge_start || null,
      skillbridge_end: data.skillbridge_end || null,
      professional_summary: data.professional_summary || null,
      target_industry: data.target_industry || null,
      target_role: data.target_role || null,
      updated_at: new Date().toISOString(),
    }

    // DEBUG: Log save attempt
    console.log('=== PROFILE SAVE DEBUG ===')
    console.log('7. Saving to userId:', userId)
    console.log('8. Profile payload:', profilePayload)

    // Use update - profile is auto-created by trigger on user signup
    const result = await supabase
      .from('profiles')
      .update(profilePayload)
      .eq('user_id', userId)
      .select()

    console.log('9. Save result:', result)

    if (result.error) {
      console.error('10. Save ERROR:', result.error)
      throw new Error(result.error.message)
    }
    console.log('11. Save SUCCESS')
  }, [supabase, userId])

  // Hook up autosave (1.5 second debounce)
  const { autosaveStatus, saveNow } = useAutosave(profile, saveProfile, 1500)

  // Warn user if they try to leave while saving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (autosaveStatus.status === 'saving') {
        e.preventDefault()
        e.returnValue = 'Changes are still saving. Are you sure you want to leave?'
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [autosaveStatus.status])

  // Update rank when branch or paygrade changes
  useEffect(() => {
    if (profile.branch && profile.paygrade) {
      const rankName = PAYGRADE_TO_RANK[profile.branch]?.[profile.paygrade]
      if (rankName && rankName !== profile.rank) {
        setProfile(prev => ({ ...prev, rank: rankName }))
      }
    }
  }, [profile.branch, profile.paygrade])

  const updateField = (field: string, value: any) => {
    // Phone is handled by InternationalPhoneInput which returns E.164 format
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  // Build profile data for summary template population
  const profileDataForTemplates = useMemo(() => {
    return buildProfileDataFromForm(profile, certifications)
  }, [profile, certifications])

  const inputClass = "w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25 transition-all"
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2"

  return (
    <div className="space-y-6">
      {/* Autosave Indicator - Fixed at top */}
      <div className="flex items-center justify-between sticky top-4 z-10 bg-bg-primary/80 backdrop-blur-sm py-2 px-4 -mx-4 rounded-lg">
        <h2 className="font-heading text-lg font-bold text-gold uppercase tracking-wider">Profile</h2>
        <div className="flex items-center gap-4">
          <AutosaveIndicator
            status={autosaveStatus.status}
            lastSaved={autosaveStatus.lastSaved}
            error={autosaveStatus.error}
          />
          <button
            type="button"
            onClick={saveNow}
            className="px-4 py-2 bg-bg-tertiary hover:bg-bg-hover border border-border text-text-muted hover:text-text font-semibold rounded text-sm transition-colors"
          >
            Save Now
          </button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-bg-card border border-border rounded-lg p-6">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gold mb-6 flex items-center gap-2">
          <span className="text-lg">&#9670;</span> Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              First Name
              <span className="text-text-dim font-normal ml-2">(Locked)</span>
            </label>
            <input
              type="text"
              value={profile.first_name}
              disabled
              className={`${inputClass} opacity-60 cursor-not-allowed`}
              placeholder="John"
            />
          </div>
          <div>
            <label className={labelClass}>
              Last Name
              <span className="text-text-dim font-normal ml-2">(Locked)</span>
            </label>
            <input
              type="text"
              value={profile.last_name}
              disabled
              className={`${inputClass} opacity-60 cursor-not-allowed`}
              placeholder="Smith"
            />
          </div>
          <div>
            <label className={labelClass}>
              Email
              <span className="text-text-dim font-normal ml-2">(Contact support to change)</span>
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className={`${inputClass} opacity-60 cursor-not-allowed`}
              placeholder="john.smith@email.com"
            />
          </div>
          <div>
            <InternationalPhoneInput
              label="Phone"
              value={profile.phone}
              onChange={(value) => updateField('phone', value)}
              hint="International numbers supported"
            />
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input
              type="text"
              value={profile.city}
              onChange={(e) => updateField('city', e.target.value)}
              className={inputClass}
              placeholder="San Diego"
            />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <select
              value={profile.state}
              onChange={(e) => updateField('state', e.target.value)}
              className={inputClass}
            >
              <option value="">Select State</option>
              {US_STATES.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>ZIP Code</label>
            <input
              type="text"
              value={profile.zip}
              onChange={(e) => updateField('zip', e.target.value)}
              className={inputClass}
              placeholder="92101"
            />
          </div>
          <div>
            <label className={labelClass}>LinkedIn URL</label>
            <input
              type="url"
              value={profile.linkedin_url}
              onChange={(e) => updateField('linkedin_url', e.target.value)}
              className={inputClass}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
        </div>
      </div>

      {/* Military Background */}
      <div className="bg-bg-card border border-border rounded-lg p-6">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gold mb-6 flex items-center gap-2">
          <span className="text-lg">&#9875;</span> Military Background
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Branch</label>
            <select
              value={profile.branch}
              onChange={(e) => updateField('branch', e.target.value)}
              className={inputClass}
            >
              {BRANCHES.map(b => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Paygrade</label>
            <select
              value={profile.paygrade}
              onChange={(e) => updateField('paygrade', e.target.value)}
              className={inputClass}
            >
              {PAYGRADES.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Rank</label>
            <input
              type="text"
              value={profile.rank}
              onChange={(e) => updateField('rank', e.target.value)}
              className={`${inputClass} bg-bg-tertiary`}
              placeholder="Auto-filled based on branch & paygrade"
              readOnly={!!(profile.branch && profile.paygrade)}
            />
            <p className="text-xs text-text-dim mt-1">Auto-fills when you select branch and paygrade</p>
          </div>
          <div>
            <label className={labelClass}>MOS / Rating / AFSC</label>
            <input
              type="text"
              value={profile.rating_mos}
              onChange={(e) => updateField('rating_mos', e.target.value)}
              className={inputClass}
              placeholder="e.g., DC, IT, 11B, 3D0X2"
            />
          </div>
          <div>
            <label className={labelClass}>Years of Service</label>
            <input
              type="number"
              value={profile.years_of_service}
              onChange={(e) => updateField('years_of_service', e.target.value)}
              className={inputClass}
              min="0"
              max="40"
              placeholder="20"
            />
          </div>
          <div>
            <label className={labelClass}>Security Clearance</label>
            <select
              value={profile.clearance}
              onChange={(e) => updateField('clearance', e.target.value)}
              className={inputClass}
            >
              {CLEARANCES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>EAS / EAOS</label>
            <input
              type="date"
              value={profile.eas_date}
              onChange={(e) => updateField('eas_date', e.target.value)}
              className={inputClass}
            />
            <p className="text-xs text-text-dim mt-1">End of Active Service date</p>
          </div>
        </div>

        {/* SkillBridge Availability */}
        <div className="border-t border-border pt-4 mt-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gold mb-1 flex items-center gap-2">
            <span>&#127891;</span> SkillBridge Availability
          </label>
          <p className="text-xs text-text-dim mb-3">Optional - for internship matching with employers</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Available From</label>
              <input
                type="date"
                value={profile.skillbridge_start}
                onChange={(e) => updateField('skillbridge_start', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Available Until</label>
              <input
                type="date"
                value={profile.skillbridge_end}
                onChange={(e) => updateField('skillbridge_end', e.target.value)}
                className={inputClass}
              />
              <p className="text-xs text-text-dim mt-1">Leave blank if not participating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Career Goals */}
      <div className="bg-bg-card border border-border rounded-lg p-6">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gold mb-6 flex items-center gap-2">
          <span className="text-lg">&#127919;</span> Career Goals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Target Industry</label>
            <input
              type="text"
              value={profile.target_industry}
              onChange={(e) => updateField('target_industry', e.target.value)}
              className={inputClass}
              placeholder="e.g., Cybersecurity, Project Management"
            />
          </div>
          <div>
            <label className={labelClass}>Target Role</label>
            <input
              type="text"
              value={profile.target_role}
              onChange={(e) => updateField('target_role', e.target.value)}
              className={inputClass}
              placeholder="e.g., Program Manager, Security Analyst"
            />
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="bg-bg-card border border-border rounded-lg p-6">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gold mb-6 flex items-center gap-2">
          <span className="text-lg">&#128221;</span> Professional Summary
        </h3>
        <ProfessionalSummaryEditor
          value={profile.professional_summary}
          onChange={(value) => updateField('professional_summary', value)}
          profile={profileDataForTemplates}
        />
      </div>

      {/* Experience Section */}
      <ExperienceSection
        userId={userId}
        experiences={experiences}
        onUpdate={setExperiences}
        pendingBullets={pendingBullets}
        onBulletsSaved={() => setPendingBullets([])}
      />

      {/* Education Section */}
      <EducationSection
        userId={userId}
        education={education}
        onUpdate={setEducation}
      />

      {/* Certifications Section */}
      <CertificationsSection
        userId={userId}
        certifications={certifications}
        userMOS={profile.rating_mos}
        onUpdate={setCertifications}
      />

      {/* Skills Section */}
      <SkillsSection
        userId={userId}
        skills={skills}
        paygrade={profile.paygrade}
        ratingMOS={profile.rating_mos}
        onUpdate={setSkills}
      />

      {/* Eval Upload Section */}
      <EvalUploadSection
        userId={userId}
        experiences={experiences}
        onBulletsExtracted={(bullets) => {
          console.log('Bullets extracted:', bullets)
          // Pass bullets to ExperienceSection via pending state
          setPendingBullets(bullets)
        }}
        onExperiencesUpdated={async () => {
          // Refresh experiences from database
          const { data: updatedExp } = await supabase
            .from('experience')
            .select('*, experience_bullets(*)')
            .eq('user_id', userId)
            .order('sort_order')

          if (updatedExp) {
            setExperiences(updatedExp.map(exp => ({ ...exp, bullets: exp.experience_bullets })))
          }
        }}
      />
    </div>
  )
}
