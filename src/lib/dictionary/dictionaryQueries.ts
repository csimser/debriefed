/**
 * Dictionary Translation Engine — Data Layer
 *
 * Fetches all dict_* tables from Supabase in parallel and caches
 * in a module-level variable for the browser session (~500KB total).
 * Uses the existing browser Supabase client.
 */

import { createClient } from '@/lib/supabase/client';
import type {
  DictionaryCache,
  DictAcronym,
  DictActionVerb,
  DictAtsKeyword,
  DictBulletPattern,
  DictCertFunding,
  DictCoverLetterTemplate,
  DictEvalPhrase,
  DictFundingProgram,
  DictGapRecommendation,
  DictIndustryFraming,
  DictLinkedinKeyword,
  DictLinkedinTemplate,
  DictMilitaryJargon,
  DictMosToCivilian,
  DictRankEquivalent,
  DictPhraseTranslation,
  DictQuantificationHelper,
  DictResumeTemplate,
  DictProfessionalSummary,
  DictSoftSkill,
} from './types';

// Module-level cache — persists for the browser session
let cache: DictionaryCache | null = null;
let loadPromise: Promise<DictionaryCache> | null = null;

/**
 * Load all dictionary tables from Supabase into memory.
 * Fetches 20 tables in parallel via Promise.all.
 * Subsequent calls return the cached result instantly.
 */
export async function loadDictionary(): Promise<DictionaryCache> {
  if (cache) return cache;
  // Prevent duplicate parallel loads
  if (loadPromise) return loadPromise;

  loadPromise = fetchAllTables();
  try {
    cache = await loadPromise;
    return cache;
  } finally {
    loadPromise = null;
  }
}

/**
 * Get the cached dictionary data. Loads from Supabase if not yet cached.
 * This is the primary entry point for other engine modules.
 */
export async function getDictionary(): Promise<DictionaryCache> {
  return loadDictionary();
}

/**
 * Force reload all dictionary data from Supabase.
 * Use after admin edits to dictionary tables.
 */
export async function reloadDictionary(): Promise<DictionaryCache> {
  cache = null;
  loadPromise = null;
  return loadDictionary();
}

/**
 * Check if the dictionary cache is populated.
 */
export function isDictionaryLoaded(): boolean {
  return cache !== null;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function fetchAllTables(): Promise<DictionaryCache> {
  const supabase = createClient();

  const [
    acronyms,
    actionVerbs,
    atsKeywords,
    bulletPatterns,
    certFunding,
    coverLetterTemplates,
    evalPhrases,
    fundingPrograms,
    gapRecommendations,
    industryFraming,
    linkedinKeywords,
    linkedinTemplates,
    militaryJargon,
    mosToCivilian,
    rankEquivalents,
    phraseTranslations,
    quantificationHelpers,
    resumeTemplates,
    professionalSummaries,
    softSkills,
  ] = await Promise.all([
    fetchTable<DictAcronym>(supabase, 'dict_acronyms'),
    fetchTable<DictActionVerb>(supabase, 'dict_action_verbs'),
    fetchTable<DictAtsKeyword>(supabase, 'dict_ats_keywords'),
    fetchTable<DictBulletPattern>(supabase, 'dict_bullet_patterns'),
    fetchTable<DictCertFunding>(supabase, 'dict_cert_funding'),
    fetchTable<DictCoverLetterTemplate>(supabase, 'dict_cover_letter_templates'),
    fetchTable<DictEvalPhrase>(supabase, 'dict_eval_phrases'),
    fetchTable<DictFundingProgram>(supabase, 'dict_funding_programs'),
    fetchTable<DictGapRecommendation>(supabase, 'dict_gap_recommendations'),
    fetchTable<DictIndustryFraming>(supabase, 'dict_industry_framing'),
    fetchTable<DictLinkedinKeyword>(supabase, 'dict_linkedin_keywords'),
    fetchTable<DictLinkedinTemplate>(supabase, 'dict_linkedin_templates'),
    fetchTable<DictMilitaryJargon>(supabase, 'dict_military_jargon'),
    fetchTable<DictMosToCivilian>(supabase, 'dict_mos_to_civilian'),
    fetchTable<DictRankEquivalent>(supabase, 'dict_rank_equivalents'),
    fetchTable<DictPhraseTranslation>(supabase, 'dict_phrase_translations'),
    fetchTable<DictQuantificationHelper>(supabase, 'dict_quantification_helpers'),
    fetchTable<DictResumeTemplate>(supabase, 'dict_resume_templates'),
    fetchTable<DictProfessionalSummary>(supabase, 'dict_professional_summaries'),
    fetchTable<DictSoftSkill>(supabase, 'dict_soft_skills'),
  ]);

  return {
    acronyms,
    actionVerbs,
    atsKeywords,
    bulletPatterns,
    certFunding,
    coverLetterTemplates,
    evalPhrases,
    fundingPrograms,
    gapRecommendations,
    industryFraming,
    linkedinKeywords,
    linkedinTemplates,
    militaryJargon,
    mosToCivilian,
    rankEquivalents,
    phraseTranslations,
    quantificationHelpers,
    resumeTemplates,
    professionalSummaries,
    softSkills,
  };
}

/**
 * Fetch a single table with error handling.
 * Returns empty array on failure so one bad table doesn't break the whole cache.
 */
async function fetchTable<T>(
  supabase: ReturnType<typeof createClient>,
  tableName: string,
): Promise<T[]> {
  const { data, error } = await supabase.from(tableName).select('*');
  if (error) {
    console.error(`[DictionaryEngine] Failed to fetch ${tableName}:`, error.message);
    return [];
  }
  return (data ?? []) as T[];
}
