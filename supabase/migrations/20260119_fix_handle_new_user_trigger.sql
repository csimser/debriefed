-- Fix handle_new_user trigger to read first_name/last_name directly from metadata
-- and transfer branch/paygrade from signup metadata

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  full_name_parts TEXT[];
  fname TEXT;
  lname TEXT;
BEGIN
  -- Read first_name and last_name directly from metadata (new signup flow)
  -- Fall back to parsing full_name for backwards compatibility
  fname := COALESCE(
    NEW.raw_user_meta_data->>'first_name',
    (string_to_array(COALESCE(NEW.raw_user_meta_data->>'full_name', ''), ' '))[1],
    ''
  );
  lname := COALESCE(
    NEW.raw_user_meta_data->>'last_name',
    array_to_string((string_to_array(COALESCE(NEW.raw_user_meta_data->>'full_name', ''), ' '))[2:], ' '),
    ''
  );

  INSERT INTO public.profiles (
    id,
    user_id,
    email,
    first_name,
    last_name,
    branch,
    paygrade,
    tier,
    subscription_tier,
    is_admin,
    onboarding_completed
  )
  VALUES (
    gen_random_uuid(),
    NEW.id,
    NEW.email,
    fname,
    lname,
    COALESCE(NEW.raw_user_meta_data->>'branch', NULL),
    COALESCE(NEW.raw_user_meta_data->>'paygrade', NULL),
    'free',
    'free',
    false,
    false
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists (recreate if needed)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
