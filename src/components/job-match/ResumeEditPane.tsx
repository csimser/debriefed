'use client'

import { TailoredResume, AnalysisResult, BulletSuggestion } from './JobMatchWorkspace'

// Format degree type to display name
function formatDegreeType(degreeType: string | undefined): string {
  if (!degreeType) return ''

  const degreeMap: Record<string, string> = {
    'high_school': 'High School Diploma',
    'ged': 'GED',
    'associate': "Associate's Degree",
    'associates': "Associate's Degree",
    'bachelor': "Bachelor's Degree",
    'bachelors': "Bachelor's Degree",
    'master': "Master's Degree",
    'masters': "Master's Degree",
    'doctorate': 'Doctorate',
    'phd': 'Ph.D.',
    'md': 'M.D.',
    'jd': 'J.D.',
    'mba': 'MBA',
  }

  const lower = degreeType.toLowerCase().replace(/[''`]/g, '').replace(/\s+degree/i, '')
  return degreeMap[lower] || degreeType
}

interface ResumeEditPaneProps {
  resume: any
  tailoredResume: TailoredResume | null
  analysis: AnalysisResult | null
  onApplyBullet: (suggestion: BulletSuggestion) => void
  onExcludeBullet: (expIdx: number, bulletIdx: number) => void
  onAddSkill: (skillName: string) => void
  onRemoveSkill: (skillName: string) => void
}

export function ResumeEditPane({
  resume,
  tailoredResume,
  analysis,
  onApplyBullet,
  onExcludeBullet,
  onAddSkill,
  onRemoveSkill,
}: ResumeEditPaneProps) {
  // Use tailored content if available, otherwise use original
  const content = tailoredResume?.content || resume?.content || {}

  const matchedSkills = analysis?.categoryDetails?.skills?.matched || []
  const missingSkills = analysis?.categoryDetails?.skills?.missing || []
  const skillsToAdd = analysis?.skillChanges?.add || []
  const skillsToRemove = analysis?.skillChanges?.remove || []

  // Find suggestion for a specific bullet
  const getSuggestion = (expIdx: number, bulletIdx: number): BulletSuggestion | undefined => {
    return analysis?.bulletSuggestions?.find(
      s => s.experienceIndex === expIdx && s.bulletIndex === bulletIdx
    )
  }

  // Check if a bullet has been applied
  const isBulletApplied = (expIdx: number, bulletIdx: number): boolean => {
    return tailoredResume?.appliedBullets.has(`${expIdx}-${bulletIdx}`) || false
  }

  // Check if a bullet is excluded
  const isBulletExcluded = (expIdx: number, bulletIdx: number): boolean => {
    return tailoredResume?.excludedBullets.has(`${expIdx}-${bulletIdx}`) || false
  }

  // Check if a skill was added
  const isSkillAdded = (skillName: string): boolean => {
    return tailoredResume?.addedSkills.includes(skillName) || false
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-border bg-bg-tertiary flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-heading text-xs font-semibold uppercase tracking-wider">Your Resume</span>
          {tailoredResume && (
            <span className="text-xs text-gold px-2 py-0.5 bg-gold/10 rounded">
              Tailoring Mode
            </span>
          )}
        </div>
        {analysis && (
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-status-green"></span> Matched
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-status-amber"></span> Suggestion Available
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gold"></span> Applied
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 bg-bg-primary">
        {!resume ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-text-muted">Select a resume to preview</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Professional Summary */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="font-heading text-xs font-semibold uppercase tracking-wider text-gold">
                  Professional Summary
                </span>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">
                {content.summary || 'No summary added'}
              </p>
            </div>

            {/* Experience */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="font-heading text-xs font-semibold uppercase tracking-wider text-gold">
                  Experience
                </span>
              </div>
              {content.experiences?.map((exp: any, expIdx: number) => (
                <div key={expIdx} className="mb-6 last:mb-0">
                  <div className="font-semibold text-sm">{exp.civilian_title || exp.job_title}</div>
                  <div className="text-xs text-text-muted mb-2">
                    {exp.organization} • {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                  </div>
                  <ul className="space-y-2">
                    {exp.bullets?.map((bullet: any, bulletIdx: number) => {
                      const text = bullet.translated_text || bullet.original_text
                      const suggestion = getSuggestion(expIdx, bulletIdx)
                      const isApplied = isBulletApplied(expIdx, bulletIdx)
                      const isExcluded = isBulletExcluded(expIdx, bulletIdx)
                      const hasSuggestion = suggestion?.action === 'rewrite' && suggestion.suggested

                      return (
                        <li
                          key={bulletIdx}
                          className={`p-2 rounded text-sm ${
                            isExcluded
                              ? 'bg-status-red/10 border border-status-red/20 line-through opacity-50'
                              : isApplied
                              ? 'bg-gold/10 border border-gold/20'
                              : hasSuggestion
                              ? 'bg-status-amber/5 border border-status-amber/20'
                              : 'border border-transparent'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-text-muted flex-1">
                              {isApplied && suggestion?.suggested ? (
                                <span className="text-text">{suggestion.suggested}</span>
                              ) : (
                                text
                              )}
                            </span>
                            {analysis && (
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {isApplied && (
                                  <span className="text-gold text-xs">✓ Applied</span>
                                )}
                                {isExcluded && (
                                  <span className="text-status-red text-xs">Excluded</span>
                                )}
                                {!isApplied && !isExcluded && hasSuggestion && (
                                  <button
                                    onClick={() => onApplyBullet(suggestion)}
                                    className="px-2 py-0.5 text-xs bg-gold text-bg-primary rounded hover:bg-gold-bright"
                                  >
                                    Rewrite
                                  </button>
                                )}
                                {!isApplied && !isExcluded && suggestion?.action === 'exclude' && (
                                  <button
                                    onClick={() => onExcludeBullet(expIdx, bulletIdx)}
                                    className="px-2 py-0.5 text-xs bg-status-red/20 text-status-red rounded hover:bg-status-red/30"
                                  >
                                    Exclude
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Show suggestion preview */}
                          {hasSuggestion && !isApplied && !isExcluded && (
                            <div className="mt-2 pt-2 border-t border-border/50">
                              <div className="text-xs text-status-amber mb-1">Suggested rewrite:</div>
                              <div className="text-xs text-text-muted italic">{suggestion?.suggested}</div>
                              {suggestion?.keywordsAdded?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {suggestion.keywordsAdded.map((kw, idx) => (
                                    <span key={idx} className="text-xs px-1 py-0.5 bg-gold/20 text-gold rounded">
                                      +{kw}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="font-heading text-xs font-semibold uppercase tracking-wider text-gold">
                  Skills
                </span>
                {analysis && (
                  <span className="text-xs text-text-muted">
                    {matchedSkills.length} matched • {missingSkills.length} missing
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {/* Existing skills */}
                {content.skills?.map((skill: any, idx: number) => {
                  const isMatched = matchedSkills.some(s =>
                    s.toLowerCase() === skill.name?.toLowerCase()
                  )
                  const shouldRemove = skillsToRemove.some(s =>
                    s.toLowerCase() === skill.name?.toLowerCase()
                  )
                  const wasAdded = isSkillAdded(skill.name)

                  return (
                    <div key={idx} className="relative group">
                      <span
                        className={`px-3 py-1 text-xs rounded ${
                          wasAdded
                            ? 'bg-gold/20 text-gold border border-gold/30'
                            : isMatched
                            ? 'bg-status-green/20 text-status-green border border-status-green/30'
                            : shouldRemove
                            ? 'bg-status-red/10 text-status-red border border-status-red/20'
                            : 'bg-bg-tertiary text-text-muted'
                        }`}
                      >
                        {wasAdded && '+ '}
                        {skill.name}
                      </span>
                      {shouldRemove && !tailoredResume?.removedSkills.includes(skill.name) && (
                        <button
                          onClick={() => onRemoveSkill(skill.name)}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-status-red text-white rounded-full text-xs hidden group-hover:flex items-center justify-center"
                          title="Remove irrelevant skill"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  )
                })}

                {/* Skills to add */}
                {analysis && skillsToAdd.map((skillName, idx) => {
                  const alreadyAdded = content.skills?.some((s: any) =>
                    s.name?.toLowerCase() === skillName.toLowerCase()
                  )
                  if (alreadyAdded) return null

                  return (
                    <button
                      key={`add-${idx}`}
                      onClick={() => onAddSkill(skillName)}
                      className="px-3 py-1 text-xs rounded bg-status-amber/20 text-status-amber border border-status-amber/30 hover:bg-status-amber/30"
                    >
                      + {skillName}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Education */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="font-heading text-xs font-semibold uppercase tracking-wider text-gold">
                  Education
                </span>
                {analysis?.categoryDetails?.education && (
                  <span className={`text-xs ${
                    analysis.categoryDetails.education.meetsRequirement
                      ? 'text-status-green'
                      : 'text-status-amber'
                  }`}>
                    {analysis.categoryDetails.education.meetsRequirement ? '✓ Meets requirement' : '⚠ May not meet requirement'}
                  </span>
                )}
              </div>
              {content.education?.map((edu: any, idx: number) => {
                const degree = formatDegreeType(edu.degree || edu.degree_type)
                const field = edu.field_of_study || ''
                const school = edu.institution || edu.school_name || ''

                return (
                  <div key={idx} className="mb-2 last:mb-0">
                    <div className="font-semibold text-sm">
                      {degree}{field ? ` in ${field}` : ''}
                    </div>
                    {school && <div className="text-xs text-text-muted">{school}</div>}
                    {(edu.graduation_date || edu.graduation_year) && (
                      <div className="text-xs text-text-muted">
                        Graduated: {edu.graduation_date || (edu.graduation_month ? `${edu.graduation_month}/` : '')}{edu.graduation_year}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Certifications */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-heading text-xs font-semibold uppercase tracking-wider text-gold">
                  Certifications
                </span>
                {analysis?.categoryDetails?.certifications && (
                  <span className="text-xs text-text-muted">
                    {analysis.categoryDetails.certifications.matched?.length || 0} matched
                    {((analysis.categoryDetails.certifications.missingRequired?.length || 0) + (analysis.categoryDetails.certifications.missingPreferred?.length || 0) + (analysis.categoryDetails.certifications.missing?.length || 0)) > 0 &&
                      ` • ${(analysis.categoryDetails.certifications.missingRequired?.length || 0) + (analysis.categoryDetails.certifications.missingPreferred?.length || 0) + (analysis.categoryDetails.certifications.missing?.length || 0)} missing`}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {content.certifications?.map((cert: any, idx: number) => {
                  const isMatched = analysis?.categoryDetails?.certifications?.matched?.some(c =>
                    c.toLowerCase() === cert.name?.toLowerCase()
                  )
                  return (
                    <span
                      key={idx}
                      className={`px-3 py-1 text-xs rounded ${
                        isMatched
                          ? 'bg-status-green/20 text-status-green border border-status-green/30'
                          : 'bg-bg-tertiary text-text-muted'
                      }`}
                    >
                      {cert.name}
                    </span>
                  )
                })}
                {/* Show missing certifications */}
                {analysis?.categoryDetails?.certifications?.missing?.map((certName, idx) => (
                  <span
                    key={`missing-${idx}`}
                    className="px-3 py-1 text-xs rounded bg-status-amber/20 text-status-amber border border-status-amber/30"
                  >
                    Missing: {certName}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
