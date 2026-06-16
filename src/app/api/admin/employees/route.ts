import { NextRequest, NextResponse } from 'next/server';
import { HRService } from '@/services/hr-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await HRService.listEmployees({
      page: Number.parseInt(searchParams.get('page') || '1', 10),
      limit: Number.parseInt(searchParams.get('limit') || '10', 10),
      search: searchParams.get('search') || undefined,
      department: searchParams.get('department') || undefined,
      status: searchParams.get('status') || undefined,
      workLocation: searchParams.get('work_location') || undefined,
      employmentType: searchParams.get('employment_type') || undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const employee = await HRService.createEmployee(body);
    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create employee';
    console.error('Error creating employee:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const id = Number.parseInt(String(body.id || ''), 10);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: 'Valid employee id is required' }, { status: 400 });
    }

    const employee = await HRService.updateEmployee({ ...body, id });
    if (!employee) return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    return NextResponse.json(employee);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update employee';
    console.error('Error updating employee:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number.parseInt(searchParams.get('id') || '', 10);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: 'Valid employee id is required' }, { status: 400 });
    }

    return NextResponse.json(await HRService.softDeleteEmployee(id));
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}
