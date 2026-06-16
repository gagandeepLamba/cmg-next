import { NextRequest, NextResponse } from 'next/server';
import { DmService } from '@/models/DmService';

export async function GET() {
  try {
    const services = await DmService.findAll({
      where: {
        status: 1
      },
      order: [['name', 'ASC']]
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}
