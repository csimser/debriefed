'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface ScoreGaugeProps {
  score: number
  label?: string
  size?: 'sm' | 'lg'
  previousScore?: number
}

function useCountUp(target: number, duration: number = 1200, delay: number = 300) {
  const [current, setCurrent] = useState(0)
  const [done, setDone] = useState(false)
  const frameRef = useRef<number>(null)

  useEffect(() => {
    if (target === 0) {
      setCurrent(0)
      setDone(true)
      return
    }

    setCurrent(0)
    setDone(false)

    const timeout = setTimeout(() => {
      const startTime = performance.now()

      function tick(now: number) {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        // Ease-out cubic for satisfying deceleration
        const eased = 1 - Math.pow(1 - progress, 3)
        const value = Math.round(eased * target)

        setCurrent(value)

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(tick)
        } else {
          setDone(true)
        }
      }

      frameRef.current = requestAnimationFrame(tick)
    }, delay)

    return () => {
      clearTimeout(timeout)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration, delay])

  return { current, done }
}

export function ScoreGauge({ score, label = 'Job Match Score', size = 'lg', previousScore }: ScoreGaugeProps) {
  const r = size === 'lg' ? 70 : 40
  const stroke = size === 'lg' ? 10 : 6
  const viewSize = (r + stroke) * 2
  const circ = 2 * Math.PI * r

  // Arc spans 240 degrees (from 150° to 390°)
  const arcFraction = 240 / 360
  const arcLength = circ * arcFraction

  // Animate the number counting up
  const { current: displayScore, done: countDone } = useCountUp(score, size === 'lg' ? 1400 : 800)

  // Calculate filled length based on animated score
  const filledLength = (displayScore / 100) * arcLength

  const getColor = useCallback((s: number) => {
    return s >= 75 ? 'text-status-green' : s >= 50 ? 'text-status-amber' : 'text-status-red'
  }, [])

  const color = getColor(displayScore)
  const finalColor = getColor(score)
  const bgTrack = 'text-border'

  const improved = previousScore !== undefined && score > previousScore
  const isStrong = score >= 75
  const [showVictory, setShowVictory] = useState(false)
  const [showDelta, setShowDelta] = useState(false)

  // Trigger victory state when count-up finishes on a high score
  useEffect(() => {
    if (countDone && isStrong && size === 'lg') {
      setShowVictory(true)
      const timer = setTimeout(() => setShowVictory(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [countDone, isStrong, size])

  // Show improvement delta after count finishes
  useEffect(() => {
    if (countDone && improved) {
      const timer = setTimeout(() => setShowDelta(true), 200)
      return () => clearTimeout(timer)
    }
  }, [countDone, improved])

  return (
    <div className="flex flex-col items-center relative">
      {/* Victory glow ring — pulses behind gauge on high scores */}
      {showVictory && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none animate-victory-pulse"
          style={{
            background: `radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%)`,
          }}
        />
      )}

      <div className="relative" style={{ width: viewSize, height: viewSize }}>
        <svg viewBox={`0 0 ${viewSize} ${viewSize}`} className="w-full h-full" style={{ transform: 'rotate(150deg)' }}>
          {/* Background arc */}
          <circle
            cx={viewSize / 2}
            cy={viewSize / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circ - arcLength}`}
            className={bgTrack}
          />
          {/* Filled arc — driven by animated score */}
          <circle
            cx={viewSize / 2}
            cy={viewSize / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${filledLength} ${circ - filledLength}`}
            className={color}
            style={{ transition: 'none' }}
          />
          {/* Glow arc — subtle outer glow that intensifies as score rises */}
          {size === 'lg' && displayScore > 0 && (
            <circle
              cx={viewSize / 2}
              cy={viewSize / 2}
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth={stroke + 6}
              strokeLinecap="round"
              strokeDasharray={`${filledLength} ${circ - filledLength}`}
              className={color}
              style={{ transition: 'none', opacity: 0.15, filter: 'blur(4px)' }}
            />
          )}
        </svg>

        {/* Center number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-mono font-bold ${color} ${size === 'lg' ? 'text-5xl' : 'text-2xl'}`}
            style={{
              // Subtle scale pop when count finishes
              transform: countDone ? 'scale(1)' : 'scale(0.95)',
              transition: 'transform 0.3s ease-out',
            }}
          >
            {displayScore}
          </span>
          {size === 'lg' && (
            <span className="text-xs text-text-muted mt-0.5">/ 100</span>
          )}
        </div>

        {/* Victory stamp — "STRONG MATCH" badge */}
        {showVictory && size === 'lg' && (
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap animate-stamp-in"
          >
            <div className="px-3 py-1 bg-status-green/20 border border-status-green/40 rounded-full">
              <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-status-green">
                Strong Match
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Label */}
      <div
        className={`font-heading font-bold uppercase tracking-wider mt-1 ${finalColor} ${size === 'lg' ? 'text-sm' : 'text-xs'}`}
        style={{
          opacity: countDone ? 1 : 0.5,
          transition: 'opacity 0.3s ease',
        }}
      >
        {label}
      </div>

      {/* Improvement delta — floats up when count finishes */}
      {improved && showDelta && (
        <div
          className="text-xs text-status-green mt-0.5 font-bold animate-delta-float"
        >
          +{score - previousScore!} from {previousScore}%
        </div>
      )}

    </div>
  )
}
