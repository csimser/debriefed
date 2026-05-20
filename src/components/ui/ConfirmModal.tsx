'use client'

import { Card } from './Card'
import { Button } from './Button'
import { ModalShell } from '@/components/ui/ModalShell'

interface ConfirmModalProps {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'default'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <ModalShell isOpen={true} onClose={onCancel} title={title} maxWidth="max-w-md">
      {/* Mobile: drawer from bottom, Desktop: centered modal */}
      <Card
        className="w-full max-w-md p-6 md:p-6 rounded-t-2xl md:rounded-lg md:mx-4 animate-fade-in safe-area-inset-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag indicator for mobile */}
        <div className="md:hidden w-12 h-1 bg-border rounded-full mx-auto mb-4" />

        <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-3">
          {title}
        </h2>
        <p className="text-text-muted text-sm md:text-sm mb-6 leading-relaxed">{message}</p>

        {/* Mobile: stacked full-width buttons, Desktop: inline */}
        <div className="flex flex-col-reverse md:flex-row gap-3 md:justify-end">
          <Button variant="ghost" onClick={onCancel} fullWidthMobile>
            {cancelLabel}
          </Button>
          <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} fullWidthMobile>
            {confirmLabel}
          </Button>
        </div>
      </Card>
    </ModalShell>
  )
}
