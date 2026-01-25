'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatFullDegree, getSchoolName, formatGraduationDate } from '@/lib/utils/formatResume'
import { ProfessionalSummaryEditor } from './ProfessionalSummaryEditor'
import { buildProfileDataFromForm } from '@/lib/populateTemplate'
import { formatPhoneNumber } from '@/lib/formatPhone'

interface ResumeFormProps {
  resumeId: string
  content: any
  resumeType: 'private' | 'federal'
  onChange: (content: any) => void
  userProfile: any
  profileSummary?: string
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

export function ResumeForm({ resumeId, content, resumeType, onChange, userProfile, profileSummary }: ResumeFormProps) {
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

          <Input
            label="Phone"
            value={formatPhoneNumber(content.contact?.phone || '')}
            onChange={(e) => updateContent('contact', { ...content.contact, phone: e.target.value })}
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
      <FormSection title="Experience" icon="◫">
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
              userProfile={userProfile}
            />
          ))}
          {(!content.experiences || content.experiences.length === 0) && (
            <p className="text-text-muted text-center py-4">No experience added. Add experience in your Profile first.</p>
          )}
        </div>
      </FormSection>

      {/* Education */}
      <FormSection title="Education" icon="◇">
        <div className="space-y-3">
          {content.education?.map((edu: any, idx: number) => (
            <Card key={edu.id || idx} className="p-4 bg-bg-tertiary">
              <div className="font-heading font-bold">{formatFullDegree(edu)}</div>
              <div className="text-text-muted text-sm">{getSchoolName(edu)}</div>
              <div className="text-text-dim text-xs">{formatGraduationDate(edu.graduation_month, edu.graduation_year, edu.graduation_date)}</div>
            </Card>
          ))}
          {(!content.education || content.education.length === 0) && (
            <p className="text-text-muted text-center py-4">No education added.</p>
          )}
        </div>
      </FormSection>

      {/* Certifications */}
      <FormSection title="Certifications" icon="✦">
        <div className="flex flex-wrap gap-2">
          {content.certifications?.map((cert: any) => (
            <Badge key={cert.id} variant="gold">{cert.name}</Badge>
          ))}
          {(!content.certifications || content.certifications.length === 0) && (
            <p className="text-text-muted">No certifications added.</p>
          )}
        </div>
      </FormSection>

      {/* Skills */}
      <FormSection title="Skills" icon="◆">
        <div className="flex flex-wrap gap-2">
          {content.skills?.map((skill: any) => (
            <span key={skill.id} className="px-3 py-1 bg-bg-tertiary rounded text-sm">
              {skill.name}
            </span>
          ))}
          {(!content.skills || content.skills.length === 0) && (
            <p className="text-text-muted">No skills added.</p>
          )}
        </div>
      </FormSection>

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

function FormSection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-gold">{icon}</span>
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function ExperienceItem({ experience, resumeType, onChange, userProfile }: {
  experience: any
  resumeType: 'private' | 'federal'
  onChange: (exp: any) => void
  userProfile: any
}) {
  const [translating, setTranslating] = useState<string | null>(null)
  const [editingBulletIdx, setEditingBulletIdx] = useState<number | null>(null)
  const [editText, setEditText] = useState('')

  const handleStartEdit = (bulletIdx: number, text: string) => {
    setEditingBulletIdx(bulletIdx)
    setEditText(text)
  }

  const handleSaveEdit = (bulletIdx: number) => {
    const newBullets = [...(experience.bullets || [])]
    newBullets[bulletIdx] = {
      ...newBullets[bulletIdx],
      translated_text: editText,
      is_accepted: true,
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
      is_accepted: false,
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
      is_accepted: true,
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

  // Separate active and excluded bullets
  const activeBullets = (experience.bullets || []).map((b: any, idx: number) => ({ ...b, _idx: idx })).filter((b: any) => b.status !== 'excluded')
  const excludedBullets = (experience.bullets || []).map((b: any, idx: number) => ({ ...b, _idx: idx })).filter((b: any) => b.status === 'excluded')

  // Count pending bullets that can be accepted (have translated text but not yet accepted)
  const pendingBullets = activeBullets.filter(
    (b: any) => b.translated_text && !(b.is_accepted || b.status === 'accepted')
  )

  // Accept all pending bullets
  const handleAcceptAll = () => {
    const newBullets = [...(experience.bullets || [])]
    newBullets.forEach((bullet, idx) => {
      if (bullet.translated_text && !(bullet.is_accepted || bullet.status === 'accepted') && bullet.status !== 'excluded') {
        newBullets[idx] = {
          ...bullet,
          is_accepted: true,
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
      if (bullet.status !== 'excluded' && bullet.status !== 'accepted' && !bullet.is_accepted) {
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
        <div>
          <div className="font-heading font-bold">{experience.job_title}</div>
          <div className="text-text-muted text-sm">{experience.organization}</div>
          <div className="text-text-dim text-xs">
            {experience.start_date} — {experience.is_current ? 'Present' : experience.end_date}
          </div>
        </div>
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
                    <p className={bullet.is_accepted || bullet.status === 'accepted' ? 'text-status-green' : ''}>{bullet.translated_text}</p>
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
                      disabled={translating === bullet._idx.toString()}
                    >
                      {translating === bullet._idx.toString() ? 'Translating...' : '✦ Translate'}
                    </Button>
                  )}

                  {bullet.translated_text && !(bullet.is_accepted || bullet.status === 'accepted') && (
                    <>
                      <Button size="sm" onClick={() => handleAcceptBullet(bullet._idx)}>
                        ✓ Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleTranslateBullet(bullet._idx, bullet.original_text)}
                        disabled={translating === bullet._idx.toString()}
                      >
                        ↻ Retry
                      </Button>
                    </>
                  )}

                  {(bullet.is_accepted || bullet.status === 'accepted') && (
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
