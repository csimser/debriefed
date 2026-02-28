-- Resume version history: named snapshots users can save and restore
-- Max 10 versions per resume enforced at application level

CREATE TABLE IF NOT EXISTS resume_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version_name TEXT NOT NULL,
  resume_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookups by resume
CREATE INDEX idx_resume_versions_resume_id ON resume_versions(resume_id, created_at DESC);
CREATE INDEX idx_resume_versions_user_id ON resume_versions(user_id);

-- RLS: users can only access their own versions
ALTER TABLE resume_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own versions"
  ON resume_versions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own versions"
  ON resume_versions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own versions"
  ON resume_versions FOR DELETE
  USING (user_id = auth.uid());
