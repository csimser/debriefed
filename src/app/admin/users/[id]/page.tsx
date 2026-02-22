'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { ResumePreview } from '@/components/resume/ResumePreview'

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
  content?: any
  created_at: string
  updated_at: string
}

interface ExperienceBullet {
  id: string
  original_text: string
  translated_text: string | null
  is_from_eval: boolean
  created_at: string
}

interface Experience {
  id: string
  job_title: string
  organization: string
  location: string | null
  start_date: string | null
  end_date: string | null
  is_current: boolean
  duties_description: string | null
  bullets: ExperienceBullet[]
  created_at: string
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
  { value: 'core', label: 'Core ($25/30 days)' },
  { value: 'full', label: 'Full ($50/90 days)' },
]

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [userId, setUserId] = useState<string | null>(null)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([])
  const [apiUsage, setApiUsage] = useState<ApiUsageEntry[]>([])
  const [totalTokensUsed, setTotalTokensUsed] = useState(0)
  const [activeTab, setActiveTab] = useState<'resumes' | 'experiences'>('resumes')
  const [previewResume, setPreviewResume] = useState<Resume | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)
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
  const [showEditModal, setShowEditModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [suspendReason, setSuspendReason] = useState('')

  // Edit form state
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [editEmail, setEditEmail] = useState('')

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
        setExperiences(data.experiences || [])
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

        // Auto-open edit modal if ?edit=true
        if (searchParams.get('edit') === 'true' && data.user) {
          setEditFirstName(data.user.first_name || '')
          setEditLastName(data.user.last_name || '')
          setEditEmail(data.user.email || '')
          setShowEditModal(true)
          // Remove the edit param from URL
          router.replace(`/admin/users/${userId}`, { scroll: false })
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId, router, searchParams])

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

  // Open edit modal with current values
  const openEditModal = () => {
    if (!user) return
    setEditFirstName(user.first_name || '')
    setEditLastName(user.last_name || '')
    setEditEmail(user.email || '')
    setShowEditModal(true)
  }

  // Save profile edits
  const handleSaveProfile = async () => {
    if (!user) return
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: editFirstName,
          last_name: editLastName,
          email: editEmail,
        }),
      })

      if (response.ok) {
        // Update local state with new values
        setUser({
          ...user,
          first_name: editFirstName.charAt(0).toUpperCase() + editFirstName.slice(1).toLowerCase(),
          last_name: editLastName.charAt(0).toUpperCase() + editLastName.slice(1).toLowerCase(),
          email: editEmail,
        })
        setShowEditModal(false)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
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

  // Download resume as admin
  const handleDownloadResume = async (resume: Resume, format: 'pdf' | 'docx') => {
    setDownloading(resume.id)
    try {
      const response = await fetch(`/api/admin/users/${userId}/resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: resume.id, format }),
      })

      if (!response.ok) {
        const data = await response.json()
        alert(data.error || 'Failed to download resume')
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${resume.name || 'resume'}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading resume:', error)
      alert('Failed to download resume')
    } finally {
      setDownloading(null)
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
      <Card className="p-6 bg-navy/20 border-navy/30">
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
              <p className="text-status-red text-sm mt-2">
                Suspend reason: {user.suspend_reason}
              </p>
            )}
          </div>
          <div className="text-right text-sm text-text-muted">
            <p>Joined {new Date(user.created_at).toLocaleDateString()}</p>
            <p>Last updated {new Date(user.updated_at).toLocaleDateString()}</p>
            {user.suspended_at && (
              <p className="text-status-red">Suspended {new Date(user.suspended_at).toLocaleDateString()}</p>
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

          {/* Resumes & Experiences Tabs */}
          <Card className="p-6">
            {/* Tab Header */}
            <div className="flex gap-4 mb-4 border-b border-border">
              <button
                onClick={() => setActiveTab('resumes')}
                className={`pb-2 px-1 font-heading text-lg font-bold uppercase tracking-wider transition-colors ${
                  activeTab === 'resumes'
                    ? 'text-gold border-b-2 border-gold'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                Resumes ({resumes.length})
              </button>
              <button
                onClick={() => setActiveTab('experiences')}
                className={`pb-2 px-1 font-heading text-lg font-bold uppercase tracking-wider transition-colors ${
                  activeTab === 'experiences'
                    ? 'text-gold border-b-2 border-gold'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                Experiences ({experiences.length})
              </button>
            </div>

            {/* Resumes Tab */}
            {activeTab === 'resumes' && (
              <>
                {resumes.length === 0 ? (
                  <p className="text-text-muted">No resumes created</p>
                ) : (
                  <div className="space-y-3">
                    {resumes.map((resume) => (
                      <div
                        key={resume.id}
                        className="p-4 bg-bg-tertiary rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{resume.name}</div>
                            <div className="text-xs text-text-muted">
                              {resume.template} • {resume.resume_type} • Updated{' '}
                              {new Date(resume.updated_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setPreviewResume(resume)}
                              className="text-gold hover:bg-gold/10"
                            >
                              Preview
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadResume(resume, 'pdf')}
                              disabled={downloading === resume.id}
                              className="text-status-blue hover:bg-status-blue/10"
                            >
                              {downloading === resume.id ? 'Downloading...' : 'PDF'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadResume(resume, 'docx')}
                              disabled={downloading === resume.id}
                              className="text-status-green hover:bg-status-green/10"
                            >
                              DOCX
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Experiences Tab */}
            {activeTab === 'experiences' && (
              <>
                {experiences.length === 0 ? (
                  <p className="text-text-muted">No experiences entered</p>
                ) : (
                  <div className="space-y-4">
                    {experiences.map((exp) => (
                      <div
                        key={exp.id}
                        className="p-4 bg-bg-tertiary rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium text-gold">{exp.job_title}</div>
                            <div className="text-sm text-text-muted">{exp.organization}</div>
                            {exp.location && (
                              <div className="text-xs text-text-dim">{exp.location}</div>
                            )}
                          </div>
                          <div className="text-right text-xs text-text-muted">
                            {exp.start_date && (
                              <div>
                                {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                {' - '}
                                {exp.is_current
                                  ? 'Present'
                                  : exp.end_date
                                  ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                  : 'Present'}
                              </div>
                            )}
                          </div>
                        </div>

                        {exp.duties_description && (
                          <p className="text-sm text-text-muted mb-3 italic">
                            {exp.duties_description}
                          </p>
                        )}

                        {exp.bullets && exp.bullets.length > 0 && (
                          <div className="space-y-2 mt-3 pt-3 border-t border-border/50">
                            <div className="text-xs text-text-dim uppercase tracking-wider">
                              Bullets ({exp.bullets.length})
                            </div>
                            {exp.bullets.map((bullet) => (
                              <div key={bullet.id} className="text-sm space-y-1 pl-3 border-l-2 border-border">
                                <div className="text-text-muted">
                                  <span className="text-xs text-text-dim mr-2">Original:</span>
                                  {bullet.original_text}
                                </div>
                                {bullet.translated_text && (
                                  <div className="text-status-green">
                                    <span className="text-xs text-text-dim mr-2">Translated:</span>
                                    {bullet.translated_text}
                                  </div>
                                )}
                                {bullet.is_from_eval && (
                                  <Badge variant="amber" className="text-xs">From Eval</Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
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
            <div className="mb-4 p-3 bg-navy/20 rounded-lg">
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

            {/* Edit Profile */}
            <div className="mb-4">
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">
                Edit Profile
              </label>
              <Button
                variant="secondary"
                onClick={openEditModal}
                disabled={saving}
                className="w-full"
              >
                Edit Profile
              </Button>
            </div>

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
                autoComplete="off"
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
                className={`w-full ${user.suspended ? 'text-status-green hover:bg-status-green/10' : 'text-status-amber hover:bg-status-amber/10'}`}
              >
                {user.suspended ? 'Unsuspend Account' : 'Suspend Account'}
              </Button>
            </div>

            {/* View As User */}
            <div className="mb-4">
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">
                User View
              </label>
              <Link
                href={`/admin/users/${userId}/view`}
                className="block w-full text-center bg-bg-secondary border border-border rounded-md px-4 py-2 text-gold hover:bg-gold/10 transition-colors text-sm font-medium"
              >
                View As User (Read-Only)
              </Link>
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
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-status-amber mb-4">
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
                className="flex-1 bg-status-amber hover:bg-status-amber/90"
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
              autoComplete="off"
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

      {/* Resume Preview Modal */}
      {previewResume && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold">
                  {previewResume.name}
                </h2>
                <p className="text-sm text-text-muted">
                  {previewResume.template} • {previewResume.resume_type}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => handleDownloadResume(previewResume, 'pdf')}
                  disabled={downloading === previewResume.id}
                >
                  Download PDF
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setPreviewResume(null)}
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="overflow-auto flex-1 bg-white rounded">
              {previewResume.content ? (
                <ResumePreview
                  template={previewResume.template || 'classic_professional'}
                  resumeType={previewResume.resume_type || 'private'}
                  content={previewResume.content}
                />
              ) : (
                <p className="text-text-muted italic p-6">No content available for this resume</p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="p-6 max-w-md w-full">
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">
              Edit User Profile
            </h2>
            <p className="text-text-muted text-sm mb-4">
              Names will be auto-capitalized (e.g., "john" becomes "John").
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">
                  First Name
                </label>
                <Input
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  placeholder="First name"
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">
                  Last Name
                </label>
                <Input
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                  placeholder="Last name"
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="Email address"
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => setShowEditModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex-1"
              >
                {saving ? 'Saving...' : 'Save Changes'}
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
