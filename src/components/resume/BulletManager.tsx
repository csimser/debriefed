'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Bullet {
  id: string
  original_text: string
  translated_text: string
  status: 'pending' | 'accepted' | 'excluded'
}

interface BulletManagerProps {
  bullets: Bullet[]
  experienceId: string
  onUpdate: (bullets: Bullet[]) => void
  onRetry?: (bulletId: string) => void
}

export function BulletManager({ bullets, experienceId, onUpdate, onRetry }: BulletManagerProps) {
  const [updating, setUpdating] = useState<string | null>(null)
  const supabase = createClient()

  const updateBulletStatus = async (bulletId: string, status: 'pending' | 'accepted' | 'excluded') => {
    setUpdating(bulletId)
    try {
      const { error } = await supabase
        .from('experience_bullets')
        .update({ status })
        .eq('id', bulletId)

      if (error) {
        console.error('Error updating bullet status:', error)
        return
      }

      onUpdate(bullets.map(b =>
        b.id === bulletId
          ? { ...b, status }
          : b
      ))
    } finally {
      setUpdating(null)
    }
  }

  const handleAccept = (id: string) => updateBulletStatus(id, 'accepted')
  const handleExclude = (id: string) => updateBulletStatus(id, 'excluded')
  const handleInclude = (id: string) => updateBulletStatus(id, 'pending')

  // Separate active and excluded bullets
  const activeBullets = bullets.filter(b => b.status !== 'excluded')
  const excludedBullets = bullets.filter(b => b.status === 'excluded')

  if (bullets.length === 0) {
    return (
      <div className="bg-bg-tertiary border border-border rounded-lg p-4">
        <h3 className="text-sm text-gold uppercase tracking-wider mb-3">Achievement Bullets</h3>
        <p className="text-text-dim text-sm text-center py-4">
          No bullets yet. Upload an EVAL or add bullets manually.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-bg-tertiary border border-border rounded-lg p-4">
      <h3 className="text-sm text-gold uppercase tracking-wider mb-3">Achievement Bullets</h3>

      {/* Active Bullets */}
      <div className="space-y-3">
        {activeBullets.map((bullet) => (
          <BulletItem
            key={bullet.id}
            bullet={bullet}
            isUpdating={updating === bullet.id}
            onAccept={() => handleAccept(bullet.id)}
            onRetry={() => onRetry?.(bullet.id)}
            onExclude={() => handleExclude(bullet.id)}
          />
        ))}
      </div>

      {activeBullets.length === 0 && excludedBullets.length > 0 && (
        <p className="text-text-dim text-sm text-center py-4">
          All bullets have been excluded
        </p>
      )}

      {/* Excluded Bullets (collapsible) */}
      {excludedBullets.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <details className="group">
            <summary className="text-xs text-text-dim cursor-pointer hover:text-text-muted flex items-center gap-1">
              <svg
                className="w-3 h-3 transition-transform group-open:rotate-90"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6"/>
              </svg>
              {excludedBullets.length} excluded bullet{excludedBullets.length !== 1 ? 's' : ''}
            </summary>
            <div className="mt-2 space-y-2">
              {excludedBullets.map((bullet) => (
                <div
                  key={bullet.id}
                  className="flex items-start gap-2 p-2 bg-bg-secondary/50 rounded opacity-60"
                >
                  <div className="flex-1">
                    <div className="text-xs text-text-dim line-through">
                      {bullet.translated_text || bullet.original_text}
                    </div>
                  </div>
                  <button
                    onClick={() => handleInclude(bullet.id)}
                    disabled={updating === bullet.id}
                    className="px-2 py-1 text-xs bg-bg-tertiary hover:bg-bg-hover text-text-muted rounded transition-colors disabled:opacity-50"
                  >
                    + Include
                  </button>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  )
}

interface BulletItemProps {
  bullet: Bullet
  isUpdating: boolean
  onAccept: () => void
  onRetry?: () => void
  onExclude: () => void
}

function BulletItem({ bullet, isUpdating, onAccept, onRetry, onExclude }: BulletItemProps) {
  const isAccepted = bullet.status === 'accepted'

  return (
    <div
      className={`p-3 rounded-lg border transition-all ${
        isAccepted
          ? 'bg-status-green/10 border-status-green/30'
          : 'bg-bg-secondary border-border'
      }`}
    >
      {/* Original */}
      {bullet.original_text && bullet.original_text !== bullet.translated_text && (
        <div className="mb-2">
          <span className="text-xs text-text-dim uppercase">Original:</span>
          <p className="text-sm text-text-muted">{bullet.original_text}</p>
        </div>
      )}

      {/* Translated */}
      <div className="mb-3">
        <span className="text-xs text-gold uppercase">
          {bullet.original_text && bullet.original_text !== bullet.translated_text ? 'Translated:' : 'Bullet:'}
        </span>
        <p className="text-sm text-text-primary">{bullet.translated_text || bullet.original_text}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {isAccepted ? (
          <span className="text-xs text-status-green flex items-center gap-1">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Accepted
          </span>
        ) : (
          <button
            onClick={onAccept}
            disabled={isUpdating}
            className="px-3 py-1.5 bg-gold hover:bg-gold-bright text-bg-primary text-xs font-semibold rounded uppercase transition-colors disabled:opacity-50"
          >
            + Accept
          </button>
        )}

        {onRetry && (
          <button
            onClick={onRetry}
            disabled={isUpdating}
            className="px-3 py-1.5 bg-bg-tertiary hover:bg-bg-hover text-text-muted text-xs font-semibold rounded uppercase transition-colors disabled:opacity-50"
          >
            ~ Retry
          </button>
        )}

        <button
          onClick={onExclude}
          disabled={isUpdating}
          className="px-3 py-1.5 bg-status-red/20 hover:bg-status-red/30 text-status-red text-xs font-semibold rounded uppercase transition-colors disabled:opacity-50"
        >
          x Exclude
        </button>
      </div>
    </div>
  )
}
