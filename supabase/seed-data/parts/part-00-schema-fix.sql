-- ============================================================================
-- part-00-schema-fix.sql
-- RUN THIS FIRST before any seed data parts.
-- Finds ALL VARCHAR columns in ALL dict_* tables and widens them to TEXT.
-- Safe, idempotent, no-op if columns are already TEXT.
-- ============================================================================


-- BRANCH VALUES: Use lowercase abbreviations ONLY
-- army, navy, usaf, usmc, uscg, ussf, general
-- NEVER use full names like 'Coast Guard' or 'Air Force'
-- Domain context values (logistics, intelligence, cyber, etc.) are also valid
-- Run validate-branch-values.sh before pasting into Supabase

BEGIN;

DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name LIKE 'dict_%'
      AND data_type = 'character varying'
    ORDER BY table_name, ordinal_position
  LOOP
    RAISE NOTICE 'Widening %.% from VARCHAR to TEXT', rec.table_name, rec.column_name;
    EXECUTE format('ALTER TABLE %I ALTER COLUMN %I TYPE TEXT', rec.table_name, rec.column_name);
  END LOOP;
END $$;

COMMIT;

-- All VARCHAR columns in dict_* tables widened to TEXT. Now safe to run parts 01-11.
