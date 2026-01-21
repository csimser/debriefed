import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import stripe from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { PRICING_TIERS, TierId } from '@/lib/pricing-config';
import { resetUsageOnPurchase } from '@/lib/usage-service';
import Stripe from 'stripe';

// Disable body parsing for webhook
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;
      const tier = session.metadata?.tier as 'core' | 'full';
      const duration = parseInt(session.metadata?.duration || '30', 10);

      if (!userId || !tier) {
        console.error('Missing userId or tier in session metadata');
        return NextResponse.json(
          { error: 'Missing metadata' },
          { status: 400 }
        );
      }

      const now = new Date();
      const expiresAt = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000);

      try {
        // Create or update subscription record (UPSERT for upgrades/renewals)
        const { data: subscription, error: subError } = await supabase
          .from('subscriptions')
          .upsert(
            {
              user_id: userId,
              stripe_customer_id: session.customer as string,
              stripe_payment_id: session.payment_intent as string,
              tier: tier,
              status: 'active',
              started_at: now.toISOString(),
              expires_at: expiresAt.toISOString(),
              updated_at: now.toISOString(),
            },
            {
              onConflict: 'user_id',
            }
          )
          .select()
          .single();

        if (subError) {
          console.error('Error creating/updating subscription:', subError);
          throw subError;
        }

        // Update user profile tier
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            tier: tier,
            updated_at: now.toISOString(),
          })
          .eq('user_id', userId);

        if (profileError) {
          console.error('Error updating profile tier:', profileError);
        }

        // Reset usage tracking for the new subscription period
        await resetUsageOnPurchase(userId, tier as TierId, now, expiresAt);

        // Log to activity log
        await supabase.from('activity_log').insert({
          user_id: userId,
          action: 'subscription_updated',
          details: {
            tier: tier,
            duration: duration,
            stripe_session_id: session.id,
            stripe_payment_id: session.payment_intent,
            amount: session.amount_total,
            expires_at: expiresAt.toISOString(),
          },
        });

        console.log(
          `Subscription updated for user ${userId}: ${tier} tier, expires ${expiresAt.toISOString()}`
        );
      } catch (error) {
        console.error('Error processing checkout.session.completed:', error);
        return NextResponse.json(
          { error: 'Failed to process payment' },
          { status: 500 }
        );
      }
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`PaymentIntent ${paymentIntent.id} succeeded`);
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const userId = paymentIntent.metadata?.userId;

      if (userId) {
        // Log failed payment
        await supabase.from('activity_log').insert({
          user_id: userId,
          action: 'payment_failed',
          details: {
            stripe_payment_id: paymentIntent.id,
            error: paymentIntent.last_payment_error?.message,
          },
        });
      }

      console.error(`PaymentIntent ${paymentIntent.id} failed`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
