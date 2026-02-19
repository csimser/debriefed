import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkLimit } from '@/lib/usage-service';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await checkLimit(user.id, 'eval_uploads');
  return NextResponse.json({
    remaining: result.remaining,
    limit: result.limit,
    used: result.used,
    allowed: result.allowed,
  });
}
