// AI Endpoint Wrapper for Debriefed
// Provides security, usage tracking, and rate limiting for all AI endpoints

import { NextRequest, NextResponse, after } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { canUseFeature, incrementUsage, isAdmin, getUserEmail } from '@/lib/usage-service';
import {
  validateAIRequest,
  getSecureSystemPrompt,
  validateAIOutput,
  getClientIP,
  recordFailedRequest,
} from '@/lib/ai-security';
import { detectAbuse, checkUserStatus } from '@/lib/abuse-detection';
import { FeatureName } from '@/lib/pricing-config';

export interface AIEndpointConfig {
  feature: FeatureName;
  inputType?: string;
  requireAuth?: boolean;
}

export interface AIEndpointContext {
  userId: string;
  userEmail: string | null;
  isAdmin: boolean;
  ip: string;
}

export type AIHandler<T> = (
  request: NextRequest,
  sanitizedInput: T,
  context: AIEndpointContext
) => Promise<NextResponse>;

// Wrapper function for AI endpoints
export function withAISecurity<T>(
  config: AIEndpointConfig,
  handler: AIHandler<T>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const { feature, inputType = 'default', requireAuth = true } = config;
    const ip = getClientIP(request.headers);

    try {
      // Get supabase client and check auth
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (requireAuth && !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const userId = user?.id || 'anonymous';
      const userEmail = user ? await getUserEmail(userId) : null;
      const adminStatus = isAdmin(userEmail);

      // Check user status (suspension, etc.)
      if (user && !adminStatus) {
        const statusCheck = await checkUserStatus(userId);
        if (!statusCheck.allowed) {
          return NextResponse.json(
            { error: statusCheck.reason },
            { status: 403 }
          );
        }
      }

      // Parse request body
      let body: T;
      try {
        body = await request.json();
      } catch {
        return NextResponse.json(
          { error: 'Invalid request body' },
          { status: 400 }
        );
      }

      // Validate and sanitize input
      const validation = await validateAIRequest(
        userId,
        ip,
        inputType,
        body as unknown as string | Record<string, unknown>
      );

      if (!validation.valid) {
        recordFailedRequest(ip);
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      const sanitizedInput = validation.sanitizedInput as T;

      // Check usage limits (skip for admins)
      if (!adminStatus) {
        const usageCheck = await canUseFeature(userId, feature);
        if (!usageCheck.allowed) {
          return NextResponse.json(
            {
              error: 'Usage limit reached',
              details: {
                reason: usageCheck.reason,
                remaining: usageCheck.remaining,
                limit: usageCheck.limit,
                used: usageCheck.used,
              },
            },
            { status: 403 }
          );
        }
      }

      // Detect abuse patterns
      if (!adminStatus) {
        const inputStr =
          typeof sanitizedInput === 'string'
            ? sanitizedInput
            : JSON.stringify(sanitizedInput);
        const abuseCheck = await detectAbuse(userId, ip, feature, inputStr);
        if (abuseCheck.flagged && abuseCheck.severity === 'critical') {
          return NextResponse.json(
            { error: 'Request blocked due to policy violation' },
            { status: 403 }
          );
        }
      }

      // Create context object
      const context: AIEndpointContext = {
        userId,
        userEmail,
        isAdmin: adminStatus,
        ip,
      };

      // Call the actual handler
      const response = await handler(request, sanitizedInput, context);

      // Defer usage increment to after response is sent (skip for admins)
      if (response.status === 200 && !adminStatus) {
        after(async () => {
          try {
            await incrementUsage(userId, feature);
          } catch (err) {
            console.error(`Post-response usage increment failed (${feature}):`, err);
          }
        });
      }

      return response;
    } catch (error) {
      console.error(`AI endpoint error (${feature}):`, error);
      recordFailedRequest(ip);
      return NextResponse.json(
        { error: 'An error occurred processing your request' },
        { status: 500 }
      );
    }
  };
}

// Helper to wrap Claude system prompts with security
export function secureSystemPrompt(basePrompt: string): string {
  return getSecureSystemPrompt(basePrompt);
}

// Helper to validate Claude output
export function validateOutput(
  output: string,
  expectedType: string
): { valid: boolean; sanitized: string; issues: string[] } {
  return validateAIOutput(output, expectedType);
}

// Log API usage to database
export async function logAPIUsage(
  userId: string,
  feature: string,
  tokensUsed: number,
  model: string = 'claude-sonnet-4-20250514'
): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.from('api_usage').insert({
      user_id: userId,
      endpoint: feature,
      tokens_used: tokensUsed,
      model,
    });
  } catch (error) {
    console.error('Failed to log API usage:', error);
  }
}
