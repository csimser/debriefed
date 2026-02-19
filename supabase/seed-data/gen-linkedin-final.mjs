#!/usr/bin/env node
/**
 * Generate final batch of dict_linkedin_keywords to reach 300+
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

const data = [
  // Branch-specific skills
  ['Naval Navigation', ['Maritime Navigation', 'Chart Reading', 'Celestial Navigation', 'ECDIS'], 'Defense', 'medium'],
  ['Ship Handling', ['Vessel Operations', 'Bridge Watch', 'Seamanship', 'Helm Operations'], 'Defense', 'low'],
  ['Submarine Operations', ['Undersea Warfare', 'Nuclear Submarine', 'Silent Service', 'Submarine Systems'], 'Defense', 'low'],
  ['Amphibious Operations', ['Beach Operations', 'Landing Craft', 'Ship-to-Shore', 'Expeditionary Operations'], 'Defense', 'low'],
  ['Airborne Operations', ['Parachute Operations', 'Air Assault', 'Airborne Planning', 'Drop Zone Operations'], 'Defense', 'low'],
  ['Artillery Fire Direction', ['Ballistic Computation', 'Fire Control', 'Targeting Systems', 'Precision Munitions'], 'Defense', 'low'],
  ['Tank Operations', ['Armored Vehicle Operations', 'Combined Arms Maneuver', 'Gunnery', 'Mounted Operations'], 'Defense', 'low'],
  ['Mine Warfare', ['Explosive Ordnance', 'Mine Countermeasures', 'UXO', 'Demining'], 'Defense', 'low'],

  // Certifications as skills
  ['PMP Preparation', ['Project Management Professional', 'PMP', 'PMBOK', 'Project Management Institute'], 'Consulting', 'high'],
  ['CISSP Knowledge', ['CISSP', 'Information Systems Security', 'ISC2', 'Security Architecture'], 'Technology', 'high'],
  ['CompTIA Certifications', ['CompTIA Security+', 'CompTIA Network+', 'CompTIA A+', 'IT Certification'], 'Technology', 'high'],
  ['Six Sigma Methodology', ['Lean Six Sigma', 'Green Belt', 'Black Belt', 'DMAIC', 'Process Improvement'], 'Manufacturing', 'high'],
  ['Acquisition Certifications', ['DAWIA', 'Defense Acquisition', 'Program Management', 'Level III Certified'], 'Defense', 'high'],
  ['Safety Certifications', ['OSHA 30', 'CSP', 'ASP', 'Safety Professional', 'BCSP'], 'Manufacturing', 'high'],
  ['Healthcare Certifications', ['BLS', 'ACLS', 'PALS', 'TCCC', 'EMT Certification'], 'Healthcare', 'high'],
  ['Logistics Certifications', ['APICS', 'CSCP', 'CPIM', 'Supply Chain Certification'], 'Logistics', 'high'],

  // Soft skills with industry context
  ['Cultural Awareness', ['Cross-Cultural Communication', 'Global Mindset', 'Cultural Competency', 'Diversity Awareness'], 'General', 'medium'],
  ['Conflict Resolution', ['Mediation', 'Dispute Resolution', 'Negotiation', 'Conflict Management'], 'General', 'high'],
  ['Stress Management', ['Resilience', 'Emotional Intelligence', 'Self-Regulation', 'Mindfulness'], 'General', 'medium'],
  ['Self-Discipline', ['Self-Motivation', 'Self-Starter', 'Initiative', 'Personal Accountability'], 'General', 'medium'],
  ['Mission Focus', ['Goal Orientation', 'Results-Driven', 'Outcome Focus', 'Achievement Motivation'], 'General', 'high'],
  ['Followership', ['Organizational Support', 'Team Player', 'Execution', 'Operational Support'], 'General', 'medium'],
  ['Physical Fitness', ['Health Conscious', 'Active Lifestyle', 'Physical Endurance', 'Wellness Advocate'], 'General', 'low'],
  ['Military Bearing', ['Professional Presence', 'Executive Presence', 'Professional Demeanor', 'Poise'], 'General', 'medium'],

  // Technology-specific additional
  ['SCADA Systems', ['Industrial Control Systems', 'ICS Security', 'SCADA Operations', 'OT Security'], 'Energy', 'high'],
  ['Blockchain Knowledge', ['Distributed Ledger', 'Smart Contracts', 'Cryptocurrency', 'Web3'], 'Technology', 'low'],
  ['Machine Learning', ['AI/ML', 'Deep Learning', 'Neural Networks', 'Predictive Modeling', 'TensorFlow'], 'Technology', 'high'],
  ['IoT Systems', ['Internet of Things', 'Sensor Networks', 'Edge Computing', 'Embedded Systems'], 'Technology', 'medium'],
  ['DevSecOps', ['Secure Development', 'CI/CD Security', 'Container Security', 'Application Security'], 'Technology', 'high'],
  ['ERP Systems', ['SAP', 'Oracle ERP', 'Enterprise Resource Planning', 'Business Applications'], 'Technology', 'high'],
  ['Backup and Recovery', ['Disaster Recovery', 'Business Continuity', 'Data Backup', 'RTO/RPO'], 'Technology', 'medium'],
  ['Identity Management', ['IAM', 'Single Sign-On', 'MFA', 'Privileged Access Management', 'Okta'], 'Technology', 'high'],

  // More industry specifics
  ['Real Estate Management', ['Property Management', 'Facility Operations', 'Lease Administration', 'Space Planning'], 'Construction', 'medium'],
  ['Fleet Electrification', ['EV Fleet', 'Electric Vehicle Infrastructure', 'Charging Stations', 'Green Fleet'], 'Logistics', 'medium'],
  ['Regulatory Compliance', ['FDA Compliance', 'EPA Compliance', 'SOX Compliance', 'Regulatory Affairs'], 'General', 'high'],
  ['Vendor Management', ['Supplier Relationship Management', 'RFP Management', 'Vendor Evaluation', 'Contract Negotiation'], 'General', 'high'],
  ['Business Development', ['Sales Strategy', 'Client Acquisition', 'Proposal Writing', 'Capture Management'], 'Defense', 'high'],
  ['Capture Management', ['Proposal Development', 'Win Strategy', 'Government BD', 'Opportunity Pipeline'], 'Defense', 'high'],
  ['Technical Proposal Writing', ['RFP Response', 'Technical Volume', 'Proposal Coordination', 'Orals Presentations'], 'Defense', 'high'],
];

const lines = [];
let count = 0;

for (const [skill, keywords, industry, priority] of data) {
  lines.push(
    `INSERT INTO dict_linkedin_keywords (military_skill, linkedin_keywords, industry, priority)` +
    ` VALUES ('${esc(skill)}', ${pgArr(keywords)}, '${esc(industry)}', '${esc(priority)}')` +
    ` ON CONFLICT DO NOTHING;`
  );
  count++;
}

lines.push('');
lines.push(`-- dict_linkedin_keywords (final): ${count} INSERT statements`);

writeFileSync(join(__dirname, 'part3-linkedin-final.sql'), lines.join('\n'), 'utf8');
console.log(`dict_linkedin_keywords (final): ${count} inserts → part3-linkedin-final.sql`);
