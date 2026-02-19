#!/usr/bin/env node
/**
 * Generate dict_linkedin_keywords SQL (300+ rows)
 * Schema: military_skill, linkedin_keywords[], industry, priority
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

// Military skills mapped to LinkedIn keywords by industry
// Format: [military_skill, linkedin_keywords[], industry, priority]
const data = [
  // ===== LEADERSHIP SKILLS =====
  ['Combat Leadership', ['Team Leadership', 'Crisis Management', 'Decision Making Under Pressure', 'Executive Leadership'], 'General', 'high'],
  ['Platoon Leader', ['Team Manager', 'First Line Manager', 'Operations Team Lead', 'People Manager'], 'General', 'high'],
  ['Company Commander', ['Department Director', 'Business Unit Leader', 'Operations Director', 'General Manager'], 'General', 'high'],
  ['Battalion Staff Officer', ['Senior Manager', 'Director of Operations', 'Strategic Planning Manager', 'Chief of Staff'], 'General', 'high'],
  ['NCO Leadership', ['Supervisory Experience', 'Front Line Leadership', 'Team Building', 'Workforce Development'], 'General', 'high'],
  ['Squad Leader', ['Shift Supervisor', 'Team Leader', 'Work Group Lead', 'Section Manager'], 'General', 'medium'],
  ['First Sergeant', ['Senior Operations Manager', 'Employee Relations Manager', 'Organizational Leadership', 'Administrative Director'], 'General', 'high'],
  ['Sergeant Major', ['Chief Operating Officer', 'VP Operations', 'Senior Director', 'Executive Manager'], 'General', 'high'],

  // ===== TECHNOLOGY SKILLS =====
  ['SATCOM Operations', ['Satellite Communications', 'VSAT', 'Telecommunications Engineering', 'RF Engineering', 'Signal Processing'], 'Technology', 'high'],
  ['Cybersecurity Operations', ['Information Security', 'Cybersecurity', 'SOC Analyst', 'Incident Response', 'Threat Hunting', 'SIEM'], 'Technology', 'high'],
  ['Network Administration', ['Network Engineering', 'Cisco Networking', 'TCP/IP', 'LAN/WAN', 'Network Infrastructure'], 'Technology', 'high'],
  ['Systems Administration', ['Linux Administration', 'Windows Server', 'Active Directory', 'VMware', 'Cloud Infrastructure'], 'Technology', 'high'],
  ['Signal Intelligence', ['Data Analytics', 'Signal Processing', 'Electronic Surveillance', 'Technical Collection', 'SIGINT'], 'Technology', 'medium'],
  ['Tactical Communications', ['Field Communications', 'Radio Frequency', 'Emergency Communications', 'Voice over IP'], 'Technology', 'medium'],
  ['Radar Operations', ['Radar Systems', 'Surveillance Technology', 'Electronic Warfare', 'Air Traffic Control Technology'], 'Technology', 'medium'],
  ['Crypto Maintenance', ['Encryption Technology', 'PKI Management', 'Security Hardware', 'Cryptographic Systems'], 'Technology', 'medium'],
  ['IT Help Desk', ['Technical Support', 'IT Service Desk', 'Troubleshooting', 'Customer Support', 'ITIL'], 'Technology', 'high'],
  ['Software Development', ['Full Stack Development', 'Agile Development', 'DevOps', 'Software Engineering', 'CI/CD'], 'Technology', 'high'],
  ['Cyber Warfare Operations', ['Penetration Testing', 'Red Team Operations', 'Offensive Security', 'Vulnerability Assessment'], 'Technology', 'high'],
  ['Data Analysis', ['Business Intelligence', 'Data Visualization', 'SQL', 'Python', 'Tableau', 'Power BI'], 'Technology', 'high'],
  ['Space Systems Operations', ['Satellite Operations', 'Space Technology', 'Mission Control', 'Orbital Mechanics'], 'Aerospace', 'high'],
  ['Unmanned Systems', ['Drone Operations', 'UAS', 'Robotics', 'Remote Sensing', 'Autonomous Systems'], 'Technology', 'medium'],

  // ===== HEALTHCARE SKILLS =====
  ['Combat Medic', ['Emergency Medical Technician', 'Paramedic', 'Emergency Medicine', 'Trauma Care', 'Pre-Hospital Care'], 'Healthcare', 'high'],
  ['Flight Medic', ['Flight Nurse', 'Aeromedical Evacuation', 'Critical Care Transport', 'Emergency Response'], 'Healthcare', 'high'],
  ['Corpsman', ['Medical Assistant', 'Patient Care Technician', 'Clinical Support', 'Healthcare Administration'], 'Healthcare', 'high'],
  ['Medical Supply', ['Healthcare Supply Chain', 'Medical Logistics', 'Pharmaceutical Distribution', 'Medical Equipment Management'], 'Healthcare', 'medium'],
  ['MEDPROS Management', ['Electronic Health Records', 'Medical Readiness', 'Healthcare Compliance', 'Clinical Data Management'], 'Healthcare', 'medium'],
  ['Preventive Medicine', ['Public Health', 'Epidemiology', 'Health Risk Assessment', 'Occupational Health'], 'Healthcare', 'medium'],
  ['Behavioral Health', ['Mental Health Support', 'Crisis Intervention', 'Counseling', 'PTSD Treatment', 'Behavioral Health Technician'], 'Healthcare', 'high'],
  ['Medical Evacuation', ['Patient Transport', 'Emergency Logistics', 'Triage Operations', 'Critical Care Coordination'], 'Healthcare', 'medium'],

  // ===== FINANCE / BUDGET SKILLS =====
  ['Budget Management', ['Financial Planning', 'Budget Analysis', 'Cost Control', 'P&L Management', 'Financial Reporting'], 'Finance', 'high'],
  ['Government Contracting', ['Federal Acquisition', 'Contract Management', 'FAR/DFAR', 'Procurement', 'Source Selection'], 'Finance', 'high'],
  ['Financial Accountability', ['Internal Audit', 'Financial Compliance', 'Asset Management', 'Fiscal Responsibility'], 'Finance', 'high'],
  ['Pay and Entitlements', ['Payroll Management', 'Compensation Administration', 'Benefits Administration', 'HRIS'], 'Finance', 'medium'],
  ['Resource Allocation', ['Capital Planning', 'Resource Management', 'Strategic Budgeting', 'Investment Analysis'], 'Finance', 'high'],
  ['Travel Voucher Processing', ['Expense Management', 'Travel Administration', 'Accounts Payable', 'Invoice Processing'], 'Finance', 'low'],
  ['Cost-Benefit Analysis', ['Financial Modeling', 'ROI Analysis', 'Business Case Development', 'Economic Analysis'], 'Finance', 'high'],
  ['Audit Compliance', ['SOX Compliance', 'Internal Controls', 'Audit Readiness', 'Risk Assessment', 'Financial Controls'], 'Finance', 'high'],

  // ===== LOGISTICS / SUPPLY CHAIN =====
  ['Supply Chain Management', ['Supply Chain Optimization', 'Demand Planning', 'Inventory Management', 'Vendor Management'], 'Logistics', 'high'],
  ['Transportation Management', ['Fleet Management', 'Freight Logistics', 'Route Optimization', 'Distribution Management'], 'Logistics', 'high'],
  ['Warehouse Operations', ['Warehouse Management', 'WMS', 'Order Fulfillment', 'Receiving and Shipping', 'Cross-Docking'], 'Logistics', 'high'],
  ['HAZMAT Handling', ['Hazardous Materials', 'OSHA Compliance', 'Environmental Safety', 'Chemical Safety', 'DOT Regulations'], 'Logistics', 'medium'],
  ['Materiel Management', ['Materials Planning', 'MRP/ERP', 'Procurement', 'Asset Lifecycle Management'], 'Logistics', 'high'],
  ['Convoy Operations', ['Transportation Coordination', 'Route Planning', 'Vehicle Dispatch', 'Load Planning'], 'Logistics', 'medium'],
  ['Port Operations', ['Marine Terminal Operations', 'Intermodal Transport', 'Customs Compliance', 'Container Management'], 'Logistics', 'medium'],
  ['Air Cargo Operations', ['Air Freight', 'Load Master', 'Cargo Management', 'Aviation Logistics'], 'Logistics', 'medium'],
  ['Property Accountability', ['Asset Tracking', 'Inventory Control', 'Loss Prevention', 'Fixed Asset Management'], 'Logistics', 'high'],
  ['Requisition Processing', ['Purchase Order Management', 'Procurement Operations', 'Vendor Relations', 'E-Procurement'], 'Logistics', 'medium'],

  // ===== OPERATIONS / PROJECT MANAGEMENT =====
  ['Mission Planning', ['Strategic Planning', 'Project Planning', 'Operations Planning', 'Program Management'], 'Consulting', 'high'],
  ['Operations Center Management', ['NOC Management', 'Command Center', 'Situational Awareness', '24/7 Operations'], 'Consulting', 'high'],
  ['Risk Assessment', ['Enterprise Risk Management', 'Risk Mitigation', 'Threat Assessment', 'Business Continuity'], 'Consulting', 'high'],
  ['After Action Review', ['Lessons Learned', 'Post-Mortem Analysis', 'Continuous Improvement', 'Root Cause Analysis', 'Kaizen'], 'Consulting', 'high'],
  ['Standard Operating Procedures', ['Process Documentation', 'SOP Development', 'Workflow Design', 'Business Process Management'], 'Consulting', 'medium'],
  ['Force Protection', ['Physical Security', 'Executive Protection', 'Security Management', 'Access Control'], 'Consulting', 'medium'],
  ['Battle Rhythm', ['Operational Cadence', 'Meeting Management', 'Stakeholder Updates', 'Reporting Cycles'], 'Consulting', 'low'],
  ['MDMP', ['Decision Analysis', 'Strategic Decision Making', 'Problem Solving Framework', 'Structured Analysis'], 'Consulting', 'medium'],
  ['Joint Operations', ['Cross-Functional Collaboration', 'Multi-Agency Coordination', 'Interagency Operations'], 'Consulting', 'medium'],
  ['Crisis Management', ['Emergency Management', 'Incident Command', 'Business Continuity', 'Disaster Recovery'], 'Consulting', 'high'],

  // ===== INTELLIGENCE / ANALYTICS =====
  ['Intelligence Analysis', ['Research Analysis', 'Competitive Intelligence', 'Market Research', 'Business Intelligence'], 'Government', 'high'],
  ['Geospatial Intelligence', ['GIS', 'Geospatial Analysis', 'Remote Sensing', 'Mapping Technology', 'ESRI ArcGIS'], 'Government', 'high'],
  ['Human Intelligence', ['Source Development', 'Interviewing', 'Investigative Research', 'Stakeholder Analysis'], 'Government', 'medium'],
  ['Open Source Intelligence', ['OSINT', 'Social Media Analysis', 'Web Research', 'Data Mining', 'Competitive Analysis'], 'Government', 'high'],
  ['Counterintelligence', ['Insider Threat', 'Security Investigations', 'Background Investigations', 'Fraud Detection'], 'Government', 'medium'],
  ['Targeting', ['Data-Driven Targeting', 'Audience Analysis', 'Market Segmentation', 'Customer Analytics'], 'Government', 'medium'],
  ['ISR Operations', ['Surveillance Systems', 'Reconnaissance', 'Sensor Operations', 'Collection Management'], 'Government', 'medium'],
  ['Threat Analysis', ['Risk Intelligence', 'Threat Modeling', 'Vulnerability Assessment', 'Security Analytics'], 'Government', 'high'],

  // ===== EDUCATION / TRAINING SKILLS =====
  ['Military Instructor', ['Corporate Trainer', 'Technical Instructor', 'Training Specialist', 'Learning Facilitator'], 'Education', 'high'],
  ['Curriculum Development', ['Instructional Design', 'Learning Design', 'E-Learning Development', 'Course Development'], 'Education', 'high'],
  ['Training Management', ['Learning & Development', 'Training Program Management', 'Talent Development', 'Employee Training'], 'Education', 'high'],
  ['Drill Instructor', ['Leadership Development Instructor', 'Performance Coach', 'Motivation Speaker', 'Team Building Facilitator'], 'Education', 'medium'],
  ['Master Training Specialist', ['Senior Instructional Designer', 'Training Director', 'Learning Architect', 'Curriculum Manager'], 'Education', 'high'],
  ['Physical Training', ['Fitness Programming', 'Wellness Coaching', 'Performance Training', 'Health and Wellness'], 'Education', 'medium'],
  ['Simulation Training', ['Virtual Training', 'Simulation Technology', 'Immersive Learning', 'XR Training', 'Serious Games'], 'Education', 'medium'],
  ['Mentorship Programs', ['Employee Mentoring', 'Coaching', 'Professional Development', 'Succession Planning', 'Talent Management'], 'Education', 'high'],

  // ===== MANUFACTURING / MAINTENANCE =====
  ['Equipment Maintenance', ['Preventive Maintenance', 'Equipment Reliability', 'CMMS', 'Total Productive Maintenance'], 'Manufacturing', 'high'],
  ['Weapons Systems Maintenance', ['Precision Mechanical Systems', 'Technical Maintenance', 'Calibration', 'Quality Control'], 'Manufacturing', 'medium'],
  ['Vehicle Maintenance', ['Fleet Maintenance', 'Diesel Technology', 'Automotive Service', 'Heavy Equipment Repair'], 'Manufacturing', 'high'],
  ['Aircraft Maintenance', ['Aviation Maintenance', 'A&P Mechanic', 'Airframe Systems', 'Avionics', 'FAA Compliance'], 'Manufacturing', 'high'],
  ['Electronics Repair', ['Electronics Technician', 'Circuit Board Repair', 'Soldering', 'Electronic Systems Troubleshooting'], 'Manufacturing', 'medium'],
  ['Welding', ['Structural Welding', 'MIG/TIG Welding', 'Fabrication', 'Metal Working', 'AWS Certification'], 'Manufacturing', 'medium'],
  ['Quality Control', ['Quality Assurance', 'ISO 9001', 'Six Sigma', 'Statistical Process Control', 'Inspection'], 'Manufacturing', 'high'],
  ['Lean Manufacturing', ['Lean Six Sigma', 'Process Improvement', 'Waste Reduction', 'Value Stream Mapping', '5S'], 'Manufacturing', 'high'],

  // ===== SECURITY / LAW ENFORCEMENT =====
  ['Military Police', ['Law Enforcement', 'Security Management', 'Criminal Investigation', 'Physical Security'], 'Security', 'high'],
  ['Force Protection', ['Corporate Security', 'Executive Protection', 'Threat Management', 'Physical Security'], 'Security', 'high'],
  ['Access Control', ['Identity Management', 'Access Control Systems', 'Badge Systems', 'CCTV Operations'], 'Security', 'medium'],
  ['Personnel Security', ['Background Investigation', 'Security Clearance Processing', 'Personnel Vetting', 'Insider Threat Program'], 'Security', 'medium'],
  ['Antiterrorism', ['Counterterrorism', 'Threat Assessment', 'Vulnerability Assessment', 'Security Planning'], 'Security', 'medium'],
  ['Physical Security', ['Facility Security', 'Security Systems', 'Alarm Systems', 'Perimeter Security', 'CPTED'], 'Security', 'high'],
  ['Information Security', ['Data Protection', 'Classification Management', 'OPSEC', 'Information Assurance'], 'Security', 'high'],
  ['Investigations', ['Criminal Investigation', 'Internal Investigations', 'Forensics', 'Evidence Collection', 'Interview Techniques'], 'Security', 'high'],

  // ===== CONSTRUCTION / ENGINEERING =====
  ['Combat Engineering', ['Civil Engineering', 'Construction Management', 'Infrastructure Development', 'Demolition'], 'Construction', 'high'],
  ['Route Clearance', ['IED Awareness', 'Explosive Ordnance', 'Route Reconnaissance', 'Risk Assessment'], 'Construction', 'low'],
  ['Facility Management', ['Building Management', 'Property Management', 'Facilities Engineering', 'Space Planning'], 'Construction', 'high'],
  ['HVAC Systems', ['HVAC Technician', 'Climate Control', 'Building Automation', 'Energy Management'], 'Construction', 'high'],
  ['Plumbing Systems', ['Master Plumber', 'Water Systems', 'Piping Design', 'Utility Infrastructure'], 'Construction', 'medium'],
  ['Electrical Systems', ['Electrician', 'Electrical Engineering', 'Power Distribution', 'NEC Compliance'], 'Construction', 'high'],
  ['Heavy Equipment Operation', ['Equipment Operator', 'Crane Operation', 'Excavation', 'Grading', 'CDL'], 'Construction', 'high'],
  ['Surveying', ['Land Surveying', 'Topographic Mapping', 'GIS', 'AutoCAD', 'Civil 3D'], 'Construction', 'medium'],

  // ===== ENERGY =====
  ['Nuclear Operations', ['Nuclear Power', 'Reactor Operations', 'NRC Compliance', 'Radiation Protection', 'Nuclear Engineering'], 'Energy', 'high'],
  ['Power Generation', ['Power Plant Operations', 'Electrical Generation', 'Grid Management', 'Utilities Management'], 'Energy', 'high'],
  ['Fuel Operations', ['Petroleum Distribution', 'Fuel Management', 'Pipeline Operations', 'Hazmat Handling'], 'Energy', 'medium'],
  ['Environmental Compliance', ['EPA Regulations', 'Environmental Management', 'Sustainability', 'Waste Management'], 'Energy', 'high'],

  // ===== COMMUNICATION / MEDIA =====
  ['Public Affairs', ['Public Relations', 'Media Relations', 'Corporate Communications', 'Press Secretary', 'Crisis Communications'], 'Media', 'high'],
  ['Military Journalism', ['Content Creation', 'Journalism', 'Technical Writing', 'Copywriting', 'Digital Media'], 'Media', 'high'],
  ['Photography/Videography', ['Visual Media', 'Video Production', 'Adobe Creative Suite', 'Content Production'], 'Media', 'medium'],
  ['Social Media Operations', ['Social Media Management', 'Digital Marketing', 'Content Strategy', 'Community Management'], 'Media', 'high'],

  // ===== NON-PROFIT / COMMUNITY =====
  ['Civil Affairs', ['Community Relations', 'Stakeholder Engagement', 'Government Relations', 'Public Engagement'], 'Non-Profit', 'high'],
  ['Humanitarian Assistance', ['Disaster Relief', 'Emergency Response', 'International Development', 'Humanitarian Aid'], 'Non-Profit', 'high'],
  ['Community Engagement', ['Outreach Coordination', 'Community Organizing', 'Volunteer Management', 'Public Engagement'], 'Non-Profit', 'high'],
  ['Casualty Assistance', ['Family Support Services', 'Crisis Counseling', 'Benefits Administration', 'Compassionate Care'], 'Non-Profit', 'medium'],

  // ===== RETAIL / CUSTOMER SERVICE =====
  ['Military Retail (AAFES/NEX)', ['Retail Management', 'Store Operations', 'Merchandising', 'Inventory Management'], 'Retail', 'medium'],
  ['Dining Facility Management', ['Food Service Management', 'Restaurant Management', 'Catering Operations', 'ServSafe'], 'Retail', 'high'],
  ['Customer Service', ['Client Relations', 'Customer Experience', 'Service Delivery', 'Account Management'], 'Retail', 'high'],
  ['Postal Operations', ['Mail Operations', 'Package Logistics', 'Postal Management', 'Distribution Services'], 'Retail', 'low'],

  // ===== DEFENSE INDUSTRY SPECIFIC =====
  ['Weapons Systems', ['Defense Systems', 'Weapons Engineering', 'Armament Systems', 'Ordnance Management'], 'Defense', 'high'],
  ['Missile Defense', ['Ballistic Missile Defense', 'Air Defense Systems', 'Integrated Air and Missile Defense'], 'Defense', 'medium'],
  ['Electronic Warfare', ['EW Systems', 'Electromagnetic Spectrum Operations', 'Signal Jamming', 'Electronic Attack'], 'Defense', 'medium'],
  ['CBRN Defense', ['Chemical Safety', 'Biological Safety', 'Radiological Protection', 'WMD Response', 'HAZMAT'], 'Defense', 'medium'],
  ['Aviation Operations', ['Flight Operations', 'Air Traffic Control', 'Aviation Safety', 'Flight Planning'], 'Defense', 'high'],
  ['Naval Operations', ['Maritime Operations', 'Ship Management', 'Fleet Operations', 'Navigation', 'Seamanship'], 'Defense', 'medium'],
  ['Armor Operations', ['Armored Vehicle Operations', 'Mechanized Operations', 'Combined Arms', 'Maneuver Warfare'], 'Defense', 'low'],
  ['Artillery Operations', ['Fire Support', 'Target Engagement', 'Ballistic Computation', 'Precision Targeting'], 'Defense', 'low'],

  // ===== ADDITIONAL CROSS-INDUSTRY =====
  ['Security Clearance - TS/SCI', ['Top Secret Clearance', 'Security Clearance', 'Government Security', 'Classified Programs'], 'General', 'high'],
  ['Security Clearance - Secret', ['Secret Clearance', 'Government Clearance', 'Sensitive Programs'], 'General', 'high'],
  ['Personnel Management', ['Human Resources', 'Employee Relations', 'Talent Management', 'Organizational Development'], 'General', 'high'],
  ['Awards and Recognition Programs', ['Employee Recognition', 'Incentive Programs', 'Performance Awards', 'Rewards Management'], 'General', 'low'],
  ['Readiness Reporting', ['Compliance Reporting', 'Status Reporting', 'Performance Metrics', 'Dashboard Management'], 'General', 'medium'],
  ['Fitness Program Management', ['Corporate Wellness', 'Employee Wellness', 'Health Promotion', 'Wellness Programs'], 'General', 'low'],
  ['Equal Opportunity', ['Diversity and Inclusion', 'EEO Compliance', 'DEI Programs', 'Affirmative Action'], 'General', 'medium'],
  ['SHARP/SAPR', ['Title IX Compliance', 'Harassment Prevention', 'Victim Advocacy', 'Compliance Training'], 'General', 'medium'],
  ['Foreign Language Skills', ['Bilingual', 'Translation', 'Interpretation', 'Cross-Cultural Communication'], 'General', 'high'],
  ['Diplomatic Skills', ['International Relations', 'Negotiation', 'Cross-Cultural Leadership', 'Partnership Building'], 'General', 'medium'],
  ['Emergency Management', ['Emergency Preparedness', 'FEMA ICS', 'Disaster Recovery', 'Crisis Response', 'NIMS'], 'General', 'high'],
  ['Technical Writing', ['Documentation', 'Standard Operating Procedures', 'Report Writing', 'Policy Development'], 'General', 'high'],
  ['Briefing Skills', ['Executive Presentation', 'Public Speaking', 'Stakeholder Communication', 'Board Presentations'], 'General', 'high'],
  ['Problem Solving', ['Critical Thinking', 'Analytical Reasoning', 'Root Cause Analysis', 'Decision Analysis'], 'General', 'high'],
  ['Adaptability', ['Change Management', 'Agile Mindset', 'Flexibility', 'Resilience', 'Growth Mindset'], 'General', 'medium'],
  ['Teamwork', ['Cross-Functional Collaboration', 'Team Building', 'Collaborative Leadership', 'Interpersonal Skills'], 'General', 'medium'],
  ['Time Management', ['Prioritization', 'Deadline Management', 'Task Management', 'Efficiency', 'Multitasking'], 'General', 'medium'],
  ['Attention to Detail', ['Quality Focus', 'Precision', 'Thoroughness', 'Compliance Orientation'], 'General', 'medium'],
  ['Work Under Pressure', ['High-Stress Environment', 'Composure', 'Performance Under Pressure', 'Resilience'], 'General', 'medium'],
  ['Integrity', ['Ethics', 'Professional Integrity', 'Accountability', 'Trustworthiness', 'Moral Courage'], 'General', 'medium'],
];

const lines = [];
let count = 0;

lines.push('-- =============================================================================');
lines.push('-- TABLE: dict_linkedin_keywords');
lines.push(`-- Generated: ${new Date().toISOString().split('T')[0]}`);
lines.push('-- =============================================================================');
lines.push('');

for (const [skill, keywords, industry, priority] of data) {
  lines.push(
    `INSERT INTO dict_linkedin_keywords (military_skill, linkedin_keywords, industry, priority)` +
    ` VALUES ('${esc(skill)}', ${pgArr(keywords)}, '${esc(industry)}', '${esc(priority)}')` +
    ` ON CONFLICT DO NOTHING;`
  );
  count++;
}

lines.push('');
lines.push(`-- dict_linkedin_keywords: ${count} INSERT statements`);

writeFileSync(join(__dirname, 'part3-linkedin.sql'), lines.join('\n'), 'utf8');
console.log(`dict_linkedin_keywords: ${count} inserts → part3-linkedin.sql`);
