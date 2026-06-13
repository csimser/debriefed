'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { DownloadCelebration } from '@/components/resume/DownloadCelebration'
import { exportResume } from '@/lib/export/resumeExport'

interface ExportMenuProps {
  resumeName: string
  /** Resume content to export — generated entirely client-side. */
  content: Record<string, unknown>
  template: string
  resumeType?: 'private' | 'federal'
  isUntitled?: boolean
  onBeforeExport?: () => Promise<void>
  compact?: boolean
}

export function ExportMenu({ resumeName, content, template, resumeType = 'private', isUntitled, onBeforeExport, compact }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [exporting, setExporting] = useState<'pdf' | 'docx' | null>(null)
  const [celebration, setCelebration] = useState<{ fileName: string; format: 'pdf' | 'docx' } | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const dismissCelebration = useCallback(() => setCelebration(null), [])

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
    // Block export for untitled resumes
    if (isUntitled) return

    if (!content) {
      alert('Cannot export: No resume selected')
      return
    }

    setExporting(format)
    setIsOpen(false)

    try {
      // Force save before export to avoid stale data
      if (onBeforeExport) {
        await onBeforeExport()
      }

      // Generate and download the file entirely in the browser
      await exportResume({
        content,
        resumeType,
        format,
        template,
        fileName: resumeName || 'resume',
      })

      // Trigger celebration animation
      setCelebration({ fileName: resumeName || 'resume', format })
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export')
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Download Celebration Overlay */}
      {celebration && (
        <DownloadCelebration
          fileName={celebration.fileName}
          format={celebration.format}
          onDismiss={dismissCelebration}
        />
      )}

      <div className="flex flex-col items-end gap-1">
        <Button
          variant={compact ? 'primary' : 'secondary'}
          size={compact ? 'sm' : undefined}
          onClick={() => setIsOpen(!isOpen)}
          disabled={exporting !== null || isUntitled}
        >
          {exporting ? (compact ? '...' : `Exporting ${exporting.toUpperCase()}...`) : 'Export'}
        </Button>
        {!compact && isUntitled && (
          <span className="text-[10px] text-gold whitespace-nowrap">
            Name your resume to export
          </span>
        )}
      </div>

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
