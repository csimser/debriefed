import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Use service role key for cron jobs - bypasses RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error('Unauthorized cron request - invalid or missing CRON_SECRET');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date().toISOString();

  try {
    // Find users with expired beta/full plans
    const { data: expiredUsers, error: fetchError } = await supabase
      .from('profiles')
      .select('user_id, email, plan, plan_expires_at')
      .eq('plan', 'full')
      .lt('plan_expires_at', now);

    if (fetchError) {
      console.error('Error fetching expired users:', fetchError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!expiredUsers || expiredUsers.length === 0) {
      return NextResponse.json({ message: 'No expired users', downgraded: 0 });
    }

    // Downgrade each expired user to free tier
    const downgradedIds: string[] = [];
    const errors: string[] = [];

    for (const user of expiredUsers) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          plan: 'free',
          subscription_tier: 'free',
          plan_expires_at: null
        })
        .eq('user_id', user.user_id);

      if (!updateError) {
        downgradedIds.push(user.user_id);
        console.log(`Downgraded user ${user.user_id} (${user.email}) from full to free (expired: ${user.plan_expires_at})`);
      } else {
        errors.push(`Failed to downgrade ${user.user_id}: ${updateError.message}`);
        console.error(`Error downgrading user ${user.user_id}:`, updateError);
      }
    }

    // Also mark any unused beta codes as expired if past hard expiration
    const hardExpiration = '2026-02-01T00:00:00Z';
    if (new Date(now) >= new Date(hardExpiration)) {
      const { error: codesError } = await supabase
        .from('beta_codes')
        .update({
          used: true,
          used_at: now,
          expires_at: now
        })
        .eq('used', false);

      if (codesError) {
        console.error('Error expiring unused beta codes:', codesError);
      } else {
        console.log('Marked all unused beta codes as expired (past hard expiration date)');
      }
    }

    return NextResponse.json({
      message: 'Expiration check complete',
      checked_at: now,
      found_expired: expiredUsers.length,
      downgraded: downgradedIds.length,
      user_ids: downgradedIds,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
