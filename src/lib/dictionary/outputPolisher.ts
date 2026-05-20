/**
 * Output Polisher — shared post-processing for ALL dictionary-powered output.
 *
 * Every text path that uses the dictionary engine (bullets, summaries,
 * headlines, cover letters, eval paste) runs through these polishing functions
 * AFTER dictionary translation, BEFORE display to the user.
 *
 * No AI calls — pure deterministic text transforms.
 */

// ============================================================================
// Constants
// ============================================================================

/** Filler words to remove from resume text */
const FILLER_WORDS = /\b(very|really|basically|just|actually|quite|rather|somewhat|simply|literally|definitely|certainly|absolutely|completely|totally|entirely|utterly)\s+/gi;

/** Eval praise / self-congratulatory language to strip */
const PRAISE_LANGUAGE: [RegExp, string][] = [
  [/\b(outstanding|superb|exceptional|exemplary|superlative|unmatched|unparalleled|unsurpassed|invaluable|undisputed)\s+(leadership|performance|achievement|dedication|commitment|work\s+ethic|professionalism|initiative)\b/gi, '$2'],
  [/\bclearly\s+the\s+best\b/gi, ''],
  [/\btop\s+performer\b/gi, ''],
  [/\b(one\s+of\s+the\s+)?finest\s+\w+\s+I\'?ve?\s+(ever\s+)?/gi, ''],
  [/\btrue\s+(professional|leader|warrior|patriot)\b/gi, 'leader'],
  [/\b(without\s+equal|without\s+peer|second\s+to\s+none)\b/gi, ''],
  [/\bsets?\s+the\s+standard\s*(for)?\s*/gi, ''],
  [/\brole\s+model\s*(for)?\s*/gi, ''],
  [/\bclear\s+impact\s+player\b/gi, ''],
  [/\bfighting\s+spirit\b/gi, ''],
  [/\bcrew\s+strives?\s+to\s+emulate\b/gi, ''],
];

/** Which/that → gerund conversion (professional resume style) */
const WHICH_THAT_GERUND: [RegExp, string][] = [
  [/,?\s*which\s+reduced\b/gi, ', reducing'],
  [/,?\s*which\s+improved\b/gi, ', improving'],
  [/,?\s*which\s+increased\b/gi, ', increasing'],
  [/,?\s*which\s+resulted\s+in\b/gi, ', resulting in'],
  [/,?\s*which\s+led\s+to\b/gi, ', leading to'],
  [/,?\s*which\s+saved\b/gi, ', saving'],
  [/,?\s*which\s+enhanced\b/gi, ', enhancing'],
  [/,?\s*which\s+decreased\b/gi, ', decreasing'],
  [/,?\s*which\s+eliminated\b/gi, ', eliminating'],
  [/,?\s*which\s+generated\b/gi, ', generating'],
  [/,?\s*which\s+enabled\b/gi, ', enabling'],
  [/,?\s*which\s+created\b/gi, ', creating'],
  [/,?\s*which\s+strengthened\b/gi, ', strengthening'],
  [/,?\s*which\s+accelerated\b/gi, ', accelerating'],
  [/,?\s*which\s+produced\b/gi, ', producing'],
  [/,?\s*which\s+delivered\b/gi, ', delivering'],
  [/,?\s*which\s+achieved\b/gi, ', achieving'],
  [/,?\s*which\s+prevented\b/gi, ', preventing'],
  [/,?\s*which\s+minimized\b/gi, ', minimizing'],
  [/,?\s*which\s+maximized\b/gi, ', maximizing'],
  [/,?\s*which\s+drove\b/gi, ', driving'],
  [/,?\s*which\s+boosted\b/gi, ', boosting'],
  [/,?\s*which\s+cut\b/gi, ', cutting'],
  [/,?\s*which\s+streamlined\b/gi, ', streamlining'],
  [/,?\s*which\s+optimized\b/gi, ', optimizing'],
  [/,?\s*which\s+facilitated\b/gi, ', facilitating'],
  [/,?\s*which\s+ensured\b/gi, ', ensuring'],
  [/,?\s*which\s+supported\b/gi, ', supporting'],
  // "that" variants
  [/,?\s*that\s+reduced\b/gi, ', reducing'],
  [/,?\s*that\s+improved\b/gi, ', improving'],
  [/,?\s*that\s+increased\b/gi, ', increasing'],
  [/,?\s*that\s+resulted\s+in\b/gi, ', resulting in'],
  [/,?\s*that\s+led\s+to\b/gi, ', leading to'],
  [/,?\s*that\s+saved\b/gi, ', saving'],
  [/,?\s*that\s+enhanced\b/gi, ', enhancing'],
  [/,?\s*that\s+decreased\b/gi, ', decreasing'],
  [/,?\s*that\s+eliminated\b/gi, ', eliminating'],
  [/,?\s*that\s+generated\b/gi, ', generating'],
  [/,?\s*that\s+enabled\b/gi, ', enabling'],
  [/,?\s*that\s+created\b/gi, ', creating'],
  [/,?\s*that\s+strengthened\b/gi, ', strengthening'],
  [/,?\s*that\s+accelerated\b/gi, ', accelerating'],
  [/,?\s*that\s+produced\b/gi, ', producing'],
  [/,?\s*that\s+delivered\b/gi, ', delivering'],
  [/,?\s*that\s+achieved\b/gi, ', achieving'],
  [/,?\s*that\s+prevented\b/gi, ', preventing'],
  [/,?\s*that\s+minimized\b/gi, ', minimizing'],
  [/,?\s*that\s+maximized\b/gi, ', maximizing'],
  [/,?\s*that\s+drove\b/gi, ', driving'],
  [/,?\s*that\s+boosted\b/gi, ', boosting'],
  [/,?\s*that\s+cut\b/gi, ', cutting'],
  [/,?\s*that\s+streamlined\b/gi, ', streamlining'],
  [/,?\s*that\s+optimized\b/gi, ', optimizing'],
  [/,?\s*that\s+facilitated\b/gi, ', facilitating'],
  [/,?\s*that\s+ensured\b/gi, ', ensuring'],
  [/,?\s*that\s+supported\b/gi, ', supporting'],
];

/** Weak verb starters → strong replacements */
const WEAK_VERB_REWRITES: [RegExp, string][] = [
  [/^was\s+responsible\s+for\s+/i, 'Managed '],
  [/^responsible\s+for\s+/i, 'Managed '],
  [/^in\s+charge\s+of\s+/i, 'Directed '],
  [/^served\s+as\s+the\s+lead\s+(for|on|of)\s+/i, 'Led '],
  [/^worked\s+on\s+/i, 'Developed '],
  [/^helped\s+(with|to)\s+/i, 'Supported '],
  [/^was\s+tasked\s+with\s+/i, 'Executed '],
  [/^tasked\s+with\s+/i, 'Executed '],
  [/^assisted\s+(in|with)\s+/i, 'Contributed to '],
  [/^participated\s+in\s+/i, 'Contributed to '],
  [/^involved\s+in\s+/i, 'Contributed to '],
  [/^took\s+part\s+in\s+/i, 'Contributed to '],
  [/^played\s+a\s+(key|critical|major|vital)\s+role\s+in\s+/i, 'Led '],
  [/^had\s+oversight\s+of\s+/i, 'Oversaw '],
  [/^provided\s+oversight\s+(for|of)\s+/i, 'Oversaw '],
  [/^did\s+/i, 'Completed '],
  [/^made\s+/i, 'Developed '],
  [/^got\s+/i, 'Achieved '],
  [/^was\s+involved\s+in\s+/i, 'Contributed to '],
  [/^was\s+part\s+of\s+/i, 'Contributed to '],
  [/^was\s+a\s+member\s+of\s+/i, 'Served on '],
  [/^took\s+care\s+of\s+/i, 'Managed '],
  [/^put\s+together\s+/i, 'Assembled '],
  [/^played\s+a\s+role\s+in\s+/i, 'Contributed to '],
  [/^had\s+a\s+role\s+in\s+/i, 'Contributed to '],
  [/^served\s+as\s+a\s+/i, ''],  // "Served as a team lead" → "Team Lead" — handled by caller
];

/** Eval verb upgrades — military eval verbs → strong resume verbs */
const EVAL_VERB_UPGRADES: [RegExp, string][] = [
  [/\butilized\b/gi, 'leveraged'],
  [/\bexhibited\b/gi, ''],  // eval fluff - remove
  [/\bdisplayed\b/gi, ''],  // eval fluff - remove
  [/\bdemonstrated\s+leadership\b/gi, 'led'],
  [/\bdemonstrated\s+expertise\b/gi, 'applied expertise'],
  [/\bdemonstrated\s+proficiency\b/gi, 'applied'],
  [/\bdemonstrated\s+knowledge\b/gi, 'applied knowledge of'],
  [/\bconducted\s+inspections?\b/gi, 'executed inspections'],
  [/\bperformed\s+duties\b/gi, 'executed responsibilities'],
  [/\bprovided\s+guidance\b/gi, 'guided'],
  [/\bprovided\s+training\b/gi, 'delivered training'],
  [/\bprovided\s+support\b/gi, 'supported'],
  [/\bprovided\s+leadership\b/gi, 'led'],
  [/\bprovided\s+oversight\b/gi, 'oversaw'],
  [/\bserved\s+as\s+the\b/gi, 'Served as'],
  [/\bserved\s+as\s+a\b/gi, 'Served as'],
];

/** Negative framing → positive framing */
const NEGATIVE_TO_POSITIVE: [RegExp, string][] = [
  [/\bwithout\s+(?:any\s+)?lapse\s+in\s+/gi, 'maintaining uninterrupted '],
  [/\bwithout\s+(?:any\s+)?interruption\s+(?:to|in)\s+/gi, 'maintaining continuous '],
  [/\bwithout\s+(?:any\s+)?incident\b/gi, 'with a perfect safety record'],
  [/\bwithout\s+(?:any\s+)?error\b/gi, 'with zero errors'],
  [/\bwithout\s+(?:any\s+)?deficiencies?\b/gi, 'with zero deficiencies'],
  [/\bwith\s+no\s+(?:safety\s+)?incidents?\b/gi, 'with a perfect safety record'],
  [/\bwith\s+no\s+discrepancies?\b/gi, 'with zero discrepancies'],
  [/\bzero\s+mishaps?\b/gi, 'a perfect safety record'],
];

/** Strong action verbs that are valid bullet starters */
const STRONG_VERBS = new Set([
  'led', 'managed', 'directed', 'coordinated', 'supervised', 'trained',
  'developed', 'maintained', 'executed', 'achieved', 'completed',
  'established', 'implemented', 'improved', 'increased', 'reduced',
  'streamlined', 'organized', 'oversaw', 'spearheaded', 'initiated',
  'facilitated', 'delivered', 'ensured', 'served', 'selected',
  'earned', 'qualified', 'certified', 'conducted', 'performed',
  'analyzed', 'assessed', 'planned', 'prepared', 'processed',
  'reviewed', 'resolved', 'supported', 'assisted', 'briefed',
  'instructed', 'mentored', 'counseled', 'authored', 'created',
  'designed', 'rebuilt', 'repaired', 'installed', 'operated',
  'calibrated', 'tested', 'inspected', 'verified', 'validated',
  'tracked', 'monitored', 'reported', 'documented', 'inventoried',
  'procured', 'allocated', 'distributed', 'budgeted', 'saved',
  'generated', 'produced', 'launched', 'deployed', 'mobilized',
  'orchestrated', 'transformed', 'negotiated', 'optimized',
  'consolidated', 'integrated', 'championed', 'pioneered',
  'overhauled', 'hosted', 'chaired', 'administered', 'enforced',
  'contributed', 'demonstrated', 'drove', 'enabled',
  'redesigned', 'accelerated', 'eliminated', 'revamped',
  'engineered', 'standardized', 'revitalized', 'restructured',
  'modernized', 'automated', 'safeguarded', 'cultivated',
  'galvanized', 'influenced', 'navigated', 'secured',
  'leveraged', 'elevated', 'surpassed', 'maximized', 'minimized',
]);

/** Word number → digit */
const WORD_TO_NUM: Record<string, string> = {
  'one': '1', 'two': '2', 'three': '3', 'four': '4',
  'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
  'ten': '10', 'eleven': '11', 'twelve': '12', 'thirteen': '13',
  'fourteen': '14', 'fifteen': '15', 'sixteen': '16', 'seventeen': '17',
  'eighteen': '18', 'nineteen': '19', 'twenty': '20', 'thirty': '30',
  'forty': '40', 'fifty': '50', 'sixty': '60', 'seventy': '70',
  'eighty': '80', 'ninety': '90', 'hundred': '100',
};

/** Redundant verb pairs — keep only the first */
const REDUNDANT_VERBS: [RegExp, string][] = [
  [/\b(led)\s+and\s+(managed|directed)\b/gi, '$1'],
  [/\b(managed)\s+and\s+(directed|oversaw|led)\b/gi, '$1'],
  [/\b(planned)\s+and\s+(coordinated|organized)\s+and\s+(executed)\b/gi, '$1 and $3'],
  [/\b(planned)\s+and\s+(coordinated|organized)\b/gi, 'Coordinated'],
  [/\b(coordinated)\s+and\s+(organized)\b/gi, '$1'],
  [/\b(developed)\s+and\s+(created|built|designed)\b/gi, '$1'],
  [/\b(monitored)\s+and\s+(tracked)\b/gi, '$1'],
  [/\b(reviewed)\s+and\s+(assessed|analyzed|evaluated)\b/gi, '$2'],
  [/\b(trained)\s+and\s+(mentored)\b/gi, '$1 and mentored'],
];

// ============================================================================
// Function 1: polishBullet
// ============================================================================

/**
 * Polish a dictionary-translated bullet into professional resume quality.
 *
 * Applies: action verb enforcement, filler removal, praise stripping,
 * which/that gerund conversion, negative-to-positive framing, eval verb upgrades,
 * grammar cleanup, number normalization, length enforcement, capitalization.
 */
export function polishBullet(raw: string): string {
  if (!raw || raw.trim().length < 5) return raw;

  let text = raw.trim();

  // 1. Remove third-person pronouns left over
  text = text.replace(/^(he|she|they)\s+/i, '');
  text = text.replace(/\b(his|her|their)\s+/gi, '');

  // 2. Strip filler words
  text = text.replace(FILLER_WORDS, '');

  // 3. Strip praise language
  for (const [pattern, replacement] of PRAISE_LANGUAGE) {
    text = text.replace(pattern, replacement);
  }

  // 4. Apply which/that → gerund conversions
  for (const [pattern, replacement] of WHICH_THAT_GERUND) {
    text = text.replace(pattern, replacement);
  }

  // 5. Apply negative → positive framing
  for (const [pattern, replacement] of NEGATIVE_TO_POSITIVE) {
    text = text.replace(pattern, replacement);
  }

  // 6. Rewrite weak verb starters
  for (const [pattern, replacement] of WEAK_VERB_REWRITES) {
    if (pattern.test(text)) {
      text = text.replace(pattern, replacement);
      break; // Only apply one rewrite
    }
  }

  // 7. Apply eval verb upgrades
  for (const [pattern, replacement] of EVAL_VERB_UPGRADES) {
    text = text.replace(pattern, replacement);
  }

  // 8. Remove unnecessary "all" before nouns
  text = text.replace(/\ball\s+(personnel|departments?|divisions?|operations|training|maintenance|equipment|systems)\b/gi, '$1');

  // 9. Fix grammar after term replacement
  text = fixPostTranslationGrammar(text);

  // 10. Normalize numbers
  text = normalizeNumbers(text);

  // 11. Remove redundant verb pairs
  for (const [pattern, replacement] of REDUNDANT_VERBS) {
    text = text.replace(pattern, replacement);
  }

  // 12. Clean double spaces, fix punctuation
  text = cleanSpacingAndPunctuation(text);

  // 13. Capitalize first letter, ensure period at end
  text = capitalizeFirst(text);
  text = ensurePeriod(text);

  return text;
}

// ============================================================================
// Function 2: polishSummary
// ============================================================================

export interface SummaryOptions {
  tone: 'professional' | 'conversational' | 'bold';
  length: 'concise' | 'standard' | 'detailed';
}

/**
 * Polish a dictionary-translated professional summary.
 *
 * IMPORTANT: Summaries are NOT eval bullets. We do NOT strip praise language
 * or first-person pronouns here — those transforms destroy summary quality.
 * Templates are already written in third person, so pronoun removal is unnecessary.
 * Words like "accomplished" and "proven" are appropriate in professional summaries.
 */
export function polishSummary(
  raw: string,
  options: SummaryOptions = { tone: 'professional', length: 'standard' },
): string {
  if (!raw || raw.trim().length < 10) return raw;

  let text = raw.trim();

  // 1. Strip filler words only (very, really, basically, etc.)
  text = text.replace(FILLER_WORDS, '');

  // 2. Fix grammar issues (double articles, wrong a/an, doubled words)
  text = fixPostTranslationGrammar(text);

  // 3. Normalize numbers (word numbers → digits, dollar formatting)
  text = normalizeNumbers(text);

  // 4. Deduplicate skill mentions (e.g., "PMP" + "Project Management Professional")
  text = deduplicateSkillMentions(text);

  // 5. Clean spacing and punctuation
  text = cleanSpacingAndPunctuation(text);

  // 6. Enforce length (max sentences only — never shorten below 4 sentences)
  text = enforceSummaryLength(text, options.length);

  // 7. Capitalize first letter of each sentence
  text = capitalizeSentences(text);

  return text;
}

// ============================================================================
// Function 3: polishHeadline
// ============================================================================

/**
 * Polish a LinkedIn headline.
 */
export function polishHeadline(raw: string): string {
  if (!raw || raw.trim().length < 3) return raw;

  let text = raw.trim();

  // 1. Title Case key words (not articles/prepositions)
  text = toTitleCase(text);

  // 2. Truncate to 220 chars cleanly
  if (text.length > 220) {
    // Cut at last pipe/separator before 220
    const cutIdx = text.lastIndexOf('|', 220);
    if (cutIdx > 100) {
      text = text.substring(0, cutIdx).trim();
    } else {
      // Cut at last space before 220
      const spaceIdx = text.lastIndexOf(' ', 220);
      text = text.substring(0, spaceIdx > 100 ? spaceIdx : 220).trim();
    }
  }

  // 3. Remove trailing pipes or separators
  text = text.replace(/\s*[|,;:\-–—]\s*$/, '');

  // 4. No periods or exclamation marks
  text = text.replace(/[.!?]+$/, '');

  // 5. Deduplicate — "Project Management | PMP" is fine,
  //    but "Project Manager | Project Management" is redundant
  text = deduplicateHeadlineParts(text);

  // 6. Clean spacing
  text = text.replace(/\s{2,}/g, ' ').trim();

  return text;
}

// ============================================================================
// Function 4: polishCoverLetter
// ============================================================================

/**
 * Polish a dictionary-generated cover letter.
 */
export function polishCoverLetter(raw: string): string {
  if (!raw || raw.trim().length < 20) return raw;

  let text = raw.trim();

  // 1. Remove placeholder artifacts
  text = cleanPlaceholderArtifacts(text);

  // 2. Strip filler words
  text = text.replace(FILLER_WORDS, '');

  // 3. Strip praise language
  for (const [pattern, replacement] of PRAISE_LANGUAGE) {
    text = text.replace(pattern, replacement);
  }

  // 4. Fix grammar
  text = fixPostTranslationGrammar(text);

  // 5. Normalize numbers
  text = normalizeNumbers(text);

  // 6. Clean spacing and punctuation
  text = cleanSpacingAndPunctuation(text);

  // 7. Capitalize first letter of each sentence
  text = capitalizeSentences(text);

  // 8. Ensure proper paragraph breaks (at least 2 newlines between paragraphs)
  text = text.replace(/\n{3,}/g, '\n\n');

  return text;
}

// ============================================================================
// Shared Grammar / Cleanup Helpers
// ============================================================================

/**
 * Fix grammar issues caused by dictionary term replacement.
 */
function fixPostTranslationGrammar(text: string): string {
  let result = text;

  // Double articles: "the the", "a a", "an an"
  result = result.replace(/\b(the)\s+\1\b/gi, '$1');
  result = result.replace(/\b(a)\s+\1\b/gi, '$1');
  result = result.replace(/\b(an)\s+\1\b/gi, '$1');

  // Wrong article: "a [vowel-word]" → "an [vowel-word]"
  result = result.replace(/\ba\s+([aeiou])/gi, (match, vowel) => {
    return 'an ' + vowel;
  });
  // "an [consonant-word]" → "a [consonant-word]" (except "an hour", "an honest")
  result = result.replace(/\ban\s+([bcdfghjklmnpqrstvwxyz])/gi, (match, consonant) => {
    // Check for silent-h words
    const nextWord = match.split(/\s+/)[1]?.toLowerCase() || '';
    if (nextWord.startsWith('hour') || nextWord.startsWith('honest') || nextWord.startsWith('honor')) {
      return match;
    }
    return 'a ' + consonant;
  });

  // Doubled words: "and and", "to to", "of of", "in in", "for for"
  result = result.replace(/\b(and|to|of|in|for|the|a|an|or|is|was|were|at|by|on|with)\s+\1\b/gi, '$1');

  // Double commas or comma-space-comma
  result = result.replace(/,\s*,/g, ',');

  // Comma before period
  result = result.replace(/,\s*\./g, '.');

  // Dangling preposition at end: "contributed to." → "contributed to initiatives."
  result = result.replace(/\b(to|for|with|of|in|on|at|by)\s*\.\s*$/i, (_, prep) => {
    return prep + ' key initiatives.';
  });

  // "and." at end
  result = result.replace(/\s+and\.\s*$/, '.');
  result = result.replace(/,\s+and\.\s*$/, '.');

  // Fix comma splice before "and" or "resulting in"
  // "Led team, and achieved" → "Led team and achieved"
  result = result.replace(/,\s+and\s+/g, ' and ');

  // Remove empty parentheses
  result = result.replace(/\(\s*\)/g, '');

  // Remove stray brackets from template leftovers
  result = result.replace(/\[[^\]]*\]/g, '');

  return result;
}

/**
 * Normalize numbers to resume-friendly format.
 */
function normalizeNumbers(text: string): string {
  let result = text;

  // Word numbers → digits: "seven" → "7"
  for (const [word, num] of Object.entries(WORD_TO_NUM)) {
    const pattern = new RegExp(`\\b${word}\\b`, 'gi');
    result = result.replace(pattern, num);
  }

  // "percent" → "%"
  result = result.replace(/\b(\d+)\s*percent\b/gi, '$1%');

  // Large dollar amounts: "$5,000,000" → "$5M"
  result = result.replace(/\$(\d{1,3}),000,000\b/g, (_, m) => `$${m}M`);
  result = result.replace(/\$(\d{1,3}),000\b/g, (_, k) => `$${k}K`);

  // "five million" → "$5M"
  result = result.replace(/\b(\d+)\s+million\s*dollars?\b/gi, (_, n) => `$${n}M`);
  result = result.replace(/\b(\d+)\s+thousand\s*dollars?\b/gi, (_, n) => `$${n}K`);

  return result;
}

/**
 * Clean placeholder artifacts from template output.
 */
function cleanPlaceholderArtifacts(text: string): string {
  let result = text;

  // Remove {key} and {{key}} placeholders (both single and double brace)
  result = result.replace(/\{{1,2}[^}]*\}{1,2}/g, '');

  // Remove [...] bracket placeholders
  result = result.replace(/\[[^\]]*\]/g, '');

  // Remove empty parentheses
  result = result.replace(/\(\s*\)/g, '');

  // Remove double commas from removed placeholders
  result = result.replace(/,\s*,/g, ',');

  // Remove trailing/leading commas in lists
  result = result.replace(/,\s*\./g, '.');
  result = result.replace(/^\s*,\s*/gm, '');

  // Remove "in with" and "with with" artifacts
  result = result.replace(/\bin\s+with\b/gi, 'with');
  result = result.replace(/\bwith\s+with\b/gi, 'with');

  // Remove empty lines
  result = result.replace(/^\s*$/gm, '');
  result = result.replace(/\n{3,}/g, '\n\n');

  return result;
}

/**
 * Clean double spaces, fix spacing around punctuation.
 */
function cleanSpacingAndPunctuation(text: string): string {
  let result = text;

  // Double spaces → single (preserve newlines for paragraph breaks)
  result = result.replace(/[^\S\n\r]{2,}/g, ' ');

  // Space before punctuation
  result = result.replace(/\s+([.,;:!?])/g, '$1');

  // No space after opening paren, no space before closing paren
  result = result.replace(/\(\s+/g, '(');
  result = result.replace(/\s+\)/g, ')');

  return result.trim();
}

/**
 * Capitalize first letter.
 */
function capitalizeFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Capitalize first letter of each sentence.
 */
function capitalizeSentences(text: string): string {
  // After period/question/exclamation + space, capitalize
  let result = text.replace(/([.!?]\s+)([a-z])/g, (_, sep, letter) => sep + letter.toUpperCase());
  // After newline, capitalize
  result = result.replace(/(\n\s*)([a-z])/g, (_, nl, letter) => nl + letter.toUpperCase());
  // Capitalize first character
  result = capitalizeFirst(result);
  return result;
}

/**
 * Ensure text ends with a period (not ! or nothing).
 */
function ensurePeriod(text: string): string {
  const trimmed = text.trimEnd();
  if (!trimmed) return trimmed;
  if (trimmed.endsWith('!')) return trimmed.slice(0, -1) + '.';
  if (/[.]$/.test(trimmed)) return trimmed;
  if (/[?]$/.test(trimmed)) return trimmed; // Questions are ok
  return trimmed + '.';
}

/**
 * Convert text to Title Case, skipping articles and short prepositions.
 */
function toTitleCase(text: string): string {
  const skip = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor',
    'in', 'on', 'at', 'to', 'of', 'by', 'with', 'from', 'as', 'is']);

  return text.split(/(\s+|\|)/).map((word, i) => {
    if (word.trim() === '|' || /^\s+$/.test(word)) return word;
    const lower = word.toLowerCase();
    // Always capitalize first word and words after separators
    if (i === 0 || skip.has(lower) === false) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return lower;
  }).join('');
}

/**
 * Deduplicate headline parts separated by |
 * "Project Manager | Project Management" → "Project Manager"
 */
function deduplicateHeadlineParts(text: string): string {
  const parts = text.split(/\s*\|\s*/);
  const unique: string[] = [];
  const seen = new Set<string>();

  for (const part of parts) {
    const normalized = part.toLowerCase().replace(/\s+(management|manager|specialist|professional|expert|leader|director)/g, '').trim();
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    unique.push(part);
  }

  return unique.join(' | ');
}

/**
 * Deduplicate skill mentions within summary text.
 * If "PMP" and "Project Management Professional" both appear, note it.
 */
function deduplicateSkillMentions(text: string): string {
  // Only dedup when abbreviation AND full name appear in the SAME sentence or clause.
  // Never remove role-title phrases like "Project management professional" at text start.
  const dups: [string, RegExp][] = [
    // Only match "Certified Information Systems Security Professional" when CISSP also present
    ['CISSP', /\bCertified Information Systems Security Professional\b/gi],
    // Only match "Lean Six Sigma" if both "Six Sigma" and "Lean Six Sigma" appear (keep shorter)
    ['Six Sigma', /\bLean Six Sigma\b/gi],
  ];

  let result = text;
  for (const [abbrev, fullPattern] of dups) {
    if (result.includes(abbrev) && fullPattern.test(result)) {
      // Reset regex lastIndex
      fullPattern.lastIndex = 0;
      result = result.replace(fullPattern, '').replace(/,\s*,/g, ',');
    }
  }

  // PMP / "Project Management Professional" — special handling:
  // Only dedup if the full phrase appears as a CREDENTIAL (near "certified", "certification",
  // or after a comma in a list), NOT as a role title at the start of the summary.
  if (result.includes('PMP')) {
    // Remove "Project Management Professional" only when it's in a cert list context
    // e.g., "PMP, Project Management Professional" or "Certified Project Management Professional"
    result = result.replace(/,\s*Project Management Professional\b/gi, '');
    result = result.replace(/\bCertified Project Management Professional\s*\(PMP\)/gi, 'PMP');
    result = result.replace(/\bProject Management Professional\s*\(PMP\)/gi, 'PMP');
  }

  return result;
}

/**
 * Enforce summary length by sentence count.
 * Never truncate below 4 sentences — a good professional summary needs substance.
 */
function enforceSummaryLength(text: string, length: 'concise' | 'standard' | 'detailed'): string {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  const maxSentences = length === 'concise' ? 4 : length === 'standard' ? 7 : 10;

  if (sentences.length <= maxSentences) return text;
  return sentences.slice(0, maxSentences).join(' ');
}

/**
 * Check if a bullet starts with a recognized strong action verb.
 */
export function startsWithStrongVerb(text: string): boolean {
  const firstWord = text.trim().split(/\s/)[0]?.toLowerCase();
  return STRONG_VERBS.has(firstWord || '');
}
