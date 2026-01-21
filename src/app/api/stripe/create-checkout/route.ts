import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import stripe, { STRIPE_PRICE_IDS, calculateExpirationDate } from '@/lib/stripe';
import { PRICING_TIERS } from '@/lib/pricing-config';

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

    const priceId = STRIPE_PRICE_IDS[tier];
    const tierConfig = PRICING_TIERS[tier];

    // Get user's email for Stripe
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, first_name, last_name')
      .eq('user_id', user.id)
      .single();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

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
      success_url: `${appUrl}/dashboard?payment=success&tier=${tier}`,
      cancel_url: `${appUrl}/pricing?payment=cancelled`,
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
