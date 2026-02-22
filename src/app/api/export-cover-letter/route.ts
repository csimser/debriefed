import { NextRequest, NextResponse, after } from 'next/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { Document as DocxDocument, Packer, Paragraph, TextRun, AlignmentType, convertInchesToTwip, BorderStyle } from 'docx'
import { formatPhoneForDisplay } from '@/lib/formatPhone'
import { createClient } from '@/lib/supabase/server'
import { canUseFeature, incrementUsage, getUserTier, checkDailyLimit, isAdmin, getUserEmail } from '@/lib/usage-service'
import { logActivity, logApiUsage } from '@/lib/usage-tracking'

interface CoverLetterData {
  content: string
  format: 'pdf' | 'docx' | 'txt'
  applicantName: string
  applicantEmail?: string
  applicantPhone?: string
  applicantCity?: string
  applicantState?: string
  applicantLinkedIn?: string
  companyName: string
  companyAddress?: string
  hiringManagerName?: string
  jobTitle?: string
}

function parseCoverLetter(content: string, applicantName: string) {
  const lines = content.split('\n')

  let greeting = ''
  let closing = ''
  let signatureName = ''
  const bodyParagraphs: string[] = []

  let inBody = false
  let currentParagraph = ''

  for (const line of lines) {
    const trimmed = line.trim()

    if (!greeting && trimmed.startsWith('Dear ')) {
      // Extract just the greeting (up to first comma) — if body text is on the same line, split it
      const commaIdx = trimmed.indexOf(',')
      if (commaIdx !== -1 && commaIdx < trimmed.length - 1) {
        // There's text after "Dear Name," on the same line
        greeting = trimmed.substring(0, commaIdx + 1)
        const remainder = trimmed.substring(commaIdx + 1).trim()
        if (remainder) {
          currentParagraph = remainder
        }
      } else {
        greeting = trimmed
      }
      inBody = true
    } else if (
      trimmed.startsWith('Sincerely,') ||
      trimmed.startsWith('Sincerely') ||
      trimmed.startsWith('Best regards,') ||
      trimmed.startsWith('Best,') ||
      trimmed.startsWith('Regards,') ||
      trimmed.startsWith('Respectfully,') ||
      trimmed.startsWith('Thank you,')
    ) {
      if (currentParagraph.trim()) {
        bodyParagraphs.push(currentParagraph.trim())
        currentParagraph = ''
      }
      closing = trimmed.endsWith(',') ? trimmed : trimmed + ','
      inBody = false
    } else if (!inBody && closing && trimmed && !signatureName) {
      signatureName = trimmed
    } else if (inBody) {
      if (trimmed === '') {
        if (currentParagraph.trim()) {
          bodyParagraphs.push(currentParagraph.trim())
          currentParagraph = ''
        }
      } else {
        currentParagraph += (currentParagraph ? ' ' : '') + trimmed
      }
    }
  }

  if (currentParagraph.trim()) {
    bodyParagraphs.push(currentParagraph.trim())
  }

  return {
    greeting: greeting || 'Dear Hiring Team,',
    bodyParagraphs,
    closing: closing || 'Sincerely,',
    signatureName: signatureName || applicantName || '',
  }
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id

    // Check cover letter export limits (daily + period) — skip for admins
    const userEmail = await getUserEmail(userId)
    const adminUser = isAdmin(userEmail)

    if (!adminUser) {
      const usageCheck = await canUseFeature(userId, 'cover_letter_exports')
      if (!usageCheck.allowed) {
        return NextResponse.json(
          { error: usageCheck.reason || 'Cover letter export limit reached', limitReached: true },
          { status: 403 }
        )
      }
    }

    // Get tier + daily remaining for response headers (toast on client)
    const tierInfo = await getUserTier(userId)
    const dailyCheck = await checkDailyLimit(userId, 'cover_letter_exports')

    const data: CoverLetterData = await request.json()
    const {
      content,
      format,
      applicantName,
      applicantEmail,
      applicantPhone,
      applicantCity,
      applicantState,
      applicantLinkedIn,
      companyName,
      companyAddress,
      hiringManagerName,
      jobTitle,
    } = data

    if (!content) {
      return NextResponse.json({ error: 'Missing cover letter content' }, { status: 400 })
    }

    const today = formatDate()
    const safeCompanyName = (companyName || 'Application')
      .replace(/[^a-zA-Z0-9-_\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50)

    const { greeting, bodyParagraphs, closing, signatureName } = parseCoverLetter(content, applicantName)

    // Build contact line (format phone for display)
    const formattedPhone = formatPhoneForDisplay(applicantPhone)
    const contactParts: string[] = []
    if (applicantEmail) contactParts.push(applicantEmail)
    if (formattedPhone) contactParts.push(formattedPhone)
    const locationPart = [applicantCity, applicantState].filter(Boolean).join(', ')
    if (locationPart) contactParts.push(locationPart)

    // Generate file — variables populated by format-specific branch below
    let responseBody: Buffer | Uint8Array | string
    let responseContentType: string
    let responseFilename: string

    if (format === 'pdf') {
      const pdfDoc = await PDFDocument.create()

      // Use Times Roman for elegant professional look
      const fontRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman)
      const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

      const fontSize = 11
      const lineHeight = 14
      const paragraphSpacing = 12
      const sectionSpacing = 20
      const marginLeft = 72 // 1 inch
      const marginRight = 72
      const marginTop = 72
      const marginBottom = 72
      const pageWidth = 612  // Letter size
      const pageHeight = 792
      const contentWidth = pageWidth - marginLeft - marginRight

      const textColor = rgb(0.1, 0.1, 0.1)

      // Multi-page support: track current page and yPosition
      let currentPage = pdfDoc.addPage([pageWidth, pageHeight])
      let yPosition = pageHeight - marginTop

      const ensureSpace = (needed: number) => {
        if (yPosition - needed < marginBottom) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight])
          yPosition = pageHeight - marginTop
        }
      }

      // Helper to draw wrapped text with page break support
      const drawWrappedText = (
        text: string,
        font: typeof fontRegular,
        size: number,
        options: { indent?: number; lineSpacing?: number; color?: typeof textColor } = {}
      ) => {
        const { indent = 0, lineSpacing = lineHeight, color = textColor } = options
        const words = text.split(' ')
        let line = ''
        const effectiveWidth = contentWidth - indent

        for (const word of words) {
          const testLine = line + (line ? ' ' : '') + word
          const testWidth = font.widthOfTextAtSize(testLine, size)

          if (testWidth > effectiveWidth && line) {
            ensureSpace(lineSpacing)
            currentPage.drawText(line, {
              x: marginLeft + indent,
              y: yPosition,
              size,
              font,
              color,
            })
            yPosition -= lineSpacing
            line = word
          } else {
            line = testLine
          }
        }

        if (line) {
          ensureSpace(lineSpacing)
          currentPage.drawText(line, {
            x: marginLeft + indent,
            y: yPosition,
            size,
            font,
            color,
          })
          yPosition -= lineSpacing
        }
      }

      const drawLine = (text: string, font: typeof fontRegular, size: number, color = textColor) => {
        ensureSpace(lineHeight)
        currentPage.drawText(text, { x: marginLeft, y: yPosition, size, font, color })
        yPosition -= lineHeight
      }

      // === SENDER CONTACT BLOCK ===
      drawLine(applicantName || signatureName, fontBold, 12)
      yPosition -= 2

      if (contactParts.length > 0) {
        drawLine(contactParts.join('  |  '), fontRegular, 9, rgb(0.3, 0.3, 0.3))
      }

      if (applicantLinkedIn) {
        drawLine(applicantLinkedIn, fontRegular, 9, rgb(0.3, 0.3, 0.3))
      }

      // Subtle separator line
      yPosition -= 6
      currentPage.drawLine({
        start: { x: marginLeft, y: yPosition },
        end: { x: pageWidth - marginRight, y: yPosition },
        thickness: 0.5,
        color: rgb(0.7, 0.7, 0.7),
      })
      yPosition -= sectionSpacing

      // === DATE ===
      drawLine(today, fontRegular, fontSize)
      yPosition -= (sectionSpacing - lineHeight)

      // === RECIPIENT BLOCK ===
      if (hiringManagerName) {
        drawLine(hiringManagerName, fontRegular, fontSize)
      }

      if (companyName) {
        drawLine(companyName, fontRegular, fontSize)
      }

      if (companyAddress) {
        drawWrappedText(companyAddress, fontRegular, fontSize)
      }

      yPosition -= paragraphSpacing

      // === RE: LINE ===
      if (jobTitle) {
        ensureSpace(lineHeight)
        currentPage.drawText(`RE: ${jobTitle} Position`, {
          x: marginLeft,
          y: yPosition,
          size: fontSize,
          font: fontBold,
          color: textColor,
        })
        yPosition -= sectionSpacing
      }

      // === GREETING ===
      drawWrappedText(greeting, fontRegular, fontSize)
      yPosition -= (sectionSpacing - lineHeight)

      // === BODY PARAGRAPHS ===
      for (let i = 0; i < bodyParagraphs.length; i++) {
        drawWrappedText(bodyParagraphs[i], fontRegular, fontSize, {
          lineSpacing: lineHeight * 1.15,
        })

        if (i < bodyParagraphs.length - 1) {
          yPosition -= paragraphSpacing
        }
      }

      // === CLOSING ===
      yPosition -= sectionSpacing
      ensureSpace(lineHeight)
      currentPage.drawText(closing, {
        x: marginLeft,
        y: yPosition,
        size: fontSize,
        font: fontRegular,
        color: textColor,
      })

      // === SIGNATURE SPACE AND NAME ===
      yPosition -= sectionSpacing * 2
      ensureSpace(lineHeight)
      currentPage.drawText(signatureName, {
        x: marginLeft,
        y: yPosition,
        size: fontSize,
        font: fontBold,
        color: textColor,
      })

      const pdfBytes = await pdfDoc.save()

      responseBody = Buffer.from(pdfBytes)
      responseContentType = 'application/pdf'
      responseFilename = `Cover-Letter-${safeCompanyName}.pdf`
    } else if (format === 'docx') {
      // Professional DOCX with proper business letter formatting
      const children: Paragraph[] = []

      // === SENDER HEADER ===
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: applicantName || signatureName,
              font: 'Georgia',
              size: 26, // 13pt
              bold: true,
            }),
          ],
          spacing: { after: 60 },
        })
      )

      // Contact line
      if (contactParts.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: contactParts.join('  |  '),
                font: 'Georgia',
                size: 18, // 9pt
                color: '666666',
              }),
            ],
            spacing: { after: applicantLinkedIn ? 40 : 120 },
          })
        )
      }

      // LinkedIn
      if (applicantLinkedIn) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: applicantLinkedIn,
                font: 'Georgia',
                size: 18,
                color: '666666',
              }),
            ],
            spacing: { after: 120 },
          })
        )
      }

      // Separator line
      children.push(
        new Paragraph({
          border: {
            bottom: {
              color: 'CCCCCC',
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
          spacing: { after: 300 },
        })
      )

      // === DATE ===
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: today,
              font: 'Georgia',
              size: 22,
            }),
          ],
          spacing: { after: 300 },
        })
      )

      // === RECIPIENT BLOCK ===
      if (hiringManagerName) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: hiringManagerName,
                font: 'Georgia',
                size: 22,
              }),
            ],
            spacing: { after: 40 },
          })
        )
      }

      if (companyName) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: companyName,
                font: 'Georgia',
                size: 22,
              }),
            ],
            spacing: { after: companyAddress ? 40 : 200 },
          })
        )
      }

      if (companyAddress) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: companyAddress,
                font: 'Georgia',
                size: 22,
              }),
            ],
            spacing: { after: 200 },
          })
        )
      }

      // === RE: LINE ===
      if (jobTitle) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `RE: ${jobTitle} Position`,
                font: 'Georgia',
                size: 22,
                bold: true,
              }),
            ],
            spacing: { after: 300 },
          })
        )
      }

      // === GREETING ===
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: greeting,
              font: 'Georgia',
              size: 22,
            }),
          ],
          spacing: { after: 240 },
        })
      )

      // === BODY PARAGRAPHS ===
      for (const para of bodyParagraphs) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: para,
                font: 'Georgia',
                size: 22,
              }),
            ],
            spacing: {
              after: 200,
              line: 276, // 1.15 line spacing
            },
            alignment: AlignmentType.JUSTIFIED,
          })
        )
      }

      // === CLOSING ===
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: closing,
              font: 'Georgia',
              size: 22,
            }),
          ],
          spacing: { before: 200, after: 0 },
        })
      )

      // === SIGNATURE ===
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: signatureName,
              font: 'Georgia',
              size: 22,
              bold: true,
            }),
          ],
          spacing: { before: 600 }, // Space for handwritten signature
        })
      )

      const doc = new DocxDocument({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: convertInchesToTwip(1),
                  right: convertInchesToTwip(1),
                  bottom: convertInchesToTwip(1),
                  left: convertInchesToTwip(1),
                },
              },
            },
            children,
          },
        ],
      })

      const docxBuffer = await Packer.toBuffer(doc)

      responseBody = new Uint8Array(docxBuffer)
      responseContentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      responseFilename = `Cover-Letter-${safeCompanyName}.docx`
    } else {
      // Plain text with professional formatting
      const textParts: string[] = []

      // Header
      textParts.push(applicantName || signatureName)
      if (contactParts.length > 0) {
        textParts.push(contactParts.join(' | '))
      }
      if (applicantLinkedIn) {
        textParts.push(applicantLinkedIn)
      }
      textParts.push('')
      textParts.push('─'.repeat(60))
      textParts.push('')
      textParts.push(today)
      textParts.push('')

      if (hiringManagerName) textParts.push(hiringManagerName)
      if (companyName) textParts.push(companyName)
      if (companyAddress) textParts.push(companyAddress)
      textParts.push('')

      if (jobTitle) {
        textParts.push(`RE: ${jobTitle} Position`)
        textParts.push('')
      }

      textParts.push(greeting)
      textParts.push('')

      for (const para of bodyParagraphs) {
        textParts.push(para)
        textParts.push('')
      }

      textParts.push(closing)
      textParts.push('')
      textParts.push('')
      textParts.push(signatureName)

      const textContent = textParts.join('\n')

      responseBody = textContent
      responseContentType = 'text/plain; charset=utf-8'
      responseFilename = `Cover-Letter-${safeCompanyName}.txt`
    }

    // Increment usage INLINE — after() callbacks don't fire for binary responses
    await incrementUsage(userId, 'cover_letter_exports')

    // remaining - 1 because increment just happened
    const remainingAfter = Math.max(0, dailyCheck.remaining - 1)

    const response = new NextResponse(responseBody, {
      headers: {
        'Content-Type': responseContentType,
        'Content-Disposition': `attachment; filename="${responseFilename}"`,
        'X-User-Tier': tierInfo.tier,
        'X-Daily-Remaining': String(remainingAfter),
        'X-Daily-Limit': String(dailyCheck.limit),
      },
    })

    // Non-critical logging — safe in after() since it doesn't affect usage tracking
    after(async () => {
      try {
        await logActivity(userId, 'cover_letter_exported', {
          format,
          company_name: companyName,
          job_title: jobTitle,
        })
        await logApiUsage(userId, 'export-cover-letter', 0, 'file-generation')
      } catch (err) {
        console.error('Post-response activity logging failed:', err)
      }
    })

    return response
  } catch (error: any) {
    console.error('Cover letter export error:', error)
    return NextResponse.json(
      {
        error: 'Export failed. Please try again.',
      },
      { status: 500 }
    )
  }
}
