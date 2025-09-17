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

    // Fetch invoices for the specific client within the tenant
    const invoices = await prisma.invoice.findMany({
      where: {
        clientId: clientId,
        tenantId: tenantId
      },
      include: {
        client: true,
        booking: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Convert amountCents to amount for easier frontend handling
    const invoicesWithAmount = invoices.map(invoice => ({
      ...invoice,
      amount: invoice.amountCents / 100
    }));

    return NextResponse.json({
      success: true,
      invoices: invoicesWithAmount
    });

  } catch (error) {
    console.error('Error fetching client invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}
