import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';
import { requireAuth, isAuthError } from '@/lib/apiAuth';
import { sanitizePrefs } from '@/lib/tablePrefs';

// Per-employee UI preferences (currently: which columns a list shows). Always
// scoped to the signed-in employee - there is no way to read or write another
// person's layout. Keys are restricted to "<table>.columns" and the stored
// value is re-validated, so the table can't be used as general storage.
//
// If the table doesn't exist yet (migration 20261022 not applied) the routes
// answer "not persisted" instead of failing, and the browser keeps the layout
// in its own storage until the migration is applied.

const KEY_PATTERN = /^[a-z0-9_-]{1,40}\.columns$/;

function isMissingTable(error: unknown): boolean {
  const message = String((error as { message?: string })?.message || '');
  return /crm_user_preferences/.test(message) && /doesn't exist|does not exist|no such table|ER_NO_SUCH_TABLE/i.test(message);
}

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;

  const key = new URL(request.url).searchParams.get('key') || '';
  if (!KEY_PATTERN.test(key)) return NextResponse.json({ error: 'Invalid preference key' }, { status: 400 });

  try {
    const [row] = await sequelize.query<{ pref_value: string }>(
      'SELECT pref_value FROM crm_user_preferences WHERE employee_id = :employeeId AND pref_key = :key LIMIT 1',
      { replacements: { employeeId: auth.id, key }, type: QueryTypes.SELECT },
    );
    return NextResponse.json({ data: { value: row ? sanitizePrefs(row.pref_value) : null, persisted: true } });
  } catch (error) {
    if (isMissingTable(error)) return NextResponse.json({ data: { value: null, persisted: false } });
    console.error('Error reading user preference:', error);
    return NextResponse.json({ error: 'Failed to load preference' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;

  let body: { key?: unknown; value?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const key = typeof body.key === 'string' ? body.key : '';
  if (!KEY_PATTERN.test(key)) return NextResponse.json({ error: 'Invalid preference key' }, { status: 400 });

  // null = "back to the default layout": remove the row.
  const value = body.value === null ? null : sanitizePrefs(body.value);
  if (body.value !== null && !value) return NextResponse.json({ error: 'Invalid column layout' }, { status: 422 });

  try {
    if (value === null) {
      await sequelize.query(
        'DELETE FROM crm_user_preferences WHERE employee_id = :employeeId AND pref_key = :key',
        { replacements: { employeeId: auth.id, key } },
      );
    } else {
      await sequelize.query(
        `INSERT INTO crm_user_preferences (employee_id, pref_key, pref_value)
         VALUES (:employeeId, :key, :value)
         ON DUPLICATE KEY UPDATE pref_value = VALUES(pref_value)`,
        { replacements: { employeeId: auth.id, key, value: JSON.stringify(value) } },
      );
    }
    return NextResponse.json({ data: { value, persisted: true } });
  } catch (error) {
    if (isMissingTable(error)) return NextResponse.json({ data: { value, persisted: false } });
    console.error('Error saving user preference:', error);
    return NextResponse.json({ error: 'Failed to save preference' }, { status: 500 });
  }
}
