'use client'

import { useEffect, useState } from 'react'
import { EvalHistory } from './EvalHistory'
import { listEvalUploads, listExperiences } from '@/lib/storage'

interface EvalHistorySectionProps {
  /** Optional — falls back to local storage when omitted. */
  uploads?: any[]
  /** Optional — falls back to local storage when omitted. */
  experiences?: any[]
  /** Legacy prop, no longer used (data is local). Kept for compatibility. */
  userId?: string
  /** Called after bullets are imported so the parent can refresh its data. */
  onImportComplete?: () => void
}

export function EvalHistorySection({ uploads, experiences, userId, onImportComplete }: EvalHistorySectionProps) {
  const [localUploads, setLocalUploads] = useState<any[]>([])
  const [localExperiences, setLocalExperiences] = useState<any[]>([])

  // Storage fallback when props are omitted
  useEffect(() => {
    if (!uploads) setLocalUploads(listEvalUploads())
    if (!experiences) setLocalExperiences(listExperiences())
  }, [uploads, experiences])

  const resolvedUploads = uploads ?? localUploads
  const resolvedExperiences = experiences ?? localExperiences

  const handleImportComplete = () => {
    if (onImportComplete) {
      onImportComplete()
    } else {
      setLocalUploads(listEvalUploads())
      setLocalExperiences(listExperiences())
    }
  }

  return (
    <div>
      <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
        <span className="text-gold">&#9672;</span> Evaluation Upload History
      </h2>
      <p className="text-text-muted text-sm mb-4">
        Your past eval uploads and extracted bullets. Click &quot;Import&quot; to add bullets to an experience.
      </p>
      <EvalHistory
        uploads={resolvedUploads}
        experiences={resolvedExperiences}
        userId={userId ?? ''}
        onImportComplete={handleImportComplete}
      />
    </div>
  )
}
