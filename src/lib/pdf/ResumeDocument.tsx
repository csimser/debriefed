import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'
import { formatPhoneForDisplay } from '@/lib/formatPhone'
import {
  getDegreeLabel,
  formatGraduationDateShort,
  parseLegacyGraduationDate,
} from '@/lib/constants/education'
import { formatDateRange, formatClearance } from '@/lib/utils/formatResume'
import { getProficiencyLabel } from '@/lib/constants/federalEligibility'
import { TemplateId } from '@/lib/templates'

// Template-specific color schemes and styles
const templateConfig = {
  clean: {
    primaryColor: '#1a1a1a',
    secondaryColor: '#444',
    accentColor: '#1a1a1a',
    headerBorderWidth: 2,
    sectionBorderWidth: 1,
    fontFamily: 'Helvetica',
  },
  federal: {
    primaryColor: '#000000',
    secondaryColor: '#333',
    accentColor: '#000000',
    headerBorderWidth: 2,
    sectionBorderWidth: 1,
    fontFamily: 'Times-Roman',
  },
  classic: {
    primaryColor: '#2c3e50',
    secondaryColor: '#7f8c8d',
    accentColor: '#2c3e50',
    headerBorderWidth: 3,
    sectionBorderWidth: 2,
    fontFamily: 'Times-Roman',
  },
  modern: {
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    accentColor: '#2563eb',
    headerBorderWidth: 4,
    sectionBorderWidth: 0,
    fontFamily: 'Helvetica',
  },
  minimal: {
    primaryColor: '#374151',
    secondaryColor: '#9ca3af',
    accentColor: '#374151',
    headerBorderWidth: 0,
    sectionBorderWidth: 0,
    fontFamily: 'Helvetica',
  },
  twocol: {
    primaryColor: '#1f2937',
    secondaryColor: '#6b7280',
    accentColor: '#059669',
    headerBorderWidth: 0,
    sectionBorderWidth: 1,
    fontFamily: 'Helvetica',
  },
}

const getTemplateStyles = (template: TemplateId) => {
  const config = templateConfig[template] || templateConfig.clean

  return StyleSheet.create({
    page: {
      padding: template === 'twocol' ? 0 : 40,
      fontSize: 10,
      fontFamily: config.fontFamily,
      color: config.primaryColor,
    },
    twoColContainer: {
      flexDirection: 'row',
      height: '100%',
    },
    sidebar: {
      width: '30%',
      backgroundColor: '#f3f4f6',
      padding: 20,
    },
    mainContent: {
      width: template === 'twocol' ? '70%' : '100%',
      padding: template === 'twocol' ? 20 : 0,
    },
    header: {
      marginBottom: 20,
      borderBottomWidth: config.headerBorderWidth,
      borderBottomColor: config.accentColor,
      paddingBottom: 15,
      textAlign: template === 'modern' || template === 'minimal' ? 'left' : 'center',
    },
    name: {
      fontSize: template === 'modern' ? 26 : 22,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: template === 'minimal' ? 2 : 1,
      marginBottom: 6,
      color: config.accentColor,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      fontSize: 9,
      color: config.secondaryColor,
      justifyContent: template === 'modern' || template === 'minimal' ? 'flex-start' : 'center',
    },
    contactItem: {
      marginRight: 15,
    },
    section: {
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: template === 'modern' ? 12 : 11,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      borderBottomWidth: config.sectionBorderWidth,
      borderBottomColor: template === 'modern' ? config.accentColor : '#ccc',
      paddingBottom: 3,
      marginBottom: 8,
      color: template === 'modern' ? config.accentColor : config.primaryColor,
    },
    summary: {
      fontSize: 10,
      lineHeight: 1.5,
      color: config.secondaryColor,
    },
    experienceItem: {
      marginBottom: 12,
    },
    expHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 2,
    },
    expTitle: {
      fontSize: 11,
      fontWeight: 'bold',
      color: config.primaryColor,
    },
    expCompany: {
      fontSize: 10,
      color: config.secondaryColor,
    },
    expDate: {
      fontSize: 9,
      color: config.secondaryColor,
    },
    expLocation: {
      fontSize: 9,
      color: config.secondaryColor,
    },
    bulletList: {
      marginTop: 4,
    },
    bullet: {
      flexDirection: 'row',
      marginBottom: 2,
    },
    bulletPoint: {
      width: 10,
      fontSize: 10,
      color: template === 'modern' ? config.accentColor : config.primaryColor,
    },
    bulletText: {
      flex: 1,
      fontSize: 9,
      lineHeight: 1.4,
    },
    educationItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    eduLeft: {
      flex: 1,
    },
    eduDegree: {
      fontSize: 10,
      fontWeight: 'bold',
    },
    eduSchool: {
      fontSize: 9,
      color: config.secondaryColor,
    },
    eduRight: {
      fontSize: 9,
      color: config.secondaryColor,
      textAlign: 'right',
    },
    skillsText: {
      fontSize: 9,
      lineHeight: 1.5,
    },
    certsText: {
      fontSize: 9,
      lineHeight: 1.5,
    },
    federalMeta: {
      fontSize: 8,
      color: config.secondaryColor,
      marginTop: 2,
    },
    // Sidebar styles for two-column layout
    sidebarSection: {
      marginBottom: 15,
    },
    sidebarTitle: {
      fontSize: 10,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      marginBottom: 8,
      color: config.accentColor,
    },
    sidebarText: {
      fontSize: 9,
      lineHeight: 1.5,
      color: config.primaryColor,
    },
    skillTag: {
      backgroundColor: '#e5e7eb',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 3,
      marginRight: 4,
      marginBottom: 4,
      fontSize: 8,
    },
  })
}

// Legacy styles for backward compatibility
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#1a1a1a',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#1a1a1a',
    paddingBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 9,
    color: '#444',
  },
  contactItem: {
    marginRight: 15,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 3,
    marginBottom: 8,
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#333',
  },
  experienceItem: {
    marginBottom: 12,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  expTitle: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  expCompany: {
    fontSize: 10,
    color: '#444',
  },
  expDate: {
    fontSize: 9,
    color: '#666',
  },
  expLocation: {
    fontSize: 9,
    color: '#666',
  },
  bulletList: {
    marginTop: 4,
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.4,
  },
  educationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  eduLeft: {
    flex: 1,
  },
  eduDegree: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  eduSchool: {
    fontSize: 9,
    color: '#444',
  },
  eduRight: {
    fontSize: 9,
    color: '#666',
    textAlign: 'right',
  },
  skillsText: {
    fontSize: 9,
    lineHeight: 1.5,
  },
  certsText: {
    fontSize: 9,
    lineHeight: 1.5,
  },
  federalMeta: {
    fontSize: 8,
    color: '#666',
    marginTop: 2,
  },
})

interface ResumeDocumentProps {
  content: any
  resumeType: 'private' | 'federal'
  template?: TemplateId
}

export function ResumeDocument({ content, resumeType, template = 'clean' }: ResumeDocumentProps) {
  const contact = content.contact || {}
  const experiences = content.experiences || []
  const education = content.education || []
  const certifications = content.certifications || []
  const skills = content.skills || []
  // Federal-specific data
  const profile = content.profile || {}
  const training = content.training || []
  const languages = content.languages || []
  const affiliations = content.affiliations || []
  const publications = content.publications || []

  // Get template-specific styles
  const templateStyles = getTemplateStyles(template)
  const isTwoColumn = template === 'twocol'

  // Two-column layout
  if (isTwoColumn) {
    return (
      <Document>
        <Page size="LETTER" style={templateStyles.page}>
          <View style={templateStyles.twoColContainer}>
            {/* Sidebar */}
            <View style={templateStyles.sidebar}>
              {/* Contact Info */}
              <View style={templateStyles.sidebarSection}>
                <Text style={templateStyles.name}>
                  {contact.first_name} {contact.last_name}
                </Text>
                {contact.email && <Text style={templateStyles.sidebarText}>{contact.email}</Text>}
                {contact.phone && <Text style={templateStyles.sidebarText}>{formatPhoneForDisplay(contact.phone)}</Text>}
                {contact.city && (
                  <Text style={templateStyles.sidebarText}>
                    {contact.city}, {contact.state}
                  </Text>
                )}
              </View>

              {/* Skills */}
              {skills.length > 0 && (
                <View style={templateStyles.sidebarSection}>
                  <Text style={templateStyles.sidebarTitle}>Skills</Text>
                  <Text style={templateStyles.sidebarText}>
                    {skills.map((s: any) => s.name).join('\n• ')}
                  </Text>
                </View>
              )}

              {/* Education */}
              {education.length > 0 && (
                <View style={templateStyles.sidebarSection}>
                  <Text style={templateStyles.sidebarTitle}>Education</Text>
                  {education.map((edu: any, idx: number) => {
                    const degreeDisplay = edu.degree_type
                      ? getDegreeLabel(edu.degree_type)
                      : edu.degree
                    const schoolName = edu.school_name || edu.institution

                    return (
                      <View key={idx} style={{ marginBottom: 6 }}>
                        <Text style={templateStyles.sidebarText}>{degreeDisplay}</Text>
                        <Text style={{ ...templateStyles.sidebarText, fontSize: 8 }}>{schoolName}</Text>
                      </View>
                    )
                  })}
                </View>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <View style={templateStyles.sidebarSection}>
                  <Text style={templateStyles.sidebarTitle}>Certifications</Text>
                  <Text style={templateStyles.sidebarText}>
                    {certifications.map((c: any) => c.name).join('\n• ')}
                  </Text>
                </View>
              )}
            </View>

            {/* Main Content */}
            <View style={templateStyles.mainContent}>
              {/* Summary */}
              {content.summary && (
                <View style={templateStyles.section}>
                  <Text style={templateStyles.sectionTitle}>Professional Summary</Text>
                  <Text style={templateStyles.summary}>{content.summary}</Text>
                </View>
              )}

              {/* Experience */}
              {experiences.length > 0 && (
                <View style={templateStyles.section}>
                  <Text style={templateStyles.sectionTitle}>Professional Experience</Text>
                  {experiences.map((exp: any, idx: number) => (
                    <View key={idx} style={templateStyles.experienceItem}>
                      <View style={templateStyles.expHeader}>
                        <View>
                          <Text style={templateStyles.expTitle}>
                            {exp.civilian_title || exp.job_title}
                          </Text>
                          <Text style={templateStyles.expCompany}>{exp.organization}</Text>
                        </View>
                        <View>
                          <Text style={templateStyles.expDate}>
                            {formatDateRange(exp.start_date, exp.end_date, exp.is_current, resumeType)}
                          </Text>
                        </View>
                      </View>

                      {exp.bullets && exp.bullets.length > 0 && (
                        <View style={templateStyles.bulletList}>
                          {exp.bullets
                            .filter((bullet: any) => bullet.status !== 'excluded')
                            .map((bullet: any, bIdx: number) => (
                              <View key={bIdx} style={templateStyles.bullet}>
                                <Text style={templateStyles.bulletPoint}>•</Text>
                                <Text style={templateStyles.bulletText}>
                                  {bullet.is_accepted || bullet.status === 'accepted'
                                    ? bullet.translated_text
                                    : bullet.translated_text || bullet.original_text}
                                </Text>
                              </View>
                            ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </Page>
      </Document>
    )
  }

  // Standard single-column layout (all other templates)
  return (
    <Document>
      <Page size="LETTER" style={templateStyles.page}>
        {/* Header */}
        <View style={templateStyles.header}>
          <Text style={templateStyles.name}>
            {contact.first_name} {contact.last_name}
          </Text>
          <View style={templateStyles.contactRow}>
            {contact.email && <Text style={templateStyles.contactItem}>{contact.email}</Text>}
            {contact.phone && <Text style={templateStyles.contactItem}>{formatPhoneForDisplay(contact.phone)}</Text>}
            {contact.city && (
              <Text style={templateStyles.contactItem}>
                {contact.city}, {contact.state}
              </Text>
            )}
            {contact.linkedin_url && (
              <Text style={templateStyles.contactItem}>{contact.linkedin_url}</Text>
            )}
          </View>
        </View>

        {/* Summary */}
        {content.summary && (
          <View style={templateStyles.section}>
            <Text style={templateStyles.sectionTitle}>Professional Summary</Text>
            <Text style={templateStyles.summary}>{content.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <View style={templateStyles.section}>
            <Text style={templateStyles.sectionTitle}>Professional Experience</Text>
            {experiences.map((exp: any, idx: number) => (
              <View key={idx} style={templateStyles.experienceItem}>
                <View style={templateStyles.expHeader}>
                  <View>
                    <Text style={templateStyles.expTitle}>
                      {exp.civilian_title || exp.job_title}
                      {resumeType === 'federal' && exp.grade_level ? `, ${exp.grade_level}` : ''}
                    </Text>
                    <Text style={templateStyles.expCompany}>{exp.organization}</Text>
                  </View>
                  <View>
                    <Text style={templateStyles.expDate}>
                      {formatDateRange(exp.start_date, exp.end_date, exp.is_current, resumeType)}
                    </Text>
                    {exp.location && (
                      <Text style={templateStyles.expLocation}>{exp.location}</Text>
                    )}
                  </View>
                </View>

                {resumeType === 'federal' && (
                  <Text style={templateStyles.federalMeta}>
                    {exp.hours_per_week || 40} hours/week | Supervisor: Available upon request
                  </Text>
                )}

                {exp.bullets && exp.bullets.length > 0 && (
                  <View style={templateStyles.bulletList}>
                    {exp.bullets
                      .filter((bullet: any) => bullet.status !== 'excluded')
                      .map((bullet: any, bIdx: number) => (
                        <View key={bIdx} style={templateStyles.bullet}>
                          <Text style={templateStyles.bulletPoint}>•</Text>
                          <Text style={templateStyles.bulletText}>
                            {bullet.is_accepted || bullet.status === 'accepted'
                              ? bullet.translated_text
                              : bullet.translated_text || bullet.original_text}
                          </Text>
                        </View>
                      ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={templateStyles.section}>
            <Text style={templateStyles.sectionTitle}>Education</Text>
            {education.map((edu: any, idx: number) => {
              // Get degree label - prefer degree_type, fall back to degree
              const degreeDisplay = edu.degree_type
                ? getDegreeLabel(edu.degree_type)
                : edu.degree

              // Get graduation date - prefer new format, fall back to legacy
              const gradDate = edu.graduation_month || edu.graduation_year
                ? formatGraduationDateShort(edu.graduation_month, edu.graduation_year)
                : (() => {
                    const { month, year } = parseLegacyGraduationDate(edu.graduation_date)
                    return formatGraduationDateShort(month, year)
                  })()

              // Support both school_name (new) and institution (legacy)
              const schoolName = edu.school_name || edu.institution

              return (
                <View key={idx} style={templateStyles.educationItem}>
                  <View style={templateStyles.eduLeft}>
                    <Text style={templateStyles.eduDegree}>
                      {degreeDisplay}{edu.field_of_study ? ` in ${edu.field_of_study}` : ''}
                    </Text>
                    <Text style={templateStyles.eduSchool}>{schoolName}</Text>
                  </View>
                  <View>
                    <Text style={templateStyles.eduRight}>{gradDate}</Text>
                    {/* GPA: always show for federal, optional for private */}
                    {resumeType === 'federal' && (
                      <Text style={templateStyles.eduRight}>GPA: {edu.gpa || 'N/A'}</Text>
                    )}
                    {resumeType === 'private' && edu.gpa && (
                      <Text style={templateStyles.eduRight}>GPA: {edu.gpa}</Text>
                    )}
                  </View>
                </View>
              )
            })}
          </View>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <View style={templateStyles.section}>
            <Text style={templateStyles.sectionTitle}>Certifications</Text>
            <Text style={templateStyles.certsText}>
              {certifications.map((c: any) => c.name).join(' • ')}
            </Text>
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={templateStyles.section}>
            <Text style={templateStyles.sectionTitle}>Skills</Text>
            <Text style={templateStyles.skillsText}>
              {skills.map((s: any) => s.name).join(' • ')}
            </Text>
          </View>
        )}

        {/* === FEDERAL-ONLY SECTIONS === */}
        {resumeType === 'federal' && (
          <>
            {/* Security Clearance */}
            {profile.clearance && profile.clearance !== 'none' && (
              <View style={templateStyles.section}>
                <Text style={templateStyles.sectionTitle}>Security Clearance</Text>
                <Text style={templateStyles.skillsText}>{formatClearance(profile.clearance)}</Text>
              </View>
            )}

            {/* Job-Related Training */}
            {training.length > 0 && (
              <View style={templateStyles.section}>
                <Text style={templateStyles.sectionTitle}>Job-Related Training</Text>
                <View style={templateStyles.bulletList}>
                  {training.map((t: any, idx: number) => (
                    <View key={idx} style={templateStyles.bullet}>
                      <Text style={templateStyles.bulletPoint}>•</Text>
                      <Text style={templateStyles.bulletText}>
                        {t.name}
                        {t.provider && ` – ${t.provider}`}
                        {t.completion_date && ` (${t.completion_date})`}
                        {t.hours && ` – ${t.hours} hours`}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Language Skills */}
            {languages.length > 0 && (
              <View style={templateStyles.section}>
                <Text style={templateStyles.sectionTitle}>Language Skills</Text>
                <View style={templateStyles.bulletList}>
                  {languages.map((lang: any, idx: number) => (
                    <View key={idx} style={templateStyles.bullet}>
                      <Text style={templateStyles.bulletPoint}>•</Text>
                      <Text style={templateStyles.bulletText}>
                        {lang.language}: {getProficiencyLabel(lang.proficiency)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Professional Affiliations */}
            {affiliations.length > 0 && (
              <View style={templateStyles.section}>
                <Text style={templateStyles.sectionTitle}>Professional Affiliations</Text>
                <View style={templateStyles.bulletList}>
                  {affiliations.map((aff: any, idx: number) => (
                    <View key={idx} style={templateStyles.bullet}>
                      <Text style={templateStyles.bulletPoint}>•</Text>
                      <Text style={templateStyles.bulletText}>
                        {aff.name}
                        {aff.role && ` – ${aff.role}`}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Publications */}
            {publications.length > 0 && (
              <View style={templateStyles.section}>
                <Text style={templateStyles.sectionTitle}>Publications</Text>
                <View style={templateStyles.bulletList}>
                  {publications.map((pub: any, idx: number) => (
                    <View key={idx} style={templateStyles.bullet}>
                      <Text style={templateStyles.bulletPoint}>•</Text>
                      <Text style={templateStyles.bulletText}>
                        {pub.title}
                        {pub.publication && `, ${pub.publication}`}
                        {pub.date && ` (${pub.date})`}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Special Hiring Authorities */}
            {profile.special_eligibility?.length > 0 && (
              <View style={templateStyles.section}>
                <Text style={templateStyles.sectionTitle}>Special Hiring Authorities</Text>
                <View style={templateStyles.bulletList}>
                  {profile.special_eligibility.map((elig: string, idx: number) => (
                    <View key={idx} style={templateStyles.bullet}>
                      <Text style={templateStyles.bulletPoint}>•</Text>
                      <Text style={templateStyles.bulletText}>{elig}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </Page>
    </Document>
  )
}
