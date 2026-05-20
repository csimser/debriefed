import { LoadingSpinner } from './LoadingSpinner'

interface FullPageLoaderProps {
  message?: string
}

export function FullPageLoader({ message = 'Loading...' }: FullPageLoaderProps) {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="font-heading text-sm uppercase tracking-wider text-text-muted">
          {message}
        </p>
      </div>
    </div>
  )
}
