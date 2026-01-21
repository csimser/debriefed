/**
 * Professional Summary Templates for military veterans
 */

export interface SummaryTemplate {
  id: string
  name: string
  category: 'leadership' | 'technical' | 'operations' | 'project-management' | 'logistics' | 'training' | 'security' | 'healthcare' | 'general'
  description: string
  template: string // Uses {{placeholders}}
}

export const SUMMARY_TEMPLATES: SummaryTemplate[] = [
  // LEADERSHIP FOCUSED
  {
    id: 'leadership-senior',
    name: 'Senior Leadership',
    category: 'leadership',
    description: 'Best for E-7+ or O-4+ transitioning to management roles',
    template: `{{rank}} with {{yearsOfService}} years of progressive leadership in the {{branch}}, directing teams of up to {{teamSize}} personnel in high-stakes operational environments. Proven track record of developing talent, managing multimillion-dollar resources, and delivering mission-critical results under pressure. Seeking to leverage extensive organizational leadership and strategic planning experience in a {{targetRole}} capacity.`
  },
  {
    id: 'leadership-mid',
    name: 'Mid-Level Leadership',
    category: 'leadership',
    description: 'Best for E-5 to E-6 or O-1 to O-3',
    template: `Dedicated {{branch}} {{rank}} with {{yearsOfService}} years of hands-on leadership experience supervising diverse teams in dynamic, fast-paced environments. Skilled in personnel development, process improvement, and cross-functional coordination. Ready to bring proven team leadership and operational expertise to a civilian organization.`
  },

  // OPERATIONS FOCUSED
  {
    id: 'operations-management',
    name: 'Operations Management',
    category: 'operations',
    description: 'Emphasizes operational excellence and process optimization',
    template: `Operations leader with {{yearsOfService}} years in the {{branch}} managing complex logistics, maintenance programs, and 24/7 operational readiness. Expert in risk mitigation, regulatory compliance, and resource optimization. {{clearanceStatement}}Transitioning to apply military precision and operational discipline to civilian operations management.`
  },
  {
    id: 'operations-technical',
    name: 'Technical Operations',
    category: 'operations',
    description: 'For technical ratings/MOS with operational focus',
    template: `{{branch}} {{mosTitle}} with {{yearsOfService}} years of hands-on technical experience and team leadership. Specialized in {{specialty}} with expertise in troubleshooting complex systems, implementing preventive maintenance programs, and training personnel to exacting standards. {{clearanceStatement}}Seeking to transition technical and leadership skills to {{targetIndustry}}.`
  },

  // PROJECT MANAGEMENT
  {
    id: 'project-management',
    name: 'Project Management',
    category: 'project-management',
    description: 'Highlights PM skills - great for PMP holders',
    template: `{{rank}} and project management professional with {{yearsOfService}} years orchestrating complex initiatives in the {{branch}}. Experienced in full lifecycle project execution, stakeholder management, budget oversight, and cross-functional team coordination. {{certifications}}Seeking to apply disciplined project management methodology to drive results in a civilian environment.`
  },

  // TECHNICAL / IT / CYBER
  {
    id: 'technical-it',
    name: 'IT / Cybersecurity',
    category: 'technical',
    description: 'For IT ratings, cyber MOS, or those with IT certifications',
    template: `{{branch}} veteran with {{yearsOfService}} years of experience in information technology and cybersecurity operations. {{certifications}}Skilled in network administration, security protocols, and system maintenance supporting mission-critical infrastructure. {{clearanceStatement}}Transitioning to leverage military IT discipline and security expertise in the private sector.`
  },
  {
    id: 'technical-engineering',
    name: 'Engineering / Technical',
    category: 'technical',
    description: 'For engineering ratings/MOS',
    template: `{{branch}} {{mosTitle}} with {{yearsOfService}} years of technical expertise in {{specialty}}. Proven ability to diagnose complex system failures, lead maintenance teams, and ensure operational readiness of critical equipment valued at millions of dollars. Seeking to apply technical problem-solving and leadership skills in {{targetIndustry}}.`
  },

  // LOGISTICS / SUPPLY CHAIN
  {
    id: 'logistics-supply',
    name: 'Logistics & Supply Chain',
    category: 'logistics',
    description: 'For supply, logistics, and warehouse management backgrounds',
    template: `Logistics professional with {{yearsOfService}} years managing supply chain operations for the {{branch}}. Expert in inventory management, procurement, distribution, and vendor coordination across global operations. Proven track record of reducing costs, improving efficiency, and maintaining 100% accountability of assets. Ready to transition supply chain expertise to civilian industry.`
  },

  // TRAINING / HR
  {
    id: 'training-development',
    name: 'Training & Development',
    category: 'training',
    description: 'Emphasizes instructor and personnel development experience',
    template: `{{branch}} {{rank}} with {{yearsOfService}} years developing and delivering training programs to diverse audiences. Experienced in curriculum development, competency assessment, and performance coaching. {{certifications}}Passionate about developing talent and building high-performing teams.`
  },

  // SECURITY / LAW ENFORCEMENT
  {
    id: 'security-law-enforcement',
    name: 'Security / Law Enforcement',
    category: 'security',
    description: 'For MA, MP, SF, or security-focused roles',
    template: `{{branch}} security professional with {{yearsOfService}} years protecting personnel, assets, and sensitive information. Experienced in threat assessment, access control, incident response, and security program management. {{clearanceStatement}}Seeking to transition military security expertise to corporate security, law enforcement, or federal service.`
  },

  // HEALTHCARE / MEDICAL
  {
    id: 'healthcare-medical',
    name: 'Healthcare / Medical',
    category: 'healthcare',
    description: 'For Corpsmen, Medics, nurses, and medical professionals',
    template: `{{branch}} healthcare professional with {{yearsOfService}} years of clinical experience in high-pressure environments. Skilled in emergency medicine, patient care, and medical administration. {{certifications}}Committed to delivering compassionate, high-quality care and seeking to continue serving in civilian healthcare.`
  },

  // GENERAL / FLEXIBLE
  {
    id: 'general-versatile',
    name: 'Versatile Professional',
    category: 'general',
    description: 'Flexible template that works for most backgrounds',
    template: `{{branch}} veteran with {{yearsOfService}} years of proven leadership, technical proficiency, and commitment to excellence. Adept at managing teams, solving complex problems, and delivering results in demanding environments. {{clearanceStatement}}Eager to bring military discipline, adaptability, and mission-focused mindset to a civilian career.`
  },
  {
    id: 'general-career-change',
    name: 'Career Changer',
    category: 'general',
    description: 'For those pivoting to a completely new field',
    template: `Transitioning {{branch}} {{rank}} with {{yearsOfService}} years of leadership and operational experience seeking to pivot into {{targetIndustry}}. Brings transferable skills in team management, problem-solving, and high-pressure decision-making. Quick learner with a track record of mastering new domains and exceeding expectations.`
  }
]

/**
 * Get templates filtered by category
 */
export function getTemplatesByCategory(category: string): SummaryTemplate[] {
  if (category === 'all') return SUMMARY_TEMPLATES
  return SUMMARY_TEMPLATES.filter(t => t.category === category)
}

/**
 * Get a template by ID
 */
export function getTemplateById(id: string): SummaryTemplate | undefined {
  return SUMMARY_TEMPLATES.find(t => t.id === id)
}

/**
 * Template categories for UI
 */
export const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'All Templates' },
  { id: 'leadership', name: 'Leadership' },
  { id: 'operations', name: 'Operations' },
  { id: 'project-management', name: 'Project Management' },
  { id: 'technical', name: 'Technical / IT' },
  { id: 'logistics', name: 'Logistics' },
  { id: 'training', name: 'Training' },
  { id: 'security', name: 'Security' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'general', name: 'General' },
]
