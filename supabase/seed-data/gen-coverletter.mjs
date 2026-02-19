#!/usr/bin/env node
/**
 * Generate dict_cover_letter_templates SQL (100+ rows)
 * Schema: template_name, industry, role_type, opening_paragraph, body_paragraph_1, body_paragraph_2, closing_paragraph, placeholders (JSONB), notes
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const esc = s => s == null ? 'NULL' : s.replace(/'/g, "''");

/** Normalize branch values for database consistency. Use ONLY these values in SQL. */
function normalizeBranch(branch) {
  const map = {
    'army': 'army', 'Army': 'army', 'ARMY': 'army', 'US Army': 'army', 'U.S. Army': 'army',
    'navy': 'navy', 'Navy': 'navy', 'NAVY': 'navy', 'US Navy': 'navy', 'U.S. Navy': 'navy',
    'air force': 'usaf', 'Air Force': 'usaf', 'USAF': 'usaf', 'AF': 'usaf', 'U.S. Air Force': 'usaf', 'air_force': 'usaf',
    'marine corps': 'usmc', 'Marine Corps': 'usmc', 'Marines': 'usmc', 'USMC': 'usmc', 'marines': 'usmc', 'U.S. Marine Corps': 'usmc',
    'coast guard': 'uscg', 'Coast Guard': 'uscg', 'USCG': 'uscg', 'CG': 'uscg', 'coast_guard': 'uscg', 'U.S. Coast Guard': 'uscg',
    'space force': 'ussf', 'Space Force': 'ussf', 'USSF': 'ussf', 'SF': 'ussf', 'space_force': 'ussf', 'U.S. Space Force': 'ussf',
    'general': 'general', 'General': 'general', 'all': 'general', 'All': 'general',
  };
  return map[branch] || branch.toLowerCase().replace(/\s+/g, '_');
}

// Industries and their role types
const industryRoles = {
  Technology: ['Software Engineer', 'IT Manager', 'Systems Administrator', 'Cybersecurity Analyst', 'Data Analyst', 'DevOps Engineer', 'Technical Project Manager'],
  Healthcare: ['Healthcare Administrator', 'Clinical Operations Manager', 'Health IT Specialist', 'Medical Logistics Manager', 'Patient Safety Officer'],
  Finance: ['Financial Analyst', 'Risk Manager', 'Compliance Officer', 'Budget Analyst', 'Internal Auditor'],
  Government: ['Program Analyst', 'Policy Advisor', 'Contract Specialist', 'Intelligence Analyst', 'Federal Program Manager'],
  Education: ['Training Manager', 'Instructional Designer', 'Academic Advisor', 'Education Director', 'Curriculum Developer'],
  Manufacturing: ['Operations Manager', 'Quality Assurance Manager', 'Production Supervisor', 'Supply Chain Manager', 'Lean Six Sigma Lead'],
  Logistics: ['Logistics Manager', 'Transportation Director', 'Warehouse Manager', 'Distribution Analyst', 'Fleet Manager'],
  Consulting: ['Management Consultant', 'Strategy Analyst', 'Operations Consultant', 'Change Management Lead'],
  Defense: ['Program Manager', 'Systems Engineer', 'Defense Analyst', 'Security Manager', 'Acquisition Specialist'],
  Energy: ['Operations Manager', 'Safety Manager', 'Environmental Specialist', 'Power Systems Engineer'],
  'Non-Profit': ['Program Director', 'Outreach Coordinator', 'Grant Writer', 'Community Manager'],
  Retail: ['Store Manager', 'District Manager', 'Loss Prevention Manager', 'Operations Manager'],
  Construction: ['Project Manager', 'Site Supervisor', 'Safety Director', 'Estimator'],
  Telecommunications: ['Network Engineer', 'Field Operations Manager', 'Technical Support Manager'],
  Aerospace: ['Aerospace Engineer', 'Mission Planner', 'Flight Ops Manager', 'Quality Engineer'],
};

// Opening paragraph templates (varied by tone)
const openings = [
  "I am writing to express my strong interest in the {role_type} position at {company_name}. As a {years}-year military veteran with extensive experience in {domain}, I bring a unique combination of leadership, discipline, and technical expertise that directly aligns with your team's needs.",
  "With {years} years of proven leadership and operational excellence in the {branch}, I am excited to apply for the {role_type} role at {company_name}. My military career has equipped me with the skills, resilience, and results-driven mindset that {company_name} values.",
  "I am eager to bring my {years} years of military experience to the {role_type} position at {company_name}. My background in {domain} has prepared me to deliver immediate value in a fast-paced civilian environment.",
  "As a transitioning military professional with {years}+ years of service, I am confident that my expertise in {domain} makes me an excellent candidate for the {role_type} position at {company_name}. I have consistently delivered results in high-stakes environments and am ready to bring that same commitment to your organization.",
  "The {role_type} opportunity at {company_name} immediately caught my attention because of its alignment with my {years}-year military career in {domain}. I have spent my career building teams, solving complex problems, and driving operational improvements — skills that translate directly to this role.",
];

// Body paragraph 1 templates (experience/skills focused)
const body1Templates = {
  Technology: [
    "During my military service, I managed complex IT infrastructure supporting {user_count}+ users across multiple locations. I led teams of {team_size} technicians in maintaining {uptime}% system availability while implementing security protocols that protected classified networks. My experience with {tech_stack} and enterprise systems administration translates directly to your technology environment.",
    "In my role as {military_title}, I led the implementation of {technology} across a {scope}-person organization, resulting in {result}. I am experienced in {tech_stack} and hold certifications including {certifications}. My ability to bridge technical depth with strategic communication ensures I can contribute both as an individual contributor and team leader.",
  ],
  Healthcare: [
    "Throughout my military career, I managed healthcare operations serving {patient_count}+ personnel, ensuring compliance with strict regulatory standards. I led teams of {team_size} medical professionals and maintained {metric}% readiness rates. My experience in clinical operations, medical logistics, and health information systems provides a strong foundation for this role.",
    "As a {military_title}, I coordinated medical support for a {scope}-person organization, managing budgets of ${budget}+ and ensuring regulatory compliance across multiple facilities. My experience in patient care coordination, HIPAA-equivalent protocols, and healthcare technology directly supports the operational excellence {company_name} demands.",
  ],
  Finance: [
    "In my military career, I managed budgets exceeding ${budget} annually, administered {contract_count}+ contracts, and maintained zero audit discrepancies across multiple inspection cycles. My experience in financial planning, resource allocation, and compliance reporting provides the analytical rigor and attention to detail required for this role.",
    "As a {military_title}, I was responsible for financial management of a ${budget} annual budget supporting {personnel_count}+ personnel. I implemented cost-saving initiatives that reduced operational expenses by {savings_percent}% while maintaining mission effectiveness. My financial acumen and leadership experience align well with {company_name}'s expectations.",
  ],
  Government: [
    "My {years} years of federal service have given me deep experience in government operations, policy development, and interagency coordination. I have managed programs with budgets exceeding ${budget}, led cross-functional teams, and maintained security clearances at the {clearance_level} level. I understand the unique demands of public sector work and am ready to contribute immediately.",
    "Throughout my career, I served in roles requiring strategic analysis, stakeholder management, and complex project execution. I held a {clearance_level} security clearance and regularly briefed senior leaders on operational readiness and policy recommendations. My understanding of federal acquisition, compliance frameworks, and organizational management directly supports this role.",
  ],
  Education: [
    "As a military instructor and training manager, I developed and delivered curricula for {trainee_count}+ personnel, achieving {pass_rate}% qualification rates. I am skilled in instructional design, adult learning principles, and training needs assessment. My passion for developing others and driving performance improvement makes me an ideal candidate for this education-focused role.",
    "During my service, I led training programs that transformed organizational performance. I designed {course_count}+ courses, managed instructor teams of {team_size}, and implemented assessment systems that improved learning outcomes by {improvement}%. My experience in curriculum development, facilitation, and program evaluation directly supports {company_name}'s educational mission.",
  ],
  Manufacturing: [
    "In my military career, I managed maintenance and production operations for equipment valued at ${value}+, leading teams of {team_size} technicians. I implemented lean processes that reduced downtime by {reduction}% and improved quality metrics by {quality_improvement}%. My experience in operations management, quality control, and workforce development aligns well with manufacturing leadership.",
    "As a {military_title}, I oversaw production operations supporting a {scope}-person organization. I am Six Sigma trained and have led continuous improvement initiatives that saved ${savings}+ annually. My hands-on technical experience combined with management skills makes me well-suited for operational leadership at {company_name}.",
  ],
  Logistics: [
    "My military logistics experience includes managing supply chains with {line_items}+ line items valued at ${value}+, coordinating transportation across multiple modes, and achieving {accuracy}% inventory accuracy. I led teams of {team_size} logistics professionals and implemented process improvements that reduced order fulfillment time by {reduction}%.",
    "As a {military_title}, I directed logistics operations for a {scope}-person organization across multiple locations. I managed ${value}+ in assets, achieved {metric}% on-time delivery rates, and implemented inventory management systems that eliminated waste. My experience directly translates to the supply chain excellence {company_name} requires.",
  ],
  Consulting: [
    "My military background has honed my ability to analyze complex problems, develop strategic solutions, and drive organizational change. I have led cross-functional teams of {team_size}+ in high-pressure environments, managed projects valued at ${value}+, and consistently delivered results that exceeded expectations. These skills are the foundation of effective consulting.",
    "Throughout my service, I served in advisory roles requiring rapid assessment of organizational challenges and development of actionable recommendations. I have experience in process improvement, change management, and stakeholder engagement — core consulting competencies that I am eager to apply at {company_name}.",
  ],
  Defense: [
    "With {years} years in the {branch}, I bring deep expertise in defense operations, program management, and systems acquisition. I have managed programs valued at ${value}+, held {clearance_level} clearances, and worked directly with defense contractors on complex technical programs. My understanding of the defense ecosystem makes me an ideal fit for this role.",
    "My military career focused on {domain}, where I led teams of {team_size}+ in developing and fielding critical defense capabilities. I am experienced in DoD acquisition processes, requirements development, and systems engineering. I am ready to leverage this expertise in support of {company_name}'s defense programs.",
  ],
  Energy: [
    "During my military service, I managed power generation and distribution systems supporting critical operations. I led teams of {team_size} in maintaining {uptime}% operational availability while ensuring strict safety and environmental compliance. My technical expertise and safety-first leadership approach align well with the energy sector.",
    "As a {military_title}, I oversaw energy operations for facilities supporting {personnel_count}+ personnel. I implemented energy conservation measures that reduced consumption by {reduction}% and maintained zero safety incidents across {duration}. My experience in operations, safety management, and regulatory compliance directly supports this role.",
  ],
  'Non-Profit': [
    "My military career instilled a deep commitment to service that naturally extends to the non-profit sector. I have managed community programs serving {community_size}+ individuals, coordinated volunteer teams of {team_size}, and secured resources for programs with budgets of ${budget}+. My passion for making a difference, combined with operational management skills, makes me an excellent fit.",
    "Throughout my service, I led outreach and engagement efforts that built partnerships with civilian organizations and community leaders. I am skilled in program development, grant management, and stakeholder engagement. I am excited to bring these capabilities to {company_name}'s mission.",
  ],
  Retail: [
    "In the military, I managed operations supporting {personnel_count}+ customers daily, maintained inventory valued at ${value}+, and led teams of {team_size} in delivering consistent service excellence. My experience in P&L management, loss prevention, and team leadership translates directly to retail management.",
    "As a {military_title}, I oversaw facility operations with annual budgets of ${budget}+. I implemented inventory management improvements that reduced shrinkage by {reduction}% and improved customer satisfaction scores by {improvement}%. My operational leadership experience supports the fast-paced retail environment at {company_name}.",
  ],
  Construction: [
    "My military engineering experience includes managing construction projects valued at ${value}+, leading teams of {team_size} in completing projects on time and under budget, and maintaining strict safety compliance with zero lost-time incidents. I am experienced in project scheduling, contract management, and quality assurance.",
    "As a {military_title}, I directed facility construction and maintenance for installations supporting {personnel_count}+ personnel. I managed multiple concurrent projects, coordinated with subcontractors, and ensured compliance with building codes and environmental regulations. My project management skills directly support construction leadership.",
  ],
  Telecommunications: [
    "My military communications experience includes managing network infrastructure supporting {user_count}+ users, implementing telecommunications systems, and leading technical teams of {team_size}. I have maintained {uptime}% network availability and hold certifications in {certifications}. My technical depth and leadership experience align with this role.",
    "As a {military_title}, I designed and maintained tactical and enterprise communication systems across multiple locations. I am experienced in RF systems, fiber optics, and satellite communications. My ability to troubleshoot complex network issues and lead technical teams makes me well-suited for {company_name}.",
  ],
  Aerospace: [
    "With {years} years in military aviation/space operations, I bring deep expertise in mission planning, flight operations, and aerospace systems management. I have managed assets valued at ${value}+, maintained {safety_record} safety records, and led teams of {team_size} in executing complex operations. My experience directly supports {company_name}'s aerospace mission.",
    "My career in military aerospace operations has prepared me for civilian roles requiring precision, reliability, and technical excellence. I have experience in satellite operations, mission control, and systems engineering. I am excited to contribute to {company_name}'s innovative aerospace programs.",
  ],
};

// Body paragraph 2 templates (transferable skills & values)
const body2s = [
  "Beyond technical qualifications, my military experience has developed exceptional soft skills that are critical in any organization. I am adept at building high-performing teams, communicating complex information to diverse audiences, and maintaining composure under pressure. I bring a strong work ethic, unwavering integrity, and a commitment to continuous improvement that will add immediate value to your organization.",
  "What sets me apart is not just my technical background but the leadership philosophy I developed through military service. I believe in servant leadership, accountability, and empowering team members to achieve their full potential. I have consistently built teams that exceed expectations, and I am eager to bring this approach to {company_name}.",
  "My military training has instilled in me a deep appreciation for teamwork, planning, and execution. I am accustomed to working in environments where precision matters, deadlines are non-negotiable, and adaptability is essential. These qualities, combined with my commitment to professional development and continuous learning, make me a strong addition to your team.",
  "I am particularly drawn to {company_name} because of your commitment to {company_value}. My military background has given me firsthand experience with the importance of {related_value}, and I am excited to contribute to an organization that shares these principles. I am confident that my leadership experience and technical skills will help drive your team's success.",
  "Throughout my career, I have consistently demonstrated the ability to learn quickly, adapt to new environments, and deliver results. Transitioning from military to civilian service is a challenge I embrace with the same determination that defined my military career. I am committed to bringing value from day one and growing with {company_name} over the long term.",
];

// Closing paragraph templates
const closings = [
  "I would welcome the opportunity to discuss how my military experience and skills can contribute to {company_name}'s success. I am available for an interview at your convenience and can be reached at {phone} or {email}. Thank you for considering my application, and I look forward to the possibility of joining your team.",
  "Thank you for considering my application for the {role_type} position. I am confident that my {years} years of military leadership and operational experience make me a strong candidate. I welcome the opportunity to discuss how I can contribute to {company_name}'s mission and would be happy to provide additional references or information upon request.",
  "I am enthusiastic about the opportunity to bring my military-honed skills to {company_name} and am confident I can make an immediate impact. I would appreciate the chance to discuss my qualifications in more detail. Please feel free to contact me at {phone} or {email} to schedule a conversation.",
  "I look forward to the opportunity to discuss how my background in {domain} aligns with {company_name}'s goals. My military service has prepared me to excel in demanding environments, and I am eager to demonstrate my value to your organization. Thank you for your time and consideration.",
];

const placeholders = {
  company_name: 'Target company name',
  role_type: 'Target job title',
  years: 'Years of military service',
  branch: 'Military branch of service',
  domain: 'Primary area of expertise',
  phone: 'Contact phone number',
  email: 'Contact email address',
  military_title: 'Most recent military title/rank',
  team_size: 'Number of personnel led',
  clearance_level: 'Security clearance level',
  company_value: 'Company value or mission element',
  related_value: 'Related military value or principle',
};

const lines = [];
let count = 0;

lines.push('-- =============================================================================');
lines.push('-- TABLE: dict_cover_letter_templates');
lines.push(`-- Generated: ${new Date().toISOString().split('T')[0]}`);
lines.push('-- =============================================================================');
lines.push('');

for (const [industry, roles] of Object.entries(industryRoles)) {
  const industryBody1s = body1Templates[industry] || body1Templates.Consulting;
  lines.push(`-- ${industry} templates`);

  for (let ri = 0; ri < roles.length; ri++) {
    const role = roles[ri];
    const opening = openings[ri % openings.length];
    const b1 = industryBody1s[ri % industryBody1s.length];
    const b2 = body2s[ri % body2s.length];
    const closing = closings[ri % closings.length];
    const name = `${industry.toLowerCase().replace(/[^a-z]/g, '_')}_${role.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    const placeholdersJson = JSON.stringify(placeholders).replace(/'/g, "''");

    lines.push(
      `INSERT INTO dict_cover_letter_templates (template_name, industry, role_type, opening_paragraph, body_paragraph_1, body_paragraph_2, closing_paragraph, placeholders, notes)` +
      ` VALUES ('${esc(name)}', '${esc(industry)}', '${esc(role)}', '${esc(opening)}', '${esc(b1)}', '${esc(b2)}', '${esc(closing)}', '${placeholdersJson}'::jsonb, 'Military-to-civilian cover letter template for ${esc(industry)} ${esc(role)} roles')` +
      ` ON CONFLICT DO NOTHING;`
    );
    count++;
  }
  lines.push('');
}

lines.push(`-- dict_cover_letter_templates: ${count} INSERT statements`);

writeFileSync(join(__dirname, 'part3-coverletter.sql'), lines.join('\n'), 'utf8');
console.log(`dict_cover_letter_templates: ${count} inserts → part3-coverletter.sql`);
