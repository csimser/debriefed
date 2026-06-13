import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help & FAQ — Operations Manual | Debriefed',
  description: 'Get answers to frequently asked questions about Debriefed. Learn how to build resumes, use the optional AI features, and translate military experience to civilian language.',
  openGraph: {
    title: 'Help & FAQ — Operations Manual | Debriefed',
    description: 'Get answers to frequently asked questions about Debriefed. Learn how to build resumes, use AI tools, and translate military experience.',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
}

// FAQ data mirrored from page.tsx for structured data (schema.org FAQPage)
const FAQ_ITEMS = [
  { q: 'Do I need an account?', a: 'No. Debriefed has no accounts, no sign-up, and no passwords. Everything — your profile, resumes, and application tracker — lives on your device, in your browser.' },
  { q: 'How much does Debriefed cost?', a: 'Debriefed is free. The built-in 33,000+ entry dictionary engine handles translation, job matching, cover letters, and eval parsing with no account and no API key. Optionally add your own Anthropic API key for AI-enhanced output — you pay Anthropic directly, about 2–6 cents per resume.' },
  { q: 'Where is my data stored?', a: "All of your data is stored in your browser's localStorage on your own device. Nothing is uploaded to any server. Back it up or move it anytime with Export and Import in Settings." },
  { q: 'What is the Anthropic API key? Do I need one?', a: 'No — everything works without one. The dictionary engine handles translation, job matching, cover letters, and eval parsing offline. Optionally add an Anthropic API key and Claude enhances the output — about 2–6 cents per resume, paid to Anthropic directly. A key also unlocks reading PDFs.' },
  { q: 'How do I create my first resume?', a: 'From your Dashboard, click "Create Resume" or navigate to the Resumes section. Choose between Private or Federal resume format. Fill in your information using the guided form — your military background from your profile is pre-populated.' },
  { q: "What's the difference between Private and Federal resumes?", a: 'Private resumes are standard 1-2 page resumes for private sector jobs. Federal resumes are USAJOBS-compliant documents that require detailed information including hours worked, supervisor contact info, and salary history.' },
  { q: 'How do I use the bullet translator?', a: 'In the resume editor, click on any bullet point and select "Translate." Paste your military-speak bullet and Debriefed converts it to civilian language using the dictionary engine (sharper with an optional API key).' },
  { q: 'Can I download my resume as PDF or Word?', a: 'Yes! Click the Download button and choose your format. PDF is recommended for most applications. DOCX is useful if you need to make manual edits.' },
  { q: 'What is Job Match Analysis?', a: "Job Match Analysis lets you paste a job posting, and Debriefed compares it against your resume. You'll see a match percentage, skill gaps, and specific recommendations for tailoring your resume." },
  { q: 'How does the LinkedIn Optimizer work?', a: 'Generate an optimized headline and professional summary from your military background — works with no API key using the dictionary templates. Add an Anthropic key for the full AI analysis and Claude-polished writing.' },
  { q: 'How do I upload my military evaluations?', a: 'Upload your FITREP, NCOER, OER, or EPR as a PDF or image. Reading PDFs/images uses your optional Anthropic API key to extract the text and identify key achievements for your resume.' },
  { q: "Why isn't my data saving?", a: "Debriefed saves everything to your browser's localStorage, so no internet is required. If data isn't saving, make sure you're not in a private/incognito window and that your browser isn't blocking site data." },
  { q: 'Does Debriefed work offline?', a: 'Yes. Debriefed is a single HTML file — the app, fonts, and the full dictionary live inside it, so translation, job matching, cover letter templates, and PDF export work with no internet. Only the optional AI enhancement needs a connection.' },
  { q: 'What browsers are supported?', a: 'Debriefed works best on Chrome (recommended), Firefox, Safari, and Edge. We support the latest two versions of each browser.' },
]

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  )
}
