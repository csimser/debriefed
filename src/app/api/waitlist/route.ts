import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const {
      first_name,
      last_name,
      email,
      branch,
      role_type,
      linkedin_url,
      eas_date,
      phone,
      target_industry,
      discord_feedback,
    } = await req.json()

    // Validate required fields
    if (!first_name || !last_name || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      )
    }

    // Insert to waitlist table
    const { error: insertError } = await supabaseAdmin
      .from('waitlist')
      .insert({
        first_name,
        last_name,
        email: email.toLowerCase().trim(),
        branch: branch || null,
        role_type: role_type || null,
        linkedin_url: linkedin_url || null,
        eas_date: eas_date || null,
        phone: phone || null,
        target_industry: target_industry || null,
        discord_feedback: discord_feedback || false,
      })

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already on the waitlist.' },
          { status: 409 }
        )
      }
      console.error('Waitlist insert error:', insertError)
      return NextResponse.json(
        { error: 'Something went wrong. Please try again.' },
        { status: 500 }
      )
    }

    const fullName = `${first_name} ${last_name}`

    // Send admin notification email
    await resend.emails.send({
      from: 'noreply@getdebriefed.co',
      to: 'chris@getdebriefed.co',
      subject: 'New Debriefed Waitlist Signup',
      html: `
        <h2>New Waitlist Signup</h2>
        <p>Someone just joined the Debriefed waitlist:</p>
        <ul>
          <li><strong>Name:</strong> ${fullName}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone || 'Not provided'}</li>
          <li><strong>LinkedIn:</strong> ${linkedin_url ? `<a href="${linkedin_url}">${linkedin_url}</a>` : 'Not provided'}</li>
          <li><strong>Branch:</strong> ${branch || 'Not specified'}</li>
          <li><strong>Role Type:</strong> ${role_type || 'Not specified'}</li>
          <li><strong>EAS/Separation Date:</strong> ${eas_date || 'Not provided'}</li>
          <li><strong>Target Industry:</strong> ${target_industry || 'Not specified'}</li>
          <li><strong>Discord Feedback:</strong> ${discord_feedback ? 'Yes' : 'No'}</li>
        </ul>
      `,
    })

    // Send thank you email to user
    await resend.emails.send({
      from: 'Debriefed <noreply@getdebriefed.co>',
      to: email,
      subject: "You're on the Debriefed Waitlist",
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0e14; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0e14; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #111820; border: 1px solid #2d3748; border-radius: 8px;">

          <!-- Header with Logo -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center;">
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="vertical-align: middle; padding-right: 12px;">
                    <!-- Gold bordered square with document icon (table-based for email compatibility) -->
                    <table cellpadding="0" cellspacing="0" border="0" style="border: 2px solid #d4af37; border-radius: 4px;">
                      <tr>
                        <td width="40" height="40" align="center" valign="middle" style="width: 40px; height: 40px;">
                          <table cellpadding="0" cellspacing="0" border="0" align="center">
                            <tr><td bgcolor="#d4af37" width="18" height="3" style="width: 18px; height: 3px; background-color: #d4af37; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>
                            <tr><td height="4" style="height: 4px; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>
                            <tr><td bgcolor="#d4af37" width="18" height="3" style="width: 18px; height: 3px; background-color: #d4af37; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>
                            <tr><td height="4" style="height: 4px; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>
                            <tr><td bgcolor="#d4af37" width="18" height="3" style="width: 18px; height: 3px; background-color: #d4af37; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: 4px;">DEBRIEFED</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 20px 40px 40px 40px;">
              <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #d4af37;">Hey ${first_name},</h2>

              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #8b949e;">
                Thank you for signing up for the Debriefed waitlist. It means a lot that you're trusting us with something as important as your career transition.
              </p>

              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #8b949e;">
                Debriefed translates your military experience into civilian-ready resumes — turning MOS codes, EVAL bullets, and military jargon into language that hiring managers actually understand. You'll also be able to see how your experience matches against real job postings, so you know exactly where you stand.
              </p>

              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #8b949e;">
                <strong style="color: #ffffff;">What happens next:</strong>
              </p>

              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #8b949e;">
                Beta codes are limited, and not everyone will be selected for this round. If you're chosen, you'll receive an email with your beta code and instructions to get started.
              </p>

              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #8b949e;">
                If you're not selected this time, don't worry — we'll notify you as soon as full registration opens so you can be among the first to join.
              </p>

              <!-- Summary of submission -->
              <div style="margin: 24px 0; padding: 16px; background-color: #1a2332; border-left: 3px solid #d4af37; border-radius: 4px;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #d4af37; font-weight: bold;">Your Submission:</p>
                <p style="margin: 0; font-size: 14px; line-height: 1.8; color: #8b949e;">
                  ${branch ? `Branch: ${branch}<br/>` : ''}
                  ${role_type ? `Role: ${role_type}<br/>` : ''}
                  ${target_industry ? `Target Industry: ${target_industry}<br/>` : ''}
                  ${eas_date ? `EAS Date: ${eas_date}<br/>` : ''}
                  ${discord_feedback ? 'Discord Feedback: Yes' : ''}
                </p>
              </div>

              <p style="margin: 0 0 8px 0; font-size: 16px; line-height: 1.6; color: #8b949e;">
                Thanks again for being here. I'm grateful you're giving Debriefed a shot.
              </p>

              <p style="margin: 16px 0 0 0; font-size: 16px; line-height: 1.6; color: #ffffff;">
                Chris
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; border-top: 1px solid #2d3748; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #8b949e;">
                Built by a veteran, for veterans.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Waitlist error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
