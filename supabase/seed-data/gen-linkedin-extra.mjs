#!/usr/bin/env node
/**
 * Generate additional dict_linkedin_keywords SQL to reach 300+ total
 * Adds industry-specific duplicate skills with different keyword sets
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

// Additional LinkedIn keyword mappings — industry-specific variants
const data = [
  // ===== TECHNOLOGY — EXPANDED =====
  ['Cloud Computing', ['AWS', 'Azure', 'Google Cloud', 'Cloud Architecture', 'Cloud Migration', 'IaaS', 'SaaS'], 'Technology', 'high'],
  ['Database Administration', ['SQL Server', 'Oracle', 'PostgreSQL', 'MySQL', 'Database Design', 'Data Modeling'], 'Technology', 'high'],
  ['Information Assurance', ['FISMA', 'RMF', 'NIST 800-53', 'Security Controls', 'Authority to Operate', 'STIG'], 'Technology', 'high'],
  ['Help Desk Management', ['ITIL Service Management', 'Service Desk', 'Incident Management', 'SLA Management'], 'Technology', 'medium'],
  ['Telecommunications Engineering', ['VoIP', 'Unified Communications', 'PBX Systems', 'Fiber Optics', 'MPLS'], 'Technology', 'medium'],
  ['Automation', ['Ansible', 'Terraform', 'PowerShell Scripting', 'Python Automation', 'Infrastructure as Code'], 'Technology', 'high'],
  ['Agile/Scrum', ['Scrum Master', 'Sprint Planning', 'Kanban', 'Jira', 'Agile Methodology'], 'Technology', 'high'],
  ['Mobile Device Management', ['MDM', 'BYOD Policy', 'Endpoint Security', 'Mobile Security', 'Intune'], 'Technology', 'medium'],
  ['Network Security', ['Firewall Administration', 'IDS/IPS', 'Zero Trust Architecture', 'Network Segmentation'], 'Technology', 'high'],
  ['Virtualization', ['VMware vSphere', 'Hyper-V', 'Containerization', 'Docker', 'Kubernetes'], 'Technology', 'high'],

  // ===== HEALTHCARE — EXPANDED =====
  ['Medical Records Management', ['Electronic Health Records', 'Epic', 'Cerner', 'Medical Coding', 'HIPAA Compliance'], 'Healthcare', 'high'],
  ['Emergency Response', ['Mass Casualty Management', 'Triage', 'Emergency Preparedness', 'FEMA ICS'], 'Healthcare', 'high'],
  ['Laboratory Operations', ['Lab Management', 'Clinical Laboratory', 'Quality Control', 'CLIA Compliance'], 'Healthcare', 'medium'],
  ['Pharmacy Operations', ['Medication Management', 'Pharmaceutical Logistics', 'Drug Safety', 'Clinical Pharmacy'], 'Healthcare', 'medium'],
  ['Dental Operations', ['Dental Practice Management', 'Oral Health Programs', 'Clinical Coordination'], 'Healthcare', 'low'],
  ['Medical Training', ['BLS Instructor', 'ACLS', 'Combat Lifesaver', 'First Aid Training', 'CPR Instructor'], 'Healthcare', 'high'],
  ['Telemedicine', ['Telehealth', 'Virtual Care', 'Remote Patient Monitoring', 'Digital Health'], 'Healthcare', 'medium'],
  ['Clinical Research', ['Medical Research', 'Clinical Trials', 'IRB Compliance', 'Research Administration'], 'Healthcare', 'medium'],

  // ===== FINANCE — EXPANDED =====
  ['Financial Systems', ['SAP', 'Oracle Financials', 'GFEBS', 'Financial ERP', 'Accounting Software'], 'Finance', 'high'],
  ['Accounts Management', ['Accounts Receivable', 'Accounts Payable', 'General Ledger', 'Financial Reconciliation'], 'Finance', 'medium'],
  ['Tax Compliance', ['Tax Preparation', 'Tax Law', 'Military Tax Exemptions', 'State Tax Compliance'], 'Finance', 'low'],
  ['Investment Analysis', ['Portfolio Management', 'Securities Analysis', 'Market Analysis', 'Bloomberg Terminal'], 'Finance', 'medium'],
  ['Insurance Operations', ['Risk Insurance', 'Claims Management', 'Underwriting', 'SGLI/VGLI Knowledge'], 'Finance', 'low'],
  ['Treasury Management', ['Cash Management', 'Liquidity Analysis', 'Wire Transfers', 'Banking Operations'], 'Finance', 'medium'],

  // ===== GOVERNMENT — EXPANDED =====
  ['Congressional Liaison', ['Legislative Affairs', 'Government Relations', 'Public Policy', 'Political Affairs'], 'Government', 'medium'],
  ['Interagency Coordination', ['Multi-Agency Operations', 'Federal Partnerships', 'Joint Task Force', 'Coalition Building'], 'Government', 'high'],
  ['Classification Management', ['Security Classification', 'Declassification', 'FOIA', 'Records Management'], 'Government', 'medium'],
  ['Federal HR Management', ['OPM Regulations', 'Merit Systems', 'Position Classification', 'Federal Pay Systems'], 'Government', 'medium'],
  ['Grant Management', ['Federal Grants', 'Grant Writing', 'Grant Administration', 'Grants.gov', 'Federal Funding'], 'Government', 'high'],
  ['Regulatory Affairs', ['Federal Regulations', 'Rulemaking', 'Administrative Law', 'Compliance Management'], 'Government', 'medium'],
  ['Emergency Management', ['FEMA Coordination', 'National Response Framework', 'NIMS', 'Disaster Recovery'], 'Government', 'high'],
  ['Veterans Affairs', ['VA Benefits', 'Veterans Services', 'Transition Assistance', 'Military-to-Civilian'], 'Government', 'medium'],

  // ===== EDUCATION — EXPANDED =====
  ['Assessment Development', ['Test Development', 'Psychometrics', 'Rubric Design', 'Learning Assessment'], 'Education', 'high'],
  ['E-Learning', ['LMS Administration', 'Online Learning', 'Moodle', 'Blackboard', 'Canvas'], 'Education', 'high'],
  ['Student Affairs', ['Student Services', 'Academic Counseling', 'Student Development', 'Enrollment Management'], 'Education', 'medium'],
  ['Special Education', ['Disability Services', 'IEP Development', 'Accommodations', 'Section 504'], 'Education', 'medium'],
  ['Library Science', ['Information Management', 'Research Services', 'Digital Archives', 'Knowledge Management'], 'Education', 'low'],
  ['Adult Education', ['GED Programs', 'Continuing Education', 'Professional Development', 'Lifelong Learning'], 'Education', 'medium'],
  ['STEM Education', ['STEM Curriculum', 'Science Education', 'Technology Education', 'Engineering Education'], 'Education', 'medium'],

  // ===== MANUFACTURING — EXPANDED =====
  ['CNC Operations', ['CNC Programming', 'G-Code', 'Precision Machining', 'CAM Software'], 'Manufacturing', 'medium'],
  ['Assembly Operations', ['Production Line', 'Assembly Processes', 'Work Instructions', 'Standard Work'], 'Manufacturing', 'medium'],
  ['3D Printing', ['Additive Manufacturing', '3D Modeling', 'Rapid Prototyping', 'CAD Design'], 'Manufacturing', 'medium'],
  ['Paint/Coatings', ['Surface Treatment', 'Corrosion Control', 'Industrial Painting', 'Protective Coatings'], 'Manufacturing', 'low'],
  ['Hydraulic Systems', ['Hydraulic Maintenance', 'Pneumatic Systems', 'Fluid Power', 'Hydraulic Design'], 'Manufacturing', 'medium'],
  ['Electrical Assembly', ['Wire Harness', 'PCB Assembly', 'Soldering', 'Electrical Testing'], 'Manufacturing', 'medium'],
  ['Tool and Die', ['Tool Making', 'Die Design', 'Fixture Design', 'Precision Tooling'], 'Manufacturing', 'medium'],
  ['Industrial Safety', ['OSHA Compliance', 'Lockout/Tagout', 'PPE Programs', 'Safety Auditing'], 'Manufacturing', 'high'],

  // ===== LOGISTICS — EXPANDED =====
  ['Customs and Border', ['Customs Compliance', 'Import/Export', 'Trade Compliance', 'International Shipping'], 'Logistics', 'medium'],
  ['Cold Chain Logistics', ['Temperature-Controlled Shipping', 'Pharmaceutical Logistics', 'Perishable Goods'], 'Logistics', 'medium'],
  ['Last Mile Delivery', ['Delivery Management', 'Route Optimization', 'Delivery Logistics', 'E-Commerce Fulfillment'], 'Logistics', 'medium'],
  ['Demand Planning', ['Forecasting', 'Demand Analysis', 'S&OP', 'Inventory Planning'], 'Logistics', 'high'],
  ['Procurement', ['Strategic Sourcing', 'Vendor Management', 'Purchase Orders', 'Supplier Relations'], 'Logistics', 'high'],
  ['Return Logistics', ['Reverse Logistics', 'Returns Management', 'RMA Processing', 'Refurbishment'], 'Logistics', 'low'],
  ['3PL Management', ['Third-Party Logistics', 'Outsourced Logistics', 'Carrier Management', 'Freight Brokerage'], 'Logistics', 'medium'],

  // ===== CONSULTING — EXPANDED =====
  ['Process Mapping', ['Business Process Mapping', 'Workflow Analysis', 'Swimlane Diagrams', 'Process Documentation'], 'Consulting', 'high'],
  ['Stakeholder Management', ['Client Relationship Management', 'Stakeholder Analysis', 'Requirements Gathering'], 'Consulting', 'high'],
  ['Organizational Development', ['OD Consulting', 'Team Effectiveness', 'Organizational Design', 'Culture Change'], 'Consulting', 'high'],
  ['Strategy Development', ['Strategic Framework', 'Competitive Analysis', 'Market Entry Strategy', 'Growth Strategy'], 'Consulting', 'high'],
  ['Performance Improvement', ['Operational Excellence', 'Efficiency Optimization', 'KPI Development', 'Benchmarking'], 'Consulting', 'high'],
  ['Due Diligence', ['M&A Analysis', 'Company Assessment', 'Risk Evaluation', 'Financial Review'], 'Consulting', 'medium'],

  // ===== DEFENSE — EXPANDED =====
  ['Requirements Management', ['JCIDS', 'Capabilities Development', 'Requirements Traceability', 'DOORS'], 'Defense', 'high'],
  ['Test and Evaluation', ['T&E Planning', 'Operational Testing', 'DT&E', 'OT&E', 'Test Reports'], 'Defense', 'high'],
  ['Configuration Management', ['CM Planning', 'Baseline Management', 'Change Control', 'Version Control'], 'Defense', 'medium'],
  ['Modeling and Simulation', ['JLVC', 'Constructive Simulation', 'War Gaming', 'Scenario Development'], 'Defense', 'medium'],
  ['Foreign Military Sales', ['FMS', 'Security Cooperation', 'International Defense', 'DSCA'], 'Defense', 'medium'],
  ['Base Operations Support', ['Installation Management', 'Garrison Operations', 'Facility Support', 'Base Services'], 'Defense', 'medium'],
  ['Acquisition Management', ['ACAT Programs', 'Milestone Reviews', 'Program Execution', 'Acquisition Strategy'], 'Defense', 'high'],
  ['Systems Integration', ['C4ISR', 'Interoperability', 'Systems Architecture', 'Interface Design'], 'Defense', 'high'],

  // ===== ENERGY — EXPANDED =====
  ['Solar Energy', ['Photovoltaic Systems', 'Solar Installation', 'Renewable Energy', 'Solar Design'], 'Energy', 'medium'],
  ['Wind Energy', ['Wind Turbine Operations', 'Wind Farm Management', 'Renewable Energy Systems'], 'Energy', 'medium'],
  ['Electrical Distribution', ['Power Grid', 'Substation Operations', 'Load Balancing', 'SCADA Systems'], 'Energy', 'high'],
  ['Oil and Gas Operations', ['Petroleum Engineering', 'Pipeline Operations', 'Downstream Operations'], 'Energy', 'medium'],
  ['Energy Efficiency', ['Energy Auditing', 'Building Efficiency', 'LEED', 'Energy Star', 'Sustainability'], 'Energy', 'high'],
  ['Nuclear Regulatory', ['NRC Compliance', 'Health Physics', 'Dosimetry', 'Nuclear Safety Culture'], 'Energy', 'high'],

  // ===== NON-PROFIT — EXPANDED =====
  ['Fundraising', ['Capital Campaigns', 'Major Gifts', 'Donor Relations', 'Annual Fund', 'Philanthropy'], 'Non-Profit', 'high'],
  ['Volunteer Coordination', ['Volunteer Management', 'Volunteer Recruitment', 'Community Volunteers'], 'Non-Profit', 'high'],
  ['Social Services', ['Case Management', 'Social Work', 'Client Services', 'Needs Assessment'], 'Non-Profit', 'high'],
  ['Advocacy', ['Policy Advocacy', 'Legislative Advocacy', 'Community Advocacy', 'Grassroots Organizing'], 'Non-Profit', 'medium'],
  ['International Development', ['Foreign Aid', 'International NGO', 'Development Programs', 'USAID'], 'Non-Profit', 'medium'],

  // ===== RETAIL — EXPANDED =====
  ['Merchandising', ['Visual Merchandising', 'Product Placement', 'Planogram', 'Category Management'], 'Retail', 'high'],
  ['E-Commerce', ['Online Retail', 'Digital Commerce', 'Shopify', 'Amazon Marketplace', 'Omnichannel'], 'Retail', 'high'],
  ['Point of Sale', ['POS Systems', 'Payment Processing', 'Cash Management', 'Register Operations'], 'Retail', 'low'],
  ['Customer Analytics', ['Shopping Analytics', 'Customer Segmentation', 'Loyalty Programs', 'Conversion Optimization'], 'Retail', 'medium'],
  ['Store Operations', ['Store Management', 'Retail Operations', 'Shrinkage Control', 'Labor Scheduling'], 'Retail', 'high'],

  // ===== CONSTRUCTION — EXPANDED =====
  ['Blueprint Reading', ['Construction Drawings', 'Technical Drawings', 'Architectural Plans', 'As-Built Documentation'], 'Construction', 'high'],
  ['Concrete Operations', ['Concrete Placement', 'Masonry', 'Foundation Work', 'Structural Concrete'], 'Construction', 'medium'],
  ['Carpentry', ['Rough Carpentry', 'Finish Carpentry', 'Framing', 'Trim Work'], 'Construction', 'medium'],
  ['Building Codes', ['International Building Code', 'Fire Code', 'ADA Compliance', 'Code Inspection'], 'Construction', 'high'],
  ['Environmental Remediation', ['Soil Remediation', 'Asbestos Abatement', 'Lead Paint Removal', 'Environmental Cleanup'], 'Construction', 'medium'],
  ['Green Building', ['LEED Certification', 'Sustainable Construction', 'Green Design', 'Energy-Efficient Building'], 'Construction', 'medium'],

  // ===== TELECOM — EXPANDED =====
  ['5G Technology', ['5G Networks', 'Next-Gen Wireless', 'Small Cell Deployment', '5G Architecture'], 'Telecommunications', 'high'],
  ['Fiber Optics', ['FTTH', 'Fiber Splicing', 'Optical Network', 'Fiber Installation'], 'Telecommunications', 'high'],
  ['Tower Operations', ['Cell Tower Maintenance', 'Tower Climbing', 'Antenna Installation', 'Tower Safety'], 'Telecommunications', 'medium'],
  ['Microwave Communications', ['Microwave Links', 'Point-to-Point', 'Backhaul', 'Microwave Engineering'], 'Telecommunications', 'medium'],
  ['Satellite Communications', ['SATCOM', 'VSAT Operations', 'Satellite Engineering', 'Earth Station Operations'], 'Telecommunications', 'high'],

  // ===== AEROSPACE — EXPANDED =====
  ['Propulsion Systems', ['Rocket Propulsion', 'Jet Engines', 'Turbine Technology', 'Propulsion Engineering'], 'Aerospace', 'medium'],
  ['Flight Test', ['Flight Test Engineering', 'Test Pilot Support', 'Flight Data Analysis', 'Certification'], 'Aerospace', 'medium'],
  ['Space Operations', ['Orbital Operations', 'Space Situational Awareness', 'Satellite Control', 'Ground Systems'], 'Aerospace', 'high'],
  ['Aircraft Structures', ['Structural Repair', 'Composite Materials', 'Non-Destructive Testing', 'Structural Analysis'], 'Aerospace', 'medium'],
  ['Avionics', ['Avionics Systems', 'Flight Instruments', 'Navigation Systems', 'Cockpit Systems'], 'Aerospace', 'high'],
  ['Unmanned Aerial Systems', ['UAV Operations', 'Drone Technology', 'sUAS', 'Part 107', 'Remote Pilot'], 'Aerospace', 'high'],

  // ===== ADDITIONAL GENERAL SKILLS =====
  ['Convoy Security', ['Escort Operations', 'VIP Protection', 'Route Security', 'Security Operations'], 'General', 'low'],
  ['Guard Force Management', ['Security Force Management', 'Guard Operations', 'Patrol Management'], 'General', 'medium'],
  ['Range Operations', ['Firing Range Management', 'Weapons Training', 'Range Safety', 'Marksmanship Training'], 'General', 'low'],
  ['Military Protocol', ['Protocol Management', 'Ceremony Coordination', 'Distinguished Visitor Programs'], 'General', 'low'],
  ['Deployment Planning', ['Mobilization Planning', 'Deployment Logistics', 'Force Deployment', 'Redeployment'], 'General', 'medium'],
  ['Coalition Operations', ['Multinational Operations', 'Alliance Management', 'NATO Operations', 'International Cooperation'], 'General', 'medium'],
  ['Combat Operations', ['Tactical Operations', 'Mission Execution', 'Operational Planning', 'Battle Management'], 'General', 'medium'],
  ['Maritime Security', ['Port Security', 'Vessel Inspection', 'Maritime Law', 'Coastal Security', 'MTSA'], 'General', 'medium'],
  ['Counter-Drug Operations', ['Drug Interdiction', 'Counter-Narcotics', 'Law Enforcement Operations'], 'General', 'low'],
  ['Search and Rescue', ['SAR Operations', 'Emergency Rescue', 'Swift Water Rescue', 'Wilderness SAR'], 'General', 'medium'],
  ['Civil-Military Operations', ['Civil Affairs', 'Reconstruction', 'Stability Operations', 'Nation Building'], 'General', 'low'],
  ['Psychological Operations', ['Information Operations', 'Influence Operations', 'Strategic Communication', 'MISO'], 'General', 'medium'],
  ['Special Operations Support', ['SOF Support', 'Unconventional Warfare Support', 'Direct Action Support'], 'General', 'low'],
  ['NBC/CBRN', ['HAZMAT Response', 'Chemical Safety', 'Radiological Safety', 'Biological Preparedness'], 'General', 'medium'],
  ['Personnel Recovery', ['SERE', 'Survival Training', 'Evasion', 'Escape and Recovery'], 'General', 'low'],
  ['Geopolitical Analysis', ['Regional Expertise', 'Political-Military Analysis', 'Country Studies', 'Cultural Analysis'], 'General', 'medium'],
  ['Strategic Communications', ['Public Affairs', 'Messaging Strategy', 'Communication Planning', 'Brand Management'], 'General', 'high'],
  ['Program Evaluation', ['Metrics Development', 'Program Assessment', 'Outcome Measurement', 'Impact Analysis'], 'General', 'high'],
  ['Contract Administration', ['COR/COTR', 'Performance Monitoring', 'Contract Compliance', 'Deliverable Tracking'], 'General', 'high'],
  ['Foreign Disclosure', ['Technology Transfer', 'Export Control', 'ITAR', 'EAR Compliance'], 'General', 'medium'],
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
lines.push(`-- dict_linkedin_keywords (extra): ${count} INSERT statements`);

writeFileSync(join(__dirname, 'part3-linkedin-extra.sql'), lines.join('\n'), 'utf8');
console.log(`dict_linkedin_keywords (extra): ${count} inserts → part3-linkedin-extra.sql`);
