#!/usr/bin/env node
/**
 * Generate dict_professional_summaries SQL (200+ rows)
 * Schema: template_name, rank_tier, target_industry, target_role, template_text, example_output
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

const rankTiers = [
  'junior_enlisted',
  'senior_enlisted',
  'junior_officer',
  'senior_officer',
  'warrant_officer',
];

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Government', 'Education',
  'Manufacturing', 'Logistics', 'Consulting', 'Defense', 'Energy',
  'Non-Profit', 'Retail', 'Construction', 'Telecommunications', 'Aerospace',
];

// For each rank_tier × industry, generate 2-4 role-specific summaries
const rolesByIndustry = {
  Technology: ['Software Engineer', 'IT Manager', 'Systems Administrator', 'Cybersecurity Analyst', 'Data Analyst'],
  Healthcare: ['Healthcare Administrator', 'Clinical Operations Manager', 'Health IT Specialist', 'Medical Logistics Coordinator'],
  Finance: ['Financial Analyst', 'Risk Manager', 'Compliance Officer', 'Budget Analyst'],
  Government: ['Program Analyst', 'Policy Advisor', 'Federal Contract Specialist', 'Intelligence Analyst'],
  Education: ['Training Manager', 'Instructional Designer', 'Academic Advisor', 'Education Program Director'],
  Manufacturing: ['Operations Manager', 'Quality Assurance Manager', 'Production Supervisor', 'Supply Chain Manager'],
  Logistics: ['Logistics Manager', 'Transportation Coordinator', 'Warehouse Operations Manager', 'Distribution Analyst'],
  Consulting: ['Management Consultant', 'Strategy Analyst', 'Operations Consultant', 'Change Management Specialist'],
  Defense: ['Program Manager', 'Systems Engineer', 'Defense Analyst', 'Security Manager'],
  Energy: ['Operations Manager', 'Safety Manager', 'Environmental Compliance Specialist', 'Power Systems Engineer'],
  'Non-Profit': ['Program Director', 'Outreach Coordinator', 'Grant Writer', 'Community Relations Manager'],
  Retail: ['Store Manager', 'District Manager', 'Loss Prevention Manager', 'Inventory Manager'],
  Construction: ['Project Manager', 'Site Supervisor', 'Safety Director', 'Estimator'],
  Telecommunications: ['Network Engineer', 'Field Operations Manager', 'Technical Support Manager', 'RF Engineer'],
  Aerospace: ['Aerospace Engineer', 'Mission Planner', 'Flight Operations Manager', 'Quality Engineer'],
};

// Template text patterns by rank tier
const templatePatterns = {
  junior_enlisted: [
    "Detail-oriented {role} with {years}+ years of hands-on experience in {domain}. Proven ability to execute complex tasks under pressure, maintain strict quality standards, and collaborate effectively within diverse teams. Adept at applying systematic problem-solving methodologies honed through military service to drive operational improvements in {industry} environments.",
    "Results-driven professional transitioning from military service to {industry}, bringing {years}+ years of disciplined execution and technical proficiency. Skilled in {skill1}, {skill2}, and {skill3}. Committed to delivering excellence in fast-paced environments requiring precision and reliability.",
    "Motivated {role} with a strong foundation in {domain} gained through military service. Demonstrates exceptional attention to detail, physical and mental resilience, and the ability to perform under demanding conditions. Seeking to leverage hands-on technical skills and teamwork experience in a civilian {industry} career.",
  ],
  senior_enlisted: [
    "Accomplished {role} with {years}+ years of progressive leadership experience managing teams of 10-50 personnel. Expert in {domain} with a track record of implementing process improvements that reduce costs and increase efficiency. Skilled in mentoring junior staff, enforcing standards, and driving organizational performance in high-stakes {industry} environments.",
    "Dynamic leader transitioning to {industry} with extensive experience in {domain}. Proven ability to train, develop, and lead cross-functional teams while maintaining accountability for multi-million-dollar equipment and resources. Recognized for exceptional organizational skills and the ability to translate military operations into civilian business value.",
    "Senior operations professional with {years}+ years leading technical teams in demanding environments. Expertise in {skill1}, {skill2}, and workforce development. Demonstrated success in streamlining processes, reducing waste, and building high-performance teams. Ready to apply proven leadership and operational management skills to {role} challenges.",
  ],
  junior_officer: [
    "Strategic {role} with {years}+ years of leadership experience directing teams of 20-100 personnel in high-tempo environments. Expertise in {domain} with demonstrated ability to plan and execute complex operations, manage budgets exceeding $1M, and drive organizational change. Strong analytical and communication skills suited for {industry} leadership roles.",
    "Results-oriented professional with a proven track record of leading diverse teams and managing complex projects in {domain}. Holds a bachelor's degree and brings {years}+ years of military officer experience including strategic planning, resource allocation, and stakeholder engagement. Seeking to leverage leadership capabilities in a {industry} {role} position.",
    "Decisive leader with {years}+ years of officer experience in {domain}. Skilled in mission planning, risk assessment, and cross-functional team management. Proven ability to deliver results under tight deadlines and resource constraints while maintaining the highest ethical standards. Passionate about driving {industry} innovation through disciplined execution.",
  ],
  senior_officer: [
    "Executive leader with {years}+ years of senior military experience directing organizations of 200+ personnel with budgets exceeding $10M. Expert in {domain} with a proven track record of strategic planning, policy development, and organizational transformation. Holds advanced degree(s) and brings executive-level decision-making skills to {industry} leadership.",
    "Visionary {role} with extensive senior leadership experience spanning strategic planning, enterprise risk management, and large-scale program execution. {years}+ years of progressive military leadership including command-level responsibility for personnel, operations, and resources. Recognized for building high-performance organizations and fostering innovation in {industry}.",
    "Transformational leader with {years}+ years directing complex multi-stakeholder operations. Expertise in {domain} with demonstrated success in change management, strategic communications, and interagency coordination. Holds advanced credentials and seeks to apply senior executive competencies to drive {industry} organizational excellence as {role}.",
  ],
  warrant_officer: [
    "Technical expert and {role} with {years}+ years of specialized experience in {domain}. Unique combination of deep technical proficiency and leadership capability developed through warrant officer service. Proven ability to bridge the gap between technical execution and strategic objectives in {industry} environments.",
    "Subject matter expert in {domain} with {years}+ years of progressive technical leadership. As a warrant officer, developed unparalleled depth in {skill1}, {skill2}, and {skill3}. Skilled in technical mentoring, process optimization, and translating complex requirements into actionable solutions for {industry} organizations.",
    "Seasoned technical leader with warrant officer expertise in {domain}. {years}+ years of hands-on experience combined with advanced problem-solving and advisory skills. Recognized authority in {skill1} with a track record of resolving complex technical challenges. Seeking {role} position to apply specialized knowledge in {industry}.",
  ],
};

// Skills by industry for template filling
const skillsByIndustry = {
  Technology: ['cloud infrastructure', 'agile development', 'systems integration', 'DevSecOps', 'network architecture'],
  Healthcare: ['HIPAA compliance', 'clinical workflows', 'patient care coordination', 'healthcare informatics', 'medical supply chain'],
  Finance: ['financial modeling', 'risk assessment', 'regulatory compliance', 'portfolio analysis', 'audit management'],
  Government: ['policy analysis', 'interagency coordination', 'federal acquisitions', 'security clearance management', 'legislative liaison'],
  Education: ['curriculum development', 'adult learning theory', 'assessment design', 'program evaluation', 'instructional technology'],
  Manufacturing: ['lean manufacturing', 'Six Sigma', 'quality management', 'production planning', 'equipment maintenance'],
  Logistics: ['supply chain optimization', 'transportation management', 'inventory control', 'distribution planning', 'fleet management'],
  Consulting: ['business process improvement', 'change management', 'stakeholder engagement', 'strategic planning', 'data-driven decision making'],
  Defense: ['program management', 'systems acquisition', 'threat assessment', 'classified operations', 'mission planning'],
  Energy: ['power systems', 'safety management', 'environmental compliance', 'grid operations', 'renewable energy systems'],
  'Non-Profit': ['grant management', 'community outreach', 'fundraising strategy', 'program development', 'volunteer coordination'],
  Retail: ['P&L management', 'customer experience', 'inventory optimization', 'team leadership', 'visual merchandising'],
  Construction: ['project scheduling', 'safety compliance', 'blueprint reading', 'contract management', 'equipment operations'],
  Telecommunications: ['network operations', 'signal processing', 'tower maintenance', 'fiber optics', 'wireless infrastructure'],
  Aerospace: ['mission planning', 'flight operations', 'systems engineering', 'quality assurance', 'configuration management'],
};

const domainByIndustry = {
  Technology: 'information technology and systems engineering',
  Healthcare: 'healthcare operations and clinical support',
  Finance: 'financial management and resource allocation',
  Government: 'government operations and public administration',
  Education: 'training, education, and professional development',
  Manufacturing: 'production operations and quality control',
  Logistics: 'logistics, supply chain, and distribution management',
  Consulting: 'organizational management and strategic operations',
  Defense: 'defense operations and national security',
  Energy: 'energy operations and infrastructure management',
  'Non-Profit': 'community services and program management',
  Retail: 'retail operations and customer service management',
  Construction: 'construction management and facility operations',
  Telecommunications: 'telecommunications and network operations',
  Aerospace: 'aerospace operations and mission support',
};

const yearsMap = {
  junior_enlisted: '3',
  senior_enlisted: '10',
  junior_officer: '6',
  senior_officer: '15',
  warrant_officer: '12',
};

const lines = [];
let count = 0;

lines.push('-- =============================================================================');
lines.push('-- TABLE: dict_professional_summaries');
lines.push(`-- Generated: ${new Date().toISOString().split('T')[0]}`);
lines.push('-- =============================================================================');
lines.push('');

for (const tier of rankTiers) {
  for (const industry of industries) {
    const roles = rolesByIndustry[industry] || ['General Manager'];
    const templates = templatePatterns[tier];
    const skills = skillsByIndustry[industry] || ['leadership', 'operations', 'management'];
    const domain = domainByIndustry[industry] || industry.toLowerCase();
    const years = yearsMap[tier];

    // Pick 2-3 roles per industry to keep counts manageable but hit 200+
    const selectedRoles = roles.slice(0, 3);

    for (let ri = 0; ri < selectedRoles.length; ri++) {
      const role = selectedRoles[ri];
      const template = templates[ri % templates.length];

      const text = template
        .replace(/\{role\}/g, role)
        .replace(/\{industry\}/g, industry)
        .replace(/\{domain\}/g, domain)
        .replace(/\{years\}/g, years)
        .replace(/\{skill1\}/g, skills[0])
        .replace(/\{skill2\}/g, skills[1])
        .replace(/\{skill3\}/g, skills[2] || 'team leadership');

      const name = `${tier}_${industry.toLowerCase().replace(/[^a-z]/g, '_')}_${role.toLowerCase().replace(/[^a-z]/g, '_')}`;

      lines.push(
        `INSERT INTO dict_professional_summaries (template_name, rank_tier, target_industry, target_role, template_text, example_output)` +
        ` VALUES ('${esc(name)}', '${esc(tier)}', '${esc(industry)}', '${esc(role)}', '${esc(text)}', NULL)` +
        ` ON CONFLICT DO NOTHING;`
      );
      count++;
    }
  }
}

lines.push('');
lines.push(`-- dict_professional_summaries: ${count} INSERT statements`);

writeFileSync(join(__dirname, 'part2-summaries.sql'), lines.join('\n'), 'utf8');
console.log(`dict_professional_summaries: ${count} inserts → part2-summaries.sql`);
