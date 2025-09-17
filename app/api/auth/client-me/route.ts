import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('client-auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No client authentication token' },
        { status: 401 }
      );
    }

    const decoded = verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any;

    return NextResponse.json({
      success: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      },
      client: {
        id: decoded.clientId
      },
      tenant: {
        id: decoded.tenantId,
        slug: decoded.tenantSlug
      }
    });

  } catch (error) {
    console.error('Error verifying client token:', error);
    return NextResponse.json(
      { error: 'Invalid client authentication token' },
      { status: 401 }
    );
  }
}
