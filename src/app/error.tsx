'use client'

import { Button } from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-5xl text-status-red mb-4">⚠</div>
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wider mb-2">
          Something Went Wrong
        </h1>
        <p className="text-text-muted mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  )
}
