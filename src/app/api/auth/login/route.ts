import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Authenticate user using our auth system
    const authUser = await authenticateUser(username, password);
    
    if (!authUser) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

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
        photo: authUser.photo,
        wfh: authUser.wfh,
        permissions: authUser.permissions
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
