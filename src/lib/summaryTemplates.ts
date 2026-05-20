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
    template: `Accomplished senior leader with {{yearsOfService}} years of progressive management experience directing teams of {{teamSize}} professionals across complex, high-stakes operations. Proven track record of managing multimillion-dollar budgets, developing organizational strategy, and driving measurable performance improvements. {{certifications}}{{clearanceStatement}}Expert in talent development, change management, and cross-functional coordination with a history of building high-performing teams from the ground up. Seeking to leverage deep operational leadership and strategic planning expertise in a {{targetRole}} capacity within {{targetIndustry}}.`
  },
  {
    id: 'leadership-mid',
    name: 'Mid-Level Leadership',
    category: 'leadership',
    description: 'For supervisors and team leads',
    template: `Results-driven operations professional with {{yearsOfService}} years of hands-on leadership experience supervising diverse teams in dynamic, fast-paced environments. Skilled in personnel development, performance management, process improvement, and cross-functional coordination. {{certifications}}{{clearanceStatement}}Demonstrated ability to streamline workflows, reduce operational costs, and mentor junior staff into leadership roles. Ready to bring proven team leadership, accountability, and operational expertise to {{targetIndustry}} as a {{targetRole}}.`
  },

  // OPERATIONS FOCUSED
  {
    id: 'operations-management',
    name: 'Operations Management',
    category: 'operations',
    description: 'Emphasizes operational excellence and process optimization',
    template: `Operations leader with {{yearsOfService}} years managing complex logistics, maintenance programs, and 24/7 operational requirements supporting organizations of {{teamSize}} personnel. Expert in risk mitigation, regulatory compliance, resource optimization, and continuous process improvement. {{certifications}}{{clearanceStatement}}Consistently delivered measurable results including cost reductions, improved readiness rates, and zero-deficiency inspection outcomes. Seeking to apply systematic operational discipline and data-driven decision-making to civilian operations management in {{targetIndustry}}.`
  },
  {
    id: 'operations-technical',
    name: 'Technical Operations',
    category: 'operations',
    description: 'For technical specialists with operational focus',
    template: `{{mosTitle}} with {{yearsOfService}} years of hands-on technical experience and progressive team leadership in {{specialty}}. Expert in troubleshooting complex systems, implementing preventive maintenance programs, and training personnel to rigorous standards. {{certifications}}{{clearanceStatement}}Proven ability to maintain operational readiness of critical equipment valued at millions of dollars while leading diverse technical teams. Seeking to transition deep technical expertise and leadership skills to a {{targetRole}} position in {{targetIndustry}}.`
  },

  // PROJECT MANAGEMENT
  {
    id: 'project-management',
    name: 'Project Management',
    category: 'project-management',
    description: 'Highlights PM skills - great for PMP holders',
    template: `Project management professional with {{yearsOfService}} years orchestrating complex, multimillion-dollar initiatives across geographically dispersed teams and multiple stakeholders. Experienced in full lifecycle project execution from requirements gathering through delivery, including scope management, risk mitigation, and resource allocation. {{certifications}}{{clearanceStatement}}Adept at managing competing priorities, driving on-time delivery, and communicating status to senior leadership with clarity and precision. Seeking to apply disciplined project management methodology to drive results as a {{targetRole}} in {{targetIndustry}}.`
  },

  // TECHNICAL / IT / CYBER
  {
    id: 'technical-it',
    name: 'IT / Cybersecurity',
    category: 'technical',
    description: 'For IT professionals and cybersecurity specialists',
    template: `Information technology professional with {{yearsOfService}} years of progressive experience in IT operations, network security, and cybersecurity across enterprise environments. {{certifications}}Skilled in vulnerability assessment, incident response, network administration, and security architecture supporting critical infrastructure. {{clearanceStatement}}Proven ability to implement security frameworks, lead compliance audits, and reduce organizational risk through proactive threat mitigation. Seeking to leverage deep technical expertise and security-first mindset in a {{targetRole}} position within {{targetIndustry}}.`
  },
  {
    id: 'technical-engineering',
    name: 'Engineering / Technical',
    category: 'technical',
    description: 'For engineering and technical specialists',
    template: `{{mosTitle}} with {{yearsOfService}} years of technical expertise in {{specialty}}, leading teams responsible for maintaining and optimizing complex systems and equipment. Proven ability to diagnose critical system failures under pressure, implement engineering solutions, and ensure operational readiness of assets valued at millions of dollars. {{certifications}}{{clearanceStatement}}Experienced in technical documentation, quality assurance, and cross-functional collaboration with engineering and operations teams. Seeking to apply technical problem-solving and leadership skills to a {{targetRole}} role in {{targetIndustry}}.`
  },

  // LOGISTICS / SUPPLY CHAIN
  {
    id: 'logistics-supply',
    name: 'Logistics & Supply Chain',
    category: 'logistics',
    description: 'For supply chain and warehouse management professionals',
    template: `Logistics professional with {{yearsOfService}} years managing end-to-end supply chain operations across global networks, including procurement, warehousing, distribution, and vendor coordination. Expert in inventory management systems, demand forecasting, and transportation logistics with a track record of maintaining 100% asset accountability. {{certifications}}{{clearanceStatement}}Consistently reduced operational costs and improved delivery timelines through process optimization and data-driven inventory controls. Ready to transition supply chain expertise and leadership experience to a {{targetRole}} position in {{targetIndustry}}.`
  },

  // TRAINING / HR
  {
    id: 'training-development',
    name: 'Training & Development',
    category: 'training',
    description: 'Emphasizes instructor and personnel development experience',
    template: `Learning and development professional with {{yearsOfService}} years designing, delivering, and evaluating training programs for diverse audiences ranging from entry-level to senior leadership. Experienced in curriculum development, competency-based assessment, instructional design, and performance coaching with measurable outcomes. {{certifications}}{{clearanceStatement}}Proven ability to identify skill gaps, build training roadmaps, and improve organizational performance through targeted professional development initiatives. Passionate about developing talent and building high-performing teams in {{targetIndustry}}.`
  },

  // SECURITY / LAW ENFORCEMENT
  {
    id: 'security-law-enforcement',
    name: 'Security / Law Enforcement',
    category: 'security',
    description: 'For security professionals and law enforcement',
    template: `Security professional with {{yearsOfService}} years of progressive experience protecting personnel, assets, and sensitive information across high-threat environments. Expert in threat assessment, physical security, access control, incident response, and security program management with a zero-incident track record. {{certifications}}{{clearanceStatement}}Skilled in conducting investigations, managing security teams, and implementing security protocols that ensure regulatory compliance. Seeking to apply comprehensive security expertise to corporate security, law enforcement, or federal service as a {{targetRole}}.`
  },

  // HEALTHCARE / MEDICAL
  {
    id: 'healthcare-medical',
    name: 'Healthcare / Medical',
    category: 'healthcare',
    description: 'For medical professionals and healthcare workers',
    template: `Healthcare professional with {{yearsOfService}} years of clinical and administrative experience in high-pressure, fast-paced medical environments. Skilled in emergency medicine, patient care coordination, medical documentation, and clinical quality improvement. {{certifications}}{{clearanceStatement}}Proven ability to lead medical teams, manage patient outcomes, and maintain compliance with healthcare regulations including HIPAA and Joint Commission standards. Committed to delivering compassionate, high-quality care and operational excellence in {{targetIndustry}}.`
  },

  // GENERAL / FLEXIBLE
  {
    id: 'general-versatile',
    name: 'Versatile Professional',
    category: 'general',
    description: 'Flexible template that works for most backgrounds',
    template: `Accomplished operations professional with {{yearsOfService}} years of proven leadership, technical proficiency, and commitment to organizational excellence. Adept at managing teams of {{teamSize}} personnel, solving complex problems under pressure, and delivering consistent results in demanding environments. {{certifications}}{{clearanceStatement}}Skilled in strategic planning, process improvement, and stakeholder communication with a track record of exceeding performance standards. Eager to bring disciplined leadership, adaptability, and a results-focused mindset to a {{targetRole}} position in {{targetIndustry}}.`
  },
  {
    id: 'general-career-change',
    name: 'Career Changer',
    category: 'general',
    description: 'For those pivoting to a completely new field',
    template: `Versatile professional with {{yearsOfService}} years of progressive leadership and operational experience seeking to pivot into {{targetIndustry}}. Brings highly transferable skills in team management, strategic problem-solving, budget oversight, and high-pressure decision-making developed across complex organizations. {{certifications}}{{clearanceStatement}}Known for rapid mastery of new domains, building trusted relationships with diverse stakeholders, and consistently exceeding expectations in every role. Committed to applying proven leadership capabilities and operational discipline to a {{targetRole}} career.`
  },

  // DEFENSE CONTRACTOR - OK to use military terminology here
  {
    id: 'defense-contractor',
    name: 'Defense Contractor',
    category: 'defense',
    description: 'For defense/government positions - military terminology acceptable',
    template: `{{rank}} with {{yearsOfService}} years of {{branch}} experience in {{specialty}}, bringing deep operational knowledge of defense programs, acquisition processes, and mission-critical systems. Extensive background in government operations, interagency coordination, and compliance with DoD regulations and standards. {{clearanceStatement}}{{certifications}}Proven ability to bridge military requirements with contractor deliverables and drive program success. Seeking to continue serving in the defense industry as a {{targetRole}}.`
  },
  {
    id: 'federal-government',
    name: 'Federal Government',
    category: 'defense',
    description: 'For federal civilian positions - military terminology acceptable',
    template: `Veteran with {{yearsOfService}} years of {{branch}} service transitioning to federal civilian employment, bringing a proven track record of leadership, operational excellence, and mission accomplishment. Experienced in government program management, regulatory compliance, and stakeholder coordination across multiple agencies. {{clearanceStatement}}{{certifications}}Skilled in strategic planning, resource management, and policy implementation with deep understanding of federal operations. Seeking to continue public service and apply military-honed expertise as a {{targetRole}}.`
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
