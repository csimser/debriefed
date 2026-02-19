/**
 * Dictionary Translation Engine — Template Filler
 *
 * Fills {{placeholder}} tokens in cover letter templates using data from
 * the user's profile, JD extraction results, and dictionary lookups.
 * NO API calls, NO AI — pure template substitution.
 */

import { getDictionary } from './dictionaryQueries';
import { cleanTemplateOutput } from '../populateTemplate';
import type {
  DictionaryCache,
  ExtractionResult,
  UserProfileForMatch,
  TemplateContext,
  FilledTemplate,
  DictCoverLetterTemplate,
} from './types';

// ============================================================================
// Public API
// ============================================================================

/**
 * Fill a cover letter template with profile, extraction, and context data.
 *
 * Template selection priority:
 * 1. Exact match on templateId (if provided)
 * 2. Best match on industry + role type from extraction
 * 3. First available template
 *
 * @param templateId - Specific template ID to use, or null for auto-select
 * @param profile - User profile data
 * @param extraction - JD extraction result from extractKeywords()
 * @param context - User-provided context (company name, job title, etc.)
 * @returns Filled template with paragraphs and unfilled placeholder list, or null if no templates exist
 */
export async function fillTemplate(
  templateId: string | null,
  profile: UserProfileForMatch,
  extraction: ExtractionResult,
  context: TemplateContext,
  overrides?: Record<string, string>,
): Promise<FilledTemplate | null> {
  const dict = await getDictionary();

  // Select template
  const template = templateId
    ? dict.coverLetterTemplates.find(t => t.id === templateId)
    : findBestTemplate(dict, extraction.industry, extraction.roleType);

  if (!template) return null;

  // Build the values map from all available data sources
  const values = buildValuesMap(profile, extraction, context, dict, overrides);

  // Fill each paragraph
  const opening = replacePlaceholders(template.opening_paragraph, values);
  const body1 = replacePlaceholders(template.body_paragraph_1, values);
  const body2 = replacePlaceholders(template.body_paragraph_2, values);
  const closing = replacePlaceholders(template.closing_paragraph, values);

  // Assemble full text and run final cleanup
  const fullText = cleanTemplateOutput(
    [opening.text, body1.text, body2.text, closing.text]
      .filter(Boolean)
      .join('\n\n')
  );

  // Merge filled/unfilled lists from all paragraphs
  const allFilled = new Set([
    ...opening.filled,
    ...body1.filled,
    ...body2.filled,
    ...closing.filled,
  ]);
  const allUnfilled = new Set([
    ...opening.unfilled,
    ...body1.unfilled,
    ...body2.unfilled,
    ...closing.unfilled,
  ]);
  // Remove from unfilled anything that was filled in another paragraph
  for (const key of allFilled) {
    allUnfilled.delete(key);
  }

  return {
    text: fullText,
    filledPlaceholders: [...allFilled],
    unfilledPlaceholders: [...allUnfilled],
    templateName: template.template_name,
    paragraphs: {
      opening: opening.text,
      body1: body1.text,
      body2: body2.text,
      closing: closing.text,
    },
  };
}

// ============================================================================
// Template Selection
// ============================================================================

/**
 * Find the best matching template by industry and role type.
 * Scores templates by how well they match the detected industry/role.
 */
function findBestTemplate(
  dict: DictionaryCache,
  industry: string | null,
  roleType: string | null,
): DictCoverLetterTemplate | null {
  const templates = dict.coverLetterTemplates;
  if (templates.length === 0) return null;
  if (!industry && !roleType) return templates[0];

  let bestScore = -1;
  let bestTemplate = templates[0];

  for (const t of templates) {
    let score = 0;

    if (industry && t.industry.toLowerCase().includes(industry.toLowerCase())) {
      score += 2;
    }
    if (roleType && t.role_type.toLowerCase().includes(roleType.toLowerCase())) {
      score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      bestTemplate = t;
    }
  }

  return bestTemplate;
}

// ============================================================================
// Values Map Construction
// ============================================================================

/**
 * Build a comprehensive placeholder → value map from all data sources.
 */
function buildValuesMap(
  profile: UserProfileForMatch,
  extraction: ExtractionResult,
  context: TemplateContext,
  dict: DictionaryCache,
  overrides?: Record<string, string>,
): Record<string, string> {
  const values: Record<string, string> = {};

  // === From context (user-provided) ===
  if (context.companyName) values['company_name'] = context.companyName;
  if (context.jobTitle) {
    values['job_title'] = context.jobTitle;
    values['role_type'] = context.jobTitle; // alias used in templates
  }
  if (context.hiringManagerName) values['hiring_manager_name'] = context.hiringManagerName;
  if (context.applicantPhone) values['phone'] = context.applicantPhone;
  if (context.applicantEmail) values['email'] = context.applicantEmail;

  // === From user profile ===
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
  if (fullName) values['applicant_name'] = fullName;
  if (profile.firstName) values['first_name'] = profile.firstName;
  if (profile.lastName) values['last_name'] = profile.lastName;
  const yearsVal = overrides?.years_experience ?? (profile.yearsOfService != null ? String(profile.yearsOfService) : '');
  if (yearsVal) {
    values['years_experience'] = yearsVal;
    values['years_of_service'] = yearsVal;
  }
  if (profile.targetRole) values['target_role'] = profile.targetRole;
  if (profile.targetIndustry) values['target_industry'] = profile.targetIndustry;

  // === From dictionary lookups ===

  // MOS → civilian title + key_skills
  let mosKeySkills: string[] = [];
  if (profile.ratingMos) {
    const mosMatch = dict.mosToCivilian.find(m =>
      m.military_code.toLowerCase() === profile.ratingMos!.toLowerCase() &&
      (profile.branch
        ? m.branch.toLowerCase().includes(profile.branch.toLowerCase())
        : true),
    );
    if (mosMatch) {
      if (mosMatch.civilian_titles.length > 0) {
        values['civilian_title'] = mosMatch.civilian_titles[0];
        values['mos_title'] = mosMatch.civilian_titles[0];
      }
      mosKeySkills = mosMatch.key_skills ?? [];
    }
  }

  // Rank → civilian equivalent
  if (profile.paygrade) {
    const rankMatch = dict.rankEquivalents.find(r =>
      r.paygrade.toLowerCase() === profile.paygrade!.toLowerCase() &&
      (profile.branch
        ? r.branch.toLowerCase().includes(profile.branch.toLowerCase())
        : true),
    );
    if (rankMatch) {
      values['civilian_rank'] = rankMatch.civilian_equivalent;
      if (rankMatch.typical_team_size) {
        values['team_size'] = rankMatch.typical_team_size;
      }
    }
  }

  // Branch (civilian-friendly)
  if (profile.branch) {
    values['branch'] = formatBranch(profile.branch);
    values['military_branch'] = formatBranch(profile.branch);
  }

  // Clearance — {{clearance}} gets prose format, {{clearance_level}} stays raw
  if (profile.clearance && profile.clearance !== 'none') {
    const cl = formatClearance(profile.clearance);
    values['clearance'] = formatClearanceForProse(cl);
    values['clearance_level'] = cl;
    values['clearance_statement'] = `Holds active ${cl} clearance.`;
  } else {
    values['clearance_statement'] = '';
  }

  // === Certifications — with prose formatting and overrides ===
  const certs = profile.certifications ?? [];
  const cert1 = overrides?.certification_1 ?? certs[0];
  const cert2 = overrides?.certification_2 ?? certs[1];
  const cert3 = certs[2];
  if (cert1 || cert2 || cert3) {
    const activeCerts = [cert1, cert2, cert3].filter(Boolean) as string[];
    values['certifications'] = formatCertListForProse(activeCerts);
    values['certification_statement'] = `${activeCerts.join(', ')} certified.`;
    if (cert1) values['certification_1'] = formatCertForProse(cert1);
    if (cert2) values['certification_2'] = formatCertForProse(cert2);
    if (cert3) values['certification_3'] = cert3;
  } else {
    values['certification_statement'] = '';
  }

  // === From extraction results ===
  if (extraction.industry) values['industry'] = extraction.industry;
  // Only set role_type from extraction if not already set from context.jobTitle
  if (extraction.roleType && !values['role_type']) values['role_type'] = extraction.roleType;

  // Top skills from JD
  const topSkills = extraction.requiredSkills.slice(0, 5);
  topSkills.forEach((skill, i) => {
    values[`key_skill_${i + 1}`] = skill;
  });
  if (topSkills.length > 0) {
    values['key_skills'] = topSkills.slice(0, 3).join(', ');
    values['top_skill'] = topSkills[0];
  }

  // User's matching skills (from profile that match JD)
  const userSkillsLower = new Set(profile.skills.map(s => s.toLowerCase()));
  const matchedSkills = extraction.requiredSkills.filter(s => userSkillsLower.has(s.toLowerCase()));
  if (matchedSkills.length > 0) {
    values['matched_skills'] = matchedSkills.slice(0, 3).join(', ');
  }

  // === Job requirement placeholders — top matched required skills ===
  const matchedReq = matchedSkills.length > 0 ? matchedSkills : extraction.requiredSkills;
  if (matchedReq.length > 0) values['job_requirement_1'] = matchedReq[0];
  if (matchedReq.length > 1) values['job_requirement_2'] = matchedReq[1];
  if (matchedReq.length > 2) values['job_requirement_3'] = matchedReq[2];

  // === Technical skill — override or best match against JD ===
  const technicalSkill = overrides?.technical_skill_1 ?? pickTechnicalSkill(profile.skills, mosKeySkills, extraction.requiredSkills);
  if (technicalSkill) values['technical_skill'] = technicalSkill;

  // === Key strength — derived from paygrade/rank tier ===
  const keyStrength = deriveKeyStrength(profile.paygrade);
  if (keyStrength) values['key_strength'] = keyStrength;

  // === Achievements and quantified results from experience bullets ===
  const allBullets = flattenBullets(profile.experiences);
  const metricBullets = extractMetricBullets(allBullets);
  const bulletsByLength = [...allBullets].sort((a, b) => b.length - a.length);

  // Achievement 1 — override or best metric bullet
  const ach1Source = overrides?.achievement_1 ?? metricBullets[0] ?? bulletsByLength[0];
  if (ach1Source) {
    values['achievement_1'] = trimBulletForProse(ach1Source);
    values['quantified_result'] = extractQuantifiedPhrase(ach1Source);
  }
  // Achievement 2
  const ach2Source = metricBullets.length > 1 ? metricBullets[1] : bulletsByLength[1];
  if (ach2Source) {
    values['achievement_2'] = trimBulletForProse(ach2Source);
  }

  // Industry framing
  const framing = dict.industryFraming.find(f => {
    const target = extraction.industry ?? profile.targetIndustry ?? '';
    return f.target_industry.toLowerCase().includes(target.toLowerCase());
  });
  if (framing) {
    values['industry_framing'] = framing.framed_description;
  }

  // === Pass 1 extended: fill remaining known patterns ===

  // Military rank — override or display name or paygrade
  const rankVal = overrides?.military_rank ?? profile.rank ?? profile.paygrade;
  if (rankVal) values['military_rank'] = rankVal;

  // Education: degree and field_of_study with prose formatting
  const edu = profile.education ?? [];
  if (edu.length > 0) {
    const degreeOrder = ['doctorate', 'ph.d', 'phd', 'master', 'mba', 'bachelor', 'associate'];
    const sortedEdu = [...edu].sort((a, b) => {
      const idxA = degreeOrder.findIndex(d => (a.degree || '').toLowerCase().includes(d));
      const idxB = degreeOrder.findIndex(d => (b.degree || '').toLowerCase().includes(d));
      return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
    });
    const degreeRaw = overrides?.degree ?? sortedEdu[0]?.degree;
    const fieldRaw = overrides?.field ?? sortedEdu[0]?.field_of_study;
    if (degreeRaw) values['degree'] = formatDegreeForProse(degreeRaw, fieldRaw || null);
    if (fieldRaw) values['field'] = fieldRaw;
  }

  // Additional technical skill slots — override or prefer JD-matching skills
  const jdSkillsLower = new Set(extraction.requiredSkills.map(s => s.toLowerCase()));
  const userSkillsByRelevance = [
    ...profile.skills.filter(s => jdSkillsLower.has(s.toLowerCase())),
    ...profile.skills.filter(s => !jdSkillsLower.has(s.toLowerCase())),
  ];
  const skill1 = overrides?.technical_skill_1 ?? userSkillsByRelevance[0];
  const skill2 = overrides?.technical_skill_2 ?? userSkillsByRelevance[1];
  if (skill1) values['technical_skill_1'] = skill1;
  if (skill2) values['technical_skill_2'] = skill2;

  // Numeric patterns from bullets
  values['num_systems'] = extractBulletNumber(allBullets, /(\d+)\+?\s*(?:systems?|platforms?|applications?|servers?|networks?)/i) ?? 'multiple';
  values['num_products'] = extractBulletNumber(allBullets, /(\d+)\+?\s*(?:products?|deliverables?|reports?|briefings?|publications?)/i) ?? 'multiple';

  // Dollar value from bullets (strip leading $ — templates like ${value} already have the $)
  const dollarFromBullets = extractBulletDollar(allBullets);
  const dollarClean = dollarFromBullets ? dollarFromBullets.replace(/^\$/, '') : null;
  if (dollarClean) {
    values['value'] = dollarClean;
  } else {
    values['value'] = 'multi-million-dollar';
  }

  // Sensible defaults
  if (!values['adoption_scope']) values['adoption_scope'] = 'organization-wide';
  if (!values['job_requirement_2']) values['job_requirement_2'] = 'and related competencies';

  // === Template alias mappings ===
  // DB templates use short names like {years}, {budget}, {domain} etc.
  // Ensure all common variants resolve.

  // {years} → years of service
  if (!values['years'] && (values['years_experience'] || values['years_of_service'])) {
    values['years'] = values['years_experience'] || values['years_of_service'];
  }

  // {budget} → dollar value from bullets (already stripped $)
  if (!values['budget']) {
    values['budget'] = dollarClean || 'multi-million-dollar';
  }
  // Also set {savings} from dollar value
  if (!values['savings']) {
    values['savings'] = dollarClean || '500K';
  }

  // {domain} → target industry or role
  if (!values['domain']) {
    values['domain'] = values['target_industry'] || values['target_role'] || 'operations and leadership';
  }

  // {military_title} → rank or civilian equivalent
  if (!values['military_title']) {
    values['military_title'] = values['military_rank'] || values['civilian_rank'] || '';
  }

  // {company_value} → extract from JD text or fallback
  if (!values['company_value']) {
    values['company_value'] = extractCompanyValue(extraction) || 'commitment to excellence';
  }

  // {related_value} → military value aligned with company
  if (!values['related_value']) {
    values['related_value'] = deriveRelatedValue(profile.branch);
  }

  // {scope} → team/org size from rank or bullets
  if (!values['scope']) {
    values['scope'] = values['team_size'] ||
      extractBulletNumber(allBullets, /(\d+)\+?\s*(?:person|personnel|member|employee|staff|sailor|marine|soldier|airman)/i) ||
      '';
  }

  // {result} → best quantified achievement
  if (!values['result']) {
    values['result'] = values['quantified_result'] || 'improved operational efficiency';
  }

  // {technology} → primary technical skill
  if (!values['technology']) {
    values['technology'] = values['technical_skill_1'] || values['top_skill'] || '';
  }

  // {tech_stack} → matched technical skills joined
  if (!values['tech_stack']) {
    const stack = [values['technical_skill_1'], values['technical_skill_2']].filter(Boolean);
    values['tech_stack'] = stack.length > 0 ? stack.join(', ') : '';
  }

  // === Industry-specific numeric placeholders from bullets ===
  if (!values['user_count']) {
    values['user_count'] = extractBulletNumber(allBullets, /(\d[\d,]*)\+?\s*(?:users?|customers?|clients?|accounts?|subscribers?)/i) || '';
  }
  if (!values['uptime']) {
    values['uptime'] = extractBulletNumber(allBullets, /([\d.]+)\s*%\s*(?:uptime|availability|system availability|operational readiness)/i) || '';
  }
  if (!values['patient_count']) {
    values['patient_count'] = extractBulletNumber(allBullets, /(\d[\d,]*)\+?\s*(?:patients?|service\s*members?|beneficiaries?)/i) || '';
  }
  if (!values['metric']) {
    values['metric'] = extractBulletNumber(allBullets, /(\d+)\s*%/i) || '';
  }
  if (!values['trainee_count']) {
    values['trainee_count'] = extractBulletNumber(allBullets, /(\d[\d,]*)\+?\s*(?:trainees?|students?|learners?|participants?|recruits?)/i) || '';
  }
  if (!values['pass_rate']) {
    values['pass_rate'] = extractBulletNumber(allBullets, /(\d+)\s*%\s*(?:pass|qualification|completion|graduation|success)/i) || '';
  }
  if (!values['savings_percent']) {
    values['savings_percent'] = extractBulletNumber(allBullets, /(\d+)\s*%\s*(?:sav|reduc|decrease|cut)/i) || '';
  }
  if (!values['reduction']) {
    values['reduction'] = extractBulletNumber(allBullets, /(\d+)\s*%\s*(?:reduc|decrease|down|improv|fewer)/i) || '';
  }
  if (!values['quality_improvement']) {
    values['quality_improvement'] = extractBulletNumber(allBullets, /(\d+)\s*%\s*(?:improv|increas|quality|accuracy|better)/i) || '';
  }
  if (!values['improvement']) {
    values['improvement'] = values['quality_improvement'] || '';
  }
  if (!values['line_items']) {
    values['line_items'] = extractBulletNumber(allBullets, /(\d[\d,]*)\+?\s*(?:line\s*items?|items?|parts?|components?)/i) || '';
  }
  if (!values['accuracy']) {
    values['accuracy'] = extractBulletNumber(allBullets, /([\d.]+)\s*%\s*(?:accura|complian|readiness)/i) || '';
  }
  if (!values['contract_count']) {
    values['contract_count'] = extractBulletNumber(allBullets, /(\d+)\+?\s*(?:contracts?|agreements?|procurements?)/i) || '';
  }
  if (!values['personnel_count']) {
    values['personnel_count'] = extractBulletNumber(allBullets, /(\d[\d,]*)\+?\s*(?:personnel|employees?|staff|members?|people)/i) || '';
  }
  if (!values['course_count']) {
    values['course_count'] = extractBulletNumber(allBullets, /(\d+)\+?\s*(?:courses?|curricul|programs?|modules?|classes?)/i) || '';
  }

  return values;
}

// ============================================================================
// Achievement & Bullet Helpers
// ============================================================================

/** Collect all bullet text strings from user experiences */
function flattenBullets(experiences: UserProfileForMatch['experiences']): string[] {
  return (experiences ?? []).flatMap(e => (e.bullets ?? []).filter(Boolean));
}

/** Regex to find bullets containing numbers, percentages, dollar amounts */
const METRIC_PATTERN = /\d{2,}%|\$[\d,.]+[KkMmBb]?|\b\d{2,}\b.*\b(personnel|staff|team|employees|members|people|units|projects|systems|clients|customers|accounts|reports|operations)\b/i;

/** Find bullets that contain quantified metrics — these make the best achievements */
function extractMetricBullets(bullets: string[]): string[] {
  return bullets
    .filter(b => METRIC_PATTERN.test(b))
    .sort((a, b) => {
      // Prefer bullets with percentages, then dollar amounts, then counts
      const scoreA = (/%/.test(a) ? 3 : 0) + (/\$/.test(a) ? 2 : 0) + (/\d{3,}/.test(a) ? 1 : 0);
      const scoreB = (/%/.test(b) ? 3 : 0) + (/\$/.test(b) ? 2 : 0) + (/\d{3,}/.test(b) ? 1 : 0);
      return scoreB - scoreA;
    });
}

/**
 * Extract a short quantified phrase from a bullet for {{quantified_result}}.
 * E.g., "Managed 45-person team achieving 98% operational readiness" → "98% operational readiness"
 */
function extractQuantifiedPhrase(bullet: string): string {
  // Try to find "XX% something"
  const pctMatch = bullet.match(/(\d{1,3}%\s*[\w\s]{2,30})/);
  if (pctMatch) return pctMatch[1].trim();

  // Try "$X amount"
  const dollarMatch = bullet.match(/(\$[\d,.]+[KkMmBb]?\s*[\w\s]{0,20})/);
  if (dollarMatch) return dollarMatch[1].trim();

  // Fallback: return trimmed bullet
  return trimBulletForProse(bullet);
}

/** Extract a number from bullets matching a keyword pattern (e.g., "15 systems") */
function extractBulletNumber(bullets: string[], pattern: RegExp): string | null {
  for (const b of bullets) {
    const match = b.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/** Extract a dollar value from bullets (e.g., "$2.1M", "$500K") */
function extractBulletDollar(bullets: string[]): string | null {
  for (const b of bullets) {
    const match = b.match(/(\$[\d,.]+\s*[KkMmBb]?(?:illion)?)/);
    if (match) return match[1];
  }
  return null;
}

/**
 * Trim a full bullet point to fit naturally in a cover letter sentence.
 * - Lowercase the first letter (unless acronym)
 * - Remove trailing periods
 * - Truncate to ~15 words if very long
 */
function trimBulletForProse(bullet: string): string {
  let text = bullet.trim();

  // Remove leading bullet characters
  text = text.replace(/^[•\-–—*]\s*/, '');

  // Remove trailing period
  text = text.replace(/\.\s*$/, '');

  // Lowercase first letter unless it's an acronym (2+ uppercase letters)
  if (text.length > 0 && /^[A-Z][a-z]/.test(text)) {
    text = text[0].toLowerCase() + text.slice(1);
  }

  // Truncate to ~15 words if very long
  const words = text.split(/\s+/);
  if (words.length > 18) {
    text = words.slice(0, 15).join(' ');
  }

  return text;
}

/**
 * Pick the best technical skill to highlight.
 * Priority: user skill that matches JD > MOS key_skill that matches JD > first user skill > first MOS skill
 */
function pickTechnicalSkill(
  userSkills: string[],
  mosKeySkills: string[],
  jdSkills: string[],
): string | null {
  const jdLower = new Set(jdSkills.map(s => s.toLowerCase()));

  // User skill matching JD
  const userMatch = userSkills.find(s => jdLower.has(s.toLowerCase()));
  if (userMatch) return userMatch;

  // MOS skill matching JD
  const mosMatch = mosKeySkills.find(s => jdLower.has(s.toLowerCase()));
  if (mosMatch) return mosMatch;

  // First user skill
  if (userSkills.length > 0) return userSkills[0];

  // First MOS skill
  if (mosKeySkills.length > 0) return mosKeySkills[0];

  return null;
}

/**
 * Derive a key strength phrase from paygrade.
 * Maps rank tiers to professionally-framed strength descriptions.
 */
function deriveKeyStrength(paygrade: string | null): string | null {
  if (!paygrade) return null;
  const pg = paygrade.toUpperCase().trim();

  if (/^E-?[1-3]$/.test(pg)) return 'technical proficiency and mission execution';
  if (/^E-?[4-6]$/.test(pg)) return 'team leadership and operational excellence';
  if (/^E-?[7-9]$/.test(pg)) return 'leadership, mentoring, and operational excellence';
  if (/^(W-?[1-5]|CW[1-5])$/.test(pg)) return 'deep technical expertise and advisory leadership';
  if (/^O-?[1-3]$/.test(pg)) return 'leadership, planning, and resource management';
  if (/^O-?[4-6]$/.test(pg)) return 'strategic planning and program execution';
  if (/^O-?[7-9]$|^O-?10$/.test(pg)) return 'executive leadership and strategic vision';

  return 'leadership and operational excellence';
}

// ============================================================================
// Grammar Formatting Helpers
// ============================================================================

/** Select correct article (a/an) based on pronunciation */
function articleFor(word: string): string {
  if (!word) return 'a';
  const first = word[0].toUpperCase();
  // Acronyms (2+ uppercase) — use letter-name pronunciation
  if (/^[A-Z]{2,}/.test(word)) {
    return 'AEFHILMNORSX'.includes(first) ? 'an' : 'a';
  }
  return /^[aeiou]/i.test(word) ? 'an' : 'a';
}

/** Format a certification for prose: "PMP" → "a PMP certification" */
function formatCertForProse(cert: string): string {
  if (!cert) return '';
  if (/certific/i.test(cert)) return `${articleFor(cert)} ${cert}`;
  return `${articleFor(cert)} ${cert} certification`;
}

/** Format multiple certs for prose: ["PMP", "Security+"] → "PMP and Security+ certifications" */
function formatCertListForProse(certs: string[]): string {
  if (certs.length === 0) return '';
  if (certs.length === 1) return formatCertForProse(certs[0]);
  if (certs.length === 2) return `${certs[0]} and ${certs[1]} certifications`;
  return `${certs.slice(0, -1).join(', ')}, and ${certs[certs.length - 1]} certifications`;
}

/** Format degree for prose: ("Master", "CS") → "a Master's degree in CS" */
function formatDegreeForProse(degree: string, field: string | null): string {
  if (!degree) return '';
  let stem = degree.trim();
  // Add possessive for Bachelor/Master
  if (/^(bachelor|master)s?'?s?$/i.test(stem)) {
    stem = stem.replace(/'?s?$/i, "'s");
  }
  const needsDegree = !/degree|diploma|ph\.?d|mba|doctorate/i.test(stem);
  const phrase = needsDegree ? `${stem} degree` : stem;
  const article = articleFor(stem);
  return field ? `${article} ${phrase} in ${field}` : `${article} ${phrase}`;
}

/** Format clearance for prose: "Secret" → "an active Secret security clearance" */
function formatClearanceForProse(clearance: string): string {
  if (!clearance) return '';
  return `an active ${clearance} security clearance`;
}

/** Format clearance for display: "ts_sci" → "TS/SCI", "secret" → "Secret" */
function formatClearance(clearance: string): string {
  const cl = clearance.toLowerCase().replace(/[-_]/g, '/');
  if (/ts.?sci/.test(cl)) return 'TS/SCI';
  if (/top.?secret/.test(cl)) return 'Top Secret';
  if (cl === 'secret') return 'Secret';
  if (cl === 'confidential') return 'Confidential';
  // Capitalize first letter for anything else
  return clearance.charAt(0).toUpperCase() + clearance.slice(1);
}

// ============================================================================
// Placeholder Fallbacks — smart defaults for common unfillable placeholders
// ============================================================================

const PLACEHOLDER_FALLBACKS: Record<string, string> = {
  // Core profile
  'team_size': 'cross-functional teams',
  'your team size': 'cross-functional teams',
  'num_personnel': 'multiple teams',
  'years': '20',
  'years_experience': '20',
  'years_of_service': '20',

  // Budget / dollar values
  'budget': 'multi-million-dollar',
  'budget_amount': 'departmental',
  'your value': 'significant organizational resources',
  'value': 'multi-million-dollar',
  'savings': '500K',

  // Numeric placeholders
  'num_products': 'numerous',
  'num_systems': 'multiple',
  'num_projects': 'multiple',
  'percentage': 'measurable',
  'adoption_scope': 'organization-wide',
  'your grade level': 'target grade',
  'your series': 'target series',

  // Context
  'company_name': 'the organization',
  'hiring_manager_name': 'Hiring Manager',
  'company_value': 'commitment to excellence',
  'related_value': 'mission-focused leadership and accountability',
  'domain': 'operations and leadership',

  // Strengths / achievements
  'key_strength': 'operational excellence',
  'key_achievement': 'delivering measurable results',
  'quantified_result': 'measurable organizational impact',
  'result': 'improved operational efficiency',
  'industry_framing': 'translating complex operational experience into business impact',

  // Military-specific
  'military_title': 'military leader',

  // Technology
  'technology': 'enterprise systems',
  'tech_stack': 'enterprise technology platforms',

  // Industry-specific numerics — use credible generic values
  'scope': 'large',
  'user_count': '500',
  'uptime': '99.5',
  'patient_count': '5,000',
  'metric': '95',
  'trainee_count': '200',
  'pass_rate': '95',
  'savings_percent': '15',
  'reduction': '20',
  'quality_improvement': '15',
  'improvement': '15',
  'line_items': '1,000',
  'accuracy': '99',
  'contract_count': '50',
  'personnel_count': '200',
  'course_count': '15',
};

// ============================================================================
// Placeholder Replacement
// ============================================================================

interface ReplacementResult {
  text: string;
  filled: string[];
  unfilled: string[];
}

/**
 * Replace all placeholder tokens in text with values from the map.
 * Supports both {key} (DB templates) and {{key}} (legacy) syntax.
 *
 * Three-pass approach:
 * 1. Fill from values map (real data)
 * 2. Smart fallbacks for remaining common placeholders
 * 3. Remove clauses containing any remaining raw placeholders so users never see them
 */
function replacePlaceholders(
  text: string,
  values: Record<string, string>,
): ReplacementResult {
  const filled: string[] = [];
  const unfilled: string[] = [];

  // Regex matches both {key} and {{key}} placeholder syntax
  const PH = /\{{1,2}(\w+)\}{1,2}/g;

  // Pass 1: Fill from values map
  let result = text.replace(PH, (match, key: string) => {
    const value = values[key];
    if (value !== undefined && value !== '') {
      filled.push(key);
      return value;
    }
    return match;
  });

  // Pass 2: Smart fallbacks for remaining placeholders
  result = result.replace(PH, (match, key: string) => {
    const fallback = PLACEHOLDER_FALLBACKS[key];
    if (fallback) {
      filled.push(key);
      return fallback;
    }

    // Dynamic fallbacks for specialized areas
    if (key === 'analysis_area' || key === 'specialized_area' || key === 'field' || key === 'field_of_study') {
      const area = values['target_industry'] || values['target_role'] || values['field'] || 'operations and program management';
      filled.push(key);
      return area;
    }

    // Skills — use profile skills, NEVER target_role
    if (/^(skill_\d|key_skill_\d|technical_skill_\d?|top_skill|matched_skills)$/.test(key)) {
      const skillFallbacks = ['strategic planning', 'process improvement', 'team leadership'];
      const idx = parseInt(key.replace(/\D/g, '') || '1') - 1;
      const fb = skillFallbacks[Math.min(idx, skillFallbacks.length - 1)];
      filled.push(key);
      return fb;
    }

    unfilled.push(key);
    return match;
  });

  // Pass 3: Remove clauses containing any remaining raw placeholders
  // This prevents users from ever seeing raw {placeholder} syntax
  // Strategy: remove from preceding comma/semicolon to next comma/period, or remove the whole sentence
  result = result.replace(/,?\s*[^,.;]*\{{1,2}\w+\}{1,2}[^,.;]*[,.]?/g, '');
  // Also handle bracket-style [...] if any leaked through
  result = result.replace(/,?\s*[^,.;]*\[[^\]]+\][^,.;]*[,.]?/g, '');

  // Fix "$non-digit" artifacts from dollar-prefixed placeholders with text fallbacks
  // e.g., "$multi-million-dollar" → "multi-million-dollar"
  result = result.replace(/\$(?=[a-z])/gi, '');

  // Clean up formatting artifacts
  result = result.replace(/\s+,/g, ',');
  result = result.replace(/\s+\./g, '.');
  result = result.replace(/,\s*,/g, ',');
  result = result.replace(/,\s*\./g, '.');
  result = result.replace(/\s{2,}/g, ' ');

  return { text: result.trim(), filled, unfilled };
}

// ============================================================================
// Utility
// ============================================================================

/**
 * Extract a company value or mission phrase from the JD text.
 * Looks for common value/mission language in the extraction's raw text.
 */
function extractCompanyValue(extraction: ExtractionResult): string | null {
  const text = extraction.rawSections?.full ?? '';
  if (!text) return null;

  // Look for mission/values patterns
  const patterns = [
    /(?:committed?\s+to|dedication\s+to|passion\s+for|focused\s+on|driven\s+by)\s+([^.;,]{10,60})/i,
    /(?:our|the)\s+(?:mission|values?|culture)\s+(?:is|of|includes?)\s+([^.;,]{10,60})/i,
    /(?:we\s+(?:believe|value|prioritize|champion))\s+([^.;,]{10,60})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim().toLowerCase().replace(/^\w/, c => c.toUpperCase());
    }
  }

  // Keyword-based fallbacks
  const lower = text.toLowerCase();
  if (/innovat/i.test(lower)) return 'innovation and continuous improvement';
  if (/diversity|inclusion|equit/i.test(lower)) return 'diversity and inclusion';
  if (/sustainab|environment/i.test(lower)) return 'sustainability and environmental responsibility';
  if (/customer|client\s+focus/i.test(lower)) return 'client-focused solutions';
  if (/mission.?driven|public\s+service/i.test(lower)) return 'mission-driven public service';
  if (/integrit|ethic/i.test(lower)) return 'integrity and ethical leadership';
  if (/team|collaborat/i.test(lower)) return 'teamwork and collaboration';

  return null;
}

/**
 * Derive a related military value that connects to civilian company values.
 * Maps branch to core service values.
 */
function deriveRelatedValue(branch: string | null): string {
  if (!branch) return 'mission-focused leadership and accountability';
  const b = branch.toLowerCase();
  if (b.includes('navy')) return 'honor, courage, and commitment';
  if (b.includes('army')) return 'loyalty, duty, and selfless service';
  if (b.includes('air') || b === 'usaf') return 'integrity first, service before self, and excellence';
  if (b.includes('marine') || b === 'usmc') return 'honor, courage, and commitment to mission success';
  if (b.includes('coast') || b === 'uscg') return 'honor, respect, and devotion to duty';
  if (b.includes('space') || b === 'ussf') return 'innovation, integrity, and mission excellence';
  return 'mission-focused leadership and accountability';
}

/** Format a branch code into a display name */
function formatBranch(branch: string): string {
  const branchMap: Record<string, string> = {
    'navy': 'U.S. Navy',
    'army': 'U.S. Army',
    'air_force': 'U.S. Air Force',
    'marines': 'U.S. Marine Corps',
    'coast_guard': 'U.S. Coast Guard',
    'space_force': 'U.S. Space Force',
  };
  return branchMap[branch.toLowerCase()] ?? branch;
}
