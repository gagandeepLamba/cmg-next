import { NextRequest, NextResponse } from 'next/server';
import { DmOperationStageData } from '@/models';

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
  params: Promise<{ module: string }> | { module: string };
};

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const operationsModule = params.module;

    if (!allowedModules.has(operationsModule)) {
      return NextResponse.json(
        { success: false, error: 'Unsupported operations module' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const leadId = Number.parseInt(String(body.leadId || ''), 10);
    const opportunityId = body.opportunityId === undefined || body.opportunityId === null || body.opportunityId === ''
      ? null
      : Number.parseInt(String(body.opportunityId), 10);
    const stage = String(body.stage || '').trim();

    if (!leadId || !stage) {
      return NextResponse.json(
        { success: false, error: 'leadId and stage are required' },
        { status: 400 }
      );
    }

    if (opportunityId !== null && Number.isNaN(opportunityId)) {
      return NextResponse.json(
        { success: false, error: 'opportunityId must be a number' },
        { status: 400 }
      );
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
  } catch (error: any) {
    console.error('Operations stage save failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save operations stage data' },
      { status: 500 }
    );
  }
}
