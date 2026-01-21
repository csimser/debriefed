// ============================================================================
// COMPREHENSIVE MILITARY MOS/RATING DATABASE
// All branches: Navy, Army, Air Force, Marines, Coast Guard
// ============================================================================

export interface MOSData {
  title: string
  civilianTitles: string[]
  skills: string[]
  certifications: string[]
  description: string
  branch: 'Navy' | 'Army' | 'Air Force' | 'Marines' | 'Coast Guard' | 'Space Force'
  source: 'builtin' | 'onet' | 'crosswalk' | 'ai'
}

export const MOS_RATINGS: Record<string, MOSData> = {

  // ============================================================================
  // NAVY RATINGS - COMPLETE LIST
  // ============================================================================

  'ABE': {
    title: "Aviation Boatswain's Mate, Launching and Recovery Equipment",
    civilianTitles: ['Aircraft Launch Equipment Technician', 'Aviation Ground Support Technician', 'Aircraft Carrier Operations Specialist'],
    skills: ['Aircraft Launch Systems', 'Hydraulic Systems', 'Steam Catapult Operations', 'Arresting Gear Maintenance', 'Safety Procedures', 'Equipment Inspection', 'Preventive Maintenance', 'Technical Documentation', 'Team Coordination', 'Emergency Response'],
    certifications: ['OSHA 10/30', 'Hydraulic Systems Certification', 'Heavy Equipment Operator', 'First Aid/CPR'],
    description: 'Operates and maintains aircraft launching and recovery equipment on aircraft carriers',
    branch: 'Navy',
    source: 'builtin',
  },

  'ABF': {
    title: "Aviation Boatswain's Mate, Fuels",
    civilianTitles: ['Fuel Systems Technician', 'Aviation Fueler', 'Petroleum Distribution Specialist', 'Fuel Quality Control Technician', 'Hazmat Technician'],
    skills: ['Fuel Systems Operations', 'Quality Control Testing', 'HAZMAT Handling', 'Pump Operations', 'Pipeline Maintenance', 'Safety Compliance', 'Inventory Management', 'Contamination Prevention', 'Emergency Response', 'Environmental Compliance'],
    certifications: ['HAZWOPER', 'API Certifications', 'CDL with Hazmat', 'OSHA 10/30', 'Fuel Handler Certification'],
    description: 'Handles aviation fuels and operates aircraft fueling systems',
    branch: 'Navy',
    source: 'builtin',
  },

  'ABH': {
    title: "Aviation Boatswain's Mate, Aircraft Handling",
    civilianTitles: ['Aircraft Handler', 'Flight Deck Coordinator', 'Aviation Ground Support Coordinator', 'Ramp Agent Supervisor', 'Aircraft Marshaller'],
    skills: ['Aircraft Handling', 'Flight Deck Operations', 'Hand Signals Communication', 'Safety Procedures', 'Heavy Equipment Operation', 'Team Coordination', 'Emergency Response', 'Firefighting', 'Crash/Salvage Operations', 'Load Planning'],
    certifications: ['Ground Support Equipment Operator', 'Forklift Certification', 'Firefighter I/II', 'First Aid/CPR', 'OSHA 10/30'],
    description: 'Handles and moves aircraft on flight decks and in hangars',
    branch: 'Navy',
    source: 'builtin',
  },

  'AC': {
    title: 'Air Traffic Controller',
    civilianTitles: ['Air Traffic Controller', 'Flight Data Specialist', 'Aviation Operations Specialist', 'Tower Controller', 'Approach Controller'],
    skills: ['Air Traffic Control', 'Radar Operations', 'Radio Communications', 'Flight Path Management', 'Emergency Procedures', 'Decision Making', 'Stress Management', 'Multi-tasking', 'Situational Awareness', 'Conflict Resolution'],
    certifications: ['FAA ATC Certification', 'FAA Control Tower Operator', 'FCC Radio License'],
    description: 'Controls air traffic at naval air stations and aboard aircraft carriers',
    branch: 'Navy',
    source: 'builtin',
  },

  'AD': {
    title: "Aviation Machinist's Mate",
    civilianTitles: ['Aircraft Mechanic', 'Aviation Maintenance Technician', 'Powerplant Mechanic', 'Jet Engine Mechanic', 'A&P Mechanic'],
    skills: ['Aircraft Engine Maintenance', 'Turbine Systems', 'Fuel Systems', 'Hydraulic Systems', 'Troubleshooting', 'Technical Documentation', 'Quality Assurance', 'Safety Procedures', 'Tool Management', 'Parts Ordering'],
    certifications: ['FAA A&P License', 'Turbine Engine Certification', 'OSHA 10', 'EPA 608'],
    description: 'Maintains and repairs aircraft engines and related systems',
    branch: 'Navy',
    source: 'builtin',
  },

  'AE': {
    title: "Aviation Electrician's Mate",
    civilianTitles: ['Aviation Electrician', 'Aircraft Electrical Technician', 'Avionics Technician', 'Aircraft Systems Technician'],
    skills: ['Aircraft Electrical Systems', 'Wiring Installation', 'Circuit Analysis', 'Troubleshooting', 'Avionics Systems', 'Battery Systems', 'Power Generation', 'Safety Procedures', 'Technical Documentation', 'Testing Equipment'],
    certifications: ['FAA A&P License', 'FCC License', 'NCATT AET Certification', 'OSHA 10'],
    description: 'Maintains aircraft electrical and instrument systems',
    branch: 'Navy',
    source: 'builtin',
  },

  'AG': {
    title: "Aerographer's Mate",
    civilianTitles: ['Meteorologist', 'Weather Forecaster', 'Atmospheric Scientist', 'Environmental Scientist', 'Weather Observer'],
    skills: ['Weather Forecasting', 'Data Analysis', 'Meteorological Equipment', 'Satellite Imagery', 'Radar Interpretation', 'Report Writing', 'Briefing', 'Computer Modeling', 'Environmental Monitoring', 'Scientific Research'],
    certifications: ['AMS Certified Broadcast Meteorologist', 'NWS Certifications', 'Weather Observer Certification'],
    description: 'Collects and analyzes meteorological and oceanographic data',
    branch: 'Navy',
    source: 'builtin',
  },

  'AM': {
    title: 'Aviation Structural Mechanic',
    civilianTitles: ['Aircraft Structural Mechanic', 'Aviation Maintenance Technician', 'Sheet Metal Mechanic', 'Composite Repair Technician', 'A&P Mechanic'],
    skills: ['Aircraft Structures', 'Sheet Metal Work', 'Composite Materials', 'Welding', 'Corrosion Control', 'Non-Destructive Testing', 'Blueprint Reading', 'Rigging', 'Safety Procedures', 'Technical Documentation'],
    certifications: ['FAA A&P License', 'AWS Welding Certification', 'NDT Certifications', 'OSHA 10'],
    description: 'Maintains aircraft structures including airframes, hydraulics, and flight surfaces',
    branch: 'Navy',
    source: 'builtin',
  },

  'AO': {
    title: 'Aviation Ordnanceman',
    civilianTitles: ['Munitions Handler', 'Weapons Systems Technician', 'Ordnance Technician', 'Armorer', 'Explosives Handler'],
    skills: ['Weapons Systems', 'Ammunition Handling', 'Explosives Safety', 'Ordnance Assembly', 'Quality Control', 'Inventory Management', 'Technical Documentation', 'Safety Procedures', 'Fork Lift Operations', 'Hazmat Handling'],
    certifications: ['ATF Explosives License', 'Forklift Certification', 'HAZWOPER', 'OSHA 10/30'],
    description: 'Handles and maintains aircraft weapons and ammunition',
    branch: 'Navy',
    source: 'builtin',
  },

  'AT': {
    title: 'Aviation Electronics Technician',
    civilianTitles: ['Avionics Technician', 'Electronics Technician', 'Radar Systems Technician', 'Communications Systems Technician'],
    skills: ['Avionics Systems', 'Radar Systems', 'Communications Equipment', 'Navigation Systems', 'Circuit Analysis', 'Troubleshooting', 'Calibration', 'Soldering', 'Technical Documentation', 'Test Equipment'],
    certifications: ['NCATT AET', 'FCC GROL', 'FAA A&P License', 'IPC Soldering'],
    description: 'Maintains aircraft electronic systems including radar, communications, and navigation',
    branch: 'Navy',
    source: 'builtin',
  },

  'AZ': {
    title: 'Aviation Maintenance Administrationman',
    civilianTitles: ['Aviation Administrative Specialist', 'Maintenance Administrator', 'Records Manager', 'Logistics Coordinator', 'Technical Writer'],
    skills: ['Records Management', 'Database Administration', 'Technical Documentation', 'Microsoft Office', 'Inventory Management', 'Scheduling', 'Report Generation', 'Quality Assurance', 'Data Analysis', 'Customer Service'],
    certifications: ['Microsoft Office Specialist', 'Records Management Certification', 'Project Management'],
    description: 'Manages aviation maintenance records and administrative functions',
    branch: 'Navy',
    source: 'builtin',
  },

  'BM': {
    title: "Boatswain's Mate",
    civilianTitles: ['Deck Officer', 'Maritime Operations Supervisor', 'Port Operations Manager', 'Ship Operations Coordinator', 'Cargo Operations Manager'],
    skills: ['Ship Operations', 'Deck Operations', 'Navigation', 'Cargo Handling', 'Small Boat Operations', 'Line Handling', 'Safety Procedures', 'Team Leadership', 'Damage Control', 'Seamanship'],
    certifications: ['USCG Merchant Mariner Credential', 'TWIC Card', 'Forklift Certification', 'Crane Operator', 'First Aid/CPR'],
    description: 'Supervises deck operations and maintains deck equipment',
    branch: 'Navy',
    source: 'builtin',
  },

  'BU': {
    title: 'Builder',
    civilianTitles: ['Construction Supervisor', 'General Contractor', 'Carpenter', 'Construction Manager', 'Building Inspector'],
    skills: ['Construction Management', 'Carpentry', 'Blueprint Reading', 'Masonry', 'Concrete Work', 'Project Planning', 'Cost Estimation', 'Safety Compliance', 'Quality Control', 'Team Leadership'],
    certifications: ['OSHA 30', 'Contractor License', 'Project Management Professional (PMP)', 'LEED Certification'],
    description: 'Constructs and repairs buildings and structures',
    branch: 'Navy',
    source: 'builtin',
  },

  'CE': {
    title: 'Construction Electrician',
    civilianTitles: ['Electrician', 'Electrical Contractor', 'Electrical Supervisor', 'Power Systems Technician', 'Electrical Inspector'],
    skills: ['Electrical Installation', 'Power Distribution', 'Wiring', 'Troubleshooting', 'NEC Compliance', 'Blueprint Reading', 'Safety Procedures', 'Generator Operations', 'Lighting Systems', 'Motor Controls'],
    certifications: ['Journeyman/Master Electrician License', 'OSHA 30', 'NFPA 70E', 'NICET'],
    description: 'Installs and maintains electrical systems and power distribution',
    branch: 'Navy',
    source: 'builtin',
  },

  'CM': {
    title: 'Construction Mechanic',
    civilianTitles: ['Heavy Equipment Mechanic', 'Diesel Mechanic', 'Fleet Mechanic', 'Equipment Maintenance Technician'],
    skills: ['Heavy Equipment Maintenance', 'Diesel Engines', 'Hydraulic Systems', 'Electrical Systems', 'Welding', 'Troubleshooting', 'Preventive Maintenance', 'Parts Management', 'Safety Compliance', 'Technical Documentation'],
    certifications: ['ASE Certifications', 'CDL', 'Welding Certification', 'OSHA 10/30'],
    description: 'Maintains and repairs construction equipment and vehicles',
    branch: 'Navy',
    source: 'builtin',
  },

  'CS': {
    title: 'Culinary Specialist',
    civilianTitles: ['Executive Chef', 'Food Service Manager', 'Culinary Director', 'Kitchen Manager', 'Catering Manager'],
    skills: ['Food Preparation', 'Menu Planning', 'Food Safety', 'Inventory Management', 'Budget Management', 'Team Leadership', 'Customer Service', 'Sanitation Standards', 'Nutrition', 'Event Planning'],
    certifications: ['ServSafe Manager', 'Certified Executive Chef (CEC)', 'Food Handler Certification', 'HACCP'],
    description: 'Prepares meals and manages food service operations',
    branch: 'Navy',
    source: 'builtin',
  },

  'CTI': {
    title: 'Cryptologic Technician Interpretive',
    civilianTitles: ['Language Analyst', 'Intelligence Analyst', 'Translator', 'Foreign Language Specialist', 'Linguist'],
    skills: ['Foreign Language Proficiency', 'Translation', 'Interpretation', 'Intelligence Analysis', 'Report Writing', 'Cultural Awareness', 'Research', 'Communication', 'Critical Thinking', 'Attention to Detail'],
    certifications: ['DLPT Certification', 'Security Clearance', 'Intelligence Certifications'],
    description: 'Collects and analyzes foreign language communications',
    branch: 'Navy',
    source: 'builtin',
  },

  'CTM': {
    title: 'Cryptologic Technician Maintenance',
    civilianTitles: ['Electronics Technician', 'Systems Technician', 'Network Technician', 'Communications Equipment Specialist'],
    skills: ['Electronics Maintenance', 'Cryptographic Systems', 'Network Systems', 'Troubleshooting', 'Calibration', 'Technical Documentation', 'Security Procedures', 'Soldering', 'Test Equipment', 'Preventive Maintenance'],
    certifications: ['CompTIA A+', 'CompTIA Network+', 'Security+', 'COMSEC Certifications'],
    description: 'Maintains cryptographic and communication security equipment',
    branch: 'Navy',
    source: 'builtin',
  },

  'CTN': {
    title: 'Cryptologic Technician Networks',
    civilianTitles: ['Cybersecurity Analyst', 'Network Security Engineer', 'Penetration Tester', 'SOC Analyst', 'Information Security Specialist'],
    skills: ['Cybersecurity', 'Network Security', 'Penetration Testing', 'Incident Response', 'SIEM', 'Threat Analysis', 'Vulnerability Assessment', 'Python/Scripting', 'Malware Analysis', 'Digital Forensics'],
    certifications: ['Security+', 'CEH', 'CISSP', 'OSCP', 'GIAC Certifications', 'CySA+'],
    description: 'Conducts cyber operations and network security',
    branch: 'Navy',
    source: 'builtin',
  },

  'CTR': {
    title: 'Cryptologic Technician Collection',
    civilianTitles: ['Signals Intelligence Analyst', 'SIGINT Specialist', 'Intelligence Collector', 'Electronic Warfare Specialist'],
    skills: ['Signals Intelligence', 'Electronic Warfare', 'Intelligence Collection', 'Analysis', 'Report Writing', 'Communications Systems', 'Research', 'Critical Thinking', 'Security Procedures', 'Technical Documentation'],
    certifications: ['Security Clearance', 'SIGINT Certifications', 'Intelligence Certifications'],
    description: 'Collects and processes signals intelligence',
    branch: 'Navy',
    source: 'builtin',
  },

  'CTT': {
    title: 'Cryptologic Technician Technical',
    civilianTitles: ['Electronic Warfare Specialist', 'ELINT Analyst', 'Technical Intelligence Analyst', 'Signals Analyst'],
    skills: ['Electronic Warfare', 'Technical Intelligence', 'Signals Analysis', 'Electronic Systems', 'Report Writing', 'Research', 'Data Analysis', 'Communications', 'Security Procedures', 'Problem Solving'],
    certifications: ['Security Clearance', 'EW Certifications', 'Technical Intelligence Certifications'],
    description: 'Performs technical analysis of electronic signals',
    branch: 'Navy',
    source: 'builtin',
  },

  'DC': {
    title: 'Damage Controlman',
    civilianTitles: ['Safety Manager', 'EHS Director', 'Fire Protection Engineer', 'Emergency Management Specialist', 'Facilities Manager', 'OSHA Compliance Officer', 'Fire Marshal'],
    skills: ['Emergency Response', 'Fire Prevention', 'HAZMAT Handling', 'Safety Compliance', 'Risk Assessment', 'Team Leadership', 'Equipment Maintenance', 'Training Development', 'Incident Investigation', 'OSHA Regulations', 'Firefighting', 'CBR Defense'],
    certifications: ['OSHA 30', 'HAZWOPER', 'First Aid/CPR', 'Firefighter I/II', 'NFPA Certifications', 'Confined Space Entry', 'Fire Inspector'],
    description: 'Shipboard firefighting, damage control, and emergency response specialist',
    branch: 'Navy',
    source: 'builtin',
  },

  'EA': {
    title: 'Engineering Aide',
    civilianTitles: ['Civil Engineering Technician', 'Survey Technician', 'CAD Technician', 'Construction Surveyor', 'Engineering Assistant'],
    skills: ['Surveying', 'CAD Software', 'Blueprint Reading', 'Construction Layout', 'Soil Testing', 'Drafting', 'Technical Documentation', 'Data Collection', 'GPS Systems', 'Mathematics'],
    certifications: ['Certified Survey Technician', 'AutoCAD Certification', 'GIS Professional'],
    description: 'Performs construction surveying and engineering support',
    branch: 'Navy',
    source: 'builtin',
  },

  'EM': {
    title: "Electrician's Mate",
    civilianTitles: ['Electrician', 'Electrical Engineer', 'Power Plant Operator', 'Maintenance Technician', 'Electrical Supervisor'],
    skills: ['Electrical Systems', 'Power Distribution', 'Troubleshooting', 'Motor Controls', 'PLC Programming', 'Blueprint Reading', 'NEC Compliance', 'Generator Operations', 'Preventive Maintenance', 'Safety Procedures'],
    certifications: ['Journeyman/Master Electrician', 'OSHA 10/30', 'NFPA 70E', 'NICET'],
    description: 'Operates and maintains electrical power generation and distribution systems',
    branch: 'Navy',
    source: 'builtin',
  },

  'EMN': {
    title: "Electrician's Mate, Nuclear Power",
    civilianTitles: ['Nuclear Plant Operator', 'Nuclear Engineer', 'Power Plant Manager', 'Reactor Operator', 'Nuclear Systems Engineer'],
    skills: ['Nuclear Power Systems', 'Reactor Operations', 'Electrical Systems', 'Power Generation', 'Safety Procedures', 'Radiation Protection', 'Troubleshooting', 'Technical Documentation', 'Quality Assurance', 'Thermodynamics'],
    certifications: ['NRC Reactor Operator License', 'Nuclear QA Certifications', 'OSHA 10/30'],
    description: 'Operates nuclear propulsion plant electrical systems',
    branch: 'Navy',
    source: 'builtin',
  },

  'EN': {
    title: 'Engineman',
    civilianTitles: ['Diesel Mechanic', 'Marine Engineer', 'Plant Operator', 'Facilities Technician', 'Heavy Equipment Mechanic'],
    skills: ['Diesel Engines', 'Marine Propulsion', 'HVAC Systems', 'Hydraulics', 'Refrigeration', 'Troubleshooting', 'Preventive Maintenance', 'Technical Documentation', 'Safety Procedures', 'Fuel Systems'],
    certifications: ['ASE Diesel Certification', 'EPA 608', 'Boiler Operator License', 'OSHA 10/30'],
    description: 'Operates and maintains diesel engines and auxiliary equipment',
    branch: 'Navy',
    source: 'builtin',
  },

  'EO': {
    title: 'Equipment Operator',
    civilianTitles: ['Heavy Equipment Operator', 'Construction Equipment Operator', 'Crane Operator', 'Forklift Operator'],
    skills: ['Heavy Equipment Operation', 'Earthmoving', 'Grading', 'Excavation', 'Safety Procedures', 'Preventive Maintenance', 'Load Calculations', 'Site Preparation', 'Material Handling', 'Technical Documentation'],
    certifications: ['CDL', 'NCCCO Crane Operator', 'Forklift Certification', 'OSHA 10/30', 'Heavy Equipment Operator'],
    description: 'Operates heavy construction equipment',
    branch: 'Navy',
    source: 'builtin',
  },

  'EOD': {
    title: 'Explosive Ordnance Disposal Technician',
    civilianTitles: ['Bomb Squad Technician', 'Explosives Specialist', 'Hazardous Materials Specialist', 'Security Consultant', 'Defense Contractor'],
    skills: ['Explosives Handling', 'Bomb Disposal', 'Render Safe Procedures', 'IED Defeat', 'HAZMAT', 'Robotics Operations', 'Technical Intelligence', 'Risk Assessment', 'Team Leadership', 'Training Development'],
    certifications: ['ATF Explosives License', 'HAZWOPER', 'IABTI Certification', 'Security Certifications'],
    description: 'Locates, identifies, and renders safe explosive ordnance',
    branch: 'Navy',
    source: 'builtin',
  },

  'ET': {
    title: 'Electronics Technician',
    civilianTitles: ['Electronics Technician', 'Field Service Engineer', 'Calibration Technician', 'RF Engineer', 'Communications Technician'],
    skills: ['Electronics Repair', 'Calibration', 'Troubleshooting', 'Circuit Analysis', 'RF Systems', 'Test Equipment', 'Soldering', 'Technical Documentation', 'Preventive Maintenance', 'Quality Assurance'],
    certifications: ['CET', 'CompTIA A+', 'FCC License', 'IPC Certification', 'NICET'],
    description: 'Maintains electronic systems including radar, communications, and navigation',
    branch: 'Navy',
    source: 'builtin',
  },

  'FC': {
    title: 'Fire Controlman',
    civilianTitles: ['Weapons Systems Engineer', 'Electronics Technician', 'Radar Systems Technician', 'Systems Integration Specialist', 'Field Engineer'],
    skills: ['Weapons Systems', 'Radar Systems', 'Electronics Maintenance', 'Calibration', 'System Integration', 'Technical Documentation', 'Troubleshooting', 'Computer Systems', 'Quality Assurance', 'Training'],
    certifications: ['Security+', 'Electronics Certifications', 'Radar Certifications'],
    description: 'Maintains and operates weapons fire control systems',
    branch: 'Navy',
    source: 'builtin',
  },

  'GM': {
    title: "Gunner's Mate",
    civilianTitles: ['Weapons Systems Technician', 'Armorer', 'Security Specialist', 'Ordnance Handler', 'Quality Assurance Inspector'],
    skills: ['Weapons Systems', 'Ordnance Handling', 'Ammunition Management', 'Firearms Maintenance', 'Safety Procedures', 'Quality Control', 'Training Development', 'Inventory Management', 'Technical Documentation', 'Team Leadership'],
    certifications: ['ATF License', 'NRA Instructor', 'OSHA 10/30', 'Security Certifications'],
    description: 'Maintains and operates shipboard weapons systems',
    branch: 'Navy',
    source: 'builtin',
  },

  'GSE': {
    title: 'Gas Turbine System Technician Electrical',
    civilianTitles: ['Power Plant Electrician', 'Gas Turbine Technician', 'Controls Technician', 'Industrial Electrician'],
    skills: ['Gas Turbine Electrical Systems', 'Power Distribution', 'Control Systems', 'Troubleshooting', 'PLC Programming', 'Technical Documentation', 'Safety Procedures', 'Preventive Maintenance', 'Quality Assurance', 'Data Analysis'],
    certifications: ['Electrician License', 'Gas Turbine Certifications', 'OSHA 10/30'],
    description: 'Maintains gas turbine electrical and control systems',
    branch: 'Navy',
    source: 'builtin',
  },

  'GSM': {
    title: 'Gas Turbine System Technician Mechanical',
    civilianTitles: ['Gas Turbine Mechanic', 'Power Plant Operator', 'Marine Engineer', 'Mechanical Technician'],
    skills: ['Gas Turbine Engines', 'Mechanical Systems', 'Hydraulics', 'Pneumatics', 'Troubleshooting', 'Preventive Maintenance', 'Technical Documentation', 'Safety Procedures', 'Quality Assurance', 'Team Coordination'],
    certifications: ['Gas Turbine Certifications', 'Mechanical Certifications', 'OSHA 10/30'],
    description: 'Operates and maintains gas turbine propulsion systems',
    branch: 'Navy',
    source: 'builtin',
  },

  'HM': {
    title: 'Hospital Corpsman',
    civilianTitles: ['EMT/Paramedic', 'Medical Assistant', 'Healthcare Administrator', 'Clinical Coordinator', 'Patient Care Technician', 'Nursing Assistant', 'LPN/LVN'],
    skills: ['Patient Care', 'Emergency Medicine', 'Medical Records', 'Phlebotomy', 'Vital Signs', 'CPR/First Aid', 'Medical Terminology', 'Triage', 'Healthcare Administration', 'HIPAA Compliance'],
    certifications: ['EMT-B/P', 'Paramedic', 'CNA', 'Phlebotomy', 'BLS/ACLS', 'Medical Assistant Certification', 'LPN'],
    description: 'Provides medical care and health services',
    branch: 'Navy',
    source: 'builtin',
  },

  'HT': {
    title: 'Hull Maintenance Technician',
    civilianTitles: ['Welder', 'Pipefitter', 'Plumber', 'Sheet Metal Worker', 'Marine Repair Technician'],
    skills: ['Welding', 'Pipefitting', 'Plumbing', 'Sheet Metal Work', 'Blueprint Reading', 'Fabrication', 'Brazing', 'Safety Procedures', 'Quality Control', 'Technical Documentation'],
    certifications: ['AWS Welding Certifications', 'Pipefitter Certification', 'Plumber License', 'OSHA 10/30'],
    description: 'Performs shipboard welding, plumbing, and metalwork',
    branch: 'Navy',
    source: 'builtin',
  },

  'IC': {
    title: 'Interior Communications Electrician',
    civilianTitles: ['Communications Technician', 'Alarm Systems Technician', 'Sound/PA Technician', 'Video Systems Technician'],
    skills: ['Communications Systems', 'Alarm Systems', 'PA Systems', 'Video Systems', 'Gyrocompass', 'Troubleshooting', 'Technical Documentation', 'Wiring', 'Calibration', 'Safety Procedures'],
    certifications: ['Low Voltage License', 'Electronics Certifications', 'NICET', 'OSHA 10'],
    description: 'Maintains shipboard communications and announcing systems',
    branch: 'Navy',
    source: 'builtin',
  },

  'IS': {
    title: 'Intelligence Specialist',
    civilianTitles: ['Intelligence Analyst', 'Research Analyst', 'Security Analyst', 'Geospatial Analyst', 'All-Source Analyst'],
    skills: ['Intelligence Analysis', 'Research', 'Briefing', 'Report Writing', 'OSINT', 'Imagery Analysis', 'Geospatial Intelligence', 'Threat Assessment', 'Data Analysis', 'Critical Thinking'],
    certifications: ['Security Clearance', 'Intelligence Certifications', 'Geospatial Certifications'],
    description: 'Collects and analyzes intelligence information',
    branch: 'Navy',
    source: 'builtin',
  },

  'IT': {
    title: 'Information Systems Technician',
    civilianTitles: ['IT Support Specialist', 'Network Administrator', 'Systems Administrator', 'Help Desk Manager', 'Cybersecurity Analyst', 'Network Engineer'],
    skills: ['Network Administration', 'Cybersecurity', 'System Administration', 'Troubleshooting', 'TCP/IP', 'Windows Server', 'Linux', 'Active Directory', 'COMSEC', 'Incident Response'],
    certifications: ['CompTIA Security+', 'CompTIA Network+', 'CCNA', 'CompTIA A+', 'CEH', 'CISSP'],
    description: 'Maintains computer and communication networks',
    branch: 'Navy',
    source: 'builtin',
  },

  'LN': {
    title: 'Legalman',
    civilianTitles: ['Paralegal', 'Legal Assistant', 'Court Reporter', 'Legal Administrator', 'Compliance Specialist'],
    skills: ['Legal Research', 'Legal Writing', 'Court Procedures', 'Administrative Law', 'Documentation', 'Case Management', 'Client Relations', 'UCMJ Knowledge', 'Microsoft Office', 'Attention to Detail'],
    certifications: ['Paralegal Certification', 'Notary Public', 'Legal Secretary Certification'],
    description: 'Provides legal administrative support',
    branch: 'Navy',
    source: 'builtin',
  },

  'LS': {
    title: 'Logistics Specialist',
    civilianTitles: ['Supply Chain Manager', 'Inventory Manager', 'Procurement Specialist', 'Logistics Coordinator', 'Warehouse Manager', 'Materials Manager'],
    skills: ['Inventory Management', 'Supply Chain', 'Procurement', 'Logistics', 'Warehouse Operations', 'SAP/ERP Systems', 'Vendor Management', 'Forecasting', 'Cost Analysis', 'Contract Management'],
    certifications: ['APICS CPIM', 'CSCP', 'Six Sigma', 'PMP', 'Lean Certification'],
    description: 'Manages supply chain and logistics operations',
    branch: 'Navy',
    source: 'builtin',
  },

  'MA': {
    title: 'Master-At-Arms',
    civilianTitles: ['Police Officer', 'Security Manager', 'Corrections Officer', 'Loss Prevention Manager', 'Security Director', 'Federal Law Enforcement'],
    skills: ['Law Enforcement', 'Security Operations', 'Investigations', 'Force Protection', 'Access Control', 'Report Writing', 'Firearms Proficiency', 'Physical Security', 'Emergency Response', 'Training Development'],
    certifications: ['POST Certification', 'Security Guard License', 'Firearms Certification', 'First Aid/CPR'],
    description: 'Provides law enforcement and security services',
    branch: 'Navy',
    source: 'builtin',
  },

  'MC': {
    title: 'Mass Communication Specialist',
    civilianTitles: ['Public Relations Specialist', 'Journalist', 'Photographer', 'Videographer', 'Social Media Manager'],
    skills: ['Journalism', 'Photography', 'Videography', 'Graphic Design', 'Public Relations', 'Social Media', 'Writing', 'Editing', 'Adobe Creative Suite', 'Broadcasting'],
    certifications: ['Adobe Certifications', 'Photography Certifications', 'PR Certifications'],
    description: 'Creates visual and written communications products',
    branch: 'Navy',
    source: 'builtin',
  },

  'MM': {
    title: "Machinist's Mate",
    civilianTitles: ['Mechanical Engineer', 'Plant Operator', 'HVAC Technician', 'Maintenance Supervisor', 'Boiler Operator'],
    skills: ['Mechanical Systems', 'HVAC', 'Steam Systems', 'Hydraulics', 'Pumps & Valves', 'Preventive Maintenance', 'Blueprint Reading', 'Welding', 'Machine Operations', 'Troubleshooting'],
    certifications: ['Boiler Operator License', 'HVAC Certification', 'Refrigerant Handling', 'Welding Certification'],
    description: 'Operates and maintains mechanical systems',
    branch: 'Navy',
    source: 'builtin',
  },

  'MMN': {
    title: "Machinist's Mate, Nuclear Power",
    civilianTitles: ['Nuclear Plant Operator', 'Nuclear Engineer', 'Power Plant Manager', 'Reactor Operator', 'Operations Engineer'],
    skills: ['Nuclear Power Systems', 'Reactor Operations', 'Mechanical Systems', 'Steam Systems', 'Safety Procedures', 'Radiation Protection', 'Troubleshooting', 'Technical Documentation', 'Quality Assurance', 'Thermodynamics'],
    certifications: ['NRC Reactor Operator License', 'Nuclear QA Certifications', 'OSHA 10/30'],
    description: 'Operates nuclear propulsion plant mechanical systems',
    branch: 'Navy',
    source: 'builtin',
  },

  'MR': {
    title: 'Machinery Repairman',
    civilianTitles: ['Machinist', 'CNC Operator', 'Tool and Die Maker', 'Precision Machinist'],
    skills: ['Machining', 'CNC Programming', 'Lathe Operations', 'Milling', 'Blueprint Reading', 'Precision Measurement', 'Tool Grinding', 'Welding', 'Quality Control', 'Technical Documentation'],
    certifications: ['CNC Certification', 'Machinist Certification', 'Welding Certification', 'NIMS'],
    description: 'Fabricates and repairs metal parts using machine tools',
    branch: 'Navy',
    source: 'builtin',
  },

  'ND': {
    title: 'Navy Diver',
    civilianTitles: ['Commercial Diver', 'Underwater Welder', 'Salvage Diver', 'Diving Supervisor'],
    skills: ['Underwater Operations', 'Salvage Operations', 'Underwater Welding', 'Demolitions', 'Hyperbaric Systems', 'Mixed Gas Diving', 'Search and Recovery', 'Ship Husbandry', 'Emergency Response', 'Team Leadership'],
    certifications: ['Commercial Diver Certification', 'Underwater Welding Certification', 'ADCI', 'First Aid/CPR'],
    description: 'Performs underwater salvage, construction, and repair',
    branch: 'Navy',
    source: 'builtin',
  },

  'OS': {
    title: 'Operations Specialist',
    civilianTitles: ['Operations Coordinator', 'Air Traffic Controller', 'Radar Operator', 'Operations Analyst', 'Dispatcher'],
    skills: ['Radar Operations', 'Communications', 'Situational Awareness', 'Decision Making', 'Multi-tasking', 'Data Analysis', 'Emergency Response', 'Team Coordination', 'Navigation', 'Reporting'],
    certifications: ['FAA ATC Certification', 'Radar Operator License', 'Security Clearance'],
    description: 'Operates radar and communication systems for tactical operations',
    branch: 'Navy',
    source: 'builtin',
  },

  'PS': {
    title: 'Personnel Specialist',
    civilianTitles: ['HR Specialist', 'Personnel Administrator', 'Benefits Coordinator', 'Payroll Specialist', 'HR Generalist'],
    skills: ['Personnel Administration', 'Benefits Administration', 'Payroll', 'HRIS Systems', 'Records Management', 'Customer Service', 'Data Entry', 'Correspondence', 'Travel Arrangements', 'Policy Compliance'],
    certifications: ['PHR', 'SHRM-CP', 'Payroll Certifications', 'Microsoft Office'],
    description: 'Manages personnel records and administrative services',
    branch: 'Navy',
    source: 'builtin',
  },

  'QM': {
    title: 'Quartermaster',
    civilianTitles: ['Ship Navigator', 'Maritime Operations Specialist', 'Navigation Officer', 'Marine Transportation Specialist'],
    skills: ['Navigation', 'Chart Reading', 'Bridge Operations', 'GPS Systems', 'Meteorology', 'Ship Handling', 'Communications', 'Technical Documentation', 'Safety Procedures', 'Watch Standing'],
    certifications: ['USCG Merchant Mariner Credential', 'TWIC Card', 'Navigation Certifications'],
    description: 'Performs navigation and ship driving duties',
    branch: 'Navy',
    source: 'builtin',
  },

  'RP': {
    title: 'Religious Program Specialist',
    civilianTitles: ['Religious Coordinator', 'Church Administrator', 'Ministry Assistant', 'Chaplain Assistant'],
    skills: ['Religious Program Support', 'Event Planning', 'Counseling Support', 'Administrative Support', 'Budget Management', 'Community Outreach', 'Cultural Sensitivity', 'Crisis Support', 'Documentation', 'Communication'],
    certifications: ['Ministry Certifications', 'Counseling Certifications', 'Event Planning'],
    description: 'Supports religious programs and chaplain services',
    branch: 'Navy',
    source: 'builtin',
  },

  'SB': {
    title: 'Special Warfare Boat Operator',
    civilianTitles: ['Maritime Security Specialist', 'Boat Captain', 'Security Contractor', 'Watercraft Operations Manager'],
    skills: ['Special Operations', 'Small Boat Operations', 'Navigation', 'Weapons Systems', 'Combat Tactics', 'Physical Fitness', 'Team Leadership', 'Mission Planning', 'Communications', 'Emergency Response'],
    certifications: ['USCG Captain License', 'Security Certifications', 'Firearms Certifications'],
    description: 'Operates special warfare craft in support of NSW missions',
    branch: 'Navy',
    source: 'builtin',
  },

  'SO': {
    title: 'Special Warfare Operator',
    civilianTitles: ['Security Consultant', 'Defense Contractor', 'Executive Protection', 'Law Enforcement', 'Tactical Instructor'],
    skills: ['Special Operations', 'Combat Tactics', 'Underwater Operations', 'Parachuting', 'Weapons Proficiency', 'Physical Fitness', 'Team Leadership', 'Mission Planning', 'Intelligence', 'Survival Skills'],
    certifications: ['Security Certifications', 'Firearms Instructor', 'Dive Certifications', 'Parachute Certifications'],
    description: 'Navy SEAL - conducts special operations missions',
    branch: 'Navy',
    source: 'builtin',
  },

  'STG': {
    title: 'Sonar Technician Surface',
    civilianTitles: ['Sonar Technician', 'Acoustic Analyst', 'Marine Electronics Technician', 'Underwater Acoustics Specialist'],
    skills: ['Sonar Systems', 'Acoustic Analysis', 'Anti-Submarine Warfare', 'Electronics Maintenance', 'Data Analysis', 'Troubleshooting', 'Technical Documentation', 'Watch Standing', 'Team Coordination', 'Computer Systems'],
    certifications: ['Electronics Certifications', 'Sonar Certifications', 'Security Clearance'],
    description: 'Operates surface ship sonar systems',
    branch: 'Navy',
    source: 'builtin',
  },

  'STS': {
    title: 'Sonar Technician Submarine',
    civilianTitles: ['Sonar Technician', 'Acoustic Analyst', 'Marine Electronics Technician', 'Defense Contractor'],
    skills: ['Submarine Sonar', 'Acoustic Analysis', 'Anti-Submarine Warfare', 'Electronics Maintenance', 'Data Analysis', 'Troubleshooting', 'Technical Documentation', 'Watch Standing', 'Team Coordination', 'Submarine Operations'],
    certifications: ['Electronics Certifications', 'Sonar Certifications', 'Security Clearance'],
    description: 'Operates submarine sonar systems',
    branch: 'Navy',
    source: 'builtin',
  },

  'SW': {
    title: 'Steelworker',
    civilianTitles: ['Structural Welder', 'Ironworker', 'Steel Fabricator', 'Construction Welder'],
    skills: ['Welding', 'Steel Fabrication', 'Blueprint Reading', 'Rigging', 'Structural Assembly', 'Cutting', 'Safety Procedures', 'Equipment Operation', 'Quality Control', 'Physical Fitness'],
    certifications: ['AWS Welding Certifications', 'Ironworker Certification', 'Rigging Certification', 'OSHA 10/30'],
    description: 'Fabricates and erects steel structures',
    branch: 'Navy',
    source: 'builtin',
  },

  'UT': {
    title: 'Utilitiesman',
    civilianTitles: ['Plumber', 'HVAC Technician', 'Utilities Technician', 'Water Treatment Operator'],
    skills: ['Plumbing', 'HVAC Systems', 'Water Treatment', 'Boiler Operations', 'Air Conditioning', 'Refrigeration', 'Electrical Systems', 'Blueprint Reading', 'Troubleshooting', 'Safety Procedures'],
    certifications: ['Plumber License', 'HVAC Certification', 'EPA 608', 'Water Treatment Certification', 'OSHA 10/30'],
    description: 'Installs and maintains plumbing and HVAC systems',
    branch: 'Navy',
    source: 'builtin',
  },

  'YN': {
    title: 'Yeoman',
    civilianTitles: ['Administrative Assistant', 'Office Manager', 'Executive Assistant', 'Human Resources Coordinator', 'Records Manager'],
    skills: ['Administrative Support', 'Document Management', 'Microsoft Office', 'Scheduling', 'Correspondence', 'Records Management', 'Customer Service', 'Data Entry', 'Travel Coordination', 'Personnel Administration'],
    certifications: ['CAP', 'Microsoft Office Specialist', 'Notary Public', 'HR Certification'],
    description: 'Performs administrative and clerical duties',
    branch: 'Navy',
    source: 'builtin',
  },

  // ============================================================================
  // ARMY MOS - KEY POSITIONS
  // ============================================================================

  '11B': {
    title: 'Infantryman',
    civilianTitles: ['Security Specialist', 'Law Enforcement Officer', 'Security Consultant', 'Protective Services', 'Security Manager'],
    skills: ['Leadership', 'Team Management', 'Risk Assessment', 'Physical Security', 'Crisis Management', 'Firearms Proficiency', 'Tactical Planning', 'Communication', 'Stress Management', 'Decision Making'],
    certifications: ['Security Guard License', 'Firearms Permit', 'First Aid/CPR', 'Close Protection'],
    description: 'Ground combat soldier and rifleman',
    branch: 'Army',
    source: 'builtin',
  },

  '12B': {
    title: 'Combat Engineer',
    civilianTitles: ['Construction Supervisor', 'Demolition Expert', 'Heavy Equipment Operator', 'Project Manager'],
    skills: ['Construction', 'Demolitions', 'Mine Warfare', 'Bridge Building', 'Route Clearance', 'Heavy Equipment', 'Blueprint Reading', 'Leadership', 'Safety Procedures'],
    certifications: ['CDL', 'Heavy Equipment Operator', 'Explosives License', 'OSHA 30', 'PMP'],
    description: 'Constructs and demolishes structures, clears routes',
    branch: 'Army',
    source: 'builtin',
  },

  '15W': {
    title: 'Unmanned Aircraft Systems Operator',
    civilianTitles: ['Drone Operator', 'UAS Pilot', 'Remote Sensing Specialist', 'Aerial Survey Technician'],
    skills: ['UAS Operations', 'Remote Piloting', 'Mission Planning', 'Data Analysis', 'Sensor Operations', 'Technical Documentation', 'Communication', 'Situational Awareness'],
    certifications: ['FAA Part 107', 'UAS Certifications', 'Security Clearance'],
    description: 'Operates Army unmanned aircraft systems',
    branch: 'Army',
    source: 'builtin',
  },

  '17C': {
    title: 'Cyber Operations Specialist',
    civilianTitles: ['Cybersecurity Analyst', 'Penetration Tester', 'SOC Analyst', 'Network Security Engineer'],
    skills: ['Cybersecurity', 'Network Defense', 'Offensive Operations', 'Malware Analysis', 'Penetration Testing', 'Incident Response', 'Programming', 'Digital Forensics'],
    certifications: ['Security+', 'CEH', 'OSCP', 'CISSP', 'GIAC Certifications'],
    description: 'Conducts offensive and defensive cyber operations',
    branch: 'Army',
    source: 'builtin',
  },

  '25B': {
    title: 'Information Technology Specialist',
    civilianTitles: ['IT Specialist', 'Network Administrator', 'Systems Administrator', 'Help Desk Technician'],
    skills: ['Network Administration', 'Windows/Linux', 'Troubleshooting', 'Active Directory', 'Help Desk Support', 'Hardware Repair', 'TCP/IP', 'Customer Service', 'Documentation', 'Security'],
    certifications: ['CompTIA A+', 'Network+', 'Security+', 'CCNA', 'Microsoft Certifications'],
    description: 'Maintains computer systems and networks',
    branch: 'Army',
    source: 'builtin',
  },

  '31B': {
    title: 'Military Police',
    civilianTitles: ['Police Officer', 'Security Officer', 'Corrections Officer', 'Federal Law Enforcement'],
    skills: ['Law Enforcement', 'Investigations', 'Traffic Control', 'Report Writing', 'Firearms Proficiency', 'Physical Security', 'Emergency Response', 'Communications'],
    certifications: ['POST Certification', 'Security Guard License', 'Firearms Certification', 'First Aid/CPR'],
    description: 'Performs law enforcement and security duties',
    branch: 'Army',
    source: 'builtin',
  },

  '35F': {
    title: 'Intelligence Analyst',
    civilianTitles: ['Intelligence Analyst', 'Research Analyst', 'Security Analyst', 'Data Analyst'],
    skills: ['Intelligence Analysis', 'Research', 'Data Analysis', 'Report Writing', 'Briefing', 'Critical Thinking', 'OSINT', 'Geospatial Analysis', 'Threat Assessment', 'Database Management'],
    certifications: ['Security Clearance', 'Intelligence Certifications', 'Data Analytics Certifications'],
    description: 'Analyzes intelligence information',
    branch: 'Army',
    source: 'builtin',
  },

  '42A': {
    title: 'Human Resources Specialist',
    civilianTitles: ['HR Specialist', 'HR Coordinator', 'Personnel Manager', 'Recruiter', 'Administrative Specialist'],
    skills: ['Human Resources', 'Personnel Management', 'HRIS Systems', 'Recruiting', 'Benefits Administration', 'Payroll', 'Employee Relations', 'Compliance', 'Records Management', 'Customer Service'],
    certifications: ['PHR', 'SHRM-CP', 'HR Certifications'],
    description: 'Manages personnel and HR functions',
    branch: 'Army',
    source: 'builtin',
  },

  '68W': {
    title: 'Combat Medic Specialist',
    civilianTitles: ['EMT/Paramedic', 'Emergency Room Technician', 'Medical Assistant', 'Healthcare Specialist'],
    skills: ['Emergency Medicine', 'Trauma Care', 'Patient Assessment', 'CPR/First Aid', 'IV Therapy', 'Medical Documentation', 'Triage', 'Stress Management', 'Team Coordination', 'Medical Equipment'],
    certifications: ['EMT-B', 'EMT-P', 'NREMT', 'BLS/ACLS', 'PHTLS', 'TCCC'],
    description: 'Provides emergency medical treatment',
    branch: 'Army',
    source: 'builtin',
  },

  '88M': {
    title: 'Motor Transport Operator',
    civilianTitles: ['Truck Driver', 'Transportation Specialist', 'Logistics Driver', 'Fleet Driver'],
    skills: ['Commercial Driving', 'Vehicle Maintenance', 'Logistics', 'Map Reading', 'Safety Procedures', 'Load Security', 'Documentation', 'Customer Service'],
    certifications: ['CDL Class A/B', 'HAZMAT Endorsement', 'OSHA 10'],
    description: 'Operates military vehicles for transportation',
    branch: 'Army',
    source: 'builtin',
  },

  '91B': {
    title: 'Wheeled Vehicle Mechanic',
    civilianTitles: ['Diesel Mechanic', 'Fleet Mechanic', 'Automotive Technician', 'Heavy Equipment Mechanic'],
    skills: ['Diesel Engines', 'Vehicle Maintenance', 'Hydraulics', 'Electrical Systems', 'Brake Systems', 'Diagnostic Equipment', 'Preventive Maintenance', 'Welding', 'Parts Management', 'Safety Compliance'],
    certifications: ['ASE Certifications', 'CDL', 'Welding Certification', 'OSHA 10'],
    description: 'Maintains wheeled vehicles',
    branch: 'Army',
    source: 'builtin',
  },

  '92Y': {
    title: 'Unit Supply Specialist',
    civilianTitles: ['Inventory Manager', 'Supply Chain Specialist', 'Warehouse Manager', 'Logistics Coordinator'],
    skills: ['Inventory Management', 'Supply Chain', 'Warehouse Operations', 'Property Accountability', 'Procurement', 'Record Keeping', 'Forklift Operations', 'Shipping/Receiving', 'Vendor Relations', 'ERP Systems'],
    certifications: ['Forklift Certification', 'APICS', 'Lean/Six Sigma'],
    description: 'Manages unit supply operations',
    branch: 'Army',
    source: 'builtin',
  },

  // ============================================================================
  // AIR FORCE AFSC - KEY POSITIONS
  // ============================================================================

  '1B4X1': {
    title: 'Cyber Warfare Operations',
    civilianTitles: ['Cybersecurity Specialist', 'Cyber Operations Analyst', 'Information Security Analyst'],
    skills: ['Cyber Operations', 'Network Security', 'Penetration Testing', 'Incident Response', 'Malware Analysis', 'Scripting', 'Digital Forensics'],
    certifications: ['Security+', 'CEH', 'OSCP', 'CISSP', 'GIAC'],
    description: 'Conducts offensive and defensive cyber operations',
    branch: 'Air Force',
    source: 'builtin',
  },

  '1C1X1': {
    title: 'Air Traffic Control',
    civilianTitles: ['Air Traffic Controller', 'Tower Controller', 'Approach Controller'],
    skills: ['Air Traffic Control', 'Radar Operations', 'Radio Communications', 'Decision Making', 'Stress Management', 'Multi-tasking'],
    certifications: ['FAA ATC Certification', 'FCC License'],
    description: 'Controls air traffic at Air Force installations',
    branch: 'Air Force',
    source: 'builtin',
  },

  '2A5X1': {
    title: 'Aerospace Maintenance',
    civilianTitles: ['Aircraft Mechanic', 'Aviation Maintenance Technician', 'A&P Mechanic'],
    skills: ['Aircraft Maintenance', 'Troubleshooting', 'Technical Documentation', 'Safety Procedures', 'Quality Assurance'],
    certifications: ['FAA A&P License', 'Aviation Maintenance Certifications'],
    description: 'Maintains Air Force aircraft',
    branch: 'Air Force',
    source: 'builtin',
  },

  '3D0X2': {
    title: 'Cyber Systems Operations',
    civilianTitles: ['Cybersecurity Analyst', 'Network Administrator', 'Systems Administrator'],
    skills: ['Cybersecurity', 'Network Administration', 'System Administration', 'Incident Response', 'Security Monitoring'],
    certifications: ['Security+', 'CySA+', 'CISSP', 'CEH', 'CCNA'],
    description: 'Manages cyber systems operations',
    branch: 'Air Force',
    source: 'builtin',
  },

  '3E0X1': {
    title: 'Electrical Systems',
    civilianTitles: ['Electrician', 'Electrical Technician', 'Power Systems Technician'],
    skills: ['Electrical Systems', 'Power Distribution', 'Troubleshooting', 'NEC Compliance', 'Blueprint Reading'],
    certifications: ['Journeyman/Master Electrician', 'OSHA 10/30', 'NFPA 70E'],
    description: 'Installs and maintains electrical systems',
    branch: 'Air Force',
    source: 'builtin',
  },

  '3P0X1': {
    title: 'Security Forces',
    civilianTitles: ['Police Officer', 'Security Officer', 'Law Enforcement', 'Corrections Officer'],
    skills: ['Law Enforcement', 'Security Operations', 'Investigations', 'Force Protection', 'Firearms', 'Report Writing'],
    certifications: ['POST Certification', 'Security Guard License', 'Firearms Certification'],
    description: 'Provides security and law enforcement',
    branch: 'Air Force',
    source: 'builtin',
  },

  '4N0X1': {
    title: 'Aerospace Medical Service',
    civilianTitles: ['Medical Technician', 'EMT', 'Medical Assistant', 'Healthcare Specialist'],
    skills: ['Patient Care', 'Medical Procedures', 'Emergency Medicine', 'Medical Documentation', 'Clinical Support'],
    certifications: ['EMT-B', 'CNA', 'Medical Assistant', 'BLS'],
    description: 'Provides medical services and patient care',
    branch: 'Air Force',
    source: 'builtin',
  },

  // ============================================================================
  // MARINE CORPS MOS - KEY POSITIONS
  // ============================================================================

  '0311': {
    title: 'Rifleman',
    civilianTitles: ['Security Specialist', 'Law Enforcement', 'Security Consultant', 'Executive Protection'],
    skills: ['Leadership', 'Team Operations', 'Tactical Planning', 'Risk Assessment', 'Physical Security', 'Firearms', 'Communication', 'Stress Management', 'Decision Making', 'Training'],
    certifications: ['Security Certifications', 'Firearms License', 'First Aid/CPR'],
    description: 'Infantry rifleman and ground combat specialist',
    branch: 'Marines',
    source: 'builtin',
  },

  '0651': {
    title: 'Cyber Network Operator',
    civilianTitles: ['Network Administrator', 'IT Specialist', 'Cybersecurity Technician', 'Systems Administrator'],
    skills: ['Network Administration', 'Cybersecurity', 'System Administration', 'Troubleshooting', 'TCP/IP', 'Windows/Linux', 'Network Security', 'Incident Response', 'Help Desk', 'Documentation'],
    certifications: ['Security+', 'Network+', 'CCNA', 'A+'],
    description: 'Manages and secures network operations',
    branch: 'Marines',
    source: 'builtin',
  },

  '1371': {
    title: 'Combat Engineer',
    civilianTitles: ['Construction Supervisor', 'Heavy Equipment Operator', 'Demolition Expert'],
    skills: ['Construction', 'Demolitions', 'Mine Warfare', 'Heavy Equipment', 'Blueprint Reading', 'Leadership'],
    certifications: ['CDL', 'Heavy Equipment Operator', 'Explosives License', 'OSHA 30'],
    description: 'Constructs and demolishes structures in combat',
    branch: 'Marines',
    source: 'builtin',
  },

  '3043': {
    title: 'Supply Administration and Operations Specialist',
    civilianTitles: ['Supply Chain Manager', 'Logistics Coordinator', 'Inventory Manager'],
    skills: ['Supply Chain', 'Inventory Management', 'Procurement', 'Database Administration', 'Documentation', 'Customer Service'],
    certifications: ['APICS', 'Supply Chain Certifications', 'Forklift'],
    description: 'Manages supply and logistics operations',
    branch: 'Marines',
    source: 'builtin',
  },

  '3531': {
    title: 'Motor Vehicle Operator',
    civilianTitles: ['Truck Driver', 'Transportation Specialist', 'Fleet Driver'],
    skills: ['Commercial Driving', 'Vehicle Maintenance', 'Logistics', 'Safety Procedures', 'Documentation'],
    certifications: ['CDL Class A/B', 'HAZMAT Endorsement'],
    description: 'Operates military motor vehicles',
    branch: 'Marines',
    source: 'builtin',
  },

  '5811': {
    title: 'Military Police',
    civilianTitles: ['Police Officer', 'Security Officer', 'Corrections Officer'],
    skills: ['Law Enforcement', 'Security Operations', 'Investigations', 'Report Writing', 'Firearms'],
    certifications: ['POST Certification', 'Security Guard License', 'Firearms Certification'],
    description: 'Performs law enforcement and security duties',
    branch: 'Marines',
    source: 'builtin',
  },

  // ============================================================================
  // COAST GUARD RATINGS
  // ============================================================================

  'AMT': {
    title: 'Aviation Maintenance Technician',
    civilianTitles: ['Aircraft Mechanic', 'Aviation Maintenance Technician', 'A&P Mechanic'],
    skills: ['Aircraft Maintenance', 'Troubleshooting', 'Technical Documentation', 'Safety Procedures', 'Quality Assurance'],
    certifications: ['FAA A&P License', 'Helicopter Type Ratings'],
    description: 'Maintains Coast Guard aircraft',
    branch: 'Coast Guard',
    source: 'builtin',
  },

  'AST': {
    title: 'Aviation Survival Technician',
    civilianTitles: ['Search and Rescue Specialist', 'Paramedic', 'Emergency Medical Technician'],
    skills: ['Search and Rescue', 'Emergency Medicine', 'Survival Training', 'Swimming', 'Physical Fitness'],
    certifications: ['EMT-P', 'Rescue Swimmer', 'First Aid Instructor'],
    description: 'Coast Guard rescue swimmer and survival specialist',
    branch: 'Coast Guard',
    source: 'builtin',
  },

  'IT_CG': {
    title: 'Information Systems Technician (Coast Guard)',
    civilianTitles: ['IT Specialist', 'Network Administrator', 'Systems Administrator'],
    skills: ['Network Administration', 'System Administration', 'Troubleshooting', 'Cybersecurity'],
    certifications: ['CompTIA Security+', 'Network+', 'A+', 'CCNA'],
    description: 'Maintains IT systems for the Coast Guard',
    branch: 'Coast Guard',
    source: 'builtin',
  },

  'ME': {
    title: 'Maritime Enforcement Specialist',
    civilianTitles: ['Law Enforcement Officer', 'Security Specialist', 'Customs Officer'],
    skills: ['Law Enforcement', 'Boarding Operations', 'Investigations', 'Firearms', 'Report Writing'],
    certifications: ['Law Enforcement Certifications', 'Firearms Certifications'],
    description: 'Performs maritime law enforcement',
    branch: 'Coast Guard',
    source: 'builtin',
  },

  'MK': {
    title: 'Machinery Technician',
    civilianTitles: ['Marine Engineer', 'Diesel Mechanic', 'Marine Technician'],
    skills: ['Marine Propulsion', 'Diesel Engines', 'HVAC', 'Hydraulics', 'Troubleshooting'],
    certifications: ['Marine Engineering Certifications', 'OSHA 10/30'],
    description: 'Operates and maintains propulsion systems',
    branch: 'Coast Guard',
    source: 'builtin',
  },

  'MST': {
    title: 'Marine Science Technician',
    civilianTitles: ['Environmental Scientist', 'Marine Inspector', 'Safety Inspector'],
    skills: ['Environmental Protection', 'Marine Safety', 'Inspections', 'Regulations', 'Report Writing'],
    certifications: ['Environmental Certifications', 'Marine Safety Certifications'],
    description: 'Performs marine safety and environmental protection',
    branch: 'Coast Guard',
    source: 'builtin',
  },
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getMOSData(code: string): MOSData | null {
  if (!code) return null

  const upperCode = code.toUpperCase().trim()

  if (MOS_RATINGS[upperCode]) {
    return { ...MOS_RATINGS[upperCode], source: 'builtin' }
  }

  const noUnderscore = upperCode.replace(/_/g, '')
  if (MOS_RATINGS[noUnderscore]) {
    return { ...MOS_RATINGS[noUnderscore], source: 'builtin' }
  }

  return getGenericFallback(upperCode)
}

function inferCategoryFromMOS(mosCode: string): string {
  const code = mosCode.toUpperCase()

  if (['HM'].includes(code)) return 'medical'
  if (['IT', 'ET', 'FC', 'CTN', 'CTR', 'CTT', 'CTI', 'CTM'].includes(code)) return 'it'
  if (['YN', 'PS', 'RP', 'LN'].includes(code)) return 'admin'
  if (['DC', 'HT', 'MR', 'EM', 'MM', 'EN', 'GSE', 'GSM', 'UT'].includes(code)) return 'technical'
  if (['LS'].includes(code)) return 'logistics'
  if (['IS'].includes(code)) return 'intel'
  if (['GM', 'MA', 'BM', 'SO', 'SB', 'EOD', 'ND'].includes(code)) return 'combat'

  if (code.startsWith('A')) return 'aviation'
  if (code.startsWith('11') || code.startsWith('18') || code.startsWith('19')) return 'combat'
  if (code.startsWith('68')) return 'medical'
  if (code.startsWith('25') || code.startsWith('17')) return 'it'
  if (code.startsWith('42')) return 'admin'
  if (code.startsWith('91') || code.startsWith('94')) return 'technical'
  if (code.startsWith('92') || code.startsWith('88')) return 'logistics'
  if (code.startsWith('35')) return 'intel'
  if (code.startsWith('15')) return 'aviation'

  if (code.startsWith('1N')) return 'intel'
  if (code.startsWith('3D') || code.startsWith('1B')) return 'it'
  if (code.startsWith('4N')) return 'medical'
  if (code.startsWith('2A')) return 'technical'
  if (code.startsWith('2T')) return 'logistics'
  if (code.startsWith('3P')) return 'combat'

  if (code.startsWith('03')) return 'combat'
  if (code.startsWith('06')) return 'it'
  if (code.startsWith('01')) return 'admin'
  if (code.startsWith('30') || code.startsWith('35')) return 'logistics'
  if (code.startsWith('02')) return 'intel'

  return 'leadership'
}

const GENERIC_SKILLS: Record<string, string[]> = {
  'combat': ['Leadership', 'Team Coordination', 'Crisis Management', 'Risk Assessment', 'Physical Fitness', 'Tactical Planning', 'Communication', 'Stress Management', 'Decision Making', 'Weapons Proficiency'],
  'medical': ['Patient Care', 'Emergency Response', 'Medical Terminology', 'CPR/First Aid', 'Documentation', 'HIPAA Compliance', 'Vital Signs', 'Triage', 'Communication', 'Stress Management'],
  'admin': ['Microsoft Office', 'Data Entry', 'Record Management', 'Customer Service', 'Scheduling', 'Correspondence', 'Filing Systems', 'Communication', 'Attention to Detail', 'Time Management'],
  'technical': ['Troubleshooting', 'Equipment Maintenance', 'Technical Documentation', 'Quality Control', 'Safety Procedures', 'Calibration', 'Testing', 'Repair', 'Blueprint Reading', 'Tool Operation'],
  'it': ['Network Administration', 'Troubleshooting', 'System Administration', 'Help Desk Support', 'TCP/IP', 'Windows/Linux', 'Cybersecurity', 'Documentation', 'Customer Service', 'Hardware Repair'],
  'logistics': ['Inventory Management', 'Supply Chain', 'Shipping/Receiving', 'Warehouse Operations', 'Forklift Operation', 'ERP Systems', 'Procurement', 'Vendor Management', 'Record Keeping', 'Cost Analysis'],
  'intel': ['Research', 'Analysis', 'Report Writing', 'Briefing', 'Critical Thinking', 'Data Analysis', 'Attention to Detail', 'Communication', 'OSINT', 'Pattern Recognition'],
  'aviation': ['Aircraft Systems', 'Safety Procedures', 'Technical Documentation', 'Troubleshooting', 'Quality Assurance', 'Team Coordination', 'Communication', 'Attention to Detail', 'Physical Fitness', 'Emergency Response'],
  'leadership': ['Team Leadership', 'Personnel Management', 'Training & Development', 'Performance Evaluation', 'Strategic Planning', 'Decision Making', 'Conflict Resolution', 'Communication', 'Mentoring', 'Project Management'],
}

const CIVILIAN_TITLES: Record<string, string[]> = {
  'combat': ['Security Specialist', 'Law Enforcement Officer', 'Security Manager', 'Protective Services', 'Emergency Services'],
  'medical': ['Healthcare Specialist', 'EMT/Paramedic', 'Medical Assistant', 'Patient Care Technician', 'Healthcare Coordinator'],
  'admin': ['Administrative Coordinator', 'Office Manager', 'Executive Assistant', 'HR Specialist', 'Operations Coordinator'],
  'technical': ['Maintenance Technician', 'Equipment Specialist', 'Field Service Technician', 'Quality Control Technician', 'Technical Specialist'],
  'it': ['IT Specialist', 'Network Administrator', 'Systems Administrator', 'Help Desk Technician', 'Technical Support Specialist'],
  'logistics': ['Logistics Coordinator', 'Supply Chain Specialist', 'Inventory Manager', 'Warehouse Supervisor', 'Materials Handler'],
  'intel': ['Research Analyst', 'Intelligence Analyst', 'Security Analyst', 'Data Analyst', 'Business Analyst'],
  'aviation': ['Aviation Technician', 'Aircraft Mechanic', 'Flight Operations Specialist', 'Aviation Safety Specialist', 'Aerospace Technician'],
  'leadership': ['Operations Manager', 'Team Lead', 'Supervisor', 'Project Coordinator', 'Department Manager'],
}

function getGenericFallback(mosCode: string): MOSData {
  const category = inferCategoryFromMOS(mosCode)
  const skills = GENERIC_SKILLS[category] || GENERIC_SKILLS['leadership']
  const civilianTitles = CIVILIAN_TITLES[category] || CIVILIAN_TITLES['leadership']

  return {
    title: `${mosCode} Specialist`,
    civilianTitles,
    skills,
    certifications: [],
    description: `Generic recommendations based on ${category} category`,
    branch: 'Navy',
    source: 'builtin',
  }
}

export function searchMOS(query: string): Array<{ code: string; data: MOSData }> {
  const lowerQuery = query.toLowerCase().trim()
  const results: Array<{ code: string; data: MOSData }> = []

  Object.entries(MOS_RATINGS).forEach(([code, data]) => {
    if (
      code.toLowerCase().includes(lowerQuery) ||
      data.title.toLowerCase().includes(lowerQuery)
    ) {
      results.push({ code, data: { ...data, source: 'builtin' } })
    }
  })

  return results.slice(0, 15)
}

export function formatDateForDB(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr
  if (dateStr.match(/^\d{4}-\d{2}$/)) return `${dateStr}-01`
  return dateStr
}

export function formatDateForInput(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}/)) return dateStr.substring(0, 7)
  return dateStr
}
