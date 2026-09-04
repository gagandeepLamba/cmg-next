import { QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';
import { buildRawMessage } from './mime';
import { sendRawMessage, getMessage } from './gmail-api';
import { storeMessage } from './sync';
import type { OutboundAttachment } from './types';

export interface SendEmailParams {
  employeeId: number;
  mailboxEmail: string;
  to: string[];
  cc?: string[];
  subject: string;
  bodyHtml: string;
  attachments?: OutboundAttachment[];
  inReplyToGmailMessageId?: string;
  gmailThreadId?: string;
}

/**
 * Sends an email impersonating `mailboxEmail`. Callers MUST derive
 * employeeId/mailboxEmail from the verified session (requireAuth), never
 * from client-supplied request data — this is the one line standing
 * between "send as yourself" and "send as any employee in the company."
 */
export async function sendEmail(params: SendEmailParams): Promise<{ gmailMessageId: string; gmailThreadId: string }> {
  const [account] = await sequelize.query<{ id: number }>(
    `SELECT id FROM dm_gmail_accounts WHERE employee_id = :employeeId AND is_enabled = 1 LIMIT 1`,
    { replacements: { employeeId: params.employeeId }, type: QueryTypes.SELECT }
  );
  if (!account) {
    throw new Error('Gmail is not connected for this employee — enable it first');
  }

  let inReplyToRfcMessageId: string | null = null;
  let referencesRfcMessageIds: string[] = [];
  if (params.inReplyToGmailMessageId) {
    const [replied] = await sequelize.query<{ rfc_message_id: string | null }>(
      `SELECT rfc_message_id FROM dm_gmail_messages WHERE account_id = :accountId AND gmail_message_id = :gmailMessageId LIMIT 1`,
      { replacements: { accountId: account.id, gmailMessageId: params.inReplyToGmailMessageId }, type: QueryTypes.SELECT }
    );
    if (replied?.rfc_message_id) {
      inReplyToRfcMessageId = replied.rfc_message_id;
      referencesRfcMessageIds = [replied.rfc_message_id];
    }
  }

  const raw = await buildRawMessage({
    from: params.mailboxEmail,
    to: params.to,
    cc: params.cc,
    subject: params.subject,
    bodyHtml: params.bodyHtml,
    attachments: params.attachments,
    inReplyToRfcMessageId,
    referencesRfcMessageIds,
  });

  const result = await sendRawMessage(params.mailboxEmail, raw, params.gmailThreadId);

  // Immediately reflect the sent message — don't wait for the next sync tick.
  // A later sync discovering the same gmail_message_id is a harmless no-op
  // upsert via the unique key.
  const full = await getMessage(params.mailboxEmail, result.id);
  await storeMessage(account.id, params.mailboxEmail, full);

  if (params.attachments?.length) {
    const [messageRow] = await sequelize.query<{ id: number }>(
      `SELECT id FROM dm_gmail_messages WHERE account_id = :accountId AND gmail_message_id = :gmailMessageId LIMIT 1`,
      { replacements: { accountId: account.id, gmailMessageId: result.id }, type: QueryTypes.SELECT }
    );
    if (messageRow) {
      for (const att of params.attachments) {
        await sequelize.query(
          `INSERT IGNORE INTO dm_gmail_attachments (message_id, filename, mime_type, size_bytes, blob_url)
           VALUES (:messageId, :filename, :mimeType, :size, :blobUrl)`,
          {
            replacements: {
              messageId: messageRow.id, filename: att.filename,
              mimeType: att.mimeType, size: att.size, blobUrl: att.blobUrl,
            },
            type: QueryTypes.INSERT,
          }
        );
      }
    }
  }

  return { gmailMessageId: result.id, gmailThreadId: result.threadId };
}
