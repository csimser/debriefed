-- Testimonials table for inline post-action feedback
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  testimonial_consent BOOLEAN NOT NULL DEFAULT false,
  feature_context TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for querying by user
CREATE INDEX IF NOT EXISTS idx_testimonials_user_id ON testimonials(user_id);

-- Index for admin queries: consented testimonials for display
CREATE INDEX IF NOT EXISTS idx_testimonials_consent ON testimonials(testimonial_consent) WHERE testimonial_consent = true;

-- RLS policies
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Users can insert their own testimonials
CREATE POLICY "Users can insert own testimonials"
  ON testimonials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can read their own testimonials
CREATE POLICY "Users can read own testimonials"
  ON testimonials FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can read all (for admin dashboard)
CREATE POLICY "Service role can read all testimonials"
  ON testimonials FOR SELECT
  USING (auth.role() = 'service_role');

-- Add feedback_submitted flag to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS feedback_submitted BOOLEAN DEFAULT false;
