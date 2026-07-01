import { NextRequest, NextResponse } from 'next/server';
import { CrmWorkflowService } from '@/services/crm-workflow-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { opportunityId, caseOfficerId, actorId, actorRole } = body;

    if (!opportunityId || !caseOfficerId) {
      return NextResponse.json(
        { success: false, error: 'opportunityId and caseOfficerId are required' },
        { status: 400 }
      );
    }

    const result = await CrmWorkflowService.activateCase(
      opportunityId,
      caseOfficerId,
      actorId || 0,
      actorRole || 'admin'
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      clientId: result.clientId,
    });
  } catch (error: any) {
    console.error('Error activating case:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to activate case: ' + error.message },
      { status: 500 }
    );
  }
}
