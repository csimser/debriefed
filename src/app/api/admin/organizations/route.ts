import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { verifyAdmin } from '@/lib/admin-auth'

const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/admin/organizations — list all organizations
export async function GET() {
  const auth = await verifyAdmin()
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { data: orgs, error } = await serviceClient
    .from('organizations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Get member counts per org
  const orgIds = orgs?.map(o => o.id) || []
  const { data: memberCounts } = await serviceClient
    .from('organization_members')
    .select('org_id')
    .in('org_id', orgIds)

  const countMap: Record<string, number> = {}
  memberCounts?.forEach(m => {
    countMap[m.org_id] = (countMap[m.org_id] || 0) + 1
  })

  const orgsWithCounts = orgs?.map(org => ({
    ...org,
    seats_used: countMap[org.id] || 0,
  }))

  return NextResponse.json({ organizations: orgsWithCounts })
}

// POST /api/admin/organizations — create a new organization
export async function POST(request: NextRequest) {
  const auth = await verifyAdmin()
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const body = await request.json()
  const { name, slug, contact_email, plan, max_seats } = body

  if (!name || !slug || !contact_email) {
    return NextResponse.json({ error: 'Name, slug, and contact email are required' }, { status: 400 })
  }

  // Validate slug format (lowercase, alphanumeric, hyphens)
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Slug must be lowercase letters, numbers, and hyphens only' }, { status: 400 })
  }

  const { data: org, error } = await serviceClient
    .from('organizations')
    .insert({
      name,
      slug: slug.toLowerCase(),
      contact_email,
      plan: plan || 'starter',
      max_seats: max_seats || 25,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'An organization with this slug already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ organization: org }, { status: 201 })
}
