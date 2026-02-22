'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface Testimonial {
  id: string
  user_id: string
  user_email: string
  rating: number
  comment: string | null
  testimonial_consent: boolean
  feature_context: string
  status: string
  featured: boolean
  created_at: string
}

interface Counts {
  all: number
  pending: number
  approved: number
  rejected: number
}

const STATUS_TABS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

const STATUS_BADGES: Record<string, { label: string; variant: 'amber' | 'green' | 'red' | 'default' }> = {
  pending: { label: 'Pending', variant: 'amber' },
  approved: { label: 'Approved', variant: 'green' },
  rejected: { label: 'Rejected', variant: 'red' },
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? 'text-gold' : 'text-text-dim/30'}>
          {star <= rating ? '★' : '☆'}
        </span>
      ))}
    </span>
  )
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [counts, setCounts] = useState<Counts>({ all: 0, pending: 0, approved: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchTestimonials = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ status: statusFilter, sort: sortOrder })
      const response = await fetch(`/api/admin/testimonials?${params}`)
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setTestimonials(data.testimonials || [])
      setCounts(data.counts || { all: 0, pending: 0, approved: 0, rejected: 0 })
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, sortOrder])

  useEffect(() => {
    fetchTestimonials()
  }, [fetchTestimonials])

  const updateTestimonial = async (id: string, updates: { status?: string; featured?: boolean }) => {
    setUpdatingId(id)
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (response.ok) {
        fetchTestimonials()
      }
    } catch (error) {
      console.error('Error updating testimonial:', error)
    } finally {
      setUpdatingId(null)
    }
  }

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
            Testimonials
          </h1>
          <p className="text-text-muted">
            {counts.pending} pending, {counts.approved} approved, {counts.all} total
          </p>
        </div>
        <Button variant="secondary" onClick={fetchTestimonials} disabled={loading}>
          {loading ? '...' : '↻ Refresh'}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
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

        <div className="ml-auto">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
            className="bg-bg-secondary border border-border rounded-md px-3 py-2 text-sm text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
            autoComplete="off"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>

      {/* Testimonial List */}
      <div className="space-y-4">
        {loading ? (
          <Card className="p-12 text-center">
            <p className="text-text-muted">Loading testimonials...</p>
          </Card>
        ) : testimonials.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-4xl mb-4">★</div>
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-2">
              No Testimonials
            </h2>
            <p className="text-text-muted text-sm">
              {statusFilter === 'all'
                ? 'No testimonials have been submitted yet.'
                : `No ${statusFilter} testimonials found.`}
            </p>
          </Card>
        ) : (
          testimonials.map((item) => {
            const statusBadge = STATUS_BADGES[item.status] || STATUS_BADGES.pending
            const isUpdating = updatingId === item.id

            return (
              <Card key={item.id} className="overflow-hidden">
                <div className="p-4 md:p-6">
                  {/* Header Row */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                      {item.featured && (
                        <Badge variant="gold">Featured</Badge>
                      )}
                      {item.testimonial_consent && (
                        <Badge variant="default">Consented</Badge>
                      )}
                      <span className="text-sm"><StarRating rating={item.rating} /></span>
                    </div>
                    <span className="text-xs text-text-dim">
                      {formatDate(item.created_at)}
                    </span>
                  </div>

                  {/* User & Context */}
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-text-muted">From:</span>
                      <Link
                        href={`/admin/users/${item.user_id}`}
                        className="text-gold hover:underline font-mono"
                      >
                        {item.user_email}
                      </Link>
                    </div>
                    {item.feature_context && (
                      <div className="flex items-center gap-2 md:ml-4">
                        <span className="text-text-muted">Context:</span>
                        <code className="text-xs bg-bg-tertiary px-2 py-0.5 rounded">
                          {item.feature_context}
                        </code>
                      </div>
                    )}
                  </div>

                  {/* Comment */}
                  {item.comment ? (
                    <div className="bg-bg-secondary/50 rounded-md p-4 mb-4">
                      <p className="text-text whitespace-pre-wrap">{item.comment}</p>
                    </div>
                  ) : (
                    <div className="bg-bg-secondary/50 rounded-md p-4 mb-4">
                      <p className="text-text-dim italic">No comment provided (rating only)</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    {item.status !== 'approved' && (
                      <Button
                        variant="secondary"
                        onClick={() => updateTestimonial(item.id, { status: 'approved' })}
                        disabled={isUpdating}
                        className="text-sm"
                      >
                        Approve
                      </Button>
                    )}
                    {item.status !== 'rejected' && (
                      <Button
                        variant="secondary"
                        onClick={() => updateTestimonial(item.id, { status: 'rejected' })}
                        disabled={isUpdating}
                        className="text-sm"
                      >
                        Reject
                      </Button>
                    )}
                    {item.status === 'approved' && (
                      <Button
                        variant="secondary"
                        onClick={() => updateTestimonial(item.id, { status: 'pending' })}
                        disabled={isUpdating}
                        className="text-sm"
                      >
                        Revert to Pending
                      </Button>
                    )}

                    {/* Featured toggle */}
                    <button
                      onClick={() => updateTestimonial(item.id, { featured: !item.featured })}
                      disabled={isUpdating}
                      className={`ml-auto text-sm px-3 py-1.5 rounded-md border transition-colors ${
                        item.featured
                          ? 'border-gold bg-gold/10 text-gold hover:bg-gold/20'
                          : 'border-border text-text-muted hover:text-gold hover:border-gold/50'
                      }`}
                    >
                      {item.featured ? '★ Featured' : '☆ Feature'}
                    </button>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
