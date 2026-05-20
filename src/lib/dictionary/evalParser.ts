/**
 * Eval Text Parser — parses Navy/military evaluation text into STAR-format
 * resume bullets.
 *
 * This is the FREE TIER path: dictionary only, zero AI calls.
 *
 * Pipeline:
 *   1. Clean raw text (strip formatting, normalize ALL CAPS, remove noise)
 *   2. Parse into accomplishment blocks (dash-separated, not sentence fragments)
 *   3. Filter out eval praise / recommendation noise
 *   4. Convert third-person → first-person resume voice
 *   5. Translate military → civilian via dictionary engine
 *   6. Format as STAR bullets (Action Verb + What + Scope + Result)
 *   7. Quality gate (reject fragments, praise, missing verbs, unexpanded acronyms)
 */

import { translateBullet } from './bulletTranslator';
import { polishBullet } from './outputPolisher';

// ============================================================================
// Types
// ============================================================================

export interface ParsedEvalBullet {
  /** Original eval text before any transformation */
  original: string;
  /** Translated, cleaned, STAR-format resume bullet */
  translated: string;
  /** Dictionary coverage score (0-100) */
  coverage: number;
}

// ============================================================================
// Constants
// ============================================================================

/** Strong action verbs for resume bullets (STAR format openers) */
const STRONG_ACTION_VERBS = [
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
];

const ACTION_VERB_RE = new RegExp(
  `^(${STRONG_ACTION_VERBS.join('|')})\\b`,
  'i',
);

/** Common English words that should NEVER remain ALL CAPS */
const COMMON_ENGLISH_WORDS = new Set([
  'THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN',
  'HER', 'WAS', 'ONE', 'OUR', 'OUT', 'HAS', 'HIS', 'HOW', 'ITS',
  'LET', 'MAY', 'NEW', 'NOW', 'OLD', 'SEE', 'WAY', 'WHO', 'DID',
  'GET', 'HIM', 'HIS', 'SHE', 'HAD', 'SAY', 'USE', 'SET', 'RUN',
  'THAN', 'THEM', 'THEN', 'WHEN', 'WITH', 'THIS', 'THAT', 'FROM',
  'HAVE', 'BEEN', 'EACH', 'MAKE', 'LIKE', 'LONG', 'LOOK', 'MANY',
  'SOME', 'TIME', 'VERY', 'WILL', 'INTO', 'JUST', 'KNOW', 'TAKE',
  'COME', 'MADE', 'FIND', 'HERE', 'MOST', 'OVER', 'SUCH', 'MUCH',
  'BEST', 'WELL', 'BACK', 'ALSO', 'GOOD', 'GIVE', 'MOST', 'ONLY',
  'TELL', 'EVEN', 'WORK', 'CALL', 'KEEP', 'LAST', 'SAME', 'YEAR',
  'ACROSS', 'AMONG', 'WHERE', 'WHILE', 'WOULD', 'COULD', 'SHOULD',
  'THEIR', 'WHICH', 'ABOUT', 'AFTER', 'BEING', 'EVERY', 'OTHER',
  'THOSE', 'THESE', 'FIRST', 'UNDER', 'NEVER', 'THERE', 'GREAT',
  'KNOWN', 'ABOVE',
  // 2-3 letter common words
  'AS', 'AT', 'BE', 'BY', 'DO', 'GO', 'IF', 'IN', 'IS', 'IT',
  'MY', 'NO', 'OF', 'ON', 'OR', 'SO', 'TO', 'UP', 'WE',
  'AN', 'AM', 'HE',
]);

/** Military acronyms that should NOT be lowercased — they get translated instead */
const KNOWN_ACRONYMS = new Set([
  'PMS', 'INSURV', 'ATG', 'TYCOM', 'CSMP', 'MRC', 'SKED', 'JCN',
  'COMPTUEX', 'JTFEX', 'CSEL', 'DRB', 'MWR', 'SOY', 'SOQ', 'EP', 'MP',
  'CPO', 'MCPO', 'SCPO', 'CMDCM', 'CMC', 'DLCPO', 'LCPO', 'LPO',
  'SME', 'PRT', 'BCA', 'FEP', 'SAPR', 'DAPA', 'CFL', 'CMEO',
  'EVAL', 'FITREP', 'NAVFIT', 'PQS', 'GMT', 'CBT', 'OJT',
  'OMMS', 'DCTT', 'GQ', 'DC', 'UNREP', 'RAS', 'CDO', 'OOD',
  'CASREP', 'SORTS', 'DRRS', 'OPREP', 'SITREP', 'AAR', 'SOP',
  'DoD', 'DOD', 'USA', 'USN', 'USMC', 'USAF', 'USCG',
  'NATO', 'NDSM', 'GWOT', 'OIF', 'OEF', 'USS',
  'IT', 'HR', 'QA', 'QC', 'PM', 'VP', 'CEO', 'CFO', 'CIO', 'CTO',
  'COMMS', 'OPS', 'ADMIN', 'SUPPO', 'WEPS', 'CHENG', 'DCA',
  'CO', 'XO', 'DH', 'DIVO', 'CSG', 'ESG', 'DESRON', 'GOAD',
  'FR', 'RE', 'AFLOAT', 'NEC', 'MOS', 'AFSC',
  'U/W', '3M', '3MC', '3MA',
]);

// ============================================================================
// Branch Detection
// ============================================================================

/**
 * Auto-detect military branch from eval text patterns.
 * Returns branch string or null if indeterminate.
 */
function detectBranch(text: string): string | null {
  const lower = text.toLowerCase();

  // Navy patterns
  if (/\b(fitrep|eval|navpers|bupersinst|navfit|sailor|petty\s+officer|chief\s+petty|lpo|lcpo|dlcpo|cpo|scpo|mcpo|cmdcm|navadmin|u\/w|underway|unrep)\b/i.test(lower)) {
    return 'Navy';
  }
  // Army patterns
  if (/\b(ncoer|oer|da\s+form|nco|first\s+sergeant|sergeant\s+major|platoon\s+sergeant|squad\s+leader|battle\s+buddy|hooah|mos\s+\d|apft|acft|basic\s+combat)\b/i.test(lower)) {
    return 'Army';
  }
  // Air Force patterns
  if (/\b(epr|opr|airman|afsc\s+\d|wing\s+commander|squadron|flight\s+commander|flight\s+chief|pme|als|ncoa|sncoa|air\s+force)\b/i.test(lower)) {
    return 'Air Force';
  }
  // Marine Corps patterns
  if (/\b(fitrep|pro\/con|proficiency\s+and\s+conduct|marine|marines|usmc|commandant|semper\s+fi|oorah|devil\s+dog|leatherneck)\b/i.test(lower)) {
    // Distinguish Navy fitrep from USMC — look for Marine-specific terms
    if (/\b(marine|marines|usmc|commandant|semper\s+fi|oorah|pro\/con)\b/i.test(lower)) {
      return 'Marine Corps';
    }
  }
  // Coast Guard patterns
  if (/\b(eer|coast\s+guard|uscg|cutter|sector|district\s+commander|semper\s+paratus|coastie)\b/i.test(lower)) {
    return 'Coast Guard';
  }

  return null;
}

// ============================================================================
// Step 1: Clean raw eval text
// ============================================================================

/** Eval formatting noise characters to strip */
const FORMAT_NOISE_RE = /[\*~#><|]+/g;
const EXCESS_PUNCTUATION_RE = /([!?]){2,}/g;
const SEPARATOR_DASHES_RE = /^\s*[-–—]+\s*|\s*[-–—]+\s*$/gm;

function cleanEvalText(raw: string): string {
  let text = raw;

  // Strip special formatting characters
  text = text.replace(FORMAT_NOISE_RE, '');
  text = text.replace(EXCESS_PUNCTUATION_RE, '$1');
  text = text.replace(SEPARATOR_DASHES_RE, '');

  // Normalize & to "and"
  text = text.replace(/\s*&\s*/g, ' and ');

  // Normalize multiple spaces/tabs to single space
  text = text.replace(/[ \t]+/g, ' ');

  // Trim each line
  text = text.split('\n').map(l => l.trim()).join('\n');

  return text.trim();
}

/**
 * Normalize ALL-CAPS words:
 * - Known acronyms: keep as-is (they'll be translated by the dictionary)
 * - Common English words (THE, AS, IN, etc.): lowercase
 * - Other ALL-CAPS words of 4+ chars: Title Case
 * - Entire ALL-CAPS sentences: sentence-case the whole thing
 */
function normalizeAllCaps(text: string): string {
  // First check if the ENTIRE text (or a line) is ALL CAPS
  const lines = text.split('\n');
  const normalizedLines = lines.map(line => {
    // If >70% of alphabetic chars are uppercase, it's an ALL-CAPS line
    const alphaChars = line.replace(/[^a-zA-Z]/g, '');
    const upperCount = (alphaChars.match(/[A-Z]/g) || []).length;
    if (alphaChars.length > 10 && upperCount / alphaChars.length > 0.7) {
      return sentenceCaseLine(line);
    }
    return line;
  });
  text = normalizedLines.join('\n');

  // Now handle individual ALL-CAPS words
  return text.replace(/\b([A-Z][A-Z0-9/]{0,}[A-Z])\b/g, (match) => {
    // Known military acronym — keep for dictionary translation
    if (KNOWN_ACRONYMS.has(match)) return match;
    // Common English word — lowercase
    if (COMMON_ENGLISH_WORDS.has(match)) return match.toLowerCase();
    // Short acronym-like (2-3 chars, all alpha, not a common word) — keep
    if (/^[A-Z]{2,3}$/.test(match) && !COMMON_ENGLISH_WORDS.has(match)) return match;
    // Longer ALL-CAPS word — title case
    if (match.length >= 4) {
      return match.charAt(0) + match.slice(1).toLowerCase();
    }
    return match;
  });
}

/**
 * Convert an ALL-CAPS line to sentence case, preserving known acronyms.
 */
function sentenceCaseLine(line: string): string {
  const words = line.split(/\s+/);
  return words.map((word, i) => {
    // Strip trailing punctuation for lookup
    const stripped = word.replace(/[.,!?;:]+$/, '');
    const punct = word.slice(stripped.length);

    if (KNOWN_ACRONYMS.has(stripped)) return stripped + punct;
    if (COMMON_ENGLISH_WORDS.has(stripped) && i > 0) {
      return stripped.toLowerCase() + punct;
    }
    // Title case
    if (stripped.length > 1) {
      return stripped.charAt(0) + stripped.slice(1).toLowerCase() + punct;
    }
    return word;
  }).join(' ');
}

// ============================================================================
// Step 2: Parse into accomplishment blocks
// ============================================================================

function parseAccomplishmentBlocks(cleanedText: string): string[] {
  const blocks: string[] = [];
  const lines = cleanedText.split(/\n/);
  let currentBlock = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentBlock.trim()) {
        blocks.push(currentBlock.trim());
        currentBlock = '';
      }
      continue;
    }

    const startsNewBlock =
      /^\s*[-–—]\s+/.test(line) ||
      /^\s*[•●○◆◇▸▹►▻➤➢→]\s*/.test(line) ||
      /^\s*\d+[.)]\s+/.test(line) ||
      /^\s*o\s+[A-Z]/.test(line);  // Army "o" bullet markers

    if (startsNewBlock) {
      if (currentBlock.trim()) blocks.push(currentBlock.trim());
      currentBlock = trimmed
        .replace(/^\s*[-–—]+\s*/, '')
        .replace(/^\s*[•●○◆◇▸▹►▻➤➢→]\s*/, '')
        .replace(/^\s*\d+[.)]\s*/, '')
        .replace(/^\s*o\s+/, '')  // Army "o" bullet
        .trim();
    } else {
      currentBlock += (currentBlock ? ' ' : '') + trimmed;
    }
  }
  if (currentBlock.trim()) blocks.push(currentBlock.trim());

  // If we got very few blocks, the text is a continuous narrative
  if (blocks.length <= 1 && cleanedText.length > 100) {
    return splitNarrativeIntoBlocks(blocks.length === 1 ? blocks[0] : cleanedText);
  }

  // Split long blocks further
  const refined: string[] = [];
  for (const block of blocks) {
    if (block.length > 300) {
      refined.push(...splitNarrativeIntoBlocks(block));
    } else {
      refined.push(block);
    }
  }
  return refined;
}

function splitNarrativeIntoBlocks(text: string): string[] {
  // Split on " - " or " – " (eval dash separator)
  const dashParts = text.split(/\s+[-–—]{1,2}\s+/);
  if (dashParts.length > 1 && dashParts.every(p => p.length >= 15)) {
    // Merge short fragments (< 8 words) with the previous block
    const merged: string[] = [];
    for (const part of dashParts.map(p => p.trim()).filter(p => p.length >= 10)) {
      const wordCount = part.split(/\s+/).length;
      if (merged.length > 0 && wordCount < 8) {
        merged[merged.length - 1] += '. ' + part;
      } else {
        merged.push(part);
      }
    }
    return merged.filter(p => p.length >= 15);
  }

  // Split on sentence boundaries
  const sentences = splitIntoSentences(text);
  if (sentences.length <= 1) return [text];

  // Merge short fragments with the preceding sentence
  const merged: string[] = [];
  for (const s of sentences) {
    const wordCount = s.split(/\s+/).length;
    if (merged.length > 0 && (wordCount < 8 || !startsWithActionVerb(s))) {
      // Merge with previous if short or doesn't start with action verb
      merged[merged.length - 1] += '. ' + s;
    } else {
      merged.push(s);
    }
  }
  return merged.filter(s => s.length >= 25);
}

function splitIntoSentences(text: string): string[] {
  const parts: string[] = [];
  let current = '';
  const tokens = text.split(/(?<=[.;!])\s+/);
  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;
    if (current && trimmed.length > 0 && /^[A-Z]/.test(trimmed) && current.length >= 25) {
      parts.push(current.trim());
      current = trimmed;
    } else {
      current += (current ? ' ' : '') + trimmed;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

// ============================================================================
// Step 3: Filter eval praise / recommendation noise
// ============================================================================

/** Patterns that are PURE praise — no accomplishment content */
const PRAISE_PATTERNS: RegExp[] = [
  // Officer recommendations about the person
  /\bwould\s+be\s+an?\s+(EP|early\s+promote|top\s+performer|must\s+promote)/i,
  /\bshould\s+be\s+(promoted|selected|advanced)/i,
  /\bready\s+for\s+(promotion|advancement|chief|senior|CPO|SCPO|MCPO)/i,
  /\bhighest\s+recommendation/i,
  /\bstrongly\s+recommend/i,
  /\bhas\s+my\s+(confidence|strongest|full|complete|highest)/i,
  /\bmy\s+(strongest|highest|full)\s+recommendation/i,
  /\b(promote|select)\s+(now|immediately|ahead\s+of)/i,
  /\bready\s+(now|today)\s+for/i,
  /\bnumber\s+\d+\s+of\s+\d+/i,
  /\b#\d+\s+of\s+\d+/i,
  /\branked?\s+\d+\s+of\s+\d+/i,

  // Generic character praise without accomplishment
  /\b(clear|obvious)\s+(impact\s+player|choice|leader)/i,
  /\bfighting\s+spirit/i,
  /\bcrew\s+strives?\s+to\s+emulate/i,
  /\b(sailors?|crew|team)\s+(look\s+up\s+to|respect|admire|emulate)/i,
  /\bwell\s+known\s+across/i,
  /\bthe\s+best\s+\w+\s+in\s+/i,
  /\bfinest\s+\w+\s+(i\'ve|I\s+have)\s+(ever\s+)?(seen|known|worked)/i,
  /\b(exhibits?|displays?|demonstrates?)\s+(superb|outstanding|exceptional|exemplary|remarkable)\s+(leadership|abilities|character|integrity|performance)\s*[.!]?\s*$/i,
  /\b(a\s+)?true\s+(professional|leader|warrior|sailor|patriot)/i,
  /\b(unlimited|unmatched|unparalleled)\s+(potential|talent|ability)/i,
  /\bwithout\s+(equal|peer|comparison)/i,
  /\binvaluable\s+(asset|member|addition)\s+to/i,
  /\bsets?\s+the\s+standard/i,
  /\brole\s+model/i,

  // All 1.0 marks patterns
  /\ball\s+1\.0\s+marks?\b/i,
  /\bmarks?\s+must\s+be\s+substantiated\b/i,

  // Comparative praise
  /\bI\s+relied\s+on\b/i,
  /\bmy\s+(go[\s-]to|right[\s-]hand)\b/i,
  /\bcan[\s-]do\s+attitude\b/i,
  /\bthe\s+epitome\s+of\b/i,
  /\bhand[\s-]picked\b/i,
  /\bgo[\s-]to\s+(person|individual|sailor|member)\b/i,

  // RSCA / admin noise
  /^\s*RSCA\b/i,
  /^\s*ITA\b/i,
  /^\s*(individual|group)\s+trait\s+average/i,
  /^\s*reporting\s+senior\s+cumulative\b/i,

  // Form headers and admin
  /^(block\s+\d+|section\s+\d+|page\s+\d+)/i,
  /^(member|reporting\s+senior|regular|concurrent|not\s+observed)/i,
  /^(navpers|bupersinst|opnavinst|milpersman)/i,
  /^(signature|date|ssn|dod\s*id|uic)/i,
  /^(from:|to:|via:|subj:|ref:|encl:)/i,
  /^(promotion\s+recommendation|summary|trait\s+average)/i,
  /^(comments\s+on\s+performance|performance\s+traits)/i,
  /^(professional\s+knowledge|quality\s+of\s+work|military\s+bearing)/i,
  /^(early\s+promote|must\s+promote|promotable|progressing|significant\s+problems)/i,

  // Rating lines
  /^\d+\.\d+\s*$/,
  /^[1-5]\s*[.-]\s*(above|below|meets)/i,
];

/**
 * Check if a block is purely eval praise with no extractable accomplishment.
 * Blocks with metrics (numbers, percentages) are NEVER pure noise.
 */
function isPureNoise(text: string): boolean {
  const lower = text.toLowerCase().trim();

  // Blocks containing metrics/numbers are NEVER pure noise — they have quantified results
  const hasMetrics = /\d+%|\$[\d,.]+|\d{2,}\s*(person|personnel|team|staff|members|employees)/i.test(text);
  if (hasMetrics) return false;

  // Long blocks (100+ chars) with a praise fragment are NOT pure noise
  // They likely contain an accomplishment mixed with praise — stripInlinePraise handles this
  if (text.length >= 100 && PRAISE_PATTERNS.some(p => p.test(text))) return false;

  // Short blocks that are entirely praise → noise
  if (PRAISE_PATTERNS.some(p => p.test(text))) return true;

  // Very short text (<30 chars) is likely a header or label
  if (lower.length < 30) return true;

  // Ends with exclamation mark and is very short — likely praise
  if (/!\s*$/.test(text) && text.length < 60) return true;

  // Starts with "Is the" or "Is a" — third-person praise
  if (/^is\s+(the|a|an)\s+/i.test(lower)) return true;

  // "my [superlative]" — officer praise
  if (/^my\s+(best|finest|top|strongest|most)/i.test(lower)) return true;

  return false;
}

/**
 * Strip embedded praise phrases from within an accomplishment block,
 * keeping the accomplishment content.
 */
function stripInlinePraise(text: string): string {
  let result = text;

  // Remove inline superlative praise fragments
  const inlinePraise: RegExp[] = [
    /\b-?\s*(exhibits?|displays?|demonstrates?)\s+(superb|outstanding|exceptional|exemplary)\s+(leadership|abilities?|character|performance)\s*[-–—.!]?\s*/gi,
    /\b-?\s*clear\s+impact\s+player\s*[-–—.!]?\s*/gi,
    /\b-?\s*fighting\s+spirit\s*[-–—.!]?\s*/gi,
    /\b-?\s*crew\s+strives?\s+to\s+emulate\s*[-–—.!]?\s*/gi,
    /\b-?\s*well\s+known\s+across\s+the\s+waterfront\s*[-–—.!]?\s*/gi,
    /\b-?\s*has\s+my\s+(confidence|strongest|full|highest)\s+\w*\s*[-–—.!]?\s*/gi,
    /\b-?\s*true\s+(professional|leader|warrior|sailor)\s*[-–—.!]?\s*/gi,
    /\b-?\s*sets?\s+the\s+standard\s*(for\s+\w+)?\s*[-–—.!]?\s*/gi,
    /\b-?\s*role\s+model\s*(for\s+\w+)?\s*[-–—.!]?\s*/gi,
    /\b-?\s*(without\s+(equal|peer)|unmatched|unparalleled)\s*[-–—.!]?\s*/gi,
    /\b-?\s*the\s+best\s+\w+\s+in\s+[\w\s]+[-–—.!]?\s*/gi,
    /\b-?\s*would\s+be\s+an?\s+\w+\s+if\b[^.]*[-–—.!]?\s*/gi,
    /\b-?\s*i\s+relied\s+on\s+\w+[^.]*[-–—.!]?\s*/gi,
  ];

  for (const pattern of inlinePraise) {
    result = result.replace(pattern, ' ');
  }

  return result.replace(/\s{2,}/g, ' ').trim();
}

// ============================================================================
// Step 4: Convert third-person → first-person
// ============================================================================

/**
 * Convert third-person eval language to first-person resume language.
 *
 * Handles patterns like:
 * - "He led 7 JOs" → "Led 7 JOs"
 * - "As my PT DLCPO & 3MC, he led..." → "Served as Division Senior Supervisor, led..."
 * - "His outstanding performance" → remove or "Demonstrated outstanding performance"
 * - "I relied on his talent" → remove
 */
function convertToFirstPerson(text: string): string {
  let result = text.trim();

  // Handle "As my [role], he/she [verb]..." → "Served as [role], [verb]..."
  result = result.replace(
    /^as\s+my\s+(.+?),?\s+(he|she|they)\s+/i,
    (_, role, _pronoun) => `Served as ${role.trim()}, `,
  );

  // Handle "As [role], he/she [verb]..." → "Serving as [role], [verb]..."
  result = result.replace(
    /^as\s+(a\s+|the\s+|an\s+)?(.+?),?\s+(he|she|they)\s+/i,
    (_, _article, role, _pronoun) => `Served as ${role.trim()}, `,
  );

  // Remove "I relied on his/her [quality]" entirely
  result = result.replace(/\bI\s+relied\s+on\s+(his|her|their)\s+[^,.]+[,.]?\s*/gi, '');

  // Remove leading third-person subjects
  const leadingSubjects = [
    /^(he|she|they)\s+(is|are|was|were|has|had|have)\s+(a\s+|an\s+|the\s+)?/i,
    /^(he|she|they)\s+/i,
    /^(the\s+member|this\s+sailor|this\s+officer|this\s+petty\s+officer|petty\s+officer\s+\w+|the\s+sailor)\s+/i,
  ];
  for (const pattern of leadingSubjects) {
    result = result.replace(pattern, '');
  }

  // Remove mid-sentence possessives
  result = result.replace(/\b(his|her|their)\s+(outstanding|exceptional|superior|exemplary|superb)\s+/gi, '$2 ');
  result = result.replace(/\b(his|her|their)\s+/gi, '');
  result = result.replace(/\b(he|she|they)\s+(was|were|is|are|has|had|have)\s+/gi, '');
  result = result.replace(/\b(he|she|they)\s+/gi, '');
  result = result.replace(/\b(him|himself|herself|themselves)\b/gi, '');

  // "my crew" / "my team" / "my sailors" → "the team"
  result = result.replace(/\bmy\s+(crew|sailors?|team|department|division|shop)\b/gi, 'the team');

  // Clean double spaces
  result = result.replace(/\s{2,}/g, ' ').trim();

  return result;
}

// ============================================================================
// Step 5: Personnel number summing
// ============================================================================

/**
 * Sum personnel counts like "7 JOs, 1 CPO and 13 Sailors" → "21-person team"
 * Also preserve the breakdown detail.
 */
function sumPersonnelCounts(text: string): string {
  // Pattern: multiple "[number] [personnel type]" joined by commas/and
  const personnelPattern = /(\d+)\s+(JOs?|junior\s+managers?|CPOs?|senior\s+supervisors?|sailors?|team\s+members?|personnel|staff|employees?|technicians?|operators?|specialists?|officers?|enlisted|NCOs?|contractors?|civilians?|marines?|soldiers?|airmen)/gi;

  const matches = [...text.matchAll(personnelPattern)];
  if (matches.length < 2) return text;

  // Sum the numbers
  let total = 0;
  for (const m of matches) {
    total += parseInt(m[1], 10);
  }
  if (total < 2) return text;

  // Find the span of the personnel enumeration
  const firstIdx = matches[0].index!;
  const lastMatch = matches[matches.length - 1];
  const lastIdx = lastMatch.index! + lastMatch[0].length;

  // Check if they're close together (part of the same list)
  if (lastIdx - firstIdx > 150) return text;

  const before = text.substring(0, firstIdx);
  const after = text.substring(lastIdx);

  return `${before}${total}-person cross-functional team${after}`;
}

// ============================================================================
// Step 6: STAR format enforcement
// ============================================================================

/**
 * Ensure the bullet starts with a strong action verb.
 * If it doesn't, try to prepend one based on content analysis.
 */
function ensureActionVerb(text: string): string {
  if (startsWithActionVerb(text)) return text;

  // If starts with gerund (-ing), convert to past tense
  const gerundMatch = text.match(/^(\w+ing)\b/);
  if (gerundMatch) {
    const gerund = gerundMatch[1].toLowerCase();
    const pastTense = gerundToPastTense(gerund);
    if (pastTense) {
      return pastTense.charAt(0).toUpperCase() + pastTense.slice(1) + text.slice(gerund.length);
    }
  }

  // If starts with "Served as", that counts
  if (/^served\s+as\b/i.test(text)) return text;

  // If starts with a noun or adjective, try to infer the right verb
  if (/^(responsible\s+for|in\s+charge\s+of)\s+/i.test(text)) {
    return text.replace(/^(responsible\s+for|in\s+charge\s+of)\s+/i, 'Managed ');
  }

  // If starts with "Demonstrated" from our earlier conversion, that's fine
  if (/^demonstrated\b/i.test(text)) return text;

  // Content-based verb inference
  if (/\b(team|personnel|staff|crew|division)\b/i.test(text)) {
    return 'Led ' + text.charAt(0).toLowerCase() + text.slice(1);
  }
  if (/\b(training|program|initiative|project)\b/i.test(text)) {
    return 'Managed ' + text.charAt(0).toLowerCase() + text.slice(1);
  }
  if (/\b(inspection|audit|review|assessment)\b/i.test(text)) {
    return 'Conducted ' + text.charAt(0).toLowerCase() + text.slice(1);
  }
  if (/\b(event|ceremony|meeting|board)\b/i.test(text)) {
    return 'Organized ' + text.charAt(0).toLowerCase() + text.slice(1);
  }

  // Generic fallback: "Managed"
  return 'Managed ' + text.charAt(0).toLowerCase() + text.slice(1);
}

function startsWithActionVerb(text: string): boolean {
  return ACTION_VERB_RE.test(text.trim());
}

/**
 * Convert common gerunds to past tense for resume bullet openers.
 */
function gerundToPastTense(gerund: string): string | null {
  const map: Record<string, string> = {
    'leading': 'Led', 'managing': 'Managed', 'directing': 'Directed',
    'coordinating': 'Coordinated', 'supervising': 'Supervised',
    'training': 'Trained', 'developing': 'Developed', 'maintaining': 'Maintained',
    'executing': 'Executed', 'achieving': 'Achieved', 'completing': 'Completed',
    'establishing': 'Established', 'implementing': 'Implemented',
    'improving': 'Improved', 'increasing': 'Increased', 'reducing': 'Reduced',
    'organizing': 'Organized', 'overseeing': 'Oversaw',
    'hosting': 'Hosted', 'chairing': 'Chaired', 'conducting': 'Conducted',
    'performing': 'Performed', 'supporting': 'Supported',
    'ensuring': 'Ensured', 'facilitating': 'Facilitated',
    'delivering': 'Delivered', 'serving': 'Served',
    'spearheading': 'Spearheaded', 'orchestrating': 'Orchestrated',
  };
  return map[gerund.toLowerCase()] || null;
}

/**
 * Capitalize the first letter of a bullet.
 */
function capitalizeFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Ensure bullet ends with a period (not exclamation mark).
 */
function ensureEndPunctuation(text: string): string {
  const trimmed = text.trimEnd();
  if (!trimmed) return trimmed;
  // Replace exclamation with period (eval noise)
  if (trimmed.endsWith('!')) return trimmed.slice(0, -1) + '.';
  if (/[.]$/.test(trimmed)) return trimmed;
  return trimmed + '.';
}

// ============================================================================
// Step 7: Quality gate
// ============================================================================

/**
 * Check if a bullet still contains unexpanded military acronyms.
 * Looks for 2-5 character ALL-CAPS words that aren't common English.
 */
function hasUnexpandedAcronyms(text: string): boolean {
  const words = text.match(/\b[A-Z]{2,5}\b/g) || [];
  const commonOk = new Set(['AM', 'PM', 'US', 'OK', 'ID', 'TV', 'PC', 'HR', 'IT', 'QA', 'PR']);
  let unexpanded = 0;
  for (const w of words) {
    if (!commonOk.has(w) && !COMMON_ENGLISH_WORDS.has(w)) {
      unexpanded++;
    }
  }
  // Allow up to 1 unexpanded (might be a proper noun or org name)
  return unexpanded > 1;
}

/**
 * Final quality gate — reject bullets that don't meet resume standards.
 * Relaxed: preserves bullets with metrics, restructures missing verbs,
 * and guarantees a minimum of 5 bullets when enough input exists.
 */
function qualityGate(bullets: ParsedEvalBullet[]): ParsedEvalBullet[] {
  const filtered: ParsedEvalBullet[] = [];
  const rejected: { bullet: ParsedEvalBullet; reason: string }[] = [];
  const seen = new Set<string>();

  for (const bullet of bullets) {
    let text = bullet.translated.trim();
    let currentBullet = bullet;

    // Reject: empty or too short
    if (!text || text.length < 40) {
      console.log(`[QualityGate] REJECT (too short ${text.length} chars): "${text.substring(0, 60)}..."`);
      rejected.push({ bullet: currentBullet, reason: `too short (${text.length} chars)` });
      continue;
    }

    // Reject: under 8 words (lowered from 10)
    const wordCount = text.split(/\s+/).length;
    if (wordCount < 8) {
      console.log(`[QualityGate] REJECT (${wordCount} words < 8): "${text.substring(0, 60)}..."`);
      rejected.push({ bullet: currentBullet, reason: `too few words (${wordCount})` });
      continue;
    }

    // If doesn't start with action verb, try to restructure (don't reject)
    if (!startsWithActionVerb(text) && !/^(served|demonstrated)\b/i.test(text)) {
      const restructured = ensureActionVerb(text);
      console.log(`[QualityGate] RESTRUCTURE verb: "${text.substring(0, 40)}..." → "${restructured.substring(0, 40)}..."`);
      text = restructured;
      currentBullet = { ...currentBullet, translated: text };
    }

    // Reject: is a question
    if (/\?\s*$/.test(text)) {
      console.log(`[QualityGate] REJECT (question): "${text.substring(0, 60)}..."`);
      rejected.push({ bullet: currentBullet, reason: 'question' });
      continue;
    }

    // Reject: still contains recommendation language
    if (/\b(would\s+be|should\s+be|ready\s+for\s+promotion|ready\s+for\s+chief)\b/i.test(text)) {
      console.log(`[QualityGate] REJECT (recommendation): "${text.substring(0, 60)}..."`);
      rejected.push({ bullet: currentBullet, reason: 'recommendation language' });
      continue;
    }
    if (/\bhighest\s+recommendation\b/i.test(text)) {
      rejected.push({ bullet: currentBullet, reason: 'recommendation language' });
      continue;
    }
    if (/\bpromote\s+(now|ahead|immediately)\b/i.test(text)) {
      rejected.push({ bullet: currentBullet, reason: 'promotion language' });
      continue;
    }

    // Reject: pure praise that slipped through
    if (PRAISE_PATTERNS.some(p => p.test(text))) {
      console.log(`[QualityGate] REJECT (praise): "${text.substring(0, 60)}..."`);
      rejected.push({ bullet: currentBullet, reason: 'praise pattern' });
      continue;
    }

    // Reject: too many unexpanded acronyms (translation failed)
    // But NOT if the bullet also has metrics (still valuable)
    const hasMetrics = /\d+%|\$[\d,.]+|\d{2,}-person|\d{2,}\+?\s*(personnel|team|staff|employees|members)/i.test(text);
    if (hasUnexpandedAcronyms(text) && !hasMetrics) {
      console.log(`[QualityGate] REJECT (unexpanded acronyms): "${text.substring(0, 60)}..."`);
      rejected.push({ bullet: currentBullet, reason: 'unexpanded acronyms' });
      continue;
    }

    // Reject: mostly numbers or punctuation
    const alphaRatio = (text.match(/[a-zA-Z]/g) || []).length / text.length;
    if (alphaRatio < 0.5) {
      console.log(`[QualityGate] REJECT (low alpha ratio ${alphaRatio.toFixed(2)}): "${text.substring(0, 60)}..."`);
      rejected.push({ bullet: currentBullet, reason: `low alpha ratio (${alphaRatio.toFixed(2)})` });
      continue;
    }

    // Deduplicate by normalized prefix
    const key = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').substring(0, 60);
    if (seen.has(key)) {
      console.log(`[QualityGate] REJECT (duplicate): "${text.substring(0, 60)}..."`);
      rejected.push({ bullet: currentBullet, reason: 'duplicate' });
      continue;
    }
    seen.add(key);

    console.log(`[QualityGate] PASS: "${text.substring(0, 80)}..."`);
    filtered.push(currentBullet);
  }

  // Minimum 5-bullet guarantee: if we filtered too aggressively, add back best rejects
  const MIN_BULLETS = 5;
  if (filtered.length < MIN_BULLETS && rejected.length > 0) {
    console.log(`[QualityGate] Only ${filtered.length} passed, need ${MIN_BULLETS}. Adding back best rejected bullets.`);
    // Sort rejected by coverage descending, prefer longer bullets
    const recoverCandidates = rejected
      .filter(r => r.reason !== 'praise pattern' && r.reason !== 'recommendation language' && r.reason !== 'promotion language' && r.reason !== 'duplicate')
      .sort((a, b) => {
        if (b.bullet.coverage !== a.bullet.coverage) return b.bullet.coverage - a.bullet.coverage;
        return b.bullet.translated.length - a.bullet.translated.length;
      });

    for (const candidate of recoverCandidates) {
      if (filtered.length >= MIN_BULLETS) break;
      let text = candidate.bullet.translated.trim();
      // Ensure action verb on recovered bullets
      if (!startsWithActionVerb(text) && !/^(served|demonstrated)\b/i.test(text)) {
        text = ensureActionVerb(text);
      }
      text = capitalizeFirst(text);
      text = ensureEndPunctuation(text);
      const key = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').substring(0, 60);
      if (!seen.has(key)) {
        seen.add(key);
        console.log(`[QualityGate] RECOVERED: "${text.substring(0, 60)}..." (was rejected for: ${candidate.reason})`);
        filtered.push({ ...candidate.bullet, translated: text });
      }
    }
  }

  console.log(`[QualityGate] Final: ${filtered.length} bullets passed (${rejected.length} rejected)`);

  // Sort by: metrics first, then coverage, then ideal word count
  return filtered
    .sort((a, b) => {
      // Priority 1: Bullets with numbers/metrics go first
      const aHasMetrics = /\d+%|\$[\d,.]+[KMBkmb]?|\d{2,}-person|\d{2,}\+?\s*(personnel|team|staff|employees|members)/i.test(a.translated);
      const bHasMetrics = /\d+%|\$[\d,.]+[KMBkmb]?|\d{2,}-person|\d{2,}\+?\s*(personnel|team|staff|employees|members)/i.test(b.translated);
      if (aHasMetrics !== bHasMetrics) return bHasMetrics ? 1 : -1;

      // Priority 2: Higher coverage
      if (b.coverage !== a.coverage) return b.coverage - a.coverage;

      // Priority 3: Prefer substantial bullets (20-35 words ideal)
      const aWords = a.translated.split(/\s+/).length;
      const bWords = b.translated.split(/\s+/).length;
      const aIdeal = Math.abs(aWords - 27);
      const bIdeal = Math.abs(bWords - 27);
      return aIdeal - bIdeal;
    })
    .slice(0, 8);
}

// ============================================================================
// Main Public API
// ============================================================================

/**
 * Parse and translate eval text into STAR-format resume bullets.
 *
 * This is the main entry point for the "Paste Eval → Translate" feature.
 * Free tier only — uses dictionary translation, zero AI calls.
 *
 * Pipeline:
 *   1. Clean raw text (strip formatting, normalize ALL CAPS)
 *   2. Parse into accomplishment blocks
 *   3. Filter out eval praise / recommendation noise
 *   4. Convert third-person → first-person
 *   5. Translate military → civilian via dictionary
 *   6. Format as STAR bullets (action verb + scope + result)
 *   7. Quality gate
 */
export async function parseAndTranslateEvalText(
  rawText: string,
  branch: string,
  rank: string,
): Promise<ParsedEvalBullet[]> {
  if (!rawText.trim()) return [];

  console.log(`[EvalParser] === START === Input length: ${rawText.length} chars`);
  console.log(`[EvalParser] Raw input (first 200): "${rawText.substring(0, 200)}..."`);

  // Step 1: Clean
  const cleaned = cleanEvalText(rawText);
  const normalized = normalizeAllCaps(cleaned);
  console.log(`[EvalParser] Step 1 - Cleaned/normalized (first 200): "${normalized.substring(0, 200)}..."`);

  // Auto-detect branch from eval format if not provided
  const effectiveBranch = branch || detectBranch(rawText) || '';
  console.log(`[EvalParser] Detected branch: "${effectiveBranch}"`);

  // Step 2: Parse into accomplishment blocks
  const blocks = parseAccomplishmentBlocks(normalized);
  console.log(`[EvalParser] Step 2 - Parsed ${blocks.length} blocks:`);
  blocks.forEach((b, i) => console.log(`  Block ${i + 1}: "${b.substring(0, 100)}${b.length > 100 ? '...' : ''}"`));
  if (blocks.length === 0) return [];

  // Step 3-6: Process each block
  const results: ParsedEvalBullet[] = await Promise.all(
    blocks.map(async (block, blockIdx) => {
      // Step 3: Filter pure noise
      if (isPureNoise(block)) {
        console.log(`  [Block ${blockIdx + 1}] Step 3 - FILTERED as noise: "${block.substring(0, 60)}..."`);
        return { original: block, translated: '', coverage: 0 };
      }

      // Step 3b: Strip inline praise, keeping accomplishment content
      let bullet = stripInlinePraise(block);
      if (!bullet || bullet.length < 20) {
        console.log(`  [Block ${blockIdx + 1}] Step 3b - Too short after praise strip (${bullet?.length || 0} chars): "${bullet?.substring(0, 60)}"`);
        return { original: block, translated: '', coverage: 0 };
      }

      // Step 4: Convert third-person → first-person
      bullet = convertToFirstPerson(bullet);
      if (!bullet || bullet.length < 15) {
        console.log(`  [Block ${blockIdx + 1}] Step 4 - Too short after first-person conversion (${bullet?.length || 0} chars)`);
        return { original: block, translated: '', coverage: 0 };
      }
      console.log(`  [Block ${blockIdx + 1}] Step 4 - First person: "${bullet.substring(0, 80)}..."`);

      // Step 5: Sum personnel counts BEFORE translation
      // (so "7 JOs, 1 CPO and 13 Sailors" becomes "21-person team")
      bullet = sumPersonnelCounts(bullet);

      // Step 5b: Translate through dictionary
      const dictResult = await translateBullet(bullet, { branch: effectiveBranch, rank });
      let translated = dictResult.translatedText;
      console.log(`  [Block ${blockIdx + 1}] Step 5 - Translated (coverage ${dictResult.coverage}%): "${translated.substring(0, 80)}..."`);

      // Apply verb suggestion if available
      if (dictResult.verbSuggestions.length > 0) {
        const firstVerb = dictResult.verbSuggestions[0];
        const firstWord = translated.split(/\s/)[0];
        if (firstWord.toLowerCase() === firstVerb.current.toLowerCase()) {
          translated = firstVerb.suggested + translated.substring(firstWord.length);
        }
      }

      // Step 6: STAR format enforcement + professional polish
      translated = ensureActionVerb(translated);
      translated = capitalizeFirst(translated.trim());
      translated = ensureEndPunctuation(translated);
      // Run through shared output polisher for grammar, numbers, filler, praise
      translated = polishBullet(translated);
      // Re-ensure action verb after polish (polishBullet can strip verbs via weak verb rewrites)
      translated = ensureActionVerb(translated);
      translated = capitalizeFirst(translated.trim());
      translated = ensureEndPunctuation(translated);
      console.log(`  [Block ${blockIdx + 1}] Step 6 - Polished: "${translated.substring(0, 80)}..."`);

      return {
        original: block,
        translated,
        coverage: dictResult.coverage,
      };
    }),
  );

  // Step 7: Quality gate
  const withContent = results.filter(r => r.translated.length > 0);
  console.log(`[EvalParser] Step 7 - ${withContent.length} bullets entering quality gate (${results.length - withContent.length} empty)`);
  const final = qualityGate(withContent);
  console.log(`[EvalParser] === DONE === ${final.length} bullets output`);
  return final;
}
