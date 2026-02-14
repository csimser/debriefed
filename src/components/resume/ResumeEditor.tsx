'use client'

import { useState, useEffect } from 'react'
import { ResumeSidebar } from './ResumeSidebar'
import { ResumeToolbar } from './ResumeToolbar'
import { ResumeForm } from './ResumeForm'
import { ResumePreview } from './ResumePreview'
import { DeleteResumeModal } from './DeleteResumeModal'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'
import { TEMPLATES, SELECTABLE_TEMPLATES, TemplateId, resolveTemplate, isTemplateFreeTier } from '@/lib/templates'
import { getUserTier, isPaidTier, TIER_LIMITS } from '@/lib/tier-utils'

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
    // Include military background for federal resumes
    military: {
      branch: userProfile?.branch || '',
      rank: userProfile?.rank || '',
      paygrade: userProfile?.paygrade || '',
      rating_mos: userProfile?.rating_mos || '',
      years_of_service: userProfile?.years_of_service || '',
      clearance: userProfile?.clearance || '',
    },
    // Include career goals
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
      // Federal resume fields
      city: exp.city || '',
      state: exp.state || '',
      hours_per_week: exp.hours_per_week || 40,
      salary: exp.salary || '',
      grade_level: exp.grade_level || '',
      supervisor_name: exp.supervisor_name || '',
      supervisor_phone: exp.supervisor_phone || '',
      supervisor_can_contact: exp.supervisor_can_contact !== false, // default true
    })) || [],
    education: education || [],
    certifications: certifications || [],
    skills: skills || [],
  }
}


export function ResumeEditor({ userId, userPlan, resumes: initialResumes, profileData, usage = { private_downloads: 0, federal_downloads: 0 } }: ResumeEditorProps) {
  const [resumes, setResumes] = useState(initialResumes)
  const [selectedId, setSelectedId] = useState<string | null>(resumes[0]?.id || null)
  const [saving, setSaving] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form')
  const [showDeleteModal, setShowDeleteModal] = useState(false)


  const supabase = createClient()

  // Check tier for limits
  const userTier = getUserTier({ tier: userPlan })
  const isFreeUser = !isPaidTier(userTier)

  const selectedResume = resumes.find(r => r.id === selectedId)

  // Resume limit check - use centralized tier limits
  const resumeLimit = TIER_LIMITS[userTier].resumes
  const canCreateNew = resumes.length < resumeLimit

  // State for showing limit reached modal
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [limitModalMessage, setLimitModalMessage] = useState('')

  // Handler for when limit is reached during export
  const handleLimitReached = (error: string, tier: string) => {
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

  // Check if the currently selected template is locked for this user
  const isCurrentTemplateLocked = !isTemplateFreeTier(currentResume.template) && isFreeUser

  // Sync skills/certs in resume content with current profile data (IDs may have changed after re-import)
  const syncContentWithProfile = (content: any) => {
    const synced = { ...content }

    // Replace stale skill objects with current profile versions (matched by name)
    if (content.skills?.length && profileData.skills?.length) {
      const profileSkillsByName = new Map(
        profileData.skills.map((s: any) => [s.name?.toLowerCase(), s])
      )
      synced.skills = content.skills
        .map((s: any) => {
          const name = (typeof s === 'string' ? s : s.name)?.toLowerCase()
          return profileSkillsByName.get(name) || s
        })
        // Deduplicate by name
        .filter((s: any, i: number, arr: any[]) =>
          arr.findIndex((x: any) => x.name?.toLowerCase() === s.name?.toLowerCase()) === i
        )
    }

    // Same for certifications
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

    // Sync experiences from profile if resume has none
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

    // Sync education from profile if resume has none
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
        // Check if the resume has content, otherwise populate from profile
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

  // Sync resume name to sidebar list in real-time
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

  const handleCreate = async () => {
    // Check limit before creating
    if (!canCreateNew) {
      alert(`You've reached your ${userPlan} plan limit of ${resumeLimit} resume${resumeLimit > 1 ? 's' : ''}. Please upgrade to create more.`)
      return
    }

    // Build fresh content from profile data
    const newContent = buildInitialContent(profileData)

    try {
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: userId,
          name: 'Untitled Resume',
          template: 'classic_professional',
          resume_type: 'private',
          content: newContent,
        })
        .select()
        .single()

      if (error) {
        // Log the full error object for debugging
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

  const handleTranslateAll = async () => {
    setTranslating(true)
    // TODO: Implement batch translation
    setTimeout(() => setTranslating(false), 2000)
  }

  const handleDelete = (deletedId: string) => {
    // Remove from local state
    const updatedResumes = resumes.filter(r => r.id !== deletedId)
    setResumes(updatedResumes)

    // If the deleted resume was selected, select another or clear
    if (selectedId === deletedId) {
      setSelectedId(updatedResumes[0]?.id || null)
    }
  }

  return (
    <div className="flex h-full flex-col md:flex-row">
      {/* Sidebar - hidden on mobile, shown as top bar */}
      <div className="hidden md:block">
        <ResumeSidebar
          resumes={resumes}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onCreate={handleCreate}
          onDelete={handleDelete}
          userPlan={userPlan}
          usage={usage}
        />
      </div>

      {/* Mobile Resume Selector */}
      <div className="md:hidden border-b border-border bg-bg-secondary p-3">
        <div className="flex items-center gap-2">
          <select
            value={selectedId || ''}
            onChange={(e) => setSelectedId(e.target.value || null)}
            className="flex-1 bg-bg-tertiary border border-border rounded-lg px-3 py-2.5 text-sm font-medium min-h-[44px]"
          >
            {resumes.map((resume) => (
              <option key={resume.id} value={resume.id}>
                {resume.name || 'Untitled'}
              </option>
            ))}
          </select>
          <button
            onClick={handleCreate}
            disabled={!canCreateNew}
            className="bg-gold text-bg-primary px-4 py-2.5 rounded-lg font-heading text-sm font-bold uppercase tracking-wider min-h-[44px] disabled:opacity-50"
          >
            + New
          </button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <ResumeToolbar
          resumeId={selectedId}
          resumeName={currentResume.name}
          userId={userId}
          resumeType={currentResume.resume_type}
          template={currentResume.template}
          onToggleType={(type) => setCurrentResume(prev => ({
            ...prev,
            resume_type: type,
            // Auto-switch template: federal type → federal template, private type → restore to classic if currently federal
            template: type === 'federal' ? 'federal' : (prev.template === 'federal' ? 'classic_professional' : prev.template),
          }))}
          onTranslateAll={handleTranslateAll}
          onDelete={() => setShowDeleteModal(true)}
          translating={translating}
          saving={saving}
          onLimitReached={handleLimitReached}
          isTemplateLocked={isCurrentTemplateLocked}
        />

        {selectedId ? (
          <>
            {/* Mobile View Tabs - larger touch targets */}
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
              {/* Left: Form - hidden on mobile when preview is active */}
              <div className={`w-full md:w-1/2 overflow-auto p-4 md:p-6 md:border-r border-border relative mobile-scroll ${
                mobileView === 'preview' ? 'hidden md:block' : ''
              }`}>
                {/* Template Strip — hidden for federal resumes (always uses federal template) */}
                {currentResume.resume_type !== 'federal' && (
                <div className="mb-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                    Template
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
                    {Object.values(SELECTABLE_TEMPLATES).map((template) => {
                      const isSelected = currentResume.template === template.id
                      const isLocked = !template.free && isFreeUser
                      return (
                        <button
                          key={template.id}
                          onClick={() => {
                            setCurrentResume(prev => ({ ...prev, template: template.id as TemplateId }))
                          }}
                          className={`relative flex-shrink-0 w-28 rounded-lg border p-2.5 text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-gold bg-gold-dim ring-1 ring-gold/40'
                              : isLocked
                              ? 'border-border bg-bg-tertiary hover:border-gold/30'
                              : 'border-border bg-bg-tertiary hover:border-border-bright'
                          }`}
                        >
                          <div className="font-heading text-xs font-bold uppercase truncate">{template.name}</div>
                          <div className="text-[10px] text-text-dim truncate mt-0.5">{template.description}</div>
                          {isLocked && !isSelected && (
                            <span className="absolute top-1.5 right-1.5 text-[10px] font-bold text-gold bg-gold/10 px-1 rounded">
                              Core
                            </span>
                          )}
                          {isSelected && (
                            <span className="absolute top-1.5 right-1.5 text-gold text-xs font-bold">✓</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
                )}

                {/* Resume Name */}
                <div className="mb-6">
                  <Input
                    label="Resume Name"
                    value={currentResume.name}
                    onChange={(e) => setCurrentResume(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My Resume"
                  />
                </div>

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
                />
              </div>

              {/* Right: Preview - hidden on mobile when form is active */}
              <div className={`w-full md:w-1/2 overflow-auto bg-bg-tertiary p-3 md:p-6 mobile-scroll ${
                mobileView === 'form' ? 'hidden md:block' : ''
              }`}>
                {/* Mobile: Fit to width with pinch zoom */}
                <div className="md:hidden mb-3 text-center">
                  <p className="text-xs text-text-dim">Pinch to zoom | Scroll to see more</p>
                </div>
                <div className="pinch-zoom relative">
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
                      <a
                        href="/pricing"
                        className="px-5 py-2.5 bg-gold text-bg-primary font-heading text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-gold-bright transition-colors"
                      >
                        View Plans
                      </a>
                    </div>
                  )}
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
                  ? 'Create a new resume or select one from the sidebar'
                  : `You've reached your ${userPlan} plan limit of ${resumeLimit} resume${resumeLimit > 1 ? 's' : ''}.`
                }
              </p>
              {canCreateNew ? (
                <Button onClick={handleCreate}>+ Create Resume</Button>
              ) : (
                <Button variant="secondary" onClick={() => window.location.href = '/pricing'}>
                  Upgrade for More Resumes
                </Button>
              )}
            </Card>
          </div>
        )}
      </div>

      {/* Delete Modal (triggered from toolbar) */}
      {selectedResume && (
        <DeleteResumeModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          resume={{
            id: selectedResume.id,
            name: selectedResume.name,
            resume_type: selectedResume.resume_type || 'private',
            has_been_downloaded: selectedResume.resume_type === 'federal'
              ? usage.federal_downloads > 0
              : usage.private_downloads > 0
          }}
          userPlan={userPlan}
          usage={usage}
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
              <Button onClick={() => window.location.href = '/pricing'}>
                Upgrade Now
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
