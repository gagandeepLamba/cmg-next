import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';
import { verifyToken } from '@/lib/auth';

let dbReady = false;
const ensureDB = async () => { if (!dbReady) { await connectDB(); dbReady = true; } };

/**
 * Full history of "Counselor Conversation Summary" entries recorded during
 * lead-to-opportunity conversion and case-note updates. Queried by leadId
 * (always populated) rather than opportunityId (nullable), so this works
 * from every page that only has the lead id on hand (Client list, Operations
 * list) as well as ones that have the opportunity id (Lead/Opportunity list).
 */
export async function GET(request: NextRequest) {
  const token =
    request.cookies.get('auth-token')?.value ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await ensureDB();

  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get('leadId');
  const opportunityId = searchParams.get('opportunityId');

  if (!leadId && !opportunityId) {
    return NextResponse.json({ error: 'leadId or opportunityId is required' }, { status: 400 });
  }

  const conditions: string[] = [];
  const replacements: Record<string, unknown> = {};
  if (leadId) { conditions.push('n.lead_id = :leadId'); replacements.leadId = Number(leadId); }
  if (opportunityId) { conditions.push('n.opportunity_id = :opportunityId'); replacements.opportunityId = Number(opportunityId); }

  const rows = await sequelize.query<any>(
    `SELECT
       n.id, n.lead_id, n.opportunity_id, n.counselor_id,
       n.conversation_summary, n.client_commitments, n.next_action, n.created_at,
       e.name AS counselorName
     FROM dm_opportunity_handover_notes n
     LEFT JOIN dm_employee e ON e.id = n.counselor_id
     WHERE ${conditions.join(' OR ')}
     ORDER BY n.created_at DESC`,
    { replacements, type: QueryTypes.SELECT }
  );

  return NextResponse.json({ data: rows });
}
