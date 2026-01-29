'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { BulletImportModal } from './BulletImportModal'

interface EvalHistoryProps {
  uploads: any[]
  experiences: any[]
  userId: string
  onImportComplete: () => void
}

const EVAL_TYPE_NAMES: Record<string, string> = {
  fitrep: 'FITREP',
  chiefeval: 'Chief Eval',
  ncoer: 'NCOER',
  oer: 'OER',
  epr: 'EPR',
  award: 'Award',
}

export function EvalHistory({ uploads, experiences, userId, onImportComplete }: EvalHistoryProps) {
  const [viewingUpload, setViewingUpload] = useState<any>(null)

  if (uploads.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="text-text-dim text-3xl mb-2">◫</div>
        <p className="text-text-muted">No evaluations uploaded yet</p>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-3">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider flex items-center gap-2">
          <span className="text-gold">◫</span> Upload History
        </h3>

        {uploads.map((upload) => (
          <Card key={upload.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded flex items-center justify-center ${
                  upload.status === 'complete' ? 'bg-status-green-dim' :
                  upload.status === 'processing' ? 'bg-status-amber-dim' :
                  'bg-status-red-dim'
                }`}>
                  <span className={
                    upload.status === 'complete' ? 'text-status-green' :
                    upload.status === 'processing' ? 'text-status-amber' :
                    'text-status-red'
                  }>
                    {upload.status === 'complete' ? '✓' : upload.status === 'processing' ? '⟳' : '✕'}
                  </span>
                </div>

                <div>
                  <div className="font-heading text-sm font-semibold">{upload.filename}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="default">{EVAL_TYPE_NAMES[upload.eval_type] || upload.eval_type}</Badge>
                    <span className="text-xs text-text-muted">
                      {new Date(upload.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {upload.status === 'complete' && upload.extracted_data?.length > 0 && (
                  <>
                    <Badge variant="gold">{upload.extracted_data.length} bullets</Badge>
                    <Button size="sm" variant="secondary" onClick={() => setViewingUpload(upload)}>
                      Import
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Import Modal */}
      {viewingUpload && (
        <BulletImportModal
          bullets={viewingUpload.extracted_data || []}
          experiences={experiences}
          userId={userId}
          onClose={() => setViewingUpload(null)}
          onImport={onImportComplete}
        />
      )}
    </>
  )
}
