# Supabase Auth Configuration Snapshot

Captured: 2026-05-20T18:42:04.425Z
Source: `https://your-project-ref.supabase.co`
GoTrue version: v2.189.0

## Captured via service role key (`/auth/v1/settings`)

### Enabled providers
- `email`

### Signup behaviour
| Setting | Value |
|---|---|
| disable_signup | false |
| mailer_autoconfirm | false |
| phone_autoconfirm | false |
| anonymous_users | false |

### Other
| Setting | Value |
|---|---|
| sms_provider | twilio |
| saml_enabled | false |
| passkeys_enabled | false |

### Users
Total auth.users rows: **166**

## NOT captured here — copy manually from Supabase dashboard before deletion

The service role key cannot read these. Grab them from
`Dashboard → Authentication → URL Configuration` and `Dashboard → Authentication → Email Templates`:

- [ ] **Site URL** — e.g. `https://debriefed.com`
- [ ] **Additional Redirect URLs** — full list (production + preview + localhost)
- [ ] **JWT expiry** (default 3600s) — Auth → Settings
- [ ] **Refresh token rotation enabled?** — Auth → Settings
- [ ] **Email templates** (Confirm, Magic link, Invite, Reset password, Email change)
  - Subject lines
  - HTML bodies
  - Variables / branding
- [ ] **SMTP custom sender** — if a custom SMTP is set (Auth → Settings → SMTP Settings), copy host/port/user/sender address (do **not** export password — rotate on restore).
- [ ] **Rate limits** — token refresh / sign-in / OTP requests per hour (Auth → Rate Limits)
- [ ] **Hooks** — any auth hooks (signup, after-login, etc.) configured under Auth → Hooks
- [ ] **MFA factors enabled** — TOTP, phone, etc. (Auth → Multi-factor)

## Raw settings JSON

```json
{
  "external": {
    "anonymous_users": false,
    "apple": false,
    "azure": false,
    "bitbucket": false,
    "discord": false,
    "facebook": false,
    "snapchat": false,
    "figma": false,
    "fly": false,
    "github": false,
    "gitlab": false,
    "google": false,
    "keycloak": false,
    "kakao": false,
    "linkedin": false,
    "linkedin_oidc": false,
    "notion": false,
    "spotify": false,
    "slack": false,
    "slack_oidc": false,
    "workos": false,
    "twitch": false,
    "twitter": false,
    "email": true,
    "phone": false,
    "zoom": false
  },
  "disable_signup": false,
  "mailer_autoconfirm": false,
  "phone_autoconfirm": false,
  "sms_provider": "twilio",
  "saml_enabled": false,
  "passkeys_enabled": false
}
```

## Restore procedure (after creating new Supabase project)

1. Set **Site URL** to the value captured above.
2. Add all **Redirect URLs** captured above.
3. Re-create email templates from copies above.
4. Configure SMTP (use a fresh password).
5. Match rate limits and JWT expiry.
6. Confirm only the providers listed above are enabled.
7. Re-create any auth hooks.
