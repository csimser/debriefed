'use client'

import { useState, useEffect } from 'react'
import { CollapsibleSection } from '../CollapsibleSection'
import { BulletAssignmentModal } from '../BulletAssignmentModal'
import { CivilianTitleSuggestions } from '../CivilianTitleSuggestions'
import { EvalUploadModal } from '../EvalUploadModal'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { formatDateForDB, formatDateForInput } from '@/lib/military-titles'
import { US_STATES } from '@/lib/constants/states'
import { formatSalary, parseSalary } from '@/lib/formatSalary'
import { toE164 } from '@/lib/formatPhone'
import { InternationalPhoneInput } from '@/components/ui/InternationalPhoneInput'

interface ExtractedBullet {
  original: string
  translated: string
  metrics: string[]
  skills: string[]
}

// Strip leading bullet characters from pasted/entered text
function stripLeadingBulletChars(text: string): string {
  // Remove leading whitespace, then bullet characters, then more whitespace
  return text.replace(/^\s*[•\-\*\>\●\○\◆\◇\▸\▹\►\▻\➤\➢\→]+\s*/g, '').trim()
}

interface ExperienceSectionProps {
  userId: string
  experiences: any[]
  onUpdate: (experiences: any[]) => void
  pendingBullets?: ExtractedBullet[]
  onBulletsSaved?: () => void
}

export function ExperienceSection({
  userId,
  experiences,
  onUpdate,
  pendingBullets = [],
  onBulletsSaved
}: ExperienceSectionProps) {
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showBulletModal, setShowBulletModal] = useState(pendingBullets.length > 0)
  const [savingBullets, setSavingBullets] = useState(false)
  const [expandedExperiences, setExpandedExperiences] = useState<Set<string>>(new Set())
  const [showEvalUploadForExp, setShowEvalUploadForExp] = useState<string | null>(null) // Experience ID to upload eval for

  const emptyExp = {
    employment_type: 'military' as 'military' | 'civilian',
    job_title: '',
    civilian_title: '',
    organization: '',
    company_name: '',
    location: '',
    city: '',
    state: '',
    start_date: '',
    end_date: '',
    is_current: false,
    hours_per_week: 40,
    grade_level: '',
    supervisor_name: '',
    supervisor_phone: '',
    supervisor_can_contact: true,
    salary: '',
    salaryDisplay: '', // For formatted display
  }

  // State for editing individual bullets
  const [editingBulletId, setEditingBulletId] = useState<string | null>(null)
  const [editingBulletText, setEditingBulletText] = useState('')

  const [formExp, setFormExp] = useState(emptyExp)
  const [showFederalFields, setShowFederalFields] = useState(false)
  const supabase = createClient()

  // Start editing an experience
  const handleEdit = (exp: any) => {
    setEditingId(exp.id)
    setAdding(false)
    setFormExp({
      employment_type: exp.employment_type || 'military',
      job_title: exp.job_title || '',
      civilian_title: exp.civilian_title || '',
      organization: exp.organization || '',
      company_name: exp.company_name || exp.organization || '',
      location: exp.location || '',
      city: exp.city || '',
      state: exp.state || '',
      start_date: formatDateForInput(exp.start_date) || '',
      end_date: exp.end_date ? formatDateForInput(exp.end_date) : '',
      is_current: exp.is_current || false,
      hours_per_week: exp.hours_per_week || 40,
      grade_level: exp.grade_level || '',
      supervisor_name: exp.supervisor_name || '',
      supervisor_phone: toE164(exp.supervisor_phone || ''),
      supervisor_can_contact: exp.supervisor_can_contact !== false,
      salary: exp.salary || '',
      salaryDisplay: formatSalary(exp.salary),
    })
    // Show federal fields if any are populated
    setShowFederalFields(!!(exp.grade_level || exp.supervisor_name || exp.salary))
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null)
    setAdding(false)
    setFormExp(emptyExp)
    setShowFederalFields(false)
    setEditingBulletId(null)
    setEditingBulletText('')
  }

  // Toggle expand/collapse for experience bullets
  const toggleExpand = (expId: string) => {
    setExpandedExperiences(prev => {
      const newSet = new Set(prev)
      if (newSet.has(expId)) {
        newSet.delete(expId)
      } else {
        newSet.add(expId)
      }
      return newSet
    })
  }

  // Delete individual bullet
  const deleteBullet = async (bulletId: string, experienceId: string) => {
    if (!confirm('Delete this bullet?')) return

    const { error } = await supabase
      .from('experience_bullets')
      .delete()
      .eq('id', bulletId)

    if (error) {
      alert(`Failed to delete: ${error.message}`)
    } else {
      // Update local state
      const updatedExperiences = experiences.map(exp => {
        if (exp.id === experienceId) {
          return {
            ...exp,
            bullets: exp.bullets?.filter((b: any) => b.id !== bulletId) || []
          }
        }
        return exp
      })
      onUpdate(updatedExperiences)
    }
  }

  // Start editing a bullet
  const startEditBullet = (bulletId: string, currentText: string) => {
    setEditingBulletId(bulletId)
    setEditingBulletText(currentText)
  }

  // Save edited bullet
  const saveEditBullet = async (bulletId: string, experienceId: string) => {
    const cleanedText = stripLeadingBulletChars(editingBulletText)
    if (!cleanedText) {
      alert('Bullet text cannot be empty')
      return
    }

    const { error } = await supabase
      .from('experience_bullets')
      .update({ translated_text: cleanedText })
      .eq('id', bulletId)

    if (error) {
      alert(`Failed to update: ${error.message}`)
    } else {
      // Update local state
      const updatedExperiences = experiences.map(exp => {
        if (exp.id === experienceId) {
          return {
            ...exp,
            bullets: exp.bullets?.map((b: any) =>
              b.id === bulletId ? { ...b, translated_text: cleanedText } : b
            ) || []
          }
        }
        return exp
      })
      onUpdate(updatedExperiences)
      setEditingBulletId(null)
      setEditingBulletText('')
    }
  }

  // Cancel editing bullet
  const cancelEditBullet = () => {
    setEditingBulletId(null)
    setEditingBulletText('')
  }

  // Add new bullet to experience
  const addBulletToExperience = async (experienceId: string) => {
    // Get current max sort_order
    const exp = experiences.find(e => e.id === experienceId)
    const maxOrder = exp?.bullets?.reduce((max: number, b: any) => Math.max(max, b.sort_order || 0), -1) ?? -1

    const { data, error } = await supabase
      .from('experience_bullets')
      .insert({
        experience_id: experienceId,
        original_text: '',
        translated_text: 'New bullet - click to edit',
        sort_order: maxOrder + 1,
        status: 'accepted',
      })
      .select()
      .single()

    if (error) {
      alert(`Failed to add bullet: ${error.message}`)
    } else if (data) {
      // Update local state and start editing the new bullet
      const updatedExperiences = experiences.map(exp => {
        if (exp.id === experienceId) {
          return {
            ...exp,
            bullets: [...(exp.bullets || []), data]
          }
        }
        return exp
      })
      onUpdate(updatedExperiences)
      startEditBullet(data.id, 'New bullet - click to edit')
    }
  }

  // Show modal when pending bullets arrive
  useEffect(() => {
    if (pendingBullets.length > 0) {
      setShowBulletModal(true)
    }
  }, [pendingBullets])

  const handleSave = async () => {
    // Different validation based on employment type
    const isCivilian = formExp.employment_type === 'civilian'
    const orgField = isCivilian ? formExp.company_name : formExp.organization

    if (!formExp.job_title || !orgField) {
      alert(`Please fill in Job Title and ${isCivilian ? 'Company Name' : 'Organization'}`)
      return
    }

    // Generate location from city/state for backwards compatibility
    const location = formExp.city && formExp.state
      ? `${formExp.city}, ${formExp.state}`
      : formExp.location || null

    // Parse salary from display format to number
    const parsedSalary = parseSalary(formExp.salaryDisplay || formExp.salary)

    const dataToSave = {
      employment_type: formExp.employment_type,
      job_title: formExp.job_title,
      // For civilian jobs, use job_title as civilian_title; for military, use civilian_title or job_title
      civilian_title: isCivilian ? formExp.job_title : (formExp.civilian_title || formExp.job_title),
      organization: isCivilian ? formExp.company_name : formExp.organization,
      company_name: isCivilian ? formExp.company_name : null,
      location,
      city: formExp.city || null,
      state: formExp.state || null,
      start_date: formatDateForDB(formExp.start_date),
      end_date: formExp.is_current ? null : formatDateForDB(formExp.end_date),
      is_current: formExp.is_current,
      hours_per_week: formExp.hours_per_week || 40,
      // Only save federal/military fields for military employment
      grade_level: isCivilian ? null : (formExp.grade_level || null),
      supervisor_name: formExp.supervisor_name || null,
      supervisor_phone: formExp.supervisor_phone || null,
      supervisor_can_contact: formExp.supervisor_can_contact,
      salary: parsedSalary,
    }

    if (editingId) {
      // Update existing experience
      const { error } = await supabase
        .from('experience')
        .update(dataToSave)
        .eq('id', editingId)

      if (!error) {
        onUpdate(experiences.map(exp =>
          exp.id === editingId ? { ...exp, ...dataToSave } : exp
        ))
        handleCancelEdit()
      } else {
        console.error('Error updating experience:', error)
        alert(`Failed to update experience: ${error.message}`)
      }
    } else {
      // Insert new experience
      const { data, error } = await supabase
        .from('experience')
        .insert({ ...dataToSave, user_id: userId, sort_order: experiences.length })
        .select()
        .single()

      if (!error && data) {
        onUpdate([...experiences, { ...data, bullets: [] }])
        handleCancelEdit()
      } else if (error) {
        console.error('Error adding experience:', error)
        alert(`Failed to add experience: ${error.message}`)
      }
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('experience').delete().eq('id', id)
    if (!error) onUpdate(experiences.filter(e => e.id !== id))
  }

  // Move experience up or down in the list
  const moveExperience = async (expId: string, direction: 'up' | 'down') => {
    const currentIndex = experiences.findIndex(e => e.id === expId)
    if (currentIndex === -1) return

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= experiences.length) return

    // Swap the two experiences
    const currentExp = experiences[currentIndex]
    const targetExp = experiences[targetIndex]

    // Update sort_order in database
    const updates = [
      supabase.from('experience').update({ sort_order: targetIndex }).eq('id', currentExp.id),
      supabase.from('experience').update({ sort_order: currentIndex }).eq('id', targetExp.id),
    ]

    const results = await Promise.all(updates)
    const hasError = results.some(r => r.error)

    if (!hasError) {
      // Swap in local state
      const newExperiences = [...experiences]
      newExperiences[currentIndex] = { ...targetExp, sort_order: currentIndex }
      newExperiences[targetIndex] = { ...currentExp, sort_order: targetIndex }
      onUpdate(newExperiences)
    } else {
      alert('Failed to reorder experiences')
    }
  }

  // Save bullets to an existing experience
  const saveBulletsToExperience = async (experienceId: string) => {
    setSavingBullets(true)

    try {
      // Get current max sort_order for this experience
      const { data: existingBullets } = await supabase
        .from('experience_bullets')
        .select('sort_order')
        .eq('experience_id', experienceId)
        .order('sort_order', { ascending: false })
        .limit(1)

      const startOrder = existingBullets?.[0]?.sort_order ?? -1

      // Insert bullets (strip any leading bullet characters) with accepted status
      const bulletsToInsert = pendingBullets.map((b, idx) => ({
        experience_id: experienceId,
        original_text: stripLeadingBulletChars(b.original),
        translated_text: stripLeadingBulletChars(b.translated),
        sort_order: startOrder + idx + 1,
        status: 'accepted',
      }))

      const { error } = await supabase.from('experience_bullets').insert(bulletsToInsert)

      if (error) {
        console.error('Error saving bullets:', error)
        alert('Failed to save bullets')
        return
      }

      // Refresh experiences with new bullets
      const { data: updatedExp } = await supabase
        .from('experience')
        .select('*, experience_bullets(*)')
        .eq('user_id', userId)
        .order('sort_order')

      if (updatedExp) {
        onUpdate(updatedExp.map(exp => ({ ...exp, bullets: exp.experience_bullets })))
      }

      setShowBulletModal(false)
      onBulletsSaved?.()
    } finally {
      setSavingBullets(false)
    }
  }

  // Create new experience with bullets
  const createExperienceWithBullets = async (expData: {
    job_title: string
    civilian_title: string
    organization: string
    start_date: string
    end_date: string
  }) => {
    setSavingBullets(true)

    try {
      // Format dates for PostgreSQL (YYYY-MM -> YYYY-MM-DD)
      const startDate = formatDateForDB(expData.start_date)
      const endDate = formatDateForDB(expData.end_date)

      // Create the experience
      const { data: formExperience, error: expError } = await supabase
        .from('experience')
        .insert({
          user_id: userId,
          job_title: expData.job_title,
          civilian_title: expData.civilian_title || expData.job_title,
          organization: expData.organization,
          start_date: startDate,
          end_date: endDate,
          is_current: !endDate,
          sort_order: experiences.length,
        })
        .select()
        .single()

      if (expError || !formExperience) {
        console.error('Error creating experience:', expError)
        alert(`Failed to create experience: ${expError?.message || 'Unknown error'}`)
        return
      }

      // Insert bullets (strip any leading bullet characters) with accepted status
      const bulletsToInsert = pendingBullets.map((b, idx) => ({
        experience_id: formExperience.id,
        original_text: stripLeadingBulletChars(b.original),
        translated_text: stripLeadingBulletChars(b.translated),
        sort_order: idx,
        status: 'accepted',
      }))

      const { error: bulletError } = await supabase.from('experience_bullets').insert(bulletsToInsert)

      if (bulletError) {
        console.error('Error saving bullets:', bulletError)
        alert('Failed to save bullets')
        return
      }

      // Refresh experiences
      const { data: updatedExp } = await supabase
        .from('experience')
        .select('*, experience_bullets(*)')
        .eq('user_id', userId)
        .order('sort_order')

      if (updatedExp) {
        onUpdate(updatedExp.map(exp => ({ ...exp, bullets: exp.experience_bullets })))
      }

      setShowBulletModal(false)
      onBulletsSaved?.()
    } finally {
      setSavingBullets(false)
    }
  }

  return (
    <CollapsibleSection
      title="Experience"
      icon="◫"
      actions={!adding && !editingId && (
        <button
          onClick={() => { setAdding(true); setFormExp(emptyExp) }}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-bg-primary font-heading font-semibold text-sm rounded-lg hover:bg-gold/90 transition-colors uppercase tracking-wider"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Experience
        </button>
      )}
    >
      <div className="space-y-4">
        {experiences.map((exp) => {
          const isExpanded = expandedExperiences.has(exp.id)
          const bullets = exp.bullets || []
          const visibleBullets = isExpanded ? bullets : bullets.slice(0, 3)
          const hiddenCount = bullets.length - 3
          const isEditing = editingId === exp.id

          // If editing this experience, show the form instead
          if (isEditing) return null

          const isCivilianExp = exp.employment_type === 'civilian'

          return (
            <Card key={exp.id} className="p-4 bg-bg-tertiary">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold">{exp.civilian_title || exp.job_title}</span>
                    <span className={`px-2 py-0.5 text-xs rounded ${isCivilianExp ? 'bg-blue-500/20 text-blue-400' : 'bg-gold/20 text-gold'}`}>
                      {isCivilianExp ? 'Civilian' : 'Military'}
                    </span>
                  </div>
                  {!isCivilianExp && exp.civilian_title && exp.civilian_title !== exp.job_title && (
                    <div className="text-text-dim text-xs">Military: {exp.job_title}</div>
                  )}
                  <div className="text-text-muted text-sm">{exp.company_name || exp.organization}</div>
                  {exp.location && <div className="text-text-dim text-xs">{exp.location}</div>}
                  <div className="text-text-dim text-xs mt-1">
                    {formatDateForInput(exp.start_date)} — {exp.is_current ? 'Present' : formatDateForInput(exp.end_date)}
                  </div>
                  {(exp.hours_per_week || exp.grade_level) && (
                    <div className="text-text-dim text-xs mt-1">
                      {exp.hours_per_week && `${exp.hours_per_week} hrs/week`}
                      {exp.hours_per_week && exp.grade_level && ' • '}
                      {exp.grade_level && exp.grade_level}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {/* Move up/down buttons */}
                  <div className="flex flex-col -my-1 mr-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveExperience(exp.id, 'up')}
                      disabled={experiences.findIndex(e => e.id === exp.id) === 0}
                      title="Move up"
                      className="p-0.5 h-5"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveExperience(exp.id, 'down')}
                      disabled={experiences.findIndex(e => e.id === exp.id) === experiences.length - 1}
                      title="Move down"
                      className="p-0.5 h-5"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(exp)}
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(exp.id)}
                    title="Delete"
                  >
                    ✕
                  </Button>
                </div>
              </div>

              {/* Bullets */}
              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-text-dim uppercase tracking-wider">
                    Bullets ({bullets.length})
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowEvalUploadForExp(exp.id)}
                      className="flex items-center gap-1 px-2 py-1 bg-status-green/20 text-status-green border border-status-green/30 rounded hover:bg-status-green/30 transition-colors text-xs"
                      title="Import bullets from an evaluation document"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Import Eval
                    </button>
                    <button
                      onClick={() => addBulletToExperience(exp.id)}
                      className="flex items-center gap-1 px-2 py-1 bg-gold/20 text-gold border border-gold/30 rounded hover:bg-gold/30 transition-colors text-xs"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Bullet
                    </button>
                  </div>
                </div>
                {bullets.length > 0 ? (
                  <>
                    <ul className="space-y-2">
                      {visibleBullets.map((bullet: any) => (
                        <li key={bullet.id} className="group">
                          {editingBulletId === bullet.id ? (
                            // Editing mode
                            <div className="flex flex-col gap-2 p-3 bg-bg-tertiary rounded-lg">
                              <textarea
                                value={editingBulletText}
                                onChange={(e) => setEditingBulletText(e.target.value)}
                                className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-white text-sm resize-none focus:border-gold focus:ring-1 focus:ring-gold/25"
                                rows={3}
                                autoFocus
                              />
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={cancelEditBullet}
                                  className="px-3 py-1 text-sm text-text-muted hover:text-white"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => saveEditBullet(bullet.id, exp.id)}
                                  className="px-3 py-1 text-sm bg-gold text-bg-primary rounded hover:bg-gold/90"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            // Display mode
                            <div className="flex items-start gap-2">
                              <span className="text-gold mt-0.5">•</span>
                              <span className="flex-1 text-sm text-text-muted">{bullet.translated_text || bullet.original_text}</span>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => startEditBullet(bullet.id, bullet.translated_text || bullet.original_text)}
                                  className="p-1 text-text-muted hover:text-white"
                                  title="Edit"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => deleteBullet(bullet.id, exp.id)}
                                  className="p-1 text-text-muted hover:text-status-red"
                                  title="Delete"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>

                    {/* Expand/Collapse Button */}
                    {bullets.length > 3 && (
                      <button
                        onClick={() => toggleExpand(exp.id)}
                        className="mt-3 text-xs text-gold hover:text-gold-bright hover:underline flex items-center gap-1 transition-all"
                      >
                        {isExpanded ? (
                          <>
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="18 15 12 9 6 15"/>
                            </svg>
                            Show less
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="6 9 12 15 18 9"/>
                            </svg>
                            Show {hiddenCount} more bullet{hiddenCount > 1 ? 's' : ''}
                          </>
                        )}
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-text-dim italic">No bullets yet. Add from evaluations or manually.</p>
                )}
              </div>
            </Card>
          )
        })}

        {(adding || editingId) && (
          <Card className={`p-4 bg-bg-tertiary ${editingId ? 'border-gold' : 'border-gold/30'}`}>
            {editingId && (
              <div className="text-xs text-gold uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Editing Experience
              </div>
            )}

            {/* Employment Type Toggle */}
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Employment Type
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormExp(prev => ({ ...prev, employment_type: 'military' }))}
                  className={`flex-1 px-4 py-2 rounded text-sm font-semibold transition-all ${
                    formExp.employment_type === 'military'
                      ? 'bg-gold text-bg-primary'
                      : 'bg-bg-secondary text-text-muted hover:text-text border border-border'
                  }`}
                >
                  Military
                </button>
                <button
                  type="button"
                  onClick={() => setFormExp(prev => ({ ...prev, employment_type: 'civilian' }))}
                  className={`flex-1 px-4 py-2 rounded text-sm font-semibold transition-all ${
                    formExp.employment_type === 'civilian'
                      ? 'bg-gold text-bg-primary'
                      : 'bg-bg-secondary text-text-muted hover:text-text border border-border'
                  }`}
                >
                  Civilian
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Job Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  {formExp.employment_type === 'military' ? 'Job Title (Military)' : 'Job Title'} *
                </label>
                <input
                  type="text"
                  value={formExp.job_title}
                  onChange={e => setFormExp({ ...formExp, job_title: e.target.value })}
                  placeholder={formExp.employment_type === 'military' ? 'e.g., Damage Controlman Chief' : 'e.g., Project Manager'}
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                />
              </div>

              {/* Organization/Company */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  {formExp.employment_type === 'military' ? 'Organization' : 'Company Name'} *
                </label>
                <input
                  type="text"
                  value={formExp.employment_type === 'military' ? formExp.organization : formExp.company_name}
                  onChange={e => setFormExp({
                    ...formExp,
                    [formExp.employment_type === 'military' ? 'organization' : 'company_name']: e.target.value
                  })}
                  placeholder={formExp.employment_type === 'military' ? 'e.g., USS Sterett (DDG-104)' : 'e.g., Acme Corporation'}
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                />
              </div>
            </div>

            {/* Civilian Title Suggestions - Only for military employment */}
            {formExp.employment_type === 'military' && formExp.job_title.length >= 2 && (
              <div className="mt-4">
                <CivilianTitleSuggestions
                  militaryTitle={formExp.job_title}
                  selectedTitle={formExp.civilian_title}
                  onSelect={(title) => setFormExp(prev => ({ ...prev, civilian_title: title }))}
                />
              </div>
            )}

            {/* Civilian Job Title - Only for military employment */}
            {formExp.employment_type === 'military' && (
              <div className="mt-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Civilian Job Title (for resume)
                </label>
                <input
                  type="text"
                  value={formExp.civilian_title}
                  onChange={e => setFormExp({ ...formExp, civilian_title: e.target.value })}
                  placeholder="Select above or type your own"
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                />
                <p className="text-xs text-text-dim mt-1">This is what will appear on your resume</p>
              </div>
            )}

            {/* City and State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formExp.city}
                  onChange={e => setFormExp({ ...formExp, city: e.target.value })}
                  placeholder="e.g., San Diego"
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  State
                </label>
                <select
                  value={formExp.state}
                  onChange={e => setFormExp({ ...formExp, state: e.target.value })}
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                >
                  <option value="">Select State</option>
                  {US_STATES.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Start Date - MONTH PICKER */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Start Date
                </label>
                <input
                  type="month"
                  value={formExp.start_date}
                  onChange={e => setFormExp({ ...formExp, start_date: e.target.value })}
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* End Date - MONTH PICKER */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  End Date
                </label>
                <input
                  type="month"
                  value={formExp.end_date}
                  onChange={e => setFormExp({ ...formExp, end_date: e.target.value })}
                  disabled={formExp.is_current}
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25 disabled:opacity-50"
                />
              </div>

              {/* Current Position Checkbox */}
              <div className="flex items-center pt-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formExp.is_current}
                    onChange={e => setFormExp({
                      ...formExp,
                      is_current: e.target.checked,
                      end_date: e.target.checked ? '' : formExp.end_date
                    })}
                    className="w-4 h-4 rounded border-border text-gold focus:ring-gold"
                  />
                  <span className="text-sm">Current Position</span>
                </label>
              </div>
            </div>

            {/* Federal Resume Fields Toggle - Only for military */}
            {formExp.employment_type === 'military' && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <button
                type="button"
                onClick={() => setShowFederalFields(!showFederalFields)}
                className="flex items-center gap-2 text-sm text-text-muted hover:text-gold transition-colors"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${showFederalFields ? 'rotate-90' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
                Federal Resume Fields (USAJOBS)
              </button>

              {showFederalFields && (
                <div className="space-y-4 mt-4 p-4 bg-bg-secondary/50 rounded-lg border border-border/30">
                  {/* Row 1: Hours and Pay Grade */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                        Hours per Week
                      </label>
                      <input
                        type="number"
                        value={formExp.hours_per_week}
                        onChange={e => setFormExp({ ...formExp, hours_per_week: parseInt(e.target.value) || 40 })}
                        placeholder="40"
                        min="1"
                        max="80"
                        className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                        Series/Grade (if federal)
                      </label>
                      <input
                        type="text"
                        value={formExp.grade_level}
                        onChange={e => setFormExp({ ...formExp, grade_level: e.target.value })}
                        placeholder="e.g., GS-12, E-8, WG-10"
                        className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                      />
                    </div>
                  </div>

                  {/* Row 2: Salary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                        Salary (Optional)
                      </label>
                      <input
                        type="text"
                        value={formExp.salaryDisplay}
                        onChange={e => {
                          // Allow typing numbers only
                          const raw = e.target.value.replace(/[^0-9]/g, '')
                          setFormExp({ ...formExp, salaryDisplay: raw, salary: raw })
                        }}
                        onBlur={() => {
                          // Format on blur
                          const parsed = parseSalary(formExp.salaryDisplay)
                          setFormExp({
                            ...formExp,
                            salaryDisplay: parsed ? formatSalary(parsed) : '',
                            salary: parsed ? String(parsed) : ''
                          })
                        }}
                        placeholder="$85,000"
                        className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                      />
                    </div>
                  </div>

                  {/* Row 3: Supervisor Info */}
                  <div className="pt-3 border-t border-border/30">
                    <p className="text-xs text-text-dim mb-3">Supervisor Information (for federal applications)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                          Supervisor Name
                        </label>
                        <input
                          type="text"
                          value={formExp.supervisor_name}
                          onChange={e => setFormExp({ ...formExp, supervisor_name: e.target.value })}
                          placeholder="John Smith"
                          className="w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25"
                        />
                      </div>

                      <div>
                        <InternationalPhoneInput
                          label="Supervisor Phone"
                          value={formExp.supervisor_phone}
                          onChange={(value) => setFormExp({ ...formExp, supervisor_phone: value })}
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formExp.supervisor_can_contact}
                          onChange={e => setFormExp({ ...formExp, supervisor_can_contact: e.target.checked })}
                          className="w-4 h-4 rounded border-border text-gold focus:ring-gold"
                        />
                        <span className="text-sm text-text-muted">May contact this supervisor</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            )}

            <div className="flex gap-2 mt-6">
              <Button size="sm" onClick={handleSave}>
                {editingId ? 'Update' : 'Save'}
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
            </div>
          </Card>
        )}

        {experiences.length === 0 && !adding && !editingId && (
          <p className="text-text-muted text-center py-8">No experience added yet</p>
        )}
      </div>

      {/* Bullet Assignment Modal */}
      <BulletAssignmentModal
        isOpen={showBulletModal && pendingBullets.length > 0}
        onClose={() => {
          setShowBulletModal(false)
          onBulletsSaved?.()
        }}
        bullets={pendingBullets}
        experiences={experiences.map(exp => ({
          id: exp.id,
          job_title: exp.job_title,
          organization: exp.organization,
          start_date: exp.start_date,
          end_date: exp.end_date,
        }))}
        onAssign={saveBulletsToExperience}
        onCreate={createExperienceWithBullets}
        saving={savingBullets}
      />

      {/* Eval Upload Modal for specific experience */}
      {showEvalUploadForExp && (
        <EvalUploadModal
          isOpen={true}
          onClose={() => setShowEvalUploadForExp(null)}
          onExtracted={() => {
            // This won't be called since we have an experience pre-selected
          }}
          onBulletsSaved={async () => {
            // Refresh experiences to show new bullets
            const { data: updatedExp } = await supabase
              .from('experience')
              .select('*, experience_bullets(*)')
              .eq('user_id', userId)
              .order('sort_order')

            if (updatedExp) {
              onUpdate(updatedExp.map(exp => ({ ...exp, bullets: exp.experience_bullets })))
            }
            setShowEvalUploadForExp(null)
          }}
          userId={userId}
          experiences={experiences.map(exp => ({
            id: exp.id,
            job_title: exp.job_title,
            organization: exp.organization,
            start_date: exp.start_date,
            end_date: exp.end_date,
          }))}
          defaultExperienceId={showEvalUploadForExp}
        />
      )}
    </CollapsibleSection>
  )
}
