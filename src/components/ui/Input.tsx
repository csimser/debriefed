import { InputHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id || generatedId

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-heading text-xs md:text-xs font-semibold uppercase tracking-wider text-text-muted"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          autoComplete="off"
          className={cn(
            // Base styles with mobile-first sizing
            'w-full bg-bg-secondary border border-border rounded-lg text-text placeholder:text-text-dim transition-all',
            // Mobile: larger touch target, 16px font to prevent iOS zoom
            'px-4 py-3.5 text-base',
            // Desktop: slightly smaller
            'md:py-3 md:text-sm md:rounded-md',
            // Focus state
            'focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none',
            // Touch-friendly min height
            'min-h-[48px] md:min-h-[44px]',
            error && 'border-status-red focus:border-status-red focus:ring-status-red/25',
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-text-dim">{hint}</p>
        )}
        {error && <p className="text-xs text-status-red">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
