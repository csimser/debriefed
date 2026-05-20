-- Add employment_type to experience table to support civilian jobs
-- military = existing military job entries (default for backwards compatibility)
-- civilian = civilian employment (before, during, or after military service)

ALTER TABLE experience ADD COLUMN IF NOT EXISTS employment_type TEXT DEFAULT 'military' CHECK (employment_type IN ('military', 'civilian'));

-- Add company_name field for civilian jobs (organization can still be used, but company_name is more intuitive)
ALTER TABLE experience ADD COLUMN IF NOT EXISTS company_name TEXT;

-- Update existing records to use 'military' as the default
UPDATE experience SET employment_type = 'military' WHERE employment_type IS NULL;

-- Add index for filtering by employment type
CREATE INDEX IF NOT EXISTS idx_experience_employment_type ON experience(employment_type);

COMMENT ON COLUMN experience.employment_type IS 'Type of employment: military or civilian';
COMMENT ON COLUMN experience.company_name IS 'Company name for civilian employment (alias for organization)';
