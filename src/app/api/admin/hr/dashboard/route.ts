import { NextResponse } from 'next/server';
import { HRService } from '@/services/hr-service';

export async function GET() {
  try {
    return NextResponse.json(await HRService.getDashboardData());
  } catch (error) {
    console.error('Failed to build HR dashboard:', error);
    return NextResponse.json({ error: 'Failed to build HR dashboard' }, { status: 500 });
  }
}
