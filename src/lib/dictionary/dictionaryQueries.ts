/**
 * Dictionary Translation Engine — Data Layer
 *
 * Loads all dictionary tables from the bundled JSON data files in parallel
 * and caches them in a module-level variable for the browser session.
 * (Previously fetched from Supabase; the data now ships with the app.)
 */

import { loadDataFile } from '@/lib/data/files.client';
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
 * Load all dictionary tables from the bundled data files into memory.
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
 * Get the cached dictionary data. Loads from the bundle if not yet cached.
 * This is the primary entry point for other engine modules.
 */
export async function getDictionary(): Promise<DictionaryCache> {
  return loadDictionary();
}

/**
 * Force reload all dictionary data (used after the auto-updater installs
 * a newer data version).
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
    fetchTable<DictAcronym>('acronyms.json'),
    fetchTable<DictActionVerb>('action_verbs.json'),
    fetchTable<DictAtsKeyword>('ats_keywords.json'),
    fetchTable<DictBulletPattern>('bullet_patterns.json'),
    fetchTable<DictCertFunding>('cert_funding.json'),
    fetchTable<DictCoverLetterTemplate>('cover_letter_templates.json'),
    fetchTable<DictEvalPhrase>('eval_phrases.json'),
    fetchTable<DictFundingProgram>('funding_programs.json'),
    fetchTable<DictGapRecommendation>('gap_recommendations.json'),
    fetchTable<DictIndustryFraming>('industry_framing.json'),
    fetchTable<DictLinkedinKeyword>('linkedin_keywords.json'),
    fetchTable<DictLinkedinTemplate>('linkedin_templates.json'),
    fetchTable<DictMilitaryJargon>('military_jargon.json'),
    fetchTable<DictMosToCivilian>('mos_to_civilian.json'),
    fetchTable<DictRankEquivalent>('rank_equivalents.json'),
    fetchTable<DictPhraseTranslation>('phrase_translations.json'),
    fetchTable<DictQuantificationHelper>('quantification_helpers.json'),
    fetchTable<DictResumeTemplate>('resume_templates.json'),
    fetchTable<DictProfessionalSummary>('professional_summaries.json'),
    fetchTable<DictSoftSkill>('soft_skills.json'),
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
 * Load a single table with error handling.
 * Returns empty array on failure so one bad file doesn't break the whole cache.
 */
async function fetchTable<T>(file: string): Promise<T[]> {
  try {
    return await loadDataFile<T[]>(file);
  } catch (err) {
    console.error(`[DictionaryEngine] Failed to load ${file}:`, err);
    return [];
  }
}
