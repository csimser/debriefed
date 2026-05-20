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
    const {
      email,
      firstName,
      lastName,
      branch,
      paygrade,
      employerSharingOptIn,
      marketingOptIn,
      orgSlug,
    } = await req.json();

    // Validate required fields (branch/paygrade collected during onboarding)
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Auto-capitalize names
    const formattedFirstName = capitalizeName(firstName);
    const formattedLastName = capitalizeName(lastName);

    // Check if the email already exists — if so, return a generic success
    // response to prevent email enumeration attacks. The frontend will
    // proceed to the OTP screen either way.
    const normalizedEmail = email.toLowerCase().trim();
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('user_id')
      .eq('email', normalizedEmail)
      .single();

    if (existingProfile) {
      // Return alreadyExists flag so the frontend knows to proceed to OTP
      // screen, but the response looks identical to success from outside
      return NextResponse.json({
        success: false,
        alreadyExists: true,
        message: 'If this email is eligible, an account will be created.',
      });
    }

    // OTP signup: create user via admin API (no password, no confirmation email)
    const { data: adminUser, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      email_confirm: false, // They'll verify via OTP
      user_metadata: {
        first_name: formattedFirstName,
        last_name: formattedLastName,
        full_name: `${formattedFirstName} ${formattedLastName}`.trim(),
        ...(branch ? { branch } : {}),
        ...(paygrade ? { paygrade } : {}),
      },
    });

    if (adminError) {
      // If Supabase says user already exists (race condition), treat same as above
      if (adminError.message.includes('already') || adminError.message.includes('exists')) {
        return NextResponse.json({
          success: false,
          alreadyExists: true,
          message: 'If this email is eligible, an account will be created.',
        });
      }
      return NextResponse.json(
        { success: false, error: adminError.message },
        { status: 400 }
      );
    }

    if (!adminUser.user) {
      return NextResponse.json(
        { success: false, error: 'Failed to create account' },
        { status: 500 }
      );
    }

    const userId = adminUser.user.id;

    // Resolve org if signing up via white-label page
    let orgId: string | null = null;
    if (orgSlug) {
      const { data: org } = await supabaseAdmin
        .from('organizations')
        .select('id')
        .eq('slug', orgSlug.toLowerCase())
        .single();
      if (org) orgId = org.id;
    }

    // Create initial profile with free tier + opt-in values
    console.log(`[signup] Creating profile for ${normalizedEmail}: first_name="${formattedFirstName}", last_name="${formattedLastName}"`)

    const profilePayload = {
      user_id: userId,
      email: normalizedEmail,
      first_name: formattedFirstName,
      last_name: formattedLastName,
      ...(branch ? { branch } : {}),
      ...(paygrade ? { paygrade } : {}),
      subscription_tier: 'free',
      plan: 'free',
      onboarding_completed: false,
      auth_method: 'otp',
      ...(employerSharingOptIn != null ? { employer_sharing_opt_in: !!employerSharingOptIn } : {}),
      ...(marketingOptIn != null ? { marketing_opt_in: !!marketingOptIn } : {}),
      ...(orgId ? { org_id: orgId } : {}),
    }

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'user_id' });

    if (profileError) {
      console.error(`[signup] Upsert failed for ${normalizedEmail}:`, profileError.message)

      // Fallback: the trigger may have created the row — try a direct UPDATE
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          first_name: formattedFirstName,
          last_name: formattedLastName,
          email: normalizedEmail,
          ...(branch ? { branch } : {}),
          ...(paygrade ? { paygrade } : {}),
          auth_method: 'otp',
          ...(employerSharingOptIn != null ? { employer_sharing_opt_in: !!employerSharingOptIn } : {}),
          ...(marketingOptIn != null ? { marketing_opt_in: !!marketingOptIn } : {}),
          ...(orgId ? { org_id: orgId } : {}),
        })
        .eq('user_id', userId)

      if (updateError) {
        console.error(`[signup] UPDATE fallback also failed for ${normalizedEmail}:`, updateError.message)
      } else {
        console.log(`[signup] UPDATE fallback succeeded for ${normalizedEmail}`)
      }
    } else {
      console.log(`[signup] Profile upsert succeeded for ${normalizedEmail}`)
    }

    // Verify the profile has names (catch silent failures)
    const { data: verifyProfile } = await supabaseAdmin
      .from('profiles')
      .select('first_name, last_name')
      .eq('user_id', userId)
      .single()

    if (verifyProfile && (!verifyProfile.first_name || !verifyProfile.last_name)) {
      console.error(`[signup] CRITICAL: Profile names empty after creation for ${normalizedEmail}. first_name="${verifyProfile.first_name}", last_name="${verifyProfile.last_name}". Attempting direct fix.`)
      await supabaseAdmin
        .from('profiles')
        .update({ first_name: formattedFirstName, last_name: formattedLastName })
        .eq('user_id', userId)
    }

    // Auto-add to org as member if signing up via white-label
    if (orgId) {
      await supabaseAdmin
        .from('organization_members')
        .upsert({
          org_id: orgId,
          user_id: userId,
          role: 'member',
        }, { onConflict: 'org_id,user_id' })
        .then(() => {})
        .catch((err: Error) => console.error('Failed to add user to org:', err));
    }

    return NextResponse.json({
      success: true,
      message: 'If this email is eligible, an account will be created.',
    });

  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json(
      { success: false, error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
