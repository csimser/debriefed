'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Debriefed no longer has accounts — old /signup links (blog posts, external
// sites) redirect to onboarding. Client-side redirect for static export.
export default function SignupRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/onboarding/')
  }, [router])

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <p className="text-sm text-text-muted">
        Redirecting&hellip;{' '}
        <Link href="/onboarding/" className="text-gold hover:text-gold-bright hover:underline">
          Continue to Debriefed
        </Link>
      </p>
    </div>
  )
}
