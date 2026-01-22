'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [sessionChecked, setSessionChecked] = useState(false)
  const [hasSession, setHasSession] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  // Check for valid session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setHasSession(!!session)
      setSessionChecked(true)
    }
    checkSession()
  }, [supabase.auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      // Provide clearer error message for session issues
      if (error.message.toLowerCase().includes('session')) {
        setError('Your password reset link has expired. Please request a new one.')
      } else {
        setError(error.message)
      }
      setLoading(false)
    } else {
      setSuccess(true)
      // Redirect to login after brief delay to show success
      setTimeout(() => {
        router.push('/login?message=password_updated')
      }, 2000)
    }
  }

  // Loading state while checking session
  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-bg-tertiary rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-bg-tertiary rounded w-32 mx-auto"></div>
          </div>
        </Card>
      </div>
    )
  }

  // No session - show error with link to request new reset
  if (!hasSession) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="text-4xl mb-4">⚠</div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wider mb-4">
            Session Expired
          </h1>
          <p className="text-text-muted mb-6">
            Your password reset link has expired or is invalid. Please request a new one.
          </p>
          <div className="space-y-3">
            <Link href="/forgot-password">
              <Button className="w-full">
                Request New Reset Link
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="text-4xl mb-4">✓</div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wider mb-4">
            Password Updated
          </h1>
          <p className="text-text-muted mb-6">
            Your password has been successfully updated. Redirecting to login...
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wider mb-2">
            Reset Password
          </h1>
          <p className="text-text-muted">
            Enter your new password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            label="New Password"
            name="new-password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            required
          />

          <Input
            type="password"
            label="Confirm Password"
            name="confirm-password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />

          {error && (
            <div className="bg-status-red-dim border border-status-red/20 rounded-md p-3">
              <p className="text-sm text-status-red">{error}</p>
              {error.includes('expired') && (
                <Link href="/forgot-password" className="text-sm text-gold hover:text-gold-bright underline mt-2 inline-block">
                  Request a new reset link
                </Link>
              )}
            </div>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
