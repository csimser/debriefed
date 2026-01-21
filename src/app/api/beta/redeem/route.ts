import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

// Service role client for database operations (bypasses RLS)
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

    // Check if already used
    if (betaCode.used) {
      return NextResponse.json(
        { success: false, error: 'Code has already been used' },
        { status: 400 }
      );
    }

    // Mark code as used (using admin client)
    const { error: updateCodeError } = await supabaseAdmin
      .from('beta_codes')
      .update({
        used: true,
        used_by: userId,
        used_at: new Date().toISOString()
      })
      .eq('id', betaCode.id);

    if (updateCodeError) {
      console.error('Failed to mark code as used:', updateCodeError);
      return NextResponse.json(
        { success: false, error: 'Redemption failed' },
        { status: 500 }
      );
    }

    // Update user's plan to full with 48 hour expiration
    // Update both subscription_tier (for existing tier checks) and plan/plan_expires_at
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(); // 48 hours

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_tier: 'full',
        plan: 'full',
        plan_expires_at: expiresAt
      })
      .eq('user_id', userId);

    if (profileError) {
      console.error('Profile update failed:', profileError);
      // Rollback the code usage
      await supabaseAdmin
        .from('beta_codes')
        .update({ used: false, used_by: null, used_at: null })
        .eq('id', betaCode.id);

      return NextResponse.json(
        { success: false, error: 'Failed to update plan' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      plan: 'full',
      message: 'Success! You now have FULL tier access for 48 hours.'
    });

  } catch (err) {
    console.error('Beta redemption error:', err);
    return NextResponse.json(
      { success: false, error: 'Redemption failed' },
      { status: 500 }
    );
  }
}
