-- ============================================================================
-- AI-Generated Translations Pipeline
-- Captures term-for-term mappings from AI translation calls for admin review
-- and eventual insertion into the dictionary tables.
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_generated_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_type TEXT NOT NULL,             -- 'bullet_translation', 'cover_letter', 'linkedin_headline', 'linkedin_summary', 'job_match', 'eval_extraction', 'summary_generation'
  military_term TEXT NOT NULL,           -- the specific military term/phrase that was translated
  civilian_translation TEXT NOT NULL,    -- the specific civilian equivalent AI produced
  full_context TEXT,                     -- the full original bullet/sentence for reference
  model_used TEXT,                       -- 'haiku', 'sonnet'
  user_id UUID REFERENCES auth.users(id),
  branch TEXT,                           -- user's branch
  target_industry TEXT,                  -- user's target industry
  target_role TEXT,                      -- user's target role
  suggested_table TEXT,                  -- auto-suggested: 'dict_phrase_translations', 'dict_military_jargon', 'dict_acronyms', etc.
  status TEXT DEFAULT 'pending',         -- 'pending', 'approved', 'rejected', 'modified'
  approved_by UUID,                      -- admin who approved
  approved_at TIMESTAMPTZ,
  dict_table TEXT,                       -- which dictionary table it was actually added to
  dict_entry_id UUID,                    -- the dictionary entry created from this
  created_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,                            -- admin notes on modification
  occurrence_count INTEGER DEFAULT 1     -- how many times this same term has been translated by AI
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_ai_translations_status ON ai_generated_translations(status);
CREATE INDEX IF NOT EXISTS idx_ai_translations_source ON ai_generated_translations(source_type);
CREATE INDEX IF NOT EXISTS idx_ai_translations_created ON ai_generated_translations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_translations_term ON ai_generated_translations(military_term);
CREATE INDEX IF NOT EXISTS idx_ai_translations_occurrence ON ai_generated_translations(occurrence_count DESC);

-- RLS policies
ALTER TABLE ai_generated_translations ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (used by API routes)
CREATE POLICY "service_role_all" ON ai_generated_translations
  FOR ALL USING (true) WITH CHECK (true);

-- Authenticated users cannot read other users' translations directly
-- (admin dashboard uses service role client)

-- ============================================================================
-- RPC: Upsert an AI translation — increment occurrence_count if duplicate
-- ============================================================================
CREATE OR REPLACE FUNCTION upsert_ai_translation(
  p_source_type TEXT,
  p_military_term TEXT,
  p_civilian_translation TEXT,
  p_full_context TEXT DEFAULT NULL,
  p_model_used TEXT DEFAULT NULL,
  p_user_id UUID DEFAULT NULL,
  p_branch TEXT DEFAULT NULL,
  p_target_industry TEXT DEFAULT NULL,
  p_target_role TEXT DEFAULT NULL,
  p_suggested_table TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_normalized TEXT;
  v_existing_id UUID;
  v_existing_count INTEGER;
BEGIN
  v_normalized := LOWER(TRIM(p_military_term));

  -- Check for existing pending/approved entry with same term
  SELECT id, occurrence_count INTO v_existing_id, v_existing_count
  FROM ai_generated_translations
  WHERE LOWER(TRIM(military_term)) = v_normalized
    AND status IN ('pending', 'approved')
  LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
    -- Increment occurrence count
    UPDATE ai_generated_translations
    SET occurrence_count = v_existing_count + 1
    WHERE id = v_existing_id;
  ELSE
    -- Insert new record
    INSERT INTO ai_generated_translations (
      source_type, military_term, civilian_translation, full_context,
      model_used, user_id, branch, target_industry, target_role, suggested_table
    ) VALUES (
      p_source_type, v_normalized, p_civilian_translation, p_full_context,
      p_model_used, p_user_id, p_branch, p_target_industry, p_target_role, p_suggested_table
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- RPC: Approve an AI translation and insert into the correct dictionary table
-- ============================================================================
CREATE OR REPLACE FUNCTION approve_ai_translation(
  p_translation_id UUID,
  p_admin_id UUID,
  p_dict_table TEXT DEFAULT NULL,        -- override auto-suggested table
  p_military_override TEXT DEFAULT NULL,  -- override military term
  p_civilian_override TEXT DEFAULT NULL,  -- override civilian translation
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_rec RECORD;
  v_military TEXT;
  v_civilian TEXT;
  v_table TEXT;
  v_entry_id UUID;
BEGIN
  SELECT * INTO v_rec FROM ai_generated_translations WHERE id = p_translation_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Translation not found';
  END IF;

  v_military := COALESCE(p_military_override, v_rec.military_term);
  v_civilian := COALESCE(p_civilian_override, v_rec.civilian_translation);
  v_table := COALESCE(p_dict_table, v_rec.suggested_table, 'dict_phrase_translations');

  IF v_civilian IS NULL OR v_civilian = '' THEN
    RAISE EXCEPTION 'No civilian translation provided';
  END IF;

  -- Insert into the correct dictionary table
  IF v_table = 'dict_acronyms' THEN
    INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category)
    VALUES (UPPER(v_military), v_civilian, v_civilian, v_rec.branch, 'ai_generated')
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_entry_id;

  ELSIF v_table = 'dict_military_jargon' THEN
    INSERT INTO dict_military_jargon (military_term, civilian_equivalent, branch, category)
    VALUES (v_military, v_civilian, v_rec.branch, 'ai_generated')
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_entry_id;

  ELSIF v_table = 'dict_phrase_translations' THEN
    INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category)
    VALUES (v_military, v_civilian, v_rec.branch, 'ai_generated')
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_entry_id;

  ELSIF v_table = 'dict_bullet_patterns' THEN
    INSERT INTO dict_bullet_patterns (pattern_template, category, branch)
    VALUES (v_civilian, 'ai_generated', v_rec.branch)
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_entry_id;

  ELSE
    -- Default to phrase translations
    INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category)
    VALUES (v_military, v_civilian, v_rec.branch, 'ai_generated')
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_entry_id;
  END IF;

  -- Update the AI translation record
  UPDATE ai_generated_translations
  SET status = CASE WHEN p_military_override IS NOT NULL OR p_civilian_override IS NOT NULL THEN 'modified' ELSE 'approved' END,
      approved_by = p_admin_id,
      approved_at = NOW(),
      dict_table = v_table,
      dict_entry_id = v_entry_id,
      notes = p_notes,
      military_term = v_military,
      civilian_translation = v_civilian
  WHERE id = p_translation_id;

  RETURN v_entry_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION upsert_ai_translation TO authenticated;
GRANT EXECUTE ON FUNCTION approve_ai_translation TO authenticated;
