/**
 * Federal Resume 2-Page Hard Limit Trimmer
 *
 * Trims resume content to fit within 2 pages for federal resumes.
 * Returns a new object — does NOT mutate the original.
 */

// Bullet limits graduated by position recency (most recent first)
const BULLETS_PER_POSITION = [8, 8, 5, 3]
const MAX_POSITIONS = 4
const MAX_SUMMARY_CHARS = 500
const MAX_EDUCATION = 3
const MAX_CERTIFICATIONS = 6
const MAX_TRAINING = 4
const MAX_LANGUAGES = 4
const MAX_AFFILIATIONS = 3
const MAX_PUBLICATIONS = 3

export function trimForFederalLimit(content: any): any {
  if (!content) return content

  const trimmed = { ...content }

  // Trim summary
  if (trimmed.summary && trimmed.summary.length > MAX_SUMMARY_CHARS) {
    // Cut at last sentence boundary before limit, or hard cut with ellipsis
    const cut = trimmed.summary.slice(0, MAX_SUMMARY_CHARS)
    const lastPeriod = cut.lastIndexOf('.')
    trimmed.summary = lastPeriod > MAX_SUMMARY_CHARS * 0.6
      ? cut.slice(0, lastPeriod + 1)
      : cut.trimEnd() + '...'
  }

  // Trim experiences: max 4 positions, graduated bullet limits
  if (trimmed.experiences?.length > 0) {
    trimmed.experiences = trimmed.experiences
      .slice(0, MAX_POSITIONS)
      .map((exp: any, idx: number) => {
        const maxBullets = BULLETS_PER_POSITION[idx] ?? BULLETS_PER_POSITION[BULLETS_PER_POSITION.length - 1]
        if (exp.bullets?.length > maxBullets) {
          return { ...exp, bullets: exp.bullets.slice(0, maxBullets) }
        }
        return exp
      })
  }

  // Trim education
  if (trimmed.education?.length > MAX_EDUCATION) {
    trimmed.education = trimmed.education.slice(0, MAX_EDUCATION)
  }

  // Trim certifications
  if (trimmed.certifications?.length > MAX_CERTIFICATIONS) {
    trimmed.certifications = trimmed.certifications.slice(0, MAX_CERTIFICATIONS)
  }

  // Trim training
  if (trimmed.training?.length > MAX_TRAINING) {
    trimmed.training = trimmed.training.slice(0, MAX_TRAINING)
  }

  // Trim languages
  if (trimmed.languages?.length > MAX_LANGUAGES) {
    trimmed.languages = trimmed.languages.slice(0, MAX_LANGUAGES)
  }

  // Trim affiliations
  if (trimmed.affiliations?.length > MAX_AFFILIATIONS) {
    trimmed.affiliations = trimmed.affiliations.slice(0, MAX_AFFILIATIONS)
  }

  // Trim publications
  if (trimmed.publications?.length > MAX_PUBLICATIONS) {
    trimmed.publications = trimmed.publications.slice(0, MAX_PUBLICATIONS)
  }

  return trimmed
}

/**
 * Checks whether content exceeds federal trim thresholds.
 * Used by UI indicators to show warnings before export.
 */
export function estimateFederalOverflow(content: any): {
  isOverLimit: boolean
  experienceCount: number
  bulletCounts: number[]
  summaryLength: number
  educationCount: number
  certificationCount: number
} {
  const experiences = content?.experiences || []
  const bulletCounts = experiences.map((exp: any) =>
    (exp.bullets || []).filter((b: any) => b.status !== 'excluded').length
  )

  const isOverLimit =
    experiences.length > MAX_POSITIONS ||
    bulletCounts.some((count: number, idx: number) => {
      const max = BULLETS_PER_POSITION[idx] ?? BULLETS_PER_POSITION[BULLETS_PER_POSITION.length - 1]
      return count > max
    }) ||
    (content?.summary?.length || 0) > MAX_SUMMARY_CHARS ||
    (content?.education?.length || 0) > MAX_EDUCATION ||
    (content?.certifications?.length || 0) > MAX_CERTIFICATIONS ||
    (content?.training?.length || 0) > MAX_TRAINING ||
    (content?.affiliations?.length || 0) > MAX_AFFILIATIONS ||
    (content?.publications?.length || 0) > MAX_PUBLICATIONS

  return {
    isOverLimit,
    experienceCount: experiences.length,
    bulletCounts,
    summaryLength: content?.summary?.length || 0,
    educationCount: content?.education?.length || 0,
    certificationCount: content?.certifications?.length || 0,
  }
}
