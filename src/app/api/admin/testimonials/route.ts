import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function verifyAdmin(authClient: any) {
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return { error: 'Unauthorized', status: 401 }

  const { data: profile } = await serviceClient
    .from('profiles')
    .select('is_admin, email')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) return { error: 'Forbidden - Admin only', status: 403 }

  return { user, adminProfile: profile }
}

export async function GET(request: NextRequest) {
  const authClient = await createClient()

  const auth = await verifyAdmin(authClient)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || 'all'
  const sort = searchParams.get('sort') || 'newest'

  try {
    let query = serviceClient
      .from('testimonials')
      .select('id, user_id, rating, comment, testimonial_consent, feature_context, status, featured, created_at')

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    query = query.order('created_at', { ascending: sort === 'oldest' })

    const { data: testimonials, error } = await query

    if (error) {
      console.error('Error fetching testimonials:', error)
      return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
    }

    // Get user emails
    const userIds = [...new Set((testimonials || []).map(t => t.user_id).filter(Boolean))]
    let userEmails: Record<string, string> = {}

    if (userIds.length > 0) {
      const { data: profiles } = await serviceClient
        .from('profiles')
        .select('user_id, email')
        .in('user_id', userIds)

      if (profiles) {
        userEmails = profiles.reduce((acc, p) => {
          if (p.user_id) acc[p.user_id] = p.email
          return acc
        }, {} as Record<string, string>)
      }
    }

    // Get counts
    const { data: allTestimonials } = await serviceClient
      .from('testimonials')
      .select('status')

    const counts = {
      all: allTestimonials?.length || 0,
      pending: allTestimonials?.filter(t => t.status === 'pending' || !t.status).length || 0,
      approved: allTestimonials?.filter(t => t.status === 'approved').length || 0,
      rejected: allTestimonials?.filter(t => t.status === 'rejected').length || 0,
    }

    const formatted = (testimonials || []).map((t: any) => ({
      ...t,
      user_email: t.user_id ? (userEmails[t.user_id] || 'Unknown') : 'Anonymous',
    }))

    return NextResponse.json({ testimonials: formatted, counts })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
