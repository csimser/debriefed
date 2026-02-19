'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { getMOSData } from '@/lib/military-mos-data'
import { OnboardingData } from './NewOnboardingWizard'

// Common certs by category for quick-add
const QUICK_CERTS: Record<string, string[]> = {
  'Project Management': ['PMP', 'CAPM', 'CSM', 'SAFe', 'Six Sigma Green Belt'],
  'Cybersecurity': ['Security+', 'CySA+', 'CISSP', 'CEH', 'CISM'],
  'IT': ['A+', 'Network+', 'CCNA', 'AWS Solutions Architect', 'Azure Admin'],
}

// Auto-fill issuers
const CERT_ISSUERS: Record<string, string> = {
  'PMP': 'PMI',
  'CAPM': 'PMI',
  'CSM': 'Scrum Alliance',
  'SAFe': 'Scaled Agile',
  'Six Sigma Green Belt': 'ASQ',
  'Security+': 'CompTIA',
  'CySA+': 'CompTIA',
  'CISSP': 'ISC2',
  'CEH': 'EC-Council',
  'CISM': 'ISACA',
  'A+': 'CompTIA',
  'Network+': 'CompTIA',
  'CCNA': 'Cisco',
  'AWS Solutions Architect': 'AWS',
  'Azure Admin': 'Microsoft',
}

// Leadership skills by paygrade
const PAYGRADE_SKILLS: Record<string, string[]> = {
  'E-5': ['Team Leadership', 'Training & Development', 'Performance Management'],
  'E-6': ['Team Leadership', 'Process Improvement', 'Resource Management'],
  'E-7': ['Organizational Leadership', 'Strategic Planning', 'Program Management'],
  'E-8': ['Strategic Planning', 'Change Management', 'Executive Communication'],
  'E-9': ['Executive Leadership', 'Strategic Vision', 'Organizational Transformation'],
  'O-3': ['Organizational Leadership', 'Operations Management', 'Budget Management'],
  'O-4': ['Strategic Leadership', 'Program Management', 'Policy Development'],
  'O-5': ['Executive Leadership', 'Strategic Planning', 'Stakeholder Engagement'],
}

interface StepSkillsProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
  onSkip: () => void
  saving: boolean
  userId: string
  supabase: any
}

export function StepSkills({ data, updateData, onNext, onBack, onSkip, saving, userId, supabase }: StepSkillsProps) {
  const [newSkill, setNewSkill] = useState('')
  const [newCert, setNewCert] = useState('')
  const [savingItem, setSavingItem] = useState(false)

  // Get MOS-specific recommendations
  const mosData = useMemo(() => {
    if (!data.rating_mos) return null
    return getMOSData(data.rating_mos)
  }, [data.rating_mos])

  // Get paygrade-based leadership skills
  const leadershipSkills = useMemo(() => {
    return PAYGRADE_SKILLS[data.paygrade] || []
  }, [data.paygrade])

  // Skills already added — handle both objects {name} and legacy string entries
  const existingSkillNames = new Set(data.skills.map(s => {
    const name = typeof s === 'string' ? s : (s.name || '')
    return name.toLowerCase()
  }))
  const existingCertNames = new Set(data.certifications.map(c => c.name.toLowerCase()))

  // Filter MOS recommendations
  const mosSkillSuggestions = useMemo(() => {
    if (!mosData) return []
    return mosData.skills.filter(s => !existingSkillNames.has(s.toLowerCase())).slice(0, 8)
  }, [mosData, existingSkillNames])

  const mosCertSuggestions = useMemo(() => {
    if (!mosData) return []
    return mosData.certifications.filter(c => !existingCertNames.has(c.toLowerCase())).slice(0, 6)
  }, [mosData, existingCertNames])

  // Leadership skill suggestions
  const leadershipSuggestions = useMemo(() => {
    return leadershipSkills.filter(s => !existingSkillNames.has(s.toLowerCase()))
  }, [leadershipSkills, existingSkillNames])

  const handleAddSkill = async (name: string) => {
    if (!name.trim() || existingSkillNames.has(name.toLowerCase())) return

    setSavingItem(true)
    try {
      const { data: insertedSkill, error } = await supabase
        .from('skills')
        .insert({
          user_id: userId,
          name: name.trim(),
          category: 'general',
          sort_order: data.skills.length,
        })
        .select()
        .single()

      if (error) throw error

      updateData({ skills: [...data.skills, insertedSkill] })
      setNewSkill('')
    } catch (error) {
      console.error('Error adding skill:', error)
    } finally {
      setSavingItem(false)
    }
  }

  const handleRemoveSkill = async (id: string) => {
    try {
      await supabase.from('skills').delete().eq('id', id)
      updateData({ skills: data.skills.filter(s => s.id !== id) })
    } catch (error) {
      console.error('Error removing skill:', error)
    }
  }

  const handleAddCert = async (name: string) => {
    if (!name.trim() || existingCertNames.has(name.toLowerCase())) return

    setSavingItem(true)
    try {
      const issuer = CERT_ISSUERS[name] || ''
      const { data: insertedCert, error } = await supabase
        .from('certifications')
        .insert({
          user_id: userId,
          name: name.trim(),
          issuing_organization: issuer,
          sort_order: data.certifications.length,
        })
        .select()
        .single()

      if (error) throw error

      updateData({ certifications: [...data.certifications, insertedCert] })
      setNewCert('')
    } catch (error) {
      console.error('Error adding certification:', error)
    } finally {
      setSavingItem(false)
    }
  }

  const handleRemoveCert = async (id: string) => {
    try {
      await supabase.from('certifications').delete().eq('id', id)
      updateData({ certifications: data.certifications.filter(c => c.id !== id) })
    } catch (error) {
      console.error('Error removing certification:', error)
    }
  }

  const handleAddAllMOSSkills = async () => {
    if (mosSkillSuggestions.length === 0) return

    setSavingItem(true)
    try {
      const skillsToAdd = mosSkillSuggestions.slice(0, 8).map((name, idx) => ({
        user_id: userId,
        name,
        category: 'technical',
        sort_order: data.skills.length + idx,
      }))

      const { data: insertedSkills, error } = await supabase
        .from('skills')
        .insert(skillsToAdd)
        .select()

      if (error) throw error

      updateData({ skills: [...data.skills, ...(insertedSkills || [])] })
    } catch (error) {
      console.error('Error adding skills:', error)
    } finally {
      setSavingItem(false)
    }
  }

  const handleAddAllMOSCerts = async () => {
    if (mosCertSuggestions.length === 0) return

    setSavingItem(true)
    try {
      const certsToAdd = mosCertSuggestions.slice(0, 6).map((name, idx) => ({
        user_id: userId,
        name,
        issuing_organization: CERT_ISSUERS[name] || '',
        sort_order: data.certifications.length + idx,
      }))

      const { data: insertedCerts, error } = await supabase
        .from('certifications')
        .insert(certsToAdd)
        .select()

      if (error) throw error

      updateData({ certifications: [...data.certifications, ...(insertedCerts || [])] })
    } catch (error) {
      console.error('Error adding certifications:', error)
    } finally {
      setSavingItem(false)
    }
  }

  const inputClass = "w-full px-4 py-3 bg-bg-secondary border border-border rounded focus:border-gold focus:ring-1 focus:ring-gold/25 transition-all"

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">&#128161;</div>
        <h2 className="font-heading text-2xl font-bold uppercase tracking-wider mb-2">
          Skills & Certifications
        </h2>
        <p className="text-text-muted">
          Highlight what you bring to the table
        </p>
      </div>

      {/* ===== SKILLS SECTION ===== */}
      <div className="bg-bg-card border border-border rounded-lg p-6 mb-6">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gold mb-4">
          Skills
        </h3>

        {/* MOS-based skill recommendations */}
        {mosData && mosSkillSuggestions.length > 0 && (
          <div className="mb-6 p-4 bg-gold/10 border border-gold/30 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm">
                <span className="text-gold">&#9733;</span> Recommended for <strong>{data.rating_mos}</strong>:
              </p>
              <button
                onClick={handleAddAllMOSSkills}
                disabled={savingItem}
                className="text-xs text-gold hover:underline"
              >
                + Add all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {mosSkillSuggestions.map((skill, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddSkill(skill)}
                  disabled={savingItem}
                  className="px-3 py-1 text-xs bg-bg-tertiary border border-border rounded hover:border-gold hover:text-gold transition-all"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Paygrade leadership skills */}
        {leadershipSuggestions.length > 0 && (
          <div className="mb-6 p-4 bg-bg-tertiary rounded-lg border border-border">
            <p className="text-sm text-text-muted mb-3">
              Leadership skills for <span className="text-gold">{data.paygrade}</span>:
            </p>
            <div className="flex flex-wrap gap-2">
              {leadershipSuggestions.map((skill, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddSkill(skill)}
                  disabled={savingItem}
                  className="px-3 py-1 text-xs bg-bg-secondary border border-border rounded hover:border-gold hover:text-gold transition-all"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add custom skill */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            name="custom-skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(newSkill)}
            placeholder="Add a custom skill..."
            className={inputClass}
          />
          <Button
            onClick={() => handleAddSkill(newSkill)}
            disabled={savingItem || !newSkill.trim()}
          >
            Add
          </Button>
        </div>

        {/* Added skills */}
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <span
              key={skill.id}
              className="group inline-flex items-center gap-1 px-3 py-1.5 bg-bg-tertiary border border-border rounded text-sm"
            >
              {typeof skill === 'string' ? skill : skill.name}
              <button
                onClick={() => handleRemoveSkill(skill.id)}
                className="opacity-0 group-hover:opacity-100 text-status-red hover:bg-status-red/10 rounded px-1 transition-all"
              >
                &#215;
              </button>
            </span>
          ))}
          {data.skills.length === 0 && (
            <p className="text-text-dim text-sm">No skills added yet</p>
          )}
        </div>
      </div>

      {/* ===== CERTIFICATIONS SECTION ===== */}
      <div className="bg-bg-card border border-border rounded-lg p-6">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gold mb-4">
          Certifications
        </h3>

        {/* MOS-based cert recommendations */}
        {mosData && mosCertSuggestions.length > 0 && (
          <div className="mb-6 p-4 bg-gold/10 border border-gold/30 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm">
                <span className="text-gold">&#9733;</span> Recommended for <strong>{data.rating_mos}</strong>:
              </p>
              <button
                onClick={handleAddAllMOSCerts}
                disabled={savingItem}
                className="text-xs text-gold hover:underline"
              >
                + Add all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {mosCertSuggestions.map((cert, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddCert(cert)}
                  disabled={savingItem}
                  className="px-3 py-1 text-xs bg-bg-tertiary border border-border rounded hover:border-gold hover:text-gold transition-all"
                >
                  + {cert}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick add by category */}
        <div className="mb-6 space-y-3">
          <p className="text-xs text-text-muted uppercase tracking-wider">Quick Add</p>
          {Object.entries(QUICK_CERTS).map(([category, certs]) => (
            <div key={category}>
              <p className="text-xs text-text-dim mb-2">{category}</p>
              <div className="flex flex-wrap gap-2">
                {certs.map((cert) => (
                  <button
                    key={cert}
                    onClick={() => !existingCertNames.has(cert.toLowerCase()) && handleAddCert(cert)}
                    disabled={savingItem}
                    className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                      existingCertNames.has(cert.toLowerCase())
                        ? 'bg-gold/20 text-gold'
                        : 'bg-bg-tertiary text-text-muted hover:border-gold hover:text-gold border border-transparent'
                    }`}
                  >
                    {existingCertNames.has(cert.toLowerCase()) ? '✓ ' : ''}{cert}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Add custom cert */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            name="custom-certification"
            value={newCert}
            onChange={(e) => setNewCert(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCert(newCert)}
            placeholder="Add a custom certification..."
            className={inputClass}
          />
          <Button
            onClick={() => handleAddCert(newCert)}
            disabled={savingItem || !newCert.trim()}
          >
            Add
          </Button>
        </div>

        {/* Added certifications */}
        <div className="space-y-2">
          {data.certifications.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg border border-border"
            >
              <div>
                <span className="font-semibold">{cert.name}</span>
                {cert.issuing_organization && (
                  <span className="text-sm text-text-muted ml-2">- {cert.issuing_organization}</span>
                )}
              </div>
              <button
                onClick={() => handleRemoveCert(cert.id)}
                className="text-text-muted hover:text-status-red transition-colors"
              >
                &#10005;
              </button>
            </div>
          ))}
          {data.certifications.length === 0 && (
            <p className="text-text-dim text-sm">No certifications added yet</p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={onBack}>
          &#8592; Back
        </Button>
        <Button onClick={onNext} disabled={saving}>
          {saving ? 'Saving...' : 'Continue \u2192'}
        </Button>
      </div>

      <div className="text-center mt-4">
        <button
          onClick={onSkip}
          disabled={saving}
          className="text-sm text-text-dim hover:text-text-muted hover:underline transition-colors"
        >
          Skip for now — I&apos;ll complete my profile later
        </button>
      </div>
    </div>
  )
}
