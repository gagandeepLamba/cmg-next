import { NextRequest, NextResponse } from 'next/server';
import { ClientPortalService } from '@/services/client-portal-service';
import { generateClientToken } from '@/lib/clientAuth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json() as Record<string, unknown>;
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const client = await ClientPortalService.authenticate(String(email).trim().toLowerCase(), String(password));
    if (!client) {
      return NextResponse.json({ error: 'Invalid credentials, or your case is no longer verified — please contact your counselor' }, { status: 401 });
    }

    const token = generateClientToken({ leadId: client.leadId, email: client.email, name: client.name });

    const response = NextResponse.json({
      client: { leadId: client.leadId, email: client.email, name: client.name, mustChangePassword: client.mustChangePassword },
    });

    response.cookies.set('client-auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 12 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Client portal login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
