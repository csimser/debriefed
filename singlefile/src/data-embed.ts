/**
 * Embeds the bundled data directly into Debriefed.html.
 *
 * The data loader (src/lib/data/files.client.ts) checks
 * window.__DEBRIEFED_DATA__ before any fetch — on file:// there is nothing
 * to fetch from, so everything ships inline. Keys are the same file names
 * the PWA serves from /data/.
 */
import acronyms from '../../public-data/acronyms.json'
import action_verbs from '../../public-data/action_verbs.json'
import ats_keywords from '../../public-data/ats_keywords.json'
import bullet_patterns from '../../public-data/bullet_patterns.json'
import cert_funding from '../../public-data/cert_funding.json'
import cover_letter_templates from '../../public-data/cover_letter_templates.json'
import eval_phrases from '../../public-data/eval_phrases.json'
import funding_programs from '../../public-data/funding_programs.json'
import gap_recommendations from '../../public-data/gap_recommendations.json'
import industry_framing from '../../public-data/industry_framing.json'
import linkedin_keywords from '../../public-data/linkedin_keywords.json'
import linkedin_templates from '../../public-data/linkedin_templates.json'
import military_jargon from '../../public-data/military_jargon.json'
import mos_to_civilian from '../../public-data/mos_to_civilian.json'
import onet_crosswalk from '../../public-data/onet_crosswalk.json'
import phrase_translations from '../../public-data/phrase_translations.json'
import professional_summaries from '../../public-data/professional_summaries.json'
import quantification_helpers from '../../public-data/quantification_helpers.json'
import rank_equivalents from '../../public-data/rank_equivalents.json'
import resume_templates from '../../public-data/resume_templates.json'
import soft_skills from '../../public-data/soft_skills.json'
import onetOccupations from '../../public-data/onet-occupations.json'
import manifest from '../../public-data/manifest.json'

window.__DEBRIEFED_DATA__ = {
  'acronyms.json': acronyms,
  'action_verbs.json': action_verbs,
  'ats_keywords.json': ats_keywords,
  'bullet_patterns.json': bullet_patterns,
  'cert_funding.json': cert_funding,
  'cover_letter_templates.json': cover_letter_templates,
  'eval_phrases.json': eval_phrases,
  'funding_programs.json': funding_programs,
  'gap_recommendations.json': gap_recommendations,
  'industry_framing.json': industry_framing,
  'linkedin_keywords.json': linkedin_keywords,
  'linkedin_templates.json': linkedin_templates,
  'military_jargon.json': military_jargon,
  'mos_to_civilian.json': mos_to_civilian,
  'onet_crosswalk.json': onet_crosswalk,
  'phrase_translations.json': phrase_translations,
  'professional_summaries.json': professional_summaries,
  'quantification_helpers.json': quantification_helpers,
  'rank_equivalents.json': rank_equivalents,
  'resume_templates.json': resume_templates,
  'soft_skills.json': soft_skills,
  'onet-occupations.json': onetOccupations,
  'manifest.json': manifest,
}

export {}
