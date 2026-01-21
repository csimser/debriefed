import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Rate limiting storage (in-memory, use Redis in production)
const resendAttempts: Map<string, { count: number; lastAttempt: number }> = new Map();

const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 3; // 3 attempts per 5 minutes

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Rate limiting check
    const now = Date.now();
    const attempts = resendAttempts.get(normalizedEmail);

    if (attempts) {
      // Reset if window has passed
      if (now - attempts.lastAttempt > RATE_LIMIT_WINDOW) {
        resendAttempts.set(normalizedEmail, { count: 1, lastAttempt: now });
      } else if (attempts.count >= MAX_ATTEMPTS) {
        const waitTime = Math.ceil((RATE_LIMIT_WINDOW - (now - attempts.lastAttempt)) / 60000);
        return NextResponse.json(
          { error: `Too many requests. Please try again in ${waitTime} minute${waitTime > 1 ? 's' : ''}.` },
          { status: 429 }
        );
      } else {
        resendAttempts.set(normalizedEmail, {
          count: attempts.count + 1,
          lastAttempt: now,
        });
      }
    } else {
      resendAttempts.set(normalizedEmail, { count: 1, lastAttempt: now });
    }

    const supabase = await createClient();

    // Resend the confirmation email
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: normalizedEmail,
    });

    if (error) {
      console.error('Error resending confirmation email:', error);
      // Don't expose specific errors for security
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
