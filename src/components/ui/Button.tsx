import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { LoadingSpinner } from './LoadingSpinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidthMobile?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, fullWidthMobile = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'font-heading font-bold uppercase tracking-wider transition-all duration-150 inline-flex items-center justify-center gap-2',
          // Minimum touch target size for accessibility (44px)
          'min-h-[44px]',
          {
            'bg-gold text-bg-primary hover:bg-gold-bright active:bg-gold-bright disabled:opacity-50': variant === 'primary',
            'bg-bg-tertiary border border-border text-text hover:border-border-bright active:bg-bg-secondary disabled:opacity-50': variant === 'secondary',
            'bg-transparent border border-border text-text hover:bg-bg-tertiary active:bg-bg-secondary disabled:opacity-50': variant === 'ghost',
            'bg-status-red text-white hover:bg-red-600 active:bg-red-700 disabled:opacity-50': variant === 'danger',
          },
          {
            // Small: still meets 44px min-height on mobile
            'px-4 py-2.5 text-xs rounded md:px-3 md:py-1.5 md:min-h-0': size === 'sm',
            // Medium: comfortable touch target
            'px-6 py-3 text-sm rounded-md': size === 'md',
            // Large: bigger on all screens
            'px-8 py-4 text-base rounded-md': size === 'lg',
          },
          // Full width on mobile option
          fullWidthMobile && 'w-full md:w-auto',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <LoadingSpinner size="sm" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
