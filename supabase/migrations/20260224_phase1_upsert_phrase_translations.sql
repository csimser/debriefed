-- =============================================================================
-- Phase 1: Upsert dict_phrase_translations (1,074 rows)
-- Source: /home/fiveftslim/debriefed-ai-lab/dict_phrase_translations_rows.csv
-- Run AFTER 20260224_phase1_schema_additions.sql
-- =============================================================================

BEGIN;

INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('00136e48-8078-4fd0-a3b0-b231e6ff4bc0'::UUID, 'served as repair locker leader', 'served as emergency response team leader', 'navy', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('00967f9a-40fe-4a8a-a82f-09131cf542a4'::UUID, 'briefed flag officers', 'presented to C-suite executives', 'navy', 'communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('00b25d51-789b-4e77-8d0b-2e58bc5c782e'::UUID, 'received Joint Service Achievement Medal', 'received joint organization achievement award', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('00f0b7b7-884e-4302-9eac-a8c4a9ad760b'::UUID, 'brief down', 'communicate to the team', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('00f997ed-9b03-4a5b-86f8-c2caf935bd58'::UUID, 'took the helm', 'assumed executive leadership', 'navy', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('01075210-7c0c-42ef-a3d3-4848f7a9c46c'::UUID, 'hand-selected for', 'competitively selected for', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('01972998-3fe1-49d4-b06b-d2f7642c93bd'::UUID, 'intelligence fusion', 'multi-source data integration and analysis', 'general', 'intel', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('01b1af2a-19b9-458d-9ca8-7ab5e962b0bd'::UUID, 'medical treatment facility', 'healthcare facility / clinic', 'general', 'medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('01c7cda4-4080-4b08-9987-532870986910'::UUID, 'shaping operations', 'preparatory activities / preliminary operations', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('022abb12-bc5a-449f-a686-fb70cd513800'::UUID, 'HAZMAT locker', 'hazardous materials storage facility', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0272793d-8604-492a-b5dc-84cd53a351d5'::UUID, 'corrective action', 'performance improvement action', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('02fefa5c-5c52-4b3b-817e-82f5c08686ba'::UUID, 'perfect score', 'achieved maximum score', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('036afb18-e940-49d7-b47d-12c48fa9ba1b'::UUID, 'delivered on time and on target', 'completed all deliverables on schedule and within scope', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0434f618-8d81-4db5-9063-523dcc797e0d'::UUID, 'corrective action report', 'corrective and preventive action documentation', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('044a80ed-98e2-45c6-9fc4-b804ce1d5508'::UUID, 'information brief', 'informational presentation with no decision required', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('05300b3d-351a-4d17-bcea-fd92a4dc3d42'::UUID, 'safety officer', 'safety compliance manager', 'general', 'safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('054d6060-bff5-4a94-9809-15f100086d21'::UUID, 'PMCS', 'preventive maintenance checks and services', 'army', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('055f3e79-2178-435e-856e-7e1f253b076e'::UUID, 'signals intelligence', 'electronic data collection and analysis', 'general', 'intel', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0663b65e-2f27-4080-bc54-28220235999c'::UUID, 'troop leading procedures', 'team planning and execution methodology', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('06b395b3-b774-4d38-aa6b-13baabdde324'::UUID, 'radio operator', 'communications specialist / radio technician', 'general', 'comms', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('07904a1b-166e-424f-9b02-630617704b94'::UUID, 'promote immediately', 'strongest recommendation for accelerated advancement', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('07aa8ea2-0e18-44c4-abae-87a6e21641d2'::UUID, 'right-hand man', 'primary deputy', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('07cbf0f1-3b34-4183-9fb0-829abe5f976e'::UUID, 'counterintelligence', 'security threat mitigation / insider threat prevention', 'general', 'intel', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0868f3cf-6cac-4b37-849b-ee8924e380c4'::UUID, 'courts-martial proceedings', 'formal legal proceedings / adjudication', 'general', 'legal', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0898829d-e656-4f48-a069-7787f6192bb9'::UUID, 'disaster relief operations', 'natural disaster emergency response operations', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('08babe66-bd27-433c-aaa5-b2c677f07694'::UUID, 'served as NCOIC', 'served as section noncommissioned officer in charge', 'usaf', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('08cefad8-3a6f-4ddc-96ce-531945fc33a7'::UUID, 'casualty report', 'critical equipment failure report', 'navy', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('08d83993-dee4-40a6-aeca-11196243372a'::UUID, 'offensive cyber operations', 'penetration testing / red team operations', 'general', 'cyber', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('09417c34-7c07-45eb-a6d7-54f3393e7e10'::UUID, 'COSAL allowance', 'authorized equipment and parts list', 'navy', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0990ce9b-d221-4727-b75d-af293d00eb14'::UUID, 'controlled inventory item', 'high-value item requiring special tracking', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('09948c75-a735-40b5-8455-c598be5e530f'::UUID, 'acquisition management', 'procurement management / purchasing oversight', 'general', 'financial', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('09d186c5-04da-40ca-8454-d1214e2c30e8'::UUID, 'earned SNCO of the Quarter', 'selected as senior manager of the quarter', 'usaf', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('09df0e9b-bff0-4a7b-9227-817708700a68'::UUID, 'saved man-hours', 'reduced labor hours', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0a959b95-8baa-43a1-abfc-71c4340a5944'::UUID, 'broke down barriers', 'removed organizational obstacles', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0ab67d1a-d673-4b08-a771-d93a130173e0'::UUID, 'execute order', 'authorization to proceed', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0ac6fddf-816a-48d9-b653-c76a4e4a4216'::UUID, 'SCBA qualified', 'self-contained breathing apparatus certified', 'navy', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0b8e25bd-57a8-4ca7-b773-1f07d996df75'::UUID, 'served as flight chief', 'served as section supervisor for 20-50 personnel', 'usaf', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0be54b80-681a-4579-9fba-9e872f5aced8'::UUID, 'master training specialist', 'certified master-level instructor', 'navy', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0beaa33f-b143-405c-bb20-7c0a2a3361fa'::UUID, 'earned NCO of the Quarter', 'selected as supervisor of the quarter', 'usaf', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0bfa0ca6-d832-47e9-bf2f-e6ee0c8b14bd'::UUID, 'OPPE results', 'operational readiness evaluation results', 'navy', 'compliance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0c523806-d45e-4a2c-b876-0ab3faec7f91'::UUID, 'EOC operations', 'emergency operations center management', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0c73bce6-70e6-42d1-aaf8-f5156c86bfb5'::UUID, 'force health protection', 'occupational health and safety program', 'general', 'medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0c7c4e3e-ccde-4054-aca8-825ca9932db6'::UUID, 'mine countermeasures', 'underwater threat detection and neutralization', 'navy', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0d1bdbb5-956c-47c7-8f14-13ea268f3753'::UUID, 'participated in MEU deployment', 'participated in expeditionary deployment operations', 'usmc', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0d742c2e-967b-4d05-967c-47f3a90ddb7b'::UUID, 'government purchase card program', 'corporate purchasing card program / procurement card management', 'general', 'financial', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0d8e2126-8ade-4688-bc63-7485e40400ea'::UUID, 'aircrew coordination', 'flight crew resource management', 'general', 'aviation', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0dbc87d8-3514-4a0b-881f-c453d3faca3d'::UUID, 'maintained motor pool', 'maintained vehicle fleet maintenance facility', 'army', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0dd454a0-77c8-440b-ac58-12402e33aa65'::UUID, 'prepared naval messages', 'drafted executive communications', 'navy', 'communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0dee488a-189b-483e-8b57-94aa4bd0f941'::UUID, 'earned Combat Infantry Badge', 'earned combat operations qualification badge', 'army', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0e0aadb4-80b1-4244-a38f-f40c66ac522a'::UUID, 'supported MAGTF operations', 'supported multi-element combined operations', 'usmc', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0e1e0b7f-7e44-4870-8559-12b87355296a'::UUID, 'DC drill', 'damage control emergency drill', 'navy', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0ee3e7b8-ec40-4791-875d-1386d1c8e9ba'::UUID, 'exemplary conduct', 'exemplary professional conduct', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0f50aff4-ea76-494d-82fa-ee15359ec6d4'::UUID, 'maintained good order and discipline', 'upheld professional standards and workplace conduct', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0fb31ff5-4b68-46cf-a32e-dcaf7612cb23'::UUID, 'transformed the organization', 'led organizational change and restructuring', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0fc319a9-e228-41b5-96a8-4600e691b34e'::UUID, 'contingency operations', 'emergency response operations', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0fd7c089-449c-4b0c-a2f0-a78091099918'::UUID, 'bench stock', 'commonly used parts kept at the work center', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0fdb743b-d692-46b3-9d35-30a7fc4e5dd7'::UUID, 'sea duty', 'operational assignment', 'navy', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0fe2a455-fd76-4886-b072-cee2324f40b8'::UUID, 'route clearance', 'road safety inspection / route survey operations', 'general', 'engineering', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0feaedda-2760-49ee-b78e-4494f7e42d4e'::UUID, 'command duty officer', 'senior on-call manager', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('0ff4f4e7-46ec-4af4-ac16-ad19d5672197'::UUID, 'qualified as CDO', 'certified as after-hours senior facility manager', 'navy', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('106ac7d2-2506-4f56-8468-7bafe96209d2'::UUID, 'combat zone', 'high-risk operational environment', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('10b78a55-3e6c-4b7a-8c30-70046a077ec4'::UUID, 'main body', 'primary workforce', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('11bb30b6-3a03-4ea1-8ead-89e529b2b1a0'::UUID, 'risk mitigation', 'risk mitigation', 'general', 'safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('11d811b7-d075-497f-b2fe-0a1c6b592681'::UUID, 'communications watch', 'network monitoring shift / communications monitoring duty', 'general', 'comms', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('11ec77c7-d1ae-4690-b274-1d013406f2e8'::UUID, 'developed subordinates', 'coached and developed direct reports', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('12129393-789b-4523-9610-adc060bbf955'::UUID, 'in port', 'at home station', 'navy', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('122f0e50-e01d-4a23-9771-5b990c8a75f7'::UUID, 'PRT', 'physical readiness test or fitness assessment', 'navy', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('12355fe1-ee89-4584-8185-ded2740cbdd5'::UUID, 'turned around', 'reversed declining performance', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('12b4b4ee-bfa8-452f-b476-d6f8a3755c23'::UUID, 'decision brief', 'presentation requiring leadership decision', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1370478e-2152-4dd9-8971-be68382007e4'::UUID, 'mass casualty drill', 'mass casualty incident exercise', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('13ff3daf-5440-45d0-bcbc-354e71fc19e8'::UUID, 'enforced standards', 'ensured compliance with organizational policies', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('14309e2b-ae5a-4371-9af4-e5e119289cca'::UUID, 'FOD walkdown', 'foreign object debris prevention inspection', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('14617cb0-0313-454f-bdfc-6e2669bba1fd'::UUID, 'sailor of the year', 'employee of the year', 'navy', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('148fb0fe-f924-4314-a3af-654c8a30041e'::UUID, 'board eligible', 'met all requirements for advancement', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('14c53a0b-6e77-4bbb-91dc-da24362361db'::UUID, 'cold iron', 'complete system shutdown', 'navy', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('14c690ef-562c-4ceb-84be-694cc6d7d150'::UUID, 'deployment health assessment', 'pre- and post-assignment medical screening', 'general', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('14d6d4d6-b3cb-472e-97c1-5d5f41f4295c'::UUID, 'served as UDM', 'served as unit deployment manager', 'usaf', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('157c8081-dd9b-48a4-8ff3-23739af6008d'::UUID, 'underway', 'during operations', 'navy', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('15865ba7-3f89-4d55-8b14-2a7f7536e9b5'::UUID, 'NCOER', 'noncommissioned officer performance evaluation', 'army', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('15ca2604-17e1-4145-91e8-e8ffb4742089'::UUID, 'advance party', 'advance planning team', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('160552b0-b176-4fbb-bf7d-982bf84087d0'::UUID, 'suspense date', 'deadline for completion', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('160ea0ff-ef3c-4037-9755-1827f87c1003'::UUID, 'boots on ground', 'on-site presence', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1665e889-9e57-4985-96a6-635f6bfd1e13'::UUID, 'anti-terrorism', 'threat prevention and force protection', 'general', 'security', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('167685c8-9d22-4bac-b669-b96bcceca083'::UUID, 'Class VII supplies', 'major end items and capital equipment', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1693f8b1-ff61-4725-b294-00d193405cee'::UUID, 'AIT graduate', 'completed advanced individual training program', 'army', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('16a627cc-282a-41c4-81e2-ade2c3c9d05a'::UUID, 'on hand', 'currently in stock', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('17967055-7869-44b5-83f7-c40d4f613510'::UUID, 'earned Combat Action Ribbon', 'earned combat operations recognition', 'usmc', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('17c617ae-294d-4556-bb73-31ceb49f062d'::UUID, 'drafted OPORD', 'developed operational execution plan', 'general', 'communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('17ff2d7f-5604-4d8d-81e7-668a4bb30223'::UUID, 'word from on high', 'direction from senior leadership', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('18260497-7e6f-440a-8d67-8bb05973a28d'::UUID, 'selected as Senior Sailor of the Year', 'selected as senior employee of the year', 'navy', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('18777463-5020-4b62-a9c2-84a9c7d7a694'::UUID, 'white paper', 'detailed research and recommendation document', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('18bd48e9-cf59-4220-8abf-87004f3443af'::UUID, 'wrote evaluations for', 'authored performance reviews for', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('18bfee57-ba70-4acc-9cb4-1ef951a34954'::UUID, 'coalition operations', 'multinational partnership operations', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('18efee4f-3dc5-4203-b078-791de3c3d5ba'::UUID, 'rules of engagement', 'operating guidelines / standard engagement protocols', 'general', 'legal', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1924d933-0d48-4ca6-b076-ec3bb048d46e'::UUID, 'processed 4187s', 'processed personnel action requests', 'army', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('193cfaee-0686-49ac-a164-933371548557'::UUID, 'flight scheduling', 'aircraft scheduling / operations planning', 'general', 'aviation', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('19ce4fb6-dcb0-4af8-bdfd-e42373fd3b5d'::UUID, 'PSD', 'personnel support detachment or HR office', 'navy', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('19fcb870-9748-495d-8b94-5e9346986f5d'::UUID, 'deployment cycle', 'operational rotation', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1a47b65c-2ed0-4298-bc8a-d358c6f1de08'::UUID, 'mishap investigation', 'incident investigation and root cause analysis', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1adfb942-671c-4f06-bf1f-8397b59d6f00'::UUID, 'conducted proficiency training', 'delivered skills-based professional development', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1ae62924-06f7-4b73-bcbf-2565453443d6'::UUID, 'cleared the path', 'eliminated roadblocks for the team', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1b1df2e1-644b-47a3-a1b5-4ad5121e2bb2'::UUID, 'permanent change of station', 'permanent relocation / corporate transfer', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1b32c66d-d206-4ed9-a1e4-47f7d9355a3c'::UUID, 'combat stress', 'work-related stress and mental health concern', 'general', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1b903350-8a9d-47c1-8777-96d28e4ba605'::UUID, 'FEP', 'fitness enhancement program', 'navy', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1b96b033-1a9e-40d0-ad99-899b03674912'::UUID, 'recall roster', 'emergency contact notification list', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1bc1a6af-a0b4-47b4-aed8-1735f2f4cb4d'::UUID, 'DEFCON', 'defense readiness condition', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1bdca38e-0ef0-46f9-91ec-74e17775d10d'::UUID, 'scored 300 on APFT', 'achieved maximum score on physical fitness assessment', 'army', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1c1fc16e-d879-4dbc-bc93-4899e34ffd1a'::UUID, 'horizontal construction', 'road and runway construction / earthwork operations', 'general', 'engineering', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1c214c21-9399-465a-a13e-322422f3e38c'::UUID, 'trained to standard', 'trained to meet all certification requirements', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1c2a0538-84e3-4345-b2ba-1ba99eb03033'::UUID, 'trained and ready to deploy', 'fully onboarded and prepared for assignment', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1c4bc39e-4772-48d9-a204-f1269e682a86'::UUID, 'completed ALS', 'completed initial leadership development course', 'usaf', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1c571df1-ca67-4b88-b2da-dd27f3bf783a'::UUID, 'completed PMS on schedule', 'completed all scheduled preventive maintenance on time', 'navy', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1c679641-ece2-44ab-ba55-ec2ac34acde0'::UUID, 'DRMO', 'surplus property disposal', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1ce22216-4e75-484e-a064-0a71c8168830'::UUID, 'turnover', 'transition of responsibilities', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1d125973-3bd2-4417-8490-fa2ed6be2716'::UUID, 'investigations officer', 'internal investigations manager / compliance investigator', 'general', 'legal', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1d8eb42b-be31-4501-a9e8-b11ac4f92b3f'::UUID, 'selected as Junior Sailor of the Year', 'selected as junior employee of the year', 'navy', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1da0cb81-ab1b-4fb0-9a94-55630dbab356'::UUID, 'earned Combat Action Badge', 'earned combat operations qualification badge', 'army', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1dcbf6f4-bd41-46e6-81f6-5209e5dfadfa'::UUID, 'conducted PMCS', 'performed preventive maintenance checks and services', 'army', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1de38099-9df2-4afd-8222-7dee0de8f492'::UUID, 'attended ALC', 'completed mid-level supervisor leadership course', 'army', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1de410e3-a077-4e0c-a419-d616d79a427b'::UUID, 'CO2 system', 'carbon dioxide fire suppression system', 'navy', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1e4d659d-f720-42b9-8279-e85de5325b78'::UUID, 'maintained Zone Inspection readiness', 'maintained ongoing facility inspection readiness', 'navy', 'compliance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1e5b3078-0ccb-48d0-9e33-6f629414ff2d'::UUID, 'razor sharp', 'highly precise and detail-oriented', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1e6095e1-6acb-427f-b66b-c352e356e757'::UUID, 'ran drills', 'conducted emergency preparedness exercises', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1eaa753d-2ef4-45b0-87b7-877874e695e2'::UUID, 'quarters', 'unit formation or team meeting', 'general', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1ebb0d52-f1a2-4d87-aaf8-d1d49abe7331'::UUID, 'freedom of navigation', 'international maritime patrol operations', 'navy', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1f1d42f4-eb1d-4a9d-9b6a-a82d175409b0'::UUID, 'OJT complete', 'completed on-the-job training', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('1fa24313-5c4d-4fc8-90b2-ad55eb54ccd8'::UUID, 'peacekeeping operations', 'stability and support operations', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('201568d2-7b64-4630-b7ce-e53dbecc3129'::UUID, 'championed the cause', 'advocated for the initiative', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('20464187-1e63-453b-917e-fd5f39e78a0a'::UUID, 'shore duty', 'headquarters or support assignment', 'navy', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2051c352-732f-4721-b328-4dbd17909fb2'::UUID, 'turn-in', 'returned equipment to supply', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('20d8e132-33ad-4b94-9580-4842895f6f6d'::UUID, 'received flag letter', 'received written recognition from executive leadership', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('21092e33-38e1-4abc-bdc2-29bd14a84639'::UUID, 'administered PQS', 'administered professional qualification program', 'navy', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('21523b83-2b9c-43a1-9e1a-ae261892ac23'::UUID, 'owned the battlespace', 'managed all operations within the assigned area', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('217b2825-aa4a-4834-9784-5ac7fe5ab952'::UUID, 'OCONUS', 'outside the continental United States', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('21a2fc2e-b177-4f55-9223-140180442838'::UUID, 'records management', 'document management / records retention', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('226de5c8-e521-4190-878d-2f51a68b727f'::UUID, 'served as SAPR VA', 'served as sexual assault prevention and response victim advocate', 'navy', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('22981ffe-4d23-4030-a513-d61aa20af2f1'::UUID, 'voting assistance officer', 'employee civic engagement coordinator', 'general', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('230ffb5e-a8c6-4c8a-8db5-5c947cc7a272'::UUID, 'can-do attitude', 'positive, results-oriented approach', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2369746e-6dc8-4f1a-9364-65787642f8a5'::UUID, 'empowered junior leaders', 'empowered emerging leaders through delegation', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2370234c-cf6d-4f71-8f7e-026ca6e48173'::UUID, 'improved readiness', 'improved operational availability', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('23d88015-2e9b-4c1f-a87b-9653fa82fe92'::UUID, 'class A mishap', 'severity level 1 incident with major loss', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('240b021c-edf5-4b15-82a7-8321b76a8fe1'::UUID, 'performs at the next higher paygrade', 'performs at the next organizational level', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('24200510-faa7-4528-aeed-e27e6b4f79bd'::UUID, 'shipmate of the quarter', 'employee of the quarter', 'navy', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2485310e-8ad6-45bf-af7a-9699364d6854'::UUID, 'inspired warfighters', 'motivated team members to achieve objectives', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('250ca11e-de9b-4319-8b20-1f4818167f8d'::UUID, 'exceeded the standard', 'surpassed performance benchmarks', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('255d5543-0a5a-49a7-865b-8fc17ef0776c'::UUID, 'quad chart', 'four-quadrant visual summary', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('25cd2456-4ab5-4dfc-8344-13a855cbb693'::UUID, 'theater of operations', 'regional area of business operations', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('25ea0db5-4866-4a77-81a2-71a0e02e81b9'::UUID, 'open purchase', 'commercial off-the-shelf procurement', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('25eac435-bf83-4d40-851d-c67df1e71e79'::UUID, 'SPOTREP', 'spot report or incident notification', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('25ee6d01-2022-41b9-ab33-3c111409e93a'::UUID, 'war college graduate', 'completed executive leadership program', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('26014f27-31f7-48bf-9b9e-bf3361911f1f'::UUID, 'unlimited potential', 'demonstrates exceptional growth potential', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('26538a2d-a50b-47ea-92bd-a9281fa3b09c'::UUID, 'force beddown', 'temporary facility setup / rapid site establishment', 'general', 'engineering', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('265bb849-3cef-4fdf-9790-2aa44baad441'::UUID, 'served as team leader', 'served as front-line team supervisor', 'army', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('26d23369-80e7-476e-b551-a250e6686171'::UUID, 'operation and maintenance funds', 'operating budget / O&M budget', 'general', 'financial', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('271c42b1-9f77-40f7-b1f6-11f5df5fa840'::UUID, 'equal opportunity advisor', 'equal employment opportunity specialist', 'general', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('273d70f5-a2d7-439b-8d87-905556c511df'::UUID, 'battle tested', 'proven in high-pressure environments', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('279474ca-5968-4d88-aac8-2fcbfb6e78b0'::UUID, 'zone inspection', 'facility/area compliance inspection', 'navy', 'compliance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('27a96a4b-30c5-4757-bd7b-989a4256faed'::UUID, 'forward deployed', 'stationed in operational area', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('27eaf5cb-ac20-4b15-9841-35140e26cc2d'::UUID, '24/7 operations', 'around-the-clock operations / continuous coverage', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('282f2be5-346b-43f9-8991-3b383cf28b59'::UUID, 'top of the class', 'ranked first among peers', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('28453e38-4344-4a43-83a9-96db2786fe08'::UUID, 'training cycle', 'professional development schedule / learning cycle', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('28592ead-c88b-467a-a0c8-2e98625ca9b8'::UUID, 'zero loss rate', 'achieved zero inventory loss', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('28c5e3d2-92ad-4a2c-944a-0c179337a657'::UUID, 'page 13 counseling', 'documented performance counseling session', 'navy', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('291c3f54-dc94-47fb-9aeb-83718a78448c'::UUID, 'operational readiness rate', 'equipment availability rate / uptime percentage', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('29576cbe-ad64-4b3a-949b-56bbc6bb8f9a'::UUID, 'negative', 'no or not confirmed', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2a2d1548-22c4-4eb5-bb16-55c2331be525'::UUID, 'took the helm', 'assumed leadership of / took charge of', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2a8376fa-1be1-4cf1-b627-eddc0ca68f34'::UUID, 'PMS', 'planned maintenance system', 'navy', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2aa5a31e-8cc5-4d45-bcaa-74f0140e0b04'::UUID, 'demobilized from', 'returned from deployment/activation', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2aba8cc6-6977-4035-bfe6-7e8b14782247'::UUID, 'plugman', 'structural damage containment specialist', 'navy', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2b173820-8979-46d0-8454-82526d5fe98a'::UUID, 'master fitness trainer', 'certified physical fitness program leader', 'army', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2b7983c2-993c-4f82-870d-cc000ca9a1d3'::UUID, 'barrier plan', 'perimeter security design / access control plan', 'general', 'engineering', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2bad8252-796d-455d-b319-d0758bffbd59'::UUID, 'met every milestone', 'achieved all project milestones on schedule', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2bb16b73-1f6c-4917-b6e0-da65ca112956'::UUID, 'ACFT', 'army combat fitness test', 'army', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2bbaf2ec-72c7-450b-a8fa-d4f62a580986'::UUID, 'sick call', 'walk-in medical appointment', 'general', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2bf78c12-c6fc-4c0a-a6a4-6ee9aff20e77'::UUID, 'selection board', 'promotion review panel / selection committee', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2bfbb424-b3d3-46af-9be0-9a4f7d763b9c'::UUID, 'combat training center rotation', 'intensive field training exercise / major training event', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2c3c871c-db67-4002-b6d1-0d42c097719e'::UUID, 'sponsor', 'onboarding coordinator for incoming employees', 'general', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2c5dd709-7e2e-45b1-92b8-88b0104e19c1'::UUID, 'answered the call', 'responded to critical organizational need', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2c7f1972-978a-4ffc-bae4-1946afdaa4ce'::UUID, 'achieved mission success', 'successfully completed all objectives', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2c834074-cae1-4b4e-9d67-fe2da73c0622'::UUID, 'earned 7-level', 'achieved craftsman-level technical certification', 'usaf', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2c85943e-4335-44e0-a0fd-a79e3511e719'::UUID, 'remedial training', 'corrective performance coaching', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2ca9ae3c-8ed9-4c62-8ae7-65a69235b478'::UUID, 'served in hostile fire zone', 'served in hazardous duty environment', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2cf27662-02df-40c6-b4ea-3b52ff9dea24'::UUID, 'nailed the inspection', 'achieved outstanding inspection results', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2d0a5f69-4e31-47dc-b666-932a40501466'::UUID, 'received Bronze Star Medal', 'received senior-level achievement/service award', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2d270768-fe78-41e1-9871-67de8e8486ec'::UUID, 'area of responsibility', 'assigned territory / managed region', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2e03cd85-3e9d-4352-8679-1caec5d166a6'::UUID, 'in-rate training', 'specialty-specific professional development', 'navy', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2e25a596-9201-4794-831e-370e6bb4db01'::UUID, 'aviation safety program', 'flight safety management system', 'general', 'aviation', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2e382d3d-61e5-4048-89df-db56ba471190'::UUID, 'mission capable rate', 'operational availability rate', 'general', 'compliance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2ec03130-b580-4fa8-b83c-dce08f41e813'::UUID, 'open door policy', 'accessible leadership communication policy', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2ece60ac-2cbe-4e3b-b15b-3c426fc7687f'::UUID, 'geospatial intelligence', 'geographic information systems analysis / location-based analytics', 'general', 'intel', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2ee5eba1-3828-4c79-9d8c-74490002c275'::UUID, 'top block evaluation', 'highest possible performance rating', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2f093484-7ee8-4d0a-88b4-bcebc9ac2a88'::UUID, 'managed departmental 3M program', 'managed department-level preventive maintenance program', 'navy', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2f20e31f-bb74-4405-8844-af708dd81bed'::UUID, 'TAP/TAPS', 'transition assistance program', 'general', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2f816c14-0ba8-46e4-b509-fb3d71d8124a'::UUID, 'combat leadership', 'leadership under high-pressure conditions', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2f817cc6-0870-450c-bf7c-736adba69b11'::UUID, 'assumed the watch', 'took over shift operations', 'navy', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('2fdcd508-a15c-4a53-99de-efa9ca318f49'::UUID, 'served as EKMS manager', 'served as electronic key/encryption material manager', 'navy', 'security', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('302da116-a113-48a2-b1b4-568d53e325d2'::UUID, 'ahead of schedule', 'completed before the deadline', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('30b0a840-b413-4c94-9451-8c3cfeb06199'::UUID, 'area denial operations', 'restricted access zone management', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('315ccbbd-4835-43c0-b082-7f8bb1c3e1b4'::UUID, 'achieved first class PFT', 'achieved top-tier physical fitness rating', 'usmc', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3239c7de-2a18-44be-ac37-fc99b56e9580'::UUID, 'force multiplier', 'high-impact contributor / productivity amplifier', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('326e002d-71cf-4d13-a6f8-1ff0ffd0237a'::UUID, 'qualified ahead of peers', 'achieved certification ahead of timeline', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('327c87a5-4a4c-4cbb-866a-3c1ed5cc1934'::UUID, 'received unit citation', 'received organizational excellence award', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('328d2de1-23b7-411d-89bf-d9463984ebcb'::UUID, 'demolition operations', 'controlled demolition / structural demolition', 'general', 'engineering', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3290e9c4-5565-43f5-8a79-c2f5779a2429'::UUID, 'pipeline', 'training program', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('32eed163-8022-457c-b22b-27ab031e54ed'::UUID, 'participated in CPO 365', 'participated in year-long leadership development program', 'navy', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3320f5a7-1e25-41ca-aea4-9358ba8dc959'::UUID, 'mentored up-and-comers', 'mentored high-potential employees', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('33371191-b412-44ac-a8cb-7a2d9fc6e672'::UUID, 'exceeded all metrics', 'surpassed all key performance indicators', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('336c1efc-1e7d-4745-b09b-9cf4c5205d2b'::UUID, 'tactical communications', 'field communications / mobile communications systems', 'general', 'comms', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('33a29c46-d7db-47e6-bbee-057c2c391d91'::UUID, 'hot seat qualified', 'certified for primary operator role', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('33a5e3fa-3b48-4b8c-9471-e3bf977d53eb'::UUID, 'deckplate leadership', 'hands-on operational leadership', 'navy', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3555e7ce-0e9e-42cf-978e-5c0e7b115c3a'::UUID, 'managed a section of', 'managed a team of', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('36755fc3-199d-43d4-8c9e-1b5198a6a7e8'::UUID, 'awarded Navy Commendation Medal', 'received superior performance award', 'navy', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('367a7e85-3155-4d79-8710-32925e5835cd'::UUID, 'an exceptional communicator', 'an exceptional communicator at all organizational levels', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('36a1a984-f174-404a-8db3-bae75bb22b77'::UUID, 'mishap', 'workplace incident', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('36bfd5d7-ffa0-4dd3-84d3-08ea6072ad41'::UUID, 'battle handover', 'operational shift transition brief', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('36fda075-8827-4b07-9a2a-a2883d66b6c3'::UUID, 'secured the plant', 'performed controlled system shutdown', 'navy', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('370767ac-5c46-4d25-a6ab-de5c39485599'::UUID, 'served as battalion commander', 'served as division/regional director', 'army', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('37c05e58-bce7-4402-af9b-4054a400a4e1'::UUID, 'held accountable', 'maintained team accountability for results', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('37d6b817-d533-4d38-bd5e-edc56107c615'::UUID, 'served as ISSM', 'served as information system security manager', 'navy', 'security', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('381c80c3-0b9d-4367-a8dd-5cd0e4004906'::UUID, 'safety walkthrough', 'safety compliance inspection', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3901948d-f94e-4f9c-a899-766ef0a8d098'::UUID, 'preventive medicine', 'preventive health services / occupational health', 'general', 'medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3928ae9c-d78c-4a6b-abef-002a66341101'::UUID, 'on the mark', 'met all specified targets and standards', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3931ef15-13da-468a-aa36-189ddd5a04e8'::UUID, 'non-judicial punishment', 'administrative disciplinary action', 'general', 'legal', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('39565b1d-5f7f-4ed7-a224-26e24eeb2c0e'::UUID, 'safety stand-down', 'organization-wide safety review day', 'general', 'safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('39fd75ef-f470-4e42-b711-5c02b53fa5cf'::UUID, 'meritorious mast', 'formal recognition ceremony', 'navy', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3af3368a-5162-4d31-acca-647adfeddae3'::UUID, 'served as department head', 'served as senior department director', 'navy', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3b719478-c706-40a3-8464-8ee9b3926bfe'::UUID, 'reported directly to', 'reported directly to', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3b9c8bea-f149-4af8-936b-60bd63d2f46e'::UUID, 'wrote NCOERs', 'authored employee performance evaluations', 'army', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3bae454f-33b5-4a81-84a0-dbe0989313db'::UUID, 'kept the division on track', 'maintained department alignment with goals', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3c01f401-b838-494b-b0f4-64c5526e9914'::UUID, 'awarded Air Force Commendation Medal', 'received superior performance award', 'usaf', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3c022d94-c799-4a9c-b1d8-8fbcdd3313bc'::UUID, 'soldier of the month', 'employee of the month', 'army', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3c3f4069-4037-4ba6-b8f3-1ec3ef5bb4b7'::UUID, 'medical hold', 'held at current assignment pending medical evaluation', 'general', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3c9c88c5-d541-4f3a-a345-9e6bdc7bdba3'::UUID, 'served as UFPM', 'served as unit fitness program manager', 'usaf', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3ced8616-ded9-4dee-aa87-b5ff14feade5'::UUID, 'three-section duty', 'three-shift rotation schedule', 'navy', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3cf45f60-e5b6-4e46-be5d-36b8ed9a1fa2'::UUID, 'zero disciplinary issues', 'maintained clean disciplinary record', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3d06c026-b1b3-4eb1-b3e1-5debfc7b689c'::UUID, 'target development', 'priority identification / target market analysis', 'general', 'intel', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3d48d12d-d1ee-42cb-8e05-11683a310c63'::UUID, 'combat medic', 'emergency medical technician / field paramedic', 'general', 'medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3dab51a3-05b3-458f-bd72-4a8ce60ff378'::UUID, 'interagency operations', 'multi-agency government operations', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3ddf927f-ac99-47c1-9aa1-5bf1e2e95f91'::UUID, 'set the example', 'served as a role model / established best practices', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3e20b162-dde5-4820-88bf-d6c42c42e56e'::UUID, 'all hands', 'organization-wide or all-personnel', 'navy', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3e8b0640-c400-48a9-9fb5-1d4d8b2e9fd4'::UUID, 'reduction in rate', 'demotion', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3e94099b-08b3-4554-a767-ae1d2588ca9c'::UUID, 'commanded a detachment', 'managed an independent work group', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3ebe07bc-7b34-4241-9563-9d3cdb05112f'::UUID, 'on order', 'ordered and pending delivery', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3ee7365b-677b-4deb-a06f-bdc0ac8757e9'::UUID, 'patient administration', 'patient records management / healthcare administration', 'general', 'medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3efc3b46-6697-4cb3-a00a-eddce2e29b0f'::UUID, 'deployed in support of', 'assigned to support', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3f27ef58-29f1-45a5-a49a-ed37ea085b18'::UUID, 'special staff officer', 'specialized advisor / subject matter expert', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3f73231b-aa9a-4fc8-945d-59ac055ac053'::UUID, 'shift work', 'rotating shift schedule management', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3f7f0d71-3e20-4b5e-b88d-0492a1509a7c'::UUID, 'led from the front', 'led by example in high-pressure situations', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3f9ffd7d-1071-42b5-861f-a09776f3eed7'::UUID, 'received NJP', 'received formal disciplinary action', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('3fba030d-9bc4-410e-87c4-63a6b3ae543b'::UUID, 'administrative law', 'regulatory compliance / administrative policy', 'general', 'legal', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4027f768-56e1-43c9-bb6d-528e84cc87ff'::UUID, 'nozzleman', 'primary fire suppression operator', 'navy', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4036abcb-db9f-4abb-8fe5-7bef2adda078'::UUID, 'reported aboard', 'joined the organization', 'navy', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('405fa287-19ad-4250-b963-36a1f2760e5f'::UUID, 'served as khaki mentor', 'served as leadership mentor for management candidates', 'navy', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('40b52b48-751c-4678-94ed-c883660402b0'::UUID, 'awarded restriction', 'received workplace restriction as discipline', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('40e09bd4-aa43-4e89-9f99-b56ac7850847'::UUID, 'completed SWOS training', 'completed surface warfare officer training', 'navy', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('41ae3437-7769-4ef3-9678-248000c4cbc7'::UUID, 'enlisted record brief', 'employee profile / personnel summary', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('41d5f616-d029-4d9e-8c8d-70420390addc'::UUID, 'served as departmental 3M assistant', 'served as department maintenance manager', 'navy', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('41f10c3a-b31b-4673-ac21-f7a45543250b'::UUID, 'consistently exceeded expectations', 'routinely surpassed performance goals', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('421bd412-d168-4031-8490-293ec8b3e2e3'::UUID, 'NEC holder', 'holds specialized professional credential', 'navy', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4233bc95-9f6b-4b34-862d-d479871121fe'::UUID, 'completed shore tour', 'completed headquarters/support assignment', 'navy', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4273cce1-4bdc-4cb3-86a9-0ebb72ead1ea'::UUID, 'under budget', 'completed under budget', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4274590d-2a44-450f-8192-d1cbd7b77f12'::UUID, 'completed ACSC', 'completed intermediate-level officer professional school', 'usaf', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('427671b5-1e5f-43f8-b4a1-871904fa604f'::UUID, 'respiratory protection program', 'respiratory safety and equipment program', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('42a71957-9699-4f5d-aebe-17aee51bda35'::UUID, 'JHA', 'job hazard analysis', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('42e37661-dd88-4cb2-9b32-deb7745c3c41'::UUID, 'battle E award', 'organizational excellence award', 'navy', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('436a3c75-99d3-46ae-8983-9dd079aacd69'::UUID, 'served as squad leader', 'supervised 13-person operational team', 'usmc', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('43eab66f-0636-43b2-b968-fd2cb3c0e027'::UUID, 'processed evals', 'completed employee performance evaluations', 'navy', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('43ee4a02-8caa-4aa9-83db-84b8d0a97e51'::UUID, 'welcome aboard package', 'new hire onboarding materials', 'navy', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4426bc30-d975-4f64-a974-3221a664f277'::UUID, 'earned Pathfinder qualification', 'completed advanced navigation and air traffic certification', 'army', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('443e394b-95b8-4026-be2f-5ffde934ec2c'::UUID, 'air assault qualified', 'completed air assault operations training', 'army', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('44b1405f-3f35-401b-8d1e-96ef3d5e71e0'::UUID, 'warfare qualified', 'specialty operations certified', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('44c071bc-0b76-4b05-8ebd-51b13e4578de'::UUID, 'man overboard drill', 'personnel recovery exercise', 'navy', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('44d64197-377b-4eba-b0d4-6e2bb2a0a27c'::UUID, 'hand-picked for', 'selected from competitive pool for', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('45087661-e542-4829-993b-fb0b1e06d046'::UUID, 'completed Sergeants Course', 'completed team leader development course', 'usmc', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4548b3b8-6d56-4bcc-b195-ce5749e184f0'::UUID, 'increased efficiency', 'improved operational efficiency', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('45616266-2695-4c6e-99de-b71db653b757'::UUID, 'C school graduate', 'completed advanced technical training', 'navy', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('45858dd6-f33d-493d-a242-140c7b9ab6ae'::UUID, 'held the line', 'maintained standards under pressure', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('458cd3e9-2efd-40c8-91d2-f15324f6b666'::UUID, 'fleet-up', 'promoted into next-level role / advanced within the team', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('45e4cb4f-996f-4dba-9b17-b09e16829d25'::UUID, 'earned Distinguished Graduate', 'graduated at top of class', 'usaf', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('45e57cb2-1204-489c-9819-0b7f2f143512'::UUID, 'vertical construction', 'building construction / structural construction', 'general', 'engineering', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('460852f7-818f-44dd-b493-c7ece8682bd0'::UUID, 'under instruction', 'in training', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('46db42e3-9ef4-49f0-9db6-b6de060e6d82'::UUID, 'separation date', 'employment end date', 'general', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('46f07494-0ef8-4fe0-ae26-d77d9847aa4b'::UUID, 'served as battle captain', 'served as operations shift lead', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4745ec32-0a70-4347-be4d-020d483d5c49'::UUID, 'selected for Chief Petty Officer', 'selected for senior management promotion', 'navy', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('474d4d3f-bb9d-4b59-a059-4c9d019654e1'::UUID, 'force multiplier', 'amplified team effectiveness', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('481093f8-22d0-48c8-adbe-8a4272a19d93'::UUID, 'cannibalize', 'sourced parts from another unit or system', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('482762a6-a82a-4961-8fc2-6019d386a8ed'::UUID, 'medical surveillance', 'occupational health monitoring / health screening', 'general', 'medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4843f860-6e59-46ef-a393-8100463d10ff'::UUID, 'passed ATG assessment', 'passed external readiness assessment', 'navy', 'compliance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('48e178a8-7ba9-435d-92f2-3739d37e0919'::UUID, 'served as LCPO', 'served as department supervisor', 'navy', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4958182b-039d-4f7c-bed0-335f00665327'::UUID, 'EPR', 'enlisted performance report', 'usaf', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('495f8220-5509-4344-bc2c-d916522546ee'::UUID, 'commanders intent', 'leadership vision and desired end state', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('496cc13f-b675-444c-b643-b7745e59b6a8'::UUID, 'shelf life item', 'item with expiration-based inventory management', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('49b5cb2f-f9c6-4e90-a347-cc079b821b51'::UUID, 'served as DCPO', 'served as safety/damage control petty officer', 'navy', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4a07ca47-9685-4f5e-ae11-e2074d5c72ed'::UUID, 'lessons learned', 'post-project improvement findings', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4a0cb2cb-e10d-4c07-b13b-9864e7254e59'::UUID, 'relief in place', 'personnel replacement and handover', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4a759b41-6098-458b-b343-55f62977a418'::UUID, 'knows no boundaries', 'demonstrates exceptional initiative', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4ad09c1b-d038-4fc5-856d-e90af6cd7690'::UUID, 'APFT', 'physical fitness test', 'army', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4ad3d360-b27f-4399-8cb7-61f2a52a399d'::UUID, 'NEC qualified', 'earned additional specialty certification code', 'navy', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4ba9a3bd-f9e5-41ca-9acc-cfbefe5ba400'::UUID, 'liaison with', 'coordinated with', 'general', 'communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4bf964a0-f6f1-4180-8d04-f0b32198901a'::UUID, 'qualified as EOOW', 'certified as engineering operations shift supervisor', 'navy', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4c23a85d-4490-45ea-8d3d-57eed2144e88'::UUID, 'train the trainer certified', 'certified as instructor of instructors', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4cc88bb0-a1c5-4362-a088-c97a88b8f772'::UUID, 'AOR', 'assigned area of responsibility', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4ce9eee1-d120-494e-b8fa-e115647cb5f2'::UUID, 'passed with zero findings', 'achieved full compliance with no deficiencies', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4d4a076f-f029-48ba-b658-875415da7aef'::UUID, 'for your SA', 'for your situational awareness', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4d631a9a-754a-4c5b-b696-bb9a679cbf18'::UUID, 'secured space', 'restricted access facility', 'general', 'security', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4d9abb65-e83d-481a-b303-c8c23f0b00f2'::UUID, 'received Joint Service Commendation Medal', 'received joint organization superior performance award', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4e1cf2ef-d76e-41c8-8f1e-79ee06b1e33b'::UUID, 'force protection', 'personnel and facility security', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4e910535-261c-4748-b219-8127e39ec42d'::UUID, 'integrated operations', 'multi-organization coordinated operations', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4ecd1ce5-32e1-4c64-a01b-384e44248a89'::UUID, 'earned Safety S', 'earned safety excellence recognition', 'navy', 'safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4f0e6353-a515-48c9-bc90-57cb7c164359'::UUID, 'watch rotation', 'shift rotation schedule', 'navy', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4f145b8e-4408-4012-b8c7-41c4dbbd1664'::UUID, 'earned Surface Warfare designation', 'earned surface operations warfare qualification', 'navy', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4f81e01a-47b5-47d4-82a7-aef2af82fc37'::UUID, 'completed ESWS board', 'passed comprehensive oral qualification board', 'navy', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4fb59627-16f6-47b4-8201-490a891b27a6'::UUID, 'stepped up', 'assumed additional responsibilities', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4fd90218-e6d9-4b58-b3c1-e821139defe4'::UUID, 'administrative action', 'formal administrative disciplinary process', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('4fe17188-2288-420e-aa65-749e8480a597'::UUID, 'purchase request', 'procurement authorization form', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('504bd658-c9a4-47aa-ab1f-0217060a057f'::UUID, 'LIMDU', 'limited duty status due to medical condition', 'navy', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('504cb9f9-9c24-473f-9c66-0ebd7dc158ad'::UUID, 'MRC', 'maintenance requirement card or procedure', 'navy', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('50795ea4-24c8-411c-8b5e-eee27a52729d'::UUID, 'shattered records', 'exceeded all historical performance records', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('50928175-b2e4-4f21-a726-b51a937b2818'::UUID, 'draw', 'issued equipment from supply', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('50aa7a78-258a-4d7c-93b4-497bae6eceab'::UUID, 'ORM assessment', 'operational risk management assessment', 'general', 'safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('50b78a20-6a58-46cf-8fdf-8420d4442b61'::UUID, 'awarded Navy Achievement Medal', 'received organizational achievement award', 'navy', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('51126c4f-71b5-4e90-98ba-584c67e6c4b9'::UUID, 'dual qualified', 'dual certified in two specialties', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('511b5298-5d34-4d3e-b279-77fd5509be58'::UUID, 'zero defects', 'zero-error performance', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('513769ad-2b0f-4242-9de6-998a211ead00'::UUID, 'rallied the team', 'motivated and aligned the team', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('51442afc-dc08-4c7e-8773-ec3c6afefc4a'::UUID, 'order of battle analysis', 'competitive landscape analysis / organizational assessment', 'general', 'intel', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('515b1f42-2c9d-4aa6-9b18-357dc613c65a'::UUID, 'conducted counseling', 'provided performance feedback and coaching', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('51637b7d-34ee-4309-88c6-ae24aad697b2'::UUID, 'maintained hand receipts', 'maintained property accountability documentation', 'army', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('51a573d4-c78a-49c8-8e01-ef197e68d64c'::UUID, 'safety climate survey', 'workplace safety culture assessment', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('51e3c964-63e3-4f87-b704-980c0d21c5d0'::UUID, 'conducted pre-deployment training', 'delivered pre-project mobilization training', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('51f0b8ff-a955-44e9-83c1-5c134a7ea392'::UUID, 'installed and maintained communication systems', 'deployed and maintained telecommunications infrastructure', 'general', 'comms', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('52083766-6fd6-4031-9930-122021380cc6'::UUID, 'led the charge', 'spearheaded the initiative', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('523c3b3b-3a90-4a00-9489-fc595b179da0'::UUID, 'closed the gap', 'eliminated the performance deficit', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('52878fd6-d9cf-4a7a-b0d7-64d6d1efad74'::UUID, 'top performer in the division', 'highest-rated employee in the department', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('52d1f86a-1387-48b1-9a92-a31e92dd96f8'::UUID, 'ready now for increased responsibility', 'immediately qualified for advancement', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5326bd60-0257-4f42-826a-e7867585d084'::UUID, 'served as damage control petty officer', 'served as division safety coordinator', 'navy', 'safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5333b558-f002-444c-90a4-6913920087d9'::UUID, 'port operations', 'maritime terminal operations', 'navy', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('538bbeee-2490-4b5e-8df1-64eb3e7c877d'::UUID, 'Class II supplies', 'clothing and individual equipment', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('53914a95-deff-4a27-a418-85f0243c210e'::UUID, 'PMC', 'partially mission capable or limited capability', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('53d2b86a-9580-47f7-8a24-98be80c472c9'::UUID, 'completed sea tour', 'completed operational/field assignment', 'navy', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('54bfa523-65ae-4bb4-8ed5-9abbb78c45ed'::UUID, 'command investigation', 'internal investigation / workplace inquiry', 'general', 'legal', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('551755b6-1ec5-4210-845d-dfb6df95de66'::UUID, 'IPAC', 'personnel administration center', 'usmc', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5539b565-b37e-491c-b427-290bfcc18936'::UUID, 'water walker', 'exceptionally high performer', 'navy', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('561789c8-682f-40ac-ac6f-9154442b3a1b'::UUID, 'information assurance', 'information security / data protection compliance', 'general', 'cyber', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5639dfac-cce1-4552-aecf-85805f551256'::UUID, 'frequency management', 'spectrum management / radio frequency coordination', 'general', 'comms', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('56751631-13e0-4c3c-93c3-e4e9abca16ae'::UUID, 'conducted UCI preparation', 'prepared organization for compliance inspection', 'usaf', 'compliance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('567872d5-089a-4802-8314-6d0e60fd88ed'::UUID, 'CGSC graduate', 'completed intermediate leadership education', 'army', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('567a6c3d-c53e-44be-adbd-3208b4ea81b6'::UUID, 'served as first sergeant', 'served as senior enlisted advisor and personnel manager', 'usaf', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('56ab92af-8824-49da-ae23-61fb2284c98b'::UUID, 'peak performance', 'optimal operational output', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('56bcdb0b-6176-45f7-8ebd-08ab53362588'::UUID, 'inventory reconciliation', 'physical count verification against records', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('56c18d31-3065-4f14-a42f-09e2a770679d'::UUID, 'maintained operational tempo', 'sustained high-volume workflow / kept pace of operations', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('56d8fb26-a76f-4ea1-86e3-13eaaf7aa20e'::UUID, 'attended SGM Academy', 'completed executive-level leadership course', 'army', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5747160e-dddb-43ed-9043-91718a0f67dd'::UUID, 'retrograde of equipment', 'equipment return and redistribution', 'general', 'logistics', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('57da65ae-a4e9-4b94-a079-baa2ffbc0744'::UUID, 'field maintenance operations', 'on-site equipment maintenance / mobile repair operations', 'general', 'logistics', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('57f7a2d4-e054-46b3-b525-2fadc3a41ca9'::UUID, 'attended WLC/BLC', 'completed first-line supervisor leadership course', 'army', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('58445cf9-31fd-4e79-ad37-57fb540eea19'::UUID, 'NIIN', 'national item identification number', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('587caca1-1ff6-496a-89f9-1f07f1515044'::UUID, 'hearing conservation program', 'occupational hearing protection program', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('587f59aa-26ea-4fec-9805-712dbd3374f8'::UUID, 'crushed it', 'delivered exceptional results', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5894ba34-e151-4d6d-adf4-b79e2775bf0c'::UUID, 'captain''s mast', 'administrative disciplinary hearing', 'navy', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5961e127-b153-4e40-a256-4d139b4b2b2e'::UUID, 'combat engineering', 'construction and demolition engineering / field engineering', 'general', 'engineering', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('596eecec-731b-42bf-9117-66a51c875297'::UUID, 'action item', 'assigned task requiring completion', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('59703449-1386-4670-a7b1-90e557d07161'::UUID, 'completed Army readiness training', 'completed organizational readiness certification', 'army', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('597321e4-6951-4b71-8c5e-cdcc16c1b97d'::UUID, 'received CSMC score of', 'received maintenance readiness score of', 'navy', 'compliance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5a4ab5ff-155c-4d43-93fe-00444c2d464e'::UUID, 'risk mitigation plan', 'risk reduction strategy', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5a90f3e2-5964-4374-b143-99efb761b75e'::UUID, 'increased retention', 'improved employee retention', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5ae97b35-e8db-49f1-a5ec-089eb3c6c036'::UUID, '#1 of all E-6s', 'ranked #1 among all mid-level supervisors', 'navy', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5aea6ee0-612d-4ac9-8dea-e1e5646179a0'::UUID, 'joint operations', 'multi-department collaborative operations', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5af713e4-eb7b-49ff-93e2-49b910744fa8'::UUID, 'ready for tasking', 'prepared and available for any assignment', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5b2122a8-1506-472e-b5ac-faf8928c278a'::UUID, 'dialed in', 'precision-focused', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5b3e0e0d-1d76-43e6-985a-a8ef1c512662'::UUID, 'issue and receipt', 'distribution and receiving operations', 'general', 'logistics', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5b4dad88-cdb7-4c4a-a8a6-60792b198076'::UUID, 'battle update brief', 'operational status meeting', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5b7656e4-1327-4fe9-a24f-14d6ba4409eb'::UUID, 'family readiness group', 'employee family support organization', 'army', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5b87f3aa-8f47-4581-b427-c8eeada966f6'::UUID, 'maintained 100% accountability', 'maintained full inventory accuracy', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5c383b50-aa3f-46d4-aa80-1ffe58443410'::UUID, 'quarterdeck watch officer', 'front desk operations supervisor', 'navy', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5c41b184-8bba-4b87-98a9-c2eecc7ff164'::UUID, 'communications interoperability', 'cross-platform communications compatibility', 'general', 'comms', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5c604c3c-8360-46ab-835a-d7ff2ce6154b'::UUID, 'hot standby', 'standby/ready state', 'navy', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5c6b5219-d401-4534-920e-c798dbef1581'::UUID, 'served as UTM', 'served as unit training manager', 'usaf', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5c744971-ba0c-4526-80c5-128e50fc627c'::UUID, 'gapped billet', 'unfilled position', 'navy', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5d00fa88-07d3-4a2f-8ea3-b2fe4d93c77a'::UUID, 'op-tempo', 'operational pace', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5d2a0b64-001e-4a81-ad22-2bf01c170397'::UUID, 'fast-tracked through qualifications', 'completed certifications on an accelerated timeline', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5d33513c-1c65-492c-9ed6-dc3e27ad00c5'::UUID, 'claims processing', 'insurance claims processing / liability management', 'general', 'legal', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5d5487ff-7974-452a-b1da-d121a8997f38'::UUID, 'mission brief', 'project kickoff meeting', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5ddc9ceb-66e2-497b-a861-01dc2753db7d'::UUID, 'rapid deployment', 'rapid mobilization / quick-response deployment', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5de9cc92-7d3a-447b-ab7a-27edda63aa40'::UUID, 'conducted inventory management', 'performed inventory control and tracking', 'general', 'logistics', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5e618065-3755-494c-a752-3a6bc13295f2'::UUID, 'drug interdiction', 'counter-narcotics law enforcement operations', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5e61f305-f1d0-4d56-8e41-baa68a9bd981'::UUID, 'maintenance float', 'spare equipment pool / backup inventory', 'general', 'logistics', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('5ff9be95-6a20-4494-a5c8-1fc782906d1a'::UUID, 'promote now', 'highest recommendation for immediate advancement', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('6008be0a-2327-4b68-8cac-bdfad47ecb82'::UUID, 'met all deadlines', 'achieved 100% on-time delivery', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('60d0fd70-8866-4100-869b-f9947d7392c4'::UUID, 'TLV', 'threshold limit value for chemical exposure', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('60ef1d0a-7394-4751-9a59-0c5c19affd10'::UUID, 'legal assistance operations', 'legal advisory services / employee legal support', 'general', 'legal', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('61222f6c-e0da-4f0a-8879-e9ce542f5c8c'::UUID, 'completed PQS', 'completed professional qualification requirements', 'navy', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('6160d4e6-0220-4e08-9b95-d584f42f7467'::UUID, 'combat qualified', 'certified for combat/field operations', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('6260315f-f03d-46f8-9c0b-9a15f3bc80e9'::UUID, 'detached from', 'departed/transferred from', 'navy', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('62a5e692-9803-41b2-a0cf-6541ab11a2f0'::UUID, 'pathfinder qualified', 'completed advanced navigation and coordination training', 'army', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('62b8b6b7-7010-4531-baf9-e68ed3644cfd'::UUID, 'achieved Battle E', 'achieved top operational excellence award', 'navy', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('62cbbb7a-b145-465e-8c29-14240378cd63'::UUID, 'ergonomic assessment', 'workplace ergonomic evaluation', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('630407d5-1b92-446b-a217-451fd5ff168a'::UUID, 'temporary additional duty', 'temporary assignment / short-term project assignment', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('63158fd5-f1da-45e1-9bef-a6dcb8f0ec22'::UUID, 'morning brief', 'daily standup meeting', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('63617e52-bada-4cd0-8fc0-1a39d2d072a7'::UUID, 'hand-carried the issue', 'personally escalated and resolved the issue', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('6384dc70-37b8-4b47-9c00-40d7e40b2646'::UUID, 'served as company commander', 'served as operations director', 'army', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('6430f0bf-dbd3-4c8e-a773-d0cc0ee40669'::UUID, 'CSMP', 'current ship maintenance backlog', 'navy', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('64ab3485-70b6-4ca9-b61f-1b3073a081c8'::UUID, 'served as squad leader', 'served as team supervisor', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('651e07e5-2bd4-4593-90e4-7a74df7d4deb'::UUID, 'officer of the deck', 'shift supervisor with full operational authority', 'navy', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('65788b9c-783e-4474-8bbd-c1de2fb010f6'::UUID, '#1 of all E-5s', 'ranked #1 among all front-line supervisors', 'navy', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('657f0daa-8d8e-46cf-a6e4-c476297ccd43'::UUID, 'early promote', 'recommended for accelerated promotion', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('65b03442-abc4-4168-8f44-d25b931e0c44'::UUID, 'maintained common operating picture', 'maintained real-time operational dashboard / situational awareness', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('65c58427-60ef-4d50-a671-9a91e8676573'::UUID, 'flight operations', 'aviation operations management', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('66327ced-7b25-4f7e-8929-f0451f05d976'::UUID, 'base camp construction', 'temporary facility construction / field site development', 'general', 'engineering', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('665a0cdd-f4dd-4bc3-9141-feb13fe46647'::UUID, 'outperformed the competition', 'outpaced comparable organizations', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('669675dd-a2d7-4b7a-8fd8-6d1ddc704e8c'::UUID, 'a proven warrior', 'a proven performer in high-stress environments', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('670d149b-3f3b-4822-b6bf-5fa6ce1620cb'::UUID, 'command climate survey', 'employee engagement and culture survey', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('67a9aa92-af8b-4e18-981c-683fa569a180'::UUID, 'mission capable rate', 'operational readiness rate / fleet availability', 'general', 'aviation', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('67c65f82-34d2-4c86-abcb-be8971e5cca4'::UUID, 'supply chain management', 'end-to-end supply chain management', 'general', 'logistics', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('67ce0725-d9c9-4024-8564-2b29fab95e68'::UUID, 'NSN', 'national stock number for cataloged items', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('681335e5-a0f5-4e9f-8492-aaa985c07595'::UUID, 'delivered under fire', 'performed effectively under extreme pressure', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('685b8b9d-9178-4841-b78a-9d8b4f6ffe80'::UUID, 'took charge of', 'assumed leadership of', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('68a5e948-fe1f-43ca-a46e-596750850ee8'::UUID, 'saved the day', 'resolved critical issue under time pressure', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('68bbccae-500e-478c-89f3-68db976c4711'::UUID, 'AFSC trained', 'completed specialty career field training', 'usaf', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('68e2fc2c-bd6f-4cdf-ab63-c6b45cc7b3cc'::UUID, 'principal staff officer', 'senior department head / chief advisor', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('694c1e48-e17a-48e9-a1cd-8300b1574b52'::UUID, 'bridged the gap between officers and enlisted', 'facilitated communication between leadership and staff', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('6978ec22-b940-4098-a5db-9fff697eaecc'::UUID, 'MDMP', 'structured decision-making process', 'army', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('699b482d-c06d-40c6-b6d1-9f78e0e8c9bf'::UUID, 'hot work', 'welding and cutting permit-required work', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('69bcb30c-2d5b-4d79-aa5d-b5ab8867f32b'::UUID, 'near miss', 'near-miss incident report', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('69cb4e82-8226-4fab-a4c4-3827c0385c40'::UUID, 'jump qualified', 'earned airborne operations certification', 'army', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('69d89b94-74b9-4d9d-ac4c-fd82d429a38d'::UUID, 'minefield operations', 'hazardous area management / restricted zone operations', 'general', 'engineering', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('69df8348-12f7-4560-bdd7-92dceb98c150'::UUID, 'obligation authority', 'spending authorization / budget commitment authority', 'general', 'financial', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('69f632bc-8330-46a3-9243-65597cb8e62a'::UUID, 'cyber threat intelligence', 'cybersecurity threat analysis / threat intelligence', 'general', 'cyber', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('6af5f0ca-e82a-43b9-9453-b99e9d36b582'::UUID, 'basic training graduate', 'completed foundational workforce training', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('6b3469c0-dca6-43b2-a854-afad3c47f8eb'::UUID, 'submitted requisitions', 'submitted procurement/purchase requests', 'general', 'logistics', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('6b5898e7-1d91-4c5e-b636-c4b8cfe54766'::UUID, 'IG complaint', 'formal grievance through oversight channel', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('6bcb230e-9a31-4025-aea4-dc96c0ebcd27'::UUID, 'ensured mission accomplishment', 'ensured all objectives were met', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('6bda14a9-a35d-4085-ad95-84c77725fcde'::UUID, 'BLUF', 'executive summary placed first', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('6c16472a-ce32-47e5-a99d-0916d57faa21'::UUID, 'the embodiment of Navy core values', 'exemplifies organizational core values', 'navy', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('6c959f16-1aa8-4336-aff3-658293ae6346'::UUID, 'kept the momentum', 'sustained progress toward objectives', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('6c9d2376-14f3-42ca-aaff-c7280f50dbd4'::UUID, 'GPC', 'government purchase card or corporate procurement card', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('6cc0d9dd-74bf-493e-bb9a-7d74081c5854'::UUID, 'exceeded unit standards', 'surpassed departmental benchmarks', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('6cd653a7-329c-4c31-861b-dfd77225b4cc'::UUID, 'collection management', 'data collection strategy and oversight', 'general', 'intel', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('6d3c5c02-4d8c-421e-8e19-5bfe6c8e2424'::UUID, 'request mast', 'formal request to meet with senior leadership', 'usmc', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('6d514d55-a857-4879-9a5b-17381f99e589'::UUID, 'awarded Air Force Achievement Medal', 'received organizational achievement award', 'usaf', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('6da124df-c6ba-47e2-bddd-30a0a6149f70'::UUID, 'EAWS qualified', 'earned enlisted aviation warfare specialist certification', 'navy', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('6e3ddf49-cec2-4582-b28e-d7bd8d303528'::UUID, 'stood down', 'decommissioned or closed', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('6e669f97-a295-4a4f-9b1e-95f6ec1e0a95'::UUID, 'made the cut', 'met competitive selection criteria', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('6f4f47f3-7252-4a04-995d-a666de9f4f99'::UUID, 'combat ready', 'fully operational and certified', 'general', 'compliance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('6fee59d1-347c-424f-b210-14c1d9978792'::UUID, 'signal plan', 'communications plan / network architecture', 'general', 'comms', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('700d06f8-4c94-4dad-81f7-e80277678b19'::UUID, 'took ownership', 'accepted full accountability', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7058d8de-f77c-4f1f-96c7-e7c20063e95f'::UUID, 'strengthened the chain of command', 'improved organizational communication and accountability', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('70aa2774-50ef-40c3-a88d-aaff5e267bc7'::UUID, 'change of command', 'leadership transition', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('710bd225-e29b-4ff6-bdd3-f6305cc41f7d'::UUID, 'transfer of authority', 'transfer of responsibility / handover of authority', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7157b037-e93b-40b0-96e6-2f90eadc2d03'::UUID, 'served as acting commander', 'served as interim director', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7191dea3-ce3a-4ce5-ab65-714ba3a39c02'::UUID, 'a true deckplate leader', 'a hands-on leader who leads from the front', 'navy', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('722878f5-8967-4751-bd96-aba1fc7f5c87'::UUID, 'liberty', 'personal time off', 'navy', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('72e76324-187b-4102-8a57-5394a9f636e5'::UUID, 'established a forward operating base', 'established a satellite office / remote operations center', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('72e83195-14b9-4890-ae76-e757ac429d04'::UUID, 'extra duty', 'additional assigned duties as corrective action', 'general', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('73c5278f-0780-41ac-a367-cb4be120d76d'::UUID, 'SDS', 'safety data sheet', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('73d9f5d2-8108-432d-90a3-50fa34494e8f'::UUID, 'CIAL', 'component identification and authorization list', 'navy', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7474b97a-44ab-48af-b2bb-936b3212c27c'::UUID, 'end item', 'final assembled product or system', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7491ff42-a20e-437e-b9f9-a802764bfb3e'::UUID, 'combat casualty care', 'emergency trauma care / field emergency medicine', 'general', 'medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('74ca1353-a9cd-43d5-8f79-50fa980bce44'::UUID, 'warning order', 'advance notice of upcoming tasking', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('74cba0c6-6147-4a44-9453-a00b4ce1cbff'::UUID, 'zero discrepancies', 'achieved 100% compliance', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('74d8c240-9c99-4288-b5c6-d2a6e16faed4'::UUID, 'active shooter drill', 'active threat response training exercise', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('74d9080c-df75-4b84-a9b5-3851950a1c51'::UUID, 'civil-military operations', 'public-private partnership operations', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('74e75766-145c-42a4-82ce-228e7e0fdcdf'::UUID, 'maintained arms room', 'managed secure property storage facility', 'army', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('74e944c9-48f2-4cf7-a4a4-957ddbf4de16'::UUID, 'post-deployment stand-down', 'post-assignment recovery period', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('750c7c4c-b647-4f36-9f77-66691320e22b'::UUID, 'JPME complete', 'completed joint professional military education', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('75104461-b66e-4770-9553-ec7ed39e734b'::UUID, 'depot-level maintenance', 'major overhaul at specialized repair facility', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('751c5203-ab23-4956-b9f5-c46ac4df089f'::UUID, 'SARP', 'substance abuse rehabilitation program', 'general', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7533e225-b57d-4e8f-82a6-1bc3bf5939ce'::UUID, 'keeper of the keys', 'custodian of critical resources', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('759fe70c-7998-44da-9116-092483b5a792'::UUID, 'filled the gap', 'addressed critical staffing shortage', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('75a1a57a-fc7b-4fce-9ac0-9440283be9cb'::UUID, 'utilities infrastructure', 'facility utilities management / building systems', 'general', 'engineering', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('75eab2c8-1399-42b3-82c1-dee33126c437'::UUID, 'theater security cooperation', 'international partnership operations', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('75ec1aed-440a-4266-a4a1-3069292ee7ad'::UUID, 'ground safety officer', 'workplace safety officer', 'usaf', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('766431c7-6dfe-423f-a8a7-dec51181f16e'::UUID, 'qualified personnel in', 'certified personnel in', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('76953360-c404-4e67-be7d-489ef6d100ed'::UUID, 'expert marksman', 'achieved expert-level proficiency certification', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('770eb82e-af98-4685-ad1f-3dc4008e50ed'::UUID, 'warfare qualified', 'earned professional certification', 'navy', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('774f7d30-5302-44e5-b0bc-00c2bd51109b'::UUID, 'base operations', 'facility operations management', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('77ca6db9-072b-4fc0-82c7-4624dd256a8c'::UUID, 'mission essential', 'business-critical', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('77f135e3-6010-4bab-9215-cf9ecc211104'::UUID, 'broke the mold', 'introduced innovative approaches that redefined standards', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7853a323-7002-49bb-83f1-0984d68343f5'::UUID, 'intermediate-level maintenance', 'repair performed at regional maintenance center', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('78c7b91b-fc62-4493-ab07-60c58fd28363'::UUID, 'chop chain', 'review and approval routing', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('790db565-ae70-4460-9439-5964dd967c3e'::UUID, 'med down', 'unavailable for duty due to medical reason', 'general', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('79970401-293e-4019-8669-701b711fc5fe'::UUID, 'restriction', 'limited privileges as disciplinary measure', 'general', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7a157038-c500-4226-a376-38f166bbdc66'::UUID, 'field sanitation', 'environmental health and sanitation', 'general', 'medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7a772572-e5c0-4faf-b80a-770f445c21b9'::UUID, 'put it on the radar', 'brought it to leadership awareness', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7a9fadce-4833-4c2c-8b52-016bf99e0b3d'::UUID, 'battle buddy', 'accountability partner', 'army', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7aa43f52-347f-46f0-98db-1329cc0ff64b'::UUID, 'reenlistment eligible', 'eligible for contract renewal', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7ac4e025-a3e6-4612-9763-64b228b6b2da'::UUID, 'among the best', 'recognized as a top performer', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7b171c43-0e56-4561-8c3e-868e8a0ee7af'::UUID, 'assigned to', 'assigned to', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7b362779-d8d3-485a-aee4-b0cd81209d6a'::UUID, 'subject matter expert in', 'recognized authority in / deep expertise in', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7b4ecc43-58a8-41f3-be79-6598b0005289'::UUID, 'awarded Meritorious Service Medal', 'received executive-level achievement award', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7b7c77f0-5df8-4894-8baf-c037a3481959'::UUID, 'fill rate', 'staffing level percentage', 'general', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7b82a357-6c03-4960-9911-f952d863bdce'::UUID, 'formal counseling', 'formal performance documentation session', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7b8d5da5-b05e-435a-bca2-f472e8de6344'::UUID, 'leave chit', 'time-off request form', 'navy', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7bb3fbf0-d2e9-41ef-80a1-c7ca31f91b8a'::UUID, 'served as CFL', 'served as physical fitness program coordinator', 'navy', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7bd02bf8-c035-49ae-8b94-00ac0f211cde'::UUID, 'CENTCOM AOR', 'Middle East operational region', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7c712a40-f021-4896-bee0-709f50e11956'::UUID, 'material condition', 'equipment and asset condition', 'navy', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7cf24224-30d3-41b9-a22c-cadedb596baa'::UUID, 'fire drill', 'fire emergency response drill', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7d20f62f-6b9d-4238-a355-341b3a943f1c'::UUID, 'trained to standard', 'trained to established performance benchmarks', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7d878f40-025f-4ba7-98a8-810e7f0700ea'::UUID, 'ETS', 'end of term of service date', 'army', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7dbce5db-af76-4406-9482-376ae1f86a55'::UUID, 'fitness report', 'annual performance evaluation', 'usmc', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7dc43b74-a2ec-4c32-945d-39ee9686f10a'::UUID, 'medical readiness', 'health compliance and clearance status', 'general', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7dfa9de8-8ec8-415d-94a9-1c9dae884024'::UUID, 'airman of the quarter', 'employee of the quarter', 'usaf', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7e2f8da0-5a3f-411c-866b-d38f636d8634'::UUID, 'clean bill of health', 'passed all compliance reviews', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7e386d0f-9cc3-4bbf-9588-9f6d1937bfcd'::UUID, 'CDB complete', 'completed career development board review', 'navy', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7e447af6-4a1e-465b-b83f-a46834eba410'::UUID, 'officer call', 'leadership-only meeting', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7e86408f-b43b-40ac-be55-c784571003fc'::UUID, 'port and starboard', 'alternating two-shift rotation', 'navy', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7ec4d107-9949-4b28-84e6-ddee2872a5c6'::UUID, 'downrange', 'in the operational area', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7ed1c70e-734d-4b28-bd55-112b2a2bf597'::UUID, 'executed change of command', 'completed leadership transition', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7eeb1f2c-f181-4377-be3e-437ce9355f05'::UUID, 'served as ADPE custodian', 'served as IT equipment custodian', 'usaf', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7efe04a7-fded-414d-b0bd-6b1a6de73279'::UUID, 'CCC', 'command career counselor', 'navy', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7f5b74b9-2ee5-4d32-8f9b-0da025a9acc1'::UUID, 'flight line operations', 'aircraft ramp operations / apron management', 'general', 'aviation', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7fb6c376-a852-40b5-bbb0-fc0ca9b0648b'::UUID, 'best in fleet', 'top-performing unit in the organization', 'navy', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('7fb7dd96-b1cb-4a52-a961-5ad9cf9476c4'::UUID, 'equipment casualty', 'equipment failure/malfunction', 'navy', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('800f9117-8166-4c98-833d-aeba43031abb'::UUID, 'no findings', 'received zero audit findings', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('80314171-bd87-43b9-9689-f80354f01a0c'::UUID, 'days underway', 'days of deployed operations', 'navy', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('804fe3f0-7a03-4517-a9f4-e2493f7d1b9b'::UUID, 'completed NCOA', 'completed mid-level leadership development course', 'usaf', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('80bfc0ec-0a42-4c00-9728-0b06d80d5ce5'::UUID, 'reenlistment', 'contract renewal', 'general', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('80c3c732-509b-4be2-bfd0-64db51ea6a7c'::UUID, 'reporting aboard', 'checking in at new assignment', 'navy', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('80ca5477-31fa-4ff8-b4db-3db23eaff90a'::UUID, 'sustained exceptional performance', 'consistently delivered outstanding results', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('80ccc71c-2fce-449d-b00a-358b3a196c57'::UUID, 'board certified', 'passed oral examination board', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8139d045-4559-4ae0-9459-6e098d91a925'::UUID, 'outstanding rating', 'achieved the highest performance rating', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('81790346-262d-4952-b3ca-63e53c9b3256'::UUID, 'in country', 'deployed to the region', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('81956f96-9b05-4443-9436-f096cea19d2f'::UUID, 'above and beyond', 'exceeded all performance expectations', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('81b8b29f-745e-46cc-a183-c6f76a331d30'::UUID, 'highest state of readiness', 'peak operational performance', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('81c5a2c9-f6c2-4b92-adf7-95d876ea8afa'::UUID, 'joint and combined operations', 'multi-organizational and international operations', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('82040068-564b-4de0-9d61-6dbdb5ef8fcf'::UUID, 'received Letter of Commendation', 'received formal written recognition from senior leadership', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8252152c-3926-4201-af87-e484a68372d7'::UUID, 'RFI', 'ready for issue or fully serviceable', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('825e1593-f8cf-4008-84a6-b5a289f631e0'::UUID, 'unfunded requirements list', 'unfunded budget request / supplemental funding request', 'general', 'financial', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('826639f4-9972-4430-8a69-d160a4c0a243'::UUID, 'earned 9-level', 'achieved superintendent-level certification', 'usaf', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8269d340-ce5b-4405-a702-baf07a7faaf2'::UUID, 'zone inspection', 'facility compliance inspection', 'navy', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8292add8-275a-4b08-9739-fa72d2a4f3b4'::UUID, 'guided junior personnel', 'mentored entry-level employees', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('82946213-9da2-4a3d-8dd1-99fe7bd1b09d'::UUID, 'pre-deployment workup', 'pre-assignment preparation and training', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('829efb3e-1fca-439e-8775-9089fd9cfb99'::UUID, 'supervised the training of', 'oversaw professional development for', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('830bf93c-799e-4226-8112-ad9319933dc2'::UUID, 'supported ATG assessment', 'supported external readiness assessment team', 'navy', 'compliance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('831b3da0-f244-41a0-894d-61cd90667433'::UUID, 'combined operations', 'multi-organization collaborative operations', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('837837ea-23c0-4711-ac5b-3d7b709d8791'::UUID, 'led from the front', 'led by example / hands-on leadership', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('838f1e0c-2a9f-44c3-8aee-bfacd6918ded'::UUID, 'submitted awards', 'submitted employee recognition nominations', 'army', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8390e0a5-00ef-4a28-97fc-8a62553337fb'::UUID, 'passed INSURV', 'passed major regulatory compliance inspection', 'navy', 'compliance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('83c92836-276f-4b02-b103-03b26dd46ef7'::UUID, 'NSTM', 'Naval Ships Technical Manual / technical reference', 'navy', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('83eac97d-bd44-4b87-8105-89b156a85339'::UUID, 'program objective memorandum', 'multi-year budget proposal / strategic financial plan', 'general', 'financial', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('83f5f24a-5eac-4d94-a03e-ea66fef7cae0'::UUID, 'joint operations', 'multi-service coordinated operations', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('842888d1-7902-4349-8cf3-fb1a7a7caab8'::UUID, 'ORM', 'operational risk management assessment', 'navy', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('84392f25-d521-452f-824d-2117414a4f8b'::UUID, 'movement to contact', 'proactive engagement / outreach operations', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8441bdb7-f1e7-4ab7-a2fa-1ad1e9210e10'::UUID, 'surge', 'increased operational capacity', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8443e1a8-73c9-4195-af5b-37c34483a7f4'::UUID, 'cost-benefit analysis', 'cost-benefit analysis / return on investment analysis', 'general', 'financial', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8487c685-2898-4b5f-afb2-330409935c1b'::UUID, 'sustained operations', 'continuous operations / around-the-clock activities', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('848bcb5c-3383-4366-8c01-38ee3d3ebbb9'::UUID, 'medical readiness classification', 'employee health clearance status', 'general', 'medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('84ddc89f-5414-494e-88c8-5dd61d0690f5'::UUID, 'earned information warfare designation', 'earned information operations warfare qualification', 'navy', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('855f8c4f-1b09-4778-bc09-56703d39c5eb'::UUID, 'groomed for command', 'developed for senior leadership', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('857e6e92-fad5-4181-a4f0-23e59082f6f5'::UUID, 'heads up', 'advance notification of upcoming issue', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('859ed29a-0ae1-4889-973c-17ff41c1d1c0'::UUID, 'received Purple Heart', 'received combat injury recognition', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('86180142-fca3-460b-904c-84d9a676f461'::UUID, 'OER', 'officer performance evaluation', 'army', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('86a9e6ed-8e3a-4517-a6f9-401d24bb2f80'::UUID, 'sustainment operations', 'ongoing support and resupply operations', 'general', 'logistics', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('872d50d2-5ba3-41e2-8e0c-6e36701036a9'::UUID, 'school trained not yet qualified', 'completed coursework pending on-the-job certification', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('87d41f15-4d77-4786-a002-debcbeb13518'::UUID, 'served as OIC', 'served as officer-in-charge / program director', 'army', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('881affa8-1292-4f28-a82a-1cc95d182bdb'::UUID, 'FYI traffic', 'information-only distribution', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('88504396-2c5a-462d-8bcd-d140fc7ff769'::UUID, 'completed deployment', 'completed extended field assignment', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8860b4c7-34fa-4bdd-a48a-5a4de7eb8a6a'::UUID, 'DD-214', 'certificate of release from employment', 'general', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('88c482ac-ef4d-4df3-8b37-47f61683ef0b'::UUID, 'syllabus complete', 'completed required curriculum', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('88e2c7ce-0351-414c-8643-597d9c69c5fb'::UUID, 'detaching', 'separating from current assignment', 'navy', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('89087c25-daa4-4da2-a812-0b0094013a6a'::UUID, 'safety violation', 'safety noncompliance finding', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('895d2f55-9635-4532-90b9-7de269302ee0'::UUID, 'Class A mishap', 'major safety incident ($2M+ or fatality)', 'general', 'safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('89fe28cb-ffbf-48e3-8952-9742ca3476ba'::UUID, 'participated in COMPTUEX', 'participated in comprehensive operational training exercise', 'navy', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8a086f74-3606-45e2-84c2-338f6a5311b2'::UUID, 'intelligence cycle', 'research and analysis lifecycle', 'general', 'intel', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8a33475a-dba0-4233-b4ec-35fe373a09de'::UUID, '24/7 operations', 'continuous round-the-clock operations', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8a44a9a1-2e09-4d69-9fe1-cb5e7936ca07'::UUID, 'survey', 'formal process for writing off damaged or lost equipment', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8ac8d03e-d3e0-4b8a-830b-7e847fadda93'::UUID, 'operational readiness', 'organizational preparedness', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8acf3ae9-b2af-4e2c-b51d-21a8b0db01a7'::UUID, 'completed Warrior Leader Course', 'completed initial leadership development course', 'army', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8aee9f67-cd8d-4496-bb4d-6f1d8ae039b3'::UUID, 'weapons qualification', 'proficiency certification / skills verification', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8b0158b7-3f1e-4cde-b50b-4c59357a2fc4'::UUID, 'dwell time', 'time between operational rotations', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8b0224c3-2a74-499d-90ae-1cab7db08bfb'::UUID, 'instilled discipline', 'established accountability and work standards', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8bf1d142-8bc4-4811-bc5d-0a62f8de392a'::UUID, 'tasker', 'assigned project or action item from leadership', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8bf3b964-56a8-410d-a720-83912c7d3ef5'::UUID, 'PT standards', 'physical fitness standards', 'general', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8c4fb110-924e-4b3d-844b-adbee36a24bf'::UUID, 'Halon system', 'fixed gas fire suppression system', 'navy', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8c7b2b8b-e5d9-4c68-a2ca-8a96223c80ef'::UUID, 'frocked to Chief', 'given acting senior management authority', 'navy', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8d248554-dddf-433f-a781-0298c5a1c272'::UUID, 'key leader engagement', 'executive stakeholder relationship management', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8d845e4d-b917-4bc4-a44c-cfb24ea592ad'::UUID, 'locked on', 'fully committed and focused', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8d95b775-2d07-4b49-a69d-345bc775f18a'::UUID, 'A school graduate', 'completed initial technical training', 'navy', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8dbb1ccd-f169-4fbc-a7d2-09e27325fbec'::UUID, 'served as first sergeant', 'served as senior enlisted manager for 100-200 personnel', 'army', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8de94248-874d-49be-b226-e4593d9d1b08'::UUID, 'set the example for others to follow', 'modeled professional behavior and performance', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8e12292f-c57c-4b54-9c38-d3f4c815f052'::UUID, 'class C mishap', 'severity level 3 incident with moderate impact', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8e32a3e7-ee70-45a6-9270-04a612417273'::UUID, 'sortie generation', 'flight operations throughput / aircraft mission launch rate', 'general', 'aviation', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8e577101-41c3-4cfb-b262-b02bb27b604a'::UUID, 'fragmentary order', 'amendment to existing plan', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8e7966f5-050c-4c47-9a80-9369640edc8b'::UUID, 'mission command', 'empowered leadership / decentralized decision-making', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8eadd8ee-1dae-48bc-a51d-2ed2dee289da'::UUID, 'battle staff', 'executive operations team / crisis management team', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8ec2d4e3-f172-4e29-bf01-80614508a58b'::UUID, 'pre-expend', 'pre-staged supplies for immediate use', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8f074b8c-c15d-4487-8589-3046476d8e4c'::UUID, 'resource management officer', 'budget manager / financial controller', 'general', 'financial', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8f3d1744-8e2b-4804-8c71-921ba0f53cca'::UUID, 'contracting officer representative', 'contract manager / vendor relationship manager', 'general', 'financial', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8f5ef26e-78c3-4bff-ac28-943ab0ca5f3f'::UUID, 'ensured training readiness', 'verified all staff met training requirements', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8f7d51ec-0e2f-4734-ac87-a153d4af6083'::UUID, 'combat proven', 'validated through operational experience', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('8fd3bb60-7df3-4c9a-ad32-da68d67634cd'::UUID, 'cross-deck', 'transferred equipment between units', 'navy', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('90386450-0e0e-4a18-9b4a-177c0caaa029'::UUID, 'served as company gunnery sergeant', 'served as senior operations manager', 'usmc', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('90aa2cf8-12b2-4b96-bfa4-2d9d3796ed52'::UUID, 'force protection', 'physical security and threat mitigation', 'general', 'security', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('90c96f31-a1ec-4b94-9bcd-404074698b7d'::UUID, 'squared away', 'thoroughly organized and prepared', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('90cf0a34-3dd7-42bb-b404-b73b7baf1eef'::UUID, 'served as security manager', 'served as information security program manager', 'navy', 'security', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('90d071d8-0a1f-4103-905a-916c66a62b1a'::UUID, 'full send', 'committed fully to achieving the objective', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9189b3d6-77b2-4678-860b-e3c4b9dcdaff'::UUID, 'captain''s mast', 'formal senior leadership disciplinary hearing', 'navy', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('919a32ad-1f0e-4b4f-9962-ff7f88aa0495'::UUID, 'deployment ready', 'certified operationally ready', 'general', 'compliance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('91c88d40-9009-4597-b508-7dc01ebbe371'::UUID, 'conducted change of command inventory', 'conducted leadership transition property audit', 'army', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('922f494a-09bd-4be0-9e54-d726555d3b5d'::UUID, 'unmatched technical expertise', 'unparalleled technical expertise in the field', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('927e1555-0adf-49a8-b631-33ad1ee83938'::UUID, 'administrative reduction', 'demotion / reduction in grade', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9285b4af-b1c8-4f46-9696-b2052fc6614e'::UUID, 'passed with flying colors', 'achieved superior results in evaluation', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('92877ec6-1e20-4f5f-9b43-40493a1a0c17'::UUID, 'raised the bar', 'elevated performance standards', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('928ad47d-7a35-49e2-aa36-b71b04a2dd2d'::UUID, 'zero defect mentality', 'zero-error mindset / quality-first approach', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('92902835-005f-4f92-9496-2292404a99d0'::UUID, 'phone tree', 'emergency communication cascade', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9291fad2-bbb1-4640-9ca6-69dc7f07f5d3'::UUID, 'stood up a new unit', 'established a new department / launched a new team', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('93498af6-52b8-4526-8dda-e7bb9867e45a'::UUID, 'access control', 'facility access control management', 'general', 'security', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('93da5ea3-c83c-4ceb-b494-8c74ae941692'::UUID, 'safety investigation board', 'incident investigation committee', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('940e7791-04a5-4720-9409-c45b2587069e'::UUID, 'frocked to', 'given acting authority at higher level', 'navy', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('949c2567-ae91-4d72-951d-d8b789490007'::UUID, 'consistently exceeded expectations', 'routinely surpassed performance targets', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('95948200-1631-45f6-a75f-d8e9587f3d35'::UUID, 'intelligence preparation of the battlefield', 'comprehensive environmental analysis / market intelligence', 'general', 'intel', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('95b2fa44-c69e-40aa-92ea-8cd0d8783c81'::UUID, 'danger tag', 'lockout/tagout safety tag', 'navy', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('95f523e7-f5d4-4dcd-9685-c7193179408c'::UUID, 'medical readiness', 'workforce health compliance / occupational health readiness', 'general', 'medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9799de75-ef7a-4037-af02-4abcd6be0fdc'::UUID, 'attended SLC', 'completed senior supervisor leadership course', 'army', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9841de16-4f3f-44a9-96be-19bf575c10b1'::UUID, 'equipment readiness rate', 'equipment availability percentage', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9872702f-ecd1-48e7-9358-a7cf0a5653ff'::UUID, 'maintained the watch', 'ensured continuous operational coverage', 'navy', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('98742a22-a80e-4eb3-b521-194b0c4b72c5'::UUID, 'unified the effort', 'aligned cross-functional teams toward common goals', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('98b67d01-4390-43f5-b63e-b6adeb7c4518'::UUID, 'range qualified', 'certified in equipment operation and safety', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('98c1c7a7-53cf-4ac4-8666-b132d7ef75d1'::UUID, 'supply chain management', 'supply chain management', 'general', 'logistics', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('98e40da8-c7b1-4782-a243-67ab11a9a0b3'::UUID, 'safety petty officer', 'department safety coordinator', 'navy', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('98e8e5cc-4d03-435b-b09f-cbb7b52176e3'::UUID, 'COOL program participant', 'enrolled in civilian credentialing program', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('98fb0fcd-1910-4d25-a657-afbe8c42f608'::UUID, 'served as adjutant', 'served as chief administrative officer', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('98feb2db-7617-4401-856f-d9f15f876507'::UUID, 'tag-out procedures', 'lockout/tagout safety procedures', 'navy', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('99604a00-8b5b-429f-a220-b9578aaf28ab'::UUID, 'brief sheet', 'one-page summary document', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('996b5347-b726-48de-83b3-c7d6a317dd28'::UUID, 'Class IV supplies', 'construction materials', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('99bc4c29-feb7-444f-83ac-652433815a32'::UUID, 'logistics support area', 'supply and distribution center', 'general', 'logistics', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('99c016c6-58df-4345-ba61-825cf85669bd'::UUID, 'led joint operations', 'managed cross-functional initiatives', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('99ee392e-9f1c-4c53-a25b-ca17021423cd'::UUID, 'maintenance turnaround', 'aircraft servicing cycle / turnaround time', 'general', 'aviation', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9a4de68f-76b1-4c26-8bca-4f2589cbb7c7'::UUID, 'requisition', 'purchase order or supply request', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9a5795a3-d4f9-4be0-9726-bfddae5ae37c'::UUID, 'gas free engineering', 'atmospheric testing and safety certification', 'navy', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9a6fa4ce-c787-4071-b38e-d1959bdfc87c'::UUID, 'served as XO', 'served as deputy director/chief operating officer', 'navy', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9a9a8b7c-225b-4482-84bb-85954ade6e3c'::UUID, 'board qualified', 'passed comprehensive oral qualification examination', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9ab18b37-836d-4d71-8f00-3a2d2812fed5'::UUID, 'the finest Senior Chief I have served with', 'the most exceptional senior manager in my career', 'navy', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9add58e9-20ba-4480-ba01-65a951c91355'::UUID, 'permanent change of station', 'organizational transfer/relocation', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9b33e4ab-2103-4d13-96df-ff90d7bab59b'::UUID, 'general quarters drill', 'full-scale emergency response exercise', 'navy', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9b3fedbf-e966-4d6f-a57b-58031d03e5f0'::UUID, 'convoy operations', 'coordinated fleet movement operations', 'army', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9b463bff-7b7c-4030-b234-2407a7f520a3'::UUID, 'command fitness leader', 'unit physical fitness program coordinator', 'navy', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9bc51e32-c320-4527-b871-9a86840d7b00'::UUID, 'supported TSTA/FEP', 'supported multi-phase operational readiness training', 'navy', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9bf1ba4a-9fab-4e4b-a77c-27424ddaec80'::UUID, 'awarded Army Commendation Medal', 'received superior performance award', 'army', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9c399322-fa2f-4a84-9035-2c4c11a51a96'::UUID, 'advanced to', 'promoted to', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9c557f66-09be-4f1f-bad5-dc727719e947'::UUID, 'served as 3M work center supervisor', 'served as maintenance section supervisor', 'navy', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9cd49848-f0ef-4843-9167-8d8fd7f4bea9'::UUID, 'conducted inventories', 'performed asset accountability audits', 'army', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9cd844bf-ec51-4850-beca-b23b97abd30c'::UUID, 'EAOS', 'end of active obligated service date', 'navy', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9d3bf6c1-e683-40e1-a9fd-e6bbcf7b0584'::UUID, 'brought to bear', 'leveraged all available resources', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9d444f81-f566-4c08-89d0-8fd14fd7e230'::UUID, 'watch team supervisor', 'shift operations supervisor', 'navy', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9d6a907c-0fe2-49bb-a310-f35701bff437'::UUID, 'served as BN training NCO', 'served as organization training manager', 'army', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9daa27a5-ac83-4f66-aa0d-466964ee9610'::UUID, 'SAPR victim advocate', 'confidential victim support specialist', 'general', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9dbbe81f-5912-473f-a324-7d7fb06cee50'::UUID, 'risk management framework', 'cybersecurity risk management framework / NIST compliance', 'general', 'cyber', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9dc0d39d-40f2-43b1-a52d-d96f169c1149'::UUID, 'CONUS', 'domestic United States', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9e4a8a70-8479-434f-b94b-0618cc297133'::UUID, 'briefed the CO', 'briefed senior executive leadership', 'navy', 'communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9e62a8c5-b952-4f44-a57a-1d59d10b2789'::UUID, 'dual-hatted', 'served in dual roles simultaneously', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9ed63efb-80ec-49a7-9421-3e44df589ee2'::UUID, 'completed SOS', 'completed company-grade officer professional school', 'usaf', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('9fd5ddda-2676-4d06-94d7-11768cc9e2c3'::UUID, 'affirmative', 'yes or confirmed', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a01ac73d-d8f8-499f-b891-a18d7b8bfcbc'::UUID, 'general court-martial', 'formal felony-level legal proceeding', 'general', 'legal', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a0ea29f3-bff7-4528-8e2b-49fa54855f71'::UUID, 'annual training requirements', 'annual compliance and certification requirements', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a1aaaeb6-81af-4bc6-84f5-5683339b7716'::UUID, 'briefed the XO', 'briefed deputy director/COO', 'navy', 'communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a230f65f-8bc0-41c8-a932-615c0997b9d5'::UUID, 'mass casualty drill', 'mass casualty emergency response exercise', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a2a31b56-bd72-4e93-93da-377bfab47599'::UUID, 'COMSEC custodian', 'communications security custodian', 'general', 'security', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a35a40b0-8587-4970-aaa5-590e2c11997d'::UUID, 'attached to', 'temporarily assigned to', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a37d9b8c-c861-4a47-bab6-59486e2f7ee5'::UUID, 'Class III supplies', 'fuel and lubricants', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a411b9f9-0eae-419b-9186-56e641d977ac'::UUID, 'held the watch', 'maintained oversight / served as duty manager', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a42552a7-8fac-471a-b955-4f9096eca86f'::UUID, 'humanitarian assistance operations', 'disaster relief and humanitarian aid operations', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a4bd74c3-3254-4712-8921-4ed35e88cad1'::UUID, 'top performer in division', 'ranked as top performer in department', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a5257a6f-af2e-4c6b-b124-f16b8ae1cd37'::UUID, '100% accountability', 'maintained complete asset accountability', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a5323270-0e70-4e8f-8127-84dfe0d67939'::UUID, 'overmanned', 'staffed above authorized level', 'general', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a54e4db0-b4ac-4673-ad66-a922a77203ed'::UUID, 'HAZMAT program', 'hazardous materials management program', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a5d703f5-c099-401c-92b1-19e87dcbd62e'::UUID, 'command sponsorship', 'employee sponsorship / relocation assistance', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a5f1fd70-ba3d-4b46-9e4a-0807ba67965a'::UUID, 'earned Ranger tab', 'completed elite small unit leadership course', 'army', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a63b5f9d-f80f-4919-86f4-efd54cab148c'::UUID, 'TM', 'technical manual or equipment documentation', 'army', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a63be0c4-09e6-4358-aede-b12f5bcf240e'::UUID, 'operations center management', 'command center management / operations hub oversight', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a6ba9a3a-da39-48c5-af1d-200cb68f11aa'::UUID, 'AFFF system', 'aqueous film-forming foam fire suppression system', 'navy', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a6cc6209-a944-4196-b39c-3374ac2216f0'::UUID, 'unmatched performance', 'top-tier performance among peers', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a6ff943a-4a65-4966-b882-9c9ce8c0f61f'::UUID, 'served as PQS coordinator', 'served as certification and qualification program manager', 'navy', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a71ad1c9-14c1-4c56-af82-607ac907607a'::UUID, 'trained the next generation', 'developed the talent pipeline', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a74d060e-8375-455f-a940-7ca03be6aeb2'::UUID, 'entrusted with', 'selected to manage', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a79fcb2b-d82b-4086-b689-8461145b9faf'::UUID, 'indications and warnings', 'early warning indicators / predictive analysis', 'general', 'intel', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a7ba5f8a-5f74-4f9d-99d7-6ba0941070f0'::UUID, 'stood up a command', 'established a new organization', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a801a47b-3d62-4772-bfec-f3c1bd7b789f'::UUID, 'processed out-processing checklist', 'completed employee offboarding checklist', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a8277378-9917-4ef0-a23a-5ef6206e03cc'::UUID, 'moved the needle', 'produced measurable improvement', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a86b33aa-c3ba-4500-be23-b8927d529f5f'::UUID, 'GQ', 'general quarters emergency readiness drill', 'navy', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a87aa72b-8577-4e26-903e-937fd6b093c3'::UUID, 'served as section chief', 'served as team supervisor for 10-20 personnel', 'usaf', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a8c6d7d8-2cbc-4fb5-abd3-54151a5851aa'::UUID, 'fleet returnee', 'experienced operational professional returning from field assignment', 'navy', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('a996153c-4bfd-4d9b-b102-73026505fd70'::UUID, 'set the tone', 'established organizational standards', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('aa91acee-d577-46e7-932b-25a3d227bac1'::UUID, 'qualified as OOD', 'certified as senior operations shift supervisor', 'navy', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('aab8de97-4686-4a5c-a2d0-c4276f3b4bb7'::UUID, 'eval/fitrep', 'annual performance review', 'navy', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('aac98e23-bc38-4749-becc-ac4f392f44ac'::UUID, 'talking points', 'prepared key messages for discussion', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('aadc0a3e-8b12-420d-96b6-478f4e187cf9'::UUID, 'completed Corporals Course', 'completed first-line supervisor course', 'usmc', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ab09882d-14dd-42ed-a566-f3fb723be4db'::UUID, 'completed Advanced Course', 'completed senior supervisor course', 'usmc', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ab6a32a0-a1ca-4013-bec1-ee76a62f583c'::UUID, 'duty roster management', 'work schedule management / shift scheduling', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ab8918ab-7571-4480-835e-5281ec956dd6'::UUID, 'trusted agent', 'key team member', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('abb18535-a9ee-4889-a31a-6e3ad290c5c2'::UUID, 'conducted ORI preparation', 'prepared organization for major readiness inspection', 'usaf', 'compliance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ac14099f-ef3d-41bb-9087-3293f059ea52'::UUID, 'fostered a culture of excellence', 'cultivated a high-performance work environment', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ac1e2df1-31d0-4007-ac4d-80fbda794a39'::UUID, 'served on promotion board', 'served on promotion selection committee', 'army', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ac39d586-67c8-4f21-85d5-f99b1b7a0b2b'::UUID, 'OPTAR', 'operating target or department budget allocation', 'navy', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ac46bfa0-4736-4de4-9faf-b95538060620'::UUID, 'check in/check out', 'in-process and out-process', 'general', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ac5ee9ac-bc35-4233-b5cb-407ecbeb5796'::UUID, 'ESWS qualified', 'earned enlisted surface warfare specialist certification', 'navy', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ac8ac3bd-e272-4b92-9e8a-704cdf980004'::UUID, 'officer record brief', 'professional profile / executive summary', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ace0f684-88d3-404d-af8b-69dd8a01fc06'::UUID, 'prime power operations', 'large-scale power generation / electrical utility management', 'general', 'engineering', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ad0c212c-4512-4539-a9bf-5a213577e2a1'::UUID, 'interagency coordination', 'cross-organizational coordination', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ad1e5bb2-198a-4cfb-8e63-46f87ac91527'::UUID, 'property book', 'organizational property accountability record', 'army', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ad7f006a-5d07-4bd9-8bce-083b66ca0482'::UUID, 'humanitarian assistance', 'disaster relief and humanitarian aid', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('adb4dfdc-7a11-4468-944e-847ac713c406'::UUID, 'assumed duties in the absence of', 'served as acting manager during absence of', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('addef67a-292f-42ee-9ad9-c4cff7dabe6b'::UUID, 'direct report to', 'direct report to', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ae68b0b0-5a3f-4e95-84c7-056169d88192'::UUID, 'on point', 'consistently accurate and reliable', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ae6ffdd7-c901-4929-b976-abc079e7d182'::UUID, 'SIQ', 'on bed rest per medical order', 'navy', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ae930685-5761-41f6-a864-05bbabc60c67'::UUID, 'conducted inventory', 'performed inventory audit', 'general', 'logistics', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('aebe3aae-d682-4fa8-9632-5ce1dc742ae9'::UUID, 'promote ahead of peers', 'recommended for early promotion over contemporaries', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('aec791e7-1310-4f63-af4c-5c056119b0e5'::UUID, 'awarded Army Achievement Medal', 'received organizational achievement award', 'army', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('af452a68-8c9d-4c28-9692-9c61667b6c0e'::UUID, 'TA approved', 'approved for employer-funded education', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('af56b53a-249a-4540-9100-7bc0ce7fdafa'::UUID, 'orders', 'assignment documentation', 'general', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('af6a56b3-8455-4e2d-ab15-b8c6e2f0a559'::UUID, 'counter-insurgency operations', 'complex security and stabilization operations', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('af995769-fd12-4a94-b180-f66cb0b7cb27'::UUID, 'instructor qualified', 'certified as professional instructor', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('afac520e-37d0-4728-81fb-b7fb0828bc46'::UUID, 'say again', 'please repeat for clarification', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('afd11895-7a6f-4edf-8dec-e89fd67f337a'::UUID, 'classified material handling', 'sensitive document management / confidential records handling', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('afe42965-65c3-4448-b35d-ad823820ba6b'::UUID, 'by the numbers', 'following standard procedures step by step', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b0157e07-cce9-4875-9e5a-22da65e242b0'::UUID, 'back on track', 'restored to standard performance', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b081a01d-ff78-46b2-9500-8e1e607bc24d'::UUID, 'operations order', 'detailed project execution plan', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b084c461-6924-48c3-ab2a-82a61fa55bef'::UUID, 'high speed low drag', 'efficient and effective', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b08b3eac-54ae-4e7d-9629-2fcf8fe39d6c'::UUID, 'profile', 'medical work restriction documentation', 'army', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b08ecf74-0f6f-4b7d-9c79-153fe7800864'::UUID, 'go-to person', 'subject matter expert and reliable contributor', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b0bfe16a-23fc-48c4-aac2-f758a406310a'::UUID, 'fully mission qualified', 'fully certified for all operational duties', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b0d7a525-b421-4bd3-89d5-6f9c188f15e7'::UUID, 'flight operations', 'aircraft operations / flight scheduling and execution', 'general', 'aviation', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b0ed10a4-b7ec-4df2-99a7-678db1bf6dd3'::UUID, 'communications security', 'information security / encrypted communications management', 'general', 'comms', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b11179d5-1561-4d90-b431-54b903bb0819'::UUID, 'authority to operate', 'security authorization / system accreditation', 'general', 'cyber', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b12812d9-5f2c-4153-879f-9879be28d3b9'::UUID, 'decisive operations', 'primary effort / main objective operations', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b14a97d4-eaec-49a4-b5db-4e091d29228a'::UUID, 'span of control', 'number of direct reports / management scope', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b182dbd5-66bf-49eb-9326-7d9170b70484'::UUID, 'Class VIII supplies', 'medical supplies and equipment', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b19b2a88-9065-42fe-b242-82dc82967568'::UUID, 'hoseman', 'fire suppression support operator', 'navy', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b1b8211f-8949-4633-b67a-98e6b0805bfa'::UUID, 'counseling chit', 'performance counseling documentation', 'navy', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b249447a-b941-4166-9ed4-20fafad89bab'::UUID, 'guidance from above', 'direction from senior management', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b2f64f97-9375-44e8-8249-3d5d51ec160d'::UUID, 'electrical safety program', 'electrical hazard prevention program', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b2fc93d9-4110-41d1-8f41-c44baae8d16e'::UUID, 'served as NCOIC', 'served as senior noncommissioned supervisor', 'army', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b3016051-e900-4a68-ac3d-e9bda96899c2'::UUID, 'PHA', 'periodic health assessment', 'general', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b3110289-7a9b-4ecd-b417-ccaba946b499'::UUID, 'served as command sergeant major', 'served as senior enlisted executive advisor', 'army', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b3aa0eb8-3dd1-431d-9dab-d647d55d0413'::UUID, 'maintained good order and discipline', 'maintained workplace standards and professional conduct', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b3b5c81d-8ee9-400a-bdfc-f4ef0722bbc2'::UUID, 'dental readiness', 'dental health compliance status', 'general', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b470e9dc-3cb7-4ec9-a6ec-ea16254b8363'::UUID, 'served as LPO', 'served as front-line team lead', 'navy', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b4a88385-cc2c-43b5-9a7f-8767ab27fe02'::UUID, 'served as division officer', 'served as department manager', 'navy', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b4e5639a-5948-4347-94b1-a2d122e4d852'::UUID, 'supported real-world operations', 'supported live operational missions', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b527d270-ef7e-4e35-8119-2b9604e7d8b6'::UUID, 'spot checks', 'quality assurance inspections', 'general', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b52b7991-e702-4607-99d1-cda7e507f65f'::UUID, 'maintained TS/SCI clearance', 'holds active Top Secret/SCI security clearance', 'general', 'security', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b53e9695-6406-4212-a3df-bc9f8998491d'::UUID, 'decisive leadership', 'confident and timely decision-making', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b55e5079-37ba-49a9-843e-0fb032ac25f3'::UUID, 'no safety violations', 'zero OSHA/safety violations', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b5b331ba-d99b-4632-aaaf-6d0763738cb4'::UUID, 'led from the front', 'led by example', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b5dbe066-3aeb-4125-a3be-b61417ed79fa'::UUID, 'responsible for the welfare of', 'accountable for the well-being of', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b615cfbb-c70e-42cd-9951-a0d1608ae6f5'::UUID, 'REDCON level', 'readiness condition level', 'army', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b65fdf3f-675f-4e39-91b2-2ff6840367ce'::UUID, 'lesson plan author', 'authored instructional materials and course content', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b715212d-4b00-447b-ba7b-33e59f4b4b6f'::UUID, 'curriculum developer', 'designed and developed training materials', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b726eb64-4423-4f3b-ac5c-64d6d36677f3'::UUID, 'number one of all peers', 'top-ranked employee among all peers', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b737990b-6f59-4b73-93b9-d52f98d04c82'::UUID, 'change of command', 'leadership transition / management changeover', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b76a4a18-47d3-421b-a978-e44a6d502c19'::UUID, 'PQS qualified in', 'professionally qualified and certified in', 'navy', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b7b8335f-68da-46f9-801c-a2c49da435d8'::UUID, 'PACOM AOR', 'Pacific region of operations', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b81460f8-5ff6-4d0c-a5a0-1aa44147ae88'::UUID, 'passed inspection', 'achieved full compliance during audit', 'general', 'compliance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b8434217-e56d-4059-9049-b7c11288ff86'::UUID, 'cyber hygiene', 'cybersecurity best practices / security awareness', 'general', 'cyber', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b85934bc-8438-480b-ac2d-9adc9c0901df'::UUID, 'served in combat zone', 'served in high-risk operational environment', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b866806f-acdd-4a3b-add8-5e608dd270c8'::UUID, 'DRMO turn-in', 'coordinated surplus property disposal', 'general', 'logistics', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b91eb6c4-6460-42fa-a1b7-a445e9617769'::UUID, 'administrative separation', 'involuntary termination / administrative discharge', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b9573071-25bd-46ef-a01d-d54d1b64a3d2'::UUID, 'earned air warfare designation', 'earned aviation operations warfare qualification', 'navy', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b9693b4d-f9f5-4285-8f17-b7a6d282eeeb'::UUID, 'spot check', 'unannounced compliance inspection', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b969bbba-07cc-49ee-8c92-df6312174372'::UUID, 'served on command triad', 'served on executive leadership team', 'navy', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b9c0438f-fa53-4e28-9486-2f8babbd651e'::UUID, 'served as squad leader', 'served as team supervisor for 9-13 personnel', 'army', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b9eb5379-52e3-4c1c-a198-8e775ef39825'::UUID, 'task organized', 'restructured teams for specific objectives', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b9f624a0-2ed3-4b44-9cf5-604778a14756'::UUID, 'pass the word', 'disseminate information', 'navy', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('b9f83e67-dbfc-4c3c-b473-7d47ae2667ea'::UUID, 'tireless work ethic', 'consistently high-performing', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ba4f1414-e0b2-4d51-82e7-493ae72fab6e'::UUID, 'IDP on file', 'individual development plan documented', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ba708063-c376-4663-bc00-4466b6199adf'::UUID, 'deckplate leader', 'hands-on frontline leader', 'navy', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ba759439-c7f3-4968-b324-47a987e26a34'::UUID, 'unity of effort', 'coordinated teamwork / aligned objectives', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bac1dd1f-56f9-4ea9-8efe-6e411c93ee5c'::UUID, 'completed maintenance checks', 'completed preventive maintenance inspections', 'general', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bae671e4-b85b-4a19-a91d-bcb288bae24e'::UUID, 'pinned Chief', 'promoted to senior management level', 'navy', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bb55499c-bfce-4cdc-8b38-8b28eaa712cb'::UUID, 'briefed general officers', 'presented to C-suite executives', 'army', 'communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bbae6811-d3d8-487c-b0a5-9bf0dc313b2d'::UUID, 'muster', 'accountability formation or roll call', 'navy', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bbc603e2-5556-4289-b653-31ffb219105d'::UUID, 'medical evacuation operations', 'emergency patient transport / air ambulance operations', 'general', 'medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bc488654-5161-49e6-9e56-ff14e0205b5e'::UUID, 'stood up the JOC', 'established the joint operations center', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bc50f505-490b-4381-b167-2bdff478e225'::UUID, 'stood EOOW watches', 'supervised 24/7 engineering plant operations as shift supervisor', 'navy', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bc58bfc3-a2b8-4f7c-9b0a-2473f355deae'::UUID, 'built unit cohesion', 'strengthened team collaboration and morale', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bc5cd7e2-e78f-498d-ad9f-c9b836360a42'::UUID, 'non-judicial punishment', 'administrative disciplinary action', 'general', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bc6b6029-87e2-4a87-9d42-ca735cf1e2fe'::UUID, 'all-hands call', 'organization-wide town hall meeting', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bca61121-ee2d-458b-86d6-3959bc065fb9'::UUID, 'served as senior enlisted advisor', 'served as senior workforce advisor', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bca9645f-dc9b-473f-84ab-dcc3910ab50e'::UUID, 'developed lesson plans', 'created training curriculum / designed course materials', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bccb5ba3-1ae5-4d7d-9759-a75721d0668f'::UUID, 'served as superintendent', 'served as senior operations superintendent', 'usaf', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bd0d1cce-3f49-4d89-9a97-03921fb9e091'::UUID, 'served as scene leader', 'served as on-scene incident commander', 'navy', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bd667810-a0c3-436e-9644-d83d8dd0cc68'::UUID, 'produced intelligence estimates', 'produced analytical forecasts / risk assessments', 'general', 'intel', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bd96b9cc-3ec2-4e2d-b215-276ef901aa0d'::UUID, 'command ombudsman', 'employee liaison and family support coordinator', 'navy', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bdb3c41e-dec2-493c-bd07-ce3f0102c45c'::UUID, 'no discrepancies noted', 'clean audit results with no findings', 'general', 'compliance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bdc8963d-ce6f-4645-86c4-c4a22c74a227'::UUID, 'surface warfare qualified', 'earned surface operations professional certification', 'navy', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bdeebe5e-041e-4de9-99c7-2c0eda687aff'::UUID, 'budget execution', 'budget management and expenditure tracking', 'general', 'financial', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('be01492c-66e9-4484-8981-b4b9f464b622'::UUID, 'maintained satellite communications', 'managed satellite-based communications systems', 'general', 'comms', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('be0f8e5f-a663-4a70-bc8d-28a742d4aec9'::UUID, 'signed off', 'certified and approved', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('be435a58-c8d8-4734-b497-82b45896d867'::UUID, 'FMC', 'fully mission capable or fully operational', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('be674784-7dea-4fca-8157-186ae6359d24'::UUID, 'served as at-sea fire party member', 'served as emergency fire response team member', 'navy', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bebadee6-4366-4824-b045-109bd0339756'::UUID, 'Class IX supplies', 'repair parts and components', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bef2d981-65d9-4d36-88a8-ea924f507ae1'::UUID, 'signed PQS for', 'certified personnel qualification completion for', 'navy', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bf411a5a-3ab2-45d2-a572-2b23f75da4af'::UUID, 'cross-trained', 'trained across multiple disciplines', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bf48b3e0-97ee-4e84-927e-dc68eeb51874'::UUID, 'fit for duty', 'cleared for full work duties', 'general', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bf530b86-4e58-403d-aeec-ef2a4c6e6f13'::UUID, 'submitted SITREP', 'submitted status report to leadership', 'general', 'communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bf7c124d-0351-4c8f-9274-54e56f4d2309'::UUID, 'command and control', 'management oversight and coordination', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bf7c41d8-5e65-4c0b-91eb-3c233ae13e86'::UUID, 'explosive safety', 'explosive and ordnance safety protocols', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bfb66192-7a01-4aab-9443-82ca1e2f7e70'::UUID, 'hand receipt', 'signed equipment custody document', 'army', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bfee34fa-3050-49a9-b1bc-d970234ccc90'::UUID, 'established battle rhythm', 'established recurring operational cadence', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('bff10c62-137a-475c-adfd-93ec313d4caa'::UUID, 'read ahead', 'pre-meeting briefing materials', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c005828d-74dc-4e74-a79b-ea1f9c2de474'::UUID, 'confined space entry', 'confined space entry safety procedure', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c00ab730-6eb8-4f87-9830-6a7e66303fcf'::UUID, 'triage operations', 'emergency patient prioritization / triage management', 'general', 'medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c019ead3-91a8-4439-9983-ed92a962d942'::UUID, 'zero deficiencies', 'zero audit findings/deficiencies', 'general', 'compliance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c0331814-7a51-4bbe-a15c-ac61b7cd6c04'::UUID, 'service record', 'official personnel file', 'general', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c07493f3-94cb-459a-b282-f9251260e507'::UUID, 'mishap free', 'zero workplace incidents', 'general', 'safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c0927c20-e47d-4d92-8856-e2afc67e1bc2'::UUID, 'SITREP', 'situation report or status update', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c0acf749-71e0-4916-a281-cd53f798ddae'::UUID, 'mission debrief', 'after-action review meeting', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c0b7866b-76a1-4882-89e7-d1d2c7bb969b'::UUID, 'exceeds standards', 'consistently surpasses performance benchmarks', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c0c2f247-c819-4597-8955-e547de552f37'::UUID, 'left seat right seat ride', 'supervised transition period with predecessor', 'army', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c20c83b8-3f53-4be9-b0fd-d94406af9da7'::UUID, 'ran a tight ship', 'maintained high operational standards', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c235ec0b-fe2c-4ef1-b4e8-3eb18db9964a'::UUID, 'served as CPO mess president', 'served as senior management council president', 'navy', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c23f703f-6561-4e36-9a08-cecfcb09d070'::UUID, 'equipment serviceability rate', 'equipment availability / asset uptime rate', 'general', 'logistics', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c2ab0a62-55da-46f2-aab8-0254339e6046'::UUID, 'maintained AF Form 623', 'maintained individual training records', 'usaf', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c331e70f-f696-4b4d-aef9-c47516f20409'::UUID, 'vulnerability assessment', 'security vulnerability assessment / penetration testing', 'general', 'cyber', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c3346231-bef9-4cdd-b91f-309405a7a3b7'::UUID, 'theater of operations', 'operational region / area of business operations', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c36e0106-3348-4f9f-9c4c-2f4edd47d18a'::UUID, 'preflight inspection', 'pre-operation safety inspection / equipment check', 'general', 'aviation', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c3801234-5c3c-48ee-91ad-000c5a571446'::UUID, 'mission planning', 'project planning and preparation', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c38578fa-4be6-478e-a578-6eaea4993bfa'::UUID, 'a consummate professional', 'a consummate professional', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c3898ed5-c85c-4e3d-8e6e-a84269d22e95'::UUID, 'selected as Blue Jacket of the Year', 'selected as top entry-level employee of the year', 'navy', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c45695c6-a8a3-4b5c-9f9e-ef7319193b10'::UUID, 'must promote', 'highest recommendation for immediate promotion', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c519fe48-1581-4cba-8f89-1522feb1e1d0'::UUID, 'copy', 'message received and understood', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c52468ac-fb7d-46f1-a101-ac2355e7977a'::UUID, 'PPE compliance', 'personal protective equipment compliance', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c536c039-151d-4842-8a01-126b63892258'::UUID, 'FLIPL', 'financial liability investigation for lost property', 'army', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c54a9e6e-195b-4e40-98e0-06deca2c5494'::UUID, 'fiscal year planning', 'annual budget planning / fiscal year forecasting', 'general', 'financial', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c55de95c-caa8-4965-b9ed-038931f4ddc0'::UUID, 'delivered results under pressure', 'produced outcomes in demanding conditions', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c57f2891-0474-462c-954a-a2a22babe84a'::UUID, 'conducted ship-to-shore movement', 'coordinated complex personnel and equipment transfer operations', 'usmc', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c5844f81-a305-4a16-81c0-fe34b4801487'::UUID, 'earned Enlisted Surface Warfare Specialist', 'earned advanced surface operations qualification', 'navy', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c59d4ac8-0ceb-425d-b191-27f2c7feb760'::UUID, 'forward deployed', 'assigned to remote operations', 'navy', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c5bd74b0-86ac-4a3a-b0ca-2b662f679957'::UUID, 'special request chit', 'formal request form', 'navy', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c5e59d46-5067-4110-a6a3-fce57c981f7f'::UUID, 'anti-piracy operations', 'maritime law enforcement operations', 'navy', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c67a573e-28c1-4c1d-9c70-1f9408082d24'::UUID, 'served as acting commander', 'served as interim director / acting manager', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c6dab09b-6b3f-4f0c-8fc3-c1d8d06d61ee'::UUID, 'stand by', 'please wait for further information', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c71685f3-cbf7-4e52-a332-ef28ee15cee0'::UUID, 'ahead of schedule', 'completed ahead of schedule', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c73f0c3a-d4e9-48cb-9ea4-1a7629c896ae'::UUID, 'COMSEC material', 'encrypted communications material', 'general', 'security', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c7d3759e-e109-49b4-8dcb-7c86433d26d6'::UUID, 'imagery intelligence', 'satellite and aerial imagery analysis', 'general', 'intel', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c7e98571-42b7-4a15-9b1a-92daf1666bb0'::UUID, 'brought online', 'successfully launched', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c7ee3baf-0bf5-4c66-9421-dff214fd715f'::UUID, 'served as CMEO', 'served as equal opportunity program manager', 'navy', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c7facc79-7370-41a0-9949-9eed8783da74'::UUID, 'FPCON', 'security alert level', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c8d42258-148e-4a81-9dd7-ae94682b2b87'::UUID, 'steady state', 'normal operations', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c8fb5124-4a6a-4e48-b71e-c7bff57721b3'::UUID, 'SNCO academy graduate', 'completed senior leadership development program', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c99a4ed4-fa30-42c6-a0dc-247b84f12eb0'::UUID, 'hazard identification', 'workplace hazard identification', 'general', 'safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('c9e5c143-f505-44aa-911f-4eeadfa77441'::UUID, '#1 of all E-7s', 'ranked #1 among all senior managers', 'navy', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ca3b22d3-e4da-452e-90a0-9bc6b053c79c'::UUID, 'up and running', 'fully operational', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ca3b296f-977a-41c5-b5b4-5dfe0575c9b0'::UUID, 'contingency operations', 'emergency response operations / crisis management', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('caa5ece9-ed08-4827-aa34-89141766af67'::UUID, 'served as PME instructor', 'served as professional development instructor', 'usmc', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('caeef8a6-b2f9-4dec-8dcb-e80fc21b988a'::UUID, 'earned Expert Infantry Badge', 'earned advanced infantry proficiency certification', 'army', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('cb2e2d2d-9ee7-469d-8ac8-09d320deb35f'::UUID, 'up the chain', 'escalated to higher management', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('cb979fce-8ca9-41e0-b004-503e80214dde'::UUID, 'indoc', 'new employee orientation program', 'general', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('cb97e0a1-2ffd-4df1-80ac-40203284511c'::UUID, 'raised the bar', 'set new performance standards', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('cbd1855c-0b16-425b-b20d-00a5fcf51c35'::UUID, 'patrol base operations', 'forward operating base activities / remote site operations', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('cbe583d1-44a5-4a91-8d77-165a1b95f654'::UUID, 'held feet to the fire', 'enforced accountability for deliverables', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('cc18b55e-0815-4269-8a3d-be42ace26cce'::UUID, 'enforced standards', 'enforced organizational standards and policies', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('cc3dfb81-2ecf-4c03-b11a-6e0a67d5c5c4'::UUID, 'stability operations', 'stabilization and support activities', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ccab1938-477f-4fdf-9395-7be388171e93'::UUID, 'class B mishap', 'severity level 2 incident with significant damage', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ccf9bef9-279d-4923-95f3-864196663fdc'::UUID, 'threat assessment', 'risk assessment / threat analysis', 'general', 'intel', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ccfa6585-af1c-4a13-8956-bba067d440a9'::UUID, 'counter-terrorism operations', 'counter-terrorism and force protection operations', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('cd8d84e3-d347-45d3-94e0-7faa1d835794'::UUID, 'THA', 'tool hazard analysis', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('cd8eda69-a3c9-4f9b-a664-bf5a8b4b02ac'::UUID, 'depot-level maintenance', 'factory-level overhaul / major equipment repair', 'general', 'logistics', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ce5d8871-4d20-477e-9044-6472a0744af3'::UUID, 'organizational-level maintenance', 'routine maintenance performed by operating unit', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ce83c1cb-3e23-45e7-a1dd-60c46b0f8776'::UUID, 'earned Airman of the Quarter', 'selected as employee of the quarter', 'usaf', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ce86c277-55fd-4b68-81f6-fa19f3a03975'::UUID, 'tag out', 'lockout/tagout safety procedure', 'navy', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('cef8b9a7-1b20-46fe-a138-54eda13dbfa5'::UUID, 'knocked it out of the park', 'far exceeded expectations', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('cefb4aa6-d445-402c-9615-f1e87dba6244'::UUID, 'noncombatant evacuation', 'civilian evacuation operations', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('cf4c1119-b27b-490b-8aae-4a5550537b52'::UUID, 'served as battalion sergeant major', 'served as senior enlisted executive advisor for 800+ personnel', 'usmc', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('cf6c26d1-d200-45bd-9895-65cae93025c1'::UUID, 'principal advisor to the commander', 'chief advisor to the executive director', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('cfc0934e-8296-48b9-abb4-9988ae8491ce'::UUID, 'human intelligence', 'human source information gathering / interview-based research', 'general', 'intel', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('cfd52aa7-44a1-4e22-93da-6261b539e423'::UUID, 'combat stress control', 'crisis counseling / behavioral health support', 'general', 'medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('cfeaa8b6-31d8-484c-b527-ae4eaa9f0c4a'::UUID, 'marine of the quarter', 'employee of the quarter', 'usmc', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('cff7f3fd-ef1f-4c5a-8af3-8b6be8d2de28'::UUID, 'established communications architecture', 'designed and deployed network infrastructure', 'general', 'comms', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('cff9f929-7589-4709-884d-8119fdfa9ac0'::UUID, 'supply discipline', 'inventory control / asset accountability', 'general', 'logistics', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d02fd227-b31a-47ad-b305-84f75e6b1a6e'::UUID, 'fund execution rate', 'budget utilization rate / spend rate', 'general', 'financial', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d036c7a0-d350-44c6-8faa-bb04411d402f'::UUID, 'conducted AAR', 'led post-project lessons learned review', 'general', 'communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d1134ef0-37ad-48f7-93b4-5b3cc05229e0'::UUID, 'stood watch', 'supervised operational shift', 'navy', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d130f0eb-d275-4478-a3b9-0f08f59f6521'::UUID, 'passed LOE', 'passed engineering systems readiness examination', 'navy', 'compliance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d130fd49-fdc7-4190-ad73-059fd2b5c1e6'::UUID, 'served as CO', 'served as commanding officer/chief executive', 'navy', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d1bccfbd-2326-4e74-a18c-1273a3504681'::UUID, 'CPO Mess', 'Senior Leadership Team', 'navy', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d1bd09f4-3396-403d-8940-0256bb61b3b8'::UUID, 'FMF qualified', 'earned Fleet Marine Force qualification', 'navy', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d1fdc67f-aea8-49b6-84c1-11b98bb3e5c9'::UUID, 'conducted training', 'developed and delivered training', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d20a14e1-0a19-4ca4-babf-33400794eb11'::UUID, 'in-processing procedures', 'employee onboarding procedures', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d267d2a7-09d3-497f-94ed-ffdd4f74ac33'::UUID, 'roger that', 'understood and acknowledged', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d29ead68-ffb9-4198-a890-a6d36845fcbf'::UUID, '100% mission completion', 'achieved a 100% task completion rate', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d2b2a1e3-9051-4ed5-a78d-3e22d033b244'::UUID, 'material inspection', 'equipment condition assessment', 'navy', 'compliance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d2bd31d8-c01e-4bfd-905d-690a90c102a5'::UUID, 'fall protection', 'fall prevention and safety system', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d360975b-5cab-4239-bfc4-c0d6f7b0a098'::UUID, 'set the standard', 'established the performance benchmark', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d381d5b8-1f75-4739-8eba-d175a0ff2f70'::UUID, 'huddle up', 'quick team meeting', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d426f0da-4267-4c2e-b606-b1d229ef3d63'::UUID, 'CBRN drill', 'chemical, biological, radiological, nuclear response drill', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d44fe8d8-6f9c-46ae-b284-dd5079d1a461'::UUID, 'from the ground up', 'from initial concept to completion', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d4aefd91-5e5d-4202-8707-9bbecc231506'::UUID, 'career counselor', 'employee career advisor', 'general', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d4c544f6-8611-409f-9521-b62074a0aacd'::UUID, 'selected as Sailor of the Quarter', 'selected as employee of the quarter', 'navy', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d4dd70d3-6ec1-4820-ab80-c5d9ee255648'::UUID, 'served as platoon sergeant', 'served as senior operations supervisor for 40+ personnel', 'usmc', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d51b90b8-75ba-424a-8609-854b0a403929'::UUID, 'maximum effort', 'full commitment to achieving results', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d52776d5-0bb3-4e51-9104-d0910141fdd8'::UUID, 'firemain system', 'facility fire water distribution system', 'navy', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d55e9d7d-7f23-41d1-b13f-95299b7145c1'::UUID, 'urinalysis coordinator', 'workplace drug testing program coordinator', 'general', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d58e7533-5f24-4ad5-bd99-a29acb29f131'::UUID, 'qualified in rate', 'earned professional certification in specialty', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d5b708f3-0a83-4720-a735-ef7bc49bdc2f'::UUID, 'unfunded requirement', 'budget shortfall for required item', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d5bbd96a-c759-4222-a115-b2aca7f56b49'::UUID, 'earned the trust and confidence of', 'earned the full confidence of senior leadership', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d60171a8-4adf-48b0-9f85-d2b827c519f9'::UUID, 'flag it', 'highlight for leadership attention', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d65b5d84-3b7a-439c-bb91-c5f6541cd2ba'::UUID, 'received Defense Meritorious Service Medal', 'received defense-level executive achievement award', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d69e7b63-7ea4-4468-ab24-33a81455e10f'::UUID, 'master training specialist', 'certified master instructor / lead training facilitator', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d6c9646b-a8a1-4ab4-8350-eaa0d7b7f39c'::UUID, 'tech school graduate', 'completed technical skills training', 'usaf', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d72d253c-9d6b-49a3-9583-26616ecc2381'::UUID, 'directed multi-echelon operations', 'managed multi-level organizational operations', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d79d5687-1a4c-4369-9523-60dcf5e21ea3'::UUID, 'accountability report', 'personnel status and location report', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d7c38e79-9dfd-4aaf-a87c-a7bbdcb1b4fd'::UUID, 'backbone of the unit', 'essential to organizational success', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d7f1f34a-3941-4f35-8ff5-add094159cc0'::UUID, 'be advised', 'please note the following information', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d810fa6f-2cf7-42d2-bc42-86c3ffdcb304'::UUID, 'completed advanced training', 'completed advanced professional development', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d81a4ff9-b0f4-4225-b4ae-f2dfb2205f1b'::UUID, 'exceeded readiness goals', 'surpassed operational preparedness targets', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d823a473-683b-4033-b622-f514b4c15a56'::UUID, 'manning document', 'staffing authorization document', 'general', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d86bfe42-79c8-4698-9bb3-6cb362d64da9'::UUID, 'light duty', 'modified work assignment due to medical restriction', 'general', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d900d998-ebff-4875-abd8-e9c5598fb0e7'::UUID, 'built the team from scratch', 'recruited and developed a new team', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d918b397-fdb2-427a-a535-42320c8c714b'::UUID, 'boots on the ground', 'deployed personnel', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d98b004d-af8c-4bad-b7a6-715eca7e1b69'::UUID, 'charted the course', 'developed the strategic direction', 'navy', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d9c3b9fb-5d79-4e46-ad16-972ab7a91c68'::UUID, 'medical supply management', 'pharmaceutical and medical supply chain management', 'general', 'medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('d9e8461d-a2b2-48da-89d9-2245c813c63a'::UUID, 'served as platoon sergeant', 'served as senior operations supervisor for 30-50 personnel', 'army', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('da00ea0c-02bd-45f6-bc4e-e9ad40657d99'::UUID, 'served as platoon leader', 'served as operations team lead', 'army', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('da1b3fda-5696-4dba-b718-be228828aa00'::UUID, 'coordinated with adjacent units', 'coordinated with peer departments / partner teams', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('da3da158-e18d-48a1-935c-075ba8264573'::UUID, 'network security monitoring', 'security operations center monitoring / SIEM management', 'general', 'cyber', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('dacb7c9e-50bd-4960-b2b9-379b363deb05'::UUID, 'undermanned', 'staffed below authorized level', 'general', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('dad47c4d-9ad3-4a0f-956b-50f35a8900dd'::UUID, 'GMT complete', 'completed mandatory annual compliance training', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('db72aed1-a39a-4f8c-acc9-fd470c15b6fb'::UUID, 'superior mission accomplishment', 'exceptional project delivery / outstanding results', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('db8124ed-0847-4410-a280-f740dc05a37f'::UUID, 'non-judicial punishment', 'formal disciplinary action', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('dbf5b89b-8d87-46cd-9deb-f8bb3b396b60'::UUID, 'brief up', 'present to leadership', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('dbfcf60c-92bf-4d69-ab68-9a196e7b98d6'::UUID, 'breaking in', 'onboarding and training', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('dc00061a-45c5-43dd-85d0-675c5eeae6f0'::UUID, 'battle damage assessment', 'impact and damage evaluation', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('dc0ec8d1-bb89-4901-a33d-bf3642aab45c'::UUID, 'performed with distinction', 'delivered exceptional results / excelled', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('dc254890-65e3-4916-8540-60c91d90324c'::UUID, 'completed Career Course', 'completed mid-level supervisor course', 'usmc', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('dc494506-4420-46fa-964e-d7738b7247fa'::UUID, 'drove results', 'consistently delivered measurable outcomes', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('dc4c7af3-f2e8-442d-9292-d552ffaac4bc'::UUID, 'unity of command', 'clear reporting structure / single point of authority', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('dcad7f50-8243-4d9a-bdc3-b3a4dabb60e6'::UUID, 'meritorious promotion', 'performance-based early promotion', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('dcb66270-e208-4c96-8320-406bab98923a'::UUID, 'received Letter of Appreciation', 'received formal written appreciation from leadership', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('dcdf76e7-f308-46ed-9859-9c32762ef1bf'::UUID, 'survivability positions', 'reinforced protective structures / hardened facilities', 'general', 'engineering', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('dce43b2f-0d93-407e-aad3-fc156d9b7b38'::UUID, 'aircraft weight and balance', 'load planning / weight distribution management', 'general', 'aviation', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('dd7a8138-1545-4f06-8972-33e12c912ce6'::UUID, 'coordinated with higher headquarters', 'coordinated with corporate headquarters / senior leadership', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ddbdf66c-afcd-4be3-87b0-b560cc17ad51'::UUID, 'distinguished graduate', 'graduated with honors', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('dde0e6bd-ec8d-4a9a-a777-600b5d42280b'::UUID, 'earned Airborne qualification', 'completed airborne operations certification', 'army', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('dde7450e-f0ef-47b5-864e-a0d9e4f58ba8'::UUID, 'served as fire team leader', 'served as small team lead', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('de0faf86-2583-4cf3-bf72-d689ecbad342'::UUID, 'man overboard drill', 'personnel rescue emergency drill', 'navy', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('de1761e1-93c8-4728-9f62-4c7835b94c38'::UUID, 'in theater', 'on-site at operational location', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('de5cf6f4-43aa-42ee-9a30-7a6499f5c51e'::UUID, 'humanitarian assistance', 'humanitarian and disaster relief operations', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('de88d617-5169-434e-9572-58b1ef355c12'::UUID, 'unprecedented results', 'achieved historic performance milestones', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('df39c2b1-808b-4c55-8056-aee7639ba563'::UUID, 'staff meeting', 'leadership coordination meeting', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('df6bda76-5952-4adf-9d88-9acceeb10663'::UUID, 'net call', 'conference call or group communication', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('df70cde1-01dc-4251-8cfe-5c342cfe29ff'::UUID, 'rear detachment', 'home station support team', 'army', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('df846211-c6fb-45f7-b39d-67f115fa8e43'::UUID, 'safety observer', 'safety monitor', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e0151f11-accd-4bb6-994a-b4addd5d6a5a'::UUID, 'network operations center', 'IT operations center / network management hub', 'general', 'comms', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e072f500-e83d-446c-8571-14c2e84bf4e1'::UUID, 'personnel readiness', 'workforce readiness / staffing preparedness', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e078bf2b-b30f-4ec6-b07c-d8e3ab0de27e'::UUID, 'PCS to', 'transferred/relocated to', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e08b891c-362c-4afa-b269-da2eb1cfb028'::UUID, 'MOS qualified', 'certified in occupational specialty', 'army', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e0aeb601-db31-43a8-b585-a9e6219e914a'::UUID, 'IA deployment', 'individual deployment/temporary assignment', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e0b8092a-cb7c-49de-8942-bcb96cfffc05'::UUID, 'sustained superior performance', 'maintained outstanding results over an extended period', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e0fcd31a-bab1-4421-8218-54d48852ba27'::UUID, 'zero lost time', 'zero lost-time incidents', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e10e6406-a45d-4464-8295-02034b3be98a'::UUID, 'sharpened the focus', 'refined team priorities and direction', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e15f03c8-95ea-4076-b6fc-8ffdcefe2ba3'::UUID, 'military justice', 'workplace disciplinary process / legal proceedings', 'general', 'legal', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e18ff86b-4391-495d-9de6-3db2d82a47c8'::UUID, 'corrective maintenance', 'corrective/reactive maintenance repair', 'general', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e1a8b752-06c8-41fd-bf07-20238ed497db'::UUID, 'reset operations', 'equipment refurbishment and reconditioning', 'general', 'logistics', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e1af639a-58a5-4df9-acb8-1647c5ab7b8c'::UUID, 'at the deckplate level', 'at the operational/front-line level', 'navy', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e2156189-4489-431a-a8fc-58bc6bb983af'::UUID, 'combat effective', 'fully operational and productive', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e2266dec-d6b4-4059-ace8-b6f61bfd7052'::UUID, 'operational command', 'executive oversight / operational authority', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e2861af5-e3e2-4610-a9c4-b233b2588b2d'::UUID, 'evening brief', 'end-of-day status meeting', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e2f12228-2b49-4457-9c3a-eb0464996525'::UUID, 'Class I supplies', 'food and subsistence items', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e36c3759-a039-4778-afb1-0374591fe30f'::UUID, 'after-action report', 'post-project lessons learned report', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e3a102a2-7fb8-4273-9cdf-eb59f36d0837'::UUID, 'relieved the watch', 'completed shift turnover', 'navy', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e3f3151e-0e27-4f8c-8c24-264cf04e20e8'::UUID, 'mission-ready status', 'fully operational and prepared', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e409b426-85f9-429f-95de-d748ffd4eefd'::UUID, 'took charge of', 'assumed leadership of', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e45751e1-3f89-4cda-b84a-c036aedf7c44'::UUID, 'managed a fighting force', 'managed a high-performance team', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e4a435c9-d908-4884-854c-baca82683c31'::UUID, 'safety observer', 'safety compliance monitor', 'general', 'safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e4ae7525-5aa1-420a-9d56-0c5abe651ede'::UUID, 'PQS qualified', 'completed qualification program', 'navy', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e568421f-70e5-4711-a91b-28cf3a5f766b'::UUID, 'watch station qualified', 'certified to operate independently at assigned station', 'navy', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e57917bc-77fc-473d-97e2-7515c4350100'::UUID, 'qualified in rate', 'demonstrated competency in assigned specialty', 'navy', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e58c4bc9-fc56-4899-add2-0e7854e4a8db'::UUID, 'must promote', 'strongly recommended for immediate promotion', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e5a5a808-06cd-4b8b-97f1-8f64225a9dbe'::UUID, 'bottom line up front', 'lead with the key conclusion', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e5d01dc9-87c2-4210-8a50-fbc18c92e0df'::UUID, 'billet', 'authorized position', 'navy', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e5d8b577-3ec7-4aed-a506-a44fe074e1b2'::UUID, 'correspondence management', 'business correspondence / official communications management', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e5e76fce-fb76-4045-bdb3-15a4ccb4942c'::UUID, 'strength management', 'headcount management / workforce planning', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e63c406b-f8a2-4013-8195-1db0d93278b7'::UUID, 'downrange', 'at forward operating location', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e69e468b-9991-4129-8203-6509e12dfbb2'::UUID, 'honor graduate', 'top-ranked graduate', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e730deb6-da35-4e3f-87bc-683ebd2fc765'::UUID, 'organizational-level maintenance', 'unit-level equipment servicing / routine maintenance', 'general', 'logistics', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e7700fc1-f5ed-400b-8968-8fb7afa4ab05'::UUID, 'TOC operations', 'tactical operations center management', 'army', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e77347f8-130b-4c70-b1e6-a55f60afc7de'::UUID, 'information operations', 'strategic communications / information management', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e9566930-3faa-4a1c-9813-fe693d1d16d3'::UUID, 'received Meritorious Unit Commendation', 'received organizational merit award', 'general', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('e9c6c627-a31f-45de-bdf6-437bed2152f0'::UUID, 'redeployment', 'return from operational deployment', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ea2c68df-835e-4c6c-9f0e-f8a67efe9ee2'::UUID, 'battlespace', 'operational environment / competitive landscape', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('eac03860-525b-4af6-bc0f-4c21a54a3ec3'::UUID, 'collective training event', 'team-based training exercise / group workshop', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('eae80640-6cba-4cff-804b-eeeebac1530b'::UUID, 'head count', 'personnel accountability check', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('eb093388-576f-4c13-adc2-e827a2d99bb5'::UUID, 'served as DCTT member', 'served as safety training team member', 'navy', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('eb653315-6e7d-4638-bdcf-9acf02668fe5'::UUID, 'cyber incident response', 'security incident response / breach containment', 'general', 'cyber', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('eb6ae8b4-8026-4ea6-bbc6-460b8d1ca216'::UUID, 'hand-picked by the CO', 'personally selected by the director', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('eb8721e9-4202-4425-8921-3d7523e2286a'::UUID, 'served as urinalysis coordinator', 'served as substance abuse testing program coordinator', 'navy', 'admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('eb8859b1-651a-46c2-9834-e2c3c8e34403'::UUID, '3M system', 'planned maintenance management system', 'navy', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ebe86822-d108-4a33-801a-6cdaacdeb3cd'::UUID, 'combat multiplier', 'force multiplier / high-impact contributor', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ebeb842e-e630-4a0a-b552-6f94b5179031'::UUID, 'CLEP tested', 'earned college credit through standardized testing', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ebef64f5-0488-4f10-8566-3e3ae67d4130'::UUID, 'garrison operations', 'routine facility and personnel management', 'army', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ec189d94-c1c5-4960-8406-37c9b8fe1da9'::UUID, 'OPR', 'officer performance report', 'usaf', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ec216db4-341a-49a3-8ebf-cdcf4f9770f4'::UUID, 'board eligible', 'eligible for promotion review', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ec73a191-9816-430e-a5ec-872a80a5a1f5'::UUID, 'completed Top Level School', 'completed executive leadership course', 'usmc', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ec9302b5-8923-4fc8-947d-ca6cc8a687b2'::UUID, 'conducted PFT/CFT', 'completed organizational physical fitness assessment', 'usmc', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ecd5efb6-2769-47d1-acf1-2f5ae2bc584b'::UUID, 'page 13', 'administrative counseling record', 'navy', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ed16900b-13e0-4d28-8f31-bf833be5df32'::UUID, 'aircraft availability rate', 'fleet availability rate / aircraft uptime percentage', 'general', 'aviation', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ed195ba9-87d1-4e92-b267-c63880804213'::UUID, 'PCA', 'local reassignment', 'general', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ed4da5f1-22fd-45a2-976a-725d1083abd1'::UUID, 'MEB', 'medical evaluation board review', 'general', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ed68cba6-a206-417f-b4a4-164e85e2df3b'::UUID, 'served as first sergeant', 'served as senior operations manager', 'army', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('edabd2bd-7555-488c-966d-5ea8ff684d5b'::UUID, 'GAR model', 'risk assessment tool', 'uscg', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ee3990a6-4eef-4817-9f46-c20e00ea6bc1'::UUID, 'performed PMS', 'executed scheduled preventive maintenance', 'navy', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('eebb56bd-e625-4e50-97c4-124308fcedd9'::UUID, 'designated instructor', 'certified trainer', 'general', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('eece15d1-fd83-4cf6-bc09-5fa551c66a8e'::UUID, 'managed a supply account', 'managed inventory account / procurement account', 'general', 'logistics', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('eeeda5f7-bc6b-483c-b817-f018add6904a'::UUID, 'medical board', 'medical fitness for duty review board', 'general', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ef350be0-cb96-426f-b1a4-8d192f174bef'::UUID, 'NMC', 'non-mission capable or out of service', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ef76396e-0509-48b7-92be-1e5a9046fade'::UUID, 'ASI qualified', 'earned additional skill identifier certification', 'army', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('efbdba43-4ad4-4318-9742-836b0361b457'::UUID, 'Class V supplies', 'ammunition and explosives', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f03be630-56c3-44d7-bdb4-238f64a58cff'::UUID, 'network operations', 'network administration / IT infrastructure management', 'general', 'cyber', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f05d28a0-bfd0-4f50-8fa0-4e584c5ea7d4'::UUID, 'mobilized for', 'activated/deployed for', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f07ac4de-c583-4e40-b5ae-8ce530ca2102'::UUID, 'OSHA compliance', 'workplace safety regulatory compliance', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f0c4ee86-173d-4fd0-8a40-6206f5ada856'::UUID, 'allowance list', 'authorized inventory of required items', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f12bc77c-885e-4934-92f0-6a2d9b991b84'::UUID, 'mentored junior leaders', 'mentored emerging leaders / coached new supervisors', 'general', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f14ee035-796f-4283-925f-3ec33dcd72e3'::UUID, 'selected as Sailor of the Year', 'selected as employee of the year', 'navy', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f1856bb3-4038-4208-9a5c-0bc4b6ffc41a'::UUID, 'flawless execution', 'error-free implementation', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f1c1a17c-2001-4819-9036-c2f892d8eba9'::UUID, 'maintenance availability', 'scheduled maintenance downtime window', 'general', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f1d4d6b5-c49c-4ae3-a7e4-0c7d8fd85d13'::UUID, 'liberty port', 'scheduled port visit', 'navy', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f1ebf9da-9a9c-4647-8015-fae8d6956c7c'::UUID, 'point paper', 'executive summary or issue brief', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f2060130-5a18-4c0a-9bf4-b53205629d89'::UUID, 'stood OOD watches', 'served as senior operations shift supervisor responsible for all organizational activities', 'navy', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f222db5a-be5e-42f1-a35b-23da935048f4'::UUID, 'completed SNCOA', 'completed senior leadership development course', 'usaf', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f24565bc-f614-4119-ab4a-a4cbfac170d3'::UUID, 'stood watch as OOD', 'served as senior on-duty manager', 'navy', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f275bd37-0943-4d45-a5d4-5df99729ae7d'::UUID, 'signal support', 'IT support / communications infrastructure support', 'general', 'comms', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f2aea442-96b9-4cfd-91e2-4c0c2dcc2a68'::UUID, 'gain and loss report', 'personnel arrivals and departures report', 'general', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f363b518-4ca3-4a3e-952d-9cd445e1ceb8'::UUID, 'scored 600 on ACFT', 'achieved maximum score on physical fitness assessment', 'army', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f382b95a-edc7-4d14-83af-98896505baaf'::UUID, 'master training specialist', 'expert instructional designer', 'navy', 'Training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f40bb3fc-0613-4794-96cc-203c9b13eaed'::UUID, 'completed SABC training', 'completed self-aid/buddy care first responder training', 'usaf', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f41e8f8a-5a7a-4019-995d-88fe1d536311'::UUID, 'PT DLCPO', 'Part-Time Division Senior Supervisor', 'navy', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f46c59f7-3cdc-4fd2-bc13-2c032999f975'::UUID, 'handled classified material', 'managed sensitive/classified information', 'general', 'security', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f478b320-cafb-4fdc-b227-f4f7bdb2b544'::UUID, 'open-source intelligence', 'open-source data analysis / public information research', 'general', 'intel', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f4d1b897-436d-4697-9ccb-0f4220c684cc'::UUID, 'served as battle NCO', 'served as operations center shift supervisor', 'army', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f4f2ef89-6c5e-4eb7-a00f-69c46f0b5410'::UUID, 'deadline', 'non-operational due to required maintenance', 'army', 'Equipment', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f51665a0-7027-44e0-bea5-cb43077ae7b5'::UUID, 'served as fire team leader', 'led 4-person tactical team', 'usmc', 'leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f51a8f8a-3ebf-4ea9-80e8-c3d963b92472'::UUID, 'earned 5-level', 'achieved journeyman-level technical certification', 'usaf', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f542bc18-e1cf-4896-918f-b7fe55e41117'::UUID, 'managed USR report', 'managed unit status/readiness report', 'army', 'compliance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f545d8f6-3a69-4959-a939-1f937794667f'::UUID, 'plan of the day', 'daily schedule and announcements', 'navy', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f5818868-1f97-4dce-80dc-0ca731aa70ce'::UUID, 'air traffic control', 'air traffic management / airspace coordination', 'general', 'aviation', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f59169b0-e1d7-4d4f-87aa-5eee599d513f'::UUID, 'unit citation', 'organizational achievement award', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f61fe2e1-cf2a-4b77-b512-7816dd52a4b4'::UUID, 'stood the watch', 'maintained continuous operations', 'navy', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f65b8b76-efc1-47a5-8ba4-5e9f192b1774'::UUID, 'hit the ground running', 'achieved immediate productivity', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f66a0d82-c443-452d-a65b-813b1632095a'::UUID, 'shift operations', 'rotating shift coverage / multi-shift operations', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f6d91f97-980b-4be8-9688-269b4c3edfea'::UUID, 'completed all prerequisite training', 'completed all required certifications', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f7150479-7ef0-4bc4-a630-d6f28d4c3327'::UUID, 'stacked the deck', 'assembled the strongest team and resources', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f744f9df-c11b-4642-bc22-abf0a26ebe74'::UUID, 'managed divisional 3M program', 'managed section-level preventive maintenance program', 'navy', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f7d5ea88-5dc3-4432-b937-248eee0628cf'::UUID, 'hot wash', 'immediate after-action debrief', 'general', 'Communication', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f7de313b-60a8-4101-88fa-1ae1fb5f23e5'::UUID, 'BCA', 'body composition assessment', 'navy', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f7ef0e9a-ae7c-4c6c-9bca-95ecac36ce1a'::UUID, 'defensive cyber operations', 'cybersecurity defense / network security operations', 'general', 'cyber', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f88f7ba4-7396-4f87-8153-017d07d5c3b3'::UUID, 'light off', 'system startup/initialization', 'navy', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f8bf5ad7-c7f2-478e-b96e-540f94796fa8'::UUID, 'individual training plan', 'personal development plan / individual learning plan', 'general', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f8d5ab12-f0a4-499b-bad2-150d32ca56b1'::UUID, 'combined operations', 'multinational/coalition operations', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f8e543b8-2bad-4f0c-a457-5bbbe63ff057'::UUID, 'served aboard amphib', 'served aboard amphibious operations vessel', 'usmc', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f8e64ce2-e662-48d1-99f7-6970c769b35a'::UUID, 'firewall five', 'received the maximum performance evaluation score', 'navy', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f9120e4f-e88d-4fc1-8bf8-f927db69edcf'::UUID, 'served as 3M coordinator', 'served as preventive maintenance program manager', 'navy', 'technical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f912a518-5856-4b0a-8f1c-1ebbe6ebe8fc'::UUID, 'served as readiness NCO', 'served as organizational readiness coordinator', 'army', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f9399044-7fd3-4a2d-8979-0e203ed11bee'::UUID, 'PEB', 'physical evaluation board review', 'general', 'Medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f9ee85de-96a7-4502-a163-63b63d304450'::UUID, 'earned Air Assault qualification', 'completed helicopter assault operations certification', 'army', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('f9f83a0b-62df-4a2c-9013-864715179ea8'::UUID, 'served as ESO', 'served as educational services officer / training coordinator', 'navy', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('fa597b0c-8ce5-4d2d-88d2-c86105149551'::UUID, 'field operations', 'remote site operations', 'army', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('fa7da8fc-e4e7-40ce-9224-65ddd14ca4ed'::UUID, 'distribution management', 'distribution logistics / shipping and receiving management', 'general', 'logistics', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('fae0901c-9033-44bb-b6f8-60e66b3c569c'::UUID, 'safety council', 'safety review board', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('fae3c249-a083-4d6f-a450-df13962e6778'::UUID, 'earned the respect of', 'built credibility with', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('fb33833f-314c-425f-abd6-c7fd04492108'::UUID, 'served as DCTT team leader', 'served as safety training team lead', 'navy', 'training', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('fc3a2aa8-9fda-460c-806d-9da21eb8a715'::UUID, 'logistics readiness', 'supply chain preparedness / operational logistics readiness', 'general', 'logistics', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('fc73a721-0a52-4a9f-909a-0982fcbf9059'::UUID, 'fleet logistics', 'enterprise-wide supply operations', 'navy', 'logistics', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('fcb648b5-abca-4a11-9fdd-6772458f9e5a'::UUID, 'system hardening', 'security hardening / system configuration management', 'general', 'cyber', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('fd2161dc-0411-4f6a-84d3-73425dcfad89'::UUID, 'safety stand-down', 'organization-wide safety training day', 'general', 'Safety', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('fe2c8767-a01f-45ed-91b1-41084b0d0b3e'::UUID, 'clean sweep', 'passed all inspection areas', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('fe4d1e28-ee83-4303-8e0b-a266f2f0cf2e'::UUID, 'kept the lights on', 'ensured operational continuity', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('fe74b71e-edbd-443e-94b3-e666811dafbd'::UUID, 'COOP plan', 'continuity of operations plan', 'general', 'Operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('fe7ce494-922d-4ab1-8d05-7a752d180695'::UUID, 'put the mission first', 'prioritized organizational objectives', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('fea573d0-6843-42c0-96aa-c0a0b16c61f9'::UUID, 'exceeded standards', 'surpassed performance benchmarks', 'general', 'performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('fea60d80-e62f-47cc-aff4-7a6816315525'::UUID, 'under budget', 'completed below the allocated budget', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('feadfc3e-2ac1-4400-a010-ab7fe150c0ad'::UUID, 'managed OPTAR', 'managed annual operating budget', 'navy', 'logistics', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('feaeaf71-d6e0-4a42-8421-13108990a4f5'::UUID, 'first to volunteer', 'proactively seeks challenging assignments', 'general', 'Leadership', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('fed47ebf-5034-4b10-842d-5ee9fd68cb72'::UUID, 'medical logistics', 'healthcare supply chain / medical equipment management', 'general', 'medical', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('fef502ee-c434-4e77-8508-d110a7b757f2'::UUID, 'mission planning cycle', 'project planning process / operational planning cycle', 'general', 'operations', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;
INSERT INTO dict_phrase_translations (id, military_phrase, civilian_phrase, branch, category, context_notes) VALUES ('ffede751-1188-4c6f-a43e-c77379241c9e'::UUID, 'mission accomplished', 'objective achieved', 'general', 'Performance', NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_phrase = EXCLUDED.military_phrase,
    civilian_phrase = EXCLUDED.civilian_phrase,
    branch = EXCLUDED.branch,
    category = EXCLUDED.category,
    context_notes = EXCLUDED.context_notes;

COMMIT;
