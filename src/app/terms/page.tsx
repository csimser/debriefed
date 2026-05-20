import Link from 'next/link'
import { SUPPORT_EMAIL } from '@/lib/site-config'

export const metadata = {
  title: 'Terms of Service | Debriefed',
  description: 'Terms of Service for Debriefed',
}

export default function TermsPage() {
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
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wider mb-2">Terms of Service</h1>
        <p className="text-text-muted mb-8">Last updated: January 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">1. Service Description</h2>
            <p className="text-text-muted leading-relaxed">
              Debriefed provides an AI-powered platform that helps military service members and veterans translate their military experience into civilian-friendly resume content. Our services include resume generation, military-to-civilian bullet translation, cover letter generation, and career transition tools.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">2. Eligibility</h2>
            <p className="text-text-muted leading-relaxed">
              You must be at least 18 years of age to use this service. By creating an account, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">3. Account Registration</h2>
            <p className="text-text-muted leading-relaxed mb-4">
              When you create an account, you agree to:
            </p>
            <ul className="list-disc list-inside text-text-muted space-y-2 ml-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your password</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
            <div className="bg-status-yellow/10 border border-status-yellow/20 rounded-lg p-4 mt-4">
              <p className="text-status-yellow font-medium mb-2">Important: Locked Fields</p>
              <p className="text-text-muted text-sm">
                Your first name, last name, and email address are locked after registration and cannot be changed. These fields appear on your generated resumes. Please ensure this information is entered correctly during signup.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">4. Subscription Plans</h2>
            <p className="text-text-muted leading-relaxed mb-4">
              We offer multiple subscription tiers with different features and usage limits:
            </p>
            <ul className="list-disc list-inside text-text-muted space-y-2 ml-4">
              <li><strong className="text-text">Free:</strong> Limited access to basic features</li>
              <li><strong className="text-text">Core:</strong> Enhanced features with moderate usage limits</li>
              <li><strong className="text-text">Full:</strong> Full access to all features with higher usage limits</li>
            </ul>
            <p className="text-text-muted leading-relaxed mt-4">
              Usage limits reset daily or monthly depending on the feature. Exceeding limits may require upgrading your plan or waiting for the reset period.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">5. Acceptable Use</h2>
            <p className="text-text-muted leading-relaxed mb-4">
              You agree NOT to:
            </p>
            <ul className="list-disc list-inside text-text-muted space-y-2 ml-4">
              <li>Use the service for any unlawful purpose</li>
              <li>Submit false or misleading information about your military service</li>
              <li>Attempt to circumvent usage limits or security measures</li>
              <li>Share your account credentials with others</li>
              <li>Use automated tools to access the service without authorization</li>
              <li>Resell or redistribute generated content for commercial purposes</li>
              <li>Upload documents containing others' personal information without consent</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">6. AI-Generated Content</h2>
            <div className="bg-bg-secondary border border-border rounded-lg p-4 mb-4">
              <p className="text-gold font-medium mb-2">Disclaimer</p>
              <p className="text-text-muted text-sm">
                Content generated by our AI is provided as a starting point and should be reviewed and edited before use. We do not guarantee that generated content is accurate, complete, or suitable for any particular purpose.
              </p>
            </div>
            <p className="text-text-muted leading-relaxed">
              You are solely responsible for reviewing, editing, and verifying all AI-generated content before submitting it to employers or using it professionally. The accuracy of translations and suggestions depends on the quality and accuracy of the information you provide.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">7. Intellectual Property</h2>
            <p className="text-text-muted leading-relaxed">
              You retain ownership of the information and content you provide. Content generated by our service based on your input is licensed to you for personal and professional use. The Debriefed platform, including its design, features, and underlying technology, remains our intellectual property.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">8. Limitation of Liability</h2>
            <p className="text-text-muted leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, DEBRIEFED SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF EMPLOYMENT OPPORTUNITIES, LOSS OF DATA, OR LOSS OF PROFITS, ARISING FROM YOUR USE OF THE SERVICE.
            </p>
            <p className="text-text-muted leading-relaxed mt-4">
              We do not guarantee employment outcomes. The success of your job search depends on many factors beyond the content of your resume.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">9. Account Termination</h2>
            <p className="text-text-muted leading-relaxed">
              We reserve the right to suspend or terminate your account at any time for violation of these Terms or for any other reason at our discretion. You may delete your account at any time through the Settings page. Upon termination, your data will be permanently deleted in accordance with our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">10. Changes to Terms</h2>
            <p className="text-text-muted leading-relaxed">
              We may update these Terms from time to time. We will notify you of material changes by email or through the service. Your continued use of the service after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">11. Dispute Resolution</h2>
            <p className="text-text-muted leading-relaxed">
              Any disputes arising from these Terms or your use of the service shall first be attempted to be resolved through good-faith negotiation. If negotiation fails, disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, conducted in California.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">12. Contact</h2>
            <p className="text-text-muted leading-relaxed">
              For questions about these Terms, contact us at:{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gold hover:text-gold-bright">
                {SUPPORT_EMAIL}
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">13. Governing Law</h2>
            <p className="text-text-muted leading-relaxed">
              These Terms are governed by the laws of the State of California, United States, without regard to its conflict of law provisions.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} Debriefed. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-sm text-gold">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-text-muted hover:text-gold">
              Privacy Policy
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
