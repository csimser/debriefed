/**
 * Dictionary Translation Engine — Bullet Translator
 *
 * Client-side military-to-civilian bullet translation using cached dictionary data.
 * No API calls, no AI — pure string matching against 700+ dictionary entries.
 * Falls back to AI only when dictionary coverage is below 40%.
 */

import { getDictionary } from './dictionaryQueries';
import { logMissingTerm } from './communityQueries';
import { polishBullet } from './outputPolisher';
import type { DictionaryCache } from './types';

// ============================================================================
// Public Types
// ============================================================================

/** A single replacement made by the dictionary */
export interface DictReplacement {
  original: string;
  replacement: string;
  source: 'compound' | 'phrase' | 'jargon' | 'eval' | 'acronym';
}

/** A vague phrase flagged with quantified alternatives */
export interface VagueFlag {
  phrase: string;
  alternatives: string[];
}

/** A suggestion for a stronger action verb */
export interface VerbSuggestion {
  current: string;
  suggested: string;
  strength: string;
  category: string;
}

/** Full result from dictionary bullet translation */
export interface BulletTranslationResult {
  /** The dictionary-translated bullet text */
  translatedText: string;
  /** Coverage: percentage of original text that was translated (0-100) */
  coverage: number;
  /** Whether the dictionary handled enough of the bullet (coverage >= threshold) */
  dictionarySufficient: boolean;
  /** Individual replacements made */
  replacements: DictReplacement[];
  /** Vague phrases detected with quantified alternatives */
  vagueFlags: VagueFlag[];
  /** Suggestions for stronger action verbs */
  verbSuggestions: VerbSuggestion[];
  /** Military phrases that the dictionary could not translate */
  unmatchedPhrases: string[];
  /** Whether the bullet is already civilian-ready (minimal changes detected) */
  alreadyCivilian?: boolean;
  /** Message to show when bullet is already civilian */
  alreadyCivilianMessage?: string;
}

// ============================================================================
// Configuration
// ============================================================================

/** Minimum coverage for dictionary-only mode (no AI fallback) */
const COVERAGE_THRESHOLD = 40;

// ============================================================================
// Compound Phrases — match as units BEFORE individual words
// ============================================================================

const COMPOUND_PHRASES: Record<string, string> = {
  'TYCOM 3M assessment': 'Fleet Regional Command maintenance evaluation',
  'CSMP corrections': 'maintenance backlog corrections',
  'MRC validations': 'maintenance procedure validations',
  'PMS compliance': 'preventive maintenance compliance',
  'SKED 3.2': 'maintenance scheduling system',
  'OMMS-NG/JCN backlog': 'maintenance tracking backlog',
  '3M program': 'Maintenance Management Program',
  '3M assessment': 'maintenance management evaluation',
  'CPO Mess': 'Senior Leadership Team',
  'CPO mess': 'Senior Leadership Team',
  'PT DLCPO': 'Part-Time Division Senior Supervisor',
  'DLCPO PT': 'Part-Time Division Senior Supervisor',
  'SOY board': 'Employee of the Year selection board',
  'SOQ board': 'Employee of the Quarter selection board',
  'EP recommendation': 'Top Performer recommendation',
  'EP sailor': 'Top Performer',
  'EP eval': 'Top Performer evaluation',
  '3M training': 'Maintenance Management training',
  '3M turnover': 'Maintenance Management program transition',
  '3M program turnover': 'Maintenance Management program transition',
  'U/W events': 'underway operations events',
  'Best In Class': 'Best-in-Class',
  'Best in Class': 'Best-in-Class',
  'deckplate leader': 'hands-on frontline leader',
  'DECKPLATE LEADER': 'hands-on frontline leader',
  'Deckplate Leader': 'hands-on frontline leader',
  'brag sheet': 'performance input form',
  'write-up': 'performance narrative',
  'zone inspection': 'area compliance inspection',
  'material condition assessment': 'equipment readiness evaluation',
  'SAPR VA': 'victim advocate',
  'SAPR VR': 'victim representative',
  'Key Control': 'asset security management',
  'Safety PO': 'workplace safety coordinator',
  'Security Manager': 'information security manager',
  'Training PO': 'training coordinator',
};

// ============================================================================
// Hardcoded Acronym-to-Civilian Map — checked BEFORE dict_acronyms table
// ============================================================================

const ACRONYM_TO_CIVILIAN: Record<string, string> = {
  // ===== UNIVERSAL / CROSS-BRANCH =====
  'DoD': 'Department of Defense',
  'DOD': 'Department of Defense',
  'CONUS': 'continental United States',
  'OCONUS': 'overseas',
  'ORM': 'operational risk management',
  'CRM': 'crew resource management',
  'TDY': 'temporary duty assignment',
  'TAD': 'temporary assignment',
  'PCS': 'permanent relocation',
  'DEROS': 'scheduled rotation date',
  'ETS': 'end of service obligation',
  'MOS': 'military occupational specialty',
  'AFSC': 'career field specialty code',
  'NEC': 'specialty code',
  'OJT': 'on-the-job training',
  'PME': 'professional military education',
  'CBT': 'computer-based training',
  'GMT': 'mandatory training',
  'AAR': 'after-action review',
  'SOP': 'standard operating procedure',
  'ROE': 'rules of engagement',
  'OPORD': 'operations order',
  'FRAGO': 'change to operations order',
  'WARNO': 'advance notice',
  'SITREP': 'status report',
  'SPOTREP': 'incident report',
  'SALUTE': 'threat report format',
  'MEDEVAC': 'medical evacuation',
  'CASEVAC': 'casualty evacuation',
  'KIA': 'killed in action',
  'WIA': 'wounded in action',
  'MIA': 'missing in action',
  'POW': 'prisoner of war',
  'IED': 'improvised explosive device',
  'UXO': 'unexploded ordnance',
  'EOD': 'explosive ordnance disposal',
  'CBRN': 'chemical/biological/radiological/nuclear defense',
  'HAZMAT': 'hazardous materials',
  'PPE': 'personal protective equipment',
  'MOPP': 'protective posture level',
  'IA': 'individual augmentee',
  'JTF': 'joint task force',
  'COCOM': 'combatant command',
  'CENTCOM': 'Central Command',
  'EUCOM': 'European Command',
  'PACOM': 'Pacific Command',
  'INDOPACOM': 'Indo-Pacific Command',
  'SOCOM': 'Special Operations Command',
  'TRANSCOM': 'Transportation Command',
  'CYBERCOM': 'Cyber Command',
  'STRATCOM': 'Strategic Command',
  'NORTHCOM': 'Northern Command',
  'SOUTHCOM': 'Southern Command',
  'AFRICOM': 'Africa Command',
  'AOR': 'area of responsibility',
  'COP': 'common operating picture',
  'TOC': 'tactical operations center',
  'CP': 'command post',
  'HQ': 'headquarters',
  'IG': 'inspector general',
  'JAG': 'legal affairs',
  'SJA': 'staff judge advocate',
  'PAO': 'public affairs',
  'OPSEC': 'operations security',
  'PERSEC': 'personnel security',
  'INFOSEC': 'information security',
  'COMSEC': 'communications security',
  'SSO': 'special security officer',
  'SCO': 'security control officer',
  'FSO': 'facility security officer',
  'SCI': 'sensitive compartmented information',
  'SAP': 'special access program',
  'NOFORN': 'not releasable to foreign nationals',
  'FOUO': 'for official use only',
  'CUI': 'controlled unclassified information',
  'UCMJ': 'military justice code',
  'NJP': 'non-judicial punishment',
  'LOC': 'letter of counseling',
  'LOR': 'letter of reprimand',
  'LOA': 'letter of admonishment',
  'GCM': 'general court-martial',
  'SPCM': 'special court-martial',
  'SCM': 'summary court-martial',
  'SAPR': 'sexual assault prevention',
  'SHARP': 'sexual harassment/assault prevention',
  'EO': 'equal opportunity',
  'MEO': 'military equal opportunity',
  'DEOCS': 'organizational climate survey',
  'MWR': 'Employee Wellness and Recreation',
  'USO': 'United Service Organizations',
  'DFAS': 'finance and accounting',
  'LES': 'leave and earnings statement',
  'BAH': 'housing allowance',
  'BAS': 'subsistence allowance',
  'COLA': 'cost of living allowance',
  'SRB': 'selective reenlistment bonus',
  'TSP': 'Thrift Savings Plan',
  'SGLI': 'service member life insurance',
  'TRICARE': 'military health insurance',
  'VA': 'Veterans Affairs',
  'TAP': 'transition assistance program',
  'TAPS': 'transition assistance program',
  'EAOS': 'end of service obligation',
  'PRD': 'planned rotation date',
  'EAS': 'end of active service',
  'DOS': 'date of separation',
  'ERB': 'personnel record',
  'OMPF': 'official personnel file',
  'iPERMS': 'electronic personnel records',
  'NSIPS': 'personnel management system',
  'MOL': 'Marine Online portal',
  'AKO': 'Army knowledge portal',
  'vMPF': 'virtual personnel center',
  // ===== NAVY SPECIFIC =====
  'OMMS-NG': 'maintenance tracking system',
  'JCN': 'work order',
  'PMS': 'preventive maintenance',
  'SKED': 'scheduling system',
  'CSMP': 'maintenance backlog',
  'MRC': 'maintenance procedures',
  'TYCOM': 'Fleet Regional Command',
  'IEM': 'equipment inspection',
  'AWP': 'parts shortage',
  'WCS': 'Maintenance Team Lead',
  '3MA': 'Maintenance Program Manager',
  '3MC': 'Maintenance Management Coordinator',
  '3M': 'Maintenance Management Program',
  'INSURV': 'Major Compliance Inspection',
  'ATG': 'Training and Readiness Organization',
  'DCPO': 'maintenance supervisor',
  'FITREP': 'performance evaluation',
  'NAVFIT': 'performance evaluation system',
  'EVAL': 'performance evaluation',
  'LPO': 'team lead',
  'LCPO': 'senior team lead',
  'CMC': 'Command Senior Enlisted Advisor',
  'CMDCM': 'Command Master Chief',
  'DLCPO': 'Division Senior Supervisor',
  'MCPO': 'Senior Executive',
  'CPO': 'Senior Supervisor',
  'COMPTUEX': 'Multi-Unit Training Exercise',
  'CSEL': 'Senior Enlisted Leader Program',
  'DRB': 'Disciplinary Review Board',
  'SOY': 'Employee of the Year',
  'EP': 'Top Performer',
  'MP': 'High Performer',
  'JO': 'Junior Manager',
  'JOs': 'Junior Managers',
  'SME': 'Subject Matter Expert',
  'AFLOAT': 'Shipboard Operations',
  'GOAD': 'Goals and Objectives',
  'FR': 'Policy Update',
  'U/W': 'Underway Operations',
  'XO': 'deputy director',
  'CO': 'director',
  'CHENG': 'chief engineer',
  'DCA': 'safety officer',
  'OOD': 'officer of the watch',
  'EOOW': 'engineering watch officer',
  'CDO': 'command duty officer',
  'JOOD': 'junior officer of the watch',
  'BMOW': 'bridge watch supervisor',
  'CIC': 'operations center',
  'CDC': 'operations center',
  'COMMS': 'communications',
  'OPREP': 'operational report',
  'CASREP': 'equipment casualty report',
  'SORTS': 'readiness reporting',
  'DRRS': 'readiness reporting',
  'SPAWAR': 'naval systems command',
  'NAVWAR': 'naval information warfare systems',
  'PEO': 'program executive office',
  'NAVSEA': 'naval systems command',
  'NAVAIR': 'naval aviation systems',
  'NAVSUP': 'supply command',
  'OPNAV': 'headquarters staff',
  'ISIC': 'immediate superior command',
  'DESRON': 'destroyer squadron',
  'CSG': 'carrier strike group',
  'ESG': 'expeditionary strike group',
  'AIRDET': 'aviation detachment',
  'UNREP': 'underway replenishment',
  'RAS': 'replenishment at sea',
  'GQ': 'general quarters',
  'DC': 'damage control',
  'DCTT': 'damage control training team',
  'TQL': 'total quality leadership',
  'PQS': 'personnel qualification standards',
  'NKO': 'online training system',
  'NEL': 'Navy e-Learning',
  'CANTRAC': 'training catalog',
  'BCA': 'fitness standards assessment',
  'PRT': 'physical readiness test',
  'FEP': 'fitness enhancement program',
  'DAPA': 'substance abuse prevention advisor',
  'CFL': 'command fitness leader',
  'SARC': 'sexual assault response coordinator',
  'CMEO': 'equal opportunity manager',
  'ESO': 'educational services officer',
  'NC': 'career counselor',
  'CCC': 'command career counselor',
  'CACO': 'casualty assistance officer',
  'DIVO': 'division officer',
  'DH': 'department head',
  'SUPPO': 'supply officer',
  'NAV': 'navigator',
  'OPS': 'operations',
  'WEPS': 'weapons officer',
  'COMMO': 'communications officer',
  'AOPS': 'assistant operations officer',
  'EMO': 'electronics material officer',
  'MPA': 'main propulsion assistant',
  'AUXO': 'auxiliaries officer',
  'ADMIN': 'administration',
  'FLC': 'fleet logistics center',
  'FISC': 'fleet industrial supply center',
  'NSA': 'naval support activity',
  'NAS': 'naval air station',
  'NAVSTA': 'naval station',
  'CNSP': 'Commander Naval Surface Forces Pacific',
  'CNAL': 'Commander Naval Air Forces Atlantic',
  'SURFLANT': 'surface forces Atlantic',
  'SURFPAC': 'surface forces Pacific',
  'AIRLANT': 'air forces Atlantic',
  'AIRPAC': 'air forces Pacific',
  'SUBLANT': 'submarine forces Atlantic',
  'SUBPAC': 'submarine forces Pacific',
  'CTN': 'cryptologic technician (networks)',
  'IT': 'information technology',
  'ITS': 'information technology submariner',
  'ET': 'electronics technician',
  'FC': 'fire controlman',
  'OS': 'operations specialist',
  'QM': 'quartermaster',
  'BM': 'boatswain\'s mate',
  'HM': 'hospital corpsman',
  'MA': 'master-at-arms',
  'LS': 'logistics specialist',
  'PS': 'personnel specialist',
  'YN': 'yeoman',
  'SK': 'storekeeper',
  'HT': 'hull maintenance technician',
  'MM': 'machinist\'s mate',
  'EN': 'engineman',
  'GSM': 'gas turbine systems mechanic',
  'GSE': 'gas turbine systems electrician',
  'EM': 'electrician\'s mate',
  'IC': 'interior communications electrician',
  'FORCM': 'Fleet Force Master Chief',
  'FLTCM': 'Fleet Master Chief',
  'MCPON': 'Master Chief Petty Officer of the Navy',
  'COB': 'Chief of the Boat',
  'RPPO': 'repair parts petty officer',
  'EKMS': 'electronic key management',
  'DCC': 'damage control chief',
  'DCCS': 'damage control chief (surface)',
  'EDO': 'engineering duty officer',
  'TAO': 'tactical action officer',
  'CICWO': 'combat information center watch officer',
  'ESWS': 'Enlisted Surface Warfare Specialist',
  'EAWS': 'Enlisted Aviation Warfare Specialist',
  'EIWS': 'Enlisted Information Warfare Specialist',
  'EXW': 'Expeditionary Warfare Specialist',
  'SCW': 'Special Warfare Combatant-craft Crewman',
  'FMF': 'Fleet Marine Force',
  'AW': 'Aviation Warfare',
  'SW': 'Surface Warfare',
  'SS': 'submarine warfare qualified',
  'IW': 'Information Warfare',
  'IDW': 'Information Dominance Warfare',
  'COSAL': 'coordinated shipboard allowance list',
  'OPTAR': 'operating target budget',
  'FLTMPS': 'fleet training management system',
  'NROWS': 'Navy Reserve Order Writing System',
  'CMS-ID': 'configuration management system',
  'NFAAS': 'Navy Family Accountability system',
  'MRRS': 'Medical Readiness Reporting System',
  'DPIA': 'defense planning and improvement assessment',
  'OFRP': 'Optimized Fleet Response Plan',
  'TSTA': 'tailored ship training availability',
  'CART': 'command assessment of readiness and training',
  'BRC': 'basic readiness certification',
  'ULTRA-C': 'unit-level training assessment (combat)',
  'ULTRA-S': 'unit-level training assessment (survivability)',
  'ULTRA-E': 'unit-level training assessment (engineering)',
  'NFMT': 'Naval Foundry and Manufacturing Team',
  'APL': 'allowance parts list',
  'AEL': 'allowance equipage list',
  'SUPERS': 'Navy Supply Systems Command',
  'CNSF': 'Commander Naval Surface Forces',
  'CNSL': 'Commander Naval Surface Group',
  'P': 'Satisfactory Performer',
  'SP': 'Below Standards',
  'NOB': 'Not Observed',
  'RSCA': 'Reporting Senior Cumulative Average',
  'ITA': 'Individual Trait Average',
  'NAO': 'Naval Aviation Observer',
  // ===== ARMY SPECIFIC =====
  'NCOER': 'performance evaluation',
  'OER': 'officer performance evaluation',
  'NCOIC': 'non-commissioned officer in charge',
  'OIC': 'officer in charge',
  'NCO': 'non-commissioned officer',
  'SNCO': 'senior non-commissioned officer',
  'CSM': 'command sergeant major',
  'SGM': 'sergeant major',
  'SFC': 'sergeant first class',
  'SSG': 'staff sergeant',
  'SGT': 'sergeant',
  'CPL': 'corporal',
  'SPC': 'specialist',
  'PFC': 'private first class',
  'PV2': 'private',
  'PVT': 'private',
  'BCT': 'brigade combat team',
  'BDE': 'brigade',
  'BN': 'battalion',
  'PLT': 'platoon',
  'SQD': 'squad',
  'TM': 'team',
  'HHC': 'headquarters company',
  'FSC': 'forward support company',
  'BSB': 'brigade support battalion',
  'DIVARTY': 'division artillery',
  'CAB': 'combat aviation brigade',
  'SBCT': 'Stryker brigade combat team',
  'ABCT': 'armored brigade combat team',
  'IBCT': 'infantry brigade combat team',
  'FORSCOM': 'Forces Command',
  'TRADOC': 'Training and Doctrine Command',
  'AMC': 'Army Materiel Command',
  'INSCOM': 'Intelligence and Security Command',
  'USAREC': 'Army Recruiting Command',
  'IMCOM': 'Installation Management Command',
  'MEDCOM': 'Medical Command',
  'USACE': 'Army Corps of Engineers',
  'PBO': 'property book officer',
  'S1': 'human resources/personnel',
  'S2': 'intelligence/security',
  'S3': 'operations/training',
  'S4': 'logistics/supply',
  'S6': 'communications/IT',
  'G1': 'division/corps personnel',
  'G2': 'division/corps intelligence',
  'G3': 'division/corps operations',
  'G4': 'division/corps logistics',
  'G6': 'division/corps communications',
  'J1': 'joint personnel',
  'J2': 'joint intelligence',
  'J3': 'joint operations',
  'J4': 'joint logistics',
  'J6': 'joint communications',
  'PSG': 'platoon sergeant',
  'ISG': 'first sergeant',
  '1SG': 'first sergeant',
  'SL': 'squad leader',
  'TL': 'team leader',
  'APFT': 'physical fitness test',
  'ACFT': 'combat fitness test',
  'DA': 'Department of the Army',
  'AR': 'Army regulation',
  'FM': 'field manual',
  'OPFOR': 'opposing force',
  'BLUFOR': 'friendly force',
  'NTC': 'National Training Center',
  'JRTC': 'Joint Readiness Training Center',
  'CTC': 'combat training center',
  'FTX': 'field training exercise',
  'STX': 'situational training exercise',
  'LFX': 'live fire exercise',
  'TADSS': 'training aids and devices',
  'DTMS': 'digital training management system',
  'USR': 'unit status report',
  'MTOE': 'personnel and equipment authorization',
  'TDA': 'organizational structure document',
  'UMR': 'unit manning report',
  'MEDPROS': 'medical readiness system',
  'DPAS': 'property accountability system',
  'PBUSE': 'property management system',
  'eMILPO': 'personnel management system',
  'ATTRS': 'training requirements system',
  'DTS': 'travel management system',
  'GFEBS': 'financial management system',
  'PMCS': 'preventive maintenance checks',
  'TI': 'technical inspection',
  'QA': 'quality assurance',
  'QC': 'quality control',
  'COMMEX': 'communications exercise',
  'LOGPAC': 'logistics package',
  'MSR': 'main supply route',
  'ASR': 'alternate supply route',
  'FOB': 'forward operating base',
  'PB': 'patrol base',
  'JSS': 'joint security station',
  'ECP': 'entry control point',
  'TCP': 'traffic control point',
  'CONOP': 'concept of operations',
  'EXORD': 'execute order',
  'SMA': 'Sergeant Major of the Army',
  'WO1': 'warrant officer 1',
  'CW2': 'chief warrant officer 2',
  'CW3': 'chief warrant officer 3',
  'CW4': 'chief warrant officer 4',
  'CW5': 'chief warrant officer 5',
  'GCSS-Army': 'logistics management system',
  'JKO': 'Joint Knowledge Online',
  'ATRRS': 'training requirements system',
  'CSSB': 'combat sustainment support battalion',
  'BLC': 'Basic Leader Course',
  'ALC': 'Advanced Leader Course',
  'SLC': 'Senior Leader Course',
  'MLC': 'Master Leader Course',
  'BOLC': 'Basic Officer Leader Course',
  'ILE': 'Intermediate Level Education',
  'CGSC': 'Command and General Staff College',
  // ===== MARINE CORPS SPECIFIC =====
  'USMC': 'United States Marine Corps',
  'MARDIV': 'Marine Division',
  'MAW': 'Marine Aircraft Wing',
  'MLG': 'Marine Logistics Group',
  'MEF': 'Marine Expeditionary Force',
  'MEB': 'Marine Expeditionary Brigade',
  'MEU': 'Marine Expeditionary Unit',
  'MAGTF': 'Marine Air-Ground Task Force',
  'GCE': 'ground combat element',
  'ACE': 'aviation combat element',
  'LCE': 'logistics combat element',
  'CE': 'command element',
  'HQMC': 'Headquarters Marine Corps',
  'SMMC': 'Sergeant Major of the Marine Corps',
  'MARFORCOM': 'Marine Forces Command',
  'MARFORPAC': 'Marine Forces Pacific',
  'MCRD': 'Marine Corps Recruit Depot',
  'TBS': 'The Basic School',
  'IOC': 'Infantry Officer Course',
  'SOI': 'School of Infantry',
  'MCB': 'Marine Corps Base',
  'MCAS': 'Marine Corps Air Station',
  'MCLB': 'Marine Corps Logistics Base',
  'MCSC': 'Marine Corps Systems Command',
  'MCWL': 'Marine Corps Warfighting Lab',
  'TECOM': 'Training and Education Command',
  'MCCDC': 'Combat Development Command',
  'MARCENT': 'Marine Forces Central Command',
  'SNCOIC': 'senior NCO in charge',
  'MECEP': 'enlisted commissioning program',
  'MARADMIN': 'Marine administrative message',
  'ALMAR': 'all Marines message',
  'CFT': 'combat fitness test',
  'PFT': 'physical fitness test',
  'MCMAP': 'martial arts program',
  'PMO': 'provost marshal office',
  'SMP': 'squadron maintenance program',
  'MALS': 'Marine Aviation Logistics Squadron',
  'VMFA': 'Marine Fighter Attack Squadron',
  'VMM': 'Marine Medium Tiltrotor Squadron',
  'HMH': 'Marine Heavy Helicopter Squadron',
  'HMLA': 'Marine Light Attack Helicopter Squadron',
  // ===== AIR FORCE SPECIFIC =====
  'USAF': 'United States Air Force',
  'EPR': 'performance evaluation',
  'OPR': 'officer performance report',
  'AF': 'Air Force',
  'AFI': 'Air Force instruction',
  'AFMAN': 'Air Force manual',
  'AFPD': 'Air Force policy directive',
  'ACC': 'Air Combat Command',
  'AETC': 'Air Education and Training Command',
  'AFGSC': 'Air Force Global Strike Command',
  'AFSPC': 'Air Force Space Command',
  'AFSOC': 'Air Force Special Operations Command',
  'PACAF': 'Pacific Air Forces',
  'USAFE': 'US Air Forces in Europe',
  'ANG': 'Air National Guard',
  'AFRC': 'Air Force Reserve Command',
  'MAJCOM': 'major command',
  'NAF': 'numbered air force',
  'OG': 'operations group',
  'MXG': 'maintenance group',
  'MSG': 'mission support group',
  'MDG': 'medical group',
  'SQ': 'Employee of the Quarter',
  'FLT': 'flight',
  'CC': 'commander',
  'CD': 'deputy commander',
  'DO': 'director of operations',
  'MX': 'maintenance',
  'SF': 'security forces',
  'SFS': 'security forces squadron',
  'CES': 'civil engineering squadron',
  'CS': 'communications squadron',
  'FSS': 'force support squadron',
  'LRS': 'logistics readiness squadron',
  'AMXS': 'aircraft maintenance squadron',
  'MXS': 'maintenance squadron',
  'OSS': 'operations support squadron',
  'CMSGT': 'chief master sergeant',
  'SMSGT': 'senior master sergeant',
  'MSGT': 'master sergeant',
  'TSGT': 'technical sergeant',
  'SSGT': 'staff sergeant',
  'SRA': 'senior airman',
  'A1C': 'airman first class',
  'AMN': 'airman',
  'AB': 'airman basic',
  'UDM': 'unit deployment manager',
  'UTM': 'unit training manager',
  'UGT': 'upgrade training',
  'ALS': 'Airman Leadership School',
  'NCOA': 'NCO Academy',
  'SNCOA': 'Senior NCO Academy',
  'OTS': 'Officer Training School',
  'SOS': 'Squadron Officer School',
  'ACSC': 'Air Command and Staff College',
  'AWC': 'Air War College',
  'WAPS': 'weighted airman promotion system',
  'TIG': 'time in grade',
  'TIS': 'time in service',
  'DAFSC': 'duty specialty code',
  'PAFSC': 'primary specialty code',
  'CAFSC': 'control specialty code',
  'AFIMS': 'information management system',
  'IMDS': 'maintenance data system',
  'GO81': 'maintenance management system',
  'CAMS': 'maintenance system',
  'AEF': 'Air Expeditionary Force',
  'AEW': 'Air Expeditionary Wing',
  'UTC': 'unit type code',
  'DRMO': 'surplus property disposal',
  'ADLS': 'advanced distributed learning',
  'MICT': 'management internal control toolset',
  'SAV': 'staff assistance visit',
  'UCI': 'unit compliance inspection',
  'CCIP': 'commander\'s inspection program',
  'ASEV': 'aircrew standardization evaluation',
  'TBA': 'training business area',
  'AMS': 'assignment management system',
  'SURF': 'single unit retrieval format',
  'PRDA': 'personnel records display application',
  'LOE': 'letter of evaluation',
  // ===== COAST GUARD SPECIFIC =====
  'USCG': 'United States Coast Guard',
  'CGHQ': 'Coast Guard Headquarters',
  'ATC': 'training center',
  'TRACEN': 'training center',
  'FORCECOM': 'Force Readiness Command',
  'DCMS': 'Deputy Commandant for Mission Support',
  'DCO': 'Deputy Commandant for Operations',
  'MSST': 'maritime security team',
  'MSRT': 'maritime security response team',
  'PSU': 'port security unit',
  'PATFORSWA': 'patrol forces Southwest Asia',
  'TACLET': 'tactical law enforcement team',
  'CGC': 'Coast Guard Cutter',
  'WHEC': 'high endurance cutter',
  'WMEC': 'medium endurance cutter',
  'WPB': 'patrol boat',
  'WLB': 'buoy tender',
  'ATON': 'aids to navigation',
  'SAR': 'search and rescue',
  'SAROPS': 'search and rescue planning system',
  'MLE': 'maritime law enforcement',
  'MISLE': 'marine information system',
  'ALMIS': 'asset logistics management',
  'ESD': 'electronic systems division',
  'OAR': 'officer assignment record',
  'EER': 'enlisted evaluation report',
  'OAAS': 'officer and enlisted performance',
  'EPME': 'enlisted professional development',
  'AMIO': 'alien migrant interdiction operations',
  'PWCS': 'ports, waterways, and coastal security',
  'BOLO': 'be on the lookout',
  'COMDTINST': 'Commandant instruction',
  // ===== SPACE FORCE SPECIFIC =====
  'USSF': 'United States Space Force',
  'SPOC': 'Space Operations Command',
  'STARCOM': 'Space Training and Readiness Command',
  'SSC': 'Space Systems Command',
  'CMSAF': 'Chief Master Sergeant of the Space Force',
  'CSO': 'Chief of Space Operations',
  'DEL': 'delta (unit)',
  'GARR': 'garrison',
  'SLD': 'Space Launch Delta',
  'SOPS': 'Space Operations Squadron',
  'CSpOC': 'Combined Space Operations Center',
  'JSpOC': 'Joint Space Operations Center',
  // ===== COMMON MILITARY TERMS =====
  'Sailor': 'team member',
  'Sailors': 'personnel',
  'sailors': 'personnel',
  'Soldier': 'team member',
  'Soldiers': 'personnel',
  'soldiers': 'personnel',
  'Airman': 'team member',
  'Airmen': 'personnel',
  'airmen': 'personnel',
  'Marine': 'team member',
  'Marines': 'personnel',
  'marines': 'personnel',
  'Guardian': 'team member',
  'Guardians': 'personnel',
  'guardians': 'personnel',
  'Coastguardsman': 'team member',
  'enlisted': 'staff',
  'commissary': 'grocery store',
  'BX': 'retail store',
  'PX': 'retail store',
  'NEX': 'retail store',
  'MCX': 'retail store',
  'AAFES': 'military retail',
  'billeting': 'lodging',
  'BOQ': 'officer lodging',
  'BEQ': 'enlisted lodging',
  'barracks': 'residential quarters',
  'chow hall': 'dining facility',
  'DFAC': 'dining facility',
  'galley': 'dining facility',
  'mess deck': 'dining facility',
  'berthing': 'crew quarters',
  'rack': 'bed',
  'head': 'restroom',
  'scuttlebutt': 'water fountain',
  'quarterdeck': 'reception area',
  'passageway': 'hallway',
  'ladder well': 'stairwell',
  'hatch': 'door',
  'bulkhead': 'wall',
  'overhead': 'ceiling',
  'fantail': 'rear platform',
  'bridge': 'control center',
  'combat': 'operations',
  'equipage': 'equipment',
  'materiel': 'supplies and equipment',
  'ordnance': 'weapons/ammunition',
  'ammo': 'ammunition',
  'chit': 'request form',
  'muster': 'accountability check',
  'liberty': 'time off',
  'deployment': 'overseas assignment',
  'underway': 'at sea operations',
  'watch': 'shift duty',
  'duty section': 'on-call team',
  'port and starboard': 'rotating shift schedule',
  'field day': 'deep cleaning',
  'GI party': 'deep cleaning',
  'PT': 'physical training',
  'reveille': 'morning wake-up',
  'taps': 'lights out',
  'colors': 'flag ceremony',
  'formation': 'group assembly',
  'drill': 'training exercise',
  'evolution': 'planned operation',
  'sortie': 'mission flight',
  'op tempo': 'operational pace',
  'readiness': 'operational preparedness',
  'spot checks': 'quality inspections',
  'maintenance lags': 'maintenance delays',
  'material readiness': 'equipment readiness',
};

/** Build case-insensitive lookup for ACRONYM_TO_CIVILIAN */
const _acronymLookup = new Map<string, string>();
for (const [key, val] of Object.entries(ACRONYM_TO_CIVILIAN)) {
  _acronymLookup.set(key.toLowerCase(), val);
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Translate a military bullet using dictionary data only.
 *
 * Scans the bullet text against phrase translations, military jargon,
 * eval phrases, and acronyms. Returns the translated text and metadata
 * about what was replaced, coverage, and suggestions.
 *
 * @param bulletText - The original military bullet text
 * @param context - Optional context for branch-aware matching
 * @returns Translation result with coverage and suggestions
 */
export async function translateBullet(
  bulletText: string,
  context?: {
    branch?: string;
    rank?: string;
    evalType?: string;
    targetKeywords?: string[];
  },
): Promise<BulletTranslationResult> {
  const dict = await getDictionary();
  const branch = context?.branch?.toLowerCase() ?? '';

  let translated = bulletText;
  const replacements: DictReplacement[] = [];
  let totalReplacedChars = 0;

  // 0. Compound phrases (multi-word units matched BEFORE individual words)
  const compoundResult = applyCompoundPhrases(translated);
  translated = compoundResult.text;
  replacements.push(...compoundResult.replacements);
  totalReplacedChars += compoundResult.replacedChars;

  // 1. Hardcoded acronym map (checked BEFORE dict_acronyms table)
  const hardcodedResult = applyHardcodedAcronyms(translated);
  translated = hardcodedResult.text;
  replacements.push(...hardcodedResult.replacements);
  totalReplacedChars += hardcodedResult.replacedChars;

  // 2. Phrase translations (longest first to avoid partial replacements)
  const phraseResult = applyPhraseTranslations(translated, dict, branch);
  translated = phraseResult.text;
  replacements.push(...phraseResult.replacements);
  totalReplacedChars += phraseResult.replacedChars;

  // 3. Eval phrases (branch-aware, longest first)
  const evalResult = applyEvalPhrases(translated, dict, branch);
  translated = evalResult.text;
  replacements.push(...evalResult.replacements);
  totalReplacedChars += evalResult.replacedChars;

  // 4. Military jargon (branch-aware, longest first)
  const jargonResult = applyMilitaryJargon(translated, dict, branch);
  translated = jargonResult.text;
  replacements.push(...jargonResult.replacements);
  totalReplacedChars += jargonResult.replacedChars;

  // 5. Dict acronyms fallback (only for terms NOT in hardcoded map; description only)
  const acronymResult = applyAcronyms(translated, dict, branch);
  translated = acronymResult.text;
  replacements.push(...acronymResult.replacements);
  totalReplacedChars += acronymResult.replacedChars;

  // Calculate coverage: what percentage of the original text was touched
  const originalLen = bulletText.trim().length;
  const coverage = originalLen > 0
    ? Math.min(100, Math.round((totalReplacedChars / originalLen) * 100))
    : 0;

  // 6. Flag vague phrases
  const vagueFlags = findVaguePhrases(translated, dict);

  // 7. Suggest stronger action verbs
  const verbSuggestions = suggestActionVerbs(translated, dict);

  // 8. Extract unmatched military phrases
  const unmatchedPhrases = extractUnmatchedPhrases(bulletText, replacements);

  // 9. Determine sufficiency using smart fallback logic:
  //    - coverage >= 40% → always sufficient (guaranteed pass)
  //    - dict replaced 1+ terms AND remaining text is civilian → sufficient
  //    - dict replaced 0 terms AND bullet is already civilian → sufficient
  //    - otherwise → insufficient, fall back to AI
  let dictionarySufficient: boolean;

  if (coverage >= COVERAGE_THRESHOLD) {
    dictionarySufficient = true;
  } else if (replacements.length > 0 && !hasRemainingMilitaryContent(translated, dict)) {
    // Dictionary caught what it could; the rest is plain English
    dictionarySufficient = true;
  } else if (replacements.length === 0 && !hasRemainingMilitaryContent(bulletText, dict)) {
    // Nothing to replace — the bullet was already civilian English
    dictionarySufficient = true;
  } else {
    // Genuine untranslatable military content remains → need AI
    dictionarySufficient = false;
  }

  // 10. Auto-log missing terms only when genuinely insufficient (fire-and-forget)
  if (!dictionarySufficient && unmatchedPhrases.length > 0) {
    for (const phrase of unmatchedPhrases.slice(0, 3)) {
      logMissingTerm(phrase, bulletText.substring(0, 200), branch).catch(() => {});
    }
  }

  // 11. Detect if bullet is already civilian-ready
  const { alreadyCivilian, alreadyCivilianMessage } = detectAlreadyCivilian(
    bulletText,
    cleanupText(translated),
    replacements,
    coverage,
  );

  // If already civilian, prefer original text and mark sufficient
  if (alreadyCivilian) {
    dictionarySufficient = true;
  }

  // Polish the translated text through the output polisher
  let polishedText = alreadyCivilian ? bulletText : polishBullet(cleanupText(translated));

  // 12. Job-specific keyword injection (final pass)
  if (context?.targetKeywords?.length && !alreadyCivilian) {
    polishedText = injectTargetKeywords(polishedText, context.targetKeywords);
  }

  return {
    translatedText: polishedText,
    coverage,
    dictionarySufficient,
    replacements,
    vagueFlags,
    verbSuggestions,
    unmatchedPhrases,
    alreadyCivilian,
    alreadyCivilianMessage,
  };
}

// ============================================================================
// Translation Layers
// ============================================================================

interface ReplacementResult {
  text: string;
  replacements: DictReplacement[];
  replacedChars: number;
}

/**
 * Apply compound phrase matching — multi-word military phrases matched as units
 * BEFORE individual words are processed. Sorted longest-first.
 */
function applyCompoundPhrases(text: string): ReplacementResult {
  const replacements: DictReplacement[] = [];
  let result = text;
  let replacedChars = 0;

  // Sort longest phrases first to avoid partial matches
  const sorted = Object.entries(COMPOUND_PHRASES).sort(
    (a, b) => b[0].length - a[0].length,
  );

  for (const [phrase, civilian] of sorted) {
    const escaped = escapeRegex(phrase);
    const regex = new RegExp(escaped, 'gi');
    const match = result.match(regex);
    if (match) {
      result = result.replace(regex, civilian);
      replacedChars += match.reduce((sum, m) => sum + m.length, 0);
      replacements.push({
        original: match[0],
        replacement: civilian,
        source: 'compound',
      });
    }
  }

  return { text: result, replacements, replacedChars };
}

/**
 * Apply hardcoded ACRONYM_TO_CIVILIAN map — checked FIRST before dict_acronyms.
 * Case-insensitive matching using pre-built lookup.
 */
function applyHardcodedAcronyms(text: string): ReplacementResult {
  const replacements: DictReplacement[] = [];
  let result = text;
  let replacedChars = 0;
  const alreadyReplaced = new Set<string>();

  // Sort by key length descending (longer matches first)
  const sortedKeys = Object.keys(ACRONYM_TO_CIVILIAN).sort(
    (a, b) => b.length - a.length,
  );

  for (const key of sortedKeys) {
    const keyLower = key.toLowerCase();
    if (alreadyReplaced.has(keyLower)) continue;

    const civilian = ACRONYM_TO_CIVILIAN[key];
    if (!civilian) continue;

    // Multi-word phrases: substring match (case-insensitive)
    if (key.includes(' ') || key.includes('/')) {
      const escaped = escapeRegex(key);
      const regex = new RegExp(escaped, 'gi');
      const match = result.match(regex);
      if (match) {
        result = result.replace(regex, civilian);
        replacedChars += match.reduce((sum, m) => sum + m.length, 0);
        alreadyReplaced.add(keyLower);
        replacements.push({ original: match[0], replacement: civilian, source: 'acronym' });
      }
    } else {
      // Single word: word-boundary matching
      // Short terms (<=3 chars): only match ALL CAPS to avoid false positives
      const isShort = key.length <= 3;
      if (isShort) {
        const escaped = escapeRegex(key.toUpperCase());
        const regex = new RegExp(`\\b${escaped}\\b`, 'g');
        const match = result.match(regex);
        if (match) {
          result = result.replace(regex, civilian);
          replacedChars += match.reduce((sum, m) => sum + m.length, 0);
          alreadyReplaced.add(keyLower);
          replacements.push({ original: match[0], replacement: civilian, source: 'acronym' });
        }
      } else {
        const escaped = escapeRegex(key);
        const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
        const match = result.match(regex);
        if (match) {
          result = result.replace(regex, civilian);
          replacedChars += match.reduce((sum, m) => sum + m.length, 0);
          alreadyReplaced.add(keyLower);
          replacements.push({ original: match[0], replacement: civilian, source: 'acronym' });
        }
      }
    }
  }

  return { text: result, replacements, replacedChars };
}

/**
 * Apply dict_phrase_translations — full military phrases → civilian equivalents.
 * Sorted longest-first to prevent partial replacements.
 */
function applyPhraseTranslations(
  text: string,
  dict: DictionaryCache,
  branch: string,
): ReplacementResult {
  // Sort by phrase length descending, prefer branch-specific matches
  const sorted = [...(dict.phraseTranslations ?? [])].sort((a, b) => {
    // Branch-specific entries first
    const aMatch = branchMatches(a.branch, branch) ? 1 : 0;
    const bMatch = branchMatches(b.branch, branch) ? 1 : 0;
    if (aMatch !== bMatch) return bMatch - aMatch;
    return (b.military_phrase ?? '').length - (a.military_phrase ?? '').length;
  });

  return applyReplacements(text, sorted, 'phrase', (entry) => ({
    search: entry.military_phrase,
    replace: entry.civilian_phrase,
    branchFilter: entry.branch,
  }), branch);
}

/**
 * Apply dict_eval_phrases — performance eval language → civilian translation.
 * Branch-aware matching.
 */
function applyEvalPhrases(
  text: string,
  dict: DictionaryCache,
  branch: string,
): ReplacementResult {
  const sorted = [...(dict.evalPhrases ?? [])].sort((a, b) => {
    const aMatch = branchMatches(a.branch, branch) ? 1 : 0;
    const bMatch = branchMatches(b.branch, branch) ? 1 : 0;
    if (aMatch !== bMatch) return bMatch - aMatch;
    return (b.eval_phrase ?? '').length - (a.eval_phrase ?? '').length;
  });

  return applyReplacements(text, sorted, 'eval', (entry) => ({
    search: entry.eval_phrase,
    replace: entry.civilian_translation,
    branchFilter: entry.branch,
  }), branch);
}

/** Common English words that exist in the jargon table but should NOT be auto-replaced in bullets */
const JARGON_SKIP_LIST = new Set([
  'to', 'at', 'in', 'on', 'up', 'or', 'it', 'do', 'go', 'no', 'so',
  'an', 'as', 'by', 'if', 'of', 'is', 'am', 'be', 'he', 'we', 'my',
  'rate', 'rates', 'field', 'post', 'detail', 'watch', 'cover', 'leave',
  'round', 'check', 'fire', 'camp', 'base', 'point', 'order', 'copy',
  'line', 'mark', 'head', 'lead', 'deck', 'log', 'top',
]);

/**
 * Apply dict_military_jargon — military terms → civilian equivalents.
 * Branch-aware, longest first.
 * Skips common English words to avoid false positives.
 * Single-word terms ≤ 3 chars only match if ALL CAPS in original (acronym usage).
 */
function applyMilitaryJargon(
  text: string,
  dict: DictionaryCache,
  branch: string,
): ReplacementResult {
  const filtered = (dict.militaryJargon ?? []).filter(entry => {
    const term = (entry.military_term ?? '').trim();
    const termLower = term.toLowerCase();
    // Skip common English words
    if (JARGON_SKIP_LIST.has(termLower)) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const aMatch = branchMatches(a.branch, branch) ? 1 : 0;
    const bMatch = branchMatches(b.branch, branch) ? 1 : 0;
    if (aMatch !== bMatch) return bMatch - aMatch;
    return (b.military_term ?? '').length - (a.military_term ?? '').length;
  });

  // For short single-word entries (≤3 chars), only match if ALL CAPS in text
  const replacements: DictReplacement[] = [];
  let result = text;
  let replacedChars = 0;
  const alreadyReplaced = new Set<string>();

  for (const entry of sorted) {
    const search = entry.military_term ?? '';
    const replace = entry.civilian_equivalent ?? '';
    if (!search || !replace) continue;

    const searchLower = search.toLowerCase();
    if (alreadyReplaced.has(searchLower)) continue;

    if (entry.branch && branch && !branchMatches(entry.branch, branch)) continue;

    // Clean up slashed alternatives: "all employees / full staff" → "all employees"
    let cleanReplace = replace;
    if (cleanReplace.includes(' / ')) {
      cleanReplace = cleanReplace.split(' / ')[0].trim();
    }

    const isSingleWord = !search.includes(' ');
    const isShort = search.length <= 3;

    // Short single words: only match ALL CAPS (they're acronyms like NCO, LPO)
    if (isSingleWord && isShort) {
      const escaped = escapeRegex(search.toUpperCase());
      const regex = new RegExp(`\\b${escaped}\\b`, 'g'); // Case-sensitive for short terms
      const match = result.match(regex);
      if (match) {
        result = result.replace(regex, cleanReplace);
        replacedChars += match.reduce((sum, m) => sum + m.length, 0);
        alreadyReplaced.add(searchLower);
        replacements.push({ original: match[0], replacement: cleanReplace, source: 'jargon' });
      }
    } else {
      // Longer terms: case-insensitive whole-word match
      const escaped = escapeRegex(search);
      const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
      const match = result.match(regex);
      if (match) {
        result = result.replace(regex, cleanReplace);
        replacedChars += match.reduce((sum, m) => sum + m.length, 0);
        alreadyReplaced.add(searchLower);
        replacements.push({ original: match[0], replacement: cleanReplace, source: 'jargon' });
      }
    }
  }

  return { text: result, replacements, replacedChars };
}

/**
 * Apply dict_acronyms — fallback for acronyms NOT in hardcoded ACRONYM_TO_CIVILIAN map.
 * Uses civilian_explanation (description) field ONLY — never raw military expansion.
 * If only full_term (military expansion) exists, skip and log via logMissingTerm().
 */
function applyAcronyms(
  text: string,
  dict: DictionaryCache,
  branch: string,
): ReplacementResult {
  const replacements: DictReplacement[] = [];
  let result = text;
  let replacedChars = 0;
  const alreadyReplaced = new Set<string>();

  // Sort longest first (multi-word acronyms like "TS/SCI" before "TS")
  const sorted = [...(dict.acronyms ?? [])].sort((a, b) =>
    (b.acronym ?? '').length - (a.acronym ?? '').length,
  );

  for (const entry of sorted) {
    if (!entry.acronym) continue;
    const acronymLower = entry.acronym.toLowerCase();
    if (alreadyReplaced.has(acronymLower)) continue;

    // Skip if already handled by hardcoded ACRONYM_TO_CIVILIAN map
    if (_acronymLookup.has(acronymLower)) continue;

    // Branch filter: if entry is branch-specific, only use for matching branch
    if (entry.branch && branch && !branchMatches(entry.branch, branch)) continue;

    // Use civilian_explanation (description) ONLY — never raw military expansion
    const description = (entry.civilian_explanation ?? '').trim();
    if (!description) {
      // Only military expansion exists — skip and log
      const escaped = escapeRegex(entry.acronym);
      const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
      if (regex.test(result)) {
        logMissingTerm(
          entry.acronym,
          `dict_acronyms entry has no civilian_explanation: ${entry.full_term || 'N/A'}`,
          branch,
        ).catch(() => {});
      }
      continue;
    }

    let replacement = description;
    if (replacement.includes(' / ')) {
      replacement = replacement.split(' / ')[0].trim();
    }

    const escaped = escapeRegex(entry.acronym);
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    const match = result.match(regex);
    if (match) {
      result = result.replace(regex, replacement);
      replacedChars += match[0].length;
      alreadyReplaced.add(acronymLower);
      replacements.push({
        original: match[0],
        replacement,
        source: 'acronym',
      });
    }
  }

  return { text: result, replacements, replacedChars };
}

// ============================================================================
// Already-Civilian Detection
// ============================================================================

/**
 * Detect if a bullet is already civilian-ready after translation.
 *
 * Criteria:
 * - Less than 5% of characters changed AND all changes are single-word swaps
 * - 90%+ of the text is civilian English (few military terms detected)
 * - Translated text is 15%+ longer than original with <10% of words changed → prefer original
 */
function detectAlreadyCivilian(
  original: string,
  translated: string,
  replacements: DictReplacement[],
  coverage: number,
): { alreadyCivilian: boolean; alreadyCivilianMessage?: string } {
  const origLen = original.trim().length;
  const transLen = translated.trim().length;
  if (origLen === 0) return { alreadyCivilian: false };

  // Calculate character-level change significance
  let charsChanged = 0;
  for (const rep of replacements) {
    charsChanged += Math.max(rep.original.length, rep.replacement.length);
  }
  const changePercent = (charsChanged / origLen) * 100;

  // Count word-level changes
  const origWords = original.trim().split(/\s+/);
  const transWords = translated.trim().split(/\s+/);
  const wordCount = Math.max(origWords.length, transWords.length);
  const wordsChanged = replacements.length;
  const wordChangePercent = wordCount > 0 ? (wordsChanged / wordCount) * 100 : 0;

  // Check if all replacements are single-word swaps
  const allSingleWordSwaps = replacements.every(
    r => !r.original.includes(' ') && !r.replacement.includes(' '),
  );

  // Criterion 1: <5% chars changed AND only single-word swaps
  if (changePercent < 5 && allSingleWordSwaps) {
    return {
      alreadyCivilian: true,
      alreadyCivilianMessage: 'Already civilian-ready — no translation needed',
    };
  }

  // Criterion 2: No replacements at all AND coverage is 0
  if (replacements.length === 0 && coverage === 0) {
    return {
      alreadyCivilian: true,
      alreadyCivilianMessage: 'Already civilian-ready — no military terms detected',
    };
  }

  // Criterion 3: Translation 15%+ longer with low word change (<10%)
  const lengthIncrease = transLen > origLen
    ? ((transLen - origLen) / origLen) * 100
    : 0;
  if (lengthIncrease >= 15 && wordChangePercent < 10) {
    return {
      alreadyCivilian: true,
      alreadyCivilianMessage: 'Already civilian-ready — changes would add unnecessary length',
    };
  }

  return { alreadyCivilian: false };
}

// ============================================================================
// Vague Phrase Detection
// ============================================================================

/**
 * Scan translated text for vague phrases and suggest quantified alternatives.
 */
function findVaguePhrases(text: string, dict: DictionaryCache): VagueFlag[] {
  const flags: VagueFlag[] = [];
  const textLower = text.toLowerCase();

  for (const entry of (dict.quantificationHelpers ?? [])) {
    if (!entry.vague_phrase) continue;
    const phraseLower = entry.vague_phrase.toLowerCase();

    if (textLower.includes(phraseLower)) {
      flags.push({
        phrase: entry.vague_phrase,
        alternatives: entry.quantified_alternatives ?? [],
      });
    }
  }

  return flags;
}

// ============================================================================
// Action Verb Suggestions
// ============================================================================

/** Common weak verbs that should be replaced with stronger alternatives */
const WEAK_VERBS = new Set([
  'helped', 'assisted', 'worked', 'did', 'made', 'got', 'was',
  'responsible for', 'participated in', 'involved in', 'tasked with',
  'handled', 'dealt with', 'used', 'utilized',
]);

/**
 * Suggest stronger action verbs from the dictionary.
 * Detects weak verbs at the start of bullets and suggests replacements.
 */
function suggestActionVerbs(text: string, dict: DictionaryCache): VerbSuggestion[] {
  const suggestions: VerbSuggestion[] = [];
  const textLower = text.toLowerCase().trim();

  // Check if bullet starts with a weak verb
  for (const weak of WEAK_VERBS) {
    if (textLower.startsWith(weak)) {
      // Find strong replacement verbs from dictionary
      const strongVerbs = (dict.actionVerbs ?? [])
        .filter(v => v.strength === 'strong' || v.strength === 'power')
        .slice(0, 3);

      for (const verb of strongVerbs) {
        suggestions.push({
          current: weak,
          suggested: verb.verb,
          strength: verb.strength,
          category: verb.category,
        });
      }
      break; // Only flag the first weak verb
    }
  }

  return suggestions;
}

// ============================================================================
// Military Content Detection (Readability Check)
// ============================================================================

/** Military rank abbreviations — unambiguously military when appearing as standalone words */
const RANK_ABBREVIATIONS = new Set([
  // Army / Marine enlisted
  'pvt', 'pv2', 'pfc', 'spc', 'cpl', 'sgt', 'ssg', 'ssgt', 'sfc', 'msg',
  '1sg', 'sgm', 'csm', 'gysgt', 'lcpl',
  // Army / Marine officer
  '2lt', '1lt', 'cpt', 'maj', 'ltc', 'col', 'bg', 'mg', 'ltg', 'gen',
  // Navy / Coast Guard enlisted
  'po3', 'po2', 'po1', 'cpo', 'scpo', 'mcpo',
  // Navy / Coast Guard officer
  'ens', 'ltjg', 'lcdr', 'cdr', 'capt', 'rdml', 'radm', 'vadm', 'adm',
  // Air Force / Space Force enlisted
  'tsgt', 'msgt', 'smsgt', 'cmsgt', 'cmsaf',
  // Warrant officer
  'wo1', 'cw2', 'cw3', 'cw4', 'cw5',
]);

/** Pay grade patterns: E-1 through E-9, O-1 through O-10, W-1 through W-5 */
const PAYGRADE_PATTERN = /^[EOW]-[1-9]0?$/;

/**
 * Check whether text still contains recognizable military content that the
 * dictionary did NOT handle. Cross-references:
 *   - dict_acronyms: ALL-CAPS words present in the acronym table
 *   - Rank abbreviations and pay grade patterns (E-1 through O-10)
 *   - Multi-word military phrases from jargon, phrase, and eval tables
 *
 * Single-word jargon is intentionally NOT checked — too many dual-use words
 * (mission, operations, section) that are valid civilian English.
 *
 * @returns true if untranslated military content remains (needs AI)
 * @returns false if remaining text is civilian-readable (dictionary sufficient)
 */
function hasRemainingMilitaryContent(
  text: string,
  dict: DictionaryCache,
): boolean {
  // Build acronym lookup from cached dictionary
  const acronymSet = new Set<string>();
  for (const e of (dict.acronyms ?? [])) {
    const a = (e.acronym ?? '').toLowerCase().trim();
    if (a.length >= 2) acronymSet.add(a);
  }

  // Tokenize — split on whitespace and punctuation
  const words = text
    .split(/[\s,;:!?.()[\]{}"\/]+/)
    .map(w => w.trim())
    .filter(w => w.length >= 2);

  for (const word of words) {
    const lower = word.toLowerCase();

    // Skip known civilian words
    if (COMMON_ENGLISH.has(lower) || JARGON_SKIP_LIST.has(lower)) continue;

    // Pay grade pattern: E-4, O-3, W-2, etc.
    if (PAYGRADE_PATTERN.test(word)) return true;

    // Rank abbreviations: SGT, CPL, PO1, etc.
    // Only match ALL-CAPS or digit-prefixed (1SG, 2LT) to avoid false positives
    if (/^[A-Z0-9]{2,6}$/.test(word) && RANK_ABBREVIATIONS.has(lower)) return true;

    // Military acronyms from dict_acronyms (ALL-CAPS words like SNCOIC, LOGPAC, OPORD)
    if (/^[A-Z][A-Z0-9\/]{1,}$/.test(word) && acronymSet.has(lower)) return true;
  }

  // Check multi-word military phrases still present in the text.
  // Single-word jargon is skipped (too ambiguous), but multi-word phrases
  // like "fire watch", "battle space", "duty station" are reliably military.
  const textLower = text.toLowerCase();

  for (const entry of (dict.militaryJargon ?? [])) {
    const term = (entry.military_term ?? '').toLowerCase().trim();
    if (term.includes(' ') && term.length >= 5) {
      if (textLower.includes(term)) return true;
    }
  }

  for (const entry of (dict.phraseTranslations ?? [])) {
    const phrase = (entry.military_phrase ?? '').toLowerCase().trim();
    if (phrase.length >= 5 && textLower.includes(phrase)) return true;
  }

  for (const entry of (dict.evalPhrases ?? [])) {
    const phrase = (entry.eval_phrase ?? '').toLowerCase().trim();
    if (phrase.length >= 5 && textLower.includes(phrase)) return true;
  }

  return false;
}

// ============================================================================
// Unmatched Phrase Extraction
// ============================================================================

/** Common English words that should NOT be flagged as missing military terms */
const COMMON_ENGLISH = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her',
  'was', 'one', 'our', 'out', 'has', 'his', 'how', 'its', 'may', 'new',
  'now', 'old', 'see', 'way', 'who', 'did', 'get', 'got', 'had', 'him',
  'let', 'say', 'she', 'too', 'use', 'with', 'this', 'that', 'from',
  'they', 'been', 'have', 'many', 'some', 'them', 'than', 'each', 'make',
  'like', 'long', 'look', 'just', 'over', 'such', 'take', 'year', 'also',
  'back', 'come', 'made', 'find', 'here', 'know', 'last', 'most', 'only',
  'then', 'time', 'very', 'when', 'what', 'your', 'more', 'will', 'would',
  'about', 'could', 'other', 'their', 'there', 'which', 'these', 'first',
  'after', 'every', 'being', 'those', 'where', 'while', 'should', 'through',
  'during', 'before', 'between', 'under', 'above', 'below', 'within',
  'without', 'against', 'across', 'along', 'around', 'behind', 'beyond',
  'work', 'worked', 'working', 'team', 'teams', 'staff', 'support', 'supported',
  'manage', 'managed', 'managing', 'provide', 'provided', 'providing',
  'ensure', 'ensured', 'ensuring', 'maintain', 'maintained', 'maintaining',
  'perform', 'performed', 'performing', 'conduct', 'conducted', 'conducting',
  'develop', 'developed', 'developing', 'train', 'trained', 'training',
  'complete', 'completed', 'completing', 'assist', 'assisted', 'assisting',
  'responsible', 'daily', 'multiple', 'various', 'including', 'personnel',
  'environment', 'level', 'high', 'process', 'system', 'report', 'reports',
  'information', 'data', 'plan', 'plans', 'lead', 'leading',
  // Resume action verbs and common bullet words
  'mentor', 'mentored', 'mentoring', 'coordinate', 'coordinated', 'coordinating',
  'oversee', 'oversaw', 'oversight', 'implement', 'implemented', 'implementing',
  'establish', 'established', 'establishing', 'organize', 'organized', 'organizing',
  'direct', 'directed', 'directing', 'supervise', 'supervised', 'supervising',
  'create', 'created', 'creating', 'achieve', 'achieved', 'achieving',
  'improve', 'improved', 'improving', 'increase', 'increased', 'increasing',
  'reduce', 'reduced', 'reducing', 'exceed', 'exceeded', 'exceeding',
  'deliver', 'delivered', 'delivering', 'execute', 'executed', 'executing',
  'facilitate', 'facilitated', 'facilitating', 'analyze', 'analyzed', 'analyzing',
  'evaluate', 'evaluated', 'evaluating', 'monitor', 'monitored', 'monitoring',
  'prepare', 'prepared', 'preparing', 'review', 'reviewed', 'reviewing',
  'resolve', 'resolved', 'resolving', 'identify', 'identified', 'identifying',
  'streamline', 'streamlined', 'streamlining', 'optimize', 'optimized', 'optimizing',
  // Common nouns in resume bullets
  'preparation', 'entry', 'service', 'program', 'programs', 'project', 'projects',
  'budget', 'budgets', 'schedule', 'schedules', 'policy', 'policies',
  'procedure', 'procedures', 'standard', 'standards', 'requirement', 'requirements',
  'goal', 'goals', 'objective', 'objectives', 'target', 'targets',
  'result', 'results', 'outcome', 'outcomes', 'performance', 'quality',
  'safety', 'compliance', 'efficiency', 'effectiveness', 'productivity',
  'customer', 'client', 'member', 'members', 'employee', 'employees',
  'organization', 'department', 'division', 'group', 'unit', 'area',
  'event', 'events', 'activity', 'activities', 'initiative', 'initiatives',
  'operation', 'operations', 'task', 'tasks', 'duty', 'duties',
  'mission', 'success', 'rate', 'percent', 'average', 'annual', 'quarterly',
  'weekly', 'monthly', 'year', 'years', 'day', 'days', 'hour', 'hours',
  'across', 'ensuring', 'resulting', 'utilizing', 'leveraging', 'spearheading',
  'future', 'into', 'over', 'total', 'full', 'new', 'key', 'senior',
  'junior', 'cross', 'functional', 'critical', 'strategic', 'technical',
]);

/** Generic action verbs that are NOT military-specific — filter from missing terms */
const GENERIC_ACTION_VERBS = new Set([
  'led', 'managed', 'achieved', 'coordinated', 'maintained', 'oversaw',
  'supervised', 'directed', 'organized', 'implemented', 'established',
  'developed', 'created', 'improved', 'increased', 'reduced', 'exceeded',
  'delivered', 'executed', 'facilitated', 'analyzed', 'evaluated',
  'monitored', 'prepared', 'reviewed', 'resolved', 'identified',
  'streamlined', 'optimized', 'spearheaded', 'pioneered', 'orchestrated',
  'championed', 'leveraged', 'instituted', 'initiated', 'drove',
  'handled', 'processed', 'administered', 'planned', 'scheduled',
  'tracked', 'documented', 'reported', 'trained', 'mentored',
  'collaborated', 'communicated', 'presented', 'negotiated', 'influenced',
]);

/** Common civilian English phrases that should never be flagged as missing military terms */
const CIVILIAN_PHRASE_FRAGMENTS = new Set([
  'pieces of', 'across entire', 'first-time', 'ship-wide', 'fleet-wide',
  'base-wide', 'command-wide', 'company-wide', 'battalion-wide',
  'zero defects', 'zero discrepancies', 'on time', 'ahead of schedule',
  'under budget', 'per year', 'per month', 'per day', 'resulting in',
  'contributing to', 'responsible for', 'in support of', 'in charge of',
]);

/**
 * Check if a phrase looks like it contains a genuine military pattern:
 * - ALL-CAPS acronyms (2+ chars)
 * - Known military prefix/suffix patterns
 * - Terms present in the hardcoded ACRONYM_TO_CIVILIAN map
 */
function hasMilitaryPattern(phrase: string): boolean {
  const words = phrase.split(/\s+/);
  for (const word of words) {
    // ALL-CAPS word with 2+ chars (likely acronym)
    if (/^[A-Z][A-Z0-9\/\-]{1,}$/.test(word)) return true;
    // Matches a hardcoded military acronym
    if (_acronymLookup.has(word.toLowerCase())) return true;
    // Pay grade pattern (E-4, O-3, W-2)
    if (PAYGRADE_PATTERN.test(word)) return true;
    // Rank abbreviation in ALL-CAPS
    if (/^[A-Z0-9]{2,6}$/.test(word) && RANK_ABBREVIATIONS.has(word.toLowerCase())) return true;
  }
  return false;
}

/**
 * Check if a phrase is primarily numeric content (numbers, number-heavy fragments).
 * Examples: "98", "000+", "ship-wide 98", "1K+", "15 20"
 */
function isPrimarilyNumeric(phrase: string): boolean {
  // Remove common number-adjacent tokens
  const stripped = phrase.replace(/[\d,.$%+K+M+B+k+m+b]+/g, '').trim();
  // If removing numbers leaves less than 40% of the phrase, it's number-heavy
  if (stripped.length < phrase.length * 0.4) return true;
  // Check if the whole phrase is just a number or number with suffix
  if (/^\d[\d,.\-+KkMmBb%$/]*$/.test(phrase.trim())) return true;
  return false;
}

/**
 * Extract phrases from the original text that were NOT matched by any dictionary layer.
 * Only surfaces genuine military terminology — filters out number fragments, generic verbs,
 * and common civilian English to reduce false positives.
 */
function extractUnmatchedPhrases(
  originalText: string,
  replacements: DictReplacement[],
): string[] {
  let remaining = originalText;

  // Remove all matched original terms
  for (const rep of replacements) {
    const escaped = escapeRegex(rep.original);
    remaining = remaining.replace(new RegExp(escaped, 'gi'), ' ||| ');
  }

  // Split on delimiters and replacement markers
  const segments = remaining
    .split(/\|\|\||[,;:!?.()[\]{}"\/]+/)
    .map(s => s.trim())
    .filter(s => s.length >= 3);

  const phrases: string[] = [];

  for (const segment of segments) {
    const words = segment.split(/\s+/).filter(w => w.length >= 2);
    const significant = words.filter(w => {
      const lower = w.toLowerCase();
      // Filter out common English
      if (COMMON_ENGLISH.has(lower)) return false;
      if (JARGON_SKIP_LIST.has(lower)) return false;
      // Filter out generic action verbs
      if (GENERIC_ACTION_VERBS.has(lower)) return false;
      // Filter out pure numbers / number-heavy tokens
      if (/^\d[\d,.\-+%$KkMmBb]*$/.test(w)) return false;
      // Filter out number-prefixed fragments like "000+", "1K+"
      if (/^\d/.test(w) && w.length <= 5) return false;
      return true;
    });
    if (significant.length === 0) continue;

    // Build the phrase (up to 4 significant words)
    const phrase = significant.slice(0, 4).join(' ').trim();
    if (phrase.length < 3) continue;

    // Filter: skip if the phrase is primarily numeric
    if (isPrimarilyNumeric(phrase)) continue;

    // Filter: skip civilian phrase fragments
    const phraseLower = phrase.toLowerCase();
    let isCivilian = false;
    for (const frag of CIVILIAN_PHRASE_FRAGMENTS) {
      if (phraseLower.includes(frag) || frag.includes(phraseLower)) {
        isCivilian = true;
        break;
      }
    }
    if (isCivilian) continue;

    // Filter: only keep if phrase contains a military pattern (acronym, rank, etc.)
    // OR has at least 2 significant words (multi-word military terms)
    if (!hasMilitaryPattern(phrase) && significant.length < 2) continue;

    // Final check: if it's a single word, it must look military (acronym pattern or known)
    if (significant.length === 1) {
      const word = significant[0];
      const hasAcronymShape = /^[A-Z][A-Z0-9\/\-]{1,}$/.test(word);
      const isKnownMilitary = _acronymLookup.has(word.toLowerCase())
        || RANK_ABBREVIATIONS.has(word.toLowerCase());
      if (!hasAcronymShape && !isKnownMilitary) continue;
    }

    phrases.push(phrase);
  }

  // Deduplicate and cap at 5
  return [...new Set(phrases)].slice(0, 5);
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generic replacement engine: applies dictionary entries to text.
 * Uses word-boundary regex for whole-word matching, case-insensitive.
 * Tracks which portions of text have been replaced to avoid double-replacement.
 */
function applyReplacements<T>(
  text: string,
  entries: T[],
  source: DictReplacement['source'],
  getFields: (entry: T) => { search: string; replace: string; branchFilter: string | null },
  branch: string,
): ReplacementResult {
  const replacements: DictReplacement[] = [];
  let result = text;
  let replacedChars = 0;
  const alreadyReplaced = new Set<string>();

  for (const entry of entries) {
    const { search, replace, branchFilter } = getFields(entry);
    if (!search || !replace) continue;

    // Skip if already replaced this phrase
    const searchLower = search.toLowerCase();
    if (alreadyReplaced.has(searchLower)) continue;

    // Branch filter: branch-specific entries only match their branch
    if (branchFilter && branch && !branchMatches(branchFilter, branch)) continue;

    const escaped = escapeRegex(search);
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    const match = result.match(regex);
    if (match) {
      // Clean up slashed alternatives: "team member / employee" → "team member"
      let cleanReplace = replace;
      if (cleanReplace.includes(' / ')) {
        cleanReplace = cleanReplace.split(' / ')[0].trim();
      }
      result = result.replace(regex, cleanReplace);
      replacedChars += match.reduce((sum, m) => sum + m.length, 0);
      alreadyReplaced.add(searchLower);
      replacements.push({
        original: match[0],
        replacement: cleanReplace,
        source,
      });
    }
  }

  return { text: result, replacements, replacedChars };
}

/** Check if a dictionary entry's branch matches the user's branch */
function branchMatches(entryBranch: string | null, userBranch: string): boolean {
  if (!entryBranch) return true; // null branch = applies to all
  if (!userBranch) return true; // no user branch = accept all
  return entryBranch.toLowerCase().includes(userBranch.toLowerCase())
    || userBranch.toLowerCase().includes(entryBranch.toLowerCase());
}

/** Escape special regex characters */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Clean up translated text: fix double spaces, trailing whitespace */
function cleanupText(text: string): string {
  return text
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,;:!?])/g, '$1')
    .trim();
}

// ============================================================================
// Job-Specific Keyword Injection
// ============================================================================

/** Common synonym groups: if the bullet contains a synonym, swap to the exact target keyword phrasing */
const KEYWORD_SYNONYMS: Record<string, string[]> = {
  'project management': ['project oversight', 'project coordination', 'project leadership', 'program management', 'managing projects'],
  'risk management': ['risk mitigation', 'risk assessment', 'risk analysis', 'threat assessment'],
  'data analysis': ['data analytics', 'data evaluation', 'data review', 'data examination', 'analyzing data'],
  'process improvement': ['process optimization', 'process enhancement', 'continuous improvement', 'workflow improvement', 'process refinement'],
  'stakeholder engagement': ['stakeholder management', 'stakeholder relations', 'stakeholder coordination', 'stakeholder communication'],
  'budget management': ['budget oversight', 'budget administration', 'financial management', 'fiscal management', 'budget coordination'],
  'team leadership': ['team management', 'team oversight', 'leading teams', 'team direction', 'team supervision'],
  'compliance': ['regulatory compliance', 'policy compliance', 'compliance management', 'compliance oversight'],
  'strategic planning': ['strategic development', 'strategic direction', 'long-range planning', 'strategic initiatives'],
  'quality assurance': ['quality control', 'quality management', 'qa', 'quality oversight'],
  'supply chain': ['supply chain management', 'logistics management', 'supply management'],
  'cybersecurity': ['information security', 'cyber security', 'network security', 'it security'],
  'agile': ['agile methodology', 'agile framework', 'scrum', 'agile development'],
  'incident response': ['incident management', 'emergency response', 'crisis response', 'crisis management'],
  'training': ['training and development', 'workforce development', 'professional development', 'employee training'],
  'communication': ['communications', 'written communication', 'verbal communication', 'technical communication'],
};

/**
 * Inject target keywords into translated bullet text via synonym matching.
 * Cap at 3 injections per bullet. Only replaces terms that are semantically close.
 */
function injectTargetKeywords(text: string, targetKeywords: string[]): string {
  let result = text;
  let injections = 0;
  const MAX_INJECTIONS = 3;

  for (const keyword of targetKeywords) {
    if (injections >= MAX_INJECTIONS) break;

    const kwLower = keyword.toLowerCase();

    // Skip if the exact keyword is already in the text
    if (result.toLowerCase().includes(kwLower)) continue;

    // Check if a synonym exists in the text that we can swap
    const synonymGroup = KEYWORD_SYNONYMS[kwLower];
    if (synonymGroup) {
      for (const synonym of synonymGroup) {
        const synRegex = new RegExp(`\\b${escapeRegex(synonym)}\\b`, 'gi');
        if (synRegex.test(result)) {
          result = result.replace(synRegex, keyword);
          injections++;
          break;
        }
      }
      continue;
    }

    // Reverse check: if the keyword itself is a known synonym of something in text
    for (const [canonical, synonyms] of Object.entries(KEYWORD_SYNONYMS)) {
      if (synonyms.some(s => s.toLowerCase() === kwLower)) {
        // The target keyword is a synonym — check if canonical form or other synonyms exist in text
        const canonicalRegex = new RegExp(`\\b${escapeRegex(canonical)}\\b`, 'gi');
        if (canonicalRegex.test(result)) {
          result = result.replace(canonicalRegex, keyword);
          injections++;
          break;
        }
        for (const otherSyn of synonyms) {
          if (otherSyn.toLowerCase() === kwLower) continue;
          const otherRegex = new RegExp(`\\b${escapeRegex(otherSyn)}\\b`, 'gi');
          if (otherRegex.test(result)) {
            result = result.replace(otherRegex, keyword);
            injections++;
            break;
          }
        }
        break;
      }
    }
  }

  return result;
}
