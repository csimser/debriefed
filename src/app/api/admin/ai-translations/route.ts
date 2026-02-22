import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { isAdmin, getUserEmail } from '@/lib/usage-service'

const serviceClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: List AI translations with filters
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const email = await getUserEmail(user.id)
  if (!isAdmin(email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const url = new URL(request.url)
  const status = url.searchParams.get('status') || 'all'
  const sourceType = url.searchParams.get('source_type') || 'all'
  const branch = url.searchParams.get('branch') || 'all'
  const sort = url.searchParams.get('sort') || 'frequency'
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = 50

  let query = serviceClient
    .from('ai_generated_translations')
    .select('*', { count: 'exact' })

  if (status !== 'all') {
    query = query.eq('status', status)
  }
  if (sourceType !== 'all') {
    query = query.eq('source_type', sourceType)
  }
  if (branch !== 'all') {
    query = query.eq('branch', branch)
  }

  // Sorting
  if (sort === 'frequency') {
    query = query.order('occurrence_count', { ascending: false })
  } else if (sort === 'newest') {
    query = query.order('created_at', { ascending: false })
  } else if (sort === 'oldest') {
    query = query.order('created_at', { ascending: true })
  }

  query = query.range((page - 1) * limit, page * limit - 1)

  const { data, count, error } = await query

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 })
  }

  // Get counts by status
  const [pendingCount, approvedCount, rejectedCount] = await Promise.all([
    serviceClient.from('ai_generated_translations').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    serviceClient.from('ai_generated_translations').select('id', { count: 'exact', head: true }).in('status', ['approved', 'modified']),
    serviceClient.from('ai_generated_translations').select('id', { count: 'exact', head: true }).eq('status', 'rejected'),
  ])

  // Get stats
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [weekCaptures, monthApproved, totalOccurrences] = await Promise.all([
    serviceClient.from('ai_generated_translations').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo),
    serviceClient.from('ai_generated_translations').select('id', { count: 'exact', head: true }).in('status', ['approved', 'modified']).gte('approved_at', monthAgo),
    serviceClient.from('ai_generated_translations').select('occurrence_count').eq('status', 'pending'),
  ])

  const estimatedSavings = (totalOccurrences.data || []).reduce((sum: number, r: any) => sum + (r.occurrence_count || 0), 0) * 0.003

  return NextResponse.json({
    translations: data || [],
    total: count || 0,
    page,
    limit,
    counts: {
      pending: pendingCount.count || 0,
      approved: (approvedCount.count || 0),
      rejected: rejectedCount.count || 0,
    },
    stats: {
      capturedThisWeek: weekCaptures.count || 0,
      approvedThisMonth: monthApproved.count || 0,
      estimatedSavings: estimatedSavings.toFixed(2),
    },
  })
}

// PATCH: Approve, reject, or modify a translation
export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const email = await getUserEmail(user.id)
  if (!isAdmin(email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const { action, ids, dictTable, militaryOverride, civilianOverride, notes } = body

  if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'Missing action or ids' }, { status: 400 })
  }

  const results: { id: string; success: boolean; error?: string; dictEntryId?: string }[] = []

  for (const id of ids) {
    try {
      if (action === 'approve') {
        const { data, error } = await serviceClient.rpc('approve_ai_translation', {
          p_translation_id: id,
          p_admin_id: user.id,
          p_dict_table: dictTable || null,
          p_military_override: militaryOverride || null,
          p_civilian_override: civilianOverride || null,
          p_notes: notes || null,
        })

        if (error) {
          results.push({ id, success: false, error: error.message })
        } else {
          results.push({ id, success: true, dictEntryId: data })
        }
      } else if (action === 'reject') {
        const { error } = await serviceClient
          .from('ai_generated_translations')
          .update({
            status: 'rejected',
            approved_by: user.id,
            approved_at: new Date().toISOString(),
            notes: notes || null,
          })
          .eq('id', id)

        results.push({ id, success: !error, error: error?.message })
      }
    } catch (err: any) {
      results.push({ id, success: false, error: err.message })
    }
  }

  return NextResponse.json({ results })
}
