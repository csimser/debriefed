#!/usr/bin/env node
/**
 * Generate dict_bullet_patterns SQL (300+ rows)
 * Schema: pattern_name, category, rank_tier, pattern_template, example_military, example_output, required_fields[], optional_fields[]
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const esc = s => s == null ? 'NULL' : s.replace(/'/g, "''");
const pgArr = arr => !arr?.length ? "'{}'" : `'{${arr.map(s => `"${esc(s)}"`).join(",")}}'`;

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

const rankTiers = ['junior_enlisted', 'senior_enlisted', 'junior_officer', 'senior_officer', 'warrant_officer'];

// Categories of resume bullets
const categories = [
  'Leadership',
  'Technical',
  'Operations',
  'Training',
  'Administration',
  'Logistics',
  'Communication',
  'Safety',
  'Budget',
  'Project Management',
  'Maintenance',
  'Analytics',
  'Customer Service',
  'Compliance',
  'Innovation',
];

// Pattern templates by category — each has [pattern_template, example_military, example_output, required_fields, optional_fields]
const patternData = {
  Leadership: [
    [
      '{action_verb} a team of {team_size} {personnel_type} in {context}, achieving {result}',
      'Led a squad of 12 soldiers in daily combat operations during OEF deployment',
      'Led a team of 12 field personnel in daily operations, achieving zero safety incidents over 12 months',
      ['action_verb', 'team_size', 'context', 'result'],
      ['personnel_type'],
    ],
    [
      '{action_verb} {team_size}-person cross-functional team to {objective}, resulting in {metric} improvement in {area}',
      'Directed 25-person platoon to complete base relocation ahead of schedule',
      'Directed 25-person cross-functional team to complete facility relocation, resulting in 15% improvement in operational efficiency',
      ['action_verb', 'team_size', 'objective', 'metric', 'area'],
      [],
    ],
    [
      'Mentored and developed {count} {personnel_type}, with {metric}% achieving {achievement}',
      'Mentored and developed 8 junior Marines, with 6 earning meritorious promotions',
      'Mentored and developed 8 junior staff members, with 75% achieving early promotion or certification',
      ['count', 'metric', 'achievement'],
      ['personnel_type'],
    ],
    [
      '{action_verb} organizational restructuring of {unit_size}-person {unit_type}, improving {metric} by {percentage}%',
      'Spearheaded reorganization of 150-person company, improving readiness rating by 30%',
      'Spearheaded organizational restructuring of 150-person department, improving productivity by 30%',
      ['action_verb', 'unit_size', 'metric', 'percentage'],
      ['unit_type'],
    ],
    [
      'Served as principal advisor to {leader_title} on {topic}, influencing decisions affecting {scope}',
      'Served as principal advisor to battalion commander on logistics operations affecting 800 personnel',
      'Served as principal advisor to VP of Operations on supply chain strategy, influencing decisions affecting 800+ employees',
      ['leader_title', 'topic', 'scope'],
      [],
    ],
  ],
  Technical: [
    [
      '{action_verb} {system_type} systems supporting {user_count}+ users, maintaining {uptime}% uptime',
      'Maintained SATCOM and tactical radio systems supporting 500+ users with 99.7% uptime',
      'Managed enterprise communication systems supporting 500+ users, maintaining 99.7% uptime',
      ['action_verb', 'system_type', 'user_count', 'uptime'],
      [],
    ],
    [
      'Troubleshot and resolved {count}+ {issue_type} issues, reducing {metric} by {percentage}%',
      'Troubleshot and resolved 200+ network connectivity issues, reducing downtime by 45%',
      'Troubleshot and resolved 200+ network connectivity issues, reducing system downtime by 45%',
      ['count', 'issue_type', 'metric', 'percentage'],
      [],
    ],
    [
      '{action_verb} {technology} implementation across {scope}, resulting in {result}',
      'Engineered new cybersecurity framework across the brigade network, blocking 99% of threats',
      'Engineered cybersecurity framework implementation across the enterprise, resulting in 99% threat detection rate',
      ['action_verb', 'technology', 'scope', 'result'],
      [],
    ],
    [
      'Designed and deployed {system_type} solution that {achievement}, saving {savings} annually',
      'Designed and deployed automated inventory tracking system that eliminated manual counts, saving 2,000 man-hours annually',
      'Designed and deployed automated inventory tracking solution that eliminated manual audits, saving $150K annually',
      ['system_type', 'achievement', 'savings'],
      [],
    ],
    [
      'Performed {count}+ {procedure_type} procedures with {accuracy}% accuracy rate, exceeding standards by {margin}%',
      'Performed 300+ equipment calibrations with 99.5% accuracy, exceeding Army standards by 2%',
      'Performed 300+ quality calibration procedures with 99.5% accuracy rate, exceeding industry standards by 2%',
      ['count', 'procedure_type', 'accuracy', 'margin'],
      [],
    ],
  ],
  Operations: [
    [
      '{action_verb} daily operations for {scope}, ensuring {result} across {count} {units}',
      'Coordinated daily flight operations for the squadron, ensuring mission-ready status across 24 aircraft',
      'Coordinated daily operations for the division, ensuring full operational readiness across 24 assets',
      ['action_verb', 'scope', 'result', 'count', 'units'],
      [],
    ],
    [
      'Planned and executed {count} {operation_type} operations, achieving {metric} on-time completion rate',
      'Planned and executed 45 convoy operations across Afghanistan with 100% on-time delivery rate',
      'Planned and executed 45 distribution operations, achieving 100% on-time completion rate',
      ['count', 'operation_type', 'metric'],
      [],
    ],
    [
      '{action_verb} standard operating procedures for {area}, reducing {metric} by {percentage}% and {additional_result}',
      'Developed SOPs for maintenance scheduling, reducing equipment downtime by 35% and increasing fleet availability',
      'Developed standard operating procedures for maintenance scheduling, reducing equipment downtime by 35% and increasing fleet availability by 20%',
      ['action_verb', 'area', 'metric', 'percentage'],
      ['additional_result'],
    ],
    [
      'Managed {scope} operations with an annual throughput of {volume}, achieving {metric}',
      'Managed base supply operations with annual throughput of $15M in equipment, achieving zero discrepancies',
      'Managed warehouse operations with an annual throughput of $15M in inventory, achieving zero discrepancies in audits',
      ['scope', 'volume', 'metric'],
      [],
    ],
    [
      '{action_verb} {process_type} process that improved {metric} from {before} to {after}',
      'Implemented new arms room inventory process that improved accountability from 92% to 99.8%',
      'Implemented new inventory management process that improved accuracy from 92% to 99.8%',
      ['action_verb', 'process_type', 'metric', 'before', 'after'],
      [],
    ],
  ],
  Training: [
    [
      'Designed and delivered {topic} training program for {count}+ {audience}, achieving {metric}% {result}',
      'Designed and delivered weapons qualification training for 200+ soldiers, achieving 98% first-time pass rate',
      'Designed and delivered technical certification training for 200+ employees, achieving 98% first-time pass rate',
      ['topic', 'count', 'metric', 'result'],
      ['audience'],
    ],
    [
      '{action_verb} {count}-hour {topic} curriculum, training {trainee_count} {personnel} across {timeframe}',
      'Created 40-hour combat lifesaver curriculum, training 500 soldiers across 12 months',
      'Created 40-hour emergency response curriculum, training 500 staff across 12 months',
      ['action_verb', 'count', 'topic', 'trainee_count', 'timeframe'],
      ['personnel'],
    ],
    [
      'Certified as {certification} instructor; trained and qualified {count} personnel in {topic}',
      'Certified as Master Fitness Trainer; trained and qualified 150 soldiers in physical readiness',
      'Certified as lead instructor; trained and qualified 150 team members in professional development programs',
      ['certification', 'count', 'topic'],
      [],
    ],
    [
      'Reduced {metric} from {before} to {after} by implementing {training_type} program for {audience}',
      'Reduced safety incidents from 12 to 2 annually by implementing monthly safety awareness training for all hands',
      'Reduced workplace incidents from 12 to 2 annually by implementing monthly safety training for all staff',
      ['metric', 'before', 'after', 'training_type'],
      ['audience'],
    ],
  ],
  Administration: [
    [
      '{action_verb} {document_type} for {scope}, ensuring {metric}% compliance with {standard}',
      'Processed personnel actions for 300-person battalion, ensuring 100% compliance with Army regulations',
      'Processed HR transactions for 300-person organization, ensuring 100% compliance with company policies',
      ['action_verb', 'document_type', 'scope', 'metric', 'standard'],
      [],
    ],
    [
      'Managed {system_type} database of {count}+ records, maintaining {accuracy}% data accuracy',
      'Managed DEERS personnel database of 5,000+ service records with 99.9% accuracy',
      'Managed HR information system database of 5,000+ employee records, maintaining 99.9% data accuracy',
      ['system_type', 'count', 'accuracy'],
      [],
    ],
    [
      '{action_verb} {count} {document_type} per {timeframe}, reducing processing time by {percentage}%',
      'Processed 150 travel vouchers per month, reducing processing time by 40% through workflow optimization',
      'Processed 150 expense reports per month, reducing processing time by 40% through workflow automation',
      ['action_verb', 'count', 'document_type', 'timeframe', 'percentage'],
      [],
    ],
    [
      'Coordinated {event_type} for {count}+ {participants}, managing {logistics_scope}',
      'Coordinated change of command ceremonies for 500+ attendees, managing venue, catering, and protocol',
      'Coordinated corporate events for 500+ attendees, managing venue logistics, catering, and executive coordination',
      ['event_type', 'count', 'logistics_scope'],
      ['participants'],
    ],
  ],
  Logistics: [
    [
      '{action_verb} supply chain operations for {count}+ line items valued at ${value}',
      'Managed supply chain for 10,000+ line items valued at $50M in military equipment',
      'Managed supply chain operations for 10,000+ SKUs valued at $50M in inventory',
      ['action_verb', 'count', 'value'],
      [],
    ],
    [
      'Reduced {metric} by {percentage}% through implementation of {solution}',
      'Reduced excess inventory by 25% through implementation of automated reorder point system',
      'Reduced excess inventory by 25% through implementation of automated reorder point system',
      ['metric', 'percentage', 'solution'],
      [],
    ],
    [
      '{action_verb} transportation of {volume} across {distance}, maintaining {metric}% on-time delivery',
      'Coordinated airlift of 500 tons of equipment across 3 continents, maintaining 97% on-time delivery',
      'Coordinated transportation of 500 tons of materials across multiple sites, maintaining 97% on-time delivery',
      ['action_verb', 'volume', 'distance', 'metric'],
      [],
    ],
    [
      'Conducted {count} inventory audits, identifying and resolving {discrepancy_count} discrepancies worth ${value}',
      'Conducted 24 command supply discipline inspections, identifying and resolving 45 discrepancies worth $2M',
      'Conducted 24 inventory audits, identifying and resolving 45 discrepancies worth $2M in assets',
      ['count', 'discrepancy_count', 'value'],
      [],
    ],
  ],
  Communication: [
    [
      '{action_verb} {document_type} for {audience}, translating complex {topic} into actionable guidance',
      'Authored operations orders for battalion staff, translating strategic objectives into tactical tasks',
      'Authored strategic communications for senior leadership, translating complex data into actionable business guidance',
      ['action_verb', 'document_type', 'audience', 'topic'],
      [],
    ],
    [
      'Presented {topic} briefings to {audience} of {count}+, influencing {decision_type} decisions',
      'Presented intelligence briefings to flag officers and staff of 50+, influencing operational decisions',
      'Presented analytical briefings to C-suite executives and stakeholders of 50+, influencing strategic decisions',
      ['topic', 'audience', 'count', 'decision_type'],
      [],
    ],
    [
      '{action_verb} cross-functional communication between {count} {groups}, resolving {issue_type} conflicts',
      'Facilitated communication between 5 coalition partner units, resolving cultural and procedural conflicts',
      'Facilitated cross-functional communication between 5 departments, resolving process and priority conflicts',
      ['action_verb', 'count', 'groups', 'issue_type'],
      [],
    ],
  ],
  Safety: [
    [
      '{action_verb} safety program for {scope}, achieving {count} consecutive days without {incident_type}',
      'Managed battalion safety program for 800 soldiers, achieving 365 consecutive days without lost-time injury',
      'Managed workplace safety program for 800 employees, achieving 365 consecutive days without lost-time incidents',
      ['action_verb', 'scope', 'count', 'incident_type'],
      [],
    ],
    [
      'Conducted {count} safety {inspection_type}, identifying and mitigating {hazard_count} hazards',
      'Conducted 200 safety inspections, identifying and mitigating 50 critical hazards across 3 facilities',
      'Conducted 200 safety inspections, identifying and mitigating 50 critical hazards across 3 facilities',
      ['count', 'inspection_type', 'hazard_count'],
      [],
    ],
    [
      'Reduced {incident_type} incidents by {percentage}% over {timeframe} through {method}',
      'Reduced vehicle accidents by 60% over 18 months through implementation of driver safety training',
      'Reduced workplace incidents by 60% over 18 months through implementation of comprehensive safety training',
      ['incident_type', 'percentage', 'timeframe', 'method'],
      [],
    ],
  ],
  Budget: [
    [
      '{action_verb} annual budget of ${amount} for {scope}, achieving {metric}',
      'Managed annual budget of $5M for company operations, achieving zero audit findings',
      'Managed annual budget of $5M for department operations, achieving zero audit findings',
      ['action_verb', 'amount', 'scope', 'metric'],
      [],
    ],
    [
      'Identified ${savings} in cost savings through {method}, reducing {expense_type} by {percentage}%',
      'Identified $500K in cost savings through supply consolidation, reducing procurement costs by 20%',
      'Identified $500K in cost savings through vendor consolidation, reducing procurement costs by 20%',
      ['savings', 'method', 'expense_type', 'percentage'],
      [],
    ],
    [
      '{action_verb} {count} {contract_type} contracts totaling ${value}, ensuring {compliance_metric}',
      'Administered 15 government contracts totaling $25M, ensuring FAR/DFAR compliance',
      'Administered 15 vendor contracts totaling $25M, ensuring regulatory compliance and on-time deliverables',
      ['action_verb', 'count', 'contract_type', 'value', 'compliance_metric'],
      [],
    ],
  ],
  'Project Management': [
    [
      '{action_verb} {project_type} project from inception to completion, delivering {result} {time_metric}',
      'Led facility construction project from design to occupancy, delivering $3M complex 2 weeks ahead of schedule',
      'Led facility renovation project from inception to completion, delivering $3M project 2 weeks ahead of schedule',
      ['action_verb', 'project_type', 'result', 'time_metric'],
      [],
    ],
    [
      'Managed {count} concurrent {project_type} projects with combined value of ${value}, all completed {metric}',
      'Managed 5 concurrent equipment modernization projects valued at $10M, all completed on time and under budget',
      'Managed 5 concurrent technology upgrade projects with combined value of $10M, all completed on time and under budget',
      ['count', 'project_type', 'value', 'metric'],
      [],
    ],
    [
      '{action_verb} project milestones and deliverables for {stakeholder_count} stakeholders, maintaining {metric}% schedule adherence',
      'Tracked project milestones for 8 stakeholder organizations, maintaining 95% schedule adherence',
      'Tracked project milestones and deliverables for 8 stakeholder groups, maintaining 95% schedule adherence',
      ['action_verb', 'stakeholder_count', 'metric'],
      [],
    ],
  ],
  Maintenance: [
    [
      '{action_verb} maintenance program for {count} {equipment_type} valued at ${value}, achieving {metric}% operational readiness',
      'Managed maintenance program for 50 tactical vehicles valued at $25M, achieving 95% operational readiness',
      'Managed preventive maintenance program for 50 fleet vehicles valued at $25M, achieving 95% operational readiness',
      ['action_verb', 'count', 'equipment_type', 'value', 'metric'],
      [],
    ],
    [
      'Reduced {metric} by {percentage}% through implementation of {maintenance_type} maintenance schedule',
      'Reduced equipment downtime by 30% through implementation of predictive maintenance schedule',
      'Reduced equipment downtime by 30% through implementation of predictive maintenance protocols',
      ['metric', 'percentage', 'maintenance_type'],
      [],
    ],
    [
      '{action_verb} {count} maintenance technicians, completing {work_order_count} work orders per {timeframe}',
      'Supervised 15 mechanics, completing 200 work orders per month with 98% quality pass rate',
      'Supervised 15 maintenance technicians, completing 200 work orders per month with 98% quality pass rate',
      ['action_verb', 'count', 'work_order_count', 'timeframe'],
      [],
    ],
  ],
  Analytics: [
    [
      '{action_verb} {data_type} data from {count}+ sources to produce {output_type} informing {decision_type}',
      'Analyzed intelligence data from 20+ sources to produce assessments informing commander decisions',
      'Analyzed operational data from 20+ sources to produce dashboards informing executive strategic decisions',
      ['action_verb', 'data_type', 'count', 'output_type', 'decision_type'],
      [],
    ],
    [
      'Developed {report_type} reports tracking {count}+ KPIs, enabling {percentage}% improvement in {metric}',
      'Developed readiness reports tracking 50+ metrics, enabling 20% improvement in unit readiness scores',
      'Developed performance reports tracking 50+ KPIs, enabling 20% improvement in operational efficiency',
      ['report_type', 'count', 'percentage', 'metric'],
      [],
    ],
    [
      '{action_verb} {methodology} to identify trends in {area}, recommending changes that {result}',
      'Applied statistical analysis to identify trends in equipment failures, recommending changes that saved $1M',
      'Applied data analytics to identify trends in operational performance, recommending changes that saved $1M annually',
      ['action_verb', 'methodology', 'area', 'result'],
      [],
    ],
  ],
  'Customer Service': [
    [
      '{action_verb} {service_type} services for {count}+ {customers} per {timeframe}, maintaining {metric}% satisfaction',
      'Provided personnel support services for 500+ soldiers per month, maintaining 98% satisfaction rating',
      'Provided customer support services for 500+ clients per month, maintaining 98% satisfaction rating',
      ['action_verb', 'service_type', 'count', 'timeframe', 'metric'],
      ['customers'],
    ],
    [
      'Resolved {count} {issue_type} escalations per {timeframe}, reducing resolution time by {percentage}%',
      'Resolved 50 UCMJ-related cases per quarter, reducing resolution time by 30%',
      'Resolved 50 customer escalations per quarter, reducing resolution time by 30%',
      ['count', 'issue_type', 'timeframe', 'percentage'],
      [],
    ],
  ],
  Compliance: [
    [
      '{action_verb} compliance program ensuring adherence to {standard_count}+ {standard_type}, achieving {metric}',
      'Managed regulatory compliance ensuring adherence to 20+ DoD directives, achieving zero findings',
      'Managed compliance program ensuring adherence to 20+ regulatory standards, achieving zero audit findings',
      ['action_verb', 'standard_count', 'standard_type', 'metric'],
      [],
    ],
    [
      'Conducted {count} {audit_type} audits per {timeframe}, identifying {finding_count} findings and driving {result}',
      'Conducted 12 command inspections per year, identifying 30 findings and driving 100% corrective action',
      'Conducted 12 compliance audits per year, identifying 30 findings and driving 100% corrective action completion',
      ['count', 'audit_type', 'timeframe', 'finding_count', 'result'],
      [],
    ],
  ],
  Innovation: [
    [
      '{action_verb} {innovation_type} that {result}, recognized with {recognition}',
      'Developed automated reporting tool that saved 500 man-hours annually, recognized with Army Achievement Medal',
      'Developed automated reporting tool that saved 500 man-hours annually, recognized with innovation award',
      ['action_verb', 'innovation_type', 'result'],
      ['recognition'],
    ],
    [
      'Pioneered adoption of {technology} within {scope}, becoming the model for {rollout_scope}',
      'Pioneered adoption of digital maintenance tracking within the battalion, becoming the model for brigade-wide rollout',
      'Pioneered adoption of digital workflow automation within the department, becoming the model for company-wide rollout',
      ['technology', 'scope', 'rollout_scope'],
      [],
    ],
  ],
};

const lines = [];
let count = 0;

lines.push('-- =============================================================================');
lines.push('-- TABLE: dict_bullet_patterns');
lines.push(`-- Generated: ${new Date().toISOString().split('T')[0]}`);
lines.push('-- =============================================================================');
lines.push('');

for (const category of categories) {
  const patterns = patternData[category];
  if (!patterns) continue;

  lines.push(`-- ${category} patterns (${patterns.length} base × ${rankTiers.length} tiers)`);

  for (const tier of rankTiers) {
    for (let pi = 0; pi < patterns.length; pi++) {
      const [template, exMil, exOut, reqFields, optFields] = patterns[pi];
      const name = `${category.toLowerCase().replace(/[^a-z]/g, '_')}_${tier}_${pi + 1}`;

      lines.push(
        `INSERT INTO dict_bullet_patterns (pattern_name, category, rank_tier, pattern_template, example_military, example_output, required_fields, optional_fields)` +
        ` VALUES ('${esc(name)}', '${esc(category)}', '${esc(tier)}', '${esc(template)}', '${esc(exMil)}', '${esc(exOut)}', ${pgArr(reqFields)}, ${pgArr(optFields)})` +
        ` ON CONFLICT DO NOTHING;`
      );
      count++;
    }
  }
  lines.push('');
}

lines.push(`-- dict_bullet_patterns: ${count} INSERT statements`);

writeFileSync(join(__dirname, 'part2-patterns.sql'), lines.join('\n'), 'utf8');
console.log(`dict_bullet_patterns: ${count} inserts → part2-patterns.sql`);
