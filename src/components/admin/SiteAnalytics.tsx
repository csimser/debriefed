'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'

interface AnalyticsData {
  viewsToday: number
  viewsWeek: number
  viewsMonth: number
  uniqueVisitorsToday: number
  uniqueVisitorsWeek: number
  topPages: { path: string; count: number }[]
  viewsByDay: { date: string; count: number }[]
  topReferrers: { referrer: string; count: number }[]
}

export function SiteAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch('/api/admin/analytics')
        if (!response.ok) throw new Error('Failed to fetch analytics')
        const data = await response.json()
        setAnalytics(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-text-muted">Loading analytics...</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-status-red">Error: {error}</p>
      </Card>
    )
  }

  if (!analytics) return null

  // Get max value for chart scaling
  const maxViews = Math.max(...analytics.viewsByDay.map(d => d.count), 1)

  return (
    <div className="space-y-6">
      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnalyticsStatCard
          icon="◉"
          label="Views Today"
          value={analytics.viewsToday}
          color="navy"
        />
        <AnalyticsStatCard
          icon="◈"
          label="Views This Week"
          value={analytics.viewsWeek}
          color="gold"
        />
        <AnalyticsStatCard
          icon="◎"
          label="Unique Visitors Today"
          value={analytics.uniqueVisitorsToday}
          color="green"
        />
      </div>

      {/* Views Chart */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border bg-navy/20">
          <h3 className="font-heading text-lg font-bold uppercase tracking-wider">
            Daily Page Views (Last 30 Days)
          </h3>
        </div>
        <div className="p-6">
          <div className="flex items-end gap-1 h-40">
            {analytics.viewsByDay.map((day, index) => {
              const height = maxViews > 0 ? (day.count / maxViews) * 100 : 0
              const isToday = index === analytics.viewsByDay.length - 1
              return (
                <div
                  key={day.date}
                  className="flex-1 group relative"
                  title={`${day.date}: ${day.count.toLocaleString()} views`}
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
                      <p className="text-gold">{day.count.toLocaleString()} views</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-text-dim">
            <span>{analytics.viewsByDay[0]?.date}</span>
            <span>{analytics.viewsByDay[analytics.viewsByDay.length - 1]?.date}</span>
          </div>
        </div>
      </Card>

      {/* Top Pages and Referrers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border bg-navy/20">
            <h3 className="font-heading text-lg font-bold uppercase tracking-wider">
              Top Pages
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-navy/10">
                <tr className="text-left text-xs text-text-muted uppercase border-b border-navy/30">
                  <th className="px-4 py-3">Page</th>
                  <th className="px-4 py-3 text-right">Views</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topPages.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-4 py-8 text-center text-text-muted">
                      No page views yet
                    </td>
                  </tr>
                ) : (
                  analytics.topPages.map((page, index) => (
                    <tr
                      key={page.path}
                      className={`border-b border-border/50 ${
                        index % 2 === 0 ? 'bg-bg-secondary/30' : 'bg-bg-tertiary/30'
                      }`}
                    >
                      <td className="px-4 py-3 font-mono text-sm truncate max-w-[200px]" title={page.path}>
                        {page.path}
                      </td>
                      <td className="px-4 py-3 text-right text-gold font-medium">
                        {page.count.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Referrers */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border bg-navy/20">
            <h3 className="font-heading text-lg font-bold uppercase tracking-wider">
              Top Referrers
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-navy/10">
                <tr className="text-left text-xs text-text-muted uppercase border-b border-navy/30">
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3 text-right">Visits</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topReferrers.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-4 py-8 text-center text-text-muted">
                      No referrer data yet
                    </td>
                  </tr>
                ) : (
                  analytics.topReferrers.map((ref, index) => (
                    <tr
                      key={ref.referrer}
                      className={`border-b border-border/50 ${
                        index % 2 === 0 ? 'bg-bg-secondary/30' : 'bg-bg-tertiary/30'
                      }`}
                    >
                      <td className="px-4 py-3 font-mono text-sm truncate max-w-[200px]" title={ref.referrer}>
                        {ref.referrer}
                      </td>
                      <td className="px-4 py-3 text-right text-gold font-medium">
                        {ref.count.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

interface AnalyticsStatCardProps {
  icon: string
  label: string
  value: number
  color: 'navy' | 'gold' | 'green'
}

function AnalyticsStatCard({ icon, label, value, color }: AnalyticsStatCardProps) {
  const colorClasses = {
    navy: {
      bg: 'bg-navy/20',
      border: 'border-navy/40',
      text: 'text-status-blue',
      icon: 'bg-navy/40 text-status-blue',
    },
    gold: {
      bg: 'bg-gold/10',
      border: 'border-gold/30',
      text: 'text-gold',
      icon: 'bg-gold/20 text-gold',
    },
    green: {
      bg: 'bg-status-green/10',
      border: 'border-status-green/30',
      text: 'text-status-green',
      icon: 'bg-status-green/20 text-status-green',
    },
  }

  const colors = colorClasses[color]

  return (
    <Card className={`p-5 ${colors.bg} border ${colors.border}`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-lg ${colors.icon} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-xs text-text-muted uppercase tracking-wider mb-1">
            {label}
          </div>
          <div className={`font-heading text-3xl font-bold ${colors.text}`}>
            {value.toLocaleString()}
          </div>
        </div>
      </div>
    </Card>
  )
}
