'use client'

import { useState, useMemo } from 'react'
import { CollapsibleSection } from '../CollapsibleSection'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { getMOSData } from '@/lib/military-mos-data'

const QUICK_CERTS = {
  'Project Management': ['PMP', 'CAPM', 'CSM', 'SAFe', 'Six Sigma Green Belt', 'Six Sigma Black Belt'],
  'Cybersecurity': ['Security+', 'CySA+', 'PenTest+', 'CISSP', 'CEH', 'CISM'],
  'IT': ['A+', 'Network+', 'CCNA', 'AWS Solutions Architect', 'Azure Admin', 'Linux+'],
  'Safety': ['OSHA 30', 'OSHA 10', 'HAZWOPER', 'First Aid/CPR', 'NFPA'],
}

// Auto-fill issuing organizations for common certifications
const CERT_ISSUERS: Record<string, string> = {
  'PMP': 'Project Management Institute (PMI)',
  'CAPM': 'Project Management Institute (PMI)',
  'CSM': 'Scrum Alliance',
  'SAFe': 'Scaled Agile',
  'Six Sigma Green Belt': 'ASQ / IASSC',
  'Six Sigma Black Belt': 'ASQ / IASSC',
  'Security+': 'CompTIA',
  'CySA+': 'CompTIA',
  'PenTest+': 'CompTIA',
  'A+': 'CompTIA',
  'Network+': 'CompTIA',
  'Linux+': 'CompTIA',
  'CISSP': 'ISC2',
  'CEH': 'EC-Council',
  'CISM': 'ISACA',
  'CCNA': 'Cisco',
  'AWS Solutions Architect': 'Amazon Web Services',
  'Azure Admin': 'Microsoft',
  'OSHA 30': 'OSHA',
  'OSHA 10': 'OSHA',
  'HAZWOPER': 'OSHA',
  'First Aid/CPR': 'American Red Cross',
  'NFPA': 'National Fire Protection Association',
  'AWS Cloud Practitioner': 'Amazon Web Services',
  'AWS SysOps': 'Amazon Web Services',
  'RHCSA': 'Red Hat',
  'MCSE': 'Microsoft',
  'CompTIA Server+': 'CompTIA',
  'EMT-B': 'NREMT',
  'Paramedic': 'NREMT',
  'ACLS': 'American Heart Association',
  'BLS': 'American Heart Association',
  'PALS': 'American Heart Association',
  'CNA': 'State Board of Nursing',
  'Phlebotomy': 'ASCP',
  'Licensed Practical Nurse': 'State Board of Nursing',
  'CDL Class A': 'DMV / FMCSA',
  'CDL Class B': 'DMV / FMCSA',
  'Forklift Operator': 'OSHA',
  'APICS CPIM': 'ASCM',
  'APICS CSCP': 'ASCM',
  'Lean Six Sigma': 'ASQ / IASSC',
  'CISA': 'ISACA',
  'CCIE': 'Cisco',
  'OSCP': 'Offensive Security',
  'AWS Security': 'Amazon Web Services',
}

interface CertificationsSectionProps {
  userId: string
  certifications: any[]
  userMOS?: string
  onUpdate: (certifications: any[]) => void
}

export function CertificationsSection({ userId, certifications, userMOS, onUpdate }: CertificationsSectionProps) {
  const [adding, setAdding] = useState(false)
  const [newCert, setNewCert] = useState({ name: '', issuing_organization: '', issue_date: '', expiration_date: '' })
  const [showMOSRecommendations, setShowMOSRecommendations] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  // Get MOS-specific certification recommendations
  const mosData = useMemo(() => {
    if (!userMOS) return null
    return getMOSData(userMOS)
  }, [userMOS])

  const certNames = new Set(certifications.map(c => c.name.toLowerCase()))

  // Filter out already-added certs from MOS recommendations
  const mosRecommendedCerts = useMemo(() => {
    if (!mosData) return []
    return mosData.certifications.filter(c => !certNames.has(c.toLowerCase()))
  }, [mosData, certNames])

  const handleAdd = async (name?: string) => {
    const issuer = name ? (CERT_ISSUERS[name] || '') : newCert.issuing_organization
    const certData = name
      ? { name, issuing_organization: issuer, issue_date: '', expiration_date: '' }
      : newCert

    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('certifications')
        .insert({ user_id: userId, ...certData })
        .select()
        .single()

      if (error) {
        console.error('Error adding certification:', error)
        alert(`Failed to add certification: ${error.message}`)
        return
      }

      if (data) {
        onUpdate([...certifications, data])
        if (!name) {
          setNewCert({ name: '', issuing_organization: '', issue_date: '', expiration_date: '' })
          setAdding(false)
        }
      }
    } catch (err: any) {
      console.error('Exception:', err)
      alert(`Error: ${err?.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('certifications').delete().eq('id', id)
    if (!error) onUpdate(certifications.filter(c => c.id !== id))
  }

  const handleAddMOSCert = async (name: string) => {
    if (certNames.has(name.toLowerCase())) return

    setSaving(true)
    try {
      const issuer = CERT_ISSUERS[name] || ''
      const { data, error } = await supabase
        .from('certifications')
        .insert({
          user_id: userId,
          name,
          issuing_organization: issuer,
          issue_date: '',
          expiration_date: ''
        })
        .select()
        .single()

      if (error) {
        console.error('Error adding MOS cert:', error)
        alert(`Failed to add certification: ${error.message}`)
        return
      }

      if (data) {
        onUpdate([...certifications, data])
      }
    } finally {
      setSaving(false)
    }
  }

  const handleAddAllMOSCerts = async () => {
    if (mosRecommendedCerts.length === 0) return

    setSaving(true)
    try {
      const certsToAdd = mosRecommendedCerts.slice(0, 8).map(name => ({
        user_id: userId,
        name,
        issuing_organization: CERT_ISSUERS[name] || '',
        issue_date: '',
        expiration_date: '',
      }))

      const { data, error } = await supabase
        .from('certifications')
        .insert(certsToAdd)
        .select()

      if (error) {
        console.error('Error adding all MOS certs:', error)
        alert(`Failed to add certifications: ${error.message}`)
        return
      }

      if (data) {
        onUpdate([...certifications, ...data])
      }
    } finally {
      setSaving(false)
    }
  }

  // Helper to check if cert exists (case-insensitive)
  const hasCert = (name: string) => certNames.has(name.toLowerCase())

  return (
    <CollapsibleSection
      title="Certifications"
      icon="✦"
      actions={<Button size="sm" variant="secondary" onClick={() => setAdding(true)}>+ Add</Button>}
    >
      {/* MOS-Based Recommendations */}
      {mosData && mosRecommendedCerts.length > 0 && showMOSRecommendations && (
        <div className="mb-6 p-4 bg-gold/10 border border-gold/30 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">&#11088;</span>
              <span className="text-sm">
                Recommended for <strong className="text-gold">{userMOS}</strong> ({mosData.title}):
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
            {mosRecommendedCerts.slice(0, 6).map((cert, idx) => (
              <button
                key={idx}
                onClick={() => handleAddMOSCert(cert)}
                disabled={saving}
                className="px-3 py-1 text-xs bg-bg-tertiary border border-border rounded hover:border-gold hover:text-gold transition-all disabled:opacity-50"
              >
                + {cert}
              </button>
            ))}
          </div>
          {mosRecommendedCerts.length > 0 && (
            <button
              onClick={handleAddAllMOSCerts}
              disabled={saving}
              className="text-xs text-gold hover:underline"
            >
              + Add all {Math.min(mosRecommendedCerts.length, 8)} recommended certifications
            </button>
          )}
        </div>
      )}

      {/* Quick Select */}
      <div className="mb-6 space-y-4">
        <p className="text-xs text-text-muted uppercase tracking-wider">Quick Add</p>
        {Object.entries(QUICK_CERTS).map(([category, certs]) => (
          <div key={category}>
            <p className="text-xs text-text-dim mb-2">{category}</p>
            <div className="flex flex-wrap gap-2">
              {certs.map(cert => (
                <button
                  key={cert}
                  onClick={() => !hasCert(cert) && handleAdd(cert)}
                  className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                    hasCert(cert)
                      ? 'bg-gold-dim text-gold'
                      : 'bg-bg-tertiary text-text-muted hover:bg-bg-hover'
                  }`}
                >
                  {hasCert(cert) && '✓ '}{cert}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Cert List */}
      <div className="space-y-4">
        {certifications.map((cert) => (
          <Card key={cert.id} className="p-4 bg-bg-tertiary">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-heading font-bold">{cert.name}</div>
                {cert.issuing_organization && <div className="text-text-muted text-sm">{cert.issuing_organization}</div>}
                {cert.expiration_date && <div className="text-text-dim text-xs mt-1">Expires: {cert.expiration_date}</div>}
              </div>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(cert.id)}>✕</Button>
            </div>
          </Card>
        ))}

        {adding && (
          <Card className="p-4 bg-bg-tertiary border-gold/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Certification Name" value={newCert.name} onChange={e => setNewCert({ ...newCert, name: e.target.value })} placeholder="PMP" />
              <Input label="Issuing Organization" value={newCert.issuing_organization} onChange={e => setNewCert({ ...newCert, issuing_organization: e.target.value })} placeholder="PMI" />
              <Input label="Issue Date" type="date" value={newCert.issue_date} onChange={e => setNewCert({ ...newCert, issue_date: e.target.value })} />
              <Input label="Expiration Date" type="date" value={newCert.expiration_date} onChange={e => setNewCert({ ...newCert, expiration_date: e.target.value })} />
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" onClick={() => handleAdd()} disabled={saving || !newCert.name.trim()}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
            </div>
          </Card>
        )}
      </div>
    </CollapsibleSection>
  )
}
