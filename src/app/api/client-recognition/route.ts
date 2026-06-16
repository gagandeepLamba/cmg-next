import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';

const toNumber = (value: unknown) => Number(value || 0);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'clients';

    switch (action) {
      case 'clients':
      case 'client_profiles':
        return NextResponse.json({
          success: true,
          data: await getClientProfiles({
            search: searchParams.get('search'),
            limit: Number(searchParams.get('limit') || 50),
          }),
        });

      case 'search_client':
      case 'client_history': {
        const email = searchParams.get('email');
        const clientId = searchParams.get('clientId') || searchParams.get('id');
        const profiles = await getClientProfiles({ email, clientId, limit: 1 });
        if (profiles.length === 0) {
          return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
        }

        const profile = profiles[0];
        return NextResponse.json({
          success: true,
          data: {
            clientProfile: profile,
            leads: await getClientLeads(profile.leadId, profile.email),
            contracts: await getClientAgreements(profile.leadId, profile.email),
          },
        });
      }

      case 'statistics':
        return NextResponse.json({ success: true, data: await getStatistics() });

      default:
        return NextResponse.json({
          success: true,
          message: 'Client recognition API uses live database data only.',
          actions: {
            clients: 'GET /api/client-recognition?action=clients',
            search_client: 'GET /api/client-recognition?action=search_client&email={clientEmail}',
            client_history: 'GET /api/client-recognition?action=client_history&clientId=123',
            statistics: 'GET /api/client-recognition?action=statistics',
            process_inquiry: 'Use POST /api/lead-intake to create live leads',
            generate_contract: 'Use POST /api/agreement-generation or /api/opportunity-agreements',
          },
        });
    }
  } catch (error: any) {
    console.error('Error in client recognition API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Client recognition request failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action;

    if (action === 'process_inquiry') {
      return NextResponse.json(
        {
          success: false,
          error: 'Client inquiry creation is handled by the live lead intake API.',
          nextApi: '/api/lead-intake',
        },
        { status: 400 }
      );
    }

    if (action === 'generate_contract') {
      return NextResponse.json(
        {
          success: false,
          error: 'Contract generation is handled by the live agreement APIs.',
          nextApis: ['/api/agreement-generation', '/api/opportunity-agreements'],
        },
        { status: 400 }
      );
    }

    if (action === 'update_client') {
      return NextResponse.json(
        {
          success: false,
          error: 'Client update is not enabled on this endpoint. Update the source lead/client record through its live module.',
        },
        { status: 501 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Unsupported action' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error in client recognition POST:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Client recognition request failed' },
      { status: 500 }
    );
  }
}

async function getClientProfiles(filters: {
  search?: string | null;
  email?: string | null;
  clientId?: string | null;
  limit?: number;
}) {
  const where: string[] = ['c.is_deleted = 0'];
  const replacements: Record<string, any> = {
    limit: Math.min(Math.max(filters.limit || 50, 1), 100),
  };

  if (filters.clientId) {
    where.push('c.id = :clientId');
    replacements.clientId = Number(filters.clientId);
  }

  if (filters.email) {
    where.push('LOWER(c.email) = LOWER(:email)');
    replacements.email = filters.email;
  }

  if (filters.search) {
    where.push('(LOWER(c.email) LIKE :search OR LOWER(c.first_name) LIKE :search OR LOWER(c.last_name) LIKE :search)');
    replacements.search = `%${filters.search.toLowerCase()}%`;
  }

  const rows = await sequelize.query<any>(
    `
      SELECT
        c.id,
        c.leadId,
        c.first_name,
        c.last_name,
        c.email,
        c.dob,
        c.address,
        c.full_address,
        c.status,
        c.verify,
        c.created,
        c.city,
        c.nationality,
        l.mobile,
        l.phone,
        COUNT(DISTINCT o.id) AS totalOpportunities,
        COUNT(DISTINCT a.id) AS totalContracts,
        COALESCE(SUM(DISTINCT a.totalAmount), 0) AS totalValue
      FROM dm_clients c
      LEFT JOIN dmc_forum_leads l ON l.id = c.leadId
      LEFT JOIN dmc_opportunities o ON o.leadId = c.leadId
      LEFT JOIN dm_opportunity_agreements a ON a.opportunityId = o.id
      WHERE ${where.join(' AND ')}
      GROUP BY c.id, c.leadId, c.first_name, c.last_name, c.email, c.dob, c.address, c.full_address,
        c.status, c.verify, c.created, c.city, c.nationality, l.mobile, l.phone
      ORDER BY c.created DESC
      LIMIT :limit
    `,
    { replacements, type: QueryTypes.SELECT }
  );

  return rows.map((row) => ({
    id: String(row.id),
    uniqueClientId: `CL-${row.id}`,
    leadId: row.leadId,
    email: row.email,
    personalInfo: {
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      phone: row.mobile || row.phone || '',
      dateOfBirth: row.dob,
      nationality: row.nationality,
      address: row.full_address || row.address,
      city: row.city,
    },
    metadata: {
      firstContactDate: row.created,
      lastContactDate: row.created,
      totalInteractions: toNumber(row.totalOpportunities),
      totalContracts: toNumber(row.totalContracts),
      totalValue: toNumber(row.totalValue),
      conversionRate: toNumber(row.totalContracts) > 0 ? 100 : 0,
      tags: [],
    },
    status: row.status === 1 ? 'active' : 'inactive',
    verified: row.verify === 1,
  }));
}

async function getClientLeads(leadId: number, email: string) {
  return sequelize.query(
    `
      SELECT id, fname, lname, email, mobile, phone, status, opportunity_status, service_interest, country_interest, regdate, created
      FROM dmc_forum_leads
      WHERE id = :leadId OR LOWER(email) = LOWER(:email)
      ORDER BY created DESC
      LIMIT 25
    `,
    { replacements: { leadId, email }, type: QueryTypes.SELECT }
  );
}

async function getClientAgreements(leadId: number, email: string) {
  return sequelize.query(
    `
      SELECT a.id, a.agreementNumber, a.agreementType, a.status, a.totalAmount, a.currency,
        a.generatedDate, a.signedDate, o.id AS opportunityId, o.leadId
      FROM dm_opportunity_agreements a
      INNER JOIN dmc_opportunities o ON o.id = a.opportunityId
      LEFT JOIN dmc_forum_leads l ON l.id = o.leadId
      WHERE o.leadId = :leadId OR LOWER(l.email) = LOWER(:email)
      ORDER BY a.createdAt DESC
      LIMIT 25
    `,
    { replacements: { leadId, email }, type: QueryTypes.SELECT }
  );
}

async function getStatistics() {
  const [summary] = await sequelize.query<any>(
    `
      SELECT
        COUNT(*) AS totalClients,
        SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS activeClients,
        SUM(CASE WHEN verify = 1 THEN 1 ELSE 0 END) AS verifiedClients
      FROM dm_clients
      WHERE is_deleted = 0
    `,
    { type: QueryTypes.SELECT }
  );

  const [agreements] = await sequelize.query<any>(
    `
      SELECT COUNT(*) AS totalContracts, COALESCE(SUM(totalAmount), 0) AS totalContractValue
      FROM dm_opportunity_agreements
    `,
    { type: QueryTypes.SELECT }
  );

  return {
    totalClients: toNumber(summary?.totalClients),
    activeClients: toNumber(summary?.activeClients),
    verifiedClients: toNumber(summary?.verifiedClients),
    totalContracts: toNumber(agreements?.totalContracts),
    totalContractValue: toNumber(agreements?.totalContractValue),
  };
}
