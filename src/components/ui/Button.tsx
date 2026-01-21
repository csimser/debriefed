import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { LoadingSpinner } from './LoadingSpinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'font-heading font-bold uppercase tracking-wider transition-all duration-150 inline-flex items-center justify-center gap-2',
          {
            'bg-gold text-bg-primary hover:bg-gold-bright disabled:opacity-50': variant === 'primary',
            'bg-bg-tertiary border border-border text-text hover:border-border-bright disabled:opacity-50': variant === 'secondary',
            'bg-transparent border border-border text-text hover:bg-bg-tertiary disabled:opacity-50': variant === 'ghost',
            'bg-status-red text-white hover:bg-red-600 disabled:opacity-50': variant === 'danger',
          },
          {
            'px-3 py-1.5 text-xs rounded': size === 'sm',
            'px-6 py-3 text-sm rounded-md': size === 'md',
            'px-8 py-4 text-base rounded-md': size === 'lg',
          },
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
