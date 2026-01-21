'use client'

import { useState } from 'react'
import { SUMMARY_TEMPLATES, TEMPLATE_CATEGORIES, getTemplatesByCategory, SummaryTemplate } from '@/lib/summaryTemplates'
import { populateTemplate, ProfileData } from '@/lib/populateTemplate'

interface ProfessionalSummaryEditorProps {
  value: string
  onChange: (value: string) => void
  profile: ProfileData
}

export function ProfessionalSummaryEditor({ value, onChange, profile }: ProfessionalSummaryEditorProps) {
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isEnhancing, setIsEnhancing] = useState(false)

  const filteredTemplates = getTemplatesByCategory(selectedCategory)

  const handleSelectTemplate = (template: SummaryTemplate) => {
    const populated = populateTemplate(template.template, profile)
    onChange(populated)
    setShowTemplates(false)
  }

  const handleEnhanceWithAI = async () => {
    if (!value.trim()) return

    setIsEnhancing(true)
    try {
      const res = await fetch('/api/enhance-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: value, profile })
      })

      if (!res.ok) {
        throw new Error('Enhancement failed')
      }

      const { enhanced } = await res.json()
      if (enhanced) {
        onChange(enhanced)
      }
    } catch (error) {
      console.error('Enhancement failed:', error)
      alert('Failed to enhance summary. Please try again.')
    } finally {
      setIsEnhancing(false)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-2">
        Professional Summary
      </label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a brief professional summary or choose a template below..."
        className="w-full min-h-[150px] px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25 transition-all resize-none"
      />

      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-text-dim">This summary will pre-fill when you create new resumes</p>

        <div className="flex items-center gap-2">
          {/* Template Button - Primary Action */}
          <button
            type="button"
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary hover:bg-bg-hover border border-border text-text font-semibold rounded text-sm transition-colors"
          >
            <span>&#128203;</span>
            {showTemplates ? 'Hide Templates' : 'Choose Template'}
          </button>

          {/* Enhance Button - Secondary/Fallback */}
          <button
            type="button"
            onClick={handleEnhanceWithAI}
            disabled={isEnhancing || !value.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-gold/20 hover:bg-gold/30 border border-gold/50 disabled:bg-bg-tertiary disabled:border-border disabled:cursor-not-allowed text-gold disabled:text-text-dim font-semibold rounded text-sm transition-colors"
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
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
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
          <div className="max-h-64 overflow-y-auto p-2 space-y-2">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => handleSelectTemplate(template)}
                className="w-full text-left p-3 rounded-lg bg-bg-tertiary hover:bg-bg-hover border border-border hover:border-gold/50 transition-colors group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-text group-hover:text-gold">
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
    </div>
  )
}
