'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getUserTier, isPaidTier } from '@/lib/tier-utils'
import { UpgradeLink } from '@/components/modals/UpgradeModal'

interface ExtractedBullet {
  original: string
  translated: string
  metrics: string[]
  skills: string[]
}

interface BulletWithStatus extends ExtractedBullet {
  id: string
  status: 'pending' | 'accepted' | 'rejected'
  experienceId: string
}

interface EvalUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onExtracted: (bullets: ExtractedBullet[], experienceId: string | null) => void
  onBulletsSaved?: () => void
  userId: string
  experiences?: Array<{ id: string; job_title: string; organization: string; start_date: string; end_date: string }>
  defaultExperienceId?: string
  userPlan?: string
  evalRemaining?: number
  evalLimit?: number
}

const EVAL_TYPES = [
  { value: 'fitrep', label: 'FITREP (Navy Officer)' },
  { value: 'chiefeval', label: 'CHIEFEVAL (Navy E7-E9)' },
  { value: 'eval', label: 'EVAL (Navy E1-E6)' },
  { value: 'ncoer', label: 'NCOER (Army NCO)' },
  { value: 'oer', label: 'OER (Army Officer)' },
  { value: 'epr', label: 'EPR (Air Force Enlisted)' },
  { value: 'opr', label: 'OPR (Air Force Officer)' },
  { value: 'other', label: 'Other' },
]

export function EvalUploadModal({ isOpen, onClose, onExtracted, onBulletsSaved, userId, experiences = [], defaultExperienceId, userPlan, evalRemaining, evalLimit }: EvalUploadModalProps) {
  const [step, setStep] = useState<'upload' | 'processing' | 'review' | 'done'>('upload')
  const [savingToExperience, setSavingToExperience] = useState(false)
  const supabase = createClient()
  const [file, setFile] = useState<File | null>(null)
  const [bulletItems, setBulletItems] = useState<BulletWithStatus[]>([])
  const [evalPeriod, setEvalPeriod] = useState<{ startDate: string | null; endDate: string | null }>({ startDate: null, endDate: null })
  const [detectedJobTitle, setDetectedJobTitle] = useState<string | null>(null)
  const [evalType, setEvalType] = useState<string>('')
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [editingBulletId, setEditingBulletId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const [retryingBulletId, setRetryingBulletId] = useState<string | null>(null)
  const [piiWarning, setPiiWarning] = useState<string | null>(null)
  const [fetchedRemaining, setFetchedRemaining] = useState<number | undefined>(evalRemaining)
  const [fetchedLimit, setFetchedLimit] = useState<number | undefined>(evalLimit)
  const [savedCount, setSavedCount] = useState(0)
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)

  // Self-fetch eval limits if not provided as props
  useEffect(() => {
    if (evalRemaining !== undefined) {
      setFetchedRemaining(evalRemaining)
      setFetchedLimit(evalLimit)
      return
    }
    if (!isOpen || !userId) return
    let cancelled = false
    async function fetchLimits() {
      try {
        const res = await fetch('/api/user/eval-limit')
        if (res.ok) {
          const data = await res.json()
          if (!cancelled) {
            setFetchedRemaining(data.remaining)
            setFetchedLimit(data.limit)
          }
        }
      } catch {
        // If fetch fails, allow upload (don't block on error)
      }
    }
    fetchLimits()
    return () => { cancelled = true }
  }, [isOpen, userId, evalRemaining, evalLimit])

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) resetState()
  }, [isOpen])

  const resetState = () => {
    setFile(null)
    setBulletItems([])
    setEvalPeriod({ startDate: null, endDate: null })
    setDetectedJobTitle(null)
    setEvalType('')
    setError('')
    setStep('upload')
    setProcessing(false)
    setEditingBulletId(null)
    setEditingText('')
    setRetryingBulletId(null)
    setSavedCount(0)
    setShowCloseConfirm(false)
    setPiiWarning(null)
  }

  // Find best matching experience for auto-assignment
  const findMatchingExperience = useCallback((periodStart?: string | null) => {
    if (defaultExperienceId) return defaultExperienceId
    if (!experiences.length) return ''
    if (periodStart) {
      const match = experiences.find(exp => {
        const expStart = exp.start_date?.substring(0, 7)
        const evalStart = periodStart?.substring(0, 7)
        return expStart === evalStart
      })
      if (match) return match.id
    }
    return experiences[0]?.id || ''
  }, [experiences, defaultExperienceId])

  // Process extracted data into bullet items
  const processBulletData = useCallback((data: any) => {
    const matchedExp = findMatchingExperience(data.evalPeriod?.startDate)
    const bullets: BulletWithStatus[] = (data.bullets || []).map((b: ExtractedBullet, idx: number) => ({
      ...b,
      id: `bullet-${Date.now()}-${idx}`,
      status: 'pending' as const,
      experienceId: matchedExp,
    }))
    setBulletItems(bullets)
    setEvalPeriod(data.evalPeriod || { startDate: null, endDate: null })
    setDetectedJobTitle(data.jobTitle || null)
    setStep('review')
  }, [findMatchingExperience])

  // Convert unsupported image formats (HEIC, BMP, TIFF) to JPEG via canvas
  const convertToSupportedFormat = async (file: File): Promise<File> => {
    const supported = ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
    if (supported.includes(file.type)) return file

    return new Promise((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0)
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url)
            if (blob) {
              resolve(new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }))
            } else {
              reject(new Error('Could not convert image. Please save as PNG or JPEG and try again.'))
            }
          },
          'image/jpeg',
          0.92
        )
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Unsupported image format. Please convert to PNG or JPEG, or take a screenshot of the document.'))
      }
      img.src = url
    })
  }

  // Handle file selection — send full image or PDF directly (no crop step)
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setError('')
    setPiiWarning(null)

    // File size check — 10MB limit for phone photos
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File is too large (max 10MB). Try a lower resolution photo or compress the image first.')
      return
    }

    setFile(selectedFile)
    setStep('processing')
    setProcessing(true)

    try {
      let data
      let response

      if (selectedFile.type === 'application/pdf') {
        // PDF path: base64 → /api/parse-eval
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            const dataUrl = reader.result as string
            const base64Data = dataUrl.split(',')[1]
            resolve(base64Data)
          }
          reader.onerror = () => reject(new Error('Failed to read file'))
          reader.readAsDataURL(selectedFile)
        })

        response = await fetch('/api/parse-eval', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: selectedFile.name,
            fileData: base64,
            evalType,
          }),
        })
        data = await response.json()
      } else if (selectedFile.type.startsWith('image/') || selectedFile.name.match(/\.(heic|heif|bmp|tiff?)$/i)) {
        // Convert unsupported formats (HEIC, BMP, TIFF) to JPEG
        let imageFile = selectedFile
        try {
          imageFile = await convertToSupportedFormat(selectedFile)
        } catch (convErr: any) {
          setError(convErr?.message || 'Could not process this image format. Please use PNG or JPEG.')
          setStep('upload')
          return
        }

        // Image path: send full file via FormData → /api/eval/extract
        const formData = new FormData()
        formData.append('image', imageFile)
        formData.append('evalType', evalType)

        response = await fetch('/api/eval/extract', {
          method: 'POST',
          body: formData,
        })
        data = await response.json()
      } else {
        setError('Please upload a PDF or image file (PNG, JPG, HEIC)')
        setStep('upload')
        return
      }

      // Handle limit reached (both routes return 403)
      if (response.status === 403 && data.limitReached) {
        setError(data.error || 'Eval upload limit reached')
        setStep('upload')
        return
      }

      // Capture PII warning (non-blocking)
      if (data.piiWarning) {
        setPiiWarning(data.piiWarning)
      }

      if (data.error) {
        setError(data.error)
        setStep('upload')
        return
      }

      if (!data.bullets?.length) {
        setError('No bullets could be extracted. Try a clearer image or different file.')
        setStep('upload')
        return
      }

      processBulletData(data)
    } catch (err: any) {
      console.error('File processing error:', err)
      setError(err?.message || 'Failed to process file. Please try again.')
      setStep('upload')
    } finally {
      setProcessing(false)
    }
  }

  // Bullet counts
  const acceptedBullets = bulletItems.filter(b => b.status === 'accepted')
  const reviewedBullets = bulletItems.filter(b => b.status !== 'pending')

  // Bullet actions
  const acceptBullet = (bulletId: string) => {
    setBulletItems(prev => prev.map(b =>
      b.id === bulletId ? { ...b, status: 'accepted' as const } : b
    ))
  }

  const rejectBullet = (bulletId: string) => {
    setBulletItems(prev => prev.map(b =>
      b.id === bulletId ? { ...b, status: 'rejected' as const } : b
    ))
  }

  const acceptAll = () => {
    setBulletItems(prev => prev.map(b => ({ ...b, status: 'accepted' as const })))
  }

  const updateBulletExperience = (bulletId: string, experienceId: string) => {
    setBulletItems(prev => prev.map(b =>
      b.id === bulletId ? { ...b, experienceId } : b
    ))
  }

  const startEditBullet = (bulletId: string, currentText: string) => {
    setEditingBulletId(bulletId)
    setEditingText(currentText)
  }

  const saveEditBullet = () => {
    if (!editingBulletId || !editingText.trim()) return
    setBulletItems(prev => prev.map(b =>
      b.id === editingBulletId ? { ...b, translated: editingText.trim() } : b
    ))
    setEditingBulletId(null)
    setEditingText('')
  }

  const cancelEditBullet = () => {
    setEditingBulletId(null)
    setEditingText('')
  }

  const retryBullet = async (bulletId: string) => {
    const bullet = bulletItems.find(b => b.id === bulletId)
    if (!bullet) return

    setRetryingBulletId(bulletId)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullet: bullet.original,
          context: { jobType: 'private' }
        }),
      })
      const data = await response.json()
      if (data.translated) {
        setBulletItems(prev => prev.map(b =>
          b.id === bulletId ? { ...b, translated: data.translated } : b
        ))
      }
    } catch (err) {
      console.error('Retry failed:', err)
    } finally {
      setRetryingBulletId(null)
    }
  }

  // Save bullets — group by experience
  const handleSaveBullets = async () => {
    const bulletsToSave = acceptedBullets
    if (bulletsToSave.length === 0) return

    setSavingToExperience(true)
    try {
      // Group bullets by their assigned experience
      const grouped = bulletsToSave.reduce((acc, b) => {
        const key = b.experienceId || '__new__'
        if (!acc[key]) acc[key] = []
        acc[key].push(b)
        return acc
      }, {} as Record<string, BulletWithStatus[]>)

      for (const [expId, bullets] of Object.entries(grouped)) {
        if (expId === '__new__' || !expId) {
          onExtracted(bullets, null)
          continue
        }

        // Get current max sort_order for this experience
        const { data: existingBullets } = await supabase
          .from('experience_bullets')
          .select('sort_order')
          .eq('experience_id', expId)
          .order('sort_order', { ascending: false })
          .limit(1)

        const startOrder = existingBullets?.[0]?.sort_order ?? -1

        const bulletsToInsert = bullets.map((b, idx) => ({
          experience_id: expId,
          original_text: b.original,
          translated_text: b.translated,
          sort_order: startOrder + idx + 1,
          status: 'accepted',
        }))

        const { error } = await supabase.from('experience_bullets').insert(bulletsToInsert)
        if (error) {
          console.error('Error saving bullets:', error)
          setError('Failed to save bullets: ' + error.message)
          return
        }
      }

      setSavedCount(bulletsToSave.length)
      onBulletsSaved?.()
      setStep('done')
    } catch (err) {
      console.error('Error saving bullets:', err)
      setError('Failed to save bullets')
    } finally {
      setSavingToExperience(false)
    }
  }

  const handleClose = () => {
    if (step === 'review' && bulletItems.length > 0) {
      setShowCloseConfirm(true)
      return
    }
    resetState()
    onClose()
  }

  const handleConfirmClose = () => {
    setShowCloseConfirm(false)
    resetState()
    onClose()
  }

  const handleDone = () => {
    resetState()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop — lighter opacity for slide-in feel */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Slide-in panel from right */}
      <div className="relative w-full max-w-xl h-full bg-bg-card border-l border-border shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-border flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-heading text-lg font-bold">
              {step === 'upload' && 'Upload Evaluation'}
              {step === 'processing' && 'Processing...'}
              {step === 'review' && 'Review Bullets'}
              {step === 'done' && 'Complete'}
            </h2>
            {step === 'review' && (
              <p className="text-xs text-text-muted mt-0.5">
                {reviewedBullets.length} of {bulletItems.length} bullets reviewed
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-text-muted hover:text-text rounded-lg transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-4 md:p-5 mobile-scroll">
          {error && (
            <div className="mb-4 p-3 bg-status-red/20 border border-status-red/30 rounded-lg text-sm text-status-red flex items-start justify-between gap-2">
              <span>{error}</span>
              <button onClick={() => setError('')} className="underline text-xs shrink-0">Dismiss</button>
            </div>
          )}

          {/* ── UPLOAD STEP ── */}
          {step === 'upload' && fetchedRemaining !== undefined && fetchedRemaining <= 0 && (
            <div className="space-y-5 text-center py-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-gold/10 flex items-center justify-center">
                <span className="text-gold text-2xl">&#9670;</span>
              </div>
              <div>
                <p className="font-heading text-base font-bold uppercase tracking-wider mb-1">Eval Upload Limit Reached</p>
                <p className="text-sm text-text-muted">
                  You&apos;ve used your {fetchedLimit || 0} free eval upload{(fetchedLimit || 0) !== 1 ? 's' : ''}.
                </p>
              </div>

              <div className="mx-auto max-w-sm border-2 border-gold/40 rounded-lg p-5 bg-gold/5">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-gold text-lg">&#9889;</span>
                  <span className="font-heading text-sm font-bold uppercase tracking-wider">Eval Pack — $5 one-time</span>
                </div>
                <p className="text-xs text-text-muted mb-3">Add 5 more uploads to any plan</p>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/stripe/create-checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ tier: 'eval_pack' }),
                      })
                      const data = await res.json()
                      if (data.url) window.location.href = data.url
                    } catch {}
                  }}
                  className="w-full px-5 py-2.5 bg-gold text-bg-primary font-heading text-xs font-bold uppercase tracking-wider rounded hover:bg-gold-bright transition-colors"
                >
                  Get Eval Pack &rarr;
                </button>
              </div>

              <div>
                <p className="text-sm text-text-muted mb-2">Want unlimited evals + everything else?</p>
                <UpgradeLink
                  className="text-sm text-gold hover:text-gold-bright hover:underline transition-colors"
                >
                  View upgrade options &rarr;
                </UpgradeLink>
              </div>

              <p className="text-xs text-text-dim">
                Paste eval text into experience bullets for free dictionary translation anytime.
              </p>
            </div>
          )}

          {step === 'upload' && (fetchedRemaining === undefined || fetchedRemaining > 0) && (
            <div className="space-y-5">
              {/* Remaining counter */}
              {fetchedRemaining !== undefined && fetchedLimit !== undefined && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">
                    {fetchedRemaining} of {fetchedLimit} upload{fetchedLimit !== 1 ? 's' : ''} remaining
                  </span>
                  {fetchedRemaining === 1 && (
                    <span className="text-status-amber font-medium">Last upload</span>
                  )}
                </div>
              )}

              {/* Eval type selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Evaluation Type
                </label>
                <select
                  value={evalType}
                  onChange={(e) => setEvalType(e.target.value)}
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                  autoComplete="off"
                >
                  <option value="">Select type...</option>
                  {EVAL_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* File upload */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Upload File
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-gold/50 transition-all">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/heic,image/heif,image/*,.pdf,.heic,.heif"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="eval-upload-modal"
                    disabled={!evalType || processing}
                  />
                  <label
                    htmlFor="eval-upload-modal"
                    className={`cursor-pointer block ${!evalType || processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <svg className="w-10 h-10 mx-auto text-text-muted mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <p className="text-sm text-text mb-1">Click to upload</p>
                    <p className="text-xs text-text-muted">PNG, JPG, HEIC, or PDF (max 10MB)</p>
                  </label>
                </div>
                {!evalType && (
                  <p className="text-xs text-status-amber mt-2">Select an evaluation type first</p>
                )}
              </div>

              {/* Privacy note — non-scary */}
              <div className="flex items-start gap-2 p-3 bg-status-amber/5 border border-status-amber/20 rounded-lg">
                <svg className="w-4 h-4 text-status-amber flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <p className="text-xs text-text-muted">
                  <strong className="text-status-amber">Privacy Note</strong> — We&apos;ll automatically redact any SSN, DODID, or personal contact info we detect. You can also crop it out before uploading.
                </p>
              </div>

              {/* Phone photo tip */}
              <div className="flex items-start gap-2 p-3 bg-bg-tertiary rounded-lg border border-border">
                <svg className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-text-muted">
                  <strong className="text-gold">Tip:</strong> You can upload a photo from your phone. Block 41/43 PII is not required — crop it out or we&apos;ll handle it automatically.
                </p>
              </div>
            </div>
          )}

          {/* ── PROCESSING STEP ── */}
          {step === 'processing' && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4 animate-pulse">&#9672;</div>
              <p className="font-heading text-base uppercase tracking-wider">Extracting & Translating</p>
              <p className="text-text-muted text-sm mt-2">Converting military language to STAR format</p>
            </div>
          )}

          {/* ── REVIEW STEP ── */}
          {step === 'review' && (
            <div className="space-y-4">
              {/* PII auto-redaction warning */}
              {piiWarning && (
                <div className="p-3 bg-status-amber/10 border border-status-amber/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-status-amber flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    <p className="text-xs text-text-muted">
                      <strong className="text-status-amber">PII Detected &amp; Redacted:</strong> {piiWarning}
                    </p>
                  </div>
                </div>
              )}

              {/* Accept All + counter */}
              <div className="flex items-center justify-between">
                <button
                  onClick={acceptAll}
                  className="px-4 py-2 bg-status-green/10 text-status-green border border-status-green/30 rounded text-sm font-medium hover:bg-status-green/20 transition-colors"
                >
                  Accept All ({bulletItems.length})
                </button>
                <span className="text-xs text-text-muted">
                  {acceptedBullets.length} accepted
                </span>
              </div>

              {/* Detected info */}
              {(detectedJobTitle || evalPeriod.startDate) && (
                <div className="p-3 bg-bg-tertiary rounded-lg flex flex-wrap items-center gap-3 text-xs">
                  {detectedJobTitle && (
                    <span className="text-text-muted">
                      <span className="text-gold">Position:</span> {detectedJobTitle}
                    </span>
                  )}
                  {evalPeriod.startDate && (
                    <span className="text-text-muted">
                      <span className="text-gold">Period:</span> {evalPeriod.startDate} — {evalPeriod.endDate || 'Present'}
                    </span>
                  )}
                </div>
              )}

              {/* Bullet cards — Grammarly style */}
              <div className="space-y-3">
                {bulletItems.map((bullet) => (
                  <div
                    key={bullet.id}
                    className={`rounded-lg border transition-all ${
                      bullet.status === 'accepted'
                        ? 'border-status-green/40 bg-status-green/5'
                        : bullet.status === 'rejected'
                          ? 'border-border/50 bg-bg-tertiary opacity-50'
                          : 'border-border bg-bg-secondary'
                    }`}
                  >
                    {editingBulletId === bullet.id ? (
                      /* Inline editing */
                      <div className="p-4 space-y-2">
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="w-full bg-bg-tertiary border border-border rounded px-3 py-2 text-text text-sm resize-none focus:border-gold focus:ring-1 focus:ring-gold/25"
                          rows={3}
                          autoFocus
                          autoComplete="off"
                        />
                        <div className="flex gap-2 justify-end">
                          <button onClick={cancelEditBullet} className="px-3 py-1 text-xs text-text-muted hover:text-text">Cancel</button>
                          <button onClick={saveEditBullet} className="px-3 py-1 text-xs bg-gold text-bg-primary rounded hover:bg-gold/90">Save</button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4">
                        {/* Side-by-side: original (muted) | translated (bold) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-text-dim mb-1">Original</p>
                            <p className="text-xs text-text-muted italic leading-relaxed">{bullet.original}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-gold mb-1">Translated</p>
                            <p className="text-sm text-text font-medium leading-relaxed">{bullet.translated}</p>
                          </div>
                        </div>

                        {/* Metrics & skills tags */}
                        {(bullet.metrics.length > 0 || bullet.skills.length > 0) && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {bullet.metrics.map((metric, mIdx) => (
                              <span key={`m-${mIdx}`} className="px-1.5 py-0.5 text-[10px] bg-status-green/15 text-status-green rounded">
                                {metric}
                              </span>
                            ))}
                            {bullet.skills.map((skill, sIdx) => (
                              <span key={`s-${sIdx}`} className="px-1.5 py-0.5 text-[10px] bg-gold/15 text-gold rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Experience assignment + action icons */}
                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                          {/* Per-bullet experience dropdown */}
                          {experiences.length > 0 ? (
                            <select
                              value={bullet.experienceId}
                              onChange={(e) => updateBulletExperience(bullet.id, e.target.value)}
                              className="text-[11px] px-2 py-1 bg-bg-tertiary border border-border rounded max-w-[180px] truncate"
                              autoComplete="off"
                            >
                              <option value="">New experience</option>
                              {experiences.map((exp) => (
                                <option key={exp.id} value={exp.id}>
                                  {exp.job_title} — {exp.organization}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-[11px] text-text-dim">No experiences yet</span>
                          )}

                          {/* Icon buttons */}
                          <div className="flex items-center gap-0.5">
                            {/* Accept */}
                            <button
                              onClick={() => acceptBullet(bullet.id)}
                              className={`p-1.5 rounded transition-colors ${
                                bullet.status === 'accepted'
                                  ? 'text-status-green bg-status-green/20'
                                  : 'text-text-dim hover:text-status-green hover:bg-status-green/10'
                              }`}
                              title="Accept"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            </button>
                            {/* Reject */}
                            <button
                              onClick={() => rejectBullet(bullet.id)}
                              className={`p-1.5 rounded transition-colors ${
                                bullet.status === 'rejected'
                                  ? 'text-status-red bg-status-red/20'
                                  : 'text-text-dim hover:text-status-red hover:bg-status-red/10'
                              }`}
                              title="Reject"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                              </svg>
                            </button>
                            {/* Edit */}
                            <button
                              onClick={() => startEditBullet(bullet.id, bullet.translated)}
                              className="p-1.5 rounded text-text-dim hover:text-gold hover:bg-gold/10 transition-colors"
                              title="Edit translation"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            {/* Re-translate */}
                            <button
                              onClick={() => retryBullet(bullet.id)}
                              disabled={retryingBulletId === bullet.id}
                              className="p-1.5 rounded text-text-dim hover:text-status-blue hover:bg-status-blue/10 transition-colors disabled:opacity-50"
                              title="Re-translate"
                            >
                              <svg className={`w-4 h-4 ${retryingBulletId === bullet.id ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-xs text-text-dim">
                &#10003; Original file discarded — only extracted text is saved
              </p>
            </div>
          )}

          {/* ── DONE STEP ── */}
          {step === 'done' && (
            <div className="text-center py-16 space-y-5">
              <div className="w-16 h-16 mx-auto rounded-full bg-status-green/10 flex items-center justify-center animate-success-pop">
                <svg className="w-8 h-8 text-status-green animate-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <p className="font-heading text-lg font-bold">Bullets Saved</p>
                <p className="text-sm text-text-muted mt-1">
                  {savedCount} of {bulletItems.length} bullets accepted and saved
                </p>
              </div>
              <button
                onClick={handleDone}
                className="px-6 py-3 bg-gold text-bg-primary rounded font-heading font-bold uppercase tracking-wider text-sm hover:bg-gold-bright transition-colors"
              >
                View in Profile
              </button>
            </div>
          )}
        </div>

        {/* Footer — only on review step */}
        {step === 'review' && (
          <div className="p-4 md:p-5 border-t border-border flex gap-3 shrink-0 safe-area-inset-bottom">
            <button
              onClick={handleClose}
              className="px-5 py-3 bg-bg-tertiary border border-border rounded font-heading font-bold uppercase tracking-wider text-xs hover:bg-bg-hover transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveBullets}
              disabled={acceptedBullets.length === 0 || savingToExperience}
              className="flex-1 px-5 py-3 bg-gold text-bg-primary rounded font-heading font-bold uppercase tracking-wider text-sm hover:bg-gold-bright disabled:opacity-50 transition-colors"
            >
              {savingToExperience
                ? 'Saving...'
                : `Save ${acceptedBullets.length} Bullet${acceptedBullets.length !== 1 ? 's' : ''}`
              }
            </button>
          </div>
        )}

        {/* Unsaved bullets confirmation */}
        {showCloseConfirm && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <div className="bg-bg-card border border-border rounded-lg p-6 mx-4 max-w-sm shadow-xl">
              <h3 className="font-heading text-base font-bold uppercase mb-2">Unsaved Bullets</h3>
              <p className="text-sm text-text-muted mb-4">
                You have {bulletItems.length} extracted bullet{bulletItems.length !== 1 ? 's' : ''} that haven&apos;t been saved.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCloseConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-bg-tertiary border border-border rounded font-heading font-bold uppercase text-xs tracking-wider hover:bg-bg-hover transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={handleConfirmClose}
                  className="flex-1 px-4 py-2.5 bg-status-red/20 text-status-red border border-status-red/30 rounded font-heading font-bold uppercase text-xs tracking-wider hover:bg-status-red/30 transition-colors"
                >
                  Close Anyway
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
