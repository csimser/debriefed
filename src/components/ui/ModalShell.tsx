'use client'

import { useEffect, useRef, useCallback, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ModalShellProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  className?: string
  maxWidth?: string
  backdrop?: string
}

export function ModalShell({
  isOpen,
  onClose,
  children,
  title,
  className,
  maxWidth = 'max-w-lg',
  backdrop,
}: ModalShellProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Lock body scroll and save/restore focus
  useEffect(() => {
    if (!isOpen) return
    previousFocusRef.current = document.activeElement as HTMLElement
    document.body.style.overflow = 'hidden'

    // Focus the dialog container on open
    requestAnimationFrame(() => {
      dialogRef.current?.focus()
    })

    return () => {
      document.body.style.overflow = ''
      previousFocusRef.current?.focus()
    }
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Focus trap
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !dialogRef.current) return

    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }, [])

  if (!isOpen) return null

  const titleId = title ? 'modal-title-' + title.replace(/\s+/g, '-').toLowerCase() : undefined

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={cn('absolute inset-0', backdrop || 'bg-black/60')}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative w-full outline-none',
          maxWidth,
          className,
        )}
      >
        {/* Hidden title for screen readers when no visible title */}
        {title && titleId && (
          <span id={titleId} className="sr-only">{title}</span>
        )}
        {children}
      </div>
    </div>
  )
}
