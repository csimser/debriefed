ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_skipped BOOLEAN DEFAULT false;
