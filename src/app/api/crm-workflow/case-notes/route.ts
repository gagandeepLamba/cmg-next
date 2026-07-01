import { NextRequest, NextResponse } from 'next/server';
import { CrmWorkflowService } from '@/services/crm-workflow-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { opportunityId, caseOfficerId, noteText } = body;

    if (!opportunityId || !caseOfficerId || !noteText) {
      return NextResponse.json(
        { success: false, error: 'opportunityId, caseOfficerId, and noteText are required' },
        { status: 400 }
      );
    }

    const result = await CrmWorkflowService.logCaseNote(opportunityId, caseOfficerId, noteText);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: 'Case note logged successfully' });
  } catch (error: any) {
    console.error('Error logging case note:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to log case note: ' + error.message },
      { status: 500 }
    );
  }
}
