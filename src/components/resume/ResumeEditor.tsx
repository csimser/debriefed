'use client'

import { useState, useEffect } from 'react'
import { ResumeSidebar } from './ResumeSidebar'
import { ResumeToolbar } from './ResumeToolbar'
import { TemplateSelector } from './TemplateSelector'
import { ResumeForm } from './ResumeForm'
import { ResumePreview } from './ResumePreview'
import { DeleteResumeModal } from './DeleteResumeModal'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'
import { TemplateId } from '@/lib/templates'
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
  const [showTemplates, setShowTemplates] = useState(false)
  const [saving, setSaving] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const supabase = createClient()

  // Check tier and lockout status
  const userTier = getUserTier({ tier: userPlan })
  const isFreeUser = !isPaidTier(userTier)

  // Check if current resume is locked (downloaded by free user)
  const selectedResume = resumes.find(r => r.id === selectedId)
  const isResumeDownloaded = selectedResume?.downloaded_at != null
  const isLocked = isFreeUser && isResumeDownloaded

  // Resume limit check - use centralized tier limits
  const resumeLimit = TIER_LIMITS[userTier].resumes
  const canCreateNew = resumes.length < resumeLimit

  // Download limit check
  const privateDownloads = usage?.private_downloads || 0
  const federalDownloads = usage?.federal_downloads || 0

  // Check if download limits have been reached based on tier
  const privateLimit = TIER_LIMITS[userTier].resumes
  const federalLimit = isFreeUser ? 0 : TIER_LIMITS[userTier].resumes
  const hasReachedPrivateLimit = privateDownloads >= privateLimit
  const hasReachedFederalLimit = isFreeUser
    ? true // Free tier: no federal resumes
    : federalDownloads >= federalLimit

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
    template: 'clean' as TemplateId,
    resume_type: 'private' as 'private' | 'federal',
    content: initialContent,
  })

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
          template: resume.template || 'clean',
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

  // Auto-save (disabled when resume is locked)
  useEffect(() => {
    if (!selectedId || isLocked) return

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
  }, [currentResume, selectedId, isLocked])

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
          template: 'clean',
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
          onToggleType={(type) => setCurrentResume(prev => ({ ...prev, resume_type: type }))}
          onTranslateAll={handleTranslateAll}
          onDelete={() => setShowDeleteModal(true)}
          translating={translating}
          saving={saving}
          onLimitReached={handleLimitReached}
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
                {/* Locked Overlay for Downloaded Free Tier Resumes */}
                {isLocked && (
                  <div className="absolute inset-0 z-10 bg-bg-primary/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-bg-secondary border border-border rounded-xl p-8 max-w-md text-center shadow-2xl">
                      <div className="w-16 h-16 bg-status-amber/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-status-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </div>
                      <h3 className="font-heading text-xl font-bold uppercase mb-2">Resume Locked</h3>
                      <p className="text-text-muted text-sm mb-4">
                        You've downloaded this resume. Free tier users cannot edit resumes after download.
                      </p>
                      <p className="text-text-dim text-xs mb-6">
                        Upgrade to continue editing all your resumes without restrictions.
                      </p>
                      <Button onClick={() => window.location.href = '/pricing'}>
                        Upgrade to Unlock Editing
                      </Button>
                    </div>
                  </div>
                )}

                {/* Resume Name */}
                <div className="mb-6">
                  <Input
                    label="Resume Name"
                    value={currentResume.name}
                    onChange={(e) => !isLocked && setCurrentResume(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My Resume"
                    disabled={isLocked}
                  />
                </div>

                {/* Template Selector Toggle */}
                <div className="mb-6">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => !isLocked && setShowTemplates(!showTemplates)}
                    disabled={isLocked}
                  >
                    {showTemplates ? 'Hide Templates' : 'Change Template'}
                  </Button>

                  {showTemplates && !isLocked && (
                    <div className="mt-4">
                      <TemplateSelector
                        selected={currentResume.template}
                        onSelect={(id) => {
                          setCurrentResume(prev => ({ ...prev, template: id }))
                          setShowTemplates(false)
                        }}
                        userPlan={userPlan}
                      />
                    </div>
                  )}
                </div>

                {/* Form - blocked by overlay when locked */}
                <ResumeForm
                  resumeId={selectedId || ''}
                  content={currentResume.content}
                  resumeType={currentResume.resume_type}
                  onChange={(content) => !isLocked && setCurrentResume(prev => ({ ...prev, content }))}
                  userProfile={profileData.userProfile}
                  profileSummary={profileData.userProfile?.professional_summary}
                  allSkills={profileData.skills}
                  allCertifications={profileData.certifications}
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
                <div className="pinch-zoom">
                  <ResumePreview
                    template={currentResume.template}
                    resumeType={currentResume.resume_type}
                    content={currentResume.content}
                  />
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
