'use client'

import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface JobInputPaneProps {
  jobData: {
    company: string
    title: string
    description: string
  }
  onChange: (data: any) => void
  resumes: any[]
  selectedResumeId: string | null
  onSelectResume: (id: string) => void
  onAnalyze: () => void
  analyzing: boolean
  error: string
}

export function JobInputPane({
  jobData,
  onChange,
  resumes,
  selectedResumeId,
  onSelectResume,
  onAnalyze,
  analyzing,
  error,
}: JobInputPaneProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="text-gold">◈</span> Job Posting
        </h2>

        <div className="space-y-4">
          <Input
            label="Company Name"
            autoComplete="organization"
            value={jobData.company}
            onChange={(e) => onChange({ ...jobData, company: e.target.value })}
            placeholder="Acme Corporation"
          />

          <Input
            label="Job Title"
            value={jobData.title}
            onChange={(e) => onChange({ ...jobData, title: e.target.value })}
            placeholder="Operations Manager"
          />

          <div className="space-y-2">
            <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
              Job Description
            </label>
            <textarea
              autoComplete="off"
              value={jobData.description}
              onChange={(e) => onChange({ ...jobData, description: e.target.value })}
              placeholder="Paste the full job description here..."
              className="w-full h-48 bg-bg-secondary border border-border rounded-md px-4 py-3 text-text placeholder:text-text-dim resize-none focus:border-gold focus:ring-1 focus:ring-gold/25"
            />
          </div>
        </div>
      </div>

      {/* Resume Selector */}
      <div>
        <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="text-gold">◫</span> Select Resume
        </h2>

        <div className="space-y-2">
          {resumes.map((resume) => (
            <button
              key={resume.id}
              onClick={() => onSelectResume(resume.id)}
              className={`w-full p-3 rounded-lg text-left transition-all ${
                selectedResumeId === resume.id
                  ? 'bg-gold-dim border border-gold/30'
                  : 'bg-bg-tertiary hover:bg-bg-hover border border-transparent'
              }`}
            >
              <div className="font-heading text-sm font-semibold">{resume.name}</div>
            </button>
          ))}

          {resumes.length === 0 && (
            <Card className="p-4 text-center">
              <p className="text-text-muted text-sm">No resumes found. Create one first.</p>
              <Button size="sm" className="mt-2" onClick={() => window.location.href = '/resumes'}>
                Create Resume
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-status-red-dim border border-status-red/20 rounded-md p-3">
          <p className="text-sm text-status-red">{error}</p>
        </div>
      )}

      {/* Analyze Button */}
      <Button
        className="w-full"
        onClick={onAnalyze}
        disabled={analyzing || !selectedResumeId || !jobData.description}
      >
        {analyzing ? 'Analyzing...' : '◈ Analyze Match'}
      </Button>
    </div>
  )
}
