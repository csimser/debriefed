#!/usr/bin/env node
/**
 * Generate EXPANDED SQL INSERT statements for dictionary tables.
 * Appends to dict-json-to-sql-migration.sql
 *
 * Tables:
 *  - dict_phrase_translations (200+ new military resume phrase translations)
 *  - dict_eval_phrases (30+ per branch: Army NCOER, USAF EPR, USMC FITREP, Navy FITREP, CG EER)
 *  - dict_action_verbs (all 1,186 verbs from action-verbs-library.json)
 */
import { readFileSync, appendFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = join(__dirname, '../../src/lib/debriefed-token-saver');
const OUT = join(__dirname, 'dict-json-to-sql-migration.sql');

function esc(str) {
  if (str == null) return 'NULL';
  return str.replace(/'/g, "''");
}

function pgArray(arr) {
  if (!arr || arr.length === 0) return "'{}'";
  const items = arr.map(s => `"${esc(s)}"`).join(',');
  return `'{${items}}'`;
}

function nullable(val) {
  return val == null ? 'NULL' : `'${esc(val)}'`;
}

const lines = [];
const counts = {
  dict_phrase_translations: 0,
  dict_eval_phrases: 0,
  dict_action_verbs: 0,
};

lines.push('');
lines.push('-- =============================================================================');
lines.push('-- EXPANDED SEED DATA (appended)');
lines.push(`-- Generated: ${new Date().toISOString().split('T')[0]}`);
lines.push('-- =============================================================================');
lines.push('');
lines.push('BEGIN;');
lines.push('');

// ==========================================
// 1. dict_phrase_translations — 200+ military resume phrases
// ==========================================
lines.push('-- =============================================================================');
lines.push('-- TABLE: dict_phrase_translations (expanded military resume phrases)');
lines.push('-- =============================================================================');
lines.push('');

const phraseTranslations = [
  // --- Common resume phrasing ---
  { mil: 'served as', civ: 'worked as / held the role of', branch: 'all', cat: 'Resume Phrasing' },
  { mil: 'was tasked with', civ: 'responsible for', branch: 'all', cat: 'Resume Phrasing' },
  { mil: 'in support of', civ: 'supporting / in coordination with', branch: 'all', cat: 'Resume Phrasing' },
  { mil: 'maintained readiness', civ: 'ensured operational preparedness', branch: 'all', cat: 'Resume Phrasing' },
  { mil: 'stood up', civ: 'established / launched / created', branch: 'all', cat: 'Resume Phrasing' },
  { mil: 'stood down', civ: 'decommissioned / closed / sunset', branch: 'all', cat: 'Resume Phrasing' },
  { mil: 'hand-picked by', civ: 'selected by leadership for', branch: 'all', cat: 'Resume Phrasing' },
  { mil: 'fast-tracked for', civ: 'accelerated for promotion / advancement', branch: 'all', cat: 'Resume Phrasing' },
  { mil: 'reported directly to', civ: 'reported directly to', branch: 'all', cat: 'Resume Phrasing' },
  { mil: 'served under', civ: 'reported to / worked under the direction of', branch: 'all', cat: 'Resume Phrasing' },
  { mil: 'attached to', civ: 'assigned to / embedded with', branch: 'all', cat: 'Resume Phrasing' },
  { mil: 'assigned to', civ: 'placed at / working within', branch: 'all', cat: 'Resume Phrasing' },
  { mil: 'detailed to', civ: 'temporarily assigned to / seconded to', branch: 'all', cat: 'Resume Phrasing' },
  { mil: 'augmented', civ: 'supported / reinforced / supplemented', branch: 'all', cat: 'Resume Phrasing' },
  { mil: 'conducted operations', civ: 'performed work / executed tasks', branch: 'all', cat: 'Resume Phrasing' },
  { mil: 'executed the mission', civ: 'completed the project / delivered results', branch: 'all', cat: 'Resume Phrasing' },
  { mil: 'mission essential', civ: 'business critical / essential function', branch: 'all', cat: 'Resume Phrasing' },
  { mil: 'mission capable', civ: 'operational / fully functional', branch: 'all', cat: 'Resume Phrasing' },
  { mil: 'fully mission capable', civ: 'fully operational / 100% readiness', branch: 'all', cat: 'Resume Phrasing' },
  { mil: 'combat ready', civ: 'fully prepared / deployment-ready', branch: 'all', cat: 'Resume Phrasing' },
  { mil: 'war-time tasking', civ: 'high-priority assignment / surge operations', branch: 'all', cat: 'Resume Phrasing' },
  { mil: 'peacetime operations', civ: 'standard operations / day-to-day operations', branch: 'all', cat: 'Resume Phrasing' },
  { mil: 'garrison operations', civ: 'headquarters-based operations / office operations', branch: 'all', cat: 'Resume Phrasing' },

  // --- Leadership & Management ---
  { mil: 'supervised a platoon', civ: 'supervised a team of 30-50 personnel', branch: 'all', cat: 'Leadership' },
  { mil: 'supervised a squad', civ: 'supervised a team of 8-13 personnel', branch: 'all', cat: 'Leadership' },
  { mil: 'led a fire team', civ: 'led a team of 4', branch: 'all', cat: 'Leadership' },
  { mil: 'commanded a company', civ: 'managed a department of 100-200 employees', branch: 'all', cat: 'Leadership' },
  { mil: 'commanded a battalion', civ: 'managed a business unit of 300-1,000 employees', branch: 'all', cat: 'Leadership' },
  { mil: 'served as NCOIC', civ: 'served as shift supervisor / section manager', branch: 'all', cat: 'Leadership' },
  { mil: 'served as OIC', civ: 'served as department head / program manager', branch: 'all', cat: 'Leadership' },
  { mil: 'served as XO', civ: 'served as deputy director / second-in-command', branch: 'all', cat: 'Leadership' },
  { mil: 'served as CO', civ: 'served as director / executive leader', branch: 'all', cat: 'Leadership' },
  { mil: 'served as first sergeant', civ: 'served as operations manager / senior enlisted advisor', branch: 'all', cat: 'Leadership' },
  { mil: 'served as command sergeant major', civ: 'served as senior director / chief operations advisor', branch: 'all', cat: 'Leadership' },
  { mil: 'served as platoon sergeant', civ: 'served as team supervisor / operations lead', branch: 'all', cat: 'Leadership' },
  { mil: 'assumed command', civ: 'took leadership of / assumed management of', branch: 'all', cat: 'Leadership' },
  { mil: 'relieved of command', civ: 'removed from leadership position', branch: 'all', cat: 'Leadership' },
  { mil: 'direct leadership of', civ: 'directly managed / supervised', branch: 'all', cat: 'Leadership' },
  { mil: 'senior enlisted advisor', civ: 'senior operations advisor / chief of staff', branch: 'all', cat: 'Leadership' },
  { mil: 'primary advisor to the commander', civ: 'principal advisor to the director', branch: 'all', cat: 'Leadership' },
  { mil: 'responsible for the health, morale, and welfare', civ: 'responsible for employee well-being, engagement, and retention', branch: 'all', cat: 'Leadership' },
  { mil: 'maintained good order and discipline', civ: 'enforced workplace standards and compliance', branch: 'all', cat: 'Leadership' },

  // --- Operations & Logistics ---
  { mil: 'deployed to', civ: 'traveled to / assigned to remote location', branch: 'all', cat: 'Operations' },
  { mil: 'forward deployed', civ: 'stationed at client site / field office', branch: 'all', cat: 'Operations' },
  { mil: 'in theater', civ: 'in the operational area / on-site', branch: 'all', cat: 'Operations' },
  { mil: 'downrange', civ: 'in the field / at the project site', branch: 'all', cat: 'Operations' },
  { mil: 'OPTEMPO', civ: 'operational tempo / work pace', branch: 'all', cat: 'Operations' },
  { mil: 'battle rhythm', civ: 'recurring operational schedule / cadence', branch: 'all', cat: 'Operations' },
  { mil: 'conducted convoy operations', civ: 'coordinated multi-vehicle fleet movements', branch: 'all', cat: 'Operations' },
  { mil: 'executed a FRAGO', civ: 'implemented a change order / revised directive', branch: 'all', cat: 'Operations' },
  { mil: 'issued an OPORD', civ: 'published a project plan / operational directive', branch: 'all', cat: 'Operations' },
  { mil: 'maintained accountability of', civ: 'tracked inventory of / managed assets valued at', branch: 'all', cat: 'Operations' },
  { mil: 'property book holder', civ: 'asset manager / inventory custodian', branch: 'all', cat: 'Operations' },
  { mil: 'hand receipt holder', civ: 'equipment custodian / sub-inventory manager', branch: 'all', cat: 'Operations' },
  { mil: 'maintained supply chain', civ: 'managed supply chain / procurement pipeline', branch: 'all', cat: 'Operations' },
  { mil: 'Class I-IX supplies', civ: 'full-spectrum logistics (food, fuel, equipment, parts)', branch: 'all', cat: 'Operations' },
  { mil: 'PMCS', civ: 'preventive maintenance checks and services / scheduled maintenance', branch: 'all', cat: 'Operations' },
  { mil: 'FMC rate', civ: 'equipment availability rate / uptime percentage', branch: 'all', cat: 'Operations' },
  { mil: 'deadline rate', civ: 'equipment downtime rate / out-of-service rate', branch: 'all', cat: 'Operations' },
  { mil: 'maintained 100% FMC', civ: 'achieved 100% equipment availability', branch: 'all', cat: 'Operations' },
  { mil: 'no safety incidents', civ: 'zero workplace injuries / perfect safety record', branch: 'all', cat: 'Operations' },
  { mil: 'zero lost time accidents', civ: 'zero workplace injuries resulting in missed work', branch: 'all', cat: 'Operations' },

  // --- Training & Development ---
  { mil: 'conducted training', civ: 'delivered training / facilitated workshops', branch: 'all', cat: 'Training' },
  { mil: 'developed training plan', civ: 'created professional development curriculum', branch: 'all', cat: 'Training' },
  { mil: 'trained and mentored', civ: 'trained and mentored / coached and developed', branch: 'all', cat: 'Training' },
  { mil: 'cross-trained', civ: 'cross-trained / provided multi-skill development', branch: 'all', cat: 'Training' },
  { mil: 'qualified on', civ: 'certified in / earned qualification for', branch: 'all', cat: 'Training' },
  { mil: 'range safety officer', civ: 'safety officer / training safety coordinator', branch: 'all', cat: 'Training' },
  { mil: 'served as instructor', civ: 'served as trainer / subject matter expert', branch: 'all', cat: 'Training' },
  { mil: 'graduated honor grad', civ: 'graduated top of class / with distinction', branch: 'all', cat: 'Training' },
  { mil: 'distinguished graduate', civ: 'top graduate / highest honors', branch: 'all', cat: 'Training' },
  { mil: "commandant's list", civ: "dean's list / top 20% of graduating class", branch: 'all', cat: 'Training' },
  { mil: 'completed PME', civ: 'completed professional development / leadership certification', branch: 'all', cat: 'Training' },
  { mil: 'attended ALS/NCOES/SLC', civ: 'completed supervisory leadership course', branch: 'all', cat: 'Training' },
  { mil: 'completed BOLC/OBC', civ: 'completed management training program', branch: 'all', cat: 'Training' },
  { mil: 'completed senior NCO course', civ: 'completed senior management development program', branch: 'all', cat: 'Training' },

  // --- Security & Clearances ---
  { mil: 'held TS/SCI clearance', civ: 'held top-level government security clearance', branch: 'all', cat: 'Security' },
  { mil: 'maintained Secret clearance', civ: 'maintained government security clearance', branch: 'all', cat: 'Security' },
  { mil: 'COMSEC custodian', civ: 'communications security manager / encryption key custodian', branch: 'all', cat: 'Security' },
  { mil: 'force protection', civ: 'facility security / physical security', branch: 'all', cat: 'Security' },
  { mil: 'OPSEC officer', civ: 'information security officer', branch: 'all', cat: 'Security' },
  { mil: 'access control', civ: 'facility access management / badge control', branch: 'all', cat: 'Security' },
  { mil: 'classified material', civ: 'sensitive / restricted information', branch: 'all', cat: 'Security' },
  { mil: 'need to know', civ: 'access on a need-to-know basis / restricted access', branch: 'all', cat: 'Security' },
  { mil: 'SCIF environment', civ: 'secure facility / restricted workspace', branch: 'all', cat: 'Security' },

  // --- Performance & Awards ---
  { mil: 'received Army Commendation Medal', civ: 'received formal recognition for outstanding performance', branch: 'Army', cat: 'Awards' },
  { mil: 'received Navy Achievement Medal', civ: 'received formal recognition for outstanding performance', branch: 'Navy', cat: 'Awards' },
  { mil: 'received Air Force Achievement Medal', civ: 'received formal recognition for outstanding performance', branch: 'Air Force', cat: 'Awards' },
  { mil: 'meritorious service', civ: 'exceptional performance / outstanding contribution', branch: 'all', cat: 'Awards' },
  { mil: 'awarded the Bronze Star', civ: 'received executive-level recognition for exceptional achievement', branch: 'all', cat: 'Awards' },
  { mil: 'Sailor of the Year', civ: 'Employee of the Year', branch: 'Navy', cat: 'Awards' },
  { mil: 'Soldier of the Year', civ: 'Employee of the Year', branch: 'Army', cat: 'Awards' },
  { mil: 'Airman of the Year', civ: 'Employee of the Year', branch: 'Air Force', cat: 'Awards' },
  { mil: 'Marine of the Year', civ: 'Employee of the Year', branch: 'Marines', cat: 'Awards' },
  { mil: 'NCO of the Quarter', civ: 'Supervisor of the Quarter / quarterly excellence award', branch: 'all', cat: 'Awards' },
  { mil: 'Junior Sailor of the Quarter', civ: 'Rising Star Award / quarterly recognition', branch: 'Navy', cat: 'Awards' },
  { mil: 'Blue Jacket of the Year', civ: 'Entry-Level Employee of the Year', branch: 'Navy', cat: 'Awards' },
  { mil: 'received a letter of commendation', civ: 'received a formal letter of recognition', branch: 'all', cat: 'Awards' },
  { mil: 'received a coin from', civ: 'received personal recognition from senior leadership', branch: 'all', cat: 'Awards' },
  { mil: 'meritoriously promoted', civ: 'promoted early for exceptional performance', branch: 'all', cat: 'Awards' },
  { mil: 'battlefield promotion', civ: 'emergency promotion for exceptional performance under pressure', branch: 'all', cat: 'Awards' },

  // --- Administrative & HR ---
  { mil: 'processed personnel actions', civ: 'managed HR transactions / employee records', branch: 'all', cat: 'Administrative' },
  { mil: 'counseled service members', civ: 'counseled employees / provided career guidance', branch: 'all', cat: 'Administrative' },
  { mil: 'conducted inspections', civ: 'performed audits / compliance reviews', branch: 'all', cat: 'Administrative' },
  { mil: 'prepared evaluations', civ: 'wrote performance reviews / annual assessments', branch: 'all', cat: 'Administrative' },
  { mil: 'maintained personnel records', civ: 'managed employee files / HR documentation', branch: 'all', cat: 'Administrative' },
  { mil: 'processed leave requests', civ: 'managed PTO requests / time-off approvals', branch: 'all', cat: 'Administrative' },
  { mil: 'conducted muster', civ: 'conducted roll call / attendance verification', branch: 'all', cat: 'Administrative' },
  { mil: 'published the POD', civ: 'published the daily schedule / operational agenda', branch: 'all', cat: 'Administrative' },
  { mil: 'tracked manning levels', civ: 'monitored staffing levels / headcount', branch: 'all', cat: 'Administrative' },
  { mil: 'ensured compliance with regulations', civ: 'ensured regulatory compliance / adherence to policies', branch: 'all', cat: 'Administrative' },
  { mil: 'prepared and submitted reports', civ: 'prepared and submitted reports / documentation', branch: 'all', cat: 'Administrative' },

  // --- Technical / Maintenance ---
  { mil: 'performed maintenance on', civ: 'serviced / maintained / repaired', branch: 'all', cat: 'Technical' },
  { mil: 'troubleshot and repaired', civ: 'diagnosed and repaired / resolved technical issues', branch: 'all', cat: 'Technical' },
  { mil: 'performed corrective maintenance', civ: 'performed corrective repairs / resolved equipment failures', branch: 'all', cat: 'Technical' },
  { mil: 'performed preventive maintenance', civ: 'performed scheduled maintenance / preventive servicing', branch: 'all', cat: 'Technical' },
  { mil: 'maintained equipment valued at', civ: 'managed equipment portfolio valued at', branch: 'all', cat: 'Technical' },
  { mil: 'zero material deficiencies', civ: 'no equipment failures / perfect maintenance record', branch: 'all', cat: 'Technical' },
  { mil: 'qualified on all crew-served weapons', civ: 'certified on all team-operated equipment', branch: 'all', cat: 'Technical' },
  { mil: 'expert marksman', civ: 'highest-level proficiency certification', branch: 'all', cat: 'Technical' },

  // --- Budget & Resources ---
  { mil: 'managed a budget of', civ: 'managed a budget of', branch: 'all', cat: 'Financial' },
  { mil: 'accountable for property valued at', civ: 'accountable for assets valued at', branch: 'all', cat: 'Financial' },
  { mil: 'managed a DRMO account', civ: 'managed surplus asset disposal account', branch: 'all', cat: 'Financial' },
  { mil: 'managed government purchase card', civ: 'managed corporate credit card / procurement authority', branch: 'all', cat: 'Financial' },
  { mil: 'requisitioned supplies', civ: 'procured supplies / submitted purchase orders', branch: 'all', cat: 'Financial' },

  // --- Communication ---
  { mil: 'briefed senior leadership', civ: 'presented to senior management / executive briefing', branch: 'all', cat: 'Communication' },
  { mil: 'briefed the commander', civ: 'presented to the director / executive', branch: 'all', cat: 'Communication' },
  { mil: 'conducted after-action review', civ: 'facilitated post-project analysis / lessons-learned session', branch: 'all', cat: 'Communication' },
  { mil: 'prepared SITREP', civ: 'prepared status report / situation update', branch: 'all', cat: 'Communication' },
  { mil: 'drafted OPORD', civ: 'drafted project plan / operational directive', branch: 'all', cat: 'Communication' },
  { mil: 'disseminated intelligence', civ: 'distributed analysis / shared research findings', branch: 'all', cat: 'Communication' },
  { mil: 'liaison with', civ: 'coordinated with / served as point of contact for', branch: 'all', cat: 'Communication' },
  { mil: 'interagency coordination', civ: 'cross-organizational coordination / multi-stakeholder collaboration', branch: 'all', cat: 'Communication' },

  // --- Navy/Marine-specific ---
  { mil: 'stood watch', civ: 'worked shifts / maintained 24/7 coverage', branch: 'Navy', cat: 'Operations' },
  { mil: 'qualified OOD', civ: 'certified watch supervisor / shift manager', branch: 'Navy', cat: 'Operations' },
  { mil: 'qualified EOOW', civ: 'certified engineering shift supervisor', branch: 'Navy', cat: 'Operations' },
  { mil: 'underway operations', civ: 'active field operations / ongoing operations', branch: 'Navy', cat: 'Operations' },
  { mil: 'port visit', civ: 'client site visit / scheduled stop', branch: 'Navy', cat: 'Operations' },
  { mil: 'sea and anchor detail', civ: 'high-priority transition operations', branch: 'Navy', cat: 'Operations' },
  { mil: 'liberty', civ: 'authorized time off / personal time', branch: 'Navy', cat: 'Administrative' },
  { mil: "ship's company", civ: 'permanent staff / core team', branch: 'Navy', cat: 'Leadership' },
  { mil: 'embarked staff', civ: 'deployed support team / traveling team', branch: 'Navy', cat: 'Leadership' },
  { mil: "PCS'd to", civ: 'relocated to / transferred to', branch: 'all', cat: 'Administrative' },
  { mil: 'TAD/TDY to', civ: 'temporarily assigned to / business travel to', branch: 'all', cat: 'Administrative' },

  // --- Combat/High-stress context (for those translating combat roles) ---
  { mil: 'engaged the enemy', civ: 'operated in high-threat environment', branch: 'all', cat: 'Operations' },
  { mil: 'under fire', civ: 'under extreme pressure / high-stress conditions', branch: 'all', cat: 'Operations' },
  { mil: 'hostile environment', civ: 'austere / challenging operating environment', branch: 'all', cat: 'Operations' },
  { mil: 'combat zone', civ: 'high-risk operational area / hazardous duty location', branch: 'all', cat: 'Operations' },
  { mil: 'combat operations', civ: 'high-intensity operations / critical operations', branch: 'all', cat: 'Operations' },
  { mil: 'cleared rooms', civ: 'conducted facility security sweeps', branch: 'all', cat: 'Operations' },
  { mil: 'conducted patrols', civ: 'conducted security patrols / surveillance rounds', branch: 'all', cat: 'Operations' },
  { mil: 'manned a checkpoint', civ: 'operated an access control point / security checkpoint', branch: 'all', cat: 'Operations' },
  { mil: 'QRF', civ: 'rapid response team', branch: 'all', cat: 'Operations' },
  { mil: 'provided overwatch', civ: 'provided security coverage / protective monitoring', branch: 'all', cat: 'Operations' },

  // --- Collateral duties ---
  { mil: 'served as unit safety officer', civ: 'served as workplace safety coordinator', branch: 'all', cat: 'Collateral Duty' },
  { mil: 'served as EO representative', civ: 'served as equal opportunity / diversity liaison', branch: 'all', cat: 'Collateral Duty' },
  { mil: 'served as SAPR victim advocate', civ: 'served as victim advocate / support coordinator', branch: 'all', cat: 'Collateral Duty' },
  { mil: 'served as urinalysis coordinator', civ: 'served as workplace compliance testing coordinator', branch: 'all', cat: 'Collateral Duty' },
  { mil: 'served as voting assistance officer', civ: 'served as civic engagement coordinator', branch: 'all', cat: 'Collateral Duty' },
  { mil: 'served as physical fitness leader', civ: 'served as wellness program coordinator', branch: 'all', cat: 'Collateral Duty' },
  { mil: 'served as MWR representative', civ: 'served as employee morale / recreation coordinator', branch: 'all', cat: 'Collateral Duty' },
  { mil: 'served as command financial specialist', civ: 'served as financial counselor / employee financial advisor', branch: 'all', cat: 'Collateral Duty' },
  { mil: 'served as sponsorship coordinator', civ: 'served as new employee onboarding coordinator', branch: 'all', cat: 'Collateral Duty' },
  { mil: 'served as FRG leader', civ: 'served as family support program coordinator', branch: 'all', cat: 'Collateral Duty' },
  { mil: 'served as duty NCO', civ: 'served as on-call shift supervisor', branch: 'all', cat: 'Collateral Duty' },
  { mil: 'served as CFC coordinator', civ: 'served as charitable giving campaign coordinator', branch: 'all', cat: 'Collateral Duty' },

  // --- Deployment-specific ---
  { mil: 'pre-deployment preparation', civ: 'project mobilization / preparation phase', branch: 'all', cat: 'Operations' },
  { mil: 'redeployment operations', civ: 'project closeout / demobilization', branch: 'all', cat: 'Operations' },
  { mil: 'force generation', civ: 'team building / staffing up / resource allocation', branch: 'all', cat: 'Operations' },
  { mil: 'retrograde operations', civ: 'drawdown / orderly withdrawal / transition operations', branch: 'all', cat: 'Operations' },
  { mil: 'convoy security', civ: 'fleet security / transportation security', branch: 'all', cat: 'Operations' },
  { mil: 'base defense', civ: 'facility security / perimeter protection', branch: 'all', cat: 'Operations' },

  // --- Intelligence ---
  { mil: 'conducted intelligence analysis', civ: 'performed research and analysis', branch: 'all', cat: 'Intelligence' },
  { mil: 'prepared intelligence products', civ: 'produced analytical reports / research deliverables', branch: 'all', cat: 'Intelligence' },
  { mil: 'briefed intelligence assessments', civ: 'presented research findings to leadership', branch: 'all', cat: 'Intelligence' },
  { mil: 'all-source analysis', civ: 'multi-source data analysis / comprehensive research', branch: 'all', cat: 'Intelligence' },
  { mil: 'pattern of life analysis', civ: 'behavioral analysis / trend analysis', branch: 'all', cat: 'Intelligence' },
  { mil: 'maintained situational awareness', civ: 'monitored operational conditions / maintained awareness of business environment', branch: 'all', cat: 'Intelligence' },

  // --- Medical ---
  { mil: 'provided tactical combat casualty care', civ: 'provided emergency medical care in field conditions', branch: 'all', cat: 'Medical' },
  { mil: 'sick call', civ: 'walk-in medical clinic / employee health appointment', branch: 'all', cat: 'Medical' },
  { mil: 'medically ready', civ: 'health-cleared for duty / fit for work', branch: 'all', cat: 'Medical' },
  { mil: 'MEDEVAC', civ: 'emergency medical transport', branch: 'all', cat: 'Medical' },
  { mil: 'mass casualty exercise', civ: 'large-scale emergency response drill', branch: 'all', cat: 'Medical' },

  // --- Miscellaneous common phrases ---
  { mil: 'above and beyond the call of duty', civ: 'exceeding expectations / going above and beyond', branch: 'all', cat: 'Performance' },
  { mil: 'setting the standard', civ: 'establishing best practices / being a role model', branch: 'all', cat: 'Performance' },
  { mil: 'leading from the front', civ: 'leading by example', branch: 'all', cat: 'Performance' },
  { mil: 'exceptional military bearing', civ: 'exceptional professionalism and composure', branch: 'all', cat: 'Performance' },
  { mil: 'flawless execution', civ: 'error-free delivery / perfect execution', branch: 'all', cat: 'Performance' },
  { mil: 'operational excellence', civ: 'operational excellence / high performance', branch: 'all', cat: 'Performance' },
  { mil: 'high state of readiness', civ: 'high level of preparedness', branch: 'all', cat: 'Performance' },
  { mil: 'exceeded all standards', civ: 'surpassed all benchmarks / exceeded KPIs', branch: 'all', cat: 'Performance' },
  { mil: 'no findings during inspection', civ: 'zero audit findings / full compliance', branch: 'all', cat: 'Performance' },
  { mil: 'inspection ready at all times', civ: 'audit-ready / always compliant', branch: 'all', cat: 'Performance' },
  { mil: 'received an outstanding rating', civ: 'received the highest evaluation score', branch: 'all', cat: 'Performance' },
  { mil: 'received a satisfactory rating', civ: 'met all performance standards', branch: 'all', cat: 'Performance' },
  { mil: 'voluntarily extended', civ: 'voluntarily extended assignment / renewed contract', branch: 'all', cat: 'Administrative' },
  { mil: 'honorably discharged', civ: 'completed service in good standing', branch: 'all', cat: 'Administrative' },
  { mil: 'ETS/EAS', civ: 'end of service contract / contract completion', branch: 'all', cat: 'Administrative' },
];

for (const p of phraseTranslations) {
  lines.push(
    `INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category)` +
    ` VALUES ('${esc(p.mil)}', '${esc(p.civ)}', '${esc(p.branch)}', '${esc(p.cat)}')` +
    ` ON CONFLICT DO NOTHING;`
  );
  counts.dict_phrase_translations++;
}
lines.push('');


// ==========================================
// 2. dict_eval_phrases — branch-specific evaluation language
// ==========================================
lines.push('-- =============================================================================');
lines.push('-- TABLE: dict_eval_phrases (branch-specific evaluation language)');
lines.push('-- Schema: eval_phrase, civilian_translation, eval_type, performance_level, category, branch');
lines.push('-- =============================================================================');
lines.push('');

const evalPhrases = [
  // ===== ARMY NCOER (35 entries) =====
  { phrase: 'exceeded the standard', civ: 'surpassed all performance benchmarks', type: 'NCOER', level: 'Exceeds', cat: 'Overall', branch: 'Army' },
  { phrase: 'far exceeded the standard', civ: 'dramatically surpassed all performance benchmarks', type: 'NCOER', level: 'Far Exceeds', cat: 'Overall', branch: 'Army' },
  { phrase: 'met the standard', civ: 'met all performance requirements', type: 'NCOER', level: 'Meets', cat: 'Overall', branch: 'Army' },
  { phrase: 'among the best', civ: 'top performer among peers', type: 'NCOER', level: 'Exceeds', cat: 'Overall', branch: 'Army' },
  { phrase: 'best NCO I have ever supervised', civ: 'the highest-performing supervisor I have managed', type: 'NCOER', level: 'Far Exceeds', cat: 'Overall', branch: 'Army' },
  { phrase: 'must promote', civ: 'strongly recommended for immediate promotion', type: 'NCOER', level: 'Far Exceeds', cat: 'Promotion', branch: 'Army' },
  { phrase: 'promote ahead of peers', civ: 'promote before contemporaries / fast-track candidate', type: 'NCOER', level: 'Far Exceeds', cat: 'Promotion', branch: 'Army' },
  { phrase: 'promote with peers', civ: 'promote on standard timeline', type: 'NCOER', level: 'Meets', cat: 'Promotion', branch: 'Army' },
  { phrase: 'do not promote', civ: 'not recommended for promotion at this time', type: 'NCOER', level: 'Below', cat: 'Promotion', branch: 'Army' },
  { phrase: 'demonstrated tactical and technical competence', civ: 'demonstrated strong technical skills and operational knowledge', type: 'NCOER', level: 'Exceeds', cat: 'Competence', branch: 'Army' },
  { phrase: 'committed to professional development', civ: 'actively pursuing professional growth and certifications', type: 'NCOER', level: 'Meets', cat: 'Development', branch: 'Army' },
  { phrase: 'sought out responsibility', civ: 'proactively took on additional responsibilities', type: 'NCOER', level: 'Exceeds', cat: 'Initiative', branch: 'Army' },
  { phrase: 'led by example', civ: 'demonstrated leadership through personal example', type: 'NCOER', level: 'Exceeds', cat: 'Leadership', branch: 'Army' },
  { phrase: 'fostered a positive command climate', civ: 'cultivated a positive work environment', type: 'NCOER', level: 'Exceeds', cat: 'Leadership', branch: 'Army' },
  { phrase: 'displayed sound judgment', civ: 'demonstrated strong decision-making abilities', type: 'NCOER', level: 'Meets', cat: 'Judgment', branch: 'Army' },
  { phrase: 'embodied the Army values', civ: 'exemplified organizational core values', type: 'NCOER', level: 'Exceeds', cat: 'Character', branch: 'Army' },
  { phrase: 'NCO who gets results', civ: 'results-oriented supervisor / consistently delivers outcomes', type: 'NCOER', level: 'Exceeds', cat: 'Overall', branch: 'Army' },
  { phrase: 'unlimited potential', civ: 'extraordinary growth potential / future executive', type: 'NCOER', level: 'Far Exceeds', cat: 'Potential', branch: 'Army' },
  { phrase: 'ready for increased responsibility', civ: 'prepared for next-level management role', type: 'NCOER', level: 'Exceeds', cat: 'Potential', branch: 'Army' },
  { phrase: 'maintained physical fitness standards', civ: 'met all wellness / fitness requirements', type: 'NCOER', level: 'Meets', cat: 'Fitness', branch: 'Army' },
  { phrase: 'exceeded physical fitness standards', civ: 'exceeded all fitness / wellness benchmarks', type: 'NCOER', level: 'Exceeds', cat: 'Fitness', branch: 'Army' },
  { phrase: 'needs improvement', civ: 'performance improvement plan recommended', type: 'NCOER', level: 'Below', cat: 'Overall', branch: 'Army' },
  { phrase: 'does not meet the standard', civ: 'failed to meet minimum performance requirements', type: 'NCOER', level: 'Below', cat: 'Overall', branch: 'Army' },
  { phrase: 'select for senior positions', civ: 'groom for senior management positions', type: 'NCOER', level: 'Far Exceeds', cat: 'Potential', branch: 'Army' },
  { phrase: 'send to USASMA immediately', civ: 'enroll in executive leadership program immediately', type: 'NCOER', level: 'Far Exceeds', cat: 'Development', branch: 'Army' },
  { phrase: 'selfless service', civ: 'consistently prioritized team success over personal gain', type: 'NCOER', level: 'Exceeds', cat: 'Character', branch: 'Army' },
  { phrase: 'maintained high standards of discipline', civ: 'enforced workplace standards consistently', type: 'NCOER', level: 'Meets', cat: 'Leadership', branch: 'Army' },
  { phrase: 'technically proficient', civ: 'possesses strong technical expertise', type: 'NCOER', level: 'Meets', cat: 'Competence', branch: 'Army' },
  { phrase: 'completed all assigned tasks to standard', civ: 'completed all assignments meeting quality benchmarks', type: 'NCOER', level: 'Meets', cat: 'Overall', branch: 'Army' },
  { phrase: 'exceptional duty performance', civ: 'outstanding job performance', type: 'NCOER', level: 'Far Exceeds', cat: 'Overall', branch: 'Army' },
  { phrase: 'a true warrior NCO', civ: 'a dedicated and high-performing supervisor', type: 'NCOER', level: 'Far Exceeds', cat: 'Overall', branch: 'Army' },
  { phrase: 'total commitment to the mission', civ: 'fully committed to organizational goals', type: 'NCOER', level: 'Exceeds', cat: 'Character', branch: 'Army' },
  { phrase: 'developed subordinates', civ: 'actively mentored and developed team members', type: 'NCOER', level: 'Exceeds', cat: 'Leadership', branch: 'Army' },
  { phrase: 'resource management', civ: 'effective budget and resource management', type: 'NCOER', level: 'Meets', cat: 'Management', branch: 'Army' },
  { phrase: 'counseled soldiers on career progression', civ: 'provided employees with career development guidance', type: 'NCOER', level: 'Meets', cat: 'Leadership', branch: 'Army' },

  // ===== AIR FORCE EPR (35 entries) =====
  { phrase: 'exceeded most if not all expectations', civ: 'exceeded the majority of performance objectives', type: 'EPR', level: 'Exceeds', cat: 'Overall', branch: 'Air Force' },
  { phrase: 'clearly exceeded most expectations', civ: 'significantly surpassed most performance objectives', type: 'EPR', level: 'Exceeds', cat: 'Overall', branch: 'Air Force' },
  { phrase: 'met all expectations', civ: 'met all performance objectives', type: 'EPR', level: 'Meets', cat: 'Overall', branch: 'Air Force' },
  { phrase: 'promote now', civ: 'ready for immediate promotion', type: 'EPR', level: 'Promote Now', cat: 'Promotion', branch: 'Air Force' },
  { phrase: 'must promote', civ: 'top promotion candidate / must advance', type: 'EPR', level: 'Must Promote', cat: 'Promotion', branch: 'Air Force' },
  { phrase: 'promote', civ: 'recommended for promotion', type: 'EPR', level: 'Promote', cat: 'Promotion', branch: 'Air Force' },
  { phrase: 'not ready now', civ: 'not yet ready for promotion', type: 'EPR', level: 'Not Ready', cat: 'Promotion', branch: 'Air Force' },
  { phrase: 'do not retain', civ: 'not recommended for contract renewal', type: 'EPR', level: 'Below', cat: 'Retention', branch: 'Air Force' },
  { phrase: 'action-impact-result', civ: 'accomplishment-outcome-benefit (bullet writing format)', type: 'EPR', level: null, cat: 'Format', branch: 'Air Force' },
  { phrase: 'led XX-member team', civ: 'managed a team of XX employees', type: 'EPR', level: null, cat: 'Leadership', branch: 'Air Force' },
  { phrase: 'spearheaded $XM program', civ: 'led a $XM initiative', type: 'EPR', level: null, cat: 'Leadership', branch: 'Air Force' },
  { phrase: 'drove XX% improvement', civ: 'achieved XX% improvement', type: 'EPR', level: null, cat: 'Impact', branch: 'Air Force' },
  { phrase: 'saved $XX in resources', civ: 'delivered $XX in cost savings', type: 'EPR', level: null, cat: 'Impact', branch: 'Air Force' },
  { phrase: 'my #1 of XX NCOs', civ: 'ranked #1 of XX supervisors', type: 'EPR', level: 'Must Promote', cat: 'Ranking', branch: 'Air Force' },
  { phrase: 'my #1 of XX SNCOs', civ: 'ranked #1 of XX senior managers', type: 'EPR', level: 'Promote Now', cat: 'Ranking', branch: 'Air Force' },
  { phrase: 'superior performer', civ: 'consistently outstanding performer', type: 'EPR', level: 'Exceeds', cat: 'Overall', branch: 'Air Force' },
  { phrase: 'absolutely superior performer', civ: 'highest-caliber performer / exceptional in every area', type: 'EPR', level: 'Promote Now', cat: 'Overall', branch: 'Air Force' },
  { phrase: 'unlimited potential', civ: 'extraordinary growth potential / future senior leader', type: 'EPR', level: 'Promote Now', cat: 'Potential', branch: 'Air Force' },
  { phrase: 'rare talent', civ: 'uniquely skilled / one-of-a-kind talent', type: 'EPR', level: 'Promote Now', cat: 'Overall', branch: 'Air Force' },
  { phrase: 'Whole Airman Concept leader', civ: 'well-rounded performer excelling in all dimensions', type: 'EPR', level: 'Exceeds', cat: 'Overall', branch: 'Air Force' },
  { phrase: 'embodies Air Force Core Values', civ: 'exemplifies organizational core values', type: 'EPR', level: 'Exceeds', cat: 'Character', branch: 'Air Force' },
  { phrase: 'self-starter', civ: 'self-motivated / proactive contributor', type: 'EPR', level: 'Exceeds', cat: 'Initiative', branch: 'Air Force' },
  { phrase: 'below average', civ: 'below standard performance / underperforming', type: 'EPR', level: 'Below', cat: 'Overall', branch: 'Air Force' },
  { phrase: 'did not meet expectations', civ: 'failed to meet performance expectations', type: 'EPR', level: 'Below', cat: 'Overall', branch: 'Air Force' },
  { phrase: 'strong communicator', civ: 'excellent written and verbal communication skills', type: 'EPR', level: 'Meets', cat: 'Communication', branch: 'Air Force' },
  { phrase: 'mission-focused', civ: 'results-oriented / focused on deliverables', type: 'EPR', level: 'Meets', cat: 'Overall', branch: 'Air Force' },
  { phrase: 'ready for PME', civ: 'ready for leadership development program', type: 'EPR', level: 'Exceeds', cat: 'Development', branch: 'Air Force' },
  { phrase: 'selected for special duty', civ: 'selected for high-visibility / competitive assignment', type: 'EPR', level: 'Exceeds', cat: 'Recognition', branch: 'Air Force' },
  { phrase: 'consistent top performer', civ: 'consistently delivers above-average results', type: 'EPR', level: 'Exceeds', cat: 'Overall', branch: 'Air Force' },
  { phrase: 'technical expert in field', civ: 'recognized subject matter expert', type: 'EPR', level: 'Exceeds', cat: 'Competence', branch: 'Air Force' },
  { phrase: 'zero defects in all areas', civ: 'flawless performance across all responsibilities', type: 'EPR', level: 'Exceeds', cat: 'Quality', branch: 'Air Force' },
  { phrase: 'mentored XX Airmen', civ: 'mentored XX employees / team members', type: 'EPR', level: null, cat: 'Leadership', branch: 'Air Force' },
  { phrase: 'earned XX certification', civ: 'completed XX professional certification', type: 'EPR', level: null, cat: 'Development', branch: 'Air Force' },
  { phrase: 'volunteer leader', civ: 'active community volunteer / charitable contributor', type: 'EPR', level: 'Meets', cat: 'Community', branch: 'Air Force' },
  { phrase: 'send to OTS/ROTC immediately', civ: 'enroll in management training program immediately', type: 'EPR', level: 'Promote Now', cat: 'Development', branch: 'Air Force' },

  // ===== NAVY FITREP (35 entries) =====
  { phrase: 'early promote', civ: 'ready for immediate promotion / accelerated advancement', type: 'FITREP', level: 'Early Promote', cat: 'Promotion', branch: 'Navy' },
  { phrase: 'must promote', civ: 'top promotion candidate / must advance', type: 'FITREP', level: 'Must Promote', cat: 'Promotion', branch: 'Navy' },
  { phrase: 'promotable', civ: 'qualified for promotion', type: 'FITREP', level: 'Promotable', cat: 'Promotion', branch: 'Navy' },
  { phrase: 'progressing', civ: 'developing / showing improvement', type: 'FITREP', level: 'Progressing', cat: 'Promotion', branch: 'Navy' },
  { phrase: 'significant problems', civ: 'serious performance deficiencies', type: 'FITREP', level: 'Below', cat: 'Promotion', branch: 'Navy' },
  { phrase: '#1 of XX', civ: 'ranked first among XX peers', type: 'FITREP', level: 'Early Promote', cat: 'Ranking', branch: 'Navy' },
  { phrase: 'my top performer', civ: 'my highest-performing employee', type: 'FITREP', level: 'Early Promote', cat: 'Ranking', branch: 'Navy' },
  { phrase: 'deckplate leader', civ: 'hands-on frontline leader / leads from the ground level', type: 'FITREP', level: 'Exceeds', cat: 'Leadership', branch: 'Navy' },
  { phrase: 'superb leadership', civ: 'outstanding leadership abilities', type: 'FITREP', level: 'Early Promote', cat: 'Leadership', branch: 'Navy' },
  { phrase: 'commanding presence', civ: 'strong executive presence / natural authority', type: 'FITREP', level: 'Exceeds', cat: 'Leadership', branch: 'Navy' },
  { phrase: 'unmatched tactical acumen', civ: 'exceptional operational expertise', type: 'FITREP', level: 'Early Promote', cat: 'Competence', branch: 'Navy' },
  { phrase: 'technically brilliant', civ: 'exceptionally skilled / deep technical expertise', type: 'FITREP', level: 'Early Promote', cat: 'Competence', branch: 'Navy' },
  { phrase: 'total professional', civ: 'complete professional / excels in all areas', type: 'FITREP', level: 'Exceeds', cat: 'Overall', branch: 'Navy' },
  { phrase: 'unequaled among peers', civ: 'the best among peers / unmatched performance', type: 'FITREP', level: 'Early Promote', cat: 'Ranking', branch: 'Navy' },
  { phrase: 'fleet-ready', civ: 'fully operational / deployment-ready', type: 'FITREP', level: 'Meets', cat: 'Readiness', branch: 'Navy' },
  { phrase: 'performed superbly under pressure', civ: 'excelled under high-pressure conditions', type: 'FITREP', level: 'Exceeds', cat: 'Performance', branch: 'Navy' },
  { phrase: 'a gifted leader and mentor', civ: 'an exceptional leader and mentor', type: 'FITREP', level: 'Early Promote', cat: 'Leadership', branch: 'Navy' },
  { phrase: 'proactive and innovative', civ: 'proactive problem-solver / creative thinker', type: 'FITREP', level: 'Exceeds', cat: 'Initiative', branch: 'Navy' },
  { phrase: 'flawless management of resources', civ: 'excellent budget and resource management', type: 'FITREP', level: 'Exceeds', cat: 'Management', branch: 'Navy' },
  { phrase: 'impeccable integrity', civ: 'highest ethical standards / unquestionable integrity', type: 'FITREP', level: 'Exceeds', cat: 'Character', branch: 'Navy' },
  { phrase: 'inspires loyalty and trust', civ: 'builds strong team loyalty and trust', type: 'FITREP', level: 'Exceeds', cat: 'Leadership', branch: 'Navy' },
  { phrase: 'poised for increased responsibility', civ: 'ready for next-level management role', type: 'FITREP', level: 'Exceeds', cat: 'Potential', branch: 'Navy' },
  { phrase: 'screen for command', civ: 'select for executive leadership position', type: 'FITREP', level: 'Early Promote', cat: 'Potential', branch: 'Navy' },
  { phrase: 'assign to most challenging billets', civ: 'assign to most demanding roles', type: 'FITREP', level: 'Early Promote', cat: 'Potential', branch: 'Navy' },
  { phrase: 'send to War College', civ: 'enroll in senior executive development program', type: 'FITREP', level: 'Early Promote', cat: 'Development', branch: 'Navy' },
  { phrase: 'mission accomplishment personified', civ: 'the embodiment of results-driven performance', type: 'FITREP', level: 'Early Promote', cat: 'Overall', branch: 'Navy' },
  { phrase: 'a consummate professional', civ: 'the ultimate professional', type: 'FITREP', level: 'Exceeds', cat: 'Overall', branch: 'Navy' },
  { phrase: 'sustained superior performance', civ: 'consistently outstanding performance over time', type: 'FITREP', level: 'Exceeds', cat: 'Overall', branch: 'Navy' },
  { phrase: 'natural leader', civ: 'innate leadership ability / born leader', type: 'FITREP', level: 'Exceeds', cat: 'Leadership', branch: 'Navy' },
  { phrase: 'excels in ambiguous environments', civ: 'thrives in uncertain / fast-changing conditions', type: 'FITREP', level: 'Exceeds', cat: 'Adaptability', branch: 'Navy' },
  { phrase: 'meticulous attention to detail', civ: 'exceptional attention to detail and quality', type: 'FITREP', level: 'Meets', cat: 'Quality', branch: 'Navy' },
  { phrase: 'tireless work ethic', civ: 'exceptional work ethic / consistently goes above and beyond', type: 'FITREP', level: 'Exceeds', cat: 'Character', branch: 'Navy' },
  { phrase: 'sets the standard for the command', civ: 'sets the performance standard for the organization', type: 'FITREP', level: 'Early Promote', cat: 'Overall', branch: 'Navy' },
  { phrase: 'a proven performer', civ: 'demonstrated track record of success', type: 'FITREP', level: 'Exceeds', cat: 'Overall', branch: 'Navy' },
  { phrase: 'stellar performance', civ: 'outstanding performance', type: 'FITREP', level: 'Exceeds', cat: 'Overall', branch: 'Navy' },

  // ===== USMC FITREP (35 entries) =====
  { phrase: 'top 1%', civ: 'top 1% of all performers', type: 'FITREP', level: 'Top 1%', cat: 'Ranking', branch: 'Marines' },
  { phrase: 'top 10%', civ: 'top 10% of all performers', type: 'FITREP', level: 'Top 10%', cat: 'Ranking', branch: 'Marines' },
  { phrase: 'above average for grade', civ: 'above average for the position level', type: 'FITREP', level: 'Above Average', cat: 'Overall', branch: 'Marines' },
  { phrase: 'average for grade', civ: 'meeting expectations for the position level', type: 'FITREP', level: 'Average', cat: 'Overall', branch: 'Marines' },
  { phrase: 'below average for grade', civ: 'below expectations for the position level', type: 'FITREP', level: 'Below Average', cat: 'Overall', branch: 'Marines' },
  { phrase: 'most qualified Marine', civ: 'the most qualified employee at this level', type: 'FITREP', level: 'Top 1%', cat: 'Ranking', branch: 'Marines' },
  { phrase: 'select for command', civ: 'ready for executive leadership role', type: 'FITREP', level: 'Top 1%', cat: 'Potential', branch: 'Marines' },
  { phrase: 'promote immediately', civ: 'promote without delay', type: 'FITREP', level: 'Top 1%', cat: 'Promotion', branch: 'Marines' },
  { phrase: 'promote ahead of contemporaries', civ: 'promote before peers', type: 'FITREP', level: 'Top 10%', cat: 'Promotion', branch: 'Marines' },
  { phrase: 'promote with contemporaries', civ: 'promote on standard timeline', type: 'FITREP', level: 'Average', cat: 'Promotion', branch: 'Marines' },
  { phrase: 'warrior spirit', civ: 'driven, resilient, and determined', type: 'FITREP', level: 'Above Average', cat: 'Character', branch: 'Marines' },
  { phrase: 'embodies the Marine Corps values', civ: 'exemplifies honor, courage, and commitment / core organizational values', type: 'FITREP', level: 'Above Average', cat: 'Character', branch: 'Marines' },
  { phrase: 'Marines first mentality', civ: 'people-first leadership philosophy', type: 'FITREP', level: 'Above Average', cat: 'Leadership', branch: 'Marines' },
  { phrase: 'an aggressive and decisive leader', civ: 'a proactive and decisive leader', type: 'FITREP', level: 'Above Average', cat: 'Leadership', branch: 'Marines' },
  { phrase: 'combat-tested leader', civ: 'proven leader in high-stress / crisis situations', type: 'FITREP', level: 'Above Average', cat: 'Leadership', branch: 'Marines' },
  { phrase: 'first in, last out', civ: 'hardest-working / most dedicated team member', type: 'FITREP', level: 'Above Average', cat: 'Character', branch: 'Marines' },
  { phrase: 'mission accomplishment is guaranteed', civ: 'consistently delivers results without fail', type: 'FITREP', level: 'Top 10%', cat: 'Overall', branch: 'Marines' },
  { phrase: 'technically and tactically proficient', civ: 'possesses both technical expertise and operational acumen', type: 'FITREP', level: 'Above Average', cat: 'Competence', branch: 'Marines' },
  { phrase: 'sets the example for all Marines', civ: 'role model for all employees', type: 'FITREP', level: 'Top 10%', cat: 'Leadership', branch: 'Marines' },
  { phrase: 'displays uncommon initiative', civ: 'demonstrates exceptional initiative and self-direction', type: 'FITREP', level: 'Above Average', cat: 'Initiative', branch: 'Marines' },
  { phrase: 'possesses keen judgment', civ: 'demonstrates excellent judgment and decision-making', type: 'FITREP', level: 'Above Average', cat: 'Judgment', branch: 'Marines' },
  { phrase: 'flawless attention to detail', civ: 'meticulous attention to quality and accuracy', type: 'FITREP', level: 'Above Average', cat: 'Quality', branch: 'Marines' },
  { phrase: 'a natural problem solver', civ: 'an intuitive problem-solver / analytical thinker', type: 'FITREP', level: 'Above Average', cat: 'Initiative', branch: 'Marines' },
  { phrase: 'dedicated to professional growth', civ: 'committed to continuous professional development', type: 'FITREP', level: 'Average', cat: 'Development', branch: 'Marines' },
  { phrase: 'forceful and confident', civ: 'assertive and self-assured', type: 'FITREP', level: 'Above Average', cat: 'Leadership', branch: 'Marines' },
  { phrase: 'operates independently', civ: 'works independently with minimal supervision', type: 'FITREP', level: 'Above Average', cat: 'Initiative', branch: 'Marines' },
  { phrase: 'took charge in the absence of leadership', civ: 'assumed leadership when management was unavailable', type: 'FITREP', level: 'Above Average', cat: 'Initiative', branch: 'Marines' },
  { phrase: 'has earned my full confidence', civ: 'has earned my complete trust and confidence', type: 'FITREP', level: 'Top 10%', cat: 'Overall', branch: 'Marines' },
  { phrase: 'will be sorely missed', civ: 'an invaluable team member who will be greatly missed', type: 'FITREP', level: 'Above Average', cat: 'Overall', branch: 'Marines' },
  { phrase: 'select for Resident PME', civ: 'select for in-person executive education program', type: 'FITREP', level: 'Top 10%', cat: 'Development', branch: 'Marines' },
  { phrase: 'demonstrated moral courage', civ: 'demonstrated the courage to make difficult ethical decisions', type: 'FITREP', level: 'Above Average', cat: 'Character', branch: 'Marines' },
  { phrase: 'uncompromising integrity', civ: 'unwavering ethical standards', type: 'FITREP', level: 'Above Average', cat: 'Character', branch: 'Marines' },
  { phrase: 'exceptionally fit Marine', civ: 'exceeds all physical fitness standards', type: 'FITREP', level: 'Above Average', cat: 'Fitness', branch: 'Marines' },
  { phrase: 'operationally experienced', civ: 'extensive field / operational experience', type: 'FITREP', level: 'Above Average', cat: 'Competence', branch: 'Marines' },
  { phrase: 'battle-hardened', civ: 'seasoned through challenging operational experience', type: 'FITREP', level: 'Above Average', cat: 'Competence', branch: 'Marines' },

  // ===== COAST GUARD EER (30 entries) =====
  { phrase: 'among the best I have observed', civ: 'one of the best performers I have supervised', type: 'EER', level: 'Exceeds', cat: 'Overall', branch: 'Coast Guard' },
  { phrase: 'top performer', civ: 'highest-performing employee', type: 'EER', level: 'Exceeds', cat: 'Overall', branch: 'Coast Guard' },
  { phrase: 'exceeded performance standards', civ: 'exceeded all performance benchmarks', type: 'EER', level: 'Exceeds', cat: 'Overall', branch: 'Coast Guard' },
  { phrase: 'met performance standards', civ: 'met all performance requirements', type: 'EER', level: 'Meets', cat: 'Overall', branch: 'Coast Guard' },
  { phrase: 'below performance standards', civ: 'did not meet minimum performance requirements', type: 'EER', level: 'Below', cat: 'Overall', branch: 'Coast Guard' },
  { phrase: 'ready for advancement', civ: 'ready for promotion', type: 'EER', level: 'Exceeds', cat: 'Promotion', branch: 'Coast Guard' },
  { phrase: 'ready for increased responsibility', civ: 'prepared for next-level management position', type: 'EER', level: 'Exceeds', cat: 'Potential', branch: 'Coast Guard' },
  { phrase: 'displayed superior seamanship', civ: 'demonstrated expert operational skills', type: 'EER', level: 'Exceeds', cat: 'Competence', branch: 'Coast Guard' },
  { phrase: 'ensured maritime safety', civ: 'ensured operational safety and compliance', type: 'EER', level: 'Meets', cat: 'Safety', branch: 'Coast Guard' },
  { phrase: 'upheld Coast Guard core values', civ: 'exemplified honor, respect, and devotion to duty', type: 'EER', level: 'Meets', cat: 'Character', branch: 'Coast Guard' },
  { phrase: 'committed to diversity and inclusion', civ: 'actively promotes workplace diversity and inclusion', type: 'EER', level: 'Meets', cat: 'Character', branch: 'Coast Guard' },
  { phrase: 'excelled in law enforcement operations', civ: 'excelled in regulatory enforcement / compliance operations', type: 'EER', level: 'Exceeds', cat: 'Competence', branch: 'Coast Guard' },
  { phrase: 'maintained search and rescue readiness', civ: 'maintained emergency response readiness', type: 'EER', level: 'Meets', cat: 'Readiness', branch: 'Coast Guard' },
  { phrase: 'led pollution response efforts', civ: 'led environmental remediation / incident response', type: 'EER', level: 'Exceeds', cat: 'Leadership', branch: 'Coast Guard' },
  { phrase: 'conducted vessel inspections', civ: 'conducted compliance audits / inspections', type: 'EER', level: 'Meets', cat: 'Competence', branch: 'Coast Guard' },
  { phrase: 'exceptional boat handler', civ: 'expert equipment operator', type: 'EER', level: 'Exceeds', cat: 'Competence', branch: 'Coast Guard' },
  { phrase: 'ensured port security', civ: 'ensured facility security / access control', type: 'EER', level: 'Meets', cat: 'Security', branch: 'Coast Guard' },
  { phrase: 'saved XX lives', civ: 'directly contributed to saving XX lives / preventing XX fatalities', type: 'EER', level: 'Exceeds', cat: 'Impact', branch: 'Coast Guard' },
  { phrase: 'interdicted XX contraband', civ: 'intercepted XX prohibited items / prevented smuggling', type: 'EER', level: 'Exceeds', cat: 'Impact', branch: 'Coast Guard' },
  { phrase: 'Semper Paratus in action', civ: 'always ready / demonstrates constant preparedness', type: 'EER', level: 'Exceeds', cat: 'Character', branch: 'Coast Guard' },
  { phrase: 'recommended for Officer Programs', civ: 'recommended for management development / promotion track', type: 'EER', level: 'Exceeds', cat: 'Potential', branch: 'Coast Guard' },
  { phrase: 'outstanding SAR performance', civ: 'outstanding emergency response performance', type: 'EER', level: 'Exceeds', cat: 'Competence', branch: 'Coast Guard' },
  { phrase: 'a self-starter', civ: 'self-motivated / requires minimal direction', type: 'EER', level: 'Exceeds', cat: 'Initiative', branch: 'Coast Guard' },
  { phrase: 'devoted to professional growth', civ: 'committed to ongoing professional development', type: 'EER', level: 'Meets', cat: 'Development', branch: 'Coast Guard' },
  { phrase: 'mentored junior members', civ: 'actively mentored junior staff / new employees', type: 'EER', level: 'Meets', cat: 'Leadership', branch: 'Coast Guard' },
  { phrase: 'adaptable to changing mission requirements', civ: 'flexible and responsive to changing priorities', type: 'EER', level: 'Meets', cat: 'Adaptability', branch: 'Coast Guard' },
  { phrase: 'fostered unit cohesion', civ: 'built strong team dynamics / promoted collaboration', type: 'EER', level: 'Exceeds', cat: 'Leadership', branch: 'Coast Guard' },
  { phrase: 'exceptional communicator', civ: 'excellent written and verbal communicator', type: 'EER', level: 'Exceeds', cat: 'Communication', branch: 'Coast Guard' },
  { phrase: 'maintained vessel readiness', civ: 'maintained equipment / fleet readiness at all times', type: 'EER', level: 'Meets', cat: 'Readiness', branch: 'Coast Guard' },
  { phrase: 'enforce federal regulations', civ: 'enforce regulatory compliance / legal standards', type: 'EER', level: 'Meets', cat: 'Competence', branch: 'Coast Guard' },
];

for (const e of evalPhrases) {
  lines.push(
    `INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch)` +
    ` VALUES ('${esc(e.phrase)}', '${esc(e.civ)}', '${esc(e.type)}', ${nullable(e.level)}, ${nullable(e.cat)}, ${nullable(e.branch)})` +
    ` ON CONFLICT DO NOTHING;`
  );
  counts.dict_eval_phrases++;
}
lines.push('');


// ==========================================
// 3. dict_action_verbs — all 1,186 verbs from action-verbs-library.json
// ==========================================
lines.push('-- =============================================================================');
lines.push('-- TABLE: dict_action_verbs');
lines.push('-- Schema: verb, category, strength, avoid_in, best_for[]');
lines.push('-- =============================================================================');
lines.push('');

// CREATE TABLE IF NOT EXISTS for safety
lines.push('-- Create table if it does not exist yet');
lines.push(`CREATE TABLE IF NOT EXISTS dict_action_verbs (`);
lines.push(`  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`);
lines.push(`  verb TEXT NOT NULL,`);
lines.push(`  category TEXT NOT NULL,`);
lines.push(`  strength TEXT NOT NULL DEFAULT 'strong',`);
lines.push(`  avoid_in TEXT,`);
lines.push(`  best_for TEXT[] DEFAULT '{}',`);
lines.push(`  created_at TIMESTAMPTZ DEFAULT NOW(),`);
lines.push(`  UNIQUE(verb, category)`);
lines.push(`);`);
lines.push('');

const verbsData = JSON.parse(readFileSync(join(BASE, 'action-verbs-library.json'), 'utf8'));

// Map category keys to display names and strength assignments
const categoryConfig = {
  leadership: { name: 'Leadership', strength: 'power', bestFor: ['management', 'executive'] },
  communication: { name: 'Communication', strength: 'strong', bestFor: ['any'] },
  technical: { name: 'Technical', strength: 'strong', bestFor: ['engineering', 'IT', 'technical'] },
  analytical: { name: 'Analytical', strength: 'strong', bestFor: ['research', 'analysis', 'data'] },
  financial: { name: 'Financial', strength: 'strong', bestFor: ['finance', 'accounting', 'budget'] },
  administrative: { name: 'Administrative', strength: 'standard', bestFor: ['admin', 'office', 'clerical'] },
  operations: { name: 'Operations', strength: 'strong', bestFor: ['logistics', 'supply chain', 'operations'] },
  safety_security: { name: 'Safety & Security', strength: 'strong', bestFor: ['security', 'safety', 'law enforcement'] },
  training_development: { name: 'Training & Development', strength: 'strong', bestFor: ['training', 'education', 'HR'] },
  project_management: { name: 'Project Management', strength: 'power', bestFor: ['management', 'consulting', 'PM'] },
  customer_service: { name: 'Customer Service', strength: 'standard', bestFor: ['customer service', 'sales', 'support'] },
  creative: { name: 'Creative', strength: 'strong', bestFor: ['design', 'marketing', 'media'] },
  quantified_impact: { name: 'Quantified Impact', strength: 'power', bestFor: ['any'] },
};

for (const [catKey, catData] of Object.entries(verbsData)) {
  if (catKey === 'meta') continue;
  const verbs = catData.verbs || catData;
  if (!Array.isArray(verbs)) continue;

  const config = categoryConfig[catKey] || { name: catKey, strength: 'strong', bestFor: [] };

  lines.push(`-- ${config.name} (${verbs.length} verbs)`);
  for (const verb of verbs) {
    lines.push(
      `INSERT INTO dict_action_verbs (verb, category, strength, avoid_in, best_for)` +
      ` VALUES ('${esc(verb)}', '${esc(config.name)}', '${esc(config.strength)}', NULL, ${pgArray(config.bestFor)})` +
      ` ON CONFLICT (verb, category) DO NOTHING;`
    );
    counts.dict_action_verbs++;
  }
  lines.push('');
}


// ==========================================
// Finish
// ==========================================
lines.push('COMMIT;');
lines.push('');
lines.push('-- =============================================================================');
lines.push('-- EXPANDED SEED SUMMARY');
lines.push(`-- dict_phrase_translations: ${counts.dict_phrase_translations} new INSERT statements`);
lines.push(`-- dict_eval_phrases:        ${counts.dict_eval_phrases} INSERT statements`);
lines.push(`-- dict_action_verbs:        ${counts.dict_action_verbs} INSERT statements`);
lines.push(`-- EXPANDED TOTAL:           ${counts.dict_phrase_translations + counts.dict_eval_phrases + counts.dict_action_verbs} new INSERT statements`);
lines.push('-- =============================================================================');

appendFileSync(OUT, lines.join('\n'), 'utf8');

console.log('=== Expanded SQL Generation Complete ===');
console.log(`Appended to: ${OUT}`);
console.log(`dict_phrase_translations: ${counts.dict_phrase_translations} new inserts`);
console.log(`dict_eval_phrases:        ${counts.dict_eval_phrases} inserts`);
console.log(`dict_action_verbs:        ${counts.dict_action_verbs} inserts`);
console.log(`EXPANDED TOTAL:           ${counts.dict_phrase_translations + counts.dict_eval_phrases + counts.dict_action_verbs} new inserts`);
