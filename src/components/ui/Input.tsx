import { InputHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id || generatedId

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-text placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold/25 transition-all',
            error && 'border-status-red',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-status-red">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
