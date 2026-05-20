import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'gold' | 'green' | 'blue' | 'amber' | 'red'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-bg-tertiary text-text-muted',
    gold: 'bg-gold-dim text-gold',
    green: 'bg-status-green-dim text-status-green',
    blue: 'bg-status-blue-dim text-status-blue',
    amber: 'bg-status-yellow-dim text-status-yellow',
    red: 'bg-status-red-dim text-status-red',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center text-xs font-medium px-2 py-0.5 rounded',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
