#!/usr/bin/env node
/**
 * Generate additional dict_bullet_patterns SQL to reach 300+ total
 * Adds more patterns in existing categories + new categories
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

// New categories and patterns not in the base set
const extraPatterns = {
  'Supply Chain': [
    [
      '{action_verb} end-to-end supply chain for {count}+ SKUs valued at ${value}, achieving {metric}% fill rate',
      'Managed end-to-end supply chain for 5,000+ NSNs valued at $30M, achieving 97% fill rate',
      'Managed end-to-end supply chain for 5,000+ SKUs valued at $30M, achieving 97% fill rate',
      ['action_verb', 'count', 'value', 'metric'],
      [],
    ],
    [
      'Negotiated {count} vendor contracts saving ${savings} annually while maintaining {metric}% quality standards',
      'Negotiated 25 supply contracts saving $500K annually while maintaining 99% quality standards',
      'Negotiated 25 vendor contracts saving $500K annually while maintaining 99% quality standards',
      ['count', 'savings', 'metric'],
      [],
    ],
  ],
  'Human Resources': [
    [
      '{action_verb} {process_type} for {count}+ employees, reducing {metric} by {percentage}%',
      'Managed in-processing for 200+ new soldiers per quarter, reducing onboarding time by 30%',
      'Managed onboarding process for 200+ new hires per quarter, reducing time-to-productivity by 30%',
      ['action_verb', 'process_type', 'count', 'metric', 'percentage'],
      [],
    ],
    [
      'Conducted {count} performance evaluations per {timeframe}, achieving {metric}% on-time completion',
      'Conducted 100 NCOERs per quarter, achieving 100% on-time submission',
      'Conducted 100 performance reviews per quarter, achieving 100% on-time completion',
      ['count', 'timeframe', 'metric'],
      [],
    ],
  ],
  'Cybersecurity': [
    [
      '{action_verb} security posture for {scope} network, reducing vulnerabilities by {percentage}%',
      'Hardened security posture for battalion network of 500+ endpoints, reducing vulnerabilities by 85%',
      'Strengthened security posture for enterprise network of 500+ endpoints, reducing vulnerabilities by 85%',
      ['action_verb', 'scope', 'percentage'],
      [],
    ],
    [
      'Responded to {count} security incidents per {timeframe}, achieving {metric} mean time to resolution',
      'Responded to 50 security incidents per month, achieving 4-hour mean time to resolution',
      'Responded to 50 security incidents per month, achieving 4-hour mean time to resolution',
      ['count', 'timeframe', 'metric'],
      [],
    ],
  ],
  'Emergency Response': [
    [
      '{action_verb} emergency response plan for {scope}, tested through {count} exercises achieving {metric}',
      'Developed mass casualty response plan for 2,000-person installation, tested through 6 drills achieving full compliance',
      'Developed emergency response plan for 2,000-person facility, tested through 6 exercises achieving full compliance',
      ['action_verb', 'scope', 'count', 'metric'],
      [],
    ],
    [
      'Led {count}-person response team during {event_type}, coordinating {resource_type} across {scope}',
      'Led 20-person response team during base flooding, coordinating evacuation of 500 personnel across 3 buildings',
      'Led 20-person response team during facility emergency, coordinating evacuation of 500 personnel across 3 buildings',
      ['count', 'event_type', 'resource_type', 'scope'],
      [],
    ],
  ],
  'Strategic Planning': [
    [
      '{action_verb} {plan_type} plan spanning {timeframe}, aligning {count} departments toward {objective}',
      'Developed 5-year modernization plan spanning FY24-28, aligning 8 directorates toward force readiness goals',
      'Developed 5-year strategic plan spanning FY24-28, aligning 8 departments toward growth objectives',
      ['action_verb', 'plan_type', 'timeframe', 'count', 'objective'],
      [],
    ],
    [
      'Identified and prioritized {count} strategic initiatives, securing ${funding} in resources for implementation',
      'Identified and prioritized 12 capability gaps, securing $5M in MILCON funding for facility upgrades',
      'Identified and prioritized 12 strategic initiatives, securing $5M in capital investment for implementation',
      ['count', 'funding'],
      [],
    ],
  ],
  'Diversity & Inclusion': [
    [
      '{action_verb} equal opportunity program serving {count} personnel, resolving {case_count} cases with {metric}% satisfaction',
      'Managed EO program serving 800 soldiers, resolving 30 complaints with 95% satisfaction',
      'Managed diversity and inclusion program serving 800 employees, resolving 30 cases with 95% satisfaction',
      ['action_verb', 'count', 'case_count', 'metric'],
      [],
    ],
  ],
  'Environmental': [
    [
      '{action_verb} environmental compliance program for {scope}, achieving zero violations across {count} inspections',
      'Managed environmental compliance for 500-acre installation, achieving zero violations across 12 EPA inspections',
      'Managed environmental compliance program for 500-acre facility, achieving zero violations across 12 regulatory inspections',
      ['action_verb', 'scope', 'count'],
      [],
    ],
    [
      'Reduced {waste_type} waste by {percentage}% through {method}, saving ${savings} in disposal costs',
      'Reduced hazardous waste by 40% through recycling program, saving $200K in disposal costs',
      'Reduced hazardous waste by 40% through sustainability program, saving $200K in disposal costs',
      ['waste_type', 'percentage', 'method', 'savings'],
      [],
    ],
  ],
  'International Operations': [
    [
      '{action_verb} operations across {count} countries, coordinating with {partner_count} international partners',
      'Coordinated intelligence operations across 5 countries, coordinating with 12 coalition partners',
      'Coordinated international operations across 5 countries, coordinating with 12 international partners',
      ['action_verb', 'count', 'partner_count'],
      [],
    ],
    [
      'Managed {count} foreign national employees, navigating {challenge_type} to achieve {result}',
      'Managed 30 local national interpreters, navigating cultural differences to achieve mission objectives',
      'Managed 30 international team members, navigating cultural differences to achieve project objectives',
      ['count', 'challenge_type', 'result'],
      [],
    ],
  ],
  'Quality Management': [
    [
      '{action_verb} quality management system achieving {certification} certification for {scope}',
      'Implemented quality management system achieving ISO 9001 equivalent for maintenance operations',
      'Implemented quality management system achieving ISO 9001 certification for manufacturing operations',
      ['action_verb', 'certification', 'scope'],
      [],
    ],
    [
      'Reduced defect rate from {before}% to {after}% through {method}, saving ${savings} in rework costs',
      'Reduced equipment failure rate from 8% to 2% through predictive maintenance, saving $300K in repair costs',
      'Reduced defect rate from 8% to 2% through process improvement, saving $300K in rework costs',
      ['before', 'after', 'method', 'savings'],
      [],
    ],
  ],
  'Medical': [
    [
      '{action_verb} medical support for {count} personnel, maintaining {metric}% medical readiness',
      'Provided medical support for 500 soldiers, maintaining 97% medical readiness rate',
      'Coordinated healthcare services for 500 employees, maintaining 97% health compliance rate',
      ['action_verb', 'count', 'metric'],
      [],
    ],
    [
      'Managed {count} patient encounters per {timeframe}, achieving {metric}% patient satisfaction',
      'Managed 200 patient encounters per week, achieving 96% patient satisfaction scores',
      'Managed 200 client interactions per week, achieving 96% satisfaction scores',
      ['count', 'timeframe', 'metric'],
      [],
    ],
  ],
};

const lines = [];
let count = 0;

for (const [category, patterns] of Object.entries(extraPatterns)) {
  lines.push(`-- ${category} patterns (extra)`);
  for (const tier of rankTiers) {
    for (let pi = 0; pi < patterns.length; pi++) {
      const [template, exMil, exOut, reqFields, optFields] = patterns[pi];
      const name = `${category.toLowerCase().replace(/[^a-z]/g, '_')}_${tier}_extra_${pi + 1}`;

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

lines.push(`-- dict_bullet_patterns (extra): ${count} INSERT statements`);

writeFileSync(join(__dirname, 'part2-patterns-extra.sql'), lines.join('\n'), 'utf8');
console.log(`dict_bullet_patterns (extra): ${count} inserts → part2-patterns-extra.sql`);
