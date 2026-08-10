import { NextRequest, NextResponse } from 'next/server';
import { DmCountryProces } from '@/models/DmCountryProces';
import { requireAuth, isAuthError } from '@/lib/apiAuth';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (isAuthError(auth)) return auth;

    const countries = await DmCountryProces.findAll({
      where: {
        status: 1
      },
      order: [['name', 'ASC']]
    });

    return NextResponse.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}
