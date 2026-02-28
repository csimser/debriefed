import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'line' | 'circle' | 'card'
  lines?: number
}

const LINE_WIDTHS = ['w-full', 'w-4/5', 'w-3/5']

export function Skeleton({ className, variant = 'line', lines }: SkeletonProps) {
  if (lines && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={cn(
              'animate-pulse rounded bg-bg-secondary h-4',
              LINE_WIDTHS[i % LINE_WIDTHS.length],
              className
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'animate-pulse rounded bg-bg-secondary',
        variant === 'line' && 'h-4 w-full',
        variant === 'circle' && 'rounded-full',
        variant === 'card' && 'h-32 w-full rounded-lg',
        className
      )}
    />
  )
}
