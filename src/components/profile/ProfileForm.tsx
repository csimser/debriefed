'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ExperienceSection } from './sections/ExperienceSection'
import { EducationSection } from './sections/EducationSection'
import { CertificationsSection } from './sections/CertificationsSection'
import { SkillsSection } from './sections/SkillsSection'
import { ProfessionalSummaryEditor } from './ProfessionalSummaryEditor'
import { ResumeImportModal } from './ResumeImportModal'
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

  // State for resume import modal
  const [showResumeImport, setShowResumeImport] = useState(false)

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

  // Handle imported resume data
  const handleResumeImport = async (data: any) => {
    // Update profile fields (only if they're currently empty)
    const updates: any = {}
    if (data.contact) {
      if (!profile.phone && data.contact.phone) updates.phone = data.contact.phone
      if (!profile.city && data.contact.city) updates.city = data.contact.city
      if (!profile.state && data.contact.state) updates.state = data.contact.state
      if (!profile.linkedin_url && data.contact.linkedin_url) updates.linkedin_url = data.contact.linkedin_url
    }
    if (!profile.professional_summary && data.professional_summary) {
      updates.professional_summary = data.professional_summary
    }
    if (data.military_info) {
      if (!profile.branch && data.military_info.branch) updates.branch = data.military_info.branch
      if (!profile.rank && data.military_info.rank) updates.rank = data.military_info.rank
      if (!profile.years_of_service && data.military_info.years_of_service) {
        updates.years_of_service = String(data.military_info.years_of_service)
      }
    }
    if (!profile.clearance && data.clearance) {
      const clearanceMap: Record<string, string> = {
        'None': 'none',
        'Confidential': 'confidential',
        'Secret': 'secret',
        'Top Secret': 'top_secret',
        'TS/SCI': 'ts_sci',
      }
      updates.clearance = clearanceMap[data.clearance] || data.clearance.toLowerCase()
    }

    if (Object.keys(updates).length > 0) {
      setProfile(prev => ({ ...prev, ...updates }))
    }

    // Import experiences
    if (data.experiences && data.experiences.length > 0) {
      const expToInsert = data.experiences.map((exp: any, idx: number) => ({
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
        sort_order: idx,
      }))

      for (const exp of expToInsert) {
        const bullets = data.experiences.find((e: any) => e.job_title === exp.job_title)?.bullets || []

        const { data: insertedExp, error } = await supabase
          .from('experience')
          .insert(exp)
          .select()
          .single()

        if (!error && insertedExp && bullets.length > 0) {
          // Insert bullets for this experience
          const bulletsToInsert = bullets.map((text: string, bIdx: number) => ({
            experience_id: insertedExp.id,
            original_text: text,
            translated_text: text,
            sort_order: bIdx,
            status: 'accepted',
          }))
          await supabase.from('experience_bullets').insert(bulletsToInsert)
        }
      }

      // Refresh experiences
      const { data: updatedExp } = await supabase
        .from('experience')
        .select('*, experience_bullets(*)')
        .eq('user_id', userId)
        .order('sort_order')

      if (updatedExp) {
        setExperiences(updatedExp.map(exp => ({ ...exp, bullets: exp.experience_bullets })))
      }
    }

    // Import education
    if (data.education && data.education.length > 0) {
      const eduToInsert = data.education.map((edu: any, idx: number) => ({
        user_id: userId,
        degree: edu.degree,
        field_of_study: edu.field_of_study,
        institution: edu.institution,
        graduation_date: edu.graduation_date,
        gpa: edu.gpa,
        sort_order: idx,
      }))
      await supabase.from('education').insert(eduToInsert)

      const { data: updatedEdu } = await supabase
        .from('education')
        .select('*')
        .eq('user_id', userId)
        .order('sort_order')
      if (updatedEdu) setEducation(updatedEdu)
    }

    // Import certifications
    if (data.certifications && data.certifications.length > 0) {
      const certsToInsert = data.certifications.map((cert: any, idx: number) => ({
        user_id: userId,
        name: cert.name,
        issuer: cert.issuing_org,
        date_earned: cert.date_earned,
        expiration_date: cert.expiration_date,
        sort_order: idx,
      }))
      await supabase.from('certifications').insert(certsToInsert)

      const { data: updatedCerts } = await supabase
        .from('certifications')
        .select('*')
        .eq('user_id', userId)
        .order('sort_order')
      if (updatedCerts) setCertifications(updatedCerts)
    }

    // Import skills
    if (data.skills && data.skills.length > 0) {
      const skillsToInsert = data.skills.map((skill: string, idx: number) => ({
        user_id: userId,
        name: skill,
        proficiency_level: 3,
        sort_order: idx,
      }))
      await supabase.from('skills').insert(skillsToInsert)

      const { data: updatedSkills } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', userId)
        .order('sort_order')
      if (updatedSkills) setSkills(updatedSkills)
    }
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
          <button
            type="button"
            onClick={() => setShowResumeImport(true)}
            className="flex items-center gap-2 px-4 py-2 bg-status-green/20 hover:bg-status-green/30 border border-status-green/30 text-status-green font-semibold rounded text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Import Resume
          </button>
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

      {/* Resume Import Modal */}
      <ResumeImportModal
        isOpen={showResumeImport}
        onClose={() => setShowResumeImport(false)}
        onImport={handleResumeImport}
      />
    </div>
  )
}
