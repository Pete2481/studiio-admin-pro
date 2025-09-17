import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        userTenants: {
          where: { role: 'CLIENT' },
          include: {
            tenant: {
              include: {
                clients: {
                  where: { isActive: true },
                  include: {
                    company: true,
                    _count: {
                      select: {
                        bookings: true,
                        invoices: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address' },
        { status: 404 }
      );
    }

    // Check if user has CLIENT role
    if (user.userTenants.length === 0) {
      return NextResponse.json(
        { error: 'You don\'t have client access' },
        { status: 403 }
      );
    }

    const tenantUser = user.userTenants[0];
    const clients = tenantUser.tenant.clients.map(client => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      tenantId: client.tenantId,
      role: 'CLIENT',
      _count: client._count
    }));

    return NextResponse.json({
      success: true,
      clients,
      tenant: {
        id: tenantUser.tenant.id,
        name: tenantUser.tenant.name,
        slug: tenantUser.tenant.slug
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Error fetching client options:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
