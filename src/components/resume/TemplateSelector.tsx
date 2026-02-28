'use client'

import { SELECTABLE_TEMPLATES, TemplateId } from '@/lib/templates'
import { cn } from '@/lib/utils'
import { getUserTier, isPaidTier } from '@/lib/tier-utils'

interface TemplateSelectorProps {
  selected: TemplateId
  onSelect: (id: TemplateId) => void
  userPlan: string
}

/** Lightweight CSS-only thumbnails representing each template layout */
function TemplateThumbnail({ templateId, isSelected }: { templateId: string; isSelected: boolean }) {
  const accent = isSelected ? 'bg-gold/50' : 'bg-neutral-400'
  const line = 'bg-neutral-200'
  const header = isSelected ? 'bg-gold/30' : 'bg-neutral-700'

  switch (templateId) {
    case 'executive':
      return (
        <div className="w-full h-full bg-white flex">
          <div className="w-[35%] bg-slate-800 p-1 flex flex-col gap-[2px]">
            <div className={cn('h-[2px] w-full rounded-sm', accent)} />
            <div className="h-[2px] w-3/4 bg-slate-400 rounded-sm" />
            <div className="h-[2px] w-1/2 bg-slate-500 rounded-sm" />
          </div>
          <div className="flex-1 p-1 flex flex-col gap-[2px]">
            <div className={cn('h-[3px] w-3/4 rounded-sm', header)} />
            <div className={cn('h-[2px] w-full rounded-sm', line)} />
            <div className={cn('h-[2px] w-4/5 rounded-sm', line)} />
          </div>
        </div>
      )
    case 'modern':
      return (
        <div className="w-full h-full bg-white flex flex-col">
          <div className="h-[14px] bg-slate-900 px-1 flex items-end pb-0.5">
            <div className={cn('h-[3px] w-1/2 rounded-sm', isSelected ? 'bg-teal-400' : 'bg-teal-600')} />
          </div>
          <div className="flex-1 p-1 flex flex-col gap-[2px]">
            <div className={cn('h-[2px] w-full rounded-sm', line)} />
            <div className={cn('h-[2px] w-3/4 rounded-sm', line)} />
            <div className={cn('h-[2px] w-full rounded-sm', line)} />
          </div>
        </div>
      )
    case 'minimal':
      return (
        <div className="w-full h-full bg-white p-1.5 flex flex-col gap-[3px]">
          <div className={cn('h-[3px] w-1/2 rounded-sm', header)} />
          <div className="h-[2px] w-1/3 bg-neutral-300 rounded-sm" />
          <div className={cn('mt-1.5 h-[2px] w-full rounded-sm', line)} />
          <div className={cn('h-[2px] w-3/4 rounded-sm', line)} />
        </div>
      )
    case 'twocol':
      return (
        <div className="w-full h-full bg-white flex">
          <div className="w-[35%] bg-slate-900 p-1 flex flex-col gap-[2px]">
            <div className={cn('h-[2px] w-full rounded-sm', isSelected ? 'bg-amber-400' : 'bg-amber-500/50')} />
            <div className="h-[2px] w-3/4 bg-slate-500 rounded-sm" />
            <div className="h-[2px] w-1/2 bg-slate-500 rounded-sm" />
          </div>
          <div className="flex-1 p-1 flex flex-col gap-[2px]">
            <div className={cn('h-[3px] w-3/4 rounded-sm', header)} />
            <div className={cn('h-[2px] w-full rounded-sm', line)} />
            <div className={cn('h-[2px] w-4/5 rounded-sm', line)} />
          </div>
        </div>
      )
    default: // classic_professional
      return (
        <div className="w-full h-full bg-white p-1 flex flex-col gap-[2px]">
          <div className={cn('h-[3px] w-3/4 rounded-sm', header)} />
          <div className="h-[2px] w-1/2 bg-neutral-300 rounded-sm" />
          <div className={cn('h-[1px] w-full', isSelected ? 'bg-gold/30' : 'bg-neutral-200')} />
          <div className={cn('mt-0.5 h-[2px] w-full rounded-sm', line)} />
          <div className={cn('h-[2px] w-4/5 rounded-sm', line)} />
          <div className={cn('h-[2px] w-full rounded-sm', line)} />
          <div className={cn('h-[2px] w-3/5 rounded-sm', line)} />
        </div>
      )
  }
}

export function TemplateSelector({ selected, onSelect, userPlan }: TemplateSelectorProps) {
  const userTier = getUserTier({ tier: userPlan })
  const hasPremiumAccess = isPaidTier(userTier)

  return (
    <div className="flex gap-2 overflow-x-auto py-1 scrollbar-none">
      {Object.values(SELECTABLE_TEMPLATES).map((template) => {
        const isLocked = !template.free && !hasPremiumAccess
        const isSelected = selected === template.id

        return (
          <button
            key={template.id}
            onClick={() => !isLocked && onSelect(template.id as TemplateId)}
            disabled={isLocked}
            className={cn(
              'relative flex-shrink-0 rounded-lg border p-0.5 transition-all',
              isSelected
                ? 'border-gold ring-1 ring-gold/30'
                : 'border-border hover:border-border-bright',
              isLocked && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div className="w-12 h-16 rounded overflow-hidden">
              <TemplateThumbnail templateId={template.id} isSelected={isSelected} />
            </div>
            <div className={cn(
              'text-[8px] font-heading font-bold uppercase tracking-wider text-center mt-0.5 truncate w-12',
              isSelected ? 'text-gold' : 'text-text-muted'
            )}>
              {template.name === 'Classic Professional' ? 'Classic' : template.name === 'Two Column' ? '2-Col' : template.name}
            </div>
          </button>
        )
      })}
    </div>
  )
}
