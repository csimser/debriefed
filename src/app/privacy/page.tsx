import Link from 'next/link'
import { SUPPORT_EMAIL } from '@/lib/site-config'

export const metadata = {
  title: 'Privacy Policy | Debriefed',
  description: 'Privacy Policy for Debriefed',
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
        <p className="text-text-muted mb-8">Last updated: June 12, 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">1. Introduction</h2>
            <p className="text-text-muted leading-relaxed">
              Debriefed is a free, open-source military-to-civilian resume translation tool. It is built local-first: there is no Debriefed server, no account system, and no database. This Privacy Policy explains where your information lives and the limited circumstances in which any of it leaves your device.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">2. Data We Collect</h2>
            <div className="bg-bg-secondary border border-border rounded-lg p-4 mb-4">
              <p className="text-status-green font-medium mb-2">We collect nothing</p>
              <p className="text-text-muted text-sm">
                We do not collect, receive, or store any of your data on our servers — because there are no servers. Everything you enter into Debriefed stays in your browser, on your device.
              </p>
            </div>
            <p className="text-text-muted leading-relaxed mb-4">Data that exists, and where it lives:</p>
            <ul className="list-disc list-inside text-text-muted space-y-2 ml-4">
              <li><strong className="text-text">Profile Data:</strong> Your name, military background, skills, certifications, and education are stored in your browser's localStorage on your device only</li>
              <li><strong className="text-text">Resumes &amp; Applications:</strong> Resumes, cover letters, and application tracker entries are stored in localStorage on your device only</li>
              <li><strong className="text-text">Anthropic API Key:</strong> If you add one, it is stored in this browser only and sent only to Anthropic when you use an AI feature</li>
              <li><strong className="text-text">Settings:</strong> Preferences are stored in localStorage on your device only</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">3. Document Handling</h2>
            <div className="bg-bg-secondary border border-border rounded-lg p-4 mb-4">
              <p className="text-status-green font-medium mb-2">Documents Are Processed in Your Browser</p>
              <p className="text-text-muted text-sm">
                Documents you upload (military evaluations, awards, DD-214s) are processed entirely in your browser. They are never uploaded to a Debriefed server — none exists. If you use AI-powered parsing, the document content is sent directly from your browser to Anthropic and handled under Anthropic's data policies.
              </p>
            </div>
            <p className="text-text-muted leading-relaxed">
              Only the extracted text you choose to save to your profile is kept, and it is kept in your browser's localStorage.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">4. PII Screening</h2>
            <div className="bg-status-red-dim border border-status-red/20 rounded-lg p-4 mb-4">
              <p className="text-status-red font-medium mb-2">Automatic PII Detection</p>
              <p className="text-text-muted text-sm">
                Before any document content is sent to Anthropic for AI processing, Debriefed scans it in your browser for sensitive personally identifiable information (PII). Documents containing Social Security Numbers (SSN) or Department of Defense ID Numbers (DODID) are rejected and must be redacted first.
              </p>
            </div>
            <p className="text-text-muted leading-relaxed">
              This screening runs locally on your device. Other PII such as phone numbers and email addresses found in documents may be automatically redacted during processing.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">5. AI Processing</h2>
            <p className="text-text-muted leading-relaxed mb-4">
              AI features (bullet translation, cover letters, job match analysis, eval parsing) use Anthropic's Claude API with your own API key. When you use them:
            </p>
            <ul className="list-disc list-inside text-text-muted space-y-2 ml-4">
              <li>The relevant content is sent directly from your browser to Anthropic — it does not pass through any Debriefed infrastructure</li>
              <li>Anthropic handles that data under its own policies; see the{' '}
                <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-bright">Anthropic Privacy Policy</a>
              </li>
              <li>Your API key is sent only to Anthropic, never anywhere else</li>
              <li>The bundled military-to-civilian dictionary works entirely offline and sends nothing anywhere</li>
              <li>Generated content is saved in your browser's localStorage until you delete it</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">6. Third Parties</h2>
            <p className="text-text-muted leading-relaxed mb-4">The only third parties involved are:</p>
            <ul className="list-disc list-inside text-text-muted space-y-2 ml-4">
              <li><strong className="text-text">Anthropic:</strong> Receives content you submit to AI features, only when you use them with your own API key</li>
              <li><strong className="text-text">GitHub Pages:</strong> Serves the static site at getdebriefed.co. Like any web host, GitHub keeps standard server logs (such as IP addresses) under its own policies; we never see them</li>
            </ul>
            <p className="text-text-muted leading-relaxed mt-4">
              If you use the downloadable single-file version (Debriefed.html), even static hosting is out of the picture once you've downloaded it.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">7. Analytics &amp; Tracking</h2>
            <p className="text-text-muted leading-relaxed">
              Debriefed contains no analytics, no tracking scripts, no advertising, and no tracking cookies. We do not know who you are, when you use the app, or what you do with it.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">8. Data Retention &amp; Deletion</h2>
            <p className="text-text-muted leading-relaxed">
              Your data exists only in your browser and stays there until you remove it. To delete everything, use Settings → Delete everything, or clear this site's storage in your browser settings. Note that clearing your browser data also erases your data — use Settings → Export to keep a backup file you control.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">9. Your Rights</h2>
            <p className="text-text-muted leading-relaxed mb-4">Because your data never leaves your device, you don't have to ask us to exercise your rights — you already hold the data:</p>
            <ul className="list-disc list-inside text-text-muted space-y-2 ml-4">
              <li>Access and correct your data anytime, directly in the app</li>
              <li>Export your data as a JSON file via Settings → Export</li>
              <li>Delete all of your data via Settings → Delete everything, or by clearing browser storage</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">10. Security</h2>
            <p className="text-text-muted leading-relaxed">
              Your data is only as secure as the device and browser it lives on. Connections to Anthropic use encrypted HTTPS. To ensure you are running unmodified code, use the official builds from getdebriefed.co or the{' '}
              <a href="https://github.com/csimser/debriefed/releases" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-bright">GitHub Releases</a> page — and since the project is open source, you can verify the code yourself.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">11. Contact</h2>
            <p className="text-text-muted leading-relaxed">
              For privacy-related questions, contact us at:{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gold hover:text-gold-bright">
                {SUPPORT_EMAIL}
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">12. Governing Law</h2>
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
            <Link href="/terms/" className="text-sm text-text-muted hover:text-gold">
              Terms of Service
            </Link>
            <Link href="/privacy/" className="text-sm text-gold">
              Privacy Policy
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
