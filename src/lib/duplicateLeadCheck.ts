import { QueryTypes } from 'sequelize';
import { sequelize } from './sequelize';
import { logLeadRemark } from './leadRemarks';

export function normalizePhone(phone: string | null | undefined): string {
  return String(phone || '').replace(/\D/g, '');
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  duplicateCount: number;
}

export interface ExistingLeadMatch {
  id: number;
  fname: string | null;
  lname: string | null;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  status: string | null;
  branch: number | null;
  ownerName: string | null;
  ownerId: number | null;
}

// Flags a new lead as a duplicate when its phone or email matches an existing
// lead already in dmc_forum_leads. duplicateCount = number of prior matches at
// creation time (the new lead itself isn't counted since it hasn't been
// inserted yet).
export async function checkForDuplicate({
  phone,
  email,
}: {
  phone?: string | null;
  email?: string | null;
}): Promise<DuplicateCheckResult> {
  const normalizedPhone = normalizePhone(phone);
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!normalizedPhone && !normalizedEmail) {
    return { isDuplicate: false, duplicateCount: 0 };
  }

  const conditions: string[] = [];
  const replacements: Record<string, unknown> = {};

  if (normalizedPhone) {
    conditions.push(
      `REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(COALESCE(phone,''), '+', ''), '-', ''), ' ', ''), '(', ''), ')', ''), '.', '') = :normalizedPhone`
    );
    replacements.normalizedPhone = normalizedPhone;
  }
  if (normalizedEmail) {
    conditions.push('LOWER(COALESCE(email,\'\')) = :normalizedEmail');
    replacements.normalizedEmail = normalizedEmail;
  }

  const [row] = await sequelize.query<{ total: number }>(
    `SELECT COUNT(*) AS total FROM dmc_forum_leads WHERE ${conditions.join(' OR ')}`,
    { replacements, type: QueryTypes.SELECT }
  );

  const duplicateCount = Number(row?.total || 0);
  return { isDuplicate: duplicateCount > 0, duplicateCount };
}

// Same match as checkForDuplicate, but returns the existing lead's own
// details (and current owner) so the caller can point the requester at who
// to ask for a transfer, instead of just a yes/no flag.
export async function findExistingLead({
  phone,
  email,
}: {
  phone?: string | null;
  email?: string | null;
}): Promise<ExistingLeadMatch | null> {
  const normalizedPhone = normalizePhone(phone);
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!normalizedPhone && !normalizedEmail) return null;

  const conditions: string[] = [];
  const replacements: Record<string, unknown> = {};

  if (normalizedPhone) {
    conditions.push(
      `REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(COALESCE(l.phone,''), '+', ''), '-', ''), ' ', ''), '(', ''), ')', ''), '.', '') = :normalizedPhone`
    );
    replacements.normalizedPhone = normalizedPhone;
  }
  if (normalizedEmail) {
    conditions.push('LOWER(COALESCE(l.email,\'\')) = :normalizedEmail');
    replacements.normalizedEmail = normalizedEmail;
  }

  const [row] = await sequelize.query<ExistingLeadMatch>(
    `SELECT l.id, l.fname, l.lname, l.email, l.phone, l.mobile, l.status, l.branch, e.name AS ownerName, l.assignTo AS ownerId
     FROM dmc_forum_leads l
     LEFT JOIN dm_employee e ON e.id = l.assignTo
     WHERE ${conditions.join(' OR ')}
     ORDER BY l.id DESC
     LIMIT 1`,
    { replacements, type: QueryTypes.SELECT }
  );

  return row || null;
}

// Logs a remark on the existing lead noting that someone else tried to add it
// again, so its owner/managers can see the re-enquiry in the lead's activity
// history. Called from both the live check-as-you-type endpoint and the
// submit-time 409 block, so it de-dupes: skipped if the same actor already
// logged this exact lead within the last 10 minutes (debounced typing can
// otherwise trigger the lookup repeatedly for the same person).
export async function recordDuplicateLeadAttempt({
  existingLead,
  actorId,
  actorRole,
}: {
  existingLead: ExistingLeadMatch;
  actorId: number;
  actorRole?: string | null;
}): Promise<void> {
  try {
    const [recent] = await sequelize.query<{ id: number }>(
      `SELECT id FROM dm_remarks
       WHERE lead_id = :leadId AND actor_id = :actorId AND action = 'duplicate_detected'
         AND created_at > (NOW() - INTERVAL 10 MINUTE)
       LIMIT 1`,
      { replacements: { leadId: existingLead.id, actorId }, type: QueryTypes.SELECT }
    );
    if (recent) return;

    const [actorRow] = await sequelize.query<{ name: string }>(
      'SELECT name FROM dm_employee WHERE id = :id LIMIT 1',
      { replacements: { id: actorId }, type: QueryTypes.SELECT }
    );
    const actorLabel = `${actorRow?.name || `Employee #${actorId}`}${actorRole ? ` (${actorRole})` : ''}`;
    const ownerLabel = existingLead.ownerName
      ? `, currently owned by ${existingLead.ownerName}.`
      : ', and is currently unassigned.';

    await logLeadRemark({
      leadId: existingLead.id,
      action: 'duplicate_detected',
      remark: `A lead with this email or phone already exists (Lead #${existingLead.id})${ownerLabel} ${actorLabel} attempted to add this lead again.`,
      actorId,
      actorRole: actorRole ?? null,
    });
  } catch (error) {
    console.error('Failed to log duplicate-lead remark:', error);
  }
}
