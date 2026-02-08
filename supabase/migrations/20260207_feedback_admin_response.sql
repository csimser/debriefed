-- Add admin_response column to user_feedback for replies visible to users
ALTER TABLE user_feedback ADD COLUMN IF NOT EXISTS admin_response TEXT;
