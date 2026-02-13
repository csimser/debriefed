export const TEMPLATES = {
  executive: {
    id: 'executive',
    name: 'Executive',
    description: 'ATS-optimized two-column layout with key achievements callout',
    free: false,
  },
  classic_professional: {
    id: 'classic_professional',
    name: 'Classic Professional',
    description: 'Traditional single-column layout with maximum ATS compatibility',
    free: true,
  },
  federal: {
    id: 'federal',
    name: 'Federal',
    description: 'USAJOBS-compliant dense format with black-bar section headers',
    free: true,
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Dark header with teal accents and timeline experience layout',
    free: true,
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Typography-driven design with generous whitespace',
    free: true,
  },
  twocol: {
    id: 'twocol',
    name: 'Two Column',
    description: 'Dark sidebar with gold accents and skills layout',
    free: true,
  },
}

export const FREE_TEMPLATES = ['classic_professional', 'federal', 'modern', 'minimal', 'twocol']
export const PRO_TEMPLATES = ['executive']

export type TemplateId = keyof typeof TEMPLATES

// Templates available for manual selection in the template picker
// Federal is excluded because it's auto-applied when resume type is toggled to 'federal'
export const SELECTABLE_TEMPLATES = Object.fromEntries(
  Object.entries(TEMPLATES).filter(([id]) => id !== 'federal')
) as Record<Exclude<TemplateId, 'federal'>, typeof TEMPLATES[keyof typeof TEMPLATES]>

// Map old template IDs to new ones for backward compatibility
export const TEMPLATE_MIGRATION: Record<string, TemplateId> = {
  clean: 'classic_professional',
  classic: 'classic_professional',
  federal: 'federal',
  modern: 'modern',
  minimal: 'minimal',
  twocol: 'twocol',
  'two-column': 'twocol',
  executive: 'executive',
  classic_professional: 'classic_professional',
  ats: 'classic_professional',
}

// Resolve a potentially old template ID to a valid current one
export function resolveTemplate(templateId: string | undefined | null): TemplateId {
  if (!templateId) return 'classic_professional'
  if (templateId in TEMPLATES) return templateId as TemplateId
  return TEMPLATE_MIGRATION[templateId] || 'classic_professional'
}
