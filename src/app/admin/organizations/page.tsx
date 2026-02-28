'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Organization {
  id: string
  name: string
  slug: string
  logo_url: string | null
  primary_color: string | null
  contact_email: string
  plan: string
  max_seats: number
  seats_used: number
  created_at: string
}

export default function AdminOrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    slug: '',
    contact_email: '',
    plan: 'starter',
    max_seats: 25,
  })

  useEffect(() => {
    fetchOrgs()
  }, [])

  const fetchOrgs = async () => {
    const res = await fetch('/api/admin/organizations')
    const data = await res.json()
    setOrgs(data.organizations || [])
    setLoading(false)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setError('')

    const res = await fetch('/api/admin/organizations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Failed to create organization')
      setCreating(false)
      return
    }

    setShowCreate(false)
    setForm({ name: '', slug: '', contact_email: '', plan: 'starter', max_seats: 25 })
    setCreating(false)
    fetchOrgs()
  }

  const autoSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  const planBadge = (plan: string) => {
    const colors: Record<string, string> = {
      starter: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      growth: 'bg-gold/20 text-gold border-gold/30',
      enterprise: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    }
    return colors[plan] || colors.starter
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wider">Organizations</h1>
          <p className="text-text-muted text-sm mt-1">Manage B2B partner organizations</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-gold text-bg-primary font-heading text-sm uppercase tracking-wider rounded-md hover:bg-gold-bright transition-colors"
        >
          {showCreate ? 'Cancel' : '+ Create Organization'}
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="bg-bg-secondary border border-border rounded-lg p-6 mb-8">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">New Organization</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Organization Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value, slug: autoSlug(e.target.value) })
                  }}
                  className="w-full px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text focus:outline-none focus:border-gold"
                  placeholder="Acme Corp"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Slug (URL path)</label>
                <div className="flex items-center gap-1">
                  <span className="text-text-muted text-sm">/join/</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                    className="flex-1 px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text focus:outline-none focus:border-gold"
                    placeholder="acme-corp"
                    required
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
                  placeholder="admin@acme.com"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Plan</label>
                  <select
                    value={form.plan}
                    onChange={(e) => setForm({ ...form, plan: e.target.value })}
                    className="w-full px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text focus:outline-none focus:border-gold"
                  >
                    <option value="starter">Starter</option>
                    <option value="growth">Growth</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Max Seats</label>
                  <input
                    type="number"
                    value={form.max_seats}
                    onChange={(e) => setForm({ ...form, max_seats: parseInt(e.target.value) || 25 })}
                    className="w-full px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text focus:outline-none focus:border-gold"
                    min={1}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-status-red/10 border border-status-red/20 rounded-md p-3">
                <p className="text-sm text-status-red">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2 bg-gold text-bg-primary font-heading text-sm uppercase tracking-wider rounded-md hover:bg-gold-bright transition-colors disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Organization'}
            </button>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-bg-secondary border border-border rounded-lg p-4">
          <div className="text-text-muted text-xs uppercase tracking-wider">Total Organizations</div>
          <div className="text-2xl font-bold mt-1">{orgs.length}</div>
        </div>
        <div className="bg-bg-secondary border border-border rounded-lg p-4">
          <div className="text-text-muted text-xs uppercase tracking-wider">Total B2B Users</div>
          <div className="text-2xl font-bold mt-1">{orgs.reduce((sum, o) => sum + o.seats_used, 0)}</div>
        </div>
        <div className="bg-bg-secondary border border-border rounded-lg p-4">
          <div className="text-text-muted text-xs uppercase tracking-wider">Total Seats Available</div>
          <div className="text-2xl font-bold mt-1">{orgs.reduce((sum, o) => sum + o.max_seats, 0)}</div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center text-text-muted py-12">Loading organizations...</div>
      ) : orgs.length === 0 ? (
        <div className="text-center text-text-muted py-12 bg-bg-secondary border border-border rounded-lg">
          <p className="text-lg mb-2">No organizations yet</p>
          <p className="text-sm">Create your first B2B partner organization above.</p>
        </div>
      ) : (
        <div className="bg-bg-secondary border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs text-text-muted uppercase tracking-wider font-heading">Organization</th>
                  <th className="text-left px-4 py-3 text-xs text-text-muted uppercase tracking-wider font-heading">Plan</th>
                  <th className="text-left px-4 py-3 text-xs text-text-muted uppercase tracking-wider font-heading">Seats</th>
                  <th className="text-left px-4 py-3 text-xs text-text-muted uppercase tracking-wider font-heading">Contact</th>
                  <th className="text-left px-4 py-3 text-xs text-text-muted uppercase tracking-wider font-heading">Created</th>
                  <th className="text-right px-4 py-3 text-xs text-text-muted uppercase tracking-wider font-heading">Action</th>
                </tr>
              </thead>
              <tbody>
                {orgs.map((org) => (
                  <tr key={org.id} className="border-b border-border/50 hover:bg-bg-tertiary/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {org.logo_url ? (
                          <img src={org.logo_url} alt="" className="w-8 h-8 rounded object-cover" />
                        ) : (
                          <div className="w-8 h-8 bg-gold/20 rounded flex items-center justify-center">
                            <span className="text-gold font-bold text-xs">{org.name[0]}</span>
                          </div>
                        )}
                        <div>
                          <div className="font-semibold">{org.name}</div>
                          <div className="text-text-muted text-xs">/join/{org.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs border uppercase font-heading ${planBadge(org.plan)}`}>
                        {org.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={org.seats_used >= org.max_seats ? 'text-status-red' : ''}>
                        {org.seats_used}
                      </span>
                      <span className="text-text-muted"> / {org.max_seats}</span>
                    </td>
                    <td className="px-4 py-3 text-text-muted">{org.contact_email}</td>
                    <td className="px-4 py-3 text-text-muted">{new Date(org.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/organizations/${org.id}`}
                        className="px-3 py-1 text-xs text-gold hover:text-gold-bright border border-gold/30 rounded-md hover:bg-gold/10 transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
