/**
 * Dictionary Translation Engine — Type Definitions
 *
 * Types for all Supabase dict_* tables and engine interfaces.
 * Database row types match production schema exactly.
 */

// ============================================================================
// Database Row Types — Supabase dict_* tables
// Column definitions from production schema dump
// ============================================================================

/** Row from dict_acronyms — military acronym → civilian explanation */
export interface DictAcronym {
  id: string;
  acronym: string;
  full_term: string;
  civilian_explanation: string;
  branch: string | null;
  category: string | null;
  created_at: string;
}

/** Row from dict_action_verbs — strong action verbs for resume bullets */
export interface DictActionVerb {
  id: string;
  verb: string;
  category: string;
  strength: string;
  avoid_in: string | null;
  best_for: string[];
  created_at: string;
}

/** Row from dict_ats_keywords — ATS-optimized keywords by industry/role */
export interface DictAtsKeyword {
  id: string;
  industry: string;
  role_type: string;
  keywords: string[];
  weight: string;
  created_at: string;
}

/** Row from dict_bullet_patterns — resume bullet templates with placeholders */
export interface DictBulletPattern {
  id: string;
  pattern_name: string;
  category: string;
  rank_tier: string | null;
  pattern_template: string;
  example_military: string | null;
  example_output: string | null;
  required_fields: string[];
  optional_fields: string[];
  created_at: string;
}

/** Row from dict_cert_funding — links certifications to funding programs */
export interface DictCertFunding {
  id: string;
  cert_keyword: string;
  funding_program_code: string;
  branch: string | null;
  notes: string | null;
  direct_link: string | null;
  created_at: string;
}

/** Row from dict_cover_letter_templates — cover letter paragraph templates */
export interface DictCoverLetterTemplate {
  id: string;
  template_name: string;
  industry: string;
  role_type: string;
  opening_paragraph: string;
  body_paragraph_1: string;
  body_paragraph_2: string;
  closing_paragraph: string;
  placeholders: Record<string, string>;
  notes: string | null;
  created_at: string;
}

/** Row from dict_eval_phrases — eval performance phrases → civilian translation */
export interface DictEvalPhrase {
  id: string;
  eval_phrase: string;
  civilian_translation: string;
  eval_type: string;
  performance_level: string | null;
  category: string | null;
  created_at: string;
  branch: string | null;
}

/** Row from dict_funding_programs — veteran funding/benefit programs */
export interface DictFundingProgram {
  id: string;
  program_name: string;
  program_code: string;
  description: string;
  eligibility: string;
  branches: string[];
  status_required: string | null;
  website_url: string | null;
  how_to_apply: string | null;
  key_benefits: string[];
  limitations: string | null;
  created_at: string;
}

/** Row from dict_gap_recommendations — what to do when a skill/cert is missing */
export interface DictGapRecommendation {
  id: string;
  gap_keyword: string;
  gap_category: string;
  recommendation_type: string;
  recommendation: string;
  related_certs: string[];
  related_skills: string[];
  free_resource_url: string | null;
  resource_name: string | null;
  estimated_time: string | null;
  estimated_cost: string | null;
  veteran_discount: boolean;
  veteran_discount_notes: string | null;
  created_at: string;
}

/** Row from dict_industry_framing — reframe military experience for civilian industries */
export interface DictIndustryFraming {
  id: string;
  military_experience: string;
  target_industry: string;
  framed_description: string;
  keywords: string[];
  created_at: string;
}

/** Row from dict_linkedin_keywords — military skill → LinkedIn keyword mapping */
export interface DictLinkedinKeyword {
  id: string;
  military_skill: string;
  linkedin_keywords: string[];
  industry: string;
  priority: string | null;
  created_at: string;
}

/** Row from dict_linkedin_templates — LinkedIn section templates */
export interface DictLinkedinTemplate {
  id: string;
  section: string;
  template_name: string;
  target_role: string | null;
  target_industry: string | null;
  template_text: string;
  placeholders: Record<string, string> | null;
  created_at: string;
}

/** Row from dict_military_jargon — military term → civilian equivalent */
export interface DictMilitaryJargon {
  id: string;
  military_term: string;
  civilian_equivalent: string;
  branch: string | null;
  category: string | null;
  created_at: string;
}

/** Row from dict_mos_to_civilian — MOS/rating code → civilian job titles */
export interface DictMosToCivilian {
  id: string;
  branch: string;
  military_code: string;
  military_title: string;
  civilian_titles: string[];
  onet_codes: string[];
  industries: string[];
  key_skills: string[];
  description: string;
  created_at: string;
}

/** Row from dict_onet_crosswalk — DoD DMDC military-to-O*NET occupation crosswalk */
export interface DictOnetCrosswalk {
  id: string;
  svc: string;
  moc: string;
  moc_title: string;
  onet_code: string | null;
  onet_title: string | null;
  soc_code: string | null;
  soc_title: string | null;
  created_at: string;
}

/** Row from dict_rank_equivalents — paygrade → civilian title equivalent */
export interface DictRankEquivalent {
  id: string;
  branch: string;
  paygrade: string;
  civilian_equivalent: string;
  federal_gs_equivalent: string | null;
  typical_team_size: string | null;
  created_at: string;
}

/** Row from dict_phrase_translations — military phrase → civilian phrase */
export interface DictPhraseTranslation {
  id: string;
  military_phrase: string;
  civilian_phrase: string;
  branch: string | null;
  category: string | null;
  created_at: string;
}

/** Row from dict_quantification_helpers — vague phrase → quantified alternatives */
export interface DictQuantificationHelper {
  id: string;
  vague_phrase: string;
  quantified_alternatives: string[];
  created_at: string;
}

/** Row from dict_resume_templates — resume layout/section templates */
export interface DictResumeTemplate {
  id: string;
  template_name: string;
  template_type: string;
  sections: Record<string, unknown>;
  formatting: Record<string, unknown>;
  created_at: string;
}

/** Row from dict_professional_summaries — summary templates by rank tier and industry */
export interface DictProfessionalSummary {
  id: string;
  template_name: string;
  rank_tier: string;
  target_industry: string;
  target_role: string | null;
  template_text: string;
  example_output: string | null;
  created_at: string;
}

/** Row from dict_soft_skills — soft skills with context-specific descriptions */
export interface DictSoftSkill {
  id: string;
  skill_name: string;
  category: string;
  resume_description: string | null;
  interview_description: string | null;
  linkedin_description: string | null;
  created_at: string;
}

// ============================================================================
// Dictionary Cache — all table data loaded in memory
// ============================================================================

/** All dictionary tables cached for the browser session */
export interface DictionaryCache {
  acronyms: DictAcronym[];
  actionVerbs: DictActionVerb[];
  atsKeywords: DictAtsKeyword[];
  bulletPatterns: DictBulletPattern[];
  certFunding: DictCertFunding[];
  coverLetterTemplates: DictCoverLetterTemplate[];
  evalPhrases: DictEvalPhrase[];
  fundingPrograms: DictFundingProgram[];
  gapRecommendations: DictGapRecommendation[];
  industryFraming: DictIndustryFraming[];
  linkedinKeywords: DictLinkedinKeyword[];
  linkedinTemplates: DictLinkedinTemplate[];
  militaryJargon: DictMilitaryJargon[];
  mosToCivilian: DictMosToCivilian[];
  rankEquivalents: DictRankEquivalent[];
  phraseTranslations: DictPhraseTranslation[];
  quantificationHelpers: DictQuantificationHelper[];
  resumeTemplates: DictResumeTemplate[];
  professionalSummaries: DictProfessionalSummary[];
  softSkills: DictSoftSkill[];
}

// ============================================================================
// Keyword Extraction Types
// ============================================================================

/** A keyword found in the job description */
export interface ExtractedKeyword {
  keyword: string;
  weight: string;
  section: 'required' | 'preferred' | 'general';
  source: 'ats' | 'acronym' | 'jargon' | 'linkedin' | 'regex';
}

/** A military acronym detected in the JD */
export interface DetectedAcronym {
  acronym: string;
  fullTerm: string;
  civilianExplanation: string;
}

/** A military term or phrase detected in the JD */
export interface DetectedMilitaryTerm {
  term: string;
  civilianEquivalent: string;
  source: 'jargon' | 'phrase' | 'eval';
}

/** Full result from job description keyword extraction */
export interface ExtractionResult {
  /** Detected industry from ATS keyword matching */
  industry: string | null;
  /** Detected role type from ATS keyword matching */
  roleType: string | null;
  /** Company name extracted from JD text */
  companyName: string | null;
  /** Job title extracted from JD header or patterns */
  jobTitle: string | null;
  /** Skills explicitly listed as required */
  requiredSkills: string[];
  /** Skills listed as preferred/nice-to-have */
  preferredSkills: string[];
  /** Certifications listed as required */
  requiredCerts: string[];
  /** Certifications listed as preferred */
  preferredCerts: string[];
  /** Clearance requirement if detected */
  clearanceRequired: string | null;
  /** Education requirement if detected */
  educationRequired: string | null;
  /** Years of experience required */
  yearsRequired: number | null;
  /** Tools and technologies mentioned */
  tools: string[];
  /** All ATS keywords found with weights and sections */
  atsKeywords: ExtractedKeyword[];
  /** Military acronyms detected */
  detectedAcronyms: DetectedAcronym[];
  /** Military terms/jargon detected */
  detectedMilitaryTerms: DetectedMilitaryTerm[];
  /** Raw text split into sections */
  rawSections: {
    required: string;
    preferred: string;
    full: string;
  };
}

// ============================================================================
// Match Scoring Types
// ============================================================================

/** Score breakdown for a single match category */
export interface MatchCategory {
  score: number;
  maxScore: number;
  percentage: number;
  matched: string[];
  missing: string[];
}

/** A gap between JD requirements and user profile, with actionable recommendations */
export interface GapItem {
  /** The missing keyword or skill */
  keyword: string;
  /** Category: skill, cert, clearance, education, experience */
  category: string;
  /** high = required, medium = preferred, low = nice-to-have */
  severity: 'high' | 'medium' | 'low';
  /** Recommendation from dict_gap_recommendations */
  recommendation: string | null;
  /** Related certifications that could fill the gap */
  relatedCerts: string[];
  /** Free resource URL */
  freeResourceUrl: string | null;
  /** Resource name */
  resourceName: string | null;
  /** Estimated time to fill the gap */
  estimatedTime: string | null;
  /** Estimated cost */
  estimatedCost: string | null;
  /** Whether veteran discount is available */
  veteranDiscount: boolean;
  /** Funding sources available for this gap */
  fundingSources: FundingSource[];
}

/** A funding program that can help fill a gap */
export interface FundingSource {
  programName: string;
  programCode: string;
  description: string;
  eligibility: string;
  websiteUrl: string | null;
  howToApply: string | null;
  keyBenefits: string[];
  directLink: string | null;
  notes: string | null;
}

/** Full match result comparing JD extraction against user profile */
export interface MatchResult {
  /** Overall weighted match score (0-100) */
  overallScore: number;
  /** Category breakdown */
  categories: {
    requiredSkills: MatchCategory;
    preferredSkills: MatchCategory;
    tools: MatchCategory;
    certifications: MatchCategory;
    education: { met: boolean; required: string | null; candidate: string | null };
    experience: { met: boolean; required: number | null; candidate: number | null };
    clearance: { met: boolean; required: string | null; candidate: string | null };
  };
  /** Items where user exceeds requirements */
  exceeds: string[];
  /** All identified gaps with recommendations and funding */
  gaps: GapItem[];
  /** Civilian titles matched from MOS lookup */
  civilianTitleMatches: string[];
  /** Industry framing suggestions from dictionary */
  industryFraming: DictIndustryFraming[];
}

// ============================================================================
// Template Filler Types
// ============================================================================

/** Context provided by the user for template filling */
export interface TemplateContext {
  companyName?: string;
  jobTitle?: string;
  hiringManagerName?: string;
  applicantPhone?: string;
  applicantEmail?: string;
}

/** Result of filling a cover letter template */
export interface FilledTemplate {
  /** The fully assembled cover letter text */
  text: string;
  /** Placeholders that were successfully filled */
  filledPlaceholders: string[];
  /** Placeholders that still need user input */
  unfilledPlaceholders: string[];
  /** The source template used */
  templateName: string;
  /** Individual paragraphs for editing */
  paragraphs: {
    opening: string;
    body1: string;
    body2: string;
    closing: string;
  };
}

// ============================================================================
// User Profile Types (input for match scoring and template filling)
// ============================================================================

/** User profile data assembled from profiles + related tables */
export interface UserProfileForMatch {
  firstName: string | null;
  lastName: string | null;
  branch: string | null;
  rank: string | null;
  paygrade: string | null;
  ratingMos: string | null;
  yearsOfService: number | null;
  clearance: string | null;
  targetRole: string | null;
  targetIndustry: string | null;
  skills: string[];
  certifications: string[];
  education: UserEducation[];
  experiences: UserExperience[];
}

/** Education record from the education table */
export interface UserEducation {
  degree: string | null;
  field_of_study: string | null;
  school: string | null;
}

/** Experience record with bullet points */
export interface UserExperience {
  title: string | null;
  organization: string | null;
  years: number | null;
  bullets: string[];
}

// ============================================================================
// Raw Supabase data shapes (for the buildUserProfile helper)
// ============================================================================

/** Raw profile row from Supabase profiles table */
export interface RawProfile {
  first_name?: string | null;
  last_name?: string | null;
  branch?: string | null;
  rank?: string | null;
  paygrade?: string | null;
  rating_mos?: string | null;
  years_of_service?: number | string | null;
  clearance?: string | null;
  target_role?: string | null;
  target_industry?: string | null;
}

/** Raw certification row from Supabase certifications table */
export interface RawCertification {
  name: string;
  issuing_org?: string | null;
}

/** Raw education row from Supabase education table */
export interface RawEducation {
  degree?: string | null;
  field_of_study?: string | null;
  school?: string | null;
}

/** Raw experience row from Supabase experience table with bullets */
export interface RawExperience {
  title?: string | null;
  organization?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  bullets?: RawBullet[];
  experience_bullets?: RawBullet[];
}

/** Raw bullet row from experience_bullets table */
export interface RawBullet {
  translated_text?: string | null;
  original_text?: string | null;
}
