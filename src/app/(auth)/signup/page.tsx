'use client'

import { useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { BRANCHES, getRankFromPaygrade, getValidPaygradesForBranch } from '@/lib/constants/military'

function SignupForm() {
  const searchParams = useSearchParams()
  void searchParams // preserve Suspense boundary

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    branch: '',
    paygrade: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const submittingRef = useRef(false)
  const router = useRouter()

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    // Ref-based guard prevents double-submission even before React state updates
    if (submittingRef.current) return
    submittingRef.current = true
    setLoading(true)
    setError('')

    const form = e.target as HTMLFormElement
    const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]')
    const passwordInput = form.querySelector<HTMLInputElement>('input[name="new-password"]')
    const firstNameInput = form.querySelector<HTMLInputElement>('input[name="given-name"]')
    const lastNameInput = form.querySelector<HTMLInputElement>('input[name="family-name"]')
    const branchSelect = form.querySelector<HTMLSelectElement>('select[name="branch"]')
    const paygradeSelect = form.querySelector<HTMLSelectElement>('select[name="paygrade"]')

    const email = emailInput?.value || formData.email
    const password = passwordInput?.value || formData.password
    const firstName = firstNameInput?.value || formData.firstName
    const lastName = lastNameInput?.value || formData.lastName
    const branch = branchSelect?.value || formData.branch
    const paygrade = paygradeSelect?.value || formData.paygrade

    if (!email || !password || !firstName || !lastName || !branch || !paygrade) {
      setError('Please fill in all required fields')
      submittingRef.current = false
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          branch,
          paygrade,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        if (data.error.includes('already exists')) {
          setError('An account with this email already exists. Please sign in instead.')
        } else {
          setError(data.error)
        }
        submittingRef.current = false
        setLoading(false)
        return
      }

      // Show success message instead of redirecting
      setSuccess(true)
    } catch {
      setError('Registration failed. Please try again.')
      submittingRef.current = false
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-status-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-status-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-heading text-xl font-bold uppercase tracking-wider mb-4">Account Created!</h2>
          <div className="bg-gold-dim border border-gold/30 rounded-md p-4 mb-6 text-left">
            <p className="text-sm text-gold mb-3">
              <span className="font-medium">Welcome to Debriefed!</span>
            </p>
            <p className="text-sm text-text-muted">
              Your account has been created. Check your inbox and verify your email to get started.
            </p>
          </div>
          <div className="bg-bg-tertiary rounded-md p-4 mb-6">
            <p className="text-sm text-text-muted">
              <span className="font-medium text-text">Next step:</span> Check your inbox for a verification email, then sign in to start building your resume.
            </p>
            <p className="text-xs text-text-dim mt-2">
              Don&apos;t see it? Check your spam or junk folder. Emails come from{' '}
              <span className="text-text-muted font-mono">noreply@getdebriefed.co</span>
            </p>
          </div>
          <div className="space-y-3">
            <Link href="/login" className="block">
              <Button variant="secondary" className="w-full">
                Go to Sign In
              </Button>
            </Link>
          </div>
        </div>
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

      <form onSubmit={handleSignup} className="space-y-4" autoComplete="on">
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
        <Input
          id="signup-password"
          label="Password"
          type="password"
          name="new-password"
          autoComplete="new-password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="••••••••"
          required
        />

        <div className="space-y-2">
          <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">Branch</label>
          <select
            name="branch"
            value={formData.branch}
            onChange={(e) => handleBranchChange(e.target.value)}
            className="w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-text"
            required
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

        {error && (
          <div className="bg-status-red-dim border border-status-red/20 rounded-md p-3">
            <p className="text-sm text-status-red">{error}</p>
            {error.includes('already exists') && (
              <Link href="/login" className="text-sm text-gold hover:text-gold-bright underline mt-2 block">
                Go to login →
              </Link>
            )}
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
          <div className="h-12 bg-bg-tertiary rounded"></div>
        </div>
      </div>
    </Card>
  )
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-8 hover:opacity-80 transition-opacity">
          <div className="w-16 h-16 bg-gold rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="font-heading font-bold text-bg-primary text-3xl">D</span>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-wide uppercase">Debriefed</h1>
          <p className="font-mono text-xs text-text-muted mt-1">BEGIN YOUR MISSION</p>
        </Link>

        <Suspense fallback={<SignupFormLoading />}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  )
}
