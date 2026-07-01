import { NextRequest, NextResponse } from 'next/server';
import { DiscountApprovalSystem } from '@/lib/discountApprovalSystem';

const discountSystem = new DiscountApprovalSystem();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const requestId = searchParams.get('requestId');
    const approverId = searchParams.get('approverId');
    const status = searchParams.get('status');
    const urgency = searchParams.get('urgency');
    const discountType = searchParams.get('discountType');

    switch (action) {
      case 'requests':
        const filters = {
          status: status || undefined,
          approverId: approverId ? parseInt(approverId) : undefined,
          urgency: urgency || undefined,
          discountType: discountType || undefined
        };
        const requests = discountSystem.getDiscountRequests(filters);
        return NextResponse.json({ success: true, data: requests });

      case 'request':
        if (!requestId) {
          return NextResponse.json({ success: false, error: 'Request ID is required' }, { status: 400 });
        }
        const allRequests = discountSystem.getDiscountRequests();
        const request = allRequests.find(r => r.id === requestId);
        if (!request) {
          return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: request });

      case 'approvers':
        const approvers = discountSystem.getApprovers();
        return NextResponse.json({ success: true, data: approvers });

      case 'rules':
        const rules = discountSystem.getDiscountRules();
        return NextResponse.json({ success: true, data: rules });

      case 'statistics':
        const statistics = discountSystem.getDiscountStatistics();
        return NextResponse.json({ success: true, data: statistics });

      case 'notifications':
        const notifications = discountSystem.getNotifications();
        return NextResponse.json({ success: true, data: notifications });

      default:
        return NextResponse.json({ 
          success: true, 
          data: {
            requests: discountSystem.getDiscountRequests(),
            approvers: discountSystem.getApprovers(),
            rules: discountSystem.getDiscountRules(),
            statistics: discountSystem.getDiscountStatistics()
          }
        });
    }
  } catch (error) {
    console.error('Discount API GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'create':
        const { 
          leadId, 
          leadName, 
          leadEmail, 
          leadPhone,
          productId, 
          productName, 
          originalPrice, 
          requestedDiscount, 
          discountType,
          discountReason, 
          urgency, 
          validityPeriod, 
          requestedBy 
        } = body;

        if (!leadId || !leadName || !leadEmail || !productId || !productName || 
            !originalPrice || !requestedDiscount || !discountReason || !urgency || 
            !validityPeriod || !requestedBy) {
          return NextResponse.json(
            { success: false, error: 'Missing required fields' },
            { status: 400 }
          );
        }

        const discountPercentage = (requestedDiscount / originalPrice) * 100;
        const finalPrice = originalPrice - requestedDiscount;

        const newRequest = await discountSystem.createDiscountRequest({
          leadId,
          leadName,
          leadEmail,
          leadPhone,
          productId,
          productName,
          originalPrice,
          requestedDiscount,
          discountPercentage,
          finalPrice,
          discountType: discountType || 'percentage',
          discountReason,
          urgency,
          validityPeriod,
          requestedBy
        });

        return NextResponse.json({ success: true, data: newRequest });

      case 'approve':
        const { requestId: approveRequestId, approverId: approveApproverId, comments, conditions } = body;
        
        if (!approveRequestId || !approveApproverId) {
          return NextResponse.json(
            { success: false, error: 'Request ID and Approver ID are required' },
            { status: 400 }
          );
        }

        const approvedRequest = await discountSystem.approveDiscountRequest(
          approveRequestId, 
          parseInt(approveApproverId), 
          comments, 
          conditions
        );

        return NextResponse.json({ success: true, data: approvedRequest });

      case 'reject':
        const { requestId: rejectRequestId, approverId: rejectApproverId, reason } = body;
        
        if (!rejectRequestId || !rejectApproverId || !reason) {
          return NextResponse.json(
            { success: false, error: 'Request ID, Approver ID, and rejection reason are required' },
            { status: 400 }
          );
        }

        const rejectedRequest = await discountSystem.rejectDiscountRequest(
          rejectRequestId, 
          parseInt(rejectApproverId), 
          reason
        );

        return NextResponse.json({ success: true, data: rejectedRequest });

      case 'update-rule':
        const { ruleId, updates } = body;
        
        if (!ruleId || !updates) {
          return NextResponse.json(
            { success: false, error: 'Rule ID and updates are required' },
            { status: 400 }
          );
        }

        discountSystem.updateDiscountRule(ruleId, updates);
        return NextResponse.json({ success: true, message: 'Rule updated successfully' });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Discount API POST error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'update-rule':
        const { ruleId, updates } = body;
        
        if (!ruleId || !updates) {
          return NextResponse.json(
            { success: false, error: 'Rule ID and updates are required' },
            { status: 400 }
          );
        }

        discountSystem.updateDiscountRule(ruleId, updates);
        return NextResponse.json({ success: true, message: 'Rule updated successfully' });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Discount API PUT error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
