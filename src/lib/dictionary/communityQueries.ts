/**
 * Dictionary Community Queries — Supabase operations for community submissions,
 * missing term logging, and admin approval.
 */

import { createClient } from '@/lib/supabase/client';

// ============================================================================
// Types
// ============================================================================

export interface SubmissionData {
  submission_type: 'jargon' | 'acronym' | 'eval_phrase' | 'phrase';
  military_term: string;
  suggested_civilian?: string;
  branch?: string;
  category?: string;
  context_notes?: string;
}

export interface Submission {
  id: string;
  user_id: string | null;
  submission_type: string;
  military_term: string;
  suggested_civilian: string | null;
  branch: string;
  category: string | null;
  context_notes: string | null;
  status: string;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  upvotes: number;
}

export type MissingTermStatus = 'pending' | 'added' | 'dismissed' | 'false_positive';

export interface MissingTerm {
  id: string;
  term: string;
  source_context: string | null;
  branch: string | null;
  hit_count: number;
  resolved: boolean;
  status: MissingTermStatus;
  created_at: string;
}

// ============================================================================
// User Functions
// ============================================================================

/**
 * Log a missing term silently (fire-and-forget).
 * If the term already exists, increments hit_count.
 */
export async function logMissingTerm(
  term: string,
  sourceContext?: string,
  branch?: string,
): Promise<void> {
  try {
    const supabase = createClient();
    const normalized = term.toLowerCase().trim();
    if (!normalized || normalized.length < 3) return;

    // Check if term already exists
    const { data: existing } = await supabase
      .from('dict_missing_terms_log')
      .select('id, hit_count')
      .eq('term', normalized)
      .limit(1)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('dict_missing_terms_log')
        .update({ hit_count: existing.hit_count + 1 })
        .eq('id', existing.id);
    } else {
      await supabase.from('dict_missing_terms_log').insert({
        term: normalized,
        source_context: sourceContext?.substring(0, 200) || null,
        branch: branch || null,
      });
    }
  } catch {
    // Silent — never break the translation flow
  }
}

/**
 * Submit a new dictionary term.
 */
export async function submitTerm(
  data: SubmissionData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { error } = await supabase.from('dict_submissions').insert({
      user_id: user.id,
      submission_type: data.submission_type,
      military_term: data.military_term.trim(),
      suggested_civilian: data.suggested_civilian?.trim() || null,
      branch: data.branch || 'general',
      category: data.category || null,
      context_notes: data.context_notes?.trim() || null,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Upvote a submission. Increments the upvotes counter.
 */
export async function upvoteSubmission(
  submissionId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    // Insert upvote row (may fail on unique constraint if user already voted)
    const { error: uvErr } = await supabase
      .from('dict_submission_upvotes')
      .insert({ submission_id: submissionId });

    if (uvErr) {
      if (uvErr.code === '23505') return { success: false, error: 'Already upvoted' };
      return { success: false, error: uvErr.message };
    }

    // Increment counter on the submission
    const { data: sub } = await supabase
      .from('dict_submissions')
      .select('upvotes')
      .eq('id', submissionId)
      .single();

    if (sub) {
      await supabase
        .from('dict_submissions')
        .update({ upvotes: (sub.upvotes || 0) + 1 })
        .eq('id', submissionId);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Upvote a missing term (+1 "I need this too").
 */
export async function upvoteMissingTerm(termId: string): Promise<void> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('dict_missing_terms_log')
      .select('hit_count')
      .eq('id', termId)
      .single();
    if (data) {
      await supabase
        .from('dict_missing_terms_log')
        .update({ hit_count: data.hit_count + 1 })
        .eq('id', termId);
    }
  } catch {
    // Silent
  }
}

/**
 * Get the current user's past submissions.
 */
export async function getUserSubmissions(): Promise<Submission[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('dict_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    return (data as Submission[]) ?? [];
  } catch {
    return [];
  }
}

/**
 * Get top missing terms by hit_count (community "Most Requested").
 */
export async function getTopMissingTerms(limit = 20): Promise<MissingTerm[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('dict_missing_terms_log')
      .select('*')
      .eq('status', 'pending')
      .order('hit_count', { ascending: false })
      .limit(limit);
    return (data as MissingTerm[]) ?? [];
  } catch {
    return [];
  }
}

// ============================================================================
// Aggregate / Stats Functions
// ============================================================================

export interface DictionaryStats {
  translationCount: number;
  contributorCount: number;
}

/**
 * Get aggregate dictionary stats for the hero banner.
 * Counts total translations across all dict tables and unique contributors.
 */
export async function getDictionaryStats(): Promise<DictionaryStats> {
  try {
    const supabase = createClient();
    const [jargon, phrases, acronyms, mos, contributors] = await Promise.all([
      supabase.from('dict_military_jargon').select('*', { count: 'exact', head: true }),
      supabase.from('dict_phrase_translations').select('*', { count: 'exact', head: true }),
      supabase.from('dict_acronyms').select('*', { count: 'exact', head: true }),
      supabase.from('dict_mos_to_civilian').select('*', { count: 'exact', head: true }),
      supabase.from('dict_submissions').select('user_id').not('user_id', 'is', null),
    ]);

    const translationCount =
      (jargon.count || 0) + (phrases.count || 0) + (acronyms.count || 0) + (mos.count || 0);
    const uniqueContributors = new Set(
      (contributors.data || []).map((r: any) => r.user_id),
    ).size;

    return {
      translationCount: Math.max(translationCount, 5000),
      contributorCount: uniqueContributors,
    };
  } catch {
    return { translationCount: 5000, contributorCount: 0 };
  }
}

export interface SidebarCommunityData {
  userSubmissions: number;
  missingTermCount: number;
  randomMissingTerm: string | null;
}

/**
 * Get community data for the sidebar engagement section.
 * Returns user's submission count, missing term count, and a random missing term.
 */
export async function getSidebarCommunityData(): Promise<SidebarCommunityData> {
  try {
    const [submissions, missing] = await Promise.all([
      getUserSubmissions(),
      getTopMissingTerms(20),
    ]);

    const randomIndex =
      missing.length > 0 ? Math.floor(Math.random() * missing.length) : -1;

    return {
      userSubmissions: submissions.length,
      missingTermCount: missing.length,
      randomMissingTerm: randomIndex >= 0 ? missing[randomIndex].term : null,
    };
  } catch {
    return { userSubmissions: 0, missingTermCount: 0, randomMissingTerm: null };
  }
}

// ============================================================================
// Admin Functions
// ============================================================================

/**
 * Get all pending submissions (admin).
 */
export async function getPendingSubmissions(): Promise<Submission[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('dict_submissions')
      .select('*')
      .eq('status', 'pending')
      .order('upvotes', { ascending: false });
    return (data as Submission[]) ?? [];
  } catch {
    return [];
  }
}

/**
 * Approve a submission (admin). Inserts into the correct dict_* table.
 */
export async function approveSubmission(
  submissionId: string,
  civilianOverride?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const { data: sub, error: fetchErr } = await supabase
      .from('dict_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (fetchErr || !sub) return { success: false, error: 'Submission not found' };

    const civilian = civilianOverride?.trim() || sub.suggested_civilian;
    if (!civilian) return { success: false, error: 'No civilian equivalent provided' };

    // Update submission status
    await supabase
      .from('dict_submissions')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        suggested_civilian: civilian,
      })
      .eq('id', submissionId);

    // Insert into the correct dictionary table
    if (sub.submission_type === 'jargon') {
      await supabase.from('dict_military_jargon').insert({
        military_term: sub.military_term,
        civilian_equivalent: civilian,
        branch: sub.branch,
        category: sub.category,
      });
    } else if (sub.submission_type === 'acronym') {
      await supabase.from('dict_acronyms').insert({
        acronym: sub.military_term,
        full_term: civilian,
        civilian_explanation: civilian,
        branch: sub.branch,
        category: sub.category,
      });
    } else if (sub.submission_type === 'eval_phrase') {
      await supabase.from('dict_eval_phrases').insert({
        eval_phrase: sub.military_term,
        civilian_translation: civilian,
        eval_type: 'general',
        branch: sub.branch,
        category: sub.category,
      });
    } else if (sub.submission_type === 'phrase') {
      await supabase.from('dict_phrase_translations').insert({
        military_phrase: sub.military_term,
        civilian_phrase: civilian,
        branch: sub.branch,
        category: sub.category,
      });
    }

    // Resolve matching missing terms
    const { data: matching } = await supabase
      .from('dict_missing_terms_log')
      .select('id')
      .ilike('term', sub.military_term.trim());
    if (matching && matching.length > 0) {
      await supabase
        .from('dict_missing_terms_log')
        .update({ resolved: true, resolved_at: new Date().toISOString() })
        .in('id', matching.map((m: any) => m.id));
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Reject a submission (admin).
 */
export async function rejectSubmission(
  submissionId: string,
  adminNotes?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    await supabase
      .from('dict_submissions')
      .update({
        status: 'rejected',
        admin_notes: adminNotes || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', submissionId);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Dismiss a missing term (admin). Removes from active list.
 */
export async function dismissMissingTerm(
  termId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('dict_missing_terms_log')
      .update({ status: 'dismissed', resolved: true })
      .eq('id', termId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Mark a missing term as a false positive (admin). Won't show again.
 */
export async function markFalsePositive(
  termId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('dict_missing_terms_log')
      .update({ status: 'false_positive', resolved: true })
      .eq('id', termId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Add a missing term directly to a dictionary table (admin).
 * Also marks the missing term entry as 'added'.
 */
export async function addMissingTermToDict(params: {
  termId: string;
  militaryTerm: string;
  civilianTranslation: string;
  targetTable: 'dict_phrase_translations' | 'dict_military_jargon' | 'dict_acronyms';
  branch?: string;
  category?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    // Insert into the selected dictionary table
    if (params.targetTable === 'dict_military_jargon') {
      const { error } = await supabase.from('dict_military_jargon').insert({
        military_term: params.militaryTerm.trim(),
        civilian_equivalent: params.civilianTranslation.trim(),
        branch: params.branch || null,
        category: params.category || 'admin_added',
      });
      if (error) return { success: false, error: error.message };
    } else if (params.targetTable === 'dict_acronyms') {
      const { error } = await supabase.from('dict_acronyms').insert({
        acronym: params.militaryTerm.trim(),
        full_term: params.militaryTerm.trim(),
        civilian_explanation: params.civilianTranslation.trim(),
        branch: params.branch || null,
        category: params.category || 'admin_added',
      });
      if (error) return { success: false, error: error.message };
    } else if (params.targetTable === 'dict_phrase_translations') {
      const { error } = await supabase.from('dict_phrase_translations').insert({
        military_phrase: params.militaryTerm.trim(),
        civilian_phrase: params.civilianTranslation.trim(),
        branch: params.branch || null,
        category: params.category || 'admin_added',
      });
      if (error) return { success: false, error: error.message };
    }

    // Mark the missing term as added
    await supabase
      .from('dict_missing_terms_log')
      .update({ status: 'added', resolved: true })
      .eq('id', params.termId);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
