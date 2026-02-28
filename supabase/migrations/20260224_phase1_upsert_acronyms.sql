-- =============================================================================
-- Phase 1: Upsert dict_acronyms (1,120 rows)
-- Source: /home/fiveftslim/debriefed-ai-lab/dict_acronyms_rows.csv
-- Run AFTER 20260224_phase1_schema_additions.sql
-- =============================================================================

BEGIN;

INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('00015e28-3606-4b59-a7ba-1124e4d1ae15'::UUID, 'BA', 'Budget Activity', 'Budget sub-category', 'general', 'Financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0061d86d-27ef-46f9-a058-31c7291bdbd6'::UUID, 'ADLS', 'advanced distributed learning', 'advanced distributed learning', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('00ff1a6c-b59d-4daf-83aa-87df914c692a'::UUID, 'marines', 'personnel', 'personnel', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('014bca33-6f4b-4228-9793-312300bdc134'::UUID, 'TRANSCOM', 'Transportation Command', 'Transportation Command', 'general', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('016bce3d-1a46-423d-9be9-d734324fe05e'::UUID, 'taps', 'lights out', 'lights out', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('017c70e1-9973-40c8-bb6e-2c91d8a41401'::UUID, 'PERSEC', 'personnel security', 'personnel security', 'general', 'Security')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('01d020d6-6052-4772-8355-34bc20f80a1a'::UUID, 'SORTS', 'readiness reporting', 'readiness reporting', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('01fc0112-20ae-49e3-b8c9-0c850a5b6842'::UUID, 'DAI', 'Defense Agencies Initiative', 'Defense agency accounting system', 'general', 'Financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('020bc8e6-9a97-4050-be64-2f122f143ead'::UUID, 'MDMP', 'Military Decision Making Process', 'structured decision-making methodology', 'army', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('02498051-df3a-4393-bbbf-f0c5cb1be59f'::UUID, 'airmen', 'personnel', 'personnel', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('029d5085-45d4-4098-8bf5-282a63e02b25'::UUID, 'NSG', 'Naval Security Group', 'Navy signals intelligence unit', 'navy', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('02aecd96-494b-4a30-863b-17825de2c79e'::UUID, 'TACLET', 'tactical law enforcement team', 'tactical law enforcement team', 'uscg', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('03332863-249a-4b18-820f-5f01c06ed901'::UUID, 'DAPA', 'substance abuse prevention advisor', 'substance abuse prevention advisor', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('033b2c72-df1a-426f-a04a-163400187601'::UUID, 'CMSAF', 'Chief Master Sergeant of the Space Force', 'Chief Master Sergeant of the Space Force', 'ussf', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('037caf06-5929-4460-8cb0-a342b2c22407'::UUID, 'HQ', 'headquarters', 'headquarters', 'general', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('037f2351-a190-4cd4-ba55-a9d6c464714e'::UUID, 'EPME', 'Enlisted Professional Military Education', 'Enlisted development courses', 'general', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0490e132-61c5-42c6-98ab-7a4b8cf7ffd2'::UUID, 'AAR', 'After Action Report', 'Post-event analysis and lessons learned', 'general', 'communication')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('05243c81-6c95-41ee-926d-8405c1b4758a'::UUID, 'SOQ', 'Statement of Qualifications', 'Contractor experience submittal', 'general', 'Engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('052c8aea-58bf-4893-82d4-1578ae2e67b5'::UUID, 'DATO', 'Denial of Authorization to Operate', 'Security certification failure', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0537923a-80d7-4a80-abcf-a62e0b7ba85a'::UUID, 'MOPP', 'protective posture level', 'protective posture level', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('05514a27-88ec-4ee5-a505-1089143b5ecb'::UUID, 'IFB', 'Invitation for Bid', 'Competitive bidding solicitation', 'general', 'Engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0575e065-8b46-4072-b3c7-523addd0cd4c'::UUID, 'OPCON', 'Operational Control', 'Authority over unit operations', 'general', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('05929d31-a240-4abe-8c05-f84a0d24f014'::UUID, 'DRRS', 'readiness reporting', 'readiness reporting', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('066a53f1-cb4d-41e9-840f-476812563f9f'::UUID, 'IBCT', 'infantry brigade combat team', 'infantry brigade combat team', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('06d81cf2-86f8-4eb5-a5cb-c7fd4c14dec0'::UUID, 'PEB', 'Physical Evaluation Board', 'Disability rating determination panel', 'general', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('07343442-5c2f-4b96-a89b-2f4664365660'::UUID, 'LZ', 'Landing Zone', 'Helicopter landing area', 'general', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('075be2f8-50d4-433b-b23e-76f70f40b0fa'::UUID, 'MOB', 'Man Overboard', 'Personnel recovery emergency', 'navy', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('07a6ca69-046a-438b-b375-67a87794ecb4'::UUID, 'BOL', 'BUPERS Online', 'Navy personnel self-service portal', 'navy', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('07c389d7-a4b9-4401-9876-ea83eef8cf1d'::UUID, 'EAS', 'end of active service', 'end of active service', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('080811d7-2b2d-49d1-8499-9ecf05fbe4ce'::UUID, 'C4ISR', 'Command Control Communications Computers Intelligence Surveillance Reconnaissance', 'Integrated command and information systems', 'general', 'technical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('08c3141f-3e37-4c56-b132-da8d5a486e4f'::UUID, 'BSB', 'brigade support battalion', 'brigade support battalion', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('092d14ec-365f-40b4-a822-13a123dcfaee'::UUID, 'NALCOMIS', 'Naval Aviation Logistics Command Management Information System', 'Aviation maintenance management system', 'navy', 'technical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0969d4d9-719b-4c01-8d6e-08c6dd1a9f05'::UUID, 'FMC', 'Fully Mission Capable', 'aircraft fully operational', 'general', 'aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('098919fb-ecbb-47d6-938b-f11843c35174'::UUID, 'MOPP', 'Mission Oriented Protective Posture', 'CBRN protection level', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0998a6e7-d115-441d-b3f9-9149f1c56147'::UUID, 'MEB', 'Marine Expeditionary Brigade', 'Marine Expeditionary Brigade', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('09fa2add-b52d-4d18-bffd-f0e0dab42206'::UUID, 'ESO', 'educational services officer', 'educational services officer', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('09fe283f-6886-4224-b28f-1c2b81a2eeb5'::UUID, 'BCT', 'brigade combat team', 'brigade combat team', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0a7fa327-bf7b-4f6c-86a9-b726ceea3038'::UUID, 'NWC', 'Naval War College', 'Navy senior officer education', 'navy', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0aaa8204-4d35-4b2d-9049-314c0b538e92'::UUID, 'JPME', 'Joint Professional Military Education', 'cross-organizational leadership development', 'general', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0ab222ef-533d-492e-9a9d-c457f7950d61'::UUID, 'CS', 'communications squadron', 'communications squadron', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0acae10b-e779-4d63-bc30-d858a018e873'::UUID, 'GWOTEM', 'Global War on Terrorism Expeditionary Medal', 'Overseas deployment service medal', 'general', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0aed2fce-eceb-4a55-b629-bc922010d00e'::UUID, 'MCRD', 'Marine Corps Recruit Depot', 'Marine Corps Recruit Depot', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0afc3826-579a-4045-aa00-7c2c292f5d2a'::UUID, 'MWR', 'morale, welfare and recreation', 'morale, welfare and recreation', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0b3160ab-68c4-45ec-915a-bb9bdb90f80e'::UUID, 'PMC', 'Partially Mission Capable', 'Aircraft partially ready', 'general', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0b3b5641-523c-40f2-b37e-7e0a2fd365b1'::UUID, 'SOCOM', 'Special Operations Command', 'Special Operations Command', 'general', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0b633eea-8b19-4e46-9c85-42844ec193f2'::UUID, 'PBAC', 'Program and Budget Advisory Committee', 'Budget review committee', 'general', 'Financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0b92eba5-9e7d-41ef-a650-afb5a7247a7f'::UUID, 'LS', 'logistics specialist', 'logistics specialist', 'navy', 'Rating')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0b96e645-f3c1-421e-a08f-f4747149392b'::UUID, 'CONUS', 'continental United States', 'continental United States', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0b9c63c9-040c-45b8-a6d4-a291919c1d38'::UUID, 'CIC', 'Combat Information Center', 'Tactical operations center', 'navy', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0bcb2c5d-9ed2-4cc8-8b38-b0b0ec136d86'::UUID, 'PAFSC', 'primary specialty code', 'primary specialty code', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0c10f317-8dd7-421e-881d-2b0d38cbd428'::UUID, 'OCO', 'Offensive Cyber Operations', 'penetration testing and red team operations', 'general', 'cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0c359b06-05d5-4587-88b8-e6a1e1d33079'::UUID, 'USAREC', 'Army Recruiting Command', 'Army Recruiting Command', 'army', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0c462c74-f586-43ac-8008-7fd3e5023e60'::UUID, 'INSCOM', 'Intelligence and Security Command', 'Intelligence and Security Command', 'army', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0cb4c8ff-282a-4b95-9a36-f2fb1b20051a'::UUID, 'MEDEVAC', 'Medical Evacuation', 'emergency medical patient transport', 'general', 'medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0d24c34b-fc0d-4e0c-94a0-88117fff72ad'::UUID, 'CBT', 'computer-based training', 'computer-based training', 'general', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0d401cf9-d991-4176-bf87-91934c7c49e8'::UUID, 'CDO', 'command duty officer', 'command duty officer', 'navy', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0dc42444-d716-4ac3-b75a-12d243bc2896'::UUID, 'DIRNSA', 'Director, National Security Agency', 'Head of NSA', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0dd27a23-a304-410c-8006-2966efa9aa8f'::UUID, 'fantail', 'rear platform', 'rear platform', 'general', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0df2d270-4d43-44ea-8c08-4893511c6b13'::UUID, 'SOPS', 'Space Operations Squadron', 'Space Operations Squadron', 'ussf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0e069cf4-44b1-4dd4-8d90-3d4e4be5d490'::UUID, 'AWC', 'Army War College', 'Senior officer strategic school', 'army', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0e7056c9-cf66-490f-8181-aa4fbe50961c'::UUID, 'OAR', 'officer assignment record', 'officer assignment record', 'uscg', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0e92a400-5c51-4959-b679-d66894533fd3'::UUID, 'MTF', 'Medical Treatment Facility', 'healthcare facility', 'general', 'medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0e977a69-288e-4093-a69d-e975969f41a8'::UUID, 'FOB', 'forward operating base', 'forward operating base', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0eac96fb-96f6-45cb-8a68-b10cf44c521f'::UUID, 'POC', 'Point of Contact', 'Primary contact person', 'general', 'communication')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0ebf54f2-c0c4-4d35-b2cc-701fe97c13fa'::UUID, 'NJP', 'non-judicial punishment', 'non-judicial punishment', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0ec8eadc-42da-49a8-b067-3fa9b08f8f67'::UUID, 'ADCON', 'Administrative Control', 'Authority over unit administration', 'general', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0f1eb165-9dde-4787-a01b-294bf9b40e79'::UUID, 'MC', 'Mission Capable', 'aircraft available for operations', 'general', 'aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('0f38661b-2756-40e1-a787-cb986c30f3f2'::UUID, 'CAS', 'Close Air Support', 'aviation support for ground operations', 'general', 'aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('10844845-058f-4fc2-b51c-844792af03ae'::UUID, 'SAR', 'search and rescue', 'search and rescue', 'uscg', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('10b2a0fa-1776-4cb8-9f0e-c260bce60551'::UUID, 'chow hall', 'dining facility', 'dining facility', 'general', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('10ea74f5-2072-4d25-a62c-9ebc81bb784d'::UUID, 'billeting', 'lodging', 'lodging', 'general', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('10f23bc1-0ed7-483a-a42d-3b6d967d6fd4'::UUID, 'CDO', 'Command Duty Officer', 'Senior on-site manager (after hours)', 'navy', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1171238d-291e-4bbc-a148-ef02316ee249'::UUID, 'JCN', 'Job Control Number', 'Work order number', 'navy', 'technical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('117e1af8-030d-4417-987b-7cad04015442'::UUID, 'AOPS', 'assistant operations officer', 'assistant operations officer', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('11965dcc-aca7-41b1-b482-0e12cf7f11ae'::UUID, 'ESD', 'electronic systems division', 'electronic systems division', 'uscg', 'System')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('127b5d17-34b7-42f7-bbdf-00583ec294ee'::UUID, 'ASR', 'alternate supply route', 'alternate supply route', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('12a31acb-261d-4a22-b7e9-a3dba88d770c'::UUID, 'JWICS', 'Joint Worldwide Intelligence Communications System', 'Top secret network', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('12bcc8ee-cf01-4126-a81b-434999f0f4eb'::UUID, 'evolution', 'planned operation', 'planned operation', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('12be10fe-8712-43b6-93c5-c75335f6505e'::UUID, 'MACOM', 'Major Command', 'Major Army headquarters', 'army', 'organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('12e1ef33-9204-49a3-a454-22d3962f852b'::UUID, 'S-4', 'Logistics Section', 'Logistics/supply department', 'army', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('12e765e5-189f-4e2d-865b-567e4cd3b5a4'::UUID, 'FARP', 'Forward Arming and Refueling Point', 'Temporary aircraft service station', 'general', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('12e92cde-992a-4344-917d-8c85dea6f412'::UUID, 'CSM', 'command sergeant major', 'command sergeant major', 'army', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1375305b-2a2a-486c-8c61-c9d257c9448c'::UUID, 'NETC', 'Naval Education and Training Command', 'Navy training organization', 'navy', 'organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('13767303-57ee-474e-9984-3ea832b2e44d'::UUID, 'iPERMS', 'electronic personnel records', 'electronic personnel records', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('138d0156-fda9-4a02-ba26-2fa12be4a364'::UUID, 'liberty', 'time off', 'time off', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('13a7ccc1-cf4d-4f4a-96cd-e4e5ab86783f'::UUID, 'NWC', 'Naval War College', 'Senior officer strategic school', 'navy', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('13c04e84-f2c4-41bd-8107-5c254561d806'::UUID, 'SMSGT', 'senior master sergeant', 'senior master sergeant', 'usaf', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('13f1f21d-a6f9-4f57-a736-c8b402d9b5fb'::UUID, 'CASEVAC', 'casualty evacuation', 'casualty evacuation', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1403e960-6c1e-4c98-a0c5-f4fcb004db5f'::UUID, 'UCI', 'unit compliance inspection', 'unit compliance inspection', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('142c27ed-3cae-48db-b3c8-0660013c293c'::UUID, 'UNREP', 'Underway Replenishment', 'At-sea supply transfer operation', 'navy', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('14377be1-271a-4ce4-88bc-bd00949c2d03'::UUID, 'SABRS', 'Standard Accounting, Budgeting, and Reporting System', 'Marine Corps accounting system', 'usmc', 'Financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1515194e-2a72-4a8d-8140-7c73a7954d4b'::UUID, 'CND', 'Computer Network Defense', 'Network protection operations', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1516c45c-1878-4483-8df9-cc15792bf289'::UUID, 'DFAC', 'dining facility', 'dining facility', 'general', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('15283ba6-691b-4595-a57d-943b6886a2fd'::UUID, 'combat', 'operations', 'operations', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('15457cbc-e963-4094-a633-037eacb20a02'::UUID, 'XO', 'deputy director', 'deputy director', 'navy', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('15477aa6-5d3c-44fd-bc56-fb24973fe328'::UUID, 'eMILPO', 'personnel management system', 'personnel management system', 'army', 'System')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('15baad91-8e08-4b62-baeb-07d29dfa8b9c'::UUID, 'MSST', 'maritime security team', 'maritime security team', 'uscg', 'Security')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('15c8516b-e7c5-4717-9506-dc6a1c1781f3'::UUID, 'IA', 'individual augmentee', 'individual augmentee', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('15dd4086-0c76-4831-9eed-bebf641f7988'::UUID, 'CSSB', 'Combat Sustainment Support Battalion', 'Army logistics battalion', 'army', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('15ddcd14-8355-4900-9131-eaedc07d885e'::UUID, 'HHC', 'headquarters company', 'headquarters company', 'army', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('16780eff-b03e-4364-9a36-4250b9e048d1'::UUID, 'CNATT', 'Center for Naval Aviation Technical Training', 'Navy aviation maintenance school', 'navy', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('16df7854-839f-4fec-9ab7-f7eb5f8dc8c4'::UUID, 'CNAP', 'Commander, Naval Air Forces Pacific', 'West Coast naval aviation headquarters', 'navy', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('16f91f0f-78fe-4a80-a793-42d79546044f'::UUID, 'MRC', 'Maintenance Requirement Card', 'Maintenance work instruction', 'navy', 'technical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('16fefa54-870f-4389-92bb-a09b5713d6b4'::UUID, 'A1C', 'airman first class', 'airman first class', 'usaf', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1756a781-d868-4894-9fca-2450f3659595'::UUID, 'STANFINS', 'Standard Finance System', 'Army accounting system', 'army', 'Financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('176abbbb-ed69-4720-8fba-a79a6510a2fc'::UUID, 'materiel', 'supplies and equipment', 'supplies and equipment', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1815c965-f52c-4ee8-a765-e5801c25124c'::UUID, 'EOOW', 'Engineering Officer of the Watch', 'Engineering operations shift supervisor', 'navy', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('182cc39e-5eec-4e56-893d-b471f8754c31'::UUID, 'SIPR', 'Secret Internet Protocol Router', 'classified network', 'general', 'cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('18452664-d626-4b71-897b-258571488bbe'::UUID, 'MEO', 'military equal opportunity', 'military equal opportunity', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('189f3a81-3a90-4e51-b31e-91ea7375b671'::UUID, 'NCO', 'non-commissioned officer', 'non-commissioned officer', 'army', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('18a2376a-58e4-4846-bc54-347f0e89851c'::UUID, 'NMCI', 'Navy Marine Corps Intranet', 'Enterprise network infrastructure', 'navy', 'technical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('18b19f6d-281f-44d8-9ba5-f8050efde756'::UUID, 'commissary', 'grocery store', 'grocery store', 'general', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('19382214-d8dc-4892-92a8-9acbda5fbf66'::UUID, 'TPFDD', 'Time-Phased Force and Deployment Data', 'deployment scheduling and resource plan', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('19476785-774e-4719-82cd-feefdeb8f679'::UUID, 'MSGT', 'master sergeant', 'master sergeant', 'usaf', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('19803cb1-d5c2-4b06-a251-d45364a589ec'::UUID, 'MARFORCYBER', 'Marine Forces Cyberspace Command', 'Marine Corps cyber operations', 'usmc', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('19a84fbf-f4f9-4798-a457-8b7c137c1592'::UUID, 'LOC', 'Lines of Communication', 'supply and communication routes', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('19bb4298-6fe6-4c52-a03f-672a3caca691'::UUID, 'S-2', 'Intelligence Section', 'Intelligence department', 'army', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1a1e1b80-8dfe-49ab-b78f-37e8da1de52f'::UUID, 'ordnance', 'weapons/ammunition', 'weapons/ammunition', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1a8f3259-35c4-46de-9410-1f1d96c3ab28'::UUID, 'FISC', 'fleet industrial supply center', 'fleet industrial supply center', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1abb9e69-d8fe-4080-bcac-75cdd17fbfdd'::UUID, 'SPC', 'specialist', 'specialist', 'army', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1af04336-1e90-4fdb-b3ba-542fba877bb4'::UUID, 'NAI', 'Named Area of Interest', 'Geographic area designated for surveillance', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1b84a425-3722-47da-8bb7-8f41d062156a'::UUID, 'NMP', 'Navy Manning Plan', 'Navy staffing document', 'navy', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1c093c0a-3085-4f44-aa40-45286564eb32'::UUID, 'SES', 'Senior Executive Service', 'Federal civilian senior leadership tier', 'general', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1c209f63-86fd-4df6-979a-ffb83bb5aa84'::UUID, 'ACC', 'Air Combat Command', 'Air Combat Command', 'usaf', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1c689a50-b441-4e10-a879-cf76ca7d19a8'::UUID, 'FIS', 'Foreign Intelligence Service', 'Foreign nation''s intelligence agency', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1cb8f964-331d-428e-b55c-b8da9d23f5e7'::UUID, 'GPS', 'Global Positioning System', 'Satellite navigation system', 'general', 'Space')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1ce075f4-cefe-408f-992d-b3b17462a9c7'::UUID, 'CDM', 'Continuous Diagnostics and Mitigation', 'Ongoing security monitoring program', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1cf6b7dc-1785-4c82-b11c-d7c6e0505f86'::UUID, 'QAE', 'Quality Assurance Evaluator', 'Construction quality inspector', 'general', 'Engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1d1ddba1-d245-40cd-8a7e-2a596f11931f'::UUID, 'PRDA', 'Personnel Records Display Application', 'Air Force digital personnel file', 'usaf', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1d7132e9-1493-4f0b-af52-150cf13b018f'::UUID, 'head', 'restroom', 'restroom', 'general', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1e0f773d-3d78-490d-8b5c-2d60e606110e'::UUID, 'PACOM', 'Pacific Command', 'Pacific Command', 'general', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1e231536-e59f-4893-b3d7-8572eba3632a'::UUID, 'NSTC', 'Naval Service Training Command', 'Navy recruit and officer training', 'navy', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1e253bfc-84de-4313-9c42-ebb53a652b2a'::UUID, 'CAS', 'Close Air Support', 'Direct air assistance to ground forces', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1e548e6f-44d2-4b1d-b514-11f247a6d8e5'::UUID, 'TDY', 'temporary duty assignment', 'temporary duty assignment', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1e61b618-688f-4e3d-94f6-71f44afb13a1'::UUID, 'ALC', 'Advanced Leader Course', 'Mid-level supervisor course', 'army', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1e6afda5-cdd9-44f6-bb00-39695da728a9'::UUID, 'ISSM', 'Information System Security Manager', 'Cybersecurity program manager', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1ecdb85d-ab8a-4d7b-89bf-29980a9760ff'::UUID, 'DRRS-S', 'Defense Readiness Reporting System-Strategic', 'Strategic readiness reporting', 'general', 'compliance')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('1fb9b42f-f6b9-4cbc-9710-07805c80a187'::UUID, 'CONOP', 'Concept of Operations', 'operational concept plan', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('20247154-232d-481c-873a-e8760ad51fa7'::UUID, 'NETC', 'Naval Education and Training Command', 'Navy training headquarters', 'navy', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('205b4747-931c-48e6-afd3-a180e0a729c2'::UUID, 'Sailors', 'personnel', 'personnel', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('20b86785-163d-4e81-84cb-98600ccc8929'::UUID, 'GMT', 'mandatory training', 'mandatory training', 'general', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('21c52a76-0738-4c75-83cc-9204f2334279'::UUID, 'TECOM', 'Training and Education Command', 'Marine Corps training headquarters', 'usmc', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('22067154-69b4-4e8d-afd6-ec6092d92869'::UUID, 'NCIS', 'Naval Criminal Investigative Service', 'Navy/Marine Corps law enforcement and CI agency', 'navy', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('225ca650-ff19-4db3-8767-464f2e453c9c'::UUID, 'SORTS', 'Status of Resources and Training System', 'Readiness reporting system', 'general', 'compliance')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('22633636-eed9-4245-9b6b-6160181ef564'::UUID, 'IAVA', 'Information Assurance Vulnerability Alert', 'critical security patch notification', 'general', 'cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2273b3ee-3e0d-49cb-abc9-0ef1ee9ebe6b'::UUID, 'NAVLEAD', 'Navy Leadership Development', 'Leadership course', 'navy', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('22ab89e2-33b4-4c4b-ac35-b7742985fe43'::UUID, 'SIGACT', 'Significant Activity', 'noteworthy event or incident', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('22ad3834-ebdb-49b7-8500-2377a5f1f46e'::UUID, 'IOC', 'Infantry Officer Course', 'Infantry Officer Course', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('22c51db8-a5b1-4912-b33c-5b8124e235b8'::UUID, 'AMN', 'airman', 'airman', 'usaf', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('22db9e4e-642e-4d99-a046-e143eac51100'::UUID, 'CACO', 'casualty assistance officer', 'casualty assistance officer', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('22dcf6a5-04e7-4b7e-90a0-de142fed83ab'::UUID, 'AFIMS', 'information management system', 'information management system', 'usaf', 'System')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2318b7b2-4f40-4b6c-abcb-b6719fc6d446'::UUID, 'MISLE', 'marine information system', 'marine information system', 'uscg', 'System')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('23ad8274-8013-4c86-8ed7-1924e699db34'::UUID, 'PS', 'personnel specialist', 'personnel specialist', 'navy', 'Rating')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('247cd4a1-a015-40c5-9374-ec7b306ab384'::UUID, 'FHP', 'Force Health Protection', 'Preventive medicine and readiness program', 'general', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('247dea33-c09e-4b28-8321-2cb979d7a77f'::UUID, 'Soldiers', 'personnel', 'personnel', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('24bcdfe7-8643-476d-a137-f2e684edefaa'::UUID, 'USACE', 'Army Corps of Engineers', 'Army Corps of Engineers', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('25306328-2da3-4bfe-b8c3-4a7afc210420'::UUID, 'SOS', 'Squadron Officer School', 'Squadron Officer School', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('255575ab-c212-460c-8a9c-f0815af2ab53'::UUID, 'JDAM', 'Joint Direct Attack Munition', 'GPS-guided precision weapon', 'general', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2569ba53-c6f3-4dd0-867e-7a92c2dbd200'::UUID, 'J3', 'joint operations', 'joint operations', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('25b65da9-eab0-42a6-a447-6d345d7e7d02'::UUID, 'CNO', 'Chief of Naval Operations', 'Highest ranking Navy officer', 'navy', 'organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2625f491-6a19-4231-9f79-5768b495a3c4'::UUID, 'DCO', 'Defensive Cyber Operations', 'cybersecurity defense operations', 'general', 'cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('27238498-73a2-48ab-aa5c-b83d84a7556a'::UUID, 'TI', 'technical inspection', 'technical inspection', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('277b65e3-b567-4e02-88b4-c348f4859977'::UUID, 'ISSO', 'Information System Security Officer', 'System-level security administrator', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('27a96e36-ef93-41e1-86d8-32d97ae240e9'::UUID, 'TCCC', 'Tactical Combat Casualty Care', 'Battlefield emergency medical training', 'general', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('27f304b3-f9b3-4be9-bd2a-752f71d69aa1'::UUID, 'UCI', 'Unit Compliance Inspection', 'Air Force compliance audit', 'usaf', 'compliance')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('27f63ff8-8c72-4c72-9fc7-b521c9a2bc7a'::UUID, 'IEM', 'equipment inspection', 'equipment inspection', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('283c5e10-430e-4c6c-aa63-d3e4698b5dd7'::UUID, 'OPLAN', 'Operations Plan', 'comprehensive operations plan', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2844f227-bd3a-402b-8425-e2fda72c2ac7'::UUID, 'FCLP', 'Field Carrier Landing Practice', 'aircraft carrier landing training', 'navy', 'aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('292e163f-4e1f-4358-9f19-466c1095b543'::UUID, 'CIC', 'operations center', 'operations center', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('297a199c-eed0-4065-ab4a-bcec42763142'::UUID, 'OCONUS', 'overseas', 'overseas', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('29b921b8-d7f9-4f0c-a9cc-b2bbb28abe68'::UUID, 'SGLI', 'service member life insurance', 'service member life insurance', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('29f006e7-a264-4514-bffa-bd8ba2882f46'::UUID, 'ISR', 'Intelligence Surveillance Reconnaissance', 'Information gathering and monitoring', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2a958971-e6f3-4b4f-8f99-74637df5a432'::UUID, 'NEC', 'specialty code', 'specialty code', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2abccf8f-86aa-4a31-a37c-ab9790f304cf'::UUID, 'FRAGO', 'Fragmentary Order', 'Operational update/amendment', 'general', 'communication')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2b66b4a4-5a07-4791-b1c9-824a061d56fd'::UUID, 'SITREP', 'Situation Report', 'Status update/report', 'general', 'communication')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2b87df20-1e3e-4b12-9196-69b2d7115b9b'::UUID, 'NSpC', 'National Space Council', 'White House space policy coordination', 'general', 'Space')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2bca2688-a724-486f-a0a1-2ae3ff230a96'::UUID, 'GMTI', 'Ground Moving Target Indicator', 'Radar-based ground movement detection', 'general', 'Space')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2be5843c-a904-49bb-bbb8-e006a6204ee5'::UUID, 'FIAR', 'Financial Improvement and Audit Remediation', 'Financial audit compliance program', 'general', 'Financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2bf30f84-6458-4e49-8871-6fe5d3999c5b'::UUID, 'MEPS', 'Military Entrance Processing Station', 'Military recruitment medical screening facility', 'general', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2c0337b0-aee5-4b8d-870c-a1cf439bbfe5'::UUID, 'OMMS-NG', 'Organizational Maintenance Management System-Next Generation', 'Maintenance management software', 'navy', 'technical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2c874f8c-7a63-4377-81ab-5663782dd2ca'::UUID, 'NC', 'career counselor', 'career counselor', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2cc9a88b-b419-4e60-91fe-2bb1317d7ea5'::UUID, 'CAG', 'Commander Air Group', 'air wing commander', 'navy', 'aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2d4405bb-9788-43a3-b478-6361585ea9f5'::UUID, 'PDHA', 'Post-Deployment Health Assessment', 'Return-from-deployment medical screening', 'general', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2d587278-1f7f-4a8f-9238-8923c6f1cb46'::UUID, 'DCA', 'safety officer', 'safety officer', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2d7b4ae6-a764-4636-8d48-56f30c1c82f4'::UUID, 'NEPA', 'National Environmental Policy Act', 'Environmental impact review law', 'general', 'Engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2d8ef65b-8ca8-4fb3-b719-deeee77a0217'::UUID, 'SFS', 'security forces squadron', 'security forces squadron', 'usaf', 'Security')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2dc52caf-b3c3-427f-aa0e-4438d3fd0822'::UUID, 'IC', 'Intelligence Community', 'All U.S. intelligence agencies collectively', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2dcd2cd2-8040-4aa2-ab0f-0f1b2cc35d6f'::UUID, 'SSE', 'Senior Service Education', 'executive leadership development program', 'general', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2ddc0038-068b-44dc-89bf-ba71a5baac86'::UUID, 'OPFOR', 'opposing force', 'opposing force', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2e55b45f-2c80-4925-be58-2b1299007da1'::UUID, 'INTSUM', 'Intelligence Summary', 'Periodic intelligence briefing document', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2ed8a5dd-e36a-4ff0-a6c0-0e3e500eaa54'::UUID, 'UTC', 'unit type code', 'unit type code', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2ee3e6ea-da37-4442-92b7-b792357c840e'::UUID, 'MAGTF', 'Marine Air-Ground Task Force', 'Marine Air-Ground Task Force', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2f9ca0a8-5b8b-4791-acfe-c10599f88da0'::UUID, 'MTOE', 'Modified Table of Organization and Equipment', 'Operational unit structure and equipment list', 'army', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2fc481fc-6923-4427-afb0-f33baa16aa90'::UUID, 'vMPF', 'Virtual Military Personnel Flight', 'Air Force online HR portal', 'usaf', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2fcd8c8d-a32a-424a-8d45-f029a3f0d0fe'::UUID, 'DESRON', 'destroyer squadron', 'destroyer squadron', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2fd2c0bb-9a4c-4928-b0b9-cb7456d57f2e'::UUID, 'ASG', 'Area Support Group', 'Regional logistics support unit', 'army', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2fdd0214-efb6-483e-bc15-de21fa54ef27'::UUID, 'DA', 'Department of the Army', 'Department of the Army', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('2fe30ca1-c80f-4b90-8da2-b5d7fa216818'::UUID, 'PPBE', 'Planning, Programming, Budgeting, and Execution', 'DoD budget lifecycle process', 'general', 'Financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3044a66e-dced-4d90-9bbd-bda57182ac5f'::UUID, 'CUI', 'controlled unclassified information', 'controlled unclassified information', 'general', 'Security')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('304fe971-6a28-4c38-802a-8d184fab8f81'::UUID, 'VAW', 'Carrier Airborne Early Warning Squadron', 'Navy E-2 Hawkeye squadron', 'navy', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('30a60f05-4fec-45b1-8bff-b0588adc244c'::UUID, 'ATON', 'aids to navigation', 'aids to navigation', 'uscg', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('30ce857d-0c7e-4a03-b66d-78d7494c9892'::UUID, 'IPB', 'Intelligence Preparation of the Battlefield', 'Operational environment analysis', 'army', 'planning')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('30e57655-0606-4e1d-b6ae-b9327f72df72'::UUID, 'BUPERS', 'Bureau of Naval Personnel', 'Navy human resources headquarters', 'navy', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('312f09f8-5efa-48a2-a0cb-11e7cf6cd08c'::UUID, 'OSA', 'Overseas Service Award', 'Recognition for overseas assignment', 'general', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('31c1d12a-d353-4527-8cda-c33433e11699'::UUID, 'enlisted', 'staff', 'staff', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('31fee4be-0957-4421-b08b-93793b77fa98'::UUID, 'BM', 'boatswain''s mate', 'boatswain''s mate', 'navy', 'Rating')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3203b6d6-eeb2-42f8-9716-eba0a77251e1'::UUID, 'PCS', 'Permanent Change of Station', 'Organizational relocation/transfer', 'general', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('327d5aef-55c8-4331-93f6-6f9e13440476'::UUID, 'MHS', 'Military Health System', 'DoD healthcare system', 'general', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('32a84524-0d41-4cc0-8ff2-ced7d18b4c71'::UUID, 'PVT', 'private', 'private', 'army', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('32ad42be-ab89-44f2-8dc2-a5b735c0593e'::UUID, 'ATC', 'training center', 'training center', 'uscg', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('32b4a645-c31a-461c-95b8-b91503884253'::UUID, 'JCN', 'work order', 'work order', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('32c0e51c-4eec-42b6-9df8-e9173c280d48'::UUID, 'ILE', 'Intermediate Level Education', 'Field grade officer school', 'army', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('32d86f47-3e9c-4dd6-bfda-46d88f4bd96d'::UUID, 'MFP', 'Major Force Program', 'Major budget category', 'general', 'Financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('331634ce-8cb2-4208-8bc6-d2553cff4ca5'::UUID, 'DES', 'Disability Evaluation System', 'Military disability processing system', 'general', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('33256384-73f5-4274-8009-84c395a4b489'::UUID, 'drill', 'training exercise', 'training exercise', 'general', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('341a0cdd-488b-4fc2-ac98-ad852142d316'::UUID, 'CES', 'civil engineering squadron', 'civil engineering squadron', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('343475ac-710a-4f42-a270-ab7d4e6c9880'::UUID, 'NAVSEA', 'naval systems command', 'naval systems command', 'navy', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('34cc2c20-f56b-4b53-9468-4f0ae248dcac'::UUID, 'NAVFIT', 'performance evaluation system', 'performance evaluation system', 'navy', 'System')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3557fa23-2f7a-4110-902f-5ca73a56d912'::UUID, 'MXG', 'maintenance group', 'maintenance group', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3596e584-de22-4b72-9506-c9fbdb0c8721'::UUID, 'CONEX', 'Container Express', 'Shipping container / storage container', 'general', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('35f1ba21-57ce-42ea-ba0a-fe13f3b3917e'::UUID, 'DOS', 'date of separation', 'date of separation', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3648952f-d512-46cc-9c59-1d3e3c118df6'::UUID, 'ISSO', 'Information System Security Officer', 'information security officer', 'general', 'cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('365a95cf-9305-4c18-861c-b741cb2ea0a2'::UUID, 'GSM', 'gas turbine systems mechanic', 'gas turbine systems mechanic', 'navy', 'Rating')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3743d5d6-dfd4-4e02-86c9-de0b8454ca98'::UUID, 'HUD', 'Heads-Up Display', 'Transparent flight data display', 'general', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('37a9ec9c-3798-42ca-964f-ea5026e584b0'::UUID, 'EXORD', 'execute order', 'execute order', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('37e6fde9-434a-4b3a-b037-09ff9c2d22fb'::UUID, 'STARCOM', 'Space Training and Readiness Command', 'Space Training and Readiness Command', 'ussf', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3823532e-0951-4377-b8f9-148c356a7143'::UUID, 'vMPF', 'virtual personnel center', 'virtual personnel center', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('382be9b8-5d7e-47f2-b0f7-244394adea6a'::UUID, 'FSO', 'facility security officer', 'facility security officer', 'general', 'Security')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3873d3bd-b2ef-4333-8ba5-5a96345c3d75'::UUID, 'NCTC', 'National Counterterrorism Center', 'Counterterrorism analysis and planning center', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3a138eaa-cd90-4f61-8d28-c4b1d69eaa97'::UUID, 'SRB', 'Service Record Book', 'Personnel file', 'navy', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3a2cb01f-1119-44bf-ad61-c61133723647'::UUID, 'ROICC', 'Resident Officer in Charge of Construction', 'Government construction manager', 'navy', 'Engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3a8a5f44-fdbf-459a-b174-f282120f98ab'::UUID, 'NRO', 'National Reconnaissance Office', 'Satellite intelligence agency', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3b209e6b-40be-47b0-a4e5-93e68327822b'::UUID, 'NAVSUP', 'supply command', 'supply command', 'navy', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3b2aef69-9bcd-4754-9a89-f2c2d134f4df'::UUID, 'FEAD', 'Facilities Engineering Activity Detail', 'Engineering project management team', 'general', 'Engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3b935995-5148-43e8-b139-bae79d223ccd'::UUID, 'CID', 'Criminal Investigation Division', 'Army law enforcement agency', 'army', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3c9573b8-dfce-4d57-956f-0edfc8b26a04'::UUID, 'RFI', 'Request for Information', 'Contractor question during construction', 'general', 'Engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3cf6e1fd-da92-41e2-9106-734b3d43cc3c'::UUID, 'MARDIV', 'Marine Division', 'Marine Division', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3d15b405-4aa9-4b81-841c-7212ff46a02e'::UUID, 'SAEDA', 'Subversion and Espionage Directed Against the Army', 'Insider threat reporting program', 'army', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3d632ac9-fbed-4b14-b78f-2bb46e56afb1'::UUID, 'NAVSEA', 'Naval Sea Systems Command', 'Navy shipbuilding and maintenance command', 'navy', 'organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3d98d584-3227-408d-84c0-92ca25ef777a'::UUID, 'VA', 'Veterans Affairs', 'Veterans Affairs', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3da7a57f-b246-4f72-b33a-69ce71df61ee'::UUID, 'VQ', 'Fleet Air Reconnaissance Squadron', 'Navy signals collection squadron', 'navy', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3dbe94db-f191-4528-a15d-e64b89bbe709'::UUID, 'PCS', 'permanent relocation', 'permanent relocation', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3df79548-9611-4c25-8ade-cd00100f73fd'::UUID, 'BAS', 'Basic Allowance for Subsistence', 'Food allowance', 'general', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3e0569f6-1f39-4c5e-860a-ce9beca5621e'::UUID, 'COLA', 'cost of living allowance', 'cost of living allowance', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3e2f493a-993e-478b-9319-f01b17995d98'::UUID, 'NATOPS', 'Naval Air Training and Operating Procedures Standardization', 'aviation standardization and safety procedures', 'navy', 'aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3eae8bb8-0e7a-4e3e-a569-4d41353d7b54'::UUID, 'SALUTE', 'threat report format', 'threat report format', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3ebf8302-4bee-4eb1-8483-9737c6e762f8'::UUID, 'MPA', 'main propulsion assistant', 'main propulsion assistant', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3f09e8de-b01c-4759-b034-f4f13a14d71e'::UUID, 'ROTC', 'Reserve Officers Training Corps', 'College-based officer commissioning', 'general', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3f32533e-3bc9-4b1b-a040-18fb5e129341'::UUID, 'PRT', 'physical readiness test', 'physical readiness test', 'navy', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3fa469b1-8438-4dd8-92f5-c522d78ffb57'::UUID, 'NAV', 'navigator', 'navigator', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3fae3597-bf3e-4068-90dd-665c8aa55188'::UUID, 'TBS', 'The Basic School', 'The Basic School', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('3ff36199-ff39-419d-9e01-a6b6e827f4f7'::UUID, 'DCIS', 'Defense Criminal Investigative Service', 'DoD inspector general investigative arm', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4069e115-433e-4212-a569-e7beba70b4da'::UUID, 'AFOSI', 'Air Force Office of Special Investigations', 'Air Force law enforcement and CI agency', 'usaf', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('408787b9-d5f5-4577-8c55-ea1e1a396515'::UUID, 'IMINT', 'Imagery Intelligence', 'satellite and aerial imagery analysis', 'general', 'intel')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('40c7737f-28fb-4038-9ba3-b352fedd7040'::UUID, 'ISR', 'Intelligence, Surveillance, and Reconnaissance', 'intelligence collection and monitoring operations', 'general', 'intel')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('41495506-9eb2-4fdc-969d-55043ac47a73'::UUID, 'sailors', 'personnel', 'personnel', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('418578d9-b461-47e1-9536-fc390f112991'::UUID, 'OPORD', 'Operations Order', 'Operational execution plan', 'general', 'communication')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('41c8e804-345a-406b-92cf-9f4b6f8b70a1'::UUID, 'DEERS', 'Defense Enrollment Eligibility Reporting System', 'Military benefits eligibility database', 'general', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('42547130-938c-4917-b8c8-ccb17844a458'::UUID, 'ROE', 'rules of engagement', 'rules of engagement', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('42e146c9-697e-48f8-82fb-afc49d392406'::UUID, 'CBRN', 'chemical/biological/radiological/nuclear defense', 'chemical/biological/radiological/nuclear defense', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('42ef73fb-c16a-4cd9-b46a-d4e092da360e'::UUID, 'JOPES', 'Joint Operation Planning and Execution System', 'enterprise operations planning system', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('42f12c70-aac1-4d6a-ab27-d4e06420cb90'::UUID, 'USMA', 'United States Military Academy', 'West Point', 'army', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('42f2ebca-3483-4acf-b618-631b2805557e'::UUID, 'CPT', 'Cyber Protection Team', 'Defensive cybersecurity unit', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('42f6c711-66ae-40f6-97c3-42da74b98b07'::UUID, 'NMEC', 'National Media Exploitation Center', 'Captured materials analysis center', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('43009f59-c852-4f16-8530-3091fa7df8d3'::UUID, 'METL', 'Mission Essential Task List', 'Core competency requirements', 'general', 'compliance')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('434105d8-2d56-4426-b1de-491cd2196e59'::UUID, 'FTX', 'field training exercise', 'field training exercise', 'army', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('43444c18-b909-405c-9849-0b6aff5a5339'::UUID, 'SIGINT', 'Signals Intelligence', 'Communications intelligence analysis', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('436d20f0-514c-461a-9e18-28a9aea21716'::UUID, 'OG', 'operations group', 'operations group', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('43a1ce0e-9620-40f8-b60a-274ea66840d4'::UUID, 'CSpOC', 'Combined Space Operations Center', 'Combined Space Operations Center', 'ussf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('43a5b7e8-0bd9-4942-83de-69662b44b8cb'::UUID, 'MIA', 'missing in action', 'missing in action', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('43a7618f-bb38-4d0d-a678-23bb27a54b18'::UUID, 'AMC', 'Army Materiel Command', 'Army Materiel Command', 'army', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('43b79e51-9a61-4747-8b68-45adc6b23914'::UUID, 'DCPO', 'maintenance supervisor', 'maintenance supervisor', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('43df2c6c-05f2-43f4-8ac4-00e1abf927ad'::UUID, 'MEF', 'Marine Expeditionary Force', 'Marine Expeditionary Force', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('442f41d4-0bde-4b0b-b812-0ecd0128ea9a'::UUID, 'MSG', 'mission support group', 'mission support group', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('448729e5-d21a-4ffb-ab44-04e86f5a3373'::UUID, 'VMFA', 'Marine Fighter Attack Squadron', 'Marine Fighter Attack Squadron', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('44ae7408-3605-41cd-a8ad-f3458c0b3e1f'::UUID, 'MASINT', 'Measurement and Signature Intelligence', 'technical measurement and analysis', 'general', 'intel')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('44b20cf1-5a46-4982-a157-4b4a6e84c991'::UUID, 'Airman', 'team member', 'team member', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('44b73ef9-bd70-4842-943f-0689d0fd24d4'::UUID, 'J-6', 'Joint Communications', 'Joint IT/communications staff', 'general', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('45008dbc-78c9-4f56-8fac-174501487a75'::UUID, 'BCD', 'Base Civil Development', 'Installation construction planning', 'general', 'Engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('45bc8718-02f0-4b23-87cc-a12f34581864'::UUID, 'passageway', 'hallway', 'hallway', 'general', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('45f36f69-b181-4ce0-9a51-cfe2f2f84c9a'::UUID, 'OJT', 'on-the-job training', 'on-the-job training', 'general', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('463fd687-9080-43e7-a439-18274067fcb2'::UUID, 'readiness', 'operational preparedness', 'operational preparedness', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('465ec945-9b86-4027-bfab-3a9f2fff628a'::UUID, 'GCSS-A', 'Global Combat Support System - Army', 'enterprise logistics management system', 'army', 'logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('46620dfd-8cf8-40ff-83db-7abb175604f0'::UUID, 'SNCOA', 'Senior NCO Academy', 'Senior enlisted professional school', 'usaf', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('46f62314-e8cd-442b-8087-1072d3a5f101'::UUID, 'CCIR', 'Commanders Critical Information Requirements', 'Priority information needs', 'general', 'planning')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('47b5f0bc-6c23-4f2c-bdeb-4d1d0831d58e'::UUID, 'JSS', 'joint security station', 'joint security station', 'army', 'Security')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('47dccec3-931d-40c6-9ad9-7fb29e5bcc4b'::UUID, 'CSSP', 'Cybersecurity Service Provider', 'Managed security operations provider', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('47e38b60-28e3-4e79-a961-748d78144a30'::UUID, 'NMC', 'Non-Mission Capable', 'equipment out of service', 'general', 'logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('47e60d3a-c6d7-49dd-9026-92f7125327bf'::UUID, 'LAD', 'Latest Arrival Date', 'Final acceptable delivery date', 'general', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('48499d74-227a-4eb0-ba4b-3e6015e9a5b3'::UUID, 'DFAS', 'finance and accounting', 'finance and accounting', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4875b3b9-1812-41d3-a22d-9a194dff6c25'::UUID, 'AFRC', 'Air Force Reserve Command', 'Air Force Reserve Command', 'usaf', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('488d12a7-19ec-40ea-85d1-d9ce0bd00f3a'::UUID, 'BDA', 'Battle Damage Assessment', 'impact assessment', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4928ccdb-4c31-4d07-9edb-b22b3e2dbc4f'::UUID, 'CASEVAC', 'Casualty Evacuation', 'Emergency medical transport', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('492a4435-716f-49ca-aef9-63124bfa230c'::UUID, 'CCIR', 'Commander Critical Information Requirements', 'executive priority information needs', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('496e16bc-1d5b-4dbe-93b1-260768c5c3e7'::UUID, 'AGM', 'Air-to-Ground Missile', 'Aircraft-launched surface attack missile', 'general', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('49b769c0-3e20-4d0f-8cb6-6884d0949307'::UUID, 'SOP', 'standard operating procedure', 'standard operating procedure', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4a14555f-0254-493f-8869-da6237766c09'::UUID, 'PROFIS', 'Professional Officer Filler Information System', 'Medical officer deployment assignment system', 'army', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4a2422f1-29aa-4c5b-b858-9ef85b0dc866'::UUID, 'SSC', 'Space Systems Command', 'Space Systems Command', 'ussf', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4a25936c-24e2-4439-82df-f6ad403c8f22'::UUID, 'J1', 'joint personnel', 'joint personnel', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4a59717f-834f-48a2-b6b0-720939c17cd8'::UUID, 'SRTS', 'Sailor Readiness Tracking System', 'Navy individual readiness database', 'navy', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4aad26a9-17c4-452b-a882-a6f979927f45'::UUID, 'GCM', 'general court-martial', 'general court-martial', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4ab7f428-4811-4f0b-86a2-14f14c8fb335'::UUID, 'NGIC', 'National Ground Intelligence Center', 'Army ground threat analysis center', 'army', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4ac7529a-5689-4b0a-ba1f-3fe40f72c05b'::UUID, 'PMO', 'provost marshal office', 'provost marshal office', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4adc62ed-0549-4197-a5d6-45e2ee93fa10'::UUID, 'op tempo', 'operational pace', 'operational pace', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4b2cafdd-7523-4d4f-8ae3-c4bf02c7cf2c'::UUID, 'MCIA', 'Marine Corps Intelligence Activity', 'Marine Corps intelligence center', 'usmc', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4b30ba43-bc04-4dbf-8b92-f106b53e1007'::UUID, 'HRC', 'Human Resources Command', 'Army HR headquarters', 'army', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4b88201e-ec90-4ec5-bfc0-26d94de447ec'::UUID, 'USR', 'unit status report', 'unit status report', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4be996bd-0a1d-4edf-acb2-bb15dad1d518'::UUID, 'PACAF', 'Pacific Air Forces', 'Pacific Air Forces', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4bf1e84a-1b19-477d-8bc2-1d96fdbd59e7'::UUID, 'CASREP', 'equipment casualty report', 'equipment casualty report', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4bf22ddf-e1c1-460a-849f-9c6d57df1844'::UUID, 'UDM', 'unit deployment manager', 'unit deployment manager', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4c242bcf-a663-43be-8dff-0705d44a189b'::UUID, 'EN', 'engineman', 'engineman', 'navy', 'Rating')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4c4f2413-01ee-4385-bfe3-0ba63549f4f1'::UUID, 'ORB', 'Officer Record Brief', 'Officer personnel summary', 'army', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4c58dc69-d621-4d3b-a938-31200c3cd9b6'::UUID, 'ISSM', 'Information System Security Manager', 'information security manager', 'general', 'cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4d08f14c-e698-449c-a315-7d63fe72d71f'::UUID, 'POM', 'Program Objective Memorandum', 'multi-year budget planning document', 'general', 'financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4d8f67f2-5847-4204-87d1-1ae25edffac9'::UUID, 'LOGCAP', 'Logistics Civil Augmentation Program', 'Contracted logistics support program', 'army', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4d93e119-b603-48d5-a5be-3d87d36d31f7'::UUID, 'PSR', 'Personnel Status Report', 'Manning/staffing report', 'general', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4dbdc181-8aa1-49aa-b039-161c172a3b6a'::UUID, 'MOPP', 'Mission Oriented Protective Posture', 'HAZMAT/CBRN protection level', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4dd8c5d7-1c1c-401d-bd3b-2bea2ed09ba7'::UUID, 'LSO', 'Landing Signal Officer', 'aircraft landing safety supervisor', 'navy', 'aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4eddafad-2baa-49ce-b9e7-226d59b20e50'::UUID, 'UFR', 'Unfunded Requirements', 'supplemental budget requests', 'general', 'financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4ede93e3-c22e-42e5-b375-bf3e65564ff0'::UUID, 'MILVAN', 'Military Van', 'Military-standard shipping container', 'general', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4ef13b78-7143-443a-b61a-b6a07a7247c8'::UUID, 'HMLA', 'Marine Light Attack Helicopter Squadron', 'Marine Light Attack Helicopter Squadron', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4f3bb0bd-c11e-4ad8-9a3d-7701f9e449fd'::UUID, 'MUOS', 'Mobile User Objective System', 'Next-gen narrowband military satellite', 'general', 'Space')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4f4fafc9-ad75-4849-94ee-8242a6530d4a'::UUID, 'UXO', 'unexploded ordnance', 'unexploded ordnance', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4f71a18e-acce-4f65-88b8-739f0805b19f'::UUID, 'CCRI', 'Command Cyber Readiness Inspection', 'Cybersecurity compliance audit', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4f8844a8-ea6a-44ba-a516-c45618289e76'::UUID, 'FLT', 'flight', 'flight', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4f89abda-2426-447a-98ca-f3aa66ee85f3'::UUID, 'AR', 'Army regulation', 'Army regulation', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('4fc5c19c-b090-4dfd-a9ea-229623c13e32'::UUID, 'S-3', 'Operations Section', 'Operations department', 'army', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5022fbdc-9874-4560-9bae-22029eae19bb'::UUID, 'NAVAIR', 'naval aviation systems', 'naval aviation systems', 'navy', 'System')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5067d180-24e8-498b-8dfb-f810de282a87'::UUID, 'FLTCYBER', 'Fleet Cyber Command', 'Navy cybersecurity operations command', 'navy', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('50ac514c-524d-4799-be2b-18e5919a3b99'::UUID, 'MCAS', 'Marine Corps Air Station', 'Marine Corps Air Station', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('50d90c69-1057-45b7-bef0-9e58faaf8e7f'::UUID, 'ILE', 'Intermediate Level Education', 'Mid-career military education', 'army', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5142668a-295b-4378-81d8-4984ddd98bd6'::UUID, 'TAPS', 'transition assistance program', 'transition assistance program', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5145f533-9110-4453-80c8-14610c4c618c'::UUID, 'usmc', 'personnel', 'personnel', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('51bfc10d-de73-498b-a284-c3c551dec108'::UUID, 'DCFR', 'Defense Casualty and Fatality Report', 'personnel casualty tracking system', 'general', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('520a3d72-025a-41e6-a232-8f87f5d417b7'::UUID, 'overhead', 'ceiling', 'ceiling', 'general', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('520c842d-64fe-4b9b-9651-b4d2caa76dc3'::UUID, 'TCN', 'Transportation Control Number', 'Shipment tracking number', 'general', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('52542c48-e9b0-4bed-b3d2-edaed65e5cf6'::UUID, 'G3', 'division/corps operations', 'division/corps operations', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('529b8009-8182-4967-bae3-3ad21393ab4d'::UUID, 'LOGPAC', 'logistics package', 'logistics package', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('52a03970-d0ef-4816-ba32-904808bf39fd'::UUID, 'NMCS', 'Non-Mission Capable Supply', 'out of service due to parts shortage', 'general', 'logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('52d06e78-0b22-4a55-88a3-4cfdb89f71e4'::UUID, 'NIOC', 'Navy Information Operations Command', 'Navy cyber and intel operations', 'navy', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5337f018-2496-4368-b17a-c340371ae900'::UUID, 'FEC', 'Facilities Engineering Command', 'Navy construction management command', 'navy', 'Engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('53749e10-308d-47de-92df-7426ae53c3ad'::UUID, 'OSS', 'operations support squadron', 'operations support squadron', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('54031df2-3793-4309-b886-d06e45a634e8'::UUID, 'IAVA', 'Information Assurance Vulnerability Alert', 'Critical security patch notification', 'general', 'technical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('54db13d8-493f-4cdc-9225-7bee4854d936'::UUID, 'SLC', 'Senior Leader Course', 'Senior supervisor course', 'army', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('551580a6-e7a3-42f8-b89f-52327e92816b'::UUID, 'POAM', 'Plan of Action and Milestones', 'Security remediation plan', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5535ea37-91f2-40b0-a541-56c1c36e5b54'::UUID, 'DCO', 'Deputy Commandant for Operations', 'Deputy Commandant for Operations', 'uscg', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5555ceec-5fa8-43ce-bfbd-a7ccdecf6413'::UUID, 'DEOCS', 'organizational climate survey', 'organizational climate survey', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('555fdce0-625e-411b-a852-35767d5de929'::UUID, 'DCTT', 'damage control training team', 'damage control training team', 'navy', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('55745fec-df7f-4d77-878d-a49cf71958a6'::UUID, 'NCOA', 'NCO Academy', 'NCO Academy', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5596b9b2-8a7e-450a-a568-32375403934f'::UUID, 'VMFA', 'Marine Fighter Attack Squadron', 'Marine F-35/F/A-18 squadron', 'usmc', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('55f82d46-53a1-4d88-9ba4-54513fce9951'::UUID, 'S1', 'human resources/personnel', 'human resources/personnel', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('565653fc-7b2a-4a04-9ce4-646156cdd88c'::UUID, 'BUPERS', 'Bureau of Naval Personnel', 'Navy HR headquarters', 'navy', 'organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('56919c07-1b62-436a-addd-d7289897a897'::UUID, '3M', 'maintenance program', 'maintenance program', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5708383f-57c4-49bb-b338-4a3e895a8573'::UUID, 'CMT', 'Cyber Mission Team', 'Offensive/defensive cyber operations unit', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('571b6340-c3a2-4a3b-8062-cf6c11975bab'::UUID, 'ULTRA-C', 'Unit Level Training Readiness Assessment-Command', 'Command-level readiness assessment', 'navy', 'compliance')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('572d5326-9425-4bec-8e9f-0b4274ca9ab0'::UUID, 'APOD', 'Aerial Port of Debarkation', 'Military air cargo receiving terminal', 'general', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('574bd9e7-bce4-4bc6-b266-5b88f4c54c37'::UUID, 'ECAT', 'Enterprise Compromise Assessment Tool', 'Malware detection platform', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5840ee3e-da63-47b4-92c8-3553a3b1a06d'::UUID, 'GBU', 'Guided Bomb Unit', 'Precision-guided aerial weapon', 'general', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('58775bd8-84e5-4264-90bc-3e020b5cf5ee'::UUID, 'AFPC', 'Air Force Personnel Center', 'AF human resources center', 'usaf', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('587a9e76-2e0c-402b-97a0-d65eb3940ae0'::UUID, 'JAG', 'legal affairs', 'legal affairs', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5897d194-3990-4494-a8ad-89242e552900'::UUID, 'MCCDC', 'Combat Development Command', 'Combat Development Command', 'usmc', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('58d121ce-c073-48f2-ad14-988ddd26064f'::UUID, 'MCSC', 'Marine Corps Systems Command', 'Marine Corps Systems Command', 'usmc', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('58fa6bbe-3c11-4785-8393-b0a7cf09ba54'::UUID, 'CCC', 'Captains Career Course', 'mid-level management development course', 'army', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('592c1e1f-d23b-4ca6-b026-2f5ecdb8031e'::UUID, 'CANTRAC', 'training catalog', 'training catalog', 'navy', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('597f5ace-4e60-4733-a022-f69323d2cbc5'::UUID, 'ODNI', 'Office of the Director of National Intelligence', 'IC coordination and oversight office', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('59b7fd00-b369-4262-b4d7-205000651b66'::UUID, 'EDO', 'Engineering Duty Officer', 'Engineering on-call supervisor', 'navy', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('59c9c79e-5039-4fc8-84da-6e13e07528bd'::UUID, 'SPCM', 'special court-martial', 'special court-martial', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5a6d6e51-f475-4680-8e0c-ac517d99f609'::UUID, '1SG', 'first sergeant', 'first sergeant', 'army', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5a7df95e-0f11-4c37-8653-9c88b5093179'::UUID, 'ET', 'electronics technician', 'electronics technician', 'navy', 'Rating')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5ac71371-7a1a-46b4-b247-a4aabfe5606c'::UUID, 'WOAC', 'Warrant Officer Advanced Course', 'Senior warrant officer training', 'army', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5adb42e1-d5fe-4a88-9e7a-b9f8d429d1d5'::UUID, 'ISSO', 'Information Systems Security Officer', 'System security point of contact', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5ae5beb5-83c7-44a6-b260-e98b04f1e8d6'::UUID, 'PIR', 'Priority Intelligence Requirements', 'Commander''s key intelligence needs', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5b2349f8-fa9f-4341-b2be-30a49b277f4a'::UUID, 'hatch', 'door', 'door', 'general', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5b254f36-cd2d-4570-bb0f-77bd5204912b'::UUID, 'MOL', 'Marine Online', 'Marine Corps self-service portal', 'usmc', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5b45022a-76df-4137-bdc8-c16d3edcef15'::UUID, 'SIGINT', 'Signals Intelligence', 'electronic communications analysis', 'general', 'intel')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5b61f916-4bdd-478d-9df5-16cc6e18b26f'::UUID, 'SCI', 'sensitive compartmented information', 'sensitive compartmented information', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5b64d78f-d857-41d0-9d38-5f2f6cca7660'::UUID, 'VDP', 'Vulnerability Disclosure Program', 'Bug bounty and reporting program', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5b6f8710-08f3-4656-bf00-06f8fbb4666a'::UUID, 'MARFORCOM', 'Marine Forces Command', 'Marine Forces Command', 'usmc', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5b710731-22cf-45fc-b0fd-53b5475d2558'::UUID, 'C2', 'Command and Control', 'Centralized management and direction', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5bfcd789-2db9-43e2-8afc-886ef4433c19'::UUID, 'SLD', 'Space Launch Delta', 'Space Launch Delta', 'ussf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5c0d9d44-be5a-4370-902c-15c143b557f3'::UUID, 'MEU', 'Marine Expeditionary Unit', 'Marine Expeditionary Unit', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5c2cd314-0614-49af-8851-ebffc88b50e6'::UUID, 'LOE', 'Light-Off Examination', 'Propulsion system readiness test', 'navy', 'compliance')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5c86033b-0fde-499d-8bb5-a5fc4a23abad'::UUID, 'CJCS', 'Chairman of the Joint Chiefs of Staff', 'top military advisor to the President', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5c9b4750-0447-4887-bf4b-8817435c0b61'::UUID, 'SQD', 'squad', 'squad', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5cb43291-1f39-417e-876d-cf5ac2cb6f2f'::UUID, 'duty section', 'on-call team', 'on-call team', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5cbcda11-cfb1-4161-ba6f-8ed272d191a4'::UUID, 'HMH', 'Marine Heavy Helicopter Squadron', 'Marine CH-53 squadron', 'usmc', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5cf480be-d952-4dfe-b599-2397c16e7c4d'::UUID, 'DTG', 'Date-Time Group', 'timestamp / date-time reference', 'general', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5cfb59e0-a126-4de9-9cf3-548fdfa02075'::UUID, 'FITREP', 'performance evaluation', 'performance evaluation', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5d4681d1-904d-4185-8962-551f790cbc3b'::UUID, 'USSF', 'United States Space Force', 'United States Space Force', 'ussf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5dbc9383-d3a4-4329-83be-02581bb4cf5d'::UUID, 'BES', 'Budget Estimate Submission', 'Annual budget request package', 'general', 'Financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5dceff27-8e42-4849-bbc9-0ffdcf57a379'::UUID, 'TSTA', 'Tailored Ships Training Availability', 'Integrated training assessment', 'navy', 'compliance')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5dd50991-57ed-44b4-9d3d-e5769b4f6057'::UUID, 'VMM', 'Marine Medium Tiltrotor Squadron', 'Marine Osprey squadron', 'usmc', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5de001ac-34b1-48ed-b7c5-8956d92b9bea'::UUID, 'ILE', 'Intermediate Level Education', 'mid-career leadership development program', 'army', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5e525850-0013-4014-ad11-e81030edca37'::UUID, 'GEOINT', 'Geospatial Intelligence', 'geographic information systems analysis', 'general', 'intel')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5e7ec40a-91c3-40ea-9c84-0d26fd6b3239'::UUID, 'SFC', 'sergeant first class', 'sergeant first class', 'army', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5e7fb6b3-86dc-48cb-ba5d-467b5ebd84b9'::UUID, 'CENTCOM', 'Central Command', 'Central Command', 'general', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5f04cb87-0054-482e-acdf-5098bb69c8cc'::UUID, 'SKED', 'scheduling system', 'scheduling system', 'navy', 'System')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5f773a8c-e705-4ab8-89c0-b7ed7cd8e9e7'::UUID, 'PB', 'patrol base', 'patrol base', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('5fb19e6d-33d3-4c8a-8916-bc4be5f23d5d'::UUID, 'SUBPAC', 'submarine forces Pacific', 'submarine forces Pacific', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('602abfa3-a951-4ee3-9e95-cb081c386312'::UUID, 'MPF', 'Military Personnel Flight', 'Air Force HR office', 'usaf', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('60a04371-449b-45d5-ab92-d68f0496376c'::UUID, 'DISA', 'Defense Information Systems Agency', 'enterprise IT infrastructure agency', 'general', 'cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('60ec9070-c47b-4bb8-b0da-554e4a53a049'::UUID, 'SGLI', 'Servicemembers Group Life Insurance', 'Military life insurance', 'general', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('610064c0-c7d2-4902-8437-9dbaabdd67d8'::UUID, 'MSR', 'Main Supply Route', 'Primary logistics corridor', 'general', 'logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('610602ce-d45b-46e2-ad5f-d78032654d52'::UUID, 'DTMS', 'digital training management system', 'digital training management system', 'army', 'System')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6182371d-cc27-4897-83b8-1ebc036fd2fd'::UUID, 'TYCOM', 'command-level', 'command-level', 'navy', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('61bd40e3-90cd-49d6-8ce5-5ddcbcf71053'::UUID, 'NOFORN', 'not releasable to foreign nationals', 'not releasable to foreign nationals', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('61c18f5b-546d-4664-be9d-caa70a3c378c'::UUID, 'BAH', 'Basic Allowance for Housing', 'Housing stipend', 'general', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6276539a-3f5d-4833-9282-fbbc8a8cf151'::UUID, 'GFEBS', 'General Fund Enterprise Business System', 'Army financial management system', 'army', 'Financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('62a3f8dd-6211-400f-98f6-2f8bdbafb844'::UUID, 'MHE', 'Material Handling Equipment', 'Forklifts and cargo moving equipment', 'general', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('62e2b775-d73b-4f79-804e-d02bc3b57a01'::UUID, 'OER', 'officer performance evaluation', 'officer performance evaluation', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('632e2155-3b0a-40af-89be-fa2c872f0b40'::UUID, 'LCE', 'logistics combat element', 'logistics combat element', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('634af762-934f-4dc2-a782-bd4d443567d1'::UUID, 'MEDPROS', 'Medical Protection System', 'medical readiness tracking system', 'general', 'medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6368318e-b209-4f2c-b115-3bb21d067974'::UUID, 'LOE', 'Lines of Effort', 'strategic effort areas / focus areas', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('63706788-eb02-4844-8fb8-2c4ae6395391'::UUID, 'DRRS', 'Defense Readiness Reporting System', 'Readiness tracking system', 'general', 'technical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6393d7fa-78bc-428c-8437-0e8dd60377d8'::UUID, 'NAVAIR', 'Naval Air Systems Command', 'Navy aviation systems command', 'navy', 'organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('63a3ba1a-47d9-40eb-92c2-5f6e9286794a'::UUID, 'SF', 'security forces', 'security forces', 'usaf', 'Security')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('63aaaeac-3904-4479-8479-db3e57f4668e'::UUID, 'CFL', 'command fitness leader', 'command fitness leader', 'navy', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('63c6aa13-6cc2-4387-9d85-60bf91aa8d56'::UUID, 'DFAR', 'Defense Federal Acquisition Regulation', 'defense procurement regulations', 'general', 'financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('63d375e9-b2ac-4299-a196-8aab77f6cfbe'::UUID, 'HMH', 'Marine Heavy Helicopter Squadron', 'Marine Heavy Helicopter Squadron', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('641df073-41f1-427e-a774-b97da13f7572'::UUID, 'YN', 'yeoman', 'yeoman', 'navy', 'Rating')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('642939f4-eee3-4d30-86a4-67d02b0e60e1'::UUID, 'OPS', 'operations', 'operations', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('64337272-dd2a-4764-905e-a414c5e60c56'::UUID, 'QRF', 'Quick Reaction Force', 'Rapid response team', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6489065e-5511-4f05-b318-dceed910c922'::UUID, 'rack', 'bed', 'bed', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('64b97e28-c5d9-4f53-a6d6-56c058834e54'::UUID, 'MOS', 'military occupational specialty', 'military occupational specialty', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('64ca8f65-e395-4cae-aebb-db046a80d012'::UUID, 'TSP', 'Thrift Savings Plan', 'Government 401(k) retirement plan', 'general', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('64cbaa45-db44-4487-8520-5fe858f92aba'::UUID, 'TLP', 'Troop Leading Procedures', 'team planning and execution steps', 'army', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('64cfec32-1b29-462e-9c66-15a3d7167a82'::UUID, 'CRM', 'crew resource management', 'crew resource management', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('64dc742d-8db7-404f-bf36-763d14b56e6c'::UUID, 'COCOM', 'combatant command', 'combatant command', 'general', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('64f12a29-0460-4199-b7d8-0e814ddf4328'::UUID, 'TCCC', 'Tactical Combat Casualty Care', 'field emergency trauma care', 'general', 'medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('65120f2c-c606-4af5-9ecc-18d4ec78912c'::UUID, 'IC', 'interior communications electrician', 'interior communications electrician', 'navy', 'Rating')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6585ab6b-9a73-4097-9ae8-e04566c96133'::UUID, 'OOD', 'officer of the watch', 'officer of the watch', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('65a968ce-426f-4c83-afe0-0e0b1d233039'::UUID, 'CMSGT', 'chief master sergeant', 'chief master sergeant', 'usaf', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6622020e-4464-4813-82d6-413c20227d03'::UUID, 'TDA', 'Table of Distribution and Allowances', 'Training unit organizational structure', 'army', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('66829a5c-b72c-49c2-bd62-11bf3483cd30'::UUID, 'MLE', 'maritime law enforcement', 'maritime law enforcement', 'uscg', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('66cb29c8-68f6-48a4-b6f9-4d7a252d38cf'::UUID, 'FEP', 'fitness enhancement program', 'fitness enhancement program', 'navy', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('670fc17a-a17a-4a0e-b82f-3ca850338d9f'::UUID, 'FORSCOM', 'Forces Command', 'Forces Command', 'army', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6781ca3f-25cb-44c1-8a43-f63464483214'::UUID, 'STRATCOM', 'Strategic Command', 'Strategic Command', 'general', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('67d99e8d-1a94-4d3a-9eee-0ebbbe37f68b'::UUID, 'IATT', 'Interim Authority to Test', 'Temporary security authorization', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('67f1ac51-ad77-444a-ab25-6792725e46c6'::UUID, 'MSR', 'main supply route', 'main supply route', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('68283371-46a7-4710-899d-10ad3d754bea'::UUID, 'MRC', 'maintenance procedures', 'maintenance procedures', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('68283f48-0525-4dcd-a723-f2745749b39d'::UUID, 'FYDP', 'Future Years Defense Program', 'Five-year budget projection', 'general', 'Financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('684f04b1-d549-4166-a064-4e4fc2dced4e'::UUID, 'PEC', 'Program Element Code', 'Budget tracking identifier', 'general', 'Financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('686eb779-9734-4ef3-a1d7-45a72db70b29'::UUID, 'CCC', 'Captains Career Course', 'Army captain professional development', 'army', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('68a06b17-5a8f-4909-bb0f-5e8ecb8bb405'::UUID, 'AETC', 'Air Education and Training Command', 'Air Education and Training Command', 'usaf', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('68aa84bd-ca15-42d7-bfd8-484dab42e0a5'::UUID, 'MDG', 'medical group', 'medical group', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('68b5d710-85f9-4286-86ec-f2ccc8c8aea9'::UUID, 'CDC', 'operations center', 'operations center', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('68c26ce9-9fff-4116-b2a2-22f1e43b3488'::UUID, 'PIR', 'Priority Intelligence Requirements', 'priority research questions', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('68ee16cd-0084-4fa5-ad93-68caabcc1726'::UUID, 'field day', 'deep cleaning', 'deep cleaning', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('68f5546d-5a6b-4383-97ea-366039993176'::UUID, 'HT', 'hull maintenance technician', 'hull maintenance technician', 'navy', 'Rating')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('694737d2-7f92-42a2-89ca-3e34a059b3af'::UUID, 'MDMP', 'Military Decision Making Process', 'Structured decision-making framework', 'army', 'planning')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('69e08303-6e9e-4ba7-82bb-8b4ca8a95ab3'::UUID, 'SMA', 'Sergeant Major of the Army', 'Senior enlisted Army advisor', 'army', 'organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6a2b9219-04f5-495f-84fe-43afaff2fbeb'::UUID, 'IDES', 'Integrated Disability Evaluation System', 'Military disability determination process', 'general', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6a7a79a9-e33f-4f63-ae6e-2b210e202765'::UUID, 'UCMJ', 'Uniform Code of Military Justice', 'Military legal code', 'general', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6a839180-7e55-4c84-8b1a-d1bb067ed235'::UUID, 'DIA', 'Defense Intelligence Agency', 'National defense analysis organization', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6ac2e55a-3ee7-45d1-8a7a-b0aa32538652'::UUID, 'MECEP', 'enlisted commissioning program', 'enlisted commissioning program', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6b4af0ca-9b9a-40fa-9534-7f427693d6a8'::UUID, 'SECNAV', 'Secretary of the Navy', 'Civilian leader of Navy and Marine Corps', 'navy', 'organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6b7cad1a-8e29-4d7c-9ac1-56edb7f86aac'::UUID, 'FLIR', 'Forward-Looking Infrared', 'Thermal imaging sensor', 'general', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6b7ce2a6-5e8e-4f76-8f6d-f04c1b4b70de'::UUID, 'OMA', 'Operation and Maintenance Army', 'Army operating budget', 'army', 'financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6bab5843-8bd6-4e55-84fd-26c81d653899'::UUID, 'MILPDS', 'Military Personnel Data System', 'Air Force personnel database', 'usaf', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6bcc77c6-d59d-4c7a-93c8-09a4564d6642'::UUID, 'JSM', 'Joint Service Medal', 'Multi-service assignment recognition', 'general', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6bd46008-f0cc-47b6-bc86-1321fe098d88'::UUID, 'AFSC', 'career field specialty code', 'career field specialty code', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6c669150-e09d-4f38-bc3a-3800f7ab8e04'::UUID, 'ESSAYONS', 'Army Engineer Motto (Let Us Try)', 'Army Corps of Engineers motto', 'army', 'engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6c68ab7d-b4e2-4753-bffa-8ad3e77a10f0'::UUID, 'iPERMS', 'Interactive Personnel Electronic Records Management System', 'Army digital personnel records', 'army', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6d00fb61-7abe-419f-9692-88ac0a4fbc70'::UUID, 'berthing', 'crew quarters', 'crew quarters', 'general', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6d11ad42-7131-45e1-af59-14e31c3c77aa'::UUID, 'PBUSE', 'property management system', 'property management system', 'army', 'System')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6da4ba9a-002b-4d3b-8845-de2531bdb879'::UUID, 'POW', 'prisoner of war', 'prisoner of war', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6dffc963-ff63-41d6-9dff-73c347c9b6d9'::UUID, 'ATG', 'Afloat Training Group', 'External readiness assessment organization', 'navy', 'organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6e59a94d-3187-4e10-8a94-8f909ccd3fd4'::UUID, 'NAS', 'naval air station', 'naval air station', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6e887046-14f6-489d-9465-7c254f7031d6'::UUID, 'MCMAP', 'martial arts program', 'martial arts program', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6ec55318-9c74-4be5-b50d-10ce26360441'::UUID, 'IIR', 'Intelligence Information Report', 'Raw intelligence reporting format', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6ed08af0-8ca8-4cec-bfb7-fc1440a3c08f'::UUID, 'port and starboard', 'rotating shift schedule', 'rotating shift schedule', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6ed841f9-0dba-4842-b17e-a77759595050'::UUID, 'MSIC', 'Missile and Space Intelligence Center', 'Missile threat analysis center', 'army', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6f726362-eb16-4c3e-b72d-9b249b375b76'::UUID, 'CCIP', 'commander''s inspection program', 'commander''s inspection program', 'usaf', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6f9afa3c-5047-4323-ac27-d019484d601b'::UUID, 'MPF', 'Military Personnel Flight', 'Air Force base HR office', 'usaf', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('6fa8f35a-6f65-4a23-8a28-2dabe2c25ed6'::UUID, 'AOR', 'area of responsibility', 'area of responsibility', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7002c991-abce-40c0-a978-15972f9c49a2'::UUID, 'EMR', 'Electronic Medical Record', 'Digital patient health record', 'general', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7021ca07-f9f6-4bdd-a3fa-3115b13319a6'::UUID, 'galley', 'dining facility', 'dining facility', 'general', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('70b58bbe-4e95-40ae-a532-ec909bf94382'::UUID, 'BMOW', 'bridge watch supervisor', 'bridge watch supervisor', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('70e0145b-97dd-46d8-a516-27f103a955a2'::UUID, 'MAJCOM', 'major command', 'major command', 'usaf', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('716efcb3-76df-4e48-b6ee-44161700f4e2'::UUID, 'CPL', 'corporal', 'corporal', 'army', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('718b0877-9778-4686-a61d-b2f8bc012ff7'::UUID, 'TRICARE', 'TRICARE', 'Military healthcare insurance program', 'general', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('71a271e9-3a94-4f09-b3d7-578f1873687b'::UUID, 'WGS', 'Wideband Global SATCOM', 'High-bandwidth military satellite network', 'general', 'Space')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('720b2a82-c2b5-4df5-b10d-bd83403f4ead'::UUID, 'SECDEF', 'Secretary of Defense', 'Civilian leader of Department of Defense', 'general', 'organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7215b3b3-d01f-4db8-911b-a9e47857adaa'::UUID, 'OIC', 'officer in charge', 'officer in charge', 'army', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('72cbfe15-70e8-4ff0-abcc-63e5af86e2eb'::UUID, 'LOD', 'Line of Duty', 'Work-related injury/illness determination', 'general', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('72e046ba-9387-4cbc-988e-91dc5560c9a7'::UUID, 'EER', 'enlisted evaluation report', 'enlisted evaluation report', 'uscg', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('72e1ca6f-9d08-4967-aaa3-6aa5c8760c1e'::UUID, 'INTSUM', 'Intelligence Summary', 'intelligence briefing summary', 'general', 'intel')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('731abf46-09c3-43fd-b51c-9b0a3a3c9305'::UUID, 'S6', 'communications/IT', 'communications/IT', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('73273caa-87ea-43f6-a020-5d74f2fc0bb0'::UUID, 'OPNAV', 'headquarters staff', 'headquarters staff', 'navy', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('73421707-ca10-49c1-aeb0-c912341adaa7'::UUID, 'CMC', 'senior enlisted advisor', 'senior enlisted advisor', 'navy', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('74805483-63d2-4a7e-841a-f837f959969f'::UUID, 'SPOE', 'Seaport of Embarkation', 'Military sea cargo departure terminal', 'general', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('74a29d61-51a3-4096-bef0-7ce5371b51c7'::UUID, 'WARNO', 'Warning Order', 'Advance notification of upcoming operations', 'general', 'communication')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('755ba089-8a0b-41ac-bc27-d0f6c87e7f9e'::UUID, 'WLB', 'buoy tender', 'buoy tender', 'uscg', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('75936316-4ac3-4469-9210-f9b2be01da8f'::UUID, 'AMSCO', 'Army Management Structure Code', 'Army budget classification code', 'army', 'Financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('75fb6069-9cd1-4530-bfb4-29b5cbbfcd58'::UUID, 'SURFLANT', 'Commander Naval Surface Forces Atlantic', 'Atlantic surface fleet commander', 'navy', 'organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7607f1bc-d7ef-43d7-8190-6d4ccbddf35a'::UUID, 'NKO', 'online training system', 'online training system', 'navy', 'System')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('760c91f1-ac21-476b-984c-edc9b5073ea9'::UUID, 'S-1', 'Personnel/Administration Section', 'HR department', 'army', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('763a5a31-412c-4b62-acd3-d25bf78c819a'::UUID, 'MCLB', 'Marine Corps Logistics Base', 'Marine Corps Logistics Base', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7648a6ce-75eb-4a22-b10f-3cfc4a162444'::UUID, 'VFA', 'Strike Fighter Squadron', 'Navy F/A-18 squadron', 'navy', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('76c72ff4-903d-478c-9faf-2b6cab34fa79'::UUID, 'EXORD', 'Execute Order', 'execution directive', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('780a7104-95dc-428f-8773-0d353beed858'::UUID, 'MEF', 'Marine Expeditionary Force', 'Major Marine Corps operational force', 'usmc', 'organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('78454007-f847-42e1-b639-36b6209a1906'::UUID, 'sortie', 'mission flight', 'mission flight', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7889697f-896a-4195-9cb0-85cf310c1c71'::UUID, 'MEDCOM', 'Medical Command', 'Medical Command', 'army', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('788a3423-0741-45a1-9b52-868e6f0c124c'::UUID, 'BAS', 'Battalion Aid Station', 'Forward field medical clinic', 'army', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7898b57e-8568-4515-aa67-3977d8e80859'::UUID, 'STIG', 'Security Technical Implementation Guide', 'Security configuration standard', 'general', 'technical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('789c0e67-bf63-465b-9b29-c2beed259a8f'::UUID, 'colors', 'flag ceremony', 'flag ceremony', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('79458a05-05b7-42cb-b57b-54aa9d691cc6'::UUID, 'DD-214', 'Certificate of Release or Discharge', 'Military discharge certificate', 'general', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('795c4f30-8344-4c9c-b436-b9b4075be849'::UUID, 'IG', 'inspector general', 'inspector general', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7972343d-136c-4156-b920-7d0345561c09'::UUID, 'HPCON', 'Health Protection Condition', 'Health threat level', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('79de52e7-7848-440f-8ab1-5c88b721db52'::UUID, 'ATO', 'Authority to Operate', 'System security certification', 'general', 'technical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7a465e19-1c71-40f3-ba90-92f9e9f64974'::UUID, 'SNCOA', 'Senior NCO Academy', 'Senior NCO Academy', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7a7f2485-3c1b-4332-a271-a887707c2749'::UUID, 'DO', 'director of operations', 'director of operations', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7ae53d90-a633-4acf-8bbd-4d1b16ae931b'::UUID, 'SOUTHCOM', 'Southern Command', 'Southern Command', 'general', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7b238ab9-aebb-4ee1-8f76-97118dbf2d6d'::UUID, 'SCM', 'summary court-martial', 'summary court-martial', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7b248948-b095-46ca-8590-9458625ea341'::UUID, 'J2', 'joint intelligence', 'joint intelligence', 'army', 'Security')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7b74e2d0-af71-4aaf-b8eb-062541fbc680'::UUID, 'ESG', 'expeditionary strike group', 'expeditionary strike group', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7b8c33e1-6d0d-4860-84d5-c19fcac9bd01'::UUID, 'RFI', 'Request for Information', 'Information request', 'general', 'communication')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7b9e96b7-7ea4-4747-9f78-a787e091407e'::UUID, 'PLANORD', 'Planning Order', 'planning directive', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7bec074f-bf62-4617-9b1d-3398c0539bad'::UUID, 'NDU', 'National Defense University', 'Senior military/civilian joint education', 'general', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7c167e73-2d3a-4339-be54-d7ea3ff59bfd'::UUID, 'CNSP', 'Commander Naval Surface Forces Pacific', 'Pacific surface fleet commander', 'navy', 'organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7c58d36a-b049-445b-bba3-21b422eb930d'::UUID, 'IMR', 'Individual Medical Readiness', 'employee health compliance status', 'general', 'medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7c955640-4c0a-4bff-a79c-22b528b92c42'::UUID, 'MEDPROS', 'Medical Protection System', 'Medical readiness tracking', 'army', 'technical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7cba300e-1051-4f61-b6bf-9fbd3b9a5534'::UUID, 'ammo', 'ammunition', 'ammunition', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7d82e70e-25a7-46f7-9651-d1dbe5c89f2f'::UUID, 'TOC', 'tactical operations center', 'tactical operations center', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7d8dff54-d418-43f6-9c57-ce85d1894214'::UUID, 'CO', 'director', 'director', 'navy', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7db4dcc2-a350-43ef-a279-990c2df1ce50'::UUID, 'STIG', 'Security Technical Implementation Guide', 'Security configuration standard', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7db62d0f-ab19-4c25-84d1-760cfdfb0e7b'::UUID, 'FRAGO', 'change to operations order', 'change to operations order', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7dcf0d6f-a21e-4308-a390-86b18e455c0c'::UUID, 'Guardians', 'personnel', 'personnel', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7df0e890-d23c-4b52-94e0-3f74d8f5da94'::UUID, 'CFSCC', 'Combined Force Space Component Command', 'Joint space operations command', 'general', 'Space')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7e12b4bc-8343-4559-bbc5-b320123d6df2'::UUID, 'ISO', 'International Organization for Standardization container', 'Standard shipping container', 'general', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7e390874-6a1f-49b8-b303-9a492110f43f'::UUID, 'GPC', 'Government Purchase Card', 'corporate purchasing card', 'general', 'financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7e6b7b69-640d-4b17-b75a-0a28e37783b5'::UUID, 'LOGSTAT', 'Logistics Status Report', 'supply and logistics status report', 'general', 'logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7e8ccd5b-2389-444a-a00f-50df4d386bed'::UUID, 'CTC', 'combat training center', 'combat training center', 'army', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7eb759e9-9e98-41b0-bccb-5329e9375b52'::UUID, 'SSGT', 'staff sergeant', 'staff sergeant', 'usaf', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7ef3df91-66de-4f83-a374-4cae2d5f762f'::UUID, 'DUSTOFF', 'Dedicated Unhesitating Service to Our Fighting Forces', 'Army air ambulance', 'army', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7f40ee6b-70f7-4176-b314-5445e3ce4fe7'::UUID, 'SHARP', 'sexual harassment/assault prevention', 'sexual harassment/assault prevention', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7f7446b0-4306-4899-a8df-4b7d5a3ab1a5'::UUID, 'AAFES', 'military retail', 'military retail', 'general', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7f80522f-31da-40bb-b7d7-b48336ee1755'::UUID, 'COMMO', 'communications officer', 'communications officer', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7fa9c973-3b14-4e85-ae63-e8214daeb174'::UUID, 'ATTRS', 'training requirements system', 'training requirements system', 'army', 'System')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('7fff1e99-a05e-4c89-9a6a-b69c413fc5b4'::UUID, 'FMO', 'Financial Management Office', 'Finance and accounting department', 'general', 'Financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('80036124-2c07-4ce0-a11c-2cc88c157b4c'::UUID, 'MLC', 'Master Leader Course', 'executive management development course', 'army', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8041ebec-ab21-4e09-a2b4-862b025b7448'::UUID, 'EAD', 'Earliest Arrival Date', 'First acceptable delivery date', 'general', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8060b1ba-a1b5-4889-908e-511fb8e49f48'::UUID, 'OSINT', 'Open-Source Intelligence', 'public information research and analysis', 'general', 'intel')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('80990006-57a2-4e83-b7d5-a238d421a174'::UUID, 'AMEDD', 'Army Medical Department', 'Army healthcare organization', 'army', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('81e4fe54-b0f2-46d8-9737-f4b5b84ce13b'::UUID, 'ALMAR', 'all Marines message', 'all Marines message', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8245256c-0126-4144-8a6c-06b277f6b945'::UUID, 'COA', 'Course of Action', 'proposed plan of action', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('826d3bb7-4a59-4357-985e-1274e6a073c5'::UUID, 'PLT', 'platoon', 'platoon', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('829b27f4-4851-42bf-9a4f-bddc01118453'::UUID, 'PPE', 'personal protective equipment', 'personal protective equipment', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('82a6258d-33b2-4436-a59c-b16748b71187'::UUID, 'MEDPROS', 'Medical Protection System', 'Medical readiness tracking database', 'army', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('83033f70-41cf-4416-80dc-f078f207b74a'::UUID, 'SNCO', 'senior non-commissioned officer', 'senior non-commissioned officer', 'army', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8304540f-6dba-4713-9a11-c11965a35589'::UUID, 'DEL', 'delta (unit)', 'delta (unit)', 'ussf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('834085fe-6da8-4c4a-89ef-96f7f3396f52'::UUID, 'GS', 'General Schedule', 'Federal civilian pay grade system', 'general', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('835f041d-e9e0-427c-b15d-26c86eed77fa'::UUID, 'STAMIS', 'Standard Army Management Information System', 'enterprise management information system', 'army', 'logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('836747de-8c3a-4d13-b8e3-502f16d02778'::UUID, 'TAD', 'Temporary Additional Duty', 'Temporary assignment to another location', 'navy', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('83687d72-4c22-4fab-8cb8-3941a0a607e3'::UUID, 'AFMAN', 'Air Force manual', 'Air Force manual', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8392bf84-8ce7-4f1a-8d32-ac9b215030a6'::UUID, 'BN', 'battalion', 'battalion', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('846efcff-ff71-46b9-b256-842c01e62829'::UUID, 'barracks', 'residential quarters', 'residential quarters', 'general', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('84b2a0c4-a200-49c6-bd1c-6814cf5aa8f0'::UUID, 'COMMEX', 'communications exercise', 'communications exercise', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('84c91cb4-1897-4420-9786-2c22284e943a'::UUID, 'BOQ', 'officer lodging', 'officer lodging', 'general', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('84fc437b-cf28-458d-9714-02ee35212e12'::UUID, 'OTS', 'Officer Training School', 'Officer Training School', 'usaf', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8508bd43-cf60-48e7-aaeb-91856db547f8'::UUID, 'MA', 'master-at-arms', 'master-at-arms', 'navy', 'Rating')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8549f6ca-37b9-466e-8239-77140d36999d'::UUID, 'CGHQ', 'Coast Guard Headquarters', 'Coast Guard Headquarters', 'uscg', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8552c36f-8fcf-46eb-b0f2-79531a495b5d'::UUID, 'J-1', 'Joint Personnel', 'Joint HR staff', 'general', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('856d7125-069a-4962-9332-821a387e80cb'::UUID, 'JRSS', 'Joint Regional Security Stack', 'Regional network security platform', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('85b56f9e-2ddb-489a-8b29-fab3763da302'::UUID, 'NSA', 'National Security Agency', 'Signals intelligence and cybersecurity agency', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('85fb8a34-ee15-4a4a-bfef-87c9957c3675'::UUID, 'ATG', 'operational readiness evaluation', 'operational readiness evaluation', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('860b3f38-45cf-4801-ae57-9167aa213fd6'::UUID, 'HVI', 'High-Value Individual', 'Key person of intelligence interest', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8615fdf5-8c02-46b6-92c9-bf3d58ab9faf'::UUID, 'TIS', 'time in service', 'time in service', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('861810d2-9ffa-46e8-b1c4-1ec04ae009c5'::UUID, 'POM', 'Program Objective Memorandum', 'Multi-year budget planning document', 'general', 'Financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('861c96d8-4814-4494-a167-2d93fd09d357'::UUID, 'ROTC', 'Reserve Officers Training Corps', 'College officer program', 'general', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('861d0bb6-77a6-4a68-b728-5d825acecf53'::UUID, 'AEW', 'Air Expeditionary Wing', 'Air Expeditionary Wing', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('862717b8-aa5a-4fc8-bc8e-f28bb59a31f8'::UUID, 'JISE', 'Joint Intelligence Support Element', 'Multi-service intel analysis team', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8644a05b-4de4-42ff-adc9-225534b66030'::UUID, 'TRICARE', 'military health insurance', 'military health insurance', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('864d2e87-fc4a-471b-9c15-c03d1179411f'::UUID, 'JIOC', 'Joint Intelligence Operations Center', 'Multi-service intel operations facility', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('86f24ef5-5d59-44ac-bc7b-272ba6a273c6'::UUID, 'FSS', 'force support squadron', 'force support squadron', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('871c47e6-48f5-4a09-9dfa-396d1b2634fb'::UUID, 'SAV', 'staff assistance visit', 'staff assistance visit', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('872498d2-56db-4299-87dd-52d3be206bab'::UUID, 'BOD', 'Basis of Design', 'Design requirements document', 'general', 'Engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('87376458-f779-4af7-ad37-33d765f72d1c'::UUID, 'STARCOM', 'Space Training and Readiness Command', 'Space Force training organization', 'ussf', 'Space')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('876df873-5d07-4189-82ee-9ba1e0cd1e07'::UUID, 'OPIR', 'Overhead Persistent Infrared', 'Satellite missile detection system', 'general', 'Space')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8792a6ec-9c85-4a2f-aeeb-eea46038253c'::UUID, 'NVG', 'Night Vision Goggles', 'Low-light vision enhancement device', 'general', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('87afd990-f0e5-4826-ac01-6ddf40e28265'::UUID, 'watch', 'shift duty', 'shift duty', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('87d9ce23-408d-460e-b772-49c6a0668c9d'::UUID, 'OCX', 'GPS Next Generation Operational Control System', 'GPS ground control upgrade', 'general', 'Space')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8804ea07-1364-4668-979d-41711ba48e65'::UUID, 'LOGPAC', 'Logistics Package', 'Supply delivery bundle', 'army', 'logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('881f1e89-a013-4232-9b4a-a429a7b7b884'::UUID, 'PACFLT', 'Pacific Fleet', 'Pacific region naval forces', 'navy', 'organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8852b902-e5c0-49a1-b9c1-6fc0ae829c24'::UUID, 'CHENG', 'chief engineer', 'chief engineer', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('88816288-1d00-45d8-82fb-beedafc906ab'::UUID, 'maintenance lags', 'maintenance delays', 'maintenance delays', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('88ac523a-3c2d-4cfb-9560-d73401b7a19c'::UUID, 'AO', 'Authorizing Official', 'Security certification decision authority', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('88b32853-3f91-4552-8c75-5e24142c13ce'::UUID, 'FAS', 'Fueling at Sea', 'At-sea fuel transfer', 'navy', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('89037a81-4ebc-42e9-9727-f01fafd4abd4'::UUID, 'DCIPS', 'Defense Civilian Intelligence Personnel System', 'Intelligence community civilian pay system', 'general', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('892b692b-3167-406c-9bc8-fd516f3bdd63'::UUID, 'WARNO', 'advance notice', 'advance notice', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('89684ce8-fc46-4648-a670-1d57ca62eb67'::UUID, 'CP', 'command post', 'command post', 'general', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('899f609a-4161-4039-b9b5-6cf2177e44b8'::UUID, 'MAJCOM', 'Major Command', 'Major Air Force headquarters', 'usaf', 'organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('89b9f9da-7b27-4e83-b7c5-945ca38a7848'::UUID, 'DRMO', 'surplus property disposal', 'surplus property disposal', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('89ce74f9-b3ee-4cd5-8af6-c089c1e579a6'::UUID, 'RFI', 'Request for Information', 'Formal intelligence question or data request', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('89dcb6cf-9d07-4596-a839-6152a4bc4286'::UUID, 'CNE', 'Computer Network Exploitation', 'Network intelligence gathering', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8abb4301-7a6c-4431-a93b-28a13100c5d4'::UUID, 'SFA', 'Security Force Assistance', 'Partner nation security capacity building', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8ad6f5f1-9033-49c5-86e3-2cef4d701e15'::UUID, 'GARR', 'garrison', 'garrison', 'ussf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8af5d87e-8aa1-4e8f-b78b-a01022aeba4c'::UUID, 'GMT', 'General Military Training', 'Mandatory compliance training', 'navy', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8b28fab6-051e-4226-8efd-19ccf242a48a'::UUID, 'JSpOC', 'Joint Space Operations Center', 'Joint Space Operations Center', 'ussf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8b486691-79b2-48e8-8633-bfff1e9772aa'::UUID, 'BOLC', 'Basic Officer Leader Course', 'New Army officer training', 'army', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8b6baaca-08c8-41d5-9a6b-fc033d89ecb6'::UUID, 'muster', 'accountability check', 'accountability check', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8b8ddd22-ea95-455b-ae88-d9ba317d75be'::UUID, 'MSC', 'Military Sealift Command', 'Navy cargo shipping organization', 'navy', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8b91c5cc-3661-4d45-a164-6c998b7d17c0'::UUID, 'DOCEX', 'Document Exploitation', 'Analysis of captured documents', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8bc13599-66ce-4f19-b02f-28585181a1a7'::UUID, 'SSA', 'Supply Support Activity', 'Supply distribution point', 'army', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8c08c838-a4e8-4e9b-891f-01006e3b23a2'::UUID, 'SSG', 'staff sergeant', 'staff sergeant', 'army', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8c1fb1ab-a041-49eb-971a-01014a9a5cd4'::UUID, 'SRA', 'senior airman', 'senior airman', 'usaf', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8c4020c3-f033-4bff-b255-e37532cfb37e'::UUID, 'ORI', 'Operational Readiness Inspection', 'Formal readiness inspection', 'usaf', 'compliance')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8c606a3c-22b1-48d5-be83-f58e8cfd0a06'::UUID, 'WAPS', 'weighted airman promotion system', 'weighted airman promotion system', 'usaf', 'System')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8c6e7488-778b-460c-a00d-5a1a639f90b5'::UUID, 'FFIR', 'Friendly Force Information Requirements', 'internal status reporting requirements', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8ccab5f6-43cf-4234-8680-6151214c13ed'::UUID, 'ESC', 'Expeditionary Sustainment Command', 'Army theater logistics command', 'army', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8ce51a61-7942-4da2-b251-6dcd554477ea'::UUID, 'mess deck', 'dining facility', 'dining facility', 'general', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8d058cca-3274-456e-a8d6-1beaa1a833a8'::UUID, '3MC', 'Maintenance Coordinator', 'Maintenance Coordinator', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8d6677ad-3691-43da-8f00-c63721e128bd'::UUID, 'SK', 'storekeeper', 'storekeeper', 'navy', 'Rating')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8dae1f82-3590-48b4-a547-94a21395fd37'::UUID, 'DIS', 'Defense Investigative Service', 'Security clearance investigation agency', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8dcbdfc0-c914-472d-87e2-adb373076537'::UUID, 'OMN', 'Operation and Maintenance Navy', 'Navy operating budget', 'navy', 'financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8dd0d177-71d3-4435-af43-52c2b80b4127'::UUID, 'BSA', 'Budget Sub-Activity', 'Detailed budget line', 'general', 'Financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8df83708-ce70-4206-87d9-078246dc713c'::UUID, 'DPAS', 'property accountability system', 'property accountability system', 'army', 'System')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8e0373c7-cce9-473d-b560-d83c7e4eb89b'::UUID, 'SIPR', 'Secret Internet Protocol Router Network', 'Classified government network', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8e5cb689-5fce-409c-b662-13723e79d13e'::UUID, 'METT-TC', 'Mission Enemy Terrain Troops Time Civilians', 'operational planning factors', 'army', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8e975a74-bdda-4e67-8599-c5303cf3a1a9'::UUID, 'IAVA', 'Information Assurance Vulnerability Alert', 'Critical security patch notification', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8e9d5acc-e9d1-401e-9707-029d52a5ec7b'::UUID, 'TRANSCOM', 'U.S. Transportation Command', 'Military global transportation command', 'general', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8eaadf5c-15bf-4e3b-b042-f8ab6ac26891'::UUID, 'AMRAAM', 'Advanced Medium-Range Air-to-Air Missile', 'advanced air defense system', 'general', 'aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8ecb666a-de63-4474-a02b-b0d80508a45f'::UUID, 'LES', 'leave and earnings statement', 'leave and earnings statement', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8ee7d96c-debc-40ac-a4d5-053d7435895e'::UUID, 'IAVM', 'Information Assurance Vulnerability Management', 'Security patching program', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8f0d5524-2fe1-436d-a383-c5736e4e508a'::UUID, 'COLA', 'Cost of Living Allowance', 'Cost of living adjustment', 'general', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8f492ca7-7810-4939-88e3-f77b6ba976a3'::UUID, 'NAF', 'numbered air force', 'numbered air force', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8f580671-9183-46e3-b1ca-2650f2664863'::UUID, 'TM', 'team', 'team', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8f765521-eec9-4d8f-89dd-4a5d818b8e7b'::UUID, 'NDSM', 'National Defense Service Medal', 'Medal for service during conflict period', 'general', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8fdf4ad7-8bf0-4c93-88d9-fdf87d443029'::UUID, 'OMPF', 'official personnel file', 'official personnel file', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8fe4c3b6-26f2-4ddf-8da4-1c95a2fec419'::UUID, 'TPFDD', 'Time-Phased Force Deployment Data', 'Deployment scheduling database', 'general', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('8ff59db0-921c-4955-9fdd-343359db6ec8'::UUID, 'AUXO', 'auxiliaries officer', 'auxiliaries officer', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('908e4331-1631-4a37-98ff-919daa27baab'::UUID, 'INSURV', 'regulatory compliance inspection', 'regulatory compliance inspection', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('90b856e5-04f5-4a3b-9d41-703aff1c7e31'::UUID, 'TAREX', 'Target Exploitation', 'Target analysis and development', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('90c1f216-ba2c-4ab0-9552-cb108c526dd8'::UUID, 'SMMC', 'Sergeant Major of the Marine Corps', 'Senior enlisted Marine advisor', 'usmc', 'organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('90e20581-6053-41d0-8344-a8f09319cbe2'::UUID, 'JPME', 'Joint Professional Military Education', 'Multi-service senior leader education', 'general', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('914868be-4860-4542-8e57-61f6a91d2699'::UUID, 'TECHEX', 'Technical Exploitation', 'Technical equipment forensic analysis', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('91570ace-45da-452a-85b0-a1eb9201a6c9'::UUID, 'AAR', 'after-action review', 'after-action review', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9163b89d-beb6-43c5-9d34-6102521010fc'::UUID, 'MARADMIN', 'Marine administrative message', 'Marine administrative message', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('91da9b18-0f67-4a28-9297-3e2d5d896ab9'::UUID, 'VP', 'Patrol Squadron', 'Navy maritime patrol aircraft squadron', 'navy', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('92dbfd85-290e-42c6-a4a9-a3f8bb0bf7b4'::UUID, 'SDDC', 'Surface Deployment and Distribution Command', 'Military land/sea shipping command', 'army', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('93009e9e-ba7f-4606-9f37-7a347aa2cc7c'::UUID, 'ITS', 'information technology submariner', 'information technology submariner', 'navy', 'Rating')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('93567123-e4a7-459c-9af3-94c66f28de1e'::UUID, 'NFAAS', 'Navy Family Accountability and Assessment System', 'Navy disaster accountability system', 'navy', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('94342241-a799-4638-ac23-592bb8ab12d3'::UUID, 'HQMC', 'Headquarters Marine Corps', 'Headquarters Marine Corps', 'usmc', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('943ab39e-7737-4ffb-a38e-e6d769d1ebc2'::UUID, 'TRADOC', 'Training and Doctrine Command', 'Training and Doctrine Command', 'army', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('944cf9d7-8190-4471-849e-017889b138af'::UUID, 'MTOE', 'personnel and equipment authorization', 'personnel and equipment authorization', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9451019b-b0b0-42a7-98ee-57255d54e582'::UUID, 'CSG', 'carrier strike group', 'carrier strike group', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('947f4749-3298-47d8-9158-aa3e97beac38'::UUID, 'MXS', 'maintenance squadron', 'maintenance squadron', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('94e2fa2e-bb9f-434a-a3b6-53bfe78f5d32'::UUID, 'IAM', 'Information Assurance Manager', 'information security manager', 'general', 'cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('950c245d-754d-4afa-abb8-34a6366fa4ea'::UUID, 'GQ', 'general quarters', 'general quarters', 'navy', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('950cfc31-10e1-4fee-aa69-f9155c19c5d1'::UUID, 'CD', 'deputy commander', 'deputy commander', 'usaf', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('953490ec-b8e7-4667-b7cb-6157b37f33c2'::UUID, 'ATO', 'Authority to Operate', 'security authorization for system deployment', 'general', 'cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9575f806-f75f-4f2e-915e-106a4f0aad95'::UUID, 'SJA', 'staff judge advocate', 'staff judge advocate', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9581951d-6f81-44d9-b3d5-88cf8d1f8d65'::UUID, 'MEDEVAC', 'medical evacuation', 'medical evacuation', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('95831bb5-ab77-4be4-93a5-218605bd8008'::UUID, 'SUPPO', 'supply officer', 'supply officer', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('95b1bc13-1151-4f2a-8ee2-54db3e30ada3'::UUID, 'TSCM', 'Technical Surveillance Countermeasures', 'Electronic bug sweep and detection', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('95bbb409-c480-401b-97d9-3a71f2ab7ace'::UUID, 'USCG', 'United States Coast Guard', 'United States Coast Guard', 'uscg', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('962e924d-0776-4b8d-9b95-5d83ea461fe5'::UUID, 'NSIPS', 'personnel management system', 'personnel management system', 'general', 'System')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('963b07b4-2bbf-4f6d-9d00-ba9f6e99fb33'::UUID, 'UGT', 'upgrade training', 'upgrade training', 'usaf', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('964878c5-f6d7-46b4-8d4d-766d3211459f'::UUID, 'AFI', 'Air Force instruction', 'Air Force instruction', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('96544d39-05fd-4df2-8cba-4d8651217fa6'::UUID, 'BLC', 'Basic Leader Course', 'First-line supervisor course', 'army', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('969928da-e9d5-49bd-be27-11f54b96d152'::UUID, 'S2', 'intelligence/security', 'intelligence/security', 'army', 'Security')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('96aa26b9-f5f3-485f-bf7d-97a161df8ee3'::UUID, 'Guardian', 'team member', 'team member', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('96f50113-a478-44a1-88e8-766452a2daff'::UUID, 'TSC', 'Theater Sustainment Command', 'Army regional logistics headquarters', 'army', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9700b42c-b21c-4324-bc9c-1b10ed84e318'::UUID, 'RAPIDS', 'Real-time Automated Personnel Identification System', 'Military ID card system', 'general', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9702b212-72fa-4f38-a8af-958b24907f64'::UUID, 'LMET', 'Leadership and Management Education and Training', 'Leadership development course', 'navy', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9703785f-8394-4f1b-9677-8bb6457f11de'::UUID, 'APL', 'Allowance Parts List', 'Authorized parts list per equipment', 'navy', 'technical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('971ed41e-217d-4309-a7f9-ff739711439a'::UUID, 'QM', 'quartermaster', 'quartermaster', 'navy', 'Rating')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('97321519-d7a5-4480-a0a2-26bb57a1df82'::UUID, 'DMSP', 'Defense Meteorological Satellite Program', 'Military weather satellite', 'general', 'Space')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('974b44ff-998d-4f9f-bdec-8295eee00583'::UUID, 'COP', 'common operating picture', 'common operating picture', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9778fbb2-75a5-473c-b2c8-c2ab4fc5fb4e'::UUID, 'TSGT', 'technical sergeant', 'technical sergeant', 'usaf', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('97ac007b-0dc8-4217-822d-3e8b826bd458'::UUID, 'RTB', 'Return to Base', 'Return to home location', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('97c65d1a-414d-4f5a-8207-c1805cd14825'::UUID, 'IPAC', 'Installation Personnel Admin Center', 'Marine Corps HR office', 'usmc', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('97cfc44f-3aec-4f06-9e13-497f3dfc66c7'::UUID, 'JWAC', 'Joint Warfare Analysis Center', 'Military targeting and analysis center', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('98173de4-bd8e-42db-9ca9-25f6f259c257'::UUID, 'Airmen', 'personnel', 'personnel', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('98495035-e29c-4623-9be9-7f9b4ed55e64'::UUID, 'ATG', 'Afloat Training Group', 'Navy ship readiness training team', 'navy', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('987d28c8-929e-4216-be5a-62bf7bd80272'::UUID, 'JPAS', 'Joint Personnel Adjudication System', 'Security clearance tracking database', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9888a884-a7ad-4cc6-95cd-f1c040dd2e42'::UUID, 'TAI', 'Target Area of Interest', 'Specific location for collection focus', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('988f8bec-9e23-416f-8ade-a94b71cac643'::UUID, 'TL', 'team leader', 'team leader', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('98b97b70-d3bb-4fbd-83cd-8974d3ae68fd'::UUID, 'USACE', 'US Army Corps of Engineers', 'federal construction and water resource agency', 'army', 'engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('98d1df6d-fa3d-4a22-a1af-bfea549b6365'::UUID, 'CONPLAN', 'Contingency Plan', 'contingency response plan', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('98d9d423-6b27-4cc0-bc25-10f44a86c77b'::UUID, 'SBIRS', 'Space-Based Infrared System', 'Missile warning satellite constellation', 'general', 'Space')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('991f505d-2224-4549-b318-6b2fa567d595'::UUID, 'BCA', 'fitness standards assessment', 'fitness standards assessment', 'navy', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9951c3af-f1e0-47dc-b599-0944116e22bb'::UUID, 'soldiers', 'personnel', 'personnel', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9998fdf3-9d33-4cf1-a173-070e0457a3e1'::UUID, 'SNCOIC', 'senior NCO in charge', 'senior NCO in charge', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9a43104c-f521-47b8-a537-f8103c1da736'::UUID, 'TSP', 'Thrift Savings Plan', 'Thrift Savings Plan', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9a54eb00-4e34-40b9-99d5-9dae1049cac8'::UUID, 'TQL', 'total quality leadership', 'total quality leadership', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9ad8e996-c432-4662-802d-964afe0242fe'::UUID, 'bridge', 'control center', 'control center', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9b3bc0d3-0fb5-4f0f-b408-b5ac14a8d9dd'::UUID, 'FSRM', 'Facilities Sustainment, Restoration, and Modernization', 'Building maintenance and upgrade program', 'general', 'Engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9bb91721-8932-4054-b042-cffca4f237b2'::UUID, 'CELLEX', 'Cellphone Exploitation', 'Mobile device forensic analysis', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9bddc540-9381-4972-bb3c-ecd14c4c9aa6'::UUID, 'FHP', 'Force Health Protection', 'occupational health and safety program', 'general', 'medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9c235337-e58a-4cba-8a6d-56b0e4fc7cfb'::UUID, 'EMO', 'electronics material officer', 'electronics material officer', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9c389cae-7663-418c-8693-fd1b9674ad21'::UUID, 'POE', 'Port of Embarkation', 'Departure port', 'general', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9c6eef92-bbf6-44cb-9a32-ec707f031a81'::UUID, 'DH', 'department head', 'department head', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9c959377-1a44-4db5-8b10-fa12823f2337'::UUID, 'CGC', 'Coast Guard Cutter', 'Coast Guard Cutter', 'uscg', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9cef84fc-a45c-415f-afc5-e6267dd1a926'::UUID, 'SMMC', 'Sergeant Major of the Marine Corps', 'Sergeant Major of the Marine Corps', 'usmc', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9d20495b-2bcd-47bd-8bc7-0821719764b3'::UUID, 'GSE', 'gas turbine systems electrician', 'gas turbine systems electrician', 'navy', 'Rating')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9d400d57-9095-4f63-bb2f-b44f1167360e'::UUID, 'ISIC', 'immediate superior command', 'immediate superior command', 'navy', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9e0501d1-cbc8-4de7-86be-f152f5c9c426'::UUID, 'TADSS', 'training aids and devices', 'training aids and devices', 'army', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9e1827f7-44cd-4183-901c-608ff8ab4180'::UUID, 'PSG', 'platoon sergeant', 'platoon sergeant', 'army', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9e55f12f-f2a8-4f24-a8e3-c65097822c1e'::UUID, 'FM', 'field manual', 'field manual', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9e5cf615-c5a5-4556-976a-835ac58f0b4d'::UUID, 'AIM', 'Air Intercept Missile', 'Aircraft-launched air-to-air missile', 'general', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9ec23f75-28ff-42c9-8e8a-09834f4fdc5a'::UUID, 'SGT', 'sergeant', 'sergeant', 'army', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9ef030f4-e6a2-45e3-80df-ee3ed31d476e'::UUID, 'ASR', 'Alternate Supply Route', 'backup transportation route', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('9f00648a-a0d4-45d3-930e-e494ea7fa0bb'::UUID, 'ASP', 'Ammunition Supply Point', 'Ammunition storage and distribution facility', 'general', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a01a8916-810a-47b2-9784-1ddd4e7a5a81'::UUID, 'equipage', 'equipment', 'equipment', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a076d68b-6500-417d-8b1b-ef7a06b62fb6'::UUID, 'SPACECOM', 'U.S. Space Command', 'Military space operations command', 'general', 'Space')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a096765f-35a1-453f-b76b-d25bafbebbaf'::UUID, 'S3', 'operations/training', 'operations/training', 'army', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a0a07d61-7abc-49e6-883b-f1cd37f6bec5'::UUID, 'JRTC', 'Joint Readiness Training Center', 'Joint Readiness Training Center', 'army', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a0a5a146-f056-4786-845a-10e592e58126'::UUID, 'WCS', 'Maintenance Team Lead', 'Maintenance Team Lead', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a0d11478-f2b0-45ec-ad16-0f75f0b49891'::UUID, 'AHLTA', 'Armed Forces Health Longitudinal Technology Application', 'electronic health records system', 'general', 'medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a0d644c7-c840-4b49-88c1-057048634774'::UUID, 'USTRANSCOM', 'U.S. Transportation Command', 'Joint military transportation headquarters', 'general', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a1180b23-6c9a-470c-9cc6-d7bb3c48e456'::UUID, 'CLB', 'Combat Logistics Battalion', 'Marine logistics unit', 'usmc', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a1868db4-6f65-404e-96eb-11e51dfe4937'::UUID, 'SQ', 'squadron', 'squadron', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a18e4a8e-f164-4cd7-8ebd-f1061566db2f'::UUID, 'CNAF', 'Commander Naval Air Forces', 'naval aviation command', 'navy', 'aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a1eaf20f-168a-40c7-8b16-fe3a331699d4'::UUID, 'NMC', 'Not Mission Capable', 'Aircraft not ready for operations', 'general', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a1f8de10-e056-4d8d-9b18-60a7ef78e263'::UUID, 'ABCT', 'armored brigade combat team', 'armored brigade combat team', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a1fe0e12-794f-4ace-b47f-dfee41748998'::UUID, 'TACON', 'Tactical Control', 'Temporary operational authority', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a230304d-f608-4435-babe-6822ec80112e'::UUID, 'PRT', 'Physical Readiness Test', 'Physical fitness assessment', 'navy', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a24a49ae-ddf7-4343-8cac-bf89d5361e6a'::UUID, 'SURFLANT', 'surface forces Atlantic', 'surface forces Atlantic', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a2586a62-8df6-4d3d-aded-48e4bbe18c73'::UUID, 'J-2', 'Joint Intelligence', 'Joint intelligence staff', 'general', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a25cf6be-92dc-43e1-9362-b7b050896cb0'::UUID, 'material readiness', 'equipment readiness', 'equipment readiness', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a2b79899-3191-4bb8-9a21-bae0b3ed4747'::UUID, 'SEAVAN', 'Sea Van', 'Ocean shipping container', 'general', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a30c87e5-20a7-4dcc-a282-74e4bdaca992'::UUID, 'SURFPAC', 'surface forces Pacific', 'surface forces Pacific', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a358a952-5a00-4870-a1f3-c700cecc07c4'::UUID, 'ERB', 'personnel record', 'personnel record', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a3984009-0664-460d-a340-fb419b700075'::UUID, 'GWOT', 'Global War on Terrorism', 'Post-9/11 military operations era', 'general', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a3ecbaf5-4f6a-40c4-ab01-b7d7ee093c96'::UUID, 'OCS', 'Officer Candidate School', 'Commissioning program for enlisted/civilian', 'general', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a408290e-ce61-485d-b9b7-49314bb2dc88'::UUID, 'EOOW', 'engineering watch officer', 'engineering watch officer', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a43a7129-881c-484a-91d3-1769751765fb'::UUID, 'IMCOM', 'Installation Management Command', 'Installation Management Command', 'army', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a458e41d-4902-4f45-9ec8-a18261f858c5'::UUID, 'ADCON', 'Administrative Control', 'Administrative authority', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a4a33170-d9ca-4562-a517-ba74ea178436'::UUID, 'LOR', 'letter of reprimand', 'letter of reprimand', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a4e65708-888a-4d52-bc87-24345370d551'::UUID, 'OPSEC', 'operations security', 'operations security', 'general', 'Security')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a51456cd-2afc-4349-8cf9-874ba3bb8f13'::UUID, 'SPOTREP', 'incident report', 'incident report', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a520f566-4524-4ce4-a97b-acea3309d71a'::UUID, 'MM', 'machinist''s mate', 'machinist''s mate', 'navy', 'Rating')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a5db7288-15e2-4abf-9d67-3266ef16137b'::UUID, 'GFEBS', 'financial management system', 'financial management system', 'army', 'System')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a64640d4-96bd-4e1a-83dc-ed8d1e8a42e0'::UUID, 'SCA', 'Security Control Assessor', 'Independent security auditor', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a649119b-b056-4b74-8ab7-020a7fcd3b6c'::UUID, 'OPSEC', 'Operations Security', 'Protection of sensitive information', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a6777b49-34a7-47eb-b020-89a262042cba'::UUID, 'TAD', 'temporary assignment', 'temporary assignment', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a69c10a9-4fef-40c2-881b-cbdc1a2bdee1'::UUID, 'CAB', 'combat aviation brigade', 'combat aviation brigade', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a718b282-e83e-49ad-91dc-3e66169dfcd4'::UUID, 'S-6', 'Communications/IT Section', 'IT department', 'army', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a736dc20-45fb-4f35-94ba-6c7bbceedfc7'::UUID, 'HSM', 'Helicopter Maritime Strike Squadron', 'Navy anti-submarine helicopter squadron', 'navy', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a73de1eb-1286-4b82-a55d-689e0805088b'::UUID, 'EOD', 'explosive ordnance disposal', 'explosive ordnance disposal', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a799a467-a4eb-4856-8aa1-6e64c8759973'::UUID, 'AFSPC', 'Air Force Space Command', 'Air Force Space Command', 'usaf', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a7cb271c-87c6-48cf-a619-0a9029dd824b'::UUID, 'S4', 'logistics/supply', 'logistics/supply', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a854bd08-d020-4b36-ad00-10063544fe09'::UUID, 'PQS', 'personnel qualification standards', 'personnel qualification standards', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a859f5a1-8866-464d-a482-8a4f75542a78'::UUID, 'PZ', 'Pickup Zone', 'Personnel/cargo collection point', 'general', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a86348aa-4b04-449b-ab04-c41c383ffb99'::UUID, 'reveille', 'morning wake-up', 'morning wake-up', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a88be76f-b86b-4c17-9bd5-17906f83e5ef'::UUID, 'SAP', 'special access program', 'special access program', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a8c4b054-6289-4f36-9756-4afa63824ad7'::UUID, 'TEMADD', 'Temporary Additional Duty', 'Short-term training assignment', 'navy', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a9839651-aae2-4d95-a560-e2780f65b93f'::UUID, 'JOC', 'Job Order Contract', 'Quick-turnaround construction contract', 'general', 'Engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a9a5efa2-7652-46e2-8b10-7f9dd3a1893c'::UUID, 'WMEC', 'medium endurance cutter', 'medium endurance cutter', 'uscg', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('a9cf306b-6fd7-4e38-b6f6-3eb92f5d6901'::UUID, 'CI', 'Counterintelligence', 'insider threat prevention and security investigation', 'general', 'intel')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('aac0c3ce-cb7c-4f8c-9a5e-7fb086c6b8c8'::UUID, 'PMS', 'preventive maintenance', 'preventive maintenance', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('aad3ecff-c761-417f-8ba0-dc8df4cb0413'::UUID, 'QC', 'quality control', 'quality control', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ab131282-3fb3-4bcc-a71c-523e49ec3879'::UUID, 'EOF', 'Escalation of Force', 'Progressive response procedures', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ab1abd17-e476-432d-87b9-f74f05d8c9ed'::UUID, 'SWPPP', 'Stormwater Pollution Prevention Plan', 'Environmental runoff management plan', 'general', 'Engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ab4ef19c-9b43-4c4f-9ae3-581749b0bee0'::UUID, 'GI party', 'deep cleaning', 'deep cleaning', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('aba11703-c7e3-4832-87ae-f65c16dd2503'::UUID, 'NIPR', 'Non-classified Internet Protocol Router', 'unclassified network', 'general', 'cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ac2c5df3-8018-4801-8203-887e3945879a'::UUID, 'MOL', 'Marine Online portal', 'Marine Online portal', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ac6c73e6-1a41-46fd-9b69-eee6313d83a7'::UUID, 'SCLSIS', 'Ships Configuration and Logistics Support Information System', 'Configuration management system', 'navy', 'technical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('acac6d6f-0007-43ca-a6dc-7e9d36cae5e6'::UUID, 'ESS', 'Enterprise Security Stack', 'Centralized network security platform', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('acc9053a-48a2-46e0-81b0-d8e3afeee319'::UUID, 'RED HORSE', 'Rapid Engineer Deployable Heavy Operational Repair Squadron Engineers', 'rapid construction and repair unit', 'usaf', 'engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('acdbd8c8-c912-4a91-b1c7-27bc1b8383da'::UUID, 'NIPR', 'Non-classified Internet Protocol Router Network', 'Unclassified government network', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ace55380-2c2c-4030-aae9-b77d1494aa3d'::UUID, 'ERB', 'Enlisted Record Brief', 'Personnel summary record', 'army', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ace7b6aa-0e00-4779-8f0c-31aa50504c1b'::UUID, 'AEHF', 'Advanced Extremely High Frequency', 'Secure military satellite communications', 'general', 'Space')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ad3076bc-a982-4bbe-a903-5e3d0fb14226'::UUID, 'ladder well', 'stairwell', 'stairwell', 'general', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ad69f769-a63c-4b06-994a-0d73536e0705'::UUID, 'FC', 'fire controlman', 'fire controlman', 'navy', 'Rating')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('adb5da1c-83a9-410f-a2da-ec8e933cbc96'::UUID, 'CCC', 'command career counselor', 'command career counselor', 'navy', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ae247771-68a2-4c38-8e73-b3fe312e62ea'::UUID, 'SITREP', 'status report', 'status report', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ae2ae8eb-1061-4c86-ae7b-3899cfcd9046'::UUID, 'AB', 'airman basic', 'airman basic', 'usaf', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ae6cdcaf-975f-4cdd-bfc0-ae2fbc789ba6'::UUID, '3MA', 'Maintenance Program Manager', 'Maintenance Program Manager', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ae6d5d8a-2736-4114-879a-ecc5fd00bc33'::UUID, 'PAO', 'public affairs', 'public affairs', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('af1f0d6d-8b00-4ff3-9313-033c303e6c33'::UUID, 'OICC', 'Officer in Charge of Construction', 'Senior construction oversight officer', 'navy', 'Engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('afbf4ba6-97b0-437d-8183-809283c243a7'::UUID, 'ECP', 'entry control point', 'entry control point', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('afcef098-768d-4c56-bc1c-f0ce3b5dd27e'::UUID, 'LZ', 'Landing Zone', 'Helicopter landing area', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b0c7c753-d357-49fc-b0b4-5a8b5e52d528'::UUID, 'FLC', 'fleet logistics center', 'fleet logistics center', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b0fe6455-de58-45c4-b017-583a95d84f29'::UUID, 'ROE', 'Rules of Engagement', 'Operational conduct guidelines', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b130ce62-0e0b-4ff0-a1a6-bb8eee0474c9'::UUID, 'SAROPS', 'search and rescue planning system', 'search and rescue planning system', 'uscg', 'System')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b1561fca-4f45-427e-91d3-249a1c205f2f'::UUID, 'PBO', 'property book officer', 'property book officer', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b17c909f-652f-483d-bcfc-06e1925722f0'::UUID, 'DIVO', 'division officer', 'division officer', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b1925856-8f0b-47d4-abfe-0e608a9ff404'::UUID, 'OPREP', 'operational report', 'operational report', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b193c823-d315-4a89-bf4d-02809f8920c8'::UUID, 'PX', 'retail store', 'retail store', 'general', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b1a56485-52b9-4b0a-a8bc-c1d4c88eb711'::UUID, 'DNI', 'Director of National Intelligence', 'Head of U.S. intelligence community', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b1a86f87-a98f-4367-a190-0bbf9c5a7d15'::UUID, 'DC', 'damage control', 'damage control', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b1bcb7c6-70a3-4d5f-bcc2-6ccc53c7e5c2'::UUID, 'AKO', 'Army knowledge portal', 'Army knowledge portal', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b1f89385-8d56-45b2-955d-bc4f98969384'::UUID, 'NEL', 'Navy e-Learning', 'Navy e-Learning', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b1f9d5a7-9b41-4ec5-9b5c-69f606bc9d0e'::UUID, 'OTS', 'Officer Training School', 'Air Force commissioning program', 'usaf', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b2061f15-b9b5-41cd-8e06-87749217f2a1'::UUID, 'CLS', 'Combat Lifesaver', 'basic emergency medical technician', 'general', 'medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b21bb021-a7da-4765-bcc6-dcb31bfdb4f0'::UUID, 'CVW', 'Carrier Air Wing', 'Aircraft carrier aviation unit', 'navy', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b270b457-b2f4-47f6-93cf-039e936943a7'::UUID, 'SAPR', 'sexual assault prevention', 'sexual assault prevention', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b3023019-0e04-4c5e-98f5-fe0a21bce1dd'::UUID, 'IED', 'Improvised Explosive Device', 'Improvised explosive threat', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b31d69c2-d415-4bbc-b423-2c972b6efac3'::UUID, 'PKI', 'Public Key Infrastructure', 'digital certificate management system', 'general', 'cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b39511c4-c330-4149-b66d-6f158b251724'::UUID, 'DIACAP', 'DoD Information Assurance Certification', 'Legacy security compliance framework', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b3dcb55a-4c73-4e1a-9060-82868edc3b0c'::UUID, 'WPB', 'patrol boat', 'patrol boat', 'uscg', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b3e4cf8e-df56-49f9-9a04-7fe4d03978c9'::UUID, 'WOBC', 'Warrant Officer Basic Course', 'Initial warrant officer training', 'army', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b40f7528-7958-4e65-bf0c-14ebc833c0a2'::UUID, 'ADMIN', 'administration', 'administration', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b42c9c45-47d4-4359-9111-70eb269d974c'::UUID, 'SARSS', 'Standard Army Retail Supply System', 'retail supply management system', 'army', 'logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b4368b7a-2b63-4513-a7e4-56da389fc058'::UUID, 'JWICS', 'Joint Worldwide Intelligence Communications System', 'top-secret network', 'general', 'cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b4c79116-4923-41ac-a957-391a46305cdf'::UUID, 'MEDEX', 'Media Exploitation', 'Digital media forensic analysis', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b53ff452-504e-4d46-a669-b1a4ba8dd5d4'::UUID, 'BEQ', 'enlisted lodging', 'enlisted lodging', 'general', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b547c366-f3f2-4de3-a008-98cea31094b1'::UUID, 'LOC', 'letter of counseling', 'letter of counseling', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b59da1c6-a37f-4c75-993b-9841323bc092'::UUID, 'ONI', 'Office of Naval Intelligence', 'Navy intelligence headquarters', 'navy', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b5c50648-2ea7-48fb-ac96-b882c93dfc96'::UUID, 'IMDS', 'maintenance data system', 'maintenance data system', 'usaf', 'System')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b5d33dfd-9b66-4b4a-800a-6f33042033c2'::UUID, 'ISRD', 'Initial Space Resiliency Design', 'Survivable space system architecture', 'ussf', 'Space')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b5d8c708-a360-4aea-aced-cd19bb4c16cb'::UUID, 'bulkhead', 'wall', 'wall', 'general', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b5e41a9d-fc06-431a-a5fe-63c6307f14c0'::UUID, 'COSAL', 'Coordinated Shipboard Allowance List', 'Authorized parts inventory list', 'navy', 'technical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b5eaac28-799d-4616-abaf-18530b3c756a'::UUID, 'HUMINT', 'Human Intelligence', 'human source information gathering', 'general', 'intel')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b618084c-635d-48ec-b088-19735e01820c'::UUID, 'SPOD', 'Seaport of Debarkation', 'Military sea cargo receiving terminal', 'general', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b61d21f0-2881-4047-bc38-a24b1a231185'::UUID, 'NSIPS', 'Navy Standard Integrated Personnel System', 'Navy HR database', 'navy', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b621b16d-dde7-417f-9d9a-d34abe306850'::UUID, 'TWMS', 'Total Workforce Management Services', 'Navy training tracking system', 'navy', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b6f3c90c-b7f1-4487-8926-a2cda8ea87af'::UUID, 'CNSP', 'Commander Naval Surface Forces Pacific', 'Commander Naval Surface Forces Pacific', 'navy', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b6f849da-faf6-4050-80dd-7d222b63583a'::UUID, 'formation', 'group assembly', 'group assembly', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b7279336-feb9-4ec3-8866-395a80fdc284'::UUID, 'MAW', 'Marine Aircraft Wing', 'Marine Aircraft Wing', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b72a3548-ae87-4b54-a5f4-76796322258a'::UUID, 'TOPMIS', 'Total Officer Personnel Management Information System', 'Army officer management system', 'army', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b751f5b0-5a35-4f40-9138-4d9475e3e68c'::UUID, 'USSF', 'United States Space Force', 'U.S. military space service branch', 'ussf', 'Space')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b7cfb58e-13a6-4b1a-befd-ea7f90236569'::UUID, 'DTS', 'travel management system', 'travel management system', 'army', 'System')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b7e12ccf-c3d4-4722-b2df-7d5893a3ed31'::UUID, 'CGSC', 'Command and General Staff College', 'Army mid-career officer school', 'army', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b7fd3dfe-785a-4f50-a853-877ee22e4760'::UUID, 'DAFSC', 'duty specialty code', 'duty specialty code', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b842e63c-b39e-4763-a493-4fe6b3d13594'::UUID, 'KIA', 'killed in action', 'killed in action', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b8c28ad9-9541-4784-a46f-8d14ef335f0d'::UUID, 'OPCON', 'Operational Control', 'Full operational authority', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b8db79c2-f7fe-4e63-bb4e-75ac8eaf9311'::UUID, 'SNEC', 'Senior NCO Education Course', 'Senior leadership course', 'general', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b967936f-b483-4100-9f93-90f67794dfb2'::UUID, 'COA', 'Course of Action', 'Action plan/strategy option', 'general', 'planning')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b99d2e1d-83f1-4b33-8e27-fbbc6bb4641a'::UUID, 'PME', 'professional military education', 'professional military education', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b9cdcdc7-bee9-4cb0-862c-0e2083b2dfe8'::UUID, 'LCPO', 'senior team lead', 'senior team lead', 'navy', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b9ef04b9-7b47-4aca-bfee-46cef88be43b'::UUID, 'PSD', 'Personnel Support Detachment', 'Navy base HR office', 'navy', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('b9f2a81b-6357-44a8-93d6-34b0f67900a7'::UUID, 'TPT', 'Tactical PSYOP Team', 'Small psychological operations unit', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ba095e66-b4f6-45f1-8fc9-ac9be3caf87f'::UUID, 'WLC', 'Warrior Leader Course', 'junior leadership development course', 'army', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ba39978c-ee03-4388-a2d8-d2166e2b2878'::UUID, 'BX', 'retail store', 'retail store', 'general', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('bacfe4c9-45ad-43a9-bb07-106708fe2f56'::UUID, 'EPME', 'Enlisted Professional Military Education', 'NCO development programs', 'general', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('bb202193-055a-41e4-8aa2-db8368112067'::UUID, 'HUMINT', 'Human Intelligence', 'Human-source intelligence', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('bba28bf8-ca0b-42c0-b641-c536244dd3ff'::UUID, 'ACSC', 'Air Command and Staff College', 'Air Command and Staff College', 'usaf', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('bbb0f138-265e-48d3-9c12-e71bf5a4e29d'::UUID, 'WEPS', 'weapons officer', 'weapons officer', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('bbb488c2-c8b0-4837-b8b7-2b7c870245a8'::UUID, 'SLC', 'Senior Leader Course', 'senior management development course', 'army', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('bbb93066-6857-4302-b068-f6566c6dbeab'::UUID, 'MCX', 'retail store', 'retail store', 'general', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('bbe22aab-39bc-42dc-8f5e-7183867cbf75'::UUID, 'RMF', 'Risk Management Framework', 'Cybersecurity compliance framework', 'general', 'technical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('bbf7b77b-aa76-4b25-b3bc-e94c8b23a42c'::UUID, 'MX', 'maintenance', 'maintenance', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('bc6d4454-ae14-458b-87b2-41e9aebcf2d7'::UUID, 'CFT', 'combat fitness test', 'combat fitness test', 'usmc', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('bd5569a3-edb7-4794-85f0-edade7192f93'::UUID, 'EAOS', 'end of service obligation', 'end of service obligation', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('bda2f882-06a8-4ea1-a315-1de91da25b6f'::UUID, 'FAR', 'Federal Acquisition Regulation', 'government procurement regulations', 'general', 'financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('bdb94e11-3dc4-4c5b-9be6-26d144f628db'::UUID, 'SMP', 'squadron maintenance program', 'squadron maintenance program', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('bdde8c52-8d2e-484b-a9f3-ce186cdf80e6'::UUID, 'FMC', 'Fully Mission Capable', 'Aircraft 100% ready', 'general', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('be0b9a19-909d-47a9-a79e-ccbfe572ef53'::UUID, 'HM', 'hospital corpsman', 'hospital corpsman', 'navy', 'Rating')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('be489ec1-632e-44cd-988e-20040dfda362'::UUID, 'JOOD', 'Junior Officer of the Deck', 'Assistant operations shift supervisor', 'navy', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('be6c1aee-42bf-4d2a-8c99-a1cb1a3c7e83'::UUID, 'MCPON', 'Master Chief Petty Officer of the Navy', 'Senior enlisted Navy advisor', 'navy', 'organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('be95ae81-6d8a-44eb-a0c2-5161b74218e7'::UUID, 'JPME', 'Joint Professional Military Education', 'Joint operations education', 'general', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('be9e5b1e-b60a-4a04-be78-43ac90f14292'::UUID, 'DMC', 'Distribution Management Center', 'Logistics coordination facility', 'general', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('becf04c4-b55e-499d-8a3e-2f3972e9c5b3'::UUID, 'CSO', 'Chief of Space Operations', 'Chief of Space Operations', 'ussf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('bef87f21-8a97-44a3-ae6f-f0123df9f380'::UUID, 'NGA', 'National Geospatial-Intelligence Agency', 'Satellite and geographic analysis agency', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('bf03c550-925c-4387-96f8-72a93d1f1530'::UUID, 'NORTHCOM', 'Northern Command', 'Northern Command', 'general', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('bf4f533e-ea78-44b8-96b7-12af1adce33a'::UUID, 'CTN', 'cryptologic technician (networks)', 'cryptologic technician (networks)', 'navy', 'Rating')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('bf607ab5-e7a8-4715-9c3c-80a61d1b0cf4'::UUID, 'PIR', 'Priority Intelligence Requirements', 'Intelligence collection priorities', 'general', 'planning')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('bf80f3a1-be27-485c-bb4e-dd862a52d293'::UUID, 'DIVARTY', 'division artillery', 'division artillery', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('bf9b6390-18c9-4e5f-a728-b9b0aa5ddd39'::UUID, 'J-3', 'Joint Operations', 'Joint operations staff', 'general', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('bfa16b2e-dcdc-4d1d-ba01-83bff429d51f'::UUID, 'PME', 'Professional Military Education', 'Military career development courses', 'general', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('bfc58afb-4e0f-41c1-b4c3-53d58cae4208'::UUID, 'OPORD', 'operations order', 'operations order', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c0e85544-ee0a-4ade-b744-16d273f18a3d'::UUID, 'MALS', 'Marine Aviation Logistics Squadron', 'Marine Aviation Logistics Squadron', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c16c647c-03db-4fe8-bd2f-5b10c6f23e7c'::UUID, 'chit', 'request form', 'request form', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c18a6a01-c970-4118-8185-49a5fe13f9b1'::UUID, 'MACC', 'Multiple Award Construction Contract', 'Pre-competed construction contract vehicle', 'general', 'Engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c239e2f1-17cb-4af7-93e0-ab75ad4db377'::UUID, 'INSCOM', 'Intelligence and Security Command', 'Army intelligence operations command', 'army', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c23c3d96-bf36-48a1-8657-e331a5273df4'::UUID, 'MEB', 'Medical Evaluation Board', 'Medical fitness-for-duty review', 'general', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c28f93ae-faee-4b47-9ded-880f211cb69d'::UUID, 'CNDSP', 'Computer Network Defense Service Provider', 'Managed cybersecurity service', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c2c7ebad-9b73-4520-a38a-657b2725dffc'::UUID, 'PDHRA', 'Post-Deployment Health Reassessment', 'Follow-up deployment health check', 'general', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c306bbb7-6103-4302-85b2-e04cf50c2f32'::UUID, 'JTF', 'joint task force', 'joint task force', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c369abbe-c590-4a38-955b-72cc0baaa25a'::UUID, 'FOUO', 'for official use only', 'for official use only', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c3afa291-703c-49ae-8d70-7097bef298cc'::UUID, 'TIC', 'Troops in Contact', 'active engagement / critical incident', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c3e1496a-566e-43c5-bca0-91c2f89875f3'::UUID, 'TECOM', 'Training and Education Command', 'Training and Education Command', 'usmc', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c42fc15a-52b2-4014-bd89-1785200910e4'::UUID, 'OOD', 'Officer of the Deck', 'Ship operations shift supervisor', 'navy', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c44003c2-5388-4fa8-94f5-0f081b3cb0cb'::UUID, 'NMCP', 'Naval Medical Center Portsmouth', 'Navy hospital', 'navy', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c44e0574-5f09-4712-bb34-25bd75c84632'::UUID, 'ORM', 'operational risk management', 'operational risk management', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c4649934-e01b-49d4-b064-9cff9b2d550f'::UUID, 'Soldier', 'team member', 'team member', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c4710ec3-965e-4f5e-9434-80bb11e7eca7'::UUID, 'APFT', 'physical fitness test', 'physical fitness test', 'army', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c48c7448-e8d3-4c48-8d3b-9f7bbe2938a0'::UUID, 'NCOER', 'performance evaluation', 'performance evaluation', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c49fd2a9-cb6c-4012-bc22-17d5b569a342'::UUID, 'HVT', 'High-Value Target', 'Priority person or asset of interest', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c5b05936-78fe-4c54-b346-49ad0ab6e45e'::UUID, 'LOO', 'Line of Operation', 'Operational focus area', 'general', 'planning')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c5c86197-8f8f-4912-835b-be5f3caea28a'::UUID, 'Coastguardsman', 'team member', 'team member', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c5c9edcf-f182-4594-b900-cee5b4de68dc'::UUID, 'AWP', 'parts shortage', 'parts shortage', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c63e89eb-d1b4-4872-b1af-302cf0fade25'::UUID, 'BDE', 'brigade', 'brigade', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c64e5d1b-9eea-45b9-a1a8-60e70b062eae'::UUID, 'ISIC', 'Immediate Superior in Command', 'Next higher headquarters', 'navy', 'organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c69b03aa-06c1-41fb-82d0-370247602ba7'::UUID, 'PATFORSWA', 'patrol forces Southwest Asia', 'patrol forces Southwest Asia', 'uscg', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c71a448a-c57e-4007-8113-cc99dc8f6828'::UUID, 'PFC', 'private first class', 'private first class', 'army', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c759af4f-f553-44e7-9dbe-a9547548a2aa'::UUID, 'NEX', 'retail store', 'retail store', 'general', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c760b3eb-1096-44fc-b1ae-caf9645f12c1'::UUID, 'CAFSC', 'control specialty code', 'control specialty code', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c78551fc-68a0-4e92-89a3-3a88203db54e'::UUID, 'MDR', 'Managed Detection and Response', 'Outsourced security monitoring service', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c821d393-468f-4542-96d9-03d2b07a65b7'::UUID, 'DCMS', 'Deputy Commandant for Mission Support', 'Deputy Commandant for Mission Support', 'uscg', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c844fff7-8c62-4694-8c22-ad608a6d6f55'::UUID, 'ACFT', 'combat fitness test', 'combat fitness test', 'army', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c85acf8b-730b-4330-abe6-568b5502fef7'::UUID, 'RAS', 'replenishment at sea', 'replenishment at sea', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c85ec6a4-9f4d-4f97-a544-60c9b1b763f2'::UUID, 'J6', 'joint communications', 'joint communications', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c920fe70-f2a7-4dee-ae71-9b72a5074bc9'::UUID, 'LOO', 'Lines of Operation', 'operational approach / strategic framework', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c9398a69-b181-4c24-a04a-a64324626779'::UUID, 'ALCON', 'All Concerned', 'all stakeholders / all recipients', 'general', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c94e533a-2639-4079-a75b-e3c833d7c5dd'::UUID, 'BAH', 'housing allowance', 'housing allowance', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c94fbc3e-4f89-4a58-a6a0-4ce7d3422bdd'::UUID, 'BDA', 'Battle Damage Assessment', 'Post-event effectiveness evaluation', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c9891a1e-fe20-487e-8724-f11438c0b5a1'::UUID, 'EPR', 'performance evaluation', 'performance evaluation', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c9adb351-878c-434d-b2c0-04b9d90b2bcf'::UUID, 'COMMS', 'communications', 'communications', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c9f74e01-2d93-46ab-9e7f-2d9b2e0a2b8b'::UUID, 'ROE', 'Rules of Engagement', 'Authorization/conduct guidelines', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('c9fa0b95-14e8-4cf5-8676-ce87d9934952'::UUID, 'BLUFOR', 'friendly force', 'friendly force', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ca740b85-e485-4b95-a5e7-fdbf56cea629'::UUID, 'USAFE', 'US Air Forces in Europe', 'US Air Forces in Europe', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ca787f6f-5453-43d5-9e55-9baa4741c84d'::UUID, 'BLUF', 'Bottom Line Up Front', 'key takeaway first / executive summary first', 'general', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cab6be69-3996-4b2a-9a06-2fdd85fa61c1'::UUID, 'DoDIN', 'Department of Defense Information Network', 'DoD enterprise network', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cb10f7c6-1186-45cc-8897-52a234778cdb'::UUID, 'RFP', 'Request for Proposal', 'Solicitation for contractor bids', 'general', 'Engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cb238a9d-a26f-4864-8a52-fa703daa0a92'::UUID, 'PFT', 'physical fitness test', 'physical fitness test', 'usmc', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cb24839c-5c0a-43da-9738-5a2221b4031b'::UUID, 'OPPE', 'Operational Propulsion Plant Examination', 'Engineering readiness assessment', 'navy', 'compliance')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cb424b74-a786-461a-941f-60317688c8c2'::UUID, 'PBUSE', 'Property Book Unit Supply Enhanced', 'inventory management system', 'army', 'logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cb5229ad-8fc9-452c-ada4-1c7358df1b7d'::UUID, 'SPOC', 'Space Operations Command', 'Space Operations Command', 'ussf', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cb5d2364-13be-4626-9eb8-d19e5eda081b'::UUID, 'MILCON', 'Military Construction', 'capital construction budget', 'general', 'financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cb5e4701-6c72-4611-8e07-625580d82679'::UUID, 'MEDCOM', 'Medical Command', 'Army healthcare operations command', 'army', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cb856ac0-da33-4030-8860-984e79b12b66'::UUID, 'OCS', 'Officer Candidate School', 'Officer commissioning program', 'general', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cb9fb403-1779-4abe-86b0-2270adea1e25'::UUID, 'DEPORD', 'Deployment Order', 'deployment directive', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cba320cb-34f3-4164-a4a0-e3f6ffa1913d'::UUID, 'SOI', 'School of Infantry', 'School of Infantry', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cbb69978-2fbf-43d2-ae38-0b28e5d763ba'::UUID, 'AFMSA', 'Air Force Medical Support Agency', 'AF healthcare support organization', 'usaf', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cbe26847-6d44-4211-8b5c-58d9db039a09'::UUID, 'CNAL', 'Commander Naval Air Forces Atlantic', 'Commander Naval Air Forces Atlantic', 'navy', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cc1fcaed-cfe8-414f-a45e-e25595290e00'::UUID, 'INTREP', 'Intelligence Report', 'Finished intelligence product', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cc365d97-7fac-4c3d-8c74-0f00e8a74695'::UUID, 'JOOD', 'junior officer of the watch', 'junior officer of the watch', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cc778b35-fa7d-4609-8383-6a6cdc6fc9c0'::UUID, 'UCMJ', 'military justice code', 'military justice code', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cc945258-8c4d-425c-8260-f0185732ca0c'::UUID, 'NSA', 'naval support activity', 'naval support activity', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cd3dcba4-3178-4b4c-b2d7-9e61df9e03aa'::UUID, 'MSR', 'Main Supply Route', 'primary transportation route', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cdc75388-520f-4c72-8090-ce59b58aa3d4'::UUID, 'UMR', 'unit manning report', 'unit manning report', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cde57929-d928-47c7-b2f5-1c334c1cb31e'::UUID, 'TYCOM', 'Type Commander', 'Fleet type headquarters', 'navy', 'organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ce22bc82-ace0-403c-816d-6f1465703d5c'::UUID, 'DoD', 'Department of Defense', 'Department of Defense', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ce73d426-4777-44c5-be25-3cf0f082d43a'::UUID, 'DMDC', 'Defense Manpower Data Center', 'DoD personnel data management', 'general', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ce7d506f-3b91-4bf9-9736-efa43fd7587f'::UUID, 'deployment', 'overseas assignment', 'overseas assignment', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cea1366f-dfd8-496e-bf75-5b1764ffdef4'::UUID, 'DOD', 'Department of Defense', 'Department of Defense', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ced026ea-5b13-401b-8027-e610734452e1'::UUID, 'MC', 'Mission Capable', 'Aircraft ready for operations', 'general', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cf23dec2-3f61-45a1-8213-05db3a87f050'::UUID, 'ACE', 'aviation combat element', 'aviation combat element', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cf3f9a4a-a83d-46df-9ea8-7b0d81299ad6'::UUID, 'INDOPACOM', 'Indo-Pacific Command', 'Indo-Pacific Command', 'general', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cf6c0720-f5a0-41ce-9412-0341c0636342'::UUID, 'EDR', 'Endpoint Detection and Response', 'Device-level security monitoring', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cfccd86f-c727-417c-880f-f016f7a636f1'::UUID, 'VMM', 'Marine Medium Tiltrotor Squadron', 'Marine Medium Tiltrotor Squadron', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cfd879b4-46f8-41d2-8c67-128cc70d6679'::UUID, 'ACO', 'Airspace Control Order', 'Air traffic management directive', 'general', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('cffbdfec-98e2-4f79-b232-41e446d56190'::UUID, 'EPME', 'enlisted professional development', 'enlisted professional development', 'uscg', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d052559f-2d1f-43ee-b7f5-d29e8bf298a7'::UUID, 'GCE', 'ground combat element', 'ground combat element', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d06d033d-8b53-48c8-881a-4d1c2a31c57b'::UUID, 'BUMED', 'Bureau of Medicine and Surgery', 'Navy healthcare headquarters', 'navy', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d0718c8b-3241-4bb3-aebb-dea367d6d269'::UUID, 'BUMED', 'Bureau of Medicine and Surgery', 'Navy medical headquarters', 'navy', 'organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d0840063-2984-4e44-af89-2cd77a3899bf'::UUID, 'RMF', 'Risk Management Framework', 'cybersecurity risk management framework', 'general', 'cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d095c5c7-379b-4c7b-b59b-d01f14098027'::UUID, 'SSC', 'Space Systems Command', 'Space Force acquisition organization', 'ussf', 'Space')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d1336844-29a5-4b3f-a6a7-dd02d96d1c89'::UUID, 'TDY', 'Temporary Duty', 'Temporary assignment to another location', 'usaf', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d14a86c4-e2bd-4484-b825-cd7187b5f53b'::UUID, 'NSDC', 'National Space Defense Center', 'Space threat monitoring facility', 'general', 'Space')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d234dbe8-7ba8-4688-966d-37829052bbed'::UUID, 'EO', 'equal opportunity', 'equal opportunity', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d25f73c7-26ec-422a-a908-566edf3e603f'::UUID, 'IED', 'improvised explosive device', 'improvised explosive device', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d2b0be23-bb1a-4c71-a80e-ddecded0949c'::UUID, 'CEFMS', 'Corps of Engineers Financial Management System', 'USACE accounting system', 'army', 'Financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d2f0da63-d7b5-4424-8b6d-64f803fcb30a'::UUID, 'SOFA', 'Status of Forces Agreement', 'Legal framework for troops in foreign countries', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d2f57906-261b-47cf-ac3d-08d4b08d36dd'::UUID, 'FSC', 'Forward Support Company', 'Unit-level logistics company', 'army', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d2f5a47f-b82d-4d22-a75d-394c45129e00'::UUID, 'NJP', 'Non-Judicial Punishment', 'Administrative disciplinary action', 'general', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d2fcd135-80f9-426f-8244-7b2aa1f5b9e3'::UUID, 'CE', 'command element', 'command element', 'usmc', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d321f704-ca7d-46a7-9c7f-4014ebae66f0'::UUID, 'PCC', 'Pre-Command Course', 'Commander preparation training', 'general', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d3337efc-ce88-4fad-aeba-bb993d500943'::UUID, 'AHLTA', 'Armed Forces Health Longitudinal Technology Application', 'Military electronic health record system', 'general', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d34f621c-66f2-47b5-816c-74997c54d367'::UUID, 'DITSCAP', 'DoD IT Security Certification', 'Older security compliance process', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d36bb4cb-6a1f-4458-96be-ec3b7f646f8d'::UUID, 'MEDEVAC', 'Medical Evacuation', 'Medical transport by helicopter', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d3a7e0a9-321c-4ff5-95fc-3bc841d597df'::UUID, 'DEL', 'Delta (Space Force unit)', 'Space Force equivalent of a wing/group', 'ussf', 'Space')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d3a9138a-f4bc-4019-be9e-3d3ee7ab6acb'::UUID, 'ASEV', 'aircrew standardization evaluation', 'aircrew standardization evaluation', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d3c1a677-2255-473f-a6ae-151568fc89c0'::UUID, 'PT', 'physical training', 'physical training', 'general', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d486bf76-8ec8-4f02-8cdf-ba80838dc62e'::UUID, 'JSTARS', 'Joint Surveillance Target Attack Radar System', 'airborne surveillance and targeting platform', 'general', 'intel')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d615b783-7230-47ad-af5b-54bc41759c39'::UUID, 'STX', 'situational training exercise', 'situational training exercise', 'army', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d67ffa14-aaef-467d-8db2-09a80583f7b5'::UUID, 'CQC', 'Contractor Quality Control', 'Builder''s quality management program', 'general', 'Engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d6bc59c1-cc5b-4109-8577-3e8223c3a8df'::UUID, 'MLG', 'Marine Logistics Group', 'Marine Logistics Group', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d6e57d6f-e91d-4d58-be70-7c14e1a24f3b'::UUID, 'MSRT', 'maritime security response team', 'maritime security response team', 'uscg', 'Security')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d7bbd5d3-218f-45a2-9869-ce9deb85edba'::UUID, 'TACON', 'Tactical Control', 'Authority over unit tactical movement', 'general', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d808ecd9-850c-469e-86c3-e0d63abd96be'::UUID, 'OCO', 'Overseas Contingency Operations', 'Wartime supplemental funding', 'general', 'Financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d81f7974-c6ff-4f89-9a1f-7ad2112a942c'::UUID, 'J-4', 'Joint Logistics', 'Joint logistics staff', 'general', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d8338724-12c3-4225-ae77-1addc8471ee9'::UUID, 'TAP', 'transition assistance program', 'transition assistance program', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d858f302-63ab-475c-8594-ff3a36b08ec8'::UUID, 'ANAM', 'Automated Neuropsychological Assessment Metrics', 'Cognitive baseline testing tool', 'general', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d88acb15-07bd-481e-ac80-617df8cc3e57'::UUID, 'UTM', 'unit training manager', 'unit training manager', 'usaf', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d8f60696-23be-4b75-a8d5-dc8706c698da'::UUID, 'G2', 'division/corps intelligence', 'division/corps intelligence', 'army', 'Security')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d9229f44-1dbd-4887-8aa1-15a25698a7fc'::UUID, 'AFRICOM', 'Africa Command', 'Africa Command', 'general', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('d98d671e-7954-44f7-b0cd-63f07aa93ded'::UUID, 'ULLS', 'Unit Level Logistics System', 'unit-level inventory tracking system', 'army', 'logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('da535791-ef8a-49f7-b212-d2453e81a518'::UUID, 'SRB', 'selective reenlistment bonus', 'selective reenlistment bonus', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('dadf426f-5dd8-4241-9325-50ac5b70b86d'::UUID, 'LPO', 'team lead', 'team lead', 'navy', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('dba7d9f5-fc8a-4e9e-8948-6daded683f74'::UUID, 'OS', 'operations specialist', 'operations specialist', 'navy', 'Rating')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('dbd56c6f-def4-4a1d-9e72-265bf3300893'::UUID, 'TRADOC', 'Training and Doctrine Command', 'Army training headquarters', 'army', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('dc2273bb-58cc-4ea4-9f3b-9bbe5d3838e5'::UUID, 'DZ', 'Drop Zone', 'Parachute delivery area', 'general', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('dc3a2ccf-c73d-41d0-8bef-9b146c842fb6'::UUID, 'FEP', 'Final Evaluation Problem', 'Final readiness certification exercise', 'navy', 'compliance')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('dc743087-617a-47ca-95ab-1317d090aec4'::UUID, 'Marine', 'team member', 'team member', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('dcd94d2e-cb04-41ac-b13b-09d8721ed3ce'::UUID, 'OAAS', 'officer and enlisted performance', 'officer and enlisted performance', 'uscg', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('dcecd781-022b-4a82-ade7-2895119ab175'::UUID, 'PWD', 'Public Works Department', 'Base facilities management office', 'navy', 'Engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('dd0d4606-f3eb-4e75-8a39-88d83522e7f0'::UUID, 'ARCYBER', 'Army Cyber Command', 'Army cybersecurity operations command', 'army', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ddc4a72d-0bd2-42e4-914b-ae2bc87a061b'::UUID, 'IT', 'information technology', 'information technology', 'navy', 'Rating')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ddcbd69c-03e6-48d8-8411-7ad9f98536d4'::UUID, 'MARFORPAC', 'Marine Forces Pacific', 'Marine Forces Pacific', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('de4bd6ba-a416-435d-98cd-365ac0da2aa2'::UUID, 'AFCYBER', 'Air Forces Cyber', 'Air Force cybersecurity unit', 'usaf', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('df1c5aef-31cf-4b06-bfb8-46e8ea07677b'::UUID, 'ALMIS', 'asset logistics management', 'asset logistics management', 'uscg', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('df3c860b-9918-4897-a149-c1c276673d49'::UUID, 'J4', 'joint logistics', 'joint logistics', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('df57b85d-b553-4ae9-9bf7-19ed8a55a0a4'::UUID, 'JTAGS', 'Joint Tactical Ground Station', 'Transportable missile warning station', 'general', 'Space')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('df88e96f-cb41-4f50-8351-640f2324c22c'::UUID, 'HMLA', 'Marine Light Attack Helicopter Squadron', 'Marine AH-1/UH-1 squadron', 'usmc', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('df8d0253-817e-40f4-8329-2309cda8b15e'::UUID, 'ORE', 'Operational Readiness Examination', 'Readiness evaluation', 'general', 'compliance')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('dfc200b6-16c0-47d3-b50e-9a67ded4ad33'::UUID, 'HAZMAT', 'hazardous materials', 'hazardous materials', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e00026b6-e5fa-410b-a55a-3dd319149c40'::UUID, 'PPO', 'Personnel Processing Office', 'In/out-processing office', 'general', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e01216a3-79f9-4cda-9fe8-14f05401570d'::UUID, 'CNMF', 'Cyber National Mission Force', 'National-level cyber defense team', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e111115b-b118-49f8-97a2-e1d5484e54cb'::UUID, 'BCE', 'Base Civil Engineer', 'base facilities manager', 'usaf', 'engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e1347256-8981-4e87-9f0d-3271495fba7a'::UUID, 'PV2', 'private', 'private', 'army', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e1640dce-31d8-4c92-950d-85f28ec0229f'::UUID, 'AFGSC', 'Air Force Global Strike Command', 'Air Force Global Strike Command', 'usaf', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e18fbfbf-4b06-42f5-9ac3-3f9516d11a90'::UUID, 'DCCS', 'Damage Control Central Station', 'Emergency response command center', 'navy', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e1c24b94-c5cf-4ff6-9ef9-60173546beaf'::UUID, 'MCTFS', 'Marine Corps Total Force System', 'Marine Corps personnel database', 'usmc', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e1d04173-a9e2-4f89-a30d-5ee6bf161763'::UUID, 'OSINT', 'Open Source Intelligence', 'Publicly available information analysis', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e1eafdf5-da96-46b9-a102-1ac6d49862a8'::UUID, 'MCWL', 'Marine Corps Warfighting Lab', 'Marine Corps Warfighting Lab', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e247f7ff-e6ff-4dbd-b58a-d81e02206692'::UUID, 'EEI', 'Essential Elements of Information', 'Critical intelligence requirements', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e265c5d0-e5af-4a22-8cb9-fdda3886883d'::UUID, 'ANG', 'Air National Guard', 'Air National Guard', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e3452aa0-8e07-48f4-a7b0-83af34a4ad67'::UUID, 'FORCECOM', 'Force Readiness Command', 'Force Readiness Command', 'uscg', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e36d4d8b-73a9-4517-92b2-be376d7ac6e4'::UUID, 'SOAP', 'Subjective, Objective, Assessment, Plan', 'Standard medical documentation format', 'general', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e3aa2ee1-e5ea-48b8-81ed-7e096133820a'::UUID, 'OPR', 'officer performance report', 'officer performance report', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e3dc9ec1-757a-4f86-8e77-2293e8985dde'::UUID, 'ISG', 'first sergeant', 'first sergeant', 'army', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e3e09db5-f464-4d5a-8459-b77d315bde32'::UUID, 'UNREP', 'underway replenishment', 'underway replenishment', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e4389656-4f4e-4817-a43d-6efefd007b36'::UUID, 'AF', 'usaf', 'usaf', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e43a772a-6708-4755-937a-29d27e2a5c3b'::UUID, 'TCP', 'traffic control point', 'traffic control point', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e4dd00d9-8332-446b-95ad-c32063fe1c3c'::UUID, 'AFSOC', 'Air Force Special Operations Command', 'Air Force Special Operations Command', 'usaf', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e4dfa561-f13d-448b-ae1b-2c646a88cecd'::UUID, 'TRACEN', 'training center', 'training center', 'uscg', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e52d110d-7fce-4fc9-ac6c-f78aaf62b36e'::UUID, 'VERTREP', 'Vertical Replenishment', 'Helicopter supply transfer', 'navy', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e52eccd1-0fe9-4600-8762-ba8d8159dbd7'::UUID, 'guardians', 'personnel', 'personnel', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e5533e06-01ab-47af-98c1-8a3d82f2aa4e'::UUID, 'CCC', 'Captains Career Course', 'Mid-grade officer professional school', 'army', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e5a467ed-fb47-43ca-a32e-8d8c3de4d978'::UUID, 'SL', 'squad leader', 'squad leader', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e5c10dfe-cc24-4a6f-8f9a-f8158fac4167'::UUID, 'AWC', 'Air War College', 'Air Force senior officer education', 'usaf', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e5e3cf51-e4a0-4959-a28f-1bf3cdc1c43e'::UUID, 'APFT', 'Army Physical Fitness Test', 'Physical fitness assessment', 'army', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e663ff85-df9c-4b31-8008-1ef26f84c9d9'::UUID, 'WIA', 'wounded in action', 'wounded in action', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e6c4ccd8-a79f-40d2-ae7a-6ded94e86ede'::UUID, 'CAMS', 'maintenance system', 'maintenance system', 'usaf', 'System')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e7a17be0-1aac-4ba7-b2e0-8176be40441b'::UUID, 'IPB', 'Intelligence Preparation of the Battlefield', 'comprehensive environmental and threat analysis', 'general', 'intel')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e85fd4b3-a6b0-4a6f-9466-da9753583f67'::UUID, 'underway', 'at sea operations', 'at sea operations', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e86c32cf-4577-463e-9f74-0612e408a7dc'::UUID, 'GCSS-Army', 'Global Combat Support System-Army', 'Army logistics/supply management system', 'army', 'technical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e88fd920-f50c-4454-82d7-da855a29fdb3'::UUID, 'EEFI', 'Essential Elements of Friendly Information', 'critical internal information to protect', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e8959a68-8196-4f29-a4cb-d0c512760486'::UUID, 'GO81', 'maintenance management system', 'maintenance management system', 'usaf', 'System')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e89fe2fe-8981-4012-a9b0-7a92550fe47f'::UUID, 'G6', 'division/corps communications', 'division/corps communications', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e8e05ca1-bf08-470d-9258-b9c77da9a01f'::UUID, 'JRSOI', 'Joint Reception Staging Onward Movement and Integration', 'arrival processing and integration operations', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e9219747-20cb-486a-9877-592d16e9d15d'::UUID, 'AE', 'Architect-Engineer', 'Design professional / design firm', 'general', 'Engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e956b417-008c-4099-a8c4-9392ce1c28bd'::UUID, 'G1', 'division/corps personnel', 'division/corps personnel', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e9774c34-1bf6-489b-beac-8138bcf9721e'::UUID, 'ETS', 'end of service obligation', 'end of service obligation', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e995211c-c870-4e87-9522-f0c841f73700'::UUID, 'USO', 'United Service Organizations', 'United Service Organizations', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('e9bf36b8-836d-47bd-864e-b5f329b0a037'::UUID, 'AIRDET', 'aviation detachment', 'aviation detachment', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ea176c62-6900-43bb-ba4a-6346442c525b'::UUID, 'LOA', 'letter of admonishment', 'letter of admonishment', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ea19d4c6-5cc7-4a9c-9636-23cb744cdbae'::UUID, 'LRS', 'logistics readiness squadron', 'logistics readiness squadron', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ea39d814-af7d-4333-bca9-643768919f0e'::UUID, 'MARCENT', 'Marine Forces Central Command', 'Marine Forces Central Command', 'usmc', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('eb339a25-8683-4434-8e4c-e5ed85eb83b5'::UUID, 'QA', 'quality assurance', 'quality assurance', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('eb71eb93-b94f-48fc-a3a8-c1ff77e4b70b'::UUID, 'EBS', 'Environmental Baseline Survey', 'Site contamination assessment', 'general', 'Engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ebaa3ea3-0a2d-4a1c-bf42-b7a9aa903725'::UUID, 'quarterdeck', 'reception area', 'reception area', 'general', 'Facility')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ebf41218-ab8a-4ac7-9e6a-31990392687c'::UUID, 'DPAS', 'Defense Property Accountability System', 'Government property tracking system', 'general', 'technical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ec0789bd-66e1-45ab-83d2-c52343c4fbb2'::UUID, 'FPCON', 'Force Protection Condition', 'Security threat level', 'general', 'security')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ec163ad6-59dd-4865-8d45-3ea8e9bf51ad'::UUID, 'DCGS', 'Distributed Common Ground System', 'integrated intelligence analysis platform', 'general', 'intel')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ec5d348d-66b8-4e03-87c6-5ffb4e99ad49'::UUID, 'eMILPO', 'Electronic Military Personnel Office', 'Army online HR system', 'army', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ec90fad3-5695-4e4c-845c-9d93a9fc61e5'::UUID, 'AMXS', 'aircraft maintenance squadron', 'aircraft maintenance squadron', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ec919951-d1d6-4628-ba1d-0f8eb5ec9f27'::UUID, 'PERSTAT', 'Personnel Status Report', 'headcount and personnel status report', 'general', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ece5e649-8305-4d0e-a6a4-d87ab64e3ca4'::UUID, 'SDA', 'Space Development Agency', 'Space technology development organization', 'ussf', 'Space')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ecfcfe84-daad-409e-b3b1-a3fc8fed5479'::UUID, 'EUCOM', 'European Command', 'European Command', 'general', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ed2a2284-6ef1-44c0-9e77-c6da1c4b8536'::UUID, 'ALS', 'Airman Leadership School', 'Airman Leadership School', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ed31cc3a-3cc4-4a6f-973c-00fcb073e4c4'::UUID, 'HSC', 'Helicopter Sea Combat Squadron', 'Navy helicopter squadron', 'navy', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ed6031c4-a1df-4d8b-aebc-cfb5381b59f2'::UUID, 'SARC', 'sexual assault response coordinator', 'sexual assault response coordinator', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ed64a22c-9a06-4f82-bcc9-c55bc7e36066'::UUID, 'CONOP', 'concept of operations', 'concept of operations', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ed64cd13-4bfc-4754-be23-527bf072cbfe'::UUID, 'NCOIC', 'non-commissioned officer in charge', 'non-commissioned officer in charge', 'army', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('eda2c760-7002-4fc7-9632-ef078030c12b'::UUID, 'SCO', 'security control officer', 'security control officer', 'general', 'Security')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('edbfa186-cec4-4009-84ee-1865abe62140'::UUID, 'DEROS', 'scheduled rotation date', 'scheduled rotation date', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('eefc39c1-b29d-40c3-a590-d315f547cde5'::UUID, 'LANTFLT', 'Atlantic Fleet', 'Atlantic region naval forces', 'navy', 'organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ef0fabf7-8c16-430e-8863-68639f04b712'::UUID, 'POD', 'Port of Debarkation', 'Arrival port', 'general', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ef44cc0f-d716-48fe-91c5-513033f45f39'::UUID, 'OMMS-NG', 'maintenance tracking system', 'maintenance tracking system', 'navy', 'System')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('efc010bd-b6e1-4171-a128-81aa97b18c71'::UUID, 'PEO', 'program executive office', 'program executive office', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f021831b-3b3c-47f6-b7ab-8eb77dc8929f'::UUID, 'CYBERCOM', 'Cyber Command', 'Cyber Command', 'general', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f07345b1-ffab-4248-8f16-e721e6665729'::UUID, 'SKED', 'Scheduling', 'Maintenance scheduling system', 'navy', 'technical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f082d15d-f3d4-41bb-9624-076545988cfd'::UUID, 'USAF', 'United States Air Force', 'United States Air Force', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f15b4b00-1a34-4be6-9818-87c154f56e6b'::UUID, 'CMSAF', 'Chief Master Sergeant of the Air Force', 'Senior enlisted Air Force advisor', 'usaf', 'organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f17fc89b-c028-4679-ab86-5fb3a8d35296'::UUID, 'CMEO', 'equal opportunity manager', 'equal opportunity manager', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f19becc5-d158-4e45-8d16-5499e983756a'::UUID, 'SPAWAR', 'naval systems command', 'naval systems command', 'navy', 'Organization')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f1ae170e-49fd-4cf6-868b-0a553ac41323'::UUID, 'CSMP', 'Current Ships Maintenance Project', 'Maintenance backlog tracker', 'navy', 'technical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f1bc5f60-cca6-4da6-a605-f0899f2b1419'::UUID, 'MEDPROS', 'medical readiness system', 'medical readiness system', 'army', 'System')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f1eb4f12-cbfb-4fe2-93ff-58333c3fa816'::UUID, 'PT', 'Physical Training', 'Physical fitness program', 'general', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f1eca8ff-0d8e-4182-bf42-9e46736b0d3b'::UUID, 'TIG', 'time in grade', 'time in grade', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f21f6f34-1060-467a-b704-18b9c4a02a61'::UUID, 'SBCT', 'Stryker brigade combat team', 'Stryker brigade combat team', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f224c0b5-2c9c-4f83-ba18-8831279a7659'::UUID, 'PBD', 'Program Budget Decision', 'Senior budget allocation decision', 'general', 'Financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f2a120a2-04b4-49a1-a838-086506620e15'::UUID, 'PRIME BEEF', 'Prime Base Engineer Emergency Force', 'base engineering emergency response team', 'usaf', 'engineering')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f2ebb100-cd06-4e07-bdb6-9b2fdb709924'::UUID, 'PSU', 'port security unit', 'port security unit', 'uscg', 'Security')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f340923a-2698-445a-893d-48973a5992df'::UUID, 'AIRPAC', 'air forces Pacific', 'air forces Pacific', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f38cf336-8642-4b30-95c8-8593c0c79335'::UUID, 'RDD', 'Required Delivery Date', 'Shipment deadline', 'general', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f38f2bef-beac-4840-8518-07d2884e8d08'::UUID, 'IMR', 'Individual Medical Readiness', 'Personal health compliance status', 'general', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f390c54b-b827-4aff-a108-6a1b0935468c'::UUID, 'SUBLANT', 'submarine forces Atlantic', 'submarine forces Atlantic', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f3bd3726-73a1-4491-b6f7-4712cf895e0d'::UUID, 'ROC drill', 'Rehearsal of Concept drill', 'operational concept rehearsal', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f3c0d1a1-4453-4597-88ea-8e23b438f964'::UUID, 'LFX', 'live fire exercise', 'live fire exercise', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f3f471ff-a122-452b-b2e8-e9bd12e24ac9'::UUID, 'IAM', 'Information Assurance Manager', 'Senior cybersecurity manager', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f43d72e8-3dd0-48a2-ab07-190c2f5c917d'::UUID, 'LOE', 'Line of Effort', 'Strategic objective focus area', 'general', 'planning')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f4568002-b5c4-4e2f-9ac0-4bf6c57435e6'::UUID, 'INFOSEC', 'information security', 'information security', 'general', 'Security')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f5161c7f-d603-4dd1-9114-b3a45e4c41c5'::UUID, 'NMCM', 'Non-Mission Capable Maintenance', 'out of service due to maintenance', 'general', 'logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f51a9313-da0e-45fb-90b7-e024e51d0c20'::UUID, 'FSC', 'forward support company', 'forward support company', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f53e13f1-9460-4319-ba0d-7cd1cab56456'::UUID, 'IMR', 'Individual Medical Readiness', 'Personal medical compliance status', 'general', 'technical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f55e4524-bc5d-45ba-aef6-8b7ff166661c'::UUID, 'AWC', 'Air War College', 'Air War College', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f5d475db-bcae-4bea-9e0f-4db044216af2'::UUID, 'DCAG', 'Deputy Commander, Air Group', 'Deputy air wing leader', 'navy', 'Aviation')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f5f0b8c0-b09e-402b-a46a-8f71804357cf'::UUID, 'BAS', 'subsistence allowance', 'subsistence allowance', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f661b1da-cd38-4782-b1e4-cf21efbc4db9'::UUID, 'WHEC', 'high endurance cutter', 'high endurance cutter', 'uscg', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f661f497-ff6e-45b7-8c5d-53f7cb1a6316'::UUID, 'OPSUM', 'Operations Summary', 'operational activity summary', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f6a86c2d-1fcc-4046-96b4-46c4323519f5'::UUID, 'PRD', 'planned rotation date', 'planned rotation date', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f6b08858-9325-458f-ad86-0d78f0a2bcd2'::UUID, 'NASIC', 'National Air and Space Intelligence Center', 'Air/space threat analysis center', 'usaf', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f6ea2d89-0d18-42d8-849a-2e6e5896bd10'::UUID, 'NPC', 'Navy Personnel Command', 'Navy HR operations', 'navy', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f7045e81-3053-4dd1-90b1-4c30780581f2'::UUID, 'COSC', 'Combat Operational Stress Control', 'Operational mental health program', 'general', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f740fed4-667c-4da5-aaa5-bc897cd81b22'::UUID, 'SSO', 'special security officer', 'special security officer', 'general', 'Security')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f7f63464-1751-41ca-bf80-3e0922222497'::UUID, 'DISS', 'Defense Information System for Security', 'Modern clearance management system', 'general', 'Intelligence')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f82f6b10-1613-459a-a19b-e23b4d82faf8'::UUID, 'APOE', 'Aerial Port of Embarkation', 'Military air cargo departure terminal', 'general', 'Logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f8db6086-396c-4f4f-83ad-c0354f23389f'::UUID, 'MODS', 'Medical Operational Data System', 'Navy medical readiness tracker', 'navy', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f92939b8-dac4-4421-b8a4-b73e55421a3c'::UUID, 'PMC', 'Partially Mission Capable', 'equipment operating with reduced capability', 'general', 'logistics')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f92e29bc-6be5-4711-8290-6399173e7036'::UUID, 'NAVWAR', 'naval information warfare systems', 'naval information warfare systems', 'navy', 'System')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f93aecc0-9bb7-4b8f-b186-a23b21f8a347'::UUID, 'G4', 'division/corps logistics', 'division/corps logistics', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f9d571e6-311d-494c-919e-febcfa77b616'::UUID, 'CDC', 'Combat Direction Center', 'Tactical command center', 'navy', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('f9e5c38a-cd05-43a5-ae01-5dc87be6120b'::UUID, 'NIST', 'National Institute of Standards and Technology', 'Federal technology standards body', 'general', 'technical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fa4414ca-a478-428c-8a73-699cd73c41e5'::UUID, 'MICT', 'management internal control toolset', 'management internal control toolset', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fa4c5a79-8f38-4d4a-93e4-87106e69b317'::UUID, 'STIG', 'Security Technical Implementation Guide', 'security configuration baseline', 'general', 'cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fa5df029-b089-457e-9711-49fa8f3eabd1'::UUID, 'HLZ', 'Helicopter Landing Zone', 'Designated helicopter area', 'general', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fa76b04e-05e3-4f59-ac39-4455bd26d92e'::UUID, 'scuttlebutt', 'water fountain', 'water fountain', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fab78a06-df32-45e7-a299-514c07eb78f6'::UUID, 'NFAAS', 'Navy Family Accountability and Assessment System', 'Personnel accountability system', 'navy', 'technical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fade9adb-8de7-4ccf-8985-cba3e47563ca'::UUID, 'USMC', 'United States Marine Corps', 'United States Marine Corps', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fb2c19db-ff90-4764-951d-628c9e821378'::UUID, 'NTC', 'National Training Center', 'National Training Center', 'army', 'Training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fb2cfaa3-64ee-4737-8e0c-d2656a2c6c20'::UUID, 'DHA', 'Defense Health Agency', 'DoD healthcare management agency', 'general', 'Medical')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fb8dccf7-4e0e-4702-a083-63d55acbafaf'::UUID, 'COMSEC', 'communications security', 'communications security', 'general', 'Security')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fbac0189-053f-46b1-b1f5-edfdabeb6bc9'::UUID, 'IAO', 'Information Assurance Officer', 'IT security compliance officer', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fc091a36-ca32-450f-bfe8-784661eac2d3'::UUID, 'GQ', 'General Quarters', 'Full emergency response activation', 'navy', 'operations')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fc169030-5b5b-417b-b947-7cbbdc3a69e9'::UUID, 'EM', 'electrician''s mate', 'electrician''s mate', 'navy', 'Rating')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fc1ffb1e-a35f-4c8f-ab9a-4f919deb5ea8'::UUID, 'NAVSTA', 'naval station', 'naval station', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fc46a92f-093d-460f-ac7b-dec3ad5d20f3'::UUID, 'LES', 'Leave and Earnings Statement', 'Pay stub / earnings statement', 'general', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fc4c201e-0cee-4fa1-9f34-bfc0a8986917'::UUID, 'SGM', 'sergeant major', 'sergeant major', 'army', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fc6ec7e2-6b4a-4f05-ac0a-43070a41d073'::UUID, 'MCB', 'Marine Corps Base', 'Marine Corps Base', 'usmc', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fc7343f1-272d-4d7e-835e-ab284c908775'::UUID, 'spot checks', 'quality inspections', 'quality inspections', 'general', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fc8fcafe-1f23-4148-9294-166454323721'::UUID, 'CSMP', 'maintenance backlog', 'maintenance backlog', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fcad12ca-ad0d-4efa-a6ea-1d3902a56801'::UUID, 'TDA', 'organizational structure document', 'organizational structure document', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fcdde07f-acc4-4e62-9c99-08f70897f425'::UUID, 'PSD', 'Personnel Support Detachment', 'HR service center', 'navy', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fd210d0e-cd32-4574-979a-39e8f4c546a3'::UUID, 'CC', 'commander', 'commander', 'usaf', 'Rank')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fd2c2d8a-f02b-4646-b10c-589aee50fece'::UUID, 'PMCS', 'preventive maintenance checks', 'preventive maintenance checks', 'army', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fd48b9a4-a224-4214-81d3-1d554e662cdc'::UUID, 'AEF', 'Air Expeditionary Force', 'Air Expeditionary Force', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fda528c2-11d0-40df-8f09-888de6cf8f6b'::UUID, 'AFPD', 'Air Force policy directive', 'Air Force policy directive', 'usaf', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fe856427-8a17-4a1f-9a3b-8741552a5051'::UUID, 'EVAL', 'performance evaluation', 'performance evaluation', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fee914d6-beaf-4206-af61-bc293db9aafb'::UUID, 'BLC', 'Basic Leader Course', 'foundational leadership development course', 'army', 'training')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ff3da7be-c0c2-4d86-80ba-5759cfe919af'::UUID, 'SAG', 'Sub-Activity Group', 'Detailed budget grouping', 'general', 'Financial')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ff8760cf-4a4d-4de3-86ec-25310899e2c9'::UUID, 'CNA', 'Computer Network Attack', 'Offensive cyber operations', 'general', 'Cyber')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('ffe2b7aa-3713-4afa-b7ee-a545ac5ac0dc'::UUID, 'AIRLANT', 'air forces Atlantic', 'air forces Atlantic', 'navy', 'Acronym')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;
INSERT INTO dict_acronyms (id, acronym, full_term, civilian_explanation, branch, category) VALUES ('fff37dd2-4016-4337-ab16-64cf2eb68c22'::UUID, 'FLTMPS', 'Fleet Training Management and Planning System', 'Navy training database', 'navy', 'Admin')
  ON CONFLICT (id) DO UPDATE SET
    acronym = EXCLUDED.acronym,
    full_term = EXCLUDED.full_term,
    civilian_explanation = EXCLUDED.civilian_explanation,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category;

COMMIT;
