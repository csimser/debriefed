import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

// Service role client bypasses RLS for admin queries
const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper to verify admin
async function verifyAdmin(authClient: any) {
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return { error: 'Unauthorized', status: 401 }

  // Use service client to check admin status (bypasses RLS)
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('is_admin, email')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) return { error: 'Forbidden - Admin only', status: 403 }

  return { user, adminProfile: profile }
}

// GET - List all feedback with filters
export async function GET(request: NextRequest) {
  const authClient = await createClient()

  const auth = await verifyAdmin(authClient)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || 'all'
  const type = searchParams.get('type') || 'all'
  const sort = searchParams.get('sort') || 'newest'

  try {
    // Build query using service client - include all columns from user_feedback table
    let query = serviceClient
      .from('user_feedback')
      .select('id, user_id, type, message, page_url, status, admin_notes, created_at, updated_at, email, category')

    // Apply status filter
    if (status !== 'all') {
      query = query.eq('status', status)
    }

    // Apply type filter
    if (type !== 'all') {
      query = query.eq('type', type)
    }

    // Apply sorting
    if (sort === 'oldest') {
      query = query.order('created_at', { ascending: true })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    const { data: feedback, error } = await query

    if (error) {
      console.error('Error fetching feedback:', error)
      return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 })
    }

    // Get user emails for feedback (filter out null user_ids)
    const userIds = [...new Set((feedback || []).map(f => f.user_id).filter(Boolean))]
    let userEmails: Record<string, string> = {}

    if (userIds.length > 0) {
      const { data: profiles } = await serviceClient
        .from('profiles')
        .select('user_id, email')
        .in('user_id', userIds)

      if (profiles) {
        userEmails = profiles.reduce((acc, p) => {
          if (p.user_id) {
            acc[p.user_id] = p.email
          }
          return acc
        }, {} as Record<string, string>)
      }
    }

    // Get counts for each status
    const { data: allFeedback } = await serviceClient
      .from('user_feedback')
      .select('status')

    const counts = {
      all: allFeedback?.length || 0,
      new: allFeedback?.filter(f => f.status === 'new' || f.status === 'pending' || !f.status).length || 0,
      reviewed: allFeedback?.filter(f => f.status === 'reviewed' || f.status === 'in_progress').length || 0,
      resolved: allFeedback?.filter(f => f.status === 'resolved' || f.status === 'closed').length || 0,
    }

    // Format response with emails
    const formattedFeedback = (feedback || []).map((f: any) => ({
      id: f.id,
      user_id: f.user_id,
      type: f.type || f.category, // fallback to category if type is null
      message: f.message,
      page_url: f.page_url,
      status: f.status,
      admin_notes: f.admin_notes,
      created_at: f.created_at,
      updated_at: f.updated_at,
      email: f.email, // direct email from feedback table
      category: f.category,
      user_email: f.user_id ? (userEmails[f.user_id] || f.email || 'Unknown') : (f.email || 'Anonymous'),
    }))

    return NextResponse.json({
      feedback: formattedFeedback,
      counts,
    })
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
