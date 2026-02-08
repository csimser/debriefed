import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import stripe, { STRIPE_PRICE_IDS, calculateExpirationDate } from '@/lib/stripe';
import { PRICING_TIERS, PAYMENTS_ENABLED, TierId } from '@/lib/pricing-config';
import { resetUsageOnPurchase } from '@/lib/usage-service';

// Admin client for direct database updates
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Verify user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { tier } = body as { tier: 'core' | 'full' };

    // Validate tier
    if (!tier || !['core', 'full'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier. Must be "core" or "full"' },
        { status: 400 }
      );
    }

    const tierConfig = PRICING_TIERS[tier];
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl && process.env.NODE_ENV === 'production') {
      console.error('NEXT_PUBLIC_APP_URL must be set in production');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    const baseUrl = appUrl || 'http://localhost:3000';

    // When payments are disabled, grant access directly without Stripe
    if (!PAYMENTS_ENABLED) {
      const now = new Date();
      const duration = tierConfig.duration || 30;
      const expiresAt = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000);

      // Create or update subscription record (bypass Stripe)
      const { error: subError } = await supabaseAdmin
        .from('subscriptions')
        .upsert(
          {
            user_id: user.id,
            stripe_customer_id: 'direct_bypass',
            stripe_payment_id: `direct_${Date.now()}`,
            tier: tier,
            status: 'active',
            started_at: now.toISOString(),
            expires_at: expiresAt.toISOString(),
            updated_at: now.toISOString(),
          },
          {
            onConflict: 'user_id',
          }
        );

      if (subError) {
        console.error('Error creating subscription:', subError);
        return NextResponse.json(
          { error: 'Failed to activate access' },
          { status: 500 }
        );
      }

      // Update user profile tier (both columns for backward compatibility)
      await supabaseAdmin
        .from('profiles')
        .update({
          tier: tier,
          subscription_tier: tier,
          updated_at: now.toISOString(),
        })
        .eq('user_id', user.id);

      // Reset usage tracking for the new subscription period
      await resetUsageOnPurchase(user.id, tier as TierId, now, expiresAt);

      // Log to activity log (non-critical, don't block on failure)
      try {
        await supabaseAdmin.from('activity_log').insert({
          user_id: user.id,
          action: 'subscription_updated',
          details: {
            tier: tier,
            duration: duration,
            direct_bypass: true,
            expires_at: expiresAt.toISOString(),
          },
        });
      } catch (logError) {
        console.error('Failed to log activity (non-critical):', logError);
      }

      console.log(
        `Direct access granted for user ${user.id}: ${tier} tier, expires ${expiresAt.toISOString()}`
      );

      // Return success URL directly (no Stripe redirect needed)
      return NextResponse.json({
        url: `${baseUrl}/dashboard?payment=success&tier=${tier}`,
        directBypass: true,
      });
    }

    const priceId = STRIPE_PRICE_IDS[tier];

    // Get user's email for Stripe
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, first_name, last_name')
      .eq('user_id', user.id)
      .single();

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment', // One-time payment, not subscription
      customer_email: profile?.email || user.email,
      success_url: `${baseUrl}/dashboard?payment=success&tier=${tier}`,
      cancel_url: `${baseUrl}/pricing?payment=cancelled`,
      metadata: {
        userId: user.id,
        tier: tier,
        tierName: tierConfig.name,
        duration: tierConfig.duration?.toString() || '30',
      },
      payment_intent_data: {
        metadata: {
          userId: user.id,
          tier: tier,
        },
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
