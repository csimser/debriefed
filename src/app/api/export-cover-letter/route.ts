import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { Document as DocxDocument, Packer, Paragraph, TextRun, AlignmentType, convertInchesToTwip } from 'docx'

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

    if (trimmed.startsWith('Dear ')) {
      greeting = trimmed
      inBody = true
    } else if (
      trimmed.startsWith('Sincerely,') ||
      trimmed.startsWith('Sincerely') ||
      trimmed.startsWith('Best regards,') ||
      trimmed.startsWith('Best,') ||
      trimmed.startsWith('Regards,') ||
      trimmed.startsWith('Thank you,')
    ) {
      if (currentParagraph.trim()) {
        bodyParagraphs.push(currentParagraph.trim())
        currentParagraph = ''
      }
      closing = trimmed
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
    greeting,
    bodyParagraphs,
    closing,
    signatureName: signatureName || applicantName || '',
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, format, applicantName, companyName } = await request.json()

    if (!content) {
      return NextResponse.json({ error: 'Missing cover letter content' }, { status: 400 })
    }

    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const safeCompanyName = (companyName || 'Application')
      .replace(/[^a-zA-Z0-9-_\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50)

    if (format === 'pdf') {
      const { greeting, bodyParagraphs, closing, signatureName } = parseCoverLetter(content, applicantName)

      const pdfDoc = await PDFDocument.create()
      let page = pdfDoc.addPage([612, 792]) // Letter size
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

      const fontSize = 11
      const lineHeight = 15
      const paragraphSpacing = 22  // Space between paragraphs
      const marginLeft = 72
      const marginTop = 72
      const marginBottom = 72
      const contentWidth = 612 - marginLeft - 72

      let yPosition = 792 - marginTop // Start from top

      // Helper to wrap and draw text, returns new Y position
      const drawText = (text: string, y: number): number => {
        const words = text.split(' ')
        let line = ''
        let currentY = y

        for (const word of words) {
          const testLine = line + (line ? ' ' : '') + word
          const testWidth = font.widthOfTextAtSize(testLine, fontSize)

          if (testWidth > contentWidth && line) {
            // Check for page break before drawing
            if (currentY < marginBottom + lineHeight) {
              page = pdfDoc.addPage([612, 792])
              currentY = 792 - marginTop
            }
            page.drawText(line, {
              x: marginLeft,
              y: currentY,
              size: fontSize,
              font,
              color: rgb(0.12, 0.12, 0.12)
            })
            currentY -= lineHeight
            line = word
          } else {
            line = testLine
          }
        }

        // Draw remaining text
        if (line) {
          if (currentY < marginBottom + lineHeight) {
            page = pdfDoc.addPage([612, 792])
            currentY = 792 - marginTop
          }
          page.drawText(line, {
            x: marginLeft,
            y: currentY,
            size: fontSize,
            font,
            color: rgb(0.12, 0.12, 0.12)
          })
          currentY -= lineHeight
        }

        return currentY
      }

      // === DATE ===
      yPosition = drawText(today, yPosition)
      yPosition -= paragraphSpacing * 1.5  // Extra space after date

      // === GREETING ===
      if (greeting) {
        yPosition = drawText(greeting, yPosition)
        yPosition -= paragraphSpacing  // Space after greeting before first paragraph
      }

      // === BODY PARAGRAPHS ===
      for (let i = 0; i < bodyParagraphs.length; i++) {
        yPosition = drawText(bodyParagraphs[i], yPosition)

        // Add paragraph spacing (but not after the last paragraph)
        if (i < bodyParagraphs.length - 1) {
          yPosition -= paragraphSpacing
        }
      }

      // === CLOSING ===
      yPosition -= paragraphSpacing  // Normal space before closing
      if (closing) {
        yPosition = drawText(closing, yPosition)
      }

      // === SIGNATURE ===
      yPosition -= paragraphSpacing * 1.8  // Room for handwritten signature
      drawText(signatureName, yPosition)

      const pdfBytes = await pdfDoc.save()

      return new NextResponse(Buffer.from(pdfBytes), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="Cover-Letter-${safeCompanyName}.pdf"`,
        },
      })

    } else if (format === 'docx') {
      // Generate DOCX
      const { greeting, bodyParagraphs, closing, signatureName } = parseCoverLetter(content, applicantName)

      const doc = new DocxDocument({
        sections: [{
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
          children: [
            // Date
            new Paragraph({
              children: [
                new TextRun({
                  text: today,
                  font: 'Calibri',
                  size: 24,
                }),
              ],
              spacing: { after: 400 },
            }),

            // Greeting
            ...(greeting ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: greeting,
                    font: 'Calibri',
                    size: 24,
                  }),
                ],
                spacing: { after: 280 },
              }),
            ] : []),

            // Body paragraphs
            ...bodyParagraphs.map(para =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: para,
                    font: 'Calibri',
                    size: 24,
                  }),
                ],
                spacing: {
                  after: 240,
                  line: 276,
                },
                alignment: AlignmentType.JUSTIFIED,
              })
            ),

            // Closing
            ...(closing ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: closing,
                    font: 'Calibri',
                    size: 24,
                  }),
                ],
                spacing: { before: 400, after: 0 },
              }),
            ] : []),

            // Signature
            new Paragraph({
              children: [
                new TextRun({
                  text: signatureName,
                  font: 'Calibri',
                  size: 24,
                }),
              ],
              spacing: { before: 600 },
            }),
          ],
        }],
      })

      const docxBuffer = await Packer.toBuffer(doc)

      return new NextResponse(new Uint8Array(docxBuffer), {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename="Cover-Letter-${safeCompanyName}.docx"`,
        },
      })
    } else {
      // Plain text fallback
      const text = `${today}\n\n${content}`

      return new NextResponse(text, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="Cover-Letter-${safeCompanyName}.txt"`,
        },
      })
    }
  } catch (error: any) {
    console.error('Cover letter export error:', error)
    return NextResponse.json({
      error: 'Export failed: ' + (error.message || 'Unknown error')
    }, { status: 500 })
  }
}
