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
    linkedin_url?: string
  }
  summary?: string
  experiences?: any[]
  education?: any[]
  certifications?: any[]
  skills?: any[]
  // Federal-specific content
  profile?: {
    clearance?: string
    special_eligibility?: string[]
  }
  training?: any[]
  languages?: any[]
  affiliations?: any[]
  publications?: any[]
}

export async function generateDocx(
  content: ResumeContent,
  resumeType: 'private' | 'federal',
  template: TemplateId = 'clean'
): Promise<Buffer> {
  // Note: Template styling for DOCX is a future enhancement
  // Currently uses standard formatting regardless of template
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

  const children: Paragraph[] = []

  // === HEADER ===
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `${contact.first_name || ''} ${contact.last_name || ''}`.trim().toUpperCase(),
          bold: true,
          size: 36,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    })
  )

  // Contact line
  const contactParts = [
    contact.email,
    contact.phone ? formatPhoneForDisplay(contact.phone) : null,
    contact.city && contact.state ? `${contact.city}, ${contact.state}` : null,
    contact.linkedin_url,
  ].filter(Boolean)

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactParts.join(' • '),
            size: 20,
            color: '444444',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 12, color: '1a1a1a' },
        },
      })
    )
  }

  // === SUMMARY ===
  if (content.summary) {
    children.push(createSectionHeading('Professional Summary'))
    children.push(
      new Paragraph({
        children: [new TextRun({ text: content.summary, size: 22 })],
        spacing: { after: 200 },
      })
    )
  }

  // === EXPERIENCE ===
  if (experiences.length > 0) {
    children.push(createSectionHeading('Professional Experience'))

    experiences.forEach((exp: any) => {
      // Job title (with pay grade for federal) and dates on same line
      const titleText = resumeType === 'federal' && exp.grade_level
        ? `${exp.civilian_title || exp.job_title}, ${exp.grade_level}`
        : exp.civilian_title || exp.job_title

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: titleText,
              bold: true,
              size: 24,
            }),
            new TextRun({
              text: `\t${formatDateRange(exp.start_date, exp.end_date, exp.is_current, resumeType)}`,
              size: 20,
              color: '666666',
            }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          spacing: { before: 150 },
        })
      )

      // Company and location
      const companyChildren: TextRun[] = [
        new TextRun({
          text: exp.organization,
          italics: true,
          size: 22,
          color: '444444',
        }),
      ]

      if (exp.location) {
        companyChildren.push(
          new TextRun({
            text: ` | ${exp.location}`,
            size: 20,
            color: '666666',
          })
        )
      }

      children.push(
        new Paragraph({
          children: companyChildren,
          spacing: { after: 50 },
        })
      )

      // Federal metadata - use actual hours_per_week
      if (resumeType === 'federal') {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${exp.hours_per_week || 40} hours/week | Supervisor: Available upon request`,
                size: 18,
                color: '666666',
              }),
            ],
            spacing: { after: 50 },
          })
        )
      }

      // Bullets (filter out excluded)
      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets
          .filter((bullet: any) => bullet.status !== 'excluded')
          .forEach((bullet: any) => {
            const bulletText = bullet.is_accepted || bullet.status === 'accepted'
              ? bullet.translated_text
              : bullet.translated_text || bullet.original_text

            children.push(
              new Paragraph({
                children: [new TextRun({ text: bulletText, size: 21 })],
                bullet: { level: 0 },
                spacing: { after: 50 },
              })
            )
          })
      }
    })
  }

  // === EDUCATION ===
  if (education.length > 0) {
    children.push(createSectionHeading('Education'))

    education.forEach((edu: any) => {
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

      const degreeText = edu.field_of_study
        ? `${degreeDisplay} in ${edu.field_of_study}`
        : degreeDisplay

      // Support both school_name (new) and institution (legacy)
      const schoolName = edu.school_name || edu.institution

      // GPA: always show for federal, optional for private
      const gpaText = resumeType === 'federal'
        ? ` | GPA: ${edu.gpa || 'N/A'}`
        : edu.gpa ? ` | GPA: ${edu.gpa}` : ''

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: degreeText,
              bold: true,
              size: 22,
            }),
            new TextRun({
              text: `\t${gradDate}${gpaText}`,
              size: 20,
              color: '666666',
            }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        })
      )

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: schoolName,
              italics: true,
              size: 21,
              color: '444444',
            }),
          ],
          spacing: { after: 100 },
        })
      )
    })
  }

  // === CERTIFICATIONS ===
  if (certifications.length > 0) {
    children.push(createSectionHeading('Certifications'))
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: certifications.map((c: any) => c.name).join(' • '),
            size: 21,
          }),
        ],
        spacing: { after: 200 },
      })
    )
  }

  // === SKILLS ===
  if (skills.length > 0) {
    children.push(createSectionHeading('Skills'))
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: skills.map((s: any) => s.name).join(' • '),
            size: 21,
          }),
        ],
        spacing: { after: 200 },
      })
    )
  }

  // === FEDERAL-ONLY SECTIONS ===
  if (resumeType === 'federal') {
    // Security Clearance
    if (profile.clearance && profile.clearance !== 'none') {
      children.push(createSectionHeading('Security Clearance'))
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: formatClearance(profile.clearance),
              size: 21,
            }),
          ],
          spacing: { after: 200 },
        })
      )
    }

    // Job-Related Training
    if (training.length > 0) {
      children.push(createSectionHeading('Job-Related Training'))
      training.forEach((t: any) => {
        const trainingText = [
          t.name,
          t.provider ? `– ${t.provider}` : '',
          t.completion_date ? `(${t.completion_date})` : '',
          t.hours ? `– ${t.hours} hours` : '',
        ].filter(Boolean).join(' ')

        children.push(
          new Paragraph({
            children: [new TextRun({ text: trainingText, size: 21 })],
            bullet: { level: 0 },
            spacing: { after: 50 },
          })
        )
      })
    }

    // Language Skills
    if (languages.length > 0) {
      children.push(createSectionHeading('Language Skills'))
      languages.forEach((lang: any) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${lang.language}: ${getProficiencyLabel(lang.proficiency)}`,
                size: 21,
              }),
            ],
            bullet: { level: 0 },
            spacing: { after: 50 },
          })
        )
      })
    }

    // Professional Affiliations
    if (affiliations.length > 0) {
      children.push(createSectionHeading('Professional Affiliations'))
      affiliations.forEach((aff: any) => {
        const affText = aff.role ? `${aff.name} – ${aff.role}` : aff.name
        children.push(
          new Paragraph({
            children: [new TextRun({ text: affText, size: 21 })],
            bullet: { level: 0 },
            spacing: { after: 50 },
          })
        )
      })
    }

    // Publications
    if (publications.length > 0) {
      children.push(createSectionHeading('Publications'))
      publications.forEach((pub: any) => {
        const pubText = [
          pub.title,
          pub.publication ? `, ${pub.publication}` : '',
          pub.date ? ` (${pub.date})` : '',
        ].join('')

        children.push(
          new Paragraph({
            children: [new TextRun({ text: pubText, size: 21 })],
            bullet: { level: 0 },
            spacing: { after: 50 },
          })
        )
      })
    }

    // Special Hiring Authorities
    if (profile.special_eligibility && profile.special_eligibility.length > 0) {
      children.push(createSectionHeading('Special Hiring Authorities'))
      profile.special_eligibility.forEach((elig: string) => {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: elig, size: 21 })],
            bullet: { level: 0 },
            spacing: { after: 50 },
          })
        )
      })
    }
  }

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,    // 0.5 inch
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children,
      },
    ],
  })

  const buffer = await Packer.toBuffer(doc)
  return Buffer.from(buffer)
}

function createSectionHeading(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 24,
      }),
    ],
    heading: HeadingLevel.HEADING_2,
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: 'cccccc' },
    },
    spacing: { before: 250, after: 150 },
  })
}
