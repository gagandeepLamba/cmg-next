/**
 * Sync jobs for the Gmail integration. Shared by the /api/cron/gmail-sync
 * route and the admin "Sync now" button — mirrors src/lib/meta/campaign-sync.ts
 * and src/lib/google/gsc-sync.ts.
 */

import { QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';
import { listMessages, getMessage, listHistory, getProfile } from './gmail-api';
import { parseMessage } from './mime';
import { findLeadForEmployeeByEmail } from './lead-match';
import { logLeadRemark } from '@/lib/leadRemarks';
import type { GmailMessageResource } from './types';

interface GmailAccountRow {
  id: number;
  employee_id: number;
  mailbox_email: string;
  history_id: string | null;
  backfill_page_token: string | null;
  backfill_message_count: number;
  initial_backfill_completed_at: string | null;
}

interface GmailSettingsRow {
  is_enabled: number;
  backfill_days: number;
  backfill_message_cap: number;
  employees_per_sync_tick: number;
}

async function getSettings(): Promise<GmailSettingsRow | null> {
  const [settings] = await sequelize.query<GmailSettingsRow>(
    `SELECT is_enabled, backfill_days, backfill_message_cap, employees_per_sync_tick FROM dm_gmail_settings WHERE id = 1 LIMIT 1`,
    { type: QueryTypes.SELECT }
  );
  return settings ?? null;
}

function backfillDateFilter(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `after:${y}/${m}/${day}`;
}

function toMysqlDatetime(ms: number): string {
  return new Date(ms).toISOString().slice(0, 19).replace('T', ' ');
}

/**
 * Upserts one fetched message. Returns whether it was a genuinely NEW row
 * (INSERT IGNORE reports affectedRows=0 when the unique key already existed,
 * so a resync of a known message never re-triggers lead matching / logging).
 */
async function storeMessage(accountId: number, mailboxEmail: string, resource: GmailMessageResource): Promise<boolean> {
  const parsed = parseMessage(resource);
  const direction = (resource.labelIds ?? []).includes('SENT') ? 'outbound' : 'inbound';
  const timestamp = resource.internalDate ? Number(resource.internalDate) : Date.now();

  const [, affectedRows] = await sequelize.query(
    `INSERT IGNORE INTO dm_gmail_messages
       (account_id, gmail_message_id, gmail_thread_id, rfc_message_id, direction,
        from_email, from_name, to_emails, cc_emails, subject, snippet,
        body_text, body_html, has_attachments, labels, message_timestamp)
     VALUES
       (:accountId, :gmailMessageId, :gmailThreadId, :rfcMessageId, :direction,
        :fromEmail, :fromName, :toEmails, :ccEmails, :subject, :snippet,
        :bodyText, :bodyHtml, :hasAttachments, :labels, :messageTimestamp)`,
    {
      replacements: {
        accountId,
        gmailMessageId: resource.id,
        gmailThreadId: resource.threadId,
        rfcMessageId: parsed.rfcMessageId,
        direction,
        fromEmail: parsed.fromEmail,
        fromName: parsed.fromName,
        toEmails: JSON.stringify(parsed.toEmails),
        ccEmails: JSON.stringify(parsed.ccEmails),
        subject: parsed.subject,
        snippet: resource.snippet ?? null,
        bodyText: parsed.bodyText,
        bodyHtml: parsed.bodyHtml,
        hasAttachments: parsed.attachments.length > 0 ? 1 : 0,
        labels: JSON.stringify(resource.labelIds ?? []),
        messageTimestamp: toMysqlDatetime(timestamp),
      },
      type: QueryTypes.INSERT,
    }
  ) as unknown as [number, number];

  const isNew = affectedRows > 0;
  if (!isNew) return false;

  const [messageRow] = await sequelize.query<{ id: number }>(
    `SELECT id FROM dm_gmail_messages WHERE account_id = :accountId AND gmail_message_id = :gmailMessageId LIMIT 1`,
    { replacements: { accountId, gmailMessageId: resource.id }, type: QueryTypes.SELECT }
  );
  if (!messageRow) return true;

  if (parsed.attachments.length > 0) {
    for (const att of parsed.attachments) {
      await sequelize.query(
        `INSERT IGNORE INTO dm_gmail_attachments (message_id, gmail_attachment_id, filename, mime_type, size_bytes)
         VALUES (:messageId, :attachmentId, :filename, :mimeType, :size)`,
        {
          replacements: {
            messageId: messageRow.id, attachmentId: att.attachmentId,
            filename: att.filename, mimeType: att.mimeType, size: att.size,
          },
          type: QueryTypes.INSERT,
        }
      );
    }
  }

  // Lead matching — only checked on a genuinely new message. Cc/Bcc
  // deliberately excluded to avoid over-attributing group mail to a lead.
  const [employee] = await sequelize.query<{ employee_id: number }>(
    `SELECT employee_id FROM dm_gmail_accounts WHERE id = :accountId LIMIT 1`,
    { replacements: { accountId }, type: QueryTypes.SELECT }
  );
  const employeeId = employee?.employee_id;
  if (!employeeId) return true;

  const counterpartyEmail = direction === 'inbound' ? parsed.fromEmail : (parsed.toEmails[0] ?? null);
  const match = await findLeadForEmployeeByEmail({ employeeId, email: counterpartyEmail });
  if (match) {
    await sequelize.query(
      `UPDATE dm_gmail_messages SET matched_lead_id = :leadId WHERE id = :messageId`,
      { replacements: { leadId: match.id, messageId: messageRow.id }, type: QueryTypes.UPDATE }
    );
    const label = direction === 'inbound'
      ? `Email received from ${parsed.fromName || parsed.fromEmail || 'unknown sender'}${parsed.fromEmail ? ` <${parsed.fromEmail}>` : ''}: "${parsed.subject || '(no subject)'}" — ${resource.snippet ?? ''}`
      : `Email sent to ${counterpartyEmail ?? 'unknown recipient'}: "${parsed.subject || '(no subject)'}" — ${resource.snippet ?? ''}`;
    await logLeadRemark({
      leadId: match.id,
      action: direction === 'inbound' ? 'email_received' : 'email_sent',
      remark: label,
      actorId: employeeId,
      actorRole: null,
    });
  }

  return true;
}

async function markAccountResult(accountId: number, status: 'ok' | 'error', error?: string): Promise<void> {
  await sequelize.query(
    `UPDATE dm_gmail_accounts
     SET last_synced_at = NOW(), last_sync_status = :status, last_sync_error = :error
     WHERE id = :accountId`,
    { replacements: { accountId, status, error: error ?? null }, type: QueryTypes.UPDATE }
  );
}

/** Bounded initial backfill — resumes across ticks via a persisted page token. */
async function runBackfill(account: GmailAccountRow, settings: GmailSettingsRow): Promise<void> {
  const list = await listMessages(account.mailbox_email, {
    query: backfillDateFilter(settings.backfill_days),
    pageToken: account.backfill_page_token ?? undefined,
    maxResults: 50,
  });

  let count = account.backfill_message_count;
  for (const item of list.messages ?? []) {
    const full = await getMessage(account.mailbox_email, item.id);
    await storeMessage(account.id, account.mailbox_email, full);
    count++;
    if (count >= settings.backfill_message_cap) break;
  }

  const capReached = count >= settings.backfill_message_cap;
  const done = capReached || !list.nextPageToken;

  if (done) {
    const profile = await getProfile(account.mailbox_email);
    await sequelize.query(
      `UPDATE dm_gmail_accounts
       SET backfill_message_count = :count, backfill_page_token = NULL,
           initial_backfill_completed_at = NOW(), history_id = :historyId
       WHERE id = :accountId`,
      { replacements: { count, historyId: profile.historyId ?? null, accountId: account.id }, type: QueryTypes.UPDATE }
    );
  } else {
    await sequelize.query(
      `UPDATE dm_gmail_accounts SET backfill_message_count = :count, backfill_page_token = :pageToken WHERE id = :accountId`,
      { replacements: { count, pageToken: list.nextPageToken ?? null, accountId: account.id }, type: QueryTypes.UPDATE }
    );
  }
}

/** Steady-state incremental sync via Gmail's History API. */
async function runIncremental(account: GmailAccountRow): Promise<void> {
  if (!account.history_id) {
    // No cursor somehow — treat as needing a fresh baseline rather than erroring.
    const profile = await getProfile(account.mailbox_email);
    await sequelize.query(
      `UPDATE dm_gmail_accounts SET history_id = :historyId WHERE id = :accountId`,
      { replacements: { historyId: profile.historyId ?? null, accountId: account.id }, type: QueryTypes.UPDATE }
    );
    return;
  }

  let pageToken: string | undefined;
  let latestHistoryId = account.history_id;

  try {
    do {
      const history = await listHistory(account.mailbox_email, account.history_id, pageToken);
      for (const record of history.history ?? []) {
        for (const added of record.messagesAdded ?? []) {
          const full = await getMessage(account.mailbox_email, added.message.id);
          await storeMessage(account.id, account.mailbox_email, full);
        }
      }
      if (history.historyId) latestHistoryId = history.historyId;
      pageToken = history.nextPageToken;
    } while (pageToken);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('404')) {
      // historyId aged out of Gmail's retention window — fall back to a
      // bounded re-list rather than erroring indefinitely.
      const list = await listMessages(account.mailbox_email, { query: 'newer_than:7d', maxResults: 50 });
      for (const item of list.messages ?? []) {
        const full = await getMessage(account.mailbox_email, item.id);
        await storeMessage(account.id, account.mailbox_email, full);
      }
      const profile = await getProfile(account.mailbox_email);
      latestHistoryId = profile.historyId ?? latestHistoryId;
    } else {
      throw err;
    }
  }

  await sequelize.query(
    `UPDATE dm_gmail_accounts SET history_id = :historyId WHERE id = :accountId`,
    { replacements: { historyId: latestHistoryId, accountId: account.id }, type: QueryTypes.UPDATE }
  );
}

export async function syncAccount(accountId: number): Promise<void> {
  const settings = await getSettings();
  if (!settings) return;

  const [account] = await sequelize.query<GmailAccountRow>(
    `SELECT id, employee_id, mailbox_email, history_id, backfill_page_token,
            backfill_message_count, initial_backfill_completed_at
     FROM dm_gmail_accounts WHERE id = :accountId AND is_enabled = 1 LIMIT 1`,
    { replacements: { accountId }, type: QueryTypes.SELECT }
  );
  if (!account) return;

  try {
    if (!account.initial_backfill_completed_at) {
      await runBackfill(account, settings);
    } else {
      await runIncremental(account);
    }
    await markAccountResult(accountId, 'ok');
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Gmail Sync] Account ${accountId} failed:`, msg);
    await markAccountResult(accountId, 'error', msg);
  }
}

export type SyncAllResult = { skipped: true; reason: string } | { skipped: false; processed: number };

/** Cron entry point. Processes the least-recently-synced enabled accounts first. */
export async function syncAllAccounts(): Promise<SyncAllResult> {
  const settings = await getSettings();
  if (!settings?.is_enabled) {
    return { skipped: true, reason: 'Gmail integration is disabled' };
  }

  const accounts = await sequelize.query<{ id: number }>(
    `SELECT id FROM dm_gmail_accounts
     WHERE is_enabled = 1
     ORDER BY last_synced_at IS NULL DESC, last_synced_at ASC
     LIMIT :limit`,
    { replacements: { limit: settings.employees_per_sync_tick }, type: QueryTypes.SELECT }
  );

  for (const { id } of accounts) {
    await syncAccount(id);
  }

  await sequelize.query(`UPDATE dm_gmail_settings SET last_cron_run_at = NOW() WHERE id = 1`, { type: QueryTypes.UPDATE });

  return { skipped: false, processed: accounts.length };
}

export { storeMessage };
