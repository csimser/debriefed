'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
  onClose: () => void
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for fade out
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const typeStyles = {
    success: 'bg-status-green-dim border-status-green text-status-green',
    error: 'bg-status-red-dim border-status-red text-status-red',
    info: 'bg-gold-dim border-gold text-gold',
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 px-6 py-3 rounded-lg border transition-all duration-300 z-50',
        typeStyles[type],
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}
    >
      <p className="font-heading text-sm uppercase tracking-wider">{message}</p>
    </div>
  )
}
