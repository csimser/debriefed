'use client'

import { useRouter } from 'next/navigation'
import { EvalHistory } from './EvalHistory'

interface EvalHistorySectionProps {
  uploads: any[]
  experiences: any[]
  userId: string
}

export function EvalHistorySection({ uploads, experiences, userId }: EvalHistorySectionProps) {
  const router = useRouter()

  return (
    <div>
      <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
        <span className="text-gold">&#9672;</span> Evaluation Upload History
      </h2>
      <p className="text-text-muted text-sm mb-4">
        Your past eval uploads and extracted bullets. Click &quot;Import&quot; to add bullets to an experience.
      </p>
      <EvalHistory
        uploads={uploads}
        experiences={experiences}
        userId={userId}
        onImportComplete={() => router.refresh()}
      />
    </div>
  )
}
