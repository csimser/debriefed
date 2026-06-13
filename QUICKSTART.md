# Debriefed — Quick Start

## Just want to use it?

You don't need any of this. Go to **[getdebriefed.co](https://getdebriefed.co)** — it runs entirely in your browser. Or download `Debriefed.html` from [Releases](https://github.com/csimser/debriefed/releases) and double-click it.

To use the AI features (cover letters, job match, eval parsing), create an API key at [console.anthropic.com](https://console.anthropic.com/settings/keys) and paste it into the app's Settings once. Everything else — including the 33,000-entry translation dictionary — works without it.

## Run the code yourself (ELI5)

You'll need: a computer, a terminal, and about 10 minutes.

### Step 1: Get the code

Go to https://github.com/csimser/debriefed and click the green "Code" button → "Download ZIP", then unzip it. Or with git:

```
git clone https://github.com/csimser/debriefed.git
cd debriefed
```

### Step 2: Install Node.js

Download the LTS version from https://nodejs.org. This project includes an `.nvmrc` file — if you use nvm, run `nvm use`.

### Step 3: Install dependencies and run

```
npm install
npm run dev
```

Open http://localhost:3000. That's it — there are no environment variables, databases, or accounts to configure. (The old Supabase/Stripe setup is gone; the app is fully client-side now.)

### Building

```
npm run build              # static site in out/ (what getdebriefed.co serves)
npm run build:singlefile   # dist-singlefile/Debriefed.html (the one-file app)
```

### Where things live

- Your data when using the app: your browser's localStorage (Settings → Export for backups)
- The translation dictionary: `public-data/` (built from `supabase/seed-data/dictionary-export/`)
- Blog posts: `content/blog/*.mdx`
