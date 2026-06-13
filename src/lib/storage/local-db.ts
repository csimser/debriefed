/**
 * Local database — all user data lives in the browser's localStorage.
 *
 * Design notes:
 * - SSR-safe: every read returns its empty value when `window` is undefined
 *   (Next static export prerenders client components once on the server).
 * - The Anthropic API key is intentionally stored under its own key and is
 *   NEVER included in data exports.
 * - Collections are stored as one JSON array per entity. At realistic data
 *   sizes (a profile, a handful of resumes) this is far below localStorage
 *   quotas; version history and eval history are capped to keep it that way.
 */
import type {
  AppSettings,
  Certification,
  DataExport,
  Education,
  EvalUpload,
  Experience,
  JobApplication,
  Profile,
  Resume,
  ResumeVersion,
  Skill,
} from './types'

export const SCHEMA_VERSION = 1
const PREFIX = `debriefed:v${SCHEMA_VERSION}:`
export const API_KEY_STORAGE_KEY = 'debriefed:apiKey'

const KEYS = {
  profile: `${PREFIX}profile`,
  experiences: `${PREFIX}experiences`,
  education: `${PREFIX}education`,
  certifications: `${PREFIX}certifications`,
  skills: `${PREFIX}skills`,
  resumes: `${PREFIX}resumes`,
  resume_versions: `${PREFIX}resume_versions`,
  applications: `${PREFIX}applications`,
  eval_uploads: `${PREFIX}eval_uploads`,
  settings: `${PREFIX}settings`,
} as const

const MAX_VERSIONS_PER_RESUME = 10
const MAX_EVAL_UPLOADS = 20

export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export const nowIso = () => new Date().toISOString()

const hasWindow = () => typeof window !== 'undefined'

function read<T>(key: string, fallback: T): T {
  if (!hasWindow()) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown): void {
  if (!hasWindow()) return
  window.localStorage.setItem(key, JSON.stringify(value))
}

// ── Profile (single object) ─────────────────────────────────────────────────

export function getProfile(): Profile | null {
  return read<Profile | null>(KEYS.profile, null)
}

export function saveProfile(patch: Partial<Profile>): Profile {
  const current = getProfile()
  const next: Profile = {
    id: current?.id ?? newId(),
    created_at: current?.created_at ?? nowIso(),
    ...current,
    ...patch,
    updated_at: nowIso(),
  }
  write(KEYS.profile, next)
  return next
}

// ── Generic collections ─────────────────────────────────────────────────────

type CollectionKey = Exclude<keyof typeof KEYS, 'profile' | 'settings'>

function list<T>(key: CollectionKey): T[] {
  return read<T[]>(KEYS[key], [])
}

function saveAll<T>(key: CollectionKey, items: T[]): T[] {
  write(KEYS[key], items)
  return items
}

function upsert<T extends { id: string; updated_at?: string }>(key: CollectionKey, item: T): T {
  const items = list<T>(key)
  const idx = items.findIndex((x) => x.id === item.id)
  const next = { ...item, updated_at: nowIso() }
  if (idx >= 0) items[idx] = next
  else items.push(next)
  saveAll(key, items)
  return next
}

function removeById(key: CollectionKey, id: string): void {
  saveAll(
    key,
    list<{ id: string }>(key).filter((x) => x.id !== id),
  )
}

// ── Experiences (bullets embedded) ──────────────────────────────────────────

export const listExperiences = (): Experience[] =>
  list<Experience>('experiences')
    .map((e) => ({ ...e, bullets: e.bullets ?? [] }))
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

export const saveExperience = (e: Experience) => upsert('experiences', e)
export const saveExperiences = (e: Experience[]) => saveAll('experiences', e)
export const deleteExperience = (id: string) => removeById('experiences', id)

// ── Education / Certifications / Skills ─────────────────────────────────────

export const listEducation = (): Education[] =>
  list<Education>('education').sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
export const saveEducation = (e: Education) => upsert('education', e)
export const saveAllEducation = (e: Education[]) => saveAll('education', e)
export const deleteEducation = (id: string) => removeById('education', id)

export const listCertifications = (): Certification[] =>
  list<Certification>('certifications').sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
export const saveCertification = (c: Certification) => upsert('certifications', c)
export const saveAllCertifications = (c: Certification[]) => saveAll('certifications', c)
export const deleteCertification = (id: string) => removeById('certifications', id)

export const listSkills = (): Skill[] =>
  list<Skill>('skills').sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
export const saveSkill = (s: Skill) => upsert('skills', s)
export const saveAllSkills = (s: Skill[]) => saveAll('skills', s)
export const deleteSkill = (id: string) => removeById('skills', id)

// ── Resumes + versions ──────────────────────────────────────────────────────

export const listResumes = (): Resume[] =>
  list<Resume>('resumes').sort(
    (a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? ''),
  )

export function saveResume(r: Resume): Resume {
  if (!r.created_at) r.created_at = nowIso()
  return upsert('resumes', r)
}

export function deleteResume(id: string): void {
  removeById('resumes', id)
  saveAll(
    'resume_versions',
    list<ResumeVersion>('resume_versions').filter((v) => v.resume_id !== id),
  )
}

export const listResumeVersions = (resumeId: string): ResumeVersion[] =>
  list<ResumeVersion>('resume_versions')
    .filter((v) => v.resume_id === resumeId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))

export function saveResumeVersion(
  resumeId: string,
  versionName: string,
  resumeData: Record<string, unknown>,
): ResumeVersion {
  const version: ResumeVersion = {
    id: newId(),
    resume_id: resumeId,
    version_name: versionName,
    resume_data: resumeData,
    created_at: nowIso(),
  }
  const others = list<ResumeVersion>('resume_versions')
  const mine = [version, ...others.filter((v) => v.resume_id === resumeId)]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, MAX_VERSIONS_PER_RESUME)
  saveAll('resume_versions', [
    ...others.filter((v) => v.resume_id !== resumeId),
    ...mine,
  ])
  return version
}

export const deleteResumeVersion = (id: string) => removeById('resume_versions', id)

// ── Applications tracker ────────────────────────────────────────────────────

export const listApplications = (): JobApplication[] =>
  list<JobApplication>('applications').sort((a, b) =>
    (b.applied_date ?? '').localeCompare(a.applied_date ?? ''),
  )
export const saveApplication = (a: JobApplication) => {
  if (!a.created_at) a.created_at = nowIso()
  return upsert('applications', a)
}
export const deleteApplication = (id: string) => removeById('applications', id)

// ── Eval uploads (history of extracted bullets, capped) ─────────────────────

export const listEvalUploads = (): EvalUpload[] =>
  list<EvalUpload>('eval_uploads').sort((a, b) =>
    (b.created_at ?? '').localeCompare(a.created_at ?? ''),
  )

export function saveEvalUpload(e: EvalUpload): EvalUpload {
  if (!e.created_at) e.created_at = nowIso()
  const saved = upsert('eval_uploads', e)
  const all = listEvalUploads()
  if (all.length > MAX_EVAL_UPLOADS) saveAll('eval_uploads', all.slice(0, MAX_EVAL_UPLOADS))
  return saved
}

export const deleteEvalUpload = (id: string) => removeById('eval_uploads', id)

// ── Settings ────────────────────────────────────────────────────────────────

export const getSettings = (): AppSettings => read<AppSettings>(KEYS.settings, {})

export function saveSettings(patch: Partial<AppSettings>): AppSettings {
  const next = { ...getSettings(), ...patch }
  write(KEYS.settings, next)
  return next
}

// ── API key (separate key — excluded from exports) ──────────────────────────

export function getApiKey(): string | null {
  if (!hasWindow()) return null
  return window.localStorage.getItem(API_KEY_STORAGE_KEY)
}

export function setApiKey(key: string): void {
  if (!hasWindow()) return
  window.localStorage.setItem(API_KEY_STORAGE_KEY, key.trim())
}

export function clearApiKey(): void {
  if (!hasWindow()) return
  window.localStorage.removeItem(API_KEY_STORAGE_KEY)
}

// ── Export / import / wipe ──────────────────────────────────────────────────

export function exportAllData(): DataExport {
  return {
    app: 'debriefed',
    schema_version: SCHEMA_VERSION,
    exported_at: nowIso(),
    profile: getProfile(),
    experiences: list<Experience>('experiences'),
    education: list<Education>('education'),
    certifications: list<Certification>('certifications'),
    skills: list<Skill>('skills'),
    resumes: list<Resume>('resumes'),
    resume_versions: list<ResumeVersion>('resume_versions'),
    applications: list<JobApplication>('applications'),
    eval_uploads: list<EvalUpload>('eval_uploads'),
    settings: getSettings(),
  }
}

export function importAllData(data: unknown): { ok: boolean; error?: string } {
  if (!data || typeof data !== 'object') return { ok: false, error: 'Not a valid backup file' }
  const d = data as Partial<DataExport>
  if (d.app !== 'debriefed') return { ok: false, error: 'Not a Debriefed backup file' }
  if ((d.schema_version ?? 0) > SCHEMA_VERSION)
    return { ok: false, error: 'Backup was created by a newer version of Debriefed' }

  if (d.profile) write(KEYS.profile, d.profile)
  if (Array.isArray(d.experiences)) write(KEYS.experiences, d.experiences)
  if (Array.isArray(d.education)) write(KEYS.education, d.education)
  if (Array.isArray(d.certifications)) write(KEYS.certifications, d.certifications)
  if (Array.isArray(d.skills)) write(KEYS.skills, d.skills)
  if (Array.isArray(d.resumes)) write(KEYS.resumes, d.resumes)
  if (Array.isArray(d.resume_versions)) write(KEYS.resume_versions, d.resume_versions)
  if (Array.isArray(d.applications)) write(KEYS.applications, d.applications)
  if (Array.isArray(d.eval_uploads)) write(KEYS.eval_uploads, d.eval_uploads)
  if (d.settings) write(KEYS.settings, d.settings)
  return { ok: true }
}

/** Deletes all user data including the API key. */
export function clearAllData(): void {
  if (!hasWindow()) return
  for (const key of Object.values(KEYS)) window.localStorage.removeItem(key)
  window.localStorage.removeItem(API_KEY_STORAGE_KEY)
}
