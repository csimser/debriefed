'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatFullDegree, getSchoolName, formatGraduationDate } from '@/lib/utils/formatResume'
import { ProfessionalSummaryEditor } from './ProfessionalSummaryEditor'
import { buildProfileDataFromForm } from '@/lib/populateTemplate'
import { InternationalPhoneInput } from '@/components/ui/InternationalPhoneInput'
import { translateBullet } from '@/lib/dictionary/bulletTranslator'
import type { VagueFlag, VerbSuggestion } from '@/lib/dictionary/bulletTranslator'
import { parseAndTranslateEvalText } from '@/lib/dictionary/evalParser'
import { polishBullet } from '@/lib/dictionary/outputPolisher'
import { HelpTranslatePrompt } from '@/components/dictionary/HelpTranslatePrompt'
import { submitTerm } from '@/lib/dictionary/communityQueries'
import { getDictionary } from '@/lib/dictionary/dictionaryQueries'
import type { DictBulletPattern, DictAtsKeyword, DictionaryCache } from '@/lib/dictionary/types'
import { createClient } from '@/lib/supabase/client'
import { getUserTier, isPaidTier } from '@/lib/tier-utils'
import { UpgradeLink } from '@/components/modals/UpgradeModal'

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
  userPlan?: string
}

const TARGET_INDUSTRIES = [
  'Technology / IT',
  'Defense / Aerospace',
  'Government / Federal',
  'Healthcare',
  'Finance / Banking',
  'Manufacturing',
  'Energy / Utilities',
  'Consulting',
  'Transportation / Logistics',
  'Construction',
  'Education',
  'Other',
]

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

export function ResumeForm({ resumeId, content, resumeType, onChange, userProfile, profileSummary, allSkills = [], allCertifications = [], bulletTranslationUsage = 0, bulletTranslationLimit = 999, userPlan }: ResumeFormProps) {
  const isFreeUser = !isPaidTier(getUserTier({ tier: userPlan }))
  const bulletTranslationRemaining = bulletTranslationLimit - bulletTranslationUsage
  const updateContent = (key: string, value: any) => {
    onChange({ ...content, [key]: value })
  }

  // ATS keyword state
  const [atsKeywords, setAtsKeywords] = useState<DictAtsKeyword[]>([])
  const atsAppliedRef = useRef(false)
  const targetIndustry = content.target?.industry || ''
  const targetRole = content.target?.role || ''

  // Load ATS keywords when industry changes
  useEffect(() => {
    if (!targetIndustry) {
      setAtsKeywords([])
      return
    }
    getDictionary().then(dict => {
      const industryLower = targetIndustry.toLowerCase()
      const matching = (dict.atsKeywords ?? []).filter(k =>
        k.industry.toLowerCase().includes(industryLower) ||
        industryLower.includes(k.industry.toLowerCase())
      )
      setAtsKeywords(matching)
    }).catch(() => setAtsKeywords([]))
  }, [targetIndustry])

  // When ATS keywords load for the first time, re-select the best 12 skills
  // prioritizing ATS matches over non-matches
  useEffect(() => {
    if (atsAppliedRef.current || atsKeywords.length === 0 || allSkills.length === 0) return
    const currentSkills = content.skills || []
    // Only apply if user has the default selection (≤12 and hasn't manually changed)
    if (currentSkills.length > 12) return
    atsAppliedRef.current = true

    const atsSet = new Set(atsKeywords.flatMap(k => k.keywords).map(kw => kw.toLowerCase()))

    // Score all profile skills: ATS match = priority
    const scored = allSkills.map(skill => ({
      skill,
      isAts: atsSet.has(skill.name?.toLowerCase()),
      wasSelected: currentSkills.some((s: any) =>
        (typeof s === 'string' ? s : s.name)?.toLowerCase() === skill.name?.toLowerCase()
      ),
    }))

    // Sort: ATS matches first, then previously selected, then the rest
    scored.sort((a, b) => {
      if (a.isAts !== b.isAts) return a.isAts ? -1 : 1
      if (a.wasSelected !== b.wasSelected) return a.wasSelected ? -1 : 1
      return 0
    })

    const newSelection = scored.slice(0, 12).map(s => s.skill)
    onChange({ ...content, skills: newSelection })
  }, [atsKeywords])

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
  }, allCertifications, allSkills, content.education)

  return (
    <div className="space-y-6">
      {/* Contact Info */}
      <CollapsibleSection
        title="Contact Information"
        icon="◎"
        status={
          <span className={`text-xs ${content.contact?.first_name && content.contact?.email ? 'text-status-green' : 'text-status-amber'}`}>
            {content.contact?.first_name && content.contact?.email ? '✅ Complete' : 'Incomplete'}
          </span>
        }
      >
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
            <div className="w-full bg-bg-tertiary/50 border border-border rounded-lg px-4 py-3 text-text-muted cursor-not-allowed">
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
            <div className="w-full bg-bg-tertiary/50 border border-border rounded-lg px-4 py-3 text-text-muted cursor-not-allowed">
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
              autoComplete="url"
            />
          )}
        </div>
      </CollapsibleSection>

      {/* Target Role */}
      <CollapsibleSection
        title="Target Role"
        icon="◎"
        status={
          <span className={`text-xs ${targetIndustry && targetRole ? 'text-status-green' : 'text-status-amber'}`}>
            {targetIndustry && targetRole ? '✅ Complete' : 'Incomplete'}
          </span>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              Target Industry
            </label>
            <select
              value={targetIndustry}
              onChange={(e) => updateContent('target', { ...content.target, industry: e.target.value })}
              autoComplete="off"
              className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-3 text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
            >
              <option value="">Select Industry</option>
              {TARGET_INDUSTRIES.map((industry) => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
          <div>
            <Input
              label="Target Role"
              value={targetRole}
              onChange={(e) => updateContent('target', { ...content.target, role: e.target.value })}
              placeholder="e.g., Project Manager, Operations Manager"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Professional Summary */}
      <CollapsibleSection
        title="Professional Summary"
        icon="◎"
        status={
          <span className={`text-xs ${content.summary ? 'text-status-green' : 'text-status-amber'}`}>
            {content.summary ? '✅ Complete' : 'Empty — add now'}
          </span>
        }
      >
      <ProfessionalSummaryEditor
        resumeId={resumeId}
        summary={content.summary || ''}
        profileSummary={profileSummary}
        profile={profileDataForTemplates}
        onUpdate={(summary) => updateContent('summary', summary)}
        userPlan={userPlan}
        targetIndustry={targetIndustry}
        targetRole={targetRole}
      />
      </CollapsibleSection>

      {/* Experience */}
      <CollapsibleSection
        title="Experience"
        icon="◫"
        defaultOpen
        status={
          <span className="text-xs text-text-muted">
            {content.experiences?.length || 0} {content.experiences?.length === 1 ? 'entry' : 'entries'}
          </span>
        }
        badge={
          <Badge variant={bulletTranslationRemaining >= 999 ? 'default' : bulletTranslationRemaining <= 1 ? 'red' : bulletTranslationRemaining <= 3 ? 'amber' : 'default'}>
            {bulletTranslationRemaining >= 999 ? 'Unlimited' : `${bulletTranslationRemaining} Translations Left`}
          </Badge>
        }
      >
        <div className="space-y-4">
          {content.experiences?.map((exp: any, idx: number) => (
            <ExperienceItem
              key={exp.id || idx}
              experience={exp}
              experienceIndex={idx}
              totalExperiences={content.experiences?.length || 0}
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
              targetRole={targetRole}
            />
          ))}
          {(!content.experiences || content.experiences.length === 0) && (
            <p className="text-text-muted text-center py-4">No experience added. Add experience in your <a href="/profile" className="text-gold hover:underline">Profile</a> first.</p>
          )}
        </div>
      </CollapsibleSection>

      {/* Education */}
      <CollapsibleSection
        title="Education"
        icon="◇"
        status={
          <span className={`text-xs ${content.education?.length > 0 ? 'text-status-green' : 'text-status-amber'}`}>
            {content.education?.length > 0 ? '✅ Complete' : 'Empty — add now'}
          </span>
        }
      >
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
      </CollapsibleSection>

      {/* Skills */}
      <CollapsibleSection
        title="Skills"
        icon="◆"
        status={
          <span className="text-xs text-text-muted">
            {(content.skills || []).length} skills
          </span>
        }
      >
        <SkillCertSelector
          title="Skills"
          icon="◆"
          allItems={allSkills}
          selectedItems={content.skills || []}
          onChange={(skills) => updateContent('skills', skills)}
          renderLabel={(item) => item.name}
          maxRecommended={12}
          atsKeywordNames={atsKeywords.flatMap(k => k.keywords).map(kw => kw.toLowerCase())}
          headless
        />
      </CollapsibleSection>

      {/* Industry Keywords — grouped by role_type */}
      {targetIndustry && atsKeywords.length > 0 && (
        <KeywordGroupSection
          atsKeywords={atsKeywords}
          industry={targetIndustry}
          targetRole={targetRole}
          selectedSkills={content.skills || []}
          profileSkillNames={new Set(allSkills.map((s: any) => s.name?.toLowerCase()))}
          onToggleKeyword={(keyword, isAdding) => {
            if (isAdding) {
              const newSkill = { id: `ats-${Date.now()}-${keyword}`, name: keyword, category: 'ats' }
              updateContent('skills', [...(content.skills || []), newSkill])
            } else {
              updateContent('skills', (content.skills || []).filter((s: any) => {
                const name = (typeof s === 'string' ? s : s.name)?.toLowerCase()
                return name !== keyword.toLowerCase()
              }))
            }
          }}
        />
      )}

      {/* Certifications */}
      <CollapsibleSection
        title="Certifications"
        icon="✦"
        status={
          <span className="text-xs text-text-muted">
            {(content.certifications || []).length} certs
          </span>
        }
      >
        <SkillCertSelector
          title="Certifications"
          icon="✦"
          allItems={allCertifications}
          selectedItems={content.certifications || []}
          onChange={(certs) => updateContent('certifications', certs)}
          renderLabel={(item) => item.issuing_organization ? `${item.name} - ${item.issuing_organization}` : item.name}
          headless
        />
      </CollapsibleSection>

      {/* Federal Resume Extra Fields - Only for federal resumes */}
      {resumeType === 'federal' && (
        <CollapsibleSection title="Federal Resume Details" icon="★">
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
                autoComplete="off"
                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-3 text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
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
                autoComplete="off"
                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-3 text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
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
                autoComplete="off"
                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-3 text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
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
                autoComplete="off"
                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-3 text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
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
                autoComplete="off"
                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-3 text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
              />
              <p className="text-xs text-text-dim mt-1">
                Enter your current or most recent federal pay grade if applicable
              </p>
            </div>
          </div>
        </CollapsibleSection>
      )}
    </div>
  )
}

function CollapsibleSection({
  title,
  icon,
  children,
  badge,
  status,
  defaultOpen = false,
}: {
  title: string
  icon: string
  children: React.ReactNode
  badge?: React.ReactNode
  status?: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-bg-secondary hover:bg-bg-tertiary transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <svg
            className={`w-3 h-3 text-text-muted transition-transform ${isOpen ? 'rotate-90' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gold text-sm">{icon}</span>
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {status}
          {badge}
        </div>
      </button>
      {isOpen && (
        <div className="px-4 py-4 border-t border-border">
          {children}
        </div>
      )}
    </div>
  )
}

// Keep FormSection for backward compat with sections that don't need collapse (like industry keywords)
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

// Weight priority for sorting keyword groups
const WEIGHT_ORDER: Record<string, number> = { critical: 0, important: 1, high: 2, medium: 3, low: 4 }

interface KeywordGroup {
  roleType: string
  keywords: string[]
  weight: string
}

function buildKeywordGroups(atsKeywords: DictAtsKeyword[]): KeywordGroup[] {
  const groupMap = new Map<string, { keywords: Set<string>; bestWeight: string }>()

  for (const row of atsKeywords) {
    const existing = groupMap.get(row.role_type)
    if (existing) {
      for (const kw of row.keywords) existing.keywords.add(kw)
      // Keep the highest-priority weight
      if ((WEIGHT_ORDER[row.weight] ?? 99) < (WEIGHT_ORDER[existing.bestWeight] ?? 99)) {
        existing.bestWeight = row.weight
      }
    } else {
      groupMap.set(row.role_type, {
        keywords: new Set(row.keywords),
        bestWeight: row.weight,
      })
    }
  }

  return Array.from(groupMap.entries())
    .map(([roleType, data]) => ({
      roleType,
      keywords: Array.from(data.keywords),
      weight: data.bestWeight,
    }))
    .sort((a, b) => (WEIGHT_ORDER[a.weight] ?? 99) - (WEIGHT_ORDER[b.weight] ?? 99))
}

function KeywordGroupSection({
  atsKeywords,
  industry,
  targetRole,
  selectedSkills,
  profileSkillNames,
  onToggleKeyword,
}: {
  atsKeywords: DictAtsKeyword[]
  industry: string
  targetRole: string
  selectedSkills: any[]
  profileSkillNames: Set<string>
  onToggleKeyword: (keyword: string, isAdding: boolean) => void
}) {
  const groups = buildKeywordGroups(atsKeywords)
  const targetRoleLower = targetRole.toLowerCase().trim()

  // Determine which group to auto-expand based on target role match
  const autoExpandRole = groups.find(g =>
    targetRoleLower && (
      g.roleType.toLowerCase().includes(targetRoleLower) ||
      targetRoleLower.includes(g.roleType.toLowerCase())
    )
  )?.roleType || null

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    if (autoExpandRole) initial.add(autoExpandRole)
    return initial
  })
  const [allExpanded, setAllExpanded] = useState(false)

  const toggleGroup = (roleType: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      next.has(roleType) ? next.delete(roleType) : next.add(roleType)
      return next
    })
  }

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedGroups(new Set())
      setAllExpanded(false)
    } else {
      setExpandedGroups(new Set(groups.map(g => g.roleType)))
      setAllExpanded(true)
    }
  }

  // Build set of skill names already on resume
  const selectedSkillNames = new Set(
    selectedSkills.map((s: any) => (typeof s === 'string' ? s : s.name)?.toLowerCase())
  )
  const allProfileSkillNames = profileSkillNames

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-gold">◆</span>
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider">
            Recommended Keywords — {industry}
          </h3>
        </div>
        <button
          type="button"
          onClick={toggleAll}
          className="text-xs text-gold hover:underline"
        >
          {allExpanded ? 'Collapse All' : 'Show All'}
        </button>
      </div>

      <div className="space-y-1">
        {groups.map((group) => {
          const isExpanded = expandedGroups.has(group.roleType)
          return (
            <div key={group.roleType} className="border border-border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggleGroup(group.roleType)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-bg-secondary hover:bg-bg-tertiary transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className={`w-3 h-3 text-text-muted transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="font-heading text-xs font-semibold uppercase tracking-wider">{group.roleType}</span>
                </div>
                <span className="text-xs text-text-dim">{group.keywords.length} keywords</span>
              </button>
              {isExpanded && (
                <div className="px-3 py-3 border-t border-border">
                  <div className="flex flex-wrap gap-1.5">
                    {group.keywords.map((keyword) => {
                      const isOnResume = selectedSkillNames.has(keyword.toLowerCase())
                      // Check if it's a profile-sourced skill (exists in allSkills from profile)
                      // vs an ATS-added keyword (user clicked + to add it)
                      const isProfileSkill = isOnResume && allProfileSkillNames.has(keyword.toLowerCase())
                      return (
                        <span
                          key={keyword}
                          onClick={() => {
                            if (isProfileSkill) return
                            onToggleKeyword(keyword, !isOnResume)
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border transition-colors ${
                            isProfileSkill
                              ? 'bg-status-green/10 border-status-green/30 text-status-green'
                              : isOnResume
                                ? 'bg-gold text-bg-primary border-gold cursor-pointer hover:bg-gold-bright'
                                : 'bg-bg-tertiary border-border text-text-muted hover:border-gold/50 hover:text-gold cursor-pointer'
                          }`}
                        >
                          {isProfileSkill ? '✓' : isOnResume ? '✕' : '+'} {keyword}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-xs text-text-dim mt-2">
        Click + to add keywords to your skills. Click a gold keyword to remove it. Green ✓ keywords are already in your profile skills.
      </p>
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
  maxRecommended,
  atsKeywordNames,
  headless = false,
}: {
  title: string
  icon: string
  allItems: any[]
  selectedItems: any[]
  onChange: (items: any[]) => void
  renderLabel: (item: any) => string
  maxRecommended?: number
  atsKeywordNames?: string[]
  headless?: boolean
}) {
  // Match by name (stable) not ID (changes on re-import)
  const selectedNames = new Set(
    selectedItems.map((s: any) => (typeof s === 'string' ? s : s.name)?.toLowerCase())
  )

  const atsSet = new Set(atsKeywordNames || [])

  const isItemSelected = (item: any) => selectedNames.has(item.name?.toLowerCase())
  const isAtsMatch = (item: any) => atsSet.has(item.name?.toLowerCase())

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

  // Sort: selected items first, then unselected. Within each group, ATS matches first.
  const sortedItems = [...allItems].sort((a, b) => {
    const aSelected = isItemSelected(a) ? 0 : 1
    const bSelected = isItemSelected(b) ? 0 : 1
    if (aSelected !== bSelected) return aSelected - bSelected
    // Within same selection group, ATS matches first
    if (atsSet.size > 0) {
      const aAts = isAtsMatch(a) ? 0 : 1
      const bAts = isAtsMatch(b) ? 0 : 1
      if (aAts !== bAts) return aAts - bAts
    }
    return 0
  })

  if (allItems.length === 0) {
    const emptyContent = <p className="text-text-muted">No {title.toLowerCase()} added. Add them in your <a href="/profile" className="text-gold hover:underline">Profile</a>.</p>
    if (headless) return emptyContent
    return (
      <FormSection title={title} icon={icon}>
        {emptyContent}
      </FormSection>
    )
  }

  const selectorContent = (
    <>
      {/* Recommendation tip — only for skills (when maxRecommended is set) */}
      {maxRecommended && (
        <div className="bg-gold-dim border border-gold/20 rounded-md px-3 py-2 mb-3">
          <p className="text-xs text-gold">
            💡 Tip: Select 8–12 skills for the best results. Too many skills dilute impact and take up valuable resume space.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-text-muted font-medium">
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

      {/* Warning when over recommended max */}
      {maxRecommended && selectedCount > maxRecommended && (
        <div className="bg-status-yellow/10 border border-status-yellow/20 rounded-md px-3 py-2 mb-3">
          <p className="text-xs text-status-yellow">
            ⚠️ More than {maxRecommended} skills selected — consider narrowing to your strongest and most relevant skills.
          </p>
        </div>
      )}

      <div className="space-y-1">
        {sortedItems.map((item: any) => {
          const isSelected = isItemSelected(item)
          const isAts = isAtsMatch(item)
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
              {isAts && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-status-green/10 text-status-green border border-status-green/20 ml-auto shrink-0">
                  ATS
                </span>
              )}
            </label>
          )
        })}
      </div>
    </>
  )

  if (headless) return selectorContent
  return (
    <FormSection title={title} icon={icon}>
      {selectorContent}
    </FormSection>
  )
}

// Returns recommended bullet range based on experience position (0 = most recent)
function getBulletRecommendation(index: number): { min: number; max: number } {
  if (index === 0) return { min: 5, max: 6 }
  if (index === 1) return { min: 4, max: 5 }
  return { min: 3, max: 4 }
}

function BulletCountIndicator({ count, index }: { count: number; index: number }) {
  const { min, max } = getBulletRecommendation(index)

  let color = 'text-status-green'
  let message = `${count} of ${min}–${max} recommended`

  if (count < min) {
    color = 'text-status-amber'
  } else if (count > max + 2) {
    color = 'text-status-red'
    message = `${count} of ${min}–${max} recommended — consider trimming to your strongest accomplishments`
  } else if (count > max) {
    color = 'text-status-amber'
  }

  return (
    <span className={`text-xs ${color}`}>
      {message}
    </span>
  )
}

/** Derive rank_tier from paygrade for bullet pattern matching */
function getRankTierFromPaygrade(paygrade?: string): string | null {
  if (!paygrade) return null
  const pg = paygrade.toUpperCase().trim()
  if (/^E-?[1-3]$/.test(pg)) return 'junior_enlisted'
  if (/^E-?[4-6]$/.test(pg)) return 'nco'
  if (/^E-?[7-9]$/.test(pg)) return 'senior_nco'
  if (/^(W-?[1-5]|CW[1-5])$/.test(pg)) return 'warrant'
  if (/^O-?[1-3]$/.test(pg)) return 'junior_officer'
  if (/^O-?[4-6]$/.test(pg)) return 'senior_officer'
  if (/^O-?[7-9]|O-?10$/.test(pg)) return 'flag_officer'
  return null
}

/** Keywords that map job titles to bullet pattern categories */
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  leadership: ['manager', 'supervisor', 'director', 'lead', 'chief', 'commander', 'officer', 'ncoic', 'oic', 'superintendent', 'executive', 'head', 'deputy', 'assistant'],
  technical: ['technician', 'engineer', 'developer', 'analyst', 'specialist', 'systems', 'it', 'cyber', 'network', 'maintenance', 'programmer', 'architect', 'data', 'software'],
  operations: ['operations', 'logistics', 'supply', 'planning', 'coordinator', 'program', 'project', 'mission', 'watch'],
  combat: ['infantry', 'combat', 'weapons', 'gunner', 'tactical', 'security', 'force protection', 'military police', 'mp'],
  medical: ['medic', 'nurse', 'corpsman', 'medical', 'health', 'dental', 'clinical', 'physician', 'paramedic'],
  training: ['instructor', 'trainer', 'training', 'education', 'mentor', 'drill'],
  communications: ['communications', 'signal', 'radio', 'intelligence', 'sigint', 'comint', 'cryptologic'],
  administrative: ['personnel', 'human resources', 'admin', 'finance', 'budget', 'pay', 'legal', 'jag', 'clerk', 'yeoman'],
  project_management: ['program', 'project', 'portfolio', 'pmo'],
  financial: ['budget', 'finance', 'comptroller', 'fiscal', 'accounting', 'audit'],
  safety: ['safety', 'osha', 'damage control', 'dc', 'environmental', 'compliance'],
  logistics: ['logistics', 'supply', 'warehouse', 'inventory', 'shipping', 'transportation', 'distribution'],
  analytical: ['analyst', 'intelligence', 'research', 'data', 'assessment', 'evaluation'],
  healthcare: ['medic', 'nurse', 'corpsman', 'medical', 'health', 'dental', 'clinical', 'physician'],
}

/** Keywords that map target roles to bullet pattern categories for industry boost */
const ROLE_CATEGORY_BOOST: Record<string, string[]> = {
  leadership: ['manager', 'director', 'lead', 'supervisor', 'chief', 'head', 'vp', 'president'],
  technical: ['engineer', 'developer', 'architect', 'technician', 'analyst', 'specialist'],
  operations: ['operations', 'coordinator', 'logistics', 'supply chain', 'planner'],
  training: ['trainer', 'instructor', 'educator', 'mentor', 'facilitator'],
  medical: ['nurse', 'medic', 'clinical', 'health', 'physician'],
  administrative: ['admin', 'hr', 'human resources', 'finance', 'budget', 'accounting'],
  communications: ['communications', 'it', 'cyber', 'network', 'intelligence'],
}

/** Score how well a bullet pattern matches a given experience */
function scoreBulletPattern(
  pattern: DictBulletPattern,
  jobTitle: string,
  rankTier: string | null,
  targetRole?: string,
): number {
  let score = 0
  const titleLower = jobTitle.toLowerCase()
  const patternCategory = (pattern.category || '').toLowerCase()

  // Category match via job title keywords
  const keywords = CATEGORY_KEYWORDS[patternCategory] || []
  for (const kw of keywords) {
    if (titleLower.includes(kw)) {
      score += 3
      break
    }
  }

  // Direct category name match in job title
  if (titleLower.includes(patternCategory)) {
    score += 2
  }

  // Rank tier match
  if (pattern.rank_tier && rankTier) {
    if (pattern.rank_tier.toLowerCase() === rankTier) {
      score += 2
    }
  } else if (!pattern.rank_tier) {
    // Generic patterns (no rank tier) get a small bonus — they apply to everyone
    score += 1
  }

  // Industry/role boost: if target role keywords match pattern category, soft boost
  if (targetRole) {
    const roleLower = targetRole.toLowerCase()
    const boostKeywords = ROLE_CATEGORY_BOOST[patternCategory] || []
    for (const kw of boostKeywords) {
      if (roleLower.includes(kw)) {
        score += 2
        break
      }
    }
  }

  // Every military role has leadership and operations — small universal boost
  if (patternCategory === 'leadership' || patternCategory === 'operations') {
    score += 1
  }

  // Add randomization jitter (0-0.9) so tied scores shuffle each time
  score += Math.random() * 0.9

  return score
}

/**
 * Select top suggestions with category diversity.
 * Ensures no more than 2 suggestions from the same category.
 */
function selectDiverseSuggestions(
  scored: { pattern: DictBulletPattern; score: number }[],
  count: number,
): { pattern: DictBulletPattern; score: number }[] {
  const sorted = [...scored].sort((a, b) => b.score - a.score)
  const selected: { pattern: DictBulletPattern; score: number }[] = []
  const categoryCounts: Record<string, number> = {}

  for (const item of sorted) {
    if (selected.length >= count) break
    const cat = (item.pattern.category || 'general').toLowerCase()
    const catCount = categoryCounts[cat] || 0
    if (catCount < 2) {
      selected.push(item)
      categoryCounts[cat] = catCount + 1
    }
  }

  // If we didn't get enough due to diversity limits, fill from remaining
  if (selected.length < count) {
    for (const item of sorted) {
      if (selected.length >= count) break
      if (!selected.includes(item)) {
        selected.push(item)
      }
    }
  }

  return selected
}

/** Context for populating bullet suggestions with real data */
interface BulletPopulateContext {
  branch: string
  paygrade: string
  yearsOfService: string | number
  jobTitle: string
  civilianTitle: string
  organization: string
  category: string
  suggestionIndex: number
}

/** Pick a strong action verb from dictionary, rotating by suggestion index */
function pickActionVerb(dict: DictionaryCache, category: string, index: number): string {
  const FALLBACK_VERBS: Record<string, string[]> = {
    leadership: ['Directed', 'Led', 'Managed', 'Supervised', 'Oversaw'],
    technical: ['Engineered', 'Developed', 'Implemented', 'Configured', 'Designed'],
    operations: ['Coordinated', 'Streamlined', 'Executed', 'Managed', 'Orchestrated'],
    combat: ['Commanded', 'Led', 'Executed', 'Coordinated', 'Directed'],
    medical: ['Administered', 'Provided', 'Managed', 'Coordinated', 'Delivered'],
    training: ['Trained', 'Developed', 'Instructed', 'Mentored', 'Facilitated'],
    communications: ['Managed', 'Maintained', 'Configured', 'Monitored', 'Secured'],
    administrative: ['Managed', 'Processed', 'Coordinated', 'Administered', 'Oversaw'],
  }

  const catLower = category.toLowerCase()
  // Filter dict verbs by category match (best_for or category field)
  const matching = (dict.actionVerbs ?? []).filter(v => {
    const vCat = v.category?.toLowerCase() || ''
    const bestFor = (v.best_for || []).map(b => b.toLowerCase())
    return vCat === catLower || vCat.includes(catLower) ||
      bestFor.some(b => b === catLower || b.includes(catLower))
  })

  // Prefer 'strong' verbs, then any
  const strong = matching.filter(v => v.strength?.toLowerCase() === 'strong')
  const pool = strong.length >= 3 ? strong : matching.length >= 3 ? matching : []

  if (pool.length > 0) {
    const verb = pool[index % pool.length].verb
    return verb.charAt(0).toUpperCase() + verb.slice(1)
  }

  const fallback = FALLBACK_VERBS[catLower] || FALLBACK_VERBS.leadership
  return fallback[index % fallback.length]
}

/** Look up typical team size from rank equivalents by paygrade */
function getTeamSize(dict: DictionaryCache, paygrade: string, branch: string): string {
  if (!paygrade) return '10'
  const pg = paygrade.toUpperCase().trim()
  const brLower = branch.toLowerCase()
  const match = (dict.rankEquivalents ?? []).find(r =>
    r.paygrade.toUpperCase().trim() === pg &&
    r.branch.toLowerCase().includes(brLower)
  )
  if (match?.typical_team_size) return match.typical_team_size
  // Fallback by paygrade range
  if (/^E-?[1-3]$/.test(pg)) return '4'
  if (/^E-?[4-6]$/.test(pg)) return '12'
  if (/^E-?[7-9]$/.test(pg)) return '35'
  if (/^O-?[1-3]$/.test(pg)) return '40'
  if (/^O-?[4-6]$/.test(pg)) return '150'
  if (/^O-?[7-9]|O-?10$/.test(pg)) return '500'
  if (/^(W-?[1-5]|CW[1-5])$/.test(pg)) return '20'
  return '10'
}

/** Derive team/personnel description from branch and category */
function getTeamDescription(branch: string, category: string, jobTitle: string): string {
  const catLower = category.toLowerCase()
  const brLower = branch.toLowerCase()

  const teamTypes: Record<string, string> = {
    technical: 'technical specialists',
    operations: 'operations personnel',
    combat: brLower.includes('navy') ? 'Sailors' : brLower.includes('marine') ? 'Marines' : brLower.includes('air') ? 'Airmen' : 'Soldiers',
    medical: 'healthcare professionals',
    training: 'training cadre',
    communications: 'communications specialists',
    administrative: 'administrative staff',
    leadership: 'cross-functional team members',
  }

  // Try to derive from job title
  if (jobTitle.toLowerCase().includes('maintenance')) return 'maintenance technicians'
  if (jobTitle.toLowerCase().includes('supply') || jobTitle.toLowerCase().includes('logistics')) return 'supply chain personnel'
  if (jobTitle.toLowerCase().includes('intelligence')) return 'intelligence analysts'
  if (jobTitle.toLowerCase().includes('medical') || jobTitle.toLowerCase().includes('corpsman')) return 'medical staff'

  return teamTypes[catLower] || 'team members'
}

/** Derive a function description from job title */
function getFunctionDescription(jobTitle: string, category: string): string {
  const titleLower = jobTitle.toLowerCase()
  if (titleLower.includes('maintenance')) return 'equipment maintenance and repair operations'
  if (titleLower.includes('supply') || titleLower.includes('logistics')) return 'supply chain and logistics operations'
  if (titleLower.includes('intelligence')) return 'intelligence collection and analysis'
  if (titleLower.includes('communications') || titleLower.includes('signal')) return 'communications infrastructure and security'
  if (titleLower.includes('medical') || titleLower.includes('corpsman')) return 'patient care and medical readiness'
  if (titleLower.includes('training') || titleLower.includes('instructor')) return 'training program development and execution'
  if (titleLower.includes('admin') || titleLower.includes('personnel')) return 'administrative operations and personnel management'
  if (titleLower.includes('security') || titleLower.includes('force protection')) return 'physical security and force protection'
  if (titleLower.includes('finance') || titleLower.includes('budget')) return 'financial management and budget execution'

  const catDefaults: Record<string, string> = {
    leadership: 'mission-critical operations',
    technical: 'technical operations and system maintenance',
    operations: 'daily operational planning and execution',
    combat: 'tactical operations and combat readiness',
    medical: 'healthcare delivery and medical readiness',
    training: 'personnel development and training programs',
    communications: 'communications systems and information security',
    administrative: 'administrative operations and resource management',
  }
  return catDefaults[category.toLowerCase()] || 'operational planning and execution'
}

/** Get a realistic quantified result by category */
function getQuantifiedResult(category: string, index: number): string {
  const results: Record<string, string[]> = {
    leadership: ['98% mission readiness rating', 'zero safety incidents over 18-month period', '25% improvement in team performance metrics', '100% on-time delivery of mission objectives', 'unit selection for organizational excellence award'],
    technical: ['99.8% system uptime across all platforms', '40% reduction in equipment downtime', '30% improvement in maintenance cycle time', '$2.1M in equipment maintained at full operational status', 'zero critical system failures during deployment'],
    operations: ['15% improvement in operational efficiency', '100% accountability of $5M+ in assets', '30% reduction in processing time', '98% on-time delivery rate', 'streamlined workflow reducing backlog by 45%'],
    combat: ['100% personnel accountability during operations', '98% mission success rate', 'zero safety violations across 200+ operations', 'qualified 100% of personnel on assigned weapons systems', 'maintained combat readiness at 95% or above'],
    medical: ['treated 500+ patients with 99% positive outcomes', '30% reduction in patient wait times', '100% compliance with medical readiness standards', 'maintained 98% medical supply availability', 'zero preventable adverse events'],
    training: ['trained 200+ personnel with 95% qualification rate', '30% improvement in first-time pass rates', 'developed curriculum adopted across 3 commands', '100% of trainees met certification requirements', 'reduced training timeline by 20% while maintaining standards'],
    communications: ['maintained 99.9% network uptime', 'secured communications for 1,000+ users', '40% reduction in system vulnerabilities', 'zero security breaches during 24-month period', 'migrated 500+ users to new platform with zero downtime'],
    administrative: ['processed 1,000+ personnel actions with 99% accuracy', 'reduced processing time by 35%', 'managed $3.2M annual operating budget', '100% compliance with regulatory requirements', 'eliminated $150K in annual waste through process improvements'],
  }
  const pool = results[category.toLowerCase()] || results.leadership
  return pool[index % pool.length]
}

/** Get a realistic timeframe */
function getTimeframe(index: number): string {
  const timeframes = ['12-month period', '18-month deployment cycle', 'fiscal year', '6-month assessment period', '24-month tour']
  return timeframes[index % timeframes.length]
}

/** Get a realistic percentage by category */
function getPercentage(category: string, index: number): string {
  const pcts: Record<string, string[]> = {
    leadership: ['98%', '25%', '100%', '30%', '15%'],
    technical: ['99.8%', '40%', '30%', '95%', '35%'],
    operations: ['15%', '100%', '30%', '98%', '45%'],
    combat: ['100%', '98%', '95%', '100%', '97%'],
    medical: ['99%', '30%', '100%', '98%', '95%'],
    training: ['95%', '30%', '100%', '20%', '97%'],
    communications: ['99.9%', '40%', '100%', '35%', '99%'],
    administrative: ['99%', '35%', '100%', '98%', '30%'],
  }
  const pool = pcts[category.toLowerCase()] || pcts.leadership
  return pool[index % pool.length]
}

/** Get a realistic dollar/budget amount by rank tier */
function getBudgetAmount(paygrade: string): string {
  const pg = (paygrade || '').toUpperCase().trim()
  if (/^E-?[1-4]$/.test(pg)) return '$250K'
  if (/^E-?[5-6]$/.test(pg)) return '$1.2M'
  if (/^E-?[7-9]$/.test(pg)) return '$3.5M'
  if (/^O-?[1-3]$/.test(pg)) return '$5M'
  if (/^O-?[4-6]$/.test(pg)) return '$15M'
  if (/^O-?[7-9]|O-?10$/.test(pg)) return '$50M'
  if (/^(W-?[1-5]|CW[1-5])$/.test(pg)) return '$2M'
  return '$1M'
}

/** Populate bullet pattern template with real data from user profile and dictionary */
function populateBulletTemplate(
  template: string,
  ctx: BulletPopulateContext,
  dict: DictionaryCache,
): string {
  let result = template

  // Action verb — rotated by suggestion index
  const verb = pickActionVerb(dict, ctx.category, ctx.suggestionIndex)
  result = result.replace(/\{\{action_verb\}\}/g, verb)

  // Team size from rank equivalents
  const teamSize = getTeamSize(dict, ctx.paygrade, ctx.branch)
  result = result.replace(/\{\{team_size\}\}/g, teamSize)

  // Team description from branch/category
  const teamDesc = getTeamDescription(ctx.branch, ctx.category, ctx.jobTitle)
  result = result.replace(/\{\{team_description\}\}/g, teamDesc)

  // Function from job title
  const funcDesc = getFunctionDescription(ctx.jobTitle, ctx.category)
  result = result.replace(/\{\{function\}\}/g, funcDesc)

  // Quantified results
  const specificResult = getQuantifiedResult(ctx.category, ctx.suggestionIndex)
  result = result.replace(/\{\{result\}\}/g, specificResult)
  result = result.replace(/\{\{specific_result\}\}/g, specificResult)

  // Timeframe
  result = result.replace(/\{\{timeframe\}\}/g, getTimeframe(ctx.suggestionIndex))

  // Percentage
  result = result.replace(/\{\{percentage\}\}/g, getPercentage(ctx.category, ctx.suggestionIndex))

  // Dollar amounts / budget
  const budget = getBudgetAmount(ctx.paygrade)
  result = result.replace(/\{\{dollar_amount\}\}/g, budget)
  result = result.replace(/\{\{budget\}\}/g, budget)

  // Profile data
  const years = ctx.yearsOfService ? String(ctx.yearsOfService) : '10'
  result = result.replace(/\{\{years\}\}/g, years)
  result = result.replace(/\{\{branch\}\}/g, ctx.branch || 'military')
  result = result.replace(/\{\{organization\}\}/g, ctx.organization || 'the organization')
  result = result.replace(/\{\{program_name\}\}/g, ctx.organization || 'the program')
  result = result.replace(/\{\{number\}\}/g, teamSize)

  // Metric — use a category-appropriate one
  const metricPool: Record<string, string[]> = {
    leadership: ['mission readiness', 'team performance', 'operational efficiency'],
    technical: ['system uptime', 'equipment availability', 'maintenance turnaround'],
    operations: ['processing time', 'delivery rate', 'resource utilization'],
    combat: ['combat readiness', 'qualification rate', 'mission success'],
    medical: ['patient outcomes', 'readiness compliance', 'wait times'],
    training: ['pass rate', 'qualification rate', 'training completion'],
    communications: ['network uptime', 'system availability', 'security posture'],
    administrative: ['processing accuracy', 'compliance rate', 'cycle time'],
  }
  const metricArr = metricPool[ctx.category.toLowerCase()] || metricPool.leadership
  result = result.replace(/\{\{metric\}\}/g, metricArr[ctx.suggestionIndex % metricArr.length])

  // System/process names derived from job context
  const sysName = ctx.jobTitle.toLowerCase().includes('it') || ctx.jobTitle.toLowerCase().includes('cyber')
    ? 'enterprise network infrastructure'
    : ctx.jobTitle.toLowerCase().includes('maintenance')
    ? 'maintenance management system'
    : ctx.jobTitle.toLowerCase().includes('supply')
    ? 'supply chain management system'
    : 'operational management system'
  result = result.replace(/\{\{system_name\}\}/g, sysName)
  result = result.replace(/\{\{process_name\}\}/g, funcDesc.split(' and ')[0])

  // Catch any remaining {{placeholder}} — fill with best-effort contextual value
  result = result.replace(/\{\{(\w+)\}\}/g, (_, field) => {
    const f = field.toLowerCase()
    if (f === 'civilian_title' || f === 'target_role') return ctx.civilianTitle || ctx.jobTitle || '[target role]'
    if (f === 'target_industry') return '[target industry]'
    if (f === 'certification' || f === 'cert_1') return '[certification]'
    if (f === 'skill_1' || f === 'key_skill') return funcDesc.split(' ')[0] || '[key skill]'
    if (f === 'key_achievement') return specificResult
    return `[${field.replace(/_/g, ' ')}]`
  })

  return result
}

// Eval parsing moved to src/lib/dictionary/evalParser.ts (parseAndTranslateEvalText)

function ExperienceItem({ experience, experienceIndex, totalExperiences, resumeType, onChange, onDelete, userProfile, translationRemaining = 999, targetRole }: {
  experience: any
  experienceIndex: number
  totalExperiences: number
  resumeType: 'private' | 'federal'
  onChange: (exp: any) => void
  onDelete: () => void
  userProfile: any
  translationRemaining?: number
  targetRole?: string
}) {
  const [translating, setTranslating] = useState<string | null>(null)
  const [editingBulletIdx, setEditingBulletIdx] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [editingHeader, setEditingHeader] = useState(false)
  // Track translation source per bullet: 'dictionary' or 'ai'
  const [bulletSources, setBulletSources] = useState<Record<number, 'dictionary' | 'ai'>>({})
  const [alreadyCivilianBullets, setAlreadyCivilianBullets] = useState<Record<number, string>>({})
  const [correctionIdx, setCorrectionIdx] = useState<number | null>(null)
  const [correctionMilitary, setCorrectionMilitary] = useState('')
  const [correctionCivilian, setCorrectionCivilian] = useState('')
  const [correctionSubmitting, setCorrectionSubmitting] = useState(false)
  const [correctionSuccess, setCorrectionSuccess] = useState<number | null>(null)
  // Help Translate prompt state (once per session)
  const [helpPromptIdx, setHelpPromptIdx] = useState<number | null>(null)
  const [helpPromptPhrase, setHelpPromptPhrase] = useState<string>('')
  // Track vague phrases and verb suggestions per bullet
  const [bulletVagueFlags, setBulletVagueFlags] = useState<Record<number, VagueFlag[]>>({})
  const [bulletVerbSuggestions, setBulletVerbSuggestions] = useState<Record<number, VerbSuggestion[]>>({})
  const [upgradeNudgeIdx, setUpgradeNudgeIdx] = useState<number | null>(null)
  // Bullet suggestions from dict_bullet_patterns
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<{ pattern: DictBulletPattern; populated: string; score: number }[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  // Eval-derived bullet suggestions
  const [evalSuggestions, setEvalSuggestions] = useState<{ original: string; translated: string; coverage: number }[]>([])
  const [hasEvalData, setHasEvalData] = useState(false)
  // Paste eval text for manual translation
  const [showPasteBox, setShowPasteBox] = useState(false)
  const [pasteText, setPasteText] = useState('')
  const [pasteSuggestions, setPasteSuggestions] = useState<{ original: string; translated: string; coverage: number }[]>([])
  const [translatingPaste, setTranslatingPaste] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
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
    newBullets.unshift(newBullet)
    onChange({ ...experience, bullets: newBullets })
    // Reset per-index state since indices shifted
    setBulletSources({})
    setBulletVagueFlags({})
    setBulletVerbSuggestions({})
    setAlreadyCivilianBullets({})
    // Start editing the new bullet at index 0
    handleStartEdit(0, '')
  }

  const handleShowSuggestions = async () => {
    if (showSuggestions) {
      setShowSuggestions(false)
      return
    }
    setLoadingSuggestions(true)
    setShowSuggestions(true)
    try {
      const dict = await getDictionary()
      const patterns = dict.bulletPatterns ?? []
      const jobTitle = experience.civilian_title || experience.job_title || ''
      const rankTier = getRankTierFromPaygrade(userProfile?.paygrade)

      // Score all patterns, then select top 5 with category diversity
      const allScored = patterns
        .map(pattern => ({ pattern, score: scoreBulletPattern(pattern, jobTitle, rankTier, targetRole) }))

      const top5 = selectDiverseSuggestions(allScored, 5)

      const scored = top5.map((item, idx) => {
        const ctx: BulletPopulateContext = {
          branch: userProfile?.branch || '',
          paygrade: userProfile?.paygrade || '',
          yearsOfService: userProfile?.years_of_service || '',
          jobTitle,
          civilianTitle: experience.civilian_title || '',
          organization: experience.organization || '',
          category: item.pattern.category || 'leadership',
          suggestionIndex: idx,
        }
        return {
          pattern: item.pattern,
          populated: polishBullet(populateBulletTemplate(item.pattern.pattern_template, ctx, dict)),
          score: item.score,
        }
      })

      setSuggestions(scored)

      // Fetch eval uploads for eval-derived suggestions
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: evalUploads } = await supabase
            .from('eval_uploads')
            .select('extracted_data')
            .eq('user_id', user.id)
            .eq('status', 'complete')
            .order('created_at', { ascending: false })

          if (evalUploads && evalUploads.length > 0) {
            setHasEvalData(true)
            // Concatenate all eval text from uploads and run through new parser
            const allEvalText: string[] = []
            for (const upload of evalUploads) {
              const bullets = upload.extracted_data as any[] | null
              if (Array.isArray(bullets)) {
                for (const b of bullets) {
                  if (b.original && typeof b.original === 'string') {
                    allEvalText.push(b.original)
                  }
                }
              }
            }

            if (allEvalText.length > 0) {
              const combinedText = allEvalText.join('\n')
              const results = await parseAndTranslateEvalText(
                combinedText,
                userProfile?.branch || '',
                userProfile?.rank || '',
              )
              setEvalSuggestions(
                results.map(r => ({
                  original: r.original,
                  translated: r.translated,
                  coverage: r.coverage,
                }))
              )
            }
          } else {
            setHasEvalData(false)
            setEvalSuggestions([])
          }
        }
      } catch {
        // Eval fetch failed — not critical, generic suggestions still work
        setHasEvalData(false)
      }
    } catch {
      setSuggestions([])
    } finally {
      setLoadingSuggestions(false)
    }
  }

  // Translate pasted eval text through dictionary pipeline
  const handlePasteTranslate = async () => {
    if (!pasteText.trim()) return
    setTranslatingPaste(true)
    try {
      const results = await parseAndTranslateEvalText(
        pasteText,
        userProfile?.branch || '',
        userProfile?.rank || '',
      )
      setPasteSuggestions(
        results.map(r => ({
          original: r.original,
          translated: r.translated,
          coverage: r.coverage,
        }))
      )
    } catch {
      setPasteSuggestions([])
    } finally {
      setTranslatingPaste(false)
    }
  }

  // Insert eval-derived bullet directly (Use button)
  const handleUseEvalSuggestion = (translatedText: string) => {
    const newBullets = [...(experience.bullets || [])]
    const newBullet = {
      id: `eval-${Date.now()}`,
      original_text: '',
      translated_text: translatedText,
      status: 'pending',
    }
    newBullets.unshift(newBullet)
    onChange({ ...experience, bullets: newBullets })
    setBulletSources({ 0: 'dictionary' })
    setBulletVagueFlags({})
    setBulletVerbSuggestions({})
    setAlreadyCivilianBullets({})
  }

  // Insert eval-derived bullet into edit field for user to customize
  const handleEditBeforeUsing = (translatedText: string) => {
    const newBullets = [...(experience.bullets || [])]
    const newBullet = {
      id: `eval-${Date.now()}`,
      original_text: '',
      translated_text: translatedText,
      status: 'pending',
    }
    newBullets.unshift(newBullet)
    onChange({ ...experience, bullets: newBullets })
    setBulletSources({ 0: 'dictionary' })
    setBulletVagueFlags({})
    setBulletVerbSuggestions({})
    setAlreadyCivilianBullets({})
    // Open the edit field so user can customize
    handleStartEdit(0, translatedText)
  }

  const handleUseSuggestion = (populatedText: string) => {
    const newBullets = [...(experience.bullets || [])]
    const newBullet = {
      id: `dict-${Date.now()}`,
      original_text: '',
      translated_text: populatedText,
      status: 'pending',
    }
    newBullets.unshift(newBullet)
    onChange({ ...experience, bullets: newBullets })
    setBulletSources({ 0: 'dictionary' })
    setBulletVagueFlags({})
    setBulletVerbSuggestions({})
    setAlreadyCivilianBullets({})
    setShowSuggestions(false)
  }

  const handleDeleteBullet = (bulletIdx: number) => {
    if (!confirm('Delete this bullet permanently?')) return
    const newBullets = (experience.bullets || []).filter((_: any, idx: number) => idx !== bulletIdx)
    onChange({ ...experience, bullets: newBullets })
  }

  const handleTranslateBullet = async (bulletIdx: number, originalText: string) => {
    setTranslating(bulletIdx.toString())

    try {
      // Step 1: Try dictionary translation first (free, instant, client-side)
      const dictResult = await translateBullet(originalText, {
        branch: userProfile?.branch || '',
        rank: userProfile?.rank || '',
      })

      // Store vague phrases and verb suggestions regardless of source
      if (dictResult.vagueFlags.length > 0) {
        setBulletVagueFlags(prev => ({ ...prev, [bulletIdx]: dictResult.vagueFlags }))
      }
      if (dictResult.verbSuggestions.length > 0) {
        setBulletVerbSuggestions(prev => ({ ...prev, [bulletIdx]: dictResult.verbSuggestions }))
      }

      // Step 2: If dictionary coverage >= 40%, use dictionary result (no API call)
      if (dictResult.dictionarySufficient) {
        if (dictResult.alreadyCivilian) {
          setAlreadyCivilianBullets(prev => ({
            ...prev,
            [bulletIdx]: dictResult.alreadyCivilianMessage || 'Already civilian-ready — no translation needed',
          }))
          setBulletSources(prev => ({ ...prev, [bulletIdx]: 'dictionary' }))
          return
        }
        const newBullets = [...(experience.bullets || [])]
        newBullets[bulletIdx] = {
          ...newBullets[bulletIdx],
          translated_text: dictResult.translatedText,
        }
        onChange({ ...experience, bullets: newBullets })
        setBulletSources(prev => ({ ...prev, [bulletIdx]: 'dictionary' }))
        return
      }

      // Show Help Translate prompt (once per session) for low-coverage bullets
      if (dictResult.unmatchedPhrases?.length > 0 && !sessionStorage.getItem('dict-help-prompted')) {
        sessionStorage.setItem('dict-help-prompted', '1')
        setHelpPromptIdx(bulletIdx)
        setHelpPromptPhrase(dictResult.unmatchedPhrases[0])
      }

      // Free tier: use dictionary result as-is, skip AI
      if (isFreeUser) {
        const newBullets = [...(experience.bullets || [])]
        newBullets[bulletIdx] = {
          ...newBullets[bulletIdx],
          translated_text: dictResult.translatedText,
        }
        onChange({ ...experience, bullets: newBullets })
        setBulletSources(prev => ({ ...prev, [bulletIdx]: 'dictionary' }))
        setUpgradeNudgeIdx(bulletIdx)
        return
      }

      // Step 3: Dictionary coverage < 40% — fall back to AI
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
        setBulletSources(prev => ({ ...prev, [bulletIdx]: 'ai' }))
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
                  autoComplete="off"
                  className="w-full px-3 py-2 bg-bg-secondary border border-border rounded text-sm focus:border-gold focus:ring-1 focus:ring-gold/25"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Organization</label>
                <input
                  type="text"
                  value={headerForm.organization}
                  onChange={(e) => setHeaderForm({ ...headerForm, organization: e.target.value })}
                  autoComplete="organization"
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
                  autoComplete="off"
                  className="w-full px-3 py-2 bg-bg-secondary border border-border rounded text-sm focus:border-gold focus:ring-1 focus:ring-gold/25"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Start Date</label>
                <input
                  type="month"
                  value={headerForm.start_date}
                  onChange={(e) => setHeaderForm({ ...headerForm, start_date: e.target.value })}
                  autoComplete="off"
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
                    autoComplete="off"
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

      {/* Federal Experience Fields — always visible for federal resumes */}
      {resumeType === 'federal' && (
        <div className="mb-3 p-3 bg-bg-secondary rounded-lg border border-border/50">
          <div className="text-xs font-semibold uppercase tracking-wider text-text-dim mb-2">Federal Details</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-text-dim mb-1">Grade / GS Level</label>
              <input
                type="text"
                value={experience.grade_level || ''}
                onChange={(e) => onChange({ ...experience, grade_level: e.target.value })}
                placeholder="e.g., GS-12"
                autoComplete="off"
                className="w-full px-2 py-1.5 bg-bg-tertiary border border-border rounded text-xs focus:border-gold focus:ring-1 focus:ring-gold/25"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-text-dim mb-1">Hours / Week</label>
              <input
                type="number"
                value={experience.hours_per_week ?? 40}
                onChange={(e) => onChange({ ...experience, hours_per_week: parseInt(e.target.value) || 40 })}
                autoComplete="off"
                className="w-full px-2 py-1.5 bg-bg-tertiary border border-border rounded text-xs focus:border-gold focus:ring-1 focus:ring-gold/25"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-text-dim mb-1">Salary</label>
              <input
                type="text"
                value={experience.salary || ''}
                onChange={(e) => onChange({ ...experience, salary: e.target.value })}
                placeholder="e.g., $85,000"
                autoComplete="off"
                className="w-full px-2 py-1.5 bg-bg-tertiary border border-border rounded text-xs focus:border-gold focus:ring-1 focus:ring-gold/25"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-text-dim mb-1">Location</label>
              <input
                type="text"
                value={experience.city && experience.state ? `${experience.city}, ${experience.state}` : experience.city || experience.state || experience.location || ''}
                onChange={(e) => {
                  const parts = e.target.value.split(',').map((s: string) => s.trim())
                  onChange({ ...experience, city: parts[0] || '', state: parts[1] || '' })
                }}
                placeholder="City, ST"
                autoComplete="off"
                className="w-full px-2 py-1.5 bg-bg-tertiary border border-border rounded text-xs focus:border-gold focus:ring-1 focus:ring-gold/25"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-text-dim mb-1">Supervisor Name</label>
              <input
                type="text"
                value={experience.supervisor_name || ''}
                onChange={(e) => onChange({ ...experience, supervisor_name: e.target.value })}
                placeholder="Supervisor name"
                autoComplete="name"
                className="w-full px-2 py-1.5 bg-bg-tertiary border border-border rounded text-xs focus:border-gold focus:ring-1 focus:ring-gold/25"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-text-dim mb-1">Supervisor Phone</label>
              <input
                type="text"
                value={experience.supervisor_phone || ''}
                onChange={(e) => onChange({ ...experience, supervisor_phone: e.target.value })}
                placeholder="(555) 555-5555"
                autoComplete="tel"
                className="w-full px-2 py-1.5 bg-bg-tertiary border border-border rounded text-xs focus:border-gold focus:ring-1 focus:ring-gold/25"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={experience.supervisor_can_contact !== false}
                  onChange={(e) => onChange({ ...experience, supervisor_can_contact: e.target.checked })}
                  className="w-3.5 h-3.5 accent-gold"
                />
                May contact supervisor
              </label>
            </div>
          </div>
        </div>
      )}

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

      {/* Bullet Count Recommendation */}
      <div className="flex items-center justify-between mt-3 mb-1">
        <span className="text-xs text-text-dim font-medium uppercase tracking-wider">Bullets</span>
        <BulletCountIndicator count={activeBullets.length} index={experienceIndex} />
      </div>

      {/* Action buttons row — Add Bullet + More dropdown */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button
          onClick={handleAddBullet}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-gold/20 text-gold border border-gold/30 rounded hover:bg-gold/30 transition-colors text-xs font-medium"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Bullet
        </button>
        <div className="relative">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-bg-tertiary text-text-muted border border-border hover:border-gold/30 hover:text-text rounded transition-colors text-xs font-medium"
          >
            <span>⋮</span>
            More
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showMoreMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMoreMenu(false)} />
              <div className="absolute left-0 top-full mt-1 z-20 bg-bg-card border border-border rounded-lg shadow-lg py-1 min-w-[180px]">
                <button
                  onClick={() => { handleShowSuggestions(); setShowMoreMenu(false) }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-bg-hover transition-colors flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5 text-status-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>Suggest Bullets</span>
                  <span className="text-[10px] text-status-green ml-auto">Free</span>
                </button>
                <a
                  href="/profile"
                  onClick={() => setShowMoreMenu(false)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-bg-hover transition-colors flex items-center gap-2 no-underline text-text-muted"
                >
                  <span>&#128196;</span>
                  <span>Import Eval</span>
                  <span className="text-[10px] text-text-dim ml-auto">On Profile</span>
                </a>
                <button
                  onClick={() => { if (!showSuggestions) setShowSuggestions(true); setShowPasteBox(true); setShowMoreMenu(false) }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-bg-hover transition-colors flex items-center gap-2"
                >
                  <span>&#128203;</span>
                  <span>Paste Eval</span>
                  <span className="text-[10px] text-status-green ml-auto">Free</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Active Bullets */}
      <div className="space-y-3 mt-2">
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
                  autoComplete="off"
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
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wider text-gold">Translated:</span>
                      {bulletSources[bullet._idx] === 'dictionary' && (
                        <span className="text-xs text-status-green" title="Translated using dictionary — no AI cost">
                          Dictionary translated
                        </span>
                      )}
                      {bulletSources[bullet._idx] === 'ai' && (
                        <span className="text-xs text-status-amber" title="Translated using AI — counts against limit">
                          AI enhanced
                        </span>
                      )}
                    </div>
                    <p className={bullet.status === 'accepted' ? 'text-status-green' : ''}>{bullet.translated_text}</p>

                    {/* Vague phrase warnings */}
                    {bulletVagueFlags[bullet._idx]?.length > 0 && bullet.status !== 'accepted' && (
                      <div className="mt-1 p-2 bg-status-amber/10 rounded text-xs">
                        <span className="font-medium text-status-amber">Vague phrases detected:</span>
                        {bulletVagueFlags[bullet._idx].map((flag, i) => (
                          <div key={i} className="mt-1">
                            <span className="text-text-muted">&quot;{flag.phrase}&quot;</span>
                            <span className="text-text-dim"> — try: </span>
                            <span className="text-text">{flag.alternatives.slice(0, 2).join(' or ')}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Verb suggestions */}
                    {bulletVerbSuggestions[bullet._idx]?.length > 0 && bullet.status !== 'accepted' && (
                      <div className="mt-1 p-2 bg-gold/10 rounded text-xs">
                        <span className="font-medium text-gold">Stronger verb options:</span>
                        <span className="text-text-muted"> Replace &quot;{bulletVerbSuggestions[bullet._idx][0].current}&quot; with </span>
                        <span className="text-text">{bulletVerbSuggestions[bullet._idx].map(v => v.suggested).join(', ')}</span>
                      </div>
                    )}
                  </div>
                ) : !bullet.original_text && (
                  <div className="text-sm mb-2">
                    <p className="text-text-dim italic">Empty bullet — click Edit to add text</p>
                  </div>
                )}

                {/* Already civilian-ready message */}
                {alreadyCivilianBullets[bullet._idx] && (
                  <div className="p-2 bg-status-green/10 border border-status-green/30 rounded text-sm mb-2">
                    <p className="text-status-green font-medium">{alreadyCivilianBullets[bullet._idx]}</p>
                    <div className="flex gap-2 mt-1.5">
                      <button
                        type="button"
                        onClick={() => setAlreadyCivilianBullets(prev => { const n = { ...prev }; delete n[bullet._idx]; return n })}
                        className="px-2 py-0.5 text-xs bg-status-green text-bg-primary rounded hover:bg-status-green/90"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => setAlreadyCivilianBullets(prev => { const n = { ...prev }; delete n[bullet._idx]; return n })}
                        className="px-2 py-0.5 text-xs text-text-dim hover:text-text-muted"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  {!bullet.translated_text && bullet.original_text && !alreadyCivilianBullets[bullet._idx] && (
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

                {/* Suggest a correction — shown on dictionary-translated bullets */}
                {bullet.translated_text && bulletSources[bullet._idx] === 'dictionary' && bullet.status !== 'accepted' && (
                  <div className="mt-1">
                    {correctionSuccess === bullet._idx ? (
                      <p className="text-xs text-status-green">Thanks! Every correction helps keep Debriefed free for all veterans.</p>
                    ) : correctionIdx === bullet._idx ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <input
                          type="text"
                          value={correctionMilitary}
                          onChange={(e) => setCorrectionMilitary(e.target.value)}
                          placeholder="e.g. CSMP"
                          autoComplete="off"
                          className="px-2 py-1 text-xs bg-bg-secondary border border-border rounded w-32 focus:border-gold focus:ring-1 focus:ring-gold/25"
                        />
                        <input
                          type="text"
                          value={correctionCivilian}
                          onChange={(e) => setCorrectionCivilian(e.target.value)}
                          placeholder="e.g. maintenance backlog"
                          autoComplete="off"
                          className="px-2 py-1 text-xs bg-bg-secondary border border-border rounded w-44 focus:border-gold focus:ring-1 focus:ring-gold/25"
                        />
                        <button
                          type="button"
                          disabled={correctionSubmitting || !correctionMilitary.trim() || !correctionCivilian.trim()}
                          onClick={async () => {
                            setCorrectionSubmitting(true)
                            await submitTerm({
                              submission_type: 'phrase',
                              military_term: correctionMilitary.trim(),
                              suggested_civilian: correctionCivilian.trim(),
                              branch: userProfile?.branch || 'general',
                              category: 'phrase_translation',
                            })
                            setCorrectionSubmitting(false)
                            setCorrectionIdx(null)
                            setCorrectionMilitary('')
                            setCorrectionCivilian('')
                            setCorrectionSuccess(bullet._idx)
                            setTimeout(() => setCorrectionSuccess(null), 3000)
                          }}
                          className="px-2 py-1 text-xs bg-gold text-bg-primary rounded hover:bg-gold-bright disabled:opacity-50"
                        >
                          {correctionSubmitting ? '...' : 'Submit'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setCorrectionIdx(null); setCorrectionMilitary(''); setCorrectionCivilian('') }}
                          className="text-xs text-text-dim hover:text-text-muted"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 hover:text-gold cursor-pointer mt-1" onClick={() => setCorrectionIdx(bullet._idx)}>
                        See something wrong? <span className="underline">Suggest a correction</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Help Translate prompt for low-coverage bullets */}
                {helpPromptIdx === bullet._idx && helpPromptPhrase && (
                  <HelpTranslatePrompt
                    unmatchedPhrase={helpPromptPhrase}
                    branch={userProfile?.branch || undefined}
                    onDismiss={() => {
                      setHelpPromptIdx(null)
                      setHelpPromptPhrase('')
                    }}
                  />
                )}

                {/* Upgrade nudge for free users after dictionary-only translation */}
                {upgradeNudgeIdx === bullet._idx && isFreeUser && (
                  <p className="text-xs text-text-dim mt-1.5">
                    Dictionary translation applied.{' '}
                    <UpgradeLink className="text-gold hover:text-gold-bright hover:underline">Upgrade to Core</UpgradeLink>
                    {' '}for AI-enhanced translations.
                  </p>
                )}
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

        {/* Bullet Suggestions Panel — 3 sections */}
        {showSuggestions && (
          <div className="mt-2 space-y-2">
            {/* Section 1: From Your Evaluation */}
            <div className="border border-gold/30 rounded-lg bg-bg-secondary overflow-hidden">
              <div className="px-3 py-2 bg-gold/10 border-b border-gold/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gold uppercase tracking-wider">From Your Evaluation</span>
                  <span className="text-xs text-text-dim">Free — dictionary translation</span>
                </div>
                {evalSuggestions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setEvalSuggestions([])}
                    className="text-[10px] text-text-dim hover:text-text-muted transition-colors"
                  >
                    Dismiss All
                  </button>
                )}
              </div>
              {loadingSuggestions ? (
                <div className="p-3 text-xs text-text-dim">Loading eval data...</div>
              ) : evalSuggestions.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {evalSuggestions.map((es, i) => (
                    <div key={`eval-${i}`} className="px-3 py-2.5 hover:bg-bg-hover transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-text-dim italic mb-1">{es.original}</p>
                          <p className="text-sm text-text leading-relaxed">{es.translated}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEvalSuggestions(prev => prev.filter((_, idx) => idx !== i))}
                          className="flex-shrink-0 p-0.5 text-text-dim hover:text-text-muted transition-colors"
                          title="Dismiss"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <button
                          type="button"
                          onClick={() => handleUseEvalSuggestion(es.translated)}
                          className="text-[11px] px-2 py-0.5 bg-gold/20 text-gold border border-gold/30 rounded hover:bg-gold/30 transition-colors"
                        >
                          Use
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditBeforeUsing(es.translated)}
                          className="text-[11px] px-2 py-0.5 bg-bg-tertiary text-text-muted border border-border rounded hover:bg-bg-hover transition-colors"
                        >
                          Edit before using
                        </button>
                        <span className="text-[10px] text-text-dim">{es.coverage}% dict coverage</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3">
                  <p className="text-xs text-text-dim mb-2">
                    {hasEvalData
                      ? 'No translatable statements found in your evaluations.'
                      : 'No evaluations found. Upload an eval or paste your eval text below.'}
                  </p>
                  {/* Paste eval text box */}
                  <button
                    type="button"
                    onClick={() => setShowPasteBox(!showPasteBox)}
                    className="text-xs text-gold hover:underline flex items-center gap-1"
                  >
                    Paste Eval Text {showPasteBox ? '\u25B2' : '\u25BC'}
                  </button>
                  {showPasteBox && (
                    <div className="mt-2 space-y-2">
                      <textarea
                        value={pasteText}
                        onChange={(e) => setPasteText(e.target.value)}
                        placeholder="Paste your evaluation write-up text here..."
                        autoComplete="off"
                        className="w-full min-h-[80px] px-3 py-2 bg-bg-tertiary border border-border rounded text-sm resize-none focus:border-gold focus:ring-1 focus:ring-gold/25"
                      />
                      <button
                        type="button"
                        onClick={handlePasteTranslate}
                        disabled={!pasteText.trim() || translatingPaste}
                        className="text-xs px-3 py-1.5 bg-gold/20 text-gold border border-gold/30 rounded hover:bg-gold/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {translatingPaste ? 'Translating...' : 'Translate'}
                      </button>
                      {pasteSuggestions.length > 0 && (
                        <div className="border border-border/50 rounded overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-bg-tertiary border-b border-border/50">
                            <span className="text-[10px] text-text-dim">{pasteSuggestions.length} result{pasteSuggestions.length !== 1 ? 's' : ''}</span>
                            <button
                              type="button"
                              onClick={() => setPasteSuggestions([])}
                              className="text-[10px] text-text-dim hover:text-text-muted transition-colors"
                            >
                              Dismiss All
                            </button>
                          </div>
                          <div className="divide-y divide-border/50">
                            {pasteSuggestions.map((ps, i) => (
                              <div key={`paste-${i}`} className="px-3 py-2.5 hover:bg-bg-hover transition-colors">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs text-text-dim italic mb-1">{ps.original}</p>
                                    <p className="text-sm text-text leading-relaxed">{ps.translated}</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setPasteSuggestions(prev => prev.filter((_, idx) => idx !== i))}
                                    className="flex-shrink-0 p-0.5 text-text-dim hover:text-text-muted transition-colors"
                                    title="Dismiss"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                                <div className="flex items-center gap-2 mt-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleUseEvalSuggestion(ps.translated)}
                                    className="text-[11px] px-2 py-0.5 bg-gold/20 text-gold border border-gold/30 rounded hover:bg-gold/30 transition-colors"
                                  >
                                    Use
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleEditBeforeUsing(ps.translated)}
                                    className="text-[11px] px-2 py-0.5 bg-bg-tertiary text-text-muted border border-border rounded hover:bg-bg-hover transition-colors"
                                  >
                                    Edit before using
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Section 2: General Templates */}
            <div className="border border-status-green/30 rounded-lg bg-bg-secondary overflow-hidden">
              <div className="px-3 py-2 bg-status-green/10 border-b border-status-green/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-status-green uppercase tracking-wider">General Templates</span>
                  <span className="text-xs text-text-dim">Free — no AI cost</span>
                </div>
                {suggestions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => { setSuggestions([]); setShowSuggestions(false) }}
                    className="text-[10px] text-text-dim hover:text-text-muted transition-colors"
                  >
                    Dismiss All
                  </button>
                )}
              </div>
              {loadingSuggestions ? (
                <div className="p-3 text-xs text-text-dim">Loading templates...</div>
              ) : suggestions.length === 0 ? (
                <div className="p-3 text-xs text-text-dim">No matching bullet patterns found for this role.</div>
              ) : (
                <div className="divide-y divide-border/50">
                  {suggestions.map((s, i) => (
                    <div
                      key={s.pattern.id || i}
                      className="px-3 py-2.5 hover:bg-bg-hover transition-colors group/sug"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleUseSuggestion(s.populated)}
                          className="flex-1 text-left"
                        >
                          <p className="text-sm text-text-secondary group-hover/sug:text-text leading-relaxed">{s.populated}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] px-1.5 py-0.5 bg-bg-tertiary text-text-dim rounded">{s.pattern.category}</span>
                            {s.pattern.rank_tier && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-bg-tertiary text-text-dim rounded">{s.pattern.rank_tier.replace(/_/g, ' ')}</span>
                            )}
                            <span className="text-xs text-status-green opacity-0 group-hover/sug:opacity-100 transition-opacity">Use</span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSuggestions(prev => prev.filter((_, idx) => idx !== i))}
                          className="flex-shrink-0 p-0.5 text-text-dim hover:text-text-muted transition-colors"
                          title="Dismiss"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
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
                autoComplete="off"
                className="w-full px-3 py-2 bg-bg-secondary border border-border rounded text-sm focus:border-gold focus:ring-1 focus:ring-gold/25"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Degree</label>
              <input
                type="text"
                value={form.degree_type}
                onChange={(e) => setForm({ ...form, degree_type: e.target.value })}
                autoComplete="off"
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
                autoComplete="off"
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
                  autoComplete="off"
                  className="w-1/2 px-3 py-2 bg-bg-secondary border border-border rounded text-sm focus:border-gold focus:ring-1 focus:ring-gold/25"
                />
                <input
                  type="text"
                  value={form.graduation_year}
                  onChange={(e) => setForm({ ...form, graduation_year: e.target.value })}
                  placeholder="Year"
                  autoComplete="off"
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
                autoComplete="off"
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
