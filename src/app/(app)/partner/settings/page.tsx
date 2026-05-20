'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface OrgSettings {
  id: string
  name: string
  slug: string
  logo_url: string | null
  primary_color: string | null
  contact_email: string
  plan: string
  max_seats: number
}

export default function PartnerSettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    logo_url: '',
    primary_color: '',
    contact_email: '',
  })

  useEffect(() => {
    fetch('/api/partner/org')
      .then(r => r.json())
      .then(data => {
        if (data.organization) {
          setOrg(data.organization)
          setForm({
            logo_url: data.organization.logo_url || '',
            primary_color: data.organization.primary_color || '',
            contact_email: data.organization.contact_email || '',
          })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    const res = await fetch('/api/partner/org', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const data = await res.json()
      setOrg(data.organization)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-bg-secondary rounded w-48" />
          <div className="h-64 bg-bg-secondary rounded-lg" />
        </div>
      </div>
    )
  }

  if (!org) return <div className="text-center py-12 text-status-red">Failed to load settings</div>

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="font-heading text-2xl font-bold uppercase tracking-wider mb-6">Organization Settings</h1>

      {/* Navigation */}
      <div className="flex items-center gap-2 mb-8 border-b border-border pb-3">
        <Link href="/partner" className="px-3 py-1.5 text-sm font-heading uppercase tracking-wider text-text-muted hover:text-text rounded-md">
          Overview
        </Link>
        <Link href="/partner/members" className="px-3 py-1.5 text-sm font-heading uppercase tracking-wider text-text-muted hover:text-text rounded-md">
          Members
        </Link>
        <Link href="/partner/settings" className="px-3 py-1.5 text-sm font-heading uppercase tracking-wider text-gold bg-gold/10 rounded-md">
          Settings
        </Link>
      </div>

      {/* Org Info (read-only) */}
      <div className="bg-bg-secondary border border-border rounded-lg p-6 mb-6">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">Organization Info</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-text-muted">Name:</span>
            <span className="ml-2 font-medium">{org.name}</span>
          </div>
          <div>
            <span className="text-text-muted">Slug:</span>
            <span className="ml-2 font-mono text-gold">/join/{org.slug}</span>
          </div>
          <div>
            <span className="text-text-muted">Plan:</span>
            <span className="ml-2 font-medium capitalize">{org.plan}</span>
          </div>
          <div>
            <span className="text-text-muted">Max Seats:</span>
            <span className="ml-2 font-medium">{org.max_seats}</span>
          </div>
        </div>
        <p className="text-xs text-text-muted mt-3">Contact support to change plan or seat limits.</p>
      </div>

      {/* Editable Settings */}
      <div className="bg-bg-secondary border border-border rounded-lg p-6 mb-6">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">Branding & Contact</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Logo URL</label>
            <input
              type="text"
              value={form.logo_url}
              onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
              className="w-full px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text focus:outline-none focus:border-gold"
              placeholder="https://example.com/logo.png"
            />
            {form.logo_url && (
              <div className="mt-2">
                <img src={form.logo_url} alt="Logo preview" className="w-16 h-16 rounded-lg object-cover border border-border" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.primary_color || '#C8A55A'}
                onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                className="w-10 h-10 border border-border rounded cursor-pointer"
              />
              <input
                type="text"
                value={form.primary_color}
                onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                className="flex-1 px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text focus:outline-none focus:border-gold"
                placeholder="#C8A55A"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Contact Email</label>
            <input
              type="email"
              value={form.contact_email}
              onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
              className="w-full px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text focus:outline-none focus:border-gold"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-gold text-bg-primary font-heading text-sm uppercase tracking-wider rounded-md hover:bg-gold-bright transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {saved && <span className="text-sm text-green-400">Saved!</span>}
        </div>
      </div>

      {/* White-label Preview */}
      <div className="bg-bg-secondary border border-border rounded-lg p-6">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">Signup Page Preview</h2>
        <p className="text-text-muted text-sm mb-4">
          This is how your branded signup page at <code className="text-gold">/join/{org.slug}</code> looks to new users:
        </p>
        <div className="bg-bg-primary border border-border rounded-lg p-8 max-w-sm mx-auto text-center">
          {form.logo_url ? (
            <img src={form.logo_url} alt="" className="w-16 h-16 rounded-lg object-cover mx-auto mb-4" />
          ) : (
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: form.primary_color ? `${form.primary_color}30` : '#C8A55A30' }}
            >
              <span
                className="font-heading font-bold text-3xl"
                style={{ color: form.primary_color || '#C8A55A' }}
              >
                {org.name[0]}
              </span>
            </div>
          )}
          <h3 className="font-heading text-lg font-bold uppercase tracking-wider mb-1">Join {org.name}</h3>
          <p className="text-text-muted text-xs mb-4">Create your Debriefed account</p>
          <div className="space-y-2">
            <div className="h-10 bg-bg-tertiary rounded-md" />
            <div className="h-10 bg-bg-tertiary rounded-md" />
            <div className="h-10 bg-bg-tertiary rounded-md" />
            <div
              className="h-10 rounded-md flex items-center justify-center text-sm font-heading uppercase tracking-wider"
              style={{
                backgroundColor: form.primary_color || '#C8A55A',
                color: '#1a1a2e',
              }}
            >
              Create Account
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
