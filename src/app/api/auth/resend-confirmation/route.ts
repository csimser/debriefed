import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';

// Service role client for DB queries (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const RATE_LIMIT_WINDOW_MINUTES = 5;
const MAX_RESENDS = 2; // max 2 resends per 5-minute window (signup already sent one)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Look up user from profiles table to get user_id for rate limiting
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('user_id')
      .eq('email', normalizedEmail)
      .single();

    // Always return generic message — don't reveal whether the account exists
    if (!profile) {
      return NextResponse.json({
        message: 'If an account exists with this email, a confirmation link has been sent.',
      });
    }

    // DB-based rate limiting: count recent resend_confirmation actions for this user
    // This persists across serverless cold starts (unlike the old in-memory Map)
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from('activity_log')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.user_id)
      .eq('action', 'resend_confirmation')
      .gte('created_at', windowStart);

    if ((count ?? 0) >= MAX_RESENDS) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    // Log the resend attempt BEFORE sending (so concurrent requests are also counted)
    await supabaseAdmin.from('activity_log').insert({
      user_id: profile.user_id,
      action: 'resend_confirmation',
      details: { email: normalizedEmail },
    });

    // Resend the confirmation email
    const supabase = await createServerClient();
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: normalizedEmail,
    });

    if (error) {
      console.error('Error resending confirmation email:', error);
      return NextResponse.json(
        { error: 'Unable to resend confirmation email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'If an account exists with this email, a confirmation link has been sent.',
    });
  } catch (error) {
    console.error('Error in resend confirmation:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
