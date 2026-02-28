'use client'

import { useState } from 'react'

interface FederalCompletenessCheckerProps {
  content: any
}

interface CheckResult {
  label: string
  status: 'pass' | 'warn' | 'missing'
  detail?: string
}

function checkCompleteness(content: any): { overall: number; checks: CheckResult[] } {
  const checks: CheckResult[] = []
  const c = content?.contact || {}
  const exps = content?.experiences || []

  // Contact info
  checks.push({
    label: 'Full Name',
    status: c.first_name && c.last_name ? 'pass' : 'missing',
    detail: !c.first_name || !c.last_name ? 'First and last name required' : undefined,
  })
  checks.push({
    label: 'Email',
    status: c.email ? 'pass' : 'missing',
  })
  checks.push({
    label: 'Phone',
    status: c.phone ? 'pass' : 'missing',
  })
  checks.push({
    label: 'Address (City, State, ZIP)',
    status: c.city && c.state && c.zip ? 'pass' : c.city || c.state ? 'warn' : 'missing',
    detail: !(c.city && c.state && c.zip) ? 'Full address required for federal applications' : undefined,
  })

  // Citizenship
  checks.push({
    label: 'Citizenship Status',
    status: content.citizenship ? 'pass' : 'missing',
    detail: !content.citizenship ? 'Required for all federal applications' : undefined,
  })

  // Veterans Preference
  checks.push({
    label: "Veteran's Preference",
    status: content.veterans_preference !== undefined && content.veterans_preference !== null ? 'pass' : 'warn',
    detail: content.veterans_preference === undefined ? 'Recommended — select your preference claim' : undefined,
  })

  // Professional Summary
  const summary = content.summary || ''
  checks.push({
    label: 'Professional Summary',
    status: summary.length >= 100 ? 'pass' : summary.length > 0 ? 'warn' : 'missing',
    detail: summary.length === 0 ? 'A strong summary is essential for federal resumes' : summary.length < 100 ? 'Consider expanding (at least 100 characters)' : undefined,
  })

  // Experiences
  checks.push({
    label: 'Work Experience (at least 1)',
    status: exps.length > 0 ? 'pass' : 'missing',
    detail: exps.length === 0 ? 'Federal resumes require detailed work history' : undefined,
  })

  // Per-experience checks
  exps.forEach((exp: any, idx: number) => {
    const title = exp.civilian_title || exp.job_title || `Position ${idx + 1}`
    const issues: string[] = []

    if (!exp.organization) issues.push('employer')
    if (!exp.start_date) issues.push('start date')
    if (!exp.end_date && !exp.is_current) issues.push('end date')
    const activeBullets = (exp.bullets || []).filter((b: any) => b.status !== 'excluded')
    if (activeBullets.length === 0) issues.push('bullet points')

    // Federal-specific: hours per week
    if (!exp.hours_per_week) issues.push('hours/week')

    if (issues.length === 0) {
      checks.push({ label: `${title} — complete`, status: 'pass' })
    } else {
      checks.push({
        label: `${title}`,
        status: issues.includes('bullet points') || issues.includes('employer') ? 'missing' : 'warn',
        detail: `Missing: ${issues.join(', ')}`,
      })
    }
  })

  // Education
  const edu = content.education || []
  checks.push({
    label: 'Education',
    status: edu.length > 0 ? 'pass' : 'warn',
    detail: edu.length === 0 ? 'Education section recommended for federal resumes' : undefined,
  })

  // Skills
  const skills = content.skills || []
  checks.push({
    label: 'Skills / KSAs',
    status: skills.length >= 3 ? 'pass' : skills.length > 0 ? 'warn' : 'missing',
    detail: skills.length === 0 ? 'Include relevant skills and competencies' : skills.length < 3 ? 'Add more skills for better matching' : undefined,
  })

  // Calculate overall percentage
  const total = checks.length
  const passCount = checks.filter(c => c.status === 'pass').length
  const warnCount = checks.filter(c => c.status === 'warn').length
  const overall = Math.round(((passCount + warnCount * 0.5) / total) * 100)

  return { overall, checks }
}

export function FederalCompletenessChecker({ content }: FederalCompletenessCheckerProps) {
  const [expanded, setExpanded] = useState(false)
  const { overall, checks } = checkCompleteness(content)

  const missingCount = checks.filter(c => c.status === 'missing').length
  const warnCount = checks.filter(c => c.status === 'warn').length

  // Color based on score
  const barColor = overall >= 80 ? 'bg-status-green' : overall >= 50 ? 'bg-status-amber' : 'bg-status-red'
  const textColor = overall >= 80 ? 'text-status-green' : overall >= 50 ? 'text-status-amber' : 'text-status-red'

  return (
    <div className="border border-border rounded-lg mb-4 overflow-hidden">
      <button
        onClick={() => setExpanded(prev => !prev)}
        className="w-full px-4 py-3 flex items-center justify-between bg-bg-tertiary hover:bg-bg-hover transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Federal Completeness</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-bg-secondary rounded-full overflow-hidden">
              <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${overall}%` }} />
            </div>
            <span className={`text-xs font-bold ${textColor}`}>{overall}%</span>
          </div>
          {missingCount > 0 && (
            <span className="text-xs text-status-red">{missingCount} missing</span>
          )}
          {warnCount > 0 && missingCount === 0 && (
            <span className="text-xs text-status-amber">{warnCount} to review</span>
          )}
          {missingCount === 0 && warnCount === 0 && (
            <span className="text-xs text-status-green">All clear</span>
          )}
        </div>
        <span className={`text-text-dim text-xs transition-transform ${expanded ? 'rotate-180' : ''}`}>&#9662;</span>
      </button>

      {expanded && (
        <div className="px-4 py-3 border-t border-border space-y-1.5 bg-bg-secondary/50">
          {checks.map((check, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs">
              <span className={`mt-0.5 font-bold ${
                check.status === 'pass' ? 'text-status-green' :
                check.status === 'warn' ? 'text-status-amber' :
                'text-status-red'
              }`}>
                {check.status === 'pass' ? '\u2713' : check.status === 'warn' ? '!' : '\u2717'}
              </span>
              <div className="min-w-0">
                <span className={check.status === 'pass' ? 'text-text-muted' : 'text-text-secondary'}>{check.label}</span>
                {check.detail && (
                  <span className="text-text-dim ml-1">— {check.detail}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
