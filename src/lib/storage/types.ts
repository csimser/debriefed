/**
 * Entity types for the local (browser) database.
 *
 * Field names intentionally mirror the original Supabase columns so the
 * existing components keep working unchanged. Everything lives in
 * localStorage — there is no backend.
 */

export interface Profile {
  id: string
  email?: string | null
  first_name?: string | null
  last_name?: string | null
  phone?: string | null
  city?: string | null
  state?: string | null
  zip_code?: string | null
  linkedin_url?: string | null
  branch?: string | null
  rank?: string | null
  paygrade?: string | null
  rating_mos?: string | null
  years_of_service?: number | null
  service_start_date?: string | null
  service_end_date?: string | null
  separation_date?: string | null
  skillbridge_start?: string | null
  skillbridge_end?: string | null
  clearance?: string | null
  security_clearance?: string | null
  target_industry?: string | null
  target_role?: string | null
  target_salary?: string | null
  willing_to_relocate?: boolean | null
  preferred_locations?: string[] | null
  professional_summary?: string | null
  veterans_preference?: boolean | null
  onboarding_completed?: boolean | null
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export interface ExperienceBullet {
  id: string
  experience_id?: string
  original_text?: string | null
  translated_text?: string | null
  status?: 'pending' | 'accepted' | 'excluded' | string
  sort_order?: number
  created_at?: string
  [key: string]: unknown
}

export interface Experience {
  id: string
  job_title?: string | null
  military_title?: string | null
  civilian_title?: string | null
  company_name?: string | null
  organization?: string | null
  department?: string | null
  city?: string | null
  state?: string | null
  location?: string | null
  start_date?: string | null
  end_date?: string | null
  is_current?: boolean
  description?: string | null
  hours_per_week?: number | null
  salary?: string | null
  grade_level?: string | null
  supervisor_name?: string | null
  supervisor_phone?: string | null
  supervisor_can_contact?: boolean
  sort_order?: number
  /** Bullets are embedded — there is no separate bullets store. */
  bullets: ExperienceBullet[]
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export interface Education {
  id: string
  school_name?: string | null
  degree_type?: string | null
  field_of_study?: string | null
  minor?: string | null
  graduation_date?: string | null
  graduation_month?: string | null
  graduation_year?: string | null
  start_month?: string | null
  start_year?: string | null
  is_expected?: boolean
  gpa?: string | null
  location?: string | null
  credits_earned?: number | null
  relevant_coursework?: string[] | null
  sort_order?: number
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export interface Certification {
  id: string
  name: string
  issuing_organization?: string | null
  issuer?: string | null
  issue_date?: string | null
  date_obtained?: string | null
  expiration_date?: string | null
  credential_id?: string | null
  sort_order?: number
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export interface Skill {
  id: string
  name: string
  category?: string | null
  proficiency?: string | null
  sort_order?: number
  created_at?: string
  [key: string]: unknown
}

export interface Resume {
  id: string
  title: string
  type?: 'civilian' | 'federal' | string
  template?: string
  contact_info?: Record<string, unknown>
  summary?: string | null
  content?: Record<string, unknown>
  target_job_title?: string | null
  target_job_description?: string | null
  match_score?: number | null
  federal_series?: string | null
  federal_grade?: string | null
  federal_essays?: unknown[]
  is_master?: boolean
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export interface ResumeVersion {
  id: string
  resume_id: string
  version_name: string
  resume_data: Record<string, unknown>
  created_at: string
}

export type ApplicationStatus =
  | 'applied'
  | 'callback'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'accepted'

export interface JobApplication {
  id: string
  resume_id?: string | null
  company_name: string
  job_title: string
  applied_date: string
  status: ApplicationStatus | string
  notes?: string | null
  salary_offered?: number | null
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export interface EvalUpload {
  id: string
  file_name?: string | null
  file_type?: string | null
  eval_type?: string | null
  eval_date?: string | null
  extracted_data?: Record<string, unknown> | null
  status?: string
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export interface AppSettings {
  theme?: 'light' | 'dark'
  onboarding_completed?: boolean
  dictionary_intro_shown?: boolean
  gov_banner_dismissed?: boolean
  /** Rough local token-spend meter (courtesy only — Anthropic bills the user directly). */
  tokens_used?: number
  /** First-launch dictionary/AI choice modal shown. */
  first_launch_seen?: boolean
  [key: string]: unknown
}

/** Shape of the exported backup file (Settings → Export my data). */
export interface DataExport {
  app: 'debriefed'
  schema_version: number
  exported_at: string
  profile: Profile | null
  experiences: Experience[]
  education: Education[]
  certifications: Certification[]
  skills: Skill[]
  resumes: Resume[]
  resume_versions: ResumeVersion[]
  applications: JobApplication[]
  eval_uploads: EvalUpload[]
  settings: AppSettings
}
