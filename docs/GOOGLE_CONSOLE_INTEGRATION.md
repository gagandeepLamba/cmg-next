# Google Search Console + Tag Manager → CRM Dashboard

## Overview

Mirrors Search Console (search performance, indexing/coverage, sitemaps) and Tag Manager (tags, triggers, publish history) data inside the CRM admin panel, CEO-only, so the Google consoles don't need to be opened separately. Read-only — nothing here can edit anything on the Google side.

## Architecture Flow

```
Vercel Cron (daily) → /api/cron/gsc-sync
        ↓
Service account JWT exchanged for an access token
        ↓
Search Analytics API + Sitemaps API + URL Inspection API (curated pages only)
        ↓
Upserted into dm_gsc_search_performance / dm_gsc_sitemaps / dm_gsc_coverage
        ↓
Admin dashboard reads the cached tables — never calls Google live per page view

Vercel Cron (12h backstop) or "Sync Now" button → /api/cron/gtm-sync or /api/admin/google-console/sync-gtm
        ↓
Tag Manager API: live (published) container version → tags + triggers
        ↓
Upserted into dm_gtm_tags_cache / dm_gtm_triggers_cache / dm_gtm_version_history
```

## Database Tables

Run the migration before using the integration:

```bash
mysql -u <user> -p <database> < migrations/20260904_google_console_integration.sql
```

Tables created:
- `dm_google_settings` — integration configuration (one row)
- `dm_gsc_search_performance` — cached daily search performance rows
- `dm_gsc_tracked_pages` — CEO-curated list of pages to check indexing status for
- `dm_gsc_coverage` — latest indexing/coverage result per tracked page
- `dm_gsc_sitemaps` — cached sitemap submission status
- `dm_gtm_tags_cache` / `dm_gtm_triggers_cache` — cached live container tags/triggers
- `dm_gtm_version_history` — cached publish/version history

## Required Environment Variables

| Variable | Description |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | The service account's email (from the downloaded JSON key's `client_email`) |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | The service account's private key (`private_key` field) — paste with literal `\n` sequences |
| `CRON_SECRET` | Already exists for Meta Lead Ads — reused here, no separate secret needed |

## Google Cloud Setup

### 1. Create/select a project
Go to [console.cloud.google.com](https://console.cloud.google.com), create or reuse a project.

### 2. Enable APIs
**APIs & Services → Library**, enable:
- **Google Search Console API**
- **Tag Manager API**

### 3. Create a service account
**APIs & Services → Credentials → Create Credentials → Service Account.** Name it e.g. `cmg-crm-google-readonly`. No project-level IAM role is required — access is granted at the resource level in steps 5–6.

### 4. Create and download a JSON key
Service Account → Keys → Add Key → Create new key → JSON. Contains `client_email` and `private_key` — these become the two env vars above. Never commit this file.

### 5. Grant Search Console access
Search Console (search.google.com/search-console) → select the property → **Settings → Users and permissions → Add user** → paste the service account's email → grant **Full** or **Restricted** (read-only is fine, this integration never writes).

### 6. Grant Tag Manager access
Tag Manager (tagmanager.google.com) → **Admin → Account → User Management → Add user** → paste the service account's email → grant **Read** at the container level.

### 7. Record the identifiers for Settings
- **GSC Site URL** — exactly as shown in the property selector. Note whether it's a **Domain property** (`sc-domain:example.com`) or a **URL-prefix property** (`https://www.example.com/`) — the API's `siteUrl` parameter must match this exactly or every call 403s even with correct access.
- **GTM Account ID** and **Container ID** — visible in Tag Manager admin URLs / Container Settings.
- **GTM Public Container ID** (`GTM-XXXXXXX`) — the string used in the site's install snippet, for the health-check.

## Admin Panel

Access via sidebar **Google Search Console & Tag Manager** section (CEO-only):

| Route | Description |
|---|---|
| `/admin/google-console` | Dashboard: 7/28-day stats, top queries/pages, coverage summary, latest publish, install health-check badge |
| `/admin/google-console/search-performance` | Full search performance table, filterable by query/page and date range |
| `/admin/google-console/coverage` | Tracked-pages management (add/remove URLs) + indexing status + sitemaps |
| `/admin/google-console/gtm` | Live tags and triggers |
| `/admin/google-console/gtm/versions` | Publish/version history |
| `/admin/google-console/settings` | Integration settings + connection tests |

## Cron Configuration (Vercel-only)

This app is hosted on Vercel — scheduled work runs via `vercel.json` cron hitting the `/api/cron/*` routes (protected by `CRON_SECRET`), the same as the Meta Lead Ads integration. There is no self-hosted/VPS branch to configure — in-process timers (`node-cron`) don't reliably survive on Vercel's serverless functions, which is why this integration doesn't use them.

```json
{ "path": "/api/cron/gsc-sync", "schedule": "0 6 * * *" },
{ "path": "/api/cron/gtm-sync", "schedule": "0 */12 * * *" }
```

- **GSC** syncs daily — Search Analytics data has a 2-3 day reporting lag, so more frequent syncing just re-fetches the same numbers.
- **GTM** syncs primarily via the "Sync Now" button (config only changes when someone edits and publishes) — the 12h cron is a backstop in case nobody clicks it.

## Troubleshooting

### Every API call returns 403 despite the service account having access
Almost always a `site_url` mismatch — the property is a **Domain property** (`sc-domain:...`) but the value saved in Settings is a URL-prefix form, or vice versa. Copy the exact string from the Search Console property selector dropdown.

### Coverage/indexing shows "Not checked" for a tracked page
`syncTrackedPageCoverage()` only runs on the daily GSC cron (or when "Sync GSC Now" is clicked) — it won't backfill immediately after adding a page. Google's URL Inspection API is also rate-limited (documented quota, keep the tracked-pages list short — a handful of key pages, not the whole site).

### "No matching coverage report" / can't see the full Coverage report from Search Console's UI
Expected — Google has no bulk coverage API. This dashboard only reflects the curated `dm_gsc_tracked_pages` list, not a full-site crawl mirror.

### GTM health-check shows "not detected" even though the tag is installed
The check fetches the site's raw HTML and looks for the `GTM-XXXXXXX` string — if the snippet loads via client-side JS injection rather than being present in the initial server-rendered HTML, or `gtm_container_public_id` in Settings doesn't match the live container, this will false-negative. It's a presence check only, not a firing-verification tool (that needs GTM's Preview mode).

### Invalid JWT / token exchange failing
Usually the private key wasn't converted from literal `\n` sequences correctly, or extra whitespace got introduced when pasting into the hosting platform's env var UI. Re-paste directly from the downloaded JSON file's `private_key` field.

## Security Notes

- **Secrets never leave the server** — `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` is only read server-side and never returned by any API response.
- **CEO-only** — every route explicitly checks `isCeo()` in addition to authentication, since CEO shares its role `type` with Director/Founder/Super Admin and a permission array alone can't distinguish them.
- **Read-only** — this integration only ever calls Google's read/list endpoints, never anything that modifies Search Console or Tag Manager configuration.

## Deployment Checklist

- [ ] Run `migrations/20260904_google_console_integration.sql` on production database
- [ ] Set `GOOGLE_SERVICE_ACCOUNT_EMAIL` / `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` in production
- [ ] Deploy the application (Vercel auto-deploys on push)
- [ ] Complete Google Cloud setup (steps 1-7 above) and confirm the service account has access to both the GSC property and the GTM container
- [ ] Enter the site URL and GTM account/container IDs in `/admin/google-console/settings`, enable the integration
- [ ] Run "Test Search Console Connection" and "Test Tag Manager Connection"
- [ ] Add a few key pages in `/admin/google-console/coverage`
- [ ] Click "Sync GSC Now" / "Sync GTM Now" and verify data appears on the dashboard
- [ ] Confirm the cron entries exist in `vercel.json` and are picked up by Vercel's cron scheduler
