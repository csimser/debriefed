-- Create dict_cert_funding and dict_funding_programs tables
-- These link certifications to veteran funding programs (COOL, GI Bill, VET TEC, etc.)

-- Funding programs table
CREATE TABLE IF NOT EXISTS dict_funding_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_name TEXT NOT NULL,
  program_code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  eligibility TEXT NOT NULL DEFAULT '',
  branches TEXT[] NOT NULL DEFAULT '{}',
  status_required TEXT,
  website_url TEXT,
  how_to_apply TEXT,
  key_benefits TEXT[] NOT NULL DEFAULT '{}',
  limitations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cert → funding program mapping table
CREATE TABLE IF NOT EXISTS dict_cert_funding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cert_keyword TEXT NOT NULL,
  funding_program_code TEXT NOT NULL REFERENCES dict_funding_programs(program_code),
  branch TEXT,
  notes TEXT,
  direct_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cert_funding_keyword ON dict_cert_funding(cert_keyword);
CREATE INDEX IF NOT EXISTS idx_cert_funding_program ON dict_cert_funding(funding_program_code);
CREATE INDEX IF NOT EXISTS idx_funding_programs_code ON dict_funding_programs(program_code);

-- RLS
ALTER TABLE dict_funding_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dict_cert_funding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read funding programs" ON dict_funding_programs
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read cert funding" ON dict_cert_funding
  FOR SELECT USING (true);

-- ============================================================================
-- Seed: Funding Programs
-- ============================================================================

INSERT INTO dict_funding_programs (program_name, program_code, description, eligibility, branches, status_required, website_url, how_to_apply, key_benefits, limitations) VALUES
(
  'Navy COOL', 'NAVY_COOL',
  'Navy Credentialing Opportunities On-Line — pays for certification exams and licensure for active duty Navy personnel',
  'Active duty Navy enlisted and officers',
  ARRAY['Navy'], 'Active Duty',
  'https://www.cool.osd.mil/usn/',
  'Submit voucher request through Navy COOL website with command approval',
  ARRAY['Pays exam fees', 'Covers licensure costs', 'No out-of-pocket cost', 'Multiple attempts allowed'],
  'Must be active duty; funding subject to availability'
),
(
  'Army COOL', 'ARMY_COOL',
  'Army Credentialing Assistance — funds certification exams and licensure for active duty Army personnel',
  'Active duty Army enlisted and officers',
  ARRAY['Army'], 'Active Duty',
  'https://www.cool.osd.mil/army/',
  'Submit request through Army COOL website with supervisor approval',
  ARRAY['Pays exam fees', 'Covers licensure costs', 'No out-of-pocket cost'],
  'Must be active duty; some certs require command approval'
),
(
  'Air Force COOL', 'AF_COOL',
  'Air Force Credentialing Opportunities On-Line — funds certification exams for active duty Air Force personnel',
  'Active duty Air Force enlisted and officers',
  ARRAY['Air Force'], 'Active Duty',
  'https://www.cool.osd.mil/usaf/',
  'Submit voucher request through AF COOL portal',
  ARRAY['Pays exam fees', 'Covers licensure costs', 'Multiple certifications allowed'],
  'Must be active duty; funding subject to fiscal year budget'
),
(
  'Marine Corps COOL', 'USMC_COOL',
  'Marine Corps Credentialing Opportunities On-Line — funds certification exams for active duty Marines',
  'Active duty Marine Corps enlisted and officers',
  ARRAY['Marine Corps', 'Marines'], 'Active Duty',
  'https://www.cool.osd.mil/usmc/',
  'Submit request through USMC COOL website',
  ARRAY['Pays exam fees', 'Covers licensure costs'],
  'Must be active duty'
),
(
  'Coast Guard COOL', 'USCG_COOL',
  'Coast Guard Credentialing Opportunities On-Line — funds certification exams for active duty Coast Guard',
  'Active duty Coast Guard enlisted and officers',
  ARRAY['Coast Guard'], 'Active Duty',
  'https://www.cool.osd.mil/uscg/',
  'Submit request through Coast Guard COOL portal',
  ARRAY['Pays exam fees', 'Covers licensure costs'],
  'Must be active duty'
),
(
  'GI Bill', 'GI_BILL',
  'Post-9/11 GI Bill covers education and certification costs for eligible veterans and service members',
  'Veterans with 90+ days active duty after 9/10/2001, or 30+ days with service-connected disability discharge',
  ARRAY['All', 'Army', 'Navy', 'Air Force', 'Marine Corps', 'Coast Guard'], NULL,
  'https://www.va.gov/education/about-gi-bill-benefits/',
  'Apply through VA.gov; receive Certificate of Eligibility',
  ARRAY['Covers tuition and fees', 'Monthly housing allowance', 'Book stipend', 'Certification exam reimbursement'],
  '36 months of benefits; must use within 15 years of separation'
),
(
  'VET TEC', 'VET_TEC',
  'Veteran Employment Through Technology Education Courses — pays for high-tech training programs',
  'Veterans eligible for GI Bill (does not reduce GI Bill entitlement)',
  ARRAY['All', 'Army', 'Navy', 'Air Force', 'Marine Corps', 'Coast Guard'], NULL,
  'https://www.va.gov/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/',
  'Apply through VA.gov VET TEC program page',
  ARRAY['Full tuition coverage', 'Housing allowance during training', 'Does NOT reduce GI Bill balance', 'IT and computer science focus'],
  'Limited to approved high-tech training providers'
),
(
  'DoD SkillBridge', 'SKILLBRIDGE',
  'DoD SkillBridge allows active duty members to intern with civilian employers during last 180 days of service',
  'Active duty within 180 days of separation',
  ARRAY['All', 'Army', 'Navy', 'Air Force', 'Marine Corps', 'Coast Guard'], 'Active Duty (within 180 days of separation)',
  'https://skillbridge.osd.mil/',
  'Work with transition office and find approved SkillBridge employer',
  ARRAY['Real civilian work experience', 'Continue military pay and benefits', 'Often leads to job offers', 'Up to 180 days'],
  'Requires command approval; must be within 180 days of separation'
),
(
  'MyCAA', 'MYCAA',
  'Military Spouse Career Advancement Account — up to $4,000 for education and training',
  'Spouses of active duty E1-E5, W1-W2, O1-O2',
  ARRAY['All'], 'Active Duty (spouse)',
  'https://myseco.militaryonesource.mil/portal/article/mycaa-702',
  'Apply through Military OneSource MySECO portal',
  ARRAY['Up to $4,000 financial assistance', 'Covers certifications and licenses', 'Covers associate degrees'],
  'Limited to spouses of junior enlisted/officers; portable career fields only'
)
ON CONFLICT (program_code) DO NOTHING;

-- ============================================================================
-- Seed: Cert → Funding Mappings
-- ============================================================================

-- PMP
INSERT INTO dict_cert_funding (cert_keyword, funding_program_code, branch, notes) VALUES
('PMP', 'NAVY_COOL', 'Navy', 'Project Management Professional — covered under Navy COOL'),
('PMP', 'ARMY_COOL', 'Army', 'Project Management Professional — covered under Army CA'),
('PMP', 'AF_COOL', 'Air Force', 'Project Management Professional — covered under AF COOL'),
('PMP', 'USMC_COOL', 'Marine Corps', 'Project Management Professional — covered under USMC COOL'),
('PMP', 'GI_BILL', NULL, 'PMP exam fee reimbursable under GI Bill');

-- CompTIA Security+
INSERT INTO dict_cert_funding (cert_keyword, funding_program_code, branch, notes) VALUES
('CompTIA Security+', 'NAVY_COOL', 'Navy', 'DoD 8570 baseline cert — high priority for COOL funding'),
('CompTIA Security+', 'ARMY_COOL', 'Army', 'DoD 8570 baseline cert — high priority for Army CA'),
('CompTIA Security+', 'AF_COOL', 'Air Force', 'DoD 8570 baseline cert — high priority for AF COOL'),
('CompTIA Security+', 'USMC_COOL', 'Marine Corps', 'DoD 8570 baseline cert — covered under USMC COOL'),
('CompTIA Security+', 'GI_BILL', NULL, 'Exam fee reimbursable under GI Bill'),
('CompTIA Security+', 'VET_TEC', NULL, 'Often included in VET TEC cybersecurity programs');

-- CISSP
INSERT INTO dict_cert_funding (cert_keyword, funding_program_code, branch, notes) VALUES
('CISSP', 'NAVY_COOL', 'Navy', 'CISSP covered under Navy COOL for IAM/IAT Level III'),
('CISSP', 'ARMY_COOL', 'Army', 'CISSP covered under Army CA'),
('CISSP', 'AF_COOL', 'Air Force', 'CISSP covered under AF COOL'),
('CISSP', 'GI_BILL', NULL, 'CISSP exam fee reimbursable under GI Bill');

-- AWS
INSERT INTO dict_cert_funding (cert_keyword, funding_program_code, branch, notes) VALUES
('AWS', 'VET_TEC', NULL, 'AWS certifications often included in VET TEC cloud programs'),
('AWS', 'GI_BILL', NULL, 'AWS exam fees reimbursable under GI Bill'),
('AWS Solutions Architect', 'VET_TEC', NULL, 'Included in approved VET TEC cloud training programs'),
('AWS Solutions Architect', 'GI_BILL', NULL, 'Exam fee reimbursable under GI Bill');

-- CompTIA A+ and Network+
INSERT INTO dict_cert_funding (cert_keyword, funding_program_code, branch, notes) VALUES
('CompTIA A+', 'NAVY_COOL', 'Navy', 'Covered under Navy COOL'),
('CompTIA A+', 'ARMY_COOL', 'Army', 'Covered under Army CA'),
('CompTIA A+', 'AF_COOL', 'Air Force', 'Covered under AF COOL'),
('CompTIA A+', 'GI_BILL', NULL, 'Exam fee reimbursable under GI Bill'),
('CompTIA Network+', 'NAVY_COOL', 'Navy', 'Covered under Navy COOL'),
('CompTIA Network+', 'ARMY_COOL', 'Army', 'Covered under Army CA'),
('CompTIA Network+', 'AF_COOL', 'Air Force', 'Covered under AF COOL'),
('CompTIA Network+', 'GI_BILL', NULL, 'Exam fee reimbursable under GI Bill');

-- CCNA
INSERT INTO dict_cert_funding (cert_keyword, funding_program_code, branch, notes) VALUES
('CCNA', 'NAVY_COOL', 'Navy', 'Cisco CCNA covered under Navy COOL'),
('CCNA', 'ARMY_COOL', 'Army', 'Cisco CCNA covered under Army CA'),
('CCNA', 'AF_COOL', 'Air Force', 'Cisco CCNA covered under AF COOL'),
('CCNA', 'GI_BILL', NULL, 'Exam fee reimbursable under GI Bill'),
('CCNA', 'VET_TEC', NULL, 'Often included in VET TEC networking programs');

-- Six Sigma / Lean Six Sigma
INSERT INTO dict_cert_funding (cert_keyword, funding_program_code, branch, notes) VALUES
('Six Sigma', 'NAVY_COOL', 'Navy', 'Lean Six Sigma certifications covered under Navy COOL'),
('Six Sigma', 'ARMY_COOL', 'Army', 'Lean Six Sigma covered under Army CA'),
('Six Sigma', 'GI_BILL', NULL, 'Training and exam costs reimbursable under GI Bill'),
('Lean Six Sigma', 'NAVY_COOL', 'Navy', 'Green Belt/Black Belt covered under Navy COOL'),
('Lean Six Sigma', 'ARMY_COOL', 'Army', 'Green Belt/Black Belt covered under Army CA');

-- ITIL
INSERT INTO dict_cert_funding (cert_keyword, funding_program_code, branch, notes) VALUES
('ITIL', 'NAVY_COOL', 'Navy', 'ITIL Foundation covered under Navy COOL'),
('ITIL', 'ARMY_COOL', 'Army', 'ITIL Foundation covered under Army CA'),
('ITIL', 'GI_BILL', NULL, 'ITIL exam fee reimbursable under GI Bill');

-- CEH
INSERT INTO dict_cert_funding (cert_keyword, funding_program_code, branch, notes) VALUES
('CEH', 'NAVY_COOL', 'Navy', 'CEH covered under Navy COOL'),
('CEH', 'ARMY_COOL', 'Army', 'CEH covered under Army CA'),
('CEH', 'AF_COOL', 'Air Force', 'CEH covered under AF COOL'),
('CEH', 'GI_BILL', NULL, 'Exam fee reimbursable under GI Bill'),
('CEH', 'VET_TEC', NULL, 'Often included in VET TEC cybersecurity programs');

-- SHRM / HR
INSERT INTO dict_cert_funding (cert_keyword, funding_program_code, branch, notes) VALUES
('SHRM', 'GI_BILL', NULL, 'SHRM-CP/SCP exam reimbursable under GI Bill'),
('PHR', 'GI_BILL', NULL, 'PHR exam reimbursable under GI Bill');

-- CAPM
INSERT INTO dict_cert_funding (cert_keyword, funding_program_code, branch, notes) VALUES
('CAPM', 'NAVY_COOL', 'Navy', 'Certified Associate in Project Management — covered under Navy COOL'),
('CAPM', 'ARMY_COOL', 'Army', 'CAPM covered under Army CA'),
('CAPM', 'GI_BILL', NULL, 'CAPM exam fee reimbursable under GI Bill');
