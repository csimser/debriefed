'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface BetaCode {
  id: string
  code: string
  used: boolean
  used_by: string | null
  used_by_email: string | null
  used_at: string | null
  created_at: string
  revoked: boolean
  revoked_at: string | null
  revoked_reason: string | null
}

export default function AdminBetaCodesPage() {
  const [codes, setCodes] = useState<BetaCode[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState<BetaCode | null>(null)
  const [showRevokeModal, setShowRevokeModal] = useState<BetaCode | null>(null)
  const [revokeReason, setRevokeReason] = useState('')
  const [revokeLoading, setRevokeLoading] = useState(false)
  const [deleteWithRevoke, setDeleteWithRevoke] = useState(false)

  // Create form state
  const [createForm, setCreateForm] = useState({ code: '' })
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  // Bulk form state
  const [bulkForm, setBulkForm] = useState({ count: '10' })
  const [bulkLoading, setBulkLoading] = useState(false)
  const [bulkResult, setBulkResult] = useState<string[] | null>(null)
  const [bulkError, setBulkError] = useState<string | null>(null)

  // Fetch codes
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/beta-codes')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setCodes(data.codes || [])
    } catch (error) {
      console.error('Error fetching beta codes:', error)
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
    let newCode = 'BETA-'
    for (let i = 0; i < 8; i++) {
      newCode += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCreateForm({ code: newCode })
  }

  // Copy code to clipboard
  const copyCode = async (code: string) => {
    const { copyToClipboard } = await import('@/lib/clipboard')
    await copyToClipboard(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // Create single code
  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateLoading(true)
    setCreateError(null)
    try {
      console.log('Creating beta code with:', createForm.code || '(auto-generate)')
      const response = await fetch('/api/admin/beta-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: createForm.code.toUpperCase() || null,
        }),
      })
      const data = await response.json()
      console.log('API response:', response.status, data)

      if (response.ok) {
        setShowCreateModal(false)
        setCreateForm({ code: '' })
        setCreateError(null)
        fetchData()
      } else {
        const errorMsg = data.error || 'Failed to create code'
        console.error('Create code error:', errorMsg)
        setCreateError(errorMsg)
      }
    } catch (error) {
      console.error('Error creating code:', error)
      setCreateError('Network error - please try again')
    } finally {
      setCreateLoading(false)
    }
  }

  // Create bulk codes
  const handleBulkCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setBulkLoading(true)
    setBulkResult(null)
    setBulkError(null)
    try {
      console.log('Creating bulk beta codes:', bulkForm.count)
      const response = await fetch('/api/admin/beta-codes/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: parseInt(bulkForm.count),
        }),
      })
      const data = await response.json()
      console.log('Bulk API response:', response.status, data)

      if (response.ok) {
        setBulkResult(data.codes.map((c: BetaCode) => c.code))
        setBulkError(null)
        fetchData()
      } else {
        const errorMsg = data.error || 'Failed to create codes'
        console.error('Bulk create error:', errorMsg)
        setBulkError(errorMsg)
      }
    } catch (error) {
      console.error('Error creating bulk codes:', error)
      setBulkError('Network error - please try again')
    } finally {
      setBulkLoading(false)
    }
  }

  // Delete code
  const handleDeleteCode = async () => {
    if (!showDeleteModal) return
    try {
      const url = deleteWithRevoke
        ? `/api/admin/beta-codes/${showDeleteModal.id}?revoke=true`
        : `/api/admin/beta-codes/${showDeleteModal.id}`
      const response = await fetch(url, {
        method: 'DELETE',
      })
      if (response.ok) {
        setShowDeleteModal(null)
        setDeleteWithRevoke(false)
        fetchData()
      }
    } catch (error) {
      console.error('Error deleting code:', error)
    }
  }

  // Revoke or reinstate code
  const handleRevokeCode = async (action: 'revoke' | 'reinstate') => {
    if (!showRevokeModal) return
    setRevokeLoading(true)
    try {
      const response = await fetch('/api/admin/beta-codes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codeId: showRevokeModal.id,
          action,
          reason: revokeReason || undefined,
        }),
      })
      if (response.ok) {
        setShowRevokeModal(null)
        setRevokeReason('')
        fetchData()
      }
    } catch (error) {
      console.error('Error revoking code:', error)
    } finally {
      setRevokeLoading(false)
    }
  }

  // Copy all bulk codes
  const copyAllBulkCodes = async () => {
    if (!bulkResult) return
    const { copyToClipboard } = await import('@/lib/clipboard')
    await copyToClipboard(bulkResult.join('\n'))
    setCopiedCode('all')
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // Stats
  const totalCodes = codes.length
  const usedCodes = codes.filter(c => c.used && !c.revoked).length
  const availableCodes = codes.filter(c => !c.used && !c.revoked).length
  const revokedCodes = codes.filter(c => c.revoked).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-wider">
            Access Codes
          </h1>
          <p className="text-text-muted">
            {totalCodes} total codes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowCreateModal(true)}>
            + Create Code
          </Button>
          <Button onClick={() => setShowBulkModal(true)}>
            ++ Bulk Generate
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-text-muted text-xs uppercase">Total Codes</p>
          <p className="text-2xl font-bold text-gold">{totalCodes}</p>
        </Card>
        <Card className="p-4">
          <p className="text-text-muted text-xs uppercase">Available</p>
          <p className="text-2xl font-bold text-status-green">{availableCodes}</p>
        </Card>
        <Card className="p-4">
          <p className="text-text-muted text-xs uppercase">Used</p>
          <p className="text-2xl font-bold text-status-blue">{usedCodes}</p>
        </Card>
        <Card className="p-4">
          <p className="text-text-muted text-xs uppercase">Revoked</p>
          <p className="text-2xl font-bold text-status-red">{revokedCodes}</p>
        </Card>
      </div>

      {/* Codes Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="font-heading text-lg font-bold uppercase">All Codes</h2>
          <Button variant="secondary" size="sm" onClick={fetchData} disabled={loading}>
            {loading ? '...' : 'Refresh'}
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-navy/30 border-b border-navy/50">
              <tr className="text-left text-xs text-text-muted uppercase">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Used By</th>
                <th className="px-4 py-3">Used At</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-text-muted">
                    Loading codes...
                  </td>
                </tr>
              ) : codes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-text-muted">
                    No codes found
                  </td>
                </tr>
              ) : (
                codes.map((code, index) => (
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
                      {code.revoked ? (
                        <Badge variant="red">Revoked</Badge>
                      ) : code.used ? (
                        <Badge variant="default">Used</Badge>
                      ) : (
                        <Badge variant="green">Available</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {code.used_by_email ? (
                        <span className="font-mono text-text-muted">{code.used_by_email}</span>
                      ) : (
                        <span className="text-text-dim">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-muted">
                      {code.used_at
                        ? new Date(code.used_at).toLocaleDateString()
                        : <span className="text-text-dim">—</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-sm text-text-muted">
                      {new Date(code.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {code.used && !code.revoked && (
                          <button
                            onClick={() => setShowRevokeModal(code)}
                            className="text-xs text-status-amber hover:text-status-amber transition-colors"
                          >
                            Revoke
                          </button>
                        )}
                        {code.revoked && (
                          <button
                            onClick={() => setShowRevokeModal(code)}
                            className="text-xs text-status-green hover:text-status-green transition-colors"
                          >
                            Reinstate
                          </button>
                        )}
                        <button
                          onClick={() => setShowDeleteModal(code)}
                          className="text-xs text-status-red hover:text-status-red transition-colors"
                        >
                          Delete
                        </button>
                      </div>
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
            <h2 className="font-heading text-xl font-bold uppercase mb-4">Create Access Code</h2>
            <form onSubmit={handleCreateCode} className="space-y-4">
              <div>
                <label className="block text-xs text-text-muted uppercase mb-1">Code (optional - will auto-generate)</label>
                <div className="flex gap-2">
                  <Input
                    value={createForm.code}
                    onChange={(e) => setCreateForm({ code: e.target.value.toUpperCase() })}
                    placeholder="CODE-XXXXXXXX"
                    className="flex-1 font-mono"
                  />
                  <Button type="button" variant="secondary" onClick={generateCode}>
                    Generate
                  </Button>
                </div>
              </div>

              {createError && (
                <div className="bg-status-red/30 border border-status-red/50 rounded-md p-3">
                  <p className="text-sm text-status-red">{createError}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => { setShowCreateModal(false); setCreateError(null); }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createLoading} className="flex-1">
                  {createLoading ? 'Creating...' : 'Create Code'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Bulk Generate Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="font-heading text-xl font-bold uppercase mb-4">Bulk Generate Codes</h2>

            {bulkResult ? (
              <div className="space-y-4">
                <p className="text-status-green">Successfully created {bulkResult.length} codes:</p>
                <div className="bg-bg-tertiary rounded-md p-3 max-h-60 overflow-y-auto">
                  <pre className="text-sm font-mono">
                    {bulkResult.join('\n')}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={copyAllBulkCodes} className="flex-1">
                    {copiedCode === 'all' ? 'Copied!' : 'Copy All'}
                  </Button>
                  <Button onClick={() => { setShowBulkModal(false); setBulkResult(null); }} className="flex-1">
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBulkCreate} className="space-y-4">
                <div>
                  <label className="block text-xs text-text-muted uppercase mb-1">Number of Codes (1-100)</label>
                  <Input
                    type="number"
                    value={bulkForm.count}
                    onChange={(e) => setBulkForm({ count: e.target.value })}
                    min="1"
                    max="100"
                    required
                  />
                </div>

                {bulkError && (
                  <div className="bg-status-red/30 border border-status-red/50 rounded-md p-3">
                    <p className="text-sm text-status-red">{bulkError}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => { setShowBulkModal(false); setBulkError(null); }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={bulkLoading} className="flex-1">
                    {bulkLoading ? 'Generating...' : `Generate ${bulkForm.count} Codes`}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm p-6">
            <h2 className="font-heading text-xl font-bold uppercase mb-4 text-status-red">Delete Code</h2>
            <p className="text-text-muted mb-4">
              Are you sure you want to delete the code <code className="bg-bg-tertiary px-2 py-1 rounded">{showDeleteModal.code}</code>?
            </p>
            {showDeleteModal.used && !showDeleteModal.revoked && (
              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deleteWithRevoke}
                    onChange={(e) => setDeleteWithRevoke(e.target.checked)}
                    className="w-4 h-4 rounded border-border bg-bg-tertiary"
                  />
                  <span className="text-sm text-status-amber">
                    Also revoke user access (downgrade to free tier)
                  </span>
                </label>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => { setShowDeleteModal(null); setDeleteWithRevoke(false); }}
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

      {/* Revoke/Reinstate Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm p-6">
            <h2 className="font-heading text-xl font-bold uppercase mb-4 text-status-amber">
              {showRevokeModal.revoked ? 'Reinstate Code' : 'Revoke Code'}
            </h2>
            <p className="text-text-muted mb-4">
              {showRevokeModal.revoked ? (
                <>Reinstate the code <code className="bg-bg-tertiary px-2 py-1 rounded">{showRevokeModal.code}</code>?</>
              ) : (
                <>Revoke the code <code className="bg-bg-tertiary px-2 py-1 rounded">{showRevokeModal.code}</code>?</>
              )}
            </p>
            {!showRevokeModal.revoked && showRevokeModal.used_by_email && (
              <p className="text-sm text-status-amber mb-4">
                User <span className="font-mono">{showRevokeModal.used_by_email}</span> will be downgraded to free tier.
              </p>
            )}
            {!showRevokeModal.revoked && (
              <div className="mb-4">
                <label className="block text-xs text-text-muted uppercase mb-1">Reason (optional)</label>
                <Input
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  placeholder="Reason for revoking..."
                />
              </div>
            )}
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => { setShowRevokeModal(null); setRevokeReason(''); }}
                className="flex-1"
                disabled={revokeLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleRevokeCode(showRevokeModal.revoked ? 'reinstate' : 'revoke')}
                className={`flex-1 ${showRevokeModal.revoked ? 'bg-status-green hover:bg-status-green/90' : 'bg-status-amber hover:bg-status-amber/90'}`}
                disabled={revokeLoading}
              >
                {revokeLoading ? '...' : showRevokeModal.revoked ? 'Reinstate' : 'Revoke'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
