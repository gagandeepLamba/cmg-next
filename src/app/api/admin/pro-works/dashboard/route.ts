import { NextResponse } from 'next/server';
import { PROService } from '@/services/pro-service';

export async function GET() {
  try {
    return NextResponse.json(await PROService.getDashboardData());
  } catch (error) {
    console.error('Failed to build PRO Works dashboard:', error);
    return NextResponse.json({ error: 'Failed to build PRO Works dashboard' }, { status: 500 });
  }
}
