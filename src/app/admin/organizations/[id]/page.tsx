'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'

interface Member {
  id: string
  user_id: string
  role: string
  created_at: string
  profile: {
    email: string
    first_name: string
    last_name: string
    created_at: string
    last_login_at: string | null
  } | null
  usage: Record<string, number>
}

interface Organization {
  id: string
  name: string
  slug: string
  logo_url: string | null
  primary_color: string | null
  contact_email: string
  plan: string
  max_seats: number
  created_at: string
}

export default function AdminOrgDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [org, setOrg] = useState<Organization | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [seatsUsed, setSeatsUsed] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    contact_email: '',
    plan: '',
    max_seats: 0,
    logo_url: '',
    primary_color: '',
  })

  useEffect(() => {
    fetchOrg()
  }, [id])

  const fetchOrg = async () => {
    const res = await fetch(`/api/admin/organizations/${id}`)
    const data = await res.json()
    if (data.organization) {
      setOrg(data.organization)
      setMembers(data.members || [])
      setSeatsUsed(data.seats_used || 0)
      setEditForm({
        name: data.organization.name,
        contact_email: data.organization.contact_email,
        plan: data.organization.plan,
        max_seats: data.organization.max_seats,
        logo_url: data.organization.logo_url || '',
        primary_color: data.organization.primary_color || '',
      })
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    await fetch(`/api/admin/organizations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    await fetchOrg()
    setSaving(false)
  }

  if (loading) return <div className="text-center text-text-muted py-12">Loading...</div>
  if (!org) return <div className="text-center text-status-red py-12">Organization not found</div>

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link href="/admin/organizations" className="hover:text-gold transition-colors">Organizations</Link>
        <span>/</span>
        <span className="text-text">{org.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          {org.logo_url ? (
            <img src={org.logo_url} alt="" className="w-14 h-14 rounded-lg object-cover" />
          ) : (
            <div className="w-14 h-14 bg-gold/20 rounded-lg flex items-center justify-center">
              <span className="text-gold font-heading font-bold text-2xl">{org.name[0]}</span>
            </div>
          )}
          <div>
            <h1 className="font-heading text-2xl font-bold uppercase tracking-wider">{org.name}</h1>
            <p className="text-text-muted text-sm mt-0.5">/join/{org.slug}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-bg-secondary border border-border rounded-lg p-4">
          <div className="text-text-muted text-xs uppercase tracking-wider">Plan</div>
          <div className="text-lg font-bold mt-1 capitalize">{org.plan}</div>
        </div>
        <div className="bg-bg-secondary border border-border rounded-lg p-4">
          <div className="text-text-muted text-xs uppercase tracking-wider">Seats</div>
          <div className="text-lg font-bold mt-1">
            <span className={seatsUsed >= org.max_seats ? 'text-status-red' : ''}>{seatsUsed}</span>
            <span className="text-text-muted"> / {org.max_seats}</span>
          </div>
        </div>
        <div className="bg-bg-secondary border border-border rounded-lg p-4">
          <div className="text-text-muted text-xs uppercase tracking-wider">Contact</div>
          <div className="text-sm font-medium mt-1 truncate">{org.contact_email}</div>
        </div>
        <div className="bg-bg-secondary border border-border rounded-lg p-4">
          <div className="text-text-muted text-xs uppercase tracking-wider">Created</div>
          <div className="text-sm font-medium mt-1">{new Date(org.created_at).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Two Column: Edit + Members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Edit Form */}
        <div className="lg:col-span-1">
          <div className="bg-bg-secondary border border-border rounded-lg p-6">
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">Edit Organization</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Contact Email</label>
                <input
                  type="email"
                  value={editForm.contact_email}
                  onChange={(e) => setEditForm({ ...editForm, contact_email: e.target.value })}
                  className="w-full px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Logo URL</label>
                <input
                  type="text"
                  value={editForm.logo_url}
                  onChange={(e) => setEditForm({ ...editForm, logo_url: e.target.value })}
                  className="w-full px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text focus:outline-none focus:border-gold"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={editForm.primary_color || '#C8A55A'}
                    onChange={(e) => setEditForm({ ...editForm, primary_color: e.target.value })}
                    className="w-8 h-8 border border-border rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editForm.primary_color}
                    onChange={(e) => setEditForm({ ...editForm, primary_color: e.target.value })}
                    className="flex-1 px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text focus:outline-none focus:border-gold"
                    placeholder="#C8A55A"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">Plan</label>
                  <select
                    value={editForm.plan}
                    onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
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
                    value={editForm.max_seats}
                    onChange={(e) => setEditForm({ ...editForm, max_seats: parseInt(e.target.value) || 25 })}
                    className="w-full px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text focus:outline-none focus:border-gold"
                    min={1}
                  />
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full px-4 py-2 bg-gold text-bg-primary font-heading text-sm uppercase tracking-wider rounded-md hover:bg-gold-bright transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        {/* Members Table */}
        <div className="lg:col-span-2">
          <div className="bg-bg-secondary border border-border rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-heading text-sm font-bold uppercase tracking-wider">
                Members ({members.length})
              </h2>
            </div>
            {members.length === 0 ? (
              <div className="px-6 py-8 text-center text-text-muted text-sm">No members yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-2 text-xs text-text-muted uppercase tracking-wider">Name</th>
                      <th className="text-left px-4 py-2 text-xs text-text-muted uppercase tracking-wider">Role</th>
                      <th className="text-left px-4 py-2 text-xs text-text-muted uppercase tracking-wider">Resumes</th>
                      <th className="text-left px-4 py-2 text-xs text-text-muted uppercase tracking-wider">Jobs</th>
                      <th className="text-left px-4 py-2 text-xs text-text-muted uppercase tracking-wider">Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => (
                      <tr key={m.id} className="border-b border-border/50 hover:bg-bg-tertiary/50">
                        <td className="px-4 py-2">
                          <div className="font-medium">
                            {m.profile?.first_name} {m.profile?.last_name}
                          </div>
                          <div className="text-text-muted text-xs">{m.profile?.email}</div>
                        </td>
                        <td className="px-4 py-2">
                          <span className={`text-xs uppercase font-heading ${m.role === 'admin' ? 'text-gold' : 'text-text-muted'}`}>
                            {m.role}
                          </span>
                        </td>
                        <td className="px-4 py-2">{m.usage.private_resumes || 0}</td>
                        <td className="px-4 py-2">{m.usage.job_match || 0}</td>
                        <td className="px-4 py-2 text-text-muted text-xs">
                          {m.profile?.last_login_at
                            ? new Date(m.profile.last_login_at).toLocaleDateString()
                            : 'Never'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
