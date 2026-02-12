'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }

    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="text-4xl mb-4">✓</div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wider mb-4">
            Check Your Email
          </h1>
          <p className="text-text-muted mb-6">
            We sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-text-dim mb-2">
            Don&apos;t see it? Check your spam or junk folder. Emails come from{' '}
            <span className="text-text-muted font-mono">noreply@getdebriefed.co</span>
          </p>
          <p className="text-xs text-text-dim mb-6">
            If you still don&apos;t receive it after a few minutes, try again.
          </p>
          <Link href="/login">
            <Button variant="secondary" className="w-full">
              Back to Sign In
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wider mb-2">
            Forgot Password
          </h1>
          <p className="text-text-muted">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
          />

          {error && (
            <div className="bg-status-red-dim border border-status-red/20 rounded-md p-3">
              <p className="text-sm text-status-red">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-text-muted hover:text-gold">
            Back to Sign In
          </Link>
        </div>
      </Card>
    </div>
  )
}
