'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatFullDegree, getSchoolName, formatGraduationDate } from '@/lib/utils/formatResume'
import { ProfessionalSummaryEditor } from './ProfessionalSummaryEditor'
import { buildProfileDataFromForm } from '@/lib/populateTemplate'
import { InternationalPhoneInput } from '@/components/ui/InternationalPhoneInput'

interface ResumeFormProps {
  resumeId: string
  content: any
  resumeType: 'private' | 'federal'
  onChange: (content: any) => void
  userProfile: any
  profileSummary?: string
  allSkills?: any[]
  allCertifications?: any[]
  bulletTranslationUsage?: number
  bulletTranslationLimit?: number
}

// Federal resume option maps
const CITIZENSHIP_OPTIONS = [
  { value: '', label: 'Select...' },
  { value: 'us_citizen', label: 'U.S. Citizen' },
  { value: 'permanent_resident', label: 'Permanent Resident' },
  { value: 'other', label: 'Other' },
]

const VETERANS_PREFERENCE_OPTIONS = [
  { value: '', label: 'Select...' },
  { value: 'none', label: 'No Preference' },
  { value: '5_point', label: '5-Point Preference (TP)' },
  { value: '10_point', label: '10-Point Preference (CP/CPS/XP)' },
  { value: '10_point_30_percent', label: '10-Point/30% or More Disabled' },
]

const CLEARANCE_OPTIONS = [
  { value: '', label: 'Select...' },
  { value: 'none', label: 'None' },
  { value: 'public_trust', label: 'Public Trust' },
  { value: 'secret', label: 'Secret' },
  { value: 'top_secret', label: 'Top Secret' },
  { value: 'top_secret_sci', label: 'Top Secret/SCI' },
]

const CLEARANCE_STATUS_OPTIONS = [
  { value: '', label: 'Select...' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'expired', label: 'Expired' },
]

export function ResumeForm({ resumeId, content, resumeType, onChange, userProfile, profileSummary, allSkills = [], allCertifications = [], bulletTranslationUsage = 0, bulletTranslationLimit = 999 }: ResumeFormProps) {
  const bulletTranslationRemaining = bulletTranslationLimit - bulletTranslationUsage
  const updateContent = (key: string, value: any) => {
    onChange({ ...content, [key]: value })
  }

  // Build profile data for template population
  const profileDataForTemplates = buildProfileDataFromForm({
    branch: userProfile?.branch || '',
    rank: userProfile?.rank || '',
    paygrade: userProfile?.paygrade || '',
    years_of_service: userProfile?.years_of_service || '',
    rating_mos: userProfile?.rating_mos || '',
    clearance: userProfile?.clearance || '',
    target_industry: userProfile?.target_industry || '',
    target_role: userProfile?.target_role || '',
  }, [])

  return (
    <div className="space-y-6">
      {/* Contact Info */}
      <FormSection title="Contact Information" icon="◎">
        {/* Stack vertically on mobile, 2 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name - Locked to profile */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              Full Name
              <svg className="w-3 h-3 inline ml-1 text-text-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </label>
            <div className="w-full bg-bg-tertiary/50 border border-border rounded-lg px-4 py-3 text-white/70 cursor-not-allowed">
              {userProfile?.first_name || ''} {userProfile?.last_name || ''}
            </div>
            <p className="text-xs text-text-dim mt-1">
              Edit in your <a href="/profile" className="text-gold hover:underline">Profile</a>
            </p>
          </div>

          {/* Email - Locked to profile */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              Email
              <svg className="w-3 h-3 inline ml-1 text-text-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </label>
            <div className="w-full bg-bg-tertiary/50 border border-border rounded-lg px-4 py-3 text-white/70 cursor-not-allowed">
              {userProfile?.email || ''}
            </div>
            <p className="text-xs text-text-dim mt-1">
              Contact support to update
            </p>
          </div>

          <InternationalPhoneInput
            label="Phone"
            value={content.contact?.phone || ''}
            onChange={(phone) => updateContent('contact', { ...content.contact, phone })}
          />
          <Input
            label="Location"
            value={`${content.contact?.city || ''}, ${content.contact?.state || ''}`}
            onChange={(e) => {
              const [city, state] = e.target.value.split(', ')
              updateContent('contact', { ...content.contact, city, state })
            }}
          />
          {content.contact?.linkedin_url && (
            <Input
              label="LinkedIn"
              value={content.contact.linkedin_url}
              onChange={(e) => updateContent('contact', { ...content.contact, linkedin_url: e.target.value })}
            />
          )}
        </div>
      </FormSection>

      {/* Professional Summary */}
      <ProfessionalSummaryEditor
        resumeId={resumeId}
        summary={content.summary || ''}
        profileSummary={profileSummary}
        profile={profileDataForTemplates}
        onUpdate={(summary) => updateContent('summary', summary)}
      />

      {/* Experience */}
      <FormSection title="Experience" icon="◫" badge={
        <Badge variant={bulletTranslationRemaining <= 1 ? 'red' : bulletTranslationRemaining <= 3 ? 'amber' : 'default'}>
          {bulletTranslationRemaining} Translations Left
        </Badge>
      }>
        <div className="space-y-4">
          {content.experiences?.map((exp: any, idx: number) => (
            <ExperienceItem
              key={exp.id || idx}
              experience={exp}
              resumeType={resumeType}
              onChange={(updated) => {
                const newExps = [...content.experiences]
                newExps[idx] = updated
                updateContent('experiences', newExps)
              }}
              onDelete={() => {
                const newExps = content.experiences.filter((_: any, i: number) => i !== idx)
                updateContent('experiences', newExps)
              }}
              userProfile={userProfile}
              translationRemaining={bulletTranslationRemaining}
            />
          ))}
          {(!content.experiences || content.experiences.length === 0) && (
            <p className="text-text-muted text-center py-4">No experience added. Add experience in your <a href="/profile" className="text-gold hover:underline">Profile</a> first.</p>
          )}
        </div>
      </FormSection>

      {/* Education */}
      <FormSection title="Education" icon="◇">
        <div className="space-y-3">
          {content.education?.map((edu: any, idx: number) => (
            <EducationItem
              key={edu.id || idx}
              education={edu}
              onChange={(updated) => {
                const newEdu = [...content.education]
                newEdu[idx] = updated
                updateContent('education', newEdu)
              }}
              onDelete={() => {
                const newEdu = content.education.filter((_: any, i: number) => i !== idx)
                updateContent('education', newEdu)
              }}
            />
          ))}
          {(!content.education || content.education.length === 0) && (
            <p className="text-text-muted text-center py-4">No education added. Add in your <a href="/profile" className="text-gold hover:underline">Profile</a>.</p>
          )}
        </div>
      </FormSection>

      {/* Skills */}
      <SkillCertSelector
        title="Skills"
        icon="◆"
        allItems={allSkills}
        selectedItems={content.skills || []}
        onChange={(skills) => updateContent('skills', skills)}
        renderLabel={(item) => item.name}
      />

      {/* Certifications */}
      <SkillCertSelector
        title="Certifications"
        icon="✦"
        allItems={allCertifications}
        selectedItems={content.certifications || []}
        onChange={(certs) => updateContent('certifications', certs)}
        renderLabel={(item) => item.issuing_organization ? `${item.name} - ${item.issuing_organization}` : item.name}
      />

      {/* Federal Resume Extra Fields - Only for federal resumes */}
      {resumeType === 'federal' && (
        <FormSection title="Federal Resume Details" icon="★">
          <div className="p-4 bg-status-amber-dim border border-status-amber/20 rounded-lg mb-4">
            <p className="text-sm text-status-amber">
              Federal resumes require additional details. Make sure each experience includes hours/week, supervisor info, and salary.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Citizenship */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Citizenship Status
              </label>
              <select
                value={content.citizenship || ''}
                onChange={(e) => updateContent('citizenship', e.target.value)}
                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold/25"
              >
                {CITIZENSHIP_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Veterans Preference */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Veterans Preference
              </label>
              <select
                value={content.veterans_preference || ''}
                onChange={(e) => updateContent('veterans_preference', e.target.value)}
                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold/25"
              >
                {VETERANS_PREFERENCE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Security Clearance */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Security Clearance
              </label>
              <select
                value={content.security_clearance || userProfile?.clearance || ''}
                onChange={(e) => updateContent('security_clearance', e.target.value)}
                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold/25"
              >
                {CLEARANCE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Clearance Status */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Clearance Status
              </label>
              <select
                value={content.clearance_status || ''}
                onChange={(e) => updateContent('clearance_status', e.target.value)}
                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold/25"
              >
                {CLEARANCE_STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Federal Status (GS level, etc.) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Federal Status
              </label>
              <input
                type="text"
                value={content.federal_status || ''}
                onChange={(e) => updateContent('federal_status', e.target.value)}
                placeholder="e.g., N/A, GS-12, WG-10"
                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-3 text-white focus:border-gold focus:ring-1 focus:ring-gold/25"
              />
              <p className="text-xs text-text-dim mt-1">
                Enter your current or most recent federal pay grade if applicable
              </p>
            </div>
          </div>
        </FormSection>
      )}
    </div>
  )
}

function FormSection({ title, icon, children, badge }: { title: string; icon: string; children: React.ReactNode; badge?: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-gold">{icon}</span>
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider">{title}</h3>
        </div>
        {badge}
      </div>
      {children}
    </div>
  )
}

function SkillCertSelector({
  title,
  icon,
  allItems,
  selectedItems,
  onChange,
  renderLabel,
}: {
  title: string
  icon: string
  allItems: any[]
  selectedItems: any[]
  onChange: (items: any[]) => void
  renderLabel: (item: any) => string
}) {
  // Match by name (stable) not ID (changes on re-import)
  const selectedNames = new Set(
    selectedItems.map((s: any) => (typeof s === 'string' ? s : s.name)?.toLowerCase())
  )

  const isItemSelected = (item: any) => selectedNames.has(item.name?.toLowerCase())

  const toggle = (item: any) => {
    if (isItemSelected(item)) {
      // Remove by name match
      onChange(selectedItems.filter((s: any) => {
        const sName = (typeof s === 'string' ? s : s.name)?.toLowerCase()
        return sName !== item.name?.toLowerCase()
      }))
    } else {
      // Add the canonical item from allItems (current DB record with valid ID)
      onChange([...selectedItems.filter((s: any) => {
        const sName = (typeof s === 'string' ? s : s.name)?.toLowerCase()
        return sName !== item.name?.toLowerCase()
      }), item])
    }
  }

  const selectAll = () => onChange([...allItems])
  const deselectAll = () => onChange([])

  // Count how many allItems are selected (by name match)
  const selectedCount = allItems.filter(isItemSelected).length

  if (allItems.length === 0) {
    return (
      <FormSection title={title} icon={icon}>
        <p className="text-text-muted">No {title.toLowerCase()} added. Add them in your <a href="/profile" className="text-gold hover:underline">Profile</a>.</p>
      </FormSection>
    )
  }

  return (
    <FormSection title={title} icon={icon}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-text-muted">
          {selectedCount} of {allItems.length} selected
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAll}
            disabled={selectedCount === allItems.length}
            className="text-xs text-gold hover:underline disabled:opacity-40 disabled:no-underline"
          >
            Select All
          </button>
          <span className="text-text-dim">|</span>
          <button
            type="button"
            onClick={deselectAll}
            disabled={selectedCount === 0}
            className="text-xs text-text-muted hover:underline disabled:opacity-40 disabled:no-underline"
          >
            Deselect All
          </button>
        </div>
      </div>
      <div className="space-y-1">
        {allItems.map((item: any) => {
          const isSelected = isItemSelected(item)
          return (
            <label
              key={item.id}
              className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-gold/10 border border-gold/30'
                  : 'bg-bg-tertiary border border-transparent hover:border-border'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggle(item)}
                className="accent-gold w-4 h-4 shrink-0"
              />
              <span className={`text-sm ${isSelected ? 'text-text' : 'text-text-muted'}`}>
                {renderLabel(item)}
              </span>
            </label>
          )
        })}
      </div>
    </FormSection>
  )
}

function ExperienceItem({ experience, resumeType, onChange, onDelete, userProfile, translationRemaining = 999 }: {
  experience: any
  resumeType: 'private' | 'federal'
  onChange: (exp: any) => void
  onDelete: () => void
  userProfile: any
  translationRemaining?: number
}) {
  const [translating, setTranslating] = useState<string | null>(null)
  const [editingBulletIdx, setEditingBulletIdx] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [editingHeader, setEditingHeader] = useState(false)
  const [headerForm, setHeaderForm] = useState({
    job_title: experience.job_title || '',
    civilian_title: experience.civilian_title || '',
    organization: experience.organization || '',
    start_date: experience.start_date || '',
    end_date: experience.end_date || '',
    is_current: experience.is_current || false,
  })

  const handleStartEdit = (bulletIdx: number, text: string) => {
    setEditingBulletIdx(bulletIdx)
    setEditText(text)
  }

  const handleSaveEdit = (bulletIdx: number) => {
    const newBullets = [...(experience.bullets || [])]
    newBullets[bulletIdx] = {
      ...newBullets[bulletIdx],
      translated_text: editText,
      status: 'accepted',
    }
    onChange({ ...experience, bullets: newBullets })
    setEditingBulletIdx(null)
    setEditText('')
  }

  const handleCancelEdit = () => {
    setEditingBulletIdx(null)
    setEditText('')
  }

  const handleAddBullet = () => {
    const newBullets = [...(experience.bullets || [])]
    const newBullet = {
      id: `new-${Date.now()}`,
      original_text: '',
      translated_text: '',
      status: 'pending',
    }
    newBullets.push(newBullet)
    onChange({ ...experience, bullets: newBullets })
    // Start editing the new bullet with empty text
    handleStartEdit(newBullets.length - 1, '')
  }

  const handleDeleteBullet = (bulletIdx: number) => {
    if (!confirm('Delete this bullet permanently?')) return
    const newBullets = (experience.bullets || []).filter((_: any, idx: number) => idx !== bulletIdx)
    onChange({ ...experience, bullets: newBullets })
  }

  const handleTranslateBullet = async (bulletIdx: number, originalText: string) => {
    setTranslating(bulletIdx.toString())

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullet: originalText,
          context: {
            branch: userProfile?.branch || 'navy',
            rank: userProfile?.rank || '',
            jobType: resumeType,
          },
        }),
      })

      const data = await res.json()

      if (data.translated) {
        const newBullets = [...(experience.bullets || [])]
        newBullets[bulletIdx] = {
          ...newBullets[bulletIdx],
          translated_text: data.translated,
        }
        onChange({ ...experience, bullets: newBullets })
      }
    } catch (error) {
      console.error('Translation error:', error)
    } finally {
      setTranslating(null)
    }
  }

  const handleAcceptBullet = (bulletIdx: number) => {
    const newBullets = [...(experience.bullets || [])]
    newBullets[bulletIdx] = {
      ...newBullets[bulletIdx],
      status: 'accepted',
    }
    onChange({ ...experience, bullets: newBullets })
  }

  const handleExcludeBullet = (bulletIdx: number) => {
    const newBullets = [...(experience.bullets || [])]
    newBullets[bulletIdx] = {
      ...newBullets[bulletIdx],
      status: 'excluded',
    }
    onChange({ ...experience, bullets: newBullets })
  }

  const handleIncludeBullet = (bulletIdx: number) => {
    const newBullets = [...(experience.bullets || [])]
    newBullets[bulletIdx] = {
      ...newBullets[bulletIdx],
      status: 'pending',
    }
    onChange({ ...experience, bullets: newBullets })
  }

  const handleSaveHeader = () => {
    onChange({ ...experience, ...headerForm })
    setEditingHeader(false)
  }

  const handleCancelHeader = () => {
    setHeaderForm({
      job_title: experience.job_title || '',
      civilian_title: experience.civilian_title || '',
      organization: experience.organization || '',
      start_date: experience.start_date || '',
      end_date: experience.end_date || '',
      is_current: experience.is_current || false,
    })
    setEditingHeader(false)
  }

  const handleDeleteExperience = () => {
    if (!confirm('Remove this experience from the resume?')) return
    onDelete()
  }

  // Separate active and excluded bullets
  const activeBullets = (experience.bullets || []).map((b: any, idx: number) => ({ ...b, _idx: idx })).filter((b: any) => b.status !== 'excluded')
  const excludedBullets = (experience.bullets || []).map((b: any, idx: number) => ({ ...b, _idx: idx })).filter((b: any) => b.status === 'excluded')

  // Count pending bullets that can be accepted (have translated text but not yet accepted)
  const pendingBullets = activeBullets.filter(
    (b: any) => b.translated_text && b.status !== 'accepted'
  )

  // Accept all pending bullets
  const handleAcceptAll = () => {
    const newBullets = [...(experience.bullets || [])]
    newBullets.forEach((bullet, idx) => {
      if (bullet.translated_text && bullet.status !== 'accepted' && bullet.status !== 'excluded') {
        newBullets[idx] = {
          ...bullet,
          status: 'accepted',
        }
      }
    })
    onChange({ ...experience, bullets: newBullets })
  }

  // Exclude all pending bullets
  const handleExcludeAll = () => {
    const newBullets = [...(experience.bullets || [])]
    newBullets.forEach((bullet, idx) => {
      if (bullet.status !== 'excluded' && bullet.status !== 'accepted') {
        newBullets[idx] = {
          ...bullet,
          status: 'excluded',
        }
      }
    })
    onChange({ ...experience, bullets: newBullets })
  }

  return (
    <Card className="p-4 bg-bg-tertiary">
      <div className="flex justify-between items-start mb-3">
        {editingHeader ? (
          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Job Title</label>
                <input
                  type="text"
                  value={headerForm.job_title}
                  onChange={(e) => setHeaderForm({ ...headerForm, job_title: e.target.value })}
                  className="w-full px-3 py-2 bg-bg-secondary border border-border rounded text-sm focus:border-gold focus:ring-1 focus:ring-gold/25"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Organization</label>
                <input
                  type="text"
                  value={headerForm.organization}
                  onChange={(e) => setHeaderForm({ ...headerForm, organization: e.target.value })}
                  className="w-full px-3 py-2 bg-bg-secondary border border-border rounded text-sm focus:border-gold focus:ring-1 focus:ring-gold/25"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Civilian Title</label>
                <input
                  type="text"
                  value={headerForm.civilian_title}
                  onChange={(e) => setHeaderForm({ ...headerForm, civilian_title: e.target.value })}
                  className="w-full px-3 py-2 bg-bg-secondary border border-border rounded text-sm focus:border-gold focus:ring-1 focus:ring-gold/25"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Start Date</label>
                <input
                  type="month"
                  value={headerForm.start_date}
                  onChange={(e) => setHeaderForm({ ...headerForm, start_date: e.target.value })}
                  className="w-full px-3 py-2 bg-bg-secondary border border-border rounded text-sm focus:border-gold focus:ring-1 focus:ring-gold/25"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">End Date</label>
                <div className="flex items-center gap-2">
                  <input
                    type="month"
                    value={headerForm.end_date}
                    onChange={(e) => setHeaderForm({ ...headerForm, end_date: e.target.value })}
                    disabled={headerForm.is_current}
                    className="flex-1 px-3 py-2 bg-bg-secondary border border-border rounded text-sm focus:border-gold focus:ring-1 focus:ring-gold/25 disabled:opacity-50"
                  />
                  <label className="flex items-center gap-1 text-xs whitespace-nowrap cursor-pointer">
                    <input
                      type="checkbox"
                      checked={headerForm.is_current}
                      onChange={(e) => setHeaderForm({ ...headerForm, is_current: e.target.checked, end_date: e.target.checked ? '' : headerForm.end_date })}
                      className="w-3 h-3 accent-gold"
                    />
                    Current
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveHeader}>Save</Button>
              <Button size="sm" variant="ghost" onClick={handleCancelHeader}>Cancel</Button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <div className="font-heading font-bold">{experience.civilian_title || experience.job_title}</div>
              <div className="text-text-muted text-sm">{experience.organization}</div>
              <div className="text-text-dim text-xs">
                {experience.start_date} — {experience.is_current ? 'Present' : experience.end_date}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setEditingHeader(true)}
                className="p-1.5 text-text-muted hover:text-gold transition-colors rounded"
                title="Edit experience details"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={handleDeleteExperience}
                className="p-1.5 text-text-muted hover:text-status-red transition-colors rounded"
                title="Remove from resume"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Bulk Actions for Bullets */}
      {pendingBullets.length > 0 && (
        <div className="flex gap-2 mb-3 p-2 bg-bg-secondary rounded">
          <Button
            size="sm"
            onClick={handleAcceptAll}
          >
            ✓ Accept All ({pendingBullets.length})
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleExcludeAll}
            className="text-status-amber hover:bg-status-amber/10"
          >
            ○ Exclude All
          </Button>
        </div>
      )}

      {/* Active Bullets */}
      <div className="space-y-3 mt-4">
        {activeBullets.map((bullet: any) => (
          <div key={bullet.id || bullet._idx} className="pl-4 border-l-2 border-border group">
            {editingBulletIdx === bullet._idx ? (
              /* Edit Mode */
              <div className="space-y-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-3 bg-bg-secondary border border-gold rounded text-sm text-text min-h-[80px]"
                  autoFocus
                  placeholder="Enter bullet point text..."
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSaveEdit(bullet._idx)}>
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Original */}
                {bullet.original_text && (
                  <div className="text-sm text-text-muted mb-1">
                    <span className="text-xs uppercase tracking-wider">Original:</span>
                    <p>{bullet.original_text}</p>
                  </div>
                )}

                {/* Translated or Empty State */}
                {bullet.translated_text ? (
                  <div className="text-sm mb-2">
                    <span className="text-xs uppercase tracking-wider text-gold">Translated:</span>
                    <p className={bullet.status === 'accepted' ? 'text-status-green' : ''}>{bullet.translated_text}</p>
                  </div>
                ) : !bullet.original_text && (
                  <div className="text-sm mb-2">
                    <p className="text-text-dim italic">Empty bullet — click Edit to add text</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  {!bullet.translated_text && bullet.original_text && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleTranslateBullet(bullet._idx, bullet.original_text)}
                      disabled={translating === bullet._idx.toString() || translationRemaining <= 0}
                    >
                      {translating === bullet._idx.toString() ? 'Translating...' : translationRemaining <= 0 ? 'Limit Reached' : '✦ Translate'}
                    </Button>
                  )}

                  {bullet.translated_text && bullet.status !== 'accepted' && (
                    <>
                      <Button size="sm" onClick={() => handleAcceptBullet(bullet._idx)}>
                        ✓ Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleTranslateBullet(bullet._idx, bullet.original_text)}
                        disabled={translating === bullet._idx.toString() || translationRemaining <= 0}
                      >
                        ↻ Retry
                      </Button>
                    </>
                  )}

                  {bullet.status === 'accepted' && (
                    <Badge variant="green">✓ Accepted</Badge>
                  )}

                  {/* Edit button - always visible */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleStartEdit(bullet._idx, bullet.translated_text || bullet.original_text || '')}
                  >
                    ✎ Edit
                  </Button>

                  {/* Exclude button - hides from resume but keeps bullet */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleExcludeBullet(bullet._idx)}
                    className="text-status-amber hover:bg-status-amber/10"
                  >
                    ○ Exclude
                  </Button>

                  {/* Delete button - permanently removes bullet */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteBullet(bullet._idx)}
                    className="text-status-red hover:bg-status-red/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕ Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}

        {activeBullets.length === 0 && excludedBullets.length === 0 && (
          <p className="text-text-dim text-sm">No bullets yet.</p>
        )}

        {activeBullets.length === 0 && excludedBullets.length > 0 && (
          <p className="text-text-dim text-sm text-center py-2">All bullets are excluded from this resume.</p>
        )}

        {/* Add Bullet Button */}
        <button
          onClick={handleAddBullet}
          className="text-sm text-gold hover:underline mt-2 flex items-center gap-1"
        >
          + Add bullet
        </button>
      </div>

      {/* Excluded Bullets */}
      {excludedBullets.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <details className="group">
            <summary className="text-xs text-text-dim cursor-pointer hover:text-text-muted flex items-center gap-1">
              <svg
                className="w-3 h-3 transition-transform group-open:rotate-90"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6"/>
              </svg>
              {excludedBullets.length} excluded bullet{excludedBullets.length !== 1 ? 's' : ''}
            </summary>
            <div className="mt-2 space-y-2">
              {excludedBullets.map((bullet: any) => (
                <div
                  key={bullet.id || bullet._idx}
                  className="flex items-start gap-2 p-2 bg-bg-secondary/50 rounded opacity-60"
                >
                  <div className="flex-1">
                    <div className="text-xs text-text-dim line-through">
                      {bullet.translated_text || bullet.original_text}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleIncludeBullet(bullet._idx)}
                    className="text-xs"
                  >
                    + Include
                  </Button>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </Card>
  )
}

function EducationItem({ education, onChange, onDelete }: {
  education: any
  onChange: (edu: any) => void
  onDelete: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    school_name: education.school_name || education.institution || '',
    degree_type: education.degree_type || education.degree || '',
    field_of_study: education.field_of_study || '',
    graduation_month: education.graduation_month || '',
    graduation_year: education.graduation_year || '',
    gpa: education.gpa?.toString() || '',
  })

  const handleSave = () => {
    onChange({
      ...education,
      school_name: form.school_name,
      institution: form.school_name,
      degree_type: form.degree_type,
      field_of_study: form.field_of_study,
      graduation_month: form.graduation_month,
      graduation_year: form.graduation_year,
      gpa: form.gpa ? parseFloat(form.gpa) : null,
    })
    setEditing(false)
  }

  const handleCancel = () => {
    setForm({
      school_name: education.school_name || education.institution || '',
      degree_type: education.degree_type || education.degree || '',
      field_of_study: education.field_of_study || '',
      graduation_month: education.graduation_month || '',
      graduation_year: education.graduation_year || '',
      gpa: education.gpa?.toString() || '',
    })
    setEditing(false)
  }

  const handleDelete = () => {
    if (!confirm('Remove this education from the resume?')) return
    onDelete()
  }

  if (editing) {
    return (
      <Card className="p-4 bg-bg-tertiary border-gold/30">
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">School</label>
              <input
                type="text"
                value={form.school_name}
                onChange={(e) => setForm({ ...form, school_name: e.target.value })}
                className="w-full px-3 py-2 bg-bg-secondary border border-border rounded text-sm focus:border-gold focus:ring-1 focus:ring-gold/25"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Degree</label>
              <input
                type="text"
                value={form.degree_type}
                onChange={(e) => setForm({ ...form, degree_type: e.target.value })}
                className="w-full px-3 py-2 bg-bg-secondary border border-border rounded text-sm focus:border-gold focus:ring-1 focus:ring-gold/25"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Field of Study</label>
              <input
                type="text"
                value={form.field_of_study}
                onChange={(e) => setForm({ ...form, field_of_study: e.target.value })}
                className="w-full px-3 py-2 bg-bg-secondary border border-border rounded text-sm focus:border-gold focus:ring-1 focus:ring-gold/25"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Graduation</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.graduation_month}
                  onChange={(e) => setForm({ ...form, graduation_month: e.target.value })}
                  placeholder="Month"
                  className="w-1/2 px-3 py-2 bg-bg-secondary border border-border rounded text-sm focus:border-gold focus:ring-1 focus:ring-gold/25"
                />
                <input
                  type="text"
                  value={form.graduation_year}
                  onChange={(e) => setForm({ ...form, graduation_year: e.target.value })}
                  placeholder="Year"
                  className="w-1/2 px-3 py-2 bg-bg-secondary border border-border rounded text-sm focus:border-gold focus:ring-1 focus:ring-gold/25"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">GPA</label>
              <input
                type="text"
                value={form.gpa}
                onChange={(e) => setForm({ ...form, gpa: e.target.value })}
                placeholder="e.g., 3.8"
                className="w-full px-3 py-2 bg-bg-secondary border border-border rounded text-sm focus:border-gold focus:ring-1 focus:ring-gold/25"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>Save</Button>
            <Button size="sm" variant="ghost" onClick={handleCancel}>Cancel</Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 bg-bg-tertiary">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-heading font-bold">{formatFullDegree(education)}</div>
          <div className="text-text-muted text-sm">{getSchoolName(education)}</div>
          <div className="text-text-dim text-xs">{formatGraduationDate(education.graduation_month, education.graduation_year, education.graduation_date)}</div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setEditing(true)}
            className="p-1.5 text-text-muted hover:text-gold transition-colors rounded"
            title="Edit education"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-text-muted hover:text-status-red transition-colors rounded"
            title="Remove from resume"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </Card>
  )
}
