/**
 * Client-side resume export — replaces /api/export-resume and
 * /api/export-tailored. Generation already used browser-capable libraries
 * (@react-pdf/renderer, docx); the file is now built and saved entirely
 * in the browser. No usage limits — the app is free.
 */
import React from 'react'
import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import { ResumeDocument } from '@/lib/pdf/ResumeDocument'
import { generateDocx } from '@/lib/docx/generateDocx'
import { resolveTemplate, type TemplateId } from '@/lib/templates'
import { trimForFederalLimit } from '@/lib/resume/federalTrimmer'

export interface ResumeExportInput {
  content: Record<string, unknown>
  resumeType?: 'private' | 'federal' | string
  format: 'pdf' | 'docx'
  template?: TemplateId | string
  /** Base file name without extension, e.g. the resume title. */
  fileName?: string
}

function sanitizeFileName(name: string): string {
  return name
    .replace(/[—–]/g, '-')
    .replace(/[""'']/g, '')
    .replace(/[^\x00-\xFF]/g, '')
    .trim()
}

/** Generates the file and triggers a download. Throws on failure. */
export async function exportResume({
  content,
  resumeType = 'private',
  format,
  template: rawTemplate = 'classic_professional',
  fileName = 'resume',
}: ResumeExportInput): Promise<void> {
  if (!content) throw new Error('Missing resume content')
  if (!['pdf', 'docx'].includes(format)) throw new Error('Invalid format. Use pdf or docx.')

  const template = resolveTemplate(rawTemplate as TemplateId)
  const type = resumeType === 'federal' ? 'federal' : 'private'

  // Apply federal 2-page trimmer
  const exportContent = type === 'federal' ? trimForFederalLimit(content) : content

  const base = sanitizeFileName(fileName) || 'resume'

  if (format === 'pdf') {
    const doc = React.createElement(ResumeDocument, {
      content: exportContent,
      resumeType: type,
      template,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const blob = await pdf(doc as any).toBlob()
    saveAs(blob, `${base}.pdf`)
  } else {
    const blob = await generateDocx(
      exportContent as Parameters<typeof generateDocx>[0],
      type,
      template,
    )
    saveAs(blob, `${base}.docx`)
  }
}
