'use client'

import { useState, useMemo } from 'react'
import { CollapsibleSection } from '../CollapsibleSection'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Toast } from '@/components/ui/Toast'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { createClient } from '@/lib/supabase/client'
import { getMOSData } from '@/lib/military-mos-data'
import { getSkillsForPaygrade } from '@/lib/constants/rank-skills'

interface SkillsSectionProps {
  userId: string
  skills: any[]
  paygrade?: string
  ratingMOS?: string
  onUpdate: (skills: any[]) => void
  isOpen?: boolean
  onToggle?: () => void
  summary?: string
  hint?: string
}

export function SkillsSection({ userId, skills, paygrade, ratingMOS, onUpdate, isOpen, onToggle, summary, hint }: SkillsSectionProps) {
  const [newSkill, setNewSkill] = useState('')
  const [saving, setSaving] = useState(false)
  const [showMOSRecommendations, setShowMOSRecommendations] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null)
  const supabase = createClient()

  // Get MOS-specific skill recommendations
  const mosData = useMemo(() => {
    if (!ratingMOS) return null
    return getMOSData(ratingMOS)
  }, [ratingMOS])

  const suggestedSkills = paygrade ? getSkillsForPaygrade(paygrade) : []
  const existingNames = new Set(skills.map(s => s.name.toLowerCase()))

  // Filter out already-added skills from MOS recommendations
  const mosRecommendedSkills = useMemo(() => {
    if (!mosData) return []
    return mosData.skills.filter(s => !existingNames.has(s.toLowerCase()))
  }, [mosData, existingNames])

  const handleAdd = async (name: string) => {
    if (!name.trim() || existingNames.has(name.toLowerCase())) {
      if (existingNames.has(name.toLowerCase())) {
        setToast({ message: 'Skill already added', type: 'info' })
      }
      return
    }

    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('skills')
        .insert({
          user_id: userId,
          name: name.trim(),
          category: 'general',
          sort_order: skills.length,
        })
        .select()
        .single()

      if (error) {
        console.error('Error adding skill:', error)
        setToast({ message: `Failed to add skill: ${error.message}`, type: 'error' })
        return
      }

      if (data) {
        onUpdate([...skills, data])
        setNewSkill('')
      }
    } catch (err: any) {
      console.error('Error:', err)
      setToast({ message: `Error: ${err?.message}`, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleAddSuggested = async (name: string, category: string = 'leadership') => {
    if (existingNames.has(name.toLowerCase())) return

    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('skills')
        .insert({
          user_id: userId,
          name,
          category,
          sort_order: skills.length,
        })
        .select()
        .single()

      if (error) {
        console.error('Error adding skill:', error)
        setToast({ message: `Failed to add skill: ${error.message}`, type: 'error' })
        return
      }

      if (data) onUpdate([...skills, data])
    } catch (err: any) {
      console.error('Error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleAddAllMOSSkills = async () => {
    if (mosRecommendedSkills.length === 0) return

    setSaving(true)
    try {
      const skillsToAdd = mosRecommendedSkills.slice(0, 10).map((name, idx) => ({
        user_id: userId,
        name,
        category: 'technical',
        sort_order: skills.length + idx,
      }))

      const { data, error } = await supabase
        .from('skills')
        .insert(skillsToAdd)
        .select()

      if (error) {
        console.error('Error adding skills:', error)
        setToast({ message: `Failed to add skills: ${error.message}`, type: 'error' })
        return
      }

      if (data) {
        onUpdate([...skills, ...data])
      }
    } catch (err: any) {
      console.error('Error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('skills').delete().eq('id', id)
    if (error) {
      setToast({ message: `Failed to delete: ${error.message}`, type: 'error' })
    } else {
      onUpdate(skills.filter(s => s.id !== id))
    }
  }

  const handleClearAll = () => {
    setConfirmDialog({
      title: 'Delete All Skills',
      message: 'Are you sure you want to delete all skills? This cannot be undone.',
      onConfirm: async () => {
        const { error } = await supabase.from('skills').delete().eq('user_id', userId)
        if (error) {
          setToast({ message: `Failed to clear: ${error.message}`, type: 'error' })
        } else {
          onUpdate([])
        }
      },
    })
  }

  return (
    <CollapsibleSection
      title="Skills"
      icon="◆"
      isOpen={isOpen}
      onToggle={onToggle}
      summary={summary}
      hint={hint}
      actions={skills.length > 0 && <Button size="sm" variant="ghost" onClick={handleClearAll}>Clear All</Button>}
    >
      {/* MOS-Based Recommendations */}
      {mosData && mosRecommendedSkills.length > 0 && showMOSRecommendations && (
        <div className="mb-6 p-4 bg-gold/10 border border-gold/30 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">&#11088;</span>
              <span className="text-sm">
                Recommended for <strong className="text-gold">{ratingMOS}</strong> ({mosData.title}):
              </span>
            </div>
            <button
              onClick={() => setShowMOSRecommendations(false)}
              className="text-xs text-text-dim hover:text-text"
            >
              Hide
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {mosRecommendedSkills.slice(0, 8).map((skill, idx) => (
              <button
                key={idx}
                onClick={() => handleAddSuggested(skill, 'technical')}
                disabled={saving}
                className="px-3 py-1 text-xs bg-bg-tertiary border border-border rounded hover:border-gold hover:text-gold transition-all disabled:opacity-50"
              >
                + {skill}
              </button>
            ))}
          </div>
          {mosRecommendedSkills.length > 0 && (
            <button
              onClick={handleAddAllMOSSkills}
              disabled={saving}
              className="text-xs text-gold hover:underline"
            >
              + Add all {Math.min(mosRecommendedSkills.length, 10)} recommended skills
            </button>
          )}
        </div>
      )}

      {/* Paygrade Suggestions */}
      {suggestedSkills.length > 0 && (
        <div className="mb-6 p-4 bg-bg-tertiary rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="gold">{paygrade}</Badge>
            <span className="text-sm text-text-muted">Leadership Skills for Your Paygrade</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.map(skill => (
              <button
                key={skill}
                onClick={() => handleAddSuggested(skill)}
                disabled={existingNames.has(skill.toLowerCase()) || saving}
                className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                  existingNames.has(skill.toLowerCase())
                    ? 'bg-gold text-bg-primary'
                    : 'bg-bg-secondary text-text-muted hover:bg-bg-hover hover:text-gold'
                }`}
              >
                {existingNames.has(skill.toLowerCase()) ? '✓ ' : '+ '}{skill}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add Skill */}
      <div className="flex gap-2 mb-4">
        <Input
          value={newSkill}
          onChange={e => setNewSkill(e.target.value)}
          placeholder="Add a skill..."
          onKeyDown={e => e.key === 'Enter' && handleAdd(newSkill)}
          className="flex-1"
        />
        <Button onClick={() => handleAdd(newSkill)} disabled={saving || !newSkill.trim()}>
          {saving ? 'Adding...' : 'Add'}
        </Button>
      </div>

      {/* Skill Tags */}
      <div className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <span key={skill.id} className="group inline-flex items-center gap-1 px-3 py-1 bg-bg-tertiary border border-border rounded text-sm">
            {skill.name}
            <button
              onClick={() => handleDelete(skill.id)}
              className="opacity-40 md:opacity-0 md:group-hover:opacity-100 text-status-red hover:bg-status-red/10 rounded px-1 ml-1 transition-all"
            >
              ×
            </button>
          </span>
        ))}
        {skills.length === 0 && <p className="text-text-muted">No skills added yet</p>}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmDialog && (
        <ConfirmModal
          title={confirmDialog.title}
          message={confirmDialog.message}
          variant="danger"
          confirmLabel="Delete All"
          onConfirm={() => { confirmDialog.onConfirm(); setConfirmDialog(null) }}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </CollapsibleSection>
  )
}
