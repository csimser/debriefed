'use client'

import { useState, useEffect } from 'react'
import { CollapsibleSection } from '../CollapsibleSection'
import { BulletAssignmentModal } from '../BulletAssignmentModal'
import { CivilianTitleSuggestions } from '../CivilianTitleSuggestions'
import { EvalUploadModal } from '../EvalUploadModal'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { formatDateForDB, formatDateForInput } from '@/lib/military-titles'
import { US_STATES } from '@/lib/constants/states'
import { formatSalary, parseSalary } from '@/lib/formatSalary'
import { toE164 } from '@/lib/formatPhone'
import { InternationalPhoneInput } from '@/components/ui/InternationalPhoneInput'
import { LastUseWarningModal } from '@/components/paywall/LastUseWarningModal'
import { BulletTemplateModal } from '../BulletTemplateModal'
import { translateBullet as dictTranslateBullet } from '@/lib/dictionary/bulletTranslator'
import { getDictionary } from '@/lib/dictionary/dictionaryQueries'
import { parseAndTranslateEvalText } from '@/lib/dictionary/evalParser'
import { UpgradeLink } from '@/components/modals/UpgradeModal'
import { polishBullet } from '@/lib/dictionary/outputPolisher'
import type { DictBulletPattern, DictionaryCache } from '@/lib/dictionary/types'
import { HelpTranslatePrompt } from '@/components/dictionary/HelpTranslatePrompt'
import { submitTerm } from '@/lib/dictionary/communityQueries'
import { getUserTier, isPaidTier } from '@/lib/tier-utils'

interface ExtractedBullet {
  original: string
  translated: string
  metrics: string[]
  skills: string[]
}

// Strip leading bullet characters from pasted/entered text
function stripLeadingBulletChars(text: string): string {
  // Remove leading whitespace, then bullet characters, then more whitespace
  return text.replace(/^\s*[•\-\*\>\●\○\◆\◇\▸\▹\►\▻\➤\➢\→]+\s*/g, '').trim()
}

interface ExperienceSectionProps {
  userId: string
  experiences: any[]
  onUpdate: (experiences: any[]) => void
  pendingBullets?: ExtractedBullet[]
  onBulletsSaved?: () => void
  bulletTranslationUsage?: { used: number; limit: number; remaining: number; allowed: boolean }
  userBranch?: string
  userPaygrade?: string
  userPlan?: string
}

export function ExperienceSection({
  userId,
  experiences,
  onUpdate,
  pendingBullets = [],
  onBulletsSaved,
  bulletTranslationUsage,
  userBranch,
  userPaygrade,
  userPlan,
}: ExperienceSectionProps) {
  const isFreeUser = !isPaidTier(getUserTier({ tier: userPlan }))
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showBulletModal, setShowBulletModal] = useState(pendingBullets.length > 0)
  const [savingBullets, setSavingBullets] = useState(false)
  const [expandedExperiences, setExpandedExperiences] = useState<Set<string>>(new Set())
  const [showEvalUploadForExp, setShowEvalUploadForExp] = useState<string | null>(null) // Experience ID to upload eval for

  const emptyExp = {
    employment_type: 'military' as 'military' | 'civilian',
    job_title: '',
    civilian_title: '',
    organization: '',
    company_name: '',
    location: '',
    city: '',
    state: '',
    start_date: '',
    end_date: '',
    is_current: false,
    hours_per_week: 40,
    grade_level: '',
    supervisor_name: '',
    supervisor_phone: '',
    supervisor_can_contact: true,
    salary: '',
    salaryDisplay: '', // For formatted display
  }

  // State for editing individual bullets
  const [editingBulletId, setEditingBulletId] = useState<string | null>(null)
  const [editingBulletText, setEditingBulletText] = useState('')

  // Translate bullet state
  const [translatingBulletId, setTranslatingBulletId] = useState<string | null>(null)
  const [translationResult, setTranslationResult] = useState<{ bulletId: string; original: string; translated: string; alreadyCivilian?: boolean; alreadyCivilianMessage?: string } | null>(null)
  const [translateError, setTranslateError] = useState<string | null>(null)
  const [showTranslateWarning, setShowTranslateWarning] = useState(false)
  const [pendingTranslateBulletId, setPendingTranslateBulletId] = useState<string | null>(null)
  const [pendingTranslateExpId, setPendingTranslateExpId] = useState<string | null>(null)
  const [localTranslationRemaining, setLocalTranslationRemaining] = useState(bulletTranslationUsage?.remaining ?? 0)
  const [upgradeNudgeBulletId, setUpgradeNudgeBulletId] = useState<string | null>(null)

  // Bulk paste state
  const [showBulkPasteForExp, setShowBulkPasteForExp] = useState<string | null>(null)
  const [bulkPasteText, setBulkPasteText] = useState('')
  const [bulkPastePreview, setBulkPastePreview] = useState<string[] | null>(null)

  // Voice input state
  const [recordingBulletId, setRecordingBulletId] = useState<string | null>(null)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [recognitionRef, setRecognitionRef] = useState<any>(null)

  // Template modal state
  const [showTemplateForExp, setShowTemplateForExp] = useState<string | null>(null)

  // Dictionary translation source tracking per bullet ID
  const [bulletSources, setBulletSources] = useState<Record<string, 'dictionary' | 'ai'>>({})

  // Help Translate prompt state (once per session)
  const [helpPromptBulletId, setHelpPromptBulletId] = useState<string | null>(null)
  const [helpPromptPhrase, setHelpPromptPhrase] = useState<string>('')

  // Suggest a correction state
  const [correctionBulletId, setCorrectionBulletId] = useState<string | null>(null)
  const [correctionMilitary, setCorrectionMilitary] = useState('')
  const [correctionCivilian, setCorrectionCivilian] = useState('')
  const [correctionSubmitting, setCorrectionSubmitting] = useState(false)
  const [correctionSuccess, setCorrectionSuccess] = useState<string | null>(null)

  // Bullet suggestions from dict_bullet_patterns
  const [showSuggestForExp, setShowSuggestForExp] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<{ pattern: DictBulletPattern; populated: string; score: number }[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  // Eval-derived bullet suggestions
  const [evalSuggestions, setEvalSuggestions] = useState<{ original: string; translated: string; coverage: number }[]>([])
  const [hasEvalData, setHasEvalData] = useState(false)
  // Paste eval text for manual translation
  const [showPasteBox, setShowPasteBox] = useState(false)
  const [pasteText, setPasteText] = useState('')
  const [pasteSuggestions, setPasteSuggestions] = useState<{ original: string; translated: string; coverage: number }[]>([])
  const [translatingPaste, setTranslatingPaste] = useState(false)
  const [showMoreMenuForExp, setShowMoreMenuForExp] = useState<string | null>(null)

  const [formExp, setFormExp] = useState(emptyExp)
  const [showFederalFields, setShowFederalFields] = useState(false)
  const supabase = createClient()

  // Start editing an experience
  const handleEdit = (exp: any) => {
    setEditingId(exp.id)
    setAdding(false)
    setFormExp({
      employment_type: exp.employment_type || 'military',
      job_title: exp.job_title || '',
      civilian_title: exp.civilian_title || '',
      organization: exp.organization || '',
      company_name: exp.company_name || exp.organization || '',
      location: exp.location || '',
      city: exp.city || '',
      state: exp.state || '',
      start_date: formatDateForInput(exp.start_date) || '',
      end_date: exp.end_date ? formatDateForInput(exp.end_date) : '',
      is_current: exp.is_current || false,
      hours_per_week: exp.hours_per_week || 40,
      grade_level: exp.grade_level || '',
      supervisor_name: exp.supervisor_name || '',
      supervisor_phone: toE164(exp.supervisor_phone || ''),
      supervisor_can_contact: exp.supervisor_can_contact !== false,
      salary: exp.salary || '',
      salaryDisplay: formatSalary(exp.salary),
    })
    // Show federal fields if any are populated
    setShowFederalFields(!!(exp.grade_level || exp.supervisor_name || exp.salary))
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null)
    setAdding(false)
    setFormExp(emptyExp)
    setShowFederalFields(false)
    setEditingBulletId(null)
    setEditingBulletText('')
  }

  // Toggle expand/collapse for experience bullets
  const toggleExpand = (expId: string) => {
    setExpandedExperiences(prev => {
      const newSet = new Set(prev)
      if (newSet.has(expId)) {
        newSet.delete(expId)
      } else {
        newSet.add(expId)
      }
      return newSet
    })
  }

  // Delete individual bullet
  const deleteBullet = async (bulletId: string, experienceId: string) => {
    if (!confirm('Delete this bullet?')) return

    const { error } = await supabase
      .from('experience_bullets')
      .delete()
      .eq('id', bulletId)

    if (error) {
      alert(`Failed to delete: ${error.message}`)
    } else {
      // Update local state
      const updatedExperiences = experiences.map(exp => {
        if (exp.id === experienceId) {
          return {
            ...exp,
            bullets: exp.bullets?.filter((b: any) => b.id !== bulletId) || []
          }
        }
        return exp
      })
      onUpdate(updatedExperiences)
    }
  }

  // Start editing a bullet
  const startEditBullet = (bulletId: string, currentText: string) => {
    setEditingBulletId(bulletId)
    setEditingBulletText(currentText)
  }

  // Save edited bullet
  const saveEditBullet = async (bulletId: string, experienceId: string) => {
    const cleanedText = stripLeadingBulletChars(editingBulletText)
    if (!cleanedText) {
      alert('Bullet text cannot be empty')
      return
    }

    const { error } = await supabase
      .from('experience_bullets')
      .update({ translated_text: cleanedText })
      .eq('id', bulletId)

    if (error) {
      alert(`Failed to update: ${error.message}`)
    } else {
      // Update local state
      const updatedExperiences = experiences.map(exp => {
        if (exp.id === experienceId) {
          return {
            ...exp,
            bullets: exp.bullets?.map((b: any) =>
              b.id === bulletId ? { ...b, translated_text: cleanedText } : b
            ) || []
          }
        }
        return exp
      })
      onUpdate(updatedExperiences)
      setEditingBulletId(null)
      setEditingBulletText('')
    }
  }

  // Cancel editing bullet
  const cancelEditBullet = () => {
    setEditingBulletId(null)
    setEditingBulletText('')
  }

  // Move bullet up or down within an experience
  const moveBullet = async (bulletId: string, experienceId: string, direction: 'up' | 'down') => {
    const exp = experiences.find(e => e.id === experienceId)
    if (!exp) return

    const sortedBullets = [...(exp.bullets || [])].sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    const currentIndex = sortedBullets.findIndex((b: any) => b.id === bulletId)
    if (currentIndex === -1) return

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= sortedBullets.length) return

    const currentBullet = sortedBullets[currentIndex]
    const targetBullet = sortedBullets[targetIndex]

    // Swap sort_order values in database
    const currentOrder = currentBullet.sort_order ?? currentIndex
    const targetOrder = targetBullet.sort_order ?? targetIndex

    const results = await Promise.all([
      supabase.from('experience_bullets').update({ sort_order: targetOrder }).eq('id', currentBullet.id),
      supabase.from('experience_bullets').update({ sort_order: currentOrder }).eq('id', targetBullet.id),
    ])

    if (results.some(r => r.error)) {
      alert('Failed to reorder bullets')
      return
    }

    // Update local state
    const updatedBullets = sortedBullets.map((b: any) => {
      if (b.id === currentBullet.id) return { ...b, sort_order: targetOrder }
      if (b.id === targetBullet.id) return { ...b, sort_order: currentOrder }
      return b
    })

    const updatedExperiences = experiences.map(e => {
      if (e.id === experienceId) {
        return { ...e, bullets: updatedBullets }
      }
      return e
    })
    onUpdate(updatedExperiences)
  }

  // Add new bullet to experience (inserts at TOP)
  const addBulletToExperience = async (experienceId: string) => {
    // Shift all existing bullets' sort_order up by 1
    const exp = experiences.find(e => e.id === experienceId)
    const existingBullets = exp?.bullets || []

    if (existingBullets.length > 0) {
      const shiftPromises = existingBullets.map((b: any) =>
        supabase.from('experience_bullets').update({ sort_order: (b.sort_order ?? 0) + 1 }).eq('id', b.id)
      )
      await Promise.all(shiftPromises)
    }

    const { data, error } = await supabase
      .from('experience_bullets')
      .insert({
        experience_id: experienceId,
        original_text: '',
        translated_text: 'New bullet - click to edit',
        sort_order: 0,
        status: 'accepted',
      })
      .select()
      .single()

    if (error) {
      alert(`Failed to add bullet: ${error.message}`)
    } else if (data) {
      // Update local state — prepend new bullet and shift existing sort_orders
      const updatedExperiences = experiences.map(exp => {
        if (exp.id === experienceId) {
          const shiftedBullets = (exp.bullets || []).map((b: any) => ({
            ...b,
            sort_order: (b.sort_order ?? 0) + 1,
          }))
          return {
            ...exp,
            bullets: [data, ...shiftedBullets]
          }
        }
        return exp
      })
      onUpdate(updatedExperiences)
      // Auto-expand the experience so the new bullet is visible
      setExpandedExperiences(prev => new Set([...prev, experienceId]))
      startEditBullet(data.id, 'New bullet - click to edit')
    }
  }

  // Show modal when pending bullets arrive
  useEffect(() => {
    if (pendingBullets.length > 0) {
      setShowBulletModal(true)
    }
  }, [pendingBullets])

  // Check speech recognition support on client
  useEffect(() => {
    setSpeechSupported(
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    )
  }, [])

  // Sync local remaining counter with prop
  useEffect(() => {
    if (bulletTranslationUsage) {
      setLocalTranslationRemaining(bulletTranslationUsage.remaining)
    }
  }, [bulletTranslationUsage])

  // Translate a bullet — dictionary first, AI fallback
  const translateBullet = async (bulletId: string, experienceId: string) => {
    // Find bullet text
    const exp = experiences.find(e => e.id === experienceId)
    const bullet = exp?.bullets?.find((b: any) => b.id === bulletId)
    if (!bullet) return

    const bulletText = bullet.translated_text || bullet.original_text
    if (!bulletText || bulletText === 'New bullet - click to edit') return

    setTranslateError(null)
    setTranslatingBulletId(bulletId)

    try {
      // Step 1: Dictionary translation (free, instant, client-side)
      const dictResult = await dictTranslateBullet(bulletText, {
        branch: userBranch || '',
      })

      // Step 2: If dictionary coverage >= 40%, use dictionary result — no API call
      if (dictResult.dictionarySufficient) {
        setTranslationResult({
          bulletId,
          original: bulletText,
          translated: dictResult.translatedText,
          alreadyCivilian: dictResult.alreadyCivilian,
          alreadyCivilianMessage: dictResult.alreadyCivilianMessage,
        })
        setBulletSources(prev => ({ ...prev, [bulletId]: 'dictionary' }))
        return
      }

      // Show Help Translate prompt (once per session) for low-coverage bullets
      if (dictResult.unmatchedPhrases?.length > 0 && !sessionStorage.getItem('dict-help-prompted')) {
        sessionStorage.setItem('dict-help-prompted', '1')
        setHelpPromptBulletId(bulletId)
        setHelpPromptPhrase(dictResult.unmatchedPhrases[0])
      }

      // Free tier: use dictionary result as-is, skip AI
      if (isFreeUser) {
        setTranslationResult({
          bulletId,
          original: bulletText,
          translated: dictResult.translatedText,
        })
        setBulletSources(prev => ({ ...prev, [bulletId]: 'dictionary' }))
        setUpgradeNudgeBulletId(bulletId)
        return
      }

      // Step 3: Dictionary coverage < 40% — fall back to AI
      // Check remaining (only for AI calls)
      if (localTranslationRemaining <= 0) {
        setTranslateError('No translations remaining. Upgrade for more.')
        return
      }

      // Show warning if last use
      if (localTranslationRemaining === 1 && !showTranslateWarning) {
        setShowTranslateWarning(true)
        setPendingTranslateBulletId(bulletId)
        setPendingTranslateExpId(experienceId)
        return
      }

      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullet: bulletText,
          context: { branch: userBranch },
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setTranslateError(data.error || 'Translation failed. Try again.')
        return
      }

      const data = await res.json()
      setTranslationResult({
        bulletId,
        original: bulletText,
        translated: data.translated,
      })
      setBulletSources(prev => ({ ...prev, [bulletId]: 'ai' }))
      setLocalTranslationRemaining(prev => Math.max(0, prev - 1))
    } catch {
      setTranslateError('Translation failed. Check your connection.')
    } finally {
      setTranslatingBulletId(null)
    }
  }

  // Accept translation — replace bullet text
  const acceptTranslation = async (bulletId: string, experienceId: string) => {
    if (!translationResult) return

    const { error } = await supabase
      .from('experience_bullets')
      .update({ translated_text: translationResult.translated })
      .eq('id', bulletId)

    if (error) {
      alert(`Failed to update: ${error.message}`)
    } else {
      const updatedExperiences = experiences.map(exp => {
        if (exp.id === experienceId) {
          return {
            ...exp,
            bullets: exp.bullets?.map((b: any) =>
              b.id === bulletId ? { ...b, translated_text: translationResult.translated } : b
            ) || []
          }
        }
        return exp
      })
      onUpdate(updatedExperiences)
    }
    setTranslationResult(null)
  }

  // Dismiss translation suggestion
  const dismissTranslation = () => {
    setTranslationResult(null)
  }

  // Continue after last-use warning
  const handleTranslateWarningContinue = () => {
    setShowTranslateWarning(false)
    if (pendingTranslateBulletId && pendingTranslateExpId) {
      // Call translate directly, bypassing the remaining===1 check this time
      const bulletId = pendingTranslateBulletId
      const expId = pendingTranslateExpId
      setPendingTranslateBulletId(null)
      setPendingTranslateExpId(null)
      translateBullet(bulletId, expId)
    }
  }

  // Show/hide bullet suggestions for an experience
  const handleShowSuggestions = async (experienceId: string) => {
    if (showSuggestForExp === experienceId) {
      setShowSuggestForExp(null)
      return
    }
    setLoadingSuggestions(true)
    setShowSuggestForExp(experienceId)
    try {
      const dict = await getDictionary()
      const patterns = dict.bulletPatterns ?? []
      const exp = experiences.find(e => e.id === experienceId)
      const jobTitle = exp?.civilian_title || exp?.job_title || ''
      const rankTier = getRankTierFromPaygrade(userPaygrade)

      // Score all patterns, then select top 5 with category diversity
      const allScored = patterns
        .map(pattern => ({ pattern, score: scoreBulletPattern(pattern, jobTitle, rankTier) }))

      const top5 = selectDiverseSuggestions(allScored, 5)

      const scored = top5.map((item, idx) => {
        const ctx: BulletPopulateContext = {
          branch: userBranch || '',
          paygrade: userPaygrade || '',
          yearsOfService: '',
          jobTitle,
          civilianTitle: exp?.civilian_title || '',
          organization: exp?.organization || exp?.company_name || '',
          category: item.pattern.category || 'leadership',
          suggestionIndex: idx,
        }
        return {
          pattern: item.pattern,
          populated: polishBullet(populateBulletTemplate(item.pattern.pattern_template, ctx, dict)),
          score: item.score,
        }
      })

      setSuggestions(scored)

      // Fetch eval uploads for eval-derived suggestions
      try {
        const { data: evalUploads } = await supabase
          .from('eval_uploads')
          .select('extracted_data')
          .eq('user_id', userId)
          .eq('status', 'complete')
          .order('created_at', { ascending: false })

        if (evalUploads && evalUploads.length > 0) {
          setHasEvalData(true)
          // Concatenate all eval text from uploads and run through new parser
          const allEvalText: string[] = []
          for (const upload of evalUploads) {
            const bullets = upload.extracted_data as any[] | null
            if (Array.isArray(bullets)) {
              for (const b of bullets) {
                if (b.original && typeof b.original === 'string') {
                  allEvalText.push(b.original)
                }
              }
            }
          }

          if (allEvalText.length > 0) {
            const combinedText = allEvalText.join('\n')
            const results = await parseAndTranslateEvalText(
              combinedText,
              userBranch || '',
              '',
            )
            setEvalSuggestions(
              results.map(r => ({
                original: r.original,
                translated: r.translated,
                coverage: r.coverage,
              }))
            )
          }
        } else {
          setHasEvalData(false)
          setEvalSuggestions([])
        }
      } catch {
        setHasEvalData(false)
      }
    } catch {
      setSuggestions([])
    } finally {
      setLoadingSuggestions(false)
    }
  }

  // Translate pasted eval text through dictionary pipeline
  const handlePasteTranslate = async () => {
    if (!pasteText.trim()) return
    setTranslatingPaste(true)
    try {
      const results = await parseAndTranslateEvalText(
        pasteText,
        userBranch || '',
        '',
      )
      setPasteSuggestions(
        results.map(r => ({
          original: r.original,
          translated: r.translated,
          coverage: r.coverage,
        }))
      )
    } catch {
      setPasteSuggestions([])
    } finally {
      setTranslatingPaste(false)
    }
  }

  // Insert eval-derived bullet into edit field for user to customize before saving
  const handleEditEvalBeforeUsing = async (experienceId: string, translatedText: string) => {
    // Insert as a new bullet
    const exp = experiences.find(e => e.id === experienceId)
    const existingBullets = exp?.bullets || []

    if (existingBullets.length > 0) {
      const shiftPromises = existingBullets.map((b: any) =>
        supabase.from('experience_bullets').update({ sort_order: (b.sort_order ?? 0) + 1 }).eq('id', b.id)
      )
      await Promise.all(shiftPromises)
    }

    const { data, error } = await supabase
      .from('experience_bullets')
      .insert({
        experience_id: experienceId,
        original_text: '',
        translated_text: translatedText,
        sort_order: 0,
        status: 'accepted',
      })
      .select()
      .single()

    if (error) {
      alert(`Failed to add bullet: ${error.message}`)
    } else if (data) {
      const updatedExperiences = experiences.map(e => {
        if (e.id === experienceId) {
          const shiftedBullets = (e.bullets || []).map((b: any) => ({
            ...b,
            sort_order: (b.sort_order ?? 0) + 1,
          }))
          return { ...e, bullets: [data, ...shiftedBullets] }
        }
        return e
      })
      onUpdate(updatedExperiences)
      setExpandedExperiences(prev => new Set([...prev, experienceId]))
      setBulletSources(prev => ({ ...prev, [data.id]: 'dictionary' }))
      // Open the edit field for this bullet
      setEditingBulletId(data.id)
      setEditingBulletText(translatedText)
    }
  }

  // Use a dictionary suggestion as a new bullet
  const handleUseSuggestion = async (experienceId: string, populatedText: string) => {
    // Shift existing bullets' sort_order up by 1
    const exp = experiences.find(e => e.id === experienceId)
    const existingBullets = exp?.bullets || []

    if (existingBullets.length > 0) {
      const shiftPromises = existingBullets.map((b: any) =>
        supabase.from('experience_bullets').update({ sort_order: (b.sort_order ?? 0) + 1 }).eq('id', b.id)
      )
      await Promise.all(shiftPromises)
    }

    const { data, error } = await supabase
      .from('experience_bullets')
      .insert({
        experience_id: experienceId,
        original_text: '',
        translated_text: populatedText,
        sort_order: 0,
        status: 'accepted',
      })
      .select()
      .single()

    if (error) {
      alert(`Failed to add bullet: ${error.message}`)
    } else if (data) {
      const updatedExperiences = experiences.map(e => {
        if (e.id === experienceId) {
          const shiftedBullets = (e.bullets || []).map((b: any) => ({
            ...b,
            sort_order: (b.sort_order ?? 0) + 1,
          }))
          return { ...e, bullets: [data, ...shiftedBullets] }
        }
        return e
      })
      onUpdate(updatedExperiences)
      setExpandedExperiences(prev => new Set([...prev, experienceId]))
      setBulletSources(prev => ({ ...prev, [data.id]: 'dictionary' }))
    }
    setShowSuggestForExp(null)
  }

  // Parse bulk paste text into bullet lines
  const parseBulkPaste = (text: string): string[] => {
    return text
      .split('\n')
      .map(line => stripLeadingBulletChars(line))
      .filter(line => line.length > 0)
  }

  // Handle bulk paste submit
  const handleBulkPasteSubmit = async (experienceId: string) => {
    const lines = parseBulkPaste(bulkPasteText)
    if (lines.length === 0) return

    const exp = experiences.find(e => e.id === experienceId)
    const maxOrder = exp?.bullets?.reduce((max: number, b: any) => Math.max(max, b.sort_order || 0), -1) ?? -1

    const bulletsToInsert = lines.map((line, idx) => ({
      experience_id: experienceId,
      original_text: '',
      translated_text: line,
      sort_order: maxOrder + idx + 1,
      status: 'accepted',
    }))

    const { data, error } = await supabase
      .from('experience_bullets')
      .insert(bulletsToInsert)
      .select()

    if (error) {
      alert(`Failed to add bullets: ${error.message}`)
    } else if (data) {
      const updatedExperiences = experiences.map(e => {
        if (e.id === experienceId) {
          return { ...e, bullets: [...(e.bullets || []), ...data] }
        }
        return e
      })
      onUpdate(updatedExperiences)
    }

    setShowBulkPasteForExp(null)
    setBulkPasteText('')
    setBulkPastePreview(null)
  }

  // Voice input for bullet editing
  const startVoiceInput = (bulletId: string) => {
    if (!speechSupported) return

    // Stop any existing recording
    if (recognitionRef) {
      recognitionRef.abort()
      setRecognitionRef(null)
      setRecordingBulletId(null)
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: any) => {
      let transcript = ''
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setEditingBulletText(prev => {
        // If prev is placeholder text, replace it entirely
        if (prev === 'New bullet - click to edit') return transcript
        return prev + ' ' + transcript
      })
    }

    recognition.onend = () => {
      setRecordingBulletId(null)
      setRecognitionRef(null)
    }

    recognition.onerror = () => {
      setRecordingBulletId(null)
      setRecognitionRef(null)
    }

    recognition.start()
    setRecordingBulletId(bulletId)
    setRecognitionRef(recognition)
  }

  // Handle template selection — insert as new bullet at TOP
  const handleTemplateSelect = async (template: string) => {
    const experienceId = showTemplateForExp
    if (!experienceId) return

    // Shift existing bullets' sort_order up by 1
    const exp = experiences.find(e => e.id === experienceId)
    const existingBullets = exp?.bullets || []

    if (existingBullets.length > 0) {
      const shiftPromises = existingBullets.map((b: any) =>
        supabase.from('experience_bullets').update({ sort_order: (b.sort_order ?? 0) + 1 }).eq('id', b.id)
      )
      await Promise.all(shiftPromises)
    }

    const { data, error } = await supabase
      .from('experience_bullets')
      .insert({
        experience_id: experienceId,
        original_text: '',
        translated_text: template,
        sort_order: 0,
        status: 'accepted',
      })
      .select()
      .single()

    if (error) {
      alert(`Failed to add bullet: ${error.message}`)
    } else if (data) {
      const updatedExperiences = experiences.map(exp => {
        if (exp.id === experienceId) {
          const shiftedBullets = (exp.bullets || []).map((b: any) => ({
            ...b,
            sort_order: (b.sort_order ?? 0) + 1,
          }))
          return { ...exp, bullets: [data, ...shiftedBullets] }
        }
        return exp
      })
      onUpdate(updatedExperiences)
      setExpandedExperiences(prev => new Set([...prev, experienceId]))
      startEditBullet(data.id, template)
    }
  }

  const handleSave = async () => {
    // Different validation based on employment type
    const isCivilian = formExp.employment_type === 'civilian'
    const orgField = isCivilian ? formExp.company_name : formExp.organization

    if (!formExp.job_title || !orgField) {
      alert(`Please fill in Job Title and ${isCivilian ? 'Company Name' : 'Organization'}`)
      return
    }

    // Generate location from city/state for backwards compatibility
    const location = formExp.city && formExp.state
      ? `${formExp.city}, ${formExp.state}`
      : formExp.location || null

    // Parse salary from display format to number
    const parsedSalary = parseSalary(formExp.salaryDisplay || formExp.salary)

    const dataToSave = {
      employment_type: formExp.employment_type,
      job_title: formExp.job_title,
      // For civilian jobs, use job_title as civilian_title; for military, use civilian_title or job_title
      civilian_title: isCivilian ? formExp.job_title : (formExp.civilian_title || formExp.job_title),
      organization: isCivilian ? formExp.company_name : formExp.organization,
      company_name: isCivilian ? formExp.company_name : null,
      location,
      city: formExp.city || null,
      state: formExp.state || null,
      start_date: formatDateForDB(formExp.start_date),
      end_date: formExp.is_current ? null : formatDateForDB(formExp.end_date),
      is_current: formExp.is_current,
      hours_per_week: formExp.hours_per_week || 40,
      // Only save federal/military fields for military employment
      grade_level: isCivilian ? null : (formExp.grade_level || null),
      supervisor_name: formExp.supervisor_name || null,
      supervisor_phone: formExp.supervisor_phone || null,
      supervisor_can_contact: formExp.supervisor_can_contact,
      salary: parsedSalary,
    }

    if (editingId) {
      // Update existing experience
      const { error } = await supabase
        .from('experience')
        .update(dataToSave)
        .eq('id', editingId)

      if (!error) {
        onUpdate(experiences.map(exp =>
          exp.id === editingId ? { ...exp, ...dataToSave } : exp
        ))
        handleCancelEdit()
      } else {
        console.error('Error updating experience:', error)
        alert(`Failed to update experience: ${error.message}`)
      }
    } else {
      // Insert new experience
      const { data, error } = await supabase
        .from('experience')
        .insert({ ...dataToSave, user_id: userId, sort_order: experiences.length })
        .select()
        .single()

      if (!error && data) {
        onUpdate([...experiences, { ...data, bullets: [] }])
        handleCancelEdit()
      } else if (error) {
        console.error('Error adding experience:', error)
        alert(`Failed to add experience: ${error.message}`)
      }
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('experience').delete().eq('id', id)
    if (!error) onUpdate(experiences.filter(e => e.id !== id))
  }

  // Move experience up or down in the list
  const moveExperience = async (expId: string, direction: 'up' | 'down') => {
    const currentIndex = experiences.findIndex(e => e.id === expId)
    if (currentIndex === -1) return

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= experiences.length) return

    // Swap the two experiences
    const currentExp = experiences[currentIndex]
    const targetExp = experiences[targetIndex]

    // Update sort_order in database
    const updates = [
      supabase.from('experience').update({ sort_order: targetIndex }).eq('id', currentExp.id),
      supabase.from('experience').update({ sort_order: currentIndex }).eq('id', targetExp.id),
    ]

    const results = await Promise.all(updates)
    const hasError = results.some(r => r.error)

    if (!hasError) {
      // Swap in local state
      const newExperiences = [...experiences]
      newExperiences[currentIndex] = { ...targetExp, sort_order: currentIndex }
      newExperiences[targetIndex] = { ...currentExp, sort_order: targetIndex }
      onUpdate(newExperiences)
    } else {
      alert('Failed to reorder experiences')
    }
  }

  // Save bullets to an existing experience
  const saveBulletsToExperience = async (experienceId: string) => {
    setSavingBullets(true)

    try {
      // Get current max sort_order for this experience
      const { data: existingBullets } = await supabase
        .from('experience_bullets')
        .select('sort_order')
        .eq('experience_id', experienceId)
        .order('sort_order', { ascending: false })
        .limit(1)

      const startOrder = existingBullets?.[0]?.sort_order ?? -1

      // Insert bullets (strip any leading bullet characters) with accepted status
      const bulletsToInsert = pendingBullets.map((b, idx) => ({
        experience_id: experienceId,
        original_text: stripLeadingBulletChars(b.original),
        translated_text: stripLeadingBulletChars(b.translated),
        sort_order: startOrder + idx + 1,
        status: 'accepted',
      }))

      const { error } = await supabase.from('experience_bullets').insert(bulletsToInsert)

      if (error) {
        console.error('Error saving bullets:', error)
        alert('Failed to save bullets')
        return
      }

      // Refresh experiences with new bullets
      const { data: updatedExp } = await supabase
        .from('experience')
        .select('*, experience_bullets(*)')
        .eq('user_id', userId)
        .order('sort_order')

      if (updatedExp) {
        onUpdate(updatedExp.map(exp => ({ ...exp, bullets: exp.experience_bullets })))
      }

      setShowBulletModal(false)
      onBulletsSaved?.()
    } finally {
      setSavingBullets(false)
    }
  }

  // Create new experience with bullets
  const createExperienceWithBullets = async (expData: {
    job_title: string
    civilian_title: string
    organization: string
    start_date: string
    end_date: string
  }) => {
    setSavingBullets(true)

    try {
      // Format dates for PostgreSQL (YYYY-MM -> YYYY-MM-DD)
      const startDate = formatDateForDB(expData.start_date)
      const endDate = formatDateForDB(expData.end_date)

      // Create the experience
      const { data: formExperience, error: expError } = await supabase
        .from('experience')
        .insert({
          user_id: userId,
          job_title: expData.job_title,
          civilian_title: expData.civilian_title || expData.job_title,
          organization: expData.organization,
          start_date: startDate,
          end_date: endDate,
          is_current: !endDate,
          sort_order: experiences.length,
        })
        .select()
        .single()

      if (expError || !formExperience) {
        console.error('Error creating experience:', expError)
        alert(`Failed to create experience: ${expError?.message || 'Unknown error'}`)
        return
      }

      // Insert bullets (strip any leading bullet characters) with accepted status
      const bulletsToInsert = pendingBullets.map((b, idx) => ({
        experience_id: formExperience.id,
        original_text: stripLeadingBulletChars(b.original),
        translated_text: stripLeadingBulletChars(b.translated),
        sort_order: idx,
        status: 'accepted',
      }))

      const { error: bulletError } = await supabase.from('experience_bullets').insert(bulletsToInsert)

      if (bulletError) {
        console.error('Error saving bullets:', bulletError)
        alert('Failed to save bullets')
        return
      }

      // Refresh experiences
      const { data: updatedExp } = await supabase
        .from('experience')
        .select('*, experience_bullets(*)')
        .eq('user_id', userId)
        .order('sort_order')

      if (updatedExp) {
        onUpdate(updatedExp.map(exp => ({ ...exp, bullets: exp.experience_bullets })))
      }

      setShowBulletModal(false)
      onBulletsSaved?.()
    } finally {
      setSavingBullets(false)
    }
  }

  return (
    <CollapsibleSection
      title="Experience"
      icon="◫"
      actions={!adding && !editingId && (
        <button
          onClick={() => { setAdding(true); setFormExp(emptyExp) }}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-bg-primary font-heading font-semibold text-sm rounded-lg hover:bg-gold/90 transition-colors uppercase tracking-wider"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Experience
        </button>
      )}
    >
      <div className="space-y-4">
        {experiences.map((exp) => {
          const isExpanded = expandedExperiences.has(exp.id)
          const bullets = [...(exp.bullets || [])].sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          const visibleBullets = isExpanded ? bullets : bullets.slice(0, 3)
          const hiddenCount = bullets.length - 3
          const isEditing = editingId === exp.id

          const isCivilianExp = exp.employment_type === 'civilian'

          // If editing this experience, show the inline edit form
          if (isEditing) {
            return (
              <Card key={exp.id} className="p-4 bg-bg-tertiary border-gold">
                <div className="text-xs text-gold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Editing Experience
                </div>

                {/* Employment Type Toggle */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                    Employment Type
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormExp(prev => ({ ...prev, employment_type: 'military' }))}
                      className={`flex-1 px-4 py-2 rounded text-sm font-semibold transition-all ${
                        formExp.employment_type === 'military'
                          ? 'bg-gold text-bg-primary'
                          : 'bg-bg-secondary text-text-muted hover:text-text border border-border'
                      }`}
                    >
                      Military
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormExp(prev => ({ ...prev, employment_type: 'civilian' }))}
                      className={`flex-1 px-4 py-2 rounded text-sm font-semibold transition-all ${
                        formExp.employment_type === 'civilian'
                          ? 'bg-gold text-bg-primary'
                          : 'bg-bg-secondary text-text-muted hover:text-text border border-border'
                      }`}
                    >
                      Civilian
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                      {formExp.employment_type === 'military' ? 'Job Title (Military)' : 'Job Title'} *
                    </label>
                    <input
                      type="text"
                      value={formExp.job_title}
                      onChange={e => setFormExp({ ...formExp, job_title: e.target.value })}
                      placeholder={formExp.employment_type === 'military' ? 'e.g., Damage Controlman Chief' : 'e.g., Project Manager'}
                      className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                      {formExp.employment_type === 'military' ? 'Organization' : 'Company Name'} *
                    </label>
                    <input
                      type="text"
                      value={formExp.employment_type === 'military' ? formExp.organization : formExp.company_name}
                      onChange={e => setFormExp({
                        ...formExp,
                        [formExp.employment_type === 'military' ? 'organization' : 'company_name']: e.target.value
                      })}
                      placeholder={formExp.employment_type === 'military' ? 'e.g., USS Sterett (DDG-104)' : 'e.g., Acme Corporation'}
                      className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                      autoComplete="organization"
                    />
                  </div>
                </div>

                {formExp.employment_type === 'military' && formExp.job_title.length >= 2 && (
                  <div className="mt-4">
                    <CivilianTitleSuggestions
                      militaryTitle={formExp.job_title}
                      selectedTitle={formExp.civilian_title}
                      onSelect={(title) => setFormExp(prev => ({ ...prev, civilian_title: title }))}
                    />
                  </div>
                )}

                {formExp.employment_type === 'military' && (
                  <div className="mt-4">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                      Civilian Job Title (for resume)
                    </label>
                    <input
                      type="text"
                      value={formExp.civilian_title}
                      onChange={e => setFormExp({ ...formExp, civilian_title: e.target.value })}
                      placeholder="Select above or type your own"
                      className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                      autoComplete="off"
                    />
                    <p className="text-xs text-text-dim mt-1">This is what will appear on your resume</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">City</label>
                    <input
                      type="text"
                      value={formExp.city}
                      onChange={e => setFormExp({ ...formExp, city: e.target.value })}
                      placeholder="e.g., San Diego"
                      className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                      autoComplete="address-level2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">State</label>
                    <select
                      value={formExp.state}
                      onChange={e => setFormExp({ ...formExp, state: e.target.value })}
                      className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                      autoComplete="address-level1"
                    >
                      <option value="">Select State</option>
                      {US_STATES.map((state) => (
                        <option key={state.value} value={state.value}>{state.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Start Date</label>
                    <input
                      type="month"
                      value={formExp.start_date}
                      onChange={e => setFormExp({ ...formExp, start_date: e.target.value })}
                      className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">End Date</label>
                    <input
                      type="month"
                      value={formExp.end_date}
                      onChange={e => setFormExp({ ...formExp, end_date: e.target.value })}
                      disabled={formExp.is_current}
                      className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25 disabled:opacity-50"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex items-center pt-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formExp.is_current}
                        onChange={e => setFormExp({
                          ...formExp,
                          is_current: e.target.checked,
                          end_date: e.target.checked ? '' : formExp.end_date
                        })}
                        className="w-4 h-4 rounded border-border text-gold focus:ring-gold"
                      />
                      <span className="text-sm">Current Position</span>
                    </label>
                  </div>
                </div>

                {formExp.employment_type === 'military' && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <button
                    type="button"
                    onClick={() => setShowFederalFields(!showFederalFields)}
                    className="flex items-center gap-2 text-sm text-text-muted hover:text-gold transition-colors"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform ${showFederalFields ? 'rotate-90' : ''}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                    Federal Resume Fields (USAJOBS)
                  </button>

                  {showFederalFields && (
                    <div className="space-y-4 mt-4 p-4 bg-bg-secondary/50 rounded-lg border border-border/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Hours per Week</label>
                          <input
                            type="number"
                            value={formExp.hours_per_week}
                            onChange={e => setFormExp({ ...formExp, hours_per_week: parseInt(e.target.value) || 40 })}
                            placeholder="40"
                            min="1"
                            max="80"
                            className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                            autoComplete="off"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Series/Grade (if federal)</label>
                          <input
                            type="text"
                            value={formExp.grade_level}
                            onChange={e => setFormExp({ ...formExp, grade_level: e.target.value })}
                            placeholder="e.g., GS-12, E-8, WG-10"
                            className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                            autoComplete="off"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Salary (Optional)</label>
                          <input
                            type="text"
                            value={formExp.salaryDisplay}
                            onChange={e => {
                              const raw = e.target.value.replace(/[^0-9]/g, '')
                              setFormExp({ ...formExp, salaryDisplay: raw, salary: raw })
                            }}
                            onBlur={() => {
                              const parsed = parseSalary(formExp.salaryDisplay)
                              setFormExp({
                                ...formExp,
                                salaryDisplay: parsed ? formatSalary(parsed) : '',
                                salary: parsed ? String(parsed) : ''
                              })
                            }}
                            placeholder="$85,000"
                            className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                            autoComplete="off"
                          />
                        </div>
                      </div>
                      <div className="pt-3 border-t border-border/30">
                        <p className="text-xs text-text-dim mb-3">Supervisor Information (for federal applications)</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Supervisor Name</label>
                            <input
                              type="text"
                              value={formExp.supervisor_name}
                              onChange={e => setFormExp({ ...formExp, supervisor_name: e.target.value })}
                              placeholder="John Smith"
                              className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                              autoComplete="name"
                            />
                          </div>
                          <div>
                            <InternationalPhoneInput
                              label="Supervisor Phone"
                              value={formExp.supervisor_phone}
                              onChange={(value) => setFormExp({ ...formExp, supervisor_phone: value })}
                            />
                          </div>
                        </div>
                        <div className="mt-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formExp.supervisor_can_contact}
                              onChange={e => setFormExp({ ...formExp, supervisor_can_contact: e.target.checked })}
                              className="w-4 h-4 rounded border-border text-gold focus:ring-gold"
                            />
                            <span className="text-sm text-text-muted">May contact this supervisor</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                )}

                <div className="flex gap-2 mt-6">
                  <Button size="sm" onClick={handleSave}>Update</Button>
                  <Button size="sm" variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
                </div>
              </Card>
            )
          }

          return (
            <Card key={exp.id} className="p-4 bg-bg-tertiary">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold">{exp.civilian_title || exp.job_title}</span>
                    <span className={`px-2 py-0.5 text-xs rounded ${isCivilianExp ? 'bg-status-blue/20 text-status-blue' : 'bg-gold/20 text-gold'}`}>
                      {isCivilianExp ? 'Civilian' : 'Military'}
                    </span>
                  </div>
                  {!isCivilianExp && exp.civilian_title && exp.civilian_title !== exp.job_title && (
                    <div className="text-text-dim text-xs">Military: {exp.job_title}</div>
                  )}
                  <div className="text-text-muted text-sm">{exp.company_name || exp.organization}</div>
                  {exp.location && <div className="text-text-dim text-xs">{exp.location}</div>}
                  <div className="text-text-dim text-xs mt-1">
                    {formatDateForInput(exp.start_date)} — {exp.is_current ? 'Present' : formatDateForInput(exp.end_date)}
                  </div>
                  {(exp.hours_per_week || exp.grade_level) && (
                    <div className="text-text-dim text-xs mt-1">
                      {exp.hours_per_week && `${exp.hours_per_week} hrs/week`}
                      {exp.hours_per_week && exp.grade_level && ' • '}
                      {exp.grade_level && exp.grade_level}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {/* Move up/down buttons */}
                  <div className="flex flex-col -my-1 mr-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveExperience(exp.id, 'up')}
                      disabled={experiences.findIndex(e => e.id === exp.id) === 0}
                      title="Move up"
                      className="p-0.5 h-5"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveExperience(exp.id, 'down')}
                      disabled={experiences.findIndex(e => e.id === exp.id) === experiences.length - 1}
                      title="Move down"
                      className="p-0.5 h-5"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(exp)}
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(exp.id)}
                    title="Delete"
                  >
                    ✕
                  </Button>
                </div>
              </div>

              {/* Bullets */}
              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-text-dim uppercase tracking-wider">
                    Bullets ({bullets.length})
                  </p>
                  <p className="text-xs text-text-dim">
                    {bullets.length < 5 ? `${5 - bullets.length} more recommended` : bullets.length <= 6 ? 'Good count' : 'Consider trimming'}
                  </p>
                </div>

                {/* Action buttons row — Add Bullet + More dropdown */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <button
                    onClick={() => addBulletToExperience(exp.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-gold/20 text-gold border border-gold/30 rounded hover:bg-gold/30 transition-colors text-xs font-medium"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Bullet
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowMoreMenuForExp(showMoreMenuForExp === exp.id ? null : exp.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-bg-tertiary text-text-muted border border-border hover:border-gold/30 hover:text-text rounded transition-colors text-xs font-medium"
                    >
                      <span>⋮</span>
                      More
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showMoreMenuForExp === exp.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowMoreMenuForExp(null)} />
                        <div className="absolute left-0 top-full mt-1 z-20 bg-bg-card border border-border rounded-lg shadow-lg py-1 min-w-[180px]">
                          <button
                            onClick={() => { handleShowSuggestions(exp.id); setShowMoreMenuForExp(null) }}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-bg-hover transition-colors flex items-center gap-2"
                          >
                            <svg className="w-3.5 h-3.5 text-status-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <span>Suggest Bullets</span>
                            <span className="text-[10px] text-status-green ml-auto">Free</span>
                          </button>
                          <button
                            onClick={() => { setShowEvalUploadForExp(exp.id); setShowMoreMenuForExp(null) }}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-bg-hover transition-colors flex items-center gap-2"
                          >
                            <span>&#128196;</span>
                            <span>Import Eval</span>
                          </button>
                          <button
                            onClick={() => { setShowSuggestForExp(exp.id); setShowPasteBox(true); setShowMoreMenuForExp(null) }}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-bg-hover transition-colors flex items-center gap-2"
                          >
                            <span>&#128203;</span>
                            <span>Paste Eval</span>
                            <span className="text-[10px] text-status-green ml-auto">Free</span>
                          </button>
                          <div className="h-px bg-border mx-2 my-0.5" />
                          <button
                            onClick={() => { setShowTemplateForExp(exp.id); setShowMoreMenuForExp(null) }}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-bg-hover transition-colors flex items-center gap-2"
                          >
                            <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                            </svg>
                            <span>Use Template</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Bullet Suggestions Panel — 3 sections */}
                {showSuggestForExp === exp.id && (
                  <div className="mb-3 space-y-2">
                    {/* Section 1: From Your Evaluation */}
                    <div className="border border-gold/30 rounded-lg bg-bg-secondary overflow-hidden">
                      <div className="px-3 py-2 bg-gold/10 border-b border-gold/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gold uppercase tracking-wider">From Your Evaluation</span>
                          <span className="text-xs text-text-dim">Free — dictionary translation</span>
                        </div>
                        {evalSuggestions.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setEvalSuggestions([])}
                            className="text-[10px] text-text-dim hover:text-text-muted transition-colors"
                          >
                            Dismiss All
                          </button>
                        )}
                      </div>
                      {loadingSuggestions ? (
                        <div className="p-3 text-xs text-text-dim">Loading eval data...</div>
                      ) : evalSuggestions.length > 0 ? (
                        <div className="divide-y divide-border/50">
                          {evalSuggestions.map((es, i) => (
                            <div key={`eval-${i}`} className="px-3 py-2.5 hover:bg-bg-hover transition-colors">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-text-dim italic mb-1">{es.original}</p>
                                  <p className="text-sm text-text leading-relaxed">{es.translated}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setEvalSuggestions(prev => prev.filter((_, idx) => idx !== i))}
                                  className="flex-shrink-0 p-0.5 text-text-dim hover:text-text-muted transition-colors"
                                  title="Dismiss"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                              <div className="flex items-center gap-2 mt-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleUseSuggestion(exp.id, es.translated)}
                                  className="text-[11px] px-2 py-0.5 bg-gold/20 text-gold border border-gold/30 rounded hover:bg-gold/30 transition-colors"
                                >
                                  Use
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEditEvalBeforeUsing(exp.id, es.translated)}
                                  className="text-[11px] px-2 py-0.5 bg-bg-tertiary text-text-muted border border-border rounded hover:bg-bg-hover transition-colors"
                                >
                                  Edit before using
                                </button>
                                <span className="text-[10px] text-text-dim">{es.coverage}% dict coverage</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3">
                          <p className="text-xs text-text-dim mb-2">
                            {hasEvalData
                              ? 'No translatable statements found in your evaluations.'
                              : 'No evaluations found. Upload an eval or paste your eval text below.'}
                          </p>
                          {/* Paste eval text box */}
                          <button
                            type="button"
                            onClick={() => setShowPasteBox(!showPasteBox)}
                            className="text-xs text-gold hover:underline flex items-center gap-1"
                          >
                            Paste Eval Text {showPasteBox ? '\u25B2' : '\u25BC'}
                          </button>
                          {showPasteBox && (
                            <div className="mt-2 space-y-2">
                              <textarea
                                value={pasteText}
                                onChange={(e) => setPasteText(e.target.value)}
                                placeholder="Paste your evaluation write-up text here..."
                                className="w-full min-h-[80px] px-3 py-2 bg-bg-tertiary border border-border rounded text-sm resize-none focus:border-gold focus:ring-1 focus:ring-gold/25"
                                autoComplete="off"
                              />
                              <button
                                type="button"
                                onClick={handlePasteTranslate}
                                disabled={!pasteText.trim() || translatingPaste}
                                className="text-xs px-3 py-1.5 bg-gold/20 text-gold border border-gold/30 rounded hover:bg-gold/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                {translatingPaste ? 'Translating...' : 'Translate'}
                              </button>
                              {pasteSuggestions.length > 0 && (
                                <div className="border border-border/50 rounded overflow-hidden">
                                  <div className="flex items-center justify-between px-3 py-1.5 bg-bg-tertiary border-b border-border/50">
                                    <span className="text-[10px] text-text-dim">{pasteSuggestions.length} result{pasteSuggestions.length !== 1 ? 's' : ''}</span>
                                    <button
                                      type="button"
                                      onClick={() => setPasteSuggestions([])}
                                      className="text-[10px] text-text-dim hover:text-text-muted transition-colors"
                                    >
                                      Dismiss All
                                    </button>
                                  </div>
                                  <div className="divide-y divide-border/50">
                                    {pasteSuggestions.map((ps, i) => (
                                      <div key={`paste-${i}`} className="px-3 py-2.5 hover:bg-bg-hover transition-colors">
                                        <div className="flex items-start justify-between gap-2">
                                          <div className="flex-1 min-w-0">
                                            <p className="text-xs text-text-dim italic mb-1">{ps.original}</p>
                                            <p className="text-sm text-text leading-relaxed">{ps.translated}</p>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => setPasteSuggestions(prev => prev.filter((_, idx) => idx !== i))}
                                            className="flex-shrink-0 p-0.5 text-text-dim hover:text-text-muted transition-colors"
                                            title="Dismiss"
                                          >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                          </button>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1.5">
                                          <button
                                            type="button"
                                            onClick={() => handleUseSuggestion(exp.id, ps.translated)}
                                            className="text-[11px] px-2 py-0.5 bg-gold/20 text-gold border border-gold/30 rounded hover:bg-gold/30 transition-colors"
                                          >
                                            Use
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleEditEvalBeforeUsing(exp.id, ps.translated)}
                                            className="text-[11px] px-2 py-0.5 bg-bg-tertiary text-text-muted border border-border rounded hover:bg-bg-hover transition-colors"
                                          >
                                            Edit before using
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Section 2: General Templates */}
                    <div className="border border-status-green/30 rounded-lg bg-bg-secondary overflow-hidden">
                      <div className="px-3 py-2 bg-status-green/10 border-b border-status-green/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-status-green uppercase tracking-wider">General Templates</span>
                          <span className="text-xs text-text-dim">Free — no AI cost</span>
                        </div>
                        {suggestions.length > 0 && (
                          <button
                            type="button"
                            onClick={() => { setSuggestions([]); setShowSuggestForExp(null) }}
                            className="text-[10px] text-text-dim hover:text-text-muted transition-colors"
                          >
                            Dismiss All
                          </button>
                        )}
                      </div>
                      {loadingSuggestions ? (
                        <div className="p-3 text-xs text-text-dim">Loading templates...</div>
                      ) : suggestions.length === 0 ? (
                        <div className="p-3 text-xs text-text-dim">No matching bullet patterns found for this role.</div>
                      ) : (
                        <div className="divide-y divide-border/50">
                          {suggestions.map((s, i) => (
                            <div
                              key={s.pattern.id || i}
                              className="px-3 py-2.5 hover:bg-bg-hover transition-colors group/sug"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleUseSuggestion(exp.id, s.populated)}
                                  className="flex-1 text-left"
                                >
                                  <p className="text-sm text-text-secondary group-hover/sug:text-text leading-relaxed">{s.populated}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] px-1.5 py-0.5 bg-bg-tertiary text-text-dim rounded">{s.pattern.category}</span>
                                    {s.pattern.rank_tier && (
                                      <span className="text-[10px] px-1.5 py-0.5 bg-bg-tertiary text-text-dim rounded">{s.pattern.rank_tier.replace(/_/g, ' ')}</span>
                                    )}
                                    <span className="text-xs text-status-green opacity-0 group-hover/sug:opacity-100 transition-opacity">Use</span>
                                  </div>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSuggestions(prev => prev.filter((_, idx) => idx !== i))}
                                  className="flex-shrink-0 p-0.5 text-text-dim hover:text-text-muted transition-colors"
                                  title="Dismiss"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {bullets.length > 0 ? (
                  <>
                    <ul className="space-y-2">
                      {visibleBullets.map((bullet: any) => (
                        <li key={bullet.id} className="group">
                          {editingBulletId === bullet.id ? (
                            // Editing mode
                            <div className="flex flex-col gap-2 p-3 bg-bg-tertiary rounded-lg">
                              <div className="relative">
                                <textarea
                                  value={editingBulletText}
                                  onChange={(e) => setEditingBulletText(e.target.value)}
                                  className="w-full bg-bg-secondary border border-border rounded px-3 py-2 pr-10 text-text text-sm resize-none focus:border-gold focus:ring-1 focus:ring-gold/25"
                                  rows={3}
                                  autoFocus
                                  autoComplete="off"
                                />
                                {speechSupported && (
                                  <button
                                    type="button"
                                    onClick={() => startVoiceInput(bullet.id)}
                                    className={`absolute right-2 top-2 p-1.5 rounded-md transition-all ${
                                      recordingBulletId === bullet.id
                                        ? 'bg-status-red/20 text-status-red animate-pulse ring-2 ring-status-red/40'
                                        : 'bg-bg-tertiary text-text-muted hover:text-gold hover:bg-gold/10'
                                    }`}
                                    title={recordingBulletId === bullet.id ? 'Click to stop recording' : 'Dictate your bullet'}
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-14 0m7 7v4m-4 0h8M12 1a3 3 0 00-3 3v7a3 3 0 006 0V4a3 3 0 00-3-3z" />
                                    </svg>
                                    {recordingBulletId === bullet.id && (
                                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-status-red rounded-full animate-ping" />
                                    )}
                                  </button>
                                )}
                              </div>
                              {recordingBulletId === bullet.id && (
                                <p className="text-xs text-status-red animate-pulse">Recording... speak now. Click mic to stop.</p>
                              )}
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={cancelEditBullet}
                                  className="px-3 py-1 text-sm text-text-muted hover:text-text"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => saveEditBullet(bullet.id, exp.id)}
                                  className="px-3 py-1 text-sm bg-gold text-bg-primary rounded hover:bg-gold/90"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            // Display mode
                            <div>
                              <div className="flex items-start gap-1">
                                {/* Bullet reorder buttons */}
                                <div className="flex flex-col -my-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => moveBullet(bullet.id, exp.id, 'up')}
                                    disabled={bullets.findIndex((b: any) => b.id === bullet.id) === 0}
                                    className="p-0 h-3.5 text-text-dim hover:text-gold disabled:opacity-20 disabled:hover:text-text-dim transition-colors"
                                    title="Move up"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => moveBullet(bullet.id, exp.id, 'down')}
                                    disabled={bullets.findIndex((b: any) => b.id === bullet.id) === bullets.length - 1}
                                    className="p-0 h-3.5 text-text-dim hover:text-gold disabled:opacity-20 disabled:hover:text-text-dim transition-colors"
                                    title="Move down"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </button>
                                </div>
                                <span className="text-gold mt-0.5 flex-shrink-0">•</span>
                                <span className="flex-1 text-sm text-text-muted">{bullet.translated_text || bullet.original_text}</span>
                                {bulletSources[bullet.id] === 'dictionary' && (
                                  <span className="flex-shrink-0 text-[10px] px-1.5 py-0.5 bg-status-green/20 text-status-green rounded" title="Dictionary translated — no AI cost">Dict</span>
                                )}
                                {bulletSources[bullet.id] === 'ai' && (
                                  <span className="flex-shrink-0 text-[10px] px-1.5 py-0.5 bg-status-amber/20 text-status-amber rounded" title="AI translated">AI</span>
                                )}
                                <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {speechSupported && (
                                    <button
                                      onClick={() => {
                                        startEditBullet(bullet.id, bullet.translated_text || bullet.original_text)
                                        // Start voice input after a tick so edit mode renders first
                                        setTimeout(() => startVoiceInput(bullet.id), 100)
                                      }}
                                      className="p-1 text-text-muted hover:text-status-amber"
                                      title="Dictate your bullet"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-14 0m7 7v4m-4 0h8M12 1a3 3 0 00-3 3v7a3 3 0 006 0V4a3 3 0 00-3-3z" />
                                      </svg>
                                    </button>
                                  )}
                                  <button
                                    onClick={() => startEditBullet(bullet.id, bullet.translated_text || bullet.original_text)}
                                    className="p-1 text-text-muted hover:text-text"
                                    title="Edit"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => deleteBullet(bullet.id, exp.id)}
                                    className="p-1 text-text-muted hover:text-status-red"
                                    title="Delete"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>

                              {/* Translate to Civilian button — always visible below bullet */}
                              {(bullet.translated_text || bullet.original_text) && (bullet.translated_text || bullet.original_text) !== 'New bullet - click to edit' && (
                                <div className="ml-6 mt-1.5">
                                  <button
                                    onClick={() => translateBullet(bullet.id, exp.id)}
                                    disabled={translatingBulletId === bullet.id || localTranslationRemaining <= 0}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
                                      localTranslationRemaining <= 0
                                        ? 'bg-bg-secondary text-text-dim border border-border opacity-50 cursor-not-allowed'
                                        : bullet.original_text && bullet.translated_text && bullet.original_text !== bullet.translated_text
                                          ? 'bg-bg-secondary text-text-dim border border-border hover:text-status-amber hover:border-status-amber/30'
                                          : 'bg-status-amber-dim text-status-amber border border-status-amber/30 hover:bg-status-amber/20'
                                    }`}
                                    title="Convert military language to civilian-friendly wording"
                                  >
                                    {translatingBulletId === bullet.id ? (
                                      <>
                                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                        </svg>
                                        Translating...
                                      </>
                                    ) : localTranslationRemaining <= 0 ? (
                                      'Limit Reached'
                                    ) : (
                                      <>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                        </svg>
                                        {bullet.original_text && bullet.translated_text && bullet.original_text !== bullet.translated_text
                                          ? 'Re-translate'
                                          : 'Translate to Civilian'}
                                      </>
                                    )}
                                  </button>
                                </div>
                              )}

                              {/* Translation suggestion */}
                              {translationResult?.bulletId === bullet.id && (
                                <div className={`ml-6 mt-1.5 p-3 ${translationResult.alreadyCivilian ? 'bg-status-green/10 border border-status-green/30' : 'bg-status-green/10 border border-status-green/20'} rounded text-sm`}>
                                  {translationResult.alreadyCivilian ? (
                                    <>
                                      <p className="text-status-green font-medium">{translationResult.alreadyCivilianMessage || 'Already civilian-ready — no translation needed'}</p>
                                      <div className="flex gap-2 mt-2">
                                        <button
                                          onClick={dismissTranslation}
                                          className="px-3 py-1 text-xs bg-status-green text-bg-primary rounded hover:bg-status-green/90"
                                        >
                                          Accept
                                        </button>
                                        <button
                                          onClick={dismissTranslation}
                                          className="px-3 py-1 text-xs text-text-dim hover:text-text-muted"
                                        >
                                          Dismiss
                                        </button>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="flex items-center gap-2 mb-1">
                                        <p className="text-status-green text-xs uppercase tracking-wider font-semibold">Suggested Translation</p>
                                        {bulletSources[bullet.id] === 'dictionary' && (
                                          <span className="text-[10px] px-1.5 py-0.5 bg-status-green/20 text-status-green rounded">Dictionary — free</span>
                                        )}
                                        {bulletSources[bullet.id] === 'ai' && (
                                          <span className="text-[10px] px-1.5 py-0.5 bg-status-amber/20 text-status-amber rounded">AI enhanced</span>
                                        )}
                                      </div>
                                      <p className="text-text">{translationResult!.translated}</p>
                                      <div className="flex gap-2 mt-2">
                                        <button
                                          onClick={() => acceptTranslation(bullet.id, exp.id)}
                                          className="px-3 py-1 text-xs bg-status-green text-bg-primary rounded hover:bg-status-green/90"
                                        >
                                          Accept
                                        </button>
                                        <button
                                          onClick={() => { startEditBullet(bullet.id, translationResult!.translated); setTranslationResult(null) }}
                                          className="px-3 py-1 text-xs bg-bg-secondary text-text-muted border border-border rounded hover:text-text"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={dismissTranslation}
                                          className="px-3 py-1 text-xs text-text-dim hover:text-text-muted"
                                        >
                                          Dismiss
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}

                              {/* Suggest a correction — shown on dictionary-translated bullets */}
                              {translationResult?.bulletId === bullet.id && !translationResult.alreadyCivilian && (
                                <div className="ml-6 mt-1">
                                  {correctionSuccess === bullet.id ? (
                                    <p className="text-xs text-status-green">Thanks! Every correction helps keep Debriefed free for all veterans.</p>
                                  ) : correctionBulletId === bullet.id ? (
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <input
                                        type="text"
                                        value={correctionMilitary}
                                        onChange={(e) => setCorrectionMilitary(e.target.value)}
                                        placeholder="e.g. CSMP"
                                        className="px-2 py-1 text-xs bg-bg-secondary border border-border rounded w-32 focus:border-gold focus:ring-1 focus:ring-gold/25"
                                        autoComplete="off"
                                      />
                                      <input
                                        type="text"
                                        value={correctionCivilian}
                                        onChange={(e) => setCorrectionCivilian(e.target.value)}
                                        placeholder="e.g. maintenance backlog"
                                        className="px-2 py-1 text-xs bg-bg-secondary border border-border rounded w-44 focus:border-gold focus:ring-1 focus:ring-gold/25"
                                        autoComplete="off"
                                      />
                                      <button
                                        type="button"
                                        disabled={correctionSubmitting || !correctionMilitary.trim() || !correctionCivilian.trim()}
                                        onClick={async () => {
                                          setCorrectionSubmitting(true)
                                          await submitTerm({
                                            submission_type: 'phrase',
                                            military_term: correctionMilitary.trim(),
                                            suggested_civilian: correctionCivilian.trim(),
                                            branch: userBranch || 'general',
                                            category: 'phrase_translation',
                                          })
                                          setCorrectionSubmitting(false)
                                          setCorrectionBulletId(null)
                                          setCorrectionMilitary('')
                                          setCorrectionCivilian('')
                                          setCorrectionSuccess(bullet.id)
                                          setTimeout(() => setCorrectionSuccess(null), 3000)
                                        }}
                                        className="px-2 py-1 text-xs bg-gold text-bg-primary rounded hover:bg-gold-bright disabled:opacity-50"
                                      >
                                        {correctionSubmitting ? '...' : 'Submit'}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => { setCorrectionBulletId(null); setCorrectionMilitary(''); setCorrectionCivilian('') }}
                                        className="text-xs text-text-dim hover:text-text-muted"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <p className="text-xs text-gray-400 hover:text-gold cursor-pointer mt-1" onClick={() => setCorrectionBulletId(bullet.id)}>
                                      See something wrong? <span className="underline">Suggest a correction</span>
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* Translation error */}
                              {translateError && translatingBulletId === null && !translationResult && (
                                <div className="ml-6 mt-1 text-xs text-status-red">
                                  {translateError}
                                </div>
                              )}

                              {/* Help Translate prompt for low-coverage bullets */}
                              {helpPromptBulletId === bullet.id && helpPromptPhrase && (
                                <HelpTranslatePrompt
                                  unmatchedPhrase={helpPromptPhrase}
                                  branch={userBranch || undefined}
                                  onDismiss={() => {
                                    setHelpPromptBulletId(null)
                                    setHelpPromptPhrase('')
                                  }}
                                />
                              )}

                              {/* Upgrade nudge for free users after dictionary-only translation */}
                              {upgradeNudgeBulletId === bullet.id && isFreeUser && (
                                <p className="text-xs text-text-dim mt-1.5 ml-6">
                                  Dictionary translation applied.{' '}
                                  <UpgradeLink className="text-gold hover:text-gold-bright hover:underline">Upgrade to Core</UpgradeLink>
                                  {' '}for AI-enhanced translations.
                                </p>
                              )}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>

                    {/* Expand/Collapse Button */}
                    {bullets.length > 3 && (
                      <button
                        onClick={() => toggleExpand(exp.id)}
                        className="mt-3 text-xs text-gold hover:text-gold-bright hover:underline flex items-center gap-1 transition-all"
                      >
                        {isExpanded ? (
                          <>
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="18 15 12 9 6 15"/>
                            </svg>
                            Show less
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="6 9 12 15 18 9"/>
                            </svg>
                            Show {hiddenCount} more bullet{hiddenCount > 1 ? 's' : ''}
                          </>
                        )}
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-text-dim italic">No bullets yet. Add from evaluations or manually.</p>
                )}
              </div>
            </Card>
          )
        })}

        {adding && (
          <Card className="p-4 bg-bg-tertiary border-gold/30">
            {/* Employment Type Toggle */}
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Employment Type
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormExp(prev => ({ ...prev, employment_type: 'military' }))}
                  className={`flex-1 px-4 py-2 rounded text-sm font-semibold transition-all ${
                    formExp.employment_type === 'military'
                      ? 'bg-gold text-bg-primary'
                      : 'bg-bg-secondary text-text-muted hover:text-text border border-border'
                  }`}
                >
                  Military
                </button>
                <button
                  type="button"
                  onClick={() => setFormExp(prev => ({ ...prev, employment_type: 'civilian' }))}
                  className={`flex-1 px-4 py-2 rounded text-sm font-semibold transition-all ${
                    formExp.employment_type === 'civilian'
                      ? 'bg-gold text-bg-primary'
                      : 'bg-bg-secondary text-text-muted hover:text-text border border-border'
                  }`}
                >
                  Civilian
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  {formExp.employment_type === 'military' ? 'Job Title (Military)' : 'Job Title'} *
                </label>
                <input
                  type="text"
                  value={formExp.job_title}
                  onChange={e => setFormExp({ ...formExp, job_title: e.target.value })}
                  placeholder={formExp.employment_type === 'military' ? 'e.g., Damage Controlman Chief' : 'e.g., Project Manager'}
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  {formExp.employment_type === 'military' ? 'Organization' : 'Company Name'} *
                </label>
                <input
                  type="text"
                  value={formExp.employment_type === 'military' ? formExp.organization : formExp.company_name}
                  onChange={e => setFormExp({
                    ...formExp,
                    [formExp.employment_type === 'military' ? 'organization' : 'company_name']: e.target.value
                  })}
                  placeholder={formExp.employment_type === 'military' ? 'e.g., USS Sterett (DDG-104)' : 'e.g., Acme Corporation'}
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                  autoComplete="organization"
                />
              </div>
            </div>

            {formExp.employment_type === 'military' && formExp.job_title.length >= 2 && (
              <div className="mt-4">
                <CivilianTitleSuggestions
                  militaryTitle={formExp.job_title}
                  selectedTitle={formExp.civilian_title}
                  onSelect={(title) => setFormExp(prev => ({ ...prev, civilian_title: title }))}
                />
              </div>
            )}

            {formExp.employment_type === 'military' && (
              <div className="mt-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Civilian Job Title (for resume)
                </label>
                <input
                  type="text"
                  value={formExp.civilian_title}
                  onChange={e => setFormExp({ ...formExp, civilian_title: e.target.value })}
                  placeholder="Select above or type your own"
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                  autoComplete="off"
                />
                <p className="text-xs text-text-dim mt-1">This is what will appear on your resume</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">City</label>
                <input
                  type="text"
                  value={formExp.city}
                  onChange={e => setFormExp({ ...formExp, city: e.target.value })}
                  placeholder="e.g., San Diego"
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                  autoComplete="address-level2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">State</label>
                <select
                  value={formExp.state}
                  onChange={e => setFormExp({ ...formExp, state: e.target.value })}
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                  autoComplete="address-level1"
                >
                  <option value="">Select State</option>
                  {US_STATES.map((state) => (
                    <option key={state.value} value={state.value}>{state.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Start Date</label>
                <input
                  type="month"
                  value={formExp.start_date}
                  onChange={e => setFormExp({ ...formExp, start_date: e.target.value })}
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">End Date</label>
                <input
                  type="month"
                  value={formExp.end_date}
                  onChange={e => setFormExp({ ...formExp, end_date: e.target.value })}
                  disabled={formExp.is_current}
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25 disabled:opacity-50"
                  autoComplete="off"
                />
              </div>
              <div className="flex items-center pt-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formExp.is_current}
                    onChange={e => setFormExp({
                      ...formExp,
                      is_current: e.target.checked,
                      end_date: e.target.checked ? '' : formExp.end_date
                    })}
                    className="w-4 h-4 rounded border-border text-gold focus:ring-gold"
                  />
                  <span className="text-sm">Current Position</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button size="sm" onClick={handleSave}>Save</Button>
              <Button size="sm" variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
            </div>
          </Card>
        )}

        {experiences.length === 0 && !adding && !editingId && (
          <p className="text-text-muted text-center py-8">No experience added yet</p>
        )}
      </div>

      {/* Bullet Assignment Modal */}
      <BulletAssignmentModal
        isOpen={showBulletModal && pendingBullets.length > 0}
        onClose={() => {
          setShowBulletModal(false)
          onBulletsSaved?.()
        }}
        bullets={pendingBullets}
        experiences={experiences.map(exp => ({
          id: exp.id,
          job_title: exp.job_title,
          organization: exp.organization,
          start_date: exp.start_date,
          end_date: exp.end_date,
        }))}
        onAssign={saveBulletsToExperience}
        onCreate={createExperienceWithBullets}
        saving={savingBullets}
      />

      {/* Eval Upload Modal for specific experience */}
      {showEvalUploadForExp && (
        <EvalUploadModal
          isOpen={true}
          onClose={() => setShowEvalUploadForExp(null)}
          onExtracted={() => {
            // This won't be called since we have an experience pre-selected
          }}
          onBulletsSaved={async () => {
            // Refresh experiences to show new bullets
            const { data: updatedExp } = await supabase
              .from('experience')
              .select('*, experience_bullets(*)')
              .eq('user_id', userId)
              .order('sort_order')

            if (updatedExp) {
              onUpdate(updatedExp.map(exp => ({ ...exp, bullets: exp.experience_bullets })))
            }
            setShowEvalUploadForExp(null)
          }}
          userId={userId}
          experiences={experiences.map(exp => ({
            id: exp.id,
            job_title: exp.job_title,
            organization: exp.organization,
            start_date: exp.start_date,
            end_date: exp.end_date,
          }))}
          defaultExperienceId={showEvalUploadForExp}
        />
      )}

      {/* Bulk Paste Modal */}
      {showBulkPasteForExp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg p-6">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gold mb-4">Paste Multiple Bullets</h3>
            <p className="text-text-muted text-sm mb-3">Paste your bullets below, one per line. Leading bullet characters (-, *, etc.) will be removed automatically.</p>
            <textarea
              value={bulkPasteText}
              onChange={(e) => {
                setBulkPasteText(e.target.value)
                setBulkPastePreview(null)
              }}
              className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-text text-sm resize-none focus:border-gold focus:ring-1 focus:ring-gold/25"
              rows={8}
              placeholder={"- Managed a team of 15 personnel\n- Conducted daily safety inspections\n- Trained 50+ junior staff members"}
              autoFocus
              autoComplete="off"
            />
            {bulkPastePreview && (
              <div className="mt-3 p-3 bg-bg-tertiary rounded border border-border">
                <p className="text-xs text-gold uppercase tracking-wider mb-2">
                  Found {bulkPastePreview.length} bullet{bulkPastePreview.length !== 1 ? 's' : ''}
                </p>
                <ul className="space-y-1 max-h-40 overflow-y-auto">
                  {bulkPastePreview.map((line, i) => (
                    <li key={i} className="flex items-start gap-1 text-sm text-text-muted">
                      <span className="text-gold flex-shrink-0">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex gap-2 mt-4 justify-end">
              <button
                onClick={() => { setShowBulkPasteForExp(null); setBulkPasteText(''); setBulkPastePreview(null) }}
                className="px-4 py-2 text-sm text-text-muted hover:text-text"
              >
                Cancel
              </button>
              {!bulkPastePreview ? (
                <button
                  onClick={() => {
                    const parsed = parseBulkPaste(bulkPasteText)
                    if (parsed.length === 0) {
                      alert('No bullets found. Enter one bullet per line.')
                      return
                    }
                    setBulkPastePreview(parsed)
                  }}
                  disabled={!bulkPasteText.trim()}
                  className="px-4 py-2 text-sm bg-gold text-bg-primary rounded hover:bg-gold/90 disabled:opacity-50"
                >
                  Preview
                </button>
              ) : (
                <button
                  onClick={() => handleBulkPasteSubmit(showBulkPasteForExp)}
                  className="px-4 py-2 text-sm bg-status-green text-bg-primary rounded hover:bg-status-green/90"
                >
                  Add {bulkPastePreview.length} Bullet{bulkPastePreview.length !== 1 ? 's' : ''}
                </button>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Bullet Template Modal */}
      <BulletTemplateModal
        isOpen={showTemplateForExp !== null}
        onClose={() => setShowTemplateForExp(null)}
        onSelect={handleTemplateSelect}
      />

      {/* Last Use Warning for Translation */}
      {showTranslateWarning && (
        <LastUseWarningModal
          featureName="Bullet Translation"
          tier={(bulletTranslationUsage?.limit === 10 ? 'free' : bulletTranslationUsage?.limit === 50 ? 'core' : 'full') as any}
          limitType="tier"
          onContinue={handleTranslateWarningContinue}
        />
      )}
    </CollapsibleSection>
  )
}

// ============================================================================
// Eval text translation helpers
// ============================================================================

// Eval parsing moved to src/lib/dictionary/evalParser.ts (parseAndTranslateEvalText)

// ============================================================================
// Dictionary helpers for bullet suggestions (same pattern as ResumeForm.tsx)
// ============================================================================

function getRankTierFromPaygrade(paygrade?: string): string | null {
  if (!paygrade) return null
  const pg = paygrade.toUpperCase().trim()
  if (/^E-?[1-3]$/.test(pg)) return 'junior_enlisted'
  if (/^E-?[4-6]$/.test(pg)) return 'nco'
  if (/^E-?[7-9]$/.test(pg)) return 'senior_nco'
  if (/^(W-?[1-5]|CW[1-5])$/.test(pg)) return 'warrant'
  if (/^O-?[1-3]$/.test(pg)) return 'junior_officer'
  if (/^O-?[4-6]$/.test(pg)) return 'senior_officer'
  if (/^O-?[7-9]|O-?10$/.test(pg)) return 'flag_officer'
  return null
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  leadership: ['manager', 'supervisor', 'director', 'lead', 'chief', 'commander', 'officer', 'ncoic', 'oic', 'superintendent', 'executive', 'head', 'deputy', 'assistant'],
  technical: ['technician', 'engineer', 'developer', 'analyst', 'specialist', 'systems', 'it', 'cyber', 'network', 'maintenance', 'programmer', 'architect', 'data', 'software'],
  operations: ['operations', 'logistics', 'supply', 'planning', 'coordinator', 'program', 'project', 'mission', 'watch'],
  combat: ['infantry', 'combat', 'weapons', 'gunner', 'tactical', 'security', 'force protection', 'military police', 'mp'],
  medical: ['medic', 'nurse', 'corpsman', 'medical', 'health', 'dental', 'clinical', 'physician', 'paramedic'],
  training: ['instructor', 'trainer', 'training', 'education', 'mentor', 'drill'],
  communications: ['communications', 'signal', 'radio', 'intelligence', 'sigint', 'comint', 'cryptologic'],
  administrative: ['personnel', 'human resources', 'admin', 'finance', 'budget', 'pay', 'legal', 'jag', 'clerk', 'yeoman'],
  project_management: ['program', 'project', 'portfolio', 'pmo'],
  financial: ['budget', 'finance', 'comptroller', 'fiscal', 'accounting', 'audit'],
  safety: ['safety', 'osha', 'damage control', 'dc', 'environmental', 'compliance'],
  logistics: ['logistics', 'supply', 'warehouse', 'inventory', 'shipping', 'transportation', 'distribution'],
  analytical: ['analyst', 'intelligence', 'research', 'data', 'assessment', 'evaluation'],
  healthcare: ['medic', 'nurse', 'corpsman', 'medical', 'health', 'dental', 'clinical', 'physician'],
}

function scoreBulletPattern(
  pattern: DictBulletPattern,
  jobTitle: string,
  rankTier: string | null,
): number {
  let score = 0
  const titleLower = jobTitle.toLowerCase()
  const patternCategory = (pattern.category || '').toLowerCase()

  const keywords = CATEGORY_KEYWORDS[patternCategory] || []
  for (const kw of keywords) {
    if (titleLower.includes(kw)) { score += 3; break }
  }

  if (titleLower.includes(patternCategory)) score += 2

  if (pattern.rank_tier && rankTier) {
    if (pattern.rank_tier.toLowerCase() === rankTier) score += 2
  } else if (!pattern.rank_tier) {
    score += 1
  }

  // Every military role has leadership and operations — small universal boost
  if (patternCategory === 'leadership' || patternCategory === 'operations') {
    score += 1
  }

  // Randomization jitter so tied scores shuffle each time
  score += Math.random() * 0.9

  return score
}

/** Select top suggestions with category diversity (max 2 per category) */
function selectDiverseSuggestions(
  scored: { pattern: DictBulletPattern; score: number }[],
  count: number,
): { pattern: DictBulletPattern; score: number }[] {
  const sorted = [...scored].sort((a, b) => b.score - a.score)
  const selected: { pattern: DictBulletPattern; score: number }[] = []
  const categoryCounts: Record<string, number> = {}

  for (const item of sorted) {
    if (selected.length >= count) break
    const cat = (item.pattern.category || 'general').toLowerCase()
    const catCount = categoryCounts[cat] || 0
    if (catCount < 2) {
      selected.push(item)
      categoryCounts[cat] = catCount + 1
    }
  }

  if (selected.length < count) {
    for (const item of sorted) {
      if (selected.length >= count) break
      if (!selected.includes(item)) {
        selected.push(item)
      }
    }
  }

  return selected
}

/** Context for populating bullet suggestions with real data */
interface BulletPopulateContext {
  branch: string
  paygrade: string
  yearsOfService: string | number
  jobTitle: string
  civilianTitle: string
  organization: string
  category: string
  suggestionIndex: number
}

/** Pick a strong action verb from dictionary, rotating by suggestion index */
function pickActionVerb(dict: DictionaryCache, category: string, index: number): string {
  const FALLBACK_VERBS: Record<string, string[]> = {
    leadership: ['Directed', 'Led', 'Managed', 'Supervised', 'Oversaw'],
    technical: ['Engineered', 'Developed', 'Implemented', 'Configured', 'Designed'],
    operations: ['Coordinated', 'Streamlined', 'Executed', 'Managed', 'Orchestrated'],
    combat: ['Commanded', 'Led', 'Executed', 'Coordinated', 'Directed'],
    medical: ['Administered', 'Provided', 'Managed', 'Coordinated', 'Delivered'],
    training: ['Trained', 'Developed', 'Instructed', 'Mentored', 'Facilitated'],
    communications: ['Managed', 'Maintained', 'Configured', 'Monitored', 'Secured'],
    administrative: ['Managed', 'Processed', 'Coordinated', 'Administered', 'Oversaw'],
  }

  const catLower = category.toLowerCase()
  const matching = (dict.actionVerbs ?? []).filter(v => {
    const vCat = v.category?.toLowerCase() || ''
    const bestFor = (v.best_for || []).map(b => b.toLowerCase())
    return vCat === catLower || vCat.includes(catLower) ||
      bestFor.some(b => b === catLower || b.includes(catLower))
  })

  const strong = matching.filter(v => v.strength?.toLowerCase() === 'strong')
  const pool = strong.length >= 3 ? strong : matching.length >= 3 ? matching : []

  if (pool.length > 0) {
    const verb = pool[index % pool.length].verb
    return verb.charAt(0).toUpperCase() + verb.slice(1)
  }

  const fallback = FALLBACK_VERBS[catLower] || FALLBACK_VERBS.leadership
  return fallback[index % fallback.length]
}

/** Look up typical team size from rank equivalents by paygrade */
function getTeamSize(dict: DictionaryCache, paygrade: string, branch: string): string {
  if (!paygrade) return '10'
  const pg = paygrade.toUpperCase().trim()
  const brLower = branch.toLowerCase()
  const match = (dict.rankEquivalents ?? []).find(r =>
    r.paygrade.toUpperCase().trim() === pg &&
    r.branch.toLowerCase().includes(brLower)
  )
  if (match?.typical_team_size) return match.typical_team_size
  if (/^E-?[1-3]$/.test(pg)) return '4'
  if (/^E-?[4-6]$/.test(pg)) return '12'
  if (/^E-?[7-9]$/.test(pg)) return '35'
  if (/^O-?[1-3]$/.test(pg)) return '40'
  if (/^O-?[4-6]$/.test(pg)) return '150'
  if (/^O-?[7-9]|O-?10$/.test(pg)) return '500'
  if (/^(W-?[1-5]|CW[1-5])$/.test(pg)) return '20'
  return '10'
}

/** Derive team/personnel description from branch and category */
function getTeamDescription(branch: string, category: string, jobTitle: string): string {
  const catLower = category.toLowerCase()
  const brLower = branch.toLowerCase()

  const teamTypes: Record<string, string> = {
    technical: 'technical specialists',
    operations: 'operations personnel',
    combat: brLower.includes('navy') ? 'Sailors' : brLower.includes('marine') ? 'Marines' : brLower.includes('air') ? 'Airmen' : 'Soldiers',
    medical: 'healthcare professionals',
    training: 'training cadre',
    communications: 'communications specialists',
    administrative: 'administrative staff',
    leadership: 'cross-functional team members',
  }

  if (jobTitle.toLowerCase().includes('maintenance')) return 'maintenance technicians'
  if (jobTitle.toLowerCase().includes('supply') || jobTitle.toLowerCase().includes('logistics')) return 'supply chain personnel'
  if (jobTitle.toLowerCase().includes('intelligence')) return 'intelligence analysts'
  if (jobTitle.toLowerCase().includes('medical') || jobTitle.toLowerCase().includes('corpsman')) return 'medical staff'

  return teamTypes[catLower] || 'team members'
}

/** Derive a function description from job title */
function getFunctionDescription(jobTitle: string, category: string): string {
  const titleLower = jobTitle.toLowerCase()
  if (titleLower.includes('maintenance')) return 'equipment maintenance and repair operations'
  if (titleLower.includes('supply') || titleLower.includes('logistics')) return 'supply chain and logistics operations'
  if (titleLower.includes('intelligence')) return 'intelligence collection and analysis'
  if (titleLower.includes('communications') || titleLower.includes('signal')) return 'communications infrastructure and security'
  if (titleLower.includes('medical') || titleLower.includes('corpsman')) return 'patient care and medical readiness'
  if (titleLower.includes('training') || titleLower.includes('instructor')) return 'training program development and execution'
  if (titleLower.includes('admin') || titleLower.includes('personnel')) return 'administrative operations and personnel management'
  if (titleLower.includes('security') || titleLower.includes('force protection')) return 'physical security and force protection'
  if (titleLower.includes('finance') || titleLower.includes('budget')) return 'financial management and budget execution'

  const catDefaults: Record<string, string> = {
    leadership: 'mission-critical operations',
    technical: 'technical operations and system maintenance',
    operations: 'daily operational planning and execution',
    combat: 'tactical operations and combat readiness',
    medical: 'healthcare delivery and medical readiness',
    training: 'personnel development and training programs',
    communications: 'communications systems and information security',
    administrative: 'administrative operations and resource management',
  }
  return catDefaults[category.toLowerCase()] || 'operational planning and execution'
}

/** Get a realistic quantified result by category */
function getQuantifiedResult(category: string, index: number): string {
  const results: Record<string, string[]> = {
    leadership: ['98% mission readiness rating', 'zero safety incidents over 18-month period', '25% improvement in team performance metrics', '100% on-time delivery of mission objectives', 'unit selection for organizational excellence award'],
    technical: ['99.8% system uptime across all platforms', '40% reduction in equipment downtime', '30% improvement in maintenance cycle time', '$2.1M in equipment maintained at full operational status', 'zero critical system failures during deployment'],
    operations: ['15% improvement in operational efficiency', '100% accountability of $5M+ in assets', '30% reduction in processing time', '98% on-time delivery rate', 'streamlined workflow reducing backlog by 45%'],
    combat: ['100% personnel accountability during operations', '98% mission success rate', 'zero safety violations across 200+ operations', 'qualified 100% of personnel on assigned weapons systems', 'maintained combat readiness at 95% or above'],
    medical: ['treated 500+ patients with 99% positive outcomes', '30% reduction in patient wait times', '100% compliance with medical readiness standards', 'maintained 98% medical supply availability', 'zero preventable adverse events'],
    training: ['trained 200+ personnel with 95% qualification rate', '30% improvement in first-time pass rates', 'developed curriculum adopted across 3 commands', '100% of trainees met certification requirements', 'reduced training timeline by 20% while maintaining standards'],
    communications: ['maintained 99.9% network uptime', 'secured communications for 1,000+ users', '40% reduction in system vulnerabilities', 'zero security breaches during 24-month period', 'migrated 500+ users to new platform with zero downtime'],
    administrative: ['processed 1,000+ personnel actions with 99% accuracy', 'reduced processing time by 35%', 'managed $3.2M annual operating budget', '100% compliance with regulatory requirements', 'eliminated $150K in annual waste through process improvements'],
  }
  const pool = results[category.toLowerCase()] || results.leadership
  return pool[index % pool.length]
}

/** Get a realistic timeframe */
function getTimeframe(index: number): string {
  const timeframes = ['12-month period', '18-month deployment cycle', 'fiscal year', '6-month assessment period', '24-month tour']
  return timeframes[index % timeframes.length]
}

/** Get a realistic percentage by category */
function getPercentage(category: string, index: number): string {
  const pcts: Record<string, string[]> = {
    leadership: ['98%', '25%', '100%', '30%', '15%'],
    technical: ['99.8%', '40%', '30%', '95%', '35%'],
    operations: ['15%', '100%', '30%', '98%', '45%'],
    combat: ['100%', '98%', '95%', '100%', '97%'],
    medical: ['99%', '30%', '100%', '98%', '95%'],
    training: ['95%', '30%', '100%', '20%', '97%'],
    communications: ['99.9%', '40%', '100%', '35%', '99%'],
    administrative: ['99%', '35%', '100%', '98%', '30%'],
  }
  const pool = pcts[category.toLowerCase()] || pcts.leadership
  return pool[index % pool.length]
}

/** Get a realistic dollar/budget amount by rank tier */
function getBudgetAmount(paygrade: string): string {
  const pg = (paygrade || '').toUpperCase().trim()
  if (/^E-?[1-4]$/.test(pg)) return '$250K'
  if (/^E-?[5-6]$/.test(pg)) return '$1.2M'
  if (/^E-?[7-9]$/.test(pg)) return '$3.5M'
  if (/^O-?[1-3]$/.test(pg)) return '$5M'
  if (/^O-?[4-6]$/.test(pg)) return '$15M'
  if (/^O-?[7-9]|O-?10$/.test(pg)) return '$50M'
  if (/^(W-?[1-5]|CW[1-5])$/.test(pg)) return '$2M'
  return '$1M'
}

/** Populate bullet pattern template with real data from user context and dictionary */
function populateBulletTemplate(
  template: string,
  ctx: BulletPopulateContext,
  dict: DictionaryCache,
): string {
  let result = template

  // Action verb — rotated by suggestion index
  const verb = pickActionVerb(dict, ctx.category, ctx.suggestionIndex)
  result = result.replace(/\{\{action_verb\}\}/g, verb)

  // Team size from rank equivalents
  const teamSize = getTeamSize(dict, ctx.paygrade, ctx.branch)
  result = result.replace(/\{\{team_size\}\}/g, teamSize)

  // Team description from branch/category
  const teamDesc = getTeamDescription(ctx.branch, ctx.category, ctx.jobTitle)
  result = result.replace(/\{\{team_description\}\}/g, teamDesc)

  // Function from job title
  const funcDesc = getFunctionDescription(ctx.jobTitle, ctx.category)
  result = result.replace(/\{\{function\}\}/g, funcDesc)

  // Quantified results
  const specificResult = getQuantifiedResult(ctx.category, ctx.suggestionIndex)
  result = result.replace(/\{\{result\}\}/g, specificResult)
  result = result.replace(/\{\{specific_result\}\}/g, specificResult)

  // Timeframe
  result = result.replace(/\{\{timeframe\}\}/g, getTimeframe(ctx.suggestionIndex))

  // Percentage
  result = result.replace(/\{\{percentage\}\}/g, getPercentage(ctx.category, ctx.suggestionIndex))

  // Dollar amounts / budget
  const budget = getBudgetAmount(ctx.paygrade)
  result = result.replace(/\{\{dollar_amount\}\}/g, budget)
  result = result.replace(/\{\{budget\}\}/g, budget)

  // Profile data
  const years = ctx.yearsOfService ? String(ctx.yearsOfService) : '10'
  result = result.replace(/\{\{years\}\}/g, years)
  result = result.replace(/\{\{branch\}\}/g, ctx.branch || 'military')
  result = result.replace(/\{\{organization\}\}/g, ctx.organization || 'the organization')
  result = result.replace(/\{\{program_name\}\}/g, ctx.organization || 'the program')
  result = result.replace(/\{\{number\}\}/g, teamSize)

  // Metric — use a category-appropriate one
  const metricPool: Record<string, string[]> = {
    leadership: ['mission readiness', 'team performance', 'operational efficiency'],
    technical: ['system uptime', 'equipment availability', 'maintenance turnaround'],
    operations: ['processing time', 'delivery rate', 'resource utilization'],
    combat: ['combat readiness', 'qualification rate', 'mission success'],
    medical: ['patient outcomes', 'readiness compliance', 'wait times'],
    training: ['pass rate', 'qualification rate', 'training completion'],
    communications: ['network uptime', 'system availability', 'security posture'],
    administrative: ['processing accuracy', 'compliance rate', 'cycle time'],
  }
  const metricArr = metricPool[ctx.category.toLowerCase()] || metricPool.leadership
  result = result.replace(/\{\{metric\}\}/g, metricArr[ctx.suggestionIndex % metricArr.length])

  // System/process names derived from job context
  const sysName = ctx.jobTitle.toLowerCase().includes('it') || ctx.jobTitle.toLowerCase().includes('cyber')
    ? 'enterprise network infrastructure'
    : ctx.jobTitle.toLowerCase().includes('maintenance')
    ? 'maintenance management system'
    : ctx.jobTitle.toLowerCase().includes('supply')
    ? 'supply chain management system'
    : 'operational management system'
  result = result.replace(/\{\{system_name\}\}/g, sysName)
  result = result.replace(/\{\{process_name\}\}/g, funcDesc.split(' and ')[0])

  // Catch any remaining {{placeholder}} — fill with best-effort contextual value
  result = result.replace(/\{\{(\w+)\}\}/g, (_, field) => {
    const f = field.toLowerCase()
    if (f === 'civilian_title' || f === 'target_role') return ctx.civilianTitle || ctx.jobTitle || '[target role]'
    if (f === 'target_industry') return '[target industry]'
    if (f === 'certification' || f === 'cert_1') return '[certification]'
    if (f === 'skill_1' || f === 'key_skill') return funcDesc.split(' ')[0] || '[key skill]'
    if (f === 'key_achievement') return specificResult
    return `[${field.replace(/_/g, ' ')}]`
  })

  return result
}
