import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { capitalizeName } from '@/lib/formatName'

const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function verifyPartnerAdmin(authClient: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return { error: 'Unauthorized', status: 401 }

  const { data: membership } = await serviceClient
    .from('organization_members')
    .select('org_id, role')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .single()

  if (!membership) return { error: 'Not an organization admin', status: 403 }

  // Check org exists and get max_seats
  const { data: org } = await serviceClient
    .from('organizations')
    .select('id, max_seats, name')
    .eq('id', membership.org_id)
    .single()

  if (!org) return { error: 'Organization not found', status: 404 }

  return { user, orgId: membership.org_id, org }
}

// POST /api/partner/members/invite — create a user and add to org
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const auth = await verifyPartnerAdmin(supabase)
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { orgId, org, user: adminUser } = auth
  const body = await request.json()
  const { email, firstName, lastName } = body

  if (!email || !firstName || !lastName) {
    return NextResponse.json({ error: 'Email, first name, and last name are required' }, { status: 400 })
  }

  // Check seat limit
  const { count } = await serviceClient
    .from('organization_members')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)

  if ((count || 0) >= org.max_seats) {
    return NextResponse.json({ error: `Seat limit reached (${org.max_seats}). Contact support to increase.` }, { status: 400 })
  }

  const normalizedEmail = email.toLowerCase().trim()
  const formattedFirstName = capitalizeName(firstName)
  const formattedLastName = capitalizeName(lastName)

  // Generate a temporary password
  const tempPassword = generateTempPassword()

  // Check if user already exists
  const { data: existingProfile } = await serviceClient
    .from('profiles')
    .select('user_id')
    .eq('email', normalizedEmail)
    .single()

  let userId: string

  if (existingProfile) {
    userId = existingProfile.user_id

    // Check if already a member of this org
    const { data: existingMember } = await serviceClient
      .from('organization_members')
      .select('id')
      .eq('org_id', orgId)
      .eq('user_id', userId)
      .single()

    if (existingMember) {
      return NextResponse.json({ error: 'This user is already a member of your organization' }, { status: 409 })
    }
  } else {
    // Create new Supabase auth user with temporary password
    const { data: newUser, error: createError } = await serviceClient.auth.admin.createUser({
      email: normalizedEmail,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        first_name: formattedFirstName,
        last_name: formattedLastName,
        full_name: `${formattedFirstName} ${formattedLastName}`.trim(),
      },
    })

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 })
    }

    userId = newUser.user!.id

    // Create profile
    await serviceClient
      .from('profiles')
      .upsert({
        user_id: userId,
        email: normalizedEmail,
        first_name: formattedFirstName,
        last_name: formattedLastName,
        subscription_tier: 'free',
        plan: 'free',
        org_id: orgId,
        onboarding_completed: false,
        auth_method: 'password',
      }, { onConflict: 'user_id' })
  }

  // Add to org members
  const { error: memberError } = await serviceClient
    .from('organization_members')
    .insert({
      org_id: orgId,
      user_id: userId,
      role: 'member',
      invited_by: adminUser.id,
    })

  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 })
  }

  // Update profile with org_id if not set
  await serviceClient
    .from('profiles')
    .update({ org_id: orgId })
    .eq('user_id', userId)
    .is('org_id', null)

  return NextResponse.json({
    success: true,
    member: {
      user_id: userId,
      email: normalizedEmail,
      first_name: formattedFirstName,
      last_name: formattedLastName,
      temporary_password: existingProfile ? null : tempPassword,
      is_existing_user: !!existingProfile,
    },
  }, { status: 201 })
}

function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  const specials = '!@#$%'
  let password = ''
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  password += specials.charAt(Math.floor(Math.random() * specials.length))
  return password
}
