import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get the auth token from cookies
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token found' },
        { status: 401 }
      );
    }

    // Verify the JWT token
    const decoded = verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any;

    // Get user information
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        userTenants: {
          include: {
            tenant: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get the current tenant (from the token)
    const currentTenant = user.userTenants.find(ut => ut.tenantId === decoded.tenantId);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: decoded.role,
        tenant: {
          id: decoded.tenantId,
          name: currentTenant?.tenant.name,
          slug: decoded.tenantSlug
        }
      }
    });

  } catch (error) {
    console.error('Error fetching user info:', error);
    return NextResponse.json(
      { error: 'Invalid token or server error' },
      { status: 401 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
