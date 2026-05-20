'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/Card'

interface QuickStatsProps {
  stats: {
    resumes: number
    jobsAnalyzed: number
    translations: number
  }
}

function useCountUp(target: number, duration: number = 800, delay: number = 0) {
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
        // Ease-out quad for snappy deceleration
        const eased = 1 - (1 - progress) * (1 - progress)
        setCurrent(Math.round(eased * target))

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

function StatCard({
  icon,
  value,
  label,
  delay,
  staggerIndex,
}: {
  icon: React.ReactNode
  value: number
  label: string
  delay: number
  staggerIndex: number
}) {
  const { current, done } = useCountUp(value, 800, delay)

  return (
    <Card
      className="p-4 text-center animate-stagger-in"
      style={{ animationDelay: `${staggerIndex * 100}ms` }}
    >
      <div className="w-5 h-5 text-text-muted mx-auto mb-2">
        {icon}
      </div>
      <div
        className={`font-heading text-2xl font-bold text-gold transition-transform duration-300 ${
          done && value > 0 ? 'animate-stat-pulse' : ''
        }`}
      >
        {current}
      </div>
      <div className="text-[11px] text-text-muted uppercase tracking-wider mt-0.5">{label}</div>
    </Card>
  )
}

export function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
        value={stats.resumes}
        label="Resumes"
        delay={200}
        staggerIndex={0}
      />
      <StatCard
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        }
        value={stats.jobsAnalyzed}
        label="Jobs Analyzed"
        delay={400}
        staggerIndex={1}
      />
      <StatCard
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
        }
        value={stats.translations}
        label="Translations"
        delay={600}
        staggerIndex={2}
      />
    </div>
  )
}
