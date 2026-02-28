import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { verifyAdmin } from '@/lib/admin-auth'

const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const auth = await verifyAdmin()
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const body = await request.json()
    const { status, featured } = body

    const validStatuses = ['pending', 'approved', 'rejected']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const { data: current } = await serviceClient
      .from('testimonials')
      .select('id, status, featured')
      .eq('id', id)
      .single()

    if (!current) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 })
    }

    const updates: Record<string, any> = {}
    if (status !== undefined) updates.status = status
    if (featured !== undefined) updates.featured = featured

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
    }

    const { error } = await serviceClient
      .from('testimonials')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('Error updating testimonial:', error)
      return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Testimonial updated' })
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
