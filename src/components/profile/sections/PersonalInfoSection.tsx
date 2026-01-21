'use client'

import { CollapsibleSection } from '../CollapsibleSection'
import { Input } from '@/components/ui/Input'

interface PersonalInfoSectionProps {
  data: any
  onChange: (updates: any) => void
}

export function PersonalInfoSection({ data, onChange }: PersonalInfoSectionProps) {
  return (
    <CollapsibleSection title="Personal Information" icon="◎" defaultOpen={true}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={data?.first_name || ''}
          onChange={e => onChange({ first_name: e.target.value })}
          placeholder="John"
        />
        <Input
          label="Last Name"
          value={data?.last_name || ''}
          onChange={e => onChange({ last_name: e.target.value })}
          placeholder="Doe"
        />
        <Input
          label="Email"
          type="email"
          value={data?.email || ''}
          onChange={e => onChange({ email: e.target.value })}
          placeholder="john@example.com"
        />
        <Input
          label="Phone"
          type="tel"
          value={data?.phone || ''}
          onChange={e => onChange({ phone: e.target.value })}
          placeholder="(555) 123-4567"
        />
        <Input
          label="City"
          value={data?.city || ''}
          onChange={e => onChange({ city: e.target.value })}
          placeholder="San Diego"
        />
        <Input
          label="State"
          value={data?.state || ''}
          onChange={e => onChange({ state: e.target.value })}
          placeholder="CA"
        />
        <Input
          label="ZIP Code"
          value={data?.zip || ''}
          onChange={e => onChange({ zip: e.target.value })}
          placeholder="92101"
        />
        <Input
          label="LinkedIn URL"
          value={data?.linkedin_url || ''}
          onChange={e => onChange({ linkedin_url: e.target.value })}
          placeholder="linkedin.com/in/johndoe"
        />
      </div>
    </CollapsibleSection>
  )
}
