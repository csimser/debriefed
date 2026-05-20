# Debriefed

Military-to-civilian resume translation, job-match analysis, cover letter generation, and LinkedIn optimization — built for veterans transitioning out of service.

Open-sourced as a free resource. Fork it, deploy your own, or contribute.

## Stack

- **Next.js 16** (App Router, React 19)
- **Supabase** — Postgres, Auth, Row Level Security
- **Anthropic Claude** (Haiku + Sonnet) — all AI generation
- **Stripe** — one-time tier purchases (optional; can be disabled)
- **Resend** — transactional email
- **Sentry** — error monitoring (optional)
- **Tailwind CSS** — styling

## Setup

### 1. Clone and install

```bash
git clone <your fork url> debriefed
cd debriefed
npm install
```

### 2. Configure environment variables

Copy the example file and fill in real values:

```bash
cp .env.example .env.local
```

`.env.local` is gitignored. Never commit it.

#### Where to get each key

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → your project → Settings → API |
| `ANTHROPIC_API_KEY` | https://console.anthropic.com/settings/keys |
| `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` | https://dashboard.stripe.com/apikeys |
| `STRIPE_WEBHOOK_SECRET` | Stripe dashboard → Developers → Webhooks → your endpoint |
| `STRIPE_CORE_PRICE_ID`, `STRIPE_FULL_PRICE_ID`, `STRIPE_EVAL_PACK_PRICE_ID` | Stripe dashboard → Products → your price → "API ID" |
| `RESEND_API_KEY` | https://resend.com/api-keys |
| `ONET_API_KEY` | https://services.onetcenter.org/developer/signup |
| `UNSUBSCRIBE_SECRET`, `CRON_SECRET` | Generate with `openssl rand -hex 32` |
| `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` | https://sentry.io → Settings → your project → Client Keys |
| `NEXT_PUBLIC_GSC_VERIFICATION` | https://search.google.com/search-console → Settings → Ownership verification |

#### Required vs optional

- **Required for the app to boot:** Supabase × 3, Anthropic, Resend, O\*NET, `UNSUBSCRIBE_SECRET`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPPORT_EMAIL`.
- **Required if you want payments:** all `STRIPE_*` keys. Set `NEXT_PUBLIC_PAYMENTS_ENABLED=false` to disable Stripe checkout and grant tiers manually via admin.
- **Optional:** Sentry, Google Search Console, admin bypass list, super-admin UUID, cron secret (only needed if you deploy `/api/cron/*`).

#### Email configuration

| Variable | Description |
|---|---|
| `MAIL_FROM` | From-address for outgoing email. Must be on a domain verified in Resend. |
| `MAIL_FROM_NAMED` | Optional friendly version, e.g. `Your App <noreply@yourdomain.com>` |
| `WAITLIST_NOTIFY_TO` | Where waitlist signup notifications land (defaults to `MAIL_FROM`) |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Public support address shown on /privacy, /terms, /help, /pricing |

#### Admin configuration

| Variable | Description |
|---|---|
| `ADMIN_BYPASS_EMAILS` | Comma-separated lowercase emails that bypass all usage limits. Example: `admin@example.com,owner@example.com` |
| `SUPER_ADMIN_USER_ID` | A single Supabase user UUID granted admin UI access. Look it up in Supabase → Authentication → Users → click user → User UID |

### 3. Set up Supabase

1. **Create a new project** at https://supabase.com/dashboard
2. Copy the URL, anon key, and service-role key into `.env.local`. Also add a Postgres connection string as `DATABASE_URL` — needed for the seed loader and `pg_dump`. Find it under Supabase dashboard → Settings → Database → Connection string → URI. **Use the Shared Pooler (Session mode, port 5432), not the direct connection** — the direct host is IPv6-only on the free tier and fails on IPv4-only networks (WSL2, many corporate networks). The pooler URL looks like `postgresql://postgres.<project-ref>:<password>@aws-1-<region>.pooler.supabase.com:5432/postgres`.

3. **Apply the initial schema dump.** This is a pg_dump snapshot of the full production schema (all tables, triggers, functions, RLS policies) and is the only DDL you need to run for a fresh install. Paste it into the Supabase SQL editor, or run via psql:
   ```bash
   psql "$DATABASE_URL" -f supabase/migrations/00000000_initial_schema.sql
   ```
   The timestamped `2026MMDD_*.sql` files in `supabase/migrations/` are the historical forward migrations that produced this schema. You do **not** need to run them on a fresh install — the dump already reflects their end-state. Keep them for reference and for applying future schema changes.

4. **Load seed data.** Populates all 24 `dict_*` reference tables (military jargon, action verbs, MOS mappings, etc. — ~33k rows total) plus `admin_settings`:
   ```bash
   node scripts/seed-database.mjs
   ```
   The loader reads from `supabase/seed-data/dictionary-export/*.json` and `supabase/seed-data/admin-settings.json`. It uses the service role key from `.env.local` and runs idempotent upserts on `id`, so it's safe to re-run.

5. **Configure auth** to match `docs/auth-config.md`:
   - Set Site URL (Auth → URL Configuration).
   - Add redirect URLs (production + preview + `http://localhost:3000`).
   - Re-create email templates (Confirm signup, Magic link, Reset password, etc.).
   - Configure SMTP if you want custom sender domain.
   - Confirm only the providers listed in `docs/auth-config.md` are enabled.

6. **Verify RLS is enabled** on every user-data table (`profiles`, `resumes`, `usage_tracking`, etc.). The schema dump enables it, but double-check in Supabase dashboard → Authentication → Policies.

7. After setup, sign up at `/signup` to create your first user. Then set your UUID as `SUPER_ADMIN_USER_ID` in `.env.local` to access `/admin`.

### 4. (Optional) Configure Stripe

If you're enabling payments:

1. Create products and prices in Stripe dashboard → Products.
2. Copy the price IDs (`price_…`) into `STRIPE_CORE_PRICE_ID`, `STRIPE_FULL_PRICE_ID`, `STRIPE_EVAL_PACK_PRICE_ID`.
3. Create a webhook endpoint at Stripe → Developers → Webhooks pointing to `https://your-domain.com/api/webhooks/stripe`, subscribed to `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

### 5. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000.

## Deployment

Designed to deploy to Vercel. After configuring all env vars in the Vercel dashboard:

```bash
vercel
```

Set `NEXT_PUBLIC_APP_URL` to your production URL (e.g. `https://yourdomain.com`). The sitemap, OpenGraph metadata, structured data, and email links all derive from this.

## Security

See [SECURITY.md](./SECURITY.md) for pentest remediation notes and the responsible-disclosure policy.

When deploying, make sure:

- `.env.local` is never committed
- Service role keys are server-only (never `NEXT_PUBLIC_*`)
- RLS is enabled on every user-data table
- Stripe webhook signing is enforced (`STRIPE_WEBHOOK_SECRET` set)
- `UNSUBSCRIBE_SECRET` is at least 32 bytes of randomness

## License

See repository for license terms.
