'use client'

import { TemplateId, resolveTemplate } from '@/lib/templates'
import {
  formatPhoneForDisplay,
  formatDateRange,
  formatFullDegree,
  formatGraduationDate,
  getSchoolName,
  formatClearance,
} from '@/lib/utils/formatResume'
import { getProficiencyLabel } from '@/lib/constants/federalEligibility'

// Federal field label maps (match form option values → display labels)
const CITIZENSHIP_LABELS: Record<string, string> = {
  us_citizen: 'United States',
  permanent_resident: 'Permanent Resident',
  other: 'Other',
}

const VETERANS_PREF_LABELS: Record<string, string> = {
  none: 'No Preference',
  '5_point': '5-Point (TP)',
  '10_point': '10-Point (CP/CPS/XP)',
  '10_point_30_percent': '10-Point/30% Disabled',
}

function formatFederalLabel(value: string, labels: Record<string, string>): string {
  return labels[value] || value
}

interface ResumePreviewProps {
  template: TemplateId
  resumeType: 'private' | 'federal'
  content: any
}

// Filter out placeholder/empty bullets from rendering
function isPlaceholderBullet(text: string): boolean {
  if (!text || text.trim() === '') return true
  const lower = text.trim().toLowerCase()
  return (
    lower.includes('new bullet') ||
    lower.includes('click to edit') ||
    lower.includes('[x]')
  )
}

export function ResumePreview({ template: rawTemplate, resumeType, content }: ResumePreviewProps) {
  const template = resolveTemplate(rawTemplate)

  // Helper: get bullet text
  const getBulletText = (bullet: any) =>
    bullet.status === 'accepted' ? bullet.translated_text : (bullet.translated_text || bullet.original_text)

  // Filter bullets: remove excluded + placeholder/empty text
  const filterBullets = (bullets: any[] | undefined) =>
    (bullets || []).filter((b: any) => {
      if (b.status === 'excluded') return false
      const text = getBulletText(b)
      return !isPlaceholderBullet(text)
    })

  // Shorten LinkedIn URL for display (strip protocol + www)
  const shortLinkedIn = content.contact?.linkedin_url
    ? content.contact.linkedin_url.replace(/^https?:\/\/(www\.)?/, '')
    : null

  // Contact info parts
  const contactParts = [
    content.contact?.email,
    content.contact?.phone && formatPhoneForDisplay(content.contact.phone),
    content.contact?.city && `${content.contact.city}, ${content.contact.state}`,
    shortLinkedIn,
  ].filter(Boolean)

  // =========================================
  // TEMPLATE 1: EXECUTIVE
  // =========================================
  if (template === 'executive') {
    return (
      <div className="bg-white text-black min-h-[800px]" style={{ fontFamily: '"Source Sans 3", "Source Sans Pro", Helvetica, Arial, sans-serif' }}>
        {/* Header — full width */}
        <div style={{ padding: '32px 48px 16px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', fontSize: 30, fontWeight: 700, color: '#1a2a44', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
            {content.contact?.first_name} {content.contact?.last_name}
          </h1>
          {content.target?.role && (
            <div style={{ fontSize: 11, fontWeight: 600, color: '#8a7a5a', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: 4 }}>
              {content.target.role}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'nowrap', gap: 10, fontSize: 9.5, color: '#555', marginTop: 8, overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {contactParts.map((part, i) => <span key={i}>{part}</span>)}
          </div>
          <div style={{ width: '100%', height: 1, backgroundColor: '#b8943e', marginTop: 10 }} />
        </div>

        {/* Two columns */}
        <div style={{ display: 'flex' }}>
          {/* Main column: Summary + Experience */}
          <div style={{ flex: 1, padding: '20px 24px 24px 48px' }}>
            {/* Professional Summary */}
            {content.summary && (
              <div style={{ marginBottom: 18 }}>
                <h2 style={{ fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', fontSize: 10, fontWeight: 700, color: '#1a2a44', textTransform: 'uppercase', letterSpacing: '1.2px', borderBottom: '1px solid #b8943e', paddingBottom: 4, marginBottom: 8, marginTop: 0 }}>
                  Professional Summary
                </h2>
                <p style={{ fontSize: 10.5, lineHeight: 1.6, color: '#333', margin: 0 }}>{content.summary}</p>
              </div>
            )}

            {/* Professional Experience */}
            {content.experiences?.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <h2 style={{ fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', fontSize: 10, fontWeight: 700, color: '#1a2a44', textTransform: 'uppercase', letterSpacing: '1.2px', borderBottom: '1px solid #b8943e', paddingBottom: 4, marginBottom: 8, marginTop: 0 }}>
                  Professional Experience
                </h2>
                <div>
                  {content.experiences.map((exp: any, idx: number) => (
                    <div key={exp.id || idx} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ fontSize: 11.5, fontWeight: 600, color: '#1a2a44' }}>
                          {exp.civilian_title || exp.job_title}
                        </div>
                        <div style={{ fontSize: 10, color: '#777', fontWeight: 500, flexShrink: 0, marginLeft: 8 }}>
                          {formatDateRange(exp.start_date, exp.end_date, exp.is_current, resumeType)}
                        </div>
                      </div>
                      <div style={{ fontSize: 10.5, color: '#666', fontStyle: 'italic' }}>
                        {exp.organization}{exp.location ? ` | ${exp.location}` : ''}
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: '3px 0 0' }}>
                        {filterBullets(exp.bullets)
                          .map((bullet: any, bIdx: number) => (
                            <li key={bullet.id || bIdx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 2 }}>
                              <span style={{ color: '#333', marginRight: 6, fontSize: 10.5, flexShrink: 0 }}>&bull;</span>
                              <span style={{ fontSize: 10.5, color: '#333' }}>{getBulletText(bullet)}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Skills, Certifications, Education */}
          <div style={{ width: 200, flexShrink: 0, borderLeft: '1px solid #d4d4d4', padding: '20px 36px 24px 16px' }}>
            {/* Core Competencies */}
            {content.skills?.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <h2 style={{ fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', fontSize: 9, fontWeight: 700, color: '#1a2a44', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #b8943e', paddingBottom: 3, marginBottom: 6, marginTop: 0 }}>
                  Core Competencies
                </h2>
                <div>
                  {content.skills.map((skill: any, idx: number) => (
                    <div key={idx} style={{ fontSize: 10, color: '#444', marginBottom: 2 }}>
                      &bull; {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {content.certifications?.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <h2 style={{ fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', fontSize: 9, fontWeight: 700, color: '#1a2a44', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #b8943e', paddingBottom: 3, marginBottom: 6, marginTop: 0 }}>
                  Certifications
                </h2>
                {content.certifications.map((cert: any, idx: number) => (
                  <div key={idx} style={{ marginBottom: 4 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#1a2a44' }}>{cert.name}</div>
                    {cert.issuing_org && <div style={{ fontSize: 9, color: '#777' }}>{cert.issuing_org}</div>}
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {content.education?.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <h2 style={{ fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', fontSize: 9, fontWeight: 700, color: '#1a2a44', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #b8943e', paddingBottom: 3, marginBottom: 6, marginTop: 0 }}>
                  Education
                </h2>
                {content.education.map((edu: any, idx: number) => (
                  <div key={edu.id || idx} style={{ marginBottom: 6 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#1a2a44' }}>{formatFullDegree(edu)}</div>
                    <div style={{ fontSize: 9.5, color: '#666' }}>{getSchoolName(edu)}</div>
                    <div style={{ fontSize: 9, color: '#888' }}>
                      {formatGraduationDate(edu.graduation_month, edu.graduation_year, edu.graduation_date)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Security Clearance */}
            {content.profile?.clearance && content.profile.clearance !== 'none' && (
              <div style={{ marginBottom: 14 }}>
                <h2 style={{ fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif', fontSize: 9, fontWeight: 700, color: '#1a2a44', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #b8943e', paddingBottom: 3, marginBottom: 6, marginTop: 0 }}>
                  Security Clearance
                </h2>
                <div style={{ fontSize: 10, color: '#444' }}>{formatClearance(content.profile.clearance)}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // =========================================
  // TEMPLATE 2: CLASSIC PROFESSIONAL
  // =========================================
  if (template === 'classic_professional') {
    return (
      <div className="bg-white text-black min-h-[800px]" style={{ fontFamily: 'Lato, "Helvetica Neue", Arial, sans-serif' }}>
        {/* Header */}
        <div style={{ padding: '36px 56px 28px', textAlign: 'center', borderBottom: '2px solid #1a1a1a' }}>
          <h1 style={{ fontFamily: '"Libre Baskerville", Georgia, serif', fontSize: 30, fontWeight: 700, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '3px', margin: 0 }}>
            {content.contact?.first_name} {content.contact?.last_name}
          </h1>
          {content.target?.role && (
            <div style={{ fontFamily: 'Lato, "Helvetica Neue", sans-serif', fontSize: 13, fontWeight: 500, color: '#666', textTransform: 'uppercase', letterSpacing: '3px', marginTop: 4 }}>
              {content.target.role}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'nowrap', gap: 8, fontSize: 9.5, color: '#444', fontWeight: 500, marginTop: 8, overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {contactParts.map((part, i) => <span key={i}>{part}</span>)}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 56px 40px' }}>
          {/* Professional Summary */}
          {content.summary && (
            <div style={{ marginBottom: 22 }}>
              <h2 style={{ fontFamily: '"Libre Baskerville", Georgia, serif', fontSize: 12, fontWeight: 700, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '3px', borderBottom: '1px solid #c0c0c0', paddingBottom: 4, marginBottom: 10, marginTop: 0 }}>
                Professional Summary
              </h2>
              <p style={{ fontSize: 11.5, lineHeight: 1.7, color: '#333', margin: 0 }}>{content.summary}</p>
            </div>
          )}

          {/* Core Competencies - 3-column grid */}
          {content.skills?.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <h2 style={{ fontFamily: '"Libre Baskerville", Georgia, serif', fontSize: 12, fontWeight: 700, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '3px', borderBottom: '1px solid #c0c0c0', paddingBottom: 4, marginBottom: 10, marginTop: 0 }}>
                Core Competencies
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', columnGap: 32 }}>
                {content.skills.map((skill: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 3 }}>
                    <span style={{ color: '#1a1a1a', marginRight: 6, fontSize: 11 }}>&bull;</span>
                    <span style={{ fontSize: 11, color: '#333' }}>{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Professional Experience */}
          {content.experiences?.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <h2 style={{ fontFamily: '"Libre Baskerville", Georgia, serif', fontSize: 12, fontWeight: 700, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '3px', borderBottom: '1px solid #c0c0c0', paddingBottom: 4, marginBottom: 10, marginTop: 0 }}>
                Professional Experience
              </h2>
              {content.experiences.map((exp: any, idx: number) => (
                <div key={exp.id || idx} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>
                      {exp.civilian_title || exp.job_title}
                    </div>
                    <div style={{ fontSize: 11, color: '#666', fontWeight: 600, flexShrink: 0, marginLeft: 8 }}>
                      {formatDateRange(exp.start_date, exp.end_date, exp.is_current, resumeType)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 11.5, color: '#555', fontStyle: 'italic' }}>{exp.organization}</div>
                    {exp.location && <div style={{ fontSize: 11, color: '#777' }}>{exp.location}</div>}
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '4px 0 0' }}>
                    {filterBullets(exp.bullets)
                      .map((bullet: any, bIdx: number) => (
                        <li key={bullet.id || bIdx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 3 }}>
                          <span style={{ color: '#1a1a1a', marginRight: 6, fontSize: 11 }}>&bull;</span>
                          <span style={{ fontSize: 11, color: '#333' }}>{getBulletText(bullet)}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Education - 2-column grid */}
          {content.education?.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <h2 style={{ fontFamily: '"Libre Baskerville", Georgia, serif', fontSize: 12, fontWeight: 700, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '3px', borderBottom: '1px solid #c0c0c0', paddingBottom: 4, marginBottom: 10, marginTop: 0 }}>
                Education
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 40px' }}>
                {content.education.map((edu: any, idx: number) => (
                  <div key={edu.id || idx}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a' }}>{formatFullDegree(edu)}</div>
                    <div style={{ fontSize: 11, color: '#555' }}>{getSchoolName(edu)}</div>
                    <div style={{ fontSize: 10.5, color: '#777' }}>
                      {formatGraduationDate(edu.graduation_month, edu.graduation_year, edu.graduation_date)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications - inline */}
          {content.certifications?.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <h2 style={{ fontFamily: '"Libre Baskerville", Georgia, serif', fontSize: 12, fontWeight: 700, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '3px', borderBottom: '1px solid #c0c0c0', paddingBottom: 4, marginBottom: 10, marginTop: 0 }}>
                Certifications
              </h2>
              <div style={{ fontSize: 11, color: '#333', lineHeight: 1.8 }}>
                {content.certifications.map((cert: any) => cert.name).join(' \u00b7 ')}
              </div>
            </div>
          )}

          {/* Security Clearance */}
          {resumeType === 'federal' && content.profile?.clearance && content.profile.clearance !== 'none' && (
            <div style={{ marginBottom: 22 }}>
              <h2 style={{ fontFamily: '"Libre Baskerville", Georgia, serif', fontSize: 12, fontWeight: 700, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '3px', borderBottom: '1px solid #c0c0c0', paddingBottom: 4, marginBottom: 10, marginTop: 0 }}>
                Security Clearance
              </h2>
              <div style={{ fontSize: 11, color: '#333' }}>{formatClearance(content.profile.clearance)}</div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // =========================================
  // TEMPLATE 3: FEDERAL
  // =========================================
  if (template === 'federal') {
    return (
      <div className="bg-white text-black min-h-[800px]" style={{ fontFamily: '"Open Sans", Helvetica, Arial, sans-serif' }}>
        {/* Header */}
        <div style={{ padding: '32px 52px 24px', borderBottom: '3px solid #000' }}>
          <h1 style={{ fontFamily: 'Merriweather, "Times New Roman", serif', fontSize: 24, fontWeight: 900, color: '#000', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px' }}>
            {content.contact?.first_name} {content.contact?.last_name}
          </h1>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px', fontSize: 11, color: '#333' }}>
            {content.contact?.email && (
              <div><span style={{ fontWeight: 700, color: '#000' }}>Email: </span>{content.contact.email}</div>
            )}
            {content.contact?.phone && (
              <div><span style={{ fontWeight: 700, color: '#000' }}>Phone: </span>{formatPhoneForDisplay(content.contact.phone)}</div>
            )}
            {content.contact?.city && (
              <div><span style={{ fontWeight: 700, color: '#000' }}>Address: </span>{content.contact.city}{content.contact.state ? `, ${content.contact.state}` : ''}{content.contact.zip ? ` ${content.contact.zip}` : ''}</div>
            )}
            {(content.citizenship && content.citizenship !== '') && (
              <div><span style={{ fontWeight: 700, color: '#000' }}>Citizenship: </span>{formatFederalLabel(content.citizenship, CITIZENSHIP_LABELS)}</div>
            )}
            {(content.veterans_preference && content.veterans_preference !== '' && content.veterans_preference !== 'none') ? (
              <div><span style={{ fontWeight: 700, color: '#000' }}>Veterans&apos; Preference: </span>{formatFederalLabel(content.veterans_preference, VETERANS_PREF_LABELS)}</div>
            ) : content.military?.branch ? (
              <div><span style={{ fontWeight: 700, color: '#000' }}>Veterans&apos; Preference: </span>Yes</div>
            ) : null}
            {(() => {
              const clearance = content.security_clearance || content.profile?.clearance
              return clearance && clearance !== '' && clearance !== 'none' ? (
                <div><span style={{ fontWeight: 700, color: '#000' }}>Clearance: </span>{formatClearance(clearance)}{content.clearance_status && content.clearance_status !== '' ? ` (${content.clearance_status.charAt(0).toUpperCase() + content.clearance_status.slice(1)})` : ''}</div>
              ) : null
            })()}
            {content.federal_status && (
              <div><span style={{ fontWeight: 700, color: '#000' }}>Highest Grade: </span>{content.federal_status}</div>
            )}
            {content.contact?.linkedin_url && (
              <div><span style={{ fontWeight: 700, color: '#000' }}>LinkedIn: </span>{content.contact.linkedin_url}</div>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 52px 40px' }}>
          {/* Professional Summary */}
          {content.summary && (
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Merriweather, "Times New Roman", serif', fontSize: 12, fontWeight: 900, color: '#fff', backgroundColor: '#000', textTransform: 'uppercase', letterSpacing: '2px', padding: '6px 12px', margin: '0 0 10px' }}>
                Professional Summary
              </h2>
              <p style={{ fontSize: 11, lineHeight: 1.7, color: '#333', margin: 0 }}>{content.summary}</p>
            </div>
          )}

          {/* Professional Experience */}
          {content.experiences?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Merriweather, "Times New Roman", serif', fontSize: 12, fontWeight: 900, color: '#fff', backgroundColor: '#000', textTransform: 'uppercase', letterSpacing: '2px', padding: '6px 12px', margin: '0 0 10px' }}>
                Professional Experience
              </h2>
              {content.experiences.map((exp: any, idx: number) => {
                const locationDisplay = (exp.city || exp.state)
                  ? `${exp.city || ''}${exp.city && exp.state ? ', ' : ''}${exp.state || ''}`
                  : exp.location
                return (
                  <div key={exp.id || idx} style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#000' }}>
                      {exp.civilian_title || exp.job_title}
                    </div>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: '#333' }}>{exp.organization}</div>
                    {locationDisplay && <div style={{ fontSize: 10.5, color: '#555' }}><span style={{ fontWeight: 700, color: '#333' }}>Location: </span>{locationDisplay}</div>}
                    <div style={{ fontSize: 10.5, color: '#555' }}>
                      <span style={{ fontWeight: 700, color: '#333' }}>Dates: </span>
                      {formatDateRange(exp.start_date, exp.end_date, exp.is_current, 'federal')}
                    </div>
                    {exp.grade_level && <div style={{ fontSize: 10.5, color: '#555' }}><span style={{ fontWeight: 700, color: '#333' }}>Grade: </span>{exp.grade_level}</div>}
                    <div style={{ fontSize: 10.5, color: '#555' }}><span style={{ fontWeight: 700, color: '#333' }}>Hours per week: </span>{exp.hours_per_week || 40}</div>
                    {exp.salary && <div style={{ fontSize: 10.5, color: '#555' }}><span style={{ fontWeight: 700, color: '#333' }}>Salary: </span>{exp.salary.startsWith('$') ? exp.salary : `$${exp.salary}`}</div>}

                    <div style={{ fontSize: 11, fontWeight: 700, color: '#000', textTransform: 'uppercase', marginTop: 8, marginBottom: 4 }}>
                      Duties and Accomplishments:
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {filterBullets(exp.bullets)
                        .map((bullet: any, bIdx: number) => (
                          <li key={bullet.id || bIdx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 3 }}>
                            <span style={{ color: '#000', marginRight: 6, fontSize: 11 }}>&bull;</span>
                            <span style={{ fontSize: 11, color: '#333' }}>{getBulletText(bullet)}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          )}

          {/* Education */}
          {content.education?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Merriweather, "Times New Roman", serif', fontSize: 12, fontWeight: 900, color: '#fff', backgroundColor: '#000', textTransform: 'uppercase', letterSpacing: '2px', padding: '6px 12px', margin: '0 0 10px' }}>
                Education
              </h2>
              {content.education.map((edu: any, idx: number) => (
                <div key={edu.id || idx} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#000' }}>{formatFullDegree(edu)}</div>
                  <div style={{ fontSize: 11, color: '#333' }}>{getSchoolName(edu)}</div>
                  <div style={{ fontSize: 10.5, color: '#555' }}>
                    {formatGraduationDate(edu.graduation_month, edu.graduation_year, edu.graduation_date)}
                    {edu.gpa && ` | GPA: ${edu.gpa}`}
                    {edu.credit_hours && ` | ${edu.credit_hours} credit hours`}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certifications & Licenses */}
          {content.certifications?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Merriweather, "Times New Roman", serif', fontSize: 12, fontWeight: 900, color: '#fff', backgroundColor: '#000', textTransform: 'uppercase', letterSpacing: '2px', padding: '6px 12px', margin: '0 0 10px' }}>
                Certifications &amp; Licenses
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {content.certifications.map((cert: any, idx: number) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 3 }}>
                    <span style={{ color: '#000', marginRight: 6, fontSize: 11 }}>&bull;</span>
                    <span style={{ fontSize: 11, color: '#333' }}>
                      <strong>{cert.name}</strong>{cert.issuing_org ? ` \u2014 ${cert.issuing_org}` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technical Proficiencies */}
          {content.skills?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Merriweather, "Times New Roman", serif', fontSize: 12, fontWeight: 900, color: '#fff', backgroundColor: '#000', textTransform: 'uppercase', letterSpacing: '2px', padding: '6px 12px', margin: '0 0 10px' }}>
                Skills
              </h2>
              <div style={{ fontSize: 11, color: '#333' }}>
                {content.skills.map((s: any) => s.name).join(', ')}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {(content.security_clearance || content.profile?.clearance || content.military?.branch) && (
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Merriweather, "Times New Roman", serif', fontSize: 12, fontWeight: 900, color: '#fff', backgroundColor: '#000', textTransform: 'uppercase', letterSpacing: '2px', padding: '6px 12px', margin: '0 0 10px' }}>
                Additional Information
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px', fontSize: 11, color: '#333' }}>
                {(() => {
                  const clearance = content.security_clearance || content.profile?.clearance
                  return clearance && clearance !== 'none' && clearance !== '' ? (
                    <div><span style={{ fontWeight: 700, color: '#000' }}>Security Clearance: </span>{formatClearance(clearance)}{content.clearance_status && content.clearance_status !== '' ? ` (${content.clearance_status.charAt(0).toUpperCase() + content.clearance_status.slice(1)})` : ''}</div>
                  ) : null
                })()}
                {content.military?.branch && (
                  <div><span style={{ fontWeight: 700, color: '#000' }}>Military Service: </span>{content.military.branch}</div>
                )}
              </div>
            </div>
          )}

          {/* Federal-only sections */}
          {content.training?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Merriweather, "Times New Roman", serif', fontSize: 12, fontWeight: 900, color: '#fff', backgroundColor: '#000', textTransform: 'uppercase', letterSpacing: '2px', padding: '6px 12px', margin: '0 0 10px' }}>
                Job-Related Training
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {content.training.map((t: any, idx: number) => (
                  <li key={t.id || idx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 3 }}>
                    <span style={{ color: '#000', marginRight: 6, fontSize: 11 }}>&bull;</span>
                    <span style={{ fontSize: 11, color: '#333' }}>
                      {t.name}{t.provider && ` \u2013 ${t.provider}`}{t.completion_date && ` (${t.completion_date})`}{t.hours && ` \u2013 ${t.hours} hours`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {content.languages?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Merriweather, "Times New Roman", serif', fontSize: 12, fontWeight: 900, color: '#fff', backgroundColor: '#000', textTransform: 'uppercase', letterSpacing: '2px', padding: '6px 12px', margin: '0 0 10px' }}>
                Language Skills
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {content.languages.map((lang: any, idx: number) => (
                  <li key={lang.id || idx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 3 }}>
                    <span style={{ color: '#000', marginRight: 6, fontSize: 11 }}>&bull;</span>
                    <span style={{ fontSize: 11, color: '#333' }}>{lang.language}: {getProficiencyLabel(lang.proficiency)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {content.affiliations?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Merriweather, "Times New Roman", serif', fontSize: 12, fontWeight: 900, color: '#fff', backgroundColor: '#000', textTransform: 'uppercase', letterSpacing: '2px', padding: '6px 12px', margin: '0 0 10px' }}>
                Professional Affiliations
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {content.affiliations.map((aff: any, idx: number) => (
                  <li key={aff.id || idx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 3 }}>
                    <span style={{ color: '#000', marginRight: 6, fontSize: 11 }}>&bull;</span>
                    <span style={{ fontSize: 11, color: '#333' }}>{aff.name}{aff.role && ` \u2013 ${aff.role}`}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {content.publications?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Merriweather, "Times New Roman", serif', fontSize: 12, fontWeight: 900, color: '#fff', backgroundColor: '#000', textTransform: 'uppercase', letterSpacing: '2px', padding: '6px 12px', margin: '0 0 10px' }}>
                Publications
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {content.publications.map((pub: any, idx: number) => (
                  <li key={pub.id || idx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 3 }}>
                    <span style={{ color: '#000', marginRight: 6, fontSize: 11 }}>&bull;</span>
                    <span style={{ fontSize: 11, color: '#333' }}>{pub.title}{pub.publication && `, ${pub.publication}`}{pub.date && ` (${pub.date})`}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {content.profile?.special_eligibility?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Merriweather, "Times New Roman", serif', fontSize: 12, fontWeight: 900, color: '#fff', backgroundColor: '#000', textTransform: 'uppercase', letterSpacing: '2px', padding: '6px 12px', margin: '0 0 10px' }}>
                Special Hiring Authorities
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {content.profile.special_eligibility.map((elig: string, idx: number) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 3 }}>
                    <span style={{ color: '#000', marginRight: 6, fontSize: 11 }}>&bull;</span>
                    <span style={{ fontSize: 11, color: '#333' }}>{elig}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  }

  // =========================================
  // TEMPLATE 4: MODERN
  // =========================================
  if (template === 'modern') {
    return (
      <div className="bg-white text-black min-h-[800px]" style={{ fontFamily: '"DM Sans", Helvetica, Arial, sans-serif' }}>
        {/* Dark header */}
        <div style={{ padding: '40px 52px 32px', backgroundColor: '#0f2b3c', position: 'relative' }}>
          <h1 style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 32, fontWeight: 400, color: '#fff', margin: 0 }}>
            {content.contact?.first_name} {content.contact?.last_name}
          </h1>
          {content.target?.role && (
            <div style={{ fontSize: 14, fontWeight: 500, color: '#7cc5de', textTransform: 'uppercase', letterSpacing: '2px', marginTop: 4 }}>
              {content.target.role}
            </div>
          )}
          <div style={{ display: 'flex', flexWrap: 'nowrap', gap: 10, fontSize: 9.5, color: '#b0c4ce', marginTop: 10, overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {contactParts.map((part, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#3b9ec2' }}>&#9670;</span> {part}
              </span>
            ))}
          </div>
          {/* Gradient bar */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #3b9ec2, #2dd4a8)' }} />
        </div>

        {/* Body */}
        <div style={{ padding: '28px 52px 40px' }}>
          {/* About */}
          {content.summary && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: '#0f2b3c', textTransform: 'uppercase', letterSpacing: '3px', marginTop: 0, marginBottom: 8, position: 'relative', paddingBottom: 8 }}>
                About
                <span style={{ position: 'absolute', bottom: 0, left: 0, width: 40, height: 2, background: 'linear-gradient(90deg, #3b9ec2, #2dd4a8)' }} />
              </h2>
              <p style={{ fontSize: 11.5, lineHeight: 1.75, color: '#444', margin: 0 }}>{content.summary}</p>
            </div>
          )}

          {/* Core Competencies - pills */}
          {content.skills?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: '#0f2b3c', textTransform: 'uppercase', letterSpacing: '3px', marginTop: 0, marginBottom: 8, position: 'relative', paddingBottom: 8 }}>
                Core Competencies
                <span style={{ position: 'absolute', bottom: 0, left: 0, width: 40, height: 2, background: 'linear-gradient(90deg, #3b9ec2, #2dd4a8)' }} />
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {content.skills.map((skill: any, idx: number) => (
                  <span key={idx} style={{ fontSize: 10, fontWeight: 600, color: '#0f2b3c', backgroundColor: '#f0f7fa', border: '1px solid #d4e8f0', borderRadius: 20, padding: '5px 14px' }}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience - timeline style */}
          {content.experiences?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: '#0f2b3c', textTransform: 'uppercase', letterSpacing: '3px', marginTop: 0, marginBottom: 8, position: 'relative', paddingBottom: 8 }}>
                Experience
                <span style={{ position: 'absolute', bottom: 0, left: 0, width: 40, height: 2, background: 'linear-gradient(90deg, #3b9ec2, #2dd4a8)' }} />
              </h2>
              {content.experiences.map((exp: any, idx: number) => (
                <div key={exp.id || idx} style={{ paddingLeft: 16, borderLeft: '2px solid #e0e8ec', marginBottom: 14, position: 'relative' }}>
                  {/* Timeline dot */}
                  <div style={{ position: 'absolute', left: -5, top: 4, width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3b9ec2' }} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f2b3c' }}>
                    {exp.civilian_title || exp.job_title}
                  </div>
                  <div style={{ fontSize: 10, color: '#3b9ec2', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {formatDateRange(exp.start_date, exp.end_date, exp.is_current, resumeType)}
                  </div>
                  <div style={{ fontSize: 11, color: '#666', fontWeight: 500 }}>
                    {exp.organization}{exp.location ? ` | ${exp.location}` : ''}
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '4px 0 0' }}>
                    {filterBullets(exp.bullets)
                      .map((bullet: any, bIdx: number) => (
                        <li key={bullet.id || bIdx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 3 }}>
                          <span style={{ color: '#3b9ec2', marginRight: 6, fontSize: 11 }}>&bull;</span>
                          <span style={{ fontSize: 11, color: '#444' }}>{getBulletText(bullet)}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {content.education?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: '#0f2b3c', textTransform: 'uppercase', letterSpacing: '3px', marginTop: 0, marginBottom: 8, position: 'relative', paddingBottom: 8 }}>
                Education
                <span style={{ position: 'absolute', bottom: 0, left: 0, width: 40, height: 2, background: 'linear-gradient(90deg, #3b9ec2, #2dd4a8)' }} />
              </h2>
              {content.education.map((edu: any, idx: number) => (
                <div key={edu.id || idx} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0f2b3c' }}>{formatFullDegree(edu)}</div>
                    <div style={{ fontSize: 10, color: '#3b9ec2', fontWeight: 600, textTransform: 'uppercase' }}>
                      {formatGraduationDate(edu.graduation_month, edu.graduation_year, edu.graduation_date)}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#666' }}>{getSchoolName(edu)}</div>
                </div>
              ))}
            </div>
          )}

          {/* Certifications - 2-column grid */}
          {content.certifications?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: '#0f2b3c', textTransform: 'uppercase', letterSpacing: '3px', marginTop: 0, marginBottom: 8, position: 'relative', paddingBottom: 8 }}>
                Certifications
                <span style={{ position: 'absolute', bottom: 0, left: 0, width: 40, height: 2, background: 'linear-gradient(90deg, #3b9ec2, #2dd4a8)' }} />
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                {content.certifications.map((cert: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                    <span style={{ color: '#2dd4a8', fontSize: 11, flexShrink: 0 }}>&#10003;</span>
                    <span style={{ fontSize: 11, color: '#444' }}>{cert.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Federal sections for modern template */}
          {resumeType === 'federal' && content.profile?.clearance && content.profile.clearance !== 'none' && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: '#0f2b3c', textTransform: 'uppercase', letterSpacing: '3px', marginTop: 0, marginBottom: 8, position: 'relative', paddingBottom: 8 }}>
                Security Clearance
                <span style={{ position: 'absolute', bottom: 0, left: 0, width: 40, height: 2, background: 'linear-gradient(90deg, #3b9ec2, #2dd4a8)' }} />
              </h2>
              <div style={{ fontSize: 11, color: '#444' }}>{formatClearance(content.profile.clearance)}</div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // =========================================
  // TEMPLATE 5: MINIMAL
  // =========================================
  if (template === 'minimal') {
    return (
      <div className="bg-white text-black min-h-[800px]" style={{ fontFamily: '"Nunito Sans", Helvetica, Arial, sans-serif' }}>
        {/* Header */}
        <div style={{ padding: '48px 60px 36px', textAlign: 'left' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 36, fontWeight: 600, color: '#222', margin: 0 }}>
            {content.contact?.first_name} {content.contact?.last_name}
          </h1>
          {content.target?.role && (
            <div style={{ fontSize: 12, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '4px', marginTop: 4 }}>
              {content.target.role}
            </div>
          )}
          <div style={{ width: 50, height: 1, backgroundColor: '#ccc', marginTop: 12, marginBottom: 12 }} />
          <div style={{ display: 'flex', flexWrap: 'nowrap', gap: 10, fontSize: 9.5, color: '#777', fontWeight: 500, letterSpacing: '0.3px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {contactParts.map((part, i) => <span key={i}>{part}</span>)}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '0 60px 48px' }}>
          {/* Summary */}
          {content.summary && (
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 14, fontWeight: 700, color: '#222', textTransform: 'uppercase', letterSpacing: '4px', marginTop: 0, marginBottom: 4 }}>
                Summary
              </h2>
              <div style={{ width: '100%', height: 1, backgroundColor: '#e0e0e0', marginBottom: 10 }} />
              <p style={{ fontSize: 11, lineHeight: 1.8, color: '#555', margin: 0 }}>{content.summary}</p>
            </div>
          )}

          {/* Competencies - flowing text */}
          {content.skills?.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 14, fontWeight: 700, color: '#222', textTransform: 'uppercase', letterSpacing: '4px', marginTop: 0, marginBottom: 4 }}>
                Competencies
              </h2>
              <div style={{ width: '100%', height: 1, backgroundColor: '#e0e0e0', marginBottom: 10 }} />
              <div style={{ fontSize: 10.5, color: '#666', lineHeight: 2 }}>
                {content.skills.map((s: any, i: number) => (
                  <span key={i}>
                    {s.name}{i < content.skills.length - 1 && <span style={{ color: '#ccc' }}> / </span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {content.experiences?.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 14, fontWeight: 700, color: '#222', textTransform: 'uppercase', letterSpacing: '4px', marginTop: 0, marginBottom: 4 }}>
                Experience
              </h2>
              <div style={{ width: '100%', height: 1, backgroundColor: '#e0e0e0', marginBottom: 10 }} />
              {content.experiences.map((exp: any, idx: number) => (
                <div key={exp.id || idx} style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 15, fontWeight: 700, color: '#222' }}>
                    {exp.civilian_title || exp.job_title}
                  </div>
                  <div style={{ fontSize: 10, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {formatDateRange(exp.start_date, exp.end_date, exp.is_current, resumeType)}
                  </div>
                  <div style={{ fontSize: 11, color: '#888', fontWeight: 500 }}>
                    {exp.organization}{exp.location ? ` | ${exp.location}` : ''}
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '4px 0 0' }}>
                    {filterBullets(exp.bullets)
                      .map((bullet: any, bIdx: number) => (
                        <li key={bullet.id || bIdx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 3 }}>
                          <span style={{ color: '#bbb', marginRight: 6, fontSize: 10.5 }}>&middot;</span>
                          <span style={{ fontSize: 10.5, color: '#555' }}>{getBulletText(bullet)}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {content.education?.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 14, fontWeight: 700, color: '#222', textTransform: 'uppercase', letterSpacing: '4px', marginTop: 0, marginBottom: 4 }}>
                Education
              </h2>
              <div style={{ width: '100%', height: 1, backgroundColor: '#e0e0e0', marginBottom: 10 }} />
              {content.education.map((edu: any, idx: number) => (
                <div key={edu.id || idx} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 13, fontWeight: 700, color: '#222' }}>{formatFullDegree(edu)}</div>
                    <div style={{ fontSize: 10, color: '#999' }}>{formatGraduationDate(edu.graduation_month, edu.graduation_year, edu.graduation_date)}</div>
                  </div>
                  <div style={{ fontSize: 10.5, color: '#888' }}>{getSchoolName(edu)}</div>
                </div>
              ))}
            </div>
          )}

          {/* Certifications - flowing */}
          {content.certifications?.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 14, fontWeight: 700, color: '#222', textTransform: 'uppercase', letterSpacing: '4px', marginTop: 0, marginBottom: 4 }}>
                Certifications
              </h2>
              <div style={{ width: '100%', height: 1, backgroundColor: '#e0e0e0', marginBottom: 10 }} />
              <div style={{ fontSize: 10.5, color: '#666' }}>
                {content.certifications.map((c: any, i: number) => (
                  <span key={i}>
                    {c.name}{i < content.certifications.length - 1 && <span style={{ color: '#ccc' }}> / </span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Federal sections */}
          {resumeType === 'federal' && content.profile?.clearance && content.profile.clearance !== 'none' && (
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 14, fontWeight: 700, color: '#222', textTransform: 'uppercase', letterSpacing: '4px', marginTop: 0, marginBottom: 4 }}>
                Security Clearance
              </h2>
              <div style={{ width: '100%', height: 1, backgroundColor: '#e0e0e0', marginBottom: 10 }} />
              <div style={{ fontSize: 11, color: '#555' }}>{formatClearance(content.profile.clearance)}</div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // =========================================
  // TEMPLATE 6: TWO COLUMN (default fallback)
  // =========================================
  return (
    <div className="bg-white text-black min-h-[800px]" style={{ fontFamily: 'Karla, Helvetica, Arial, sans-serif', display: 'grid', gridTemplateColumns: '220px 1fr' }}>
      {/* Left Sidebar */}
      <div style={{ backgroundColor: '#2b2b2b', padding: '36px 24px', color: '#fff' }}>
        {/* Name */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontFamily: 'Bitter, Georgia, serif', fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: 1.3, margin: 0 }}>
            {content.contact?.first_name} {content.contact?.last_name}
          </h1>
          {content.target?.role && (
            <div style={{ fontSize: 10, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '2px', marginTop: 4 }}>
              {content.target.role}
            </div>
          )}
        </div>

        {/* Contact */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 9, fontWeight: 700, color: '#d4a855', textTransform: 'uppercase', letterSpacing: '2.5px', borderBottom: '1px solid #444', paddingBottom: 4, marginBottom: 8, marginTop: 0 }}>
            Contact
          </h2>
          {content.contact?.email && (
            <div style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Email</div>
              <div style={{ fontSize: 10.5, color: '#ccc' }}>{content.contact.email}</div>
            </div>
          )}
          {content.contact?.phone && (
            <div style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Phone</div>
              <div style={{ fontSize: 10.5, color: '#ccc' }}>{formatPhoneForDisplay(content.contact.phone)}</div>
            </div>
          )}
          {content.contact?.city && (
            <div style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Location</div>
              <div style={{ fontSize: 10.5, color: '#ccc' }}>{content.contact.city}, {content.contact.state}</div>
            </div>
          )}
          {shortLinkedIn && (
            <div style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>LinkedIn</div>
              <div style={{ fontSize: 9.5, color: '#ccc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shortLinkedIn}</div>
            </div>
          )}
        </div>

        {/* Education */}
        {content.education?.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 9, fontWeight: 700, color: '#d4a855', textTransform: 'uppercase', letterSpacing: '2.5px', borderBottom: '1px solid #444', paddingBottom: 4, marginBottom: 8, marginTop: 0 }}>
              Education
            </h2>
            {content.education.map((edu: any, idx: number) => (
              <div key={edu.id || idx} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{formatFullDegree(edu)}</div>
                <div style={{ fontSize: 10, color: '#aaa' }}>{getSchoolName(edu)}</div>
                <div style={{ fontSize: 9.5, color: '#777' }}>
                  {formatGraduationDate(edu.graduation_month, edu.graduation_year, edu.graduation_date)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {content.certifications?.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 9, fontWeight: 700, color: '#d4a855', textTransform: 'uppercase', letterSpacing: '2.5px', borderBottom: '1px solid #444', paddingBottom: 4, marginBottom: 8, marginTop: 0 }}>
              Certifications
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {content.certifications.map((cert: any, idx: number) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 3 }}>
                  <span style={{ color: '#d4a855', marginRight: 6, fontSize: 10.5 }}>&bull;</span>
                  <span style={{ fontSize: 10.5, color: '#ccc' }}>{cert.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Core Skills - tags */}
        {content.skills?.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 9, fontWeight: 700, color: '#d4a855', textTransform: 'uppercase', letterSpacing: '2.5px', borderBottom: '1px solid #444', paddingBottom: 4, marginBottom: 8, marginTop: 0 }}>
              Core Skills
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {content.skills.map((skill: any, idx: number) => (
                <span key={idx} style={{ fontSize: 9.5, fontWeight: 500, color: '#ddd', backgroundColor: '#3a3a3a', borderRadius: 2, padding: '3px 8px' }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Security Clearance */}
        {content.profile?.clearance && content.profile.clearance !== 'none' && (
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 9, fontWeight: 700, color: '#d4a855', textTransform: 'uppercase', letterSpacing: '2.5px', borderBottom: '1px solid #444', paddingBottom: 4, marginBottom: 8, marginTop: 0 }}>
              Clearance
            </h2>
            <div style={{ display: 'inline-block', fontSize: 9.5, fontWeight: 700, color: '#2b2b2b', backgroundColor: '#d4a855', padding: '4px 10px', textTransform: 'uppercase' }}>
              {formatClearance(content.profile.clearance)}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ padding: '36px 40px 40px 32px' }}>
        {/* Professional Summary */}
        {content.summary && (
          <div style={{ marginBottom: 22 }}>
            <h2 style={{ fontFamily: 'Bitter, Georgia, serif', fontSize: 13, fontWeight: 700, color: '#2b2b2b', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '2px solid #2b2b2b', paddingBottom: 4, marginBottom: 10, marginTop: 0 }}>
              Professional Summary
            </h2>
            <p style={{ fontSize: 11, lineHeight: 1.7, color: '#444', margin: 0 }}>{content.summary}</p>
          </div>
        )}

        {/* Professional Experience */}
        {content.experiences?.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <h2 style={{ fontFamily: 'Bitter, Georgia, serif', fontSize: 13, fontWeight: 700, color: '#2b2b2b', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '2px solid #2b2b2b', paddingBottom: 4, marginBottom: 10, marginTop: 0 }}>
              Professional Experience
            </h2>
            {content.experiences.map((exp: any, idx: number) => (
              <div key={exp.id || idx} style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: 'Bitter, Georgia, serif', fontSize: 12.5, fontWeight: 700, color: '#2b2b2b' }}>
                  {exp.civilian_title || exp.job_title}
                </div>
                <div style={{ fontSize: 10, color: '#888', fontWeight: 600 }}>
                  {formatDateRange(exp.start_date, exp.end_date, exp.is_current, resumeType)}
                </div>
                <div style={{ fontSize: 11, color: '#666', fontStyle: 'italic' }}>
                  {exp.organization}{exp.location ? ` | ${exp.location}` : ''}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '4px 0 0' }}>
                  {filterBullets(exp.bullets)
                    .map((bullet: any, bIdx: number) => (
                      <li key={bullet.id || bIdx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 3 }}>
                        <span style={{ color: '#d4a855', marginRight: 6, fontSize: 10.5 }}>&bull;</span>
                        <span style={{ fontSize: 10.5, color: '#444' }}>{getBulletText(bullet)}</span>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Federal sections in main column */}
        {resumeType === 'federal' && (
          <>
            {content.training?.length > 0 && (
              <div style={{ marginBottom: 22 }}>
                <h2 style={{ fontFamily: 'Bitter, Georgia, serif', fontSize: 13, fontWeight: 700, color: '#2b2b2b', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '2px solid #2b2b2b', paddingBottom: 4, marginBottom: 10, marginTop: 0 }}>
                  Job-Related Training
                </h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {content.training.map((t: any, idx: number) => (
                    <li key={t.id || idx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 3 }}>
                      <span style={{ color: '#d4a855', marginRight: 6, fontSize: 10.5 }}>&bull;</span>
                      <span style={{ fontSize: 10.5, color: '#444' }}>
                        {t.name}{t.provider && ` \u2013 ${t.provider}`}{t.completion_date && ` (${t.completion_date})`}{t.hours && ` \u2013 ${t.hours} hours`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {content.languages?.length > 0 && (
              <div style={{ marginBottom: 22 }}>
                <h2 style={{ fontFamily: 'Bitter, Georgia, serif', fontSize: 13, fontWeight: 700, color: '#2b2b2b', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '2px solid #2b2b2b', paddingBottom: 4, marginBottom: 10, marginTop: 0 }}>
                  Language Skills
                </h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {content.languages.map((lang: any, idx: number) => (
                    <li key={lang.id || idx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 3 }}>
                      <span style={{ color: '#d4a855', marginRight: 6, fontSize: 10.5 }}>&bull;</span>
                      <span style={{ fontSize: 10.5, color: '#444' }}>{lang.language}: {getProficiencyLabel(lang.proficiency)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
