import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';
import { requireAuth, isAuthError } from '@/lib/apiAuth';
import { testGmailConnection } from '@/lib/gmail/gmail-api';

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await connectDB(); dbReady = true; }
}

/** GET verifies domain-wide delegation actually works for this specific employee's mailbox. */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(request, ['admin.access']);
  if (isAuthError(auth)) return auth;
  await ensureDB();

  const { id: employeeId } = await params;

  const [employee] = await sequelize.query<{ email: string | null; cemail: string | null }>(
    `SELECT email, cemail FROM dm_employee WHERE id = :employeeId LIMIT 1`,
    { replacements: { employeeId }, type: QueryTypes.SELECT }
  );
  const mailboxEmail = employee?.cemail || employee?.email;
  if (!mailboxEmail) {
    return NextResponse.json({ ok: false, message: 'Employee has no email on file' });
  }

  const result = await testGmailConnection(mailboxEmail);
  return NextResponse.json(result);
}
