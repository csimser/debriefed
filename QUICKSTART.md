# Debriefed - Step by Step Setup (ELI5)

You'll need: a computer, a terminal/command line, and about 30 minutes.

## Step 1: Get the code

Go to https://github.com/csimser/debriefed and click the green "Code" button. Click "Download ZIP." Unzip it somewhere on your computer. Or if you know git:

```
git clone https://github.com/csimser/debriefed.git
cd debriefed
```

## Step 2: Install Node.js

If you don't have it, download it from https://nodejs.org (pick the LTS version). This is what runs the app.

This project includes an .nvmrc file. If you use nvm, run 'nvm use' to switch to the correct Node version.

## Step 3: Install the app's dependencies

Open a terminal in the project folder and run:

```
npm install
```

This downloads all the libraries the app needs. Wait for it to finish.

## Step 4: Create a Supabase account (free)

Go to https://supabase.com and sign up for a free account. Click "New Project." Give it a name, set a database password (save this), and pick a region close to you. Wait for it to spin up.

## Step 5: Set up the database

In your Supabase dashboard, go to the SQL Editor. Open the file `supabase/migrations/00000000_initial_schema.sql` from the code you downloaded. Copy the entire contents and paste it into the SQL Editor. Click "Run." This creates all the tables.

## Step 6: Load the dictionary

Back in your terminal, you need to add your Supabase credentials first (Step 7), then run:

```
node scripts/seed-database.mjs
```

This loads all 33,000+ translation entries into your database.

## Step 7: Set up your environment variables

Copy the example file:

```
cp .env.example .env.local
```

Open `.env.local` in any text editor and fill in:

- **NEXT_PUBLIC_SUPABASE_URL**: Found in Supabase Dashboard > Settings > API > Project URL
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Same page, under "anon public" key
- **SUPABASE_SERVICE_ROLE_KEY**: Same page, under "service_role" key (keep this secret)
- **ANTHROPIC_API_KEY**: Sign up at https://console.anthropic.com, add a credit card, create an API key. This powers the AI translations. You only pay for what you use.
- **DATABASE_URL**: Supabase Dashboard > Settings > Database > Connection string (use the Session pooler URL)

The rest of the variables in .env.example are optional. You can leave them blank to start.

## Step 8: Run it

```
npm run dev
```

Open your browser and go to http://localhost:3000. You should see Debriefed running.

## Step 9: Deploy it (optional)

If you want it live on the internet for others to use:

1. Sign up at https://vercel.com
2. Connect your GitHub account
3. Import the repo
4. Add your .env.local variables to Vercel's Environment Variables settings
5. Click Deploy

Vercel gives you a free URL. You can add a custom domain later if you want.

That's it. You're running Debriefed.
