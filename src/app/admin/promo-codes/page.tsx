'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface PromoCode {
  id: string
  code: string
  discount_percent: number
  applies_to: string
  max_uses: number | null
  current_uses: number
  expires_at: string | null
  created_at: string
}

interface Redemption {
  id: string
  code: string
  email: string
  redeemed_at: string
}

const APPLIES_TO_OPTIONS = [
  { value: 'core', label: 'Core Plan' },
  { value: 'full', label: 'Full Plan' },
  { value: 'all', label: 'All Plans' },
]

// Check if code is expired
const isExpired = (expiresAt: string | null): boolean => {
  if (!expiresAt) return false
  return new Date(expiresAt) < new Date()
}

// Check if code is exhausted
const isExhausted = (code: PromoCode): boolean => {
  return code.max_uses !== null && (code.current_uses || 0) >= code.max_uses
}

export default function AdminPromoCodesPage() {
  const [codes, setCodes] = useState<PromoCode[]>([])
  const [redemptions, setRedemptions] = useState<Redemption[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState<PromoCode | null>(null)

  // Create form state
  const [createForm, setCreateForm] = useState({
    code: '',
    discount_percent: '25',
    applies_to: 'all',
    max_uses: '',
    expires_at: '',
  })
  const [createLoading, setCreateLoading] = useState(false)

  // Fetch codes and redemptions
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/promo-codes')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setCodes(data.codes || [])
      setRedemptions(data.recentRedemptions || [])
    } catch (error) {
      console.error('Error fetching promo codes:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Generate random code
  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let newCode = 'SAVE'
    for (let i = 0; i < 6; i++) {
      newCode += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCreateForm({ ...createForm, code: newCode })
  }

  // Copy code to clipboard
  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // Create promo code
  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateLoading(true)
    try {
      const response = await fetch('/api/admin/promo-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: createForm.code.toUpperCase(),
          discount_percent: parseInt(createForm.discount_percent),
          applies_to: createForm.applies_to,
          max_uses: createForm.max_uses ? parseInt(createForm.max_uses) : null,
          expires_at: createForm.expires_at || null,
        }),
      })
      if (response.ok) {
        setShowCreateModal(false)
        setCreateForm({ code: '', discount_percent: '25', applies_to: 'all', max_uses: '', expires_at: '' })
        fetchData()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to create code')
      }
    } catch (error) {
      console.error('Error creating code:', error)
    } finally {
      setCreateLoading(false)
    }
  }

  // Delete code
  const handleDeleteCode = async () => {
    if (!showDeleteModal) return
    try {
      const response = await fetch(`/api/admin/promo-codes/${showDeleteModal.id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setShowDeleteModal(null)
        fetchData()
      }
    } catch (error) {
      console.error('Error deleting code:', error)
    }
  }

  // Get status for a code
  const getCodeStatus = (code: PromoCode) => {
    if (isExpired(code.expires_at)) return { label: 'Expired', variant: 'red' as const }
    if (isExhausted(code)) return { label: 'Exhausted', variant: 'amber' as const }
    return { label: 'Active', variant: 'green' as const }
  }

  // Stats
  const activeCodes = codes.filter(c => !isExhausted(c) && !isExpired(c.expires_at)).length
  const expiredCodes = codes.filter(c => isExpired(c.expires_at)).length
  const exhaustedCodes = codes.filter(c => isExhausted(c)).length
  const totalRedemptions = codes.reduce((sum, c) => sum + (c.current_uses || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-wider">
            Promo Codes
          </h1>
          <p className="text-text-muted">
            {codes.length} total codes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={fetchData} disabled={loading}>
            {loading ? '...' : '↻ Refresh'}
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            + Create Promo Code
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-text-muted text-xs uppercase">Total Codes</p>
          <p className="text-2xl font-bold text-gold">{codes.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-text-muted text-xs uppercase">Active</p>
          <p className="text-2xl font-bold text-status-green">{activeCodes}</p>
        </Card>
        <Card className="p-4">
          <p className="text-text-muted text-xs uppercase">Expired</p>
          <p className="text-2xl font-bold text-status-red">{expiredCodes}</p>
        </Card>
        <Card className="p-4">
          <p className="text-text-muted text-xs uppercase">Exhausted</p>
          <p className="text-2xl font-bold text-status-amber">{exhaustedCodes}</p>
        </Card>
        <Card className="p-4">
          <p className="text-text-muted text-xs uppercase">Total Redemptions</p>
          <p className="text-2xl font-bold text-status-blue">{totalRedemptions}</p>
        </Card>
      </div>

      {/* Codes Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-heading text-lg font-bold uppercase">All Promo Codes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-navy/30 border-b border-navy/50">
              <tr className="text-left text-xs text-text-muted uppercase">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Applies To</th>
                <th className="px-4 py-3">Usage</th>
                <th className="px-4 py-3">Expires At</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-text-muted">
                    Loading codes...
                  </td>
                </tr>
              ) : codes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-text-muted">
                    No promo codes found. Create one to get started.
                  </td>
                </tr>
              ) : (
                codes.map((code, index) => {
                  const status = getCodeStatus(code)
                  return (
                    <tr
                      key={code.id}
                      className={`border-b border-border/50 hover:bg-gold-dim/10 transition-colors ${
                        index % 2 === 0 ? 'bg-bg-secondary/30' : 'bg-bg-tertiary/30'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => copyCode(code.code)}
                          className="font-mono text-sm bg-bg-tertiary px-2 py-1 rounded hover:bg-gold/20 transition-colors flex items-center gap-2"
                          title="Click to copy"
                        >
                          {code.code}
                          {copiedCode === code.code ? (
                            <span className="text-status-green text-xs">Copied</span>
                          ) : (
                            <span className="text-text-dim text-xs">Copy</span>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gold font-bold">{code.discount_percent}% off</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            code.applies_to === 'full'
                              ? 'gold'
                              : code.applies_to === 'core'
                              ? 'green'
                              : 'default'
                          }
                        >
                          {code.applies_to === 'all' ? 'All Plans' : code.applies_to.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className={`text-sm ${isExhausted(code) ? 'text-status-red' : ''}`}>
                            {code.current_uses || 0} / {code.max_uses ?? '∞'}
                          </span>
                          {code.max_uses && (
                            <div className="w-20 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${
                                  isExhausted(code)
                                    ? 'bg-status-red'
                                    : (code.current_uses || 0) > 0
                                    ? 'bg-gold'
                                    : 'bg-status-green'
                                }`}
                                style={{ width: `${Math.min(((code.current_uses || 0) / code.max_uses) * 100, 100)}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-muted">
                        {code.expires_at
                          ? new Date(code.expires_at).toLocaleDateString()
                          : <span className="text-text-dim">Never</span>
                        }
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-muted">
                        {new Date(code.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setShowDeleteModal(code)}
                          className="text-xs text-status-red hover:text-status-red transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Redemptions */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-heading text-lg font-bold uppercase">Recent Redemptions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-navy/30 border-b border-navy/50">
              <tr className="text-left text-xs text-text-muted uppercase">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">User Email</th>
                <th className="px-4 py-3">Redeemed At</th>
              </tr>
            </thead>
            <tbody>
              {redemptions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-text-muted">
                    No redemptions yet
                  </td>
                </tr>
              ) : (
                redemptions.map((r, index) => (
                  <tr
                    key={r.id}
                    className={`border-b border-border/50 ${
                      index % 2 === 0 ? 'bg-bg-secondary/30' : 'bg-bg-tertiary/30'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <code className="text-sm bg-bg-tertiary px-2 py-1 rounded">
                        {r.code}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">{r.email}</td>
                    <td className="px-4 py-3 text-sm text-text-muted">
                      {new Date(r.redeemed_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Code Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="font-heading text-xl font-bold uppercase mb-4">Create Promo Code</h2>
            <form onSubmit={handleCreateCode} className="space-y-4">
              <div>
                <label className="block text-xs text-text-muted uppercase mb-1">Code</label>
                <div className="flex gap-2">
                  <Input
                    value={createForm.code}
                    onChange={(e) => setCreateForm({ ...createForm, code: e.target.value.toUpperCase() })}
                    placeholder="SAVE25"
                    className="flex-1 font-mono"
                    required
                  />
                  <Button type="button" variant="secondary" onClick={generateCode}>
                    Generate
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-text-muted uppercase mb-1">
                  Discount Percent: {createForm.discount_percent}%
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={createForm.discount_percent}
                    onChange={(e) => setCreateForm({ ...createForm, discount_percent: e.target.value })}
                    className="flex-1 h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer accent-gold"
                  />
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={createForm.discount_percent}
                    onChange={(e) => setCreateForm({ ...createForm, discount_percent: e.target.value })}
                    className="w-20 text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-text-muted uppercase mb-1">Applies To</label>
                <select
                  value={createForm.applies_to}
                  onChange={(e) => setCreateForm({ ...createForm, applies_to: e.target.value })}
                  className="w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
                >
                  {APPLIES_TO_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-text-muted uppercase mb-1">
                  Max Uses <span className="text-text-dim">(leave blank for unlimited)</span>
                </label>
                <Input
                  type="number"
                  min="1"
                  value={createForm.max_uses}
                  onChange={(e) => setCreateForm({ ...createForm, max_uses: e.target.value })}
                  placeholder="Unlimited"
                />
              </div>

              <div>
                <label className="block text-xs text-text-muted uppercase mb-1">
                  Expiration <span className="text-text-dim">(optional)</span>
                </label>
                <Input
                  type="date"
                  value={createForm.expires_at}
                  onChange={(e) => setCreateForm({ ...createForm, expires_at: e.target.value })}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createLoading || !createForm.code} className="flex-1">
                  {createLoading ? 'Creating...' : 'Create Code'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm p-6">
            <h2 className="font-heading text-xl font-bold uppercase mb-4 text-status-red">Delete Promo Code</h2>
            <p className="text-text-muted mb-4">
              Are you sure you want to delete the code{' '}
              <code className="bg-bg-tertiary px-2 py-1 rounded">{showDeleteModal.code}</code>?
            </p>
            <p className="text-sm text-text-dim mb-6">
              This code has been used {showDeleteModal.current_uses || 0} time(s) for {showDeleteModal.discount_percent}% off.
              This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteCode}
                className="flex-1 bg-status-red hover:bg-status-red/90"
              >
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
