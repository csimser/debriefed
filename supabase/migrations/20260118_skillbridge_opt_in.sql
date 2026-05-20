-- Add skillbridge_opt_in column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS skillbridge_opt_in BOOLEAN DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN profiles.skillbridge_opt_in IS 'Whether user is interested in DoD SkillBridge opportunities';
