import { NextRequest, NextResponse } from 'next/server'
import { checkOnetHealth } from '@/lib/onet-api'
import { verifyAdmin } from '@/lib/admin-auth'

// Check Anthropic API status
async function checkAnthropicStatus(): Promise<{ status: string; latency?: number }> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return { status: 'not_configured' }
  }

  try {
    const start = Date.now()
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'ping' }],
      }),
    })
    const latency = Date.now() - start

    if (response.ok || response.status === 400) {
      // 400 means API is responding, just request was malformed
      return { status: 'healthy', latency }
    }
    return { status: 'degraded', latency }
  } catch (error) {
    return { status: 'error' }
  }
}

// Check O*NET API v2 status using the shared library
async function checkOnetStatus(): Promise<{ status: string; latency?: number; message?: string }> {
  const health = await checkOnetHealth()

  if (!health.configured) {
    return { status: 'not_configured', message: health.error }
  }

  if (health.healthy) {
    return { status: 'healthy', latency: health.latency }
  }

  // Return 'invalid_api_key' for auth errors, 'error' for others
  const status = health.error?.includes('Invalid API key') ? 'invalid_api_key' : 'error'
  return { status, latency: health.latency, message: health.error }
}

// POST - Run health checks
export async function POST(request: NextRequest) {
  const auth = await verifyAdmin()
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    // Run health checks in parallel
    const [anthropic, onet] = await Promise.all([
      checkAnthropicStatus(),
      checkOnetStatus(),
    ])

    const now = new Date().toISOString()

    const healthStatus = {
      anthropic: { ...anthropic, last_checked: now },
      onet: { ...onet, last_checked: now },
    }

    // Save to admin_settings
    await supabase
      .from('admin_settings')
      .upsert({
        setting_key: 'api_health',
        setting_value: healthStatus,
        updated_at: now,
        updated_by: auth.user.id,
      }, {
        onConflict: 'setting_key',
      })

    return NextResponse.json({
      health: healthStatus,
    })
  } catch (error) {
    console.error('Error running health checks:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
