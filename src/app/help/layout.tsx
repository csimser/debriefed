import type { Metadata } from 'next'
import { SUPPORT_EMAIL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Help & FAQ — Operations Manual | Debriefed',
  description: 'Get answers to frequently asked questions about Debriefed. Learn how to build resumes, use AI tools, manage your subscription, and translate military experience to civilian language.',
  openGraph: {
    title: 'Help & FAQ — Operations Manual | Debriefed',
    description: 'Get answers to frequently asked questions about Debriefed. Learn how to build resumes, use AI tools, and translate military experience.',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
}

// FAQ data mirrored from page.tsx for structured data (schema.org FAQPage)
const FAQ_ITEMS = [
  { q: 'How do I upgrade my account?', a: 'Navigate to the Pricing page from your dashboard or visit /pricing. Choose between Core ($25 for a 30-day sprint) or Full ($50 for a 90-day campaign). Click the upgrade button and complete checkout through our secure Stripe payment system.' },
  { q: "What's the difference between Core and Full?", a: 'Core ($25 / 30-day sprint) gives you 10 resumes, 10 AI cover letters, 10 job match analyses, 10 eval uploads, AI summaries, and all 6 templates. Full ($50 / 90-day campaign) provides unlimited resumes, 200 cover letters, 200 job matches, LinkedIn profile analysis, and 30 eval uploads.' },
  { q: 'How do I cancel or get a refund?', a: `Debriefed uses one-time purchases, not recurring subscriptions - so there's nothing to cancel. If you're unsatisfied within 7 days of purchase, contact ${SUPPORT_EMAIL} for refund consideration.` },
  { q: 'What happens when my access ends?', a: 'When your access ends, your account reverts to the Free tier. All your resumes and data are preserved - you just can\'t create new ones beyond Free limits until you purchase again.' },
  { q: 'How do I create my first resume?', a: 'From your Dashboard, click "Create Resume" or navigate to the Resumes section. Choose between Private or Federal resume format. Fill in your information using the guided form - your military background will be pre-populated.' },
  { q: "What's the difference between Private and Federal resumes?", a: 'Private resumes are standard 1-2 page resumes for private sector jobs. Federal resumes are USAJOBS-compliant documents that require detailed information including hours worked, supervisor contact info, and salary history.' },
  { q: 'How do I use the bullet translator?', a: 'In the resume editor, click on any bullet point and select "Translate." Paste your military-speak bullet and our AI will convert it to civilian language.' },
  { q: 'Can I download my resume as PDF or Word?', a: 'Yes! Click the Download button and choose your format. PDF is recommended for most applications. DOCX is useful if you need to make manual edits.' },
  { q: 'What is Job Match Analysis?', a: "Job Match Analysis lets you paste a job posting, and our AI compares it against your resume. You'll see a match percentage, skill gaps, and specific recommendations for tailoring your resume." },
  { q: 'How does the LinkedIn Optimizer work?', a: 'Free tier: Generate an optimized headline and professional summary. Core/Full tiers: Upload your existing LinkedIn profile for comprehensive analysis including skills recommendations and keyword optimization.' },
  { q: 'What is Smart Apply & Skills by Rank?', a: 'This feature recommends skills and competencies based on your military rank and experience level. We map your rank to equivalent civilian competencies.' },
  { q: 'How do I upload my military evaluations?', a: 'Upload your FITREP, NCOER, OER, or EPR as a PDF or image. Our OCR extracts the text, and our AI identifies key achievements and bullet points for your resume.' },
  { q: "Why isn't my data saving?", a: `Check your internet connection. Debriefed auto-saves your work but requires connectivity. If issues persist, try refreshing the page. Contact ${SUPPORT_EMAIL} if problems continue.` },
  { q: 'How do I reset my password?', a: "Click 'Forgot Password' on the login page and enter your email. You'll receive a password reset link within a few minutes." },
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
