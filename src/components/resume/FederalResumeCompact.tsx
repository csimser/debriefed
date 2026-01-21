'use client'

import { formatPhoneForDisplay } from '@/lib/formatPhone'
import {
  formatDateRange,
  formatFullDegree,
  formatGraduationDate,
  getSchoolName,
  formatClearance,
} from '@/lib/utils/formatResume'

interface FederalResumeCompactProps {
  content: any
  jobInfo?: {
    announcementNumber?: string
    veteransPreference?: boolean
    federalCivilianStatus?: string
    citizenship?: string
  }
}

export function FederalResumeCompact({ content, jobInfo }: FederalResumeCompactProps) {
  const contact = content.contact || {}
  const profile = content.profile || {}
  const experiences = (content.experiences || []).slice(0, 3)  // Max 3 positions
  const education = content.education || []
  const certifications = content.certifications || []
  const skills = content.skills || []

  return (
    <div
      className="bg-white text-black p-6 min-h-[800px] leading-tight"
      style={{ fontFamily: 'Georgia, serif', fontSize: '10pt' }}
    >
      {/* Compact Header */}
      <div className="text-center mb-3">
        <h1 className="text-lg font-bold uppercase tracking-wide">
          {contact.first_name} {contact.last_name}
        </h1>
        <div className="text-xs mt-1">
          {contact.city && `${contact.city}, ${contact.state}`}
          {profile.zip_code && ` ${profile.zip_code}`}
          {contact.phone && ` | ${formatPhoneForDisplay(contact.phone)}`}
          {contact.email && ` | ${contact.email}`}
        </div>

        {/* Federal Application Info */}
        {jobInfo?.announcementNumber && (
          <div className="mt-2 text-xs border-t border-b border-gray-300 py-1">
            <span className="font-semibold">ANNOUNCEMENT:</span> {jobInfo.announcementNumber} |{' '}
            Veteran's Preference: {jobInfo.veteransPreference ? 'Yes' : 'No'} |{' '}
            Federal Status: {jobInfo.federalCivilianStatus || 'N/A'} |{' '}
            Citizenship: {jobInfo.citizenship || 'USA'}
          </div>
        )}
      </div>

      {/* Summary of Qualifications (condensed) */}
      {content.summary && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase border-b border-gray-300 pb-0.5 mb-1">
            Summary of Qualifications
          </h2>
          <p className="text-xs leading-snug">{content.summary}</p>
        </div>
      )}

      {/* Education (compact - no coursework) */}
      {education.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase border-b border-gray-300 pb-0.5 mb-1">
            Education
          </h2>
          <div className="space-y-1">
            {education.map((edu: any, idx: number) => (
              <div key={edu.id || idx} className="text-xs">
                <div className="flex justify-between">
                  <span className="font-semibold">{getSchoolName(edu)}</span>
                  <span>{formatGraduationDate(edu.graduation_month, edu.graduation_year, edu.graduation_date)}</span>
                </div>
                <div>
                  {formatFullDegree(edu)}
                  {' (GPA: '}{edu.gpa || 'N/A'}{')'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Experience (compact) */}
      {experiences.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase border-b border-gray-300 pb-0.5 mb-1">
            Professional Experience
          </h2>
          <div className="space-y-3">
            {experiences.map((exp: any, idx: number) => {
              // Limit bullets to 5
              const bullets = (exp.bullets || []).slice(0, 5)

              return (
                <div key={exp.id || idx} className="text-xs">
                  {/* Line 1: Company and Dates */}
                  <div className="flex justify-between">
                    <span className="font-semibold">{exp.organization}</span>
                    <span>{formatDateRange(exp.start_date, exp.end_date, exp.is_current, 'federal')}</span>
                  </div>

                  {/* Line 2: Title and Location */}
                  <div className="flex justify-between">
                    <span className="italic">
                      {exp.civilian_title || exp.job_title}
                      {exp.pay_grade && `, ${exp.pay_grade}`}
                    </span>
                    <span>{exp.location}</span>
                  </div>

                  {/* Line 3: Supervisor, Hours, Salary */}
                  <div className="text-gray-600">
                    {exp.supervisor_name ? (
                      <>
                        Supervisor: {exp.supervisor_name}
                        {exp.supervisor_phone && `, ${formatPhoneForDisplay(exp.supervisor_phone)}`}
                        {exp.supervisor_can_contact ? ', may contact' : ', do not contact'}
                        {' | '}
                      </>
                    ) : (
                      'Supervisor: Available upon request | '
                    )}
                    {exp.hours_per_week || 40} hrs/wk
                    {exp.salary && ` | ${exp.salary}`}
                  </div>

                  {/* Bullets - flat list, max 5 */}
                  {bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5">
                      {bullets.map((bullet: any, bIdx: number) => (
                        <li key={bullet.id || bIdx}>
                          {bullet.is_accepted
                            ? bullet.translated_text
                            : bullet.translated_text || bullet.original_text}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Security Clearance (if applicable) */}
      {profile.clearance && profile.clearance !== 'none' && (
        <div className="mb-2">
          <h2 className="text-xs font-bold uppercase border-b border-gray-300 pb-0.5 mb-1">
            Security Clearance
          </h2>
          <p className="text-xs">{formatClearance(profile.clearance)}</p>
        </div>
      )}

      {/* Certifications (inline format) */}
      {certifications.length > 0 && (
        <div className="mb-2">
          <h2 className="text-xs font-bold uppercase border-b border-gray-300 pb-0.5 mb-1">
            Certifications
          </h2>
          <p className="text-xs">
            {certifications.map((cert: any) => cert.name).join(' - ')}
          </p>
        </div>
      )}

      {/* Skills (compact, two-line format) */}
      {skills.length > 0 && (
        <div className="mb-2">
          <h2 className="text-xs font-bold uppercase border-b border-gray-300 pb-0.5 mb-1">
            Skills
          </h2>
          <p className="text-xs">
            {skills.map((s: any) => s.name).join(', ')}
          </p>
        </div>
      )}
    </div>
  )
}
