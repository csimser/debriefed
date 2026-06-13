# Debriefed Migration Plan: Next.js + Supabase → Zero-Backend PWA

**Status:** Planning document. No code changes made. Read-only audit completed 2026-06-11.

**Target architecture:**
- PWA at getdebriefed.co via GitHub Pages
- Single-file `Debriefed.html` via GitHub Releases
- Zero backend, zero database, zero accounts
- BYO Anthropic API key (localStorage, direct browser→Anthropic calls)
- Dictionary + O*NET data bundled, auto-updated from static JSON in the repo

---

## 1. Current Architecture Inventory

| Aspect | Current state |
|---|---|
| Framework | Next.js **16.1.4**, **App Router** (no Pages Router) |
| Language | TypeScript throughout (strict tsconfig) |
| React | 19.2.3 |
| State management | **None** (no Redux/Zustand/Jotai). React local state + Server Components for data loading + localStorage/sessionStorage for session state |
| Styling | **Tailwind CSS 3.4** + `@tailwindcss/typography`, `clsx` + `tailwind-merge`. No CSS modules, no styled-components |
| UI library | **Custom components** (`src/components/ui/`). No shadcn/Radix |
| Hosting | Vercel (`vercel.json` with one cron job) |
| Observability | Sentry (`@sentry/nextjs`, 3 config files) |
| Email | Resend |
| Payments | Stripe |

### Anthropic call locations — all server-side

Central plumbing:
- `src/lib/ai-model.ts` — `callWithEscalation()`: Haiku primary (`claude-haiku-4-5-20251001`), Sonnet escalation on poor output
- `src/lib/ai-endpoint-wrapper.ts` — `withAISecurity()` wrapper (auth + usage limits + sanitization + abuse detection)
- `src/lib/translation-engine.ts:343` — dictionary-first translation with Claude polish pass

API routes calling Anthropic (14):

| Route | Call site | Purpose |
|---|---|---|
| `api/translate/route.ts` | :73, :215 | Bullet military→civilian translation |
| `api/generate-cover-letter/route.ts` | :530 | Cover letter generation |
| `api/refine-cover-letter/route.ts` | :181 | Cover letter refinement |
| `api/generate-linkedin/route.ts` | :253, :334 | LinkedIn headline + about (2 calls) |
| `api/analyze-linkedin/route.ts` | :266 | LinkedIn profile scoring |
| `api/parse-linkedin-pdf/route.ts` | :77 | LinkedIn PDF extraction (vision) |
| `api/enhance-summary/route.ts` | :144 | Professional summary enhancement |
| `api/import-resume/route.ts` | :110 | Resume text → structured JSON |
| `api/import-resume/extract-text/route.ts` | :71 | PDF text extraction (vision); DOCX uses mammoth locally |
| `api/eval/extract/route.ts` | :233 | Eval image OCR + bullet extraction (vision) |
| `api/parse-eval/route.ts` | :319 | Eval PDF/image parsing (vision) |
| `api/job-match/route.ts` | :383 | Resume↔job posting match scoring |
| `api/job-match/suggestions/route.ts` | :78 | Bullet rewrite suggestions |
| `api/admin/settings/health-check/route.ts` | :15 | Admin ping (dead — admin is killed) |

No build-time or cron Anthropic calls. No streaming anywhere — all complete-JSON responses. No client-side Anthropic usage today.

### Supabase call locations

**141 files** under `src/` reference Supabase. Clients live in `src/lib/supabase/{client,server,admin}.ts`; plus `src/middleware.ts` (session refresh + route protection). Full categorized inventory is in §2. Major clusters: all 83 API routes' auth checks, all `(app)` pages' data loading, admin panel, dictionary queries, usage tracking, profile/resume/tracker persistence.

### O*NET API call locations

All in `src/lib/onet-api.ts` (base: `https://api-v2.onetcenter.org`, key: `ONET_API_KEY`):

| Function | Endpoint | Callers |
|---|---|---|
| `getMilitaryCrosswalk(code, branch)` | `GET /veterans/military?code=&branch=` | `api/onet/crosswalk/route.ts:126`, via `getOccupationContext` |
| `searchCareers` (alias `searchOccupations`) | `GET /veterans/search?keyword=` | `api/job-match/route.ts:64`, `onet-api.ts:293` |
| `getOccupationContext(code, branch)` | wraps crosswalk | `api/onet/crosswalk/route.ts:106`, `api/translate/route.ts:177` |
| `getOccupationSkills` / `getOccupationTasks` | **no-ops — always return `[]`** (v2 API removed these) | `api/job-match/route.ts:68` |
| `checkOnetHealth()` | `GET /veterans/search?keyword=manager` | admin health-check (dead) |

Important: the API is already a *fallback*. `api/onet/crosswalk` tries `dict_mos_to_civilian` → `dict_onet_crosswalk` (both local DB tables, both in the dictionary export) → live O*NET API. The `/mos/[code]` pages use only the local tables, never the API. And `getOccupationSkills` in job-match is already a silent no-op.

### Features shipping today (user flows)

**Public/marketing:** `/` (landing + interactive translation demo + pricing), `/about`, `/pricing`, `/help` (FAQ/features/tutorials, all hardcoded), `/privacy`, `/terms`, `/blog` + `/blog/[slug]` (89 MDX posts, build-time SSG), `/mos` + `/mos/[code]` (~493 SEO pages, SSG from dictionary tables), `/waitlist` (redirect), `/unsubscribe`.

**Auth:** `/login`, `/signup`, `/verify-email`, `/auth/*` callbacks, `/onboarding` (multi-step military profile wizard).

**App (protected):**
- `/dashboard` — profile progress, quick stats, checklist, banners
- `/profile` — military background, experiences + bullets, education, certifications, skills, resume import (PDF/DOCX), inline bullet translator, eval history
- `/resumes` — full resume editor, 6 templates (incl. federal), versioning, PDF/DOCX export
- `/job-match` — paste job posting → AI match score, skill gaps, improvement suggestions
- `/career-tools` — hub: bullet translator, cover letter generator (+refinement), LinkedIn optimizer (headline/summary/profile analysis/PDF import), eval upload OCR, dictionary browser
- `/tracker` — job application kanban tracker
- `/settings` — account, billing, privacy toggles, data export, delete account

**Admin** (`/admin/*`, 12 pages) and **B2B partner portal** (`/partner/*`, `/join/[slug]`) — both entirely backend-dependent.

---

## 2. Dead Code Inventory

Verdicts: **DELETE** (gone with backend), **REWRITE** (feature survives, persistence/transport changes), **KEEP** (works as-is or near as-is).

### DELETE

| Category | Files | Notes |
|---|---|---|
| Auth | `src/app/(auth)/**` (4 pages), `src/app/auth/**` (3), `src/app/api/auth/**` (5 routes), `src/lib/supabase/{client,server,admin}.ts`, `src/middleware.ts` | ~16 files. No accounts. |
| Payments | `api/stripe/**` (3), `api/user/subscription`, `api/user/eval-limit`, `api/track-usage`, `/pricing` page, `src/lib/pricing-config.ts`, `src/lib/usage-service.ts`, `src/lib/usage-tracking.ts`, `src/components/paywall/**` (10), `src/components/modals/UpgradeModal.tsx` | ~22 files. BYO key = no tiers, no limits. |
| AI security plumbing | `src/lib/ai-endpoint-wrapper.ts`, `src/lib/ai-security.ts`, `src/lib/abuse-detection.ts`, `src/lib/ai-translation-capture.ts` | Server-side rate limiting/abuse/capture pipeline is meaningless client-side. Salvage: PII-redaction regexes (SSN/DODID) are worth porting into the client before text leaves the device. |
| Admin | `src/app/admin/**` (12 pages + layouts), `api/admin/**` (22 routes), `src/lib/admin-auth.ts`, `src/components/admin/**` | ~40 files. |
| B2B/Partner | `src/app/(app)/partner/**` (4), `api/partner/**` (5), `/join/[slug]` page + `api/join/**` (2), org migrations | ~12 files. |
| Email | Resend usage in `api/waitlist`, `api/unsubscribe`, `api/feedback`, `api/auth/resend-confirmation`, `src/lib/unsubscribe-token.ts`, `/unsubscribe/*` pages, `/waitlist` page | ~8 files. |
| Beta/promo codes | `api/beta/**` (3), `api/cron/expire-beta`, `src/components/beta/**`, admin beta/promo pages (counted above), `vercel.json` cron | ~6 files. |
| Analytics/tracking | `api/analytics/**` (2), `src/components/analytics/**`, `src/lib/analytics.ts`, Sentry configs (`sentry.*.config.ts`, `src/instrumentation*`), `@sentry/nextjs` | ~8 files. See §9 for what's lost. |
| Community/social | `api/testimonials/**` (2), `api/feedback`, `api/community/stats`, `src/components/testimonials/**`, `src/components/layout/FeedbackWrapper.tsx`, `src/lib/dictionary/communityQueries.ts`, dict submission UI | ~10 files. Community submission pipeline dies (see §9). |
| Account mgmt | `api/account/delete`, `api/account/export` (replaced by localStorage clear/export — near-total rewrites, effectively delete + small client utility) | 2 files. |
| DB artifacts | `supabase/migrations/**` (31 files), `scripts/seed-database.mjs`, `scripts/test-unsubscribe.mjs`, `@supabase/*`, `stripe`, `resend` deps | Keep `supabase/seed-data/dictionary-export/` — that's the data source. |

**Unsure / flag for review:**
- `/onboarding` wizard — the *flow* is good UX for first-run profile setup; the persistence is Supabase. Recommend REWRITE (keep wizard, save to localStorage) rather than delete.
- `src/lib/mos-page-data.ts` — queries Supabase but feeds the high-value `/mos/[code]` SEO pages. REWRITE against bundled JSON.
- `dict_missing_terms_log` / `dict_submissions` exports — log/community tables; recommend **excluding from the bundle** (199 rows of operational noise).
- Landing page pricing section + `/pricing` — product is becoming free/open-source; landing copy needs a rewrite pass (flagged as content work, not just code deletion).
- `test.docx`, `tsconfig.tsbuildinfo`, `content/blog/*Zone.Identifier*` files (WSL artifacts) — repo hygiene deletions.

### REWRITE (feature survives, persistence/transport changes)

- All 21 user-facing pages (routing + data loading changes; component bodies largely survive)
- Profile components: `src/components/profile/**` (~14 files) — Supabase reads/writes → localStorage
- Resume components: `src/components/resume/**` (~10) — same, plus `api/resume/**` (6 routes) become client-side functions
- Onboarding: `src/components/onboarding-new/**` (~8)
- Tracker: `api/applications/**` (2 routes) + `src/components/tracker/**` → localStorage
- Career tools components (~8): swap fetch-to-API-route for direct client AI service calls
- Job match components (~4): same
- Export routes: `api/export-resume`, `api/export-cover-letter`, `api/export-tailored` → client-side generation (the PDF/DOCX libs already do the work)
- The 14 AI routes in §1 → client-side service module
- `src/lib/translation-engine.ts`, `src/lib/dictionary/dictionaryQueries.ts`, `src/lib/onet-api.ts`, `src/lib/mos-page-data.ts` → bundled-JSON-backed
- Layout/nav (`src/components/layout/**`): strip auth/logout/upgrade chrome

### KEEP (little or no change)

- `src/lib/dictionary/` engines: `bulletTranslator.ts` (72KB), `evalParser.ts`, `keywordExtractor.ts`, `matchScorer.ts`, `outputPolisher.ts`, `templateFiller.ts`, `types.ts` — pure logic over the dictionary cache, already designed for in-memory lookups
- `src/lib/pdf/ResumeDocument.tsx`, `src/lib/docx/` — generation logic (moves client-side; see §7)
- `src/lib/debriefed-token-saver/` — static JSON crosswalks + lookup helpers, already local
- `src/components/ui/**`, `src/lib/constants/`, `src/lib/utils/`, most presentational components
- `content/blog/` (89 MDX posts), `src/lib/mdx.ts` logic (adapted to Vite build)
- `public/manifest.json` (extended, not replaced)

---

## 3. Dictionary Data Path

### Format the migration expects

**It's already done.** `supabase/seed-data/dictionary-export/` contains a complete export: 24 JSON files (one array-of-row-objects per `dict_*` table) + `manifest.json` with row counts. Total: **exactly 33,843 rows**, matching the known dictionary size. Exported 2026-05-20 by `scripts/export-dictionary.mjs` (paginated, ID-sorted, deterministic). `scripts/verify-export.mjs` validates files against the manifest.

**Assumption to confirm:** your local copy is the same export format (or a newer run of the same script). First step of the data task is to diff your copy's manifest against the in-repo one and take the newer. If your copy is a SQL dump or CSV instead, we add a small converter — the target shape stays the same.

### Cleanest bundled schema

One file per table is preferable to a single `dictionary.json` blob — enables lazy loading and lets the auto-updater fetch only changed tables. Plus a version manifest:

```
public/data/
  manifest.json          // { version, exported_at, tables: [{table, rows, file, bytes, hash}] }
  acronyms.json
  military_jargon.json
  phrase_translations.json
  onet_crosswalk.json    // the big one
  ...
```

Transforms during bundling:
- Strip `id` (UUIDs) and `created_at` — dead weight, never used by lookup code. On `dict_onet_crosswalk` alone this cuts 6.6MB → 4.4MB minified (1.3MB → 0.6MB gzipped).
- Minify (pretty-printed 13MB → ~10.2MB; stripped+minified ≈ **~7.5MB raw, ~1.5–2MB gzipped**).
- Exclude `dict_missing_terms_log`, `dict_submissions`, `dict_submission_upvotes` (community/ops tables, 199 rows).
- Single-file build: same data embedded as a JS module or `<script type="application/json">` blocks.

### Where the dictionary is queried today

| File | What it does |
|---|---|
| `src/lib/dictionary/dictionaryQueries.ts:111-130` | `loadDictionary()` — parallel SELECT * of 20 dict tables into an in-memory `DictionaryCache`, cached per session. **This is the single choke point for all the engine files.** |
| `src/lib/translation-engine.ts:69-73` | Loads `dict_phrase_translations` + `dict_military_jargon` (5-min server cache) for the dictionary-first translation layer |
| `src/lib/mos-page-data.ts:108-274` | `dict_mos_to_civilian`, `dict_onet_crosswalk`, `dict_military_jargon`, `dict_bullet_patterns` for `/mos` pages and `generateStaticParams` |
| `src/app/api/onet/crosswalk/route.ts:55,77` | `dict_mos_to_civilian` → `dict_onet_crosswalk` lookups |
| `src/app/sitemap.ts:22` | `dict_mos_to_civilian` for sitemap URLs |
| `src/lib/dictionary/communityQueries.ts` | Submissions/upvotes/missing-terms — DELETE |
| `src/lib/ai-translation-capture.ts:35-77` | AI-translation capture pipeline — DELETE |
| `src/app/admin/dictionary/page.tsx`, `api/community/stats` | Admin/stats — DELETE |

The consuming engines (`bulletTranslator.ts`, `evalParser.ts`, `matchScorer.ts`, `keywordExtractor.ts`, `templateFiller.ts`, `outputPolisher.ts`) all read from the `DictionaryCache` object, not from Supabase directly.

### The refactor

Small and well-contained, because `loadDictionary()` already produces an in-memory cache:

1. Rewrite `loadDictionary()` to `fetch('/data/<table>.json')` (or static `import` for the single-file build) instead of 20 Supabase queries. The `DictionaryCache` interface and every consumer stay untouched.
2. Rewrite `translation-engine.ts`'s two table loads the same way (or have it consume `DictionaryCache` for consistency).
3. Rewrite `mos-page-data.ts` queries as in-memory filters over the bundled arrays.
4. Delete the Supabase import from each; delete community/capture code.

Estimated blast radius: ~5 files rewritten, ~15 engine/component files untouched.

---

## 4. O*NET Data Path

### Endpoints in use (confirmed)

Only two live endpoints, both under O*NET Web Services v2 "veterans" API:
1. `GET /veterans/military?code=&branch=` — military code → civilian careers crosswalk
2. `GET /veterans/search?keyword=` — keyword → occupation list (used by job-match to find the occupation for a job title, and by `getOccupationDetails`)

`getOccupationSkills`/`getOccupationTasks` are already hardcoded no-ops returning `[]` (v2 removed those endpoints), so job-match's "industry-standard skills" enrichment is **already dead in production** — replacing it loses nothing.

### Minimum local data to replace the API

1. **Crosswalk (`/veterans/military`):** already covered. `dict_onet_crosswalk` (24,248 rows, official DoD DMDC MOC→O*NET mapping) + `dict_mos_to_civilian` (493 curated rows) are both in the dictionary export, and the existing code already prefers them — the API is only a fallback. Replacement = delete the fallback.
2. **Keyword search (`/veterans/search`):** needs an occupation title list. From the O*NET database, only the **Occupation Data** table (~1,000 SOC occupations: code, title, description) — ~500KB raw, ~150KB stripped/minified, ~40KB gzipped. Implement a simple client-side fuzzy/substring match over titles. Optionally add **Alternate Titles** (~57K rows, ~4MB raw) for better matching — recommend **skipping it** initially; the current search quality bar is low (it feeds a 3-result prompt hint).

### Size estimate

Beyond the crosswalk already counted in §3: **~150KB minified / ~40KB gzipped** for Occupation Data. Negligible.

### Where O*NET data flows in the app

- `api/translate/route.ts:177` — `getOccupationContext()` adds civilian titles to the AI prompt (optional, 3s-timeout, fails silent) → replace with bundled crosswalk lookup
- `api/job-match/route.ts:64-77` — `searchOccupations(jobTitle, 3)` + skills (no-op) → prompt context → replace with bundled occupation search
- `api/onet/crosswalk/route.ts` — user-facing crosswalk endpoint → becomes a pure client function over bundled data
- `/mos/[code]` pages — already local-data-only, no change beyond §3
- Onboarding components (`StepMilitary`, `StepQuickProfile`) and `LinkedInTool` hit `/api/onet/crosswalk` — repoint to the client function

`ONET_API_KEY` and `src/lib/onet-api.ts`'s HTTP layer are deleted entirely.

---

## 5. Anthropic Call Refactor

### Server-side call sites

The 14 routes in §1, plus `translation-engine.ts:343`. The Anthropic SDK supports browser usage via `dangerouslyAllowBrowser: true` (sends the `anthropic-dangerous-direct-browser-access` header; Anthropic's API serves CORS for this) — appropriate here since the key is the *user's own*.

### Per-route migration

| Route | Browser feasibility | Notes |
|---|---|---|
| translate, generate-cover-letter, refine-cover-letter, generate-linkedin, enhance-summary, job-match, job-match/suggestions, analyze-linkedin, import-resume | ✅ Trivial | Text-in/JSON-out. Prompt assembly (dictionary pre-translation, crosswalk context, profile context) is pure logic that moves as-is. |
| parse-linkedin-pdf, parse-eval, eval/extract, import-resume/extract-text (PDF path) | ✅ Straightforward | Vision calls with base64 — browser does `FileReader` → base64 → SDK document/image block. The FormData/sanitizer issues that forced these outside `withAISecurity` disappear. DOCX path uses mammoth, which runs in-browser. |
| admin health-check | ❌ Delete | Admin-only ping. |

What each route does server-side **that the browser can't or shouldn't replicate** — and the resolution:

| Server behavior | Resolution |
|---|---|
| Supabase auth check (all routes) | Gone — no accounts |
| Usage limits / tier gates (`canUseFeature`, `withAISecurity`) | Gone — user pays Anthropic directly |
| Usage increments via `after()`, `api_usage`/`activity_log` writes | Gone. Optional: local token-spend counter in localStorage as a courtesy meter |
| `eval_uploads` DB writes (parse-eval, eval/extract) | localStorage eval history (matches existing `EvalHistory` UI) |
| Abuse/prompt-injection detection, IP rate limiting | Gone — pointless against your own key |
| PII scanning (SSN/DODID) before AI calls | **Port to client** — still valuable, runs as regex before send |
| Server-side response caches (analyze-linkedin 12h, job-match 24h) | Optional localStorage cache; fine to drop initially |
| Dictionary loads from DB (translation-engine) | Bundled JSON (§3) |
| `ANTHROPIC_API_KEY` env secret | Replaced by user's key from localStorage |
| Model escalation (`callWithEscalation`) | Pure logic, moves as-is |

Recommended shape: one `src/lib/ai/client.ts` exposing the same functional surface the components already call (`translateBullet()`, `generateCoverLetter()`, …), so component changes are mostly swapping `fetch('/api/x')` for `aiClient.x()`.

### API key flow UX

- **Storage:** `localStorage["debriefed_api_key"]`. Validated on save with a minimal 1-token ping (the pattern already exists in health-check).
- **Settings home:** repurposed `/settings` page — key entry, show/hide, test button, remove key, plus link to Anthropic console with setup instructions.
- **Gating:** a `KeySetupModal` rendered by any AI-invoking action when no key is present (analogous to the existing `LastUseWarningModal` interception pattern). Non-AI features — resume editor, dictionary browser/translator layer 1, MOS pages, tracker, exports — work with **no key at all**. The dictionary-first translation layer is a genuine zero-key value proposition.
- **First-run:** onboarding wizard gets an optional "connect your Anthropic key" step (skippable).
- **Errors:** 401 from Anthropic → "key invalid/revoked" modal; 429 → rate-limit message. Replaces the current 403-limit handling in `CoverLetterTool`, `JobMatchWorkspace`, `LinkedInTool`, `EvalUploadModal`.

---

## 6. Routing Migration

### Route map (Next.js → SPA)

**Surviving routes (~17):** `/`, `/about`, `/help`, `/privacy`, `/terms`, `/blog`, `/blog/:slug`, `/mos`, `/mos/:code`, `/onboarding`, `/dashboard`, `/profile`, `/resumes`, `/job-match`, `/career-tools`, `/tracker`, `/settings`.

**Dropped routes:** `/pricing`, `/login`, `/signup`, `/verify-email`, `/auth/*`, `/waitlist`, `/unsubscribe/*`, `/admin/*` (12), `/partner/*` (4), `/join/:slug`.

**All 83 API routes dissolve** — into client functions (AI, dictionary, crosswalk, resume ops, exports), localStorage operations (profile, applications, versions), or deletion (everything else).

### Server-only mechanics in use

- **Middleware** (`src/middleware.ts`): Supabase cookie refresh + 302-to-login for protected paths. Replacement: none needed (no auth). Optional client-side redirect to onboarding when no local profile exists.
- **No server actions** — zero `"use server"` in the codebase. All mutations already go through `fetch()` to API routes. This makes the SPA conversion much cleaner than typical Next.js apps.
- **SSG:** `generateStaticParams` on `/blog/[slug]` (89 posts, fs+gray-matter) and `/mos/[code]` (~493 pages, Supabase). `generateMetadata` for SEO on both.
- **`src/app/sitemap.ts`** — dynamic sitemap from DB → becomes build-time generation from bundled JSON.
- **`next.config.ts`** security headers/CSP → GitHub Pages **cannot set custom headers**; CSP moves to a `<meta http-equiv>` tag (slightly less capable: no `frame-ancestors`).
- **No** `next/image`, **no** `next/font`, **no** `cookies()`/`headers()` in pages — unusually portable.

### Doesn't trivially translate — flagged

1. **SEO on `/mos/[code]` (~493 pages) and `/blog` (89 posts).** These are the organic-traffic funnel, currently server-rendered with per-page meta + JSON-LD. A plain client-rendered SPA loses this. **Mitigation: build-time prerendering** (e.g. `vite-ssg` or a custom prerender script over the bundled data) emitting real HTML per route to GitHub Pages. This is the single biggest routing-migration work item.
2. **GitHub Pages SPA fallback** — no rewrites; deep links need the `404.html` redirect trick (fine with prerendering, since most deep links become real files) or hash routing. Recommend: history routing + prerender + 404 fallback for the PWA; **hash routing inside the single-file build**.
3. **MDX rendering** — `next-mdx-remote/rsc` is Next-specific. Replace with build-time MDX compilation (`@mdx-js/rollup`) or precompiled HTML in a posts manifest.

---

## 7. PWA + Single-File Build Assessment

### Current PWA state

- `public/manifest.json` exists and is valid (standalone display, theme colors) but has **only one SVG icon** — needs 192/512px PNGs + Apple touch icon.
- **No service worker anywhere.** Nothing to salvage; add `vite-plugin-pwa` (Workbox) fresh. The SW also becomes the data auto-update mechanism (see §10, task 13).

### Single-file `Debriefed.html` size estimate

| Component | Est. minified |
|---|---|
| App JS (React 19 + router + app code + Tailwind CSS) | ~1.2–1.8MB |
| Dictionary (stripped, §3) | ~7.5MB (≈5MB if base64/embedding overhead avoided via JSON-in-script-tag) |
| O*NET occupation data | ~0.15MB |
| `debriefed-token-saver` static JSON | ~0.2MB |
| docx + pdf generation libs | ~1–1.5MB |
| Blog (89 posts, optional — could be PWA-only) | ~1MB |
| **Total** | **~10–12MB** (~2.5–3MB if served gzipped; as a GitHub Release download it's the raw size) |

A 10–12MB single HTML file is viable (loads fine locally; browsers handle it). Biggest lever if it matters: drop `dict_onet_crosswalk` to a curated subset in the single-file build, or exclude blog content.

### Things that fight the single-file build

1. **`pdfjs-dist` web worker** — requires a separate worker file. **Good news: it's barely used** — PDF resume import already goes through Claude vision, not pdfjs. Recommend deleting `pdfjs-dist` entirely and standardizing on vision for PDFs. (Verify no other import path needs it during implementation.)
2. **`@react-pdf/renderer`** — currently used server-side in export routes, but it *does* support in-browser rendering (`pdf()`/`PDFDownloadLink`). Heavy (~500KB+) but bundles. Fallback if it misbehaves in the single-file context: `pdf-lib` (already a dependency, pure JS) with hand-built layout — more work, avoid unless forced.
3. **`docx`, `mammoth`, `file-saver`, `pdf-lib`, `libphonenumber-js`** — all pure JS, browser-safe, bundle cleanly. ✅
4. **Dynamic imports** — only trivial utility code-splitting; inline-able. ✅
5. **Google Fonts** — currently linked externally; must be subset + embedded (woff2 base64) for offline/single-file.
6. **Sentry** — drop (privacy-aligned for a local-first tool).
7. **Two build targets, one codebase** — Vite multi-config: PWA build (code-split, lazy data fetch, SW) + single-file build (`vite-plugin-singlefile`, hash router, embedded data). The data-loading layer needs a small abstraction over fetch-vs-embedded.

---

## 8. Total Scope Estimate

Baseline: **344 source files** in `src/`, plus config/scripts.

| Bucket | Count | Biggest categories |
|---|---|---|
| **Delete** | **~195 files (~57%)** | All 83 API routes (75 deleted outright, 8 absorbed into client services), admin (~40), auth (~16), payments/paywall (~22), partner/B2B (~12), email/waitlist (~8), analytics/Sentry (~8), community/testimonials (~10) — plus 31 SQL migrations and 3 Sentry configs outside `src/` |
| **Rewrite** | **~60 files (~17%)** | 17 pages (re-routed + data layer), profile/resume/onboarding/tracker components (~35, persistence swap), `dictionaryQueries`/`translation-engine`/`onet-api`/`mos-page-data` (~5), layout/nav chrome (~5) |
| **Leave alone** | **~90 files (~26%)** | Dictionary engines (~9 large files), UI components, pdf/docx generation, constants/types/utils, `debriefed-token-saver`, blog content |

Plus net-new: Vite scaffold, AI client service, localStorage persistence layer, key-setup UX, SW/auto-update, prerender + two build configs, 2 GitHub Actions workflows (~15–20 new files).

### Effort estimate (honest)

| Phase | Hours |
|---|---|
| Vite/Tailwind/router scaffold + two build targets | 6–8 |
| Dead code purge + repo hygiene | 4–6 |
| Data bundling (dictionary + O*NET) + loaders | 5–7 |
| localStorage persistence layer (profile/resumes/versions/tracker, export/import, schema versioning) | 10–14 |
| AI client service: 13 routes → browser, key UX, error handling | 12–16 |
| Page/component ports (17 pages, persistence + fetch swaps) | 10–14 |
| MOS + blog prerendering, sitemap, SEO preservation | 6–8 |
| Client-side PDF/DOCX export | 4–6 |
| PWA (SW, icons, offline, auto-update) | 4–6 |
| Single-file build + size tuning | 4–6 |
| Deploy workflows (Pages + Releases), domain cutover | 3–4 |
| End-to-end QA across both targets | 8–12 |
| **Total** | **~76–107 hours — call it 80–100** |

This is an 80-hour-class project, not 40. The two structural reasons: (1) every feature's *persistence* changes, not just its transport — the localStorage layer touches every app page; (2) you're shipping **two build targets** with different routing and data-loading strategies, and both need QA. The favorable surprises: no server actions, no state library, dictionary engines already in-memory, dictionary export already done, O*NET already mostly local.

---

## 9. Risks and Unknowns

1. **SEO regression on /mos + /blog (highest product risk).** ~580 server-rendered SEO pages are the acquisition funnel. Prerendering at build time mitigates, but verify GitHub Pages + prerendered output preserves meta/JSON-LD parity before cutover. Also: Vercel→Pages DNS cutover should keep URL paths identical to preserve rankings.
2. **API key in localStorage = XSS-exfiltratable.** Mitigations: strict meta-CSP, zero third-party scripts (drop Sentry/analytics), dependency audit. Accepted residual risk inherent to the BYO-key design; document it honestly in the README/settings UI.
3. **Anthropic CORS/browser policy dependency.** `dangerouslyAllowBrowser` + direct browser calls are officially supported today, but the product now has a hard dependency on Anthropic continuing to allow it. Low probability, total-outage impact; no mitigation other than a future relay option.
4. **Dictionary data shape validation (pre-start gate).** Validate your local copy: run `scripts/verify-export.mjs` against it, diff its `manifest.json` vs the in-repo export (2026-05-20, 33,843 rows). Confirm no schema drift (the `20260220` VARCHAR→TEXT migration means older exports could differ). **Open question: is your local copy newer than 2026-05-20?**
5. **`@react-pdf/renderer` in-browser, inside a single-file bundle** — supported but the least-trodden path in this plan; federal resume template (most complex layout) is the test case. Prototype in task 12 before committing; `pdf-lib` is the fallback.
6. **localStorage limits (~5–10MB/origin).** Fine for user data (profiles/resumes are KBs), but resume *version history* and *eval history with extracted data* could accumulate. Cap history depth; offer JSON export. Dictionary data must live in the app bundle / Cache API, never localStorage.
7. **Features silently given up** (beyond the obvious auth/payments): Sentry crash reporting, usage analytics, **the community dictionary pipeline** (missing-term logging, user submissions, AI-translation capture → admin curation — this was the dictionary's growth loop; future alternative: GitHub Issues link from the dictionary UI), testimonials/feedback collection, email/waitlist, B2B partner portal, admin curation tools. Confirm none of these are load-bearing for your roadmap.
8. **Third-party services inventory (complete):** Supabase, Stripe, Resend, O*NET API, Sentry, Vercel (hosting + cron), Google Fonts (must be embedded). Nothing else found.
9. **Multi-device/data-loss expectations.** Accounts previously synced data; now data is device-local and clearing browser storage destroys it. Needs prominent export/import UX and copy that sets expectations.
10. **89 blog MDX files reference old pricing/signup CTAs** — content sweep needed, easy to forget. Also `Zone.Identifier` artifact files in `content/blog/` need cleanup.

---

## 10. Proposed Task Breakdown

Ordered; each shippable as its own commit/PR; none should exceed a few hours.

1. **Repo hygiene + branch setup** — delete WSL artifacts, `test.docx`, stale build info; create `migration` branch; commit this plan.
2. **Validate + bundle dictionary data** — diff local copy vs in-repo export, run verify script, write the transform script (strip ids/timestamps, exclude community tables, minify) emitting `public/data/*` + versioned manifest.
3. **Extract O*NET occupation data** — produce `occupation_data.json` from the O*NET database files, add to `public/data/`.
4. **Scaffold Vite SPA** — Vite + React + TS + Tailwind + react-router in parallel to the Next app (e.g. `app-vite/` or branch-local root swap), porting `src/components/ui`, theme, and layout shells to prove the toolchain.
5. **Dead code purge** — delete auth, admin, partner, Stripe, email, analytics, beta, community, Sentry, migrations, dead API routes, and their dependencies from package.json.
6. **localStorage persistence layer** — typed storage module for profile/experiences/education/certs/skills/resumes/versions/applications/settings with schema versioning + export/import; unit-testable, UI-independent.
7. **Dictionary loader refactor** — `loadDictionary()` + `translation-engine` + `mos-page-data` against bundled JSON; dictionary engines verified working in-browser.
8. **AI client service core + key UX** — browser Anthropic client, key storage/validation, `KeySetupModal`, settings page key management; port `translate` + `translation-engine` polish as the proving route.
9. **Port text AI features** — cover letter (generate/refine), LinkedIn (generate/analyze), enhance-summary, job-match (+suggestions, local occupation search) as client services wired to existing components.
10. **Port vision AI features** — eval upload/parse, LinkedIn PDF, resume import (PDF via vision, DOCX via mammoth); client-side PII redaction; localStorage eval history.
11. **Port app pages** — dashboard, profile, resumes, onboarding, tracker, career-tools, job-match, settings onto SPA routes over the storage layer; strip auth/upgrade chrome from nav.
12. **Client-side document export** — PDF (`@react-pdf/renderer` in-browser — prototype federal template first) + DOCX + cover letter exports replacing the 3 export routes.
13. **Port marketing pages + blog** — landing (copy rewrite for free/open-source positioning), about/help/privacy/terms, MDX blog pipeline via build-time compilation.
14. **Prerender + SEO** — build-time prerendering for `/mos/*` (~493), blog (89), and marketing routes; sitemap + robots generation; meta/JSON-LD parity check against current pages.
15. **PWA layer** — vite-plugin-pwa service worker, icon set, offline support, install prompt.
16. **Data auto-update mechanism** — versioned manifest check against the repo's published JSON (GitHub Pages URL), background refresh via SW/Cache API; single-file build shows an "update available" notice instead.
17. **Single-file build target** — `vite-plugin-singlefile` config, hash routing, embedded data + fonts, size tuning.
18. **Deploy pipelines** — GitHub Actions: build + deploy to Pages with `getdebriefed.co` CNAME; release workflow attaching `Debriefed.html` to GitHub Releases.
19. **Final QA + cutover** — full feature pass on both targets (with and without API key), data export/import round-trip, offline behavior, DNS cutover from Vercel, archive/remove the Next.js app.

---

## Assumptions made (resolve at review)

- Your local dictionary copy matches the in-repo export format (JSON-per-table + manifest); the in-repo copy (2026-05-20, 33,843 rows) is usable if yours isn't newer.
- The product becomes fully free — all tier gates removed rather than re-implemented client-side.
- Blog and MOS SEO pages are worth keeping (drives the prerendering work; if SEO doesn't matter, ~6–8 hours come off the estimate).
- B2B/partner, community submissions, testimonials, waitlist are permanently dead, not deferred.
- "Vite SPA" per your spec — not Next.js static export (see note in review summary).
- Single-file build may exclude the blog to hold size down.
