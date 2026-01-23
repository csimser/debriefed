'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

// TEMP: Admin-only access during development
const ALLOWED_EMAILS = [
  'chris.simser@gmail.com',
  'admin@debriefed.io',
]

function LoginForm() {
  const searchParams = useSearchParams()
  const confirmed = searchParams.get('confirmed') === 'true'
  const passwordUpdated = searchParams.get('message') === 'password_updated'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

    // TEMP: Admin-only access during development
    if (!ALLOWED_EMAILS.includes(email.toLowerCase().trim())) {
      setError('Access restricted during beta development.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      // Show resend option if email not confirmed
      if (error.message.toLowerCase().includes('email not confirmed') ||
          error.message.toLowerCase().includes('email confirmation')) {
        setShowResendConfirmation(true)
      }
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
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

      {/* Email confirmed success message */}
      {confirmed && (
        <div className="bg-status-green/10 border border-status-green/20 rounded-md p-3 mb-4">
          <p className="text-sm text-status-green flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Email confirmed! Please sign in.
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

      <div className="mt-6 text-center">
        <p className="text-sm text-text-muted">
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
