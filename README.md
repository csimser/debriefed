# Debriefed

Military-to-civilian resume translator. Translates evals, MOS descriptions, and performance write-ups into civilian language. Builds cover letters. Tailors resumes to specific job descriptions. Shows skill gaps.

Works completely free with a built-in 33,000+ entry military translation dictionary. No account, no credit card, no internet required after download.

## ⬇️ [Download Debriefed](https://github.com/csimser/debriefed/releases/latest/download/Debriefed.html)

Double-click the downloaded file. The app opens in your browser and runs entirely on your computer.

**Optional:** Add an Anthropic API key in Settings for AI-enhanced translations (about 2-6 cents per resume on your own account).

## How it works

There are no accounts and no servers:

- **Your data** (profile, resumes, application tracker) lives in your browser's localStorage. Export/import it as JSON from Settings.
- **The dictionary** — 33,000+ military-to-civilian translations, MOS crosswalks, eval phrases, and templates — ships inside the app and works offline. It auto-updates from this repo's `public-data/` when newer data is published.
- **Every feature works without a key**: bullet translation, eval parsing (paste text), job-match scoring, cover letter templates, LinkedIn headline/about generation, summaries — all run on the dictionary engine, fully offline.
- **AI enhancement is optional**: add your own Anthropic API key (entered once in Settings, stored only in your browser) and Claude refines the dictionary output — plus unlocks document reading (PDF parsing/OCR). Calls go directly from your browser to `api.anthropic.com`; you pay Anthropic directly, about 2–6 cents per resume.

## Community

Join [The Debrief](https://discord.gg/mfN7dqnsaY) — a free community for service members and veterans working the transition. Resume help, VA claims talk, job search, tool support. Veterans helping veterans. No cost, no upsell.

## License

[MIT](LICENSE) © Chris Simser

---

Want to hack on the source? See [DEVELOPMENT.md](DEVELOPMENT.md).
