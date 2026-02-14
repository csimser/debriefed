import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Packer,
  TabStopType,
  TabStopPosition,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  VerticalAlign,
} from 'docx'
import { formatPhoneForDisplay } from '@/lib/formatPhone'
import {
  getDegreeLabel,
  formatGraduationDateShort,
  parseLegacyGraduationDate,
} from '@/lib/constants/education'
import { formatDateRange, formatClearance } from '@/lib/utils/formatResume'
import { getProficiencyLabel } from '@/lib/constants/federalEligibility'
import { TemplateId } from '@/lib/templates'

interface ResumeContent {
  contact?: {
    first_name?: string
    last_name?: string
    email?: string
    phone?: string
    city?: string
    state?: string
    zip?: string
    linkedin_url?: string
  }
  summary?: string
  target?: { role?: string; industry?: string }
  military?: { branch?: string }
  experiences?: any[]
  education?: any[]
  certifications?: any[]
  skills?: any[]
  profile?: {
    clearance?: string
    special_eligibility?: string[]
  }
  // Federal resume form fields
  citizenship?: string
  veterans_preference?: string
  security_clearance?: string
  clearance_status?: string
  federal_status?: string
  training?: any[]
  languages?: any[]
  affiliations?: any[]
  publications?: any[]
}

// =========================================
// SHARED HELPERS
// =========================================

function getBulletText(bullet: any): string {
  return bullet.status === 'accepted'
    ? bullet.translated_text
    : bullet.translated_text || bullet.original_text
}

function isPlaceholderBullet(text: string): boolean {
  if (!text || text.trim() === '') return true
  const lower = text.trim().toLowerCase()
  return (
    lower.includes('new bullet') ||
    lower.includes('click to edit') ||
    lower.includes('[x]')
  )
}

function filterBullets(bullets: any[] | undefined): any[] {
  return (bullets || []).filter((b: any) => {
    if (b.status === 'excluded') return false
    const text = getBulletText(b)
    return !isPlaceholderBullet(text)
  })
}

function getContactParts(contact: any): string[] {
  const location = [contact.city, contact.state].filter(Boolean).join(', ')
  return [
    contact.email,
    contact.phone ? formatPhoneForDisplay(contact.phone) : null,
    location || null,
    contact.linkedin_url ? contact.linkedin_url.replace(/^https?:\/\/(www\.)?/, '') : null,
  ].filter(Boolean) as string[]
}

function getDegree(edu: any): string {
  const degree = edu.degree_type ? getDegreeLabel(edu.degree_type) : edu.degree
  return edu.field_of_study ? `${degree} in ${edu.field_of_study}` : degree
}

function getGradDate(edu: any): string {
  if (edu.graduation_month || edu.graduation_year) {
    return formatGraduationDateShort(edu.graduation_month, edu.graduation_year)
  }
  const { month, year } = parseLegacyGraduationDate(edu.graduation_date)
  return formatGraduationDateShort(month, year)
}

function getSchool(edu: any): string {
  return edu.school_name || edu.institution
}

function noBorder() {
  return {
    top: { style: BorderStyle.NONE, size: 0 },
    bottom: { style: BorderStyle.NONE, size: 0 },
    left: { style: BorderStyle.NONE, size: 0 },
    right: { style: BorderStyle.NONE, size: 0 },
  } as const
}

function buildFederalSections(
  resumeType: 'private' | 'federal',
  profile: any,
  training: any[],
  languages: any[],
  affiliations: any[],
  publications: any[],
  heading: (text: string) => Paragraph,
  font: string,
  bulletColor: string = '000000',
): (Paragraph | Table)[] {
  const items: (Paragraph | Table)[] = []

  if (resumeType !== 'federal') return items

  if (profile.clearance && profile.clearance !== 'none') {
    items.push(heading('Security Clearance'))
    items.push(new Paragraph({
      children: [new TextRun({ text: formatClearance(profile.clearance), size: 21, font })],
      spacing: { after: 200 },
    }))
  }

  if (training.length > 0) {
    items.push(heading('Job-Related Training'))
    training.forEach((t: any) => {
      const text = [t.name, t.provider ? `\u2013 ${t.provider}` : '', t.completion_date ? `(${t.completion_date})` : '', t.hours ? `\u2013 ${t.hours} hours` : ''].filter(Boolean).join(' ')
      items.push(new Paragraph({
        children: [new TextRun({ text: `\u2022 ${text}`, size: 21, font })],
        spacing: { after: 50 },
        indent: { left: 360 },
      }))
    })
  }

  if (languages.length > 0) {
    items.push(heading('Language Skills'))
    languages.forEach((lang: any) => {
      items.push(new Paragraph({
        children: [new TextRun({ text: `\u2022 ${lang.language}: ${getProficiencyLabel(lang.proficiency)}`, size: 21, font })],
        spacing: { after: 50 },
        indent: { left: 360 },
      }))
    })
  }

  if (affiliations.length > 0) {
    items.push(heading('Professional Affiliations'))
    affiliations.forEach((aff: any) => {
      const text = aff.role ? `${aff.name} \u2013 ${aff.role}` : aff.name
      items.push(new Paragraph({
        children: [new TextRun({ text: `\u2022 ${text}`, size: 21, font })],
        spacing: { after: 50 },
        indent: { left: 360 },
      }))
    })
  }

  if (publications.length > 0) {
    items.push(heading('Publications'))
    publications.forEach((pub: any) => {
      const text = `${pub.title}${pub.publication ? `, ${pub.publication}` : ''}${pub.date ? ` (${pub.date})` : ''}`
      items.push(new Paragraph({
        children: [new TextRun({ text: `\u2022 ${text}`, size: 21, font })],
        spacing: { after: 50 },
        indent: { left: 360 },
      }))
    })
  }

  if (profile.special_eligibility?.length > 0) {
    items.push(heading('Special Hiring Authorities'))
    profile.special_eligibility.forEach((elig: string) => {
      items.push(new Paragraph({
        children: [new TextRun({ text: `\u2022 ${elig}`, size: 21, font })],
        spacing: { after: 50 },
        indent: { left: 360 },
      }))
    })
  }

  return items
}

// =========================================
// MAIN EXPORT
// =========================================

export async function generateDocx(
  content: ResumeContent,
  resumeType: 'private' | 'federal',
  template: TemplateId = 'classic_professional',
): Promise<Buffer> {
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

  let doc: Document

  switch (template) {
    case 'executive':
      doc = buildExecutive(content, contact, experiences, education, certifications, skills, profile, training, languages, affiliations, publications, resumeType)
      break
    case 'federal':
      doc = buildFederal(content, contact, experiences, education, certifications, skills, profile, training, languages, affiliations, publications, resumeType)
      break
    case 'modern':
      doc = buildModern(content, contact, experiences, education, certifications, skills, profile, training, languages, affiliations, publications, resumeType)
      break
    case 'minimal':
      doc = buildMinimal(content, contact, experiences, education, certifications, skills, profile, training, languages, affiliations, publications, resumeType)
      break
    case 'twocol':
      doc = buildTwoColumn(content, contact, experiences, education, certifications, skills, profile, training, languages, affiliations, publications, resumeType)
      break
    case 'classic_professional':
    default:
      doc = buildClassicProfessional(content, contact, experiences, education, certifications, skills, profile, training, languages, affiliations, publications, resumeType)
      break
  }

  const buffer = await Packer.toBuffer(doc)
  return Buffer.from(buffer)
}

// =========================================
// EXECUTIVE — Two-column table layout
// =========================================
function buildExecutive(
  content: ResumeContent, contact: any, experiences: any[], education: any[],
  certifications: any[], skills: any[], profile: any, training: any[],
  languages: any[], affiliations: any[], publications: any[],
  resumeType: 'private' | 'federal',
): Document {
  const SANS = 'Source Sans 3'
  const SERIF = 'Source Serif 4'
  const contactParts = getContactParts(contact)
  const fullName = `${contact.first_name || ''} ${contact.last_name || ''}`.trim().toUpperCase()

  const heading = (text: string) => new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 20, font: SERIF, color: '1a2a44' })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'b8943e' } },
    spacing: { before: 200, after: 120 },
  })

  const sideHeading = (text: string) => new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 18, font: SERIF, color: '1a2a44' })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'b8943e' } },
    spacing: { before: 160, after: 80 },
  })

  // === Main column content ===
  const mainChildren: (Paragraph | Table)[] = []

  if (content.summary) {
    mainChildren.push(heading('Professional Summary'))
    mainChildren.push(new Paragraph({
      children: [new TextRun({ text: content.summary, size: 21, font: SANS, color: '333333' })],
      spacing: { after: 200, line: 276 },
    }))
  }

  // Experience
  if (experiences.length > 0) {
    mainChildren.push(heading('Professional Experience'))
    experiences.forEach((exp: any) => {
      mainChildren.push(new Paragraph({
        children: [
          new TextRun({ text: exp.civilian_title || exp.job_title, bold: true, size: 23, font: SANS, color: '1a2a44' }),
          new TextRun({ text: `\t${formatDateRange(exp.start_date, exp.end_date, exp.is_current, resumeType)}`, size: 20, font: SANS, color: '777777' }),
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { before: 150 },
      }))
      mainChildren.push(new Paragraph({
        children: [new TextRun({ text: `${exp.organization}${exp.location ? ` | ${exp.location}` : ''}`, italics: true, size: 21, font: SANS, color: '666666' })],
        spacing: { after: 50 },
      }))
      filterBullets(exp.bullets).forEach((b: any) => {
        mainChildren.push(new Paragraph({
          children: [
            new TextRun({ text: '\u2022 ', size: 21, color: '333333', font: SANS }),
            new TextRun({ text: getBulletText(b), size: 21, font: SANS, color: '333333' }),
          ],
          spacing: { after: 30 },
          indent: { left: 180 },
        }))
      })
    })
  }

  // === Sidebar content ===
  const sideChildren: (Paragraph | Table)[] = []

  if (skills.length > 0) {
    sideChildren.push(sideHeading('Core Competencies'))
    skills.forEach((sk: any) => {
      sideChildren.push(new Paragraph({
        children: [new TextRun({ text: `\u2022 ${sk.name}`, size: 20, font: SANS, color: '444444' })],
        spacing: { after: 20 },
      }))
    })
  }

  if (certifications.length > 0) {
    sideChildren.push(sideHeading('Certifications'))
    certifications.forEach((c: any) => {
      sideChildren.push(new Paragraph({
        children: [new TextRun({ text: c.name, bold: true, size: 20, font: SANS, color: '1a2a44' })],
      }))
      if (c.issuing_org) {
        sideChildren.push(new Paragraph({
          children: [new TextRun({ text: c.issuing_org, size: 18, font: SANS, color: '777777' })],
          spacing: { after: 40 },
        }))
      }
    })
  }

  if (education.length > 0) {
    sideChildren.push(sideHeading('Education'))
    education.forEach((edu: any) => {
      sideChildren.push(new Paragraph({
        children: [new TextRun({ text: getDegree(edu), bold: true, size: 20, font: SANS, color: '1a2a44' })],
      }))
      sideChildren.push(new Paragraph({
        children: [new TextRun({ text: getSchool(edu), size: 19, font: SANS, color: '666666' })],
      }))
      sideChildren.push(new Paragraph({
        children: [new TextRun({ text: getGradDate(edu), size: 18, font: SANS, color: '888888' })],
        spacing: { after: 80 },
      }))
    })
  }

  if (profile.clearance && profile.clearance !== 'none') {
    sideChildren.push(sideHeading('Security Clearance'))
    sideChildren.push(new Paragraph({
      children: [new TextRun({ text: formatClearance(profile.clearance), size: 20, font: SANS, color: '444444' })],
    }))
  }

  // Ensure at least one child in each cell
  if (mainChildren.length === 0) mainChildren.push(new Paragraph({ children: [] }))
  if (sideChildren.length === 0) sideChildren.push(new Paragraph({ children: [] }))

  // Build the two-column table
  const bodyTable = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: mainChildren,
            width: { size: 67, type: WidthType.PERCENTAGE },
            borders: noBorder(),
            margins: { top: 100, bottom: 200, right: 200 },
          }),
          new TableCell({
            children: sideChildren,
            width: { size: 33, type: WidthType.PERCENTAGE },
            borders: {
              ...noBorder(),
              left: { style: BorderStyle.SINGLE, size: 4, color: 'd4d4d4' },
            },
            margins: { top: 100, bottom: 200, left: 150, right: 150 },
          }),
        ],
      }),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorder() as any,
  })

  // Header paragraphs
  const headerChildren: Paragraph[] = [
    // Name
    new Paragraph({
      children: [new TextRun({ text: fullName, bold: true, size: 60, font: SERIF, color: '1a2a44' })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 40 },
    }),
  ]

  if (content.target?.role) {
    headerChildren.push(new Paragraph({
      children: [new TextRun({ text: content.target.role.toUpperCase(), bold: true, size: 22, font: SANS, color: '8a7a5a' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    }))
  }

  headerChildren.push(new Paragraph({
    children: [new TextRun({ text: contactParts.join(' | '), size: 19, font: SANS, color: '555555' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'b8943e' } },
  }))

  return new Document({
    sections: [{
      properties: { page: { margin: { top: 360, right: 360, bottom: 360, left: 360 } } },
      children: [...headerChildren, bodyTable],
    }],
  })
}

// =========================================
// CLASSIC PROFESSIONAL — Single column, centered header
// =========================================
function buildClassicProfessional(
  content: ResumeContent, contact: any, experiences: any[], education: any[],
  certifications: any[], skills: any[], profile: any, training: any[],
  languages: any[], affiliations: any[], publications: any[],
  resumeType: 'private' | 'federal',
): Document {
  const SANS = 'Lato'
  const SERIF = 'Libre Baskerville'
  const contactParts = getContactParts(contact)
  const fullName = `${contact.first_name || ''} ${contact.last_name || ''}`.trim().toUpperCase()
  const children: (Paragraph | Table)[] = []

  const heading = (text: string) => new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 24, font: SERIF, color: '1a1a1a' })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'c0c0c0' } },
    spacing: { before: 250, after: 150 },
  })

  // Header
  children.push(new Paragraph({
    children: [new TextRun({ text: fullName, bold: true, size: 60, font: SERIF, color: '1a1a1a' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 40 },
  }))

  if (content.target?.role) {
    children.push(new Paragraph({
      children: [new TextRun({ text: content.target.role.toUpperCase(), size: 26, font: SANS, color: '666666' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    }))
  }

  children.push(new Paragraph({
    children: [new TextRun({ text: contactParts.join(' \u2022 '), size: 22, font: SANS, color: '444444' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: '1a1a1a' } },
  }))

  // Summary
  if (content.summary) {
    children.push(heading('Professional Summary'))
    children.push(new Paragraph({
      children: [new TextRun({ text: content.summary, size: 23, font: SANS, color: '333333' })],
      spacing: { after: 200, line: 276 },
    }))
  }

  // Skills — 3-column
  if (skills.length > 0) {
    children.push(heading('Core Competencies'))
    // Create rows of 3
    for (let i = 0; i < skills.length; i += 3) {
      const row = skills.slice(i, i + 3)
      const cells = row.map((sk: any) => new TableCell({
        children: [new Paragraph({
          children: [
            new TextRun({ text: '\u2022 ', size: 22, font: SANS, color: '1a1a1a' }),
            new TextRun({ text: sk.name, size: 22, font: SANS, color: '333333' }),
          ],
        })],
        borders: noBorder(),
        width: { size: 33, type: WidthType.PERCENTAGE },
      }))
      // Pad to 3 cells
      while (cells.length < 3) {
        cells.push(new TableCell({ children: [new Paragraph({ children: [] })], borders: noBorder(), width: { size: 33, type: WidthType.PERCENTAGE } }))
      }
      children.push(new Table({
        rows: [new TableRow({ children: cells })],
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: noBorder() as any,
      }))
    }
  }

  // Experience
  if (experiences.length > 0) {
    children.push(heading('Professional Experience'))
    experiences.forEach((exp: any) => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: exp.civilian_title || exp.job_title, bold: true, size: 26, font: SANS, color: '1a1a1a' }),
          new TextRun({ text: `\t${formatDateRange(exp.start_date, exp.end_date, exp.is_current, resumeType)}`, bold: true, size: 22, font: SANS, color: '666666' }),
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { before: 150 },
      }))
      children.push(new Paragraph({
        children: [
          new TextRun({ text: exp.organization, italics: true, size: 23, font: SANS, color: '555555' }),
          ...(exp.location ? [new TextRun({ text: ` | ${exp.location}`, size: 22, font: SANS, color: '777777' })] : []),
        ],
        spacing: { after: 50 },
      }))
      filterBullets(exp.bullets).forEach((b: any) => {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: '\u2022 ', size: 22, font: SANS, color: '1a1a1a' }),
            new TextRun({ text: getBulletText(b), size: 22, font: SANS, color: '333333' }),
          ],
          spacing: { after: 40 },
          indent: { left: 360 },
        }))
      })
    })
  }

  // Education — 2-column
  if (education.length > 0) {
    children.push(heading('Education'))
    for (let i = 0; i < education.length; i += 2) {
      const row = education.slice(i, i + 2)
      const cells = row.map((edu: any) => new TableCell({
        children: [
          new Paragraph({ children: [new TextRun({ text: getDegree(edu), bold: true, size: 24, font: SANS, color: '1a1a1a' })] }),
          new Paragraph({ children: [new TextRun({ text: getSchool(edu), italics: true, size: 22, font: SANS, color: '555555' })] }),
          new Paragraph({ children: [new TextRun({ text: getGradDate(edu), size: 21, font: SANS, color: '777777' })], spacing: { after: 80 } }),
        ],
        borders: noBorder(),
        width: { size: 50, type: WidthType.PERCENTAGE },
      }))
      while (cells.length < 2) {
        cells.push(new TableCell({ children: [new Paragraph({ children: [] })], borders: noBorder(), width: { size: 50, type: WidthType.PERCENTAGE } }))
      }
      children.push(new Table({
        rows: [new TableRow({ children: cells })],
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: noBorder() as any,
      }))
    }
  }

  // Certifications
  if (certifications.length > 0) {
    children.push(heading('Certifications'))
    children.push(new Paragraph({
      children: [new TextRun({ text: certifications.map((c: any) => c.name).join(' \u00b7 '), size: 22, font: SANS, color: '333333' })],
      spacing: { after: 200, line: 300 },
    }))
  }

  // Clearance
  if (resumeType === 'federal' && profile.clearance && profile.clearance !== 'none') {
    children.push(heading('Security Clearance'))
    children.push(new Paragraph({
      children: [new TextRun({ text: formatClearance(profile.clearance), size: 22, font: SANS, color: '333333' })],
      spacing: { after: 200 },
    }))
  }

  children.push(...buildFederalSections(resumeType, profile, training, languages, affiliations, publications, heading, SANS))

  return new Document({
    sections: [{
      properties: { page: { margin: { top: 720, right: 800, bottom: 720, left: 800 } } },
      children,
    }],
  })
}

// =========================================
// FEDERAL — Black-bar section headers, dense metadata
// =========================================
function buildFederal(
  content: ResumeContent, contact: any, experiences: any[], education: any[],
  certifications: any[], skills: any[], profile: any, training: any[],
  languages: any[], affiliations: any[], publications: any[],
  resumeType: 'private' | 'federal',
): Document {
  const SANS = 'Open Sans'
  const SERIF = 'Merriweather'
  const fullName = `${contact.first_name || ''} ${contact.last_name || ''}`.trim().toUpperCase()
  const children: (Paragraph | Table)[] = []

  const heading = (text: string) => new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 24, font: SERIF, color: 'ffffff' })],
    shading: { type: ShadingType.SOLID, color: '000000' },
    spacing: { before: 250, after: 150 },
  })

  // Header
  children.push(new Paragraph({
    children: [new TextRun({ text: fullName, bold: true, size: 48, font: SERIF, color: '000000' })],
    spacing: { after: 100 },
  }))

  // Info grid as table
  const infoItems: [string, string][] = []
  if (contact.email) infoItems.push(['Email:', contact.email])
  if (contact.phone) infoItems.push(['Phone:', formatPhoneForDisplay(contact.phone)])
  if (contact.city) infoItems.push(['Address:', `${contact.city}${contact.state ? `, ${contact.state}` : ''}${contact.zip ? ` ${contact.zip}` : ''}`])
  if (content.citizenship && content.citizenship !== '') {
    const citizenshipLabel = content.citizenship === 'us_citizen' ? 'United States' : content.citizenship === 'permanent_resident' ? 'Permanent Resident' : content.citizenship
    infoItems.push(['Citizenship:', citizenshipLabel])
  }
  if (content.veterans_preference && content.veterans_preference !== '' && content.veterans_preference !== 'none') {
    const vpLabels: Record<string, string> = { '5_point': '5-Point (TP)', '10_point': '10-Point (CP/CPS/XP)', '10_point_30_percent': '10-Point/30% Disabled' }
    infoItems.push(["Veterans' Preference:", vpLabels[content.veterans_preference] || content.veterans_preference])
  } else if (content.military?.branch) {
    infoItems.push(["Veterans' Preference:", 'Yes'])
  }
  const fedClearance = content.security_clearance || profile.clearance
  if (fedClearance && fedClearance !== 'none' && fedClearance !== '') {
    const statusSuffix = content.clearance_status && content.clearance_status !== '' ? ` (${content.clearance_status.charAt(0).toUpperCase() + content.clearance_status.slice(1)})` : ''
    infoItems.push(['Clearance:', formatClearance(fedClearance) + statusSuffix])
  }
  if (content.federal_status) infoItems.push(['Highest Grade:', content.federal_status])
  if (contact.linkedin_url) infoItems.push(['LinkedIn:', contact.linkedin_url])

  for (let i = 0; i < infoItems.length; i += 2) {
    const left = infoItems[i]
    const right = infoItems[i + 1]
    const cells = [
      new TableCell({
        children: [new Paragraph({
          children: [
            new TextRun({ text: left[0] + ' ', bold: true, size: 22, font: SANS, color: '000000' }),
            new TextRun({ text: left[1], size: 22, font: SANS, color: '333333' }),
          ],
        })],
        borders: noBorder(),
        width: { size: 50, type: WidthType.PERCENTAGE },
      }),
    ]
    if (right) {
      cells.push(new TableCell({
        children: [new Paragraph({
          children: [
            new TextRun({ text: right[0] + ' ', bold: true, size: 22, font: SANS, color: '000000' }),
            new TextRun({ text: right[1], size: 22, font: SANS, color: '333333' }),
          ],
        })],
        borders: noBorder(),
        width: { size: 50, type: WidthType.PERCENTAGE },
      }))
    } else {
      cells.push(new TableCell({ children: [new Paragraph({ children: [] })], borders: noBorder(), width: { size: 50, type: WidthType.PERCENTAGE } }))
    }
    children.push(new Table({
      rows: [new TableRow({ children: cells })],
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: noBorder() as any,
    }))
  }

  // Border after header
  children.push(new Paragraph({
    children: [new TextRun({ text: '', size: 2 })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 18, color: '000000' } },
    spacing: { after: 200 },
  }))

  // Summary
  if (content.summary) {
    children.push(heading('Professional Summary'))
    children.push(new Paragraph({
      children: [new TextRun({ text: content.summary, size: 22, font: SANS, color: '333333' })],
      spacing: { after: 200, line: 276 },
    }))
  }

  // Experience
  if (experiences.length > 0) {
    children.push(heading('Professional Experience'))
    experiences.forEach((exp: any) => {
      children.push(new Paragraph({
        children: [new TextRun({ text: exp.civilian_title || exp.job_title, bold: true, size: 26, font: SANS, color: '000000' })],
        spacing: { before: 150 },
      }))
      children.push(new Paragraph({
        children: [new TextRun({ text: exp.organization, bold: true, size: 23, font: SANS, color: '333333' })],
      }))
      {
        const locDisplay = exp.city ? `${exp.city}${exp.state ? `, ${exp.state}` : ''}` : exp.location
        if (locDisplay) {
          children.push(new Paragraph({
            children: [
              new TextRun({ text: 'Location: ', bold: true, size: 21, font: SANS, color: '333333' }),
              new TextRun({ text: locDisplay, size: 21, font: SANS, color: '555555' }),
            ],
          }))
        }
      }
      children.push(new Paragraph({
        children: [
          new TextRun({ text: 'Dates: ', bold: true, size: 21, font: SANS, color: '333333' }),
          new TextRun({ text: formatDateRange(exp.start_date, exp.end_date, exp.is_current, 'federal'), size: 21, font: SANS, color: '555555' }),
        ],
      }))
      if (exp.grade_level) {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: 'Grade: ', bold: true, size: 21, font: SANS, color: '333333' }),
            new TextRun({ text: exp.grade_level, size: 21, font: SANS, color: '555555' }),
          ],
        }))
      }
      children.push(new Paragraph({
        children: [
          new TextRun({ text: 'Hours per week: ', bold: true, size: 21, font: SANS, color: '333333' }),
          new TextRun({ text: String(exp.hours_per_week || 40), size: 21, font: SANS, color: '555555' }),
        ],
      }))
      if (exp.salary) {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: 'Salary: ', bold: true, size: 21, font: SANS, color: '333333' }),
            new TextRun({ text: exp.salary.startsWith('$') ? exp.salary : `$${exp.salary}`, size: 21, font: SANS, color: '555555' }),
          ],
        }))
      }

      children.push(new Paragraph({
        children: [new TextRun({ text: 'DUTIES AND ACCOMPLISHMENTS:', bold: true, size: 22, font: SANS, color: '000000' })],
        spacing: { before: 100, after: 50 },
      }))
      filterBullets(exp.bullets).forEach((b: any) => {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: '\u2022 ', size: 22, font: SANS, color: '000000' }),
            new TextRun({ text: getBulletText(b), size: 22, font: SANS, color: '333333' }),
          ],
          spacing: { after: 40 },
          indent: { left: 360 },
        }))
      })
    })
  }

  // Education
  if (education.length > 0) {
    children.push(heading('Education'))
    education.forEach((edu: any) => {
      children.push(new Paragraph({
        children: [new TextRun({ text: getDegree(edu), bold: true, size: 24, font: SANS, color: '000000' })],
      }))
      children.push(new Paragraph({
        children: [new TextRun({ text: getSchool(edu), size: 22, font: SANS, color: '333333' })],
      }))
      const gradExtra = [getGradDate(edu)]
      if (edu.gpa) gradExtra.push(`GPA: ${edu.gpa}`)
      if (edu.credit_hours) gradExtra.push(`${edu.credit_hours} credit hours`)
      children.push(new Paragraph({
        children: [new TextRun({ text: gradExtra.join(' | '), size: 21, font: SANS, color: '555555' })],
        spacing: { after: 80 },
      }))
    })
  }

  // Certifications
  if (certifications.length > 0) {
    children.push(heading('Certifications & Licenses'))
    certifications.forEach((c: any) => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: '\u2022 ', size: 22, font: SANS, color: '000000' }),
          new TextRun({ text: c.name, bold: true, size: 22, font: SANS, color: '333333' }),
          ...(c.issuing_org ? [new TextRun({ text: ` \u2014 ${c.issuing_org}`, size: 22, font: SANS, color: '333333' })] : []),
        ],
        spacing: { after: 40 },
        indent: { left: 360 },
      }))
    })
  }

  // Skills
  if (skills.length > 0) {
    children.push(heading('Skills'))
    children.push(new Paragraph({
      children: [new TextRun({ text: skills.map((s: any) => s.name).join(', '), size: 22, font: SANS, color: '333333' })],
      spacing: { after: 200 },
    }))
  }

  // Additional Info
  const addlClearance = content.security_clearance || profile.clearance
  if (addlClearance || content.military?.branch) {
    children.push(heading('Additional Information'))
    if (addlClearance && addlClearance !== 'none' && addlClearance !== '') {
      const st = content.clearance_status
      const statusSuffix = st && st !== '' ? ` (${st.charAt(0).toUpperCase() + st.slice(1)})` : ''
      children.push(new Paragraph({
        children: [
          new TextRun({ text: 'Security Clearance: ', bold: true, size: 22, font: SANS, color: '000000' }),
          new TextRun({ text: formatClearance(addlClearance) + statusSuffix, size: 22, font: SANS, color: '333333' }),
        ],
      }))
    }
    if (content.military?.branch) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: 'Military Service: ', bold: true, size: 22, font: SANS, color: '000000' }),
          new TextRun({ text: content.military.branch, size: 22, font: SANS, color: '333333' }),
        ],
      }))
    }
  }

  children.push(...buildFederalSections('federal', profile, training, languages, affiliations, publications, heading, SANS))

  return new Document({
    sections: [{
      properties: { page: { margin: { top: 500, right: 720, bottom: 600, left: 720 } } },
      children,
    }],
  })
}

// =========================================
// MODERN — Dark header, teal accents, timeline
// =========================================
function buildModern(
  content: ResumeContent, contact: any, experiences: any[], education: any[],
  certifications: any[], skills: any[], profile: any, training: any[],
  languages: any[], affiliations: any[], publications: any[],
  resumeType: 'private' | 'federal',
): Document {
  const SANS = 'DM Sans'
  const SERIF = 'DM Serif Display'
  const contactParts = getContactParts(contact)
  const fullName = `${contact.first_name || ''} ${contact.last_name || ''}`.trim()
  const children: (Paragraph | Table)[] = []

  const heading = (text: string) => new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 22, font: SANS, color: '0f2b3c' })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: '3b9ec2' } },
    spacing: { before: 250, after: 150 },
  })

  // Dark header (shading on paragraphs)
  children.push(new Paragraph({
    children: [new TextRun({ text: fullName, size: 64, font: SERIF, color: 'ffffff' })],
    shading: { type: ShadingType.SOLID, color: '0f2b3c' },
    spacing: { before: 0, after: 0 },
  }))
  if (content.target?.role) {
    children.push(new Paragraph({
      children: [new TextRun({ text: content.target.role.toUpperCase(), size: 28, font: SANS, color: '7cc5de' })],
      shading: { type: ShadingType.SOLID, color: '0f2b3c' },
      spacing: { after: 0 },
    }))
  }
  children.push(new Paragraph({
    children: contactParts.map((part, i) => new TextRun({
      text: (i > 0 ? '    ' : '') + '\u25C6 ' + part,
      size: 22, font: SANS, color: 'b0c4ce',
    })),
    shading: { type: ShadingType.SOLID, color: '0f2b3c' },
    spacing: { after: 0 },
  }))
  // Teal bar
  children.push(new Paragraph({
    children: [new TextRun({ text: ' ', size: 2 })],
    shading: { type: ShadingType.SOLID, color: '3b9ec2' },
    spacing: { after: 200 },
  }))

  // Summary
  if (content.summary) {
    children.push(heading('About'))
    children.push(new Paragraph({
      children: [new TextRun({ text: content.summary, size: 23, font: SANS, color: '444444' })],
      spacing: { after: 200, line: 300 },
    }))
  }

  // Skills as comma-separated
  if (skills.length > 0) {
    children.push(heading('Core Competencies'))
    children.push(new Paragraph({
      children: [new TextRun({ text: skills.map((s: any) => s.name).join(', '), size: 20, bold: true, font: SANS, color: '0f2b3c' })],
      spacing: { after: 200 },
    }))
  }

  // Experience — timeline style with left border
  if (experiences.length > 0) {
    children.push(heading('Experience'))
    experiences.forEach((exp: any) => {
      children.push(new Paragraph({
        children: [new TextRun({ text: exp.civilian_title || exp.job_title, bold: true, size: 26, font: SANS, color: '0f2b3c' })],
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: 'e0e8ec' } },
        indent: { left: 240 },
        spacing: { before: 150 },
      }))
      children.push(new Paragraph({
        children: [new TextRun({ text: formatDateRange(exp.start_date, exp.end_date, exp.is_current, resumeType).toUpperCase(), bold: true, size: 20, font: SANS, color: '3b9ec2' })],
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: 'e0e8ec' } },
        indent: { left: 240 },
      }))
      children.push(new Paragraph({
        children: [new TextRun({ text: `${exp.organization}${exp.location ? ` | ${exp.location}` : ''}`, size: 22, font: SANS, color: '666666' })],
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: 'e0e8ec' } },
        indent: { left: 240 },
        spacing: { after: 50 },
      }))
      filterBullets(exp.bullets).forEach((b: any) => {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: '\u2022 ', size: 22, color: '3b9ec2', font: SANS }),
            new TextRun({ text: getBulletText(b), size: 22, font: SANS, color: '444444' }),
          ],
          border: { left: { style: BorderStyle.SINGLE, size: 12, color: 'e0e8ec' } },
          indent: { left: 480 },
          spacing: { after: 40 },
        }))
      })
    })
  }

  // Education
  if (education.length > 0) {
    children.push(heading('Education'))
    education.forEach((edu: any) => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: getDegree(edu), bold: true, size: 24, font: SANS, color: '0f2b3c' }),
          new TextRun({ text: `\t${getGradDate(edu).toUpperCase()}`, bold: true, size: 20, font: SANS, color: '3b9ec2' }),
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
      }))
      children.push(new Paragraph({
        children: [new TextRun({ text: getSchool(edu), size: 22, font: SANS, color: '666666' })],
        spacing: { after: 80 },
      }))
    })
  }

  // Certifications with checkmarks
  if (certifications.length > 0) {
    children.push(heading('Certifications'))
    for (let i = 0; i < certifications.length; i += 2) {
      const row = certifications.slice(i, i + 2)
      const cells = row.map((c: any) => new TableCell({
        children: [new Paragraph({
          children: [
            new TextRun({ text: '\u2713 ', size: 22, color: '2dd4a8', font: SANS }),
            new TextRun({ text: c.name, size: 22, font: SANS, color: '444444' }),
          ],
        })],
        borders: noBorder(),
        width: { size: 50, type: WidthType.PERCENTAGE },
      }))
      while (cells.length < 2) {
        cells.push(new TableCell({ children: [new Paragraph({ children: [] })], borders: noBorder(), width: { size: 50, type: WidthType.PERCENTAGE } }))
      }
      children.push(new Table({
        rows: [new TableRow({ children: cells })],
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: noBorder() as any,
      }))
    }
  }

  // Clearance
  if (resumeType === 'federal' && profile.clearance && profile.clearance !== 'none') {
    children.push(heading('Security Clearance'))
    children.push(new Paragraph({
      children: [new TextRun({ text: formatClearance(profile.clearance), size: 22, font: SANS, color: '444444' })],
      spacing: { after: 200 },
    }))
  }

  children.push(...buildFederalSections(resumeType, profile, training, languages, affiliations, publications, heading, SANS, '3b9ec2'))

  return new Document({
    sections: [{
      properties: { page: { margin: { top: 0, right: 720, bottom: 600, left: 720 } } },
      children,
    }],
  })
}

// =========================================
// MINIMAL — Typography-driven, generous whitespace
// =========================================
function buildMinimal(
  content: ResumeContent, contact: any, experiences: any[], education: any[],
  certifications: any[], skills: any[], profile: any, training: any[],
  languages: any[], affiliations: any[], publications: any[],
  resumeType: 'private' | 'federal',
): Document {
  const SANS = 'Nunito Sans'
  const SERIF = 'Cormorant Garamond'
  const contactParts = getContactParts(contact)
  const fullName = `${contact.first_name || ''} ${contact.last_name || ''}`.trim()
  const children: (Paragraph | Table)[] = []

  const heading = (text: string) => new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 28, font: SERIF, color: '222222' })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'e0e0e0' } },
    spacing: { before: 300, after: 150 },
  })

  // Header
  children.push(new Paragraph({
    children: [new TextRun({ text: fullName, size: 72, font: SERIF, color: '222222' })],
    spacing: { after: 40 },
  }))
  if (content.target?.role) {
    children.push(new Paragraph({
      children: [new TextRun({ text: content.target.role.toUpperCase(), bold: true, size: 24, font: SANS, color: '999999' })],
      spacing: { after: 80 },
    }))
  }
  // Thin divider
  children.push(new Paragraph({
    children: [new TextRun({ text: '', size: 2 })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'cccccc' } },
    spacing: { after: 100 },
  }))
  children.push(new Paragraph({
    children: contactParts.map((part, i) => new TextRun({
      text: (i > 0 ? '    ' : '') + part,
      size: 21, font: SANS, color: '777777',
    })),
    spacing: { after: 250 },
  }))

  // Summary
  if (content.summary) {
    children.push(heading('Summary'))
    children.push(new Paragraph({
      children: [new TextRun({ text: content.summary, size: 22, font: SANS, color: '555555' })],
      spacing: { after: 200, line: 300 },
    }))
  }

  // Skills — flowing with /
  if (skills.length > 0) {
    children.push(heading('Competencies'))
    children.push(new Paragraph({
      children: [new TextRun({ text: skills.map((s: any) => s.name).join(' / '), size: 21, font: SANS, color: '666666' })],
      spacing: { after: 200, line: 320 },
    }))
  }

  // Experience
  if (experiences.length > 0) {
    children.push(heading('Experience'))
    experiences.forEach((exp: any) => {
      children.push(new Paragraph({
        children: [new TextRun({ text: exp.civilian_title || exp.job_title, bold: true, size: 30, font: SERIF, color: '222222' })],
        spacing: { before: 180 },
      }))
      children.push(new Paragraph({
        children: [new TextRun({ text: formatDateRange(exp.start_date, exp.end_date, exp.is_current, resumeType).toUpperCase(), bold: true, size: 20, font: SANS, color: '999999' })],
      }))
      children.push(new Paragraph({
        children: [new TextRun({ text: `${exp.organization}${exp.location ? ` | ${exp.location}` : ''}`, size: 22, font: SANS, color: '888888' })],
        spacing: { after: 50 },
      }))
      filterBullets(exp.bullets).forEach((b: any) => {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: '\u00B7 ', size: 21, color: 'bbbbbb', font: SANS }),
            new TextRun({ text: getBulletText(b), size: 21, font: SANS, color: '555555' }),
          ],
          spacing: { after: 40 },
          indent: { left: 360 },
        }))
      })
    })
  }

  // Education
  if (education.length > 0) {
    children.push(heading('Education'))
    education.forEach((edu: any) => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: getDegree(edu), bold: true, size: 26, font: SERIF, color: '222222' }),
          new TextRun({ text: `\t${getGradDate(edu)}`, size: 20, font: SANS, color: '999999' }),
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
      }))
      children.push(new Paragraph({
        children: [new TextRun({ text: getSchool(edu), size: 21, font: SANS, color: '888888' })],
        spacing: { after: 80 },
      }))
    })
  }

  // Certifications — flowing with /
  if (certifications.length > 0) {
    children.push(heading('Certifications'))
    children.push(new Paragraph({
      children: [new TextRun({ text: certifications.map((c: any) => c.name).join(' / '), size: 21, font: SANS, color: '666666' })],
      spacing: { after: 200 },
    }))
  }

  if (resumeType === 'federal' && profile.clearance && profile.clearance !== 'none') {
    children.push(heading('Security Clearance'))
    children.push(new Paragraph({
      children: [new TextRun({ text: formatClearance(profile.clearance), size: 22, font: SANS, color: '555555' })],
      spacing: { after: 200 },
    }))
  }

  children.push(...buildFederalSections(resumeType, profile, training, languages, affiliations, publications, heading, SANS))

  return new Document({
    sections: [{
      properties: { page: { margin: { top: 720, right: 860, bottom: 720, left: 860 } } },
      children,
    }],
  })
}

// =========================================
// TWO COLUMN — Dark sidebar table
// =========================================
function buildTwoColumn(
  content: ResumeContent, contact: any, experiences: any[], education: any[],
  certifications: any[], skills: any[], profile: any, training: any[],
  languages: any[], affiliations: any[], publications: any[],
  resumeType: 'private' | 'federal',
): Document {
  const SANS = 'Karla'
  const SERIF = 'Bitter'

  const sideHeading = (text: string) => new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 18, font: SANS, color: 'd4a855' })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '444444' } },
    spacing: { before: 200, after: 120 },
  })

  const mainHeading = (text: string) => new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 26, font: SERIF, color: '2b2b2b' })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: '2b2b2b' } },
    spacing: { before: 250, after: 150 },
  })

  // === SIDEBAR ===
  const sideChildren: Paragraph[] = []

  // Name
  sideChildren.push(new Paragraph({
    children: [new TextRun({ text: `${contact.first_name || ''}\n${contact.last_name || ''}`, bold: true, size: 40, font: SERIF, color: 'ffffff' })],
    spacing: { after: 40 },
  }))
  if (content.target?.role) {
    sideChildren.push(new Paragraph({
      children: [new TextRun({ text: content.target.role.toUpperCase(), bold: true, size: 20, font: SANS, color: 'aaaaaa' })],
      spacing: { after: 150 },
    }))
  }

  // Contact
  sideChildren.push(sideHeading('Contact'))
  if (contact.email) {
    sideChildren.push(new Paragraph({ children: [new TextRun({ text: 'EMAIL', bold: true, size: 18, font: SANS, color: '888888' })] }))
    sideChildren.push(new Paragraph({ children: [new TextRun({ text: contact.email, size: 21, font: SANS, color: 'cccccc' })], spacing: { after: 60 } }))
  }
  if (contact.phone) {
    sideChildren.push(new Paragraph({ children: [new TextRun({ text: 'PHONE', bold: true, size: 18, font: SANS, color: '888888' })] }))
    sideChildren.push(new Paragraph({ children: [new TextRun({ text: formatPhoneForDisplay(contact.phone), size: 21, font: SANS, color: 'cccccc' })], spacing: { after: 60 } }))
  }
  {
    const location = [contact.city, contact.state].filter(Boolean).join(', ')
    if (location) {
      sideChildren.push(new Paragraph({ children: [new TextRun({ text: 'LOCATION', bold: true, size: 18, font: SANS, color: '888888' })] }))
      sideChildren.push(new Paragraph({ children: [new TextRun({ text: location, size: 21, font: SANS, color: 'cccccc' })], spacing: { after: 60 } }))
    }
  }
  if (contact.linkedin_url) {
    const shortLi = contact.linkedin_url.replace(/^https?:\/\/(www\.)?/, '')
    sideChildren.push(new Paragraph({ children: [new TextRun({ text: 'LINKEDIN', bold: true, size: 18, font: SANS, color: '888888' })] }))
    sideChildren.push(new Paragraph({ children: [new TextRun({ text: shortLi, size: 19, font: SANS, color: 'cccccc' })], spacing: { after: 60 } }))
  }

  // Education
  if (education.length > 0) {
    sideChildren.push(sideHeading('Education'))
    education.forEach((edu: any) => {
      sideChildren.push(new Paragraph({ children: [new TextRun({ text: getDegree(edu), bold: true, size: 22, font: SANS, color: 'ffffff' })] }))
      sideChildren.push(new Paragraph({ children: [new TextRun({ text: getSchool(edu), size: 20, font: SANS, color: 'aaaaaa' })] }))
      sideChildren.push(new Paragraph({ children: [new TextRun({ text: getGradDate(edu), size: 19, font: SANS, color: '777777' })], spacing: { after: 80 } }))
    })
  }

  // Certifications
  if (certifications.length > 0) {
    sideChildren.push(sideHeading('Certifications'))
    certifications.forEach((c: any) => {
      sideChildren.push(new Paragraph({
        children: [
          new TextRun({ text: '\u2022 ', size: 21, color: 'd4a855', font: SANS }),
          new TextRun({ text: c.name, size: 21, font: SANS, color: 'cccccc' }),
        ],
        spacing: { after: 40 },
      }))
    })
  }

  // Skills
  if (skills.length > 0) {
    sideChildren.push(sideHeading('Core Skills'))
    sideChildren.push(new Paragraph({
      children: [new TextRun({ text: skills.map((s: any) => s.name).join(', '), size: 19, font: SANS, color: 'dddddd' })],
      spacing: { after: 100 },
    }))
  }

  // Clearance
  if (profile.clearance && profile.clearance !== 'none') {
    sideChildren.push(sideHeading('Clearance'))
    sideChildren.push(new Paragraph({
      children: [new TextRun({ text: formatClearance(profile.clearance).toUpperCase(), bold: true, size: 19, font: SANS, color: '2b2b2b' })],
      shading: { type: ShadingType.SOLID, color: 'd4a855' },
    }))
  }

  // === MAIN CONTENT ===
  const mainChildren: (Paragraph | Table)[] = []

  if (content.summary) {
    mainChildren.push(mainHeading('Professional Summary'))
    mainChildren.push(new Paragraph({
      children: [new TextRun({ text: content.summary, size: 22, font: SANS, color: '444444' })],
      spacing: { after: 200, line: 276 },
    }))
  }

  if (experiences.length > 0) {
    mainChildren.push(mainHeading('Professional Experience'))
    experiences.forEach((exp: any) => {
      mainChildren.push(new Paragraph({
        children: [new TextRun({ text: exp.civilian_title || exp.job_title, bold: true, size: 25, font: SERIF, color: '2b2b2b' })],
        spacing: { before: 150 },
      }))
      mainChildren.push(new Paragraph({
        children: [new TextRun({ text: formatDateRange(exp.start_date, exp.end_date, exp.is_current, resumeType), bold: true, size: 20, font: SANS, color: '888888' })],
      }))
      mainChildren.push(new Paragraph({
        children: [new TextRun({ text: `${exp.organization}${exp.location ? ` | ${exp.location}` : ''}`, italics: true, size: 22, font: SANS, color: '666666' })],
        spacing: { after: 50 },
      }))
      filterBullets(exp.bullets).forEach((b: any) => {
        mainChildren.push(new Paragraph({
          children: [
            new TextRun({ text: '\u2022 ', size: 21, color: 'd4a855', font: SANS }),
            new TextRun({ text: getBulletText(b), size: 21, font: SANS, color: '444444' }),
          ],
          spacing: { after: 40 },
          indent: { left: 360 },
        }))
      })
    })
  }

  // Federal sections in main
  mainChildren.push(...buildFederalSections(resumeType, profile, training, languages, affiliations, publications, mainHeading, SANS, 'd4a855'))

  if (mainChildren.length === 0) mainChildren.push(new Paragraph({ children: [] }))
  if (sideChildren.length === 0) sideChildren.push(new Paragraph({ children: [] }))

  const bodyTable = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: sideChildren,
            width: { size: 30, type: WidthType.PERCENTAGE },
            borders: noBorder(),
            shading: { type: ShadingType.SOLID, color: '2b2b2b' },
            margins: { top: 200, bottom: 200, left: 200, right: 200 },
          }),
          new TableCell({
            children: mainChildren,
            width: { size: 70, type: WidthType.PERCENTAGE },
            borders: noBorder(),
            margins: { top: 200, bottom: 200, left: 300, right: 200 },
          }),
        ],
      }),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorder() as any,
  })

  return new Document({
    sections: [{
      properties: { page: { margin: { top: 0, right: 0, bottom: 0, left: 0 } } },
      children: [bodyTable],
    }],
  })
}
