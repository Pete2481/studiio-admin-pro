import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const tenantId = searchParams.get('tenantId');

    if (!clientId || !tenantId) {
      return NextResponse.json(
        { error: 'Client ID and Tenant ID are required' },
        { status: 400 }
      );
    }

    // Fetch galleries for the specific client within the tenant
    // Galleries are linked through bookings, so we need to find bookings first
    const clientBookings = await prisma.booking.findMany({
      where: {
        clientId: clientId,
        tenantId: tenantId
      },
      select: {
        id: true
      }
    });

    const bookingIds = clientBookings.map(booking => booking.id);

    const galleries = await prisma.gallery.findMany({
      where: {
        bookingId: {
          in: bookingIds
        },
        tenantId: tenantId
      },
      include: {
        booking: {
          include: {
            client: true
          }
        },
        images: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      galleries
    });

  } catch (error) {
    console.error('Error fetching client galleries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch galleries' },
      { status: 500 }
    );
  }
}
