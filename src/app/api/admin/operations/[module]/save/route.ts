import { NextRequest, NextResponse } from 'next/server';
import { DmOperationStageData } from '@/models';
import { apiError, invalidRequest } from '@/lib/apiError';
import { QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';

const allowedModules = new Set([
  'business',
  'business-canada',
  'business-poland',
  'business-uk',
  'business-usa',
  'visit-visa',
  'student-visa',
  'skill-canada',
  'skill-australia',
  'skill-canada-pip',
  'poland-visa',
  'eip-canada',
  'europe-cases',
  'family-sponsorship',
  'ict-canada',
  'job-search',
  'portugal-business',
  'resume-canada',
  'work',
  'work-permit',
  'rms',
]);

type RouteContext = {
  params: Promise<{ module: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const operationsModule = params.module;

    if (!allowedModules.has(operationsModule)) {
      return invalidRequest('Unsupported operations module');
    }

    const body = await request.json();
    const leadId = Number.parseInt(String(body.leadId || ''), 10);
    const opportunityId = body.opportunityId === undefined || body.opportunityId === null || body.opportunityId === ''
      ? null
      : Number.parseInt(String(body.opportunityId), 10);
    const stage = String(body.stage || '').trim();

    if (!leadId || !stage) {
      return invalidRequest('leadId and stage are required');
    }

    if (opportunityId !== null && Number.isNaN(opportunityId)) {
      return invalidRequest('opportunityId must be a number');
    }

    if (opportunityId) {
      const verification = await sequelize.query<{ status: string }>(
        `SELECT status FROM dm_opportunity_accounting_verifications WHERE opportunity_id = :opportunityId LIMIT 1`,
        { replacements: { opportunityId }, type: QueryTypes.SELECT },
      ).catch(() => []);
      if (verification[0] && verification[0].status !== 'approved') {
        return NextResponse.json({ success: false, error: 'Accountant verification is required before Operations can begin.' }, { status: 409 });
      }
    }

    const stageData = JSON.stringify(body.data ?? {});
    const existing = await DmOperationStageData.findOne({
      where: {
        module: operationsModule,
        leadId,
        opportunityId,
        stage,
      },
    });

    const saved = existing
      ? await existing.update({ stageData })
      : await DmOperationStageData.create({
          module: operationsModule,
          leadId,
          opportunityId,
          stage,
          stageData,
        });

    return NextResponse.json({
      success: true,
      id: saved.id,
      module: operationsModule,
      leadId,
      opportunityId,
      stage,
    });
  } catch (error: unknown) {
    return apiError(error, 'Failed to save operations stage data');
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { module: operationsModule } = await context.params;
    if (!allowedModules.has(operationsModule)) {
      return invalidRequest('Unsupported operations module');
    }

    const { searchParams } = new URL(request.url);
    const leadId = Number.parseInt(searchParams.get('leadId') || '', 10);
    const rawOpportunityId = searchParams.get('opportunityId');
    const opportunityId = rawOpportunityId ? Number.parseInt(rawOpportunityId, 10) : null;
    if (!leadId || Number.isNaN(opportunityId)) {
      return invalidRequest('A valid leadId is required');
    }

    const rows = await DmOperationStageData.findAll({
      where: { module: operationsModule, leadId, opportunityId },
      order: [['updatedAt', 'DESC']],
    });
    const data = rows.reduce<Record<string, unknown>>((stages, row) => {
      const stage = row.getDataValue('stage');
      const stageData = row.getDataValue('stageData');
      try { stages[stage] = JSON.parse(stageData); }
      catch { stages[stage] = {}; }
      return stages;
    }, {});
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    return apiError(error, 'Failed to load operations stage data');
  }
}
