'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface User {
  id: string
  user_id: string
  email: string
  first_name: string | null
  last_name: string | null
  tier: string | null
  is_admin: boolean
  suspended: boolean | null
  created_at: string
  onboarding_completed: boolean
  branch: string | null
  rank: string | null
  last_login_at: string | null
}

// Helper to format relative time
function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return 'Never'

  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  // Older than 7 days - show formatted date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

// Check if user is "online" (logged in within last 15 minutes)
function isOnline(lastLoginAt: string | null): boolean {
  if (!lastLoginAt) return false
  const fifteenMinutesAgo = Date.now() - (15 * 60 * 1000)
  return new Date(lastLoginAt).getTime() > fifteenMinutesAgo
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

const TIER_OPTIONS = [
  { value: 'all', label: 'All Tiers' },
  { value: 'free', label: 'Free' },
  { value: 'core', label: 'Core' },
  { value: 'full', label: 'Full' },
]

const ROLE_OPTIONS = [
  { value: 'all', label: 'All Roles' },
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
]

type SortField = 'email' | 'first_name' | 'tier' | 'created_at' | 'last_login_at'

function UsersPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [tier, setTier] = useState(searchParams.get('tier') || 'all')
  const [role, setRole] = useState(searchParams.get('role') || 'all')
  const [status, setStatus] = useState(searchParams.get('suspended') || 'all')
  const [sortBy, setSortBy] = useState<SortField>((searchParams.get('sortBy') as SortField) || 'created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>((searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc')
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10))

  // Build query params
  const buildParams = useCallback((overrides: Record<string, string> = {}) => {
    const params = new URLSearchParams({
      page: (overrides.page || page).toString(),
      limit: overrides.limit || '20',
      search: overrides.search ?? search,
      tier: overrides.tier ?? tier,
      role: overrides.role ?? role,
      suspended: overrides.suspended ?? status,
      sortBy: overrides.sortBy ?? sortBy,
      sortOrder: overrides.sortOrder ?? sortOrder,
    })
    return params
  }, [page, search, tier, role, status, sortBy, sortOrder])

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = buildParams()
      const response = await fetch(`/api/admin/users?${params}`)
      if (!response.ok) throw new Error('Failed to fetch users')

      const data = await response.json()
      setUsers(data.users)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }, [buildParams])

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (tier !== 'all') params.set('tier', tier)
    if (role !== 'all') params.set('role', role)
    if (status !== 'all') params.set('suspended', status)
    if (sortBy !== 'created_at') params.set('sortBy', sortBy)
    if (sortOrder !== 'desc') params.set('sortOrder', sortOrder)
    if (page > 1) params.set('page', page.toString())

    const queryString = params.toString()
    router.replace(`/admin/users${queryString ? `?${queryString}` : ''}`, { scroll: false })
  }, [search, tier, role, status, sortBy, sortOrder, page, router])

  // Fetch users on param change
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Handle search with debounce
  const [searchInput, setSearchInput] = useState(search)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput)
      setPage(1) // Reset to first page on search
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchInput])

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    setPage(1)
  }

  // Export to CSV
  const exportToCSV = async () => {
    setExporting(true)
    try {
      // Fetch all users with current filters (no pagination)
      const params = buildParams({ limit: '10000', page: '1' })
      const response = await fetch(`/api/admin/users?${params}`)
      if (!response.ok) throw new Error('Failed to fetch users for export')

      const data = await response.json()
      const usersToExport: User[] = data.users

      // Create CSV content
      const headers = ['Email', 'First Name', 'Last Name', 'Role', 'Tier', 'Status', 'Branch', 'Rank', 'Last Login', 'Created At']
      const rows = usersToExport.map(user => [
        user.email,
        user.first_name || '',
        user.last_name || '',
        user.is_admin ? 'Admin' : 'User',
        user.tier?.toUpperCase() || 'FREE',
        user.suspended ? 'Suspended' : 'Active',
        user.branch || '',
        user.rank || '',
        user.last_login_at ? new Date(user.last_login_at).toISOString() : 'Never',
        new Date(user.created_at).toISOString(),
      ])

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n')

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `users-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error exporting users:', error)
    } finally {
      setExporting(false)
    }
  }

  // Sort indicator
  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortBy !== field) return <span className="text-text-dim ml-1">↕</span>
    return <span className="text-gold ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-wider">
            Users
          </h1>
          <p className="text-text-muted">
            {pagination?.total || 0} total users
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={exportToCSV}
          disabled={exporting || loading}
        >
          {exporting ? 'Exporting...' : '↓ Export CSV'}
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          {/* Search Row */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by email or name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              variant="secondary"
              onClick={fetchUsers}
              disabled={loading}
            >
              {loading ? '...' : '↻ Refresh'}
            </Button>
          </div>

          {/* Filter Dropdowns Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Tier Filter */}
            <div className="w-full sm:w-48">
              <label className="block text-xs text-text-muted uppercase mb-1">Tier</label>
              <select
                value={tier}
                onChange={(e) => {
                  setTier(e.target.value)
                  setPage(1)
                }}
                className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2.5 text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
                autoComplete="off"
              >
                {TIER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Filter */}
            <div className="w-full sm:w-48">
              <label className="block text-xs text-text-muted uppercase mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value)
                  setPage(1)
                }}
                className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2.5 text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
                autoComplete="off"
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-full sm:w-48">
              <label className="block text-xs text-text-muted uppercase mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value)
                  setPage(1)
                }}
                className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2.5 text-text focus:border-gold focus:ring-1 focus:ring-gold/25"
                autoComplete="off"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-navy/30 border-b border-navy/50">
              <tr className="text-left text-xs text-text-muted uppercase">
                <th
                  className="px-4 py-3 cursor-pointer hover:text-text transition-colors"
                  onClick={() => handleSort('email')}
                >
                  Email <SortIndicator field="email" />
                </th>
                <th
                  className="px-4 py-3 cursor-pointer hover:text-text transition-colors"
                  onClick={() => handleSort('first_name')}
                >
                  Full Name <SortIndicator field="first_name" />
                </th>
                <th className="px-4 py-3">Role</th>
                <th
                  className="px-4 py-3 cursor-pointer hover:text-text transition-colors"
                  onClick={() => handleSort('tier')}
                >
                  Tier <SortIndicator field="tier" />
                </th>
                <th className="px-4 py-3">Status</th>
                <th
                  className="px-4 py-3 cursor-pointer hover:text-text transition-colors"
                  onClick={() => handleSort('last_login_at')}
                >
                  Last Login <SortIndicator field="last_login_at" />
                </th>
                <th
                  className="px-4 py-3 cursor-pointer hover:text-text transition-colors"
                  onClick={() => handleSort('created_at')}
                >
                  Created At <SortIndicator field="created_at" />
                </th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-text-muted">
                    <div className="flex items-center justify-center gap-2">
                      <span className="animate-spin">↻</span>
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-text-muted">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`border-b border-border/50 hover:bg-gold-dim/10 transition-colors ${
                      index % 2 === 0 ? 'bg-bg-secondary/30' : 'bg-bg-tertiary/30'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="text-sm font-mono">{user.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        {user.first_name || user.last_name
                          ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                          : <span className="text-text-dim italic">Not set</span>
                        }
                      </div>
                      {user.branch && (
                        <div className="text-xs text-text-muted">
                          {user.branch.replace('U.S. ', '')}
                          {user.rank && ` • ${user.rank}`}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {user.is_admin ? (
                        <Badge variant="red">Admin</Badge>
                      ) : (
                        <span className="text-text-dim text-sm">User</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
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
                    </td>
                    <td className="px-4 py-3">
                      {user.suspended ? (
                        <Badge variant="red">Suspended</Badge>
                      ) : (
                        <Badge variant="green">Active</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        {isOnline(user.last_login_at) && (
                          <span
                            className="w-2 h-2 rounded-full bg-status-green animate-pulse"
                            title="Online"
                          />
                        )}
                        <span className={user.last_login_at ? 'text-text-muted' : 'text-text-dim italic'}>
                          {formatRelativeTime(user.last_login_at)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-muted">
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/users/${user.user_id}?edit=true`}
                          className="text-sm text-gold hover:text-gold-bright hover:underline"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/admin/users/${user.user_id}`}
                          className="text-sm text-gold hover:text-gold-bright hover:underline"
                        >
                          View →
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-text-muted">
            Showing {((page - 1) * 20) + 1} - {Math.min(page * 20, pagination.total)} of {pagination.total}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(1)}
              disabled={!pagination.hasPrev}
            >
              ««
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={!pagination.hasPrev}
            >
              « Prev
            </Button>
            <span className="px-4 py-2 text-sm">
              Page <span className="text-gold font-bold">{page}</span> of {pagination.totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={!pagination.hasNext}
            >
              Next »
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(pagination.totalPages)}
              disabled={!pagination.hasNext}
            >
              »»
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function UsersLoadingFallback() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-wider">
            Users
          </h1>
          <p className="text-text-muted">Loading...</p>
        </div>
      </div>
      <Card className="p-4">
        <div className="h-10 bg-bg-secondary rounded animate-pulse" />
      </Card>
      <Card className="overflow-hidden">
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-bg-secondary rounded animate-pulse" />
          ))}
        </div>
      </Card>
    </div>
  )
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<UsersLoadingFallback />}>
      <UsersPageContent />
    </Suspense>
  )
}
