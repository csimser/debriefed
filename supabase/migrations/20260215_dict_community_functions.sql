-- ============================================================================
-- Dictionary Community Submissions — RPC Functions
-- Tables (dict_submissions, dict_submission_upvotes, dict_missing_terms_log)
-- were deployed via debriefed-community-submissions.sql.
-- This migration adds the RPC functions used by the app.
-- ============================================================================

-- Add unique constraint on term (needed for upsert in increment_missing_term)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'dict_missing_terms_log_term_key'
  ) THEN
    ALTER TABLE dict_missing_terms_log ADD CONSTRAINT dict_missing_terms_log_term_key UNIQUE (term);
  END IF;
END $$;

-- Upsert a missing term: increment hit_count if it already exists, else insert.
-- Called silently from the bullet translator when dictionary coverage < 40%.
CREATE OR REPLACE FUNCTION increment_missing_term(
  p_term TEXT,
  p_source_context TEXT DEFAULT NULL,
  p_branch TEXT DEFAULT NULL,
  p_user_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO dict_missing_terms_log (term, source_context, branch, user_id, hit_count)
  VALUES (LOWER(TRIM(p_term)), p_source_context, p_branch, p_user_id, 1)
  ON CONFLICT (term)
  DO UPDATE SET
    hit_count = dict_missing_terms_log.hit_count + 1,
    source_context = COALESCE(EXCLUDED.source_context, dict_missing_terms_log.source_context),
    branch = COALESCE(EXCLUDED.branch, dict_missing_terms_log.branch);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Approve a community submission: update status and insert into the correct
-- dictionary table based on submission_type (jargon, acronym, eval_phrase, phrase).
-- Only callable by admin users.
CREATE OR REPLACE FUNCTION approve_submission(
  p_submission_id UUID,
  p_admin_id UUID DEFAULT NULL,
  p_civilian_override TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_sub RECORD;
  v_civilian TEXT;
BEGIN
  SELECT * INTO v_sub FROM dict_submissions WHERE id = p_submission_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Submission not found';
  END IF;

  -- Use override if provided, else the submitted value
  v_civilian := COALESCE(p_civilian_override, v_sub.suggested_civilian);
  IF v_civilian IS NULL OR v_civilian = '' THEN
    RAISE EXCEPTION 'No civilian equivalent provided';
  END IF;

  -- Update submission status
  UPDATE dict_submissions
  SET status = 'approved',
      reviewed_by = p_admin_id,
      reviewed_at = NOW(),
      suggested_civilian = v_civilian
  WHERE id = p_submission_id;

  -- Insert into the correct dictionary table
  IF v_sub.submission_type = 'jargon' THEN
    INSERT INTO dict_military_jargon (military_term, civilian_equivalent, branch, category)
    VALUES (v_sub.military_term, v_civilian, v_sub.branch, v_sub.category)
    ON CONFLICT DO NOTHING;

  ELSIF v_sub.submission_type = 'acronym' THEN
    INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category)
    VALUES (v_sub.military_term, v_civilian, v_civilian, v_sub.branch, v_sub.category)
    ON CONFLICT DO NOTHING;

  ELSIF v_sub.submission_type = 'eval_phrase' THEN
    INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, branch, category)
    VALUES (v_sub.military_term, v_civilian, 'general', v_sub.branch, v_sub.category)
    ON CONFLICT DO NOTHING;

  ELSIF v_sub.submission_type = 'phrase' THEN
    INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category)
    VALUES (v_sub.military_term, v_civilian, v_sub.branch, v_sub.category)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Mark any matching missing term as resolved
  UPDATE dict_missing_terms_log
  SET resolved = TRUE, resolved_at = NOW()
  WHERE LOWER(TRIM(term)) = LOWER(TRIM(v_sub.military_term));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users (RLS on tables still enforced)
GRANT EXECUTE ON FUNCTION increment_missing_term TO authenticated;
GRANT EXECUTE ON FUNCTION approve_submission TO authenticated;
