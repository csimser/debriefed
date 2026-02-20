'use client'

import { useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { BRANCHES, getRankFromPaygrade, getValidPaygradesForBranch } from '@/lib/constants/military'

function SignupForm() {
  const searchParams = useSearchParams()
  void searchParams // preserve Suspense boundary

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    branch: '',
    paygrade: '',
  })
  const [optIns, setOptIns] = useState({
    employerSharing: false,
    marketing: false,
  })
  const [otpCode, setOtpCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const submittingRef = useRef(false)
  const router = useRouter()
  const supabase = createClient()

  const validPaygrades = getValidPaygradesForBranch(formData.branch)

  const handleBranchChange = (branch: string) => {
    setFormData(prev => ({
      ...prev,
      branch,
      paygrade: branch && prev.paygrade && !getValidPaygradesForBranch(branch).map(pg => pg.value).includes(prev.paygrade)
        ? ''
        : prev.paygrade
    }))
  }

  const validateCommonFields = (): boolean => {
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.branch || !formData.paygrade) {
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
          branch: formData.branch,
          paygrade: formData.paygrade,
          employerSharingOptIn: optIns.employerSharing,
          marketingOptIn: optIns.marketing,
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

    // Redirect to onboarding
    router.push('/onboarding')
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
            onClick={() => { setOtpSent(false); setOtpCode(''); setError(''); submittingRef.current = false }}
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

        <div className="space-y-2">
          <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">Branch</label>
          <select
            name="branch"
            value={formData.branch}
            onChange={(e) => handleBranchChange(e.target.value)}
            className="w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-text"
            required
            autoComplete="off"
          >
            <option value="">Select Branch</option>
            {BRANCHES.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">Paygrade</label>
          <select
            name="paygrade"
            value={formData.paygrade}
            onChange={(e) => setFormData({ ...formData, paygrade: e.target.value })}
            className="w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-text"
            required
            autoComplete="off"
          >
            <option value="">Select Paygrade</option>
            {validPaygrades.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          <p className="text-xs text-text-muted italic">
            If not currently serving, please select the highest rank/paygrade attained.
          </p>
        </div>

        {formData.branch && formData.paygrade && (
          <div className="bg-bg-tertiary rounded-md p-3">
            <p className="text-sm text-text-muted">
              Rank: <span className="text-text font-medium">{getRankFromPaygrade(formData.branch, formData.paygrade)}</span>
            </p>
          </div>
        )}

        {/* Opt-in Checkboxes */}
        <div className="space-y-4 pt-2 border-t border-border">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="employer-sharing"
              checked={optIns.employerSharing}
              onChange={(e) => setOptIns(prev => ({ ...prev, employerSharing: e.target.checked }))}
              className="mt-0.5 rounded border-border"
            />
            <div>
              <span className="text-sm text-text group-hover:text-gold transition-colors font-medium">
                It&apos;s OK to share my profile with SkillBridge organizations and employers
              </span>
              <p className="text-xs text-text-muted mt-0.5">
                Your name, email address, skills, certifications, clearance level, and target role may be shared with vetted employers and SkillBridge host companies actively hiring veterans. You can opt out anytime in Settings.
              </p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="marketing"
              checked={optIns.marketing}
              onChange={(e) => setOptIns(prev => ({ ...prev, marketing: e.target.checked }))}
              className="mt-0.5 rounded border-border"
            />
            <div>
              <span className="text-sm text-text group-hover:text-gold transition-colors font-medium">
                It&apos;s OK to send me updates about Debriefed and career resources
              </span>
              <p className="text-xs text-text-muted mt-0.5">
                We&apos;ll occasionally email you about new features, career tips, and transition resources. No spam, ever. Unsubscribe anytime.
              </p>
            </div>
          </label>
        </div>

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
