/**
 * Matches an email address to a lead owned by a specific employee — mirrors
 * src/lib/duplicateLeadCheck.ts's findExistingLead(), scoped to the employee
 * ownership pattern used throughout src/app/api/leads/route.ts:
 * (l.Counsilor = :employeeId OR l.assignTo = :employeeId).
 */

import { QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';

export interface MatchedLead {
  id: number;
  fname: string | null;
  lname: string | null;
  email: string | null;
}

export async function findLeadForEmployeeByEmail(params: { employeeId: number; email: string | null }): Promise<MatchedLead | null> {
  const email = params.email?.trim().toLowerCase();
  if (!email) return null;

  const [lead] = await sequelize.query<MatchedLead>(
    `SELECT l.id, l.fname, l.lname, l.email
     FROM dmc_forum_leads l
     WHERE (l.Counsilor = :employeeId OR l.assignTo = :employeeId)
       AND LOWER(l.email) = :email
     ORDER BY l.id DESC
     LIMIT 1`,
    { replacements: { employeeId: params.employeeId, email }, type: QueryTypes.SELECT }
  );

  return lead ?? null;
}
