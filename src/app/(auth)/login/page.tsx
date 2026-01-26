'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

// Admin emails that bypass beta code requirement
const ADMIN_BYPASS_EMAILS = [
  'chris.simser@gmail.com',
  'carlajo22@gmail.com',
  'admin@debriefed.io',
]

function LoginForm() {
  const searchParams = useSearchParams()
  const confirmed = searchParams.get('confirmed') === 'true'
  const passwordUpdated = searchParams.get('message') === 'password_updated'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [betaCode, setBetaCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResendConfirmation, setShowResendConfirmation] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setShowResendConfirmation(false)
    setResendMessage('')

    const normalizedEmail = email.toLowerCase().trim()

    // First, authenticate the user
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      setError(authError.message)
      if (authError.message.toLowerCase().includes('email not confirmed') ||
          authError.message.toLowerCase().includes('email confirmation')) {
        setShowResendConfirmation(true)
      }
      setLoading(false)
      return
    }

    if (!authData.user) {
      setError('Login failed. Please try again.')
      setLoading(false)
      return
    }

    // Check if user is an admin (bypass beta code requirement)
    const isAdminEmail = ADMIN_BYPASS_EMAILS.includes(normalizedEmail)

    // Also check is_admin flag in profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', authData.user.id)
      .single()

    const isAdmin = isAdminEmail || profile?.is_admin === true

    if (isAdmin) {
      // Admin - direct access
      router.push('/dashboard')
      router.refresh()
      return
    }

    // Check if user already has valid beta access (previously redeemed code)
    const betaCheckResponse = await fetch('/api/beta/check')
    const betaCheckData = await betaCheckResponse.json()

    if (betaCheckData.hasValidAccess) {
      // User already has valid beta access - let them in
      router.push('/dashboard')
      router.refresh()
      return
    }

    // Non-admin without existing access - require beta code
    if (!betaCode.trim()) {
      // Sign out the user since they can't proceed without a code
      await supabase.auth.signOut()
      setError('A valid beta code is required to log in during the beta period.')
      setLoading(false)
      return
    }

    // Validate and redeem beta code
    const redeemResponse = await fetch('/api/beta/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: betaCode.trim() }),
    })

    const redeemData = await redeemResponse.json()

    if (!redeemData.success) {
      // Sign out since beta code failed
      await supabase.auth.signOut()
      setError(redeemData.error || 'Invalid beta code. Please check your code and try again.')
      setLoading(false)
      return
    }

    // Success - beta code redeemed, proceed to dashboard
    router.push('/dashboard')
    router.refresh()
  }

  const handleResendConfirmation = async () => {
    if (!email) {
      setResendMessage('Please enter your email address above first.')
      return
    }

    setResendLoading(true)
    setResendMessage('')

    try {
      const response = await fetch('/api/auth/resend-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setResendMessage('Confirmation email sent! Please check your inbox.')
        setShowResendConfirmation(false)
      } else {
        setResendMessage(data.error || 'Failed to resend confirmation email.')
      }
    } catch {
      setResendMessage('An error occurred. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <Card className="p-8">
      <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-center mb-6">Sign In</h2>

      {/* Beta notice */}
      <div className="bg-gold-dim border border-gold/30 rounded-md p-3 mb-6">
        <p className="text-sm text-gold">
          <span className="font-medium">Beta Period:</span> A valid beta code is required to log in. Codes have been distributed to selected testers.
        </p>
      </div>

      {/* Email confirmed success message */}
      {confirmed && (
        <div className="bg-status-green/10 border border-status-green/20 rounded-md p-3 mb-4">
          <p className="text-sm text-status-green flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Email confirmed! Please sign in with your beta code.
          </p>
        </div>
      )}

      {/* Password updated success message */}
      {passwordUpdated && (
        <div className="bg-status-green/10 border border-status-green/20 rounded-md p-3 mb-4">
          <p className="text-sm text-status-green flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Password updated successfully! Please sign in.
          </p>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
        <Input
          id="login-email"
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
        <Input
          id="login-password"
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        {/* Beta Code Input */}
        <div className="pt-2 border-t border-border">
          <Input
            id="login-betacode"
            label="Beta Code"
            type="text"
            name="beta-code"
            value={betaCode}
            onChange={(e) => setBetaCode(e.target.value.toUpperCase())}
            placeholder="BETA-XXXXXXXX"
            className="font-mono uppercase"
          />
          <p className="text-xs text-text-muted mt-1">
            Have a code? Enter it above to access the platform.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-text-muted">
            <input type="checkbox" className="rounded border-border" />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-sm text-gold hover:text-gold-bright">
            Forgot password?
          </Link>
        </div>

        {error && (
          <div className="bg-status-red-dim border border-status-red/20 rounded-md p-3">
            <p className="text-sm text-status-red">{error}</p>
            {showResendConfirmation && (
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={resendLoading}
                className="mt-2 text-sm text-gold hover:text-gold-bright underline disabled:opacity-50"
              >
                {resendLoading ? 'Sending...' : 'Resend confirmation email'}
              </button>
            )}
          </div>
        )}

        {resendMessage && (
          <div className={`rounded-md p-3 ${resendMessage.includes('sent') ? 'bg-status-green/10 border border-status-green/20' : 'bg-status-yellow/10 border border-status-yellow/20'}`}>
            <p className={`text-sm ${resendMessage.includes('sent') ? 'text-status-green' : 'text-status-yellow'}`}>{resendMessage}</p>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      {/* Beta info footer */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="bg-bg-tertiary rounded-md p-4 mb-4">
          <p className="text-xs text-text-muted text-center">
            Beta codes have been distributed to selected testers. You'll be notified via email once we go live.
          </p>
        </div>
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
          <div className="h-12 bg-bg-tertiary rounded"></div>
          <div className="h-12 bg-bg-tertiary rounded"></div>
          <div className="h-4 bg-bg-tertiary rounded w-32"></div>
          <div className="h-12 bg-bg-tertiary rounded"></div>
        </div>
      </div>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-8 hover:opacity-80 transition-opacity">
          <div className="w-16 h-16 bg-gold rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="font-heading font-bold text-bg-primary text-3xl">D</span>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-wide uppercase">Debriefed</h1>
          <p className="font-mono text-xs text-text-muted mt-1">MISSION: TRANSITION</p>
        </Link>

        <Suspense fallback={<LoginFormLoading />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
