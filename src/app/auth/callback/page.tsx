'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { Suspense } from 'react'

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  const handleCallback = useCallback(async () => {
    const supabase = createClient()
    const type = searchParams.get('type')
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    const next = searchParams.get('next') || '/dashboard'

    // Handle OAuth errors
    if (error) {
      console.error('Auth error:', error, errorDescription)
      setStatus('error')
      setErrorMessage(errorDescription || 'Authentication failed')
      return
    }

    // Check for hash fragment (Supabase passes tokens this way for some flows)
    const hash = window.location.hash
    let hashParams: URLSearchParams | null = null
    if (hash && hash.length > 1) {
      hashParams = new URLSearchParams(hash.substring(1))
      const hashError = hashParams.get('error')
      if (hashError) {
        console.error('Auth hash error:', hashError, hashParams.get('error_description'))
        setStatus('error')
        setErrorMessage(hashParams.get('error_description') || 'Authentication failed')
        return
      }
    }

    // If there's a code, exchange it for a session (PKCE flow)
    if (code) {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      if (exchangeError) {
        console.error('Code exchange failed:', exchangeError)
        setStatus('error')
        setErrorMessage('Authentication failed. Please try again.')
        return
      }

      // For email verification (signup), the code exchange verifies the email
      // Sign out and redirect to login
      if (type === 'signup' || type === 'email') {
        await supabase.auth.signOut()
        router.replace('/login?confirmed=true')
        return
      }
    }

    // If there's hash fragment with access_token, let Supabase handle it
    // The browser client should auto-detect and process it
    if (hashParams?.get('access_token')) {
      // Give Supabase client time to process the hash
      await new Promise(resolve => setTimeout(resolve, 500))

      // For email verification via hash, sign out and redirect to login
      if (type === 'signup' || type === 'email') {
        await supabase.auth.signOut()
        router.replace('/login?confirmed=true')
        return
      }
    }

    // Helper function to check session with retries
    const checkSession = async (retries = 3): Promise<boolean> => {
      for (let i = 0; i < retries; i++) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) return true
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
      return false
    }

    // Check if we have a session now
    const hasSession = await checkSession()

    // For non-recovery flows, we need a session
    if (!hasSession) {
      console.error('No session found')
      setStatus('error')
      setErrorMessage('Authentication failed. Please try again.')
      return
    }

    // Call the API to handle profile setup and get redirect destination
    try {
      const response = await fetch('/api/auth/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })

      const data = await response.json()

      if (data.success && data.redirect) {
        router.replace(data.redirect)
      } else if (data.redirect) {
        router.replace(data.redirect)
      } else {
        router.replace(next)
      }
    } catch (err) {
      console.error('Profile setup error:', err)
      // If API fails, still try to redirect (profile might be created later)
      router.replace(next)
    }
  }, [router, searchParams])

  useEffect(() => {
    handleCallback()
  }, [handleCallback])

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="text-4xl mb-4">⚠</div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wider mb-4">
            Authentication Error
          </h1>
          <p className="text-text-muted mb-6">{errorMessage}</p>
          <div className="space-y-3">
            <a href="/login" className="block">
              <button className="w-full bg-gold text-bg-primary font-semibold py-3 px-4 rounded-md hover:bg-gold-bright transition-colors">
                Back to Sign In
              </button>
            </a>
          </div>
        </Card>
      </div>
    )
  }

  // Loading state
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
        <h1 className="font-heading text-xl font-bold uppercase tracking-wider mb-2">
          Authenticating
        </h1>
        <p className="text-text-muted">Please wait...</p>
      </Card>
    </div>
  )
}

function CallbackLoading() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
        <h1 className="font-heading text-xl font-bold uppercase tracking-wider mb-2">
          Loading
        </h1>
        <p className="text-text-muted">Please wait...</p>
      </Card>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackLoading />}>
      <CallbackHandler />
    </Suspense>
  )
}
