/**
 * Centralized paygrade-to-skills mapping covering all 19 paygrades.
 * Used by StepSkills (onboarding) and SkillsSection (profile).
 */

export const PAYGRADE_SKILLS: Record<string, string[]> = {
  // Junior Enlisted (E-1 to E-4): Technical & operational
  'E-1': ['Equipment Operation', 'Standard Operating Procedures', 'Physical Security', 'Safety Compliance', 'Teamwork'],
  'E-2': ['Equipment Operation', 'Safety Compliance', 'Inventory Management', 'Standard Operating Procedures', 'Attention to Detail'],
  'E-3': ['Technical Proficiency', 'Equipment Maintenance', 'Safety Compliance', 'Task Prioritization', 'Inventory Management', 'Documentation'],
  'E-4': ['Technical Proficiency', 'Task Delegation', 'Quality Assurance', 'On-the-Job Training', 'Equipment Maintenance', 'Inventory Management'],

  // NCOs (E-5 to E-6): Supervision + technical
  'E-5': ['Team Leadership', 'Training & Development', 'Performance Management', 'Technical Expertise', 'Mentoring', 'Scheduling'],
  'E-6': ['Team Leadership', 'Training & Development', 'Process Improvement', 'Resource Management', 'Conflict Resolution', 'Performance Evaluation'],

  // Senior NCOs (E-7 to E-9): Leadership + program management
  'E-7': ['Organizational Leadership', 'Strategic Planning', 'Policy Implementation', 'Program Management', 'Executive Communication', 'Training Program Development'],
  'E-8': ['Strategic Planning', 'Change Management', 'Executive Communication', 'Organizational Development', 'Stakeholder Management', 'Budget Oversight'],
  'E-9': ['Executive Leadership', 'Strategic Vision', 'Organizational Transformation', 'C-Suite Communication', 'Enterprise Risk Management', 'Policy Development'],

  // Warrant Officers (W-1 to W-5): Technical expertise + advisory
  'W-1': ['Technical Expertise', 'Systems Management', 'Quality Assurance', 'Specialized Training', 'Technical Writing'],
  'W-2': ['Technical Advisory', 'Systems Analysis', 'Program Coordination', 'Risk Assessment', 'Technical Training Development'],
  'W-3': ['Subject Matter Expertise', 'Systems Integration', 'Technical Program Management', 'Interagency Coordination', 'Policy Advisory'],
  'W-4': ['Senior Technical Advisory', 'Enterprise Systems Management', 'Organizational Consulting', 'Cross-Functional Leadership', 'Strategic Technical Planning'],
  'W-5': ['Executive Technical Leadership', 'Enterprise Architecture', 'Strategic Advisory', 'Organizational Transformation', 'Senior Mentorship'],

  // Junior Officers (O-1 to O-3): Operations + team leadership
  'O-1': ['Operations Management', 'Mission Planning', 'Team Leadership', 'Briefing & Presentation', 'Logistics Coordination'],
  'O-2': ['Operations Management', 'Team Leadership', 'Project Planning', 'Resource Allocation', 'Report Writing'],
  'O-3': ['Organizational Leadership', 'Operations Management', 'Budget Management', 'Staff Development', 'Interagency Coordination'],

  // Field Grade Officers (O-4 to O-6): Program management + strategy
  'O-4': ['Strategic Leadership', 'Program Management', 'Policy Development', 'Interagency Coordination', 'Budget Management'],
  'O-5': ['Executive Leadership', 'Strategic Planning', 'Organizational Management', 'Stakeholder Engagement', 'Congressional Liaison'],
  'O-6': ['Executive Leadership', 'Strategic Operations', 'Legislative Affairs', 'Multi-Agency Coordination', 'Organizational Strategy'],

  // General/Flag Officers (O-7 to O-10): Executive + strategic
  'O-7': ['Executive Leadership', 'National Security Strategy', 'Joint Operations', 'Congressional Relations', 'Enterprise Management'],
  'O-8': ['Executive Leadership', 'National Security Strategy', 'Intergovernmental Relations', 'Strategic Communications', 'Organizational Transformation'],
  'O-9': ['Executive Leadership', 'National Security Policy', 'International Relations', 'Strategic Vision', 'Enterprise Governance'],
  'O-10': ['Executive Leadership', 'National Security Policy', 'International Diplomacy', 'Strategic Vision', 'Public Affairs'],
}

/**
 * Fallback: if paygrade is not found in the map, infer tier from prefix.
 */
export function getSkillsForPaygrade(paygrade: string): string[] {
  if (PAYGRADE_SKILLS[paygrade]) return PAYGRADE_SKILLS[paygrade]

  // Fallback by prefix
  if (paygrade.startsWith('E-')) {
    const num = parseInt(paygrade.replace('E-', ''), 10)
    if (num <= 4) return PAYGRADE_SKILLS['E-4']
    if (num <= 6) return PAYGRADE_SKILLS['E-6']
    return PAYGRADE_SKILLS['E-9']
  }
  if (paygrade.startsWith('W-')) return PAYGRADE_SKILLS['W-3']
  if (paygrade.startsWith('O-')) {
    const num = parseInt(paygrade.replace('O-', ''), 10)
    if (num <= 3) return PAYGRADE_SKILLS['O-3']
    if (num <= 6) return PAYGRADE_SKILLS['O-5']
    return PAYGRADE_SKILLS['O-10']
  }

  return []
}
