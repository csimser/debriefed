import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | Debriefed',
  description: 'Privacy Policy for getdebriefed.co',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="bg-bg-secondary border-b border-border px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-gold flex items-center justify-center">
              <span className="font-heading font-bold text-gold text-sm">D</span>
            </div>
            <span className="font-heading text-lg font-bold tracking-wider uppercase">Debriefed</span>
          </Link>
          <Link href="/" className="text-sm text-gold hover:text-gold-bright">
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wider mb-2">Privacy Policy</h1>
        <p className="text-text-muted mb-8">Last updated: January 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">1. Introduction</h2>
            <p className="text-text-muted leading-relaxed">
              Debriefed ("we," "our," or "us") operates getdebriefed.co. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our military-to-civilian resume translation service.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">2. Data Collection</h2>
            <p className="text-text-muted leading-relaxed mb-4">We collect the following types of information:</p>
            <ul className="list-disc list-inside text-text-muted space-y-2 ml-4">
              <li><strong className="text-text">Account Information:</strong> Email address, name, military branch, and paygrade at registration</li>
              <li><strong className="text-text">Profile Data:</strong> Career information, skills, certifications, and education you provide</li>
              <li><strong className="text-text">Usage Data:</strong> How you interact with our service, features used, and generation counts</li>
              <li><strong className="text-text">Device Information:</strong> IP address, browser type, and device identifiers for security purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">3. Document Handling</h2>
            <div className="bg-bg-secondary border border-border rounded-lg p-4 mb-4">
              <p className="text-status-green font-medium mb-2">Important: Documents Are Not Stored</p>
              <p className="text-text-muted text-sm">
                Uploaded documents (military evaluations, awards, DD-214s) are processed for text extraction only. Document files are NOT stored on our servers after processing. Only the extracted text data that you choose to save to your profile is retained.
              </p>
            </div>
            <p className="text-text-muted leading-relaxed">
              We use secure, encrypted connections for all document uploads. Processing occurs in memory and document files are immediately discarded after extraction is complete.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">4. PII Screening</h2>
            <div className="bg-status-red-dim border border-status-red/20 rounded-lg p-4 mb-4">
              <p className="text-status-red font-medium mb-2">Automatic PII Detection</p>
              <p className="text-text-muted text-sm">
                Our system automatically scans uploaded documents for sensitive personally identifiable information (PII). Documents containing Social Security Numbers (SSN) or Department of Defense ID Numbers (DODID) will be rejected and must be redacted before uploading.
              </p>
            </div>
            <p className="text-text-muted leading-relaxed">
              Other PII such as phone numbers and email addresses found in documents may be automatically redacted during processing to protect your privacy.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">5. AI Processing</h2>
            <p className="text-text-muted leading-relaxed mb-4">
              We use AI services (Anthropic Claude) to translate military experience into civilian language. When processing your content:
            </p>
            <ul className="list-disc list-inside text-text-muted space-y-2 ml-4">
              <li>Your content is sent to AI providers for processing</li>
              <li>AI providers may temporarily retain data for abuse monitoring per their policies</li>
              <li>We do not use your content to train AI models</li>
              <li>Generated content is stored in your account until you delete it</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">6. Service Providers</h2>
            <p className="text-text-muted leading-relaxed mb-4">We use the following third-party services:</p>
            <ul className="list-disc list-inside text-text-muted space-y-2 ml-4">
              <li><strong className="text-text">Supabase:</strong> Database and authentication</li>
              <li><strong className="text-text">Anthropic:</strong> AI text processing</li>
              <li><strong className="text-text">Vercel:</strong> Hosting and infrastructure</li>
              <li><strong className="text-text">Stripe:</strong> Payment processing (if applicable)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">7. Data Retention</h2>
            <p className="text-text-muted leading-relaxed">
              We retain your account data for as long as your account is active. You may delete your account at any time through the Settings page, which will permanently remove all your data from our systems. Uploaded document files are never stored; only extracted profile data is retained.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">8. Your Rights</h2>
            <p className="text-text-muted leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-text-muted space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and all associated data</li>
              <li>Export your data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">9. Security</h2>
            <p className="text-text-muted leading-relaxed">
              We implement industry-standard security measures including encryption in transit and at rest, secure authentication, and regular security audits. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">10. Contact</h2>
            <p className="text-text-muted leading-relaxed">
              For privacy-related questions or to exercise your rights, contact us at:{' '}
              <a href="mailto:support@getdebriefed.co" className="text-gold hover:text-gold-bright">
                support@getdebriefed.co
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">11. Governing Law</h2>
            <p className="text-text-muted leading-relaxed">
              This Privacy Policy is governed by the laws of the State of California, United States.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} Debriefed. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-sm text-text-muted hover:text-gold">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-gold">
              Privacy Policy
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
