'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// TEMP: Redirect to waitlist - signups disabled during development
// To restore signups, check git history for the original SignupForm component
export default function SignupPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/waitlist')
  }, [router])

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-text-muted">Redirecting to waitlist...</p>
      </div>
    </div>
  )
}
