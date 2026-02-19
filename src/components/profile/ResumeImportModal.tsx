'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { DEGREE_TYPES, matchDegreeType } from '@/lib/constants/education'
import { UpgradeLink } from '@/components/modals/UpgradeModal'

// ─── Types ───────────────────────────────────────────────────────────

interface ExperienceEntry {
  job_title: string
  civilian_title: string
  organization: string
  employment_type: 'military' | 'civilian'
  city: string | null
  state: string | null
  start_date: string | null
  end_date: string | null
  is_current: boolean
  bullets: string[]
}

interface ImportData {
  contact: {
    phone: string | null
    city: string | null
    state: string | null
    linkedin_url: string | null
  }
  professional_summary: string | null
  experiences: ExperienceEntry[]
  education: Array<{
    degree_type: string | null
    field_of_study: string | null
    school_name: string | null
    graduation_year: string | null
  }>
  certifications: Array<{
    name: string
    issuing_organization: string | null
  }>
  skills: Array<{ name: string; category: string }>
  military_info: {
    branch: string | null
    rank: string | null
  }
}

type Step = 'upload' | 'preview' | 'parsing' | 'review' | 'success'

interface ResumeImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (data: ImportData) => Promise<void>
  currentUsage?: number
  usageLimit?: number
  existingExperiences?: any[]
  existingSkills?: any[]
  existingCertifications?: any[]
  existingEducation?: any[]
  userBranch?: string
}

// ─── Component ───────────────────────────────────────────────────────

export function ResumeImportModal({
  isOpen,
  onClose,
  onImport,
  currentUsage = 0,
  usageLimit = 3,
  existingExperiences = [],
  existingSkills = [],
  existingCertifications = [],
  existingEducation = [],
  userBranch,
}: ResumeImportModalProps) {
  const remaining = Math.max(0, usageLimit - currentUsage)

  // Step state
  const [step, setStep] = useState<Step>('upload')
  const [inputTab, setInputTab] = useState<'file' | 'paste'>('file')

  // Upload state
  const [file, setFile] = useState<File | null>(null)
  const [pasteText, setPasteText] = useState('')
  const [extractedText, setExtractedText] = useState('')
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)

  // Parsed data state
  const [importData, setImportData] = useState<ImportData | null>(null)
  const [aiUsed, setAiUsed] = useState(false)
  const [aiLimitHit, setAiLimitHit] = useState(false)
  const [editingEduIdx, setEditingEduIdx] = useState<number | null>(null)

  // Success state
  const [importSummary, setImportSummary] = useState('')

  if (!isOpen) return null

  const hasExistingData = existingExperiences.length > 0 || existingSkills.length > 0

  // ─── Step 1: File / Paste Input ──────────────────────────────────

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const isPDF = selectedFile.type === 'application/pdf'
    const isDOCX = selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

    if (!isPDF && !isDOCX) {
      setError('Please upload a PDF or DOCX file')
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum size is 10MB.')
      return
    }

    setFile(selectedFile)
    setError('')
  }

  const handleExtractText = async () => {
    setProcessing(true)
    setError('')

    try {
      if (inputTab === 'paste') {
        const text = pasteText.trim()
        if (text.length < 100) {
          setError("This doesn't look like a full resume. Did you paste everything?")
          setProcessing(false)
          return
        }
        setExtractedText(text)
        setStep('preview')
      } else if (file) {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/import-resume/extract-text', {
          method: 'POST',
          body: formData,
        })

        const result = await res.json()
        if (!res.ok || result.error) {
          setError(result.error || 'Failed to extract text from file.')
          setProcessing(false)
          return
        }

        setExtractedText(result.text)
        setStep('preview')
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to extract text.')
    } finally {
      setProcessing(false)
    }
  }

  // ─── Step 2→3: Parse Text ─────────────────────────────────────────

  const handleParse = async () => {
    setStep('parsing')
    setProcessing(true)
    setError('')

    try {
      // Send full resume text to Haiku for comprehensive parsing
      const res = await fetch('/api/import-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: extractedText }),
      })

      const result = await res.json()

      if (result.limitReached) {
        setAiLimitHit(true)
        setError(result.error || 'Import limit reached.')
        setStep('preview')
        return
      }

      if (!res.ok) {
        setError(result.error || 'Failed to parse resume.')
        setStep('preview')
        return
      }

      // Map API response to ImportData
      const data: ImportData = {
        contact: result.contact || { phone: null, city: null, state: null, linkedin_url: null },
        professional_summary: result.professional_summary || null,
        experiences: (result.experiences || []).map((exp: any) => ({
          job_title: exp.job_title || '',
          civilian_title: exp.civilian_title || exp.job_title || '',
          organization: exp.organization || '',
          employment_type: exp.employment_type || 'civilian',
          city: exp.city || null,
          state: exp.state || null,
          start_date: exp.start_date || null,
          end_date: exp.end_date || null,
          is_current: exp.is_current || false,
          bullets: Array.isArray(exp.bullets) ? exp.bullets : [],
        })),
        education: (result.education || []).map((edu: any) => ({
          degree_type: matchDegreeType(edu.degree_type) || edu.degree_type || null,
          field_of_study: edu.field_of_study || null,
          school_name: edu.school_name || null,
          graduation_year: edu.graduation_year || null,
        })),
        certifications: (result.certifications || []).map((cert: any) => ({
          name: cert.name || '',
          issuing_organization: cert.issuing_organization || null,
        })),
        skills: (result.skills || []).map((skill: any) => ({
          name: typeof skill === 'string' ? skill : skill.name || '',
          category: typeof skill === 'string' ? 'general' : skill.category || 'general',
        })),
        military_info: result.military_info || { branch: null, rank: null },
      }

      setAiUsed(true)
      setImportData(data)
      setStep('review')
    } catch (err: any) {
      setError(err?.message || 'Failed to parse resume.')
      setStep('preview')
    } finally {
      setProcessing(false)
    }
  }

  // ─── Step 4: Save ──────────────────────────────────────────────────

  const handleSave = async () => {
    if (!importData || step !== 'review') return
    setProcessing(true)
    setError('')

    try {
      await onImport(importData)

      // Build summary
      const parts: string[] = []
      if (importData.experiences.length) parts.push(`${importData.experiences.length} positions`)
      if (importData.skills.length) parts.push(`${importData.skills.length} skills`)
      if (importData.certifications.length) parts.push(`${importData.certifications.length} certifications`)
      if (importData.education.length) parts.push(`${importData.education.length} education entries`)

      setImportSummary(parts.join(', '))
      setStep('success')
    } catch (err: any) {
      setError(err?.message || 'Failed to save import.')
    } finally {
      setProcessing(false)
    }
  }

  // ─── Edit Handlers ─────────────────────────────────────────────────

  const updateExperience = (idx: number, field: string, value: any) => {
    if (!importData) return
    const updated = [...importData.experiences]
    updated[idx] = { ...updated[idx], [field]: value }
    setImportData({ ...importData, experiences: updated })
  }

  const updateBullet = (expIdx: number, bulletIdx: number, value: string) => {
    if (!importData) return
    const updated = [...importData.experiences]
    const bullets = [...updated[expIdx].bullets]
    bullets[bulletIdx] = value
    updated[expIdx] = { ...updated[expIdx], bullets }
    setImportData({ ...importData, experiences: updated })
  }

  const removeBullet = (expIdx: number, bulletIdx: number) => {
    if (!importData) return
    const updated = [...importData.experiences]
    updated[expIdx] = {
      ...updated[expIdx],
      bullets: updated[expIdx].bullets.filter((_, i) => i !== bulletIdx),
    }
    setImportData({ ...importData, experiences: updated })
  }

  const addBullet = (expIdx: number) => {
    if (!importData) return
    const updated = [...importData.experiences]
    updated[expIdx] = {
      ...updated[expIdx],
      bullets: [...updated[expIdx].bullets, ''],
    }
    setImportData({ ...importData, experiences: updated })
  }

  const removeExperience = (idx: number) => {
    if (!importData) return
    setImportData({
      ...importData,
      experiences: importData.experiences.filter((_, i) => i !== idx),
    })
  }

  const removeSkill = (idx: number) => {
    if (!importData) return
    setImportData({
      ...importData,
      skills: importData.skills.filter((_, i) => i !== idx),
    })
  }

  const addSkill = (name: string) => {
    if (!importData || !name.trim()) return
    setImportData({
      ...importData,
      skills: [...importData.skills, { name: name.trim(), category: 'general' }],
    })
  }

  const removeCert = (idx: number) => {
    if (!importData) return
    setImportData({
      ...importData,
      certifications: importData.certifications.filter((_, i) => i !== idx),
    })
  }

  const addCert = (name: string) => {
    if (!importData || !name.trim()) return
    setImportData({
      ...importData,
      certifications: [...importData.certifications, { name: name.trim(), issuing_organization: null }],
    })
  }

  const updateEducation = (idx: number, field: string, value: string) => {
    if (!importData) return
    const updated = [...importData.education]
    updated[idx] = { ...updated[idx], [field]: value }
    setImportData({ ...importData, education: updated })
  }

  const removeEducation = (idx: number) => {
    if (!importData) return
    if (editingEduIdx === idx) setEditingEduIdx(null)
    setImportData({
      ...importData,
      education: importData.education.filter((_, i) => i !== idx),
    })
  }

  const addEducation = () => {
    if (!importData) return
    const newEdu = { degree_type: null, field_of_study: null, school_name: null, graduation_year: null }
    const updated = [...importData.education, newEdu]
    setImportData({ ...importData, education: updated })
    setEditingEduIdx(updated.length - 1)
  }

  // ─── Reset ─────────────────────────────────────────────────────────

  const handleClose = () => {
    setStep('upload')
    setInputTab('file')
    setFile(null)
    setPasteText('')
    setExtractedText('')
    setError('')
    setProcessing(false)
    setImportData(null)
    setAiUsed(false)
    setAiLimitHit(false)
    setEditingEduIdx(null)
    setImportSummary('')
    onClose()
  }

  // ─── Render ────────────────────────────────────────────────────────

  const inputClass = "w-full px-3 py-2 bg-bg-secondary border border-border rounded text-sm focus:border-gold focus:ring-1 focus:ring-gold/25 transition-all"

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card border border-border rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold">Import Resume</h2>
            <div className="flex items-center gap-2">
              {step !== 'success' && (
                <Badge variant={remaining <= 0 ? 'red' : remaining <= 1 ? 'amber' : 'default'}>
                  {remaining} AI Import{remaining !== 1 ? 's' : ''} Left
                </Badge>
              )}
              <button onClick={handleClose} className="p-2 text-text-muted hover:text-text transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-sm text-text-muted mt-1">
            {step === 'upload' && 'Upload a file or paste your resume text'}
            {step === 'preview' && 'Confirm the extracted text looks correct'}
            {step === 'parsing' && 'Analyzing your resume...'}
            {step === 'review' && 'Review and edit extracted information'}
            {step === 'success' && 'Import complete!'}
          </p>
          {/* Step indicator */}
          {step !== 'success' && (
            <div className="flex gap-1 mt-3">
              {['upload', 'preview', 'parsing', 'review'].map((s, i) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    ['upload', 'preview', 'parsing', 'review'].indexOf(step) >= i
                      ? 'bg-gold'
                      : 'bg-border'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6">
          {error && (
            <div className="mb-4 p-4 bg-status-red/20 border border-status-red/30 rounded-lg text-status-red text-sm">
              {error}
            </div>
          )}

          {/* ─── STEP: Upload / Paste ─── */}
          {step === 'upload' && (
            <div className="space-y-6">
              {/* Duplicate data warning */}
              {hasExistingData && (
                <div className="p-4 bg-status-amber/10 border border-status-amber/30 rounded-lg text-sm">
                  <p className="text-status-amber font-semibold">Your profile already has data</p>
                  <p className="text-text-muted mt-1">
                    {existingExperiences.length} position{existingExperiences.length !== 1 ? 's' : ''} and {existingSkills.length} skill{existingSkills.length !== 1 ? 's' : ''}.
                    Import will add new entries only — existing data won't be changed.
                  </p>
                </div>
              )}

              {/* Tabs */}
              <div className="flex border-b border-border">
                <button
                  onClick={() => setInputTab('file')}
                  className={`px-4 py-2.5 text-sm font-heading uppercase tracking-wider transition-colors ${
                    inputTab === 'file'
                      ? 'text-gold border-b-2 border-gold'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  Upload File
                </button>
                <button
                  onClick={() => setInputTab('paste')}
                  className={`px-4 py-2.5 text-sm font-heading uppercase tracking-wider transition-colors ${
                    inputTab === 'paste'
                      ? 'text-gold border-b-2 border-gold'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  Paste Text
                </button>
              </div>

              {inputTab === 'file' ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-gold/50 transition-all">
                    <input
                      type="file"
                      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer block">
                      <svg className="w-12 h-12 mx-auto text-text-muted mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <p className="text-text mb-1">Click to upload or drag and drop</p>
                      <p className="text-sm text-text-muted">PDF or DOCX (max 10MB)</p>
                    </label>
                  </div>

                  {file && (
                    <div className="p-4 bg-bg-tertiary rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <svg className="w-8 h-8 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-text-muted">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button onClick={() => setFile(null)} className="p-2 text-text-muted hover:text-text">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <textarea
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    placeholder="Paste your full resume text here..."
                    rows={12}
                    className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-lg text-sm focus:border-gold focus:ring-1 focus:ring-gold/25 transition-all resize-y"
                  />
                  <p className="text-xs text-text-dim mt-2">
                    {pasteText.length > 0 ? `${pasteText.length} characters` : 'Copy all text from your resume and paste it above'}
                  </p>
                </div>
              )}

              <div className="p-4 bg-bg-tertiary rounded-lg">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">What Gets Imported</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-text-muted">
                  <p className="flex items-center gap-2"><span className="text-gold">&#10003;</span> Contact info</p>
                  <p className="flex items-center gap-2"><span className="text-gold">&#10003;</span> Work experience</p>
                  <p className="flex items-center gap-2"><span className="text-gold">&#10003;</span> Education</p>
                  <p className="flex items-center gap-2"><span className="text-gold">&#10003;</span> Skills & certs</p>
                </div>
                <p className="text-xs text-text-dim mt-3">
                  AI-powered parsing uses 1 of your {usageLimit} import{usageLimit !== 1 ? 's' : ''}.
                </p>
              </div>
            </div>
          )}

          {/* ─── STEP: Text Preview ─── */}
          {step === 'preview' && (
            <div className="space-y-4">
              <div className="p-4 bg-status-green/10 border border-status-green/30 rounded-lg text-sm">
                <p className="text-status-green font-semibold">Text extracted successfully ({extractedText.length.toLocaleString()} characters)</p>
                <p className="text-text-muted mt-1">Confirm the text below looks correct, then continue to parsing.</p>
              </div>

              <div className="bg-bg-secondary border border-border rounded-lg p-4 max-h-80 overflow-auto">
                <pre className="text-xs text-text-muted whitespace-pre-wrap font-mono leading-relaxed">
                  {extractedText.substring(0, 5000)}
                  {extractedText.length > 5000 && '\n\n...[showing first 5,000 of ' + extractedText.length.toLocaleString() + ' characters]'}
                </pre>
              </div>
            </div>
          )}

          {/* ─── STEP: Parsing ─── */}
          {step === 'parsing' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 animate-pulse">&#9672;</div>
              <p className="font-heading text-lg uppercase tracking-wider">Analyzing Resume...</p>
              <p className="text-text-muted text-sm mt-2">Extracting sections, skills, and experience</p>
            </div>
          )}

          {/* ─── STEP: Review ─── */}
          {step === 'review' && importData && (
            <div className="space-y-5">
              {/* AI limit nudge */}
              {aiLimitHit && (
                <div className="p-4 bg-status-amber/10 border border-status-amber/30 rounded-lg text-sm">
                  <p className="text-status-amber font-semibold">AI import limit reached</p>
                  <p className="text-text-muted mt-1">
                    Dictionary extraction applied.{' '}
                    <UpgradeLink className="text-gold hover:text-gold-bright hover:underline">
                      Upgrade to Core
                    </UpgradeLink>{' '}
                    for unlimited AI-powered experience parsing.
                  </p>
                </div>
              )}

              {/* AI success indicator */}
              {aiUsed && (
                <div className="p-3 bg-status-green/10 border border-status-green/30 rounded-lg text-sm flex items-center gap-2">
                  <span className="text-status-green">&#10003;</span>
                  <span className="text-status-green font-semibold">AI parsed {importData.experiences.length} experience entries</span>
                </div>
              )}

              {/* Contact Info */}
              <Card className="p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">Contact Info</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-text-dim">Phone</label>
                    <input
                      className={inputClass}
                      value={importData.contact.phone || ''}
                      onChange={(e) => setImportData({ ...importData, contact: { ...importData.contact, phone: e.target.value || null } })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-text-dim">LinkedIn</label>
                    <input
                      className={inputClass}
                      value={importData.contact.linkedin_url || ''}
                      onChange={(e) => setImportData({ ...importData, contact: { ...importData.contact, linkedin_url: e.target.value || null } })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-text-dim">City</label>
                    <input
                      className={inputClass}
                      value={importData.contact.city || ''}
                      onChange={(e) => setImportData({ ...importData, contact: { ...importData.contact, city: e.target.value || null } })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-text-dim">State</label>
                    <input
                      className={inputClass}
                      value={importData.contact.state || ''}
                      onChange={(e) => setImportData({ ...importData, contact: { ...importData.contact, state: e.target.value || null } })}
                      maxLength={2}
                    />
                  </div>
                </div>
              </Card>

              {/* Professional Summary */}
              <Card className="p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">Professional Summary</h4>
                <textarea
                  className={`${inputClass} resize-y`}
                  rows={3}
                  value={importData.professional_summary || ''}
                  onChange={(e) => setImportData({ ...importData, professional_summary: e.target.value || null })}
                  placeholder="No summary detected — you can add one here"
                />
              </Card>

              {/* Experience */}
              <Card className="p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">
                  Experience ({importData.experiences.length} position{importData.experiences.length !== 1 ? 's' : ''})
                </h4>
                {importData.experiences.length === 0 ? (
                  <p className="text-sm text-text-dim">
                    {aiLimitHit
                      ? 'Experience parsing requires an AI import. Upgrade to parse experience entries.'
                      : 'No experience entries detected. You can add them manually on your profile.'}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {importData.experiences.map((exp, idx) => (
                      <div key={idx} className="border border-border rounded-lg p-3 bg-bg-secondary">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              className={`${inputClass} font-semibold`}
                              value={exp.civilian_title || exp.job_title}
                              onChange={(e) => updateExperience(idx, 'civilian_title', e.target.value)}
                              placeholder="Job Title"
                            />
                            <span className={`px-2 py-0.5 text-xs rounded flex-shrink-0 ${
                              exp.employment_type === 'military' ? 'bg-gold/20 text-gold' : 'bg-status-blue/20 text-status-blue'
                            }`}>
                              {exp.employment_type}
                            </span>
                          </div>
                          <button
                            onClick={() => removeExperience(idx)}
                            className="p-1 text-text-dim hover:text-status-red transition-colors flex-shrink-0 ml-2"
                            title="Remove"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <input
                            className={inputClass}
                            value={exp.organization}
                            onChange={(e) => updateExperience(idx, 'organization', e.target.value)}
                            placeholder="Company / Organization"
                          />
                          <div className="flex gap-2">
                            <input
                              className={inputClass}
                              value={exp.start_date || ''}
                              onChange={(e) => updateExperience(idx, 'start_date', e.target.value)}
                              placeholder="Start (YYYY-MM-DD)"
                            />
                            <input
                              className={inputClass}
                              value={exp.is_current ? 'Present' : exp.end_date || ''}
                              onChange={(e) => {
                                const v = e.target.value
                                if (v.toLowerCase() === 'present') {
                                  updateExperience(idx, 'is_current', true)
                                  updateExperience(idx, 'end_date', null)
                                } else {
                                  updateExperience(idx, 'is_current', false)
                                  updateExperience(idx, 'end_date', v)
                                }
                              }}
                              placeholder="End (or Present)"
                            />
                          </div>
                        </div>
                        {/* Bullets */}
                        <div className="space-y-1">
                          {exp.bullets.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-1">
                              <span className="text-gold text-xs mt-2.5 flex-shrink-0">&#8226;</span>
                              <input
                                className={`${inputClass} text-xs`}
                                value={bullet}
                                onChange={(e) => updateBullet(idx, bIdx, e.target.value)}
                              />
                              <button
                                onClick={() => removeBullet(idx, bIdx)}
                                className="p-1 text-text-dim hover:text-status-red flex-shrink-0 mt-1"
                              >
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addBullet(idx)}
                            className="text-xs text-gold hover:text-gold-bright mt-1"
                          >
                            + Add bullet
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Education */}
              <Card className="p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">
                  Education ({importData.education.length})
                </h4>
                {importData.education.length === 0 ? (
                  <p className="text-sm text-text-dim">No education entries detected.</p>
                ) : (
                  <div className="space-y-3">
                    {importData.education.map((edu, idx) => (
                      <div key={idx} className="border border-border rounded-lg p-3 bg-bg-secondary">
                        {editingEduIdx === idx ? (
                          <div className="space-y-2">
                            <input
                              className={inputClass}
                              value={edu.degree_type || ''}
                              onChange={(e) => updateEducation(idx, 'degree_type', e.target.value)}
                              placeholder="Degree (e.g. Master, Bachelor, MBA)"
                            />
                            <input
                              className={inputClass}
                              value={edu.field_of_study || ''}
                              onChange={(e) => updateEducation(idx, 'field_of_study', e.target.value)}
                              placeholder="Field of Study"
                            />
                            <input
                              className={inputClass}
                              value={edu.school_name || ''}
                              onChange={(e) => updateEducation(idx, 'school_name', e.target.value)}
                              placeholder="School Name"
                            />
                            <input
                              className={`${inputClass} w-32`}
                              value={edu.graduation_year || ''}
                              onChange={(e) => updateEducation(idx, 'graduation_year', e.target.value)}
                              placeholder="Year"
                            />
                            <button
                              onClick={() => setEditingEduIdx(null)}
                              className="text-xs text-gold hover:text-gold-bright font-semibold"
                            >
                              Done
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-sm">
                                {(DEGREE_TYPES.find(d => d.value === edu.degree_type)?.label || edu.degree_type || 'Degree')}
                                {edu.field_of_study ? ` in ${edu.field_of_study}` : ''}
                              </p>
                              {edu.school_name && (
                                <p className="text-sm text-text-muted">{edu.school_name}</p>
                              )}
                              {edu.graduation_year && (
                                <p className="text-xs text-text-dim mt-0.5">{edu.graduation_year}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                              <button
                                onClick={() => setEditingEduIdx(idx)}
                                className="px-2 py-1 text-xs text-gold hover:text-gold-bright font-semibold"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removeEducation(idx)}
                                className="p-1 text-text-dim hover:text-status-red"
                              >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={addEducation}
                  className="text-xs text-gold hover:text-gold-bright mt-3 font-semibold"
                >
                  + Add Education
                </button>
              </Card>

              {/* Skills */}
              <Card className="p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">
                  Skills ({importData.skills.length})
                </h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {importData.skills.map((skill, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-gold/20 text-gold rounded text-sm">
                      {skill.name}
                      <button onClick={() => removeSkill(idx)} className="hover:text-status-red ml-1">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                <AddInlineInput placeholder="Add skill..." onAdd={addSkill} />
              </Card>

              {/* Certifications */}
              <Card className="p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">
                  Certifications ({importData.certifications.length})
                </h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {importData.certifications.map((cert, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-bg-tertiary rounded text-sm">
                      {cert.name}
                      <button onClick={() => removeCert(idx)} className="hover:text-status-red ml-1">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                <AddInlineInput placeholder="Add certification..." onAdd={addCert} />
              </Card>

              {/* Military Info */}
              {(importData.military_info.branch || importData.military_info.rank) && (
                <Card className="p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">Military Background</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-text-dim">Branch</label>
                      <input
                        className={inputClass}
                        value={importData.military_info.branch || ''}
                        onChange={(e) => setImportData({
                          ...importData,
                          military_info: { ...importData.military_info, branch: e.target.value || null },
                        })}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-text-dim">Rank</label>
                      <input
                        className={inputClass}
                        value={importData.military_info.rank || ''}
                        onChange={(e) => setImportData({
                          ...importData,
                          military_info: { ...importData.military_info, rank: e.target.value || null },
                        })}
                      />
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* ─── STEP: Success ─── */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-status-green/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-status-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold uppercase mb-2">Profile Updated</h3>
              <p className="text-text-muted mb-6">{importSummary} imported</p>

              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <a
                  href="/resumes"
                  className="px-6 py-3 bg-gold text-bg-primary rounded font-heading font-bold uppercase tracking-wider hover:bg-gold-bright transition-all text-center"
                >
                  Create a Resume
                </a>
                <button
                  onClick={handleClose}
                  className="px-6 py-3 bg-bg-tertiary border border-border rounded font-heading font-bold uppercase tracking-wider hover:bg-bg-hover transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 'success' && (
          <div className="p-6 border-t border-border flex gap-3">
            {step === 'review' ? (
              <button
                onClick={() => setStep('preview')}
                className="px-6 py-3 bg-bg-tertiary border border-border rounded font-heading font-bold uppercase tracking-wider hover:bg-bg-hover transition-all"
              >
                Back
              </button>
            ) : (
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-bg-tertiary border border-border rounded font-heading font-bold uppercase tracking-wider hover:bg-bg-hover transition-all"
              >
                Cancel
              </button>
            )}

            {step === 'upload' && (
              <button
                onClick={handleExtractText}
                disabled={processing || (inputTab === 'file' ? !file : pasteText.trim().length < 50)}
                className="flex-1 px-6 py-3 bg-gold text-bg-primary rounded font-heading font-bold uppercase tracking-wider hover:bg-gold-bright disabled:opacity-50 transition-all"
              >
                {processing ? 'Extracting...' : 'Extract Text'}
              </button>
            )}

            {step === 'preview' && (
              <button
                onClick={handleParse}
                disabled={processing}
                className="flex-1 px-6 py-3 bg-gold text-bg-primary rounded font-heading font-bold uppercase tracking-wider hover:bg-gold-bright disabled:opacity-50 transition-all"
              >
                {processing ? 'Parsing...' : 'Parse Resume'}
              </button>
            )}

            {step === 'review' && (
              <button
                onClick={handleSave}
                disabled={processing}
                className="flex-1 px-6 py-3 bg-gold text-bg-primary rounded font-heading font-bold uppercase tracking-wider hover:bg-gold-bright disabled:opacity-50 transition-all"
              >
                {processing ? 'Saving...' : 'Import to Profile'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Helper: Inline Add Input ────────────────────────────────────────

function AddInlineInput({ placeholder, onAdd }: { placeholder: string; onAdd: (val: string) => void }) {
  const [value, setValue] = useState('')
  const handleSubmit = () => {
    if (value.trim()) {
      onAdd(value.trim())
      setValue('')
    }
  }
  return (
    <div className="flex gap-2">
      <input
        className="flex-1 px-3 py-1.5 bg-bg-secondary border border-border rounded text-sm focus:border-gold focus:ring-1 focus:ring-gold/25 transition-all"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder={placeholder}
      />
      <button
        onClick={handleSubmit}
        disabled={!value.trim()}
        className="px-3 py-1.5 bg-gold/20 text-gold rounded text-sm font-semibold hover:bg-gold/30 disabled:opacity-50 transition-colors"
      >
        Add
      </button>
    </div>
  )
}
