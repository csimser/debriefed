-- Federal Resume Fields Migration
-- Adds USAJOBS-specific fields for federal resume support

-- Add federal fields to experience table
ALTER TABLE experience
  ADD COLUMN IF NOT EXISTS hours_per_week INTEGER DEFAULT 40,
  ADD COLUMN IF NOT EXISTS pay_grade VARCHAR(20);

-- Add special eligibility to profiles (array of eligibility codes)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS special_eligibility TEXT[];

-- Create training table for job-related training (federal resumes)
CREATE TABLE IF NOT EXISTS training (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(200) NOT NULL,
  provider VARCHAR(200),
  completion_date VARCHAR(20),
  hours INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create languages table for language skills (federal resumes)
CREATE TABLE IF NOT EXISTS languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  language VARCHAR(50) NOT NULL,
  proficiency VARCHAR(50), -- native, fluent, professional, limited, elementary
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create affiliations table for professional organizations
CREATE TABLE IF NOT EXISTS affiliations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(200) NOT NULL,
  role VARCHAR(100),
  start_date VARCHAR(20),
  end_date VARCHAR(20),
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create publications table (optional for federal)
CREATE TABLE IF NOT EXISTS publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(300) NOT NULL,
  publication VARCHAR(200),
  date VARCHAR(20),
  url VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE training ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

-- RLS policies for training
CREATE POLICY "Users can view own training" ON training
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training" ON training
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own training" ON training
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own training" ON training
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for languages
CREATE POLICY "Users can view own languages" ON languages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own languages" ON languages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own languages" ON languages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own languages" ON languages
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for affiliations
CREATE POLICY "Users can view own affiliations" ON affiliations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own affiliations" ON affiliations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own affiliations" ON affiliations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own affiliations" ON affiliations
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for publications
CREATE POLICY "Users can view own publications" ON publications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own publications" ON publications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own publications" ON publications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own publications" ON publications
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_training_user_id ON training(user_id);
CREATE INDEX IF NOT EXISTS idx_languages_user_id ON languages(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliations_user_id ON affiliations(user_id);
CREATE INDEX IF NOT EXISTS idx_publications_user_id ON publications(user_id);
