import { NextRequest, NextResponse } from 'next/server';
import { DmProgramType } from '@/models/DmProgramType';

export async function GET() {
  try {
    const programs = await DmProgramType.findAll({
      where: {
        status: 1
      },
      order: [['type', 'ASC']]
    });

    return NextResponse.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}
