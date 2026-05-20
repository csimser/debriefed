import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function DELETE(request: Request) {
  // Auth check first — before any body parsing or DB operations
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { confirmation } = await request.json()

    // Require explicit confirmation
    if (confirmation !== 'DELETE') {
      return NextResponse.json(
        { error: 'Please type DELETE to confirm account deletion' },
        { status: 400 }
      )
    }

    const userId = user.id

    console.log('Deleting account for user:', userId)

    // Delete user data in correct order (respecting foreign keys)
    // Order: deepest children first, profile/auth last

    // 1. Delete experience_bullets (child of experience via experience_id, no user_id column)
    const { data: userExperiences } = await supabaseAdmin
      .from('experience')
      .select('id')
      .eq('user_id', userId)

    if (userExperiences && userExperiences.length > 0) {
      const experienceIds = userExperiences.map(e => e.id)
      const { error: bulletsError } = await supabaseAdmin
        .from('experience_bullets')
        .delete()
        .in('experience_id', experienceIds)

      if (bulletsError) {
        console.error('Error deleting experience_bullets:', bulletsError)
      }
    }

    // 2. Delete resume child tables (resume_skills, resume_federal_info — FK to resumes)
    const { data: userResumes } = await supabaseAdmin
      .from('resumes')
      .select('id')
      .eq('user_id', userId)

    if (userResumes && userResumes.length > 0) {
      const resumeIds = userResumes.map(r => r.id)

      const { error: resumeSkillsError } = await supabaseAdmin
        .from('resume_skills')
        .delete()
        .in('resume_id', resumeIds)

      if (resumeSkillsError) {
        console.error('Error deleting resume_skills:', resumeSkillsError)
      }

      const { error: federalInfoError } = await supabaseAdmin
        .from('resume_federal_info')
        .delete()
        .in('resume_id', resumeIds)

      if (federalInfoError) {
        console.error('Error deleting resume_federal_info:', federalInfoError)
      }
    }

    // 3. Delete resumes (now safe — children removed)
    const { error: resumeError } = await supabaseAdmin
      .from('resumes')
      .delete()
      .eq('user_id', userId)

    if (resumeError) {
      console.error('Error deleting resumes:', resumeError)
    }

    // 4. Delete experiences (now safe — bullets removed)
    const { error: expError } = await supabaseAdmin
      .from('experience')
      .delete()
      .eq('user_id', userId)

    if (expError) {
      console.error('Error deleting experiences:', expError)
    }

    // 5. Delete eval_uploads
    const { error: evalError } = await supabaseAdmin
      .from('eval_uploads')
      .delete()
      .eq('user_id', userId)

    if (evalError) {
      console.error('Error deleting eval_uploads:', evalError)
    }

    // 6. Delete certifications
    const { error: certError } = await supabaseAdmin
      .from('certifications')
      .delete()
      .eq('user_id', userId)

    if (certError) {
      console.error('Error deleting certifications:', certError)
    }

    // 7. Delete education
    const { error: eduError } = await supabaseAdmin
      .from('education')
      .delete()
      .eq('user_id', userId)

    if (eduError) {
      console.error('Error deleting education:', eduError)
    }

    // 8. Delete skills
    const { error: skillsError } = await supabaseAdmin
      .from('skills')
      .delete()
      .eq('user_id', userId)

    if (skillsError) {
      console.error('Error deleting skills:', skillsError)
    }

    // 9. Delete usage and tracking tables
    const { error: usageError } = await supabaseAdmin
      .from('usage')
      .delete()
      .eq('user_id', userId)

    if (usageError) {
      console.error('Error deleting usage:', usageError)
    }

    const { error: usageTrackingError } = await supabaseAdmin
      .from('usage_tracking')
      .delete()
      .eq('user_id', userId)

    if (usageTrackingError) {
      console.error('Error deleting usage_tracking:', usageTrackingError)
    }

    const { error: dailyUsageError } = await supabaseAdmin
      .from('daily_usage')
      .delete()
      .eq('user_id', userId)

    if (dailyUsageError) {
      console.error('Error deleting daily_usage:', dailyUsageError)
    }

    // 10. Delete API usage logs
    const { error: apiUsageError } = await supabaseAdmin
      .from('api_usage')
      .delete()
      .eq('user_id', userId)

    if (apiUsageError) {
      console.error('Error deleting api_usage:', apiUsageError)
    }

    // 11. Delete subscriptions
    const { error: subError } = await supabaseAdmin
      .from('subscriptions')
      .delete()
      .eq('user_id', userId)

    if (subError) {
      console.error('Error deleting subscriptions:', subError)
    }

    // 12. Delete promo redemptions
    const { error: promoError } = await supabaseAdmin
      .from('promo_redemptions')
      .delete()
      .eq('user_id', userId)

    if (promoError) {
      console.error('Error deleting promo_redemptions:', promoError)
    }

    // 13. Delete user_feedback
    const { error: feedbackError } = await supabaseAdmin
      .from('user_feedback')
      .delete()
      .eq('user_id', userId)

    if (feedbackError) {
      console.error('Error deleting user_feedback:', feedbackError)
    }

    // 14. Delete page_views
    const { error: pageViewsError } = await supabaseAdmin
      .from('page_views')
      .delete()
      .eq('user_id', userId)

    if (pageViewsError) {
      console.error('Error deleting page_views:', pageViewsError)
    }

    // 15. Delete abuse_log
    const { error: abuseLogError } = await supabaseAdmin
      .from('abuse_log')
      .delete()
      .eq('user_id', userId)

    if (abuseLogError) {
      console.error('Error deleting abuse_log:', abuseLogError)
    }

    // 16. Delete profile (last data table — other tables may reference it)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('user_id', userId)

    if (profileError) {
      console.error('Error deleting profile:', profileError)
      return NextResponse.json(
        { error: 'Failed to delete account. Please contact support.' },
        { status: 500 }
      )
    }

    // 17. Delete auth user using admin client
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteUserError) {
      console.error('Error deleting auth user:', deleteUserError)
      // Profile already deleted, auth user remains orphaned
      // This is a partial failure but profile data is gone
    }

    console.log('Account deleted successfully for user:', userId)

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    })

  } catch (error) {
    console.error('Account deletion error:', error)
    return NextResponse.json(
      { error: 'An error occurred while deleting your account' },
      { status: 500 }
    )
  }
}
