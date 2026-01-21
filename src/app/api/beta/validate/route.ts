import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role for validation (user not authenticated during signup)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Code required' },
        { status: 400 }
      );
    }

    // Normalize: trim whitespace and uppercase
    const normalizedCode = code.trim().toUpperCase();

    // Use admin client to bypass RLS (user not authenticated during signup)
    const { data, error } = await supabaseAdmin
      .from('beta_codes')
      .select('id, code, used, revoked')
      .ilike('code', normalizedCode)
      .single();

    if (error || !data) {
      console.log('Beta code lookup failed:', error?.message || 'No matching code');
      return NextResponse.json(
        { valid: false, error: 'Invalid code' },
        { status: 400 }
      );
    }

    // Check if code has been revoked
    if (data.revoked) {
      return NextResponse.json(
        { valid: false, error: 'This code has been revoked' },
        { status: 400 }
      );
    }

    // Check if already used
    if (data.used) {
      return NextResponse.json(
        { valid: false, error: 'Code has already been used' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      plan: 'full',
      message: 'Code valid! Unlocks FULL tier access for 48 hours.'
    });

  } catch (err) {
    console.error('Beta validation error:', err);
    return NextResponse.json(
      { valid: false, error: 'Validation failed' },
      { status: 500 }
    );
  }
}
