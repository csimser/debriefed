'use client'

import { TEMPLATES, TemplateId } from '@/lib/templates'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { getUserTier, isPaidTier } from '@/lib/tier-utils'

interface TemplateSelectorProps {
  selected: TemplateId
  onSelect: (id: TemplateId) => void
  userPlan: string
}

export function TemplateSelector({ selected, onSelect, userPlan }: TemplateSelectorProps) {
  // Core and Full tier users can access all templates
  const userTier = getUserTier({ tier: userPlan })
  const hasPremiumAccess = isPaidTier(userTier)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {Object.values(TEMPLATES).map((template) => {
        const isLocked = !template.free && !hasPremiumAccess
        const isSelected = selected === template.id

        return (
          <button
            key={template.id}
            onClick={() => !isLocked && onSelect(template.id as TemplateId)}
            disabled={isLocked}
            className={cn(
              'relative p-4 rounded-lg border text-left transition-all',
              isSelected
                ? 'border-gold bg-gold-dim'
                : 'border-border bg-bg-tertiary hover:border-border-bright',
              isLocked && 'opacity-50 cursor-not-allowed'
            )}
          >
            {/* Template Preview Placeholder */}
            <div className="h-20 bg-bg-secondary rounded mb-3 flex items-center justify-center">
              <span className="text-2xl text-text-dim">◫</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-heading text-sm font-bold uppercase">{template.name}</div>
                <div className="text-xs text-text-muted">{template.description}</div>
              </div>
              {isLocked && <Badge variant="gold">PRO</Badge>}
            </div>

            {isSelected && (
              <div className="absolute top-2 right-2">
                <span className="text-gold">✓</span>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
