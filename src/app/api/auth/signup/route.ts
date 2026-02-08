import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { capitalizeName } from '@/lib/formatName';

// Use service role for signup
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName, branch, paygrade } = await req.json();

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !branch || !paygrade) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Auto-capitalize names
    const formattedFirstName = capitalizeName(firstName);
    const formattedLastName = capitalizeName(lastName);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://getdebriefed.co';

    // Create the user account
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback?type=signup`,
        data: {
          first_name: formattedFirstName,
          last_name: formattedLastName,
          full_name: `${formattedFirstName} ${formattedLastName}`.trim(),
          branch,
          paygrade,
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

    // Create initial profile with free tier
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        user_id: authData.user.id,
        email: email,
        first_name: formattedFirstName,
        last_name: formattedLastName,
        branch: branch,
        paygrade: paygrade,
        subscription_tier: 'free',
        plan: 'free',
        onboarding_completed: false,
      }, {
        onConflict: 'user_id'
      });

    if (profileError) {
      console.error('Failed to create profile:', profileError);
      // Don't fail signup - profile will be created on first login if needed
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
