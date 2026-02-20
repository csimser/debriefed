'use client'

import { useState } from 'react'
import { CollapsibleSection } from '../CollapsibleSection'
import { Button } from '@/components/ui/Button'

interface ProfessionalSummarySectionProps {
  data: any
  onChange: (updates: any) => void
}

export function ProfessionalSummarySection({ data, onChange }: ProfessionalSummarySectionProps) {
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rank: data?.rank,
          paygrade: data?.paygrade,
          branch: data?.branch,
          years: data?.years_of_service,
          mos: data?.mos_rating,
          clearance: data?.security_clearance,
        }),
      })
      const result = await res.json()
      if (result.summary) onChange({ professional_summary: result.summary })
    } catch (error) {
      console.error('Generate error:', error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <CollapsibleSection
      title="Professional Summary"
      icon="◈"
      actions={
        <Button size="sm" variant="secondary" onClick={handleGenerate} disabled={generating}>
          {generating ? 'Generating...' : 'Auto-Generate'}
        </Button>
      }
    >
      <textarea
        value={data?.professional_summary || ''}
        onChange={e => onChange({ professional_summary: e.target.value })}
        placeholder="Write a 3-4 sentence summary of your professional background and career goals..."
        className="w-full h-32 bg-bg-secondary border border-border rounded-md px-4 py-3 text-text placeholder:text-text-dim resize-none focus:border-gold focus:ring-1 focus:ring-gold/25"
        autoComplete="off"
      />
      <p className="text-xs text-text-muted mt-2">50-75 words recommended. No first person pronouns.</p>
    </CollapsibleSection>
  )
}
