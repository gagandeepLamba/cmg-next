import { NextRequest, NextResponse } from 'next/server';
import { CrmWorkflowService } from '@/services/crm-workflow-service';
import { requireAuth, isAuthError } from '@/lib/apiAuth';
import { isBranchManagerOrCeo } from '@/lib/roleChecks';

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (isAuthError(auth)) return auth;
    // Case activation is a managerial/CEO-tier step (it stands up the client
    // record and hands the case to a case officer), not a routine CRUD action.
    if (!isBranchManagerOrCeo(auth)) {
      return NextResponse.json({ success: false, error: 'Only a Branch Manager or the CEO can activate a case' }, { status: 403 });
    }

    const body = await request.json();
    const { opportunityId, caseOfficerId } = body;

    if (!opportunityId || !caseOfficerId) {
      return NextResponse.json(
        { success: false, error: 'opportunityId and caseOfficerId are required' },
        { status: 400 }
      );
    }

    const result = await CrmWorkflowService.activateCase(
      opportunityId,
      caseOfficerId,
      auth.id,
      auth.roleName || auth.type || 'admin'
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
