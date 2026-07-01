import { NextResponse } from 'next/server';
import { rolePermissionMatrix } from '@/lib/modulePermissions';

export async function GET() {
  return NextResponse.json({
    data: rolePermissionMatrix,
    columns: ['Role', 'Sales Module', 'Operations Module', 'HR Module', 'PRO Module', 'Admin'],
  });
}
