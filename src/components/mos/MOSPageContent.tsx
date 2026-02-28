import Link from 'next/link'
import type { DictMilitaryJargon, DictBulletPattern, DictOnetCrosswalk } from '@/lib/dictionary/types'

// ============================================================================
// Branch Badge
// ============================================================================

const BRANCH_COLORS: Record<string, string> = {
  'Army': 'bg-green-900/40 text-green-400 border-green-700/50',
  'Navy': 'bg-blue-900/40 text-blue-400 border-blue-700/50',
  'Air Force': 'bg-sky-900/40 text-sky-400 border-sky-700/50',
  'Marines': 'bg-red-900/40 text-red-400 border-red-700/50',
  'Coast Guard': 'bg-orange-900/40 text-orange-400 border-orange-700/50',
  'Space Force': 'bg-indigo-900/40 text-indigo-400 border-indigo-700/50',
}

export function BranchBadge({ branch }: { branch: string }) {
  const colors = BRANCH_COLORS[branch] || 'bg-bg-secondary text-text-muted border-border'
  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-mono font-semibold uppercase tracking-wider border rounded ${colors}`}>
      {branch}
    </span>
  )
}

// ============================================================================
// Dictionary Terms Table
// ============================================================================

export function DictionaryTermsTable({ terms }: { terms: DictMilitaryJargon[] }) {
  if (!terms.length) return null

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-heading font-semibold uppercase tracking-wider text-text-muted text-xs">Military Term</th>
            <th className="text-left py-3 px-4 font-heading font-semibold uppercase tracking-wider text-text-muted text-xs">Civilian Equivalent</th>
            <th className="text-left py-3 px-4 font-heading font-semibold uppercase tracking-wider text-text-muted text-xs hidden md:table-cell">Category</th>
          </tr>
        </thead>
        <tbody>
          {terms.map((term) => (
            <tr key={term.id} className="border-b border-border/50 hover:bg-bg-secondary/50 transition-colors">
              <td className="py-3 px-4 font-mono text-gold">{term.military_term}</td>
              <td className="py-3 px-4 text-text">{term.civilian_equivalent}</td>
              <td className="py-3 px-4 text-text-dim hidden md:table-cell">{term.category || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Bullet Before/After Card
// ============================================================================

export function BulletBeforeAfter({ pattern }: { pattern: DictBulletPattern }) {
  if (!pattern.example_military || !pattern.example_output) return null

  return (
    <div className="bg-bg-secondary/50 border border-border rounded-lg p-5 hover:border-gold/30 transition-all">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-[10px] uppercase tracking-wider text-text-dim bg-bg-tertiary px-2 py-0.5 rounded">
          {pattern.category}
        </span>
      </div>
      <div className="space-y-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-status-red mb-1.5">Before (Military)</div>
          <p className="text-sm text-text-muted leading-relaxed italic">&ldquo;{pattern.example_military}&rdquo;</p>
        </div>
        <div className="border-t border-border/50 pt-3">
          <div className="font-mono text-[10px] uppercase tracking-wider text-status-green mb-1.5">After (Civilian)</div>
          <p className="text-sm text-text leading-relaxed">&ldquo;{pattern.example_output}&rdquo;</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Career Path Card
// ============================================================================

interface CareerPathProps {
  title: string
  industry?: string
  onetTitle?: string
  onetCode?: string
  socTitle?: string
}

export function CareerPathCard({ title, industry, onetTitle, onetCode, socTitle }: CareerPathProps) {
  return (
    <div className="bg-bg-secondary/50 border border-border rounded-lg p-5 hover:border-gold/30 transition-all">
      <h4 className="font-heading text-base font-bold text-text mb-1">{title}</h4>
      {onetTitle && onetTitle !== title && (
        <p className="text-sm text-gold mb-1">{onetTitle}</p>
      )}
      {socTitle && (
        <p className="text-xs text-text-dim mb-2">SOC: {socTitle}</p>
      )}
      {industry && (
        <span className="inline-block text-xs font-mono text-text-muted bg-bg-tertiary px-2 py-0.5 rounded mr-1 mb-1">
          {industry}
        </span>
      )}
      {onetCode && (
        <span className="inline-block text-xs font-mono text-text-dim bg-bg-tertiary px-2 py-0.5 rounded">
          O*NET {onetCode}
        </span>
      )}
    </div>
  )
}

// ============================================================================
// Skills Tag List
// ============================================================================

export function SkillsTags({ skills }: { skills: string[] }) {
  if (!skills.length) return null

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span
          key={skill}
          className="px-3 py-1.5 text-xs font-mono bg-gold-dim text-gold border border-gold/20 rounded"
        >
          {skill}
        </span>
      ))}
    </div>
  )
}

// ============================================================================
// Section Header (reusable for page sections)
// ============================================================================

export function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <div className="inline-block font-mono text-[11px] uppercase tracking-wider text-gold bg-gold-dim px-4 py-2 mb-4">
        {badge}
      </div>
      <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-tight mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base text-text-muted max-w-2xl">{subtitle}</p>
      )}
    </div>
  )
}

// ============================================================================
// CTA Block
// ============================================================================

export function CTABlock({ code, title }: { code: string; title: string }) {
  return (
    <section className="bg-bg-secondary border-t border-border px-4 md:px-12 py-16 md:py-20 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-gold-dim border border-gold mb-6">
          <span className="text-gold text-[8px]">&#9670;</span>
          <span className="font-mono text-xs text-gold">BEGIN YOUR TRANSITION</span>
        </div>
        <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
          Build Your Free <span className="text-gold">{code.toUpperCase()}</span> Resume
        </h2>
        <p className="text-base text-text-muted mb-8 leading-relaxed">
          Translate your {title} experience into a resume that civilian hiring managers understand.
          Our AI-powered tools handle the translation — you just tell your story.
        </p>
        <Link
          href="/signup"
          className="inline-block px-8 py-4 font-heading text-base font-bold uppercase tracking-wider bg-gold text-bg-primary hover:bg-gold-bright rounded transition-all"
        >
          Start Free &rarr;
        </Link>
      </div>
    </section>
  )
}

// ============================================================================
// Breadcrumb
// ============================================================================

export function Breadcrumb({ branch, code, title }: { branch: string; code: string; title: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-xs font-mono text-text-muted flex-wrap">
        <li>
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
        </li>
        <li className="text-text-dim">/</li>
        <li>
          <Link href="/mos" className="hover:text-gold transition-colors">MOS Guide</Link>
        </li>
        <li className="text-text-dim">/</li>
        <li className="text-text-dim">{branch}</li>
        <li className="text-text-dim">/</li>
        <li className="text-gold">{code.toUpperCase()} — {title}</li>
      </ol>
    </nav>
  )
}

// ============================================================================
// Marketing Footer (shared across marketing pages)
// ============================================================================

export function MarketingFooter() {
  return (
    <footer className="bg-bg-secondary border-t border-border px-4 md:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-gold flex items-center justify-center">
              <span className="font-heading font-bold text-gold text-sm">D</span>
            </div>
            <span className="font-heading text-sm font-bold tracking-wider uppercase">Debriefed</span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link href="/about" className="text-text-muted hover:text-gold transition-colors">About</Link>
            <Link href="/help" className="text-text-muted hover:text-gold transition-colors">Help</Link>
            <Link href="/privacy" className="text-text-muted hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-text-muted hover:text-gold transition-colors">Terms of Service</Link>
          </div>

          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Debriefed. All rights reserved.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-text-dim text-center leading-relaxed">
            This site incorporates information from{' '}
            <a href="https://www.onetcenter.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-text-muted transition-colors">
              O*NET Web Services
            </a>{' '}
            by the U.S. Department of Labor, Employment and Training Administration (USDOL/ETA).
            O*NET® is a trademark of USDOL/ETA.
          </p>
        </div>
      </div>
    </footer>
  )
}

// ============================================================================
// Helper: build career path cards from MOS data + crosswalk
// ============================================================================

export function buildCareerPaths(
  civilianTitles: string[],
  industries: string[],
  crosswalk: DictOnetCrosswalk[]
): CareerPathProps[] {
  const paths: CareerPathProps[] = []
  const seen = new Set<string>()

  // First, enrich civilian titles with O*NET data where available
  for (const title of civilianTitles.slice(0, 5)) {
    const match = crosswalk.find(
      (c) => c.onet_title && c.onet_title.toLowerCase().includes(title.toLowerCase().split(' ')[0])
    )
    const key = title.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      paths.push({
        title,
        industry: industries[0] || undefined,
        onetTitle: match?.onet_title || undefined,
        onetCode: match?.onet_code || undefined,
        socTitle: match?.soc_title || undefined,
      })
    }
  }

  // Add unique O*NET titles not already covered
  for (const c of crosswalk) {
    if (paths.length >= 5) break
    const key = (c.onet_title || c.moc_title).toLowerCase()
    if (!seen.has(key) && c.onet_title) {
      seen.add(key)
      paths.push({
        title: c.onet_title,
        onetCode: c.onet_code || undefined,
        socTitle: c.soc_title || undefined,
      })
    }
  }

  return paths.slice(0, 5)
}
