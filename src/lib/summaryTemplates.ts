/**
 * Professional Summary Templates
 *
 * IMPORTANT: These templates are written in CIVILIAN language.
 * They should NOT contain military ranks, branch names, or military jargon.
 * The user's military background is translated to civilian equivalents.
 *
 * Exception: If target_industry is "Defense" or "Government", military terminology is acceptable.
 */

export interface SummaryTemplate {
  id: string
  name: string
  category: 'leadership' | 'technical' | 'operations' | 'project-management' | 'logistics' | 'training' | 'security' | 'healthcare' | 'general' | 'defense'
  description: string
  template: string // Uses {{placeholders}}
}

export const SUMMARY_TEMPLATES: SummaryTemplate[] = [
  // LEADERSHIP FOCUSED
  {
    id: 'leadership-senior',
    name: 'Senior Leadership',
    category: 'leadership',
    description: 'For senior managers transitioning to executive/director roles',
    template: `Senior operations leader with {{yearsOfService}} years of progressive leadership experience, directing teams of up to {{teamSize}} professionals in high-stakes environments. Proven track record of developing talent, managing multimillion-dollar budgets, and delivering critical results under pressure. Seeking to leverage extensive organizational leadership and strategic planning expertise in a {{targetRole}} capacity.`
  },
  {
    id: 'leadership-mid',
    name: 'Mid-Level Leadership',
    category: 'leadership',
    description: 'For supervisors and team leads',
    template: `Dedicated operations professional with {{yearsOfService}} years of hands-on leadership experience supervising diverse teams in dynamic, fast-paced environments. Skilled in personnel development, process improvement, and cross-functional coordination. Ready to bring proven team leadership and operational expertise to {{targetIndustry}}.`
  },

  // OPERATIONS FOCUSED
  {
    id: 'operations-management',
    name: 'Operations Management',
    category: 'operations',
    description: 'Emphasizes operational excellence and process optimization',
    template: `Operations leader with {{yearsOfService}} years managing complex logistics, maintenance programs, and 24/7 operational requirements. Expert in risk mitigation, regulatory compliance, and resource optimization. {{clearanceStatement}}Transitioning to apply systematic approach and operational discipline to civilian operations management.`
  },
  {
    id: 'operations-technical',
    name: 'Technical Operations',
    category: 'operations',
    description: 'For technical specialists with operational focus',
    template: `{{mosTitle}} with {{yearsOfService}} years of hands-on technical experience and team leadership. Specialized in {{specialty}} with expertise in troubleshooting complex systems, implementing preventive maintenance programs, and training personnel to high standards. {{clearanceStatement}}Seeking to transition technical and leadership skills to {{targetIndustry}}.`
  },

  // PROJECT MANAGEMENT
  {
    id: 'project-management',
    name: 'Project Management',
    category: 'project-management',
    description: 'Highlights PM skills - great for PMP holders',
    template: `Project management professional with {{yearsOfService}} years orchestrating complex initiatives across multiple stakeholders. Experienced in full lifecycle project execution, stakeholder management, budget oversight, and cross-functional team coordination. {{certifications}}Seeking to apply disciplined project management methodology to drive results in {{targetIndustry}}.`
  },

  // TECHNICAL / IT / CYBER
  {
    id: 'technical-it',
    name: 'IT / Cybersecurity',
    category: 'technical',
    description: 'For IT professionals and cybersecurity specialists',
    template: `Information technology professional with {{yearsOfService}} years of experience in IT operations and cybersecurity. {{certifications}}Skilled in network administration, security protocols, and system maintenance supporting critical infrastructure. {{clearanceStatement}}Transitioning to leverage IT expertise and security mindset in {{targetIndustry}}.`
  },
  {
    id: 'technical-engineering',
    name: 'Engineering / Technical',
    category: 'technical',
    description: 'For engineering and technical specialists',
    template: `{{mosTitle}} with {{yearsOfService}} years of technical expertise in {{specialty}}. Proven ability to diagnose complex system failures, lead maintenance teams, and ensure operational readiness of critical equipment valued at millions of dollars. Seeking to apply technical problem-solving and leadership skills in {{targetIndustry}}.`
  },

  // LOGISTICS / SUPPLY CHAIN
  {
    id: 'logistics-supply',
    name: 'Logistics & Supply Chain',
    category: 'logistics',
    description: 'For supply chain and warehouse management professionals',
    template: `Logistics professional with {{yearsOfService}} years managing supply chain operations across global networks. Expert in inventory management, procurement, distribution, and vendor coordination. Proven track record of reducing costs, improving efficiency, and maintaining 100% accountability of assets. Ready to transition supply chain expertise to {{targetIndustry}}.`
  },

  // TRAINING / HR
  {
    id: 'training-development',
    name: 'Training & Development',
    category: 'training',
    description: 'Emphasizes instructor and personnel development experience',
    template: `Learning and development professional with {{yearsOfService}} years developing and delivering training programs to diverse audiences. Experienced in curriculum development, competency assessment, and performance coaching. {{certifications}}Passionate about developing talent and building high-performing teams in {{targetIndustry}}.`
  },

  // SECURITY / LAW ENFORCEMENT
  {
    id: 'security-law-enforcement',
    name: 'Security / Law Enforcement',
    category: 'security',
    description: 'For security professionals and law enforcement',
    template: `Security professional with {{yearsOfService}} years protecting personnel, assets, and sensitive information. Experienced in threat assessment, access control, incident response, and security program management. {{clearanceStatement}}Seeking to transition security expertise to corporate security, law enforcement, or federal service.`
  },

  // HEALTHCARE / MEDICAL
  {
    id: 'healthcare-medical',
    name: 'Healthcare / Medical',
    category: 'healthcare',
    description: 'For medical professionals and healthcare workers',
    template: `Healthcare professional with {{yearsOfService}} years of clinical experience in high-pressure environments. Skilled in emergency medicine, patient care, and medical administration. {{certifications}}Committed to delivering compassionate, high-quality care in {{targetIndustry}}.`
  },

  // GENERAL / FLEXIBLE
  {
    id: 'general-versatile',
    name: 'Versatile Professional',
    category: 'general',
    description: 'Flexible template that works for most backgrounds',
    template: `Operations professional with {{yearsOfService}} years of proven leadership, technical proficiency, and commitment to excellence. Adept at managing teams, solving complex problems, and delivering results in demanding environments. {{clearanceStatement}}Eager to bring discipline, adaptability, and results-focused mindset to {{targetIndustry}}.`
  },
  {
    id: 'general-career-change',
    name: 'Career Changer',
    category: 'general',
    description: 'For those pivoting to a completely new field',
    template: `Transitioning professional with {{yearsOfService}} years of leadership and operational experience seeking to pivot into {{targetIndustry}}. Brings transferable skills in team management, problem-solving, and high-pressure decision-making. Quick learner with a track record of mastering new domains and exceeding expectations.`
  },

  // DEFENSE CONTRACTOR - OK to use military terminology here
  {
    id: 'defense-contractor',
    name: 'Defense Contractor',
    category: 'defense',
    description: 'For defense/government positions - military terminology acceptable',
    template: `{{rank}} with {{yearsOfService}} years of {{branch}} experience in {{specialty}}. Extensive background in defense operations, government programs, and mission-critical systems. {{clearanceStatement}}{{certifications}}Seeking to continue serving in the defense industry as a {{targetRole}}.`
  },
  {
    id: 'federal-government',
    name: 'Federal Government',
    category: 'defense',
    description: 'For federal civilian positions - military terminology acceptable',
    template: `Veteran with {{yearsOfService}} years of {{branch}} service transitioning to federal civilian employment. Proven track record of leadership, operational excellence, and mission accomplishment. {{clearanceStatement}}{{certifications}}Seeking to continue public service as a {{targetRole}}.`
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
  { id: 'defense', name: 'Defense / Government' },
]
