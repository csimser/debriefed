import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { verifyAdmin } from '@/lib/admin-auth'

// Service role client bypasses RLS for admin queries
const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper to log admin actions (uses service client)
async function logAdminAction(
  adminUserId: string,
  action: string,
  details: Record<string, any>
) {
  try {
    await serviceClient.from('activity_log').insert({
      user_id: adminUserId,
      action,
      details: {
        ...details,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Failed to log admin action:', error)
  }
}

// Default settings structure
const DEFAULT_SETTINGS = {
  announcement: {
    enabled: false,
    message: '',
    type: 'info',
  },
  features: {
    resume_builder: true,
    job_match_analysis: true,
    cover_letter_generator: true,
    linkedin_generator: true,
    eval_upload_ocr: true,
    federal_resume_format: true,
    maintenance_mode: false,
  },
  api_health: {
    anthropic: { status: 'unknown', last_checked: null },
    onet: { status: 'unknown', last_checked: null },
    career_one_stop: { status: 'unknown', last_checked: null },
  },
}

// GET - Get all settings
export async function GET(request: NextRequest) {
  const auth = await verifyAdmin()
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    // Fetch all settings using service client
    const { data: settings, error } = await serviceClient
      .from('admin_settings')
      .select('*')

    if (error) {
      console.error('Error fetching settings:', error)
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }

    // Convert array to object keyed by setting_key
    const settingsMap: Record<string, any> = {}
    for (const setting of settings || []) {
      settingsMap[setting.setting_key] = setting.setting_value
    }

    // Merge with defaults
    const result = {
      announcement: settingsMap.announcement || DEFAULT_SETTINGS.announcement,
      features: settingsMap.features || DEFAULT_SETTINGS.features,
      api_health: settingsMap.api_health || DEFAULT_SETTINGS.api_health,
    }

    // Also fetch API usage stats using service client
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const monthAgo = new Date(today)
    monthAgo.setDate(monthAgo.getDate() - 30)

    // Get token usage from api_usage table
    const { data: usageData } = await serviceClient
      .from('api_usage')
      .select('user_id, tokens_used, created_at')
      .gte('created_at', monthAgo.toISOString())
      .order('created_at', { ascending: false })

    // Get user emails for usage data
    const userIds = [...new Set((usageData || []).map(u => u.user_id))]
    let userEmails: Record<string, string> = {}

    if (userIds.length > 0) {
      const { data: profiles } = await serviceClient
        .from('profiles')
        .select('user_id, email')
        .in('user_id', userIds)

      if (profiles) {
        userEmails = profiles.reduce((acc, p) => {
          acc[p.user_id] = p.email
          return acc
        }, {} as Record<string, string>)
      }
    }

    // Calculate stats
    const todayStr = today.toISOString().split('T')[0]
    const weekAgoStr = weekAgo.toISOString().split('T')[0]

    let tokensToday = 0
    let tokensWeek = 0
    let tokensMonth = 0
    const dailyUsage: Record<string, number> = {}
    const userUsage: Record<string, { email: string; tokens: number }> = {}

    for (const usage of usageData || []) {
      const date = usage.created_at.split('T')[0]
      const tokens = usage.tokens_used || 0

      tokensMonth += tokens
      dailyUsage[date] = (dailyUsage[date] || 0) + tokens

      if (date >= todayStr) {
        tokensToday += tokens
      }
      if (date >= weekAgoStr) {
        tokensWeek += tokens
      }

      // Track by user
      const userId = usage.user_id
      if (!userUsage[userId]) {
        userUsage[userId] = {
          email: userEmails[userId] || 'Unknown',
          tokens: 0,
        }
      }
      userUsage[userId].tokens += tokens
    }

    // Get top 10 users
    const topUsers = Object.entries(userUsage)
      .map(([id, data]) => ({ user_id: id, ...data }))
      .sort((a, b) => b.tokens - a.tokens)
      .slice(0, 10)

    // Build daily chart data (last 30 days)
    const chartData: { date: string; tokens: number }[] = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      chartData.push({
        date: dateStr,
        tokens: dailyUsage[dateStr] || 0,
      })
    }

    return NextResponse.json({
      settings: result,
      apiUsage: {
        tokensToday,
        tokensWeek,
        tokensMonth,
        chartData,
        topUsers,
      },
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PATCH - Update a setting
export async function PATCH(request: NextRequest) {
  const auth = await verifyAdmin()
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const body = await request.json()
    const { key, value } = body

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 })
    }

    // Validate key
    const validKeys = ['announcement', 'features', 'api_health']
    if (!validKeys.includes(key)) {
      return NextResponse.json({ error: 'Invalid setting key' }, { status: 400 })
    }

    // Get current value for logging using service client
    const { data: currentSetting } = await serviceClient
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', key)
      .single()

    // Upsert the setting using service client
    const { error } = await serviceClient
      .from('admin_settings')
      .upsert({
        setting_key: key,
        setting_value: value,
        updated_at: new Date().toISOString(),
        updated_by: auth.user.id,
      }, {
        onConflict: 'setting_key',
      })

    if (error) {
      console.error('Error updating setting:', error)
      return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 })
    }

    // Log the change
    await logAdminAction(auth.user.id, 'setting_updated', {
      admin_email: auth.adminProfile.email,
      setting_key: key,
      previous_value: currentSetting?.setting_value || null,
      new_value: value,
    })

    return NextResponse.json({
      message: 'Setting updated successfully',
    })
  } catch (error) {
    console.error('Error updating setting:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
