'use client'

import { useState } from 'react'
import { CollapsibleSection } from '../CollapsibleSection'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Toast } from '@/components/ui/Toast'
import { saveEducation, deleteEducation, newId } from '@/lib/storage'
import {
  DEGREE_TYPES,
  MONTHS,
  GRADUATION_YEARS,
  getDegreeLabel,
  formatGraduationDate,
  parseLegacyGraduationDate,
} from '@/lib/constants/education'

interface EducationSectionProps {
  education: any[]
  onUpdate: (education: any[]) => void
  isOpen?: boolean
  onToggle?: () => void
  summary?: string
  hint?: string
}

export function EducationSection({ education, onUpdate, isOpen, onToggle, summary, hint }: EducationSectionProps) {
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newEdu, setNewEdu] = useState({
    school_name: '',
    degree_type: '',
    field_of_study: '',
    graduation_month: '',
    graduation_year: '',
    gpa: '',
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null)

  const inputClass = "w-full px-3 py-2 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25 transition-all text-sm"
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1"

  const resetForm = () => {
    setNewEdu({
      school_name: '',
      degree_type: '',
      field_of_study: '',
      graduation_month: '',
      graduation_year: '',
      gpa: '',
    })
  }

  const handleAdd = async () => {
    if (!newEdu.school_name.trim()) return

    setSaving(true)
    try {
      const data = saveEducation({
        id: newId(),
        school_name: newEdu.school_name,
        degree_type: newEdu.degree_type || null,
        field_of_study: newEdu.field_of_study || null,
        graduation_month: newEdu.graduation_month || null,
        graduation_year: newEdu.graduation_year || null,
        gpa: newEdu.gpa ? parseFloat(newEdu.gpa) : null,
        sort_order: education.length,
      } as any)

      onUpdate([...education, data])
      resetForm()
      setAdding(false)
    } catch (err: any) {
      console.error('Error adding education:', err)
      setToast({ message: `Failed to add education: ${err?.message || 'Unknown error'}`, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (edu: any) => {
    // Parse legacy graduation_date if needed
    const { month, year } = edu.graduation_month && edu.graduation_year
      ? { month: edu.graduation_month, year: edu.graduation_year }
      : parseLegacyGraduationDate(edu.graduation_date)

    setNewEdu({
      school_name: edu.school_name || edu.institution || '',
      degree_type: edu.degree_type || '',
      field_of_study: edu.field_of_study || '',
      graduation_month: month,
      graduation_year: year,
      gpa: edu.gpa?.toString() || '',
    })
    setEditingId(edu.id)
    setAdding(false)
  }

  const handleUpdate = async () => {
    if (!editingId || !newEdu.school_name.trim()) return

    setSaving(true)
    try {
      const existing = education.find(e => e.id === editingId) || {}
      const data = saveEducation({
        ...existing,
        id: editingId,
        school_name: newEdu.school_name,
        degree_type: newEdu.degree_type || null,
        field_of_study: newEdu.field_of_study || null,
        graduation_month: newEdu.graduation_month || null,
        graduation_year: newEdu.graduation_year || null,
        gpa: newEdu.gpa ? parseFloat(newEdu.gpa) : null,
      } as any)

      onUpdate(education.map(e => e.id === editingId ? data : e))
      resetForm()
      setEditingId(null)
    } catch (err: any) {
      console.error('Error updating education:', err)
      setToast({ message: `Failed to update: ${err?.message || 'Unknown error'}`, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      deleteEducation(id)
      onUpdate(education.filter(e => e.id !== id))
    } catch (err: any) {
      setToast({ message: `Failed to delete: ${err?.message || 'Unknown error'}`, type: 'error' })
    }
  }

  const handleCancel = () => {
    resetForm()
    setAdding(false)
    setEditingId(null)
  }

  // Helper to get display values for existing education
  const getDisplayDegree = (edu: any) => {
    if (edu.degree_type) {
      return getDegreeLabel(edu.degree_type)
    }
    return edu.degree || ''
  }

  const getDisplaySchool = (edu: any) => {
    return edu.school_name || edu.institution || ''
  }

  const getDisplayGraduation = (edu: any) => {
    if (edu.graduation_month || edu.graduation_year) {
      return formatGraduationDate(edu.graduation_month, edu.graduation_year)
    }
    // Fall back to legacy graduation_date
    const { month, year } = parseLegacyGraduationDate(edu.graduation_date)
    return formatGraduationDate(month, year)
  }

  const isEditing = editingId !== null
  const showForm = adding || isEditing

  return (
    <CollapsibleSection
      title="Education"
      icon="&#9671;"
      isOpen={isOpen}
      onToggle={onToggle}
      summary={summary}
      hint={hint}
      actions={
        !showForm && (
          <Button size="sm" variant="secondary" onClick={() => setAdding(true)}>
            + Add
          </Button>
        )
      }
    >
      <div className="space-y-4">
        {/* Education List */}
        {education.map((edu) => (
          editingId === edu.id ? null : (
            <Card key={edu.id} className="p-4 bg-bg-tertiary">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-heading font-bold">
                    {getDisplayDegree(edu)}
                    {edu.field_of_study && ` in ${edu.field_of_study}`}
                  </div>
                  <div className="text-text-muted text-sm">{getDisplaySchool(edu)}</div>
                  <div className="text-text-dim text-xs mt-1">
                    {getDisplayGraduation(edu)}
                    {edu.gpa && ` | GPA: ${edu.gpa}`}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(edu)}>
                    &#9998;
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(edu.id)}>
                    &#10005;
                  </Button>
                </div>
              </div>
            </Card>
          )
        ))}

        {/* Add/Edit Form */}
        {showForm && (
          <Card className="p-4 bg-bg-tertiary border-gold/30">
            <div className="space-y-4">
              {/* Row 1: School Name & Degree Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>School / Institution</label>
                  <input
                    type="text"
                    value={newEdu.school_name}
                    onChange={e => setNewEdu({ ...newEdu, school_name: e.target.value })}
                    placeholder="University or school name"
                    className={inputClass}
                    autoComplete="organization"
                  />
                </div>

                <div>
                  <label className={labelClass}>Degree Type</label>
                  <select
                    value={newEdu.degree_type}
                    onChange={e => setNewEdu({ ...newEdu, degree_type: e.target.value })}
                    className={inputClass}
                    autoComplete="off"
                  >
                    <option value="">Select Degree Type</option>
                    {DEGREE_TYPES.map((degree) => (
                      <option key={degree.value} value={degree.value}>
                        {degree.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Field of Study & Graduation Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Field of Study</label>
                  <input
                    type="text"
                    value={newEdu.field_of_study}
                    onChange={e => setNewEdu({ ...newEdu, field_of_study: e.target.value })}
                    placeholder="e.g., Cybersecurity, Business"
                    className={inputClass}
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className={labelClass}>Graduation Date</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newEdu.graduation_month}
                      onChange={e => setNewEdu({ ...newEdu, graduation_month: e.target.value })}
                      className={inputClass}
                      autoComplete="off"
                    >
                      <option value="">Month</option>
                      {MONTHS.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={newEdu.graduation_year}
                      onChange={e => setNewEdu({ ...newEdu, graduation_year: e.target.value })}
                      className={inputClass}
                      autoComplete="off"
                    >
                      <option value="">Year</option>
                      {GRADUATION_YEARS.map((year) => (
                        <option key={year.value} value={year.value}>
                          {year.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 3: GPA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>GPA (Optional)</label>
                  <input
                    type="text"
                    value={newEdu.gpa}
                    onChange={e => setNewEdu({ ...newEdu, gpa: e.target.value })}
                    placeholder="e.g., 3.8"
                    className={inputClass}
                    autoComplete="off"
                  />
                  <p className="text-xs text-text-dim mt-1">Only include if 3.5+</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={isEditing ? handleUpdate : handleAdd}
                  disabled={saving || !newEdu.school_name.trim()}
                >
                  {saving ? 'Saving...' : isEditing ? 'Update' : 'Save'}
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {education.length === 0 && !showForm && (
          <p className="text-text-muted text-center py-8">No education added yet</p>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </CollapsibleSection>
  )
}
