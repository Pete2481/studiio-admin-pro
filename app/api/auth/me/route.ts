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

    const responseData: any = {
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
    };

    // Add client information if this is a client user
    if (decoded.role === "CLIENT" && decoded.clientId) {
      const client = await prisma.client.findUnique({
        where: { id: decoded.clientId }
      });
      if (client) {
        responseData.client = {
          id: client.id,
          name: client.name
        };
      }
    }

    return NextResponse.json(responseData);

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
