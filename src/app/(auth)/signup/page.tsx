'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { BetaCodeInput } from '@/components/beta/BetaCodeInput'
import { BRANCHES, PAYGRADES, getRankFromPaygrade, getValidPaygradesForBranch } from '@/lib/constants/military'

export default function SignupPage() {
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
  const [betaCode, setBetaCode] = useState('')
  const [betaPlan, setBetaPlan] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

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

    // Use form values, falling back to state (state should match unless autofill bypassed onChange)
    const email = emailInput?.value || formData.email
    const password = passwordInput?.value || formData.password
    const firstName = firstNameInput?.value || formData.firstName
    const lastName = lastNameInput?.value || formData.lastName
    const branch = branchSelect?.value || formData.branch
    const paygrade = paygradeSelect?.value || formData.paygrade

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !branch || !paygrade) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`.trim(),
          branch,
          paygrade,
        },
      },
    })

    // Supabase returns a user with identities = [] if email already exists
    if (data?.user && data.user.identities?.length === 0) {
      setError('An account with this email already exists. Please sign in instead.')
      setLoading(false)
      return
    }

    if (error) {
      // Check for various "already exists" error messages
      if (error.message.includes('already registered') ||
          error.message.includes('already exists') ||
          error.message.includes('already been registered')) {
        setError('An account with this email already exists. Please sign in instead.')
      } else {
        setError(error.message)
      }
      setLoading(false)
    } else {
      // Beta code is stored in localStorage by BetaCodeInput component
      // It will be redeemed when user reaches dashboard after email verification
      // Redirect to verify email page with email param
      router.push(`/verify-email?email=${encodeURIComponent(email)}`)
    }
  }

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

        <Card className="p-8">
          <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-center mb-6">Create Account</h2>

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

            {/* Beta Code (Optional) */}
            <div className="space-y-2">
              <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
                Beta Code (Optional)
              </label>
              <BetaCodeInput
                mode="validate"
                onCodeChange={(code) => setBetaCode(code)}
                onValidCode={(plan) => setBetaPlan(plan)}
              />
              {betaPlan && (
                <Badge variant="gold">Will unlock: {betaPlan.toUpperCase()}</Badge>
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
      </div>
    </div>
  )
}
