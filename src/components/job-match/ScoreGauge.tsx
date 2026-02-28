'use client'

interface ScoreGaugeProps {
  score: number
  label?: string
  size?: 'sm' | 'lg'
  previousScore?: number
}

export function ScoreGauge({ score, label = 'Job Match Score', size = 'lg', previousScore }: ScoreGaugeProps) {
  const r = size === 'lg' ? 70 : 40
  const stroke = size === 'lg' ? 10 : 6
  const viewSize = (r + stroke) * 2
  const circ = 2 * Math.PI * r

  // Arc spans 240 degrees (from 150° to 390°)
  const arcFraction = 240 / 360
  const arcLength = circ * arcFraction
  const filledLength = (score / 100) * arcLength
  const gapLength = arcLength - filledLength

  const color = score >= 75 ? 'text-status-green' : score >= 50 ? 'text-status-amber' : 'text-status-red'
  const bgTrack = 'text-border'

  const improved = previousScore !== undefined && score > previousScore

  return (
    <div className="flex flex-col items-center">
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
          {/* Filled arc */}
          <circle
            cx={viewSize / 2}
            cy={viewSize / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${filledLength} ${circ - filledLength}`}
            className={`${color} transition-all duration-700`}
          />
        </svg>
        {/* Center number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-mono font-bold ${color} ${size === 'lg' ? 'text-5xl' : 'text-2xl'}`}>
            {score}
          </span>
          {size === 'lg' && (
            <span className="text-xs text-text-muted mt-0.5">/ 100</span>
          )}
        </div>
      </div>
      <div className={`font-heading font-bold uppercase tracking-wider mt-1 ${color} ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>
        {label}
      </div>
      {improved && (
        <div className="text-xs text-status-green mt-0.5">
          +{score - previousScore!} from {previousScore}%
        </div>
      )}
    </div>
  )
}
