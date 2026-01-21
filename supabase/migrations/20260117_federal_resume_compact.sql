-- Federal Resume Compact Format - Additional Fields
-- Adds supervisor info, salary, and federal job-specific fields

-- Add supervisor and salary fields to experience table
ALTER TABLE experiences
  ADD COLUMN IF NOT EXISTS supervisor_name VARCHAR(100),
  ADD COLUMN IF NOT EXISTS supervisor_phone VARCHAR(20),
  ADD COLUMN IF NOT EXISTS supervisor_can_contact BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS salary VARCHAR(50);

-- Add federal job application fields to resumes table
ALTER TABLE resumes
  ADD COLUMN IF NOT EXISTS announcement_number VARCHAR(50),
  ADD COLUMN IF NOT EXISTS veterans_preference BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS federal_civilian_status VARCHAR(50),
  ADD COLUMN IF NOT EXISTS citizenship VARCHAR(20) DEFAULT 'USA';

-- Add zip_code to profiles if not exists (for federal resume header)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS zip_code VARCHAR(10);
