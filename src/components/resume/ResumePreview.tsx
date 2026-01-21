'use client'

import { TemplateId } from '@/lib/templates'
import {
  formatPhoneForDisplay,
  formatDateRange,
  formatFullDegree,
  formatGraduationDate,
  getSchoolName,
  formatClearance,
} from '@/lib/utils/formatResume'
import { getProficiencyLabel } from '@/lib/constants/federalEligibility'

// Template-specific style configurations
const templateStyles: Record<TemplateId, {
  container: string
  headerAlign: string
  nameStyle: string
  sectionTitle: string
  fontFamily: string
  accentColor: string
}> = {
  clean: {
    container: '',
    headerAlign: 'text-center',
    nameStyle: 'text-2xl font-bold uppercase tracking-wide',
    sectionTitle: 'text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2',
    fontFamily: 'Georgia, serif',
    accentColor: '#1a1a1a',
  },
  federal: {
    container: '',
    headerAlign: 'text-left',
    nameStyle: 'text-xl font-bold uppercase',
    sectionTitle: 'text-sm font-bold uppercase bg-gray-100 px-2 py-1 mb-2 border-l-4 border-gray-800',
    fontFamily: 'Arial, sans-serif',
    accentColor: '#000000',
  },
  classic: {
    container: '',
    headerAlign: 'text-center',
    nameStyle: 'text-2xl font-bold',
    sectionTitle: 'text-sm font-bold uppercase text-center border-b-2 border-gray-800 pb-1 mb-3',
    fontFamily: 'Times New Roman, serif',
    accentColor: '#2c3e50',
  },
  modern: {
    container: '',
    headerAlign: 'text-left',
    nameStyle: 'text-3xl font-light tracking-wide',
    sectionTitle: 'text-xs font-bold uppercase tracking-widest text-blue-600 mb-2',
    fontFamily: 'Helvetica, Arial, sans-serif',
    accentColor: '#2563eb',
  },
  minimal: {
    container: '',
    headerAlign: 'text-left',
    nameStyle: 'text-xl font-medium tracking-wider',
    sectionTitle: 'text-xs uppercase tracking-widest text-gray-500 mb-2',
    fontFamily: 'Helvetica, Arial, sans-serif',
    accentColor: '#374151',
  },
  twocol: {
    container: 'grid grid-cols-3 gap-0',
    headerAlign: 'text-left',
    nameStyle: 'text-xl font-bold',
    sectionTitle: 'text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2',
    fontFamily: 'Helvetica, Arial, sans-serif',
    accentColor: '#059669',
  },
}

interface ResumePreviewProps {
  template: TemplateId
  resumeType: 'private' | 'federal'
  content: any
}

export function ResumePreview({ template, resumeType, content }: ResumePreviewProps) {
  const styles = templateStyles[template] || templateStyles.clean
  const isTwoColumn = template === 'twocol'
  const isFederal = template === 'federal' || resumeType === 'federal'

  // Two-column layout
  if (isTwoColumn) {
    return (
      <div className="bg-white text-black min-h-[800px]" style={{ fontFamily: styles.fontFamily }}>
        <div className="grid grid-cols-3">
          {/* Sidebar */}
          <div className="bg-gray-100 p-6">
            {/* Name in Sidebar */}
            <div className="mb-6">
              <h1 className={styles.nameStyle} style={{ color: styles.accentColor }}>
                {content.contact?.first_name} {content.contact?.last_name}
              </h1>
              <div className="text-xs text-gray-600 mt-2 space-y-1">
                {content.contact?.email && <div>{content.contact.email}</div>}
                {content.contact?.phone && <div>{formatPhoneForDisplay(content.contact.phone)}</div>}
                {content.contact?.city && <div>{content.contact.city}, {content.contact.state}</div>}
              </div>
            </div>

            {/* Skills in Sidebar */}
            {content.skills?.length > 0 && (
              <div className="mb-6">
                <h2 className={styles.sectionTitle}>Skills</h2>
                <ul className="text-sm space-y-1">
                  {content.skills.map((skill: any, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: styles.accentColor }}></span>
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Education in Sidebar */}
            {content.education?.length > 0 && (
              <div className="mb-6">
                <h2 className={styles.sectionTitle}>Education</h2>
                {content.education.map((edu: any, idx: number) => (
                  <div key={idx} className="mb-3 text-sm">
                    <div className="font-semibold">{formatFullDegree(edu)}</div>
                    <div className="text-gray-600">{getSchoolName(edu)}</div>
                    <div className="text-xs text-gray-500">
                      {formatGraduationDate(edu.graduation_month, edu.graduation_year, edu.graduation_date)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Certifications in Sidebar */}
            {content.certifications?.length > 0 && (
              <div className="mb-6">
                <h2 className={styles.sectionTitle}>Certifications</h2>
                <ul className="text-sm space-y-1">
                  {content.certifications.map((cert: any, idx: number) => (
                    <li key={idx}>{cert.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="col-span-2 p-6">
            {/* Summary */}
            {content.summary && (
              <div className="mb-6">
                <h2 className={styles.sectionTitle}>Professional Summary</h2>
                <p className="text-sm leading-relaxed">{content.summary}</p>
              </div>
            )}

            {/* Experience */}
            {content.experiences?.length > 0 && (
              <div className="mb-6">
                <h2 className={styles.sectionTitle}>Experience</h2>
                <div className="space-y-4">
                  {content.experiences.map((exp: any, idx: number) => (
                    <div key={idx} className="mb-4">
                      <div className="flex justify-between items-start">
                        <div className="font-bold">{exp.civilian_title || exp.job_title}</div>
                        <div className="text-sm text-gray-600">
                          {formatDateRange(exp.start_date, exp.end_date, exp.is_current, resumeType)}
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">{exp.organization}</div>
                      <ul className="mt-2 space-y-1">
                        {exp.bullets
                          ?.filter((bullet: any) => bullet.status !== 'excluded')
                          .map((bullet: any, bIdx: number) => (
                            <li key={bIdx} className="text-sm flex">
                              <span className="mr-2" style={{ color: styles.accentColor }}>•</span>
                              <span>{bullet.is_accepted || bullet.status === 'accepted' ? bullet.translated_text : (bullet.translated_text || bullet.original_text)}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Standard single-column layouts
  return (
    <div className="bg-white text-black rounded-lg shadow-lg p-8 min-h-[800px]" style={{ fontFamily: styles.fontFamily }}>
      {/* Header */}
      <div className={`${styles.headerAlign} mb-6 pb-4 border-b-2`} style={{ borderColor: styles.accentColor }}>
        <h1 className={styles.nameStyle} style={{ color: styles.accentColor }}>
          {content.contact?.first_name} {content.contact?.last_name}
        </h1>
        <div className="text-sm mt-2 text-gray-600">
          {content.contact?.city && `${content.contact.city}, ${content.contact.state}`}
          {content.contact?.phone && ` • ${formatPhoneForDisplay(content.contact.phone)}`}
          {content.contact?.email && ` • ${content.contact.email}`}
        </div>
        {content.contact?.linkedin_url && (
          <div className="text-sm text-gray-600">{content.contact.linkedin_url}</div>
        )}
      </div>

      {/* Summary */}
      {content.summary && (
        <div className="mb-6">
          <h2 className={styles.sectionTitle}>
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed">{content.summary}</p>
        </div>
      )}

      {/* Experience */}
      {content.experiences?.length > 0 && (
        <div className="mb-6">
          <h2 className={styles.sectionTitle}>
            Professional Experience
          </h2>
          <div className="space-y-4">
            {content.experiences.map((exp: any, idx: number) => {
              // Format location - prefer city/state for federal, fallback to location
              const locationDisplay = resumeType === 'federal' && (exp.city || exp.state)
                ? `${exp.city || ''}${exp.city && exp.state ? ', ' : ''}${exp.state || ''}`
                : exp.location

              // Format supervisor info
              const supervisorDisplay = exp.supervisor_name
                ? `${exp.supervisor_name}${exp.supervisor_phone ? `, ${formatPhoneForDisplay(exp.supervisor_phone)}` : ''}${exp.supervisor_can_contact === false ? ', do not contact' : ', may contact'}`
                : 'Available upon request'

              return (
                <div key={exp.id || idx} className="mb-4">
                  {/* Header row: Title and Date */}
                  <div className="flex justify-between items-start">
                    <div className="font-bold">
                      {exp.civilian_title || exp.job_title}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDateRange(exp.start_date, exp.end_date, exp.is_current, resumeType)}
                    </div>
                  </div>

                  {/* Organization and Location row */}
                  <div className="flex justify-between items-start">
                    <div className="text-sm">{exp.organization}</div>
                    <div className="text-sm text-gray-600">{locationDisplay}</div>
                  </div>

                  {/* Federal-specific details */}
                  {resumeType === 'federal' && (
                    <>
                      {/* Supervisor line */}
                      <div className="text-xs text-gray-600 mt-1">
                        Supervisor: {supervisorDisplay}
                      </div>

                      {/* Hours/Salary/Grade line */}
                      <div className="text-xs text-gray-600">
                        {exp.hours_per_week || 40} hours/week
                        {exp.salary && ` | ${exp.salary.startsWith('$') ? exp.salary : `$${exp.salary}`}${exp.salary.includes('/') ? '' : '/year'}`}
                        {exp.grade_level && ` | ${exp.grade_level}`}
                      </div>
                    </>
                  )}

                  {/* Bullets (filter out excluded) */}
                  <ul className="mt-2 space-y-1">
                    {exp.bullets
                      ?.filter((bullet: any) => bullet.status !== 'excluded')
                      .map((bullet: any, bIdx: number) => (
                        <li key={bullet.id || bIdx} className="text-sm flex">
                          <span className="mr-2" style={{ color: styles.accentColor }}>•</span>
                          <span>{bullet.is_accepted || bullet.status === 'accepted' ? bullet.translated_text : (bullet.translated_text || bullet.original_text)}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Education */}
      {content.education?.length > 0 && (
        <div className="mb-6">
          <h2 className={styles.sectionTitle}>
            Education
          </h2>
          <div className="space-y-2">
            {content.education.map((edu: any, idx: number) => (
              <div key={edu.id || idx} className="flex justify-between">
                <div>
                  <div className="font-bold">{formatFullDegree(edu)}</div>
                  <div className="text-sm">{getSchoolName(edu)}</div>
                </div>
                <div className="text-sm text-gray-600">
                  {formatGraduationDate(edu.graduation_month, edu.graduation_year, edu.graduation_date)}
                  {/* GPA: always show for federal, optional for private */}
                  {resumeType === 'federal' && <div>GPA: {edu.gpa || 'N/A'}</div>}
                  {resumeType === 'private' && edu.gpa && ` • GPA: ${edu.gpa}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {content.certifications?.length > 0 && (
        <div className="mb-6">
          <h2 className={styles.sectionTitle}>
            Certifications
          </h2>
          <div className="text-sm">
            {content.certifications.map((cert: any) => cert.name).join(' • ')}
          </div>
        </div>
      )}

      {/* Skills */}
      {content.skills?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
            Skills
          </h2>
          <div className="text-sm">
            {content.skills.map((skill: any) => skill.name).join(' • ')}
          </div>
        </div>
      )}

      {/* === FEDERAL-ONLY SECTIONS === */}
      {resumeType === 'federal' && (
        <>
          {/* Security Clearance */}
          {content.profile?.clearance && content.profile.clearance !== 'none' && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
                Security Clearance
              </h2>
              <div className="text-sm">{formatClearance(content.profile.clearance)}</div>
            </div>
          )}

          {/* Job-Related Training */}
          {content.training?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
                Job-Related Training
              </h2>
              <ul className="text-sm space-y-1">
                {content.training.map((t: any, idx: number) => (
                  <li key={t.id || idx} className="flex">
                    <span className="mr-2">•</span>
                    <span>
                      {t.name}
                      {t.provider && ` – ${t.provider}`}
                      {t.completion_date && ` (${t.completion_date})`}
                      {t.hours && ` – ${t.hours} hours`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Language Skills */}
          {content.languages?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
                Language Skills
              </h2>
              <ul className="text-sm space-y-1">
                {content.languages.map((lang: any, idx: number) => (
                  <li key={lang.id || idx} className="flex">
                    <span className="mr-2">•</span>
                    <span>{lang.language}: {getProficiencyLabel(lang.proficiency)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Professional Affiliations */}
          {content.affiliations?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
                Professional Affiliations
              </h2>
              <ul className="text-sm space-y-1">
                {content.affiliations.map((aff: any, idx: number) => (
                  <li key={aff.id || idx} className="flex">
                    <span className="mr-2">•</span>
                    <span>
                      {aff.name}
                      {aff.role && ` – ${aff.role}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Publications */}
          {content.publications?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
                Publications
              </h2>
              <ul className="text-sm space-y-1">
                {content.publications.map((pub: any, idx: number) => (
                  <li key={pub.id || idx} className="flex">
                    <span className="mr-2">•</span>
                    <span>
                      {pub.title}
                      {pub.publication && `, ${pub.publication}`}
                      {pub.date && ` (${pub.date})`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Special Hiring Authorities */}
          {content.profile?.special_eligibility?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
                Special Hiring Authorities
              </h2>
              <ul className="text-sm space-y-1">
                {content.profile.special_eligibility.map((elig: string, idx: number) => (
                  <li key={idx} className="flex">
                    <span className="mr-2">•</span>
                    <span>{elig}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  )
}
