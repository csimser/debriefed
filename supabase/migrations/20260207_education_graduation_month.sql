-- Add graduation_month column to education table
-- StepEducation already writes this field; ensure the column exists
ALTER TABLE education ADD COLUMN IF NOT EXISTS graduation_month TEXT;
