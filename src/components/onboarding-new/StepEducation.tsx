'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  DEGREE_TYPES,
  MONTHS,
  GRADUATION_YEARS,
  getDegreeLabel,
  formatGraduationDate,
} from '@/lib/constants/education'
import { OnboardingData } from './NewOnboardingWizard'

interface Education {
  id?: string
  school_name: string
  degree_type: string
  field_of_study: string
  graduation_month: string
  graduation_year: string
  gpa: string
}

interface StepEducationProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
  saving: boolean
  userId: string
  supabase: any
}

const emptyEducation: Education = {
  school_name: '',
  degree_type: '',
  field_of_study: '',
  graduation_month: '',
  graduation_year: '',
  gpa: '',
}

export function StepEducation({ data, updateData, onNext, onBack, saving, userId, supabase }: StepEducationProps) {
  const [showForm, setShowForm] = useState(data.education.length === 0)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState<Education>(emptyEducation)
  const [savingEdu, setSavingEdu] = useState(false)

  const handleSaveEducation = async () => {
    if (!formData.school_name.trim()) {
      alert('Please enter the school name')
      return
    }

    setSavingEdu(true)
    try {
      const eduData = {
        user_id: userId,
        school_name: formData.school_name,
        degree_type: formData.degree_type || null,
        field_of_study: formData.field_of_study || null,
        graduation_month: formData.graduation_month || null,
        graduation_year: formData.graduation_year || null,
        gpa: formData.gpa ? parseFloat(formData.gpa) : null,
        sort_order: editingIndex !== null ? editingIndex : data.education.length,
      }

      if (editingIndex !== null && data.education[editingIndex]?.id) {
        // Update existing
        const eduId = data.education[editingIndex].id
        const { error } = await supabase
          .from('education')
          .update(eduData)
          .eq('id', eduId)

        if (error) throw error

        const updated = [...data.education]
        updated[editingIndex] = { ...updated[editingIndex], ...eduData }
        updateData({ education: updated })
      } else {
        // Insert new
        const { data: insertedEdu, error } = await supabase
          .from('education')
          .insert(eduData)
          .select()
          .single()

        if (error) throw error

        updateData({ education: [...data.education, insertedEdu] })
      }

      // Reset form
      setFormData(emptyEducation)
      setShowForm(false)
      setEditingIndex(null)
    } catch (error) {
      console.error('Error saving education:', error)
      alert('Failed to save education. Please try again.')
    } finally {
      setSavingEdu(false)
    }
  }

  const handleEditEducation = (index: number) => {
    const edu = data.education[index]
    setFormData({
      id: edu.id,
      school_name: edu.school_name || edu.institution || '',
      degree_type: edu.degree_type || '',
      field_of_study: edu.field_of_study || '',
      graduation_month: edu.graduation_month || '',
      graduation_year: edu.graduation_year || '',
      gpa: edu.gpa?.toString() || '',
    })
    setEditingIndex(index)
    setShowForm(true)
  }

  const handleDeleteEducation = async (index: number) => {
    const edu = data.education[index]
    if (!edu.id) return

    if (!confirm('Delete this education entry?')) return

    try {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', edu.id)

      if (error) throw error

      updateData({ education: data.education.filter((_, i) => i !== index) })
    } catch (error) {
      console.error('Error deleting education:', error)
    }
  }

  const inputClass = "w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25 transition-all"
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2"

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">&#127891;</div>
        <h2 className="font-heading text-2xl font-bold uppercase tracking-wider mb-2">
          Education
        </h2>
        <p className="text-text-muted">
          Add your educational background (optional)
        </p>
      </div>

      {/* Info callout */}
      <div className="bg-bg-tertiary rounded-lg p-4 mb-6 text-sm text-text-dim">
        <p>
          &#128161; <strong>Tip:</strong> Include military education like PME courses, Service schools, and college degrees.
          You can skip this step if you don't have formal education to add.
        </p>
      </div>

      {/* Existing Education List */}
      {data.education.length > 0 && !showForm && (
        <div className="space-y-4 mb-6">
          {data.education.map((edu, idx) => (
            <Card key={edu.id || idx} className="p-4 bg-bg-card">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-heading font-bold">
                    {edu.degree_type ? getDegreeLabel(edu.degree_type) : edu.degree || 'Education'}
                    {edu.field_of_study && ` in ${edu.field_of_study}`}
                  </div>
                  <div className="text-text-muted text-sm">
                    {edu.school_name || edu.institution}
                  </div>
                  <div className="text-text-dim text-xs mt-1">
                    {formatGraduationDate(edu.graduation_month, edu.graduation_year)}
                    {edu.gpa && ` | GPA: ${edu.gpa}`}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEditEducation(idx)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDeleteEducation(idx)}>
                    &#10005;
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          <button
            onClick={() => {
              setFormData(emptyEducation)
              setEditingIndex(null)
              setShowForm(true)
            }}
            className="w-full py-3 border border-dashed border-border rounded-lg text-text-muted hover:border-gold hover:text-gold transition-colors"
          >
            + Add Another Education
          </button>
        </div>
      )}

      {/* Add/Edit Education Form */}
      {showForm && (
        <div className="bg-bg-card border border-border rounded-lg p-6 space-y-6">
          {/* School Name */}
          <div>
            <label className={labelClass}>School / Institution *</label>
            <input
              type="text"
              value={formData.school_name}
              onChange={(e) => setFormData(prev => ({ ...prev, school_name: e.target.value }))}
              placeholder="e.g., University of Maryland, Senior NCO Academy"
              className={inputClass}
            />
          </div>

          {/* Degree Type and Field */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Degree Type</label>
              <select
                value={formData.degree_type}
                onChange={(e) => setFormData(prev => ({ ...prev, degree_type: e.target.value }))}
                className={inputClass}
              >
                <option value="">Select Degree Type</option>
                {DEGREE_TYPES.map((degree) => (
                  <option key={degree.value} value={degree.value}>
                    {degree.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Field of Study</label>
              <input
                type="text"
                value={formData.field_of_study}
                onChange={(e) => setFormData(prev => ({ ...prev, field_of_study: e.target.value }))}
                placeholder="e.g., Business Administration, Cybersecurity"
                className={inputClass}
              />
            </div>
          </div>

          {/* Graduation Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Graduation Date</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={formData.graduation_month}
                  onChange={(e) => setFormData(prev => ({ ...prev, graduation_month: e.target.value }))}
                  className={inputClass}
                >
                  <option value="">Month</option>
                  {MONTHS.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
                <select
                  value={formData.graduation_year}
                  onChange={(e) => setFormData(prev => ({ ...prev, graduation_year: e.target.value }))}
                  className={inputClass}
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
            <div>
              <label className={labelClass}>
                GPA <span className="text-text-dim">(Optional, if 3.5+)</span>
              </label>
              <input
                type="text"
                value={formData.gpa}
                onChange={(e) => setFormData(prev => ({ ...prev, gpa: e.target.value }))}
                placeholder="e.g., 3.8"
                className={inputClass}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3">
            <Button onClick={handleSaveEducation} disabled={savingEdu}>
              {savingEdu ? 'Saving...' : editingIndex !== null ? 'Update' : 'Save Education'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowForm(false)
                setFormData(emptyEducation)
                setEditingIndex(null)
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Empty state - offer to skip */}
      {data.education.length === 0 && !showForm && (
        <div className="bg-bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-text-muted mb-4">No education added yet</p>
          <div className="flex justify-center gap-4">
            <Button
              variant="secondary"
              onClick={() => setShowForm(true)}
            >
              + Add Education
            </Button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={onBack}>
          &#8592; Back
        </Button>
        <div className="flex gap-3">
          {data.education.length === 0 && (
            <Button variant="ghost" onClick={onNext}>
              Skip for now
            </Button>
          )}
          <Button onClick={onNext} disabled={saving}>
            {saving ? 'Saving...' : 'Continue \u2192'}
          </Button>
        </div>
      </div>
    </div>
  )
}
