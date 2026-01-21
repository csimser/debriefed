import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getMilitaryCrosswalk, getOccupationContext } from '@/lib/onet-api'

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
  const branch = searchParams.get('branch') || 'navy' // Default to navy for backwards compatibility
  const includeContext = searchParams.get('context') === 'true'

  if (!code) {
    return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 })
  }

  try {
    // If context requested, get full context (titles, skills, tasks)
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
      })
    }

    // Simple crosswalk lookup with branch
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
    })
  } catch (error) {
    console.error('O*NET crosswalk error:', error)
    // Graceful fallback - return empty instead of error
    return NextResponse.json({
      crosswalk: [],
      message: 'Unable to fetch crosswalk data',
    })
  }
}
