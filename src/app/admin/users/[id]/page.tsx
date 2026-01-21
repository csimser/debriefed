'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'

interface UserProfile {
  id: string
  user_id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  city: string | null
  state: string | null
  zip: string | null
  linkedin_url: string | null
  branch: string | null
  rank: string | null
  paygrade: string | null
  rating_mos: string | null
  years_of_service: number | null
  clearance: string | null
  eas_date: string | null
  skillbridge_start: string | null
  skillbridge_end: string | null
  tier: string | null
  is_admin: boolean
  suspended: boolean | null
  suspend_reason: string | null
  suspended_at: string | null
  onboarding_completed: boolean
  professional_summary: string | null
  target_industry: string | null
  target_role: string | null
  created_at: string
  updated_at: string
}

interface Resume {
  id: string
  name: string
  template: string
  resume_type: string
  created_at: string
  updated_at: string
}

interface ActivityLogEntry {
  id: string
  action: string
  details: Record<string, any>
  created_at: string
}

interface ApiUsageEntry {
  id: string
  endpoint: string
  tokens_used: number
  model: string
  created_at: string
}

interface UsageStats {
  resumes_created: number
  resumes_downloaded: number
  cover_letters: number
  job_matches: number
  eval_uploads: number
  bullet_rewrites: number
  ai_summaries: number
  private_downloads: number
  federal_downloads: number
}

const TIER_OPTIONS = [
  { value: 'free', label: 'Free' },
  { value: 'core', label: 'Core ($35/30 days)' },
  { value: 'full', label: 'Full ($75/90 days)' },
]

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([])
  const [apiUsage, setApiUsage] = useState<ApiUsageEntry[]>([])
  const [totalTokensUsed, setTotalTokensUsed] = useState(0)
  const [usageStats, setUsageStats] = useState<UsageStats>({
    resumes_created: 0,
    resumes_downloaded: 0,
    cover_letters: 0,
    job_matches: 0,
    eval_uploads: 0,
    bullet_rewrites: 0,
    ai_summaries: 0,
    private_downloads: 0,
    federal_downloads: 0,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [suspendReason, setSuspendReason] = useState('')

  // Unwrap params
  useEffect(() => {
    params.then(p => setUserId(p.id))
  }, [params])

  // Fetch user data
  useEffect(() => {
    if (!userId) return

    const fetchUser = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/admin/users/${userId}`)
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/admin/users')
            return
          }
          throw new Error('Failed to fetch user')
        }

        const data = await response.json()
        setUser(data.user)
        setResumes(data.resumes)
        setActivityLog(data.activityLog)
        setApiUsage(data.apiUsage || [])
        setTotalTokensUsed(data.totalTokensUsed || 0)
        setUsageStats(data.usageStats || {
          resumes_created: 0,
          resumes_downloaded: 0,
          cover_letters: 0,
          job_matches: 0,
          eval_uploads: 0,
          bullet_rewrites: 0,
          ai_summaries: 0,
          private_downloads: 0,
          federal_downloads: 0,
        })
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId, router])

  // Update tier
  const handleTierChange = async (newTier: string) => {
    if (!user) return
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: newTier }),
      })

      if (response.ok) {
        setUser({ ...user, tier: newTier })
      }
    } catch (error) {
      console.error('Error updating tier:', error)
    } finally {
      setSaving(false)
    }
  }

  // Toggle admin role
  const handleToggleAdmin = async () => {
    if (!user) return

    const confirmMessage = user.is_admin
      ? 'Are you sure you want to remove admin privileges from this user?'
      : 'Are you sure you want to grant admin privileges to this user?'

    if (!confirm(confirmMessage)) return

    setSaving(true)

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_admin: !user.is_admin }),
      })

      if (response.ok) {
        setUser({ ...user, is_admin: !user.is_admin })
      }
    } catch (error) {
      console.error('Error updating admin status:', error)
    } finally {
      setSaving(false)
    }
  }

  // Suspend/Unsuspend user
  const handleSuspendToggle = async () => {
    if (!user) return
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suspended: !user.suspended,
          suspend_reason: !user.suspended ? suspendReason : null,
        }),
      })

      if (response.ok) {
        setUser({
          ...user,
          suspended: !user.suspended,
          suspend_reason: !user.suspended ? suspendReason : null,
          suspended_at: !user.suspended ? new Date().toISOString() : null,
        })
        setShowSuspendModal(false)
        setSuspendReason('')
      }
    } catch (error) {
      console.error('Error updating suspend status:', error)
    } finally {
      setSaving(false)
    }
  }

  // Impersonate user
  const handleImpersonate = async () => {
    if (!user) return

    if (!confirm(`Are you sure you want to impersonate ${user.email}? You will be redirected to the dashboard as this user.`)) {
      return
    }

    setSaving(true)

    try {
      const response = await fetch(`/api/admin/users/${userId}/impersonate`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        // Redirect to dashboard as impersonated user
        window.location.href = data.redirectTo || '/dashboard'
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to start impersonation')
      }
    } catch (error) {
      console.error('Error impersonating user:', error)
    } finally {
      setSaving(false)
    }
  }

  // Delete user
  const handleDelete = async () => {
    if (!user || deleteConfirmText !== user.email) return

    setSaving(true)

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/admin/users')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
    } finally {
      setSaving(false)
      setShowDeleteModal(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">↻</div>
          <p className="text-text-muted">Loading user...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">User not found</p>
        <Link href="/admin/users" className="text-gold hover:underline mt-4 block">
          ← Back to Users
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-text-muted hover:text-text transition-colors"
      >
        ← Back to Users
      </Link>

      {/* User Header */}
      <Card className="p-6 bg-[#1a365d]/20 border-[#1a365d]/30">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="font-heading text-2xl font-bold">
                {user.first_name || user.last_name
                  ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                  : 'No Name Set'
                }
              </h1>
              {user.is_admin && <Badge variant="red">Admin</Badge>}
              <Badge
                variant={
                  user.tier === 'pro' || user.tier === 'monthly' || user.tier === 'quarterly' || user.tier === 'full'
                    ? 'gold'
                    : user.tier === 'basic' || user.tier === 'core'
                    ? 'green'
                    : 'default'
                }
              >
                {user.tier?.toUpperCase() || 'FREE'}
              </Badge>
              {user.suspended ? (
                <Badge variant="red">Suspended</Badge>
              ) : (
                <Badge variant="green">Active</Badge>
              )}
            </div>
            <p className="text-text-muted font-mono">{user.email}</p>
            <p className="text-text-dim text-sm mt-1">
              User ID: {user.user_id}
            </p>
            {user.suspended && user.suspend_reason && (
              <p className="text-red-400 text-sm mt-2">
                Suspend reason: {user.suspend_reason}
              </p>
            )}
          </div>
          <div className="text-right text-sm text-text-muted">
            <p>Joined {new Date(user.created_at).toLocaleDateString()}</p>
            <p>Last updated {new Date(user.updated_at).toLocaleDateString()}</p>
            {user.suspended_at && (
              <p className="text-red-400">Suspended {new Date(user.suspended_at).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <Card className="p-6">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="First Name" value={user.first_name} />
              <InfoField label="Last Name" value={user.last_name} />
              <InfoField label="Email" value={user.email} />
              <InfoField label="Phone" value={user.phone} />
              <InfoField label="City" value={user.city} />
              <InfoField label="State" value={user.state} />
              <InfoField label="ZIP" value={user.zip} />
              <InfoField label="LinkedIn" value={user.linkedin_url} isLink />
            </div>
          </Card>

          {/* Military Info */}
          <Card className="p-6">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
              Military Background
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="Branch" value={user.branch} />
              <InfoField label="Rank" value={user.rank} />
              <InfoField label="Paygrade" value={user.paygrade} />
              <InfoField label="Rating/MOS" value={user.rating_mos} />
              <InfoField label="Years of Service" value={user.years_of_service?.toString()} />
              <InfoField label="Clearance" value={user.clearance} />
              <InfoField label="EAS Date" value={user.eas_date} />
              <InfoField label="SkillBridge Start" value={user.skillbridge_start} />
              <InfoField label="SkillBridge End" value={user.skillbridge_end} />
            </div>
          </Card>

          {/* Career Goals */}
          <Card className="p-6">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
              Career Goals
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="Target Industry" value={user.target_industry} />
              <InfoField label="Target Role" value={user.target_role} />
            </div>
            {user.professional_summary && (
              <div className="mt-4">
                <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">
                  Professional Summary
                </label>
                <p className="text-sm text-text-muted bg-bg-tertiary p-3 rounded">
                  {user.professional_summary}
                </p>
              </div>
            )}
          </Card>

          {/* Resumes */}
          <Card className="p-6">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
              Resumes ({resumes.length})
            </h2>
            {resumes.length === 0 ? (
              <p className="text-text-muted">No resumes created</p>
            ) : (
              <div className="space-y-2">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{resume.name}</div>
                      <div className="text-xs text-text-muted">
                        {resume.template} • {resume.resume_type} • Updated{' '}
                        {new Date(resume.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Feature Usage Stats */}
          <Card className="p-6">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
              Feature Usage
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-bg-tertiary p-3 rounded">
                <div className="text-xs text-text-muted uppercase">Resumes Created</div>
                <div className="text-xl font-bold text-gold">{usageStats.resumes_created}</div>
              </div>
              <div className="bg-bg-tertiary p-3 rounded">
                <div className="text-xs text-text-muted uppercase">Private Downloads</div>
                <div className="text-xl font-bold text-gold">{usageStats.private_downloads}</div>
              </div>
              <div className="bg-bg-tertiary p-3 rounded">
                <div className="text-xs text-text-muted uppercase">Federal Downloads</div>
                <div className="text-xl font-bold text-gold">{usageStats.federal_downloads}</div>
              </div>
              <div className="bg-bg-tertiary p-3 rounded">
                <div className="text-xs text-text-muted uppercase">Cover Letters</div>
                <div className="text-xl font-bold text-gold">{usageStats.cover_letters}</div>
              </div>
              <div className="bg-bg-tertiary p-3 rounded">
                <div className="text-xs text-text-muted uppercase">Job Matches</div>
                <div className="text-xl font-bold text-gold">{usageStats.job_matches}</div>
              </div>
              <div className="bg-bg-tertiary p-3 rounded">
                <div className="text-xs text-text-muted uppercase">Eval Uploads</div>
                <div className="text-xl font-bold text-gold">{usageStats.eval_uploads}</div>
              </div>
              <div className="bg-bg-tertiary p-3 rounded">
                <div className="text-xs text-text-muted uppercase">AI Summaries</div>
                <div className="text-xl font-bold text-gold">{usageStats.ai_summaries}</div>
              </div>
              <div className="bg-bg-tertiary p-3 rounded">
                <div className="text-xs text-text-muted uppercase">Bullet Rewrites</div>
                <div className="text-xl font-bold text-gold">{usageStats.bullet_rewrites}</div>
              </div>
            </div>
          </Card>

          {/* API Usage */}
          <Card className="p-6">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
              API Usage
            </h2>
            <div className="mb-4 p-3 bg-[#1a365d]/20 rounded-lg">
              <div className="text-sm text-text-muted">Total Tokens Used</div>
              <div className="text-2xl font-bold text-gold">{totalTokensUsed.toLocaleString()}</div>
            </div>
            {apiUsage.length === 0 ? (
              <p className="text-text-muted text-sm">No API usage recorded</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {apiUsage.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-2 bg-bg-tertiary rounded text-sm"
                  >
                    <div>
                      <span className="font-mono text-gold">{entry.endpoint}</span>
                      <span className="text-text-dim ml-2">({entry.model})</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono">{entry.tokens_used.toLocaleString()} tokens</span>
                      <div className="text-xs text-text-dim">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Actions & Activity Sidebar */}
        <div className="space-y-6">
          {/* Account Actions */}
          <Card className="p-6">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
              Account Actions
            </h2>

            {/* Tier Change */}
            <div className="mb-4">
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">
                Subscription Tier
              </label>
              <select
                value={user.tier || 'free'}
                onChange={(e) => handleTierChange(e.target.value)}
                disabled={saving}
                className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
              >
                {TIER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Admin Toggle */}
            <div className="mb-4">
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">
                Admin Role
              </label>
              <Button
                variant={user.is_admin ? 'secondary' : 'primary'}
                onClick={handleToggleAdmin}
                disabled={saving}
                className="w-full"
              >
                {user.is_admin ? 'Remove Admin' : 'Make Admin'}
              </Button>
            </div>

            {/* Suspend/Unsuspend */}
            <div className="mb-4">
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">
                Account Status
              </label>
              <Button
                variant="secondary"
                onClick={() => {
                  if (user.suspended) {
                    handleSuspendToggle()
                  } else {
                    setShowSuspendModal(true)
                  }
                }}
                disabled={saving}
                className={`w-full ${user.suspended ? 'text-green-400 hover:bg-green-500/10' : 'text-amber-400 hover:bg-amber-500/10'}`}
              >
                {user.suspended ? 'Unsuspend Account' : 'Suspend Account'}
              </Button>
            </div>

            {/* Impersonate */}
            <div className="mb-4">
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">
                Impersonation
              </label>
              <Button
                variant="secondary"
                onClick={handleImpersonate}
                disabled={saving}
                className="w-full text-blue-400 hover:bg-blue-500/10"
              >
                Impersonate User
              </Button>
            </div>

            {/* Delete Account */}
            <div className="pt-4 border-t border-border">
              <Button
                variant="ghost"
                onClick={() => setShowDeleteModal(true)}
                disabled={saving}
                className="w-full text-status-red hover:bg-status-red/10"
              >
                Delete Account
              </Button>
            </div>
          </Card>

          {/* Account Status */}
          <Card className="p-6">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
              Account Status
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Onboarding</span>
                {user.onboarding_completed ? (
                  <Badge variant="green">Completed</Badge>
                ) : (
                  <Badge variant="amber">Pending</Badge>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Account</span>
                {user.suspended ? (
                  <Badge variant="red">Suspended</Badge>
                ) : (
                  <Badge variant="green">Active</Badge>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Resumes</span>
                <span className="font-mono">{resumes.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Total Tokens</span>
                <span className="font-mono">{totalTokensUsed.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Activity Log */}
          <Card className="p-6">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider mb-4">
              Activity Log
            </h2>
            {activityLog.length === 0 ? (
              <p className="text-text-muted text-sm">No activity recorded</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {activityLog.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-2 bg-bg-tertiary rounded text-sm"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-gold">{entry.action}</span>
                      <span className="text-xs text-text-dim">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {entry.details && (
                      <div className="text-xs text-text-muted mt-1">
                        {entry.details.admin_email && (
                          <span>by {entry.details.admin_email}</span>
                        )}
                        {entry.details.changes && (
                          <div className="mt-1">
                            {entry.details.changes.map((change: string, i: number) => (
                              <div key={i}>{change}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Suspend Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="p-6 max-w-md w-full">
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-amber-400 mb-4">
              Suspend User Account
            </h2>
            <p className="text-text-muted mb-4">
              This will prevent the user from accessing their account. You can unsuspend them at any time.
            </p>
            <div className="mb-4">
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">
                Reason for Suspension (optional)
              </label>
              <Input
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="e.g., Violation of terms of service"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowSuspendModal(false)
                  setSuspendReason('')
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSuspendToggle}
                disabled={saving}
                className="flex-1 bg-amber-600 hover:bg-amber-500"
              >
                {saving ? 'Suspending...' : 'Suspend User'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="p-6 max-w-md w-full">
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-status-red mb-4">
              Delete User Account
            </h2>
            <p className="text-text-muted mb-4">
              This action cannot be undone. This will permanently delete the user account,
              profile, and all associated data including resumes.
            </p>
            <p className="text-sm mb-4">
              Type <span className="font-mono text-gold">{user.email}</span> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Enter email to confirm"
              className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-text mb-4 focus:border-status-red focus:ring-1 focus:ring-status-red/25"
            />
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmText('')
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleDelete}
                disabled={deleteConfirmText !== user.email || saving}
                className="flex-1 bg-status-red hover:bg-status-red/80"
              >
                {saving ? 'Deleting...' : 'Delete User'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

function InfoField({
  label,
  value,
  isLink,
}: {
  label: string
  value: string | null | undefined
  isLink?: boolean
}) {
  return (
    <div>
      <label className="block text-xs text-text-muted uppercase tracking-wider mb-1">
        {label}
      </label>
      {value ? (
        isLink ? (
          <a
            href={value.startsWith('http') ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gold hover:underline truncate block"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm">{value}</p>
        )
      ) : (
        <p className="text-sm text-text-dim">—</p>
      )}
    </div>
  )
}
