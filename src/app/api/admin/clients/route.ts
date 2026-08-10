import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { DmClients } from '@/models';
import { createCrudHandlers } from '@/lib/apiCrud';
import { sequelize, connectDB } from '@/lib/sequelize';
import { requireAuth, isAuthError } from '@/lib/apiAuth';

let dbReady = false;
const ensureDB = async () => { if (!dbReady) { await connectDB(); dbReady = true; } };

const handlers = createCrudHandlers({
  model: DmClients,
  entityName: 'client',
  searchFields: ['first_name', 'last_name', 'email', 'city', 'nationality'],
  filters: {
    status: 'status',
    verification: 'verify',
  },
  defaults: (body) => ({
    created: body.created || new Date(),
    token_validity:
      body.token_validity || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  }),
});

type ClientListRow = {
  id: number;
  opportunityId: number | null;
  leadId: number;
  case_activated_at: Date | string | null;
  fname: string | null;
  lname: string | null;
  email: string | null;
  dob: Date | string | null;
  address: string | null;
  area: string | null;
  nationality: string | null;
  assignTo: number | null;
  branchName: string | null;
  branchAddress: string | null;
  branchEmail: string | null;
  branchMobile: string | null;
  branchLicenseNumber: string | null;
  branchVatGstPercent: number | null;
  branchBankName: string | null;
  branchBankAccountName: string | null;
  branchBankAccountNumber: string | null;
  branchBankIban: string | null;
  branchBankBranch: string | null;
};

// A lead becomes a formal "Client" once BOTH accounts (finance) verification
// and compliance verification are approved on its workflow review — see
// dm_opportunity_workflow_reviews.finance_status / .compliance_status, set via
// src/app/api/opportunities/[id]/workflow/route.ts. The legacy dm_clients
// table is never populated by any live code path, so GET reads from the
// workflow review directly instead (POST/PUT/DELETE below are left against
// dm_clients since nothing in the app currently exercises them).
export async function GET(request: NextRequest) {
  const auth = requireAuth(request, ['clients.view']);
  if (isAuthError(auth)) return auth;
  try {
    await ensureDB();
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number.parseInt(searchParams.get('limit') || '200', 10), 500);
    const search = searchParams.get('search') || '';

    const conditions = [
      `w.finance_status = 'approved'`,
      `w.compliance_status = 'approved'`,
      `TRIM(LOWER(COALESCE(o.status, ''))) IN ('won', 'closed won', 'close won')`,
    ];
    const replacements: Record<string, unknown> = { limit };
    if (search) {
      conditions.push(`(l.fname LIKE :search OR l.lname LIKE :search OR l.email LIKE :search)`);
      replacements.search = `%${search}%`;
    }

    const rows = await sequelize.query<ClientListRow>(
      `SELECT
         w.id, w.opportunity_id AS opportunityId, w.lead_id AS leadId, w.case_activated_at,
         l.fname, l.lname, l.email, l.dob, l.address, l.area, l.nationality, l.assignTo,
         b.name AS branchName, b.address AS branchAddress, b.email AS branchEmail,
         b.mobile AS branchMobile, b.license_number AS branchLicenseNumber, b.vat_gst_percent AS branchVatGstPercent,
         b.bank_name AS branchBankName, b.bank_account_name AS branchBankAccountName,
         b.bank_account_number AS branchBankAccountNumber, b.bank_iban AS branchBankIban, b.bank_branch AS branchBankBranch
       FROM dm_opportunity_workflow_reviews w
       INNER JOIN (
         SELECT wr.lead_id, MAX(wr.id) AS maxId
         FROM dm_opportunity_workflow_reviews wr
         JOIN dmc_opportunities owr ON owr.id = wr.opportunity_id
         WHERE wr.finance_status = 'approved' AND wr.compliance_status = 'approved'
           AND TRIM(LOWER(COALESCE(owr.status, ''))) IN ('won', 'closed won', 'close won')
         GROUP BY lead_id
       ) latest ON latest.maxId = w.id
       JOIN dmc_forum_leads l ON l.id = w.lead_id
       JOIN dmc_opportunities o ON o.id = w.opportunity_id
       LEFT JOIN dm_branch b ON l.branch = b.id
       WHERE ${conditions.join(' AND ')}
       ORDER BY w.case_activated_at DESC
       LIMIT :limit`,
      { replacements, type: QueryTypes.SELECT }
    );

    const data = rows.map((r) => ({
      id: r.id,
      opportunityId: r.opportunityId,
      leadId: r.leadId,
      first_name: r.fname || '',
      last_name: r.lname || '',
      email: r.email || '',
      image: '',
      dob: r.dob || new Date(0),
      address: r.address || '',
      full_address: r.address || '',
      token: '',
      token_validity: r.case_activated_at || new Date(0),
      verify: 1,
      password: '',
      hash_password: '',
      status: 1,
      accept: 1,
      created: r.case_activated_at || new Date(0),
      case_manager: r.assignTo || 0,
      backend_person: r.assignTo || 0,
      is_deleted: 0,
      city: r.area || '',
      nationality: r.nationality || '',
      branchName: r.branchName || '',
      branchAddress: r.branchAddress || '',
      branchEmail: r.branchEmail || '',
      branchMobile: r.branchMobile || '',
      branchLicenseNumber: r.branchLicenseNumber || null,
      branchVatGstPercent: r.branchVatGstPercent ?? null,
      branchBankName: r.branchBankName || null,
      branchBankAccountName: r.branchBankAccountName || null,
      branchBankAccountNumber: r.branchBankAccountNumber || null,
      branchBankIban: r.branchBankIban || null,
      branchBankBranch: r.branchBankBranch || null,
    }));

    return NextResponse.json({ data, pagination: { page: 1, limit, total: data.length, totalPages: 1 } });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
