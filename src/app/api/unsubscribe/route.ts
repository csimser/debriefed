import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateUnsubscribeToken } from '@/lib/unsubscribe-token'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const token = searchParams.get('token')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://getdebriefed.co'

  if (!email || !token) {
    return NextResponse.redirect(`${appUrl}/unsubscribe/confirmed?error=invalid`)
  }

  if (!validateUnsubscribeToken(email, token)) {
    return NextResponse.redirect(`${appUrl}/unsubscribe/confirmed?error=invalid`)
  }

  // Look up user by email in auth.users, then update profiles
  const { data: authData } = await supabaseAdmin.auth.admin.listUsers()
  const user = authData?.users?.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase().trim()
  )

  if (user) {
    await supabaseAdmin
      .from('profiles')
      .update({ marketing_opt_in: false })
      .eq('user_id', user.id)
  }
  // Always redirect to confirmed page (don't reveal if email exists)

  return NextResponse.redirect(`${appUrl}/unsubscribe/confirmed`)
}
