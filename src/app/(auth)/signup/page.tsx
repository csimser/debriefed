'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

function SignupForm() {
  const searchParams = useSearchParams()
  const planIntent = searchParams.get('plan')

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
  })
  const [otpCode, setOtpCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resending, setResending] = useState(false)
  const submittingRef = useRef(false)
  const router = useRouter()
  const supabase = createClient()

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendCooldown])

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resending) return
    setResending(true)
    setError('')
    try {
      await supabase.auth.signInWithOtp({
        email: formData.email,
        options: { shouldCreateUser: false },
      })
      setResendCooldown(60)
    } catch {
      setError('Failed to resend code. Please try again.')
    } finally {
      setResending(false)
    }
  }

  const validateCommonFields = (): boolean => {
    if (!formData.email || !formData.firstName || !formData.lastName) {
      setError('Please fill in all required fields')
      return false
    }
    return true
  }

  // OTP signup: step 1 — create account + send code
  const handleOtpSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submittingRef.current) return
    submittingRef.current = true
    setLoading(true)
    setError('')

    if (!validateCommonFields()) {
      submittingRef.current = false
      setLoading(false)
      return
    }

    try {
      // Create the user account (no password) via our API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      })

      const data = await response.json()

      // If account creation failed for a reason OTHER than "already exists",
      // show a generic error. If it already exists, we still proceed to OTP
      // screen to prevent email enumeration.
      if (!data.success && !data.alreadyExists) {
        setError(data.error || 'Registration failed. Please try again.')
        submittingRef.current = false
        setLoading(false)
        return
      }

      // Send the OTP code — always show the same generic message regardless
      // of outcome to prevent email enumeration attacks
      await supabase.auth.signInWithOtp({
        email: formData.email,
        options: { shouldCreateUser: false },
      })

      // Always transition to the verify screen with a generic message
      setOtpSent(true)
      setResendCooldown(60)
      submittingRef.current = false
      setLoading(false)
    } catch {
      setError('Registration failed. Please try again.')
      submittingRef.current = false
      setLoading(false)
    }
  }

  // OTP signup: step 2 — verify code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter the 6-digit code')
      return
    }
    setLoading(true)
    setError('')

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email: formData.email,
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

    // Track login
    fetch('/api/auth/track-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }).catch(() => {})

    // Redirect to onboarding, preserving plan intent
    const onboardingUrl = planIntent ? `/onboarding?plan=${planIntent}` : '/onboarding'
    router.push(onboardingUrl)
    router.refresh()
  }

  // OTP verification screen
  if (otpSent) {
    return (
      <Card className="p-8">
        <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-center mb-6">Verify Your Email</h2>

        <div className="bg-gold-dim border border-gold/30 rounded-md p-3 mb-6">
          <p className="text-sm text-gold">
            If an account exists for that email address, we&apos;ve sent a 6-digit code. Check your inbox and spam folder.
          </p>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <Input
            id="signup-otp-code"
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
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </Button>

          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resending || resendCooldown > 0}
            className="w-full text-sm text-text-muted hover:text-gold disabled:opacity-50 transition-colors"
          >
            {resending ? 'Resending...' : resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
          </button>

          <button
            type="button"
            onClick={() => { setOtpSent(false); setOtpCode(''); setError(''); setResendCooldown(0); submittingRef.current = false }}
            className="w-full text-sm text-text-muted hover:text-gold transition-colors"
          >
            ← Back to signup
          </button>
        </form>
      </Card>
    )
  }

  return (
    <Card className="p-8">
      <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-center mb-4">Create Account</h2>

      {/* Welcome notice */}
      <div className="bg-gold-dim border border-gold/30 rounded-md p-3 mb-6">
        <p className="text-sm text-gold">
          <span className="font-medium">Start free.</span> Create your first resume at no cost. Upgrade anytime for more.
        </p>
      </div>

      {/* Locked fields warning */}
      <div className="bg-status-yellow/10 border border-status-yellow/20 rounded-md p-3 mb-6">
        <p className="text-sm text-status-yellow">
          <span className="font-medium">Note:</span> Please enter your first name, last name, and email exactly as you want them to appear on your resume. These fields are locked after registration.
        </p>
      </div>

      <form onSubmit={handleOtpSignup} className="space-y-4" autoComplete="on">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="signup-firstname"
            label="First Name"
            type="text"
            name="given-name"
            autoComplete="given-name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="John"
            required
          />
          <Input
            id="signup-lastname"
            label="Last Name"
            type="text"
            name="family-name"
            autoComplete="family-name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Doe"
            required
          />
        </div>
        <Input
          id="signup-email"
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="your@email.com"
          required
        />

        <p className="text-xs text-text-muted">
          No password needed — we&apos;ll send a 6-digit code to verify your email.
        </p>

        {error && (
          <div className="bg-status-red-dim border border-status-red/20 rounded-md p-3">
            <p className="text-sm text-status-red">{error}</p>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-text-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-gold hover:text-gold-bright">Sign In</Link>
        </p>
      </div>
    </Card>
  )
}

function SignupFormLoading() {
  return (
    <Card className="p-8">
      <div className="animate-pulse">
        <div className="h-6 bg-bg-tertiary rounded w-40 mx-auto mb-6"></div>
        <div className="h-16 bg-bg-tertiary rounded mb-6"></div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-bg-tertiary rounded"></div>
            <div className="h-12 bg-bg-tertiary rounded"></div>
          </div>
          <div className="h-12 bg-bg-tertiary rounded"></div>
          <div className="h-12 bg-bg-tertiary rounded"></div>
        </div>
      </div>
    </Card>
  )
}

function SignupBranding() {
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

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignupBranding />

        <Suspense fallback={<SignupFormLoading />}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  )
}
