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
        <p className="text-text-muted mb-8">Last updated: June 12, 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">1. Service Description</h2>
            <p className="text-text-muted leading-relaxed">
              Debriefed is a free, open-source tool that helps military service members and veterans translate their military experience into civilian-friendly resume content. Features include resume building, military-to-civilian bullet translation, cover letter generation, and career transition tools. Debriefed runs entirely in your browser: there are no accounts, no servers, and no subscriptions. It is distributed as a downloadable single file (Debriefed.html) via GitHub Releases.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">2. Eligibility</h2>
            <p className="text-text-muted leading-relaxed">
              You must be at least 18 years of age to use this service. By using Debriefed, you represent and warrant that you are at least 18 years old and have the legal capacity to agree to these Terms.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">3. Open Source License</h2>
            <p className="text-text-muted leading-relaxed mb-4">
              The Debriefed software is open source and licensed under the MIT License. The source code is available at{' '}
              <a href="https://github.com/csimser/debriefed" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-bright">github.com/csimser/debriefed</a>.
            </p>
            <div className="bg-bg-secondary border border-border rounded-lg p-4 mt-4">
              <p className="text-gold font-medium mb-2">Provided "As Is"</p>
              <p className="text-text-muted text-sm">
                Consistent with the MIT License, the software is provided "as is," without warranty of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose, and noninfringement. Your use of the software under the MIT License is governed by that license.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">4. Your Data &amp; API Costs</h2>
            <p className="text-text-muted leading-relaxed mb-4">
              All of your data (profile, resumes, applications) is stored in your browser's localStorage on your device. You are responsible for backing it up using Export in Settings; clearing your browser data will erase it, and we cannot recover it.
            </p>
            <p className="text-text-muted leading-relaxed">
              AI features use your own Anthropic API key and call Anthropic's API directly from your browser. You are solely responsible for any costs you incur with Anthropic and for complying with Anthropic's terms of service. Debriefed does not bill you for anything.
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
              <li>Process documents containing others' personal information without consent</li>
              <li>Misrepresent modified versions of the software as official Debriefed builds</li>
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
              You retain ownership of the information and content you provide, and of the resumes, cover letters, and other content generated from your input — use them however you like. The Debriefed software itself is licensed to everyone under the MIT License; the Debriefed name and branding remain ours.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">8. Limitation of Liability</h2>
            <p className="text-text-muted leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, DEBRIEFED SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF EMPLOYMENT OPPORTUNITIES, LOSS OF DATA, OR LOSS OF PROFITS, ARISING FROM YOUR USE OF THE SERVICE.
            </p>
            <p className="text-text-muted leading-relaxed mt-4">
              We do not guarantee employment outcomes. The success of your job search depends on many factors beyond the content of your resume. Because your data lives only in your browser, we are also not responsible for data loss resulting from cleared browser storage, device failure, or lack of backups.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">9. Availability</h2>
            <p className="text-text-muted leading-relaxed">
              There are no accounts to terminate. We reserve the right to stop publishing new Debriefed releases at any time. Because the app runs locally and the software is MIT licensed, any copy you have already downloaded — and the open-source code — will continue to work and remain available regardless. Your data stays on your device either way; you can delete it at any time through the Settings page or by clearing browser storage.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">10. Changes to Terms</h2>
            <p className="text-text-muted leading-relaxed">
              We may update these Terms from time to time. Material changes will be posted on this page and noted in the project's GitHub repository. Your continued use of the service after changes constitutes acceptance of the updated Terms.
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
            <Link href="/terms/" className="text-sm text-gold">
              Terms of Service
            </Link>
            <Link href="/privacy/" className="text-sm text-text-muted hover:text-gold">
              Privacy Policy
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
