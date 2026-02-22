import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import { formatPhoneForDisplay } from '@/lib/formatPhone'
import {
  getDegreeLabel,
  formatGraduationDateShort,
  parseLegacyGraduationDate,
} from '@/lib/constants/education'
import { formatDateRange, formatClearance } from '@/lib/utils/formatResume'
import { getProficiencyLabel } from '@/lib/constants/federalEligibility'
import { TemplateId, resolveTemplate } from '@/lib/templates'
import { trimForFederalLimit } from '@/lib/resume/federalTrimmer'

// =========================================
// GOOGLE FONT REGISTRATION
// =========================================

// Executive: Source Serif 4 + Source Sans 3
Font.register({
  family: 'Source Serif 4',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/sourceserif4/v14/vEFy2_tTDB4M7-auWDN0ahZJW3IX2ih5nk3AucvUHf6OAVIJmeUDygwjihdqrhw.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/sourceserif4/v14/vEFy2_tTDB4M7-auWDN0ahZJW3IX2ih5nk3AucvUHf6OAVIJmeUDygwjivBtrhw.ttf', fontWeight: 700 },
    { src: 'https://fonts.gstatic.com/s/sourceserif4/v14/vEF02_tTDB4M7-auWDN0ahZJW1ge6NmXpVAHV83Bfb_US2D2QYxoUKIkn98pRl9dCw.ttf', fontWeight: 400, fontStyle: 'italic' },
  ],
})

Font.register({
  family: 'Source Sans 3',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/sourcesans3/v19/nwpBtKy2OAdR1K-IwhWudF-R9QMylBJAV3Bo8Ky461EN.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/sourcesans3/v19/nwpBtKy2OAdR1K-IwhWudF-R9QMylBJAV3Bo8Kxf7FEN.ttf', fontWeight: 700 },
    { src: 'https://fonts.gstatic.com/s/sourcesans3/v19/nwpDtKy2OAdR1K-IwhWudF-R3woAa8opPOrG97lwqLlO9C4.ttf', fontWeight: 400, fontStyle: 'italic' },
  ],
})

// Classic Professional: Libre Baskerville + Lato
Font.register({
  family: 'Libre Baskerville',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/librebaskerville/v24/kmKUZrc3Hgbbcjq75U4uslyuy4kn0olVQ-LglH6T17uj8Q4SCQ.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/librebaskerville/v24/kmKUZrc3Hgbbcjq75U4uslyuy4kn0olVQ-LglH6T17ujFgkSCQ.ttf', fontWeight: 700 },
    { src: 'https://fonts.gstatic.com/s/librebaskerville/v24/kmKWZrc3Hgbbcjq75U4uslyuy4kn0qNccR04_RUJeby2OU36SgNK.ttf', fontWeight: 400, fontStyle: 'italic' },
  ],
})

Font.register({
  family: 'Lato',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/lato/v25/S6uyw4BMUTPHvxk.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/lato/v25/S6u9w4BMUTPHh6UVew8.ttf', fontWeight: 700 },
    { src: 'https://fonts.gstatic.com/s/lato/v25/S6u8w4BMUTPHjxswWw.ttf', fontWeight: 400, fontStyle: 'italic' },
  ],
})

// Federal: Merriweather + Open Sans
Font.register({
  family: 'Merriweather',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/merriweather/v33/u-4D0qyriQwlOrhSvowK_l5UcA6zuSYEqOzpPe3HOZJ5eX1WtLaQwmYiScCmDxhtNOKl8yDr3icqEw.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/merriweather/v33/u-4D0qyriQwlOrhSvowK_l5UcA6zuSYEqOzpPe3HOZJ5eX1WtLaQwmYiScCmDxhtNOKl8yDrOSAqEw.ttf', fontWeight: 700 },
    { src: 'https://fonts.gstatic.com/s/merriweather/v33/u-4B0qyriQwlOrhSvowK_l5-eTxCVx0ZbwLvKH2Gk9hLmp0v5yA-xXPqCzLvPee1XYk_XSf-FmTCUF3w.ttf', fontWeight: 400, fontStyle: 'italic' },
  ],
})

Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/opensans/v44/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0C4n.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/opensans/v44/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1y4n.ttf', fontWeight: 700 },
    { src: 'https://fonts.gstatic.com/s/opensans/v44/memQYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWq8tWZ0Pw86hd0Rk8ZkaVc.ttf', fontWeight: 400, fontStyle: 'italic' },
  ],
})

// Modern: DM Serif Display + DM Sans
Font.register({
  family: 'DM Serif Display',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/dmserifdisplay/v17/-nFnOHM81r4j6k0gjAW3mujVU2B2K_c.ttf', fontWeight: 400 },
  ],
})

Font.register({
  family: 'DM Sans',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/dmsans/v17/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAopxhTg.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/dmsans/v17/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwARZthTg.ttf', fontWeight: 700 },
    { src: 'https://fonts.gstatic.com/s/dmsans/v17/rP2rp2ywxg089UriCZaSExd86J3t9jz86Mvy4qCRAL19DksVat-JDW3z.ttf', fontWeight: 400, fontStyle: 'italic' },
  ],
})

// Minimal: Cormorant Garamond + Nunito Sans
Font.register({
  family: 'Cormorant Garamond',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_v86GnM.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_hg9GnM.ttf', fontWeight: 700 },
    { src: 'https://fonts.gstatic.com/s/cormorantgaramond/v21/co3smX5slCNuHLi8bLeY9MK7whWMhyjYrGFEsdtdc62E6zd58jDOjw.ttf', fontWeight: 400, fontStyle: 'italic' },
  ],
})

Font.register({
  family: 'Nunito Sans',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/nunitosans/v19/pe1mMImSLYBIv1o4X1M8ce2xCx3yop4tQpF_MeTm0lfGWVpNn64CL7U8upHZIbMV51Q42ptCp5F5bxqqtQ1yiU4G1ilntA.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/nunitosans/v19/pe1mMImSLYBIv1o4X1M8ce2xCx3yop4tQpF_MeTm0lfGWVpNn64CL7U8upHZIbMV51Q42ptCp5F5bxqqtQ1yiU4GMS5ntA.ttf', fontWeight: 700 },
    { src: 'https://fonts.gstatic.com/s/nunitosans/v19/pe1kMImSLYBIv1o4X1M8cce4OdVisMz5nZRqy6cmmmU3t2FQWEAEOvV9wNvrwlNstMKW3Y6K5WMwXeVy3GboJ0kTHmqP91Ug.ttf', fontWeight: 400, fontStyle: 'italic' },
  ],
})

// Two Column: Bitter + Karla
Font.register({
  family: 'Bitter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/bitter/v40/raxhHiqOu8IVPmnRc6SY1KXhnF_Y8fbfCL8.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/bitter/v40/raxhHiqOu8IVPmnRc6SY1KXhnF_Y8RHYCL8.ttf', fontWeight: 700 },
    { src: 'https://fonts.gstatic.com/s/bitter/v40/raxjHiqOu8IVPmn7epZnDMyKBvHf5D6c4PzOWA.ttf', fontWeight: 400, fontStyle: 'italic' },
  ],
})

Font.register({
  family: 'Karla',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/karla/v33/qkBIXvYC6trAT55ZBi1ueQVIjQTD-JqqFA.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/karla/v33/qkBIXvYC6trAT55ZBi1ueQVIjQTDH52qFA.ttf', fontWeight: 700 },
    { src: 'https://fonts.gstatic.com/s/karla/v33/qkBKXvYC6trAT7RQNNK2EG7SIwPWMNlCV0lP.ttf', fontWeight: 400, fontStyle: 'italic' },
  ],
})

// Prevent hyphenation crashes on unknown words
Font.registerHyphenationCallback(word => [word])

interface ResumeDocumentProps {
  content: any
  resumeType: 'private' | 'federal'
  template?: TemplateId
}

// Filter out placeholder/empty bullets from export
function isPlaceholderBullet(text: string): boolean {
  if (!text || text.trim() === '') return true
  const lower = text.trim().toLowerCase()
  return (
    lower.includes('new bullet') ||
    lower.includes('click to edit') ||
    lower.includes('[x]')
  )
}

// Shared helpers
function getGradDate(edu: any): string {
  if (edu.graduation_month || edu.graduation_year) {
    return formatGraduationDateShort(edu.graduation_month, edu.graduation_year)
  }
  const { month, year } = parseLegacyGraduationDate(edu.graduation_date)
  return formatGraduationDateShort(month, year)
}

function getDegree(edu: any): string {
  const degree = edu.degree_type ? getDegreeLabel(edu.degree_type) : edu.degree
  return edu.field_of_study ? `${degree} in ${edu.field_of_study}` : degree
}

function getSchool(edu: any): string {
  return edu.school_name || edu.institution
}

export function ResumeDocument({ content, resumeType, template: rawTemplate = 'classic_professional' }: ResumeDocumentProps) {
  const template = resolveTemplate(rawTemplate)
  const contact = content.contact || {}
  const experiences = content.experiences || []
  const education = content.education || []
  const certifications = content.certifications || []
  const skills = content.skills || []
  const profile = content.profile || {}
  const training = content.training || []
  const languages = content.languages || []
  const affiliations = content.affiliations || []
  const publications = content.publications || []

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
  const shortLinkedIn = contact.linkedin_url
    ? contact.linkedin_url.replace(/^https?:\/\/(www\.)?/, '')
    : null

  // Build location from non-empty parts only
  const contactLocation = [contact.city, contact.state].filter(Boolean).join(', ')

  const contactLine = [
    contact.email,
    contact.phone ? formatPhoneForDisplay(contact.phone) : null,
    contactLocation || null,
    shortLinkedIn,
  ].filter(Boolean).join(' | ')

  // =========================================
  // EXECUTIVE TEMPLATE
  // =========================================
  if (template === 'executive') {
    const s = StyleSheet.create({
      page: { padding: 0, fontSize: 10, fontFamily: 'Source Sans 3', color: '#333333' },
      header: { paddingHorizontal: 48, paddingTop: 32, paddingBottom: 16, textAlign: 'center' },
      accentLine: { width: '100%', height: 1, backgroundColor: '#b8943e', marginTop: 10 },
      name: { fontSize: 30, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, color: '#1a2a44', fontFamily: 'Source Serif 4' },
      targetRole: { fontSize: 11, color: '#8a7a5a', marginTop: 4, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 'bold' },
      contactLine: { fontSize: 9.5, color: '#555555', marginTop: 8 },
      body: { flexDirection: 'row' },
      main: { flex: 1, paddingTop: 20, paddingRight: 24, paddingBottom: 24, paddingLeft: 48 },
      sidebar: { width: 200, paddingTop: 20, paddingRight: 36, paddingBottom: 24, paddingLeft: 16, borderLeftWidth: 1, borderLeftColor: '#d4d4d4' },
      sectionTitle: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.2, color: '#1a2a44', fontFamily: 'Source Serif 4', paddingBottom: 4, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#b8943e' },
      section: { marginBottom: 18 },
      expItem: { marginBottom: 12 },
      expRow: { flexDirection: 'row', justifyContent: 'space-between' },
      expTitle: { fontSize: 11.5, fontWeight: 'bold', color: '#1a2a44' },
      expDate: { fontSize: 10, color: '#777777' },
      expCompany: { fontSize: 10.5, color: '#666666', fontStyle: 'italic', marginBottom: 3 },
      bullet: { flexDirection: 'row', marginBottom: 2 },
      bulletChar: { width: 10, fontSize: 10.5, color: '#333333' },
      bulletText: { flex: 1, fontSize: 10.5, lineHeight: 1.45, color: '#333333' },
      sideSectionTitle: { fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, color: '#1a2a44', fontFamily: 'Source Serif 4', paddingBottom: 3, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: '#b8943e' },
      sideSection: { marginBottom: 14 },
    })

    return (
      <Document>
        <Page size="LETTER" style={s.page}>
          <View style={s.header}>
            <Text style={s.name}>{contact.first_name} {contact.last_name}</Text>
            {content.target?.role && <Text style={s.targetRole}>{content.target.role}</Text>}
            <Text style={s.contactLine}>{contactLine}</Text>
            <View style={s.accentLine} />
          </View>

          <View style={s.body}>
            {/* Main column: Summary + Experience */}
            <View style={s.main}>
              {content.summary && (
                <View style={s.section} wrap={false}>
                  <Text style={s.sectionTitle}>Professional Summary</Text>
                  <Text style={{ fontSize: 10.5, lineHeight: 1.6, color: '#333333' }}>{content.summary}</Text>
                </View>
              )}

              {experiences.length > 0 && (
                <View style={s.section}>
                  {experiences.map((exp: any, idx: number) => {
                    const bullets = filterBullets(exp.bullets)
                    return (
                      <View key={idx} style={s.expItem}>
                        <View wrap={false}>
                          {idx === 0 && <Text style={s.sectionTitle}>Professional Experience</Text>}
                          <View style={s.expRow}>
                            <Text style={s.expTitle}>{exp.civilian_title || exp.job_title}</Text>
                            <Text style={s.expDate}>{formatDateRange(exp.start_date, exp.end_date, exp.is_current, resumeType)}</Text>
                          </View>
                          <Text style={s.expCompany}>{exp.organization}{exp.location ? ` | ${exp.location}` : ''}</Text>
                          {bullets.length > 0 && (
                            <View style={s.bullet} wrap={false}>
                              <Text style={s.bulletChar}>{'\u2022'}</Text>
                              <Text style={s.bulletText}>{getBulletText(bullets[0])}</Text>
                            </View>
                          )}
                        </View>
                        {bullets.slice(1).map((b: any, bi: number) => (
                          <View key={bi} style={s.bullet} wrap={false}>
                            <Text style={s.bulletChar}>{'\u2022'}</Text>
                            <Text style={s.bulletText}>{getBulletText(b)}</Text>
                          </View>
                        ))}
                      </View>
                    )
                  })}
                </View>
              )}
            </View>

            {/* Sidebar: Skills, Certifications, Education */}
            <View style={s.sidebar}>
              {skills.length > 0 && (
                <View style={s.sideSection}>
                  <Text style={s.sideSectionTitle}>Core Competencies</Text>
                  {skills.map((sk: any, idx: number) => (
                    <Text key={idx} style={{ fontSize: 10, color: '#444444', marginBottom: 2 }}>{'\u2022'} {sk.name}</Text>
                  ))}
                </View>
              )}

              {certifications.length > 0 && (
                <View style={s.sideSection}>
                  <Text style={s.sideSectionTitle}>Certifications</Text>
                  {certifications.map((c: any, idx: number) => (
                    <View key={idx} style={{ marginBottom: 4 }}>
                      <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#1a2a44' }}>{c.name}</Text>
                      {c.issuing_org && <Text style={{ fontSize: 9, color: '#777777' }}>{c.issuing_org}</Text>}
                    </View>
                  ))}
                </View>
              )}

              {education.length > 0 && (
                <View style={s.sideSection}>
                  <Text style={s.sideSectionTitle}>Education</Text>
                  {education.map((edu: any, idx: number) => (
                    <View key={idx} style={{ marginBottom: 6 }}>
                      <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#1a2a44' }}>{getDegree(edu)}</Text>
                      <Text style={{ fontSize: 9.5, color: '#666666' }}>{getSchool(edu)}</Text>
                      <Text style={{ fontSize: 9, color: '#888888' }}>{getGradDate(edu)}</Text>
                    </View>
                  ))}
                </View>
              )}

              {profile.clearance && profile.clearance !== 'none' && (
                <View style={s.sideSection}>
                  <Text style={s.sideSectionTitle}>Security Clearance</Text>
                  <Text style={{ fontSize: 10, color: '#444444' }}>{formatClearance(profile.clearance)}</Text>
                </View>
              )}
            </View>
          </View>
        </Page>
      </Document>
    )
  }

  // =========================================
  // CLASSIC PROFESSIONAL TEMPLATE
  // =========================================
  if (template === 'classic_professional') {
    const s = StyleSheet.create({
      page: { paddingTop: 36, paddingHorizontal: 56, paddingBottom: 40, fontSize: 10, fontFamily: 'Lato', color: '#1a1a1a' },
      header: { textAlign: 'center', paddingBottom: 14, marginBottom: 18, borderBottomWidth: 2, borderBottomColor: '#1a1a1a' },
      name: { fontSize: 30, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Libre Baskerville' },
      targetRole: { fontSize: 13, color: '#666666', marginTop: 3, letterSpacing: 1, textTransform: 'uppercase' },
      contactLine: { fontSize: 9.5, color: '#444444', marginTop: 6 },
      sectionTitle: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Libre Baskerville', borderBottomWidth: 1, borderBottomColor: '#c0c0c0', paddingBottom: 4, marginBottom: 10 },
      section: { marginBottom: 22 },
      compGrid: { flexDirection: 'row', flexWrap: 'wrap' },
      compItem: { width: '33%', flexDirection: 'row', marginBottom: 3 },
      compBullet: { width: 10, fontSize: 11, color: '#1a1a1a' },
      compText: { flex: 1, fontSize: 11, color: '#333333' },
      expRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
      expTitle: { fontSize: 13, fontWeight: 'bold', color: '#1a1a1a' },
      expDate: { fontSize: 11, color: '#666666', fontWeight: 'bold' },
      expCompany: { fontSize: 11.5, color: '#555555', fontStyle: 'italic', marginBottom: 3 },
      bullet: { flexDirection: 'row', marginBottom: 2 },
      bulletChar: { width: 10, fontSize: 11, color: '#1a1a1a' },
      bulletText: { flex: 1, fontSize: 11, lineHeight: 1.4, color: '#333333' },
      eduGrid: { flexDirection: 'row', flexWrap: 'wrap' },
      eduItem: { width: '50%', marginBottom: 6, paddingRight: 10 },
    })

    return (
      <Document>
        <Page size="LETTER" style={s.page}>
          <View style={s.header}>
            <Text style={s.name}>{contact.first_name} {contact.last_name}</Text>
            {content.target?.role && <Text style={s.targetRole}>{content.target.role}</Text>}
            <Text style={s.contactLine}>{contactLine}</Text>
          </View>

          {content.summary && (
            <View style={s.section} wrap={false}>
              <Text style={s.sectionTitle}>Professional Summary</Text>
              <Text style={{ fontSize: 11.5, lineHeight: 1.7, color: '#333333' }}>{content.summary}</Text>
            </View>
          )}

          {skills.length > 0 && (
            <View style={s.section} wrap={false}>
              <Text style={s.sectionTitle}>Core Competencies</Text>
              <View style={s.compGrid}>
                {skills.map((sk: any, idx: number) => (
                  <View key={idx} style={s.compItem}>
                    <Text style={s.compBullet}>{'\u2022'}</Text>
                    <Text style={s.compText}>{sk.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {experiences.length > 0 && (
            <View style={s.section}>
              {experiences.map((exp: any, idx: number) => {
                const bullets = filterBullets(exp.bullets)
                return (
                  <View key={idx} style={{ marginBottom: 10 }}>
                    <View wrap={false}>
                      {idx === 0 && <Text style={s.sectionTitle}>Professional Experience</Text>}
                      <View style={s.expRow}>
                        <Text style={s.expTitle}>{exp.civilian_title || exp.job_title}</Text>
                        <Text style={s.expDate}>{formatDateRange(exp.start_date, exp.end_date, exp.is_current, resumeType)}</Text>
                      </View>
                      <Text style={s.expCompany}>{exp.organization}{exp.location ? ` | ${exp.location}` : ''}</Text>
                      {bullets.length > 0 && (
                        <View style={s.bullet} wrap={false}>
                          <Text style={s.bulletChar}>{'\u2022'}</Text>
                          <Text style={s.bulletText}>{getBulletText(bullets[0])}</Text>
                        </View>
                      )}
                    </View>
                    {bullets.slice(1).map((b: any, bi: number) => (
                      <View key={bi} style={s.bullet} wrap={false}>
                        <Text style={s.bulletChar}>{'\u2022'}</Text>
                        <Text style={s.bulletText}>{getBulletText(b)}</Text>
                      </View>
                    ))}
                  </View>
                )
              })}
            </View>
          )}

          {education.length > 0 && (
            <View style={s.section} wrap={false}>
              <Text style={s.sectionTitle}>Education</Text>
              <View style={s.eduGrid}>
                {education.map((edu: any, idx: number) => (
                  <View key={idx} style={s.eduItem}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1a1a1a' }}>{getDegree(edu)}</Text>
                    <Text style={{ fontSize: 11, color: '#555555' }}>{getSchool(edu)}</Text>
                    <Text style={{ fontSize: 10, color: '#777777' }}>{getGradDate(edu)}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {certifications.length > 0 && (
            <View style={s.section} wrap={false}>
              <Text style={s.sectionTitle}>Certifications</Text>
              <Text style={{ fontSize: 11, lineHeight: 1.8, color: '#333333' }}>{certifications.map((c: any) => c.name).join(' \u00b7 ')}</Text>
            </View>
          )}

          {resumeType === 'federal' && profile.clearance && profile.clearance !== 'none' && (
            <View style={s.section} wrap={false}>
              <Text style={s.sectionTitle}>Security Clearance</Text>
              <Text style={{ fontSize: 11, color: '#333333' }}>{formatClearance(profile.clearance)}</Text>
            </View>
          )}
        </Page>
      </Document>
    )
  }

  // =========================================
  // FEDERAL TEMPLATE
  // =========================================
  if (template === 'federal') {
    // Apply federal 2-page trimmer
    const fedContent = trimForFederalLimit({
      ...content,
      experiences,
      education,
      certifications,
      training,
      languages,
      affiliations,
      publications,
    })
    const fedExperiences = fedContent.experiences || []
    const fedEducation = fedContent.education || []
    const fedCertifications = fedContent.certifications || []
    const fedTraining = fedContent.training || []
    const fedLanguages = fedContent.languages || []
    const fedAffiliations = fedContent.affiliations || []
    const fedPublications = fedContent.publications || []
    const fedSummary = fedContent.summary ?? content.summary

    const s = StyleSheet.create({
      page: { padding: 0, fontSize: 10, fontFamily: 'Open Sans', color: '#333333' },
      header: { paddingTop: 28, paddingHorizontal: 40, paddingBottom: 20, borderBottomWidth: 3, borderBottomColor: '#000000' },
      name: { fontSize: 22, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, color: '#000000', fontFamily: 'Merriweather' },
      infoGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
      infoItem: { width: '50%', flexDirection: 'row', marginBottom: 2 },
      infoLabel: { fontWeight: 'bold', color: '#000000', fontSize: 10, marginRight: 4 },
      infoValue: { fontSize: 10, color: '#333333' },
      body: { paddingTop: 18, paddingHorizontal: 40, paddingBottom: 36 },
      sectionTitle: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.8, color: '#ffffff', backgroundColor: '#000000', paddingHorizontal: 10, paddingVertical: 4, fontFamily: 'Merriweather', marginBottom: 8 },
      section: { marginBottom: 14 },
      expTitle: { fontSize: 12, fontWeight: 'bold', color: '#000000' },
      expOrg: { fontSize: 10.5, fontWeight: 'bold', color: '#333333' },
      expMeta: { fontSize: 9.5, color: '#555555' },
      expMetaLabel: { fontWeight: 'bold', color: '#333333' },
      dutiesHeader: { fontSize: 10, fontWeight: 'bold', color: '#000000', textTransform: 'uppercase', marginTop: 6, marginBottom: 3 },
      bullet: { flexDirection: 'row', marginBottom: 1 },
      bulletChar: { width: 10, fontSize: 10, color: '#000000' },
      bulletText: { flex: 1, fontSize: 10, lineHeight: 1.25, color: '#333333' },
    })

    return (
      <Document>
        <Page size="LETTER" style={s.page}>
          <View style={s.header}>
            <Text style={s.name}>{contact.first_name} {contact.last_name}</Text>
            <View style={s.infoGrid}>
              {contact.email && (
                <View style={s.infoItem}><Text style={s.infoLabel}>Email:</Text><Text style={s.infoValue}>{contact.email}</Text></View>
              )}
              {contact.phone && (
                <View style={s.infoItem}><Text style={s.infoLabel}>Phone:</Text><Text style={s.infoValue}>{formatPhoneForDisplay(contact.phone)}</Text></View>
              )}
              {contact.city && (
                <View style={s.infoItem}><Text style={s.infoLabel}>Address:</Text><Text style={s.infoValue}>{contact.city}{contact.state ? `, ${contact.state}` : ''}{contact.zip ? ` ${contact.zip}` : ''}</Text></View>
              )}
              {content.citizenship && content.citizenship !== '' && (
                <View style={s.infoItem}><Text style={s.infoLabel}>Citizenship:</Text><Text style={s.infoValue}>{content.citizenship === 'us_citizen' ? 'United States' : content.citizenship === 'permanent_resident' ? 'Permanent Resident' : content.citizenship}</Text></View>
              )}
              {content.veterans_preference && content.veterans_preference !== '' && content.veterans_preference !== 'none' ? (
                <View style={s.infoItem}><Text style={s.infoLabel}>Veterans&apos; Preference:</Text><Text style={s.infoValue}>{content.veterans_preference === '5_point' ? '5-Point (TP)' : content.veterans_preference === '10_point' ? '10-Point (CP/CPS/XP)' : content.veterans_preference === '10_point_30_percent' ? '10-Point/30% Disabled' : content.veterans_preference}</Text></View>
              ) : content.military?.branch ? (
                <View style={s.infoItem}><Text style={s.infoLabel}>Veterans&apos; Preference:</Text><Text style={s.infoValue}>Yes</Text></View>
              ) : null}
              {(() => {
                const cl = content.security_clearance || profile.clearance
                const st = content.clearance_status
                return cl && cl !== '' && cl !== 'none' ? (
                  <View style={s.infoItem}><Text style={s.infoLabel}>Clearance:</Text><Text style={s.infoValue}>{formatClearance(cl)}{st && st !== '' ? ` (${st.charAt(0).toUpperCase() + st.slice(1)})` : ''}</Text></View>
                ) : null
              })()}
              {content.federal_status && (
                <View style={s.infoItem}><Text style={s.infoLabel}>Highest Grade:</Text><Text style={s.infoValue}>{content.federal_status}</Text></View>
              )}
              {contact.linkedin_url && (
                <View style={s.infoItem}><Text style={s.infoLabel}>LinkedIn:</Text><Text style={s.infoValue}>{contact.linkedin_url}</Text></View>
              )}
            </View>
          </View>

          <View style={s.body}>
            {fedSummary && (
              <View style={s.section} wrap={false}>
                <Text style={s.sectionTitle}>Professional Summary</Text>
                <Text style={{ fontSize: 10, lineHeight: 1.3, color: '#333333' }}>{fedSummary}</Text>
              </View>
            )}

            {fedExperiences.length > 0 && (
              <View style={s.section}>
                {fedExperiences.map((exp: any, idx: number) => {
                  const bullets = filterBullets(exp.bullets)
                  return (
                    <View key={idx} style={{ marginBottom: 10 }}>
                      <View wrap={false}>
                        {idx === 0 && <Text style={s.sectionTitle}>Professional Experience</Text>}
                        <Text style={s.expTitle}>{exp.civilian_title || exp.job_title}</Text>
                        <Text style={s.expOrg}>{exp.organization}</Text>
                        {(exp.city || exp.state || exp.location) && (
                          <Text style={s.expMeta}><Text style={s.expMetaLabel}>Location: </Text>{exp.city ? `${exp.city}${exp.state ? `, ${exp.state}` : ''}` : exp.location}</Text>
                        )}
                        <Text style={s.expMeta}><Text style={s.expMetaLabel}>Dates: </Text>{formatDateRange(exp.start_date, exp.end_date, exp.is_current, 'federal')}</Text>
                        {exp.grade_level && <Text style={s.expMeta}><Text style={s.expMetaLabel}>Grade: </Text>{exp.grade_level}</Text>}
                        <Text style={s.expMeta}><Text style={s.expMetaLabel}>Hours per week: </Text>{exp.hours_per_week || 40}</Text>
                        {exp.salary && <Text style={s.expMeta}><Text style={s.expMetaLabel}>Salary: </Text>{exp.salary.startsWith('$') ? exp.salary : `$${exp.salary}`}</Text>}
                        <Text style={s.dutiesHeader}>Duties and Accomplishments:</Text>
                        {bullets.length > 0 && (
                          <View style={s.bullet} wrap={false}>
                            <Text style={s.bulletChar}>{'\u2022'}</Text>
                            <Text style={s.bulletText}>{getBulletText(bullets[0])}</Text>
                          </View>
                        )}
                      </View>
                      {bullets.slice(1).map((b: any, bi: number) => (
                        <View key={bi} style={s.bullet} wrap={false}>
                          <Text style={s.bulletChar}>{'\u2022'}</Text>
                          <Text style={s.bulletText}>{getBulletText(b)}</Text>
                        </View>
                      ))}
                    </View>
                  )
                })}
              </View>
            )}

            {fedEducation.length > 0 && (
              <View style={s.section}>
                {fedEducation.map((edu: any, idx: number) => (
                  <View key={idx} style={{ marginBottom: 6 }} wrap={false}>
                    {idx === 0 && <Text style={s.sectionTitle}>Education</Text>}
                    <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#000000' }}>{getDegree(edu)}</Text>
                    <Text style={{ fontSize: 10, color: '#333333' }}>{getSchool(edu)}</Text>
                    <Text style={{ fontSize: 9.5, color: '#555555' }}>
                      {getGradDate(edu)}{edu.gpa ? ` | GPA: ${edu.gpa}` : ''}{edu.credit_hours ? ` | ${edu.credit_hours} credit hours` : ''}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {fedCertifications.length > 0 && (
              <View style={s.section}>
                {fedCertifications.map((c: any, idx: number) => (
                  <View key={idx} wrap={false}>
                    {idx === 0 && <Text style={s.sectionTitle}>Certifications &amp; Licenses</Text>}
                    <View style={s.bullet} wrap={false}>
                      <Text style={s.bulletChar}>{'\u2022'}</Text>
                      <Text style={s.bulletText}>{c.name}{c.issuing_org ? ` \u2014 ${c.issuing_org}` : ''}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {skills.length > 0 && (
              <View style={s.section} wrap={false}>
                <Text style={s.sectionTitle}>Skills</Text>
                <Text style={{ fontSize: 10, color: '#333333' }}>{skills.map((sk: any) => sk.name).join(', ')}</Text>
              </View>
            )}

            {(content.security_clearance || profile.clearance || content.military?.branch) && (
              <View style={s.section} wrap={false}>
                <Text style={s.sectionTitle}>Additional Information</Text>
                <View style={s.infoGrid}>
                  {(() => {
                    const cl = content.security_clearance || profile.clearance
                    const st = content.clearance_status
                    return cl && cl !== 'none' && cl !== '' ? (
                      <View style={s.infoItem}><Text style={s.infoLabel}>Security Clearance:</Text><Text style={s.infoValue}>{formatClearance(cl)}{st && st !== '' ? ` (${st.charAt(0).toUpperCase() + st.slice(1)})` : ''}</Text></View>
                    ) : null
                  })()}
                  {content.military?.branch && (
                    <View style={s.infoItem}><Text style={s.infoLabel}>Military Service:</Text><Text style={s.infoValue}>{content.military.branch}</Text></View>
                  )}
                </View>
              </View>
            )}

            {/* Federal-only sections (trimmed) */}
            {fedTraining.length > 0 && (
              <View style={s.section}>
                {fedTraining.map((t: any, idx: number) => (
                  <View key={idx} wrap={false}>
                    {idx === 0 && <Text style={s.sectionTitle}>Job-Related Training</Text>}
                    <View style={s.bullet} wrap={false}>
                      <Text style={s.bulletChar}>{'\u2022'}</Text>
                      <Text style={s.bulletText}>{t.name}{t.provider ? ` \u2013 ${t.provider}` : ''}{t.completion_date ? ` (${t.completion_date})` : ''}{t.hours ? ` \u2013 ${t.hours} hours` : ''}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {fedLanguages.length > 0 && (
              <View style={s.section}>
                {fedLanguages.map((lang: any, idx: number) => (
                  <View key={idx} wrap={false}>
                    {idx === 0 && <Text style={s.sectionTitle}>Language Skills</Text>}
                    <View style={s.bullet} wrap={false}>
                      <Text style={s.bulletChar}>{'\u2022'}</Text>
                      <Text style={s.bulletText}>{lang.language}: {getProficiencyLabel(lang.proficiency)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {fedAffiliations.length > 0 && (
              <View style={s.section}>
                {fedAffiliations.map((aff: any, idx: number) => (
                  <View key={idx} wrap={false}>
                    {idx === 0 && <Text style={s.sectionTitle}>Professional Affiliations</Text>}
                    <View style={s.bullet} wrap={false}>
                      <Text style={s.bulletChar}>{'\u2022'}</Text>
                      <Text style={s.bulletText}>{aff.name}{aff.role ? ` \u2013 ${aff.role}` : ''}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {fedPublications.length > 0 && (
              <View style={s.section}>
                {fedPublications.map((pub: any, idx: number) => (
                  <View key={idx} wrap={false}>
                    {idx === 0 && <Text style={s.sectionTitle}>Publications</Text>}
                    <View style={s.bullet} wrap={false}>
                      <Text style={s.bulletChar}>{'\u2022'}</Text>
                      <Text style={s.bulletText}>{pub.title}{pub.publication ? `, ${pub.publication}` : ''}{pub.date ? ` (${pub.date})` : ''}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {profile.special_eligibility?.length > 0 && (
              <View style={s.section}>
                {profile.special_eligibility.map((elig: string, idx: number) => (
                  <View key={idx} wrap={false}>
                    {idx === 0 && <Text style={s.sectionTitle}>Special Hiring Authorities</Text>}
                    <View style={s.bullet} wrap={false}>
                      <Text style={s.bulletChar}>{'\u2022'}</Text>
                      <Text style={s.bulletText}>{elig}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Page>
      </Document>
    )
  }

  // =========================================
  // MODERN TEMPLATE
  // =========================================
  if (template === 'modern') {
    const s = StyleSheet.create({
      page: { padding: 0, fontSize: 10, fontFamily: 'DM Sans', color: '#444444' },
      header: { paddingTop: 40, paddingHorizontal: 52, paddingBottom: 32, backgroundColor: '#0f2b3c' },
      gradientBar: { height: 3, backgroundColor: '#3b9ec2' },
      name: { fontSize: 32, color: '#ffffff', fontFamily: 'DM Serif Display' },
      targetRole: { fontSize: 14, color: '#7cc5de', marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.5 },
      contactRow: { flexDirection: 'row', marginTop: 10 },
      contactItem: { fontSize: 9.5, color: '#b0c4ce', marginRight: 10 },
      body: { paddingTop: 28, paddingHorizontal: 52, paddingBottom: 40 },
      sectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#0f2b3c', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
      sectionUnderline: { width: 40, height: 2, backgroundColor: '#3b9ec2', marginTop: -6, marginBottom: 10 },
      section: { marginBottom: 24 },
      pill: { backgroundColor: '#f0f7fa', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, marginRight: 6, marginBottom: 6, fontSize: 10, fontWeight: 'bold', color: '#0f2b3c' },
      timelineItem: { paddingLeft: 16, borderLeftWidth: 2, borderLeftColor: '#e0e8ec', marginBottom: 14 },
      expTitle: { fontSize: 13, fontWeight: 'bold', color: '#0f2b3c' },
      expDate: { fontSize: 10, color: '#3b9ec2', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 },
      expCompany: { fontSize: 11, color: '#666666' },
      bullet: { flexDirection: 'row', marginBottom: 2 },
      bulletChar: { width: 10, fontSize: 11, color: '#3b9ec2' },
      bulletText: { flex: 1, fontSize: 11, lineHeight: 1.4, color: '#444444' },
      checkmark: { width: 12, fontSize: 11, color: '#2dd4a8' },
    })

    return (
      <Document>
        <Page size="LETTER" style={s.page}>
          <View style={s.header}>
            <Text style={s.name}>{contact.first_name} {contact.last_name}</Text>
            {content.target?.role && <Text style={s.targetRole}>{content.target.role}</Text>}
            <View style={s.contactRow}>
              {contactLine.split(' | ').map((part, i) => (
                <Text key={i} style={s.contactItem}>{'\u2022'} {part}</Text>
              ))}
            </View>
          </View>
          <View style={s.gradientBar} />

          <View style={s.body}>
            {content.summary && (
              <View style={s.section} wrap={false}>
                <Text style={s.sectionTitle}>About</Text>
                <View style={s.sectionUnderline} />
                <Text style={{ fontSize: 11.5, lineHeight: 1.75, color: '#444444' }}>{content.summary}</Text>
              </View>
            )}

            {skills.length > 0 && (
              <View style={s.section} wrap={false}>
                <Text style={s.sectionTitle}>Core Competencies</Text>
                <View style={s.sectionUnderline} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {skills.map((sk: any, idx: number) => (
                    <Text key={idx} style={s.pill}>{sk.name}</Text>
                  ))}
                </View>
              </View>
            )}

            {experiences.length > 0 && (
              <View style={s.section}>
                {experiences.map((exp: any, idx: number) => {
                  const bullets = filterBullets(exp.bullets)
                  return (
                    <View key={idx} style={{ marginBottom: 14 }}>
                      <View wrap={false}>
                        {idx === 0 && (
                          <>
                            <Text style={s.sectionTitle}>Experience</Text>
                            <View style={s.sectionUnderline} />
                          </>
                        )}
                        <View style={{ paddingLeft: 16, borderLeftWidth: 2, borderLeftColor: '#e0e8ec' }}>
                          <Text style={s.expTitle}>{exp.civilian_title || exp.job_title}</Text>
                          <Text style={s.expDate}>{formatDateRange(exp.start_date, exp.end_date, exp.is_current, resumeType)}</Text>
                          <Text style={s.expCompany}>{exp.organization}{exp.location ? ` | ${exp.location}` : ''}</Text>
                          {bullets.length > 0 && (
                            <View style={s.bullet} wrap={false}>
                              <Text style={s.bulletChar}>{'\u2022'}</Text>
                              <Text style={s.bulletText}>{getBulletText(bullets[0])}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                      {bullets.length > 1 && (
                        <View style={{ paddingLeft: 16, borderLeftWidth: 2, borderLeftColor: '#e0e8ec' }}>
                          {bullets.slice(1).map((b: any, bi: number) => (
                            <View key={bi} style={s.bullet} wrap={false}>
                              <Text style={s.bulletChar}>{'\u2022'}</Text>
                              <Text style={s.bulletText}>{getBulletText(b)}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  )
                })}
              </View>
            )}

            {education.length > 0 && (
              <View style={s.section}>
                {education.map((edu: any, idx: number) => (
                  <View key={idx} style={{ marginBottom: 6 }} wrap={false}>
                    {idx === 0 && (
                      <>
                        <Text style={s.sectionTitle}>Education</Text>
                        <View style={s.sectionUnderline} />
                      </>
                    )}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#0f2b3c' }}>{getDegree(edu)}</Text>
                      <Text style={{ fontSize: 10, color: '#3b9ec2', fontWeight: 'bold', textTransform: 'uppercase' }}>{getGradDate(edu)}</Text>
                    </View>
                    <Text style={{ fontSize: 11, color: '#666666' }}>{getSchool(edu)}</Text>
                  </View>
                ))}
              </View>
            )}

            {certifications.length > 0 && (
              <View style={s.section} wrap={false}>
                <Text style={s.sectionTitle}>Certifications</Text>
                <View style={s.sectionUnderline} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {certifications.map((c: any, idx: number) => (
                    <View key={idx} style={{ width: '50%', flexDirection: 'row', marginBottom: 3 }}>
                      <Text style={s.checkmark}>{'\u2022'}</Text>
                      <Text style={{ fontSize: 11, color: '#444444' }}>{c.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {resumeType === 'federal' && profile.clearance && profile.clearance !== 'none' && (
              <View style={s.section} wrap={false}>
                <Text style={s.sectionTitle}>Security Clearance</Text>
                <View style={s.sectionUnderline} />
                <Text style={{ fontSize: 11, color: '#444444' }}>{formatClearance(profile.clearance)}</Text>
              </View>
            )}
          </View>
        </Page>
      </Document>
    )
  }

  // =========================================
  // MINIMAL TEMPLATE
  // =========================================
  if (template === 'minimal') {
    const s = StyleSheet.create({
      page: { padding: 0, fontSize: 10, fontFamily: 'Nunito Sans', color: '#555555' },
      header: { paddingTop: 48, paddingHorizontal: 60, paddingBottom: 36 },
      name: { fontSize: 36, color: '#222222', fontFamily: 'Cormorant Garamond' },
      targetRole: { fontSize: 12, fontWeight: 'bold', color: '#999999', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 3 },
      divider: { width: 50, height: 1, backgroundColor: '#cccccc', marginTop: 12, marginBottom: 12 },
      contactRow: { flexDirection: 'row' },
      contactItem: { fontSize: 9.5, color: '#777777', marginRight: 10, letterSpacing: 0.3 },
      body: { paddingHorizontal: 60, paddingBottom: 48 },
      sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#222222', fontFamily: 'Cormorant Garamond', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
      sectionLine: { width: '100%', height: 1, backgroundColor: '#e0e0e0', marginBottom: 10 },
      section: { marginBottom: 28 },
      expTitle: { fontSize: 15, fontWeight: 'bold', color: '#222222', fontFamily: 'Cormorant Garamond' },
      expDate: { fontSize: 10, color: '#999999', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.3 },
      expCompany: { fontSize: 11, color: '#888888' },
      bullet: { flexDirection: 'row', marginBottom: 2 },
      bulletChar: { width: 10, fontSize: 10.5, color: '#bbbbbb' },
      bulletText: { flex: 1, fontSize: 10.5, lineHeight: 1.5, color: '#555555' },
    })

    return (
      <Document>
        <Page size="LETTER" style={s.page}>
          <View style={s.header}>
            <Text style={s.name}>{contact.first_name} {contact.last_name}</Text>
            {content.target?.role && <Text style={s.targetRole}>{content.target.role}</Text>}
            <View style={s.divider} />
            <View style={s.contactRow}>
              {contactLine.split(' | ').map((part, i) => (
                <Text key={i} style={s.contactItem}>{part}</Text>
              ))}
            </View>
          </View>

          <View style={s.body}>
            {content.summary && (
              <View style={s.section} wrap={false}>
                <Text style={s.sectionTitle}>Summary</Text>
                <View style={s.sectionLine} />
                <Text style={{ fontSize: 11, lineHeight: 1.8, color: '#555555' }}>{content.summary}</Text>
              </View>
            )}

            {skills.length > 0 && (
              <View style={s.section} wrap={false}>
                <Text style={s.sectionTitle}>Competencies</Text>
                <View style={s.sectionLine} />
                <Text style={{ fontSize: 10.5, color: '#666666', lineHeight: 2 }}>{skills.map((sk: any) => sk.name).join(' / ')}</Text>
              </View>
            )}

            {experiences.length > 0 && (
              <View style={s.section}>
                {experiences.map((exp: any, idx: number) => {
                  const bullets = filterBullets(exp.bullets)
                  return (
                    <View key={idx} style={{ marginBottom: 14 }}>
                      <View wrap={false}>
                        {idx === 0 && (
                          <>
                            <Text style={s.sectionTitle}>Experience</Text>
                            <View style={s.sectionLine} />
                          </>
                        )}
                        <Text style={s.expTitle}>{exp.civilian_title || exp.job_title}</Text>
                        <Text style={s.expDate}>{formatDateRange(exp.start_date, exp.end_date, exp.is_current, resumeType)}</Text>
                        <Text style={s.expCompany}>{exp.organization}{exp.location ? ` | ${exp.location}` : ''}</Text>
                        {bullets.length > 0 && (
                          <View style={s.bullet} wrap={false}>
                            <Text style={s.bulletChar}>{'\u00B7'}</Text>
                            <Text style={s.bulletText}>{getBulletText(bullets[0])}</Text>
                          </View>
                        )}
                      </View>
                      {bullets.slice(1).map((b: any, bi: number) => (
                        <View key={bi} style={s.bullet} wrap={false}>
                          <Text style={s.bulletChar}>{'\u00B7'}</Text>
                          <Text style={s.bulletText}>{getBulletText(b)}</Text>
                        </View>
                      ))}
                    </View>
                  )
                })}
              </View>
            )}

            {education.length > 0 && (
              <View style={s.section}>
                {education.map((edu: any, idx: number) => (
                  <View key={idx} style={{ marginBottom: 6 }} wrap={false}>
                    {idx === 0 && (
                      <>
                        <Text style={s.sectionTitle}>Education</Text>
                        <View style={s.sectionLine} />
                      </>
                    )}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#222222', fontFamily: 'Cormorant Garamond' }}>{getDegree(edu)}</Text>
                      <Text style={{ fontSize: 10, color: '#999999' }}>{getGradDate(edu)}</Text>
                    </View>
                    <Text style={{ fontSize: 10.5, color: '#888888' }}>{getSchool(edu)}</Text>
                  </View>
                ))}
              </View>
            )}

            {certifications.length > 0 && (
              <View style={s.section} wrap={false}>
                <Text style={s.sectionTitle}>Certifications</Text>
                <View style={s.sectionLine} />
                <Text style={{ fontSize: 10.5, color: '#666666' }}>{certifications.map((c: any) => c.name).join(' / ')}</Text>
              </View>
            )}

            {resumeType === 'federal' && profile.clearance && profile.clearance !== 'none' && (
              <View style={s.section} wrap={false}>
                <Text style={s.sectionTitle}>Security Clearance</Text>
                <View style={s.sectionLine} />
                <Text style={{ fontSize: 11, color: '#555555' }}>{formatClearance(profile.clearance)}</Text>
              </View>
            )}
          </View>
        </Page>
      </Document>
    )
  }

  // =========================================
  // TWO COLUMN TEMPLATE (default)
  // =========================================
  const s = StyleSheet.create({
    page: { padding: 0, fontSize: 10, fontFamily: 'Karla', color: '#444444' },
    // Fixed sidebar background — repeats on every page
    sidebarBg: { position: 'absolute', top: 0, left: 0, bottom: 0, width: 220, backgroundColor: '#2b2b2b' },
    container: { flexDirection: 'row', minHeight: '100%' },
    sidebar: { width: 220, paddingTop: 36, paddingHorizontal: 24, paddingBottom: 36 },
    main: { flex: 1, paddingTop: 36, paddingRight: 40, paddingBottom: 40, paddingLeft: 32 },
    sidebarName: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', fontFamily: 'Bitter', lineHeight: 1.3 },
    sidebarRole: { fontSize: 10, fontWeight: 'bold', color: '#aaaaaa', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 },
    sideSectionTitle: { fontSize: 9, fontWeight: 'bold', color: '#d4a855', textTransform: 'uppercase', letterSpacing: 0.8, borderBottomWidth: 1, borderBottomColor: '#444444', paddingBottom: 4, marginBottom: 8 },
    sideSection: { marginBottom: 16 },
    sideLabel: { fontSize: 9, fontWeight: 'bold', color: '#888888', textTransform: 'uppercase' },
    sideValue: { fontSize: 10.5, color: '#cccccc', marginBottom: 4 },
    sideText: { fontSize: 10.5, color: '#cccccc' },
    skillTag: { backgroundColor: '#3a3a3a', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 2, marginRight: 4, marginBottom: 4, fontSize: 9.5, color: '#dddddd' },
    clearanceBadge: { backgroundColor: '#d4a855', paddingHorizontal: 10, paddingVertical: 4, fontSize: 9.5, fontWeight: 'bold', color: '#2b2b2b', textTransform: 'uppercase' },
    mainSectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#2b2b2b', fontFamily: 'Bitter', textTransform: 'uppercase', letterSpacing: 0.8, borderBottomWidth: 2, borderBottomColor: '#2b2b2b', paddingBottom: 4, marginBottom: 10 },
    section: { marginBottom: 22 },
    expTitle: { fontSize: 12.5, fontWeight: 'bold', color: '#2b2b2b', fontFamily: 'Bitter' },
    expDate: { fontSize: 10, color: '#888888', fontWeight: 'bold' },
    expCompany: { fontSize: 11, color: '#666666', fontStyle: 'italic' },
    bullet: { flexDirection: 'row', marginBottom: 2 },
    bulletChar: { width: 10, fontSize: 10.5, color: '#d4a855' },
    bulletText: { flex: 1, fontSize: 10.5, lineHeight: 1.4, color: '#444444' },
  })

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        {/* Fixed dark sidebar background — renders on every page */}
        <View fixed style={s.sidebarBg} />

        <View style={s.container}>
          {/* Sidebar content (no background — background is the fixed layer above) */}
          <View style={s.sidebar}>
            <View style={{ marginBottom: 20 }}>
              <Text style={s.sidebarName}>{contact.first_name} {contact.last_name}</Text>
              {content.target?.role && <Text style={s.sidebarRole}>{content.target.role}</Text>}
            </View>

            <View style={s.sideSection} wrap={false}>
              <Text style={s.sideSectionTitle}>Contact</Text>
              {contact.email && (
                <View style={{ marginBottom: 4 }}>
                  <Text style={s.sideLabel}>Email</Text>
                  <Text style={s.sideValue}>{contact.email}</Text>
                </View>
              )}
              {contact.phone && (
                <View style={{ marginBottom: 4 }}>
                  <Text style={s.sideLabel}>Phone</Text>
                  <Text style={s.sideValue}>{formatPhoneForDisplay(contact.phone)}</Text>
                </View>
              )}
              {contactLocation && (
                <View style={{ marginBottom: 4 }}>
                  <Text style={s.sideLabel}>Location</Text>
                  <Text style={s.sideValue}>{contactLocation}</Text>
                </View>
              )}
              {shortLinkedIn && (
                <View style={{ marginBottom: 4 }}>
                  <Text style={s.sideLabel}>LinkedIn</Text>
                  <Text style={{ fontSize: 9.5, color: '#cccccc' }}>{shortLinkedIn}</Text>
                </View>
              )}
            </View>

            {education.length > 0 && (
              <View style={s.sideSection}>
                {education.map((edu: any, idx: number) => (
                  <View key={idx} style={{ marginBottom: 6 }} wrap={false}>
                    {idx === 0 && <Text style={s.sideSectionTitle}>Education</Text>}
                    <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#ffffff' }}>{getDegree(edu)}</Text>
                    <Text style={{ fontSize: 10, color: '#aaaaaa' }}>{getSchool(edu)}</Text>
                    <Text style={{ fontSize: 9.5, color: '#777777' }}>{getGradDate(edu)}</Text>
                  </View>
                ))}
              </View>
            )}

            {certifications.length > 0 && (
              <View style={s.sideSection}>
                {certifications.map((c: any, idx: number) => (
                  <View key={idx} wrap={false}>
                    {idx === 0 && <Text style={s.sideSectionTitle}>Certifications</Text>}
                    <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                      <Text style={{ width: 10, fontSize: 10.5, color: '#d4a855' }}>{'\u2022'}</Text>
                      <Text style={s.sideText}>{c.name}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {skills.length > 0 && (
              <View style={s.sideSection} wrap={false}>
                <Text style={s.sideSectionTitle}>Core Skills</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {skills.map((sk: any, idx: number) => (
                    <Text key={idx} style={s.skillTag}>{sk.name}</Text>
                  ))}
                </View>
              </View>
            )}

            {profile.clearance && profile.clearance !== 'none' && (
              <View style={s.sideSection} wrap={false}>
                <Text style={s.sideSectionTitle}>Clearance</Text>
                <Text style={s.clearanceBadge}>{formatClearance(profile.clearance)}</Text>
              </View>
            )}
          </View>

          {/* Main Content */}
          <View style={s.main}>
            {content.summary && (
              <View style={s.section} wrap={false}>
                <Text style={s.mainSectionTitle}>Professional Summary</Text>
                <Text style={{ fontSize: 11, lineHeight: 1.7, color: '#444444' }}>{content.summary}</Text>
              </View>
            )}

            {experiences.length > 0 && (
              <View style={s.section}>
                {experiences.map((exp: any, idx: number) => {
                  const bullets = filterBullets(exp.bullets)
                  return (
                    <View key={idx} style={{ marginBottom: 12 }}>
                      <View wrap={false}>
                        {idx === 0 && <Text style={s.mainSectionTitle}>Professional Experience</Text>}
                        <Text style={s.expTitle}>{exp.civilian_title || exp.job_title}</Text>
                        <Text style={s.expDate}>{formatDateRange(exp.start_date, exp.end_date, exp.is_current, resumeType)}</Text>
                        <Text style={s.expCompany}>{exp.organization}{exp.location ? ` | ${exp.location}` : ''}</Text>
                        {bullets.length > 0 && (
                          <View style={s.bullet} wrap={false}>
                            <Text style={s.bulletChar}>{'\u2022'}</Text>
                            <Text style={s.bulletText}>{getBulletText(bullets[0])}</Text>
                          </View>
                        )}
                      </View>
                      {bullets.slice(1).map((b: any, bi: number) => (
                        <View key={bi} style={s.bullet} wrap={false}>
                          <Text style={s.bulletChar}>{'\u2022'}</Text>
                          <Text style={s.bulletText}>{getBulletText(b)}</Text>
                        </View>
                      ))}
                    </View>
                  )
                })}
              </View>
            )}

            {/* Federal sections */}
            {resumeType === 'federal' && training.length > 0 && (
              <View style={s.section}>
                {training.map((t: any, idx: number) => (
                  <View key={idx} wrap={false}>
                    {idx === 0 && <Text style={s.mainSectionTitle}>Job-Related Training</Text>}
                    <View style={s.bullet} wrap={false}>
                      <Text style={s.bulletChar}>{'\u2022'}</Text>
                      <Text style={s.bulletText}>{t.name}{t.provider ? ` \u2013 ${t.provider}` : ''}{t.completion_date ? ` (${t.completion_date})` : ''}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {resumeType === 'federal' && languages.length > 0 && (
              <View style={s.section}>
                {languages.map((lang: any, idx: number) => (
                  <View key={idx} wrap={false}>
                    {idx === 0 && <Text style={s.mainSectionTitle}>Language Skills</Text>}
                    <View style={s.bullet} wrap={false}>
                      <Text style={s.bulletChar}>{'\u2022'}</Text>
                      <Text style={s.bulletText}>{lang.language}: {getProficiencyLabel(lang.proficiency)}</Text>
                    </View>
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
