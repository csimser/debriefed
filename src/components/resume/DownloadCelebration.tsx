'use client'

import { useEffect, useState, useMemo } from 'react'

interface DownloadCelebrationProps {
  fileName: string
  format: 'pdf' | 'docx'
  onDismiss: () => void
}

const GOLD_SHADES = ['#d4a84b', '#e4bc5e', '#c49a3a', '#f0d478', '#b8922e', '#22c55e', '#fff']

export function DownloadCelebration({ fileName, format, onDismiss }: DownloadCelebrationProps) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter')

  // Auto-dismiss sequence: enter → hold → exit
  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase('hold'), 100)
    const exitTimer = setTimeout(() => setPhase('exit'), 2800)
    const dismissTimer = setTimeout(onDismiss, 3200)

    return () => {
      clearTimeout(holdTimer)
      clearTimeout(exitTimer)
      clearTimeout(dismissTimer)
    }
  }, [onDismiss])

  // Generate particle positions once
  const particles = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.cos((i / 12) * Math.PI * 2) * (30 + Math.random() * 20),
      y: Math.sin((i / 12) * Math.PI * 2) * (30 + Math.random() * 20),
      delay: i * 40,
      color: GOLD_SHADES[i % GOLD_SHADES.length],
      size: 3 + Math.random() * 4,
    })),
  [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      style={{
        opacity: phase === 'exit' ? 0 : 1,
        transition: 'opacity 0.4s ease-out',
      }}
    >
      {/* Subtle backdrop */}
      <div
        className="absolute inset-0 bg-bg-primary/60 backdrop-blur-sm"
        style={{
          opacity: phase === 'enter' ? 0 : phase === 'exit' ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Celebration card */}
      <div className="relative flex flex-col items-center gap-4">
        {/* Animated checkmark circle */}
        <div className="relative">
          {/* Glow ring */}
          <div
            className="absolute inset-[-8px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(212, 168, 75, 0.3) 0%, transparent 70%)',
              opacity: phase === 'hold' ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
          />

          {/* Circle */}
          <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center animate-celebration-pop">
            <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                className="animate-check"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Gold particles burst outward from the check */}
          {phase !== 'enter' && particles.map(p => (
            <div
              key={p.id}
              className="absolute top-1/2 left-1/2 rounded-full animate-gold-particle"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                transform: `translate(${p.x}px, ${p.y}px)`,
                animationDelay: `${p.delay}ms`,
                opacity: 0,
                animationFillMode: 'forwards',
              }}
            />
          ))}
        </div>

        {/* Text */}
        <div className="text-center">
          <div
            className="animate-celebration-text"
            style={{ animationDelay: '0.2s', opacity: 0 }}
          >
            <p className="font-heading text-lg font-bold uppercase tracking-wider text-gold">
              Resume Downloaded
            </p>
          </div>
          <div
            className="animate-celebration-text"
            style={{ animationDelay: '0.4s', opacity: 0 }}
          >
            <p className="text-sm text-text-muted mt-1">
              {fileName}.{format}
            </p>
          </div>
        </div>

        {/* Shimmer bar */}
        <div className="w-48 h-0.5 bg-border overflow-hidden rounded-full">
          <div
            className="h-full w-full bg-gradient-to-r from-transparent via-gold to-transparent animate-shimmer-sweep"
            style={{ opacity: 0, animationFillMode: 'forwards' }}
          />
        </div>
      </div>
    </div>
  )
}
