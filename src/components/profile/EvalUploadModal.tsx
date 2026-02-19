'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
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
  status: 'pending' | 'accepted' | 'excluded'
}

interface EvalUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onExtracted: (bullets: ExtractedBullet[], experienceId: string | null) => void
  onBulletsSaved?: () => void // Callback when bullets are saved directly to an experience
  userId: string
  experiences?: Array<{ id: string; job_title: string; organization: string; start_date: string; end_date: string }>
  defaultExperienceId?: string // Pre-select this experience when opening
  userPlan?: string
  evalRemaining?: number // Remaining eval uploads (from checkLimit)
  evalLimit?: number // Total eval upload limit (tier + bonus)
}

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

export function EvalUploadModal({ isOpen, onClose, onExtracted, onBulletsSaved, userId, experiences = [], defaultExperienceId, userPlan, evalRemaining, evalLimit }: EvalUploadModalProps) {
  const [step, setStep] = useState<'upload' | 'crop' | 'processing' | 'review'>('upload')
  const [savingToExperience, setSavingToExperience] = useState(false)
  const supabase = createClient()
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [cropArea, setCropArea] = useState<CropArea | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [bulletItems, setBulletItems] = useState<BulletWithStatus[]>([])
  const [evalPeriod, setEvalPeriod] = useState<{ startDate: string | null; endDate: string | null }>({ startDate: null, endDate: null })
  const [detectedJobTitle, setDetectedJobTitle] = useState<string | null>(null)
  const [selectedExperience, setSelectedExperience] = useState<string>(defaultExperienceId || '')
  const [evalType, setEvalType] = useState<string>('')
  const [showOriginal, setShowOriginal] = useState(false)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [editingBulletId, setEditingBulletId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const [retryingBulletId, setRetryingBulletId] = useState<string | null>(null)
  const [fetchedRemaining, setFetchedRemaining] = useState<number | undefined>(evalRemaining)
  const [fetchedLimit, setFetchedLimit] = useState<number | undefined>(evalLimit)

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

  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // useCallback MUST be before any conditional returns (React Rules of Hooks)
  const getCroppedImage = useCallback((): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!cropArea || !imgRef.current || !canvasRef.current || !containerRef.current) {
        reject(new Error('No crop selected'))
        return
      }

      const image = imgRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('No canvas context'))
        return
      }

      // Calculate scale between displayed and natural image size
      const displayedWidth = image.clientWidth
      const displayedHeight = image.clientHeight
      const scaleX = image.naturalWidth / displayedWidth
      const scaleY = image.naturalHeight / displayedHeight

      // Set canvas size to cropped area
      canvas.width = cropArea.width * scaleX
      canvas.height = cropArea.height * scaleY

      // Draw cropped area to canvas
      ctx.drawImage(
        image,
        cropArea.x * scaleX,
        cropArea.y * scaleY,
        cropArea.width * scaleX,
        cropArea.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      )

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to create blob'))
          }
        },
        'image/png',
        1
      )
    })
  }, [cropArea])

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetState()
    }
  }, [isOpen])

  const resetState = () => {
    if (imageUrl && imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl)
    }
    setFile(null)
    setImageUrl(null)
    setCropArea(null)
    setBulletItems([])
    setEvalPeriod({ startDate: null, endDate: null })
    setDetectedJobTitle(null)
    setSelectedExperience(defaultExperienceId || '')
    setEvalType('')
    setShowOriginal(false)
    setError('')
    setStep('upload')
    setProcessing(false)
    setEditingBulletId(null)
    setEditingText('')
    setRetryingBulletId(null)
  }

  // Conditional return AFTER all hooks
  if (!isOpen) return null

  // Constants and handlers (not hooks, so OK to be after conditional return)
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setError('')
    setFile(selectedFile)

    if (selectedFile.type === 'application/pdf') {
      // Send PDF directly to Claude's document API (no image conversion needed)
      await processPdfDirectly(selectedFile)
    } else if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile)
      setImageUrl(url)
      setStep('crop')
    } else {
      setError('Please upload a PDF or image file (PNG, JPG)')
    }
  }

  const processPdfDirectly = async (pdfFile: File) => {
    setStep('processing')
    setProcessing(true)
    setError('')

    try {
      // Convert PDF to base64 using FileReader (robust for large files)
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const dataUrl = reader.result as string
          // Remove the data:application/pdf;base64, prefix
          const base64Data = dataUrl.split(',')[1]
          resolve(base64Data)
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(pdfFile)
      })

      console.log('Sending PDF directly to Claude, size:', base64.length, 'chars')

      // Send directly to parse-eval endpoint (uses Claude's document API)
      const response = await fetch('/api/parse-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: pdfFile.name,
          fileData: base64,
          evalType: evalType,
        }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setStep('upload')
        return
      }

      // Convert bullets to items with status
      const bullets = (data.bullets || []).map((b: ExtractedBullet, idx: number) => ({
        ...b,
        id: `bullet-${Date.now()}-${idx}`,
        status: 'pending' as const,
      }))
      setBulletItems(bullets)
      setEvalPeriod(data.evalPeriod || { startDate: null, endDate: null })
      setDetectedJobTitle(data.jobTitle || null)

      // Auto-select experience if period matches
      if (data.evalPeriod?.startDate && experiences.length > 0) {
        const matchingExp = experiences.find(exp => {
          const expStart = exp.start_date?.substring(0, 7)
          const evalStart = data.evalPeriod.startDate?.substring(0, 7)
          return expStart === evalStart
        })
        if (matchingExp) {
          setSelectedExperience(matchingExp.id)
        }
      }

      setStep('review')
    } catch (err: any) {
      console.error('PDF processing error:', err)
      setError(err?.message || 'Failed to process PDF. Please try again.')
      setStep('upload')
    } finally {
      setProcessing(false)
    }
  }

  // Mouse handlers for crop selection
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setDragStart({ x, y })
    setIsDragging(true)
    setCropArea({ x, y, width: 0, height: 0 })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height))

    setCropArea({
      x: Math.min(dragStart.x, x),
      y: Math.min(dragStart.y, y),
      width: Math.abs(x - dragStart.x),
      height: Math.abs(y - dragStart.y),
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragStart(null)
  }

  const handleCropComplete = async () => {
    if (!cropArea || cropArea.width < 50 || cropArea.height < 50) {
      setError('Please select a larger area containing the write-up section')
      return
    }

    setStep('processing')
    setProcessing(true)
    setError('')

    try {
      const croppedBlob = await getCroppedImage()

      const formData = new FormData()
      formData.append('image', croppedBlob, 'cropped-eval.png')
      formData.append('evalType', evalType)

      const response = await fetch('/api/eval/extract', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setStep('crop')
        return
      }

      // Clean up the image URL
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl)
      }
      setImageUrl(null)
      setFile(null)

      // Convert bullets to items with status
      const bullets = (data.bullets || []).map((b: ExtractedBullet, idx: number) => ({
        ...b,
        id: `bullet-${Date.now()}-${idx}`,
        status: 'pending' as const,
      }))
      setBulletItems(bullets)
      setEvalPeriod(data.evalPeriod || { startDate: null, endDate: null })
      setDetectedJobTitle(data.jobTitle || null)

      // Auto-select experience if period matches
      if (data.evalPeriod?.startDate && experiences.length > 0) {
        const matchingExp = experiences.find(exp => {
          const expStart = exp.start_date?.substring(0, 7)
          const evalStart = data.evalPeriod.startDate?.substring(0, 7)
          return expStart === evalStart
        })
        if (matchingExp) {
          setSelectedExperience(matchingExp.id)
        }
      }

      setStep('review')
    } catch (err: any) {
      console.error('Extraction error:', err)
      setError(err?.message || 'Failed to extract text')
      setStep('crop')
    } finally {
      setProcessing(false)
    }
  }

  // Get accepted bullets (pending or explicitly accepted)
  const acceptedBullets = bulletItems.filter(b => b.status === 'pending' || b.status === 'accepted')
  const pendingBullets = bulletItems.filter(b => b.status === 'pending')

  // Bullet action handlers
  const acceptBullet = (bulletId: string) => {
    setBulletItems(prev => prev.map(b =>
      b.id === bulletId ? { ...b, status: 'accepted' as const } : b
    ))
  }

  const acceptAllBullets = () => {
    setBulletItems(prev => prev.map(b =>
      b.status === 'pending' ? { ...b, status: 'accepted' as const } : b
    ))
  }

  const excludeBullet = (bulletId: string) => {
    setBulletItems(prev => prev.map(b =>
      b.id === bulletId ? { ...b, status: 'excluded' as const } : b
    ))
  }

  const deleteBullet = (bulletId: string) => {
    setBulletItems(prev => prev.filter(b => b.id !== bulletId))
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

  const handleSaveBullets = async () => {
    // Only save accepted bullets
    const bulletsToSave = acceptedBullets

    if (bulletsToSave.length === 0) {
      alert('No bullets to save. Accept at least one bullet.')
      return
    }

    // If an existing experience is selected, save directly to it
    if (selectedExperience) {
      setSavingToExperience(true)
      try {
        // Get current max sort_order for this experience
        const { data: existingBullets } = await supabase
          .from('experience_bullets')
          .select('sort_order')
          .eq('experience_id', selectedExperience)
          .order('sort_order', { ascending: false })
          .limit(1)

        const startOrder = existingBullets?.[0]?.sort_order ?? -1

        // Insert bullets directly with accepted status so they appear in resumes
        const bulletsToInsert = bulletsToSave.map((b, idx) => ({
          experience_id: selectedExperience,
          original_text: b.original,
          translated_text: b.translated,
          sort_order: startOrder + idx + 1,
          status: 'accepted',
        }))

        const { error } = await supabase.from('experience_bullets').insert(bulletsToInsert)

        if (error) {
          console.error('Error saving bullets:', error)
          alert('Failed to save bullets: ' + error.message)
          return
        }

        // Notify parent that bullets were saved
        onBulletsSaved?.()
        // Bypass handleClose() to avoid triggering the unsaved bullets confirmation dialog
        resetState()
        onClose()
      } catch (err) {
        console.error('Error saving bullets:', err)
        alert('Failed to save bullets')
      } finally {
        setSavingToExperience(false)
      }
    } else {
      // No experience selected - pass to BulletAssignmentModal via onExtracted
      onExtracted(bulletsToSave, null)
      // Bypass handleClose() to avoid triggering the unsaved bullets confirmation dialog
      resetState()
      onClose()
    }
  }

  const [showCloseConfirm, setShowCloseConfirm] = useState(false)

  const handleClose = () => {
    // If we have processed bullets that haven't been saved, confirm before closing
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

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end md:items-center justify-center z-50 md:p-4">
      {/* Full screen on mobile, centered modal on desktop */}
      <div className="bg-bg-card border-t md:border border-border rounded-t-2xl md:rounded-lg w-full md:max-w-4xl h-[95vh] md:max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-border flex items-center justify-between">
          {/* Mobile drag indicator */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-border rounded-full md:hidden" />

          <div className="pt-2 md:pt-0">
            <h2 className="font-heading text-lg md:text-xl font-bold">Upload Evaluation</h2>
            <p className="text-xs md:text-sm text-text-muted mt-1">
              {step === 'upload' && 'Select your evaluation file'}
              {step === 'crop' && 'Crop to select the write-up section'}
              {step === 'processing' && 'Extracting text...'}
              {step === 'review' && 'Review extracted bullets'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-3 md:p-2 text-text-muted hover:text-text rounded-lg transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-4 md:p-6 mobile-scroll">
          {/* Privacy Warning */}
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-status-red/10 border border-status-red/30 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-status-red flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <div>
                <p className="font-semibold text-status-red">Privacy Protection Required</p>
                <p className="text-sm text-text-muted mt-1">
                  <strong>DO NOT include</strong> any personally identifiable information:
                </p>
                <ul className="text-sm text-text-muted mt-2 space-y-1">
                  <li>&#10060; Social Security Number (SSN)</li>
                  <li>&#10060; Date of Birth (DOB)</li>
                  <li>&#10060; DOD ID Number</li>
                  <li>&#10060; Home address or personal contact info</li>
                </ul>
                <p className="text-sm text-gold mt-2">
                  &#10003; Crop to select <strong>ONLY the narrative/write-up section</strong>
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-status-red/20 border border-status-red/30 rounded-lg text-status-red">
              {error}
            </div>
          )}

          {/* Step: Upload */}
          {step === 'upload' && fetchedRemaining !== undefined && fetchedRemaining <= 0 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-gold/10 flex items-center justify-center">
                <span className="text-gold text-2xl">&#9670;</span>
              </div>
              <p className="text-sm text-text-muted">
                You&apos;ve used all {fetchedLimit || 0} eval upload{(fetchedLimit || 0) !== 1 ? 's' : ''}.
              </p>
              <p className="text-sm text-text-muted">
                Paste eval text into experience bullets for free dictionary translation anytime.
              </p>
              <div className="flex flex-col gap-2 items-center">
                <UpgradeLink
                  className="px-5 py-2.5 bg-gold text-bg-primary font-heading text-xs font-bold uppercase tracking-wider rounded hover:bg-gold-bright transition-colors"
                >
                  Buy Eval Pack — $5 / 10 uploads
                </UpgradeLink>
                {!isPaidTier(getUserTier({ tier: userPlan })) && (
                  <UpgradeLink
                    className="text-xs text-text-dim hover:text-gold transition-colors"
                  >
                    or upgrade to Core for 5 uploads
                  </UpgradeLink>
                )}
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-bg-tertiary hover:bg-bg-hover border border-border text-text-muted font-semibold rounded text-sm transition-colors"
              >
                Close
              </button>
            </div>
          )}
          {step === 'upload' && (fetchedRemaining === undefined || fetchedRemaining > 0) && (
            <div className="space-y-6">
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
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Evaluation Type
                </label>
                <select
                  value={evalType}
                  onChange={(e) => setEvalType(e.target.value)}
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                >
                  <option value="">Select type...</option>
                  {EVAL_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Upload File
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-gold/50 transition-all">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/*,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="eval-upload-modal"
                    disabled={!evalType || processing}
                  />
                  <label
                    htmlFor="eval-upload-modal"
                    className={`cursor-pointer block ${!evalType || processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {processing ? (
                      <div className="animate-pulse">
                        <div className="text-4xl mb-4">&#9670;</div>
                        <p className="text-text">Processing...</p>
                      </div>
                    ) : (
                      <>
                        <svg className="w-12 h-12 mx-auto text-text-muted mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        <p className="text-text mb-1">Click to upload or drag and drop</p>
                        <p className="text-sm text-text-muted">PNG, JPG, or PDF</p>
                        <p className="text-xs text-gold mt-2">Images are processed directly - PDFs may require extra processing</p>
                      </>
                    )}
                  </label>
                </div>
                {!evalType && (
                  <p className="text-xs text-status-amber mt-2">Please select an evaluation type first</p>
                )}
              </div>

              {/* PNG Tip */}
              <div className="flex items-start gap-2 p-3 bg-bg-tertiary rounded-lg border border-border">
                <svg className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-text-muted">
                  <strong className="text-gold">Pro tip:</strong> For best results, screenshot or convert your eval write-ups to PNG images before uploading. PDFs from government systems can sometimes cause parsing issues.
                </p>
              </div>

              {/* PII Warning */}
              <div className="bg-status-red-dim border border-status-red/20 rounded-lg p-4">
                <p className="text-sm text-status-red font-medium mb-1">
                  Important: Redact Sensitive Information
                </p>
                <p className="text-xs text-text-muted">
                  Please redact any SSN, DODID, or EDIPI from your document before uploading.
                  Documents containing these identifiers will be rejected for your security.
                </p>
              </div>
            </div>
          )}

          {/* Step: Crop */}
          {step === 'crop' && imageUrl && (
            <div className="space-y-4">
              <div className="bg-bg-tertiary p-4 rounded-lg">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gold font-semibold mb-2">&#128208; Crop Instructions:</p>
                    <p className="text-sm text-text-muted">
                      Click and drag to select <strong>ONLY the narrative/write-up section</strong> of your evaluation.
                      Do not include any headers, personal information, or signature blocks.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (imgRef.current) {
                        setCropArea({
                          x: 0,
                          y: 0,
                          width: imgRef.current.clientWidth,
                          height: imgRef.current.clientHeight,
                        })
                      }
                    }}
                    className="px-4 py-2 bg-bg-secondary border border-border rounded text-sm font-semibold hover:border-gold hover:text-gold transition-all whitespace-nowrap"
                  >
                    Select Entire Page
                  </button>
                </div>
              </div>

              <div
                ref={containerRef}
                className="relative border border-border rounded-lg overflow-hidden bg-bg-secondary cursor-crosshair select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt="Evaluation"
                  className="max-w-full max-h-[50vh] pointer-events-none"
                  draggable={false}
                />

                {/* Crop overlay */}
                {cropArea && cropArea.width > 0 && cropArea.height > 0 && (
                  <>
                    {/* Darkened areas outside crop */}
                    <div className="absolute inset-0 bg-black/50 pointer-events-none" style={{
                      clipPath: `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${cropArea.x}px ${cropArea.y}px, ${cropArea.x}px ${cropArea.y + cropArea.height}px, ${cropArea.x + cropArea.width}px ${cropArea.y + cropArea.height}px, ${cropArea.x + cropArea.width}px ${cropArea.y}px, ${cropArea.x}px ${cropArea.y}px)`
                    }} />
                    {/* Crop border */}
                    <div
                      className="absolute border-2 border-gold pointer-events-none"
                      style={{
                        left: cropArea.x,
                        top: cropArea.y,
                        width: cropArea.width,
                        height: cropArea.height,
                      }}
                    />
                  </>
                )}
              </div>

              <canvas ref={canvasRef} className="hidden" />

              {cropArea && cropArea.width > 50 && cropArea.height > 50 && (
                <p className="text-sm text-status-green">&#10003; Selection ready - click "Extract Text" to continue</p>
              )}
            </div>
          )}

          {/* Step: Processing */}
          {step === 'processing' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 animate-pulse">&#9672;</div>
              <p className="font-heading text-lg uppercase tracking-wider">Extracting & Translating...</p>
              <p className="text-text-muted text-sm mt-2">Converting military language to STAR format</p>
            </div>
          )}

          {/* Step: Review */}
          {step === 'review' && (
            <div className="space-y-4">
              <div className="bg-status-green/10 border border-status-green/30 rounded-lg p-4">
                <p className="text-status-green font-semibold">&#10003; {bulletItems.length} bullets extracted and translated to STAR format</p>
                <p className="text-sm text-text-muted mt-1">
                  Review each bullet below. Accept the ones you want to keep, edit if needed, or exclude those that don't apply.
                </p>
              </div>

              {(detectedJobTitle || evalPeriod.startDate) && (
                <div className="p-3 bg-bg-tertiary rounded-lg flex flex-wrap items-center gap-4 text-sm">
                  {detectedJobTitle && (
                    <span className="text-text-muted">
                      <span className="text-gold">Position:</span> {detectedJobTitle}
                    </span>
                  )}
                  {evalPeriod.startDate && (
                    <span className="text-text-muted">
                      <span className="text-gold">Period:</span> {evalPeriod.startDate} to {evalPeriod.endDate || 'Present'}
                    </span>
                  )}
                </div>
              )}

              {experiences.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                    Add bullets to experience
                  </label>
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold"
                  >
                    <option value="">Create new experience entry</option>
                    {experiences.map((exp) => (
                      <option key={exp.id} value={exp.id}>
                        {exp.job_title} at {exp.organization} ({exp.start_date} - {exp.end_date || 'Present'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Header with Accept All button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Bullets ({acceptedBullets.length} of {bulletItems.length} accepted)
                  </label>
                  {pendingBullets.length > 0 && (
                    <button
                      onClick={acceptAllBullets}
                      className="flex items-center gap-1 px-3 py-1 bg-status-green-dim text-status-green border border-status-green/30 rounded text-xs hover:bg-status-green/20 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Accept All ({pendingBullets.length})
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setShowOriginal(!showOriginal)}
                  className="text-xs text-gold hover:underline"
                >
                  {showOriginal ? 'Show Translated' : 'Show Original'}
                </button>
              </div>

              <div className="space-y-3 max-h-[40vh] overflow-auto">
                {bulletItems.map((bullet) => (
                  <div
                    key={bullet.id}
                    className={`p-4 rounded-lg border transition-all ${
                      bullet.status === 'excluded'
                        ? 'bg-bg-tertiary border-border/50 opacity-50'
                        : bullet.status === 'accepted'
                          ? 'bg-status-green/5 border-status-green/30'
                          : 'bg-bg-secondary border-border'
                    }`}
                  >
                    {/* Status badge */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {bullet.status === 'accepted' && (
                          <span className="px-2 py-0.5 text-xs bg-status-green-dim text-status-green rounded">Accepted</span>
                        )}
                        {bullet.status === 'excluded' && (
                          <span className="px-2 py-0.5 text-xs bg-bg-tertiary text-text-dim rounded">Excluded</span>
                        )}
                        {bullet.status === 'pending' && (
                          <span className="px-2 py-0.5 text-xs bg-status-amber-dim text-status-amber rounded">Pending</span>
                        )}
                      </div>
                    </div>

                    {/* Bullet content */}
                    {editingBulletId === bullet.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="w-full bg-bg-tertiary border border-border rounded px-3 py-2 text-text text-sm resize-none focus:border-gold focus:ring-1 focus:ring-gold/25"
                          rows={3}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={cancelEditBullet}
                            className="px-3 py-1 text-sm text-text-muted hover:text-text"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={saveEditBullet}
                            className="px-3 py-1 text-sm bg-gold text-bg-primary rounded hover:bg-gold/90"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {showOriginal ? (
                          <div className="mb-3">
                            <p className="text-xs text-text-dim uppercase mb-1">Original:</p>
                            <p className="text-sm text-text-muted italic">{bullet.original}</p>
                          </div>
                        ) : (
                          <div className="mb-3">
                            <p className="text-xs text-gold uppercase mb-1">Translated:</p>
                            <p className="text-sm text-text">{bullet.translated}</p>
                          </div>
                        )}

                        {/* Metrics and skills */}
                        {(bullet.metrics.length > 0 || bullet.skills.length > 0) && (
                          <div className="mb-3 flex flex-wrap gap-2">
                            {bullet.metrics.map((metric, mIdx) => (
                              <span key={`m-${mIdx}`} className="px-2 py-0.5 text-xs bg-status-green/20 text-status-green rounded">
                                {metric}
                              </span>
                            ))}
                            {bullet.skills.map((skill, sIdx) => (
                              <span key={`s-${sIdx}`} className="px-2 py-0.5 text-xs bg-gold/20 text-gold rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                          {bullet.status !== 'accepted' && (
                            <button
                              onClick={() => acceptBullet(bullet.id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-status-green-dim text-status-green border border-status-green/30 rounded text-xs hover:bg-status-green/20"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Accept
                            </button>
                          )}
                          <button
                            onClick={() => retryBullet(bullet.id)}
                            disabled={retryingBulletId === bullet.id}
                            className="flex items-center gap-1 px-3 py-1.5 bg-status-blue/20 text-status-blue border border-status-blue/30 rounded text-xs hover:bg-status-blue/30 disabled:opacity-50"
                          >
                            <svg className={`w-3 h-3 ${retryingBulletId === bullet.id ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {retryingBulletId === bullet.id ? 'Retrying...' : 'Retry'}
                          </button>
                          <button
                            onClick={() => startEditBullet(bullet.id, bullet.translated)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-status-amber-dim text-status-amber border border-status-amber/30 rounded text-xs hover:bg-status-amber/20"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Edit
                          </button>
                          {bullet.status !== 'excluded' ? (
                            <button
                              onClick={() => excludeBullet(bullet.id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-bg-tertiary text-text-muted border border-border rounded text-xs hover:bg-bg-tertiary/80"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" />
                              </svg>
                              Exclude
                            </button>
                          ) : (
                            <button
                              onClick={() => acceptBullet(bullet.id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-bg-tertiary text-text-muted border border-border rounded text-xs hover:bg-bg-tertiary/80"
                            >
                              Restore
                            </button>
                          )}
                          <button
                            onClick={() => deleteBullet(bullet.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-status-red-dim text-status-red border border-status-red/30 rounded text-xs hover:bg-status-red/20"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-xs text-text-dim">
                &#10003; Original file has been discarded - only extracted text will be saved
              </p>
            </div>
          )}
        </div>

        {/* Footer - stack buttons on mobile */}
        <div className="p-4 md:p-6 border-t border-border flex flex-col-reverse md:flex-row gap-3 safe-area-inset-bottom">
          <button
            onClick={handleClose}
            className="w-full md:w-auto px-6 py-3.5 md:py-3 bg-bg-tertiary border border-border rounded-lg md:rounded font-heading font-bold uppercase tracking-wider hover:bg-bg-hover active:bg-bg-hover transition-all min-h-[48px]"
          >
            Cancel
          </button>

          {step === 'crop' && (
            <button
              onClick={handleCropComplete}
              disabled={!cropArea || cropArea.width < 50 || cropArea.height < 50 || processing}
              className="flex-1 px-6 py-3.5 md:py-3 bg-gold text-bg-primary rounded-lg md:rounded font-heading font-bold uppercase tracking-wider text-sm hover:bg-gold-bright active:bg-gold-bright disabled:opacity-50 transition-all min-h-[48px]"
            >
              {processing ? 'Processing...' : 'Extract Text'}
            </button>
          )}

          {step === 'review' && (
            <button
              onClick={handleSaveBullets}
              disabled={acceptedBullets.length === 0 || savingToExperience}
              className="flex-1 px-6 py-3.5 md:py-3 bg-gold text-bg-primary rounded-lg md:rounded font-heading font-bold uppercase tracking-wider text-sm hover:bg-gold-bright active:bg-gold-bright disabled:opacity-50 transition-all min-h-[48px]"
            >
              {savingToExperience
                ? 'Saving...'
                : selectedExperience
                  ? `Save ${acceptedBullets.length} Bullets`
                  : `Continue (${acceptedBullets.length})`
              }
            </button>
          )}
        </div>

        {/* Unsaved bullets confirmation dialog */}
        {showCloseConfirm && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 rounded-t-2xl md:rounded-lg">
            <div className="bg-bg-card border border-border rounded-lg p-6 mx-4 max-w-sm shadow-xl">
              <h3 className="font-heading text-base font-bold uppercase mb-2">Unsaved Bullets</h3>
              <p className="text-sm text-text-muted mb-4">
                You have {bulletItems.length} extracted bullet{bulletItems.length !== 1 ? 's' : ''} that haven&apos;t been saved.
                You can re-import them later from your Eval History on the Profile page.
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
