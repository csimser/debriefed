# Developing Debriefed

Debriefed is a zero-backend app. There are no servers, databases, accounts, or
environment secrets — everything runs in the browser, and the shipped product is
a single `Debriefed.html` file.

## Setup

```bash
git clone https://github.com/csimser/debriefed.git
cd debriefed
npm install
npm run dev      # Next.js dev server at http://localhost:3000
```

No environment variables are required. `.env.example` lists the optional
build-time settings (canonical URL + support contact used in metadata).

## Builds

| Command | Output |
|---|---|
| `npm run build` | `out/` — static Next.js export. Used to compile/type-check the app; not deployed. |
| `npm run build:singlefile` | `dist-singlefile/Debriefed.html` — the single-file distribution that ships to users. |

Both builds run `scripts/build-data.mjs` first, which transforms the canonical
dictionary export in `supabase/seed-data/dictionary-export/` into the minified
bundled data in `public-data/`.

The single-file build (Vite + `vite-plugin-singlefile`) reuses the same app
pages via shims for `next/link` and `next/navigation` (see `singlefile/`). It
bundles the `(app)` routes plus onboarding, embeds the dictionary data, and
inlines fonts as data URLs so the result works from `file://` with no network.

## Distribution

- **App:** push a `v*` tag → `.github/workflows/release.yml` builds
  `Debriefed.html` and attaches it to the GitHub Release. The latest build is
  always at
  `https://github.com/csimser/debriefed/releases/latest/download/Debriefed.html`.
- **Marketing page:** `landing/` is a static, dependency-free page deployed to
  `getdebriefed.co` on every push to `main` via
  `.github/workflows/deploy-landing.yml`.

## Repository layout

```
src/app/(app)/      the app itself (bundled into Debriefed.html)
src/app/            other Next routes (home, about, help, privacy, terms) — not deployed
src/components/     React components
src/lib/storage/    localStorage persistence layer (all user data)
src/lib/ai/         optional AI enhancement services (user's own key)
src/lib/dictionary/ translation engines (dictionary-driven, no AI required)
src/lib/export/     client-side PDF/DOCX/TXT generation
public-data/        bundled dictionary + O*NET data (served raw for auto-update)
singlefile/         Vite entry + Next.js shims for the single-file build
landing/            static marketing page for getdebriefed.co
content/blog/       MDX source for transition guides (not currently routed)
```

## Contributing

PRs welcome — including dictionary improvements. The translation data lives in
`supabase/seed-data/dictionary-export/` (canonical export) and is transformed
into `public-data/` by `scripts/build-data.mjs`. Fix a bad translation, add a
missing acronym, or improve an MOS crosswalk and the whole app gets better.
