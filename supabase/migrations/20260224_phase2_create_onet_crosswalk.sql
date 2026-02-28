-- =============================================================================
-- Phase 2: Create dict_onet_crosswalk table
-- Official DoD Military-to-O*NET Occupation Crosswalk
-- Source: milx0724.csv (DoD DMDC crosswalk, July 2024 release)
-- Run BEFORE the data insert scripts
-- =============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS dict_onet_crosswalk (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  svc TEXT NOT NULL,
  moc TEXT NOT NULL,
  moc_title TEXT NOT NULL,
  onet_code TEXT,
  onet_title TEXT,
  soc_code TEXT,
  soc_title TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_onet_crosswalk_moc ON dict_onet_crosswalk (moc);
CREATE INDEX IF NOT EXISTS idx_onet_crosswalk_onet_code ON dict_onet_crosswalk (onet_code);
CREATE INDEX IF NOT EXISTS idx_onet_crosswalk_svc ON dict_onet_crosswalk (svc);
CREATE INDEX IF NOT EXISTS idx_onet_crosswalk_svc_moc ON dict_onet_crosswalk (svc, moc);

-- RLS: public read access (matches other dict_ tables)
ALTER TABLE dict_onet_crosswalk ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read onet crosswalk"
  ON dict_onet_crosswalk FOR SELECT
  USING (true);

COMMIT;
