import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';
import { requireAuth, isAuthError } from '@/lib/apiAuth';

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await connectDB(); dbReady = true; }
}

/** GET all messages in one thread, chronological, scoped to the current employee's own mailbox. */
export async function GET(request: NextRequest, { params }: { params: Promise<{ threadId: string }> }) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  await ensureDB();

  const { threadId } = await params;

  const [account] = await sequelize.query<{ id: number }>(
    `SELECT id FROM dm_gmail_accounts WHERE employee_id = :employeeId LIMIT 1`,
    { replacements: { employeeId: auth.id }, type: QueryTypes.SELECT }
  );
  if (!account) {
    return NextResponse.json({ error: 'Gmail not connected' }, { status: 404 });
  }

  const messages = await sequelize.query(
    `SELECT id, gmail_message_id, gmail_thread_id, direction, from_email, from_name,
            to_emails, cc_emails, subject, snippet, body_html, body_text,
            has_attachments, matched_lead_id, message_timestamp
     FROM dm_gmail_messages
     WHERE account_id = :accountId AND gmail_thread_id = :threadId
     ORDER BY message_timestamp ASC`,
    { replacements: { accountId: account.id, threadId }, type: QueryTypes.SELECT }
  ) as Array<{ id: number; to_emails: string; cc_emails: string }>;

  const messageIds = messages.map(m => m.id);
  const attachments = messageIds.length
    ? await sequelize.query(
        `SELECT message_id, id, filename, mime_type, size_bytes, gmail_attachment_id
         FROM dm_gmail_attachments WHERE message_id IN (:messageIds)`,
        { replacements: { messageIds }, type: QueryTypes.SELECT }
      )
    : [];

  const parsed = messages.map(m => ({
    ...m,
    to_emails: JSON.parse(m.to_emails || '[]'),
    cc_emails: JSON.parse(m.cc_emails || '[]'),
  }));

  return NextResponse.json({ messages: parsed, attachments });
}
