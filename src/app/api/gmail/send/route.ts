import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/sequelize';
import { requireAuth, isAuthError } from '@/lib/apiAuth';
import { sendEmail } from '@/lib/gmail/send';
import type { OutboundAttachment } from '@/lib/gmail/types';

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await connectDB(); dbReady = true; }
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  await ensureDB();

  const body = await request.json() as {
    to?: string[]; cc?: string[]; subject?: string; bodyHtml?: string;
    attachments?: OutboundAttachment[]; inReplyToGmailMessageId?: string; gmailThreadId?: string;
  };

  if (!body.to?.length || !body.subject || !body.bodyHtml) {
    return NextResponse.json({ error: 'to, subject and bodyHtml are required' }, { status: 400 });
  }

  try {
    const result = await sendEmail({
      // SECURITY: employeeId/mailboxEmail come only from the verified session —
      // never from the request body — so one employee can never send as another.
      employeeId: auth.id,
      mailboxEmail: auth.cemail || auth.email,
      to: body.to,
      cc: body.cc,
      subject: body.subject,
      bodyHtml: body.bodyHtml,
      attachments: body.attachments,
      inReplyToGmailMessageId: body.inReplyToGmailMessageId,
      gmailThreadId: body.gmailThreadId,
    });
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
