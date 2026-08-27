import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { checkRateLimit, recordFailedAttempt, clearRateLimit, getClientIp } from '@/lib/rateLimiter';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Keyed on IP + username so one attacker spamming a username from
    // elsewhere can't lock out the legitimate user, and a legitimate user's
    // own mistyped attempts don't affect other accounts.
    const rateLimitKey = `${getClientIp(request)}:${String(username).toLowerCase().trim()}`;
    const rateLimit = checkRateLimit(rateLimitKey);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { message: 'Too many login attempts. Please try again in a few minutes.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } }
      );
    }

    // Authenticate user using our auth system
    const authUser = await authenticateUser(username, password);

    if (!authUser) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    clearRateLimit(rateLimitKey);

    // Set HTTP-only cookie with token
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        cemail: authUser.cemail,
        role: authUser.role,
        branch: authUser.branch,
        region: authUser.region,
        type: authUser.type,
        roleName: authUser.roleName,
        photo: authUser.photo,
        wfh: authUser.wfh,
        permissions: authUser.permissions,
        mustChangePassword: authUser.mustChangePassword,
      },
    });

    // Set token in HTTP-only cookie
    response.cookies.set('auth-token', authUser.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}
