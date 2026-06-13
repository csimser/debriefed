'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { parseEval, extractEvalImage } from '@/lib/ai/evalParse'
import { parseAndTranslateEvalText } from '@/lib/dictionary/evalParser'
import { translateBullet as aiTranslateBullet } from '@/lib/ai/translate'
import { classifyAIError, hasApiKey } from '@/lib/ai/client'
import { KeySetupModal } from '@/components/settings/KeySetupModal'
import { OutputModeLabel } from '@/components/ai/OutputModeLabel'
import { useApiKey } from '@/hooks/useApiKey'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { listExperiences, saveExperience, saveEvalUpload, newId, getProfile } from '@/lib/storage'

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
  /** Legacy prop, no longer used (data is local). Kept for compatibility. */
  userId?: string
  experiences?: Array<{ id: string; job_title: string; organization: string; start_date: string; end_date: string }>
  defaultExperienceId?: string
  /** Legacy props, no longer used (no tiers or limits). Kept for compatibility. */
  userPlan?: string
  evalRemaining?: number
  evalLimit?: number
}

const EVAL_TYPES = [
  { value: 'fitrep', label: 'FITREP — Navy Officer' },
  { value: 'chiefeval', label: 'CHIEFEVAL — Navy Chief (E7–E9)' },
  { value: 'eval', label: 'EVAL — Navy Enlisted (E1–E6)' },
  { value: 'ncoer', label: 'NCOER — Army NCO' },
  { value: 'oer', label: 'OER — Army Officer' },
  { value: 'epr', label: 'EPR — Air Force Enlisted' },
  { value: 'opr', label: 'OPR — Air Force Officer' },
  { value: 'other', label: 'Other Evaluation' },
]

export function EvalUploadModal({ isOpen, onClose, onExtracted, onBulletsSaved, experiences = [], defaultExperienceId }: EvalUploadModalProps) {
  const [step, setStep] = useState<'upload' | 'processing' | 'review' | 'done'>('upload')
  const [inputTab, setInputTab] = useState<'paste' | 'file'>('paste')
  const [pasteText, setPasteText] = useState('')
  const [sourceMode, setSourceMode] = useState<'dictionary' | 'ai' | null>(null)
  const [savingToExperience, setSavingToExperience] = useState(false)
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
  const [savedCount, setSavedCount] = useState(0)
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)

  // API key state — pasting eval text never needs a key; file reading (Claude
  // vision) does. The key dialog is offered at the action point, never as a wall.
  const { hasKey } = useApiKey()
  const online = useOnlineStatus()
  const [keyJustSaved, setKeyJustSaved] = useState(false)
  const [keyModalOpen, setKeyModalOpen] = useState(false)
  const effectiveHasKey = hasKey || keyJustSaved

  // Remembers an AI action blocked on the key so it can re-run after key save
  const pendingActionRef = useRef<(() => void) | null>(null)

  const requireApiKey = (action: () => void): boolean => {
    if (hasApiKey()) return true
    pendingActionRef.current = action
    setKeyModalOpen(true)
    return false
  }

  const handleKeySaved = () => {
    setKeyJustSaved(true)
    const action = pendingActionRef.current
    pendingActionRef.current = null
    action?.()
  }

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) resetState()
  }, [isOpen])

  const resetState = () => {
    setFile(null)
    setInputTab('paste')
    setPasteText('')
    setSourceMode(null)
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
    setKeyModalOpen(false)
    pendingActionRef.current = null
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

  // Read a File as base64 (data: prefix stripped)
  const fileToBase64 = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        resolve(dataUrl.split(',')[1])
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(f)
    })

  // Process a selected file — extraction runs Claude vision on the user's key
  const processFile = async (selectedFile: File) => {
    // File reading needs a key. Keep the file selected and let the inline note
    // in the file tab offer the key dialog — no blocking wall. After the key
    // is saved, processing resumes with this same file.
    if (!hasApiKey()) {
      setFile(selectedFile)
      pendingActionRef.current = () => processFile(selectedFile)
      return
    }

    setFile(selectedFile)
    setStep('processing')
    setProcessing(true)

    try {
      let data

      if (selectedFile.type === 'application/pdf') {
        // PDF path: base64 → parseEval (single-pass PDF extraction)
        const base64 = await fileToBase64(selectedFile)
        data = await parseEval({
          fileBase64: base64,
          mediaType: 'application/pdf',
          fileName: selectedFile.name,
          evalType,
        })
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

        // Image path: base64 → extractEvalImage (image-only OCR extraction)
        const base64 = await fileToBase64(imageFile)
        data = await extractEvalImage({
          fileBase64: base64,
          mediaType: imageFile.type,
          fileName: imageFile.name,
          evalType,
        })
      } else {
        setError('Please upload a PDF or image file (PNG, JPG, HEIC)')
        setStep('upload')
        return
      }

      // Capture PII warning (non-blocking)
      if (data.piiWarning) {
        setPiiWarning(data.piiWarning)
      }

      if (!data.bullets?.length) {
        setError('No bullets could be extracted. Try a clearer image or different file.')
        setStep('upload')
        return
      }

      // Persist eval history locally so past uploads stay re-importable
      saveEvalUpload({
        id: newId(),
        file_name: selectedFile.name,
        file_type: selectedFile.type,
        eval_type: evalType,
        extracted_data: data.bullets as any,
        status: 'completed',
      })

      setSourceMode('ai')
      processBulletData(data)
    } catch (err: any) {
      console.error('File processing error:', err)
      setError(classifyAIError(err).message || err?.message || 'Failed to process file. Please try again.')
      setStep('upload')
    } finally {
      setProcessing(false)
    }
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

    await processFile(selectedFile)
  }

  // Translate pasted eval text — the keyless path. Dictionary engine only,
  // runs entirely on-device: clean → parse → strip praise → translate → STAR.
  const handlePasteTranslate = async () => {
    const text = pasteText.trim()
    if (text.length < 40) return

    setError('')
    setPiiWarning(null)
    setStep('processing')
    setProcessing(true)

    try {
      const profile = getProfile()
      const parsed = await parseAndTranslateEvalText(
        text,
        (profile?.branch as string) || '',
        (profile?.rank as string) || '',
      )

      if (!parsed.length) {
        setError('No bullets could be extracted from that text. Paste the performance comments block from your eval — the narrative section with your accomplishments.')
        setStep('upload')
        return
      }

      // Same shape the file path produces, so review + history stay identical
      const bullets = parsed.map(b => ({
        original: b.original,
        translated: b.translated,
        metrics: [] as string[],
        skills: [] as string[],
      }))

      // Persist eval history locally, same as the file path
      saveEvalUpload({
        id: newId(),
        file_name: 'Pasted eval',
        file_type: 'text/plain',
        eval_type: evalType,
        extracted_data: bullets as any,
        status: 'completed',
      })

      setSourceMode('dictionary')
      processBulletData({ bullets })
    } catch (err: any) {
      console.error('Paste translation error:', err)
      setError(err?.message || 'Failed to translate the pasted text. Please try again.')
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

    // AI action — requires the user's Anthropic API key
    if (!requireApiKey(() => retryBullet(bulletId))) return

    setRetryingBulletId(bulletId)
    try {
      const data = await aiTranslateBullet(bullet.original, { jobType: 'private' })
      if (data.translated) {
        setBulletItems(prev => prev.map(b =>
          b.id === bulletId ? { ...b, translated: data.translated } : b
        ))
      }
    } catch (err) {
      console.error('Retry failed:', err)
      setError(classifyAIError(err).message)
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

      const allExperiences = listExperiences()

      for (const [expId, bullets] of Object.entries(grouped)) {
        const targetExp = expId === '__new__' || !expId
          ? undefined
          : allExperiences.find(e => e.id === expId)

        if (!targetExp) {
          onExtracted(bullets, null)
          continue
        }

        // Append after the current max sort_order for this experience
        const existingBullets = targetExp.bullets || []
        const startOrder = existingBullets.reduce(
          (max, b) => Math.max(max, b.sort_order ?? -1),
          -1,
        )

        const bulletsToInsert = bullets.map((b, idx) => ({
          id: newId(),
          experience_id: targetExp.id,
          original_text: b.original,
          translated_text: b.translated,
          sort_order: startOrder + idx + 1,
          status: 'accepted',
        }))

        saveExperience({
          ...targetExp,
          bullets: [...existingBullets, ...bulletsToInsert],
        })
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
          {step === 'upload' && (
            <div className="space-y-5">
              {/* Eval type selector — required for file reading, optional for paste */}
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

              {/* Input tabs */}
              <div className="flex border-b border-border">
                <button
                  onClick={() => setInputTab('paste')}
                  className={`px-4 py-2.5 text-sm font-heading uppercase tracking-wider transition-colors ${
                    inputTab === 'paste'
                      ? 'text-gold border-b-2 border-gold'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  Paste Eval Text
                </button>
                <button
                  onClick={() => setInputTab('file')}
                  className={`px-4 py-2.5 text-sm font-heading uppercase tracking-wider transition-colors ${
                    inputTab === 'file'
                      ? 'text-gold border-b-2 border-gold'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  Upload File
                </button>
              </div>

              {inputTab === 'paste' ? (
                /* ── Paste eval text — works without a key, fully on-device ── */
                <div className="space-y-3">
                  <textarea
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    placeholder="Paste the performance comments from your eval here — the narrative block with your accomplishments..."
                    rows={10}
                    className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-lg text-base md:text-sm focus:border-gold focus:ring-1 focus:ring-gold/25 transition-all resize-y"
                    autoComplete="off"
                  />
                  <p className="text-xs text-text-dim">
                    {pasteText.length > 0
                      ? `${pasteText.length} characters`
                      : 'Copy the comments block from your eval and paste it above'}
                  </p>
                  <button
                    onClick={handlePasteTranslate}
                    disabled={pasteText.trim().length < 40 || processing}
                    className="w-full px-5 py-3 bg-gold text-bg-primary rounded font-heading font-bold uppercase tracking-wider text-sm hover:bg-gold-bright disabled:opacity-50 transition-colors"
                  >
                    {processing ? 'Translating...' : 'Translate Bullets'}
                  </button>
                  <p className="text-xs text-text-dim text-center">
                    Translation runs entirely on your device — works offline, no API key needed.
                  </p>
                </div>
              ) : (
                /* ── File upload — reading PDFs/photos uses Claude vision ── */
                <div className="space-y-4">
                  <div>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-gold/50 transition-all">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/heic,image/heif,image/*,.pdf,.heic,.heif"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="eval-upload-modal"
                        disabled={!evalType || processing || !online}
                      />
                      <label
                        htmlFor="eval-upload-modal"
                        className={`cursor-pointer block ${!evalType || processing || !online ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={!online ? 'Reading files uses Claude and needs internet. Pasting eval text works offline.' : undefined}
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
                    {!online && (
                      <p className="text-xs text-text-muted mt-2">
                        Reading files needs internet. Pasting eval text works offline.
                      </p>
                    )}
                  </div>

                  {/* File selected while no key is set — held, not lost */}
                  {file && !effectiveHasKey && (
                    <div className="p-3 bg-bg-tertiary rounded-lg flex items-center justify-between">
                      <p className="text-sm text-text truncate">{file.name}</p>
                      <button onClick={() => { setFile(null); pendingActionRef.current = null }} className="p-1.5 text-text-muted hover:text-text flex-shrink-0 ml-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Reading files uses Claude vision — friendly note, never a wall */}
                  {!effectiveHasKey && (
                    <div className="p-4 bg-bg-tertiary border border-border rounded-lg space-y-3">
                      <p className="text-sm text-text-muted">
                        Reading eval files uses Claude (optional). {file ? 'Add a key to read the selected file, or paste your eval text — that works without one.' : 'Add a key, or paste your eval text — that works without one.'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setKeyModalOpen(true)}
                          className="px-3 py-1.5 bg-gold/20 text-gold border border-gold/30 rounded text-xs font-semibold hover:bg-gold/30 transition-colors"
                        >
                          Add API key
                        </button>
                        <button
                          onClick={() => setInputTab('paste')}
                          className="px-3 py-1.5 bg-bg-secondary border border-border rounded text-xs font-semibold text-text-muted hover:text-text transition-colors"
                        >
                          Paste text instead
                        </button>
                      </div>
                    </div>
                  )}

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

              {/* Accept All + counter + output source */}
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={acceptAll}
                  className="px-4 py-2 bg-status-green/10 text-status-green border border-status-green/30 rounded text-sm font-medium hover:bg-status-green/20 transition-colors"
                >
                  Accept All ({bulletItems.length})
                </button>
                <span className="flex items-center gap-2 text-xs text-text-muted">
                  {sourceMode && <OutputModeLabel mode={sourceMode} />}
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

        {/* API key setup — offered at the file-reading action point; pasted text never needs it */}
        <KeySetupModal
          isOpen={keyModalOpen}
          onClose={() => setKeyModalOpen(false)}
          onKeySaved={handleKeySaved}
          featureNote="Reading eval files (PDF or photo) uses Claude vision. Pasting eval text works without a key."
        />

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
