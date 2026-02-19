-- ============================================================================
-- Add status column to dict_missing_terms_log
-- Replaces boolean `resolved` with a proper status enum:
--   pending       — needs admin review (default)
--   added         — term was added to a dictionary table
--   dismissed     — admin dismissed (not useful right now)
--   false_positive — not a real military term (won't show again)
-- ============================================================================

-- Add status column with default 'pending'
ALTER TABLE dict_missing_terms_log
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

-- Migrate existing resolved=true rows to 'added' status
UPDATE dict_missing_terms_log
SET status = 'added'
WHERE resolved = TRUE AND status = 'pending';

-- Add check constraint for valid status values
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'dict_missing_terms_log_status_check'
  ) THEN
    ALTER TABLE dict_missing_terms_log
      ADD CONSTRAINT dict_missing_terms_log_status_check
      CHECK (status IN ('pending', 'added', 'dismissed', 'false_positive'));
  END IF;
END $$;

-- Index for efficient admin queries (pending terms sorted by hit_count)
CREATE INDEX IF NOT EXISTS idx_missing_terms_status_hits
  ON dict_missing_terms_log (status, hit_count DESC);
