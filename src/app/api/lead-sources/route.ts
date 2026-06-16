import { NextRequest, NextResponse } from 'next/server';
import { DmSource } from '@/models/DmSource';

export async function GET(request: NextRequest) {
  try {
    // Get all active lead sources
    const leadSources = await DmSource.findAll({
      where: {
        status: 1
      },
      order: [['name', 'ASC']],
      raw: true
    });

    return NextResponse.json(leadSources);
  } catch (error) {
    console.error('Error fetching lead sources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead sources' },
      { status: 500 }
    );
  }
}
