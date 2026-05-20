import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { capitalizeName } from '@/lib/formatName'
import { resetUsageOnPurchase, resetDailyUsage } from '@/lib/usage-service'
import type { TierId } from '@/lib/pricing-config'
import { verifyAdmin } from '@/lib/admin-auth'

// Service role client bypasses RLS for admin queries
const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper to log admin actions (uses service client)
async function logAdminAction(
  adminUserId: string,
  adminEmail: string,
  targetUserId: string,
  action: string,
  details: Record<string, any>
) {
  try {
    await serviceClient.from('activity_log').insert({
      user_id: adminUserId, // Log under admin's ID for admin actions
      action,
      details: {
        ...details,
        admin_email: adminEmail,
        target_user_id: targetUserId,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Failed to log admin action:', error)
  }
}

// GET - Get single user with resumes, experiences, and API usage
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await verifyAdmin()
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  // Get user profile (using service client to bypass RLS)
  const { data: profile, error: profileError } = await serviceClient
    .from('profiles')
    .select('*')
    .eq('user_id', id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Log admin view of user profile (audit logging)
  await logAdminAction(auth.user.id, auth.adminProfile.email, id, 'admin_viewed_user', {
    target_email: profile.email,
    target_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
  })

  // Get user's resumes with content for preview
  const { data: resumes } = await serviceClient
    .from('resumes')
    .select('id, name, template, resume_type, content, created_at, updated_at')
    .eq('user_id', id)
    .order('updated_at', { ascending: false })

  // Get user's experiences with bullets
  const { data: experiences } = await serviceClient
    .from('experience')
    .select('*, experience_bullets(*)')
    .eq('user_id', id)
    .order('sort_order', { ascending: true })

  // Get activity log for this user
  const { data: activityLog } = await serviceClient
    .from('activity_log')
    .select('*')
    .eq('user_id', id)
    .order('created_at', { ascending: false })
    .limit(50)

  // Get API usage for this user
  const { data: apiUsage } = await serviceClient
    .from('api_usage')
    .select('*')
    .eq('user_id', id)
    .order('created_at', { ascending: false })
    .limit(20)

  // Get auth user data for email verification status
  const { data: authUserData } = await serviceClient.auth.admin.getUserById(id)

  // Get first feature activity (excludes housekeeping actions)
  const { data: firstFeatureActivity } = await serviceClient
    .from('activity_log')
    .select('action, created_at')
    .eq('user_id', id)
    .not('action', 'in', '("login","logout","profile_updated","admin_viewed_user","admin_grant")')
    .order('created_at', { ascending: true })
    .limit(1)
    .single()

  // Calculate total tokens used
  const { data: tokenSum } = await serviceClient
    .from('api_usage')
    .select('tokens_used')
    .eq('user_id', id)

  const totalTokensUsed = tokenSum?.reduce((sum, row) => sum + (row.tokens_used || 0), 0) || 0

  // Get usage stats from usage_tracking (single source of truth)
  const { data: usageTrackingRows } = await serviceClient
    .from('usage_tracking')
    .select('feature, count')
    .eq('user_id', id)

  // Aggregate per feature into the expected shape
  const usageStats: Record<string, number> = {
    resumes_created: resumes?.length || 0,
    resumes_downloaded: 0,
    cover_letters: 0,
    job_matches: 0,
    eval_uploads: 0,
    bullet_rewrites: 0,
    ai_summaries: 0,
    private_downloads: 0,
    federal_downloads: 0,
  }
  for (const row of usageTrackingRows || []) {
    const count = row.count || 0
    switch (row.feature) {
      case 'cover_letters': usageStats.cover_letters += count; break
      case 'job_match_analysis': usageStats.job_matches += count; break
      case 'eval_uploads': usageStats.eval_uploads += count; break
      case 'bullet_translations': usageStats.bullet_rewrites += count; break
      case 'ai_summaries': usageStats.ai_summaries += count; break
      case 'private_resumes':
        usageStats.private_downloads += count
        usageStats.resumes_downloaded += count
        break
      case 'federal_resumes':
        usageStats.federal_downloads += count
        usageStats.resumes_downloaded += count
        break
    }
  }

  // Compute adjacent user IDs for prev/next navigation
  const { searchParams } = new URL(request.url)
  let prevUserId: string | null = null
  let nextUserId: string | null = null

  const navSortBy = searchParams.get('sortBy') || 'created_at'
  const navSortOrder = searchParams.get('sortOrder') || 'desc'
  const navSearch = searchParams.get('search') || ''
  const navTier = searchParams.get('tier') || ''
  const navRole = searchParams.get('role') || ''
  const navSuspended = searchParams.get('suspended') || ''

  let navQuery = serviceClient
    .from('profiles')
    .select('user_id')

  if (navSearch) {
    navQuery = navQuery.or(`email.ilike.%${navSearch}%,first_name.ilike.%${navSearch}%,last_name.ilike.%${navSearch}%`)
  }
  if (navTier && navTier !== 'all') {
    if (navTier === 'free') {
      navQuery = navQuery.or('tier.is.null,tier.eq.free')
    } else {
      navQuery = navQuery.eq('tier', navTier)
    }
  }
  if (navRole && navRole !== 'all') {
    if (navRole === 'admin') {
      navQuery = navQuery.eq('is_admin', true)
    } else if (navRole === 'user') {
      navQuery = navQuery.or('is_admin.is.null,is_admin.eq.false')
    }
  }
  if (navSuspended && navSuspended !== 'all') {
    if (navSuspended === 'suspended') {
      navQuery = navQuery.eq('suspended', true)
    } else if (navSuspended === 'active') {
      navQuery = navQuery.or('suspended.is.null,suspended.eq.false')
    }
  }

  navQuery = navQuery.order(navSortBy, { ascending: navSortOrder === 'asc' })

  const { data: navUsers } = await navQuery
  if (navUsers) {
    const idx = navUsers.findIndex(u => u.user_id === id)
    if (idx > 0) prevUserId = navUsers[idx - 1].user_id
    if (idx >= 0 && idx < navUsers.length - 1) nextUserId = navUsers[idx + 1].user_id
  }

  // Compute conversion blockers
  const emailVerified = !!authUserData?.user?.email_confirmed_at
  const emailConfirmedAt = authUserData?.user?.email_confirmed_at || null
  const onboardingStep = profile.onboarding_step ?? 0
  const onboardingCompleted = !!profile.onboarding_completed
  const onboardingSkipped = !!profile.onboarding_skipped
  const onboardingTotalSteps = 7
  const resumeCount = resumes?.length || 0

  const profileKeyFields = ['branch', 'rank', 'years_of_service', 'city', 'state', 'target_role', 'target_industry']
  const missingFields = profileKeyFields.filter(f => !profile[f])
  const profileCompleteness = Math.round(((profileKeyFields.length - missingFields.length) / profileKeyFields.length) * 100)

  const isPaid = profile.tier && profile.tier !== 'free'

  let dropOffPoint: string | null = null
  if (!emailVerified) {
    dropOffPoint = 'Never verified email'
  } else if (!onboardingCompleted && !onboardingSkipped && onboardingStep === 0) {
    dropOffPoint = 'Verified email but never started onboarding'
  } else if (!onboardingCompleted && !onboardingSkipped && onboardingStep > 0) {
    dropOffPoint = `Dropped off during onboarding at step ${onboardingStep} of ${onboardingTotalSteps}`
  } else if (onboardingSkipped) {
    dropOffPoint = 'Skipped onboarding — profile likely incomplete'
  } else if (resumeCount === 0) {
    dropOffPoint = 'Completed onboarding but never built a resume'
  } else if (!firstFeatureActivity) {
    dropOffPoint = 'Built a resume but never used any AI features'
  } else if (!isPaid) {
    dropOffPoint = 'Active free user — has not upgraded'
  }

  const conversionBlockers = {
    emailVerified,
    emailConfirmedAt,
    onboardingStep,
    onboardingCompleted,
    onboardingSkipped,
    onboardingTotalSteps,
    profileCompleteness,
    missingFields,
    resumeCount,
    firstFeatureUsed: firstFeatureActivity
      ? { action: firstFeatureActivity.action, date: firstFeatureActivity.created_at }
      : null,
    lastLoginAt: profile.last_login_at || null,
    dropOffPoint,
  }

  return NextResponse.json({
    user: profile,
    resumes: resumes || [],
    experiences: (experiences || []).map(exp => ({
      ...exp,
      bullets: exp.experience_bullets || [],
    })),
    activityLog: activityLog || [],
    apiUsage: apiUsage || [],
    totalTokensUsed,
    usageStats,
    conversionBlockers,
    prevUserId,
    nextUserId,
  })
}

// PATCH - Update user (tier, role, suspended)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await verifyAdmin()
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const body = await request.json()
  const { tier, is_admin, suspended, suspend_reason, first_name, last_name, email } = body

  // Get current user data for comparison (using service client)
  const { data: currentUser } = await serviceClient
    .from('profiles')
    .select('tier, is_admin, suspended, email, first_name, last_name')
    .eq('user_id', id)
    .single()

  if (!currentUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Build update object
  const updates: Record<string, any> = {
    updated_at: new Date().toISOString(),
  }

  const changes: string[] = []

  if (tier !== undefined && tier !== currentUser.tier) {
    updates.tier = tier
    updates.subscription_tier = tier
    updates.plan = tier
    changes.push(`tier: ${currentUser.tier || 'free'} → ${tier}`)

    // Sync subscriptions table so getUserTier() returns the correct tier
    const now = new Date()
    if (tier === 'free') {
      updates.plan_expires_at = null

      // Cancel any active subscription (most recently purchased first)
      const { data: activeSub } = await serviceClient
        .from('subscriptions')
        .select('id')
        .eq('user_id', id)
        .eq('status', 'active')
        .order('started_at', { ascending: false })
        .limit(1)
        .single()

      if (activeSub) {
        await serviceClient
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('id', activeSub.id)
      }
    } else {
      // Upsert an active subscription for core/full tiers
      const durationDays = tier === 'full' ? 90 : 30
      const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000)
      updates.plan_expires_at = expiresAt.toISOString()

      // Check if an active subscription already exists (most recently purchased first)
      const { data: existingSub } = await serviceClient
        .from('subscriptions')
        .select('id')
        .eq('user_id', id)
        .eq('status', 'active')
        .order('started_at', { ascending: false })
        .limit(1)
        .single()

      if (existingSub) {
        await serviceClient
          .from('subscriptions')
          .update({
            tier,
            expires_at: expiresAt.toISOString(),
          })
          .eq('id', existingSub.id)
      } else {
        await serviceClient
          .from('subscriptions')
          .insert({
            user_id: id,
            tier,
            status: 'active',
            started_at: now.toISOString(),
            expires_at: expiresAt.toISOString(),
            stripe_customer_id: 'admin_grant',
            stripe_payment_id: 'admin_grant',
          })
      }
    }

    await logAdminAction(auth.user.id, auth.adminProfile.email, id, 'tier_changed', {
      previous_tier: currentUser.tier || 'free',
      new_tier: tier,
      target_email: currentUser.email,
    })

    // Reset usage for the new tier — clean slate on tier change
    if (tier === 'free') {
      // Downgrade: just clear daily limits (period-based tracking stays for history)
      await resetDailyUsage(id)
    } else {
      // Upgrade: reset both period tracking and daily limits
      const now = new Date()
      const durationDays = tier === 'full' ? 90 : 30
      const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000)
      await resetUsageOnPurchase(id, tier as TierId, now, expiresAt)
    }
  }

  if (is_admin !== undefined && is_admin !== currentUser.is_admin) {
    updates.is_admin = is_admin
    changes.push(`is_admin: ${currentUser.is_admin} → ${is_admin}`)

    await logAdminAction(auth.user.id, auth.adminProfile.email, id, 'role_changed', {
      previous_is_admin: currentUser.is_admin,
      new_is_admin: is_admin,
      target_email: currentUser.email,
    })
  }

  if (suspended !== undefined && suspended !== currentUser.suspended) {
    updates.suspended = suspended
    if (suspended) {
      updates.suspended_at = new Date().toISOString()
      updates.suspend_reason = suspend_reason || null
    } else {
      updates.suspended_at = null
      updates.suspend_reason = null
    }
    changes.push(`suspended: ${currentUser.suspended || false} → ${suspended}`)

    await logAdminAction(auth.user.id, auth.adminProfile.email, id, 'user_suspended', {
      suspended: suspended,
      reason: suspend_reason || null,
      target_email: currentUser.email,
    })
  }

  // Handle profile field updates (first_name, last_name, email)
  if (first_name !== undefined) {
    const formattedFirstName = capitalizeName(first_name)
    if (formattedFirstName !== currentUser.first_name) {
      updates.first_name = formattedFirstName
      changes.push(`first_name: ${currentUser.first_name || '(empty)'} → ${formattedFirstName}`)

      await logAdminAction(auth.user.id, auth.adminProfile.email, id, 'profile_edited', {
        field: 'first_name',
        previous_value: currentUser.first_name || '(empty)',
        new_value: formattedFirstName,
        target_email: currentUser.email,
      })
    }
  }

  if (last_name !== undefined) {
    const formattedLastName = capitalizeName(last_name)
    if (formattedLastName !== currentUser.last_name) {
      updates.last_name = formattedLastName
      changes.push(`last_name: ${currentUser.last_name || '(empty)'} → ${formattedLastName}`)

      await logAdminAction(auth.user.id, auth.adminProfile.email, id, 'profile_edited', {
        field: 'last_name',
        previous_value: currentUser.last_name || '(empty)',
        new_value: formattedLastName,
        target_email: currentUser.email,
      })
    }
  }

  if (email !== undefined && email !== currentUser.email) {
    updates.email = email
    changes.push(`email: ${currentUser.email || '(empty)'} → ${email}`)

    await logAdminAction(auth.user.id, auth.adminProfile.email, id, 'profile_edited', {
      field: 'email',
      previous_value: currentUser.email || '(empty)',
      new_value: email,
      target_email: currentUser.email,
    })
  }

  if (changes.length === 0) {
    return NextResponse.json({ message: 'No changes to apply' })
  }

  // Apply updates (using service client)
  const { error: updateError } = await serviceClient
    .from('profiles')
    .update(updates)
    .eq('user_id', id)

  if (updateError) {
    console.error('Error updating user:', updateError)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }

  // Log general update
  await logAdminAction(auth.user.id, auth.adminProfile.email, id, 'user_updated', {
    changes,
    target_email: currentUser.email,
  })

  return NextResponse.json({
    message: 'User updated successfully',
    changes,
  })
}

// DELETE - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const auth = await verifyAdmin()
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  // Get user info before deletion for logging (using service client)
  const { data: userToDelete } = await serviceClient
    .from('profiles')
    .select('email, first_name, last_name')
    .eq('user_id', id)
    .single()

  if (!userToDelete) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Prevent self-deletion
  if (id === auth.user.id) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
  }

  // Log deletion before it happens
  await logAdminAction(auth.user.id, auth.adminProfile.email, id, 'user_deleted', {
    deleted_email: userToDelete.email,
    deleted_name: `${userToDelete.first_name || ''} ${userToDelete.last_name || ''}`.trim(),
  })

  // Delete related data first (due to foreign key constraints)
  // First get experience IDs for this user
  const { data: experiences } = await serviceClient
    .from('experience')
    .select('id')
    .eq('user_id', id)

  // Delete experience bullets
  if (experiences && experiences.length > 0) {
    const experienceIds = experiences.map(e => e.id)
    await serviceClient
      .from('experience_bullets')
      .delete()
      .in('experience_id', experienceIds)
  }

  // Delete experiences
  await serviceClient.from('experience').delete().eq('user_id', id)

  // Delete education
  await serviceClient.from('education').delete().eq('user_id', id)

  // Delete certifications
  await serviceClient.from('certifications').delete().eq('user_id', id)

  // Delete skills
  await serviceClient.from('skills').delete().eq('user_id', id)

  // Delete resumes
  await serviceClient.from('resumes').delete().eq('user_id', id)

  // Delete API usage
  await serviceClient.from('api_usage').delete().eq('user_id', id)

  // Delete activity log
  await serviceClient.from('activity_log').delete().eq('user_id', id)

  // Delete usage data from all usage tables
  await serviceClient.from('usage').delete().eq('user_id', id)
  await serviceClient.from('usage_tracking').delete().eq('user_id', id)
  await serviceClient.from('daily_usage').delete().eq('user_id', id)

  // Delete profile
  const { error: profileError } = await serviceClient
    .from('profiles')
    .delete()
    .eq('user_id', id)

  if (profileError) {
    console.error('Error deleting profile:', profileError)
    return NextResponse.json({ error: 'Failed to delete user profile' }, { status: 500 })
  }

  return NextResponse.json({
    message: 'User deleted successfully',
    deleted: userToDelete.email,
  })
}
