-- =============================================================================
-- Debriefed Dictionary Massive Expansion
-- Generated: 2026-02-17
-- Adds 200+ phrase translations, 100+ acronyms, 50+ jargon, 120+ eval phrases
-- All ON CONFLICT DO NOTHING to avoid duplicates with existing seed data
-- =============================================================================


-- BRANCH VALUES: Use lowercase abbreviations ONLY
-- army, navy, usaf, usmc, uscg, ussf, general
-- NEVER use full names like 'Coast Guard' or 'Air Force'
-- Domain context values (logistics, intelligence, cyber, etc.) are also valid
-- Run validate-branch-values.sh before pasting into Supabase

BEGIN;

-- =============================================================================
-- SECTION 1: dict_phrase_translations (200+ new entries)
-- Categories: leadership, performance, training, operations, admin, medical,
--             intel, logistics, comms, legal, financial, engineering, aviation, cyber
-- =============================================================================

-- ----- LEADERSHIP (30 entries) -----
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('took the helm', 'assumed leadership of / took charge of', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('held the watch', 'maintained oversight / served as duty manager', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('stood up a new unit', 'established a new department / launched a new team', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('combat leadership', 'leadership under high-pressure conditions', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('operational command', 'executive oversight / operational authority', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('battle staff', 'executive operations team / crisis management team', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('span of control', 'number of direct reports / management scope', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('unity of command', 'clear reporting structure / single point of authority', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('unity of effort', 'coordinated teamwork / aligned objectives', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('mission command', 'empowered leadership / decentralized decision-making', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('decisive leadership', 'confident and timely decision-making', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('led from the front', 'led by example / hands-on leadership', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('assumed duties in the absence of', 'served as acting manager during absence of', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('principal staff officer', 'senior department head / chief advisor', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('special staff officer', 'specialized advisor / subject matter expert', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('task organized', 'restructured teams for specific objectives', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('troop leading procedures', 'team planning and execution methodology', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('command and control', 'management oversight and coordination', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('supervised the training of', 'oversaw professional development for', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('managed a section of', 'managed a team of', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('served as acting commander', 'served as interim director / acting manager', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('led joint operations', 'managed cross-functional initiatives', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('directed multi-echelon operations', 'managed multi-level organizational operations', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('established battle rhythm', 'established recurring operational cadence', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('executed change of command', 'completed leadership transition', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('mentored junior leaders', 'mentored emerging leaders / coached new supervisors', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('served as battle captain', 'served as operations shift lead', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('commanded a detachment', 'managed an independent work group', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('served as adjutant', 'served as chief administrative officer', 'general', 'leadership') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('key leader engagement', 'executive stakeholder relationship management', 'general', 'leadership') ON CONFLICT DO NOTHING;

-- ----- PERFORMANCE (20 entries) -----
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('mission-ready status', 'fully operational and prepared', 'general', 'performance') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('combat effective', 'fully operational and productive', 'general', 'performance') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('operational readiness rate', 'equipment availability rate / uptime percentage', 'general', 'performance') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('zero defect mentality', 'zero-error mindset / quality-first approach', 'general', 'performance') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('sustained exceptional performance', 'consistently delivered outstanding results', 'general', 'performance') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('superior mission accomplishment', 'exceptional project delivery / outstanding results', 'general', 'performance') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('performed with distinction', 'delivered exceptional results / excelled', 'general', 'performance') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('consistently exceeded expectations', 'routinely surpassed performance targets', 'general', 'performance') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('achieved mission success', 'successfully completed all objectives', 'general', 'performance') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('combat multiplier', 'force multiplier / high-impact contributor', 'general', 'performance') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('force multiplier', 'high-impact contributor / productivity amplifier', 'general', 'performance') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('raised the bar', 'set new performance standards', 'general', 'performance') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('set the example', 'served as a role model / established best practices', 'general', 'performance') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('exceeded unit standards', 'surpassed departmental benchmarks', 'general', 'performance') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('top block evaluation', 'highest possible performance rating', 'general', 'performance') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('passed with zero findings', 'achieved full compliance with no deficiencies', 'general', 'performance') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('subject matter expert in', 'recognized authority in / deep expertise in', 'general', 'performance') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('maintained operational tempo', 'sustained high-volume workflow / kept pace of operations', 'general', 'performance') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('delivered results under pressure', 'produced outcomes in demanding conditions', 'general', 'performance') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('earned the trust and confidence of', 'earned the full confidence of senior leadership', 'general', 'performance') ON CONFLICT DO NOTHING;

-- ----- TRAINING (18 entries) -----
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('completed all prerequisite training', 'completed all required certifications', 'general', 'training') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('qualified in rate', 'earned professional certification in specialty', 'general', 'training') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('fleet-up', 'promoted into next-level role / advanced within the team', 'general', 'training') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('board eligible', 'eligible for promotion review', 'general', 'training') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('selection board', 'promotion review panel / selection committee', 'general', 'training') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('master training specialist', 'certified master instructor / lead training facilitator', 'general', 'training') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('developed lesson plans', 'created training curriculum / designed course materials', 'general', 'training') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('conducted proficiency training', 'delivered skills-based professional development', 'general', 'training') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('ensured training readiness', 'verified all staff met training requirements', 'general', 'training') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('training cycle', 'professional development schedule / learning cycle', 'general', 'training') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('completed advanced training', 'completed advanced professional development', 'general', 'training') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('trained to standard', 'trained to meet all certification requirements', 'general', 'training') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('combat training center rotation', 'intensive field training exercise / major training event', 'general', 'training') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('individual training plan', 'personal development plan / individual learning plan', 'general', 'training') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('collective training event', 'team-based training exercise / group workshop', 'general', 'training') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('conducted pre-deployment training', 'delivered pre-project mobilization training', 'general', 'training') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('weapons qualification', 'proficiency certification / skills verification', 'general', 'training') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('annual training requirements', 'annual compliance and certification requirements', 'general', 'training') ON CONFLICT DO NOTHING;

-- ----- OPERATIONS (25 entries) -----
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('theater of operations', 'operational region / area of business operations', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('area of responsibility', 'assigned territory / managed region', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('battlespace', 'operational environment / competitive landscape', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('patrol base operations', 'forward operating base activities / remote site operations', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('movement to contact', 'proactive engagement / outreach operations', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('area denial operations', 'restricted access zone management', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('stability operations', 'stabilization and support activities', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('decisive operations', 'primary effort / main objective operations', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('shaping operations', 'preparatory activities / preliminary operations', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('sustained operations', 'continuous operations / around-the-clock activities', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('coordinated with higher headquarters', 'coordinated with corporate headquarters / senior leadership', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('coordinated with adjacent units', 'coordinated with peer departments / partner teams', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('established a forward operating base', 'established a satellite office / remote operations center', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('joint and combined operations', 'multi-organizational and international operations', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('rapid deployment', 'rapid mobilization / quick-response deployment', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('mission planning cycle', 'project planning process / operational planning cycle', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('operations center management', 'command center management / operations hub oversight', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('maintained common operating picture', 'maintained real-time operational dashboard / situational awareness', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('24/7 operations', 'around-the-clock operations / continuous coverage', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('shift operations', 'rotating shift coverage / multi-shift operations', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('contingency operations', 'emergency response operations / crisis management', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('humanitarian assistance operations', 'disaster relief and humanitarian aid operations', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('civil-military operations', 'public-private partnership operations', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('counter-insurgency operations', 'complex security and stabilization operations', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('information operations', 'strategic communications / information management', 'general', 'operations') ON CONFLICT DO NOTHING;

-- ----- ADMIN (18 entries) -----
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('transfer of authority', 'transfer of responsibility / handover of authority', 'general', 'admin') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('change of command', 'leadership transition / management changeover', 'general', 'admin') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('permanent change of station', 'permanent relocation / corporate transfer', 'general', 'admin') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('temporary additional duty', 'temporary assignment / short-term project assignment', 'general', 'admin') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('administrative separation', 'involuntary termination / administrative discharge', 'general', 'admin') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('administrative reduction', 'demotion / reduction in grade', 'general', 'admin') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('reenlistment eligible', 'eligible for contract renewal', 'general', 'admin') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('processed out-processing checklist', 'completed employee offboarding checklist', 'general', 'admin') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('in-processing procedures', 'employee onboarding procedures', 'general', 'admin') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('officer record brief', 'professional profile / executive summary', 'general', 'admin') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('enlisted record brief', 'employee profile / personnel summary', 'general', 'admin') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('duty roster management', 'work schedule management / shift scheduling', 'general', 'admin') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('personnel readiness', 'workforce readiness / staffing preparedness', 'general', 'admin') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('strength management', 'headcount management / workforce planning', 'general', 'admin') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('command sponsorship', 'employee sponsorship / relocation assistance', 'general', 'admin') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('classified material handling', 'sensitive document management / confidential records handling', 'general', 'admin') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('records management', 'document management / records retention', 'general', 'admin') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('correspondence management', 'business correspondence / official communications management', 'general', 'admin') ON CONFLICT DO NOTHING;

-- ----- MEDICAL (15 entries) -----
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('combat medic', 'emergency medical technician / field paramedic', 'general', 'medical') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('triage operations', 'emergency patient prioritization / triage management', 'general', 'medical') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('medical readiness', 'workforce health compliance / occupational health readiness', 'general', 'medical') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('force health protection', 'occupational health and safety program', 'general', 'medical') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('combat casualty care', 'emergency trauma care / field emergency medicine', 'general', 'medical') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('medical evacuation operations', 'emergency patient transport / air ambulance operations', 'general', 'medical') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('preventive medicine', 'preventive health services / occupational health', 'general', 'medical') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('medical supply management', 'pharmaceutical and medical supply chain management', 'general', 'medical') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('medical treatment facility', 'healthcare facility / clinic', 'general', 'medical') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('combat stress control', 'crisis counseling / behavioral health support', 'general', 'medical') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('medical readiness classification', 'employee health clearance status', 'general', 'medical') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('field sanitation', 'environmental health and sanitation', 'general', 'medical') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('medical surveillance', 'occupational health monitoring / health screening', 'general', 'medical') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('medical logistics', 'healthcare supply chain / medical equipment management', 'general', 'medical') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('patient administration', 'patient records management / healthcare administration', 'general', 'medical') ON CONFLICT DO NOTHING;

-- ----- INTEL (15 entries) -----
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('intelligence preparation of the battlefield', 'comprehensive environmental analysis / market intelligence', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('threat assessment', 'risk assessment / threat analysis', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('counterintelligence', 'security threat mitigation / insider threat prevention', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('signals intelligence', 'electronic data collection and analysis', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('human intelligence', 'human source information gathering / interview-based research', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('imagery intelligence', 'satellite and aerial imagery analysis', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('open-source intelligence', 'open-source data analysis / public information research', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('intelligence fusion', 'multi-source data integration and analysis', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('produced intelligence estimates', 'produced analytical forecasts / risk assessments', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('collection management', 'data collection strategy and oversight', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('intelligence cycle', 'research and analysis lifecycle', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('order of battle analysis', 'competitive landscape analysis / organizational assessment', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('geospatial intelligence', 'geographic information systems analysis / location-based analytics', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('indications and warnings', 'early warning indicators / predictive analysis', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('target development', 'priority identification / target market analysis', 'general', 'intel') ON CONFLICT DO NOTHING;

-- ----- LOGISTICS (15 entries) -----
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('logistics readiness', 'supply chain preparedness / operational logistics readiness', 'general', 'logistics') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('maintenance float', 'spare equipment pool / backup inventory', 'general', 'logistics') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('supply chain management', 'end-to-end supply chain management', 'general', 'logistics') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('equipment serviceability rate', 'equipment availability / asset uptime rate', 'general', 'logistics') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('logistics support area', 'supply and distribution center', 'general', 'logistics') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('supply discipline', 'inventory control / asset accountability', 'general', 'logistics') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('managed a supply account', 'managed inventory account / procurement account', 'general', 'logistics') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('conducted inventory management', 'performed inventory control and tracking', 'general', 'logistics') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('distribution management', 'distribution logistics / shipping and receiving management', 'general', 'logistics') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('retrograde of equipment', 'equipment return and redistribution', 'general', 'logistics') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('field maintenance operations', 'on-site equipment maintenance / mobile repair operations', 'general', 'logistics') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('sustainment operations', 'ongoing support and resupply operations', 'general', 'logistics') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('reset operations', 'equipment refurbishment and reconditioning', 'general', 'logistics') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('depot-level maintenance', 'factory-level overhaul / major equipment repair', 'general', 'logistics') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('organizational-level maintenance', 'unit-level equipment servicing / routine maintenance', 'general', 'logistics') ON CONFLICT DO NOTHING;

-- ----- COMMS (12 entries) -----
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('tactical communications', 'field communications / mobile communications systems', 'general', 'comms') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('signal plan', 'communications plan / network architecture', 'general', 'comms') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('frequency management', 'spectrum management / radio frequency coordination', 'general', 'comms') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('communications security', 'information security / encrypted communications management', 'general', 'comms') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('established communications architecture', 'designed and deployed network infrastructure', 'general', 'comms') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('maintained satellite communications', 'managed satellite-based communications systems', 'general', 'comms') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('radio operator', 'communications specialist / radio technician', 'general', 'comms') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('communications watch', 'network monitoring shift / communications monitoring duty', 'general', 'comms') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('signal support', 'IT support / communications infrastructure support', 'general', 'comms') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('communications interoperability', 'cross-platform communications compatibility', 'general', 'comms') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('network operations center', 'IT operations center / network management hub', 'general', 'comms') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('installed and maintained communication systems', 'deployed and maintained telecommunications infrastructure', 'general', 'comms') ON CONFLICT DO NOTHING;

-- ----- LEGAL (10 entries) -----
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('military justice', 'workplace disciplinary process / legal proceedings', 'general', 'legal') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('non-judicial punishment', 'administrative disciplinary action', 'general', 'legal') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('courts-martial proceedings', 'formal legal proceedings / adjudication', 'general', 'legal') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('general court-martial', 'formal felony-level legal proceeding', 'general', 'legal') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('legal assistance operations', 'legal advisory services / employee legal support', 'general', 'legal') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('investigations officer', 'internal investigations manager / compliance investigator', 'general', 'legal') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('administrative law', 'regulatory compliance / administrative policy', 'general', 'legal') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('command investigation', 'internal investigation / workplace inquiry', 'general', 'legal') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('claims processing', 'insurance claims processing / liability management', 'general', 'legal') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('rules of engagement', 'operating guidelines / standard engagement protocols', 'general', 'legal') ON CONFLICT DO NOTHING;

-- ----- FINANCIAL (12 entries) -----
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('budget execution', 'budget management and expenditure tracking', 'general', 'financial') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('fiscal year planning', 'annual budget planning / fiscal year forecasting', 'general', 'financial') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('obligation authority', 'spending authorization / budget commitment authority', 'general', 'financial') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('operation and maintenance funds', 'operating budget / O&M budget', 'general', 'financial') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('fund execution rate', 'budget utilization rate / spend rate', 'general', 'financial') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('resource management officer', 'budget manager / financial controller', 'general', 'financial') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('program objective memorandum', 'multi-year budget proposal / strategic financial plan', 'general', 'financial') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('unfunded requirements list', 'unfunded budget request / supplemental funding request', 'general', 'financial') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('contracting officer representative', 'contract manager / vendor relationship manager', 'general', 'financial') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('government purchase card program', 'corporate purchasing card program / procurement card management', 'general', 'financial') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('acquisition management', 'procurement management / purchasing oversight', 'general', 'financial') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('cost-benefit analysis', 'cost-benefit analysis / return on investment analysis', 'general', 'financial') ON CONFLICT DO NOTHING;

-- ----- ENGINEERING (12 entries) -----
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('combat engineering', 'construction and demolition engineering / field engineering', 'general', 'engineering') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('route clearance', 'road safety inspection / route survey operations', 'general', 'engineering') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('demolition operations', 'controlled demolition / structural demolition', 'general', 'engineering') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('base camp construction', 'temporary facility construction / field site development', 'general', 'engineering') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('horizontal construction', 'road and runway construction / earthwork operations', 'general', 'engineering') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('vertical construction', 'building construction / structural construction', 'general', 'engineering') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('prime power operations', 'large-scale power generation / electrical utility management', 'general', 'engineering') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('utilities infrastructure', 'facility utilities management / building systems', 'general', 'engineering') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('force beddown', 'temporary facility setup / rapid site establishment', 'general', 'engineering') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('barrier plan', 'perimeter security design / access control plan', 'general', 'engineering') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('survivability positions', 'reinforced protective structures / hardened facilities', 'general', 'engineering') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('minefield operations', 'hazardous area management / restricted zone operations', 'general', 'engineering') ON CONFLICT DO NOTHING;

-- ----- AVIATION (12 entries) -----
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('sortie generation', 'flight operations throughput / aircraft mission launch rate', 'general', 'aviation') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('flight operations', 'aircraft operations / flight scheduling and execution', 'general', 'aviation') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('maintenance turnaround', 'aircraft servicing cycle / turnaround time', 'general', 'aviation') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('aircraft availability rate', 'fleet availability rate / aircraft uptime percentage', 'general', 'aviation') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('mission capable rate', 'operational readiness rate / fleet availability', 'general', 'aviation') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('preflight inspection', 'pre-operation safety inspection / equipment check', 'general', 'aviation') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('flight line operations', 'aircraft ramp operations / apron management', 'general', 'aviation') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('air traffic control', 'air traffic management / airspace coordination', 'general', 'aviation') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('aircrew coordination', 'flight crew resource management', 'general', 'aviation') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('aviation safety program', 'flight safety management system', 'general', 'aviation') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('flight scheduling', 'aircraft scheduling / operations planning', 'general', 'aviation') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('aircraft weight and balance', 'load planning / weight distribution management', 'general', 'aviation') ON CONFLICT DO NOTHING;

-- ----- CYBER (12 entries) -----
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('network operations', 'network administration / IT infrastructure management', 'general', 'cyber') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('defensive cyber operations', 'cybersecurity defense / network security operations', 'general', 'cyber') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('information assurance', 'information security / data protection compliance', 'general', 'cyber') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('cyber threat intelligence', 'cybersecurity threat analysis / threat intelligence', 'general', 'cyber') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('offensive cyber operations', 'penetration testing / red team operations', 'general', 'cyber') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('vulnerability assessment', 'security vulnerability assessment / penetration testing', 'general', 'cyber') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('cyber incident response', 'security incident response / breach containment', 'general', 'cyber') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('network security monitoring', 'security operations center monitoring / SIEM management', 'general', 'cyber') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('system hardening', 'security hardening / system configuration management', 'general', 'cyber') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('risk management framework', 'cybersecurity risk management framework / NIST compliance', 'general', 'cyber') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('cyber hygiene', 'cybersecurity best practices / security awareness', 'general', 'cyber') ON CONFLICT DO NOTHING;
INSERT INTO dict_phrase_translations (military_phrase, civilian_phrase, branch, category) VALUES ('authority to operate', 'security authorization / system accreditation', 'general', 'cyber') ON CONFLICT DO NOTHING;

-- =============================================================================
-- SECTION 2: dict_acronyms (100+ new entries)
-- NOT already in the hardcoded ACRONYM_TO_CIVILIAN map in bulletTranslator.ts
-- =============================================================================

-- ----- Intelligence / Analysis -----
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('IPB', 'Intelligence Preparation of the Battlefield', 'comprehensive environmental and threat analysis', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('SIGINT', 'Signals Intelligence', 'electronic communications analysis', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('HUMINT', 'Human Intelligence', 'human source information gathering', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('IMINT', 'Imagery Intelligence', 'satellite and aerial imagery analysis', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('OSINT', 'Open-Source Intelligence', 'public information research and analysis', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('GEOINT', 'Geospatial Intelligence', 'geographic information systems analysis', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('MASINT', 'Measurement and Signature Intelligence', 'technical measurement and analysis', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('CI', 'Counterintelligence', 'insider threat prevention and security investigation', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('DCGS', 'Distributed Common Ground System', 'integrated intelligence analysis platform', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('JSTARS', 'Joint Surveillance Target Attack Radar System', 'airborne surveillance and targeting platform', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('ISR', 'Intelligence, Surveillance, and Reconnaissance', 'intelligence collection and monitoring operations', 'general', 'intel') ON CONFLICT DO NOTHING;

-- ----- Cyber / IT -----
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('DCO', 'Defensive Cyber Operations', 'cybersecurity defense operations', 'general', 'cyber') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('OCO', 'Offensive Cyber Operations', 'penetration testing and red team operations', 'general', 'cyber') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('RMF', 'Risk Management Framework', 'cybersecurity risk management framework', 'general', 'cyber') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('ATO', 'Authority to Operate', 'security authorization for system deployment', 'general', 'cyber') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('IAVA', 'Information Assurance Vulnerability Alert', 'critical security patch notification', 'general', 'cyber') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('STIG', 'Security Technical Implementation Guide', 'security configuration baseline', 'general', 'cyber') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('DISA', 'Defense Information Systems Agency', 'enterprise IT infrastructure agency', 'general', 'cyber') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('NIPR', 'Non-classified Internet Protocol Router', 'unclassified network', 'general', 'cyber') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('SIPR', 'Secret Internet Protocol Router', 'classified network', 'general', 'cyber') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('JWICS', 'Joint Worldwide Intelligence Communications System', 'top-secret network', 'general', 'cyber') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('PKI', 'Public Key Infrastructure', 'digital certificate management system', 'general', 'cyber') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('IAM', 'Information Assurance Manager', 'information security manager', 'general', 'cyber') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('ISSO', 'Information System Security Officer', 'information security officer', 'general', 'cyber') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('ISSM', 'Information System Security Manager', 'information security manager', 'general', 'cyber') ON CONFLICT DO NOTHING;

-- ----- Logistics / Maintenance -----
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('GCSS-A', 'Global Combat Support System - Army', 'enterprise logistics management system', 'army', 'logistics') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('PBUSE', 'Property Book Unit Supply Enhanced', 'inventory management system', 'army', 'logistics') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('STAMIS', 'Standard Army Management Information System', 'enterprise management information system', 'army', 'logistics') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('ULLS', 'Unit Level Logistics System', 'unit-level inventory tracking system', 'army', 'logistics') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('SARSS', 'Standard Army Retail Supply System', 'retail supply management system', 'army', 'logistics') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('NMC', 'Non-Mission Capable', 'equipment out of service', 'general', 'logistics') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('NMCS', 'Non-Mission Capable Supply', 'out of service due to parts shortage', 'general', 'logistics') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('NMCM', 'Non-Mission Capable Maintenance', 'out of service due to maintenance', 'general', 'logistics') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('PMC', 'Partially Mission Capable', 'equipment operating with reduced capability', 'general', 'logistics') ON CONFLICT DO NOTHING;

-- ----- Aviation -----
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('MC', 'Mission Capable', 'aircraft available for operations', 'general', 'aviation') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('FMC', 'Fully Mission Capable', 'aircraft fully operational', 'general', 'aviation') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('NATOPS', 'Naval Air Training and Operating Procedures Standardization', 'aviation standardization and safety procedures', 'navy', 'aviation') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('CNAF', 'Commander Naval Air Forces', 'naval aviation command', 'navy', 'aviation') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('CAG', 'Commander Air Group', 'air wing commander', 'navy', 'aviation') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('LSO', 'Landing Signal Officer', 'aircraft landing safety supervisor', 'navy', 'aviation') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('FCLP', 'Field Carrier Landing Practice', 'aircraft carrier landing training', 'navy', 'aviation') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('AMRAAM', 'Advanced Medium-Range Air-to-Air Missile', 'advanced air defense system', 'general', 'aviation') ON CONFLICT DO NOTHING;

-- ----- Engineering -----
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('ESSAYONS', 'Army Engineer Motto (Let Us Try)', 'Army Corps of Engineers motto', 'army', 'engineering') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('RED HORSE', 'Rapid Engineer Deployable Heavy Operational Repair Squadron Engineers', 'rapid construction and repair unit', 'usaf', 'engineering') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('PRIME BEEF', 'Prime Base Engineer Emergency Force', 'base engineering emergency response team', 'usaf', 'engineering') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('BCE', 'Base Civil Engineer', 'base facilities manager', 'usaf', 'engineering') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('USACE', 'US Army Corps of Engineers', 'federal construction and water resource agency', 'army', 'engineering') ON CONFLICT DO NOTHING;

-- ----- Medical -----
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('TCCC', 'Tactical Combat Casualty Care', 'field emergency trauma care', 'general', 'medical') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('CLS', 'Combat Lifesaver', 'basic emergency medical technician', 'general', 'medical') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('FHP', 'Force Health Protection', 'occupational health and safety program', 'general', 'medical') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('MTF', 'Medical Treatment Facility', 'healthcare facility', 'general', 'medical') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('IMR', 'Individual Medical Readiness', 'employee health compliance status', 'general', 'medical') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('MEDPROS', 'Medical Protection System', 'medical readiness tracking system', 'general', 'medical') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('AHLTA', 'Armed Forces Health Longitudinal Technology Application', 'electronic health records system', 'general', 'medical') ON CONFLICT DO NOTHING;

-- ----- Operations / Planning -----
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('MDMP', 'Military Decision Making Process', 'structured decision-making methodology', 'army', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('TLP', 'Troop Leading Procedures', 'team planning and execution steps', 'army', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('CONOP', 'Concept of Operations', 'operational concept plan', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('COA', 'Course of Action', 'proposed plan of action', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('METT-TC', 'Mission Enemy Terrain Troops Time Civilians', 'operational planning factors', 'army', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('CCIR', 'Commander Critical Information Requirements', 'executive priority information needs', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('PIR', 'Priority Intelligence Requirements', 'priority research questions', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('FFIR', 'Friendly Force Information Requirements', 'internal status reporting requirements', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('BDA', 'Battle Damage Assessment', 'impact assessment', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('OPLAN', 'Operations Plan', 'comprehensive operations plan', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('CONPLAN', 'Contingency Plan', 'contingency response plan', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('EXORD', 'Execute Order', 'execution directive', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('DEPORD', 'Deployment Order', 'deployment directive', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('PLANORD', 'Planning Order', 'planning directive', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('ROC drill', 'Rehearsal of Concept drill', 'operational concept rehearsal', 'general', 'operations') ON CONFLICT DO NOTHING;

-- ----- Financial / Contracting -----
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('GPC', 'Government Purchase Card', 'corporate purchasing card', 'general', 'financial') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('FAR', 'Federal Acquisition Regulation', 'government procurement regulations', 'general', 'financial') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('DFAR', 'Defense Federal Acquisition Regulation', 'defense procurement regulations', 'general', 'financial') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('POM', 'Program Objective Memorandum', 'multi-year budget planning document', 'general', 'financial') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('OMA', 'Operation and Maintenance Army', 'Army operating budget', 'army', 'financial') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('OMN', 'Operation and Maintenance Navy', 'Navy operating budget', 'navy', 'financial') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('MILCON', 'Military Construction', 'capital construction budget', 'general', 'financial') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('UFR', 'Unfunded Requirements', 'supplemental budget requests', 'general', 'financial') ON CONFLICT DO NOTHING;

-- ----- Training / Education -----
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('ILE', 'Intermediate Level Education', 'mid-career leadership development program', 'army', 'training') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('SSE', 'Senior Service Education', 'executive leadership development program', 'general', 'training') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('JPME', 'Joint Professional Military Education', 'cross-organizational leadership development', 'general', 'training') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('CCC', 'Captains Career Course', 'mid-level management development course', 'army', 'training') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('WLC', 'Warrior Leader Course', 'junior leadership development course', 'army', 'training') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('BLC', 'Basic Leader Course', 'foundational leadership development course', 'army', 'training') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('SLC', 'Senior Leader Course', 'senior management development course', 'army', 'training') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('MLC', 'Master Leader Course', 'executive management development course', 'army', 'training') ON CONFLICT DO NOTHING;

-- =============================================================================
-- SECTION 3: dict_military_jargon (50+ new entries)
-- Single-word or short military jargon terms
-- NOTE: dict_military_jargon uses (military_term, civilian_equivalent, context, category)
-- =============================================================================

INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('tasker', 'assignment / action item / work request', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('deliverable', 'work product / output', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('milestone', 'key checkpoint / deliverable date', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('trigger', 'decision point / activation criteria', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('phase line', 'project milestone / progress marker', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('deconflict', 'resolve scheduling conflicts / coordinate', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('synch', 'synchronize / coordinate timing', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('backbrief', 'summary briefing / confirmation briefing', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('touchpoint', 'check-in meeting / coordination point', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('hard deck', 'absolute deadline / non-negotiable limit', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('redline', 'critical threshold / do-not-exceed limit', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('white space', 'unscheduled time / available capacity', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('bandwidth', 'capacity / available resources', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('footprint', 'organizational presence / resource usage', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('posture', 'strategic position / readiness stance', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('pivot', 'change direction / shift focus', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('surge', 'temporary increase in effort / rapid scale-up', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('drawdown', 'reduction in force / scaling back', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('endstate', 'desired outcome / final objective', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('left seat/right seat', 'job shadowing / transition ride-along', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('hip pocket training', 'informal on-the-spot training', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('battle buddy', 'accountability partner / work partner', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('wingman', 'trusted partner / backup support person', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('high-speed', 'high performer / exceptional employee', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('squared away', 'organized / well-prepared / professional', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('tracking', 'understood / following along', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('roger', 'acknowledged / understood', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('wilco', 'will comply / acknowledged and will execute', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('good to go', 'ready / approved / cleared to proceed', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('standby', 'wait / hold / pending further direction', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('cover down', 'take responsibility for / fill the gap', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('spin up', 'prepare rapidly / get up to speed', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('hot wash', 'immediate after-action discussion / quick debrief', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('sand table', 'tabletop exercise / scenario walkthrough', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('wargame', 'scenario planning / simulation exercise', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('red team', 'adversarial review team / challenge group', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('blue team', 'friendly/defensive team', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('green team', 'support team / training team', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('kinetic', 'direct action / hands-on', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('non-kinetic', 'indirect / influence-based / diplomatic', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('enabler', 'support resource / capability multiplier', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('organic', 'internally owned / in-house', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('opcon', 'operational control / day-to-day authority', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('tacon', 'tactical control / field-level authority', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('adcon', 'administrative control / HR authority', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('chop', 'transfer of authority / reassignment', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('chopped to', 'temporarily assigned to / placed under', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('fragmentary order', 'change order / updated directive', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('warning order', 'advance notice / heads-up notification', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('movement order', 'travel directive / relocation order', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('execute order', 'go-ahead directive / implementation order', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('stovepipe', 'siloed / working independently without coordination', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('lane', 'area of responsibility / designated role', 'general', 'Term') ON CONFLICT DO NOTHING;
INSERT INTO dict_military_jargon (military_term, civilian_equivalent, context, category) VALUES ('stay in your lane', 'focus on your responsibilities / stay within scope', 'general', 'Term') ON CONFLICT DO NOTHING;

-- =============================================================================
-- SECTION 4: dict_eval_phrases (branch-specific, 30+ per branch)
-- Focus on Army OER, Navy CHIEFEVAL, USMC PRO/CON, USCG OER, USAF OPR
-- (existing data covers NCOER, EPR, Navy FITREP, USMC FITREP, Coast Guard EER)
-- =============================================================================

-- ----- ARMY OER (Officer Evaluation Report) — 35 entries -----
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('most qualified officer', 'the highest-qualified leader at this level', 'oer', 'top', 'Ranking', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('best officer I have rated', 'the best leader I have evaluated', 'oer', 'top', 'Ranking', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('select for battalion command', 'select for senior management / director-level role', 'oer', 'top', 'Potential', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('select for brigade command', 'select for executive leadership / VP-level role', 'oer', 'top', 'Potential', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('send to War College', 'enroll in senior executive development program', 'oer', 'top', 'Development', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('promote below the zone', 'promote ahead of schedule / early promotion', 'oer', 'top', 'Promotion', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('promote in the primary zone', 'promote on standard timeline', 'oer', 'Meets', 'Promotion', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('retain', 'recommended for continued employment', 'oer', 'Meets', 'Retention', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('excels in complex environments', 'thrives in complex and ambiguous situations', 'oer', 'Exceeds', 'Adaptability', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('demonstrates strategic vision', 'exhibits strategic thinking and long-range planning ability', 'oer', 'Exceeds', 'Leadership', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('builds cohesive teams', 'creates high-performing collaborative teams', 'oer', 'Exceeds', 'Leadership', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('develops subordinate leaders', 'actively mentors and develops emerging leaders', 'oer', 'Exceeds', 'Leadership', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('stewards the profession', 'upholds professional standards and organizational ethics', 'oer', 'Exceeds', 'Character', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('creates a positive environment', 'fosters a healthy and inclusive work culture', 'oer', 'Meets', 'Leadership', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('prepares self', 'invests in continuous self-development', 'oer', 'Meets', 'Development', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('gets results', 'consistently delivers measurable outcomes', 'oer', 'Exceeds', 'Overall', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('leads organizations', 'effectively manages organizational performance', 'oer', 'Exceeds', 'Leadership', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('communicates effectively', 'demonstrates excellent verbal and written communication', 'oer', 'Meets', 'Communication', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('intellect and critical thinking', 'strong analytical and problem-solving abilities', 'oer', 'Exceeds', 'Competence', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('manages resources effectively', 'optimizes budget and resource allocation', 'oer', 'Meets', 'Management', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('officer of unlimited potential', 'executive with extraordinary growth potential', 'oer', 'top', 'Potential', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('a standout among peers', 'clearly distinguishes self among peers', 'oer', 'Exceeds', 'Ranking', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('increased unit readiness', 'improved organizational preparedness and performance', 'oer', 'Exceeds', 'Impact', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('instills confidence in subordinates', 'builds team confidence and trust', 'oer', 'Exceeds', 'Leadership', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('operates effectively in joint environment', 'excels in cross-organizational collaboration', 'oer', 'Exceeds', 'Competence', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('a trusted advisor', 'valued counselor to executive leadership', 'oer', 'Exceeds', 'Leadership', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('assign to key developmental billet', 'assign to high-visibility developmental role', 'oer', 'top', 'Potential', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('broad gauge officer', 'versatile leader with diverse experience', 'oer', 'Exceeds', 'Competence', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('operationally astute', 'possesses deep operational understanding', 'oer', 'Exceeds', 'Competence', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('moral and ethical courage', 'demonstrates integrity in difficult decisions', 'oer', 'Exceeds', 'Character', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('master of the warfighting domain', 'expert in core operational discipline', 'oer', 'top', 'Competence', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('among the top 10 percent', 'among the top 10% of peers', 'oer', 'top', 'Ranking', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('placed first in competitive selection', 'ranked first in competitive evaluation', 'oer', 'top', 'Ranking', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('select for School of Advanced Military Studies', 'select for elite graduate-level program', 'oer', 'top', 'Development', 'army') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('assign to the Joint Staff', 'assign to enterprise-level headquarters', 'oer', 'top', 'Potential', 'army') ON CONFLICT DO NOTHING;

-- ----- NAVY CHIEFEVAL (Chief Petty Officer Evaluation) — 30 entries -----
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('irreplaceable member of the chiefs mess', 'essential member of the senior leadership team', 'chiefeval', 'top', 'Ranking', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('sets the tone for the division', 'establishes the culture and standards for the department', 'chiefeval', 'Exceeds', 'Leadership', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('bridge between wardroom and deckplate', 'liaison between executive management and frontline staff', 'chiefeval', 'Exceeds', 'Leadership', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('invested in sailor development', 'deeply committed to employee growth and development', 'chiefeval', 'Exceeds', 'Leadership', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('owns the outcome', 'takes full accountability for results', 'chiefeval', 'Exceeds', 'Character', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('go-to chief for the command', 'the most relied-upon manager in the organization', 'chiefeval', 'top', 'Ranking', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('strengthened the chiefs mess', 'elevated the senior leadership team performance', 'chiefeval', 'Exceeds', 'Leadership', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('trusted by all levels of leadership', 'respected and trusted across all management levels', 'chiefeval', 'Exceeds', 'Character', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('maintained division at peak readiness', 'kept department at maximum operational readiness', 'chiefeval', 'Exceeds', 'Readiness', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('excelled during Board of Inspection', 'achieved outstanding results during compliance audit', 'chiefeval', 'Exceeds', 'Quality', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('select for Senior Chief', 'ready for promotion to senior manager', 'chiefeval', 'top', 'Promotion', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('a catalyst for change', 'a driver of positive organizational change', 'chiefeval', 'Exceeds', 'Initiative', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('leads with quiet confidence', 'leads effectively with measured confidence', 'chiefeval', 'Exceeds', 'Leadership', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('epitome of chief petty officer leadership', 'the gold standard for senior supervisory leadership', 'chiefeval', 'top', 'Leadership', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('maintains high standards without compromise', 'upholds quality standards without exception', 'chiefeval', 'Exceeds', 'Quality', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('instrumental in achieving command mission', 'critical to achieving organizational objectives', 'chiefeval', 'Exceeds', 'Impact', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('zero rework on all products', 'delivered error-free work requiring no revisions', 'chiefeval', 'Exceeds', 'Quality', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('directly contributed to mission success', 'directly contributed to project success', 'chiefeval', 'Exceeds', 'Impact', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('a pillar of the command', 'a cornerstone of the organization', 'chiefeval', 'top', 'Overall', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('mentor and advocate for sailors', 'mentor and advocate for team members', 'chiefeval', 'Exceeds', 'Leadership', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('transformed the division', 'revitalized and transformed the department', 'chiefeval', 'top', 'Impact', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('managed the largest division on board', 'managed the largest department in the organization', 'chiefeval', 'Exceeds', 'Management', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('achieved highest departmental scores', 'earned the highest departmental performance scores', 'chiefeval', 'top', 'Impact', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('ensured 100% PQS completion', 'achieved 100% staff certification compliance', 'chiefeval', 'Exceeds', 'Training', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('upheld the heritage of the Chief', 'maintained the highest standards of senior leadership', 'chiefeval', 'Exceeds', 'Character', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('principal technical authority', 'the primary technical expert and authority', 'chiefeval', 'top', 'Competence', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('zero safety mishaps', 'maintained a perfect safety record', 'chiefeval', 'Exceeds', 'Safety', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('assign as Command Master Chief', 'assign as senior organizational advisor', 'chiefeval', 'top', 'Potential', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('ready for LCPO assignment', 'ready for senior team lead assignment', 'chiefeval', 'Exceeds', 'Potential', 'navy') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('fleet-wise and operationally seasoned', 'experienced and operationally savvy', 'chiefeval', 'Exceeds', 'Competence', 'navy') ON CONFLICT DO NOTHING;

-- ----- USAF OPR (Officer Performance Report) — 30 entries -----
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('stratify #1 of XX officers', 'ranked first among XX officers', 'opr', 'top', 'Ranking', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('definitely promote', 'strongly recommended for immediate promotion', 'opr', 'top', 'Promotion', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('select for squadron command', 'select for department director position', 'opr', 'top', 'Potential', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('select for group command', 'select for senior director / VP-level role', 'opr', 'top', 'Potential', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('send to IDE in residence', 'enroll in executive education program', 'opr', 'top', 'Development', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('send to SDE in residence', 'enroll in senior executive development program', 'opr', 'top', 'Development', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('wing-level impact', 'organization-wide impact', 'opr', 'Exceeds', 'Impact', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('MAJCOM-level recognition', 'enterprise-level recognition', 'opr', 'Exceeds', 'Recognition', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('a dynamic and innovative leader', 'a dynamic and innovative leader', 'opr', 'Exceeds', 'Leadership', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('led the wing in mission generation', 'led the organization in operational output', 'opr', 'top', 'Impact', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('drove XX% improvement in readiness', 'achieved XX% improvement in operational readiness', 'opr', 'Exceeds', 'Impact', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('hand-selected for special duty', 'specifically chosen for high-visibility assignment', 'opr', 'Exceeds', 'Recognition', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('embodies the whole airman concept', 'excels professionally, personally, and in community service', 'opr', 'Exceeds', 'Overall', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('officer of exceptional character', 'leader of exemplary integrity and character', 'opr', 'Exceeds', 'Character', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('tactical expert', 'operationally proficient / skilled practitioner', 'opr', 'Exceeds', 'Competence', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('multi-domain capable', 'capable across multiple operational domains', 'opr', 'Exceeds', 'Competence', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('exceeded all Air Force standards', 'surpassed all organizational performance standards', 'opr', 'Exceeds', 'Overall', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('maintains combat edge', 'maintains competitive readiness', 'opr', 'Meets', 'Readiness', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('accelerate to senior leadership', 'fast-track to senior management', 'opr', 'top', 'Potential', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('poised for greater responsibility', 'ready for expanded leadership role', 'opr', 'Exceeds', 'Potential', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('my strongest recommendation for promotion', 'my highest recommendation for advancement', 'opr', 'top', 'Promotion', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('led the most challenging project', 'managed the most demanding initiative', 'opr', 'Exceeds', 'Leadership', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('inspires excellence', 'motivates teams to achieve exceptional results', 'opr', 'Exceeds', 'Leadership', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('superb strategic thinker', 'exceptional strategic planning ability', 'opr', 'top', 'Competence', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('earned AF-level award', 'received enterprise-level recognition award', 'opr', 'Exceeds', 'Recognition', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('master communicator', 'exceptional communicator across all levels', 'opr', 'Exceeds', 'Communication', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('flawless execution of wing priorities', 'perfect delivery of organizational priorities', 'opr', 'top', 'Impact', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('mission-essential contributor', 'critical contributor to organizational mission', 'opr', 'Meets', 'Impact', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('assign to joint duty', 'assign to cross-organizational leadership role', 'opr', 'top', 'Potential', 'usaf') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('the officer other officers look to', 'the leader other leaders emulate', 'opr', 'top', 'Ranking', 'usaf') ON CONFLICT DO NOTHING;

-- ----- COAST GUARD OER (Officer Evaluation Report) — 30 entries -----
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('top performer in the district', 'highest-performing leader in the region', 'oer', 'top', 'Ranking', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('select for command at sea', 'select for senior operational leadership role', 'oer', 'top', 'Potential', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('select for command ashore', 'select for facility or regional management role', 'oer', 'top', 'Potential', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('promote to next grade immediately', 'promote immediately / accelerated advancement', 'oer', 'top', 'Promotion', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('excelled in multi-mission environment', 'excelled managing diverse operational requirements', 'oer', 'Exceeds', 'Competence', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('led XX search and rescue cases', 'managed XX emergency response operations', 'oer', 'Exceeds', 'Impact', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('ensured regulatory compliance', 'maintained full regulatory compliance', 'oer', 'Meets', 'Quality', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('drove innovation in operations', 'introduced innovative operational improvements', 'oer', 'Exceeds', 'Initiative', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('strengthened community partnerships', 'built strong community and stakeholder relationships', 'oer', 'Exceeds', 'Leadership', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('a model for junior officers', 'an exemplary role model for emerging leaders', 'oer', 'Exceeds', 'Leadership', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('maintained cutter at peak material readiness', 'maintained vessel/facility at maximum operational readiness', 'oer', 'Exceeds', 'Readiness', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('led successful port state control program', 'managed successful compliance inspection program', 'oer', 'Exceeds', 'Competence', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('achieved highest DEOCS scores', 'achieved highest organizational climate survey scores', 'oer', 'Exceeds', 'Leadership', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('managed XX million in assets', 'managed portfolio valued at XX million dollars', 'oer', 'Exceeds', 'Management', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('exemplary stewardship', 'exceptional management of organizational resources', 'oer', 'Exceeds', 'Management', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('embodies service ethos', 'exemplifies organizational core values and mission', 'oer', 'Exceeds', 'Character', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('ready now for increased responsibility', 'prepared now for next-level leadership role', 'oer', 'Exceeds', 'Potential', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('send to postgraduate education', 'enroll in graduate-level leadership program', 'oer', 'top', 'Development', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('assign to headquarters staff', 'assign to corporate/enterprise headquarters', 'oer', 'top', 'Potential', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('best in class among Coast Guard officers', 'best-in-class among organizational leaders', 'oer', 'top', 'Ranking', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('effective crisis communicator', 'skilled at communications during high-pressure situations', 'oer', 'Exceeds', 'Communication', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('dedicated to crew development', 'committed to team professional growth', 'oer', 'Meets', 'Leadership', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('improved unit morale significantly', 'substantially improved team morale and engagement', 'oer', 'Exceeds', 'Leadership', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('earned sector-level recognition', 'earned regional-level recognition', 'oer', 'Exceeds', 'Recognition', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('operationally versatile', 'adaptable across multiple operational domains', 'oer', 'Exceeds', 'Competence', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('executed flawless law enforcement operations', 'delivered flawless compliance enforcement operations', 'oer', 'Exceeds', 'Competence', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('zero class A mishaps', 'zero major safety incidents', 'oer', 'Exceeds', 'Safety', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('superb mariner', 'expert operational practitioner', 'oer', 'Exceeds', 'Competence', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('unrivaled professional competence', 'unmatched technical and professional expertise', 'oer', 'top', 'Competence', 'uscg') ON CONFLICT DO NOTHING;
INSERT INTO dict_eval_phrases (eval_phrase, civilian_translation, eval_type, performance_level, category, branch) VALUES ('assign to most challenging afloat billet', 'assign to the most demanding operational role', 'oer', 'top', 'Potential', 'uscg') ON CONFLICT DO NOTHING;

-- =============================================================================
-- SECTION 2 (CONTINUED): Additional dict_acronyms to reach 100+
-- =============================================================================

-- ----- Additional Operations / Admin -----
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('ALCON', 'All Concerned', 'all stakeholders / all recipients', 'general', 'admin') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('BLUF', 'Bottom Line Up Front', 'key takeaway first / executive summary first', 'general', 'admin') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('DTG', 'Date-Time Group', 'timestamp / date-time reference', 'general', 'admin') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('EEFI', 'Essential Elements of Friendly Information', 'critical internal information to protect', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('MSR', 'Main Supply Route', 'primary transportation route', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('ASR', 'Alternate Supply Route', 'backup transportation route', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('LOC', 'Lines of Communication', 'supply and communication routes', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('LOO', 'Lines of Operation', 'operational approach / strategic framework', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('LOE', 'Lines of Effort', 'strategic effort areas / focus areas', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('JOPES', 'Joint Operation Planning and Execution System', 'enterprise operations planning system', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('TPFDD', 'Time-Phased Force and Deployment Data', 'deployment scheduling and resource plan', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('JRSOI', 'Joint Reception Staging Onward Movement and Integration', 'arrival processing and integration operations', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('CJCS', 'Chairman of the Joint Chiefs of Staff', 'top military advisor to the President', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('DCFR', 'Defense Casualty and Fatality Report', 'personnel casualty tracking system', 'general', 'admin') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('PERSTAT', 'Personnel Status Report', 'headcount and personnel status report', 'general', 'admin') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('LOGSTAT', 'Logistics Status Report', 'supply and logistics status report', 'general', 'logistics') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('INTSUM', 'Intelligence Summary', 'intelligence briefing summary', 'general', 'intel') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('OPSUM', 'Operations Summary', 'operational activity summary', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('SIGACT', 'Significant Activity', 'noteworthy event or incident', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('TIC', 'Troops in Contact', 'active engagement / critical incident', 'general', 'operations') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('CAS', 'Close Air Support', 'aviation support for ground operations', 'general', 'aviation') ON CONFLICT DO NOTHING;
INSERT INTO dict_acronyms (acronym, full_term, civilian_explanation, branch, category) VALUES ('MEDEVAC', 'Medical Evacuation', 'emergency medical patient transport', 'general', 'medical') ON CONFLICT DO NOTHING;

COMMIT;
