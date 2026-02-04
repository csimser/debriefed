import { createClient } from '@supabase/supabase-js'

// Service role client for server-side usage tracking
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Valid usage fields that can be incremented
export type UsageField =
  | 'resumes_created'
  | 'resumes_downloaded'
  | 'cover_letters'
  | 'job_matches'
  | 'eval_uploads'
  | 'bullet_rewrites'
  | 'ai_summaries'
  | 'private_downloads'
  | 'federal_downloads'
  | 'resume_imports'

/**
 * Log API usage for token tracking
 * @param userId - User ID
 * @param endpoint - Endpoint/feature name
 * @param tokensUsed - Total tokens used (input + output)
 * @param model - Model name
 */
export async function logApiUsage(
  userId: string,
  endpoint: string,
  tokensUsed: number,
  model: string
) {
  try {
    const { error } = await supabase.from('api_usage').insert({
      user_id: userId,
      endpoint,
      tokens_used: tokensUsed,
      model,
    })

    if (error) {
      console.error('Error logging API usage:', error)
    }
  } catch (err) {
    console.error('Failed to log API usage:', err)
  }
}

/**
 * Increment a cumulative usage counter for a user
 */
export async function incrementUsage(userId: string, field: UsageField) {
  try {
    // First try to get existing record
    const { data: existing, error: selectError } = await supabase
      .from('usage')
      .select('id, ' + field)
      .eq('user_id', userId)
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is fine
      console.error('Error checking usage:', selectError)
      return
    }

    if (existing) {
      // Update existing record
      const currentValue = (existing as Record<string, any>)[field] || 0
      const { error: updateError } = await supabase
        .from('usage')
        .update({
          [field]: currentValue + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (updateError) {
        console.error('Error updating usage:', updateError)
      }
    } else {
      // Create new record
      const { error: insertError } = await supabase
        .from('usage')
        .insert({
          user_id: userId,
          [field]: 1,
          resumes_created: field === 'resumes_created' ? 1 : 0,
          resumes_downloaded: field === 'resumes_downloaded' ? 1 : 0,
          cover_letters: field === 'cover_letters' ? 1 : 0,
          job_matches: field === 'job_matches' ? 1 : 0,
          eval_uploads: field === 'eval_uploads' ? 1 : 0,
          bullet_rewrites: field === 'bullet_rewrites' ? 1 : 0,
          ai_summaries: field === 'ai_summaries' ? 1 : 0,
          private_downloads: field === 'private_downloads' ? 1 : 0,
          federal_downloads: field === 'federal_downloads' ? 1 : 0,
          resume_imports: field === 'resume_imports' ? 1 : 0,
        })

      if (insertError) {
        console.error('Error inserting usage:', insertError)
      }
    }
  } catch (err) {
    console.error('Failed to increment usage:', err)
  }
}

/**
 * Log daily feature usage for rate limiting and analytics
 */
export async function logDailyUsage(userId: string, feature: string) {
  try {
    const today = new Date().toISOString().split('T')[0]

    // Check for existing record for today
    const { data: existing, error: selectError } = await supabase
      .from('daily_usage')
      .select('id, count')
      .eq('user_id', userId)
      .eq('feature', feature)
      .eq('date', today)
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error checking daily usage:', selectError)
      return
    }

    if (existing) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('daily_usage')
        .update({ count: (existing.count || 0) + 1 })
        .eq('id', existing.id)

      if (updateError) {
        console.error('Error updating daily usage:', updateError)
      }
    } else {
      // Create new record
      const { error: insertError } = await supabase
        .from('daily_usage')
        .insert({
          user_id: userId,
          feature,
          count: 1,
          date: today
        })

      if (insertError) {
        console.error('Error inserting daily usage:', insertError)
      }
    }
  } catch (err) {
    console.error('Failed to log daily usage:', err)
  }
}

/**
 * Get user's daily usage count for a feature (for rate limiting)
 */
export async function getDailyUsageCount(userId: string, feature: string): Promise<number> {
  try {
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('daily_usage')
      .select('count')
      .eq('user_id', userId)
      .eq('feature', feature)
      .eq('date', today)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error getting daily usage:', error)
      return 0
    }

    return data?.count || 0
  } catch (err) {
    console.error('Failed to get daily usage:', err)
    return 0
  }
}

/**
 * Get user's total usage stats
 */
export async function getUserUsageStats(userId: string) {
  try {
    const { data, error } = await supabase
      .from('usage')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error getting user usage stats:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Failed to get user usage stats:', err)
    return null
  }
}

/**
 * Get user's total API token usage
 */
export async function getUserTotalTokens(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('api_usage')
      .select('tokens_used')
      .eq('user_id', userId)

    if (error) {
      console.error('Error getting user tokens:', error)
      return 0
    }

    return (data || []).reduce((sum, row) => sum + (row.tokens_used || 0), 0)
  } catch (err) {
    console.error('Failed to get user tokens:', err)
    return 0
  }
}

// =====================================================
// USER ACTIVITY LOGGING
// =====================================================

/**
 * Valid activity types for user actions
 */
export type ActivityType =
  | 'login'
  | 'logout'
  | 'resume_created'
  | 'resume_edited'
  | 'resume_downloaded'
  | 'resume_deleted'
  | 'cover_letter_generated'
  | 'job_analysis_run'
  | 'linkedin_analysis_run'
  | 'linkedin_content_generated'
  | 'eval_uploaded'
  | 'eval_parsed'
  | 'document_uploaded'
  | 'profile_updated'
  | 'subscription_started'
  | 'subscription_expired'
  | 'feature_limit_reached'

/**
 * Log user activity for tracking and analytics
 * @param userId - User ID performing the action
 * @param action - Type of activity
 * @param details - Additional metadata about the action
 * @param ipHash - Optional: hashed IP address
 * @param userAgent - Optional: browser user agent
 */
export async function logActivity(
  userId: string,
  action: ActivityType,
  details: Record<string, any> = {},
  ipHash?: string,
  userAgent?: string
) {
  try {
    const { error } = await supabase.from('activity_log').insert({
      user_id: userId,
      action,
      details: {
        ...details,
        timestamp: new Date().toISOString(),
      },
      ip_hash: ipHash || null,
      user_agent: userAgent || null,
    })

    if (error) {
      console.error('Error logging activity:', error)
    }
  } catch (err) {
    console.error('Failed to log activity:', err)
  }
}

/**
 * Get user's recent activity
 */
export async function getUserActivity(userId: string, limit: number = 50) {
  try {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error getting user activity:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Failed to get user activity:', err)
    return []
  }
}

/**
 * Ensure user has a usage record (create if not exists)
 */
export async function ensureUsageRecord(userId: string) {
  try {
    const { data: existing } = await supabase
      .from('usage')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!existing) {
      await supabase.from('usage').insert({
        user_id: userId,
        resumes_created: 0,
        resumes_downloaded: 0,
        cover_letters: 0,
        job_matches: 0,
        eval_uploads: 0,
        bullet_rewrites: 0,
        ai_summaries: 0,
        private_downloads: 0,
        federal_downloads: 0,
        resume_imports: 0,
        linkedin_generations: 0,
      })
    }
  } catch (err) {
    console.error('Failed to ensure usage record:', err)
  }
}
