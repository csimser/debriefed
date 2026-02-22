'use client'

import { useState, useEffect, useRef } from 'react'
import { ResumeForm } from './ResumeForm'
import { ResumePreview } from './ResumePreview'
import { DeleteResumeModal } from './DeleteResumeModal'
import { ExportMenu } from './ExportMenu'
import { PageLengthIndicator, useContentHeight } from './PageLengthIndicator'
import { FederalTrimSuggestions } from './FederalTrimSuggestions'
import { estimateFederalOverflow } from '@/lib/resume/federalTrimmer'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/client'
import { TEMPLATES, SELECTABLE_TEMPLATES, TemplateId, resolveTemplate, isTemplateFreeTier } from '@/lib/templates'
import { getUserTier, isPaidTier, TIER_LIMITS } from '@/lib/tier-utils'
import { UpgradeLink, useUpgradeModal } from '@/components/modals/UpgradeModal'

interface ResumeEditorProps {
  userId: string
  userPlan: string
  resumes: any[]
  profileData: {
    userProfile: any
    experiences: any[]
    education: any[]
    certifications: any[]
    skills: any[]
  }
  usage?: {
    private_downloads: number
    federal_downloads: number
    bullet_rewrites?: number
    download_used?: number
    download_limit?: number
    download_remaining?: number
  }
}

// Helper to build initial content from profile data
function buildInitialContent(profileData: ResumeEditorProps['profileData']) {
  const { userProfile, experiences, education, certifications, skills } = profileData

  return {
    contact: {
      first_name: userProfile?.first_name || '',
      last_name: userProfile?.last_name || '',
      email: userProfile?.email || '',
      phone: userProfile?.phone || '',
      city: userProfile?.city || '',
      state: userProfile?.state || '',
      zip: userProfile?.zip || '',
      linkedin_url: userProfile?.linkedin_url || '',
    },
    summary: userProfile?.professional_summary || '',
    military: {
      branch: userProfile?.branch || '',
      rank: userProfile?.rank || '',
      paygrade: userProfile?.paygrade || '',
      rating_mos: userProfile?.rating_mos || '',
      years_of_service: userProfile?.years_of_service || '',
      clearance: userProfile?.clearance || '',
    },
    target: {
      industry: userProfile?.target_industry || '',
      role: userProfile?.target_role || '',
    },
    experiences: experiences?.map(exp => ({
      id: exp.id,
      job_title: exp.job_title || '',
      civilian_title: exp.civilian_title || '',
      organization: exp.organization || '',
      location: exp.location || '',
      start_date: exp.start_date || '',
      end_date: exp.end_date || '',
      is_current: exp.is_current || false,
      bullets: exp.bullets || [],
      city: exp.city || '',
      state: exp.state || '',
      hours_per_week: exp.hours_per_week || 40,
      salary: exp.salary || '',
      grade_level: exp.grade_level || '',
      supervisor_name: exp.supervisor_name || '',
      supervisor_phone: exp.supervisor_phone || '',
      supervisor_can_contact: exp.supervisor_can_contact !== false,
    })) || [],
    education: education || [],
    certifications: certifications || [],
    skills: (skills || []).slice(0, 12),
  }
}

// Generate auto-name from target role + date
function generateResumeName(targetRole?: string): string {
  const now = new Date()
  const month = now.toLocaleString('en-US', { month: 'short' })
  const year = now.getFullYear()
  const dateSuffix = `${month} ${year}`
  const role = targetRole?.trim()
  return role ? `${role} — ${dateSuffix}` : `My Resume — ${dateSuffix}`
}

// Check if name is an "Untitled Resume" variation
function isUntitledName(name: string): boolean {
  const n = name.trim().toLowerCase()
  return n === 'untitled resume' || n === 'untitled' || n === ''
}


export function ResumeEditor({ userId, userPlan, resumes: initialResumes, profileData, usage = { private_downloads: 0, federal_downloads: 0 } }: ResumeEditorProps) {
  const { openUpgradeModal } = useUpgradeModal()
  const [resumes, setResumes] = useState(initialResumes)
  const [selectedId, setSelectedId] = useState<string | null>(resumes[0]?.id || null)
  const [saving, setSaving] = useState(false)
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isResumeDropdownOpen, setIsResumeDropdownOpen] = useState(false)
  const resumeDropdownRef = useRef<HTMLDivElement>(null)
  const [showNameModal, setShowNameModal] = useState(false)
  const [newResumeName, setNewResumeName] = useState('')
  const [nameModalError, setNameModalError] = useState('')

  const supabase = createClient()

  // Check tier for limits
  const userTier = getUserTier({ tier: userPlan })
  const isFreeUser = !isPaidTier(userTier)

  const selectedResume = resumes.find(r => r.id === selectedId)

  // Resume limit check
  const resumeLimit = TIER_LIMITS[userTier].resumes
  const canCreateNew = resumes.length < resumeLimit

  // State for showing limit reached modal
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [limitModalMessage, setLimitModalMessage] = useState('')

  const handleLimitReached = (error: string, _tier: string) => {
    setLimitModalMessage(error)
    setShowLimitModal(true)
  }

  // Build initial content from profile data
  const initialContent = buildInitialContent(profileData)

  // Current resume state
  const [currentResume, setCurrentResume] = useState({
    name: 'Untitled Resume',
    template: 'classic_professional' as TemplateId,
    resume_type: 'private' as 'private' | 'federal',
    content: initialContent,
  })

  const isCurrentTemplateLocked = !isTemplateFreeTier(currentResume.template) && isFreeUser
  const isCurrentUntitled = selectedId ? isUntitledName(currentResume.name) : false

  // Federal page-length tracking
  const previewRef = useRef<HTMLDivElement>(null)
  const contentHeight = useContentHeight(previewRef)
  const isFederal = currentResume.resume_type === 'federal'
  const federalOverflow = isFederal ? estimateFederalOverflow(currentResume.content) : null

  // Close resume dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (resumeDropdownRef.current && !resumeDropdownRef.current.contains(e.target as Node)) {
        setIsResumeDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Sync skills/certs in resume content with current profile data
  const syncContentWithProfile = (content: any) => {
    const synced = { ...content }

    if (!synced.summary && profileData.userProfile?.professional_summary) {
      synced.summary = profileData.userProfile.professional_summary
    }

    if ((!synced.skills || synced.skills.length === 0) && profileData.skills?.length > 0) {
      synced.skills = profileData.skills.slice(0, 12)
    }

    if (content.skills?.length && profileData.skills?.length) {
      const profileSkillsByName = new Map(
        profileData.skills.map((s: any) => [s.name?.toLowerCase(), s])
      )
      synced.skills = content.skills
        .map((s: any) => {
          const name = (typeof s === 'string' ? s : s.name)?.toLowerCase()
          return profileSkillsByName.get(name) || s
        })
        .filter((s: any, i: number, arr: any[]) =>
          arr.findIndex((x: any) => x.name?.toLowerCase() === s.name?.toLowerCase()) === i
        )
    }

    if (content.certifications?.length && profileData.certifications?.length) {
      const profileCertsByName = new Map(
        profileData.certifications.map((c: any) => [c.name?.toLowerCase(), c])
      )
      synced.certifications = content.certifications
        .map((c: any) => profileCertsByName.get(c.name?.toLowerCase()) || c)
        .filter((c: any, i: number, arr: any[]) =>
          arr.findIndex((x: any) => x.name?.toLowerCase() === c.name?.toLowerCase()) === i
        )
    }

    if ((!content.experiences || content.experiences.length === 0) && profileData.experiences?.length > 0) {
      synced.experiences = profileData.experiences.map((exp: any) => ({
        id: exp.id,
        job_title: exp.job_title || '',
        civilian_title: exp.civilian_title || '',
        organization: exp.organization || '',
        location: exp.location || '',
        start_date: exp.start_date || '',
        end_date: exp.end_date || '',
        is_current: exp.is_current || false,
        bullets: exp.bullets || [],
        city: exp.city || '',
        state: exp.state || '',
        hours_per_week: exp.hours_per_week || 40,
        salary: exp.salary || '',
        grade_level: exp.grade_level || '',
        supervisor_name: exp.supervisor_name || '',
        supervisor_phone: exp.supervisor_phone || '',
        supervisor_can_contact: exp.supervisor_can_contact !== false,
      }))
    }

    if ((!content.education || content.education.length === 0) && profileData.education?.length > 0) {
      synced.education = [...profileData.education]
    }

    return synced
  }

  // Load selected resume
  useEffect(() => {
    if (selectedId) {
      const resume = resumes.find(r => r.id === selectedId)
      if (resume) {
        const hasContent = resume.content && Object.keys(resume.content).length > 0 &&
          (resume.content.contact?.first_name || resume.content.experiences?.length > 0)

        const content = hasContent ? syncContentWithProfile(resume.content) : initialContent

        setCurrentResume({
          name: resume.name,
          template: resolveTemplate(resume.template),
          resume_type: resume.resume_type || 'private',
          content,
        })
      }
    }
  }, [selectedId])

  // Sync resume name to list in real-time
  useEffect(() => {
    if (!selectedId) return
    setResumes(prev => prev.map(r =>
      r.id === selectedId ? { ...r, name: currentResume.name } : r
    ))
  }, [currentResume.name, selectedId])

  // Auto-save
  useEffect(() => {
    if (!selectedId) return

    const timeout = setTimeout(async () => {
      setSaving(true)
      await supabase
        .from('resumes')
        .update({
          name: currentResume.name,
          template: currentResume.template,
          resume_type: currentResume.resume_type,
          content: currentResume.content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedId)
      setSaving(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [currentResume, selectedId])

  const handleCreate = () => {
    if (!canCreateNew) {
      alert(`You've reached your ${userPlan} plan limit of ${resumeLimit} resume${resumeLimit > 1 ? 's' : ''}. Please upgrade to create more.`)
      return
    }
    setNewResumeName(generateResumeName(profileData.userProfile?.target_role))
    setNameModalError('')
    setShowNameModal(true)
  }

  const handleConfirmCreate = async () => {
    const trimmed = newResumeName.trim()
    if (trimmed.length < 3) return
    if (isUntitledName(trimmed)) {
      setNameModalError('Please choose a specific name for your resume')
      return
    }

    setShowNameModal(false)
    const newContent = buildInitialContent(profileData)

    try {
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: userId,
          name: trimmed,
          template: 'classic_professional',
          resume_type: 'private',
          content: newContent,
        })
        .select()
        .single()

      if (error) {
        console.error('Create resume error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        })
        alert(`Failed to create resume: ${error.message || error.code || 'Permission denied'}`)
        return
      }

      if (data) {
        setResumes([data, ...resumes])
        setSelectedId(data.id)
      }
    } catch (err: any) {
      console.error('Create resume exception:', err)
      alert(`Error: ${err?.message || 'Unknown error'}`)
    }
  }

  const handleDelete = (deletedId: string) => {
    const updatedResumes = resumes.filter(r => r.id !== deletedId)
    setResumes(updatedResumes)

    if (selectedId === deletedId) {
      setSelectedId(updatedResumes[0]?.id || null)
    }
  }

  // Get current template display name
  const currentTemplateName = TEMPLATES[currentResume.template]?.name || 'Classic Professional'

  return (
    <div className="flex flex-col h-full">
      {/* ── Top Bar: Resume Selector + Type Toggle + New Button ── */}
      <div className="bg-bg-secondary border-b border-border px-3 md:px-4 py-2">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Resume dropdown */}
          <div className="relative flex-shrink-0" ref={resumeDropdownRef}>
            <button
              onClick={() => setIsResumeDropdownOpen(!isResumeDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-bg-tertiary border border-border rounded-lg hover:border-border-bright transition-colors max-w-[240px]"
            >
              <span className="font-heading text-sm font-semibold truncate">
                {currentResume.name || 'Untitled Resume'}
              </span>
              <svg className={`w-4 h-4 text-text-muted flex-shrink-0 transition-transform ${isResumeDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isResumeDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-72 bg-bg-card border border-border rounded-lg shadow-xl z-30 overflow-hidden">
                <div className="max-h-64 overflow-auto">
                  {resumes.map((resume) => (
                    <button
                      key={resume.id}
                      onClick={() => {
                        setSelectedId(resume.id)
                        setIsResumeDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-3 text-left transition-colors flex items-center justify-between ${
                        selectedId === resume.id
                          ? 'bg-gold-dim text-gold'
                          : 'hover:bg-bg-tertiary'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="font-heading text-sm font-semibold truncate">{resume.name || 'Untitled'}</div>
                        <div className="text-xs text-text-muted mt-0.5">
                          {new Date(resume.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                      {selectedId === resume.id && (
                        <span className="text-gold text-xs flex-shrink-0 ml-2">&#10003;</span>
                      )}
                    </button>
                  ))}
                  {resumes.length === 0 && (
                    <div className="px-4 py-6 text-center text-text-muted text-sm">No resumes yet</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Center: Type toggle + save indicator */}
          <div className="flex items-center gap-3">
            <div className="flex bg-bg-tertiary rounded-lg p-0.5">
              <button
                onClick={() => setCurrentResume(prev => ({
                  ...prev,
                  resume_type: 'private',
                  template: prev.template === 'federal' ? 'classic_professional' : prev.template,
                }))}
                className={`px-3 py-1.5 rounded-md text-xs font-heading uppercase tracking-wider transition-all ${
                  currentResume.resume_type === 'private'
                    ? 'bg-gold text-bg-primary'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                Private
              </button>
              <button
                onClick={() => setCurrentResume(prev => ({
                  ...prev,
                  resume_type: 'federal',
                  template: 'federal' as TemplateId,
                }))}
                className={`px-3 py-1.5 rounded-md text-xs font-heading uppercase tracking-wider transition-all ${
                  currentResume.resume_type === 'federal'
                    ? 'bg-gold text-bg-primary'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                Federal
              </button>
            </div>
            {saving && <Badge variant="amber">Saving...</Badge>}
          </div>

          {/* Right: + New Resume */}
          <button
            onClick={handleCreate}
            disabled={!canCreateNew}
            className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-sm font-heading uppercase tracking-wider hover:border-gold hover:text-gold transition-colors disabled:opacity-50 disabled:hover:border-border disabled:hover:text-current flex-shrink-0"
          >
            <span>+</span>
            <span className="hidden sm:inline">New Resume</span>
          </button>
        </div>
      </div>

      {selectedId ? (
        <>
          {/* Mobile View Tabs */}
          <div className="md:hidden flex border-b border-border bg-bg-secondary">
            <button
              onClick={() => setMobileView('form')}
              className={`flex-1 py-4 font-heading text-sm uppercase tracking-wider transition-colors min-h-[52px] ${
                mobileView === 'form'
                  ? 'text-gold border-b-2 border-gold bg-gold/5'
                  : 'text-text-muted active:bg-bg-tertiary'
              }`}
            >
              Edit Resume
            </button>
            <button
              onClick={() => setMobileView('preview')}
              className={`flex-1 py-4 font-heading text-sm uppercase tracking-wider transition-colors min-h-[52px] ${
                mobileView === 'preview'
                  ? 'text-gold border-b-2 border-gold bg-gold/5'
                  : 'text-text-muted active:bg-bg-tertiary'
              }`}
            >
              Preview
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Left: Editor — 45% */}
            <div className={`w-full md:w-[45%] overflow-auto p-4 md:p-5 md:border-r border-border relative mobile-scroll ${
              mobileView === 'preview' ? 'hidden md:block' : ''
            }`}>
              {/* Inline editable resume name */}
              <div className="mb-4">
                {isCurrentUntitled && (
                  <p className="text-xs text-gold mb-1.5 font-semibold flex items-center gap-1">
                    <span>&#9888;</span> Please rename your resume before exporting
                  </p>
                )}
                <input
                  type="text"
                  value={currentResume.name}
                  onChange={(e) => setCurrentResume(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Resume Name"
                  autoComplete="off"
                  className={`w-full bg-transparent border-0 px-0 py-1 font-heading text-lg font-bold uppercase tracking-wider text-text placeholder:text-text-dim focus:ring-0 focus:outline-none ${
                    isCurrentUntitled
                      ? 'border-b-2 border-gold'
                      : 'border-b border-border focus:border-gold'
                  }`}
                />
              </div>

              {/* Template Pills — hidden for federal (always uses federal template) */}
              {currentResume.resume_type !== 'federal' && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">Template:</span>
                    {Object.values(SELECTABLE_TEMPLATES).map((template) => {
                      const isSelected = currentResume.template === template.id
                      const isLocked = !template.free && isFreeUser
                      return (
                        <button
                          key={template.id}
                          onClick={() => setCurrentResume(prev => ({ ...prev, template: template.id as TemplateId }))}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-heading uppercase tracking-wider transition-all ${
                            isSelected
                              ? 'bg-gold text-bg-primary font-bold'
                              : isLocked
                                ? 'border border-border text-text-dim hover:border-gold/30'
                                : 'border border-border text-text-muted hover:border-border-bright hover:text-text'
                          }`}
                        >
                          {isSelected && <span>&#10003;</span>}
                          {template.name}
                          {isLocked && !isSelected && (
                            <span className="text-[10px] text-gold font-bold ml-0.5">Core</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <p className="text-xs text-text-dim mb-4">
                Building from your Base Resume. Edit sections below to tailor for this specific role.
              </p>

              {isFederal && federalOverflow && (
                <FederalTrimSuggestions
                  isOverLimit={federalOverflow.isOverLimit}
                  experienceCount={federalOverflow.experienceCount}
                  bulletCounts={federalOverflow.bulletCounts}
                  hasSummary={(currentResume.content.summary?.length || 0) > 500}
                  hasAffiliations={((currentResume.content as any).affiliations?.length || 0) > 0}
                />
              )}

              <ResumeForm
                resumeId={selectedId || ''}
                content={currentResume.content}
                resumeType={currentResume.resume_type}
                onChange={(content) => setCurrentResume(prev => ({ ...prev, content }))}
                userProfile={profileData.userProfile}
                profileSummary={profileData.userProfile?.professional_summary}
                allSkills={profileData.skills}
                allCertifications={profileData.certifications}
                bulletTranslationUsage={usage?.bullet_rewrites || 0}
                bulletTranslationLimit={TIER_LIMITS[userTier]?.bullet_translations}
                userPlan={userPlan}
              />
            </div>

            {/* Right: Preview — 55% */}
            <div className={`w-full md:w-[55%] overflow-auto bg-bg-tertiary flex flex-col mobile-scroll ${
              mobileView === 'form' ? 'hidden md:block' : ''
            }`}>
              {/* Preview Header */}
              <div className="bg-bg-secondary border-b border-border px-4 py-2 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted">Preview</span>
                  <span className="text-xs text-text-dim">—</span>
                  <span className="text-xs font-heading font-semibold uppercase tracking-wider">{currentTemplateName}</span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Export */}
                  <ExportMenu
                    resumeId={selectedId || ''}
                    resumeName={currentResume.name}
                    userId={userId}
                    template={currentResume.template}
                    resumeType={currentResume.resume_type}
                    onLimitReached={handleLimitReached}
                    isTemplateLocked={isCurrentTemplateLocked}
                    isUntitled={isCurrentUntitled}
                    downloadRemaining={usage?.download_remaining}
                    downloadLimit={usage?.download_limit}
                  />

                  {/* Delete */}
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="p-1.5 text-text-muted hover:text-status-red hover:bg-status-red/10 rounded transition-all"
                    title="Delete resume"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 p-3 md:p-6">
                {/* Federal page indicator */}
                {isFederal && (
                  <div className="mb-2 flex justify-center">
                    <PageLengthIndicator
                      contentHeight={contentHeight}
                      format="federal"
                    />
                  </div>
                )}
                {/* Mobile hint */}
                <div className="md:hidden mb-3 text-center">
                  <p className="text-xs text-text-dim">Pinch to zoom | Scroll to see more</p>
                </div>
                <div className="pinch-zoom relative" ref={previewRef}>
                  <ResumePreview
                    template={currentResume.template}
                    resumeType={currentResume.resume_type}
                    content={currentResume.content}
                  />
                  {isCurrentTemplateLocked && (
                    <div className="absolute inset-0 backdrop-blur-md bg-black/20 flex flex-col items-center justify-center rounded-lg z-10">
                      <svg className="w-12 h-12 text-gold mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <p className="text-white font-heading text-sm uppercase tracking-wider mb-1">
                        Upgrade to Core to unlock this template
                      </p>
                      <p className="text-white/60 text-xs mb-4">
                        Preview is blurred — switch to Classic Professional or Federal to download
                      </p>
                      <UpgradeLink
                        className="px-5 py-2.5 bg-gold text-bg-primary font-heading text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-gold-bright transition-colors"
                      >
                        View Plans
                      </UpgradeLink>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <Card className="p-8 text-center">
            <div className="text-4xl mb-4">◫</div>
            <h2 className="font-heading text-xl font-bold uppercase mb-2">No Resume Selected</h2>
            <p className="text-text-muted mb-4">
              {canCreateNew
                ? 'Create a new resume to get started'
                : `You've reached your ${userPlan} plan limit of ${resumeLimit} resume${resumeLimit > 1 ? 's' : ''}.`
              }
            </p>
            {canCreateNew ? (
              <Button onClick={handleCreate}>+ Create Resume</Button>
            ) : (
              <Button variant="secondary" onClick={() => openUpgradeModal()}>
                Upgrade for More Resumes
              </Button>
            )}
          </Card>
        </div>
      )}

      {/* Delete Modal */}
      {selectedResume && (
        <DeleteResumeModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          resume={{
            id: selectedResume.id,
            name: selectedResume.name,
          }}
          onDeleted={() => handleDelete(selectedResume.id)}
        />
      )}

      {/* Limit Reached Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-status-amber/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-status-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h3 className="font-heading text-xl font-bold uppercase mb-2">Download Limit Reached</h3>
            <p className="text-text-muted mb-4">{limitModalMessage}</p>
            <div className="flex gap-3 justify-center">
              <Button variant="ghost" onClick={() => setShowLimitModal(false)}>
                Close
              </Button>
              <Button onClick={() => openUpgradeModal()}>
                Upgrade Now
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Name Resume Modal */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <h3 className="font-heading text-xl font-bold uppercase mb-1">Name Your Resume</h3>
            <p className="text-text-muted text-sm mb-4">
              Give your resume a descriptive name so you can find it later.
            </p>
            <input
              type="text"
              value={newResumeName}
              onChange={(e) => {
                setNewResumeName(e.target.value)
                if (nameModalError) setNameModalError('')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirmCreate()
                if (e.key === 'Escape') setShowNameModal(false)
              }}
              placeholder="e.g. Software Engineer — Feb 2026"
              autoFocus
              autoComplete="off"
              className="w-full mb-1"
            />
            {nameModalError && (
              <p className="text-xs text-status-red mb-3">{nameModalError}</p>
            )}
            {!nameModalError && (
              <p className="text-xs text-text-dim mb-3">
                {newResumeName.trim().length < 3
                  ? `${3 - newResumeName.trim().length} more character${3 - newResumeName.trim().length !== 1 ? 's' : ''} needed`
                  : 'Looks good!'
                }
              </p>
            )}
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowNameModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmCreate}
                disabled={newResumeName.trim().length < 3 || isUntitledName(newResumeName)}
              >
                Create Resume
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
