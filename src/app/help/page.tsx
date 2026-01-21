'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'

// FAQ Data
const FAQ_SECTIONS = [
  {
    title: 'Account & Billing',
    questions: [
      {
        q: 'How do I upgrade my account?',
        a: 'Navigate to the Pricing page from your dashboard or visit /pricing. Choose between Core ($35 for 30 days) or Full ($75 for 90 days) plans. Click the upgrade button and complete checkout through our secure Stripe payment system. Your new limits are available immediately after purchase.',
      },
      {
        q: "What's the difference between Core and Full?",
        a: 'Core ($35/30 days) gives you more resumes, cover letters, and job match analyses - perfect for an active job search. Full ($75/90 days) provides even higher limits plus extended access time, ideal for longer transition periods or career changers exploring multiple paths. Both unlock all premium features like the full LinkedIn Optimizer and Elevator Pitch generator.',
      },
      {
        q: 'How do I cancel or get a refund?',
        a: "Debriefed uses one-time purchases, not recurring subscriptions - so there's nothing to cancel. If you're unsatisfied within 7 days of purchase and haven't used a significant portion of your limits, contact support@debriefed.io for refund consideration.",
      },
      {
        q: 'Can I use a beta code after signing up?',
        a: 'Yes! Go to your Dashboard and look for the "Redeem Code" section. Enter your beta code there to unlock premium features. Beta codes can only be used once and may have expiration dates.',
      },
    ],
  },
  {
    title: 'Resume Building',
    questions: [
      {
        q: 'How do I create my first resume?',
        a: 'From your Dashboard, click "Create Resume" or navigate to the Resumes section. Choose between Private (standard) or Federal resume format. Fill in your information using the guided form - your military background from your profile will be pre-populated. Use the bullet translator to convert military jargon, then download as PDF or DOCX.',
      },
      {
        q: "What's the difference between Private and Federal resumes?",
        a: 'Private resumes are standard 1-2 page resumes for private sector jobs. They emphasize achievements and skills concisely. Federal resumes are USAJOBS-compliant documents that are typically 2 pages and require detailed information including hours worked, supervisor contact info, salary history, and comprehensive duty descriptions.',
      },
      {
        q: 'How do I use the bullet translator?',
        a: 'In the resume editor, click on any bullet point and select "Translate." Paste your military-speak bullet (e.g., "Supervised 15 Sailors in DC Division") and our AI will convert it to civilian language (e.g., "Led team of 15 in emergency response and safety operations"). You can also access the Bullet Translator directly from Career Tools.',
      },
      {
        q: 'Can I download my resume as PDF or Word?',
        a: 'Yes! When viewing your resume, click the Download button and choose your format. PDF is recommended for most applications as it preserves formatting exactly. DOCX (Word) is useful if you need to make manual edits or if an employer specifically requests that format.',
      },
    ],
  },
  {
    title: 'Features',
    questions: [
      {
        q: 'What is Job Match Analysis?',
        a: 'Job Match Analysis lets you paste a job posting URL or description, and our AI compares it against your resume. You\'ll see a match percentage, identified skill gaps, suggested improvements, and specific recommendations for tailoring your resume to that position. It\'s like having a recruiter review your application before you submit.',
      },
      {
        q: 'How does the LinkedIn Optimizer work?',
        a: 'Free tier: Generate an optimized headline (120 chars) and professional summary (2600 chars) from your military background. Core/Full tiers: Upload your existing LinkedIn profile for comprehensive analysis including optimization suggestions, skills recommendations based on target roles, and keyword optimization for recruiter searches.',
      },
      {
        q: 'What is Smart Apply & Skills by Rank?',
        a: 'This feature recommends skills and competencies based on your military rank and experience level. An E-7 with 18 years has different demonstrated leadership skills than an E-4 with 4 years. We map your rank to equivalent civilian competencies to help you articulate your experience appropriately.',
      },
      {
        q: 'How do I upload my military evaluations?',
        a: 'Evaluations are uploaded when building your profile. Upload your FITREP, NCOER, OER, or EPR as a PDF or image. Our OCR (Optical Character Recognition) extracts the text, and our AI identifies key achievements and bullet points. You can then import these directly into your resume builder.',
      },
    ],
  },
  {
    title: 'Technical',
    questions: [
      {
        q: "Why isn't my data saving?",
        a: "Check your internet connection first. Debriefed auto-saves your work, but requires connectivity. If issues persist, try refreshing the page. Your data is stored securely in our database, not just your browser. If you're still having trouble, contact support@debriefed.io with your browser and device info.",
      },
      {
        q: 'How do I reset my password?',
        a: 'Click "Forgot Password" on the login page and enter your email. You\'ll receive a password reset link within a few minutes. Check your spam folder if you don\'t see it. The link expires after 1 hour for security.',
      },
      {
        q: 'What browsers are supported?',
        a: 'Debriefed works best on modern browsers: Chrome (recommended), Firefox, Safari, and Edge. We support the latest two versions of each browser. Internet Explorer is not supported. For best experience, keep your browser updated.',
      },
    ],
  },
]

// Feature Guide Data
const FEATURES = [
  {
    id: 'resume-builder',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Resume Builder',
    description: 'Create professional private sector resumes from your military experience.',
    details: 'Our AI-powered resume builder understands military terminology and helps translate your service into civilian accomplishments. Choose from multiple professional templates, and our smart suggestions help you highlight transferable skills employers are looking for.',
    link: '/resumes',
  },
  {
    id: 'federal-resume',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'Federal Resume Builder',
    description: 'USAJOBS-compliant federal resumes with proper formatting.',
    details: 'Federal resumes require specific formatting and detailed information that private sector resumes don\'t. Our federal resume builder ensures you include all required elements: hours worked per week, supervisor contact information, salary history, and comprehensive duty descriptions - all formatted to USAJOBS standards.',
    link: '/resumes',
  },
  {
    id: 'bullet-translator',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    title: 'Bullet Translator',
    description: 'Convert military jargon to civilian language instantly.',
    details: 'Stop confusing hiring managers with acronyms and military-speak. Paste your military bullet points and our AI translates them into professional civilian language while preserving the impact of your achievements. Perfect for turning "Supervised 15 Sailors in DC Division" into "Led team of 15 in emergency response and safety operations."',
    link: '/career-tools',
  },
  {
    id: 'eval-upload',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
    title: 'Eval Upload & OCR',
    description: 'Upload FITREPs/evals and extract content automatically.',
    details: 'Upload your military evaluations (FITREPs, NCOERs, OERs, EPRs) as PDF or image files. Our OCR technology extracts the text, and AI identifies your key achievements, leadership examples, and quantifiable results. Import these directly into your resume with one click.',
    link: '/career-tools',
  },
  {
    id: 'job-match',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Job Match Analysis',
    description: 'Paste a job posting and see how your resume matches.',
    details: 'Get an instant compatibility score between your resume and any job posting. Our AI analyzes required skills, qualifications, and keywords, then provides specific recommendations for improving your match. See exactly which skills to highlight and what gaps to address before applying.',
    link: '/job-match',
  },
  {
    id: 'cover-letter',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Cover Letter Generator',
    description: 'AI-generated cover letters tailored to each job.',
    details: 'Generate professional cover letters customized for each position you apply to. Our AI uses your military background, the specific job requirements, and the company information to create compelling cover letters that highlight relevant experience and demonstrate genuine interest.',
    link: '/career-tools',
  },
  {
    id: 'linkedin',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    title: 'LinkedIn Optimizer',
    description: 'Optimize your LinkedIn profile for recruiters.',
    details: 'Free: Generate optimized headlines and summaries from your military background. Premium: Upload your existing LinkedIn profile for comprehensive analysis with optimization suggestions, skills recommendations based on target roles, and keyword optimization to appear in more recruiter searches.',
    link: '/career-tools',
  },
  {
    id: 'elevator-pitch',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    title: 'Elevator Pitch',
    description: 'Generate 30/60/90 second networking pitches.',
    details: 'Networking events and job fairs require a compelling personal pitch. Our AI generates customized 30, 60, and 90-second elevator pitches based on your background and target role. Practice with timing guides and never stumble over "So, tell me about yourself" again.',
    link: '/career-tools',
  },
  {
    id: 'smart-apply',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Smart Apply & Skills by Rank',
    description: 'Skills recommendations based on your rank and experience.',
    details: 'Your rank represents specific leadership competencies and responsibilities. We map military ranks to equivalent civilian skills and experience levels, helping you articulate your qualifications appropriately. An E-7 Chief demonstrates different leadership than an E-4 - and employers should understand that.',
    link: '/profile',
  },
]

// Tutorial Data
const TUTORIALS = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'From signup to your first resume in 15 minutes',
    steps: [
      { title: 'Create your account', description: 'Sign up with your email, select your military branch and paygrade.' },
      { title: 'Verify your email', description: 'Check your inbox and click the confirmation link.' },
      { title: 'Complete onboarding', description: 'Tell us about your military background, career goals, and transition timeline.' },
      { title: 'Review your dashboard', description: 'See your usage limits, quick actions, and recommended next steps.' },
      { title: 'Create your first resume', description: 'Click "Create Resume" and choose Private or Federal format.' },
    ],
  },
  {
    id: 'building-profile',
    title: 'Building Your Profile',
    description: 'How to fill out your military background for best results',
    steps: [
      { title: 'Enter basic info', description: 'Confirm your name, branch, rank, and paygrade from signup.' },
      { title: 'Add your MOS/Rating/AFSC', description: 'Enter your military occupation code for accurate job matching.' },
      { title: 'List your duty stations', description: 'Add locations and dates - this helps with geographic preferences.' },
      { title: 'Enter education & certifications', description: 'Include military training, college degrees, and professional certifications.' },
      { title: 'Set career preferences', description: 'Tell us your target industries, job types, and salary expectations.' },
    ],
  },
  {
    id: 'creating-resume',
    title: 'Creating a Resume',
    description: 'Step-by-step resume creation walkthrough',
    steps: [
      { title: 'Choose resume type', description: 'Private for civilian jobs, Federal for USAJOBS positions.' },
      { title: 'Select a template', description: 'Pick from Clean, ATS-Optimized, Classic, Modern, Minimal, or Federal formats.' },
      { title: 'Add contact info', description: 'Review and update your contact information and professional summary.' },
      { title: 'Enter work experience', description: 'Add your military and civilian positions with achievements.' },
      { title: 'Translate bullets', description: 'Use the bullet translator to convert military jargon.' },
      { title: 'Add skills & education', description: 'Include relevant skills, certifications, and education.' },
      { title: 'Preview & download', description: 'Review the final version and download as PDF or DOCX.' },
    ],
  },
  {
    id: 'tailoring-job',
    title: 'Tailoring for a Job',
    description: 'Using Job Match to customize your resume',
    steps: [
      { title: 'Find a job posting', description: 'Copy the job URL or full job description text.' },
      { title: 'Open Job Match', description: 'Navigate to Job Match from the dashboard or sidebar.' },
      { title: 'Paste the posting', description: 'Enter the URL or paste the job description.' },
      { title: 'Select your resume', description: 'Choose which resume to analyze against the posting.' },
      { title: 'Review the analysis', description: 'See your match score, skill gaps, and recommendations.' },
      { title: 'Apply suggestions', description: 'Update your resume based on the specific recommendations.' },
    ],
  },
  {
    id: 'federal-guide',
    title: 'Federal Resume Guide',
    description: 'Special considerations for USAJOBS applications',
    steps: [
      { title: 'Understand the format', description: 'Federal resumes are 4-6 pages with detailed job information.' },
      { title: 'Include required details', description: 'Add hours/week, supervisor info, and salary for each position.' },
      { title: 'Write comprehensive descriptions', description: 'Federal HR needs detailed duty descriptions, not brief bullets.' },
      { title: 'Match the announcement', description: 'Mirror language from the job announcement in your resume.' },
      { title: 'Address KSAs', description: 'Ensure you address all Knowledge, Skills, and Abilities listed.' },
      { title: 'Check the questionnaire', description: 'Your resume must support your questionnaire answers.' },
    ],
  },
  {
    id: 'uploading-evals',
    title: 'Uploading Evaluations',
    description: 'How to use eval OCR to extract achievements',
    steps: [
      { title: 'Gather your evals', description: 'Find your FITREPs, NCOERs, OERs, or EPRs in PDF or image format.' },
      { title: 'Navigate to Eval Upload', description: 'Go to Career Tools > Eval Upload from your dashboard.' },
      { title: 'Upload your file', description: 'Drag and drop or click to select your evaluation file.' },
      { title: 'Wait for processing', description: 'OCR extracts text in 10-30 seconds depending on quality.' },
      { title: 'Review extracted content', description: 'Check the identified achievements and bullet points.' },
      { title: 'Import to resume', description: 'Select items to import directly into your resume builder.' },
    ],
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)
  const [expandedTutorial, setExpandedTutorial] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<'faq' | 'features' | 'tutorials'>('faq')

  // Filter content based on search
  const filteredFaq = useMemo(() => {
    if (!searchQuery) return FAQ_SECTIONS
    const query = searchQuery.toLowerCase()
    return FAQ_SECTIONS.map(section => ({
      ...section,
      questions: section.questions.filter(
        q => q.q.toLowerCase().includes(query) || q.a.toLowerCase().includes(query)
      ),
    })).filter(section => section.questions.length > 0)
  }, [searchQuery])

  const filteredFeatures = useMemo(() => {
    if (!searchQuery) return FEATURES
    const query = searchQuery.toLowerCase()
    return FEATURES.filter(
      f => f.title.toLowerCase().includes(query) ||
           f.description.toLowerCase().includes(query) ||
           f.details.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const filteredTutorials = useMemo(() => {
    if (!searchQuery) return TUTORIALS
    const query = searchQuery.toLowerCase()
    return TUTORIALS.filter(
      t => t.title.toLowerCase().includes(query) ||
           t.description.toLowerCase().includes(query) ||
           t.steps.some(s => s.title.toLowerCase().includes(query) || s.description.toLowerCase().includes(query))
    )
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="bg-bg-secondary border-b border-border">
        <nav className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 border-2 border-gold flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gold">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 9h6M9 13h6M9 17h4"/>
              </svg>
            </div>
            <span className="font-heading text-xl font-bold tracking-wider uppercase">Debriefed</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="px-4 py-2 font-heading text-sm font-bold uppercase tracking-wider text-text-muted hover:text-text transition-colors">
              Dashboard
            </Link>
            <Link href="/pricing" className="px-4 py-2 font-heading text-sm font-bold uppercase tracking-wider bg-gold text-bg-primary hover:bg-gold-bright rounded transition-all">
              Pricing
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-bg-secondary border-b border-border px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block font-mono text-[11px] uppercase tracking-wider text-gold bg-gold-dim px-4 py-2 mb-6">
            Support Center
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4">
            Operations Manual
          </h1>
          <p className="text-lg text-text-muted mb-8 max-w-2xl mx-auto">
            Everything you need to know about Debriefed. Search for answers, explore features, or follow step-by-step tutorials.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-primary border border-border rounded-lg pl-12 pr-4 py-3 text-text placeholder:text-text-dim focus:outline-none focus:border-gold transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-text"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Section Tabs */}
      <div className="bg-bg-secondary border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveSection('faq')}
              className={`px-6 py-4 font-heading text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
                activeSection === 'faq'
                  ? 'text-gold border-gold'
                  : 'text-text-muted border-transparent hover:text-text'
              }`}
            >
              FAQ
            </button>
            <button
              onClick={() => setActiveSection('features')}
              className={`px-6 py-4 font-heading text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
                activeSection === 'features'
                  ? 'text-gold border-gold'
                  : 'text-text-muted border-transparent hover:text-text'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => setActiveSection('tutorials')}
              className={`px-6 py-4 font-heading text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
                activeSection === 'tutorials'
                  ? 'text-gold border-gold'
                  : 'text-text-muted border-transparent hover:text-text'
              }`}
            >
              Tutorials
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* FAQ Section */}
        {activeSection === 'faq' && (
          <section>
            <div className="mb-8">
              <h2 className="font-heading text-2xl font-bold uppercase tracking-wider mb-2">Frequently Asked Questions</h2>
              <p className="text-text-muted">Find quick answers to common questions about Debriefed.</p>
            </div>

            {filteredFaq.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-text-muted">No matching questions found. Try a different search term.</p>
              </Card>
            ) : (
              <div className="space-y-8">
                {filteredFaq.map((section) => (
                  <div key={section.title}>
                    <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-gold mb-4">{section.title}</h3>
                    <div className="space-y-2">
                      {section.questions.map((item, idx) => {
                        const key = `${section.title}-${idx}`
                        const isExpanded = expandedFaq === key
                        return (
                          <Card key={key} className="overflow-hidden">
                            <button
                              onClick={() => setExpandedFaq(isExpanded ? null : key)}
                              className="w-full flex items-center justify-between p-4 text-left hover:bg-bg-tertiary/50 transition-colors"
                            >
                              <span className="font-medium pr-4">{item.q}</span>
                              <svg
                                className={`w-5 h-5 text-text-dim shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            {isExpanded && (
                              <div className="px-4 pb-4 text-text-muted border-t border-border pt-4">
                                {item.a}
                              </div>
                            )}
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Features Section */}
        {activeSection === 'features' && (
          <section>
            <div className="mb-8">
              <h2 className="font-heading text-2xl font-bold uppercase tracking-wider mb-2">Feature Guide</h2>
              <p className="text-text-muted">Explore all the tools available to help your transition.</p>
            </div>

            {filteredFeatures.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-text-muted">No matching features found. Try a different search term.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFeatures.map((feature) => {
                  const isExpanded = expandedFeature === feature.id
                  return (
                    <Card
                      key={feature.id}
                      className={`p-6 cursor-pointer transition-all ${isExpanded ? 'ring-2 ring-gold' : 'hover:border-border-bright'}`}
                      onClick={() => setExpandedFeature(isExpanded ? null : feature.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gold-dim rounded-lg flex items-center justify-center text-gold shrink-0">
                          {feature.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading font-bold uppercase tracking-wider mb-1">{feature.title}</h3>
                          <p className="text-sm text-text-muted">{feature.description}</p>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-sm text-text-muted mb-4">{feature.details}</p>
                          <Link
                            href={feature.link}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-bright transition-colors"
                          >
                            Try it now
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {/* Tutorials Section */}
        {activeSection === 'tutorials' && (
          <section>
            <div className="mb-8">
              <h2 className="font-heading text-2xl font-bold uppercase tracking-wider mb-2">Tutorials & Walkthroughs</h2>
              <p className="text-text-muted">Step-by-step guides to get the most out of Debriefed.</p>
            </div>

            {filteredTutorials.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-text-muted">No matching tutorials found. Try a different search term.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredTutorials.map((tutorial) => {
                  const isExpanded = expandedTutorial === tutorial.id
                  return (
                    <Card key={tutorial.id} className="overflow-hidden">
                      <button
                        onClick={() => setExpandedTutorial(isExpanded ? null : tutorial.id)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-bg-tertiary/50 transition-colors"
                      >
                        <div>
                          <h3 className="font-heading font-bold uppercase tracking-wider mb-1">{tutorial.title}</h3>
                          <p className="text-sm text-text-muted">{tutorial.description}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono text-xs text-text-dim">{tutorial.steps.length} steps</span>
                          <svg
                            className={`w-5 h-5 text-text-dim transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-6 pb-6 border-t border-border">
                          <ol className="mt-4 space-y-4">
                            {tutorial.steps.map((step, idx) => (
                              <li key={idx} className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-gold-dim text-gold flex items-center justify-center font-heading font-bold text-sm shrink-0">
                                  {idx + 1}
                                </div>
                                <div className="pt-1">
                                  <h4 className="font-medium mb-1">{step.title}</h4>
                                  <p className="text-sm text-text-muted">{step.description}</p>
                                </div>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {/* Contact Section */}
        <section className="mt-16 text-center">
          <Card className="p-8 md:p-12">
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider mb-2">Still Need Help?</h2>
            <p className="text-text-muted mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@debriefed.io"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold text-bg-primary font-heading text-sm font-bold uppercase tracking-wider rounded hover:bg-gold-bright transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Support
              </a>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border bg-bg-secondary text-text font-heading text-sm font-bold uppercase tracking-wider rounded hover:border-gold hover:text-gold transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-bg-secondary border-t border-border px-4 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-gold flex items-center justify-center">
              <span className="font-heading font-bold text-gold text-sm">D</span>
            </div>
            <span className="font-heading text-sm font-bold tracking-wider uppercase">Debriefed</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <Link href="/pricing" className="hover:text-gold transition-colors">Pricing</Link>
            <Link href="/help" className="hover:text-gold transition-colors">Help</Link>
            <span className="text-text-dim">Feedback: Use the button in the corner</span>
          </div>
          <p className="text-sm text-text-dim">
            &copy; {new Date().getFullYear()} Debriefed. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
