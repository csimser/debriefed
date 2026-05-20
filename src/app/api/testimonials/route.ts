import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { rating, comment, testimonialConsent, featureContext } = await request.json()

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 })
    }

    if (!featureContext) {
      return NextResponse.json({ error: 'Feature context required' }, { status: 400 })
    }

    // Insert testimonial
    const { error: insertError } = await supabase
      .from('testimonials')
      .insert({
        user_id: user.id,
        rating,
        comment: comment?.trim() || null,
        testimonial_consent: testimonialConsent || false,
        feature_context: featureContext,
      })

    if (insertError) {
      console.error('Testimonial insert error:', insertError)
      return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 })
    }

    // Mark feedback as submitted on the profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ feedback_submitted: true })
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Profile update error:', updateError)
      // Non-fatal — testimonial was saved
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Testimonial error:', error)
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 })
  }
}
