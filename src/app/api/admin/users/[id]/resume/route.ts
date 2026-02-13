import { NextRequest, NextResponse } from 'next/server'
import { pdf } from '@react-pdf/renderer'
import { ResumeDocument } from '@/lib/pdf/ResumeDocument'
import { generateDocx } from '@/lib/docx/generateDocx'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { TemplateId, resolveTemplate } from '@/lib/templates'
import React from 'react'

// Service role client bypasses RLS for admin queries
const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper to verify admin
async function verifyAdmin(authClient: any) {
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return { error: 'Unauthorized', status: 401 }

  const { data: profile } = await serviceClient
    .from('profiles')
    .select('is_admin, email')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) return { error: 'Forbidden - Admin only', status: 403 }

  return { user, adminProfile: profile }
}

// Helper to log admin actions
async function logAdminAction(
  adminUserId: string,
  adminEmail: string,
  targetUserId: string,
  action: string,
  details: Record<string, any>
) {
  try {
    await serviceClient.from('activity_log').insert({
      user_id: adminUserId,
      action,
      details: {
        ...details,
        admin_email: adminEmail,
        target_user_id: targetUserId,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Failed to log admin action:', error)
  }
}

// POST - Export a user's resume (admin only, no usage increment)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: targetUserId } = await params
    const authClient = await createClient()

    const auth = await verifyAdmin(authClient)
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const body = await request.json()
    const { resumeId, format = 'pdf' } = body

    if (!resumeId) {
      return NextResponse.json({ error: 'Missing resumeId' }, { status: 400 })
    }

    if (!['pdf', 'docx'].includes(format)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
    }

    // Fetch resume - verify it belongs to the target user
    const { data: resume, error: resumeError } = await serviceClient
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .eq('user_id', targetUserId)
      .single()

    if (resumeError || !resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    // Get target user profile for logging
    const { data: targetProfile } = await serviceClient
      .from('profiles')
      .select('email')
      .eq('user_id', targetUserId)
      .single()

    // Log admin export action
    await logAdminAction(auth.user.id, auth.adminProfile.email, targetUserId, 'admin_exported_resume', {
      resume_id: resumeId,
      resume_name: resume.name,
      resume_type: resume.resume_type,
      format,
      target_email: targetProfile?.email,
    })

    // Generate file based on format
    let arrayBuffer: ArrayBuffer
    let contentType: string
    let extension: string

    const template = resolveTemplate(resume.template)

    if (format === 'pdf') {
      const doc = React.createElement(ResumeDocument, {
        content: resume.content,
        resumeType: resume.resume_type || 'private',
        template,
      })
      const pdfInstance = pdf(doc as any)
      const blob = await pdfInstance.toBlob()
      arrayBuffer = await blob.arrayBuffer()
      contentType = 'application/pdf'
      extension = 'pdf'
    } else {
      const buffer = await generateDocx(resume.content, resume.resume_type || 'private', template)
      arrayBuffer = new Uint8Array(buffer).buffer
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      extension = 'docx'
    }

    const filename = `${resume.name || 'resume'}.${extension}`

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Admin export error:', error)
    return NextResponse.json({ error: 'Failed to export' }, { status: 500 })
  }
}

// GET - Get resume content for preview (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: targetUserId } = await params
    const authClient = await createClient()

    const auth = await verifyAdmin(authClient)
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { searchParams } = new URL(request.url)
    const resumeId = searchParams.get('resumeId')

    if (!resumeId) {
      return NextResponse.json({ error: 'Missing resumeId' }, { status: 400 })
    }

    // Fetch resume - verify it belongs to the target user
    const { data: resume, error: resumeError } = await serviceClient
      .from('resumes')
      .select('id, name, template, resume_type, content, created_at, updated_at')
      .eq('id', resumeId)
      .eq('user_id', targetUserId)
      .single()

    if (resumeError || !resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    // Get target user profile for logging
    const { data: targetProfile } = await serviceClient
      .from('profiles')
      .select('email')
      .eq('user_id', targetUserId)
      .single()

    // Log admin preview action
    await logAdminAction(auth.user.id, auth.adminProfile.email, targetUserId, 'admin_previewed_resume', {
      resume_id: resumeId,
      resume_name: resume.name,
      target_email: targetProfile?.email,
    })

    return NextResponse.json({ resume })
  } catch (error) {
    console.error('Admin preview error:', error)
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 })
  }
}
