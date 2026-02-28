# Implementation Plan: Item 9 (Onboarding) + Item 18 (LinkedIn Merge)

---

## ITEM 9: Reduce Onboarding to 4 Steps

### Current State
- **7 steps**: Welcome → Contact → Military → Experience → Skills → Education → Summary
- `ProgressBar.tsx` defines `STEPS` array with 7 entries (ids 0–6)
- `NewOnboardingWizard.tsx` (406 lines) renders all 7 step components conditionally
- `onboarding_step` column on `profiles` stores values 0–6 (7 = completed)
- Step 3 (Experience) is 750 lines with eval upload, bullet extraction/editing
- Steps 4 (Skills), 5 (Education), 6 (Summary) add ~1,200 lines combined

### Target State
- **4 steps**: Welcome → Quick Profile → Experience (simplified) → Finish
- `onboarding_step` values become 0–3 (4 = completed)
- Drop-off-causing fields deferred to profile page post-onboarding

---

### Files to CREATE (2 new files)

#### 1. `src/components/onboarding-new/StepQuickProfile.tsx` (~250 lines)

**What it contains:**
- Merges fields from StepContact.tsx + StepMilitary.tsx into one scrollable form
- Three visual sections with gold section headers:
  - **Basic Info**: phone (InternationalPhoneInput), city (text), state (US_STATES dropdown)
  - **Military Background**: branch (BRANCHES select), paygrade (PAYGRADES select), rank (auto-filled via getRankFromPaygrade, read-only when branch+paygrade set), rating_mos (text with crosswalk fetch), clearance (CLEARANCE_LEVELS select)
  - **Career Target**: target_role (text with suggested titles from crosswalk)
- **Kept from StepMilitary**: MOS crosswalk fetch (debounced 500ms), auto-rank derivation, suggested_titles/suggested_skills/suggested_certs population
- **Removed (deferred to profile page)**: linkedin_url, eas_date, years_of_service, target_industry, job_search_timeline

**Props**: Same pattern as other steps: `{ data, updateData, onNext, onBack, onSkip, saving }`

**Imports**:
- `Button` from ui
- `InternationalPhoneInput` from ui (from StepContact)
- `US_STATES` from constants
- `BRANCHES, PAYGRADES, getRankFromPaygrade` from military constants
- `CLEARANCE_LEVELS` from federalEligibility constants
- `OnboardingData` from NewOnboardingWizard

#### 2. `src/components/onboarding-new/StepFinish.tsx` (~200 lines)

**What it contains:**
- Auto-generates a professional summary on mount using best-match template from `summaryTemplates.ts`
  - Uses `buildProfileDataFromForm()` from populateTemplate.ts to build ProfileData
  - Finds best template by matching experiences (leadership → operations → general fallback)
  - Fills via `populateTemplate()` + `cleanTemplateOutput()`
  - Saves generated summary to profile via supabase update on mount
- Shows profile completeness percentage (5 checks: name, phone/city, branch/paygrade, experience count, target_role)
- Shows checkmark summary of what was set up
- Primary CTA: "Build My First Resume" → `/resumes?new=true`
- Auto-redirect countdown: 5 seconds, redirects to `/resumes?new=true`
- "Or go to dashboard" secondary link

**Props**: `{ data, updateData, onComplete, onBack, onSkip, saving, userId, supabase }`

**Imports**:
- `useState, useEffect, useCallback` from react
- `useRouter` from next/navigation
- `Button` from ui, `Card` from ui
- `SUMMARY_TEMPLATES, getTemplatesByCategory` from summaryTemplates
- `populateTemplate, cleanTemplateOutput, buildProfileDataFromForm` from populateTemplate
- `OnboardingData` from NewOnboardingWizard

---

### Files to MODIFY (3 files)

#### 3. `src/components/onboarding-new/ProgressBar.tsx`

**Changes:**
- Replace 7-entry `STEPS` array with 4 entries:
  ```ts
  { id: 0, name: 'Welcome',       shortName: 'Welcome' },
  { id: 1, name: 'Quick Profile',  shortName: 'Profile' },
  { id: 2, name: 'Experience',     shortName: 'Experience' },
  { id: 3, name: 'Finish',         shortName: 'Finish' },
  ```
- No structural changes to the rendering logic (it already iterates STEPS dynamically)

#### 4. `src/components/onboarding-new/NewOnboardingWizard.tsx`

**Imports — remove:**
```
- StepContact
- StepMilitary
- StepSkills
- StepEducation
- StepSummary
```

**Imports — add:**
```
+ StepQuickProfile
+ StepFinish
```

**Legacy step mapping (line ~63):**
- Current: `const mappedStep = Math.min(currentStep, STEPS.length - 1)`
- Change to explicit mapping for legacy users:
  ```ts
  function mapLegacyStep(dbStep: number): number {
    // Old 7-step → new 4-step mapping
    // 0 (Welcome) → 0
    // 1 (Contact) → 1 (Quick Profile)
    // 2 (Military) → 1 (Quick Profile)
    // 3 (Experience) → 2 (Experience)
    // 4 (Skills) → 3 (Finish)
    // 5 (Education) → 3 (Finish)
    // 6 (Summary) → 3 (Finish)
    // 7+ (completed) → stays as-is, handled by onboarding_completed check
    if (dbStep <= 0) return 0
    if (dbStep <= 2) return 1
    if (dbStep === 3) return 2
    return 3 // 4, 5, 6 all map to Finish
  }
  const mappedStep = mapLegacyStep(currentStep)
  ```

**Step rendering (lines ~377-405):**
- Replace 7-step conditional with 4 steps:
  ```tsx
  step === 0 → <StepWelcome ... />
  step === 1 → <StepQuickProfile ... />
  step === 2 → <StepExperience ... />  (simplified version)
  step === 3 → <StepFinish ... />
  ```

**`handleComplete` callback:**
- Remove the `showCelebration` flow — StepFinish handles this internally
- `handleComplete` just saves final data + `onboarding_completed: true` + redirects

**`saveProgress` payload:**
- Keep all profile fields in the save payload (they still exist in OnboardingData, just some are no longer collected during onboarding — they keep their existing DB values)

**`jumpToStep` (for resume import in StepWelcome):**
- Currently jumps to step 3 (Experience) after import. Change to jump to step 2 (new Experience step index)

**Celebration screen (lines 323-373):**
- Remove entirely — StepFinish replaces this functionality

#### 5. `src/components/onboarding-new/StepExperience.tsx`

**What to KEEP (~200 lines):**
- Experience list view showing saved experiences (job title, org, dates)
- Add/Edit form with: employment_type toggle, job_title, organization, start_date, end_date, is_current checkbox
- CivilianTitleSuggestions component (shows when military + job_title has 2+ chars)
- Civilian Title input (shown for military experiences)
- Save/Update/Delete operations against `experience` table
- Toast and ConfirmModal for feedback
- Navigation buttons (Back, Continue, Skip)
- Multiple experiences support

**What to REMOVE (~500 lines):**
- All eval upload UI: `evalType` state, eval type selector grid (7 types), file input, upload button
- `handleEvalUpload` function and its `/api/parse-eval` fetch call
- `extractedBullets` state and all bullet rendering (accepted/excluded toggle, translated text display)
- `uploadingEval` state, `fileInputRef`, `showEvalUploadForExp` state
- `EvalUploadModal` import and its rendering
- Bullet count display and bullet preview in the experience list cards
- Location fields (city, state) — defer to resume builder
- The `onBulletsSaved` callback wiring

**Lines removed**: Approximately lines 244-302 (handleEvalUpload), 562-650 (eval upload UI section), 699-747 (EvalUploadModal rendering), plus bullet-related state declarations and the bullet display sections in the list view. Net removal ~500 lines.

---

### Files NOT modified (kept as-is, removed from wizard only)

These files remain in `src/components/onboarding-new/` for potential use elsewhere (profile page, etc.) but are no longer imported by `NewOnboardingWizard.tsx`:

- `StepContact.tsx` (167 lines) — no longer rendered in wizard
- `StepMilitary.tsx` (267 lines) — no longer rendered in wizard
- `StepSkills.tsx` (454 lines) — no longer rendered in wizard
- `StepEducation.tsx` (390 lines) — no longer rendered in wizard
- `StepSummary.tsx` (388 lines) — no longer rendered in wizard

---

### Migration Logic for Existing Users

**Problem**: Users with `onboarding_step` values 0–6 in the DB need to land on the correct new step.

**Solution**: The `mapLegacyStep()` function in NewOnboardingWizard.tsx handles this at runtime. No DB migration needed.

| Old DB value | Old step name | New mapped value | New step name |
|---|---|---|---|
| 0 | Welcome | 0 | Welcome |
| 1 | Contact | 1 | Quick Profile |
| 2 | Military | 1 | Quick Profile |
| 3 | Experience | 2 | Experience |
| 4 | Skills | 3 | Finish |
| 5 | Education | 3 | Finish |
| 6 | Summary | 3 | Finish |
| 7 (completed) | n/a | Redirect to dashboard (existing logic) | n/a |

**Risk**: A user at old step 2 (Military, where they filled branch/paygrade) now lands on step 1 (Quick Profile). They'll see their data pre-populated, hit Continue. No data loss.

**Risk**: A user at old step 4/5/6 now lands on step 3 (Finish). They've already filled experience, skills, education — the Finish screen shows their completeness and lets them proceed. No data loss.

**Admin API** (`src/app/api/admin/users/[id]/route.ts`): Reads `onboarding_step` for conversion-blocker analysis. The mapping logic is only in the wizard — admin sees the raw DB value. This is fine for admin diagnostics.

**Auth callback** (`src/app/api/auth/callback/route.ts`): Sets `onboarding_step: 0` for new users. This still works correctly — step 0 maps to step 0 (Welcome).

---

### Risks (Item 9)

1. **Resume import in StepWelcome**: Currently calls `jumpToStep(3)` which was old Experience step. Need to update to `jumpToStep(2)` (new Experience step). If missed, user skips to Finish instead of Experience.

2. **OnboardingData interface**: Still includes all fields (linkedin_url, years_of_service, eas_date, etc.). These fields keep their existing values from DB — they're just not shown in the wizard anymore. No interface changes needed.

3. **saveProgress writes all fields**: The save payload includes `linkedin_url`, `years_of_service`, `eas_date` etc. Even though we don't collect them in onboarding anymore, they're still written back (preserving existing values or null). No issue.

4. **Profile completeness on dashboard**: The dashboard calculates completeness from `first_name, last_name, branch, rank, years_of_service, eas_date`. Since we no longer collect `years_of_service` or `eas_date` during onboarding, users will see <100% completeness on the dashboard. This is intentional — it nudges them to the profile page.

---

## ITEM 18: Merge Duplicate LinkedIn Components

### Current State
- `LinkedInTool.tsx` (1,959 lines): AI-powered LinkedIn optimizer with Generate + Analyze modes. Already imports utility functions from DictLinkedInTools.
- `DictLinkedInTools.tsx` (800 lines): Dictionary-based LinkedIn tools with 3 tabs (Headline Builder, Keyword Checker, Summary Templates). Exports 8 utility functions + the React component.
- **Critical finding**: The `DictLinkedInTools` **component** is dead code — it has zero imports anywhere in the codebase. Only its utility functions are imported (by LinkedInTool.tsx alone).
- `CareerToolsHub.tsx` only renders `LinkedInTool`, never `DictLinkedInTools`.

### Target State
- `LinkedInTool.tsx`: Adds inline headline editing + Keywords tab
- `DictLinkedInTools.tsx` → `linkedInUtils.ts`: Becomes a pure utility module (no React component)
- Single entry point for all LinkedIn features

---

### Files to MODIFY (3 files)

#### 1. `src/components/career-tools/DictLinkedInTools.tsx` → rename to `src/components/career-tools/linkedInUtils.ts`

**Keep (all utility exports, ~170 lines):**
- `getRankTier()` (line 31)
- `formatClearanceForHeadline()` (line 55)
- `ensureProperTitle()` (line 87)
- `titleCaseHeadline()` (line 103)
- `smartSkillSort()` (line 128)
- `LINKEDIN_FALLBACKS` constant (line 166)
- `buildLinkedInValues()` (line 187)
- `fillLinkedInTemplate()` (line 283)

**Remove (~630 lines):**
- All React imports (`useState, useEffect, useCallback`)
- UI component imports (`Card, Button, Badge`)
- `DictLinkedInToolsProps` interface
- The entire `DictLinkedInTools` function component (lines 316-800)
- `formatRankTier()` internal helper (only used by the component)
- Imports only needed by the component: `polishHeadline`, `polishSummary`, `personalizeStaticSummary`, and most dictionary types

**Keep imports (needed by utilities):**
- `type DictAtsKeyword` (used by smartSkillSort)
- Any types needed by the utility function signatures

**File structure after:**
```ts
// linkedInUtils.ts — Pure utility functions for LinkedIn content generation
import type { DictAtsKeyword } from '@/lib/dictionary/types'

export function getRankTier(...) { ... }
export function formatClearanceForHeadline(...) { ... }
export function ensureProperTitle(...) { ... }
export function titleCaseHeadline(...) { ... }
export function smartSkillSort(...) { ... }
export const LINKEDIN_FALLBACKS = { ... }
export function buildLinkedInValues(...) { ... }
export function fillLinkedInTemplate(...) { ... }
```

#### 2. `src/components/career-tools/LinkedInTool.tsx`

**Update import path:**
```diff
- import { getRankTier, formatClearanceForHeadline, buildLinkedInValues, fillLinkedInTemplate, ensureProperTitle, titleCaseHeadline, smartSkillSort } from './DictLinkedInTools'
+ import { getRankTier, formatClearanceForHeadline, buildLinkedInValues, fillLinkedInTemplate, ensureProperTitle, titleCaseHeadline, smartSkillSort } from './linkedInUtils'
```

**Add new imports (for Keywords tab):**
```ts
import { polishHeadline } from '@/lib/dictionary/outputPolisher'
import type { DictLinkedinKeyword, DictMilitaryJargon } from '@/lib/dictionary/types'
```

**Add state for new features (~15 lines):**
```ts
// Inline headline editing
const [editingHeadlineIdx, setEditingHeadlineIdx] = useState<number | null>(null)
const [editedHeadlineText, setEditedHeadlineText] = useState('')

// Keywords tab
const [keywordPasteText, setKeywordPasteText] = useState('')
const [keywordResults, setKeywordResults] = useState<{
  found: string[]; missing: string[]; jargonDetected: { term: string; replacement: string }[]; score: number; total: number
} | null>(null)

// Additional dictionary data for keywords
const [linkedinKeywords, setLinkedinKeywords] = useState<DictLinkedinKeyword[]>([])
const [jargonTerms, setJargonTerms] = useState<DictMilitaryJargon[]>([])
```

**Update dictionary load (existing useEffect at line ~134):**
- Add `linkedinKeywords` and `jargon` to the dictionary data load:
  ```ts
  setLinkedinKeywords(dict.linkedinKeywords ?? [])
  setJargonTerms(dict.jargon ?? [])
  ```

**Add inline headline editing to existing Headline Card section (~40 lines):**
- Each dictionary headline gets an Edit button
- When editing: show input field with Save (Enter) and Cancel (Escape) buttons
- On save: update the headline in `dictResults.headlines` array
- Port the inline editing pattern from DictLinkedInTools lines 420-470

**Add Keywords tab to Generate mode (~120 lines):**
- New sub-tab within Generate mode: "Generate" | "Keywords" | "Analyze Profile"
  - Actually, make it a mode alongside `generate` and `analyze`: add `'keywords'` to mode type
- Keywords tab UI (ported from DictLinkedInTools lines 500-590):
  - Textarea: "Paste your LinkedIn About section or a job posting"
  - "Analyze Keywords" button
  - Results:
    - Score bar with percentage
    - Keywords Found (green badges)
    - Military Jargon Detected (amber badges with civilian translation)
    - Missing High-Value Keywords (dim badges)
- Keyword analysis logic: match pasted text against `linkedinKeywords` + `atsKeywords` filtered by target industry, detect `jargonTerms` matches

**Add Headlines sub-tab within Generate mode (~60 lines):**
- Within the right column output area, add a tab row: "Headlines" | "About"
- Headlines tab shows 5 dictionary-generated headline variations
- Each with inline editing (Edit/Save/Cancel), Copy button
- About tab shows the existing summary output

**Total additions**: ~235 lines of new code
**Total net change to LinkedInTool.tsx**: ~+200 lines (some existing headline code gets reorganized)

#### 3. `src/components/career-tools/CareerToolsHub.tsx`

**No changes needed.** CareerToolsHub already only renders `LinkedInTool` — it never rendered `DictLinkedInTools`. Confirmed: the component import and tool card reference `LinkedInTool` exclusively.

---

### Files to DELETE (1 file)

#### `src/components/career-tools/DictLinkedInTools.tsx`
- Deleted AFTER creating `linkedInUtils.ts` with the extracted utilities
- Actually: rename rather than delete+create (preserves git history)

---

### Import Update Summary

| File | Current Import | New Import |
|---|---|---|
| `LinkedInTool.tsx` | `from './DictLinkedInTools'` | `from './linkedInUtils'` |

Only one file imports from DictLinkedInTools. No other files need updating.

---

### Risks (Item 18)

1. **Keyword analysis accuracy**: Porting the keyword matching logic from DictLinkedInTools. The logic matches lowercased pasted text against `linkedinKeywords[].keyword` and `atsKeywords[].keyword` filtered by target industry. Need to replicate exactly.

2. **Session persistence**: LinkedInTool persists results to sessionStorage. New keyword results should NOT be persisted (they're ephemeral analysis results).

3. **Dictionary data loading**: LinkedInTool already loads `summaries`, `rankEquivalents`, `atsKeywords` from dictionary. Adding `linkedinKeywords` and `jargon` to the same `getDictionary()` call adds no extra network requests — it's one dictionary load.

4. **Git rename**: If we `git mv DictLinkedInTools.tsx linkedInUtils.ts`, git tracks the rename. The utility functions are unchanged, just the component is removed. Clean diff.

---

## Execution Order

### Phase 1: Item 18 — LinkedIn merge (lower risk, fewer dependencies)
1. Create `linkedInUtils.ts` by extracting utilities from `DictLinkedInTools.tsx`
2. Update `LinkedInTool.tsx` import path
3. Add inline headline editing to LinkedInTool
4. Add Keywords tab to LinkedInTool
5. Add Headlines sub-tab within Generate mode
6. Delete `DictLinkedInTools.tsx`
7. Build check

### Phase 2: Item 9 — Onboarding reduction (more files, higher risk)
1. Update `ProgressBar.tsx` (4 steps)
2. Create `StepQuickProfile.tsx`
3. Create `StepFinish.tsx`
4. Simplify `StepExperience.tsx` (remove eval/bullet code)
5. Update `NewOnboardingWizard.tsx` (4-step flow, legacy mapping, remove celebration screen)
6. Build check

### Final: Full build validation (`npx next build`)
