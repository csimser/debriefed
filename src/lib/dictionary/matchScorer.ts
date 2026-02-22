/**
 * Dictionary Translation Engine — Match Scorer
 *
 * Compares job description extraction results against a user's profile
 * to produce a weighted match score with gap analysis and funding recommendations.
 * NO API calls, NO AI — pure data comparison against cached dictionaries.
 */

import { getDictionary } from './dictionaryQueries';
import { isLikelyTool } from './keywordExtractor';
import type {
  DictionaryCache,
  ExtractionResult,
  MatchResult,
  MatchCategory,
  GapItem,
  FundingSource,
  UserProfileForMatch,
  UserEducation,
  RawProfile,
  RawCertification,
  RawEducation,
  RawExperience,
} from './types';

// ============================================================================
// Public API
// ============================================================================

/**
 * Calculate a weighted match score between a JD extraction and user profile.
 *
 * Weights: required skills 3x, preferred 1x, tools 2x, certs 2x,
 * education 2x, experience 2x, clearance 3x.
 * Only categories with actual requirements count toward the total.
 *
 * @param extraction - Output from extractKeywords()
 * @param profile - User profile assembled via buildUserProfile()
 * @returns Detailed match result with score, gaps, and funding
 */
export async function calculateMatch(
  extraction: ExtractionResult,
  profile: UserProfileForMatch,
): Promise<MatchResult> {
  const dict = await getDictionary();

  // Augment user skills with MOS-derived skills
  const effectiveSkills = getEffectiveSkills(profile, dict);

  // Extract tools from user's bullet text and skills list
  const userTools = getUserTools(profile);

  // Score each category
  const requiredSkills = scoreCategory(extraction.requiredSkills ?? [], effectiveSkills, 'requiredSkills');
  const preferredSkills = scoreCategory(extraction.preferredSkills ?? [], effectiveSkills, 'preferredSkills');
  const tools = scoreCategory(extraction.tools ?? [], [...effectiveSkills, ...userTools], 'tools');
  const certifications = scoreCategory(
    [...(extraction.requiredCerts ?? []), ...(extraction.preferredCerts ?? [])],
    profile.certifications ?? [],
    'certifications',
  );

  const education = compareEducation(extraction.educationRequired, profile.education ?? []);
  const experience = compareExperience(extraction.yearsRequired, profile.yearsOfService);
  const clearance = compareClearance(extraction.clearanceRequired, profile.clearance);

  // Weighted scoring — only include categories that have requirements
  const weights: { score: number; weight: number }[] = [];

  if ((extraction.requiredSkills ?? []).length > 0) {
    weights.push({ score: requiredSkills.percentage, weight: 3 });
  }
  if ((extraction.preferredSkills ?? []).length > 0) {
    weights.push({ score: preferredSkills.percentage, weight: 1 });
  }
  // Tools removed from scoring — always shows 0%, no value to users
  if ((extraction.requiredCerts ?? []).length > 0 || (extraction.preferredCerts ?? []).length > 0) {
    weights.push({ score: certifications.percentage, weight: 2 });
  }
  if (extraction.educationRequired) {
    weights.push({ score: education.met ? 100 : 0, weight: 2 });
  }
  if (extraction.yearsRequired !== null) {
    const expScore = experience.met ? 100 : getPartialExperienceScore(extraction.yearsRequired, profile.yearsOfService);
    weights.push({ score: expScore, weight: 2 });
  }
  if (extraction.clearanceRequired) {
    weights.push({ score: clearance.met ? 100 : 0, weight: 3 });
  }

  // Calculate overall score
  let overallScore = 0;
  if (weights.length > 0) {
    const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
    const weightedSum = weights.reduce((sum, w) => sum + w.score * w.weight, 0);
    overallScore = Math.round(weightedSum / totalWeight);
  }

  // Identify gaps with recommendations
  const gaps = await buildGaps(extraction, profile, effectiveSkills, dict);

  // Identify where user exceeds requirements
  const exceeds = buildExceeds(extraction, profile, effectiveSkills, education, experience, clearance);

  // MOS → civilian title matches
  const civilianTitleMatches = getCivilianTitles(profile, dict);

  // Industry framing suggestions
  const industryFraming = getIndustryFraming(profile, extraction, dict);

  return {
    overallScore,
    categories: {
      requiredSkills,
      preferredSkills,
      tools,
      certifications,
      education,
      experience,
      clearance,
    },
    exceeds,
    gaps,
    civilianTitleMatches,
    industryFraming,
  };
}

/**
 * Build a UserProfileForMatch from raw Supabase query results.
 * Convenience helper so callers don't need to manually map fields.
 */
export function buildUserProfile(
  profile: RawProfile,
  skills: string[],
  certifications: RawCertification[],
  education: RawEducation[],
  experiences: RawExperience[],
): UserProfileForMatch {
  const result: UserProfileForMatch = {
    firstName: profile.first_name ?? null,
    lastName: profile.last_name ?? null,
    branch: profile.branch ?? '',
    rank: profile.rank ?? '',
    paygrade: profile.paygrade ?? null,
    ratingMos: profile.rating_mos ?? '',
    yearsOfService: profile.years_of_service != null ? Number(profile.years_of_service) : null,
    clearance: profile.clearance ?? '',
    targetRole: profile.target_role ?? '',
    targetIndustry: profile.target_industry ?? '',
    skills: skills ?? [],
    certifications: (certifications ?? []).map(c => c.name),
    education: (education ?? []).map(e => ({
      degree: e.degree ?? null,
      field_of_study: e.field_of_study ?? null,
      school: e.school ?? null,
    })),
    experiences: (experiences ?? []).map(e => ({
      title: e.title ?? null,
      organization: e.organization ?? null,
      years: null,
      bullets: (e.bullets ?? e.experience_bullets ?? [])
        .map(b => b.translated_text ?? b.original_text ?? '')
        .filter(Boolean),
    })),
  };
  return result;
}

// ============================================================================
// Category Scoring
// ============================================================================

/**
 * Score how many items from a required list the user has.
 * Case-insensitive comparison.
 */
/** Normalize a string for comparison: lowercase, collapse hyphens/spaces */
function normalize(s: string): string {
  return (s ?? '').toLowerCase().replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
}

function scoreCategory(required: string[], userItems: string[], label = ''): MatchCategory {
  const req = required ?? [];
  const items = userItems ?? [];
  if (req.length === 0) {
    return { score: 0, maxScore: 0, percentage: 100, matched: [], missing: [] };
  }

  const userNormalized = new Set(items.map(s => normalize(s)));
  const matched: string[] = [];
  const missing: string[] = [];

  for (const item of req) {
    const itemNorm = normalize(item);
    if (userNormalized.has(itemNorm)) {
      matched.push(item);
    } else {
      // Check for partial matches (e.g., "Project Management" matches "project management professional")
      const found = items.some(u => {
        const uNorm = normalize(u);
        return uNorm.includes(itemNorm) || itemNorm.includes(uNorm);
      });
      if (found) {
        matched.push(item);
      } else {
        missing.push(item);
      }
    }
  }

  const percentage = Math.round((matched.length / req.length) * 100);
  return { score: matched.length, maxScore: req.length, percentage, matched, missing };
}

// ============================================================================
// Education Comparison
// ============================================================================

const EDUCATION_HIERARCHY: Record<string, number> = {
  'ged': 1,
  'high school': 2,
  'diploma': 2,
  "associate's": 3,
  'associates': 3,
  'associate': 3,
  'as': 3,
  'aa': 3,
  'aas': 3,
  "bachelor's": 4,
  'bachelors': 4,
  'bachelor': 4,
  'bs': 4,
  'ba': 4,
  'bba': 4,
  'bsc': 4,
  "master's": 5,
  'masters': 5,
  'master': 5,
  'ms': 5,
  'ma': 5,
  'mba': 5,
  'msc': 5,
  'mpa': 5,
  'med': 5,
  'msw': 5,
  'doctorate': 6,
  'doctoral': 6,
  'phd': 6,
  'ph.d': 6,
  'edd': 6,
  'jd': 6,
  'md': 6,
};

function compareEducation(
  required: string | null,
  candidateEducation: UserEducation[],
): { met: boolean; required: string | null; candidate: string | null } {
  if (!required) return { met: true, required: null, candidate: null };

  const requiredLevel = EDUCATION_HIERARCHY[(required ?? '').toLowerCase()] ?? 0;

  // Find the highest education level the user has
  let highestLevel = 0;
  let highestDegree: string | null = null;

  for (const edu of (candidateEducation ?? [])) {
    if (!edu.degree) continue;
    const degreeLower = (edu.degree ?? '').toLowerCase().trim();

    // Check exact match first (e.g., "MBA" → 5)
    if (EDUCATION_HIERARCHY[degreeLower] != null && EDUCATION_HIERARCHY[degreeLower] > highestLevel) {
      highestLevel = EDUCATION_HIERARCHY[degreeLower];
      highestDegree = edu.degree;
    }

    // Then check substring match (e.g., "Master of Business Administration" includes "master")
    for (const [name, level] of Object.entries(EDUCATION_HIERARCHY)) {
      if (degreeLower.includes(name) && level > highestLevel) {
        highestLevel = level;
        highestDegree = edu.degree;
      }
    }
  }

  return {
    met: highestLevel >= requiredLevel,
    required,
    candidate: highestDegree,
  };
}

// ============================================================================
// Experience Comparison
// ============================================================================

function compareExperience(
  requiredYears: number | null,
  candidateYears: number | null,
): { met: boolean; required: number | null; candidate: number | null } {
  if (requiredYears === null) return { met: true, required: null, candidate: candidateYears };
  if (candidateYears === null) return { met: false, required: requiredYears, candidate: null };

  return {
    met: candidateYears >= requiredYears,
    required: requiredYears,
    candidate: candidateYears,
  };
}

/** Partial credit for experience: 80% of required = 80% score */
function getPartialExperienceScore(required: number, candidate: number | null): number {
  if (!candidate || required === 0) return 0;
  return Math.min(100, Math.round((candidate / required) * 100));
}

// ============================================================================
// Clearance Comparison
// ============================================================================

const CLEARANCE_HIERARCHY: Record<string, number> = {
  'public trust': 1,
  'confidential': 2,
  'secret': 3,
  'top secret': 4,
  'ts/sci': 5,
};

function compareClearance(
  required: string | null,
  candidate: string | null,
): { met: boolean; required: string | null; candidate: string | null } {
  if (!required) return { met: true, required: null, candidate };
  if (!candidate) return { met: false, required, candidate: null };

  const requiredLevel = CLEARANCE_HIERARCHY[(required ?? '').toLowerCase()] ?? 0;
  const candidateLevel = CLEARANCE_HIERARCHY[(candidate ?? '').toLowerCase()] ?? 0;

  return {
    met: candidateLevel >= requiredLevel,
    required,
    candidate,
  };
}

// ============================================================================
// Effective Skills (augmented with MOS data, certs, and experience)
// ============================================================================

/** Map certification names to implied skills (case-insensitive keys) */
const CERT_IMPLIED_SKILLS: Record<string, string[]> = {
  'pmp': ['Project Management', 'Program Management', 'Budget Management', 'Risk Management', 'Stakeholder Management'],
  'capm': ['Project Management'],
  'csm': ['Agile', 'Scrum'],
  'safe': ['Agile', 'SAFe', 'Lean'],
  'cissp': ['Cybersecurity', 'Information Security', 'Risk Management'],
  'cism': ['Cybersecurity', 'Information Security', 'Risk Management'],
  'ceh': ['Cybersecurity', 'Penetration Testing'],
  'comptia security+': ['Cybersecurity', 'Information Security', 'Network Security'],
  'comptia sec+': ['Cybersecurity', 'Information Security', 'Network Security'],
  'comptia cysa+': ['Cybersecurity', 'Security Analytics', 'Threat Detection'],
  'comptia pentest+': ['Penetration Testing', 'Cybersecurity', 'Vulnerability Assessment'],
  'comptia a+': ['IT Support', 'Hardware', 'Troubleshooting'],
  'comptia network+': ['Networking', 'Network Security', 'TCP/IP'],
  'comptia net+': ['Networking', 'Network Security', 'TCP/IP'],
  'ccna': ['Networking', 'Cisco', 'Network Security'],
  'ccnp': ['Networking', 'Cisco', 'Network Architecture'],
  'itil': ['IT Service Management', 'ITSM', 'Process Improvement'],
  'six sigma': ['Process Improvement', 'Lean', 'Quality Management'],
  'lean six sigma': ['Process Improvement', 'Lean', 'Quality Management'],
  'aws': ['Cloud Computing', 'AWS', 'Cloud Architecture'],
  'azure': ['Cloud Computing', 'Azure', 'Cloud Architecture'],
  'togaf': ['Enterprise Architecture', 'IT Strategy'],
  'shrm-cp': ['Human Resources', 'HR Management'],
  'shrm-scp': ['Human Resources', 'HR Management'],
  'phr': ['Human Resources', 'HR Management'],
  'sphr': ['Human Resources', 'HR Management'],
};

/**
 * Augment user's explicit skill list with skills from:
 * 1. MOS → civilian skills mapping
 * 2. Certification → implied skills mapping
 * 3. Experience bullet text (soft skills from dictionary)
 * 4. Experience bullet text (direct keyword extraction)
 */
function getEffectiveSkills(profile: UserProfileForMatch, dict: DictionaryCache): string[] {
  const skills = [...(profile.skills ?? [])].filter(Boolean);
  const addSkill = (skill: string) => {
    if (!skill) return;
    if (!skills.some(s => (s ?? '').toLowerCase() === skill.toLowerCase())) {
      skills.push(skill);
    }
  };

  // 0. Military service → DoD auto-match
  // Any user with a branch and years of service automatically gets DoD-related skills
  if (profile.branch && (profile.yearsOfService ?? 0) > 0) {
    for (const skill of ['DoD', 'Department of Defense', 'Military', 'Military Experience']) {
      addSkill(skill);
    }
  }

  // 1. MOS → civilian skills
  if (profile.ratingMos && profile.branch) {
    const mosMatch = (dict.mosToCivilian ?? []).find(m =>
      (m.military_code ?? '').toLowerCase() === (profile.ratingMos ?? '').toLowerCase() &&
      (m.branch ?? '').toLowerCase().includes((profile.branch ?? '').toLowerCase()),
    );
    if (mosMatch) {
      for (const skill of (mosMatch.key_skills ?? [])) {
        addSkill(skill);
      }
    }
  }

  // 2. Certification → implied skills + cert names as skills
  for (const cert of (profile.certifications ?? [])) {
    if (!cert) continue;
    // Add the cert name itself as a skill (e.g., "PMP" matches "PMP" in requiredSkills)
    addSkill(cert);
    const certLower = cert.toLowerCase().trim();
    // Check exact match first, then partial match against known cert mappings
    for (const [certKey, impliedSkills] of Object.entries(CERT_IMPLIED_SKILLS)) {
      if (certLower === certKey || certLower.includes(certKey) || certKey.includes(certLower)) {
        for (const skill of impliedSkills) {
          addSkill(skill);
        }
      }
    }
  }

  // 3. Soft skills from dictionary matched against bullet text
  const allBulletText = (profile.experiences ?? []).flatMap(e => (e.bullets ?? [])).join(' ').toLowerCase();
  const allTitleText = (profile.experiences ?? []).map(e => (e.title ?? '')).join(' ').toLowerCase();
  const combinedText = allBulletText + ' ' + allTitleText;

  for (const softSkill of (dict.softSkills ?? [])) {
    if (!softSkill?.skill_name) continue;
    const skillLower = (softSkill.skill_name ?? '').toLowerCase();
    if (combinedText.includes(skillLower)) {
      addSkill(softSkill.skill_name);
    }
  }

  // 4. Direct keyword extraction from bullet text
  // Check for common skill phrases that appear in bullets
  const skillPhrases = [
    'project management', 'program management', 'budget management', 'risk management',
    'stakeholder management', 'change management', 'operations management',
    'cross-functional', 'cross functional', 'leadership', 'communication',
    'strategic planning', 'agile', 'scrum', 'waterfall', 'lean',
    'cybersecurity', 'information security', 'network security',
    'nist', 'rmf', 'cmmc', 'devsecops',
    'data analysis', 'data analytics', 'financial analysis',
    'government contracting', 'acquisition', 'procurement',
    'earned value management', 'evms', 'evm',
    'microsoft office', 'excel', 'powerpoint',
    'team building', 'mentoring', 'training',
    'compliance', 'audit', 'quality assurance',
    'supply chain', 'logistics', 'inventory management',
  ];

  for (const phrase of skillPhrases) {
    if (combinedText.includes(phrase)) {
      // Capitalize for display
      const displayName = phrase.split(/[\s-]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      addSkill(displayName);
    }
  }

  return skills;
}

// ============================================================================
// User Tools Extraction
// ============================================================================

/**
 * Extract tool/technology names from the user's bullet text, job titles,
 * and explicit skills list using the isLikelyTool() heuristic.
 *
 * This solves the tools score bug: JD tools (Python, Jira, Excel) were
 * compared against effectiveSkills (Leadership, Project Management) which
 * never overlap. Now we scan bullets for actual tool mentions.
 */
function getUserTools(profile: UserProfileForMatch): string[] {
  const tools: string[] = [];
  const seen = new Set<string>();

  const addTool = (name: string) => {
    const lower = name.toLowerCase();
    if (seen.has(lower)) return;
    seen.add(lower);
    tools.push(name);
  };

  // Collect all text from bullets and titles
  const allBullets = (profile.experiences ?? []).flatMap(e => e.bullets ?? []);
  const allTitles = (profile.experiences ?? []).map(e => e.title ?? '').filter(Boolean);
  const allText = [...allBullets, ...allTitles].join(' ');
  const textLower = allText.toLowerCase();

  // Scan for known tool names in text
  const TOOL_NAMES = [
    'Excel', 'Word', 'PowerPoint', 'Outlook', 'Microsoft Office', 'Office 365',
    'Jira', 'Confluence', 'Slack', 'Microsoft Teams', 'Zoom',
    'Salesforce', 'SAP', 'Oracle', 'Workday', 'ServiceNow',
    'Python', 'Java', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue',
    'Node.js', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform',
    'Git', 'GitHub', 'GitLab', 'Jenkins', 'CI/CD',
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
    'Tableau', 'Power BI', 'Looker',
    'Photoshop', 'Illustrator', 'Figma', 'Sketch',
    'SharePoint', 'Visio', 'AutoCAD',
    'Linux', 'Windows Server', 'Active Directory',
    'Splunk', 'Nessus', 'Wireshark',
  ];

  for (const tool of TOOL_NAMES) {
    if (textLower.includes(tool.toLowerCase())) {
      addTool(tool);
    }
  }

  // Also check user's explicit skills for tool-like entries
  for (const skill of (profile.skills ?? [])) {
    if (skill && isLikelyTool(skill) && !seen.has(skill.toLowerCase())) {
      addTool(skill);
    }
  }

  return tools;
}

// ============================================================================
// Gap Analysis
// ============================================================================

/**
 * Build gap items for all missing requirements, with recommendations and funding.
 */
async function buildGaps(
  extraction: ExtractionResult,
  profile: UserProfileForMatch,
  effectiveSkills: string[],
  dict: DictionaryCache,
): Promise<GapItem[]> {
  const gaps: GapItem[] = [];
  const skillsLower = new Set(effectiveSkills.map(s => (s ?? '').toLowerCase()));
  const certsLower = new Set((profile.certifications ?? []).map(c => (c ?? '').toLowerCase()));

  // Missing required skills
  for (const skill of (extraction.requiredSkills ?? [])) {
    if (!skill) continue;
    if (!skillsLower.has((skill ?? '').toLowerCase()) && !hasPartialMatch(skill, effectiveSkills)) {
      gaps.push(buildGapItem(skill, 'skill', 'high', dict, profile.branch));
    }
  }

  // Missing preferred skills
  for (const skill of (extraction.preferredSkills ?? [])) {
    if (!skill) continue;
    if (!skillsLower.has((skill ?? '').toLowerCase()) && !hasPartialMatch(skill, effectiveSkills)) {
      gaps.push(buildGapItem(skill, 'skill', 'medium', dict, profile.branch));
    }
  }

  // Missing required certs
  for (const cert of (extraction.requiredCerts ?? [])) {
    if (!cert) continue;
    if (!certsLower.has((cert ?? '').toLowerCase()) && !hasPartialMatch(cert, profile.certifications ?? [])) {
      gaps.push(buildGapItem(cert, 'cert', 'high', dict, profile.branch));
    }
  }

  // Missing preferred certs
  for (const cert of (extraction.preferredCerts ?? [])) {
    if (!cert) continue;
    if (!certsLower.has((cert ?? '').toLowerCase()) && !hasPartialMatch(cert, profile.certifications ?? [])) {
      gaps.push(buildGapItem(cert, 'cert', 'medium', dict, profile.branch));
    }
  }

  // Clearance gap
  if (extraction.clearanceRequired) {
    const clearanceResult = compareClearance(extraction.clearanceRequired, profile.clearance);
    if (!clearanceResult.met) {
      gaps.push(buildGapItem(extraction.clearanceRequired, 'clearance', 'high', dict, profile.branch));
    }
  }

  // Education gap
  if (extraction.educationRequired) {
    const eduResult = compareEducation(extraction.educationRequired, profile.education);
    if (!eduResult.met) {
      gaps.push(buildGapItem(extraction.educationRequired, 'education', 'high', dict, profile.branch));
    }
  }

  // Experience gap
  if (extraction.yearsRequired !== null) {
    const expResult = compareExperience(extraction.yearsRequired, profile.yearsOfService);
    if (!expResult.met) {
      gaps.push(buildGapItem(
        `${extraction.yearsRequired}+ years experience`,
        'experience',
        'high',
        dict,
        profile.branch,
      ));
    }
  }

  return filterGaps(deduplicateGaps(gaps), profile);
}

/** Filter out generic, too-short, or already-present gap keywords */
const GAP_BLACKLIST = new Set([
  'policy', 'policies', 'requirements', 'requirement', 'documentation',
  'communication', 'teamwork', 'teams', 'team', 'support', 'planning', 'reporting',
  'oversight', 'coordination', 'compliance', 'standards', 'procedures',
  'processes', 'tracking', 'monitoring', 'analysis', 'budget', 'scheduling',
  'risk', 'confluence', 'sharepoint', 'slack', 'briefings', 'services',
  'cross-functional', 'cross functional', 'cross-functional teams',
])

function filterGaps(gaps: GapItem[], profile: UserProfileForMatch): GapItem[] {
  // Collect all resume bullet text for substring matching
  const allBullets = (profile.experiences ?? []).flatMap(e => {
    const bullets = (e as any).bullets ?? (e as any).experience_bullets ?? []
    return (Array.isArray(bullets) ? bullets : []).map((b: any) =>
      typeof b === 'string' ? b.toLowerCase() : ((b?.translated_text || b?.original_text || '') as string).toLowerCase()
    )
  })
  const skillsLower = new Set((profile.skills ?? []).map(s => s.toLowerCase()))
  const clearanceLower = (profile.clearance ?? '').toLowerCase()

  return gaps.filter(gap => {
    const kw = gap.keyword.toLowerCase()
    // Too short (e.g. "R", "SLA")
    if (kw.length < 5) return false
    // Blacklisted generic term
    if (GAP_BLACKLIST.has(kw)) return false
    // Matches user's clearance
    if (clearanceLower && kw === clearanceLower) return false
    // Already in user's skills
    if (skillsLower.has(kw)) return false
    // Already mentioned in resume bullets
    if (allBullets.some(b => b.includes(kw))) return false
    return true
  })
}

/** Known synonyms — map alternate names to a canonical form */
const GAP_SYNONYMS: Record<string, string> = {
  'evms': 'earned value management',
  'evm': 'earned value management',
  'earned value': 'earned value management',
  'evms certification or training': 'earned value management',
  'pmp': 'project management professional',
  'pm': 'project management',
  'infosec': 'information security',
  'cybersec': 'cybersecurity',
  'six sigma': 'six sigma',
  'lean six sigma': 'six sigma',
  'six sigma or lean': 'six sigma',
  'lean': 'lean',
  'cross-functional': 'cross-functional teams',
  'cross functional': 'cross-functional teams',
  'cross-functional team': 'cross-functional teams',
  'cross functional teams': 'cross-functional teams',
};

/**
 * Deduplicate gaps:
 * 1. Normalize keywords (lowercase, trim)
 * 2. Apply known synonyms to find duplicates
 * 3. If two gaps map to the same canonical keyword, keep the one with a recommendation (or cert > skill)
 * 4. If a keyword appears as both skill and cert gap, keep the cert gap
 */
function deduplicateGaps(gaps: GapItem[]): GapItem[] {
  const seen = new Map<string, GapItem>(); // canonical key → best gap

  for (const gap of gaps) {
    const kwLower = (gap.keyword ?? '').toLowerCase().trim();
    const canonical = GAP_SYNONYMS[kwLower] ?? kwLower;

    const existing = seen.get(canonical);
    if (!existing) {
      seen.set(canonical, gap);
      continue;
    }

    // Prefer cert gap over skill gap (higher value recommendation)
    if (gap.category === 'cert' && existing.category === 'skill') {
      seen.set(canonical, gap);
      continue;
    }
    if (existing.category === 'cert' && gap.category === 'skill') {
      continue; // Keep existing cert gap
    }

    // Prefer whichever has a recommendation
    if (gap.recommendation && !existing.recommendation) {
      seen.set(canonical, gap);
      continue;
    }

    // Prefer higher severity
    const severityOrder = { high: 3, medium: 2, low: 1 };
    if ((severityOrder[gap.severity] ?? 0) > (severityOrder[existing.severity] ?? 0)) {
      seen.set(canonical, gap);
    }
    // Otherwise keep existing (first occurrence)
  }

  // Second pass: substring dedup — if one gap keyword contains another, keep only the more specific (longer) one
  const result = Array.from(seen.values());
  return result.filter((gap, i) => {
    const kwNorm = normalize(gap.keyword);
    return !result.some((other, j) => {
      if (i === j) return false;
      const otherNorm = normalize(other.keyword);
      // If this keyword is a proper substring of another, drop it (keep the longer one)
      if (otherNorm.includes(kwNorm) && otherNorm !== kwNorm) return true;
      return false;
    });
  });
}

/**
 * Build a single gap item with recommendation and funding lookups.
 */
function buildGapItem(
  keyword: string,
  category: string,
  severity: 'high' | 'medium' | 'low',
  dict: DictionaryCache,
  branch: string | null,
): GapItem {
  // Look up recommendation
  const rec = findGapRecommendation(keyword, category, dict);

  // Look up funding sources
  const fundingSources = findFundingSources(keyword, dict, branch);

  return {
    keyword,
    category,
    severity,
    recommendation: rec?.recommendation ?? null,
    relatedCerts: rec?.related_certs ?? [],
    freeResourceUrl: rec?.free_resource_url ?? null,
    resourceName: rec?.resource_name ?? null,
    estimatedTime: rec?.estimated_time ?? null,
    estimatedCost: rec?.estimated_cost ?? null,
    veteranDiscount: rec?.veteran_discount ?? false,
    fundingSources,
  };
}

/**
 * Find the best matching gap recommendation from dict_gap_recommendations.
 * Uses exact match first, then whole-word match (not substring) to prevent
 * "RMF" from matching the recommendation for "R".
 */
function findGapRecommendation(
  keyword: string,
  category: string,
  dict: DictionaryCache,
): DictionaryCache['gapRecommendations'][number] | null {
  const kwLower = (keyword ?? '').toLowerCase().trim();

  // Exact match on gap_keyword
  const exact = (dict.gapRecommendations ?? []).find(r =>
    (r.gap_keyword ?? '').toLowerCase().trim() === kwLower,
  );
  if (exact) return exact;

  // Whole-word match: the gap_keyword must appear as a complete word in the keyword (or vice versa)
  // This prevents "RMF" matching "R", "Cross-Functional" matching "R" or "C"
  const wholeWord = (dict.gapRecommendations ?? []).find(r => {
    const gapKw = (r.gap_keyword ?? '').toLowerCase().trim();
    if (!gapKw || gapKw.length < 2) return false; // Skip single-char gap keywords for safety
    return containsWholeWord(kwLower, gapKw) || containsWholeWord(gapKw, kwLower);
  });
  if (wholeWord) return wholeWord;

  // Match by category
  const byCategory = (dict.gapRecommendations ?? []).find(r =>
    (r.gap_category ?? '').toLowerCase() === (category ?? '').toLowerCase(),
  );
  return byCategory ?? null;
}

/** Check if `text` contains `word` as a whole word (word-boundary match) */
function containsWholeWord(text: string, word: string): boolean {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
}

/**
 * Find funding sources for a certification or skill gap.
 * Cross-references dict_cert_funding → dict_funding_programs.
 */
function findFundingSources(
  keyword: string,
  dict: DictionaryCache,
  branch: string | null,
): FundingSource[] {
  const kwLower = (keyword ?? '').toLowerCase();
  const sources: FundingSource[] = [];
  const seenCodes = new Set<string>();

  // Find matching cert funding entries
  const certFundingMatches = (dict.certFunding ?? []).filter(cf =>
    (cf.cert_keyword ?? '').toLowerCase().includes(kwLower) ||
    kwLower.includes((cf.cert_keyword ?? '').toLowerCase()),
  );

  for (const cf of certFundingMatches) {
    if (seenCodes.has(cf.funding_program_code)) continue;
    seenCodes.add(cf.funding_program_code);

    // Look up the full funding program
    const program = (dict.fundingPrograms ?? []).find(fp =>
      fp.program_code === cf.funding_program_code,
    );
    if (!program) continue;

    // Check branch eligibility
    if (branch && (program.branches ?? []).length > 0) {
      const branchLower = (branch ?? '').toLowerCase();
      const eligible = (program.branches ?? []).some(b =>
        (b ?? '').toLowerCase().includes(branchLower) || (b ?? '').toLowerCase() === 'all',
      );
      if (!eligible) continue;
    }

    sources.push({
      programName: program.program_name,
      programCode: program.program_code,
      description: program.description,
      eligibility: program.eligibility,
      websiteUrl: program.website_url,
      howToApply: program.how_to_apply,
      keyBenefits: program.key_benefits ?? [],
      directLink: cf.direct_link,
      notes: cf.notes,
    });
  }

  // Also check for general funding programs that match the branch
  if (sources.length === 0 && branch) {
    const branchLower = (branch ?? '').toLowerCase();
    const branchPrograms = (dict.fundingPrograms ?? []).filter(fp =>
      (fp.branches ?? []).some(b => (b ?? '').toLowerCase().includes(branchLower) || (b ?? '').toLowerCase() === 'all'),
    );
    for (const program of branchPrograms.slice(0, 3)) {
      if (seenCodes.has(program.program_code)) continue;
      sources.push({
        programName: program.program_name,
        programCode: program.program_code,
        description: program.description,
        eligibility: program.eligibility,
        websiteUrl: program.website_url,
        howToApply: program.how_to_apply,
        keyBenefits: program.key_benefits ?? [],
        directLink: null,
        notes: null,
      });
    }
  }

  return sources;
}

// ============================================================================
// Exceeds Identification
// ============================================================================

/**
 * Identify areas where the user exceeds what the JD requires.
 */
function buildExceeds(
  extraction: ExtractionResult,
  profile: UserProfileForMatch,
  effectiveSkills: string[],
  education: { met: boolean; required: string | null; candidate: string | null },
  experience: { met: boolean; required: number | null; candidate: number | null },
  clearance: { met: boolean; required: string | null; candidate: string | null },
): string[] {
  const exceeds: string[] = [];

  // Skills the user has that aren't in the JD but are strong
  const allJdSkills = new Set([
    ...(extraction.requiredSkills ?? []),
    ...(extraction.preferredSkills ?? []),
    ...(extraction.tools ?? []),
  ].map(s => (s ?? '').toLowerCase()));

  const bonusSkills = effectiveSkills.filter(s => !allJdSkills.has((s ?? '').toLowerCase()));
  if (bonusSkills.length > 0) {
    exceeds.push(`${bonusSkills.length} additional relevant skills beyond requirements`);
  }

  // Education exceeds
  if (education.met && education.required && education.candidate) {
    const reqLevel = EDUCATION_HIERARCHY[(education.required ?? '').toLowerCase()] ?? 0;
    const candLevel = EDUCATION_HIERARCHY[(education.candidate ?? '').toLowerCase()] ?? 0;
    if (candLevel > reqLevel) {
      exceeds.push(`Education exceeds requirement: ${education.candidate} vs. ${education.required} required`);
    }
  }

  // Experience exceeds
  if (experience.met && experience.required !== null && experience.candidate !== null) {
    if (experience.candidate > experience.required + 2) {
      exceeds.push(`${experience.candidate - experience.required} additional years of experience beyond requirement`);
    }
  }

  // Clearance exceeds
  if (clearance.met && clearance.required && clearance.candidate) {
    const reqLevel = CLEARANCE_HIERARCHY[(clearance.required ?? '').toLowerCase()] ?? 0;
    const candLevel = CLEARANCE_HIERARCHY[(clearance.candidate ?? '').toLowerCase()] ?? 0;
    if (candLevel > reqLevel) {
      exceeds.push(`Clearance exceeds requirement: ${clearance.candidate} vs. ${clearance.required} required`);
    }
  }

  return exceeds;
}

// ============================================================================
// MOS → Civilian Titles
// ============================================================================

/** Look up civilian job titles for the user's MOS code. */
function getCivilianTitles(profile: UserProfileForMatch, dict: DictionaryCache): string[] {
  if (!profile.ratingMos) return [];

  const mosLower = (profile.ratingMos ?? '').toLowerCase();
  const matches = (dict.mosToCivilian ?? []).filter(m =>
    (m.military_code ?? '').toLowerCase() === mosLower,
  );

  return matches.flatMap(m => m.civilian_titles ?? []);
}

// ============================================================================
// Industry Framing
// ============================================================================

/** Find industry framing suggestions based on user's background and target industry. */
function getIndustryFraming(
  profile: UserProfileForMatch,
  extraction: ExtractionResult,
  dict: DictionaryCache,
): DictionaryCache['industryFraming'] {
  const targetIndustry = extraction.industry ?? profile.targetIndustry;
  if (!targetIndustry) return [];

  const industryLower = (targetIndustry ?? '').toLowerCase();
  return (dict.industryFraming ?? []).filter(f =>
    (f.target_industry ?? '').toLowerCase().includes(industryLower) ||
    industryLower.includes((f.target_industry ?? '').toLowerCase()),
  );
}

// ============================================================================
// Utility
// ============================================================================

/** Check for partial string match between a keyword and a list of items. */
function hasPartialMatch(keyword: string, items: string[]): boolean {
  const kwNorm = normalize(keyword);
  return (items ?? []).some(item => {
    const itemNorm = normalize(item);
    return itemNorm.includes(kwNorm) || kwNorm.includes(itemNorm);
  });
}
