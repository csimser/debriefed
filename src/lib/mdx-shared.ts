/**
 * Blog types + category metadata shared between the build-time MDX reader
 * (lib/mdx.ts, Node-only) and client components. Must stay free of Node
 * imports.
 */

export type PostCategory =
  | 'mos-transition'
  | 'resume-tips'
  | 'skillbridge'
  | 'federal-resume'
  | 'veteran-hiring'

export interface PostMeta {
  slug: string
  title: string
  description: string
  date: string
  category: PostCategory
  tags: string[]
  author: string
  readingTime: string
  featured?: boolean
  mosCode?: string      // links post to a MOS page (e.g. "11B")
  targetJob?: string    // e.g. "cybersecurity analyst"
}

export interface Post extends PostMeta {
  content: string
}

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  'mos-transition': 'MOS Transition Guides',
  'resume-tips': 'Resume Tips',
  skillbridge: 'SkillBridge',
  'federal-resume': 'Federal Resume',
  'veteran-hiring': 'Veteran Hiring Programs',
}

export const CATEGORY_DESCRIPTIONS: Record<PostCategory, string> = {
  'mos-transition': 'Step-by-step guides for translating your MOS into civilian career paths',
  'resume-tips': 'How to write resumes that actually get past ATS and into human hands',
  skillbridge: 'Maximize your DoD SkillBridge internship and land the job',
  'federal-resume': 'Navigate USAJOBS and write federal resumes that score high on assessments',
  'veteran-hiring': 'Veterans\' preference, VEOA, VRA, Schedule A, and hiring authorities explained',
}
