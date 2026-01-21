'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

interface ExportMenuProps {
  resumeId: string
  resumeName: string
  userId: string
  template: string
  onLimitReached?: (error: string, tier: string) => void
}

export function ExportMenu({ resumeId, resumeName, userId, template, onLimitReached }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [exporting, setExporting] = useState<'pdf' | 'docx' | null>(null)
  const [limitError, setLimitError] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleExport = async (format: 'pdf' | 'docx') => {
    // DEBUG logging
    console.log('=== ExportMenu DEBUG ===')
    console.log('Props received:', { resumeId, userId, resumeName, format, template })
    console.log('resumeId type:', typeof resumeId, '| empty?:', !resumeId || resumeId === '')
    console.log('userId type:', typeof userId, '| empty?:', !userId || userId === '')

    // Validate props - check for empty strings too
    if (!resumeId || resumeId === '' || resumeId === 'undefined' || resumeId === 'null') {
      console.error('ExportMenu: resumeId is invalid:', resumeId)
      alert('Cannot export: No resume selected')
      return
    }

    if (!userId || userId === '' || userId === 'undefined' || userId === 'null') {
      console.error('ExportMenu: userId is invalid:', userId)
      alert('Cannot export: User not authenticated')
      return
    }

    setExporting(format)
    setIsOpen(false)

    try {
      const res = await fetch('/api/export-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId, userId, format, template }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        console.error('Export failed:', res.status, data)

        // Handle limit reached errors
        if (res.status === 403 && data.limitReached) {
          setLimitError(data.error)
          if (onLimitReached) {
            onLimitReached(data.error, data.tier)
          }
          return
        }

        alert(data.error || `Export failed with status ${res.status}`)
        return
      }

      // Clear any previous limit error on successful download
      setLimitError(null)

      // Download the file
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${resumeName || 'resume'}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export')
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Limit Error Toast */}
      {limitError && (
        <div className="absolute right-0 bottom-full mb-2 w-72 bg-status-amber-dim border border-status-amber/30 rounded-lg shadow-lg z-20 p-3">
          <p className="text-sm text-status-amber mb-2">{limitError}</p>
          <Button
            size="sm"
            onClick={() => router.push('/pricing')}
          >
            Upgrade Now
          </Button>
          <button
            onClick={() => setLimitError(null)}
            className="absolute top-2 right-2 text-status-amber/50 hover:text-status-amber"
          >
            ✕
          </button>
        </div>
      )}

      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        disabled={exporting !== null}
      >
        {exporting ? `Exporting ${exporting.toUpperCase()}...` : '↓ Export'}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-bg-card border border-border rounded-lg shadow-lg z-10 overflow-hidden">
          <button
            onClick={() => handleExport('pdf')}
            className="w-full px-4 py-3 text-left hover:bg-bg-tertiary transition-colors flex items-center gap-3"
          >
            <span className="text-status-red">◈</span>
            <div>
              <div className="font-heading text-sm uppercase">PDF</div>
              <div className="text-xs text-text-muted">Best for sharing</div>
            </div>
          </button>
          <button
            onClick={() => handleExport('docx')}
            className="w-full px-4 py-3 text-left hover:bg-bg-tertiary transition-colors flex items-center gap-3 border-t border-border"
          >
            <span className="text-status-blue">◫</span>
            <div>
              <div className="font-heading text-sm uppercase">DOCX</div>
              <div className="text-xs text-text-muted">Best for ATS & editing</div>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
