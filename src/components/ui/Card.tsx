import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glow'
  mobilePadding?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', mobilePadding = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-bg-card rounded-lg border',
          {
            'border-border': variant === 'default',
            'border-gold/20 shadow-[0_0_20px_rgba(212,168,75,0.1)]': variant === 'glow',
          },
          // Mobile-friendly padding when enabled
          mobilePadding && 'p-4 md:p-6',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'
