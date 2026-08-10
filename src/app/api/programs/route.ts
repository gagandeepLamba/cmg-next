import { NextRequest, NextResponse } from 'next/server';
import { DmProgramType } from '@/models/DmProgramType';
import { requireAuth, isAuthError } from '@/lib/apiAuth';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (isAuthError(auth)) return auth;

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
