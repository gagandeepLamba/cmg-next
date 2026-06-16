import { NextRequest, NextResponse } from 'next/server';
import { HRService } from '@/services/hr-service';

type LineItem = { label: string; amount: number };

const readString = (body: Record<string, unknown>, key: string) => (
  body[key] === undefined || body[key] === null ? '' : String(body[key]).trim()
);

const readNumber = (body: Record<string, unknown>, key: string, fallback = 0) => {
  const value = Number(body[key] ?? fallback);
  return Number.isFinite(value) ? value : fallback;
};

const readLineItems = (value: unknown): LineItem[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const label = readString(record, 'label');
      const amount = readNumber(record, 'amount');
      return label ? { label, amount } : null;
    })
    .filter((item): item is LineItem => Boolean(item));
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const payslips = await HRService.listPayslips({
      employeeId: searchParams.get('employee_id') || undefined,
      payYear: searchParams.get('pay_year') ? Number.parseInt(searchParams.get('pay_year') || '', 10) : undefined,
      payMonth: searchParams.get('pay_month') ? Number.parseInt(searchParams.get('pay_month') || '', 10) : undefined,
      limit: Number.parseInt(searchParams.get('limit') || '100', 10),
    });

    return NextResponse.json({ payslips });
  } catch (error) {
    console.error('Failed to fetch payslips:', error);
    return NextResponse.json({ error: 'Failed to fetch payslips' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const employeeId = readString(body, 'employee_id');
    const payYear = readNumber(body, 'pay_year');
    const payMonth = readNumber(body, 'pay_month');
    const basicSalary = readNumber(body, 'basic_salary');

    if (!employeeId) return NextResponse.json({ error: 'employee_id is required' }, { status: 400 });
    if (payYear < 2000) return NextResponse.json({ error: 'pay_year is invalid' }, { status: 400 });
    if (payMonth < 1 || payMonth > 12) return NextResponse.json({ error: 'pay_month must be 1-12' }, { status: 400 });
    if (basicSalary <= 0) return NextResponse.json({ error: 'basic_salary must be greater than zero' }, { status: 400 });

    const payslip = await HRService.generatePayslip({
      employee_id: employeeId,
      pay_year: payYear,
      pay_month: payMonth,
      designation: readString(body, 'designation') || null,
      department: readString(body, 'department') || null,
      basic_salary: basicSalary,
      allowances: readLineItems(body.allowances),
      overtime_hours: readNumber(body, 'overtime_hours'),
      overtime_amount: readNumber(body, 'overtime_amount'),
      deductions: readLineItems(body.deductions),
      bank_name: readString(body, 'bank_name') || null,
      iban: readString(body, 'iban') || null,
      ytd_earnings: readNumber(body, 'ytd_earnings'),
      authorised_by: readString(body, 'authorised_by') || null,
    });

    return NextResponse.json(payslip, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate payslip';
    console.error('Failed to generate payslip:', error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
