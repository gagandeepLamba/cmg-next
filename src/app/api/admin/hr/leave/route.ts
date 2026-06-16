import { NextRequest, NextResponse } from 'next/server';
import { HRService } from '@/services/hr-service';

const leaveTypes = [
  'Annual Leave',
  'Sick Leave',
  'Maternity Leave',
  'Paternity Leave',
  'Hajj Leave',
  'Bereavement Leave',
  'Unpaid Leave',
  'Compensatory Leave',
] as const;
const reviewStatuses = ['Approved', 'Rejected', 'Cancelled'] as const;

type LeaveType = typeof leaveTypes[number];
type ReviewStatus = typeof reviewStatuses[number];

const isLeaveType = (value: unknown): value is LeaveType => (
  typeof value === 'string' && leaveTypes.includes(value as LeaveType)
);

const isReviewStatus = (value: unknown): value is ReviewStatus => (
  typeof value === 'string' && reviewStatuses.includes(value as ReviewStatus)
);

const readString = (body: Record<string, unknown>, key: string) => (
  body[key] === undefined || body[key] === null ? '' : String(body[key]).trim()
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employee_id') || undefined;
    const year = Number.parseInt(searchParams.get('year') || String(new Date().getFullYear()), 10);
    const requests = await HRService.listLeaveManagementRequests({
      employeeId,
      status: searchParams.get('status') || undefined,
      year,
      limit: Number.parseInt(searchParams.get('limit') || '100', 10),
    });
    const balances = await HRService.getLeaveBalances(employeeId, year);

    return NextResponse.json({
      requests,
      balances,
      entitlements: HRService.getLeaveEntitlements(),
      legalBasis: 'UAE Labour Law leave entitlement tracking',
    });
  } catch (error) {
    console.error('Failed to fetch HR leave management data:', error);
    return NextResponse.json({ error: 'Failed to fetch HR leave management data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const employeeId = readString(body, 'employee_id');
    const startDate = readString(body, 'start_date');
    const endDate = readString(body, 'end_date');

    if (!employeeId) return NextResponse.json({ error: 'employee_id is required' }, { status: 400 });
    if (!isLeaveType(body.leave_type)) return NextResponse.json({ error: 'leave_type is invalid' }, { status: 400 });
    if (!startDate) return NextResponse.json({ error: 'start_date is required' }, { status: 400 });
    if (!endDate) return NextResponse.json({ error: 'end_date is required' }, { status: 400 });

    const created = await HRService.applyLeave({
      employee_id: employeeId,
      manager_id: readString(body, 'manager_id') || null,
      leave_type: body.leave_type,
      start_date: startDate,
      end_date: endDate,
      reason: readString(body, 'reason') || null,
      document_url: readString(body, 'document_url') || null,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to apply HR leave';
    console.error('Failed to apply HR leave:', error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const leaveId = readString(body, 'leave_id');
    const stage = readString(body, 'stage') || 'hr';

    if (!leaveId) return NextResponse.json({ error: 'leave_id is required' }, { status: 400 });

    if (stage === 'manager') {
      const managerStatus = body.manager_status;
      if (managerStatus !== 'Approved' && managerStatus !== 'Rejected') {
        return NextResponse.json({ error: 'manager_status must be Approved or Rejected' }, { status: 400 });
      }

      const updated = await HRService.reviewLeaveByManager({
        leave_id: leaveId,
        manager_status: managerStatus,
        manager_id: readString(body, 'manager_id') || null,
        manager_comment: readString(body, 'manager_comment') || null,
      });

      return NextResponse.json(updated);
    }

    if (!isReviewStatus(body.status)) return NextResponse.json({ error: 'status must be Approved, Rejected, or Cancelled' }, { status: 400 });

    const updated = await HRService.reviewLeave({
      leave_id: leaveId,
      status: body.status,
      reviewed_by: readString(body, 'reviewed_by') || null,
      review_notes: readString(body, 'review_notes') || null,
    });

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to review HR leave';
    console.error('Failed to review HR leave:', error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
