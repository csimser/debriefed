-- Drop key_achievements column from resumes table
-- Executive template redesign removed the Key Achievements feature entirely
ALTER TABLE resumes DROP COLUMN IF EXISTS key_achievements;
