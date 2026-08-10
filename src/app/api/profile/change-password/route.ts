import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';
import { verifyToken, verifyPassword, hashPassword } from '@/lib/auth';
import { HRService } from '@/services/hr-service';

let dbReady = false;
const ensureDB = async () => { if (!dbReady) { await connectDB(); dbReady = true; } };

export async function POST(request: NextRequest) {
  await ensureDB();
  await HRService.ensureEmployeeCoreColumns();

  const token =
    request.cookies.get('auth-token')?.value ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const currentUser = token ? verifyToken(token) : null;
  if (!currentUser?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { currentPassword, newPassword } = await request.json().catch(() => ({}));
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Current and new password are required' }, { status: 400 });
  }
  if (String(newPassword).length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
  }

  const [row] = await sequelize.query<{ password: string | null }>(
    'SELECT password FROM dm_employee WHERE id = :userId LIMIT 1',
    { replacements: { userId: currentUser.id }, type: QueryTypes.SELECT }
  );

  const stored = row?.password ?? '';
  const md5Input = crypto.createHash('md5').update(currentPassword).digest('hex');
  let passwordOk = stored === currentPassword || stored === md5Input;
  if (!passwordOk && stored.startsWith('$2')) {
    passwordOk = await verifyPassword(currentPassword, stored).catch(() => false);
  }

  if (!passwordOk) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
  }

  const newHash = await hashPassword(newPassword);
  await sequelize.query(
    'UPDATE dm_employee SET password = :newHash, must_change_password = 0 WHERE id = :userId',
    { replacements: { newHash, userId: currentUser.id } }
  );

  return NextResponse.json({ success: true });
}
