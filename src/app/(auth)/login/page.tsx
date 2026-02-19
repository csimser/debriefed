'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { GovComputerBanner } from '@/components/layout/GovComputerBanner'

function LoginForm() {
  const searchParams = useSearchParams()
  const confirmed = searchParams.get('confirmed') === 'true'

  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const trackLogin = () => {
    fetch('/api/auth/track-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }).catch(() => {})
  }

  // OTP: send code
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email address')
      return
    }
    setLoading(true)
    setError('')

    // Send OTP — always show the same generic message regardless of outcome
    // to prevent email enumeration attacks
    await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    })

    // Always transition to the verify screen with a generic message,
    // whether the email exists or not
    setOtpSent(true)
    setLoading(false)
  }

  // OTP: verify code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter the 6-digit code')
      return
    }
    setLoading(true)
    setError('')

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: 'email',
    })

    if (verifyError) {
      setError(verifyError.message)
      setLoading(false)
      return
    }

    if (!data.user) {
      setError('Verification failed. Please try again.')
      setLoading(false)
      return
    }

    trackLogin()
    router.push('/dashboard')
    router.refresh()
  }

  const resetOtp = () => {
    setOtpSent(false)
    setOtpCode('')
    setError('')
  }

  return (
    <Card className="p-8">
      <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-center mb-6">Sign In</h2>

      {/* Email confirmed success message */}
      {confirmed && (
        <div className="bg-status-green/10 border border-status-green/20 rounded-md p-3 mb-4">
          <p className="text-sm text-status-green flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Email confirmed! Please sign in below.
          </p>
        </div>
      )}

      {/* OTP Send Form */}
      {!otpSent && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <Input
            id="otp-email"
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />

          <p className="text-xs text-text-muted">
            We&apos;ll send a 6-digit code to your email. No password needed.
          </p>

          {error && (
            <div className="bg-status-red-dim border border-status-red/20 rounded-md p-3">
              <p className="text-sm text-status-red">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending Code...' : 'Send Sign-In Code'}
          </Button>
        </form>
      )}

      {/* OTP Verify Form */}
      {otpSent && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="bg-gold-dim border border-gold/30 rounded-md p-3 mb-2">
            <p className="text-sm text-gold">
              If an account exists for that email address, we&apos;ve sent a 6-digit code. Check your inbox and spam folder.
            </p>
          </div>

          <Input
            id="otp-code"
            label="6-Digit Code"
            type="text"
            name="otp-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            required
          />

          {error && (
            <div className="bg-status-red-dim border border-status-red/20 rounded-md p-3">
              <p className="text-sm text-status-red">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading || otpCode.length !== 6}>
            {loading ? 'Verifying...' : 'Verify & Sign In'}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={resetOtp}
              className="text-text-muted hover:text-gold transition-colors"
            >
              ← Change email
            </button>
            <button
              type="button"
              onClick={() => { setOtpSent(false); setOtpCode(''); setError(''); handleSendOtp(new Event('submit') as any) }}
              className="text-gold hover:text-gold-bright transition-colors"
            >
              Resend code
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-sm text-text-muted text-center">
          Don't have an account?{' '}
          <Link href="/signup" className="text-gold hover:text-gold-bright">Create Account</Link>
        </p>
      </div>
    </Card>
  )
}

function LoginFormLoading() {
  return (
    <Card className="p-8">
      <div className="animate-pulse">
        <div className="h-6 bg-bg-tertiary rounded w-24 mx-auto mb-6"></div>
        <div className="space-y-4">
          <div className="h-12 bg-bg-tertiary rounded"></div>
          <div className="h-4 bg-bg-tertiary rounded w-32"></div>
          <div className="h-12 bg-bg-tertiary rounded"></div>
        </div>
      </div>
    </Card>
  )
}

function LoginBranding() {
  return (
    <Link href="/" className="block text-center mb-8 hover:opacity-80 transition-opacity">
      <div className="w-16 h-16 bg-gold rounded-lg flex items-center justify-center mx-auto mb-4">
        <span className="font-heading font-bold text-bg-primary text-3xl">D</span>
      </div>
      <h1 className="font-heading text-2xl font-bold tracking-wide uppercase">Debriefed</h1>
      <p className="font-mono text-xs text-text-muted mt-1">MISSION: TRANSITION</p>
    </Link>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginBranding />

        <GovComputerBanner />

        <Suspense fallback={<LoginFormLoading />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
