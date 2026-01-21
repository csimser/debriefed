'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SUMMARY_TEMPLATES, TEMPLATE_CATEGORIES, getTemplatesByCategory, SummaryTemplate } from '@/lib/summaryTemplates'
import { populateTemplate, ProfileData } from '@/lib/populateTemplate'

interface ProfessionalSummaryEditorProps {
  resumeId: string
  summary: string
  profileSummary?: string
  profile?: ProfileData
  onUpdate: (summary: string) => void
}

const MAX_CHARS = 1500
const RECOMMENDED_MIN = 200
const RECOMMENDED_MAX = 500

export function ProfessionalSummaryEditor({
  resumeId,
  summary,
  profileSummary,
  profile,
  onUpdate
}: ProfessionalSummaryEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedSummary, setEditedSummary] = useState(summary || profileSummary || '')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const supabase = createClient()

  // Update local state when summary prop changes
  useEffect(() => {
    setEditedSummary(summary || profileSummary || '')
  }, [summary, profileSummary])

  const filteredTemplates = getTemplatesByCategory(selectedCategory)
  const charCount = editedSummary.length
  const isOverLimit = charCount > MAX_CHARS
  const isUnderRecommended = charCount > 0 && charCount < RECOMMENDED_MIN
  const isOverRecommended = charCount > RECOMMENDED_MAX

  const handleSelectTemplate = (template: SummaryTemplate) => {
    if (profile) {
      const populated = populateTemplate(template.template, profile)
      setEditedSummary(populated)
    } else {
      // Fallback: use template as-is with placeholders
      setEditedSummary(template.template)
    }
    setShowTemplates(false)
  }

  const handleSave = async () => {
    if (isOverLimit) return

    setIsSaving(true)
    try {
      // Save to resume's professional_summary field
      const { error } = await supabase
        .from('resumes')
        .update({ professional_summary: editedSummary || null })
        .eq('id', resumeId)

      if (!error) {
        onUpdate(editedSummary)
        setIsEditing(false)
        setShowTemplates(false)
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedSummary(summary || profileSummary || '')
    setIsEditing(false)
    setShowTemplates(false)
  }

  const handleEnhance = async () => {
    if (!editedSummary.trim()) return

    setIsEnhancing(true)
    try {
      const response = await fetch('/api/enhance-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: editedSummary,
          profile: profile ? {
            rank: profile.rank,
            branch: profile.branch,
            yearsOfService: profile.yearsOfService,
            mos: profile.mos,
            targetRole: profile.targetRole,
            targetIndustry: profile.targetIndustry,
          } : undefined
        }),
      })

      if (response.ok) {
        const { enhanced } = await response.json()
        if (enhanced) {
          setEditedSummary(enhanced)
        }
      }
    } catch (error) {
      console.error('Enhancement failed:', error)
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleResetToProfile = async () => {
    if (profileSummary) {
      setEditedSummary(profileSummary)
    } else {
      setEditedSummary('')
    }
  }

  const handleClearOverride = async () => {
    // Clear the resume-specific override, falling back to profile
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('resumes')
        .update({ professional_summary: null })
        .eq('id', resumeId)

      if (!error) {
        onUpdate(profileSummary || '')
        setEditedSummary(profileSummary || '')
        setIsEditing(false)
      }
    } finally {
      setIsSaving(false)
    }
  }

  // Determine if current summary differs from profile default
  const isOverridden = summary && summary !== profileSummary

  return (
    <div className="bg-bg-tertiary border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm text-gold uppercase tracking-wider font-semibold">
            Professional Summary
          </h3>
          {isOverridden && (
            <span className="text-xs px-2 py-0.5 bg-gold/20 text-gold rounded">
              Custom for this resume
            </span>
          )}
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-xs bg-bg-secondary hover:bg-bg-hover text-text-muted rounded transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div className="relative">
            <textarea
              value={editedSummary}
              onChange={(e) => setEditedSummary(e.target.value)}
              rows={6}
              placeholder="Write a compelling professional summary that highlights your experience, key skills, and what you bring to employers..."
              className={`w-full bg-bg-secondary border rounded-lg p-3 text-text-primary text-sm resize-none focus:ring-1 transition-all ${
                isOverLimit
                  ? 'border-status-red focus:border-status-red focus:ring-status-red/25'
                  : 'border-border focus:border-gold focus:ring-gold/25'
              }`}
            />

            {/* Character count */}
            <div className={`absolute bottom-2 right-2 text-xs ${
              isOverLimit ? 'text-status-red' :
              isOverRecommended ? 'text-status-amber' :
              isUnderRecommended ? 'text-text-dim' :
              'text-status-green'
            }`}>
              {charCount}/{MAX_CHARS}
              {charCount > 0 && charCount < RECOMMENDED_MIN && (
                <span className="ml-1 text-text-dim">(min {RECOMMENDED_MIN} recommended)</span>
              )}
            </div>
          </div>

          {/* Action buttons row */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Template Button */}
              <button
                type="button"
                onClick={() => setShowTemplates(!showTemplates)}
                className="flex items-center gap-2 px-3 py-1.5 bg-bg-secondary hover:bg-bg-hover border border-border text-text-muted hover:text-text text-xs font-semibold rounded transition-colors"
              >
                <span>&#128203;</span>
                {showTemplates ? 'Hide Templates' : 'Choose Template'}
              </button>

              {/* Enhance Button */}
              <button
                type="button"
                onClick={handleEnhance}
                disabled={isEnhancing || !editedSummary.trim()}
                className="flex items-center gap-2 px-3 py-1.5 bg-gold/20 hover:bg-gold/30 border border-gold/50 disabled:bg-bg-tertiary disabled:border-border disabled:cursor-not-allowed text-gold disabled:text-text-dim text-xs font-semibold rounded transition-colors"
              >
                {isEnhancing ? (
                  <>
                    <span className="animate-spin">&#8635;</span>
                    Enhancing...
                  </>
                ) : (
                  <>
                    <span>&#10024;</span>
                    Enhance
                  </>
                )}
              </button>

              {/* Reset to Profile button */}
              {profileSummary && editedSummary !== profileSummary && (
                <button
                  onClick={handleResetToProfile}
                  className="px-3 py-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
                >
                  ↩ Reset to Profile
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 bg-bg-secondary hover:bg-bg-hover text-text-muted text-xs font-semibold rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || isOverLimit}
                className="px-3 py-1.5 bg-gold hover:bg-gold-bright text-bg-primary text-xs font-semibold rounded transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          {/* Template Selector Panel */}
          {showTemplates && (
            <div className="border border-border rounded-lg bg-bg-card overflow-hidden">
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-1 p-2 bg-bg-tertiary border-b border-border">
                {TEMPLATE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-gold text-bg-primary'
                        : 'bg-bg-secondary text-text-muted hover:bg-bg-hover hover:text-text'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Template List */}
              <div className="max-h-48 overflow-y-auto p-2 space-y-2">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleSelectTemplate(template)}
                    className="w-full text-left p-3 rounded-lg bg-bg-tertiary hover:bg-bg-hover border border-border hover:border-gold/50 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-text group-hover:text-gold">
                        {template.name}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-bg-secondary text-text-dim rounded">
                        {template.category}
                      </span>
                    </div>
                    <p className="text-xs text-text-dim">{template.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-text-dim">
            Tip: A good summary is 2-4 sentences ({RECOMMENDED_MIN}-{RECOMMENDED_MAX} characters) highlighting your experience, key skills, and value to employers.
          </p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {summary || profileSummary || (
              <span className="text-text-dim italic">
                No professional summary yet. Click Edit to add one.
              </span>
            )}
          </p>

          {/* Show "Clear override" option when viewing a custom summary */}
          {isOverridden && (
            <button
              onClick={handleClearOverride}
              disabled={isSaving}
              className="mt-3 text-xs text-text-dim hover:text-text-muted transition-colors"
            >
              ↩ Use profile default instead
            </button>
          )}
        </div>
      )}
    </div>
  )
}
