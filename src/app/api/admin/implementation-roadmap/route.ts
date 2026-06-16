import { NextResponse } from 'next/server';
import { ImplementationRoadmapService } from '@/services/implementation-roadmap-service';

export async function GET() {
  return NextResponse.json(ImplementationRoadmapService.getRoadmap());
}
