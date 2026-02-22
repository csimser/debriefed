export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { canUseFeature, isAdmin, getUserEmail } from '@/lib/usage-service'
import { callWithEscalation, getModelString } from '@/lib/ai-model'

const anthropic = new Anthropic()

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('[ExtractText] File received:', file.name, file.type, file.size)

    const isPDF = file.type === 'application/pdf'
    const isDOCX = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

    if (!isPDF && !isDOCX) {
      console.log('[ExtractText] Rejected file type:', file.type)
      return NextResponse.json({ error: 'Please upload a PDF or DOCX file' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 })
    }

    let text = ''

    // Centralized admin check (handles case normalization)
    const userEmail = await getUserEmail(user.id)
    const adminUser = isAdmin(userEmail)

    if (isPDF) {
      // PDF: use Haiku vision — handles scanned, image-based, and standard PDFs
      // This counts against resume_imports limit since it's an AI call
      if (!adminUser) {
        const usageCheck = await canUseFeature(user.id, 'resume_imports')
        if (!usageCheck.allowed) {
          return NextResponse.json({
            error: "You've used all 3 free imports. Paste your resume text directly, or upgrade to Core for unlimited imports.",
            limitReached: true,
          }, { status: 403 })
        }
      }

      try {
        const buffer = Buffer.from(await file.arrayBuffer())

        console.log('[ExtractText] PDF buffer size:', buffer.length, 'magic:', buffer.slice(0, 4).toString())

        if (buffer.slice(0, 4).toString() !== '%PDF') {
          return NextResponse.json({ error: 'Invalid PDF file format.' }, { status: 400 })
        }

        const base64 = buffer.toString('base64')

        const { response, model_used } = await callWithEscalation(
          anthropic,
          {
            max_tokens: 4096,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'document',
                    source: {
                      type: 'base64',
                      media_type: 'application/pdf',
                      data: base64,
                    },
                  },
                  {
                    type: 'text',
                    text: 'Extract all text from this document. Return only the raw text, preserving line breaks and section structure. Do not summarize or interpret.',
                  },
                ],
              },
            ],
          },
          { expectsJson: false }
        )

        text = response.content[0]?.type === 'text' ? response.content[0].text : ''

        console.log('[ExtractText] PDF extracted via', model_used, '- text length:', text.length)
      } catch (pdfError: any) {
        console.error('[ExtractText] PDF vision error:', pdfError.message)
        return NextResponse.json({
          error: "We couldn't read this PDF. Try a DOCX, or paste your resume text directly.",
        }, { status: 400 })
      }
    } else if (isDOCX) {
      // DOCX: mammoth — free, local, works great
      // Check resume_imports limit (matches PDF path enforcement)
      if (!adminUser) {
        const usageCheck = await canUseFeature(user.id, 'resume_imports')
        if (!usageCheck.allowed) {
          return NextResponse.json({
            error: "You've used all your free imports. Paste your resume text directly, or upgrade to Core for unlimited imports.",
            limitReached: true,
          }, { status: 403 })
        }
      }

      try {
        const mammoth = require('mammoth')
        const buffer = Buffer.from(await file.arrayBuffer())

        console.log('[ExtractText] DOCX buffer size:', buffer.length)

        const result = await mammoth.extractRawText({ buffer })
        text = result.value || ''

        console.log('[ExtractText] DOCX parsed, text length:', text.length)
      } catch (docxError: any) {
        console.error('[ExtractText] DOCX parse error:', docxError.message)
        return NextResponse.json({
          error: "We couldn't read this DOCX file. Try a PDF, or paste your resume text directly.",
        }, { status: 400 })
      }
    }

    if (!text || text.trim().length < 30) {
      console.log('[ExtractText] Text too short after extraction:', text.length, 'chars')
      return NextResponse.json({
        error: "We couldn't extract enough text from this file. Try a DOCX, or paste your resume text directly.",
      }, { status: 400 })
    }

    console.log('[ExtractText] Success, returning', text.trim().length, 'chars')

    return NextResponse.json({
      text: text.trim(),
      fileName: file.name,
      fileSize: file.size,
      pdfUsedAI: isPDF,
    })
  } catch (error: any) {
    console.error('[ExtractText] Unexpected error:', error.message, error.stack)
    return NextResponse.json({
      error: "We couldn't extract text from this file. Try a DOCX, or paste your resume text directly.",
    }, { status: 500 })
  }
}
