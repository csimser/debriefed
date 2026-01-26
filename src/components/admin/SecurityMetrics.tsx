'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'

interface SecurityData {
  abuseIncidentsToday: number
  abuseIncidentsWeek: number
  severityBreakdown: {
    low: number
    medium: number
    high: number
    critical: number
  }
  recentAbuseIncidents: Array<{
    id: string
    user_id: string
    user_email: string
    action: string
    severity: string
    details: Record<string, any>
    created_at: string
  }>
  rateLimitHitsWeek: number
  suspendedUsers: Array<{
    user_id: string
    email: string
    suspended_at: string
  }>
  suspendedCount: number
}

export function SecurityMetrics() {
  const [data, setData] = useState<SecurityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSecurityData() {
      try {
        const response = await fetch('/api/admin/security')
        if (!response.ok) throw new Error('Failed to fetch security data')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchSecurityData()
  }, [])

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-text-muted">Loading security metrics...</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-red-400">Error: {error}</p>
      </Card>
    )
  }

  if (!data) return null

  const severityColors = {
    low: 'text-blue-400 bg-blue-500/10',
    medium: 'text-yellow-400 bg-yellow-500/10',
    high: 'text-orange-400 bg-orange-500/10',
    critical: 'text-red-400 bg-red-500/10',
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SecurityStatCard
          icon="⚠"
          label="Abuse Today"
          value={data.abuseIncidentsToday}
          color={data.abuseIncidentsToday > 0 ? 'red' : 'default'}
        />
        <SecurityStatCard
          icon="◈"
          label="Abuse This Week"
          value={data.abuseIncidentsWeek}
          color={data.abuseIncidentsWeek > 5 ? 'orange' : 'default'}
        />
        <SecurityStatCard
          icon="◎"
          label="Rate Limit Hits"
          value={data.rateLimitHitsWeek}
          color="default"
        />
        <SecurityStatCard
          icon="⊘"
          label="Suspended Users"
          value={data.suspendedCount}
          color={data.suspendedCount > 0 ? 'red' : 'default'}
        />
      </div>

      {/* Severity Breakdown */}
      {data.abuseIncidentsWeek > 0 && (
        <Card className="p-4">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">
            Severity Breakdown (Last 7 Days)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(data.severityBreakdown).map(([severity, count]) => (
              <div
                key={severity}
                className={`p-3 rounded-lg ${severityColors[severity as keyof typeof severityColors]}`}
              >
                <div className="text-xs uppercase tracking-wider opacity-70">{severity}</div>
                <div className="text-2xl font-bold">{count}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Abuse Incidents */}
      {data.recentAbuseIncidents.length > 0 && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border bg-red-500/10">
            <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-red-400">
              Recent Security Incidents
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1a365d]/10">
                <tr className="text-left text-xs text-text-muted uppercase border-b border-[#1a365d]/30">
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {data.recentAbuseIncidents.slice(0, 10).map((incident, index) => (
                  <tr
                    key={incident.id}
                    className={`border-b border-border/50 ${
                      index % 2 === 0 ? 'bg-bg-secondary/30' : 'bg-bg-tertiary/30'
                    }`}
                  >
                    <td className="px-4 py-3 text-sm text-text-muted whitespace-nowrap">
                      {new Date(incident.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono truncate max-w-[200px]">
                      {incident.user_email}
                    </td>
                    <td className="px-4 py-3 text-sm">{incident.action}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded font-mono ${
                          severityColors[incident.severity as keyof typeof severityColors]
                        }`}
                      >
                        {incident.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-muted truncate max-w-[200px]">
                      {incident.details?.reason || JSON.stringify(incident.details).slice(0, 50)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Suspended Users */}
      {data.suspendedUsers.length > 0 && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border bg-red-500/10">
            <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-red-400">
              Suspended Users
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1a365d]/10">
                <tr className="text-left text-xs text-text-muted uppercase border-b border-[#1a365d]/30">
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Suspended At</th>
                </tr>
              </thead>
              <tbody>
                {data.suspendedUsers.map((user, index) => (
                  <tr
                    key={user.user_id}
                    className={`border-b border-border/50 ${
                      index % 2 === 0 ? 'bg-bg-secondary/30' : 'bg-bg-tertiary/30'
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-mono">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-text-muted">
                      {new Date(user.suspended_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* No Issues */}
      {data.abuseIncidentsWeek === 0 && data.suspendedCount === 0 && (
        <Card className="p-8 text-center bg-emerald-500/5 border-emerald-500/20">
          <p className="text-emerald-400 font-medium">No security incidents in the past week</p>
        </Card>
      )}
    </div>
  )
}

interface SecurityStatCardProps {
  icon: string
  label: string
  value: number
  color: 'red' | 'orange' | 'default'
}

function SecurityStatCard({ icon, label, value, color }: SecurityStatCardProps) {
  const colorClasses = {
    red: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      icon: 'bg-red-500/20 text-red-400',
    },
    orange: {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
      text: 'text-orange-400',
      icon: 'bg-orange-500/20 text-orange-400',
    },
    default: {
      bg: 'bg-bg-tertiary',
      border: 'border-border',
      text: 'text-text',
      icon: 'bg-bg-secondary text-text-muted',
    },
  }

  const colors = colorClasses[color]

  return (
    <Card className={`p-4 ${colors.bg} border ${colors.border}`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg ${colors.icon} flex items-center justify-center text-xl`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-xs text-text-muted uppercase tracking-wider mb-1">
            {label}
          </div>
          <div className={`font-heading text-2xl font-bold ${colors.text}`}>
            {value.toLocaleString()}
          </div>
        </div>
      </div>
    </Card>
  )
}
