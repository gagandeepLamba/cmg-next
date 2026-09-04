# Gmail Integration — Full Inbox Mirror + Lead Activity Logging

## Overview

Every employee's Google Workspace mailbox (`@cwmigrationgroup.ae`) can be connected from inside the CRM — full Inbox + Sent mirror, compose/reply, and automatic logging onto the matching lead's activity timeline when correspondence matches a lead's email. Uses **domain-wide delegation**: one dedicated service account, authorized once by the Workspace super admin, then impersonates any employee's mailbox — no per-employee OAuth login, no per-employee token storage.

## Architecture Flow

```
Vercel Cron (every 10 min) → /api/cron/gmail-sync
        ↓
Signs a JWT (iss=service account, sub=employee's mailbox) → exchanges for an
access token that acts AS that employee, via Gmail API domain-wide delegation
        ↓
First sync: bounded backfill (messages.list, last N days, capped message count)
Later syncs: incremental (history.list from the stored historyId cursor)
        ↓
Each new message: upserted into dm_gmail_messages (INSERT IGNORE — a resync
of an already-known message is a harmless no-op)
        ↓
Counterparty email checked against the employee's own leads
(Counsilor/assignTo) → match → logLeadRemark() onto the lead's activity feed

Compose/Reply (employee-initiated) → /api/gmail/send
        ↓
MIME message hand-built, sent impersonating the sender's OWN mailbox only
(never client-supplied — derived from the verified session)
        ↓
Immediately stored + lead-matched in the same request (no waiting for the
next sync tick)
```

## Database Tables

Run the migration before using the integration:

```bash
mysql -u <user> -p <database> < migrations/20260905_gmail_integration.sql
```

- `dm_gmail_settings` — module-wide config (one row): enabled flag, backfill window/cap, sync batch size
- `dm_gmail_accounts` — per-employee mailbox connection + sync state (historyId cursor, backfill progress, last sync status/error)
- `dm_gmail_messages` — every synced message (Inbox + Sent), with `matched_lead_id` when the counterparty matches a lead
- `dm_gmail_attachments` — metadata only; inbound attachment bytes are fetched on-demand from Gmail, never stored

## Required Environment Variables

| Variable | Description |
|---|---|
| `GMAIL_SERVICE_ACCOUNT_EMAIL` | The **dedicated** Gmail service account's email — do not reuse the Search Console/Tag Manager one |
| `GMAIL_SERVICE_ACCOUNT_PRIVATE_KEY` | Its private key — paste with literal `\n` sequences, same as the JSON key file |
| `CRON_SECRET` | Already exists — reused, no separate secret |

## Google Cloud + Workspace Admin Setup

### Cloud Console
1. Enable the **Gmail API** on the GCP project.
2. **Create a new, dedicated service account** (e.g. `cmg-crm-gmail-sync`) — security segregation from the GSC/GTM service account.
3. Create + download a JSON key → `client_email` → `GMAIL_SERVICE_ACCOUNT_EMAIL`, `private_key` → `GMAIL_SERVICE_ACCOUNT_PRIVATE_KEY`.
4. Note the service account's **numeric OAuth2 Client ID** (not the email) from its Details page — Workspace Admin needs this, not the email address.

### Workspace Admin Console (super admin login required)
5. **Security → API controls → Domain-wide Delegation → Add new** → paste the Client ID → scopes:
   ```
   https://www.googleapis.com/auth/gmail.send,https://www.googleapis.com/auth/gmail.modify
   ```
   (`gmail.modify` is a superset of `gmail.readonly` — authorized now even though v1 doesn't use its write capability yet, to avoid a second admin-console round-trip later.)
6. Authorize. Propagation can take up to 24h (usually much faster).
7. Confirm each employee's `dm_employee.cemail`/`email` exactly matches their real Workspace mailbox — a mismatch here is the most common first-connect failure.

## Admin Panel

`/admin/gmail/settings` (requires `admin.access`): module enable/disable, backfill window/cap, sync batch size, "Sync Now" button, and a table of every employee's mailbox connection status (enable/disable/force-resync/test-connection per row).

Employees connect their own mailbox from `/admin/mail` — "connecting" is just a database flag flip (no OAuth redirect), since domain-wide delegation means the CRM can already act as any Workspace user once the admin steps above are done.

## Cron Configuration

Runs every 10 minutes via `vercel.json`:
```json
{ "path": "/api/cron/gmail-sync", "schedule": "*/10 * * * *" }
```
Each tick processes the least-recently-synced batch of enabled accounts (`employees_per_sync_tick`, default 20) — a self-balancing round-robin, so a broken/never-synced mailbox is always retried first on the next tick with no separate retry-queue table needed.

## Troubleshooting

### An employee's sync shows "Error" in the admin panel
Check the tooltip on the status badge for `last_sync_error`. Most common causes: (a) domain-wide delegation propagation hasn't finished yet (wait up to 24h after the Workspace Admin step), (b) the employee's `dm_employee.email`/`cemail` doesn't match a real mailbox on the delegated domain, (c) the authorized scopes don't cover what's being called.

### "Sync Now" times out or only processes some employees
The cron/on-demand sync has a bounded time budget (`maxDuration = 300` on the route) and a per-tick employee cap (`employees_per_sync_tick`) — a mailbox with a huge initial backfill can span multiple ticks by design (progress is checkpointed via `backfill_page_token`). Lower `employees_per_sync_tick` in Settings if ticks are timing out.

### `history.list` fails with a 404
Gmail's History API only retains history for a limited window (commonly ~7 days — verify current figure in Google's docs). The sync code automatically falls back to a bounded re-list and resets the cursor when this happens — no manual intervention needed, though very stale accounts (disabled for a long stretch) may re-ingest a small window of duplicate-looking messages, which the `UNIQUE (account_id, gmail_message_id)` key safely no-ops.

### Offboarding an employee
Disabling their account in `/admin/gmail/settings` only stops the CRM from polling their mailbox — it does **not** revoke Google-side access. Actual access revocation (suspending/removing their Workspace account) is a separate step on the Workspace admin's own offboarding checklist.

## Security Notes

- **No per-employee secrets exist** — domain-wide delegation means there are no OAuth refresh tokens to store or encrypt, only the one service account private key (env-var only, never DB-stored, never returned by any API response).
- **Send-path safety**: the impersonated mailbox on every send is derived strictly from the authenticated session (`requireAuth()`), never from client-supplied request data — one employee can never send as another.
- **Received HTML is sanitized** (`isomorphic-dompurify`) before rendering in the thread view — email bodies are attacker-influenced content from arbitrary external senders.
- **Attachment access is ownership-checked** — the download route verifies the requesting employee owns the account the message belongs to before proxying a fetch to Gmail.

## Deployment Checklist

- [ ] Run `migrations/20260905_gmail_integration.sql` on production database
- [ ] Set `GMAIL_SERVICE_ACCOUNT_EMAIL` / `GMAIL_SERVICE_ACCOUNT_PRIVATE_KEY` in production
- [ ] Complete Google Cloud setup (steps 1-4) and Workspace domain-wide delegation (steps 5-7)
- [ ] Enable the module in `/admin/gmail/settings`
- [ ] **Pilot with a handful of employees first** — enable their accounts, confirm sync + send + lead-matching work correctly, and get a real per-mailbox message-volume number before enabling the full roster (storage grows meaningfully at 100-mailbox scale — see the implementation plan's storage estimate)
- [ ] Confirm the `vercel.json` cron entry is picked up by Vercel's scheduler
- [ ] Roll out to remaining employees
