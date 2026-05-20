-- Add last_login_at column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_at timestamptz;

-- Create index for sorting by last login
CREATE INDEX IF NOT EXISTS idx_profiles_last_login_at ON profiles(last_login_at DESC NULLS LAST);

-- Add comment for documentation
COMMENT ON COLUMN profiles.last_login_at IS 'Timestamp of user''s most recent login';
