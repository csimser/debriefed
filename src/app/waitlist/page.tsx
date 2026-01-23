'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

const BRANCH_OPTIONS = [
  { value: '', label: 'Select Branch' },
  { value: 'Navy', label: 'Navy' },
  { value: 'Army', label: 'Army' },
  { value: 'Air Force', label: 'Air Force' },
  { value: 'Marine Corps', label: 'Marine Corps' },
  { value: 'Coast Guard', label: 'Coast Guard' },
  { value: 'Space Force', label: 'Space Force' },
  { value: 'N/A', label: 'N/A' },
]

const ROLE_OPTIONS = [
  { value: '', label: 'Select Role' },
  { value: 'Transitioning Service Member', label: 'Transitioning Service Member' },
  { value: 'Veteran', label: 'Veteran' },
  { value: 'Civilian HR Professional', label: 'Civilian HR Professional' },
  { value: 'VSO / Transition Counselor', label: 'VSO / Transition Counselor' },
  { value: 'Other', label: 'Other' },
]

const TARGET_INDUSTRY_OPTIONS = [
  { value: '', label: 'Select Industry' },
  { value: 'Project Management', label: 'Project Management' },
  { value: 'Operations', label: 'Operations' },
  { value: 'IT/Cybersecurity', label: 'IT/Cybersecurity' },
  { value: 'Logistics', label: 'Logistics' },
  { value: 'HR', label: 'HR' },
  { value: 'Management', label: 'Management' },
  { value: 'Other', label: 'Other' },
]

export default function WaitlistPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    branch: '',
    role_type: '',
    linkedin_url: '',
    eas_date: '',
    phone: '',
    target_industry: '',
    discord_feedback: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          branch: formData.branch || null,
          role_type: formData.role_type || null,
          linkedin_url: formData.linkedin_url || null,
          eas_date: formData.eas_date || null,
          phone: formData.phone || null,
          target_industry: formData.target_industry || null,
          discord_feedback: formData.discord_feedback,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link href="/" className="block text-center mb-8 hover:opacity-80 transition-opacity">
            <div className="w-16 h-16 bg-gold rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="font-heading font-bold text-bg-primary text-3xl">D</span>
            </div>
          </Link>

          <Card className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="font-heading text-2xl font-bold uppercase tracking-wider mb-4 text-white">
              You're on the list
            </h1>

            <p className="text-text-muted mb-8">
              Thanks for your interest in Debriefed. We'll be in touch soon with beta access.
            </p>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold text-bg-primary font-heading font-bold uppercase tracking-wider rounded-lg hover:bg-gold-bright transition-colors w-full"
            >
              Back to Home
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-8 hover:opacity-80 transition-opacity">
          <div className="w-16 h-16 bg-gold rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="font-heading font-bold text-bg-primary text-3xl">D</span>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-wide uppercase">Debriefed</h1>
          <p className="font-mono text-xs text-text-muted mt-1">JOIN THE WAITLIST</p>
        </Link>

        <Card className="p-8">
          <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-center mb-4">
            Get Early Access
          </h2>

          {/* Beta testing info note */}
          <div className="border-l-4 border-gold bg-gold/5 p-4 mb-6">
            <p className="text-sm text-text-muted">
              Beta testing opens January 26 and runs through February 1. Beta codes are limited — not everyone will be selected. If chosen, you'll have 72 hours from activation to test the platform and provide feedback.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                placeholder="John"
                required
              />
              <Input
                label="Last Name"
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="Doe"
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
            />

            <Input
              label="Phone Number (optional)"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(555) 123-4567"
            />

            <Input
              label="LinkedIn URL (optional)"
              type="url"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              placeholder="https://linkedin.com/in/yourprofile"
            />

            <div className="space-y-2">
              <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
                Branch of Service
              </label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-text"
              >
                {BRANCH_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
                I am a...
              </label>
              <select
                value={formData.role_type}
                onChange={(e) => setFormData({ ...formData, role_type: e.target.value })}
                className="w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-text"
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
                EAS / Separation Date (optional)
              </label>
              <input
                type="date"
                value={formData.eas_date}
                onChange={(e) => setFormData({ ...formData, eas_date: e.target.value })}
                className="w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-text"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
                Target Industry or Job Field (optional)
              </label>
              <select
                value={formData.target_industry}
                onChange={(e) => setFormData({ ...formData, target_industry: e.target.value })}
                className="w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-text"
              >
                {TARGET_INDUSTRY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.discord_feedback}
                onChange={(e) => setFormData({ ...formData, discord_feedback: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-border bg-bg-secondary text-gold focus:ring-gold focus:ring-offset-0"
              />
              <span className="text-sm text-text-muted group-hover:text-text transition-colors">
                I'm willing to provide bug reports and feedback via Discord
              </span>
            </label>

            {error && (
              <div className="bg-status-red-dim border border-status-red/20 rounded-md p-3">
                <p className="text-sm text-status-red">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              {loading ? 'Joining...' : 'Join Waitlist'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gold hover:text-gold-bright">
              ← Back to Home
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
