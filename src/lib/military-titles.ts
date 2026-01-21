// Military to Civilian Job Title Mappings
export const MILITARY_TO_CIVILIAN: Record<string, string[]> = {
  // Navy Ratings
  'damage controlman': ['Safety Manager', 'EHS Director', 'Emergency Management Specialist', 'Facilities Manager', 'Fire Protection Engineer', 'OSHA Compliance Manager'],
  'damage controlman chief': ['Safety Director', 'EHS Manager', 'Emergency Preparedness Director', 'Facilities Director', 'Senior Safety Manager'],
  'dc': ['Safety Manager', 'EHS Director', 'Emergency Management Specialist', 'Facilities Manager'],
  'dcc': ['Safety Manager', 'EHS Supervisor', 'Emergency Management Coordinator'],
  'dccs': ['Senior Safety Manager', 'EHS Director', 'Emergency Management Director'],

  'information systems technician': ['IT Support Specialist', 'Network Administrator', 'Systems Administrator', 'Help Desk Manager', 'Cybersecurity Analyst'],
  'it': ['IT Specialist', 'Network Administrator', 'Systems Administrator', 'Cybersecurity Analyst'],
  'itc': ['IT Manager', 'Network Operations Manager', 'Systems Engineering Lead'],

  'hospital corpsman': ['Medical Assistant', 'EMT/Paramedic', 'Healthcare Administrator', 'Clinical Coordinator', 'Patient Care Technician'],
  'hm': ['Medical Assistant', 'EMT/Paramedic', 'Healthcare Coordinator'],

  'yeoman': ['Administrative Assistant', 'Office Manager', 'Executive Assistant', 'Human Resources Coordinator', 'Records Manager'],
  'yn': ['Administrative Assistant', 'Office Manager', 'Executive Assistant', 'HR Coordinator'],

  'logistics specialist': ['Supply Chain Manager', 'Inventory Manager', 'Procurement Specialist', 'Logistics Coordinator', 'Warehouse Manager'],
  'ls': ['Supply Chain Manager', 'Inventory Manager', 'Procurement Specialist', 'Logistics Coordinator'],

  'operations specialist': ['Operations Coordinator', 'Dispatcher', 'Air Traffic Controller', 'Operations Analyst', 'Control Room Operator'],
  'os': ['Operations Coordinator', 'Dispatcher', 'Operations Analyst'],

  'electricians mate': ['Electrician', 'Electrical Engineer', 'Maintenance Technician', 'Power Plant Operator', 'Electrical Supervisor'],
  'em': ['Electrician', 'Electrical Technician', 'Maintenance Technician'],

  'machinist mate': ['Mechanical Engineer', 'Plant Operator', 'Maintenance Supervisor', 'HVAC Technician', 'Industrial Mechanic'],
  'mm': ['Mechanical Technician', 'Plant Operator', 'Industrial Mechanic'],

  'gunners mate': ['Weapons Systems Technician', 'Armorer', 'Security Specialist', 'Ordnance Handler', 'Quality Assurance Inspector'],
  'gm': ['Security Specialist', 'Weapons Technician', 'Quality Inspector'],

  'boatswains mate': ['Deck Supervisor', 'Maritime Operations Manager', 'Cargo Operations Manager', 'Marine Coordinator'],
  'bm': ['Deck Supervisor', 'Operations Supervisor', 'Cargo Manager'],

  'culinary specialist': ['Executive Chef', 'Food Service Manager', 'Culinary Director', 'Kitchen Manager', 'Catering Manager'],
  'cs': ['Chef', 'Food Service Manager', 'Kitchen Supervisor'],

  'fire controlman': ['Weapons Systems Engineer', 'Radar Technician', 'Electronics Technician', 'Systems Integration Specialist'],
  'fc': ['Electronics Technician', 'Systems Technician', 'Radar Technician'],

  'aviation boatswains mate': ['Aircraft Handler', 'Ground Support Equipment Operator', 'Aviation Operations Coordinator', 'Flight Deck Supervisor'],
  'ab': ['Aviation Ground Support', 'Aircraft Handler', 'Operations Coordinator'],

  // Army MOS
  '11b': ['Security Officer', 'Law Enforcement Officer', 'Security Consultant', 'Private Security', 'Protective Services'],
  '11b infantryman': ['Security Specialist', 'Tactical Operations Coordinator', 'Security Consultant'],
  'infantryman': ['Security Specialist', 'Law Enforcement', 'Security Consultant'],
  '25b': ['IT Specialist', 'Network Administrator', 'Systems Administrator', 'Help Desk Technician'],
  '68w': ['EMT/Paramedic', 'Medical Assistant', 'Healthcare Coordinator', 'Emergency Services'],
  'combat medic': ['EMT/Paramedic', 'Emergency Medical Technician', 'Healthcare Specialist'],
  '42a': ['Human Resources Specialist', 'Administrative Coordinator', 'Personnel Manager', 'Recruiter'],
  '92y': ['Inventory Manager', 'Warehouse Supervisor', 'Supply Chain Coordinator', 'Logistics Specialist'],
  '35f': ['Intelligence Analyst', 'Research Analyst', 'Security Analyst', 'Data Analyst'],
  '91b': ['Diesel Mechanic', 'Heavy Equipment Mechanic', 'Fleet Maintenance Technician'],

  // Air Force AFSC
  '3d0x2': ['Cybersecurity Analyst', 'Network Security Engineer', 'Information Security Specialist'],
  '1n0x1': ['Operations Intelligence Analyst', 'Intelligence Specialist', 'Research Analyst'],
  '2a3x3': ['Aircraft Mechanic', 'Aviation Maintenance Technician', 'A&P Mechanic'],
  '3e5x1': ['HVAC Technician', 'Facilities Engineer', 'Building Systems Technician'],

  // Marine Corps
  '0311': ['Security Specialist', 'Law Enforcement', 'Tactical Operations', 'Security Consultant'],
  '0651': ['Network Administrator', 'IT Specialist', 'Cybersecurity Technician'],
  '3043': ['Supply Chain Manager', 'Logistics Coordinator', 'Inventory Manager'],

  // Leadership Positions (All Branches)
  'chief petty officer': ['Operations Manager', 'Department Supervisor', 'Team Lead', 'Program Manager'],
  'cpo': ['Operations Manager', 'Department Supervisor', 'Team Lead'],
  'senior chief petty officer': ['Senior Operations Manager', 'Division Manager', 'Program Director', 'Operations Director'],
  'senior chief': ['Senior Manager', 'Division Director', 'Program Director'],
  'scpo': ['Senior Operations Manager', 'Division Manager', 'Program Director'],
  'master chief petty officer': ['Director of Operations', 'Senior Director', 'VP of Operations', 'Chief Operating Officer'],
  'master chief': ['Director', 'Senior Director', 'VP of Operations'],
  'mcpo': ['Director of Operations', 'Senior Director', 'VP Operations'],

  'first sergeant': ['Operations Manager', 'HR Manager', 'Administrative Director', 'Personnel Director'],
  '1sg': ['Operations Manager', 'HR Director', 'Administrative Manager'],
  'sergeant major': ['Senior Operations Manager', 'Executive Manager', 'Chief Administrative Officer'],
  'sgm': ['Senior Manager', 'Executive Director', 'Chief Administrative Officer'],
  'sergeant first class': ['Senior Supervisor', 'Operations Manager', 'Team Lead'],
  'sfc': ['Senior Supervisor', 'Operations Manager', 'Department Lead'],
  'staff sergeant': ['Supervisor', 'Team Lead', 'Section Manager'],
  'ssg': ['Supervisor', 'Team Lead', 'Shift Manager'],

  'platoon sergeant': ['Team Supervisor', 'Operations Supervisor', 'Shift Manager'],
  'squad leader': ['Team Lead', 'Shift Supervisor', 'Group Leader'],
  'section leader': ['Section Supervisor', 'Team Lead', 'Department Lead'],

  // Officer Positions
  'division officer': ['Department Manager', 'Division Manager', 'Operations Manager'],
  'department head': ['Director', 'Department Director', 'Senior Manager'],
  'executive officer': ['Chief Operating Officer', 'Deputy Director', 'Vice President Operations'],
  'xo': ['Chief Operating Officer', 'Deputy Director', 'Executive VP'],
  'commanding officer': ['CEO', 'Executive Director', 'President', 'General Manager'],
  'co': ['Executive Director', 'General Manager', 'President'],

  // Common Military Terms
  'ncoic': ['Supervisor', 'Team Lead', 'Section Manager', 'Shift Supervisor'],
  'oic': ['Director', 'Manager', 'Department Head'],
  'lpo': ['Lead Technician', 'Senior Specialist', 'Team Lead'],
  'lcpo': ['Department Lead', 'Senior Supervisor', 'Operations Lead'],
  'workcenter supervisor': ['Shift Supervisor', 'Team Lead', 'Production Supervisor'],
  'watch officer': ['Operations Manager', 'Duty Manager', 'Shift Director'],
  'duty officer': ['Operations Manager', 'On-Call Manager', 'Shift Supervisor'],

  // Training & Education
  'instructor': ['Training Specialist', 'Corporate Trainer', 'Technical Instructor', 'Learning & Development Specialist'],
  'training chief': ['Training Manager', 'L&D Director', 'Education Program Manager'],
  'drill instructor': ['Training Coordinator', 'Leadership Development Specialist', 'Performance Coach'],
  'di': ['Training Specialist', 'Leadership Coach', 'Performance Trainer'],

  // Inspector Roles
  'inspector': ['Quality Assurance Inspector', 'Compliance Auditor', 'Safety Inspector', 'QA Analyst'],
  'assessor': ['Assessment Specialist', 'Compliance Analyst', 'Quality Auditor', 'Evaluation Specialist'],

  // Program/Project roles
  'program manager': ['Program Manager', 'Project Manager', 'Portfolio Manager', 'Operations Manager'],
  'project officer': ['Project Manager', 'Project Coordinator', 'Program Analyst'],

  // General Terms
  'technician': ['Technician', 'Specialist', 'Technical Specialist', 'Service Technician'],
  'specialist': ['Specialist', 'Analyst', 'Coordinator', 'Technical Specialist'],
  'supervisor': ['Supervisor', 'Team Lead', 'Manager', 'Coordinator'],
  'manager': ['Manager', 'Director', 'Supervisor', 'Lead'],
  'chief': ['Director', 'Manager', 'Chief', 'Head'],
  'officer': ['Manager', 'Director', 'Coordinator', 'Specialist'],
}

// Function to find matching civilian titles
export function findCivilianTitles(militaryTitle: string): string[] {
  if (!militaryTitle || militaryTitle.length < 2) return []

  const searchTerm = militaryTitle.toLowerCase().trim()
  const results = new Set<string>()

  // Check for exact match first
  if (MILITARY_TO_CIVILIAN[searchTerm]) {
    MILITARY_TO_CIVILIAN[searchTerm].forEach(t => results.add(t))
  }

  // Check for partial matches
  Object.entries(MILITARY_TO_CIVILIAN).forEach(([key, titles]) => {
    if (key.includes(searchTerm) || searchTerm.includes(key)) {
      titles.forEach(t => results.add(t))
    }
  })

  // Also check if any word matches
  const words = searchTerm.split(/\s+/)
  words.forEach(word => {
    if (word.length >= 2 && MILITARY_TO_CIVILIAN[word]) {
      MILITARY_TO_CIVILIAN[word].forEach(t => results.add(t))
    }
  })

  return Array.from(results).slice(0, 8) // Limit to 8 suggestions
}

// Helper to format dates for database (YYYY-MM -> YYYY-MM-01)
export function formatDateForDB(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null
  // Already has day
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr
  // Just month (YYYY-MM)
  if (dateStr.match(/^\d{4}-\d{2}$/)) return `${dateStr}-01`
  return dateStr
}

// Helper to format date for display (YYYY-MM-DD -> YYYY-MM)
export function formatDateForInput(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  // If full date, extract just month
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}/)) return dateStr.substring(0, 7)
  return dateStr
}
