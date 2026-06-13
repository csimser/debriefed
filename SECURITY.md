# Debriefed — Security Notes

## Current architecture (June 2026)

Debriefed has **no backend**: no database, no accounts, no server-side API. The
attack surface is correspondingly small, and the security model is:

- **User data** lives in the browser's localStorage only. Nothing is
  transmitted to or stored on any Debriefed-operated server (there are none —
  the site is static files on GitHub Pages).
- **The Anthropic API key** is supplied by the user, stored under a dedicated
  localStorage key, **excluded from data exports**, and sent only to
  `api.anthropic.com` directly from the browser.
- **Content-Security-Policy** is set via a `<meta>` tag (static hosting cannot
  set headers): scripts self-only, `connect-src` restricted to self,
  `api.anthropic.com`, `raw.githubusercontent.com` (data auto-update), and
  Google Fonts. No third-party scripts, no analytics.
- **PII screening** (SSN/DODID patterns) runs client-side before document text
  is sent to Anthropic for AI parsing.
- **Data auto-update** fetches JSON from this repo over HTTPS with an
  all-or-nothing install; a compromised update could only alter dictionary
  *data*, not code.

### Residual risks to be aware of

1. **XSS ⇒ key theft.** Any successful script injection could read the stored
   API key. Mitigations: meta-CSP, zero third-party scripts, dependency review.
   Users should only run builds from getdebriefed.co or official GitHub
   Releases (the app says so in Settings).
2. **Modified redistributions.** Anyone can fork and rebuild (MIT). The Terms
   prohibit misrepresenting modified builds as official; users are pointed at
   official sources.
3. **Shared computers.** localStorage is per-browser-profile and unencrypted
   at the application layer. The in-app guidance tells users on government or
   shared machines to use private browsing and export/clear their data.

Report vulnerabilities via GitHub Issues or the support email.

---

## Historical: Penetration Test Remediation (Feb 28, 2026)

Findings against the old Supabase/Vercel deployment. Kept for the record; the
components involved (Supabase RLS, API routes, middleware, server CSP headers)
were all removed in the zero-backend migration of June 2026.

| ID | Severity | Fix at the time |
|----|----------|-----------------|
| M1 | Medium | CSP header in `next.config.ts` (now a meta tag) |
| M2 | Medium | HTML stripping on `/api/feedback` (route removed) |
| M3 | Medium | RLS recursion fix via `is_org_admin()` (Supabase removed) |
| I2 | Info | Middleware auth redirects (middleware removed) |
| L2/I3/I1/L4 | Low/Info | Supabase schema exposure & related (Supabase removed) |
