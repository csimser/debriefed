import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('testimonials')
    .select('id, rating, comment, feature_context, created_at')
    .eq('status', 'approved')
    .eq('featured', true)
    .eq('testimonial_consent', true)
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) {
    return NextResponse.json({ testimonials: [] })
  }

  return NextResponse.json({ testimonials: data || [] })
}
