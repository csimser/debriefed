'use client'

import { useState, useEffect, useRef, Suspense, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { GovComputerBanner } from '@/components/layout/GovComputerBanner'
import { trackEvent } from '@/lib/analytics'

// ── Email typo detection ────────────────────────────────────────────
const COMMON_TYPOS: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yhaoo.com': 'yahoo.com',
  'hotmal.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmil.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outllok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
}

// ── Step indicator ──────────────────────────────────────────────────
function StepIndicator({ step }: { step: 'form' | 'otp' }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <div className={`flex items-center gap-2 text-xs font-heading uppercase tracking-wider ${step === 'form' ? 'text-gold' : 'text-white/30'}`}>
        <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${step === 'form' ? 'border-gold text-gold' : 'border-white/20 text-white/20'}`}>1</span>
        Your Info
      </div>
      <div className="w-8 h-px bg-white/10" />
      <div className={`flex items-center gap-2 text-xs font-heading uppercase tracking-wider ${step === 'otp' ? 'text-gold' : 'text-white/30'}`}>
        <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${step === 'otp' ? 'border-gold text-gold' : 'border-white/20 text-white/20'}`}>2</span>
        Verify Email
      </div>
    </div>
  )
}

// ── Signup form ─────────────────────────────────────────────────────
function SignupForm() {
  const searchParams = useSearchParams()
  const planIntent = searchParams.get('plan')
  const hasPlanIntent = planIntent === 'core' || planIntent === 'full'

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
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null)
  const submittingRef = useRef(false)
  const verifyingRef = useRef(false)
  const router = useRouter()
  const supabase = createClient()

  // Track signup page view on mount
  useEffect(() => {
    trackEvent('signup_started', {
      plan_intent: planIntent || 'none',
      source: searchParams.get('source') || 'direct',
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendCooldown])

  // Email typo detection
  const handleEmailChange = (value: string) => {
    setFormData({ ...formData, email: value })
    const domain = value.split('@')[1]?.toLowerCase()
    setEmailSuggestion(domain ? COMMON_TYPOS[domain] ?? null : null)
  }

  const correctEmail = (suggestion: string) => {
    const localPart = formData.email.split('@')[0]
    setFormData({ ...formData, email: `${localPart}@${suggestion}` })
    setEmailSuggestion(null)
  }

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

      // Send the OTP code
      await supabase.auth.signInWithOtp({
        email: formData.email,
        options: { shouldCreateUser: false },
      })

      // Transition to the verify screen
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
  const handleVerifyOtp = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (verifyingRef.current) return
    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter the 6-digit code')
      return
    }
    verifyingRef.current = true
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
      verifyingRef.current = false
      return
    }

    if (!data.user) {
      setError('Verification failed. Please try again.')
      setLoading(false)
      verifyingRef.current = false
      return
    }

    // Track login
    fetch('/api/auth/track-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }).catch(() => {})

    trackEvent('signup_completed', {
      method: 'otp',
      plan_intent: planIntent || 'none',
      source: searchParams.get('source') || 'direct',
    })

    // Redirect to onboarding, preserving plan intent
    const onboardingUrl = planIntent ? `/onboarding?plan=${planIntent}` : '/onboarding'
    router.push(onboardingUrl)
    router.refresh()
  }, [otpCode, formData.email, planIntent, router, supabase.auth])

  // OTP auto-submit when 6 digits entered
  useEffect(() => {
    if (otpCode.length === 6 && otpSent) {
      const timer = setTimeout(() => handleVerifyOtp(), 300)
      return () => clearTimeout(timer)
    }
  }, [otpCode, otpSent, handleVerifyOtp])

  // OTP verification screen
  if (otpSent) {
    return (
      <Card className="p-8">
        <StepIndicator step="otp" />
        <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-center mb-6">Verify Your Email</h2>

        <div className="bg-gold-dim border border-gold/30 rounded-md p-3 mb-6">
          <p className="text-sm text-gold">
            We&apos;ve sent a 6-digit code to <strong>{formData.email}</strong>. Check your inbox and spam folder.
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
            onClick={() => { setOtpSent(false); setOtpCode(''); setError(''); setResendCooldown(0); submittingRef.current = false; verifyingRef.current = false }}
            className="w-full text-sm text-text-muted hover:text-gold transition-colors"
          >
            &larr; Back to signup
          </button>
        </form>
      </Card>
    )
  }

  return (
    <Card className="p-8">
      <StepIndicator step="form" />
      <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-center mb-4">Create Account</h2>

      {/* Plan context badge — shows when arriving from pricing */}
      {hasPlanIntent ? (
        <div className="mb-6 p-3 rounded border border-gold/30 bg-gold/5 text-center">
          <span className="text-gold text-sm font-heading uppercase tracking-wider">
            {planIntent === 'core' ? 'Core Plan — $25 / 30 days' : 'Full Plan — $50 / 90 days'}
          </span>
          <p className="text-white/50 text-xs mt-1">You&apos;ll complete payment after account creation</p>
        </div>
      ) : (
        <div className="bg-gold-dim border border-gold/30 rounded-md p-3 mb-6">
          <p className="text-sm text-gold">
            <span className="font-medium">Start free.</span> Create your first resume at no cost. Upgrade anytime for more.
          </p>
        </div>
      )}

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
            required
          />
        </div>
        <p className="text-xs text-white/40 -mt-2">This name will appear on your resumes</p>
        <div>
          <Input
            id="signup-email"
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={(e) => handleEmailChange(e.target.value)}
            placeholder="your@email.com"
            required
          />
          {emailSuggestion && (
            <p className="text-xs text-gold/80 mt-1">
              Did you mean{' '}
              <button type="button" onClick={() => correctEmail(emailSuggestion)} className="underline hover:text-gold">
                {formData.email.split('@')[0]}@{emailSuggestion}
              </button>?
            </p>
          )}
        </div>

        <p className="text-xs text-text-muted">
          No password needed — we&apos;ll send a 6-digit code to verify your email.
        </p>

        {error && (
          <div className="bg-status-red-dim border border-status-red/20 rounded-md p-3">
            <p className="text-sm text-status-red">{error}</p>
          </div>
        )}

        <div className="p-3 rounded border border-white/5 bg-white/[0.02]">
          <p className="text-white/60 text-xs font-body italic">
            &ldquo;Translated my 11B experience into a PM resume in 20 minutes.&rdquo;
          </p>
          <p className="text-white/30 text-xs mt-1 font-heading uppercase tracking-wider">
            &mdash; SSG, U.S. Army
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating Account...' : hasPlanIntent ? 'Get Started — Complete Payment Next' : 'Create Free Account — No Card Needed'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-text-muted">
          Already have an account?{' '}
          <Link href={planIntent ? `/login?plan=${planIntent}` : '/login'} className="text-gold hover:text-gold-bright">Sign In</Link>
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

        <GovComputerBanner />

        <Suspense fallback={<SignupFormLoading />}>
          <SignupForm />
        </Suspense>

        <p className="text-center text-white/30 text-xs mt-6">
          Join 500+ veterans who&apos;ve built their civilian resume with Debriefed
        </p>
      </div>
    </div>
  )
}
