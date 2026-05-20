'use client'

interface Application {
  id: string
  status: string
}

interface StatsBarProps {
  applications: Application[]
}

export function StatsBar({ applications }: StatsBarProps) {
  const total = applications.length
  const callbacks = applications.filter(a => a.status === 'callback').length
  const interviews = applications.filter(a => a.status === 'interview').length
  const offers = applications.filter(a => ['offer', 'accepted'].includes(a.status)).length

  const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0

  const stats = [
    { label: 'Total Applied', value: total.toString(), highlight: false },
    { label: 'Callbacks', value: `${pct(callbacks)}%`, highlight: false },
    { label: 'Interviews', value: `${pct(interviews)}%`, highlight: false },
    { label: 'Offers', value: `${pct(offers)}%`, highlight: offers > 0 },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`p-3 rounded-lg border text-center ${
            stat.highlight
              ? 'border-gold/30 bg-gold-dim'
              : 'border-border bg-bg-card'
          }`}
        >
          <div className={`font-heading text-2xl font-bold ${stat.highlight ? 'text-gold' : ''}`}>
            {stat.value}
          </div>
          <div className="text-xs text-text-muted uppercase tracking-wider font-nav mt-0.5">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}
