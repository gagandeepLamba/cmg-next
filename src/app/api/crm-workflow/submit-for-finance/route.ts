import { NextRequest, NextResponse } from 'next/server';
import { CrmWorkflowService } from '@/services/crm-workflow-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { opportunityId, leadId, officialId, discussionNotes, paymentInput, actorId, actorRole } = body;

    if (!opportunityId || !leadId) {
      return NextResponse.json(
        { success: false, error: 'opportunityId and leadId are required' },
        { status: 400 }
      );
    }

    if (!officialId) {
      return NextResponse.json(
        { success: false, error: 'Official ID data is required' },
        { status: 400 }
      );
    }

    if (!discussionNotes || discussionNotes.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one discussion note is required' },
        { status: 400 }
      );
    }

    if (!paymentInput) {
      return NextResponse.json(
        { success: false, error: 'Payment input data is required' },
        { status: 400 }
      );
    }

    const result = await CrmWorkflowService.submitForFinance({
      opportunityId,
      leadId,
      officialId,
      discussionNotes,
      paymentInput,
      actorId: actorId || 0,
      actorRole: actorRole || 'account_manager',
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      passportExpiryWarning: result.passportExpiryWarning || null,
    });
  } catch (error: any) {
    console.error('Error submitting for finance review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit for finance review: ' + error.message },
      { status: 500 }
    );
  }
}
