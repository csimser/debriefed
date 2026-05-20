import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST /api/join/[slug]/tag — tag authenticated user to org after signup via white-label page
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Find org by slug
  const { data: org } = await serviceClient
    .from('organizations')
    .select('id, max_seats')
    .eq('slug', slug.toLowerCase())
    .single()

  if (!org) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
  }

  // Check if already a member
  const { data: existing } = await serviceClient
    .from('organization_members')
    .select('id')
    .eq('org_id', org.id)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    return NextResponse.json({ success: true, message: 'Already a member' })
  }

  // Check seat limit
  const { count } = await serviceClient
    .from('organization_members')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', org.id)

  if ((count || 0) >= org.max_seats) {
    return NextResponse.json({ error: 'Organization is full' }, { status: 400 })
  }

  // Add as member
  await serviceClient
    .from('organization_members')
    .insert({
      org_id: org.id,
      user_id: user.id,
      role: 'member',
    })

  // Update profile org_id
  await serviceClient
    .from('profiles')
    .update({ org_id: org.id })
    .eq('user_id', user.id)

  return NextResponse.json({ success: true })
}
