export const TEMPLATES = {
  clean: {
    id: 'clean',
    name: 'Clean',
    description: 'Modern, minimal design',
    free: true,
  },
  federal: {
    id: 'federal',
    name: 'Federal',
    description: 'USAJOBS compliant format',
    free: true,
  },
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional professional',
    free: false,
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Bold headers, clean lines',
    free: false,
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Maximum whitespace',
    free: false,
  },
  twocol: {
    id: 'twocol',
    name: 'Two Column',
    description: 'Skills sidebar layout',
    free: false,
  },
}

export const FREE_TEMPLATES = ['clean', 'federal']
export const PRO_TEMPLATES = ['classic', 'modern', 'minimal', 'twocol']

export type TemplateId = keyof typeof TEMPLATES
