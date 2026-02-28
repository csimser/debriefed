-- =============================================================================
-- Phase 1: Schema Additions for Dictionary Tables
-- Adds columns that exist in the latest CSV exports but may be missing from DB
-- Run FIRST, before the upsert scripts
-- =============================================================================

BEGIN;

-- dict_mos_to_civilian: add onet_codes and description columns
ALTER TABLE dict_mos_to_civilian ADD COLUMN IF NOT EXISTS military_title TEXT;
ALTER TABLE dict_mos_to_civilian ADD COLUMN IF NOT EXISTS onet_codes TEXT[] DEFAULT '{}';
ALTER TABLE dict_mos_to_civilian ADD COLUMN IF NOT EXISTS description TEXT;

-- dict_military_jargon: add example columns
ALTER TABLE dict_military_jargon ADD COLUMN IF NOT EXISTS example_military TEXT;
ALTER TABLE dict_military_jargon ADD COLUMN IF NOT EXISTS example_civilian TEXT;

-- dict_phrase_translations: add context_notes column
ALTER TABLE dict_phrase_translations ADD COLUMN IF NOT EXISTS context_notes TEXT;

COMMIT;
