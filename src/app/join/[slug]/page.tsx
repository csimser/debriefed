'use client'

import { useState, useEffect, useRef, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface OrgInfo {
  id: string
  name: string
  slug: string
  logo_url: string | null
  primary_color: string | null
}

export default function OrgJoinPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [org, setOrg] = useState<OrgInfo | null>(null)
  const [orgLoading, setOrgLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [formData, setFormData] = useState({ email: '', firstName: '', lastName: '' })
  const [otpCode, setOtpCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resending, setResending] = useState(false)
  const submittingRef = useRef(false)
  const router = useRouter()
  const supabase = createClient()

  // Fetch org info
  useEffect(() => {
    fetch(`/api/join/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.organization) {
          setOrg(data.organization)
        } else {
          setNotFound(true)
        }
        setOrgLoading(false)
      })
      .catch(() => { setNotFound(true); setOrgLoading(false) })
  }, [slug])

  // Cooldown timer
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
      setError('Failed to resend code.')
    } finally {
      setResending(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submittingRef.current) return
    submittingRef.current = true
    setLoading(true)
    setError('')

    if (!formData.email || !formData.firstName || !formData.lastName) {
      setError('Please fill in all fields')
      submittingRef.current = false
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          orgSlug: slug,
        }),
      })

      const data = await response.json()
      if (!data.success && !data.alreadyExists) {
        setError(data.error || 'Registration failed.')
        submittingRef.current = false
        setLoading(false)
        return
      }

      await supabase.auth.signInWithOtp({
        email: formData.email,
        options: { shouldCreateUser: false },
      })

      setOtpSent(true)
      setResendCooldown(60)
    } catch {
      setError('Registration failed.')
    }
    submittingRef.current = false
    setLoading(false)
  }

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
      setError('Verification failed.')
      setLoading(false)
      return
    }

    // Tag to org
    fetch(`/api/join/${slug}/tag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {})

    fetch('/api/auth/track-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }).catch(() => {})

    router.push('/onboarding')
    router.refresh()
  }

  const accentColor = org?.primary_color || '#C8A55A'

  if (orgLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-bg-secondary rounded-lg mx-auto mb-4" />
            <div className="h-6 bg-bg-secondary rounded w-48 mx-auto mb-6" />
            <div className="h-64 bg-bg-secondary rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-status-red/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-status-red text-3xl">!</span>
          </div>
          <h1 className="font-heading text-xl font-bold uppercase tracking-wider mb-2">Organization Not Found</h1>
          <p className="text-text-muted text-sm mb-6">
            The organization link you followed doesn&apos;t exist or has been removed.
          </p>
          <Link href="/signup" className="text-gold hover:text-gold-bright text-sm">
            Sign up for a personal account instead
          </Link>
        </div>
      </div>
    )
  }

  // OTP verification screen
  if (otpSent) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            {org?.logo_url ? (
              <img src={org.logo_url} alt="" className="w-16 h-16 rounded-lg object-cover mx-auto mb-4" />
            ) : (
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${accentColor}30` }}>
                <span className="font-heading font-bold text-3xl" style={{ color: accentColor }}>{org?.name[0]}</span>
              </div>
            )}
          </div>
          <div className="bg-bg-secondary border border-border rounded-lg p-8">
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-center mb-6">Verify Your Email</h2>
            <div className="rounded-md p-3 mb-6" style={{ backgroundColor: `${accentColor}15`, border: `1px solid ${accentColor}40` }}>
              <p className="text-sm" style={{ color: accentColor }}>
                We&apos;ve sent a 6-digit code to your email. Check your inbox and spam folder.
              </p>
            </div>
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">6-Digit Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text text-center tracking-[0.5em] font-mono focus:outline-none focus:border-gold"
                  required
                />
              </div>
              {error && (
                <div className="bg-status-red/10 border border-status-red/20 rounded-md p-3">
                  <p className="text-sm text-status-red">{error}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full py-2.5 rounded-md font-heading text-sm uppercase tracking-wider transition-colors disabled:opacity-50"
                style={{ backgroundColor: accentColor, color: '#1a1a2e' }}
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
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
                Back to signup
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          {org?.logo_url ? (
            <img src={org.logo_url} alt="" className="w-16 h-16 rounded-lg object-cover mx-auto mb-4" />
          ) : (
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${accentColor}30` }}
            >
              <span className="font-heading font-bold text-3xl" style={{ color: accentColor }}>
                {org?.name[0]}
              </span>
            </div>
          )}
          <h1 className="font-heading text-2xl font-bold tracking-wide uppercase">
            Join {org?.name}
          </h1>
          <p className="font-mono text-xs text-text-muted mt-1">POWERED BY DEBRIEFED</p>
        </div>

        <div className="bg-bg-secondary border border-border rounded-lg p-8">
          <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-center mb-4">Create Account</h2>

          <div className="rounded-md p-3 mb-6" style={{ backgroundColor: `${accentColor}15`, border: `1px solid ${accentColor}40` }}>
            <p className="text-sm" style={{ color: accentColor }}>
              You&apos;re joining as part of <strong>{org?.name}</strong>. Your account will be linked to this organization.
            </p>
          </div>

          <div className="bg-status-yellow/10 border border-status-yellow/20 rounded-md p-3 mb-6">
            <p className="text-sm text-status-yellow">
              <span className="font-medium">Note:</span> Enter your name and email exactly as you want them on your resume. These are locked after registration.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text focus:outline-none focus:border-gold"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text focus:outline-none focus:border-gold"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text focus:outline-none focus:border-gold"
                placeholder="your@email.com"
                required
              />
            </div>

            <p className="text-xs text-text-muted">
              No password needed — we&apos;ll send a 6-digit code to verify your email.
            </p>

            {error && (
              <div className="bg-status-red/10 border border-status-red/20 rounded-md p-3">
                <p className="text-sm text-status-red">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-md font-heading text-sm uppercase tracking-wider transition-colors disabled:opacity-50"
              style={{ backgroundColor: accentColor, color: '#1a1a2e' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-muted">
              Already have an account?{' '}
              <Link href="/login" className="text-gold hover:text-gold-bright">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
