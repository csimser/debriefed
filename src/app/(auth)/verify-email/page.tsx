'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const emailFromParams = searchParams.get('email') || ''

  const [email, setEmail] = useState(emailFromParams)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [error, setError] = useState('')
  const [cooldown, setCooldown] = useState(0)

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (resent) {
      setResent(false)
    }
  }, [cooldown, resent])

  const handleResend = async () => {
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setResending(true)
    setError('')

    try {
      // Route through the rate-limited API endpoint instead of calling Supabase directly
      const response = await fetch('/api/auth/resend-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to resend email')
      } else {
        setResent(true)
        setCooldown(60) // 60 second cooldown
      }
    } catch {
      setError('Failed to resend email. Please try again.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <Link href="/" className="block text-center mb-8 hover:opacity-80 transition-opacity">
        <div className="w-16 h-16 bg-gold rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="font-heading font-bold text-bg-primary text-3xl">D</span>
        </div>
      </Link>

      <Card className="p-8 text-center">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wider mb-4">
          Check Your Email
        </h1>

        {/* Message */}
        <p className="text-text-muted mb-2">
          We sent a verification link to:
        </p>

        {emailFromParams ? (
          <p className="text-text font-semibold mb-6">{emailFromParams}</p>
        ) : (
          <div className="mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-text text-center"
            />
          </div>
        )}

        <p className="text-text-muted text-sm mb-2">
          Click the link in the email to verify your account and get started.
        </p>
        <p className="text-text-dim text-xs mb-8">
          Don&apos;t see it? Check your spam or junk folder. Emails come from{' '}
          <span className="text-text-muted font-mono">noreply@getdebriefed.co</span>
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-status-red-dim border border-status-red/20 rounded-md p-3 mb-4">
            <p className="text-sm text-status-red">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {resent && (
          <div className="bg-status-green/10 border border-status-green/20 rounded-md p-3 mb-4">
            <p className="text-sm text-status-green">Verification email sent!</p>
            <p className="text-xs text-status-green/70 mt-1">
              Check your spam or junk folder if you don&apos;t see it within a minute.
            </p>
          </div>
        )}

        {/* Resend Button */}
        <button
          onClick={handleResend}
          disabled={resending || cooldown > 0}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-bg-secondary border border-border rounded-lg text-text hover:border-gold/50 disabled:opacity-50 transition-colors w-full mb-4"
        >
          {resending ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Sending...
            </>
          ) : cooldown > 0 ? (
            <>
              <svg className="w-4 h-4 text-status-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Resend in {cooldown}s
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Resend Verification Email
            </>
          )}
        </button>

        {/* Back to Login */}
        <div className="pt-4 border-t border-border">
          <Link href="/login">
            <Button variant="secondary" className="w-full">
              ← Back to Sign In
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="w-full max-w-md">
      <div className="block text-center mb-8">
        <div className="w-16 h-16 bg-gold rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="font-heading font-bold text-bg-primary text-3xl">D</span>
        </div>
      </div>
      <Card className="p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center animate-pulse" />
        <div className="h-8 bg-bg-secondary rounded mb-4 animate-pulse" />
        <div className="h-4 bg-bg-secondary rounded mb-2 animate-pulse" />
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <Suspense fallback={<LoadingFallback />}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  )
}
