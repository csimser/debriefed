'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Skill {
  id?: string
  name: string
}

interface SkillsManagerProps {
  resumeId: string
  allSkills: Skill[]              // All skills from profile
  selectedSkills: string[]        // Skills selected for this resume
  onUpdate: (skills: string[]) => void
}

export function SkillsManager({ resumeId, allSkills, selectedSkills, onUpdate }: SkillsManagerProps) {
  const [newSkill, setNewSkill] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const toggleSkill = async (skillName: string) => {
    const isSelected = selectedSkills.includes(skillName)

    setSaving(true)
    try {
      if (isSelected) {
        // Remove from resume_skills
        await supabase
          .from('resume_skills')
          .delete()
          .eq('resume_id', resumeId)
          .eq('skill', skillName)

        onUpdate(selectedSkills.filter(s => s !== skillName))
      } else {
        // Add to resume_skills
        await supabase
          .from('resume_skills')
          .insert({ resume_id: resumeId, skill: skillName })

        onUpdate([...selectedSkills, skillName])
      }
    } finally {
      setSaving(false)
    }
  }

  const addSkill = async () => {
    const trimmed = newSkill.trim()
    if (!trimmed) return

    // Check if already in list
    if (allSkills.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
      // Just toggle it on if it exists
      if (!selectedSkills.includes(trimmed)) {
        await toggleSkill(trimmed)
      }
      setNewSkill('')
      return
    }

    setSaving(true)
    try {
      // Add to resume_skills
      await supabase
        .from('resume_skills')
        .insert({ resume_id: resumeId, skill: trimmed })

      onUpdate([...selectedSkills, trimmed])
      setNewSkill('')
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }

  // Combine profile skills with any additional resume-specific skills
  const allSkillNames = [
    ...allSkills.map(s => s.name),
    ...selectedSkills.filter(s => !allSkills.some(ps => ps.name === s))
  ]

  return (
    <div className="bg-bg-tertiary border border-border rounded-lg p-4">
      <h3 className="text-sm text-gold uppercase tracking-wider mb-3 flex items-center gap-2">
        Skills
        {saving && <span className="text-xs text-text-dim">(saving...)</span>}
      </h3>

      {/* Skill Pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {allSkillNames.map((skillName) => {
          const isSelected = selectedSkills.includes(skillName)
          return (
            <button
              key={skillName}
              onClick={() => toggleSkill(skillName)}
              disabled={saving}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                isSelected
                  ? 'bg-gold border-gold text-bg-primary'
                  : 'bg-bg-secondary border-border text-text-muted hover:border-gold/50'
              } disabled:opacity-50`}
            >
              {skillName}
              {isSelected && (
                <span className="ml-1.5">✓</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Add New Skill */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a skill..."
          autoComplete="off"
          className="flex-1 bg-bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-dim focus:border-gold focus:ring-1 focus:ring-gold/25"
        />
        <button
          onClick={addSkill}
          disabled={!newSkill.trim() || saving}
          className="px-3 py-2 bg-gold hover:bg-gold-bright disabled:bg-bg-secondary disabled:text-text-dim disabled:cursor-not-allowed text-bg-primary text-xs font-semibold rounded-lg transition-colors"
        >
          Add
        </button>
      </div>

      <p className="text-xs text-text-dim mt-2">
        Click skills to include/exclude from this resume
      </p>
    </div>
  )
}
