import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role for signup (handles both beta code validation and user creation)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, password, betaCode, firstName, lastName, branch, paygrade } = await req.json();

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !branch || !paygrade) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Normalize email for comparison
    const normalizedEmail = email.toLowerCase().trim();

    // Check if this is an exempt email (admin bypass)
    const isExemptEmail =
      normalizedEmail === 'chris.simser@gmail.com' ||
      normalizedEmail.includes('admin');

    let codeData: { id: string; code: string; used: boolean; revoked: boolean } | null = null;

    // Beta code validation (skip for exempt emails)
    if (!isExemptEmail) {
      // Beta code is REQUIRED for non-exempt emails
      if (!betaCode || typeof betaCode !== 'string' || !betaCode.trim()) {
        return NextResponse.json(
          { success: false, error: 'Beta code is required for registration' },
          { status: 400 }
        );
      }

      // Normalize beta code: trim whitespace and uppercase
      const normalizedCode = betaCode.trim().toUpperCase();

      // Step 1: Validate beta code BEFORE creating account
      const { data, error: codeError } = await supabaseAdmin
        .from('beta_codes')
        .select('id, code, used, revoked')
        .ilike('code', normalizedCode)
        .single();

      if (codeError || !data) {
        console.log('Beta code lookup failed:', codeError?.message || 'No matching code');
        return NextResponse.json(
          { success: false, error: 'Invalid or already used beta code' },
          { status: 400 }
        );
      }

      // Check if code has been revoked
      if (data.revoked) {
        return NextResponse.json(
          { success: false, error: 'Invalid or already used beta code' },
          { status: 400 }
        );
      }

      // Check if already used
      if (data.used) {
        return NextResponse.json(
          { success: false, error: 'Invalid or already used beta code' },
          { status: 400 }
        );
      }

      codeData = data;
    }

    // Step 2: Create the user account
    // Include beta code info in metadata so callback can set tier
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`.trim(),
          branch,
          paygrade,
          // Store beta code usage for tier assignment during profile creation
          beta_code_used: !!codeData,
          beta_signup_at: codeData ? new Date().toISOString() : null,
        },
      },
    });

    // Check for existing user (identities = [] means email already exists)
    if (authData?.user && authData.user.identities?.length === 0) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    if (authError) {
      // Check for various "already exists" error messages
      if (authError.message.includes('already registered') ||
          authError.message.includes('already exists') ||
          authError.message.includes('already been registered')) {
        return NextResponse.json(
          { success: false, error: 'An account with this email already exists' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, error: 'Failed to create account' },
        { status: 500 }
      );
    }

    // Step 3: Mark beta code as used with the new user ID (only if beta code was used)
    if (codeData) {
      const { error: updateError } = await supabaseAdmin
        .from('beta_codes')
        .update({
          used: true,
          used_by: authData.user.id,
          used_at: new Date().toISOString()
        })
        .eq('id', codeData.id);

      if (updateError) {
        console.error('Failed to mark beta code as used:', updateError);
        // Account was created but code wasn't marked - log this but don't fail the signup
        // The code is still effectively "used" since the account exists
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please check your email to verify your account.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
      }
    });

  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json(
      { success: false, error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
