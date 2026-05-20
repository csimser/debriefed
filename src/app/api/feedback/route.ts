import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/** Strip all HTML tags and script content from user input */
function stripHtml(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // remove script blocks
    .replace(/<[^>]*>/g, '') // remove remaining HTML tags
    .trim()
}

// Simple in-memory rate limiter (5 submissions per IP per hour)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string, limit: number = 5, windowMs: number = 3600000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many submissions. Try again later.' }, { status: 429 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { category, message, pageUrl } = body as { category?: string; message?: string; pageUrl?: string }

  if (!message || typeof message !== 'string' || !category || typeof category !== 'string') {
    return NextResponse.json({ error: 'Message and category required' }, { status: 400 })
  }

  if (!['bug', 'feature', 'general'].includes(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }

  // Sanitize: strip HTML/script tags and enforce length limit
  const sanitizedMessage = stripHtml(message).slice(0, 5000)
  if (!sanitizedMessage) {
    return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 })
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Derive userId/email from auth session if available (never trust client-supplied values)
    let authUserId: string | null = null
    let authEmail: string | null = null
    try {
      const { createClient: createAuthClient } = await import('@/lib/supabase/server')
      const authSupabase = await createAuthClient()
      const { data: { user } } = await authSupabase.auth.getUser()
      if (user) {
        authUserId = user.id
        authEmail = user.email || null
      }
    } catch {
      // Anonymous feedback allowed — user fields stay null
    }

    const sanitizedPageUrl = typeof pageUrl === 'string' ? stripHtml(pageUrl).slice(0, 2000) : null

    const { data, error } = await supabase
      .from('user_feedback')
      .insert({
        user_id: authUserId,
        email: authEmail,
        category,
        message: sanitizedMessage,
        page_url: sanitizedPageUrl,
        status: 'new',
      })
      .select()
      .single()

    if (error) {
      console.error('Feedback insert error:', error)
      return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch (error) {
    console.error('Feedback error:', error)
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 })
  }
}
