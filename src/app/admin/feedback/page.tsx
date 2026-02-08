'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface Feedback {
  id: string
  user_id: string
  type: string | null
  message: string
  page_url: string | null
  status: string | null
  admin_notes: string | null
  admin_response: string | null
  created_at: string
  updated_at: string
  user_email: string
  email: string | null
  category: string | null
}

interface Counts {
  all: number
  new: number
  reviewed: number
  resolved: number
}

const STATUS_TABS = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'resolved', label: 'Resolved' },
]

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'general', label: 'General' },
]

const DEFAULT_BADGE = { label: 'Unknown', variant: 'default' as const }

const TYPE_BADGES: Record<string, { label: string; variant: 'red' | 'default' | 'green' | 'gold' | 'amber' }> = {
  bug: { label: 'Bug', variant: 'red' },
  feature: { label: 'Feature', variant: 'default' },
  general: { label: 'General', variant: 'amber' },
  suggestion: { label: 'Suggestion', variant: 'gold' },
  question: { label: 'Question', variant: 'default' },
  other: { label: 'Other', variant: 'default' },
}

const STATUS_BADGES: Record<string, { label: string; variant: 'red' | 'default' | 'green' | 'gold' | 'amber' }> = {
  new: { label: 'New', variant: 'amber' },
  pending: { label: 'Pending', variant: 'amber' },
  reviewed: { label: 'Reviewed', variant: 'default' },
  in_progress: { label: 'In Progress', variant: 'gold' },
  resolved: { label: 'Resolved', variant: 'green' },
  closed: { label: 'Closed', variant: 'default' },
}

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [counts, setCounts] = useState<Counts>({ all: 0, new: 0, reviewed: 0, resolved: 0 })
  const [loading, setLoading] = useState(true)

  // Filters
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  // Expanded notes state
  const [expandedNotes, setExpandedNotes] = useState<string | null>(null)
  const [notesInput, setNotesInput] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)

  // Reply state
  const [expandedReply, setExpandedReply] = useState<string | null>(null)
  const [replyInput, setReplyInput] = useState('')
  const [savingReply, setSavingReply] = useState(false)

  // Deleting state
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Fetch feedback
  const fetchFeedback = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        type: typeFilter,
        sort: sortOrder,
      })
      const response = await fetch(`/api/admin/feedback?${params}`)
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setFeedback(data.feedback || [])
      setCounts(data.counts || { all: 0, new: 0, reviewed: 0, resolved: 0 })
    } catch (error) {
      console.error('Error fetching feedback:', error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, typeFilter, sortOrder])

  useEffect(() => {
    fetchFeedback()
  }, [fetchFeedback])

  // Update feedback status
  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (response.ok) {
        fetchFeedback()
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  // Save admin notes
  const saveNotes = async (id: string) => {
    setSavingNotes(true)
    try {
      const response = await fetch(`/api/admin/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: notesInput }),
      })
      if (response.ok) {
        setExpandedNotes(null)
        fetchFeedback()
      }
    } catch (error) {
      console.error('Error saving notes:', error)
    } finally {
      setSavingNotes(false)
    }
  }

  // Toggle notes expansion
  const toggleNotes = (item: Feedback) => {
    if (expandedNotes === item.id) {
      setExpandedNotes(null)
    } else {
      setExpandedNotes(item.id)
      setNotesInput(item.admin_notes || '')
    }
  }

  // Delete feedback
  const deleteFeedback = async (id: string) => {
    if (!confirm('Delete this feedback permanently? This cannot be undone.')) return
    setDeletingId(id)
    try {
      const response = await fetch(`/api/admin/feedback/${id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchFeedback()
      } else {
        alert('Failed to delete feedback')
      }
    } catch (error) {
      console.error('Error deleting feedback:', error)
      alert('Failed to delete feedback')
    } finally {
      setDeletingId(null)
    }
  }

  // Toggle reply expansion
  const toggleReply = (item: Feedback) => {
    if (expandedReply === item.id) {
      setExpandedReply(null)
    } else {
      setExpandedReply(item.id)
      setReplyInput(item.admin_response || '')
    }
  }

  // Save admin reply
  const saveReply = async (id: string) => {
    setSavingReply(true)
    try {
      const response = await fetch(`/api/admin/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_response: replyInput }),
      })
      if (response.ok) {
        setExpandedReply(null)
        fetchFeedback()
      }
    } catch (error) {
      console.error('Error saving reply:', error)
    } finally {
      setSavingReply(false)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-wider">
            Feedback Inbox
          </h1>
          <p className="text-text-muted">
            {counts.new} new, {counts.all} total
          </p>
        </div>
        <Button variant="secondary" onClick={fetchFeedback} disabled={loading}>
          {loading ? '...' : '↻ Refresh'}
        </Button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === tab.value
                  ? 'bg-gold text-bg-primary'
                  : 'bg-bg-secondary text-text-muted hover:bg-bg-tertiary'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                statusFilter === tab.value ? 'bg-black/20' : 'bg-bg-tertiary'
              }`}>
                {counts[tab.value as keyof Counts]}
              </span>
            </button>
          ))}
        </div>

        {/* Type Filter & Sort */}
        <div className="flex gap-2 ml-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-bg-secondary border border-border rounded-md px-3 py-2 text-sm text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
            className="bg-bg-secondary border border-border rounded-md px-3 py-2 text-sm text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {loading ? (
          <Card className="p-12 text-center">
            <p className="text-text-muted">Loading feedback...</p>
          </Card>
        ) : feedback.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-2">
              No Feedback
            </h2>
            <p className="text-text-muted text-sm">
              {statusFilter === 'all'
                ? 'No feedback has been submitted yet.'
                : `No ${statusFilter} feedback found.`}
            </p>
          </Card>
        ) : (
          feedback.map((item) => {
            const typeBadge = (item.type && TYPE_BADGES[item.type]) || DEFAULT_BADGE
            const statusBadge = (item.status && STATUS_BADGES[item.status]) || DEFAULT_BADGE
            const isExpanded = expandedNotes === item.id

            return (
              <Card key={item.id} className="overflow-hidden">
                <div className="p-4 md:p-6">
                  {/* Header Row */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={typeBadge.variant}>{typeBadge.label}</Badge>
                      <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                    </div>
                    <span className="text-xs text-text-dim">
                      {formatDate(item.created_at)}
                    </span>
                  </div>

                  {/* User & Page Info */}
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-text-muted">From:</span>
                      {item.user_id ? (
                        <Link
                          href={`/admin/users/${item.user_id}`}
                          className="text-gold hover:underline font-mono"
                        >
                          {item.user_email || item.email || 'Unknown'}
                        </Link>
                      ) : (
                        <span className="font-mono text-text-muted">
                          {item.user_email || item.email || 'Anonymous'}
                        </span>
                      )}
                    </div>
                    {item.page_url && (
                      <div className="flex items-center gap-2 md:ml-4">
                        <span className="text-text-muted">Page:</span>
                        <code className="text-xs bg-bg-tertiary px-2 py-0.5 rounded truncate max-w-[200px]">
                          {item.page_url}
                        </code>
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <div className="bg-bg-secondary/50 rounded-md p-4 mb-4">
                    <p className="text-text whitespace-pre-wrap">{item.message}</p>
                  </div>

                  {/* Admin Response (visible to user) */}
                  {item.admin_response && expandedReply !== item.id && (
                    <div className="bg-status-green/5 border border-status-green/20 rounded-md p-3 mb-4">
                      <p className="text-xs text-status-green uppercase mb-1">Admin Reply (visible to user)</p>
                      <p className="text-sm text-text whitespace-pre-wrap">{item.admin_response}</p>
                    </div>
                  )}

                  {/* Admin Notes (internal, if exists and not expanded) */}
                  {item.admin_notes && !isExpanded && (
                    <div className="bg-[#1a365d]/20 border border-[#1a365d]/30 rounded-md p-3 mb-4">
                      <p className="text-xs text-text-muted uppercase mb-1">Admin Notes (internal)</p>
                      <p className="text-sm text-text-muted whitespace-pre-wrap">{item.admin_notes}</p>
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center gap-2">
                    {(item.status === 'new' || item.status === 'pending' || !item.status) && (
                      <Button
                        variant="secondary"
                        onClick={() => updateStatus(item.id, 'reviewed')}
                        className="text-sm"
                      >
                        Mark as Reviewed
                      </Button>
                    )}
                    {(item.status === 'new' || item.status === 'pending' || item.status === 'reviewed' || item.status === 'in_progress' || !item.status) && (
                      <Button
                        variant="secondary"
                        onClick={() => updateStatus(item.id, 'resolved')}
                        className="text-sm"
                      >
                        Mark as Resolved
                      </Button>
                    )}
                    {(item.status === 'resolved' || item.status === 'closed') && (
                      <Button
                        variant="secondary"
                        onClick={() => updateStatus(item.id, 'new')}
                        className="text-sm"
                      >
                        Reopen
                      </Button>
                    )}
                    <button
                      onClick={() => toggleReply(item)}
                      className="text-sm text-status-green hover:text-status-green/80 transition-colors"
                    >
                      {expandedReply === item.id ? 'Cancel Reply' : item.admin_response ? 'Edit Reply' : 'Reply'}
                    </button>
                    <button
                      onClick={() => toggleNotes(item)}
                      className="text-sm text-text-muted hover:text-gold transition-colors"
                    >
                      {isExpanded ? 'Cancel' : item.admin_notes ? 'Edit Notes' : 'Add Notes'}
                    </button>
                    <button
                      onClick={() => deleteFeedback(item.id)}
                      disabled={deletingId === item.id}
                      className="text-sm text-status-red/70 hover:text-status-red transition-colors ml-auto"
                    >
                      {deletingId === item.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>

                  {/* Expanded Reply Editor */}
                  {expandedReply === item.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <label className="block text-xs text-status-green uppercase mb-2">
                        Reply to User
                      </label>
                      <textarea
                        value={replyInput}
                        onChange={(e) => setReplyInput(e.target.value)}
                        placeholder="Write a response that the user will see..."
                        rows={3}
                        className="w-full bg-bg-secondary border border-status-green/30 rounded-md px-4 py-3 text-text focus:border-status-green focus:ring-1 focus:ring-status-green/25 resize-none"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <Button
                          variant="secondary"
                          onClick={() => setExpandedReply(null)}
                          className="text-sm"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => saveReply(item.id)}
                          disabled={savingReply}
                          className="text-sm"
                        >
                          {savingReply ? 'Saving...' : 'Save Reply'}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Expanded Notes Editor */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <label className="block text-xs text-text-muted uppercase mb-2">
                        Admin Notes (internal only)
                      </label>
                      <textarea
                        value={notesInput}
                        onChange={(e) => setNotesInput(e.target.value)}
                        placeholder="Add internal notes about this feedback..."
                        rows={3}
                        className="w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-text focus:border-gold focus:ring-1 focus:ring-gold/25 resize-none"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <Button
                          variant="secondary"
                          onClick={() => setExpandedNotes(null)}
                          className="text-sm"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => saveNotes(item.id)}
                          disabled={savingNotes}
                          className="text-sm"
                        >
                          {savingNotes ? 'Saving...' : 'Save Notes'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
