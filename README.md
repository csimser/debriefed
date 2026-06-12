# Debriefed

Military-to-civilian resume translation, job-match analysis, cover letter generation, and LinkedIn optimization — built for veterans transitioning out of service.

**Free. Open source. Zero backend.** Your data never leaves your device.

- **Use it now:** [getdebriefed.co](https://getdebriefed.co) (installable PWA)
- **Or download it:** grab `Debriefed.html` from [Releases](https://github.com/csimser/debriefed/releases) — the entire app in one file. Run it from a USB stick if you want.

## How it works

There are no accounts and no servers:

- **Your data** (profile, resumes, application tracker) lives in your browser's localStorage. Export/import it as JSON from Settings.
- **The dictionary** — 33,000+ military-to-civilian translations, MOS crosswalks, eval phrases, and templates — ships with the app and works offline. It auto-updates from this repo's `public-data/` when newer data is published.
- **AI features** (cover letters, job-match scoring, eval parsing, LinkedIn optimization) use **your own Anthropic API key**, entered once in Settings and stored only in your browser. Calls go directly from your browser to `api.anthropic.com` — nowhere else. Most actions cost under a cent; you pay Anthropic directly. Dictionary translation needs no key at all.

## Stack

- **Next.js 16** (App Router, React 19) — static export, deployed to GitHub Pages
- **Vite** — separate entry that builds the single-file `Debriefed.html`
- **Anthropic Claude** (Haiku, Sonnet escalation) — AI generation, browser-direct with your key
- **Tailwind CSS** — styling
- **@react-pdf/renderer / docx / pdf-lib** — client-side document generation

## Development

```bash
git clone https://github.com/csimser/debriefed.git
cd debriefed
npm install
npm run dev
```

No environment variables are required. `.env.example` lists the optional build-time settings.

### Builds

| Command | Output |
|---|---|
| `npm run build` | `out/` — static PWA (528 pages incl. ~470 MOS SEO pages + blog) |
| `npm run build:singlefile` | `dist-singlefile/Debriefed.html` — single-file distribution |

Both builds run `scripts/build-data.mjs` first, which transforms the canonical dictionary export in `supabase/seed-data/dictionary-export/` into the minified bundled data in `public-data/`.

### Repository layout

```
src/app/            Next.js pages (marketing, blog, /mos SEO pages, app pages)
src/components/     React components
src/lib/storage/    localStorage persistence layer (all user data)
src/lib/ai/         browser-side AI services (BYO Anthropic key)
src/lib/dictionary/ translation engines (dictionary-driven, no AI required)
src/lib/export/     client-side PDF/DOCX/TXT generation
public-data/        bundled dictionary + O*NET data (served raw for auto-update)
singlefile/         Vite entry + Next.js shims for the single-file build
content/blog/       MDX blog posts
```

## Deployment

- **PWA:** pushing to `main` triggers `.github/workflows/deploy-pages.yml`, which builds the static export and deploys it to GitHub Pages under `getdebriefed.co`.
- **Single file:** pushing a `v*` tag triggers `.github/workflows/release.yml`, which attaches `Debriefed.html` to the GitHub Release.

## Contributing

PRs welcome — including dictionary improvements. The translation data lives in `supabase/seed-data/dictionary-export/` (canonical export) and is transformed into `public-data/` by `scripts/build-data.mjs`. Fix a bad translation, add a missing acronym, or improve an MOS crosswalk and the whole app gets better.

## License

[MIT](LICENSE) © Chris Simser
