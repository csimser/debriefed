-- =============================================================================
-- Phase 1: Upsert dict_military_jargon (1,649 rows)
-- Source: /home/fiveftslim/debriefed-ai-lab/dict_military_jargon_rows.csv
-- Run AFTER 20260224_phase1_schema_additions.sql
-- =============================================================================

BEGIN;

INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0045615b-f2fa-47ee-97da-08698dbc2b35'::UUID, 'personnel', 'staff / employees / HR', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('007c3464-5876-4b64-8997-594ba138695e'::UUID, 'reorder point', 'minimum stock trigger / replenishment threshold', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('00880ce0-012f-43c8-a5e3-018f10f18acb'::UUID, 'MASINT', 'measurement and signatures intelligence / technical data collection', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('009c70cb-f050-4f36-9018-9c446a42a8d3'::UUID, 'COLA', 'cost of living allowance / location-based pay supplement', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('00af4730-3536-41e0-9db6-3ac74bc053b1'::UUID, 'billet', 'authorized position / funded role', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('00e2dccc-97f1-451d-8d39-92781a04e294'::UUID, 'GPC', 'government purchase card / corporate credit card', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('00fb297d-d44a-4dca-88de-78810a12c169'::UUID, 'passdown', 'shift handover / status briefing', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0140de23-9c7c-4223-8b32-224b2a9544db'::UUID, 'fragmentary order', 'change order / updated directive', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('01493d8e-570e-46b1-bd65-46a1c60408e0'::UUID, 'fire team leader', 'small team lead', 'general', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('015e0b71-6e0d-45b0-99b5-00dbdc62337d'::UUID, 'labor hour', 'hourly billing arrangement', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0195d72f-54b1-468a-80f2-11cdd0bb253e'::UUID, 'report', 'arrive / check in / start', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('01df6128-fac7-4408-88c6-c31808414f22'::UUID, 'J&A', 'justification and approval / sole-source rationale document', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('01e4e3b7-bbdc-4eaf-b591-7727a431c905'::UUID, 'SMSgt (Senior Master Sergeant)', 'Senior Manager', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('01facf06-5351-416f-b80a-0f6da9617835'::UUID, 'tactical vehicles', 'fleet vehicles / field vehicles', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('02021b1f-4a52-4c98-a4e1-83d084072c42'::UUID, 'backstop', 'verification support for cover identity', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('02c1da33-a4aa-4724-90ca-b62d0b016460'::UUID, 'contingency', 'emergency response / backup plan', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('02f6dc50-f9a9-493b-945a-c822dfb5628c'::UUID, 'option year', 'contract renewal period', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('02fb9ff7-3b2a-490b-9796-ca6931746161'::UUID, 'embarked', 'deployed / traveling for work', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('030e34ad-16a4-4eaa-8851-bc0d4493ce6a'::UUID, 'division officer', 'department manager', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('03436efe-ae78-4a3f-a328-77b093ba529e'::UUID, 'PO1 (Petty Officer First Class)', 'Supervisor / Senior Team Lead', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('034b47ae-1d5f-43bd-807e-1cb8629c695d'::UUID, 'gripe', 'maintenance discrepancy / deficiency report', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('035880d3-c9b0-4b58-b451-f474b308eaff'::UUID, 'squared away', 'organized / well-prepared / professional', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('03bf93bf-b744-435f-b335-f4f778c17028'::UUID, 'joint duty', 'inter-agency assignment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('03e3ba2a-0a44-4054-95f8-5aa3c57a4cac'::UUID, 'sick bay', 'medical clinic / health services', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('03f047cc-2cce-4410-91e6-e38d83843500'::UUID, 'leave', 'paid time off / vacation', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0407076a-bab4-4df3-a56f-00db8d8f7d30'::UUID, 'UA', 'unauthorized absence / no-call no-show', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('04385999-04c2-475d-9805-74e585da10b6'::UUID, 'operational', 'active / functioning / deployed', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('052a7503-3911-4754-8ee8-b9cfbf33ae7f'::UUID, 'MWR', 'Morale, Welfare and Recreation / employee services', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('052ac636-a76a-4a0d-a019-568921dfdb8a'::UUID, 'tour of duty', 'assignment length / contract period', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0538a2ea-f259-4adb-8fb1-45a255faae82'::UUID, 'legend', 'cover story / assumed identity background', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('053e935b-e79f-4fa5-960a-8a48ccfad4cb'::UUID, 'LTC (Lieutenant Colonel)', 'Senior Director', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('054f0360-6455-4ccd-a98f-791750130754'::UUID, 'UNODIR', 'unless otherwise directed', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('05d8ad8a-ce8a-4ca7-af3c-849df7b09835'::UUID, 'military bearing', 'professional demeanor / composure', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('05db6f1e-19c1-43bc-9bf3-0cc5f60aa03e'::UUID, 'SATCOM', 'satellite communications', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('05e9be33-044a-4ed8-bad9-473153a02cfd'::UUID, 'LES', 'leave and earnings statement / pay stub', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0601c61a-ef6d-4c0b-9557-80c71ed16112'::UUID, 'hand receipt', 'property accountability document', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('064622e8-c1c8-4e5c-a7bd-daed1b32a0e8'::UUID, 'Lt Col (Lieutenant Colonel)', 'Senior Director', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('064c10ce-952d-4e36-b6e5-b38a763201b2'::UUID, 'squadron', 'operational unit of 100-300 employees', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('068bb23a-87e5-4b2c-8ad2-ca9f8ba21bd1'::UUID, 'TBS', 'The Basic School / officer training', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('06a94b64-1619-4a3c-ad81-0b1652bcf27f'::UUID, 'SA (Seaman Apprentice)', 'Junior Staff Member', 'uscg', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('06b7000f-0d45-4af4-a171-59e98c5f6689'::UUID, 'voucher', 'payment authorization / reimbursement document', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('06c2c50a-330c-41a1-bc76-b57387528821'::UUID, 'PPBE', 'planning, programming, budgeting, and execution / budget lifecycle process', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('06d438b1-8183-4ad4-98f2-0cfa36fc79b7'::UUID, 'overseas', 'international / foreign location', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('06e4f89c-d238-4a76-88ad-cae8b6075c94'::UUID, 'DANTES', 'Defense Activity for Non-Traditional Education Support', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('06e84349-8969-4ce6-94d2-da711801e25a'::UUID, 'division', 'department / team / work group', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('06e88c3a-134e-4d82-8a29-d92e6f83083d'::UUID, 'SDO', 'Staff Duty Officer / on-call manager', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('070d425f-a6b3-4e60-ba61-c2ec0c3f0482'::UUID, 'PACE plan', 'primary alternate contingency emergency communication plan', 'general', 'planning', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('073ec32e-337b-480f-9133-d17619ce2b34'::UUID, 'counseled', 'provided performance guidance to', 'general', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0796f73f-bd2b-4c2c-9a95-3256a432b75a'::UUID, 'ETS', 'Expiration Term of Service / end of contract', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('07a33abd-c4a7-497d-9d69-9a3571eca70c'::UUID, 'recall', 'emergency callback / urgent summons', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('07ada0ed-bc52-44b1-8f58-97aacdecdacd'::UUID, 'SA (Seaman Apprentice)', 'Junior Staff Member', 'uscg', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('07b68180-5b34-4e81-bfd5-0f26a8e2050a'::UUID, 'PWS', 'performance work statement / deliverables specification', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('07c2e647-8263-4287-8a4c-5db57290b867'::UUID, 'NCOIC', 'Non-Commissioned Officer in Charge / shift supervisor', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('07dbbb8b-ce3f-4291-bbd0-c7cfe5c625e8'::UUID, 'PMO', 'Provost Marshal Office / military police HQ', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('07e21bc6-faf1-4159-8bb6-b2cf9ca2b323'::UUID, 'UIC', 'Unit Identification Code', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('07e2b401-5654-4d68-8521-42aa940fe5f2'::UUID, 'discharge review', 'employment separation appeal', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0817757c-ede7-490e-ab95-dc563facf536'::UUID, '1LT (First Lieutenant)', 'Manager', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('08663ca5-b602-4d0b-aedd-953b07f2b698'::UUID, 'NMC', 'not mission capable / non-operational / down for maintenance', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('086bf498-2902-48f0-9569-0ca1da2a3b6a'::UUID, 'LCDR (Lieutenant Commander)', 'Director / Senior Department Head', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('087b773a-f523-4db1-b0dc-f2cae115ff8b'::UUID, 'LPO', 'team lead', 'navy', 'leadership', 'Served as LPO for 15 personnel', 'Served as team lead for 15 personnel')
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0880c0b4-4235-49df-bddc-f620299683af'::UUID, 'EP', 'Top Performer / Early Promote', 'navy', 'evaluation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('08c57c55-8b9e-4c60-8147-8ef00bc6bf82'::UUID, 'dental readiness', 'dental fitness status / oral health compliance', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('08f3e49c-6fc9-4083-8ecc-b7b12e484a30'::UUID, 'in the fleet', 'in field operations / working', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('09238cac-6eba-4f3b-b0bd-fc62f753bc2b'::UUID, 'A school', 'initial technical training', 'navy', 'training', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('092be564-4cb1-4634-a88b-ccb670dcc110'::UUID, 'orders', 'assignment notification / transfer paperwork', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('09575e02-6bc7-4f5b-8160-c47b430fac8b'::UUID, 'NKO', 'Navy Knowledge Online / e-learning platform', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0980a061-0fa6-4405-8ca7-3e3dee6b7324'::UUID, 'page 2', 'emergency contact and dependency record', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('09e473c4-e1d6-4c60-bd56-40e0e384d068'::UUID, 'combat medic', 'emergency medical technician / field paramedic', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('09ff4652-efa4-40c5-83eb-f4f8dbfedec0'::UUID, 'FOC', 'full operating capability / fully operational status', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0a47b2b8-29fb-4739-900b-ed59f43d5907'::UUID, 'administrative remarks', 'official personnel notes / employee file entries', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0a5ae356-971a-4d46-95e7-5f6e1f61ef69'::UUID, 'kit', 'equipment / tools / supplies', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0a5ff6ee-7f3f-4d8c-8064-ce701cd8588a'::UUID, 'stand down', 'pause operations / rest period', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0a60c773-f926-4ec3-9f7a-9bd51a456c52'::UUID, 'VA', 'Veterans Affairs / veterans services', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0a75b75c-c9b4-4e20-95c2-a63fb01593ce'::UUID, 'USERRA', 'Uniformed Services Employment and Reemployment Rights Act', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0a8c5180-efaa-4d07-9c57-bc45bfcdfc43'::UUID, 'SN (Seaman)', 'Staff Member', 'uscg', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0a8e4f5a-2494-45d0-8fb3-80c2ea6d1f4c'::UUID, '2d Lt (Second Lieutenant)', 'Junior Manager', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0ac51355-09f7-47f5-a826-14f33776efaa'::UUID, 'assigned strength', 'current headcount / actual staffing', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0ade3a95-e425-4b74-8cab-86b50b3920fb'::UUID, 'combat ready', 'fully operational', 'general', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0b058815-9d7c-4356-94cd-29ce548f000c'::UUID, 'sick bay', 'medical clinic / health services', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0b49a080-123e-403e-857d-fb15059c6d04'::UUID, 'MISO', 'military information support operations / strategic messaging', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0b5053a7-76ad-4fe7-95a9-a471689a927a'::UUID, 'deployment health', 'occupational health screening / fitness-for-duty assessment', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0b594156-ad7d-4721-8aa0-3587ed3fddb9'::UUID, 'detailing', 'assignment management / personnel placement', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0b5ee06a-43b3-4dd9-8d30-1aa29c53ffa2'::UUID, 'CINC', 'Commander in Chief', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0b927a83-7b89-4d56-97ad-735c3919aca7'::UUID, 'ship', 'vessel / facility / organization', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0bb7de72-38c3-4a38-9434-fd9dbfa56da4'::UUID, 'promotion', 'advancement / career progression', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0bd21f18-16cb-497e-93e5-c311b5290e1e'::UUID, 'detail', 'temporary assignment / special project', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0c04dc6a-ec36-44b5-a730-5a0ef940fc6f'::UUID, 'IRR', 'Individual Ready Reserve', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0c2ae802-bc27-4d66-84fa-6c34f3345268'::UUID, 'CONUS', 'domestic operations', 'general', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0c84a55b-4781-4414-897c-635a9c94ae5a'::UUID, 'RDC', 'Recruit Division Commander / drill instructor', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0cae9fc5-2212-4655-b564-56b38c8b71d3'::UUID, 'FRG', 'Family Readiness Group', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0cde78fc-ce24-41fe-9053-87772bf12e0e'::UUID, 'UW', 'unconventional warfare / irregular warfare', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0cdf7aaf-e756-4ca5-a1c2-a457f41f3066'::UUID, 'forward deployed', 'on-site at client location / field office', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0d124f15-3061-428f-9ad7-b6ebf4bb7354'::UUID, 'galley', 'dining facility / cafeteria', 'navy', 'general', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0d2ed984-f800-4466-b23b-a6d745e8140d'::UUID, 'PMO', 'Provost Marshal Office / military police HQ', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0d3fe132-e6bc-4a7b-a64e-57bfc3db576e'::UUID, 'BAH', 'Basic Allowance for Housing / housing stipend', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0d7f133b-ba04-4262-9f24-7925f32bf40a'::UUID, 'COR', 'Contracting Officer Representative', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0d9c3c92-7191-4648-b8b8-64f6708d60d0'::UUID, 'dead drop', 'concealed exchange point', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0da2049d-308f-4e66-8125-b44780564431'::UUID, 'CMR', 'Consolidated Memorandum Receipt / inventory document', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0e1ac14a-9453-4c28-ade6-5c1250a4f692'::UUID, 'open source', 'publicly available information', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0ed01f91-70a8-43e2-a392-7036c36ac795'::UUID, 'command climate', 'organizational culture / work environment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0f3baa12-acce-4b84-910c-b9179491d8d2'::UUID, 'hot wash', 'immediate after-action discussion / quick debrief', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0f7fd75a-30ce-429b-b9b7-545a24cad425'::UUID, 'secure', 'finish / complete / lock up', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0fc1b5ea-8016-4cd4-8dc9-d4ae30ce2ab7'::UUID, 'division', 'organization of 10,000-15,000 employees', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0fe640fa-4b2d-433c-b993-757db0d7d550'::UUID, 'S1', 'Personnel/Admin section / HR department', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('0ffd2054-0384-4fb8-a8e1-37460b924e3f'::UUID, 'FORSCOM', 'Forces Command', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1025cd0a-ecc9-45c1-bfb8-431ecae7f7b6'::UUID, 'MSgt (Master Sergeant)', 'Manager', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1046ad50-0219-420d-a11e-58cbfcd2139d'::UUID, 'Role 1', 'first responder care / point-of-injury treatment', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1065f486-14ae-47a3-a1be-d3e2ca6b02c9'::UUID, 'JPAS', 'Joint Personnel Adjudication System', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('10b22a33-f7c6-49ab-8f96-96614af1fc7c'::UUID, 'AIT', 'Advanced Individual Training / technical certification program', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('10bc1c20-a4c5-4f38-b74d-0cbf77cbee1e'::UUID, 'SECDEF', 'Secretary of Defense', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('110bc975-94d8-4089-aa84-c019c89ae918'::UUID, 'MAJ (Major)', 'Director', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1114b99d-559a-473e-877b-a9de60789b1b'::UUID, 'NATO', 'North Atlantic Treaty Organization', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('111af95d-8314-4efb-a8f8-92f6120105ef'::UUID, 'DTS', 'travel management system', 'general', 'logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('117999f8-8309-4f03-b3c8-cd77804a5984'::UUID, 'inspector general', 'internal auditor / compliance officer', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1190b9f2-409f-4556-8ece-4a746aeeb0e8'::UUID, 'shipmate', 'colleague / coworker', 'navy', 'general', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('11a6938f-e50b-40d3-8b83-8485a5a75eed'::UUID, 'overhead', 'ceiling', 'navy', 'general', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('11bc6ae9-e0cf-4b2c-a821-9ac91f8967e7'::UUID, 'galley', 'cafeteria / break room', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('122a9afb-35f3-4c96-b46b-69cdda44c791'::UUID, 'vulnerability assessment', 'security testing / penetration testing', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1239de57-5308-4895-bc95-c9d07d3cb3e8'::UUID, 'SNCO', 'Staff Non-Commissioned Officer / senior supervisor', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('125c1144-3de6-4b6f-8217-474ec556fd18'::UUID, 'relieved', 'removed from position / terminated', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1260155c-67e6-495e-8576-b2cba7fbddd9'::UUID, 'advancement', 'promotion', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('128258a6-3837-4f5f-9ea9-1334e7ac5bdf'::UUID, 'rating', 'job specialty / technical field', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('12ab0fe2-6c4f-4557-8ae3-9586dada5afc'::UUID, 'TDY', 'Temporary Duty / business travel', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('12f1ea1d-2d71-4f89-962e-608e1228ceea'::UUID, 'smoking lamp', 'break time / authorized break', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1314c0e4-bd0c-4ce9-93db-a7996fa4e190'::UUID, 'PO1 (Petty Officer First Class)', 'Supervisor / Senior Team Lead', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('136bf5de-3383-44ac-91bc-001de625b3aa'::UUID, 'GSA', 'General Services Administration', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('13827bbc-c5d9-4c86-873e-851071d39e84'::UUID, 'HF/UHF/VHF radio', 'radio communications systems', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('138410a1-0783-436a-bd1c-c6ee3845c137'::UUID, 'cadre', 'training staff / leadership team', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('13a0f897-d1f1-40d9-b0e3-90992bd58004'::UUID, 'fund cite', 'budget account number / appropriation reference', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('13b9370c-a30e-41d3-aee2-9a32a5d102e4'::UUID, 'staff', 'support personnel / administrative team', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('13c4984b-ac5b-4cd4-beb3-f590177e17a2'::UUID, 'SECNAV', 'Secretary of the Navy', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('13db53ed-ffe0-447d-b05b-2cc886f24eb2'::UUID, 'medic', 'emergency medical technician / field healthcare provider', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('142201cc-4edc-4227-8167-b6d86a786e82'::UUID, 'SgtMaj (Sergeant Major)', 'Senior Director', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('147cf49b-ad76-4226-8f42-777d41ba809b'::UUID, 'obstacle construction', 'barrier installation', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('148031c3-62e7-4920-9f3d-964fc55f3dd6'::UUID, 'CINC', 'Commander in Chief', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('14d25e04-9240-47cd-b7b5-7054442f1f68'::UUID, 'station', 'assigned location / work position', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('14d9c391-e23d-4330-8d47-78c536c130f4'::UUID, 'cost center', 'budget unit / organizational spending account', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('14ec77a2-9c9e-493f-a57a-18ddc23f02df'::UUID, 'S2', 'Intelligence section / analysis department', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('14f3a866-6fcd-46e4-a4f9-89373d9f5d3c'::UUID, 'veteran', 'former military employee', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('15184016-afc9-4b8a-8598-3ad83ca7b6aa'::UUID, 'CSM (Command Sergeant Major)', 'Senior Director', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('15869cc0-e5c1-4f18-9f4a-2dec5b23a24a'::UUID, 'platoon', 'team of 30-50 / large work group', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1598225c-e655-4bf4-8587-ea0857a8933b'::UUID, 'POA&M', 'Plan of Action and Milestones / project timeline', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('15a60a04-60ea-4976-9690-d5ff2bc09680'::UUID, 'sweepers', 'routine cleaning', 'navy', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('15b759fe-489f-4979-a099-b31ced55f459'::UUID, 'DRMO', 'surplus property disposal', 'general', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('15e748f0-ef65-4a87-b455-b99c2a0a26c4'::UUID, 'sortie', 'mission', 'general', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('15f82a4a-fdfc-487d-b9ce-baec5fc7621e'::UUID, 'FTX', 'field training exercise / hands-on training event', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('160d0d0a-0694-4e0f-9497-5588b0bf170c'::UUID, 'NAVFAC', 'Naval Facilities Engineering Systems Command / Navy construction agency', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1610a8f8-f714-498b-a9cb-afb4e9b591b8'::UUID, 'POC', 'point of contact', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('162b40d4-5c29-43ad-b062-cf7ad29cf590'::UUID, 'headquarters', 'corporate office / main office', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1653375b-466e-4ead-9344-70e9563fac75'::UUID, 'LZ', 'landing zone', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1673ab88-a5f8-44c3-8837-f02b3cfe38c4'::UUID, 'FOIA', 'Freedom of Information Act request / public records request', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1676f4c0-fcc8-480e-b69f-c7bcca9a9d61'::UUID, 'bandwidth', 'capacity / available resources', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1681f387-98a1-49da-9399-9c6f44ac08c7'::UUID, 'compartmented', 'restricted access / segmented information', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('16be19da-8465-439c-98a1-07e40abf080d'::UUID, 'AOR', 'area of responsibility / managed territory', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('16e988c5-78b2-490d-b04a-5eb38626564c'::UUID, 'mission essential', 'critical function / required capability', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1716c501-00b4-439d-99a1-cbc731f7b3aa'::UUID, 'TEMPEST', 'emissions security / electronic emanations protection', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('17420052-aed5-4cc8-a1e1-c82ed2a6b628'::UUID, 'lifer', 'career employee / long-term staff', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1753aae5-a1d9-4f5c-97c3-37fd5c238c78'::UUID, 'standing watch', 'on-call duty / shift coverage', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('17b3c507-cf8a-4cba-9f4e-5670951c48d2'::UUID, 'case officer', 'operations manager / field coordinator', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('17de2851-c5fd-44e7-9230-6b4ab05958e0'::UUID, 'claims', 'damage or injury compensation requests', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('17f92aca-4ca1-4192-931d-fa62a656eb8f'::UUID, 'GySgt (Gunnery Sergeant)', 'Manager', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1845f15d-6441-4ff2-a9e8-3fcb2f9de7c7'::UUID, 'NCO', 'Non-Commissioned Officer / supervisor', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('185447c1-0266-4548-90ac-a1f006922ad3'::UUID, 'NVG', 'night vision equipment / low-light optics', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('18648d51-4b27-4483-84f6-89ec052d4f0c'::UUID, 'at sea', 'deployed / offshore operations', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('18713d28-2622-4127-9701-b9ae43572720'::UUID, 'battle rhythm', 'recurring meeting schedule / operational cadence', 'general', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1876c3d9-d34c-4200-8472-1c27a3fa7fc5'::UUID, 'NEC', 'specialty qualification', 'navy', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('188cd7b7-db51-4f1d-8d09-018e42f377fa'::UUID, 'BAS', 'Basic Allowance for Subsistence / meal allowance', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1891a137-6e6a-4857-889d-ebed49e47a52'::UUID, 'good to go', 'ready / approved / cleared to proceed', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('189805b5-846d-4e17-92de-40f57c62ac6c'::UUID, 'surplus', 'excess property / items beyond requirements', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1913fb27-7819-4bbd-b74a-9fd056048c8c'::UUID, 'ATO', 'authority to operate / security certification to deploy', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('193cedf0-1cdc-49b8-9b0d-eabb80c780ab'::UUID, 'TACP', 'tactical air control party / close air support coordinator', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1956d88d-2335-43de-9f68-05256c131891'::UUID, 'theater hospital', 'forward surgical hospital / field hospital', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1960bda4-6002-4134-a2fe-73c535108747'::UUID, 'hot refuel', 'refueling with engines running', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('19660bb5-759f-4b55-8616-5301fbacf89d'::UUID, 'AFSC', 'Air Force Specialty Code / job classification', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('19a8a2fd-2d74-4149-8de7-0f8336f34a4e'::UUID, 'QUAL', 'qualification / certification', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1a2e53ae-9505-45f8-a928-3209dc21ae90'::UUID, 'ISIC', 'Immediate Superior in Command', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1a3ce77a-3e91-464f-a738-b4f1d9ab8fb9'::UUID, 'hazmat', 'hazardous materials / dangerous goods', 'safety', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1a5b2354-077e-47cb-ba50-2325c619ce01'::UUID, 'GySgt (Gunnery Sergeant)', 'Manager', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1aa1d4bd-efdf-407d-95c6-02a2bd81a81b'::UUID, 'HVAC', 'heating, ventilation, and air conditioning', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1ace67a4-d22f-46d3-b26c-b59671487f9f'::UUID, 'bench stock', 'consumable supplies / expendable items on hand', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1ade753e-02c2-4500-8ef5-3265b6ca5c86'::UUID, 'hangar queen', 'chronically non-operational equipment', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1ae0ac5c-ef2e-41d0-af99-831124ce9c99'::UUID, 'non-rate', 'entry-level / undesignated', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1b0915d6-cabe-4968-b3ad-52b5c9de329e'::UUID, 'hump', 'march / endurance exercise', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1b27720e-7e2d-4a2d-8b28-a34d8b2c7d15'::UUID, 'HQ', 'headquarters / corporate office', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1b4dae5f-ec73-408d-8207-64524b837e00'::UUID, 'IPR', 'in-progress review / status update meeting', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1b4f8e5f-9512-43f0-bd1f-c3fdf8487d35'::UUID, 'APFT', 'Army Physical Fitness Test / physical readiness assessment', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1b67f792-5e8d-4347-a55f-1ae1853f4e12'::UUID, 'ADCON', 'administrative control', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1bf073fd-f1ad-4851-88fd-e6481712a910'::UUID, 'duty station', 'work location / assigned office', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1c00624c-23fa-4f3b-b31a-3235db8fb042'::UUID, 'FORSCOM', 'Forces Command', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1c0325e2-1b00-42d0-b1ee-67d812bff34e'::UUID, 'SAP', 'special access program / restricted-access initiative', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1c3947ff-f4a8-4612-8a25-3cf2d1c50931'::UUID, 'C school', 'advanced technical training', 'navy', 'training', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1c91a407-735d-4dae-8f00-856605d4fe1f'::UUID, 'NSW', 'Naval Special Warfare / Navy special operations', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1cd58d7e-1479-43d8-ad0b-cb9af7bca8cb'::UUID, 'plan of the day', 'daily schedule / agenda', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1ce567ea-3a42-4517-932b-63c4c138ded6'::UUID, 'reserve', 'part-time / on-call', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1d3034e4-95d6-4dbe-97ca-1af984621129'::UUID, 'MOU', 'Memorandum of Understanding / formal agreement', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1d33dc01-919e-4a94-97d7-2f3ad205ca4f'::UUID, 'patrol', 'monitoring / surveillance / rounds', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1db21d09-0d3d-481b-8618-e575aaf7eff5'::UUID, 'SRB', 'Selective Reenlistment Bonus', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1dbdd03e-abfb-49aa-b7f7-233c35ec438c'::UUID, 'CASREP', 'critical equipment failure report', 'navy', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1e431fb6-2a59-4cf5-9561-ae0cbbcc8981'::UUID, 'Col (Colonel)', 'Executive Director / VP', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1e8ff850-be0f-46b7-bb41-a66cf281538c'::UUID, 'ISIC', 'Immediate Superior in Command', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1ee07a84-9e25-45a7-ba09-4e9210b65f08'::UUID, 'field grade', 'senior management', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1ee4abfd-bb48-40c8-addb-4efeff361bb3'::UUID, 'summary court martial', 'minor judicial proceeding / abbreviated military trial', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1f024397-ed9b-447a-9a12-8c8fbd5abad6'::UUID, 'pier', 'dock / facility entrance', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1f1969ce-11c0-4949-9a47-ba3d913e0477'::UUID, 'detailer', 'career counselor / HR placement specialist', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1f1bdf40-232c-4f74-b4b4-da540cc2eb58'::UUID, 'NMCI', 'Navy Marine Corps Intranet', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1f25bbe6-2ebf-4c49-b2a1-ffb05dacd312'::UUID, 'TAD', 'Temporary Additional Duty / temporary assignment', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1f2a7aab-6821-4455-ba44-72f22b682366'::UUID, 'line', 'operational / revenue-generating', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1f303189-a064-4f23-9191-a3490f825d48'::UUID, 'Cpl (Corporal)', 'Team Leader', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1f455bd7-c370-477d-81eb-602049a75c57'::UUID, 'reenlistment', 'contract renewal / retention', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1f7598c0-1ca2-4d16-b33e-8e1cb92922e3'::UUID, 'SARC', 'Sexual Assault Response Coordinator', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1f9a420a-14e1-4e09-843a-f1ad891a8940'::UUID, 'COMSEC', 'communications security', 'general', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1fa81744-afb6-4d8a-8067-5933d7f7bd84'::UUID, 'source handling', 'confidential informant management', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1fc21a03-fbe6-4faf-b27f-527327827f26'::UUID, 'FAP', 'Family Advocacy Program', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1fdc268c-0f93-48c9-ad57-930415a8723e'::UUID, 'CAPT (Captain)', 'Executive Director / VP', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('1ffdfe4f-5c3c-4b40-a077-e6ef6310721b'::UUID, 'in port', 'at home office / not traveling', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('20133a69-ce1d-41ce-96a2-cef25ca0f466'::UUID, 'collateral duty', 'additional responsibility / secondary assignment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('20e448eb-38f4-454e-991a-57fd239928aa'::UUID, 'AO', 'area of operations / assigned region', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('21083593-e9e6-4ac1-b214-31cbbc291d87'::UUID, 'messing', 'dining', 'navy', 'general', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2129cea0-77d5-4116-84e8-460f6add18f7'::UUID, 'S2', 'Intelligence section / analysis department', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('218b2cb3-6926-49d3-b4b0-67f6ebe655fc'::UUID, 'scuttlebutt', 'informal information / water cooler talk', 'navy', 'general', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('21dd60b7-d0de-45a8-bb87-a941667e406a'::UUID, 'LTJG (Lieutenant Junior Grade)', 'Manager / Project Lead', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('21e6f7c8-0e4b-420b-99e5-41800ed01234'::UUID, 'unit', 'team / department / organizational element', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('21f8e8ee-fd60-483f-adde-4542d2a1ca63'::UUID, 'blue jacket', 'junior enlisted / entry-level employee', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('22034b8e-8752-45ca-b1dd-4b2069b6f0e4'::UUID, 'QC', 'Quality Control', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('229160ba-4001-4ece-acf6-9453dfb581bb'::UUID, 'platoon', 'team of 30-50 employees', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2297a29a-394c-4567-a886-ec741db5f8f2'::UUID, 'fleet', 'enterprise operations unit', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('22a7af62-51cf-449a-802e-63342d4ac3cf'::UUID, 'BOS', 'base operating support / facility operations', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('22b29730-258b-44cc-93d0-5e974c365b79'::UUID, 'POV', 'privately owned vehicle', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('23433087-884f-428a-b5a0-0b5029f6cf66'::UUID, 'CDC', 'Career Development Course / professional development program', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2369fc12-00b9-4faf-bc0f-959af0434a87'::UUID, 'relieved', 'removed from position / terminated', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('236bfa27-a621-486b-b964-71462405d8bb'::UUID, 'SMSgt (Senior Master Sergeant)', 'Senior Manager', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2399e36e-41f5-4bf3-a50f-63982917e544'::UUID, 'cat shot', 'catapult launch / assisted takeoff', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('23e0a7f7-2917-4338-9fc6-23251ee7f5de'::UUID, 'CMC', 'Senior Enlisted Advisor', 'navy', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('23e0ab4d-2013-4d3a-b438-a906c3ce8471'::UUID, 'CPO', 'Chief Petty Officer', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('24207917-51e9-48c0-929f-fe48ea810078'::UUID, 'arms room', 'secure storage facility', 'army', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('245f71f9-4c77-4aee-a35b-8d0a8c9e3e2d'::UUID, 'COTR', 'contracting officer technical representative / contract monitor', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('245f9762-710e-4495-abcf-36541cd4470d'::UUID, 'ESR', 'enlisted service record / employment history file', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2467aff8-8325-4861-8fae-a9cd5b8a9326'::UUID, 'squad leader', 'team supervisor', 'general', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('24c42a28-62a2-4fde-9165-dc2c9c097f9f'::UUID, 'rear detachment', 'home office support / HQ staff', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('24def462-2583-4187-a5f4-c658ca4823ff'::UUID, 'custody', 'possession and accountability', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('24e52c58-662b-4b00-87d0-bf68d445f699'::UUID, 'UCMJ', 'Uniform Code of Military Justice / military legal code', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('25174502-6aa8-4e64-b5a5-e615a35577c5'::UUID, 'end strength', 'headcount / staffing level', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('254458b5-41ef-44ee-8e6a-1012e360ff61'::UUID, 'left seat/right seat', 'job shadowing / transition ride-along', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('25658c7e-63cd-4ab9-808f-7691da91f36c'::UUID, 'PT', 'physical training / fitness program', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('25720b97-a88a-40a1-b402-2b0eebb2a530'::UUID, 'effective date', 'start date', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('25d50918-306f-423a-aab5-7d9c92840742'::UUID, 'dependents', 'family members', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('25df3d0f-c777-49f3-8784-fd47d0a79386'::UUID, 'AOR', 'area of responsibility / managed territory', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('262e91ca-1dce-4820-bd44-105fa667f327'::UUID, 'TMO', 'Traffic Management Office / shipping coordinator', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('264eba2e-4e38-4d8c-aa60-ab974cbd47cb'::UUID, 'POC', 'point of contact', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('26530f0c-2bb8-4230-b2e3-9c0b713c6144'::UUID, 'ORM', 'operational risk management', 'general', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('265aed79-a346-480c-85b5-41e43ca1a28c'::UUID, 'chow', 'meals / cafeteria', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('266eee8c-1954-4280-b826-679ccf8df92b'::UUID, 'fill rate', 'staffing percentage / position occupancy rate', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('26afae26-bfe2-47e1-83e8-2ec1b8cddf4b'::UUID, 'CASEVAC', 'casualty evacuation / emergency patient transport', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('26bc4e4a-d4c6-478b-b12f-d7a750d42442'::UUID, 'ENS (Ensign)', 'Junior Manager / Associate', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('26d702cf-7bbe-4b0c-91dd-e482103410d5'::UUID, 'OCONUS', 'outside continental United States / overseas', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('27126c85-9796-4faa-ae0e-43aaa9a5d53d'::UUID, 'qualification', 'certification / credential', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('274df38b-fe9e-4bbe-8028-310b0bde7aa6'::UUID, 'on station', 'at assigned location / on post', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('278f99f2-9902-4731-833e-79bcce49d9b8'::UUID, 'latrine', 'restroom', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('279e6881-c761-4017-89ca-ab508fb0b3c2'::UUID, 'naval message', 'official communication / formal memo', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('27af2707-f2a0-463f-a203-a874a17950d8'::UUID, 'rated', 'qualified / certified', 'general', 'training', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('28024c2f-43d1-464e-898f-3a2f06ad2e8c'::UUID, 'CAGE code', 'commercial and government entity code / vendor identification number', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('280a285c-b652-472d-a0a4-83ca0e65eb09'::UUID, 'CSMP', 'maintenance backlog tracking', 'navy', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2812eb1d-ff88-43af-8608-7def8f714e71'::UUID, 'OPSEC', 'operational security / information security', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('28d6a73c-dca2-4289-be2e-82770cde5533'::UUID, 'IG', 'Inspector General / compliance auditor', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('29407711-56d2-41bc-9126-d1802f0f9c10'::UUID, 'watchstander', 'shift worker / on-call personnel', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2992eef4-cf16-442a-939c-b8b370e5d6bd'::UUID, 'pay grade', 'compensation level / salary band', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('299ec562-1c7e-41ac-9701-922bc6a0ff4e'::UUID, 'A1C (Airman First Class)', 'Staff Member', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('299ff82d-3e59-4a32-8b78-b74ae855deb7'::UUID, 'MOS qualified', 'professionally certified in specialty', 'army', 'training', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('29fd99aa-b705-438a-a24e-397feb1930b4'::UUID, '2LT (Second Lieutenant)', 'Junior Manager', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2a1b0f33-ab46-45ee-81f9-053d11a08f3e'::UUID, 'Capt (Captain)', 'Senior Manager', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2a1bcbca-980f-450f-8c1b-76c5ff20ea66'::UUID, 'regiment', 'business unit of 1,000-3,000 employees', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2a3057b0-183a-43ba-8500-7da1e70017db'::UUID, 'SSG (Staff Sergeant)', 'Senior Supervisor', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2a3f447a-3333-4186-90ef-738cf5f848f3'::UUID, 'primary duties', 'core responsibilities', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2a680b91-90f7-4da1-b80f-52537a66282e'::UUID, 'cross-deck', 'inter-departmental transfer / rotation', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2a7d4206-1f61-43f1-b649-073fa5270639'::UUID, 'field radio', 'portable communications equipment', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2ac04a9f-91a8-44a3-a69d-1b9fcda26f57'::UUID, 'FAR', 'Federal Acquisition Regulation / government procurement rules', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2ad429a8-56fe-4244-8285-d117a1a3d63b'::UUID, 'onboard strength', 'current staffing level', 'general', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2af1e032-f6a1-4b14-a65c-06fff39e5baa'::UUID, 'inter-service', 'cross-functional / inter-departmental', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2af2e136-d30e-4dd4-b46c-940c6bc5ef9b'::UUID, 'civil affairs', 'community engagement / civil-military liaison', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2bcfaabf-ff28-4ec7-a3ec-a1f568c60ae7'::UUID, 'precept', 'board guidance letter / selection criteria directive', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2bdc218d-1d49-4018-92be-5817cf1b813f'::UUID, 'INFOSEC', 'information security', 'general', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2be8e72d-5b96-41ae-b0d2-a852d71d422b'::UUID, 'passdown', 'shift handover / status briefing', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2be99c0d-9fc5-4b13-8f6d-a3db39fff8a0'::UUID, 'bridging', 'cross-training / transitional training', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2bf50ba8-7682-4223-b2b2-2ba6e5ed6f55'::UUID, 'near miss', 'close call / near-accident incident', 'safety', 'Safety', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2c364d24-af0f-46ed-815e-7334ce6e1983'::UUID, 'MWR', 'Employee Wellness and Recreation Program', 'navy', 'administration', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2c8484ba-b68e-4bd3-a792-e9a9cd1d9f68'::UUID, 'dependents', 'family members', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2cb239c1-7a2e-4224-b601-6efd0317a667'::UUID, 'ladder', 'stairs / career progression path', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2cb3ad0e-6e4e-46ba-a4f8-43e8bb973d10'::UUID, 'barracks', 'company housing / dormitory', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2cd76a86-0abf-4cac-b4e2-72fc1279fc4a'::UUID, 'SOC', 'security operations center / cybersecurity monitoring center', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2d1c827f-3591-45e7-a791-b1eec2b91bb5'::UUID, 'page 4', 'service history and qualifications record', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2d3091d4-82d6-4b47-94be-940306e806e5'::UUID, 'EOD', 'Explosive Ordnance Disposal / bomb disposal', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2d36f82c-5658-4d71-99d3-76a33a8ad6c8'::UUID, 'blue team', 'defensive security team', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2d75775a-e710-43be-bfef-6d8f8db5dd6a'::UUID, 'LT (Lieutenant)', 'Senior Manager / Department Head', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2d7b7ea8-b4f9-4845-bcaf-c0d910316806'::UUID, 'head', 'restroom', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2dc8cb06-0d65-4830-940d-306ca0350f94'::UUID, 'firm fixed price', 'set-price contract / non-adjustable cost agreement', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2e52f328-82c3-4c8e-b963-6529df28c307'::UUID, 'homeport', 'home office / primary work location', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2e559b35-6059-48a7-b9a4-009c9acce54c'::UUID, 'IPR', 'in-progress review / status update meeting', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2e5b5247-60c3-4c95-9851-5fb18922a99c'::UUID, 'preventive maintenance', 'scheduled maintenance / proactive equipment care', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2e67ce07-fb96-43d5-b9eb-dfcb7973be36'::UUID, 'deploy', 'travel for work / field assignment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2f2036ca-71bc-4281-8c87-3e79f799fb51'::UUID, 'garrison', 'permanent facility / home office', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2f3db117-2fea-42e4-885c-76548ce6f9ce'::UUID, 'uniform', 'dress code / professional attire', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2f5691ce-15cf-47b0-a256-285100606035'::UUID, 'SGT (Sergeant)', 'Team Lead / Supervisor', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2f7391dc-0408-491a-868f-77eefd943ada'::UUID, 'superior', 'supervisor / manager', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2f8f530a-0942-4ddb-abf6-79f0ea68fb8b'::UUID, 'IDIQ', 'indefinite delivery, indefinite quantity / flexible-scope contract', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2f9c7332-ba97-49d6-826a-fb30ffcb9d59'::UUID, 'homeport', 'home office / primary work location', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2fcdc746-d40c-4dcb-9e5b-273c3753a6cb'::UUID, 'maintenance', 'equipment upkeep / preventive care', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('2ff686ab-8ff8-4f4d-af93-598b080b5a9e'::UUID, 'organizational level maintenance', 'unit-level routine maintenance', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('303733b1-b74d-4f9f-9c7e-c773e9b0fc12'::UUID, 'DRMO', 'Defense Reutilization and Marketing Office / surplus disposal', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('30380fe3-4dd7-40ab-82b2-0639ac97f926'::UUID, 'service record', 'personnel file / employee record', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3039d89c-7712-4955-af1b-a8fc04f2cd70'::UUID, 'SATCOM', 'satellite communications', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3055a139-37ed-4889-9816-495ee3167bc9'::UUID, 'SIEM', 'security information and event management / security log analysis platform', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('305d0482-e8b2-40fa-9972-b8c193156eff'::UUID, 'DMZ', 'demilitarized zone / network buffer zone', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3076a322-9eea-450c-a608-61c702452e4a'::UUID, 'milestone', 'project checkpoint / achievement marker', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('307fd309-ba7b-43a1-b781-2a1db1dbae3a'::UUID, 'retention', 'employee retention / reenlistment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('308394c0-edc2-4a0e-9431-38ed9c755443'::UUID, 'SN (Seaman)', 'Staff Member', 'uscg', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('30874d30-148c-407a-8df5-5be4c3b1ca7d'::UUID, 'HM', 'Hospital Corpsman / medical technician', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('30e7c1ee-5808-46e0-a6fe-90930ea66d61'::UUID, 'CMDCM', 'Senior Enlisted Advisor', 'navy', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('31716c76-1b51-4769-852b-aacdc069af8b'::UUID, 'CDRL', 'contract data requirements list / required deliverables schedule', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3179cca6-17a6-4b43-b5b1-f4e553e36379'::UUID, 'ELINT', 'electronic intelligence / radar and signal analysis', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3192f652-a007-4875-834a-bac617065b45'::UUID, 'manning', 'staffing / headcount', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3218edd0-65fb-4280-9969-59d640b9fe3c'::UUID, 'Maj (Major)', 'Director', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('321d11a2-8957-4a30-9bc1-4f4bf5ed664e'::UUID, 'Sgt (Sergeant)', 'Team Lead / Supervisor', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('32c6dc8f-5553-4470-9b4e-e96f28e90b2e'::UUID, 'ADCON', 'administrative control', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('32e4dc06-622d-4270-bb55-83ac6d8f91d0'::UUID, 'formation', 'coordinated group movement', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3308868d-61de-43bb-8d7b-748789c526f9'::UUID, '1stLt (First Lieutenant)', 'Manager', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('330fb7f6-51dd-4395-a5a9-ef8a5668b9d2'::UUID, 'say again', 'please repeat', 'general', 'communication', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('33254c61-da24-4c46-8e02-9dc959bc7d37'::UUID, 'ROE', 'Rules of Engagement / operational guidelines', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('337bfaff-e67e-4831-8977-6f7b64c3f966'::UUID, 'GCPC', 'government purchase card', 'general', 'logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('33a296f2-cc9c-4d0b-b5e0-351c216117d1'::UUID, 'junior enlisted', 'entry-level staff', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('33cfebbc-61e6-474c-9e9b-2a3599a0a7d3'::UUID, '1stSgt (First Sergeant)', 'Operations Manager', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('33e20ad6-9d21-4124-9c70-101cff885e6c'::UUID, 'DCO', 'defensive cyber operations / network defense operations', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('340df957-a64d-44c7-a79a-b3b8bba460de'::UUID, 'NSN', 'National Stock Number / part number', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3420e672-8230-448f-8b3e-aff8460ef976'::UUID, 'seniority', 'time in position / tenure', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('344fa876-65fd-468f-9f75-7c8f818506c1'::UUID, 'DFARS', 'Defense Federal Acquisition Regulation Supplement', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('348496f6-0969-4956-bd45-ab147df510d1'::UUID, 'latrine', 'restroom', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('34880773-c49d-44ee-8507-a149217635e6'::UUID, 'NCOES', 'NCO professional development education', 'army', 'training', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3496583d-5445-4897-be77-e5e5b6f2ad98'::UUID, 'order', 'directive / instruction / policy', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('349d029e-fedd-46a5-9b02-a1ac89415637'::UUID, 'hot wash', 'immediate post-event discussion', 'general', 'communication', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('34cb552c-3c40-443e-9625-2291b9929661'::UUID, 'Maj (Major)', 'Director', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('34d5f11d-1395-4d74-a54f-abb47a248441'::UUID, 'command climate', 'organizational culture / work environment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('34de781e-aaa3-4bb0-b2a0-17f4e213156e'::UUID, 'MOS', 'job specialty code', 'army', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('353c16a7-dc1d-4f63-a553-2a68eb419841'::UUID, 'watch floor', '24/7 operations center / monitoring center', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('35419dc9-8196-4a74-83df-01e4423cfdd0'::UUID, 'fleet', 'operational units / field operations', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('359d7967-0227-4218-b6c8-f50f4cd9da66'::UUID, 'horizontal construction', 'road and earthwork construction', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('35da16a6-5b44-4dac-8b81-3f79a1931bfa'::UUID, 'deployment', 'extended business travel / overseas assignment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('361b6f28-a0aa-4385-aad1-8804d8654858'::UUID, 'ACAS', 'automated compliance and security scanning tool', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('362bc504-3ad5-44db-ae3d-4f951a54a2ef'::UUID, 'PO3 (Petty Officer Third Class)', 'Team Member / Technician', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('369fefbe-e48f-487a-8407-ca85067a8663'::UUID, 'grounding', 'equipment removed from service / operational suspension', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('372a2b43-e323-4675-91f1-a506fde7ba46'::UUID, 'billets authorized', 'headcount / FTE positions', 'general', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('374eecff-db3f-4448-b4b7-0df430f5272f'::UUID, 'CPL (Corporal)', 'Team Leader', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('377ea1c6-d47b-4a6a-8d15-5ccaca92cbc7'::UUID, 'flag officer', 'executive / C-suite', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('37849c8f-1c46-49ea-bf9c-dc18a4fa971d'::UUID, 'DLA', 'Defense Logistics Agency', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('37cfb073-7e89-459d-be85-a4b1682d2831'::UUID, 'billet', 'position', 'navy', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('37f3bc05-4de2-4a99-a158-efd534c09671'::UUID, 'purple team', 'integrated security assessment team', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('38173938-c86b-4818-b843-2f03a214f25f'::UUID, 'formation', 'team meeting / all-hands assembly', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3856faaa-a5c3-48da-90cb-a8a7516a01dc'::UUID, 'HUMINT', 'human intelligence / interpersonal information gathering', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('385c92d6-318a-44b7-b3fd-23111b5a93b0'::UUID, 'high speed', 'high performer / top talent', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('38b40fe6-3e8c-4cb7-b618-1b3f080bbd36'::UUID, 'CAPT (Captain)', 'Executive Director / VP', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('38c0ada8-e627-4467-9db3-35b52fb9e13b'::UUID, 'SMSgt', 'senior master sergeant / director', 'usaf', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('38f1f3f9-b5c2-4f73-845a-7f5042591195'::UUID, 'uniform', 'dress code / professional attire', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('390d14ca-7735-4239-b982-128743d51299'::UUID, 'Col (Colonel)', 'Executive Director / VP', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('391676a6-f85f-483b-a19b-9d064066ee99'::UUID, 'travel claim', 'expense report / travel reimbursement request', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('392ddaf1-ec03-4934-8b02-c7e60d5eb8a6'::UUID, 'COB', 'close of business', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3934898b-89d5-4378-abc6-b44627c7b1d9'::UUID, 'trained', 'developed and instructed', 'general', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('39a21862-e48e-4533-a110-2365db4dd7df'::UUID, 'EW systems', 'electronic warfare / signals systems', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('39a2c825-6d05-4f7e-9b5f-748f87ccdd7c'::UUID, 'PO2 (Petty Officer Second Class)', 'Senior Technician / Team Lead', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('39abef56-4a7b-40c1-b345-6e361498d8b4'::UUID, 'SECDEF', 'Secretary of Defense', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('39dc5c44-609b-4c71-a684-4cfce314c4a0'::UUID, 'separation', 'termination / end of employment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3a0a91bc-87b5-41bc-824e-1e5126214a4c'::UUID, 'JTR', 'Joint Travel Regulations', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3a15130a-3137-4e8e-b7e4-bfd00625fffe'::UUID, 'reserve', 'part-time / on-call', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3a356138-5350-416e-bb49-6486a51e8484'::UUID, 'boots on ground', 'on-site personnel / field staff', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3a75e081-45e9-4deb-b1c7-3298b24b8be9'::UUID, '2d Lt (Second Lieutenant)', 'Junior Manager', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3aae83d1-15e8-4b98-b367-9993a5ab33a2'::UUID, 'Amn (Airman)', 'Junior Staff Member', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3ae09d69-8904-4965-b147-3a3f04755b37'::UUID, 'stovepipe', 'siloed / working independently without coordination', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3ae4159f-90b3-4ed5-98df-d353dd46e647'::UUID, 'PFT', 'Physical Fitness Test', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3af235d7-59d5-40b4-b2b0-cedfd0d30b3d'::UUID, 'CSEL', 'Senior Enlisted Leader Program', 'navy', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3afc2906-0681-43f2-a2dd-7f3c6dedb322'::UUID, 'SOP', 'standard operating procedure', 'general', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3b0bbf49-64cc-4b41-b3a4-d54209570339'::UUID, 'SgtMaj (Sergeant Major)', 'Senior Director', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3b98189f-9892-460c-b543-ec28029387df'::UUID, 'FOD', 'foreign object debris / workplace debris hazard', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3c5c301e-f758-4f8e-a768-6a0f13dfa394'::UUID, 'lifer', 'career employee / long-term staff', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3ca50ed1-cbcb-4dd5-8859-9c1b9f84dbe0'::UUID, 'broadening assignment', 'rotational assignment / developmental role', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3cc68b9b-5382-4ab5-a2df-36f2440ae14a'::UUID, 'DUSTWUN', 'duty status whereabouts unknown', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3ccc2c50-889f-4a62-91ca-444313b264ae'::UUID, '1stSgt (First Sergeant)', 'Operations Manager', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3cd360e0-4674-4849-becb-4e6e5d7032eb'::UUID, 'INSURV', 'Board of Inspection and Survey', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3cd65d6e-e9a0-42fd-aa6b-f3418c54e882'::UUID, 'regiment', 'large organizational unit', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3d52808d-5026-4c39-8397-a6f7b6fd98d7'::UUID, 'sub-hand receipt', 'delegated property accountability', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3d977e0d-7e70-41a9-a1ff-65ccb5dd37e9'::UUID, 'THA', 'traffic hazard analysis / workplace hazard assessment', 'safety', 'Safety', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3db76df1-a012-463f-9b4f-e452263d7669'::UUID, 'walk-in', 'unsolicited source / volunteer informant', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3e175b45-98e1-49a2-9b0e-d54fd56e62b4'::UUID, 'corps', 'enterprise division of 20,000-45,000 employees', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3e46974b-2c82-4778-a1ef-369dae6972be'::UUID, 'POV', 'privately owned vehicle', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3e60f3f9-b46b-480c-9dd8-a0748ab050de'::UUID, 'TDY', 'Temporary Duty / business travel', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3e653fbb-fa08-43c6-a5db-15930029d99f'::UUID, 'damage control equipment', 'emergency response equipment / fire suppression systems', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3ea55336-fa66-43bc-a652-5517b2e43507'::UUID, 'NAVADMIN', 'organizational directive', 'navy', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3eac1b1e-3c78-46d7-8e39-bc7ccc3cc520'::UUID, 'target development', 'subject research and prioritization', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3eacc62d-f8b4-4092-8133-a91b97a0910e'::UUID, 'GMT', 'mandatory compliance training', 'navy', 'training', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3eaeefab-4caf-4981-8752-5479724077c3'::UUID, 'space', 'room / area / workspace', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3ec90dfe-2358-4df6-98ad-86def2fe98a9'::UUID, 'line of duty', 'work-related determination / on-duty status finding', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3edf38fc-b933-4efe-a13a-a681416088bd'::UUID, 'expendable', 'single-use / consumable', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3f0a579c-a301-40a3-ab12-dee49e013d3e'::UUID, 'CAC', 'Common Access Card / security credential', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3f340ffc-b151-4385-8951-120a81f1f632'::UUID, 'high speed', 'high performer / top talent', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3f3846ca-5ed2-48e3-8970-43926c397f79'::UUID, 'JAG', 'Judge Advocate General / legal department', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3f47a26e-2fc3-408a-a8f5-7a9e12d46469'::UUID, 'stand down', 'pause operations / rest period', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3f5f247c-4f66-4c70-9d17-5f877aacf707'::UUID, 'DCA', 'damage control assistant / safety manager', 'navy', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3f9a665d-4e7a-42bc-8f8d-ce956fdd564d'::UUID, 'permanent party', 'permanent staff', 'general', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3fb18baa-ccdb-43ba-9caa-5c7f298e7906'::UUID, 'CMR', 'Consolidated Memorandum Receipt / inventory document', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3fbf62af-ebd6-4bbb-888a-b014cfc980ea'::UUID, 'Pvt (Private)', 'Entry-Level Staff', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3fca162b-cc3a-4753-ae0d-1fda4bd43313'::UUID, 'SCIF', 'Sensitive Compartmented Information Facility / secure facility', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3fe65337-7609-489a-a99b-aeaca898b4b0'::UUID, 'hatch', 'door', 'navy', 'general', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('3ff000ba-2334-459f-8bbe-d58bf51a4976'::UUID, 'component', 'division / branch / department', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4021d1c6-21b7-496e-a8fb-052aeb272ec8'::UUID, 'WIA', 'wounded in action', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4044ae3a-4ef6-4b0c-b551-b4fd64e4691b'::UUID, 'WO', 'Warrant Officer / technical expert', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('40e31fe7-0254-4c0e-b49b-b4a260bf2ca6'::UUID, 'COMINT', 'communications intelligence / intercepted communications analysis', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('411958fa-a16e-4874-aa53-2a7e250bfbde'::UUID, 'HAYSTACK', 'logistics information system / parts identification database', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('412f01f0-5513-4887-9653-080ecd1e21cb'::UUID, 'rack', 'bed / bunk', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('41ccb7db-826f-4eaa-83a0-1763309954ea'::UUID, 'independent government estimate', 'internal cost projection', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('41d12b82-3bdc-4fb8-833c-b1a6fc49ffe5'::UUID, 'COL (Colonel)', 'Executive Director / VP', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('41eaffa3-8703-4db6-9ec2-213974123f8a'::UUID, 'TS/SCI', 'Top Secret/SCI security clearance', 'general', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4223f176-cfd5-4fc6-a950-7525f1c006f4'::UUID, 'threat hunting', 'proactive threat detection / advanced threat search', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('423ce2db-ea9d-47c3-a0e3-f5c57e297b3f'::UUID, 'SERE', 'survival, evasion, resistance, escape / captivity survival training', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('42686fac-6ff2-4ad7-be6e-9052e951c3c4'::UUID, 'BRAC', 'Base Realignment and Closure', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4286bb89-4ed8-4dfd-ac33-b75b0c80be33'::UUID, 'headquarters', 'corporate office / main office', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('42ef0a8d-276f-4b6e-8499-5912697ae5a6'::UUID, 'pre-brief', 'pre-event planning meeting', 'general', 'communication', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4317404c-4503-43d6-86de-c39008b0ca65'::UUID, 'quarters', 'housing / living space', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('434504a1-4dbe-4c7e-b5c8-52560ff38843'::UUID, 'joint duty', 'inter-agency assignment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('43499e06-67a1-4697-8141-6b3335c68511'::UUID, 'AO', 'area of operations / assigned region', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4357b1d9-ca7a-43ec-83ec-c58ab0ab31fe'::UUID, 'blue team', 'friendly/defensive team', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('435d1035-b4d6-4816-b9c2-b8ee44fde32f'::UUID, 'muster report', 'attendance report', 'navy', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('43868dd0-0b29-4b76-bc86-6434e37a734a'::UUID, 'ROTC', 'Reserve Officers'' Training Corps', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4408cdd0-12ba-4b5d-b7b7-afd315565ba8'::UUID, 'service record', 'personnel file / employee record', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('448779b1-664d-4cd6-b5ca-40e476ce4018'::UUID, 'SSgt (Staff Sergeant)', 'Senior Supervisor', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('449959d2-b7a0-4fb2-8d04-2e3fbcfb038f'::UUID, 'red team', 'offensive security testing team', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('44bf5fa8-c3e2-4da1-a7c2-547dae5c59c8'::UUID, 'SATCOM', 'satellite communications / long-range wireless connectivity', 'communications', 'Communications', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('452749ae-ecca-42d0-817a-d2a584510205'::UUID, 'CBRN equipment', 'hazardous materials handling equipment', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('452f824d-bba0-4a66-8ad4-3d5e20f98b8d'::UUID, 'sortie', 'single flight mission / individual flight operation', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('457be135-407f-4d68-9621-5a1d202c4595'::UUID, 'IRR', 'Individual Ready Reserve', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4591b63d-3838-4ae8-ba1d-e7d350c072cb'::UUID, 'gear adrift', 'unsecured/disorganized equipment', 'navy', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4598f0b5-157a-4d7c-9b22-2a6df2271e02'::UUID, 'tradecraft', 'operational techniques / professional methodology', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('45f9b451-a188-424f-9f17-85de86d35e68'::UUID, 'COP', 'combat outpost / remote site', 'army', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('46be5e84-f945-49f9-91eb-43ea4395a042'::UUID, 'SEAL', 'Sea, Air, and Land operator / Navy special operator', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('46d94ca0-2860-4db8-9846-8232e54d3273'::UUID, 'ASL', 'authorized stockage list / approved inventory catalog', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('474d53b1-0dd7-4e44-8ae3-b6437bf21959'::UUID, 'PV2 (Private Second Class)', 'Junior Staff Member', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('476fadce-33b2-48ab-a1d0-3f952cffab1e'::UUID, 'S6', 'Communications section / IT department', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4777478e-df71-4825-b225-2249d12e2b1f'::UUID, 'intrusion detection', 'unauthorized access monitoring', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('47a84ae5-ecd8-4460-97cd-0046f3736142'::UUID, 'TPOC', 'technical point of contact / subject matter liaison', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('47b8d20b-ec85-43bf-8dad-45bc730fa7c5'::UUID, 'personnel recovery', 'search and rescue / missing person recovery', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('47e8b0d5-0cf2-448f-905d-ae6613946ff6'::UUID, 'recall', 'emergency callback / urgent summons', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('482516e1-b3d5-473b-9087-5ec1c1773f84'::UUID, 'proficiency', 'skill level / competency', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('485da964-5f6d-48bd-bc44-aba00f798965'::UUID, 'fit for duty', 'medically cleared for work', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('48606b65-dd83-4921-8667-96d41254ce1a'::UUID, 'field fortification', 'defensive structure construction', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4873ac7c-87c8-46c7-a3f0-402ce39f91c7'::UUID, 'SFC (Sergeant First Class)', 'Manager / Operations Supervisor', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('48954829-a32b-4f60-a279-9cc301866a59'::UUID, 'SOCOM', 'Special Operations Command / elite forces headquarters', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('48a65e26-7b79-428f-81c8-e89455ae85e5'::UUID, 'COB', 'chief of the boat / senior enlisted advisor', 'navy', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('491fd7d2-979f-4a30-b1ff-1643ed6a355f'::UUID, 'flight chief', 'section manager', 'usaf', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4947a268-192a-4a4f-88a5-c1fd21fdff32'::UUID, 'duty', 'shift / on-call responsibility', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('497f09df-792d-4244-89c0-00ba0c4bc8a0'::UUID, 'forensics', 'digital investigation / evidence analysis', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('498e1c57-4de6-4f22-957b-80434d329dcc'::UUID, 'TECHINT', 'technical intelligence / technology assessment', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('49b0dcb8-704c-4b28-8260-b7a34901bf6d'::UUID, 'JTAC', 'joint terminal attack controller / air strike director', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('49cd2250-1c07-4a19-89fa-e4f4a58fa910'::UUID, 'broadening assignment', 'rotational assignment / developmental role', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('49e5c734-d41d-47f2-aedb-4e9ac5e353ac'::UUID, 'information operations', 'information warfare / influence campaign management', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4a0b2571-67c2-4293-8ada-7778f3f1ca03'::UUID, 'UIC', 'Unit Identification Code', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4a18beb7-842c-4f39-89bc-ffca7c871bfc'::UUID, 'theater', 'region / operational area', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4a1f53ce-878e-4175-b16c-6747f022b19e'::UUID, 'JQR', 'Job Qualification Requirements', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4a3667ac-f937-4fbe-8027-68604936a682'::UUID, 'shelf life', 'expiration period / usable lifespan', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4a55dd1c-4d7c-44de-a58d-63d02ef30ccd'::UUID, 'CONUS', 'continental United States / domestic', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4a7b87c0-5f84-4c7d-b8fa-b013ad679bfa'::UUID, 'PCS', 'organizational transfer', 'general', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4b07cfa4-fb9e-4fe6-aa03-5896fe425ab9'::UUID, 'MIA', 'missing in action', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4b08430e-e933-4768-b9ad-af593d6da680'::UUID, 'PT', 'physical fitness program', 'general', 'training', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4b3ec5e4-85fa-4d1f-b841-c85087490efb'::UUID, 'XO', 'Executive Officer / deputy director / second-in-command', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4b57a6a4-4f56-421e-89f8-32ff7b303920'::UUID, 'LCPO', 'Lead Chief Petty Officer / department supervisor', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4b8da915-e0c1-4a73-8a1c-9f9792de7e64'::UUID, 'medical hold', 'extended medical observation / medical administrative hold', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4b976597-ca05-42df-bab1-586ce3cfc275'::UUID, 'bridging', 'cross-training / transitional training', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4ba4f33f-280f-4fea-98dc-039d52f2d69e'::UUID, 'SCPO (Senior Chief Petty Officer)', 'Senior Manager', 'uscg', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4bc82b80-3005-42a6-8742-7127cad06ff7'::UUID, 'FITREP', 'fitness report / officer performance review', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4bd206d9-1c9b-4dc4-9fac-ddd14d0382e2'::UUID, 'high-speed', 'high performer / exceptional employee', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4bd251d8-e718-4d98-ab0b-fd3fc188bad8'::UUID, 'FID', 'foreign internal defense / partner nation military advising', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4c2ec36e-6779-4dc9-8db7-cb7e45fd082e'::UUID, 'tech school', 'technical training school', 'usaf', 'training', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4c4ced5b-8f51-424a-955b-32be9ceb6d2e'::UUID, 'space', 'room / area / workspace', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4c66b11c-31cf-4929-b8b9-be055f4c106e'::UUID, 'shore duty', 'office-based assignment / non-deployable role', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4c81aa76-5216-4a05-975c-aafbb8945f12'::UUID, 'AT', 'annual training', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4cd952cf-6c10-43bd-ae30-dc76a1b3a600'::UUID, 'MARSOC', 'Marine Forces Special Operations Command', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4ce8dfb7-e6de-4b05-bfa6-25179eb0f48a'::UUID, 'MCO', 'Marine Corps Order / policy directive', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4d24c6e1-abcc-4eab-94e6-f99c9187e6a4'::UUID, 'NSN', 'National Stock Number / part number', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4d30ea20-f566-4355-89db-02d26980e1ab'::UUID, 'starboard', 'right side', 'navy', 'general', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4d48dccb-a374-4478-90d2-f468a1b72bc0'::UUID, 'inport', 'at home location', 'navy', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4db330cb-1377-4489-9f49-8366b78a35f8'::UUID, 'power of attorney', 'legal authorization document', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4de54f31-54d0-4426-bacb-a5dd7dd342e8'::UUID, 'AFI', 'policy instruction', 'usaf', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4de638fe-6114-4819-b90c-9a0238f23ad2'::UUID, 'Cpl (Corporal)', 'Team Leader', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4e5cfde5-0782-4238-b03a-cf6c1b650fe5'::UUID, 'bolter', 'missed approach / failed landing attempt', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4ea38ad5-250e-4506-8934-c09bbed5de09'::UUID, 'force protection', 'facility security / workplace safety', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4f189398-826d-4d43-9d21-8e32c7f06359'::UUID, 'branch manager', 'career assignment officer', 'army', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4f2415bf-db7b-45b3-ac54-41a96eeb8085'::UUID, 'duty', 'shift / on-call responsibility', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4f2783e0-d464-410b-b2e4-fec2271a7549'::UUID, 'tracking', 'understood / following along', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4f51416b-2fe8-4861-b2de-6f4134ec4a8b'::UUID, 'material condition', 'equipment status / asset readiness', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4fa17b1a-cf59-4384-bf8d-54bc72d8a528'::UUID, 'end strength', 'headcount / staffing level', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4fbf2a97-39d4-42d5-b57f-d942373b95d6'::UUID, 'CMEO', 'equal opportunity program manager', 'navy', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('4fe54c07-32d0-4289-a4ae-bf43444d1629'::UUID, 'SECNAV', 'Secretary of the Navy', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('500867c6-4d9d-4316-af74-87bd0f29f21b'::UUID, '3M', 'Maintenance Management Program', 'navy', 'technical', 'Managed 3M program for 200+ equipment items', 'Managed preventive maintenance program for 200+ equipment items valued at $5M')
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('502cb5c5-9eae-4627-936c-d522c02c865d'::UUID, '1stLt (First Lieutenant)', 'Manager', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('50414b6e-3467-48c0-9834-2e99f2226ef4'::UUID, 'strike group', 'combined operations task force', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('504e7d34-8293-4343-a283-73d63d8a220b'::UUID, 'Capt (Captain)', 'Senior Manager', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('50902295-102b-45e2-817b-e71cda91fdda'::UUID, 'PQS', 'Personnel Qualification Standards / certification requirements', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('50938b33-16a7-43ab-b49a-43ee0bd187f1'::UUID, 'workup', 'preparation / training cycle', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('512a8e83-890b-4e64-a636-b05330f21d14'::UUID, 'TTPs', 'tactics techniques and procedures / best practices', 'general', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('51c019df-c1fe-4ed5-8323-9ed268ac4471'::UUID, 'FRG', 'Family Readiness Group', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('51df6e91-a9dc-4389-ac09-ca7080d80068'::UUID, 'non-expendable', 'accountable property / tracked assets', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5209b1b8-5648-45b6-bdc6-221bfeafe04b'::UUID, 'NAF', 'Non-Appropriated Fund', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('524225df-4884-418f-994c-4e8b78c060ed'::UUID, 'ashore', 'land-based / office environment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('525e9f69-914e-49dd-80b4-f8e67a9378b1'::UUID, 'endstate', 'desired outcome / final objective', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('527c839b-78ba-4ef6-8266-5df0dd8b3edd'::UUID, 'taps', 'end of day / lights out', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5297f220-5acb-45ee-b23d-8272171e2e77'::UUID, 'moored', 'docked / stationary', 'navy', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('52bc526d-b31f-46f5-8055-ca5d482fb7c3'::UUID, 'GCSS', 'Global Combat Support System', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('52bf15e9-2bf3-40a9-b095-04d9019f0519'::UUID, 'post', 'position / station / assignment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('531980c0-f438-4759-b2c9-ab0bb9422661'::UUID, 'SIQ', 'Sick in Quarters / medical leave', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5340efc5-0989-41f0-80c7-45c1d3a5e575'::UUID, 'rifle range', 'training facility / shooting range', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('538396fb-c299-486a-8fd9-98ed97470efd'::UUID, 'JIOC', 'joint intelligence operations center / combined analysis facility', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('53942512-fd1a-4d0c-ba75-c2b71ff136c5'::UUID, 'SOY', 'Employee of the Year', 'navy', 'awards', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5445c1b8-e931-440a-9b43-c003b80bc223'::UUID, 'port call', 'scheduled stop / client visit', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('548fea2c-655c-4e26-852d-c4a1ee2c255f'::UUID, 'debrief', 'post-event review / lessons learned', 'general', 'communication', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('54dd8557-dccd-46b8-ad0b-caa11695fa70'::UUID, 'cover down', 'take responsibility for / fill the gap', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('553335f5-a653-4ba3-8a93-1dbdf86b63fd'::UUID, 'SNCO', 'Staff Non-Commissioned Officer / senior supervisor', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('55547560-856d-447d-aed1-49a5a39afe3f'::UUID, 'MCPO (Master Chief Petty Officer)', 'Director / Senior Director', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('556d736e-d42d-4c67-8008-8f9f3054ac4b'::UUID, 'separation', 'termination / end of employment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('55aef153-7091-4292-a42b-f2e9ee3f8477'::UUID, 'PO2 (Petty Officer Second Class)', 'Senior Technician / Team Lead', 'uscg', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('55b7b082-714f-4b3b-bf1b-34e871566007'::UUID, 'INSURV', 'Major Compliance Inspection', 'navy', 'assessment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('55c31f19-8e96-4ba5-b665-dc6fc3c44d92'::UUID, 'surge', 'temporary increase in effort / rapid scale-up', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('55dd7e63-29f6-4d20-8642-b7cb819dc256'::UUID, 'battle rhythm', 'operational cadence / recurring schedule', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('55e007fc-1e40-41e4-85a0-8c82b9d57528'::UUID, 'retrograde', 'return shipment / reverse logistics', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('56191cb2-0a8d-4b80-acf0-3f5751791fa4'::UUID, 'DCAS', 'Defense Contract Audit Services', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('564616a3-ae01-478a-87ed-e0e619108591'::UUID, 'SME', 'subject matter expert', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('56cae642-8f15-4631-8a4d-4761cd72312e'::UUID, 'NCOER', 'NCO Evaluation Report / performance review', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('56da4ab8-d406-4449-a621-51a3bc71b225'::UUID, 'gapped billet', 'vacant position', 'general', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5784a32d-031c-403e-9936-8bf70adac173'::UUID, 'sand table', 'tabletop exercise / scenario walkthrough', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('57f3d0d0-1b95-419b-93f0-03964f65f251'::UUID, 'task order', 'project-specific work authorization', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('58272387-876a-4651-b722-dc5b65c4a10a'::UUID, 'terminal guidance', 'precision targeting direction', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('586223ae-4261-483b-ac43-ba5efdd35bf8'::UUID, 'NVG', 'night vision equipment / low-light optics', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('58696c79-0385-4a13-9b8e-2224278ff15e'::UUID, 'FITREP', 'fitness report / officer performance review', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5894fec0-8514-4ebb-b09f-2be4393f467d'::UUID, 'EVAL', 'performance evaluation / annual review', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('58b7ea65-39e8-4961-897a-216de2262662'::UUID, 'GMT', 'General Military Training / annual training requirements', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('58c55f88-78a0-45bd-aa4d-dd6f79a6a74b'::UUID, 'statutory board', 'legally mandated review panel', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('590833d2-372e-4311-98ee-e74ef4a1ddda'::UUID, 'SSE', 'sensitive site exploitation / evidence collection at target site', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5968115a-6416-4b16-b005-7a4dbd39fdec'::UUID, 'sentencing', 'penalty determination / punishment assignment', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('596e1d58-bb42-4de1-b97d-fc7e440c452e'::UUID, 'recall', 'emergency call-back of all personnel', 'general', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('598526e8-d02d-4b44-a432-599c38a84d5e'::UUID, '2ndLt (Second Lieutenant)', 'Junior Manager', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('59959647-9b12-4263-8955-480f69caf342'::UUID, 'award fee', 'performance incentive payment', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('59b15e5a-01f1-4fda-ae2f-25df71abfd14'::UUID, 'squad', 'team of 8-13 employees', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('59b5a5e6-6206-433d-9fce-bb823b939432'::UUID, 'OOD', 'Officer of the Deck / watch supervisor', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('59efa144-d501-45e6-86e2-ef0ef60d1465'::UUID, 'requisition', 'procurement request', 'general', 'logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('59f5e2ca-29f3-425d-878b-5559128b46ca'::UUID, 'requisition', 'supply request / purchase order', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5a313c0d-ef55-44e1-94cc-c16fd329739c'::UUID, 'litter bearer', 'patient stretcher carrier / patient transport assistant', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5a4073eb-2834-45a0-a46f-bbb486f5b504'::UUID, 'CHENG', 'chief engineer / director of engineering', 'navy', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5ac45fe5-88d3-41fc-b324-06a912de4cfc'::UUID, 'mid-watch', 'overnight shift / graveyard shift', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5b1fc796-0f41-47b1-aba7-76bcd99218f1'::UUID, 'DD254', 'security classification specification', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5b41e256-3f75-455c-842a-fe6c5e6537ff'::UUID, 'tour', 'assignment period / rotation', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5b45336e-4180-45f2-8ab3-f5b5f4e4f759'::UUID, 'PTA', 'practical training assessment', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5b555067-4b94-4512-bef1-11fdcd6a067b'::UUID, 'TRICARE', 'military healthcare system', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5b920b6e-30d1-42df-a9fb-c4361115f53d'::UUID, 'COR', 'Contracting Officer Representative', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5ba75e01-3775-486d-b517-2d7c997b2e85'::UUID, 'cross-domain solution', 'secure data transfer between networks', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5badd14e-c7ff-41be-bf6a-9588773ad9b5'::UUID, 'cross-rate', 'career change / job reclassification', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5baf7f78-0e4b-406b-a164-e1013bef4305'::UUID, 'HQ', 'headquarters / corporate office', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5bb64007-85db-4ba9-8e6b-a1770b75d232'::UUID, 'route clearance', 'road hazard removal / path clearing operations', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5bf0db2b-e6d0-41ef-ac1b-09c38fa8ccd6'::UUID, 'PFT', 'Physical Fitness Test', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5c11b28c-b1f7-432f-afa9-887a8ab6cb0c'::UUID, 'supervised', 'managed', 'general', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5c1e792d-e47d-42dc-8b0e-b530aee49ef8'::UUID, 'kinetic', 'direct action / hands-on', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5c2d027d-d964-4198-bb9c-daaaefa69753'::UUID, 'work order', 'maintenance request / service ticket', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5c5c975a-a6dd-4194-860a-7a92f9582d66'::UUID, 'COMMS', 'communications officer / IT director', 'navy', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5cb8c402-63c3-44cf-8bd3-839e883409f8'::UUID, 'knock it off', 'stop immediately / cease activity', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5cc354e6-58ea-4bca-a5e6-fc41f5e13ab0'::UUID, 'chop', 'transfer of authority / reassignment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5cc4ac7e-1b49-4c0f-973c-59303a9025e2'::UUID, 'S3', 'Operations section / operations department', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5d99afad-02e5-4519-841b-472414a4babc'::UUID, 'DC', 'emergency response', 'navy', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5dc0a7c1-733a-4f13-80b4-724420d6f001'::UUID, 'HHG', 'household goods / personal property', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5dd0d7bf-13ad-4e3f-9195-9552ab60940c'::UUID, 'PTA', 'practical training assessment', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5ddeca69-6127-46f5-ac71-18ac93ba5a05'::UUID, 'embarked', 'deployed / traveling for work', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5e0f37f8-69f2-46d0-92ef-bc87a54f49b0'::UUID, 'roger', 'understood / acknowledged', 'general', 'communication', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5e12553f-85bd-4912-a618-313bd11d71a4'::UUID, 'TSP', 'Thrift Savings Plan / retirement plan', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5ef893e2-8edd-4a57-bd70-270315ea2e67'::UUID, 'SL', 'skill level', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5f08c132-cc25-42f5-8654-8bab49a95aa3'::UUID, 'NIPRNET', 'unclassified government network', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5f14749d-a30b-4b29-a2f4-dbfd0597ef30'::UUID, 'chain of command', 'organizational hierarchy / reporting structure', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5f2ae3f9-4363-4414-bbb8-f70daff491a4'::UUID, 'APS', 'army prepositioned stocks / strategic forward inventory', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5fa1df97-3b6e-4e33-a709-642fb9ac0a0f'::UUID, 'inspection', 'audit / compliance review', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('5fcf1713-d0a2-4606-a618-4aaff1524a22'::UUID, 'OCONUS', 'outside continental United States / overseas', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('602e590d-7a88-491b-8253-1e310356017d'::UUID, 'logistics', 'supply chain / operations support', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6037ce3a-c65e-4b87-a60c-987a16af386f'::UUID, 'DTS', 'Defense Travel System / travel management system', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('603ee91a-0726-4445-ac98-2f5202425d11'::UUID, 'NCOIC', 'Non-Commissioned Officer in Charge / shift supervisor', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('605ae17b-a2a5-407a-bc1d-7d2e50d389a4'::UUID, 'billet', 'position / role / job', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('60912742-5c89-47b8-a2ce-7db8d164e63c'::UUID, 'OCO', 'offensive cyber operations / proactive cyber engagement', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6139f51e-99d8-437e-ad47-d4f9adfc37db'::UUID, 'copy', 'received and understood', 'general', 'communication', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('61881034-64e3-411f-8362-d187700810f3'::UUID, 'cybersecurity service provider', 'managed security services', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('61a1cfa2-d41c-421e-8de0-2dd9f4d5b1cc'::UUID, 'SOP', 'standard operating procedure', 'general', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('61bb4436-6050-40ce-b3c3-26da2673ae7d'::UUID, 'deck plate', 'frontline / shop floor / ground level', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('61eda103-2f78-4ba8-b274-ca3979e230cf'::UUID, 'passageway', 'hallway', 'navy', 'general', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('620de8b1-a7fc-4922-a525-9878d0895983'::UUID, 'NCO', 'Non-Commissioned Officer / supervisor', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6213209c-a2a3-45f9-bae3-0e2d0d3c21ad'::UUID, 'report', 'arrive / check in / start', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('621663e5-f417-4da5-8e92-edddf0df423f'::UUID, 'rate', 'job specialty', 'navy', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('62196ffa-0f23-415a-8e87-23ac9e2bf0f5'::UUID, 'AIT', 'advanced individual training / specialized training', 'army', 'training', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6225a914-0c88-4e32-97b1-781da84da942'::UUID, 'QA', 'Quality Assurance', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6238872b-3f62-4d5f-805f-53cd6a330340'::UUID, 'commissary', 'grocery store / employee store', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('625d83fd-7372-45a6-8660-4dd8890b342c'::UUID, 'OPSEC', 'information security', 'general', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('62642712-c192-4d3b-8034-be90c34aa5e4'::UUID, 'SAPR', 'Sexual Assault Prevention and Response', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6268ef74-15d5-477b-bcf8-51693d826482'::UUID, 'training command', 'learning & development / training department', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('626acdc7-cdc0-43b3-b8da-8e1ae4a88f21'::UUID, 'SGT (Sergeant)', 'Team Lead / Supervisor', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6283bbdc-c2c0-4526-86d4-8cb9242cd207'::UUID, 'DRB', 'Disciplinary Review Board', 'navy', 'administration', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('62efce3d-9a23-49f1-8ac8-98b5d5f6a85e'::UUID, 'shore duty', 'office-based assignment / non-deployable role', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6304225e-d59f-419a-a687-3ad5b6206e1a'::UUID, 'AFSC', 'Air Force Specialty Code / job classification', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6324256a-0226-4351-810f-f0a6aa809c65'::UUID, 'combat stress', 'occupational stress / critical incident stress', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('632f98c1-3b91-49e1-a753-a73459b82c64'::UUID, 'trigger', 'decision point / activation criteria', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('633cdfd3-2333-4911-92d9-89e51b9bb090'::UUID, 'CPO (Chief Petty Officer)', 'Department Supervisor / Manager', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('63bda9e7-4889-44de-8413-09b52aaab52e'::UUID, 'IDC', 'independent duty corpsman / autonomous healthcare provider', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6415202d-2a63-4e25-b972-8ef044cb91c2'::UUID, 'leave', 'paid time off / vacation', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('642386a8-30d4-4d3f-89da-16193df6ef4f'::UUID, 'INSURV', 'Board of Inspection and Survey', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('642b6b94-8213-4229-8ae9-3270fefe7eb8'::UUID, 'weapons qual', 'certification / proficiency test', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('64859f43-d434-40ae-8d35-dc547140093a'::UUID, 'S6', 'Communications section / IT department', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('649a3bd7-1d2e-402c-86f5-0f1fd4ae31d4'::UUID, 'topside', 'external/outdoor areas', 'navy', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('64a50110-94fc-4e80-8e32-f2091b93a28d'::UUID, 'TO', 'technical order', 'usaf', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('64c604b7-7156-44ff-bdda-d5daffd333b1'::UUID, 'letter of instruction', 'written directive / formal guidance memo', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('64f12db0-0606-405e-b6b0-5513802b7524'::UUID, 'TOC', 'Tactical Operations Center / operations center', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6547524f-30b4-4d00-a78e-45fee335d751'::UUID, 'RPO', 'Recruit Petty Officer', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('654cf9fb-6dec-4bcf-a5b7-1354b2c207ac'::UUID, 'sailor', 'Navy employee / naval staff', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('658d20d4-2d5a-4bce-a05e-0226501ccc51'::UUID, 'joint', 'multi-organizational / cross-functional', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('65bd2f4d-4667-41e1-8ce5-3f26e10f6a7c'::UUID, 'TDY', 'temporary assignment', 'usaf', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('65c55ea9-f27c-4618-a6a6-64b615d96293'::UUID, '1st Lt (First Lieutenant)', 'Manager', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('65d84e7a-48a6-4784-8496-92fcd2c166ed'::UUID, 'facilities management', 'building and infrastructure operations', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('66044db6-e4ed-49e8-9ba7-c93063150311'::UUID, 'independent duty', 'solo practitioner / autonomous medical provider', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('664a873b-5703-4a49-92c7-70f3c33503c0'::UUID, 'Maj (Major)', 'Director', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6665910b-67c9-4606-a7bc-9f4d0099edf8'::UUID, 'red team', 'adversarial review team', 'general', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('66ce7400-5f21-43e3-81cb-d387d87e5494'::UUID, 'in port', 'at home office / not traveling', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('66d860d6-77fe-45b0-b9d5-2c094d7b595b'::UUID, 'AB (Airman Basic)', 'Entry-Level Staff', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('66dd1a72-61ff-47d4-9c99-d92e9e52ff3c'::UUID, 'head', 'restroom', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('670c7466-09c1-4a9a-b7b3-578fa146cd2c'::UUID, 'TIG', 'Time in Grade / time at current level', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6728ef91-ff2b-4e66-8f3d-7ce1f403f341'::UUID, 'T&M', 'time and materials / hourly-rate contract', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('679c1005-d65f-45e7-9e4a-caa789dc792b'::UUID, 'turn-in', 'return to supply / equipment return', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('686c0246-e559-4fa6-85a0-97ab90c27614'::UUID, 'stockage objective', 'target inventory level', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('68a0fc75-3130-47bf-93de-6c92b4bd4839'::UUID, 'garrison', 'permanent facility / home office', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('68b22fa0-b7ab-4177-b2bd-86c625431eee'::UUID, 'BRAC', 'Base Realignment and Closure', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('68b6df70-93c5-4093-8ef7-398545c73ec7'::UUID, 'SEABEE', 'Naval Construction Battalion / military construction worker', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('68e72dfb-a001-45eb-a3e3-ade4a5566640'::UUID, 'TSCM', 'technical surveillance countermeasures / electronic sweep', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('692b2d13-46f1-4275-9460-b8d67fdcddac'::UUID, 'INSURV', 'regulatory compliance inspection', 'navy', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('69437019-4779-44a3-8b2c-435eefd59c3c'::UUID, 'liberty', 'scheduled time off', 'navy', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('694bbf1b-3137-4021-bae3-4fd3f8c693f8'::UUID, 'serviceable', 'operational / in working condition', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6961491a-4228-4352-a000-1f5cfba9125e'::UUID, 'hard deck', 'absolute deadline / non-negotiable limit', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('69c000f6-1000-4d1a-9047-eb67a37a9daa'::UUID, 'manifest', 'roster / inventory list', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('69d0ba17-98c0-4143-921b-5403d0cf7868'::UUID, 'network monitoring', 'IT infrastructure surveillance', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('69df121f-e17f-4087-b453-b7efdc9e2baf'::UUID, 'sea and anchor detail', 'departure/arrival team', 'navy', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('69f39d65-fb9f-4b08-a715-fd0030ab33f1'::UUID, 'ORM', 'Operational Risk Management / risk assessment', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6a123121-72d0-47f7-9ba0-ac802d9556ff'::UUID, 'primary duties', 'core responsibilities', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6a505b49-42d2-4612-9c47-e13df447d02e'::UUID, 'arrested landing', 'cable-assisted stop / controlled deceleration landing', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6a6fe6f0-f816-411a-a4ec-05dc8138f0e7'::UUID, 'PMCS', 'preventive maintenance checks', 'army', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6ac48659-000f-422c-8b3a-aa5920454cbf'::UUID, 'BN', 'battalion / large organizational unit', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6ae284e4-9df0-4551-a71b-f9672e221d9b'::UUID, 'BCT', 'Basic Combat Training / initial training program', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6b0a3303-335f-4867-839d-e517ed828d10'::UUID, 'WEPS', 'weapons officer / tactical systems director', 'navy', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6b264b8c-2af5-482a-a1a0-704f2ca3b6b2'::UUID, 'muster', 'attendance/accountability check', 'navy', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6ba37b4d-c2b9-4ca1-bd36-f8d773f1e5f5'::UUID, 'IMINT', 'imagery intelligence / satellite and aerial image analysis', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6bdbdd29-f182-4bf4-95de-c33ba25c57b0'::UUID, 'rear detachment', 'home office support / HQ staff', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6c2e4802-60e5-4850-9cdd-b2e22a75a1bc'::UUID, 'OPTEMPO', 'operational pace', 'general', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6c3d7d53-bd3a-4832-8e02-f218c4c77738'::UUID, 'vessel', 'ship / facility', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6c711c93-25fc-47e2-9b6e-8abd84c45e76'::UUID, 'roger', 'acknowledged / understood', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6c75b134-8524-47e6-b5bd-6e0fa5f64c3c'::UUID, 'Raider', 'Marine special operator', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6c83ad37-fced-4245-971e-9d3294bb9907'::UUID, 'direct report', 'subordinate / team member', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6c8e274f-d4a1-4d1c-86cf-4eb44ff53020'::UUID, 'yellow deck', 'limited operations / caution conditions', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6c909917-b8ea-4676-a5da-88ffc0b64788'::UUID, 'target package', 'mission briefing documents / operation plan', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6c93c380-4d25-4f51-869c-763dd4f89704'::UUID, 'damage control equipment', 'emergency response equipment / fire suppression systems', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6ca34ef1-33b2-41d1-9f05-975267540617'::UUID, 'colors', 'flag ceremony / opening/closing procedures', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6cac526a-1263-4050-88e3-318cab03ceea'::UUID, 'mid-watch', 'overnight shift / graveyard shift', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6cbba359-6419-4af2-b72c-e29cbc04c0df'::UUID, 'sick call', 'walk-in clinic / daily medical appointment', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6cc0922c-ba38-4194-8ea8-8a09f3768a52'::UUID, 'led', 'directed', 'general', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6cf2e426-2f54-437b-b236-4739d86747b1'::UUID, 'PTAD', 'permissive temporary additional duty', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6d07cac3-468e-46b1-98cd-70cd726ca65e'::UUID, 'delayed', 'stable but requiring eventual treatment', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6d0ae6bf-7d3f-4ce4-9253-dfadf5856a7f'::UUID, 'SN (Seaman)', 'Staff Member', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6d3f68bc-e70f-4286-b3c6-1a8f84b93a24'::UUID, 'port', 'left side / destination', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6d449b36-770c-4242-9363-ba39e181befd'::UUID, 'squadron', 'unit of 12-24 aircraft / organizational unit', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6db36468-9b2f-46cc-b40b-491f8645a824'::UUID, 'gapped billet', 'unfilled position / vacant role', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6dbac518-9227-4dc4-b60e-594beffbffe0'::UUID, 'Role 2', 'advanced trauma care / emergency stabilization', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6e159d62-dcd4-46aa-92a8-9df6db0363c1'::UUID, 'immediate', 'requiring urgent surgical intervention', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6e168c21-c29b-4dc4-8154-d4e5a1075c8a'::UUID, 'deliverable', 'required output / contractual product', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6e274cce-0518-48ec-8996-b12c5029dd58'::UUID, 'FSA', 'Family Separation Allowance', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6e690312-7608-4ea2-ae6b-dfa89b603a67'::UUID, 'PVT (Private)', 'Entry-Level Staff', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6e8adae8-68d3-4832-a4c6-0e766c000a60'::UUID, 'readiness', 'preparedness / operational capability', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6e9cc026-aad6-4978-8d2a-8dc58789fc9c'::UUID, 'Col (Colonel)', 'Executive Director / VP', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6ed85344-4edf-4ef7-afe6-ea0b912b7617'::UUID, 'DA', 'Department of the Army', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6edbef12-ea88-4ecc-ad95-a2c8ccf14bfb'::UUID, 'GSA', 'General Services Administration', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6f534252-43ae-4830-b160-48521ee4f5a3'::UUID, 'threat assessment', 'risk evaluation / threat analysis', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6f629d00-a50f-46ae-83e3-b6067d5f6f32'::UUID, 'EFMP', 'Exceptional Family Member Program', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6f652eba-29e0-4f84-b5b9-b9277ef8e521'::UUID, 'POM', 'program objective memorandum / multi-year budget proposal', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6f673bad-ad72-44ea-9e15-157a035fa6bc'::UUID, 'CPO (Chief Petty Officer)', 'Manager', 'uscg', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6f9bf0c7-3db0-4ba6-b589-ef2b2ac1cda7'::UUID, 'TYCOM', 'Fleet Regional Command', 'navy', 'organization', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6fce43ed-2ee9-446c-a2bf-715a1a2ec10e'::UUID, 'collection management', 'intelligence requirements coordination / data collection planning', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6fd62cd1-dad4-4649-9827-60b111f6c6e5'::UUID, 'SITREP', 'situation report / status update', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('6ff40bea-50b3-460d-8447-1163941e49ff'::UUID, 'SELRES', 'Selected Reserve', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('70105852-043d-49b9-84b9-0f0798de8679'::UUID, 'appellate', 'appeals process / higher court review', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('704fb165-39f9-40da-9202-bdc089f47590'::UUID, 'DA', 'Department of the Army', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7058c46a-92fb-4488-997c-ef81bf76ea81'::UUID, 'force protection', 'facility security / workplace safety', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('70aec629-b0ce-4e62-9701-a5d19bc4b97d'::UUID, 'non-kinetic', 'indirect / influence-based / diplomatic', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('70d5c976-93eb-4d88-9f76-4eecd1d5ea90'::UUID, 'minimal', 'minor injuries / walking wounded', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('70f16de0-b1d6-46ed-93f1-5a0af32615dd'::UUID, 'SME', 'Subject Matter Expert', 'general', 'expertise', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('71257bb4-d85e-46f9-91b5-32f54badfd74'::UUID, 'in the fleet', 'in field operations / working', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('71443b9d-82a2-4b62-a84c-233e1f2f9b8f'::UUID, 'maintenance', 'equipment upkeep / preventive care', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('71628a76-6d1b-4934-8cde-2677b45eb6cf'::UUID, 'RMF', 'risk management framework / cybersecurity compliance framework', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7186ce28-1b8a-4084-aceb-b66ae6599e05'::UUID, 'eval', 'performance review / annual assessment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('71a9c107-bf9a-432e-bf21-7f89bb7423a8'::UUID, 'HM', 'Hospital Corpsman / medical technician', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('71ab43eb-b3d0-4337-8e1b-bc8d08713234'::UUID, 'EFMP', 'Exceptional Family Member Program', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7202ee5c-2049-47d5-a292-9bdd50432afb'::UUID, '1SG', 'first sergeant / senior operations manager', 'army', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('720f180a-ab16-4217-bfd0-96940c076642'::UUID, 'hip pocket training', 'informal on-the-spot training', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('724453ee-d105-4513-a62d-a7940ac6088a'::UUID, 'DTS', 'Defense Travel System / travel management system', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('72776988-f5a9-44f5-9a2d-acec35e84b70'::UUID, 'defense counsel', 'defense attorney / legal representative', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('72cc8ddd-9b9a-4908-9402-630f21a425b3'::UUID, 'lockdown', 'facility security restriction', 'general', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('72e21e5f-868b-45cf-94ea-8a350e5aadee'::UUID, 'PT', 'physical training / fitness program', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('72eeecfe-d2eb-42c9-8526-8272c6340ba0'::UUID, 'direct report', 'subordinate / team member', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('72f57407-f9e3-4ea2-9e43-9be77e899549'::UUID, 'rotation', 'assignment cycle / tour schedule', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('73185830-ac7d-4c9f-b7e2-ef1be8ad739a'::UUID, 'relief', 'replacement / successor', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('73c6197e-505f-4075-99ad-68cc4e5baba8'::UUID, 'OER', 'Officer Evaluation Report / performance review', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('73f115c1-3624-40b8-84d2-45bc7fc0ee05'::UUID, 'combat zone tax exclusion', 'tax-free income for deployed personnel', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('742656a5-5a63-4346-87e9-7e5964eecb32'::UUID, 'military bearing', 'professional demeanor / composure', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7435e7dc-7f08-4046-9237-91d4bc1f09c3'::UUID, 'APFT', 'Army Physical Fitness Test / physical readiness assessment', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('74446bf2-7e84-4504-aeb9-8e7e92ffe474'::UUID, 'allotment', 'automatic payroll deduction / directed payment', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7450770e-2b36-4a13-87d0-cb8887fb1464'::UUID, 'TM', 'technical manual', 'army', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('74f02de3-c715-4d58-874b-0307bf15c05b'::UUID, 'S4', 'Logistics section / supply chain department', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('75556912-7b6c-49a5-9c7b-f063abca0fb8'::UUID, 'CSG', 'Carrier Strike Group', 'navy', 'organization', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7559ec57-8658-4670-be80-b36997007aa3'::UUID, 'OTS', 'Officer Training School', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('75c14097-d327-4c12-846e-da2fdaa268f0'::UUID, 'SFC (Sergeant First Class)', 'Manager / Operations Supervisor', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('75e1d0b5-d43c-464c-8603-f9f6ed588759'::UUID, 'TMO', 'Traffic Management Office / shipping coordinator', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('76008b04-9066-4d02-92b0-b6a3b7d6c4b0'::UUID, 'contingency plan', 'backup plan / business continuity plan', 'general', 'planning', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('760c33c7-7e32-466c-adab-7c27c6d566ce'::UUID, 'echelon', 'organizational level / tier', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('761dd09b-bb75-4618-ba7a-a21a3f1fa4b3'::UUID, 'CI', 'counterintelligence / insider threat detection', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('76690ea6-f492-4936-b7d0-af750884cb88'::UUID, 'national intelligence', 'strategic-level analysis', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('768869cb-a786-4675-9dbe-5e65cb9c8c59'::UUID, 'RADAR', 'radar systems / detection equipment', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('768b9de0-ee55-4de6-848b-030416bf3508'::UUID, 'PO2 (Petty Officer Second Class)', 'Senior Technician / Team Lead', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('76a65288-d661-4b97-8fe9-fede023ae4bf'::UUID, 'division officer', 'department manager', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('76aaeed1-473e-4d33-a27d-c0bc37041b62'::UUID, 'commissary', 'grocery store / employee store', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('76d8ab67-13cc-44fe-bf95-79319772e20c'::UUID, 'OER', 'officer performance evaluation', 'army', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('771fa34e-6cf7-4b1f-aea4-252e962c3d33'::UUID, '1st Lt (First Lieutenant)', 'Manager', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('772bddd7-8496-42cf-b9d8-72ad1dbba6e9'::UUID, 'HBSS', 'host-based security system / endpoint protection platform', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('77b8fefa-111d-45ee-9a23-e50cdc708a8d'::UUID, 'OSINT', 'open-source intelligence / publicly available information analysis', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('77ca931f-9fa0-4898-90a7-15eb5b0a4931'::UUID, 'leave', 'paid time off', 'general', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('77df59ff-09c9-4bbe-a8e0-f1be3bc8aa7c'::UUID, 'expeditionary', 'mobile / rapid deployment capable', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('77ee6ae1-436f-43c1-9ac3-aad1c8bd042b'::UUID, 'BCT', 'Basic Combat Training / initial training program', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('77f2c57c-50a9-42dc-b722-557b521b8e9d'::UUID, 'PO3 (Petty Officer Third Class)', 'Technician', 'uscg', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('780bc9d0-9909-47f9-9e65-6aaf860d0bdd'::UUID, 'gouge', 'study guide / insider information', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('78b79f83-98b8-484d-941a-014fccb767bd'::UUID, 'battle buddy', 'accountability partner / work partner', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('790b80aa-70fa-4dae-b251-f956251e7a4a'::UUID, 'SrA (Senior Airman)', 'Technician / Specialist', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7933b627-56a3-4c99-b45a-03a8940407ee'::UUID, 'VHA', 'Variable Housing Allowance', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('79723ed0-aa1b-4482-8682-d48948e17bb6'::UUID, 'tacon', 'tactical control / field-level authority', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('799e8f0c-13a1-49f1-99d6-902179866f60'::UUID, 'PQS', 'Personnel Qualification Standards / certification requirements', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('79b13fe8-5ab5-4448-896b-9516df974136'::UUID, 'budget execution', 'spending management / fiscal plan implementation', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('79c1d8b8-76bf-4c81-a6fb-490c14521824'::UUID, 'mess', 'dining facility / cafeteria', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7a44382f-3293-4767-9e39-76bae20fe84f'::UUID, 'SOW', 'statement of work / project scope document', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7a45f0dd-81fb-4968-86d4-3bb50444e117'::UUID, 'MSgt', 'master sergeant / senior manager', 'usaf', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7a4d05d2-f072-4291-b068-024da6a64998'::UUID, 'liberty', 'time off / personal time', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7a74d1c2-054c-403b-9ab2-7605553cfc15'::UUID, 'head', 'restroom', 'navy', 'general', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7a8a49e1-c4c5-4cfe-9366-ac1ec50d26e8'::UUID, 'SCI', 'Sensitive Compartmented Information', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7aa5015e-d322-41dc-b4b8-ad6b9d74b859'::UUID, 'GPS equipment', 'navigation systems / location tracking', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7ac63c44-ac23-4426-bf70-9cf8c32f1b16'::UUID, 'enlisted', 'non-management / technical staff', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7ae3a43c-90f9-4db3-a2ec-81ddfdf64765'::UUID, 'ops', 'operations', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7aea730c-b0e3-47ba-9222-7bc469275ac5'::UUID, 'brigade', 'division of 3000-5000 employees', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7b343b51-cfcf-4a79-b2ae-06baeee36b00'::UUID, 'SOP', 'Standard Operating Procedure', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7b450738-cf66-4263-a4bf-2e2c3d6e8d51'::UUID, 'exchange', 'retail store / company store', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7b97af79-0687-4a57-af8f-f141a1f2293d'::UUID, 'SF', 'Standard Form', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7bc21dbd-b2d7-48e7-b5d2-d5d4a29b80b8'::UUID, 'SM', 'service member / employee', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7c0e9912-65ce-41d2-a90c-8a81e6da1b67'::UUID, 'evaluation', 'performance review / employee appraisal', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7c2ffc43-6a41-4983-95d3-ab5d60732571'::UUID, 'movement order', 'travel directive / relocation order', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7c4e2031-ef7b-4323-8008-e4928451659e'::UUID, 'PPE', 'personal protective equipment', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7c57e2e5-2437-4f7b-953e-b612e4170537'::UUID, '3MC', 'Maintenance Management Coordinator', 'navy', 'maintenance', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7c782e7d-7137-40f3-9619-f0b522ff6896'::UUID, 'SM', 'service member / employee', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7c904eae-cf68-4db6-8730-443bbfb3fd2b'::UUID, 'expectant', 'beyond immediate medical capability', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7c91c786-8380-49e5-a6c4-24c5fa45a720'::UUID, 'SSO', 'security officer', 'general', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7c9fe1c2-f38f-4aa2-9cd0-db3845b9aaa7'::UUID, 'asset', 'confidential source / information provider', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7cd42dfb-abd6-4de7-b6da-7e09e9a439d9'::UUID, 'indoctrination', 'security orientation and access briefing', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7cedd2fd-c6e4-4f20-b137-917a81bb010f'::UUID, 'DOD', 'Department of Defense', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7cfa4ea9-c47a-468d-b70c-d1c9ae51ea0a'::UUID, 'taxi', 'ground movement of aircraft', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7d62eb13-7f0a-4b02-9be8-09fe00e9894e'::UUID, 'NJP', 'Non-Judicial Punishment / disciplinary action', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7daf43a1-abbc-4465-84be-7856d2512ca4'::UUID, 'training command', 'learning & development / training department', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7db0f0c8-370d-4b76-9287-c0471db990ef'::UUID, 'PME', 'Professional Military Education / professional development', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7dddc6ec-c50e-4006-9a09-c3990b47fe57'::UUID, 'APFT', 'physical fitness assessment', 'army', 'training', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7e0545b1-7410-4224-b253-e24231bbbf76'::UUID, 'MSgt (Master Sergeant)', 'Manager', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7e06b709-9bf6-4fe0-8c14-87f23d67d292'::UUID, 'UCMJ', 'Uniform Code of Military Justice / military law', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7e0fc48a-a0be-48d9-a7e4-b679d6f1ef3c'::UUID, 'DCTT', 'emergency response training team', 'navy', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7e290e88-207c-4f80-9230-f809d487623f'::UUID, 'execute order', 'go-ahead directive / implementation order', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7e6f5f6e-1eec-4ad6-9cf3-4925a881cd42'::UUID, 'AR', 'policy regulation', 'army', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7e7a8434-6e96-44f8-9d4f-4ccaa3f0244a'::UUID, 'SITREP', 'situation report / status update', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7e8e2e09-baef-46f3-868a-be53ce6deba4'::UUID, 'SRB', 'selective reenlistment bonus / retention incentive payment', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7eeb25f2-c441-4e72-91d1-ddc16c2e12d3'::UUID, 'clemency', 'sentence reduction / penalty mitigation', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7f034c0c-6634-44b9-9ff5-7617e5434bd4'::UUID, 'COIN', 'counterinsurgency / population-centric stability operations', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7f1ee793-da4c-4977-b085-41e684fbd4ab'::UUID, 'unit', 'team / department / organizational element', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7f4b549d-d71f-414d-9959-4232902aec47'::UUID, 'OIC', 'Officer in Charge / department head', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7fcc08b3-2653-4b6b-ac3f-2f109812ade6'::UUID, 'deployment', 'extended field assignment', 'general', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7fe43f6e-809a-4759-b0c9-1e4341cca35b'::UUID, 'OER', 'Officer Evaluation Report / performance review', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('7ff22bac-193a-4ded-83af-8d7251ae8c96'::UUID, 'organic', 'internally owned / in-house', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('800d3c19-657f-46be-896d-275eda943bad'::UUID, 'spin up', 'prepare rapidly / get up to speed', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('801b7457-47ae-4c70-a089-4988bce44723'::UUID, 'port', 'left side / destination', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('802d6f3d-664c-4751-b353-d4c3925e30a0'::UUID, 'PMS', 'preventive maintenance', 'navy', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('803d7ad2-dd8c-4355-a493-ab8a1b397eac'::UUID, 'consumption rate', 'usage rate / burn rate', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('804f6a26-d845-4a0b-9091-e83fd00ba22a'::UUID, 'veteran', 'former military employee', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('807fb5f2-740e-4cef-9b56-feb2e37bc89b'::UUID, 'PO2 (Petty Officer Second Class)', 'Senior Technician / Team Lead', 'uscg', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('808a291f-dc0d-49ef-9ecd-ebb305b5d9d8'::UUID, 'PMC', 'partially mission capable / partially operational', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('80bfa3ad-a74c-4500-b7ee-e1ab37de081b'::UUID, 'DLR', 'repairable component', 'navy', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('80d8bd8e-46fb-4062-95c2-88a802711ed4'::UUID, 'PFA', 'Physical Fitness Assessment', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8126b379-d020-467c-a886-d97e8696d88a'::UUID, '2LT (Second Lieutenant)', 'Junior Manager', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('81a6a313-be63-482d-add8-3e69d82188de'::UUID, 'superior', 'supervisor / manager', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('81c827a1-dde4-4142-9b39-48cf40273bf7'::UUID, 'workup', 'preparation / training cycle', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('81e85a3f-aaaf-4553-a6a0-cdd628dff1bf'::UUID, 'LES', 'Leave and Earnings Statement / pay stub', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('81fa8c23-6ad4-4b7a-8efb-288e541a3b31'::UUID, 'pre-deployment', 'pre-project / preparation phase', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8203ad48-5adb-4179-9a5d-012795a3342e'::UUID, 'detail', 'temporary assignment / special project', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('820e186b-fe37-427f-a627-5f8db65ce12d'::UUID, 'fireteam', 'small team / work group of 4', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('82142dfb-5e05-4b56-8f16-1a016ddee1f8'::UUID, 'COMSEC', 'encrypted communications / secure communications', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('825437fc-dacd-4b06-b33b-d7bd523e3812'::UUID, 'DCAS', 'Defense Contract Audit Services', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('826745a4-b69f-4164-b0e0-11e84a193411'::UUID, 'KO', 'contracting officer / procurement authority', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('82a20319-f88a-49a0-976e-573b85634d9c'::UUID, 'OCONUS', 'international operations', 'general', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('82b4a9aa-1769-4766-b1e3-3c76213a01f3'::UUID, 'reenlistment', 'contract renewal / retention', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('82b4dfc3-06b3-4576-80a9-bb9e33de600c'::UUID, 'troop', 'soldier / staff member', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('82bb8ebb-b10a-4594-a9e6-03a9736e4330'::UUID, 'milestone', 'key checkpoint / deliverable date', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('82ce8118-8d25-4659-87b8-ce1bb3dd44ea'::UUID, 'MRE', 'Meal Ready to Eat / field rations', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('838f9a14-84e2-4701-81f5-9b33985a7680'::UUID, 'medevac', 'medical evacuation / emergency transport', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('839b0396-7275-4ba6-91b8-16209765fb1b'::UUID, 'material condition', 'equipment status / asset readiness', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('83ce0b11-d6e9-4a2d-9dfa-0aab60922026'::UUID, 'war reserve', 'emergency stockpile / strategic reserve', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('83ce90c8-39af-4757-8cf7-67fa140ba012'::UUID, 'readiness', 'preparedness / operational capability', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8401bd61-dc82-4247-b89f-9dc1f5109f4e'::UUID, 'JFTR', 'Joint Federal Travel Regulation', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('846334a1-1f16-4352-bf35-5c84f7ee2081'::UUID, 'sea duty', 'deployable assignment / field position', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('846b4122-4e09-438b-a277-f368961dceba'::UUID, 'military judge', 'presiding judicial officer', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('84889693-4444-4343-a2fb-bddc9a81900a'::UUID, 'privacy act', 'personal data protection regulation', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8498f600-cead-4c55-8624-cbe13319702f'::UUID, 'COTS', 'commercial off-the-shelf', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('84cc8825-3625-455a-87d3-0bcad59bd0b6'::UUID, 'sortie', 'mission / operation / project execution', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('85117e82-9466-4da1-a829-b9b431318fcb'::UUID, 'market research', 'vendor and industry analysis', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('851c453a-8899-4f9c-b330-b89a86993ece'::UUID, 'mine clearance', 'explosive ordnance removal / minefield remediation', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('85573f85-930c-4d17-b181-dd8cf8c8bd5a'::UUID, 'ladder', 'stairs / career progression path', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('855964e7-67c5-4c80-864a-679f0d035aee'::UUID, 'PME', 'professional military education / leadership development', 'general', 'training', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('856a37c9-3720-41eb-96e4-7ccc965264e6'::UUID, 'SQ', 'Employee of the Quarter', 'navy', 'awards', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8576160c-70bc-4415-8e66-28d0834cddab'::UUID, 'fleet', 'operational units / field operations', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('859aa40c-d245-4b58-8045-6e498eb18097'::UUID, 'transfer', 'relocation / reassignment', 'general', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('85ffd67e-b192-43e7-93d5-09211afc62f0'::UUID, 'operational tempo', 'work pace / activity level', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('869ecaf9-516e-434e-b62a-6ca5315df4eb'::UUID, 'QA', 'Quality Assurance', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('86cd1c74-0a6d-40fe-ada4-57d0101b1fa0'::UUID, '1SG (First Sergeant)', 'Operations Manager', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('86fb08be-6ac6-43d6-b209-9ab1067252b2'::UUID, 'brigade', 'division of 3000-5000 employees', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('87010c4a-9271-4e4c-b56e-407f535056d8'::UUID, 'chit', 'request form / approval document', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('87349863-a026-4ca7-ac93-86c8b8ac5016'::UUID, 'demand history', 'usage trend / historical consumption data', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('873dd2c4-c5b1-46b3-afb0-14a76dcbceea'::UUID, 'EEO', 'Equal Employment Opportunity', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('875c075b-5c02-479b-bb69-6889ed0a3189'::UUID, 'TSgt (Technical Sergeant)', 'Senior Supervisor', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('88146480-1aff-441b-adf1-6469b1ca3a33'::UUID, 'MILPERSMAN', 'personnel policy manual', 'navy', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('88393175-1be6-4b48-b221-fd6526504647'::UUID, 'LtCol (Lieutenant Colonel)', 'Senior Director', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('885ac6fa-81eb-4382-9098-d44097d81915'::UUID, 'issue', 'distribute / provide from stock', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('88b53022-854d-4c21-8442-a6f5bdbdbe57'::UUID, 'general quarters', 'emergency response / all-hands situation', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('88ba12ff-8f29-468d-bcc7-d17de0f4fd1f'::UUID, 'COL (Colonel)', 'Executive Director / VP', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('88c5a11f-21f1-4bcd-aaf8-ea22b0cd4936'::UUID, 'source selection', 'vendor evaluation and selection process', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8972629d-7839-4aa4-9d31-c0b166ec5592'::UUID, 'technical evaluation', 'capability assessment', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8979ad31-15a1-4db7-92d4-f8ff6d543afb'::UUID, 'all hands', 'all employees / full staff', 'navy', 'general', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('89a3715d-ba86-4ba8-8705-fea0677aa4c0'::UUID, 'battle stations', 'emergency response protocol', 'general', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('89b585ea-13d8-4bdb-8d97-109d0c24a4d1'::UUID, 'bulkhead', 'wall', 'navy', 'general', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('89c85deb-5eb2-4e5a-9058-584c16b9885e'::UUID, 'DPW', 'director of public works / facilities management director', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('89cbf6bb-ce66-4422-a95f-b68b99d4c38f'::UUID, 'fireteam', 'small team / work group of 4', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('89d0ef6c-61b0-4fd1-8c81-174c8fbcb8c1'::UUID, 'NKO', 'Navy Knowledge Online / e-learning platform', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('89e83a00-42c9-474b-a060-91415ad54498'::UUID, 'IDES', 'integrated disability evaluation system / medical disability review process', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('89eccd66-38af-4868-9054-14dcf9d424fc'::UUID, 'will preparation', 'estate planning document / legal testament drafting', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('89f54321-71a0-49ef-af95-62a048b4d7ae'::UUID, 'RIMPAC', 'Rim of the Pacific Exercise', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8a097d2c-f01e-4e8b-9f87-ceb9e9aec63d'::UUID, 'regiment', 'large organizational unit', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8a75e53d-7194-49d2-a8ee-96c2218cd9c1'::UUID, 'walking wounded', 'ambulatory injured / self-mobile patient', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8aa322a5-103a-4e27-875e-d5c50df794c2'::UUID, 'DOD', 'Department of Defense', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8adbf150-8f14-4eac-95c5-9daa33bd8e82'::UUID, 'DLA', 'Defense Logistics Agency', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8afeab14-34e7-468a-8893-aa91e6c21ff1'::UUID, 'OIC', 'Officer in Charge / department head', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8b07c4dd-8398-42a5-95a7-3676438d1d9a'::UUID, 'warrant officer', 'technical expert / senior specialist', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8b093726-89a8-4eb1-8e9b-fdd72b71161f'::UUID, 'CYBERSEC', 'cybersecurity', 'general', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8b59e10d-a7df-4cdc-8498-3d27587024f9'::UUID, 'PO1 (Petty Officer First Class)', 'Supervisor', 'uscg', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8b60348d-55ee-4c23-bda5-95272cf45d8f'::UUID, 'general quarters', 'emergency response / all-hands situation', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8b653407-f039-47cf-8607-29d1f91a5725'::UUID, 'OPNAV', 'Office of the Chief of Naval Operations', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8b7e6972-24a6-4f12-a2a7-2abb7842353f'::UUID, 'MARADMIN', 'Marine Administrative Message', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8b837ec8-6025-4cb6-8973-3b5187a2c166'::UUID, 'redline', 'critical threshold / do-not-exceed limit', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8bc43f2e-5a34-43f2-ba7a-0dcb774b379e'::UUID, 'legal assistance', 'pro bono legal services / employee legal aid', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8be819ed-8485-4f68-8d69-d136acc00c32'::UUID, 'BN', 'battalion / large organizational unit', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8c284d6e-8809-4f4b-925d-7fbc521f05d1'::UUID, 'detailer', 'talent management / HR assignment specialist', 'navy', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8c287712-3c2f-42ad-89e0-00dccd59ec67'::UUID, 'muster', 'roll call / attendance check / team meeting', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8c5f8c5d-4823-4876-8c3d-0067bdc1eac4'::UUID, 'LOR', 'letter of reprimand / written disciplinary warning', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8ca7d73c-82f3-4dd6-b40d-3213bcc0561a'::UUID, 'NCOIC', 'section supervisor', 'army', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8cad20d9-a5fa-4a80-833a-31f788161c58'::UUID, 'WIA', 'wounded in action', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8d106bef-b772-4239-bd8a-32c0566647c1'::UUID, 'JKO', 'online learning platform', 'general', 'training', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8d222ac3-b05d-4d6a-933c-7a9c2134a069'::UUID, 'UAV', 'unmanned aerial vehicle / drone', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8d31ea0a-bdd1-4540-b825-8fec29ed5808'::UUID, 'eval', 'performance review', 'general', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8d36e8e3-1656-40f0-9ac0-3c894c580953'::UUID, 'billet', 'position / role / job', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8d526720-9696-468d-a97f-3bced85cd7d3'::UUID, 'marshalling', 'aircraft ground guidance / directing vehicle movement', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8d6c6af1-3e49-49ce-b23f-02bb7a17b4f7'::UUID, 'inspection', 'audit / compliance review', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8d6f3845-a621-47d5-93c3-ca0d86341bc4'::UUID, 'TCCC', 'tactical combat casualty care / battlefield emergency medicine', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8d97af60-1104-410c-a82b-49791e9eb28a'::UUID, 'port call', 'scheduled stop / client visit', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8db8c7a8-3cb2-4202-9b48-2cb7bbeee810'::UUID, 'port', 'left side', 'navy', 'general', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8dca2cac-bb1c-4a77-84f1-88e5bbbfb943'::UUID, 'AB (Airman Basic)', 'Entry-Level Staff', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8dcd2df3-a906-4a17-8794-9a38145b748b'::UUID, 'small business set-aside', 'reserved competition for small businesses', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8e2347b5-1fbe-4bec-a1c7-d613da61b875'::UUID, 'FLIR', 'thermal imaging / infrared camera', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8e86be08-0218-47f8-973e-d7af7ad378d8'::UUID, 'DANTES', 'Defense Activity for Non-Traditional Education Support', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8ee63aa7-483f-4bf2-8f41-f19aa1f46c6c'::UUID, 'cost analysis', 'pricing review / financial evaluation', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8ef2dcef-9ef6-424b-b7cd-b19ec7ef02ee'::UUID, 'AFB', 'Air Force Base / facility', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8ef5c8b7-d56c-4231-b96b-ac0cf46eb155'::UUID, 'PO3 (Petty Officer Third Class)', 'Team Member / Technician', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8f01b833-51b5-4fde-8e29-01104267c5bf'::UUID, 'mission ready', 'prepared / operational / qualified', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8f2aa724-5646-43c6-8065-978161dda336'::UUID, 'jury panel', 'deliberation panel / jury members', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8f306f33-641a-449d-be5b-95ce2ea2bc2d'::UUID, 'ACDU', 'active duty', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8f73c03b-4009-406e-a5db-05d99204bb06'::UUID, 'MAJ (Major)', 'Director', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('8f879f11-917f-42b3-a15d-f5e74bb68e83'::UUID, 'CDC', 'Career Development Course / professional development program', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('90058364-405b-4772-a0e8-256cc486e3a4'::UUID, 'BASH', 'bird/wildlife aircraft strike hazard / wildlife collision prevention', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('902b3104-7ee6-40dd-a79b-c28aa4db49c2'::UUID, 'ENS (Ensign)', 'Junior Manager / Associate', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('902c6f3a-9db9-4ea5-8003-2cc8db99bda5'::UUID, 'deck', 'floor', 'navy', 'general', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('90373b26-e615-417b-8d0c-8e1e6f56e9a2'::UUID, 'need-to-know', 'access restricted to relevant personnel', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9059aea5-79c8-49e0-871d-f6c4ab9396ce'::UUID, 'formation', 'team meeting / all-hands assembly', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('908137fe-e093-442d-8e72-3e7879510aec'::UUID, 'NCOER support form', 'performance planning document', 'army', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('908ad3a0-dbd1-437f-aab9-34be03715018'::UUID, 'security classification guide', 'information protection policy document', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('90a2d198-10eb-4e35-97fd-42ce9d3b0beb'::UUID, 'OSI', 'Office of Special Investigations', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('90b20c5e-c87f-45f6-89d5-580cb9485480'::UUID, 'fraternization', 'inappropriate workplace relationship', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('90b59661-4f21-4d1c-a0cb-c18c4aa8f41e'::UUID, 'underway', 'in progress / actively operating', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('90dfaa96-d610-4101-8a69-e69166a92fbf'::UUID, 'platoon sergeant', 'operations supervisor', 'army', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('90e51472-e6a6-450b-ae22-3e73b71bae67'::UUID, 'rack', 'assigned sleeping quarters', 'navy', 'general', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('90ef422e-9f14-4027-98b4-e2cb404e9ee6'::UUID, 'SONAR', 'underwater detection systems / acoustic sensors', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('910aaac6-4b32-4775-8948-22bfdb013128'::UUID, 'squadron', 'operational unit of 100-300 employees', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('916edbd0-e1d7-45e8-8c88-3920b5e937be'::UUID, 'at sea', 'deployed / offshore operations', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('918b4203-922a-4e5d-b411-29ba0a17883a'::UUID, 'COSAL', 'parts inventory system', 'navy', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('918d0286-e7b8-4d1f-aaa0-19a3c05e555d'::UUID, 'MILPER', 'military personnel', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('919b1789-a60c-48c3-b423-87e5d6d73c44'::UUID, 'hump', 'march / endurance exercise', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('91b65c9a-7524-4a8b-b622-854e5603be78'::UUID, 'sortie', 'mission / operation / project execution', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('91fb6777-550a-45e0-8da2-d8f9e55201b9'::UUID, 'augmentee', 'temporary additional staff', 'general', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('92a63e3f-fdee-4e63-a25b-2f6821dae8bb'::UUID, 'warning order', 'advance notice / heads-up notification', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('92b392a7-c08b-4347-971e-f3a0974b618a'::UUID, 'NATO', 'North Atlantic Treaty Organization', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('930b69b2-0eb0-4b9c-a5ad-6f56e31fc474'::UUID, 'family separation allowance', 'deployment family supplement', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9339944a-a9f1-4801-a3f6-f5d60501dd84'::UUID, 'Green Beret', 'Army Special Forces soldier', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('933d3829-353a-43c5-bf78-ce501e9e99ee'::UUID, 'CQ', 'charge of quarters / after-hours supervisor', 'army', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('933f9b5f-4ed9-4457-8e4a-5da1b2570bf7'::UUID, 'junior enlisted', 'entry-level staff', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9341ac31-1082-49cf-9501-5f2c1b55b827'::UUID, 'blue team', 'defensive/home team', 'general', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9355e2d5-3523-4ad2-bb59-a82aa9b6a3c1'::UUID, 'CONUS', 'continental United States / domestic', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9380c3ec-e2cd-48eb-a016-f381359efdfc'::UUID, 'restriction', 'limited privileges / probation', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('943c0f17-b0b8-44b9-812b-e87ea4ef46aa'::UUID, 'TAD', 'temporary assignment', 'navy', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('943dfb93-f835-4295-b34d-997764e8c8ae'::UUID, 'TOC', 'Tactical Operations Center / operations center', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9451d014-2f91-47d9-bc3b-14a1aa339146'::UUID, 'UA', 'unauthorized absence / no-call no-show', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9488d7e1-daa7-4db3-8500-3971b5c86b63'::UUID, 'confinement', 'imprisonment / incarceration', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('94e98a46-274a-4cd1-8a22-3eb7eac06723'::UUID, 'staff duty', 'after-hours duty officer', 'army', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9512b995-7490-4a34-ac78-ddde0b76d5c8'::UUID, 'HQDA', 'Headquarters Department of the Army', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('95149b0f-39b5-4bce-a620-b4024e34f320'::UUID, 'GMT', 'General Military Training / annual training requirements', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('951dc285-97de-4359-9130-2e87b7408814'::UUID, 'incident response', 'cybersecurity event management / breach response', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('95579933-d938-4999-b24a-7dc6e1f1fd12'::UUID, 'XO', 'executive officer / COO / deputy director', 'general', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('957461c3-de79-44b8-b1ad-9f56d2e7069d'::UUID, 'officer', 'manager / executive', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('95c0d6fd-4e79-43ae-a056-b57eb3535d87'::UUID, 'range qualified', 'certified in weapons safety', 'general', 'training', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('95f9a611-6ef1-4b59-8537-bcc244a22e64'::UUID, 'touchpoint', 'check-in meeting / coordination point', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9618c1a8-d88f-46ff-ad39-d26514dca8f2'::UUID, 'FST', 'forward surgical team / mobile surgical unit', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9630fb00-4105-44ad-9810-86418d7a8c9f'::UUID, 'tactical intelligence', 'operational-level analysis', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('964f6a99-fe8e-48b7-ac2d-a9599b6d0089'::UUID, 'flight lead', 'team leader / mission commander', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('966d36da-38f2-40f2-af35-f10d6713a3ab'::UUID, 'AFLOAT', 'Shipboard / Maritime Operations', 'navy', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('969b6289-34ed-41f5-8f09-a6c6b4b65702'::UUID, 'lane', 'area of responsibility / designated role', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('96d15775-a6d3-4bb3-8e18-07e92e1e1982'::UUID, 'enabler', 'support resource / capability multiplier', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('97011cf7-2074-41bf-97d4-1b4fd17f196a'::UUID, 'strike group', 'combined operations task force', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('97116cd0-7732-4ab7-861b-e105888e16b6'::UUID, 'CONOPS', 'concept of operations / operational plan', 'general', 'planning', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('975d3f19-995e-40d1-b6e2-4dd8dbd80883'::UUID, 'mishap', 'workplace accident / safety incident', 'safety', 'Safety', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('97719c00-52ab-48c1-b120-25ab8cedb8b5'::UUID, 'JCS', 'Joint Chiefs of Staff', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('97a41e11-53c3-4433-8bd1-e469b0282074'::UUID, 'LPO', 'Leading Petty Officer / team supervisor', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('97bee0ce-5fc6-4539-926b-02b92c00aea6'::UUID, 'POW', 'prisoner of war', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('97d40d10-378f-4cfe-bf8c-2fd869ae9fcc'::UUID, 'CO', 'Commanding Officer / director / executive', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('97d8caf1-014c-468f-930a-bd1b8fa45a44'::UUID, 'QC', 'Quality Control', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('97e2bc02-7e49-483e-8fdb-8ecd17208bc7'::UUID, 'FEDLOG', 'federal logistics data / government supply catalog', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('980fca96-ac4b-4a58-b1af-313650957ea2'::UUID, 'wellness check', 'employee welfare check / mental health screening', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('98a114e0-5a6b-4961-9fcf-a6fdca973f9b'::UUID, 'BAH', 'Basic Allowance for Housing / housing stipend', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('98a19653-4cdb-40d0-be8b-8bc6e5a3c5ec'::UUID, 'PT formation', 'mandatory fitness session', 'army', 'training', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('98aad44b-4044-4ebd-9ec0-2d2ea9864a49'::UUID, 'corpsman', 'combat medic / field medical technician', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('98b3dc35-045b-479c-913c-02abb4f867b0'::UUID, 'Capt (Captain)', 'Senior Manager', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('98b41aef-0232-4df4-b1ea-0263c6ed76b9'::UUID, 'ground truth', 'verified information / confirmed data', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('98ed41a8-04e6-474d-aa0b-674c04f33107'::UUID, 'JTR', 'Joint Travel Regulations', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('992054da-815a-4e74-bb68-d4412055a08b'::UUID, 'OPNAV', 'Office of the Chief of Naval Operations', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9925cc2f-1ce7-4c42-8aa9-4a704a436e7b'::UUID, 'slate', 'assignment recommendations / position matching list', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9967b2b2-82a1-4d38-8c75-78170154ed0f'::UUID, 'dry hole', 'empty target / unsuccessful operation', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('99eb6c70-8ab5-42bc-bcc2-8037c1a3e7d5'::UUID, 'ASI', 'additional skill identifier', 'army', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('99f440cb-abe5-4043-b212-5d285ce8c9b4'::UUID, 'turn time', 'aircraft servicing interval / turnaround time', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9a09ec13-7f53-4d8a-84b8-33dfa1f09a22'::UUID, 'relieved', 'replaced / succeeded', 'general', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9a1c8602-2fcf-4241-bba9-7b9270b912cf'::UUID, 'radio check', 'communications test / signal verification', 'communications', 'Communications', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9a4e71d4-94e7-4bb2-8d5e-d2ad861dfa04'::UUID, 'courts martial', 'military trial / judicial proceeding', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9a8a06cc-8f3f-43e3-9798-625d61feeb33'::UUID, 'psychological operations', 'influence operations / strategic communications', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9ab51159-a876-44f0-8970-9a859b026600'::UUID, 'sea duty', 'deployable assignment / field position', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9b60f512-b8eb-490d-b609-f2db77821083'::UUID, 'fraternization', 'inappropriate workplace relationship', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9b89bb8c-d85c-4eb3-945c-e82ecb366edb'::UUID, 'overseas', 'international / foreign location', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9ba4d3c1-7d30-49b0-8dbd-b199dce6d26e'::UUID, 'afloat', 'shipboard / maritime operations', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9bad4f02-50b7-4a62-950a-0b839e02f9cb'::UUID, 'contract modification', 'contract amendment / change order', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9bd80a7e-ed38-4e63-9415-309807a5980e'::UUID, 'command', 'organization / business unit / department', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9bf5334b-cfa5-4f30-a65f-dcdb69581daa'::UUID, 'MOS', 'Military Occupational Specialty / job classification', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9c3365cd-861b-450f-97ff-4a683643e464'::UUID, 'SJA', 'Staff Judge Advocate / legal counsel', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9c3a2a2d-73ed-4b9d-9773-315db7cc2d51'::UUID, 'ready for issue', 'available for distribution / in serviceable condition', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9c5123dd-b6d4-4ba2-ab9f-328024e37505'::UUID, 'professional development', 'training / career growth', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9c5788af-bf64-438e-ad0b-5eb5cc7849a2'::UUID, 'qualification', 'certification / credential', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9c6a7cfd-5b13-4025-af7b-2e8bb96d6ff0'::UUID, 'counseling statement', 'documented performance feedback', 'army', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9cc3da3d-a20b-4901-8f84-f2a6c22f61b1'::UUID, 'CO', 'Commanding Officer / director / executive', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9cc90a50-ed89-42ff-b846-7fa9e11352ec'::UUID, 'reveille', 'wake up call / start of day', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9cd48100-eceb-4e38-ad35-0350fc245172'::UUID, 'LT (Lieutenant)', 'Senior Manager / Department Head', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9cf0d426-c715-4b79-9982-9b85c120c20f'::UUID, 'duty station', 'work location / assigned office', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9d0130cb-089b-487c-b010-7c9f132e2bb7'::UUID, 'CMC', 'command master chief / senior enlisted advisor', 'navy', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9d35f52e-29b8-45a0-a8d0-8241f958caf8'::UUID, 'trial counsel', 'prosecutor / government attorney', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9d4f00fc-97c6-41ec-87da-9c35ff8f7675'::UUID, 'space management', 'facility allocation / workspace planning', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9d866331-3b9a-47b3-8a7a-a842f904e708'::UUID, 'CDR (Commander)', 'Senior Director / Division Head', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9d8a9f61-55c7-455f-b768-783d099ce03d'::UUID, 'SEJPME', 'senior enlisted joint professional education', 'general', 'training', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9d928d25-cf18-4326-a425-24ebcac293fe'::UUID, 'IPR', 'in-progress review', 'general', 'planning', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9defe0f6-534b-4d72-97d0-bee0b515333d'::UUID, 'ESWS', 'organizational qualification program', 'navy', 'training', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9e2ea719-9b4f-4bdf-90c3-db5800bab91b'::UUID, 'platoon', 'team of 30-50 employees', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9e399280-fd46-4e39-a012-fb615addb456'::UUID, 'post', 'position / station / assignment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9e52a846-20f1-4dfc-8d98-576948227d75'::UUID, 'JPAS', 'Joint Personnel Adjudication System', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9e70ae97-d18c-4cbe-bdc9-f323c285e798'::UUID, 'environmental compliance', 'EPA/regulatory adherence', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9e897aa2-be79-40c1-8fa6-5936ef2223ba'::UUID, 'FSA', 'Family Separation Allowance', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9ea83e7c-2aeb-45c2-8390-752cccc02564'::UUID, 'PCS', 'Permanent Change of Station / relocation', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9ea9df04-e707-4540-8d71-291de082ab40'::UUID, 'real property', 'government-owned buildings and land / physical assets', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9f08c43f-a7ac-4a2d-90f5-170a24c5d92d'::UUID, 'LTJG (Lieutenant Junior Grade)', 'Manager / Project Lead', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9f24b4e8-7d3a-4862-877c-faac65cbf99c'::UUID, 'effective date', 'start date', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9f90d94e-7e5a-469b-872e-fc5dda5eb690'::UUID, '1LT (First Lieutenant)', 'Manager', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9fa19744-1f04-4d37-a178-8bdfc982101c'::UUID, 'EVAL', 'performance evaluation / annual review', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('9fe92f9b-6258-40e0-b169-f1fd3a09d6e6'::UUID, 'Amn (Airman)', 'Junior Staff Member', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a03440a1-d0a7-4b26-bc83-3b2677aa6ad7'::UUID, 'FTX', 'field training exercise / hands-on training event', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a03a9b1f-4297-478e-ac64-969f572ff473'::UUID, 'receipt', 'delivery acceptance / receiving confirmation', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a0422a17-0001-4881-a873-485f57cd545b'::UUID, 'redistribution', 'reallocation / inventory redistribution', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a04e9e5e-af5f-4319-80e6-ebe4dbd5d371'::UUID, 'UST', 'underground storage tank management', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a06ea164-25ec-485f-a0fb-1e808d983e28'::UUID, 'Capt (Captain)', 'Senior Manager', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a0830b36-8206-4e9e-9d01-bed50a542c0c'::UUID, 'scuttlebutt', 'rumor / informal information / water cooler talk', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a097578a-372b-4ce0-87c2-091ba9659983'::UUID, 'ship', 'vessel / facility / organization', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a099267f-7825-4a0b-82b3-34eccfb1e3a3'::UUID, 'LCpl (Lance Corporal)', 'Staff Member', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a1071368-f419-4b76-98cb-46ceb0564600'::UUID, 'PFC (Private First Class)', 'Junior Staff Member', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a11318c6-a755-4bf3-ae08-b1d4045c7a86'::UUID, 'debrief', 'post-event information gathering / exit interview', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a126031d-70b0-4099-9027-247af1d58eb3'::UUID, 'detailer', 'career counselor / HR placement specialist', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a12e53ca-9839-4a62-96c8-7e10ade9907e'::UUID, 'ashore', 'land-based / office environment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a13ebaff-b982-4496-9fd0-bd7fb89e49ec'::UUID, 'LCPO', 'department supervisor', 'navy', 'leadership', 'Served as LCPO', 'Served as department supervisor')
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a1417342-2cbd-4fa2-8da7-73e0dde88a77'::UUID, 'YN', 'Yeoman / administrative specialist', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a1752449-483e-4b29-b97c-bf4e20ed121a'::UUID, 'SUPPO', 'supply officer / logistics director', 'navy', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a1b16da2-0744-45fa-b6b5-ff2b0c9d8b74'::UUID, 'PFA', 'Physical Fitness Assessment', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a22c6ae5-a3ab-4fbf-ba99-4fe6c4012026'::UUID, 'seniority', 'time in position / tenure', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a2863c27-bb1c-4ca0-baf6-6988220e59ab'::UUID, 'VA', 'Veterans Affairs / veterans services', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a29bc88a-a1c9-4c1e-a7df-7d303a159ee4'::UUID, 'selection board', 'senior promotion panel / executive review committee', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a2bc37bb-bc2c-4fde-8b68-d4757c6eb7a3'::UUID, 'PQS', 'qualification program', 'navy', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a345cd1e-f602-4d90-ac52-460a7e078436'::UUID, 'RADAR', 'radar systems / detection equipment', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a3abdd7e-c724-43ac-aaa2-8a0755ce9dfa'::UUID, 'POW', 'prisoner of war', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a3ad0a83-01aa-4919-8e5e-a9c2881dd9e8'::UUID, 'ROE', 'Rules of Engagement / operational guidelines', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a43202f6-8a89-4ac1-a01a-62af8869a886'::UUID, 'vessel', 'ship / facility', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a436e7dd-3633-4303-980c-8acdd7d8bbd6'::UUID, 'AIT', 'Advanced Individual Training / technical certification program', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a446d4e2-f612-4645-a7fc-dbaacc7eb3b1'::UUID, 'ETS', 'Expiration Term of Service / end of contract', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a461bea5-31f8-4467-af30-3405ada8a71d'::UUID, 'SgtMaj', 'sergeant major / senior enlisted leader', 'usmc', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a4656767-f9f8-4081-be86-24f5ba8a1da5'::UUID, 'TSgt (Technical Sergeant)', 'Senior Supervisor', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a4a67e7f-79c8-4295-b3e0-6534e96b36e8'::UUID, 'mass casualty', 'multiple-victim incident / mass injury event', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a53df08c-268a-412c-b164-c7e4535ef0b2'::UUID, 'wilco', 'will comply', 'general', 'communication', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a57318cb-68ee-42c7-a1bc-e90fbdc8f5fc'::UUID, 'SSG (Staff Sergeant)', 'Senior Supervisor', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a5b8c8da-9113-41a0-8a3e-50dccda520ee'::UUID, 'contracting officer', 'procurement manager / purchasing authority', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a60b1378-2c90-4df9-946a-3aedbaefae56'::UUID, 'LOD', 'line of duty', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a6155339-9ea2-4fd6-8acf-63d15523ca3b'::UUID, 'DUSTWUN', 'duty status whereabouts unknown', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a694cb99-0f5c-4318-b016-2b98dbd7ff77'::UUID, 'ROM', 'restriction of movement', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a6957c94-34dd-42fb-b47a-9d5778335b38'::UUID, 'ISR', 'intelligence, surveillance, and reconnaissance / monitoring and data collection', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a6cd4378-f8c0-4b8d-b062-617b4ef6b849'::UUID, 'HHG', 'household goods / personal property', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a7b00687-27a5-468c-9df4-dc44351427dd'::UUID, 'sick call', 'medical appointment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a7ec0e46-ba09-47c1-b6cf-25814bf37028'::UUID, 'TSP', 'thrift savings plan / government retirement savings (like 401k)', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a7efc5d8-c19b-4029-9131-7ed2ac2cd342'::UUID, 'non-rate', 'entry-level / undesignated', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a81c0646-8921-45d3-9b91-798785c0edda'::UUID, 'OTS', 'Officer Training School', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a88b8e3b-6320-4029-8985-2f2f244be8d7'::UUID, 'watch', 'shift / duty period', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a918db5c-3b3c-4cff-a435-2c977319a15a'::UUID, 'weapons qual', 'certification / proficiency test', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a91d6c1f-e70a-41c7-8cfd-c285556312b2'::UUID, 'NOC', 'network operations center / IT monitoring facility', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a93fc8fb-d99f-4340-bb2b-0e1407b3bdeb'::UUID, 'CSM (Command Sergeant Major)', 'Senior Director', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a97b7758-7e52-457d-b704-a5dcc0365105'::UUID, 'colors', 'flag ceremony / opening/closing procedures', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a9877231-118a-43f6-aba4-882fa0719f1e'::UUID, 'retention', 'employee retention / reenlistment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a9b18770-6910-4b53-b4ce-0807bb86db14'::UUID, 'PACE plan', 'primary, alternate, contingency, emergency communications plan', 'communications', 'Communications', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a9cf8f98-2676-488b-b1e2-95b60400fdb0'::UUID, 'skipper', 'commanding officer / CEO / president', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a9ebaaa0-ab07-4c45-a956-94c16c350adb'::UUID, 'warfare', 'operational specialty', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('a9fef934-10fd-4805-b2a5-1412169cb769'::UUID, 'shipmate', 'colleague / coworker', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('aa2dddae-51b8-4119-b2c4-599e5de5acc4'::UUID, 'EOOW', 'Engineering Officer of the Watch / shift supervisor', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('aa426c3a-3e99-48fd-a8d4-c335f3bd62a4'::UUID, 'starboard', 'right side', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('aa9fb00f-307f-4ab0-bdfe-828d7e87ec3e'::UUID, 'patrol', 'monitoring / surveillance / rounds', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('aaaa881c-eae2-4cb2-ab4a-86a012cf29bf'::UUID, 'cold start', 'engine start from powered-down state', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('aaafb17d-b23f-43ef-9ea3-454debb7576a'::UUID, 'promotion board', 'promotion review panel', 'army', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('aab0e943-0afe-422d-90d4-16b02f2439f5'::UUID, 'AFSOC', 'Air Force Special Operations Command', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('aac6d875-b273-4fc0-aae9-7f7502462d49'::UUID, 'IATT', 'interim authority to test / temporary security authorization', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('aaec75bf-a0dc-41c4-9586-494272026a0f'::UUID, 'transfer', 'relocation / reassignment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('aaeef726-907e-4687-8e1a-04d253536766'::UUID, 'prepositioned stock', 'forward-deployed inventory / pre-staged supplies', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('aaf599a8-337e-4f0b-9e7e-730af6b54293'::UUID, 'burn bag', 'classified material destruction container', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('aafc14f6-bcdf-4f15-9e56-8f45d580671d'::UUID, 'Pvt (Private)', 'Entry-Level Staff', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ab162774-2488-438a-a3fa-62f23e215833'::UUID, 'JSOC', 'Joint Special Operations Command / tier-one operations authority', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ab36c3ff-294b-4d1f-81a4-579770d95c30'::UUID, 'watch bill', 'shift schedule / duty roster', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ab3c628d-5252-4981-a7e8-f959f8707af1'::UUID, 'competency', 'skill / qualification', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ab45798d-5d9f-4233-b342-e76c9f83b956'::UUID, 'MCPON', 'Master Chief Petty Officer of the Navy', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ab541f63-dfb2-438f-8646-5efc0ffb58f8'::UUID, 'IED', 'improvised explosive device', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('abd8a553-6020-4100-b612-58720450f3d2'::UUID, 'dog watch', 'split shift / evening shift', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('abdf1555-e3d2-4d26-bb83-6a7ebc7c7e8e'::UUID, 'khaki', 'supervisor / management', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('abed235d-7655-4cb8-9653-57e4633dca06'::UUID, 'cross-rate', 'career change / job reclassification', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ac0da044-0bd9-45a9-886b-2e13c6b5ab90'::UUID, 'CASREP', 'casualty report / equipment status report', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ac18595e-3417-4ff1-901c-a4abc5af754d'::UUID, 'phase inspection', 'scheduled comprehensive maintenance', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ac1a4fae-c2b3-4a5e-a104-88c4dffb5678'::UUID, 'collateral duty', 'additional responsibility / secondary assignment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ac43fead-7cdb-41df-8a84-3a9144ff63db'::UUID, 'NAVADMIN', 'Navy Administrative Message / policy announcement', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ac91ef83-7295-444d-9c2f-7c3e88a220d0'::UUID, 'UAV', 'unmanned aerial vehicle / drone', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('aca212dd-f821-4e94-9a92-299ea6badd90'::UUID, 'LIMDU', 'limited duty / restricted work assignment', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('aca412a3-eeaf-4380-bd45-b2b0f30715bb'::UUID, 'ODB', 'operational detachment bravo / special forces B-team', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('acb18512-37a2-4b0d-bbca-0774bbf2d789'::UUID, 'NMCRS', 'Navy-Marine Corps Relief Society', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ad102b45-608a-4e6b-bab2-2b7e4c83b57a'::UUID, 'strike', 'rate selection / career choice', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ad652c4e-e40a-4705-bbb1-36d5cb4a6d9d'::UUID, 'MDEP', 'management decision package / budget line item', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('adc0e97e-bd1b-4b19-93b5-cc3676a1e78c'::UUID, 'CAS', 'close air support / tactical air strike coordination', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('addcc8ee-f927-4aa5-b121-627cf766c5bf'::UUID, 'unserviceable', 'non-functional / requiring repair', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ae0488ff-105c-42f8-9ed4-a9368c6d0367'::UUID, 'EPR', 'annual performance evaluation', 'usaf', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ae230225-ac8d-4a5c-b8f0-6531d642b6ad'::UUID, 'task force', 'project team / special initiative group', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ae37f0ea-fc2c-4913-8ece-7c3fd126313d'::UUID, 'SA (Seaman Apprentice)', 'Junior Staff Member', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ae8571e9-0c62-485d-bd2f-ad81fc1eb259'::UUID, 'general court martial', 'major judicial proceeding / felony-level military trial', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('aeaa0543-ac07-402a-babb-7692bb0de5be'::UUID, 'PRT', 'physical fitness assessment', 'navy', 'training', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('aec2f2ea-df29-4479-a584-de1cc9220001'::UUID, 'FMC', 'fully mission capable / operational ready', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('aec54d5a-0c72-4597-bad4-9ddae357e270'::UUID, 'MCPO', 'Master Chief / Senior Executive', 'navy', 'rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('aee947b4-5bf1-491c-89af-e814b74b0d98'::UUID, 'TRICARE', 'military healthcare system', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('aef54ea7-b945-4bd8-9ade-f33a224c8dfb'::UUID, 'AAR', 'after-action review / post-project analysis', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('aef5826c-4137-430a-9aba-eb91a3d8c925'::UUID, 'gouge', 'study guide / insider information', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('af03397a-71e9-4db5-90c8-f2e7441868f5'::UUID, 'PED', 'processing, exploitation, and dissemination / data processing and distribution', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('af247975-6c26-4f33-88d4-b4e59730ee5d'::UUID, 'crypto', 'encryption / security systems', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('af3f8cfc-7b49-48c5-a9d6-6bdbb3ef97f1'::UUID, 'DFAS', 'Defense Finance and Accounting Service', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('af58a237-d923-4f52-91c4-7a53cf25a729'::UUID, 'fitness report', 'performance evaluation / review', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('af8ecf35-c434-46ed-82d0-cd200fbbf7cf'::UUID, 'FYDP', 'future years defense program / long-range spending plan', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('afa061a0-f33a-45a2-bf4c-6ac20178ebd8'::UUID, 'turned over', 'transferred responsibilities', 'general', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('afab84e6-edc1-4195-b247-a67fe3acef36'::UUID, 'task force', 'project team / special initiative group', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('afcb7df2-0b9a-4331-9957-63366ad774de'::UUID, 'CPT (Captain)', 'Senior Manager', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('afe363aa-6af5-48c2-ad87-1414ed344ee8'::UUID, 'ORM', 'Operational Risk Management / risk assessment', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('afecfb7f-1533-4130-b8d2-12df09c407bf'::UUID, 'JCS', 'Joint Chiefs of Staff', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('affb2741-a9d4-4655-a9d9-3b7feebb4738'::UUID, 'cadre', 'training staff / leadership team', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b023efaf-b221-47f7-bacc-847f6083358c'::UUID, 'LOE', 'readiness assessment', 'navy', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b047c55b-2743-4f4f-a103-01542be842b0'::UUID, 'bridging', 'temporary bridge construction / gap crossing', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b04bc8e4-a837-4533-ab61-8c987ceef396'::UUID, 'deconflict', 'resolve scheduling conflicts / coordinate', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b05ae138-ce72-4b2b-b6bf-7bb76889f86b'::UUID, 'BAS', 'Basic Allowance for Subsistence / meal allowance', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b096f8c5-4401-4b8d-8be5-52e987c3d12a'::UUID, 'taps', 'end of day / lights out', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b0b87997-9921-4035-a252-3e43d2a50181'::UUID, 'Lt Col (Lieutenant Colonel)', 'Senior Director', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b0d2dd77-6146-4f66-87d7-c7b0c34f1900'::UUID, 'TOC', 'tactical operations center / command center', 'army', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b0d7454c-56d5-4b70-807e-2b2ff88a656a'::UUID, 'EW systems', 'electronic warfare / signals systems', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b0e2d1c0-b996-4c62-a5a3-03b56c50aed9'::UUID, 'AAR', 'after-action review / post-project analysis', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b1252021-c931-46d6-bea5-0d2a0404b66c'::UUID, 'E&E', 'escape and evasion / emergency extraction', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b12ffebe-1d38-4280-a70b-a0fc95076710'::UUID, 'chain of command', 'organizational hierarchy / reporting structure', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b16a890d-da06-4799-9d31-6d65e70a158a'::UUID, 'property book', 'official asset register / inventory of record', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b1840e55-4576-4d24-b117-e68a69ca8ca7'::UUID, 'MILCON', 'military construction / government construction project', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b18af438-ba1c-4aaf-8fcb-11507bce8ca1'::UUID, 'galley', 'cafeteria / break room', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b1d5da6b-a70a-4573-b739-0134f9797b7b'::UUID, 'standby', 'wait / hold / pending further direction', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b1e821cb-0502-44fa-90a4-3e61d75b5a35'::UUID, 'cyber key terrain', 'critical digital infrastructure', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b1eee2cb-7183-486a-b71a-d110eff286ef'::UUID, 'board of inquiry', 'review panel / adjudication board', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b247fb0f-7ef5-496d-8d59-fd021842ead0'::UUID, 'depot level maintenance', 'factory-level overhaul / major repair facility', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b25d7603-9a61-4f12-9ddd-2f5219e1e164'::UUID, 'kit', 'equipment / tools / supplies', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b263361c-c214-43d4-a98c-5500857ad431'::UUID, 'MCPON', 'Master Chief Petty Officer of the Navy', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b265d270-24c9-42f6-b8e1-1efcd7f46109'::UUID, 'FLIR', 'thermal imaging / infrared camera', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b277c476-99e2-4e33-bdfe-5d55b110f3b7'::UUID, 'blue jacket', 'junior enlisted / entry-level employee', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b2bfdf93-c6bc-400f-8e5e-1527136bcaf7'::UUID, 'Role 3', 'hospital-level care / definitive medical treatment', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b2e733a4-837d-4581-a0c8-6f8baafc8865'::UUID, 'IG', 'Inspector General / compliance auditor', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b31b42c6-dd54-42a6-870f-cf3508e0c7e7'::UUID, 'Article 15', 'formal disciplinary action', 'army', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b330b8c0-21b2-46ff-af7c-bebf73fac966'::UUID, 'LCpl (Lance Corporal)', 'Staff Member', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b334a192-7315-45c9-a2bc-7e750a662d83'::UUID, 'SARC', 'Sexual Assault Response Coordinator', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b33547b9-7960-420c-b393-50e7fd5d5b0c'::UUID, 'UCMJ', 'Uniform Code of Military Justice / military law', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b3414997-40f9-4d16-a8b6-98d71f228595'::UUID, 'EAS', 'End of Active Service / contract completion date', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b371c835-a8f3-4dff-9a1f-84e6c0970381'::UUID, 'on station', 'at assigned location / on post', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b3725cb4-2a3c-4044-a034-b5d89659b892'::UUID, 'PTAD', 'permissive temporary additional duty', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b387dfee-90e5-40b1-8931-0a0da60b91f2'::UUID, 'PHA', 'periodic health assessment / annual physical examination', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b3985c25-c1a6-4e7d-aed6-a17179035b45'::UUID, 'ATG', 'Training and Readiness Organization', 'navy', 'organization', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b39bc139-fafd-45cf-adb7-915f6daca96f'::UUID, 'MCPO (Master Chief Petty Officer)', 'Director / Senior Director', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b3a64877-796b-4566-b13a-e2503fb8a11a'::UUID, 'RIMPAC', 'Rim of the Pacific Exercise', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b422882b-8210-4757-8349-371ada43d078'::UUID, 'indoc', 'orientation / onboarding', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b45520ce-4509-4c1c-8b0b-c642603c3885'::UUID, 'float up', 'submit for review', 'navy', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b455da67-f7e7-42c4-9984-72dc73397458'::UUID, 'white space', 'unscheduled time / available capacity', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b4569d5a-a9b0-4f9b-8b5c-542fec3ed7f3'::UUID, 'rotation', 'assignment cycle', 'general', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b46471fb-4d97-428e-b31c-d6e5f87b0b6a'::UUID, 'field radio', 'portable communications equipment', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b47391f7-da52-401d-97c5-e68b6fb298a3'::UUID, 'NLT', 'no later than / deadline', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b4d8ca8d-3c37-4f17-b972-4a385ec0173c'::UUID, 'SCIF', 'secure facility', 'general', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b522e7a4-c915-47ad-9bbd-3c2dc979adb2'::UUID, 'scuttlebutt', 'rumor / informal information / water cooler talk', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b56cf19a-6f5a-40ec-8042-808b815f9867'::UUID, 'SCIF', 'Sensitive Compartmented Information Facility / secure facility', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b577d5ab-631c-434f-98bf-904e454ea53b'::UUID, 'petty officer', 'supervisor / team lead', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b58249c6-7d55-4987-8bb4-8ac2083ab4fe'::UUID, 'warfare', 'operational specialty', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b5f1dc96-013f-48a6-8270-ed293ff64cf5'::UUID, 'yeoman', 'administrative assistant / office manager', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b63aeccd-654b-453e-9f68-283086443b6b'::UUID, 'base year', 'initial contract period', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b63d3bfd-22aa-402e-9996-b0ac33c289c4'::UUID, 'DFAC', 'dining facility', 'army', 'general', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b666f13a-86fc-461f-95b6-dbd73b4a92d0'::UUID, 'company', 'department of 100-200 employees', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b67e2ab2-e2d2-4400-96a4-2040f3c84cbe'::UUID, 'PCS', 'Permanent Change of Station / relocation', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b68fcfc3-3f05-4252-b224-388978e1c712'::UUID, 'component', 'division / branch / department', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b698d452-4205-42d8-840e-012c5b2e749e'::UUID, 'berthing', 'living quarters', 'navy', 'general', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b6cbd5d4-8a26-4d71-bd7b-4e4a057f4025'::UUID, 'safety stand-down', 'safety awareness pause / mandatory safety training day', 'safety', 'Safety', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b793b13e-1cee-409e-9701-8b818472e85f'::UUID, 'OPORD', 'operations order / project plan', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b7d45305-71e4-4a69-9382-3a0b4bff0feb'::UUID, 'SL', 'skill level', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b7e4fb41-0d44-45b2-b75f-5b881a58cd9a'::UUID, 'IA', 'Individual Augmentee / temporary assignment', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b823930f-98d0-4b73-b5a5-bb3d3afc3d28'::UUID, 'affirmative', 'yes / confirmed', 'general', 'communication', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b831cdb2-e5d2-43d8-bf7f-16824a31dcb1'::UUID, 'squadron', 'unit of 12-24 aircraft / organizational unit', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b8353c9f-d74c-49df-9065-abd6627b37b8'::UUID, 'NKO', 'online learning platform', 'navy', 'training', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b83a13f0-de16-475a-85a8-066b4d0199e1'::UUID, 'PAO', 'Public Affairs Officer / communications manager', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b870ce55-3d23-47a2-b343-03d7aef76782'::UUID, '3M', 'Maintenance Management Program', 'navy', 'maintenance', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b871b0ad-4ddc-4d06-a5c3-7df43437c963'::UUID, 'joint', 'multi-organizational / cross-functional', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b8aa0d6b-5cec-4f0a-8067-03b3d920d994'::UUID, 'enclave', 'isolated network segment', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b8bcdda8-7849-4c66-bb3b-b95d5dc62e99'::UUID, 'SSgt (Staff Sergeant)', 'Team Lead / Supervisor', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b8d4df06-4ac5-4e3b-bbfe-91288b6f2b4e'::UUID, 'command deck', 'executive level / senior leadership', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b915a3d5-ab9b-481d-81fd-3693975a56b2'::UUID, 'back brief', 'confirmation briefing / task acknowledgment', 'general', 'communication', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b9299424-ad3b-4e9b-8aba-ddf3d1496498'::UUID, 'IFF systems', 'identification systems', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b929ad61-7aa0-4abc-ac8c-7a61fe7a0fad'::UUID, 'anchored', 'parked at remote location', 'navy', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b96e3067-b5b7-48fd-921f-b6ad04ad44a9'::UUID, 'flag officer', 'executive / C-suite', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b9958d4d-6c00-4d3c-9c97-8a412be13527'::UUID, 'MOC', 'Military Occupational Code', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b9bb1eda-a2c1-4d0d-8871-707ad8d3d71a'::UUID, 'LtCol (Lieutenant Colonel)', 'Senior Director', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b9c45c6d-34cb-402b-b30e-6a844885b80f'::UUID, 'shipmate', 'colleague / coworker', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('b9c4ef44-3313-4781-8f15-0395be6d6397'::UUID, 'SAEDA', 'subversion and espionage directed against the Army / insider threat awareness', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ba3f2b6e-4fbd-459c-af5b-00749408ced2'::UUID, 'green deck', 'full operations authorized / all-clear status', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ba634140-76b0-45eb-a574-637b08c2838b'::UUID, 'logistics', 'supply chain / operations support', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('baa6ba90-cdd8-4f17-9b6a-451ff0c6a7a5'::UUID, 'PFC (Private First Class)', 'Staff Member', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('baacf33d-6d27-4835-9a70-65d3b54eceba'::UUID, 'active duty', 'full-time employment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bac59a74-ea67-4b52-81c8-3182b144b1c0'::UUID, 'striker', 'apprentice / trainee in specialty', 'navy', 'training', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('baec1e11-f17e-4a6b-afe8-7c0743a7316a'::UUID, 'general quarters', 'emergency response drill', 'navy', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('baecf104-80a1-4f04-b5cd-9b36ba32127f'::UUID, 'non-rated', 'unqualified / not yet certified', 'general', 'training', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bb18d943-02ac-4891-9f49-1d127be2ac17'::UUID, 'penetration testing', 'authorized security testing / ethical hacking', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bb1dab8a-bb63-4599-86cb-c0c52d575af4'::UUID, 'OCS', 'Officer Candidate School', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bb3ef9c1-03d0-49c6-9ed8-b8683580c99e'::UUID, 'peacetime', 'non-deployed / normal operations', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bb505c55-791d-4371-9ad2-939538246352'::UUID, 'net call', 'network roll call / communications check-in', 'communications', 'Communications', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bb6b3a85-04ea-46ce-95d4-3f932e1d5f00'::UUID, 'cold iron', 'all systems shut down / fully powered off', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bb7e8053-43f8-4d98-8726-4c8dfb23c550'::UUID, 'XO', 'Executive Officer / deputy director / second-in-command', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bb92d6ce-b8a0-404d-a9e8-7be95d805f8f'::UUID, 'CMSgt (Chief Master Sergeant)', 'Director', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bb99b086-1ba4-4e86-8047-87471c920207'::UUID, 'platoon', 'team of 30-50 / large work group', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bbca159f-56e5-4c59-9b51-22b5e25ea306'::UUID, 'negative', 'no / denied', 'general', 'communication', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bbddc7f1-32c2-47f3-84c0-f4994bfd4699'::UUID, 'opcon', 'operational control / day-to-day authority', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bc0f04ac-ad05-4f46-90d9-be547fc65f3d'::UUID, 'OJT', 'on-the-job training', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bc177ec9-96b5-438b-9fff-5fd17332eb3d'::UUID, 'barracks', 'company housing / dormitory', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bc2039d2-1b4c-4c71-8220-336e5b2bf94d'::UUID, 'NSN', 'national stock number / government part number', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bc36b3c6-0d5e-4de8-9557-0e261f28a1de'::UUID, 'AWOL', 'absent without leave / unauthorized absence', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bc4b01f0-2d00-4b1c-96fb-12cce8985994'::UUID, 'below decks', 'internal/interior areas', 'navy', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bc68411b-3c3d-406f-9996-b98a2b6a8e33'::UUID, 'SIQ', 'Sick in Quarters / medical leave', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bc6e304b-82dc-4e53-8da8-71777c0014d2'::UUID, 'quarters', 'housing / living space', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bc97e643-2d63-475d-be68-1e0f40b36593'::UUID, 'peacetime', 'non-deployed / normal operations', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bc9db36e-b57a-40c0-a24d-b29dc82d96a8'::UUID, 'restriction', 'limited privileges / probation', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bd206388-6153-4a08-9bd8-80c42679fbe1'::UUID, 'crew rest', 'mandatory rest period / regulated downtime', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bd44e203-547a-4d2e-8804-83dfa4b58e2e'::UUID, 'Maj (Major)', 'Director', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bd67ac68-7a4d-403d-9e0e-1d396fdc2ac7'::UUID, 'SIGINT', 'signals intelligence / electronic communications analysis', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bdba6a6d-b769-4e9b-94ea-fa1e97254791'::UUID, 'COMPTUEX', 'Multi-Unit Training Exercise', 'navy', 'training', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bdc457f5-9aa1-4086-9173-e2faf42baf47'::UUID, 'FMC', 'fully mission capable / operational ready', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('be563918-5315-48d4-aaed-8a550cde93e3'::UUID, 'CMSgt', 'chief master sergeant / executive leader', 'usaf', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('be5b8b4c-b1b6-4535-a78a-1a23812b16ac'::UUID, 'muster', 'roll call / attendance check / team meeting', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('be6e76ba-a615-4f82-b881-14d5331b3102'::UUID, 'staff', 'support personnel / administrative team', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bea07a67-9b75-441d-9355-cee17f81e1f8'::UUID, 'downrange', 'in the field / at project site', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('beac28d2-1ab0-450b-bf24-213f0298b2c3'::UUID, 'reveille', 'wake up call / start of day', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('beb17c7f-f611-4ee7-ab17-13b84c7af8f5'::UUID, 'classification authority', 'information security decision-maker', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bec5aedd-5340-4083-b476-1ee09a05651b'::UUID, 'mission', 'objective / goal / project', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bed54665-f863-47d2-a09d-86d950cd5fb4'::UUID, 'administrative board', 'organizational review panel', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bf023628-19a5-4444-94b1-cc0f31010f58'::UUID, 'OOD', 'Officer of the Deck / watch supervisor', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bf21ae11-1601-40a9-af6a-5026063096fc'::UUID, 'liberty', 'time off / personal time', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bf71b365-1f7b-4457-8278-3a65a2668e9a'::UUID, 'LOD', 'line of duty', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bfa09fc3-a046-43f8-a355-cefe85295432'::UUID, 'LCPO', 'Lead Chief Petty Officer / department supervisor', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bfc87254-4299-4e20-8eec-ac98a1db2b1b'::UUID, 'EDIPI', 'Electronic Data Interchange Personal Identifier', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bfd8f4d7-f154-4c06-ad4d-021f9ae17aa1'::UUID, 'AR 15-6', 'Army investigation regulation / formal inquiry procedure', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('bfee40ff-8f87-432a-a240-d130639d44ee'::UUID, 'SEAL', 'Sea, Air, and Land / special operations', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c00b2eae-2a4f-47af-b56d-995d1fa2fc62'::UUID, 'garrison', 'home station / main facility', 'army', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c0130774-38e6-4374-ada8-092a81409df2'::UUID, 'ROTC', 'Reserve Officers'' Training Corps', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c017ab10-b7f6-479a-80fe-e80795631af9'::UUID, 'MWR', 'Morale, Welfare and Recreation / employee services', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c0207afe-f098-47a3-b553-7e8173687e33'::UUID, 'regiment', 'business unit of 1,000-3,000 employees', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c03925eb-6147-4d9a-a5dd-925f651fd323'::UUID, 'TSP', 'Thrift Savings Plan / retirement plan', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c0a6a328-efab-420e-a6cf-77bb4b3ec510'::UUID, 'S4', 'Logistics section / supply chain department', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c0c66d73-0d84-4950-8671-6ed0ed8b5372'::UUID, 'IFF systems', 'identification systems', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c0d1dd09-cbe4-4d0b-82a7-5503931bd720'::UUID, 'APT', 'advanced persistent threat / sophisticated cyber adversary', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c0f5aaa8-16fe-4597-accd-48344ea731ad'::UUID, 'CCT', 'combat controller / special operations air traffic controller', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c0f77311-5538-4eae-82c5-10ea5bcdba63'::UUID, 'JO', 'Junior Manager', 'navy', 'rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c0fcfdc5-cbbb-4314-a023-4b975db21972'::UUID, 'incentive fee', 'bonus for exceeding targets', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c10917c9-195b-4e70-84b9-92194b1a2b91'::UUID, 'pier', 'dock / facility entrance', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c1225abf-5015-410e-a54e-84ed5e7a6776'::UUID, 'best value', 'optimal quality-to-cost evaluation', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c186ed8a-e295-4b76-9623-13ecc16b4561'::UUID, 'VHA', 'Variable Housing Allowance', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c1a76a91-b661-4a2f-bed8-e98e073b000c'::UUID, 'IED', 'improvised explosive device', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c1b11f5a-6fdd-4224-b5b1-8b35cecfd85f'::UUID, 'forward deployed', 'on-site at client location / field office', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c1d85666-4862-447e-bc49-18a084433d37'::UUID, 'wilco', 'will comply / acknowledged and will execute', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c20b0cd9-3a6d-475f-89be-f950d68579cc'::UUID, 'tour', 'assignment period / rotation', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c22b5ae6-89d3-43c1-8173-54badea346fe'::UUID, 'afloat', 'shipboard / maritime operations', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c25cffc1-7978-4964-9293-0c104cba7212'::UUID, 'MEDINT', 'medical intelligence / health threat analysis', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c31a5862-a2da-4bc6-bfbb-4810ec7a58c4'::UUID, 'bow', 'front', 'navy', 'general', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c3448603-edaf-4d32-890c-b2bcd949b0b0'::UUID, 'NLT', 'no later than / deadline', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c3c32efe-8334-4773-9542-a41b11f4b543'::UUID, 'compound', 'secure facility / target location', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c3ee65fb-90ee-46fc-be7a-6e790c6cbb2e'::UUID, 'NCOER', 'NCO Evaluation Report / performance review', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c40c4c60-1e93-4c56-9cda-88141678c874'::UUID, 'QUAL', 'qualification / certification', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c431a710-6ea8-4d00-8f2d-0b13888afd57'::UUID, 'contingency', 'emergency response / backup plan', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c43dc3ce-c7ef-4bd9-9cb5-a7464525dcf0'::UUID, 'OMPF', 'official military personnel file / employee personnel record', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c4482e41-0dc6-47d8-a95a-84c699d07697'::UUID, 'belay', 'stop / cancel previous order', 'navy', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c44cf83c-d98f-4dd7-88ad-e8b14964e231'::UUID, 'command', 'organization / business unit / department', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c4ba1979-9aa2-4191-92ff-3429d22a5c0d'::UUID, 'CSM', 'command sergeant major / senior enlisted leader', 'army', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c4c21952-df71-45ad-9735-8b7a487f13d1'::UUID, 'fusion center', 'multi-agency coordination center / integrated analysis center', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c4f4df65-09cd-407e-8797-7514a812bcf0'::UUID, 'yeoman', 'administrative assistant / office manager', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c526d379-eda9-4749-98a5-ac83295299d6'::UUID, 'wargame', 'scenario planning / simulation exercise', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c52ad34c-589f-45ce-907d-6120564f7f6c'::UUID, 'medical readiness', 'workforce health compliance / medical fitness status', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c53dcf5b-176a-45d7-a2ba-2b80e44597bd'::UUID, 'JFTR', 'Joint Federal Travel Regulation', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c551fa08-69ec-4abc-8300-389091c6e87b'::UUID, 'enlisted', 'non-management / technical staff', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c56006df-94ff-48bc-8b4a-8a8948b03c5e'::UUID, 'sailor', 'Navy employee / naval staff', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c565dcd7-5a5b-49e3-87a0-1d655a4486a4'::UUID, 'EOOW', 'Engineering Officer of the Watch / shift supervisor', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c56738d6-dd22-4ccf-ab21-acbf362af97e'::UUID, 'crypto', 'encryption / security systems', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c5767f1b-6ff7-45e7-b141-5b00d845d115'::UUID, 'chit', 'request form / approval document', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c5788176-5f24-4bea-a2c4-a0f7747b83f1'::UUID, 'DD214', 'separation document / discharge paperwork', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c5db872e-f705-4e7e-8f59-de74247c2b7e'::UUID, 'mission capable', 'operationally ready / available for tasking', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c615e87d-ba69-4649-8a40-71c0478369b3'::UUID, 'intermediate level maintenance', 'regional repair facility maintenance', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c64fa744-3ee2-4855-b94c-4c13eb5489c6'::UUID, 'deck plate', 'frontline / shop floor / ground level', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c6723719-42c7-459c-a623-cf40314bedbe'::UUID, 'company', 'department of 100-200 employees', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c7335892-2930-4522-9e48-d23e3b4d6253'::UUID, 'DFAS', 'Defense Finance and Accounting Service', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c74ca39a-96a1-4afb-8897-e7aeecd13857'::UUID, 'fireteam', 'small team of 4', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c76b6ef4-71c9-46db-9d92-1fcb5da71c3b'::UUID, 'WTI', 'Weapons and Tactics Instructor', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c800a96a-b497-4337-a2cf-3055a8b052d1'::UUID, 'CO', 'commanding officer / CEO / director', 'general', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c8836839-18a9-4321-ab51-0eba5473498c'::UUID, 'MIA', 'missing in action', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c8890481-e3ae-437b-9cc1-de86da05ef45'::UUID, 'FOB', 'forward operating base', 'army', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c890bf6c-c033-46cd-a4ce-f87975fd7da1'::UUID, 'hot pit refueling', 'rapid refueling without engine shutdown', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c895ac3e-8503-44aa-a57d-e4f5604007c9'::UUID, 'wingman', 'trusted partner / backup support person', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c8adb598-1a6b-40b1-aff8-2768928f2778'::UUID, 'squad', 'team of 8-13 employees', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c8bb4f2f-1375-47ea-8a08-136baaa38353'::UUID, 'DIACAP', 'DoD information assurance certification / legacy security certification', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c8c3647f-90bb-400c-8ea2-86eb4f6a8c0f'::UUID, 'cockpit resource management', 'crew coordination / team communication in operations', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c8c79960-caef-4c53-9e14-7db0e011fab0'::UUID, 'LTC (Lieutenant Colonel)', 'Senior Director', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c91ee2f9-92d9-44c4-9a73-5bda5224c41a'::UUID, 'trap', 'arrested landing / successful carrier landing', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c95fd0b4-3e7f-4a05-b5ef-36a6bd5d68fb'::UUID, 'postflight', 'post-operation inspection / post-use assessment', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c970386b-7721-4a3c-a26f-dfa4c8c92eab'::UUID, 'short timer', 'employee near end of contract', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c975fc27-9814-470b-ab07-7d1887b4b965'::UUID, 'footprint', 'organizational presence / resource usage', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c9b45c29-5c49-4ede-b4e7-f11f6e901d7a'::UUID, 'lead paint', 'lead-based paint remediation', 'safety', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c9bb42c3-8b98-45df-8583-a6d6739fabdc'::UUID, 'EDIPI', 'Electronic Data Interchange Personal Identifier', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c9e5b2a3-68f2-4a28-b00a-5be10ef0e727'::UUID, 'MILCON', 'military construction', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('c9e717b7-d638-4eb8-a649-3ca0289a2bc7'::UUID, 'ROM', 'restriction of movement', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ca42fe31-4119-4244-82c7-bf37d3e3cbcd'::UUID, 'division', 'department / team / work group', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ca5eec2b-50c0-4615-b3ec-ed6d8fd85621'::UUID, 'PVT (Private)', 'Entry-Level Staff', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ca87ddef-df99-4c91-9854-b4e5462d1e05'::UUID, 'troop', 'soldier / staff member', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ca8edd3e-fd87-4316-82a6-b73742350555'::UUID, 'carry on', 'continue / resume normal operations', 'general', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('caedeef9-5eca-4dc8-961f-6f77aa4683c1'::UUID, 'bigot list', 'restricted access roster', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('caf8c3d6-52bd-488b-b98e-88d00bd67358'::UUID, 'log', 'record / documentation', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cb08eb3d-d405-4db6-b13b-4fc893aba625'::UUID, 'CASREP', 'casualty report / equipment status report', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cb090e77-9336-4874-acfb-aa114e1e4705'::UUID, 'TSTA', 'integrated training assessment', 'navy', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cb1d4135-bd19-404e-a95d-6aea4451e68e'::UUID, 'starboard', 'right side', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cb48645b-e712-4321-8514-3e50f74e926e'::UUID, 'OPPE', 'operational readiness evaluation', 'navy', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cb7dcb3b-58e5-4ad7-9b42-8bc8fbc35df2'::UUID, 'page 13', 'administrative counseling record', 'navy', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cbcec6e2-8d6a-429f-af85-5c813383b0c3'::UUID, 'MRE', 'Meal Ready to Eat / field rations', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cbe4a2a1-ba87-4527-bc21-ae826ff87de3'::UUID, 'CLIN', 'contract line item number / billable item identifier', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cbfe9a83-4ad4-4b54-bf3c-f9133e632c2c'::UUID, 'YN', 'Yeoman / administrative specialist', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cc00f420-b5d2-443a-8e30-2f0fac9674b9'::UUID, 'active duty', 'full-time employment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cc0feea7-d77b-4cc5-8ed9-4505044f632d'::UUID, 'NEC', 'Navy Enlisted Classification / specialty code', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cc12653d-cd98-4149-83f1-8d0ddc4f84c5'::UUID, 'MEDEVAC', 'medical evacuation / air ambulance transport', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cc2031f5-7648-4494-8f58-6d3741bcf651'::UUID, 'DTS claim', 'electronic travel voucher / online expense report', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cc3a17df-b9d2-4491-857a-4aff8e8f3ed4'::UUID, 'POA&M', 'plan of action and milestones', 'general', 'planning', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cc4d1fe6-3d2c-4330-9d2c-89a3053ddcfd'::UUID, 'compartmentalized', 'need-to-know basis / restricted access', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cc9356f2-bb79-4f1b-8314-449342256cf3'::UUID, 'PAO', 'Public Affairs Officer / communications manager', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cce5ec07-4c7a-4f76-b80c-c7a9d46ef1fb'::UUID, 'CSAR', 'combat search and rescue / hostile area personnel recovery', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cd00a0fa-7e15-4fea-b333-185d52f91e68'::UUID, 'all-source analysis', 'comprehensive data analysis / multi-source research', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cd1dd2d4-ae1b-447d-acbd-93899abb6b8e'::UUID, 'CPARS', 'contractor performance assessment reporting system / vendor rating system', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cd2fa490-a16c-4e0e-a36b-6f7006fa463c'::UUID, 'petty officer', 'supervisor / team lead', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cd68f8ae-774a-43b7-8fc2-6d88db22c5e5'::UUID, 'accountability', 'asset/personnel tracking', 'general', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cd8be314-e19a-47fb-8985-56d353843bbf'::UUID, 'mentored', 'coached and developed', 'general', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cd93917d-36d1-4506-a1ab-dd14f5fc28b7'::UUID, 'manning', 'staffing', 'general', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cde30b04-277c-40fd-9ec8-ecfb7d918ffa'::UUID, 'unit basic load', 'minimum required supplies / baseline inventory level', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cde82614-359b-4dd5-9abc-fc48685f3782'::UUID, 'OPORD', 'operations order / project plan', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cde9356b-50a5-4fca-a800-61e4de8f94f1'::UUID, '2ndLt (Second Lieutenant)', 'Junior Manager', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cdfc482a-7470-42c9-966c-f40d62be3fb8'::UUID, 'SJA', 'Staff Judge Advocate / legal counsel', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ce027ebf-6818-44ff-987d-3b554eb7ee4b'::UUID, 'SR (Seaman Recruit)', 'Entry-Level Staff', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ce2a4f3b-0fa1-480e-90f3-eecb91a1d273'::UUID, 'period of performance', 'contract duration / project timeline', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ce4441be-8e3e-4ca0-9c5f-f09a68370ad6'::UUID, 'OPSEC', 'operational security / information security', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ce901ce2-005c-44a6-8b65-ae3c4bd0084a'::UUID, 'per diem', 'daily expense allowance / travel reimbursement rate', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ce946468-4871-4fd4-83ad-e9dde6bc7fdd'::UUID, 'fitness report', 'performance evaluation / review', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ce9e8279-710d-46bf-b278-e2d7d88801b5'::UUID, 'JOs', 'Junior Managers', 'navy', 'rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ceba999a-a7d6-43e8-aeeb-bed94caa6864'::UUID, 'MILCON', 'military construction', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cf0e85a4-90ae-4c4b-8cf8-db5791a1a29e'::UUID, 'field', 'field operations / off-site deployment', 'army', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cf34290c-6c91-427f-bf76-9ac03f8e7443'::UUID, 'SCI', 'Sensitive Compartmented Information', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cf3b7e28-7961-49d8-a4df-8e6b2557c5e2'::UUID, 'AFB', 'Air Force Base / facility', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cf53ae21-d33e-401b-9538-7279c626dfd7'::UUID, 'excess', 'surplus inventory / overstocked items', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cf6d9980-211d-49b6-9b6f-4f954fed63da'::UUID, 'knock it off', 'stop immediately / cease activity', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cfa77f6c-3dfb-48bf-9834-3e68430f1699'::UUID, 'expenditure', 'actual spending / disbursement', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cfa9eed1-6a2f-4118-98fe-70079d61ebb7'::UUID, 'SN (Seaman)', 'Staff Member', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cfc930f1-c996-40a9-8ee2-ae797bdae0ad'::UUID, 'SR (Seaman Recruit)', 'Entry-Level Staff', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('cff70feb-ed65-4dc5-a7a5-ca9511163d8c'::UUID, 'BAS', 'battalion aid station / forward medical clinic', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d00d43a7-709c-4a5f-bb33-74b2355e6bfc'::UUID, 'CSS', 'combat service support / operational support', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d019d765-4962-4cac-9fc7-51ae7c9d916b'::UUID, 'OSI', 'Office of Special Investigations', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d02083dd-e2de-4144-a271-f2ee93558507'::UUID, 'NEC', 'Navy Enlisted Classification / specialty code', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d0440496-6777-4d98-b539-da864fa8a329'::UUID, 'mission critical', 'essential / high priority', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d04fe3ef-12fc-4bdb-b465-f28892642984'::UUID, 'SELRES', 'Selected Reserve', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d0e4451f-a3e2-4165-86f3-8e8d33bb696d'::UUID, 'SR (Seaman Recruit)', 'Entry-Level Staff', 'uscg', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d0efcd6a-4eb2-4852-8c5f-a880eb0859d5'::UUID, 'A1C (Airman First Class)', 'Staff Member', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d1010322-a752-482b-9aab-20b857a5d445'::UUID, 'red team', 'adversarial review team / challenge group', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d130d07b-7d71-4a87-84c3-ba82b750e6be'::UUID, 'WTI', 'Weapons and Tactics Instructor', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d1496840-3ae8-4051-bc09-e05b8dbfcf33'::UUID, 'eval', 'performance review / annual assessment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d183fc3b-88f3-4330-862b-8d47fc9be05e'::UUID, 'relief', 'replacement / successor', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d19bc572-5237-411d-8fd7-7602766a9c67'::UUID, 'CPO (Chief Petty Officer)', 'Manager', 'uscg', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d1d9be42-fd12-4d7c-88a8-200f9b712c83'::UUID, 'proficiency', 'skill level / competency', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d200fabe-2ea1-44d2-bc61-c596a6bd88a9'::UUID, 'CSS', 'combat service support / operational support', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d21168b1-c25d-4e51-baa8-3c8751926cdb'::UUID, 'PO3 (Petty Officer Third Class)', 'Technician', 'uscg', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d2129ef6-040e-4763-abb1-9d221955b767'::UUID, 'NMCI', 'Navy Marine Corps Intranet', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d2323650-585e-419d-85a1-4388440603d8'::UUID, 'durable', 'reusable / long-lasting equipment', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d243f982-76c1-4d54-873d-9e2b50789ca1'::UUID, 'fantail', 'rear exterior area', 'navy', 'general', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d2459b90-f8a1-4d75-bd58-cb1fda232559'::UUID, 'SIPRNET', 'classified network / secure government network', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d2546b01-965c-4172-a17b-018d74c7be60'::UUID, 'EEO', 'Equal Employment Opportunity', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d2c0d494-31ed-48bf-8c98-a3bdee1c72d8'::UUID, 'POD', 'Plan of the Day / daily schedule', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d2e425a7-e74d-4635-8b5c-4e4ebf1c2f8a'::UUID, 'special court martial', 'intermediate judicial proceeding', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d2e5f248-25cb-436b-a36e-f21191fcabc5'::UUID, 'LOC', 'letter of counseling / formal verbal warning documentation', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d3034b88-6c40-4798-85e1-095f57a36207'::UUID, 'quarterdeck', 'main entrance / reception area', 'navy', 'general', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d31c7f5b-92c3-469b-8719-d45fbb0a7cf6'::UUID, 'PLL', 'prescribed load list / required parts inventory', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d345ef48-bde6-494b-b1e9-e1fd04680878'::UUID, 'sick call', 'medical appointment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d3574425-ec35-4b15-a466-97ad1f3add08'::UUID, 'CPO', 'Chief Petty Officer', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d35b977d-ea50-48a6-9e3f-39a6a3fdc5de'::UUID, 'GySgt', 'gunnery sergeant / department lead', 'usmc', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d390e475-13d3-413e-8640-031f51a8674f'::UUID, 'SONAR', 'underwater detection systems / acoustic sensors', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d3cee180-67ba-4fe8-b803-00ba79020952'::UUID, 'deployment', 'extended business travel / overseas assignment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d44c3689-e5d3-477b-9ecf-93c942b57321'::UUID, 'promotion board', 'advancement review committee / selection panel', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d4790929-1869-4cff-9850-a9129f73d9cb'::UUID, 'stand down', 'pause operations / safety day', 'general', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d4916e1f-3c7b-4fb2-bac8-259cdf9c7b03'::UUID, 'drawdown', 'reduction in force / scaling back', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d49d143b-f881-446e-83dd-72d5b69b20d2'::UUID, 'ORM', 'operational risk management / workplace risk assessment', 'safety', 'Safety', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d4db3313-5def-4a91-8ea0-3208c3bebab9'::UUID, 'promotion', 'advancement / career progression', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d4ecbbe5-bdc6-46e9-a4bc-ecfde5e6ac3e'::UUID, 'chapter', 'administrative separation / termination', 'army', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d517ea36-ae44-459e-9425-fe0a1cc2c996'::UUID, 'AWOL', 'absent without leave / unauthorized absence', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d525edf7-c3e9-485f-ad9d-13f791164d6b'::UUID, 'CDI', 'command directed investigation / internal investigation', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d5362e44-aea2-40a5-9cdd-70c7d842f54e'::UUID, 'LPO', 'Leading Petty Officer / team supervisor', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d53f478e-8e1d-4436-a019-53a87ec0a6e9'::UUID, 'FEP', 'final readiness evaluation', 'navy', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d598768a-1b81-40de-90e4-3e5953fa85b6'::UUID, 'NJP', 'Non-Judicial Punishment / disciplinary action', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d5abb28f-40ee-4196-acf3-e9eee3ed9041'::UUID, 'TIS', 'Time in Service / tenure', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d5c125ea-754f-4a05-ba15-e9200456036b'::UUID, 'analyst', 'intelligence analyst / research analyst', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d60a9bd7-e56e-4296-84c6-0e838fd09dec'::UUID, 'SCPO (Senior Chief Petty Officer)', 'Senior Manager / Operations Manager', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d61ac722-e8fd-4cc7-a5b1-3948e25202f4'::UUID, 'underway', 'deployed operations', 'navy', 'operations', 'Completed 180 days underway', 'Completed 180 days of deployed operations')
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d6490441-74b4-4d13-a57a-90496745d2e8'::UUID, 'aid station', 'field medical clinic / first-response medical facility', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d64da189-a869-49c3-8b03-5ad0f7c9dfc7'::UUID, 'rifle range', 'training facility / shooting range', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d68f8150-717b-4ea0-8b55-2e46ac075f04'::UUID, 'ground truth', 'verified information / confirmed data', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d6afd3f3-48ba-423a-8a1d-8edca0ba8913'::UUID, 'obligation', 'committed funds / encumbered budget', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d6ce6ff1-dea1-4d2f-b674-2c35d3554398'::UUID, 'command investigation', 'organizational inquiry / management-directed review', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d6e8c167-c88f-4021-b465-90f097aa2300'::UUID, 'corps', 'enterprise division of 20,000-45,000 employees', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d6fdaa16-3a40-49fb-bb88-2357b07ba1ee'::UUID, 'economic order quantity', 'optimal purchase quantity', 'logistics', 'Logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d7090121-8a76-4051-b3b3-b63aeccaf32b'::UUID, 'officer', 'manager / executive', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d71544d1-e3f8-4f3e-9c7b-44a8c1778718'::UUID, 'PV2 (Private Second Class)', 'Junior Staff Member', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d791a43e-023b-4995-a3e9-d9efa824ed62'::UUID, 'supply chain', 'supply chain', 'general', 'logistics', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d7aacf97-c56b-4bcf-b3bb-2ec3c11a3b69'::UUID, 'COMSEC', 'encrypted communications / secure communications', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d815e165-fcc5-4142-be33-ecf92f298e05'::UUID, 'company commander', 'operations director', 'army', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d82d70d4-1ea3-4543-a452-dcf5c6962e76'::UUID, 'red deck', 'operations suspended due to weather/safety', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d8414258-0470-4821-8a71-96d7b92ed363'::UUID, 'AOR', 'area of responsibility', 'general', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d847a5c9-6dfc-4db9-9766-9a591cdf6c48'::UUID, 'WO', 'Warrant Officer / technical expert', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d883a5a3-8c4c-40b3-bb47-8747476643f6'::UUID, 'sole source', 'single-vendor procurement / non-competitive award', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d8e2a159-1894-4b61-8350-aa4402190afb'::UUID, 'khaki', 'supervisor / management', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d917ac81-d858-43b2-819b-1d4f1a8ab7a2'::UUID, 'cost plus', 'cost-reimbursement contract / variable-cost agreement', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d961772d-35da-465f-971d-0e19a41a55cc'::UUID, 'SRM', 'sustainment, restoration, and modernization / facility maintenance and upgrade', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d963cab7-f909-4049-85f8-7fec6a28aef8'::UUID, 'green team', 'support team / training team', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d9823161-bbaa-468d-98ee-31ed74008ee2'::UUID, 'OIC', 'department head', 'general', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d98b3614-8c3a-48d0-b8f3-fabf6082b0a5'::UUID, 'GEOINT', 'geospatial intelligence / geographic data analysis', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('d99d6942-ab98-4e67-a471-c30b8a7993ab'::UUID, 'field grade', 'senior management', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('da327485-8e76-4ec6-8c5e-8eac01307708'::UUID, 'OPTAR', 'operating budget', 'navy', 'logistics', 'Managed $2.5M OPTAR', 'Managed $2.5M annual operating budget')
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('da383a72-4edc-48b2-905b-fd5dc6a367d7'::UUID, 'utilities', 'building systems (power, water, HVAC)', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('da4e8e20-8705-404b-9b47-8391dc484e01'::UUID, 'flight surgeon', 'aviation medical examiner / aerospace physician', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('da5c7bc7-ce95-4396-8cc0-c44491948008'::UUID, 'HF/UHF/VHF radio', 'radio communications systems', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('da792efb-d2fb-4303-b5c9-9a6a4149f68f'::UUID, 'echelon', 'organizational level / tier', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('da7b111c-42b1-456f-b37f-2fa81f6804af'::UUID, 'boundary defense', 'network perimeter protection', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('da98cb06-16e6-456a-9bd2-d0d686b4640e'::UUID, 'SSgt (Staff Sergeant)', 'Senior Supervisor', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('daa44498-d08d-4e8f-adf1-e252dbb3c032'::UUID, 'JWICS', 'top secret network / highest classification network', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('daa50168-0df0-433d-a4f3-eaf9a94f111c'::UUID, 'SME', 'subject matter expert', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('dab96995-42d0-4912-b402-6a490263c2f9'::UUID, 'service order', 'facility support request', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('dacba2d5-71b9-4883-bb93-73c5e274c4dc'::UUID, 'SCPO (Senior Chief Petty Officer)', 'Senior Manager / Operations Manager', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('dafc3e49-9ea2-4a93-a765-c86b88f55f3a'::UUID, 'brig', 'military prison / detention facility', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('db315c8b-0ffc-4caf-8953-7eb7d050b61a'::UUID, 'immunization', 'vaccination / preventive medicine', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('db377c91-b8dc-4922-a05b-dd0c56b2e62f'::UUID, 'midships', 'center section', 'navy', 'general', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('dbb34002-1be8-4c44-a4e4-fb517d0544d1'::UUID, 'MOC', 'Military Occupational Code', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('dbf95934-e379-4653-805f-ac6bdebfa4ec'::UUID, 'SrA (Senior Airman)', 'Technician / Specialist', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('dc212e63-8870-48e1-aeb1-c3aa1200bd00'::UUID, 'NAV', 'navigator / operations planner', 'navy', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('dc5ad1e1-acc7-4cb8-af08-42218a7dc780'::UUID, 'RPO', 'Recruit Petty Officer', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('dc60ce47-b2aa-4dc3-ba3b-7d19ff4fab7f'::UUID, 'pocket litter', 'supporting documentation for cover identity', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('dc655b5d-c654-49e9-8587-ecefd1e7b97a'::UUID, '1SG (First Sergeant)', 'Operations Manager', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('dc6bf607-abff-40cb-a4d9-1b5d8fa481b9'::UUID, 'naval message', 'official communication / formal memo', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('dc92c9b5-e8dc-4ef0-bb75-9858a4e35351'::UUID, 'direct action', 'targeted operation / precision strike mission', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('dcbe1e5e-6153-4b0f-9adf-0296fb500d5a'::UUID, 'wing', 'organization of 1,000-5,000 employees', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('dcd97b7a-b408-431f-85a5-0f97e274d689'::UUID, 'TBS', 'The Basic School / officer training', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('dd370e5d-619b-4017-b6bf-65db2d229119'::UUID, 'chopped to', 'transferred authority to', 'navy', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('dd7d1b96-9e3f-4fc9-b433-e604573b0526'::UUID, 'wingman', 'partner / buddy / teammate', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('dd844286-8850-44fa-8205-5cc9b6136c3f'::UUID, 'exchange', 'retail store / company store', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('dd91dcdb-28f9-48cd-b444-b6a14a64864a'::UUID, 'PO1 (Petty Officer First Class)', 'Supervisor', 'uscg', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ddc6f557-39ef-4c0e-80f4-1b97941e65d5'::UUID, 'handler', 'source manager / relationship coordinator', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ddc8b246-b168-4825-94b9-773c3a7a77f6'::UUID, 'DODIN', 'Department of Defense information network / enterprise network', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ddcba6e8-6b51-4883-833d-b20db25d4004'::UUID, 'wing', 'organization of 1,000-5,000 employees', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('de03ef7b-a0df-4058-942c-e77117925c0e'::UUID, 'rotation', 'assignment cycle / tour schedule', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('de2cdcf9-cabd-42b5-ada3-2efae9cdd0b6'::UUID, 'Article 15', 'non-judicial punishment / administrative disciplinary action', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('de340bee-6f02-4c82-bab7-9b87ea272e73'::UUID, 'SSgt (Staff Sergeant)', 'Team Lead / Supervisor', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('de807d87-e76e-4252-bd72-5c786f82ccd6'::UUID, 'EAWS', 'aviation qualification program', 'navy', 'training', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('de953028-edda-4ec7-942b-0e36d4d9d685'::UUID, 'competency', 'skill / qualification', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('deaa17d7-077e-4526-8395-4279f24394c0'::UUID, 'EOD', 'Explosive Ordnance Disposal / bomb disposal', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('deaf3fd2-28ff-4bba-b219-8153aaf36f2a'::UUID, 'skipper', 'commanding officer / CEO / president', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('deba9f74-1446-4326-ae7b-a1fcd511cab5'::UUID, 'DD214', 'separation document / discharge paperwork', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('df1d70bf-b6d0-4a8b-bcec-3be034ff59d6'::UUID, 'dog watch', 'split shift / evening shift', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('df208c8c-2211-4198-b55e-20330d7a38de'::UUID, 'LZ', 'landing zone', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('df26faba-4e29-462b-afd8-3f9641fea174'::UUID, 'FAP', 'Family Advocacy Program', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('df85c9a5-2d21-48df-aa20-fef07b49f7d9'::UUID, 'NMCRS', 'Navy-Marine Corps Relief Society', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('df91056c-47da-4135-8456-9d58ec16b2e3'::UUID, 'network defense', 'cybersecurity operations / network protection', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('dfd02c8f-8c5e-45a2-a4e1-af02e3e37b04'::UUID, 'MOU', 'Memorandum of Understanding / formal agreement', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e02eb050-e8a0-425b-a30f-eb8673c6eeac'::UUID, 'ROI', 'return on investment', 'general', 'financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e038fb46-3d3a-4249-a00a-b71fd2bf78e9'::UUID, 'order', 'directive / instruction / policy', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e07cf562-da36-4418-bc3e-17cda09ca29f'::UUID, 'garnishment', 'court-ordered payroll deduction', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e0805301-9136-4f48-862c-c9624f2c1bb0'::UUID, 'PKI', 'public key infrastructure / digital certificate management', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e096633b-8bcc-4a42-a2a5-34d546c5300d'::UUID, 'mission', 'objective / goal / project', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e0c55d62-8d89-422a-b13c-90bf796e38d4'::UUID, 'MCA', 'military construction, Army / capital construction project', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e0fdefc3-165a-4835-92e9-3018a6d142b6'::UUID, 'evolution', 'operation', 'navy', 'operations', 'Led 15 evolutions', 'Led 15 operational procedures')
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e104cfd5-62d6-4715-afa5-1032b8d98eab'::UUID, 'TIG', 'Time in Grade / time at current level', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e14625a0-9288-4dbd-bc61-1b925e0e00a6'::UUID, 'PFC (Private First Class)', 'Junior Staff Member', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e153e107-7b62-4eca-8794-542d5ef7a8df'::UUID, 'page 13', 'administrative counseling entry / personnel action documentation', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e17cc1e3-c276-4d39-8eaa-bf14fa7a13ec'::UUID, 'watch station', 'duty station', 'navy', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e18ce1ca-bbd3-46c4-8ee3-6aa617036618'::UUID, 'AT', 'annual training', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e1953215-65b8-4efe-8039-3e069feb7234'::UUID, 'CPO (Chief Petty Officer)', 'Department Supervisor / Manager', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e19f0c3d-08b3-4937-ba0c-a5b4a95d04f9'::UUID, 'ATG', 'Training and Readiness Organization', 'navy', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e1b4cee1-4728-4beb-9352-d6da9d2eafc5'::UUID, 'JISE', 'joint intelligence support element / integrated analysis team', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e1c11628-baec-4612-937d-c5fbd4c7425f'::UUID, 'flight hours', 'operating hours / airtime logged', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e1d21760-0ed1-4ea0-bbad-3db4f4ba06e1'::UUID, 'plan of the day', 'daily schedule / agenda', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e212c2f3-5168-492a-990a-cbbcac3a0a2f'::UUID, 'mission assurance', 'continuity of operations / business continuity', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e22710bd-4e83-430c-bea9-d61ca287d6f1'::UUID, 'deliverable', 'work product / output', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e2325daf-3418-40be-8dd1-1ede081b958f'::UUID, 'manning document', 'staffing table / organizational chart', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e241ed94-16b7-4501-9ef2-42881498f039'::UUID, 'rack', 'bed / bunk', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e2536d2b-1146-4f3e-81bf-350c9307e614'::UUID, 'tasker', 'assignment / action item / work request', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e2658ebd-9ea0-4f93-9ebc-fb7a34f31197'::UUID, 'exploitation', 'data extraction and analysis', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e28fba14-02ef-4d3b-9683-ed1028b0e5cf'::UUID, 'AFSC', 'job specialty code', 'usaf', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e291d800-e8ef-4f0f-b855-ca369cda8e5c'::UUID, 'PME', 'Professional Military Education / professional development', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e29f00cf-5cf0-4210-9a78-6fd6a93bc79d'::UUID, 'watch bill', 'shift schedule / duty roster', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e2bdc906-b882-46da-a28d-8b4ea7173776'::UUID, 'RDC', 'Recruit Division Commander / drill instructor', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e2e02fae-1232-4ed3-8d51-2f4b24c0a755'::UUID, 'fleet surgeon', 'senior medical officer / chief medical advisor', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e2eb0a86-2f89-45d1-ae23-ae8d4223cc82'::UUID, 'EAS', 'End of Active Service / contract completion date', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e39d1ab5-f3de-497d-9524-a9ddf23eecdf'::UUID, 'OCS', 'Officer Candidate School', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e42b7fdb-4058-42b4-ad47-224d65d17635'::UUID, 'CBRN equipment', 'hazardous materials handling equipment', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e440bb78-8ab4-409d-bc17-218031750d1b'::UUID, 'transfer', 'relocation / reassignment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e4637080-c8ff-4f21-bd9f-bde7f6a8fa88'::UUID, 'COTS', 'commercial off-the-shelf', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e47641b7-153b-4527-8bf7-67eea7129df6'::UUID, 'MCO', 'Marine Corps Order / policy directive', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e487eca0-6b5f-4597-9ef2-03f9e5d59f2a'::UUID, 'LCDR (Lieutenant Commander)', 'Director / Senior Department Head', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e4b8436f-6d35-46a7-b20e-02a1389b8aea'::UUID, 'TAD/TDY assignment', 'temporary assignment / detail', 'general', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e54b7bda-2f80-4bdd-a00d-2be29aaff2f4'::UUID, 'CBR', 'hazardous material response', 'navy', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e54fb870-2f94-4014-a7a7-7d7f1341ea92'::UUID, 'legal hold', 'litigation preservation / document retention order', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e556417d-87e5-4000-be21-d22252b69ab1'::UUID, 'S1', 'Personnel/Admin section / HR department', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e5b19f89-1af1-404e-b37a-3ef3f2444b85'::UUID, 'secure', 'finish / complete / lock up', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e64226c1-7537-4d37-8d93-b7f2c95ab602'::UUID, 'standing watch', 'on-call duty / shift coverage', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e6511847-5b85-4668-911b-de4a22cb5453'::UUID, 'division officer', 'department manager', 'navy', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e655a7b7-7727-49d2-94db-10e4a522c6df'::UUID, 'fitness report', 'officer performance evaluation / leadership assessment', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e65ec45c-3002-4bbd-8ffc-8c2ef1f36c14'::UUID, 'underway', 'in progress / actively operating', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e682e18f-63f9-443f-9bed-c6c44007eace'::UUID, 'CDR (Commander)', 'Senior Director / Division Head', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e68d4dfd-422c-4f10-8f23-a894d25482c2'::UUID, 'CAC', 'Common Access Card / security credential', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e6ac269a-d37c-4c87-9163-7270212339e5'::UUID, 'bridge', 'operations command center', 'navy', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e6c8f1ec-d0a3-4b8c-90f5-6bde336c44a7'::UUID, 'Col (Colonel)', 'Executive Director / VP', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e6caa2e3-f094-463d-ab4c-6127ae2eb049'::UUID, 'counseling chit', 'counseling documentation / performance feedback form', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e70177b8-5336-45ee-9f80-7ddc166b03b0'::UUID, 'triage', 'patient prioritization / emergency severity assessment', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e748414a-106c-4947-bfc8-cb573acf717a'::UUID, 'backbrief', 'summary briefing / confirmation briefing', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e74a441b-d142-4d03-9981-557e6496d9f7'::UUID, 'watch', 'shift', 'navy', 'operations', 'Stood 12 watches per month', 'Supervised 12 operational shifts per month')
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e756a6e4-b924-4a62-9836-d7bdec8d89cc'::UUID, 'deploy', 'travel for work / field assignment', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e759775b-0200-4775-9156-770f3aed0b6f'::UUID, 'MILPER', 'military personnel', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e765024a-9e5c-4110-9265-2ac10ab68b87'::UUID, 'JAG', 'Judge Advocate General / legal department', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e77870c7-69fe-4bd2-ac86-02297d0f06f2'::UUID, 'barracks', 'employee housing facility', 'army', 'general', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e7bd6962-0f8f-4763-8d9e-fee918ad9884'::UUID, 'pivot', 'change direction / shift focus', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e819a404-5569-47c7-a2cf-a1e6d7550368'::UUID, 'watch', 'shift / duty period', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e8469ef4-8b40-43bc-8f1c-5d1378b2346a'::UUID, 'DLCPO', 'Division Senior Supervisor', 'navy', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e890f0e2-bc92-4bb9-9008-c0fffdd14e88'::UUID, 'PPE', 'personal protective equipment', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e897267b-1e03-48f2-a0f0-f9a588069e98'::UUID, 'jackpot', 'successful target capture / mission success', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e8eebb45-14eb-4938-80cd-f62190170a51'::UUID, 'corrosion control', 'preventive surface treatment / anti-corrosion maintenance', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e914e8c3-27e2-4ec6-a790-4af8e89054ab'::UUID, 'evolution', 'operation / project / task', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e936c285-a183-4864-b16e-11213351d3c9'::UUID, 'synch', 'synchronize / coordinate timing', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e96dda64-5e54-4d7b-b491-35dfcb694607'::UUID, 'MCPO (Master Chief Petty Officer)', 'Director', 'uscg', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e9e89456-b733-4a9c-bc2d-56755f3dd7c0'::UUID, 'patient administration', 'medical records management / healthcare administration', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('e9f0bc83-01d9-486a-85d9-473b2c95765c'::UUID, 'SF', 'Standard Form', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ea0b5068-c265-4863-b1f3-27eebe96ffa3'::UUID, 'mission critical', 'essential / high priority', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ea373fd5-b955-43c2-94e2-23c11011c820'::UUID, 'S3', 'Operations section / operations department', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ea70f445-59cf-4056-a65e-77efb7c35b1e'::UUID, 'professional development', 'training / career growth', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('eab9a736-ea8d-47a6-a586-4463443a2246'::UUID, 'rating', 'job specialty / technical field', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('eab9adf3-7de5-4c28-8f35-73b793835d05'::UUID, 'field day', 'deep cleaning / facility maintenance', 'navy', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('eaba527e-0dc7-4aa9-b443-767c2cae3f53'::UUID, 'administrative separation', 'involuntary termination / employment separation', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('eaf6b32a-936a-4888-aa09-51f5ffe3a975'::UUID, 'cross-deck', 'inter-departmental transfer / rotation', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('eb009686-4e43-4770-aadb-ac440bbfa8a8'::UUID, 'clandestine', 'covert / secret', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('eb04f11d-ca46-4529-af4a-130b129af98a'::UUID, 'MARADMIN', 'Marine Administrative Message', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('eb25badc-f908-41b0-90ee-ac3522ab99f0'::UUID, 'SEAL', 'Sea, Air, and Land / special operations', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('eb523d90-39dc-4dd1-b472-ed93abb43ddd'::UUID, 'battalion', 'business unit of 300-1000 employees', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('eb839e15-f907-46f3-af6e-aba0b707f700'::UUID, 'proposal evaluation', 'bid assessment / vendor proposal review', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('eb8c345a-5e9c-4044-9aa8-04d3ceb4173e'::UUID, 'IA', 'Individual Augmentee / temporary assignment', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('eba555b8-561b-4c32-a9e7-23256d968043'::UUID, 'line', 'operational / revenue-generating', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ebd2ed06-b368-4c22-8032-585f13618397'::UUID, 'GCSS', 'Global Combat Support System', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ebf5a38c-5fdb-4a81-b94d-f393131a246a'::UUID, 'pay grade', 'compensation level / salary band', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ebfae2ef-5a01-42d9-92c4-2ca70433e3bb'::UUID, 'fireteam', 'small team of 4', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ecb3380e-2695-4bf9-90b8-c0d0ec1f287c'::UUID, 'personnel', 'staff / employees / HR', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ecc24ba8-b5ab-49bc-9122-13816bbe7a01'::UUID, 'MTF', 'military treatment facility / government healthcare facility', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ecd865a6-dd53-4089-ba87-bcc2719247dd'::UUID, 'ACDU', 'active duty', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ece2908b-d0cf-4d4a-94df-ec7cadff55c5'::UUID, 'LES', 'Leave and Earnings Statement / pay stub', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ece4c77b-40fe-44f6-a167-500efd598902'::UUID, 'CPL (Corporal)', 'Team Leader', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ece85602-168a-44e7-9c7d-c0059c3ab134'::UUID, 'OPR', 'officer performance evaluation', 'usaf', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ecf5efb3-fdce-4094-ac5c-339bdd0ec3dc'::UUID, 'watchstander', 'shift worker / on-call personnel', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ed4d96aa-4d99-47f3-8caf-9dc669ab7b93'::UUID, 'special reconnaissance', 'covert observation / clandestine surveillance', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ed61b7e1-a4a5-4cd9-9ce3-70d09c119ba0'::UUID, 'TIS', 'Time in Service / tenure', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ed94cf98-d00d-4abc-8dcc-393ab06c57e4'::UUID, 'mess', 'dining facility / cafeteria', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('eda1c8e6-f2b7-443f-9b1e-9a5c7793ec19'::UUID, 'boots on ground', 'on-site personnel / field staff', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ee634bba-d46b-45d9-94b8-2dd3713a5fcc'::UUID, 'stay in your lane', 'focus on your responsibilities / stay within scope', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('eeb2a603-789c-49fe-ae74-225c38ec786a'::UUID, 'pretrial', 'pre-hearing phase / preliminary proceedings', 'legal', 'Legal', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('eed04abd-fe29-4301-9c73-b3d523a3be42'::UUID, 'strike', 'rate selection / career choice', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('eee76b63-14a6-4aa6-807a-a42bc4a73af3'::UUID, 'BPA', 'blanket purchase agreement / pre-approved vendor arrangement', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ef58b6b9-bd11-4645-9c37-4c5b5076757f'::UUID, 'AOIC', 'assistant department head', 'general', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ef79422e-cfaa-4118-a887-aaf01ee21684'::UUID, 'ops', 'operations', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('efea2f95-c27c-4182-b508-a253675b6971'::UUID, 'POA&M', 'Plan of Action and Milestones / project timeline', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f0762dee-31c4-4b85-bdba-0a19842e526e'::UUID, 'orders', 'assignment notification / transfer paperwork', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f089be0a-b099-4d4c-91fa-12a84fa00e59'::UUID, 'chow', 'meals / cafeteria', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f0a99ed5-aedb-4b15-92ab-f52232d3e941'::UUID, 'adcon', 'administrative control / HR authority', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f0c99f50-4cff-4449-9f66-bedd636a4f41'::UUID, 'short timer', 'employee near end of contract', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f0e1e9ff-be37-4b05-a17d-f11a3468b880'::UUID, 'stern', 'rear', 'navy', 'general', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f0f64936-74c5-43e1-a464-68ee5102f98b'::UUID, 'inter-service', 'cross-functional / inter-departmental', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f10f4522-1391-4069-9513-6e8cfac7edf4'::UUID, 'preflight', 'pre-departure inspection / equipment readiness check', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f1104f3d-4276-405c-8691-70887fa5f2d4'::UUID, 'DRMO', 'Defense Reutilization and Marketing Office / surplus disposal', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f11aa7c5-3606-432c-882d-215ef300015a'::UUID, 'manning', 'staffing / headcount', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f14dbfe6-4a5c-449e-8cf2-60e20f8a6da9'::UUID, 'PJ', 'pararescue jumper / combat search and rescue specialist', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f1505486-7cd0-4744-9362-67f09d164a4a'::UUID, 'USACE', 'U.S. Army Corps of Engineers / federal engineering agency', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f1692adb-3963-4242-8201-ca56685311b7'::UUID, 'COB', 'close of business', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f187e453-e204-46c1-8ca0-5d7d7a4ee28f'::UUID, 'advancement', 'promotion', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f20925a0-ae74-4a41-bb63-3bbf5c8243fd'::UUID, 'theater', 'region / operational area', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f25547ff-2faf-47d8-bc9e-dcf93d9badc6'::UUID, 'FITREP', 'annual performance evaluation', 'navy', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f328587f-d4e6-4748-840d-8117d410071f'::UUID, 'USERRA', 'Uniformed Services Employment and Reemployment Rights Act', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f39d0db5-4c7b-42fd-aa8a-25284a455365'::UUID, 'Sgt (Sergeant)', 'Team Lead / Supervisor', 'usmc', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f3b74f2b-5e8b-456d-bf14-b0ccef0ee599'::UUID, '75th Ranger', 'Army elite light infantry regiment', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f3b7b066-bb26-4e1f-87fd-260e7b293eaa'::UUID, 'OJT', 'on-the-job training', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f40fc4f0-715b-44c8-9f60-e03f0fffe4ab'::UUID, 'line shack', 'maintenance coordination office', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f439b29b-8c87-4808-9607-91d57d013159'::UUID, 'MCPO (Master Chief Petty Officer)', 'Director', 'uscg', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f45eb1ab-9e0d-48a3-92dd-39a64efc29f6'::UUID, 'operational', 'active / functioning / deployed', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f4aaf401-ce8d-4a4d-b826-c1fe22ab1264'::UUID, 'ODA', 'operational detachment alpha / special forces A-team', 'general', 'Special Operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f4c5b155-8409-48c6-93a8-e8ffc6c73a8d'::UUID, 'motor pool', 'vehicle fleet maintenance facility', 'army', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f4d072fe-ca2b-4f3d-84ed-c42a21dbdb47'::UUID, 'CBRN', 'hazardous material response', 'general', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f50f77df-dd54-4a50-9a5f-a0e8d514474e'::UUID, 'NAF', 'Non-Appropriated Fund', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f525d6de-58d5-451b-a339-de254d74678b'::UUID, 'working party', 'work detail / project team', 'navy', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f525eb5e-5702-472f-9c14-7d7e569f7d5b'::UUID, 'asbestos abatement', 'asbestos removal and containment', 'safety', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f5580a57-ddb7-4673-ad91-81c597a9236d'::UUID, 'operational tempo', 'work pace / activity level', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f5629bc3-cfbf-4e17-96ed-584dd69ab854'::UUID, 'SCPO (Senior Chief Petty Officer)', 'Senior Manager', 'uscg', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f5b15b77-3725-4eff-a939-1a73626a45d6'::UUID, 'cyber range', 'cybersecurity training environment', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f5d898da-c85d-4ecc-9561-ead47794d30e'::UUID, 'CPT (Captain)', 'Senior Manager', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f6409cc3-e5f0-4532-be7a-2f964719b4e6'::UUID, 'flight line', 'aircraft parking and operations area / active work area', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f6af3064-e6f6-4676-a8e9-0a592bcbf6ac'::UUID, 'GPS equipment', 'navigation systems / location tracking', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f6bb6d99-d469-40f7-ab6a-cb2255584ddc'::UUID, 'posture', 'strategic position / readiness stance', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f6f28019-be08-4337-a6a8-36300c49a8ad'::UUID, 'unfunded requirement', 'budget shortfall / unbudgeted need', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f6f9c50b-8ffd-4832-ba76-0d71b67b3c35'::UUID, 'SOP', 'Standard Operating Procedure', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f6fcbe5f-7208-4eb3-ace9-dbd31cc758f6'::UUID, 'SAPR', 'Sexual Assault Prevention and Response', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f741aacb-0c18-4387-bead-cada1c2fe639'::UUID, 'TAD', 'Temporary Additional Duty / temporary assignment', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f768e428-d841-46b0-8f98-b7c56460f98f'::UUID, 'dissemination', 'information distribution / report distribution', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f77ebaba-60a7-49ba-93ea-f04d3d80e7ec'::UUID, 'log', 'record / documentation', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f7dade22-1a6d-4bfd-9d2c-ed224e7eda4e'::UUID, 'manifest', 'roster / inventory list', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f7fa1af8-4509-44c5-9c7f-5ffdf7ab573f'::UUID, 'downrange', 'in the field / at project site', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f8004083-3566-44be-96b9-c9490746e533'::UUID, 'station', 'assigned location / work position', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f8113641-3ba5-4d2a-b399-60a43b2d7b0c'::UUID, 'secure', 'complete / end for the day', 'navy', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f8154740-25a2-41aa-9de3-eed671cd512f'::UUID, 'NATOPS', 'naval air training and operating procedures / aircraft operating manual', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f849b843-ea6b-425b-b491-5fc8df419ec8'::UUID, 'vertical construction', 'building construction', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f859a2a3-2302-4a47-9385-a80cc6a651d6'::UUID, 'subordinate', 'direct report / team member', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f86bbd34-b6f0-4e80-93ad-7d59d5a074b1'::UUID, 'indoc', 'orientation / onboarding', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f870cc7c-eb4e-4007-8537-c11dde5a3ea1'::UUID, 'STIGs', 'security technical implementation guides / security configuration standards', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f8ad55e9-2665-4309-960d-437ba28c20a3'::UUID, 'MAF', 'maintenance action form / work order', 'aviation', 'Aviation', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f8ae1673-b514-4239-bfb3-d463392f36d6'::UUID, 'POD', 'Plan of the Day / daily schedule', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f8b40371-3793-4f2d-9253-56d23389a98b'::UUID, 'expeditionary', 'mobile / rapid deployment capable', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f900c3cd-a572-4935-89ec-ec7f786fb44a'::UUID, 'tour of duty', 'assignment length / contract period', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f9112b12-4b8e-4d7b-b941-d6e211c13c55'::UUID, 'mission essential', 'critical function / required capability', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f91b1790-353e-4672-b09d-688d4d2ac3ed'::UUID, 'division', 'organization of 10,000-15,000 employees', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f92a42d1-d851-48e3-b509-3009d27ac220'::UUID, 'KIA', 'killed in action', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f93bd8a3-d9b1-422c-9b91-73f57bd7c8ef'::UUID, 'mission ready', 'prepared / operational / qualified', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f94545c2-fe55-4220-863f-c51245dfc849'::UUID, 'compartmentalized', 'need-to-know basis / restricted access', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f950d350-9e75-4612-819b-59d29cc9ad34'::UUID, 'medevac', 'medical evacuation / emergency transport', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('f99a491c-2482-4efe-86d5-c4ab4f0edb15'::UUID, 'phase line', 'project milestone / progress marker', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fa518e1e-2948-43a9-ad81-baf3fbc7c75b'::UUID, 'KIA', 'killed in action', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fa53414b-2762-44eb-ab38-11b0e1a241da'::UUID, 'NCOER', 'annual performance evaluation', 'army', 'admin', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fa59f353-8754-4ab3-b076-d9a904cf10e8'::UUID, 'PFC (Private First Class)', 'Staff Member', 'army', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fa6c72fa-ee8a-439f-9e7c-3977f51c77da'::UUID, 'read-in', 'security briefing and access authorization', 'intelligence', 'Intelligence', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fa8e0b4b-a82f-4cf0-b4cd-aac903de913b'::UUID, 'hostile fire pay', 'hazard duty pay / danger zone compensation', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fae132a1-afad-42df-b865-c2d17f21dc70'::UUID, 'subordinate', 'direct report / team member', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('faf61339-1b69-4fee-9dfd-592c5012722b'::UUID, 'command deck', 'executive level / senior leadership', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('faf996fc-961e-4be7-9929-8b9eb4c1654f'::UUID, 'SA (Seaman Apprentice)', 'Junior Staff Member', 'navy', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fafba8cd-551f-4b05-a80e-fcd950c1fef5'::UUID, 'SRB', 'Selective Reenlistment Bonus', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fb468f93-0397-447e-8a40-b80396ca3871'::UUID, 'demolition', 'controlled structure removal / explosive demolition', 'engineering', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fb5e8ab9-63bd-4e5f-86e3-8d39b14d67d2'::UUID, 'authorized strength', 'approved headcount / budgeted positions', 'personnel', 'Personnel', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fb630700-44bd-4c6f-b99a-2e932c11df48'::UUID, 'evolution', 'operation / project / task', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fb7b6e6e-b4f9-43f6-a7a4-9a66ad376cd8'::UUID, 'NAVADMIN', 'Navy Administrative Message / policy announcement', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fbb1c466-2b40-4981-a5d5-3dc6bd010493'::UUID, 'LPTA', 'lowest price technically acceptable / cost-based selection', 'logistics', 'Acquisition', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fbbc955b-8850-42a5-8dee-03a72cc05962'::UUID, 'battle rhythm', 'operational cadence / recurring schedule', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fbfdf7fe-6c5a-4c6f-a3d9-a566cf8993b6'::UUID, 'SDO', 'Staff Duty Officer / on-call manager', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fc0c7cc7-b2ec-4bba-8912-962284bf6375'::UUID, 'malware analysis', 'malicious software investigation', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fc255669-62a6-4391-9b74-b0857e1323d2'::UUID, 'SR (Seaman Recruit)', 'Entry-Level Staff', 'uscg', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fc56d125-fa55-4dbb-bda7-0d29a6c09920'::UUID, 'imminent danger pay', 'threat area compensation', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fc788467-d455-4847-9fea-e7c1d02b6e11'::UUID, 'UNODIR', 'unless otherwise directed', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fc83c66a-0728-4ed8-bad6-913546b2c626'::UUID, 'chopped to', 'temporarily assigned to / placed under', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fc94dc0b-f523-4000-a2c0-d9bd36e5eea8'::UUID, 'IOC', 'initial operating capability / minimum viable deployment', 'cyber', 'Cyber', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fd12506a-b34d-4b38-bd8e-e3acbdf6607b'::UUID, 'inspector general', 'internal auditor / compliance officer', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fd1db7cb-3b6d-4334-bea5-8f73c04461ba'::UUID, 'field sanitation', 'environmental health / hygiene management', 'medical', 'Medical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fd312be2-4cb2-46df-ab31-1a177fd8804b'::UUID, 'DCPO', 'safety compliance officer', 'navy', 'technical', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fdde2926-306d-40af-8335-adccf28aa722'::UUID, 'MOS', 'Military Occupational Specialty / job classification', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fde0d3fe-ee4d-4ce7-b2e0-780e6c2726dd'::UUID, 'MPA', 'main propulsion assistant / propulsion engineer', 'navy', 'leadership', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fde1d3b2-9044-4037-9674-0eb0c463c74b'::UUID, 'HQDA', 'Headquarters Department of the Army', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fe167827-e76f-46a8-a4f7-f04a57db83cc'::UUID, 'COMSEC', 'communications security / encrypted communications management', 'communications', 'Communications', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fe35e07a-44c5-4356-9e27-096420bfa786'::UUID, 'HAZWOPER', 'hazardous waste operations and emergency response certification', 'safety', 'Engineering', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fe44f131-13f0-4595-a645-5de1192f89b8'::UUID, 'warrant officer', 'technical expert / senior specialist', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fe481b6c-7fc3-467a-a3c1-89248287b85c'::UUID, 'tactical vehicles', 'fleet vehicles / field vehicles', 'general', 'Equipment', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fe660f18-1e1d-4e9f-bb09-3d48a54955f1'::UUID, 'smoking lamp', 'break time / authorized break', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fe704055-010e-4486-a631-11a9c7b6b16c'::UUID, 'JQR', 'Job Qualification Requirements', 'general', 'Acronym', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fea774f0-c130-416f-b637-46536855600c'::UUID, 'mission essential', 'business critical', 'general', 'operations', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('feeaca7b-7ed4-4ea6-a014-e7de077f2115'::UUID, 'pre-deployment', 'pre-project / preparation phase', 'general', 'Term', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('feed6e40-9bd0-4d35-9e39-161b70407bd5'::UUID, 'fleet', 'enterprise operations unit', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ff9b060b-33a5-4708-8d81-27eee6540a5a'::UUID, 'battalion', 'business unit of 300-1000 employees', 'general', 'Unit Type', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('ffd2ca5d-2662-4082-854a-91d7e7c87bf0'::UUID, 'OPTAR', 'operating target / departmental budget allocation', 'financial', 'Financial', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;
INSERT INTO dict_military_jargon (id, military_term, civilian_equivalent, context, category, example_military, example_civilian) VALUES ('fff4ffe4-58e4-429d-9231-00949c887812'::UUID, 'CMSgt (Chief Master Sergeant)', 'Director', 'usaf', 'Rank', NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    military_term = EXCLUDED.military_term,
    civilian_equivalent = EXCLUDED.civilian_equivalent,
    context = EXCLUDED.context,
    category = EXCLUDED.category,
    example_military = EXCLUDED.example_military,
    example_civilian = EXCLUDED.example_civilian;

COMMIT;
