import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getMilitaryCrosswalk, getOccupationContext } from '@/lib/onet-api'

// Map UI branch values to dict_mos_to_civilian branch codes
const BRANCH_TO_DB: Record<string, string> = {
  'U.S. Navy': 'navy',
  'U.S. Army': 'army',
  'U.S. Air Force': 'usaf',
  'U.S. Marine Corps': 'usmc',
  'U.S. Coast Guard': 'uscg',
  'U.S. Space Force': 'ussf',
  // Lowercase/short forms
  'navy': 'navy',
  'army': 'army',
  'usaf': 'usaf',
  'air_force': 'usaf',
  'usmc': 'usmc',
  'marine_corps': 'usmc',
  'uscg': 'uscg',
  'coast_guard': 'uscg',
  'ussf': 'ussf',
  'space_force': 'ussf',
}

function normalizeBranchForDB(branch: string): string {
  return BRANCH_TO_DB[branch] || BRANCH_TO_DB[branch.toLowerCase().replace(/\s+/g, '_')] || 'navy'
}

// GET - Fetch military-to-civilian crosswalk
export async function GET(request: NextRequest) {
  const supabase = await createClient()

  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const branch = searchParams.get('branch') || 'navy'
  const includeContext = searchParams.get('context') === 'true'

  if (!code) {
    return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 })
  }

  const normalizedCode = code.toUpperCase().trim()
  const dbBranch = normalizeBranchForDB(branch)

  try {
    // 1. Try local dict_mos_to_civilian table first (most reliable, has rich data)
    const { data: localMatch } = await supabase
      .from('dict_mos_to_civilian')
      .select('military_code, military_title, civilian_titles, industries, key_skills')
      .eq('branch', dbBranch)
      .ilike('military_code', normalizedCode)
      .limit(1)
      .maybeSingle()

    if (localMatch?.civilian_titles && localMatch.civilian_titles.length > 0) {
      return NextResponse.json({
        crosswalk: localMatch.civilian_titles.slice(0, 10).map((title: string, i: number) => ({
          title,
          code: `local-${i}`,
        })),
        military_title: localMatch.military_title,
        skills: localMatch.key_skills || [],
        industries: localMatch.industries || [],
        source: 'local',
      })
    }

    // 2. Try local dict_onet_crosswalk table (DoD official crosswalk data)
    const { data: onetLocal } = await supabase
      .from('dict_onet_crosswalk')
      .select('moc, moc_title, onet_code, onet_title')
      .ilike('moc', normalizedCode)
      .not('onet_title', 'is', null)
      .limit(10)

    if (onetLocal && onetLocal.length > 0) {
      // Deduplicate by onet_title
      const seen = new Set<string>()
      const unique = onetLocal.filter(r => {
        if (!r.onet_title || seen.has(r.onet_title)) return false
        seen.add(r.onet_title)
        return true
      })

      if (unique.length > 0) {
        return NextResponse.json({
          crosswalk: unique.map(r => ({
            code: r.onet_code,
            title: r.onet_title,
          })),
          military_title: onetLocal[0].moc_title,
          source: 'onet_local',
        })
      }
    }

    // 3. Fall back to external O*NET API
    if (includeContext) {
      const context = await getOccupationContext(code, branch)
      if (!context) {
        return NextResponse.json({
          crosswalk: [],
          message: 'No civilian occupations found for this military code',
        })
      }
      return NextResponse.json({
        crosswalk: context.civilianTitles.map((title, i) => ({
          title,
          rank: i + 1,
        })),
        context: {
          skills: context.skills,
          tasks: context.tasks,
        },
        source: 'onet_api',
      })
    }

    const crosswalk = await getMilitaryCrosswalk(code, branch)

    if (!crosswalk || crosswalk.length === 0) {
      return NextResponse.json({
        crosswalk: [],
        message: 'No civilian occupations found for this military code',
      })
    }

    return NextResponse.json({
      crosswalk: crosswalk.slice(0, 10).map(item => ({
        code: item.code,
        title: item.title,
      })),
      source: 'onet_api',
    })
  } catch (error) {
    console.error('O*NET crosswalk error:', error)
    return NextResponse.json({
      crosswalk: [],
      message: 'Unable to fetch crosswalk data',
    })
  }
}
