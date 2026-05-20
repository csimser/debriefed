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
      const purchaseType = session.metadata?.type;

      if (!userId) {
        console.error('Missing userId in session metadata');
        return NextResponse.json(
          { error: 'Missing metadata' },
          { status: 400 }
        );
      }

      // Handle eval pack purchase
      if (purchaseType === 'eval_pack') {
        const credits = parseInt(session.metadata?.credits || '10', 10);
        const paymentIntentId = session.payment_intent as string;

        // Idempotency check via activity_log
        if (paymentIntentId) {
          const { data: existing } = await supabase
            .from('activity_log')
            .select('id')
            .eq('user_id', userId)
            .eq('action', 'eval_pack_purchased')
            .filter('details->>stripe_payment_id', 'eq', paymentIntentId)
            .maybeSingle();

          if (existing) {
            console.log(`Eval pack payment ${paymentIntentId} already processed, skipping`);
            return NextResponse.json({ received: true });
          }
        }

        // Increment eval_uploads_bonus on profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('eval_uploads_bonus')
          .eq('user_id', userId)
          .single();

        const currentBonus = profile?.eval_uploads_bonus || 0;
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ eval_uploads_bonus: currentBonus + credits })
          .eq('user_id', userId);

        if (updateError) {
          console.error('Error adding eval pack credits:', updateError);
          return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 });
        }

        // Log the purchase
        try {
          await supabase.from('activity_log').insert({
            user_id: userId,
            action: 'eval_pack_purchased',
            details: {
              credits,
              stripe_session_id: session.id,
              stripe_payment_id: session.payment_intent,
              amount: session.amount_total,
            },
          });
        } catch (logError) {
          console.error('Failed to log eval pack purchase (non-critical):', logError);
        }

        console.log(`Eval pack: +${credits} credits for user ${userId}`);
        return NextResponse.json({ received: true });
      }

      const tier = session.metadata?.tier as 'core' | 'full';
      const duration = parseInt(session.metadata?.duration || '30', 10);

      if (!tier) {
        console.error('Missing tier in session metadata');
        return NextResponse.json(
          { error: 'Missing metadata' },
          { status: 400 }
        );
      }

      const paymentIntentId = session.payment_intent as string;

      // Idempotency check: skip if this payment was already processed
      if (paymentIntentId) {
        const { data: existing } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('stripe_payment_id', paymentIntentId)
          .maybeSingle();

        if (existing) {
          console.log(`Payment ${paymentIntentId} already processed, skipping`);
          return NextResponse.json({ received: true });
        }
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

        // Update user profile tier (all columns for backward compatibility)
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            tier: tier,
            subscription_tier: tier,
            plan: tier,
            plan_expires_at: expiresAt.toISOString(),
            updated_at: now.toISOString(),
          })
          .eq('user_id', userId);

        if (profileError) {
          console.error('Error updating profile tier:', profileError);
          throw profileError;
        }

        // Reset usage tracking for the new subscription period
        await resetUsageOnPurchase(userId, tier as TierId, now, expiresAt);

        // Log to activity log (non-critical, don't block on failure)
        try {
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
        } catch (logError) {
          console.error('Failed to log activity (non-critical):', logError);
        }

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
        // Log failed payment (non-critical, don't block on failure)
        try {
          await supabase.from('activity_log').insert({
            user_id: userId,
            action: 'payment_failed',
            details: {
              stripe_payment_id: paymentIntent.id,
              error: paymentIntent.last_payment_error?.message,
            },
          });
        } catch (logError) {
          console.error('Failed to log payment failure (non-critical):', logError);
        }
      }

      console.error(`PaymentIntent ${paymentIntent.id} failed`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
