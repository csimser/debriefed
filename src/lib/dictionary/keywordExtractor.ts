/**
 * Dictionary Translation Engine — Keyword Extractor
 *
 * Scans a job description against cached dictionary data to extract
 * structured requirements. NO API calls, NO AI — pure string matching.
 */

import { getDictionary } from './dictionaryQueries';
import type {
  DictionaryCache,
  DictAcronym,
  DictAtsKeyword,
  DictMilitaryJargon,
  DictPhraseTranslation,
  ExtractionResult,
  ExtractedKeyword,
  DetectedAcronym,
  DetectedMilitaryTerm,
} from './types';

// ============================================================================
// Public API
// ============================================================================

/**
 * Extract structured requirements from a raw job description.
 * Scans text against all cached dictionary tables.
 *
 * @param jobDescription - The full job posting text
 * @returns Structured extraction with skills, certs, clearance, education, etc.
 */
export async function extractKeywords(jobDescription: string): Promise<ExtractionResult> {
  const dict = await getDictionary();
  const sections = splitSections(jobDescription);

  // Run all matchers
  const { industry, roleType, keywords: atsKeywords } = matchAtsKeywords(sections, dict.atsKeywords);
  const detectedAcronyms = matchAcronyms(sections.full, dict.acronyms);
  const detectedMilitaryTerms = matchMilitaryTerms(sections.full, dict.militaryJargon, dict.phraseTranslations);
  const clearanceRequired = extractClearance(sections.full);
  const educationRequired = extractEducation(sections.full);
  const yearsRequired = extractYears(sections.full);
  const { requiredSkills, preferredSkills, requiredCerts, preferredCerts, tools } =
    extractSkillsAndCerts(sections, atsKeywords, dict);

  // Extract company name and job title from JD text
  const companyName = extractCompanyName(jobDescription);
  const jobTitle = extractJobTitle(jobDescription);

  return {
    industry,
    roleType,
    companyName,
    jobTitle,
    requiredSkills,
    preferredSkills,
    requiredCerts,
    preferredCerts,
    clearanceRequired,
    educationRequired,
    yearsRequired,
    tools,
    atsKeywords,
    detectedAcronyms,
    detectedMilitaryTerms,
    rawSections: sections,
  };
}

// ============================================================================
// Section Splitting
// ============================================================================

const REQUIRED_HEADER_WORDS = [
  'required', 'minimum', 'must have', 'must-have', 'essential',
  'mandatory', 'basic qualifications', 'requirements', 'what you need',
  'what we require', 'you must have', 'qualifications',
];

const PREFERRED_HEADER_WORDS = [
  'preferred', 'desired', 'nice to have', 'nice-to-have', 'bonus',
  'ideal', 'additional', 'plus', 'it would be great',
  'preferred qualifications', 'desired qualifications',
];

const RESPONSIBILITIES_HEADER_WORDS = [
  'responsibilities', 'duties', 'what you\'ll do', 'what you will do',
  'about the role', 'role description', 'job duties', 'key responsibilities',
];

/** Inline markers that can appear mid-line (e.g., "Preferred: Agile, EVMS") */
const INLINE_SECTION_MARKERS: { marker: string; type: 'required' | 'preferred' }[] = [
  { marker: 'preferred:', type: 'preferred' },
  { marker: 'desired:', type: 'preferred' },
  { marker: 'nice to have:', type: 'preferred' },
  { marker: 'nice-to-have:', type: 'preferred' },
  { marker: 'bonus:', type: 'preferred' },
];

interface TextSection {
  header: string;
  content: string;
  type: 'required' | 'preferred' | 'responsibilities' | 'other';
}

/**
 * Split a job description into required/preferred/general sections
 * by detecting section headers in the text.
 */
function splitSections(jd: string): { required: string; preferred: string; full: string } {
  const normalized = jd.replace(/\r\n/g, '\n');
  const lines = normalized.split('\n');
  const sections: TextSection[] = [];
  let currentSection: TextSection = { header: '', content: '', type: 'other' };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      currentSection.content += '\n';
      continue;
    }

    const lower = trimmed.toLowerCase();

    // Detect section headers: short lines ending with colon, or ALL CAPS lines
    const isLikelyHeader =
      (trimmed.endsWith(':') && trimmed.length < 100) ||
      (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && trimmed.length < 80 && /[A-Z]/.test(trimmed));

    if (isLikelyHeader) {
      // Save previous section if it has content
      if (currentSection.content.trim()) {
        sections.push(currentSection);
      }

      // Classify new section
      let type: TextSection['type'] = 'other';
      if (REQUIRED_HEADER_WORDS.some(w => lower.includes(w))) {
        type = 'required';
      } else if (PREFERRED_HEADER_WORDS.some(w => lower.includes(w))) {
        type = 'preferred';
      } else if (RESPONSIBILITIES_HEADER_WORDS.some(w => lower.includes(w))) {
        type = 'responsibilities';
      }

      currentSection = { header: trimmed, content: '', type };
    } else {
      // Check for inline section markers (e.g., "Preferred: Agile, EVMS")
      const inlineMatch = findInlineMarker(lower);
      if (inlineMatch) {
        // Content before the marker stays in current section
        const beforeMarker = trimmed.substring(0, inlineMatch.index).trim();
        if (beforeMarker) {
          currentSection.content += beforeMarker + '\n';
        }
        // Save current section
        if (currentSection.content.trim()) {
          sections.push(currentSection);
        }
        // Start new section with content after the marker
        const afterMarker = trimmed.substring(inlineMatch.index + inlineMatch.marker.length).trim();
        currentSection = {
          header: inlineMatch.marker,
          content: afterMarker ? afterMarker + '\n' : '',
          type: inlineMatch.type,
        };
      } else {
        currentSection.content += trimmed + '\n';
      }
    }
  }

  // Push the last section
  if (currentSection.content.trim()) {
    sections.push(currentSection);
  }

  // Aggregate by type
  const requiredText = sections
    .filter(s => s.type === 'required')
    .map(s => s.content)
    .join('\n')
    .trim();

  const preferredText = sections
    .filter(s => s.type === 'preferred')
    .map(s => s.content)
    .join('\n')
    .trim();

  return {
    // If no explicit required section found, treat the full JD as required
    required: requiredText || normalized,
    preferred: preferredText,
    full: normalized,
  };
}

/** Find an inline section marker in a lowercased line */
function findInlineMarker(lowerLine: string): { marker: string; type: TextSection['type']; index: number } | null {
  for (const { marker, type } of INLINE_SECTION_MARKERS) {
    const idx = lowerLine.indexOf(marker);
    if (idx >= 0) {
      return { marker, type, index: idx };
    }
  }
  return null;
}

// ============================================================================
// ATS Keyword Matching
// ============================================================================

/**
 * Match ATS keywords from all industries/roles against the JD.
 * Determines the best-fit industry and role type by keyword vote count.
 */
function matchAtsKeywords(
  sections: { required: string; preferred: string; full: string },
  atsKeywords: DictAtsKeyword[],
): { industry: string | null; roleType: string | null; keywords: ExtractedKeyword[] } {
  const fullLower = sections.full.toLowerCase();
  const requiredLower = sections.required.toLowerCase();
  const preferredLower = sections.preferred.toLowerCase();

  const matched: ExtractedKeyword[] = [];
  const industryScores: Record<string, number> = {};
  const roleTypeScores: Record<string, number> = {};
  const seen = new Set<string>();

  for (const entry of atsKeywords) {
    for (const keyword of entry.keywords) {
      const kwLower = keyword.toLowerCase();

      // Skip if we already matched this exact keyword
      if (seen.has(kwLower)) continue;

      if (containsWord(fullLower, kwLower)) {
        seen.add(kwLower);

        // Determine which section the keyword appears in
        let section: ExtractedKeyword['section'] = 'general';
        if (preferredLower && containsWord(preferredLower, kwLower)) {
          section = 'preferred';
        } else if (containsWord(requiredLower, kwLower)) {
          section = 'required';
        }

        matched.push({ keyword, weight: entry.weight, section, source: 'ats' });

        // Vote for industry and role type
        industryScores[entry.industry] = (industryScores[entry.industry] || 0) + 1;
        roleTypeScores[entry.role_type] = (roleTypeScores[entry.role_type] || 0) + 1;
      }
    }
  }

  // Highest-scoring industry and role type
  const industry = topKey(industryScores);
  const roleType = topKey(roleTypeScores);

  return { industry, roleType, keywords: matched };
}

// ============================================================================
// Acronym Detection
// ============================================================================

/**
 * Detect military acronyms in the JD text.
 * Case-insensitive matching to handle mixed-case JD text and dict entries.
 */
function matchAcronyms(text: string, acronyms: DictAcronym[]): DetectedAcronym[] {
  const results: DetectedAcronym[] = [];
  const seen = new Set<string>();

  for (const entry of acronyms) {
    const key = entry.acronym.toLowerCase();
    if (seen.has(key)) continue;

    const escaped = escapeRegex(entry.acronym);
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(text)) {
      seen.add(key);
      results.push({
        acronym: entry.acronym,
        fullTerm: entry.full_term,
        civilianExplanation: entry.civilian_explanation,
      });
    }
  }

  return results;
}

// ============================================================================
// Military Term Detection
// ============================================================================

/**
 * Detect military jargon and phrases in the JD text.
 */
function matchMilitaryTerms(
  text: string,
  jargon: DictMilitaryJargon[],
  phrases: DictPhraseTranslation[],
): DetectedMilitaryTerm[] {
  const textLower = text.toLowerCase();
  const results: DetectedMilitaryTerm[] = [];
  const seen = new Set<string>();

  // Check phrase translations first (longer phrases before shorter terms)
  const sortedPhrases = [...phrases].sort((a, b) => b.military_phrase.length - a.military_phrase.length);
  for (const entry of sortedPhrases) {
    const termLower = entry.military_phrase.toLowerCase();
    if (seen.has(termLower)) continue;

    if (containsWord(textLower, termLower)) {
      seen.add(termLower);
      results.push({
        term: entry.military_phrase,
        civilianEquivalent: entry.civilian_phrase,
        source: 'phrase',
      });
    }
  }

  // Then check jargon terms
  const sortedJargon = [...jargon].sort((a, b) => b.military_term.length - a.military_term.length);
  for (const entry of sortedJargon) {
    const termLower = entry.military_term.toLowerCase();
    if (seen.has(termLower)) continue;

    if (containsWord(textLower, termLower)) {
      seen.add(termLower);
      results.push({
        term: entry.military_term,
        civilianEquivalent: entry.civilian_equivalent,
        source: 'jargon',
      });
    }
  }

  return results;
}

// ============================================================================
// Skills & Certifications Extraction
// ============================================================================

/**
 * Categorize matched ATS keywords into skills, certs, and tools
 * using dict_cert_funding as the cert reference and common tool patterns.
 */
function extractSkillsAndCerts(
  sections: { required: string; preferred: string; full: string },
  atsKeywords: ExtractedKeyword[],
  dict: DictionaryCache,
): {
  requiredSkills: string[];
  preferredSkills: string[];
  requiredCerts: string[];
  preferredCerts: string[];
  tools: string[];
} {
  // Build a set of known certification keywords
  const certKeywords = new Set(
    dict.certFunding.map(cf => cf.cert_keyword.toLowerCase()),
  );

  // Also detect certs via regex in the JD text
  const certPatterns = /\b(PMP|CISSP|CISM|CEH|CCNA|CCNP|CCIE|CompTIA\s+\w+|AWS\s+\w+|Azure\s+\w+|ITIL|Six\s+Sigma|Lean\s+Six\s+Sigma|CPA|CFA|PHR|SPHR|SHRM-\w+|CAPM|CSM|SAFe|TOGAF)\b/gi;
  const requiredCertsFromRegex = new Set<string>();
  const preferredCertsFromRegex = new Set<string>();

  const requiredLower = sections.required.toLowerCase();
  const preferredLower = sections.preferred.toLowerCase();

  // Scan required section for cert patterns
  let certMatch: RegExpExecArray | null;
  const reqRegex = new RegExp(certPatterns.source, 'gi');
  while ((certMatch = reqRegex.exec(sections.required)) !== null) {
    requiredCertsFromRegex.add(certMatch[0]);
  }
  const prefRegex = new RegExp(certPatterns.source, 'gi');
  while ((certMatch = prefRegex.exec(sections.preferred)) !== null) {
    // Only add if not already in required
    if (!requiredCertsFromRegex.has(certMatch[0])) {
      preferredCertsFromRegex.add(certMatch[0]);
    }
  }

  // Also check for "certification" context near keywords
  // Process line-by-line to prevent matching across newlines
  // e.g., "NIST RMF cybersecurity frameworks\nSix Sigma" should NOT become one cert name
  const certContextRegex = /\b(\w[\w\s/+-]*?)\s*(?:certification|certified|certificate|license|licensure)\b/gi;
  for (const line of sections.required.split('\n')) {
    let contextMatch: RegExpExecArray | null;
    const lineRegex = new RegExp(certContextRegex.source, 'gi');
    while ((contextMatch = lineRegex.exec(line)) !== null) {
      const cleaned = cleanCertName(contextMatch[1]);
      if (cleaned) {
        for (const cert of splitOrCerts(cleaned)) {
          requiredCertsFromRegex.add(cert);
        }
      }
    }
  }
  for (const line of sections.preferred.split('\n')) {
    let contextMatch: RegExpExecArray | null;
    const lineRegex = new RegExp(certContextRegex.source, 'gi');
    while ((contextMatch = lineRegex.exec(line)) !== null) {
      const cleaned = cleanCertName(contextMatch[1]);
      if (cleaned) {
        for (const cert of splitOrCerts(cleaned)) {
          if (!requiredCertsFromRegex.has(cert)) {
            preferredCertsFromRegex.add(cert);
          }
        }
      }
    }
  }

  // Categorize ATS keywords
  const requiredSkills: string[] = [];
  const preferredSkills: string[] = [];
  const requiredCerts: string[] = [...requiredCertsFromRegex];
  const preferredCerts: string[] = [...preferredCertsFromRegex];
  const tools: string[] = [];
  const seenSkills = new Set<string>();

  for (const kw of atsKeywords) {
    const kwLower = kw.keyword.toLowerCase();
    if (seenSkills.has(kwLower)) continue;
    seenSkills.add(kwLower);

    // Is it a known cert?
    if (certKeywords.has(kwLower)) {
      if (kw.section === 'required') {
        if (!requiredCerts.some(c => c.toLowerCase() === kwLower)) {
          requiredCerts.push(kw.keyword);
        }
      } else {
        if (!preferredCerts.some(c => c.toLowerCase() === kwLower)) {
          preferredCerts.push(kw.keyword);
        }
      }
      continue;
    }

    // Is it a tool/technology? Check for common tool indicators
    if (isLikelyTool(kwLower)) {
      tools.push(kw.keyword);
    }

    // Categorize as skill
    if (kw.section === 'required') {
      requiredSkills.push(kw.keyword);
    } else if (kw.section === 'preferred') {
      preferredSkills.push(kw.keyword);
    } else {
      // General section — treat as required since we couldn't differentiate
      requiredSkills.push(kw.keyword);
    }
  }

  return {
    requiredSkills,
    preferredSkills,
    requiredCerts: deduplicateCerts(requiredCerts),
    preferredCerts: deduplicateCerts(preferredCerts.filter(
      c => !requiredCerts.some(r => r.toLowerCase() === c.toLowerCase()),
    )),
    tools,
  };
}

/** Heuristic: is this keyword likely a tool/technology? */
export function isLikelyTool(keyword: string): boolean {
  const toolIndicators = [
    'excel', 'word', 'powerpoint', 'outlook', 'office',
    'jira', 'confluence', 'slack', 'teams', 'zoom',
    'salesforce', 'sap', 'oracle', 'workday', 'servicenow',
    'python', 'java', 'javascript', 'typescript', 'react', 'angular', 'vue',
    'node', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform',
    'git', 'github', 'gitlab', 'jenkins', 'ci/cd',
    'sql', 'postgresql', 'mysql', 'mongodb', 'redis',
    'tableau', 'power bi', 'looker',
    'photoshop', 'illustrator', 'figma', 'sketch',
    'sharepoint', 'visio', 'autoCAD',
  ];
  return toolIndicators.some(t => keyword.toLowerCase().includes(t));
}

/** Strip leading noise words that get captured before cert names */
function cleanCertName(raw: string): string {
  const noisePattern = /^(requires|required|preferred|desired|must have|must-have|having|hold|maintain|possess|obtain|current|valid|active|a|an|the)\s+/i;
  let cleaned = raw.trim();
  let prev = '';
  while (prev !== cleaned) {
    prev = cleaned;
    cleaned = cleaned.replace(noisePattern, '').trim();
  }
  return cleaned;
}

/**
 * Split cert names that contain " or " into individual certs.
 * e.g., "Six Sigma or Lean" → ["Six Sigma", "Lean"]
 */
function splitOrCerts(certName: string): string[] {
  if (/ or /i.test(certName)) {
    return certName.split(/ or /i).map(s => s.trim()).filter(Boolean);
  }
  return [certName];
}

/** Case-insensitive deduplication of string array */
function deduplicateCerts(certs: string[]): string[] {
  const seen = new Set<string>();
  return certs.filter(c => {
    const lower = c.toLowerCase();
    if (seen.has(lower)) return false;
    seen.add(lower);
    return true;
  });
}

// ============================================================================
// Regex Extractors
// ============================================================================

/** Extract security clearance requirement from JD text.
 *  The first clearance level mentioned (outside parenthetical "preferred" context) is the requirement.
 *  "Active Secret clearance (TS/SCI preferred)" → required: Secret, NOT TS/SCI.
 */
function extractClearance(text: string): string | null {
  const lower = text.toLowerCase();

  // Remove parenthetical preferred/desired content so it doesn't pollute required detection
  // e.g., "(TS/SCI preferred)" or "(Top Secret desired)" → stripped out
  const withoutPreferred = lower.replace(/\([^)]*(?:prefer|desired|nice|bonus|ideal)[^)]*\)/gi, '');

  // Clearance patterns ordered by specificity (TS/SCI before Secret to avoid partial match)
  const patterns: { regex: RegExp; level: string }[] = [
    { regex: /\bts\/sci\b/, level: 'TS/SCI' },
    { regex: /\btop\s*secret\b/, level: 'Top Secret' },
    { regex: /\bsecret\b(?!\s*(?:sauce|weapon|ingredient|recipe))/, level: 'Secret' },
    { regex: /\bconfidential\b(?!\s*(?:information|data|agreement))/, level: 'Confidential' },
    { regex: /\bpublic\s*trust\b/, level: 'Public Trust' },
  ];

  // Find all clearance mentions in the cleaned text and return the first one found by position
  let firstMatch: { level: string; index: number } | null = null;
  for (const { regex, level } of patterns) {
    const match = withoutPreferred.match(regex);
    if (match && match.index !== undefined) {
      if (!firstMatch || match.index < firstMatch.index) {
        firstMatch = { level, index: match.index };
      }
    }
  }

  return firstMatch?.level ?? null;
}

/** Extract education requirement from JD text */
function extractEducation(text: string): string | null {
  const lower = text.toLowerCase();
  const patterns: { regex: RegExp; level: string }[] = [
    { regex: /\b(ph\.?d|doctorate)\b/, level: 'Doctorate' },
    { regex: /\b(master'?s?)\s*(degree|of|in)?/, level: "Master's" },
    { regex: /\bmba\b/, level: "Master's" },
    { regex: /\b(bachelor'?s?)\s*(degree|of|in)?/, level: "Bachelor's" },
    { regex: /\b(associate'?s?)\s*(degree|of|in)?/, level: "Associate's" },
    { regex: /\bhigh\s*school\s*diploma\b/, level: 'High School' },
    { regex: /\bged\b/, level: 'GED' },
  ];
  // Return the highest level found (patterns are ordered highest first)
  for (const { regex, level } of patterns) {
    if (regex.test(lower)) return level;
  }
  return null;
}

/** Extract years of experience requirement from JD text */
function extractYears(text: string): number | null {
  const lower = text.toLowerCase();
  // Match patterns like "5+ years", "3-5 years of experience", "minimum 7 years"
  const patterns = [
    /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/i,
    /(?:minimum|at\s*least|min)\s*(\d+)\s*(?:years?|yrs?)/i,
    /(\d+)\s*-\s*\d+\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/i,
  ];
  for (const pattern of patterns) {
    const match = lower.match(pattern);
    if (match) return parseInt(match[1], 10);
  }
  return null;
}

// ============================================================================
// Company Name & Job Title Extraction
// ============================================================================

/** Well-known defense contractors and major employers for hint matching */
const KNOWN_EMPLOYERS = [
  'Raytheon', 'Booz Allen Hamilton', 'Northrop Grumman', 'Lockheed Martin',
  'SAIC', 'Leidos', 'General Dynamics', 'BAE Systems', 'L3Harris',
  'Deloitte', 'Accenture Federal', 'ManTech', 'CACI', 'Perspecta',
  'Boeing', 'General Electric', 'Honeywell', 'KBR', 'Jacobs',
  'Parsons', 'ICF', 'Maximus', 'Guidehouse', 'Thales',
  'Amazon', 'Google', 'Microsoft', 'Meta', 'Apple', 'IBM', 'Cisco',
];

/** Words that commonly appear in job titles */
const JOB_TITLE_WORDS = new Set([
  'manager', 'director', 'engineer', 'analyst', 'specialist', 'coordinator',
  'administrator', 'developer', 'architect', 'lead', 'chief', 'officer',
  'supervisor', 'technician', 'consultant', 'advisor', 'planner', 'associate',
  'assistant', 'senior', 'junior', 'principal', 'staff', 'intern',
  'executive', 'president', 'scientist', 'researcher', 'designer',
  'strategist', 'operator', 'instructor', 'trainer', 'recruiter',
]);

/** Check if text contains a common job title keyword */
function hasJobTitleWord(text: string): boolean {
  return text.split(/\s+/).some(w => JOB_TITLE_WORDS.has(w.toLowerCase()));
}

/**
 * Extract company name from job description text.
 * Uses label patterns, "About X" headers, hiring phrases, and known employer hints.
 */
function extractCompanyName(text: string): string | null {
  const lines = text.replace(/\r\n/g, '\n').split('\n').map(l => l.trim()).filter(Boolean);
  const firstLines = lines.slice(0, 15);

  // Pattern 1: Explicit labels — "Company: X", "Organization: X"
  for (const line of firstLines) {
    const match = line.match(/^(?:Company|Organization|Employer|Firm)\s*[:\-–]\s*(.+)/i);
    if (match) return match[1].trim().replace(/\s*[|,].*$/, '');
  }

  // Pattern 2: "About [Company]:" header
  for (const line of firstLines) {
    const match = line.match(/^About\s+(.+?)(?:\s*[:\-–.]|$)/i);
    if (match) {
      const name = match[1].trim();
      if (name.length <= 50 && name.split(/\s+/).length <= 6 && !/^(?:the|this|our|your)\s/i.test(name)) {
        return name;
      }
    }
  }

  // Pattern 3: "[Company] is hiring/seeking/looking"
  for (const line of firstLines.slice(0, 10)) {
    const match = line.match(/^([A-Z][\w\s&.,'-]+?)\s+(?:is\s+(?:hiring|seeking|looking|recruiting)|has\s+an?\s+(?:opening|opportunity|position))/i);
    if (match) {
      const name = match[1].trim();
      if (name.length <= 50 && name.split(/\s+/).length <= 6) {
        return name;
      }
    }
  }

  // Pattern 4: Known employers in first 15 lines
  const firstLinesText = firstLines.join(' ').toLowerCase();
  for (const employer of KNOWN_EMPLOYERS) {
    if (containsWord(firstLinesText, employer.toLowerCase())) {
      return employer;
    }
  }

  // Pattern 5: Short line with company suffix (Inc, LLC, Corp, etc.)
  for (const line of lines.slice(0, 5)) {
    const words = line.split(/\s+/);
    if (words.length >= 1 && words.length <= 6 && /^[A-Z]/.test(line) && !line.endsWith(':')) {
      if (hasJobTitleWord(line.toLowerCase())) continue;
      if (/,\s*[A-Z]{2}\b/.test(line)) continue; // Looks like "City, ST" location
      if (/\b(?:Inc|LLC|Corp|Ltd|Group|Solutions|Technologies|Services|Systems|Partners|Associates|Consulting)\b/i.test(line)) {
        return line.replace(/\s*[|,\-–].*$/, '').trim();
      }
    }
  }

  return null;
}

/**
 * Extract job title from job description text.
 * Uses label patterns, "seeking a [Title]" phrases, and first-line heuristics.
 */
function extractJobTitle(text: string): string | null {
  const lines = text.replace(/\r\n/g, '\n').split('\n').map(l => l.trim()).filter(Boolean);
  const firstLines = lines.slice(0, 15);

  // Pattern 1: Explicit labels — "Position: X", "Job Title: X", "Role: X"
  for (const line of firstLines) {
    const match = line.match(/^(?:(?:Job\s*)?Title|Position|Role)\s*[:\-–]\s*(.+)/i);
    if (match) {
      return match[1].trim().replace(/\s*[\(\-–].*$/, '').trim();
    }
  }

  // Pattern 2: "seeking/looking for/hiring a [Title]"
  for (const line of firstLines) {
    const match = line.match(/(?:seeking|looking\s+for|hiring)\s+(?:a|an)\s+(.+?)(?:\s+(?:to|who|with|that|for|in)\b|[.!,]|$)/i);
    if (match) {
      const candidate = match[1].trim();
      if (candidate.split(/\s+/).length <= 7) {
        return candidate;
      }
    }
  }

  // Pattern 3: First 1-3 lines — short line with a job title keyword
  for (const line of lines.slice(0, 3)) {
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 7 && /^[A-Z]/.test(line) && !line.endsWith(':')) {
      if (hasJobTitleWord(line.toLowerCase())) {
        return line;
      }
    }
  }

  return null;
}

// ============================================================================
// Utility Functions
// ============================================================================

/** Word-boundary match: "python" matches "Python" but not "pythonic" (for short words) */
function containsWord(text: string, word: string): boolean {
  const escaped = escapeRegex(word);
  return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
}

/** Escape special regex characters */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Return the key with the highest value, or null if empty */
function topKey(scores: Record<string, number>): string | null {
  const entries = Object.entries(scores);
  if (entries.length === 0) return null;
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}
