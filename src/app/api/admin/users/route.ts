import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

// Service role client bypasses RLS for admin queries
const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  // Use regular client for auth check
  const supabase = await createClient()

  // Verify user is authenticated and is admin
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user is admin (using service client to bypass RLS)
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 })
  }

  // Parse query parameters
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '20', 10)
  const search = searchParams.get('search') || ''
  const tier = searchParams.get('tier') || ''
  const role = searchParams.get('role') || ''
  const suspended = searchParams.get('suspended') || ''
  const sortBy = searchParams.get('sortBy') || 'created_at'
  const sortOrder = searchParams.get('sortOrder') || 'desc'

  // Calculate offset
  const offset = (page - 1) * limit

  // Build query using service client to bypass RLS
  let query = serviceClient
    .from('profiles')
    .select('id, user_id, email, first_name, last_name, tier, is_admin, suspended, created_at, onboarding_completed, branch, rank', { count: 'exact' })

  // Apply search filter
  if (search) {
    query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
  }

  // Apply tier filter
  if (tier && tier !== 'all') {
    if (tier === 'free') {
      // Free tier is when tier is null or 'free'
      query = query.or('tier.is.null,tier.eq.free')
    } else {
      query = query.eq('tier', tier)
    }
  }

  // Apply role filter
  if (role && role !== 'all') {
    if (role === 'admin') {
      query = query.eq('is_admin', true)
    } else if (role === 'user') {
      query = query.or('is_admin.is.null,is_admin.eq.false')
    }
  }

  // Apply suspended filter
  if (suspended && suspended !== 'all') {
    if (suspended === 'suspended') {
      query = query.eq('suspended', true)
    } else if (suspended === 'active') {
      query = query.or('suspended.is.null,suspended.eq.false')
    }
  }

  // Apply sorting
  const ascending = sortOrder === 'asc'
  query = query.order(sortBy, { ascending })

  // Apply pagination
  query = query.range(offset, offset + limit - 1)

  const { data: users, count, error } = await query

  if (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }

  const totalPages = Math.ceil((count || 0) / limit)

  return NextResponse.json({
    users: users || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  })
}
