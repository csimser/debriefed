import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const CONTENT_DIR = path.join(process.cwd(), 'content/blog')

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

function parseFrontmatter(slug: string): PostMeta | null {
  const fullPath = path.join(CONTENT_DIR, `${slug}.mdx`)
  if (!fs.existsSync(fullPath)) return null

  const raw = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(raw)
  const rt = readingTime(content)

  return {
    slug,
    title: data.title ?? '',
    description: data.description ?? '',
    date: data.date ?? '',
    category: data.category ?? 'resume-tips',
    tags: data.tags ?? [],
    author: data.author ?? 'Debriefed Team',
    readingTime: rt.text,
    featured: data.featured ?? false,
    mosCode: data.mosCode,
    targetJob: data.targetJob,
  }
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'))
  const posts = files
    .map((f) => parseFrontmatter(f.replace(/\.mdx$/, '')))
    .filter(Boolean) as PostMeta[]

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostsByCategory(category: PostCategory): PostMeta[] {
  return getAllPosts().filter((p) => p.category === category)
}

export function getFeaturedPosts(): PostMeta[] {
  return getAllPosts().filter((p) => p.featured).slice(0, 3)
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(CONTENT_DIR, `${slug}.mdx`)
  if (!fs.existsSync(fullPath)) return null

  const raw = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(raw)
  const rt = readingTime(content)

  return {
    slug,
    title: data.title ?? '',
    description: data.description ?? '',
    date: data.date ?? '',
    category: data.category ?? 'resume-tips',
    tags: data.tags ?? [],
    author: data.author ?? 'Debriefed Team',
    readingTime: rt.text,
    featured: data.featured ?? false,
    mosCode: data.mosCode,
    targetJob: data.targetJob,
    content,
  }
}

export function getRelatedPosts(slug: string, limit = 3): PostMeta[] {
  const current = getPostBySlug(slug)
  if (!current) return []

  return getAllPosts()
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      score:
        (p.category === current.category ? 2 : 0) +
        (p.mosCode && p.mosCode === current.mosCode ? 3 : 0) +
        p.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.post)
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
