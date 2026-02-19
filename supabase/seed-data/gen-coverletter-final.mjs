#!/usr/bin/env node
/**
 * Generate final batch of dict_cover_letter_templates to reach 100+
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

const placeholders = {
  company_name: 'Target company name',
  role_type: 'Target job title',
  years: 'Years of military service',
  branch: 'Military branch of service',
  domain: 'Primary area of expertise',
  phone: 'Contact phone number',
  email: 'Contact email address',
  team_size: 'Number of personnel led',
  clearance_level: 'Security clearance level',
};

const extraTemplates = [
  {
    name: 'tech_ai_ml_engineer', industry: 'Technology', role: 'AI/ML Engineer',
    opening: "I am applying for the AI/ML Engineer position at {company_name}. My {years} years of military experience in data analysis, pattern recognition, and complex systems — combined with technical skills in machine learning — position me to make meaningful contributions to your AI initiatives.",
    body1: "In the military, I analyzed large datasets to identify patterns, predict outcomes, and support decision-making. I have experience with Python, SQL, and data visualization tools, and have completed training in machine learning frameworks. My analytical mindset, developed through intelligence and operational analysis, translates directly to ML problem-solving.",
    body2: "What distinguishes my candidacy is the combination of technical aptitude and real-world problem-solving experience. I understand how to frame business problems for ML solutions, validate model outputs against ground truth, and communicate results to non-technical stakeholders.",
    closing: "I am excited about the opportunity to apply AI/ML to real-world challenges at {company_name}. I look forward to discussing this role with you.",
  },
  {
    name: 'healthcare_operations_director', industry: 'Healthcare', role: 'Operations Director',
    opening: "I am writing to express interest in the Operations Director position at {company_name}. My {years} years of military healthcare leadership, managing complex multi-site operations with hundreds of personnel, directly prepares me for this executive role.",
    body1: "As a senior military healthcare leader, I directed clinical and administrative operations across multiple facilities serving {patient_count}+ beneficiaries. I managed budgets exceeding ${budget}, implemented electronic health record systems, and drove quality improvement initiatives that measurably improved patient outcomes and operational efficiency.",
    body2: "I bring a systems-thinking approach to healthcare operations, understanding how clinical, financial, and administrative functions interconnect. My experience in leading through regulatory complexity, managing diverse workforces, and driving organizational change makes me well-suited for healthcare executive leadership.",
    closing: "I would welcome the opportunity to discuss how my healthcare leadership experience can drive operational excellence at {company_name}. Thank you for your consideration.",
  },
  {
    name: 'finance_risk_analyst', industry: 'Finance', role: 'Risk Analyst',
    opening: "I am applying for the Risk Analyst position at {company_name}. My {years} years of military experience in threat assessment, risk mitigation, and data-driven decision-making provide an ideal foundation for financial risk analysis.",
    body1: "Military service is fundamentally about risk management — assessing threats, evaluating probabilities, and implementing mitigation strategies. I have applied these skills to manage operational risks in environments where the stakes were life and death. I am experienced in quantitative analysis, scenario planning, and presenting risk assessments to senior decision-makers.",
    body2: "I am transitioning these analytical skills to the financial sector, supplemented by coursework in financial risk management and familiarity with regulatory frameworks. My ability to remain calm under pressure, think probabilistically, and communicate complex risk scenarios clearly will add immediate value to your risk team.",
    closing: "I am eager to bring my analytical rigor and risk management experience to {company_name}'s finance team. Thank you for considering my application.",
  },
  {
    name: 'govt_program_manager', industry: 'Government', role: 'Program Manager',
    opening: "I am writing to apply for the Program Manager position. With {years} years of military program and project management experience including ACAT-level acquisition programs, I bring the leadership and technical management skills this role requires.",
    body1: "In my military career, I managed programs with total lifecycle costs exceeding ${value}, coordinating across engineering, logistics, test, and contracting organizations. I am experienced in earned value management, integrated master scheduling, risk management, and performance reporting. I hold DAWIA certifications and understand the full acquisition lifecycle.",
    body2: "Military program managers are among the most rigorously trained in the world. We manage complex technical programs with strict accountability requirements and demanding stakeholders. I am ready to bring this same discipline and execution focus to support {company_name}'s program management needs.",
    closing: "I look forward to discussing how my program management expertise can contribute to {company_name}'s mission. Thank you for your time.",
  },
  {
    name: 'education_corporate_trainer', industry: 'Education', role: 'Corporate Trainer',
    opening: "I am excited to apply for the Corporate Trainer position at {company_name}. With {years} years as a military instructor and training developer, I have honed my ability to design and deliver impactful learning experiences that drive measurable performance improvement.",
    body1: "As a military master instructor, I trained {trainee_count}+ personnel in technical and leadership subjects, consistently achieving qualification rates above 95%. I designed curricula using ADDIE methodology, incorporated blended learning approaches, and measured training effectiveness through Kirkpatrick evaluation models. My students consistently outperformed their peers.",
    body2: "Corporate training requires the same skills I developed in the military: understanding adult learners, designing engaging content, facilitating dynamic sessions, and measuring outcomes. I bring energy, expertise, and a genuine passion for helping others grow professionally.",
    closing: "I would love the opportunity to bring my instructional expertise to {company_name}'s training programs. Thank you for considering my application.",
  },
  {
    name: 'logistics_procurement_manager', industry: 'Logistics', role: 'Procurement Manager',
    opening: "I am writing to apply for the Procurement Manager position at {company_name}. My {years} years managing military procurement operations, including contracts valued at ${value}+, has prepared me to deliver strategic sourcing excellence.",
    body1: "In my military procurement career, I managed the full procurement lifecycle from requirements definition through contract administration. I evaluated vendors, negotiated contracts, ensured compliance with federal acquisition regulations, and managed supplier performance. I achieved cost savings of ${savings}+ through strategic sourcing and competitive bidding.",
    body2: "Military procurement operates under the most rigorous regulatory framework in the world. This background gives me strong compliance instincts, ethical standards, and documentation discipline that will benefit any procurement organization. I am also skilled in building positive vendor relationships that drive long-term value.",
    closing: "I am eager to bring my procurement expertise to {company_name}. I look forward to discussing this opportunity in detail.",
  },
  {
    name: 'consulting_organizational_dev', industry: 'Consulting', role: 'Organizational Development Consultant',
    opening: "I am applying for the Organizational Development Consultant role at {company_name}. My {years} years of military experience in organizational transformation, leadership development, and change management make me a natural fit for OD consulting.",
    body1: "Throughout my military career, I led organizational transformations including unit activations, deactivations, and reorganizations affecting hundreds of personnel. I developed leadership programs, facilitated team-building interventions, and implemented change management strategies that achieved buy-in from resistant stakeholders. My approach is grounded in both practical experience and OD theory.",
    body2: "Military organizations constantly undergo change — new missions, new technologies, new leadership. This has given me deep experience in helping organizations navigate transitions while maintaining performance. I am skilled at diagnosing organizational issues, designing interventions, and facilitating sustainable change.",
    closing: "I am passionate about helping organizations reach their potential and would welcome the chance to discuss how my experience can benefit {company_name}'s clients. Thank you.",
  },
  {
    name: 'defense_systems_engineer', industry: 'Defense', role: 'Systems Engineer',
    opening: "I am writing to apply for the Systems Engineer position at {company_name}. My {years} years of military systems engineering and acquisition experience, combined with deep technical knowledge, make me well-qualified to support your defense programs.",
    body1: "In my military career, I served as a systems engineer on programs ranging from tactical equipment to enterprise IT systems. I developed system architectures, wrote requirements specifications, conducted trade studies, and managed technical reviews. I am experienced in MIL-STD, INCOSE, and DoDAF frameworks and have worked across all phases of the acquisition lifecycle.",
    body2: "I understand that defense systems engineering requires balancing technical performance with cost, schedule, and supportability. My military operational experience gives me a user perspective that purely technical engineers often lack — I have used the systems I helped develop, which informs better engineering decisions.",
    closing: "I look forward to discussing how my systems engineering experience can support {company_name}'s defense programs. Thank you for your consideration.",
  },
  {
    name: 'energy_operations_supervisor', industry: 'Energy', role: 'Operations Supervisor',
    opening: "I am applying for the Operations Supervisor position at {company_name}. My {years} years of military experience leading technical operations teams in power generation and distribution makes me well-suited for energy sector leadership.",
    body1: "In my military career, I supervised teams of {team_size} technicians operating and maintaining power generation equipment. I managed shift operations, conducted equipment inspections, coordinated maintenance activities, and ensured compliance with safety and environmental regulations. My teams consistently achieved the highest readiness and safety ratings.",
    body2: "Energy operations require the same 24/7 operational mindset that defined my military career. I am experienced in shift management, emergency procedures, equipment troubleshooting, and the kind of rigorous safety culture that the energy industry demands.",
    closing: "I am eager to bring my operational leadership to {company_name}'s energy operations. Thank you for considering my application.",
  },
  {
    name: 'aerospace_flight_test', industry: 'Aerospace', role: 'Flight Test Engineer',
    opening: "I am applying for the Flight Test Engineer position at {company_name}. My {years} years of military aviation experience, including flight test support and aircraft systems expertise, make me a strong candidate for this role.",
    body1: "In my military career, I supported flight test programs for military aircraft, collecting and analyzing flight data, writing test plans, and coordinating test missions. I have experience with data acquisition systems, telemetry, and test instrumentation. I understand airworthiness requirements and have worked closely with test pilots to evaluate aircraft performance.",
    body2: "Military flight test engineers are trained to be meticulous, safety-conscious, and analytically rigorous. I bring these qualities along with practical knowledge of aircraft systems and a deep understanding of the test and evaluation process. I am excited to apply this expertise to {company_name}'s aerospace programs.",
    closing: "I look forward to discussing how my flight test experience can benefit {company_name}. Thank you for your consideration.",
  },
  {
    name: 'construction_project_engineer', industry: 'Construction', role: 'Project Engineer',
    opening: "I am writing to apply for the Project Engineer position at {company_name}. My {years} years of military engineering experience, including construction project management and technical oversight, has prepared me for this role.",
    body1: "As a military engineer, I managed construction projects from design through completion, including site preparation, foundation work, vertical construction, and utilities installation. I reviewed engineering drawings, coordinated with contractors, managed project budgets of ${value}+, and ensured quality and safety compliance. My projects consistently met or exceeded standards.",
    body2: "Military engineers learn to build under the most challenging conditions — austere environments, compressed timelines, and limited resources. This experience has made me resourceful, adaptable, and skilled at finding solutions when standard approaches are not available.",
    closing: "I am eager to bring my engineering project experience to {company_name}. I look forward to discussing this opportunity.",
  },
  {
    name: 'telecom_rf_engineer', industry: 'Telecommunications', role: 'RF Engineer',
    opening: "I am applying for the RF Engineer position at {company_name}. My {years} years of military experience with radio frequency systems, including tactical and satellite communications, provides the technical foundation this role requires.",
    body1: "In the military, I designed, installed, and maintained RF communication systems across multiple frequency bands. I have experience with antenna design, propagation analysis, spectrum management, and interference mitigation. I have maintained systems ranging from HF to microwave and satellite communications, achieving exceptional reliability rates.",
    body2: "Military RF engineers work in the most demanding electromagnetic environments, requiring mastery of spectrum management and interference resolution. I bring this depth of RF expertise, combined with field engineering experience, to solve complex communications challenges at {company_name}.",
    closing: "I would welcome the chance to discuss how my RF engineering experience can support {company_name}'s communications infrastructure. Thank you.",
  },
];

const lines = [];
let count = 0;

for (const t of extraTemplates) {
  const pJson = JSON.stringify(placeholders).replace(/'/g, "''");
  lines.push(
    `INSERT INTO dict_cover_letter_templates (template_name, industry, role_type, opening_paragraph, body_paragraph_1, body_paragraph_2, closing_paragraph, placeholders, notes)` +
    ` VALUES ('${esc(t.name)}', '${esc(t.industry)}', '${esc(t.role)}', '${esc(t.opening)}', '${esc(t.body1)}', '${esc(t.body2)}', '${esc(t.closing)}', '${pJson}'::jsonb, 'Military-to-civilian template for ${esc(t.industry)} ${esc(t.role)}')` +
    ` ON CONFLICT DO NOTHING;`
  );
  count++;
}

lines.push('');
lines.push(`-- dict_cover_letter_templates (final): ${count} INSERT statements`);

writeFileSync(join(__dirname, 'part3-coverletter-final.sql'), lines.join('\n'), 'utf8');
console.log(`dict_cover_letter_templates (final): ${count} inserts → part3-coverletter-final.sql`);
