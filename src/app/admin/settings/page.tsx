'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface AnnouncementSettings {
  enabled: boolean
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
}

interface FeatureFlags {
  resume_builder: boolean
  job_match_analysis: boolean
  cover_letter_generator: boolean
  linkedin_generator: boolean
  eval_upload_ocr: boolean
  federal_resume_format: boolean
  maintenance_mode: boolean
}

interface ApiHealthEntry {
  status: string
  latency?: number
  last_checked: string | null
  message?: string
}

interface ApiHealth {
  anthropic: ApiHealthEntry
  onet: ApiHealthEntry
}

interface ApiUsage {
  tokensToday: number
  tokensWeek: number
  tokensMonth: number
  chartData: { date: string; tokens: number }[]
  topUsers: { user_id: string; email: string; tokens: number }[]
}

const ANNOUNCEMENT_TYPES = [
  { value: 'info', label: 'Info', color: 'bg-status-blue/20 border-status-blue/50 text-status-blue' },
  { value: 'warning', label: 'Warning', color: 'bg-status-amber/20 border-status-amber/50 text-status-amber' },
  { value: 'error', label: 'Error', color: 'bg-status-red/20 border-status-red/50 text-status-red' },
  { value: 'success', label: 'Success', color: 'bg-status-green/20 border-status-green/50 text-status-green' },
]

const FEATURE_LABELS: Record<keyof FeatureFlags, string> = {
  resume_builder: 'Resume Builder',
  job_match_analysis: 'Job Match Analysis',
  cover_letter_generator: 'Cover Letter Generator',
  linkedin_generator: 'LinkedIn Generator',
  eval_upload_ocr: 'Eval Upload/OCR',
  federal_resume_format: 'Federal Resume Format',
  maintenance_mode: 'Maintenance Mode',
}

const HEALTH_STATUS_BADGES: Record<string, { label: string; variant: 'green' | 'amber' | 'red' | 'default' }> = {
  healthy: { label: 'Healthy', variant: 'green' },
  degraded: { label: 'Degraded', variant: 'amber' },
  error: { label: 'Error', variant: 'red' },
  invalid_api_key: { label: 'Invalid API Key', variant: 'red' },
  not_configured: { label: 'Not Configured', variant: 'default' },
  unknown: { label: 'Unknown', variant: 'default' },
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  // Announcement state
  const [announcement, setAnnouncement] = useState<AnnouncementSettings>({
    enabled: false,
    message: '',
    type: 'info',
  })

  // Feature flags state
  const [features, setFeatures] = useState<FeatureFlags>({
    resume_builder: true,
    job_match_analysis: true,
    cover_letter_generator: true,
    linkedin_generator: true,
    eval_upload_ocr: true,
    federal_resume_format: true,
    maintenance_mode: false,
  })

  // API health state
  const [apiHealth, setApiHealth] = useState<ApiHealth>({
    anthropic: { status: 'unknown', last_checked: null },
    onet: { status: 'unknown', last_checked: null },
  })
  const [checkingHealth, setCheckingHealth] = useState(false)

  // API usage state
  const [apiUsage, setApiUsage] = useState<ApiUsage>({
    tokensToday: 0,
    tokensWeek: 0,
    tokensMonth: 0,
    chartData: [],
    topUsers: [],
  })

  // Fetch settings
  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/settings')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()

      if (data.settings) {
        setAnnouncement(data.settings.announcement || announcement)
        setFeatures(data.settings.features || features)
        setApiHealth(data.settings.api_health || apiHealth)
      }
      if (data.apiUsage) {
        setApiUsage(data.apiUsage)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  // Save announcement
  const saveAnnouncement = async () => {
    setSaving('announcement')
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'announcement', value: announcement }),
      })
      if (!response.ok) throw new Error('Failed to save')
    } catch (error) {
      console.error('Error saving announcement:', error)
    } finally {
      setSaving(null)
    }
  }

  // Save features
  const saveFeatures = async () => {
    setSaving('features')
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'features', value: features }),
      })
      if (!response.ok) throw new Error('Failed to save')
    } catch (error) {
      console.error('Error saving features:', error)
    } finally {
      setSaving(null)
    }
  }

  // Run health checks
  const runHealthChecks = async () => {
    setCheckingHealth(true)
    try {
      const response = await fetch('/api/admin/settings/health-check', {
        method: 'POST',
      })
      if (response.ok) {
        const data = await response.json()
        setApiHealth(data.health)
      }
    } catch (error) {
      console.error('Error running health checks:', error)
    } finally {
      setCheckingHealth(false)
    }
  }

  // Format number with commas
  const formatNumber = (num: number) => num.toLocaleString()

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString()
  }

  // Get max value for chart
  const maxTokens = Math.max(...apiUsage.chartData.map((d) => d.tokens), 1)

  // Get announcement preview styles
  const getAnnouncementStyles = () => {
    const typeConfig = ANNOUNCEMENT_TYPES.find((t) => t.value === announcement.type)
    return typeConfig?.color || ANNOUNCEMENT_TYPES[0].color
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-wider">Settings</h1>
          <p className="text-text-muted">Configure admin and system settings</p>
        </div>
        <Card className="p-12 text-center">
          <p className="text-text-muted">Loading settings...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wider">Settings</h1>
        <p className="text-text-muted">Configure admin and system settings</p>
      </div>

      {/* Announcement Banner Section */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border bg-navy/20">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wider">
            Announcement Banner
          </h2>
        </div>
        <div className="p-6 space-y-4">
          {/* Enable Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Banner</p>
              <p className="text-sm text-text-muted">Show announcement to all users</p>
            </div>
            <button
              onClick={() => setAnnouncement({ ...announcement, enabled: !announcement.enabled })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                announcement.enabled ? 'bg-gold' : 'bg-bg-tertiary'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  announcement.enabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Type Dropdown */}
          <div>
            <label className="block text-xs text-text-muted uppercase mb-2">Type</label>
            <select
              value={announcement.type}
              onChange={(e) =>
                setAnnouncement({ ...announcement, type: e.target.value as AnnouncementSettings['type'] })
              }
              className="w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
              autoComplete="off"
            >
              {ANNOUNCEMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs text-text-muted uppercase mb-2">Message</label>
            <textarea
              value={announcement.message}
              onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })}
              placeholder="Enter your announcement message..."
              rows={3}
              className="w-full bg-bg-secondary border border-border rounded-md px-4 py-3 text-text focus:border-gold focus:ring-1 focus:ring-gold/25 resize-none"
              autoComplete="off"
            />
          </div>

          {/* Preview */}
          {announcement.message && (
            <div>
              <label className="block text-xs text-text-muted uppercase mb-2">Preview</label>
              <div className={`p-4 rounded-md border ${getAnnouncementStyles()}`}>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm">{announcement.message}</p>
                  <button className="text-current opacity-60 hover:opacity-100">×</button>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <Button onClick={saveAnnouncement} disabled={saving === 'announcement'}>
              {saving === 'announcement' ? 'Saving...' : 'Save Announcement'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Feature Flags Section */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border bg-navy/20">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wider">Feature Flags</h2>
        </div>
        <div className="p-6 space-y-4">
          {(Object.keys(FEATURE_LABELS) as Array<keyof FeatureFlags>).map((key) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">{FEATURE_LABELS[key]}</p>
                {key === 'maintenance_mode' && (
                  <p className="text-sm text-text-muted">
                    When enabled, non-admins see maintenance page
                  </p>
                )}
              </div>
              <button
                onClick={() => setFeatures({ ...features, [key]: !features[key] })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  features[key]
                    ? key === 'maintenance_mode'
                      ? 'bg-status-red'
                      : 'bg-gold'
                    : 'bg-bg-tertiary'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    features[key] ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}

          <div className="border-t border-border pt-4 mt-4">
            <p className="text-sm text-text-muted mb-4">
              Note: These flags are checked throughout the app before showing features. Disabling a
              feature will hide it from all users.
            </p>
            <div className="flex justify-end">
              <Button onClick={saveFeatures} disabled={saving === 'features'}>
                {saving === 'features' ? 'Saving...' : 'Save Feature Flags'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* System Health Section */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border bg-navy/20 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wider">System Health</h2>
          <Button variant="secondary" onClick={runHealthChecks} disabled={checkingHealth}>
            {checkingHealth ? 'Checking...' : 'Check Now'}
          </Button>
        </div>
        <div className="p-6">
          <div className="grid gap-4">
            {/* Anthropic */}
            <div className="flex items-center justify-between p-4 bg-bg-secondary/50 rounded-md">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-bg-tertiary rounded-md flex items-center justify-center font-bold text-gold">
                  A
                </div>
                <div>
                  <p className="font-medium">Anthropic API</p>
                  <p className="text-xs text-text-muted">
                    Last checked: {formatDate(apiHealth.anthropic.last_checked)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {apiHealth.anthropic.latency && (
                  <span className="text-sm text-text-muted">{apiHealth.anthropic.latency}ms</span>
                )}
                <Badge variant={HEALTH_STATUS_BADGES[apiHealth.anthropic.status]?.variant || 'default'}>
                  {HEALTH_STATUS_BADGES[apiHealth.anthropic.status]?.label || apiHealth.anthropic.status}
                </Badge>
              </div>
            </div>

            {/* O*NET */}
            <div className="p-4 bg-bg-secondary/50 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-bg-tertiary rounded-md flex items-center justify-center font-bold text-gold">
                    O
                  </div>
                  <div>
                    <p className="font-medium">O*NET API</p>
                    <p className="text-xs text-text-muted">
                      Last checked: {formatDate(apiHealth.onet.last_checked)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {apiHealth.onet.latency && (
                    <span className="text-sm text-text-muted">{apiHealth.onet.latency}ms</span>
                  )}
                  <Badge variant={HEALTH_STATUS_BADGES[apiHealth.onet.status]?.variant || 'default'}>
                    {HEALTH_STATUS_BADGES[apiHealth.onet.status]?.label || apiHealth.onet.status}
                  </Badge>
                </div>
              </div>
              {apiHealth.onet.message && (
                <p className="mt-2 text-xs text-status-red ml-14">
                  {apiHealth.onet.message}
                </p>
              )}
            </div>

          </div>
        </div>
      </Card>

      {/* API Usage Summary Section */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border bg-navy/20">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wider">API Usage Summary</h2>
        </div>
        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-bg-secondary/50 rounded-md p-4 text-center">
              <p className="text-xs text-text-muted uppercase mb-1">Tokens Today</p>
              <p className="text-2xl font-bold text-gold">{formatNumber(apiUsage.tokensToday)}</p>
            </div>
            <div className="bg-bg-secondary/50 rounded-md p-4 text-center">
              <p className="text-xs text-text-muted uppercase mb-1">Tokens This Week</p>
              <p className="text-2xl font-bold text-status-blue">{formatNumber(apiUsage.tokensWeek)}</p>
            </div>
            <div className="bg-bg-secondary/50 rounded-md p-4 text-center">
              <p className="text-xs text-text-muted uppercase mb-1">Tokens This Month</p>
              <p className="text-2xl font-bold text-status-green">{formatNumber(apiUsage.tokensMonth)}</p>
            </div>
          </div>

          {/* Chart */}
          <div>
            <p className="text-xs text-text-muted uppercase mb-3">Daily Token Usage (Last 30 Days)</p>
            <div className="bg-bg-secondary/30 rounded-md p-4">
              <div className="flex items-end gap-1 h-32">
                {apiUsage.chartData.map((day, index) => {
                  const height = maxTokens > 0 ? (day.tokens / maxTokens) * 100 : 0
                  const isToday = index === apiUsage.chartData.length - 1
                  return (
                    <div
                      key={day.date}
                      className="flex-1 group relative"
                      title={`${day.date}: ${formatNumber(day.tokens)} tokens`}
                    >
                      <div
                        className={`w-full rounded-t transition-all ${
                          isToday ? 'bg-gold' : 'bg-gold/40 group-hover:bg-gold/60'
                        }`}
                        style={{ height: `${Math.max(height, 2)}%` }}
                      />
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                        <div className="bg-bg-primary border border-border rounded px-2 py-1 text-xs whitespace-nowrap">
                          <p className="font-medium">{day.date}</p>
                          <p className="text-gold">{formatNumber(day.tokens)} tokens</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between mt-2 text-xs text-text-dim">
                <span>{apiUsage.chartData[0]?.date}</span>
                <span>{apiUsage.chartData[apiUsage.chartData.length - 1]?.date}</span>
              </div>
            </div>
          </div>

          {/* Top Users */}
          <div>
            <p className="text-xs text-text-muted uppercase mb-3">Top 10 Users by Token Usage</p>
            {apiUsage.topUsers.length === 0 ? (
              <p className="text-text-muted text-sm">No usage data available</p>
            ) : (
              <div className="space-y-2">
                {apiUsage.topUsers.map((user, index) => (
                  <div
                    key={user.user_id}
                    className="flex items-center justify-between py-2 px-3 bg-bg-secondary/30 rounded"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-text-dim text-sm w-6">{index + 1}.</span>
                      <span className="font-mono text-sm">{user.email}</span>
                    </div>
                    <span className="text-gold font-medium">{formatNumber(user.tokens)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
