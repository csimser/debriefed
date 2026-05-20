// Abuse Detection Service for Debriefed
// Detects and handles abusive behavior patterns

import { createAdminClient } from '@/lib/supabase/admin';
import { logAbuse } from '@/lib/ai-security';

// In-memory request tracking (use Redis in production)
const recentRequests: Map<string, { timestamps: number[]; inputs: string[] }> = new Map();

interface AbuseDetectionResult {
  flagged: boolean;
  reason?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

interface UserStatusResult {
  allowed: boolean;
  reason?: string;
}

// Detect rapid successive requests
function detectRapidRequests(userId: string): AbuseDetectionResult {
  const key = `rapid:${userId}`;
  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;

  const existing = recentRequests.get(key);

  if (!existing) {
    recentRequests.set(key, { timestamps: [now], inputs: [] });
    return { flagged: false };
  }

  // Filter to only recent timestamps
  const recentTimestamps = existing.timestamps.filter((t) => t > oneMinuteAgo);
  recentTimestamps.push(now);

  // Update storage
  recentRequests.set(key, { ...existing, timestamps: recentTimestamps });

  // Check if more than 10 requests in the last minute
  if (recentTimestamps.length > 10) {
    return {
      flagged: true,
      reason: `Rapid requests detected: ${recentTimestamps.length} requests in 1 minute`,
      severity: 'medium',
    };
  }

  return { flagged: false };
}

// Detect repeated identical requests
function detectRepeatedRequests(userId: string, input: string): AbuseDetectionResult {
  const key = `repeated:${userId}`;
  const inputHash = hashInput(input);

  const existing = recentRequests.get(key);

  if (!existing) {
    recentRequests.set(key, { timestamps: [], inputs: [inputHash] });
    return { flagged: false };
  }

  // Check if this exact input was used recently
  const duplicateCount = existing.inputs.filter((i) => i === inputHash).length;

  // Add this input
  existing.inputs.push(inputHash);
  // Keep only last 20 inputs
  if (existing.inputs.length > 20) {
    existing.inputs = existing.inputs.slice(-20);
  }

  if (duplicateCount >= 3) {
    return {
      flagged: true,
      reason: `Repeated identical requests: ${duplicateCount + 1} times`,
      severity: 'low',
    };
  }

  return { flagged: false };
}

// Simple hash function for inputs
function hashInput(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

// Known attack patterns
const ATTACK_PATTERNS = [
  // SQL injection patterns
  /('|"|;|--|\bOR\b|\bAND\b)\s*(=|>|<|LIKE)/gi,
  /\bUNION\b.*\bSELECT\b/gi,
  /\bDROP\b.*\bTABLE\b/gi,

  // Command injection patterns
  /[;&|`$]\s*(cat|ls|rm|wget|curl|nc|bash|sh|python|perl)/gi,
  /\$\(.*\)/g,
  /`[^`]+`/g,

  // Path traversal
  /\.\.\//g,
  /%2e%2e%2f/gi,

  // XXE patterns
  /<!ENTITY/gi,
  /<!DOCTYPE.*\[/gi,
];

// Detect known attack patterns
function detectAttackPatterns(input: string): AbuseDetectionResult {
  for (const pattern of ATTACK_PATTERNS) {
    if (pattern.test(input)) {
      pattern.lastIndex = 0; // Reset for global patterns
      return {
        flagged: true,
        reason: `Attack pattern detected: ${pattern.source}`,
        severity: 'high',
      };
    }
    pattern.lastIndex = 0;
  }

  return { flagged: false };
}

// Main abuse detection function
export async function detectAbuse(
  userId: string,
  ip: string,
  action: string,
  input: string,
  metadata: Record<string, unknown> = {}
): Promise<AbuseDetectionResult> {
  // Check for rapid requests
  const rapidCheck = detectRapidRequests(userId);
  if (rapidCheck.flagged) {
    await logAbuse(userId, ip, action, {
      ...metadata,
      reason: rapidCheck.reason,
    }, rapidCheck.severity!);
    return rapidCheck;
  }

  // Check for repeated requests
  const repeatedCheck = detectRepeatedRequests(userId, input);
  if (repeatedCheck.flagged) {
    await logAbuse(userId, ip, action, {
      ...metadata,
      reason: repeatedCheck.reason,
    }, repeatedCheck.severity!);
    return repeatedCheck;
  }

  // Check for attack patterns
  const attackCheck = detectAttackPatterns(input);
  if (attackCheck.flagged) {
    await logAbuse(userId, ip, action, {
      ...metadata,
      reason: attackCheck.reason,
    }, attackCheck.severity!);
    return attackCheck;
  }

  // Check previous abuse flags in database
  const previousAbuse = await checkPreviousAbuse(userId);
  if (previousAbuse.flagged) {
    return previousAbuse;
  }

  return { flagged: false };
}

// Check for previous abuse flags in the database
async function checkPreviousAbuse(userId: string): Promise<AbuseDetectionResult> {
  try {
    const supabase = createAdminClient();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: abuseRecords } = await supabase
      .from('abuse_log')
      .select('severity')
      .eq('user_id', userId)
      .gte('created_at', oneDayAgo);

    if (!abuseRecords || abuseRecords.length === 0) {
      return { flagged: false };
    }

    // Count severity levels
    const criticalCount = abuseRecords.filter((r) => r.severity === 'critical').length;
    const highCount = abuseRecords.filter((r) => r.severity === 'high').length;
    const mediumCount = abuseRecords.filter((r) => r.severity === 'medium').length;

    // Flag if multiple high severity or any critical
    if (criticalCount > 0) {
      return {
        flagged: true,
        reason: 'Previous critical abuse detected',
        severity: 'critical',
      };
    }

    if (highCount >= 3) {
      return {
        flagged: true,
        reason: 'Multiple high severity abuse incidents',
        severity: 'high',
      };
    }

    if (highCount + mediumCount >= 5) {
      return {
        flagged: true,
        reason: 'Repeated abuse incidents',
        severity: 'medium',
      };
    }

    return { flagged: false };
  } catch (error) {
    console.error('Error checking previous abuse:', error);
    return { flagged: false };
  }
}

// Check if a user is allowed to make requests
export async function checkUserStatus(userId: string): Promise<UserStatusResult> {
  try {
    const supabase = createAdminClient();

    // Check if user is suspended
    const { data: profile } = await supabase
      .from('profiles')
      .select('suspended')
      .eq('user_id', userId)
      .single();

    if (profile?.suspended) {
      return {
        allowed: false,
        reason: 'Account suspended due to policy violation',
      };
    }

    // Check abuse flags in last 24 hours
    const previousAbuse = await checkPreviousAbuse(userId);
    if (previousAbuse.flagged && previousAbuse.severity === 'critical') {
      // Auto-suspend for critical abuse
      await supabase
        .from('profiles')
        .update({ suspended: true })
        .eq('user_id', userId);

      return {
        allowed: false,
        reason: 'Account suspended due to abuse detection',
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Error checking user status:', error);
    // Allow on error to prevent blocking legitimate users
    return { allowed: true };
  }
}

// Admin function to get abuse summary for a user
export async function getUserAbuseHistory(
  userId: string
): Promise<{
  totalIncidents: number;
  last24Hours: number;
  bySeverity: Record<string, number>;
  recentIncidents: Array<{
    action: string;
    severity: string;
    created_at: string;
    details: Record<string, unknown>;
  }>;
}> {
  try {
    const supabase = createAdminClient();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Get all abuse records for user
    const { data: allRecords } = await supabase
      .from('abuse_log')
      .select('action, severity, created_at, details')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!allRecords || allRecords.length === 0) {
      return {
        totalIncidents: 0,
        last24Hours: 0,
        bySeverity: {},
        recentIncidents: [],
      };
    }

    const last24Hours = allRecords.filter(
      (r) => new Date(r.created_at) > new Date(oneDayAgo)
    ).length;

    const bySeverity: Record<string, number> = {};
    for (const record of allRecords) {
      bySeverity[record.severity] = (bySeverity[record.severity] || 0) + 1;
    }

    return {
      totalIncidents: allRecords.length,
      last24Hours,
      bySeverity,
      recentIncidents: allRecords.slice(0, 10).map((r) => ({
        action: r.action,
        severity: r.severity,
        created_at: r.created_at,
        details: r.details as Record<string, unknown>,
      })),
    };
  } catch (error) {
    console.error('Error getting abuse history:', error);
    return {
      totalIncidents: 0,
      last24Hours: 0,
      bySeverity: {},
      recentIncidents: [],
    };
  }
}

// Admin function to suspend/unsuspend a user
export async function setUserSuspension(
  userId: string,
  suspended: boolean,
  adminId: string,
  reason: string
): Promise<boolean> {
  try {
    const supabase = createAdminClient();

    await supabase
      .from('profiles')
      .update({ suspended: suspended })
      .eq('user_id', userId);

    // Log the admin action
    await supabase.from('activity_log').insert({
      user_id: adminId,
      action: suspended ? 'user_suspended' : 'user_unsuspended',
      details: {
        target_user_id: userId,
        reason,
      },
    });

    return true;
  } catch (error) {
    console.error('Error setting user suspension:', error);
    return false;
  }
}

// Cleanup old tracking data (call periodically)
export function cleanupTrackingData(): void {
  const now = Date.now();
  const fiveMinutesAgo = now - 5 * 60 * 1000;

  for (const [key, value] of recentRequests.entries()) {
    // Clean up old timestamps
    value.timestamps = value.timestamps.filter((t) => t > fiveMinutesAgo);

    // Remove entry if no recent activity
    if (value.timestamps.length === 0 && value.inputs.length === 0) {
      recentRequests.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupTrackingData, 5 * 60 * 1000);
}
