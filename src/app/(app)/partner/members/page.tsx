'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Member {
  id: string
  user_id: string
  role: string
  member_since: string
  email: string
  first_name: string
  last_name: string
  signup_date: string
  last_active: string | null
  resumes_created: number
  jobs_analyzed: number
  cover_letters: number
}

type SortField = 'first_name' | 'email' | 'signup_date' | 'resumes_created' | 'jobs_analyzed' | 'last_active'

export default function PartnerMembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [sortField, setSortField] = useState<SortField>('signup_date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  // Add member state
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState({ email: '', firstName: '', lastName: '' })
  const [adding, setAdding] = useState(false)
  const [addResult, setAddResult] = useState<{ success: boolean; temporary_password?: string | null; error?: string } | null>(null)

  // Bulk upload state
  const [showBulk, setShowBulk] = useState(false)
  const [bulkFile, setBulkFile] = useState<File | null>(null)
  const [bulking, setBulking] = useState(false)
  const [bulkResults, setBulkResults] = useState<Array<{ email: string; success: boolean; temporary_password?: string; error?: string }> | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    const res = await fetch('/api/partner/members')
    const data = await res.json()
    setMembers(data.members || [])
    setLoading(false)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const sortedMembers = [...members].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1
    const aVal = a[sortField]
    const bVal = b[sortField]
    if (aVal == null && bVal == null) return 0
    if (aVal == null) return dir
    if (bVal == null) return -dir
    if (typeof aVal === 'number' && typeof bVal === 'number') return (aVal - bVal) * dir
    return String(aVal).localeCompare(String(bVal)) * dir
  })

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)
    setAddResult(null)

    const res = await fetch('/api/partner/members/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addForm),
    })

    const data = await res.json()
    if (res.ok) {
      setAddResult({ success: true, temporary_password: data.member?.temporary_password })
      setAddForm({ email: '', firstName: '', lastName: '' })
      fetchMembers()
    } else {
      setAddResult({ success: false, error: data.error })
    }
    setAdding(false)
  }

  const handleBulkUpload = async () => {
    if (!bulkFile) return
    setBulking(true)
    setBulkResults(null)

    const text = await bulkFile.text()
    const lines = text.trim().split('\n')
    const rows = lines.slice(1).map(line => {
      const parts = line.split(',').map(s => s.trim().replace(/^"|"$/g, ''))
      return { email: parts[0], firstName: parts[1], lastName: parts[2] }
    }).filter(r => r.email && r.firstName && r.lastName)

    if (rows.length === 0) {
      setBulkResults([{ email: 'N/A', success: false, error: 'No valid rows found in CSV' }])
      setBulking(false)
      return
    }

    const res = await fetch('/api/partner/members/bulk-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows }),
    })

    const data = await res.json()
    setBulkResults(data.results || [])
    setBulking(false)
    fetchMembers()
  }

  const handleExport = () => {
    window.open('/api/partner/members/export', '_blank')
  }

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <th
      onClick={() => handleSort(field)}
      className="text-left px-4 py-3 text-xs text-text-muted uppercase tracking-wider font-heading cursor-pointer hover:text-gold transition-colors select-none"
    >
      {label} {sortField === field && (sortDir === 'asc' ? '▲' : '▼')}
    </th>
  )

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wider">Members</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="px-3 py-1.5 text-sm border border-border rounded-md text-text-muted hover:text-text hover:border-gold/30 transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={() => { setShowBulk(!showBulk); setShowAdd(false) }}
            className="px-3 py-1.5 text-sm border border-border rounded-md text-text-muted hover:text-text hover:border-gold/30 transition-colors"
          >
            Bulk Add
          </button>
          <button
            onClick={() => { setShowAdd(!showAdd); setShowBulk(false) }}
            className="px-4 py-1.5 bg-gold text-bg-primary font-heading text-sm uppercase tracking-wider rounded-md hover:bg-gold-bright transition-colors"
          >
            + Add Member
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2 mb-6 border-b border-border pb-3">
        <Link href="/partner" className="px-3 py-1.5 text-sm font-heading uppercase tracking-wider text-text-muted hover:text-text rounded-md">
          Overview
        </Link>
        <Link href="/partner/members" className="px-3 py-1.5 text-sm font-heading uppercase tracking-wider text-gold bg-gold/10 rounded-md">
          Members
        </Link>
        <Link href="/partner/settings" className="px-3 py-1.5 text-sm font-heading uppercase tracking-wider text-text-muted hover:text-text rounded-md">
          Settings
        </Link>
      </div>

      {/* Add Member Form */}
      {showAdd && (
        <div className="bg-bg-secondary border border-border rounded-lg p-6 mb-6">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">Add Member</h2>
          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="email"
                value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                className="px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text focus:outline-none focus:border-gold"
                placeholder="Email address"
                required
              />
              <input
                type="text"
                value={addForm.firstName}
                onChange={(e) => setAddForm({ ...addForm, firstName: e.target.value })}
                className="px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text focus:outline-none focus:border-gold"
                placeholder="First name"
                required
              />
              <input
                type="text"
                value={addForm.lastName}
                onChange={(e) => setAddForm({ ...addForm, lastName: e.target.value })}
                className="px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text focus:outline-none focus:border-gold"
                placeholder="Last name"
                required
              />
            </div>
            <button
              type="submit"
              disabled={adding}
              className="px-6 py-2 bg-gold text-bg-primary font-heading text-sm uppercase tracking-wider rounded-md hover:bg-gold-bright transition-colors disabled:opacity-50"
            >
              {adding ? 'Creating...' : 'Create Account & Add'}
            </button>
          </form>

          {addResult && (
            <div className={`mt-4 p-3 rounded-md border ${addResult.success ? 'bg-green-500/10 border-green-500/20' : 'bg-status-red/10 border-status-red/20'}`}>
              {addResult.success ? (
                <div>
                  <p className="text-sm text-green-400 font-medium">Member added successfully!</p>
                  {addResult.temporary_password && (
                    <div className="mt-2 p-2 bg-bg-primary rounded border border-border">
                      <p className="text-xs text-text-muted mb-1">Temporary password (share with user):</p>
                      <code className="text-sm font-mono text-gold select-all">{addResult.temporary_password}</code>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-status-red">{addResult.error}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bulk Upload */}
      {showBulk && (
        <div className="bg-bg-secondary border border-border rounded-lg p-6 mb-6">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">Bulk Add Members</h2>
          <p className="text-text-muted text-sm mb-4">
            Upload a CSV file with columns: <code className="text-gold">email, first name, last name</code> (header row required)
          </p>
          <div className="flex items-center gap-4">
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              onChange={(e) => setBulkFile(e.target.files?.[0] || null)}
              className="text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-border file:text-sm file:bg-bg-primary file:text-text hover:file:border-gold/30"
            />
            <button
              onClick={handleBulkUpload}
              disabled={!bulkFile || bulking}
              className="px-6 py-2 bg-gold text-bg-primary font-heading text-sm uppercase tracking-wider rounded-md hover:bg-gold-bright transition-colors disabled:opacity-50"
            >
              {bulking ? 'Processing...' : 'Upload & Create'}
            </button>
          </div>

          {bulkResults && (
            <div className="mt-4 space-y-1 max-h-60 overflow-y-auto">
              {bulkResults.map((r, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-3 py-2 rounded text-sm ${r.success ? 'bg-green-500/5' : 'bg-status-red/5'}`}
                >
                  <span className={r.success ? 'text-green-400' : 'text-status-red'}>
                    {r.email}
                  </span>
                  {r.success ? (
                    r.temporary_password ? (
                      <code className="text-xs font-mono text-gold">{r.temporary_password}</code>
                    ) : (
                      <span className="text-xs text-text-muted">Existing user added</span>
                    )
                  ) : (
                    <span className="text-xs text-status-red">{r.error}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Members Table */}
      {loading ? (
        <div className="text-center text-text-muted py-12">Loading members...</div>
      ) : members.length === 0 ? (
        <div className="text-center text-text-muted py-12 bg-bg-secondary border border-border rounded-lg">
          No members yet. Add your first member above.
        </div>
      ) : (
        <div className="bg-bg-secondary border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <SortHeader field="first_name" label="Name" />
                  <SortHeader field="email" label="Email" />
                  <SortHeader field="signup_date" label="Signup Date" />
                  <SortHeader field="resumes_created" label="Resumes" />
                  <SortHeader field="jobs_analyzed" label="Jobs Analyzed" />
                  <SortHeader field="last_active" label="Last Active" />
                </tr>
              </thead>
              <tbody>
                {sortedMembers.map((m) => (
                  <tr key={m.id} className="border-b border-border/50 hover:bg-bg-tertiary/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium">{m.first_name} {m.last_name}</span>
                      {m.role === 'admin' && (
                        <span className="ml-2 text-xs text-gold uppercase font-heading">Admin</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-muted">{m.email}</td>
                    <td className="px-4 py-3 text-text-muted">{new Date(m.signup_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{m.resumes_created}</td>
                    <td className="px-4 py-3">{m.jobs_analyzed}</td>
                    <td className="px-4 py-3 text-text-muted text-xs">
                      {m.last_active ? new Date(m.last_active).toLocaleDateString() : 'Never'}
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
