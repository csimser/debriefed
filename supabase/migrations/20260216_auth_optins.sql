-- Migration: Add OTP auth support + opt-in columns to profiles
-- Date: 2026-02-16
-- DO NOT EXECUTE — review first

-- Add opt-in and auth_method columns to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS auth_method text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS employer_sharing_opt_in boolean DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS marketing_opt_in boolean DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS opt_in_prompted_at timestamptz DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS opt_in_dismiss_count integer DEFAULT 0;

-- Index for querying users who haven't been prompted
CREATE INDEX IF NOT EXISTS idx_profiles_opt_in_prompted
  ON profiles (user_id)
  WHERE employer_sharing_opt_in IS NULL AND marketing_opt_in IS NULL;

COMMENT ON COLUMN profiles.auth_method IS 'Last auth method used: password or otp';
COMMENT ON COLUMN profiles.employer_sharing_opt_in IS 'NULL=never asked, FALSE=declined, TRUE=opted in';
COMMENT ON COLUMN profiles.marketing_opt_in IS 'NULL=never asked, FALSE=declined, TRUE=opted in';
COMMENT ON COLUMN profiles.opt_in_prompted_at IS 'When the user was last shown the opt-in prompt';
COMMENT ON COLUMN profiles.opt_in_dismiss_count IS 'How many times user dismissed the opt-in prompt';

-- Add eval upload bonus credits column (for eval pack purchases)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS eval_uploads_bonus integer DEFAULT 0;

COMMENT ON COLUMN profiles.eval_uploads_bonus IS 'Bonus eval upload credits from eval pack purchases';
