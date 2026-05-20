'use client'

interface ProfileProgressProps {
  completeness: number
  nextAction: { label: string; href: string } | null
}

export function ProfileProgress({ completeness, nextAction }: ProfileProgressProps) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (completeness / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3 p-5 rounded-xl border border-border bg-bg-card">
      {/* SVG Ring */}
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle
            cx="48" cy="48" r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-bg-secondary"
          />
          <circle
            cx="48" cy="48" r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            className="text-gold transition-all duration-700 ease-out"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-heading text-xl font-bold text-text">{completeness}%</span>
        </div>
      </div>

      <span className="text-xs text-text-muted uppercase tracking-wider font-heading font-bold">
        Profile Complete
      </span>

      {nextAction && completeness < 100 && (
        <a
          href={nextAction.href}
          className="text-xs text-gold hover:text-gold-bright transition-colors text-center leading-snug"
        >
          {nextAction.label} &rarr;
        </a>
      )}
    </div>
  )
}
