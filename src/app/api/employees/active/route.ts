import { NextRequest, NextResponse } from 'next/server';
import { DmEmployee } from '@/models/DmEmployee';

export async function GET(request: NextRequest) {
  try {
    // Get all active employees for dropdown
    const employees = await DmEmployee.findAll({
      where: {
        status: 1
      },
      attributes: ['id', 'name', 'email', 'username'],
      order: [['name', 'ASC']],
      raw: true
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching active employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch active employees' },
      { status: 500 }
    );
  }
}
