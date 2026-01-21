'use client'

import { useState, useEffect } from 'react'
import { CollapsibleSection } from '../CollapsibleSection'
import { EvalUploadModal } from '../EvalUploadModal'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'

interface ExtractedBullet {
  original: string
  translated: string
  metrics: string[]
  skills: string[]
}

interface EvalUploadSectionProps {
  userId: string
  experiences: any[]
  onBulletsExtracted: (bullets: any[]) => void
  onExperiencesUpdated?: () => void // Callback to refresh experiences after direct save
}

export function EvalUploadSection({ userId, experiences, onBulletsExtracted, onExperiencesUpdated }: EvalUploadSectionProps) {
  const [showModal, setShowModal] = useState(false)
  const [extractionHistory, setExtractionHistory] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    loadExtractionHistory()
  }, [])

  const loadExtractionHistory = async () => {
    const { data } = await supabase
      .from('eval_uploads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)

    if (data) setExtractionHistory(data)
  }

  const handleBulletsExtracted = async (bullets: ExtractedBullet[], _experienceId: string | null) => {
    // Save extraction record (no file, just metadata) for history
    await supabase.from('eval_uploads').insert({
      user_id: userId,
      eval_type: 'extraction',
      extracted_bullets: bullets,
      bullet_count: bullets.length,
    })

    // Refresh history
    loadExtractionHistory()

    // Pass bullets to parent - the BulletAssignmentModal in ExperienceSection will handle saving
    onBulletsExtracted(bullets)
  }

  // Called when bullets are saved directly to an experience (no BulletAssignmentModal needed)
  const handleBulletsSavedDirectly = async () => {
    // Save extraction record for history
    await supabase.from('eval_uploads').insert({
      user_id: userId,
      eval_type: 'extraction',
      extracted_bullets: [],
      bullet_count: 0, // Will be updated separately
    })

    // Refresh history
    loadExtractionHistory()

    // Notify parent to refresh experiences
    onExperiencesUpdated?.()
  }

  return (
    <CollapsibleSection title="Evaluation Uploads" icon="&#9672;">
      <div className="space-y-6">
        {/* Security Notice */}
        <div className="p-4 bg-status-green/10 border border-status-green/30 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-status-green flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <div>
              <p className="font-semibold text-status-green text-sm">Secure Processing</p>
              <p className="text-xs text-text-muted mt-1">
                Your evaluation files are never stored. We extract text and immediately discard the original file.
                You must crop to select only the write-up section - no PII is captured.
              </p>
            </div>
          </div>
        </div>

        {/* Upload Button */}
        <div className="text-center py-6 border-2 border-dashed border-border rounded-lg hover:border-gold/50 transition-all">
          <svg className="w-12 h-12 mx-auto text-text-muted mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <p className="text-text-muted text-sm mb-4">
            Upload a FITREP, EVAL, NCOER, EPR, or other evaluation
          </p>
          <Button onClick={() => setShowModal(true)}>
            &#9670; Import from Evaluation
          </Button>
        </div>

        {/* Recent Extractions */}
        {extractionHistory.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
              Recent Extractions
            </h4>
            <div className="space-y-2">
              {extractionHistory.map((extraction) => (
                <Card key={extraction.id} className="p-3 bg-bg-tertiary">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {extraction.bullet_count || 0} bullets extracted
                      </p>
                      <p className="text-xs text-text-muted">
                        {new Date(extraction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-gold/20 text-gold rounded">
                      {extraction.eval_type || 'Eval'}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="p-4 bg-bg-tertiary rounded-lg">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">
            How It Works
          </h4>
          <ol className="text-xs text-text-muted space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-gold font-bold">1.</span>
              <span>Upload your evaluation (PDF or screenshot)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold font-bold">2.</span>
              <span>Crop to select ONLY the write-up/narrative section</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold font-bold">3.</span>
              <span>Extracts bullets and translates to civilian STAR format</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold font-bold">4.</span>
              <span>Review, edit, and add to your experience entries</span>
            </li>
          </ol>
        </div>
      </div>

      {/* Upload Modal */}
      <EvalUploadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onExtracted={handleBulletsExtracted}
        onBulletsSaved={handleBulletsSavedDirectly}
        userId={userId}
        experiences={experiences}
      />
    </CollapsibleSection>
  )
}
