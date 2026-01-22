'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { BRANCHES, getRankFromPaygrade, getValidPaygradesForBranch } from '@/lib/constants/military'

function SignupForm() {
  const searchParams = useSearchParams()
  const betaFromUrl = searchParams.get('beta')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    branch: '',
    paygrade: '',
    betaCode: '',
  })
  const [betaCodeLocked, setBetaCodeLocked] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Pre-fill beta code from URL parameter
  useEffect(() => {
    if (betaFromUrl) {
      setFormData(prev => ({ ...prev, betaCode: betaFromUrl.toUpperCase() }))
      setBetaCodeLocked(true)
    }
  }, [betaFromUrl])

  // Get valid paygrades for selected branch
  const validPaygrades = getValidPaygradesForBranch(formData.branch)

  const handleBranchChange = (branch: string) => {
    setFormData(prev => ({
      ...prev,
      branch,
      // Clear paygrade if invalid for new branch
      paygrade: branch && prev.paygrade && !getValidPaygradesForBranch(branch).includes(prev.paygrade)
        ? ''
        : prev.paygrade
    }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Read actual form values to prevent autofill bypass
    // Browser autofill may populate fields without triggering onChange
    const form = e.target as HTMLFormElement
    const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]')
    const passwordInput = form.querySelector<HTMLInputElement>('input[name="new-password"]')
    const firstNameInput = form.querySelector<HTMLInputElement>('input[name="given-name"]')
    const lastNameInput = form.querySelector<HTMLInputElement>('input[name="family-name"]')
    const branchSelect = form.querySelector<HTMLSelectElement>('select[name="branch"]')
    const paygradeSelect = form.querySelector<HTMLSelectElement>('select[name="paygrade"]')
    const betaCodeInput = form.querySelector<HTMLInputElement>('input[name="beta-code"]')

    // Use form values, falling back to state (state should match unless autofill bypassed onChange)
    const email = emailInput?.value || formData.email
    const password = passwordInput?.value || formData.password
    const firstName = firstNameInput?.value || formData.firstName
    const lastName = lastNameInput?.value || formData.lastName
    const branch = branchSelect?.value || formData.branch
    const paygrade = paygradeSelect?.value || formData.paygrade
    const betaCode = betaCodeInput?.value || formData.betaCode

    // Validate required fields (including beta code)
    if (!email || !password || !firstName || !lastName || !branch || !paygrade || !betaCode) {
      setError('Please fill in all required fields including beta code')
      setLoading(false)
      return
    }

    try {
      // Call server-side signup API which validates beta code before creating account
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
          betaCode,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        // Handle specific error messages
        if (data.error.includes('already exists')) {
          setError('An account with this email already exists. Please sign in instead.')
        } else {
          setError(data.error)
        }
        setLoading(false)
        return
      }

      // Success - redirect to verify email page
      router.push(`/verify-email?email=${encodeURIComponent(email)}`)
    } catch {
      setError('Registration failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <Card className="p-8">
      <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-center mb-4">Create Account</h2>

      {/* Locked fields warning */}
      <div className="bg-status-yellow/10 border border-status-yellow/20 rounded-md p-3 mb-6">
        <p className="text-sm text-status-yellow">
          <span className="font-medium">Note:</span> Please enter your first name, last name, and email exactly as you want them to appear on your resume. These fields are locked after registration and cannot be changed without contacting support.
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
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Show auto-detected rank */}
        {formData.branch && formData.paygrade && (
          <div className="bg-bg-tertiary rounded-md p-3">
            <p className="text-sm text-text-muted">
              Rank: <span className="text-text font-medium">{getRankFromPaygrade(formData.branch, formData.paygrade)}</span>
            </p>
          </div>
        )}

        {/* Beta Code (Required) */}
        <div className="space-y-2">
          <Input
            id="signup-betacode"
            label="Beta Code"
            type="text"
            name="beta-code"
            value={formData.betaCode}
            onChange={(e) => !betaCodeLocked && setFormData({ ...formData, betaCode: e.target.value.toUpperCase() })}
            placeholder="BETA-XXXXXXXX"
            className={`font-mono uppercase ${betaCodeLocked ? 'bg-bg-tertiary text-text-muted cursor-not-allowed' : ''}`}
            readOnly={betaCodeLocked}
            required
          />
          {betaCodeLocked && (
            <p className="text-xs text-status-green flex items-center gap-1">
              <span>✓</span> Beta code applied
            </p>
          )}
        </div>

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
