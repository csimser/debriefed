import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Default feature flags
const DEFAULT_FEATURES = {
  resume_builder: true,
  job_match_analysis: true,
  cover_letter_generator: true,
  linkedin_generator: true,
  eval_upload_ocr: true,
  federal_resume_format: true,
  maintenance_mode: false,
}

// GET - Get feature flags (public, for authenticated users)
export async function GET() {
  const supabase = await createClient()

  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user is admin (for maintenance mode bypass)
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  const isAdmin = profile?.is_admin || false

  try {
    // Fetch features setting
    const { data: setting } = await supabase
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', 'features')
      .single()

    const features = setting?.setting_value || DEFAULT_FEATURES

    // If maintenance mode is on and user is not admin, return special response
    if (features.maintenance_mode && !isAdmin) {
      return NextResponse.json({
        features: {
          ...features,
          // Disable all features except maintenance_mode flag
          resume_builder: false,
          job_match_analysis: false,
          cover_letter_generator: false,
          linkedin_generator: false,
          eval_upload_ocr: false,
          federal_resume_format: false,
        },
        maintenance_mode: true,
      })
    }

    return NextResponse.json({
      features,
      maintenance_mode: false,
    })
  } catch (error) {
    console.error('Error fetching features:', error)
    // Return defaults on error
    return NextResponse.json({
      features: DEFAULT_FEATURES,
      maintenance_mode: false,
    })
  }
}
