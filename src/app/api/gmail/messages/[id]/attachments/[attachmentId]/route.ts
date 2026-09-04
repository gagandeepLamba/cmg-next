import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';
import { requireAuth, isAuthError } from '@/lib/apiAuth';
import { getAttachment } from '@/lib/gmail/gmail-api';

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await connectDB(); dbReady = true; }
}

/** GET fetches an inbound attachment's bytes on demand from Gmail — never persisted locally. */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string; attachmentId: string }> }) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  await ensureDB();

  const { id, attachmentId } = await params;

  const [row] = await sequelize.query<{
    gmail_message_id: string; mailbox_email: string; employee_id: number;
    filename: string | null; mime_type: string | null;
  }>(
    `SELECT m.gmail_message_id, a.mailbox_email, a.employee_id, att.filename, att.mime_type
     FROM dm_gmail_attachments att
     JOIN dm_gmail_messages m ON m.id = att.message_id
     JOIN dm_gmail_accounts a ON a.id = m.account_id
     WHERE att.message_id = :messageId AND att.gmail_attachment_id = :attachmentId
     LIMIT 1`,
    { replacements: { messageId: id, attachmentId }, type: QueryTypes.SELECT }
  );

  if (!row || row.employee_id !== auth.id) {
    return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });
  }

  const attachment = await getAttachment(row.mailbox_email, row.gmail_message_id, attachmentId);
  const bytes = Buffer.from(attachment.data, 'base64url');

  return new NextResponse(bytes, {
    headers: {
      'Content-Type': row.mime_type || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${(row.filename || 'attachment').replace(/"/g, '')}"`,
      'Content-Length': String(bytes.length),
    },
  });
}
