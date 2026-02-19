-- ============================================================================
-- Migration: Widen ALL VARCHAR columns in dict_* tables to TEXT
-- Date: 2026-02-20
-- Purpose: Permanently eliminate VARCHAR(10) truncation issues
--
-- This migration:
-- 1. Saves definitions of any views that depend on dict_ tables
-- 2. Drops those views
-- 3. ALTERs every VARCHAR column in every dict_ table to TEXT
-- 4. Recreates the views
--
-- Safe to run multiple times (idempotent).
-- ============================================================================

BEGIN;

-- Step 1: Save dependent view definitions and drop them
DO $$
DECLARE
  view_rec RECORD;
  view_defs TEXT[] := '{}';
BEGIN
  -- Find views that depend on dict_ tables
  FOR view_rec IN
    SELECT DISTINCT
      v.viewname,
      pg_get_viewdef(c.oid, true) AS view_def
    FROM pg_views v
    JOIN pg_class c ON c.relname = v.viewname AND c.relkind = 'v'
    JOIN pg_depend d ON d.objid = c.oid
    JOIN pg_class ref ON ref.oid = d.refobjid
    WHERE ref.relname LIKE 'dict_%'
      AND v.schemaname = 'public'
  LOOP
    RAISE NOTICE 'Saving and dropping view: %', view_rec.viewname;
    -- Store definition for recreation
    view_defs := array_append(view_defs,
      format('CREATE OR REPLACE VIEW %I AS %s', view_rec.viewname, view_rec.view_def));
    -- Drop the view
    EXECUTE format('DROP VIEW IF EXISTS %I CASCADE', view_rec.viewname);
  END LOOP;

  -- Step 2: ALTER every VARCHAR column in every dict_ table to TEXT
  FOR view_rec IN
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name LIKE 'dict_%'
      AND data_type = 'character varying'
    ORDER BY table_name, ordinal_position
  LOOP
    RAISE NOTICE 'Widening %.% from VARCHAR to TEXT', view_rec.table_name, view_rec.column_name;
    EXECUTE format('ALTER TABLE %I ALTER COLUMN %I TYPE TEXT', view_rec.table_name, view_rec.column_name);
  END LOOP;

  -- Also fix ai_generated_translations table which has branch/context columns
  FOR view_rec IN
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ai_generated_translations'
      AND data_type = 'character varying'
    ORDER BY ordinal_position
  LOOP
    RAISE NOTICE 'Widening %.% from VARCHAR to TEXT', view_rec.table_name, view_rec.column_name;
    EXECUTE format('ALTER TABLE %I ALTER COLUMN %I TYPE TEXT', view_rec.table_name, view_rec.column_name);
  END LOOP;

  -- Step 3: Recreate any views that were dropped
  FOR view_rec IN
    SELECT unnest(view_defs) AS view_sql
  LOOP
    IF view_rec.view_sql IS NOT NULL AND view_rec.view_sql != '' THEN
      RAISE NOTICE 'Recreating view: %', view_rec.view_sql;
      EXECUTE view_rec.view_sql;
    END IF;
  END LOOP;
END $$;

COMMIT;

-- Verification: This should return zero rows after migration
-- SELECT table_name, column_name, data_type, character_maximum_length
-- FROM information_schema.columns
-- WHERE table_schema = 'public'
--   AND table_name LIKE 'dict_%'
--   AND data_type = 'character varying';
