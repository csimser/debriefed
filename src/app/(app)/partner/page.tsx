'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface OrgData {
  organization: {
    id: string
    name: string
    slug: string
    logo_url: string | null
    primary_color: string | null
    contact_email: string
    plan: string
    max_seats: number
  }
  seats_used: number
  active_this_month: number
}

export default function PartnerOverview() {
  const [data, setData] = useState<OrgData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/partner/org')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-bg-secondary rounded w-64" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-bg-secondary rounded-lg" />
            <div className="h-24 bg-bg-secondary rounded-lg" />
            <div className="h-24 bg-bg-secondary rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!data?.organization) {
    return <div className="text-center py-12 text-status-red">Failed to load organization data</div>
  }

  const org = data.organization
  const seatPercent = org.max_seats > 0 ? Math.round((data.seats_used / org.max_seats) * 100) : 0

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Header with org branding */}
      <div className="flex items-center gap-4 mb-8">
        {org.logo_url ? (
          <img src={org.logo_url} alt="" className="w-14 h-14 rounded-lg object-cover" />
        ) : (
          <div
            className="w-14 h-14 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: org.primary_color ? `${org.primary_color}30` : undefined }}
          >
            <span
              className="font-heading font-bold text-2xl"
              style={{ color: org.primary_color || undefined }}
            >
              {org.name[0]}
            </span>
          </div>
        )}
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wider">{org.name}</h1>
          <p className="text-text-muted text-sm">Partner Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2 mb-8 border-b border-border pb-3">
        <Link href="/partner" className="px-3 py-1.5 text-sm font-heading uppercase tracking-wider text-gold bg-gold/10 rounded-md">
          Overview
        </Link>
        <Link href="/partner/members" className="px-3 py-1.5 text-sm font-heading uppercase tracking-wider text-text-muted hover:text-text rounded-md">
          Members
        </Link>
        <Link href="/partner/settings" className="px-3 py-1.5 text-sm font-heading uppercase tracking-wider text-text-muted hover:text-text rounded-md">
          Settings
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-bg-secondary border border-border rounded-lg p-6">
          <div className="text-text-muted text-xs uppercase tracking-wider font-heading">Seats Used</div>
          <div className="text-3xl font-bold mt-2">
            {data.seats_used} <span className="text-text-muted text-lg">/ {org.max_seats}</span>
          </div>
          <div className="mt-3 w-full bg-bg-tertiary rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${Math.min(seatPercent, 100)}%`,
                backgroundColor: seatPercent >= 90 ? '#ef4444' : (org.primary_color || '#C8A55A'),
              }}
            />
          </div>
          <div className="text-xs text-text-muted mt-1">{seatPercent}% capacity</div>
        </div>

        <div className="bg-bg-secondary border border-border rounded-lg p-6">
          <div className="text-text-muted text-xs uppercase tracking-wider font-heading">Active This Month</div>
          <div className="text-3xl font-bold mt-2">{data.active_this_month}</div>
          <div className="text-xs text-text-muted mt-3">
            {data.seats_used > 0 ? Math.round((data.active_this_month / data.seats_used) * 100) : 0}% engagement rate
          </div>
        </div>

        <div className="bg-bg-secondary border border-border rounded-lg p-6">
          <div className="text-text-muted text-xs uppercase tracking-wider font-heading">Plan</div>
          <div className="text-3xl font-bold mt-2 capitalize">{org.plan}</div>
          <div className="text-xs text-text-muted mt-3">Contact support to upgrade</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/partner/members"
          className="bg-bg-secondary border border-border rounded-lg p-6 hover:border-gold/30 transition-colors group"
        >
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider group-hover:text-gold transition-colors">
            Manage Members
          </h3>
          <p className="text-text-muted text-sm mt-1">
            View, add, and manage your organization&apos;s members
          </p>
        </Link>

        <Link
          href="/partner/settings"
          className="bg-bg-secondary border border-border rounded-lg p-6 hover:border-gold/30 transition-colors group"
        >
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider group-hover:text-gold transition-colors">
            Organization Settings
          </h3>
          <p className="text-text-muted text-sm mt-1">
            Update logo, branding, and contact information
          </p>
        </Link>
      </div>

      {/* White-label link */}
      <div className="mt-8 bg-bg-secondary border border-border rounded-lg p-6">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-2">Share Signup Link</h3>
        <p className="text-text-muted text-sm mb-3">
          Share this link with your cohort members to sign up directly to your organization:
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3 py-2 bg-bg-primary border border-border rounded-md text-sm font-mono text-gold">
            {typeof window !== 'undefined' ? window.location.origin : ''}/join/{org.slug}
          </code>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/join/${org.slug}`)
            }}
            className="px-4 py-2 bg-gold/10 text-gold border border-gold/30 rounded-md text-sm hover:bg-gold/20 transition-colors"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}
