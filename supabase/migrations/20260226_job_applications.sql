-- Job application tracking: veterans can log job search outcomes tied to specific resumes
-- Tracks interviews, callbacks, offers, rejections to identify which resume versions work

CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  applied_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'applied'
    CHECK (status IN ('applied', 'callback', 'interview', 'offer', 'rejected', 'accepted')),
  notes TEXT,
  salary_offered INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for fast lookups
CREATE INDEX idx_job_applications_user_id ON job_applications(user_id, applied_date DESC);
CREATE INDEX idx_job_applications_status ON job_applications(user_id, status);
CREATE INDEX idx_job_applications_resume ON job_applications(resume_id);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_job_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_job_applications_updated_at();

-- RLS: users can only access their own applications
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own applications"
  ON job_applications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own applications"
  ON job_applications FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own applications"
  ON job_applications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own applications"
  ON job_applications FOR DELETE
  USING (user_id = auth.uid());
