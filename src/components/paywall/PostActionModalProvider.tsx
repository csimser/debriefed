'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PostActionModal, PostActionLink } from './PostActionModal'

// ─── Modal Configurations ────────────────────────────────────────────────────

interface ModalConfig {
  title: string
  subtitle: string
  primaryCTA: PostActionLink
  secondaryLinks: PostActionLink[]
}

const MODAL_CONFIGS: Record<string, ModalConfig> = {
  'resume-download': {
    title: 'Nice work. Your resume is ready.',
    subtitle: "But a resume without a target is just a document. Want to see how it scores against a real job posting?",
    primaryCTA: { label: 'Try Job Match', route: '/job-match', featureCheck: 'job_match_analysis' },
    secondaryLinks: [
      { label: 'Optimize your LinkedIn profile', route: '/career-tools?tool=linkedin', featureCheck: 'linkedin_headline' },
      { label: 'Build a federal resume for USAJOBS', route: '/resumes?type=federal', featureCheck: 'federal_resumes' },
      { label: 'Write a cover letter for your target role', route: '/career-tools?tool=cover-letter', featureCheck: 'cover_letters' },
    ],
  },
  'job-match-complete': {
    title: 'Now you know where you stand.',
    subtitle: "You've got your match score and gap analysis. Ready to write a cover letter that speaks directly to this role?",
    primaryCTA: { label: 'Generate Cover Letter', route: '/career-tools?tool=cover-letter', featureCheck: 'cover_letters' },
    secondaryLinks: [
      { label: 'Refine your resume based on these gaps', route: '/resumes', featureCheck: 'private_resumes' },
      { label: 'Optimize your LinkedIn profile', route: '/career-tools?tool=linkedin', featureCheck: 'linkedin_headline' },
    ],
  },
  'cover-letter-complete': {
    title: 'Application ready. Now get found.',
    subtitle: "Your resume and cover letter are dialed in. Make sure recruiters can find you on their own too.",
    primaryCTA: { label: 'Optimize LinkedIn Profile', route: '/career-tools?tool=linkedin', featureCheck: 'linkedin_headline' },
    secondaryLinks: [
      { label: 'Try another job match', route: '/job-match', featureCheck: 'job_match_analysis' },
      { label: 'Build a federal resume for USAJOBS', route: '/resumes?type=federal', featureCheck: 'federal_resumes' },
    ],
  },
  'linkedin-complete': {
    title: 'Your profile is sharp. Keep going.',
    subtitle: "Thinking about government roles? Your experience translates well to federal positions.",
    primaryCTA: { label: 'Build a Federal Resume', route: '/resumes?type=federal', featureCheck: 'federal_resumes' },
    secondaryLinks: [
      { label: 'Run a job match analysis', route: '/job-match', featureCheck: 'job_match_analysis' },
      { label: 'Generate another cover letter', route: '/career-tools?tool=cover-letter', featureCheck: 'cover_letters' },
    ],
  },
  'federal-resume-download': {
    title: 'Federal resume locked in.',
    subtitle: "Want to see how it scores against a specific GS posting?",
    primaryCTA: { label: 'Try Job Match', route: '/job-match', featureCheck: 'job_match_analysis' },
    secondaryLinks: [
      { label: 'Write a cover letter', route: '/career-tools?tool=cover-letter', featureCheck: 'cover_letters' },
      { label: 'Optimize your LinkedIn profile', route: '/career-tools?tool=linkedin', featureCheck: 'linkedin_headline' },
    ],
  },
}

// Distinct feature categories for counting "how many features used"
// Groups related usage_tracking feature names into logical features
const FEATURE_GROUPS: Record<string, string[]> = {
  resume: ['private_resumes'],
  federal_resume: ['federal_resumes'],
  job_match: ['job_match_analysis'],
  cover_letter: ['cover_letters'],
  linkedin: ['linkedin_headline', 'linkedin_summary'],
  eval: ['eval_uploads'],
}

function countDistinctFeaturesUsed(usedFeatures: Set<string>): number {
  let count = 0
  for (const group of Object.values(FEATURE_GROUPS)) {
    if (group.some((f) => usedFeatures.has(f))) {
      count++
    }
  }
  return count
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface PostActionModalContextValue {
  triggerPostActionModal: (featureKey: string) => void
}

const PostActionModalContext = createContext<PostActionModalContextValue>({
  triggerPostActionModal: () => {},
})

export function usePostActionModal() {
  return useContext(PostActionModalContext)
}

// ─── Provider ────────────────────────────────────────────────────────────────

interface ProviderProps {
  children: ReactNode
  userId: string
}

export function PostActionModalProvider({ children, userId }: ProviderProps) {
  // Track which features have been used (from DB) — keyed by feature name from usage_tracking
  const [usedFeatures, setUsedFeatures] = useState<Set<string>>(new Set())
  // Track which modals have been dismissed this session (keyed by featureKey)
  const [sessionDismissals, setSessionDismissals] = useState<Set<string>>(new Set())
  // Currently active modal config, or null
  const [activeModal, setActiveModal] = useState<{ featureKey: string; config: ModalConfig } | null>(null)
  // Loading state for initial query
  const [loaded, setLoaded] = useState(false)

  // Feedback state
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  // Count of modals shown this session where feedback was visible but ignored
  const [feedbackIgnoreCount, setFeedbackIgnoreCount] = useState(0)
  // Whether feedback section was shown on the current modal
  const [feedbackShownOnCurrentModal, setFeedbackShownOnCurrentModal] = useState(false)

  // Query Supabase on mount to check which features the user has used
  useEffect(() => {
    if (!userId) return

    async function fetchUsedFeatures() {
      const supabase = createClient()

      // Query usage_tracking for features with count > 0
      const { data: usageRows } = await supabase
        .from('usage_tracking')
        .select('feature, count')
        .eq('user_id', userId)
        .gt('count', 0)

      const features = new Set<string>()

      if (usageRows) {
        for (const row of usageRows) {
          features.add(row.feature)
        }
      }

      // Also check for federal resumes specifically (user may have one but not tracked via usage_tracking)
      const { data: federalResumes } = await supabase
        .from('resumes')
        .select('id')
        .eq('user_id', userId)
        .eq('resume_type', 'federal')
        .limit(1)

      if (federalResumes && federalResumes.length > 0) {
        features.add('federal_resumes')
      }

      // Check if user has already submitted feedback
      const { data: profile } = await supabase
        .from('profiles')
        .select('feedback_submitted')
        .eq('id', userId)
        .single()

      if (profile?.feedback_submitted) {
        setFeedbackSubmitted(true)
      }

      setUsedFeatures(features)
      setLoaded(true)
    }

    fetchUsedFeatures()
  }, [userId])

  // Determine if feedback section should show on the current modal
  const shouldShowFeedback = loaded
    && !feedbackSubmitted
    && feedbackIgnoreCount < 3
    && countDistinctFeaturesUsed(usedFeatures) >= 2

  const triggerPostActionModal = useCallback((featureKey: string) => {
    if (!loaded) return

    const config = MODAL_CONFIGS[featureKey]
    if (!config) return

    // Don't show if dismissed this session
    if (sessionDismissals.has(featureKey)) return

    // Don't show if user has already used the primary CTA feature
    if (usedFeatures.has(config.primaryCTA.featureCheck)) return

    // Filter secondary links to only features the user hasn't tried
    const filteredSecondaryLinks = config.secondaryLinks.filter(
      (link) => !usedFeatures.has(link.featureCheck)
    )

    setFeedbackShownOnCurrentModal(false)

    setActiveModal({
      featureKey,
      config: {
        ...config,
        secondaryLinks: filteredSecondaryLinks,
      },
    })
  }, [loaded, sessionDismissals, usedFeatures])

  const handleDismiss = useCallback(() => {
    if (activeModal) {
      setSessionDismissals((prev) => new Set(prev).add(activeModal.featureKey))

      // If feedback was shown but not interacted with, count as ignored
      if (feedbackShownOnCurrentModal && !feedbackSubmitted) {
        setFeedbackIgnoreCount((prev) => prev + 1)
      }
    }
    setActiveModal(null)
  }, [activeModal, feedbackShownOnCurrentModal, feedbackSubmitted])

  const handleFeedbackSubmitted = useCallback(() => {
    setFeedbackSubmitted(true)
  }, [])

  // Track that feedback was rendered on this modal (called by the modal itself)
  const handleFeedbackShown = useCallback(() => {
    setFeedbackShownOnCurrentModal(true)
  }, [])

  return (
    <PostActionModalContext.Provider value={{ triggerPostActionModal }}>
      {children}
      {activeModal && (
        <PostActionModal
          title={activeModal.config.title}
          subtitle={activeModal.config.subtitle}
          primaryCTA={activeModal.config.primaryCTA}
          secondaryLinks={activeModal.config.secondaryLinks}
          onDismiss={handleDismiss}
          showFeedback={shouldShowFeedback}
          featureContext={activeModal.featureKey}
          onFeedbackSubmitted={handleFeedbackSubmitted}
          onFeedbackShown={handleFeedbackShown}
        />
      )}
    </PostActionModalContext.Provider>
  )
}
