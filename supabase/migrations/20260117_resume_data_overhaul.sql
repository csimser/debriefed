-- Resume Data Capture & Bullet Management Overhaul
-- Adds missing fields, bullet status, and federal job info

-- Add status to bullets
ALTER TABLE experience_bullets
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';

-- Update existing accepted bullets
UPDATE experience_bullets SET status = 'accepted' WHERE is_accepted = true AND status = 'pending';

-- Federal fields on experience
ALTER TABLE experience
  ADD COLUMN IF NOT EXISTS city VARCHAR(100),
  ADD COLUMN IF NOT EXISTS state VARCHAR(2),
  ADD COLUMN IF NOT EXISTS hours_per_week INTEGER DEFAULT 40,
  ADD COLUMN IF NOT EXISTS salary VARCHAR(50),
  ADD COLUMN IF NOT EXISTS grade_level VARCHAR(20),
  ADD COLUMN IF NOT EXISTS supervisor_name VARCHAR(100),
  ADD COLUMN IF NOT EXISTS supervisor_phone VARCHAR(20),
  ADD COLUMN IF NOT EXISTS supervisor_can_contact BOOLEAN DEFAULT true;

-- Migrate existing location data to city/state if possible
-- (location format is typically "City, ST")
UPDATE experience
SET
  city = TRIM(SPLIT_PART(location, ',', 1)),
  state = TRIM(SPLIT_PART(location, ',', 2))
WHERE location IS NOT NULL
  AND location LIKE '%,%'
  AND city IS NULL;

-- Federal info per resume
CREATE TABLE IF NOT EXISTS resume_federal_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  announcement_number VARCHAR(50),
  position_title VARCHAR(200),
  series_grade VARCHAR(50),
  citizenship VARCHAR(50) DEFAULT 'USA',
  veterans_preference BOOLEAN DEFAULT false,
  federal_civilian_status VARCHAR(50) DEFAULT 'N/A',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(resume_id)
);

-- Resume-specific skills selection
CREATE TABLE IF NOT EXISTS resume_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  skill VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resume-specific professional summary (can override profile default)
ALTER TABLE resumes
  ADD COLUMN IF NOT EXISTS professional_summary TEXT;

-- Enable RLS on resume_federal_info
ALTER TABLE resume_federal_info ENABLE ROW LEVEL SECURITY;

-- RLS policies for resume_federal_info
CREATE POLICY "Users can view own resume federal info" ON resume_federal_info
  FOR SELECT USING (
    resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own resume federal info" ON resume_federal_info
  FOR INSERT WITH CHECK (
    resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own resume federal info" ON resume_federal_info
  FOR UPDATE USING (
    resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own resume federal info" ON resume_federal_info
  FOR DELETE USING (
    resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid())
  );

-- Enable RLS on resume_skills
ALTER TABLE resume_skills ENABLE ROW LEVEL SECURITY;

-- RLS policies for resume_skills
CREATE POLICY "Users can view own resume skills" ON resume_skills
  FOR SELECT USING (
    resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own resume skills" ON resume_skills
  FOR INSERT WITH CHECK (
    resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own resume skills" ON resume_skills
  FOR UPDATE USING (
    resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own resume skills" ON resume_skills
  FOR DELETE USING (
    resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid())
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_resume_federal_info_resume_id ON resume_federal_info(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_skills_resume_id ON resume_skills(resume_id);
CREATE INDEX IF NOT EXISTS idx_experience_bullets_status ON experience_bullets(status);
