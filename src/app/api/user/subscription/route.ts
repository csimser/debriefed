import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getUserTier,
  getAllUsage,
  getSubscriptionInfo,
  isAdmin,
} from '@/lib/usage-service';
import { PRICING_TIERS } from '@/lib/pricing-config';

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Verify user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, first_name, last_name')
      .eq('user_id', user.id)
      .single();

    // Check if admin
    const adminStatus = isAdmin(profile?.email);

    // Get subscription info
    const subscriptionInfo = await getSubscriptionInfo(user.id);

    // Get tier configuration
    const tierConfig = PRICING_TIERS[subscriptionInfo.tier];

    // Get all usage
    const usage = await getAllUsage(user.id);

    // Get active subscription details (most recently purchased first)
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .order('started_at', { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({
      user: {
        id: user.id,
        email: profile?.email || user.email,
        firstName: profile?.first_name,
        lastName: profile?.last_name,
        isAdmin: adminStatus,
      },
      subscription: {
        tier: subscriptionInfo.tier,
        tierName: subscriptionInfo.tierName,
        price: tierConfig.price,
        duration: tierConfig.duration,
        expiresAt: subscriptionInfo.expiresAt?.toISOString() || null,
        daysRemaining: subscriptionInfo.daysRemaining,
        isActive: subscriptionInfo.isActive,
        stripeCustomerId: subscription?.stripe_customer_id || null,
        stripePaymentId: subscription?.stripe_payment_id || null,
      },
      limits: tierConfig.limits,
      usage,
      features: tierConfig.features,
      templates: tierConfig.templates,
    });
  } catch (error) {
    console.error('Error getting subscription info:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription info' },
      { status: 500 }
    );
  }
}
