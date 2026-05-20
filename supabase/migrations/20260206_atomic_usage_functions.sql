-- Migration: Atomic Usage Increment Functions
-- Date: 2026-02-06
-- Description: Adds atomic RPC functions for all usage tables to prevent race conditions.
--   Fixes: legacy usage table (SELECT+UPDATE race), usage_tracking (upsert resets count),
--   and daily_usage (returns count for checking).

-- =====================================================
-- FIX 1: Atomic increment for legacy `usage` table
-- Replaces the SELECT-then-UPDATE pattern in usage-tracking.ts
-- =====================================================
CREATE OR REPLACE FUNCTION increment_usage_field(
  p_user_id UUID,
  p_field TEXT,
  p_amount INT DEFAULT 1
) RETURNS INT AS $$
DECLARE
  new_value INT;
BEGIN
  -- Validate field name to prevent SQL injection via dynamic column
  IF p_field NOT IN (
    'resumes_created', 'resumes_downloaded', 'cover_letters', 'job_matches',
    'eval_uploads', 'bullet_rewrites', 'ai_summaries', 'private_downloads',
    'federal_downloads', 'linkedin_generations', 'resume_imports'
  ) THEN
    RAISE EXCEPTION 'Invalid usage field: %', p_field;
  END IF;

  -- Atomic INSERT ... ON CONFLICT (handles both new and existing rows)
  EXECUTE format(
    'INSERT INTO usage (user_id, %I) VALUES ($1, $2)
     ON CONFLICT (user_id)
     DO UPDATE SET %I = COALESCE(usage.%I, 0) + $2, updated_at = NOW()
     RETURNING %I',
    p_field, p_field, p_field, p_field
  ) INTO new_value USING p_user_id, p_amount;

  RETURN COALESCE(new_value, p_amount);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION increment_usage_field TO authenticated;

-- =====================================================
-- FIX 2: Atomic increment for `usage_tracking` table
-- Replaces the broken upsert in usage-service.ts that resets count to 1
-- =====================================================
CREATE OR REPLACE FUNCTION increment_usage_tracking(
  p_user_id UUID,
  p_feature TEXT,
  p_period_start TIMESTAMPTZ,
  p_period_end TIMESTAMPTZ,
  p_amount INT DEFAULT 1
) RETURNS INT AS $$
DECLARE
  new_count INT;
BEGIN
  INSERT INTO usage_tracking (user_id, feature, period_start, period_end, count, updated_at)
  VALUES (p_user_id, p_feature, p_period_start, p_period_end, p_amount, NOW())
  ON CONFLICT (user_id, feature, period_start)
  DO UPDATE SET count = usage_tracking.count + p_amount, updated_at = NOW()
  RETURNING count INTO new_count;

  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION increment_usage_tracking TO authenticated;

-- =====================================================
-- FIX 3: Replace `increment_daily_usage` to return count
-- Existing function is already atomic but returns VOID
-- =====================================================
DROP FUNCTION IF EXISTS increment_daily_usage(UUID, VARCHAR, DATE);

CREATE OR REPLACE FUNCTION increment_daily_usage(
  p_user_id UUID,
  p_feature TEXT,
  p_date DATE DEFAULT CURRENT_DATE,
  p_amount INT DEFAULT 1
) RETURNS INT AS $$
DECLARE
  new_count INT;
BEGIN
  INSERT INTO daily_usage (user_id, feature, date, count)
  VALUES (p_user_id, p_feature, p_date, p_amount)
  ON CONFLICT (user_id, feature, date)
  DO UPDATE SET count = daily_usage.count + p_amount
  RETURNING count INTO new_count;

  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION increment_daily_usage TO authenticated;
