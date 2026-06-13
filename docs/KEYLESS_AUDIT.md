# Keyless Mode Audit — Task 0

State of the 13 AI features before the keyless-dictionary-mode work, audited 2026-06-12.
Question: which features already work without an Anthropic key, which hard-require Claude,
and what a dictionary fallback looks like for the rest.

## Headline finding

The dictionary engines (`bulletTranslator`, `evalParser`, `matchScorer`, `keywordExtractor`,
`templateFiller`, `outputPolisher`) are **all actively wired** into the UI already — none are
dead code. For most features the `hasApiKey()` gate is an artificial wall placed *in front of*
a working keyless path. The work is mostly gate removal + labeling, not engine building.

## Per-feature state

| # | Feature | AI entry point | Keyless path today | Verdict |
|---|---------|----------------|--------------------|---------|
| 1 | Bullet translation | `ExperienceSection.tsx:386`, `ResumeForm.tsx` | ✅ FULL — `translateBullet()` (bulletTranslator, 40% coverage threshold) already called; AI is fallback for low coverage | **Remove gate, label output** |
| 2 | Summary enhancement | `ProfessionalSummaryEditor.tsx` (×2) | ✅ FULL — `summaryTemplates.ts` + `populateTemplate()` (the StepFinish onboarding mechanism: detect experience type → pick template → fill with profile data, deterministic) | **Remove gate; AI becomes polish** |
| 3 | Resume text import | `ResumeImportModal.tsx:112` | 🟡 PARTIAL — `resume-parser.ts` `splitSections()` exists (regex section splitting) but isn't wired as a complete path | **Build: sections → rule-based field extraction → bulletTranslator on experience bullets** |
| 4 | Resume PDF import | same modal | ❌ NONE — PDF text extraction is Claude vision; `pdfjs-dist` was removed as unused | **Stays AI-only.** Keyless alternative: DOCX (mammoth, no AI) + paste-text both feed the rule-based importer |
| 5 | Eval parsing (text) | `EvalUploadModal.tsx:71` | ✅ FULL — `evalParser.parseAndTranslateEvalText(rawText, branch, rank)`: clean → parse blocks → strip praise → first-person → dictionary translate → STAR → quality gate | **Add a "paste eval text" input as the keyless path** |
| 6 | Eval parsing (PDF/image OCR) | same modal | ❌ NONE — OCR is Claude vision | **Stays AI-only**, message points at the paste-text path |
| 7 | LinkedIn PDF import | `LinkedInTool.tsx:527` | ❌ NONE — Claude vision | **Stays AI-only**; manual profile entry is the keyless route |
| 8 | Cover letter generate | `DictCoverLetterBuilder.tsx:404` | ✅ FULL — dual mode already shipped: `extractKeywords()` → template scoring → `fillTemplate()` → `polishCoverLetter()`. "🔷 Generate Cover Letter" vs "✨ Generate with AI" | **Relabel (template mode must not feel like a tease), de-modal** |
| 9 | Cover letter refine | same | ✅ template output editable manually; AI refine optional | **Gate refine buttons softly** |
| 10 | LinkedIn headline/about generate | `LinkedInTool.tsx:1415` | 🟡 PARTIAL — tone/length template state exists in the UI; final text still goes to Claude | **Build: rule-based fill from `linkedin_templates` + `mos_to_civilian` + profile (same pattern as summary templates)** |
| 11 | LinkedIn profile analyze | same | 🟡 PARTIAL — `calculateBaselineScores()` (content heuristics) already runs *before* the AI call inside `ai/linkedin.ts` | **Expose baseline scoring standalone as the keyless checklist analysis** |
| 12 | Job match analyze | `JobMatchWorkspace.tsx:521` | ✅ FULL — `keywordExtractor` + `matchScorer.calculateMatch()` produce overallScore, per-category breakdowns, gaps **with recommendations + funding sources**, exceeds, civilian-title matches. The AI adds narrative/strategy on top | **Remove gate from dictionary scoring; gate only the AI narrative** |
| 13 | Job match suggestions (bullet rewrites) | same | ❌ NONE for rewrites — but `MatchResult.gaps[]` already carries recommendations | **Keyless shows gap recommendations; AI rewrites stay key-gated** |

Plus the translation-engine polish layer (`outputPolisher`) — pure deterministic text transforms,
no AI dependency, already runs on every dictionary output.

## Hard-AI features (no sensible rule-based equivalent)

PDF/image **reading**: resume PDFs, eval OCR, LinkedIn PDFs (Claude vision). Constraint honored:
no local LLM. Each gets (a) a clearly-labeled keyless alternative input (DOCX/paste/manual) and
(b) a non-blocking "needs an API key" state on the file path — never a wall in front of the feature.

## Gate inventory to dismantle

`hasApiKey()` + blocking `KeySetupModal` in: ExperienceSection, ProfessionalSummaryEditor (×2),
ResumeImportModal, EvalUploadModal, LinkedInTool (×3), DictCoverLetterBuilder (×2),
JobMatchWorkspace, onboarding StepWelcome (already optional/skippable there).

## Existing dual-mode precedent to standardize on

`DictCoverLetterBuilder`: `isFree = !hasApiKey()`, template path labeled 🔷, AI path labeled ✨
with an "AI Mode" badge. This pattern (minus the modal-deferral) generalizes to every feature:
dictionary output labeled "Dictionary translation", AI path unlabeled/✨.

## Dictionary-first + AI polish (Task 2 fit)

Already structurally present in: `translateBullet`'s enhance mode (dictionary translation passed
to Claude as starting point), `translation-engine` (layer 1 dictionary → layer 2 polish),
`enhanceSummary` (dictionaryTranslate pre-pass). To extend: eval AI parsing should pass
`evalParser` output as context; job-match AI narrative should receive `matchScorer`'s result;
summary AI should receive the template baseline. Cover letter generation stays pure-Claude in AI
mode (per spec), with the template available as fallback.

## Misc

- `useOnlineStatus` / `navigator.onLine`: zero existing usage — greenfield.
- Onboarding already completes without a key (template-based summary in StepFinish); the only
  key mention is the optional StepWelcome modal, which Task 3 replaces.
