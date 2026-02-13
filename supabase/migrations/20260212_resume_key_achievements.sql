-- Add key_achievements column to resumes table
-- Stores bullet IDs selected as key achievements (used by Executive template)
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS key_achievements uuid[] DEFAULT '{}';
