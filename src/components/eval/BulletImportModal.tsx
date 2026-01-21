'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/client'

interface BulletImportModalProps {
  bullets: any[]
  experiences: any[]
  userId: string
  onClose: () => void
  onImport: () => void
}

export function BulletImportModal({ bullets, experiences, userId, onClose, onImport }: BulletImportModalProps) {
  const [selectedBullets, setSelectedBullets] = useState<Set<number>>(new Set())
  const [targetExperienceId, setTargetExperienceId] = useState<string>('')
  const [importing, setImporting] = useState(false)
  const supabase = createClient()

  const toggleBullet = (idx: number) => {
    const newSelected = new Set(selectedBullets)
    if (newSelected.has(idx)) {
      newSelected.delete(idx)
    } else {
      newSelected.add(idx)
    }
    setSelectedBullets(newSelected)
  }

  const selectAll = () => {
    setSelectedBullets(new Set(bullets.map((_, idx) => idx)))
  }

  const handleImport = async () => {
    if (!targetExperienceId || selectedBullets.size === 0) return

    setImporting(true)

    try {
      const bulletsToInsert = Array.from(selectedBullets).map((idx, order) => ({
        experience_id: targetExperienceId,
        original_text: bullets[idx].original,
        source: 'eval_upload',
        sort_order: order,
      }))

      const { error } = await supabase
        .from('experience_bullets')
        .insert(bulletsToInsert)

      if (!error) {
        onImport()
        onClose()
      }
    } catch (error) {
      console.error('Import error:', error)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wider">
            Import Bullets to Experience
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text">✕</button>
        </div>

        {/* Experience Selector */}
        <div className="p-4 border-b border-border">
          <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
            Add to Experience
          </label>
          <select
            value={targetExperienceId}
            onChange={(e) => setTargetExperienceId(e.target.value)}
            className="w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-text"
          >
            <option value="">Select an experience...</option>
            {experiences.map((exp) => (
              <option key={exp.id} value={exp.id}>
                {exp.job_title} - {exp.organization}
              </option>
            ))}
          </select>
        </div>

        {/* Bullets List */}
        <div className="flex-1 overflow-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-muted">
              {selectedBullets.size} of {bullets.length} selected
            </span>
            <Button size="sm" variant="ghost" onClick={selectAll}>
              Select All
            </Button>
          </div>

          <div className="space-y-2">
            {bullets.map((bullet, idx) => (
              <button
                key={idx}
                onClick={() => toggleBullet(idx)}
                className={`w-full p-3 rounded-lg text-left transition-all ${
                  selectedBullets.has(idx)
                    ? 'bg-gold-dim border border-gold/30'
                    : 'bg-bg-tertiary hover:bg-bg-hover border border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    selectedBullets.has(idx)
                      ? 'bg-gold border-gold text-bg-primary'
                      : 'border-border'
                  }`}>
                    {selectedBullets.has(idx) && '✓'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{bullet.original}</p>
                    <Badge
                      variant={
                        bullet.category === 'leadership' ? 'gold' :
                        bullet.category === 'technical' ? 'blue' :
                        'green'
                      }
                      className="mt-2"
                    >
                      {bullet.category}
                    </Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleImport}
            disabled={!targetExperienceId || selectedBullets.size === 0 || importing}
          >
            {importing ? 'Importing...' : `Import ${selectedBullets.size} Bullet${selectedBullets.size !== 1 ? 's' : ''}`}
          </Button>
        </div>
      </Card>
    </div>
  )
}
