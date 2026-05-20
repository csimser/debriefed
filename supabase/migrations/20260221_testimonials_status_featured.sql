-- Add status and featured columns to testimonials table
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'pending';
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;

-- Index for admin queries by status
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);

-- Index for public queries: approved + featured
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured) WHERE featured = true AND status = 'approved';

-- Allow service role to update testimonials (admin approve/reject/feature)
CREATE POLICY "Service role can update all testimonials"
  ON testimonials FOR UPDATE
  USING (auth.role() = 'service_role');
