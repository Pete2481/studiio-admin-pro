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

    // Fetch bookings for the specific client within the tenant
    const bookings = await prisma.booking.findMany({
      where: {
        clientId: clientId,
        tenantId: tenantId
      },
      include: {
        client: true,
        agent: true,
        service: true,
        gallery: true
      },
      orderBy: {
        start: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      bookings
    });

  } catch (error) {
    console.error('Error fetching client bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
