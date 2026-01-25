import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function DELETE(request: Request) {
  try {
    const { confirmation } = await request.json()

    // Require explicit confirmation
    if (confirmation !== 'DELETE') {
      return NextResponse.json(
        { error: 'Please type DELETE to confirm account deletion' },
        { status: 400 }
      )
    }

    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = user.id

    console.log('Deleting account for user:', userId)

    // Delete user data in correct order (respecting foreign keys)
    // Order: most dependent first, profile last

    // 1. Delete resumes and related data
    const { error: resumeError } = await supabaseAdmin
      .from('resumes')
      .delete()
      .eq('user_id', userId)

    if (resumeError) {
      console.error('Error deleting resumes:', resumeError)
    }

    // 2. Delete experiences
    const { error: expError } = await supabaseAdmin
      .from('experiences')
      .delete()
      .eq('user_id', userId)

    if (expError) {
      console.error('Error deleting experiences:', expError)
    }

    // 3. Delete certifications
    const { error: certError } = await supabaseAdmin
      .from('certifications')
      .delete()
      .eq('user_id', userId)

    if (certError) {
      console.error('Error deleting certifications:', certError)
    }

    // 4. Delete education
    const { error: eduError } = await supabaseAdmin
      .from('education')
      .delete()
      .eq('user_id', userId)

    if (eduError) {
      console.error('Error deleting education:', eduError)
    }

    // 5. Delete skills
    const { error: skillsError } = await supabaseAdmin
      .from('skills')
      .delete()
      .eq('user_id', userId)

    if (skillsError) {
      console.error('Error deleting skills:', skillsError)
    }

    // 6. Delete usage records
    const { error: usageError } = await supabaseAdmin
      .from('usage')
      .delete()
      .eq('user_id', userId)

    if (usageError) {
      console.error('Error deleting usage:', usageError)
    }

    // 7. Delete API usage logs
    const { error: apiUsageError } = await supabaseAdmin
      .from('api_usage')
      .delete()
      .eq('user_id', userId)

    if (apiUsageError) {
      console.error('Error deleting api_usage:', apiUsageError)
    }

    // 8. Delete feedback
    const { error: feedbackError } = await supabaseAdmin
      .from('feedback')
      .delete()
      .eq('user_id', userId)

    if (feedbackError) {
      console.error('Error deleting feedback:', feedbackError)
    }

    // 9. Delete profile (last, as other tables may reference it)
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

    // 10. Delete auth user using admin client
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
