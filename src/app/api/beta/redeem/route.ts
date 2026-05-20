import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

// Service role client for database operations (bypasses RLS)
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Beta testing configuration
const HARD_EXPIRATION = new Date('2026-02-11T23:59:59Z');
const BETA_DURATION_HOURS = 48;

export async function POST(req: Request) {
  try {
    // Authenticate user - get userId from session, NOT from request body
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.id;
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Code required' },
        { status: 400 }
      );
    }

    const normalizedCode = code.trim().toUpperCase();
    const now = new Date();

    // Check if we're past the hard expiration date
    if (now >= HARD_EXPIRATION) {
      return NextResponse.json(
        { success: false, error: 'Code redemption period has ended' },
        { status: 400 }
      );
    }

    // Get the beta code using admin client (bypasses RLS)
    const { data: betaCode, error: codeError } = await supabaseAdmin
      .from('beta_codes')
      .select('*')
      .ilike('code', normalizedCode)
      .single();

    if (codeError || !betaCode) {
      return NextResponse.json(
        { success: false, error: 'Invalid code' },
        { status: 400 }
      );
    }

    // Check if code is revoked
    if (betaCode.revoked) {
      return NextResponse.json(
        { success: false, error: 'This code has been revoked' },
        { status: 400 }
      );
    }

    // Check if already used
    if (betaCode.used) {
      return NextResponse.json(
        { success: false, error: 'This code has already been redeemed' },
        { status: 400 }
      );
    }

    // Check if user already has active beta/full plan
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('plan, plan_expires_at')
      .eq('user_id', userId)
      .single();

    if (profile?.plan === 'full' && profile?.plan_expires_at) {
      const existingExpiry = new Date(profile.plan_expires_at);
      if (existingExpiry > now) {
        return NextResponse.json({
          success: false,
          error: 'You already have active full access',
          expires_at: profile.plan_expires_at
        }, { status: 400 });
      }
    }

    // Calculate expiration: 72 hours from now OR Feb 1, 2026 - whichever is FIRST
    const seventyTwoHoursLater = new Date(now.getTime() + (BETA_DURATION_HOURS * 60 * 60 * 1000));
    const actualExpiration = seventyTwoHoursLater < HARD_EXPIRATION ? seventyTwoHoursLater : HARD_EXPIRATION;

    // Mark code as used with activation and expiration timestamps
    const { error: updateCodeError } = await supabaseAdmin
      .from('beta_codes')
      .update({
        used: true,
        used_by: userId,
        used_at: now.toISOString(),
        activated_at: now.toISOString(),
        expires_at: actualExpiration.toISOString()
      })
      .eq('id', betaCode.id);

    if (updateCodeError) {
      console.error('Failed to mark code as used:', updateCodeError);
      return NextResponse.json(
        { success: false, error: 'Redemption failed' },
        { status: 500 }
      );
    }

    // Update user's plan to full tier
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_tier: 'full',
        plan: 'full',
        plan_expires_at: actualExpiration.toISOString()
      })
      .eq('user_id', userId);

    if (profileError) {
      console.error('Profile update failed:', profileError);
      // Rollback the code usage
      await supabaseAdmin
        .from('beta_codes')
        .update({ used: false, used_by: null, used_at: null, activated_at: null, expires_at: null })
        .eq('id', betaCode.id);

      return NextResponse.json(
        { success: false, error: 'Failed to update plan' },
        { status: 500 }
      );
    }

    const hoursRemaining = Math.round((actualExpiration.getTime() - now.getTime()) / (1000 * 60 * 60));

    return NextResponse.json({
      success: true,
      plan: 'full',
      message: `Success! You now have FULL tier access for ${hoursRemaining} hours.`,
      tier: 'full',
      expires_at: actualExpiration.toISOString(),
      expires_in_hours: hoursRemaining
    });

  } catch (err) {
    console.error('Beta redemption error:', err);
    return NextResponse.json(
      { success: false, error: 'Redemption failed' },
      { status: 500 }
    );
  }
}
