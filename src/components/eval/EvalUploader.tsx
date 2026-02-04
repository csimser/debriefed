'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface EvalUploaderProps {
  userId: string
  currentUsage: number
  usageLimit: number
  onUploadComplete: (bullets: any[]) => void
}

const EVAL_TYPES = [
  { id: 'fitrep', name: 'FITREP', branch: 'Navy' },
  { id: 'chiefeval', name: 'Chief Eval', branch: 'Navy' },
  { id: 'ncoer', name: 'NCOER', branch: 'Army' },
  { id: 'oer', name: 'OER', branch: 'Army/Navy' },
  { id: 'epr', name: 'EPR', branch: 'Air Force' },
  { id: 'award', name: 'Award/NAM/COM', branch: 'All' },
]

export function EvalUploader({ userId, currentUsage, usageLimit, onUploadComplete }: EvalUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [evalType, setEvalType] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [extractedBullets, setExtractedBullets] = useState<any[]>([])

  const remaining = usageLimit - currentUsage

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setError('')
      setExtractedBullets([])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const handleUpload = async () => {
    if (!file || !evalType) {
      setError('Please select a file and evaluation type')
      return
    }

    if (remaining <= 0) {
      setError('You have reached your upload limit. Upgrade to Core for more.')
      return
    }

    setUploading(true)
    setError('')

    try {
      // Convert file to base64
      const base64 = await fileToBase64(file)

      const res = await fetch('/api/parse-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          filename: file.name,
          fileData: base64,
          evalType,
        }),
      })

      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        setExtractedBullets(data.bullets || [])
        onUploadComplete(data.bullets || [])
      }
    } catch (err) {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Usage Banner */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider flex items-center gap-2">
          <span className="text-gold">◈</span> Upload Evaluations
        </h3>
        <Badge variant={remaining <= 1 ? 'red' : remaining <= 2 ? 'amber' : 'default'}>
          {remaining} Upload{remaining !== 1 ? 's' : ''} Remaining
        </Badge>
      </div>

      {/* Eval Type Selector */}
      <div className="space-y-2">
        <label className="block font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
          Evaluation Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {EVAL_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setEvalType(type.id)}
              className={`p-3 rounded-lg text-left transition-all ${
                evalType === type.id
                  ? 'bg-gold-dim border border-gold/30'
                  : 'bg-bg-tertiary hover:bg-bg-hover border border-transparent'
              }`}
            >
              <div className="font-heading text-sm font-bold">{type.name}</div>
              <div className="text-xs text-text-muted">{type.branch}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-gold bg-gold-dim'
            : file
            ? 'border-status-green bg-status-green-dim'
            : 'border-border hover:border-border-bright'
        }`}
      >
        <input {...getInputProps()} />

        {file ? (
          <div>
            <div className="text-status-green text-2xl mb-2">✓</div>
            <p className="font-heading text-sm">{file.name}</p>
            <p className="text-xs text-text-muted mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setFile(null)
                setExtractedBullets([])
              }}
              className="text-xs text-text-muted hover:text-status-red mt-2"
            >
              Remove
            </button>
          </div>
        ) : (
          <div>
            <div className="text-text-dim text-3xl mb-2">◫</div>
            <p className="font-heading text-sm uppercase">
              {isDragActive ? 'Drop PDF here' : 'Drag & drop PDF or click to browse'}
            </p>
            <p className="text-xs text-text-muted mt-2">
              FITREP, CHIEFEVAL, NCOER, EPR, or Award • Max 10MB
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-status-red-dim border border-status-red/20 rounded-md p-3">
          <p className="text-sm text-status-red">{error}</p>
        </div>
      )}

      {/* Upload Button */}
      <Button
        className="w-full"
        onClick={handleUpload}
        disabled={!file || !evalType || uploading || remaining <= 0}
      >
        {uploading ? 'Extracting Bullets...' : '✦ Extract Achievement Bullets'}
      </Button>

      {/* Extracted Bullets */}
      {extractedBullets.length > 0 && (
        <ExtractedBulletsDisplay bullets={extractedBullets} />
      )}
    </div>
  )
}

function ExtractedBulletsDisplay({ bullets }: { bullets: any[] }) {
  return (
    <Card className="p-4 border-gold/30">
      <h4 className="font-heading text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
        <span className="text-gold">✦</span> Extracted Bullets ({bullets.length})
      </h4>
      <div className="space-y-3">
        {bullets.map((bullet, idx) => (
          <div key={idx} className="p-3 bg-bg-tertiary rounded-lg">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm flex-1">{bullet.original}</p>
              <Badge variant={
                bullet.category === 'leadership' ? 'gold' :
                bullet.category === 'technical' ? 'blue' :
                'green'
              }>
                {bullet.category}
              </Badge>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-text-muted mt-4">
        These bullets have been saved. Add them to your experiences in the Profile section.
      </p>
    </Card>
  )
}

// Helper function
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      // Remove the data:application/pdf;base64, prefix
      resolve(result.split(',')[1])
    }
    reader.onerror = (error) => reject(error)
  })
}
