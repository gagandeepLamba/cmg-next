import { NextRequest, NextResponse } from 'next/server';
import { HRService } from '@/services/hr-service';

const separationReasons = ['Resignation', 'Termination', 'Retirement', 'Death', 'Mutual'] as const;
type SeparationReason = typeof separationReasons[number];

const isSeparationReason = (value: unknown): value is SeparationReason => (
  typeof value === 'string' && separationReasons.includes(value as SeparationReason)
);

const readString = (body: Record<string, unknown>, key: string) => (
  body[key] === undefined || body[key] === null ? '' : String(body[key]).trim()
);

const readNumber = (body: Record<string, unknown>, key: string) => {
  const value = Number(body[key] || 0);
  return Number.isFinite(value) ? value : 0;
};

const readPayload = (body: Record<string, unknown>) => {
  const employeeId = readString(body, 'employee_id');
  const lastWorkingDay = readString(body, 'last_working_day');
  const lastBasicSalary = readNumber(body, 'last_basic_salary');

  if (!employeeId) return { error: 'employee_id is required' };
  if (!lastWorkingDay) return { error: 'last_working_day is required' };
  if (!isSeparationReason(body.separation_reason)) return { error: 'separation_reason is invalid' };
  if (lastBasicSalary <= 0) return { error: 'last_basic_salary must be greater than zero' };

  return {
    payload: {
      employee_id: employeeId,
      last_working_day: lastWorkingDay,
      separation_reason: body.separation_reason,
      last_basic_salary: lastBasicSalary,
      unpaid_salary: readNumber(body, 'unpaid_salary'),
      approved_by: readString(body, 'approved_by'),
      settlement_date: readString(body, 'settlement_date') || null,
      notes: readString(body, 'notes') || null,
    },
  };
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const settlements = await HRService.listEOSBSettlements({
      employeeId: searchParams.get('employee_id') || undefined,
      limit: Number.parseInt(searchParams.get('limit') || '100', 10),
    });

    return NextResponse.json({
      settlements,
      rules: [
        '< 1 year: no EOSB entitlement',
        'Resignation 1-3 years: 21 days basic per year x 1/3',
        'Resignation 3-5 years: 21 days basic per year x 2/3',
        'Resignation > 5 years: 21 days basic per year x full',
        'Termination 1-5 years: 21 days basic per year',
        'Termination > 5 years: 21 days for first 5 years, 30 days thereafter',
        'Mutual: minimum legal entitlement, subject to agreement',
      ],
    });
  } catch (error) {
    console.error('Failed to fetch EOSB settlements:', error);
    return NextResponse.json({ error: 'Failed to fetch EOSB settlements' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const result = readPayload(body);
    if ('error' in result) return NextResponse.json({ error: result.error }, { status: 400 });

    const preview = await HRService.previewEOSBSettlement(result.payload);
    return NextResponse.json(preview);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to preview EOSB settlement';
    console.error('Failed to preview EOSB settlement:', error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const result = readPayload(body);
    if ('error' in result) return NextResponse.json({ error: result.error }, { status: 400 });
    if (!result.payload.approved_by) return NextResponse.json({ error: 'approved_by is required' }, { status: 400 });

    const settlement = await HRService.createEOSBSettlement(result.payload);
    return NextResponse.json(settlement, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create EOSB settlement';
    console.error('Failed to create EOSB settlement:', error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
