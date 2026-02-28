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

  const { data: org } = await serviceClient
    .from('organizations')
    .select('id, max_seats, name')
    .eq('id', membership.org_id)
    .single()

  if (!org) return { error: 'Organization not found', status: 404 }
  return { user, orgId: membership.org_id, org }
}

interface CsvRow {
  email: string
  firstName: string
  lastName: string
}

// POST /api/partner/members/bulk-invite — CSV bulk create
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const auth = await verifyPartnerAdmin(supabase)
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { orgId, org, user: adminUser } = auth
  const body = await request.json()
  const { rows } = body as { rows: CsvRow[] }

  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: 'No rows provided' }, { status: 400 })
  }

  if (rows.length > 100) {
    return NextResponse.json({ error: 'Maximum 100 users per batch' }, { status: 400 })
  }

  // Check seat limit
  const { count: currentCount } = await serviceClient
    .from('organization_members')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)

  const remainingSeats = org.max_seats - (currentCount || 0)
  if (rows.length > remainingSeats) {
    return NextResponse.json({
      error: `Not enough seats. ${remainingSeats} remaining, ${rows.length} requested.`,
    }, { status: 400 })
  }

  const results: Array<{
    email: string
    success: boolean
    temporary_password?: string
    error?: string
    is_existing_user?: boolean
  }> = []

  for (const row of rows) {
    const { email, firstName, lastName } = row
    if (!email || !firstName || !lastName) {
      results.push({ email: email || 'unknown', success: false, error: 'Missing required fields' })
      continue
    }

    const normalizedEmail = email.toLowerCase().trim()
    const formattedFirst = capitalizeName(firstName)
    const formattedLast = capitalizeName(lastName)

    try {
      // Check if user exists
      const { data: existingProfile } = await serviceClient
        .from('profiles')
        .select('user_id')
        .eq('email', normalizedEmail)
        .single()

      let userId: string
      let tempPassword: string | undefined
      let isExisting = false

      if (existingProfile) {
        userId = existingProfile.user_id
        isExisting = true

        // Check if already member
        const { data: existingMember } = await serviceClient
          .from('organization_members')
          .select('id')
          .eq('org_id', orgId)
          .eq('user_id', userId)
          .single()

        if (existingMember) {
          results.push({ email: normalizedEmail, success: false, error: 'Already a member' })
          continue
        }
      } else {
        tempPassword = generateTempPassword()
        const { data: newUser, error: createError } = await serviceClient.auth.admin.createUser({
          email: normalizedEmail,
          password: tempPassword,
          email_confirm: true,
          user_metadata: {
            first_name: formattedFirst,
            last_name: formattedLast,
            full_name: `${formattedFirst} ${formattedLast}`.trim(),
          },
        })

        if (createError) {
          results.push({ email: normalizedEmail, success: false, error: createError.message })
          continue
        }

        userId = newUser.user!.id

        await serviceClient
          .from('profiles')
          .upsert({
            user_id: userId,
            email: normalizedEmail,
            first_name: formattedFirst,
            last_name: formattedLast,
            subscription_tier: 'free',
            plan: 'free',
            org_id: orgId,
            onboarding_completed: false,
            auth_method: 'password',
          }, { onConflict: 'user_id' })
      }

      // Add to org
      await serviceClient
        .from('organization_members')
        .insert({
          org_id: orgId,
          user_id: userId,
          role: 'member',
          invited_by: adminUser.id,
        })

      // Update profile org_id
      await serviceClient
        .from('profiles')
        .update({ org_id: orgId })
        .eq('user_id', userId)
        .is('org_id', null)

      results.push({
        email: normalizedEmail,
        success: true,
        temporary_password: tempPassword,
        is_existing_user: isExisting,
      })
    } catch (err) {
      results.push({ email: normalizedEmail, success: false, error: 'Unexpected error' })
    }
  }

  const succeeded = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length

  return NextResponse.json({ results, summary: { succeeded, failed, total: rows.length } })
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
