#!/usr/bin/env node
/**
 * gen-part1.mjs
 * Generates SQL INSERT statements for dict_acronyms and dict_ats_keywords tables.
 * Reads bulletTranslator.ts to extract ACRONYM_TO_CIVILIAN map entries.
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = resolve(__dirname, 'part1.sql');
const SOURCE_FILE = resolve(__dirname, '../../src/lib/dictionary/bulletTranslator.ts');

// SQL-escape a string: double single quotes
function esc(s) {
  return s.replace(/'/g, "''");
}

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

// ============================================================================
// TABLE 1: dict_acronyms — parsed from bulletTranslator.ts
// ============================================================================

function parseAcronyms() {
  const src = readFileSync(SOURCE_FILE, 'utf-8');
  const lines = src.split('\n');

  // Find the ACRONYM_TO_CIVILIAN block
  let startLine = -1;
  let endLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const ACRONYM_TO_CIVILIAN')) {
      startLine = i;
    }
    if (startLine >= 0 && i > startLine && /^\};/.test(lines[i].trim())) {
      endLine = i;
      break;
    }
  }

  if (startLine === -1 || endLine === -1) {
    throw new Error('Could not find ACRONYM_TO_CIVILIAN map boundaries');
  }

  const block = lines.slice(startLine, endLine + 1);

  // Branch detection via section comments
  const branchMap = [
    { pattern: /\/\/\s*=====\s*UNIVERSAL\s*\/\s*CROSS-BRANCH\s*=====/, branch: 'all' },
    { pattern: /\/\/\s*=====\s*NAVY\s+SPECIFIC\s*=====/, branch: 'Navy' },
    { pattern: /\/\/\s*=====\s*ARMY\s+SPECIFIC\s*=====/, branch: 'Army' },
    { pattern: /\/\/\s*=====\s*MARINE\s+CORPS\s+SPECIFIC\s*=====/, branch: 'Marines' },
    { pattern: /\/\/\s*=====\s*AIR\s+FORCE\s+SPECIFIC\s*=====/, branch: 'Air Force' },
    { pattern: /\/\/\s*=====\s*COAST\s+GUARD\s+SPECIFIC\s*=====/, branch: 'Coast Guard' },
    { pattern: /\/\/\s*=====\s*SPACE\s+FORCE\s+SPECIFIC\s*=====/, branch: 'Space Force' },
    { pattern: /\/\/\s*=====\s*COMMON\s+MILITARY\s+TERMS\s*=====/, branch: 'all' },
  ];

  let currentBranch = 'all';
  const entries = [];

  // Regex to match key-value pairs: 'KEY': 'VALUE',
  // Handles escaped single quotes inside values
  const kvRegex = /^\s*'([^']*(?:\\.[^']*)*)'\s*:\s*'((?:[^'\\]|\\.)*)'\s*,?\s*$/;

  // Navy rating abbreviations
  const navyRatings = new Set([
    'CTN', 'IT', 'ITS', 'ET', 'FC', 'OS', 'QM', 'BM', 'HM', 'MA',
    'LS', 'PS', 'YN', 'SK', 'HT', 'MM', 'EN', 'GSM', 'GSE', 'EM', 'IC'
  ]);

  // Rank abbreviations
  const rankAbbrs = new Set([
    'SGT', 'CPL', 'SPC', 'PFC', 'PV2', 'PVT', 'SSG', 'SFC', 'SGM', 'CSM',
    'PSG', 'ISG', '1SG', 'NCO', 'SNCO', 'NCOIC', 'OIC',
    'CMSGT', 'SMSGT', 'MSGT', 'TSGT', 'SSGT', 'SRA', 'A1C', 'AMN', 'AB',
    'SMMC', 'CMSAF',
    'LPO', 'LCPO', 'CMC', 'XO', 'CO', 'CC', 'CD'
  ]);

  for (const line of block) {
    // Check for branch section comments
    for (const { pattern, branch } of branchMap) {
      if (pattern.test(line)) {
        currentBranch = branch;
        break;
      }
    }

    const match = line.match(kvRegex);
    if (!match) continue;

    const key = match[1].replace(/\\'/g, "'");
    const value = match[2].replace(/\\'/g, "'");

    // Classify category
    let category = 'Acronym';

    if (rankAbbrs.has(key)) {
      category = 'Rank';
    } else if (navyRatings.has(key) && currentBranch === 'Navy') {
      category = 'Rating';
    } else if (/command/i.test(value)) {
      category = 'Organization';
    } else if (/system/i.test(value)) {
      category = 'System';
    } else if (/test|fitness|training/i.test(value)) {
      category = 'Training';
    } else if (/security|classified|intelligence/i.test(value)) {
      category = 'Security';
    } else if (/barracks|galley|dining|lodging|quarters|restroom|hallway|stairwell|door|wall|ceiling|reception|platform|grocery|retail|store/i.test(value)) {
      category = 'Facility';
    }

    entries.push({
      acronym: key,
      full_term: value,
      civilian_explanation: value,
      branch: currentBranch,
      category,
    });
  }

  return entries;
}

// ============================================================================
// TABLE 2: dict_ats_keywords — generated data
// ============================================================================

function generateATSKeywords() {
  const rows = [];

  function add(industry, role_type, keywords, weight) {
    rows.push({ industry, role_type, keywords, weight });
  }

  // ---- TECHNOLOGY (60+ rows) ----

  add('Technology', 'Software Engineer', ['Python', 'Java', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Agile', 'REST API', 'Microservices', 'SQL'], 'critical');
  add('Technology', 'Software Engineer', ['Spring Boot', 'GraphQL', 'Redis', 'MongoDB', 'PostgreSQL', 'Linux', 'Object-Oriented Programming', 'Design Patterns'], 'high');
  add('Technology', 'Software Engineer', ['Code Review', 'Unit Testing', 'Integration Testing', 'Debugging', 'Performance Optimization', 'Scalability'], 'medium');
  add('Technology', 'Software Engineer', ['Technical Documentation', 'Mentoring', 'Pair Programming', 'Open Source', 'Continuous Learning'], 'low');

  add('Technology', 'DevOps Engineer', ['Terraform', 'Ansible', 'Jenkins', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Linux', 'CI/CD', 'Infrastructure as Code', 'Monitoring', 'Prometheus', 'Grafana'], 'critical');
  add('Technology', 'DevOps Engineer', ['CloudFormation', 'Helm', 'ArgoCD', 'GitOps', 'Vault', 'Consul', 'Packer', 'Vagrant'], 'high');
  add('Technology', 'DevOps Engineer', ['Shell Scripting', 'Python', 'Go', 'Nginx', 'HAProxy', 'ELK Stack', 'Datadog', 'New Relic'], 'medium');
  add('Technology', 'DevOps Engineer', ['Cost Optimization', 'Disaster Recovery', 'Incident Management', 'On-call', 'Runbooks'], 'low');

  add('Technology', 'Data Scientist', ['Python', 'R', 'Machine Learning', 'TensorFlow', 'SQL', 'Statistics', 'Deep Learning', 'NLP', 'Data Mining', 'Pandas', 'Scikit-learn'], 'critical');
  add('Technology', 'Data Scientist', ['PyTorch', 'Keras', 'Jupyter', 'Feature Engineering', 'A/B Testing', 'Hypothesis Testing', 'Regression Analysis'], 'high');
  add('Technology', 'Data Scientist', ['Spark', 'Hadoop', 'Data Visualization', 'Tableau', 'Power BI', 'ETL', 'Data Warehousing'], 'medium');
  add('Technology', 'Data Scientist', ['Research Publication', 'Presentation Skills', 'Business Acumen', 'Domain Expertise'], 'low');

  add('Technology', 'Cybersecurity Analyst', ['SIEM', 'Penetration Testing', 'Vulnerability Assessment', 'Incident Response', 'Firewall', 'IDS/IPS', 'SOC', 'CompTIA Security+', 'CISSP', 'Network Security'], 'critical');
  add('Technology', 'Cybersecurity Analyst', ['Malware Analysis', 'Threat Intelligence', 'NIST Framework', 'ISO 27001', 'Risk Assessment', 'Encryption', 'PKI'], 'high');
  add('Technology', 'Cybersecurity Analyst', ['Splunk', 'Wireshark', 'Nessus', 'Burp Suite', 'Metasploit', 'OSINT', 'Digital Forensics'], 'medium');
  add('Technology', 'Cybersecurity Analyst', ['Security Awareness Training', 'Compliance Reporting', 'Audit Support', 'Vendor Risk Management'], 'low');

  add('Technology', 'Cloud Architect', ['AWS', 'Azure', 'GCP', 'Terraform', 'CloudFormation', 'Multi-cloud', 'Serverless', 'Lambda', 'S3', 'VPC', 'IAM', 'Cost Optimization'], 'high');
  add('Technology', 'Cloud Architect', ['Microservices', 'Containerization', 'Service Mesh', 'API Gateway', 'Load Balancing', 'Auto Scaling', 'CDN'], 'critical');
  add('Technology', 'Cloud Architect', ['Well-Architected Framework', 'Cloud Migration', 'Hybrid Cloud', 'Disaster Recovery', 'High Availability'], 'medium');
  add('Technology', 'Cloud Architect', ['Architecture Decision Records', 'Technical Leadership', 'Stakeholder Communication', 'Vendor Evaluation'], 'low');

  add('Technology', 'Product Manager', ['Agile', 'Scrum', 'Roadmap', 'Stakeholder Management', 'User Stories', 'JIRA', 'Product Strategy', 'A/B Testing', 'Analytics', 'KPIs'], 'high');
  add('Technology', 'Product Manager', ['Market Research', 'Competitive Analysis', 'Product-Market Fit', 'Go-to-Market', 'Customer Discovery', 'Personas'], 'critical');
  add('Technology', 'Product Manager', ['SQL', 'Data Analysis', 'Wireframing', 'Prototyping', 'User Research', 'Usability Testing'], 'medium');
  add('Technology', 'Product Manager', ['OKRs', 'Executive Communication', 'Cross-functional Leadership', 'Prioritization Frameworks'], 'low');

  add('Technology', 'QA Engineer', ['Selenium', 'Jest', 'Cypress', 'Test Automation', 'Manual Testing', 'API Testing', 'Performance Testing', 'Regression Testing', 'Bug Tracking'], 'medium');
  add('Technology', 'QA Engineer', ['TestRail', 'Postman', 'JMeter', 'LoadRunner', 'Test Plans', 'Test Cases', 'Defect Management'], 'high');
  add('Technology', 'QA Engineer', ['CI/CD Integration', 'Docker', 'BDD', 'TDD', 'Cucumber', 'Appium', 'Mobile Testing'], 'critical');
  add('Technology', 'QA Engineer', ['Quality Metrics', 'Process Improvement', 'Root Cause Analysis', 'UAT Coordination'], 'low');

  add('Technology', 'IT Support', ['Help Desk', 'Active Directory', 'Windows', 'Linux', 'Networking', 'TCP/IP', 'DNS', 'DHCP', 'Troubleshooting', 'ServiceNow', 'ITIL'], 'medium');
  add('Technology', 'IT Support', ['Office 365', 'Azure AD', 'VPN', 'Remote Desktop', 'Ticketing Systems', 'Imaging', 'Deployment'], 'high');
  add('Technology', 'IT Support', ['Customer Service', 'SLA Management', 'Escalation', 'Knowledge Base', 'Documentation'], 'low');
  add('Technology', 'IT Support', ['CompTIA A+', 'CompTIA Network+', 'CCNA', 'Microsoft Certified', 'Hardware Repair'], 'critical');

  add('Technology', 'Database Administrator', ['SQL', 'PostgreSQL', 'MySQL', 'Oracle', 'MongoDB', 'Database Optimization', 'Backup and Recovery', 'Replication', 'Performance Tuning'], 'high');
  add('Technology', 'Database Administrator', ['SQL Server', 'Redis', 'Cassandra', 'DynamoDB', 'Elasticsearch', 'Data Modeling', 'Schema Design'], 'critical');
  add('Technology', 'Database Administrator', ['High Availability', 'Clustering', 'Sharding', 'Partitioning', 'Index Optimization', 'Query Optimization'], 'medium');
  add('Technology', 'Database Administrator', ['Capacity Planning', 'Security Hardening', 'Compliance', 'Disaster Recovery Planning'], 'low');

  add('Technology', 'Full Stack Developer', ['React', 'Angular', 'Vue', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST API', 'GraphQL', 'HTML', 'CSS', 'TypeScript'], 'critical');
  add('Technology', 'Full Stack Developer', ['Next.js', 'Tailwind CSS', 'Redux', 'Webpack', 'Vite', 'Authentication', 'Authorization'], 'high');
  add('Technology', 'Full Stack Developer', ['Docker', 'CI/CD', 'Git', 'AWS', 'Heroku', 'Vercel', 'Serverless'], 'medium');
  add('Technology', 'Full Stack Developer', ['Agile', 'Scrum', 'Code Review', 'Technical Documentation', 'Mentoring'], 'low');

  add('Technology', 'Mobile Developer', ['iOS', 'Android', 'Swift', 'Kotlin', 'React Native', 'Flutter', 'Mobile UI/UX', 'App Store', 'Firebase'], 'high');
  add('Technology', 'Mobile Developer', ['SwiftUI', 'Jetpack Compose', 'Xcode', 'Android Studio', 'CocoaPods', 'Gradle'], 'critical');
  add('Technology', 'Mobile Developer', ['Push Notifications', 'In-App Purchases', 'Analytics', 'Crash Reporting', 'Performance Optimization'], 'medium');
  add('Technology', 'Mobile Developer', ['Accessibility', 'Localization', 'App Store Optimization', 'Beta Testing', 'TestFlight'], 'low');

  add('Technology', 'Machine Learning Engineer', ['TensorFlow', 'PyTorch', 'Scikit-learn', 'MLOps', 'Feature Engineering', 'Model Deployment', 'Computer Vision', 'NLP'], 'critical');
  add('Technology', 'Machine Learning Engineer', ['Kubeflow', 'MLflow', 'SageMaker', 'Docker', 'Kubernetes', 'Python', 'Data Pipelines'], 'high');
  add('Technology', 'Machine Learning Engineer', ['Distributed Training', 'Model Optimization', 'A/B Testing', 'Experiment Tracking', 'Feature Store'], 'medium');
  add('Technology', 'Machine Learning Engineer', ['Research Papers', 'Conference Presentations', 'Open Source Contributions', 'Technical Writing'], 'low');

  add('Technology', 'Systems Administrator', ['Linux', 'Windows Server', 'VMware', 'Active Directory', 'Group Policy', 'Scripting', 'Bash', 'PowerShell', 'Monitoring'], 'medium');
  add('Technology', 'Systems Administrator', ['Ansible', 'Puppet', 'Chef', 'Nagios', 'Zabbix', 'Backup Solutions', 'Disaster Recovery'], 'high');
  add('Technology', 'Systems Administrator', ['Network Configuration', 'Firewall Management', 'DNS', 'DHCP', 'LDAP', 'SSL/TLS'], 'critical');
  add('Technology', 'Systems Administrator', ['Capacity Planning', 'Vendor Management', 'Budget Planning', 'Documentation'], 'low');

  add('Technology', 'UI/UX Designer', ['Figma', 'Sketch', 'Adobe XD', 'Wireframing', 'Prototyping', 'User Research', 'Usability Testing', 'Design Systems', 'Accessibility'], 'medium');
  add('Technology', 'UI/UX Designer', ['Information Architecture', 'Interaction Design', 'Visual Design', 'Typography', 'Color Theory'], 'high');
  add('Technology', 'UI/UX Designer', ['HTML', 'CSS', 'Responsive Design', 'Mobile-First Design', 'Design Thinking'], 'critical');
  add('Technology', 'UI/UX Designer', ['Stakeholder Presentations', 'A/B Testing', 'Analytics', 'Competitive Analysis'], 'low');

  add('Technology', 'Technical Writer', ['Documentation', 'API Documentation', 'Markdown', 'DITA', 'Content Management', 'Style Guides', 'Technical Communication'], 'low');
  add('Technology', 'Technical Writer', ['Git', 'Static Site Generators', 'Swagger', 'OpenAPI', 'Developer Portals'], 'medium');
  add('Technology', 'Technical Writer', ['Information Architecture', 'Content Strategy', 'User-Centered Writing', 'Localization'], 'high');
  add('Technology', 'Technical Writer', ['Video Tutorials', 'Knowledge Base', 'Release Notes', 'Training Materials'], 'critical');

  // ---- HEALTHCARE (40+ rows) ----

  add('Healthcare', 'Registered Nurse', ['BLS', 'ACLS', 'Patient Care', 'Triage', 'Medication Administration', 'IV Therapy', 'Electronic Health Records', 'HIPAA', 'Care Plans', 'Patient Assessment'], 'critical');
  add('Healthcare', 'Registered Nurse', ['Epic', 'Cerner', 'Meditech', 'Nursing Documentation', 'Wound Care', 'Infection Control', 'Vital Signs'], 'high');
  add('Healthcare', 'Registered Nurse', ['Patient Education', 'Discharge Planning', 'Interdisciplinary Collaboration', 'Quality Improvement', 'Fall Prevention'], 'medium');
  add('Healthcare', 'Registered Nurse', ['Mentoring', 'Charge Nurse', 'Committee Participation', 'Continuing Education', 'Evidence-Based Practice'], 'low');

  add('Healthcare', 'Physician Assistant', ['Patient Assessment', 'Diagnosis', 'Treatment Plans', 'Prescribing', 'Procedures', 'BLS', 'ACLS', 'PALS', 'History and Physical'], 'critical');
  add('Healthcare', 'Physician Assistant', ['EMR', 'Epic', 'Cerner', 'Referral Management', 'Lab Interpretation', 'Imaging Orders', 'Differential Diagnosis'], 'high');
  add('Healthcare', 'Physician Assistant', ['Patient Education', 'Chronic Disease Management', 'Preventive Care', 'Follow-Up Care', 'Telemedicine'], 'medium');
  add('Healthcare', 'Physician Assistant', ['Clinical Research', 'Quality Metrics', 'Peer Review', 'Continuing Medical Education'], 'low');

  add('Healthcare', 'Medical Technician', ['Phlebotomy', 'Specimen Processing', 'Laboratory Equipment', 'Quality Control', 'CLIA', 'HIPAA', 'Infection Control'], 'critical');
  add('Healthcare', 'Medical Technician', ['Hematology', 'Chemistry', 'Urinalysis', 'Microbiology', 'Blood Banking', 'Point-of-Care Testing'], 'high');
  add('Healthcare', 'Medical Technician', ['LIS', 'Calibration', 'Maintenance', 'Troubleshooting', 'Proficiency Testing'], 'medium');
  add('Healthcare', 'Medical Technician', ['Training', 'SOPs', 'Inventory Management', 'Safety Protocols'], 'low');

  add('Healthcare', 'Healthcare Administrator', ['Healthcare Operations', 'Budget Management', 'Regulatory Compliance', 'Joint Commission', 'CMS', 'HIPAA', 'Quality Improvement'], 'critical');
  add('Healthcare', 'Healthcare Administrator', ['Strategic Planning', 'Revenue Cycle', 'Patient Satisfaction', 'Staffing', 'Credentialing', 'Accreditation'], 'high');
  add('Healthcare', 'Healthcare Administrator', ['EHR Implementation', 'Policy Development', 'Risk Management', 'Performance Metrics', 'Lean Healthcare'], 'medium');
  add('Healthcare', 'Healthcare Administrator', ['Community Relations', 'Board Reporting', 'Grant Management', 'Fundraising'], 'low');

  add('Healthcare', 'EMT/Paramedic', ['BLS', 'ACLS', 'PALS', 'ITLS', 'Patient Assessment', 'Airway Management', 'Cardiac Monitoring', 'Trauma Care'], 'critical');
  add('Healthcare', 'EMT/Paramedic', ['IV Access', 'Medication Administration', 'Intubation', 'Defibrillation', 'Splinting', 'Spinal Immobilization'], 'high');
  add('Healthcare', 'EMT/Paramedic', ['ePCR', 'Radio Communication', 'Triage', 'Scene Safety', 'Hazmat Awareness'], 'medium');
  add('Healthcare', 'EMT/Paramedic', ['Community Education', 'CPR Instruction', 'Equipment Maintenance', 'Vehicle Check'], 'low');

  add('Healthcare', 'Physical Therapist', ['Patient Assessment', 'Treatment Planning', 'Manual Therapy', 'Therapeutic Exercise', 'Gait Training', 'Balance Training', 'Pain Management'], 'critical');
  add('Healthcare', 'Physical Therapist', ['Orthopedic Rehabilitation', 'Neurological Rehabilitation', 'Sports Medicine', 'Post-Surgical', 'Aquatic Therapy'], 'high');
  add('Healthcare', 'Physical Therapist', ['EMR Documentation', 'Insurance Authorization', 'Outcome Measures', 'Evidence-Based Practice'], 'medium');
  add('Healthcare', 'Physical Therapist', ['Patient Education', 'Home Exercise Programs', 'Ergonomic Assessment', 'Wellness Programs'], 'low');

  add('Healthcare', 'Medical Records', ['Health Information Management', 'ICD-10 Coding', 'CPT Coding', 'Medical Terminology', 'HIPAA Compliance', 'Release of Information'], 'critical');
  add('Healthcare', 'Medical Records', ['Epic', 'Cerner', 'Meditech', 'Document Imaging', 'Chart Deficiency', 'Audit'], 'high');
  add('Healthcare', 'Medical Records', ['Data Integrity', 'Record Retention', 'Privacy', 'Consent Management', 'ROI Processing'], 'medium');
  add('Healthcare', 'Medical Records', ['Training', 'Policy Development', 'Committee Support', 'Regulatory Updates'], 'low');

  add('Healthcare', 'Pharmacist', ['Medication Dispensing', 'Drug Interactions', 'Pharmacology', 'Compounding', 'Patient Counseling', 'Prescription Verification'], 'critical');
  add('Healthcare', 'Pharmacist', ['Formulary Management', 'Clinical Pharmacy', 'Medication Therapy Management', 'Immunizations', 'DEA Compliance'], 'high');
  add('Healthcare', 'Pharmacist', ['Pharmacy Information Systems', 'Inventory Management', 'Quality Assurance', 'Medication Safety'], 'medium');
  add('Healthcare', 'Pharmacist', ['Staff Supervision', 'Residency Training', 'Drug Utilization Review', 'P&T Committee'], 'low');

  add('Healthcare', 'Clinical Research', ['GCP', 'ICH Guidelines', 'IRB', 'Protocol Development', 'Informed Consent', 'Adverse Event Reporting', 'Data Collection'], 'critical');
  add('Healthcare', 'Clinical Research', ['Clinical Trials', 'CRF', 'EDC Systems', 'Regulatory Submissions', 'FDA', 'Study Coordination'], 'high');
  add('Healthcare', 'Clinical Research', ['SAS', 'SPSS', 'Statistical Analysis', 'Literature Review', 'Manuscript Preparation'], 'medium');
  add('Healthcare', 'Clinical Research', ['Grant Writing', 'Budget Management', 'Vendor Oversight', 'Site Monitoring'], 'low');

  add('Healthcare', 'Health IT', ['Epic', 'Cerner', 'EHR Implementation', 'HL7', 'FHIR', 'Interoperability', 'Clinical Informatics'], 'critical');
  add('Healthcare', 'Health IT', ['SQL', 'Crystal Reports', 'System Configuration', 'Workflow Analysis', 'Interface Management'], 'high');
  add('Healthcare', 'Health IT', ['HIPAA Security', 'Meaningful Use', 'MIPS', 'Cybersecurity', 'Disaster Recovery'], 'medium');
  add('Healthcare', 'Health IT', ['Change Management', 'Training', 'Help Desk', 'Vendor Management', 'Project Management'], 'low');

  // ---- FINANCE/BANKING (40+ rows) ----

  add('Finance/Banking', 'Financial Analyst', ['Financial Modeling', 'Excel', 'Valuation', 'DCF', 'Financial Statements', 'Budgeting', 'Forecasting', 'Variance Analysis'], 'critical');
  add('Finance/Banking', 'Financial Analyst', ['Bloomberg', 'Capital IQ', 'FactSet', 'PowerPoint', 'Presentation Skills', 'Data Visualization'], 'high');
  add('Finance/Banking', 'Financial Analyst', ['SQL', 'Python', 'Tableau', 'Power BI', 'Macros', 'VBA', 'Financial Analysis'], 'medium');
  add('Finance/Banking', 'Financial Analyst', ['Industry Research', 'Competitive Analysis', 'Strategic Planning', 'M&A Support'], 'low');

  add('Finance/Banking', 'Accountant', ['GAAP', 'Financial Reporting', 'General Ledger', 'Accounts Payable', 'Accounts Receivable', 'Journal Entries', 'Reconciliation'], 'critical');
  add('Finance/Banking', 'Accountant', ['QuickBooks', 'SAP', 'Oracle', 'NetSuite', 'Month-End Close', 'Year-End Close', 'CPA'], 'high');
  add('Finance/Banking', 'Accountant', ['Tax Preparation', 'Payroll', 'Fixed Assets', 'Depreciation', 'Accruals', 'Intercompany'], 'medium');
  add('Finance/Banking', 'Accountant', ['Audit Support', 'Internal Controls', 'Process Improvement', 'ERP Implementation'], 'low');

  add('Finance/Banking', 'Risk Analyst', ['Risk Management', 'Quantitative Analysis', 'VaR', 'Stress Testing', 'Basel III', 'Credit Risk', 'Market Risk', 'Operational Risk'], 'critical');
  add('Finance/Banking', 'Risk Analyst', ['SAS', 'Python', 'R', 'MATLAB', 'Monte Carlo Simulation', 'Statistical Modeling', 'Scenario Analysis'], 'high');
  add('Finance/Banking', 'Risk Analyst', ['Regulatory Reporting', 'CCAR', 'DFAST', 'Model Validation', 'Risk Appetite'], 'medium');
  add('Finance/Banking', 'Risk Analyst', ['Documentation', 'Stakeholder Communication', 'Governance', 'Policy Development'], 'low');

  add('Finance/Banking', 'Compliance Officer', ['Regulatory Compliance', 'AML', 'KYC', 'BSA', 'SOX', 'Dodd-Frank', 'FINRA', 'SEC', 'OFAC'], 'critical');
  add('Finance/Banking', 'Compliance Officer', ['Risk Assessment', 'Audit', 'Policy Development', 'Training', 'Monitoring', 'Suspicious Activity Reports'], 'high');
  add('Finance/Banking', 'Compliance Officer', ['Compliance Management Systems', 'Regulatory Filings', 'Consent Orders', 'Remediation'], 'medium');
  add('Finance/Banking', 'Compliance Officer', ['Board Reporting', 'Vendor Due Diligence', 'Ethics Program', 'Whistleblower'], 'low');

  add('Finance/Banking', 'Investment Banker', ['M&A', 'IPO', 'Debt Capital Markets', 'Equity Capital Markets', 'Valuation', 'Financial Modeling', 'Due Diligence'], 'critical');
  add('Finance/Banking', 'Investment Banker', ['Pitch Books', 'Deal Structuring', 'Leveraged Finance', 'Syndication', 'Bloomberg', 'Capital IQ'], 'high');
  add('Finance/Banking', 'Investment Banker', ['Client Relationship Management', 'Industry Analysis', 'Comparable Analysis', 'Precedent Transactions'], 'medium');
  add('Finance/Banking', 'Investment Banker', ['Cross-Border Transactions', 'Regulatory Approval', 'Integration Planning', 'Fairness Opinion'], 'low');

  add('Finance/Banking', 'Insurance Underwriter', ['Risk Assessment', 'Underwriting Guidelines', 'Policy Analysis', 'Loss Ratio', 'Premium Calculation', 'Actuarial Data'], 'critical');
  add('Finance/Banking', 'Insurance Underwriter', ['Commercial Lines', 'Personal Lines', 'Reinsurance', 'Claims Analysis', 'Coverage Determination'], 'high');
  add('Finance/Banking', 'Insurance Underwriter', ['Guidewire', 'Duck Creek', 'Policy Administration', 'Regulatory Compliance', 'State Filing'], 'medium');
  add('Finance/Banking', 'Insurance Underwriter', ['Broker Relations', 'Portfolio Management', 'Market Analysis', 'Training'], 'low');

  add('Finance/Banking', 'Auditor', ['GAAS', 'PCAOB', 'Internal Controls', 'Risk Assessment', 'Substantive Testing', 'Sampling', 'CPA'], 'critical');
  add('Finance/Banking', 'Auditor', ['SOX Compliance', 'IT Audit', 'Fraud Detection', 'Data Analytics', 'Workpaper Documentation'], 'high');
  add('Finance/Banking', 'Auditor', ['ACL', 'IDEA', 'TeamMate', 'Audit Management Software', 'Continuous Auditing'], 'medium');
  add('Finance/Banking', 'Auditor', ['Management Letter', 'Board Presentation', 'Remediation Tracking', 'Follow-Up'], 'low');

  add('Finance/Banking', 'Treasury', ['Cash Management', 'Liquidity Management', 'FX Risk', 'Interest Rate Risk', 'Hedging', 'Bank Relationships'], 'critical');
  add('Finance/Banking', 'Treasury', ['Treasury Management Systems', 'Kyriba', 'SAP Treasury', 'Wire Transfers', 'Cash Forecasting'], 'high');
  add('Finance/Banking', 'Treasury', ['Debt Management', 'Investment Portfolio', 'Credit Facilities', 'Covenant Compliance'], 'medium');
  add('Finance/Banking', 'Treasury', ['Board Reporting', 'Policy Development', 'Vendor Evaluation', 'Process Automation'], 'low');

  add('Finance/Banking', 'Financial Planner', ['Financial Planning', 'Retirement Planning', 'Investment Management', 'Tax Planning', 'Estate Planning', 'CFP'], 'critical');
  add('Finance/Banking', 'Financial Planner', ['Portfolio Management', 'Asset Allocation', 'Risk Tolerance', 'Insurance Planning', 'Education Planning'], 'high');
  add('Finance/Banking', 'Financial Planner', ['CRM', 'Financial Planning Software', 'MoneyGuidePro', 'eMoney', 'Compliance'], 'medium');
  add('Finance/Banking', 'Financial Planner', ['Client Acquisition', 'Referral Networks', 'Seminar Presentations', 'Community Engagement'], 'low');

  add('Finance/Banking', 'Bank Manager', ['Branch Operations', 'Sales Management', 'Customer Service', 'Loan Origination', 'Deposit Growth', 'Revenue Targets'], 'critical');
  add('Finance/Banking', 'Bank Manager', ['Staff Management', 'Training', 'Performance Reviews', 'Regulatory Compliance', 'Audit Preparation'], 'high');
  add('Finance/Banking', 'Bank Manager', ['Community Reinvestment Act', 'Business Development', 'Cross-Selling', 'Relationship Management'], 'medium');
  add('Finance/Banking', 'Bank Manager', ['Market Analysis', 'Budgeting', 'Facility Management', 'Vendor Relations'], 'low');

  // ---- MANUFACTURING (35+ rows) ----

  add('Manufacturing', 'Production Manager', ['Lean Manufacturing', 'Six Sigma', 'Production Planning', 'Scheduling', 'Inventory Management', 'KPIs', 'OEE', 'Throughput'], 'critical');
  add('Manufacturing', 'Production Manager', ['ERP', 'SAP', 'Oracle', 'MRP', 'Capacity Planning', 'Workforce Management', 'Shift Management'], 'high');
  add('Manufacturing', 'Production Manager', ['Continuous Improvement', 'Root Cause Analysis', '8D', 'Corrective Action', 'Preventive Action'], 'medium');
  add('Manufacturing', 'Production Manager', ['Budget Management', 'Capital Projects', 'Union Relations', 'Change Management'], 'low');

  add('Manufacturing', 'Quality Engineer', ['ISO 9001', 'Six Sigma', 'SPC', 'FMEA', 'Root Cause Analysis', 'CAPA', 'Auditing', 'GMP'], 'critical');
  add('Manufacturing', 'Quality Engineer', ['Inspection', 'CMM', 'Metrology', 'First Article', 'PPAP', 'APQP', 'Control Plans'], 'high');
  add('Manufacturing', 'Quality Engineer', ['Minitab', 'Quality Management Systems', 'Supplier Quality', 'Customer Complaints'], 'medium');
  add('Manufacturing', 'Quality Engineer', ['Training', 'Documentation', 'Regulatory Compliance', 'Process Validation'], 'low');

  add('Manufacturing', 'Maintenance Technician', ['Preventive Maintenance', 'Troubleshooting', 'Electrical', 'Mechanical', 'PLC', 'Hydraulics', 'Pneumatics'], 'critical');
  add('Manufacturing', 'Maintenance Technician', ['CMMS', 'Work Orders', 'Predictive Maintenance', 'Vibration Analysis', 'Thermography'], 'high');
  add('Manufacturing', 'Maintenance Technician', ['Welding', 'Machining', 'Blueprints', 'Schematics', 'Motor Controls', 'VFD'], 'medium');
  add('Manufacturing', 'Maintenance Technician', ['OSHA', 'Lockout/Tagout', 'Safety', 'Inventory Management', 'Parts Ordering'], 'low');

  add('Manufacturing', 'Process Engineer', ['Process Optimization', 'Lean', 'Six Sigma', 'DOE', 'SPC', 'Value Stream Mapping', 'Cycle Time Reduction'], 'critical');
  add('Manufacturing', 'Process Engineer', ['CAD', 'AutoCAD', 'SolidWorks', 'Simulation', 'Process Flow', 'Work Instructions'], 'high');
  add('Manufacturing', 'Process Engineer', ['Minitab', 'Python', 'Data Analysis', 'Automation', 'Robotics', 'PLC Programming'], 'medium');
  add('Manufacturing', 'Process Engineer', ['Capital Justification', 'Vendor Evaluation', 'Technology Transfer', 'Scale-Up'], 'low');

  add('Manufacturing', 'Supply Chain Manager', ['Procurement', 'Vendor Management', 'Inventory Control', 'Demand Planning', 'S&OP', 'Logistics', 'Warehousing'], 'critical');
  add('Manufacturing', 'Supply Chain Manager', ['SAP', 'Oracle', 'ERP', 'MRP', 'Kanban', 'Just-in-Time', 'Safety Stock'], 'high');
  add('Manufacturing', 'Supply Chain Manager', ['Contract Negotiation', 'Supplier Development', 'Cost Reduction', 'Spend Analysis'], 'medium');
  add('Manufacturing', 'Supply Chain Manager', ['Risk Mitigation', 'Global Sourcing', 'Sustainability', 'Compliance'], 'low');

  add('Manufacturing', 'Lean Manufacturing Specialist', ['Lean', 'Kaizen', '5S', 'Value Stream Mapping', 'Kanban', 'Standard Work', 'TPM', 'Waste Reduction'], 'critical');
  add('Manufacturing', 'Lean Manufacturing Specialist', ['Six Sigma Green Belt', 'Six Sigma Black Belt', 'DMAIC', 'A3 Problem Solving', 'Gemba Walks'], 'high');
  add('Manufacturing', 'Lean Manufacturing Specialist', ['Change Management', 'Training', 'Visual Management', 'Poka-Yoke', 'SMED'], 'medium');
  add('Manufacturing', 'Lean Manufacturing Specialist', ['ROI Analysis', 'Project Management', 'Cross-functional Teams', 'Benchmarking'], 'low');

  add('Manufacturing', 'Safety Manager', ['OSHA', 'Safety Programs', 'Incident Investigation', 'Risk Assessment', 'JSA', 'PPE', 'Safety Training'], 'critical');
  add('Manufacturing', 'Safety Manager', ['OSHA 30', 'OSHA 300 Log', 'Workers Compensation', 'Ergonomics', 'Industrial Hygiene'], 'high');
  add('Manufacturing', 'Safety Manager', ['Auditing', 'Regulatory Compliance', 'Emergency Response', 'Fire Prevention', 'Hazcom'], 'medium');
  add('Manufacturing', 'Safety Manager', ['Culture Development', 'Behavior-Based Safety', 'Metrics Reporting', 'Contractor Safety'], 'low');

  add('Manufacturing', 'Plant Manager', ['Operations Management', 'P&L Responsibility', 'Lean Manufacturing', 'Production Planning', 'Quality Management'], 'critical');
  add('Manufacturing', 'Plant Manager', ['ERP', 'Budget Management', 'Capital Expenditure', 'Workforce Planning', 'Union Relations'], 'high');
  add('Manufacturing', 'Plant Manager', ['Strategic Planning', 'KPI Management', 'Continuous Improvement', 'Environmental Compliance'], 'medium');
  add('Manufacturing', 'Plant Manager', ['Community Relations', 'Succession Planning', 'Organizational Development'], 'low');

  add('Manufacturing', 'Industrial Engineer', ['Time Studies', 'Work Measurement', 'Facility Layout', 'Ergonomics', 'Simulation', 'Lean', 'Six Sigma'], 'critical');
  add('Manufacturing', 'Industrial Engineer', ['AutoCAD', 'Minitab', 'Excel', 'Process Mapping', 'Capacity Analysis', 'Line Balancing'], 'high');
  add('Manufacturing', 'Industrial Engineer', ['Cost Analysis', 'Productivity Improvement', 'Automation', 'Material Handling'], 'medium');
  add('Manufacturing', 'Industrial Engineer', ['Project Management', 'Presentations', 'Cross-functional Collaboration', 'Training'], 'low');

  // ---- GOVERNMENT/FEDERAL (40+ rows) ----

  add('Government/Federal', 'Program Analyst', ['Program Management', 'Budget Analysis', 'Policy Analysis', 'Performance Metrics', 'Federal Budgeting', 'OMB Circular'], 'critical');
  add('Government/Federal', 'Program Analyst', ['Excel', 'Data Analysis', 'Briefings', 'Congressional Reporting', 'Strategic Planning', 'GAO Compliance'], 'high');
  add('Government/Federal', 'Program Analyst', ['Program Evaluation', 'Cost-Benefit Analysis', 'GPRA', 'Performance Improvement', 'Dashboards'], 'medium');
  add('Government/Federal', 'Program Analyst', ['Interagency Coordination', 'Stakeholder Engagement', 'White Papers', 'Policy Drafting'], 'low');

  add('Government/Federal', 'Contract Specialist', ['FAR', 'DFAR', 'Federal Acquisition', 'Contract Administration', 'Source Selection', 'Cost Analysis', 'Negotiation'], 'critical');
  add('Government/Federal', 'Contract Specialist', ['FPDS', 'SAM.gov', 'CPARS', 'Contract Types', 'IDIQ', 'BPA', 'Task Orders', 'Modifications'], 'high');
  add('Government/Federal', 'Contract Specialist', ['Small Business Programs', 'Past Performance Evaluation', 'Market Research', 'Sole Source'], 'medium');
  add('Government/Federal', 'Contract Specialist', ['Protest Resolution', 'Claims', 'Termination', 'Closeout', 'Warrant Authority'], 'low');

  add('Government/Federal', 'Intelligence Analyst', ['Intelligence Analysis', 'All-Source Analysis', 'SIGINT', 'HUMINT', 'GEOINT', 'OSINT', 'TS/SCI', 'Security Clearance'], 'critical');
  add('Government/Federal', 'Intelligence Analyst', ['Briefing', 'Threat Assessment', 'Target Analysis', 'Geospatial Analysis', 'Link Analysis', 'Palantir'], 'high');
  add('Government/Federal', 'Intelligence Analyst', ['Intelligence Community Directives', 'ODNI', 'Counterintelligence', 'Counterterrorism'], 'medium');
  add('Government/Federal', 'Intelligence Analyst', ['Foreign Language', 'Cultural Awareness', 'Writing', 'Critical Thinking', 'Analytic Tradecraft'], 'low');

  add('Government/Federal', 'Policy Analyst', ['Policy Analysis', 'Research', 'Regulatory Analysis', 'Legislation', 'Federal Register', 'Rulemaking'], 'critical');
  add('Government/Federal', 'Policy Analyst', ['Cost-Benefit Analysis', 'Impact Assessment', 'Stakeholder Analysis', 'White Papers', 'Briefing Memos'], 'high');
  add('Government/Federal', 'Policy Analyst', ['Congressional Affairs', 'Public Comment', 'Interagency Coordination', 'FOIA'], 'medium');
  add('Government/Federal', 'Policy Analyst', ['Public Speaking', 'Facilitation', 'Consensus Building', 'Program Evaluation'], 'low');

  add('Government/Federal', 'Budget Analyst', ['Federal Budget Process', 'Appropriations', 'Budget Formulation', 'Budget Execution', 'Financial Management'], 'critical');
  add('Government/Federal', 'Budget Analyst', ['OMB A-11', 'PPBE', 'Continuing Resolution', 'Reprogramming', 'Obligation Tracking'], 'high');
  add('Government/Federal', 'Budget Analyst', ['Excel', 'SAP', 'Financial Systems', 'Forecasting', 'Trend Analysis', 'Variance Analysis'], 'medium');
  add('Government/Federal', 'Budget Analyst', ['Congressional Justification', 'Briefings', 'Audit Support', 'Internal Controls'], 'low');

  add('Government/Federal', 'IT Specialist (GS)', ['NIST', 'FISMA', 'FedRAMP', 'RMF', 'ATO', 'Security Controls', 'System Administration'], 'critical');
  add('Government/Federal', 'IT Specialist (GS)', ['Cloud.gov', 'AWS GovCloud', 'ITIL', 'ServiceNow', 'Active Directory', 'Networking'], 'high');
  add('Government/Federal', 'IT Specialist (GS)', ['Cybersecurity', 'Incident Response', 'Vulnerability Scanning', 'Patching', 'Configuration Management'], 'medium');
  add('Government/Federal', 'IT Specialist (GS)', ['Section 508 Compliance', 'Help Desk', 'Training', 'Documentation', 'Change Management'], 'low');

  add('Government/Federal', 'Human Resources (Federal)', ['Title 5', 'Merit Principles', 'Classification', 'Position Description', 'GS Scale', 'Hiring Authority'], 'critical');
  add('Government/Federal', 'Human Resources (Federal)', ['USA Staffing', 'USAJobs', 'Delegated Examining', 'Merit Promotion', 'Veterans Preference'], 'high');
  add('Government/Federal', 'Human Resources (Federal)', ['Employee Relations', 'Performance Management', 'Labor Relations', 'EEO', 'Reasonable Accommodation'], 'medium');
  add('Government/Federal', 'Human Resources (Federal)', ['Workforce Planning', 'Succession Planning', 'Training and Development', 'Onboarding'], 'low');

  add('Government/Federal', 'Procurement Specialist', ['Federal Procurement', 'FAR', 'Simplified Acquisition', 'Purchase Card', 'Micro-Purchase', 'Market Research'], 'critical');
  add('Government/Federal', 'Procurement Specialist', ['SAM.gov', 'GSA Schedule', 'GWAC', 'BPA', 'Vendor Management', 'Cost Analysis'], 'high');
  add('Government/Federal', 'Procurement Specialist', ['Small Business', 'Set-Aside', 'HUBZone', '8(a)', 'SDVOSB', 'WOSB'], 'medium');
  add('Government/Federal', 'Procurement Specialist', ['Invoice Processing', 'Receipt and Acceptance', 'Property Management', 'Closeout'], 'low');

  add('Government/Federal', 'Security Specialist', ['Security Clearance Processing', 'DCSA', 'e-QIP', 'SF-86', 'Adjudication', 'NISPOM', 'SAP'], 'critical');
  add('Government/Federal', 'Security Specialist', ['Physical Security', 'Personnel Security', 'Industrial Security', 'SCIF Management', 'Access Control'], 'high');
  add('Government/Federal', 'Security Specialist', ['Security Education', 'Insider Threat', 'Counterintelligence', 'Classification Management'], 'medium');
  add('Government/Federal', 'Security Specialist', ['FOCI', 'Foreign Travel Briefings', 'Security Incident Reports', 'Visitor Control'], 'low');

  add('Government/Federal', 'Project Manager (Federal)', ['Project Management', 'PMP', 'Earned Value Management', 'Schedule Management', 'Risk Management', 'Federal IT'], 'critical');
  add('Government/Federal', 'Project Manager (Federal)', ['Agile', 'JIRA', 'MS Project', 'Budget Management', 'Contract Oversight', 'IPT'], 'high');
  add('Government/Federal', 'Project Manager (Federal)', ['CPIC', 'IT Dashboard', 'TechStat', 'Section 508', 'Authority to Operate'], 'medium');
  add('Government/Federal', 'Project Manager (Federal)', ['Stakeholder Management', 'Change Management', 'Lessons Learned', 'Knowledge Management'], 'low');

  // ---- DEFENSE/AEROSPACE (35+ rows) ----

  add('Defense/Aerospace', 'Systems Engineer', ['Systems Engineering', 'Requirements Analysis', 'DOORS', 'V&V', 'Interface Design', 'System Architecture', 'DoD'], 'critical');
  add('Defense/Aerospace', 'Systems Engineer', ['MBSE', 'SysML', 'UML', 'Trade Studies', 'Risk Analysis', 'Configuration Management'], 'high');
  add('Defense/Aerospace', 'Systems Engineer', ['ITAR', 'Security Clearance', 'MIL-STD', 'DO-178', 'DO-254', 'AS9100'], 'medium');
  add('Defense/Aerospace', 'Systems Engineer', ['Technical Reviews', 'CDR', 'PDR', 'SRR', 'Peer Reviews', 'Technical Writing'], 'low');

  add('Defense/Aerospace', 'Program Manager', ['Program Management', 'Earned Value Management', 'IMS', 'Risk Management', 'DoD Acquisition', 'DODI 5000'], 'critical');
  add('Defense/Aerospace', 'Program Manager', ['PMP', 'Budget Management', 'Contract Management', 'Subcontractor Oversight', 'CDRL', 'DID'], 'high');
  add('Defense/Aerospace', 'Program Manager', ['IPT Leadership', 'Customer Relations', 'Milestone Reviews', 'Gate Reviews', 'LRIP'], 'medium');
  add('Defense/Aerospace', 'Program Manager', ['Business Development', 'Proposal Management', 'ITAR', 'Export Control'], 'low');

  add('Defense/Aerospace', 'Test Engineer', ['Test Planning', 'Test Execution', 'Test Procedures', 'Data Analysis', 'Environmental Testing', 'EMI/EMC'], 'critical');
  add('Defense/Aerospace', 'Test Engineer', ['LabVIEW', 'MATLAB', 'Python', 'Test Automation', 'Data Acquisition', 'Instrumentation'], 'high');
  add('Defense/Aerospace', 'Test Engineer', ['MIL-STD-810', 'DO-160', 'Qualification Testing', 'Acceptance Testing', 'Regression Testing'], 'medium');
  add('Defense/Aerospace', 'Test Engineer', ['Failure Analysis', 'Root Cause', 'FRACAS', 'Test Reports', 'Technical Writing'], 'low');

  add('Defense/Aerospace', 'Logistics Analyst', ['Logistics Support Analysis', 'ILS', 'Reliability', 'Maintainability', 'Supportability', 'Supply Chain'], 'critical');
  add('Defense/Aerospace', 'Logistics Analyst', ['Provisioning', 'Technical Manuals', 'Training Development', 'LSAR', 'GEIA-STD-0007'], 'high');
  add('Defense/Aerospace', 'Logistics Analyst', ['Life Cycle Cost', 'Obsolescence Management', 'Configuration Management', 'DMSMS'], 'medium');
  add('Defense/Aerospace', 'Logistics Analyst', ['Depot Maintenance', 'Field Support', 'Spare Parts', 'Warranty Management'], 'low');

  add('Defense/Aerospace', 'Intelligence Officer', ['Intelligence Operations', 'All-Source Analysis', 'Collection Management', 'ISR', 'TS/SCI', 'SAP'], 'critical');
  add('Defense/Aerospace', 'Intelligence Officer', ['Targeting', 'SIGINT', 'GEOINT', 'HUMINT', 'Threat Assessment', 'Battle Damage Assessment'], 'high');
  add('Defense/Aerospace', 'Intelligence Officer', ['DCGS', 'Palantir', 'ArcGIS', 'Analyst Notebook', 'Intelligence Databases'], 'medium');
  add('Defense/Aerospace', 'Intelligence Officer', ['Briefing', 'Report Writing', 'Critical Thinking', 'Foreign Language'], 'low');

  add('Defense/Aerospace', 'Weapons Systems Specialist', ['Weapons Systems', 'Armament', 'Fire Control', 'Guided Munitions', 'Ballistics', 'Ordnance'], 'critical');
  add('Defense/Aerospace', 'Weapons Systems Specialist', ['Technical Manuals', 'Safety Procedures', 'Maintenance', 'Calibration', 'Integration Testing'], 'high');
  add('Defense/Aerospace', 'Weapons Systems Specialist', ['Configuration Management', 'Reliability Analysis', 'FMECA', 'Hazard Analysis'], 'medium');
  add('Defense/Aerospace', 'Weapons Systems Specialist', ['Training Development', 'Field Support', 'Depot Liaison', 'Modification Kits'], 'low');

  add('Defense/Aerospace', 'Avionics Engineer', ['Avionics', 'DO-178C', 'DO-254', 'MIL-STD-1553', 'ARINC 429', 'Flight Software'], 'critical');
  add('Defense/Aerospace', 'Avionics Engineer', ['Embedded Systems', 'FPGA', 'VHDL', 'Verilog', 'Real-Time Systems', 'Safety-Critical'], 'high');
  add('Defense/Aerospace', 'Avionics Engineer', ['Integration Testing', 'Certification', 'FAA', 'Airworthiness', 'Configuration Management'], 'medium');
  add('Defense/Aerospace', 'Avionics Engineer', ['Technical Documentation', 'Requirements Traceability', 'Peer Review', 'Code Review'], 'low');

  add('Defense/Aerospace', 'Flight Test Engineer', ['Flight Test', 'Test Planning', 'Data Reduction', 'Telemetry', 'Flight Dynamics', 'Performance Testing'], 'critical');
  add('Defense/Aerospace', 'Flight Test Engineer', ['MATLAB', 'Python', 'Data Analysis', 'Instrumentation', 'Safety Review', 'Risk Assessment'], 'high');
  add('Defense/Aerospace', 'Flight Test Engineer', ['MIL-STD', 'Test Reports', 'Airworthiness', 'Configuration Control', 'Range Operations'], 'medium');
  add('Defense/Aerospace', 'Flight Test Engineer', ['Pilot Briefings', 'Quick-Look Analysis', 'Anomaly Investigation', 'Technical Writing'], 'low');

  add('Defense/Aerospace', 'Mission Planning Specialist', ['Mission Planning', 'Operations Planning', 'Route Planning', 'Threat Analysis', 'Intelligence Integration'], 'critical');
  add('Defense/Aerospace', 'Mission Planning Specialist', ['PFPS', 'FalconView', 'JMPS', 'GIS', 'Digital Mapping', 'Imagery Analysis'], 'high');
  add('Defense/Aerospace', 'Mission Planning Specialist', ['Briefing', 'Debriefing', 'After-Action Review', 'Lessons Learned', 'Risk Mitigation'], 'medium');
  add('Defense/Aerospace', 'Mission Planning Specialist', ['Cross-functional Coordination', 'Time-Critical Planning', 'Contingency Planning'], 'low');

  // ---- LOGISTICS/SUPPLY CHAIN (30+ rows) ----

  add('Logistics/Supply Chain', 'Logistics Manager', ['Logistics Management', 'Supply Chain', 'Distribution', 'Warehousing', 'Transportation', 'Inventory Management', '3PL'], 'critical');
  add('Logistics/Supply Chain', 'Logistics Manager', ['SAP', 'Oracle', 'WMS', 'TMS', 'ERP', 'Forecasting', 'Demand Planning'], 'high');
  add('Logistics/Supply Chain', 'Logistics Manager', ['KPI Management', 'Cost Reduction', 'Process Improvement', 'Lean', 'Six Sigma'], 'medium');
  add('Logistics/Supply Chain', 'Logistics Manager', ['Vendor Negotiation', 'Contract Management', 'Regulatory Compliance', 'Sustainability'], 'low');

  add('Logistics/Supply Chain', 'Warehouse Manager', ['Warehouse Operations', 'WMS', 'Inventory Control', 'Receiving', 'Shipping', 'Pick/Pack', 'Cycle Counting'], 'critical');
  add('Logistics/Supply Chain', 'Warehouse Manager', ['RF Scanners', 'Barcode', 'Forklift Operations', 'OSHA', 'Safety', 'Labor Management'], 'high');
  add('Logistics/Supply Chain', 'Warehouse Manager', ['Layout Optimization', 'Slotting', 'Cross-Docking', 'Returns Processing', 'Quality Control'], 'medium');
  add('Logistics/Supply Chain', 'Warehouse Manager', ['Budget Management', 'Training', 'Performance Reviews', 'Continuous Improvement'], 'low');

  add('Logistics/Supply Chain', 'Supply Chain Analyst', ['Supply Chain Analytics', 'Demand Forecasting', 'Inventory Optimization', 'S&OP', 'Data Analysis', 'Excel'], 'critical');
  add('Logistics/Supply Chain', 'Supply Chain Analyst', ['SQL', 'Python', 'Tableau', 'Power BI', 'SAP', 'Statistical Analysis', 'Modeling'], 'high');
  add('Logistics/Supply Chain', 'Supply Chain Analyst', ['Cost Analysis', 'Supplier Performance', 'Lead Time Analysis', 'Safety Stock Calculation'], 'medium');
  add('Logistics/Supply Chain', 'Supply Chain Analyst', ['Presentation Skills', 'Report Writing', 'Cross-functional Communication', 'Process Documentation'], 'low');

  add('Logistics/Supply Chain', 'Procurement Specialist', ['Procurement', 'Sourcing', 'Vendor Management', 'RFP', 'RFQ', 'Contract Negotiation', 'Spend Analysis'], 'critical');
  add('Logistics/Supply Chain', 'Procurement Specialist', ['SAP Ariba', 'Coupa', 'Oracle Procurement', 'Category Management', 'Supplier Development'], 'high');
  add('Logistics/Supply Chain', 'Procurement Specialist', ['Cost Reduction', 'TCO Analysis', 'Supplier Auditing', 'Quality Requirements'], 'medium');
  add('Logistics/Supply Chain', 'Procurement Specialist', ['Market Intelligence', 'Risk Management', 'Sustainability', 'Diversity Sourcing'], 'low');

  add('Logistics/Supply Chain', 'Fleet Manager', ['Fleet Management', 'Vehicle Maintenance', 'DOT Compliance', 'Route Optimization', 'Fuel Management'], 'critical');
  add('Logistics/Supply Chain', 'Fleet Manager', ['GPS Tracking', 'Telematics', 'Fleet Management Software', 'CDL', 'FMCSA', 'HOS'], 'high');
  add('Logistics/Supply Chain', 'Fleet Manager', ['Budget Management', 'Lifecycle Analysis', 'Vehicle Acquisition', 'Disposal'], 'medium');
  add('Logistics/Supply Chain', 'Fleet Manager', ['Driver Management', 'Safety Programs', 'Accident Investigation', 'Insurance'], 'low');

  add('Logistics/Supply Chain', 'Inventory Control Specialist', ['Inventory Management', 'Cycle Counting', 'ABC Analysis', 'Min/Max', 'Reorder Points', 'Safety Stock'], 'critical');
  add('Logistics/Supply Chain', 'Inventory Control Specialist', ['WMS', 'ERP', 'SAP', 'Barcode Systems', 'RFID', 'Physical Inventory'], 'high');
  add('Logistics/Supply Chain', 'Inventory Control Specialist', ['Variance Analysis', 'Shrinkage Reduction', 'Obsolescence Management', 'Demand Planning'], 'medium');
  add('Logistics/Supply Chain', 'Inventory Control Specialist', ['SOPs', 'Training', 'Process Improvement', 'Reporting'], 'low');

  add('Logistics/Supply Chain', 'Transportation Manager', ['Transportation Management', 'Freight', 'Carrier Management', 'Route Planning', 'TMS', 'Shipping'], 'critical');
  add('Logistics/Supply Chain', 'Transportation Manager', ['LTL', 'FTL', 'Intermodal', 'Ocean Freight', 'Air Freight', 'Customs', 'Import/Export'], 'high');
  add('Logistics/Supply Chain', 'Transportation Manager', ['Rate Negotiation', 'Claims Management', 'Performance Metrics', 'Compliance'], 'medium');
  add('Logistics/Supply Chain', 'Transportation Manager', ['Sustainability', 'Carbon Footprint', 'Last-Mile Delivery', 'Reverse Logistics'], 'low');

  add('Logistics/Supply Chain', 'APICS/CSCP Professional', ['APICS', 'CSCP', 'CPIM', 'Supply Chain Strategy', 'Operations Management', 'Materials Management'], 'critical');
  add('Logistics/Supply Chain', 'APICS/CSCP Professional', ['Demand Management', 'Master Scheduling', 'Capacity Planning', 'Production Planning'], 'high');

  // ---- EDUCATION (25+ rows) ----

  add('Education', 'Teacher', ['Curriculum Design', 'Lesson Planning', 'Assessment', 'Differentiated Instruction', 'Classroom Management', 'Student Engagement'], 'critical');
  add('Education', 'Teacher', ['IEP', 'State Standards', 'Common Core', 'Formative Assessment', 'Summative Assessment', 'Progress Monitoring'], 'high');
  add('Education', 'Teacher', ['Google Classroom', 'Canvas', 'Blackboard', 'Educational Technology', 'Remote Learning'], 'medium');
  add('Education', 'Teacher', ['Parent Communication', 'Professional Development', 'Mentoring', 'Extracurricular Activities'], 'low');

  add('Education', 'School Administrator', ['School Leadership', 'Budget Management', 'Staff Supervision', 'Curriculum Oversight', 'Student Achievement', 'Data-Driven Decision Making'], 'critical');
  add('Education', 'School Administrator', ['School Improvement Plan', 'Accreditation', 'Title I', 'IDEA', 'FERPA', 'Compliance'], 'high');
  add('Education', 'School Administrator', ['Community Relations', 'Parent Engagement', 'School Board', 'Strategic Planning'], 'medium');
  add('Education', 'School Administrator', ['Grant Writing', 'Fundraising', 'Facility Management', 'Crisis Management'], 'low');

  add('Education', 'Curriculum Developer', ['Curriculum Design', 'Instructional Design', 'Learning Objectives', 'Backward Design', 'Standards Alignment'], 'critical');
  add('Education', 'Curriculum Developer', ['Assessment Design', 'Rubrics', 'Scope and Sequence', 'Textbook Selection', 'Pilot Programs'], 'high');
  add('Education', 'Curriculum Developer', ['LMS', 'SCORM', 'Multimedia Content', 'Accessibility', 'Universal Design for Learning'], 'medium');
  add('Education', 'Curriculum Developer', ['Professional Development', 'Teacher Training', 'Research', 'Data Analysis'], 'low');

  add('Education', 'Training Specialist', ['Training Design', 'Facilitation', 'Needs Assessment', 'Adult Learning Theory', 'Kirkpatrick Model', 'Blended Learning'], 'critical');
  add('Education', 'Training Specialist', ['LMS Administration', 'E-Learning Development', 'Articulate', 'Captivate', 'Video Production'], 'high');
  add('Education', 'Training Specialist', ['Evaluation', 'ROI Analysis', 'Competency Models', 'Performance Improvement'], 'medium');
  add('Education', 'Training Specialist', ['Stakeholder Management', 'Vendor Management', 'Budget Management', 'Project Management'], 'low');

  add('Education', 'Instructional Designer', ['Instructional Design', 'ADDIE', 'SAM', 'Learning Objectives', 'Storyboarding', 'E-Learning'], 'critical');
  add('Education', 'Instructional Designer', ['Articulate Storyline', 'Rise', 'Captivate', 'Camtasia', 'HTML5', 'SCORM', 'xAPI'], 'high');
  add('Education', 'Instructional Designer', ['Graphic Design', 'Video Editing', 'Accessibility', 'Section 508', 'UX Design'], 'medium');
  add('Education', 'Instructional Designer', ['Project Management', 'SME Collaboration', 'Quality Assurance', 'Pilot Testing'], 'low');

  add('Education', 'Academic Advisor', ['Academic Advising', 'Degree Planning', 'Student Support', 'Retention', 'Transfer Articulation'], 'critical');
  add('Education', 'Academic Advisor', ['Student Information Systems', 'Banner', 'PeopleSoft', 'DegreeWorks', 'FERPA'], 'high');
  add('Education', 'Academic Advisor', ['Career Counseling', 'Crisis Intervention', 'Referral Services', 'Multicultural Competency'], 'medium');

  add('Education', 'Special Education Teacher', ['IEP Development', 'Special Education Law', 'IDEA', 'Behavior Intervention Plans', 'Accommodations', 'Modifications'], 'critical');
  add('Education', 'Special Education Teacher', ['Applied Behavior Analysis', 'Progress Monitoring', 'Assistive Technology', 'Transition Planning', 'Functional Behavior Assessment'], 'high');
  add('Education', 'Special Education Teacher', ['Collaboration', 'Co-Teaching', 'Due Process', 'Compliance', 'Documentation'], 'medium');

  // ---- ENERGY/UTILITIES (25+ rows) ----

  add('Energy/Utilities', 'Power Plant Operator', ['Power Generation', 'Turbine Operations', 'Boiler Operations', 'Control Room', 'NERC Compliance', 'Grid Operations'], 'critical');
  add('Energy/Utilities', 'Power Plant Operator', ['SCADA', 'DCS', 'PLC', 'Electrical Distribution', 'Heat Rate', 'Emissions Monitoring'], 'high');
  add('Energy/Utilities', 'Power Plant Operator', ['Lockout/Tagout', 'Safety', 'Emergency Procedures', 'Environmental Compliance'], 'medium');
  add('Energy/Utilities', 'Power Plant Operator', ['Training', 'SOPs', 'Shift Supervision', 'Equipment Inspection'], 'low');

  add('Energy/Utilities', 'Electrical Engineer', ['Power Systems', 'Circuit Design', 'Protection and Control', 'Substation Design', 'Transmission', 'Distribution'], 'critical');
  add('Energy/Utilities', 'Electrical Engineer', ['AutoCAD', 'ETAP', 'SKM', 'PSCAD', 'MATLAB', 'NEC', 'NESC', 'IEEE Standards'], 'high');
  add('Energy/Utilities', 'Electrical Engineer', ['Load Flow', 'Short Circuit', 'Relay Coordination', 'Arc Flash', 'Grounding'], 'medium');
  add('Energy/Utilities', 'Electrical Engineer', ['PE License', 'Project Management', 'Specifications', 'Vendor Evaluation'], 'low');

  add('Energy/Utilities', 'Environmental Specialist', ['Environmental Compliance', 'EPA', 'NEPA', 'Clean Air Act', 'Clean Water Act', 'RCRA', 'Permitting'], 'critical');
  add('Energy/Utilities', 'Environmental Specialist', ['Environmental Impact Assessment', 'Remediation', 'Air Quality', 'Water Quality', 'Waste Management'], 'high');
  add('Energy/Utilities', 'Environmental Specialist', ['Sampling', 'Laboratory Analysis', 'GIS', 'Environmental Monitoring', 'Reporting'], 'medium');
  add('Energy/Utilities', 'Environmental Specialist', ['Sustainability', 'ESG Reporting', 'Stakeholder Engagement', 'Public Comment'], 'low');

  add('Energy/Utilities', 'Safety Manager (Energy)', ['OSHA', 'Safety Management', 'Incident Investigation', 'Root Cause Analysis', 'BBS', 'Safety Culture'], 'critical');
  add('Energy/Utilities', 'Safety Manager (Energy)', ['NERC CIP', 'PSM', 'Risk Assessment', 'Job Safety Analysis', 'Emergency Response', 'HAZWOPER'], 'high');
  add('Energy/Utilities', 'Safety Manager (Energy)', ['Auditing', 'Training', 'PPE Programs', 'Contractor Safety', 'DOT Compliance'], 'medium');

  add('Energy/Utilities', 'Pipeline Operator', ['Pipeline Operations', 'PHMSA', 'DOT', 'Integrity Management', 'SCADA', 'Leak Detection'], 'critical');
  add('Energy/Utilities', 'Pipeline Operator', ['Cathodic Protection', 'Corrosion Control', 'Valve Operations', 'Metering', 'Gas Measurement'], 'high');
  add('Energy/Utilities', 'Pipeline Operator', ['Emergency Response', 'Public Awareness', 'ROW Management', 'Environmental Compliance'], 'medium');

  add('Energy/Utilities', 'Renewable Energy Specialist', ['Solar', 'Wind', 'Energy Storage', 'Grid Integration', 'Power Purchase Agreements', 'Renewable Portfolio Standards'], 'critical');
  add('Energy/Utilities', 'Renewable Energy Specialist', ['PVSyst', 'Homer', 'SAM', 'Interconnection', 'Net Metering', 'Incentive Programs'], 'high');
  add('Energy/Utilities', 'Renewable Energy Specialist', ['Project Development', 'Permitting', 'Environmental Review', 'Community Engagement'], 'medium');
  add('Energy/Utilities', 'Renewable Energy Specialist', ['Policy Analysis', 'Market Analysis', 'Financial Modeling', 'Grant Applications'], 'low');

  add('Energy/Utilities', 'Nuclear Engineer', ['Nuclear Engineering', 'Reactor Operations', 'NRC', 'Radiation Protection', 'Nuclear Safety', 'Criticality Safety'], 'critical');
  add('Energy/Utilities', 'Nuclear Engineer', ['ALARA', 'Dosimetry', 'Decommissioning', 'Fuel Handling', 'Reactor Physics', 'Thermal Hydraulics'], 'high');
  add('Energy/Utilities', 'Nuclear Engineer', ['Quality Assurance', 'Configuration Management', '10 CFR', 'Technical Specifications'], 'medium');

  // ---- CONSTRUCTION (25+ rows) ----

  add('Construction', 'Project Manager (Construction)', ['Project Management', 'PMP', 'Construction Management', 'Scheduling', 'Budget Management', 'Subcontractor Management'], 'critical');
  add('Construction', 'Project Manager (Construction)', ['MS Project', 'Primavera P6', 'Procore', 'Bluebeam', 'RFI', 'Submittals', 'Change Orders'], 'high');
  add('Construction', 'Project Manager (Construction)', ['Contract Administration', 'Risk Management', 'Quality Control', 'Safety', 'OSHA 30'], 'medium');
  add('Construction', 'Project Manager (Construction)', ['Client Relations', 'Business Development', 'Proposal Writing', 'Team Leadership'], 'low');

  add('Construction', 'Site Supervisor', ['Site Management', 'Daily Reports', 'Crew Supervision', 'Safety', 'Quality Control', 'Blueprint Reading'], 'critical');
  add('Construction', 'Site Supervisor', ['OSHA 30', 'First Aid/CPR', 'Scheduling', 'Material Coordination', 'Subcontractor Oversight'], 'high');
  add('Construction', 'Site Supervisor', ['Concrete', 'Framing', 'Structural Steel', 'MEP Coordination', 'Punch List'], 'medium');
  add('Construction', 'Site Supervisor', ['Documentation', 'Progress Photos', 'Client Communication', 'Problem Solving'], 'low');

  add('Construction', 'Estimator', ['Estimating', 'Quantity Takeoff', 'Cost Analysis', 'Bid Preparation', 'Blueprint Reading', 'RSMeans'], 'critical');
  add('Construction', 'Estimator', ['Bluebeam', 'PlanSwift', 'On-Screen Takeoff', 'Excel', 'Timberline', 'Sage'], 'high');
  add('Construction', 'Estimator', ['Subcontractor Pricing', 'Vendor Quotes', 'Value Engineering', 'Scope Review'], 'medium');
  add('Construction', 'Estimator', ['Presentation Skills', 'Client Meetings', 'Market Analysis', 'Historical Data Analysis'], 'low');

  add('Construction', 'Safety Manager (Construction)', ['OSHA 30', 'Safety Programs', 'Incident Investigation', 'Safety Training', 'JSA', 'PPE', 'Fall Protection'], 'critical');
  add('Construction', 'Safety Manager (Construction)', ['EM 385-1-1', 'OSHA 300 Log', 'Workers Compensation', 'Site Safety Plans', 'Toolbox Talks'], 'high');
  add('Construction', 'Safety Manager (Construction)', ['Regulatory Compliance', 'Environmental', 'Silica', 'Confined Space', 'Excavation Safety'], 'medium');

  add('Construction', 'Civil Engineer', ['Civil Engineering', 'AutoCAD', 'Civil 3D', 'Grading', 'Drainage', 'Stormwater', 'Site Design'], 'critical');
  add('Construction', 'Civil Engineer', ['PE License', 'Surveying', 'Geotechnical', 'Structural', 'Transportation', 'Hydrology'], 'high');
  add('Construction', 'Civil Engineer', ['Permitting', 'Environmental Compliance', 'SWPPP', 'Erosion Control', 'Specifications'], 'medium');
  add('Construction', 'Civil Engineer', ['Project Management', 'Client Coordination', 'Field Inspection', 'Construction Administration'], 'low');

  add('Construction', 'Electrician', ['Electrical Installation', 'NEC', 'Conduit Bending', 'Wire Pulling', 'Panel Installation', 'Motor Controls'], 'critical');
  add('Construction', 'Electrician', ['Blueprint Reading', 'Troubleshooting', 'PLC', 'VFD', 'Fire Alarm', 'Low Voltage'], 'high');
  add('Construction', 'Electrician', ['OSHA 10', 'Lockout/Tagout', 'Arc Flash', 'Grounding', 'Testing'], 'medium');

  add('Construction', 'HVAC Technician', ['HVAC', 'Refrigeration', 'Air Conditioning', 'Heating', 'Ventilation', 'EPA 608', 'System Commissioning'], 'critical');
  add('Construction', 'HVAC Technician', ['Troubleshooting', 'Controls', 'BMS', 'Ductwork', 'Piping', 'Load Calculations'], 'high');
  add('Construction', 'HVAC Technician', ['Preventive Maintenance', 'Energy Efficiency', 'Indoor Air Quality', 'Code Compliance'], 'medium');

  add('Construction', 'Heavy Equipment Operator', ['Excavator', 'Bulldozer', 'Loader', 'Grader', 'Crane', 'Backhoe', 'Forklift'], 'critical');
  add('Construction', 'Heavy Equipment Operator', ['GPS Grading', 'Site Preparation', 'Earthwork', 'Trenching', 'Compaction'], 'high');
  add('Construction', 'Heavy Equipment Operator', ['OSHA', 'Pre-Operation Inspection', 'Safety', 'Maintenance', 'CDL'], 'medium');

  // ---- CONSULTING (20+ rows) ----

  add('Consulting', 'Management Consultant', ['Strategy', 'Business Analysis', 'Change Management', 'Stakeholder Management', 'Process Improvement'], 'critical');
  add('Consulting', 'Management Consultant', ['PowerPoint', 'Excel', 'Data Analysis', 'Market Research', 'Financial Analysis', 'Benchmarking'], 'high');
  add('Consulting', 'Management Consultant', ['Client Engagement', 'Workshop Facilitation', 'Executive Presentations', 'Hypothesis-Driven', 'MECE'], 'medium');
  add('Consulting', 'Management Consultant', ['Thought Leadership', 'Business Development', 'Proposal Writing', 'Mentoring'], 'low');

  add('Consulting', 'Strategy Consultant', ['Corporate Strategy', 'Growth Strategy', 'Market Entry', 'Competitive Analysis', 'Due Diligence', 'M&A Advisory'], 'critical');
  add('Consulting', 'Strategy Consultant', ['Financial Modeling', 'Market Sizing', 'Industry Analysis', 'Value Chain Analysis', 'Scenario Planning'], 'high');
  add('Consulting', 'Strategy Consultant', ['Executive Communication', 'Board Presentations', 'Stakeholder Alignment', 'Implementation Planning'], 'medium');
  add('Consulting', 'Strategy Consultant', ['Thought Leadership', 'Publications', 'Conference Speaking', 'Client Development'], 'low');

  add('Consulting', 'IT Consultant', ['IT Strategy', 'Digital Transformation', 'Systems Integration', 'Enterprise Architecture', 'Cloud Migration'], 'critical');
  add('Consulting', 'IT Consultant', ['Agile', 'DevOps', 'ERP Implementation', 'CRM', 'Salesforce', 'SAP', 'Workday'], 'high');
  add('Consulting', 'IT Consultant', ['Requirements Gathering', 'Business Process Mapping', 'Testing', 'Training', 'Change Management'], 'medium');
  add('Consulting', 'IT Consultant', ['RFP Development', 'Vendor Selection', 'Contract Negotiation', 'Project Management'], 'low');

  add('Consulting', 'HR Consultant', ['HR Strategy', 'Organizational Design', 'Talent Management', 'Compensation', 'Benefits', 'HR Compliance'], 'critical');
  add('Consulting', 'HR Consultant', ['Workforce Planning', 'Performance Management', 'Leadership Development', 'Succession Planning', 'Employee Engagement'], 'high');
  add('Consulting', 'HR Consultant', ['HRIS', 'Workday', 'SAP SuccessFactors', 'ADP', 'Change Management'], 'medium');
  add('Consulting', 'HR Consultant', ['Training Design', 'Facilitation', 'Diversity and Inclusion', 'Culture Assessment'], 'low');

  add('Consulting', 'Operations Consultant', ['Operations Management', 'Process Optimization', 'Lean', 'Six Sigma', 'Supply Chain', 'Manufacturing'], 'critical');
  add('Consulting', 'Operations Consultant', ['Value Stream Mapping', 'Kaizen', 'Process Mining', 'Data Analytics', 'KPI Development'], 'high');
  add('Consulting', 'Operations Consultant', ['Cost Reduction', 'Capacity Planning', 'Warehouse Optimization', 'Quality Management'], 'medium');
  add('Consulting', 'Operations Consultant', ['Change Management', 'Training', 'Sustainability', 'Digital Operations'], 'low');

  // ---- MARKETING/COMMUNICATIONS (20+ rows) ----

  add('Marketing/Communications', 'Marketing Manager', ['Marketing Strategy', 'Brand Management', 'Campaign Management', 'Budget Management', 'Marketing Analytics', 'ROI'], 'critical');
  add('Marketing/Communications', 'Marketing Manager', ['Google Analytics', 'HubSpot', 'Salesforce', 'Marketing Automation', 'CRM', 'A/B Testing'], 'high');
  add('Marketing/Communications', 'Marketing Manager', ['Cross-functional Leadership', 'Agency Management', 'Event Marketing', 'Product Launches'], 'medium');
  add('Marketing/Communications', 'Marketing Manager', ['Market Research', 'Competitive Intelligence', 'Customer Segmentation', 'Positioning'], 'low');

  add('Marketing/Communications', 'Content Creator', ['Content Strategy', 'Copywriting', 'Blog Writing', 'Social Media Content', 'Video Content', 'Content Calendar'], 'critical');
  add('Marketing/Communications', 'Content Creator', ['SEO Writing', 'WordPress', 'CMS', 'Adobe Creative Suite', 'Canva', 'Photography'], 'high');
  add('Marketing/Communications', 'Content Creator', ['Analytics', 'Engagement Metrics', 'Brand Voice', 'Storytelling', 'Interviewing'], 'medium');
  add('Marketing/Communications', 'Content Creator', ['Project Management', 'Freelancer Management', 'Editorial Guidelines', 'Style Guides'], 'low');

  add('Marketing/Communications', 'SEO Specialist', ['SEO', 'Keyword Research', 'On-Page SEO', 'Off-Page SEO', 'Technical SEO', 'Link Building', 'Google Analytics'], 'critical');
  add('Marketing/Communications', 'SEO Specialist', ['Google Search Console', 'Ahrefs', 'SEMrush', 'Moz', 'Screaming Frog', 'Schema Markup'], 'high');
  add('Marketing/Communications', 'SEO Specialist', ['Content Optimization', 'Site Architecture', 'Page Speed', 'Mobile Optimization', 'Core Web Vitals'], 'medium');
  add('Marketing/Communications', 'SEO Specialist', ['Reporting', 'Competitor Analysis', 'Local SEO', 'International SEO'], 'low');

  add('Marketing/Communications', 'Social Media Manager', ['Social Media Strategy', 'Content Creation', 'Community Management', 'Social Media Analytics', 'Paid Social'], 'critical');
  add('Marketing/Communications', 'Social Media Manager', ['Facebook', 'Instagram', 'LinkedIn', 'Twitter/X', 'TikTok', 'YouTube', 'Hootsuite', 'Sprout Social'], 'high');
  add('Marketing/Communications', 'Social Media Manager', ['Influencer Marketing', 'Social Listening', 'Crisis Management', 'Brand Advocacy'], 'medium');

  add('Marketing/Communications', 'Brand Manager', ['Brand Strategy', 'Brand Guidelines', 'Brand Positioning', 'Market Research', 'Consumer Insights', 'Competitive Analysis'], 'critical');
  add('Marketing/Communications', 'Brand Manager', ['Product Marketing', 'Packaging', 'Go-to-Market', 'P&L Management', 'Agency Management'], 'high');
  add('Marketing/Communications', 'Brand Manager', ['Trade Marketing', 'Shopper Marketing', 'Innovation Pipeline', 'Consumer Testing'], 'medium');

  add('Marketing/Communications', 'PR Specialist', ['Public Relations', 'Media Relations', 'Press Releases', 'Crisis Communications', 'Media Monitoring', 'Spokesperson'], 'critical');
  add('Marketing/Communications', 'PR Specialist', ['Cision', 'Meltwater', 'Muck Rack', 'Event Planning', 'Press Conferences', 'Media Kit'], 'high');
  add('Marketing/Communications', 'PR Specialist', ['Thought Leadership', 'Ghostwriting', 'Internal Communications', 'Social Media'], 'medium');

  add('Marketing/Communications', 'Digital Marketing Manager', ['Digital Marketing', 'PPC', 'Display Advertising', 'Email Marketing', 'Marketing Automation', 'Conversion Rate Optimization'], 'critical');
  add('Marketing/Communications', 'Digital Marketing Manager', ['Google Ads', 'Facebook Ads', 'Programmatic', 'DMP', 'CDP', 'Retargeting'], 'high');
  add('Marketing/Communications', 'Digital Marketing Manager', ['Landing Pages', 'UX Optimization', 'Attribution Modeling', 'Customer Journey Mapping'], 'medium');

  // ---- NON-PROFIT (20+ rows) ----

  add('Non-Profit', 'Program Manager (Non-Profit)', ['Program Management', 'Grant Management', 'Outcomes Measurement', 'Logic Models', 'Theory of Change', 'Stakeholder Engagement'], 'critical');
  add('Non-Profit', 'Program Manager (Non-Profit)', ['Budget Management', 'Reporting', 'Compliance', 'Monitoring and Evaluation', 'Data Collection'], 'high');
  add('Non-Profit', 'Program Manager (Non-Profit)', ['Staff Supervision', 'Volunteer Management', 'Community Partnerships', 'Capacity Building'], 'medium');
  add('Non-Profit', 'Program Manager (Non-Profit)', ['Strategic Planning', 'Board Relations', 'Advocacy', 'Policy Development'], 'low');

  add('Non-Profit', 'Grant Writer', ['Grant Writing', 'Proposal Development', 'Research', 'Budget Narrative', 'LOI', 'Federal Grants', 'Foundation Grants'], 'critical');
  add('Non-Profit', 'Grant Writer', ['Grants.gov', 'Foundation Directory', 'Prospect Research', 'Funder Relations', 'Reporting'], 'high');
  add('Non-Profit', 'Grant Writer', ['Data Analysis', 'Outcomes Measurement', 'Storytelling', 'Editing', 'Compliance'], 'medium');
  add('Non-Profit', 'Grant Writer', ['Database Management', 'Calendar Management', 'Team Collaboration', 'Fundraising Strategy'], 'low');

  add('Non-Profit', 'Fundraiser', ['Fundraising', 'Donor Relations', 'Major Gifts', 'Annual Fund', 'Capital Campaign', 'Planned Giving'], 'critical');
  add('Non-Profit', 'Fundraiser', ['CRM', 'Raiser\'s Edge', 'Salesforce', 'DonorPerfect', 'Event Planning', 'Direct Mail'], 'high');
  add('Non-Profit', 'Fundraiser', ['Prospect Research', 'Cultivation', 'Stewardship', 'Board Engagement', 'Volunteer Recruitment'], 'medium');
  add('Non-Profit', 'Fundraiser', ['Marketing', 'Social Media', 'Crowdfunding', 'Corporate Partnerships'], 'low');

  add('Non-Profit', 'Community Outreach Coordinator', ['Community Engagement', 'Outreach', 'Partnership Development', 'Event Planning', 'Public Speaking', 'Cultural Competency'], 'critical');
  add('Non-Profit', 'Community Outreach Coordinator', ['Needs Assessment', 'Resource Mapping', 'Referral Networks', 'Advocacy', 'Volunteer Coordination'], 'high');
  add('Non-Profit', 'Community Outreach Coordinator', ['Social Media', 'Newsletter', 'Flyers', 'Presentations', 'Data Collection'], 'medium');

  add('Non-Profit', 'Case Manager', ['Case Management', 'Client Assessment', 'Service Planning', 'Crisis Intervention', 'Resource Coordination', 'Documentation'], 'critical');
  add('Non-Profit', 'Case Manager', ['Motivational Interviewing', 'Trauma-Informed Care', 'Cultural Competency', 'HIPAA', 'Confidentiality'], 'high');
  add('Non-Profit', 'Case Manager', ['Database Management', 'Outcome Tracking', 'Progress Notes', 'Referrals', 'Follow-Up'], 'medium');
  add('Non-Profit', 'Case Manager', ['Supervision', 'Training', 'Program Development', 'Quality Improvement'], 'low');

  add('Non-Profit', 'Volunteer Coordinator', ['Volunteer Management', 'Recruitment', 'Training', 'Scheduling', 'Retention', 'Recognition'], 'critical');
  add('Non-Profit', 'Volunteer Coordinator', ['Volunteer Management Software', 'Background Checks', 'Orientation', 'Performance Tracking'], 'high');
  add('Non-Profit', 'Volunteer Coordinator', ['Event Planning', 'Community Outreach', 'Social Media', 'Partnerships'], 'medium');

  // ---- TELECOMMUNICATIONS (20+ rows) ----

  add('Telecommunications', 'Network Engineer', ['Networking', 'TCP/IP', 'BGP', 'OSPF', 'MPLS', 'Cisco', 'Juniper', 'Routing', 'Switching'], 'critical');
  add('Telecommunications', 'Network Engineer', ['SDN', 'NFV', 'DWDM', 'SONET', 'Fiber Optics', 'Ethernet', 'VLAN'], 'high');
  add('Telecommunications', 'Network Engineer', ['Network Monitoring', 'Troubleshooting', 'Performance Optimization', 'Capacity Planning', 'SolarWinds'], 'medium');
  add('Telecommunications', 'Network Engineer', ['Documentation', 'Vendor Management', 'Change Management', 'ITIL'], 'low');

  add('Telecommunications', 'RF Engineer', ['RF Design', '5G', 'LTE', '4G', 'Antenna Design', 'Propagation', 'Drive Testing', 'Optimization'], 'critical');
  add('Telecommunications', 'RF Engineer', ['ATOLL', 'Planet', 'MapInfo', 'Actix', 'TEMS', 'Cell Planning', 'Coverage Analysis'], 'high');
  add('Telecommunications', 'RF Engineer', ['Interference Mitigation', 'Capacity Planning', 'KPI Analysis', 'Cluster Optimization'], 'medium');
  add('Telecommunications', 'RF Engineer', ['Site Selection', 'Regulatory Compliance', 'FCC', 'Environmental Review'], 'low');

  add('Telecommunications', 'Field Technician', ['Installation', 'Maintenance', 'Troubleshooting', 'Fiber Optics', 'Copper', 'Splicing', 'OTDR'], 'critical');
  add('Telecommunications', 'Field Technician', ['Tower Climbing', 'Antenna Installation', 'Microwave', 'Cable Termination', 'Testing'], 'high');
  add('Telecommunications', 'Field Technician', ['Safety', 'OSHA', 'Fall Protection', 'CDL', 'Customer Service'], 'medium');
  add('Telecommunications', 'Field Technician', ['Documentation', 'Inventory', 'Fleet Vehicle', 'Time Management'], 'low');

  add('Telecommunications', 'NOC Analyst', ['Network Operations', 'Monitoring', 'Incident Management', 'Ticketing', 'Escalation', 'SNMP', 'Syslog'], 'critical');
  add('Telecommunications', 'NOC Analyst', ['SolarWinds', 'Nagios', 'PRTG', 'Grafana', 'Splunk', 'ServiceNow', 'ITIL'], 'high');
  add('Telecommunications', 'NOC Analyst', ['Root Cause Analysis', 'Performance Reporting', 'SLA Management', 'Change Management'], 'medium');
  add('Telecommunications', 'NOC Analyst', ['Documentation', 'Runbooks', 'Training', 'Shift Handover'], 'low');

  add('Telecommunications', 'Telecom Project Manager', ['Project Management', 'Telecom', 'Network Deployment', 'Site Acquisition', 'Construction Management'], 'critical');
  add('Telecommunications', 'Telecom Project Manager', ['MS Project', 'Budget Management', 'Vendor Management', 'Permitting', 'Regulatory Compliance'], 'high');
  add('Telecommunications', 'Telecom Project Manager', ['5G Deployment', 'Fiber Build', 'Small Cell', 'DAS', 'Macro Sites'], 'medium');
  add('Telecommunications', 'Telecom Project Manager', ['Stakeholder Management', 'Risk Management', 'Quality Assurance', 'Closeout'], 'low');

  // ---- RETAIL/HOSPITALITY (20+ rows) ----

  add('Retail/Hospitality', 'Store Manager', ['Store Operations', 'Sales Management', 'P&L', 'Inventory Management', 'Visual Merchandising', 'Customer Service'], 'critical');
  add('Retail/Hospitality', 'Store Manager', ['POS Systems', 'Staff Management', 'Scheduling', 'Training', 'Loss Prevention', 'Shrinkage'], 'high');
  add('Retail/Hospitality', 'Store Manager', ['KPIs', 'Conversion Rate', 'Average Transaction', 'Customer Retention', 'Loyalty Programs'], 'medium');
  add('Retail/Hospitality', 'Store Manager', ['Community Events', 'Local Marketing', 'Facility Maintenance', 'Compliance'], 'low');

  add('Retail/Hospitality', 'District Manager', ['Multi-Unit Management', 'Revenue Growth', 'Operational Excellence', 'P&L', 'Strategic Planning'], 'critical');
  add('Retail/Hospitality', 'District Manager', ['Performance Management', 'Talent Development', 'Store Visits', 'Action Plans', 'Benchmarking'], 'high');
  add('Retail/Hospitality', 'District Manager', ['New Store Openings', 'Remodels', 'Market Analysis', 'Competitive Intelligence'], 'medium');
  add('Retail/Hospitality', 'District Manager', ['Cross-functional Partnership', 'Corporate Initiatives', 'Change Management'], 'low');

  add('Retail/Hospitality', 'Operations Manager (Retail)', ['Operations Management', 'Process Improvement', 'Supply Chain', 'Distribution', 'Warehouse', 'Fulfillment'], 'critical');
  add('Retail/Hospitality', 'Operations Manager (Retail)', ['WMS', 'OMS', 'ERP', 'Workforce Management', 'Labor Optimization', 'Scheduling'], 'high');
  add('Retail/Hospitality', 'Operations Manager (Retail)', ['E-Commerce Fulfillment', 'BOPIS', 'Omnichannel', 'Returns Processing'], 'medium');

  add('Retail/Hospitality', 'Customer Service Manager', ['Customer Service', 'Call Center', 'Quality Assurance', 'Customer Satisfaction', 'CSAT', 'NPS', 'CRM'], 'critical');
  add('Retail/Hospitality', 'Customer Service Manager', ['Zendesk', 'Salesforce Service Cloud', 'Genesys', 'Workforce Management', 'Training'], 'high');
  add('Retail/Hospitality', 'Customer Service Manager', ['Escalation Management', 'Process Improvement', 'Knowledge Base', 'SLA Management'], 'medium');

  add('Retail/Hospitality', 'Merchandiser', ['Visual Merchandising', 'Planograms', 'Product Placement', 'Inventory Management', 'Sales Analysis'], 'critical');
  add('Retail/Hospitality', 'Merchandiser', ['Space Planning', 'Category Management', 'Vendor Relations', 'Promotional Displays', 'Seasonal Planning'], 'high');
  add('Retail/Hospitality', 'Merchandiser', ['Trend Analysis', 'Competitive Shopping', 'Photography', 'Reporting'], 'medium');

  add('Retail/Hospitality', 'Hotel Manager', ['Hotel Operations', 'Revenue Management', 'Guest Satisfaction', 'Front Office', 'Housekeeping', 'F&B'], 'critical');
  add('Retail/Hospitality', 'Hotel Manager', ['Opera PMS', 'STR Reports', 'Rate Strategy', 'OTA Management', 'Staff Training'], 'high');
  add('Retail/Hospitality', 'Hotel Manager', ['Sales', 'Events', 'Banquets', 'Catering', 'Brand Standards', 'Quality Audits'], 'medium');
  add('Retail/Hospitality', 'Hotel Manager', ['Community Relations', 'Sustainability', 'Renovation Projects', 'Owner Relations'], 'low');

  add('Retail/Hospitality', 'Restaurant Manager', ['Food Service Operations', 'Health Code Compliance', 'Staff Scheduling', 'Inventory Control', 'Cost Control'], 'critical');
  add('Retail/Hospitality', 'Restaurant Manager', ['POS Systems', 'Food Safety', 'ServSafe', 'Menu Development', 'Vendor Management'], 'high');
  add('Retail/Hospitality', 'Restaurant Manager', ['Customer Satisfaction', 'Upselling', 'Labor Cost', 'Training', 'Catering'], 'medium');

  // ---- ADDITIONAL CROSS-INDUSTRY ROLES ----

  add('Technology', 'Site Reliability Engineer', ['SRE', 'Reliability', 'Observability', 'Incident Management', 'SLO', 'SLI', 'Error Budget', 'Postmortem'], 'critical');
  add('Technology', 'Site Reliability Engineer', ['Prometheus', 'Grafana', 'PagerDuty', 'Terraform', 'Kubernetes', 'Docker', 'Linux'], 'high');
  add('Technology', 'Site Reliability Engineer', ['Chaos Engineering', 'Load Testing', 'Capacity Planning', 'Automation', 'Python', 'Go'], 'medium');
  add('Technology', 'Site Reliability Engineer', ['Documentation', 'Runbooks', 'On-call Rotation', 'Blameless Culture'], 'low');

  add('Technology', 'Data Engineer', ['Data Pipelines', 'ETL', 'Apache Spark', 'Apache Kafka', 'Airflow', 'SQL', 'Python', 'Data Warehousing'], 'critical');
  add('Technology', 'Data Engineer', ['Snowflake', 'BigQuery', 'Redshift', 'dbt', 'Data Modeling', 'Schema Design'], 'high');
  add('Technology', 'Data Engineer', ['AWS', 'GCP', 'Azure', 'Docker', 'CI/CD', 'Data Quality', 'Data Governance'], 'medium');
  add('Technology', 'Data Engineer', ['Documentation', 'Stakeholder Communication', 'Cost Optimization', 'Performance Tuning'], 'low');

  add('Technology', 'Information Security Manager', ['Information Security', 'CISO', 'Security Strategy', 'Risk Management', 'Compliance', 'NIST', 'ISO 27001'], 'critical');
  add('Technology', 'Information Security Manager', ['Security Operations', 'Incident Response', 'Vulnerability Management', 'Penetration Testing', 'Security Architecture'], 'high');
  add('Technology', 'Information Security Manager', ['GRC', 'SOC 2', 'PCI DSS', 'HIPAA Security', 'Security Awareness Training'], 'medium');

  add('Healthcare', 'Dental Hygienist', ['Dental Prophylaxis', 'Periodontal Assessment', 'X-Rays', 'Patient Education', 'Infection Control', 'Scaling'], 'critical');
  add('Healthcare', 'Dental Hygienist', ['Eaglesoft', 'Dentrix', 'Digital Radiography', 'Sealants', 'Fluoride Treatment'], 'high');
  add('Healthcare', 'Dental Hygienist', ['Patient Communication', 'Charting', 'Treatment Planning', 'Sterilization'], 'medium');

  add('Healthcare', 'Occupational Therapist', ['Occupational Therapy', 'Functional Assessment', 'Treatment Planning', 'ADL Training', 'Adaptive Equipment', 'Hand Therapy'], 'critical');
  add('Healthcare', 'Occupational Therapist', ['Cognitive Rehabilitation', 'Sensory Integration', 'Splinting', 'Work Hardening', 'Ergonomic Assessment'], 'high');
  add('Healthcare', 'Occupational Therapist', ['Documentation', 'Insurance Authorization', 'Outcome Measures', 'Evidence-Based Practice'], 'medium');

  add('Finance/Banking', 'Wealth Manager', ['Wealth Management', 'Portfolio Management', 'Asset Allocation', 'High Net Worth', 'Financial Planning', 'CFA'], 'critical');
  add('Finance/Banking', 'Wealth Manager', ['Alternative Investments', 'Tax Optimization', 'Estate Planning', 'Trust Services', 'Bloomberg'], 'high');
  add('Finance/Banking', 'Wealth Manager', ['Client Relationship Management', 'Regulatory Compliance', 'Fiduciary Duty', 'Succession Planning'], 'medium');

  add('Government/Federal', 'Grants Management Specialist', ['Grants Management', 'Federal Grants', 'OMB Uniform Guidance', 'Single Audit', 'Grants.gov', 'Compliance'], 'critical');
  add('Government/Federal', 'Grants Management Specialist', ['Financial Reporting', 'Monitoring', 'Closeout', 'Cost Principles', 'Allowable Costs'], 'high');
  add('Government/Federal', 'Grants Management Specialist', ['Program Evaluation', 'Risk Assessment', 'Corrective Action', 'Technical Assistance'], 'medium');

  add('Defense/Aerospace', 'Satellite Operations', ['Satellite Operations', 'TT&C', 'Orbit Determination', 'Space Situational Awareness', 'Ground Segment'], 'critical');
  add('Defense/Aerospace', 'Satellite Operations', ['STK', 'MATLAB', 'Link Budget', 'Antenna Systems', 'RF Communications'], 'high');
  add('Defense/Aerospace', 'Satellite Operations', ['Anomaly Resolution', 'Contingency Planning', 'On-Orbit Testing', 'Maneuver Planning'], 'medium');

  add('Energy/Utilities', 'Grid Operations', ['Grid Operations', 'Energy Management System', 'NERC', 'Bulk Electric System', 'System Operator Certification'], 'critical');
  add('Energy/Utilities', 'Grid Operations', ['SCADA', 'Real-Time Monitoring', 'Load Forecasting', 'Interchange Scheduling', 'Voltage Regulation'], 'high');

  add('Construction', 'Superintendent', ['Construction Superintendent', 'Project Scheduling', 'Crew Management', 'Quality Control', 'Safety Management', 'Budget Control'], 'critical');
  add('Construction', 'Superintendent', ['Blueprint Reading', 'OSHA 30', 'Subcontractor Coordination', 'Daily Logs', 'Punch List Management'], 'high');
  add('Construction', 'Superintendent', ['Concrete', 'Steel', 'MEP Coordination', 'Commissioning', 'Closeout'], 'medium');

  add('Logistics/Supply Chain', 'Customs Broker', ['Customs Brokerage', 'Import/Export', 'HTS Classification', 'Customs Compliance', 'CBP', 'Trade Compliance'], 'critical');
  add('Logistics/Supply Chain', 'Customs Broker', ['Licensed Customs Broker', 'ACE', 'ISF', 'Free Trade Agreements', 'Duty Drawback'], 'high');
  add('Logistics/Supply Chain', 'Customs Broker', ['Tariff Engineering', 'Valuation', 'Country of Origin', 'Bonded Warehouse'], 'medium');

  return rows;
}

// ============================================================================
// SQL Generation
// ============================================================================

function formatKeywordsArray(keywords) {
  // PostgreSQL TEXT[] literal: '{"kw1","kw2",...}'
  const escaped = keywords.map(k => `"${esc(k)}"`);
  return `'{${escaped.join(',')}}'`;
}

function main() {
  const acronyms = parseAcronyms();
  const atsRows = generateATSKeywords();

  const lines = [];

  lines.push('-- ============================================================================');
  lines.push('-- part1.sql — Seed data for dict_acronyms and dict_ats_keywords');
  lines.push(`-- Generated on ${new Date().toISOString()}`);
  lines.push('-- ============================================================================');
  lines.push('');
  lines.push('BEGIN;');
  lines.push('');

  // ---------- dict_acronyms ----------
  lines.push('-- ============================================================================');
  lines.push(`-- TABLE 1: dict_acronyms (${acronyms.length} rows)`);
  lines.push('-- ============================================================================');
  lines.push('');

  let currentBranch = null;
  for (const row of acronyms) {
    if (row.branch !== currentBranch) {
      currentBranch = row.branch;
      lines.push('');
      lines.push(`-- ----- Branch: ${currentBranch} -----`);
    }
    lines.push(
      `INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('${esc(row.acronym)}', '${esc(row.full_term)}', '${esc(row.civilian_explanation)}', '${esc(normalizeBranch(row.branch))}', '${esc(row.category)}') ON CONFLICT DO NOTHING;`
    );
  }

  lines.push('');
  lines.push('');

  // ---------- dict_ats_keywords ----------
  lines.push('-- ============================================================================');
  lines.push(`-- TABLE 2: dict_ats_keywords (${atsRows.length} rows)`);
  lines.push('-- ============================================================================');
  lines.push('');

  let currentIndustry = null;
  for (const row of atsRows) {
    if (row.industry !== currentIndustry) {
      currentIndustry = row.industry;
      lines.push('');
      lines.push(`-- ----- Industry: ${currentIndustry} -----`);
    }
    lines.push(
      `INSERT INTO dict_ats_keywords (industry, role_type, keywords, weight) VALUES ('${esc(row.industry)}', '${esc(row.role_type)}', ${formatKeywordsArray(row.keywords)}, '${esc(row.weight)}') ON CONFLICT DO NOTHING;`
    );
  }

  lines.push('');
  lines.push('');

  // ---------- Summary ----------
  lines.push('-- ============================================================================');
  lines.push(`-- SUMMARY: dict_acronyms = ${acronyms.length} rows, dict_ats_keywords = ${atsRows.length} rows`);
  lines.push(`-- TOTAL INSERT STATEMENTS: ${acronyms.length + atsRows.length}`);
  lines.push('-- ============================================================================');
  lines.push('');
  lines.push('COMMIT;');
  lines.push('');

  writeFileSync(OUTPUT_FILE, lines.join('\n'), 'utf-8');

  console.log(`Generated ${OUTPUT_FILE}`);
  console.log(`  dict_acronyms:    ${acronyms.length} rows`);
  console.log(`  dict_ats_keywords: ${atsRows.length} rows`);
  console.log(`  TOTAL:            ${acronyms.length + atsRows.length} INSERT statements`);
}

main();
