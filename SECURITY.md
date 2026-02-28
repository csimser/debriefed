# Debriefed — Security Notes

## Penetration Test Remediation (Feb 28, 2026)

Based on pentest report findings against preview deployment.

### Fixes Applied in Code

| ID | Severity | Fix | File(s) |
|----|----------|-----|---------|
| M1 | Medium | Added Content-Security-Policy header | `next.config.ts` |
| M2 | Medium | HTML/script tag stripping on feedback input + type checks | `src/app/api/feedback/route.ts` |
| M3 | Medium | Fixed RLS recursion via `is_org_admin()` SECURITY DEFINER function | `supabase/migrations/20260228_fix_rls_recursion.sql` |
| I2 | Info | Server-side 302 redirects for protected routes in middleware | `src/middleware.ts` |

### Requires Supabase Dashboard Action

**L2 — Restrict Supabase OpenAPI Schema Exposure**

The Supabase REST API currently exposes the full OpenAPI schema (all table names and columns) to anyone with the anon key. To restrict this:

1. Go to **Supabase Dashboard → Settings → API**
2. Under "Schema", ensure only the `public` schema is exposed (default)
3. Consider creating a restricted `api` schema and moving only client-facing tables there
4. Alternatively, revoke `USAGE` on the `public` schema from the `anon` role for tables that should not be browsable:
   ```sql
   -- Example: revoke direct API access to sensitive tables
   REVOKE ALL ON public.email_logs FROM anon;
   REVOKE ALL ON public.activity_log FROM anon;
   REVOKE ALL ON public.api_usage FROM anon;
   ```

**Note:** RLS already blocks actual data access. Schema exposure is an information disclosure issue (Low severity), not a data breach risk.

### Intentional Decisions (No Fix Needed)

**I3 — Dictionary tables are intentionally public.** The `dict_*` tables (`dict_onet_crosswalk`, `dict_acronyms`, `dict_soft_skills`, `dict_ats_keywords`, `dict_missing_terms_log`) are public reference data used by the MOS translation feature. They contain no user data or sensitive information.

**L4 — robots.txt route disclosure.** The robots.txt `Disallow` entries reveal protected route paths. This is acceptable — security through obscurity is not worth the SEO/crawling tradeoffs, and all listed routes are auth-protected.

**I1 — Supabase anon key in client JS.** Expected behavior for Supabase client-side auth. RLS enforces access control, and the service role key is never exposed.

### Post-Launch Action Items

- [ ] Re-run pentest against production deployment (preview may differ from prod config)
- [ ] Apply Supabase dashboard schema restriction (L2) in production project
- [ ] Monitor `is_org_admin()` function performance under load
- [ ] Consider Redis-backed rate limiting for `/api/feedback` (current in-memory Map resets on cold starts)
