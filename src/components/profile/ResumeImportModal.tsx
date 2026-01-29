'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface ImportedData {
  contact: {
    first_name: string | null
    last_name: string | null
    email: string | null
    phone: string | null
    city: string | null
    state: string | null
    linkedin_url: string | null
  }
  professional_summary: string | null
  experiences: Array<{
    employment_type: 'military' | 'civilian'
    job_title: string
    civilian_title: string
    organization: string
    city: string | null
    state: string | null
    start_date: string | null
    end_date: string | null
    is_current: boolean
    bullets: string[]
  }>
  education: Array<{
    degree: string
    field_of_study: string
    institution: string
    graduation_date: string | null
    gpa: string | null
  }>
  certifications: Array<{
    name: string
    issuing_org: string | null
    date_earned: string | null
    expiration_date: string | null
  }>
  skills: string[]
  clearance: string | null
  military_info: {
    branch: string | null
    rank: string | null
    years_of_service: number | null
  }
}

interface ResumeImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (data: ImportedData) => void
}

export function ResumeImportModal({ isOpen, onClose, onImport }: ResumeImportModalProps) {
  const [step, setStep] = useState<'upload' | 'processing' | 'review'>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [importedData, setImportedData] = useState<ImportedData | null>(null)

  if (!isOpen) return null

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const isPDF = selectedFile.type === 'application/pdf'
    const isDOCX = selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

    if (!isPDF && !isDOCX) {
      setError('Please upload a PDF or DOCX file')
      return
    }

    setFile(selectedFile)
    setError('')
  }

  const handleUpload = async () => {
    if (!file) return

    setProcessing(true)
    setStep('processing')
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/import-resume', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        setError(result.error || 'Failed to import resume')
        setStep('upload')
        return
      }

      setImportedData(result.data)
      setStep('review')
    } catch (err: any) {
      setError(err?.message || 'Failed to import resume')
      setStep('upload')
    } finally {
      setProcessing(false)
    }
  }

  const handleImport = () => {
    if (importedData) {
      onImport(importedData)
      handleClose()
    }
  }

  const handleClose = () => {
    setStep('upload')
    setFile(null)
    setError('')
    setImportedData(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card border border-border rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <h2 className="font-heading text-xl font-bold">Import Existing Resume</h2>
          <p className="text-sm text-text-muted mt-1">
            {step === 'upload' && 'Upload your resume to jumpstart your profile'}
            {step === 'processing' && 'Analyzing your resume...'}
            {step === 'review' && 'Review extracted information'}
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6">
          {error && (
            <div className="mb-4 p-4 bg-status-red/20 border border-status-red/30 rounded-lg text-status-red">
              {error}
            </div>
          )}

          {/* Step: Upload */}
          {step === 'upload' && (
            <div className="space-y-6">
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
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <p className="text-text mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-text-muted">PDF or DOCX</p>
                </label>
              </div>

              {file && (
                <div className="p-4 bg-bg-tertiary rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-text-muted">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="p-2 text-text-muted hover:text-text"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              )}

              <div className="p-4 bg-bg-tertiary rounded-lg">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">
                  What Gets Imported
                </h4>
                <ul className="text-sm text-text-muted space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-gold">&#10003;</span> Contact information
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold">&#10003;</span> Work history (job titles, companies, dates, bullets)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold">&#10003;</span> Education
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold">&#10003;</span> Certifications
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold">&#10003;</span> Skills
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Step: Processing */}
          {step === 'processing' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 animate-pulse">&#9672;</div>
              <p className="font-heading text-lg uppercase tracking-wider">Analyzing Resume...</p>
              <p className="text-text-muted text-sm mt-2">Extracting work history, education, and skills</p>
            </div>
          )}

          {/* Step: Review */}
          {step === 'review' && importedData && (
            <div className="space-y-6">
              <div className="p-4 bg-status-green/10 border border-status-green/30 rounded-lg">
                <p className="text-status-green font-semibold">&#10003; Resume parsed successfully!</p>
                <p className="text-sm text-text-muted mt-1">Review the extracted information below. Click "Import" to add this data to your profile.</p>
              </div>

              {/* Contact Info */}
              {importedData.contact && (
                <Card className="p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {importedData.contact.first_name && <p><span className="text-text-muted">Name:</span> {importedData.contact.first_name} {importedData.contact.last_name}</p>}
                    {importedData.contact.email && <p><span className="text-text-muted">Email:</span> {importedData.contact.email}</p>}
                    {importedData.contact.phone && <p><span className="text-text-muted">Phone:</span> {importedData.contact.phone}</p>}
                    {importedData.contact.city && <p><span className="text-text-muted">Location:</span> {importedData.contact.city}, {importedData.contact.state}</p>}
                    {importedData.contact.linkedin_url && <p><span className="text-text-muted">LinkedIn:</span> {importedData.contact.linkedin_url}</p>}
                  </div>
                </Card>
              )}

              {/* Professional Summary */}
              {importedData.professional_summary && (
                <Card className="p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">Professional Summary</h4>
                  <p className="text-sm text-text-muted">{importedData.professional_summary}</p>
                </Card>
              )}

              {/* Experience */}
              {importedData.experiences && importedData.experiences.length > 0 && (
                <Card className="p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">
                    Work Experience ({importedData.experiences.length})
                  </h4>
                  <div className="space-y-4">
                    {importedData.experiences.map((exp, idx) => (
                      <div key={idx} className="border-l-2 border-border pl-4">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{exp.civilian_title || exp.job_title}</p>
                          <span className={`px-2 py-0.5 text-xs rounded ${exp.employment_type === 'civilian' ? 'bg-blue-500/20 text-blue-400' : 'bg-gold/20 text-gold'}`}>
                            {exp.employment_type}
                          </span>
                        </div>
                        <p className="text-sm text-text-muted">{exp.organization}</p>
                        <p className="text-xs text-text-dim">{exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}</p>
                        {exp.bullets && exp.bullets.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {exp.bullets.slice(0, 3).map((bullet, bIdx) => (
                              <li key={bIdx} className="text-xs text-text-muted flex items-start gap-2">
                                <span className="text-gold">&#8226;</span>
                                <span className="line-clamp-1">{bullet}</span>
                              </li>
                            ))}
                            {exp.bullets.length > 3 && (
                              <li className="text-xs text-text-dim">...and {exp.bullets.length - 3} more bullets</li>
                            )}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Education */}
              {importedData.education && importedData.education.length > 0 && (
                <Card className="p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">Education</h4>
                  <div className="space-y-2">
                    {importedData.education.map((edu, idx) => (
                      <div key={idx}>
                        <p className="font-semibold text-sm">{edu.degree} in {edu.field_of_study}</p>
                        <p className="text-xs text-text-muted">{edu.institution} {edu.graduation_date && `(${edu.graduation_date})`}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Certifications */}
              {importedData.certifications && importedData.certifications.length > 0 && (
                <Card className="p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {importedData.certifications.map((cert, idx) => (
                      <span key={idx} className="px-3 py-1 bg-bg-tertiary rounded text-sm">
                        {cert.name}
                      </span>
                    ))}
                  </div>
                </Card>
              )}

              {/* Skills */}
              {importedData.skills && importedData.skills.length > 0 && (
                <Card className="p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {importedData.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gold/20 text-gold rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </Card>
              )}

              {/* Military Info */}
              {importedData.military_info?.branch && (
                <Card className="p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">Military Background</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    {importedData.military_info.branch && <p><span className="text-text-muted">Branch:</span> {importedData.military_info.branch}</p>}
                    {importedData.military_info.rank && <p><span className="text-text-muted">Rank:</span> {importedData.military_info.rank}</p>}
                    {importedData.clearance && <p><span className="text-text-muted">Clearance:</span> {importedData.clearance}</p>}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex gap-3">
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-bg-tertiary border border-border rounded font-heading font-bold uppercase tracking-wider hover:bg-bg-hover transition-all"
          >
            Cancel
          </button>

          {step === 'upload' && (
            <button
              onClick={handleUpload}
              disabled={!file || processing}
              className="flex-1 px-6 py-3 bg-gold text-bg-primary rounded font-heading font-bold uppercase tracking-wider hover:bg-gold-bright disabled:opacity-50 transition-all"
            >
              Analyze Resume
            </button>
          )}

          {step === 'review' && (
            <button
              onClick={handleImport}
              className="flex-1 px-6 py-3 bg-gold text-bg-primary rounded font-heading font-bold uppercase tracking-wider hover:bg-gold-bright transition-all"
            >
              Import to Profile
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
