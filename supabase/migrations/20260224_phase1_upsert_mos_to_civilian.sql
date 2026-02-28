-- =============================================================================
-- Phase 1: Upsert dict_mos_to_civilian (572 rows)
-- Source: /home/fiveftslim/debriefed-ai-lab/dict_mos_to_civilian_rows.csv
-- Run AFTER 20260224_phase1_schema_additions.sql
-- =============================================================================

BEGIN;

INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('002ba187-880c-4396-8c7a-e289afdac294'::UUID, 'usaf', '1N0X1', 'All Source Intelligence Analyst', '{"Intelligence Analyst","All-Source Analyst","Threat Analyst","Research Analyst","Business Intelligence Analyst"}'::TEXT[], '{"13-1161.00"}'::TEXT[], '{"Intelligence","Defense","Government","Consulting"}'::TEXT[], '{"All-Source Analysis","Intelligence Collection","Threat Assessment","DCGS","Briefing","Report Writing"}'::TEXT[], 'Fuses multi-source intelligence to produce all-source analysis')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('010f9916-b8a3-4c61-902f-2d5f2504dfdc'::UUID, 'army', '42A', 'Human Resources Specialist', '{"HR Specialist","HR Generalist","Personnel Specialist","Recruiter","Benefits Administrator"}'::TEXT[], '{}'::TEXT[], '{"Human Resources","Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('01c2600c-8b17-42d3-ae67-9b488af6f984'::UUID, 'army', '91F', 'Small Arms/Artillery Repairer', '{"Gunsmith","Armorer","Weapons Technician","Firearms Repair Specialist"}'::TEXT[], '{}'::TEXT[], '{"Firearms","Security","Sporting Goods"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('02ae8eb9-0adf-4b1b-8c04-84e55accd814'::UUID, 'navy', 'UT', 'Utilitiesman', '{"Plumber","HVAC Technician","Utilities Technician","Water Treatment Specialist","Facilities Maintenance Technician"}'::TEXT[], '{"47-2152.00","49-9021.00"}'::TEXT[], '{"Construction","Utilities","Facilities"}'::TEXT[], '{"Plumbing","HVAC","Water Treatment","Electrical","Boilers","Refrigeration","Fire Protection Systems"}'::TEXT[], 'Installs and maintains plumbing, HVAC, and utility systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('02eb63ab-87cb-4f5c-9409-699f4a6da577'::UUID, 'navy', 'FC', 'Fire Controlman', '{"Weapons Systems Technician","Defense Systems Analyst","Radar Systems Technician","Systems Integration Specialist","Test Engineer"}'::TEXT[], '{"17-3023.00","17-2199.00"}'::TEXT[], '{"Defense","Aerospace","Technology"}'::TEXT[], '{"Weapons Systems","Combat Systems","Radar","Missile Systems","Electronics","Troubleshooting","System Integration"}'::TEXT[], 'Operates and maintains weapons control systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('0352eaeb-7b55-4d3e-8306-554301308dd6'::UUID, 'usaf', '3E8X1', 'Explosive Ordnance Disposal', '{"EOD Technician","Bomb Technician","Explosive Safety Specialist","Security Consultant"}'::TEXT[], '{}'::TEXT[], '{"Law Enforcement","Security","Defense","Mining"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('0396bc37-619c-4955-bd74-d6ebf0e53454'::UUID, 'usmc', '0321', 'Reconnaissance Marine', '{"Security Consultant","Special Operations Specialist"}'::TEXT[], '{}'::TEXT[], '{"Security","Defense","Consulting"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('04309867-dc91-42a0-9537-1d7b1b3d706c'::UUID, 'army', '36B', 'Financial Management Technician', '{"Accountant","Financial Analyst","Budget Analyst","Payroll Specialist","Bookkeeper"}'::TEXT[], '{}'::TEXT[], '{"Finance","Accounting","Government","Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('04a24a01-ceec-4a38-8497-91019ed74ea5'::UUID, 'navy', 'AC', 'Air Traffic Controller', '{"Air Traffic Controller","ATC Specialist","Airspace Manager","Aviation Operations Coordinator"}'::TEXT[], '{"53-2021.00"}'::TEXT[], '{"Aviation","FAA","Defense"}'::TEXT[], '{"Air Traffic Control","Radar","Airspace Management","Communication","FAA Regulations"}'::TEXT[], 'Controls air traffic in terminal and en route environments')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('04e5d2f5-5ac7-4021-a34a-e78d3fa8de86'::UUID, 'navy', 'GSM', 'Gas Turbine Systems Technician Mechanical', '{"Gas Turbine Mechanic","Power Plant Mechanic","Industrial Mechanic","Turbine Technician","Plant Operator"}'::TEXT[], '{}'::TEXT[], '{"Energy","Utilities","Oil & Gas","Manufacturing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('0505bacc-6d74-4f38-92ab-8e3609fa612e'::UUID, 'navy', 'YN', 'Yeoman', '{"Administrative Assistant","Executive Assistant","Office Manager","Records Manager","Administrative Coordinator"}'::TEXT[], '{}'::TEXT[], '{"Any Industry","Government","Legal","Healthcare"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('05ed9f8a-7ee5-4980-8638-68cf24c8aa71'::UUID, 'uscg', 'IST', 'Intelligence Systems Technician', '{"Intelligence Systems Manager","IT Security Manager","Systems Administrator"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Technology","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('05fd21b9-ca67-4699-af9f-8b577812b682'::UUID, 'navy', 'HM', 'Hospital Corpsman', '{"Medical Assistant","EMT/Paramedic","LPN/LVN","Phlebotomist","Medical Technician","Healthcare Administrator"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Emergency Services","Government","Pharmaceutical"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('0698479a-cf5f-4729-8d28-cbbd07e63600'::UUID, 'ussf', '5S0X1', 'Space Systems Operations', '{"Satellite Operations Specialist","Space Systems Operator","Mission Control Specialist","Ground Station Operator","Spacecraft Operations Engineer"}'::TEXT[], '{}'::TEXT[], '{"Aerospace","Space","Telecommunications","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('06f78658-c5a2-4880-bb66-668df2e483b1'::UUID, 'usaf', '3D0X2', 'Cyber Systems Operations', '{"Systems Administrator","Network Engineer","Cloud Engineer","DevOps Engineer","IT Manager"}'::TEXT[], '{"15-1244.00","15-1231.00"}'::TEXT[], '{"Technology","Government","Defense","Cloud"}'::TEXT[], '{"Windows Server","Linux","Active Directory","VMware","Network Security","Cloud Computing","Scripting"}'::TEXT[], 'Designs, installs, and supports cyber systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('0758c56c-739a-477c-935f-c610c46665fb'::UUID, 'army', '89B', 'Ammunition Specialist', '{"Ammunition Handler","Ordnance Specialist","Inventory Specialist","Warehouse Specialist"}'::TEXT[], '{}'::TEXT[], '{"Defense","Security","Warehousing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('075c687f-2a12-485b-b98d-96ae4487dc09'::UUID, 'usmc', '3112', 'Distribution Management Specialist', '{"Distribution Manager","Logistics Coordinator","Inventory Manager"}'::TEXT[], '{}'::TEXT[], '{"Logistics","Distribution","Retail"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('087d7b14-89c6-4c48-b2be-538866439887'::UUID, 'army', '15Q', 'Air Traffic Control Operator', '{"Air Traffic Controller","Flight Operations Specialist","Aviation Operations Manager"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Transportation","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('08c293e5-ce07-4882-9435-55aa02cfe553'::UUID, 'usmc', '4612', 'Combat Correspondent', '{"Journalist","Reporter","Public Affairs Specialist"}'::TEXT[], '{}'::TEXT[], '{"Media","News","Communications"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('09433338-bc97-432b-85b9-435e9e4fa425'::UUID, 'uscg', 'ELC', 'Electronics', '{"Electronics Manager","Communications Director","Technical Manager","Systems Manager"}'::TEXT[], '{}'::TEXT[], '{"Electronics","Telecommunications","Technology"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('09454e48-f226-4bd2-9365-ec704e07e6dc'::UUID, 'usmc', '6154', 'Helicopter Power Plants Mechanic CH-53', '{"Jet Engine Mechanic","Powerplant Technician","Turbine Mechanic"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('09c3e85f-663b-4ca5-afd5-043768307b9b'::UUID, 'uscg', 'AMT', 'Aviation Maintenance Technician', '{"Aircraft Mechanic","A&P Mechanic","Aviation Maintenance Technician","Helicopter Mechanic"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Emergency Services"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('09fd31d2-2ff6-48f6-b65d-9cbccc4df6f0'::UUID, 'uscg', 'AST', 'Aviation Survival Technician', '{"Search and Rescue Technician","Paramedic","Flight Medic","Emergency Medical Technician","SAR Swimmer"}'::TEXT[], '{}'::TEXT[], '{"Emergency Services","Aviation","Healthcare","Oil & Gas"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('0a7a2e53-dd1d-4769-97aa-6e9ce70ae460'::UUID, 'army', '68S', 'Preventive Medicine Specialist', '{"Public Health Technician","Environmental Health Technician","Health Inspector","Epidemiology Technician"}'::TEXT[], '{}'::TEXT[], '{"Public Health","Government","Healthcare"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('0a878e5a-a719-4109-a3f3-e666e22bd1af'::UUID, 'navy', 'CTM', 'Cryptologic Technician Maintenance', '{"Electronics Technician","Communications Technician","Network Technician","Systems Technician"}'::TEXT[], '{}'::TEXT[], '{"Telecommunications","Technology","Defense","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('0ad7ff5c-39c7-48e3-baec-78046452995d'::UUID, 'usaf', '2M0X2', 'Missile and Space Systems Maintenance', '{"Missile Technician","Aerospace Technician","Mechanical Systems Technician"}'::TEXT[], '{}'::TEXT[], '{"Defense","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('0af48e93-6f46-481a-bc53-b9cee94018e3'::UUID, 'ussf', '1C6X2', 'Space Surveillance and Control', '{"Space Surveillance Analyst","Orbital Analyst","Space Tracking Specialist","Space Domain Awareness Operator","Conjunction Assessment Analyst"}'::TEXT[], '{}'::TEXT[], '{"Aerospace","Defense","Government","Space"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('0b4944e9-8a9d-483e-b167-fdfde8132255'::UUID, 'navy', 'SW', 'Steelworker', '{"Structural Ironworker","Welder","Reinforcing Iron Worker","Steel Fabricator","Construction Supervisor"}'::TEXT[], '{}'::TEXT[], '{"Construction","Manufacturing","Infrastructure"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('0cbef24b-c5b2-4c81-b58e-947abf724306'::UUID, 'army', '25P', 'Microwave Systems Operator-Maintainer', '{"Microwave Technician","RF Technician","Communications Technician","Tower Technician"}'::TEXT[], '{}'::TEXT[], '{"Telecommunications","Broadcasting","Technology"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('0ced4d4a-c7ee-470b-808a-24631a35aa1c'::UUID, 'navy', 'SB', 'Special Warfare Boat Operator', '{"Maritime Security Specialist","Security Operations Manager","Tactical Operations Coordinator","Defense Consultant"}'::TEXT[], '{"33-9032.00"}'::TEXT[], '{"Security","Defense","Government"}'::TEXT[], '{"Special Operations","Maritime Security","Small Boat Operations","Tactical Planning","Physical Security"}'::TEXT[], 'Operates special warfare craft in support of NSW operations')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('0d3bd9bf-0807-4444-bd2e-f8145e6e4a96'::UUID, 'usaf', '3F5X1', 'Administration', '{"Administrative Assistant","Executive Assistant","Office Manager","Administrative Coordinator"}'::TEXT[], '{}'::TEXT[], '{"Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('0dd51f82-3816-45ed-8ff3-ed0841c8ba7a'::UUID, 'army', '92L', 'Petroleum Laboratory Specialist', '{"Laboratory Technician","Quality Control Technician","Chemical Technician","Petroleum Analyst"}'::TEXT[], '{}'::TEXT[], '{"Oil & Gas","Chemical","Laboratory"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('0e49c925-db0e-43c2-82c2-a99adec110f3'::UUID, 'army', '13J', 'Fire Control Specialist', '{"Radar Technician","Electronics Technician","Systems Technician","Fire Control Technician"}'::TEXT[], '{}'::TEXT[], '{"Defense","Aerospace","Electronics"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('0e56d08d-e0c1-4d77-8117-7cdb44ac1ab6'::UUID, 'usmc', '1341', 'Heavy Equipment Mechanic', '{"Heavy Equipment Mechanic","Diesel Mechanic"}'::TEXT[], '{}'::TEXT[], '{"Construction","Mining","Transportation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('0e5dcadd-2db6-41c9-a153-ddcb6ed8b5b1'::UUID, 'navy', 'AM', 'Aviation Structural Mechanic', '{"Aircraft Structural Mechanic","Composite Repair Technician","Sheet Metal Mechanic","Aviation Maintenance Technician"}'::TEXT[], '{"49-3011.00"}'::TEXT[], '{"Aviation","Aerospace","Manufacturing"}'::TEXT[], '{"Sheet Metal","Composite Repair","Corrosion Control","NDI","Structural Repair"}'::TEXT[], 'Maintains aircraft structural and hydraulic systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('0f1a4d9d-14bb-4a76-a495-f857e57ff883'::UUID, 'army', '12W', 'Carpentry and Masonry Specialist', '{"Carpenter","Mason","Construction Supervisor","General Contractor"}'::TEXT[], '{}'::TEXT[], '{"Construction","Facilities","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('119f8bd2-2b8a-4db7-8dbd-acccac987bec'::UUID, 'navy', 'EOD', 'Explosive Ordnance Disposal', '{"EOD Technician","Bomb Squad Technician","IED Disposal Specialist","Hazardous Devices Technician","Safety Director"}'::TEXT[], '{"33-2011.00","33-9099.00"}'::TEXT[], '{"Law Enforcement","Defense","Government","Security"}'::TEXT[], '{"Explosive Ordnance Disposal","IED Defeat","HAZMAT","Risk Assessment","Diving","Robotics"}'::TEXT[], 'Renders safe explosive ordnance and IEDs')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('1261c5b6-0f26-4349-b8fc-8cfd0a38d6af'::UUID, 'uscg', 'CS', 'Culinary Specialist', '{"Chef","Kitchen Manager","Food Service Director","Executive Chef","Catering Manager"}'::TEXT[], '{}'::TEXT[], '{"Food Service","Hospitality","Healthcare","Corporate"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('12de40b3-ca59-43bc-9957-8c551a09a40c'::UUID, 'usaf', '4Y0X2', 'Dental Laboratory', '{"Dental Laboratory Technician","Dental Technician","Prosthodontic Technician"}'::TEXT[], '{}'::TEXT[], '{"Dental","Healthcare","Manufacturing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('149aca21-20be-4954-815d-4a9de19ba51f'::UUID, 'usmc', '1316', 'Metal Worker', '{"Welder","Sheet Metal Worker","Metal Fabricator"}'::TEXT[], '{}'::TEXT[], '{"Manufacturing","Construction"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('15006cec-97ab-4544-8046-58bb6f16f487'::UUID, 'uscg', 'SK', 'Storekeeper', '{"Supply Chain Specialist","Inventory Manager","Purchasing Agent","Logistics Coordinator","Warehouse Manager"}'::TEXT[], '{}'::TEXT[], '{"Logistics","Retail","Manufacturing","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('1520bfed-4f8a-4899-a20d-5b9fb4d92ef3'::UUID, 'army', '18C', 'Special Forces Engineer Sergeant', '{"Construction Manager","Security Specialist","Project Manager","Operations Manager"}'::TEXT[], '{}'::TEXT[], '{"Construction","Security","Consulting"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('15297f69-fa80-4fb2-a750-e1c405594d36'::UUID, 'usaf', '2R0X1', 'Maintenance Management Analysis', '{"Maintenance Analyst","Data Analyst","Operations Analyst","Maintenance Planner"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Manufacturing","Logistics"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('15ff89c7-7780-4ae5-8dea-3b57ba40e97c'::UUID, 'army', '92M', 'Mortuary Affairs Specialist', '{"Funeral Director","Mortician","Mortuary Technician","Embalmer"}'::TEXT[], '{}'::TEXT[], '{"Funeral Services","Healthcare"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('15ffc10f-4960-41d4-acdb-6d1fa3dea11f'::UUID, 'navy', 'SW', 'Steelworker', '{"Structural Welder","Ironworker","Steel Fabricator","Construction Foreman","Structural Steel Installer"}'::TEXT[], '{"47-2221.00","47-2152.00"}'::TEXT[], '{"Construction","Manufacturing"}'::TEXT[], '{"Structural Steel","Welding","Rigging","Blueprint Reading","Concrete","Masonry"}'::TEXT[], 'Fabricates, erects, and repairs steel structures')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('166f38f6-a5d9-459c-90d3-0e4711d8c232'::UUID, 'army', '68P', 'Radiology Specialist', '{"Radiologic Technologist","X-Ray Technician","MRI Technologist","CT Technologist"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Hospitals","Imaging Centers"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('16f69794-3aa9-4c03-9168-e7e4bbed3cb7'::UUID, 'navy', 'SO', 'Special Warfare Operator (SEAL)', '{"Security Consultant","Executive Protection Specialist","Security Contractor","Tactical Trainer","Operations Manager"}'::TEXT[], '{}'::TEXT[], '{"Security","Consulting","Defense","Executive Protection"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('173a3906-9962-4670-a55a-b7c06ca600f6'::UUID, 'usmc', '0631', 'Network Administrator', '{"Network Administrator","Systems Administrator","Network Engineer"}'::TEXT[], '{}'::TEXT[], '{"Technology","Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('17974d2c-4d1e-4f8c-a3f8-31cf55c914cd'::UUID, 'navy', 'MC', 'Mass Communication Specialist', '{"Public Affairs Specialist","Journalist","Photographer","Videographer","Social Media Manager","Communications Specialist"}'::TEXT[], '{}'::TEXT[], '{"Media","Marketing","Government","Corporate Communications"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('18b7a2cd-e3cb-48d0-ba40-f810719ebc84'::UUID, 'navy', 'ET', 'Electronics Technician', '{"Electronics Technician","Field Service Engineer","Calibration Technician","Radar Technician","Avionics Technician","Telecommunications Technician"}'::TEXT[], '{"17-3023.00","49-2094.00"}'::TEXT[], '{"Defense","Telecommunications","Aerospace","Manufacturing"}'::TEXT[], '{"Electronics Repair","Radar Systems","Calibration","Soldering","Circuit Analysis","Troubleshooting","Oscilloscopes"}'::TEXT[], 'Maintains and repairs electronic equipment and systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('190b0b14-1784-405d-9fd3-8be29e08eb60'::UUID, 'ussf', '1C6X1', 'Space Systems Operations', '{"Satellite Operator","Space Systems Analyst","Mission Operations Specialist","Spacecraft Controller","Satellite Systems Engineer","Ground Systems Operator"}'::TEXT[], '{}'::TEXT[], '{"Aerospace","Space","Defense","Telecommunications","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('1981a5f7-8ceb-470b-b904-57519057bfec'::UUID, 'usmc', '3521', 'Automotive Organizational Mechanic', '{"Automotive Technician","Fleet Mechanic","Diesel Mechanic"}'::TEXT[], '{"49-3023.00"}'::TEXT[], '{"Automotive","Transportation"}'::TEXT[], '{"Vehicle Maintenance","Diesel Repair","Diagnostics","Brake Systems","Electrical Systems"}'::TEXT[], 'Maintains tactical and non-tactical vehicles')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('1983f703-710e-4c70-9a3d-03f5205b98fc'::UUID, 'ussf', 'SF-SCO', 'Satellite Constellation Operator', '{"Constellation Manager","Fleet Operations Specialist","Satellite Network Controller"}'::TEXT[], '{}'::TEXT[], '{"SpaceX","OneWeb","Amazon Kuiper","Telecommunications"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('19caaf89-de83-4e88-babf-f46ebb18973d'::UUID, 'army', '91E', 'Allied Trades Specialist', '{"Welder","Machinist","Metal Fabricator","Maintenance Mechanic"}'::TEXT[], '{}'::TEXT[], '{"Manufacturing","Construction","Automotive"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('19dd7336-a339-4c9f-abcc-83fdd57d03df'::UUID, 'usaf', '2G0X1', 'Logistics Plans', '{"Logistics Planner","Supply Chain Analyst","Operations Planner","Logistics Manager"}'::TEXT[], '{}'::TEXT[], '{"Logistics","Transportation","Manufacturing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('19e4694e-88d3-4116-8c29-0029718720ba'::UUID, 'usmc', '0317', 'Scout Sniper', '{"Security Specialist","Tactical Instructor","Law Enforcement Specialist"}'::TEXT[], '{}'::TEXT[], '{"Security","Law Enforcement","Training"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('1a8a630a-3f40-423e-8436-4f418070c977'::UUID, 'usmc', '0231', 'Intelligence Specialist', '{"Intelligence Analyst","Research Analyst","Threat Analyst"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Defense","Finance","Consulting"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('1ae17ce8-6590-4f3c-b739-b186d0f602e0'::UUID, 'navy', 'RP', 'Religious Program Specialist', '{"Program Coordinator","Administrative Assistant","Events Coordinator","Community Outreach Specialist"}'::TEXT[], '{}'::TEXT[], '{"Non-Profit","Religious Organizations","Education","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('1b0196da-a8db-44a2-bc85-43e1fabf6208'::UUID, 'usmc', '6062', 'Aircraft Intermediate Level Electrical Mechanic', '{"Aircraft Electrician","Avionics Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('1b461b70-a839-4337-b7ff-758243ab7f25'::UUID, 'army', '68W', 'Combat Medic Specialist', '{"EMT","Paramedic","Emergency Medical Technician","Medical Assistant","ER Technician"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Emergency Services","Hospitals"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('1ca79b65-0d7e-4eac-979c-082e671cb529'::UUID, 'usaf', '3D0X1', 'Knowledge Operations Management', '{"Records Manager","Information Manager","Knowledge Manager","Document Control Specialist"}'::TEXT[], '{}'::TEXT[], '{"Technology","Government","Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('1cb95759-3487-4b4e-943b-0e4ef5c7d3df'::UUID, 'usmc', '4421', 'Legal Services Specialist', '{"Paralegal","Legal Assistant","Legal Secretary"}'::TEXT[], '{}'::TEXT[], '{"Legal","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('1ce0f3de-349c-4bb0-ad53-de3b5f6b9366'::UUID, 'navy', 'IS', 'Intelligence Specialist', '{"Intelligence Analyst","Research Analyst","Threat Analyst","Security Analyst","Business Intelligence Analyst"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Defense","Government","Consulting","Finance"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('1d0e2e49-a414-4811-9734-7422d256956e'::UUID, 'usaf', '2W0X1', 'Munitions Systems', '{"Munitions Specialist","Ordnance Handler","Warehouse Specialist","Inventory Specialist"}'::TEXT[], '{}'::TEXT[], '{"Defense","Security","Warehousing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('1e38a8f2-444b-4da8-b79a-9251345ad456'::UUID, 'ussf', 'SF-STM', 'Space Traffic Management', '{"Space Traffic Coordinator","Orbital Safety Analyst","Conjunction Assessment Specialist"}'::TEXT[], '{}'::TEXT[], '{"FAA","Space Companies","Defense Contractors"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('20600cea-3554-44d2-8f24-a225ca715ab0'::UUID, 'usaf', '4T0X1', 'Medical Laboratory', '{"Medical Laboratory Technician","Clinical Laboratory Technician","Lab Technician"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Laboratories","Hospitals"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('2097b604-03e0-4566-9e54-9765694911de'::UUID, 'usmc', '7314', 'Unmanned Aerial Vehicle Commander', '{"UAV Program Manager","Drone Operations Manager","UAS Director"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Technology","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('209e39a9-2e2f-47df-930b-9eaabbeb403a'::UUID, 'navy', 'AE', 'Aviation Electrician''s Mate', '{"Avionics Technician","Aircraft Electrician","Electronics Technician","Electrical Systems Specialist"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Electronics","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('210f3d55-aaf3-4df1-8213-115c7b4b9613'::UUID, 'army', '92W', 'Water Treatment Specialist', '{"Water Treatment Operator","Wastewater Technician","Water Quality Technician","Utilities Operator"}'::TEXT[], '{}'::TEXT[], '{"Utilities","Municipal","Environmental"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('215a8ee9-aeaa-4bc9-ae9c-9d9b0693925a'::UUID, 'ussf', '5C0X1', 'Command and Control Battle Management Operations', '{"Operations Center Manager","Command Center Operator","Battle Management Specialist","Space Operations Controller","Mission Director"}'::TEXT[], '{}'::TEXT[], '{"Defense","Aerospace","Government","Emergency Management"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('2270f2be-6cf3-4bcb-91e7-d232f40d7b56'::UUID, 'usmc', '6156', 'Tiltrotor Power Plants Mechanic MV-22', '{"Powerplant Mechanic","Turbine Mechanic"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('237dd914-09ba-4975-9e93-eb0a734a9d6f'::UUID, 'army', '17C', 'Cyber Operations Specialist', '{"Cyber Operations Analyst","Penetration Tester","Red Team Operator","Cybersecurity Engineer","SOC Analyst"}'::TEXT[], '{"15-1212.00"}'::TEXT[], '{"Cybersecurity","Defense","Technology","Finance"}'::TEXT[], '{"Offensive Cyber Operations","Penetration Testing","Network Defense","Malware Analysis","Python","Linux","SIEM"}'::TEXT[], 'Conducts offensive and defensive cyberspace operations')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('24006e2f-8cb1-4108-8258-816659a506d0'::UUID, 'usmc', '7212', 'Low Altitude Air Defense Gunner', '{"Air Defense Operator","Radar Operator","Security Specialist"}'::TEXT[], '{}'::TEXT[], '{"Defense","Security"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('240fe7e7-d7be-4c80-b63e-5ced588d8d3c'::UUID, 'usmc', '6483', 'Aircraft Firefighting and Rescue Specialist', '{"Aircraft Rescue Firefighter","ARFF Specialist","Airport Firefighter"}'::TEXT[], '{}'::TEXT[], '{"Fire Service","Aviation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('2421d4d2-a90a-4122-b984-82c30711cd45'::UUID, 'usmc', '0861', 'Fire Support Marine', '{"Operations Coordinator","Communications Specialist"}'::TEXT[], '{}'::TEXT[], '{"Defense","Security"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('2493bcfb-0d08-44a1-9117-7936b09d1c5a'::UUID, 'usaf', '3E0X2', 'Electrical Power Production', '{"Power Plant Operator","Generator Technician","Electrical Power Specialist"}'::TEXT[], '{}'::TEXT[], '{"Utilities","Energy","Facilities"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('24acd57c-eca5-4618-9901-1c8c05ee7b6a'::UUID, 'usaf', '2A5X2', 'Helicopter/Tiltrotor Aircraft Maintenance', '{"Helicopter Mechanic","Rotor Wing Technician","Aircraft Mechanic"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Emergency Services","Oil & Gas"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('24db2d1d-a9ce-4df3-90f2-30079baa250c'::UUID, 'usmc', '2673', 'Asian Pacific Cryptologic Linguist', '{"Chinese/Korean Linguist","Translator","Intelligence Analyst"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Government","Translation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('24fa814a-b93b-49cb-ab04-1d8deb0fb7f7'::UUID, 'usmc', '6046', 'Aircraft Maintenance Administration', '{"Aviation Maintenance Administrator","Maintenance Planner","Records Manager","QA Administrator"}'::TEXT[], '{"43-6014.00","49-3011.00"}'::TEXT[], '{"Aviation","Aerospace"}'::TEXT[], '{"Maintenance Records","NALCOMIS","Aviation Compliance","QA","Configuration Management"}'::TEXT[], 'Manages aircraft maintenance records and administration')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('255f8f81-b0de-47a1-8ef8-69bbf3886f7a'::UUID, 'usaf', '3E6X1', 'Operations Management', '{"Operations Manager","Facilities Manager","Project Manager","Operations Coordinator"}'::TEXT[], '{}'::TEXT[], '{"Facilities","Construction","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('257aaf8e-2b1b-4436-8336-a6ba8e0f654b'::UUID, 'army', '25N', 'Nodal Network Systems Operator-Maintainer', '{"Network Administrator","Systems Administrator","Network Engineer","IT Specialist"}'::TEXT[], '{}'::TEXT[], '{"Technology","Telecommunications"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('25b04a7a-1132-4521-aae4-81ae445c5a22'::UUID, 'navy', 'CTI', 'Cryptologic Technician (Interpretive)', '{"Linguist","Intelligence Analyst","Foreign Language Analyst","Translator","Cultural Advisor"}'::TEXT[], '{"27-3091.00","13-1161.00"}'::TEXT[], '{"Intelligence","Government","Defense","Consulting"}'::TEXT[], '{"Foreign Language","Intelligence Analysis","Translation","SIGINT","Cultural Analysis","Report Writing"}'::TEXT[], 'Conducts language analysis and intelligence operations')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('26a78a98-c92c-45b8-91ea-2119b4822fa5'::UUID, 'navy', 'GM', 'Gunner''s Mate', '{"Weapons Specialist","Armorer","Security Specialist","Firearms Instructor","Ordnance Handler"}'::TEXT[], '{}'::TEXT[], '{"Security","Law Enforcement","Defense","Manufacturing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('273db257-a88d-4054-824d-e363a1645cec'::UUID, 'army', '88M', 'Motor Transport Operator', '{"Transportation Manager","Fleet Manager","Logistics Coordinator","CDL Driver","Dispatch Supervisor"}'::TEXT[], '{"53-3032.00","11-3071.00","53-1047.00"}'::TEXT[], '{"Transportation","Logistics","Supply Chain"}'::TEXT[], '{"CDL","Fleet Management","Route Planning","Vehicle Maintenance","HAZMAT Transport","Convoy Operations"}'::TEXT[], 'Operates military vehicles for personnel and cargo transport')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('276bfa05-fc1e-40f8-b638-3b89850e1983'::UUID, 'usaf', '1N2X1', 'Signals Intelligence Analyst', '{"SIGINT Analyst","Signals Analyst","Communications Analyst","Intelligence Specialist"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Defense","Technology"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('2770b3f2-8ef8-48b1-a2ab-034b914a020f'::UUID, 'army', '92A', 'Automated Logistical Specialist', '{"Inventory Specialist","Supply Chain Specialist","Warehouse Manager","Logistics Coordinator"}'::TEXT[], '{}'::TEXT[], '{"Logistics","Warehousing","Retail","Manufacturing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('27bdf987-150b-40ae-84ba-4adfaacd8592'::UUID, 'uscg', 'ME', 'Maritime Enforcement Specialist', '{"Law Enforcement Officer","Federal Agent","Security Specialist","Customs Inspector"}'::TEXT[], '{"33-3051.00","33-3021.00"}'::TEXT[], '{"Law Enforcement","Government","Security"}'::TEXT[], '{"Maritime Law Enforcement","Boarding Operations","Port Security","Investigations","Use of Force"}'::TEXT[], 'Conducts maritime law enforcement and port security')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('27da0b3e-a533-4daf-90c9-3f4f3aeebb10'::UUID, 'ussf', '1N7X1', 'Space Intelligence Specialist', '{"Space Intelligence Analyst","Threat Analyst","ISR Analyst","Defense Analyst","Space Domain Awareness Analyst"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Aerospace","Defense","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('285b0dda-9840-4e00-9d7c-98a088224c92'::UUID, 'army', '91S', 'Stryker Systems Maintainer', '{"Vehicle Systems Technician","Automotive Technician","Electronics Technician"}'::TEXT[], '{}'::TEXT[], '{"Automotive","Defense","Transportation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('28759f3e-3884-41f7-84b9-53a14b1fa64e'::UUID, 'army', '91P', 'Artillery Mechanic', '{"Heavy Equipment Mechanic","Hydraulic Technician","Weapons Systems Technician"}'::TEXT[], '{}'::TEXT[], '{"Defense","Manufacturing","Heavy Equipment"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('289c88f5-8383-4525-937a-c9b1f1fd46b7'::UUID, 'army', '91B', 'Wheeled Vehicle Mechanic', '{"Automotive Mechanic","Fleet Mechanic","Diesel Technician","Service Technician"}'::TEXT[], '{}'::TEXT[], '{"Automotive","Transportation","Fleet Management"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('28b46573-9e77-48bc-bbaf-181ffd297bd2'::UUID, 'uscg', 'ME', 'Maritime Enforcement Specialist', '{"Law Enforcement Officer","Security Specialist","Customs Officer","Border Patrol Agent","Federal Agent"}'::TEXT[], '{}'::TEXT[], '{"Law Enforcement","Security","Government","Customs"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('290a3a94-c38f-4311-994d-0acdba7ff39e'::UUID, 'army', '15G', 'Aircraft Structural Repairer', '{"Aircraft Structural Mechanic","Sheet Metal Mechanic","Composite Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Manufacturing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('2a8ab16b-2cef-42d3-8708-3df0a14e53cd'::UUID, 'usmc', '0689', 'Cyber Security Technician', '{"Cybersecurity Analyst","Security Technician","SOC Analyst"}'::TEXT[], '{}'::TEXT[], '{"Cybersecurity","Technology","Finance"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('2abe45ae-4860-4e44-8b71-bc3514e4dfd4'::UUID, 'army', '31B', 'Military Police', '{"Police Officer","Security Officer","Corrections Officer","Loss Prevention Specialist","Federal Agent"}'::TEXT[], '{}'::TEXT[], '{"Law Enforcement","Security","Government","Corporate Security"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('2b037074-5cb5-4644-9566-24f120f5be0e'::UUID, 'navy', 'FCA', 'Fire Controlman (AEGIS)', '{"AEGIS Systems Technician","Combat Systems Engineer","Weapons Systems Analyst","Defense Systems Integration Specialist"}'::TEXT[], '{"17-2199.00"}'::TEXT[], '{"Defense","Aerospace","Technology"}'::TEXT[], '{"AEGIS Combat System","Missile Systems","Radar","System Integration","Troubleshooting","C4I"}'::TEXT[], 'Operates and maintains AEGIS weapons systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('2b3801a9-c3ad-4c7c-a20b-5feb7c9ccc73'::UUID, 'usmc', '0627', 'Satellite Communications Operator', '{"SATCOM Technician","Satellite Communications Operator","RF Technician"}'::TEXT[], '{}'::TEXT[], '{"Telecommunications","Aerospace","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('2b4b7eb1-6360-4004-b218-ec73e0963cc9'::UUID, 'usaf', '1C1X1', 'Air Traffic Control', '{"Air Traffic Controller","ATC Specialist","Flight Operations Manager"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Transportation","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('2b87c738-45d3-4231-962b-07f5ae084178'::UUID, 'navy', 'ABF', 'Aviation Boatswains Mate (Fuels)', '{"Fuel Systems Technician","Petroleum Distribution Manager","HAZMAT Coordinator","Fuel Quality Inspector"}'::TEXT[], '{"53-7072.00"}'::TEXT[], '{"Energy","Aviation","Oil & Gas"}'::TEXT[], '{"Fuel Systems","HAZMAT","Quality Control","Pipeline Operations","EPA Compliance"}'::TEXT[], 'Operates aviation fuel systems and handles hazardous materials')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('2b8b5d15-5e05-45b2-aab5-76e743f351b2'::UUID, 'usmc', '3451', 'Financial Management Resource Analyst', '{"Budget Analyst","Financial Analyst","Accountant"}'::TEXT[], '{}'::TEXT[], '{"Finance","Government","Corporate"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('2c5d1f1e-9be2-48fc-937d-d39bafd3d6dd'::UUID, 'army', '18E', 'Special Forces Communications Sergeant', '{"Network Engineer","Communications Specialist","IT Manager","Systems Administrator"}'::TEXT[], '{}'::TEXT[], '{"Technology","Telecommunications","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('2cb3d787-fca0-4d1f-8545-dde2e39bcbcc'::UUID, 'usmc', '7252', 'Approach Controller', '{"Air Traffic Controller","Approach Controller","TRACON Controller"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('2ccdf6b1-685a-4ceb-a263-63368bab7d40'::UUID, 'navy', 'CTN', 'Cryptologic Technician Networks', '{"Cybersecurity Analyst","Network Security Engineer","Information Security Specialist","SOC Analyst","Penetration Tester"}'::TEXT[], '{}'::TEXT[], '{"Cybersecurity","Technology","Defense","Finance","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('2ce872b9-e974-44d0-b190-3362b5916973'::UUID, 'navy', 'STS', 'Sonar Technician Submarine', '{"Sonar Technician","Acoustic Analyst","Submarine Electronics Technician"}'::TEXT[], '{}'::TEXT[], '{"Defense","Marine Research","Oceanography"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('2d5d4d42-5b85-4d8e-9219-6e8392e1da7d'::UUID, 'usaf', '3N0X2', 'Broadcast Journalist', '{"Broadcast Journalist","Reporter","News Producer","Multimedia Journalist"}'::TEXT[], '{}'::TEXT[], '{"Media","Broadcasting","News"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('2d829019-e13b-44d5-becb-a893e16b4c41'::UUID, 'usmc', '0842', 'Field Artillery Radar Operator', '{"Radar Technician","Electronics Technician","Surveillance Operator"}'::TEXT[], '{}'::TEXT[], '{"Defense","Aviation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('2dd19e1b-db5a-4e40-ab6b-8723e48d8219'::UUID, 'navy', 'MR', 'Machinery Repairman', '{"Machinist","CNC Operator","Maintenance Machinist","Tool and Die Maker","Machine Shop Supervisor"}'::TEXT[], '{}'::TEXT[], '{"Manufacturing","Aerospace","Automotive","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('2ec471a6-6db2-4946-beda-0c7c9ae6cd8e'::UUID, 'navy', 'DC', 'Damage Controlman', '{"Firefighter","Fire Inspector","Emergency Response Specialist","HAZMAT Technician","Safety Manager","Industrial Firefighter","Fire Protection Engineer","Loss Prevention Specialist"}'::TEXT[], '{}'::TEXT[], '{"Fire Service","Industrial Safety","Oil & Gas","Chemical","Manufacturing","Facilities Management"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('2f5f7846-d54c-45ec-81a9-9efa7f09c896'::UUID, 'army', '19K', 'M1 Armor Crewman', '{"Heavy Equipment Operator","Security Specialist","Equipment Operator","Training Instructor"}'::TEXT[], '{}'::TEXT[], '{"Security","Construction","Mining"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('2f656960-646a-4c1f-a3eb-982bc2c5bad8'::UUID, 'uscg', 'AVIA', 'Aviation', '{"Pilot","Aviation Manager","Flight Operations Director","Chief Pilot"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Corporate","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('2fd63a82-2da8-4916-b5bc-d8d8a1c98a73'::UUID, 'usaf', '1C0X2', 'Aviation Resource Management', '{"Aviation Scheduler","Operations Coordinator","Resource Manager","Flight Operations Specialist"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Transportation","Logistics"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('3068f11f-f6df-4366-a0ae-2c1ee6a6f0f5'::UUID, 'army', '12G', 'Quarrying Specialist', '{"Mining Equipment Operator","Quarry Worker","Blaster","Mining Supervisor"}'::TEXT[], '{}'::TEXT[], '{"Mining","Construction","Aggregates"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('30db0dd5-fbff-43ed-b5e1-ed48b1caf1d4'::UUID, 'usaf', '1A8X1', 'Airborne Cryptologic Language Analyst', '{"Linguist","Intelligence Analyst","Language Specialist","Cryptologic Linguist"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Government","Defense","Translation Services"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('30e08126-c593-4444-9747-8aed409089f9'::UUID, 'usaf', '2A6X1', 'Aerospace Propulsion', '{"Jet Engine Mechanic","Turbine Technician","A&P Mechanic","Power Plant Technician"}'::TEXT[], '{"49-3011.00"}'::TEXT[], '{"Aviation","Aerospace","Energy"}'::TEXT[], '{"Jet Engine Maintenance","Turbine Repair","Test Cell Operations","Borescope Inspection","NDI"}'::TEXT[], 'Inspects, repairs, and overhauls jet engines and related systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('35560c9c-f648-4c9a-b26d-499734c07b75'::UUID, 'army', '74D', 'Chemical Biological Radiological and Nuclear Specialist', '{"HAZMAT Specialist","Environmental Health Specialist","CBRN Defense Specialist","Safety Manager","Emergency Manager"}'::TEXT[], '{"19-4099.00","33-2021.00"}'::TEXT[], '{"Defense","Government","Energy","Manufacturing"}'::TEXT[], '{"CBRN Defense","HAZMAT","Decontamination","Environmental Compliance","Risk Assessment","Emergency Response"}'::TEXT[], 'Conducts CBRN defense operations and contamination management')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('37108f51-2610-4ada-b0d1-2d5384ad1481'::UUID, 'usaf', '1N3X1', 'Cryptologic Language Analyst', '{"Linguist","Translator","Language Analyst","Foreign Language Specialist"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Government","Translation","International Business"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('3833f835-b58a-4baa-bca3-aeed9cbbcb69'::UUID, 'usmc', '0111', 'Administrative Specialist', '{"Administrative Assistant","Office Manager","Executive Assistant"}'::TEXT[], '{}'::TEXT[], '{"Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('3943219e-9f98-4152-891c-607544bdb033'::UUID, 'army', '94E', 'Radio and Communications Security Repairer', '{"Radio Technician","Communications Technician","Electronics Repair Technician"}'::TEXT[], '{}'::TEXT[], '{"Telecommunications","Electronics","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('3973c477-9420-48ad-bf1e-7df536a45677'::UUID, 'uscg', 'AET', 'Aviation Electrical Technician', '{"Avionics Technician","Aircraft Electrician","Aviation Electronics Technician","A&P Mechanic"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('3a5d7085-0eca-45c9-8317-42c44e6c5390'::UUID, 'usaf', '5J0X1', 'Paralegal', '{"Paralegal","Legal Assistant","Legal Secretary","Litigation Support Specialist"}'::TEXT[], '{}'::TEXT[], '{"Legal","Government","Corporate"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('3aea7a93-49ea-4c23-aae7-dc09d8d7ac06'::UUID, 'usmc', '3052', 'Packaging Specialist', '{"Packaging Specialist","Shipping Specialist"}'::TEXT[], '{}'::TEXT[], '{"Logistics","Manufacturing","Warehousing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('3b0e18c5-2a40-4fff-b8f1-d8ab0266562d'::UUID, 'navy', 'PR', 'Aircrew Survival Equipmentman', '{"Survival Equipment Technician","Parachute Rigger","Life Support Technician","Safety Equipment Specialist"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Defense","Skydiving"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('3ba03bf5-1c5f-410b-a5be-94262f83d75b'::UUID, 'army', '35S', 'Signals Collector/Analyst', '{"Signals Analyst","SIGINT Specialist","Electronic Warfare Analyst"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Defense","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('3bbb4f23-44ec-4608-a20a-d589c64d0000'::UUID, 'usmc', '7011', 'Expeditionary Airfield Systems Technician', '{"Airfield Lighting Technician","Electrical Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Utilities"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('3c101500-005f-488e-a2da-ffed60452f66'::UUID, 'usaf', '4P0X1', 'Pharmacy', '{"Pharmacy Technician","Pharmaceutical Technician","Pharmacy Assistant"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Pharmacy","Retail Pharmacy"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('3c1e023a-7099-47d9-85cc-b9ab342e1f79'::UUID, 'usaf', '4R0X1', 'Diagnostic Imaging', '{"Radiologic Technologist","X-Ray Technician","MRI Technologist","CT Technologist"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Hospitals","Imaging Centers"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('3c811db7-7053-43d0-9206-b91d0eac80a3'::UUID, 'navy', 'CTR', 'Cryptologic Technician Collection', '{"Intelligence Analyst","SIGINT Analyst","Collection Manager","Signals Analyst","Threat Analyst"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Defense","Government","Consulting"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('3d496359-bcdf-48b8-81e5-2d761970b3d0'::UUID, 'navy', 'GSE', 'Gas Turbine Systems Technician Electrical', '{"Gas Turbine Technician","Power Plant Technician","Turbine Mechanic","Plant Electrician","Generator Technician"}'::TEXT[], '{}'::TEXT[], '{"Energy","Utilities","Oil & Gas","Manufacturing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('3d756c40-2de4-4cb1-abd2-e5c78d0eaf16'::UUID, 'army', '94H', 'Test, Measurement, and Diagnostic Equipment Maintenance Support Specialist', '{"Calibration Technician","TMDE Specialist","Metrology Technician","Quality Technician"}'::TEXT[], '{}'::TEXT[], '{"Manufacturing","Aerospace","Defense","Quality Control"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('3da29da1-7778-4890-8247-ece2e7bf4744'::UUID, 'army', '15Y', 'AH-64D Armament/Electrical/Avionics Systems Repairer', '{"Avionics Technician","Weapons Systems Technician","Aircraft Electrician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('3e518cd4-be19-4fa5-9903-af3abb0d112f'::UUID, 'usaf', '3E5X1', 'Engineering', '{"Civil Engineering Technician","Construction Inspector","Engineering Technician","Project Coordinator"}'::TEXT[], '{}'::TEXT[], '{"Engineering","Construction","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('3e68236c-f57e-41cf-891b-b6c730a8438a'::UUID, 'navy', 'AG', 'Aerographers Mate', '{"Meteorologist","Weather Forecaster","Environmental Scientist","Climate Analyst","Oceanographer"}'::TEXT[], '{"19-2021.00"}'::TEXT[], '{"Government","Energy","Aviation","Media"}'::TEXT[], '{"Weather Forecasting","Data Analysis","Satellite Systems","Environmental Analysis","Briefing"}'::TEXT[], 'Provides weather and environmental forecasting')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('3eeaaa7e-054b-401e-b14f-0f32aab16aa3'::UUID, 'army', '12R', 'Interior Electrician', '{"Electrician","Electrical Contractor","Maintenance Electrician","Electrical Supervisor"}'::TEXT[], '{}'::TEXT[], '{"Construction","Facilities","Manufacturing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('3f3cb800-44da-40d4-8a6b-73a6636a074b'::UUID, 'army', '14H', 'Air Defense Enhanced Early Warning Operator', '{"Radar Operator","Surveillance Specialist","Air Traffic Controller"}'::TEXT[], '{}'::TEXT[], '{"Defense","Aviation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('3f641835-21fd-4d5a-9ad6-b0797a6161f7'::UUID, 'army', '92G', 'Culinary Specialist', '{"Chef","Cook","Kitchen Manager","Food Service Supervisor","Catering Manager"}'::TEXT[], '{}'::TEXT[], '{"Food Service","Hospitality","Healthcare","Corporate"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('40526ff0-71ab-4f3a-b45e-d86a29d7bff6'::UUID, 'ussf', '3D1X2', 'Cyber Transport Systems', '{"Network Administrator","Network Engineer","Systems Administrator","Communications Specialist","Infrastructure Engineer"}'::TEXT[], '{}'::TEXT[], '{"Technology","Telecommunications","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('407011dc-5143-4af2-a337-990cd39f2dc2'::UUID, 'usaf', '2A5X1', 'Aerospace Maintenance', '{"Aircraft Mechanic","Aerospace Technician","Aviation Maintenance Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('40c56528-3d1f-48e2-8550-b02f0af2aadd'::UUID, 'usmc', '2141', 'Assault Amphibious Vehicle Repairer', '{"Heavy Equipment Mechanic","Vehicle Technician","Diesel Mechanic"}'::TEXT[], '{}'::TEXT[], '{"Marine","Transportation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('40e50e89-45b8-4cb9-814d-b5b5e1f4533a'::UUID, 'uscg', 'MOPS', 'Marine Operations', '{"Port Captain","Fleet Manager","Marine Operations Manager","Vessel Operations Director"}'::TEXT[], '{}'::TEXT[], '{"Maritime","Shipping","Oil & Gas"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('4212079d-055d-4b9f-bac4-015a950a774c'::UUID, 'usmc', '1171', 'Water Support Technician', '{"Water Treatment Operator","Utilities Technician"}'::TEXT[], '{}'::TEXT[], '{"Utilities","Municipal","Environmental"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('4214611d-f399-4e1f-8a32-aade715218a3'::UUID, 'navy', 'MN', 'Mineman', '{"Ordnance Specialist","Explosive Handling Specialist","Weapons Technician"}'::TEXT[], '{}'::TEXT[], '{"Defense","Mining","Security"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('4232e7f6-f54f-4ad1-9493-57010b8d6573'::UUID, 'navy', 'SO', 'Special Warfare Operator (SEAL)', '{"Security Director","Operations Director","Defense Consultant","Tactical Operations Manager","Program Manager"}'::TEXT[], '{"11-1021.00","33-9032.00"}'::TEXT[], '{"Security","Defense","Consulting","Corporate"}'::TEXT[], '{"Special Operations","Leadership","Strategic Planning","Risk Management","Training Development","Crisis Management"}'::TEXT[], 'Conducts special operations and direct action missions')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('42db8706-72cd-4b7d-ad6b-4457ce8983f3'::UUID, 'navy', 'AM', 'Aviation Structural Mechanic', '{"Aircraft Structural Mechanic","Sheet Metal Mechanic","Composite Technician","Aircraft Inspector"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Manufacturing","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('42ec5e28-a3d4-4524-a45d-1da9eddb0ebc'::UUID, 'usmc', '2147', 'Light Armored Vehicle Repairer', '{"Vehicle Mechanic","Automotive Technician"}'::TEXT[], '{}'::TEXT[], '{"Automotive","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('43bc7ad8-93d4-483d-a18d-c615136dac8e'::UUID, 'usaf', '1B4X1', 'Cyber Warfare Operations', '{"Cybersecurity Specialist","Cyber Operations Specialist","Penetration Tester","Red Team Operator","Offensive Security Analyst"}'::TEXT[], '{}'::TEXT[], '{"Cybersecurity","Defense","Technology","Consulting"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('43bd479c-815e-4d81-9779-1fcc01712718'::UUID, 'army', '11C', 'Indirect Fire Infantryman', '{"Security Specialist","Weapons Instructor","Training Coordinator","Security Consultant"}'::TEXT[], '{}'::TEXT[], '{"Security","Defense","Training"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('43e582f6-eb88-4e8a-a38d-c2b6aec3e201'::UUID, 'navy', 'CTT', 'Cryptologic Technician Technical', '{"Electronic Warfare Technician","SIGINT Technician","RF Technician","Systems Analyst"}'::TEXT[], '{}'::TEXT[], '{"Defense","Aerospace","Electronics","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('4427028f-91c2-4d1b-91c5-a2334fd8c9f0'::UUID, 'army', '18F', 'Special Forces Intelligence Sergeant', '{"Intelligence Analyst","Security Consultant","Threat Analyst","Risk Analyst"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Security","Consulting","Finance"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('44330dc4-b9d9-409d-8a14-84f9e7cdcc14'::UUID, 'army', '92S', 'Shower/Laundry and Clothing Repair Specialist', '{"Laundry Supervisor","Textile Repair Specialist","Dry Cleaning Manager"}'::TEXT[], '{}'::TEXT[], '{"Hospitality","Healthcare","Laundry Services"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('444e5523-938a-40bc-8a60-196f08e05366'::UUID, 'usaf', '2A6X5', 'Aircraft Hydraulic Systems', '{"Hydraulic Technician","Aircraft Mechanic","Hydraulic Systems Specialist"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Manufacturing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('44af71c6-0d63-491a-bf31-68a37ed10b7c'::UUID, 'army', '15U', 'CH-47 Helicopter Repairer', '{"Helicopter Mechanic","Heavy Lift Aircraft Mechanic","Aviation Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Logistics"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('44c42db0-fff9-40a0-8b33-800e6a8a1252'::UUID, 'navy', 'IS', 'Intelligence Specialist', '{"Intelligence Analyst","All-Source Analyst","Geospatial Analyst","CI Analyst","Threat Analyst","Research Analyst"}'::TEXT[], '{"13-1161.00","33-3021.00"}'::TEXT[], '{"Intelligence","Defense","Government","Consulting"}'::TEXT[], '{"Intelligence Analysis","OSINT","Geospatial Analysis","Briefing","Report Writing","Threat Assessment","DCGS"}'::TEXT[], 'Collects, analyzes, and disseminates intelligence')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('4502905b-7f78-4cb4-a420-f7d045751be4'::UUID, 'navy', 'AE', 'Aviation Electricians Mate', '{"Aviation Electrician","Avionics Technician","Electrical Systems Technician","Aircraft Electrical Engineer"}'::TEXT[], '{"49-2091.00","17-3023.00"}'::TEXT[], '{"Aviation","Aerospace","Electronics"}'::TEXT[], '{"Avionics","Electrical Systems","Wiring","Circuit Analysis","Troubleshooting","Test Equipment"}'::TEXT[], 'Maintains aircraft electrical and instrument systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('452b4e06-693a-4ec2-bb35-d3c6aa695be4'::UUID, 'usaf', '3E4X3', 'Pest Management', '{"Pest Control Technician","Exterminator","Pest Management Specialist"}'::TEXT[], '{}'::TEXT[], '{"Pest Control","Property Management","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('453d7aa6-4bba-439d-adef-b2d8d274518a'::UUID, 'usmc', '6124', 'CH-53 Helicopter Mechanic', '{"Heavy Lift Helicopter Mechanic","Aircraft Mechanic"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('458268cf-cbf8-4053-be3c-f9ecd12b288b'::UUID, 'usmc', '2146', 'Main Battle Tank Repairer', '{"Heavy Equipment Mechanic","Track Vehicle Technician"}'::TEXT[], '{}'::TEXT[], '{"Defense","Mining","Construction"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('46300a69-16e2-49ed-a744-f6d59bc51192'::UUID, 'usaf', '8B000', 'Military Training Instructor', '{"Training Instructor","Drill Instructor","Corporate Trainer","Leadership Trainer"}'::TEXT[], '{}'::TEXT[], '{"Training","Education","Corporate"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('469564c5-4007-4262-891c-ab371ffe52b6'::UUID, 'navy', 'GM', 'Gunners Mate', '{"Weapons Specialist","Ordnance Technician","Armorer","Quality Assurance Inspector","Safety Compliance Officer"}'::TEXT[], '{"19-4099.00","17-2111.00"}'::TEXT[], '{"Defense","Law Enforcement","Security","Manufacturing"}'::TEXT[], '{"Weapons Maintenance","Ordnance Handling","Safety Compliance","Inventory Management","Quality Control"}'::TEXT[], 'Maintains and operates naval weapons systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('46fbb1c7-8932-4890-b920-eb226fb00c8e'::UUID, 'army', '35F', 'Intelligence Analyst', '{"Intelligence Analyst","Research Analyst","Threat Analyst","Business Intelligence Analyst","Data Analyst"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Defense","Finance","Consulting","Technology"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('473a360f-e215-4fd3-a0b8-02b776dbddad'::UUID, 'navy', 'UT', 'Utilitiesman', '{"Plumber","HVAC Technician","Utilities Technician","Facilities Mechanic","Maintenance Technician"}'::TEXT[], '{}'::TEXT[], '{"Construction","Facilities Management","Utilities","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('4755b040-c997-460c-acc3-2048ac7cceea'::UUID, 'army', '94S', 'Patriot System Repairer', '{"Missile Systems Technician","Radar Technician","Electronics Technician"}'::TEXT[], '{}'::TEXT[], '{"Defense","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('4811a0b8-bc77-4d7c-82a8-8b43e23f8b03'::UUID, 'usaf', '2S0X1', 'Material Management', '{"Supply Chain Specialist","Inventory Manager","Materials Manager","Purchasing Agent"}'::TEXT[], '{}'::TEXT[], '{"Logistics","Manufacturing","Retail"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('487e27e6-cf05-4462-88d1-9cc62b56c41c'::UUID, 'usaf', '9S100', 'Technical Applications Specialist', '{"Data Scientist","Technical Analyst","Systems Analyst","Research Scientist"}'::TEXT[], '{}'::TEXT[], '{"Technology","Research","Defense","Intelligence"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('4a15751e-eab1-4d4a-b543-36645414bd25'::UUID, 'navy', 'AD', 'Aviation Machinist Mate', '{"Aircraft Mechanic","A&P Mechanic","Jet Engine Technician","Powerplant Mechanic","Aviation Maintenance Technician"}'::TEXT[], '{"49-3011.00","49-2091.00"}'::TEXT[], '{"Aviation","Aerospace","Defense"}'::TEXT[], '{"Jet Engines","Turbine Maintenance","A&P License","NDI","Hydraulics","Quality Assurance"}'::TEXT[], 'Maintains aircraft engines and related systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('4b1d5951-137d-4720-a993-3c89f4f030bf'::UUID, 'usmc', '1391', 'Bulk Fuel Specialist', '{"Fuel Distribution Specialist","Petroleum Technician","Terminal Operator"}'::TEXT[], '{}'::TEXT[], '{"Oil & Gas","Transportation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('4b447389-6c52-4c22-9a20-55db1cace8f0'::UUID, 'navy', 'EN', 'Engineman', '{"Diesel Mechanic","Marine Engineer","Power Plant Technician","Engine Room Operator","Propulsion Technician"}'::TEXT[], '{}'::TEXT[], '{"Maritime","Energy","Transportation","Manufacturing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('4c1921e7-ddb6-4392-ae08-d28b85df9d92'::UUID, 'army', '68G', 'Patient Administration Specialist', '{"Medical Records Clerk","Health Information Technician","Medical Office Administrator","Patient Services Representative"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Hospitals","Medical Offices"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('4cba2854-c5b8-4665-974e-e4e839444ee7'::UUID, 'usmc', '3043', 'Supply Administration and Operations Clerk', '{"Supply Clerk","Inventory Specialist","Logistics Clerk"}'::TEXT[], '{}'::TEXT[], '{"Logistics","Warehousing","Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('4d253d71-23d6-4e46-b981-1847fe819213'::UUID, 'usmc', '5831', 'Correctional Specialist', '{"Corrections Officer","Detention Officer"}'::TEXT[], '{}'::TEXT[], '{"Corrections","Law Enforcement"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('4d423ce4-737d-4866-906b-bc7a614d023f'::UUID, 'uscg', 'ET', 'Electronics Technician', '{"Electronics Technician","Communications Technician","Field Service Engineer","Radar Technician"}'::TEXT[], '{"17-3023.00","49-2094.00"}'::TEXT[], '{"Electronics","Telecommunications","Defense"}'::TEXT[], '{"Electronics Repair","Radar","Communications Systems","Navigation Aids","Calibration","Troubleshooting"}'::TEXT[], 'Maintains electronic navigation and communication systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('4e2ac5c0-c73f-4716-925c-227af34adaa3'::UUID, 'usaf', '2A0X1', 'Avionics Test Station and Components', '{"Avionics Technician","Test Equipment Technician","Electronics Technician","Calibration Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Electronics"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('4e45a9ed-3279-49ce-bc6b-969d3a220688'::UUID, 'army', '68Q', 'Pharmacy Specialist', '{"Pharmacy Technician","Pharmaceutical Technician","Pharmacy Assistant"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Pharmacy","Hospitals","Retail Pharmacy"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('4e70aecc-8b9a-4027-bc35-7aab6ba98a3a'::UUID, 'uscg', 'MACH', 'Machinery Technician', '{"Chief Engineer","Marine Engineer","Plant Manager","Maintenance Director"}'::TEXT[], '{}'::TEXT[], '{"Maritime","Manufacturing","Energy"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('4f3765b7-2c2a-4249-ac01-737b227a9c2c'::UUID, 'usaf', '3E7X1', 'Fire Protection', '{"Firefighter","Fire Inspector","Fire Protection Engineer","EHS Manager","Emergency Manager"}'::TEXT[], '{"33-2011.00","33-2021.00"}'::TEXT[], '{"Fire Service","Government","Defense","Industrial"}'::TEXT[], '{"Structural Firefighting","Aircraft Rescue","HAZMAT","Fire Inspection","Emergency Management","NFPA"}'::TEXT[], 'Manages fire prevention and protection programs')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('4fae9b1d-cbe7-4125-941c-42b4dfe60f49'::UUID, 'army', '25Q', 'Multichannel Transmission Systems Operator-Maintainer', '{"Transmission Technician","Network Technician","Communications Specialist"}'::TEXT[], '{}'::TEXT[], '{"Telecommunications","Technology"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('4fb81fb8-273a-48de-b939-63725917f9b3'::UUID, 'army', '35L', 'Counterintelligence Agent', '{"Counterintelligence Specialist","Security Specialist","Investigator","Threat Analyst"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Defense","Government","Corporate Security"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('4fd3ed9e-b4a6-44b6-a799-5394f6509b37'::UUID, 'usmc', '0612', 'Field Wireman', '{"Cable Technician","Telecommunications Technician","Network Installer"}'::TEXT[], '{}'::TEXT[], '{"Telecommunications","Construction"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('517be989-8969-4b09-b11d-611111c398be'::UUID, 'usmc', '6048', 'Flight Equipment Technician', '{"Life Support Technician","Flight Equipment Specialist"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('519be932-d3a7-4c18-aba5-442b265bd20c'::UUID, 'usaf', '3P0X1', 'Security Forces', '{"Security Manager","Law Enforcement Officer","Physical Security Specialist","Force Protection Manager","Corrections Officer"}'::TEXT[], '{"33-9032.00","33-3051.00"}'::TEXT[], '{"Security","Law Enforcement","Government"}'::TEXT[], '{"Force Protection","Physical Security","Law Enforcement","Access Control","Investigations","Anti-Terrorism"}'::TEXT[], 'Protects personnel, property, and resources')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('51a885ff-7bdb-4c1c-87a3-60b3c527c3b5'::UUID, 'army', '14G', 'Air Defense Battle Management System Operator', '{"Systems Operator","Network Administrator","Air Traffic Controller"}'::TEXT[], '{}'::TEXT[], '{"Defense","Aviation","Technology"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('52b7f105-a29f-4546-bbc7-c087d0b1fdb1'::UUID, 'usaf', '2T0X1', 'Traffic Management', '{"Traffic Manager","Transportation Coordinator","Logistics Specialist","Freight Coordinator"}'::TEXT[], '{}'::TEXT[], '{"Logistics","Transportation","Shipping"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('52dcb220-e65b-4a68-8355-437f1f70a936'::UUID, 'ussf', '3F5X1', 'Administration', '{"Administrative Assistant","Executive Assistant","Office Manager","Administrative Coordinator","Program Assistant"}'::TEXT[], '{}'::TEXT[], '{"Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('533e92ac-ccc1-4842-97cd-44eff04de8b2'::UUID, 'usaf', '3D1X2', 'Cyber Transport Systems', '{"Network Administrator","Network Engineer","Systems Administrator","Communications Specialist"}'::TEXT[], '{}'::TEXT[], '{"Technology","Telecommunications"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('53523b01-d93d-4d7f-b082-0952a149ccad'::UUID, 'usmc', '6499', 'Unmanned Aerial Vehicle Operator', '{"Drone Pilot","UAV Operator","UAS Pilot","Remote Pilot"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Technology","Agriculture","Film"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('53855c60-5d74-48a9-bc9b-d41b8e0b11d4'::UUID, 'army', '18B', 'Special Forces Weapons Sergeant', '{"Security Consultant","Weapons Instructor","Security Manager","Training Director"}'::TEXT[], '{}'::TEXT[], '{"Security","Defense","Training","Consulting"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('53e01df4-3955-4e51-b303-e0c3bfd93382'::UUID, 'navy', 'IT', 'Information Systems Technician', '{"Network Administrator","Systems Administrator","IT Support Specialist","Cybersecurity Analyst","Network Engineer","Help Desk Manager"}'::TEXT[], '{"15-1244.00","15-1231.00","15-1232.00"}'::TEXT[], '{"Technology","Defense","Telecommunications","Government","Financial Services"}'::TEXT[], '{"Network Administration","System Security","COMSEC","Cisco","Windows Server","Linux","Troubleshooting","Encryption"}'::TEXT[], 'Operates and maintains Navy communications and IT systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('541c477a-e24c-4f19-9408-69b9d5cc6889'::UUID, 'navy', 'AWO', 'Naval Aircrewman (Operator)', '{"Sensor Operator","Intelligence Analyst","Surveillance Systems Operator","Data Analyst"}'::TEXT[], '{"13-1161.00"}'::TEXT[], '{"Defense","Intelligence","Technology"}'::TEXT[], '{"Sensor Systems","Data Analysis","Mission Planning","Communications","ISR"}'::TEXT[], 'Operates airborne electronic sensors and communication systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('5446f806-dca9-4d61-bf23-95945d2c73bf'::UUID, 'navy', 'LS', 'Logistics Specialist', '{"Logistics Coordinator","Supply Chain Analyst","Inventory Manager","Purchasing Agent","Materials Manager","Warehouse Manager"}'::TEXT[], '{}'::TEXT[], '{"Logistics","Retail","Manufacturing","Government","Transportation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('548b2f20-019d-485a-afe6-9d9f216121b7'::UUID, 'army', '68D', 'Operating Room Specialist', '{"Surgical Technologist","Operating Room Technician","Scrub Tech"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Hospitals","Surgery Centers"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('551ca142-f92a-4396-a2a3-6f756cb9b860'::UUID, 'navy', 'PS', 'Personnel Specialist', '{"Human Resources Specialist","HR Coordinator","Payroll Administrator","Benefits Administrator","Talent Acquisition Specialist"}'::TEXT[], '{"13-1071.00","13-1141.00","43-3051.00"}'::TEXT[], '{"Any Industry","Government","Corporate"}'::TEXT[], '{"Personnel Management","Payroll","Benefits Administration","HRIS","Onboarding","Separations","Records Management"}'::TEXT[], 'Manages personnel records, pay, and benefits')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('5604219a-7fce-48bf-8558-7689ab1982ad'::UUID, 'usmc', '0261', 'Geographic Intelligence Specialist', '{"GIS Analyst","Cartographer","Geospatial Specialist"}'::TEXT[], '{}'::TEXT[], '{"Government","Technology","Engineering"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('56caf527-0062-44aa-8f8a-23f588ec0250'::UUID, 'usmc', '1371', 'Combat Engineer', '{"Construction Supervisor","Construction Manager","Demolition Specialist"}'::TEXT[], '{}'::TEXT[], '{"Construction","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('57a3d543-dfc1-462c-b47b-6c4bd62d7adc'::UUID, 'navy', 'CTT', 'Cryptologic Technician (Technical)', '{"Electronic Warfare Technician","ELINT Analyst","Radar Systems Analyst","Technical Intelligence Analyst"}'::TEXT[], '{"13-1161.00","17-3023.00"}'::TEXT[], '{"Defense","Intelligence","Aerospace"}'::TEXT[], '{"Electronic Warfare","ELINT","Radar Analysis","Technical Intelligence","Threat Analysis"}'::TEXT[], 'Conducts electronic warfare and technical intelligence')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('57ceefab-d4f7-4b40-a6b8-66175c1cdbcf'::UUID, 'army', '68M', 'Nutrition Care Specialist', '{"Dietetic Technician","Nutrition Assistant","Food Service Supervisor"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Food Service","Hospitals"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('5a37fc7a-8b79-41cd-86e8-b3f4e0dce0f4'::UUID, 'usaf', '4N0X1', 'Aerospace Medical Service', '{"Medical Assistant","EMT","Medical Technician","Healthcare Technician"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Emergency Services","Aviation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('5b0110a2-fded-4f1c-862d-b73678ed7add'::UUID, 'army', '35F', 'Intelligence Analyst', '{"Intelligence Analyst","Business Intelligence Analyst","Data Analyst","Research Analyst","Threat Analyst","Competitive Intelligence Analyst"}'::TEXT[], '{"13-1161.00","15-2051.00","33-3021.00"}'::TEXT[], '{"Intelligence","Defense","Finance","Technology","Government"}'::TEXT[], '{"Intelligence Analysis","Data Analysis","Briefing","Report Writing","OSINT","Threat Assessment","GIS"}'::TEXT[], 'Produces intelligence products from collected information')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('5bb21b8c-9f3b-48ab-81e2-4fdd0f961907'::UUID, 'navy', 'IT', 'Information Systems Technician', '{"Network Administrator","Systems Administrator","IT Support Specialist","Network Engineer","Cybersecurity Specialist"}'::TEXT[], '{}'::TEXT[], '{"Technology","Government","Finance","Healthcare","Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('5c43776a-74d0-4030-8130-ef599f54d989'::UUID, 'army', '68B', 'Orthopedic Specialist', '{"Orthopedic Technician","Cast Technician","Orthopedic Assistant"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Orthopedics"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('5cb5c735-c637-435d-a2bd-1cafc90543a3'::UUID, 'usmc', '0811', 'Field Artillery Cannoneer', '{"Operations Specialist","Logistics Coordinator","Team Lead","Technical Specialist"}'::TEXT[], '{"11-1021.00"}'::TEXT[], '{"Defense","Logistics","Management"}'::TEXT[], '{"Artillery Operations","Logistics","Team Leadership","Communication","Equipment Maintenance"}'::TEXT[], 'Operates and maintains artillery weapons systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('5d7d7a6c-1c00-4062-b97e-b5ac377fa83c'::UUID, 'usaf', '4H0X1', 'Cardiopulmonary Laboratory', '{"Cardiovascular Technologist","EKG Technician","Pulmonary Function Technologist"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Hospitals","Cardiology"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('5df9f3d2-f77e-495a-90e0-7ae202ee410d'::UUID, 'usaf', '3D1X1', 'Client Systems', '{"IT Support Specialist","Desktop Support Technician","Help Desk Technician","Systems Administrator"}'::TEXT[], '{}'::TEXT[], '{"Technology","Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('5e32ab30-b7db-461e-98c7-08d2b09ea6fa'::UUID, 'usaf', '2W1X1', 'Aircraft Armament Systems', '{"Armament Technician","Weapons Systems Technician","Aircraft Weapons Specialist"}'::TEXT[], '{}'::TEXT[], '{"Defense","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('5eca4dd6-2e93-41d4-a812-db4fb78c92d2'::UUID, 'army', '25L', 'Cable Systems Installer-Maintainer', '{"Cable Technician","Network Cable Installer","Telecommunications Technician","Low Voltage Technician"}'::TEXT[], '{}'::TEXT[], '{"Telecommunications","Construction","Technology"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('5fba28eb-52c7-41c0-bfaf-5907507f44d9'::UUID, 'usaf', '2T1X1', 'Vehicle Operations', '{"Fleet Manager","Transportation Supervisor","Dispatcher","Commercial Driver"}'::TEXT[], '{}'::TEXT[], '{"Transportation","Logistics","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('5fdd76b9-3ac9-4409-9b7b-08635fa39342'::UUID, 'navy', 'PR', 'Aircrew Survival Equipmentman', '{"Aviation Life Support Technician","Safety Equipment Specialist","Parachute Rigger","Aviation Safety Coordinator"}'::TEXT[], '{"49-9099.00"}'::TEXT[], '{"Aviation","Defense","Safety"}'::TEXT[], '{"Life Support Systems","Parachute Rigging","Survival Equipment","Quality Assurance","Inspection"}'::TEXT[], 'Maintains aircrew survival equipment and life support systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('61e176ee-be49-4822-9ea7-029bdcb79731'::UUID, 'navy', 'OS', 'Operations Specialist', '{"Operations Coordinator","Air Traffic Controller","Logistics Coordinator","Intelligence Analyst","Operations Analyst"}'::TEXT[], '{"53-2021.00","13-1081.00"}'::TEXT[], '{"Defense","Aviation","Transportation","Logistics"}'::TEXT[], '{"Radar Operations","Air Traffic Control","Tactical Communications","Data Analysis","Watch Standing"}'::TEXT[], 'Operates radar and communication systems for tactical operations')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('621e9624-07e0-480e-a58f-a1ea2a8338eb'::UUID, 'usaf', '1A0X1', 'In-Flight Refueling', '{"Flight Engineer","Aerial Refueling Operator","Aviation Operations Specialist"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('628dc12d-eb31-4e32-8e35-a9e818079c09'::UUID, 'ussf', 'SF-LNCH', 'Launch Operations', '{"Launch Controller","Range Safety Officer","Launch Operations Specialist"}'::TEXT[], '{}'::TEXT[], '{"SpaceX","ULA","Rocket Lab","Blue Origin"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('62ed5abc-c607-45d2-90f2-4e5cb360ba20'::UUID, 'usaf', '2W2X1', 'Nuclear Weapons', '{"Nuclear Security Specialist","Nuclear Technician","Security Specialist"}'::TEXT[], '{}'::TEXT[], '{"Energy","Defense","Security"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('63222eed-a819-4f23-9126-def8f60130bb'::UUID, 'navy', 'HT', 'Hull Maintenance Technician', '{"Welder","Pipefitter","Sheet Metal Worker","Marine Welder","Maintenance Mechanic","Plumber"}'::TEXT[], '{}'::TEXT[], '{"Manufacturing","Shipbuilding","Construction","Oil & Gas"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('6446ed3e-d580-468b-8eef-89a983f93c17'::UUID, 'usaf', '3F0X1', 'Personnel', '{"HR Specialist","Personnel Specialist","HR Generalist","Benefits Administrator"}'::TEXT[], '{}'::TEXT[], '{"Human Resources","Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('6461cbb9-e3d1-4cf8-9369-6919583e05c9'::UUID, 'usaf', '3E9X1', 'Emergency Management', '{"Emergency Manager","Emergency Preparedness Coordinator","Disaster Recovery Specialist","Business Continuity Planner"}'::TEXT[], '{}'::TEXT[], '{"Government","Healthcare","Corporate","Emergency Services"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('64c7697e-dede-4206-9dab-5ad5041869bf'::UUID, 'usmc', '3529', 'Motor Transport Operator', '{"Truck Driver","CDL Driver","Fleet Driver"}'::TEXT[], '{}'::TEXT[], '{"Transportation","Logistics"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('65034dda-88ad-41c1-8fd1-1a06ce6ab4f9'::UUID, 'usaf', '3F1X1', 'Services', '{"Food Service Manager","Hospitality Manager","Recreation Director","Lodging Manager"}'::TEXT[], '{}'::TEXT[], '{"Food Service","Hospitality","Recreation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('6535cd75-ed07-4d02-a65d-3984793db2f4'::UUID, 'navy', 'AZ', 'Aviation Maintenance Administrationman', '{"Maintenance Administrator","Production Control Clerk","Logistics Coordinator","Materials Manager","Maintenance Planner"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Manufacturing","Logistics","Transportation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('6542e706-cdd6-41ab-ad1e-6760aad3028b'::UUID, 'usmc', '0621', 'Field Radio Operator', '{"Communications Technician","Radio Frequency Engineer","Telecommunications Specialist","Network Technician"}'::TEXT[], '{"27-3012.00","17-3023.00"}'::TEXT[], '{"Telecommunications","Defense","Technology"}'::TEXT[], '{"Radio Communications","COMSEC","Antenna Theory","Troubleshooting","Signal Processing","Encryption"}'::TEXT[], 'Installs, operates, and maintains radio communications equipment')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('658f7bb5-3a36-439b-8a9b-c34e0968ec8c'::UUID, 'navy', 'AWF', 'Naval Aircrewman (Mechanical)', '{"Flight Engineer","Aircraft Systems Operator","In-Flight Technician"}'::TEXT[], '{"53-2012.00"}'::TEXT[], '{"Aviation","Defense"}'::TEXT[], '{"In-Flight Operations","Aircraft Systems","Emergency Procedures","Mission Planning"}'::TEXT[], 'In-flight mission systems operator and aircraft mechanic')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('679003db-e276-4507-90c8-4e10783c6e12'::UUID, 'usaf', '4E0X1', 'Public Health', '{"Public Health Technician","Health Educator","Community Health Worker","Epidemiology Technician"}'::TEXT[], '{}'::TEXT[], '{"Public Health","Government","Healthcare"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('68495f3c-14db-4489-8c02-879ec91b1302'::UUID, 'usmc', '6317', 'Aircraft Communications/Navigation/Radar Systems Technician', '{"Radar Technician","Avionics Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('687d5ea0-1f83-4ae9-aba2-015f4cecd4d4'::UUID, 'army', '27D', 'Paralegal Specialist', '{"Paralegal","Legal Assistant","Legal Secretary","Litigation Support Specialist"}'::TEXT[], '{}'::TEXT[], '{"Legal","Government","Corporate"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('68801ad3-52e2-45a6-b317-94b86e06d684'::UUID, 'usaf', '3E2X1', 'Pavement and Construction Equipment', '{"Heavy Equipment Operator","Construction Equipment Operator","Paving Specialist"}'::TEXT[], '{}'::TEXT[], '{"Construction","Government","Infrastructure"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('68fee551-006a-477d-b335-3b3151441a16'::UUID, 'usmc', '0341', 'Mortarman', '{"Security Specialist","Training Instructor","Heavy Equipment Operator"}'::TEXT[], '{}'::TEXT[], '{"Security","Defense","Training"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('69014b95-5b3a-41f0-af16-7f429aa0e58e'::UUID, 'usaf', '1N1X1', 'Geospatial Intelligence', '{"Geospatial Analyst","Imagery Analyst","GIS Specialist","Remote Sensing Analyst"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Government","Technology","Environmental"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('697cda19-6419-44b1-bf2d-962cc43c3b7f'::UUID, 'navy', 'EOD', 'Explosive Ordnance Disposal Technician', '{"Bomb Technician","EOD Specialist","Explosive Safety Specialist","Security Consultant","Demining Specialist"}'::TEXT[], '{}'::TEXT[], '{"Law Enforcement","Security","Defense","Mining","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('6a593752-5fdf-426e-832c-01ffa6d41f7c'::UUID, 'usaf', '4C0X1', 'Mental Health Service', '{"Mental Health Technician","Behavioral Health Technician","Psychiatric Technician","Case Manager"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Mental Health","Social Services"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('6a72a00b-3686-4dfd-a06e-1aaf223fc79d'::UUID, 'army', '11B', 'Infantryman', '{"Security Specialist","Law Enforcement Officer","Security Manager","Protective Services","Security Consultant","Park Ranger"}'::TEXT[], '{}'::TEXT[], '{"Security","Law Enforcement","Government","Private Security"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('6b2c9235-43a3-4777-8f69-5f9d8e123c59'::UUID, 'army', '35M', 'Human Intelligence Collector', '{"Intelligence Analyst","Investigator","Interviewer","Research Specialist"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Government","Consulting","Law Enforcement"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('6b3d2dee-329c-460b-bb88-f43f91e5b985'::UUID, 'navy', 'MT', 'Missile Technician', '{"Missile Systems Technician","Aerospace Technician","Weapons Systems Technician","Test Technician"}'::TEXT[], '{}'::TEXT[], '{"Defense","Aerospace","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('6cb1ed1c-301c-4343-a363-c03925cba61c'::UUID, 'usmc', '1721', 'Cyberspace Warfare Operator', '{"Cyber Operations Specialist","Penetration Tester","Red Team Operator","SOC Analyst"}'::TEXT[], '{"15-1212.00"}'::TEXT[], '{"Cybersecurity","Defense","Technology"}'::TEXT[], '{"Offensive Cyber","Penetration Testing","Network Defense","Exploit Development","Python","Linux"}'::TEXT[], 'Conducts offensive and defensive cyberspace operations')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('6cfd1b5e-b731-4bc6-b509-2cf028042a7e'::UUID, 'navy', 'LS', 'Logistics Specialist', '{"Supply Chain Manager","Logistics Coordinator","Inventory Manager","Procurement Specialist","Warehouse Manager","Materials Manager"}'::TEXT[], '{"13-1081.00","11-3071.00","43-5071.00"}'::TEXT[], '{"Logistics","Retail","Manufacturing","Defense","Healthcare"}'::TEXT[], '{"Supply Chain","Inventory Control","Procurement","SAP","Warehouse Management","Shipping/Receiving","Financial Management"}'::TEXT[], 'Manages supply chain, inventory, and procurement operations')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('6da6103e-ec11-48b7-88f9-197d66bb1ca2'::UUID, 'usaf', '1C4X1', 'Tactical Air Control Party', '{"Tactical Coordinator","Security Specialist","Operations Coordinator"}'::TEXT[], '{}'::TEXT[], '{"Defense","Security"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('6e263ce6-e194-44a4-9d03-acb83931d73f'::UUID, 'usaf', '8R000', 'Recruiter', '{"Recruiter","Talent Acquisition Specialist","HR Recruiter","Staffing Specialist"}'::TEXT[], '{}'::TEXT[], '{"Human Resources","Staffing","Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('6e6fb7e5-5a00-49e0-9c25-40c6dbb8c88e'::UUID, 'army', '56M', 'Chaplain Assistant', '{"Religious Program Coordinator","Administrative Assistant","Community Outreach Coordinator"}'::TEXT[], '{}'::TEXT[], '{"Religious Organizations","Non-Profit","Social Services"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('6f74ac3f-41c0-4fd1-bf11-913864c04ccf'::UUID, 'usmc', '8411', 'Recruiter', '{"Recruiter","Talent Acquisition Specialist","Staffing Specialist"}'::TEXT[], '{}'::TEXT[], '{"Human Resources","Staffing","Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('6fda6b73-9f02-400d-baaa-0f0c9b46324e'::UUID, 'navy', 'ND', 'Navy Diver', '{"Commercial Diver","Diving Supervisor","Underwater Welder","Salvage Diver","Marine Surveyor"}'::TEXT[], '{"49-9092.00"}'::TEXT[], '{"Marine","Oil & Gas","Construction","Salvage"}'::TEXT[], '{"Mixed Gas Diving","Underwater Welding","Salvage Operations","Ship Husbandry","Hyperbaric Operations"}'::TEXT[], 'Performs underwater ship maintenance, salvage, and construction')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('70094aad-732d-44c3-971b-c06550cf5125'::UUID, 'usmc', '6461', 'Aviation Ordnance Technician', '{"Ordnance Technician","Weapons Specialist"}'::TEXT[], '{}'::TEXT[], '{"Defense","Aviation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('7035e51b-21e1-4dad-908f-8b0a904eb01d'::UUID, 'army', '68X', 'Behavioral Health Specialist', '{"Mental Health Technician","Behavioral Health Technician","Psychiatric Technician","Counselor Assistant"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Mental Health","Social Services"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('70888e97-8f08-45e7-82fc-74ee1005c355'::UUID, 'usmc', '3531', 'Motor Vehicle Operator', '{"Commercial Driver","Delivery Driver","Vehicle Operator"}'::TEXT[], '{}'::TEXT[], '{"Transportation","Logistics","Delivery"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('717bfe72-f578-480d-bd89-b1ea2c0127bb'::UUID, 'usaf', '9L000', 'Interpreter/Translator', '{"Interpreter","Translator","Linguist","Language Specialist"}'::TEXT[], '{}'::TEXT[], '{"Translation Services","Government","Healthcare","Legal"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('72120f51-61ce-45fe-9b56-0de4661817f8'::UUID, 'navy', 'FC', 'Fire Controlman', '{"Weapons Systems Technician","Fire Control Technician","Missile Technician","Systems Engineer","Test Engineer"}'::TEXT[], '{}'::TEXT[], '{"Defense","Aerospace","Electronics","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('7530f3da-f5e3-4e46-b9fa-114fb6c840e9'::UUID, 'ussf', '3D0X3', 'Cyber Surety', '{"Information Security Analyst","Security Administrator","Compliance Analyst","IT Auditor","Cybersecurity Engineer"}'::TEXT[], '{}'::TEXT[], '{"Technology","Aerospace","Finance","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('75aca117-cbc5-4a2c-a304-9a9e7e87939a'::UUID, 'uscg', 'DC', 'Damage Controlman', '{"Firefighter","Plumber","Pipefitter","HAZMAT Technician","Safety Manager","Fire Inspector","Industrial Firefighter"}'::TEXT[], '{}'::TEXT[], '{"Fire Service","Construction","Oil & Gas","Manufacturing","Facilities"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('75c6d96b-3a9e-46ec-b7f6-d679df65a3bd'::UUID, 'usaf', '2T2X1', 'Air Transportation', '{"Air Cargo Specialist","Freight Handler","Air Transportation Specialist","Load Planner"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Logistics","Transportation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('76271baf-6115-43a5-975e-f9bdca7c95b1'::UUID, 'usmc', '0231', 'Intelligence Specialist', '{"Intelligence Analyst","All-Source Analyst","Threat Analyst","Research Analyst"}'::TEXT[], '{"13-1161.00"}'::TEXT[], '{"Intelligence","Defense","Government"}'::TEXT[], '{"Intelligence Analysis","IPB","OSINT","Geospatial","Briefing","Report Writing","DCGS"}'::TEXT[], 'Collects, records, analyzes, and disseminates intelligence')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('762fa00d-b010-40f8-8ca1-6e9510d4e9ec'::UUID, 'navy', 'MA', 'Master-at-Arms', '{"Security Officer","Police Officer","Loss Prevention Specialist","Security Manager","Corrections Officer","Federal Agent"}'::TEXT[], '{}'::TEXT[], '{"Security","Law Enforcement","Government","Corporate Security"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('76316e3b-e02a-4b0d-9f10-e908b7749ffb'::UUID, 'uscg', 'INV', 'Investigator', '{"Special Agent","Criminal Investigator","Fraud Investigator","Security Investigator"}'::TEXT[], '{}'::TEXT[], '{"Law Enforcement","Security","Insurance","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('763af6c9-6531-4958-a22b-81fb6f1aaa82'::UUID, 'usaf', '1C2X1', 'Combat Control', '{"Air Traffic Controller","Security Consultant","Operations Specialist","Tactical Controller"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Security","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('765555bb-800c-4dca-8128-d6d9965089cc'::UUID, 'usaf', '1A2X1', 'Aircraft Loadmaster', '{"Loadmaster","Cargo Specialist","Air Freight Coordinator","Logistics Specialist"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Logistics","Transportation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('768cad06-8c90-4473-8d4e-e45735fd35b3'::UUID, 'usaf', '3N0X5', 'Photojournalist', '{"Photojournalist","Photographer","Videographer","Visual Journalist"}'::TEXT[], '{}'::TEXT[], '{"Media","News","Marketing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('772ed4d9-2cbd-477b-8358-b76c045d0410'::UUID, 'usaf', '2A3X3', 'Tactical Aircraft Maintenance', '{"Aircraft Maintenance Technician","Aviation Maintenance Manager","A&P Mechanic","Maintenance Planner","Quality Assurance Inspector"}'::TEXT[], '{"49-3011.00","49-2091.00"}'::TEXT[], '{"Aerospace","Aviation","Defense","Manufacturing"}'::TEXT[], '{"Aircraft Maintenance","Avionics","Technical Orders","FOD Prevention","Inspections","Tool Control","Safety Compliance"}'::TEXT[], 'Maintains tactical aircraft systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('78d8ed22-883b-4e7c-8e10-c70d945e0026'::UUID, 'navy', 'AWR', 'Naval Aircrewman (Helicopter)', '{"Search and Rescue Technician","Emergency Medical Technician","Helicopter Crew Chief","Flight Paramedic"}'::TEXT[], '{"29-2041.00","53-2012.00"}'::TEXT[], '{"Emergency Services","Aviation","Healthcare"}'::TEXT[], '{"Search and Rescue","Emergency Medicine","Helicopter Operations","Swimmer Rescue","Patient Care"}'::TEXT[], 'Performs search and rescue and helicopter aircrewing')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('79444d7e-979b-4a7f-b461-d7024f6c8d40'::UUID, 'navy', 'CE', 'Construction Electrician', '{"Electrician","Electrical Contractor","Electrical Foreman","Building Maintenance Electrician","Power Distribution Technician"}'::TEXT[], '{"47-2111.00"}'::TEXT[], '{"Construction","Utilities","Facilities"}'::TEXT[], '{"Electrical Wiring","Power Distribution","NEC Code","Motor Controls","Transformers","Generators"}'::TEXT[], 'Builds, maintains, and operates electrical power systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('7a18ecc1-f4d9-4032-92ff-4505a5953894'::UUID, 'uscg', 'DIVER', 'Diver', '{"Commercial Diver","Diving Supervisor","Underwater Welder","Salvage Diver"}'::TEXT[], '{}'::TEXT[], '{"Oil & Gas","Construction","Salvage","Marine"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('7a29a3f7-a006-451e-b734-85dc2f28ac57'::UUID, 'uscg', 'IT', 'Information Systems Technician', '{"Network Administrator","Systems Administrator","IT Specialist","Cybersecurity Specialist","Help Desk Technician"}'::TEXT[], '{}'::TEXT[], '{"Technology","Government","Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('7a5e8623-3fee-464e-8093-2f28e11758ca'::UUID, 'ussf', '6C0X1', 'Contracting', '{"Contract Specialist","Procurement Specialist","Contracting Officer","Acquisitions Specialist","Contract Manager"}'::TEXT[], '{}'::TEXT[], '{"Government","Defense","Aerospace","Procurement"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('7ab0a09b-f28e-437d-b128-836111bed6ae'::UUID, 'usmc', '3043', 'Supply Administration', '{"Supply Chain Coordinator","Inventory Manager","Procurement Specialist","Logistics Analyst"}'::TEXT[], '{"43-5071.00","13-1023.00"}'::TEXT[], '{"Logistics","Retail","Manufacturing"}'::TEXT[], '{"Supply Chain","Inventory Management","Procurement","GCSS-MC","Property Accountability"}'::TEXT[], 'Manages supply operations and inventory control')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('7adb0861-f8bf-4a94-8b04-2ed08fe54cc1'::UUID, 'usmc', '0121', 'Personnel Clerk', '{"HR Clerk","Personnel Specialist","HR Assistant"}'::TEXT[], '{}'::TEXT[], '{"Human Resources","Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('7b247614-8c33-45ff-9bfa-e8f4d80fefca'::UUID, 'usaf', '6C0X1', 'Contracting', '{"Contract Specialist","Procurement Specialist","Contracting Officer","Purchasing Agent"}'::TEXT[], '{}'::TEXT[], '{"Government","Defense","Procurement"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('7c9f73f8-4651-43e5-8ec8-7835289a85c8'::UUID, 'navy', 'YN', 'Yeoman', '{"Administrative Assistant","Office Manager","Executive Assistant","Human Resources Coordinator","Records Manager"}'::TEXT[], '{"43-6014.00","43-6011.00","11-3121.00"}'::TEXT[], '{"Any Industry","Government","Corporate","Healthcare"}'::TEXT[], '{"Records Management","Correspondence","Personnel Administration","Microsoft Office","Travel Management","Document Control"}'::TEXT[], 'Performs administrative and clerical support functions')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('7cd6aa92-a959-471b-99ad-1ff829641a9d'::UUID, 'ussf', '3D0X2', 'Cyber Systems Operations', '{"Systems Administrator","Network Administrator","IT Specialist","Cybersecurity Specialist","Cloud Systems Administrator"}'::TEXT[], '{}'::TEXT[], '{"Technology","Aerospace","Government","Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('7ce83956-d17c-4822-a827-4afc5546b82d'::UUID, 'usaf', '3E1X1', 'Heating, Ventilation, Air Conditioning, Refrigeration (HVAC-R)', '{"HVAC Technician","Refrigeration Technician","HVAC Mechanic","Facilities Technician"}'::TEXT[], '{}'::TEXT[], '{"HVAC","Facilities","Construction"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('7d142bbb-ef70-49c6-974e-46863b2fc8be'::UUID, 'usmc', '0241', 'Imagery Analysis Specialist', '{"Imagery Analyst","Geospatial Analyst","GIS Analyst"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Government","Technology"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('7d26ea24-a9b2-4fbf-8c20-b1f5daa4ef21'::UUID, 'navy', 'CTI', 'Cryptologic Technician Interpretive', '{"Linguist","Intelligence Analyst","Foreign Language Specialist","Translator","Cultural Advisor"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Government","Defense","Consulting","International Business"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('7d4f625b-4023-40db-bd9a-921b1f17b62b'::UUID, 'army', '12B', 'Combat Engineer', '{"Construction Manager","Demolition Specialist","Heavy Equipment Operator","Project Coordinator"}'::TEXT[], '{"47-2061.00","47-2073.00"}'::TEXT[], '{"Construction","Mining","Government"}'::TEXT[], '{"Construction","Demolition","Heavy Equipment","Route Clearance","Blueprint Reading","Project Management"}'::TEXT[], 'Performs combat and general engineering operations')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('7e5f06f1-f380-4c60-bb80-cb53d00b7e9a'::UUID, 'usaf', '2R1X1', 'Maintenance Management Production', '{"Production Controller","Maintenance Manager","Operations Supervisor","Production Planner"}'::TEXT[], '{}'::TEXT[], '{"Manufacturing","Aviation","Logistics"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('7e7261dd-9ea6-4a35-964f-3708fee34c85'::UUID, 'army', '13B', 'Cannon Crewmember', '{"Security Specialist","Heavy Equipment Operator","Training Instructor"}'::TEXT[], '{}'::TEXT[], '{"Security","Defense","Training"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('7e86e7f3-56c4-4cba-9349-0d7d4d45a302'::UUID, 'navy', 'CE', 'Construction Electrician', '{"Electrician","Electrical Contractor","Electrical Supervisor","Facilities Electrician","Industrial Electrician"}'::TEXT[], '{}'::TEXT[], '{"Construction","Utilities","Manufacturing","Facilities Management"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('7e8b978b-cddc-4e03-85e0-671e8b75a63b'::UUID, 'navy', 'MM', 'Machinists Mate', '{"Marine Engineer","Machinist","Mechanical Maintenance Technician","Boiler Technician","Steam Plant Operator","Power Plant Operator"}'::TEXT[], '{"51-4041.00","51-8013.00","49-9041.00"}'::TEXT[], '{"Manufacturing","Energy","Marine","Utilities"}'::TEXT[], '{"Steam Propulsion","CNC","Lathe","Precision Machining","Boilers","Pumps","Valves","Hydraulics"}'::TEXT[], 'Operates and maintains ship propulsion and auxiliary systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('7f6d7643-2f82-4559-a3aa-1f5f6e8ed919'::UUID, 'usmc', '6311', 'Aircraft Communications/Navigation Systems Technician', '{"Avionics Technician","Navigation Systems Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('7fb0c483-d043-4337-8132-21a56ec44a5b'::UUID, 'usmc', '3381', 'Food Service Specialist', '{"Food Service Manager","Chef","Kitchen Manager","Catering Manager"}'::TEXT[], '{"35-1012.00"}'::TEXT[], '{"Hospitality","Food Service"}'::TEXT[], '{"Food Preparation","Menu Planning","Food Safety","Inventory","Budget Management","ServSafe"}'::TEXT[], 'Manages food service operations')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('80155234-5f29-4a47-bb18-c5f3ce941550'::UUID, 'navy', 'ABH', 'Aviation Boatswains Mate (Handling)', '{"Aircraft Handler","Ramp Operations Manager","Aviation Safety Coordinator","Crash/Rescue Firefighter"}'::TEXT[], '{"53-2022.00"}'::TEXT[], '{"Aviation","Emergency Services"}'::TEXT[], '{"Aircraft Handling","Crash Rescue","Fire Fighting","Safety","Flight Deck Operations"}'::TEXT[], 'Directs aircraft movement and provides crash/rescue firefighting')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('802ff0ff-b57d-407f-9016-a3e0057a86bc'::UUID, 'army', '88L', 'Watercraft Engineer', '{"Marine Engineer","Marine Mechanic","Vessel Engineer"}'::TEXT[], '{}'::TEXT[], '{"Maritime","Shipping","Transportation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('80b91a61-778e-4a5c-922d-895e6e9583f1'::UUID, 'army', '42A', 'Human Resources Specialist', '{"HR Specialist","HR Coordinator","Personnel Administrator","Payroll Specialist","HRIS Analyst"}'::TEXT[], '{"13-1071.00","43-4161.00"}'::TEXT[], '{"Any Industry","Government"}'::TEXT[], '{"HR Management","Personnel Actions","Payroll","Benefits Administration","HRIS","Records Management"}'::TEXT[], 'Performs personnel and human resources functions')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('80dc1ab3-04eb-4667-b641-8ccfca91521d'::UUID, 'army', '38B', 'Civil Affairs Specialist', '{"Government Relations Specialist","Community Liaison","Program Coordinator","International Development Specialist"}'::TEXT[], '{}'::TEXT[], '{"Government","Non-Profit","International Development","Public Affairs"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('817c8644-91ea-488f-a8e4-d1a3f64279a0'::UUID, 'ussf', '3D0X4', 'Computer Systems Programming', '{"Software Developer","Programmer","Application Developer","Software Engineer","Systems Developer"}'::TEXT[], '{}'::TEXT[], '{"Technology","Aerospace","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('81b69222-2beb-4237-9bd0-51f6be6bf0ca'::UUID, 'uscg', 'ET', 'Electronics Technician', '{"Electronics Technician","Radar Technician","Communications Technician","Field Service Engineer","Marine Electronics Technician"}'::TEXT[], '{}'::TEXT[], '{"Telecommunications","Electronics","Maritime","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('81f4a6ef-f903-45b0-b5fe-855847149ca9'::UUID, 'army', '15R', 'AH-64 Attack Helicopter Repairer', '{"Helicopter Mechanic","Aircraft Mechanic","Aviation Maintenance Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('827bcf3d-0308-499d-b48f-d3eb4509d31b'::UUID, 'usmc', '5811', 'Military Police', '{"Police Officer","Security Officer","Corrections Officer"}'::TEXT[], '{}'::TEXT[], '{"Law Enforcement","Security","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('83e6bc9a-a656-4e4b-ba18-b6d9830283c9'::UUID, 'usaf', '4A2X1', 'Biomedical Equipment', '{"Biomedical Equipment Technician","BMET","Clinical Engineer","Medical Equipment Technician"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Medical Device","Hospitals"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('83f02d2a-f321-4695-a1ed-db10b75b48cd'::UUID, 'navy', 'AWS', 'Naval Aircrewman (Anti-Submarine)', '{"Sonar Analyst","Acoustics Technician","Intelligence Analyst","Sensor Operator"}'::TEXT[], '{"13-1161.00"}'::TEXT[], '{"Defense","Technology","Intelligence"}'::TEXT[], '{"Sonar Systems","Acoustic Analysis","Anti-Submarine Warfare","Data Analysis","Mission Planning"}'::TEXT[], 'Operates airborne anti-submarine warfare systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('84254972-efe8-471b-8e4e-c52411839b1f'::UUID, 'usmc', '2651', 'Special Communications Signals Collection Operator', '{"SIGINT Analyst","Electronic Warfare Specialist","Signals Analyst","Intelligence Collector"}'::TEXT[], '{"13-1161.00"}'::TEXT[], '{"Intelligence","Defense"}'::TEXT[], '{"SIGINT","Electronic Warfare","Signal Processing","Collection Operations","Technical Analysis"}'::TEXT[], 'Conducts signals intelligence collection and analysis')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('8586c1e8-4868-4ef6-867d-bb5e4e9c6bb5'::UUID, 'usmc', '0651', 'Cyber Network Operator', '{"Network Engineer","Cybersecurity Specialist","Security Analyst"}'::TEXT[], '{}'::TEXT[], '{"Technology","Cybersecurity"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('8628117a-6966-4f15-833b-b535a1cbc922'::UUID, 'usmc', '0313', 'Light Armored Reconnaissance Marine', '{"Security Specialist","Surveillance Specialist","Reconnaissance Specialist"}'::TEXT[], '{}'::TEXT[], '{"Security","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('86642026-67c9-464c-a389-0f9a4bc66925'::UUID, 'usmc', '6492', 'Aviation Precision Measurement Equipment Technician', '{"Calibration Technician","PMEL Technician","Metrology Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Manufacturing","Quality Control"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('86d3a565-ae71-483d-bd17-d949202472d0'::UUID, 'ussf', '9S100', 'Technical Applications Specialist', '{"Data Scientist","Technical Analyst","Systems Analyst","Research Scientist","Operations Research Analyst"}'::TEXT[], '{}'::TEXT[], '{"Technology","Aerospace","Defense","Research"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('870c3577-d010-4495-84e3-927baf2ac73b'::UUID, 'army', '74D', 'Chemical, Biological, Radiological, and Nuclear Specialist', '{"HAZMAT Technician","Environmental Health Specialist","Safety Specialist","Emergency Response Specialist"}'::TEXT[], '{}'::TEXT[], '{"Environmental","Safety","Emergency Response","Chemical"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('872c91a2-7f9b-453b-9206-b6551076d4db'::UUID, 'ussf', '1N4X1', 'Fusion Analyst', '{"Fusion Analyst","Intelligence Analyst","Data Analyst","Space Domain Analyst","Multi-INT Analyst"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Defense","Aerospace","Technology"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('87ce28b7-8cef-43cc-b6ed-a5aa3bd1d04d'::UUID, 'usmc', '6111', 'Helicopter/Tiltrotor Mechanic', '{"Helicopter Mechanic","Rotor Wing Technician","Aircraft Mechanic"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Emergency Services"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('8819bee3-dcc8-4bc1-92de-040186a13d25'::UUID, 'army', '14E', 'Patriot Fire Control Enhanced Operator', '{"Radar Technician","Air Defense Operator","Systems Technician"}'::TEXT[], '{}'::TEXT[], '{"Defense","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('887bc8b0-f871-4aee-9d5b-3bafa75f9506'::UUID, 'usmc', '0481', 'Landing Support Specialist', '{"Cargo Handler","Logistics Coordinator","Freight Specialist"}'::TEXT[], '{}'::TEXT[], '{"Logistics","Shipping","Transportation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('88ed704f-dfa3-490b-a2f3-66587d50bd7a'::UUID, 'usmc', '6252', 'Fixed-Wing Aircraft Power Plants Mechanic', '{"Jet Engine Mechanic","Powerplant Technician","A&P Mechanic"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('88fad514-6117-4aa0-a832-02e3daf71f0b'::UUID, 'navy', 'BU', 'Builder', '{"Carpenter","Construction Supervisor","General Contractor","Building Inspector","Project Manager"}'::TEXT[], '{}'::TEXT[], '{"Construction","Real Estate","Government","Facilities Management"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('898403c6-1f34-4701-bcd9-32edc146ebf4'::UUID, 'usaf', '2A6X4', 'Aircraft Fuel Systems', '{"Fuel Systems Technician","Aircraft Mechanic","Fuel Cell Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('8a91d364-6b70-44ea-9f51-584acab793fb'::UUID, 'usaf', '1N0X1', 'All Source Intelligence Analyst', '{"Intelligence Analyst","All-Source Analyst","Threat Analyst","Research Analyst"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Defense","Consulting","Finance"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('8b3bc06f-d021-481a-ab98-7308ae446c34'::UUID, 'army', '88K', 'Watercraft Operator', '{"Boat Operator","Vessel Captain","Marine Operator","Tugboat Captain"}'::TEXT[], '{}'::TEXT[], '{"Maritime","Shipping","Transportation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('8b525bbc-984f-4885-920b-535c74a3bc42'::UUID, 'usmc', '2871', 'Test Measurement and Diagnostic Equipment Technician', '{"Calibration Technician","TMDE Technician","Metrology Technician"}'::TEXT[], '{}'::TEXT[], '{"Manufacturing","Aerospace","Quality Control"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('8b7f8692-9b9a-4180-95e8-9e217c6df1a7'::UUID, 'usaf', '2A6X2', 'Aerospace Ground Equipment', '{"Ground Support Equipment Technician","Heavy Equipment Mechanic","Diesel Mechanic"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Transportation","Equipment"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('8c763a25-c44e-4edc-891e-bb0373b71d78'::UUID, 'navy', 'EO', 'Equipment Operator', '{"Heavy Equipment Operator","Construction Equipment Operator","Crane Operator","Earth Moving Equipment Operator"}'::TEXT[], '{"47-2073.00","53-7021.00"}'::TEXT[], '{"Construction","Mining","Transportation"}'::TEXT[], '{"Heavy Equipment","Excavation","Grading","Crane Operations","CDL","OSHA"}'::TEXT[], 'Operates heavy construction and earth-moving equipment')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('8d52d62c-882e-43e0-ad8f-f74662bbf79c'::UUID, 'ussf', '3P0X1', 'Security Forces', '{"Security Officer","Police Officer","Security Manager","Loss Prevention Specialist","Federal Protective Officer"}'::TEXT[], '{}'::TEXT[], '{"Security","Law Enforcement","Government","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('8d6597b3-35fe-4d0a-bc03-1650073d2020'::UUID, 'army', '31K', 'Military Working Dog Handler', '{"K-9 Handler","Animal Trainer","Security Dog Handler","Police K-9 Officer"}'::TEXT[], '{}'::TEXT[], '{"Law Enforcement","Security","TSA","Private Security"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('8d9988e0-ae6f-4d42-a5bf-d9bab4149979'::UUID, 'army', '91A', 'M1 Abrams Tank System Maintainer', '{"Heavy Equipment Mechanic","Diesel Mechanic","Vehicle Technician","Track Vehicle Mechanic"}'::TEXT[], '{}'::TEXT[], '{"Mining","Construction","Transportation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('8dd1ddf2-c81e-42ba-9bc6-af5c839aa4ec'::UUID, 'ussf', '1W0X1', 'Weather', '{"Meteorologist","Weather Forecaster","Atmospheric Scientist","Space Weather Analyst","Environmental Scientist"}'::TEXT[], '{}'::TEXT[], '{"Weather Services","Aerospace","Aviation","Government","Energy"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('8e7a0c15-2dfb-44a6-ad71-f7f22a16c425'::UUID, 'usaf', '4N0X1', 'Aerospace Medical Technician', '{"Medical Assistant","EMT","Clinical Technician","Medical Office Manager"}'::TEXT[], '{"31-1014.00","29-2041.00"}'::TEXT[], '{"Healthcare","Government"}'::TEXT[], '{"Patient Care","Vital Signs","Phlebotomy","Medical Records","Triage","Emergency Medicine"}'::TEXT[], 'Provides medical care in clinical and operational settings')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('8ebf4a86-8ea7-490b-bd83-c5d1d0e266cc'::UUID, 'usaf', '1A8X2', 'Airborne ISR Operator', '{"ISR Analyst","Intelligence Analyst","Surveillance Operator","Sensor Operator"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Defense","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('8ed9a832-70b0-4d82-8375-432837d333c2'::UUID, 'navy', 'QM', 'Quartermaster', '{"Navigator","Marine Navigation Officer","Cartographer","GIS Specialist","Hydrographer"}'::TEXT[], '{}'::TEXT[], '{"Maritime","Surveying","Government","Shipping"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('8fd12fc2-e374-4e19-bb1b-26b0b54a3fa9'::UUID, 'navy', 'BM', 'Boatswains Mate', '{"Operations Supervisor","Deck Operations Manager","Marine Operations Coordinator","Logistics Manager","Port Operations Manager"}'::TEXT[], '{"53-5021.00","11-1021.00"}'::TEXT[], '{"Maritime","Transportation","Logistics","Construction"}'::TEXT[], '{"Deck Operations","Crane Operations","Personnel Management","Small Boat Operations","UNREP/VERTREP"}'::TEXT[], 'Supervises deck operations and seamanship')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('90847e91-7949-4e6d-a9fc-1d0a5de35462'::UUID, 'army', '91J', 'Quartermaster and Chemical Equipment Repairer', '{"Equipment Repair Technician","Maintenance Mechanic","Field Service Technician"}'::TEXT[], '{}'::TEXT[], '{"Manufacturing","Facilities","Equipment Rental"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('90ba8b8d-94b1-4f45-ac7e-edec8347cf51'::UUID, 'usmc', '0369', 'Infantry Unit Leader', '{"Operations Manager","Security Manager","Team Leader"}'::TEXT[], '{}'::TEXT[], '{"Security","Management","Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('90cfe0ad-3b6b-4446-be5b-34bd3fbb5473'::UUID, 'army', '13M', 'Multiple Launch Rocket System Crewmember', '{"Heavy Equipment Operator","Weapons Technician","Systems Operator"}'::TEXT[], '{}'::TEXT[], '{"Defense","Security"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('90d4cc51-30a3-43e7-ba37-aba2ad67f82c'::UUID, 'army', '25B', 'Information Technology Specialist', '{"IT Specialist","Network Administrator","Systems Administrator","Help Desk Technician","IT Support Specialist"}'::TEXT[], '{}'::TEXT[], '{"Technology","Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('9107b046-6348-4d89-939a-9a9782f31fff'::UUID, 'navy', 'EA', 'Engineering Aid', '{"Survey Technician","Civil Engineering Technician","CAD Technician","Construction Surveyor","GIS Technician"}'::TEXT[], '{}'::TEXT[], '{"Engineering","Construction","Government","Surveying"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('91f12b48-d748-493a-b55f-dd7c14b9907c'::UUID, 'usaf', '4M0X1', 'Aerospace Physiology', '{"Aerospace Physiologist","Altitude Training Specialist","Aviation Medical Examiner"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Healthcare","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('92ef755f-5830-4ee1-828c-0ed88bfcd15b'::UUID, 'uscg', 'YN', 'Yeoman', '{"Administrative Assistant","Executive Assistant","Office Manager","HR Assistant","Legal Secretary"}'::TEXT[], '{}'::TEXT[], '{"Any Industry","Government","Legal"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('934e78b6-cee6-40e0-9efd-d65d3726880e'::UUID, 'army', '68W', 'Combat Medic', '{"Emergency Medical Technician","Paramedic","Medical Assistant","ER Technician","Urgent Care Technician"}'::TEXT[], '{"29-2041.00","29-2042.00","31-1014.00"}'::TEXT[], '{"Healthcare","Emergency Services","Government"}'::TEXT[], '{"Emergency Medicine","Patient Care","Trauma","Triage","CPR/BLS/ACLS","IV Therapy","Pharmacology"}'::TEXT[], 'Provides emergency medical treatment on the battlefield')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('93829dcb-9e18-46e7-9c20-22cece9c1d9d'::UUID, 'usmc', '6694', 'Aviation Logistics Information Management Systems Specialist', '{"Logistics Systems Specialist","IT Specialist","Supply Chain Analyst"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Technology","Logistics"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('93da4467-3eff-476d-9917-4310fa440add'::UUID, 'army', '13F', 'Joint Fire Support Specialist', '{"Operations Coordinator","Targeting Analyst","Communications Specialist"}'::TEXT[], '{"13-1081.00"}'::TEXT[], '{"Defense","Government"}'::TEXT[], '{"Target Acquisition","Communications","GPS/GIS","Operations Planning","Coordination"}'::TEXT[], 'Requests and adjusts indirect fires')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('93dc1816-63ee-47e8-98be-bdb36407f3e3'::UUID, 'army', '31B', 'Military Police', '{"Law Enforcement Officer","Security Manager","Corrections Officer","Loss Prevention Manager","Compliance Officer"}'::TEXT[], '{"33-3051.00","33-9032.00"}'::TEXT[], '{"Law Enforcement","Security","Government"}'::TEXT[], '{"Law Enforcement","Investigations","Physical Security","Access Control","Traffic Management","Force Protection"}'::TEXT[], 'Performs law enforcement and security operations')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('93e01ba0-cf6a-481a-bc81-f4aa2407f027'::UUID, 'usaf', '2A7X3', 'Aircraft Structural Maintenance', '{"Aircraft Structural Mechanic","Sheet Metal Mechanic","Composite Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('940fc9fa-e67a-4fc3-82b2-99c64f8c5f42'::UUID, 'usaf', '2A2X1', 'Avionics Systems - F-16, F-117, RQ-1, CV-22', '{"Avionics Technician","Aircraft Electronics Technician","Systems Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('9482c025-febe-4357-b5e8-618b52a9f956'::UUID, 'navy', 'ET', 'Electronics Technician', '{"Electronics Technician","Radar Technician","Communications Technician","Systems Technician","Field Service Engineer"}'::TEXT[], '{}'::TEXT[], '{"Telecommunications","Electronics","Defense","Manufacturing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('9508155d-9025-41ea-a509-f8a60db81653'::UUID, 'army', '12T', 'Technical Engineer', '{"Survey Technician","Civil Engineering Technician","CAD Technician","Drafting Technician"}'::TEXT[], '{}'::TEXT[], '{"Engineering","Construction","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('95556b0d-20ae-4194-b8fe-21ee9f58c6c7'::UUID, 'usmc', '2841', 'Ground Radio Repairer', '{"Radio Technician","Electronics Repair Technician"}'::TEXT[], '{}'::TEXT[], '{"Telecommunications","Electronics"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('9566d56b-8943-46ef-a79c-524be1a99811'::UUID, 'usaf', '6F0X1', 'Financial Management and Comptroller', '{"Financial Analyst","Accountant","Budget Analyst","Financial Manager"}'::TEXT[], '{}'::TEXT[], '{"Finance","Accounting","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('957de954-9b74-4e36-97d1-ce6337013fe4'::UUID, 'usmc', '2674', 'European Cryptologic Linguist', '{"Russian Linguist","Translator","Intelligence Analyst"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Government","Translation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('95df06df-a10e-49fd-b785-547560ae9faf'::UUID, 'ussf', '1N2X1', 'Signals Intelligence Analyst', '{"SIGINT Analyst","Signals Analyst","Communications Analyst","Electronic Intelligence Analyst"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Defense","Aerospace","Technology"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('9641d0af-c13b-41de-b58d-8d21f8c04aac'::UUID, 'army', '94A', 'Land Combat Electronic Missile System Repairer', '{"Electronics Technician","Missile Systems Technician","Avionics Technician"}'::TEXT[], '{}'::TEXT[], '{"Defense","Aerospace","Electronics"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('96689eeb-9402-40e6-adc4-b7faa0ec3a46'::UUID, 'navy', 'AW', 'Naval Aircrewman', '{"Flight Engineer","Airborne Sensor Operator","Helicopter Crew Chief","Search and Rescue Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Emergency Services","Law Enforcement","Oil & Gas"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('967880e5-3cf0-4ac9-879d-0eea8ee908cb'::UUID, 'navy', 'AB', 'Aviation Boatswain''s Mate', '{"Aircraft Marshaller","Ramp Agent","Aviation Ground Equipment Operator","Flight Line Technician","Airport Operations Specialist"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Transportation","Logistics"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('968dccc0-3e80-48da-8913-1bf1b687bc21'::UUID, 'usmc', '0671', 'Data Systems Administrator', '{"Database Administrator","Data Systems Specialist","Systems Administrator"}'::TEXT[], '{}'::TEXT[], '{"Technology","Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('96f32f5b-d00c-45cf-85e3-d995af65e5b0'::UUID, 'usmc', '3537', 'Motor Transport Operations Chief', '{"Transportation Manager","Fleet Manager","Logistics Manager"}'::TEXT[], '{}'::TEXT[], '{"Transportation","Logistics"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('977975e1-dd02-4fd7-bc57-51f2eb8d574e'::UUID, 'usaf', '3E3X1', 'Structural', '{"Carpenter","Construction Supervisor","Structural Technician","General Contractor"}'::TEXT[], '{}'::TEXT[], '{"Construction","Facilities"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('97b09445-64f4-4417-babe-02282c62f4e7'::UUID, 'usmc', '0161', 'Postal Clerk', '{"Postal Clerk","Mail Handler","Shipping Clerk"}'::TEXT[], '{}'::TEXT[], '{"Postal Service","Logistics","Corporate"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('97de99ea-3381-462f-9323-543c2334a357'::UUID, 'ussf', '2S0X1', 'Material Management', '{"Supply Chain Specialist","Inventory Manager","Materials Manager","Logistics Coordinator","Procurement Specialist"}'::TEXT[], '{}'::TEXT[], '{"Logistics","Aerospace","Manufacturing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('98fcf01e-a858-4ef5-8e2d-12870427f3e1'::UUID, 'usmc', '0211', 'Counterintelligence/HUMINT Specialist', '{"Intelligence Analyst","Counterintelligence Specialist","Investigator"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Security","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('993abc22-4dce-4b7c-8fc2-64abeb3a6f7d'::UUID, 'usaf', '1T0X1', 'Survival, Evasion, Resistance, Escape (SERE)', '{"Survival Instructor","Training Specialist","Outdoor Educator","Security Trainer"}'::TEXT[], '{}'::TEXT[], '{"Training","Security","Outdoor Education","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('99629c0f-5e86-4e4b-a461-b60704af4100'::UUID, 'usmc', '6173', 'Helicopter Crew Chief', '{"Helicopter Crew Chief","Flight Mechanic","Aircraft Mechanic"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Emergency Services","Oil & Gas"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('999bac88-50b8-496f-b767-ceab768c46b0'::UUID, 'usmc', '6672', 'Aviation Supply Clerk', '{"Supply Clerk","Aviation Supply Specialist","Inventory Specialist"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Logistics"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('99cc45ac-0c7f-45c0-b697-f36e5f0da521'::UUID, 'navy', 'EM', 'Electricians Mate', '{"Industrial Electrician","Power Plant Operator","Electrical Systems Technician","High Voltage Electrician","Power Distribution Engineer"}'::TEXT[], '{"47-2111.00","51-8013.00"}'::TEXT[], '{"Utilities","Manufacturing","Energy","Marine"}'::TEXT[], '{"Power Generation","High Voltage","Motor Controllers","Switchboards","Transformers","Troubleshooting"}'::TEXT[], 'Operates and maintains ships electrical power generation and distribution')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('9abcad7c-67ab-4e33-ac4d-7839ead508d8'::UUID, 'army', '13F', 'Fire Support Specialist', '{"Operations Coordinator","Logistics Coordinator","Communications Specialist","Tactical Planner"}'::TEXT[], '{}'::TEXT[], '{"Security","Logistics","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('9c3c847d-a9a0-4a17-aa03-c518f1d7d99a'::UUID, 'navy', 'STG', 'Sonar Technician (Surface)', '{"Sonar Technician","Acoustics Analyst","Anti-Submarine Warfare Specialist","Sensor Systems Technician"}'::TEXT[], '{"17-3023.00"}'::TEXT[], '{"Defense","Technology","Marine Science"}'::TEXT[], '{"Sonar Systems","Acoustic Analysis","ASW","Electronics Maintenance","Data Analysis","Tactical Operations"}'::TEXT[], 'Operates and maintains surface sonar and ASW systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('9c8827dc-19f9-4896-97ad-381946142fa4'::UUID, 'army', '15H', 'Aircraft Pneudraulics Repairer', '{"Hydraulics Technician","Aircraft Mechanic","Pneumatic Systems Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Manufacturing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('9c976278-a94a-4405-b856-6159668b4823'::UUID, 'ussf', '8B000', 'Military Training Instructor', '{"Training Instructor","Corporate Trainer","Leadership Trainer","Technical Trainer","Instructional Specialist"}'::TEXT[], '{}'::TEXT[], '{"Training","Education","Aerospace","Corporate"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('9cc78e66-fd07-43e1-b8e3-b727e6725aa9'::UUID, 'usmc', '6672', 'Aviation Supply Specialist', '{"Supply Chain Manager","Inventory Analyst","Procurement Specialist","Materials Manager","Logistics Analyst"}'::TEXT[], '{"13-1081.00","43-5071.00"}'::TEXT[], '{"Aviation","Logistics","Manufacturing","Defense"}'::TEXT[], '{"Aviation Supply","Inventory Management","NALCOMIS","Procurement","Hazmat Management","Warehouse Operations"}'::TEXT[], 'Manages aviation parts inventory and supply chain')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('9d874ff5-5f99-4abf-979d-e3f0a2f93871'::UUID, 'usmc', '0151', 'Administrative Clerk', '{"Administrative Clerk","Office Clerk","Records Clerk"}'::TEXT[], '{}'::TEXT[], '{"Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('9d9e48d1-812d-4c93-b68c-776bfc55959a'::UUID, 'army', '17E', 'Electronic Warfare Specialist', '{"Electronic Warfare Specialist","SIGINT Analyst","RF Engineer","Signals Analyst"}'::TEXT[], '{}'::TEXT[], '{"Defense","Aerospace","Technology"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('9dc29bb3-e2b8-43c9-818d-f6747d0c55d1'::UUID, 'army', '25M', 'Multimedia Illustrator', '{"Graphic Designer","Multimedia Artist","Visual Designer","Digital Artist"}'::TEXT[], '{}'::TEXT[], '{"Media","Marketing","Entertainment","Technology"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('9dea799c-f9bb-4a74-b677-4b3d770652b0'::UUID, 'usaf', '1B4X1', 'Cyber Warfare Operations', '{"Cybersecurity Analyst","Penetration Tester","SOC Analyst","Incident Response Analyst","Cyber Operations Specialist","Red Team Operator"}'::TEXT[], '{"15-1212.00","15-1299.00"}'::TEXT[], '{"Cybersecurity","Defense","Finance","Technology"}'::TEXT[], '{"Penetration Testing","Incident Response","Malware Analysis","Network Defense","SIEM","Vulnerability Assessment","Python","Linux"}'::TEXT[], 'Conducts offensive and defensive cyberspace operations')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('9e0ab1ad-c92c-43c7-9a0d-b199daba59d0'::UUID, 'usmc', '0311', 'Rifleman', '{"Security Specialist","Law Enforcement Officer","Security Consultant"}'::TEXT[], '{}'::TEXT[], '{"Security","Law Enforcement","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('9e9ccba7-eefd-4b0e-a27c-3e34c1fca98a'::UUID, 'usaf', '2A7X1', 'Aircraft Metals Technology', '{"Aircraft Welder","Sheet Metal Mechanic","Metal Fabricator","Aerospace Welder"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Manufacturing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('9eb00736-7e9a-4200-a57c-8feb5389cadc'::UUID, 'ussf', '5R0X1', 'Chaplain Assistant', '{"Religious Program Coordinator","Administrative Assistant","Community Outreach Coordinator","Chaplain Services Specialist"}'::TEXT[], '{}'::TEXT[], '{"Religious Organizations","Non-Profit","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('9f0352f7-bf14-49db-a4e0-f270fba180b4'::UUID, 'navy', 'OS', 'Operations Specialist', '{"Operations Coordinator","Dispatcher","Air Traffic Controller","Radar Operator","Operations Analyst"}'::TEXT[], '{}'::TEXT[], '{"Transportation","Logistics","Aviation","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('9f4da228-e08c-44a9-b1e7-5a5b94b43e6b'::UUID, 'navy', 'MC', 'Mass Communication Specialist', '{"Public Affairs Specialist","Journalist","Photographer","Videographer","Social Media Manager","Communications Specialist"}'::TEXT[], '{"27-3023.00","27-4021.00"}'::TEXT[], '{"Media","Marketing","Public Relations","Government"}'::TEXT[], '{"Journalism","Photography","Videography","Public Affairs","Social Media","Adobe Creative Suite","Press Relations"}'::TEXT[], 'Produces media content and manages public affairs')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('9f6bfc18-9149-4d79-bbb2-d92ba2e64ed4'::UUID, 'navy', 'AT', 'Aviation Electronics Technician', '{"Avionics Technician","Electronics Engineer","Radar Technician","Communications Technician","Field Service Engineer"}'::TEXT[], '{"49-2091.00","17-3023.00"}'::TEXT[], '{"Aviation","Defense","Telecommunications"}'::TEXT[], '{"Avionics","Radar","Communications","Electronics Repair","Calibration","Test Equipment"}'::TEXT[], 'Maintains aircraft electronic systems and avionics')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a064dbee-8f67-46e4-9ec6-587fa9cc46a4'::UUID, 'army', '15B', 'Aircraft Powerplant Repairer', '{"Aircraft Mechanic","Powerplant Mechanic","Jet Engine Mechanic","A&P Mechanic"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a0836366-a902-49e2-830f-815aad485edc'::UUID, 'navy', 'PS', 'Personnel Specialist', '{"HR Specialist","Personnel Administrator","Payroll Specialist","Benefits Administrator","HRIS Analyst"}'::TEXT[], '{}'::TEXT[], '{"Human Resources","Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a0b36575-e335-406b-af38-e41043fc4102'::UUID, 'navy', 'CS', 'Culinary Specialist', '{"Chef","Kitchen Manager","Food Service Director","Catering Manager","Executive Chef"}'::TEXT[], '{}'::TEXT[], '{"Food Service","Hospitality","Healthcare","Education","Corporate"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a1665c03-4e46-4780-8af5-1eff86198fd6'::UUID, 'usmc', '6092', 'Aircraft Intermediate Level Avionics Technician', '{"Avionics Technician","Aircraft Electronics Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a1b5c9a8-c520-43a0-8c9a-022ea7b0d02c'::UUID, 'usaf', '4A0X1', 'Health Services Management', '{"Healthcare Administrator","Medical Office Manager","Health Information Manager","Practice Manager"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Hospitals","Medical Offices"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a299c904-15b9-45e1-b622-507e74c8436d'::UUID, 'uscg', 'MK', 'Machinery Technician', '{"Marine Mechanic","Diesel Technician","Facilities Engineer","HVAC Technician","Power Plant Operator"}'::TEXT[], '{"49-3042.00","49-9041.00"}'::TEXT[], '{"Marine","Utilities","Manufacturing"}'::TEXT[], '{"Diesel Engines","HVAC","Electrical","Damage Control","Welding","Firefighting Systems"}'::TEXT[], 'Operates and maintains vessel propulsion and auxiliary systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a2d345ed-a156-4c74-826c-dd5922ccae87'::UUID, 'army', '37F', 'Psychological Operations Specialist', '{"Marketing Specialist","Public Relations Specialist","Communications Specialist","Media Analyst"}'::TEXT[], '{}'::TEXT[], '{"Marketing","Public Relations","Media","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a42eb57e-2e5d-4b4f-a7f9-479bfeca0cfd'::UUID, 'army', '92R', 'Parachute Rigger', '{"Parachute Rigger","Aerial Delivery Specialist","Skydiving Equipment Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Skydiving","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a454cbbe-a5a5-481c-a2a8-09b9bfceeeb9'::UUID, 'army', '15E', 'Unmanned Aircraft Systems Repairer', '{"Drone Technician","UAV Mechanic","Avionics Technician","UAS Maintenance Specialist"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Technology","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a4b8f3d4-61cc-4cb9-9a27-088dafa9854c'::UUID, 'army', '15T', 'UH-60 Helicopter Repairer', '{"Aircraft Mechanic","Helicopter Maintenance Technician","A&P Mechanic","Aviation Maintenance Manager"}'::TEXT[], '{"49-3011.00"}'::TEXT[], '{"Aviation","Aerospace","Defense"}'::TEXT[], '{"Helicopter Maintenance","Rotor Systems","Hydraulics","Avionics","FAA A&P","Safety Compliance"}'::TEXT[], 'Performs maintenance on UH-60 Black Hawk helicopters')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a4cba784-10e0-49b5-a985-223239217c56'::UUID, 'navy', 'AO', 'Aviation Ordnanceman', '{"Ordnance Technician","Weapons Specialist","Munitions Handler","Quality Assurance Inspector"}'::TEXT[], '{"19-4099.00"}'::TEXT[], '{"Defense","Security","Manufacturing"}'::TEXT[], '{"Ordnance Handling","Weapons Systems","Safety Compliance","Inventory Management","Quality Control"}'::TEXT[], 'Handles and maintains aircraft weapons and ammunition')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a5481b71-068e-4ea3-9f5a-fa666a033dcb'::UUID, 'army', '35T', 'Military Intelligence Systems Maintainer/Integrator', '{"Systems Administrator","IT Specialist","Network Engineer","Systems Integrator"}'::TEXT[], '{}'::TEXT[], '{"Technology","Defense","Intelligence"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a56ef670-1c08-4673-9b6e-cb9fe638e827'::UUID, 'uscg', 'BM', 'Boatswains Mate', '{"Marine Operations Supervisor","Port Operations Manager","Maritime Safety Inspector","Deck Operations Manager"}'::TEXT[], '{"53-5021.00"}'::TEXT[], '{"Maritime","Transportation","Government"}'::TEXT[], '{"Maritime Operations","Navigation","Search and Rescue","Law Enforcement","Deck Operations","Small Boat Operations"}'::TEXT[], 'Supervises deck operations, boat handling, and maritime law enforcement')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a5aa3cfd-4481-4871-95f4-70f33b5307fb'::UUID, 'usaf', '3D0X3', 'Cyber Surety', '{"Information Security Analyst","Security Administrator","Compliance Analyst","IT Auditor"}'::TEXT[], '{}'::TEXT[], '{"Technology","Finance","Government","Consulting"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a5e06cc5-8d81-4b85-8bd9-6b909eb6edbc'::UUID, 'army', '25S', 'Satellite Communication Systems Operator-Maintainer', '{"Satellite Technician","SATCOM Technician","Communications Technician","RF Engineer"}'::TEXT[], '{}'::TEXT[], '{"Telecommunications","Aerospace","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a6e00768-dae9-4377-afd9-72a4e6dd1f75'::UUID, 'usmc', '3432', 'Finance Technician', '{"Payroll Technician","Accounting Clerk","Bookkeeper"}'::TEXT[], '{}'::TEXT[], '{"Finance","Accounting","Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a7087808-6df2-47e7-93c8-29919fce9269'::UUID, 'army', '68J', 'Medical Logistics Specialist', '{"Medical Supply Technician","Healthcare Logistics Coordinator","Medical Inventory Specialist"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Medical Supply","Hospitals"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a73016f7-41b2-472b-9ff8-3685f6f3db72'::UUID, 'usmc', '0352', 'Anti-Tank Missile Gunner', '{"Weapons Specialist","Security Specialist","Training Instructor"}'::TEXT[], '{}'::TEXT[], '{"Defense","Security"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a77172e4-3412-4031-8eb5-b3b425eb6623'::UUID, 'ussf', '1N0X1', 'All Source Intelligence Analyst', '{"Intelligence Analyst","All-Source Analyst","Threat Analyst","Research Analyst","Defense Intelligence Analyst"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Defense","Aerospace","Consulting"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a8296667-d576-4f05-a5ad-909fe85bdac2'::UUID, 'usaf', '1A9X1', 'Special Missions Aviation', '{"Flight Crew","Aviation Specialist","Special Operations Aviation"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Defense","Security"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a89bb7d0-7ce0-484f-a2e4-ba283c02b048'::UUID, 'army', '91B', 'Wheeled Vehicle Mechanic', '{"Automotive Technician","Fleet Mechanic","Diesel Mechanic","Mobile Equipment Mechanic"}'::TEXT[], '{"49-3023.00","49-3042.00"}'::TEXT[], '{"Transportation","Automotive","Logistics"}'::TEXT[], '{"Diesel Repair","Brake Systems","Electrical Systems","Preventive Maintenance","Diagnostics","Welding"}'::TEXT[], 'Maintains wheeled vehicles and associated equipment')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a8a86178-f65d-4795-ae20-a100b6b1df68'::UUID, 'army', '35L', 'Counterintelligence Agent', '{"Counterintelligence Analyst","Investigator","Security Specialist","CI Analyst","Insider Threat Analyst"}'::TEXT[], '{"33-3021.00","13-1161.00"}'::TEXT[], '{"Intelligence","Government","Defense","Corporate Security"}'::TEXT[], '{"Counterintelligence","Investigations","Threat Assessment","HUMINT","Insider Threat","Report Writing"}'::TEXT[], 'Conducts counterintelligence operations and investigations')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a90ad0b6-1501-4b07-a61b-8cde9ec670d4'::UUID, 'army', '25R', 'Visual Information Equipment Operator-Maintainer', '{"Audio Visual Technician","Video Equipment Operator","Broadcast Technician"}'::TEXT[], '{}'::TEXT[], '{"Media","Entertainment","Corporate Events"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a9284a8b-c2fc-475e-b536-35004b7500a6'::UUID, 'ussf', '3E0X2', 'Electrical Power Production', '{"Power Plant Operator","Electrical Power Specialist","Generator Technician","Utilities Technician"}'::TEXT[], '{}'::TEXT[], '{"Utilities","Energy","Aerospace","Facilities"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a9332394-69c4-49d1-8796-06fc9dd69c95'::UUID, 'usmc', '1142', 'Electrical Equipment Repair Specialist', '{"Electronics Technician","Electrical Repair Technician"}'::TEXT[], '{}'::TEXT[], '{"Electronics","Manufacturing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('a978c0a6-4500-4e90-95d3-bca0c3e107ec'::UUID, 'navy', 'CTR', 'Cryptologic Technician (Collection)', '{"SIGINT Analyst","Intelligence Analyst","Signals Analyst","Electronic Warfare Specialist"}'::TEXT[], '{"13-1161.00"}'::TEXT[], '{"Intelligence","Defense","Government"}'::TEXT[], '{"SIGINT","Electronic Warfare","Intelligence Collection","Signal Analysis","Report Writing"}'::TEXT[], 'Collects and analyzes signals intelligence')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('aa2d27a2-064a-4445-a253-00072d070d89'::UUID, 'usmc', '2631', 'Electronic Intelligence Intercept Operator', '{"ELINT Analyst","Electronic Warfare Analyst"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('ac0a69de-9b3d-4ee5-8817-f7986722ab34'::UUID, 'army', '12N', 'Horizontal Construction Engineer', '{"Heavy Equipment Operator","Grader Operator","Road Construction Supervisor","Paving Supervisor"}'::TEXT[], '{}'::TEXT[], '{"Construction","Government","Transportation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('ac277611-5f91-47e6-bd37-3b5e43ae12d3'::UUID, 'usaf', '3M0X1', 'Services', '{"Food Service Manager","Lodging Manager","Fitness Director","Recreation Manager"}'::TEXT[], '{}'::TEXT[], '{"Hospitality","Food Service","Recreation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('ac6c477d-53e3-4fda-a498-6b67a8949791'::UUID, 'usaf', '3D0X4', 'Computer Systems Programming', '{"Software Developer","Programmer","Application Developer","Software Engineer"}'::TEXT[], '{}'::TEXT[], '{"Technology","Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('ac89d9e6-c8c3-4c9c-8a84-e33ca900c493'::UUID, 'army', '31E', 'Internment/Resettlement Specialist', '{"Corrections Officer","Detention Officer","Case Manager","Social Worker"}'::TEXT[], '{}'::TEXT[], '{"Corrections","Government","Social Services"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('ad0f2aa4-3f71-4303-b42f-8d6ea23cb3ba'::UUID, 'navy', 'SB', 'Special Warfare Boat Operator', '{"Maritime Security Specialist","Boat Captain","Security Contractor","Law Enforcement Marine Unit"}'::TEXT[], '{}'::TEXT[], '{"Security","Law Enforcement","Maritime","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('ad238349-7fb4-404f-8cfc-d42093e3fcd8'::UUID, 'usaf', '2A6X1', 'Aerospace Propulsion', '{"Jet Engine Mechanic","Powerplant Technician","Propulsion Mechanic","A&P Mechanic"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Manufacturing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('adb28336-67e2-494c-83dc-e60fe399b63a'::UUID, 'uscg', 'ENGR', 'Engineering', '{"Engineering Manager","Marine Engineer","Operations Manager","Facilities Director"}'::TEXT[], '{}'::TEXT[], '{"Maritime","Engineering","Manufacturing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('add440d9-13ce-4d1d-9dac-45819836d306'::UUID, 'army', '14T', 'Patriot Launching Station Operator', '{"Missile Technician","Weapons Systems Operator","Heavy Equipment Operator"}'::TEXT[], '{}'::TEXT[], '{"Defense","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('ae4cf78f-c646-4087-8e85-905cc4d7831c'::UUID, 'navy', 'HT', 'Hull Maintenance Technician', '{"Welder","Pipe Fitter","Plumber","Sheet Metal Worker","Marine Fabrication Specialist","Facilities Maintenance Technician"}'::TEXT[], '{"47-2152.00","47-2211.00","47-2151.00"}'::TEXT[], '{"Construction","Manufacturing","Marine","Facilities"}'::TEXT[], '{"Welding","Pipe Fitting","Plumbing","Sheet Metal","Brazing","Valve Repair","Blueprint Reading"}'::TEXT[], 'Performs welding, pipe fitting, plumbing, and structural repairs')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('aebb6e0b-ff62-4666-8796-ad8133a5ed6e'::UUID, 'uscg', 'INTEL', 'Intelligence', '{"Intelligence Manager","Security Director","Chief Security Officer","Risk Manager"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Security","Government","Finance"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('aeca2083-2ee8-429a-81c2-909bca39d63c'::UUID, 'usaf', '8P000', 'Courier', '{"Courier","Security Courier","Document Control Specialist"}'::TEXT[], '{}'::TEXT[], '{"Security","Government","Logistics"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('aee379c2-9ba9-4feb-9fd0-5226cdc8668f'::UUID, 'ussf', '1B4X1', 'Cyber Warfare Operations', '{"Cybersecurity Specialist","Cyber Operations Specialist","Penetration Tester","Red Team Operator","Offensive Security Analyst"}'::TEXT[], '{}'::TEXT[], '{"Cybersecurity","Defense","Aerospace","Technology"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('af8b9288-a7aa-4782-a6b6-134576515d3b'::UUID, 'uscg', 'EM', 'Electrician''s Mate', '{"Industrial Electrician","Power Plant Operator","Marine Electrician","Electrical Technician","Maintenance Electrician"}'::TEXT[], '{}'::TEXT[], '{"Utilities","Manufacturing","Maritime","Facilities"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('afb4643c-620a-419e-bf63-5cb55377d399'::UUID, 'navy', 'HM', 'Hospital Corpsman', '{"Medical Assistant","Emergency Medical Technician","Paramedic","Licensed Practical Nurse","Health Services Administrator","Clinical Coordinator","Medical Office Manager"}'::TEXT[], '{"29-2041.00","29-2042.00","31-1014.00"}'::TEXT[], '{"Healthcare","Emergency Services","Government","Pharmaceutical"}'::TEXT[], '{"Patient Care","Emergency Medicine","Triage","Medical Records","HIPAA Compliance","Pharmacology","Vital Signs","CPR/BLS/ACLS"}'::TEXT[], 'Provides medical care and maintains health records')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('afb9acc8-ba9d-431d-9f4d-a050519d5348'::UUID, 'usaf', '2F0X1', 'Fuels', '{"Fuel Distribution Specialist","Petroleum Technician","Fuel Handler","Terminal Operator"}'::TEXT[], '{}'::TEXT[], '{"Oil & Gas","Aviation","Transportation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('afcdfe51-0480-4d26-91a4-439d36a74936'::UUID, 'usmc', '0311', 'Rifleman', '{"Security Manager","Operations Manager","Team Leader","Project Coordinator","Training Manager"}'::TEXT[], '{"33-9032.00","11-1021.00"}'::TEXT[], '{"Security","Management","Government","Defense"}'::TEXT[], '{"Team Leadership","Operations Planning","Risk Management","Training","Communication","Adaptability"}'::TEXT[], 'Ground combat infantry Marine')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('afec9fa6-ed27-4132-8c9a-fab00762ecd9'::UUID, 'uscg', 'HS', 'Health Services Technician', '{"EMT","Paramedic","Medical Assistant","LPN/LVN","Healthcare Technician","Medical Technician"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Emergency Services","Hospitals"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('b05c9ad3-9237-4a18-b90a-69c50a47bf96'::UUID, 'usaf', '4N1X1', 'Surgical Service', '{"Surgical Technologist","Operating Room Technician","Scrub Tech"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Hospitals","Surgery Centers"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('b0ae8e87-897c-41d6-9ca9-33126b8b6e8c'::UUID, 'army', '89D', 'Explosive Ordnance Disposal Specialist', '{"EOD Technician","Bomb Technician","Explosive Safety Specialist","Security Consultant"}'::TEXT[], '{}'::TEXT[], '{"Law Enforcement","Security","Defense","Mining"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('b0d37f74-f135-4b75-9653-2cc2d2f49903'::UUID, 'navy', 'EM', 'Electrician''s Mate', '{"Industrial Electrician","Power Plant Operator","Electrical Technician","Maintenance Electrician","Electrical Supervisor"}'::TEXT[], '{}'::TEXT[], '{"Utilities","Manufacturing","Energy","Maritime"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('b107e3a0-d0d9-417e-b602-2e85e5965a61'::UUID, 'usaf', '3P0X1', 'Security Forces', '{"Security Officer","Police Officer","Security Manager","Loss Prevention Specialist","Federal Agent"}'::TEXT[], '{}'::TEXT[], '{"Security","Law Enforcement","Government","Corporate Security"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('b164b955-57f9-4f87-875e-b09717d81ed1'::UUID, 'usmc', '2651', 'Special Intelligence System Administrator', '{"Systems Administrator","Security Administrator","Network Administrator"}'::TEXT[], '{}'::TEXT[], '{"Technology","Intelligence","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('b18dbb09-6332-4f3f-b16a-50d9c60325c5'::UUID, 'army', '15T', 'UH-60 Helicopter Repairer', '{"Helicopter Mechanic","Aircraft Mechanic","Rotor Wing Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Emergency Services"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('b1f8f835-46c0-46d2-a348-5f80a17a6e9d'::UUID, 'navy', 'EO', 'Equipment Operator', '{"Heavy Equipment Operator","Bulldozer Operator","Crane Operator","Excavator Operator","Construction Equipment Operator"}'::TEXT[], '{}'::TEXT[], '{"Construction","Mining","Government","Utilities"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('b310ecb8-a20e-4a53-af18-cb5657576677'::UUID, 'ussf', 'SF-GSE', 'Ground Systems Engineer', '{"Ground Systems Engineer","Satellite Ground Station Technician","SATCOM Engineer"}'::TEXT[], '{}'::TEXT[], '{"Defense Contractors","Telecommunications","Space Companies"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('b38f3a07-61e7-49db-b3e7-93af4d30077c'::UUID, 'uscg', 'AERO', 'Aerographer', '{"Meteorologist","Weather Forecaster","Environmental Scientist","Climate Analyst"}'::TEXT[], '{}'::TEXT[], '{"Weather Services","Aviation","Government","Energy"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('b4901bee-c198-49b5-905f-c9bfc3d513cb'::UUID, 'army', '68C', 'Practical Nursing Specialist', '{"Licensed Practical Nurse (LPN)","Licensed Vocational Nurse (LVN)","Patient Care Technician"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Hospitals","Long-Term Care"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('b4ba3a76-e1c0-403b-b229-050109fed34a'::UUID, 'navy', 'AO', 'Aviation Ordnanceman', '{"Weapons Specialist","Ordnance Handler","Ammunition Technician","Security Specialist","Explosives Worker"}'::TEXT[], '{}'::TEXT[], '{"Defense","Security","Law Enforcement","Mining"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('b5417f9d-8cb1-4396-ac94-5c116ca826cf'::UUID, 'army', '12P', 'Prime Power Production Specialist', '{"Power Plant Operator","Electrical Power Generator","Utilities Technician","Power Generation Specialist"}'::TEXT[], '{}'::TEXT[], '{"Utilities","Energy","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('b55ab6b4-f087-43cb-a572-4c83d86e3ab2'::UUID, 'army', '12K', 'Plumber', '{"Plumber","Pipefitter","Plumbing Supervisor","Maintenance Plumber"}'::TEXT[], '{}'::TEXT[], '{"Construction","Facilities","Utilities"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('b60b556b-d7f2-40db-9265-5a7502988340'::UUID, 'navy', 'AT', 'Aviation Electronics Technician', '{"Avionics Technician","Electronics Technician","Radar Technician","Communications Equipment Technician","Systems Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Electronics","Telecommunications","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('b684c707-2586-478f-ac1f-7c5484c73fdd'::UUID, 'army', '94R', 'Avionic and Survivability Equipment Repairer', '{"Avionics Technician","Aircraft Electronics Technician","Survival Equipment Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('b6c565a7-e6c6-4a6a-a00d-1e24431c89be'::UUID, 'usmc', '0341', 'Mortarman', '{"Operations Coordinator","Weapons System Specialist","Training Manager","Team Supervisor"}'::TEXT[], '{"11-1021.00"}'::TEXT[], '{"Defense","Management","Security"}'::TEXT[], '{"Indirect Fire","Operations Planning","Team Leadership","Training","Communication"}'::TEXT[], 'Employs mortar weapons systems in support of infantry operations')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('b6cfb057-06c7-40d5-a5cb-3ed455863ec1'::UUID, 'army', '31D', 'Criminal Investigation Special Agent', '{"Criminal Investigator","Detective","Special Agent","Fraud Investigator","Private Investigator"}'::TEXT[], '{}'::TEXT[], '{"Law Enforcement","Government","Corporate Security","Insurance"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('b6dd6d35-9d75-4371-a475-fd242cfcd9ee'::UUID, 'usmc', '0131', 'Logistics/Embarkation Specialist', '{"Logistics Coordinator","Shipping Coordinator","Supply Chain Specialist"}'::TEXT[], '{}'::TEXT[], '{"Logistics","Transportation","Shipping"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('b810eb51-e352-432f-9f92-61bd8607d3a7'::UUID, 'navy', 'STS', 'Sonar Technician (Submarine)', '{"Sonar Analyst","Acoustics Engineer","Signal Processing Analyst","Sensor Systems Specialist"}'::TEXT[], '{"17-3023.00"}'::TEXT[], '{"Defense","Technology"}'::TEXT[], '{"Submarine Sonar","Signal Processing","Acoustic Analysis","Electronics","Classified Systems"}'::TEXT[], 'Operates and maintains submarine sonar systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('b82101bc-1bb3-4ee3-9ac2-e46728c742d0'::UUID, 'navy', 'MM', 'Machinist''s Mate', '{"Marine Mechanic","Industrial Mechanic","Machinist","Power Plant Operator","Maintenance Mechanic"}'::TEXT[], '{}'::TEXT[], '{"Manufacturing","Maritime","Energy","Oil & Gas"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('b86fc69c-0a68-4321-bde9-8fdc6efbd826'::UUID, 'army', '91D', 'Tactical Power Generation Specialist', '{"Generator Technician","Power Generation Specialist","Electrical Technician"}'::TEXT[], '{}'::TEXT[], '{"Utilities","Energy","Facilities"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('b94ba6fc-6878-4a74-92b6-67240b4e76fe'::UUID, 'army', '18D', 'Special Forces Medical Sergeant', '{"Paramedic","Physician Assistant","Emergency Medical Technician","Medical Trainer"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Emergency Services","Training"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('b9eaa872-d61d-4bdd-a7bb-560bef5a8c1a'::UUID, 'army', '68R', 'Veterinary Food Inspection Specialist', '{"Food Inspector","Quality Assurance Specialist","Food Safety Inspector","Veterinary Technician"}'::TEXT[], '{}'::TEXT[], '{"Food Safety","Agriculture","Government","Veterinary"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('bab1ef3f-6a22-4d1c-9759-ddc975f1fc40'::UUID, 'navy', 'RP', 'Religious Program Specialist', '{"Program Coordinator","Administrative Manager","Community Outreach Coordinator","Human Services Specialist"}'::TEXT[], '{"21-1099.00","43-6014.00"}'::TEXT[], '{"Nonprofit","Human Services","Government"}'::TEXT[], '{"Program Management","Event Coordination","Counseling Support","Budget Management","Community Relations"}'::TEXT[], 'Supports religious ministry programs and humanitarian operations')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('bbc84a6c-a47b-4517-a939-ae4e42d8f0b7'::UUID, 'usmc', '8421', 'Drill Instructor', '{"Training Instructor","Corporate Trainer","Leadership Trainer"}'::TEXT[], '{}'::TEXT[], '{"Training","Education","Fitness"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('bc9ee337-f952-4745-b4e2-f17668e0af40'::UUID, 'usaf', '3F2X1', 'Education and Training', '{"Training Specialist","Instructional Designer","Corporate Trainer","Education Coordinator"}'::TEXT[], '{}'::TEXT[], '{"Training","Education","Corporate"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('bcc1a43d-ade4-4289-8d74-21bf77121ec3'::UUID, 'usaf', '3F3X1', 'Manpower', '{"Workforce Analyst","Manpower Planner","HR Analyst","Compensation Analyst"}'::TEXT[], '{}'::TEXT[], '{"Human Resources","Consulting","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('bd5e29fb-c634-472c-aa52-33f7d4d213c8'::UUID, 'uscg', 'MST', 'Marine Science Technician', '{"Environmental Scientist","Marine Inspector","Environmental Health Specialist","Safety Inspector","Pollution Response Specialist"}'::TEXT[], '{}'::TEXT[], '{"Environmental","Government","Maritime","Oil & Gas"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('bd7e3d0a-3b35-43ee-811a-0fb340eee606'::UUID, 'usmc', '1812', 'Tank Crewman', '{"Heavy Equipment Operator","Security Specialist"}'::TEXT[], '{}'::TEXT[], '{"Security","Construction","Mining"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('be0623ae-807e-49cf-9e46-dfcc338494cc'::UUID, 'ussf', '8R000', 'Recruiter', '{"Recruiter","Talent Acquisition Specialist","HR Recruiter","Staffing Specialist","Technical Recruiter"}'::TEXT[], '{}'::TEXT[], '{"Human Resources","Staffing","Aerospace","Technology"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('be25ed0e-4dd8-48a2-91de-9a893f57fa83'::UUID, 'navy', 'MT', 'Missile Technician', '{"Missile Systems Technician","Strategic Weapons Specialist","Weapons Systems Engineer","Electronics Technician"}'::TEXT[], '{"17-2199.00"}'::TEXT[], '{"Defense","Aerospace"}'::TEXT[], '{"Strategic Weapons","Missile Systems","Nuclear Weapons","Fire Control","Electronics","Quality Assurance"}'::TEXT[], 'Maintains and operates strategic missile weapon systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('becf24f3-c03d-4291-a618-97e1db57c36b'::UUID, 'usmc', '2621', 'Special Communications Signals Collection Operator', '{"SIGINT Analyst","Communications Analyst","Intelligence Analyst"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('bef14cf9-39cd-4e54-84de-5d5c9eebd8a4'::UUID, 'usaf', '4A1X1', 'Medical Materiel', '{"Medical Supply Technician","Healthcare Logistics Coordinator","Medical Inventory Manager"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Medical Supply"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('bf43a7fe-1102-42fe-ba23-3c95ff896c8e'::UUID, 'navy', 'DC', 'Damage Controlman', '{"Fire Protection Engineer","Safety Manager","Emergency Management Specialist","Environmental Health & Safety Manager","Facilities Manager","Risk Management Specialist","Fire Marshal","Loss Prevention Manager"}'::TEXT[], '{"33-2021.00","11-9199.00","13-1199.00"}'::TEXT[], '{"Defense","Manufacturing","Construction","Oil & Gas","Municipal Government","Insurance"}'::TEXT[], '{"Emergency Response","Fire Suppression","HAZMAT","CBRN","Safety Compliance","Risk Assessment","Damage Assessment","Welding","Pipe Fitting","OSHA Compliance"}'::TEXT[], 'Responsible for shipboard firefighting, damage control, CBRN defense, and emergency response')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('bf83fd69-2495-42ae-bc92-62d91fc1f13c'::UUID, 'army', '25C', 'Radio Operator-Maintainer', '{"Radio Technician","Communications Technician","Broadcast Technician","RF Technician"}'::TEXT[], '{}'::TEXT[], '{"Telecommunications","Broadcasting","Technology"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('bf9c4401-ff60-415d-8f9a-f2417f1ca423'::UUID, 'usaf', '1P0X1', 'Aircrew Flight Equipment', '{"Life Support Technician","Flight Equipment Specialist","Safety Equipment Technician","Parachute Rigger"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('c0325d2b-577a-4018-8150-a6f2aa6a26fd'::UUID, 'usmc', '1161', 'Refrigeration and Air Conditioning Technician', '{"HVAC Technician","Refrigeration Technician","HVAC Mechanic"}'::TEXT[], '{}'::TEXT[], '{"HVAC","Facilities","Construction"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('c04bf1c2-50c4-4a06-85be-55e530152f75'::UUID, 'army', '25B', 'Information Technology Specialist', '{"IT Support Specialist","Network Administrator","Systems Administrator","Help Desk Technician","Desktop Support Engineer"}'::TEXT[], '{"15-1231.00","15-1232.00","15-1244.00"}'::TEXT[], '{"Technology","Government","Defense","Finance"}'::TEXT[], '{"Network Administration","Windows Server","Active Directory","TCP/IP","Troubleshooting","Help Desk","SCCM"}'::TEXT[], 'Installs, operates, and maintains IT systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('c14505c2-61ef-4b32-8e9e-fba8ec65ffd9'::UUID, 'navy', 'GSE', 'Gas Turbine Systems Technician (Electrical)', '{"Gas Turbine Technician","Power Plant Electrician","Control Systems Technician","Industrial Controls Technician"}'::TEXT[], '{"51-8013.00","49-2094.00"}'::TEXT[], '{"Energy","Manufacturing","Marine"}'::TEXT[], '{"Gas Turbine Engines","Control Systems","PLCs","Electrical Troubleshooting","Power Generation"}'::TEXT[], 'Maintains electrical components of gas turbine propulsion systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('c1b8fdc3-d89c-4cf9-a1a0-2037f90817ed'::UUID, 'navy', 'MR', 'Machinery Repairman', '{"CNC Machinist","Tool and Die Maker","Precision Machinist","Manufacturing Technician"}'::TEXT[], '{"51-4041.00","51-4111.00"}'::TEXT[], '{"Manufacturing","Aerospace","Defense"}'::TEXT[], '{"CNC Programming","Precision Machining","Lathe","Mill","Welding","Blueprint Reading","GD&T"}'::TEXT[], 'Operates machine tools to fabricate and repair metal parts')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('c24efe88-d3b9-4864-8e8c-c5d747120763'::UUID, 'navy', 'IC', 'Interior Communications Electrician', '{"Telecommunications Technician","Low Voltage Technician","Fire Alarm Technician","Building Automation Technician","AV Technician"}'::TEXT[], '{"49-2022.00","27-4011.00"}'::TEXT[], '{"Telecommunications","Construction","Facilities"}'::TEXT[], '{"Telecommunications","Fire Alarm Systems","PA Systems","CCTV","Fiber Optics","Building Automation"}'::TEXT[], 'Maintains interior communications, fire alarm, and announcing systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('c36e7c87-9eea-4ebf-83b6-fcb2cc576bb8'::UUID, 'ussf', '3F0X1', 'Personnel', '{"HR Specialist","Personnel Specialist","HR Generalist","Benefits Administrator","Talent Acquisition Specialist"}'::TEXT[], '{}'::TEXT[], '{"Human Resources","Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('c4577916-02c4-4839-bbd2-5000c08a235f'::UUID, 'usmc', '6276', 'Fixed-Wing Aircraft Crew Chief', '{"Crew Chief","Line Mechanic","Lead Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('c4814b7c-4152-4aed-9449-15137bfd5626'::UUID, 'army', '94F', 'Computer/Detection Systems Repairer', '{"Computer Technician","Electronics Technician","Radar Technician","IT Technician"}'::TEXT[], '{}'::TEXT[], '{"Technology","Electronics","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('c49d7b03-5f69-449c-ab1a-cffe6391cecc'::UUID, 'navy', 'GSM', 'Gas Turbine Systems Technician (Mechanical)', '{"Gas Turbine Mechanic","Power Plant Mechanic","Turbine Maintenance Technician","Marine Propulsion Technician"}'::TEXT[], '{"49-9041.00","51-8013.00"}'::TEXT[], '{"Energy","Marine","Manufacturing"}'::TEXT[], '{"Gas Turbines","Propulsion Systems","Mechanical Maintenance","Fluid Systems","Auxiliary Machinery"}'::TEXT[], 'Maintains mechanical components of gas turbine propulsion systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('c4c56942-05c7-48b3-b0ce-f5cc0b4f27da'::UUID, 'usmc', '0351', 'Infantry Assault Marine', '{"Security Specialist","Demolition Specialist"}'::TEXT[], '{}'::TEXT[], '{"Security","Construction","Mining"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('c4e75a4d-f5aa-4200-aadb-1c239397e539'::UUID, 'uscg', 'IS', 'Intelligence Specialist', '{"Intelligence Analyst","Research Analyst","Threat Analyst","Security Analyst","Criminal Analyst"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Law Enforcement","Security","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('c54f49d6-72c0-4cad-8bc3-6798a59b9357'::UUID, 'army', '17C', 'Cyber Operations Specialist', '{"Cybersecurity Analyst","Penetration Tester","Security Engineer","SOC Analyst","Cyber Operations Specialist"}'::TEXT[], '{}'::TEXT[], '{"Technology","Defense","Finance","Government","Consulting"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('c5528706-5bc5-41e5-9d39-bfbac811963a'::UUID, 'navy', 'BM', 'Boatswain''s Mate', '{"Deck Officer","Boat Captain","Marina Manager","Rigging Supervisor","Cargo Operations Manager"}'::TEXT[], '{}'::TEXT[], '{"Maritime","Shipping","Logistics","Oil & Gas","Construction"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('c5a74587-e261-4f72-8faa-4206ab135b03'::UUID, 'army', '88H', 'Cargo Specialist', '{"Cargo Handler","Freight Coordinator","Shipping/Receiving Clerk","Logistics Coordinator"}'::TEXT[], '{}'::TEXT[], '{"Logistics","Shipping","Transportation","Warehousing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('c630fe22-4294-4837-a726-c456fdbbf149'::UUID, 'army', '68K', 'Medical Laboratory Specialist', '{"Medical Laboratory Technician","Clinical Laboratory Technician","Lab Technician","Phlebotomist"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Laboratories","Hospitals"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('c6d95068-7ce8-42ed-9f64-ce1efa075471'::UUID, 'usaf', '3E0X1', 'Electrical Systems', '{"Electrician","Electrical Technician","Power Systems Technician","Facilities Electrician"}'::TEXT[], '{}'::TEXT[], '{"Construction","Utilities","Facilities"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('c7070818-f6b5-47c0-9bfd-c71e32a64b65'::UUID, 'ussf', 'SF-CYBER', 'Space Cybersecurity', '{"Space Systems Cybersecurity Engineer","Satellite Security Analyst","Space Cyber Operations Specialist"}'::TEXT[], '{}'::TEXT[], '{"Defense","Aerospace","Telecommunications"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('c7a38bb5-eb31-422d-a149-c1536ba7f29f'::UUID, 'uscg', 'MST', 'Marine Science Technician', '{"Environmental Scientist","Environmental Compliance Inspector","Marine Safety Inspector","HAZMAT Specialist"}'::TEXT[], '{"19-2041.00","19-4099.00"}'::TEXT[], '{"Environmental","Government","Energy","Marine"}'::TEXT[], '{"Environmental Compliance","Marine Safety","Pollution Response","HAZMAT","Inspection","EPA Regulations"}'::TEXT[], 'Conducts marine safety, environmental protection, and port security')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('c7f089b6-fae2-439b-b5f7-a11f6b8095e9'::UUID, 'navy', 'ABE', 'Aviation Boatswains Mate (Equipment)', '{"Aviation Ground Support Manager","Airport Operations Specialist","Heavy Equipment Operator","Catapult Systems Technician"}'::TEXT[], '{"53-7011.00"}'::TEXT[], '{"Aviation","Defense","Transportation"}'::TEXT[], '{"Aircraft Launch Systems","Hydraulics","Heavy Equipment","Safety Procedures","Maintenance"}'::TEXT[], 'Operates and maintains aircraft launching and recovery equipment')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('c89c024d-97f6-4fa6-bd64-67d1c6bc54cd'::UUID, 'usmc', '6541', 'Aviation Ordnance Systems Technician', '{"Weapons Systems Technician","Ordnance Systems Specialist"}'::TEXT[], '{}'::TEXT[], '{"Defense","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('c9d5dc68-9894-4299-afa7-542ec203fed2'::UUID, 'army', '12D', 'Diver', '{"Commercial Diver","Underwater Welder","Salvage Diver","Diving Supervisor"}'::TEXT[], '{}'::TEXT[], '{"Oil & Gas","Construction","Salvage","Marine"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('ca4cd199-4306-4037-9bf0-55ae19c7db56'::UUID, 'army', '25S', 'Satellite Communication Systems Operator-Maintainer', '{"Satellite Communications Technician","RF Engineer","Telecommunications Technician","Network Engineer"}'::TEXT[], '{"17-3023.00","15-1244.00"}'::TEXT[], '{"Telecommunications","Defense","Aerospace"}'::TEXT[], '{"SATCOM","RF Systems","Antenna Systems","Networking","Troubleshooting","Encryption"}'::TEXT[], 'Operates and maintains satellite communication systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('cae0022d-7859-4022-b12b-6eaf828d55cb'::UUID, 'uscg', 'BOSN', 'Boatswain', '{"Marine Superintendent","Deck Operations Manager","Port Captain","Fleet Manager"}'::TEXT[], '{}'::TEXT[], '{"Maritime","Shipping","Oil & Gas"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('cb3c3b8b-db47-4375-ad8f-1ed009a5290d'::UUID, 'usmc', '0331', 'Machine Gunner', '{"Security Specialist","Weapons Instructor","Training Specialist"}'::TEXT[], '{}'::TEXT[], '{"Security","Defense","Training"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('cbdf13b3-da21-46e5-b8e3-3fda08f8f4a4'::UUID, 'navy', 'CM', 'Construction Mechanic', '{"Heavy Equipment Mechanic","Diesel Mechanic","Fleet Maintenance Manager","Equipment Maintenance Technician"}'::TEXT[], '{"49-3042.00"}'::TEXT[], '{"Construction","Transportation","Mining"}'::TEXT[], '{"Diesel Engines","Hydraulics","Heavy Equipment","Preventive Maintenance","Welding","HVAC"}'::TEXT[], 'Maintains construction and automotive equipment')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('cc0dd6c2-4b5a-494c-9b08-1a37ed553767'::UUID, 'usaf', '2A6X6', 'Aircraft Electrical and Environmental Systems', '{"Aircraft Electrician","Environmental Systems Technician","Avionics Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('cc1151e8-a694-427e-b56b-58b9d7671ff6'::UUID, 'usaf', '3D0X2', 'Cyber Systems Operations', '{"Systems Administrator","Network Administrator","IT Specialist","Cybersecurity Specialist"}'::TEXT[], '{}'::TEXT[], '{"Technology","Government","Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('cc89358a-7afe-4827-9848-9bc9f9b49e9f'::UUID, 'usmc', '0811', 'Field Artillery Cannoneer', '{"Heavy Equipment Operator","Security Specialist"}'::TEXT[], '{}'::TEXT[], '{"Defense","Construction"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('ccaebd0b-a084-4da5-9651-23084c5d1b45'::UUID, 'army', '15D', 'Aircraft Powertrain Repairer', '{"Aircraft Mechanic","Helicopter Mechanic","Powertrain Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('ccd10147-31ec-4fea-9f1c-e2d61525b518'::UUID, 'usmc', '2336', 'Explosive Ordnance Disposal Technician', '{"EOD Technician","Bomb Technician","Explosive Safety Specialist"}'::TEXT[], '{}'::TEXT[], '{"Law Enforcement","Security","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('cd154e2c-5087-470b-9112-df66c942046e'::UUID, 'navy', 'CTM', 'Cryptologic Technician (Maintenance)', '{"Electronics Technician","SIGINT Systems Technician","Network Maintenance Engineer","Field Service Engineer"}'::TEXT[], '{"17-3023.00","49-2094.00"}'::TEXT[], '{"Defense","Technology","Telecommunications"}'::TEXT[], '{"Electronics Maintenance","SIGINT Systems","Cryptographic Equipment","Troubleshooting","Calibration"}'::TEXT[], 'Maintains and repairs cryptologic systems')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('cd7d39b0-d1d5-4107-b66f-3f5a6724007f'::UUID, 'navy', 'MA', 'Masters at Arms', '{"Security Manager","Law Enforcement Officer","Security Consultant","Loss Prevention Manager","Physical Security Specialist","Compliance Officer"}'::TEXT[], '{"33-9032.00","33-3051.00","13-1199.00"}'::TEXT[], '{"Security","Law Enforcement","Government","Corporate Security"}'::TEXT[], '{"Physical Security","Force Protection","Investigations","Access Control","Law Enforcement","Anti-Terrorism"}'::TEXT[], 'Provides security, law enforcement, and force protection')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('cd82e2dc-851c-47a8-aaed-139843bc39eb'::UUID, 'ussf', '6F0X1', 'Financial Management', '{"Financial Analyst","Accountant","Budget Analyst","Financial Manager","Cost Analyst"}'::TEXT[], '{}'::TEXT[], '{"Finance","Accounting","Government","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('ce915371-2437-48a8-8e81-1ec93dfeccdd'::UUID, 'usmc', '8412', 'Career Retention Specialist', '{"Career Counselor","Retention Specialist","HR Specialist"}'::TEXT[], '{}'::TEXT[], '{"Human Resources","Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('cfa4e4f8-a514-4e5a-b108-99ec4530071d'::UUID, 'uscg', 'LAW', 'Legal', '{"Attorney","Legal Counsel","Compliance Officer","Legal Manager"}'::TEXT[], '{}'::TEXT[], '{"Legal","Government","Corporate"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('cfd624aa-a720-471a-9df0-ec9a19118bb5'::UUID, 'uscg', 'BM', 'Boatswain''s Mate', '{"Deck Officer","Boat Captain","Marina Manager","Deck Supervisor","Cargo Operations Manager","Vessel Master"}'::TEXT[], '{}'::TEXT[], '{"Maritime","Shipping","Logistics","Oil & Gas"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('cfef7775-400d-4af5-bae2-56efced1a565'::UUID, 'usaf', '1W0X1', 'Weather', '{"Meteorologist","Weather Forecaster","Atmospheric Scientist","Broadcast Meteorologist"}'::TEXT[], '{}'::TEXT[], '{"Weather Services","Media","Aviation","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('cff28e92-5957-4354-bc73-695af0b3ddda'::UUID, 'usmc', '6336', 'Aircraft Electrical Systems Technician', '{"Aircraft Electrician","Aviation Electrician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('d16c6cfc-74ed-4532-9ebf-3975e13bab4a'::UUID, 'usaf', '1A1X1', 'Flight Engineer', '{"Flight Engineer","Aircraft Systems Operator","Aviation Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('d201eab4-fa94-4472-99ef-0273ebcf5cb8'::UUID, 'usmc', '6046', 'Aircraft Intermediate Level Structures Mechanic', '{"Aircraft Structural Mechanic","Sheet Metal Mechanic"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('d4563fb0-3e39-44be-b390-eced84597bf0'::UUID, 'usaf', '1U0X1', 'Remotely Piloted Aircraft (RPA) Sensor Operator', '{"Drone Sensor Operator","UAV Operator","Remote Pilot","ISR Specialist"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Defense","Technology"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('d4b9223a-0507-4a35-afeb-a1c2f5b4c8b1'::UUID, 'uscg', 'MLE', 'Maritime Law Enforcement Specialist', '{"Law Enforcement Officer","Federal Agent","Customs Officer","Security Specialist","Investigator"}'::TEXT[], '{}'::TEXT[], '{"Law Enforcement","Government","Security"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('d6af6bde-620c-4305-8874-b747e69ad05c'::UUID, 'uscg', 'GM', 'Gunner''s Mate', '{"Weapons Specialist","Armorer","Security Specialist","Firearms Instructor","Weapons Technician"}'::TEXT[], '{}'::TEXT[], '{"Security","Law Enforcement","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('d73b61f1-8fbb-4d7f-a15c-5552778f4e7b'::UUID, 'usmc', '7041', 'Aviation Operations Specialist', '{"Air Traffic Controller","Flight Operations Specialist"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Transportation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('d886142f-3363-4330-9823-23d985b9d6f9'::UUID, 'usaf', '1W0X2', 'Special Operations Weather', '{"Meteorologist","Weather Specialist","Environmental Analyst"}'::TEXT[], '{}'::TEXT[], '{"Weather Services","Defense","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('dbbae571-2d75-4223-bc59-7749ed3b22a7'::UUID, 'army', '35G', 'Geospatial Intelligence Imagery Analyst', '{"Imagery Analyst","Geospatial Analyst","Remote Sensing Specialist","GIS Analyst"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Government","Technology","Environmental"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('dbc4c03c-1f00-45e4-9d32-6c0e195ffb3a'::UUID, 'uscg', 'MK', 'Machinery Technician', '{"Marine Mechanic","Diesel Mechanic","Industrial Mechanic","Power Plant Operator","Engine Room Operator"}'::TEXT[], '{}'::TEXT[], '{"Maritime","Energy","Manufacturing","Transportation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('dc0cae42-3909-44d6-b0be-4c857c7b7cf0'::UUID, 'navy', 'EA', 'Engineering Aide', '{"Survey Technician","Civil Engineering Technician","GIS Analyst","Construction Surveyor","CAD Technician"}'::TEXT[], '{"17-3022.00","17-3031.00"}'::TEXT[], '{"Construction","Engineering","Government"}'::TEXT[], '{"Surveying","AutoCAD","GIS","Blueprint Reading","Soil Testing","Construction Planning"}'::TEXT[], 'Performs surveying and civil engineering support')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('dc374812-35ce-4051-9d19-80e2b9a1297c'::UUID, 'navy', 'CM', 'Construction Mechanic', '{"Heavy Equipment Mechanic","Diesel Mechanic","Fleet Mechanic","Mobile Equipment Technician","Shop Supervisor"}'::TEXT[], '{}'::TEXT[], '{"Construction","Transportation","Mining","Agriculture","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('dc4cc9f6-4582-4557-aea9-a07f805482e1'::UUID, 'usaf', '1T2X1', 'Pararescue', '{"Paramedic","Search and Rescue Specialist","Flight Medic","Emergency Medical Technician"}'::TEXT[], '{}'::TEXT[], '{"Emergency Services","Healthcare","Aviation","Security"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('dd3b7d06-46df-4aba-b7d6-e6133717d39f'::UUID, 'usmc', '5711', 'Nuclear, Biological, and Chemical Defense Specialist', '{"HAZMAT Technician","CBRN Specialist","Safety Specialist"}'::TEXT[], '{}'::TEXT[], '{"Environmental","Safety","Emergency Response"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('dd42c0b8-c21c-4c9a-bae3-26b2281ca2eb'::UUID, 'navy', 'ND', 'Navy Diver', '{"Commercial Diver","Underwater Welder","Salvage Diver","Diving Supervisor","ROV Operator"}'::TEXT[], '{}'::TEXT[], '{"Oil & Gas","Construction","Salvage","Marine Research"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('dd9ad009-dbf2-4f1c-a411-5f7313b1c954'::UUID, 'navy', 'AC', 'Air Traffic Controller', '{"Air Traffic Controller","Flight Operations Specialist","Airfield Manager","Aviation Operations Coordinator"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Transportation","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('ddb9925e-f7b4-455a-a9a7-32722abd5fcf'::UUID, 'army', '88N', 'Transportation Management Coordinator', '{"Transportation Coordinator","Logistics Coordinator","Dispatch Supervisor","Traffic Manager"}'::TEXT[], '{}'::TEXT[], '{"Transportation","Logistics","Supply Chain"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('dde79fb7-800d-4a83-8cf0-147a7e95d060'::UUID, 'army', '15N', 'Avionic Mechanic', '{"Avionics Technician","Electronics Technician","Instrument Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Electronics"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('ddf358c1-3b6e-4c22-b740-5e110c2965dc'::UUID, 'usmc', '1141', 'Electrician', '{"Electrician","Electrical Technician","Industrial Electrician"}'::TEXT[], '{}'::TEXT[], '{"Construction","Utilities","Manufacturing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('de0069f5-2abc-4401-b5fe-1975c2776a9f'::UUID, 'army', '15W', 'Unmanned Aircraft Systems Operator', '{"Drone Pilot","UAV Operator","UAS Pilot","Remote Pilot","Drone Program Manager"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Technology","Agriculture","Film","Surveying","Security"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('df4625c9-86aa-47df-b114-483de072d6b5'::UUID, 'usmc', '7251', 'Air Traffic Controller', '{"Air Traffic Controller","ATC Specialist","Tower Controller"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Transportation","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('df588438-2213-4f34-a8da-25400124313e'::UUID, 'army', '12M', 'Firefighter', '{"Firefighter","Fire Inspector","Fire Captain","Emergency Response Specialist"}'::TEXT[], '{}'::TEXT[], '{"Fire Service","Government","Industrial"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('df73c2ac-f5b3-41af-94c7-1fb119501c80'::UUID, 'navy', 'LN', 'Legalman', '{"Paralegal","Legal Assistant","Legal Administrator","Court Reporter","Compliance Specialist"}'::TEXT[], '{"23-2011.00"}'::TEXT[], '{"Legal","Government","Corporate"}'::TEXT[], '{"Legal Research","Court Reporting","UCMJ","Administrative Law","Document Preparation","Legal Administration"}'::TEXT[], 'Performs legal and administrative duties')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('dfab4f3f-1d0d-453d-b107-9c7da04643e2'::UUID, 'usaf', '4Y0X1', 'Dental Assistant', '{"Dental Assistant","Dental Hygienist","Dental Technician"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Dental"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e03c7f60-5afd-437f-9468-6d5759aa6fc2'::UUID, 'navy', 'MN', 'Mineman', '{"Ordnance Technician","Underwater Systems Technician","Electronics Technician","Quality Assurance Inspector"}'::TEXT[], '{"19-4099.00"}'::TEXT[], '{"Defense","Technology"}'::TEXT[], '{"Mine Warfare","Ordnance Handling","Electronics","Explosive Safety","Quality Assurance"}'::TEXT[], 'Maintains and deploys naval mines and mine countermeasures')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e0487e17-1f1f-4bc0-b153-582931c3e53f'::UUID, 'usaf', '1A3X1', 'Airborne Mission Systems Specialist', '{"Mission Systems Operator","Avionics Specialist","Electronics Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e0d26f4e-65c9-4105-9393-cbddf52aa56d'::UUID, 'army', '91L', 'Construction Equipment Repairer', '{"Heavy Equipment Mechanic","Construction Equipment Technician","Diesel Mechanic"}'::TEXT[], '{}'::TEXT[], '{"Construction","Mining","Equipment Rental"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e1035b0d-6fbe-4804-ae51-4ccee206c825'::UUID, 'army', '68T', 'Animal Care Specialist', '{"Veterinary Technician","Animal Care Technician","Veterinary Assistant","Lab Animal Technician"}'::TEXT[], '{}'::TEXT[], '{"Veterinary","Research","Animal Care"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e1317a7d-9f93-42df-8909-4c696f3bee81'::UUID, 'army', '68E', 'Dental Specialist', '{"Dental Assistant","Dental Hygienist","Dental Technician"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Dental"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e180d1aa-2993-43a9-a48a-f3147861cd00'::UUID, 'navy', 'CTN', 'Cryptologic Technician (Networks)', '{"Cybersecurity Analyst","Network Security Engineer","Cyber Operations Specialist","SOC Analyst","Penetration Tester","Red Team Operator"}'::TEXT[], '{"15-1212.00","15-1299.00"}'::TEXT[], '{"Cybersecurity","Defense","Technology","Finance"}'::TEXT[], '{"Cybersecurity","Network Defense","Penetration Testing","SIEM","Incident Response","Malware Analysis","Python","Linux"}'::TEXT[], 'Conducts cyber operations and network exploitation')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e1844a9f-5e5d-40f5-a384-16dd0070f411'::UUID, 'usmc', '3051', 'Warehouse Clerk', '{"Warehouse Clerk","Stock Clerk","Material Handler"}'::TEXT[], '{}'::TEXT[], '{"Warehousing","Retail","Logistics"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e1c7fa7f-56ba-4661-a762-2b7e0dbefe2b'::UUID, 'usaf', '4V0X1', 'Ophthalmic', '{"Ophthalmic Technician","Optometric Technician","Eye Care Technician"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Ophthalmology","Optometry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e1e10a73-483c-422f-baf7-5aa68a546875'::UUID, 'usaf', '3E4X1', 'Water and Fuel Systems Maintenance', '{"Plumber","Water Treatment Operator","Utilities Technician","Pipefitter"}'::TEXT[], '{}'::TEXT[], '{"Utilities","Construction","Facilities"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e29d36ea-b577-4796-9671-0aac6f44225d'::UUID, 'usaf', '1N7X1', 'Human Intelligence Specialist', '{"Intelligence Specialist","HUMINT Analyst","Investigator","Research Specialist"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Government","Consulting"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e2a8ce68-0702-46b7-a1d9-29aee076806d'::UUID, 'army', '92Y', 'Unit Supply Specialist', '{"Inventory Manager","Warehouse Supervisor","Supply Chain Coordinator","Procurement Specialist","Materials Handler"}'::TEXT[], '{"43-5071.00","53-7062.00","13-1023.00"}'::TEXT[], '{"Logistics","Retail","Manufacturing","Government"}'::TEXT[], '{"Inventory Management","GCSS-Army","Supply Chain","Property Accountability","Receiving","Distribution"}'::TEXT[], 'Maintains unit supplies and equipment accountability')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e33dd089-dc47-4f86-9fea-5d9fcdcb44f9'::UUID, 'navy', 'STG', 'Sonar Technician Surface', '{"Sonar Technician","Acoustic Analyst","Electronics Technician","Marine Electronics Technician"}'::TEXT[], '{}'::TEXT[], '{"Defense","Marine Research","Oil & Gas","Oceanography"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e34605d1-c8b3-433b-902d-b3aa0f061147'::UUID, 'usaf', '4T0X2', 'Histopathology', '{"Histotechnician","Histology Technician","Pathology Technician"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Laboratories","Pathology"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e377bdaf-afd6-418d-9163-b9ab4e0d1057'::UUID, 'usaf', '2M0X1', 'Missile and Space Systems Electronic Maintenance', '{"Missile Systems Technician","Electronics Technician","Aerospace Electronics Technician"}'::TEXT[], '{}'::TEXT[], '{"Defense","Aerospace","Electronics"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e3b3f7e3-4ecd-4dce-8fdd-760b34676d6e'::UUID, 'navy', 'FT', 'Fire Control Technician', '{"Fire Control Technician","Sonar Technician","Weapons Systems Technician","Electronics Technician"}'::TEXT[], '{}'::TEXT[], '{"Defense","Aerospace","Electronics"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e3cf1ab8-362c-4b32-8311-7c62a8070821'::UUID, 'army', '12C', 'Bridge Crewmember', '{"Structural Ironworker","Bridge Worker","Construction Worker","Heavy Equipment Operator"}'::TEXT[], '{}'::TEXT[], '{"Construction","Infrastructure","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e3d530d6-c2e9-410b-9fe4-83ce6e274704'::UUID, 'usmc', '4641', 'Combat Photographer', '{"Photographer","Photojournalist","Videographer"}'::TEXT[], '{}'::TEXT[], '{"Media","News","Entertainment"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e40d08dc-4bbd-4dd4-bba9-85ac99a61514'::UUID, 'army', '88M', 'Motor Transport Operator', '{"Truck Driver","CDL Driver","Transportation Specialist","Delivery Driver","Fleet Driver"}'::TEXT[], '{}'::TEXT[], '{"Transportation","Logistics","Delivery"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e5109c56-98c7-4557-859a-6a32bf53b3f9'::UUID, 'army', '11B', 'Infantryman', '{"Security Manager","Operations Manager","Law Enforcement Officer","Project Manager","Team Leader","Emergency Management Specialist"}'::TEXT[], '{"33-9032.00","11-1021.00","13-1199.00"}'::TEXT[], '{"Security","Law Enforcement","Defense","Management"}'::TEXT[], '{"Team Leadership","Operations Planning","Risk Assessment","Personnel Management","Training Development","Communication"}'::TEXT[], 'Ground combat soldier specializing in small unit tactics')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e6056131-8751-47f9-9f76-62b6bd4092c3'::UUID, 'usmc', '0431', 'Logistics/Embarkation Chief', '{"Logistics Manager","Supply Chain Manager","Distribution Manager"}'::TEXT[], '{}'::TEXT[], '{"Logistics","Supply Chain","Transportation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e65a5b52-e25e-495f-9ea4-eba7a8000680'::UUID, 'navy', 'QM', 'Quartermaster', '{"Navigator","Maritime Operations Coordinator","Bridge Operations Manager","Chart/GIS Analyst"}'::TEXT[], '{"53-5021.00"}'::TEXT[], '{"Maritime","Transportation","GIS"}'::TEXT[], '{"Navigation","Chart Reading","GPS","ECDIS","Bridge Operations","Ship Handling","Weather Analysis"}'::TEXT[], 'Navigates ships and maintains charts and navigational equipment')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e697e9bb-cfa6-4ff1-996b-c0f6893721b9'::UUID, 'usaf', '3E7X1', 'Fire Protection', '{"Firefighter","Fire Inspector","Fire Captain","Fire Prevention Specialist"}'::TEXT[], '{}'::TEXT[], '{"Fire Service","Government","Industrial"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e69e25db-cc49-4868-b643-39c5c413f201'::UUID, 'army', '91C', 'Utilities Equipment Repairer', '{"HVAC Technician","Refrigeration Mechanic","Utilities Technician","Maintenance Technician"}'::TEXT[], '{}'::TEXT[], '{"Facilities","HVAC","Utilities"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e6b1c16e-8aba-4cc3-8e98-2c3e66770c38'::UUID, 'army', '92Y', 'Unit Supply Specialist', '{"Supply Clerk","Inventory Specialist","Stock Clerk","Warehouse Clerk","Materials Handler"}'::TEXT[], '{}'::TEXT[], '{"Warehousing","Retail","Manufacturing","Logistics"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e6d4b7ae-7feb-4341-a7d2-cdf566cf6fd3'::UUID, 'usmc', '1345', 'Heavy Equipment Operator', '{"Heavy Equipment Operator","Bulldozer Operator","Crane Operator"}'::TEXT[], '{}'::TEXT[], '{"Construction","Mining","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e7736aed-d85a-44b9-a446-0352ba3dbc33'::UUID, 'usmc', '2671', 'Middle East Cryptologic Linguist', '{"Arabic Linguist","Translator","Intelligence Analyst"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Government","Translation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e8742cd8-1012-4e5a-a792-909f482520b5'::UUID, 'usmc', '2111', 'Small Arms Repairer/Technician', '{"Gunsmith","Armorer","Weapons Technician"}'::TEXT[], '{}'::TEXT[], '{"Firearms","Security","Sporting Goods"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e8802129-640c-43f9-8ff5-672168d06223'::UUID, 'uscg', 'OS', 'Operations Specialist', '{"Operations Coordinator","Dispatcher","Vessel Traffic Controller","Radar Operator","Maritime Operations Specialist"}'::TEXT[], '{}'::TEXT[], '{"Maritime","Transportation","Logistics","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('e90e81a3-5020-452e-8291-ccae84af39ab'::UUID, 'usaf', '3S0X1', 'Personnel', '{"HR Specialist","Personnel Administrator","HR Coordinator","Benefits Specialist"}'::TEXT[], '{}'::TEXT[], '{"Human Resources","Any Industry"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('ea7f2dc4-c517-4600-8066-2c8142bed31b'::UUID, 'uscg', 'PA', 'Public Affairs Specialist', '{"Public Relations Specialist","Communications Manager","Media Relations Specialist","Marketing Specialist","Journalist"}'::TEXT[], '{}'::TEXT[], '{"Public Relations","Marketing","Media","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('ea81a583-c734-40d3-a8ff-a3235319d361'::UUID, 'usaf', '5R0X1', 'Chaplain Assistant', '{"Religious Program Coordinator","Administrative Assistant","Community Outreach Coordinator"}'::TEXT[], '{}'::TEXT[], '{"Religious Organizations","Non-Profit","Social Services"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('eaaa16a3-7e2a-49ff-a8f0-edde7dca0f6a'::UUID, 'army', '15F', 'Aircraft Electrician', '{"Aircraft Electrician","Avionics Technician","Aviation Electrician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('eb6165c1-e42e-46b3-bdac-36a2fbe39f90'::UUID, 'navy', 'AD', 'Aviation Machinist''s Mate', '{"Aircraft Mechanic","Aviation Maintenance Technician","Powerplant Mechanic","Jet Engine Mechanic","A&P Mechanic"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Defense","Manufacturing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('eb785bbf-3625-44fc-bee0-6a92974d08e8'::UUID, 'army', '13R', 'Field Artillery Firefinder Radar Operator', '{"Radar Technician","Electronics Technician","Surveillance Operator"}'::TEXT[], '{}'::TEXT[], '{"Defense","Aviation","Security"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('eb9afe79-4e32-449e-94cd-23e1e489837d'::UUID, 'army', '68A', 'Biomedical Equipment Specialist', '{"Biomedical Equipment Technician","Medical Equipment Technician","Clinical Engineer","BMET"}'::TEXT[], '{}'::TEXT[], '{"Healthcare","Medical Device","Hospitals"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('ebdf2f1b-1072-4e02-aa77-b1cb5658120f'::UUID, 'army', '25V', 'Combat Documentation/Production Specialist', '{"Videographer","Camera Operator","Video Producer","Documentary Filmmaker"}'::TEXT[], '{}'::TEXT[], '{"Media","Entertainment","Marketing","News"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('ec09a460-95ab-4a58-86de-1a654ae623d8'::UUID, 'usaf', '2A7X2', 'Nondestructive Inspection', '{"NDI Technician","NDT Inspector","Quality Inspector","Aircraft Inspector"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Manufacturing","Oil & Gas"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('eef108c6-84f0-48e4-b49c-f2fca934b838'::UUID, 'usmc', '6116', 'Tiltrotor Mechanic MV-22', '{"Tiltrotor Mechanic","Aircraft Mechanic","Aviation Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('ef2f02fa-14ab-4534-9cb6-82fdac212c66'::UUID, 'usmc', '1833', 'Amphibious Assault Vehicle Crewman', '{"Vehicle Operator","Equipment Operator","Marine Operator"}'::TEXT[], '{}'::TEXT[], '{"Transportation","Marine"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('ef5c18dd-2734-48aa-8165-3cf0d1749c55'::UUID, 'usmc', '7051', 'Aircraft Rescue and Firefighting Specialist', '{"Aircraft Rescue Firefighter","ARFF Specialist","Fire Captain"}'::TEXT[], '{}'::TEXT[], '{"Fire Service","Aviation","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('efcbeebd-d38c-4c10-9609-0a14dd7bccef'::UUID, 'usmc', '0411', 'Maintenance Management Specialist', '{"Maintenance Manager","Production Planner","Operations Supervisor"}'::TEXT[], '{}'::TEXT[], '{"Manufacturing","Logistics","Facilities"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('f02b9f90-17d9-4f9d-829f-df23d432cac1'::UUID, 'usmc', '2311', 'Ammunition Technician', '{"Ammunition Handler","Ordnance Specialist","Warehouse Specialist"}'::TEXT[], '{}'::TEXT[], '{"Defense","Security","Warehousing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('f08dfe30-2893-4aee-bb89-48c5922dc903'::UUID, 'army', '35P', 'Cryptologic Linguist', '{"Linguist","Translator","Interpreter","Foreign Language Analyst","Intelligence Analyst"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Government","Translation Services","International Business"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('f0e6cd43-00b6-46ea-858e-ff2bf62dd3a5'::UUID, 'army', '92F', 'Petroleum Supply Specialist', '{"Fuel Handler","Petroleum Technician","Fuel Distribution Specialist","Terminal Operator"}'::TEXT[], '{}'::TEXT[], '{"Oil & Gas","Transportation","Utilities"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('f11bf6d4-859d-48a6-8185-b552f2145efd'::UUID, 'usaf', '4B0X1', 'Bioenvironmental Engineering', '{"Environmental Health Specialist","Industrial Hygienist","Safety Specialist","Environmental Technician"}'::TEXT[], '{}'::TEXT[], '{"Environmental","Healthcare","Government","Industrial"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('f1480d83-d377-4639-899d-774837df704f'::UUID, 'usaf', '1C6X1', 'Space Systems Operations', '{"Satellite Operator","Space Systems Analyst","Mission Operations Specialist","Spacecraft Controller"}'::TEXT[], '{}'::TEXT[], '{"Aerospace","Space","Defense","Telecommunications"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('f305a7ee-06fd-44c1-9a7f-b9d8f109473f'::UUID, 'navy', 'MU', 'Musician', '{"Professional Musician","Music Director","Band Director","Music Teacher","Audio Engineer"}'::TEXT[], '{}'::TEXT[], '{"Entertainment","Education","Media"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('f37e21ce-33ed-4d66-9057-8bb4b83bf5ff'::UUID, 'usmc', '6212', 'Fixed-Wing Aircraft Mechanic', '{"Aircraft Mechanic","A&P Mechanic","Aviation Maintenance Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('f3e0f299-6548-412c-8c78-f60f4f33ecad'::UUID, 'navy', 'EN', 'Engineman', '{"Diesel Engine Technician","Marine Engineer","Power Plant Operator","Facilities Engineer","Mechanical Maintenance Technician"}'::TEXT[], '{"49-3042.00","51-8013.00"}'::TEXT[], '{"Marine","Energy","Manufacturing","Transportation"}'::TEXT[], '{"Diesel Engines","Refrigeration","HVAC","Air Compressors","Auxiliary Systems","Preventive Maintenance"}'::TEXT[], 'Operates and maintains diesel engines and auxiliary machinery')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('f3e91840-ab6c-4148-9f10-48bc5e483069'::UUID, 'usaf', '1C7X1', 'Airfield Management', '{"Airport Operations Manager","Airfield Manager","Aviation Operations Coordinator","Airport Director"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Transportation","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('f4a4ca29-280f-4c2a-9639-f4808666df92'::UUID, 'army', '12B', 'Combat Engineer', '{"Construction Supervisor","Heavy Equipment Operator","Demolition Specialist","Construction Manager","Site Supervisor"}'::TEXT[], '{}'::TEXT[], '{"Construction","Mining","Infrastructure","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('f4aeb4d0-119b-4b65-b591-f393eb2172f9'::UUID, 'usmc', '7234', 'Air Control Electronics Operator', '{"Air Traffic Controller","Radar Operator"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('f507e0cb-8b79-434d-9f52-a51df878026f'::UUID, 'army', '12Y', 'Geospatial Engineer', '{"GIS Specialist","Cartographer","Geospatial Analyst","Survey Technician"}'::TEXT[], '{}'::TEXT[], '{"Government","Technology","Engineering","Environmental"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('f54fdaf9-8a22-4f7a-a669-688c5bf82c48'::UUID, 'army', '46S', 'Public Affairs Specialist', '{"Public Relations Specialist","Communications Manager","Media Relations Specialist","Press Secretary"}'::TEXT[], '{}'::TEXT[], '{"Public Relations","Marketing","Government","Corporate Communications"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('f55bebaa-fcbb-4d20-baf8-775e3e3fb6b8'::UUID, 'army', '15P', 'Aviation Operations Specialist', '{"Flight Operations Coordinator","Aviation Dispatcher","Operations Specialist"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Transportation","Logistics"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('f6401512-accf-4129-b2c6-75da7ba47a44'::UUID, 'uscg', 'OS', 'Operations Specialist', '{"Operations Coordinator","Search and Rescue Coordinator","Communications Specialist","Air Traffic Controller"}'::TEXT[], '{"53-2021.00","13-1081.00"}'::TEXT[], '{"Aviation","Maritime","Government"}'::TEXT[], '{"Search and Rescue","Communications","Radar Operations","Mission Coordination","Air Traffic Control"}'::TEXT[], 'Coordinates search and rescue operations and vessel traffic')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('f6b346e3-24d5-4045-a7b5-13d2048a567e'::UUID, 'usaf', '2T3X1', 'Vehicle Maintenance', '{"Automotive Technician","Fleet Mechanic","Diesel Technician","Service Manager"}'::TEXT[], '{}'::TEXT[], '{"Automotive","Transportation","Fleet Management"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('f78c9af7-0295-42d0-aacb-9d9e676439c4'::UUID, 'army', '91H', 'Track Vehicle Repairer', '{"Heavy Equipment Mechanic","Track Equipment Technician","Mining Equipment Mechanic"}'::TEXT[], '{}'::TEXT[], '{"Mining","Construction","Agriculture"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('f7aae20d-beaf-40aa-b000-fb34602a1702'::UUID, 'usmc', '2862', 'Electronics Maintenance Technician', '{"Electronics Technician","Maintenance Technician","Field Service Technician"}'::TEXT[], '{}'::TEXT[], '{"Electronics","Manufacturing"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('f815ad94-8454-4091-9383-2b15c63b17e8'::UUID, 'usaf', '2P0X1', 'Precision Measurement Equipment Laboratory', '{"Calibration Technician","Metrology Technician","PMEL Technician","Quality Technician"}'::TEXT[], '{}'::TEXT[], '{"Manufacturing","Aerospace","Defense","Quality Control"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('f8178f2a-3d5d-474b-9f9f-d888cb66d165'::UUID, 'navy', 'AG', 'Aerographer''s Mate', '{"Meteorologist","Weather Forecaster","Atmospheric Scientist","Environmental Scientist","Climate Analyst"}'::TEXT[], '{}'::TEXT[], '{"Weather Services","Environmental","Government","Media","Energy"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('f83b3e33-c649-45a8-b646-f40481848f21'::UUID, 'navy', 'NC', 'Navy Counselor', '{"Career Counselor","Recruiter","HR Specialist","Training Coordinator","Talent Acquisition Specialist"}'::TEXT[], '{}'::TEXT[], '{"Human Resources","Staffing","Education","Government"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('f997276a-d3ed-4569-a2df-b711d7eff66b'::UUID, 'uscg', 'OPS', 'Operations', '{"Operations Manager","Program Manager","Director of Operations","General Manager"}'::TEXT[], '{}'::TEXT[], '{"Any Industry","Maritime","Logistics"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('fa1cf7c2-bf46-4509-8256-06efa64cf032'::UUID, 'usmc', '6314', 'Unmanned Aircraft System Avionics Technician', '{"UAS Technician","Drone Technician","Avionics Technician"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Technology"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('fa770a00-4254-4b5c-bd23-d2aa2e1a0ef7'::UUID, 'usaf', '2A3X3', 'Tactical Aircraft Maintenance (A-10, F-15)', '{"Aircraft Mechanic","Aviation Maintenance Technician","A&P Mechanic"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Aerospace","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('fc624246-8c16-4b85-a8ac-5a425e8ae8ab'::UUID, 'army', '25U', 'Signal Support Systems Specialist', '{"IT Support Specialist","Communications Technician","Network Technician","Field Service Technician"}'::TEXT[], '{}'::TEXT[], '{"Technology","Telecommunications"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('fc922bce-73ae-4204-bd81-12df7f233818'::UUID, 'army', '35N', 'Signals Intelligence Analyst', '{"SIGINT Analyst","Signals Analyst","Communications Analyst","Cybersecurity Analyst"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Defense","Technology"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('fc96a4f5-d171-464c-87f5-4bbf4b4edf81'::UUID, 'usmc', '6423', 'Aviation Operations Specialist', '{"Flight Operations Coordinator","Aviation Dispatcher"}'::TEXT[], '{}'::TEXT[], '{"Aviation","Transportation"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('fcc4f1ac-561f-4c43-b965-0eb7381fda22'::UUID, 'army', '91M', 'Bradley Fighting Vehicle System Maintainer', '{"Heavy Equipment Mechanic","Armored Vehicle Technician","Diesel Mechanic"}'::TEXT[], '{}'::TEXT[], '{"Defense","Mining","Construction"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('fce82df6-594c-441e-89a3-274a5a73cb49'::UUID, 'navy', 'CS', 'Culinary Specialist', '{"Chef","Food Service Manager","Kitchen Manager","Catering Manager","Food Safety Manager"}'::TEXT[], '{"35-1012.00","11-9051.00"}'::TEXT[], '{"Hospitality","Food Service","Healthcare"}'::TEXT[], '{"Food Preparation","Menu Planning","Inventory Management","Food Safety","Budget Management","ServSafe"}'::TEXT[], 'Prepares food and manages dining facilities')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('fd1fb22b-de11-443c-896a-e9bc8357b879'::UUID, 'army', '19D', 'Cavalry Scout', '{"Security Specialist","Surveillance Specialist","Security Consultant","Reconnaissance Specialist"}'::TEXT[], '{}'::TEXT[], '{"Security","Law Enforcement","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('fd2b0fbe-1840-43eb-96fc-9341a1b6d38d'::UUID, 'usmc', '0211', 'Counterintelligence/HUMINT Specialist', '{"Counterintelligence Analyst","HUMINT Analyst","Investigator","Insider Threat Analyst"}'::TEXT[], '{"33-3021.00","13-1161.00"}'::TEXT[], '{"Intelligence","Government","Defense"}'::TEXT[], '{"Counterintelligence","HUMINT","Investigations","Interrogation","Report Writing","Source Operations"}'::TEXT[], 'Conducts counterintelligence and human intelligence operations')
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('fde681b0-1b1a-46ce-8e2f-cd9fcf0b2fba'::UUID, 'usmc', '3381', 'Food Service Specialist', '{"Chef","Cook","Food Service Supervisor","Kitchen Manager"}'::TEXT[], '{}'::TEXT[], '{"Food Service","Hospitality"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('fe75a450-5450-4cd9-b1b0-1e2be64b5b33'::UUID, 'army', '25D', 'Cyber Network Defender', '{"Cybersecurity Analyst","Network Security Engineer","SOC Analyst","Information Security Analyst"}'::TEXT[], '{}'::TEXT[], '{"Technology","Finance","Government","Defense"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('fea22759-2ba7-43a1-9dbf-6b2fca091318'::UUID, 'usaf', '1N4X1', 'Fusion Analyst', '{"Fusion Analyst","Intelligence Analyst","Data Analyst","Threat Analyst"}'::TEXT[], '{}'::TEXT[], '{"Intelligence","Defense","Technology","Finance"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('feac7fae-02ae-40d6-b6f6-c9983f5fe8dd'::UUID, 'usaf', '1C3X1', 'Command Post', '{"Emergency Operations Coordinator","Dispatch Supervisor","Command Center Operator","Operations Center Manager"}'::TEXT[], '{}'::TEXT[], '{"Emergency Services","Government","Security","Utilities"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('ff1f04db-872c-45f7-927c-a2cf3e52f717'::UUID, 'usaf', '1C5X1', 'Aerospace Control and Warning Systems', '{"Radar Operator","Aerospace Surveillance Operator","Air Defense Operator"}'::TEXT[], '{}'::TEXT[], '{"Defense","Aviation","Aerospace"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;
INSERT INTO dict_mos_to_civilian (id, branch, military_code, military_title, civilian_titles, onet_codes, industries, key_skills, description) VALUES ('ffa0b2e7-ac4d-4156-9366-2da1c9522429'::UUID, 'usmc', '0621', 'Transmission Systems Operator', '{"Radio Operator","Communications Technician","Network Technician"}'::TEXT[], '{}'::TEXT[], '{"Telecommunications","Broadcasting"}'::TEXT[], '{}'::TEXT[], NULL)
  ON CONFLICT (id) DO UPDATE SET
    branch = EXCLUDED.branch,
    military_code = EXCLUDED.military_code,
    military_title = EXCLUDED.military_title,
    civilian_titles = EXCLUDED.civilian_titles,
    onet_codes = EXCLUDED.onet_codes,
    industries = EXCLUDED.industries,
    key_skills = EXCLUDED.key_skills,
    description = EXCLUDED.description;

COMMIT;
