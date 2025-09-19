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

    // Check if user is a client
    if (decoded.role !== 'CLIENT' || !decoded.clientId) {
      return NextResponse.json(
        { error: 'Access denied. Client authentication required.' },
        { status: 403 }
      );
    }

    const clientId = decoded.clientId;
    const tenantId = decoded.tenantId;

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
