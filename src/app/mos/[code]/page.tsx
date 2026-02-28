import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllMOSCodes, getMOSPageData } from '@/lib/mos-page-data'
import { MarketingNav } from '@/components/layout/MarketingNav'
import { TranslationDemo } from '@/components/landing/TranslationDemo'
import {
  Breadcrumb,
  BranchBadge,
  SectionHeader,
  SkillsTags,
  DictionaryTermsTable,
  BulletBeforeAfter,
  CareerPathCard,
  CTABlock,
  MarketingFooter,
  buildCareerPaths,
} from '@/components/mos/MOSPageContent'

// ============================================================================
// Static generation
// ============================================================================

export async function generateStaticParams() {
  const codes = await getAllMOSCodes()
  return codes.map((entry) => ({ code: entry.code }))
}

// ============================================================================
// Metadata
// ============================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>
}): Promise<Metadata> {
  const { code } = await params
  const data = await getMOSPageData(code)

  if (!data) {
    return { title: 'MOS Not Found — Debriefed' }
  }

  const { mos, allBranchRecords } = data
  const branches = allBranchRecords.map((r) => r.branch).join(', ')
  const title = `How to translate your ${mos.military_title} (${mos.military_code}) experience to a civilian resume — Debriefed`
  const description = `${branches} ${mos.military_code} (${mos.military_title}) to civilian career guide. Explore civilian job titles, O*NET crosswalk data, resume bullet translations, and skills mapping. Free military-to-civilian translation tools.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://getdebriefed.co/mos/${code.toLowerCase()}`,
    },
  }
}

// ============================================================================
// Page Component
// ============================================================================

export default async function MOSPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const data = await getMOSPageData(code)

  if (!data) {
    notFound()
  }

  const { mos, allBranchRecords, crosswalk, jargon, bulletPatterns } = data
  const isMultiBranch = allBranchRecords.length > 1
  const allBranches = allBranchRecords.map((r) => r.branch)

  // Merge data from all branch records (deduplicated)
  const allCivilianTitles = [...new Set(allBranchRecords.flatMap((r) => r.civilian_titles || []))]
  const allIndustries = [...new Set(allBranchRecords.flatMap((r) => r.industries || []))]
  const allSkills = [...new Set(allBranchRecords.flatMap((r) => r.key_skills || []))]

  const careerPaths = buildCareerPaths(allCivilianTitles, allIndustries, crosswalk)

  // JSON-LD structured data (Schema.org Occupation)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Occupation',
    name: mos.military_title,
    alternateName: mos.military_code,
    description: mos.description,
    occupationalCategory: allIndustries[0] || 'Military',
    skills: allSkills.join(', ') || '',
    qualifications: `${allBranches.join(', ')} ${mos.military_code}`,
    ...(crosswalk.length > 0 && {
      occupationLocation: {
        '@type': 'Country',
        name: 'United States',
      },
    }),
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <MarketingNav currentPage={undefined} />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Header Section */}
        <section className="px-4 md:px-12 py-10 md:py-16 relative overflow-hidden">
          {/* Grid Background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(90deg, #2a3040 1px, transparent 1px), linear-gradient(#2a3040 1px, transparent 1px)',
              backgroundSize: '80px 80px',
              maskImage: 'radial-gradient(ellipse 60% 60% at 30% 50%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 30% 50%, black, transparent)',
            }}
          />

          <div className="max-w-5xl mx-auto relative z-10">
            <Breadcrumb branch={mos.branch} code={mos.military_code} title={mos.military_title} />

            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {allBranches.map((branch) => (
                <BranchBadge key={branch} branch={branch} />
              ))}
              <span className="font-mono text-xs text-text-dim">{mos.military_code}</span>
            </div>

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-wide leading-tight mb-6">
              Translating Your{' '}
              <span className="text-gold">{mos.military_code} {mos.military_title}</span>{' '}
              Experience to a Civilian Resume
            </h1>

            {mos.description && (
              <p className="text-base md:text-lg text-text-muted max-w-3xl leading-relaxed">
                {mos.description}
              </p>
            )}
          </div>
        </section>

        {/* About This Role */}
        <section className="px-4 md:px-12 py-12 border-t border-border">
          <div className="max-w-5xl mx-auto">
            <SectionHeader
              badge="Role Overview"
              title="About This Role"
              subtitle={`Key skills and qualifications for ${allBranches.join(' / ')} ${mos.military_code} personnel transitioning to civilian careers.`}
            />

            {/* Skills Tags */}
            {allSkills.length > 0 && (
              <div className="mb-8">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-text-muted mb-3">Key Skills</h3>
                <SkillsTags skills={allSkills} />
              </div>
            )}

            {/* Industries */}
            {allIndustries.length > 0 && (
              <div className="mb-8">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-text-muted mb-3">Target Industries</h3>
                <div className="flex flex-wrap gap-2">
                  {allIndustries.map((ind) => (
                    <span key={ind} className="px-3 py-1.5 text-xs font-mono bg-bg-secondary text-text-muted border border-border rounded">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Civilian Titles */}
            {allCivilianTitles.length > 0 && (
              <div>
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-text-muted mb-3">Civilian Job Titles</h3>
                <div className="flex flex-wrap gap-2">
                  {allCivilianTitles.map((title) => (
                    <span key={title} className="px-3 py-1.5 text-xs font-mono bg-gold-dim text-gold border border-gold/20 rounded">
                      {title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Military Jargon Translation Table */}
        {jargon.length > 0 && (
          <section className="px-4 md:px-12 py-12 bg-bg-secondary border-t border-border">
            <div className="max-w-5xl mx-auto">
              <SectionHeader
                badge="Translation Guide"
                title="Common Military Terms & Civilian Equivalents"
                subtitle={`Terms frequently used by ${allBranches.join(' / ')} personnel and their civilian translations for resumes and interviews.`}
              />
              <div className="bg-bg-primary border border-border rounded-lg overflow-hidden">
                <DictionaryTermsTable terms={jargon} />
              </div>
            </div>
          </section>
        )}

        {/* Resume Bullet Examples */}
        {bulletPatterns.length > 0 && (
          <section className="px-4 md:px-12 py-12 border-t border-border">
            <div className="max-w-5xl mx-auto">
              <SectionHeader
                badge="Resume Examples"
                title="Resume Bullet Translations"
                subtitle="See how military achievements translate to civilian resume language."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bulletPatterns.map((bp) => (
                  <BulletBeforeAfter key={bp.id} pattern={bp} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Translation Demo */}
        <div className="border-t border-border">
          <TranslationDemo />
        </div>

        {/* Civilian Career Paths */}
        {careerPaths.length > 0 && (
          <section className="px-4 md:px-12 py-12 border-t border-border">
            <div className="max-w-5xl mx-auto">
              <SectionHeader
                badge="Career Paths"
                title="Civilian Career Paths"
                subtitle={`Career opportunities for ${mos.military_code} ${mos.military_title} veterans, enriched with O*NET occupation data.`}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {careerPaths.map((path) => (
                  <CareerPathCard key={path.title} {...path} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* CTA Block */}
      <CTABlock code={mos.military_code} title={mos.military_title} />

      <MarketingFooter />
    </div>
  )
}
