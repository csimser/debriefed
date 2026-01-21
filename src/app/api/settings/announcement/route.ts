import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Get announcement setting (public, for authenticated users)
export async function GET() {
  const supabase = await createClient()

  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Fetch announcement setting
    const { data: setting } = await supabase
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', 'announcement')
      .single()

    if (!setting?.setting_value) {
      return NextResponse.json({
        announcement: null,
      })
    }

    const announcement = setting.setting_value

    // Only return if enabled
    if (!announcement.enabled) {
      return NextResponse.json({
        announcement: null,
      })
    }

    return NextResponse.json({
      announcement: {
        message: announcement.message,
        type: announcement.type,
      },
    })
  } catch (error) {
    console.error('Error fetching announcement:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
